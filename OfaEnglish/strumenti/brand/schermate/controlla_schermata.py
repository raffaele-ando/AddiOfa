"""
Tavola di confronto di una schermata ridisegnata: originale | disegno | differenza (amplificata).

    python3 strumenti/brand/schermate/controlla_schermata.py <svg> <originale.png> [uscita.png] [--k 2]

Rende lo SVG in Chromium alle misure dell'originale (ingrandite di k) e stampa scarto medio e SSIM.
Il numero è un termometro: la tavola va guardata (testo, allineamenti, ombre, icone).
"""
from __future__ import annotations

import pathlib
import re
import sys

import numpy as np
from PIL import Image

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from render import Renderer, confronta, su_fondo  # noqa: E402


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    k = float(sys.argv[sys.argv.index("--k") + 1]) if "--k" in sys.argv else 2.0
    if "--k" in sys.argv: args.remove(sys.argv[sys.argv.index("--k") + 1])
    svg_p, orig_p = pathlib.Path(args[0]), pathlib.Path(args[1])
    uscita = pathlib.Path(args[2]) if len(args) > 2 else svg_p.with_suffix(".confronto.png")
    o = Image.open(orig_p).convert("RGBA")
    orig = Image.new("RGB", o.size, (255, 255, 255)); orig.paste(o, mask=o.split()[3])   # trasparenze su bianco
    W, H = orig.size
    svg = svg_p.read_text()
    W2, H2 = int(round(W * k)), int(round(H * k))
    svg2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W2}" height="{H2}"', svg, count=1)
    with Renderer() as r:
        im = r.svg(svg2, W2, H2, fondo="#FFFFFF")
    a = np.asarray(orig.resize((W2, H2), Image.LANCZOS)).astype(float)
    b = np.asarray(im.convert("RGB")).astype(float)
    m = confronta(a, b)
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    d = np.stack([255 - diff] * 3, axis=2)
    t = Image.new("RGB", (W2 * 3 + 24, H2), (255, 255, 255))
    t.paste(Image.fromarray(a.astype(np.uint8)), (0, 0)); t.paste(Image.fromarray(b.astype(np.uint8)), (W2 + 12, 0))
    t.paste(Image.fromarray(d.astype(np.uint8)), (2 * W2 + 24, 0))
    uscita.parent.mkdir(parents=True, exist_ok=True)
    t.save(uscita)
    print(f"{svg_p.name}: mae {m['mae_255']}  ssim {m['ssim']}  -> {uscita}")


if __name__ == "__main__":
    main()
