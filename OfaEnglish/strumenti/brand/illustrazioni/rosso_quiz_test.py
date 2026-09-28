"""
Quiz / Test: foglio con le risposte A, B, C e quella scelta spuntata (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_quiz_test.py

Difetti dell'originale corretti: il foglio bianco è bucato (il ritaglio dal fondo ne ha mangiato
pezzi) e non ha un bordo, l'ultima riga esce quasi dal fondo del foglio, la casella rossa è girata
di più delle altre, le lettere sono sfocate, le righe di testo hanno spessori diversi. Qui il foglio
è costruito dritto (coordinate locali, centro in 0 0) e girato tutto insieme: caselle uguali in
colonna, righe a passo costante e centrate nel foglio, lettere vere (Inter), spunta a tratto tondo.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_b import nuvola, svg  # noqa: E402
from testo_svg import tracciato  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 182, 138
C = {"nuvola": "#EEF2FB", "foglio": ("#FFFFFF", "#F8FAFD"), "bordo": "#E2E8F0", "casella": ("#D3DAE8", "#C3CCDF"),
     "righe": "#E2E6F0", "spunta": ("#FA5256", "#EF3338", "#DC2329"), "ombra": "#475569"}

CENTRO, ROTAZIONE = V(100, 68), 9.3        # il foglio è girato in senso orario
FOGLIO = (114, 120, 9)                     # larghezza, altezza, raggio
RIGHE_Y = [-34, -9.5, 15, 39.5]            # centri delle quattro risposte (passo costante)
CASELLA_X, CASELLA, R_CASELLA = -30, 19, 4.5
TESTO_X0, TESTO_X1, TESTO_CORTO = -8, 39, [12, 9, 8, 5]   # righe di testo: lunga e corta (fine)
RISPOSTE = ["A", None, "B", "C"]           # None = casella spuntata


def scena() -> str:
    L, A, R = FOGLIO
    defs = [sfocatura("sfuma-ombra", 2.5, W * 2, H * 2).replace('x="0" y="0"', f'x="-{W}" y="-{H}"'),
            lineare("foglio-luce", V(0, -A / 2), V(0, A / 2), [(0, C["foglio"][0]), (1, C["foglio"][1])]),
            lineare("casella-luce", V(0, -CASELLA / 2), V(0, CASELLA / 2), [(0, C["casella"][0]), (1, C["casella"][1])]),
            lineare("spunta-luce", V(-CASELLA / 2, -CASELLA / 2), V(CASELLA / 2, CASELLA / 2),
                    [(0, C["spunta"][0]), (0.5, C["spunta"][1]), (1, C["spunta"][2])])]
    corpo = [nuvola(C["nuvola"], [(31, 97, 28), (40, 61, 17), (163, 99, 18, 37)])]
    g = [f'<rect id="ombra-foglio" x="{n(-L / 2 + 3)}" y="{n(-A / 2 + 5)}" width="{n(L - 4)}" height="{n(A - 4)}" rx="{R}" '
         f'fill="{C["ombra"]}" opacity="0.1" filter="url(#sfuma-ombra)"/>',
         f'<rect id="foglio" x="{n(-L / 2)}" y="{n(-A / 2)}" width="{L}" height="{A}" rx="{R}" fill="url(#foglio-luce)" '
         f'stroke="{C["bordo"]}" stroke-width="1"/>']
    for i, (y, lettera) in enumerate(zip(RIGHE_Y, RISPOSTE)):
        nome = f"risposta-{lettera.lower()}" if lettera else "risposta-scelta"
        x0 = CASELLA_X - CASELLA / 2
        parti = []
        if lettera:
            parti.append(f'<rect id="{nome}-casella" x="{n(x0)}" y="{n(-CASELLA / 2)}" width="{CASELLA}" height="{CASELLA}" '
                         f'rx="{R_CASELLA}" fill="url(#casella-luce)"/>')
            d = tracciato(lettera, 800, 12.5, CASELLA_X, 12.5 * 0.727 / 2, centro=True)
            parti.append(f'<path id="{nome}-lettera" d="{d}" fill="#FFFFFF"/>')
        else:
            parti.append(f'<rect id="{nome}-casella" x="{n(x0 - 0.5)}" y="{n(-CASELLA / 2 - 0.5)}" width="{CASELLA + 1}" '
                         f'height="{CASELLA + 1}" rx="{R_CASELLA + 0.5}" fill="url(#spunta-luce)"/>')
            parti.append(f'<path id="{nome}-spunta" d="M{n(CASELLA_X - 4.8)} 0.3 L{n(CASELLA_X - 1.4)} 3.6 L{n(CASELLA_X + 5)} -3.6" '
                         f'stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
        parti.append(f'<g id="{nome}-testo" stroke="{C["righe"]}" stroke-width="4.2" stroke-linecap="round">'
                     f'<path d="M{TESTO_X0} -4.8 H{TESTO_X1}"/><path d="M{TESTO_X0} 5 H{TESTO_CORTO[i]}"/></g>')
        g.append(f'<g id="{nome}" transform="translate(0 {n(y)})">{"".join(parti)}</g>')
    corpo.append(f'<g id="foglio-quiz" transform="translate({n(CENTRO.x)} {n(CENTRO.y)}) rotate({ROTAZIONE})">{"".join(g)}</g>')
    return svg(W, H, "Quiz / Test", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "quiz-test.svg"
    f.write_text(scena())
    print(f)
