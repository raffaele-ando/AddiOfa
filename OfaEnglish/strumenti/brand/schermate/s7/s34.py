"""Schermate dell'immagine 34 (flusso schermate C: splash, onboarding, test ATLAS, home, studia, lezione, esercizio,
simulazioni, risultato, classifica NOI, sfida, discussione Agorà, profilo, impostazioni). Coordinate = px dei ritagli.
Corregge: nav a 3 voci uniforme, avatar-foto -> avatar neutri, 34.003 è UN ritaglio con DUE schermate (test / risultati: due SVG)."""
from componenti import *

G = lambda n_: nuova(34, n_)


def splash():
    t = G(1)
    X, Y, s = t.X, t.Y, t.s
    t.rett(0, 0, t.w, t.h, 22, fill=t.sfumatura(["#1478FB", "#0A68F2"]), id="schermata-fondo-blu")
    stato(t, y=48, scuro=True)
    # onde chiare in basso (come l'originale, un'unica massa morbida più chiara con un secondo livello)
    t.path(f"M0 {n(Y(388))}C{n(X(40))} {n(Y(350))} {n(X(100))} {n(Y(340))} {n(X(135))} {n(Y(345))}C{n(X(175))} {n(Y(352))} {n(X(190))} {n(Y(400))} {n(X(192))} {n(Y(470))}"
           f"L0 {n(Y(475))}z", fill="#2F8BFB", opacita=0.85, id="onda-chiara")
    t.path(f"M0 {n(Y(425))}C{n(X(30))} {n(Y(405))} {n(X(70))} {n(Y(398))} {n(X(105))} {n(Y(412))}C{n(X(150))} {n(Y(430))} {n(X(165))} {n(Y(455))} {n(X(168))} {n(Y(475))}L0 {n(Y(475))}z",
           fill="#52A0FC", opacita=0.55, id="onda-media")
    logo = corpo_per("AddiOfa", 126, 800)
    t.testo("AddiOfa", X(99), Y(215), s(logo), 800, "#FFFFFF", "middle", id="logo-addiofa")
    tx(t, "Supera l’OFA di inglese.", 99, 252, w=127, col="#EAF3FF", ancora="middle", id="slogan-1")
    tx(t, "Senza blocchi.", 99, 270, w=78, col="#EAF3FF", ancora="middle", id="slogan-2")
    chiudi(t)


def onboarding():
    t = nuova(34, 2); X, Y, s = t.X, t.Y, t.s
    stato(t, y=20, mx=None) if False else stato(t, y=20)
    logo_testo(t, 130, 94, 103)
    for i, (a, w_) in enumerate((("Studia in modo mirato", 100), ("con un percorso personalizzato", 164))):
        tx(t, a, 130, 129 + 17 * i, w=w_, col="#5B6B8C", ancora="middle", id=f"tagline-{i+1}")
    multi(t, [("grazie all’intelligenza di ", "#5B6B8C", 400), ("ATLAS.", BL, 700)], 130, 163, 9.2, ancora="middle", id="tagline-3")
    documenti(t, 130, 268, 0.98)
    for i, x in enumerate((109, 129, 149)):
        t.cerchio(X(x), Y(365), s(3.6), fill=BL if i == 0 else "#D6DFEE", id=f"punto-{i+1}")
    pulsante(t, 43, 389, 217, 428, "Inizia", w=30)
    chiudi(t)


def test_iniziale():
    t = nuova(34, "3a"); X, Y, s = t.X, t.Y, t.s
    stato(t, y=22)
    indietro(t, 15, 45)
    barra_prog(t, 37, 150, 45, 0.15)
    tx(t, "3/20", 181, 49, w=20, col="#5B6B8C", ancora="end", id="contatore")
    tx(t, "Choose the correct form.", 12, 93, w=146, peso=700, id="titolo")
    tx(t, "If I _____ more time,", 12, 129, w=132, col="#4B5B85", id="frase-1")
    tx(t, "I would travel.", 12, 148, w=83, col="#4B5B85", id="frase-2")
    for i, (a, sel) in enumerate((("have", 0), ("had", 1), ("will have", 0), ("would have", 0))):
        y0 = (169, 208, 245, 283)[i]; opzione(t, 11, y0, 185, y0 + 34, a, sel, corpo=8, id=f"opzione-{i+1}")
    card_atlas(t, 11, 368, 186, 435, ["adatta le domande al tuo livello", "in tempo reale."], titolo=[("ATLAS", NAVY, 700)], mx=56, corpo=5.8)
    chiudi(t)


def risultati_test():
    t = nuova(34, "3b"); X, Y, s = t.X, t.Y, t.s
    stato(t, y=22)
    tx(t, "Il tuo livello", 228, 61, w=96, peso=800, id="titolo")
    t.icona("cerchio-info", X(337) - s(5.5), Y(54) - s(5.5), s(11), BL, 2.0, id="info")
    tx(t, "Analisi generata da ATLAS", 228, 82, w=131, col="#4B5B85", id="sottotitolo")
    radar(t, 323, 184, 57, [("Grammar", 72), ("Vocabulary", 58), ("Listening", 65), ("Reading", 78), ("Writing", 62)],
          etichette={0: (326, 108, 125), 1: (398, 157, 172), 2: (385, 243, 259), 3: (260, 243, 259), 4: (247, 157, 172)})
    card_atlas(t, 226, 299, 428, 367, ["ATLAS ha analizzato le tue", "risposte e ha creato un percorso", "personalizzato."], titolo=None, mx=277, corpo=6.0, id="card-atlas")
    # prima riga del testo (la scheda ha tre righe)
    pulsante(t, 226, 378, 428, 418, "Vai al tuo percorso", w=102)
    chiudi(t)


def radar(t, cx, cy, R, valori, etichette, col_ok="#0F9D5F", col_no="#E5303B"):
    X, Y, s = t.X, t.Y, t.s
    pts = lambda r: [(cx + r * math.sin(2 * math.pi * i / 5), cy - r * math.cos(2 * math.pi * i / 5)) for i in range(5)]
    def poly(P): return "M" + "L".join(f"{n(X(x))} {n(Y(y))}" for x, y in P) + "z"
    with t.gruppo("radar"):
        for k in (0.25, 0.5, 0.75, 1.0):
            t.path(poly(pts(R * k)), stroke="#DCE6F4", sw=s(0.5), fill="none")
        for x, y in pts(R):
            t.linea(X(cx), Y(cy), X(x), Y(y), "#E3EAF5", s(0.4))
        P = [(cx + R * v / 100 * math.sin(2 * math.pi * i / 5), cy - R * v / 100 * math.cos(2 * math.pi * i / 5)) for i, (_, v) in enumerate(valori)]
        t.path(poly(P), fill="#BBD5FA", stroke=BL, sw=s(1.1), opacita=1, id="radar-area", extra='fill-opacity="0.75"')
        for x, y in P: t.cerchio(X(x), Y(y), s(1.9), fill=BL)
    for i, (nome, v) in enumerate(valori):
        ex, yb, yp = etichette[i]
        tx(t, nome, ex, yb, corpo=6.6, peso=500, col="#4B5B85", ancora="middle", id=f"etichetta-{nome.lower()}")
        tx(t, f"{v}%", ex, yp, corpo=7.2, peso=700, col=col_ok if v >= 70 or v == 62 else col_no, ancora="middle", id=f"valore-{nome.lower()}")


def home():
    t = nuova(34, 4); X, Y, s = t.X, t.Y, t.s
    stato(t, y=13)
    logo_testo(t, 28, 44, 75, ancora="start")
    avatar_f(t, 190, 38, 12, 0, id="avatar-utente")
    t.misuratore(X(115), Y(160), s(79), 0.777, spessore=s(9.5), colore="#F0303B", chiaro="#FF7A7A", tacche=True)
    tx(t, "82%", 115, 149, w=53, peso=800, col="#E6121F", ancora="middle", id="percentuale")
    tx(t, "Rischio di fallimento", 115, 167, w=95, peso=600, col="#E6121F", ancora="middle")
    tx(t, "all’OFA di inglese", 115, 181.5, w=67, col="#6B7694", ancora="middle")
    card(t, 27, 199, 204, 265, 8, "#FDEEEE", id="prossimo-passo")
    tile_icona(t, "libro", 25, 212, 64, 257, id="tile-libro", ic=22)
    tx(t, "Prossimo passo", 75, 216, w=58, col="#7A8499")
    tx(t, "Future tenses", 75, 235, w=71, peso=700, id="lezione")
    t.icona("libro", X(75), Y(247.5), s(7), "#7A8499", 1.7)
    tx(t, "Lezione", 84, 252, w=29, corpo=5.6, col="#7A8499"); t.linea(X(121), Y(246), X(121), Y(254), "#CBD3E3", 1)
    t.icona("orologio", X(130), Y(247.5), s(7), "#7A8499", 1.7); tx(t, "10 min", 139, 252, w=26, corpo=5.6, col="#7A8499")
    t.linea(X(171), Y(246), X(171), Y(254), "#CBD3E3", 1); tx(t, "-6%", 182, 252, w=16, corpo=5.8, peso=700, col=BL)
    pulsante(t, 27, 268, 203, 304, "Inizia la lezione", w=73)
    tx(t, "Il tuo percorso", 28, 332, w=67, peso=700)
    percorso(t, [(37, 351, "82%", "Oggi", "#E6121F"), (107, 362, "62%", "Dopo 5 lezioni", "#5B6C92"), (182, 368, "28%", "Dopo 15 lezioni", BL)], 384, 397)
    nav(t, NAV3, 0, 411, x0=13, x1=216)
    chiudi(t)


def percorso(t, punti, yv, yd):
    X, Y, s = t.X, t.Y, t.s
    g = t.sfumatura(["#F87171", "#3B82F6"], X(punti[0][0]), 0, X(punti[-1][0]), 0, userspace=True)
    d = "M" + "L".join(f"{n(X(x))} {n(Y(y))}" for x, y, *_ in punti)
    t.path(d, stroke=g, sw=s(1.1), id="linea-percorso")
    t.linea(X(punti[0][0]), Y(punti[0][1] + 3), X(punti[0][0]), Y(punti[0][1] + 14), "#F8B4B4", s(1.1))
    for i, (x, y, v, d_, c) in enumerate(punti):
        t.cerchio(X(x), Y(y), s(3.6), fill="#F0303B" if i == 0 else ("#6C9BF2" if i == 1 else BL), id=f"punto-{i+1}")
        tx(t, v, x, yv, corpo=7, peso=700 if i != 1 else 500, col=c, ancora="middle")
        tx(t, d_, x, yd, corpo=5.5, col="#7A8499", ancora="middle")


def studia():
    t = nuova(34, 5); X, Y, s = t.X, t.Y, t.s
    stato(t, y=13)
    tx(t, "Studia", 8, 49, w=49, peso=800, id="titolo")
    for (a, x0, x1, sel) in (("Percorso", 8, 69, 1), ("Esercizi", 72, 128, 0), ("Simulazioni", 131, 201, 0)):
        t.rett(X(x0), Y(65), s(x1 - x0), s(23), s(7), fill="#DCEBFD" if sel else "#EEF2F8", stroke="#8CB8F5" if sel else None, sw=s(0.9), id=f"scheda-{a.lower()}")
        tx(t, a, (x0 + x1) / 2, 79.5, corpo=7.2, peso=600 if sel else 500, col=BL if sel else "#4B5B85", ancora="middle")
    card(t, 8, 102, 201, 163, 9, "#E8F1FD", id="percorso-personalizzato")
    atlas_marchio(t, 31, 129, 11)
    tx(t, "Percorso personalizzato", 59, 121.5, w=107, peso=700, id="pp-titolo")
    multi(t, [("Creato da ", "#4B5B85", 400), ("ATLAS", BL, 700)], 59, 137, 7.4)
    tx(t, "Basato sui tuoi risultati e obiettivi.", 59, 151, w=122, corpo=5.3, col="#6B7694")
    tx(t, "Continua da qui", 8, 184, w=73, peso=700)
    card(t, 8, 192, 201, 241, 9, "#FFFFFF", bordo="#EDF1F8", ombra=True, id="continua-da-qui")
    tile_icona(t, "libro", 14, 195, 44, 228, id="tile-libro", ic=17)
    tx(t, "Future tenses", 55, 214, w=62, peso=700)
    t.icona("libro", X(55), Y(220.5), s(6.5), "#8892AB", 1.7); tx(t, "Lezione", 63, 227, corpo=5.2, col="#8892AB")
    t.icona("orologio", X(87), Y(221.5), s(6.5), "#8892AB", 1.7); tx(t, "10 min", 96, 227, corpo=5.2, col="#8892AB"); tx(t, "· -6% rischio", 118, 227, corpo=5.2, col="#8892AB")
    t.cerchio(X(182), Y(217), s(10), fill=BL, id="riprendi"); t.icona("play", X(182) - s(3.2), Y(217) - s(4), s(8), "#FFFFFF", 1)
    tx(t, "Tutte le unità", 8, 268.5, w=67, peso=700)
    righe_u = [("Present simple", 290, "n", 1), ("Present continuous", 318, "ok", 2), ("Past simple", 346, "n", 3), ("Future tenses", 375, "cur", 4), ("Modal verbs", 402, "n", 5)]
    for nome, y, k, num in righe_u:
        if k == "cur":
            t.rett(X(8), Y(361), s(193), s(28), s(8), fill="#E3EEFC", id="unita-corrente")
        tx(t, nome, 46, y + 2.7, corpo=7.6, peso=600 if k == "cur" else 400, col=NAVY if k == "cur" else "#4B5B85")
        if k == "cur":
            t.cerchio(X(22), Y(y), s(7.5), fill="#FFFFFF", stroke=BL, sw=s(1.4)); t.icona("play", X(22) - s(2.6), Y(y) - s(3.2), s(6.4), BL, 1)
        else:
            t.cerchio(X(22), Y(y), s(7.5), fill="#BEEBD3" if k == "ok" else "#ECEFF6")
            tx(t, str(num), 22, y + 2.6, corpo=7.2, peso=700, col="#0A7A47" if k == "ok" else "#3B4A74", ancora="middle")
        t.icona("chevron-destra", X(191) - s(3.6), Y(y) - s(4.2), s(8.5), "#8892AB", 2.4)
        if k != "cur" and num not in (3, 5):
            t.linea(X(46), Y(y + 14), X(198), Y(y + 14), "#EEF1F7", 1)
    nav(t, NAV3, 1, 415, x0=2, x1=206)
    chiudi(t)


def lezione():
    t = nuova(34, 6); X, Y, s = t.X, t.Y, t.s
    stato(t, y=13)
    indietro(t, 35, 37)
    barra_prog(t, 55, 164, 38, 0.3, h=2.8)
    tx(t, "3/10", 195, 41, w=19, col="#5B6B8C", ancora="end")
    t.rett(X(33), Y(65), s(17), s(2.4), s(1.2), fill=BL, id="accento")
    tx(t, "Future tenses", 34, 87, w=103, peso=800, id="titolo")
    tx(t, "1. Spiegazione", 34, 129, w=83, peso=700, id="sezione")
    tx(t, "Il futuro si usa per parlare", 34, 151, w=152, corpo=8.8, col="#4B5B85")
    tx(t, "di azioni che accadranno.", 34, 168, w=137, corpo=8.8, col="#4B5B85")
    card(t, 33, 188, 196, 293, 9, "#F1F6FD", id="esempi")
    for yy, a, wa, b, wb in ((211, "I will go to Milan.", 77, "(decisione al momento)", 102), (258, "I am going to study.", 97, "(piano già deciso)", 80)):
        t.cerchio(X(44), Y(yy - 3), s(1.6), fill=VERDE_S)
        tx(t, a, 54, yy, w=wa, peso=500, col=NAVY)
        tx(t, b, 54, yy + 15.5, w=wb, col="#5B6B8C")
    pulsante(t, 33, 340, 195, 377, "Continua", w=46)
    nav(t, NAV3, 1, 402, x0=17, x1=206)
    chiudi(t)


def esercizio():
    t = nuova(34, 7); X, Y, s = t.X, t.Y, t.s
    stato(t, y=16)
    barra_prog(t, 14, 143, 41, 0.28)
    tx(t, "4/10", 174, 44, w=19, col="#5B6B8C", ancora="end")
    tx(t, "Completa la frase", 14, 76, w=105, peso=700)
    tx(t, "We _____ to Milan", 14, 105, w=107, col="#4B5B85")
    tx(t, "tomorrow.", 14, 122, w=56, col="#4B5B85")
    for i, (a, sel) in enumerate((("go", 0), ("goes", 0), ("will go", 1), ("are going", 0))):
        y0 = (142, 176, 208, 241)[i]; opzione(t, 11, y0, 179, y0 + 29, a, sel, tx_x=51, corpo=7.4, id=f"opzione-{i+1}")
    card(t, 11, 284, 179, 333, 8, "#E3F7EC", id="feedback-corretto")
    spunta_tonda(t, 33, 307, 10)
    tx(t, "Corretto!", 54, 306, w=50, peso=700, col=VERDE_S)
    tx(t, "“Will go” è la forma corretta.", 54, 320, w=108, corpo=5.7, col="#2E7A59")
    pulsante(t, 11, 342, 179, 377, "Avanti", w=30)
    nav(t, NAV3, 0, 393, x0=0, x1=186)
    chiudi(t)


def simulazioni():
    t = nuova(34, 8); X, Y, s = t.X, t.Y, t.s
    stato(t, y=16)
    tx(t, "Simulazioni", 31, 48, w=89, peso=800)
    voci = [(71, 125, "libro", "Simulazione completa", 92, "40 domande · 60 min", 82, 0), (136, 191, "ingranaggio", "Simulazione per argomento", 110, "Scegli l’argomento", 73, 0),
            (202, 258, "libro", "Le mie simulazioni", 74, "2 completate", 53, 1)]
    for y0, y1, ic, a, wa, b, wb, ch in voci:
        card(t, 28, y0, 205, y1, 9, "#FFFFFF", bordo="#F0F3F9", ombra=True, id="voce-" + a.lower().replace(" ", "-"))
        cy = (y0 + y1) / 2
        tile_icona(t, ic, 36, cy - 18, 72, cy + 18, id="tile", ic=19)
        tx(t, a, 85, cy - 3, w=wa, peso=700)
        tx(t, b, 85, cy + 13.5, w=wb, corpo=6.2, col="#5B6B8C")
        if ch: t.icona("chevron-destra", X(191) - s(3), Y(cy) - s(3.5), s(8.5), "#8892AB", 2.4)
    card_atlas(t, 28, 286, 205, 366, ["Le simulazioni si adattano", [("a te grazie ad ", "#4B5B85", 400), ("ATLAS", BL, 700), (", che", "#4B5B85", 400)], "seleziona le domande in base", "ai tuoi progressi."],
               mx=74, corpo=6.6, inter=14.7)
    nav(t, NAV3, -1, 387, x0=16, x1=210)
    chiudi(t)


def risultato_simulazione():
    t = nuova(34, 9); X, Y, s = t.X, t.Y, t.s
    stato(t, y=16)
    tx(t, "Risultato simulazione", 28, 44, w=136, peso=800)
    ring(t, 114, 100, 36, 7, 0.72)
    tx(t, "72%", 114, 108, w=37, peso=800, ancora="middle", id="percentuale")
    tx(t, "29/40 risposte corrette", 114, 154, w=123, corpo=7.6, col="#4B5B85", ancora="middle")
    card_atlas(t, 24, 169, 205, 230, ["Ecco le aree su cui concentrarti", "per migliorare."], titolo=[("Analisi di ", NAVY, 700), ("ATLAS", BL, 700)], mx=66, corpo=5.9)
    aree(t, 25, 251, (27, 98, 171, 201), (272.5, 293.5, 314.5, 336), (65, 80, 45, 90))
    pulsante(t, 24, 352, 205, 386, "Vedi analisi dettagliata", w=101)
    nav(t, NAV3, 2, 392, x0=11, x1=206)
    chiudi(t)


def aree(t, xt, yt, xs, ys, vals, nomi=("Grammar", "Vocabulary", "Listening", "Reading"), ancora_pct=None):
    X, Y, s = t.X, t.Y, t.s
    tx(t, "Aree da migliorare", xt, yt, w=89, peso=700)
    xl, xb0, xb1, xr = xs
    for y, a, v in zip(ys, nomi, vals):
        tx(t, a, xl, y, corpo=6.6, col="#4B5B85")
        t.rett(X(xb0), Y(y - 5.2), s(xb1 - xb0), s(4.2), s(2.1), fill="#E8EDF5", id=f"barra-{a.lower()}-fondo")
        c = ["#F87171", "#F0303B"] if v < 70 and v != 80 and v != 75 else (["#7EB6FF", "#3B82F6"] if v == 80 else ["#34D399", "#0FA66B"])
        if v == 75: c = ["#5CC9B1", "#34B988"]
        t.rett(X(xb0), Y(y - 5.2), s((xb1 - xb0) * v / 100), s(4.2), s(2.1), fill=t.sfumatura(c, 0, 0, 1, 0), id=f"barra-{a.lower()}")
        tx(t, f"{v}%", xr, y, corpo=6.6, col="#4B5B85", ancora="end")


def classifica():
    t = nuova(34, 10); X, Y, s = t.X, t.Y, t.s
    stato(t, y=14)
    noi(t, 33, 46, 36)
    t.icona("ricerca", X(188) - s(6.5), Y(43) - s(6.5), s(13), NAVY, 2.1, id="cerca")
    tx(t, "Classifica", 32, 66, w=57, peso=800)
    tabs(t, (("Settimanale", 32, 90), ("Mensile", 92, 142), ("Sempre", 143, 196)), 77, 99, 92)
    podio(t, 34)
    righe_c = [(223, "4", "fede.it", "980 pt", 1, False), (248, "5", "raffaele.ando", "820 pt", 0, True), (273, "6", "luca.m", "790 pt", 2, False), (298, "7", "chiara.m", "760 pt", 3, False)]
    for y, pos, nome, pt, tono, io in righe_c:
        if io: t.rett(X(62), Y(y - 13), s(135), s(26), s(8), fill="#E6F0FD", id="riga-utente")
        tx(t, pos, 40, y + 3, corpo=7.6, peso=700, col=NAVY, ancora="middle")
        if io: avatar_r(t, 69, y, 8.5)
        else: avatar_f(t, 69, y, 8.5, tono)
        tx(t, nome, 87, y + 3, corpo=7.4, peso=600 if io else 500, col=BL if io else NAVY)
        tx(t, pt, 190, y + 3, corpo=7, col="#7A8499", ancora="end")
        if not io and y != 298: t.linea(X(62), Y(y + 13), X(197), Y(y + 13), "#EEF1F7", 1)
    tx(t, "Sfide attive", 32, 330, w=54, peso=700)
    card(t, 32, 339, 196, 387, 9, "#E3F7EC", id="sfida-attiva")
    spunta_tonda(t, 44, 354, 7)
    tx(t, "Completa 5 lezioni questa settimana", 58, 357, w=127, peso=600, col="#0C5A3C")
    tx(t, "3/5", 58, 368, corpo=5.8, col="#2E7A59")
    t.rett(X(58), Y(372), s(108), s(4), s(2), fill="#CDEBDD"); t.rett(X(58), Y(372), s(65), s(4), s(2), fill=t.sfumatura([BL2, BL], 0, 0, 1, 0), id="progresso-sfida")
    tx(t, "60%", 189, 376, corpo=5.6, col="#2E7A59", ancora="end")
    nav(t, NAV3, 2, 392, x0=19, x1=204)
    chiudi(t)


def noi(t, x, y, w):
    X, Y, s = t.X, t.Y, t.s
    c = corpo_per("NOI", w * 0.82, 800)
    g = t.sfumatura(["#10B981", "#0A8F5C"], 0, 0, 1, 1)
    t.testo("NOI", X(x), Y(y), s(c), 800, g, id="logo-noi")
    t.testo("’", X(x) + larghezza_testo("NOI", s(c), 800), Y(y), s(c), 800, "#0A8F5C")


def tabs(t, voci, y0, y1, yb, sel=0):
    X, Y, s = t.X, t.Y, t.s
    for i, (a, x0, x1) in enumerate(voci):
        on = i == sel
        t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s(6), fill="#DCEBFD" if on else "#EEF2F8", stroke="#8CB8F5" if on else None, sw=s(0.9), id=f"tab-{a.lower()}")
        tx(t, a, (x0 + x1) / 2, yb, corpo=6.7, peso=600 if on else 500, col=BL if on else "#4B5B85", ancora="middle")


def corona(t, cx, cy, w=14):
    X, Y, s = t.X, t.Y, t.s
    k = s(w) / 24
    t.add(f'<g id="corona" transform="translate({n(X(cx) - 12 * k)} {n(Y(cy) - 8 * k)}) scale({n(k)})"><path d="M2 8l5 4 5-8 5 8 5-4-2 12H4z" fill="{t.sfumatura(["#FFD54A", "#F5A524"])}"/></g>')


def podio(t, y_off):
    X, Y, s = t.X, t.Y, t.s
    t.rett(X(85), Y(116), s(57), s(89), s(9), fill="#FDEEDD", id="podio-primo")
    corona(t, 114, 110, 15)
    avatar_f(t, 113, 136, 14, 1, id="avatar-1")
    tx(t, "1", 113, 167, corpo=8, peso=700, col="#E5303B", ancora="middle")
    tx(t, "ale.dis", 113, 181, corpo=6.8, peso=500, ancora="middle"); tx(t, "1.560 pt", 113, 195, corpo=6.4, col="#7A8499", ancora="middle")
    for cx, tono, pos, nome, pt in ((53, 2, "2", "giulia.p", "1.240 pt"), (174, 0, "3", "marti.s", "1.120 pt")):
        avatar_f(t, cx, 145, 12.5, tono, id=f"avatar-{pos}")
        tx(t, pos, cx, 170, corpo=8, peso=700, col="#E5303B" if pos == "3" else NAVY, ancora="middle")
        tx(t, nome, cx, 183, corpo=6.8, peso=500, ancora="middle"); tx(t, pt, cx, 197, corpo=6.4, col="#7A8499", ancora="middle")


def sfida():
    t = nuova(34, 11); X, Y, s = t.X, t.Y, t.s
    stato(t, y=14)
    indietro(t, 31, 43)
    tx(t, "Sfida settimanale", 29, 73, w=103, peso=800)
    t.cerchio(X(95), Y(117), s(23), fill="#EFF4FC", id="trofeo-alone")
    trofeo_oro(t, 95, 116, 26)
    tx(t, "Completa 5 lezioni", 95, 157, w=91, peso=600, ancora="middle"); tx(t, "questa settimana", 95, 171, w=80, peso=600, ancora="middle")
    tx(t, "3/5 completate", 95, 192, w=75, peso=700, col=VERDE_S, ancora="middle")
    for i, (a, w_) in enumerate((("Completa una lezione di Grammar", 114), ("Completa una lezione di Vocabulary", 119), ("Completa una lezione di Listening", 111),
                                 ("Completa una lezione di Reading", 109), ("Completa una simulazione", 87))):
        y = 218 + 22.5 * i
        spunta_tonda(t, 33, y, 7, vuota=i > 2)
        tx(t, a, 48, y + 2.6, w=w_, corpo=None, col="#3B4A74") if w_ else None
    card(t, 24, 334, 167, 377, 9, "#FFFFFF", bordo="#F0F3F9", ombra=True, id="ricompensa")
    t.cerchio(X(41), Y(356), s(14), fill="#FDE8B8"); t.icona("stella", X(41) - s(7), Y(356) - s(7), s(14), "#F59E0B", 1.5)
    tx(t, "Ricompensa", 61, 352, w=35, peso=700); tx(t, "+100 punti · Badge esclusivo", 61, 364, w=100, col="#5B6B8C")
    nav(t, NAV3, 2, 390, x0=13, x1=171)
    chiudi(t)


def trofeo_oro(t, cx, cy, w):
    X, Y, s = t.X, t.Y, t.s
    k = s(w) / 24
    g = t.sfumatura(["#FFD54A", "#F0A31F"], 0, 0, 0, 1)
    t.add(f'<g id="trofeo" transform="translate({n(X(cx) - 12 * k)} {n(Y(cy) - 12 * k)}) scale({n(k)})" fill="none" stroke="#F0A31F" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
          f'<path d="M7 3.500h10v6a5 5 0 0 1-10 0z" fill="{g}"/><path d="M7 5.500H4v2a3 3 0 0 0 3 3M17 5.500h3v2a3 3 0 0 1-3 3"/>'
          f'<path d="M12 14.500v3.500M8.500 20.500h7M9.500 18h5" /></g>')


def discussione():
    t = nuova(34, 12); X, Y, s = t.X, t.Y, t.s
    t.rett(0, 0, t.w, t.h, 22, fill="#8F949E", id="sfondo-oscurato")
    stato(t, y=17, scuro=True)
    t.rett(0, Y(29), t.w, t.h - Y(29), 0, fill="#FFFFFF", id="foglio-fondo", r_angoli=(s(12), s(12), s(20), s(20)))
    fiamma_agora(t, 32, 53, 9)
    tx(t, "Agorà", 47, 58, w=31, peso=700, col="#F28A1E")
    t.icona("x", X(167) - s(5), Y(49) - s(5), s(10), NAVY, 2.4, id="chiudi")
    tx(t, "Qual è il modo migliore per", 24, 85, w=136, peso=700); tx(t, "studiare i phrasal verbs?", 24, 100.7, w=121, peso=700)
    tx(t, "12 risposte · 2h fa", 24, 117, w=66, corpo=None, col="#6B7694") if False else tx(t, "12 risposte · 2h fa", 24, 117, w=66, col="#6B7694")
    tx(t, "Più rilevanti", 24, 147, w=47, peso=700, col=BL); tx(t, "Più recenti", 81, 147, w=42, col="#8A94AC")
    t.linea(X(24), Y(160), X(189), Y(160), "#EDF1F8", 1); t.rett(X(24), Y(158.4), s(47), s(2), s(1), fill=BL)
    commento(t, 189, 0, "laura.s", ["lo uso le flashcard e funziona molto", "bene."], (114, 0), 15, 232)
    t.linea(X(24), Y(247), X(189), Y(247), "#EDF1F8", 1)
    commento(t, 270, 3, "marco.p", ["Secondo me è utile vederli in", "contesto, anche con serie TV."], (102, 0), 8, 316)
    t.rett(X(24), Y(352), s(148), s(30), s(8), fill="#FFFFFF", stroke="#E3E9F4", sw=s(0.9), id="campo-risposta")
    tx(t, "Scrivi una risposta...", 33, 369, w=66, col="#8A94AC")
    t.rett(X(68), Y(429.5), s(59), s(3), s(1.5), fill="#0A1230", id="indicatore-home")
    chiudi(t)


def fiamma_agora(t, cx, cy, r):
    X, Y, s = t.X, t.Y, t.s
    t.cerchio(X(cx), Y(cy), s(r), fill="#FDE3C8", id="agora-fondo")
    t.icona("fiamma", X(cx) - s(r * 0.62), Y(cy) - s(r * 0.7), s(r * 1.25), "#F28A1E", 1.2, id="agora-fiamma")


def commento(t, yc, tono, nome, righe_, wr, likes, ya, x_av=37, x_t=59):
    X, Y, s = t.X, t.Y, t.s
    avatar_f(t, x_av, yc, 12.5, tono)
    tx(t, nome, x_t, yc - 3, corpo=7, peso=700)
    for i, r in enumerate(righe_):
        tx(t, r, x_t, yc + 12 + 14 * i, w=wr[0] if i == 0 else None, corpo=None if i == 0 else 6.3, col="#6B7694") if i == 0 else tx(t, r, x_t, yc + 12 + 14 * i, corpo=6.3, col="#6B7694")
    t.icona("pollice", X(x_t) - s(1), Y(ya) - s(4.5), s(9), "#6B7694", 1.7)
    tx(t, str(likes), x_t + 14, ya + 2.4, corpo=6, col="#6B7694")
    t.icona("commento", X(x_t + 33) - s(1), Y(ya) - s(4.5), s(9), "#6B7694", 1.7)
    tx(t, "Rispondi", x_t + 48, ya + 2.4, corpo=6, col="#6B7694")


def profilo():
    t = nuova(34, 13); X, Y, s = t.X, t.Y, t.s
    stato(t, y=12)
    t.icona("ingranaggio", X(156) - s(7), Y(36) - s(7), s(14), "#1B3A9A", 1.6, id="ingranaggio")
    t.cerchio(X(42), Y(67), s(26), fill="#E1EDFD", id="avatar-fondo")
    tx(t, "R", 42, 79, corpo=33, peso=800, col=BL, ancora="middle", id="avatar-iniziale")
    tx(t, "Raffaele", 78, 64, w=46, peso=800); tx(t, "@raffaele.ando", 78, 79, w=62, col="#6B7694")
    card(t, 16, 101, 163, 144, 10, "#EAF1FC", id="project-id")
    t.icona("cronometro", X(33) - s(8), Y(123) - s(8), s(16), BL, 1.8, id="project-id-icona")
    tx(t, "Project ID", 53, 120, w=40, peso=700); tx(t, "#4821", 53, 133, corpo=6.8, col="#6B7694")
    t.icona("copia", X(150) - s(6), Y(122) - s(6), s(12), "#1B3A9A", 1.8, id="copia")
    for x, v, a in ((27, "12", "livello"), (68, "320", "pt"), (109, "7", "sfide"), (150, "3", "badge")):
        tx(t, v, x, 172, corpo=12, peso=800, ancora="middle"); tx(t, a, x, 187, corpo=6.8, col="#6B7694", ancora="middle")
    ics = ["grafico", "squadra", "scudo", "bersaglio", "link", "cerchio-info"]
    for i, (a, w_) in enumerate((("I miei progressi", 64), ("Classifica (NOI)", 65), ("Le mie sfide", 50), ("Obiettivi", 36), ("Attività", 33), ("Project ID", 41))):
        y = 217 + 29.5 * i
        riga_lista(t, y, a, 26, 49, 157, ics[i], w=w_, corpo=None, sep=(y + 14.8 if i < 5 else None), x_sep=(49, 163)) if False else _riga(t, y, a, 26, 49, 157, ics[i], w_, y + 14.8 if i < 5 else None, (49, 163))
    nav(t, NAV3, -1, 390, x0=3, x1=172)
    chiudi(t)


def _riga(t, y, testo, x_ic, x_tx, x_chev, icona, w, sep, x_sep, ic=11):
    X, Y, s = t.X, t.Y, t.s
    t.icona(icona, X(x_ic) - s(ic / 2), Y(y) - s(ic / 2), s(ic), "#2A3B7A", 1.6)
    tx(t, testo, x_tx, y + 2.9, w=w, peso=500, col=NAVY)
    if x_chev: t.icona("chevron-destra", X(x_chev) - s(3), Y(y) - s(3.5), s(8.5), "#8892AB", 2.4)
    if sep: t.linea(X(x_sep[0]), Y(sep), X(x_sep[1]), Y(sep), "#EDF1F8", 1)


def impostazioni():
    t = nuova(34, 14); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    indietro(t, 30, 42)
    tx(t, "Impostazioni", 44, 69, w=73, peso=700)
    t.linea(X(36), Y(86), X(150), Y(86), "#EDF1F8", 1)
    righe_ = [("Account", 30, "Email, password, sicurezza", 91, "utente"), ("Preferenze", 40, "Tema, lingua", 48, "smile"), ("Notifiche", 36, "Solo attività importanti", 88, "campana"),
              ("Privacy", 30, "Dati e permessi", 61, "lucchetto"), ("Aiuto", 22, "FAQ e supporto", 63, "cerchio-info"), ("Informazioni", 52, "Versione dell’app", 69, "cerchio-info")]
    for i, (a, wa, b, wb, ic) in enumerate(righe_):
        y = (105.7, 152, 198, 244, 291, 337)[i]
        t.icona(ic, X(36) - s(6), Y(y + 6) - s(6), s(12), "#2A3B7A", 1.6)
        tx(t, a, 56, y, w=wa, peso=600); tx(t, b, 56, y + 13.5, w=wb, col="#6B7694")
        if i < 5: t.linea(X(36), Y(y + 27.5), X(150), Y(y + 27.5), "#EDF1F8", 1)
    chiudi(t)


TUTTE = [splash, onboarding, test_iniziale, risultati_test, home, studia, lezione, esercizio, simulazioni, risultato_simulazione, classifica, sfida, discussione, profilo, impostazioni]

if __name__ == "__main__":
    for f in TUTTE: f()
