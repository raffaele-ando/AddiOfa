"""Tavola d'insieme: brand/concept-svg/illustrazioni-luminose/_tavola.png (luminoso su chiaro | su scuro | vivo)."""
import pathlib, re, sys
from PIL import Image, ImageDraw
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parents[1]))
from render import Renderer
D = QUI.parents[3] / "brand/concept-svg/illustrazioni-luminose"
nomi = sorted(f.stem for f in D.glob("*.svg") if not f.stem.endswith(".scuro"))
C = 190
T = Image.new("RGB", (3 * C, len(nomi) * (C + 14)), (255, 255, 255)); d = ImageDraw.Draw(T)
with Renderer() as r:
    for i, nm in enumerate(nomi):
        for j, (p, fondo) in enumerate(((D / f"{nm}.svg", "#FFFFFF"), (D / f"{nm}.scuro.svg", "#0F172A"), (D / "vivo" / f"{nm}.svg", "#FFFFFF"))):
            if not p.exists(): continue
            s = p.read_text(); m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s); w, h = float(m[1]), float(m[2])
            k = (C - 10) / max(w, h); W, H = int(w * k), int(h * k)
            s = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', s, count=1)
            im = r.svg(s, W, H, fondo=fondo).convert("RGB")
            cell = Image.new("RGB", (C, C), tuple(int(fondo[i:i+2], 16) for i in (1, 3, 5))); cell.paste(im, ((C - W) // 2, (C - H) // 2))
            T.paste(cell, (j * C, i * (C + 14) + 14))
        d.text((4, i * (C + 14) + 1), nm, fill=(200, 0, 0))
T.save(D / "_tavola.png"); print(D / "_tavola.png", T.size)
