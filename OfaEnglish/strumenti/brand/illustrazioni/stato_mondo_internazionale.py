"""
Stato / Mondo internazionale: globo blu con i continenti su una nuvola pallida (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_mondo_internazionale.py

Difetti dell'originale corretti: il globo non è tondo (più alto che largo) e ha un alone bianco
sfrangiato, i continenti sono macchie a bordi seghettati con buchi e isole a caso, la nuvola dietro
ha il bordo sporco. Qui: globo circolare con mare in sfumatura, ombra sferica verso il basso a
destra e un riflesso; continenti semplici ma riconoscibili (le Americhe a sinistra, Europa e Africa
a destra) con gli angoli raccordati e ritagliati dal cerchio, nel gruppo `continenti` (si può far
girare spostandolo); nuvola di due forme dello stesso colore con i bordi netti.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, radiale  # noqa: E402
from oggetti_d import filtro_ombra, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 101, 94
CENTRO, R = V(51, 45), 33.3
NUVOLA = [(54, 42.5, 43, 40), (31, 60, 28.5, 28.5)]      # cx cy rx ry
C = {"nuvola": "#EFF3FC", "mare": ("#B6C8F8", "#9AB2F2", "#7E9BE8"), "terra": ("#4C6FAA", "#3A5B94", "#2F4D84"),
     "ombra": "#1D4ED8"}

CONTINENTI = {  # contorni in coordinate della tela; le parti fuori dal cerchio sono ritagliate
    "nord-america": [(40, 4), (48.5, 5), (48.5, 13), (47.5, 16.5), (44.5, 18.6), (42, 18.2), (40, 17.4), (37.2, 18.8),
                     (35.4, 19.6), (35.2, 21), (38.6, 21.4), (40, 23), (38.4, 25.2), (36.2, 27.2), (33.4, 28.6), (31.4, 30.6),
                     (29.4, 32.6), (28.4, 34.6), (26, 35.6), (22.6, 35.6), (21.8, 37), (23.6, 38.8), (24.6, 41), (26.2, 43),
                     (27.4, 45.6), (25.4, 45.4), (23, 43.4), (20.6, 41.6), (18, 40.4), (12, 40), (10, 28), (22, 8)],
    "sud-america": [(27.5, 44.4), (35.5, 44.4), (38.6, 46.4), (41, 49.3), (43.4, 50.9), (46.6, 52.4), (47.2, 54.4), (46.6, 57.6),
                    (45, 59.2), (44.4, 62.6), (42, 65.6), (40.2, 68.4), (39.6, 72), (39.4, 75.8), (37.6, 74.4), (36.2, 70.4),
                    (34.2, 65.4), (33, 61.4), (29.6, 57.6), (26.4, 54), (25.8, 48.4)],
    "europa": [(63.6, 15), (66, 10), (77, 11), (88, 24), (88, 34), (80, 34), (77.2, 33.2), (75.6, 31.2), (74, 29.4), (69.2, 28.6), (67, 27.3),
               (62.2, 27.6), (59.6, 28.6), (56.6, 28.2), (56.4, 25), (57, 21.2), (60, 21), (62.6, 20), (62.2, 17.2)],
    "africa": [(60, 29.6), (64.4, 30.6), (67.6, 31.8), (71.6, 31.2), (74.6, 32.2), (78, 33.4), (88, 34), (88, 46), (81.6, 46.6), (81, 50.2),
               (78.6, 54), (77.8, 57.6), (76.6, 60.4), (73.6, 62.6), (72, 65.2), (70.4, 66.8),
               (68.2, 66.2), (67.2, 63.2), (66.2, 58.2), (65.6, 52.2), (65.2, 47.4), (56.2, 46.6), (54, 45), (53, 40.2),
               (53.4, 35.2), (56, 33.2), (58, 31.4)],
}


def scena() -> str:
    c = CENTRO
    defs = [filtro_ombra(W, H, 1.6),
            lineare("mare-luce", c + V(-R, -R) * 0.7, c + V(R, R) * 0.7, [(0, C["mare"][0]), (0.5, C["mare"][1]), (1, C["mare"][2])]),
            lineare("terra-luce", c + V(-R, -R) * 0.7, c + V(R, R) * 0.7, [(0, C["terra"][0]), (0.5, C["terra"][1]), (1, C["terra"][2])]),
            radiale("globo-volume", c + V(-R * 0.35, -R * 0.4), R * 1.45,
                    [(0, "#FFFFFF", 0), (0.6, "#FFFFFF", 0), (1, C["ombra"], 0.28)]),
            f'<clipPath id="globo-forma"><circle cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}"/></clipPath>']
    corpo = [f'<g id="nuvola" fill="{C["nuvola"]}">' + "".join(
        f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(rx)}" ry="{n(ry)}"/>' for x, y, rx, ry in NUVOLA) + "</g>"]
    corpo.append(ombra("globo-ombra", c.x + 1, c.y + R + 1.2, R * 0.7, 2.4, C["ombra"], 0.16))
    terre = "".join(f'<path id="{nm}" d="{arrotondato([V(*q) for q in pts], 1.6)}"/>' for nm, pts in CONTINENTI.items())
    corpo.append(f'<g id="globo"><circle id="mare" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="url(#mare-luce)"/>'
                 f'<g clip-path="url(#globo-forma)"><g id="continenti" fill="url(#terra-luce)">{terre}</g></g>'
                 f'<circle id="globo-volume" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="url(#globo-volume)"/>'
                 f'<path id="globo-riflesso" d="M{n(c.x - R * 0.72)} {n(c.y - R * 0.2)} A{n(R * 0.76)} {n(R * 0.76)} 0 0 1 '
                 f'{n(c.x - R * 0.22)} {n(c.y - R * 0.72)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="3" '
                 f'stroke-linecap="round"/></g>')
    return svg(W, H, "Stato / Mondo internazionale", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "mondo-internazionale.svg"
    f.write_text(scena())
    print(f)
