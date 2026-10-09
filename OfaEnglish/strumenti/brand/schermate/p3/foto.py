"""
Prepara le FOTOGRAFIE (restano raster) delle landing 45 e 51: ritaglia dall'immagine sorgente le parti
fotografiche e ne cancella (inpainting) ciò che sulla pagina è testo/interfaccia/telefoni, che viene
ridisegnato in vettoriale; cancella anche il sigillo del Politecnico (non si riproduce).
Uscita: p3/foto/*.jpg (JPEG, max 900 px sul lato lungo). Si lancia da solo.
"""
import pathlib, sys
import cv2, numpy as np
from PIL import Image

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[3]
SORG = RADICE.parent / "design-concept"
FILES = {41: "file_00000000c23c82108838e288ab528e67.png", 45: "file_00000000e55481f4afd0f6b1727320de.png",
         51: "file_00000000fe4482108b4c6e950fe1b4ca.png"}
OUT = QUI / "foto"
OUT.mkdir(exist_ok=True)


def carica(n):
    return np.asarray(Image.open(SORG / FILES[n]).convert("RGB")).copy()


def lum(a):
    return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


class Maschera:
    def __init__(self, img):
        self.img = img
        self.m = np.zeros(img.shape[:2], np.uint8)

    def box(self, x0, y0, x1, y1):
        self.m[y0:y1, x0:x1] = 255

    def cond(self, x0, y0, x1, y1, f, dil=3):
        """pixel del riquadro che soddisfano f(sub-immagine) -> bool, allargati di `dil`."""
        sub = self.img[y0:y1, x0:x1].astype(np.float32)
        c = (f(sub) * 255).astype(np.uint8)
        if dil:
            c = cv2.dilate(c, np.ones((dil * 2 + 1, dil * 2 + 1), np.uint8))
        self.m[y0:y1, x0:x1] |= c

    def cerchio(self, cx, cy, r):
        cv2.circle(self.m, (cx, cy), r, 255, -1)

    def applica(self, raggio=6):
        # inpainting a metà risoluzione per le zone grandi (più morbido), poi un velo di grana come la foto
        out = cv2.inpaint(self.img, self.m, raggio, cv2.INPAINT_TELEA)
        big = cv2.dilate(self.m, np.ones((3, 3), np.uint8))
        ys, xs = np.nonzero(big)
        if len(ys):
            area = (self.m > 0).mean()
            if area > 0.02:
                small = cv2.resize(self.img, None, fx=0.25, fy=0.25, interpolation=cv2.INTER_AREA)
                ms = cv2.resize(self.m, None, fx=0.25, fy=0.25, interpolation=cv2.INTER_NEAREST)
                sm = cv2.inpaint(small, ms, 4, cv2.INPAINT_NS)
                sm = cv2.GaussianBlur(sm, (0, 0), 3)
                grande = cv2.resize(sm, (self.img.shape[1], self.img.shape[0]), interpolation=cv2.INTER_CUBIC)
                mm = cv2.GaussianBlur(self.m, (0, 0), 2)[..., None] / 255.0
                rumore = np.random.default_rng(3).normal(0, 2.2, grande.shape)
                mm = cv2.GaussianBlur(cv2.dilate(self.m, np.ones((9, 9), np.uint8)), (0, 0), 7)[..., None] / 255.0
                piena = np.clip(grande + rumore, 0, 255)
                out = np.where(self.m[..., None] > 0, piena, out)
                out = (out * (1 - mm) + piena * mm).astype(np.uint8) if False else (np.where(self.m[..., None] > 0, piena, self.img * (1 - mm) + piena * mm)).astype(np.uint8)
        return out


def salva(a, nome, box, qualita=88):
    x0, y0, x1, y1 = box
    im = Image.fromarray(a[y0:y1, x0:x1])
    if max(im.size) > 900:
        im.thumbnail((900, 900), Image.LANCZOS)
    im.save(OUT / nome, "JPEG", quality=qualita)
    print(nome, im.size)


def bianco(s):      # testo bianco: tutti i canali alti
    return s.min(axis=2) > 200


def chiaro(s):
    return lum(s) > 120


def scuro(s):
    return lum(s) < 120


def blu_vivo(s):
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    return (b > 170) & (b - r > 90) & (lum(s) < 170)


def testo_scuro_o_blu(s):
    return scuro(s) | blu_vivo(s)


def avatar(a, nome, cx, cy, r):
    salva(a, nome, (cx - r, cy - r, cx + r, cy + r), 90)


def main():
    # ------------------------------------------------------------------ 45
    a = carica(45)
    m = Maschera(a)
    m.box(420, 98, 532, 262)                                 # coda del titolo
    m.box(420, 6, 665, 48)                                   # voci di menu
    m.box(870, 6, 1512, 472)                                # telefoni, bolle, pulsante
    salva(m.applica(), "45-hero.jpg", (420, 0, 1536, 478))
    a = carica(45); m = Maschera(a)
    m.cond(800, 590, 1135, 805, bianco, 6)
    m.box(812, 752, 860, 798)
    salva(m.applica(), "45-futuro.jpg", (780, 566, 1518, 811))
    a = carica(45); m = Maschera(a)
    m.cond(800, 835, 1100, 935, lambda s: s.min(axis=2) > 165, 3)
    m.box(812, 940, 1056, 992)
    m.cond(1410, 890, 1512, 965, lambda s: lum(s) < 165, 4)
    salva(m.applica(), "45-cta.jpg", (780, 824, 1518, 1006))
    a = carica(45)
    for i, (cx, cy) in enumerate([(62, 436), (89, 436), (115, 436), (141, 436)]):
        pass
    # ------------------------------------------------------------------ 51
    a = carica(51); m = Maschera(a)
    m.cond(480, 8, 720, 48, lambda s: lum(s) > 110, 3)       # menu
    m.cond(1262, 4, 1480, 48, lambda s: lum(s) > 120, 4)     # Scarica l'app, IT
    m.cond(480, 100, 570, 345, lambda s: (lum(s) > 100) | blu_vivo(s), 4)    # titolo e sottotitolo
    m.cond(480, 372, 540, 460, lambda s: lum(s) > 110, 3)    # STUDIA PREPARATI...
    m.cond(480, 455, 945, 480, lambda s: lum(s) > 110, 6)    # paginazione
    m.cond(1480, 225, 1520, 365, lambda s: lum(s) > 120, 3)  # SCROLL
    m.cond(1350, 398, 1455, 445, lambda s: lum(s) > 150, 8)  # UN FUTURO PIÙ APERTO
    m.cond(1195, 80, 1360, 205, lambda s: scuro(s) | blu_vivo(s), 5)         # scritta a mano
    m.cerchio(997, 90, 40)                                   # sigillo
    salva(m.applica(), "51-hero.jpg", (480, 0, 1536, 486))
    a = carica(51); m = Maschera(a)
    for b in [(105, 492, 225, 548), (130, 540, 185, 572), (365, 515, 455, 600), (480, 520, 635, 585), (480, 585, 585, 672)]:
        m.cond(*b, lambda s: s.min(axis=2) > 150, 4)
    salva(m.applica(), "51-sinistra.jpg", (0, 488, 640, 742))
    a = carica(51); m = Maschera(a)
    m.cond(1270, 505, 1480, 668, lambda s: scuro(s) | blu_vivo(s), 4)
    salva(m.applica(), "51-destra.jpg", (940, 488, 1536, 742))
    # volti piccoli (fotografie)
    a = carica(45)
    for i, cx in enumerate((62, 89, 115, 141)):
        pass


if __name__ == "__main__":
    main()
