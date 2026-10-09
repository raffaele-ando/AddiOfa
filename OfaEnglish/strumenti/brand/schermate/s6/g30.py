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
    gauge(t, t.X(211), t.Y(357), t.s(164), t.s(34), 0.76)
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
        tx(t, su, 543, cy + 25, 16, 400, SOTTO, larg=w2, id=f"voce-{i+1}-sub")
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

def genera():
    for k, f in sorted(globals().items()):
        if k.startswith("s") and k[1:].isdigit(): f()

if __name__ == "__main__":
    genera()
