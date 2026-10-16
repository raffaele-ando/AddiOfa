"""
Variante per il tema scuro dei disegni SVG (<nome>.svg -> <nome>.scuro.svg).

Fa tre cose, nell'ordine:
1. la nuvola chiara dello sfondo (<g id="nuvola">) diventa un alone appena percepibile;
   i bordini bianchi «…-alone» si nascondono (su fondo scuro sembrerebbero un'aureola);
2. `REGOLE`: ricolora a mano le parti che sul fondo scuro non reggono. Tre famiglie:
   - carte e fogli bianchi o azzurrini -> carta blu notte con un filo di bordo chiaro (nessun bianco abbagliante);
   - blu scuri (lente, manico, cornice dell'euro, attacco della lampadina) -> schiariti, perché sul fondo scuro sparivano;
   - anelli bianchi attorno ai bottoni (distintivi, orologio, cursore) -> del colore della carta, non più un'aureola bianca.
   Le regole usano gli id dei pezzi (ogni pezzo ne ha uno) e quelli dei gradienti: si cambia solo il colore, mai la forma.
3. nessun'altra modifica: gli id restano uguali, perché le animazioni a pezzi agganciano gli id.

    python3 strumenti/brand/scuro_svg.py            # tutti i disegni: <nome>.svg -> <nome>.scuro.svg
    (le icone «sfera» passano anche da `scuro_sfera`: vetro blu notte e oggetti bianchi -> carta blu)
"""
from __future__ import annotations

import pathlib
import re

BRAND = pathlib.Path(__file__).resolve().parents[2] / "brand"
OPACITA = 0.14

# --- tavolozza della carta scura -------------------------------------------------------------------------------
CARTA = "#1F305A"            # faccia di fogli, finestre, schede (più chiara della superficie dell'app #111A2E)
CARTA_ALTA = "#273B6C"       # sfumatura: parte alta
CARTA_BASSA = "#1B2A4F"      # sfumatura: parte bassa
CARTA_DIETRO = "#18274A"     # foglio sullo sfondo
BORDO = "#42609F"            # bordo sottile delle carte
RIGA = "#41629F"             # righe di testo disegnate (barre)
RIGA_DIETRO = "#34508C"
CASELLA = "#2F4679"          # caselle del calendario
ANELLO = CARTA               # anello attorno ai bottoni: come la carta, non bianco
SPESSORE = "#16223F"         # spessore (costa) di fogli e carte

# Ogni voce: id (di un elemento o di un gradiente) -> {attributo: valore} oppure, per un gradiente, lista dei colori delle fermate.
REGOLE: dict[str, dict[str, dict | list]] = {
    "accesso-bloccato": {
        "finestra-foglio": {"fill": CARTA, "stroke": BORDO},
        "capelli": {"fill": "#566C97"}, "frangia": {"fill": "#566C97"},
        "orologio-bordo": {"fill": ANELLO}, "orologio-quadrante": {"fill": "#EEF3FC"},
    },
    "attesa-caricamento": {
        "vetro-luce": ["#4A2B3C", "#6B3C50", "#4A2B3C"],
        "vetro": {"stroke": "#A8677A"},
        "vetro-riflesso": {"stroke-opacity": "0.4"},
    },
    "mancato-superamento": {
        "carta-luce": [CARTA_ALTA, CARTA_BASSA], "documento-carta": {"stroke": BORDO},
        "documento-riflesso": {"stroke-opacity": "0.18"},
        "lembo-luce": ["#3C5590", "#2B4175"],
        "righe-luce": ["#5A82D2", "#4C72C2"],
        "distintivo-bordo": {"fill": ANELLO},
    },
    "messaggi-supporto": {
        "bianco-luce": [CARTA_ALTA, CARTA_BASSA], "fumetto-bianco-sagoma": {"stroke": BORDO},
        "puntini-bianco": {"fill": "#78A3FA"},
    },
    "piano-studi-bloccato": {
        "foglio": {"fill": CARTA, "stroke": BORDO},
        "caselle": {"fill": CASELLA},
    },
    "quiz-test": {
        "foglio-dietro-carta": {"fill": CARTA_DIETRO, "stroke": RIGA_DIETRO},
        "foglio-luce": [CARTA_ALTA, CARTA_BASSA], "foglio-carta": {"stroke": BORDO},
        **{f"risposta-{n}-riga-{t}": {"stroke": RIGA} for n in (1, 2, 3) for t in ("lunga", "corta")},
    },
    "ricerca": {
        "anello-luce": ["#B6CBF0", "#6F9CE4", "#4378D2"],
        "manico-luce": ["#7396D9", "#5380CE", "#3F69B8"],
        "attacco-luce": ["#6A97E0", "#4A7AD0"],
        "vetro-luce": ["#F3F7FF", "#D3E1FA"],
    },
    "rischio-economico": {
        "banconota-fianco": {"fill": "#4E67A6"},
        "banconota-luce": [CARTA_ALTA, CARTA_BASSA], "banconota-faccia": {"stroke": BORDO},
        "banconota-riflesso": {"stroke-opacity": "0.18"},
        "euro-luce": ["#8CB1F2", "#6A98EA"],
        "angolare-basso-fianco": {"fill": "#3A66B8"}, "angolare-alto-fianco": {"fill": "#3A66B8"},
        "angolare-luce": ["#86AEF0", "#5E8FE4", "#4577D2"],
        "angolare-alto-luce": ["#86AEF0", "#5E8FE4", "#4577D2"],
    },
    "risultato-probabilita": {
        "binario-luce": ["#2B3858", "#232F4D"],
        "cursore-anello": {"fill": "#0F1729"},
    },
    "studio-inglese": {
        "libro-giallo-pagine-luce": ["#E9EEF8", "#C7D1E6"], "libro-blu-pagine-luce": ["#E9EEF8", "#C7D1E6"],
    },
    "suggerimenti-consigli": {
        "punta-luce": ["#5679AE", "#43649A"],
        "attacco-luce": ["#4C6EA4", "#8EABD6", "#4A6B9F"],
    },
    "superamento": {
        "dietro-luce": ["#22345F", "#1D2D55"], "foglio-dietro-carta": {"stroke": RIGA_DIETRO},
        **{f"foglio-dietro-riga-{n}": {"stroke": "#3A5798"} for n in range(1, 6)},
        "foglio-luce": [CARTA_ALTA, CARTA_BASSA], "foglio-carta": {"stroke": BORDO},
        **{f"foglio-riga-{n}": {"stroke": RIGA} for n in range(1, 6)},
        "distintivo-bordo": {"fill": ANELLO},
    },
    "verifica-utente": {
        "carta-luce": [CARTA_ALTA, CARTA_BASSA], "tessera-carta": {"stroke": BORDO},
        "tessera-riflesso": {"stroke-opacity": "0.2"},
        "foto": {"fill": "#142146"},
        **{f"riga-{n}": {"stroke": "#4A6EB8"} for n in (1, 2, 3)},
    },

    # --- illustrazioni portate dai concept (porta_in_disegni.py) ---
    "cappello-laurea-orologio": {
        "cronometro-quadrante": {"fill": "#EEF3FC"},
    },
    "composizione-tre": {
        "sagome-pallide": {"fill": CARTA_DIETRO, "opacity": "0.5"},
        "composizione-tre-i1-binario-luce": ["#2B3858", "#232F4D"], "composizione-tre-i1-cursore-anello": {"fill": "#0F1729"},
        "composizione-tre-i3-foglio": {"fill": CARTA, "stroke": BORDO}, "composizione-tre-i3-caselle": {"fill": CASELLA},
    },
    # kit luminoso (blu «vivo» del concept 17): stessa famiglia di regole, ids propri
    "kit-luminoso/accesso-bloccato": {
        "finestra-luce": [CARTA_ALTA, CARTA_BASSA], "finestra-spessore": {"fill": SPESSORE},
    },
    "kit-luminoso/attesa-caricamento": {
        "clessidra-vetro": {"fill": "#2B3F73"},
    },
    "kit-luminoso/mancato-superamento": {
        "foglio-luce": [CARTA_ALTA, CARTA, CARTA_BASSA], "foglio-destra-luce": [CARTA, CARTA_BASSA, CARTA_DIETRO],
        "foglio-spessore": {"fill": SPESSORE}, "foglio-destra-spessore": {"fill": SPESSORE},
        "foglio-faccia": {"stroke": BORDO}, "foglio-destra-faccia": {"stroke": BORDO},
        **{f"testo-riga-{n}": {"stroke": RIGA} for n in (1, 2, 3, 4)},
        "distintivo-bordo": {"fill": ANELLO},
    },
    "kit-luminoso/messaggi-supporto": {
        "fumetto-1-luce": [CARTA_ALTA, CARTA_BASSA],
    },
    "kit-luminoso/piano-studi-bloccato": {
        "corpo-luce": [CARTA_ALTA, CARTA_BASSA],
        **{f"casella-{n}": {"fill": CASELLA} for n in (11, 12, 13, 21, 22, 23)},
    },
    "kit-luminoso/quiz-test": {
        "foglio-dietro-luce": [CARTA_DIETRO, CARTA_DIETRO, CARTA_DIETRO], "foglio-luce": [CARTA_ALTA, CARTA, CARTA_BASSA],
        "foglio-dietro-spessore": {"fill": SPESSORE}, "foglio-spessore": {"fill": SPESSORE},
        "foglio-dietro-faccia": {"stroke": RIGA_DIETRO}, "foglio-faccia": {"stroke": BORDO},
        **{f"riga-{n}-{t}": {"stroke": RIGA} for n in (1, 2, 3) for t in ("lunga", "corta")},
    },
    "kit-luminoso/ricerca": {
        "lente-manico": {"stroke": "#6F9BE8"}, "lente-vetro-luce": ["#F3F7FF", "#D3E1FA"],
    },
    "kit-luminoso/risultato-probabilita": {
        "arco-binario-luce": ["#2B3858", "#232F4D"], "pallina-anello": {"fill": "#0F1729"}, "numero": {"fill": "#F2F6FF"},
    },
    "kit-luminoso/studio-inglese": {
        "libro-sotto-pagine-luce": ["#E9EEF8", "#C7D1E6"], "libro-sopra-pagine-luce": ["#E9EEF8", "#C7D1E6"],
    },
    "kit-luminoso/superamento": {
        "foglio-luce": [CARTA_ALTA, CARTA, CARTA_BASSA], "foglio-sinistra-luce": ["#22345F", "#1F305A", "#1B2A4F"],
        "foglio-spessore": {"fill": SPESSORE}, "foglio-faccia": {"stroke": BORDO}, "foglio-sinistra-faccia": {"stroke": RIGA_DIETRO},
        **{f"testo-riga-{n}": {"stroke": RIGA} for n in (1, 2, 3, 4, 5, 6)},
        "distintivo-bordo": {"fill": ANELLO},
    },
    "kit-luminoso/verifica-utente": {
        "carta-luce": [CARTA_ALTA, CARTA, CARTA_BASSA], "carta-spessore": {"fill": SPESSORE}, "carta-faccia": {"stroke": BORDO},
        "avatar-alone-tondo": {"fill": CARTA}, "avatar-testa-bordo": {"fill": CARTA}, "avatar-busto-bordo": {"fill": CARTA, "stroke": CARTA},
    },

    # --- varianti blu dei disegni del kit rosso (blu_da_rosso.py): stesse tre famiglie di regole ---
    "piano-superamento": {
        "foglio": {"fill": CARTA, "stroke": BORDO}, "foglio-dietro-destra": {"stroke": RIGA_DIETRO},
        "casella-1-3": {"fill": CASELLA}, "casella-2-2": {"fill": CASELLA}, "casella-2-3": {"fill": CASELLA},
        "dietro_rosa-luce": ["#22345F", "#1D2D55"], "anello-luce": ["#C9DAF8", "#9DB9EC"],
    },
    "simulazione-esame": {
        "foglio-luce": [CARTA_ALTA, CARTA_BASSA], "righe-testo": {"stroke": RIGA},
    },
    "rischio-economico-ali": {
        "faccia-luce": [CARTA_ALTA, CARTA_BASSA], "euro-luce": ["#B3CDF8", "#8FB4F2"],
        "ala-destra-forma": {"fill": "#DCE7FB"}, "ala-sinistra-forma": {"fill": "#DCE7FB"},
    },
    "progressi-statistiche-scheda": {
        "scheda-luce": [CARTA_ALTA, CARTA_BASSA], "scheda": {"stroke": BORDO}, "righe-testo": {"stroke": RIGA},
    },
    "quiz-test-lista": {
        "foglio-luce": [CARTA_ALTA, CARTA_BASSA], "foglio": {"stroke": BORDO},
        **{f"risposta-{n}-testo": {"stroke": RIGA} for n in ("a", "b", "c")}, "risposta-scelta-testo": {"stroke": RIGA},
    },
    "attesa": {
        "clessidra-vetro-luce": ["#2B3F73", "#3B5694", "#2B3F73"], "clessidra-vetro": {"stroke": "#7C9BDC"},
    },
    "documento-completato": {
        "foglio-luce": [CARTA_ALTA, CARTA_BASSA], "foglio-piega-luce": ["#3C5590", "#2B4175"], "foglio-carta": {"stroke": BORDO},
        "foglio-righe": {"fill": RIGA}, "badge-bordo": {"fill": ANELLO},
    },
    "documento-errore": {
        "foglio-luce": [CARTA_ALTA, CARTA_BASSA], "foglio-piega-luce": ["#3C5590", "#2B4175"], "foglio-carta": {"stroke": BORDO},
        "foglio-righe": {"fill": RIGA}, "badge-bordo": {"fill": ANELLO},
    },
    "documento-in-corso": {
        "foglio-luce": [CARTA_ALTA, CARTA_BASSA], "foglio-piega-luce": ["#3C5590", "#2B4175"], "foglio-carta": {"stroke": BORDO},
        "foglio-righe": {"fill": RIGA}, "badge-bordo": {"fill": ANELLO},
    },
    "messaggi": {
        "fumetto-centrale-luce": [CARTA_ALTA, CARTA, CARTA_BASSA], "fumetto-centrale-sagoma": {"stroke": BORDO},
    },
    "notifica": {
        "busta-luce": ["#2C4378", "#243865"], "lembo-luce": ["#3C5590", "#2F4A82"], "tasca-luce": ["#2A4070", "#223660"],
        "badge-bordo": {"fill": ANELLO},
    },
    "ricerca-scintille": {
        "anello-luce": ["#B6CBF0", "#6F9CE4", "#4378D2"], "manico-luce": ["#7396D9", "#4A74C4"],
        "vetro-luce": ["#F3F7FF", "#E1EBFB", "#D3E1FA"],
    },
    "vuoto": {
        "nuvola-luce": ["#2B4175", "#243865", "#1F305A"], "occhi": {"fill": "#A9C0EC"}, "bocca": {"stroke": "#A9C0EC"},
        "nuvola-riflesso": {"stroke-opacity": "0.25"},
    },
    "caricamento": {
        "fondo": {"fill-opacity": "0"}, "traccia-luce": ["#2B4175", "#34508C"],
    },
}


def _imposta(tag: str, attr: str, valore: str) -> str:
    if re.search(rf'\s{re.escape(attr)}="[^"]*"', tag):
        return re.sub(rf'(\s{re.escape(attr)}=)"[^"]*"', rf'\1"{valore}"', tag, count=1)
    return re.sub(r"(/?>)$", rf' {attr}="{valore}"\1', tag, count=1)


def _regola(svg: str, ident: str, cosa) -> str:
    if isinstance(cosa, list):  # fermate di un gradiente, nell'ordine
        m = re.search(rf'(<(?:linearGradient|radialGradient)\s[^>]*\bid="{re.escape(ident)}"[^>]*>)(.*?)(</(?:linearGradient|radialGradient)>)', svg, re.S)
        if not m:
            raise SystemExit(f"gradiente non trovato: {ident}")
        n = len(re.findall(r"<stop\b", m.group(2)))
        if n != len(cosa):
            raise SystemExit(f"gradiente {ident}: {n} fermate, {len(cosa)} colori")
        it = iter(cosa)
        corpo = re.sub(r'stop-color="[^"]*"', lambda _: f'stop-color="{next(it)}"', m.group(2))
        return svg[:m.start(2)] + corpo + svg[m.end(2):]
    m = re.search(rf'<[a-zA-Z]+\s[^>]*\bid="{re.escape(ident)}"[^>]*>', svg)
    if not m:
        raise SystemExit(f"elemento non trovato: {ident}")
    tag = m.group(0)
    for a, v in cosa.items():
        tag = _imposta(tag, a, v)
    return svg[:m.start()] + tag + svg[m.end():]


def scuro(svg: str, nome: str = "") -> str:
    def cambia(m):
        tag = m.group(0)
        tag = re.sub(r'\sopacity="[^"]*"', "", tag)
        return tag[:-1] + f' opacity="{OPACITA}">'
    # solo il primo gruppo (quello esterno): i gruppi dentro la nuvola hanno id che iniziano allo stesso modo
    svg = re.sub(r'<g id="(?:nuvola|sfondo)[^"]*"[^>]*>', cambia, svg, count=1)
    # i bordini bianchi che imitano i contorni dell'originale ("…-alone", "alone-bianco") su fondo
    # scuro sembrerebbero un'aureola: nel tema scuro non si vedono
    def nascondi(m):
        tag = re.sub(r'\sopacity="[^"]*"', "", m.group(0))
        return tag[:-1].rstrip("/") + (' opacity="0"/>' if tag.endswith("/>") else ' opacity="0">')
    svg = re.sub(r'<(?:g|path|rect|circle|ellipse|polygon)\s[^>]*?\bid="(?:alone-bianco|[^"]*-alone)"[^>]*>', nascondi, svg)
    for ident, cosa in REGOLE.get(nome, {}).items():
        svg = _regola(svg, ident, cosa)
    return svg


# --- icone «sfera»: vetro blu notte, con regole generali trovate per forma e non per nome -----------------------------
VETRO = ["#34497F", "#2B4075", "#243665", "#1D2C57"]       # disco della sfera, dal riflesso al bordo
OGGETTO_ALTO, OGGETTO_BASSO = "#3A5393", "#2E4580"        # oggetti bianchi dentro la sfera (schede, fumetti, persone)
RIVESTIMENTI_SFERA = {"bordo": {"stroke": "#4C6BB0"}, "bordo-esterno": {"stroke": "#33508F"},
                      "anello-interno": {"stroke": "#42609F", "opacity": "0.6"}, "banda-luce": {"opacity": "0.16"}}
CARTA_SFERA = {  # fill di oggetti bianchi che non hanno un gradiente (colonne, righe, code dei fumetti)
    "fumetto-bianco-coda": OGGETTO_BASSO, "ornamento": OGGETTO_BASSO,
    **{f"{p}-{n}": OGGETTO_ALTO for p in ("capitello", "base") for n in range(1, 6)},
    **{f"riga-{l}-{n}": "#4E70B8" for l in "abc" for n in (1, 2)},
}


def _chiaro(c: str) -> bool:
    return sum(int(c[i:i + 2], 16) for i in (1, 3, 5)) >= 590


# sfere dove l'oggetto bianco regge i segni blu scuri (euro, puntini, colonne): sul vetro scuro resta chiaro, come una carta bianca
SFERE_OGGETTO_CHIARO = {"sfera-costi", "sfera-faq", "sfera-polimi"}


def _gradiente_sfera(m: re.Match, oggetti_chiari: bool = False) -> str:
    testa, ident, corpo, coda = m.group(1), m.group(2), m.group(3), m.group(4)
    colori = re.findall(r'stop-color="(#[0-9A-Fa-f]{6})"', corpo)
    if not colori or "stop-opacity" in corpo or ident.endswith("-rd1") or len(set(colori)) == 1:
        return m.group(0)
    if ident.endswith("-rd2"):
        nuovi = (VETRO + [VETRO[-1]] * len(colori))[:len(colori)]
    elif all(_chiaro(c) for c in colori) and not oggetti_chiari:
        nuovi = [OGGETTO_ALTO] + [OGGETTO_BASSO] * (len(colori) - 1)
    else:
        return m.group(0)
    it = iter(nuovi)
    return testa + re.sub(r'stop-color="[^"]*"', lambda _: f'stop-color="{next(it)}"', corpo) + coda


def scuro_sfera(svg: str, nome: str = "") -> str:
    """Disco di vetro scuro; gradienti di oggetti chiari -> carta blu; bordi e anelli chiari -> filo blu."""
    chiari = nome in SFERE_OGGETTO_CHIARO
    svg = re.sub(r'(<(?:linearGradient|radialGradient)\s[^>]*\bid="([^"]+)"[^>]*>)(.*?)(</(?:linearGradient|radialGradient)>)',
                 lambda m: _gradiente_sfera(m, chiari), svg, flags=re.S)
    for ident, cosa in RIVESTIMENTI_SFERA.items():
        if re.search(rf'\bid="{ident}"', svg):
            svg = _regola(svg, ident, cosa)
    for ident, colore in ({} if chiari else CARTA_SFERA).items():
        if re.search(rf'\bid="{ident}"', svg):
            svg = _regola(svg, ident, {"fill": colore})
    return svg


def main():
    n = 0
    for f in sorted((BRAND / "disegni").rglob("*.svg")):
        if f.name.endswith((".maglie.svg", ".scuro.svg")) or "--" in f.name:
            continue
        dest = f.with_name(f.stem + ".scuro.svg")
        s = f.read_text()
        # le regole a mano valgono per i kit che l'app usa; il kit rosso (solo catalogo ?brand) resta con la sola nuvola.
        # Il kit luminoso ha gli stessi nomi del blu ma id diversi: le sue regole stanno sotto "kit-luminoso/<nome>".
        if "kit-blu" in f.parts:
            regole = f.stem
        elif "kit-luminoso" in f.parts:
            regole = f"kit-luminoso/{f.stem}"
        else:
            regole = ""
        scritto = scuro(s, regole)
        dest.write_text(scuro_sfera(scritto, f.stem) if f.stem.startswith("sfera-") else scritto)
        n += 1
        if 'id="nuvola' not in s and 'id="alone' not in s and 'id="sfondo' not in s:
            print("senza nuvola:", f.relative_to(BRAND))
    print(n, "varianti scure")


if __name__ == "__main__":
    main()
