"""Tavole di controllo s7: originale | disegno | differenza (k=3). 
    python3 controlla.py 34 [chiave...]   (chiavi: 1 2 3a 3b 4 ... ; senza chiavi: tutte)   oppure  python3 controlla.py 36
Scrive brand/concept-svg/_tavole/s7/<img>-<nome>.png e, senza chiavi, la tavola d'insieme <img>-insieme.png."""
import re, sys
import numpy as np
from PIL import Image
from componenti import *
sys.path.insert(0, str(RADICE / "strumenti/brand"))
from render import Renderer, confronta

FONDO = (246, 247, 249)


def rendi(r, ch, k):
    (x0, x1, y0, y1), nome = SCHERMATE[ch]
    W, H = int(round((x1 - x0) * k)), int(round((y1 - y0) * k))
    svg = percorso_svg(ch).read_text()
    svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', svg, count=1)
    return r.svg(svg, W, H, fondo="transparent")


def una(r, ch, k=3):
    (x0, x1, y0, y1), nome = SCHERMATE[ch]
    o = Image.open(percorso_orig(ch)).convert("RGB")
    O = o.resize((int(o.width * k), int(o.height * k)), Image.LANCZOS)
    im = rendi(r, ch, k)
    f = Image.new("RGB", O.size, FONDO)
    f.paste(im.convert("RGB"), (int(round(x0 * k)), int(round(y0 * k))), im.split()[3])
    a = np.asarray(O).astype(float); b = np.asarray(f).astype(float)
    xa, xb = int(round(max(x0, 0) * k)), int(round(min(x1, o.width) * k)); ya, yb = int(round(max(y0, 0) * k)), int(round(min(y1, o.height) * k))
    m = confronta(a[ya:yb, xa:xb], b[ya:yb, xa:xb])
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    d = np.stack([255 - diff] * 3, axis=2).astype(np.uint8)
    T = Image.new("RGB", (O.width * 3 + 24, O.height), (255, 255, 255))
    T.paste(O, (0, 0)); T.paste(f, (O.width + 12, 0)); T.paste(Image.fromarray(d), (2 * O.width + 24, 0))
    TAV.mkdir(parents=True, exist_ok=True)
    out = TAV / f"{ch[0]}-{nome}.png"; T.save(out)
    return m, out


def insieme(r, img, k=2.0, cols=8):
    chs = [c for c in SCHERMATE if c[0] == img]
    ims = []
    for c in chs:
        im = rendi(r, c, k); b = Image.new("RGB", im.size, (255, 255, 255)); b.paste(im.convert("RGB"), (0, 0), im.split()[3]); ims.append(b)
    W = max(i.width for i in ims); H = max(i.height for i in ims)
    rows = (len(ims) + cols - 1) // cols
    S = Image.new("RGB", (cols * (W + 14) + 14, rows * (H + 14) + 14), (226, 232, 242))
    for i, im in enumerate(ims):
        S.paste(im, (14 + (i % cols) * (W + 14), 14 + (i // cols) * (H + 14)))
    out = TAV / f"{img}-insieme.png"; S.save(out); return out


if __name__ == "__main__":
    img = int(sys.argv[1]); chiavi = sys.argv[2:]
    with Renderer() as r:
        sel = [c for c in SCHERMATE if c[0] == img and (not chiavi or str(c[1]) in chiavi)]
        for c in sel:
            m, out = una(r, c)
            print(f"{c}: mae {m['mae_255']} ssim {m['ssim']} -> {out}")
        if not chiavi: print(insieme(r, img))
