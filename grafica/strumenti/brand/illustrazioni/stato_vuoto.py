"""
Stato / Vuoto: nuvola triste (kit rosso, toni ardesia).

    python3 strumenti/brand/illustrazioni/stato_vuoto.py

Difetti dell'originale corretti: la nuvola ha le gobbe di misure e altezze diverse e le giunture
spigolose, la sfumatura è a chiazze, gli occhi sono uno più grande dell'altro, la bocca ha le
estremità di spessore diverso. Qui: nuvola simmetrica sull'asse CX (tre cerchi uniti da raccordi
concavi veri e fondo piatto), sfumatura dall'alto al basso, un riflesso, occhi uguali e bocca ad arco
di spessore costante, centrati sull'asse.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n  # noqa: E402
from oggetti_d import filtro_ombra, nuvola_morbida, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 103, 69
CX = 54                                     # asse di simmetria
FONDO = 62.5
GOBBA = (V(CX, 27.5), 25.5)                 # gobba centrale
LATO = (28.5, 17.5)                         # distanza dall'asse e raggio delle gobbe laterali
C = {"chiaro": "#EBF0FC", "base": "#E0E7F8", "scuro": "#D5DEF4", "occhi": "#3E5680", "bocca": "#566B94",
     "ombra": "#475569"}


def scena() -> str:
    dl, rl = LATO
    cerchi = [(V(CX - dl, FONDO - rl), rl), GOBBA, (V(CX + dl, FONDO - rl), rl)]
    defs = [filtro_ombra(W, H, 1.5),
            lineare("nuvola-luce", V(0, 2), V(0, FONDO), [(0, C["chiaro"]), (0.6, C["base"]), (1, C["scuro"])])]
    corpo = [ombra("nuvola-ombra", CX, FONDO + 0.8, 40, 2.2, C["ombra"], 0.16)]
    corpo.append(f'<path id="nuvola" d="{nuvola_morbida(cerchi, 4.5)}" fill="url(#nuvola-luce)"/>')
    # riflesso: arco sulla gobba centrale, in alto a sinistra
    g, R = GOBBA
    corpo.append(f'<path id="nuvola-riflesso" d="M{n(g.x - R * 0.72)} {n(g.y - R * 0.38)} A{n(R * 0.8)} {n(R * 0.8)} 0 0 1 '
                 f'{n(g.x - R * 0.2)} {n(g.y - R * 0.78)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" '
                 f'stroke-width="2.4" stroke-linecap="round"/>')
    # faccia, simmetrica sull'asse
    occhi = "".join(f'<ellipse id="occhio-{lato}" cx="{n(CX + s * 10)}" cy="32.6" rx="2.7" ry="3.2"/>'
                    for lato, s in (("sinistro", -1), ("destro", 1)))
    luci = "".join(f'<circle cx="{n(CX + s * 10 + 0.9)}" cy="31.4" r="0.8"/>' for s in (-1, 1))
    corpo.append(f'<g id="faccia"><g id="occhi" fill="{C["occhi"]}">{occhi}</g><g id="occhi-luce" fill="#FFFFFF" opacity="0.8">{luci}</g>'
                 f'<path id="bocca" d="M{n(CX - 7.2)} 46.4 C{n(CX - 5.6)} 41.2 {n(CX + 5.6)} 41.2 {n(CX + 7.2)} 46.4" fill="none" stroke="{C["bocca"]}" '
                 f'stroke-width="3.2" stroke-linecap="round"/></g>')
    return svg(W, H, "Stato / Vuoto", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "vuoto.svg"
    f.write_text(scena())
    print(f)
