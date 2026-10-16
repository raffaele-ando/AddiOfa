#!/usr/bin/env python3
"""Ritagli della landing dai concept 45 (banner con l'edificio, chiusura con il logo 3D), ripuliti dalle scritte.
Le scritte del concept (titoli, bottoni degli store, «Stessa partenza», lettere sulla facciata) si cancellano con l'inpainting
mirato sui soli tratti delle lettere (non su rettangoli interi, che lasciano macchie); i testi veri stanno nel codice.
Uso (da grafica/): python3 strumenti/brand/estrai_landing.py
 -> grafica/brand/landing/*.webp e copia in app/src/brand/essenziali/landing/ (la landing li importa da lì)."""
import pathlib
import shutil
import cv2
import numpy as np
from PIL import Image, ImageFilter

RADICE = pathlib.Path(__file__).resolve().parents[2]
SRC = RADICE / 'fonti/design-concept'
OUT = RADICE / 'brand/landing'
APP = RADICE.parent / 'app/src/brand/essenziali/landing'
OUT.mkdir(parents=True, exist_ok=True)
APP.mkdir(parents=True, exist_ok=True)

C45 = 'file_00000000e55481f4afd0f6b1727320de.png'


def tratti(img, riquadro, soglia, chiaro, poligono=None, mediana=21, dilata=5):
    """Maschera dei tratti (lettere) dentro `riquadro`: pixel più chiari (chiaro=True) o più scuri dell'intorno di almeno `soglia`."""
    x0, y0, x1, y1 = riquadro
    g = cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_RGB2GRAY)
    med = cv2.medianBlur(g, mediana).astype(np.float32)
    d = (g.astype(np.float32) - med) if chiaro else (med - g.astype(np.float32))
    m = ((d > soglia).astype(np.uint8)) * 255
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilata, dilata)))
    pieno = np.zeros(img.shape[:2], np.uint8)
    pieno[y0:y1, x0:x1] = m
    if poligono is not None:
        p = np.zeros(img.shape[:2], np.uint8)
        cv2.fillPoly(p, [np.array(poligono)], 255)
        pieno = cv2.bitwise_and(pieno, p)
    return pieno


def piu(img, scala=2):
    w, h = img.size
    return img.resize((w * scala, h * scala), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))


def main():
    a = np.array(Image.open(SRC / C45).convert('RGB'))

    # --- banner con l'edificio (x 772-1520, y 563-817): via le lettere sulla facciata e il testo bianco a sinistra
    m = tratti(a, (1290, 640, 1480, 775), 20, False, [(1298, 752), (1298, 722), (1425, 645), (1470, 645), (1470, 690), (1370, 775), (1310, 775)])
    m |= tratti(a, (800, 580, 1160, 810), 38, True, mediana=15, dilata=7)
    b = cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA)
    banner = Image.fromarray(b).crop((1040, 572, 1508, 808))   # solo la foto: a sinistra c'era il testo, la sfuma il CSS
    banner.save(OUT / 'banner-edificio-1x.png')
    piu(banner).save(OUT / 'banner-edificio.webp', quality=80, method=6)

    # --- chiusura con il logo 3D (x 776-1536, y 821-1024): via testo, bottoni degli store e «Stessa partenza»
    m = tratti(a, (790, 840, 1130, 1000), 40, True, mediana=15, dilata=7)
    m |= tratti(a, (790, 940, 1130, 1000), 40, False, mediana=25, dilata=9)
    m |= tratti(a, (1400, 890, 1530, 975), 25, False, mediana=21, dilata=7)
    b = cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA)
    cta = Image.fromarray(b).crop((1066, 832, 1516, 1003))   # solo il logo e il cielo: a sinistra c'erano testo e bottoni degli store
    cta.save(OUT / 'cta-fondo-1x.png')
    piu(cta).save(OUT / 'cta-fondo.webp', quality=80, method=6)

    for f in OUT.glob('*.webp'):
        shutil.copy(f, APP / f.name)
        print(f.name, Image.open(f).size, f.stat().st_size)


if __name__ == '__main__':
    main()
