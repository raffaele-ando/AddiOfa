"""
Decorazioni vettoriali per le schermate "animazioni" (immagine 42): tessere che galleggiano, chip inclinati, scie sfocate,
coriandoli, raggi, fasce dell'arco ingrandite e pomello con anello e riflesso. Tutto in PIXEL del ritaglio (t.p converte).
Sono forme con sfumature e filtri di sfocatura (feGaussianBlur), non raster. Gli originali sono generati dall'AI: qui si
ricostruiscono composizione, colori e movimento, non ogni pennellata.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from motore import *            # noqa: F401,F403
from motore import n, Tela, ICONE   # noqa: F401
from extra import _chiaro, _scuro   # noqa: F401
from extra import testo_box     # noqa: F401
from ui import clip_rett, larghezza_testo   # noqa: F401


def rot(t, cx, cy, ang):
    return f"rotate({n(ang)} {n(t.p(cx))} {n(t.p(cy))})"


# ---------------------------------------------------------------------------- coriandoli e scie
def puntino(t, x, y, rx, ry, ang, col, op=1.0, sfoca=0.0, id=None, luce=True):
    P = t.p
    with t.gruppo(id or "coriandolo", trasforma=rot(t, x, y, ang)):
        t.ellisse(P(x), P(y), P(rx), P(ry), fill=col, opacita=op, filtro=t.sfoca(P(sfoca)) if sfoca else None)
        if luce and rx > 3:
            t.ellisse(P(x - rx * 0.25), P(y - ry * 0.3), P(rx * 0.45), P(ry * 0.3), fill="#FFFFFF", opacita=0.35 * op)


def trattino(t, x, y, lung, sp, ang, col, op=1.0, id=None, sfoca=0.0):
    """Capsula (coriandolo a trattino) centrata in (x, y), lunga `lung`, spessa `sp`, ruotata di ang gradi."""
    P = t.p
    with t.gruppo(id or "trattino", trasforma=rot(t, x, y, ang)):
        t.rett(P(x - lung / 2), P(y - sp / 2), P(lung), P(sp), P(sp / 2), fill=col, opacita=op, filtro=t.sfoca(P(sfoca)) if sfoca else None)


def rombo(t, x, y, w, h, ang, col, op=1.0, id=None, skew=0.0):
    """Quadrilatero (coriandolo rettangolare) con angoli appena arrotondati."""
    P = t.p
    with t.gruppo(id or "coriandolo-quadro", trasforma=rot(t, x, y, ang)):
        d = (f"M{n(P(x - w / 2 + skew))} {n(P(y - h / 2))}L{n(P(x + w / 2 + skew))} {n(P(y - h / 2))}L{n(P(x + w / 2 - skew))} {n(P(y + h / 2))}"
             f"L{n(P(x - w / 2 - skew))} {n(P(y + h / 2))}z")
        t.path(d, fill=col, stroke=col, sw=P(1.6), opacita=op)


def scia_curva(t, pts, w, col, op=0.6, sfoca=1.5, id=None, grad=None, estremi="round"):
    """Tratto curvo (quadratica) con punti [(x0,y0),(cx,cy),(x1,y1)] o cubica con 4 punti. Sfumatura opzionale grad=(colori, x1,y1,x2,y2)."""
    P = t.p
    if len(pts) == 3:
        d = f"M{n(P(pts[0][0]))} {n(P(pts[0][1]))}Q{n(P(pts[1][0]))} {n(P(pts[1][1]))} {n(P(pts[2][0]))} {n(P(pts[2][1]))}"
    else:
        d = f"M{n(P(pts[0][0]))} {n(P(pts[0][1]))}C" + " ".join(f"{n(P(x))} {n(P(y))}" for x, y in pts[1:])
    stroke = col
    if grad:
        cols, x1, y1, x2, y2 = grad
        stroke = t.sfumatura(cols, P(x1), P(y1), P(x2), P(y2), userspace=True)
    t.path(d, stroke=stroke, sw=P(w), opacita=op, cap=estremi, filtro=t.sfoca(P(sfoca)) if sfoca else None, id=id)


def ellisse_scia(t, cx, cy, rx, ry, ang, w, col, op=0.5, sfoca=1.2, a0=0, a1=360, id=None):
    """Arco di ellisse inclinata (vortice attorno al misuratore)."""
    P = t.p
    pts = []
    for i in range(0, 61):
        a = math.radians(a0 + (a1 - a0) * i / 60)
        x, y = rx * math.cos(a), ry * math.sin(a)
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
    d = "M" + "L".join(f"{n(P(x))} {n(P(y))}" for x, y in pts)
    t.path(d, stroke=col, sw=P(w), opacita=op, filtro=t.sfoca(P(sfoca)) if sfoca else None, id=id)


# ---------------------------------------------------------------------------- tessere con simbolo
def tessera(t, cx, cy, lato, ang, glifo, glow="#FFB4B8", id="tessera", opacita=1.0):
    """Quadrato bianco arrotondato con ombra e alone colorato, ruotato; `glifo(t, cx, cy, lato)` disegna il simbolo."""
    P = t.p
    with t.gruppo(id, trasforma=rot(t, cx, cy, ang), opacita=opacita if opacita < 1 else None):
        t.cerchio(P(cx), P(cy), P(lato * 0.82), fill=t.radiale([(0, glow, 0.55), (0.6, glow, 0.2), (1, glow, 0)], 0.5, 0.5, 0.5))
        t.rett(P(cx - lato / 2), P(cy - lato / 2), P(lato), P(lato), P(lato * 0.27), fill=t.sfumatura(["#FFFFFF", "#F8F9FD"], 0, 0, 0, 1),
               filtro=t.ombra(3, P(lato * 0.3), "#7A86B8", 0.22), id=f"{id}-corpo")
        glifo(t, cx, cy, lato)


def g_cartella(t, cx, cy, lato):
    P = t.p; s = lato
    g = t.sfumatura(["#7CB0FF", "#2F6FF0"], 0, 0, 0, 1)
    t.path(f"M{n(P(cx - s * .30))} {n(P(cy - s * .22))}h{n(P(s * .22))}l{n(P(s * .09))} {n(P(s * .09))}h{n(P(s * .29))}a{n(P(s * .05))} {n(P(s * .05))} 0 0 1 {n(P(s * .05))} {n(P(s * .05))}"
           f"v{n(P(s * .30))}a{n(P(s * .06))} {n(P(s * .06))} 0 0 1 {n(-P(s * .06))} {n(P(s * .06))}h{n(-P(s * .54))}a{n(P(s * .06))} {n(P(s * .06))} 0 0 1 {n(-P(s * .06))} {n(-P(s * .06))}v{n(-P(s * .40))}"
           f"a{n(P(s * .05))} {n(P(s * .05))} 0 0 1 {n(P(s * .05))} {n(-P(s * .05))}z", fill=g, id="glifo-cartella")
    t.rett(P(cx - s * .30), P(cy - s * .06), P(s * .6), P(s * .06), 0, fill="#FFFFFF", opacita=0.35)


def g_documento_arancio(t, cx, cy, lato):
    P = t.p; s = lato
    g = t.sfumatura(["#FFC15A", "#F79A1E"], 0, 0, 0, 1)
    t.rett(P(cx - s * .27), P(cy - s * .30), P(s * .54), P(s * .60), P(s * .07), fill=g, id="glifo-documento")
    for i, w in enumerate((.34, .34, .22)):
        t.rett(P(cx - s * .17), P(cy - s * .15 + i * s * .12), P(s * w), P(s * .05), P(s * .025), fill="#FFFFFF", opacita=0.9)
    t.rett(P(cx + s * .06), P(cy - s * .34), P(s * .22), P(s * .12), P(s * .03), fill="#FFB43A", opacita=0.0)


def g_nuvola(t, cx, cy, lato):
    """Bolla azzurra con punto rosso (icona del ragionamento)."""
    P = t.p; s = lato
    g = t.sfumatura(["#6FA6FF", "#2F6FF0"], 0, 0, 0, 1)
    t.path(f"M{n(P(cx - s * .24))} {n(P(cy + s * .06))}a{n(P(s * .13))} {n(P(s * .13))} 0 0 1 {n(P(s * .06))} {n(-P(s * .20))}a{n(P(s * .18))} {n(P(s * .18))} 0 0 1 {n(P(s * .32))} {n(-P(s * .02))}"
           f"a{n(P(s * .12))} {n(P(s * .12))} 0 0 1 {n(P(s * .08))} {n(P(s * .22))}z", fill=g, id="glifo-bolla")
    t.cerchio(P(cx + s * .12), P(cy - s * .12), P(s * .075), fill="#F0303B")
    t.cerchio(P(cx + s * .12), P(cy - s * .12), P(s * .035), fill="#FFFFFF", opacita=0.6)


def g_anello(t, cx, cy, lato):
    P = t.p
    t.cerchio(P(cx), P(cy), P(lato * 0.19), fill="none", stroke="#F0303B", sw=P(lato * 0.06))
    t.cerchio(P(cx - lato * .08), P(cy - lato * .1), P(lato * .06), fill="#FFFFFF", opacita=0.4)


def g_barre_rosse(t, cx, cy, lato):
    P = t.p; s = lato * 0.72
    g = t.sfumatura(["#FF6A72", "#EE2233"], 0, 0, 0, 1)
    for dx, ang in ((-.09, 18), (.10, 18)):
        with t.gruppo("glifo-barra", trasforma=rot(t, cx + dx * s, cy, ang)):
            t.rett(P(cx + dx * s - s * .075), P(cy - s * .27), P(s * .15), P(s * .54), P(s * .07), fill=g)


def g_tablet(t, cx, cy, lato):
    P = t.p; s = lato
    with t.gruppo("glifo-carta", trasforma=rot(t, cx, cy, -14)):
        t.rett(P(cx - s * .19), P(cy - s * .27), P(s * .38), P(s * .54), P(s * .07), fill="none", stroke="#F0452E", sw=P(s * .06))
        t.rett(P(cx - s * .13), P(cy - s * .22), P(s * .26), P(s * .10), P(s * .03), fill="#F0452E", opacita=0.35)


def g_orologio(t, cx, cy, lato):
    P = t.p; s = lato * 0.8
    t.cerchio(P(cx), P(cy), P(s * .30), fill="none", stroke="#EE1F2F", sw=P(s * .06))
    t.path(f"M{n(P(cx))} {n(P(cy - s * .17))}V{n(P(cy))}L{n(P(cx + s * .13))} {n(P(cy + s * .08))}", stroke="#EE1F2F", sw=P(s * .06))
    t.path(f"M{n(P(cx - s * .31))} {n(P(cy - s * .26))}L{n(P(cx - s * .38))} {n(P(cy - s * .32))}", stroke="#EE1F2F", sw=P(s * .0), opacita=0)


def g_puzzle(t, cx, cy, lato):
    P = t.p; k = lato * 0.56
    g = t.sfumatura(["#FFD060", "#F5A623"], 0, 0, 0, 1)
    t.add(f'<g id="glifo-puzzle" transform="translate({n(P(cx - k / 2))} {n(P(cy - k / 2))}) scale({n(P(k) / 24)})"><path d="{ICONE["puzzle"][0][1]}" fill="{g}" stroke="#F5A623" stroke-width="1.2" stroke-linejoin="round"/></g>')


# ---------------------------------------------------------------------------- chip inclinato
def chip(t, cx, cy, w, h, ang, col_fondo, col_testo, etichetta, icona, col_icona, id="chip", corpo=None):
    """Pillola inclinata con piccolo riquadro d'icona e nome (42.3)."""
    P = t.p
    with t.gruppo(id, trasforma=rot(t, cx, cy, ang)):
        t.rett(P(cx - w / 2), P(cy - h / 2), P(w), P(h), P(h / 2), fill=t.sfumatura(list(col_fondo), 0, 0, 1, 1), filtro=t.ombra(3, P(8), col_icona, 0.18), id=f"{id}-fondo")
        t.rett(P(cx - w / 2 + 1), P(cy - h / 2 + 1), P(w - 2), P(h - 2), P((h - 2) / 2), fill="none", stroke="#FFFFFF", sw=P(1), opacita=0.7)
        ix = cx - w / 2 + h * 0.52
        t.rett(P(ix - h * 0.27), P(cy - h * 0.27), P(h * 0.54), P(h * 0.54), P(h * 0.15), fill=col_icona)
        t.icona(icona, P(ix - h * 0.17), P(cy - h * 0.17), P(h * 0.34), "#FFFFFF", 2.2)
        tw = w - h * 1.1
        d = corpo or h * 0.36
        sx = min(1.0, tw / larghezza_testo(etichetta, d, 600))
        t.testo(etichetta, P(ix + h * 0.40), P(cy + d * 0.35), P(d), 600, col_testo, "start", spaziatura=0)


# ---------------------------------------------------------------------------- pomello ingrandito
def pomello(t, cx, cy, r_disco, r_anello, col, glow, op_glow=0.55, id="pomello", ombra=True):
    P = t.p
    with t.gruppo(id):
        t.cerchio(P(cx), P(cy + r_anello * 0.25), P(r_anello * 2.1), fill=t.radiale([(0, glow, op_glow), (0.5, glow, op_glow * 0.35), (1, glow, 0)], 0.5, 0.5, 0.5), id=f"{id}-alone")
        t.cerchio(P(cx), P(cy), P(r_anello), fill="#FFFFFF", filtro=t.ombra(2, P(r_anello * 0.55), col, 0.4) if ombra else None, id=f"{id}-anello")
        rd = t.radiale([(0, _chiaro(col, 0.55), 1), (0.55, col, 1), (1, _scuro(col, 0.12), 1)], 0.36, 0.30, 0.8)
        t.cerchio(P(cx), P(cy), P(r_disco), fill=rd, id=f"{id}-disco")
        t.ellisse(P(cx - r_disco * 0.3), P(cy - r_disco * 0.5), P(r_disco * 0.38), P(r_disco * 0.2), fill="#FFFFFF", opacita=0.45, filtro=t.sfoca(P(r_disco * 0.06)))


def fascia(t, pts, w, cols, x1, y1, x2, y2, op=1.0, sfoca=0.0, id="fascia", cap="butt"):
    """Fascia spessa lungo una curva (quadratica o cubica) con sfumatura lineare in coordinate assolute (x1,y1)->(x2,y2)."""
    scia_curva(t, pts, w, None, op, sfoca, id=id, grad=(cols, x1, y1, x2, y2), estremi=cap)


def sfumatura_op(t, stops, x1, y1, x2, y2):
    """Sfumatura lineare assoluta con opacità per fermata: stops = [(offset, colore, opacità)]."""
    P = t.p
    gid = t.uid("so")
    f = "".join(f'<stop offset="{n(o)}" stop-color="{c}" stop-opacity="{n(a)}"/>' for o, c, a in stops)
    t.defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{n(P(x1))}" y1="{n(P(y1))}" x2="{n(P(x2))}" y2="{n(P(y2))}">{f}</linearGradient>')
    return f"url(#{gid})"


def cuneo(t, x, y, lung, w, cx0, cy0, col, op=0.95, id="raggio"):
    """Spuntone a cuneo (largo all'esterno, stretto verso il centro (cx0, cy0)), centrato in (x, y)."""
    P = t.p
    a = math.atan2(y - cy0, x - cx0)
    ca, sa = math.cos(a), math.sin(a)
    nx, ny = -sa, ca
    xi, yi = x - ca * lung / 2, y - sa * lung / 2
    xo, yo = x + ca * lung / 2, y + sa * lung / 2
    d = (f"M{n(P(xi + nx * w * 0.18))} {n(P(yi + ny * w * 0.18))}L{n(P(xo + nx * w / 2))} {n(P(yo + ny * w / 2))}"
         f"L{n(P(xo - nx * w / 2))} {n(P(yo - ny * w / 2))}L{n(P(xi - nx * w * 0.18))} {n(P(yi - ny * w * 0.18))}z")
    t.path(d, fill=col, stroke=col, sw=P(1.4), opacita=op, id=id)
