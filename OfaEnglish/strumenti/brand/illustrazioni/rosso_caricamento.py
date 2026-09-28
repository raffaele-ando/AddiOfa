"""
Caricamento: anello di avanzamento con due archi (kit rosso, stati).

    python3 strumenti/brand/illustrazioni/rosso_caricamento.py

Difetti dell'originale corretti: l'arco rosso ha un capo tagliato dritto e l'altro tondo, l'arco
rosa è tagliato netto in alto, la traccia cambia spessore e tono a metà, l'anello è un po' ovale,
schegge bianche attorno al bordo. Qui: un cerchio vero, traccia e archi dello stesso spessore, capi
tutti tondi, fondo bianco dentro l'anello (come nell'originale) in un gruppo suo.
Il gruppo `rotore` (i due archi) si può far girare attorno al centro per l'animazione.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n  # noqa: E402
from oggetti_c import arco, documento  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 74, 76
CENTRO = V(37, 38)
R, SPESSORE = 27.6, 6.6
C = {"fondo": "#FFFFFF", "traccia": ("#FDD0D1", "#FEEBEB"), "corto": ("#FD9DA2", "#FC8C92"),
     "lungo": ("#FD4048", "#EE2A34")}
ARCO_LUNGO = (73, 170)          # gradi, 0 = destra, 90 = in basso
ARCO_CORTO = (-83, -27)


def scena() -> str:
    c = CENTRO
    defs = [lineare("traccia-luce", c + V(-R, -R), c + V(R, R), [(0, C["traccia"][0]), (1, C["traccia"][1])]),
            lineare("corto-luce", c + V(0, -R), c + V(R, 0), [(0, C["corto"][0]), (1, C["corto"][1])]),
            lineare("lungo-luce", c + V(-R, 0), c + V(0, R), [(0, C["lungo"][0]), (1, C["lungo"][1])])]
    corpo = [f'<circle id="fondo" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="{C["fondo"]}"/>',
             f'<circle id="traccia" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="none" stroke="url(#traccia-luce)" stroke-width="{n(SPESSORE)}"/>',
             f'<g id="rotore" fill="none" stroke-width="{n(SPESSORE)}" stroke-linecap="round">'
             f'<path id="arco-corto" d="{arco(c, R, *ARCO_CORTO)}" stroke="url(#corto-luce)"/>'
             f'<path id="arco-lungo" d="{arco(c, R, *ARCO_LUNGO)}" stroke="url(#lungo-luce)"/>'
             f'<path id="arco-lungo-riflesso" d="{arco(c, R - 1.5, ARCO_LUNGO[0] + 18, ARCO_LUNGO[1] - 12)}" stroke="#FFFFFF" '
             f'stroke-opacity="0.3" stroke-width="1.2"/></g>']
    return documento(W, H, "Caricamento", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "caricamento.svg"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(scena())
    print(f)
