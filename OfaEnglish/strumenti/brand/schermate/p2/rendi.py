"""Rende uno SVG del layout in PNG (opzionale: affianca l'originale) per guardarlo. uso: rendi.py svg orig.png out.png [scala]"""
import sys, re, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from render import Renderer
from PIL import Image
svg_p, orig_p, out = sys.argv[1], sys.argv[2], sys.argv[3]
k = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
svg = open(svg_p).read()
o = Image.open(orig_p).convert("RGB")
W, H = int(o.width * k), int(o.height * k)
svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', svg, count=1)
with Renderer() as r:
    im = r.svg(svg, W, H, '#fff').convert('RGB')
vert = W > 1.4 * H
t = Image.new('RGB', (W, H * 2 + 8) if vert else (W * 2 + 8, H), 'white')
t.paste(o.resize((W, H)), (0, 0)); t.paste(im, (0, H + 8) if vert else (W + 8, 0)); t.save(out)
