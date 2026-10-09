"""python3 multi.py k chiave1 chiave2 ... -> scratchpad/multi.png (ritagli affiancati con righello locale ogni 20 px)"""
import sys
from PIL import Image, ImageDraw
import registro
from comuni import ritaglio, SCRATCH
k = float(sys.argv[1]); ims = []
for ch in sys.argv[2:]:
    im = ritaglio(ch); c = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS).convert("RGB"); d = ImageDraw.Draw(c)
    for x in range(0, im.width, 20):
        d.line([(x * k, 0), (x * k, c.height)], fill=(255, 150, 150), width=1); d.text((x * k + 2, 2), str(x), fill=(200, 0, 0))
    for y in range(0, im.height, 20):
        d.line([(0, y * k), (c.width, y * k)], fill=(150, 150, 255), width=1); d.text((2, y * k + 2), str(y), fill=(0, 0, 200))
    ims.append(c)
S = Image.new("RGB", (sum(i.width for i in ims) + 10 * len(ims), max(i.height for i in ims)), (180, 180, 180)); x = 0
for i in ims: S.paste(i, (x, 0)); x += i.width + 10
S.save(SCRATCH / "multi.png"); print(S.size)
