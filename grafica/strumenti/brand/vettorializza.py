"""
Ricrea ogni elemento estratto come SVG vettoriale e ne misura la fedeltà.

Per ogni elemento prova alcune impostazioni di ricalco (vtracer, curve spline a strati di colore)
partendo dall'immagine ingrandita, rende ogni SVG in Chromium alla dimensione originale, lo
confronta con l'originale su due fondi (quello della tavola e uno scuro, così conta anche la
trasparenza) e tiene la versione più fedele; a parità di fedeltà quella più leggera.

L'SVG scala a qualsiasi dimensione; il PNG estratto resta la copia identica al pixel.
"""
from __future__ import annotations

import io
import json
import pathlib
import re
import sys

import numpy as np
import vtracer
from PIL import Image

from render import Renderer, su_fondo, confronta

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"
FONDO_SCURO = (15, 23, 42)  # il "primario" del Brand Kit

# Dalla più ricca alla più leggera
IMPOSTAZIONI = {
    "fine": dict(filter_speckle=1, color_precision=8, layer_difference=6, corner_threshold=60,
                 length_threshold=3.5, splice_threshold=45, path_precision=2),
    "media": dict(filter_speckle=2, color_precision=7, layer_difference=10, corner_threshold=60,
                  length_threshold=4.0, splice_threshold=45, path_precision=2),
    "leggera": dict(filter_speckle=4, color_precision=6, layer_difference=16, corner_threshold=60,
                    length_threshold=4.0, splice_threshold=45, path_precision=2),
}


def _vtracer(img: Image.Image, **kw) -> tuple[str, int, int]:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    svg = vtracer.convert_raw_image_to_svg(buf.getvalue(), img_format="png", **kw)
    corpo = re.sub(r"<\?xml[^>]*>|<!--.*?-->|</?svg[^>]*>", "", svg, flags=re.S).strip()
    return corpo, img.width, img.height


def nucleo_e_alone(esatto: Image.Image) -> tuple[Image.Image, np.ndarray]:
    """Separa la parte piena (alfa >= 50%) da ombre e aloni semitrasparenti."""
    a = np.asarray(esatto.convert("RGBA")).copy()
    alfa = a[..., 3]
    nucleo = a.copy()
    nucleo[..., 3] = np.where(alfa >= 128, 255, 0)
    return Image.fromarray(nucleo, "RGBA"), alfa


def ricalca(rgba: Image.Image, scala: int, parametri: dict, alone: dict | None = None) -> str:
    """SVG a due strati: alone sfocato (se c'è) e nucleo a tracciati netti."""
    nucleo, alfa = nucleo_e_alone(rgba)
    grande = nucleo.resize((rgba.width * scala, rgba.height * scala), Image.LANCZOS)
    g = np.asarray(grande).copy()
    g[..., 3] = np.where(g[..., 3] >= 128, 255, 0)
    corpo, W, H = _vtracer(Image.fromarray(g, "RGBA"), colormode="color", hierarchical="stacked",
                           mode="spline", max_iterations=10, **parametri)
    strati = ""
    if alone:
        strati = alone["svg"]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{rgba.width}" '
            f'height="{rgba.height}">{strati}{corpo}</svg>')


def sagoma_alone(rgba: Image.Image, scala: int) -> dict | None:
    """Forma e colore di ombre e aloni: pixel semitrasparenti fuori dal nucleo."""
    a = np.asarray(rgba.convert("RGBA")).astype(np.float64)
    alfa = a[..., 3]
    morbidi = (alfa > 6) & (alfa < 128)
    if morbidi.sum() < 0.03 * (alfa > 6).sum():
        return None
    pesi = alfa[morbidi][:, None]
    colore = (a[..., :3][morbidi] * pesi).sum(axis=0) / pesi.sum()
    forma = np.where(alfa > 6, 0, 255).astype(np.uint8)
    img = Image.fromarray(forma, "L").resize((rgba.width * scala, rgba.height * scala), Image.LANCZOS)
    img = img.point(lambda v: 0 if v < 128 else 255).convert("RGB")
    corpo, _, _ = _vtracer(img, colormode="binary", mode="spline", filter_speckle=4, corner_threshold=60,
                           length_threshold=4.0, splice_threshold=45, path_precision=1)
    corpo = re.sub(r'fill="[^"]*"', "", corpo)
    return {"corpo": corpo, "colore": "#%02x%02x%02x" % tuple(int(round(c)) for c in colore),
            "alfa_medio": float(alfa[morbidi].mean() / 255)}


def con_alone(base: dict, scala: int, sigma: float, opacita: float) -> dict:
    s = sigma * scala
    svg = (f'<defs><filter id="alone" x="-20%" y="-20%" width="140%" height="140%">'
           f'<feGaussianBlur stdDeviation="{s:.1f}"/></filter></defs>'
           f'<g filter="url(#alone)" opacity="{opacita:.2f}" fill="{base["colore"]}">{base["corpo"]}</g>')
    return {"svg": svg, "sigma": sigma, "opacita": opacita}


def misura(r: Renderer, svg: str, esatto: Image.Image, fondo_tavola) -> dict:
    w, h = esatto.size
    reso = r.svg(svg, w, h)
    chiaro = confronta(su_fondo(esatto, fondo_tavola), su_fondo(reso, fondo_tavola))
    scuro = confronta(su_fondo(esatto, FONDO_SCURO), su_fondo(reso, FONDO_SCURO))
    return {"fondo_tavola": chiaro, "fondo_scuro": scuro,
            "punteggio": round((chiaro["mae_255"] + scuro["mae_255"]) / 2, 2)}


def main(filtro: str | None = None) -> list[dict]:
    estrazione = json.loads((BRAND / "estrazione.json").read_text())
    risultati = []
    with Renderer() as r:
        for el in estrazione["elementi"]:
            chiave = f"{el['kit']}/{el['gruppo']}/{el['nome']}"
            if filtro and filtro not in chiave:
                continue
            esatto = Image.open(BRAND / el["file"]).convert("RGBA")
            lato = max(esatto.size)
            scala = 4 if lato < 200 else 2 if lato < 500 else 1
            prove = []
            for nome_imp, parametri in IMPOSTAZIONI.items():
                svg = ricalca(esatto, scala, parametri)
                m = misura(r, svg, esatto, el["fondo"])
                prove.append((m["punteggio"], len(svg), nome_imp, svg, m))
            # ombre e aloni: sfocatura e opacità scelte misurando, sull'impostazione migliore
            base = sagoma_alone(esatto, scala)
            if base:
                _, _, nome_imp, _, _ = min(prove)
                for sigma in (1.0, 2.0, 3.5, 6.0, 10.0):
                    for opacita in (0.25, 0.45, 0.7, 1.0):
                        alone = con_alone(base, scala, sigma, opacita)
                        svg = ricalca(esatto, scala, IMPOSTAZIONI[nome_imp], alone)
                        m = misura(r, svg, esatto, el["fondo"])
                        prove.append((m["punteggio"], len(svg), f"{nome_imp}+alone", svg, m))
            migliore = min(p[0] for p in prove)
            # a parità (entro il 10% dello scarto migliore) vince il file più leggero
            scelta = min((p for p in prove if p[0] <= migliore * 1.1 + 0.05), key=lambda p: p[1])
            _, peso, nome_imp, svg, m = scelta
            dest = BRAND / "vettori" / el["kit"] / el["gruppo"] / f"{el['nome']}.svg"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(svg)
            risultati.append({"elemento": chiave, "svg": str(dest.relative_to(BRAND)), "impostazione": nome_imp,
                              "byte": peso, **m})
            print(f"{chiave:55} {nome_imp:8} scarto {m['punteggio']:5.2f}/255  "
                  f"SSIM {m['fondo_tavola']['ssim']:.3f}  {peso // 1024} KB", flush=True)
    if not filtro:
        (BRAND / "vettori.json").write_text(json.dumps(risultati, indent=1, ensure_ascii=False))
    return risultati


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
