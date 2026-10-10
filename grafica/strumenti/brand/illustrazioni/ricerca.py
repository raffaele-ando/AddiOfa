"""
Ricerca: lente d'ingrandimento (kit blu).

    python3 strumenti/brand/illustrazioni/ricerca.py

Difetti dell'originale corretti: alone bianco sfrangiato attorno all'anello e al manico, anello con
la luce incoerente (chiaro in alto e di nuovo chiaro in basso a destra), manico con un gradino
storto dove si attacca all'anello e bordi tremolanti. Qui: anello di spessore costante con la luce
da in alto a sinistra, vetro con riflesso, manico costruito lungo un asse (attacco + impugnatura con
la punta tonda) e ruotato.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, radiale, sfocatura  # noqa: E402
from oggetti_b import nuvola, polare, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 130, 117
C = {"nuvola": "#F2F6FE", "anello": ("#7593C6", "#34609F", "#123C78"), "vetro": ("#FFFFFF", "#E4EDFD"),
     "manico": ("#3A5F97", "#1A3C70", "#0F2B55"), "ombra": "#1D4ED8"}

CENTRO = V(55, 52)
R_FUORI, R_DENTRO = 34.5, 24
ANGOLO_MANICO = 49                 # gradi sotto l'orizzontale
ATTACCO = (31, 43, 10)             # da r, a r, larghezza
IMPUGNATURA = (41, 72, 14)


def scena() -> str:
    c = CENTRO
    defs = [sfocatura("sfuma-ombra", 2.2, W, H),
            lineare("anello-luce", c + V(-R_FUORI, -R_FUORI) * 0.7, c + V(R_FUORI, R_FUORI) * 0.7,
                    [(0, C["anello"][0]), (0.5, C["anello"][1]), (1, C["anello"][2])]),
            radiale("vetro-luce", c + V(-8, -9), R_DENTRO * 1.5, [(0, C["vetro"][0]), (1, C["vetro"][1])]),
            # il manico è disegnato in orizzontale e ruotato: la luce va lungo la larghezza (y)
            lineare("manico-luce", V(0, -7), V(0, 7), [(0, C["manico"][0]), (0.5, C["manico"][1]), (1, C["manico"][2])]),
            lineare("attacco-luce", V(0, -5), V(0, 5), [(0, C["anello"][1]), (1, C["anello"][2])])]
    corpo = [nuvola(C["nuvola"], [(66, 58, 62, 54)])]
    # ombra morbida della lente, un po' spostata in basso a destra
    corpo.append(f'<circle id="ombra-lente" cx="{n(c.x + 2)}" cy="{n(c.y + 3)}" r="{n(R_FUORI)}" fill="{C["ombra"]}" '
                 f'opacity="0.1" filter="url(#sfuma-ombra)"/>')
    # manico, lungo l'asse x e poi ruotato
    a0, a1, aw = ATTACCO
    m0, m1, mw = IMPUGNATURA
    attacco = arrotondato([V(a0, -aw / 2), V(a1, -aw / 2), V(a1, aw / 2), V(a0, aw / 2)], [0, 1.5, 1.5, 0])
    impugnatura = arrotondato([V(m0, -mw / 2), V(m1, -mw / 2), V(m1, mw / 2), V(m0, mw / 2)], [3, mw / 2, mw / 2, 3])
    corpo.append(f'<g id="manico" transform="translate({n(c.x)} {n(c.y)}) rotate({ANGOLO_MANICO})">'
                 f'<path id="manico-ombra" d="{impugnatura}" fill="{C["ombra"]}" opacity="0.14" transform="translate(1.5 2.5)" filter="url(#sfuma-ombra)"/>'
                 f'<path id="manico-attacco" d="{attacco}" fill="url(#attacco-luce)"/>'
                 f'<path id="manico-impugnatura" d="{impugnatura}" fill="url(#manico-luce)"/>'
                 f'<path id="manico-riflesso" d="M{m0 + 4} -3.2 H{m1 - 7}" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round"/>'
                 f'</g>')
    # lente: vetro e anello
    rm = (R_FUORI + R_DENTRO) / 2
    anello = (f"M{n(c.x + R_FUORI)} {n(c.y)} A{R_FUORI} {R_FUORI} 0 1 0 {n(c.x - R_FUORI)} {n(c.y)} "
              f"A{R_FUORI} {R_FUORI} 0 1 0 {n(c.x + R_FUORI)} {n(c.y)} Z "
              f"M{n(c.x + R_DENTRO)} {n(c.y)} A{R_DENTRO} {R_DENTRO} 0 1 1 {n(c.x - R_DENTRO)} {n(c.y)} "
              f"A{R_DENTRO} {R_DENTRO} 0 1 1 {n(c.x + R_DENTRO)} {n(c.y)} Z")
    g = [f'<circle id="vetro" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R_DENTRO + 0.5)}" fill="url(#vetro-luce)"/>',
         # riflesso sul vetro: un arco e un puntino, in alto a sinistra
         f'<path id="vetro-riflesso" d="M{p_(polare(c, R_DENTRO - 6, 160))} A{R_DENTRO - 6} {R_DENTRO - 6} 0 0 1 {p_(polare(c, R_DENTRO - 6, 105))}" '
         f'stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" fill="none"/>',
         f'<circle id="vetro-riflesso-punto" cx="{n(polare(c, R_DENTRO - 6, 182).x)}" cy="{n(polare(c, R_DENTRO - 6, 182).y)}" r="1.6" fill="#FFFFFF"/>',
         # ombra dell'anello sul vetro, in basso a destra (lo spessore del bordo)
         f'<path id="vetro-bordo" d="M{p_(polare(c, R_DENTRO - 1, -10))} A{R_DENTRO - 1} {R_DENTRO - 1} 0 0 1 {p_(polare(c, R_DENTRO - 1, -120))}" '
         f'stroke="#1D4ED8" stroke-opacity="0.12" stroke-width="2.4" stroke-linecap="round" fill="none"/>',
         f'<path id="anello" d="{anello}" fill="url(#anello-luce)" fill-rule="evenodd"/>',
         f'<path id="anello-riflesso" d="M{p_(polare(c, rm, 200))} A{rm} {rm} 0 0 1 {p_(polare(c, rm, 110))}" stroke="#FFFFFF" '
         f'stroke-opacity="0.3" stroke-width="2.6" stroke-linecap="round" fill="none"/>']
    corpo.append(f'<g id="lente">{"".join(g)}</g>')
    return svg(W, H, "Ricerca", defs, corpo)


def p_(q: V) -> str:
    return f"{n(q.x)} {n(q.y)}"


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-blu" / "illustrazioni" / "ricerca.svg"
    f.write_text(scena())
    print(f)
