"""Foglio di controllo: coppie originale|disegno delle slide a..b -> /tmp/claude-0/s/car-<a>.png"""
import sys
from PIL import Image
T = '/home/user/AddiOfa/OfaEnglish/brand/concept-svg/_tavole/p1/'
a, b = int(sys.argv[1]), int(sys.argv[2])
ims = []
for i in range(a, b + 1):
    t = Image.open(T + f'carosello-{i:02d}.png'); w = (t.width - 20) // 3
    ims.append(t.crop((0, 0, 2 * w + 10, t.height)))
H = max(i.height for i in ims)
n = len(ims); per = 3
rows = [ims[k:k + per] for k in range(0, n, per)]
W = max(sum(i.width + 10 for i in r) for r in rows)
sheet = Image.new('RGB', (W, len(rows) * (H + 10)), '#888')
for ri, r in enumerate(rows):
    x = 0
    for p in r: sheet.paste(p, (x, ri * (H + 10))); x += p.width + 10
sheet.save(f'/tmp/claude-0/s/car-{a}.png')
