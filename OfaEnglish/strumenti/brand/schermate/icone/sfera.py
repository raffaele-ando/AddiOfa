"""
Icone sfera (immagine 44, "icone-sfera"): 14 oggetti 3D dentro una sfera di vetro chiaro.

    python3 strumenti/brand/schermate/icone/sfera.py

Scrive brand/concept-svg/icone/sfera/<nome>.svg (viewBox 272x272, origine al centro della sfera, raggio 122,5 come
nell'originale 1:1 in pixel), _set.svg (le 14 affiancate), icone-sfera.svg (le 14 con le etichette in Inter, come
il layout dell'originale 2172x724) e _tavola.png (32/64/128 px su chiaro e scuro).

Cosa corregge dell'originale (immagine AI):
- quiz: la lettera B era un segno storto rosso senza senso -> casella rossa con "B" vera (A, B, C);
- edificio: asimmetrico, con colonne alternate bianche/blu a caso e una "faccia" laterale impossibile -> tempio frontale
  simmetrico (timpano, trabeazione, 5 colonne, due gradini); è un'istituzione generica, niente stemmi;
- moneta: bordo spostato e anelli non concentrici -> moneta con faccia + spessore, "€" vero (glifo Inter);
- bersaglio/dardo: dardo storto con penne di forme diverse -> dardo dritto, due penne uguali, centro sul bullseye;
- globo: continenti a macchie -> continenti veri (stessa proiezione di mondo_internazionale.py), orbita con la parte
  dietro nascosta, aereo disegnato;
- libri: stessi oggetti delle illustrazioni (oggetti.libro, oggetti.bandiera_uk con diagonali rosse sfalsate);
- telefono, cappello, persone, fumetti, lucchetto: simmetrie costruite (stesso raggio dei raccordi, stesse penne, puntini
  allineati, terzo puntino del fumetto blu non coperto dal fumetto bianco);
- sfera: bordo a due anelli, riflesso, alone e ombra di contatto tutti uguali (nell'originale cambiano da sfera a sfera);
- etichette: "AddiOFA" aveva una O sbarrata (errore AI) -> testo normale.

Misure: centri e dimensioni misurati sull'originale (sfera r=122,5; oggetti in px dell'immagine 44, coordinate relative
al centro della sfera); toni campionati sulle zone pulite (blu #0057FC, giallo #FEB823, rosso #F8334F).
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from base import Svg, V, arrotondato, polare, ruota, pt, n, set_svg, tavola, USCITA, TMP, RADICE  # noqa: E402
from oggetti import libro, bandiera_uk  # noqa: E402
from oggetti_a import liscio  # noqa: E402
import mondo_internazionale as mondo  # noqa: E402

DEST = USCITA / "sfera"
R = 122.5
LATO = 272

# ------------------------------------------------------------------------------------------- tavolozza
BLU = "#0057FC"          # blu pieno dell'originale (campionato: 0,84..87,252)
BLU_SC = "#0041D1"
BLU_SC2 = "#0034AF"
BLU_CH = "#3D86FD"
BLU_CH2 = "#7FB0FE"
PALLIDO = "#E1EBFD"
PALLIDO2 = "#F4F8FE"
ROSSO = "#F8334F"
ROSSO_CH = "#FF5D70"
ROSSO_SC = "#D91E3C"
GIALLO = "#FEB823"
GIALLO_CH = "#FFD04F"
BIANCO = "#FFFFFF"
INK = "#0F172A"
OMBRA = "#1D4ED8"


# ------------------------------------------------------------------------------------------- sfera di vetro
def sfera(s: Svg):
    """Sfera di vetro: alone, disco con gradiente chiaro (più azzurro in basso a destra), banda interna di luce,
    due anelli di bordo, riflesso. Tutto in funzione di R."""
    s.apri("sfera-vetro")
    s.cerchio(0, 0, R + 13, fill=s.rad([(0.0, "#9DBBF6", 0.0), (0.86, "#9DBBF6", 0.0), (0.905, "#9DBBF6", 0.16), (1, "#9DBBF6", 0)], 0, 0, R + 13), id="alone")
    s.cerchio(0, 0, R, fill=s.rad([(0, "#FCFDFF"), (0.5, "#F6F9FE"), (0.82, "#EEF4FE"), (1, "#E4EDFD")], -25, -30, R * 1.15), id="disco")
    s.cerchio(0, 0, R, fill=s.rad([(0.55, "#78AAFA", 0), (1, "#78AAFA", 0.20)], 38, 52, R * 1.0), id="disco-azzurro")
    s.cerchio(0, 0, R - 5.5, fill="none", stroke="#FFFFFF", sw=7, opacita=0.55, id="banda-luce")
    s.cerchio(0, 0, R - 11, fill="none", stroke="#C8DBFB", sw=1, opacita=0.8, id="anello-interno")
    s.cerchio(0, 0, R, fill="none", stroke="#B9D0F9", sw=1.7, id="bordo")
    s.cerchio(0, 0, R + 2.6, fill="none", stroke="#E3ECFD", sw=1, id="bordo-esterno")
    s.chiudi()


def riflesso_sfera(s: Svg):
    """Filo di luce sul bordo in alto a sinistra e riflesso morbido: sopra gli oggetti (il vetro è davanti)."""
    a0, a1 = polare(0, 0, R - 5.5, 196), polare(0, 0, R - 5.5, 262)
    s.path(f"M{pt(a0)} A{n(R - 5.5)} {n(R - 5.5)} 0 0 1 {pt(a1)}", stroke="#FFFFFF", sw=3.2, opacita=0.9, id="riflesso-bordo")
    b0, b1 = polare(0, 0, R - 5.5, 18), polare(0, 0, R - 5.5, 62)
    s.path(f"M{pt(b0)} A{n(R - 5.5)} {n(R - 5.5)} 0 0 1 {pt(b1)}", stroke="#FFFFFF", sw=2, opacita=0.55, id="riflesso-bordo-2")
    cid = s.clip(cerchio=(0, 0, R - 1))
    s.apri("riflesso-morbido", clip=cid)
    s.ellisse(-52, -78, 56, 20, fill=s.lin([(0, "#FFFFFF", 0.35), (1, "#FFFFFF", 0)], -80, -90, -30, -60), extra='transform="rotate(-38 -52 -78)"')
    s.chiudi()


def ombra_contatto(s: Svg, cx, cy, rx, ry, colore=OMBRA, op=0.22, dev=5, id="ombra"):
    s.ellisse(cx, cy, rx, ry, fill=colore, opacita=op, filtro=s.sfoca(dev), id=id)


def gradiente_v(s: Svg, y0, y1, c0, c1, x=0):
    return s.lin([(0, c0), (1, c1)], x, y0, x, y1)


# ------------------------------------------------------------------------------------------- 1. AddiOFA: la stella
def stella4(cx, cy, rx, ry, k=0.40, d=0.04):
    """Stella a quattro punte con i lati concavi (quattro cubiche): punte in alto/destra/basso/sinistra.
    k = quanto i controlli si avvicinano al centro (più alto = lati più incavati), d = piccola spinta verso la punta vicina."""
    C = V(cx, cy)
    T = [V(cx, cy - ry), V(cx + rx, cy), V(cx, cy + ry), V(cx - rx, cy)]
    out = f"M{pt(T[0])}"
    for i in range(4):
        a, b = T[i], T[(i + 1) % 4]
        k1 = a + (C - a) * k + (b - C) * d
        k2 = b + (C - b) * k + (a - C) * d
        out += f" C{pt(k1)} {pt(k2)} {pt(b)}"
    return out + " Z"


def ogg_addiofa(s: Svg):
    g = s.lin([(0, "#1A68FF"), (1, "#004FF0")], 0, -70, 0, 74)
    s.path(stella4(0, 3, 67, 68, k=0.46), fill=g, stroke=g, sw=2.2, id="stella")


# ------------------------------------------------------------------------------------------- 2. Studio: libri e bandiera
def ogg_studio(s: Svg):
    ombra_contatto(s, -4, 88, 88, 7, op=0.2, dev=5)
    ombra_contatto(s, 13, 8, 22, 6, op=0.22, dev=3, id="ombra-bandiera")
    M = "translate(-3 9) scale(1.19) translate(-112 -82)"
    col = {"chiaro": "#6AA3FB", "base": "#3C7DF3", "scuro": "#1B50D2", "pagine": "#EEF2FA", "righe": "#DCE4F4"}
    u, v = V(73, -28), V(-77, -34)
    s.apri("libri", trasforma=M)
    for nome, F, sp in (("libro-sotto", V(114, 121), 24), ("libro-sopra", V(114, 97), 22)):
        d, c = libro(nome, F, u, v, sp, col)
        s.defs.append(d); s.add(c)
    s.chiudi()
    d, c = bandiera_uk("bandiera", (1, -0.194, 0.08, 1, 85, 33), 72, 48, blu="#1D4ED8", rosso="#EF3B4A", raggio=3)
    s.defs.append(d)
    s.apri("bandiera-posata", trasforma=M)
    s.add(c)
    s.chiudi()


# ------------------------------------------------------------------------------------------- 3. Quiz
def ogg_quiz(s: Svg):
    W, H = 138, 156
    s.apri("foglio-quiz", trasforma="translate(6.5 3.5) rotate(11) scale(1.08)")
    s.rett(-W / 2 + 2, -H / 2 + 12, W, H, 14, fill="#5B8DEF", opacita=0.30, filtro=s.sfoca(8), id="ombra-foglio")
    s.rett(-W / 2, -H / 2, W, H, 14, fill=s.lin([(0, "#FFFFFF"), (0.6, "#F7F9FE"), (1, "#E4EDFC")], -50, -78, 40, 78), id="foglio")
    s.rett(-W / 2 + 0.6, -H / 2 + 0.6, W - 1.2, H - 1.2, 13.4, fill="none", stroke="#FFFFFF", sw=1.2, id="foglio-bordo")
    righe = [("A", BLU, (-46)), ("B", ROSSO, 0), ("C", BLU, 46)]
    for lettera, colore, y in righe:
        if colore == ROSSO:
            g = s.lin([(0, "#FF5468"), (1, "#E81E3C")], 0, y - 15, 0, y + 15)
        else:
            g = s.lin([(0, "#5FA3FF"), (1, "#2C69F0")], 0, y - 15, 0, y + 15)
        s.rett(-56, y - 15, 30, 30, 7, fill=g, id=f"casella-{lettera.lower()}")
        s.testo(lettera, -41, y + 7.2, 21, 700, "#FFFFFF", "middle", id=f"lettera-{lettera.lower()}")
        s.rett(-12, y - 13, 68, 9, 4.5, fill="#DCE6FB", id=f"riga-{lettera.lower()}-1")
        s.rett(-12, y + 3, 36, 9, 4.5, fill="#E6EDFC", id=f"riga-{lettera.lower()}-2")
    s.chiudi()


# ------------------------------------------------------------------------------------------- 4. Risultati
def ogg_risultati(s: Svg):
    ombra_contatto(s, -4, 72, 72, 6, op=0.18, dev=5)
    s.rett(-78, -52, 148, 118, 20, fill="#5B8DEF", opacita=0.2, filtro=s.sfoca(7), extra='transform="translate(0 8)"', id="ombra-scheda")
    s.rett(-80, -54, 150, 120, 20, fill=s.lin([(0, "#FFFFFF"), (1, "#EDF2FC")], -60, -54, 40, 66), id="scheda")
    s.rett(-79.4, -53.4, 148.8, 118.8, 19.4, fill="none", stroke="#FFFFFF", sw=1.2, id="scheda-bordo")
    barre = [(-52, 31.5), (-21, 57), (10, 87)]
    g = s.lin([(0, "#2272FF"), (1, "#0050EE")], 0, -44, 0, 44)
    for i, (x, h) in enumerate(barre):
        s.rett(x, 43.5 - h, 21, h, 6, fill=g, id=f"barra-{i + 1}")
    # badge con freccia in su a destra
    s.cerchio(60, 30, 29, fill="#1D4ED8", opacita=0.35, filtro=s.sfoca(5), extra='transform="translate(0 4)"', id="ombra-badge")
    s.cerchio(60, 30, 28.5, fill=s.lin([(0, "#3F8BFF"), (1, "#0A55EF")], 50, 2, 70, 58), id="badge")
    s.cerchio(60, 30, 28, fill="none", stroke="#FFFFFF", sw=1, opacita=0.35)
    s.path("M52 38 L68 22 M58.5 21.5 H68.5 V31.5", stroke="#FFFFFF", sw=5, id="freccia")


# ------------------------------------------------------------------------------------------- 5. Tips: cappello di laurea
def ogg_tips(s: Svg):
    cx, cy, rx, ry = 0, -15, 84, 43
    ombra_contatto(s, -14, 64, 62, 8, op=0.28, dev=7, id="ombra-cappello")
    # calotta (sotto il piano)
    calotta = (f"M-47 {cy + 10} V30 C-47 46 -26 56 0 56 C26 56 47 46 47 30 V{cy + 10} Z")
    s.path(calotta, fill=s.lin([(0, "#0A4FDD"), (0.6, "#0037B5"), (1, "#002C9A")], -47, 0, 47, 60), id="calotta")
    s.path(f"M-47 {cy + 12} V30 C-47 46 -26 56 0 56", stroke="#FFFFFF", sw=1, opacita=0.0)
    # piano (mortarboard): rombo con angoli morbidi
    rombo = [V(cx, cy - ry), V(cx + rx, cy), V(cx, cy + ry), V(cx - rx, cy)]
    s.path(arrotondato(rombo, [5, 7, 5, 7]), fill=s.lin([(0, "#3E8BFF"), (0.55, "#0A5BF5"), (1, "#0047D8")], -50, -58, 50, 30), id="piano")
    # spessore del piano (bordo davanti)
    s.path(arrotondato(rombo, [5, 7, 5, 7]), fill="#0036B8", extra='transform="translate(0 6)"', id="spessore-piano")
    s.path(arrotondato(rombo, [5, 7, 5, 7]), fill=s.lin([(0, "#4A93FF"), (0.5, "#0B5CF6"), (1, "#0048DB")], -50, -58, 50, 30), id="piano-sopra")
    # filo di luce sul lato in alto a sinistra
    s.path(f"M{-rx + 6} {cy - 3} L{-4} {cy - ry + 3}", stroke="#FFFFFF", sw=1.4, opacita=0.55, id="filo-luce")
    # bottone e cordoncino con nappa
    s.cerchio(0, cy + 1, 4.6, fill="#0036B8", id="bottone")
    s.cerchio(-1, cy, 2.2, fill="#5FA0FF", opacita=0.8)
    s.path(f"M0 {cy + 1} Q34 {cy + 2} 66 {cy + 6}", stroke="#4D93FF", sw=3.4, id="cordoncino")
    s.path(f"M66 {cy + 6} V22", stroke="#0A55E8", sw=3.4, id="cordoncino-giu")
    s.path(arrotondato([V(61, 20), V(71, 20), V(72.5, 52), V(59.5, 52)], [2, 2, 5, 5]), fill=s.lin([(0, "#2F78F5"), (1, "#0042CC")], 60, 20, 72, 52), id="nappa")


# ------------------------------------------------------------------------------------------- 6. Consigli: lampadina
def ogg_consigli(s: Svg):
    cy, rb = -14, 45
    ombra_contatto(s, 0, 88, 34, 4.5, op=0.18, dev=4)
    # raggi: 5, a 0 / ±45 / ±90 gradi, uguali
    for k, ang in enumerate((-90, -45, 0, 45, 90)):
        a = ang - 90
        p0, p1 = polare(0, cy, 60, a), polare(0, cy, 80, a)
        s.barra(p0, p1, 8.5, "#FFC02B", id=f"raggio-{k + 1}")
    # bulbo + collo: sagoma unica
    d = (f"M-17 36 C-17 24 -26 16 -35 6 C-47 -6 -50 -16 -45 -30 C-37 -50 -20 -58 0 -58 C20 -58 37 -50 45 -30 "
         f"C50 -16 47 -6 35 6 C26 16 17 24 17 36 Z")
    s.path(d, fill=s.lin([(0, "#FFC631"), (0.55, "#FFB41E"), (1, "#FFCA55")], 0, -58, 0, 38), id="bulbo")
    s.path("M-33 -39 C-28 -48 -20 -53 -10 -55", stroke="#FFFFFF", sw=3.6, opacita=0.6, id="riflesso-bulbo")
    # filamento: due gambe + arco, bianco
    s.path("M-7 38 V6 C-7 -5 -17 -9 -17 -22 M7 38 V6 C7 -5 17 -9 17 -22 M-7 6 Q0 -8 7 6", stroke="#FFFFFF", sw=3.8, opacita=0.95, id="filamento")
    # attacco: due anelli blu e punta
    s.path(arrotondato([V(-22, 38), V(22, 38), V(22, 51), V(-22, 51)], [3, 3, 5, 5]), fill=s.lin([(0, "#2F7BFF"), (1, "#0050E6")], 0, 38, 0, 51), id="attacco-1")
    s.path(arrotondato([V(-19, 53), V(19, 53), V(19, 64), V(-19, 64)], [3, 3, 5, 5]), fill=s.lin([(0, "#1B66F6"), (1, "#0042CF")], 0, 53, 0, 64), id="attacco-2")
    s.path("M-10 66 H10 C10 76 5 80 0 80 C-5 80 -10 76 -10 66 Z", fill=BLU_SC, id="attacco-punta")


# ------------------------------------------------------------------------------------------- 7. App: telefono con stella
def ogg_app(s: Svg):
    W, H = 106, 178
    ombra_contatto(s, -4, 98, 46, 6, op=0.2, dev=5)
    s.apri("telefono", trasforma="translate(2 8) rotate(12)")
    s.rett(-W / 2 + 7, -H / 2 + 3, W, H, 22, fill="#08287E", id="spessore-lato")
    s.rett(-W / 2, -H / 2, W, H, 22, fill=s.lin([(0, "#2A62E2"), (1, "#123C9C")], -50, -88, 50, 88), id="telaio")
    s.rett(-W / 2 + 0.7, -H / 2 + 0.7, W - 1.4, H - 1.4, 21.3, fill="none", stroke="#6EA3FF", sw=1, opacita=0.7, id="telaio-filo")
    s.rett(W / 2 + 3.5, -26, 3, 20, 1.5, fill="#0A3AB5", id="tasto-lato")
    s.rett(-W / 2 + 5, -H / 2 + 5, W - 10, H - 10, 17, fill=s.lin([(0, "#8EB8FD"), (0.45, "#488DFE"), (1, "#2371FE")], 0, -84, 0, 84), id="schermo")
    s.rett(-W / 2 + 5, 38, W - 10, 46, 17, fill="#FFFFFF", opacita=0.07, id="schermo-fascia")
    s.rett(-14, -H / 2 + 8, 28, 7.5, 3.75, fill="#16409F", id="tacca")
    s.path(mondo_star(0, -2, 25, 25), fill="#FFFFFF", stroke="#FFFFFF", sw=1.6, id="stella")
    s.path("M-40 -70 L-10 -80 L-36 10 Z", fill="#FFFFFF", opacita=0.07, id="riflesso-schermo")
    s.chiudi()


def mondo_star(cx, cy, rx, ry):
    return stella4(cx, cy, rx, ry)


# ------------------------------------------------------------------------------------------- 8. Polimi: edificio a colonne
def ogg_polimi(s: Svg):
    ombra_contatto(s, 0, 80, 92, 7, op=0.25, dev=6)
    ch, sc, ombr = "#FFFFFF", "#E1EBFD", "#C4D6FA"
    gv = s.lin([(0, "#FFFFFF"), (1, "#DCE7FC")], 0, -80, 0, 80)
    # gradini
    s.path(arrotondato([V(-84, 62), V(84, 62), V(84, 78), V(-84, 78)], [3, 3, 4, 4]), fill=s.lin([(0, "#F3F7FF"), (1, "#D3E2FB")], 0, 62, 0, 78), id="gradino-2")
    s.path(arrotondato([V(-76, 48), V(76, 48), V(76, 62), V(-76, 62)], [3, 3, 2, 2]), fill=s.lin([(0, "#FFFFFF"), (1, "#DBE7FC")], 0, 48, 0, 62), id="gradino-1")
    # vano scuro tra le colonne
    s.rett(-68, -18, 136, 66, 0, fill=s.lin([(0, "#1560FA"), (1, "#0A45D6")], 0, -18, 0, 48), id="vano")
    # colonne: 5, larghezza 20, passo 29 (vani blu stretti di 9)
    for i in range(5):
        x = -67 + i * 29.5
        g = s.lin([(0, "#FFFFFF"), (0.55, "#F2F6FF"), (1, "#C9DBFA")], x, 0, x + 18, 0)
        s.rett(x, -18, 18, 66, 0, fill=g, id=f"colonna-{i + 1}")
        s.rett(x - 2.5, -20, 23, 5.5, 2, fill="#FFFFFF", id=f"capitello-{i + 1}")
        s.rett(x - 2.5, 42.5, 23, 5.5, 2, fill="#F1F6FF", id=f"base-{i + 1}")
        s.linea(x + 5.5, -12, x + 5.5, 42, "#DCE8FC", 0.9, opacita=0.8)
    # trabeazione + cornice
    s.path(arrotondato([V(-72, -36), V(72, -36), V(72, -18), V(-72, -18)], [2, 2, 2, 2]), fill=s.lin([(0, "#FFFFFF"), (1, "#DDE8FC")], 0, -36, 0, -18), id="architrave")
    s.path(arrotondato([V(-84, -46), V(84, -46), V(84, -34), V(-84, -34)], [3, 3, 3, 3]), fill=s.lin([(0, "#FFFFFF"), (1, "#D9E5FC")], 0, -46, 0, -34), id="cornice")
    # timpano
    s.path(arrotondato([V(-82, -47), V(0, -82), V(82, -47)], [5, 6, 5]), fill=gv, id="timpano")
    s.path(arrotondato([V(-60, -51), V(0, -74), V(60, -51)], [3, 4, 3]), fill=s.lin([(0, "#E4EDFE"), (1, "#F5F8FF")], 0, -74, 0, -51), id="timpano-interno")
    s.cerchio(0, -60, 5.2, fill="#CFDEFB", id="ornamento")
    s.path("M-80 -48 L-2 -80", stroke="#FFFFFF", sw=1.4, opacita=0.9, id="filo-luce")


# ------------------------------------------------------------------------------------------- 9. OFA: lucchetto con scintille
def ogg_ofa(s: Svg):
    cx = -5
    ombra_contatto(s, cx, 82, 56, 6, op=0.25, dev=5)
    # arco a U di spessore costante
    s.path(f"M{cx - 25} -12 V-37 A25 25 0 0 1 {cx + 25} -37 V-12", stroke=s.lin([(0, "#1E69F7"), (1, "#0048D8")], cx - 35, -70, cx + 35, -10), sw=20, cap="butt", id="arco")
    s.path(f"M{cx - 25} -37 A25 25 0 0 1 {cx + 25} -37", stroke="#FFFFFF", sw=1.4, opacita=0.0)
    # corpo
    s.rett(cx - 56, -16, 112, 95, 16, fill=s.lin([(0, "#3B88FE"), (0.5, "#0D5CF8"), (1, "#0046D6")], cx - 56, -16, cx + 40, 79), id="corpo")
    s.rett(cx - 55.4, -15.4, 110.8, 93.8, 15.4, fill="none", stroke="#FFFFFF", sw=1.3, opacita=0.35, id="corpo-filo")
    # buco della chiave: cerchio + trapezio
    s.cerchio(cx, 22, 9.5, fill="#EAF1FF", id="chiave-cerchio")
    s.path(f"M{cx - 4} 27 H{cx + 4} L{cx + 7.5} 51 Q{cx + 7.5} 53 {cx + 5.5} 53 H{cx - 5.5} Q{cx - 7.5} 53 {cx - 7.5} 51 Z", fill="#EAF1FF", id="chiave-fessura")
    # scintille rosse (due, uguali)
    for k, (a, r0) in enumerate(((-52, 66), (-17, 66))):
        p0 = polare(cx + 14, -40 + 24, 0, 0)
        c0 = V(cx + 8, -18)
        s.barra(polare(c0.x, c0.y, r0 - 6 + 2 * k, a), polare(c0.x, c0.y, r0 + 18 + 2 * k, a), 8.5, ROSSO, id=f"scintilla-{k + 1}")


# ------------------------------------------------------------------------------------------- 10. Costi: moneta
def ogg_costi(s: Svg):
    cx, cy, r = -4, 10, 71
    ombra_contatto(s, 2, 86, 62, 7, op=0.3, dev=6)
    s.cerchio(cx + 5, cy + 6, r, fill=s.lin([(0, "#8FB4FA"), (1, "#2F6AEE")], cx - 40, cy - 40, cx + 40, cy + 80), id="spessore")
    s.cerchio(cx, cy, r, fill=s.lin([(0, "#FFFFFF"), (0.6, "#EAF1FE"), (1, "#D5E3FC")], cx - 50, cy - 60, cx + 50, cy + 60), id="faccia")
    s.cerchio(cx, cy, r - 0.7, fill="none", stroke="#FFFFFF", sw=1.4, id="faccia-filo")
    s.cerchio(cx, cy, 55, fill=s.lin([(0, "#E1ECFD"), (1, "#EFF4FE")], cx - 30, cy - 40, cx + 30, cy + 40), stroke="#CBDCFA", sw=1, id="anello")
    # € come glifo vero (Inter 800), centrato
    w = s.testo("€", cx, cy + 29, 90, 800, "#0B47CC", "middle", id="euro")
    for k, (a, rr) in enumerate(((-68, 98), (-42, 98))):
        s.barra(polare(cx, cy, rr - 6, a), polare(cx, cy, rr + 14, a), 8.5, ROSSO, id=f"scintilla-{k + 1}")


# ------------------------------------------------------------------------------------------- 11. Successi: bersaglio con dardo
def ogg_successi(s: Svg):
    cx, cy, r = -7, 10, 67.5
    ombra_contatto(s, -2, 78, 60, 8, colore="#C23BD8", op=0.2, dev=7, id="ombra-rosata")
    s.cerchio(cx + 2.5, cy + 5, r, fill=ROSSO_SC, id="spessore")
    s.cerchio(cx, cy, r, fill=s.lin([(0, ROSSO_CH), (1, "#F2284A")], cx - 40, cy - 50, cx + 50, cy + 60), id="anello-rosso-1")
    s.cerchio(cx, cy, 53, fill=s.lin([(0, "#FFFFFF"), (1, "#F2F2F6")], cx, cy - 53, cx, cy + 53), id="anello-bianco-1")
    s.cerchio(cx, cy, 40, fill=s.lin([(0, "#FF6577"), (1, "#F52C4B")], cx - 30, cy - 40, cx + 30, cy + 40), id="anello-rosso-2")
    s.cerchio(cx, cy, 26.5, fill=s.lin([(0, "#FFFFFF"), (1, "#F2F2F6")], cx, cy - 26, cx, cy + 26), id="anello-bianco-2")
    s.cerchio(cx, cy, 12.5, fill="#F73550", id="centro")
    s.path(f"M{cx - 52} {cy - 38} A64 64 0 0 1 {cx - 22} {cy - 60}", stroke="#FFFFFF", sw=3, opacita=0.45, id="riflesso")
    # dardo: dalla punta (sul centro) verso l'alto a destra, a 42 gradi; penne uguali
    ang = -42
    def L(t, w=0):
        d = V(math.cos(math.radians(ang)), math.sin(math.radians(ang)))
        pn = V(-d.y, d.x)
        return V(cx - 1, cy - 1) + d * t + pn * w
    ombra_dardo = f"M{pt(L(0, 3))} L{pt(L(60, 3))}"
    s.path(f"M{pt(L(0, 5))} L{pt(L(66, 5))}", stroke=BLU_SC2, sw=7.5, opacita=0.18, filtro=s.sfoca(2), id="ombra-dardo")
    s.path(f"M{pt(L(0))} L{pt(L(78))}", stroke=s.lin([(0, "#1D4FC7"), (1, "#0F3AA6")], cx, cy, cx + 55, cy - 50), sw=7, id="asta")
    for sgn, nome, col in ((-1, "penna-1", "#2F7CFB"), (1, "penna-2", "#0A4CE0")):
        P = [L(60, 0), L(88, sgn * 17), L(104, sgn * 17), L(92, 0)]
        s.path(arrotondato(P, [1, 2, 2, 1]), fill=col, id=nome)
    s.path(f"M{pt(L(60, 0))} L{pt(L(98, 0))}", stroke=BLU_SC2, sw=3.2, id="asta-penne")


# ------------------------------------------------------------------------------------------- 12. FAQ: fumetti
def fumetto(s: Svg, x0, y0, x1, y1, r, coda, fill, id, filo="#FFFFFF"):
    """Rettangolo arrotondato + coda triangolare morbida; `coda` = (base_x0, base_x1, punta V)."""
    s.rett(x0, y0, x1 - x0, y1 - y0, r, fill=fill, id=id)
    b0, b1, P = coda
    s.path(arrotondato([V(b0, y1 - 8), V(b1, y1 - 8), P], [1, 1, 3]), fill=fill, id=id + "-coda")


def ogg_faq(s: Svg):
    ombra_contatto(s, 8, 62, 90, 8, op=0.22, dev=6)
    # fumetto blu (dietro)
    gb = s.lin([(0, "#3B86FF"), (1, "#0750EC")], -20, -51, 80, 53)
    s.rett(-27, -51, 111, 104, 28, fill=gb, id="fumetto-blu")
    s.path(arrotondato([V(44, 40), V(68, 40), V(58, 74)], [1, 1, 3]), fill="#0A55EF", id="fumetto-blu-coda")
    for k in range(3):
        s.cerchio(24 + 22 * k, 0, 5.3, fill="#FFFFFF", id=f"puntino-blu-{k + 1}")
    # fumetto bianco (davanti)
    s.rett(-87, -40, 98, 80, 22, fill="#1D4ED8", opacita=0.22, filtro=s.sfoca(5), extra='transform="translate(0 6)"', id="ombra-fumetto-bianco")
    s.rett(-87, -40, 98, 80, 22, fill=s.lin([(0, "#FFFFFF"), (1, "#E6EEFD")], -60, -40, 0, 40), id="fumetto-bianco")
    s.path(arrotondato([V(-78, 26), V(-48, 26), V(-72, 58)], [1, 1, 3]), fill="#F1F5FE", id="fumetto-bianco-coda")
    s.rett(-86.4, -39.4, 96.8, 78.8, 21.4, fill="none", stroke="#FFFFFF", sw=1.2, id="fumetto-bianco-filo")
    for k in range(3):
        s.cerchio(-60 + 22 * k, 0, 5.3, fill=BLU, id=f"puntino-bianco-{k + 1}")


# ------------------------------------------------------------------------------------------- 13. Opportunità: globo con aereo
def ogg_opportunita(s: Svg):
    c, Rg = V(-10.6, 8.7), 70.5
    vista = (-32, 22)
    ombra_contatto(s, -6, 84, 50, 6, op=0.22, dev=5)
    orb = {"raggi": (100, 30), "rotazione": -30}
    oc = V(-6, -1)
    cid = s.clip(cerchio=(c.x, c.y, Rg))
    # maschera: orbita bianca sul globo, azzurra fuori
    mid = s.uid("mk")
    s.defs.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-140" y="-140" width="280" height="280"><rect x="-140" y="-140" width="280" height="280" fill="#FFFFFF"/>'
                  f'<circle cx="{n(c.x)}" cy="{n(c.y)}" r="{n(Rg)}" fill="#000000"/></mask>')
    # orbita dietro
    s.path(mondo.mezza({**orb}, oc, math.pi, 2 * math.pi), stroke="#A9C5F9", sw=5.6, opacita=0.7, extra=f'mask="url(#{mid})"', id="orbita-dietro-contorno")
    s.path(mondo.mezza({**orb}, oc, math.pi, 2 * math.pi), stroke="#FFFFFF", sw=3.2, extra=f'mask="url(#{mid})"', id="orbita-dietro")
    # globo
    g = s.lin([(0, "#2B73FA"), (0.5, "#0A52E8"), (1, "#0838B8")], c.x - Rg, c.y - Rg, c.x + Rg, c.y + Rg)
    terra = s.lin([(0, "#6AA2FD"), (1, "#3B7BF6")], c.x - Rg, c.y - Rg, c.x + Rg, c.y + Rg)
    s.cerchio(c.x, c.y, Rg, fill=g, id="globo-mare")
    terre = "".join(f'<path id="continente-{nome}" d="{liscio([mondo.proietta(lo, la, vista, c, Rg) for lo, la in mondo.densifica(pts)], tensione=0.9)}"/>'
                    for nome, pts in mondo.CONTINENTI.items())
    s.add(f'<g id="continenti" clip-path="url(#{cid})" fill="{terra}">{terre}</g>')
    s.cerchio(c.x, c.y, Rg, fill=s.rad([(0, "#FFFFFF", 0), (0.62, "#FFFFFF", 0), (1, "#06226B", 0.32)], c.x - Rg * 0.35, c.y - Rg * 0.4, Rg * 1.45), id="globo-ombreggiatura")
    rr = Rg * 0.84
    a0, a1 = math.radians(206), math.radians(244)
    s.path(f"M{pt(c + V(math.cos(a0), math.sin(a0)) * rr)} A{n(rr)} {n(rr)} 0 0 1 {pt(c + V(math.cos(a1), math.sin(a1)) * rr)}", stroke="#FFFFFF", sw=3.4, opacita=0.4, id="globo-riflesso")
    # orbita davanti: bianca sul globo, azzurra fuori; ultimi tratti tratteggiati verso l'aereo
    dav = mondo.mezza({**orb}, oc, 0.38, math.pi)
    s.path(dav, stroke="#A9C5F9", sw=6, opacita=0.7, extra=f'mask="url(#{mid})"', id="orbita-davanti-contorno")
    s.path(dav, stroke="#FFFFFF", sw=3.6, extra=f'mask="url(#{mid})"', id="orbita-davanti-fuori")
    s.path(dav, stroke="#FFFFFF", sw=3.8, extra=f'clip-path="url(#{cid})" stroke-dasharray="26 9"', id="orbita-davanti")
    # aereo posato sull'orbita, girato lungo la tangente
    t = 0.38
    rx, ry = orb["raggi"]
    P = mondo.ellisse(orb, oc, t)
    a = math.radians(orb["rotazione"])
    tx, ty = rx * math.sin(t), -ry * math.cos(t)         # verso di percorrenza (t decrescente)
    hx, hy = tx * math.cos(a) - ty * math.sin(a), tx * math.sin(a) + ty * math.cos(a)
    gradi = math.degrees(math.atan2(hx, -hy))
    d, corpo = mondo.aereo("aereo", P, gradi, ("#2E78F4", "#0437AC"))
    s.defs.append(d)
    s.apri("aereo-grande", trasforma=f"translate({n(P.x)} {n(P.y)}) scale(1.7) translate({n(-P.x)} {n(-P.y)})")
    s.add(corpo)
    s.chiudi()


# ------------------------------------------------------------------------------------------- 14. Community: tre persone
def persona(s: Svg, cx, cy_testa, r_testa, x0, x1, y0, y1, fill_t, fill_c, id, r_sp=None, r_in=8, bordo=None):
    rs = r_sp or (x1 - x0) * 0.42
    d = arrotondato([V(x0, y1), V(x0, y0), V(x1, y0), V(x1, y1)], [r_in, rs, rs, r_in])
    if bordo:
        s.path(d, fill="#5B8DEF", opacita=0.25, filtro=s.sfoca(4), extra='transform="translate(0 4)"', id=f"{id}-ombra")
    s.cerchio(cx, cy_testa, r_testa, fill=fill_t, stroke=bordo, sw=1, id=f"{id}-testa")
    s.path(d, fill=fill_c, stroke=bordo, sw=1, id=f"{id}-corpo")


def ogg_community(s: Svg):
    ombra_contatto(s, 0, 76, 92, 7, op=0.22, dev=6)
    pal = s.lin([(0, "#FFFFFF"), (1, "#DDE8FC")], 0, 0, 0, 62)
    pal2 = s.lin([(0, "#F6F9FE"), (1, "#D4E2FB")], 0, 0, 0, 62)
    pers_h = s.lin([(0, "#FFFFFF"), (1, "#E6EEFD")], 0, -30, 0, 10)
    # laterali (più chiare, dietro)
    persona(s, -57, -13, 22, -91, -33, 8, 62, pers_h, pal, "persona-sinistra", r_sp=26, bordo="#C9DAF8")
    persona(s, 55, -15, 22, 33, 91, 8, 62, s.lin([(0, "#F4F8FE"), (1, "#D9E6FB")], 0, -35, 0, 5), pal2, "persona-destra", r_sp=26, bordo="#C0D3F6")
    # centrale (blu)
    s.rett(-47, 4, 92, 72, 20, fill="#1D4ED8", opacita=0.35, filtro=s.sfoca(5), id="ombra-persona")
    persona(s, -1, -28, 27, -47, 45, 3, 72, s.lin([(0, "#3D88FF"), (1, "#0856F0")], 0, -55, 0, -1), s.lin([(0, "#1F6AFA"), (1, "#0047DA")], 0, 3, 0, 72), "persona-centrale", r_sp=30, r_in=10)
    s.path("M-40 24 C-36 14 -26 8 -14 6", stroke="#FFFFFF", sw=1.6, opacita=0.45, id="persona-centrale-filo")


# ------------------------------------------------------------------------------------------- l'insieme
ICONE = [
    ("addiofa", "AddiOFA", ogg_addiofa), ("studio", "Studio", ogg_studio), ("quiz", "Quiz", ogg_quiz),
    ("risultati", "Risultati", ogg_risultati), ("tips", "Tips", ogg_tips), ("consigli", "Consigli", ogg_consigli),
    ("app", "App", ogg_app), ("polimi", "Polimi", ogg_polimi), ("ofa", "OFA", ogg_ofa), ("costi", "Costi", ogg_costi),
    ("successi", "Successi", ogg_successi), ("faq", "FAQ", ogg_faq), ("opportunita", "Opportunità", ogg_opportunita),
    ("community", "Community", ogg_community),
]
# id degli elementi del catalogo (immagine 44) per ogni sfera, per il rapporto
ELEMENTI = {"addiofa": "44.001", "studio": "44.002", "quiz": "44.003", "risultati": "44.004", "tips": "44.005", "consigli": "44.006",
            "app": "44.007", "polimi": "44.015", "ofa": "44.016", "costi": "44.017", "successi": "44.018", "faq": "44.019",
            "opportunita": "44.020", "community": "44.021"}
ETICHETTE = {"addiofa": "44.008", "studio": "44.009", "quiz": "44.010", "risultati": "44.011", "tips": "44.012", "consigli": "44.013", "app": "44.014",
             "polimi": "44.022", "ofa": "44.023", "costi": "44.024", "successi": "44.025", "faq": "44.026", "opportunita": "44.027", "community": "44.028"}
CX = [184.5 + 300 * k for k in range(7)]
CY = [167.0, 502.0]


def costruisci(nome: str, titolo: str, f) -> Svg:
    s = Svg(-LATO / 2, -LATO / 2, LATO, LATO, f"sfera-{nome}", f"Icona sfera: {titolo}")
    sfera(s)
    s.apri("oggetto")
    f(s)
    s.chiudi()
    riflesso_sfera(s)
    return s


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    percorsi = []
    for nome, titolo, f in ICONE:
        p = costruisci(nome, titolo, f).salva(DEST / f"{nome}.svg")
        percorsi.append(p)
    set_svg(percorsi, DEST / "_set.svg", colonne=7, cella=LATO, margine=24, id="set-sfera")
    # foglio con le etichette, come il layout dell'originale (2172x724)
    from ui import Tela
    t = Tela(2172, 724, "#FEFEFE", id="icone-sfera")
    for i, ((nome, titolo, f), p) in enumerate(zip(ICONE, percorsi)):
        cx, cy = CX[i % 7], CY[i // 7]
        t.inserisci_svg(p.read_text(), cx - LATO / 2, cy - LATO / 2, LATO, f"sfera-{nome}")
        base = 332 if i < 7 else 670
        t.testo(titolo, cx, base, 34, 600, "#0E1730", "middle", id=f"etichetta-{nome}")
    t.salva(DEST / "icone-sfera.svg")
    tavola(percorsi, DEST / "_tavola.png", colonne=2)
    print("sfera: ", len(percorsi), "icone ->", DEST)


if __name__ == "__main__":
    main()
