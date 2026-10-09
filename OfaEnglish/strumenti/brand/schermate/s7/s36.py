"""Schermate dell'immagine 36 (flusso schermate D: versione con nav a 5 voci e Profilo). Coordinate = px dei ritagli.
Corregge: nav a 5 voci uniforme (nell'originale 36.012 ha un'altra serie ATLAS/NOI/Agorà e voci illeggibili), lezione con margini
simmetrici (nel ritaglio il contenuto toccava il bordo), Impostazioni con titolo e freccia (assenti nell'originale),
'ƒ12 risposte' -> '12 risposte', avatar-foto -> avatar neutri."""
from componenti import *
from s34 import radar, percorso, aree, tabs, corona, noi, trofeo_oro, fiamma_agora, commento, _riga

G = lambda k: nuova(36, k)


def splash():
    t = G(1); X, Y, s = t.X, t.Y, t.s
    stato(t, y=19)
    logo_testo(t, 98, 178, 121)
    tx(t, "Supera l’OFA di inglese.", 100, 212, w=130, col="#5B6B8C", ancora="middle")
    tx(t, "Senza blocchi.", 100, 229.5, w=79, col="#5B6B8C", ancora="middle")
    g = t.sfumatura(["#2F90FD", "#0B6FF8"], 0, 0, 1, 1)
    # arco blu in basso a sinistra con un'apertura bianca (come l'originale, un'unica forma morbida)
    t.path(f"M{n(X(4))} {n(Y(332))}C{n(X(50))} {n(Y(300))} {n(X(105))} {n(Y(285))} {n(X(150))} {n(Y(296))}C{n(X(178))} {n(Y(303))} {n(X(192))} {n(Y(312))} {n(X(197))} {n(Y(320))}"
           f"L{n(X(197))} {n(Y(459))}L{n(X(136))} {n(Y(459))}C{n(X(146))} {n(Y(420))} {n(X(142))} {n(Y(385))} {n(X(115))} {n(Y(368))}C{n(X(85))} {n(Y(356))} {n(X(35))} {n(Y(370))} {n(X(4))} {n(Y(388))}z",
           fill=g, id="onda-blu")
    chiudi(t)


def onboarding():
    t = G(2); X, Y, s = t.X, t.Y, t.s
    stato(t, y=19)
    logo_testo(t, 92, 90.4, 109)
    for i, (a, w_) in enumerate((("Studia in modo mirato", 125.5), ("con un percorso", 97), ("personalizzato grazie", 127))):
        tx(t, a, 93, 132 + 18.4 * i, w=w_, col="#5B6B8C", ancora="middle", id=f"tagline-{i+1}")
    multi(t, [("all’intelligenza di ", "#5B6B8C", 400), ("ATLAS.", BL, 700)], 93, 187, 9.8, ancora="middle", id="tagline-4")
    documenti(t, 90, 277, 0.88)
    for i, x in enumerate((72, 92, 112)):
        t.cerchio(X(x), Y(368), s(3.4), fill=BL if i == 0 else "#D6DFEE", id=f"punto-{i+1}")
    pulsante(t, 12, 392, 173, 429, "Inizia", w=27)
    chiudi(t)


def test_iniziale():
    t = G(3); X, Y, s = t.X, t.Y, t.s
    stato(t, y=19)
    barra_prog(t, 12, 158, 42.7, 0.15)
    tx(t, "3/20", 186, 46, w=20, col="#5B6B8C", ancora="end")
    tx(t, "Choose the correct form.", 12, 97.7, w=153, peso=700)
    tx(t, "If I _____ more time,", 12, 135, w=136, col="#4B5B85"); tx(t, "I would travel.", 12, 155, w=88, col="#4B5B85")
    for i, (a, sel) in enumerate((("have", 0), ("had", 1), ("will have", 0), ("would have", 0))):
        y0 = (177.5, 214, 251, 288)[i]; opzione(t, 12, y0, 186, y0 + 33, a, sel, tx_x=52.5, corpo=8, id=f"opzione-{i+1}")
    card_atlas(t, 7, 372, 189, 432, ["adatta le domande al tuo livello", "in tempo reale."], titolo=[("ATLAS", NAVY, 700)], mx=49, corpo=5.8)
    chiudi(t)


def risultati():
    t = G(4); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    tx(t, "Il tuo livello", 16, 44.8, w=81, peso=800)
    t.icona("cerchio-info", X(110.5) - s(5.5), Y(38.8) - s(5.5), s(11), BL, 2.0)
    tx(t, "Analisi generata da ATLAS", 16, 62, w=121, col="#4B5B85")
    radar(t, 103.7, 169, 58, [("Grammar", 72), ("Vocabulary", 58), ("Listening", 65), ("Reading", 78), ("Writing", 62)],
          etichette={0: (106, 93, 108.8), 1: (177, 143, 157), 2: (163.6, 228, 243), 3: (46.5, 228, 243), 4: (31, 143, 157)})
    card_atlas(t, 11.5, 288, 202, 352, ["ATLAS ha creato un percorso", "personalizzato per te.", "Più studi, più il rischio si abbassa."], mx=59, corpo=5.7, inter=14.2)
    pulsante(t, 11.5, 367, 202, 404, "Inizia il tuo percorso", w=101)
    chiudi(t)


def home():
    t = G(5); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    logo_testo(t, 37, 47, 71, ancora="start")
    avatar_r(t, 202.6, 43.4, 14)
    t.misuratore(X(127.5), Y(168), s(82.5), 0.764, spessore=s(11.5), colore="#F0303B", chiaro="#FF7A7A", tacche=True)
    tx(t, "82%", 128, 153.6, w=53, peso=800, col="#E6121F", ancora="middle")
    tx(t, "Rischio di fallimento", 128, 172, w=92, peso=600, col="#E6121F", ancora="middle")
    tx(t, "all’OFA di inglese", 128, 186, w=68.5, col="#6B7694", ancora="middle")
    card(t, 35, 206, 220, 274.5, 8, "#FDEEEE", id="prossima-lezione")
    tile_icona(t, "libro", 36.5, 216, 78, 258, id="tile-libro", ic=22)
    tx(t, "Prossima lezione", 87.5, 222, w=61, col="#7A8499"); tx(t, "Future tenses", 87.5, 240, w=69, peso=700)
    t.icona("orologio", X(87.5), Y(249.5), s(7), "#7A8499", 1.7); tx(t, "10 min", 97, 255.4, corpo=5.8, col="#7A8499")
    t.linea(X(120), Y(249), X(120), Y(257), "#CBD3E3", 1); tx(t, "-6% rischio", 126, 255.4, corpo=5.8, col="#7A8499")
    pulsante(t, 35, 273, 220, 308.5, "Inizia la lezione", w=72.6)
    tx(t, "Il tuo progresso", 36.5, 333, w=67.5, peso=700)
    percorso(t, [(46, 352, "82%", "Oggi", "#E6121F"), (116.7, 362, "62%", "Dopo 5 lezioni", "#5B6C92"), (193, 368, "28%", "Dopo 15 lezioni", BL)], 385, 396.5)
    nav(t, NAV5_A, 0, 413.5, x0=21, x1=232)
    chiudi(t)


def lezione():
    t = G(6); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    indietro(t, 17, 29)
    tx(t, "3/10", 194, 31, w=19.5, col="#5B6B8C", ancora="end")
    barra_prog(t, 13, 194, 45.5, 0.15, h=3)
    tx(t, "Future tenses", 13, 85, w=82, peso=700)
    tx(t, "Completa la frase", 13, 123, w=122.5, peso=800)
    tx(t, "We _____ to Milan", 13, 156, w=121, col="#4B5B85"); tx(t, "tomorrow.", 13, 174.4, w=65, col="#4B5B85")
    for i, (a, sel) in enumerate((("go", 0), ("goes", 0), ("will go", 1), ("are going", 0))):
        y0 = (190, 225.8, 261, 296)[i]; opzione(t, 13, y0, 194, y0 + 31, a, sel, tx_x=53, corpo=8, id=f"opzione-{i+1}")
    card(t, 13, 337, 194, 382, 8, "#E3F7EC", id="feedback-corretto")
    spunta_tonda(t, 37, 358, 11)
    tx(t, "Corretto!", 60, 362.4, w=52, peso=700, col=VERDE_S)
    pulsante(t, 13, 390, 194, 425, "Avanti", w=31)
    chiudi(t)


def ranking():
    t = G(7); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    noi(t, 45, 50, 30)
    avatar_r(t, 175, 43, 14)
    t.icona("ingranaggio", X(205.5) - s(7), Y(43) - s(7), s(14), "#1B3A9A", 1.6)
    tx(t, "Classifica", 45, 84, w=72.5, peso=800)
    tabs(t, (("Settimanale", 44.5, 106), ("Mensile", 108, 159), ("Sempre", 161.6, 213)), 97, 119, 110)
    t.rett(X(38), Y(158), s(50), s(87), s(9), fill="#F1F4FA", id="podio-secondo"); t.rett(X(168.5), Y(158), s(50.5), s(87), s(9), fill="#F1F4FA", id="podio-terzo")
    t.rett(X(96.6), Y(145), s(63.4), s(100), s(10), fill="#FDEEDD", id="podio-primo")
    corona(t, 128.5, 139.7, 16)
    for cx, cy, r, tono, pos, nome, pt, yy in ((128, 168, 15.6, 1, "1", "ale.dis", "1.560 pt", 200), (63, 182, 14, 2, "2", "marti.s", "1.240 pt", 206.7), (192.6, 181, 14, 0, "3", "giulia.p", "1.120 pt", 209.5)):
        avatar_f(t, cx, cy, r, tono, id=f"avatar-{pos}")
        tx(t, pos, cx, yy, corpo=8, peso=700, col="#E5303B" if pos != "2" else "#5B6B8C", ancora="middle")
        tx(t, nome, cx, yy + 15.5, corpo=7, peso=500, ancora="middle"); tx(t, pt, cx, yy + 30, corpo=6.6, col="#7A8499", ancora="middle")
    for y, pos, nome, pt, tono, io in ((276.6, "4", "fede.it", "980 pt", 1, 0), (304, "5", "raffaele.ando", "820 pt", 0, 1), (331.8, "6", "luca.m", "790 pt", 2, 0), (359, "7", "chiara.m", "760 pt", 3, 0)):
        if io: t.rett(X(39), Y(290), s(178.5), s(28), s(9), fill="#E6F0FD", id="riga-utente")
        tx(t, pos, 51, y + 3, corpo=7.8, peso=700, ancora="middle")
        avatar_r(t, 79.6, y, 8.7) if io else avatar_f(t, 79.6, y, 8.7, tono)
        tx(t, nome, 98, y + 3, corpo=7.6, peso=600 if io else 500, col=BL if io else NAVY); tx(t, pt, 210.6, y + 3, corpo=7.2, col=BL if io else "#7A8499", ancora="end")
        if y in (331.8,): t.linea(X(62), Y(y + 14), X(215), Y(y + 14), "#EEF1F7", 1)
    card(t, 37, 385, 220.6, 450.7, 11, "#E3F7EC", id="card-noi")
    t.cerchio(X(54), Y(417), s(9), fill="#B9ECD3"); t.cerchio(X(60), Y(415), s(9), fill=t.sfumatura(["#19C07F", "#0A9A5E"], 0, 0, 1, 1))
    tx(t, "NOI", 81, 408, corpo=9, peso=800, col=VERDE_S)
    tx(t, "Sfida gli altri, scala la classifica", 81, 423, w=124, corpo=None, col="#2E7A59", peso=500)
    tx(t, "e sblocca badge esclusivi.", 81, 437, w=106, col="#2E7A59", peso=500)
    chiudi(t)


def simulazioni():
    t = G(14); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    tx(t, "Simulazioni", 18.4, 41, w=88.4, peso=800)
    t.icona("ricerca", X(186.6) - s(6.5), Y(33.5) - s(6.5), s(13), NAVY, 2.1)
    for y0, y1, ic, a, wa, b, wb, ch in ((62, 118, "libro", "Simulazione completa", 88, "40 domande · 60 min", 82, 1), (128, 184, "ingranaggio", "Simulazione per argomento", 110, "Scegli l’argomento", 73, 1),
                                         (194, 250, "libro", "Le mie simulazioni", 74, "2 completate", 53, 1)):
        card(t, 13.5, y0, 192, y1, 9, "#FFFFFF", bordo="#F0F3F9", ombra=True)
        cy = (y0 + y1) / 2
        tile_icona(t, ic, 19.6, cy - 18, 56.5, cy + 18, ic=19)
        tx(t, a, 70, cy - 3, w=wa, peso=700); tx(t, b, 70, cy + 13.5, w=wb, col="#5B6B8C")
        t.icona("chevron-destra", X(186) - s(3.6), Y(cy) - s(4.2), s(8.5), "#8892AB", 2.4)
    card_atlas(t, 15.5, 271, 190, 346, ["Le simulazioni si adattano", [("a te grazie ad ", "#4B5B85", 400), ("ATLAS", BL, 700), (",", "#4B5B85", 400)], "che seleziona le domande", "in base ai tuoi progressi."], mx=61.8, corpo=6.5, inter=14.2)
    nav(t, NAV5_A, 2, 365.4, x0=4, x1=194)
    chiudi(t)


def dettaglio_simulazione():
    t = G(8); X, Y, s = t.X, t.Y, t.s
    stato(t, y=18)
    indietro(t, 30.7, 48.3)
    t.cerchio(X(116.7), Y(57.3), s(14), fill="#E6F0FD"); atlas_marchio(t, 116.7, 57.3, 8)
    tx(t, "Simulazione personalizzata", 117, 96, w=178, peso=800, ancora="middle")
    multi(t, [("Generata da ", "#4B5B85", 400), ("ATLAS", BL, 700)], 117, 118, 9.6, ancora="middle")
    for yc, ic, a, b in ((157.7, "clipboard", "40 domande", None), (191.7, "orologio", "60 minuti", None), (225.7, "grafico", "Livello adattivo", None), (256.7, "bersaglio", "Focus su: Grammar, Future tenses,", "Modal verbs")):
        t.icona(ic, X(40) - s(6), Y(yc) - s(6), s(12), "#4B5B85", 1.6)
        tx(t, a, 61, yc + 4, corpo=7.8, col="#4B5B85", w=148 if b else None); 
        if b: tx(t, b, 61, yc + 19.3, corpo=7.8, col="#4B5B85")
    pulsante(t, 26.7, 323, 208.7, 358.7, "Inizia simulazione", w=88.7)
    nav(t, NAV5_A, 3, 378, x0=10, x1=224)
    chiudi(t)


def risultato_sim():
    t = G(9); X, Y, s = t.X, t.Y, t.s
    ring(t, 120.3, 62.3, 41.5, 7, 0.72)
    tx(t, "72%", 120.3, 69, w=36, peso=800, ancora="middle")
    tx(t, "Risultato simulazione", 120.3, 122.7, w=121.7, peso=800, ancora="middle")
    tx(t, "29/40 risposte corrette", 120.3, 138.3, w=121.7, col="#4B5B85", ancora="middle")
    card_atlas(t, 26, 156, 215, 203, [[("ATLAS", NAVY, 700), (" ha analizzato i tuoi errori", "#4B5B85", 400)], "e aggiornato il percorso."], mx=69, corpo=6.0, inter=15)
    aree(t, 28, 226, (28.7, 100, 187, 214), (250, 271.3, 292.7, 314), (65, 80, 75, 90))
    pulsante(t, 26, 330, 215, 364, "Vedi analisi completa", w=97)
    nav(t, NAV5_A, 2, 369, x0=13, x1=223)
    chiudi(t)


def correzione():
    t = G(10); X, Y, s = t.X, t.Y, t.s
    tx(t, "Domanda 12", 28.7, 45, w=54, peso=600)
    t.cerchio(X(39.3), Y(69.7), s(7), fill=ROSSO_S, id="errore"); t.icona("x", X(39.3) - s(3.2), Y(69.7) - s(3.2), s(6.4), "#FFFFFF", 3)
    tx(t, "Risposta sbagliata", 55.7, 72.7, w=85, peso=500, col=ROSSO_S)
    tx(t, "If I _____ more time,", 32.7, 101, w=111, col="#4B5B85"); tx(t, "I would travel.", 32.7, 117.7, w=72, col="#4B5B85")
    t.rett(X(25.3), Y(135), s(85), s(46.7), s(8), fill="#FFFFFF", stroke="#E3E9F4", sw=s(0.9), id="tua-risposta", filtro=t.ombra(s(0.6), s(3), "#0F2A6B", 0.05))
    tx(t, "La tua risposta", 34.7, 153.3, w=60, corpo=None, col="#6B7694"); tx(t, "have", 34.7, 170, corpo=9.5, peso=600, col=ROSSO_S)
    t.rett(X(120), Y(135), s(86), s(46.7), s(8), fill="#E3F7EC", id="risposta-corretta")
    tx(t, "Risposta corretta", 129.3, 153.3, w=69, col=VERDE_S, peso=500); tx(t, "had", 129.3, 170, corpo=9.5, peso=600, col=VERDE_S)
    card(t, 24.7, 206.7, 206, 303, 9, "#F1F6FD", id="spiegazione")
    atlas_marchio(t, 44, 231.3, 8)
    multi(t, [("Spiegazione di ", NAVY, 700), ("ATLAS", BL, 700)], 63, 234, 8.2)
    for i, a in enumerate(("Si usa il past perfect (had) per", "esprimere un’ipotesi non reale", "nel passato.")):
        tx(t, a, 40, 256 + 15.7 * i, w=138 if i == 0 else None, corpo=6.9, col="#4B5B85")
    t.rett(X(32), Y(310.7), s(166.7), s(32.3), s(8), fill="#FFFFFF", stroke="#DDE5F2", sw=s(1), id="vedi-altri-esempi")
    tx(t, "Vedi altri esempi", 115, 330, w=69.7, peso=600, ancora="middle")
    nav(t, NAV5_A, 2, 372.7, x0=13, x1=222)
    chiudi(t)


def discussione():
    t = G(11); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    tx(t, "Discussione", 27.4, 49, w=83, peso=800)
    t.icona("ricerca", X(213.6) - s(6.5), Y(41) - s(6.5), s(13), NAVY, 2.1)
    t.rett(X(27.8), Y(62), s(103), s(22), s(7), fill="#EEF3FB"); tx(t, "Da una tua simulazione", 33, 76.5, w=92, col="#4B5B85")
    t.rett(X(146), Y(60), s(75), s(24.7), s(8), fill="#FDEBD8", id="chip-agora"); fiamma_agora(t, 164.5, 72.4, 7); tx(t, "Agorà", 178, 77, w=30.7, peso=700, col="#F28A1E")
    tx(t, "Qual è il modo migliore per", 29, 105.6, w=153, peso=700); tx(t, "studiare i phrasal verbs?", 29, 124.8, w=139.5, peso=700)
    tx(t, "12 risposte · 2h fa", 29, 145, w=90, col="#6B7694")
    tx(t, "Più rilevanti", 29.5, 176.8, w=54.5, peso=700, col=BL); tx(t, "Più recenti", 98.6, 176.8, w=47.4, col="#8A94AC")
    t.linea(X(27), Y(187.8), X(220), Y(187.8), "#EDF1F8", 1); t.rett(X(29.5), Y(186.4), s(54.5), s(2.2), s(1), fill=BL)
    commento(t, 219, 0, "laura.s", ["lo uso le flashcard e funziona molto", "bene."], (144, 0), 15, 262, x_av=45.8, x_t=69.6)
    t.linea(X(27), Y(279.5), X(220), Y(279.5), "#EDF1F8", 1)
    commento(t, 302.8, 3, "marco.p", ["Secondo me è utile vederli in contesto,", "anche con serie TV."], (151, 0), 8, 343.7, x_av=45.8, x_t=69.6)
    t.rett(X(28.6), Y(367.4), s(192.4), s(34.4), s(9), fill="#FFFFFF", stroke="#E3E9F4", sw=s(0.9), id="campo-risposta")
    tx(t, "Scrivi una risposta...", 38.5, 388, w=76, col="#8A94AC")
    chiudi(t)


def profilo():
    t = G(12); X, Y, s = t.X, t.Y, t.s
    stato(t, y=17)
    t.icona("ingranaggio", X(186) - s(7), Y(35) - s(7), s(14), "#1B3A9A", 1.6)
    t.cerchio(X(52), Y(59), s(26), fill="#E1EDFD"); tx(t, "R", 52, 70.5, corpo=33, peso=800, col=BL, ancora="middle", id="avatar-iniziale")
    tx(t, "Raffaele", 90, 55, w=47.5, peso=800); tx(t, "@raffaele.ando", 90, 69.6, w=65.5, col="#6B7694")
    card(t, 26, 90.8, 196, 133, 10, "#EAF1FC", id="project-id")
    t.icona("cronometro", X(42.6) - s(8), Y(111) - s(8), s(16), BL, 1.8)
    tx(t, "Project ID", 60, 109, w=39, peso=700); tx(t, "#4821", 60, 121.5, corpo=6.8, col="#6B7694")
    t.icona("copia", X(181) - s(6), Y(111) - s(6), s(12), "#1B3A9A", 1.8)
    for x, v, a in ((40, "12", "livello"), (88.8, "320", "pt"), (135.4, "7", "sfide"), (179.6, "3", "badge")):
        tx(t, v, x, 161.6, corpo=12, peso=800, ancora="middle"); tx(t, a, x, 175, corpo=6.8, col="#6B7694", ancora="middle")
    ics = ["grafico", "squadra", "scudo", "fiamma", "bersaglio", "link"]
    for i, (a, w_) in enumerate((("I miei progressi", 64), ("Classifica (NOI)", 66), ("Le mie sfide (NOI)", 79), ("Discussioni (Agorà)", 88), ("Obiettivi", 36), ("Attività", 33))):
        y = 206.6 + 30.5 * i
        _riga(t, y, a, 39, 61.8, 191, ics[i], w_, y + 15 if i < 5 else None, (61.8, 196))
    nav(t, NAV5_A, 4, 378.5, x0=11, x1=199)
    chiudi(t)


def impostazioni():
    t = G(13); X, Y, s = t.X, t.Y, t.s
    dy = 0
    stato(t, y=17)
    indietro(t, 31, 38)
    tx(t, "Impostazioni", 45, 60, w=75, peso=800)
    righe_ = [("Account", 30, "Email, password, sicurezza", 104, "utente"), ("Preferenze", 40, "Tema, lingua", 50, "smile"), ("Notifiche", 36, "Solo attività importanti", 90, "campana"),
              ("Privacy", 30, "Dati e permessi", 64, "lucchetto"), ("Aiuto", 22, "FAQ e supporto", 66, "cerchio-info"), ("Informazioni", 52, "Versione dell’app", 72, "cerchio-info")]
    for i, (a, wa, b, wb, ic) in enumerate(righe_):
        y = 62 + 34 + 46.8 * i - 0
        t.icona(ic, X(39) - s(6.5), Y(y + 6) - s(6.5), s(13), "#2A3B7A", 1.6)
        tx(t, a, 65, y, w=wa * 1.2, peso=600); tx(t, b, 65, y + 15, w=wb, col="#6B7694")
        if i < 5: t.linea(X(39), Y(y + 28), X(180), Y(y + 28), "#EDF1F8", 1)
    chiudi(t)


TUTTE = [splash, onboarding, test_iniziale, risultati, home, lezione, ranking, simulazioni, dettaglio_simulazione, risultato_sim, correzione, discussione, profilo, impostazioni]
if __name__ == "__main__":
    for f in TUTTE: f()
