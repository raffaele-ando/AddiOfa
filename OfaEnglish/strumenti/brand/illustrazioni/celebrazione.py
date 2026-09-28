"""
Celebrazione: cono sparacoriandoli con i coriandoli (kit blu).

    python3 strumenti/brand/illustrazioni/celebrazione.py

Difetti dell'originale corretti: nella bocca del cono ci sono sgorbi bianchi senza senso, le fasce
del cono sono macchie dritte che non seguono la forma (in un cono vero sono anelli, curvi come la
bocca), i fianchi non sono tangenti all'ellisse della bocca, i coriandoli sono "noccioline" di
spessore variabile e con l'alone bianco. Qui il cono è costruito su un asse (punta -> bocca): i
fianchi sono tangenti alla bocca, le fasce sono sezioni del cono (ellissi scalate), i coriandoli
sono nastrini a S di spessore costante.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, p  # noqa: E402
from oggetti_b import svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 139, 116
C = {"cono": ("#FFDC96", "#FEC45A", "#FCAE3A"), "fascia": "#FCA530", "orlo": "#FFE7B3",
     "dentro": ("#2F66D1", "#4A80E2", "#6293EA")}

PUNTA = V(19.5, 104)           # centro della punta
BOCCA = V(62, 61.5)             # centro della bocca
R_BOCCA, r_BOCCA = 28.5, 12.5   # semiassi dell'ellisse della bocca (lungo il diametro, lungo l'asse)
R_PUNTA = 6                     # mezza larghezza della punta
FASCE = [(0.16, 0.33), (0.52, 0.69)]   # fasce scure, come frazione della lunghezza punta -> bocca

CORIANDOLI = [  # da, a, colore
    (V(29, 8), V(36, 19.5), "#FEBE4E"), (V(85.5, 6), V(83.5, 19.5), "#FDA328"),
    (V(62, 23), V(63, 35), "#3C7AFB"), (V(9.5, 37.5), V(21, 45), "#F74847"),
    (V(116.5, 26), V(108, 34), "#FEBE4E"), (V(84.5, 37), V(78, 46.5), "#3C7AFB"),
    (V(87.5, 57.5), V(98.5, 55.5), "#3C7AFB"), (V(118, 55), V(131, 53.5), "#5386F4"),
    (V(102.5, 77.5), V(115, 83), "#FEB030"), (V(88, 99.5), V(96, 109), "#FEBE4E"),
]

ASSE = (BOCCA - PUNTA).uni()
LATO = ASSE.perp()               # verso il basso a destra


def sezione(s: float, t: float) -> V:
    """Punto sulla sezione del cono alla frazione s (0 punta, 1 bocca), angolo t."""
    R = R_PUNTA + (R_BOCCA - R_PUNTA) * s
    r = r_BOCCA * R / R_BOCCA
    c = PUNTA + (BOCCA - PUNTA) * s
    return c + LATO * (R * math.cos(t)) - ASSE * (r * math.sin(t))


def tangente(lato: int) -> float:
    """Angolo del punto dell'ellisse della bocca dove il fianco del cono (dalla punta) è tangente."""
    migliore, tm = 1e9, 0.0
    for k in range(4000):
        t = (k / 4000) * 2 * math.pi
        q = sezione(1, t)
        dq = LATO * (-R_BOCCA * math.sin(t)) - ASSE * (r_BOCCA * math.cos(t))
        base = PUNTA + LATO * (lato * R_PUNTA)
        w = q - base
        err = abs(w.x * dq.y - w.y * dq.x) / (w.lung() * dq.lung())
        if (q - BOCCA).x * LATO.x + (q - BOCCA).y * LATO.y > 0 if lato > 0 else (q - BOCCA).x * LATO.x + (q - BOCCA).y * LATO.y < 0:
            if err < migliore:
                migliore, tm = err, t
    return tm


def arco(s: float, t0: float, t1: float, passi: int = 24) -> list[V]:
    return [sezione(s, t0 + (t1 - t0) * k / passi) for k in range(passi + 1)]


def curva(punti: list[V]) -> str:
    return " L".join(p(q) for q in punti)


def corpo_cono() -> str:
    """Sagoma del cono: punta arrotondata, fianchi tangenti, e la metà davanti dell'ellisse della bocca."""
    ta, tb = tangente(1), tangente(-1)
    # la metà visibile va da ta (lato destro) passando per sin(t) > 0 (verso la punta) fino a tb
    if tb < ta:
        tb += 2 * math.pi
    bordo = arco(1, ta, tb, 40)
    punta_d, punta_s = PUNTA + LATO * R_PUNTA, PUNTA - LATO * R_PUNTA
    # punta: mezzo cerchio verso -ASSE
    k = 0.5523 * R_PUNTA
    fondo = PUNTA - ASSE * R_PUNTA
    d = (f"M{p(bordo[0])} L{curva(bordo[1:])} L{p(punta_s)} "
         f"C{p(punta_s - ASSE * k)} {p(fondo - LATO * k)} {p(fondo)} "
         f"C{p(fondo + LATO * k)} {p(punta_d - ASSE * k)} {p(punta_d)} Z")
    return d


def fascia(s0: float, s1: float) -> str:
    """Anello del cono tra due sezioni: metà davanti della sezione s1, poi indietro sulla s0."""
    a = arco(s1, 0, math.pi, 30)
    b = arco(s0, math.pi, 0, 30)
    # allarga un filo oltre i fianchi: il ritaglio sulla sagoma lo pareggia
    a[0] = a[0] + LATO * 2; a[-1] = a[-1] - LATO * 2
    b[0] = b[0] - LATO * 2; b[-1] = b[-1] + LATO * 2
    return f"M{p(a[0])} L{curva(a[1:])} L{curva(b)} Z"


def bocca(R: float, r: float) -> str:
    """Ellisse della bocca come tracciato (ruotata come il cono)."""
    q = [BOCCA + LATO * (R * math.cos(t)) - ASSE * (r * math.sin(t)) for t in (2 * math.pi * k / 72 for k in range(72))]
    return f"M{p(q[0])} L{curva(q[1:])} Z"


def coriandolo(i: int, a: V, b: V, colore: str) -> str:
    """Nastrino a S: tratto di spessore costante con le estremità tonde."""
    d = b - a
    q = d.perp().uni() * (d.lung() * 0.17)
    c1, c2 = a + d * 0.33 + q, a + d * 0.67 - q
    return (f'<path id="coriandolo-{i + 1}" d="M{p(a)} C{p(c1)} {p(c2)} {p(b)}" stroke="{colore}" stroke-width="7" '
            f'stroke-linecap="round" fill="none"/>')


def scena() -> str:
    sx = PUNTA - LATO * R_BOCCA * 0.6
    dx = PUNTA + LATO * R_BOCCA * 0.6
    defs = [lineare("cono-luce", sx, dx, [(0, C["cono"][0]), (0.5, C["cono"][1]), (1, C["cono"][2])]),
            lineare("dentro-luce", BOCCA - ASSE * r_BOCCA, BOCCA + ASSE * r_BOCCA,
                    [(0, C["dentro"][0]), (0.6, C["dentro"][1]), (1, C["dentro"][2])]),
            f'<clipPath id="cono-forma"><path d="{corpo_cono()}"/></clipPath>']
    corpo = [f'<g id="coriandoli">{"".join(coriandolo(i, *c) for i, c in enumerate(CORIANDOLI))}</g>']
    g = [f'<path id="cono-corpo" d="{corpo_cono()}" fill="url(#cono-luce)"/>',
         f'<g id="cono-fasce" clip-path="url(#cono-forma)" fill="{C["fascia"]}" opacity="0.85">' +
         "".join(f'<path id="cono-fascia-{i + 1}" d="{fascia(a, b)}"/>' for i, (a, b) in enumerate(FASCE)) + "</g>"]
    # riflesso lungo il fianco in alto a sinistra
    r0 = PUNTA - LATO * (R_PUNTA * 0.45) + ASSE * 6
    r1 = BOCCA - LATO * (R_BOCCA * 0.62) - ASSE * (r_BOCCA * 1.15)
    g.append(f'<path id="cono-riflesso" d="M{p(r0)} L{p(r1)}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="3" '
             f'stroke-linecap="round" clip-path="url(#cono-forma)"/>')
    g.append(f'<path id="bocca-orlo" d="{bocca(R_BOCCA, r_BOCCA)}" fill="{C["orlo"]}"/>')
    g.append(f'<path id="bocca-dentro" d="{bocca(R_BOCCA - 2.4, r_BOCCA - 2)}" fill="url(#dentro-luce)"/>')
    # ombra dell'orlo dentro la bocca (il bordo più lontano fa ombra sull'interno)
    om = [BOCCA + LATO * ((R_BOCCA - 2.4) * math.cos(t)) - ASSE * ((r_BOCCA - 2) * math.sin(t))
          for t in (math.pi + math.pi * k / 30 for k in range(31))]
    g.append(f'<path id="bocca-ombra" d="M{p(om[0])} L{curva(om[1:])}" stroke="#1D4ED8" stroke-opacity="0.35" '
             f'stroke-width="2" fill="none" stroke-linecap="round"/>')
    corpo.append(f'<g id="cono">{"".join(g)}</g>')
    return svg(W, H, "Celebrazione", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-blu" / "illustrazioni" / "celebrazione.svg"
    f.write_text(scena())
    print(f)
