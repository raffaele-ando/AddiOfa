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


def gauge(im, y0, y1, cx, escludi=0.0, delta=5):
    """bbox del misuratore (traccia+riempimento) nella fascia y0..y1: pixel che si staccano dal fondo.
    Restituisce (xmin, xmax, ytop, ybot) escludendo la fascia centrale |x-cx|<escludi."""
    a = np.asarray(im).astype(int)
    fondo = np.median(a[y0:y1, :, :].reshape(-1, 3), axis=0)
    d = np.abs(a - fondo).max(axis=2)
    m = d > delta
    m[:y0] = False; m[y1:] = False
    if escludi:
        m[:, int(cx - escludi):int(cx + escludi)] = False
    ys, xs = np.where(m)
    return xs.min(), xs.max(), ys.min(), ys.max(), tuple(int(v) for v in fondo)


def arco(im, y0, y1, cx, delta=9):
    """Stima (cx, cy, rx, ry, th) del misuratore: cima dell'arco sulla colonna cx, piede sul lato sinistro."""
    a = np.asarray(im).astype(int)
    fondo = np.array([249, 251, 254])
    d = np.abs(a - fondo).max(axis=2) > delta
    col = d[y0:y1, int(cx) - 5:int(cx) + 6].mean(axis=1) > 0.6
    ys = np.where(col)[0]
    top = y0 + ys[0]
    j = ys[0]
    while j + 1 < len(col) and col[j + 1]: j += 1
    thv = j - ys[0] + 1
    # piede sinistro: componente nella metà sinistra sotto cy_stima
    sub = d[y0:y1, : int(cx)]
    rows = np.where(sub[:, : int(cx * 0.45)].any(axis=1))[0]
    bot = y0 + rows.max()
    xl = np.where(sub[: bot - y0 + 1, :].any(axis=0))[0].min()
    # spessore orizzontale a 6 px sopra il fondo
    rr = np.where(sub[bot - y0 - 6])[0]
    thh = rr.max() - rr.min() + 1
    th = (thv + thh) / 2
    cy = bot - th / 2
    rx = cx - xl - th / 2
    ry = cy - (top + th / 2)
    return dict(cx=cx, cy=round(cy, 1), rx=round(rx, 1), ry=round(ry, 1), th=round(th, 1), top=top, bot=bot, xl=xl, thv=thv, thh=thh)


def _anello(shape, cx, cy, rx, ry, th, halo=0):
    H, W = shape
    Y, X = np.mgrid[0:H, 0:W]
    u = X - cx; v = cy - Y
    f = np.sqrt((u / rx) ** 2 + (v / ry) ** 2) + 1e-9
    g = np.sqrt((u / rx ** 2) ** 2 + (v / ry ** 2) ** 2) / f + 1e-9
    d = (f - 1) / g
    ring = (np.abs(d) <= th / 2 + halo) & (v >= 0)
    for sx in (-1, 1):
        ring |= ((X - (cx + sx * rx)) ** 2 + (Y - cy) ** 2) <= (th / 2 + halo) ** 2
    return ring & (Y <= cy + th / 2 + halo)


def fit_arco(im, y0, y1, cx, init, delta=12, passi=40, fondo=(249, 251, 254)):
    """Affina (cy, rx, ry, th, cx) dell'arco: copertura dell'anello - fuga nell'alone. init = dict."""
    a = np.asarray(im).astype(int)
    sub = a[y0:y1]
    m = np.abs(sub - np.array(fondo)).max(axis=2) > delta
    best = dict(init); best["cx"] = cx
    def punteggio(p):
        r = _anello(m.shape, p["cx"], p["cy"] - y0, p["rx"], p["ry"], p["th"])
        h = _anello(m.shape, p["cx"], p["cy"] - y0, p["rx"], p["ry"], p["th"], halo=p["th"] * 0.6) & ~r
        return (m & r).sum() / max(1, r.sum()) - 0.8 * (m & h).sum() / max(1, h.sum())
    s = punteggio(best)
    for passo in (4, 2, 1, 0.5):
        for _ in range(passi):
            mig = False
            for k in ("cy", "rx", "ry", "th", "cx"):
                for dl in (-passo, passo):
                    p = dict(best); p[k] += dl
                    if p["th"] < 6 or p["rx"] < 30 or p["ry"] < 30: continue
                    q = punteggio(p)
                    if q > s + 1e-6: best, s, mig = p, q, True
            if not mig: break
    return {k: round(float(v), 1) for k, v in best.items()}, round(float(s), 3)


def fit_arco_grid(im, y0, y1, cx, cy_r, rx_r, ry_r, th_r=(18, 22, 26, 30, 34), delta=12):
    """Ricerca a griglia + affinamento. *_r = (min, max, passo)."""
    a = np.asarray(im).astype(int)
    m = np.abs(a[y0:y1] - np.array((249, 251, 254))).max(axis=2) > delta
    best, bs = None, -9
    for cy in np.arange(*cy_r[:2], cy_r[2]):
        for rx in np.arange(*rx_r[:2], rx_r[2]):
            for ry in np.arange(*ry_r[:2], ry_r[2]):
                for th in th_r:
                    r = _anello(m.shape, cx, cy - y0, rx, ry, th)
                    h = _anello(m.shape, cx, cy - y0, rx, ry, th, halo=th * 0.6) & ~r
                    q = (m & r).sum() / max(1, r.sum()) - 0.8 * (m & h).sum() / max(1, h.sum())
                    if q > bs: bs, best = q, dict(cx=cx, cy=float(cy), rx=float(rx), ry=float(ry), th=float(th))
    return fit_arco(im, y0, y1, cx, best, delta)


def componenti(im, y0, y1, x0, x1, tipo="sat", minarea=8, dil=1):
    """Componenti connesse (bbox x0,x1,y0,y1 + colore medio) di pixel saturi ('sat'), rossi ('rosso'), blu ('blu'),
    scuri ('scuro': lum<110) o non-fondo ('ink': scostamento > 14 dal fondo bianco) nella finestra."""
    from scipy import ndimage as ndi
    a = np.asarray(im).astype(int)[y0:y1, x0:x1]
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(axis=2); mn = a.min(axis=2)
    if tipo == "sat": m = (mx - mn) > 55
    elif tipo == "rosso": m = (R - B > 60) & (R > 180)
    elif tipo == "blu": m = (B - R > 70)
    elif tipo == "scuro": m = a.mean(axis=2) < 110
    elif tipo == "ink": m = np.abs(a - np.array([249, 251, 254])).max(axis=2) > 14
    else: raise ValueError(tipo)
    md = ndi.binary_dilation(m, iterations=dil) if dil else m
    lab, nl = ndi.label(md)
    out = []
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        mm = (lab[sl] == i) & m[sl]
        if mm.sum() < minarea: continue
        ys, xs = sl
        col = a[sl][mm].mean(axis=0)
        out.append((x0 + xs.start, x0 + xs.stop, y0 + ys.start, y0 + ys.stop, "#%02X%02X%02X" % tuple(int(v) for v in col)))
    return sorted(out, key=lambda b: (round(b[2] / 6), b[0]))
