"""
Rischio economico: mazzetta di banconote con l'euro che vola via con due ali (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_rischio_economico.py

Difetti dell'originale corretti: lo spessore della mazzetta è una "L" rossa che non torna (a
sinistra è spostata di 8 px, sotto di 25, e copre l'angolo della banconota di sopra), il bordo
della banconota è rosa sottile su due lati e rosso spesso sugli altri due, le ali sono diverse
(quella di destra sbiadita e più piccola), l'euro è sbavato e i tre trattini hanno lunghezze e
direzioni a caso; aloni bianchi sfrangiati ovunque. Qui: la banconota è un rettangolo girato
(CENTRO, ROTAZIONE) estruso lungo un solo vettore SPESSORE (i lati restano paralleli), una sola
sagoma con i raccordi veri, un bordo uguale sui quattro lati, «€» vero (Inter), due ali uguali
(una è lo specchio dell'altra) su un asse, tre trattini uguali a raggiera.
Parti animabili: ala-sinistra, ala-destra (battito), mazzetta, trattini.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, linea, lineare, n, p  # noqa: E402
from oggetti_b import svg  # noqa: E402
from testo_svg import tracciato  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 172, 150
C = {"faccia": ("#FFFFFF", "#FEEDED"), "bordo": "#F4454B", "orlo": "#FCA5A5",
     "lato-sinistro": ("#F24C52", "#D8252E"), "lato-sotto": ("#FA6167", "#E7343C"),
     "euro": ("#FA4046", "#E3242B"), "ala": "#F4424A", "ala-fondo": "#FFFFFF", "trattini": "#F5343B"}

CENTRO, ROTAZIONE = V(105, 66), -26          # centro della faccia di sopra, rotazione in gradi
MEZZI = (38.5, 39)                             # mezza larghezza e mezza altezza della banconota
SPESSORE = V(-6.5, 25)                        # estrusione della mazzetta (verso il basso, un po' a sinistra)
ALI = {"centro": V(87, 71), "asse": -18, "distanza": 62, "scala": 0.95}
TRATTINI = {"distanza": 67, "lunghezza": 12.5, "angoli": [214, 237, 45.5]}   # angoli sullo schermo (y in giù)

u = V(math.cos(math.radians(ROTAZIONE)), math.sin(math.radians(ROTAZIONE)))
v = u.perp()                                   # perpendicolare, verso il basso


def punto(x: float, y: float) -> V:
    """Da coordinate della banconota (centro 0 0, x lungo il lato di sopra) allo schermo."""
    return CENTRO + u * x + v * y


def ala(nome: str, lato: int) -> str:
    """Ala a tre piume, disegnata per la sinistra (si allunga verso -x) e specchiata per la destra.
    La radice (x = 0) sta dietro la mazzetta."""
    d = ("M4 -12 C-8 -26 -36 -30 -47 -15 "
         "C-54 -4 -46 7 -36 4 "
         "C-38 14 -26 19 -19 11 "
         "C-19 20 -6 22 -1 12 Z")
    a = ALI
    w = V(math.cos(math.radians(a["asse"])), math.sin(math.radians(a["asse"])))
    radice = a["centro"] + w * (lato * (a["distanza"] - 24))
    s = a["scala"]
    return (f'<g id="{nome}" transform="translate({n(radice.x)} {n(radice.y)}) rotate({a["asse"]}) scale({n(-s if lato > 0 else s)} {n(s)})">'
            f'<path id="{nome}-forma" d="{d}" fill="{C["ala-fondo"]}" stroke="{C["ala"]}" stroke-width="2.8" stroke-linejoin="round"/>'
            f'</g>')


def scena() -> str:
    a, b = MEZZI
    TL, TR, BR, BL = punto(-a, -b), punto(a, -b), punto(a, b), punto(-a, b)
    e = SPESSORE
    sagoma = arrotondato([TL, TR, BR, BR + e, BL + e, TL + e], [6, 7, 6, 5, 6, 5])
    faccia = arrotondato([TL, TR, BR, BL], [6, 7, 6, 6])
    defs = [f'<clipPath id="mazzetta-forma"><path d="{sagoma}"/></clipPath>',
            lineare("faccia-luce", TL, BR, [(0, C["faccia"][0]), (1, C["faccia"][1])]),
            lineare("lato-sinistro-luce", TL, BL + e, [(0, C["lato-sinistro"][0]), (1, C["lato-sinistro"][1])]),
            lineare("lato-sotto-luce", BL, BR + e, [(0, C["lato-sotto"][0]), (1, C["lato-sotto"][1])]),
            lineare("euro-luce", V(0, -16), V(0, 16), [(0, C["euro"][0]), (1, C["euro"][1])])]
    corpo = []
    # trattini d'allarme a raggiera, tutti uguali
    t = TRATTINI
    tr = []
    for i, ang in enumerate(t["angoli"]):
        d = V(math.cos(math.radians(ang)), math.sin(math.radians(ang)))
        q = CENTRO + e * 0.3 + d * t["distanza"]
        tr.append(f'<path id="trattino-{i + 1}" d="{linea(q - d * (t["lunghezza"] / 2), q + d * (t["lunghezza"] / 2))}"/>')
    corpo.append(f'<g id="trattini" stroke="{C["trattini"]}" stroke-width="5" stroke-linecap="round">{"".join(tr)}</g>')
    # ali dietro la mazzetta
    corpo.append(ala("ala-destra", 1))
    corpo.append(ala("ala-sinistra", -1))
    g = [f'<path id="mazzetta-sagoma" d="{sagoma}" fill="url(#lato-sotto-luce)"/>']
    # lato sinistro, un tono più scuro (ritagliato sulla sagoma, così gli angoli restano tondi)
    g.append(f'<path id="lato-sinistro" d="M{p(TL)} L{p(BL)} L{p(BL + e)} L{p(TL + e - u * 4)} L{p(TL - u * 4)} Z" '
             f'fill="url(#lato-sinistro-luce)" clip-path="url(#mazzetta-forma)"/>')
    # banconote impilate: righe chiare parallele ai bordi, su tutti e due i lati
    righe = []
    for f in (0.36, 0.68):
        righe.append(linea(TL + e * f + u * 3, BL + e * f, BR + e * f - u * 3))
    g.append(f'<path id="mazzetta-righe" d="{" ".join(righe)}" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1" '
             f'stroke-linejoin="round" fill="none" clip-path="url(#mazzetta-forma)"/>')
    # spigolo verticale arrotondato (dove si incontrano i due lati): un filo di luce
    g.append(f'<path id="mazzetta-spigolo" d="{linea(BL + e * 0.12, BL + e * 0.86)}" stroke="#FFFFFF" stroke-opacity="0.3" '
             f'stroke-width="1.2" stroke-linecap="round"/>')
    # faccia di sopra: la banconota
    g.append(f'<path id="banconota" d="{faccia}" fill="url(#faccia-luce)" stroke="{C["orlo"]}" stroke-width="1"/>')
    ri = 6
    cornice = arrotondato([punto(-a + ri, -b + ri), punto(a - ri, -b + ri), punto(a - ri, b - ri), punto(-a + ri, b - ri)], 4)
    g.append(f'<path id="banconota-cornice" d="{cornice}" stroke="{C["bordo"]}" stroke-width="2.4" fill="none"/>')
    g.append(f'<g id="banconota-borchie" fill="{C["bordo"]}">' + "".join(
        f'<circle cx="{n(q.x)}" cy="{n(q.y)}" r="3.4"/>' for q in (punto(-a + ri, -b + ri), punto(a - ri, -b + ri),
                                                                   punto(a - ri, b - ri), punto(-a + ri, b - ri))) + "</g>")
    euro = tracciato("€", 800, 42, 0, 15, centro=True)
    g.append(f'<path id="euro" d="{euro}" fill="url(#euro-luce)" transform="translate({n(CENTRO.x)} {n(CENTRO.y)}) rotate({ROTAZIONE})"/>')
    corpo.append(f'<g id="mazzetta">{"".join(g)}</g>')
    return svg(W, H, "Rischio economico", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "rischio-economico.svg"
    f.write_text(scena())
    print(f)
