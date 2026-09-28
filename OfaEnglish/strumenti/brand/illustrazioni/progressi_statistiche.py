"""
Progressi / Statistiche: quattro barre che crescono.

    python3 strumenti/brand/illustrazioni/progressi_statistiche.py

Difetti dell'originale corretti: barre con sfumature a chiazze e una fascia scura a metà (seconda
e quarta), la terza barra sbiadita senza motivo, altezze che crescono a salti diversi (21, 17, 22
px), frange bianche e una riga scura accanto all'ultima barra. Qui: quattro barre uguali per
larghezza, raggio e passo, altezze in progressione regolare, tono che si fa più intenso da sinistra
a destra (la crescita si legge anche nel colore), un riflesso per barra e un'ombra comune.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_a import nuvola, ombra, rettangolo, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (146, 105), "nuvola": "#EFF4FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(84.5, 47.2, 44.7, 41.1), (101, 66.7, 41.3, 37.8), (44.5, 67.2, 44, 37.3), (74, 82, 56, 21)],
        "base": 88, "x": 24, "larghezza": 19.5, "passo": 25.6, "altezze": [22, 42, 62, 82], "raggio": 6.5,
        # (chiaro, scuro) per ogni barra: dal più tenue al più intenso
        "toni": [("#9DBFFC", "#6C9DF7"), ("#86B0FB", "#4F88F4"), ("#6FA0FA", "#3A77F0"), ("#4F8BFB", "#1A5CEE")],
    },
}


def scena(k: dict) -> str:
    W, H = k["tela"]
    b, L, R = k["base"], k["larghezza"], k["raggio"]
    defs = [sfocatura("sfuma-ombra", 2, W, H)]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    x_fine = k["x"] + k["passo"] * (len(k["altezze"]) - 1) + L
    corpo.append(ombra("ombra", (k["x"] + x_fine) / 2, b + 2, (x_fine - k["x"]) / 2 + 2, 2.6, k["ombra"], 0.16))
    barre = []
    for i, (h, (chiaro, scuro)) in enumerate(zip(k["altezze"], k["toni"])):
        x, y = k["x"] + i * k["passo"], b - h
        nome = f"barra-{i + 1}"
        defs.append(lineare(f"{nome}-luce", V(x, y), V(x + L, b), [(0, chiaro), (1, scuro)]))
        barre.append(f'<g id="{nome}">'
                     f'<path id="{nome}-corpo" d="{rettangolo(x, y, L, h, R)}" fill="url(#{nome}-luce)"/>'
                     f'<path id="{nome}-riflesso" d="M{n(x + 4.2)} {n(y + 6)} V{n(max(y + 6, b - 7))}" stroke="#FFFFFF" stroke-opacity="0.3" '
                     f'stroke-width="2.2" stroke-linecap="round"/></g>')
    corpo.append('<g id="barre">' + "".join(barre) + "</g>")
    return svg("Progressi / Statistiche", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "progressi-statistiche.svg"
        f.write_text(scena(k))
        print(f)
