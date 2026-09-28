"""
Studio / Inglese: due libri impilati con la bandiera del Regno Unito, per i due kit.

Kit rosso: altra inquadratura (libri rosa, dorso a sinistra, bandiera a destra, niente nuvola).
Difetti dell'originale corretti lì: bandiera con le diagonali rosse centrate e i bracci storti,
libri con la copertina che non sporge dal blocco pagine, dorso piatto a fasce, scritte nere
tagliate in cima (residuo del foglio del kit).

    python3 strumenti/brand/illustrazioni/studio_inglese.py        # scrive i due SVG in brand/disegni

Composizione e misure prese dall'originale (brand/elementi/…/studio-inglese.png); oggetti costruiti
da oggetti.py. Per cambiare colori o posizioni si cambiano i parametri qui sotto.
"""
from __future__ import annotations

import pathlib
import re
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, sfocatura  # noqa: E402
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
    "kit-rosso": {
        "tela": (168, 164), "nuvola": "#FEF1F1", "ombra": "#DC2626",
        "nuvola_forme": [],                      # l'originale non ha la nuvola
        "libri": [  # dal basso in alto
            ("libro-sotto", V(78, 134), 19, {"chiaro": "#FFC4C6", "base": "#FEA3A7", "scuro": "#FB858A", "pagine": "#F6E9EA", "righe": "#F9DCDE"}),
            ("libro-sopra", V(80, 111), 17, {"chiaro": "#FFA7AA", "base": "#FE7C81", "scuro": "#EE3037", "pagine": "#F6E9EA", "righe": "#F9DCDE",
                                             "dorso": ("#FE4A51", "#E9262E")}),
        ],
        "u": V(68, -30), "v": V(-67, -43),
        "ombra_libri": (-4, 2, 70),
        "bandiera": (0.97, -0.095, 0.04, 1, 88.5, 37), "ombra_bandiera": (124, 84, 30, 4),
    },
}


def scena(k: dict) -> str:
    W, H = k["tela"]
    defs = [sfocatura("sfuma-ombra", 2, W, H)]
    corpo = [f'<g id="nuvola" fill="{k["nuvola"]}">' + "".join(
        f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>' for cx, cy, rx, ry in k["nuvola_forme"]) + "</g>"]
    F0 = k["libri"][0][1]
    dx, dy, rx = k.get("ombra_libri", (-2, 1, 78))
    corpo.append(f'<ellipse id="ombra" cx="{F0.x + dx}" cy="{F0.y + k["libri"][0][2] + dy}" rx="{rx}" ry="4" fill="{k["ombra"]}" '
                 f'opacity="0.14" filter="url(#sfuma-ombra)"/>')
    for nome, F, sp, col in k["libri"]:
        d, c = libro(nome, F, k["u"], k["v"], sp, col)
        if "dorso" in col:   # dorso di un colore suo (più scuro della copertina), al posto di base -> scuro
            d = re.sub(rf'<linearGradient id="{nome}-dorso-luce".*?</linearGradient>',
                       lineare(f"{nome}-dorso-luce", F, F + V(0, sp), [(0, col["dorso"][0]), (1, col["dorso"][1])]), d)
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
