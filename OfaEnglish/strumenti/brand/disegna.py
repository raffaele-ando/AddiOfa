"""
Ricostruisce un'illustrazione come la disegnerebbe un designer: poche forme morbide, ognuna con
la sua sfumatura, invece di migliaia di strati di colore a gradini (il ricalco di vettorializza.py).

Per ogni illustrazione:
  1. divide il disegno in parti dove il colore cambia di netto (superpixel SLIC, poi unione delle
     zone vicine separate solo da passaggi dolci);
  2. per ogni parte adatta ai pixel una sfumatura: lineare (direzione e 2-4 fermate) o radiale,
     quella che sbaglia meno; se la parte è quasi uniforme, un colore pieno;
  3. ne ricava il contorno come curva morbida (vtracer in modalità binaria sul contorno ingrandito);
  4. ombre e aloni semitrasparenti diventano forme sfocate con un filtro;
  5. rende l'SVG in Chromium e misura lo scarto con l'originale, come per il resto del kit.

    python3 strumenti/brand/disegna.py kit-blu/illustrazioni/studio-inglese
    python3 strumenti/brand/disegna.py tutto
"""
from __future__ import annotations

import io
import json
import math
import pathlib
import re
import sys

import numpy as np
import vtracer
from PIL import Image
from scipy import ndimage as ndi
from skimage import color, graph, segmentation

from render import Renderer, su_fondo, confronta

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"
SCALA = 3            # lavoro sull'immagine ingrandita: contorni più morbidi
SCURO = (15, 23, 42)


def esa(c) -> str:
    return "#%02x%02x%02x" % tuple(int(round(max(0, min(255, v)))) for v in c)


# ---------------------------------------------------------------- 1. parti

def parti(rgb: np.ndarray, pieno: np.ndarray, n_colori: int, soglia_unione: float) -> np.ndarray:
    import cv2
    from skimage import measure
    # ammorbidisce la grana ma non i bordi, poi raggruppa i colori (k-means in Lab)
    liscio = rgb.astype(np.uint8)
    for _ in range(2):
        liscio = cv2.bilateralFilter(liscio, 9, 22, 7)
    lab = color.rgb2lab(liscio / 255.0)
    campioni = lab[pieno].astype(np.float32)
    criteri = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    _, etichette_k, _ = cv2.kmeans(campioni, n_colori, None, criteri, 2, cv2.KMEANS_PP_CENTERS)
    mappa = np.zeros(pieno.shape, np.int32)
    mappa[pieno] = etichette_k[:, 0] + 1
    zone = measure.label(mappa, connectivity=1, background=0)
    # le zone minuscole (grana, antialias) vanno alla zona grande più vicina
    aree = np.bincount(zone.ravel())
    piccole = (aree[zone] < 40) & pieno
    grandi = pieno & ~piccole
    if piccole.any() and grandi.any():
        _, (iy, ix) = ndi.distance_transform_edt(~grandi, return_indices=True)
        zone = np.where(piccole, zone[iy, ix], zone)
    zone = np.where(pieno, zone, 0)
    zone, _, _ = segmentation.relabel_sequential(zone)
    # forza del bordo sull'immagine liscia: sfumature dolci = bordo debole, contorni veri = bordo forte
    bordi = np.hypot(ndi.sobel(lab[..., 0], 0), ndi.sobel(lab[..., 0], 1)) + \
        0.6 * np.hypot(ndi.sobel(lab[..., 1], 0), ndi.sobel(lab[..., 1], 1)) + \
        0.6 * np.hypot(ndi.sobel(lab[..., 2], 0), ndi.sobel(lab[..., 2], 1))
    base = np.where(pieno, zone, 0)
    g = graph.rag_boundary(base + 1, bordi)
    if 1 in g:
        g.remove_node(1)  # il fondo non si unisce con niente

    # unione come nell'esempio di scikit-image per i grafi di bordo: il peso è la media del bordo comune
    def pesa(g, src, dst, n):
        vuoto = {"weight": 0.0, "count": 0}
        cs, cd = g[src].get(n, vuoto)["count"], g[dst].get(n, vuoto)["count"]
        ws, wd = g[src].get(n, vuoto)["weight"], g[dst].get(n, vuoto)["weight"]
        return {"count": cs + cd, "weight": (cs * ws + cd * wd) / max(1, cs + cd)}

    def unisci(g, src, dst):
        pass
    unite = graph.merge_hierarchical(base + 1, g, thresh=soglia_unione, rag_copy=False, in_place_merge=True,
                                     merge_func=unisci, weight_func=pesa)
    return np.where(pieno, unite + 1, 0)


# ---------------------------------------------------------------- 2. sfumature

def adatta_sfumatura(xy: np.ndarray, col: np.ndarray, pesi: np.ndarray):
    """La sfumatura che sbaglia meno sui pixel della parte: piena, lineare o radiale."""
    media = (col * pesi[:, None]).sum(0) / pesi.sum()
    err_pieno = np.sqrt((((col - media) ** 2).sum(1) * pesi).sum() / pesi.sum())
    migliore = ("pieno", {"colore": media}, err_pieno)
    if len(col) < 30 or err_pieno < 3.0:
        return migliore
    # lineare: direzione dal modello affine della luminosità
    A = np.c_[np.ones(len(xy)), xy]
    W = np.sqrt(pesi)[:, None]
    lum = col @ np.array([0.3, 0.59, 0.11])
    coef, *_ = np.linalg.lstsq(A * W, lum * W[:, 0], rcond=None)
    d = coef[1:]
    if np.linalg.norm(d) > 1e-6:
        d = d / np.linalg.norm(d)
        t = xy @ d
        t0, t1 = np.percentile(t, 1), np.percentile(t, 99)
        if t1 - t0 > 1:
            u = np.clip((t - t0) / (t1 - t0), 0, 1)
            fermate = []
            for c in (0.0, 0.33, 0.67, 1.0):
                vicini = np.abs(u - c) < 0.17
                if vicini.sum() < 3:
                    continue
                fermate.append((c, (col[vicini] * pesi[vicini, None]).sum(0) / pesi[vicini].sum()))
            if len(fermate) >= 2:
                cs = np.array([f[0] for f in fermate]); vs = np.array([f[1] for f in fermate])
                pred = np.stack([np.interp(u, cs, vs[:, k]) for k in range(3)], axis=1)
                err = np.sqrt((((col - pred) ** 2).sum(1) * pesi).sum() / pesi.sum())
                if err < migliore[2] * 0.92:
                    p0 = xy.mean(0) + d * (t0 - xy.mean(0) @ d)
                    p1 = xy.mean(0) + d * (t1 - xy.mean(0) @ d)
                    migliore = ("lineare", {"p0": p0, "p1": p1, "fermate": fermate}, err)
    # radiale: centro nel punto più chiaro (luce) o più scuro, raggio fino al bordo
    for estremo in (np.argmax(lum), np.argmin(lum)):
        c = xy[estremo]
        r = np.linalg.norm(xy - c, axis=1)
        R = np.percentile(r, 99)
        if R < 2:
            continue
        u = np.clip(r / R, 0, 1)
        fermate = []
        for cc in (0.0, 0.33, 0.67, 1.0):
            vicini = np.abs(u - cc) < 0.17
            if vicini.sum() < 3:
                continue
            fermate.append((cc, (col[vicini] * pesi[vicini, None]).sum(0) / pesi[vicini].sum()))
        if len(fermate) < 2:
            continue
        cs = np.array([f[0] for f in fermate]); vs = np.array([f[1] for f in fermate])
        pred = np.stack([np.interp(u, cs, vs[:, k]) for k in range(3)], axis=1)
        err = np.sqrt((((col - pred) ** 2).sum(1) * pesi).sum() / pesi.sum())
        if err < migliore[2] * 0.92:
            migliore = ("radiale", {"c": c, "r": R, "fermate": fermate}, err)
    return migliore


def gradiente_svg(gid: str, tipo: str, g: dict, scala: float) -> str:
    stop = lambda fermate: "".join(f'<stop offset="{o:.2f}" stop-color="{esa(c)}"/>' for o, c in fermate)
    if tipo == "lineare":
        (x0, y0), (x1, y1) = g["p0"] * scala, g["p1"] * scala
        return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{x0:.1f}" y1="{y0:.1f}" '
                f'x2="{x1:.1f}" y2="{y1:.1f}">{stop(g["fermate"])}</linearGradient>')
    cx, cy = g["c"] * scala
    return (f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="{cx:.1f}" cy="{cy:.1f}" '
            f'r="{g["r"] * scala:.1f}">{stop(g["fermate"])}</radialGradient>')


# ---------------------------------------------------------------- 3. contorni

def contorno(maschera: np.ndarray, allarga: int = 1) -> str:
    """Tracciato morbido della maschera (in coordinate dell'immagine ingrandita)."""
    if allarga:
        maschera = ndi.binary_dilation(maschera, iterations=allarga)
    img = Image.fromarray(np.where(maschera, 0, 255).astype(np.uint8)).convert("RGB")
    buf = io.BytesIO(); img.save(buf, format="PNG")
    svg = vtracer.convert_raw_image_to_svg(buf.getvalue(), img_format="png", colormode="binary", mode="spline",
                                           filter_speckle=6, corner_threshold=80, length_threshold=5.0,
                                           splice_threshold=45, path_precision=1)
    percorsi = re.findall(r'<path d="([^"]+)"[^>]*transform="translate\(([-\d.]+),([-\d.]+)\)"', svg)
    if not percorsi:
        percorsi = [(d, "0", "0") for d in re.findall(r'<path d="([^"]+)"', svg)]
    # un solo tracciato con i trasferimenti applicati come gruppo
    return "".join(f'<path d="{d}" transform="translate({x},{y})"/>' for d, x, y in percorsi)


# ---------------------------------------------------------------- insieme

def disegna(esatto: Image.Image, n_segmenti: int = 260, soglia_unione: float = 0.9) -> tuple[str, dict]:
    w, h = esatto.size
    grande = esatto.resize((w * SCALA, h * SCALA), Image.LANCZOS)
    a = np.asarray(grande).astype(np.float64)
    rgb, alfa = a[..., :3], a[..., 3] / 255.0
    pieno = alfa >= 0.6
    etichette = parti(rgb, pieno, n_segmenti, soglia_unione)
    ids = [i for i in np.unique(etichette) if i > 0]
    aree = {i: (etichette == i).sum() for i in ids}
    ids.sort(key=lambda i: -aree[i])

    yy, xx = np.mgrid[0:h * SCALA, 0:w * SCALA]
    defs, forme = [], []

    # ombre e aloni: pixel semitrasparenti fuori dal pieno, come una forma sfocata per colore
    morbidi = (alfa > 0.03) & ~pieno
    if morbidi.sum() > 0.02 * max(1, pieno.sum()):
        pesi = alfa[morbidi]
        col = (rgb[morbidi] * pesi[:, None]).sum(0) / pesi.sum()
        sigma = max(1.0, float(np.median(ndi.distance_transform_edt(~pieno)[morbidi])) * 0.8)
        op = float(np.clip(np.percentile(alfa[morbidi], 75) * 1.4, 0.05, 1))
        defs.append(f'<filter id="alone" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="{sigma:.1f}"/></filter>')
        forme.append(f'<g id="alone-forma" fill="{esa(col)}" opacity="{op:.2f}" filter="url(#alone)">'
                     f'{contorno(ndi.binary_erosion(alfa > 0.12, iterations=int(sigma)), 0)}</g>')

    for k, i in enumerate(ids):
        m = etichette == i
        if m.sum() < 12:
            continue
        xy = np.c_[xx[m], yy[m]].astype(np.float64)
        tipo, g, _ = adatta_sfumatura(xy, rgb[m], alfa[m])
        riempi = esa(g["colore"]) if tipo == "pieno" else f"url(#g{k})"
        if tipo != "pieno":
            defs.append(gradiente_svg(f"g{k}", tipo, g, 1.0))
        forme.append(f'<g id="parte-{k + 1}" fill="{riempi}">{contorno(m, allarga=1)}</g>')

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w * SCALA} {h * SCALA}" width="{w}" height="{h}">'
           f'<defs>{"".join(defs)}</defs>{"".join(forme)}</svg>')
    return svg, {"parti": len(forme), "byte": len(svg)}


def misura(r: Renderer, svg: str, esatto: Image.Image, fondo) -> dict:
    w, h = esatto.size
    reso = r.svg(svg, w, h)
    chiaro = confronta(su_fondo(esatto, fondo), su_fondo(reso, fondo))
    scuro = confronta(su_fondo(esatto, SCURO), su_fondo(reso, SCURO))
    return {"fondo_tavola": chiaro, "fondo_scuro": scuro, "punteggio": round((chiaro["mae_255"] + scuro["mae_255"]) / 2, 2)}


def main(filtro: str):
    estrazione = json.loads((BRAND / "estrazione.json").read_text())
    risultati = []
    with Renderer() as r:
        for el in estrazione["elementi"]:
            if el["gruppo"] not in ("illustrazioni", "stati") or el["kit"] == "logo":
                continue
            chiave = f"{el['kit']}/{el['gruppo']}/{el['nome']}"
            if filtro != "tutto" and filtro not in chiave:
                continue
            esatto = Image.open(BRAND / el["file"]).convert("RGBA")
            prove = []
            for n_seg, soglia in ((16, 14.0), (24, 10.0), (32, 7.0)):
                svg, info = disegna(esatto, n_seg, soglia)
                m = misura(r, svg, esatto, el["fondo"])
                prove.append((m["punteggio"], info["byte"], svg, info, m, n_seg))
            migliore = min(p[0] for p in prove)
            scelta = min((p for p in prove if p[0] <= migliore * 1.08), key=lambda p: p[1])
            _, peso, svg, info, m, n_seg = scelta
            dest = BRAND / "disegni" / el["kit"] / el["gruppo"] / f"{el['nome']}.svg"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(svg)
            risultati.append({"elemento": chiave, "svg": str(dest.relative_to(BRAND)), "parti": info["parti"], "byte": peso, **m})
            print(f"{chiave:52} {info['parti']:4d} parti  scarto {m['punteggio']:5.2f}/255  SSIM {m['fondo_tavola']['ssim']:.3f}  {peso // 1024} KB", flush=True)
    if filtro == "tutto":
        (BRAND / "disegni.json").write_text(json.dumps(risultati, indent=1))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "tutto")
