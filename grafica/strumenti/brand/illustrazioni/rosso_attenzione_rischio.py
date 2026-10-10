"""
Attenzione / rischio: triangolo di pericolo con il punto esclamativo e due tratti d'allarme (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_attenzione_rischio.py

Difetti dell'originale corretti: triangolo con gli angoli arrotondati diversi (la punta più
schiacciata, gli angoli in basso più tondi a sinistra) e la punta un po' fuori asse, esclamativo con
la barra che si allarga in basso, nuvola a patata con il bordo sfrangiato, alone bianco.
Qui: triangolo isoscele costruito sull'asse CX con raccordi veri, esclamativo centrato (barra a
pillola + punto), i due tratti radiali dallo stesso punto e della stessa lunghezza.
Il gruppo `tratti` si può animare (lampeggio) da solo.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402
from oggetti_c import documento, raggio_luce  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 153, 146
CX = 82
C = {"nuvola": "#FEF1F1", "chiaro": "#FD4F57", "base": "#FB333D", "scuro": "#EE2530", "tratti": "#FD3E47",
     "ombra": "#DC2626"}
PUNTA, BASE_Y, MEZZA_BASE = 22, 125, 55          # vertici del triangolo (prima dei raccordi)
RAGGI = (11, 12, 12)                             # punta, basso a destra, basso a sinistra
BARRA = (63, 88, 10)                            # y alto e basso dell'asse (i capi tondi aggiungono 5), larghezza
PUNTO = (104, 6.2)                              # y del centro e raggio del punto
ORIGINE_TRATTI = V(56, 68)
TRATTI = [(223 - 17, 30, 52), (223 + 17, 30, 52)]


def scena() -> str:
    A, B, Cc = V(CX, PUNTA), V(CX + MEZZA_BASE, BASE_Y), V(CX - MEZZA_BASE, BASE_Y)
    defs = [sfocatura("sfuma-ombra", 2.2, W, H),
            lineare("triangolo-luce", V(CX - 40, 40), V(CX + 40, BASE_Y), [(0, C["chiaro"]), (0.45, C["base"]), (1, C["scuro"])])]
    corpo = [f'<g id="nuvola" fill="{C["nuvola"]}"><ellipse cx="77" cy="71" rx="68" ry="65"/>'
             f'<circle cx="103" cy="53" r="44"/></g>']
    tratti = "".join(f'<path id="tratto-{i + 1}" d="{raggio_luce(ORIGINE_TRATTI, a, d, f)}"/>' for i, (a, d, f) in enumerate(TRATTI))
    corpo.append(f'<g id="tratti" stroke="{C["tratti"]}" stroke-width="6.8" stroke-linecap="round" fill="none">{tratti}</g>')
    corpo.append(f'<ellipse id="ombra" cx="{n(CX)}" cy="{n(BASE_Y)}" rx="42" ry="3" fill="{C["ombra"]}" opacity="0.2" filter="url(#sfuma-ombra)"/>')
    tri = arrotondato([A, B, Cc], list(RAGGI))
    # riflesso lungo il lato sinistro, dentro il triangolo, parallelo al lato
    lato = (Cc - A).uni()
    interno = V(lato.y, -lato.x)                  # perpendicolare al lato, verso l'interno
    r0 = A + lato * 28 + interno * 6.5
    r1 = A + lato * 56 + interno * 6.5
    y0, y1, lb = BARRA
    barra = f"M{n(CX)} {n(y0)} V{n(y1)}"
    corpo.append(f'<g id="segnale"><path id="triangolo" d="{tri}" fill="url(#triangolo-luce)"/>'
                 f'<path id="triangolo-riflesso" d="M{n(r0.x)} {n(r0.y)} L{n(r1.x)} {n(r1.y)}" stroke="#FFFFFF" stroke-opacity="0.25" '
                 f'stroke-width="3.5" stroke-linecap="round"/>'
                 f'<g id="esclamativo" fill="#FFFFFF"><path id="esclamativo-barra" d="{barra}" stroke="#FFFFFF" '
                 f'stroke-width="{n(lb)}" stroke-linecap="round"/>'
                 f'<circle id="esclamativo-punto" cx="{n(CX)}" cy="{n(PUNTO[0])}" r="{n(PUNTO[1])}"/></g></g>')
    return documento(W, H, "Attenzione / Rischio", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "attenzione-rischio.svg"
    f.write_text(scena())
    print(f)
