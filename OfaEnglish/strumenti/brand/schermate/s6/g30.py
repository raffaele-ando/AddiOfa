"""Immagine 30 · flusso schermate A (16 schermate AddiOFA con ATLAS / NOI / Agorà), kit blu.
Si disegna in PIXEL DELLE VISTE ingrandite (leggi.py, ox/oy/z in testa a ogni blocco); tutte le schermate sono telefoni 390x844.
Corregge: testi AI deformati ("Analizza il tuo livello" ecc.), icone storte delle righe (rifatte), asimmetrie dell'illustrazione
di benvenuto (documento + grafico ridisegnati), barra di navigazione uniforme, logo testuale AddiOfa.
Testi di corpo piccolo: ricostruiti dal contesto (marcati nel rapporto)."""
from componenti import *
CART = "30-flusso-schermate-a"
def logo_v(t, x, y, larg):
    c = larg / larghezza_testo("AddiOfa", 1.0, 700)
    w1 = tx(t, "Addi", x, y, c, 700, NAVY, id="logo-addi")
    tx(t, "Ofa", x + w1, y, c, 700, AZZ, id="logo-ofa")

# ---------------------------------------------------------------- 01 splash (vista 5,20 x3)
def splash(t, ondata=True):
    """Fondo azzurro pieno con logo bianco, slogan e onde chiare in basso (coordinate della vista 5,20 x3)."""
    t.rett(0, 0, 390, H, 22, fill=t.sfumatura(["#0A79FF", "#0069F5"]), id="sfondo-splash")
    stato(t, chiaro=True)
    c = 365 / larghezza_testo("AddiOfa", 1.0, 600)
    tx(t, "AddiOfa", 105, 603, c, 600, "#FFFFFF", id="logo")
    tx(t, "Supera l’OFA di inglese.", 290, 708, 30, 400, "#FFFFFF", "middle", larg=380, id="slogan-1")
    tx(t, "Senza blocchi.", 290, 768, 30, 400, "#FFFFFF", "middle", larg=236, id="slogan-2")
    if ondata:
        X, Y = t.X, t.Y
        def pth(d):
            import re
            nums = iter(re.findall(r"[MCLZ]|-?\d+\.?\d*", d)); out = []; coord = []
            for tk in nums:
                if tk in "MCLZ": out.append(tk)
                else:
                    coord.append(float(tk))
                    if len(coord) == 2: out.append(f"{n(X(coord[0]))} {n(Y(coord[1]))}"); coord = []
            return " ".join(out)
        t.path(pth("M 17 1090 C 150 1000 280 960 380 990 C 500 1030 530 1100 525 1200 L 520 1403 L 17 1403 Z"), fill="#FFFFFF", opacita=.16, id="onda-chiara")
        t.path(pth("M 17 1215 C 150 1120 330 1130 390 1290 L 410 1403 L 17 1403 Z"), fill="#0A70FC", id="onda-scura")

def s01():
    t = nuova(30, 1, "splash", (17, 55, 567, 1403), CART, vista=(5, 20, 3))
    splash(t)
    chiudi(t)

# ---------------------------------------------------------------- 02 onboarding 1 (vista 200,30 x2.6)
def s02():
    t = nuova(30, 2, "onboarding-1", (15, 22, 505, 1195), CART, vista=(200, 30, 2.6))
    stato(t)
    logo_v(t, 132, 262, 265)
    tx_multi(t, [("Studia in modo mirato", SOTTO)], 263, 352, 36, 400, "middle", larg=300, id="sottotitolo-1")
    tx_multi(t, [("con l’intelligenza di ", SOTTO), ("ATLAS", AZZ2, 700)], 264, 399, 36, 400, "middle", larg=358, id="sottotitolo-2")
    doc_illustrazione(t, t.X(250), t.Y(665), 1.38)
    punti_pagina(t, t.Y(960), 0, 3, t.X(257), t.X(306) - t.X(257))
    pulsante(t, 42, 1020, 478, 1110, "Inizia")
    chiudi(t)

# ---------------------------------------------------------------- 03 onboarding 2
def s03():
    t = nuova(30, 3, "onboarding-2", (531, 22, 995, 1195), CART, vista=(200, 30, 2.6))
    stato(t)
    for tt, y, w in (("Un percorso", 183, 228), ("personalizzato", 229, 271), ("per te", 277, 111)):
        tx(t, tt, 584, y, 40, 800, NAVY, larg=w, id="titolo")
    righe = [
        ([("Analizza il tuo livello", TESTO)], [("con ", TESTO), ("ATLAS", AZZ2, 700)], 370, GIALLO_P, "atlas", "#13A08A", 235),
        ([("Lezioni ed esercizi mirati", TESTO)], None, 463, VERDE_P, "libro", VERDE_T, 289),
        ([("Simulazioni realistiche", TESTO)], None, 560, VERDE_P, "orologio", VERDE_T, 261),
        ([("Sfide con altri studenti", TESTO)], [("grazie a ", TESTO), ("NOI", NAVY, 700)], 660, GIALLO_P, "medaglia", ARANCIO, 275),
        ([("Confrontati su Agorà", TESTO)], [("quando hai dubbi", TESTO)], 757, "#FDE6E8", "chat", "#E5303F", 259),
    ]
    for i, (l1, l2, cy, fondo, ic, col, w) in enumerate(righe):
        riga_chip(t, t.X(614), t.Y(cy), t.s(36), fondo, ic, col, id=f"icona-{i+1}")
        if l2:
            tx_multi(t, l1, 673, cy - 13, 26, 500, larg=w, id=f"riga-{i+1}-a")
            tx_multi(t, l2, 673, cy + 27, 26, 500, id=f"riga-{i+1}-b", larg=(215 if i == 4 else 130 if i == 0 else 160) if i != 3 else 164)
        else:
            tx_multi(t, l1, 673, cy + 8, 26, 500, larg=w, id=f"riga-{i+1}")
    punti_pagina(t, t.Y(960), 1, 3, t.X(762), t.X(762) - t.X(714))
    pulsante(t, 563, 1017, 970, 1112, "Avanti")
    chiudi(t)

# ---------------------------------------------------------------- 04 test iniziale (vista 580,30 x2.4)
def s04():
    t = nuova(30, 4, "test-iniziale", (32, 22, 460, 1105), CART, vista=(580, 30, 2.4))
    stato(t); indietro(t, t.Y(124))
    avanzamento_quiz(t, 0.15, t.Y(124), "3/20")
    tx(t, "Choose the correct form.", 70, 240, 30, 700, NAVY, larg=326, id="consegna")
    tx(t, "If I", 70, 326, 31, 500, SOTTO, id="domanda-1a")
    t.linea(t.X(115), t.Y(331), t.X(220), t.Y(331), SOTTO, 1.3, id="spazio-vuoto")
    tx(t, "more time,", 228, 326, 31, 500, SOTTO, larg=150, id="domanda-1b")
    tx(t, "I would travel.", 70, 369, 31, 500, SOTTO, larg=198, id="domanda-2")
    for i, (parola, sel) in enumerate((("have", False), ("had", True), ("will have", False), ("would have", False))):
        y0 = (424, 516, 606, 698)[i]
        scelta(t, 67, y0, 433, y0 + 80, parola, sel, 17.5, id=f"risposta-{i+1}")
    tabbar_vuoto = None
    chiudi(t)

# ---------------------------------------------------------------- 05 risultati del test (radar)
def s05():
    t = nuova(30, 5, "risultati-test", (485, 22, 955, 1105), CART, vista=(580, 30, 2.4))
    stato(t)
    sezione_titolo(t, "Il tuo livello", 527, 165, 40, 206, info_cx=764)
    tx(t, "Analisi generata da ATLAS", 527, 208, 26, 400, SOTTO, larg=290, id="sottotitolo")
    radar(t, t.X(717), t.Y(462), t.s(122), [.72, .58, .65, .78, .62])
    etich = [("Grammar", 727, 280, "72%", 725, 323, VERDE_T, "middle"),
             ("Vocabulary", 935, 396, "58%", 908, 435, ROSSO_T, "end"),
             ("Listening", 892, 600, "65%", 846, 638, ROSSO_T, "end"),
             ("Reading", 548, 600, "78%", 588, 638, VERDE_T, "start"),
             ("Writing", 525, 396, "62%", 530, 435, VERDE_T, "start")]
    for nome, x, y, val, vx_, vy, col, anc in etich:
        tx(t, nome, x, y, 20.5, 400, SOTTO, anc, id=f"etichetta-{nome.lower()}")
        tx(t, val, vx_, vy, 24, 700, col, "middle" if nome == "Grammar" else ("middle" if True else anc), id=f"valore-{nome.lower()}")
    R(t, 511, 750, 932, 905, 14, CARD_P, id="card-atlas")
    atlas_marchio(t, t.X(558), t.Y(805), t.s(52))
    for i, (r_, w) in enumerate((("ATLAS ha analizzato le tue", 257), ("risposte e ha creato un percorso", 297), ("personalizzato.", 145))):
        tx_multi(t, [(r_, TESTO)], 613, (798, 836, 872)[i], 20, 500, larg=w, id=f"testo-atlas-{i+1}")
    pulsante(t, 511, 937, 932, 1027, "Inizia il tuo percorso")
    chiudi(t)

# ---------------------------------------------------------------- 06 home (vista 985,30 x2.2)
def s06():
    t = nuova(30, 6, "home", (4, 22, 405, 1020), CART, vista=(985, 30, 2.2))
    stato(t)
    logo_v(t, 30, 125, 160)
    avatar(t, t.X(355), t.Y(110), t.s(27), "#C9D3E6", testa="#B07A55", capelli="#2B1B14", id="avatar-utente")
    gauge(t, t.X(211), t.Y(357), t.s(138), t.s(30), 0.76)
    tx(t, "82%", 210, 352, 58, 800, "#F01E2C", "middle", larg=108, id="percentuale")
    tx(t, "Rischio di fallimento", 211, 393, 24, 600, "#F01E2C", "middle", larg=202, id="rischio-etichetta")
    tx(t, "all’OFA di inglese", 210, 428, 22, 400, SOTTO, "middle", larg=156, id="rischio-sotto")
    R(t, 30, 470, 385, 600, 16, t.sfumatura(["#FDEBEC", "#F6F8FD"], 0, 0, 1, 0), id="card-prossimo-passo")
    R(t, 30, 505, 105, 590, 16, "#FFFFFF", id="tile-lezione", filtro=ombra_l(t))
    I(t, "libro", 67, 546, 44, AZZ, 1.9)
    tx(t, "Prossimo passo", 124, 508, 21, 400, SOTTO, larg=133, id="etichetta-passo")
    tx(t, "Future tenses", 124, 549, 26, 700, NAVY, larg=153, id="titolo-passo")
    tx(t, "Lezione  ·  10 min  ·  -6% rischio", 124, 583, 17, 400, SOTTO, larg=250, id="meta-passo")
    pulsante(t, 30, 623, 382, 673, "Inizia la lezione", id="pulsante-inizia-lezione")
    tx(t, "Il tuo progresso", 30, 730, 24, 700, NAVY, larg=153, id="titolo-progresso")
    grafico_percorso(t, [(48, 769), (190, 793), (340, 807)], ["82%", "62%", "28%"], ["Oggi", "Dopo 5 lezioni", "Dopo 15 lezioni"], 843, 872)
    tabbar(t, TAB_ATLAS, 0)
    chiudi(t)

# ---------------------------------------------------------------- 07 Studia (panoramica)
def s07():
    t = nuova(30, 7, "studia", (428, 22, 838, 1020), CART, vista=(985, 30, 2.2))
    stato(t)
    tx(t, "Studia", 449, 135, 40, 800, NAVY, larg=111, id="titolo")
    I(t, "ricerca", 798, 115, 30, NAVY, 2.3, id="cerca")
    for (a, b, et, sel) in ((449, 566, "Percorso", True), (575, 682, "Esercizi", False), (690, 818, "Simulazioni", False)):
        R(t, a, 170, b, 222, 11, "#E4EFFF" if sel else "#F1F4FA", id=f"scheda-{et.lower()}", stroke=AZZ_BORDO if sel else None, sw=1.4)
        tx(t, et, (a + b) / 2, 203, 21, 600 if sel else 500, AZZ if sel else SOTTO, "middle", larg=(b - a) * (0.7 if et != "Simulazioni" else 0.82))
    R(t, 449, 250, 818, 385, 16, "#EEF3FC", id="card-percorso-personalizzato")
    atlas_marchio(t, t.X(497), t.Y(314), t.s(56))
    tx(t, "Percorso personalizzato", 549, 292, 22, 700, NAVY, larg=218, id="percorso-titolo")
    tx_multi(t, [("Creato da ", TESTO), ("ATLAS", AZZ2, 700)], 549, 326, 22, 500, larg=148, id="percorso-creato")
    tx(t, "Basato sui tuoi risultati e obiettivi.", 549, 357, 17, 400, SOTTO, larg=252, id="percorso-basato")
    tx(t, "Continua da qui", 454, 430, 24, 700, NAVY, larg=160, id="titolo-continua")
    R(t, 452, 450, 818, 570, 16, "#FFFFFF", id="card-continua", stroke=LINEA_S, sw=1, filtro=ombra_l(t))
    R(t, 472, 470, 520, 520, 12, "#F3F7FF")
    I(t, "libro", 496, 495, 34, AZZ, 1.9)
    tx(t, "Future tenses", 557, 492, 21, 700, NAVY, larg=121, id="continua-titolo")
    tx(t, "Lezione  ·  10 min", 557, 524, 18, 400, SOTTO, larg=140)
    tx(t, "-6% rischio", 557, 550, 18, 400, SOTTO, larg=85)
    C(t, 780, 505, 22, fill=t.sfumatura(["#2D82FF", "#0A63F2"]), id="pulsante-play")
    t.icona("play", t.X(780) - 7.5, t.Y(505) - 9, 18, "#FFFFFF", 1)
    tx(t, "Unità del percorso", 454, 632, 24, 700, NAVY, larg=206, id="titolo-unita")
    unita = ["Present simple", "Present continuous", "Past simple", "Future tenses", "Modal verbs"]
    for i, nome in enumerate(unita):
        cy = (674, 732, 789, 847, 905)[i]
        if i == 3:
            R(t, 450, 820, 818, 876, 12, "#E8F1FF", id="riga-corrente")
        col = "#BDE8CF" if i < 2 else (AZZ if i == 3 else "#E7EBF4")
        C(t, 480, cy, 17, fill=col, id=f"numero-{i+1}-fondo")
        t.testo(str(i + 1), t.X(480), t.Y(cy) + 5, t.s(21), 600, "#FFFFFF" if i == 3 else (VERDE_T if i < 2 else "#5E6B99"), "middle")
        tx(t, nome, 527, cy + 9, 24, 700 if i == 3 else 400, NAVY if i == 3 else "#46557F", id=f"unita-{i+1}")
        I(t, "chevron-destra", 798, cy, 15, AZZ if i == 3 else "#8A96B5", 2.2)
    tabbar(t, TAB_ATLAS, 1)
    chiudi(t)

# ---------------------------------------------------------------- 08 lezione (esempio)
def s08():
    t = nuova(30, 8, "lezione", (862, 22, 1198, 1020), CART, vista=(985, 30, 2.2))
    stato(t); indietro(t, t.Y(113))
    avanzamento_quiz(t, 0.3, t.Y(113), "3/10")
    t.rett(t.X(884), t.Y(165), t.s(38), 3.5, 1.7, fill=AZZ, id="accento")
    tx(t, "Future tenses", 884, 210, 38, 800, NAVY, larg=224, id="titolo")
    tx(t, "1. Spiegazione", 884, 296, 30, 700, NAVY, larg=184, id="sottotitolo")
    tx(t, "Il futuro si usa per parlare", 884, 343, 28, 400, SOTTO, larg=288, id="testo-1")
    tx(t, "di azioni che accadranno.", 884, 382, 28, 400, SOTTO, larg=291, id="testo-2")
    R(t, 884, 425, 1172, 655, 16, CARD_P, id="card-esempi")
    for cy in (465, 565):
        t.rett(t.X(906) - 1.5, t.Y(cy) - 4, 3, 8, 1.5, fill="#2CBF9B")
    tx_multi(t, [("I will go", NAVY, 600), (" to Milan.", "#46557F")], 928, 471, 26, 400, larg=162, id="esempio-1")
    tx(t, "(decisione al momento)", 930, 503, 22, 400, SOTTO, larg=212, id="esempio-1-nota")
    tx_multi(t, [("I am going", NAVY, 600), (" to study.", "#46557F")], 928, 572, 26, 400, larg=210, id="esempio-2")
    tx(t, "(piano già deciso)", 930, 607, 22, 400, SOTTO, larg=170, id="esempio-2-nota")
    pulsante(t, 884, 773, 1172, 857, "Continua")
    tabbar(t, TAB_ATLAS, 1)
    chiudi(t)

# ---------------------------------------------------------------- 09 esercizio (vista 5,550 x2)
def s09():
    t = nuova(30, 9, "esercizio", (10, 10, 388, 892), CART, vista=(5, 550, 2.0))
    stato(t)
    avanzamento_quiz(t, 0.4, t.Y(90), "4/10")
    tx(t, "Completa la frase", 40, 158, 27, 700, NAVY, larg=210, id="consegna")
    tx(t, "We", 40, 217, 27, 500, SOTTO, id="domanda-1a")
    t.linea(t.X(88), t.Y(220), t.X(165), t.Y(220), SOTTO, 1.3, id="spazio-vuoto")
    tx(t, "to Milan", 172, 217, 27, 500, SOTTO, larg=88, id="domanda-1b")
    tx(t, "tomorrow.", 40, 250, 27, 500, SOTTO, larg=120, id="domanda-2")
    for i, (parola, sel) in enumerate((("go", False), ("goes", False), ("will go", True), ("are going", False))):
        y0 = (290, 357, 424, 490)[i]
        scelta(t, 33, y0, 365, y0 + 62, parola, sel, 16.5, id=f"risposta-{i+1}")
    esito_corretto(t, 33, 578, 365, 670, "Corretto!", "“Will go” è la forma corretta.", 100, 221, 75)
    pulsante(t, 33, 693, 365, 768, "Avanti")
    tabbar(t, TAB_ATLAS, 0)
    chiudi(t)

# ---------------------------------------------------------------- 10 simulazioni
def s10():
    t = nuova(30, 10, "simulazioni", (408, 10, 790, 892), CART, vista=(5, 550, 2.0))
    stato(t)
    tx(t, "Simulazioni", 445, 117, 34, 800, NAVY, larg=173, id="titolo")
    voci = [("libro", "Simulazione completa", "40 domande  ·  60 min", 165, 272, 181, 108),
            ("ingranaggio", "Simulazione per argomento", "Scegli l’argomento", 296, 402, 217, 118),
            ("libro", "Le mie simulazioni", "2 completate", 427, 540, 146, 105)]
    for i, (ic, ti, su, ya, yb, w1, w2) in enumerate(voci):
        cy = (ya + yb) / 2
        R(t, 430, ya, 775, yb, 16, "#FFFFFF", id=f"card-{i+1}", stroke=LINEA_S, sw=1, filtro=ombra_l(t))
        R(t, 445, cy - 35, 515, cy + 35, 16, "#F3F7FF", id=f"tile-{i+1}")
        I(t, ic, 480, cy, 40, AZZ, 1.9)
        tx(t, ti, 543, cy - 6, 17.5, 700, NAVY, larg=w1, id=f"voce-{i+1}-titolo")
        tx(t, su, 543, cy + 25, 118 / larghezza_testo("Scegli l’argomento", 1.0, 400), 400, SOTTO, id=f"voce-{i+1}-sub")
        I(t, "chevron-destra", 750, cy, 14, "#8A96B5", 2.2)
    R(t, 430, 590, 775, 760, 14, CARD_P, id="card-atlas")
    atlas_marchio(t, t.X(470), t.Y(660), t.s(48))
    righe = ["Le simulazioni si adattano", "a te grazie ad ATLAS, che", "seleziona le domande in base", "ai tuoi progressi."]
    for i, (r_, w) in enumerate(zip(righe, (232, 233, 250, 142))):
        if "ATLAS" in r_:
            a, b = r_.split("ATLAS")
            tx_multi(t, [(a, TESTO), ("ATLAS", AZZ2, 700), (b, TESTO)], 520, 636 + i * 29, 18, 500, larg=w, id=f"atlas-testo-{i+1}")
        else:
            tx(t, r_, 520, 636 + i * 29, 18, 500, TESTO, larg=w, id=f"atlas-testo-{i+1}")
    tabbar(t, TAB_ATLAS, 1)
    chiudi(t)

# ---------------------------------------------------------------- 11 risultato simulazione
def s11():
    t = nuova(30, 11, "risultato-simulazione", (812, 10, 1210, 892), CART, vista=(5, 550, 2.0))
    stato(t)
    tx(t, "Risultato simulazione", 845, 110, 30, 800, NAVY, larg=267, id="titolo")
    anello(t, t.X(1003), t.Y(222), t.s(76), .72, t.s(17))
    tx(t, "72%", 1003, 238, 44, 800, NAVY, "middle", larg=81, id="percentuale")
    tx(t, "29/40 risposte corrette", 1008, 335, 21, 400, SOTTO, "middle", larg=220, id="risposte")
    R(t, 835, 362, 1185, 470, 14, CARD_P, id="card-atlas")
    atlas_marchio(t, t.X(872), t.Y(413), t.s(46))
    tx_multi(t, [("Analisi di ", NAVY, 600), ("ATLAS", AZZ2, 700)], 918, 397, 18, 600, larg=132, id="atlas-titolo")
    tx(t, "Ecco le aree su cui concentrarti", 918, 425, 16, 400, SOTTO, larg=255, id="atlas-1")
    tx(t, "per migliorare.", 918, 452, 16, 400, SOTTO, larg=110, id="atlas-2")
    tx(t, "Aree da migliorare", 845, 515, 22, 700, NAVY, larg=172, id="titolo-aree")
    for i, (nome, v, y, w) in enumerate((("Grammar", 65, 562, 87), ("Vocabulary", 80, 605, 100), ("Listening", 45, 649, 82), ("Reading", 90, 692, 72))):
        if v >= 85: c, ch = "#10A06A", "#4CC99A"
        elif v >= 70: c, ch = "#1F6BFD", "#6EA0FE"
        else: c, ch = "#EF3B45", "#FF8A8A"
        tx(t, nome, 848, y, 18.5, 400, SOTTO, larg=w, id=f"area-{i+1}")
        barra_valore(t, 983, 1118, y - 5, v / 100, c, ch)
        tx(t, f"{v}%", 1172, y, 18.5, 500, "#46557F", "end", larg=36, id=f"area-{i+1}-valore")
    pulsante(t, 835, 718, 1185, 785, "Vedi analisi dettagliata", corpo=16.5)
    tabbar(t, TAB_ATLAS, 1)
    chiudi(t)

# ---------------------------------------------------------------- 12 sfide (home)  vista 600,550 x2.6
def s12():
    t = nuova(30, 12, "sfide", (50, 10, 600, 1160), CART, vista=(600, 550, 2.6))
    stato(t)
    tx(t, "Sfide", 87, 140, 44, 800, NAVY, larg=108, id="titolo")
    I(t, "ricerca", 555, 123, 34, NAVY, 2.3, id="cerca")
    for (a, b, et, sel) in ((79, 241, "Attive", True), (254, 415, "Classifica", False), (428, 585, "Amici", False)):
        R(t, a, 180 if sel else 182, b, 244, 12, "#E4EFFF" if sel else "#F1F4FA", id=f"scheda-{et.lower()}", stroke=AZZ_BORDO if sel else None, sw=1.4)
        tx(t, et, (a + b) / 2, 224, 22, 600 if sel else 500, AZZ if sel else SOTTO, "middle", larg={"Attive": 62, "Classifica": 96, "Amici": 58}[et])
    R(t, 73, 270, 590, 490, 18, t.sfumatura(["#FFF1E4", "#FFE8D2"], 0, 0, 1, 0), id="card-sfida-settimana")
    tx(t, "Sfida della settimana", 108, 325, 23, 600, "#F2631F", larg=244, id="sfida-etichetta")
    tx(t, "Completa 5 lezioni", 108, 369, 33, 700, NAVY, larg=272, id="sfida-titolo")
    barra_valore(t, 108, 410, 433, .6, "#0FA37F", "#17B38C", h=22)
    R(t, 467, 320, 560, 408, 20, "#FFE0C2", id="regalo-fondo")
    I(t, "regalo", 513, 364, 56, "#F58A1B", 2.0)
    tx(t, "+100 pt", 563, 447, 29, 700, "#F05A1A", "end", larg=103, id="sfida-punti")
    tx(t, "Sfide attive", 80, 551, 27, 700, NAVY, larg=148, id="titolo-attive")
    voci = [("medaglia", "#FFE6D2", ARANCIO, "7 giorni di studio", "5/7 giorni consecutivi", "+150 pt", 630, 183, 215, 91),
            ("gruppo", "#FFE1E3", "#E5303F", "Duello simulazione", "Sfida un altro studente", "+200 pt", 745, 210, 245, 94),
            ("fulmine", "#DDF3E6", "#17A455", "Grammar Sprint", "Completa 10 esercizi", "+80 pt", 858, 185, 226, 80)]
    for ic, fondo, col, ti, su, pt, cy, w1, w2, w3 in voci:
        R(t, 92, cy - 34, 160, cy + 34, 18, fondo, id="tile-" + ic)
        I(t, ic, 126, cy, 34, col, 2.1)
        tx(t, ti, 187, cy - 16, 22.5, 700, NAVY, larg=w1)
        tx(t, su, 187, cy + 23, 20.5, 400, SOTTO, larg=w2)
        tx(t, pt, 563, cy + 11, 24, 700, "#F58A0B", "end", larg=w3)
    R(t, 78, 923, 583, 1015, 16, "#FFFFFF", id="pulsante-vedi-tutte", stroke="#E3E9F4", sw=1.3, filtro=ombra_l(t, .04))
    tx(t, "Vedi tutte le sfide", 331, 975, 24, 700, AZZ, "middle", larg=195)
    tabbar(t, TAB_ATLAS, 2)
    chiudi(t)

# ---------------------------------------------------------------- 13 sfida (dettaglio)  vista 825,550 x1.7
def s13():
    t = nuova(30, 13, "sfida-dettaglio", (35, 10, 342, 757), CART, vista=(825, 550, 1.7))
    stato(t); indietro(t, t.Y(80))
    emblema_sfida(t, t.X(190), t.Y(135), 1.12)
    tx(t, "7 giorni di studio", 62, 260, 29, 800, NAVY, larg=205, id="titolo")
    c13 = 235 / larghezza_testo("Completa almeno una lezione", 1.0, 400)
    for i, r_ in enumerate(("Completa almeno una lezione", "ogni giorno per 7 giorni", "consecutivi.")):
        tx(t, r_, 62, 304 + i * 25.5, c13, 400, SOTTO, id=f"testo-{i+1}")
    tx(t, "5/7 giorni", 62, 401, 20, 700, NAVY, larg=87, id="progresso-etichetta")
    barra_valore(t, 62, 315, 428, 5 / 7, "#0FA37F", "#2BC29A", h=14)
    pallini_settimana(t, (72, 111, 150, 188, 227, 265, 304), 466, ("si", "si", "si", "si", "oggi", "no", "no"), "LMMGVSD", y_et=505)
    C(t, 86, 567, 25, fill="#FDEBC8", id="ricompensa-icona")
    I(t, "medaglia", 86, 567, 28, ARANCIO, 2.2)
    tx(t, "Ricompensa", 120, 560, 18, 700, NAVY, larg=90, id="ricompensa-titolo")
    tx(t, "+150 punti  ·  Badge esclusivo", 120, 586, 15.5, 400, SOTTO, larg=188, id="ricompensa-sub")
    pulsante(t, 54, 617, 322, 672, "Continua a studiare", corpo=17)
    tabbar(t, TAB_ATLAS, 2)
    chiudi(t)

# ---------------------------------------------------------------- 14 classifica
def s14():
    t = nuova(30, 14, "classifica", (355, 10, 655, 757), CART, vista=(825, 550, 1.7))
    stato(t)
    tx(t, "Classifica", 377, 91, 30, 800, NAVY, larg=110, id="titolo")
    I(t, "ricerca", 622, 77, 20, NAVY, 2.3, id="cerca")
    for (a, b, et, sel) in ((369, 463, "Settimanale", True), (471, 550, "Mensile", False), (558, 638, "Sempre", False)):
        R(t, a, 108, b, 148, 10, "#E4EFFF" if sel else "#F1F4FA", id=f"scheda-{et.lower()}", stroke=AZZ_BORDO if sel else None, sw=1.4)
        tx(t, et, (a + b) / 2, 134, 15.5, 600 if sel else 500, AZZ if sel else SOTTO, "middle", larg=(b - a) * (.8 if sel else .6))
    R(t, 458, 186, 551, 325, 14, "#FDF0DF", id="podio-primo")
    # corona
    cx, cy = t.X(503), t.Y(177)
    t.path(f"M{n(cx-13)} {n(cy+7)}L{n(cx-15)} {n(cy-7)}L{n(cx-6)} {n(cy)}L{n(cx)} {n(cy-10)}L{n(cx+6)} {n(cy)}L{n(cx+15)} {n(cy-7)}L{n(cx+13)} {n(cy+7)}z", fill="#F6B31C", id="corona")
    gente = [("giulia.p", "1.240 pt", 411, 237, 24, "2", AZZ, "#9B6B4F"), ("ale.dis", "1.560 pt", 503, 224, 26, "1", ROSSO_T, "#B57A55"), ("marti.s", "1.120 pt", 594, 236, 24, "3", ROSSO_T, "#C08A62")]
    for nome, pt, x, y, r, pos, col, pelle in gente:
        avatar(t, t.X(x), t.Y(y), t.s(r * 1.2), "#D9E2F2", testa=pelle, id=f"avatar-{nome}")
        tx(t, pos, x, y + r + 8, 14, 800, col, "middle")
        tx(t, nome, x, 291, 17, 700, NAVY, "middle", larg=53 if nome != "marti.s" else 50)
        tx(t, pt, x, 316, 15.5, 400, SOTTO, "middle", larg=56)
    righe = [("4", "fede.it", "980 pt", 361, False), ("5", "raffaele.ando", "820 pt", 411, True), ("6", "luca.m", "790 pt", 457, False), ("7", "chiara.m", "760 pt", 500, False)]
    for pos, nome, pt, y, evid in righe:
        if evid: R(t, 370, 386, 640, 436, 12, "#EAF2FF", id="riga-evidenza")
        tx(t, pos, 387, y + 5, 15, 800, NAVY, "middle")
        if nome.startswith("raffaele"):
            avatar(t, t.X(434), t.Y(y), t.s(18), "#CFE2FF", iniziale="R", col_iniziale=AZZ, id="avatar-raffaele")
        else:
            avatar(t, t.X(434), t.Y(y), t.s(18), "#D9E2F2", testa="#A87A5C", id=f"avatar-{nome}")
        tx(t, nome, 464, y + 5, 16, 700 if evid else 500, AZZ if evid else NAVY, larg={"fede.it": 49, "raffaele.ando": 100, "luca.m": 50, "chiara.m": 62}[nome])
        tx(t, pt, 628, y + 5, 15.5, 500 if evid else 400, "#46557F", "end", larg=45)
    R(t, 369, 552, 640, 655, 12, "#FFFFFF", id="card-posizione", stroke="#8DB8FF", sw=1.6)
    tx(t, "La tua posizione", 390, 586, 16, 700, NAVY, larg=116, id="posizione-etichetta")
    tx(t, "#5", 390, 626, 30, 800, NAVY, larg=34, id="posizione-valore")
    tx(t, "820 pt", 548, 616, 15.5, 400, "#46557F", "end", larg=44)
    I(t, "nodi", 600, 603, 26, NAVY, 2.0)
    tabbar(t, TAB_ATLAS, 2)
    chiudi(t)

# ---------------------------------------------------------------- 15 profilo (Project ID)
def s15():
    t = nuova(30, 15, "profilo", (672, 10, 958, 757), CART, vista=(825, 550, 1.7))
    stato(t)
    C(t, 708, 105, 25, fill="#E1EDFF", id="avatar-fondo")
    tx(t, "R", 708, 116, 30, 800, AZZ, "middle", id="avatar-iniziale")
    tx(t, "Raffaele", 777, 100, 19, 700, NAVY, larg=61, id="nome")
    tx(t, "@raffaele.ando", 777, 124, 15.5, 400, SOTTO, larg=103, id="username")
    I(t, "impostazioni", 920, 77, 22, NAVY, 2.0)
    R(t, 684, 158, 933, 238, 14, CARD_P, id="card-project-id")
    I(t, "orologio", 711, 193, 28, AZZ, 2.3)
    tx(t, "Project ID", 743, 188, 17, 700, NAVY, larg=69, id="project-id-etichetta")
    tx(t, "#4821", 743, 214, 15.5, 400, SOTTO, larg=40, id="project-id-valore")
    I(t, "documento", 907, 196, 22, NAVY, 2.2)
    for x, v, l in ((708, "12", "livello"), (776, "320", "pt"), (838, "7", "sfide"), (904, "3", "badge")):
        tx(t, v, x, 283, 24, 800, NAVY, "middle", id=f"stat-{l}")
        tx(t, l, x, 307, 14.5, 400, SOTTO, "middle")
    voci = (("grafico", "I miei progressi", 98), ("gruppo", "Le mie sfide", 78), ("scudo", "Classifica", 68), ("bersaglio", "Obiettivi", 58), ("mondo", "Attività", 55), ("mondo", "Collegamenti", 86), ("documento", "Project ID", 69))
    for i, (ic, nome, w) in enumerate(voci):
        riga_menu(t, 703, 742, (351, 397, 443, 489, 536, 583, 630)[i], ic, nome, w_t=w, chevron_x=921)
    tabbar(t, TAB_ATLAS, 2)
    chiudi(t)

# ---------------------------------------------------------------- 16 impostazioni
def s16():
    t = nuova(30, 16, "impostazioni", (978, 10, 1298, 757), CART, vista=(825, 550, 1.7))
    stato(t); indietro(t, t.Y(80))
    tx(t, "Impostazioni", 1138, 128, 21, 800, NAVY, "middle", larg=120, id="titolo")
    voci = (("utente", "Account", "Email, password, sicurezza", 191, 60, 145), ("mondo", "Preferenze", "Tema, lingua", 277, 63, 59),
            ("campana", "Notifiche", "Solo attività importanti", 364, 62, 143), ("scudo", "Privacy", "Dati e permessi", 448, 52, 80),
            ("info", "Aiuto", "FAQ e supporto", 535, 40, 80), ("info", "Informazioni", "Versione dell’app", 620, 76, 82))
    for ic, ti, su, y, w1, w2 in voci:
        riga_menu(t, 1003, 1039, y + 5, ic, ti, su, w1, w2)
    chiudi(t)

def genera():
    for k, f in sorted(globals().items()):
        if k.startswith("s") and k[1:].isdigit(): f()

if __name__ == "__main__":
    genera()
