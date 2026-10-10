"""
Stacca un elemento dal fondo pieno su cui è disegnato, senza cambiare un pixel del disegno.

Parte dalla formula di Agorà (AgoraCheck/strumenti/stacca_fondo.py): un pixel di bordo è
`p = a*F + (1-a)*B`, con B il fondo, F il colore vero e `a` l'opacità. La differenza è che qui
F non è un colore unico (quello va bene per un marchio monocolore) né una stima globale (va bene
per un'emoji), ma il colore del pixel pieno più vicino: le illustrazioni del Brand Kit hanno
gradienti e bianchi interni, e un colore unico le sporcherebbe.

- Il fondo è ciò che si raggiunge dal bordo del ritaglio passando solo da pixel uguali al fondo
  (riempimento dall'esterno): il bianco dentro un foglio o una busta resta pieno.
- Solo la fascia di bordo diventa semitrasparente, con `a` misurata sulla retta fondo → colore
  pieno vicino (così un bordo grigio su bianco non diventa mezzo trasparente per errore).
- Ricomponendo il PNG sul fondo originale si riottiene il ritaglio: `verifica_ricomposizione`
  misura lo scarto, che deve restare sotto 1/255.
"""
from __future__ import annotations

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def stima_fondo(rgb: np.ndarray) -> np.ndarray:
    """Il colore del fondo: la mediana della cornice di 2 px attorno al ritaglio."""
    cornice = np.concatenate([rgb[:2].reshape(-1, 3), rgb[-2:].reshape(-1, 3),
                              rgb[:, :2].reshape(-1, 3), rgb[:, -2:].reshape(-1, 3)])
    return np.median(cornice, axis=0)


def maschera_fondo(rgb: np.ndarray, fondo: np.ndarray, soglia: float = 3.0) -> np.ndarray:
    """Pixel di fondo raggiungibili dal bordo del ritaglio (4-connessi)."""
    simile = np.linalg.norm(rgb - fondo, axis=2) <= soglia
    lab, _ = ndi.label(simile)
    bordo = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bordo = bordo[bordo > 0]
    return np.isin(lab, bordo)


def stacca(im: Image.Image, fondo=None, soglia: float = 3.0, fascia: int = 2) -> tuple[Image.Image, dict]:
    rgb = np.asarray(im.convert("RGB")).astype(np.float64)
    B = np.asarray(fondo, dtype=np.float64) if fondo is not None else stima_fondo(rgb)

    esterno = maschera_fondo(rgb, B, soglia)
    pieno = ~esterno
    # Il "cuore": pixel pieni lontani almeno `fascia` px dal fondo. Il loro colore è quello vero.
    cuore = ndi.binary_erosion(pieno, iterations=fascia, border_value=0)
    if not cuore.any():
        cuore = pieno

    # Per ogni pixel, il pixel del cuore più vicino: il colore pieno di riferimento R
    _, (iy, ix) = ndi.distance_transform_edt(~cuore, return_indices=True)
    R = rgb[iy, ix]

    alfa = np.where(pieno, 1.0, 0.0)
    colore = rgb.copy()
    bordo = pieno & ~cuore
    # anche i pixel "di fondo" adiacenti al disegno possono portare un filo di antialiasing
    alone = esterno & ndi.binary_dilation(pieno, iterations=1)
    zona = bordo | alone

    RB = R - B
    lung2 = (RB ** 2).sum(axis=2)
    proiez = ((rgb - B) * RB).sum(axis=2) / np.maximum(lung2, 1e-9)
    # se il colore pieno è quasi uguale al fondo (bianco su bianco) il bordo resta com'è
    affidabile = lung2 > 36.0
    a_bordo = np.clip(proiez, 0.0, 1.0)
    alfa = np.where(zona & affidabile, a_bordo, alfa)
    alfa = np.where(zona & ~affidabile, np.where(pieno, 1.0, 0.0), alfa)

    # colore vero sul bordo: F = (p - (1-a)B) / a, con R come ripiego dove a è piccolo
    with np.errstate(invalid="ignore", divide="ignore"):
        F = (rgb - (1 - alfa)[..., None] * B) / np.maximum(alfa, 1e-6)[..., None]
    F = np.where((alfa < 0.25)[..., None], R, F)
    colore = np.where(zona[..., None], np.clip(F, 0, 255), colore)

    out = np.zeros((*alfa.shape, 4), dtype=np.uint8)
    out[..., :3] = np.round(colore).astype(np.uint8)
    out[..., 3] = np.round(alfa * 255).astype(np.uint8)
    info = {"fondo": [int(round(c)) for c in B]}
    return Image.fromarray(out, "RGBA"), info


def componi(rgba: Image.Image, fondo) -> np.ndarray:
    a = np.asarray(rgba).astype(np.float64)
    al = a[..., 3:4] / 255.0
    return a[..., :3] * al + np.asarray(fondo, dtype=np.float64) * (1 - al)


def verifica_ricomposizione(originale: Image.Image, rgba: Image.Image, fondo) -> dict:
    """Ricompone il PNG staccato sul fondo originale e lo confronta col ritaglio."""
    o = np.asarray(originale.convert("RGB")).astype(np.float64)
    r = componi(rgba, fondo)
    diff = np.abs(o - r)
    return {"mae_255": round(float(diff.mean()), 3), "max_255": round(float(diff.max()), 1),
            "entro_2": round(float((diff.max(axis=2) <= 2).mean()), 4)}


def ritaglia_stretto(rgba: Image.Image, margine: int = 2) -> tuple[Image.Image, tuple[int, int, int, int]]:
    bbox = rgba.getbbox()
    if bbox is None:
        return rgba, (0, 0, rgba.width, rgba.height)
    x0, y0, x1, y1 = bbox
    x0, y0 = max(0, x0 - margine), max(0, y0 - margine)
    x1, y1 = min(rgba.width, x1 + margine), min(rgba.height, y1 + margine)
    return rgba.crop((x0, y0, x1, y1)), (x0, y0, x1, y1)


def stacca_morbido(im: Image.Image, fondo=None, pieno_da: float = 48.0, soglia: float = 3.0) -> Image.Image:
    """
    Variante per fondi diversi da quello originale (per esempio il tema scuro).

    Aloni e nuvolette chiare attorno alle illustrazioni sono una tinta leggera sul bianco: in
    `stacca` restano opachi, quindi su un fondo scuro diventano macchie bianche. Qui ogni pixel
    della zona chiara collegata all'esterno riceve `a = distanza dal fondo / pieno_da` e il suo
    colore viene ricavato togliendo il fondo, come nella formula di Agorà. Sul fondo originale
    ricompone lo stesso ritaglio; il bianco racchiuso dentro il disegno resta pieno.
    """
    rgb = np.asarray(im.convert("RGB")).astype(np.float64)
    B = np.asarray(fondo, dtype=np.float64) if fondo is not None else stima_fondo(rgb)
    d = np.linalg.norm(rgb - B, axis=2)
    chiaro = d < pieno_da
    lab, _ = ndi.label(chiaro)
    bordo = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    esterno_chiaro = np.isin(lab, bordo[bordo > 0])
    alfa = np.where(esterno_chiaro, np.clip(d / pieno_da, 0, 1), 1.0)
    alfa = np.where(esterno_chiaro & (d <= soglia), 0.0, alfa)
    with np.errstate(invalid="ignore", divide="ignore"):
        F = B + (rgb - B) / np.maximum(alfa, 1e-6)[..., None]
    F = np.where((alfa > 0)[..., None], np.clip(F, 0, 255), rgb)
    out = np.zeros((*alfa.shape, 4), dtype=np.uint8)
    out[..., :3] = np.round(F).astype(np.uint8)
    out[..., 3] = np.round(alfa * 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")
