"""
Corpi della schermata di calcolo (la parte sotto il misuratore). Tutto in PIXEL dell'originale: ogni funzione
prende la tela `t` (con t.p) e le misure, così lo stesso pezzo serve per più immagini (9, 10, 29, 42, 43).
Le righe di testo sono (stringa, x0, x1, y0, y1) = riquadro d'inchiostro misurato.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from extra import *          # noqa: F401,F403
from extra import testo_box, tessera_icona, spunta_cerchio, cerchio_vuoto, spinner, tondo_rosso, Tela, n, KIT  # noqa: F401

NAVY = "#0C1446"
SOTTO = "#4B5F91"
ETICHETTA = "#3C4F82"
ROSA = "#FDEBEC"
ROSSO_AZ = "#F22B36"


def riga(t: Tela, r, peso=400, colore=ETICHETTA, ancora="start", id=None):
    P = t.p
    s, x0, x1, y0, y1 = r
    return testo_box(t, s, P(x0), P(x1), P(y0), P(y1), peso, colore, ancora, id=id)


def scheda(t: Tela, x0, y0, x1, y1, r=14, fill="#F2F6FC", id="scheda", bordo=None, ombra=False, opacita=None):
    P = t.p
    t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P(r), fill=fill, id=id, stroke=bordo, sw=P(0.8) if bordo else 1, opacita=opacita,
           filtro=t.ombra(2, P(8), "#3B5BA8", 0.07) if ombra else None)


# ---------------------------------------------------------------------------- elenco dei passi (Grammatica…)
def corpo_passi(t: Tela, voci, cx_icona, r_icona, x_card=None, y_card=None, kit="blu", titolo=None):
    """voci: [(stato, riquadro_testo, y_centro)], stato in {'fatto','vuoto','corso'}."""
    P = t.p
    with t.gruppo("elenco-passi"):
        if x_card:
            scheda(t, *x_card, r=16, fill="#F1F5FC", id="scheda-passi")
        if titolo:
            riga(t, titolo, 600, "#14246A", id="titolo-passi")
        for i, (stato, rt, yc) in enumerate(voci):
            if stato == "fatto":
                spunta_cerchio(t, P(cx_icona), P(yc), P(r_icona), kit, id=f"passo-{i + 1}-fatto")
            elif stato == "corso":
                spinner(t, P(cx_icona), P(yc), P(r_icona), id=f"passo-{i + 1}-in-corso")
            else:
                cerchio_vuoto(t, P(cx_icona), P(yc), P(r_icona), id=f"passo-{i + 1}-da-fare")
            riga(t, rt, 400, ETICHETTA, id=f"passo-{i + 1}-testo")


# ---------------------------------------------------------------------------- barre per area (Grammatica 80 %…)
def corpo_aree(t: Tela, titolo, righe, x_card=None):
    """righe: dict(icona, aa?, y_tessera, lato, cx, testo, barra=(x0,x1,y,h,pieno), pct=testo riquadro)."""
    P = t.p
    with t.gruppo("aree-analizzate"):
        if x_card:
            scheda(t, *x_card, r=16, fill="#F1F5FC", id="scheda-aree")
        if titolo:
            riga(t, titolo, 600, "#14246A", id="titolo-aree")
        for i, r in enumerate(righe):
            with t.gruppo(f"area-{i + 1}"):
                tessera_icona(t, r["icona"], P(r["cx"]), P(r["cy"]), P(r["lato"]), "#2F6FF0", 1.9, aa=r.get("aa", False))
                riga(t, r["testo"], 400, ETICHETTA, id=f"area-{i + 1}-nome")
                bx0, bx1, by, bh, fr = r["barra"]
                barra_px(t, bx0, bx1, by, bh, fr, ("#6AA4FB", "#2F6FF0"), "#E4ECF8")
                riga(t, r["pct"], 600, "#14246A", id=f"area-{i + 1}-percentuale")


def barra_px(t: Tela, x0, x1, y, h, fr, col, track="#E8EDF6", id=None):
    P = t.p
    t.rett(P(x0), P(y - h / 2), P(x1 - x0), P(h), P(h / 2), fill=track)
    w = (x1 - x0) * fr
    t.rett(P(x0), P(y - h / 2), P(w), P(h), P(h / 2), fill=t.sfumatura(list(col), 0, 0, 1, 0), id=id)


# ---------------------------------------------------------------------------- fattori considerati
def corpo_fattori(t: Tela, titolo, righe, info=None):
    """righe: dict(icona, colore, cx, cy, lato, testo, barra=(x0,x1,y,h,pieno,(c1,c2),track), dx=[riquadri di testo a destra])."""
    P = t.p
    with t.gruppo("fattori-considerati"):
        if titolo:
            riga(t, titolo, 700, NAVY, id="titolo-fattori")
        for i, r in enumerate(righe):
            with t.gruppo(f"fattore-{i + 1}"):
                tessera_icona(t, r["icona"], P(r["cx"]), P(r["cy"]), P(r["lato"]), r["colore"], 1.9, alone=r.get("alone"))
                riga(t, r["testo"], 400, ETICHETTA, id=f"fattore-{i + 1}-nome")
                bx0, bx1, by, bh, fr, col, track = r["barra"]
                barra_px(t, bx0, bx1, by, bh, fr, col, track)
                for j, d in enumerate(r["dx"]):
                    riga(t, d, 400 if j == 0 and len(r["dx"]) > 1 else 400, ETICHETTA, id=f"fattore-{i + 1}-valore-{j + 1}")
        if info:
            scheda(t, *info["card"], r=16, fill="#F1F5FC", id="scheda-info")
            lampadina(t, P(info["cx"]), P(info["cy"]), P(info["lato"]))
            for j, rt in enumerate(info["righe"]):
                riga(t, rt, 400, ETICHETTA, id=f"info-{j + 1}")


def lampadina(t: Tela, cx, cy, lato):
    with t.gruppo("lampadina"):
        t.cerchio(cx, cy, lato * 0.9, fill=t.radiale([(0, "#FFC247", 0.45), (1, "#FFC247", 0)], 0.5, 0.5, 0.5))
        g = t.sfumatura(["#FFD76A", "#F9A31B"], 0, 0, 0, 1)
        # bulbo
        t.path(f"M{n(cx)} {n(cy - lato * 0.46)}a{n(lato * 0.30)} {n(lato * 0.30)} 0 0 0 {n(-lato * 0.19)} {n(lato * 0.56)}"
               f"c{n(lato * 0.07)} {n(lato * 0.07)} {n(lato * 0.10)} {n(lato * 0.15)} {n(lato * 0.10)} {n(lato * 0.26)}h{n(lato * 0.18)}"
               f"c0-{n(lato * 0.11)} {n(lato * 0.03)}-{n(lato * 0.19)} {n(lato * 0.10)}-{n(lato * 0.26)}"
               f"a{n(lato * 0.30)} {n(lato * 0.30)} 0 0 0 {n(-lato * 0.19)} {n(-lato * 0.56)}z", fill=g, stroke="none")
        t.rett(cx - lato * 0.14, cy + lato * 0.38, lato * 0.28, lato * 0.07, lato * 0.035, fill="#E8921A")
        t.rett(cx - lato * 0.10, cy + lato * 0.48, lato * 0.20, lato * 0.07, lato * 0.035, fill="#E8921A")
        for a in (-90, -40, -140, 0, 180):
            pass
        for ang in (-150, -110, -70, -30):
            a = math.radians(ang)
            t.linea(cx + lato * 0.46 * math.cos(a), cy - lato * 0.12 + lato * 0.46 * math.sin(a),
                    cx + lato * 0.60 * math.cos(a), cy - lato * 0.12 + lato * 0.60 * math.sin(a), "#F6B73C", max(0.8, lato * 0.045))


# ---------------------------------------------------------------------------- avviso + istogramma
def avviso(t: Tela, card, cx, cy, r, righe, fill=ROSA, id="avviso-rischio"):
    P = t.p
    with t.gruppo(id):
        scheda(t, *card, r=16, fill=fill, id=f"{id}-scheda")
        t.cerchio(P(cx), P(cy), P(r), fill=t.sfumatura(["#FF5560", "#EE2233"], 0.2, 0, 0.8, 1), filtro=t.ombra(1.5, P(r) * 0.6, "#F22B36", 0.3), id=f"{id}-icona")
        t.rett(P(cx) - P(r) * 0.11, P(cy) - P(r) * 0.52, P(r) * 0.22, P(r) * 0.62, P(r) * 0.11, fill="#FFFFFF")
        t.cerchio(P(cx), P(cy) + P(r) * 0.42, P(r) * 0.13, fill="#FFFFFF")
        for j, rt in enumerate(righe):
            riga(t, rt, 400, "#2B3C6E", id=f"{id}-testo-{j + 1}")


def istogramma(t: Tela, x0, x1, ybase, altezze, sel, tag, larg=None, gap=None, fondo=None, id="istogramma"):
    """altezze: 9 valori in px; i primi `sel` sono azzurri sfumati, sel=rosso pieno, dopo rosa. tag: (cx_tu, y_tu)."""
    P = t.p
    nb = len(altezze)
    if larg is None:
        larg = (x1 - x0) / (nb + (nb - 1) * 0.55)
    gap = (x1 - x0 - larg * nb) / (nb - 1)
    with t.gruppo(id):
        for i, h in enumerate(altezze):
            x = x0 + i * (larg + gap)
            if i < sel:
                g = t.sfumatura(["#CFE0FB", "#A9C7F8"] if h > 20 else ["#C2D8FA", "#9FC0F6"], 0, 0, 0, 1)
            elif i == sel:
                g = t.sfumatura(["#FF4452", "#E81B2B"], 0, 0, 0, 1)
            else:
                g = t.sfumatura(["#FFB6BB", "#FF9AA2"], 0, 0, 0, 1)
            t.rett(P(x), P(ybase - h), P(larg), P(h), P(larg * 0.28), fill=g, id=f"barra-{i + 1}",
                   filtro=t.ombra(1.5, P(4), "#E81B2B", 0.25) if i == sel else None)
        # tag "Tu"
        xs = x0 + sel * (larg + gap) + larg / 2
        hs = altezze[sel]
        return xs, ybase - hs


def tag_tu(t: Tela, cx, y_top, w=18, h=14, y_testo=None):
    P = t.p
    with t.gruppo("tag-tu"):
        t.rett(P(cx - w / 2), P(y_top - h - 4), P(w), P(h), P(4), fill="#FFFFFF", filtro=t.ombra(1.5, P(5), "#3B5BA8", 0.18))
        t.path(f"M{n(P(cx - 2.2))} {n(P(y_top - 4.2))}L{n(P(cx))} {n(P(y_top - 1.2))}L{n(P(cx + 2.2))} {n(P(y_top - 4.2))}z", fill="#E81B2B")
        t.testo("Tu", P(cx), P(y_top - h + 8.5), P(h * 0.62), 600, NAVY, "middle")


def legenda(t: Tela, voci):
    """voci: (colore, cx, cy, r, riquadro_testo)."""
    P = t.p
    with t.gruppo("legenda"):
        for c, cx, cy, r, rt in voci:
            t.cerchio(P(cx), P(cy), P(r), fill=c, filtro=t.ombra(1, P(3), c, 0.25))
            riga(t, rt, 400, ETICHETTA)


# ---------------------------------------------------------------------------- costi + pulsanti (risultato finale)
def corpo_costi(t: Tela, card, righe, cx_ic, r_ic, icone):
    P = t.p
    with t.gruppo("conseguenze"):
        scheda(t, *card, r=16, fill=ROSA, id="scheda-conseguenze")
        for i, (rt, yc) in enumerate(righe):
            tondo_rosso(t, icone[i], P(cx_ic), P(yc), P(r_ic), id=f"conseguenza-{i + 1}-icona")
            riga(t, rt, 400, "#2B3C6E", id=f"conseguenza-{i + 1}-testo")


def pulsanti_fine(t: Tela, prim, sec, testo_prim, testo_sec, freccia, libro):
    """prim/sec = (x0, y0, x1, y1). testo = riquadri. freccia = (x, y, w); libro = (x, y, lato)."""
    P = t.p
    with t.gruppo("pulsante-continua"):
        x0, y0, x1, y1 = prim
        t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P((y1 - y0) * 0.22), fill=t.sfumatura(["#FF3B49", "#F2202F"]), id="pulsante-primario",
               filtro=t.ombra(3, P(10), "#F22B36", 0.25))
        riga(t, testo_prim, 600, "#FFFFFF")
        fx, fy, fw = freccia
        t.icona("freccia-destra", P(fx), P(fy - fw / 2), P(fw), "#FFFFFF", 2.0)
    with t.gruppo("pulsante-scopri"):
        x0, y0, x1, y1 = sec
        t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P((y1 - y0) * 0.22), fill="#FBFCFF", stroke="#D6DFEE", sw=P(1.2), id="pulsante-secondario")
        riga(t, testo_sec, 500, "#1B2A66")
        lx, ly, ls = libro
        t.icona("libro", P(lx), P(ly - ls / 2), P(ls), "#1B2A66", 1.7)
