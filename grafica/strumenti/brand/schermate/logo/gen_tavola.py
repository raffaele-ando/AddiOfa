"""Tavola d'insieme di tutte le varianti del logo: brand/concept-svg/logo/_tavola.png (SVG resi in Chromium, fondo bianco)."""
import re, sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parents[1]))
from PIL import Image, ImageDraw
from render import Renderer
from rif import RADICE

DIR = RADICE / "brand/concept-svg/logo"
ICONA = RADICE / "strumenti/brand/logo/addiofa-logo.svg"
H, COL, M = 150, 4, 16


def rende(r, p):
    s = p.read_text()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    w, h = vb[2], vb[3]
    k = H / h if w * H / h <= 330 else 330 / w
    W, Hh = max(1, int(w * k)), max(1, int(h * k))
    s2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{Hh}"', s, count=1)
    return r.svg(s2, W, Hh, fondo="#FFFFFF").convert("RGB")


def main():
    files = [ICONA] + sorted(DIR.glob("*.svg"))
    with Renderer() as r:
        ims = [(p.stem if p != ICONA else "icona-app-stella (riuso)", rende(r, p)) for p in files]
    cw = 340
    rows = (len(ims) + COL - 1) // COL
    T = Image.new("RGB", (COL * (cw + M) + M, rows * (H + 40) + M), (238, 240, 245)); d = ImageDraw.Draw(T)
    for i, (nome, im) in enumerate(ims):
        x, y = M + (i % COL) * (cw + M), M + (i // COL) * (H + 40)
        d.rectangle([x, y, x + cw, y + H + 22], fill="white")
        T.paste(im, (x + (cw - im.width) // 2, y + 4 + (H - im.height) // 2))
        d.text((x + 4, y + H + 6), nome, fill=(60, 60, 80))
    T.save(DIR / "_tavola.png"); print(DIR / "_tavola.png", len(ims))


if __name__ == "__main__":
    main()
