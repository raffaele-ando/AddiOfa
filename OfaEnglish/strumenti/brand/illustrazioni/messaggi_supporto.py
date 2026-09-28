"""
Messaggi / Supporto: due fumetti con i tre puntini (kit blu).

    python3 strumenti/brand/illustrazioni/messaggi_supporto.py

Difetti dell'originale corretti: il fumetto blu ha l'angolo in alto a sinistra "a gradini" (due
scalini bianchi dove si sovrappone al fumetto bianco), il fumetto bianco non ha bordo e si perde
nella nuvola, le code hanno i lati tremolanti, i puntini hanno misure un po' diverse e un alone
bianco. Qui: due fumetti come sagome uniche (rettangolo raccordato + coda), il blu davanti e intero
con un'ombra morbida sul bianco, puntini uguali in fila su una retta.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_b import fumetto, nuvola, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 141, 114
C = {"nuvola": "#F2F6FE", "bianco": ("#FFFFFF", "#EEF3FD"), "bordo": "#DBEAFE",
     "blu": ("#76A6FD", "#528FFD", "#3B76EC"), "puntini": "#4B84F8", "ombra": "#1D4ED8"}

BIANCO = (13, 9, 103, 70, 12)                  # x0 y0 x1 y1 raggio
CODA_BIANCO = (30, 46, V(31, 87))
BLU = (71, 46, 132, 96, 9)
CODA_BLU = (105, 121, V(120, 108))
PUNTINI_BIANCO = [(35, 40.5), (51, 40.5), (67, 40.5)], 5
PUNTINI_BLU = [(88.5, 71), (101.5, 71), (114.5, 71)], 4.3


def scena() -> str:
    defs = [sfocatura("sfuma-ombra", 2.2, W, H),
            lineare("bianco-luce", V(0, BIANCO[1]), V(0, CODA_BIANCO[2].y), [(0, C["bianco"][0]), (1, C["bianco"][1])]),
            lineare("blu-luce", V(BLU[0], BLU[1]), V(BLU[2], CODA_BLU[2].y),
                    [(0, C["blu"][0]), (0.5, C["blu"][1]), (1, C["blu"][2])])]
    corpo = [nuvola(C["nuvola"], [(71, 57, 66, 51), (34, 84, 28)])]
    # fumetto bianco, dietro
    x0, y0, x1, y1, r = BIANCO
    d = fumetto(x0, y0, x1, y1, r, CODA_BIANCO, r_coda=2.5, r_attacco=3)
    corpo.append(f'<path id="ombra-fumetto-bianco" d="{d}" fill="{C["ombra"]}" opacity="0.08" '
                 f'transform="translate(0 2.5)" filter="url(#sfuma-ombra)"/>')
    corpo.append(f'<g id="fumetto-bianco"><path id="fumetto-bianco-sagoma" d="{d}" fill="url(#bianco-luce)" '
                 f'stroke="{C["bordo"]}" stroke-width="1.2"/>')
    cs, rp = PUNTINI_BIANCO
    corpo.append(f'<g id="puntini-bianco" fill="{C["puntini"]}">' +
                 "".join(f'<circle id="puntino-bianco-{i + 1}" cx="{n(x)}" cy="{n(y)}" r="{n(rp)}"/>' for i, (x, y) in enumerate(cs))
                 + "</g></g>")
    # fumetto blu, davanti
    x0, y0, x1, y1, r = BLU
    d = fumetto(x0, y0, x1, y1, r, CODA_BLU, r_coda=2.5, r_attacco=3)
    corpo.append(f'<path id="ombra-fumetto-blu" d="{d}" fill="{C["ombra"]}" opacity="0.16" '
                 f'transform="translate(-1 3)" filter="url(#sfuma-ombra)"/>')
    corpo.append(f'<g id="fumetto-blu"><path id="fumetto-blu-sagoma" d="{d}" fill="url(#blu-luce)"/>')
    corpo.append(f'<path id="fumetto-blu-riflesso" d="M{x0 + 7} {y0 + 5} H{x1 - 12}" stroke="#FFFFFF" stroke-opacity="0.3" '
                 f'stroke-width="2.4" stroke-linecap="round"/>')
    cs, rp = PUNTINI_BLU
    corpo.append(f'<g id="puntini-blu" fill="#FFFFFF">' +
                 "".join(f'<circle id="puntino-blu-{i + 1}" cx="{n(x)}" cy="{n(y)}" r="{n(rp)}"/>' for i, (x, y) in enumerate(cs))
                 + "</g></g>")
    return svg(W, H, "Messaggi / Supporto", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-blu" / "illustrazioni" / "messaggi-supporto.svg"
    f.write_text(scena())
    print(f)
