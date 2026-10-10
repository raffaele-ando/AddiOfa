"""
Altri oggetti ricorrenti delle illustrazioni (in aggiunta a oggetti.py), costruiti per bene e con
parametri. Ogni funzione restituisce stringhe SVG con id in italiano su ogni pezzo.

    nuvola(colore, forme)                 sfondo a nuvola: ellissi dello stesso colore
    ombra(nome, cx, cy, rx, ry, ...)      ombra morbida sotto un oggetto (serve il filtro "sfuma-ombra")
    fumetto(nome, x0, y0, x1, y1, ...)    fumetto: rettangolo arrotondato con la coda, una sola sagoma
    svg(W, H, titolo, defs, corpo)        il documento intero
"""
from __future__ import annotations

import math
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from geometria import V, arrotondato, n  # noqa: E402


def nuvola(colore: str, forme: list[tuple], nome: str = "nuvola") -> str:
    """forme: (cx, cy, rx, ry) oppure (cx, cy, r)."""
    el = []
    for f in forme:
        if len(f) == 3:
            el.append(f'<circle cx="{n(f[0])}" cy="{n(f[1])}" r="{n(f[2])}"/>')
        else:
            el.append(f'<ellipse cx="{n(f[0])}" cy="{n(f[1])}" rx="{n(f[2])}" ry="{n(f[3])}"/>')
    return f'<g id="{nome}" fill="{colore}">{"".join(el)}</g>'


def ombra(nome: str, cx: float, cy: float, rx: float, ry: float, colore: str, opacita: float = 0.16,
          filtro: str = "sfuma-ombra") -> str:
    return (f'<ellipse id="{nome}" cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="{colore}" '
            f'opacity="{n(opacita)}" filter="url(#{filtro})"/>')


def fumetto(x0: float, y0: float, x1: float, y1: float, r: float, coda: tuple[float, float, V],
            r_coda: float = 2.0, r_attacco: float = 3.0) -> str:
    """Sagoma di un fumetto in un solo tracciato: rettangolo con angoli raccordati e la coda sul lato
    di sotto. coda = (xa, xb, punta): la coda parte dal bordo inferiore tra xa e xb (xa < xb) e
    finisce nella punta; gli attacchi (concavi) sono raccordati anche loro, così non c'è uno spigolo."""
    xa, xb, punta = coda
    punti = [V(x0, y0), V(x1, y0), V(x1, y1), V(xb, y1), punta, V(xa, y1), V(x0, y1)]
    raggi = [r, r, r, r_attacco, r_coda, r_attacco, r]
    return arrotondato(punti, raggi)


def svg(W: int, H: int, titolo: str, defs: list[str], corpo: list[str]) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n'
            f'<title>{titolo}</title>\n<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


def polare(c: V, r: float, gradi: float) -> V:
    """Punto sul cerchio: 0° a destra, 90° in alto (come in matematica, y dell'SVG verso il basso)."""
    a = math.radians(gradi)
    return V(c.x + r * math.cos(a), c.y - r * math.sin(a))
