"""
Tessere dei contenuti social (storie, reel, caroselli, post) disegnate in pixel dell'originale 48
(brand/concept/48-social-copertine-video). Ogni funzione disegna in coordinate locali 0..w,0..h.
Le foto (persone, edifici, telefono in mano) restano raster, PULITE dalle scritte cotte dall'AI; tutto il resto e' vettoriale.
Correzioni: "3 / 1" della tessera "3 consigli" (la cifra 1 sbordava sotto il 3) -> "3" con "consigli per l'OFA di inglese";
contatori nascosti dalla scheda -> visibili; "'92" -> numero vero; icone social generiche.
"""
from lib import *

SORG = S48


def f(nome, x0, y0, w, h, rects, **k):
    """Foto pulita della tessera (x0,y0,w,h assoluti); rects in coordinate LOCALI della tessera."""
    ar = [(x0 + a, y0 + b, x0 + c, y0 + d) for (a, b, c, d) in rects]
    return foto_pulita(SORG, (x0, y0, x0 + w, y0 + h), nome, ar, **k)


RC_CHROME = lambda w, h: [(8, 16, 90, 42), (w - 32, 12, w - 2, 38), (w - 36, 232, w - 2, 392), (8, h - 52, w - 40, h - 6), (w - 34, h - 36, w - 2, h - 8)]


def t1(t, w=186, h=424):
    p = f("t48_1", 11, 9, w, h, RC_CHROME(w, h) + [(8, 255, 160, 322)])
    t.foto(p, 0, 0, w, h, id="foto-studente-polimi")
    reel_chrome(t, w, h, ("12.4K", "152", "2.1K"), ("Non rischiare 30€ e un anno.", "Verifica ora il tuo livello."))
    with t.gruppo("titolo-reel"):
        t.testo("L'OFA di inglese", 13, 275, 15.8, 600, "#FFFFFF", id="titolo-riga-1")
        wp = t.testo("può ", 13, 295, 15.8, 600, "#FFFFFF", id="titolo-riga-2a")
        t.testo("bloccarti", 13 + wp, 295, 15.8, 700, "#3F8CFF", id="titolo-bloccarti")
        t.testo("tutto il piano di studi.", 13, 314, 15.8, 500, "#FFFFFF", id="titolo-riga-3")


def t2(t, w=181, h=424):
    p = f("t48_2", 205, 9, w, h, RC_CHROME(w, h) + [(8, 56, 175, 112)])
    t.foto(p, 0, 0, w, h, id="foto-telefono-in-mano")
    reel_chrome(t, w, h, ("8.7K", "96", "1.1K"), ("Quiz gratuito", "per studenti del Polimi."))
    t.testo("Scopri se sei", 17, 83, 17, 500, "#FFFFFF", id="titolo-riga-1")
    t.testo("a rischio in 3 minuti.", 17, 103, 17, 500, "#FFFFFF", id="titolo-riga-2")


def t3(t, w=178, h=424):
    """Tessera chiara: arco 82% (vettoriale) e due pulsanti."""
    t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#1B3C85", "#3A6FD0", "#9DC1F3"]), id="fondo-cielo")
    t.path(f"M0 106C40 62 120 70 {w} 142V{h}H0z", fill=t.sfumatura(["#FFFFFF", "#F3F8FF", "#E4EFFE"]), id="fondo-onda-chiara")
    wordmark(t, 13, 31, 14.5, col="#FFFFFF", col_o="#FFFFFF", id="wordmark-in-alto")
    ico_condividi(t, w - 18, 24, 17, "#FFFFFF", id="icona-in-alto")
    cx, cy, r = 94, 161, 66
    a0, a1 = math.radians(200), math.radians(-12)
    def pt(a): return cx + r * math.cos(a), cy - r * math.sin(a)
    x0_, y0_ = pt(math.radians(200)); x1_, y1_ = pt(math.radians(-20))
    t.path(f"M{n(x0_)} {n(y0_)}A{r} {r} 0 0 1 {n(x1_)} {n(y1_)}", stroke="#E9EEF7", sw=13, cap="round", id="arco-fondo")
    xm, ym = pt(math.radians(-8) if False else math.radians(18))
    x0b, y0b = pt(math.radians(200)); x2, y2 = pt(math.radians(18))
    t.path(f"M{n(x0b)} {n(y0b)}A{r} {r} 0 0 1 {n(x2)} {n(y2)}", stroke=t.sfumatura(["#F26B6B", "#E5383B"], 0, 0, 1, 0), sw=13, cap="round", id="arco-valore")
    t.cerchio(x2, y2, 8, fill="#E5383B", stroke="#FFFFFF", sw=3, id="arco-pallino")
    t.testo("82%", cx, cy + 22, 36, 800, "#E5383B", ancora="middle", id="percentuale")
    for i, r_ in enumerate(["degli studenti", "rischia di non", "superare l'OFA."]):
        t.testo(r_, 33, 211 + i * 19, 14.6, 400, "#10244E", id=f"testo-riga-{i+1}")
    t.testo("Tu da che parte sei?", 23, 275, 14.5, 700, "#0A1633", id="domanda")
    t.rett(16, 310, 138, 32, 8, fill="#1A6AF4", id="pulsante-primario")
    t.testo("Ci provo ora", 85, 331, 12.5, 600, "#FFFFFF", ancora="middle", id="pulsante-primario-testo")
    t.rett(16, 349, 138, 32, 8, fill="#FFFFFF", stroke="#DCE5F3", sw=1.2, id="pulsante-secondario", filtro=t.ombra(1, 4, "#4C7CE0", 0.12))
    t.testo("Ci penso dopo", 85, 370, 12.5, 500, "#10244E", ancora="middle", id="pulsante-secondario-testo")
    t.cerchio(w - 18, h - 22, 13, fill="#E4ECFA", id="pulsante-avanti")
    t.icona("chevron-destra", w - 24, h - 28, 12, "#FFFFFF", 2.4)


def t4(t, w=181, h=424):
    p = f("t48_4", 579, 9, w, h, RC_CHROME(w, h) + [(8, 56, 150, 175), (118, 85, 160, 130)])
    t.foto(p, 0, 0, w, h, id="foto-studentessa")
    reel_chrome(t, w, h, ("14.2K", "210", "1.3K"), ("L'inglese non deve essere", "un ostacolo."))
    corsivo(t, ["STESSI", "STUDENTI.", "PERCORSI", "PIÙ LUMINOSI."], 20, 78, 14.5, rot=-9, passo=19)
    stella4(t, 150, 92, 13, "#FFFFFF", id="scintilla")


def card_checklist(t, x, y, w, h, righe, rot=-6, id="scheda-checklist", bandiera=True, corpo=11):
    cx, cy = x + w / 2, y + h / 2
    with t.gruppo(id, trasforma=f"rotate({rot} {n(cx)} {n(cy)})"):
        t.rett(x, y, w, h, 14, fill="#FFFFFF", id=id + "-fondo", filtro=t.ombra(6, 18, "#0A1E55", 0.3))
        for i, r in enumerate(righe):
            yy = y + 16 + i * (h - 26) / len(righe)
            t.rett(x + 12, yy, 22, 22, 6, fill=BLU_T, id=f"casella-{i+1}")
            t.icona("spunta", x + 15, yy + 3, 16, "#FFFFFF", 3)
            t.rett(x + 44, yy + 3, w - 60 - (i % 2) * 18, 6, 3, fill="#BFD3F2", id=f"riga-testo-{i+1}")
            t.rett(x + 44, yy + 14, w - 80 - ((i + 1) % 2) * 22, 5, 2.5, fill="#DCE7F8")
        if bandiera:
            bandiera_uk(t, x + w * 0.52, y - 4, 36, id="bandiera-regno-unito")


def t5(t, w=177, h=424):
    p = f("t48_5", 767, 9, w, h, RC_CHROME(w, h) + [(36, 100, 176, 220), (w - 40, 220, w, 330)], dil=9)
    t.foto(p, 0, 0, w, h, id="foto-edificio")
    with t.gruppo("titolo-reel"):
        t.testo("3", 12, 144, 50, 800, "#0A1633", id="titolo-numero")
        t.rett(48, 108, 120, 100, 14, fill="#FFFFFF", opacita=0.95, id="titolo-pannello", filtro=t.ombra(3, 10, "#0A1E55", 0.2))
        t.testo("consigli", 60, 139, 22, 800, "#0A1633", id="titolo-consigli")
        t.testo("per l'OFA", 60, 162, 22, 800, "#0A1633", id="titolo-per-ofa")
        t.testo("di inglese", 60, 185, 22, 800, "#0A1633", id="titolo-di-inglese")
    t.rett(w - 38, 226, 38, 172, 0, fill=t.sfumatura(["#0A1633", "#0A1633"]), opacita=0.28, id="velo-colonna-azioni")
    card_checklist(t, 12, 232, 128, 112, ["a", "b", "c"], rot=-5)
    reel_chrome(t, w, h, ("13.5K", "90", "2.3K"), ("Salvali subito!",))


def t6(t, w=183, h=424):
    p = f("t48_6", 951, 9, w, h, RC_CHROME(w, h) + [(8, 60, 175, 200), (90, 50, 140, 90)])
    t.foto(p, 0, 0, w, h, id="foto-studente-di-spalle")
    reel_chrome(t, w, h, ("10.5K", "127", "2.3K"), ("Dal Polimi", "al tuo futuro."))
    corsivo(t, ["SMALL", "STEPS", "BIG", "OPPORTUNITIES"], 14, 96, 17, rot=-13, passo=25)
    stella4(t, 118, 61, 12, "#FFFFFF", id="scintilla")


def t7(t, w=186, h=424):
    p = f("t48_7", 1141, 9, w, h, RC_CHROME(w, h) + [(20, 50, 150, 160), (60, 160, 175, 280)], dil=9)
    t.foto(p, 0, 0, w, h, id="foto-studente-che-spiega")
    reel_chrome(t, w, h, ("9.2K", "184", "890"), ("Evitali con AddiOFA.",))
    with t.gruppo("fumetto"):
        t.path("M28 52H146a12 12 0 0 1 12 12V132a12 12 0 0 1-12 12H58L36 160V144H28a12 12 0 0 1-12-12V64a12 12 0 0 1 12-12z", fill="#FFFFFF", id="fumetto-fondo", filtro=t.ombra(3, 10, "#0A1E55", 0.25))
        for i, r in enumerate(["Errori comuni", "all'OFA", "di inglese"]):
            t.testo(r, 28, 84 + i * 22, 19, 800, "#0A1633", spaziatura=-0.3, id=f"fumetto-riga-{i+1}")
    with t.gruppo("elenco-errori"):
        t.rett(80, 160, 102, 116, 10, fill="#F7F9FD", id="elenco-fondo", filtro=t.ombra(3, 10, "#0A1E55", 0.2))
        for i, r in enumerate(["Tempi verbali", "Preposizioni", "Reading", "Listening"]):
            yy = 178 + i * 26
            t.cerchio(95, yy, 8, fill="#E5383B", id=f"errore-{i+1}")
            t.icona("x", 90, yy - 5, 10, "#FFFFFF", 3)
            t.testo(r, 109, yy + 4, 10.6, 500, "#10244E", id=f"errore-{i+1}-testo")


def t8(t, w=191, h=424):
    p = f("t48_8", 1335, 9, w, h, RC_CHROME(w, h) + [(0, 20, 190, 60)])
    t.foto(p, 0, 0, w, h, id="foto-sfondo-mano")
    reel_chrome(t, w, h, ("7.6K", "92", "1.1K"), ("Più preparazione.", "Più opportunità."))

    def schermo(tt, x, y, ww, hh):
        s = ww / 150
        tt.testo("AddiOFA", x + ww / 2, y + 31 * s, 7.5 * s, 700, NAVY, ancora="middle")
        tt.rett(x + 12 * s, y + 52 * s, ww - 24 * s, 128 * s, 9 * s, fill="#FFFFFF", id="scheda-risultato", stroke="#E0E7F2", sw=1)
        tt.testo("Quiz completato!", x + 22 * s, y + 70 * s, 9.5 * s, 700, NAVY)
        tt.path(f"M{n(x+42*s)} {n(y+118*s)}A{n(34*s)} {n(34*s)} 0 0 1 {n(x+108*s)} {n(y+118*s)}", stroke="#E5383B", sw=7 * s, id="arco")
        tt.testo("82%", x + 75 * s, y + 118 * s, 17 * s, 800, "#E5383B", ancora="middle")
        tt.testo("Probabilità di non", x + 75 * s, y + 132 * s, 6 * s, 500, "#2A3447", ancora="middle")
        tt.testo("superare l'OFA", x + 75 * s, y + 140 * s, 6 * s, 500, "#2A3447", ancora="middle")
        for i, r in enumerate(["Simulazioni illimitate", "Spiegazioni dettagliate", "Consigli personalizzati"]):
            yy = y + 152 * s + i * 24 * s
            tt.rett(x + 18 * s, yy - 9 * s, ww - 36 * s, 20 * s, 6 * s, fill="#EEF3FB")
            tt.cerchio(x + 29 * s, yy + 1 * s, 5 * s, fill=BLU_T)
            tt.testo(r, x + 40 * s, yy + 3 * s, 6.2 * s, 500, "#2A3447")
        tt.rett(x + 12 * s, y + 252 * s, ww - 24 * s, 26 * s, 9 * s, fill="#2A63F0", id="pulsante-inizia")
        tt.testo("Inizia a prepararti", x + ww / 2, y + 269 * s, 7.8 * s, 600, "#FFFFFF", ancora="middle")
    telefono(t, 3, 40, 170, 336, id="telefono-quiz", rot=-2, schermo=schermo)
