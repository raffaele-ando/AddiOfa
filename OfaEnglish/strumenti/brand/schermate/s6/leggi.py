"""Ritaglia una zona dell'immagine sorgente con griglia in coordinate dell'originale, per leggere misure.
    python3 leggi.py 30 x0 y0 x1 y1 [zoom] [passo]   ->  /tmp/claude-0/s6w/l.png"""
import sys
from PIL import Image, ImageDraw, ImageFont
SRC = {30: "file_0000000089688210bbf00df3de3f973f.png", 31: "file_000000008ba881f4a420b137ffc486c3.png"}
i = int(sys.argv[1]); x0, y0, x1, y1 = map(int, sys.argv[2:6])
z = float(sys.argv[6]) if len(sys.argv) > 6 else 3
passo = int(sys.argv[7]) if len(sys.argv) > 7 else 10
im = Image.open("/home/user/AddiOfa/design-concept/" + SRC[i]).convert("RGB").crop((x0, y0, x1, y1))
im = im.resize((int(im.width * z), int(im.height * z)), Image.LANCZOS)
d = ImageDraw.Draw(im, "RGBA")
f = ImageFont.load_default()
for x in range((x0 // passo + 1) * passo, x1, passo):
    X = (x - x0) * z; forte = x % (passo * 5) == 0
    d.line([(X, 0), (X, im.height)], fill=(255, 0, 0, 90 if forte else 28))
    if forte: d.text((X + 2, 2), str(x), fill=(220, 0, 0, 255), font=f)
for y in range((y0 // passo + 1) * passo, y1, passo):
    Y = (y - y0) * z; forte = y % (passo * 5) == 0
    d.line([(0, Y), (im.width, Y)], fill=(255, 0, 0, 90 if forte else 28))
    if forte: d.text((2, Y + 2), str(y), fill=(220, 0, 0, 255), font=f)
im.save("/tmp/claude-0/s6w/l.png")
print(im.size)
