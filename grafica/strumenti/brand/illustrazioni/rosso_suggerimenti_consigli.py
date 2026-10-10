"""
Suggerimenti / consigli: lampadina accesa con cinque raggi (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_suggerimenti_consigli.py

Difetti dell'originale corretti: raggi con angoli e lunghezze diverse, collo del bulbo un po' storto,
filamento a righe doppie e sfocate, anelli dell'attacco di altezze diverse, una macchia rosa
sfrangiata a destra (mezza nuvola tagliata) e alone bianco.
Qui: bulbo simmetrico sull'asse CX (cerchio + collo raccordato), filamento a Y a tratto unico
specchiato, attacco con due anelli uguali e il fondello, cinque raggi a ventaglio uguali e
radiali dal centro del bulbo, nuvola rosa pallida pulita dietro a destra (come nell'originale).
Il gruppo `raggi` si può animare da solo (luce che pulsa).
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, p  # noqa: E402
from oggetti_c import arco, documento, raggio_luce  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 142, 146
CX = 71
C = {"nuvola": "#FEF1F1", "bulbo": ("#FEDA82", "#FDCB5B", "#FBBD3E"), "raggi": "#FECB5C",
     "filamento": "#FFF1CC", "attacco": ("#4A5F80", "#2B405F"), "fondello": ("#24395A", "#11243E")}
CENTRO, R = V(CX, 72), 37                 # sfera del bulbo
GIUNTO = 140                              # angolo (gradi, 0 = destra, 90 = giù) dove la sfera passa al collo
COLLO = (17, 113)                         # mezza larghezza e y del fondo del vetro
ANELLI = [(17.2, 113, 122.5), (16.4, 122, 131)]   # mezza larghezza, y alto, y basso
FONDELLO = (11, 129, 138.5)
RAGGI = [270 + k * 38 for k in (-2, -1, 0, 1, 2)]
RAGGIO_DENTRO, RAGGIO_FUORI = 52, 64


def bulbo() -> str:
    a = math.radians(GIUNTO)
    g = CENTRO + V(math.cos(a), math.sin(a)) * R            # giunto a sinistra
    t = V(math.sin(a), -math.cos(a))                         # tangente verso il basso, verso il collo
    mx, fy = COLLO
    c1, c2, fondo = g + t * 9, V(CX - mx, fy - 8), V(CX - mx, fy)
    gd = V(2 * CX - g.x, g.y)
    s = lambda q: V(2 * CX - q.x, q.y)                        # specchio sull'asse
    return (f"M{p(gd)} A{n(R)} {n(R)} 0 1 0 {p(g)} C{p(c1)} {p(c2)} {p(fondo)} L{p(s(fondo))} "
            f"C{p(s(c2))} {p(s(c1))} {p(gd)} Z")


def filamento() -> str:
    parti = []
    for s in (-1, 1):
        x = CX + s * 6
        parti.append(f"M{n(x)} {n(COLLO[1] + 1)} V95 C{n(x)} 89 {n(x + s * 4.5)} 86.5 {n(x + s * 7.5)} 82.5")
    return " ".join(parti)


def scena() -> str:
    defs = [lineare("bulbo-luce", CENTRO + V(-26, -30), CENTRO + V(24, 40),
                    [(0, C["bulbo"][0]), (0.5, C["bulbo"][1]), (1, C["bulbo"][2])]),
            lineare("attacco-luce", V(0, ANELLI[0][1]), V(0, ANELLI[1][2]), [(0, C["attacco"][0]), (1, C["attacco"][1])]),
            lineare("fondello-luce", V(0, FONDELLO[1]), V(0, FONDELLO[2]), [(0, C["fondello"][0]), (1, C["fondello"][1])])]
    corpo = [f'<g id="nuvola" fill="{C["nuvola"]}"><circle cx="96" cy="62" r="33"/><circle cx="108" cy="96" r="29"/><circle cx="92" cy="112" r="25"/></g>']
    raggi = "".join(f'<path id="raggio-{i + 1}" d="{raggio_luce(CENTRO, a, RAGGIO_DENTRO, RAGGIO_FUORI)}"/>' for i, a in enumerate(RAGGI))
    corpo.append(f'<g id="raggi" stroke="{C["raggi"]}" stroke-width="6.5" stroke-linecap="round" fill="none">{raggi}</g>')
    # attacco: fondello, due anelli uguali con il solco tra loro
    mf, f0, f1 = FONDELLO
    fondello = f"M{n(CX - mf)} {n(f0)} H{n(CX + mf)} A{n(mf)} {n(f1 - f0)} 0 0 1 {n(CX - mf)} {n(f0)} Z"   # mezza ellisse
    anelli = "".join(f'<rect id="anello-{i + 1}" x="{n(CX - m)}" y="{n(y0)}" width="{n(2 * m)}" height="{n(y1 - y0)}" rx="4.4"/>'
                     for i, (m, y0, y1) in enumerate(ANELLI))
    corpo.append(f'<g id="attacco"><path id="fondello" d="{fondello}" fill="url(#fondello-luce)"/>'
                 f'<g id="anelli" fill="url(#attacco-luce)">{anelli}</g>'
                 f'<path id="anelli-solco" d="M{n(CX - 15)} 122.3 H{n(CX + 15)}" stroke="#15294A" stroke-opacity="0.55" stroke-width="1" stroke-linecap="round"/>'
                 + "".join(f'<path id="anello-{i + 1}-riflesso" d="M{n(CX - m + 4)} {n(y0 + 2.4)} H{n(CX + m - 7)}" stroke="#FFFFFF" '
                           f'stroke-opacity="0.28" stroke-width="1.4" stroke-linecap="round"/>' for i, (m, y0, _) in enumerate(ANELLI))
                 + '</g>')
    # bulbo di vetro, filamento, riflesso
    corpo.append(f'<g id="lampadina"><path id="bulbo" d="{bulbo()}" fill="url(#bulbo-luce)"/>'
                 f'<path id="filamento" d="{filamento()}" fill="none" stroke="{C["filamento"]}" stroke-width="3.6" '
                 f'stroke-linecap="round" stroke-linejoin="round"/>'
                 f'<path id="bulbo-riflesso" d="{arco(CENTRO, 28, 196, 236)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.45" '
                 f'stroke-width="4.5" stroke-linecap="round"/></g>')
    return documento(W, H, "Suggerimenti / Consigli", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "suggerimenti-consigli.svg"
    f.write_text(scena())
    print(f)
