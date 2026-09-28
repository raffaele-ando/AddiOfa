"""
Superamento: foglio con le righe e il distintivo verde con la spunta, davanti a un secondo foglio
inclinato.

    python3 strumenti/brand/illustrazioni/superamento.py

Difetti dell'originale corretti: il foglio davanti non aveva contorno (bianco su bianco), le sue
righe erano storte e con passo irregolare, il foglio dietro era più piccolo, sfumato a chiazze e
spuntava con una linguetta senza senso sopra il foglio davanti; spunta sbavata con frange bianche.
Qui: due fogli con lo stesso formato, raccordi veri, bordo e ombra; righe a passo costante (quelle
accanto al distintivo più corte); distintivo tondo con bordo bianco e spunta disegnata.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_a import barra, distintivo, nuvola, ombra, rettangolo, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (207, 161), "nuvola": "#EFF4FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(140.5, 106.1, 66, 54.4), (65.5, 123, 65, 37.5), (133.5, 64.8, 41.1, 53.2), (74.6, 71.3, 65.4, 69.1)],
        # foglio davanti (x0, y0, x1, y1) e righe (lunghezze, prima riga, passo)
        "foglio": (66, 20, 170, 151), "raggio": 10, "bordo": "#DCE6FB",
        "righe": {"x": 90, "prima": 40, "passo": 20, "lunghezze": [44, 60, 36, 28, 22], "spessore": 7, "colore": "#D6E1FD"},
        # foglio dietro: stesso formato ridotto, centro e rotazione
        "dietro": {"centro": V(58, 92), "rotazione": -22, "misure": (78, 106), "colore": ("#E3EBFE", "#D3DFFD"),
                   "righe": "#BCCEFB", "bordo": "#CCDAFB"},
        "distintivo": (V(152, 104), 26.5, ("#4FD27E", "#27BD5D", "#1A9F4C")),
    },
}


def righe(nome: str, x: float, y0: float, passo: float, lunghezze, spessore: float, colore: str) -> str:
    return "".join(barra(f"{nome}-{i + 1}", V(x, y0 + i * passo), V(x + L, y0 + i * passo), spessore, colore)
                   for i, L in enumerate(lunghezze))


def scena(k: dict) -> str:
    W, H = k["tela"]
    x0, y0, x1, y1 = k["foglio"]
    d = k["dietro"]
    lw, lh = d["misure"]
    cd = d["centro"]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("foglio-luce", V(x0, y0), V(x1, y1), [(0, "#FFFFFF"), (1, "#F5F8FF")]),
            lineare("dietro-luce", V(-lw / 2, -lh / 2), V(lw / 2, lh / 2), [(0, d["colore"][0]), (1, d["colore"][1])])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    # foglio dietro, inclinato: disegnato in coordinate locali attorno al suo centro
    corpo.append(f'<g id="foglio-dietro" transform="translate({n(cd.x)} {n(cd.y)}) rotate({n(d["rotazione"])})">'
                 f'<path id="foglio-dietro-ombra" d="{rettangolo(-lw / 2 + 3, -lh / 2 + 6, lw - 6, lh - 3, 9)}" fill="{k["ombra"]}" opacity="0.1" filter="url(#sfuma-ombra)"/>'
                 f'<path id="foglio-dietro-carta" d="{rettangolo(-lw / 2, -lh / 2, lw, lh, 9)}" fill="url(#dietro-luce)" stroke="{d["bordo"]}" stroke-width="1"/>'
                 f'<g id="foglio-dietro-righe">' + righe("foglio-dietro-riga", -lw / 2 + 14, -lh / 2 + 22, 16, [48, 48, 44, 44, 40], 6.5, d["righe"]) + "</g></g>")
    # foglio davanti
    r = k["righe"]
    corpo.append(f'<g id="foglio">'
                 f'<path id="foglio-ombra" d="{rettangolo(x0 + 4, y0 + 7, x1 - x0 - 8, y1 - y0 - 5, k["raggio"])}" fill="{k["ombra"]}" opacity="0.13" filter="url(#sfuma-ombra)"/>'
                 f'<path id="foglio-carta" d="{rettangolo(x0, y0, x1 - x0, y1 - y0, k["raggio"])}" fill="url(#foglio-luce)" stroke="{k["bordo"]}" stroke-width="1.2"/>'
                 f'<g id="foglio-righe">' + righe("foglio-riga", r["x"], r["prima"], r["passo"], r["lunghezze"], r["spessore"], r["colore"]) + "</g></g>")
    # distintivo verde con la spunta
    c, rr, col = k["distintivo"]
    dd, cc = distintivo("distintivo", c, rr, col, "spunta", bordo=2.8, spessore_segno=6.2)
    defs.append(dd)
    corpo.append(ombra("distintivo-ombra", c.x + 1, c.y + rr - 1, rr * 0.8, 4, "#16A34A", 0.25))
    corpo.append(cc)
    return svg("Superamento", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "superamento.svg"
        f.write_text(scena(k))
        print(f)
