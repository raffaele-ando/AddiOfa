"""
Separa ogni icona del Brand Kit in due parti: il cerchio colorato (che diventa codice, con il
colore misurato) e il glifo, che viene staccato dal cerchio e ricreato in SVG.
Il glifo esce in `brand/glifi/<kit>/<nome>.svg` con viewBox pari al diametro del cerchio.
"""
from __future__ import annotations

import io
import json
import pathlib

import numpy as np
import vtracer
from PIL import Image


QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"
SCALA = 8


def glifo(percorso: pathlib.Path, misura: dict) -> tuple[str, dict]:
    im = Image.open(percorso).convert("RGBA")
    c = misura["corpo"]
    lato = max(c["w"], c["h"])
    cx, cy = c["x"] + c["w"] / 2, c["y"] + c["h"] / 2
    box = (int(round(cx - lato / 2)), int(round(cy - lato / 2)), int(round(cx + lato / 2)), int(round(cy + lato / 2)))
    fill = tuple(int(misura["riempimento"][k:k + 2], 16) for k in (1, 3, 5))
    # tutto sul colore del cerchio, poi il glifo si stacca da quel fondo uniforme
    piatto = Image.new("RGBA", im.size, fill + (255,))
    piatto.alpha_composite(im)
    ritaglio = piatto.crop(box).convert("RGB")
    grande = ritaglio.resize((lato * SCALA, lato * SCALA), Image.LANCZOS)
    buf = io.BytesIO()
    grande.save(buf, format="PNG")
    svg = vtracer.convert_raw_image_to_svg(buf.getvalue(), img_format="png", colormode="color", hierarchical="stacked",
                                           mode="spline", filter_speckle=10, color_precision=7, layer_difference=10,
                                           corner_threshold=60, length_threshold=4.0, splice_threshold=45, path_precision=1)
    import re
    # via i tracciati del colore del cerchio: il cerchio lo disegna il codice
    def tieni(m):
        colore = re.search(r'fill="#([0-9A-Fa-f]{6})"', m.group(0))
        if not colore:
            return m.group(0)
        c = [int(colore.group(1)[k:k + 2], 16) for k in (0, 2, 4)]
        return "" if max(abs(c[i] - fill[i]) for i in range(3)) <= 10 else m.group(0)
    corpo = re.sub(r"<\?xml[^>]*>|<!--.*?-->|</?svg[^>]*>", "", svg, flags=re.S).strip()
    corpo = re.sub(r"<path[^>]*/>", tieni, corpo)
    W = lato * SCALA
    r = W / 2
    out = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {W}"><defs><clipPath id="c"><circle cx="{r}" cy="{r}" r="{r - SCALA}"/></clipPath></defs>'
           f'<g clip-path="url(#c)">{corpo}</g></svg>')
    return out, {"diametro": lato, "cerchio": misura["riempimento"], "inchiostro": misura["inchiostro"]}


def main():
    misure = json.loads((BRAND / "misure.json").read_text())
    estrazione = json.loads((BRAND / "estrazione.json").read_text())
    indice = {}
    # diametro tipico per kit: un'icona fuori misura (ombra attaccata) si riporta a quello
    tipici = {}
    for k, m in misure.items():
        if "/icone/" in k:
            tipici.setdefault(k.split("/")[0], []).append(max(m["corpo"]["w"], m["corpo"]["h"]))
    tipici = {k: int(np.median(v)) for k, v in tipici.items()}
    for chiave, m in misure.items():
        if "/icone/" in chiave:
            t = tipici[chiave.split("/")[0]]
            c = m["corpo"]
            if max(c["w"], c["h"]) - t > 4:
                # il cerchio vero è in alto a destra dell'ombra: si tiene il bordo alto/destro
                m["corpo"] = {"x": c["x"] + c["w"] - t - (c["w"] - t) // 2, "y": c["y"], "w": t, "h": t}
    for el in estrazione["elementi"]:
        if el["gruppo"] != "icone":
            continue
        chiave = f"{el['kit']}/icone/{el['nome']}"
        svg, info = glifo(BRAND / el["file"], misure[chiave])
        dest = BRAND / "glifi" / el["kit"] / f"{el['nome']}.svg"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(svg)
        indice[chiave] = {"svg": str(dest.relative_to(BRAND)), **info, "byte": len(svg)}
        print(f"{chiave:35} {info['diametro']}px cerchio {info['cerchio']} {len(svg) // 1024} KB")
    (BRAND / "glifi.json").write_text(json.dumps(indice, indent=1))


if __name__ == "__main__":
    main()
