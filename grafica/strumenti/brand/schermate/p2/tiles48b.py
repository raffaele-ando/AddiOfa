"""Reel, caroselli, post informativo e post meme dell'immagine 48 (riga centrale e bassa). Coordinate ASSOLUTE della sorgente."""
from lib import *

SORG = S48


def fa(nome, box, rects, **k):
    return foto_pulita(SORG, box, nome, rects, **k)


def icona_reel_cam(t, cx, cy, s, col="#FFFFFF"):
    t.rett(cx - s / 2, cy - s / 2, s, s, s * 0.3, fill="none", stroke=col, sw=1.6, id="icona-fotocamera")
    t.cerchio(cx, cy, s * 0.2, fill="none", stroke=col, sw=1.4)


def reel_testata(t, x, y, w, col="#FFFFFF"):
    icona_reel_cam(t, x + 16, y + 17, 12, col)
    wordmark(t, x + 30, y + 22, 13, col=col, col_o=col, id="wordmark-in-alto")
    for k in range(3):
        t.cerchio(x + w - 24 + k * 6.5, y + 19, 1.5, fill=col, id=f"icona-altro-{k+1}")


def reel_piede(t, x, y, h, testo, col="#FFFFFF"):
    ico_play(t, x + 13, y + h - 17, 10, col)
    t.testo(testo, x + 26, y + h - 12.5, 11.5, 500, col, id="visualizzazioni")


def chip_bianco(t, x, y, w, h, testo, corpo=12.5, rot=-3, id="etichetta"):
    cx, cy = x + w / 2, y + h / 2
    with t.gruppo(id, trasforma=f"rotate({rot} {n(cx)} {n(cy)})"):
        t.rett(x, y, w, h, h * 0.42, fill="#FFFFFF", filtro=t.ombra(2, 8, "#0A1633", 0.25), id=id + "-fondo")
        t.testo(testo, cx, cy + corpo * 0.36, corpo, 700, NAVY, ancora="middle")


# ---------------------------------------------------------------------------------------------------- reel
def reel1(t):       # 13,729  168x277
    x, y, w, h = 13, 729, 168, 277
    p = fa("t48_r1", (x, y, x + w, y + h), [(x + 12, y + 8, x + 100, y + 38), (x + 140, y + 8, x + 166, y + 36), (x + 8, y + 88, x + 160, y + 160), (x + 5, y + 244, x + 80, y + 272)])
    t.foto(p, x, y, w, h, id="foto-scrivania-laptop")
    reel_testata(t, x, y, w)
    for i, r in enumerate(["Una giornata", "di studio per", "l'OFA di inglese"]):
        t.testo(r, x + 20, y + 102 + i * 20, 15.5, 700, "#FFFFFF", id=f"titolo-riga-{i+1}")
    chip_bianco(t, x + 47, y + 156, 76, 24, "Realistica.", 11.5)
    reel_piede(t, x, y, h, "9.4K")


def reel2(t):       # 195,729 173x277
    x, y, w, h = 195, 729, 173, 277
    p = fa("t48_r2", (x, y, x + w, y + h), [(x + 8, y + 8, x + 100, y + 36), (x + 135, y + 8, x + 168, y + 36), (x + 8, y + 160, x + 160, y + 235), (x + 5, y + 244, x + 80, y + 272)])
    t.foto(p, x, y, w, h, id="foto-testimonianza")
    reel_testata(t, x, y, w)
    for i, r in enumerate(["“Pensavo", "fosse impossibile.", "Con AddiOFA", "l'ho superato", "al primo tentativo.”"]):
        t.testo(r, x + 14, y + 174 + i * 19, 14.5, 600, "#FFFFFF", id=f"citazione-riga-{i+1}")
    reel_piede(t, x, y, h, "21.6K")


def reel3(t):       # 381,729 180x277 : miti vs realta'
    x, y, w, h = 381, 729, 180, 277
    t.rett(x, y, w, h, 8, fill=t.sfumatura(["#8A99B3", "#6C7C99", "#56657F"]), id="fondo-sfumato")
    reel_testata(t, x, y, w)
    t.rett(x + 10, y + 40, w - 20, 87, 10, fill="#FFFFFF", id="scheda-mito", filtro=t.ombra(2, 8, "#0A1633", 0.2))
    pillola(t, x + 20, y + 50, 38, 19, "#E5383B", "Mito", "#FFFFFF", 10.5, id="etichetta-mito")
    t.testo("\"L'OFA è", x + 22, y + 90, 12, 500, "#10244E", id="mito-riga-1")
    t.testo("solo grammatica.\"", x + 22, y + 106, 12, 500, "#10244E", id="mito-riga-2")
    t.path(f"M{x+137} {y+98}l16 16M{x+153} {y+98}l-16 16", stroke="#E5383B", sw=3.6, id="mito-croce")
    t.rett(x + 10, y + 134, w - 20, 100, 10, fill="#FFFFFF", id="scheda-realta", filtro=t.ombra(2, 8, "#0A1633", 0.2))
    pillola(t, x + 20, y + 144, 46, 19, "#1A63F2", "Realtà", "#FFFFFF", 10.5, id="etichetta-realta")
    for i, r in enumerate(["Ci sono reading,", "listening e comprensione.", "Serve una preparazione", "completa."]):
        t.testo(r, x + 22, y + 181 + i * 14.5, 11, 500, "#10244E", id=f"realta-riga-{i+1}")
    t.cerchio(x + 150, y + 160 - 24 + 14, 11, fill="#2FB45A", id="realta-spunta-tondo")
    t.icona("spunta", x + 142, y + 142, 16, "#FFFFFF", 3)
    reel_piede(t, x, y, h, "18.2K")


def reel4(t):       # 573,729 182x277 : walkthrough
    x, y, w, h = 573, 729, 182, 277
    t.rett(x, y, w, h, 8, fill=t.sfumatura(["#1B3C85", "#4A75C8", "#8FB0E4"]), id="fondo-sfumato")
    reel_testata(t, x, y, w)
    t.rett(x + 10, y + 42, w - 20, 62, 10, fill="#1E3F8E", opacita=0.9, id="titolo-pannello")
    for i, r in enumerate(["Dal quiz", "al piano di studio", "personalizzato."]):
        t.testo(r, x + 20, y + 62 + i * 18, 14.5, 700, "#FFFFFF", id=f"titolo-riga-{i+1}")

    def sch(tt, sx, sy, sw, sh):
        s = sw / 135
        tt.testo("Il tuo piano", sx + 14 * s, sy + 54 * s, 8.5 * s, 700, NAVY)
        for i, (r, col) in enumerate([("Simulazioni", "#F5B323"), ("Quiz mirati", "#2A63F0"), ("Spiegazioni", "#E5383B"), ("Statistiche", "#E5383B")]):
            yy = sy + 72 * s + i * 21 * s
            tt.rett(sx + 12 * s, yy - 8 * s, sw - 24 * s, 17 * s, 5 * s, fill="#F3F6FC")
            tt.rett(sx + 17 * s, yy - 5 * s, 11 * s, 11 * s, 3 * s, fill=col)
            tt.testo(r, sx + 36 * s, yy + 3 * s, 6.4 * s, 500, "#2A3447")
        tt.rett(sx + 12 * s, sy + 160 * s, sw - 24 * s, 17 * s, 8 * s, fill="#2A63F0")
        tt.testo("Inizia ora", sx + sw / 2, sy + 171.5 * s, 6.6 * s, 600, "#FFFFFF", ancora="middle")
    cidr = clip_rett(t, x, y, w, h, 8)
    with t.gruppo("telefono-clip", clip=cidr):
        telefono(t, x + 28, y + 112, 128, 200, id="telefono-piano", schermo=sch)
        scrim_basso(t, x, y, w, h, 60, "#10204A", 0.6)
    reel_piede(t, x, y, h, "11.9K")


def reel5(t):       # 765,729 173x277
    x, y, w, h = 765, 729, 173, 277
    p = fa("t48_r5", (x, y, x + w, y + h), [(x + 8, y + 8, x + 100, y + 36), (x + 135, y + 8, x + 168, y + 36), (x + 8, y + 30, x + 160, y + 92), (x + 5, y + 244, x + 80, y + 272)])
    t.foto(p, x, y, w, h, id="foto-scala-studente")
    reel_testata(t, x, y, w)
    corsivo(t, ["SMALL", "STEPS", "BIG", "OPPORTUNITIES"], x + 8, y + 50, 15, rot=-14, passo=20)
    stella4(t, x + 140, y + 100, 9, "#FFFFFF", id="scintilla")
    reel_piede(t, x, y, h, "27.4K")


# ---------------------------------------------------------------------------------------------------- caroselli
def pulsante_tondo_pallido(t, cx, cy, r=12):
    t.cerchio(cx, cy, r, fill="#FFFFFF", id="pulsante-avanti", filtro=t.ombra(1, 5, "#0A1633", 0.18))
    t.icona("freccia-destra", cx - r * 0.5, cy - r * 0.5, r, "#0A1633", 2.4)


def carosello_educativo(t):
    # cover
    x, y, w, h = 19, 474, 166, 212
    pannello_chiaro(t, x, y, w, h, 12, id="slide-0-copertina")
    p = fa("t48_c1", (x, y + 98, x + w, y + h), [(x + w - 40, y + h - 46, x + w, y + h)], dil=9)
    cid = clip_rett(t, x, y + 98, w, h - 98, 0)
    cid2 = clip_rett(t, x, y, w, h, 12)
    with t.gruppo("slide-0-foto", clip=cid2):
        t.foto(p, x, y + 98, w, h - 98, id="foto-edificio-polimi")
    intestazione_post(t, x + 8, y + 10, 140, "1/6")
    for i, r in enumerate(["Come funziona", "l'OFA di inglese", "al Polimi?"]):
        t.testo(r, x + 9, y + 55 + i * 21, 16.5, 800, NAVY, spaziatura=-0.3, id=f"titolo-riga-{i+1}")
    pulsante_tondo_pallido(t, x + w - 20, y + h - 21, 13)
    # slide 1..3
    def numero(xx, yy, num, righe, sotto=None):
        t.testo(num, xx + 11, yy + 40, 26, 800, BLU_T, id=f"numero-{num}")
        for i, r in enumerate(righe):
            t.testo(r, xx + 11, yy + 65 + i * 16.5, 13.4, 800, NAVY, id=f"titolo-{num}-riga-{i+1}")
    pannello_chiaro(t, 192, 474, 109, 212, 10, id="slide-1")
    numero(192, 474, "1", ["È un test", "obbligatorio", "di inglese."])
    for i, r in enumerate(["Se non lo superi,", "il tuo piano di studi", "viene bloccato."]):
        t.testo(r, 203, 474 + 143 + i * 13.5, 10, 400, "#2A3447", id=f"testo-1-riga-{i+1}")
    pannello_chiaro(t, 304, 474, 109, 212, 10, id="slide-2")
    numero(304, 474, "2", ["Verifica il", "tuo livello."])
    for i, r in enumerate(["Puoi farlo con il nostro", "quiz gratuito in", "3 minuti."]):
        t.testo(r, 315, 474 + 113 + i * 12, 8.8, 400, "#2A3447", id=f"testo-2-riga-{i+1}")

    def sch(tt, sx, sy, sw, sh):
        s = sw / 70
        tt.testo("AddiOFA", sx + sw / 2, sy + 22 * s, 5.5 * s, 700, NAVY, ancora="middle")
        tt.rett(sx + 6 * s, sy + 32 * s, sw - 12 * s, 20 * s, 5 * s, fill="#EAF1FE")
    cidm = clip_rett(t, 304, 474, 109, 212, 10)
    with t.gruppo("telefono-clip", clip=cidm):
        telefono(t, 334, 624, 74, 130, id="telefono-mini", rot=-5, schermo=sch)
    pannello_chiaro(t, 416, 474, 109, 212, 10, id="slide-3")
    numero(416, 474, "3", ["Preparati", "in modo mirato."])
    for i, r in enumerate(["Simulazioni reali", "Spiegazioni chiare", "Statistiche sui progressi"]):
        yy = 474 + 128 + i * 31
        t.rett(425, yy, 92, 22, 6, fill="#F6F9FF", stroke="#E3EBF8", sw=1, id=f"voce-{i+1}")
        t.rett(430, yy + 5, 12, 12, 3.5, fill=BLU_T, id=f"casella-{i+1}")
        t.icona("spunta", 431.5, yy + 6.5, 9, "#FFFFFF", 3.4)
        t.testo(r, 447, yy + 14.5, 6.7, 500, "#2A3447")
    # slide 4: foto + scheda azzurra
    p = fa("t48_c4", (528, 474, 738, 686), [(536, 516, 640, 600)], dil=9)
    cid4 = clip_rett(t, 528, 474, 210, 212, 12)
    with t.gruppo("slide-4", clip=cid4):
        t.foto(p, 528, 474, 210, 212, id="foto-edificio-sole")
        t.rett(528, 496, 112, 98, 0, fill=t.sfumatura([(0, "#EEF3FA"), (1, "#EEF3FA")]), opacita=0.78, id="velo-testo")
        t.testo("4", 540, 520, 26, 800, BLU_T, id="numero-4")
        for i, r in enumerate(["Supera l'OFA", "e sblocca il tuo", "futuro."]):
            t.testo(r, 540, 546 + i * 16.5, 13.4, 800, NAVY, id=f"titolo-4-riga-{i+1}")
        t.rett(640, 596, 98, 90, 6, fill=t.sfumatura(["#4E93FA", "#2F6EF0"]), id="scheda-azzurra")
        for i, r in enumerate(["Stessi studenti.", "Percorsi", "più luminosi."]):
            t.testo(r, 650 + i * 2, 624 + i * 17, 11.5, 400, "#FFFFFF", id=f"scheda-azzurra-riga-{i+1}")
        pulsante_tondo_pallido(t, 725, 667, 12)


def icona_euro_tondo(t, cx, cy, r):
    t.cerchio(cx, cy, r, fill=t.sfumatura(["#5B96F7", "#2A63F0"]), id="icona-moneta")
    t.testo("€", cx, cy + r * 0.38, r * 1.15, 700, "#FFFFFF", ancora="middle")


def icona_cervello(t, cx, cy, s):
    with t.gruppo("icona-cervello"):
        t.path(f"M{n(cx)} {n(cy - s*0.45)}C{n(cx - s*0.55)} {n(cy - s*0.6)} {n(cx - s*0.85)} {n(cy - s*0.1)} {n(cx - s*0.6)} {n(cy + s*0.15)}C{n(cx - s*0.8)} {n(cy + s*0.45)} {n(cx - s*0.35)} {n(cy + s*0.7)} {n(cx)} {n(cy + s*0.5)}"
               f"C{n(cx + s*0.35)} {n(cy + s*0.7)} {n(cx + s*0.8)} {n(cy + s*0.45)} {n(cx + s*0.6)} {n(cy + s*0.15)}C{n(cx + s*0.85)} {n(cy - s*0.1)} {n(cx + s*0.55)} {n(cy - s*0.6)} {n(cx)} {n(cy - s*0.45)}z",
               fill=t.sfumatura(["#6FA6FA", "#3B73EE"]))
        t.path(f"M{n(cx)} {n(cy - s*0.4)}V{n(cy + s*0.45)}M{n(cx - s*0.45)} {n(cy - s*0.05)}H{n(cx)}M{n(cx)} {n(cy + s*0.12)}H{n(cx + s*0.45)}", stroke="#FFFFFF", sw=s * 0.08, opacita=0.8)


def carosello_dati(t):
    # slide 1
    x, y, w, h = 758, 473, 160, 228
    pannello_chiaro(t, x, y, w, h, 12, id="slide-1")
    intestazione_post(t, x + 8, y + 10, 142, "1/5")
    for i, r in enumerate(["5 motivi per", "non rimandare", "l'OFA di inglese"]):
        t.testo(r, x + 10, y + 70 + i * 21, 17, 800, NAVY, spaziatura=-0.3, id=f"titolo-riga-{i+1}")

    def sch(tt, sx, sy, sw, sh):
        tt.rett(sx, sy, sw, sh, 0, fill=tt.sfumatura(["#F2F7FF", "#D8E7FD"]))
        stella4(tt, sx + sw / 2, sy + sh * 0.42, sw * 0.28, BLU_T, id="stella-schermo", curva=0.14)
    cidp = clip_rett(t, x, y, w, h, 12)
    with t.gruppo("telefono-clip", clip=cidp):
        telefono(t, x + 10, y + 124, 138, 190, id="telefono-stella", rot=-3, schermo=sch)
    # slide 2: elenco
    pannello_chiaro(t, 925, 474, 253, 226, 12, id="slide-2-elenco")
    righe = [("1", ["Rischi di perdere", "in media 30€"], 1), ("2", ["Blocca il piano", "di studi."], 1), ("3", ["Non puoi sostenere", "alcuni esami."], 0),
             ("4", ["Ti aggiunge", "stress inutile."], 0), ("5", ["È più facile", "di quanto pensi", "con il giusto metodo."], 2)]
    yy = 497
    for num, rr, bold in righe:
        n_r = len(rr)
        t.testo(num, 940, yy + 7, 16, 500, BLU_T, id=f"numero-{num}")
        for j, r in enumerate(rr):
            peso = 800 if (j == len(rr) - 1 and bold) or (bold == 2 and j == 1) else 500
            if num == "1" and j == 1: peso = 800
            if num == "2" and j == 1: peso = 800
            t.testo(r, 962, yy + 3 + j * 13.5 - (n_r - 2) * 3, 10.8, peso if peso == 800 else 500, "#10244E", id=f"voce-{num}-riga-{j+1}")
        yy += 41
    # icone a destra
    ic = {1: lambda c, d: icona_euro_tondo(t, 1105, 495 + 0, 11), 2: None}
    t.rett(1086, 484, 70, 24, 12, fill="#F3F7FE", stroke="#DCE6F7", sw=1, id="icona-1-sfondo")
    icona_euro_tondo(t, 1100, 496, 10)
    t.path("M1118 496c14-14 26 14 36 0", stroke="#6FA6FA", sw=2, id="icona-1-infinito")
    t.rett(1124, 519, 22, 18, 5, fill=t.sfumatura(["#7FAEFA", "#3B73EE"]), id="icona-2-lucchetto-corpo")
    t.path("M1129 519v-5a6 6 0 0 1 12 0v5", stroke="#5B8CF0", sw=2.4, id="icona-2-lucchetto-arco")
    t.cerchio(1135, 576, 12, fill=t.sfumatura(["#9DC1FA", "#5B8CF0"]), id="icona-3-tondo")
    t.path("M1129 570l12 12M1141 570l-12 12", stroke="#FFFFFF", sw=2.6)
    icona_cervello(t, 1135, 617, 22)
    for k, (hh, xx) in enumerate([(9, 1129), (15, 1136), (22, 1143)]):
        t.rett(xx - 2, 668 - hh + 8, 6, hh + 4, 2, fill=BLU_T, id=f"icona-5-barra-{k+1}")


def carosello_tips(t):
    pannello_chiaro(t, 1196, 473, 127, 213, 12, id="slide-tip-del-giorno")
    logo_mini(t, 1205, 479, 17)
    wordmark(t, 1227, 491, 11.5, col=NAVY, col_o=BLU_T, id="wordmark-testata")
    t.testo("1/5", 1316, 489, 8.5, 500, "#6B7280", ancora="end", id="numero-pagina")
    wt = t.testo("Tip", 1205, 526, 22, 800, BLU_T, id="titolo-tip", spaziatura=-0.4)
    t.testo("del giorno", 1205 + wt + 4, 526, 17, 800, BLU_T, id="titolo-del-giorno", spaziatura=-0.4)
    t.testo("Reading", 1205, 552, 21, 800, NAVY, id="titolo-reading")
    t.illustrazione("kit-blu/illustrazioni/suggerimenti-consigli", 1204, 566, 112, id="lampadina")
    t.cerchio(1221, 662, 12, fill="#FFFFFF", id="pulsante-indietro", filtro=t.ombra(1, 5, "#0A1633", 0.15))
    t.icona("freccia-sinistra", 1214, 655, 14, NAVY, 2.2)
    cid = clip_rett(t, 1323, 473, 213, 213, 0)
    with t.gruppo("slide-1-2", clip=cid):
        pannello_chiaro(t, 1328, 473, 118, 213, 12, id="slide-1")
        t.testo("1", 1341, 515, 26, 800, BLU_T, id="numero-1")
        t.testo("Leggi prima", 1341, 541, 14, 800, NAVY, id="titolo-1-riga-1")
        t.testo("la domanda.", 1341, 558, 14, 800, NAVY, id="titolo-1-riga-2")
        for i, r in enumerate(["Ti aiuta a capire", "cosa cercare nel testo", "e risparmiare tempo."]):
            t.testo(r, 1341, 592 + i * 13.5, 9.6, 400, "#4B5563", id=f"testo-1-riga-{i+1}")
        # fogli decorativi
        with t.gruppo("fogli-decorativi", opacita=0.9):
            t.rett(1348, 626, 72, 46, 9, fill="#DCE8FB", id="foglio-dietro")
            t.rett(1336, 636, 84, 50, 9, fill="#EAF1FE", id="foglio-davanti", filtro=t.ombra(2, 8, "#4C7CE0", 0.15))
            t.rett(1362, 650, 40, 6, 3, fill="#BFD3F2"); t.rett(1362, 662, 52, 6, 3, fill="#CFDDF6")
        pannello_chiaro(t, 1452, 473, 130, 213, 12, id="slide-2-tagliata")
        t.testo("2", 1465, 515, 26, 800, BLU_T, id="numero-2")
        t.testo("Individua", 1465, 541, 14, 800, NAVY, id="titolo-2-riga-1")
        t.testo("le parole chiave.", 1465, 558, 14, 800, NAVY, id="titolo-2-riga-2")
        with t.gruppo("fogli-decorativi-2", opacita=0.9):
            t.rett(1470, 610, 80, 64, 9, fill="#EAF1FE", filtro=t.ombra(2, 8, "#4C7CE0", 0.15))
            t.rett(1482, 628, 44, 6, 3, fill="#BFD3F2"); t.rett(1482, 642, 56, 6, 3, fill="#CFDDF6")


# ---------------------------------------------------------------------------------------------------- post informativo e meme
def post_informativo(t):
    x0, y0, x1, y1 = 958, 733, 1286, 995
    t.rett(x0, y0, x1 - x0, y1 - y0, 12, fill=t.sfumatura(["#FFFFFF", "#F6F9FF"]), id="scheda-post", filtro=t.ombra(2, 10, "#4C7CE0", 0.12))
    logo_mini(t, 970, 744, 17)
    wordmark(t, 992, 757, 12, col=NAVY, col_o=BLU_T, id="wordmark-testata")
    for i, r in enumerate(["Cosa succede", "se non superi", "l'OFA?"]):
        parts = [("Cosa ", BLU_T, 800), ("succede", BLU_T, 800)] if i == 0 else None
        t.testo(r, 970, 787 + i * 21, 20, 800, BLU_T if i == 0 else NAVY, spaziatura=-0.3, id=f"titolo-riga-{i+1}")
    voci = [("Piano di studi bloccato", None), ("Non puoi sostenere", "alcuni esami"), ("Rischio di perdere", "circa 30€"), ("Stress e ritardi inutili", None)]
    for i, (a, b) in enumerate(voci):
        yy = 858 + i * 36
        t.cerchio(985, yy, 12, fill="#E7F0FE", id=f"voce-{i+1}-tondo")
        if i == 0:
            t.rett(979, yy - 5, 12, 10, 2, fill=BLU_T)
        elif i == 1:
            t.icona("documento", 977, yy - 8, 16, BLU_T, 2)
        elif i == 2:
            t.testo("€", 985, yy + 5, 14, 700, BLU_T, ancora="middle")
        else:
            t.icona("orologio", 977, yy - 8, 16, BLU_T, 2)
        if b:
            t.testo(a, 1013, yy - 2, 10, 400, "#2A3447", id=f"voce-{i+1}-riga-1")
            t.testo(b, 1013, yy + 12, 10, 700 if "30" in b else 400, "#2A3447", id=f"voce-{i+1}-riga-2")
        else:
            t.testo(a, 1013, yy + 4, 10, 400, "#2A3447", id=f"voce-{i+1}-riga-1")
    # pannello foto inclinato con stella
    p = fa("t48_pi", (1121, 739, 1278, 991), [(1138, 770, 1200, 835)], dil=9)
    with t.gruppo("pannello-foto-inclinato"):
        cidp = clip_rett(t, 1121, 739, 157, 252, 10)
        with t.gruppo("pannello-foto-clip", clip=cidp):
            t.foto(p, 1121, 739, 157, 252, id="foto-edificio-polimi")
        stella4(t, 1168, 801, 22, BLU_T, id="stella-blu", curva=0.14)
        stella4(t, 1250, 773, 6, "#FFFFFF", id="scintilla")


def post_meme(t):
    x0, y0, x1, y1 = 1304, 764, 1520, 983
    t.rett(x0, y0, x1 - x0, y1 - y0, 12, fill="#FFFFFF", id="scheda-post", filtro=t.ombra(2, 10, "#4C7CE0", 0.14))
    logo_mini(t, 1311, 775, 16)
    wordmark(t, 1332, 787, 11, col=NAVY, col_o=BLU_T, id="wordmark-testata")
    for k in range(3):
        t.cerchio(1498 + k * 5.5, 782, 1.4, fill=NAVY, id=f"icona-altro-{k+1}")
    t.testo("Tu nello speaking test:", 1311, 812, 13, 800, NAVY, spaziatura=-0.2, id="titolo")
    p = fa("t48_meme", (1308, 820, 1516, 951), [(1318, 905, 1506, 948)], dil=11)
    cid = clip_rett(t, 1308, 820, 208, 131, 6)
    with t.gruppo("foto-cane-clip", clip=cid):
        t.foto(p, 1308, 820, 208, 131, id="foto-cane-con-cuffie")
    t.rett(1322, 872, 174, 80, 16, fill="#E8E9EB", id="nuvoletta-fondo")
    for i, r in enumerate(["I go... to the... ehm...", "Polimi... because...", "opportunities... yes?"]):
        t.testo(r, 1331, 897 + i * 20, 13.4, 500, "#111827", id=f"nuvoletta-riga-{i+1}")
    for i, (fn, lab) in enumerate([(ico_cuore, "4.2K"), (ico_commento, "73"), (ico_condividi, "412"), (ico_segnalibro, "268")]):
        cx = 1316 + i * 54
        if fn is ico_cuore:
            t.path(f"M{cx+7} {972}c-9-6-9-12-4-12 2 0 3 2 4 3 1-1 2-3 4-3 5 0 5 6-4 12z", stroke=NAVY, sw=1.4, id="icona-cuore")
        elif fn is ico_commento:
            t.cerchio(cx + 7, 968, 6.5, fill="none", stroke=NAVY, sw=1.4, id="icona-commento")
        elif fn is ico_condividi:
            t.path(f"M{cx} 972L{cx+14} 962L{cx+8} 975L{cx+6} 969z", stroke=NAVY, sw=1.3, id="icona-condividi")
        else:
            t.path(f"M{cx+2} 961h10v14l-5-4-5 4z", stroke=NAVY, sw=1.4, id="icona-salva")
        t.testo(lab, cx + 18, 972, 9.4, 500, NAVY, id=f"conteggio-{lab}")
