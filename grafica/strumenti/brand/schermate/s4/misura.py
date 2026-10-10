"""Strumento di misura (s4): bande di inchiostro di un ritaglio.  python3 misura.py <png> [soglia=170] [x0 x1 y0 y1]
Stampa, per ogni banda di righe con inchiostro scuro, il riquadro (x0,x1,y0,y1) e, dentro la banda, i gruppi di colonne
separati da vuoti >= 6 px (per distinguere icona / testo / valore)."""
import sys
import numpy as np
from PIL import Image

def bande(arr, soglia=170, gap_r=1, gap_c=6, regione=None):
    g = arr.convert("L") if hasattr(arr, "convert") else arr
    a = np.asarray(g).astype(int)
    X0, X1, Y0, Y1 = regione or (0, a.shape[1], 0, a.shape[0])
    m = a[Y0:Y1, X0:X1] < soglia
    righe = np.nonzero(m.any(axis=1))[0]
    out = []
    if not len(righe):
        return out
    s = righe[0]; p = righe[0]
    gr = []
    for r in righe[1:]:
        if r - p > gap_r + 1:
            gr.append((s, p)); s = r
        p = r
    gr.append((s, p))
    for ya, yb in gr:
        sub = m[ya:yb + 1]
        cols = np.nonzero(sub.any(axis=0))[0]
        gruppi = []; cs = cols[0]; cp = cols[0]
        for c in cols[1:]:
            if c - cp > gap_c:
                gruppi.append((cs + X0, cp + X0)); cs = c
            cp = c
        gruppi.append((cs + X0, cp + X0))
        out.append(((gruppi[0][0], gruppi[-1][1], ya + Y0, yb + Y0), gruppi))
    return out

if __name__ == "__main__":
    im = Image.open(sys.argv[1]).convert("L")
    soglia = int(sys.argv[2]) if len(sys.argv) > 2 else 170
    reg = tuple(int(v) for v in sys.argv[3:7]) if len(sys.argv) >= 7 else None
    for box, gr in bande(im, soglia, regione=reg):
        print(box, "h=%d" % (box[3] - box[2] + 1), gr if len(gr) > 1 else "")
