"""
Modifica un'illustrazione scomposta in livelli (livelli.py): sposta, ingrandisce, ruota,
ricolora o nasconde alcune parti. Dove una parte si sposta, lo sfondo che era sotto viene
ricostruito dai pixel intorno (inpainting), così non restano buchi.

    # la bandiera (parti 6,12,14…) più in alto di 10 px e un po' più grande
    python3 strumenti/brand/modifica.py kit-blu/illustrazioni/studio-inglese --parti 6,12,14,15,16,17,18,20,21,22,23,24,25,26 --sposta 0,-10 --scala 1.1
    # il libro blu (parti 3,10,11) diventa verde
    python3 strumenti/brand/modifica.py kit-blu/illustrazioni/studio-inglese --parti 3,10,11 --ricolora "#3B82F6:#22C55E"
    # nascondere l'alone
    python3 strumenti/brand/modifica.py kit-blu/illustrazioni/studio-inglese --parti 1,2 --nascondi

I numeri delle parti sono nell'anteprima: brand/livelli/<kit>/<gruppo>/<nome>/anteprima.png.
Esce <nome>--modificato.png e .svg nella stessa cartella (l'originale non si tocca).
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import pathlib

import cv2
import numpy as np
from PIL import Image

from ricolora import trasforma

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"


def dataurl(im: Image.Image) -> str:
    buf = io.BytesIO(); im.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("elemento")
    p.add_argument("--parti", help="numeri delle parti, separati da virgola")
    p.add_argument("--zona", help='x0,y0,x1,y1: prende le parti che stanno per almeno il 60%% dentro')
    p.add_argument("--escludi", help="x0,y0,x1,y1: toglie le parti che stanno per almeno il 60%% dentro")
    p.add_argument("--sposta", default="0,0", help="dx,dy in pixel")
    p.add_argument("--scala", type=float, default=1.0)
    p.add_argument("--ruota", type=float, default=0.0, help="gradi, attorno al centro delle parti")
    p.add_argument("--ricolora", help='"#da:#a"')
    p.add_argument("--nascondi", action="store_true")
    p.add_argument("--uscita", default="modificato")
    x = p.parse_args()

    cartella = BRAND / "livelli" / x.elemento
    info = json.loads((cartella / "livelli.json").read_text())
    base = np.asarray(Image.open(cartella / "base.png").convert("RGBA")).astype(np.float64)
    H, W = base.shape[:2]
    scelte = {int(v) for v in x.parti.split(",")} if x.parti else set()
    def nella_zona(zona: str) -> set[int]:
        zx0, zy0, zx1, zy1 = (float(v) for v in zona.split(","))
        dentro_zona = set()
        for parte in info["parti"]:
            px0, py0, px1, py1 = parte["riquadro"]
            pezzo = np.asarray(Image.open(cartella / parte["file"]).convert("RGBA"))[..., 3] > 0
            ys, xs = np.nonzero(pezzo)
            quota = ((xs + px0 >= zx0) & (xs + px0 <= zx1) & (ys + py0 >= zy0) & (ys + py0 <= zy1)).mean() if len(xs) else 0
            if quota >= 0.6:
                dentro_zona.add(parte["n"])
        return dentro_zona
    if x.zona:
        scelte |= nella_zona(x.zona)
    if x.escludi:
        scelte -= nella_zona(x.escludi)
    if x.zona or x.escludi:
        print("parti scelte:", sorted(scelte))

    # immagine delle parti scelte e della parte restante
    scelto = np.zeros_like(base)
    for parte in info["parti"]:
        if parte["n"] in scelte:
            x0, y0, x1, y1 = parte["riquadro"]
            pezzo = np.asarray(Image.open(cartella / parte["file"]).convert("RGBA")).astype(np.float64)
            scelto[y0:y1, x0:x1] = np.where(pezzo[..., 3:4] > 0, pezzo, scelto[y0:y1, x0:x1])
    maschera = scelto[..., 3] > 0
    resto = base.copy(); resto[maschera] = 0

    # il buco lasciato dalle parti scelte si riempie dai pixel intorno, solo dove c'era altro disegno sotto
    buco = maschera.astype(np.uint8) * 255
    rgb = cv2.inpaint(np.clip(resto[..., :3], 0, 255).astype(np.uint8), buco, 5, cv2.INPAINT_TELEA)
    alfa = cv2.inpaint(np.clip(resto[..., 3], 0, 255).astype(np.uint8), buco, 5, cv2.INPAINT_TELEA)
    # fuori dal disegno (dove intorno era trasparente) il buco resta trasparente
    alfa = np.where(maschera, np.minimum(alfa, 255), resto[..., 3])
    sfondo = np.concatenate([np.where(maschera[..., None], rgb, resto[..., :3]), alfa[..., None]], axis=-1)

    # trasforma le parti scelte
    if x.ricolora:
        da, a = x.ricolora.split(":")
        nuovo, _ = trasforma(scelto[..., :3], da, a, 40.0)
        scelto[..., :3] = np.where(maschera[..., None], nuovo, scelto[..., :3])
    dx, dy = (float(v) for v in x.sposta.split(","))
    ys, xs = np.nonzero(maschera)
    cx, cy = (xs.mean(), ys.mean()) if len(xs) else (W / 2, H / 2)
    M = cv2.getRotationMatrix2D((cx, cy), -x.ruota, x.scala)
    M[0, 2] += dx; M[1, 2] += dy
    premul = np.concatenate([scelto[..., :3] * scelto[..., 3:4] / 255.0, scelto[..., 3:4]], axis=-1).astype(np.float32)
    mosso = cv2.warpAffine(premul, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    mosso = np.clip(mosso, 0, 255)
    a_m = mosso[..., 3:4] / 255.0
    col_m = np.where(a_m > 0, mosso[..., :3] / np.maximum(a_m, 1e-6), 0)

    # composizione: sfondo ricostruito + parti trasformate sopra
    a_s = sfondo[..., 3:4] / 255.0
    if x.nascondi:
        out_a, out_c = a_s, sfondo[..., :3]
    else:
        out_a = a_m + a_s * (1 - a_m)
        out_c = np.where(out_a > 0, (col_m * a_m + sfondo[..., :3] * a_s * (1 - a_m)) / np.maximum(out_a, 1e-6), 0)
    out = np.concatenate([np.clip(out_c, 0, 255), np.clip(out_a * 255, 0, 255)], axis=-1).astype(np.uint8)
    nome = x.elemento.split("/")[-1]
    im = Image.fromarray(out, "RGBA")
    im.save(cartella / f"{nome}--{x.uscita}.png", optimize=True)
    # SVG a due livelli: sfondo ricostruito e parti modificate, ognuno sostituibile
    sf = Image.fromarray(np.clip(sfondo, 0, 255).astype(np.uint8), "RGBA")
    pm = Image.fromarray(np.concatenate([np.clip(col_m, 0, 255), np.clip(a_m * 255, 0, 255)], axis=-1).astype(np.uint8), "RGBA")
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
           f'<g id="sfondo"><image width="{W}" height="{H}" href="{dataurl(sf)}"/></g>'
           + ("" if x.nascondi else f'<g id="parti-modificate"><image width="{W}" height="{H}" href="{dataurl(pm)}"/></g>') + "</svg>")
    (cartella / f"{nome}--{x.uscita}.svg").write_text(svg)
    print(cartella / f"{nome}--{x.uscita}.png")


if __name__ == "__main__":
    main()
