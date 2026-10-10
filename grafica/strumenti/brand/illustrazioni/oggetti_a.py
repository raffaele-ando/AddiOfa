"""
Pezzi ricorrenti delle illustrazioni del kit (nuvola, ombre, distintivi tondi con spunta o croce,
righe di testo, fogli, tracciati lisci, testo in tracciati). Completa oggetti.py senza toccarlo:
ogni funzione restituisce SVG con id in italiano su ogni pezzo.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, p, sfocatura  # noqa: E402,F401
from testo_svg import tracciato  # noqa: E402


# ---------------------------------------------------------------- tela e sfondo

def svg(titolo: str, W: float, H: float, defs: list[str], corpo: list[str]) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(W)} {n(H)}" width="{n(W)}" height="{n(H)}">\n'
            f'<title>{titolo}</title>\n<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


def nuvola(forme, colore: str, id_: str = "nuvola") -> str:
    """Sfondo a nuvola: ellissi (cx, cy, rx, ry) dello stesso colore, bordi netti."""
    return (f'<g id="{id_}" fill="{colore}">'
            + "".join(f'<ellipse cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}"/>' for cx, cy, rx, ry in forme) + "</g>")


def ombra(id_: str, cx, cy, rx, ry, colore: str, opacita=0.16, filtro="sfuma-ombra") -> str:
    return (f'<ellipse id="{id_}" cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="{colore}" '
            f'opacity="{n(opacita)}" filter="url(#{filtro})"/>')


# ---------------------------------------------------------------- geometria

def ruota(q: V, c: V, gradi: float) -> V:
    a = math.radians(gradi)
    d = q - c
    return c + V(d.x * math.cos(a) - d.y * math.sin(a), d.x * math.sin(a) + d.y * math.cos(a))


def rettangolo(x, y, w, h, raggi) -> str:
    """Rettangolo con raccordi veri, raggi per angolo (alto-sx, alto-dx, basso-dx, basso-sx)."""
    return arrotondato([V(x, y), V(x + w, y), V(x + w, y + h), V(x, y + h)], raggi)


def liscio(punti: list[V], chiuso=True, tensione=1.0) -> str:
    """Curva morbida che passa per i punti (Catmull-Rom → cubiche): per contorni organici
    (continenti, capelli) senza spigoli."""
    k = len(punti)
    if k < 3:
        return "M" + " L".join(p(q) for q in punti)
    d = f"M{p(punti[0])}"
    ult = k if chiuso else k - 1
    for i in range(ult):
        P0 = punti[(i - 1) % k] if (chiuso or i > 0) else punti[0]
        P1, P2 = punti[i], punti[(i + 1) % k]
        P3 = punti[(i + 2) % k] if (chiuso or i + 2 < k) else P2
        c1 = P1 + (P2 - P0) * (tensione / 6)
        c2 = P2 - (P3 - P1) * (tensione / 6)
        d += f" C{p(c1)} {p(c2)} {p(P2)}"
    return d + (" Z" if chiuso else "")


# ---------------------------------------------------------------- pezzi

def barra(id_: str, a: V, b: V, spessore: float, colore: str, opacita: float | None = None) -> str:
    """Riga di testo finta / raggio di luce: un tratto con le estremità tonde."""
    op = f' stroke-opacity="{n(opacita)}"' if opacita is not None else ""
    return (f'<path id="{id_}" d="M{p(a)} L{p(b)}" stroke="{colore}"{op} stroke-width="{n(spessore)}" '
            f'stroke-linecap="round" fill="none"/>')


def spunta(c: V, s: float) -> str:
    """Tracciato della spunta ✓ centrata in c, larga circa 2s (da disegnare con un tratto tondo)."""
    a, b, e = c + V(-0.92, 0.02) * s, c + V(-0.3, 0.62) * s, c + V(0.95, -0.62) * s
    return f"M{p(a)} L{p(b)} L{p(e)}"


def croce(c: V, s: float) -> str:
    """Tracciato della croce ✕ centrata in c (due tratti di mezza diagonale s)."""
    return (f"M{p(c + V(-s, -s))} L{p(c + V(s, s))} M{p(c + V(s, -s))} L{p(c + V(-s, s))}")


def distintivo(nome: str, c: V, r: float, colori: tuple[str, str, str], simbolo: str = "spunta",
               bordo: float = 2.5, spessore_segno: float | None = None) -> tuple[str, str]:
    """Distintivo tondo (✓ ✕ !): cerchio pieno con sfumatura dall'alto a sinistra, bordo bianco,
    un riflesso a mezzaluna in alto e il simbolo bianco centrato. colori = (chiaro, base, scuro)."""
    chiaro, base, scuro = colori
    defs = lineare(f"{nome}-luce", c + V(-r, -r) * 0.75, c + V(r, r) * 0.8, [(0, chiaro), (0.5, base), (1, scuro)])
    sp = spessore_segno or r * 0.3
    if simbolo == "spunta":
        seg = f'<path id="{nome}-simbolo" d="{spunta(c + V(0.02, 0.05) * r, r * 0.46)}" stroke="#FFFFFF" stroke-width="{n(sp)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    elif simbolo == "croce":
        seg = f'<path id="{nome}-simbolo" d="{croce(c, r * 0.3)}" stroke="#FFFFFF" stroke-width="{n(sp)}" stroke-linecap="round" fill="none"/>'
    else:
        seg = ""
    # riflesso: mezzaluna chiara tra due archi, in alto a sinistra
    ro = r * 0.84
    a0, a1 = math.radians(200), math.radians(262)
    P = lambda rr, a: c + V(math.cos(a), math.sin(a)) * rr  # noqa: E731
    rifl = (f'<path id="{nome}-riflesso" d="M{p(P(ro, a0))} A{n(ro)} {n(ro)} 0 0 1 {p(P(ro, a1))}" stroke="#FFFFFF" '
            f'stroke-opacity="0.35" stroke-width="{n(r * 0.1)}" stroke-linecap="round" fill="none"/>')
    corpo = (f'<g id="{nome}">'
             f'<circle id="{nome}-bordo" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r + bordo)}" fill="#FFFFFF"/>'
             f'<circle id="{nome}-disco" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="url(#{nome}-luce)"/>'
             f'{rifl}{seg}</g>')
    return defs, corpo


def testo(id_: str, s: str, peso: int, dimensione: float, x: float, y: float, colore: str,
          centro=True, spaziatura=0.0, extra: str = "") -> str:
    """Scritta vera in tracciati (Inter), centrata su x se centro."""
    return f'<path id="{id_}" d="{tracciato(s, peso, dimensione, x, y, centro, spaziatura)}" fill="{colore}"{extra}/>'
