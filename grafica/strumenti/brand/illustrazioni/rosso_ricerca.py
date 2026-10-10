"""
Ricerca: lente d'ingrandimento con tre tratti di movimento (kit rosso, stati).

    python3 strumenti/brand/illustrazioni/rosso_ricerca.py

Difetti dell'originale corretti: i tre tratti rossi non sono radiali né simmetrici (quello in alto
più lungo e più inclinato di quello in basso, quello centrale più in alto del centro della lente),
il collo del manico è una macchia scura senza forma, alone bianco sfrangiato tutto intorno.
Qui: anello di spessore costante, vetro con un solo riflesso, collo e manico costruiti sull'asse a
45°, tratti radiali dal centro della lente e simmetrici rispetto all'orizzontale.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n  # noqa: E402
from oggetti_c import arco, documento, raggio_luce  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 100, 80
C = {"anello": ("#5E7598", "#4B6286", "#3C5378"), "manico": ("#4A6187", "#344B6E"), "collo": "#2F4465",
     "vetro": ("#F8FAFD", "#E9EDF7", "#DCE3F2"), "bordo_vetro": "#C7D1E6", "tratti": "#FD6468"}

CENTRO = V(53.5, 33.5)
R_FUORI, R_DENTRO = 26.5, 19.5
MANICO = (30, 51.5, 9)          # da, a (distanza dal centro lungo l'asse a 45°), larghezza
COLLO = (24, 31.5, 6.6)
ORIGINE_TRATTI = V(27, 33.5)   # i tratti partono dal bordo sinistro dell'anello, simmetrici rispetto all'orizzontale
TRATTI = [(180, 13, 22.5), (225, 15.5, 23.5), (135, 15.5, 23.5)]   # angolo, dentro, fuori


def scena() -> str:
    cx, cy = CENTRO.x, CENTRO.y
    rm = (R_FUORI + R_DENTRO) / 2
    defs = [lineare("anello-luce", CENTRO + V(-20, -20), CENTRO + V(20, 20),
                    [(0, C["anello"][0]), (0.5, C["anello"][1]), (1, C["anello"][2])]),
            lineare("vetro-luce", CENTRO + V(-14, -14), CENTRO + V(14, 14),
                    [(0, C["vetro"][0]), (0.55, C["vetro"][1]), (1, C["vetro"][2])]),
            # nel sistema ruotato del manico: y da -4.5 (sopra, chiaro) a +4.5 (sotto, scuro)
            lineare("manico-luce", V(0, -MANICO[2] / 2), V(0, MANICO[2] / 2), [(0, C["manico"][0]), (1, C["manico"][1])])]
    corpo = []
    tratti = "".join(f'<path id="tratto-{i + 1}" d="{raggio_luce(ORIGINE_TRATTI, a, d, f)}"/>' for i, (a, d, f) in enumerate(TRATTI))
    corpo.append(f'<g id="tratti" stroke="{C["tratti"]}" stroke-width="4.2" stroke-linecap="round" fill="none">{tratti}</g>')
    # manico lungo l'asse a 45°: coordinate locali con l'origine nel centro della lente
    a0, a1, lm = MANICO
    c0, c1, lc = COLLO
    manico = arrotondato([V(a0, -lm / 2), V(a1, -lm / 2), V(a1, lm / 2), V(a0, lm / 2)], [1.5, lm / 2, lm / 2, 1.5])
    collo = arrotondato([V(c0, -lc / 2), V(c1, -lc / 2), V(c1, lc / 2), V(c0, lc / 2)], [1, 1.5, 1.5, 1])
    corpo.append(f'<g id="lente" transform="translate({n(cx)} {n(cy)})">'
                 f'<g id="impugnatura" transform="rotate(45)">'
                 f'<path id="collo" d="{collo}" fill="{C["collo"]}"/>'
                 f'<path id="manico" d="{manico}" fill="url(#manico-luce)"/>'
                 f'<path id="manico-riflesso" d="M{n(a0 + 3.5)} {n(-lm / 2 + 2)} H{n(a1 - 4)}" stroke="#FFFFFF" stroke-opacity="0.25" '
                 f'stroke-width="1.3" stroke-linecap="round"/></g></g>')
    corpo.append(f'<circle id="vetro" cx="{n(cx)}" cy="{n(cy)}" r="{n(R_DENTRO + 0.5)}" fill="url(#vetro-luce)"/>')
    corpo.append(f'<circle id="vetro-bordo" cx="{n(cx)}" cy="{n(cy)}" r="{n(R_DENTRO - 0.4)}" fill="none" stroke="{C["bordo_vetro"]}" '
                 f'stroke-opacity="0.55" stroke-width="1.2"/>')
    corpo.append(f'<path id="vetro-riflesso" d="{arco(CENTRO, 13.5, 198, 252)}" fill="none" stroke="#FFFFFF" stroke-width="2.8" '
                 f'stroke-linecap="round" opacity="0.95"/>')
    corpo.append(f'<circle id="anello" cx="{n(cx)}" cy="{n(cy)}" r="{n(rm)}" fill="none" stroke="url(#anello-luce)" stroke-width="{n(R_FUORI - R_DENTRO)}"/>')
    corpo.append(f'<path id="anello-luce-filo" d="{arco(CENTRO, R_FUORI - 1.6, 195, 265)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" '
                 f'stroke-width="1.3" stroke-linecap="round"/>')
    return documento(W, H, "Ricerca", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "ricerca.svg"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(scena())
    print(f)
