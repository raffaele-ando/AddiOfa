#!/usr/bin/env python3
"""Marchio «porta a stella» di AddiOFA (scelto dall'autore il 24/11/2026), ricavato dal riferimento.

Il disegno non è ricostruito a mano: le forme si tracciano dai pixel del riferimento
grafica/fonti/ai-nuove/logo-porta-stella-ref.webp (1254 px), così il marchio resta uguale.
- riquadro: bordi misurati sul riferimento, portato a quadrato (la tavola di costruzione lo dà 1,00x per lato),
  raggio 0,27 del lato (quello con lo scarto minimo; la tavola dice circa 0,25x);
- porta blu notte: contorno della regione blu notte;
- luce: contorno della regione più chiara del blu, riempita con il profilo di colore misurato al centro;
  nitida dentro la porta, sfumata sotto gli stipiti (dove finiscono, y 1519/1792).
Scarto medio con il riferimento: 2,5/255 (misurato con Chromium a 448 px).
Serve: numpy, opencv-python-headless (pip install --user numpy opencv-python-headless).
Uso (dalla radice): python3 grafica/strumenti/brand/logo/marchio_porta_stella.py
Scrive grafica/brand/logo/marchio-porta-stella.svg e -pieno-campo.svg (icone maskable).
"""
import pathlib

import cv2
import numpy as np

RADICE = pathlib.Path(__file__).resolve().parents[4]
RIF = RADICE / 'grafica' / 'fonti' / 'ai-nuove' / 'logo-porta-stella-ref.webp'
OUT = RADICE / 'grafica' / 'brand' / 'logo'

N = 1792                 # lato di lavoro del riquadro
RAGGIO = 0.27            # raggio degli angoli, frazione del lato
TAGLIO = 1519            # fine interna degli stipiti: sopra la luce è nitida, sotto sfuma
SFUMATURA = 22           # deviazione della sfumatura della luce (unità del riquadro da 1792)
BLU = '#0977FD'          # riquadro, misurato
NOTTE = '#011537'        # porta, misurata


def traccia():
    im = cv2.imread(str(RIF))
    b, g, r = [im[:, :, i].astype(int) for i in range(3)]
    ys, xs = np.where((b > 200) & (r < 80))
    crop = im[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    sq = cv2.resize(crop, (N, N), interpolation=cv2.INTER_CUBIC)
    B, G, R = [sq[:, :, i].astype(int) for i in range(3)]

    def contorno(maschera, eps=1.2):
        cs, _ = cv2.findContours(maschera.astype(np.uint8) * 255, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        c = cv2.approxPolyDP(max(cs, key=cv2.contourArea), eps, True)[:, 0, :]
        return 'M' + ' L'.join(f'{x} {y}' for x, y in c) + ' Z'

    porta = contorno((B < 120) & (R < 45) & (G < 70))
    luce = contorno(R > 30)
    cx, y0 = N // 2, 560
    stops = ''.join(
        f'<stop offset="{(y - y0) / (N - 1 - y0):.3f}" stop-color="#{R[y, cx]:02X}{G[y, cx]:02X}{B[y, cx]:02X}"/>'
        for y in list(range(y0, N, 24)) + [N - 1])
    return porta, luce, stops


def svg(porta, luce, stops, tutto_campo=False):
    lato, m = 512, (0 if tutto_campo else 32)
    s = (lato - 2 * m) / N
    rx = 0 if tutto_campo else round(RAGGIO * N)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {lato} {lato}" width="{lato}" height="{lato}">
<title>AddiOFA</title>
<defs>
<linearGradient id="luce" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="{N - 1}">{stops}</linearGradient>
<filter id="sfuma" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="{SFUMATURA}"/></filter>
<clipPath id="dentro"><rect width="{N}" height="{TAGLIO}"/></clipPath>
<clipPath id="riquadro"><rect width="{N}" height="{N}" rx="{rx}"/></clipPath>
</defs>
<g transform="translate({m} {m}) scale({s:.6f})" clip-path="url(#riquadro)">
<rect width="{N}" height="{N}" fill="{BLU}"/>
<path d="{luce}" fill="url(#luce)" filter="url(#sfuma)"/>
<path d="{luce}" fill="url(#luce)" clip-path="url(#dentro)"/>
<path d="{porta}" fill="{NOTTE}"/>
</g>
</svg>
'''


if __name__ == '__main__':
    porta, luce, stops = traccia()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'marchio-porta-stella.svg').write_text(svg(porta, luce, stops), encoding='utf-8')
    (OUT / 'marchio-porta-stella-pieno-campo.svg').write_text(svg(porta, luce, stops, tutto_campo=True), encoding='utf-8')
    print('scritti:', OUT / 'marchio-porta-stella.svg', OUT / 'marchio-porta-stella-pieno-campo.svg')
