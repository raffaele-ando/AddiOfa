"""
Rifinitura "misurata" del logo: invece di cercare a caso, legge la reference e ricava direttamente
le forme e le sfumature, così i bordi restano netti come nell'originale.

  1. contorni: il bordo esterno del taglio e il bordo del vano luminoso vengono ricavati dal
     contorno delle due maschere (una retta per lato, gli spigoli dove le rette si incontrano);
  2. pareti: per ogni parete interna della stella si cerca la direzione e i colori della sfumatura
     lineare che meglio riproduce i suoi pixel (minimi quadrati, 6 fermate);
  3. vano: parete di fondo e pavimento di fondo, ognuno con la sua sfumatura;
  4. luce sul pavimento: la stella proiettata sul pavimento da una luce dietro il muro (prospettiva
     vera: camera, muro, luce); si adattano posizione della luce e della camera alla forma della
     chiazza di luce nella reference.

    python3 strumenti/brand/logo/rifinisci.py
"""
from __future__ import annotations

import json
import math
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

from ottimizza import carica_reference, adatta, iou, arrotonda_numeri, PARAMETRI as P_FILE
from logo import carica, NOMI_FACCE, LATO

import cv2


def contorno(m: np.ndarray) -> np.ndarray:
    cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=len)[:, 0, :].astype(np.float64)
    return c


def retta(punti: np.ndarray):
    """Retta dei minimi quadrati totali: punto medio e direzione."""
    m = punti.mean(axis=0)
    _, _, vt = np.linalg.svd(punti - m)
    return m, vt[0]


def incrocio(r1, r2):
    (p, d), (q, e) = r1, r2
    A = np.array([d, -e]).T
    t = np.linalg.solve(A, q - p)
    return p + t[0] * d


def adatta_poligono(vertici, m, bordi_fissi_y: dict[int, float], margine=60.0, giri=3):
    for _ in range(giri):
        vertici = _adatta_poligono(vertici, m, bordi_fissi_y, margine)
    return vertici


def _adatta_poligono(vertici, m, bordi_fissi_y, margine):
    """Una retta per lato dal contorno della maschera; gli spigoli sono gli incroci delle rette.
    `bordi_fissi_y`: lati orizzontali fissati (i -> y), come la soglia della porta."""
    V = np.array(vertici, dtype=np.float64)
    n = len(V)
    c = contorno(m)
    # ogni punto del contorno va al lato più vicino
    dist = np.full((len(c), n), np.inf)
    for i in range(n):
        a, b = V[i], V[(i + 1) % n]
        ab = b - a
        t = np.clip(((c - a) @ ab) / (ab @ ab), 0, 1)
        proiez = a + t[:, None] * ab
        d = np.linalg.norm(c - proiez, axis=1)
        vicino_spigolo = (np.linalg.norm(c - a, axis=1) < margine) | (np.linalg.norm(c - b, axis=1) < margine)
        d[vicino_spigolo] = np.inf
        dist[:, i] = d
    lato = np.argmin(dist, axis=1)
    rette = []
    for i in range(n):
        if i in bordi_fissi_y:
            rette.append((np.array([0.0, bordi_fissi_y[i]]), np.array([1.0, 0.0])))
            continue
        sel = (lato == i) & (dist[np.arange(len(c)), lato] < 25)
        if sel.sum() < 10:
            a, b = V[i], V[(i + 1) % n]
            rette.append((a, (b - a) / np.linalg.norm(b - a)))
        else:
            rette.append(retta(c[sel]))
    nuovi = [incrocio(rette[i - 1], rette[i]) for i in range(n)]
    return [[round(float(x), 2), round(float(y), 2)] for x, y in nuovi]


def maschera_poligono(pts, lato=LATO):
    img = Image.new("L", (lato, lato), 0)
    ImageDraw.Draw(img).polygon([tuple(p) for p in pts], fill=255)
    return np.asarray(img) > 127


def sfumatura(pos: np.ndarray, col: np.ndarray, fermate=6):
    """La sfumatura lineare (direzione + colori a fermate uguali) più vicina ai pixel dati."""
    migliore = None
    for gradi in range(0, 180, 3):
        d = np.array([math.cos(math.radians(gradi)), math.sin(math.radians(gradi))])
        t = pos @ d
        t0, t1 = np.percentile(t, 0.5), np.percentile(t, 99.5)
        if t1 - t0 < 2:
            continue
        u = np.clip((t - t0) / (t1 - t0), 0, 1) * (fermate - 1)
        B = np.maximum(0, 1 - np.abs(u[:, None] - np.arange(fermate)[None, :]))
        X, *_ = np.linalg.lstsq(B, col, rcond=None)
        err = np.abs(B @ X - col).mean()
        if migliore is None or err < migliore[0]:
            migliore = (err, d, t0, t1, np.clip(X, 0, 255))
    err, d, t0, t1, X = migliore
    c = pos.mean(axis=0)
    # estremi della sfumatura in coordinate immagine
    base = c - (c @ d) * d
    p1, p2 = base + t0 * d, base + t1 * d
    return {"x1": round(float(p1[0]), 1), "y1": round(float(p1[1]), 1), "x2": round(float(p2[0]), 1), "y2": round(float(p2[1]), 1),
            "colori": [[round(float(v), 1) for v in x] for x in X]}, float(err)


def sfumatura2(pos: np.ndarray, col: np.ndarray, fermate=6):
    """Sfumatura bilineare: due sfumature lineari nella stessa direzione, la seconda che entra
    piano piano nella direzione perpendicolare (maschera). Minimi quadrati sui pixel."""
    migliore = None
    for gradi in range(0, 180, 4):
        d = np.array([math.cos(math.radians(gradi)), math.sin(math.radians(gradi))])
        e_ = np.array([-d[1], d[0]])
        t, w = pos @ d, pos @ e_
        t0, t1 = np.percentile(t, 0.5), np.percentile(t, 99.5)
        w0, w1 = np.percentile(w, 0.5), np.percentile(w, 99.5)
        if t1 - t0 < 2 or w1 - w0 < 2:
            continue
        u = np.clip((t - t0) / (t1 - t0), 0, 1) * (fermate - 1)
        ww = np.clip((w - w0) / (w1 - w0), 0, 1)[:, None]
        Bu = np.maximum(0, 1 - np.abs(u[:, None] - np.arange(fermate)[None, :]))
        M = np.concatenate([Bu * (1 - ww), Bu * ww], axis=1)
        # regolarizzazione: fermate vicine con colori vicini (niente colori strani agli estremi,
        # dove i pixel sono pochi)
        lam = math.sqrt(len(pos)) * 0.08
        D = []
        for base in (0, fermate):
            for k in range(fermate - 1):
                r = np.zeros(2 * fermate); r[base + k] = -lam; r[base + k + 1] = lam; D.append(r)
        for k in range(fermate):
            r = np.zeros(2 * fermate); r[k] = -lam * 0.5; r[fermate + k] = lam * 0.5; D.append(r)
        D = np.array(D)
        X, *_ = np.linalg.lstsq(np.concatenate([M, D]), np.concatenate([col, np.zeros((len(D), 3))]), rcond=None)
        err = np.abs(M @ X - col).mean()
        if migliore is None or err < migliore[0]:
            migliore = (err, d, e_, t0, t1, w0, w1, np.clip(X, 0, 255))
    err, d, e_, t0, t1, w0, w1, X = migliore
    p1, p2 = t0 * d, t1 * d
    q1, q2 = w0 * e_, w1 * e_
    tonda = lambda v: round(float(v), 1)
    return {"x1": tonda(p1[0]), "y1": tonda(p1[1]), "x2": tonda(p2[0]), "y2": tonda(p2[1]),
            "colori": [[tonda(v) for v in x] for x in X[:fermate]],
            "colori2": [[tonda(v) for v in x] for x in X[fermate:]],
            "w": {"x1": tonda(q1[0]), "y1": tonda(q1[1]), "x2": tonda(q2[0]), "y2": tonda(q2[1])}}, float(err)


def raggi_spigoli(vertici, m, fissi=(4, 5)):
    """Per ogni spigolo, quanto la maschera "taglia" la punta (lungo la bisettrice) e quindi il
    raggio della smussatura quadratica che la riproduce: la curva passa a r·cos(α/2)/2 dal vertice."""
    V = np.array(vertici, dtype=np.float64)
    n = len(V)
    raggi = []
    dist_dentro = ndi.distance_transform_edt(~m)
    for i in range(n):
        if i in fissi:
            raggi.append(0.0); continue
        p, a, b = V[i], V[i - 1], V[(i + 1) % n]
        da, db = (a - p) / np.linalg.norm(a - p), (b - p) / np.linalg.norm(b - p)
        bis = da + db; bis /= np.linalg.norm(bis)
        coseno = math.cos(math.acos(np.clip(da @ db, -1, 1)) / 2)
        # si cammina lungo la bisettrice, verso l'interno del poligono, fino alla maschera
        # (per gli spigoli rientranti la bisettrice punta fuori dalla maschera: si cammina al contrario)
        # si cammina lungo la bisettrice (verso il lato dell'angolo più stretto) finché si passa
        # dall'altra parte del bordo della maschera
        x0, y0 = int(round(p[0])), int(round(p[1]))
        partenza = bool(m[y0, x0]) if 0 <= x0 < LATO and 0 <= y0 < LATO else False
        taglio = 0.0
        for k in np.arange(0, 90, 0.5):
            q = p + bis * k
            x, y = int(round(q[0])), int(round(q[1]))
            if 0 <= x < LATO and 0 <= y < LATO and bool(m[y, x]) != partenza:
                taglio = k; break
        raggi.append(round(float(2 * taglio / max(0.2, coseno)), 1))
    return raggi


def adatta_maglia(a, sel, riquadro, colonne, righe, liscio=0.6, passo=1):
    """Colori dei nodi di una maglia bilineare (come la disegna logo.maglia_svg) che riproducono
    i pixel `sel` della reference: minimi quadrati con un po' di levigatezza tra nodi vicini."""
    import scipy.sparse as sp
    from scipy.sparse.linalg import spsolve
    from logo import righe_maglia
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


def linea_muro(a, m_piastrella, m_porta):
    """Dove il muro incontra il pavimento, colonna per colonna (salto di luminosità), e la parabola
    che la descrive: da qui orizzonte e curvatura."""
    lum = ndi.gaussian_filter(a.sum(axis=2), 1.2)
    xs, ys = [], []
    porta_x = np.nonzero(m_porta.any(axis=0))[0]
    for x in range(0, LATO, 4):
        col = m_piastrella[:, x]
        if col.sum() < 200 or porta_x.min() - 10 <= x <= porta_x.max() + 10:
            continue
        d = np.diff(lum[845:905, x])
        y = 845 + int(np.argmax(d)) + 1
        if d.max() > 12:
            xs.append(x); ys.append(y)
    c = np.polyfit(xs, ys, 2)
    y = np.poly1d(c)
    return y


def salto(profilo, y0, y1):
    """Riga (tra y0 e y1) dove il profilo cambia di più: un bordo netto."""
    d = np.abs(np.diff(profilo[y0:y1]))
    return y0 + int(np.argmax(d)) + 1


def main():
    im, a, m_piastrella, m_porta = carica_reference()
    P = carica()
    po = P["porta"]
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    # il taglio: la maschera della reference scarta le pareti illuminate di blu (lato sinistro).
    # Il bordo vero è il salto più netto tra muro e parete: spartiacque (watershed) sul gradiente,
    # partendo dal muro lontano dalla stella e dalle zone sicuramente dentro la stella.
    from skimage.filters import sobel
    from skimage.segmentation import watershed
    liscia = ndi.gaussian_filter(a, (1.0, 1.0, 0))
    bordo = sum(sobel(liscia[..., c]) for c in range(3))
    semi = np.zeros(R.shape, np.int32)
    semi[~ndi.binary_dilation(m_porta, iterations=25)] = 1
    semi[ndi.binary_erosion(m_porta, iterations=12)] = 2
    semi[870:] = 1
    m_porta = watershed(bordo, semi) == 2
    m_porta = ndi.binary_fill_holes(ndi.binary_opening(m_porta, np.ones((3, 3))))
    # vano: la luce piena, crema chiaro (le pareti sono più arancio: B molto più basso)
    vano = (R > 238) & (G > 228) & (B > 180)
    vano &= ndi.binary_dilation(m_porta, iterations=2)
    vano[870:] = False
    vano = ndi.binary_opening(vano, np.ones((5, 5)))
    lab, n = ndi.label(vano)
    vano = lab == (1 + int(np.argmax(ndi.sum(vano, lab, range(1, n + 1)))))
    vano = ndi.binary_fill_holes(vano)

    # 1. contorni: esterno (taglio) e interno (vano). La soglia (lato 4) resta orizzontale.
    profilo = a[:, 560:700, 2].mean(axis=1)
    y_soglia_esterna = float(salto(profilo, 845, 875))   # dove il muro poggia sul pavimento
    fondo_vano = float(salto(profilo, 825, 850))          # bordo della soglia, in fondo
    y_pav = float(salto(profilo, 790, 824))               # dove la parete di fondo incontra il suo pavimento
    print("soglia esterna", y_soglia_esterna, "soglia interna", fondo_vano, "pavimento di fondo", y_pav)
    # la porta arriva fino alla linea dove il muro incontra il pavimento (qualche pixel sotto il
    # bordo della soglia): così tra porta e pavimento non resta una striscia di muro
    y_linea = linea_muro(a, m_piastrella, m_porta)
    y_soglia_esterna = float(np.ceil(y_linea(LATO / 2))) + 1
    esterni = adatta_poligono(po["vertici"], m_porta, {4: y_soglia_esterna})
    # la soglia interna è dove finisce il pavimento di fondo: bordo basso del vano sotto gli stipiti
    interni = adatta_poligono(po["fondo"], vano, {4: fondo_vano})
    print("vertici esterni", esterni)
    print("vertici interni", interni)
    po["vertici"], po["fondo"] = esterni, interni
    po["raggi"] = raggi_spigoli(esterni, m_porta)
    # il bordo del vano sulle punte sfuma nel giallo e la maschera lo "mangia": raggio al massimo 25
    po["raggi_fondo"] = [min(25.0, r) for r in raggi_spigoli(interni, vano)]
    print("raggi", po["raggi"], "raggi fondo", po["raggi_fondo"])

    # 2. pareti: sfumatura per ciascuna, dai pixel che stanno nel quadrilatero e non nel vano
    porta_m = m_porta.copy()
    porta_m[int(y_soglia_esterna) + 1:] = False
    fuori_vano = ndi.binary_erosion(porta_m & ~ndi.binary_dilation(vano, iterations=3), iterations=2)
    grad = {}
    tot = 0.0
    for i, nome in enumerate(NOMI_FACCE):
        j = (i + 1) % len(esterni)
        quad = maschera_poligono([esterni[i], esterni[j], interni[j], interni[i]])
        sel = quad & fuori_vano
        if nome == "soglia":
            sel = quad & (np.arange(LATO)[:, None] > fondo_vano + 2) & (np.arange(LATO)[:, None] < y_soglia_esterna - 2)
        ys, xs = np.nonzero(sel)
        if len(xs) < 30:
            continue
        g, e = sfumatura2(np.stack([xs, ys], 1).astype(float), a[ys, xs])
        grad[nome] = g; tot += e
        print(f"parete {nome:18} {len(xs):6d} px  scarto {e:5.2f}")
    po["sfumature"] = grad

    # 3. vano: parete di fondo e pavimento di fondo (sotto la linea dove cambia la luce)
    po["vano_pavimento_y"] = y_pav
    righe = np.arange(LATO)[:, None]
    for nome, sel in (("vano", vano & (righe < y_pav)), ("vano_pavimento", vano & (righe >= y_pav) & (righe < fondo_vano))):
        ys, xs = np.nonzero(ndi.binary_erosion(sel, iterations=2))
        g, e = sfumatura2(np.stack([xs, ys], 1).astype(float), a[ys, xs], fermate=8)
        po["sfumature"][nome] = g
        print(f"{nome:25} {len(xs):6d} px  scarto {e:5.2f}")

    # il vano intero (parete e pavimento di fondo) come maglia: la luce non è uniforme
    ys, xs = np.nonzero(vano)
    riq = (float(xs.min() - 2), float(ys.min() - 2), float(xs.max() + 3), float(fondo_vano + 1))
    # righe più fitte in basso, dove c'è il pavimento di fondo: basta una maglia fitta
    g, e = adatta_maglia(a, ndi.binary_erosion(vano, iterations=1) & (np.arange(LATO)[:, None] < fondo_vano), riq, 30, 60)
    po["vano_maglia"] = g
    print(f"vano: maglia 30x60, scarto {e:5.2f}")

    # le pareti del taglio tutte insieme come maglia (le pieghe tra una parete e l'altra sono
    # morbide nella reference): si escludono il vano e il filo di luce sul bordo
    poli_porta = maschera_poligono(esterni)
    pareti_px = (m_porta | poli_porta) & ~ndi.binary_dilation(vano, iterations=1) & ndi.binary_erosion(m_porta | poli_porta, iterations=3)
    soglia_q = maschera_poligono([esterni[4], esterni[5], interni[5], interni[4]])
    pareti_px &= ~ndi.binary_dilation(soglia_q, iterations=1)
    pareti_px[int(y_soglia_esterna) + 1:] = False
    ys, xs = np.nonzero(soglia_q)
    g, e = adatta_maglia(a, ndi.binary_erosion(soglia_q, iterations=1),
                         (float(xs.min() - 1), float(ys.min() - 1), float(xs.max() + 2), float(ys.max() + 2)), 40, 8, liscio=0.3)
    po["soglia_maglia"] = g
    print(f"soglia: maglia 40x8, scarto {e:5.2f}")
    ys, xs = np.nonzero(m_porta)
    riq = (float(xs.min() - 2), float(ys.min() - 2), float(xs.max() + 3), float(y_soglia_esterna + 1))
    g, e = adatta_maglia(a, pareti_px, riq, 140, 124, liscio=0.3)
    po["pareti_maglia"] = g
    print(f"pareti: maglia 140x124, scarto {e:5.2f}")

    # il filo: sottile e uguale su tutti i lati del taglio
    po["filo"].update({"spessore": 2.4, "opacita": 0.8, "colore": [140, 178, 240], "contorno": True,
                       "lati": {k: 1.0 for k in NOMI_FACCE}})
    P["piastrella"]["bordo"] = {"chiaro": [236, 244, 255], "opacita_chiaro": 0.9, "spessore_chiaro": 2.0,
                                "scuro": [0, 14, 80], "opacita_scuro": 0.6, "spessore_scuro": 5.0}
    po["morbidezza"] = 0.7
    po["smussatura"] = 3.0
    # le macchie di luce sulla porta non servono più: le pareti hanno le loro sfumature
    P["luci"] = [l for l in P.get("luci", []) if l["zona"] != "porta" and min(l["rx"], l["ry"]) >= 90]

    # 4. luce sul pavimento: chiazze annidate (luce debole, media, piena), ognuna col suo contorno
    #    netto ricavato dalla reference e la sua sfumatura bilineare
    pav = m_piastrella.copy(); pav[:int(y_soglia_esterna)] = False
    pav &= ~m_porta
    chiazze = []
    lum = ndi.gaussian_filter((R + G) / 2, 1.5)
    for soglia, sfoc in ((70, 5.0), (85, 4.0), (100, 4.0), (120, 4.0), (145, 3.0), (175, 3.0), (205, 3.0), (230, 3.0)):
        m = ndi.binary_opening(pav & (lum > soglia), np.ones((7, 7)))
        lab, n = ndi.label(m)
        if n == 0:
            continue
        m = lab == (1 + int(np.argmax(ndi.sum(m, lab, range(1, n + 1)))))
        c = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0]
        c = max(c, key=len)
        poli = cv2.approxPolyDP(c, 5.0, True)[:, 0, :].tolist()
        ys, xs = np.nonzero(ndi.binary_erosion(m, iterations=2))
        g, e = sfumatura2(np.stack([xs, ys], 1).astype(float), a[ys, xs], fermate=7)
        if len(xs) < 800:
            continue
        chiazze.append({"vertici": poli, "sfumatura": g, "opacita": 1.0, "sfocatura": sfoc})
        print(f"chiazza R>{soglia}: {len(poli)} vertici, {len(xs)} px, scarto {e:5.2f}")
    P["pavimento"]["chiazze"] = chiazze
    P["pavimento"].pop("proiezione", None)
    # 5. muro e pavimento come maglie di sfumature misurate
    oz = float(P["orizzonte"])
    P["curva"] = {"sx": round(float(y_linea(0)) - oz, 2), "mezzo": round(float(y_linea(LATO / 2)) - oz, 2),
                  "dx": round(float(y_linea(LATO)) - oz, 2)}
    print("linea muro-pavimento", P["curva"])
    Y, X = np.mgrid[0:LATO, 0:LATO]
    sotto = Y >= y_linea(X)
    t = P["piastrella"]
    dentro = ndi.binary_erosion(m_piastrella, iterations=3)
    pav_px = dentro & sotto & (Y > y_soglia_esterna) & ~ndi.binary_dilation(m_porta, iterations=1)
    muro_px = dentro & ~ndi.binary_dilation(sotto, iterations=2) & ~ndi.binary_dilation(m_porta, iterations=3)
    alto_pav = float(np.floor(min(y_linea(0), y_linea(LATO), y_linea(LATO / 2)) - 6))
    g, e = adatta_maglia(a, pav_px, (float(t["x0"]), alto_pav, float(t["x1"]), float(t["y1"])), 72, 28, passo=2)
    P["pavimento"]["maglia"] = g
    print(f"pavimento: maglia 72x28, scarto {e:5.2f}")
    basso_muro = float(np.ceil(max(y_linea(0), y_linea(LATO), y_linea(LATO / 2)) + 6))
    g, e = adatta_maglia(a, muro_px, (float(t["x0"]), float(t["y0"]), float(t["x1"]), basso_muro), 32, 28, passo=2)
    P["muro"]["maglia"] = g
    print(f"muro: maglia 32x28, scarto {e:5.2f}")
    P["luci"] = []

    # i vecchi raggi e il fascio disegnati a mano lasciano il posto alla proiezione
    for rg in P["pavimento"].get("raggi", []):
        rg["opacita"] = 0.0
    P["pavimento"]["fascio"]["opacita"] = 0.0; P["pavimento"]["fascio"]["fine_opacita"] = 0.0
    P["pavimento"]["grana"] = {"frequenza": 0.9, "allunga": 0.4, "opacita": 0.05}
    P["piastrella"]["grana"] = {"frequenza": 1.2, "opacita": 0.08}
    P = rifinisci_bordi(P, a, m_piastrella, m_porta)
    P_FILE.write_text(json.dumps(arrotonda_numeri(P), indent=1))
    print("salvato", P_FILE)


def rifinisci_bordi(P, a, m_piastrella, m_porta, prove=240):
    """I due fili di luce (bordo della piastrella e bordo del taglio) sono sottili: si regolano
    colore, spessore e intensità rendendo il logo intero e guardando solo una striscia attorno ai bordi."""
    import copy, random
    from render import Renderer
    from logo import svg
    fascia = lambda m: ndi.binary_dilation(m, iterations=5) & ~ndi.binary_erosion(m, iterations=6)
    bande = fascia(m_piastrella) | fascia(m_porta)
    bande[int(P["porta"]["vertici"][4][1]) - 4:, :] &= fascia(m_piastrella)[int(P["porta"]["vertici"][4][1]) - 4:, :]
    chiavi = [("piastrella", "bordo", "chiaro", 0), ("piastrella", "bordo", "chiaro", 1), ("piastrella", "bordo", "chiaro", 2),
              ("piastrella", "bordo", "opacita_chiaro"), ("piastrella", "bordo", "spessore_chiaro"),
              ("piastrella", "bordo", "scuro", 0), ("piastrella", "bordo", "scuro", 1), ("piastrella", "bordo", "scuro", 2),
              ("piastrella", "bordo", "opacita_scuro"), ("piastrella", "bordo", "spessore_scuro"),
              ("porta", "filo", "colore", 0), ("porta", "filo", "colore", 1), ("porta", "filo", "colore", 2),
              ("porta", "filo", "opacita"), ("porta", "filo", "spessore")]
    def leggi(Q, k):
        for x in k: Q = Q[x]
        return Q
    def scrivi(Q, k, v):
        for x in k[:-1]: Q = Q[x]
        nome = k[-2] if isinstance(k[-1], int) else k[-1]
        if isinstance(k[-1], int): v = min(255, max(0, v))
        elif nome.startswith("opacita"): v = min(1, max(0, v))
        else: v = min(12, max(0.3, v))
        Q[k[-1]] = v
    passi = {k: (12.0 if isinstance(k[-1], int) else 0.08 if k[-1].startswith("opacita") else 0.5) for k in chiavi}
    rng = random.Random(5)
    with Renderer() as r:
        def errore(Q):
            b = np.asarray(r.svg(svg(Q), LATO, LATO, "#ffffff").convert("RGB")).astype(float)
            return float(np.abs(b - a).mean(axis=2)[bande].mean())
        e = errore(P)
        print(f"bordi: partenza {e:.3f}", flush=True)
        for _ in range(prove):
            k = rng.choice(chiavi)
            Q = copy.deepcopy(P)
            scrivi(Q, k, leggi(Q, k) + rng.gauss(0, passi[k]))
            eq = errore(Q)
            if eq < e:
                P, e = Q, eq; passi[k] *= 1.3
            else:
                passi[k] *= 0.92
        print(f"bordi: fine {e:.3f}", flush=True)
    return P


if __name__ == "__main__":
    main()
