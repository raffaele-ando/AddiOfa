"""
Tavola di controllo di un'illustrazione luminosa: originale 3x | disegno 3x | disegno 3x su fondo scuro (versione .scuro.svg
se esiste) | disegno a 1x e a 120 px. Stampa scarto/SSIM (termometro, non obiettivo).

    python3 strumenti/brand/schermate/luminoso/controllo.py <svg> <id-concept 16.022> [uscita.png] [--k 3]
Senza id: solo disegno (per i soggetti senza originale).
"""
from __future__ import annotations
import json, pathlib, re, sys
import numpy as np
from PIL import Image

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[3]
sys.path.insert(0, str(QUI.parents[1]))
from render import Renderer, confronta  # noqa: E402


def rendi(r, svg, w, h, k, fondo):
    W, H = int(round(w * k)), int(round(h * k))
    s = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', svg, count=1)
    return r.svg(s, W, H, fondo=fondo).convert("RGB")


def main():
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    k = float(sys.argv[sys.argv.index("--k") + 1]) if "--k" in sys.argv else 3.0
    if "--k" in sys.argv: a.remove(sys.argv[sys.argv.index("--k") + 1])
    svg_p = pathlib.Path(a[0]); idc = a[1] if len(a) > 1 else None
    out = pathlib.Path(a[2]) if len(a) > 2 else svg_p.with_suffix(".tavola.png")
    svg = svg_p.read_text()
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg); w, h = float(m.group(1)), float(m.group(2))
    scuro_p = svg_p.with_name(svg_p.stem + ".scuro.svg")
    pannelli = []
    with Renderer() as r:
        mm = None
        if idc:
            cat = {i["id"]: i for i in json.load(open(RADICE / "brand/concept/catalogo.json"))}
            o = Image.open(RADICE / cat[idc]["path"]).convert("RGBA")
            bg = Image.new("RGB", o.size, (255, 255, 255)); bg.paste(o, mask=o.split()[3])
            ow, oh = bg.size
            pannelli.append(bg.resize((int(round(ow * k)), int(round(oh * k))), Image.LANCZOS))
        mio = rendi(r, svg, w, h, k, "#FFFFFF"); pannelli.append(mio)
        if idc:
            a1 = np.asarray(bg.resize(mio.size, Image.LANCZOS)).astype(float); b1 = np.asarray(mio).astype(float)
            mm = confronta(a1, b1)
        ss = scuro_p.read_text() if scuro_p.exists() else svg
        pannelli.append(rendi(r, ss, w, h, k, "#0F172A"))
        p1 = rendi(r, svg, w, h, 1, "#FFFFFF"); k120 = 120 / max(w, h)
        p120 = rendi(r, svg, w, h, k120, "#FFFFFF")
    H = max(p.height for p in pannelli)
    colonna = Image.new("RGB", (max(p1.width, p120.width), p1.height + p120.height + 10), (255, 255, 255))
    colonna.paste(p1, (0, 0)); colonna.paste(p120, (0, p1.height + 10))
    pannelli.append(colonna)
    T = Image.new("RGB", (sum(p.width for p in pannelli) + 12 * len(pannelli), max(H, colonna.height)), (200, 200, 200))
    x = 0
    for p in pannelli:
        T.paste(p, (x, 0)); x += p.width + 12
    out.parent.mkdir(parents=True, exist_ok=True); T.save(out)
    print(svg_p.name, mm or "", "->", out)


if __name__ == "__main__":
    main()
