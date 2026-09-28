"""
Suggerimenti / Consigli: lampadina accesa con cinque raggi.

    python3 strumenti/brand/illustrazioni/suggerimenti_consigli.py

Difetti dell'originale corretti: raggi a distanze diverse dal bulbo (58–63 px) e non diretti verso
il centro, filamento impastato con una striscia arancione nel mezzo, anelli dell'attacco sbavati e
con i bordi seghettati, frange bianche attorno a tutto. Qui: tutto costruito sull'asse CX e
specchiato; bulbo = cerchio + collo raccordato in tangenza; raggi radiali tutti uguali (stessa
distanza e lunghezza, a 45°); attacco con due anelli uguali e punta raccordata; filamento a due
steli con il ricciolo, a tratto costante.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, p, sfocatura  # noqa: E402
from oggetti_a import barra, nuvola, ombra, rettangolo, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (185, 158), "nuvola": "#FFF6EA", "ombra": "#1E3A66",
        "nuvola_forme": [(80.3, 85.9, 78.5, 66.3), (115.4, 110.6, 67, 46.9), (49.8, 108.2, 49.3, 49.3)],
        "asse": 93, "bulbo": (80, 38.3), "collo": (18, 119, 126),   # mezza larghezza, inizio curva, fondo
        "vetro": ("#FFDA88", "#FEC85E", "#FDB93F"),
        "attacco": ("#2B456E", "#50709F", "#243C62"), "punta": ("#1E3A63", "#132A4B"),
        "raggi": {"centro_y": 76, "da": 51, "a": 68, "angoli": [180, 135, 90, 45, 0], "spessore": 7.5, "colore": "#FDB012"},
    },
}


def bulbo(k: dict) -> str:
    CX = k["asse"]
    cy, R = k["bulbo"]
    w, y_curva, y_fondo = k["collo"]
    # punto di tangenza sul cerchio (48° sotto l'orizzontale) e direzione della tangente
    a = math.radians(48)
    T = V(CX - R * math.cos(a), cy + R * math.sin(a))
    tang = V(-math.sin(a), -math.cos(a))            # verso l'alto lungo il cerchio, lato sinistro
    c1 = V(CX - w, y_curva - 7)
    c2 = T - tang * 7
    Ts = V(2 * CX - T.x, T.y)
    c2s, c1s = V(2 * CX - c2.x, c2.y), V(2 * CX - c1.x, c1.y)
    return (f"M{n(CX - w)} {n(y_fondo)} L{n(CX - w)} {n(y_curva)} C{p(c1)} {p(c2)} {p(T)} "
            f"A{n(R)} {n(R)} 0 1 1 {p(Ts)} C{p(c2s)} {p(c1s)} {n(CX + w)} {n(y_curva)} L{n(CX + w)} {n(y_fondo)} Z")


def filamento(k: dict) -> str:
    """Due steli verticali che in alto si piegano verso l'esterno con un ricciolo (metà + specchio)."""
    CX = k["asse"]
    lati = []
    for s in (-1, 1):
        x0 = CX + s * 5.5
        lati.append(f"M{n(x0)} 125 L{n(x0)} 103 C{n(x0)} 99 {n(x0 + s * 3)} 97 {n(x0 + s * 6)} 95.5 "
                    f"C{n(x0 + s * 9)} 94 {n(x0 + s * 9.5)} 90 {n(x0 + s * 8.5)} 88.5")
    return " ".join(lati)


def scena(k: dict) -> str:
    W, H = k["tela"]
    CX = k["asse"]
    cy, R = k["bulbo"]
    w, _, y_fondo = k["collo"]
    v1, v2, v3 = k["vetro"]
    defs = [sfocatura("sfuma-ombra", 2, W, H),
            lineare("vetro-luce", V(CX - R, cy - R), V(CX + R * 0.7, y_fondo), [(0, v1), (0.5, v2), (1, v3)]),
            lineare("attacco-luce", V(CX - w - 2, 0), V(CX + w + 2, 0), [(0, k["attacco"][0]), (0.3, k["attacco"][1]), (1, k["attacco"][2])]),
            lineare("punta-luce", V(CX - 12, 0), V(CX + 12, 0), [(0, k["punta"][0]), (1, k["punta"][1])])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    # raggi: radiali, tutti uguali
    rg = k["raggi"]
    O = V(CX, rg["centro_y"])
    raggi = []
    for i, ang in enumerate(rg["angoli"]):
        d = V(math.cos(math.radians(ang)), -math.sin(math.radians(ang)))
        raggi.append(barra(f"raggio-{i + 1}", O + d * rg["da"], O + d * rg["a"], rg["spessore"], rg["colore"]))
    corpo.append('<g id="raggi">' + "".join(raggi) + "</g>")
    corpo.append(ombra("ombra", CX, 153.5, 16, 2.5, k["ombra"], 0.2))
    # lampadina: bulbo, riflesso, filamento, attacco
    g = [f'<path id="bulbo" d="{bulbo(k)}" fill="url(#vetro-luce)"/>']
    ri = R * 0.72
    a0, a1 = math.radians(196), math.radians(252)
    P0 = V(CX + ri * math.cos(a0), cy + ri * math.sin(a0))
    P1 = V(CX + ri * math.cos(a1), cy + ri * math.sin(a1))
    g.append(f'<path id="bulbo-riflesso" d="M{p(P0)} A{n(ri)} {n(ri)} 0 0 1 {p(P1)}" stroke="#FFFFFF" stroke-opacity="0.45" '
             f'stroke-width="5" stroke-linecap="round" fill="none"/>')
    g.append(f'<path id="filamento" d="{filamento(k)}" stroke="#FFFFFF" stroke-opacity="0.75" stroke-width="3.6" '
             f'stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
    # attacco: corpo, due anelli uguali, punta
    x0, x1 = CX - w - 1, CX + w + 1
    att = [f'<path id="attacco-corpo" d="{rettangolo(x0 + 2, y_fondo - 1, x1 - x0 - 4, 21, 3)}" fill="url(#attacco-luce)"/>']
    for i, y in enumerate((y_fondo - 1, y_fondo + 9)):
        att.append(f'<path id="attacco-anello-{i + 1}" d="{rettangolo(x0, y, x1 - x0, 9, 4.5)}" fill="url(#attacco-luce)"/>'
                   f'<path d="M{n(x0 + 5)} {n(y + 2.6)} H{n(x1 - 12)}" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.5" stroke-linecap="round"/>')
    punta = arrotondato([V(CX - 12, y_fondo + 17), V(CX + 12, y_fondo + 17), V(CX + 6, y_fondo + 26), V(CX - 6, y_fondo + 26)], [2, 2, 3, 3])
    att.insert(0, f'<path id="attacco-punta" d="{punta}" fill="url(#punta-luce)"/>')
    g.append('<g id="attacco">' + "".join(att) + "</g>")
    corpo.append('<g id="lampadina">' + "".join(g) + "</g>")
    return svg("Suggerimenti / Consigli", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "suggerimenti-consigli.svg"
        f.write_text(scena(k))
        print(f)
