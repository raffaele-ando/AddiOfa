"""
Componenti per le schermate dell'immagine 18 (profilo, statistiche, frasi, quiz, correzioni, simulatore), kit rosso.
Si disegna in PIXEL DEL RITAGLIO (brand/concept/18-.../NNN-schermata.png); ogni schermata e' la sola parte bianca del
telefono, riportata a 390 pt di larghezza (t.X, t.Y, t.s). Riusa i componenti di s1 (stato, indietro, avanzamento, pulsante,
scheda, radio, riga, corpo_per, illustrazione) e aggiunge: barra di navigazione a 3 voci, pulsante secondario, tile statistica,
barra a percentuale, chip, avatar, ecc.
Corregge dell'originale: nav bar con voce attiva coerente (le schermate AI hanno la voce attiva a caso), icone vere al posto di
pupazzetti/pezzi storti, avanzamento a 5 segmenti uguali, barre con la percentuale scritta davvero.
"""
from __future__ import annotations
import pathlib, sys
QUI = pathlib.Path(__file__).resolve().parent
S1 = QUI.parent / "s1"
sys.path.insert(0, str(S1))
from componenti import *            # noqa: F401,F403  (s1)
from componenti import (Tela, RADICE, larghezza_testo, n, riga, righe, corpo_per, illustrazione, stato, indietro, avanzamento,
                        pulsante as _pulsante_s1, scheda, radio_r, spunta_tondo, INK_R, SOTTO, TESTO, ROSSO_B, ROSSO_B2, ROSSO_T,
                        LINEA_R, GRIGIO_BAR, GRIGIO_ICONA, VERDE_B)
import extra as _extra_s1
import ui as _ui
_ui.ICONE["casa-linea"] = [("p", "M4 11 12 3.800 20 11v8.500a1 1 0 0 1-1 1h-4.500v-5.500h-5v5.500H5a1 1 0 0 1-1-1z")]
_ui.ICONE["utente-linea"] = [("c", (12, 7.800, 3.800)), ("p", "M5 20.500c0-3.800 3-6.200 7-6.200s7 2.400 7 6.200")]
_extra_s1.GLIFI["utente"] = '<circle cx="12" cy="7.6" r="4.2"/><path d="M3.8 21c0-4.4 3.7-7 8.200-7s8.200 2.600 8.200 7z"/>'
_extra_s1.GLIFI["stella-piena"] = '<path d="M12 2.600l2.900 6 6.500.9-4.700 4.600 1.100 6.500L12 17.500l-5.800 3.100 1.100-6.500L2.600 9.500l6.500-.9z"/>'
from extra import glifo, chip_icona, capsula, croce  # noqa

ORIG18 = RADICE / "brand/concept/18-schermate-profilo-statistiche"
ORIG20 = RADICE / "brand/concept/20-schermate-risultato-sei"
OUT18 = RADICE / "brand/concept-svg/schermate/18-schermate-profilo-statistiche"
OUT20 = RADICE / "brand/concept-svg/schermate/20-schermate-risultato-sei"
TAVOLE = RADICE / "brand/concept-svg/_tavole/s4"

BLU_T = "#4B5F91"      # sottotitoli blu-grigio
NAVY = "#0C1446"
VERDE_FONDO = "#E3F6E6"
VERDE_T = "#1F9D45"
ROSA_FONDO = "#FDE6E8"

NOMI18 = {1: "profilo", 2: "statistiche", 3: "frasi-e-vocaboli", 4: "quiz-domanda", 5: "quiz-completato", 6: "correzioni",
          7: "simulatore-esame", 8: "simulazione-domanda", 9: "simulazione-completata"}
# parte bianca del telefono nel ritaglio: x0, x1, y0, y1 (px)
FIN18 = {1: (51, 335, 6, 520), 2: (27, 308, 6, 520), 3: (19, 302, 6, 520), 4: (19, 302, 6, 520), 5: (7, 283, 1, 462), 6: (10, 292, 2, 462),
         7: (35, 309, 2, 462), 8: (35, 313, 2, 463), 9: (14, 289, 2, 463)}


def percorso18(n_): return ORIG18 / f"{n_:03d}-schermata.png"
def svg18(n_): return OUT18 / f"{n_:02d}-{NOMI18[n_]}.svg"


def nuova(n_: int, fin=None, id=None, cartella=None) -> Tela:
    x0, x1, y0, y1 = fin or FIN18[n_]
    k = 390 / (x1 - x0)
    t = Tela(390, round((y1 - y0) * k, 2), fondo=None, id=id or f"schermata-{n_:02d}-{NOMI18.get(n_, n_)}")
    t.k, t.x0, t.x1, t.y0, t.y1, t.num = k, x0, x1, y0, y1, n_
    t.X = lambda x: (x - x0) * k
    t.Y = lambda y: (y - y0) * k
    t.s = lambda v: v * k
    t.p = t.s
    t.rett(0.5, 0.5, 389, t.h - 1, t.s(18), fill="#FFFFFF", stroke="#E9EDF4", sw=1, id="schermata-fondo")
    return t


_extra_s1.GLIFI["fiamma"] = ('<path d="M12.200 1.800c.5 3.600 5.600 6.100 5.600 12.200a5.800 5.800 0 0 1-11.600 0c0-2.800 1.500-4.500 2.700-5.800.2 1.700.9 2.700 1.800 3.100C10.100 7.500 10.600 4.300 12.200 1.800z"/>'
                             '<path d="M12 21.700a3.300 3.300 0 0 1-3.300-3.300c0-1.900 1.500-2.900 2.100-4.300.7 1.100 4.500 2.300 4.500 4.300a3.300 3.300 0 0 1-3.300 3.300z" fill="#FFE3A3"/>')
_extra_s1.GLIFI["ingranaggio"] = ('<g id="d">' + "".join(f'<rect x="10.200" y="1.800" width="3.600" height="5" rx="1" transform="rotate({a} 12 12)"/>' for a in range(0, 360, 45))
                                  + '</g><circle cx="12" cy="12" r="7.500"/><circle cx="12" cy="12" r="3" fill="#FFFFFF"/>')
_extra_s1.GLIFI["scudo"] = ('<path d="M12 2.200 4.200 5.200v6c0 4.800 3.200 8.700 7.800 10.600 4.600-1.900 7.800-5.800 7.800-10.600v-6z"/>'
                            '<path d="M8.300 12.100 11 14.800l4.800-5" fill="none" stroke="#FFFFFF" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/>')
_extra_s1.GLIFI["bersaglio"] = ('<circle cx="12" cy="12" r="9.500"/><circle cx="12" cy="12" r="6.300" fill="#FFFFFF"/><circle cx="12" cy="12" r="4.300"/>'
                                '<circle cx="12" cy="12" r="1.800" fill="#FFFFFF"/>')


_extra_s1.GLIFI["trofeo"] = ('<path d="M6.500 3h11v6.200a5.500 5.500 0 0 1-11 0z"/><path d="M6.500 4.800H3.200v2a4 4 0 0 0 3.800 4M17.500 4.800h3.300v2a4 4 0 0 1-3.800 4" fill="none" stroke="currentColor" stroke-width="1.800"/>'
                             '<rect x="10.800" y="14" width="2.400" height="4"/><rect x="7.500" y="18" width="9" height="3" rx="1"/>')


_extra_s1.GLIFI["cuffie"] = ('<path d="M4.500 15.500v-3a7.500 7.500 0 0 1 15 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
                             '<rect x="3.200" y="14" width="4.200" height="6.600" rx="1.800"/><rect x="16.600" y="14" width="4.200" height="6.600" rx="1.800"/>')


def stato18(t, y=24, f=0.9):
    """Barra di stato a scala del ritaglio 18 (ora alta ~10 px): y = linea di base dell'ora; margini 23 px sx, 15 px dx."""
    c = INK_R
    X, Y, s = t.X, t.Y, t.s
    r = t.x1 - 15
    with t.gruppo("barra-di-stato"):
        t.testo("9:41", X(t.x0 + 23), Y(y), s(10.4 * f), 700, c, id="ora")
        bx = X(r) - s(21)
        t.rett(bx, Y(y - 9.5 * f), s(20), s(10), s(3), fill="none", stroke=c, sw=s(0.9), opacita=0.45)
        t.rett(bx + s(1.5), Y(y - 8 * f), s(16.5), s(7), s(2), fill=c)
        t.rett(bx + s(20.5), Y(y - 6 * f), s(1.4), s(3.4), s(0.7), fill=c, opacita=0.5)
        wx = bx - s(19)
        t.icona("wifi", wx, Y(y - 11 * f), s(15), c, 2.2)
        sx = wx - s(21)
        for i, h_ in enumerate((3.5, 5.7, 7.9, 10.2)):
            t.rett(sx + s(4) * i, Y(y) - s(h_ * f), s(2.6), s(h_ * f), s(0.9), fill=c)


def pulsante(t, x0, y0, x1, y1, et, corpo=10.2, id="pulsante-primario", freccia=False, dx=0):
    """Pulsante rosso (stesso stile di s1) a scala del ritaglio 18: chevron fissato a destra, grande come il pulsante."""
    X, Y, s = t.X, t.Y, t.s
    h = y1 - y0
    with t.gruppo(id):
        t.rett(X(x0), Y(y0), s(x1 - x0), s(h), s(h * 0.28), id=f"{id}-fondo", fill=t.sfumatura(["#F93946", "#F02130"]),
               filtro=t.ombra(s(1.6), s(5), "#E11D2B", 0.28))
        cs = s(corpo)
        lw = larghezza_testo(et, cs, 600, s(0.15))
        t.testo(et, X((x0 + x1) / 2 + dx) - lw / 2, Y((y0 + y1) / 2) + cs * 0.355, cs, 600, "#FFFFFF", id=f"{id}-testo", spaziatura=s(0.15))
        if freccia:
            c = h * 0.36
            t.icona("chevron-destra", X(x1 - h * 0.62) - s(c / 2), Y((y0 + y1) / 2) - s(c / 2), s(c), "#FFFFFF", 2.6, id=f"{id}-freccia")


def pulsante_contorno(t, x0, y0, x1, y1, et, corpo=10.2, id="pulsante-secondario", colore="#2E6CF0"):
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo(id):
        t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s((y1 - y0) * 0.3), fill="#FFFFFF", stroke="#5C8DF0", sw=s(1), id=f"{id}-fondo")
        cs = s(corpo)
        lw = larghezza_testo(et, cs, 600)
        t.testo(et, X((x0 + x1) / 2) - lw / 2, Y((y0 + y1) / 2) + cs * 0.355, cs, 600, INK_R, id=f"{id}-testo")


def nav(t, y_linea, y1, attiva=None, centri=None):
    """Barra di navigazione: Studio / Lezioni / Profilo. y_linea = filetto sopra, y1 = fondo del telefono (px ritaglio)."""
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo("barra-di-navigazione"):
        t.rett(0.5, Y(y_linea), 389, t.h - Y(y_linea) - 0.5, 0, fill="#FFFFFF", r_angoli=(0, 0, s(18), s(18)))
        t.linea(0.5, Y(y_linea), 389.5, Y(y_linea), "#EDF0F5", 1, cap="butt")
        cx = centri or [(t.x0 + (t.x1 - t.x0) * f) for f in (0.17, 0.5, 0.83)]
        for i, (ic, et) in enumerate((("casa", "Studio"), ("libro", "Lezioni"), ("utente", "Profilo"))):
            on = attiva == i
            col = ROSSO_T if on else "#5B6B8F"
            ch = (y1 - y_linea)
            yi = y_linea + ch * 0.34
            if on and ic != "casa":
                glifo(t, ic, cx[i], yi, ch * 0.40, col)
            else:
                nome = {"casa": "casa-linea", "utente": "utente-linea"}.get(ic, ic) if not on else ic
                t.icona(nome, X(cx[i]) - s(ch * 0.215), Y(yi) - s(ch * 0.215), s(ch * 0.43), col, 1.9, id=f"nav-{et.lower()}-icona",
                        fill_pieno=col if on else None)
            cs = corpo_per(et, ch * 0.27, 600) * 0.0 + 8.4
            riga(t, et, cx[i], y_linea + ch * 0.72, cs, 600 if on else 500, col, ancora="middle", id=f"nav-{et.lower()}")


def chiudi18(t):
    p = svg18(t.num); t.salva(p); print(p); return p


# ---------------------------------------------------------------------------- pezzi per profilo / statistiche
def tondo_utente(t, cx, cy, r, id="avatar"):
    """Avatar segnaposto (sagoma, non foto): disco grigio-azzurro con busto. t.avatar di ui ha altro stile."""
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo(id):
        t.cerchio(X(cx), Y(cy), s(r), fill=t.sfumatura(["#E4E9F2", "#CBD3E2"]), id=f"{id}-fondo")
        t.cerchio(X(cx), Y(cy - r * 0.2), s(r * 0.34), fill="#6B7DA6", id=f"{id}-testa")
        t.path(f"M{n(X(cx - r * 0.56))} {n(Y(cy + r * 0.74))}C{n(X(cx - r * 0.56))} {n(Y(cy + r * 0.2))} {n(X(cx + r * 0.56))} {n(Y(cy + r * 0.2))} {n(X(cx + r * 0.56))} {n(Y(cy + r * 0.74))}Z",
               fill="#6B7DA6", id=f"{id}-busto")


def card_chiara(t, x0, y0, x1, y1, r=8, fill="#F5F7FC", bordo="#EDF0F7", id="card", ombra=False):
    X, Y, s = t.X, t.Y, t.s
    t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s(r), fill=fill, stroke=bordo, sw=s(0.7), id=id,
           filtro=t.ombra(s(0.8), s(3), "#3B5BA8", 0.06) if ombra else None)


def icona_colore(t, nome, cx, cy, lato, colore, sp=1.9, id=None, pieno=False):
    t.icona(nome, t.X(cx) - t.s(lato / 2), t.Y(cy) - t.s(lato / 2), t.s(lato), colore, sp, id=id, fill_pieno=colore if pieno else None)


def glifo_c(t, nome, cx, cy, lato, colore, id=None):
    with t.gruppo(id or f'icona-{nome}'):
        glifo(t, nome, cx, cy, lato, colore)


def chevron(t, cx, cy, lato=10, colore="#1D2A55", id=None, sp=2.5):
    t.icona("chevron-destra", t.X(cx) - t.s(lato / 2), t.Y(cy) - t.s(lato / 2), t.s(lato), colore, sp, id=id)


def barra_px(t, x0, x1, yc, h, frazione, id="barra", colore=None, fondo="#EEF1F7"):
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo(id):
        t.rett(X(x0), Y(yc - h / 2), s(x1 - x0), s(h), s(h / 2), fill=fondo, id=f"{id}-vuota")
        t.rett(X(x0), Y(yc - h / 2), s((x1 - x0) * frazione), s(h), s(h / 2), id=f"{id}-piena",
               fill=colore or t.sfumatura(["#F5414F", "#EE2433"], 0, 0, 1, 0))


_extra_s1.GLIFI["altoparlante"] = ('<path d="M3.500 9.600h3.400L11.500 5.600v12.800l-4.600-4H3.500z"/>'
                                  '<path d="M14.800 8.800a4.800 4.800 0 0 1 0 6.400M17.600 6a8.600 8.600 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')


def stella(t, cx, cy, lato, pieno=True, colore="#F7A81B", id="stella"):
    """Stella a 5 punte (pieno = dorata; vuota = solo contorno)."""
    import math
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        r = lato / 2 * (1 if i % 2 == 0 else 0.48)
        pts.append((t.X(cx) + t.s(r) * math.cos(a), t.Y(cy + lato * 0.04) + t.s(r) * math.sin(a)))
    d = "M" + "L".join(f"{n(x)} {n(y)}" for x, y in pts) + "Z"
    if pieno:
        t.path(d, fill=colore, stroke=colore, sw=t.s(lato * 0.12), id=id)
    else:
        t.path(d, fill="none", stroke="#B9C5DC", sw=t.s(lato * 0.08), id=id)


def misuratore_ellittico(t, cx, cy, rx, ry, th, v, id="misuratore", colori=("#EE2433", "#F7616C", "#EE2433"), vuoto="#E8ECF3", knob="#EE2433"):
    """Mezza ellisse (cx,cy = centro dei due cappucci) con arco pieno fino a v (0..1), anello bianco e pomello. Pixel del ritaglio."""
    import math
    X, Y, s = t.X, t.Y, t.s
    def pt(f):
        a = math.pi * (1 - f)
        return X(cx + rx * math.cos(a)), Y(cy - ry * math.sin(a))
    def arco(f0, f1):
        (x0, y0), (x1, y1) = pt(f0), pt(f1)
        return f"M{n(x0)} {n(y0)}A{n(s(rx))} {n(s(ry))} 0 0 1 {n(x1)} {n(y1)}"
    with t.gruppo(id):
        t.path(arco(0, 1), stroke=vuoto, sw=s(th), id=f"{id}-traccia")
        g = t.sfumatura([(0, colori[0]), (0.5, colori[1]), (1, colori[2])], X(cx - rx), 0, X(cx + rx), 0, userspace=True)
        t.path(arco(0, v), stroke=g, sw=s(th), id=f"{id}-valore")
        px, py = pt(v)
        t.cerchio(px, py, s(th * 0.95), fill="#FFFFFF", filtro=t.ombra(s(0.8), s(3), knob, 0.35), id=f"{id}-pomello-anello")
        t.cerchio(px, py, s(th * 0.68), fill=t.radiale([(0, "#FF6A74", 1), (0.7, knob, 1), (1, "#D81B2A", 1)], 0.4, 0.35, 0.75), id=f"{id}-pomello")


def tessera_esito(t, x0, x1, y0, y1, fondo, ic, val, et, ex0, ex1, vy=None, ey=None, id="tessera"):
    """Tessera dei risultati: icona tonda in alto, valore in grassetto e etichetta. ic in {'ok','no','tempo'}."""
    X, Y, s = t.X, t.Y, t.s
    cx = (x0 + x1) / 2
    h = y1 - y0
    with t.gruppo(id):
        t.rett(X(x0), Y(y0), s(x1 - x0), s(h), s(h * 0.11), fill=t.sfumatura(list(fondo)), id=f"{id}-fondo")
        cy = y0 + h * 0.24
        r = h * 0.14
        if ic == "ok":
            t.cerchio(X(cx), Y(cy), s(r), fill=t.sfumatura(["#35BE6A", "#1FA553"]))
            t.icona("spunta", X(cx) - s(r * 0.52), Y(cy) - s(r * 0.52), s(r * 1.04), "#FFFFFF", 3.2)
        elif ic == "no":
            t.cerchio(X(cx), Y(cy), s(r), fill=t.sfumatura(["#FA4A57", "#EE2433"]))
            t.icona("x", X(cx) - s(r * 0.42), Y(cy) - s(r * 0.42), s(r * 0.84), "#FFFFFF", 3.2)
        else:
            t.cerchio(X(cx), Y(cy), s(r), fill=t.sfumatura(["#3B82F8", "#1F63EE"]))
            t.path(f"M{n(X(cx))} {n(Y(cy - r * 0.55))}V{n(Y(cy))}L{n(X(cx + r * 0.4))} {n(Y(cy + r * 0.3))}", stroke="#FFFFFF", sw=s(r * 0.2))
        riga(t, val, cx, vy or y0 + h * 0.67, h * 0.235, 800, INK_R, ancora="middle", id=f"{id}-valore")
        riga(t, et, cx, ey or y0 + h * 0.915, corpo_per(et, ex1 - ex0, 400), 400, BLU_T, ancora="middle", id=f"{id}-etichetta")


def scena_cronometro(t, x0, y_base, id="illustrazione-cronometro"):
    """Cronometro rosso con foglio e nuvole azzurre (scena della schermata 'Simulatore d'esame'). Pixel del ritaglio 18.007:
    x0 = sinistra della scena, y_base = filo inferiore (la scena e' tagliata li')."""
    import math
    X, Y, s = t.X, t.Y, t.s
    cx, cy, R = x0 + 121, y_base - 34, 27.2
    with t.gruppo(id):
        cid = f"{t.id}-clip-cron"
        t.defs.append(f'<clipPath id="{cid}"><rect x="{n(X(x0 - 5))}" y="{n(Y(y_base - 90))}" width="{n(s(190))}" height="{n(s(90))}"/></clipPath>')
        with t.gruppo("sfondo-nuvole", clip=cid):
            for ex, ey, rx, ry, f in ((x0 + 22, y_base - 26, 22, 28, "#E1EAFB"), (x0 + 55, y_base - 38, 24, 30, "#E4ECFC"), (x0 + 148, y_base - 24, 20, 26, "#E1EAFB"),
                                     (x0 + 100, y_base - 12, 60, 22, "#E6EDFC")):
                t.ellisse(X(ex), Y(ey), s(rx), s(ry), fill=f)
            t.rett(X(x0 + 20), Y(y_base - 40), s(130), s(40), 0, fill="#E6EDFC")
            # foglio inclinato
            with t.gruppo("foglio", trasforma=f"rotate(-14 {n(X(x0 + 58))} {n(Y(y_base - 20))})"):
                t.rett(X(x0 + 30), Y(y_base - 42), s(56), s(50), s(5), fill="#F3F7FE", stroke="#D5E1F9", sw=s(0.8))
                t.rett(X(x0 + 38), Y(y_base - 33), s(32), s(4), s(2), fill="#C3D4F6")
                t.rett(X(x0 + 38), Y(y_base - 23), s(40), s(4), s(2), fill="#C3D4F6")
        # cronometro
        t.rett(X(cx + 4) - s(6), Y(cy - R - 8), s(12), s(7), s(3), fill="#3F72D8", id="cronometro-pulsante")
        t.rett(X(cx) - s(2.4), Y(cy - R - 3), s(4.8), s(5), 0, fill="#3F72D8")
        with t.gruppo("cronometro-anello", trasforma=""):
            t.cerchio(X(cx), Y(cy), s(R), fill="#FFFFFF", stroke=t.sfumatura(["#F4404C", "#E41C2B"]), sw=s(6.6), filtro=t.ombra(s(1.2), s(5), "#E11D2B", 0.25), id="cronometro-corpo")
        t.rett(X(cx + R * 0.72), Y(cy - R * 0.78) , s(7), s(5), s(1.5), fill="#EE2433")
        for i in range(12):
            a = math.radians(i * 30)
            r0, r1 = R * 0.69, R * (0.80 if i % 3 else 0.84)
            t.linea(X(cx + r0 * math.sin(a)), Y(cy - r0 * math.cos(a)), X(cx + r1 * math.sin(a)), Y(cy - r1 * math.cos(a)), "#B8C6E4", s(0.9), cap="round")
        t.path(f"M{n(X(cx))} {n(Y(cy))}L{n(X(cx + 4))} {n(Y(cy - R * 0.58))}", stroke="#2457C8", sw=s(2.4), id="cronometro-lancetta")
        t.cerchio(X(cx), Y(cy), s(2.4), fill="#2457C8")


def cronometro_icona(t, cx, cy, r, colore, id="icona-cronometro"):
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo(id):
        t.cerchio(X(cx), Y(cy + r * 0.12), s(r * 0.78), fill="none", stroke=colore, sw=s(r * 0.22))
        t.linea(X(cx - r * 0.28), Y(cy - r * 0.9), X(cx + r * 0.28), Y(cy - r * 0.9), colore, s(r * 0.22))
        t.linea(X(cx), Y(cy + r * 0.12), X(cx), Y(cy - r * 0.32), colore, s(r * 0.2))
        t.linea(X(cx + r * 0.62), Y(cy - r * 0.52), X(cx + r * 0.8), Y(cy - r * 0.7), colore, s(r * 0.2))


def segnalibro(t, cx, cy, h, colore, id="icona-segnalibro"):
    X, Y, s = t.X, t.Y, t.s
    w = h * 0.72
    t.path(f"M{n(X(cx - w / 2))} {n(Y(cy - h / 2))}H{n(X(cx + w / 2))}V{n(Y(cy + h / 2))}L{n(X(cx))} {n(Y(cy + h * 0.2))}L{n(X(cx - w / 2))} {n(Y(cy + h / 2))}Z",
           stroke=colore, sw=s(h * 0.14), id=id, join="round")
