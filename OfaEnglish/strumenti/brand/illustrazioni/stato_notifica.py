"""
Stato / Notifica: busta chiusa con il badge rosso «1» (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_notifica.py

Difetti dell'originale corretti: la V del lembo è storta (il braccio destro sale più in fretta e
finisce sotto il badge), la punta è schiacciata, i triangoli di sotto sono a chiazze, l'«1» è
disegnato a mano con lo spessore che cambia, il badge ha l'alone sfrangiato. Qui: busta simmetrica
sull'asse CX (lembo a V più chiaro, con la punta raccordata e un'ombra morbida, tasca di sotto con le due
pieghe dagli angoli), badge con bordo bianco e l'«1» vero in Inter (oggetti_d.badge).
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n  # noqa: E402
from oggetti_d import badge, filtro_ombra, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 93, 68
BUSTA = (4, 13, 75, 63.5)                   # x0 y0 x1 y1
R = 5.5
PUNTA_Y = 42                                # punta del lembo
TASCA_Y = 36                                # dove si incontrano le pieghe della tasca
C = {"busta": ("#E1E8FE", "#D0DBFD"), "lembo": ("#F5F7FF", "#E4EAFE"), "tasca": ("#D8E1FD", "#C9D5FC"),
     "piega": "#FFFFFF", "ombra": "#1D4ED8",
     "badge": {"chiaro": "#FF6B6F", "base": "#F63C43", "scuro": "#DC2626"}}
BADGE = (V(72, 18), 11.6)


def scena() -> str:
    x0, y0, x1, y1 = BUSTA
    cx = (x0 + x1) / 2
    sag = [V(x0, y0), V(x1, y0), V(x1, y1), V(x0, y1)]
    defs = [filtro_ombra(W, H, 1.5),
            '<filter id="sfuma-lembo" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="1.1"/></filter>',
            lineare("busta-luce", V(0, y0), V(0, y1), [(0, C["busta"][0]), (1, C["busta"][1])]),
            lineare("lembo-luce", V(x0, y0), V(cx, PUNTA_Y), [(0, C["lembo"][0]), (1, C["lembo"][1])]),
            lineare("tasca-luce", V(0, TASCA_Y), V(0, y1), [(0, C["tasca"][0]), (1, C["tasca"][1])]),
            f'<clipPath id="busta-forma"><path d="{arrotondato(sag, R)}"/></clipPath>']
    corpo = [ombra("busta-ombra", cx, y1 + 0.5, 33, 2.2, C["ombra"], 0.14)]
    g = [f'<path id="busta-corpo" d="{arrotondato(sag, R)}" fill="url(#busta-luce)"/>']
    # tasca: le due pieghe dagli angoli di sotto verso il centro
    tasca = [V(x0 - 2, y1 + 2), V(x0 - 2, y1 - 1), V(cx, TASCA_Y), V(x1 + 2, y1 - 1), V(x1 + 2, y1 + 2)]
    g.append(f'<path id="busta-tasca" d="{arrotondato(tasca, [0, 0, 9, 0, 0])}" fill="url(#tasca-luce)"/>')
    g.append(f'<path id="busta-pieghe" d="M{n(x0 + 2.5)} {n(y1 - 2.3)} L{n(cx - 5.5)} {n(TASCA_Y + 5.7)} M{n(x1 - 2.5)} {n(y1 - 2.3)} '
             f'L{n(cx + 5.5)} {n(TASCA_Y + 5.7)}" stroke="{C["piega"]}" stroke-opacity="0.35" stroke-width="0.9" stroke-linecap="round"/>')
    # lembo a V, con la punta morbida e l'ombra sotto
    lembo = [V(x0 - 2, y0 - 2), V(x1 + 2, y0 - 2), V(x1 + 2, y0 + 3), V(cx, PUNTA_Y), V(x0 - 2, y0 + 3)]
    g.append(f'<path id="busta-lembo-ombra" d="{arrotondato([q + V(0, 1.6) for q in lembo], [0, 0, 0, 8, 0])}" fill="{C["ombra"]}" '
             f'opacity="0.13" filter="url(#sfuma-lembo)"/>')
    g.append(f'<path id="busta-lembo" d="{arrotondato(lembo, [0, 0, 0, 8, 0])}" fill="url(#lembo-luce)"/>')
    corpo.append(f'<g id="busta" clip-path="url(#busta-forma)">{"".join(g)}</g>')
    c, r = BADGE
    corpo.append(ombra("badge-ombra", c.x + 0.4, c.y + 1.4, r + 1.2, r + 0.8, C["badge"]["scuro"], 0.2))
    d, b = badge("badge", c, r, C["badge"], "testo", anello=2, testo="1")
    defs.append(d); corpo.append(b)
    return svg(W, H, "Stato / Notifica", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "notifica.svg"
    f.write_text(scena())
    print(f)
