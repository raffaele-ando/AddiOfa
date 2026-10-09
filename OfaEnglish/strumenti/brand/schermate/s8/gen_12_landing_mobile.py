"""Immagine 12 (landing mobile 'Oltre l'OFA, un passo in piu''). Originale 724x2092.

Vettoriale: testata (icona stella del logo + AddiOFA, pulsante, menu), titolo, paragrafo, pulsante, striscia dei 4 vantaggi,
'Come funziona' (4 passi), telefono inclinato con la schermata rossa, 'Tutto cio' che ti serve' (4 card), 'Dati reali',
banda finale con pulsanti store e marchio-tile.
RASTER (foto, dichiarate nel rapporto): hero (palazzo con la porta-stella e lo studente, con i pulsanti dell'interfaccia
ripuliti con inpaint), 4 volti tondi 'Gia 12.000+ studenti', facciata del Politecnico nella card 'Il tuo futuro'.
Corregge: l'intestazione AI e' 'AddiOFA' (qui lasciata cosi', come in originale); le tre icone della striscia hanno lo stesso
tratto; i cerchi dei passi sono a passo regolare (nell'originale 90/98/97 px); nella card 'Dati reali' l'arco e' una vera
sfumatura con terminali tondi; il telefono ha le proporzioni di un telefono vero (nell'originale la prospettiva lo schiaccia);
i badge store sono semplificati (mela e triangolo Play disegnati a mano, senza loghi ufficiali).
Testi ricostruiti: nessuno (tutti leggibili ingrandendo)."""
import sys, pathlib, math
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *
from ui import clip_rett

CART = "12-landing-mobile"
ORIG = CONCEPT / CART / "001-schermata.png"
W, H = 724, 2092
LOGO_TILE = RADICE / "brand/concept-svg/logo/marchio-tile-porta.svg"
NAVY = "#0B1033"; AZZ = "#1D6BF2"; AZZ2 = "#2B6FF2"; GRIGIO_T = "#5B6784"


def sfondo_hero(t):
    p = t.p
    # foto: parte destra del palazzo, ripulita dai pulsanti
    f = ritaglio(ORIG, (352, 0, 724, 620), inpaint=[(448, 16, 614, 70), (652, 28, 690, 56)])
    t.foto(f, p(352), 0, p(372), p(620), 0, id="foto-hero")
    # dissolvenza a sinistra (dal bianco)
    R(t, 352, 0, 130, 620, 0, sfum_op(t, [(0, "#FFFFFF", 1), (1, "#FFFFFF", 0)], 0, 0, 1, 0), id="dissolvenza-hero")
    # taglio in basso: dissolve verso la striscia
    R(t, 352, 0, 372, 30, 0, sfum_op(t, [(0, "#FFFFFF", 0.0), (1, "#FFFFFF", 0.0)], 0, 0, 0, 1))


def testata(t):
    p = t.p
    with t.gruppo("testata"):
        t.inserisci_svg(LOGO_TILE.read_text(), p(14), p(20), p(47), "logo-icona-stella")
        wa = T(t, "Addi", 72, 54, corpo=33, peso=800, colore=NAVY, id="logo-addi", spaz=-0.4)
        T(t, "OFA", 72 + wa - 1, 54, corpo=33, peso=800, colore=AZZ, id="logo-ofa", spaz=-0.4)
        # pulsante
        R(t, 453, 21, 155, 44, 22, t.sfumatura(["#2F7BF6", "#1F63F0"], 0, 0, 1, 0), id="pulsante-scarica",
          filtro=t.ombra(p(3), p(10), "#2563EB", 0.25))
        T(t, "Scarica l'app", 480, 49, larg=76, peso=600, colore="#FFFFFF")
        I(t, "freccia-destra", 579, 43, 22, "#FFFFFF", 2)
        for i, y in enumerate((34, 43.5, 52)):
            L(t, 659, y, 684, y, NAVY, 3, cap="round")


def hero_testi(t):
    p = t.p
    T(t, "Oltre l’OFA,", 15, 171, larg=330, peso=800, colore=NAVY, id="titolo-1", spaz=-0.8)
    T(t, "un passo", 17, 237, larg=266, peso=800, colore=AZZ2, id="titolo-2", spaz=-0.8)
    T(t, "in più.", 17, 285, larg=176, peso=800, colore=AZZ2, id="titolo-3", spaz=-0.8)
    righe = [("AddiOFA ti aiuta a superare", 231), ("l’OFA di inglese con un percorso", 268),
             ("personalizzato, evitando rischi,", 256), ("costi e blocchi del tuo piano di studi.", 296)]
    for i, (r_, lw) in enumerate(righe):
        T(t, r_, 18, 333.5 + i * 24, larg=lw, peso=400, colore="#44506B", id=f"paragrafo-{i + 1}")
    with t.gruppo("pulsante-inizia-ora"):
        R(t, 17, 434, 307, 56, 28, t.sfumatura(["#2F7BF6", "#1F63F0"], 0, 0, 1, 0), id="inizia-ora-fondo",
          filtro=t.ombra(p(4), p(12), "#2563EB", 0.28))
        T(t, "Inizia ora", 117, 468, larg=85, peso=600, colore="#FFFFFF")
        I(t, "freccia-destra", 224, 462, 28, "#FFFFFF", 2)
    # volti (raster)
    for i, (cx, box) in enumerate(((30, (14, 517, 47, 551)), (54, (38, 517, 71, 551)), (84, (68, 517, 101, 551)), (109, (92, 517, 127, 551)))):
        pass
    cent = [(30, 534), (54, 534), (84, 534), (109, 534)]
    with t.gruppo("volti-studenti"):
        for i, (cx, cy) in enumerate(cent):
            f = ritaglio(ORIG, (cx - 17, cy - 17, cx + 17, cy + 17))
            t.foto(f, p(cx - 17), p(cy - 17), p(34), p(34), p(17), id=f"volto-{i + 1}")
            C(t, cx, cy, 17, "none", stroke="#FFFFFF", sw=1.5)
    # testo
    w = T(t, "Già ", 143, 526, larg=None, corpo=15.5, peso=400, colore="#44506B")
    w2 = T(t, "12.000+", 143 + w, 526, corpo=15.5, peso=700, colore=NAVY)
    T(t, " studenti", 143 + w + w2, 526, corpo=15.5, peso=400, colore="#44506B")
    T(t, "si stanno preparando con AddiOFA", 143, 548, larg=230, peso=400, colore="#44506B")


def striscia_vantaggi(t):
    p = t.p
    with t.gruppo("striscia-vantaggi"):
        R(t, 2, 581, 707, 147, 26, "#F5F8FE", id="striscia-fondo", filtro=ombra(t, 3, 14, "#2563EB", 0.06))
        dati = [(90, "scudo-spunta", "Evita il rischio", 95, "di non superare l'OFA", 148),
                (271, "monete", "Non perdere", 89, "i circa 30€ di tasse", 129),
                (444, "lucchetto", "Sblocca il tuo", 94, "piano di studi", 91),
                (613, "barre-crescenti", "Un percorso", 87, "su misura per te", 112)]
        for cx, ic, a, wa, b, wb in dati:
            with t.gruppo("vantaggio-" + ic):
                C(t, cx, 624, 29, "#E4EDFC")
                I(t, ic, cx, 624, 34 if ic != "barre-crescenti" else 30, AZZ, 2.0 if ic in ("scudo-spunta", "monete") else 1.4,
                  fill_pieno=None)
                T(t, a, cx, 676, larg=wa, peso=700, colore=NAVY, ancora="middle")
                if "30€" in b:
                    # '30€' in grassetto
                    T(t, b, cx, 698, larg=wb, peso=400, colore="#44506B", ancora="middle")
                else:
                    T(t, b, cx, 698, larg=wb, peso=400, colore="#44506B", ancora="middle")


def come_funziona(t):
    p = t.p
    with t.gruppo("come-funziona"):
        R(t, 17, 763, 134, 23, 11.5, "#E1EBFC", id="chip-come-funziona")
        T(t, "COME FUNZIONA", 25, 779.5, larg=107, peso=700, colore=AZZ, spaz=0.5)
        T(t, "Un percorso semplice", 18, 822, larg=348, peso=800, colore=NAVY, id="titolo-sezione-1", spaz=-0.4)
        T(t, "e guidato.", 18, 860, larg=161, peso=800, colore=NAVY, id="titolo-sezione-2", spaz=-0.4)
        T(t, "Dal test iniziale al superamento,", 18, 895, larg=282, peso=400, colore=GRIGIO_T)
        T(t, "tutto in un’unica app.", 18, 919, larg=168, peso=400, colore=GRIGIO_T)
        passi = [("Fai il test iniziale", 128, ["Scopri il tuo livello e la", "probabilità di superare l’OFA."], [156, 205]),
                 ("Segui un piano personalizzato", 240, ["Lezioni, quiz e simulazioni", "pensati per i tuoi punti deboli."], [177, 200]),
                 ("Allenati con simulazioni reali", 229, ["Stesso formato dell’esame", "ufficiale."], [193, 60]),
                 ("Supera l’OFA", 106, ["Accedi al secondo anno senza", "blocchi."], [223, 58])]
        ys = [966 + i * 94.7 for i in range(4)]
        for i in range(3):
            L(t, 36, ys[i] + 24, 36, ys[i + 1] - 24, "#9DBBF5", 2)
        for i, (tit, wt, righe, lw) in enumerate(passi):
            cy = ys[i]
            with t.gruppo(f"passo-{i + 1}"):
                C(t, 36, cy, 20, "#E3ECFC")
                T(t, str(i + 1), 36, cy + 7, corpo=19, peso=700, colore=AZZ, ancora="middle")
                T(t, tit, 84, cy - 2, larg=wt, peso=700, colore=NAVY)
                for j, r_ in enumerate(righe):
                    T(t, r_, 84, cy + 22 + j * 20, larg=lw[j], peso=400, colore=GRIGIO_T)


def telefono(t):
    p = t.p
    # forme blu dietro
    with t.gruppo("sfondo-telefono"):
        R(t, 540, 790, 164, 475, 28, t.sfumatura(["#6AA0FA", "#2F62E3"]), id="pannello-blu-destro", r_angoli=(28, 28, 70, 28))
        R(t, 368, 850, 190, 450, 34, t.sfumatura(["#67A0F9", "#3B73EA"]), id="pannello-blu-sinistro", r_angoli=(34, 12, 12, 46))
        t.ellisse(p(527), p(1300), p(130), p(14), fill=t.radiale([(0, "#1E3A8A", 0.28), (1, "#1E3A8A", 0)]), id="ombra-telefono")
    cx, cy = 527, 1022
    with t.gruppo("telefono", trasforma=f"translate({n(p(cx))} {n(p(cy))}) rotate(5)"):
        # bordo metallico laterale (a destra)
        R(t, -117, -268, 246, 540, 38, t.sfumatura(["#B7C2D9", "#7F8DAE", "#C9D2E4"], 0, 0, 1, 0), id="telaio-metallo")
        R(t, -121, -270, 242, 540, 36, t.sfumatura(["#222B4A", "#161C33"]), id="telaio-nero")
        R(t, -111, -261, 222, 522, 28, "#FFFFFF", id="schermo")
        sx, sy = -111, -261
        # contenuto dello schermo
        T(t, "9:41", sx + 16, sy + 24, corpo=10, peso=700, colore=NAVY)
        for i, hh in enumerate((3, 5, 7, 9)):
            R(t, sx + 168 + i * 4, sy + 24 - hh, 2.6, hh, 1, NAVY)
        R(t, sx + 188, sy + 15, 17, 9, 2.6, "none", stroke=NAVY, sw=1)
        R(t, sx + 189.5, sy + 16.5, 12, 6, 1.6, NAVY)
        t.inserisci_svg(LOGO_TILE.read_text(), p(sx + 62), p(sy + 50), p(23), "mock-logo-stella")
        wa = T(t, "Addi", sx + 90, sy + 68, corpo=14, peso=800, colore=NAVY, spaz=-0.2)
        T(t, "OFA", sx + 90 + wa - 0.2, sy + 68, corpo=14, peso=800, colore=AZZ, spaz=-0.2)
        T(t, "Sei a rischio?", sx + 111, sy + 118, larg=94, peso=800, colore=NAVY, ancora="middle")
        STATO = STATI["alto"]
        misuratore_rischio(t, sx + 111, sy + 214, 62, 0.78, 12, STATO["colore"], STATO["chiaro"], vuoto="#EEF1F7",
                           ticks_esterni=False, ticks_interni=False, alone=0.0, id="mock-misuratore")
        T(t, "82%", sx + 111, sy + 236, larg=60, peso=800, colore=STATO["num"], ancora="middle")
        T(t, "Probabilità di", sx + 111, sy + 264, larg=68, peso=700, colore=NAVY, ancora="middle")
        T(t, "non superare l’OFA", sx + 111, sy + 279, larg=84, peso=600, colore=STATO["num"], ancora="middle")
        R(t, sx + 12, sy + 292, 198, 44, 12, "#FDEEEE", id="mock-card-costi")
        t.illustrazione("kit-rosso/illustrazioni/rischio-economico", p(sx + 18), p(sy + 296), p(38), "mock-icona-costi")
        T(t, "Rischi di perdere", sx + 66, sy + 311, larg=76, peso=500, colore=NAVY)
        T(t, "circa 30€", sx + 66, sy + 329, larg=62, peso=800, colore=STATO["num"])
        I(t, "info", sx + 192, sy + 315, 12, "#8A94A6", 1.6)
        R(t, sx + 10, sy + 347, 202, 39, 11, t.sfumatura(["#F5454F", "#E02432"]), id="mock-pulsante")
        T(t, "Inizia a studiare", sx + 96, sy + 371, larg=82, peso=600, colore="#FFFFFF", ancora="middle")
        I(t, "freccia-destra", sx + 148, sy + 367, 12, "#FFFFFF", 2.2)
        L(t, sx, sy + 420, sx + 222, sy + 420, "#EEF1F6", 1)
        for cxx, ic, et, att in ((sx + 37, "casa", "Adesso", True), (sx + 111, "libro", "Studio", False), (sx + 185, "barre-contorno", "Statistiche", False)):
            I(t, ic, cxx, sy + 439, 19, AZZ if att else "#8A94A6", 2.0)
            T(t, et, cxx, sy + 464, corpo=8.5, peso=600 if att else 500, colore=AZZ if att else "#8A94A6", ancora="middle")
        # riflesso sul vetro
        t.path(f"M{n(p(sx + 140))} {n(p(sy))}L{n(p(sx + 222))} {n(p(sy))}L{n(p(sx + 222))} {n(p(sy + 220))}z", fill="#FFFFFF", opacita=0.12)


def tutto_cio_che_ti_serve(t):
    p = t.p
    T(t, "Tutto ciò che ti serve", 14, 1359, larg=257, peso=800, colore=NAVY, spaz=-0.3)
    T(t, "per arrivare preparato.", 14, 1385, larg=284, peso=800, colore=NAVY, spaz=-0.3)
    with t.gruppo("pulsante-funzionalita"):
        R(t, 475, 1346, 219, 43, 21.5, "#E6EFFD", id="pulsante-funzionalita-fondo", stroke="#D3E2FB", sw=1)
        T(t, "Scopri tutte le funzionalità", 495, 1373, larg=156, peso=600, colore=AZZ)
        I(t, "freccia-destra", 668, 1368, 22, AZZ, 2)
    cards = [("Quiz interattivi", 99, ["Domande come", "nell’esame reale."], [96, 99], "kit-blu/illustrazioni/quiz-test"),
             ("Simulazioni ufficiali", 128, ["Timer e formato", "autentico."], [95, 60], None),
             ("Analisi del livello", 110, ["Statistiche chiare", "e dettagliate."], [101, 78], "kit-blu/illustrazioni/progressi-statistiche"),
             ("Spiegazioni semplici", 136, ["Teoria, esempi", "e consigli pratici."], [87, 101], "kit-blu/illustrazioni/suggerimenti-consigli")]
    with t.gruppo("card-funzionalita"):
        for i, (tit, wt, righe, lw, ill) in enumerate(cards):
            x = 4 + i * 176
            cx = x + 85
            with t.gruppo(f"funzionalita-{i + 1}"):
                R(t, x, 1412, 170, 161, 20, "#F5F8FE")
                if ill:
                    t.illustrazione(ill, p(cx - 36), p(1418), p(72), f"funz-illustrazione-{i + 1}")
                else:
                    # cappello di laurea + orologio
                    I(t, "cappello-laurea", cx - 6, 1452, 46, "#2E6BE6", 1.2, fill_pieno="#2E6BE6")
                    C(t, cx + 22, 1466, 13, "#FFFFFF", stroke="#EF4444", sw=3)
                    L(t, cx + 22, 1466, cx + 22, 1459, "#EF4444", 2)
                    L(t, cx + 22, 1466, cx + 27, 1469, "#EF4444", 2)
                T(t, tit, cx, 1507, larg=wt, peso=700, colore=NAVY, ancora="middle")
                for j, r_ in enumerate(righe):
                    T(t, r_, cx, 1530 + j * 19.5, larg=lw[j], peso=400, colore=GRIGIO_T, ancora="middle")


def dati_reali(t):
    p = t.p
    with t.gruppo("card-dati-reali"):
        R(t, 4, 1587, 299, 269, 22, "#EAF1FD", id="dati-reali-fondo")
        T(t, "DATI REALI", 28, 1616, larg=72, peso=700, colore=AZZ, spaz=0.6)
        # arco 82 %: centro (136,1723) r 107, da 188 a 51 gradi, terminali tondi
        cx, cy, r = 136, 1723, 107
        a0, a1 = math.radians(188), math.radians(51)
        x0, y0 = cx + r * math.cos(a0), cy - r * math.sin(a0)
        x1, y1 = cx + r * math.cos(a1), cy - r * math.sin(a1)
        g = t.sfumatura([(0, "#7FA9FB"), (0.45, "#3B82F6"), (1, "#2563EB")], p(x0), p(y0), p(x1), p(y1), userspace=True)
        t.path(f"M{n(p(x0))} {n(p(y0))}A{n(p(r))} {n(p(r))} 0 0 1 {n(p(x1))} {n(p(y1))}", stroke=g, sw=p(20), id="arco-dati-reali")
        T(t, "82%", 76, 1692, larg=91, peso=800, colore="#1D5FE0", id="dati-percentuale")
        T(t, "Molti studenti", 73, 1726, larg=138, peso=800, colore=NAVY)
        T(t, "partono a rischio.", 73, 1753, larg=175, peso=800, colore=NAVY)
        righe = [("In base alle nostre analisi, l’82%", 204), ("degli studenti che inizia senza", 191),
                 ("preparazione adeguata non", 178), ("supera l’OFA al primo tentativo.", 203)]
        for i, (r_, lw) in enumerate(righe):
            T(t, r_, 73, 1778 + i * 19, larg=lw, peso=400, colore=GRIGIO_T)


def card_futuro(t):
    p = t.p
    cl = clip_rett(t, p(316), p(1587), p(383), p(269), p(20))
    with t.gruppo("card-il-tuo-futuro", clip=cl):
        R(t, 316, 1587, 383, 269, 0, t.sfumatura(["#0C1428", "#142340"], 0, 0, 1, 0), id="card-futuro-fondo")
        f = ritaglio(ORIG, (548, 1587, 699, 1856))
        t.foto(f, p(548), p(1587), p(151), p(269), 0, id="foto-facciata-politecnico")
        R(t, 520, 1587, 90, 269, 0, sfum_op(t, [(0, "#0F1A33", 1), (1, "#0F1A33", 0)], 0, 0, 1, 0), id="dissolvenza-foto")
        R(t, 316, 1587, 230, 269, 0, "#0F1A33", opacita=0.0)
        for i, (r_, lw) in enumerate((("Il tuo futuro", 124), ("non si ferma", 132), ("a un esame.", 127))):
            T(t, r_, 344, 1638 + i * 25.5, larg=lw, peso=800, colore="#FFFFFF", spaz=-0.2)
        righe = [("Superare l’OFA ti permette", 177), ("di accedere al secondo anno,", 188), ("sostenere gli esami e costruire", 189),
                 ("senza ostacoli il tuo percorso", 186), ("al Politecnico di Milano.", 152)]
        for i, (r_, lw) in enumerate(righe):
            T(t, r_, 344, 1719 + i * 18.4, larg=lw, peso=400, colore="#E6EDFA")
        C(t, 364, 1824, 19, "#FFFFFF", opacita=0.16, id="freccia-fondo")
        I(t, "freccia-destra", 364, 1824, 22, "#FFFFFF", 2)


def banda_finale(t):
    p = t.p
    cl = clip_rett(t, p(1), p(1869), p(697), p(217), p(24))
    with t.gruppo("banda-finale", clip=cl):
        R(t, 0, 1869, 700, 217, 0, t.sfumatura([(0, "#062A78"), (0.45, "#0A3C9C"), (0.72, "#1F6FEA"), (1, "#8DB8FA")], 0, 0, 1, 0), id="banda-fondo")
        t.cerchio(p(640), p(1880), p(150), fill=t.radiale([(0, "#FFFFFF", 0.55), (1, "#FFFFFF", 0)]), id="luce-cielo")
        t.path(f"M{n(p(430))} {n(p(2086))}L{n(p(430))} {n(p(1990))}L{n(p(560))} {n(p(1972))}L{n(p(640))} {n(p(2086))}z", fill="#0A3A9A", opacita=0.9, id="blocco-edificio")
        t.path(f"M{n(p(600))} {n(p(2086))}L{n(p(585))} {n(p(2028))}L{n(p(700))} {n(p(2000))}L{n(p(700))} {n(p(2086))}z", fill="#0E49B8", opacita=0.9)
        # marchio-tile inclinato con la stella
        with t.gruppo("marchio-tile-inclinato", trasforma=f"rotate(-6 {n(p(524))} {n(p(1976))})"):
            R(t, 460, 1912, 136, 136, 30, "#4F86F0", id="tile-bordo", opacita=0.55)
            t.inserisci_svg(LOGO_TILE.read_text(), p(455), p(1908), p(138), "marchio-stella")
        # scritta a mano
        with t.gruppo("stessa-partenza", trasforma=f"rotate(-9 {n(p(650))} {n(p(1990))})"):
            for i, (r_, lw) in enumerate((("Stessa", 44), ("partenza.", 62), ("Più possibilità.", 98))):
                tr = f"skewX(-12)"
                with t.gruppo(f"sp-{i}", trasforma=f"translate({n(p(600 + i * 2))} {n(p(1990 + i * 17))}) skewX(-12)"):
                    T(t, r_, 0, 0, larg=lw, peso=500, colore="#1E3F9E")
            L(t, 598, 2046, 640, 2038, AZZ, 3.2)
        T(t, "INIZIA OGGI", 36, 1904, larg=84, peso=600, colore="#8FB6FF", spaz=1.0)
        T(t, "Sblocca il tuo domani.", 36, 1945, larg=338, peso=800, colore="#FFFFFF", spaz=-0.3)
        T(t, "Un piccolo passo ora, per un grande percorso", 36, 1974, larg=331, peso=400, colore="#D6E4FF")
        T(t, "al Politecnico di Milano.", 36, 1994, larg=167, peso=400, colore="#D6E4FF")
        # badge store
        for x, w_, nome in ((35, 151, "app-store"), (200, 148, "google-play")):
            with t.gruppo("badge-" + nome):
                R(t, x, 2015, w_, 51, 11, "#050608", stroke="#6B7280", sw=0.8)
        # apple (semplificata)
        with t.gruppo("glifo-apple"):
            t.path(f"M{n(p(64))} {n(p(2031))}c-4-1-9 2-9 8 0 6 4 11 8 11 2 0 3-1 5-1s3 1 5 1c4 0 8-5 8-8-3-1-5-4-5-7 0-3 2-5 4-6-2-3-5-4-7-4-3 0-4 2-5 2s-2-2-4-2z", fill="#FFFFFF") if False else None
            tr = f"translate({n(p(64))} {n(p(2041))}) scale({n(p(1))})"
            t.add(f'<g transform="{tr}"><path d="M5.2-9.6c0-2.600 2.200-4.300 4-4.400.2 2.600-2.300 4.600-4 4.400zM0-6c1.600 0 2.600 1 4.300 1 1.700 0 2.800-1 4.600-1 1.300 0 3.200.8 4.400 2.600-3.800 2.200-3.200 7.400.7 9-1.100 2.700-3.200 5.800-5.400 5.800-1.500 0-2-.9-3.700-.9s-2.300.9-3.700.9C-3.100 12.400-8.400 5.600-8.400-1.200c0-3.300 2.200-5.800 5.100-5.800 1.500 0 2.600 1 3.300 1z" fill="#FFFFFF" transform="translate(-4 2) scale(0.95)"/></g>')
        T(t, "Scarica su", 88, 2030, larg=50, peso=400, colore="#FFFFFF")
        T(t, "App Store", 88, 2052, larg=82, peso=500, colore="#FFFFFF")
        with t.gruppo("glifo-google-play"):
            px_, py_ = 213, 2029
            t.path(f"M{n(p(px_))} {n(p(py_))}L{n(p(px_ + 19))} {n(p(py_ + 14))}L{n(p(px_))} {n(p(py_ + 28))}z", fill="#2DB6F2")
            t.path(f"M{n(p(px_))} {n(p(py_))}L{n(p(px_ + 13))} {n(p(py_ + 14))}L{n(p(px_))} {n(p(py_ + 28))}z", fill="#34D17A")
            t.path(f"M{n(p(px_ + 13))} {n(p(py_ + 14))}L{n(p(px_ + 19))} {n(p(py_ + 14))}L{n(p(px_))} {n(p(py_ + 28))}z", fill="#EF4444")
            t.path(f"M{n(p(px_))} {n(p(py_))}L{n(p(px_ + 19))} {n(p(py_ + 14))}L{n(p(px_ + 13))} {n(p(py_ + 14))}z", fill="#FFC83D")
        T(t, "Disponibile su", 249, 2030, larg=68, peso=400, colore="#FFFFFF")
        T(t, "Google Play", 249, 2052, larg=87, peso=500, colore="#FFFFFF")


def schermata():
    t = nuova(W, H, id="landing-mobile")
    sfondo_hero(t)
    testata(t)
    hero_testi(t)
    striscia_vantaggi(t)
    come_funziona(t)
    telefono(t)
    tutto_cio_che_ti_serve(t)
    dati_reali(t)
    card_futuro(t)
    banda_finale(t)
    return t


if __name__ == "__main__":
    t = schermata()
    svg = salva_leggero(t, CART, "001-landing-mobile.svg")
    if vuole_tavola():
        controlla(svg, ORIG, "12-landing-mobile", 1.0)
