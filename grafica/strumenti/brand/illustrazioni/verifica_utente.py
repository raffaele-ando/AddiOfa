"""
Verifica utente: tessera con la foto (profilo) e tre righe di dati.

    python3 strumenti/brand/illustrazioni/verifica_utente.py

Difetti dell'originale corretti: la tessera era storta in modo incoerente (lato sinistro inclinato,
lato destro dritto, angoli con raggi diversi), la testa era un uovo, il busto usciva dal cerchio
della foto con un bordo sfocato, righe con frange bianche. Qui: tessera = rettangolo con raccordi
veri e una sola rotazione (ROT) per tutto; profilo con testa tonda e busto a cupola raccordato,
centrati sul cerchio bianco; righe arrotondate allineate con lunghezze decrescenti.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, p, sfocatura  # noqa: E402
from oggetti_a import barra, nuvola, rettangolo, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (181, 103), "nuvola": "#F2F6FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(50.7, 52.1, 50.2, 50.4), (140.9, 66.8, 39.6, 31.8), (116.8, 52.5, 56.4, 42.5)],
        "tessera": (18, 14, 165, 93), "raggio": 11, "rotazione": -2.5,
        "carta": ("#E2EAFE", "#D2DFFD"), "bordo": "#C7D7FB",
        "foto": (V(58, 53), 29.5), "testa": (V(58, 45.5), 12.5), "busto": (V(58, 86), 23.5, 23),
        "profilo": ("#6A9DFD", "#3B7BFB", "#1A5FF2"),
        "righe": {"x": 98, "y": [35, 53.5, 72], "lunghezze": [52, 43, 35], "spessore": 8, "colore": "#B1C6FC"},
    },
}


def busto(c: V, rx: float, ry: float, r: float = 4.5) -> str:
    """Cupola: mezza ellisse con la base piatta e gli angoli della base raccordati (archi di cerchio veri)."""
    x0, x1, yb = c.x - rx, c.x + rx, c.y
    k = 0.5523 * r
    # l'ellisse è verticale agli estremi: raccordo tra la verticale e la base
    return (f"M{n(x0)} {n(yb - r)} A{n(rx)} {n(ry)} 0 0 1 {n(x1)} {n(yb - r)} "
            f"C{n(x1)} {n(yb - r + k)} {n(x1 - r + k)} {n(yb)} {n(x1 - r)} {n(yb)} H{n(x0 + r)} "
            f"C{n(x0 + r - k)} {n(yb)} {n(x0)} {n(yb - r + k)} {n(x0)} {n(yb - r)} Z")


def scena(k: dict) -> str:
    W, H = k["tela"]
    x0, y0, x1, y1 = k["tessera"]
    C = V((x0 + x1) / 2, (y0 + y1) / 2)
    fc, fr = k["foto"]
    tc, tr = k["testa"]
    bc, brx, bry = k["busto"]
    c1, c2, c3 = k["profilo"]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("carta-luce", V(x0, y0), V(x1, y1), [(0, k["carta"][0]), (1, k["carta"][1])]),
            lineare("testa-luce", tc + V(-tr, -tr), tc + V(tr, tr), [(0, c1), (1, c2)]),
            lineare("busto-luce", V(bc.x - brx, bc.y - bry), V(bc.x + brx, bc.y), [(0, c2), (1, c3)])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    g = [f'<path id="tessera-ombra" d="{rettangolo(x0 + 5, y0 + 8, x1 - x0 - 10, y1 - y0 - 5, k["raggio"])}" fill="{k["ombra"]}" opacity="0.12" filter="url(#sfuma-ombra)"/>',
         f'<path id="tessera-carta" d="{rettangolo(x0, y0, x1 - x0, y1 - y0, k["raggio"])}" fill="url(#carta-luce)" stroke="{k["bordo"]}" stroke-width="1"/>',
         f'<path id="tessera-riflesso" d="M{n(x0 + 12)} {n(y0 + 3.2)} H{n(x1 - 12)}" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="1.6" stroke-linecap="round"/>']
    # foto profilo: il busto è tagliato dal cerchio, come in una foto tessera
    defs.append(f'<clipPath id="foto-taglio"><circle cx="{n(fc.x)}" cy="{n(fc.y)}" r="{n(fr)}"/></clipPath>')
    g.append(f'<g id="profilo">'
             f'<circle id="foto" cx="{n(fc.x)}" cy="{n(fc.y)}" r="{n(fr)}" fill="#F8FAFF"/>'
             f'<g clip-path="url(#foto-taglio)"><path id="profilo-busto" d="{busto(bc, brx, bry)}" fill="url(#busto-luce)"/></g>'
             f'<circle id="profilo-testa" cx="{n(tc.x)}" cy="{n(tc.y)}" r="{n(tr)}" fill="url(#testa-luce)"/>'
             f'<path id="profilo-riflesso" d="M{p(tc + V(-7.5, -3))} A8.5 8.5 0 0 1 {p(tc + V(-2.5, -8))}" stroke="#FFFFFF" stroke-opacity="0.4" '
             f'stroke-width="2" stroke-linecap="round" fill="none"/></g>')
    r = k["righe"]
    g.append('<g id="righe">' + "".join(barra(f"riga-{i + 1}", V(r["x"], y), V(r["x"] + L, y), r["spessore"], r["colore"])
                                        for i, (y, L) in enumerate(zip(r["y"], r["lunghezze"]))) + "</g>")
    corpo.append(f'<g id="tessera" transform="rotate({n(k["rotazione"])} {n(C.x)} {n(C.y)})">' + "".join(g) + "</g>")
    return svg("Verifica utente", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "verifica-utente.svg"
        f.write_text(scena(k))
        print(f)
