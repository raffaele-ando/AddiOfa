"""
Secondo passo dei disegni a mano: le forme restano quelle disegnate (bordi netti, nomi, ordine),
ma il loro colore diventa una maglia di sfumature (maglia.py) misurata sull'originale, così la
luce dentro ogni forma è quella vera. Come nel logo.

    python3 strumenti/brand/riempi_maglie.py brand/disegni/kit-blu/illustrazioni/studio-inglese.svg

Legge <nome>.svg (il disegno a forme, che resta la fonte da modificare) e scrive <nome>.maglie.svg
accanto. Ogni forma piena diventa <g id="stesso-id" clip-path="url(#forma-stesso-id)"> con dentro la
maglia; il contorno della forma va nel clipPath. Restano com'erano: le forme dentro un gruppo con
transform, i tratti (stroke), le forme semitrasparenti e quelle con data-maglia="no".
"""
from __future__ import annotations

import argparse
import json
import math
import pathlib
import re

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

from adatta_svg import BRAND, CHIARO, SCURO, riferimento_di, tavola
from maglia import adatta_maglia, maglia_svg
from render import Renderer, confronta, su_fondo

FORME = ("path", "rect", "circle", "ellipse", "polygon")
CELLA = 4.0


def elementi_forma(svg: str):
    """Forme candidate: (inizio, fine, id, tag, attributi) delle forme piene senza trasformazioni sopra."""
    fuori = []
    pila = []  # (tag, ha_transform)
    for m in re.finditer(r"<(/?)([\w:-]+)([^>]*?)(/?)>", svg):
        chiusa, tag, attrs, auto = m.group(1), m.group(2), m.group(3), m.group(4)
        if chiusa:
            while pila and pila[-1][0] != tag:
                pila.pop()
            if pila:
                pila.pop()
            continue
        trasformato = any(t for _, t in pila) or ("transform=" in attrs)
        in_defs = any(t == "defs" or t == "clipPath" or t == "mask" for t, _ in pila) or tag in ("defs",)
        if tag in FORME and not in_defs:
            idm = re.search(r'\sid="([^"]+)"', attrs)
            fill = re.search(r'\sfill="([^"]+)"', attrs)
            op = re.search(r'\sopacity="([\d.]+)"', attrs)
            if idm and not trasformato and 'data-maglia="no"' not in attrs and (fill is None or fill.group(1) != "none") \
                    and "stroke=" not in attrs and (op is None or float(op.group(1)) > 0.95):
                fuori.append((m.start(), m.end(), idm.group(1), tag, attrs))
        if not auto and tag not in FORME:
            pila.append((tag, "transform=" in attrs))
    return fuori


def mappa_id(r: Renderer, svg: str, forme, W, H):
    """Quale forma si vede in ogni pixel: si ridisegna tutto senza antialiasing, ogni forma candidata
    con un colore-codice e tutto il resto nero, senza filtri né trasparenze."""
    s = svg
    for k, (a, b, id_, tag, attrs) in sorted(enumerate(forme), key=lambda t: -t[1][0]):
        pezzo = re.sub(r'\sfill="[^"]*"', "", s[a:b])
        pezzo = pezzo.replace(f"<{tag}", f'<{tag} fill="@@{k}@@"', 1)
        s = s[:a] + pezzo + s[b:]
    # tutto il resto diventa nero; poi i segnaposto diventano i colori-codice
    s = re.sub(r"#[0-9A-Fa-f]{6}\b", "#000000", s)
    s = re.sub(r'\sfill="url\([^)]*\)"', ' fill="#000000"', s)
    s = re.sub(r'\sfilter="[^"]*"', "", s)
    s = re.sub(r'\s(opacity|fill-opacity|stop-opacity)="[^"]*"', "", s)
    s = re.sub(r"@@(\d+)@@", lambda m: "#%02X%02X%02X" % (1 + int(m.group(1)) // 256, int(m.group(1)) % 256, 77), s)
    s = s.replace("<svg ", '<svg shape-rendering="crispEdges" ', 1)
    im = np.asarray(r.svg(s, W, H)).astype(int)
    idx = np.full((H, W), -1)
    codici = (im[..., 2] == 77) & (im[..., 3] == 255)
    idx[codici] = (im[..., 0][codici] - 1) * 256 + im[..., 1][codici]
    return idx


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("svg")
    x = ap.parse_args()
    percorso = pathlib.Path(x.svg)
    originale = Image.open(riferimento_di(percorso)).convert("RGBA")
    W, H = originale.size
    orig = np.asarray(originale).astype(np.float64)
    svg = percorso.read_text()
    forme = elementi_forma(svg)
    with Renderer() as r:
        idx = mappa_id(r, svg, forme, W, H)
        nuovi_defs = []
        out = svg
        for k, (a, b, id_, tag, attrs) in sorted(enumerate(forme), key=lambda t: -t[1][0]):
            vis = idx == k
            if vis.sum() < 6:
                continue
            pieni = vis & (orig[..., 3] > 230)
            interni = ndi.binary_erosion(pieni, iterations=1)
            sel = interni if interni.sum() >= max(6, 0.3 * pieni.sum()) else pieni
            if sel.sum() < 4:
                continue
            ys, xs = np.nonzero(vis)
            x0, y0 = max(0, xs.min() - 2), max(0, ys.min() - 2)
            x1, y1 = min(W, xs.max() + 3), min(H, ys.max() + 3)
            g, e = adatta_maglia(orig[..., :3], sel, (float(x0), float(y0), float(x1), float(y1)),
                                 max(1, math.ceil((x1 - x0) / CELLA)), max(1, math.ceil((y1 - y0) / CELLA)), liscio=0.5)
            forma = re.sub(r'\s(id|fill|filter|opacity)="[^"]*"', "", svg[a:b])
            nuovi_defs.append(f'<clipPath id="forma-{id_}">{forma}</clipPath>')
            extra = "".join(re.findall(r'\s(?:filter|opacity)="[^"]*"', attrs))
            gruppo = f'<g id="{id_}" clip-path="url(#forma-{id_})"{extra}>{maglia_svg(id_ + "-luce", g, nuovi_defs)}</g>'
            out = out[:a] + gruppo + out[b:]
        out = out.replace("</defs>", "".join(nuovi_defs) + "</defs>", 1) if "</defs>" in out else \
            re.sub(r"(<svg[^>]*>)", lambda m: m.group(1) + "<defs>" + "".join(nuovi_defs) + "</defs>", out, count=1)
        dest = percorso.with_suffix(".maglie.svg")
        dest.write_text(out)
        im = r.svg(out, W, H)
        misure = {"fondo_chiaro": confronta(su_fondo(originale, CHIARO), su_fondo(im, CHIARO)),
                  "fondo_scuro": confronta(su_fondo(originale, SCURO), su_fondo(im, SCURO))}
        rel = percorso.resolve().relative_to((BRAND / "disegni").resolve())
        tavola(r, originale, out, BRAND / "tavole" / "disegni" / (str(rel.with_suffix("")).replace("/", "--") + ".maglie.png"))
    f_m = percorso.with_suffix(".misure.json")
    voce = json.loads(f_m.read_text()) if f_m.exists() else {}
    voce["maglie"] = {"svg": f"disegni/{rel.with_suffix('.maglie.svg')}", "byte": len(out), **misure}
    f_m.write_text(json.dumps(voce, indent=1))
    print(f"{percorso.name}: {len(forme)} forme con maglia, chiaro {misure['fondo_chiaro']['mae_255']}  "
          f"scuro {misure['fondo_scuro']['mae_255']}  ssim {misure['fondo_chiaro']['ssim']}  {len(out) // 1024} KB")


if __name__ == "__main__":
    main()
