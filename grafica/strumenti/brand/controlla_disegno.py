"""
Controllo di un disegno pulito (vedi STILE.md): tavola di confronto e avvisi.

    python3 strumenti/brand/controlla_disegno.py brand/disegni/kit-blu/illustrazioni/studio-inglese.svg [altri.svg …]
    python3 strumenti/brand/controlla_disegno.py tutto          # tutti i disegni, più la tavola d'insieme

Per ogni disegno: brand/tavole/puliti/<kit>--<gruppo>--<nome>.png con
originale 3x | disegno 3x | disegno 3x su fondo scuro | disegno 1x, e sul terminale:
  ingombro   quanto l'area occupata coincide con quella dell'originale (IoU delle sagome)
  palette    colori lontani dalla palette di STILE.md (possono essere voluti: si guarda la tavola)
  testo      elementi <text> (vanno trasformati in tracciati con testo_svg.py)
"""
from __future__ import annotations

import pathlib
import re
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

from render import Renderer, su_fondo
from ricolora import rgb_oklch, esa_rgb

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"
TAVOLE = BRAND / "tavole" / "puliti"

PALETTE = ["#93C5FD", "#3B82F6", "#1D4ED8", "#DBEAFE", "#FCA5A5", "#EF4444", "#DC2626", "#FEE2E2",
           "#FDE68A", "#FBBF24", "#F59E0B", "#FEF3C7", "#86EFAC", "#22C55E", "#16A34A", "#DCFCE7",
           "#C4B5FD", "#8B5CF6", "#6D28D9", "#EDE9FE", "#94A3B8", "#475569", "#0F172A", "#E2E8F0",
           "#FFFFFF", "#EAF1FD", "#FDEDED", "#F1F5F9", "#000000"]


def oklab(h):
    l, c, hh = rgb_oklch(esa_rgb(h))
    return np.array([l, c * np.cos(np.radians(hh)), c * np.sin(np.radians(hh))])


PAL = np.array([oklab(p) for p in PALETTE])


def fuori_palette(svg: str) -> list[str]:
    fuori = []
    for c in sorted(set(x.upper() for x in re.findall(r"#[0-9A-Fa-f]{6}\b", svg))):
        d = np.linalg.norm(PAL - oklab(c), axis=1).min()
        if d > 0.06:
            fuori.append(c)
    return fuori


def originale_di(p: pathlib.Path) -> pathlib.Path:
    rel = p.resolve().relative_to((BRAND / "disegni").resolve())
    return BRAND / "elementi" / rel.with_suffix(".png")


def rendi(r: Renderer, svg: str, w: int, h: int, k: float) -> Image.Image:
    W, H = int(round(w * k)), int(round(h * k))
    s = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W}" height="{H}"', svg, count=1)
    return r.svg(s, W, H)


def controlla(r: Renderer, p: pathlib.Path) -> dict:
    svg = p.read_text()
    orig = Image.open(originale_di(p)).convert("RGBA")
    W, H = orig.size
    uno = rendi(r, svg, W, H, 1)
    a_o = ndi.binary_opening(np.asarray(orig)[..., 3] > 128, np.ones((3, 3)))
    a_n = np.asarray(uno)[..., 3] > 128
    iou = float((a_o & a_n).sum() / max(1, (a_o | a_n).sum()))
    k = 3
    tre = rendi(r, svg, W, H, k)
    t = Image.new("RGB", (W * k * 3 + W + 36, H * k), (255, 255, 255))
    t.paste(Image.fromarray(su_fondo(orig.resize((W * k, H * k), Image.LANCZOS), (246, 248, 252)).astype(np.uint8)), (0, 0))
    t.paste(Image.fromarray(su_fondo(tre, (246, 248, 252)).astype(np.uint8)), (W * k + 12, 0))
    t.paste(Image.fromarray(su_fondo(tre, (15, 23, 42)).astype(np.uint8)), (2 * W * k + 24, 0))
    t.paste(Image.fromarray(su_fondo(uno, (246, 248, 252)).astype(np.uint8)), (3 * W * k + 36, 0))
    rel = p.resolve().relative_to((BRAND / "disegni").resolve()).with_suffix("")
    TAVOLE.mkdir(parents=True, exist_ok=True)
    t.save(TAVOLE / (str(rel).replace("/", "--") + ".png"))
    return {"disegno": str(rel), "ingombro_iou": round(iou, 3), "fuori_palette": fuori_palette(svg),
            "testo": len(re.findall(r"<text\b", svg)), "byte": len(svg)}


def insieme(r: Renderer, file: list[pathlib.Path]):
    C, N = 260, 7
    celle = []
    for p in file:
        svg = p.read_text()
        w, h = (float(v) for v in re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups())
        celle.append(Image.fromarray(su_fondo(rendi(r, svg, w, h, (C - 20) / max(w, h)), (255, 255, 255)).astype(np.uint8)))
    t = Image.new("RGB", (N * C, ((len(celle) + N - 1) // N) * C), (255, 255, 255))
    for i, c in enumerate(celle):
        t.paste(c, ((i % N) * C + (C - c.width) // 2, (i // N) * C + (C - c.height) // 2))
    t.save(BRAND / "tavole" / "disegni-puliti.png")


def main(argomenti):
    if argomenti == ["tutto"]:
        file = sorted(f for f in (BRAND / "disegni").rglob("*.svg")
                      if not re.search(r"\.(maglie|scuro)\.svg$|--", f.name))
    else:
        file = [pathlib.Path(a) for a in argomenti]
    with Renderer() as r:
        for p in file:
            m = controlla(r, p)
            avvisi = []
            if m["ingombro_iou"] < 0.8:
                avvisi.append(f"ingombro diverso dall'originale (IoU {m['ingombro_iou']})")
            if m["testo"]:
                avvisi.append(f"{m['testo']} elementi <text>")
            if m["fuori_palette"]:
                avvisi.append("fuori palette: " + " ".join(m["fuori_palette"][:8]))
            print(f"{m['disegno']:48} IoU {m['ingombro_iou']:.3f}  {m['byte'] // 1024:3d} KB  " + ("; ".join(avvisi) or "ok"))
        if argomenti == ["tutto"]:
            insieme(r, file)


if __name__ == "__main__":
    main(sys.argv[1:])
