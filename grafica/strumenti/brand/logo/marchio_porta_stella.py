#!/usr/bin/env python3
"""Marchio «porta a stella» di AddiOFA (scelto dall'autore il 24/11/2026), ricavato dal riferimento.

Il disegno non è ricostruito a mano: le forme si tracciano dai pixel del riferimento
grafica/fonti/ai-nuove/logo-porta-stella-ref.webp (1254 px), così il marchio resta uguale.
- riquadro: bordi misurati sul riferimento, portato a quadrato (la tavola di costruzione lo dà 1,00x per lato),
  raggio 0,27 del lato (quello con lo scarto minimo; la tavola dice circa 0,25x);
- porta blu notte: contorno della regione blu notte;
- luce: contorno della regione più chiara del blu, riempita con il profilo di colore misurato al centro;
  nitida dentro la porta, che si dissolve gradualmente nella stessa luce sfumata sotto gli stipiti;
- contorni lisciati con una media mobile: le punte restano tonde come nel riferimento.
Scarto medio con il riferimento: 2,4/255 (misurato con Chromium a 448 px).
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
DISSOLVENZA = (1380, 1560)  # la luce nitida si dissolve in quella sfumata tra queste quote (fine stipiti: 1519)
LISCIO = 5               # finestra (punti) della media mobile sul contorno
SFUMATURA = 60           # deviazione della sfumatura della luce (unità del riquadro da 1792)
BLU = '#0977FD'          # riquadro, misurato
NOTTE = '#011537'        # porta, misurata


def traccia():
    im = cv2.imread(str(RIF))
    b, g, r = [im[:, :, i].astype(int) for i in range(3)]
    ys, xs = np.where((b > 200) & (r < 80))
    crop = im[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    sq = cv2.resize(crop, (N, N), interpolation=cv2.INTER_CUBIC)
    B, G, R = [sq[:, :, i].astype(int) for i in range(3)]

    def contorno(maschera, finestra=LISCIO):
        # contorno completo, poi media mobile circolare dei punti: toglie la scalettatura dei pixel
        # (le punte tornano tonde come nel riferimento), poi un punto ogni 3
        cs, _ = cv2.findContours(maschera.astype(np.uint8) * 255, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        c = max(cs, key=cv2.contourArea)[:, 0, :].astype(float)
        k = np.ones(finestra) / finestra
        meta = finestra // 2
        lisci = np.stack([np.convolve(np.concatenate([c[-meta:, i], c[:, i], c[:meta, i]]), k, 'valid') for i in (0, 1)], 1)
        lisci = lisci[::3]
        return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in lisci) + ' Z'

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
<filter id="sfuma" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="{SFUMATURA}"/></filter>
<linearGradient id="dissolvi" gradientUnits="userSpaceOnUse" x1="0" y1="{DISSOLVENZA[0]}" x2="0" y2="{DISSOLVENZA[1]}"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#000000"/></linearGradient>
<mask id="dentro" maskUnits="userSpaceOnUse" x="0" y="0" width="{N}" height="{N}"><rect width="{N}" height="{N}" fill="url(#dissolvi)"/></mask>
<clipPath id="riquadro"><rect width="{N}" height="{N}" rx="{rx}"/></clipPath>
</defs>
<g transform="translate({m} {m}) scale({s:.6f})" clip-path="url(#riquadro)">
<rect width="{N}" height="{N}" fill="{BLU}"/>
<path d="{luce}" fill="url(#luce)" filter="url(#sfuma)"/>
<path d="{luce}" fill="url(#luce)" mask="url(#dentro)"/>
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
