"""vedi.py out.png nome1 nome2 ... : impagina (originale sopra, disegno sotto) i layout 48 indicati (nomi dei file senza .svg)."""
import sys, pathlib, re
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from render import Renderer
from PIL import Image
out = sys.argv[1]; cartella = sys.argv[2]; nomi = sys.argv[3:]
RAD = pathlib.Path(__file__).resolve().parents[4]
FOTO = pathlib.Path(__file__).resolve().parent / "_foto"
coppie = []
with Renderer() as r:
    for nm in nomi:
        sv = (RAD / "brand/concept-svg/layout" / cartella / f"{nm}.svg").read_text()
        o = Image.open(FOTO / f"_orig_{nm}.png").convert("RGB")
        W, H = o.size
        sv = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', sv, count=1)
        coppie.append((o, r.svg(sv, W, H, '#fff').convert('RGB')))
Wt = sum(o.width for o, _ in coppie) + 10 * len(coppie)
Ht = max(o.height for o, _ in coppie) * 2 + 10
T = Image.new('RGB', (Wt, Ht), (200, 200, 200)); x = 0
for o, d in coppie:
    T.paste(o, (x, 0)); T.paste(d, (x, o.height + 10)); x += o.width + 10
T.save(out); print(T.size)
