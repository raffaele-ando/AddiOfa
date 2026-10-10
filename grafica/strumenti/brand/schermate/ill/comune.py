"""
Pezzi comuni dei generatori dell'agente `ill` (illustrazioni grandi dei brand board 7, 8, 15, 28, 35, 40, 50).

Le illustrazioni nuove si disegnano in PIXEL DELL'ORIGINALE (il ritaglio di brand/concept/…): viewBox = misure del PNG,
così `controlla_schermata`-style (originale | disegno | differenza) è immediato. Riusa i generatori già approvati
(strumenti/brand/illustrazioni/oggetti_a.py, geometria.py) senza modificarli.
"""
from __future__ import annotations

import json
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[3]                       # grafica/
BRAND = RADICE / "brand"
sys.path.insert(0, str(RADICE / "strumenti/brand"))
sys.path.insert(0, str(RADICE / "strumenti/brand/illustrazioni"))
sys.path.insert(0, str(RADICE / "strumenti/brand/schermate"))
from geometria import V, arrotondato, lineare, radiale, n, p, sfocatura  # noqa: E402,F401
from oggetti_a import nuvola, ombra, rettangolo, svg  # noqa: E402,F401
from render import Renderer, confronta  # noqa: E402

USCITA = BRAND / "concept-svg" / "illustrazioni"
TAVOLE = BRAND / "concept-svg" / "_tavole" / "illustrazioni"
CATALOGO = {e["id"]: e for e in json.load(open(BRAND / "concept" / "catalogo.json"))}


def scrivi(kit: str, nome: str, contenuto: str) -> pathlib.Path:
    f = USCITA / kit / f"{nome}.svg"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(contenuto)
    return f


def tavola(percorso_svg: pathlib.Path, id_concept: str, k: int = 4, scuro: bool = True, nome_tavola: str | None = None) -> dict:
    """Tavola originale | disegno | differenza (| disegno su fondo scuro). Scarto/SSIM sul ritaglio incollato su bianco."""
    import re
    o = Image.open(RADICE / CATALOGO[id_concept]["path"]).convert("RGBA")
    orig = Image.new("RGB", o.size, (255, 255, 255)); orig.paste(o, mask=o.split()[3])
    W, H = orig.size
    s = percorso_svg.read_text()
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s)
    sw, sh = float(m[1]), float(m[2])
    W2, H2 = int(round(W * k)), int(round(H * k))
    s2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W2}" height="{H2}"', s, count=1)
    with Renderer() as r:
        im = r.svg(s2, W2, H2, fondo="#FFFFFF")
        im_s = r.svg(s2, W2, H2, fondo="#1E293B") if scuro else None
    a = np.asarray(orig.resize((W2, H2), Image.LANCZOS)).astype(float)
    b = np.asarray(im.convert("RGB")).astype(float)
    mt = confronta(a, b)
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    d = np.stack([255 - diff] * 3, axis=2)
    cols = 4 if scuro else 3
    T = Image.new("RGB", (W2 * cols + 12 * (cols - 1), H2 + 14), (255, 255, 255))
    T.paste(Image.fromarray(a.astype(np.uint8)), (0, 14)); T.paste(Image.fromarray(b.astype(np.uint8)), (W2 + 12, 14))
    T.paste(Image.fromarray(d.astype(np.uint8)), (2 * W2 + 24, 14))
    if scuro:
        T.paste(im_s.convert("RGB"), (3 * W2 + 36, 14))
    dr = ImageDraw.Draw(T)
    dr.text((2, 1), f"{id_concept} | {percorso_svg.stem} | scarto {mt['mae_255']:.1f}/255 ssim {mt['ssim']:.2f} | viewBox {sw:g}x{sh:g} (orig {W}x{H})", fill=(180, 0, 0))
    TAVOLE.mkdir(parents=True, exist_ok=True)
    out = TAVOLE / f"{nome_tavola or percorso_svg.stem}.png"
    T.save(out)
    print(f"{percorso_svg.name}: scarto {mt['mae_255']:.2f} ssim {mt['ssim']:.3f} -> {out}")
    return {"scarto": round(float(mt["mae_255"]), 2), "ssim": round(float(mt["ssim"]), 3), "tavola": str(out.relative_to(RADICE))}


def campiona(id_concept: str, *punti) -> list[str]:
    o = Image.open(RADICE / CATALOGO[id_concept]["path"]).convert("RGBA")
    bg = Image.new("RGBA", o.size, (255, 255, 255, 255)); bg.alpha_composite(o)
    bg = bg.convert("RGB")
    return ["#%02X%02X%02X" % bg.getpixel(q) for q in punti]
