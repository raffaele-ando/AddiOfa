"""
Verifica utente: tessera con la foto profilo e tre righe di dati (kit rosso; nell'originale la
tessera è blu anche in questo kit, e blu resta: è il colore del "profilo").

    python3 strumenti/brand/illustrazioni/rosso_verifica_utente.py

Difetti dell'originale corretti: la testa è una capsula allungata (un uovo, non una testa), il busto
è una cupola col fondo piatto che galleggia dentro il cerchio invece di esserne tagliato, testa e
busto di due blu che non c'entrano tra loro, tessera senza bordo, nuvola a bitorzoli sfrangiati.
Qui: testa tonda e busto a spalle arrotondate tagliati dal cerchio della foto (come un avatar vero),
un solo blu in due toni, tessera con bordo e ombra, righe come barre arrotondate allineate a sinistra.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402
from oggetti_c import documento  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 199, 108
C = {"nuvola": "#F2F6FE", "tessera": ("#DCE4FE", "#CCD7FC"), "bordo": "#C2CFFB", "foto": "#FFFFFF",
     "testa": ("#6380FB", "#4461F3"), "busto": ("#2458DA", "#0A3DB8"), "righe": "#A9BCFD", "ombra": "#1D4ED8"}
TESSERA = (14, 16, 183, 104, 13)
FOTO = (V(59.5, 60.5), 32.5)
TESTA = (V(59.5, 53), 12)
BUSTO = (70.5, 21, 36)             # y delle spalle, mezza larghezza, altezza fino sotto il cerchio
RIGHE = [(104, 41, 60, C["righe"]), (104, 59.5, 37, "#FFFFFF"), (104, 79, 60, C["righe"])]   # x, y, lunghezza, colore


def scena() -> str:
    x0, y0, x1, y1, r = TESSERA
    fc, fr = FOTO
    tc, tr = TESTA
    ys, ms, hs = BUSTO
    defs = [sfocatura("sfuma-ombra", 2.2, W, H),
            lineare("tessera-luce", V(x0, y0), V(x1, y1), [(0, C["tessera"][0]), (1, C["tessera"][1])]),
            lineare("testa-luce", tc + V(-tr, -tr), tc + V(tr, tr), [(0, C["testa"][0]), (1, C["testa"][1])]),
            lineare("busto-luce", V(fc.x - ms, ys), V(fc.x + ms, ys + 20), [(0, C["busto"][0]), (1, C["busto"][1])]),
            f'<clipPath id="foto-forma"><circle cx="{n(fc.x)}" cy="{n(fc.y)}" r="{n(fr)}"/></clipPath>']
    corpo = [f'<g id="nuvola" fill="{C["nuvola"]}"><circle cx="34" cy="20" r="17"/><circle cx="22" cy="78" r="20"/>'
             f'<circle cx="176" cy="64" r="18"/></g>',
             f'<rect id="tessera-ombra" x="{n(x0 + 8)}" y="{n(y1 - 5)}" width="{n(x1 - x0 - 16)}" height="7" rx="3.5" fill="{C["ombra"]}" '
             f'opacity="0.12" filter="url(#sfuma-ombra)"/>',
             f'<rect id="tessera" x="{n(x0)}" y="{n(y0)}" width="{n(x1 - x0)}" height="{n(y1 - y0)}" rx="{n(r)}" fill="url(#tessera-luce)" '
             f'stroke="{C["bordo"]}" stroke-width="1.2"/>',
             f'<path id="tessera-riflesso" d="M{n(x0 + 12)} {n(y0 + 4)} H{n(x1 - 12)}" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.6" '
             f'stroke-linecap="round"/>']
    # foto profilo: cerchio bianco, testa tonda, busto tagliato dal cerchio
    busto = arrotondato([V(fc.x - ms, ys + hs), V(fc.x - ms, ys), V(fc.x + ms, ys), V(fc.x + ms, ys + hs)], [0, ms * 0.95, ms * 0.95, 0])
    corpo.append(f'<g id="foto"><circle id="foto-fondo" cx="{n(fc.x)}" cy="{n(fc.y)}" r="{n(fr)}" fill="{C["foto"]}"/>'
                 f'<g id="persona" clip-path="url(#foto-forma)">'
                 f'<path id="busto" d="{busto}" fill="url(#busto-luce)"/>'
                 f'<circle id="testa" cx="{n(tc.x)}" cy="{n(tc.y)}" r="{n(tr)}" fill="url(#testa-luce)"/>'
                 f'<path id="testa-riflesso" d="M{n(tc.x - 6.5)} {n(tc.y - 3)} A7.5 7.5 0 0 1 {n(tc.x - 2)} {n(tc.y - 7.6)}" fill="none" '
                 f'stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="2.2" stroke-linecap="round"/></g></g>')
    righe = "".join(f'<path id="riga-{i + 1}" d="M{n(x + 4)} {n(y)} H{n(x + l - 4)}" stroke="{c}"/>' for i, (x, y, l, c) in enumerate(RIGHE))
    corpo.append(f'<g id="righe-dati" stroke-width="8" stroke-linecap="round">{righe}</g>')
    return documento(W, H, "Verifica utente", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "verifica-utente.svg"
    f.write_text(scena())
    print(f)
