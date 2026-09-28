"""
Successo: coppa con la stella e tre raggi di luce (kit blu).

    python3 strumenti/brand/illustrazioni/successo.py

Difetti dell'originale corretti: coppa e manici non simmetrici (il manico destro più piccolo e più
basso), stella storta, raggi di lunghezza e distanza diverse, macchie di colore.
Qui tutto è costruito su un asse (CX) e specchiato: coppa, manici, stelo, base e raggi.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402

BRAND = QUI.parents[2] / "brand"

W, H = 191, 171
CX = 89.5                      # asse di simmetria
C = {"chiaro": "#FFD27A", "base": "#FEBA3D", "scuro": "#F59E0B", "orlo": "#FDE2AA",
     "nuvola": "#FEF6EC", "ombra": "#F59E0B", "stella": "#FFFFFF"}


def specchio(punti: list[V]) -> list[V]:
    return [V(2 * CX - q.x, q.y) for q in punti]


def coppa() -> str:
    # metà sinistra della coppa, dall'orlo allo stelo (curva a tulipano)
    x0, y0 = 40, 51
    sx = (f"M{n(CX)} {n(y0)} L{n(x0 + 5)} {n(y0)} C{n(x0 + 1)} {n(y0)} {n(x0)} {n(y0 + 3)} {n(x0)} {n(y0 + 6)} "
          f"C{n(x0)} 96 {n(CX - 30)} 117 {n(CX - 10)} 121 L{n(CX)} 121")
    dx = (f"L{n(CX + 10)} 121 C{n(CX + 30)} 117 {n(2 * CX - x0)} 96 {n(2 * CX - x0)} {n(y0 + 6)} "
          f"C{n(2 * CX - x0)} {n(y0 + 3)} {n(2 * CX - x0 - 1)} {n(y0)} {n(2 * CX - x0 - 5)} {n(y0)} Z")
    return sx + " " + dx


def manico(lato: int) -> str:
    """Manico ad anello: un tratto spesso che esce dal bordo della coppa e rientra più in basso."""
    s = 1 if lato > 0 else -1
    a = V(CX + s * (CX - 40 - 1), 60)             # attacco alto, sul bordo della coppa
    b = V(CX + s * 30, 108)                       # attacco basso, sulla pancia
    c1 = V(CX + s * (CX - 16), 60)
    c2 = V(CX + s * (CX - 14), 96)
    return f"M{n(a.x)} {n(a.y)} C{n(c1.x)} {n(c1.y)} {n(c2.x)} {n(c2.y)} {n(b.x)} {n(b.y)}"


def stella(c: V, R: float, r: float) -> list[V]:
    return [c + V(math.sin(math.pi * k / 5) * (R if k % 2 == 0 else r), -math.cos(math.pi * k / 5) * (R if k % 2 == 0 else r))
            for k in range(10)]


def scena() -> str:
    defs = [sfocatura("sfuma-ombra", 2.2, W, H),
            lineare("coppa-luce", V(40, 0), V(139, 0), [(0, C["chiaro"]), (0.45, C["base"]), (1, C["scuro"])]),
            lineare("stelo-luce", V(76, 0), V(103, 0), [(0, C["chiaro"]), (1, C["scuro"])]),
            lineare("base-luce", V(0, 147), V(0, 166), [(0, C["base"]), (1, C["scuro"])]),
            lineare("manico-luce", V(0, 60), V(0, 110), [(0, C["chiaro"]), (1, C["scuro"])])]
    corpo = []
    corpo.append(f'<g id="nuvola" fill="{C["nuvola"]}"><ellipse cx="95" cy="92" rx="88" ry="66"/>'
                 f'<circle cx="40" cy="120" r="34"/><circle cx="150" cy="118" r="34"/></g>')
    corpo.append(f'<ellipse id="ombra" cx="{n(CX)}" cy="166" rx="40" ry="3.5" fill="{C["ombra"]}" opacity="0.22" filter="url(#sfuma-ombra)"/>')
    # raggi di luce: tre tratti uguali a ventaglio, simmetrici
    raggi = []
    for ang in (-42, 0, 42):
        a = math.radians(ang)
        d = V(math.sin(a), -math.cos(a))
        p0, p1 = V(CX, 60) + d * (31 if ang == 0 else 34), V(CX, 60) + d * (51 if ang == 0 else 48)
        raggi.append(f'<path d="M{n(p0.x)} {n(p0.y)} L{n(p1.x)} {n(p1.y)}"/>')
    corpo.append(f'<g id="raggi" stroke="{C["base"]}" stroke-width="6" stroke-linecap="round">{"".join(raggi)}</g>')
    # manici dietro la coppa
    corpo.append(f'<g id="manici" fill="none" stroke="url(#manico-luce)" stroke-width="9" stroke-linecap="round">'
                 f'<path id="manico-sinistro" d="{manico(-1)}"/><path id="manico-destro" d="{manico(1)}"/></g>')
    # stelo e base
    corpo.append(f'<path id="stelo" d="M{n(CX - 10)} 119 L{n(CX + 10)} 119 L{n(CX + 13)} 149 L{n(CX - 13)} 149 Z" fill="url(#stelo-luce)"/>')
    corpo.append(f'<rect id="base" x="{n(CX - 31)}" y="146" width="62" height="20" rx="8" fill="url(#base-luce)"/>')
    corpo.append(f'<rect id="base-riflesso" x="{n(CX - 25)}" y="149" width="50" height="3" rx="1.5" fill="#FFFFFF" opacity="0.35"/>')
    # coppa
    corpo.append(f'<path id="coppa" d="{coppa()}" fill="url(#coppa-luce)"/>')
    corpo.append(f'<path id="coppa-orlo" d="M44 51.5 H135 Q138.5 51.5 138.5 55 L138.5 57 H40.5 L40.5 55 Q40.5 51.5 44 51.5 Z" fill="{C["orlo"]}" opacity="0.55"/>')
    corpo.append(f'<path id="coppa-riflesso" d="M49 62 C49 84 56 100 66 110" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="5" '
                 f'stroke-linecap="round" fill="none"/>')
    corpo.append(f'<path id="stella" d="{arrotondato(stella(V(CX, 88), 19, 8.3), [1.6, 1.2] * 5)}" fill="{C["stella"]}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n<title>Successo</title>\n'
            f'<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-blu" / "illustrazioni" / "successo.svg"
    f.write_text(scena())
    print(f)
