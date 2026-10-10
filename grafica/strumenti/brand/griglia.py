"""
Vista ingrandita di un elemento con una griglia di coordinate: serve a chi disegna a mano gli SVG
per leggere posizioni e misure (in pixel dell'originale).

    python3 strumenti/brand/griglia.py kit-blu/illustrazioni/studio-inglese [uscita.png] [--k 5] [--passo 10]
"""
import argparse
import pathlib

from PIL import Image, ImageDraw

BRAND = pathlib.Path(__file__).resolve().parents[2] / "brand"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("elemento")
    ap.add_argument("uscita", nargs="?")
    ap.add_argument("--k", type=int, default=5)
    ap.add_argument("--passo", type=int, default=10)
    ap.add_argument("--riquadro", help="x0,y0,x1,y1: solo una parte")
    x = ap.parse_args()
    im = Image.open(BRAND / "elementi" / f"{x.elemento}.png").convert("RGBA")
    ox = oy = 0
    if x.riquadro:
        ox, oy, x1, y1 = (int(v) for v in x.riquadro.split(","))
        im = im.crop((ox, oy, x1, y1))
    fondo = Image.new("RGBA", im.size, (246, 248, 252, 255)); fondo.alpha_composite(im)
    k = x.k
    g = fondo.convert("RGB").resize((im.width * k, im.height * k), Image.NEAREST)
    d = ImageDraw.Draw(g)
    for X in range((ox // x.passo) * x.passo, ox + im.width + 1, x.passo):
        if X < ox: continue
        forte = X % (x.passo * 5) == 0
        d.line([((X - ox) * k, 0), ((X - ox) * k, g.height)], fill=(255, 0, 170) if forte else (255, 150, 220), width=1)
        if forte: d.text(((X - ox) * k + 2, 2), str(X), fill=(200, 0, 120))
    for Y in range((oy // x.passo) * x.passo, oy + im.height + 1, x.passo):
        if Y < oy: continue
        forte = Y % (x.passo * 5) == 0
        d.line([(0, (Y - oy) * k), (g.width, (Y - oy) * k)], fill=(0, 170, 255) if forte else (150, 210, 255), width=1)
        if forte: d.text((2, (Y - oy) * k + 2), str(Y), fill=(0, 100, 200))
    uscita = x.uscita or f"/tmp/griglia-{x.elemento.replace('/', '--')}.png"
    g.save(uscita)
    print(uscita, im.size)


if __name__ == "__main__":
    main()
