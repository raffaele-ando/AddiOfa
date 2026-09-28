"""
Studio / Inglese: due libri impilati con la bandiera del Regno Unito, per i due kit.

    python3 strumenti/brand/illustrazioni/studio_inglese.py        # scrive i due SVG in brand/disegni

Composizione e misure prese dall'originale (brand/elementi/…/studio-inglese.png); oggetti costruiti
da oggetti.py. Per cambiare colori o posizioni si cambiano i parametri qui sotto.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, sfocatura  # noqa: E402
from oggetti import libro, bandiera_uk  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (218, 151), "nuvola": "#F2F6FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(118, 72, 88, 60), (36, 102, 30, 30), (120, 120, 86, 24)],
        "libri": [  # dal basso in alto
            ("libro-giallo", V(114, 121), 24, {"chiaro": "#FEE3A8", "base": "#FDC460", "scuro": "#F2A73B", "pagine": "#E8ECF3", "righe": "#E2E8F0"}),
            ("libro-blu", V(114, 97), 22, {"chiaro": "#A9C5F9", "base": "#6F9BE6", "scuro": "#3569C9", "pagine": "#E8ECF3", "righe": "#E2E8F0"}),
        ],
        "u": V(73, -28), "v": V(-77, -34),
        "bandiera": (1, -0.194, 0.08, 1, 100, 17), "ombra_bandiera": (141, 68, 17, 4.5),
    },
}


def scena(k: dict) -> str:
    W, H = k["tela"]
    defs = [sfocatura("sfuma-ombra", 2, W, H)]
    corpo = [f'<g id="nuvola" fill="{k["nuvola"]}">' + "".join(
        f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>' for cx, cy, rx, ry in k["nuvola_forme"]) + "</g>"]
    F0 = k["libri"][0][1]
    corpo.append(f'<ellipse id="ombra" cx="{F0.x - 2}" cy="{F0.y + k["libri"][0][2] + 1}" rx="78" ry="4" fill="{k["ombra"]}" '
                 f'opacity="0.14" filter="url(#sfuma-ombra)"/>')
    for nome, F, sp, col in k["libri"]:
        d, c = libro(nome, F, k["u"], k["v"], sp, col)
        defs.append(d); corpo.append(c)
    cx, cy, rx, ry = k["ombra_bandiera"]
    corpo.append(f'<ellipse id="ombra-bandiera" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{k["ombra"]}" opacity="0.2" filter="url(#sfuma-ombra)"/>')
    d, c = bandiera_uk("bandiera", k["bandiera"])
    defs.append(d); corpo.append(c)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n'
            f'<title>Studio / Inglese</title>\n<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "studio-inglese.svg"
        f.write_text(scena(k))
        print(f)
