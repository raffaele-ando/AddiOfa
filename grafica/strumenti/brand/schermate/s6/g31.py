"""Immagine 31 · flusso schermate B (14 schermate AddiOFA: splash, onboarding, verifica OFA, email Polimi, quiz, home,
lezione, esercizi, fine lezione, simulazioni, lezioni, dettaglio lezione, il tuo percorso, profilo).
Stesso metodo di g30.py (misure in pixel delle viste di leggi.py). Corregge: testi AI di corpo piccolo (ricostruiti dal
contesto), icone storte, barra di avanzamento assente nell'esercizio, simbolo « + » mancanti, rispetto del kit blu."""
from componenti import *
CART = "31-flusso-schermate-b"
from g30 import logo_v, splash

# ---------------------------------------------------------------- 01 splash (stessa dell'immagine 30, senza onde: vista 5,15)
def s01():
    t = nuova(31, 1, "splash", (28, 32, 240, 423), CART)
    # coordinate sorgente dirette: ricalcolo la mappa su pixel dell'originale (z=1, ox=oy=0)
    t.rett(0, 0, 390, H, 22, fill=t.sfumatura(["#0A79FF", "#0069F5"]), id="sfondo-splash")
    stato(t, chiaro=True)
    c = 126 / larghezza_testo("AddiOfa", 1.0, 600)
    tx(t, "AddiOfa", 72, 213, c, 600, "#FFFFFF", id="logo")
    tx(t, "Supera l’OFA di inglese.", 134, 250, 13, 400, "#FFFFFF", "middle", larg=124, id="slogan-1")
    tx(t, "Senza blocchi.", 134, 266, 13, 400, "#FFFFFF", "middle", larg=76, id="slogan-2")
    chiudi(t)

# ---------------------------------------------------------------- 02 onboarding (vista 275,25 x2.4)
def s02():
    t = nuova(31, 2, "onboarding", (15, 12, 545, 965), CART, vista=(275, 25, 2.4))
    stato(t)
    logo_v(t, 172, 224, 216)
    for i, (r_, w, x, y) in enumerate((("Valuta il tuo livello, studia in", 360, 100, 294), ("modo mirato e riduci il rischio", 396, 82, 338), ("di fallire l’OFA.", 186, 187, 385))):
        tx(t, r_, x, y, 28, 500, SOTTO, larg=w, id=f"sottotitolo-{i+1}")
    doc_semplice(t, t.X(280), t.Y(600), 1.25)
    t.rett(t.X(222), t.Y(778) - 3.5, t.s(22), 7, 3.5, fill=AZZ, id="pagina-1")
    for x in (282, 331):
        t.cerchio(t.X(x), t.Y(778), 5, fill="#D5DCEC")
    pulsante(t, 52, 822, 513, 916, "Inizia")
    chiudi(t)

# ---------------------------------------------------------------- 03 verifica OFA già sostenuto
def s03():
    t = nuova(31, 3, "verifica-ofa", (655, 12, 1160, 965), CART, vista=(275, 25, 2.4))
    stato(t)
    logo_v(t, 692, 123, 156)
    tx(t, "Hai già l’attestato OFA", 692, 255, 34, 800, NAVY, larg=351, id="titolo-1")
    tx(t, "di inglese?", 692, 303, 34, 800, NAVY, larg=172, id="titolo-2")
    for i, (r_, w) in enumerate((("Se hai già superato l’OFA, puoi", 390), ("consultare la nostra guida con", 372), ("tutte le informazioni utili.", 301))):
        tx(t, r_, 692, (362, 400, 440)[i], 27, 400, SOTTO, larg=w, id=f"testo-{i+1}")
    scelta(t, 690, 518, 1148, 658, "Sì, l’ho già superato", True, 17, "Vai alla guida", True, "scelta-1", rx=739, tx_=791, larg=230, larg_sub=139)
    scelta(t, 690, 690, 1148, 830, "No, devo ancora sostenerlo", False, 17, "Fai il test di valutazione", True, "scelta-2", rx=739, tx_=791, larg=291, larg_sub=251)
    chiudi(t)

# ---------------------------------------------------------------- 04 email Polimi (vista 805,25 x2.4)
def s04():
    t = nuova(31, 4, "email-polimi", (10, 12, 540, 965), CART, vista=(805, 25, 2.4))
    stato(t)
    logo_v(t, 48, 123, 156)
    for i, (a, b) in enumerate(((46, 130), (137, 222), (229, 318), (325, 410), (418, 503))):
        R(t, a, 174, b, 183, 4.5, t.sfumatura(["#4D96FF", AZZ], 0, 0, 1, 0) if i == 0 else "#E6EBF5", id=f"avanzamento-{i+1}")
    tx(t, "Inserisci la tua email", 48, 273, 34, 800, NAVY, larg=345, id="titolo-1")
    tx(t, "@polimi.it", 48, 321, 34, 800, NAVY, larg=174, id="titolo-2")
    for i, (r_, w) in enumerate((("Salveremo i tuoi progressi e", 345), ("verificheremo che tu sia uno", 349), ("studente del Politecnico di Milano.", 422))):
        tx(t, r_, 48, (376, 414, 451)[i], 27, 400, SOTTO, larg=w, id=f"testo-{i+1}")
    R(t, 47, 523, 504, 620, 14, "#FFFFFF", id="campo-email", stroke="#E3E9F4", sw=1.3, filtro=ombra_l(t, .04))
    I(t, "mail", 90, 572, 34, "#6F7BA3", 1.9)
    tx(t, "nome.cognome@polimi.it", 135, 580, 22, 400, "#8F9BBA", larg=280, id="segnaposto-email")
    pulsante(t, 46, 685, 504, 779, "Continua")
    I(t, "lucchetto", 134, 843, 30, "#6F7BA3", 1.6, id="lucchetto")
    tx(t, "I tuoi dati sono al sicuro.", 164, 851, 22, 400, SOTTO, larg=251, id="nota-sicurezza")
    chiudi(t)

# ---------------------------------------------------------------- 05 quiz di valutazione
def s05():
    t = nuova(31, 5, "quiz-valutazione", (635, 12, 1160, 965), CART, vista=(805, 25, 2.4))
    stato(t)
    avanzamento_quiz(t, 0.15, t.Y(115), "3/20")
    tx(t, "Scegli la frase corretta", 670, 218, 34, 800, NAVY, larg=380, id="consegna")
    tx(t, "She", 670, 327, 31, 500, SOTTO, id="domanda-1a")
    t.linea(t.X(733), t.Y(331), t.X(820), t.Y(331), SOTTO, 1.3, id="spazio-vuoto")
    tx(t, "to Milan", 827, 327, 31, 500, SOTTO, larg=116, id="domanda-1b")
    tx(t, "every week.", 670, 369, 31, 500, SOTTO, larg=177, id="domanda-2")
    for i, (parola, sel, y0) in enumerate((("go", False, 428), ("goes", True, 535), ("is going", False, 640))):
        scelta(t, 670, y0, 1130, y0 + 88, parola, sel, 17.5, id=f"risposta-{i+1}", rx=713, tx_=772)
    pulsante(t, 670, 788, 1130, 888, "Avanti")
    chiudi(t)

# ---------------------------------------------------------------- 06 home dopo il test (vista 15,485 x1.9)
def s06():
    t = nuova(31, 6, "home", (2, 8, 484, 1262), CART, vista=(15, 485, 1.9), uniforme=True)
    stato(t)
    logo_v(t, 43, 88, 129)
    C(t, 431, 80, 21, fill="#EDF1F8", id="campanella-fondo"); I(t, "campana", 431, 80, 24, "#243B6B", 1.9, id="campanella")
    C(t, 434, 139, 11, fill="none", stroke="#8A96B5", sw=1.5)
    tx(t, "i", 434, 145, 15, 600, "#8A96B5", "middle")
    gauge(t, t.X(247), t.Y(325), t.s(165), t.s(34), 0.75, a0=182, a1=-2)
    tx(t, "82%", 247, 297, 52, 800, "#F01E2C", "middle", larg=110, id="percentuale")
    tx(t, "Rischio di fallimento", 248, 330, 19, 700, "#F01E2C", "middle", larg=176, id="rischio-etichetta")
    tx(t, "all’OFA di inglese", 247, 355, 16, 400, SOTTO, "middle", larg=130, id="rischio-sotto")
    R(t, 28, 380, 463, 655, 16, t.sfumatura(["#FDEBEC", "#F7F5FB"], 0, 0, 1, 1), id="card-prossimo-passo")
    R(t, 48, 408, 120, 482, 14, "#FFFFFF", id="tile-lezione", filtro=ombra_l(t))
    I(t, "libro", 84, 445, 40, AZZ, 1.9)
    tx(t, "PROSSIMO PASSO", 138, 417, 11, 500, SOTTO, larg=112, sp=0.3, id="etichetta-passo")
    tx(t, "Future tenses", 138, 450, 22, 700, NAVY, larg=143, id="titolo-passo")
    I(t, "chevron-destra", 433, 418, 14, NAVY, 2.4)
    I(t, "libro-o", 148, 476, 17, SOTTO, 1.9); tx(t, "Lezione", 160, 481, 12, 400, SOTTO, larg=40)
    t.linea(t.X(209), t.Y(467), t.X(209), t.Y(485), "#C9D1E3", 1)
    I(t, "orologio", 235, 476, 17, SOTTO, 1.9); tx(t, "10 min", 247, 481, 12, 400, SOTTO, larg=36)
    t.linea(t.X(297), t.Y(467), t.X(297), t.Y(485), "#C9D1E3", 1)
    I(t, "barre-o", 311, 476, 17, AZZ, 1.9); tx(t, "Riduce il rischio −6%", 325, 481, 12, 400, SOTTO, larg=120)
    tx(t, "Completa questa lezione per abbassare", 50, 521, 16, 400, SOTTO, larg=297, id="passo-testo-1")
    tx(t, "il tuo rischio di fallimento.", 50, 545, 16, 400, SOTTO, larg=188, id="passo-testo-2")
    R(t, 44, 570, 450, 636, 15, t.sfumatura(["#2D82FF", "#0A63F2"]), id="pulsante-inizia-lezione", filtro=t.ombra(4, 10, "#0A63F2", .26))
    C(t, 86, 603, 22, fill="#FFFFFF"); t.icona("play", t.X(86) - 7, t.Y(603) - 9, 18, AZZ, 1)
    tx(t, "Inizia la lezione", 139, 610, 17, 600, "#FFFFFF", larg=129, id="pulsante-testo")
    I(t, "freccia-destra", 416, 603, 24, "#FFFFFF", 2.0)
    tx(t, "Il tuo percorso", 33, 702, 22, 700, NAVY, larg=140, id="titolo-percorso")
    tx(t, "Vedi tutti", 437, 703, 16, 400, SOTTO, "end", larg=67); I(t, "chevron-destra", 452, 698, 11, SOTTO, 2.2)
    grafico_percorso(t, [(62, 741), (236, 766), (414, 775)], ["82%", "62%", "28%"], ["Oggi", "Dopo 5 lezioni", "Dopo 15 lezioni"], 808, 835)
    tabbar(t, TAB_APP, 0)
    chiudi(t)

# ---------------------------------------------------------------- 07 lezione
def s07():
    t = nuova(31, 7, "lezione", (568, 15, 975, 775), CART, vista=(15, 485, 1.9))
    stato(t); indietro(t, t.Y(91))
    avanzamento_quiz(t, 0.0, t.Y(92))
    tx(t, "Future tenses", 601, 162, 32, 800, NAVY, larg=199, id="titolo")
    tx(t, "1. Spiegazione", 601, 240, 22, 700, NAVY, larg=144, id="sottotitolo")
    tx(t, "Il futuro si usa per parlare", 601, 281, 24, 400, SOTTO, larg=275, id="testo-1")
    tx(t, "di azioni che accadranno.", 601, 314, 24, 400, SOTTO, larg=276, id="testo-2")
    R(t, 593, 350, 955, 553, 16, CARD_P, id="card-esempi")
    for cy in (391, 479):
        t.rett(t.X(610) - 1.5, t.Y(cy) - 4, 3, 8, 1.5, fill="#2CBF9B")
    tx_multi(t, [("I will go", NAVY, 600), (" to Milan.", "#46557F")], 630, 398, 22, 400, larg=160, id="esempio-1")
    tx(t, "(decisione al momento)", 631, 429, 18.5, 400, SOTTO, larg=198, id="esempio-1-nota")
    tx_multi(t, [("I am going", NAVY, 600), (" to study.", "#46557F")], 630, 486, 22, 400, larg=192, id="esempio-2")
    tx(t, "(piano già deciso)", 631, 517, 18.5, 400, SOTTO, larg=148, id="esempio-2-nota")
    punti_pagina(t, t.Y(629), 0, 5, t.X(702) + (t.X(846) - t.X(702)) / 2, (t.X(846) - t.X(702)) / 4)
    pulsante(t, 593, 665, 957, 727, "Continua", freccia=False)
    chiudi(t)

# ---------------------------------------------------------------- 08 esercizi (vista 560,485 x2.4)
def s08():
    t = nuova(31, 8, "esercizi", (20, 18, 540, 980), CART, vista=(560, 485, 2.4))
    stato(t)
    avanzamento_quiz(t, 0.3, t.Y(118), "3/10")
    tx(t, "Completa la frase", 50, 228, 36, 800, NAVY, larg=278, id="consegna")
    tx(t, "We", 50, 324, 31, 500, SOTTO, id="domanda-1a")
    t.linea(t.X(108), t.Y(328), t.X(200), t.Y(328), SOTTO, 1.3, id="spazio-vuoto")
    tx(t, "a test", 208, 324, 31, 500, SOTTO, larg=80, id="domanda-1b")
    tx(t, "tomorrow.", 50, 366, 31, 500, SOTTO, larg=155, id="domanda-2")
    for i, (parola, sel, y0) in enumerate((("have", False, 418), ("will have", True, 518), ("are having", False, 617))):
        scelta(t, 50, y0, 508, y0 + 82, parola, sel, 17.5, id=f"risposta-{i+1}", rx=94, tx_=152)
    esito_corretto(t, 50, 732, 508, 828, "Corretto!", "", 130, 1, 99)
    pulsante(t, 50, 850, 508, 930, "Avanti", freccia=False)
    chiudi(t)

# ---------------------------------------------------------------- 09 fine lezione
def s09():
    t = nuova(31, 9, "fine-lezione", (627, 18, 1150, 980), CART, vista=(560, 485, 2.4))
    stato(t)
    C(t, 883, 240, 127, fill=t.sfumatura(["#EDF3FD", "#E3EDFC"]), id="alone-trofeo")
    trofeo(t, t.X(882), t.Y(244), t.s(112))
    tx(t, "Lezione completata!", 883, 415, 34, 800, NAVY, "middle", larg=319, id="titolo")
    tx(t, "Il tuo rischio stimato", 886, 462, 24, 500, SOTTO, "middle", larg=215, id="testo-1")
    tx(t, "è diminuito di circa 6%.", 886, 497, 24, 500, SOTTO, "middle", larg=248, id="testo-2")
    R(t, 652, 548, 1120, 714, 16, "#FFFFFF", id="card-rischio", stroke="#E3E9F4", sw=1.3, filtro=ombra_l(t, .04))
    tx(t, "82%", 767, 628, 40, 800, "#F01E2C", "middle", larg=80, id="rischio-prima")
    I(t, "freccia-destra", 886, 613, 36, "#5E6B99", 1.8)
    tx(t, "76%", 1010, 628, 40, 800, "#17A455", "middle", larg=80, id="rischio-dopo")
    tx(t, "Rischio precedente", 767, 668, 20, 500, "#46557F", "middle", larg=181, id="etichetta-prima")
    tx(t, "Rischio attuale", 1011, 668, 20, 500, "#46557F", "middle", larg=137, id="etichetta-dopo")
    pulsante(t, 653, 784, 1120, 862, "Vai alla prossima lezione", corpo=17)
    pulsante_chiaro(t, 653, 880, 1120, 958, "Torna alla Home", 16.5)
    chiudi(t)

# ---------------------------------------------------------------- 10 simulazioni (vista 1060,485 x2.6)
def s10():
    t = nuova(31, 10, "simulazioni", (38, 20, 590, 1075), CART, vista=(1060, 485, 2.6))
    stato(t)
    tx(t, "Simulazioni", 75, 133, 40, 800, NAVY, larg=222, id="titolo")
    voci = [("libro", "Simulazione completa", "40 domande  ·  60 min", 260, 248, 220),
            ("orologio", "Simulazione per argomento", "Scegli l’argomento", 432, 303, 187),
            ("documento", "Le mie simulazioni", "2 completate", 604, 205, 133)]
    for i, (ic, ti, su, cy, w1, w2) in enumerate(voci):
        R(t, 88, cy - 67, 570, cy + 67, 18, "#FFFFFF", id=f"card-{i+1}", stroke="#EDF1F8", sw=1, filtro=ombra_l(t, .05))
        R(t, 102, cy - 40, 180, cy + 40, 18, "#F3F7FF", id=f"tile-{i+1}")
        I(t, ic, 141, cy, 38, AZZ, 2.0)
        tx(t, ti, 215, cy - 11, 22, 700, NAVY, larg=w1, id=f"voce-{i+1}-titolo")
        tx(t, su, 215, cy + 30, 20, 400, SOTTO, larg=w2, id=f"voce-{i+1}-sub")
        I(t, "chevron-destra", 548, cy, 16, "#7C88AC", 2.2)
    tabbar(t, TAB_APP, 1)
    chiudi(t)

# ---------------------------------------------------------------- 11 lezioni (lista) (vista 295,925 x2.8)
def s11():
    t = nuova(31, 11, "lezioni-lista", (25, 10, 557, 712), CART, vista=(295, 925, 2.8))
    stato(t)
    tx(t, "Lezioni", 60, 92, 34, 800, NAVY, larg=108, id="titolo")
    voci = (("Present simple", 170, "ok"), ("Present continuous", 225, "ok"), ("Past simple", 132, ""), ("Future tenses", 158, "corrente"), ("Modal verbs", 144, ""), ("Conditionals", 148, ""))
    for i, (nome, w, st) in enumerate(voci):
        cy = (164, 235, 306, 377, 447, 518)[i]
        if st == "corrente": R(t, 53, 342, 533, 412, 14, "#E8F1FF", id="riga-corrente")
        if st == "ok":
            C(t, 89, cy, 18, fill="#FFFFFF", stroke="#17A455", sw=2.4); tx(t, str(i + 1), 89, cy + 8, 22, 600, "#17A455", "middle")
            C(t, 506, cy, 15, fill="#17A455"); t.icona("spunta", t.X(506) - t.s(7), t.Y(cy) - t.s(7), t.s(14), "#FFFFFF", 3.2)
        elif st == "corrente":
            C(t, 89, cy, 18, fill="#FFFFFF", stroke=AZZ, sw=2.6); tx(t, "4", 89, cy + 8, 22, 700, AZZ, "middle")
            C(t, 506, cy, 15, fill="#FFFFFF", stroke="#C5D5F2", sw=1.6); I(t, "chevron-destra", 507, cy, 12, AZZ, 2.4)
        else:
            C(t, 89, cy, 19, fill="#E9EDF6"); tx(t, str(i + 1), 89, cy + 8, 22, 600, "#46557F", "middle")
            C(t, 506, cy, 15, fill="#FFFFFF", stroke="#D5DBEA", sw=1.8)
        tx(t, nome, 139, cy + 9, 24, 700 if st == "corrente" else 400, NAVY if st == "corrente" else "#46557F", larg=w, id=f"lezione-{i+1}")
    tabbar(t, TAB_APP, 2)
    chiudi(t)

# ---------------------------------------------------------------- 12 dettaglio lezione
def s12():
    t = nuova(31, 12, "dettaglio-lezione", (648, 10, 1160, 712), CART, vista=(295, 925, 2.8))
    stato(t); indietro(t, t.Y(100))
    avanzamento_quiz(t, 0.2, t.Y(103))
    tx(t, "Future tenses", 680, 183, 36, 800, NAVY, larg=205, id="titolo")
    tx(t, "Impara e pratica i tempi futuri", 680, 235, 28, 400, SOTTO, larg=339, id="sottotitolo-1")
    tx(t, "più comuni.", 680, 273, 28, 400, SOTTO, larg=132, id="sottotitolo-2")
    for i, (ic, nome, w) in enumerate((("libro", "Spiegazione", 134), ("documento", "Esempi", 82), ("bersaglio", "Esercizi", 83), ("fulmine", "Quiz finale", 100))):
        cy = (333, 404, 474, 545)[i]
        R(t, 690, cy - 17, 720, cy + 17, 8, AZZ_SEL, id=f"icona-{i+1}-fondo"); I(t, ic, 705, cy, 22, AZZ, 2.1)
        tx(t, nome, 756, cy + 9, 24, 500, "#2A3560", larg=w, id=f"voce-{i+1}")
        I(t, "chevron-destra", 1107, cy, 15, "#46557F", 2.2)
        if i < 3: t.linea(t.X(740), t.Y(cy + 35), t.X(1127), t.Y(cy + 35), "#EDF1F8", 1)
    pulsante(t, 680, 600, 1127, 683, "Inizia la lezione", freccia=False)
    chiudi(t)

# ---------------------------------------------------------------- 13 il tuo percorso (vista 735,925 x2.6)
def s13():
    t = nuova(31, 13, "il-tuo-percorso", (35, 15, 530, 665), CART, vista=(735, 925, 2.6))
    stato(t)
    tx(t, "Il tuo percorso", 62, 105, 34, 800, NAVY, larg=210, id="titolo")
    grafico_percorso(t, [(86, 168), (261, 210), (469, 251)], ["82%", "62%", "28%"], ["Oggi", "Dopo 5 lezioni", "Dopo 15 lezioni"], 290, 320)
    for i, (ic, nome, w) in enumerate((("libro", "Come viene calcolato il rischio?", 314), ("documento", "Fattori che lo influenzano", 249), ("bersaglio", "Obiettivo: sotto il 20%", 222))):
        cy = (424, 502, 579)[i]
        R(t, 62, cy - 36, 510, cy + 36, 14, "#FFFFFF", id=f"card-{i+1}", stroke="#EDF1F8", sw=1, filtro=ombra_l(t, .05))
        I(t, ic, 87, cy, 24, AZZ, 2.1)
        tx(t, nome, 135, cy + 9, 22, 500, "#2A3560", larg=w, id=f"voce-{i+1}")
        I(t, "chevron-destra", 490, cy, 15, NAVY, 2.4)
    chiudi(t)

# ---------------------------------------------------------------- 14 profilo / impostazioni
def s14():
    t = nuova(31, 14, "profilo", (640, 15, 1135, 685), CART, vista=(735, 925, 2.6))
    stato(t); indietro(t, t.Y(95))
    tx(t, "Profilo", 872, 103, 30, 800, NAVY, "middle", larg=93, id="titolo")
    C(t, 733, 205, 56, fill="#E4EEFD", id="avatar-fondo")
    tx(t, "R", 733, 223, 54, 800, AZZ, "middle", id="avatar-iniziale")
    tx(t, "Raffaele", 820, 197, 26, 700, NAVY, larg=97, id="nome")
    tx(t, "raffaele@polimi.it", 820, 232, 20, 400, SOTTO, larg=168, id="email")
    for i, (ic, nome, w) in enumerate((("barre-p", "I tuoi progressi", 145), ("campana", "Notifiche", 91), ("info", "Guida e FAQ", 123), ("esci", "Esci", 40))):
        cy = (319, 388, 458, 527)[i]
        I(t, ic, 684, cy, 30, AZZ, 2.1)
        tx(t, nome, 733, cy + 9, 22, 500, "#2A3560", larg=w, id=f"voce-{i+1}")
        if i == 1:
            R(t, 1033, 371, 1095, 405, 17, AZZ, id="interruttore"); C(t, 1078, 388, 13)
        else:
            I(t, "chevron-destra", 1085, cy, 14, "#9AA5C0", 2.2)
        if i < 3: t.linea(t.X(733), t.Y(cy + 35), t.X(1095), t.Y(cy + 35), "#EDF1F8", 1)
    tabbar(t, TAB_APP, -1)
    chiudi(t)

def genera():
    for k, f in sorted(globals().items()):
        if k.startswith("s") and k[1:].isdigit(): f()

if __name__ == "__main__":
    genera()
