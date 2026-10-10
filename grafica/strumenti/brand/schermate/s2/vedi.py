"""python3 vedi.py <chiave> [k] [x0 y0 x1 y1]  -> ritaglio ingrandito con griglia in coordinate LOCALI (scratchpad/vedi.png)"""
import sys
from PIL import Image, ImageDraw
import registro
from comuni import ritaglio, SCRATCH, SCHERMATE
ch = sys.argv[1]; k = float(sys.argv[2]) if len(sys.argv) > 2 else 4
im = ritaglio(ch)
if len(sys.argv) > 3:
    x0, y0, x1, y1 = map(int, sys.argv[3:7])
else:
    x0, y0, x1, y1 = 0, 0, *im.size
c = im.crop((x0, y0, x1, y1)).resize((int((x1 - x0) * k), int((y1 - y0) * k)), Image.LANCZOS).convert("RGB")
d = ImageDraw.Draw(c)
step = 10 if (x1 - x0) * k < 1400 else 5
for x in range((x0 // step + 1) * step, x1, step):
    X = (x - x0) * k; big = x % 50 == 0
    d.line([(X, 0), (X, c.height)], fill=(255, 120, 120) if big else (255, 215, 215), width=1)
    if x % 20 == 0 or big: d.text((X + 2, 2), str(x), fill=(200, 0, 0))
for y in range((y0 // step + 1) * step, y1, step):
    Y = (y - y0) * k; big = y % 50 == 0
    d.line([(0, Y), (c.width, Y)], fill=(120, 120, 255) if big else (215, 215, 255), width=1)
    if y % 20 == 0 or big: d.text((2, Y + 2), str(y), fill=(0, 0, 200))
out = SCRATCH / "vedi.png"; c.save(out); print(out, c.size, im.size)
