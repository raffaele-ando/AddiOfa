"""Tavole di confronto: originale | disegno (stessa larghezza) per ogni schermata di s3; con scarto sulla parte comune in alto.
    python3 controlla.py [modulo ...]     -> brand/concept-svg/_tavole/s3/<nome>.png e _insieme.png
"""
import importlib, re, sys, pathlib
import numpy as np
from PIL import Image
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import OUT, TAVOLE, RADICE
sys.path.insert(0, str(RADICE / "strumenti/brand"))
from render import Renderer, confronta

mods = sys.argv[1:] or sorted(p.stem for p in QUI.glob("[sq][0-9][0-9]_*.py"))
TAVOLE.mkdir(parents=True, exist_ok=True)
rend = []
with Renderer() as r:
    for m in mods:
        mod = importlib.import_module(m)
        svg = (OUT / mod.CARTELLA / mod.NOME).read_text()
        o = Image.open(mod.ORIGINALE).convert("RGB")
        k = 2.4 * 240 / o.width if o.width < 300 else 2.4
        W = int(o.width * k); H = int(o.height * k)
        vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
        sw, sh = float(vb.group(1)), float(vb.group(2))
        Hs = int(round(W * sh / sw))
        s2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{Hs}"', svg, count=1)
        im = r.svg(s2, W, Hs, fondo="#FFFFFF").convert("RGB")
        O = o.resize((W, H), Image.LANCZOS)
        T = Image.new("RGB", (W * 2 + 16, max(H, Hs)), (225, 228, 234)); T.paste(O, (0, 0)); T.paste(im, (W + 16, 0))
        T.save(TAVOLE / (mod.NOME.replace(".svg", ".png")))
        hh = min(H, Hs)
        # confronto sull'area comune: l'originale ha margini del ritaglio, quindi il numero è solo un termometro
        m_ = confronta(np.asarray(O)[:hh].astype(float), np.asarray(im)[:hh].astype(float))
        print(mod.NOME, "mae", m_["mae_255"], "ssim", m_["ssim"], f"(h originale/disegno {H}/{Hs})")
        rend.append(im)
    if len(sys.argv) == 1 and rend:
        hmax = max(i.height for i in rend); cols = 8
        w = max(i.width for i in rend)
        sc = 300 / w
        th = [i.resize((int(i.width * sc), int(i.height * sc)), Image.LANCZOS) for i in rend]
        rows = (len(th) + cols - 1) // cols
        S = Image.new("RGB", (cols * 312 + 12, rows * (int(hmax * sc) + 12) + 12), (232, 235, 240))
        for i, im in enumerate(th):
            S.paste(im, (12 + (i % cols) * 312, 12 + (i // cols) * (int(hmax * sc) + 12)))
        S.save(TAVOLE / "_insieme.png"); print(TAVOLE / "_insieme.png")
