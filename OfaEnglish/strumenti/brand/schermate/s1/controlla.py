"""
Tavole di controllo del funnel rosso.

    python3 controlla.py 5            # una schermata: originale | disegno | differenza  (k = 3)
    python3 controlla.py              # tutte, una tavola ciascuna + la tavola d'insieme _tavola.png (14 schermate affiancate)

Il disegno è la sola parte bianca del telefono: per confrontarlo con il ritaglio si rende alla scala del ritaglio e si
ricolloca sul fondo grigio (x0..x1 di componenti.SCHERMATE). Lo scarto è calcolato solo sull'area del telefono.
"""
import re
import sys
import numpy as np
from PIL import Image, ImageDraw

from componenti import *  # noqa
from componenti import SCHERMATE, NOMI, percorso_originale, percorso_svg, TAVOLE_DIR
sys.path.insert(0, str(RADICE / "strumenti/brand"))
from render import Renderer, confronta  # noqa: E402

FONDO = (246, 247, 247)


def rendi(r, n_, k):
    x0, x1, h = SCHERMATE[n_]
    W, H = int(round((x1 - x0) * k)), int(round(h * k))
    svg = percorso_svg(n_).read_text()
    svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', svg, count=1)
    return r.svg(svg, W, H, fondo="transparent")


def una(r, n_, k=3):
    x0, x1, h = SCHERMATE[n_]
    o = Image.open(percorso_originale(n_)).convert("RGB")
    ow, oh = o.size
    O = o.resize((int(ow * k), int(oh * k)), Image.LANCZOS)
    im = rendi(r, n_, k)
    fondo = Image.new("RGB", O.size, FONDO)
    fondo.paste(im.convert("RGB"), (int(round(x0 * k)), 0), im.split()[3])
    a = np.asarray(O).astype(float)
    b = np.asarray(fondo).astype(float)
    xa, xb = int(round(x0 * k)), int(round(x1 * k))
    m = confronta(a[:, xa:xb], b[:, xa:xb])
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    d = np.stack([255 - diff] * 3, axis=2).astype(np.uint8)
    T = Image.new("RGB", (O.width * 3 + 24, O.height), (255, 255, 255))
    T.paste(O, (0, 0)); T.paste(fondo, (O.width + 12, 0)); T.paste(Image.fromarray(d), (2 * O.width + 24, 0))
    TAVOLE_DIR.mkdir(parents=True, exist_ok=True)
    out = TAVOLE_DIR / f"{n_:02d}-{NOMI[n_]}.png"
    T.save(out)
    return m, out


def insieme(r, k=2.4):
    imgs = []
    for n_ in range(1, 15):
        x0, x1, h = SCHERMATE[n_]
        im = rendi(r, n_, k)
        base = Image.new("RGB", im.size, (255, 255, 255)); base.paste(im.convert("RGB"), (0, 0), im.split()[3])
        imgs.append(base)
    W = max(i.width for i in imgs); Hh = max(i.height for i in imgs)
    cols = 7
    S = Image.new("RGB", (cols * (W + 14) + 14, 2 * (Hh + 14) + 14), (230, 233, 238))
    for i, im in enumerate(imgs):
        S.paste(im, (14 + (i % cols) * (W + 14), 14 + (i // cols) * (Hh + 14)))
    out = TAVOLE_DIR / "_tavola.png"
    S.save(out)
    return out


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    nums = [int(a) for a in args] if args else list(range(1, 15))
    with Renderer() as r:
        for n_ in nums:
            m, out = una(r, n_)
            print(f"{n_:02d} {NOMI[n_]}: mae {m['mae_255']}  ssim {m['ssim']}  -> {out}")
        if not args:
            print(insieme(r))
