"""
Variante per il tema scuro dei disegni SVG: la nuvola chiara dello sfondo (<g id="nuvola">) su un
fondo scuro diventerebbe una macchia bianca; qui diventa un alone appena percepibile, come nei PNG
«fondo-scuro». Il resto del disegno non cambia.

    python3 strumenti/brand/scuro_svg.py            # tutti i disegni: <nome>.maglie.svg -> <nome>.scuro.svg
"""
from __future__ import annotations

import pathlib
import re

BRAND = pathlib.Path(__file__).resolve().parents[2] / "brand"
OPACITA = 0.14


def scuro(svg: str) -> str:
    def cambia(m):
        tag = m.group(0)
        tag = re.sub(r'\sopacity="[^"]*"', "", tag)
        return tag[:-1] + f' opacity="{OPACITA}">'
    # solo il primo gruppo (quello esterno): i gruppi dentro la nuvola hanno id che iniziano allo stesso modo
    svg = re.sub(r'<g id="(?:nuvola|sfondo)[^"]*"[^>]*>', cambia, svg, count=1)
    # i bordini bianchi che imitano i contorni dell'originale ("…-alone", "alone-bianco") su fondo
    # scuro sembrerebbero un'aureola: nel tema scuro non si vedono
    def nascondi(m):
        tag = re.sub(r'\sopacity="[^"]*"', "", m.group(0))
        return tag[:-1].rstrip("/") + (' opacity="0"/>' if tag.endswith("/>") else ' opacity="0">')
    return re.sub(r'<(?:g|path|rect|circle|ellipse|polygon)\s[^>]*?\bid="(?:alone-bianco|[^"]*-alone)"[^>]*>', nascondi, svg)


def main():
    n = 0
    for f in sorted((BRAND / "disegni").rglob("*.maglie.svg")):
        dest = f.with_name(f.name.replace(".maglie.svg", ".scuro.svg"))
        s = f.read_text()
        dest.write_text(scuro(s))
        n += 1
        if 'id="nuvola' not in s and 'id="alone' not in s and 'id="sfondo' not in s:
            print("senza nuvola:", f.relative_to(BRAND))
    print(n, "varianti scure")


if __name__ == "__main__":
    main()
