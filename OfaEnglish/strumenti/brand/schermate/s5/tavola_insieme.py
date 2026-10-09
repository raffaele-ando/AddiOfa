"""Tavola d'insieme: per ogni immagine (09, 10, 29, 42, 43) una riga di ritagli originali e una di SVG ridisegnati."""
import sys, glob, pathlib, re
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ui import RADICE
from render import Renderer
SVG = RADICE / "brand/concept-svg/schermate/calcolo-risultato"
OUT = RADICE / "brand/concept-svg/_tavole/calcolo-risultato/_tavola.png"
H = 340
righe = []
with Renderer() as r:
    for nn in ("09", "10", "29", "42", "43"):
        for tipo in ("orig", "svg"):
            ims = []
            for k in range(1, 7):
                if tipo == "orig":
                    im = Image.open(glob.glob(str(RADICE / f"brand/concept/{nn}-*/{k:03d}-schermata.png"))[0]).convert("RGB")
                else:
                    p = pathlib.Path(glob.glob(str(SVG / f"{nn}-*-{k:03d}-*.svg"))[0]); s = p.read_text()
                    vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s); w, h = float(vb.group(1)), float(vb.group(2))
                    W2 = int(H * w / h)
                    s2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W2}" height="{H}"', s, count=1)
                    im = r.svg(s2, W2, H, fondo="#FFFFFF").convert("RGB")
                im = im.resize((int(im.width * H / im.height), H), Image.LANCZOS)
                ims.append(im)
            righe.append(ims)
W = max(sum(i.width + 8 for i in row) for row in righe)
tav = Image.new("RGB", (W, len(righe) * (H + 8)), (255, 255, 255))
y = 0
for row in righe:
    x = 0
    for im in row: tav.paste(im, (x, y)); x += im.width + 8
    y += H + 8
OUT.parent.mkdir(parents=True, exist_ok=True)
tav.save(OUT); print(OUT, tav.size)
