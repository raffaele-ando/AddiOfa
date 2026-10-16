#!/usr/bin/env python3
"""Ritaglia dai concept le due scene dell'hero della landing e le ripulisce dalle scritte che non si possono usare.
Scena del concept 41 (lastra blu con la porta di luce, scalinata, cielo, carte di vetro).
Produce due file: `scena-chiara` (il ritaglio ripulito) e `scena-scura` (la stessa scena di notte: cielo e muri blu notte, lastra blu, la porta
di luce che resta calda e luminosa; canale alfa che sfuma a sinistra, in alto e in basso, così sul fondo scuro della pagina non si vedono bordi).
Aggiunge lo studente di spalle (ritagliato dal concept 51 con GrabCut) sull'ultimo gradino, davanti alla porta di luce.
Cancella con l'inpainting l'insegna «Politecnico di Milano», la carta «82 %» e il contenuto delle due carte di vetro che il prodotto non ha più
(quiz con bandiera, «Piano di studi bloccato»): restano due pannelli di vetro vuoti, e le carte vere (componenti, `brand/hero/Scena.tsx`)
vi si appoggiano sopra, un po' più grandi, per coprire le sfumature del ripristino. I testi stanno nel codice. (Il concept 51, scuro, ha la scritta
scolpita sul monolite: l'inpainting lascia macchie visibili, per questo non si usa.)
Uso (da grafica/): python3 strumenti/brand/estrai_hero.py   -> grafica/brand/hero/scena-chiara.{png,webp} e scena-scura.{png,webp}"""
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


def _sm(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# Rampa luminosità -> blu notte, per le parti fredde (cielo, muri, gradini, vetro)
RAMPA = [(0.0, (3, 6, 18)), (0.25, (6, 13, 42)), (0.5, (12, 27, 78)), (0.75, (24, 50, 116)), (1.0, (52, 86, 160))]
PORTA = (497, 235)          # centro della porta di luce nel ritaglio 976 x 490


def notte(rgb: np.ndarray) -> np.ndarray:
    """Immagine chiara (uint8 RGB) -> RGBA di notte: luminosità rimappata sulla rampa blu, blu saturi (lastra) quasi invariati,
    luce calda e porta di luce conservate, scie di luce (bianco più chiaro dell'intorno) riaccese, alfa sfumato ai bordi."""
    a = rgb.astype(np.float64) / 255
    h, w = a.shape[:2]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    mx, mn = a.max(2), a.min(2)
    s = (mx - mn) / np.maximum(mx, 1e-4)
    t = np.clip((y - 0.05) / 0.95, 0, 1) ** 1.35
    freddo = np.stack([np.interp(t, [p for p, _ in RAMPA], [c[k] for _, c in RAMPA]) for k in range(3)], -1) / 255
    wsat = _sm(s, 0.38, 0.62) * (1 - _sm(y, 0.62, 0.85))
    base = freddo * (1 - wsat[..., None]) + np.clip(a * 0.95 + 0.02, 0, 1) * wsat[..., None]
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - PORTA[0]) / 115) ** 2 + ((yy - PORTA[1]) / 150) ** 2)
    wl = np.clip(np.maximum(1 - _sm(d, 0.55, 1.5), _sm(r - b, 0.03, 0.16) * _sm(d, 0, 3) * 0.9), 0, 1)
    wl = cv2.GaussianBlur(wl.astype(np.float32), (0, 0), 6).astype(np.float64)
    luce = np.clip(a * np.array([1.0, 0.97, 0.88]), 0, 1)
    out = base * (1 - wl[..., None]) + luce * wl[..., None]
    # scie e riflessi: ciò che è molto più chiaro dell'intorno e quasi bianco resta una linea di luce
    # (cappello a cilindro bianco: tiene solo strutture più sottili di ~9 px, non i bordi tra cielo e lastra, che sennò si illuminano)
    y8 = (y * 255).astype(np.uint8)
    cil = (y8.astype(np.float64) - cv2.morphologyEx(y8, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))) / 255
    hl = _sm(cil, 0.06, 0.16) * _sm(y, 0.8, 0.95) * (1 - wl)
    for x0, y0, x1, y1 in [(686, 36, 812, 196), (756, 268, 914, 424)]:   # le due carte di vetro: le scritte non devono accendersi
        hl[y0:y1, x0:x1] = 0
    hl = cv2.GaussianBlur(hl.astype(np.float32), (0, 0), 0.8).astype(np.float64)
    out = out * (1 - 0.9 * hl[..., None]) + np.array([190, 215, 255]) / 255 * 0.9 * hl[..., None]
    x = np.arange(w)[None, :] / w
    yv = np.arange(h)[:, None] / h
    alfa = _sm(x, 0.0, 0.48) * _sm(yv, 0.0, 0.17) * (1 - _sm(yv, 0.78, 1.0))
    return (np.dstack([np.clip(out, 0, 1), alfa]) * 255 + 0.5).astype(np.uint8)


def studente(altezza=150):
    """Lo studente di spalle del concept 51 (controluce davanti alla porta di luce), ritagliato con GrabCut a partire da un poligono
    approssimato e rimpicciolito a `altezza` px. Restituisce (RGBA uint8, ascissa del centro dei piedi nel ritaglio)."""
    c51 = np.array(Image.open(SRC / 'file_00000000fe4482108b4c6e950fe1b4ca.png').convert('RGB'))
    x0, y0, x1, y1 = 790, 250, 890, 470
    roi = c51[y0:y1, x0:x1]
    S = 4
    h, w = roi.shape[:2]
    big = cv2.resize(roi, (w * S, h * S), interpolation=cv2.INTER_CUBIC)
    mask = np.full(big.shape[:2], cv2.GC_BGD, np.uint8)
    esterno = np.array([(42, 16), (62, 16), (66, 38), (78, 52), (82, 100), (70, 118), (68, 150), (56, 186), (60, 196), (54, 204), (36, 198), (40, 186), (34, 150), (30, 118), (20, 106), (16, 90), (24, 52), (34, 38)]) * S
    interno = np.array([(46, 22), (58, 22), (62, 44), (72, 60), (72, 100), (62, 116), (60, 150), (52, 184), (42, 184), (38, 150), (34, 118), (24, 98), (26, 56), (36, 44)]) * S
    nucleo = np.array([(46, 60), (60, 60), (60, 110), (40, 110)]) * S
    cv2.fillPoly(mask, [esterno.astype(np.int32)], cv2.GC_PR_BGD)
    cv2.fillPoly(mask, [interno.astype(np.int32)], cv2.GC_PR_FGD)
    cv2.fillPoly(mask, [nucleo.astype(np.int32)], cv2.GC_FGD)
    cv2.grabCut(big, mask, None, np.zeros((1, 65)), np.zeros((1, 65)), 8, cv2.GC_INIT_WITH_MASK)
    m = ((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    ys, xs = np.where(m > 0)
    big, m = big[ys.min():ys.max() + 1, xs.min():xs.max() + 1], m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    k = altezza / big.shape[0]
    pre = (big.astype(np.float32) * (m / 255.0)[..., None])               # premoltiplicato, per non avere frange chiare
    nw, nh = max(1, round(big.shape[1] * k)), altezza
    pre = cv2.resize(pre, (nw, nh), interpolation=cv2.INTER_AREA)
    a = cv2.GaussianBlur(cv2.resize(m.astype(np.float32) / 255, (nw, nh), interpolation=cv2.INTER_AREA), (0, 0), 0.6)
    rgb = np.clip(pre / np.maximum(a[..., None], 1e-3), 0, 255)
    return np.dstack([rgb, a * 255]).astype(np.uint8), nw


def metti_studente(base: Image.Image, scuro: bool, piedi=(486, 352), altezza=150) -> Image.Image:
    """Appoggia lo studente sull'ultimo gradino, davanti alla porta, con una piccola ombra sotto i piedi. In scuro è un po' più cupo."""
    st, nw = studente(altezza)
    img = base.convert('RGBA')
    ombra = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ov = np.zeros((img.size[1], img.size[0]), np.float32)
    cv2.ellipse(ov, (piedi[0] + 4, piedi[1] - 2), (int(nw * 0.55), 5), 0, 0, 360, 1.0, -1)
    ov = cv2.GaussianBlur(ov, (0, 0), 4) * (0.5 if scuro else 0.28)
    ombra = Image.fromarray(np.dstack([np.zeros((*ov.shape, 3), np.uint8), (ov * 255).astype(np.uint8)]), 'RGBA')
    img.alpha_composite(ombra)
    if scuro:
        st = st.copy()
        st[..., :3] = (st[..., :3].astype(np.float32) * 0.82 + np.array([6, 10, 28]) * 0.18).astype(np.uint8)
    img.alpha_composite(Image.fromarray(st, 'RGBA'), (piedi[0] - nw // 2, piedi[1] - altezza))
    return img


def main():
    # concept 41, in coordinate dell'originale 1536x1024
    c41 = Image.open(SRC / 'file_00000000c23c82108838e288ab528e67.png').convert('RGB')
    # insegna «Politecnico di Milano» sull'edificio a destra e carta «82 %» a sinistra (la carta vera, con il valore d'esempio, si mette in codice)
    c41 = inpaint(c41, [(1395, 185, 1515, 265)], 9)
    a = np.array(c41)
    m = np.zeros(a.shape[:2], np.uint8)
    cv2.rectangle(m, (560 + 116, 70 + 56), (560 + 298, 70 + 238), 255, -1)
    c41 = Image.fromarray(cv2.inpaint(a, m, 12, cv2.INPAINT_NS))
    # contenuto delle due carte di vetro del concept (quiz con bandiera; «Piano di studi bloccato»): poligoni in coordinate dell'originale
    a = np.array(c41)
    m = np.zeros(a.shape[:2], np.uint8)
    cv2.fillPoly(m, [np.array([(1251, 110), (1373, 110), (1373, 266), (1251, 266)]),
                     np.array([(1316, 337), (1475, 337), (1478, 485), (1320, 491)])], 255)
    c41 = Image.fromarray(cv2.inpaint(a, m, 9, cv2.INPAINT_NS))
    # scritte senza senso scritte sul pavimento dall'AI («SAME STUDENTS BRIGHTER…», «SMALL…»): via
    c41 = inpaint(c41, [(560 + 436, 70 + 438, 560 + 582, 70 + 490), (560 + 684, 70 + 452, 560 + 790, 70 + 490)], 7)
    ch = c41.crop((560, 70, 1536, 560))
    scura = Image.fromarray(notte(np.array(ch)), 'RGBA')
    ch = metti_studente(ch, False).convert('RGB')
    scura = metti_studente(scura, True)
    ch.save(OUT / 'scena-chiara.png')
    ch.save(OUT / 'scena-chiara.webp', quality=82, method=6)
    scura.save(OUT / 'scena-scura.png')
    scura.save(OUT / 'scena-scura.webp', quality=80, method=6)
    print(ch.size, (OUT / 'scena-chiara.webp').stat().st_size, (OUT / 'scena-scura.webp').stat().st_size)


if __name__ == '__main__':
    main()
