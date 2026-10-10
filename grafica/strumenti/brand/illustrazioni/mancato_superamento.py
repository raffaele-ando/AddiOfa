"""
Mancato superamento: documento con l'angolo piegato, quattro righe e il distintivo rosso con la ✕.

    python3 strumenti/brand/illustrazioni/mancato_superamento.py

Difetti dell'originale corretti: la seconda riga era doppia (due barre sovrapposte sfalsate), le
righe erano storte e con passo diverso, l'angolo piegato in alto a destra era solo un gradino
sfocato, il documento non aveva bordo, la ✕ aveva i bracci di spessore diverso, frange bianche.
Qui: documento con raccordi veri e l'orecchia piegata vera (lembo triangolare con la sua ombra),
righe dritte a passo costante con lunghezze decrescenti, distintivo tondo con bordo bianco e ✕
simmetrica.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402
from oggetti_a import barra, distintivo, nuvola, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (149, 122), "nuvola": "#F2F5FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(72, 62, 62, 53), (100, 92, 47, 29), (42, 94, 38, 27)],
        "documento": (22, 10, 110, 114), "piega": 16, "raggio": 9,
        "carta": ("#E6EDFE", "#D8E3FD"), "bordo": "#C9D8FB", "lembo": ("#F4F7FF", "#C8D7FA"),
        "righe": {"x": 39, "prima": 30, "passo": 19, "lunghezze": [37, 28, 21, 14], "spessore": 7.5,
                  "colore": ("#94B5FA", "#7FA5F5")},
        "distintivo": (V(105.5, 86.5), 26.5, ("#FC7471", "#F4454A", "#E12A31")),
    },
}


def scena(k: dict) -> str:
    W, H = k["tela"]
    x0, y0, x1, y1 = k["documento"]
    f, R = k["piega"], k["raggio"]
    r = k["righe"]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H), sfocatura("sfuma-piccola", 1.2, W, H),
            lineare("carta-luce", V(x0, y0), V(x1, y1), [(0, k["carta"][0]), (1, k["carta"][1])]),
            lineare("lembo-luce", V(x1 - f, y0), V(x1, y0 + f), [(0, k["lembo"][0]), (1, k["lembo"][1])]),
            lineare("righe-luce", V(r["x"], 0), V(r["x"] + max(r["lunghezze"]), 0), [(0, r["colore"][0]), (1, r["colore"][1])])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    carta = arrotondato([V(x0, y0), V(x1 - f, y0), V(x1, y0 + f), V(x1, y1), V(x0, y1)], [R, 2.5, 2.5, R, R])
    lembo = arrotondato([V(x1 - f, y0), V(x1, y0 + f), V(x1 - f + 3, y0 + f)], [1.5, 1.5, 3])
    righe = "".join(barra(f"riga-{i + 1}", V(r["x"], r["prima"] + i * r["passo"]), V(r["x"] + L, r["prima"] + i * r["passo"]),
                          r["spessore"], "url(#righe-luce)") for i, L in enumerate(r["lunghezze"]))
    corpo.append(f'<g id="documento">'
                 f'<path id="documento-ombra" d="{arrotondato([V(x0 + 4, y0 + 7), V(x1 - 4, y0 + 7), V(x1 - 4, y1 + 2), V(x0 + 4, y1 + 2)], R)}" fill="{k["ombra"]}" opacity="0.12" filter="url(#sfuma-ombra)"/>'
                 f'<path id="documento-carta" d="{carta}" fill="url(#carta-luce)" stroke="{k["bordo"]}" stroke-width="1"/>'
                 f'<path id="documento-riflesso" d="M{n(x0 + 10)} {n(y0 + 3.2)} H{n(x1 - f - 6)}" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="1.6" stroke-linecap="round"/>'
                 f'<path id="lembo-ombra" d="{lembo}" fill="{k["ombra"]}" opacity="0.18" transform="translate(-1 1.5)" filter="url(#sfuma-piccola)"/>'
                 f'<path id="lembo" d="{lembo}" fill="url(#lembo-luce)"/>'
                 f'<g id="righe">{righe}</g></g>')
    c, rr, col = k["distintivo"]
    d, g = distintivo("distintivo", c, rr, col, "croce", bordo=2.8, spessore_segno=6.4)
    defs.append(d)
    corpo.append(ombra("distintivo-ombra", c.x + 1, c.y + rr - 1, rr * 0.8, 4, "#DC2626", 0.22))
    corpo.append(g)
    return svg("Mancato superamento", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "mancato-superamento.svg"
        f.write_text(scena(k))
        print(f)
