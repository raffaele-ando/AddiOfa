"""Tavole d'insieme di s6: tutte le schermate di 30 e di 31 affiancate (brand/concept-svg/_tavole/s6/_tavola*.png)."""
import re
from PIL import Image
from componenti import OUT, TAV
import sys
sys.path.insert(0, str(OUT.parents[2] / "strumenti/brand")); from render import Renderer
K = 1.0
def una(r, p):
    s = p.read_text(); w, h = 390 * K * 1.0, 844 * K
    s = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{int(w)}" height="{int(h)}"', s, count=1)
    im = r.svg(s, int(w), int(h), fondo="transparent")
    b = Image.new("RGB", im.size, (255, 255, 255)); b.paste(im.convert("RGB"), (0, 0), im.split()[3]); return b
with Renderer() as r:
    tutte = []
    for c, cols in (("30-flusso-schermate-a", 8), ("31-flusso-schermate-b", 7)):
        ps = sorted((OUT / c).glob("*.svg")); ims = [una(r, p) for p in ps]
        W, H = ims[0].size; rows = -(-len(ims) // cols)
        S = Image.new("RGB", (cols * (W + 14) + 14, rows * (H + 14) + 14), (226, 231, 240))
        for i, im in enumerate(ims): S.paste(im, (14 + (i % cols) * (W + 14), 14 + (i // cols) * (H + 14)))
        TAV.mkdir(parents=True, exist_ok=True); S.save(TAV / f"_tavola-{c[:2]}.png"); tutte.append(S); print(len(ims), S.size)
    W = max(s.width for s in tutte); T = Image.new("RGB", (W, sum(s.height for s in tutte)), (226, 231, 240)); y = 0
    for s in tutte: T.paste(s, (0, y)); y += s.height
    T.save(TAV / "_tavola.png")
