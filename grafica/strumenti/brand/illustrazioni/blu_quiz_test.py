"""
Quiz / Test (kit blu): foglio del quiz con tre risposte (A, ✓, C) e le righe di testo, su un secondo foglio.

    python3 strumenti/brand/illustrazioni/blu_quiz_test.py        # scrive brand/disegni/kit-blu/illustrazioni/quiz-test.svg

Difetti dell'originale corretti: il foglio, i quadratini e le righe erano inclinati di angoli
diversi (7°, 10°, 13°); il foglio dietro spuntava a pezzi senza avere un contorno; la «A» era storta
e sbavata; i tre quadratini avevano misure e raggi diversi; righe e quadratini con frange bianche;
macchie arancioni sul bordo destro. Qui: un solo gruppo ruotato (foglio, risposte e righe hanno la
stessa inclinazione), secondo foglio intero dietro con una sua rotazione, tre quadratini uguali su
una colonna con passo costante, lettere vere (Inter), spunta disegnata.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_a import barra, nuvola, rettangolo, spunta, svg, testo  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (205, 166), "nuvola": "#EEF3FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(51.5, 123.1, 51, 42.4), (155.1, 36.7, 30.8, 27.8), (149, 101.3, 55.5, 64.2), (93.3, 80.9, 73.6, 80.4)],
        "foglio": (47, 12, 170, 158), "centro": V(108.5, 85), "rotazione": 9,
        "foglio_dietro": {"rotazione": -4, "spostamento": V(-4, 3), "colore": "#F3F7FF"},
        "bordo": "#DCE5FA", "righe": "#D6E1FC",
        "risposte": [  # (lettera o simbolo, chiaro, base, scuro)
            ("A", "#8AABEB", "#7197E3", "#5A82D8"),
            ("✓", "#F96A6C", "#F33A3E", "#DF252B"),
            ("C", "#BFCBE5", "#AEBDDD", "#97A8CF"),
        ],
        "colonna": 76, "prima": 47, "passo": 40, "lato": 30, "raggio": 7,
    },
}


def scena(k: dict) -> str:
    W, H = k["tela"]
    x0, y0, x1, y1 = k["foglio"]
    C, rot = k["centro"], k["rotazione"]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H), sfocatura("sfuma-piccola", 1.4, W, H),
            lineare("foglio-luce", V(x0, y0), V(x1, y1), [(0, "#FFFFFF"), (1, "#F6F9FF")])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    # foglio dietro: stesso formato, un'altra rotazione, appena spostato
    fd = k["foglio_dietro"]
    cd = C + fd["spostamento"]
    corpo.append(f'<g id="foglio-dietro" transform="rotate({n(fd["rotazione"])} {n(cd.x)} {n(cd.y)}) translate({n(fd["spostamento"].x)} {n(fd["spostamento"].y)})">'
                 f'<path id="foglio-dietro-ombra" d="{rettangolo(x0 + 3, y0 + 6, x1 - x0 - 6, y1 - y0 - 4, 10)}" fill="{k["ombra"]}" opacity="0.1" filter="url(#sfuma-ombra)"/>'
                 f'<path id="foglio-dietro-carta" d="{rettangolo(x0, y0, x1 - x0, y1 - y0, 10)}" fill="{fd["colore"]}" stroke="{k["bordo"]}" stroke-width="1.2"/></g>')
    # foglio davanti con le risposte: un solo gruppo, una sola rotazione
    g = [f'<path id="foglio-ombra" d="{rettangolo(x0 + 4, y0 + 7, x1 - x0 - 8, y1 - y0 - 5, 10)}" fill="{k["ombra"]}" opacity="0.13" filter="url(#sfuma-ombra)"/>',
         f'<path id="foglio-carta" d="{rettangolo(x0, y0, x1 - x0, y1 - y0, 10)}" fill="url(#foglio-luce)" stroke="{k["bordo"]}" stroke-width="1.2"/>']
    L, R = k["lato"], k["raggio"]
    for i, (segno, chiaro, base, scuro) in enumerate(k["risposte"]):
        nome = f"risposta-{i + 1}"
        c = V(k["colonna"], k["prima"] + i * k["passo"])
        bx, by = c.x - L / 2, c.y - L / 2
        defs.append(lineare(f"{nome}-luce", V(bx, by), V(bx + L, by + L), [(0, chiaro), (0.5, base), (1, scuro)]))
        if segno == "✓":
            simbolo = (f'<path id="{nome}-segno" d="{spunta(c + V(0.3, 0.6), 8.2)}" stroke="#FFFFFF" stroke-width="4.4" '
                       f'stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
        else:
            simbolo = testo(f"{nome}-lettera", segno, 800, 19, c.x, c.y + 6.9, "#FFFFFF")
        righe = (barra(f"{nome}-riga-lunga", V(c.x + 27, c.y - 5.5), V(c.x + 76, c.y - 5.5), 6.5, k["righe"])
                 + barra(f"{nome}-riga-corta", V(c.x + 27, c.y + 8), V(c.x + 52, c.y + 8), 6.5, k["righe"]))
        g.append(f'<g id="{nome}">'
                 f'<path id="{nome}-ombra" d="{rettangolo(bx + 2, by + 4, L - 4, L - 2, R)}" fill="{scuro}" opacity="0.3" filter="url(#sfuma-piccola)"/>'
                 f'<path id="{nome}-casella" d="{rettangolo(bx, by, L, L, R)}" fill="url(#{nome}-luce)"/>'
                 f'<path id="{nome}-riflesso" d="M{n(bx + 6)} {n(by + 3.2)} H{n(bx + L - 6)}" stroke="#FFFFFF" stroke-opacity="0.35" '
                 f'stroke-width="1.6" stroke-linecap="round"/>'
                 f'{simbolo}{righe}</g>')
    corpo.append(f'<g id="foglio" transform="rotate({n(rot)} {n(C.x)} {n(C.y)})">' + "".join(g) + "</g>")
    return svg("Quiz / Test", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "quiz-test.svg"
        f.write_text(scena(k))
        print(f)
