"""Tavole di controllo s4 (immagine 18): originale | disegno | differenza.  python3 controlla.py [n ...]  (senza n: tutte + tavola d'insieme)
Il disegno e' la parte bianca del telefono (x0..x1,y0..y1 di FIN18) rimessa sul fondo del ritaglio."""
import re, sys
import numpy as np
from PIL import Image
from comp_s4 import *
from comp_s4 import FIN18, NOMI18, percorso18, svg18, TAVOLE
sys.path.insert(0, str(RADICE / "strumenti/brand"))
from render import Renderer, confronta

def una(r, n_, k=3):
    x0, x1, y0, y1 = FIN18[n_]
    o = Image.open(percorso18(n_)).convert("RGB")
    O = o.resize((int(o.width * k), int(o.height * k)), Image.LANCZOS)
    W, H = int(round((x1 - x0) * k)), int(round((y1 - y0) * k))
    svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', svg18(n_).read_text(), count=1)
    im = r.svg(svg, W, H, fondo="transparent")
    fondo = O.copy()
    fondo.paste(im.convert("RGB"), (int(round(x0 * k)), int(round(y0 * k))), im.split()[3])
    a = np.asarray(O).astype(float); b = np.asarray(fondo).astype(float)
    xa, xb, ya, yb = [int(round(v * k)) for v in (x0, x1, y0, y1)]
    m = confronta(a[ya:yb, xa:xb], b[ya:yb, xa:xb])
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    d = np.stack([255 - diff] * 3, axis=2).astype(np.uint8)
    T = Image.new("RGB", (O.width * 3 + 24, O.height), (255, 255, 255))
    T.paste(O, (0, 0)); T.paste(fondo, (O.width + 12, 0)); T.paste(Image.fromarray(d), (2 * O.width + 24, 0))
    TAVOLE.mkdir(parents=True, exist_ok=True)
    out = TAVOLE / f"18-{n_:02d}-{NOMI18[n_]}.png"; T.save(out)
    return m, out

def insieme(r, k=2.0):
    imgs = []
    for n_ in range(1, 10):
        x0, x1, y0, y1 = FIN18[n_]
        W, H = int(round((x1 - x0) * k)), int(round((y1 - y0) * k))
        svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', svg18(n_).read_text(), count=1)
        im = r.svg(svg, W, H, fondo="transparent")
        b = Image.new("RGB", im.size, (255, 255, 255)); b.paste(im.convert("RGB"), (0, 0), im.split()[3]); imgs.append(b)
    Wm = max(i.width for i in imgs); Hm = max(i.height for i in imgs)
    S = Image.new("RGB", (5 * (Wm + 14) + 14, 2 * (Hm + 14) + 14), (230, 233, 238))
    for i, im in enumerate(imgs):
        S.paste(im, (14 + (i % 5) * (Wm + 14), 14 + (i // 5) * (Hm + 14)))
    out = TAVOLE / "18-_tavola.png"; S.save(out); return out

if __name__ == "__main__":
    nums = [int(a) for a in sys.argv[1:]] or list(range(1, 10))
    with Renderer() as r:
        for n_ in nums:
            m, out = una(r, n_); print(n_, NOMI18[n_], m, out)
        if len(sys.argv) == 1: print(insieme(r))
