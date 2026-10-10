"""Tavola originale | disegno | differenza per le schermate di s6.
    python3 controlla.py 30 5 [3 ...]   (immagine e numeri schermata; senza numeri: tutte quelle generate)
Importa i generatori (g30.py / g31.py) che registrano i riquadri in componenti.SCHERMATE."""
import re, sys, importlib
import numpy as np
from PIL import Image
from componenti import *  # noqa
from componenti import SCHERMATE, SRC, OUT, TAV, percorso
sys.path.insert(0, str(RADICE / "strumenti/brand"))
from render import Renderer, confronta

def tavola(r, imm, num, rect, nome, cart, k=2.6):
    x0, y0, x1, y1 = rect
    o = Image.open(SRC[imm]).convert("RGB").crop((x0, y0, x1, y1))
    W = int((x1 - x0) * k); Hh = int((y1 - y0) * k)
    O = o.resize((W, Hh), Image.LANCZOS)
    svg = (OUT / cart / f"{num:02d}-{nome}.svg").read_text()
    svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{Hh}"', svg, count=1)
    # il disegno è 390x844: si stira sul riquadro sorgente (stessa mappa usata dal generatore)
    svg = svg.replace('viewBox="0 0 390 844"', 'viewBox="0 0 390 844" preserveAspectRatio="none"', 1)
    im = r.svg(svg, W, Hh, fondo="white").convert("RGB")
    a = np.asarray(O).astype(float); b = np.asarray(im).astype(float)
    m = confronta(a, b)
    d = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255); d = np.stack([255 - d] * 3, 2).astype(np.uint8)
    T = Image.new("RGB", (W * 3 + 24, Hh), "white")
    T.paste(O, (0, 0)); T.paste(im, (W + 12, 0)); T.paste(Image.fromarray(d), (2 * W + 24, 0))
    TAV.mkdir(parents=True, exist_ok=True)
    out = TAV / f"{imm}-{num:02d}-{nome}.png"; T.save(out)
    return m, out

if __name__ == "__main__":
    imm = int(sys.argv[1]); nums = [int(a) for a in sys.argv[2:]]
    importlib.import_module(f"g{imm}").genera()
    with Renderer() as r:
        for (i, num), (nome, rect) in sorted(SCHERMATE.items()):
            if i != imm or (nums and num not in nums): continue
            cart = [c for c in (OUT).iterdir() if c.name.startswith(f"{imm}-")][0].name
            m, out = tavola(r, imm, num, rect, nome, cart)
            print(imm, num, nome, "mae", m["mae_255"], "ssim", m["ssim"], out)
