"""
Tavole di controllo: per ogni elemento l'originale, l'SVG ricreato e la differenza (×4),
su fondo della tavola e su fondo scuro, con lo scarto misurato. Una tavola per kit.
"""
from __future__ import annotations

import json
import pathlib

import numpy as np
from PIL import Image, ImageDraw

from render import Renderer, su_fondo

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"
CELLA = 132
SCURO = (15, 23, 42)


def miniatura(arr: np.ndarray) -> Image.Image:
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im.thumbnail((CELLA - 8, CELLA - 8))
    return im


def main():
    estrazione = {f"{e['kit']}/{e['gruppo']}/{e['nome']}": e for e in json.loads((BRAND / "estrazione.json").read_text())["elementi"]}
    vettori = json.loads((BRAND / "vettori.json").read_text())
    per_kit: dict[str, list] = {}
    for v in vettori:
        per_kit.setdefault(v["elemento"].split("/")[0], []).append(v)
    uscita = BRAND / "tavole"
    uscita.mkdir(exist_ok=True)
    with Renderer() as r:
        for kit, voci in per_kit.items():
            righe = len(voci)
            tav = Image.new("RGB", (CELLA * 5 + 280, CELLA * righe + 30), "white")
            d = ImageDraw.Draw(tav)
            for j, t in enumerate(["originale", "SVG", "differenza ×4", "originale (scuro)", "SVG (scuro)"]):
                d.text((j * CELLA + 6, 8), t, fill=(90, 90, 90))
            for i, v in enumerate(voci):
                el = estrazione[v["elemento"]]
                esatto = Image.open(BRAND / el["file"]).convert("RGBA")
                w, h = esatto.size
                reso = r.svg((BRAND / v["svg"]).read_text(), w, h)
                a, b = su_fondo(esatto, el["fondo"]), su_fondo(reso, el["fondo"])
                celle = [a, b, np.abs(a - b) * 4, su_fondo(esatto, SCURO), su_fondo(reso, SCURO)]
                y = 30 + i * CELLA
                for j, c in enumerate(celle):
                    if j >= 3:
                        d.rectangle([j * CELLA, y, (j + 1) * CELLA - 1, y + CELLA - 1], fill=SCURO)
                    m = miniatura(c)
                    tav.paste(m, (j * CELLA + (CELLA - m.width) // 2, y + (CELLA - m.height) // 2))
                d.text((5 * CELLA + 10, y + 40), v["elemento"].split("/", 1)[1], fill=(20, 20, 20))
                d.text((5 * CELLA + 10, y + 60), f"scarto {v['punteggio']}/255  SSIM {v['fondo_tavola']['ssim']}", fill=(90, 90, 90))
            tav.save(uscita / f"{kit}.png", optimize=True)
            print(uscita / f"{kit}.png")


if __name__ == "__main__":
    main()
