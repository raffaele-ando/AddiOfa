"""Immagine 49 · flusso app AddiOfa in 14 schermate (splash, onboarding, home, lezioni, esercizio, simulazioni, profilo, Esplora, ATLAS home e
articolo, NOI home ed evento, Agorà home e discussione). Si lancia da solo: python3 g49.py [numeri...]

Il catalogo (49.001-49.009) spezza la tavola in modo irregolare (49.001 = splash+onboarding+home, 49.005 = esercizio+simulazioni,
49.008/009 = pannelli con più schermate): qui ogni telefono è un SVG.
Corregge: fotografie (copertine, miniature, volti) sostituite da scene e avatar disegnati in vettoriale; la barra inferiore ha le stesse
posizioni in tutte le schermate (nell'originale le icone ballano di 2-4 px), con voce attiva nel colore della sezione (blu ATLAS/Studia, verde NOI,
arancio Agorà); valori e didascalie del grafico «Il tuo percorso» sulla stessa linea di base; nel profilo l'originale non ha voce attiva
nella barra: attivato «Profilo». Testi: tutti letti a 3x; «Tecnologia» e i chip a destra tagliati dal bordo restano tagliati come nell'originale.
"""
import sys, math
import registro  # noqa
from comuni import *
from extra import *
from g25 import grafico
from s8comp import misuratore_rischio

TIT = "#0B1033"
GR = "#6B7690"
BLU_T = "#2063F0"
VERDE_N = "#1E9E6A"
ARANCIO = "#F0621B"


def nav49(t, attiva, y_linea, y_ico, y_lab, centri, colore=BLU_T, corpo=8.4, ico=17, indicatore=None, h=None):
    voci = [("casa-contorno", "Home", "casa"), ("barre-contorno", "Studia", "barre-crescenti"), ("esplora", "Esplora", "esplora"), ("utente-contorno", "Profilo", "utente")]
    h = h or (t.H - y_linea)
    with t.gruppo("barra-di-navigazione"):
        R(t, 0, y_linea, t.W, h, 0, "#FFFFFF", id="nav-fondo")
        L(t, 0, y_linea, t.W, y_linea, "#EDF0F5", 1)
        for i, ((ic, et, ica), cx) in enumerate(zip(voci, centri)):
            att = i == attiva
            col = colore if att else "#7A86A3"
            I(t, ica if att else ic, cx, y_ico, ico, col, 2.2 if att else 1.9, id=f"nav-icona-{et.lower()}", fill_pieno=col if (att and ica in ("barre-crescenti", "casa", "utente")) else None)
            T(t, et, cx, y_lab, corpo, 600 if att else 500, col, "middle", id=f"nav-{et.lower()}")
        if indicatore:
            R(t, indicatore[0], indicatore[1], indicatore[2], 3.2, 1.6, "#0F172A", id="indicatore-home")


def chip_f(t, x, y, w, h, testo, attivo, fondo_att, col_att, corpo=8.4, bordo_att=None):
    R(t, x, y, w, h, h / 2, fondo_att if attivo else "#F1F4F9", stroke=bordo_att if attivo else None, sw=1.2, id=f"chip-{testo.lower()}")
    T(t, testo, x + w / 2, y + h / 2 + corpo * 0.36, corpo, 600 if attivo else 500, col_att if attivo else "#3A4566", "middle")


def s01():
    t = nuova("49-01-splash")
    R(t, 0, 0, t.W, t.H, 14, t.sfumatura(["#0C6DFC", "#0A66F5"]), id="schermata-fondo")
    cid = t.uid("cl")
    t.defs.append(f'<clipPath id="{cid}"><rect x="0" y="0" width="{n(t.p(t.W))}" height="{n(t.p(t.H))}" rx="{n(t.p(14))}"/></clipPath>')
    t.add(f'<g clip-path="url(#{cid})" id="cerchi-fondo">')
    C(t, 30, 330, 110, "#1C79FF", opacita=0.35); C(t, 170, 400, 120, "#0657DB", opacita=0.3)
    t.add("</g>")
    barra_stato(t, 15, 168, 17.5, corpo=8.6, colore="#FFFFFF")
    T(t, "AddiOfa", 91, 163, None, 700, "#FFFFFF", "middle", larg=115, id="logo-testo")
    T(t, "Supera l’OFA di inglese.", 91, 196, None, 400, "#FFFFFF", "middle", larg=117, id="slogan-1", opacita=0.95)
    T(t, "Senza blocchi.", 91, 212.5, None, 400, "#FFFFFF", "middle", larg=71, id="slogan-2", opacita=0.95)
    return chiudi(t)


def fogli(t, cx, cy, s=1.0):
    """Due fogli con righe (valuta il tuo livello): uno bianco con barre azzurre, uno blu inclinato."""
    with t.gruppo("illustrazione-fogli"):
        blob(t, cx, cy + 4 * s, 70 * s, 48 * s)
        with t.gruppo("foglio-blu", trasforma=f"rotate(-18 {n(t.p(cx - 22 * s))} {n(t.p(cy + 10 * s))})"):
            R(t, cx - 40 * s, cy - 14 * s, 38 * s, 54 * s, 6 * s, t.sfumatura(["#3B82F6", "#1F5FE0"]), id="foglio-blu-fondo", filtro=ombra(t, 2 * s, 8 * s, "#2563EB", 0.2))
            for i in range(3):
                R(t, cx - 34 * s, cy - 4 * s + i * 11 * s, 26 * s, 5 * s, 2.5 * s, "#8DB4FA", opacita=0.9)
        with t.gruppo("foglio-bianco", trasforma=f"rotate(6 {n(t.p(cx + 18 * s))} {n(t.p(cy))})"):
            R(t, cx - 8 * s, cy - 36 * s, 62 * s, 80 * s, 7 * s, "#FFFFFF", id="foglio-bianco-fondo", filtro=ombra(t, 3 * s, 10 * s, "#3B64C8", 0.14))
            R(t, cx + 6 * s, cy - 40 * s, 30 * s, 7 * s, 3 * s, "#9CC0FB", id="linguetta")
            for i, w in enumerate((42, 42, 42, 28)):
                R(t, cx + 0 * s, cy - 22 * s + i * 13 * s, w * s, 5.5 * s, 2.7 * s, "#B8D2FB")


def s02():
    t = nuova("49-02-onboarding")
    barra_stato(t, 17, 186, 17.5, corpo=8.8)
    logo(t, 45, 75, larg=98)
    fogli(t, 94, 150, 1.05)
    righe_t(t, ["Valuta il tuo livello,", "studia in modo mirato", "e riduci il rischio di fallimento."], 96, 224, 12, 17.5, 400, "#5B6580", "middle",
            larg=[99, 117, 158], id="testo")
    for i, c in enumerate(("#1F6BF0", "#CBD5E6", "#CBD5E6")):
        C(t, 80 + i * 16.5, 307, 3.6, c, id=f"pagina-{i + 1}")
    pulsante_blu(t, 10, 332, 174, 39, "Inizia", 12, r=10, larg=26, freccia=True, x_testo=78, id="pulsante-primario")
    return chiudi(t)


def s03():
    t = nuova("49-03-home")
    barra_stato(t, 17, 192, 15.5, corpo=8.8)
    logo(t, 14, 48, larg=63)
    campanella(t, 185, 43, 14)
    info(t, 185, 74, 6.4)
    misuratore_rischio(t, 103.5, 163, 82, 0.77, 11, "#F0303B", "#FF7A7A", id="misuratore", ticks_interni=False)
    T(t, "82%", 103, 150, None, 800, "#E0101E", "middle", larg=49)
    T(t, "Rischio di fallimento", 103, 168, None, 700, "#E0101E", "middle", larg=88)
    T(t, "all’OFA di inglese", 103, 183, None, 400, GR, "middle", larg=73)
    with t.gruppo("prossimo-passo"):
        R(t, 9, 200, 190, 105, 12, "#FDF3F3", id="prossimo-passo-fondo")
        tile_icona(t, "libro", 15, 209, 33, id="prossimo-passo-tile")
        T(t, "Prossimo passo", 65, 217, None, 400, GR, larg=61)
        T(t, "Future tenses", 65, 236, None, 700, TIT, larg=70)
        I(t, "libretto", 70, 249, 9, GR, 1.8); T(t, "Lezione", 79, 252, 8.2, 400, GR)
        L(t, 112, 245, 112, 254, "#D5DAE5", 1)
        I(t, "orologio", 123, 249.5, 9.5, GR, 1.9); T(t, "10 min", 131, 252, 8.2, 400, GR)
        L(t, 163, 245, 163, 254, "#D5DAE5", 1)
        T(t, "-6%", 181, 252, 8.6, 700, BLU_T, "middle")
    pulsante_azione(t, 13, 267, 182, 33, "Inizia la lezione", 10.2, icona=None, id="pulsante-primario", x_testo=64, r=8)
    T(t, "Il tuo percorso", 13, 326, None, 700, TIT, larg=58)
    grafico(t, [22, 97, 178], [343, 350, 352], 372, 384, 9.6, 8.2, base=362)
    nav49(t, 0, 397, 409, 427, [27, 78, 129, 180], colore=BLU_T, corpo=8.2, ico=17, indicatore=(65, 436, 78))
    return chiudi(t)


def s04():
    t = nuova("49-04-lezioni")
    barra_stato(t, 14, 183, 14.5, corpo=8.4)
    T(t, "Lezioni", 13, 46, None, 800, TIT, larg=42, id="titolo")
    righe = ["Present simple", "Present continuous", "Past simple", "Future tenses", "Modal verbs", "Conditionals", "Relative clauses", "Phrasal verbs"]
    for i, tx in enumerate(righe):
        yc = 75 + i * 31.7
        att = i == 3
        with t.gruppo(f"lezione-{i + 1}"):
            if att:
                R(t, 9, yc - 16, 174, 32, 9, "#E8F0FD", id="lezione-attiva-fondo")
            if i < 2:
                C(t, 24, yc, 8, "#FFFFFF", stroke="#35C98A", sw=1.4); T(t, str(i + 1), 24, yc + 3.6, 9.5, 600, "#1FA865", "middle")
            elif att:
                C(t, 24, yc, 8.3, "#FFFFFF", stroke="#2063F0", sw=1.6); T(t, "4", 24, yc + 3.6, 9.5, 700, "#2063F0", "middle")
            else:
                C(t, 24, yc, 8, "#E9EDF5"); T(t, str(i + 1), 24, yc + 3.6, 9.5, 600, "#5B6580", "middle")
            T(t, tx, 45, yc + 3.8, 10.2, 700 if att else 500, "#0B1033" if att else "#5B6580")
            if i < 2:
                verde_spunta(t, 169, yc, 7.6)
            elif att:
                I(t, "chevron-destra", 171, yc, 9, "#2063F0", 2.4)
            else:
                C(t, 169, yc, 7.4, "#FFFFFF", stroke="#D5DAE5", sw=1)
    nav49(t, 1, 360, 371, 387, [25, 72, 118, 166], colore=BLU_T, corpo=8.8, ico=17.5)
    return chiudi(t)


def s05():
    t = nuova("49-05-esercizio")
    barra_stato(t, 13, 187, 14.5, corpo=8.4)
    R(t, 13, 34, 138, 4, 2, "#EAEEF5", id="avanzamento-fondo"); R(t, 13, 34, 33, 4, 2, t.sfumatura(["#3F82F6", "#2A6DF0"], 0, 0, 1, 0), id="avanzamento-pieno")
    T(t, "3/10", 181, 40, None, 400, "#8A94AB", "end", larg=19, id="contatore")
    T(t, "Completa la frase", 14, 76, None, 800, TIT, larg=105, id="titolo")
    T(t, "We _____ to Milan", 14, 117, 14, 400, "#8A94AB", id="frase-1")
    T(t, "tomorrow.", 14, 135, 14, 400, "#8A94AB", id="frase-2")
    for i, (tx, sel) in enumerate((("go", False), ("goes", False), ("will go", True), ("are going", False))):
        y = (154, 188, 221, 255)[i]
        R(t, 13, y, 172, 30, 8, "#E9F1FE" if sel else "#FAFBFE", stroke="#8DB4F6" if sel else "#EEF1F6", sw=1.1, id=f"risposta-{i + 1}")
        if sel:
            C(t, 31, y + 15, 7.5, "#FFFFFF", stroke="#2063F0", sw=1.6); C(t, 31, y + 15, 3.4, "#2063F0")
        else:
            C(t, 31, y + 15, 7.5, "#FFFFFF", stroke="#C9D0DE", sw=1.1)
        T(t, tx, 52, y + 19, 10.6, 500 if not sel else 600, "#3A4566" if not sel else "#0B1033")
    R(t, 13, 298, 172, 45, 8, "#E4F6EB", id="feedback-corretto")
    verde_spunta(t, 34, 320, 10)
    T(t, "Corretto!", 54, 325.5, None, 600, "#1B2A44", larg=51)
    pulsante_blu(t, 13, 352, 173, 34, "Avanti", 11.4, r=9, larg=31, freccia=True, x_testo=86, id="pulsante-primario")
    return chiudi(t)


def s06():
    t = nuova("49-06-simulazioni")
    barra_stato(t, 15, 190, 14.5, corpo=8.4)
    T(t, "Simulazioni", 16, 52, None, 800, TIT, larg=84, id="titolo")
    voci = (("libro", "Simulazione completa", "40 domande · 60 min", 87, 81), ("ingranaggio", "Simulazione per argomento", "Scegli l’argomento", 108, 72),
            ("libro", "Le mie simulazioni", "2 completate", 73, 51))
    for i, (ic, tit, sub, wt, ws) in enumerate(voci):
        yc = 105 + i * 70.3
        with t.gruppo(f"voce-{i + 1}"):
            scheda_ombra(t, 11, yc - 31, 181, 62, 11, "#FFFFFF", "#F1F3F8", 0.05, id="fondo")
            tile_icona(t, ic, 25, yc - 14, 28, id="tile", sw=1.6)
            T(t, tit, 67, yc - 5.5, None, 600, TIT, larg=wt); T(t, sub, 67, yc + 12, None, 400, "#8A94AB", larg=ws)
            I(t, "chevron-destra", 183, yc - 4, 8, "#8A94AB", 2)
    nav49(t, 1, 362, 374, 388, [26, 74, 122, 172], colore=BLU_T, corpo=8.8, ico=17.5)
    return chiudi(t)


def s07():
    t = nuova("49-07-profilo")
    barra_stato(t, 15, 184, 14.5, corpo=8.4)
    indietro(t, 16, 40, 13, "#111827"); I(t, "ricerca", 174, 41, 15, "#14204A", 2.4)
    C(t, 33, 87, 22, "#E1EEFD", id="avatar-fondo"); T(t, "R", 33, 95, 24, 700, BLU_T, "middle", id="avatar-iniziale")
    T(t, "Raffaele", 66, 85, None, 700, TIT, larg=44); T(t, "raffaele@polimi.it", 66, 101, None, 400, GR, larg=76)
    for i, (ic, tx, wt) in enumerate((("barre-crescenti", "I tuoi progressi", 60), ("campana", "Notifiche", 38), ("aiuto", "Guida e FAQ", 55), ("impostazioni", "Impostazioni", 52), ("esci", "Esci", 21))):
        yc = (144, 178, 212, 247, 284)[i]
        I(t, ic, 23, yc, 13, BLU_T, 2.1, id=f"voce-{i + 1}-icona", fill_pieno=BLU_T if ic == "barre-crescenti" else None)
        T(t, tx, 42, yc + 3.6, None, 600, TIT, larg=wt, id=f"voce-{i + 1}-testo")
        if i == 1:
            t.interruttore(t.p(148), t.p(169), True, "blu", w=t.p(30), h=t.p(17), id="interruttore-notifiche")
        elif i < 4:
            I(t, "chevron-destra", 173, yc, 8, "#8A94AB", 2)
    nav49(t, 3, 363, 376, 391, [25, 71, 117, 163], colore=BLU_T, corpo=8.8, ico=17.5)
    return chiudi(t)


def s08():
    t = nuova("49-08-esplora")
    barra_stato(t, 15, 214, 18, corpo=8.8)
    T(t, "Esplora", 14, 56, None, 800, TIT, larg=68, id="titolo"); I(t, "ricerca", 202, 48, 16, "#14204A", 2.2)
    righe_t(t, ["Un ecosistema per il tuo percorso", "universitario e oltre."], 14, 80, 11, 16, 400, GR, larg=[174, 100], id="sottotitolo")
    for i, (nome, sub, y0, h0, sc, wsub) in enumerate((("ATLAS", "Scopri e approfondisci.", 111, 75, "pianeta", 110), ("NOI", "Connettiti e partecipa.", 195, 75, "persone", 108), ("Agorà", "Confrontati e discuti.", 279, 74, "agora", 101))):
        with t.gruppo(f"scheda-{nome.lower()}"):
            scena(t, sc, 14, y0, 196, h0, 14)
            R(t, 14, y0, 196, h0, 14, t.sfumatura(["#000000", "#000000"], 0, 0, 1, 0), opacita=0.0)
            T(t, nome, 30, y0 + 32, None, 700, "#FFFFFF", larg={"ATLAS": 52, "NOI": 35, "Agorà": 55}[nome], id="titolo")
            T(t, sub, 30, y0 + 53, None, 400, "#FFFFFF", larg=wsub, id="sottotitolo")
    nav49(t, 2, 380, 404, 420, [29, 84, 139, 196], colore=BLU_T, corpo=9.4, ico=20)
    return chiudi(t)


def s09():
    t = nuova("49-09-atlas-home")
    barra_stato(t, 15, 184, 17, corpo=8.4)
    T(t, "ATLAS", 15, 45, None, 800, TIT, larg=57, id="titolo"); I(t, "ricerca", 176, 37, 14, "#14204A", 2.2)
    for x, w, tx, att in ((13, 33, "Tutti", True), (51, 44, "Scienza", False), (98, 50, "Tecnologia", False), (152, 38, "Carriera", False)):
        chip_f(t, x, 61, w, 18, tx, att, "#BFD7FC", BLU_T, 8.4, "#6FA3F5")
    with t.gruppo("copertina"):
        scena(t, "scuro", 8, 93, 181, 67, 12)
        T(t, "Capire il mondo", 22, 123, None, 500, "#FFFFFF", larg=82); T(t, "per orientare il tuo futuro.", 22, 140, None, 400, "#FFFFFF", larg=131)
    T(t, "In evidenza", 10, 188, None, 700, TIT, larg=55)
    for i, (sc, l1, l2, meta, w1, w2) in enumerate((("citta", "Come funziona davvero", "il mercato del lavoro tech", "5 min", 101, 106), ("orb", "Intelligenza artificiale:", "opportunità e rischi", "8 min", 95, 86))):
        y0 = 198 + i * 69
        with t.gruppo(f"articolo-{i + 1}"):
            scena(t, sc, 14, y0, 55, 55, 9)
            T(t, l1, 79, y0 + 16, None, 600, TIT, larg=w1); T(t, l2, 79, y0 + 30, None, 600, TIT, larg=w2)
            I(t, "segnalibro-s", 82, y0 + 44, 8, "#8A94AB", 1.8); T(t, meta, 87, y0 + 47, 8, 400, "#8A94AB")
    nav49(t, 1, 353, 361, 377, [26, 74, 122, 172], colore=BLU_T, corpo=7.4, ico=16, indicatore=(63, 389, 72))
    return chiudi(t)


def s10():
    t = nuova("49-10-atlas-articolo")
    scena(t, "pianeta", 0, 0, t.W, 130, 14, r_angoli=(14, 14, 0, 0))
    barra_stato(t, 13, 163, 16, corpo=8.2, colore="#FFFFFF")
    indietro(t, 18, 36, 10, "#FFFFFF"); I(t, "segnalibro-s", 159, 36, 12, "#FFFFFF", 2)
    R(t, 0, 124, t.W, t.H - 124, 0, "#FFFFFF", id="foglio", r_angoli=(14, 14, 14, 14))
    chip_f(t, 14, 139, 55, 20, "Tecnologia", True, "#E3EEFD", BLU_T, 8.4)
    for i, (tx, w) in enumerate((("L’intelligenza artificiale", 147), ("sta cambiando", 102), ("l’università?", 79))):
        T(t, tx, 14, 178 + i * 19, None, 800, TIT, larg=w, id=f"titolo-{i + 1}")
    I(t, "orologio", 21, 231, 11, GR, 1.9); T(t, "8 min di lettura", 31, 234, None, 400, GR, larg=63)
    righe_t(t, ["Un’analisi chiara e imparziale su", "come l’AI sta trasformando il modo", "di studiare, lavorare e fare ricerca."], 14, 264, 9.6, 13.7, 400, GR, larg=[133, 148, 143], id="testo")
    nav49(t, 1, 353, 361, 377, [24, 68, 112, 157], colore=BLU_T, corpo=7.2, ico=15.5, indicatore=(55, 389, 69))
    return chiudi(t)


def s11():
    t = nuova("49-11-noi-home")
    barra_stato(t, 14, 173, 17, corpo=8.4)
    T(t, "NOi", 15, 46, None, 800, VERDE_N, larg=39, id="titolo"); I(t, "ricerca", 167, 37, 14, "#14204A", 2.2)
    for x, w, tx, att in ((12, 31, "Tutti", True), (48, 40, "Eventi", False), (92, 36, "Gruppi", False), (132, 40, "Persone", False)):
        chip_f(t, x, 60, w, 17, tx, att, "#9CE3C6", "#0E6B4A", 8.2, "#4FC29A")
    with t.gruppo("copertina"):
        scena(t, "persone", 7, 92, 172, 65, 12)
        T(t, "Una community", 19, 119, None, 500, "#FFFFFF", larg=81); T(t, "di studenti, per studenti.", 19, 135, None, 400, "#FFFFFF", larg=122)
    T(t, "Prossimi eventi", 8, 182, None, 700, TIT, larg=68); T(t, "Vedi tutti", 177, 182, None, 400, "#8A94AB", "end", larg=34)
    for i, (sc, tit, wt, d1, d2, pt, nomi, wp) in enumerate((("citta", "Aperitivo PoliNetwork", 88, "Mer 12 mar · 18:00", "Piazza Leonardo", "+42", ["m1", "f1", "m3", "f2"], 41),
                                                              ("orb", "Study group – OFA English", 105, "Gio 14 mar · 17:00", "Aula B12", "+8", ["f2", "m2", "m4", "f3"], 41))):
        y0 = 196 + i * 79
        with t.gruppo(f"evento-{i + 1}"):
            scena(t, sc if i == 0 else "evento", 13, y0, 37, 40, 7)
            T(t, tit, 59, y0 + 9.5, None, 600, TIT, larg=wt)
            T(t, d1, 59, y0 + 23.5, 8.4, 400, "#8A94AB"); T(t, d2, 59, y0 + 36.5, 8.4, 400, "#8A94AB")
            avatar_riga(t, 69, y0 + 53, 6.6, nomi, 8.8)
            T(t, pt, 106, y0 + 56, 8.6, 500, "#6B7690")
            R(t, 132, y0 + 44, 41, 19, 7, "#EAF2FE", stroke="#8DB4F6", sw=1.1, id="pulsante-partecipo")
            T(t, "Partecipo", 152.5, y0 + 56.5, 8.2, 600, BLU_T, "middle")
    nav49(t, 2, 349, 360, 373, [24, 70, 115, 161], colore=VERDE_N, corpo=6.8, ico=14.5, indicatore=(59, 387, 68))
    return chiudi(t)


def s12():
    t = nuova("49-12-noi-evento")
    scena(t, "evento", 0, 0, t.W, 124, 14, r_angoli=(14, 14, 0, 0))
    barra_stato(t, 13, 157, 16, corpo=8.2, colore="#FFFFFF")
    indietro(t, 17, 36, 10, "#FFFFFF"); I(t, "condividi", 130, 36, 12, "#FFFFFF", 2); I(t, "segnalibro-s", 151, 36, 12, "#FFFFFF", 2)
    R(t, 0, 119, t.W, t.H - 119, 0, "#FFFFFF", id="foglio", r_angoli=(14, 14, 14, 14))
    T(t, "Aperitivo PoliNetwork", 13.5, 147.5, None, 800, TIT, larg=124, id="titolo")
    I(t, "calendario", 21, 165, 11, GR, 1.8); T(t, "Mer 12 mar · 18:00–21:00", 28, 168, None, 400, GR, larg=99)
    I(t, "pin", 21, 181, 11, GR, 1.8); T(t, "Piazza Leonardo, Milano", 28, 184, None, 400, GR, larg=93)
    righe_t(t, ["Un momento informale per", "conoscersi, fare nuove amicizie", "e scoprire le iniziative di PoliNetwork."], 13.5, 205, 9.6, 13.4, 400, GR, larg=[108, 124, 144], id="testo")
    avatar_riga(t, 21, 269, 8.4, ["m1", "f1", "m3", "f2"], 11.5)
    T(t, "+42 partecipanti", 70.7, 272, None, 400, "#8A94AB", larg=58)
    pulsante_blu(t, 13, 288, 144, 30, "Partecipo", 10.6, r=8, larg=41, id="pulsante-primario")
    I(t, "segnalibro-s", 33, 341, 11, GR, 1.8); T(t, "Salva", 43, 344, None, 500, GR, larg=18)
    I(t, "condividi-freccia", 103, 341, 11, GR, 1.8); T(t, "Condividi", 112, 344, None, 500, GR, larg=33)
    R(t, 53, 386, 63, 3.2, 1.6, "#0F172A", id="indicatore-home")
    return chiudi(t)


def s13():
    t = nuova("49-13-agora-home")
    barra_stato(t, 14, 176, 17, corpo=8.4)
    T(t, "Agorà", 16, 45, None, 800, ARANCIO, larg=58, id="titolo"); I(t, "ricerca", 171, 38, 14, "#14204A", 2.2)
    cid = t.uid("cl")
    t.defs.append(f'<clipPath id="{cid}"><rect x="0" y="0" width="{n(t.p(t.W))}" height="{n(t.p(t.H))}" rx="{n(t.p(14))}"/></clipPath>')
    t.add(f'<g clip-path="url(#{cid})" id="chip-scorrevoli">')
    for x, w, tx, att in ((13, 31, "Tutti", True), (48, 49, "Università", False), (102, 40, "Attualità", False), (146, 52, "Tecnologia", False)):
        chip_f(t, x, 60, w, 18, tx, att, "#FFD9C2", ARANCIO, 8.4, "#F7B58A")
    t.add("</g>")
    with t.gruppo("copertina"):
        scena(t, "agora", 9, 93, 174, 67, 12)
        T(t, "Discussioni", 22, 122, None, 500, "#FFFFFF", larg=60); T(t, "tue idee, altri punti di vista.", 22, 138, None, 400, "#FFFFFF", larg=132)
    T(t, "Discussioni popolari", 10, 183, None, 700, TIT, larg=88)
    for i, (pers, righe, ws, com, yc) in enumerate((("m1", ["L’AI renderà inutili le lauree?"], [109], "236 commenti", 216), ("m3", ["È giusto che l’università", "blocchi gli esami per l’OFA?"], [96, 114], "189 commenti", 267),
                                                    ("m4", ["Meglio stage o proseguire", "con la magistrale?"], [107, 75], "124 commenti", 329))):
        with t.gruppo(f"discussione-{i + 1}"):
            R(t, 12, yc - 20, 40, 40, 12, "#FFEBDD", id="avatar-cornice")
            persona(t, pers, 32, yc, 15)
            y1 = yc - 5.5 if len(righe) == 1 else yc - 6.5
            if len(righe) == 1:
                T(t, righe[0], 61, 210.5, None, 600, TIT, larg=ws[0])
            else:
                T(t, righe[0], 61, yc - 6, None, 600, TIT, larg=ws[0]); T(t, righe[1], 61, yc + 7.5, None, 600, TIT, larg=ws[1])
            ym = 225 if len(righe) == 1 else yc + 19
            I(t, "commenti", 66, ym, 8, "#8A94AB", 1.8); T(t, com, 73, ym + 3, 8, 400, "#8A94AB")
    nav49(t, 2, 353, 373, 388, [26, 72, 118, 165], colore=ARANCIO, corpo=6.8, ico=15, indicatore=(61, 402, 70))
    return chiudi(t)


def s14():
    t = nuova("49-14-agora-discussione")
    barra_stato(t, 14, 176, 17, corpo=8.4)
    indietro(t, 16, 37, 10, "#111827"); I(t, "ricerca", 170, 37, 14, "#14204A", 2.2)
    R(t, 13, 52, 55, 16, 8, "#F1F4F9", id="percorso-pillola"); I(t, "chevron-sinistra", 20, 60, 6, "#51648F", 2.4)
    T(t, "Università", 28, 63, 8, 500, "#2D3A66")
    for i, (tx, w) in enumerate((("È giusto che l’università", 141), ("blocchi gli esami", 99), ("per l’OFA?", 62))):
        T(t, tx, 13, 87 + i * 16.3, None, 800, "#1B2548", larg=w, id=f"titolo-{i + 1}")
    T(t, "189 commenti · 2 giorni fa", 13, 135, None, 400, "#8A94AB", larg=95)
    righe_t(t, ["Secondo voi ha senso che un esame", "di inglese blocchi tutto il percorso", "universitario? È una misura utile", "o solo punitiva?"], 13, 161, 9.6, 14.3, 400, GR,
            larg=[155, 153, 145, 70], id="testo")
    T(t, "Più rilevanti", 13, 241, None, 600, BLU_T, larg=47); T(t, "Più recenti", 70, 241, None, 400, "#8A94AB", larg=42)
    R(t, 13, 252, 39, 1.8, 0.9, BLU_T, id="tab-sottolineatura")
    persona(t, "m3", 24, 278, 11); T(t, "Luca", 43, 274, None, 700, TIT, larg=17); T(t, "2 giorni fa", 43, 286, None, 400, "#8A94AB", larg=30)
    for dy in (-4, 0, 4):
        C(t, 176, 277 + dy, 0.9, "#8A94AB")
    righe_t(t, ["Secondo me ha senso, l’inglese è", "fondamentale. Però il sistema", "andrebbe reso più flessibile."], 43, 305, 9.3, 13.5, 400, GR, larg=[130, 122, 117], id="commento")
    I(t, "segnalibro-s", 48, 344, 10, GR, 1.8); T(t, "32", 60, 348, 9, 500, GR)
    I(t, "commento", 83, 344, 10, GR, 1.8); T(t, "Rispondi", 92.5, 348, None, 500, GR, larg=28)
    nav49(t, 2, 363, 378, 392, [25, 71, 117, 163], colore=BLU_T, corpo=6.8, ico=15, indicatore=(60, 403, 69))
    return chiudi(t)


def main(sel):
    for nome, f in list(globals().items()):
        if len(nome) == 3 and nome.startswith("s") and nome[1:3].isdigit() and callable(f) and (not sel or nome[1:3] in sel):
            f()


if __name__ == "__main__":
    main(sys.argv[1:])
