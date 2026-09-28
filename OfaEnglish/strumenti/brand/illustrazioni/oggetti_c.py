"""
Pezzi riutilizzabili per le illustrazioni del kit rosso (e non solo), in aggiunta a oggetti.py:
polilinee aperte con raccordi veri, spunte, righe di testo, bandiera piccola, cornici.

Ogni funzione restituisce stringhe SVG (d di un path, o elementi) con id in italiano.
"""
from __future__ import annotations

import math
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from geometria import V, n, p  # noqa: E402


def raccordata(punti: list[V], raggi) -> str:
    """Path SVG di una polilinea APERTA con gli angoli interni raccordati da archi veri (tangenti ai
    due lati). `raggi`: uno per vertice interno (len(punti) - 2) o un numero solo."""
    k = len(punti)
    rs = raggi if isinstance(raggi, (list, tuple)) else [raggi] * (k - 2)
    d = f"M{p(punti[0])}"
    for i in range(1, k - 1):
        P, A, B = punti[i], punti[i - 1], punti[i + 1]
        a, b = (A - P).uni(), (B - P).uni()
        ang = math.acos(max(-1.0, min(1.0, a.x * b.x + a.y * b.y)))
        r = rs[i - 1]
        if r <= 0 or ang < 1e-3 or abs(math.pi - ang) < 1e-3:
            d += f" L{p(P)}"; continue
        t = min(r / math.tan(ang / 2), (A - P).lung() * (1 if i == 1 else 0.5), (B - P).lung() * (1 if i == k - 2 else 0.5))
        r = t * math.tan(ang / 2)
        e, u = P + a * t, P + b * t
        h = 4 / 3 * math.tan((math.pi - ang) / 4) * r
        d += f" L{p(e)} C{p(e + (-a) * h)} {p(u + (-b) * h)} {p(u)}"
    return d + f" L{p(punti[-1])}"


def spunta(c: V, lato: float) -> str:
    """Tratto della spunta ✓ centrata in c, grande `lato` (da disegnare con stroke rotondo)."""
    s = lato
    return raccordata([c + V(-0.36 * s, 0.02 * s), c + V(-0.1 * s, 0.27 * s), c + V(0.38 * s, -0.24 * s)], [0.04 * s])


def arco(c: V, r: float, a0: float, a1: float) -> str:
    """Arco di cerchio (gradi, 0 = destra, senso orario come l'asse y dell'SVG) da a0 ad a1."""
    q0 = c + V(math.cos(math.radians(a0)), math.sin(math.radians(a0))) * r
    q1 = c + V(math.cos(math.radians(a1)), math.sin(math.radians(a1))) * r
    grande = 1 if abs(a1 - a0) > 180 else 0
    verso = 1 if a1 > a0 else 0
    return f"M{p(q0)} A{n(r)} {n(r)} 0 {grande} {verso} {p(q1)}"


def raggio_luce(c: V, angolo: float, dentro: float, fuori: float) -> str:
    """Tratto radiale (un 'raggio' di luce o di movimento) dal centro c, angolo in gradi come arco()."""
    d = V(math.cos(math.radians(angolo)), math.sin(math.radians(angolo)))
    return f"M{p(c + d * dentro)} L{p(c + d * fuori)}"


def documento(W: float, H: float, titolo: str, defs: list[str], corpo: list[str]) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(W)} {n(H)}" width="{n(W)}" height="{n(H)}">\n'
            f'<title>{titolo}</title>\n<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")
