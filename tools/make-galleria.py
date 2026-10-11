#!/usr/bin/env python3
"""Costruisce la Galleria dei design: docs/design/galleria.json + immagini -> app/dist-demo/galleria.html (file unico, immagini WebP incorporate).
Uso (dalla radice): python3 tools/make-galleria.py   Poi si pubblica con lo strumento Artifact."""
import base64, io, json, re, sys
from pathlib import Path
from PIL import Image

RADICE = Path(__file__).resolve().parents[1]
JSON_IN = RADICE / 'docs/design/galleria.json'
ATTUALE = RADICE / 'docs/design/attuale'
MODELLO = RADICE / 'tools/galleria/template.html'
USCITA = RADICE / 'app/dist-demo/galleria.html'
BUDGET = 13.0 * 1024 * 1024
# prefissi dei file in docs/design/attuale/ per ogni sezione
PREFISSI = {
    'home': ['home'], 'landing': ['landing'], 'funnel-onboarding': ['funnel-onboarding'],
    'risultato-calcolo': ['risultato-calcolo'], 'paywall-piani': ['paywall'],
    'simulazione-esito': ['simulazione'], 'statistiche-profilo': ['statistiche-profilo'],
}
NOMI = {
    'home': 'Home nell\'app', 'home-con-dati': 'Home con i dati dopo diagnostico e simulazioni', 'home-desktop': 'Home su desktop',
    'landing': 'Landing su telefono', 'landing-desktop': 'Landing su desktop',
    'funnel-onboarding': 'Domanda del diagnostico', 'risultato-calcolo': 'Risultato del diagnostico',
    'risultato-calcolo-b': 'Schermata di calcolo', 'paywall-piani': 'Pass e prezzo', 'paywall-blocco': 'Pass dopo la simulazione gratuita',
    'simulazione-scelta': 'Scelta del formato', 'simulazione-domanda': 'Domanda della simulazione', 'simulazione-esito': 'Esito della simulazione',
    'statistiche-profilo': 'Progressi',
}

def attuali_per(sezione):
    """Raggruppa i file 'attuale' di una sezione per nome base, con la versione chiara e scura."""
    out = {}
    for pre in PREFISSI.get(sezione, []):
        for f in sorted(ATTUALE.glob(pre + '*.png')):
            m = re.match(r'^(.*)-(chiaro|scuro)\.png$', f.name)
            if m: out.setdefault(m.group(1), {})[m.group(2)] = f
    return out

def converti(path, larg_max, qualita):
    im = Image.open(path)
    if im.mode in ('P', 'LA'): im = im.convert('RGBA')
    elif im.mode not in ('RGB', 'RGBA'): im = im.convert('RGB')
    w, h = im.size
    if w > larg_max: im = im.resize((larg_max, max(1, round(h * larg_max / w))), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=qualita, method=5)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(), w, h

def costruisci(dati, fattore):
    qualita = int(74 * fattore); imgs = {}; cache = {}; mancanti = []; sezioni = []; peso = 0
    def dim(path):
        w, h = Image.open(path).size; return w, h
    def immagine(path, larghezza_base):
        nonlocal peso
        chiave = (str(path), larghezza_base)
        if chiave not in cache:
            uri, w, h = converti(path, int(larghezza_base * fattore), qualita); cache[chiave] = (uri, w, h); peso += len(uri)
        return cache[chiave]
    for s in dati['sezioni']:
        varianti = []
        for v in s['varianti']:
            v = dict(v); stato = v.get('stato')
            if stato == 'attuale':
                gruppi = attuali_per(s['id'])
                if not gruppi: continue
                for base, versioni in gruppi.items():
                    nv = dict(v); nv['id'] = f"{s['id']}-attuale-{base}"; nv['titolo'] = NOMI.get(base, base); nv['fonte'] = 'App attuale · 400 px' if 'desktop' not in base else 'App attuale · 1280 px'
                    nv['note'] = nv.get('note') or "Schermata reale dell'app di oggi (versione dimostrativa)."
                    primo = versioni.get('chiaro') or versioni.get('scuro'); w, h = dim(primo)
                    base_w = 900 if w / h > 1.25 else 440
                    mappa = {}
                    for k, p in versioni.items(): mappa[k] = immagine(p, base_w)[0]
                    imgs[nv['id']] = mappa; nv['rapporto'] = round(h / w, 2); nv['largo'] = w / h > 1.25; varianti.append(nv)
                continue
            p = RADICE / v.get('immagine', '')
            if not v.get('immagine') or not p.is_file(): mancanti.append(v.get('id')); continue
            w, h = dim(p); base_w = 900 if w / h > 1.25 else 440
            imgs[v['id']] = immagine(p, base_w)[0]; v['rapporto'] = round(h / w, 2); v['largo'] = w / h > 1.25
            v.pop('immagine', None); varianti.append(v)
        if varianti:
            s2 = dict(s); s2['varianti'] = varianti; sezioni.append(s2)
    return sezioni, imgs, peso, mancanti

def main():
    dati = json.loads(JSON_IN.read_text(encoding='utf-8'))
    fattore = 1.0
    for _ in range(5):
        sezioni, imgs, peso, mancanti = costruisci(dati, fattore)
        if peso <= BUDGET: break
        fattore *= 0.85
    modello = MODELLO.read_text(encoding='utf-8')
    for s in sezioni:
        for v in s['varianti']: v.pop('immagine', None)
    html = modello.replace('__DATA__', json.dumps({'sezioni': sezioni}, ensure_ascii=False)).replace('__IMGS__', json.dumps(imgs))
    USCITA.parent.mkdir(parents=True, exist_ok=True); USCITA.write_text(html, encoding='utf-8')
    n = sum(len(s['varianti']) for s in sezioni)
    print(f"{len(sezioni)} sezioni, {n} varianti, {USCITA.stat().st_size/1048576:.1f} MB (fattore {fattore:.2f})")
    if mancanti: print('immagini mancanti:', mancanti)

if __name__ == '__main__': main()
