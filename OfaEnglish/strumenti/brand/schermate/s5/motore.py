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
    CACHE.write_text(json.dumps(_cache, indent=0, sort_keys=True, default=lambda o: o.item() if hasattr(o, 'item') else str(o)))


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
            t.rett(cx0 + i * W * 0.075, cy1 - h * f, W * 0.055, h * f, W * 0.016, fill="#0A0A0F")
        t.icona("wifi", cx0 + W * 0.335, cy1 - h * 1.12, W * 0.29, "#0A0A0F", 2.6)
        t.rett(cx0 + W * 0.68, cy1 - h * 0.95, W * 0.29, h * 0.95, h * 0.26, fill="#0A0A0F")
        t.rett(cx0 + W * 0.975, cy1 - h * 0.62, W * 0.03, h * 0.3, W * 0.015, fill="#0A0A0F", opacita=0.5)


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
    a = dict(a); a["th"] = min(30.0, a["th"] + 2.5)
    if "arco" in sp: a.update(sp["arco"])
    with t.gruppo("misuratore-con-valore"):
        misuratore_arco(t, P(a["cx"]), P(a["cy"]), P(a["rx"]), P(a["ry"]), P(a["th"]), g["v"], g["stops"],
                        colore_pomello=g.get("pomello"), tacche=g.get("tacche"), scia=g.get("scia", False), glow=g.get("glow", 0.42),
                        luce=g.get("luce", 0.22), anello=g.get("anello", True), traccia=g.get("traccia", ("#E6EDF7", "#E3EAF5")),
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


# ============================================================================ corpi (parte sotto il misuratore)
CARD_AZ = "#F1F6FC"
CARD_ROSA = "#FEF1F2"


def corpo_passi(t, mis, sp, c):
    """Elenco dei passi (Grammatica…) con spunte. c: card=(x0,y0,x1,y1)|None, stati, cx, r, x_txt, y=(y0,y1), testi"""
    P = t.p
    with t.gruppo("elenco-passi"):
        if c.get("card"): scheda(t, *c["card"], r=15, fill=c.get("card_fill", CARD_AZ), id="scheda-passi")
        if c.get("titolo"):
            testi(t, mis, [c["titolo"]], *c["titolo_y"], x0=c["x_tit"], peso=600, colore=BLU_TXT, soglia=125, id="titolo-passi")
        bande = testi(t, mis, c["testi"], c["y"][0], c["y"][1], x0=c["x_txt"], peso=400, colore=ETICHETTA, soglia=c.get("soglia", 165), gap=30, id="passo-testo")
        for i, (st, b, s) in enumerate(zip(c["stati"], bande, c["testi"])):
            yc = (b[2] + b[3]) / 2 - (1.0 if any(ch in "gjpqy" for ch in s) else 0) + c.get("dy", 0)
            if st == "fatto": spunta_cerchio(t, P(c["cx"]), P(yc), P(c["r"]), "blu", id=f"passo-{i + 1}-fatto")
            elif st == "corso": spinner(t, P(c["cx"]), P(yc), P(c["r"]), id=f"passo-{i + 1}-in-corso")
            else: cerchio_vuoto(t, P(c["cx"]), P(yc), P(c["r"]), id=f"passo-{i + 1}-da-fare")


def lampadina(t, cx, cy, lato):
    with t.gruppo("lampadina"):
        t.cerchio(cx, cy, lato * 0.9, fill=t.radiale([(0, "#FFC247", 0.45), (1, "#FFC247", 0)], 0.5, 0.5, 0.5))
        g = t.sfumatura(["#FFD76A", "#F9A31B"], 0, 0, 0, 1)
        t.path(f"M{n(cx)} {n(cy - lato * 0.46)}a{n(lato * 0.30)} {n(lato * 0.30)} 0 0 0 {n(-lato * 0.19)} {n(lato * 0.56)}"
               f"c{n(lato * 0.07)} {n(lato * 0.07)} {n(lato * 0.10)} {n(lato * 0.15)} {n(lato * 0.10)} {n(lato * 0.26)}h{n(lato * 0.18)}"
               f"c0-{n(lato * 0.11)} {n(lato * 0.03)}-{n(lato * 0.19)} {n(lato * 0.10)}-{n(lato * 0.26)}"
               f"a{n(lato * 0.30)} {n(lato * 0.30)} 0 0 0 {n(-lato * 0.19)} {n(-lato * 0.56)}z", fill=g, stroke="none")
        t.rett(cx - lato * 0.14, cy + lato * 0.38, lato * 0.28, lato * 0.07, lato * 0.035, fill="#E8921A")
        t.rett(cx - lato * 0.10, cy + lato * 0.48, lato * 0.20, lato * 0.07, lato * 0.035, fill="#E8921A")
        for ang in (-150, -110, -70, -30):
            a = math.radians(ang)
            t.linea(cx + lato * 0.46 * math.cos(a), cy - lato * 0.12 + lato * 0.46 * math.sin(a),
                    cx + lato * 0.60 * math.cos(a), cy - lato * 0.12 + lato * 0.60 * math.sin(a), "#F6B73C", max(0.8, lato * 0.045))


def corpo_aree(t, mis, sp, c):
    """Barre per area. c: card, titolo(+_y,x_tit), righe=[dict(icona, cy, nome, pct, frac)], cx, lato, x_nome, x_pct, barra=(x0,x1_traccia), dy_barra"""
    P = t.p
    with t.gruppo("aree-analizzate"):
        scheda(t, *c["card"], r=15, fill=CARD_AZ, id="scheda-aree")
        if c.get("titolo"):
            testi(t, mis, [c["titolo"]], *c["titolo_y"], x0=c["x_tit"], peso=600, colore=BLU_TXT, soglia=125, id="titolo-aree")
        for i, r in enumerate(c["righe"]):
            with t.gruppo(f"area-{i + 1}"):
                tessera_icona(t, r["icona"], P(c["cx"]), P(r["cy"]), P(c["lato"]), "#2F6FF0", 1.9, aa=r.get("aa", False), alone=r.get("alone"))
                y0, y1 = r["nome_y"]
                testi(t, mis, [r["nome"]], y0, y1, x0=c["x_nome"], x1=c["x_pct"] - 4, peso=r.get("peso", 400), colore=ETICHETTA, soglia=125, id="nome")
                bx0, bx1 = c["barra"]
                barra_px(t, bx0, bx1, r["by"], c.get("bh", 8), r["frac"], ("#6AA4FB", "#2F6FF0"), "#E4ECF8", id="barra")
                testi(t, mis, [r["pct"]], r["by"] - 8, r["by"] + 12, x0=c["x_pct"], peso=600, colore=BLU_TXT, soglia=140, id="percentuale-area")


def corpo_fattori(t, mis, sp, c):
    """Fattori considerati. c: titolo(+y), righe=[dict(icona, colore, cy, nome_y, nome, by, frac, col, dx=[(stringa, y0, y1)])], cx, lato, x_nome, barra=(x0,x1), x_dx"""
    P = t.p
    with t.gruppo("fattori-considerati"):
        if c.get("card"): scheda(t, *c["card"], r=15, fill=CARD_AZ, id="scheda-fattori")
        testi(t, mis, [c["titolo"]], *c["titolo_y"], x0=c["x_tit"], peso=700, colore=NAVY, soglia=125, id="titolo-fattori")
        for i, r in enumerate(c["righe"]):
            with t.gruppo(f"fattore-{i + 1}"):
                tessera_icona(t, r["icona"], P(c["cx"]), P(r["cy"]), P(c["lato"]), r["colore"], 1.9, alone=r.get("alone"), aa=r.get("aa", False))
                testi(t, mis, [r["nome"]], *r["nome_y"], x0=c["x_nome"], x1=r.get("x_nome1", c["x_dx"] - 2 if False else None), peso=400, colore=ETICHETTA, soglia=125, id="nome")
                bx0, bx1 = r.get("barra", c["barra"])
                barra_px(t, bx0, bx1, r["by"], c.get("bh", 8), r["frac"], r["col"], "#E7ECF6", id="barra")
                for j, (s, a0, a1, xx0) in enumerate(r["dx"]):
                    testi(t, mis, [s], a0, a1, x0=xx0, peso=400, colore=ETICHETTA, soglia=175, id=f"valore-{j + 1}")
        if c.get("info"):
            inf = c["info"]
            scheda(t, *inf["card"], r=15, fill=CARD_AZ, id="scheda-info")
            lampadina(t, P(inf["cx"]), P(inf["cy"]), P(inf["lato"]))
            testi(t, mis, inf["testi"], *inf["y"], x0=inf["x_txt"], peso=400, colore=ETICHETTA, soglia=150, id="info")


def avviso(t, mis, sp, c):
    P = t.p
    with t.gruppo("avviso-rischio"):
        scheda(t, *c["card"], r=15, fill=c.get("fill", CARD_ROSA), id="avviso-scheda")
        t.cerchio(P(c["cx"]), P(c["cy"]), P(c["r"]), fill=t.sfumatura(["#FF5560", "#EE2233"], 0.2, 0, 0.8, 1), filtro=t.ombra(1.5, P(c["r"]) * 0.6, "#F22B36", 0.3), id="avviso-icona")
        r = P(c["r"]); cx, cy = P(c["cx"]), P(c["cy"])
        t.rett(cx - r * 0.11, cy - r * 0.52, r * 0.22, r * 0.62, r * 0.11, fill="#FFFFFF")
        t.cerchio(cx, cy + r * 0.42, r * 0.13, fill="#FFFFFF")
        testi(t, mis, c["testi"], *c["y"], x0=c["x_txt"], peso=400, colore="#2B3C6E", soglia=150, id="avviso-testo")


def istogramma(t, mis, sp, c):
    """c: card, x0, x1, ybase, alt=[altezze px], sel (indice rosso), tu=(testo), legenda=[(colore, cx, cy, r, testo, y0, y1)], x_leg"""
    P = t.p
    with t.gruppo("istogramma"):
        if c.get("card"): scheda(t, *c["card"], r=15, fill=c.get("fill", CARD_ROSA), id="istogramma-scheda")
        alt, sel = c["alt"], c["sel"]
        nb = len(alt)
        larg = c["larg"]; gap = (c["x1"] - c["x0"] - larg * nb) / (nb - 1)
        for i, h in enumerate(alt):
            x = c["x0"] + i * (larg + gap)
            if i < sel: g = t.sfumatura(["#CFE0FB", "#A6C5F8"], 0, 0, 0, 1)
            elif i == sel: g = t.sfumatura(["#FF4452", "#E81B2B"], 0, 0, 0, 1)
            else: g = t.sfumatura(["#FFB9BE", "#FF9CA4"], 0, 0, 0, 1)
            t.rett(P(x), P(c["ybase"] - h), P(larg), P(h), P(larg * 0.30), fill=g, id=f"barra-{i + 1}",
                   filtro=t.ombra(1.5, P(4), "#E81B2B", 0.22) if i == sel else None)
        xs = c["x0"] + sel * (larg + gap) + larg / 2
        ytop = c["ybase"] - alt[sel]
        w, h = c.get("tag_w", 17), c.get("tag_h", 13)
        with t.gruppo("tag-tu"):
            t.rett(P(xs - w / 2), P(ytop - h - 8), P(w), P(h), P(4), fill="#FFFFFF", filtro=t.ombra(1.5, P(5), "#3B5BA8", 0.18))
            t.path(f"M{n(P(xs - 2.2))} {n(P(ytop - 8))}L{n(P(xs))} {n(P(ytop - 4.8))}L{n(P(xs + 2.2))} {n(P(ytop - 8))}z", fill="#E81B2B")
            t.testo("Tu", P(xs), P(ytop - 8 - h / 2 + h * 0.2), P(h * 0.6), 600, NAVY, "middle")
        with t.gruppo("legenda"):
            for col, cx, cy, r, s, a0, a1 in c["legenda"]:
                t.cerchio(P(cx), P(cy), P(r), fill=col, filtro=t.ombra(1, P(3), col, 0.25))
                testi(t, mis, [s], a0, a1, x0=c["x_leg"], peso=400, colore=ETICHETTA, soglia=150, id="legenda-testo")


def corpo_costi(t, mis, sp, c):
    P = t.p
    with t.gruppo("conseguenze"):
        scheda(t, *c["card"], r=15, fill=CARD_ROSA, id="scheda-conseguenze")
        bande = testi(t, mis, c["testi"], *c["y"], x0=c["x_txt"], peso=400, colore="#2B3C6E", soglia=150, gap=30, id="conseguenza-testo")
        for i, (b, ic) in enumerate(zip(bande, c["icone"])):
            yc = (b[2] + b[3]) / 2 - (1.0 if any(ch in "gjpqy" for ch in c["testi"][i]) else 0)
            tondo_rosso(t, ic, P(c["cx"]), P(yc), P(c["r"]), id=f"conseguenza-{i + 1}-icona")


def pulsanti_fine(t, mis, sp, c):
    """Continua (testo bianco + freccia) e Scopri come migliorare (secondario con libro). Testo e freccia bianchi
    si misurano come 'chiaro' dentro il pulsante."""
    P = t.p
    x0, y0, x1, y1 = c["prim"]
    with t.gruppo("pulsante-continua"):
        t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P((y1 - y0) * 0.22), fill=t.sfumatura(["#FF3B49", "#F2202F"]), id="pulsante-primario",
               filtro=t.ombra(3, P(10), "#F22B36", 0.25))
        seg = [b for b in mis.righe(y0 + 8, y1 - 8, x0 + 20, x1 - 20, -205, 9) if b[3] - b[2] >= 6]
        tx = seg[0]
        testo_box(t, c["t_prim"], P(tx[0]), P(tx[1]), P(tx[2] + 0.4), P(tx[3] - 0.4), 600, "#FFFFFF", id="pulsante-testo")
        if len(seg) > 1:
            fr = seg[-1]
            w = fr[1] - fr[0]
            t.icona("freccia-destra", P(fr[0] - w * 0.12), P((fr[2] + fr[3]) / 2 - w * 0.62), P(w * 1.24), "#FFFFFF", 2.0)
    with t.gruppo("pulsante-scopri"):
        x0, y0, x1, y1 = c["sec"]
        t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P((y1 - y0) * 0.22), fill="#FBFCFF", stroke="#D6DFEE", sw=P(1.2), id="pulsante-secondario")
        b = testi(t, mis, [c["t_sec"]], *c["y_sec"], x0=c["x_ts"], peso=500, colore="#1B2A66", soglia=150, id="pulsante-testo")
        lx, ly, ls = c["libro"]
        t.icona("libro", P(lx), P(ly - ls / 2), P(ls), "#1B2A66", 1.7)


# ---------------------------------------------------------------------------- pezzi per l'immagine 10 (e riusabili)
def tessera_vuota(t, cx, cy, lato, id="tessera", fondo="#FFFFFF"):
    P = t.p
    t.rett(P(cx - lato / 2), P(cy - lato / 2), P(lato), P(lato), P(lato * 0.26), fill=fondo, filtro=t.ombra(2, P(lato * 0.35), "#3B5BA8", 0.13), id=id)


def tessera_check_verde(t, cx, cy, lato):
    P = t.p
    with t.gruppo("tessera-risposte-corrette"):
        tessera_vuota(t, cx, cy, lato)
        r = P(lato * 0.30)
        t.cerchio(P(cx), P(cy), r, fill=t.sfumatura(["#3BD08F", "#12B26B"], 0.2, 0, 0.8, 1))
        t.icona("spunta", P(cx) - r * 0.58, P(cy) - r * 0.58, r * 1.16, "#FFFFFF", 3.0)


def tessera_scudo(t, cx, cy, lato):
    P = t.p
    with t.gruppo("tessera-scudo"):
        tessera_vuota(t, cx, cy, lato)
        s = P(lato * 0.56)
        g = t.sfumatura(["#5B9BFB", "#2563EB"], 0, 0, 0, 1)
        t.icona("scudo-pieno", P(cx) - s / 2, P(cy) - s / 2, s, "#2F6FF0", 1.0, fill_pieno=g)
        t.icona("spunta", P(cx) - s * 0.2, P(cy) - s * 0.2, s * 0.4, "#FFFFFF", 3.2)


def intro_aree(t, mis, sp, c):
    """Riquadro con tessera (barre) e 3 righe: 'Stiamo analizzando le aree…' (10.2)."""
    P = t.p
    with t.gruppo("intro-aree"):
        scheda(t, *c["card"], r=15, fill=CARD_AZ, id="intro-scheda")
        tessera_icona(t, "barre-piene", P(c["cx"]), P(c["cy"]), P(c["lato"]), "#2F6FF0", 1.6)
        testi(t, mis, c["testi"], *c["y"], x0=c["x_txt"], peso=400, colore=ETICHETTA, soglia=150, id="intro-testo")


def curva_confronto(t, mis, sp, c):
    """Card con curva a campana (area pallida + curva tratteggiata della media) e linea del punteggio con pallino (10.3)."""
    P = t.p
    with t.gruppo("curva-confronto"):
        scheda(t, *c["card"], r=15, fill=CARD_AZ, id="curva-scheda")
        x0, x1, yb = c["x0"], c["x1"], c["ybase"]
        pk, hp = c["picco"], c["h"]
        sg = c["sigma"]
        def y_(x, h=hp, mu=pk, s=sg): return yb - h * math.exp(-((x - mu) ** 2) / (2 * s * s))
        xs = [x0 + (x1 - x0) * i / 80 for i in range(81)]
        d = f"M{n(P(xs[0]))} {n(P(yb))}" + "".join(f"L{n(P(x))} {n(P(y_(x)))}" for x in xs) + f"L{n(P(xs[-1]))} {n(P(yb))}z"
        t.path(d, fill=t.sfumatura([("0", "#D4E3FA") if False else (0, "#DCE8FB"), (1, "#EEF4FD")], 0, 0, 0, 1), stroke=None, id="area-intervallo-tipico")
        # piccola collina dell'utente (pallida) vicino al pallino
        ux, uh, us = c["px"], c["h_utente"], c["s_utente"]
        d2 = f"M{n(P(ux - 3 * us))} {n(P(yb))}" + "".join(f"L{n(P(x))} {n(P(y_(x, uh, ux, us)))}" for x in [ux - 3 * us + i * (6 * us) / 30 for i in range(31)]) + f"L{n(P(ux + 3 * us))} {n(P(yb))}z"
        t.path(d2, fill="#E4EDFB", id="area-utente", opacita=0.9)
        # curva tratteggiata (media studenti): dal picco verso destra
        pts = [x for x in [pk - 0.2 * sg + i * (x1 - pk + 0.2 * sg) / 40 for i in range(41)]]
        dd = "M" + "L".join(f"{n(P(x))} {n(P(y_(x, hp + 6)))}" for x in pts)
        t.path(dd, stroke="#2F6FF0", sw=P(1.3), extra='stroke-dasharray="3 3.5"', id="curva-media-studenti")
        t.linea(P(x0), P(yb), P(c["px"]), P(yb), "#3B82F6", P(1.8), id="linea-punteggio")
        t.linea(P(c["px"]), P(yb), P(x1), P(yb), "#DCE6F6", P(1.2), id="linea-base")
        t.cerchio(P(c["px"]), P(yb), P(6), fill="#2F6FF0", stroke="#FFFFFF", sw=P(2.2), filtro=t.ombra(1, P(4), "#2F6FF0", 0.3), id="pallino-punteggio")
        testi(t, mis, c["testi"], *c["y"], x0=c["x_txt"], peso=400, colore=ETICHETTA, soglia=150, id="curva-testo")


def legenda_curva(t, mis, sp, c):
    P = t.p
    with t.gruppo("legenda-curva"):
        scheda(t, *c["card"], r=15, fill=CARD_AZ, id="legenda-scheda")
        bande = testi(t, mis, c["testi"], *c["y"], x0=c["x_txt"], peso=400, colore=ETICHETTA, soglia=160, id="legenda-testo")
        for i, b in enumerate(bande):
            yc = (b[2] + b[3]) / 2
            x0, x1 = c["x_seg"]
            if i == 0: t.rett(P(x0), P(yc - 2.6), P(x1 - x0), P(5.2), P(2.6), fill=t.sfumatura(["#5B9BFB", "#2F73F2"], 0, 0, 1, 0), id="segno-punteggio")
            elif i == 1:
                for j in range(3): t.cerchio(P(x0 + 2.5 + j * (x1 - x0 - 5) / 2), P(yc), P(1.7), fill="#2F6FF0")
            else: t.rett(P(x0), P(yc - 4), P(x1 - x0), P(8), P(2.5), fill="#E1E9F6", id="segno-intervallo")


def info_scudo(t, mis, sp, c):
    P = t.p
    with t.gruppo("nota-stima"):
        scheda(t, *c["card"], r=15, fill=CARD_AZ, id="nota-scheda")
        tessera_scudo(t, c["cx"], c["cy"], c["lato"])
        testi(t, mis, c["testi"], *c["y"], x0=c["x_txt"], peso=400, colore=ETICHETTA, soglia=150, id="nota-testo")


def fattori_generici(t, mis, sp, c):
    """Come corpo_fattori ma con tessere speciali (check verde) e nomi per riga. righe: icona 'check' -> tessera verde."""
    P = t.p
    with t.gruppo("fattori-considerati"):
        if c.get("card"): scheda(t, *c["card"], r=15, fill=CARD_AZ, id="scheda-fattori")
        testi(t, mis, [c["titolo"]], *c["titolo_y"], x0=c["x_tit"], peso=700, colore=NAVY, soglia=125, id="titolo-fattori")
        for i, r in enumerate(c["righe"]):
            with t.gruppo(f"fattore-{i + 1}"):
                if r["icona"] == "check": tessera_check_verde(t, c["cx"], r["cy"], c["lato"])
                else: tessera_icona(t, r["icona"], P(c["cx"]), P(r["cy"]), P(c["lato"]), r["colore"], 1.9, alone=r.get("alone"))
                testi(t, mis, [r["nome"]], *r["nome_y"], x0=c["x_nome"], x1=r.get("x_nome1"), peso=400, colore=ETICHETTA, soglia=125, id="nome")
                bx0, bx1 = r.get("barra", c["barra"])
                barra_px(t, bx0, bx1, r["by"], c.get("bh", 8), r["frac"], r["col"], "#E7ECF6", id="barra")
                for j, (s, a0, a1, xx0) in enumerate(r["dx"]):
                    testi(t, mis, [s], a0, a1, x0=xx0, peso=400, colore=ETICHETTA, soglia=175, id=f"valore-{j + 1}")
