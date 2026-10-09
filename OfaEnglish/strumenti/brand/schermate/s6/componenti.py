"""Componenti ripetuti delle schermate di app AddiOFA (ATLAS / NOI / Agorà) delle immagini 30 e 31.

Ogni schermata è un telefono canonico 390x844 punti. Si misura sull'immagine sorgente (pixel dell'originale, con
`leggi.py` che disegna la griglia) e si passa il riquadro del telefono (x0,y0,x1,y1): `t.X(x)`, `t.Y(y)` portano i pixel
sorgente in punti (la y è normalizzata sull'altezza canonica), `t.s(v)` scala le lunghezze orizzontali e i corpi dei testi.
Le barre di stato e di navigazione sono in coordinate fisse canoniche (uguali in tutte le schermate).
"""
from __future__ import annotations
import json, pathlib, sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from ui import *  # noqa
from ui import Tela, larghezza_testo, n, RADICE, BRAND, _icona  # noqa

SRC = {30: "/home/user/AddiOfa/design-concept/file_0000000089688210bbf00df3de3f973f.png",
       31: "/home/user/AddiOfa/design-concept/file_000000008ba881f4a420b137ffc486c3.png"}
OUT = RADICE / "brand/concept-svg/schermate"
TAV = RADICE / "brand/concept-svg/_tavole/s6"

NAVY = "#0A1060"; SOTTO = "#5E6B99"; TESTO = "#3F4D7A"; AZZ = "#0A6EFD"; AZZ2 = "#0556FD"
AZZ_PAL = "#EAF2FF"; AZZ_SEL = "#DCEBFF"; AZZ_BORDO = "#7DB4FF"; LINEA_S = "#E6EBF5"; GRIGIO_I = "#8A96B5"
ROSSO_T = "#F01E2C"; VERDE_T = "#14A44D"; VERDE_P = "#E3F6EA"; GIALLO_P = "#FDF1D6"; ARANCIO = "#F59A1B"
CARD_P = "#F3F6FC"

H = 844.0
SCHERMATE: dict = {}      # (imm, num) -> (nome, rect)


class S(Tela):
    pass


def nuova(imm: int, num: int, nome: str, rect, cartella: str, vista=None):
    """rect = riquadro del telefono. Se `vista`=(ox,oy,z) (ritaglio di leggi.py), rect e tutte le misure sono in pixel
    della vista (si leggono direttamente dall'immagine ingrandita); altrimenti sono pixel dell'originale."""
    x0, y0, x1, y1 = rect
    if vista:
        ox, oy, z = vista
        rect_src = (ox + x0 / z, oy + y0 / z, ox + x1 / z, oy + y1 / z)
    else:
        rect_src = rect
    t = S(390, H, fondo=None, id=f"schermata-{num:02d}-{nome}")
    t.rect = rect; t.imm = imm; t.num = num; t.nome = nome; t.cartella = cartella
    k = 390 / (x1 - x0)
    t.k = k
    t.X = lambda x: (x - x0) * k
    t.Y = lambda y: (y - y0) * H / (y1 - y0)
    t.s = lambda v: v * k
    t.p = t.s
    t.rett(0.5, 0.5, 389, H - 1, 22, fill="#FFFFFF", stroke="#EDF1F8", sw=1, id="schermata-fondo")
    SCHERMATE[(imm, num)] = (nome, tuple(rect_src))
    return t


def percorso(t):
    return OUT / t.cartella / f"{t.num:02d}-{t.nome}.svg"


def chiudi(t):
    p = percorso(t); t.salva(p); print(p); return p


# ------------------------------------------------------------------ testo
def tx(t, testo, x, y, corpo, peso=400, colore=NAVY, ancora="start", id=None, sp=0.0, larg=None):
    """Testo con x,y in pixel sorgente (y = linea di base), corpo in pixel sorgente. Se larg (pixel sorgente) è dato, il
    corpo si accorda per ottenere quella larghezza."""
    if larg:
        corpo = larg / larghezza_testo(testo, 1.0, peso, sp)
    return t.testo(testo, t.X(x), t.Y(y), t.s(corpo), peso, colore, ancora, id=id, spaziatura=t.s(sp)) / t.k


def tx_multi(t, segmenti, x, y, corpo, peso=400, ancora="start", id=None, larg=None):
    """segmenti [(testo, colore[, peso])]"""
    if larg:
        tot = sum(larghezza_testo(s[0], 1.0, s[2] if len(s) > 2 else peso) for s in segmenti)
        corpo = larg / tot
    tot = sum(larghezza_testo(s[0], t.s(corpo), s[2] if len(s) > 2 else peso) for s in segmenti)
    px = t.X(x) - (tot / 2 if ancora == "middle" else tot if ancora == "end" else 0)
    with t.gruppo(id or "riga"):
        for s in segmenti:
            pe = s[2] if len(s) > 2 else peso
            px += t.testo(s[0], px, t.Y(y), t.s(corpo), pe, s[1])


def R(t, x0, y0, x1, y1, r=8, fill="#FFFFFF", **kw):
    return t.rett(t.X(x0), t.Y(y0), t.X(x1) - t.X(x0), t.Y(y1) - t.Y(y0), t.s(r), fill=fill, **kw)


def C(t, cx, cy, r, fill="#FFFFFF", **kw):
    if "sw" in kw: kw["sw"] = t.s(kw["sw"])
    return t.cerchio(t.X(cx), t.Y(cy), t.s(r), fill=fill, **kw)


def I(t, nome, cx, cy, dim, colore=NAVY, sw=2.0, **kw):
    d = t.s(dim)
    t.icona(nome, t.X(cx) - d / 2, t.Y(cy) - d / 2, d, colore, sw, **kw)


def ombra_l(t, op=0.07):
    return t.ombra(t.s(1.2), t.s(6), "#1B3A8A", op)


# ------------------------------------------------------------------ cornice dell'app
def stato(t, chiaro=False):
    c = "#FFFFFF" if chiaro else NAVY
    with t.gruppo("barra-di-stato", trasforma="translate(0 9)"):
        t.testo("9:41", 26, 31, 13.5, 700, c, id="ora")
        for i, h_ in enumerate((4, 6.5, 9, 11.5)):
            t.rett(299 + i * 4.4, 30 - h_, 3, h_, 1, fill=c)
        t.icona("wifi", 320, 17, 15, c, 2.2)
        t.rett(341, 18.5, 22, 11, 3.2, fill="none", stroke=c, sw=1, opacita=0.5)
        t.rett(342.5, 20, 17, 8, 2, fill=c)
        t.rett(364, 21.5, 1.5, 4, 0.7, fill=c, opacita=0.5)


def indietro(t, y=70):
    with t.gruppo("indietro"):
        t.icona("chevron-sinistra", 20, y - 9, 18, NAVY, 2.4)


def avanzamento_quiz(t, frazione, y=70, etichetta=None):
    """Barra sottile + contatore a destra (3/20)"""
    xa, xb = 50, 318
    t.rett(xa, y - 3, xb - xa, 6, 3, fill="#E5EAF4", id="avanzamento-fondo")
    t.rett(xa, y - 3, (xb - xa) * frazione, 6, 3, fill=t.sfumatura(["#4D96FF", AZZ], 0, 0, 1, 0), id="avanzamento-pieno")
    if etichetta:
        t.testo(etichetta, 370, y + 5, 12.5, 500, SOTTO, "end", id="contatore")


def tabbar(t, voci, attiva, y=777):
    """voci [(icona,etichetta)]; barra in fondo, alta 74."""
    with t.gruppo("barra-di-navigazione"):
        t.rett(0, y - 8, 390, 844 - y + 8, 0, fill="#FFFFFF")
        t.linea(0, y - 8, 390, y - 8, "#EDF1F8", 1)
        m = 390 / len(voci)
        for i, (ic, et) in enumerate(voci):
            cx = m * i + m / 2
            col = AZZ if i == attiva else "#8A96B5"
            t.icona(ic, cx - 12, y, 24, col, 2.0 if i != attiva else 2.2, fill_pieno=col if i == attiva and ic in ("casa", "trofeo") else None)
            t.testo(et, cx, y + 49, 11.5, 700 if i == attiva else 500, col, "middle", id=f"nav-{et.lower()}")
    t.rett(145, 833, 100, 4.5, 2.2, fill=NAVY, opacita=0.9, id="indicatore-home")


TAB_APP = [("casa", "Home"), ("grafico", "Simulazioni"), ("libro", "Lezioni")]
TAB_ATLAS = [("casa", "Home"), ("grafico", "Studia"), ("trofeo", "Sfide")]


def logo(t, x, y, corpo, colore=NAVY):
    """Logotipo testuale 'AddiOfa' (x,y in pt canonici, corpo in pt)."""
    w1 = t.testo("Addi", x, y, corpo, 700, colore, id="logo-addi", spaziatura=-corpo * 0.01)
    t.testo("Ofa", x + w1, y, corpo, 700, AZZ, id="logo-ofa", spaziatura=-corpo * 0.01)
    return w1 + larghezza_testo("Ofa", corpo, 700)


def pulsante(t, x0, y0, x1, y1, etichetta, corpo=18.5, id="pulsante-primario", freccia=True, bianco=False):
    """Pulsante azzurro largo, freccia a destra. x/y in pixel sorgente."""
    X, Y = t.X, t.Y
    xa, ya, xb, yb = X(x0), Y(y0), X(x1), Y(y1)
    h = yb - ya
    with t.gruppo(id):
        t.rett(xa, ya, xb - xa, h, min(16, h * 0.32), id=f"{id}-fondo",
               fill=t.sfumatura(["#2D82FF", "#0A63F2"]), filtro=t.ombra(4, 10, "#0A63F2", 0.26))
        lw = larghezza_testo(etichetta, corpo, 600)
        cx = (xa + xb) / 2 - (8 if freccia else 0)
        t.testo(etichetta, cx - lw / 2, ya + h / 2 + corpo * 0.35, corpo, 600, "#FFFFFF", id=f"{id}-testo")
        if freccia:
            t.icona("freccia-destra", xb - 44, ya + h / 2 - 11, 22, "#FFFFFF", 2.0)


def pulsante_chiaro(t, x0, y0, x1, y1, etichetta, corpo=14):
    X, Y = t.X, t.Y
    xa, ya, xb, yb = X(x0), Y(y0), X(x1), Y(y1)
    with t.gruppo("pulsante-secondario"):
        t.rett(xa + .5, ya + .5, xb - xa - 1, yb - ya - 1, min(14, (yb - ya) * .3), fill="#EEF4FF", stroke="#C5DBFB", sw=1)
        lw = larghezza_testo(etichetta, corpo, 600)
        t.testo(etichetta, (xa + xb) / 2 - lw / 2, (ya + yb) / 2 + corpo * .35, corpo, 600, AZZ)


def scelta(t, x0, y0, x1, y1, etichetta, sel=False, corpo=13, sub=None, chevron=False, id="scelta"):
    """Card di scelta con radio a sinistra."""
    X, Y = t.X, t.Y
    xa, ya, xb, yb = X(x0), Y(y0), X(x1), Y(y1)
    h = yb - ya
    with t.gruppo(id):
        if sel:
            t.rett(xa + .75, ya + .75, xb - xa - 1.5, h - 1.5, min(13, h * .3), fill=t.sfumatura(["#E3EFFF", "#D6E8FF"]), stroke=AZZ_BORDO, sw=1.5)
        else:
            t.rett(xa + .5, ya + .5, xb - xa - 1, h - 1, min(13, h * .3), fill="#FFFFFF", stroke=LINEA_S, sw=1, filtro=t.ombra(1.5, 6, "#1B3A8A", 0.05))
        cx, cy = xa + 28, ya + h / 2
        if sel:
            t.cerchio(cx, cy, 10.5, fill="#FFFFFF", stroke=AZZ, sw=2.2); t.cerchio(cx, cy, 4.8, fill=AZZ)
        else:
            t.cerchio(cx, cy, 10, fill="#FFFFFF", stroke="#C9D1E3", sw=1.6)
        tyb = cy + corpo * .35 - (6 if sub else 0)
        t.testo(etichetta, xa + 52, tyb, corpo, 600 if sel or sub else 500, NAVY if sel or sub else "#3A4770", id=f"{id}-testo")
        if sub:
            t.testo(sub, xa + 52, tyb + 17, corpo * .83, 400, SOTTO)
        if chevron:
            t.icona("chevron-destra", xb - 34, cy - 7, 14, "#4B5A85", 2.2)


def riga_chip(t, cx, cy, r, fondo, glifo, colore, id="icona"):
    """Tondino/quadro pastello con icona."""
    with t.gruppo(id):
        r *= .92
        t.rett(cx - r, cy - r, 2 * r, 2 * r, r * 0.42, fill=fondo)
        t.icona(glifo, cx - r * .52, cy - r * .52, r * 1.04, colore, 2.3)


def punti_pagina(t, cy, attivo, n_=3, cx0=195, passo=19):
    with t.gruppo("indicatore-pagine"):
        for i in range(n_):
            x = cx0 + (i - (n_ - 1) / 2) * passo
            t.cerchio(x, cy, 7 if i == attivo else 6.2, fill=AZZ if i == attivo else "#D5DCEC")


def anello(t, cx, cy, r, valore, sp, colore="#13A672", fondo="#E6EBF4", id="anello-punteggio", capi="round"):
    """Anello di punteggio (0..1) che parte dall'alto, in senso orario. Coordinate in punti canonici."""
    a0 = -math.pi / 2
    a1 = a0 + 2 * math.pi * valore
    with t.gruppo(id):
        t.cerchio(cx, cy, r, fill="none", stroke=fondo, sw=sp, id=f"{id}-fondo")
        x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
        x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
        gr = 1 if valore > 0.5 else 0
        t.path(f"M{n(x0)} {n(y0)}A{n(r)} {n(r)} 0 {gr} 1 {n(x1)} {n(y1)}", stroke=colore, sw=sp, cap=capi, id=f"{id}-valore")


def radar(t, cx, cy, R_, valori, id="radar"):
    """Pentagono con 5 valori 0..1 (in alto, destra-alto, destra-basso, sinistra-basso, sinistra-alto)."""
    def pt(i, v):
        a = -math.pi / 2 + 2 * math.pi * i / 5
        return cx + R_ * v * math.cos(a), cy + R_ * v * math.sin(a)
    with t.gruppo(id):
        for lv in (1.0, 0.75, 0.5, 0.25):
            d = "M" + "L".join(f"{n(pt(i, lv)[0])} {n(pt(i, lv)[1])}" for i in range(5)) + "z"
            t.path(d, fill="#F4F8FF" if lv == 1.0 else "none", stroke="#D5E0F2", sw=1, join="miter")
        for i in range(5):
            x, y = pt(i, 1); t.linea(cx, cy, x, y, "#DCE5F4", 0.8)
        d = "M" + "L".join(f"{n(pt(i, v)[0])} {n(pt(i, v)[1])}" for i, v in enumerate(valori)) + "z"
        t.path(d, fill=t.sfumatura(["#7DB4FF", "#2F7BF7"]), stroke=AZZ, sw=2.2, opacita=0.55, id=f"{id}-area", join="round")
        t.path(d, fill="none", stroke=AZZ, sw=2.2, id=f"{id}-contorno")
        for i, v in enumerate(valori):
            x, y = pt(i, v); t.cerchio(x, y, 3.2, fill="#FFFFFF", stroke=AZZ, sw=1.8)


def avatar(t, cx, cy, r, colore, iniziale=None, id="avatar", testa="#8A5A3C", capelli="#2B1B14"):
    """Avatar generico (t.avatar): iniziale oppure busto stilizzato."""
    with t.gruppo(id):
        t.cerchio(cx, cy, r, fill=colore)
        if iniziale:
            t.testo(iniziale, cx, cy + r * .36, r * 1.0, 700, "#FFFFFF", "middle")
        else:
            t.cerchio(cx, cy - r * .12, r * .34, fill=testa)
            t.path(f"M{n(cx - r*.34)} {n(cy - r*.2)}a{n(r*.34)} {n(r*.3)} 0 0 1 {n(r*.68)} 0q{n(-r*.34)} {n(-r*.12)} {n(-r*.68)} 0z", fill=capelli)
            t.path(f"M{n(cx - r*.7)} {n(cy + r*.95)}a{n(r*.7)} {n(r*.6)} 0 0 1 {n(r*1.4)} 0z", fill="#1B2A55")


def doc_illustrazione(t, cx, cy, sc=1.0, id="documento-grafico"):
    """Illustrazione: documento azzurro inclinato con righe, grafico a barre e fogli fantasma dietro (coord. canoniche)."""
    with t.gruppo(id):
        # fogli fantasma
        t.rett(cx - 85 * sc, cy - 70 * sc, 160 * sc, 120 * sc, 14 * sc, fill="#EEF3FC", opacita=.9, id="foglio-fantasma-1")
        t.rett(cx - 15 * sc, cy - 95 * sc, 130 * sc, 130 * sc, 14 * sc, fill="#F1F5FC", opacita=.9, id="foglio-fantasma-2")
        for i in range(3):
            t.rett(cx + 18 * sc, cy - 55 * sc + i * 22 * sc, (84 - i * 12) * sc, 9 * sc, 4.5 * sc, fill="#E1E9F7")
        # scheda grafico
        t.rett(cx - 110 * sc, cy - 10 * sc, 130 * sc, 90 * sc, 14 * sc, fill="#F3F6FD", id="foglio-grafico")
        for i, (h_, c) in enumerate(((34, "#3D8BFF"), (44, "#3D8BFF"), (26, "#8DB9FF"))):
            t.rett(cx - 92 * sc + i * 17 * sc, cy + 40 * sc - h_ * sc * .8 + 10 * sc, 9 * sc, h_ * sc * .8, 3 * sc, fill=c)
        for i in range(2):
            t.rett(cx - 95 * sc, cy + 58 * sc + i * 10 * sc, (62 - i * 18) * sc, 5 * sc, 2.5 * sc, fill="#E1E9F7")
        # documento principale
        with t.gruppo("documento-principale", trasforma=f"rotate(8 {n(cx - 5 * sc)} {n(cy + 5 * sc)})"):
            t.rett(cx - 55 * sc, cy - 70 * sc, 100 * sc, 130 * sc, 13 * sc, id="documento-fondo",
                   fill=t.sfumatura(["#5AA2FF", "#2F7BF7"]), filtro=t.ombra(8, 16, "#2F6BE0", 0.3))
            for i, w_ in enumerate((60, 60, 60)):
                t.rett(cx - 38 * sc, cy - 42 * sc + i * 24 * sc, w_ * sc, 8 * sc, 4 * sc, fill="#FFFFFF", opacita=.65)
            t.cerchio(cx - 33 * sc, cy + 36 * sc, 5.5 * sc, fill="#FFFFFF", opacita=.8)
        t.cerchio(cx + 84 * sc, cy - 82 * sc, 0.1, fill="none")


# ------------------------------------------------------------------ icone in più
ICONE["chat"] = [("pf", "M5 4.5h14a2 2 0 0 1 2 2v8.500a2 2 0 0 1-2 2h-6.500L8 20.500v-4H5a2 2 0 0 1-2-2V6.500a2 2 0 0 1 2-2z")]
ICONE["atlas"] = [("c", (12, 12, 8.5)), ("p", "M12 7.500v9M8.500 12h7")]
ICONE["medaglia"] = [("c", (12, 9.5, 5.500)), ("p", "M8.700 14 7 21l5-2.500L17 21l-1.700-7"), ("cf", (12, 9.5, 1.600))]
ICONE["libro-pieno"] = [("pf", "M12 6.600C9.900 5 6.800 4.600 3.200 5.100v13.200c3.600-.5 6.700-.1 8.800 1.500 2.100-1.600 5.200-2 8.800-1.500V5.100c-3.600-.5-6.700-.1-8.800 1.500z")]
ICONE["lente"] = [("c", (10.5, 10.5, 6.500)), ("p", "M15.500 15.500 20.500 20.500")]
ICONE["zaino"] = [("p", "M7 8a5 5 0 0 1 10 0v11a1.500 1.500 0 0 1-1.500 1.500h-7A1.500 1.500 0 0 1 7 19zM9 13h6")]


def atlas_marchio(t, cx, cy, d, id="marchio-atlas"):
    """Marchio ATLAS (forma azzurra morbida a due lobi, come nelle card dell'originale). cx,cy,d in punti canonici."""
    k = d / 40
    g = t.sfumatura(["#8FC0FF", "#2F7BF7"], 0, 0, 1, 1)
    with t.gruppo(id, trasforma=f"translate({n(cx - 20 * k)} {n(cy - 20 * k)}) scale({n(k)})"):
        t.path("M8 14c0-6 4.500-9 10-7l6 2.500c4 1.600 5 4 5 9v10c0 5-2 8-7 8H15c-5 0-7-4-7-8z", fill=g)
        t.path("M18 26c0-4 3-6.500 7-5.500l6 1.500c5 1.300 6 4 6 7 0 3.500-2 6-6 6h-10c-3 0-5-2-5-5z", fill="#B9D6FF", opacita=.95)


def avviso_atlas(t, x0, y0, x1, y1, righe, corpo, larg_righe=None, id="card-atlas", marchio_x=None):
    """Card pallida con marchio ATLAS a sinistra e testo a righe (x,y,coord. della vista)."""
    R(t, x0, y0, x1, y1, 14, CARD_P, id=id)
    atlas_marchio(t, t.X(marchio_x or x0 + 47), t.Y((y0 + y1) / 2), t.s(46))


def sezione_titolo(t, testo, x, y, corpo, larg, info_cx=None):
    tx(t, testo, x, y, corpo, 700, NAVY, larg=larg, id="titolo")
    if info_cx:
        C(t, info_cx, y - corpo * .38, corpo * .5, fill="none", stroke=AZZ, sw=1.8)
        t.rett(t.X(info_cx) - .9, t.Y(y - corpo * .38) - 1, 1.8, t.s(corpo * .28), .9, fill=AZZ)
        t.cerchio(t.X(info_cx), t.Y(y - corpo * .38) - t.s(corpo * .27), 1.3, fill=AZZ)


def gauge(t, cx, cy, r, sp, frac, a0=194.0, a1=-14.0, colore="#F0303B", chiaro="#FF8484", id="misuratore-rischio", tacche=True):
    """Arco del rischio (0..1 lungo l'arco da a0 a a1 gradi) con tacche, pomello bianco con alone. Punti canonici."""
    def P(th, rr=r):
        a = math.radians(th); return cx + rr * math.cos(a), cy - rr * math.sin(a)
    def arco(t0, t1):
        (xa, ya), (xb, yb) = P(t0), P(t1)
        return f"M{n(xa)} {n(ya)}A{n(r)} {n(r)} 0 {1 if abs(t0 - t1) > 180 else 0} 1 {n(xb)} {n(yb)}"
    th = a0 + (a1 - a0) * frac
    with t.gruppo(id):
        if tacche:
            for i in range(11):
                tt = 188 - i * 20.2
                (xa, ya), (xb, yb) = P(tt, r + sp / 2 + 11), P(tt, r + sp / 2 + 25)
                pieno = tt >= th
                t.linea(xa, ya, xb, yb, colore if pieno else "#CBD5E5", 2.6, opacita=.55 if pieno else .8)
        t.path(arco(a0, a1), stroke="#E4E9F3", sw=sp, id=f"{id}-fondo")
        g = t.sfumatura([chiaro, colore], cx - r, 0, cx + r, 0, userspace=True)
        t.path(arco(a0, th), stroke=g, sw=sp, id=f"{id}-valore")
        px, py = P(th)
        t.cerchio(px, py, sp * 1.5, fill=t.radiale([(0, colore, .35), (1, colore, 0)], .5, .5, .5), id=f"{id}-alone")
        t.cerchio(px, py, sp * .62, fill="#FFFFFF", filtro=t.ombra(1, 4, colore, .3))
        t.cerchio(px, py, sp * .36, fill=colore)


def grafico_percorso(t, pts, valori, etichette, y_val, y_et, x_tratto=None):
    """Tre punti (rosso->blu) con linea sfumata e valori sotto. pts [(x,y)] in coord. vista; y_val/y_et basi dei testi."""
    P = [(t.X(x), t.Y(y)) for x, y in pts]
    g = t.sfumatura(["#F87171", "#3B82F6"], P[0][0], 0, P[-1][0], 0, userspace=True)
    t.path("M" + "L".join(f"{n(x)} {n(y)}" for x, y in P), stroke=g, sw=2.4, id="linea-percorso")
    t.linea(P[0][0], P[0][1], P[0][0], t.Y(y_val) - t.s(26), "#F8A5A5", 2.4)
    cols = ["#F0303B", "#6C9BF2", "#2E78F2"]
    for (x, y), c in zip(P, cols):
        t.cerchio(x, y, 6.5, fill=c, stroke="#FFFFFF", sw=1.5)
    for i, ((x, _), v, e) in enumerate(zip(P, valori, etichette)):
        t.testo(v, x, t.Y(y_val), t.s(22), 700 if i == 0 else 600, "#E6121F" if i == 0 else ("#5B6C92" if i == 1 else "#2E78F2"), "middle")
        t.testo(e, x, t.Y(y_et), t.s(19), 400, SOTTO, "middle")


def esito_corretto(t, x0, y0, x1, y1, titolo, testo, larg_t, larg_x, cx_icona, id="esito-corretto"):
    """Card verde 'Corretto!' con spunta in tondo (coord. vista)."""
    R(t, x0, y0, x1, y1, 14, "#E3F6EA", id=id)
    cy = (y0 + y1) / 2
    C(t, cx_icona, cy, (y1 - y0) * .21, fill="#17A455", filtro=t.ombra(1, 4, "#17A455", .3))
    t.icona("spunta", t.X(cx_icona) - t.s((y1 - y0) * .11), t.Y(cy) - t.s((y1 - y0) * .11), t.s((y1 - y0) * .22), "#FFFFFF", 3.2)
    xt = cx_icona + (y1 - y0) * .21 + 24
    tx(t, titolo, xt, cy - 6, 24, 700, "#0E8A44", larg=larg_t, id="esito-titolo")
    tx(t, testo, xt, cy + 24, 16, 400, "#2C7A52", larg=larg_x, id="esito-testo")


def barra_valore(t, x0, x1, y, frac, colore, chiaro, h=11):
    R(t, x0, y - h / 2, x1, y + h / 2, h / 2, "#E8ECF4")
    xe = x0 + (x1 - x0) * frac
    t.rett(t.X(x0), t.Y(y) - t.s(h / 2), t.X(xe) - t.X(x0), t.s(h), t.s(h / 2), fill=t.sfumatura([chiaro, colore], 0, 0, 1, 0))
