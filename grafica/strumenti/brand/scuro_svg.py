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


def main():
    n = 0
    for f in sorted((BRAND / "disegni").rglob("*.svg")):
        if f.name.endswith((".maglie.svg", ".scuro.svg")) or "--" in f.name:
            continue
        dest = f.with_name(f.stem + ".scuro.svg")
        s = f.read_text()
        # le regole a mano valgono per il kit blu (quello che l'app usa); il kit rosso resta con la sola nuvola
        regole = f.stem if "kit-blu" in f.parts else ""
        dest.write_text(scuro(s, regole))
        n += 1
        if 'id="nuvola' not in s and 'id="alone' not in s and 'id="sfondo' not in s:
            print("senza nuvola:", f.relative_to(BRAND))
    print(n, "varianti scure")


if __name__ == "__main__":
    main()
