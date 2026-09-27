"""
Maglia di sfumature (gradient mesh) in SVG semplice, e il suo adattamento a un'immagine.

Una maglia è una griglia di nodi colorati interpolata in modo bilineare. In SVG non esistono le
mesh gradient, ma una riga della griglia si fa con due rettangoli: uno con la sfumatura lineare
della linea di nodi in alto, uno con quella della linea in basso, che entra con una maschera
verticale. In ogni cella il colore è esattamente l'interpolazione dei suoi quattro nodi.
Serve al logo (muro, pavimento, pareti) e alle illustrazioni (ogni parte ha la sua maglia).
"""
from __future__ import annotations

import numpy as np


def esa(c) -> str:
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(v)))) for v in c)


def f(v: float) -> str:
    return f"{v:.2f}".rstrip("0").rstrip(".")


def maglia_svg(id_, m, defs) -> str:
    """Maglia di sfumature (gradient mesh) fatta con SVG semplice: una griglia di nodi colorati,
    interpolata in modo bilineare. Ogni riga della griglia è un rettangolo con la sfumatura della
    linea di nodi in alto, più uno con la sfumatura della linea in basso che entra con una maschera
    verticale: in ogni cella il colore è esattamente l'interpolazione dei suoi quattro nodi.
    I colori dei nodi si possono cambiare a mano (o con ricolora_logo.py)."""
    x0, y0, x1, y1 = m["x0"], m["y0"], m["x1"], m["y1"]
    C, Rr = m["colonne"], m["righe"]
    col = m["colori"]
    ys = righe_maglia(m)
    tol = m.get("tolleranza", 2.0)
    for r in range(Rr + 1):
        riga = [col[r * (C + 1) + c] for c in range(C + 1)]
        tenuti = semplifica(riga, tol)
        stop = "".join(f'<stop offset="{f"{c / C:.4f}".rstrip("0").rstrip(".") or "0"}" stop-color="{esa(riga[c])}"/>' for c in tenuti)
        defs.append(f'<linearGradient id="{id_}L{r}" gradientUnits="userSpaceOnUse" x1="{f(x0)}" y1="0" x2="{f(x1)}" y2="0">{stop}</linearGradient>')
    defs.append(f'<linearGradient id="{id_}V" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>')
    righe = []
    for r in range(Rr):
        ya, yb = ys[r], ys[r + 1]
        defs.append(f'<mask id="{id_}M{r}" maskUnits="userSpaceOnUse" x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}">'
                    f'<rect x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}" fill="url(#{id_}V)"/></mask>')
        righe.append(f'<rect x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}" fill="url(#{id_}L{r})"/>'
                     f'<rect x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}" fill="url(#{id_}L{r + 1})" mask="url(#{id_}M{r})"/>')
    # righe su pixel interi e senza antialiasing: nessuna fessura tra una riga e l'altra
    return f'<g id="{id_}" shape-rendering="crispEdges">{"".join(righe)}</g>'


def semplifica(riga, tol) -> list[int]:
    """Fermate da tenere in una linea di nodi: si salta un nodo quando la retta tra i due vicini
    tenuti lo riproduce entro `tol` (su 255). Il risultato cambia di meno di `tol`."""
    tenuti = [0]
    i = 0
    n = len(riga)
    while i < n - 1:
        j = i + 1
        while j + 1 < n:
            ok = True
            for k in range(i + 1, j + 1):
                u = (k - i) / (j + 1 - i)
                if any(abs(riga[i][c] + (riga[j + 1][c] - riga[i][c]) * u - riga[k][c]) > tol for c in range(3)):
                    ok = False; break
            if not ok:
                break
            j += 1
        tenuti.append(j)
        i = j
    return tenuti


def righe_maglia(m) -> list[int]:
    """Bordi delle righe della maglia, su pixel interi."""
    return [int(round(m["y0"] + (m["y1"] - m["y0"]) * r / m["righe"])) for r in range(m["righe"] + 1)]


def adatta_maglia(a, sel, riquadro, colonne, righe, liscio=0.6, passo=1):
    """Colori dei nodi di una maglia bilineare (come la disegna logo.maglia_svg) che riproducono
    i pixel `sel` della reference: minimi quadrati con un po' di levigatezza tra nodi vicini."""
    import scipy.sparse as sp
    from scipy.sparse.linalg import spsolve
    x0, y0, x1, y1 = riquadro
    x0, y0, x1, y1 = float(round(x0)), float(round(y0)), float(round(x1)), float(round(y1))
    bordi = np.array(righe_maglia({"y0": y0, "y1": y1, "righe": righe}), dtype=float)
    ys, xs = np.nonzero(sel)
    k = (ys % passo == 0) & (xs % passo == 0)
    ys, xs = ys[k], xs[k]
    u = np.clip((xs + 0.5 - x0) / (x1 - x0) * colonne, 0, colonne - 1e-9)
    c = np.floor(u).astype(int)
    r = np.clip(np.searchsorted(bordi, ys + 0.5, side="right") - 1, 0, righe - 1)
    fv = np.clip((ys + 0.5 - bordi[r]) / (bordi[r + 1] - bordi[r]), 0, 1)
    fu = u - c
    N = colonne + 1
    idx = lambda rr, cc: rr * N + cc
    rows = np.repeat(np.arange(len(xs)), 4)
    cols = np.stack([idx(r, c), idx(r, c + 1), idx(r + 1, c), idx(r + 1, c + 1)], 1).ravel()
    w = np.stack([(1 - fu) * (1 - fv), fu * (1 - fv), (1 - fu) * fv, fu * fv], 1).ravel()
    n_nodi = (righe + 1) * N
    A = sp.csr_matrix((w, (rows, cols)), shape=(len(xs), n_nodi))
    # levigatezza: differenze tra nodi vicini, pesata per quanti pixel ci sono in media per nodo
    D = []
    for rr in range(righe + 1):
        for cc in range(N):
            if cc + 1 < N: D.append((idx(rr, cc), idx(rr, cc + 1)))
            if rr + 1 <= righe: D.append((idx(rr, cc), idx(rr + 1, cc)))
    D = np.array(D)
    L = sp.csr_matrix((np.concatenate([np.ones(len(D)), -np.ones(len(D))]),
                       (np.concatenate([np.arange(len(D))] * 2), np.concatenate([D[:, 0], D[:, 1]]))), shape=(len(D), n_nodi))
    lam = liscio * max(1.0, len(xs) / n_nodi) ** 0.5
    M = (A.T @ A + lam * (L.T @ L)).tocsc()
    col = a[ys, xs]
    X = np.stack([spsolve(M, A.T @ col[:, ch]) for ch in range(3)], 1)
    err = float(np.abs(A @ X - col).mean())
    return {"x0": x0, "y0": y0, "x1": x1, "y1": y1, "colonne": colonne, "righe": righe,
            "colori": [[round(float(min(255, max(0, v))), 1) for v in x] for x in X]}, err
