"""Tavole d'insieme: per ogni immagine tutte le schermate ridisegnate affiancate. python3 insieme.py -> _tavole/s2/NN-tavola.png"""
import registro  # noqa
from PIL import Image
from comuni import SCHERMATE, TAVOLE, percorso_svg
from controlla import rendi, Renderer

COL = {5: 7, 22: 2, 25: 4, 49: 7}
with Renderer() as r:
    for im, cols in COL.items():
        chs = [c for c in SCHERMATE if c.startswith(f"{im:02d}-") and percorso_svg(c).exists()]
        k = 1.6 if im != 22 else 1.0
        ims = []
        for c in chs:
            d = rendi(r, c, k); b = Image.new("RGB", d.size, (243, 248, 252)); b.paste(d.convert("RGB"), (0, 0), d.split()[3]); ims.append(b)
        W = max(i.width for i in ims); H = max(i.height for i in ims)
        rows = (len(ims) + cols - 1) // cols
        S = Image.new("RGB", (cols * (W + 16) + 16, rows * (H + 16) + 16), (225, 232, 240))
        for i, b in enumerate(ims):
            S.paste(b, (16 + (i % cols) * (W + 16), 16 + (i // cols) * (H + 16)))
        TAVOLE.mkdir(parents=True, exist_ok=True)
        S.save(TAVOLE / f"{im:02d}-tavola.png"); print(TAVOLE / f"{im:02d}-tavola.png", S.size)
