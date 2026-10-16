"""
Controlla in Chromium le illustrazioni spedite (chiare e `.scuro.svg`) su fondo chiaro `#F7F9FD` e scuro `#0A101F`:
cerca i difetti che a occhio si vedono subito, con un numero per ognuno, e fa un foglio di controllo da guardare.

    python3 strumenti/brand/controlla_temi.py <cartella con gli SVG> [--foglio uscita.png] [--solo kit-blu/stati]

Per ogni SVG (la variante scura è giudicata sul fondo scuro, la chiara sul chiaro):
- `bianco`  quota di pixel opachi quasi bianchi sul fondo scuro (fogli abbaglianti): avviso sopra il 45 % (una lente o una coppa
            bianca sono scelte di disegno: si giudicano sul foglio);
- `sparisce` quota di pixel opachi (alfa > 0,9) che sul fondo scuro hanno quasi il colore del fondo (blu scuro su scuro): sopra il 4 %;
- `invisibile` stessa cosa sul fondo chiaro (colore identico al fondo, bianco su chiaro senza bordo): sopra il 25 %;
- `taglio`   pixel opachi sul bordo della tela (disegno ritagliato): sopra 3 pixel per lato;
- `testo`    elementi `<text>` (vietati negli SVG);
- `alone`    pixel semitrasparenti quasi bianchi sul fondo scuro (frange e aloni bianchi), rispetto ai pixel opachi: sopra il 5 %.
Esce con codice 1 se c'è almeno un avviso (i falsi positivi si giudicano guardando il foglio).
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from render import Renderer  # noqa: E402

CHIARO, SCURO = "#F7F9FD", "#0A101F"
RGB_CHIARO, RGB_SCURO = np.array([0xF7, 0xF9, 0xFD], float), np.array([0x0A, 0x10, 0x1F], float)


def _dim(svg: str) -> tuple[float, float]:
    vb = re.search(r'viewBox="([-\d.\s]+)"', svg)
    if vb:
        v = [float(x) for x in vb.group(1).split()]
        return v[2], v[3]
    return float(re.search(r'width="([\d.]+)', svg).group(1)), float(re.search(r'height="([\d.]+)', svg).group(1))


def misura(r: Renderer, svg: str, scuro: bool) -> dict:
    w, h = _dim(svg)
    lato = 160
    sc = lato / max(w, h)
    W, H = max(8, int(round(w * sc))), max(8, int(round(h * sc)))
    img = r.svg(svg, W, H, "transparent")          # RGBA con alfa vero
    a = np.asarray(img).astype(float)
    rgb, al = a[..., :3], a[..., 3] / 255
    sopra = np.asarray(r.svg(svg, W, H, SCURO if scuro else CHIARO).convert("RGB")).astype(float)
    opachi = al > 0.9
    n = max(1, int(opachi.sum()))
    lum = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) / 255
    out = {}
    bg = RGB_SCURO if scuro else RGB_CHIARO
    vicino = np.abs(sopra - bg).max(axis=2) < (14 if scuro else 4)
    if scuro:
        out["bianco"] = float(((lum > 0.9) & opachi).sum() / n)
        out["sparisce"] = float((vicino & opachi).sum() / n)
        semi = (al > 0.05) & (al < 0.9)
        out["alone"] = float((semi & (lum > 0.9)).sum() / n)
    else:
        out["invisibile"] = float((vicino & opachi).sum() / n)
    bordo = np.concatenate([al[0, :], al[-1, :], al[:, 0], al[:, -1]])
    out["taglio"] = int((bordo > 0.3).sum())
    return out


SOGLIE = {"bianco": 0.45, "sparisce": 0.04, "invisibile": 0.25, "taglio": 3, "alone": 0.05}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("cartella")
    p.add_argument("--foglio")
    p.add_argument("--solo", help="sottocartella (es. kit-blu/stati)")
    x = p.parse_args()
    radice = pathlib.Path(x.cartella)
    base = radice / x.solo if x.solo else radice
    file_chiari = sorted(f for f in base.rglob("*.svg") if not f.name.endswith(".scuro.svg"))
    avvisi, righe, celle = 0, [], []
    with Renderer() as r:
        for f in file_chiari:
            nome = str(f.relative_to(radice))
            svg_c = f.read_text()
            scuro_f = f.with_name(f.stem + ".scuro.svg")
            svg_s = scuro_f.read_text() if scuro_f.exists() else svg_c
            problemi = []
            if "<text" in svg_c or "<text" in svg_s:
                problemi.append("testo")
            mc, ms = misura(r, svg_c, False), misura(r, svg_s, True)
            for k, v in {**mc, **ms}.items():
                if k in SOGLIE and v > SOGLIE[k]:
                    problemi.append(f"{k}={v:.2f}" if isinstance(v, float) else f"{k}={v}")
            avvisi += bool(problemi)
            righe.append((nome, mc, ms, problemi))
            celle.append((nome, svg_c, svg_s, bool(problemi)))
    for nome, mc, ms, pr in righe:
        print(f"{'!!' if pr else 'ok'} {nome:62s} " + (" ".join(pr) if pr else f"inv={mc.get('invisibile', 0):.2f} bianco={ms.get('bianco', 0):.2f} sparisce={ms.get('sparisce', 0):.2f}"))
    print(f"\n{len(righe)} illustrazioni, {avvisi} con avvisi")
    if x.foglio:
        foglio(celle, x.foglio)
    sys.exit(1 if avvisi else 0)


def foglio(celle, uscita, lato=150, colonne=6):
    righe = (len(celle) + colonne - 1) // colonne
    im = Image.new("RGB", (colonne * (lato * 2 + 4), righe * (lato + 14)), (120, 120, 120))
    d = ImageDraw.Draw(im)
    with Renderer() as r:
        for i, (nome, c, s, ko) in enumerate(celle):
            x0, y0 = (i % colonne) * (lato * 2 + 4), (i // colonne) * (lato + 14)
            d.text((x0 + 2, y0 + 1), ("!! " if ko else "") + nome.split("/")[-1][:34], fill=(255, 255, 0) if not ko else (255, 120, 120))
            for k, (svg, fondo, c0) in enumerate(((c, CHIARO, (247, 249, 253)), (s, SCURO, (10, 16, 31)))):
                w, h = _dim(svg)
                sc = (lato - 8) / max(w, h)
                W, H = int(w * sc), int(h * sc)
                png = r.svg(svg, W, H, fondo)
                cella = Image.new("RGB", (lato, lato), c0)
                cella.paste(png, ((lato - W) // 2, (lato - H) // 2))
                im.paste(cella, (x0 + k * lato, y0 + 14))
    im.save(uscita)


if __name__ == "__main__":
    main()
