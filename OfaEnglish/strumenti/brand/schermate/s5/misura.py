"""Misura le bande di testo/inchiostro di un ritaglio (px originali): stampa (y0,y1,x0,x1,colore) per ogni segmento.
   python3 misura.py <NN> <k> [--soglia 175] [--gap 7] [--y y0,y1] [--x x0,x1]"""
import sys, glob, pathlib
import numpy as np
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from ui import RADICE

def carica(nn, k):
    f = glob.glob(str(RADICE / f"brand/concept/{nn}-*/{k:03d}-schermata.png"))[0]
    return Image.open(f).convert("RGB")

def segmenti(im, soglia=175, gap=7, y=None, x=None, minh=2):
    a = np.asarray(im).astype(int)
    lum = a.mean(axis=2)
    H, W = lum.shape
    y0, y1 = y or (0, H); x0, x1 = x or (0, W)
    m = lum < soglia
    m[:y0] = False; m[y1:] = False; m[:, :x0] = False; m[:, x1:] = False
    rows = m.any(axis=1)
    out = []; i = 0
    while i < H:
        if rows[i]:
            j = i
            while j + 1 < H and (rows[j + 1] or (j + 2 < H and rows[j + 2])): j += 1
            band = m[i:j + 1]
            cols = np.where(band.any(axis=0))[0]
            # spezza per vuoti orizzontali > gap
            s = cols[0]; p = cols[0]
            for c in list(cols[1:]) + [None]:
                if c is None or c - p > gap:
                    sub = m[i:j + 1, s:p + 1]
                    ys = np.where(sub.any(axis=1))[0]
                    reg = a[i + ys[0]:i + ys[-1] + 1, s:p + 1].reshape(-1, 3)
                    l = reg.mean(axis=1); d = reg[l <= np.percentile(l, 15)].mean(axis=0)
                    out.append((i + ys[0], i + ys[-1], int(s), int(p), "#%02X%02X%02X" % tuple(int(v) for v in d)))
                    if c is not None: s = c
                if c is not None: p = c
            i = j + 1
        else:
            i += 1
    return out

if __name__ == "__main__":
    a = sys.argv[1:]
    nn, k = a[0], int(a[1])
    opt = lambda n, d: a[a.index(n) + 1] if n in a else d
    y = opt("--y", None); x = opt("--x", None)
    y = tuple(int(v) for v in y.split(",")) if y else None
    x = tuple(int(v) for v in x.split(",")) if x else None
    im = carica(nn, k)
    print(im.size)
    for s in segmenti(im, int(opt("--soglia", 175)), int(opt("--gap", 7)), y, x):
        print("y%4d-%4d  x%4d-%4d  h%3d w%3d  %s" % (s[0], s[1], s[2], s[3], s[1] - s[0] + 1, s[3] - s[2] + 1, s[4]))
