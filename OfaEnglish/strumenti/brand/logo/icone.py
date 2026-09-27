"""
Rigenera le icone dell'app dal logo SVG costruito: una sola fonte per il marchio (come in Agorà,
scripts/generate-icons.ts). Per le icone PWA serve la piastrella a pieno campo, senza fondo
bianco e senza ombra: Android e iOS applicano la loro maschera agli angoli.

    python3 strumenti/brand/logo/icone.py
"""
from __future__ import annotations

import pathlib
import re
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
sys.path.insert(0, str(QUI))

from logo import carica, svg, LATO  # noqa: E402
from render import Renderer  # noqa: E402

PUBBLICO = QUI.parents[2] / "public"


def pieno_campo(P) -> str:
    """Solo la scena, ritagliata al quadrato della piastrella (senza angoli, fondo e ombra)."""
    t = P["piastrella"]
    s = svg(P, sfondo=False)
    s = re.sub(r'<path id="ombra"[^>]*/>', "", s)
    s = s.replace('clip-path="url(#piastrella)"', "")
    lato = min(t["x1"] - t["x0"], t["y1"] - t["y0"])
    return s.replace(f'viewBox="0 0 {LATO} {LATO}"', f'viewBox="{t["x0"]:.1f} {t["y0"]:.1f} {lato:.1f} {lato:.1f}"', 1)


def main():
    P = carica()
    sorgente = pieno_campo(P)
    (QUI / "addiofa-icona-pieno-campo.svg").write_text(sorgente)
    with Renderer() as r:
        for lato, nome in [(512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png"), (64, "favicon-64.png")]:
            s = re.sub(r'width="\d+" height="\d+"', f'width="{lato}" height="{lato}"', sorgente, count=1)
            r.svg(s, lato, lato).convert("RGB").save(PUBBLICO / nome, optimize=True)
            print(PUBBLICO / nome)


if __name__ == "__main__":
    main()
