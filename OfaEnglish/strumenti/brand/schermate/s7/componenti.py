"""
Componenti ripetuti delle schermate blu con ATLAS / NOI / Agorà (immagini 34 e 36 di design-concept).

Si disegna in PIXEL DEL RITAGLIO ORIGINALE (brand/concept/<34|36>-.../NNN-schermata.png): `nuova(img, n)` crea la tela
(390 punti di larghezza = solo la parte bianca del telefono, angoli arrotondati, fondo trasparente) e dà X(x), Y(y), s(v).
Corregge dell'originale: barra di stato, nav inferiore e icone normalizzate; testi AI storpiati rifatti in Inter;
avatar = foto-ritratto sostituita da `t.avatar` (iniziali/figura neutra); sigillo non presente.
"""
from __future__ import annotations
import pathlib, sys, json, math

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from ui import *          # noqa
from ui import Tela, larghezza_testo, n, RADICE, BRAND

DIRS = {34: "34-flusso-schermate-c", 36: "36-flusso-schermate-d"}
OUT = RADICE / "brand/concept-svg/schermate"
TAV = RADICE / "brand/concept-svg/_tavole/s7"

NAVY = "#0A1B55"; SOTTO = "#55638E"; BL = "#0B6FF8"; BL2 = "#3C8BF9"; VERDE_S = "#0FA66B"; ROSSO_S = "#F0303B"
LINEA_B = "#E8EDF6"; CARD = "#F3F7FD"; SEL_F = "#EAF3FD"; SEL_B = "#7DB3F5"; GRIGIO_C = "#98A3BC"

# (x0, x1, ytop, ybottom) in px del ritaglio; nome file
SCHERMATE = {
 # immagine 34
 (34, 1): ((6, 204, 28, 475), "01-splash"),
 (34, "3a"): ((2, 196, 4, 457), "03-test-iniziale"),
 (34, "3b"): ((212, 437, 4, 457), "04-risultati-test"),
 (34, 2): ((31, 229, 4, 457), "02-onboarding"),
 (34, 4): ((13, 216, 0, 455), "05-home"),
 (34, 5): ((2, 206, 0, 457), "06-studia"),
 (34, 6): ((15, 211, 0, 444), "07-lezione"),
 (34, 7): ((0, 186, 0, 439), "08-esercizio"),
 (34, 8): ((16, 210, 0, 433), "09-simulazioni"),
 (34, 9): ((11, 206, 0, 436), "10-risultato-simulazione"),
 (34, 10): ((19, 204, 0, 437), "11-classifica"),
 (34, 11): ((13, 171, 0, 437), "12-sfida-settimanale"),
 (34, 12): ((13, 182, 0, 438), "13-discussione-agora"),
 (34, 13): ((3, 172, 0, 436), "14-profilo"),
 (34, 14): ((15, 160, 0, 440), "15-impostazioni"),
 # immagine 36
 (36, 1): ((4, 197, 0, 459), "01-splash"),
 (36, 2): ((5, 191, 0, 461), "02-onboarding"),
 (36, 3): ((4, 203, 0, 461), "03-test-iniziale"),
 (36, 4): ((3, 203, 0, 452), "04-risultati-atlas"),
 (36, 5): ((21, 232, 0, 460), "05-home"),
 (36, 6): ((0, 187, 0, 446), "06-lezione"),
 (36, 7): ((27, 228, 0, 458), "07-ranking-noi"),
 (36, 14): ((4, 194, 0, 409), "08-simulazioni"),
 (36, 8): ((10, 211, 0, 414), "09-dettaglio-simulazione"),
 (36, 9): ((13, 209, 0, 407), "10-risultato-simulazione"),
 (36, 10): ((13, 200, 0, 411), "11-correzione-atlas"),
 (36, 11): ((14, 221, 0, 418), "12-discussione-agora"),
 (36, 12): ((11, 199, 0, 416), "13-profilo"),
 (36, 13): ((13, 189, 0, 412), "14-impostazioni"),
}
FILE_ORIG = {(34, "3a"): "003-grafica.png", (34, "3b"): "003-grafica.png", (34, 1): "001-grafica.png", (34, 2): "002-schermata.png",
             (34, 4): "004-schermata.png", (34, 5): "005-schermata.png", (34, 6): "006-schermata.png"}


def percorso_orig(chiave):
    img, k = chiave
    if chiave in FILE_ORIG: f = FILE_ORIG[chiave]
    else:
        num = k
        if img == 34: num = {7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14}[k]
        f = f"{num:03d}-schermata.png"
    return RADICE / "brand/concept" / DIRS[img] / f


def percorso_svg(chiave):
    return OUT / f"{chiave[0]:02d}-{DIRS[chiave[0]][3:]}" / (SCHERMATE[chiave][1] + ".svg")


def nuova(img, k):
    chiave = (img, k)
    (x0, x1, y0, y1), nome = SCHERMATE[chiave]
    kk = 390 / (x1 - x0)
    t = Tela(390, round((y1 - y0) * kk, 2), fondo=None, id=f"schermata-{img}-{nome}")
    t.k, t.x0, t.x1, t.y0, t.y1, t.chiave = kk, x0, x1, y0, y1, chiave
    t.X = lambda x: (x - x0) * kk
    t.Y = lambda y: (y - y0) * kk
    t.s = lambda v: v * kk
    t.rett(0.5, 0.5, 389, t.h - 1, 22, fill="#FFFFFF", stroke="#E6ECF6", sw=1, id="schermata-fondo")
    return t


def chiudi(t):
    p = percorso_svg(t.chiave); t.salva(p); print(p); return p


# ---------------------------------------------------------------- testo
def corpo_per(testo, w_px, peso=700, spaz=0.0):
    return w_px / larghezza_testo(testo, 1.0, peso, spaz)


def tx(t, testo, x, y, w=None, corpo=None, peso=400, col=NAVY, ancora="start", id=None, spaz=0):
    """Testo: x = sinistra/centro/destra secondo `ancora`, y = linea di base (px ritaglio). `w` = larghezza misurata (px) oppure `corpo` (px)."""
    c = corpo_per(testo, w, peso) if w else corpo
    t.testo(testo, t.X(x), t.Y(y), t.s(c), peso, col, ancora, id=id, spaziatura=t.s(spaz))
    return c


def multi(t, segs, x, y, corpo, peso=400, ancora="start", id=None):
    """Riga con segmenti colorati [(testo, colore, peso)]."""
    cs = t.s(corpo)
    tot = sum(larghezza_testo(a, cs, p) for a, _, p in segs)
    px = t.X(x) - (tot / 2 if ancora == "middle" else tot if ancora == "end" else 0)
    with t.gruppo(id or "riga"):
        for a, c, p in segs:
            px += t.testo(a, px, t.Y(y), cs, p, c)


# ---------------------------------------------------------------- elementi del telefono
def stato(t, y=17, scuro=False, cx=None):
    c = "#FFFFFF" if scuro else NAVY
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo("barra-di-stato"):
        t.testo("9:41", X(t.x0 + 19), Y(y), s(7.6), 700, c, id="ora")
        r = t.x1 - 13
        bx = X(r) - s(12)
        t.rett(bx, Y(y - 6.2), s(11.6), s(6), s(1.9), fill="none", stroke=c, sw=s(0.55), opacita=0.5)
        t.rett(bx + s(0.8), Y(y - 5.4), s(10), s(4.4), s(1.1), fill=c)
        wx = bx - s(11)
        t.icona("wifi", wx, Y(y - 7.8), s(8.8), c, 2.2)
        sx = wx - s(12.5)
        for i, h_ in enumerate((2.1, 3.3, 4.5, 5.8)):
            t.rett(sx + s(2.4) * i, Y(y - 0.8) - s(h_), s(1.5), s(h_), s(0.5), fill=c)


def indietro(t, x, y, col=NAVY):
    t.icona("chevron-sinistra", t.X(x) - t.s(5), t.Y(y) - t.s(5), t.s(10), col, 2.6, id="indietro")


def barra_prog(t, x0, x1, y, valore, h=3.2):
    t.rett(t.X(x0), t.Y(y - h / 2), t.s(x1 - x0), t.s(h), t.s(h / 2), fill="#E5ECF6", id="avanzamento-fondo")
    t.rett(t.X(x0), t.Y(y - h / 2), t.s((x1 - x0) * valore), t.s(h), t.s(h / 2), fill=t.sfumatura([BL2, BL], 0, 0, 1, 0), id="avanzamento")


def pulsante(t, x0, y0, x1, y1, etichetta, w=None, corpo=None, id="pulsante-primario", freccia=True):
    X, Y, s = t.X, t.Y, t.s
    h = y1 - y0
    with t.gruppo(id):
        t.rett(X(x0), Y(y0), s(x1 - x0), s(h), s(h * 0.3), fill=t.sfumatura(["#1478FA", "#0A68F2"]), id=id + "-fondo",
               filtro=t.ombra(s(1.4), s(5), "#0B6FF8", 0.28))
        c = corpo_per(etichetta, w, 600) if w else corpo
        cx = (x0 + x1) / 2 - (2 if freccia else 0)
        t.testo(etichetta, X(cx), Y((y0 + y1) / 2) + s(c) * 0.355, s(c), 600, "#FFFFFF", "middle", id=id + "-testo")
        if freccia:
            t.icona("freccia-destra", X(x1 - 18) - s(5), Y((y0 + y1) / 2) - s(5), s(10), "#FFFFFF", 1.9)


def card(t, x0, y0, x1, y1, r=8, fill=CARD, bordo=None, ombra=False, id="card"):
    X, Y, s = t.X, t.Y, t.s
    t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s(r), fill=fill, stroke=bordo, sw=s(0.7), id=id,
           filtro=t.ombra(s(0.8), s(4), "#0F2A6B", 0.07) if ombra else None)


def opzione(t, x0, y0, x1, y1, testo, sel=False, tx_x=None, corpo=7.6, id="opzione"):
    X, Y, s = t.X, t.Y, t.s
    cy = (y0 + y1) / 2
    with t.gruppo(id):
        if sel:
            t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s(7), fill=SEL_F, stroke=SEL_B, sw=s(1), id=id + "-fondo")
        else:
            t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s(7), fill="#FFFFFF", stroke=LINEA_B, sw=s(0.8), id=id + "-fondo",
                   filtro=t.ombra(s(0.6), s(3), "#0F2A6B", 0.05))
        rx = x0 + 13
        if sel:
            t.cerchio(X(rx), Y(cy), s(5.6), fill="#FFFFFF", stroke=BL, sw=s(1.9)); t.cerchio(X(rx), Y(cy), s(2.4), fill=BL)
        else:
            t.cerchio(X(rx), Y(cy), s(5.4), fill="#FFFFFF", stroke="#D3DAE8", sw=s(1.2))
        t.testo(testo, X(tx_x if tx_x else x0 + 30), Y(cy) + s(corpo) * 0.36, s(corpo), 500 if sel else 400, NAVY if sel else "#3B4A74")


def atlas_marchio(t, cx, cy, r):
    """Marchio ATLAS (due masse blu sovrapposte, come nell'originale: un nuvolo con un punto)."""
    X, Y, s = t.X, t.Y, t.s
    cx, cy, r = X(cx), Y(cy), s(r)
    with t.gruppo("marchio-atlas"):
        t.path(f"M{n(cx - r*0.9)} {n(cy + r*0.1)}C{n(cx - r*1.0)} {n(cy - r*0.8)} {n(cx - r*0.2)} {n(cy - r*1.0)} {n(cx + r*0.1)} {n(cy - r*0.6)}"
               f"L{n(cx + r*0.15)} {n(cy + r*0.6)}C{n(cx - r*0.3)} {n(cy + r*1.1)} {n(cx - r*0.9)} {n(cy + r*0.9)} {n(cx - r*0.9)} {n(cy + r*0.1)}z",
               fill=t.sfumatura(["#7EB6FF", "#2F86F9"]))
        t.path(f"M{n(cx - r*0.1)} {n(cy - r*0.55)}C{n(cx + r*0.6)} {n(cy - r*0.95)} {n(cx + r*1.1)} {n(cy - r*0.4)} {n(cx + r*0.95)} {n(cy + r*0.2)}"
               f"C{n(cx + r*0.9)} {n(cy + r*0.8)} {n(cx + r*0.2)} {n(cy + r*0.9)} {n(cx - r*0.1)} {n(cy + r*0.6)}z", fill=t.sfumatura(["#3F90FA", "#0B6FF8"]))
        t.cerchio(cx + r*0.4, cy - r*0.1, r*0.2, fill="#FFFFFF", opacita=0.9)


def card_atlas(t, x0, y0, x1, y1, righe, titolo=None, mx=None, corpo=5.7, id="card-atlas", col=SOTTO, peso=400, inter=None):
    """Riquadro ATLAS: marchio a sinistra e testo (titolo opzionale + righe)."""
    card(t, x0, y0, x1, y1, 8, CARD, id=id)
    atlas_marchio(t, x0 + 17, (y0 + y1) / 2, 8)
    ty = (y0 + y1) / 2
    ix = x0 + 33 if mx is None else mx
    inter = inter or corpo * 1.55
    nr = len(righe) + (1 if titolo else 0)
    base = ty - (nr - 1) * inter / 2 + corpo * 0.36
    i = 0
    if titolo:
        multi(t, titolo, ix, base, corpo * 1.18, 700); i = 1
    for r in righe:
        if isinstance(r, str):
            tx(t, r, ix, base + i * inter, corpo=corpo, peso=peso, col=col)
        else:
            multi(t, r, ix, base + i * inter, corpo, peso)
        i += 1


# ---------------------------------------------------------------- navigazione inferiore
NAV3 = [("casa", "Home"), ("grafico", "Studia"), ("trofeo", "Classifica")]
NAV5_A = [("casa", "Home"), ("grafico", "Studio"), ("ingranaggio", "Simulazioni"), ("trofeo", "Classifica"), ("utente", "Profilo")]
NAV5_B = [("casa", "Home"), ("grafico", "ATLAS"), ("gruppo", "NOI"), ("fiamma", "Agorà"), ("utente", "Profilo")]


def nav(t, voci, attiva, y_top, y_cen_icona=None, ic=9.5, corpo=5.4, x0=None, x1=None):
    """Barra di navigazione in px ritaglio: y_top = bordo superiore; icone e voci distribuite sulla larghezza del telefono."""
    X, Y, s = t.X, t.Y, t.s
    x0 = t.x0 if x0 is None else x0; x1 = t.x1 if x1 is None else x1
    with t.gruppo("barra-di-navigazione"):
        t.rett(0, Y(y_top), t.w, t.h - Y(y_top), 0, fill="#FFFFFF", id="nav-fondo")
        t.linea(0, Y(y_top), t.w, Y(y_top), "#EDF1F8", 1)
        m = (x1 - x0) / len(voci)
        for i, (icn, et) in enumerate(voci):
            cx = x0 + m * i + m / 2
            col = BL if i == attiva else "#8590AA"
            cy = y_top + 15
            if i == attiva:
                t.icona(icn, X(cx) - s(ic / 2), Y(cy) - s(ic / 2), s(ic), col, 2.3, fill_pieno=col)
            else:
                t.icona(icn, X(cx) - s(ic / 2), Y(cy) - s(ic / 2), s(ic), col, 1.7)
            t.testo(et, X(cx), Y(y_top + 30), s(corpo), 700 if i == attiva else 500, col, "middle", id=f"nav-{et.lower()}")


def avatar_f(t, cx, cy, r, tono=0, id="avatar"):
    """Avatar-ritratto neutro (testa + spalle) con fondo colorato, al posto delle foto dell'originale."""
    X, Y, s = t.X, t.Y, t.s
    fondi = ["#C9D6EA", "#E8D4C0", "#CFE1D6", "#D9CFE8"]
    pelle = ["#E8B792", "#D79B72", "#C98B63", "#EFC3A0"]
    capelli = ["#2B1D17", "#1B1511", "#3A2A20", "#4B2F22"]
    cid = t.uid("av")
    t.defs.append(f'<clipPath id="{cid}"><circle cx="{n(X(cx))}" cy="{n(Y(cy))}" r="{n(s(r))}"/></clipPath>')
    with t.gruppo(id, clip=cid):
        t.cerchio(X(cx), Y(cy), s(r), fill=fondi[tono % 4])
        t.path(f"M{n(X(cx - r))} {n(Y(cy + r))}C{n(X(cx - r*0.9))} {n(Y(cy + r*0.35))} {n(X(cx - r*0.4))} {n(Y(cy + r*0.3))} {n(X(cx))} {n(Y(cy + r*0.3))}"
               f"C{n(X(cx + r*0.4))} {n(Y(cy + r*0.3))} {n(X(cx + r*0.9))} {n(Y(cy + r*0.35))} {n(X(cx + r))} {n(Y(cy + r))}z", fill=["#26324F", "#34497A", "#4A5A6A", "#6D3B3B"][tono % 4])
        t.ellisse(X(cx), Y(cy - r*0.12), s(r*0.34), s(r*0.42), fill=pelle[tono % 4])
        t.path(f"M{n(X(cx - r*0.36))} {n(Y(cy - r*0.2))}C{n(X(cx - r*0.4))} {n(Y(cy - r*0.72))} {n(X(cx + r*0.4))} {n(Y(cy - r*0.72))} {n(X(cx + r*0.36))} {n(Y(cy - r*0.2))}"
               f"C{n(X(cx + r*0.2))} {n(Y(cy - r*0.42))} {n(X(cx - r*0.2))} {n(Y(cy - r*0.42))} {n(X(cx - r*0.36))} {n(Y(cy - r*0.2))}z", fill=capelli[tono % 4])


def avatar_r(t, cx, cy, r, lettera="R"):
    t.cerchio(t.X(cx), t.Y(cy), t.s(r), fill="#DCEBFD", id="avatar-iniziale-fondo")
    t.testo(lettera, t.X(cx), t.Y(cy) + t.s(r) * 0.36, t.s(r) * 1.05, 700, BL, "middle", id="avatar-iniziale")


def logo_testo(t, cx, y, w, peso=800, ancora="middle"):
    c = corpo_per("AddiOfa", w, peso)
    a = larghezza_testo("Addi", t.s(c), peso); b = larghezza_testo("Ofa", t.s(c), peso)
    x = t.X(cx) - (a + b) / 2 if ancora == "middle" else t.X(cx)
    t.testo("Addi", x, t.Y(y), t.s(c), peso, "#0A1250", id="logo-addi")
    t.testo("Ofa", x + a, t.Y(y), t.s(c), peso, BL, id="logo-ofa")


def documenti(t, cx, cy, sc=1.0):
    """Illustrazione dell'onboarding: fogli sovrapposti con scheda blu (come l'originale, ridisegnata)."""
    X, Y, s = t.X, t.Y, t.s
    g = f"translate({n(X(cx))} {n(Y(cy))}) scale({n(s(sc))})"
    with t.gruppo("illustrazione-fogli", trasforma=g):
        t.rett(-25, -62, 78, 100, 8, fill="#EEF3FB", id="foglio-dietro", trasforma=None) if False else None
        t.add('<g transform="rotate(14)"><rect x="-8" y="-50" width="62" height="82" rx="8" fill="#E9F0FA"/></g>')
        t.add('<g transform="rotate(-12)"><rect x="-58" y="-20" width="70" height="66" rx="7" fill="#F4F7FC" stroke="#E3EAF5"/>'
              '<rect x="-52" y="-12" width="28" height="9" rx="3" fill="#7FB1F7"/><rect x="-52" y="2" width="58" height="5" rx="2.5" fill="#DCE6F5"/>'
              '<rect x="-52" y="13" width="58" height="5" rx="2.5" fill="#DCE6F5"/><rect x="-52" y="24" width="50" height="5" rx="2.5" fill="#DCE6F5"/></g>')
        t.add(f'<g transform="rotate(10)"><rect x="-26" y="-48" width="64" height="84" rx="9" fill="#FFFFFF" filter="{t.ombra(3, 8, "#2B6CD8", 0.18)}"/>'
              f'<rect x="-20" y="-42" width="52" height="72" rx="6" fill="{t.sfumatura(["#5AA2FA", "#2E7BF4"])}"/>'
              '<rect x="-11" y="-30" width="34" height="5" rx="2.5" fill="#D6E7FD"/><rect x="-11" y="-19" width="34" height="5" rx="2.5" fill="#D6E7FD"/>'
              '<rect x="-11" y="-8" width="26" height="5" rx="2.5" fill="#D6E7FD"/><ellipse cx="-6" cy="8" rx="5" ry="4" fill="#D6E7FD"/></g>')


# ---------------------------------------------------------------- icone in più (griglia 24) e componenti
ICONE.update({
    "link": [("p", "M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1")],
    "copia": [("p", "M9 9h9a1.500 1.500 0 0 1 1.500 1.500v9A1.500 1.500 0 0 1 18 21H9a1.500 1.500 0 0 1-1.500-1.500v-9A1.500 1.500 0 0 1 9 9zM16.500 6V4.500A1.500 1.500 0 0 0 15 3H6a1.500 1.500 0 0 0-1.500 1.500v9A1.500 1.500 0 0 0 6 15h1.500")],
    "pollice": [("p", "M7.500 10.500V20h-3v-9.500zM7.500 11l3.500-7c1.600 0 2.500 1.200 2.200 2.800L12.500 10h5.200a2 2 0 0 1 2 2.400l-1.300 6A2 2 0 0 1 16.400 20H7.500")],
    "commento": [("p", "M5 4.500h14a1.500 1.500 0 0 1 1.500 1.500v9a1.500 1.500 0 0 1-1.500 1.500h-8l-4.500 3.500v-3.500H5A1.500 1.500 0 0 1 3.500 15V6A1.500 1.500 0 0 1 5 4.500z")],
    "smile": [("c", (12, 12, 9)), ("p", "M8.500 14.500c1 1.500 2.200 2.200 3.500 2.200s2.500-.7 3.500-2.200"), ("cf", (9, 9.800, 1.100)), ("cf", (15, 9.800, 1.100))],
    "cronometro": [("c", (12, 13.500, 7.500)), ("p", "M12 13.500V9.500M9.500 3h5M18.500 6l1.200-1.200")],
    "squadra": [("cf", (8, 8, 2.800)), ("cf", (16.500, 7, 2.300)), ("pf", "M2.500 19c0-3 2.300-4.800 5.500-4.800s5.500 1.800 5.500 4.800z"), ("pf", "M14 18.500c0-2.300 1.200-3.800 3.500-3.800 2.400 0 4 1.500 4 3.800z")],
    "lampeggio": [("p", "M5 12.500 10 17.500 19 7")],
    "bandiera": [("p", "M5.500 21V4M5.500 5h12l-2.500 4 2.500 4h-12")],
    "clipboard": [("p", "M8 4.500H6.500A1.500 1.500 0 0 0 5 6v13.500A1.500 1.500 0 0 0 6.500 21h11a1.500 1.500 0 0 0 1.500-1.500V6a1.500 1.500 0 0 0-1.500-1.500H16M9 3h6v3H9zM9 13l2.200 2.200L15.500 11")],
    "cerchio-info": [("c", (12, 12, 9)), ("p", "M12 11v5.500"), ("cf", (12, 7.600, 1.050))],
})


def ring(t, cx, cy, r, w, frac, col=VERDE_S, vuoto="#E6EBF4"):
    """Anello di progresso (px ritaglio): parte dalle 12 e va in senso orario."""
    X, Y, s = t.X, t.Y, t.s
    t.cerchio(X(cx), Y(cy), s(r), fill="none", stroke=vuoto, sw=s(w), id="anello-fondo")
    a = -math.pi / 2 + 2 * math.pi * frac
    x1, y1 = cx + r * math.cos(a), cy + r * math.sin(a)
    g = t.sfumatura(["#19B877", "#0A9A5E"], 0, 0, 1, 1)
    t.path(f"M{n(X(cx))} {n(Y(cy - r))}A{n(s(r))} {n(s(r))} 0 {1 if frac > 0.5 else 0} 1 {n(X(x1))} {n(Y(y1))}", stroke=g, sw=s(w), id="anello-valore")


def spunta_tonda(t, cx, cy, r, col=VERDE_S, vuota=False, id="spunta"):
    X, Y, s = t.X, t.Y, t.s
    if vuota:
        t.cerchio(X(cx), Y(cy), s(r - 0.4), fill="#FFFFFF", stroke="#CFD7E6", sw=s(1.1), id=id)
    else:
        t.cerchio(X(cx), Y(cy), s(r), fill=col, id=id, filtro=t.ombra(s(0.6), s(2.5), col, 0.25))
        t.icona("spunta", X(cx) - s(r * 0.5), Y(cy) - s(r * 0.5), s(r), "#FFFFFF", 3.2)


def tile_icona(t, nome, x0, y0, x1, y1, col=BL, id="tile-icona", ic=None, spess=1.7):
    X, Y, s = t.X, t.Y, t.s
    t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s((x1 - x0) * 0.26), fill="#FFFFFF", id=id, filtro=t.ombra(s(0.8), s(4), "#2B6CD8", 0.13))
    d = ic or (x1 - x0) * 0.56
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    t.icona(nome, X(cx) - s(d / 2), Y(cy) - s(d / 2), s(d), col, spess)


def riga_lista(t, y, testo, x_ic, x_tx, x_chev, icona, w=None, corpo=7.4, peso=500, sep=None, x_sep=None, ic=11, col_ic="#2A3B7A"):
    X, Y, s = t.X, t.Y, t.s
    t.icona(icona, X(x_ic) - s(ic / 2), Y(y) - s(ic / 2), s(ic), col_ic, 1.6)
    tx(t, testo, x_tx, y + corpo * 0.36, w=w, corpo=corpo, peso=peso, col=NAVY)
    if x_chev:
        t.icona("chevron-destra", X(x_chev) - s(3), Y(y) - s(3.5), s(7), "#8892AB", 2.2)
    if sep is not None:
        t.linea(X(x_sep[0]), Y(sep), X(x_sep[1]), Y(sep), "#EDF1F8", 1)
