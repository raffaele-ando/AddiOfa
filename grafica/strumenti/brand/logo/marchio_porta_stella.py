#!/usr/bin/env python3
"""Marchio «porta a stella» di AddiOFA (scelto dall'autore il 24/11/2026, tavola zip2-11, secondo pannello da destra).

Quadrato arrotondato blu; dentro, una porta blu notte a forma di stella le cui due punte basse
scendono fino al bordo come stipiti; nella porta una stella bianca illuminata dal basso.
Scrive grafica/brand/logo/marchio-porta-stella.svg (e la variante a tutto campo per le icone maskable).
Uso (dalla radice del repository): python3 grafica/strumenti/brand/logo/marchio_porta_stella.py
"""
import math
import pathlib

RADICE = pathlib.Path(__file__).resolve().parents[4]
OUT = RADICE / 'grafica' / 'brand' / 'logo'

LATO = 512
CX, CY = 256, 262          # centro della stella
R_EST, R_INT = 150, 66     # raggi della stella (punte, incavi)
CORNICE = 33               # spessore della porta blu notte


def punti_stella(cx, cy, r_est, r_int):
    p = []
    for i in range(10):
        a = math.radians(-90 + 36 * i)
        r = r_est if i % 2 == 0 else r_int
        p.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return p


def tracciato_porta(cx, cy, r_est, r_int, fondo):
    """Porta a stella: tre punte in alto e ai lati; sotto le braccia, due stipiti dritti fino a `fondo`.
    Proporzioni misurate sul riferimento (tessera 448 px): punta alta a 0,19 dell'altezza, braccia a 0,49,
    stipiti a 0,35 e 0,62 della larghezza (qui simmetrici attorno al centro)."""
    pts = [
        (256, 142),          # punta alta
        (290, 224),          # incavo in alto a destra
        (382, 246),          # punta destra
        (318, 318),          # incavo a destra, inizio dello stipite
        (318, fondo),
        (194, fondo),
        (194, 318),          # inizio dello stipite sinistro
        (130, 246),          # punta sinistra
        (222, 224),          # incavo in alto a sinistra
    ]
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + ' Z'


def svg(tutto_campo=False):
    m = 0 if tutto_campo else 32
    r = 0 if tutto_campo else 112
    lato = LATO - 2 * m
    fondo = LATO + 40  # gli stipiti escono dal bordo: li taglia la maschera
    porta = tracciato_porta(CX, CY, R_EST, R_INT, fondo)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LATO} {LATO}" width="{LATO}" height="{LATO}">
<title>AddiOFA</title>
<defs>
<linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4C8DFF"/><stop offset="1" stop-color="#2563EB"/></linearGradient>
<radialGradient id="luce" cx="256" cy="430" r="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#F3F7FF"/><stop offset="1" stop-color="#C9DBFF"/></radialGradient>
<radialGradient id="soglia" cx="256" cy="480" r="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
<clipPath id="tessera"><rect x="{m}" y="{m}" width="{lato}" height="{lato}" rx="{r}"/></clipPath>
</defs>
<g clip-path="url(#tessera)">
<rect x="{m}" y="{m}" width="{lato}" height="{lato}" fill="url(#fondo)"/>
<path d="{porta}" fill="#0E1B3F" stroke="#0E1B3F" stroke-width="{CORNICE * 2}" stroke-linejoin="round"/>
<path d="{porta}" fill="url(#luce)"/>
<ellipse cx="256" cy="{LATO - m}" rx="130" ry="46" fill="url(#soglia)"/>
</g>
</svg>
'''


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'marchio-porta-stella.svg').write_text(svg(), encoding='utf-8')
    (OUT / 'marchio-porta-stella-pieno-campo.svg').write_text(svg(tutto_campo=True), encoding='utf-8')
    print('scritti:', OUT / 'marchio-porta-stella.svg', OUT / 'marchio-porta-stella-pieno-campo.svg')
