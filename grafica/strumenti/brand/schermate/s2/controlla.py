"""python3 controlla.py <prefisso|chiave>...  -> tavole originale | disegno | differenza in brand/concept-svg/_tavole/s2/<immagine>/"""
import re, sys
import numpy as np
from PIL import Image
import registro
from comuni import SCHERMATE, ritaglio, percorso_svg, TAVOLE, sorgente, SCRATCH
sys.path.insert(0, str(__import__('comuni').QUI.parent.parent))
from render import Renderer, confronta


def rendi(r, ch, k):
    im, box, rr, nome = SCHERMATE[ch]
    W, H = (box[2] - box[0]), (box[3] - box[1])
    svg = percorso_svg(ch).read_text()
    W2, H2 = int(round(W * k)), int(round(H * k))
    svg = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W2}" height="{H2}"', svg, count=1)
    return r.svg(svg, W2, H2, fondo="transparent")


def una(r, ch, k=3):
    o = ritaglio(ch)
    O = o.resize((int(o.width * k), int(o.height * k)), Image.LANCZOS)
    d = rendi(r, ch, k)
    B = O.copy(); B.paste(d.convert("RGB"), (0, 0), d.split()[3])
    a, b = np.asarray(O).astype(float), np.asarray(B).astype(float)
    m = confronta(a, b)
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    D = np.stack([255 - diff] * 3, axis=2).astype(np.uint8)
    T = Image.new("RGB", (O.width * 3 + 24, O.height), (255, 255, 255))
    T.paste(O, (0, 0)); T.paste(B, (O.width + 12, 0)); T.paste(Image.fromarray(D), (2 * O.width + 24, 0))
    out = TAVOLE / ch[:2] / f"{ch[3:]}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    T.save(out)
    return m, out


if __name__ == "__main__":
    sel = [c for c in SCHERMATE if any(c.startswith(a) for a in sys.argv[1:])]
    with Renderer() as r:
        for ch in sel:
            if not percorso_svg(ch).exists():
                continue
            m, out = una(r, ch)
            kb = percorso_svg(ch).stat().st_size // 1024
            print(f"{ch}: mae {m['mae_255']} ssim {m['ssim']} {kb}KB -> {out}")
