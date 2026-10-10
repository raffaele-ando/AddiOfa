"""
Testo in tracciati: trasforma una scritta in un <path> con il carattere Inter (quello dell'app),
così nei disegni SVG il testo si vede uguale ovunque (anche dove Inter non c'è) e si può adattare
e riempire come le altre forme.

    python3 strumenti/brand/testo_svg.py "82%" --peso 800 --dimensione 40 --x 60 --y 95 [--id percentuale] [--colore #EF4444]
    python3 strumenti/brand/testo_svg.py "A" --peso 700 --dimensione 14 --x 76 --y 45 --centro

--x/--y: punto della linea di base (a sinistra, o al centro con --centro). Stampa l'elemento <path>.
"""
from __future__ import annotations

import argparse
import pathlib

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONT = pathlib.Path(__file__).resolve().parents[2].parent / "app" / "node_modules" / "@fontsource" / "inter" / "files"


def tracciato(testo: str, peso: int, dimensione: float, x: float, y: float, centro=False, spaziatura=0.0) -> str:
    font = TTFont(FONT / f"inter-latin-{peso}-normal.woff2")
    glifi = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    s = dimensione / upm
    larghezze = [glifi[cmap[ord(c)]].width for c in testo]
    totale = sum(larghezze) * s + spaziatura * (len(testo) - 1)
    cx = x - totale / 2 if centro else x
    pen = SVGPathPen(glifi, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    for c, w in zip(testo, larghezze):
        # y del font verso l'alto, dell'SVG verso il basso
        glifi[cmap[ord(c)]].draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        cx += w * s + spaziatura
    return pen.getCommands()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("testo")
    ap.add_argument("--peso", type=int, default=700, choices=[400, 500, 600, 700, 800, 900])
    ap.add_argument("--dimensione", type=float, default=16)
    ap.add_argument("--x", type=float, default=0)
    ap.add_argument("--y", type=float, default=0)
    ap.add_argument("--centro", action="store_true")
    ap.add_argument("--spaziatura", type=float, default=0.0)
    ap.add_argument("--id", default="testo")
    ap.add_argument("--colore", default="#0F172A")
    x = ap.parse_args()
    d = tracciato(x.testo, x.peso, x.dimensione, x.x, x.y, x.centro, x.spaziatura)
    print(f'<path id="{x.id}" d="{d}" fill="{x.colore}"/>')


if __name__ == "__main__":
    main()
