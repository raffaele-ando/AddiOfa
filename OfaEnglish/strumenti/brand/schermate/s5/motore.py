"""
Motore parametrico della sequenza "Calcoliamo il tuo risultato" (immagini 9, 10, 29, 42, 43 di design-concept).

Una schermata = un dizionario `sp` (stringhe, colori del misuratore, corpo) + le MISURE prese dal ritaglio originale:
`Mis` legge il PNG del ritaglio e restituisce i riquadri d'inchiostro delle righe di testo in una fascia (y0..y1),
l'arco del misuratore (adattamento a griglia di un anello a mezza ellisse) e i bordi della scheda del telefono.
Le misure si mettono in cache in `misure.json`: dopo la prima volta il generatore non rilegge i PNG.
Il disegno è tutto vettoriale (testo = tracciati Inter, forme con id parlanti); i testi illeggibili sono ricostruiti
(vedi rapporto). Tutte le coordinate qui sono PIXEL dell'originale; `t.p()` li converte in punti telefono (390 di larghezza).

Errori degli originali corretti: testo AI storto, avanzamento "10/10" con barra a metà in alcune schermate (qui sempre
piena), icone illeggibili (rifatte), pomello e arco non allineati, bordi sfocati; i colori sono campionati.
"""
from __future__ import annotations

import json
import math
import pathlib
import sys

import numpy as np

QUI_S5 = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI_S5))
sys.path.insert(0, str(QUI_S5.parent))
from extra import *                       # noqa: F401,F403,E402
from extra import testo_box, misuratore_arco, tessera_icona, spunta_cerchio, cerchio_vuoto, spinner, tondo_rosso, Tela, n, KIT  # noqa: E402,F401
from ui import RADICE                     # noqa: E402
import misura as _m                       # noqa: E402

CACHE = QUI_S5 / "misure.json"
NAVY = "#0C1446"
SOTTO = "#4B5F91"
ETICHETTA = "#3C4F82"
ROSA = "#FDEBEC"
ROSSO_AZ = "#F22B36"
BLU_TXT = "#14246A"

_cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}


def salva_cache():
    CACHE.write_text(json.dumps(_cache, indent=0, sort_keys=True))


class Mis:
    def __init__(self, nn: int, k: int):
        self.nn, self.k = nn, k
        self.im = _m.carica(f"{nn:02d}", k)
        self.W, self.H = self.im.size

    def _ch(self, chiave, f):
        c = f"{self.nn}.{self.k}:{chiave}"
        if c not in _cache:
            _cache[c] = f()
            salva_cache()
        return _cache[c]

    def righe(self, y0, y1, x0=0, x1=None, soglia=150, gap=12, minh=3):
        """Segmenti d'inchiostro (x0, x1, y0, y1) in ordine di lettura nella fascia."""
        x1 = x1 or self.W
        def f():
            segs = _m.segmenti(self.im, soglia, gap, (y0, y1), (x0, x1))
            return [[s[2], s[3] + 1, s[0], s[1] + 1] for s in segs if s[1] - s[0] + 1 >= minh]
        r = self._ch(f"r{y0},{y1},{x0},{x1},{soglia},{gap}", f)
        return [tuple(v) for v in sorted(r, key=lambda b: (round(b[2] / 6), b[0]))]

    def arco(self, y0, y1, cx, cy_r, rx_r, ry_r, th_r=(20, 24, 28, 32)):
        def f():
            p, s = _m.fit_arco_grid(self.im, y0, y1, cx, cy_r, rx_r, ry_r, th_r)
            p["score"] = s
            return p
        return self._ch(f"a{y0},{y1},{cx},{cy_r},{rx_r},{ry_r}", f)

    def scheda(self):
        """(xl, xr, yt, yb, fondo, striscia): bordi della scheda bianca (strisce azzurre ai lati ai bordi)."""
        def f():
            a = np.asarray(self.im).astype(int)
            W, H = self.W, self.H
            def bianco(p): return p[0] >= 246 and p[2] >= 250
            y = 150
            xl = 0
            while xl < W // 3 and not bianco(a[y, xl]): xl += 1
            xr = W
            while xr > 2 * W // 3 and not bianco(a[y, xr - 1]): xr -= 1
            yt = 0
            while yt < 30 and not bianco(a[yt, W // 2]): yt += 1
            yb = H
            while yb > H - 40 and not bianco(a[yb - 1, W // 2]) and a[yb - 1, W // 2][0] > 215: yb -= 1
            fondo = np.median(a[100:250, xl + 3:xl + 8].reshape(-1, 3), axis=0) if xl + 8 < W else np.array([250, 252, 254])
            if xl == 0: fondo = np.median(a[100:250, 4:9].reshape(-1, 3), axis=0)
            strisc = a[40, 0] if xl else np.array([232, 243, 253])
            return [int(xl), int(xr), int(yt), int(yb), "#%02X%02X%02X" % tuple(int(v) for v in fondo), "#%02X%02X%02X" % tuple(int(v) for v in strisc)]
        return self._ch("scheda", f)


def lum(c: str) -> float:
    return sum(int(c[i:i + 2], 16) for i in (1, 3, 5)) / 3


# ---------------------------------------------------------------------------- pezzi comuni
def cornice(t: Tela, sp: dict, mis: Mis):
    P = t.p
    xl, xr, yt, yb, fondo, strisc = mis.scheda()
    sp["card_fondo"] = fondo
    t.rett(0, 0, t.w, t.h, 0, fill=strisc, id="sfondo-pagina")
    r = 15
    x0 = P(xl if xl > 0 else -30); x1 = P(xr if xr < mis.W else mis.W + 30)
    y0 = P(yt); y1 = P(sp.get("H", mis.H) + 40)
    t.rett(x0, y0, x1 - x0, y1 - y0, P(r), fill=fondo, id="scheda-telefono")


def barra_stato(t: Tela, mis: Mis):
    P = t.p
    segs = mis.righe(0, 40, soglia=140, gap=14)
    segs = [s for s in segs if s[3] - s[2] < 20]
    segs.sort(key=lambda s: s[0])
    ora, ic = segs[0], segs[-1]
    with t.gruppo("barra-di-stato"):
        testo_box(t, "9:41", P(ora[0]), P(ora[1]), P(ora[2] + 0.5), P(ora[3] - 0.5), 700, "#0A0A0F", id="ora")
        cx0, cx1, cy0, cy1 = P(ic[0]), P(ic[1]), P(ic[2]), P(ic[3])
        W = cx1 - cx0; h = cy1 - cy0
        for i, f in enumerate((0.40, 0.58, 0.78, 1.0)):
            t.rett(cx0 + i * W * 0.068, cy1 - h * f, W * 0.05, h * f, W * 0.015, fill="#0A0A0F")
        t.icona("wifi", cx0 + W * 0.36, cy1 - h * 1.06, h * 1.05, "#0A0A0F", 2.4)
        t.rett(cx0 + W * 0.66, cy1 - h * 0.92, W * 0.34, h * 0.92, h * 0.28, fill="#0A0A0F")


def intestazione(t: Tela, mis: Mis):
    """Indietro + 10/10 + barra di avanzamento piena (corretto: alcune schermate AI l'hanno a metà)."""
    P = t.p
    segs = mis.righe(40, 100, soglia=205, gap=10)
    barra = max(segs, key=lambda s: s[1] - s[0])
    ind = min([s for s in segs if s is not barra], key=lambda s: s[0])
    passo = [s for s in segs if s is not barra and s is not ind and s[1] - s[0] > 20][0]
    with t.gruppo("intestazione"):
        cx, cy, hh = (ind[0] + ind[1]) / 2, (ind[2] + ind[3]) / 2, (ind[3] - ind[2]) * 0.8
        t.path(f"M{n(P(cx) + P(hh) * 0.28)} {n(P(cy) - P(hh) * 0.5)}L{n(P(cx) - P(hh) * 0.22)} {n(P(cy))}L{n(P(cx) + P(hh) * 0.28)} {n(P(cy) + P(hh) * 0.5)}",
               stroke="#101A4A", sw=P(2.1), id="indietro")
        testo_box(t, "10/10", P(passo[0]), P(passo[1]), P(passo[2] + 1), P(passo[3] - 1), 500, "#4B5F91", id="passo")
        by = (barra[2] + barra[3]) / 2; bh = max(3.2, (barra[3] - barra[2]) - 1.2)
        t.rett(P(barra[0] + 0.5), P(by - bh / 2), P(barra[1] - barra[0] - 1), P(bh), P(bh / 2), fill=t.sfumatura(["#5B9BFB", "#2F73F2"], 0, 0, 1, 0),
               id="barra-avanzamento", filtro=t.ombra(1, P(3), "#2F73F2", 0.22))


def testi(t: Tela, mis: Mis, stringhe, y0, y1, *, x0=0, x1=None, peso=400, colore=SOTTO, soglia=150, gap=14, ancora="start", id="testo", max_h=40):
    """Scrive le stringhe nei riquadri d'inchiostro trovati (in ordine) nella fascia."""
    P = t.p
    bande = [b for b in mis.righe(y0, y1, x0, x1, soglia, gap) if b[3] - b[2] <= max_h]
    if len(bande) != len(stringhe):
        print(f"  ! {id} {mis.nn}.{mis.k}: {len(bande)} bande per {len(stringhe)} stringhe {stringhe} fascia {y0}-{y1} {bande}")
    for i, (s, b) in enumerate(zip(stringhe, bande)):
        testo_box(t, s, P(b[0]), P(b[1]), P(b[2] + 0.6), P(b[3] - 0.6), peso, colore, ancora, id=f"{id}-{i + 1}" if len(stringhe) > 1 else id)
    return bande


def barra_px(t: Tela, x0, x1, y, h, fr, col, track="#E8EDF6", id=None):
    P = t.p
    t.rett(P(x0), P(y - h / 2), P(x1 - x0), P(h), P(h / 2), fill=track, id=f"{id}-vuota" if id else None)
    if fr > 0:
        w = max(h, (x1 - x0) * fr)
        t.rett(P(x0), P(y - h / 2), P(w), P(h), P(h / 2), fill=t.sfumatura(list(col), 0, 0, 1, 0), id=id)


def scheda(t: Tela, x0, y0, x1, y1, r=14, fill="#F2F6FC", id="scheda", bordo=None, ombra=False):
    P = t.p
    t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P(r), fill=fill, id=id, stroke=bordo, sw=P(0.8) if bordo else 1,
           filtro=t.ombra(2, P(8), "#3B5BA8", 0.07) if ombra else None)


def disegna_base(sp: dict, mis: Mis) -> Tela:
    """Cornice, stato, intestazione, titolo, sottotitolo, misuratore, percentuale, didascalia."""
    t = Tela.da_originale(mis.W, sp.get("H", mis.H), fondo=None, id=sp["id"])
    P = t.p
    cornice(t, sp, mis)
    barra_stato(t, mis)
    intestazione(t, mis)
    sogl_t = sp.get("soglia_titolo", 120)
    nt, ns = len(sp["titolo"]), len(sp["sotto"])
    ytop = sp.get("y_testa", 100)
    bande = [b for b in mis.righe(ytop, sp["y_gauge0"], soglia=sogl_t, gap=40)]
    bt = [b for b in bande[:nt]]
    for i, (s, b) in enumerate(zip(sp["titolo"], bt)):
        testo_box(t, s, P(b[0]), P(b[1]), P(b[2] + 0.5), P(b[3] - 0.5), 700, NAVY, id=f"titolo-{i + 1}" if nt > 1 else "titolo")
    sb = mis.righe(bt[-1][3] + 4, sp["y_gauge0"], soglia=sp.get("soglia_sotto", 165), gap=40)
    for i, (s, b) in enumerate(zip(sp["sotto"], sb)):
        testo_box(t, s, P(b[0]), P(b[1]), P(b[2] + 0.6), P(b[3] - 0.6), 400, SOTTO, id=f"sottotitolo-{i + 1}" if ns > 1 else "sottotitolo")
    if len(sb) < ns: print("  ! sottotitolo: bande", len(sb), "per", ns, sp["id"])
    # percentuale e didascalia
    py0, py1 = sp["pct_y"]
    pb = mis.righe(py0, py1, soglia=sp.get("soglia_pct", 150), gap=40)
    pb = max(pb, key=lambda b: b[3] - b[2])
    cx = (pb[0] + pb[1]) / 2
    g = sp["gauge"]
    a = mis.arco(sp["y_gauge0"], py1, round(cx), g["cy_r"], g["rx_r"], g["ry_r"], g.get("th_r", (20, 24, 28, 32)))
    if "arco" in sp: a.update(sp["arco"])
    with t.gruppo("misuratore-con-valore"):
        misuratore_arco(t, P(a["cx"]), P(a["cy"]), P(a["rx"]), P(a["ry"]), P(a["th"]), g["v"], g["stops"],
                        colore_pomello=g.get("pomello"), tacche=g.get("tacche"), scia=g.get("scia", False), glow=g.get("glow", 0.42),
                        luce=g.get("luce", 0.22), anello=g.get("anello", True), traccia=g.get("traccia", ("#EEF2F9", "#E6EBF5")),
                        pomello_r=P(a["th"] * g.get("pr", 0.5)), id="misuratore")
    testo_box(t, sp["pct"], P(pb[0]), P(pb[1]), P(pb[2] + 0.5), P(pb[3] - 0.5), 800, sp["pct_col"], id="percentuale")
    sp["_arco"] = a
    sp["_pct_box"] = pb
    if sp.get("did"):
        dy0, dy1 = sp["did_y"]
        testi(t, mis, sp["did"], dy0, dy1, peso=sp.get("did_peso", 600), colore=sp["did_col"], soglia=sp.get("soglia_did", 150), gap=40, id="didascalia")
    return t


def comp(mis: Mis, y0, y1, x0, x1, tipo="sat", minarea=8, dil=1):
    c = mis._ch(f"c{y0},{y1},{x0},{x1},{tipo},{minarea},{dil}", lambda: [list(b) for b in _m.componenti(mis.im, y0, y1, x0, x1, tipo, minarea, dil)])
    return [tuple(b) for b in c]


def corsa_colonna(mis: Mis, x, y0=0, y1=None, soglia=4):
    """Tratti verticali dove la colonna x devia dal fondo della pagina (R scende di >= soglia): [(ya, yb, colore)]."""
    a = np.asarray(mis.im).astype(int)
    y1 = y1 or mis.H
    col = a[y0:y1, x, :]
    fondo = int(np.median(a[y0:y1, x, 0]))
    m = (np.abs(col[:, 0] - 249) >= soglia) | (np.abs(col[:, 2] - 254) >= soglia + 2)
    out = []; i = 0
    while i < len(m):
        if m[i]:
            j = i
            while j + 1 < len(m) and (m[j + 1] or (j + 3 < len(m) and m[j + 3])): j += 1
            if j - i >= 3: out.append((y0 + i, y0 + j, "#%02X%02X%02X" % tuple(int(v) for v in col[i:j + 1].mean(0))))
            i = j + 1
        else: i += 1
    return out


def corsa_riga(mis: Mis, y, x0=0, x1=None, soglia=4):
    a = np.asarray(mis.im).astype(int)
    x1 = x1 or mis.W
    row = a[y, x0:x1, :]
    m = (np.abs(row[:, 0] - 249) >= soglia) | (np.abs(row[:, 2] - 254) >= soglia + 2)
    out = []; i = 0
    while i < len(m):
        if m[i]:
            j = i
            while j + 1 < len(m) and (m[j + 1] or (j + 3 < len(m) and m[j + 3])): j += 1
            if j - i >= 3: out.append((x0 + i, x0 + j, "#%02X%02X%02X" % tuple(int(v) for v in row[i:j + 1].mean(0))))
            i = j + 1
        else: i += 1
    return out


def barra_misura(mis: Mis, y, x0, x1=None):
    """Su una riga y (media di 3 righe): (x_inizio, x_fine_riempimento, x_fine_traccia). Il riempimento è saturo,
    la traccia è l'azzurro grigio pallido (#E6EDF8 circa)."""
    a = np.asarray(mis.im).astype(int)
    x1 = x1 or mis.W
    row = a[y - 1:y + 2, :, :].mean(axis=0)
    sat = (row.max(axis=1) - row.min(axis=1)) > 45
    xs = x0
    while xs < x1 and not sat[xs]: xs += 1
    xf = xs
    while xf < x1 and sat[xf]: xf += 1
    xt = xf
    while xt < x1 and (row[xt, 0] > 215 and row[xt, 0] < 243 and row[xt, 2] > 244): xt += 1
    return xs, xf, xt
