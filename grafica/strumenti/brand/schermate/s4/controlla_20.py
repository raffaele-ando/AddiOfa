"""Tavole di confronto per l'immagine 20: originale | disegno | differenza (scala 2). python3 controlla_20.py [k ...]; senza k: anche tavola d'insieme."""
import re, sys, pathlib
import numpy as np
from PIL import Image
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent)); sys.path.insert(0, str(AQUI.parents[1]))
from ui import RADICE
from render import Renderer, confronta
SVG = RADICE / "brand/concept-svg/schermate/20-schermate-risultato-sei"
ORIG = RADICE / "brand/concept/20-schermate-risultato-sei"
TAV = RADICE / "brand/concept-svg/_tavole/s4"
NOMI = {1: "calcoliamo-0", 2: "elaboriamo-18", 3: "stiamo-analizzando-42", 4: "ultimi-calcoli-68", 5: "quasi-pronto-80", 6: "il-tuo-risultato-82"}

def rendi(r, k, scala):
    o = Image.open(ORIG / f"{k:03d}-schermata.png").convert("RGB")
    W, H = int(o.width * scala), int(o.height * scala)
    svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', (SVG / f"{k:02d}-{NOMI[k]}.svg").read_text(), count=1)
    return o, r.svg(svg, W, H, fondo="#FFFFFF").convert("RGB")

if __name__ == "__main__":
    ks = [int(a) for a in sys.argv[1:]] or list(range(1, 7))
    TAV.mkdir(parents=True, exist_ok=True)
    with Renderer() as r:
        tutte = []
        for k in ks:
            o, im = rendi(r, k, 2)
            a = np.asarray(o.resize(im.size, Image.LANCZOS)).astype(float); b = np.asarray(im).astype(float)
            m = confronta(a, b)
            d = np.stack([255 - np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)] * 3, axis=2).astype(np.uint8)
            T = Image.new("RGB", (im.width * 3 + 24, im.height), (255, 255, 255))
            T.paste(Image.fromarray(a.astype(np.uint8)), (0, 0)); T.paste(im, (im.width + 12, 0)); T.paste(Image.fromarray(d), (2 * im.width + 24, 0))
            T.save(TAV / f"20-{k:02d}-{NOMI[k]}.png"); print(k, m)
        if len(sys.argv) == 1:
            ims = [rendi(r, k, 1.6)[1] for k in range(1, 7)]
            S = Image.new("RGB", (sum(i.width for i in ims) + 14 * 7, max(i.height for i in ims) + 28), (230, 233, 238))
            x = 14
            for i in ims: S.paste(i, (x, 14)); x += i.width + 14
            S.save(TAV / "20-_tavola.png")
