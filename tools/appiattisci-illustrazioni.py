#!/usr/bin/env python3
"""Appiattisce le copie dell'app di illustrazioni e glifi: niente gradienti, filtri, aloni né riflessi lucidi.

Cosa fa (su ogni .svg della cartella, in luogo; le sfere restano escluse)
  (a) GRADIENTI -> COLORE PIATTO. Ogni linearGradient e radialGradient viene tolto. Un fill o uno stroke url(#id) diventa
      il colore di UNO stop del gradiente, scelto così: lo stop con offset più vicino a 0,5 (la tinta del centro della
      sfumatura); a parità, il primo stop. Se lo stop ha stop-opacity < 1, quella diventa fill-opacity /
      stroke-opacity. Per gli id doppi vale la prima definizione, come fa il browser.
  (b) FILTRI. I <filter> (sfocature gaussiane) si tolgono, e con loro gli attributi filter=.
  (c) ALONI E OMBRE. Un elemento che aveva un filtro e che è un'ombra o un alone (opacità <= 0,35, oppure id con
      «ombra», «alone» o «alo») si elimina: senza sfocatura diventerebbe un cerchio o un'ellisse piatta.
  (d) ELEMENTI CHE ESISTEVANO SOLO PER LA SFUMATURA. Si eliminano: gli elementi il cui colore scelto ha opacità 0
      (una sfumatura che svanisce), gli id «riflesso» e «lucentezza» (riflessi lucidi), i gruppi <g> che restano vuoti.
  Non tocca: il logo, i gruppi <clipPath> e <mask> (le maschere restano come sono), i nomi degli id, il viewBox.
  Gli SVG trasformati portano il marcatore `<!--appiattito:v1-->` prima di `<svg`: un file che lo ha non si riprocessa.

Uso (dalla radice del repository)
  python3 tools/appiattisci-illustrazioni.py <cartella>           # trasforma in luogo e stampa il riepilogo
  python3 tools/appiattisci-illustrazioni.py <cartella> --prova   # non scrive nulla, stampa solo i conti
  Lo lancia tools/sincronizza-essenziali.sh su app/src/brand/essenziali/disegni e .../glifi, prima di ricolora-illustrazioni.py.
  Esce con codice 1 se resta un riferimento url(#...) a qualcosa che non è un gradiente (es. un pattern) o uno stile con url(.
"""
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

SVG_NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', SVG_NS)
MARCATORE = '<!--appiattito:v1-->'
CARTELLE_ESCLUSE = {'sfere'}                       # le sfere sono lucide per progetto: non si toccano
RE_URL = re.compile(r'url\(\s*[\'"]?#([^)\'"]+)[\'"]?\s*\)')
RE_OMBRA_ALONE = re.compile(r'(^|-)(ombra|alone|alo)(-|$)')
RE_RIFLESSO = re.compile(r'riflesso|lucentezza')
GRADIENTI = {'linearGradient', 'radialGradient'}


def locale(tag):
    return tag.split('}', 1)[1] if '}' in tag else tag


def opacita(el, nome='opacity'):
    try:
        return float(el.get(nome, '1'))
    except ValueError:
        return 1.0


def scegli_stop(gradiente):
    """Lo stop più vicino a metà (offset 0,5); a parità vince il primo. Ritorna (colore, opacità)."""
    stop = min(gradiente, key=lambda s: abs(s[0] - 0.5))
    return stop[1], stop[2]


def raccogli_gradienti(root):
    """id -> lista di stop (offset, colore, opacità). Vale la prima definizione di ogni id."""
    gradienti = {}
    for el in root.iter():
        if locale(el.tag) not in GRADIENTI or not el.get('id'):
            continue
        if el.get('id') in gradienti:
            continue
        stop = []
        for s in el:
            if locale(s.tag) != 'stop':
                continue
            try:
                off = float(s.get('offset', '0').rstrip('%')) / (100 if s.get('offset', '').endswith('%') else 1)
            except ValueError:
                off = 0.0
            col = (s.get('stop-color') or '#000000').strip().upper()
            stop.append((off, col, opacita(s, 'stop-opacity')))
        if stop:
            gradienti[el.get('id')] = stop
    return gradienti


def trasforma_file(testo, conteggi):
    """Ritorna il nuovo testo SVG (o None se il file non va toccato). Aggiorna i conteggi."""
    if MARCATORE in testo:
        return None
    root = ET.fromstring(testo)
    gradienti = raccogli_gradienti(root)
    padri = {figlio: padre for padre in root.iter() for figlio in padre}
    da_togliere = set()
    filtri_defs = set()

    for el in root.iter():
        tag = locale(el.tag)
        if tag == 'filter':
            filtri_defs.add(el)
            continue
        if tag in GRADIENTI:
            continue
        # (b) e (c): filtri
        if el.get('filter') is not None:
            id_el = el.get('id', '')
            if opacita(el) <= 0.35 or RE_OMBRA_ALONE.search(id_el) or id_el == 'nuvola':
                da_togliere.add(el)
                conteggi['ombre_aloni'] += 1
                continue
            del el.attrib['filter']
            conteggi['filtri_tolti'] += 1
        # (d): riflessi lucidi
        if RE_RIFLESSO.search(el.get('id', '')):
            da_togliere.add(el)
            conteggi['riflessi'] += 1
            continue
        # (a): fill e stroke che puntano a un gradiente
        invisibile = False
        for nome in ('fill', 'stroke'):
            val = el.get(nome)
            if not val or 'url(' not in val:
                continue
            m = RE_URL.fullmatch(val.strip())
            if not m:
                conteggi['non_gestiti'].append(f'{nome}="{val}" su {el.get("id", tag)}')
                continue
            stop = gradienti.get(m.group(1))
            if stop is None:
                conteggi['non_gestiti'].append(f'{nome}="{val}" su {el.get("id", tag)} (non è un gradiente)')
                continue
            colore, op = scegli_stop(stop)
            conteggi['gradienti_piatti'] += 1
            if op == 0:
                invisibile = True
                break
            el.set(nome, colore)
            if op < 1:
                el.set(f'{nome}-opacity', ('%g' % op))
        if invisibile:
            da_togliere.add(el)
            conteggi['sfumature_vuote'] += 1
            continue
        if el.get('style') and 'url(' in el.get('style'):
            conteggi['non_gestiti'].append(f'style con url su {el.get("id", tag)}')

    for el in da_togliere:
        padre = padri.get(el)
        if padre is not None:
            padre.remove(el)

    # gruppi rimasti vuoti (fuori da mask e clipPath)
    cambiato = True
    while cambiato:
        cambiato = False
        for padre in list(root.iter()):
            for figlio in list(padre):
                if locale(figlio.tag) == 'g' and len(figlio) == 0 and not (figlio.text or '').strip() \
                        and locale(padre.tag) not in ('mask', 'clipPath'):
                    padre.remove(figlio)
                    conteggi['gruppi_vuoti'] += 1
                    cambiato = True

    # gradienti e filtri tolti dalle defs; poi le defs che restano vuote
    for padre in list(root.iter()):
        for figlio in list(padre):
            if locale(figlio.tag) in GRADIENTI or figlio in filtri_defs:
                padre.remove(figlio)
                conteggi['gradienti_tolti' if locale(figlio.tag) in GRADIENTI else 'filtri_defs_tolti'] += 1
    for padre in list(root.iter()):
        for figlio in list(padre):
            if locale(figlio.tag) == 'defs' and len(figlio) == 0:
                padre.remove(figlio)

    out = ET.tostring(root, encoding='unicode')
    out = re.sub(r'\s*xmlns:ns0="[^"]*"', '', out)
    i = out.index('<svg')
    return out[:i] + MARCATORE + out[i:]


def svg_da_trattare(cartella):
    for p in sorted(cartella.rglob('*.svg')):
        if p.name.endswith('.maglie.svg'):
            continue
        if any(parte in CARTELLE_ESCLUSE for parte in p.relative_to(cartella).parts[:-1]):
            continue
        yield p


def main(argv):
    prova = '--prova' in argv
    argomenti = [a for a in argv if not a.startswith('--')]
    if len(argomenti) != 1:
        print(__doc__)
        return 2
    cartella = pathlib.Path(argomenti[0]).resolve()
    conteggi = {'file': 0, 'file_cambiati': 0, 'gradienti_piatti': 0, 'gradienti_tolti': 0, 'filtri_tolti': 0,
                'filtri_defs_tolti': 0, 'ombre_aloni': 0, 'riflessi': 0, 'sfumature_vuote': 0, 'gruppi_vuoti': 0,
                'non_gestiti': []}
    byte_prima = byte_dopo = 0
    for p in svg_da_trattare(cartella):
        testo = p.read_text(encoding='utf8')
        conteggi['file'] += 1
        nuovo = trasforma_file(testo, conteggi)
        if nuovo is None:
            continue
        conteggi['file_cambiati'] += 1
        byte_prima += len(testo.encode('utf8'))
        byte_dopo += len(nuovo.encode('utf8'))
        if not prova:
            p.write_text(nuovo, encoding='utf8')
    print(f'{cartella}: {conteggi["file"]} file, {conteggi["file_cambiati"]} trasformati'
          + (' (prova: nulla scritto)' if prova else ''))
    for chiave in ('gradienti_piatti', 'gradienti_tolti', 'filtri_tolti', 'filtri_defs_tolti', 'ombre_aloni',
                   'riflessi', 'sfumature_vuote', 'gruppi_vuoti'):
        print(f'  {chiave}: {conteggi[chiave]}')
    if byte_prima:
        print(f'  peso: {byte_prima / 1024:.0f} KB -> {byte_dopo / 1024:.0f} KB')
    if conteggi['non_gestiti']:
        print('  non gestiti (vanno rivisti a mano):')
        for riga in conteggi['non_gestiti'][:30]:
            print('   -', riga)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
