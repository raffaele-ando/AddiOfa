"""
Risultato / Probabilità: indicatore a semicerchio riempito all'82% con il cursore e la scritta «82%».

    python3 strumenti/brand/illustrazioni/risultato_probabilita.py

Difetti dell'originale corretti: l'arco non era un cerchio (più basso a sinistra, schiacciato a
destra), la parte grigia era più sottile di quella rossa e staccata, il cursore non stava sull'arco
né al punto giusto, cifre sbavate con frange bianche, bordo della nuvola sfrangiato. Qui: un solo
semicerchio (centro CENTRO, raggio RAGGIO, stesso spessore per la parte piena e quella vuota), il
cursore messo esattamente all'82% dell'arco, cifre vere (Inter 800). Cambiando PERCENTUALE si
spostano arco, cursore e scritta insieme.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, p, sfocatura  # noqa: E402
from oggetti_a import nuvola, ombra, svg, testo  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (261, 128), "nuvola": "#FEF3F3", "ombra": "#DC2626",
        "nuvola_forme": [(50, 87.4, 49.5, 40.1), (212, 81, 48.5, 46.5), (138.4, 56, 105.4, 55.5), (135, 101, 105, 26)],
        "centro": V(142, 116), "raggio": 100, "spessore": 20, "percentuale": 82,
        "arco": ("#F6474B", "#FC6D70", "#FEA5A6"), "binario": ("#F1F3F7", "#E4E8F0"),
        "cursore": ("#FB6A6D", "#F23D41", "#E0282D"), "cifre": ("#F6474B", "#E3262B"),
        "scritta": (146, 109, 53),   # x centro, linea di base, corpo
    },
}


def punto(k, frazione: float, r: float | None = None) -> V:
    """Punto dell'arco: frazione 0 = estremo sinistro, 1 = estremo destro, passando dall'alto."""
    a = math.pi * (1 - frazione)
    return k["centro"] + V(math.cos(a), -math.sin(a)) * (r or k["raggio"])


def arco(k, f0: float, f1: float) -> str:
    a, b = punto(k, f0), punto(k, f1)
    R = k["raggio"]
    return f"M{p(a)} A{n(R)} {n(R)} 0 {1 if (f1 - f0) > 1 else 0} 1 {p(b)}"


def scena(k: dict) -> str:
    W, H = k["tela"]
    f = k["percentuale"] / 100
    cur = punto(k, f)
    s = k["spessore"]
    ca, cb, cc = k["arco"]
    defs = [sfocatura("sfuma-ombra", 2.2, W, H), sfocatura("sfuma-piccola", 1.5, W, H),
            lineare("arco-luce", punto(k, 0), cur, [(0, ca), (0.55, cb), (1, cc)]),
            lineare("binario-luce", cur, punto(k, 1), [(0, k["binario"][0]), (1, k["binario"][1])]),
            lineare("cursore-luce", cur + V(-9, -9), cur + V(9, 9), [(0, k["cursore"][0]), (0.5, k["cursore"][1]), (1, k["cursore"][2])]),
            lineare("cifre-luce", V(0, k["scritta"][1] - 40), V(0, k["scritta"][1]), [(0, k["cifre"][0]), (1, k["cifre"][1])])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    corpo.append(f'<g id="indicatore" fill="none" stroke-linecap="round">'
                 f'<path id="binario" d="{arco(k, f, 1)}" stroke="url(#binario-luce)" stroke-width="{n(s)}"/>'
                 f'<path id="arco-pieno" d="{arco(k, 0, f)}" stroke="url(#arco-luce)" stroke-width="{n(s)}"/></g>')
    # riflesso: un filo chiaro lungo il bordo esterno dell'arco pieno
    Rr = k["raggio"] + s * 0.24
    a0, a1 = punto(k, 0.08, Rr), punto(k, f - 0.12, Rr)
    corpo.append(f'<path id="arco-luce-bordo" d="M{p(a0)} A{n(Rr)} {n(Rr)} 0 0 1 {p(a1)}" stroke="#FFFFFF" stroke-opacity="0.3" '
                 f'stroke-width="2.4" stroke-linecap="round" fill="none"/>')
    # cursore: disco rosso con l'anello bianco, esattamente sull'arco
    corpo.append(f'<g id="cursore">'
                 + ombra("cursore-ombra", cur.x + 1, cur.y + 4, 15, 14, "#475569", 0.22, "sfuma-piccola")
                 + f'<circle id="cursore-anello" cx="{n(cur.x)}" cy="{n(cur.y)}" r="{n(s * 0.78)}" fill="#FFFFFF"/>'
                   f'<circle id="cursore-disco" cx="{n(cur.x)}" cy="{n(cur.y)}" r="{n(s * 0.55)}" fill="url(#cursore-luce)"/>'
                   f'<path id="cursore-riflesso" d="M{p(cur + V(-6.2, -2.2))} A6.6 6.6 0 0 1 {p(cur + V(-1.8, -6.4))}" stroke="#FFFFFF" '
                   f'stroke-opacity="0.45" stroke-width="1.8" stroke-linecap="round" fill="none"/></g>')
    x, y, dim = k["scritta"]
    corpo.append(f'<g id="percentuale">' + testo("percentuale-cifre", f'{k["percentuale"]}%', 800, dim, x, y, "url(#cifre-luce)") + "</g>")
    return svg("Risultato / Probabilità", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "risultato-probabilita.svg"
        f.write_text(scena(k))
        print(f)
