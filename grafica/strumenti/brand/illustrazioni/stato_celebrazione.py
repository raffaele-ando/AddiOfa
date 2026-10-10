"""
Stato / Celebrazione: fiocco rosso al centro con i coriandoli a raggiera (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_celebrazione.py

Difetti dell'originale corretti: al centro c'è un nastro sfocato che non si capisce cosa sia (un
anello con due code storte), i coriandoli sono macchie di forme diverse con gli aloni bianchi, il
coriandolo in alto è un'ovale quasi invisibile. Qui: un fiocco vero, simmetrico sull'asse CX (due
asole con l'interno in ombra, il nodo, due code con la punta a coda di rondine) e otto coriandoli a
pillola nelle stesse posizioni e negli stessi colori dell'originale, con le pendenze
dell'originale; ogni coriandolo ha il suo gruppo (`coriandolo-1` … `coriandolo-8`) per animarlo.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n  # noqa: E402
from oggetti_d import filtro_ombra, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 78, 81
CX, CY = 40.5, 38.5                         # asse del fiocco e centro della raggiera
ROSSO = ("#FF6A6E", "#F83D44", "#D9252F")
GIALLO = ("#FFD46E", "#FFBF3A", "#F5A524")
ARANCIO = ("#FFD699", "#FEC064", "#F5A73E")
PALLIDO = ("#FFEBD2", "#FFDDB2", "#FBCB91")
# coriandoli: (centro, lunghezza, larghezza, angolo in gradi, colori): posizioni, pendenze e colori
# dell'originale (non tutti a raggiera: così sembrano coriandoli che volano e non raggi di luce)
CORIANDOLI = [
    (V(23.5, 12.5), 12, 6.6, 45, GIALLO),
    (V(41, 7), 8.4, 6, 90, PALLIDO),
    (V(60, 13), 12, 6.6, -45, ROSSO),
    (V(12.8, 33), 11, 6.6, 22, GIALLO),
    (V(69.6, 35.2), 10.6, 6.2, -33, ARANCIO),
    (V(19, 57), 13, 6.8, -45, ROSSO),
    (V(62.6, 59.4), 12.4, 6.6, 43, ROSSO),
    (V(40.6, 67.8), 11.2, 6.4, -62, GIALLO),
]


def specchio(punti: list[V]) -> list[V]:
    return [V(2 * CX - q.x, q.y) for q in punti]


def fiocco() -> tuple[list[str], str]:
    defs = [lineare("fiocco-luce", V(CX - 13, CY - 10), V(CX + 13, CY + 10), [(0, ROSSO[0]), (0.5, ROSSO[1]), (1, ROSSO[2])]),
            lineare("coda-luce", V(0, CY), V(0, CY + 13), [(0, ROSSO[1]), (1, ROSSO[2])]),
            lineare("nodo-luce", V(CX - 3.5, CY - 4), V(CX + 3.5, CY + 4), [(0, ROSSO[0]), (1, ROSSO[1])])]
    g = []
    # code: una striscia dal nodo in giù, con la punta a coda di rondine
    for lato, s in (("sinistra", -1), ("destra", 1)):
        a, e = V(CX + s * 1.5, CY + 1), V(CX + s * 8.5, CY + 12.5)
        u = (e - a).uni(); p = u.perp() * 2.7
        pts = [a + p, e + p, e - u * 2.2, e - p, a - p]
        g.append(f'<path id="fiocco-coda-{lato}" d="{arrotondato(pts, [1, 0.8, 0.6, 0.8, 1])}" fill="url(#coda-luce)"/>')
    # asole: la destra costruita, la sinistra specchiata
    asola = [V(CX + 1.5, CY - 2.5), V(CX + 9.5, CY - 9.8), V(CX + 13, CY - 7.5), V(CX + 13, CY + 5.5), V(CX + 10, CY + 7.8),
             V(CX + 1.5, CY + 2.5)]
    raggi = [1.2, 3.4, 4.2, 4.2, 3.4, 1.2]
    dentro = [V(CX + 3, CY - 1.4), V(CX + 9.4, CY - 5.8), V(CX + 9.8, CY + 4.2), V(CX + 3, CY + 1.4)]
    for lato, pts, dp in (("destra", asola, dentro), ("sinistra", specchio(asola), specchio(dentro))):
        g.append(f'<path id="fiocco-asola-{lato}" d="{arrotondato(pts, raggi)}" fill="url(#fiocco-luce)"/>')
        g.append(f'<path id="fiocco-asola-{lato}-dentro" d="{arrotondato(dp, [0.8, 2.2, 2.2, 0.8])}" fill="{ROSSO[2]}" opacity="0.45"/>')
    # riflesso sull'asola sinistra (la luce viene da in alto a sinistra)
    g.append(f'<path id="fiocco-riflesso" d="M{n(CX - 10.5)} {n(CY - 5.5)} Q{n(CX - 11.2)} {n(CY - 1)} {n(CX - 10.4)} {n(CY + 3)}" '
             f'fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round"/>')
    g.append(f'<rect id="fiocco-nodo" x="{n(CX - 3.6)}" y="{n(CY - 4.2)}" width="7.2" height="8.4" rx="2.6" fill="url(#nodo-luce)"/>')
    g.append(f'<path id="fiocco-nodo-luce" d="M{n(CX - 1.6)} {n(CY - 2.4)} V{n(CY + 1)}" stroke="#FFFFFF" stroke-opacity="0.4" '
             f'stroke-width="1.1" stroke-linecap="round"/>')
    return defs, f'<g id="fiocco">{"".join(g)}</g>'


def coriandoli() -> tuple[list[str], str]:
    defs, g = [], []
    for i, (c, lung, larg, ang, col) in enumerate(CORIANDOLI, 1):
        defs.append(lineare(f"coriandolo-{i}-luce", V(-larg / 2, -larg / 2), V(larg / 2, larg / 2),
                            [(0, col[0]), (0.55, col[1]), (1, col[2])]))
        g.append(f'<g id="coriandolo-{i}" transform="translate({n(c.x)} {n(c.y)}) rotate({n(ang)})">'
                 f'<rect x="{n(-lung / 2)}" y="{n(-larg / 2)}" width="{n(lung)}" height="{n(larg)}" rx="{n(larg / 2)}" '
                 f'fill="url(#coriandolo-{i}-luce)"/></g>')
    return defs, f'<g id="coriandoli">{"".join(g)}</g>'


def scena() -> str:
    defs = [filtro_ombra(W, H, 1.3)]
    d1, fio = fiocco()
    d2, cor = coriandoli()
    corpo = [ombra("fiocco-ombra", CX, CY + 13, 11, 1.8, ROSSO[2], 0.18), cor, fio]
    return svg(W, H, "Stato / Celebrazione", defs + d1 + d2, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "celebrazione.svg"
    f.write_text(scena())
    print(f)
