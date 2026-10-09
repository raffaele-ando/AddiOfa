"""Confronto SVG ridisegnati / ritagli: python3 ck.py <NN> [k...]  -> tavole in brand/concept-svg/_tavole/calcolo-risultato/"""
import sys, glob, pathlib, re
import numpy as np
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ui import RADICE
from render import Renderer, confronta

TAV = RADICE / "brand/concept-svg/_tavole/calcolo-risultato"
SVG = RADICE / "brand/concept-svg/schermate/calcolo-risultato"


def tavola(r, svg_p, orig_p, out, k=2.0):
    o = Image.open(orig_p).convert("RGB")
    W, H = o.size
    svg = svg_p.read_text()
    W2, H2 = int(round(W * k)), int(round(H * k))
    vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    H2s = int(round(W2 * float(vb.group(2)) / float(vb.group(1))))      # l'SVG può essere più alto del ritaglio (voce completata)
    svg2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W2}" height="{H2s}"', svg, count=1)
    im = r.svg(svg2, W2, H2s, fondo="#FFFFFF")
    a = np.asarray(o.resize((W2, H2), Image.LANCZOS)).astype(float)
    b_full = np.asarray(im.convert("RGB")).astype(float)
    b = b_full[:H2]
    m = confronta(a, b)
    if H2s > H2:
        pad = np.full((H2s - H2, W2, 3), 200.0)
        a = np.concatenate([a, pad], axis=0); b = b_full
        H2 = H2s
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    d = np.stack([255 - diff] * 3, axis=2)
    t = Image.new("RGB", (W2 * 3 + 24, H2), (255, 255, 255))
    t.paste(Image.fromarray(a.astype(np.uint8)), (0, 0)); t.paste(Image.fromarray(b.astype(np.uint8)), (W2 + 12, 0))
    t.paste(Image.fromarray(d.astype(np.uint8)), (2 * W2 + 24, 0))
    out.parent.mkdir(parents=True, exist_ok=True)
    t.save(out)
    return m


if __name__ == "__main__":
    nn = sys.argv[1]
    ks = [int(x) for x in sys.argv[2:]] or range(1, 7)
    with Renderer() as r:
        for k in ks:
            svgs = glob.glob(str(SVG / f"{nn}-*-{k:03d}-*.svg"))
            if not svgs: continue
            svg_p = pathlib.Path(svgs[0])
            orig = glob.glob(str(RADICE / f"brand/concept/{nn}-*/{k:03d}-schermata.png"))[0]
            m = tavola(r, svg_p, orig, TAV / (svg_p.stem + ".png"))
            print(svg_p.name, "mae", m["mae_255"], "ssim", m["ssim"])
