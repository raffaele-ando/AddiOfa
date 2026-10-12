#!/usr/bin/env python3
"""Ritaglia dai concept le due scene dell'hero della landing e le ripulisce dalle scritte che non si possono usare.
Scena del concept 41 (lastra blu con la porta di luce, scalinata, cielo, carte di vetro); in tema scuro l'app la scurisce con un filtro.
Cancella con l'inpainting l'insegna «Politecnico di Milano» e la carta «82 %»; i testi stanno nel codice. (Il concept 51, scuro, ha la scritta
scolpita sul monolite: l'inpainting lascia macchie visibili, per questo non si usa.)
Uso (da grafica/): python3 strumenti/brand/estrai_hero.py   -> grafica/brand/hero/scena-chiara.png e .webp"""
import pathlib
import cv2
import numpy as np
from PIL import Image

RADICE = pathlib.Path(__file__).resolve().parents[2]
SRC = RADICE / 'fonti/design-concept'
OUT = RADICE / 'brand/hero'
OUT.mkdir(parents=True, exist_ok=True)


def inpaint(img: Image.Image, scatole, raggio=7):
    a = np.array(img.convert('RGB'))
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in scatole:
        m[y0:y1, x0:x1] = 255
    out = cv2.inpaint(a, m, raggio, cv2.INPAINT_TELEA)
    return Image.fromarray(out)


def main():
    # concept 41, in coordinate dell'originale 1536x1024
    c41 = Image.open(SRC / 'file_00000000c23c82108838e288ab528e67.png').convert('RGB')
    # insegna «Politecnico di Milano» sull'edificio a destra e carta «82 %» a sinistra (la carta vera, con il valore d'esempio, si mette in codice)
    c41 = inpaint(c41, [(1395, 185, 1515, 265)], 9)
    a = np.array(c41)
    m = np.zeros(a.shape[:2], np.uint8)
    cv2.rectangle(m, (560 + 116, 70 + 56), (560 + 298, 70 + 238), 255, -1)
    c41 = Image.fromarray(cv2.inpaint(a, m, 12, cv2.INPAINT_NS))
    ch = c41.crop((560, 70, 1536, 560))
    ch.save(OUT / 'scena-chiara.png')
    ch.save(OUT / 'scena-chiara.webp', quality=82, method=6)
    print(ch.size)


if __name__ == '__main__':
    main()
