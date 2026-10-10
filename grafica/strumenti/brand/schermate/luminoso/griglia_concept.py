"""
Vista ingrandita di un elemento di brand/concept (id del catalogo, es. 16.022) con griglia di coordinate in pixel
dell'elemento. Serve per leggere posizioni e misure e per campionare i toni.

    python3 strumenti/brand/schermate/luminoso/griglia_concept.py 16.022 [uscita.png] [--k 5] [--passo 10] [--riquadro x0,y0,x1,y1]
"""
import argparse, json, pathlib, tempfile
from PIL import Image, ImageDraw

RADICE = pathlib.Path(__file__).resolve().parents[4]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id"); ap.add_argument("uscita", nargs="?")
    ap.add_argument("--k", type=int, default=5); ap.add_argument("--passo", type=int, default=10)
    ap.add_argument("--riquadro")
    x = ap.parse_args()
    cat = {i["id"]: i for i in json.load(open(RADICE / "brand/concept/catalogo.json"))}
    im = Image.open(RADICE / cat[x.id]["path"]).convert("RGBA")
    ox = oy = 0
    if x.riquadro:
        ox, oy, x1, y1 = (int(v) for v in x.riquadro.split(",")); im = im.crop((ox, oy, x1, y1))
    fondo = Image.new("RGBA", im.size, (255, 255, 255, 255)); fondo.alpha_composite(im)
    k = x.k
    g = fondo.convert("RGB").resize((im.width * k, im.height * k), Image.LANCZOS)
    d = ImageDraw.Draw(g)
    for X in range(((ox + x.passo - 1) // x.passo) * x.passo, ox + im.width + 1, x.passo):
        forte = X % (x.passo * 5) == 0
        d.line([((X - ox) * k, 0), ((X - ox) * k, g.height)], fill=(255, 0, 170) if forte else (255, 170, 230), width=1)
        if forte: d.text(((X - ox) * k + 2, 2), str(X), fill=(200, 0, 120))
    for Y in range(((oy + x.passo - 1) // x.passo) * x.passo, oy + im.height + 1, x.passo):
        forte = Y % (x.passo * 5) == 0
        d.line([(0, (Y - oy) * k), (g.width, (Y - oy) * k)], fill=(0, 170, 255) if forte else (170, 220, 255), width=1)
        if forte: d.text((2, (Y - oy) * k + 2), str(Y), fill=(0, 100, 200))
    out = x.uscita or str(pathlib.Path(tempfile.gettempdir()) / f"griglia-{x.id}.png")
    g.save(out); print(out, g.size)


if __name__ == "__main__":
    main()
