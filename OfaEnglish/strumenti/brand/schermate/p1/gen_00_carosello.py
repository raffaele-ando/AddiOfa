"""Social carosello (immagine 0 di design-concept): 3 caroselli da 6 slide = 18 SVG.

Ogni slide è disegnata in 'vista' = pixel dell'originale x 2 (come i ritagli ingranditi con cui sono stati letti i testi), con un gruppo che
sposta l'angolo della slide in (0,0) e un rettangolo arrotondato come ritaglio. Vettoriale: tutti i testi (Inter tracciati), badge, pillole,
bottoni freccia, wordmark, schede, icone, stelle, telefoni (S5, S9), calendario, scritte a mano (corsivo Inter maiuscolo).
RASTER dichiarato: foto/render di sfondo (edifici, studenti, scalinata con stella, volti, mano col telefono); i testi che l'AI aveva
scritto sulle foto sono tolti con inpaint e rifatti in vettoriale.
Corregge: contatore della slide 4 della prima serie ('3/6' ripetuto -> '4/6'); 'Perche' -> 'Perché'; 'Cosi' -> 'Così'; 'Probablità' ->
'Probabilità'; frase della slide 5 'SAPERE DOVE SEI E IL PRIMO PASSO' -> 'È'; O del wordmark sempre col marchio stella 4 punte; frecce tutte
uguali e centrate.
Uso: python3 gen_00_carosello.py [numeri slide 1..18]
"""
import sys
from extra import *
from gen_locandine import pulisci
import numpy as np, cv2
from PIL import Image

SRC = "file_0000000001548246b0827f47ee43a483.png"
OUTD = LAYOUT / "00-social-carosello"
IM = Image.open(ORIG / SRC).convert("RGB")
INK_S = "#0F1F4D"; TXT_S = "#2D4271"; GR_S = "#6B7A99"; AZ = "#1F63F0"; ROSA = "#FDE4E4"
ROWS = {1: (0, 0), 2: (0, 350), 3: (0, 690)}

# (riga, ordine) -> (origine crop, rettangolo vista)
SL = {1: ((0, 0), (22, 18, 604, 685)), 2: ((0, 0), (618, 18, 1086, 685)), 3: ((540, 0), (20, 18, 642, 685)),
      4: ((540, 0), (654, 18, 1092, 685)), 5: ((1080, 0), (25, 18, 418, 685)), 6: ((1080, 0), (433, 18, 888, 685)),
      7: ((0, 350), (25, 22, 588, 665)), 8: ((0, 350), (603, 22, 1088, 665)), 9: ((535, 350), (22, 22, 505, 665)),
      10: ((535, 350), (520, 22, 1000, 665)), 11: ((1030, 350), (28, 22, 495, 665)), 12: ((1030, 350), (512, 22, 988, 665)),
      13: ((0, 690), (25, 18, 512, 630)), 14: ((0, 690), (530, 18, 1040, 630)), 15: ((515, 690), (22, 18, 522, 630)),
      16: ((515, 690), (540, 18, 1055, 630)), 17: ((1040, 690), (20, 18, 472, 630)), 18: ((1040, 690), (490, 18, 968, 630))}
NOMI = {1: "01-intro-tuo-inglese-senza-ostacoli", 2: "02-cose-addiofa", 3: "03-perche-e-importante", 4: "04-come-funziona", 5: "05-il-tuo-risultato",
        6: "06-stessi-studenti-percorsi-luminosi", 7: "07-tre-consigli", 8: "08-conosci-la-struttura", 9: "09-esercitati-con-simulazioni",
        10: "10-studia-in-modo-costante", 11: "11-strumenti-utili", 12: "12-pronto-alla-prova", 13: "13-dalla-paura-al-superamento",
        14: "14-prima", 15: "15-durante", 16: "16-risultato", 17: "17-consigli", 18: "18-il-tuo-turno"}


class S:
    def __init__(self, num):
        (self.ox, self.oy), (self.x0, self.y0, self.x1, self.y1) = SL[num]
        self.num = num
        self.w, self.h = self.x1 - self.x0, self.y1 - self.y0
        self.t = TelaC(self.w, self.h, None, id=f"slide-{num:02d}")
        t = self.t; t.reg = (self.x0 - 40, self.y0 - 40, self.w + 80, self.h + 80)
        cid = ui.clip_rett(t, 0, 0, self.w, self.h, 30)
        t.add(f'<g id="slide" clip-path="url(#{cid})"><g id="contenuto" transform="translate({n(-self.x0)} {n(-self.y0)})">')

    # coordinate vista -> pixel dell'originale
    def o(self, vx, vy):
        return vx / 2 + self.ox, vy / 2 + self.oy

    def crop(self, im=None, rect=None):
        im = im or IM
        x0, y0, x1, y1 = rect or (self.x0, self.y0, self.x1, self.y1)
        return im.crop((int(round(x0 / 2 + self.ox)), int(round(y0 / 2 + self.oy)), int(round(x1 / 2 + self.ox)), int(round(y1 / 2 + self.oy))))

    def fine(self):
        self.t.add("</g></g>")
        return self.t


def pulisci_vista(s, regioni):
    """regioni: (vx0, vy0, vx1, vy1, modo, soglia). modo 'scuro' (max<soglia), 'chiaro' (più chiaro dell'intorno di soglia), 'blu' (tinta blu satura), 'tutto'."""
    a = cv2.cvtColor(np.asarray(IM), cv2.COLOR_RGB2BGR)
    g = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY); med = cv2.medianBlur(g, 11)
    hsv = cv2.cvtColor(a, cv2.COLOR_BGR2HSV)
    m = np.zeros(g.shape, np.uint8)
    for (vx0, vy0, vx1, vy1, modo, th) in regioni:
        x0, y0 = [int(v) for v in s.o(vx0, vy0)]; x1, y1 = [int(v) for v in s.o(vx1, vy1)]
        sub = (slice(y0, y1), slice(x0, x1))
        if modo == "scuro": r = a[sub].max(axis=2) < th
        elif modo == "chiaro": r = (g[sub].astype(int) - med[sub].astype(int)) > th
        elif modo == "blu": r = (hsv[sub][..., 0] > 100) & (hsv[sub][..., 0] < 135) & (hsv[sub][..., 1] > th)
        elif modo == "pelle": r = (hsv[sub][..., 0] < 25) & (hsv[sub][..., 1] > 40) & (hsv[sub][..., 2] > 90)
        else: r = np.ones(g[sub].shape, bool)
        m[sub] |= r.astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((7, 7), np.uint8))
    return Image.fromarray(cv2.cvtColor(cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB))


def foto_slide(s, im, clip=True, **kw):
    s.t.add("")
    d = None
    foto_forma(s.t, s.crop(im), s.x0, s.y0, s.w, s.h, clip_d=d, id=kw.pop("id", "foto-sfondo"), **kw)


def sfondo_chiaro(s, c1="#E6F0FD", c2="#F3F8FE"):
    s.t.rett(s.x0, s.y0, s.w, s.h, 0, fill=s.t.sfumatura([c1, "#EEF5FD", c2], s.x0, s.y0, s.x1, s.y1, userspace=True), id="sfondo")


def contatore(s, txt, col="#76839F", y=None):
    s.t.testo(txt, s.x1 - 26, (y or s.y0 + 36), 22, 400, col, "end", id="contatore")


def trattino(s, col="#9CAAC4"):
    s.t.rett(s.x0 + 18, s.y0 + 27, 28, 2.6, 1.3, fill=col, id="trattino")


def btn(s, cx, cy, r=32):
    t = s.t
    with t.gruppo("pulsante-avanti"):
        t.cerchio(cx, cy, r, fill="#FFFFFF", filtro=t.ombra(3, 12, "#2B4A8C", 0.22))
        t.icona("freccia-destra", cx - 11, cy - 11, 22, AZ, 2.3)


def tit(s, righe, x, base, spacing, dim, col=INK_S, peso=800, spaz=-0.02, id="titolo"):
    for i, r in enumerate(righe):
        txt, w = r if isinstance(r, tuple) else (r, None)
        if w: riga(s.t, txt, x, base + i * spacing, w, peso, col, spaz, id=f"{id}-riga-{i + 1}")
        else: s.t.testo(txt, x, base + i * spacing, dim, peso, col, id=f"{id}-riga-{i + 1}", spaziatura=spaz * dim)


def corpo(s, righe, x, base, spacing, dim, col=TXT_S, peso=400, id="testo", larghezze=None):
    for i, r in enumerate(righe):
        if larghezze: riga(s.t, r, x, base + i * spacing, larghezze[i], peso, col, 0, id=f"{id}-{i + 1}")
        else: s.t.testo(r, x, base + i * spacing, dim, peso, col, id=f"{id}-{i + 1}")


def badge_num(s, num, x, y, lato=72):
    t = s.t
    t.rett(x, y, lato, lato, lato * 0.28, fill=t.sfumatura(["#3C86FA", "#1558EE"], 0, 0, 1, 1), id=f"badge-numero-{num}", filtro=t.ombra(4, 12, "#1558EE", 0.28))
    t.testo(str(num), x + lato / 2, y + lato * 0.70, lato * 0.55, 700, "#FFFFFF", "middle")


def pillola(s, txt, x, y, w, h, fill, col="#FFFFFF", corpo_=18, id="etichetta"):
    s.t.rett(x, y, w, h, 10, fill=fill, id=id)
    s.t.testo(txt, x + w / 2, y + h / 2 + corpo_ * 0.35, corpo_, 600, col, "middle", id=id + "-testo", spaziatura=0.4)


def stella_grande(s, cx, cy, r, col, op=1.0, id="stella"):
    s.t.add(f'<g opacity="{op}">'); stella4(s.t, cx, cy, r, col, id=id); s.t.add("</g>")


def scritta_mano(s, righe, x, y, dy, rot, col=AZZ, id="nota"):
    for i, (txt, w) in enumerate(righe):
        corsivo(s.t, txt, x + i * dy[0], y + i * dy[1], corsivo_per(txt, w, 400), 400, col, rot=rot, id=f"{id}-{i + 1}")


def wordmark_testa(s, x, y, w, scuro=False):
    wordmark(s.t, x, y, w, scuro=scuro, id="wordmark")


# ---------------------------------------------------------------------- slide
def s01():
    s = S(1); t = s.t
    img = pulisci_vista(s, [(40, 25, 230, 90, "scuro", 160), (45, 110, 420, 235, "scuro", 190), (45, 235, 345, 330, "scuro", 215), (520, 35, 600, 70, "scuro", 205), (170, 350, 305, 495, "blu", 120)])
    foto_slide(s, img)
    wordmark_testa(s, 57, 46, 148)
    tit(s, [("Il tuo inglese,", 300), ("senza ostacoli.", 335)], 57, 160, 48, 40, INK_S, 800)
    corpo(s, ["Verifica il tuo livello, preparati", "per l’OFA e sblocca il tuo", "piano di studi al Polimi."], 57, 252, 30, 20, "#2B4A86", larghezze=[258, 241, 225])
    stella_grande(s, 237, 422, 63, t.sfumatura(["#3E8BFF", "#0B5CF0"], 0, 0, 1, 1), id="stella-blu")
    contatore(s, "1/6", "#6B7A99"); btn(s, 553, 630)
    return s.fine()


def s02():
    s = S(2); t = s.t
    sfondo_chiaro(s); trattino(s); contatore(s, "2/6")
    t.testo("Cos’è", 655, 126, 50, 800, INK_S, id="titolo-1", spaziatura=-1)
    x = 655; w = t.testo("Addi", x, 188, 56, 800, AZZ2, id="titolo-2-addi", spaziatura=-1.2); x += w + 1
    sigillo_o(t, x + 24.5, 188 - 19.5, 24.5, id="titolo-2-o"); x += 52
    t.testo("FA?", x, 188, 56, 800, AZZ2, id="titolo-2-fa", spaziatura=-1.2)
    corpo(s, ["È l’app del Politecnico di Milano", "che ti aiuta a capire il tuo livello", "di inglese, ti prepara all’OFA", "e ti accompagna fino al", "superamento."], 655, 252, 34.3, 23, "#2B3F6B", larghezze=[375, 372, 313, 262, 150])
    for i, (ic, a1, a2_) in enumerate([("documento", "Test iniziale", None), ("grafico", "Piano di studio", "personalizzato"), ("cappello", "Simulazioni", "realistiche"), ("lampadina", "Consigli", "mirati")]):
        x0 = 645 + i * 114.5
        t.rett(x0, 437, 84, 84, 20, fill="#FFFFFF", stroke="#DDE8FA", sw=1.5, filtro=t.ombra(2, 10, "#6B8FD8", 0.18), id=f"tessera-{i + 1}")
        if ic == "lampadina": t.icona("lampadina", x0 + 22, 459, 40, "#F5B21B", 2, fill_pieno="#FBC53C")
        elif ic == "cappello": t.icona("cappello-pieno", x0 + 20, 458, 44, "#1D4FC4")
        elif ic == "grafico": t.icona("grafico-pieno", x0 + 22, 458, 40, AZ)
        else: t.icona("documento-pieno", x0 + 22, 458, 40, AZ)
        t.testo(a1, x0 + 42, 555, 13, 500, "#1D3F8F", "middle")
        if a2_: t.testo(a2_, x0 + 42, 573, 13, 500, "#1D3F8F", "middle")
    btn(s, 1040, 632)
    return s.fine()


def s03():
    s = S(3); t = s.t
    sfondo_chiaro(s, "#E4EEFC", "#F2F8FE"); trattino(s); contatore(s, "3/6")
    tit(s, [("Perché è", 200), ("importante?", 290)], 52, 126, 46, 44, INK_S)
    corpo(s, ["Se non superi l’OFA di inglese", "rischi di:"], 52, 227, 38, 24, "#4B5B7C", larghezze=[362, 114])
    scritta_mano(s, [("EVITA", 72), ("QUESTI", 96), ("RISCHI!", 105)], 474, 128, (3, 42), -12)
    cards = [(52, 193), (260, 190), (463, 179)]
    for i, (x, w) in enumerate(cards):
        t.rett(x, 293, w, 277, 28, fill=t.sfumatura(["#FDE9E9", "#FCD9D9"], 0, 0, 0, 1), id=f"scheda-rischio-{i + 1}")
    # icone rosse
    t.cerchio(97, 346, 29, fill="#E8222E", id="icona-soldi"); t.testo("$", 97, 361, 40, 700, "#FFFFFF", "middle")
    t.rett(290, 321, 52, 50, 10, fill="#E8222E", id="icona-lucchetto-corpo"); t.path("M298 322v-9a18 18 0 0 1 36 0v9", stroke="#E8222E", sw=8, id="icona-lucchetto-arco")
    t.cerchio(316, 343, 5.5, fill="#FFFFFF"); t.rett(314.2, 343, 3.6, 12, 1.5, fill="#FFFFFF")
    t.path("M510 320 Q516 311 522 320 L545 365 Q548 376 536 376 H495 Q483 376 486 365 Z", fill="#E8222E", id="icona-avviso")
    t.rett(513.6, 335, 5.6, 20, 2.8, fill="#FFFFFF"); t.cerchio(516.4, 363, 3.4, fill="#FFFFFF")
    t.testo("Perdere in media", 69, 415, 18, 700, INK_S); riga(t, "30€", 69, 453, 56, 800, "#E8222E", 0, id="cifra-30")
    t.testo("per servizi aggiuntivi", 69, 481, 14, 400, "#58668A")
    t.testo("Avere il piano", 278, 415, 18, 700, INK_S); t.testo("di studi bloccato", 278, 441, 18, 700, INK_S)
    corpo(s, ["e non poter sostenere", "alcuni esami del", "secondo anno"], 278, 482, 22, 14, "#58668A")
    t.testo("Perdere un anno", 481, 415, 18, 700, INK_S)
    corpo(s, ["e rallentare", "il tuo percorso", "al Polimi."], 481, 455, 22, 14, "#58668A")
    btn(s, 598, 634)
    return s.fine()


def s04():
    s = S(4); t = s.t
    sfondo_chiaro(s, "#EFF5FD", "#E7F0FC"); trattino(s); contatore(s, "4/6")
    riga(t, "Come funziona?", 690, 128, 355, 800, INK_S, -0.02, id="titolo")
    voci = [("Testa il tuo livello", "10 domande, 3 minuti.", 207), ("Ricevi il risultato", "con la probabilità di superare l’OFA.", 297),
            ("Ottieni un piano di studio", "personalizzato.", 387), ("Esercitati con quiz e simulazioni", "basate su prove reali.", 478),
            ("Tieni traccia dei tuoi progressi", "e arriva preparato.", 570)]
    for i, (a1, a2_, cy) in enumerate(voci):
        t.cerchio(725, cy, 27, fill=t.sfumatura(["#3C86FA", "#1558EE"], 0, 0, 1, 1), filtro=t.ombra(3, 10, "#1558EE", 0.3), id=f"passo-{i + 1}")
        t.testo(str(i + 1), 725, cy + 8, 23, 700, "#FFFFFF", "middle")
        bold2 = i == 2
        t.testo(a1, 775, cy - 4, 18, 700, INK_S, id=f"passo-{i + 1}-titolo"); t.testo(a2_, 775, cy + 23, 17, 700 if bold2 else 400, INK_S if bold2 else "#4A5A80", id=f"passo-{i + 1}-testo")
    btn(s, 1048, 634)
    return s.fine()


def nuvole(s, t, lista):
    for (cx, cy, rx, ry, op) in lista:
        t.ellisse(cx, cy, rx, ry, fill="#FFFFFF", opacita=op, filtro=t.sfoca(10))


def s05():
    s = S(5); t = s.t
    t.rett(s.x0, s.y0, s.w, s.h, 0, fill=t.sfumatura(["#4F93F3", "#8DBBF6", "#B9D6F8"], 0, s.y0, 0, s.y1, userspace=True), id="sfondo-cielo")
    nuvole(s, t, [(380, 300, 70, 26, 0.55), (250, 130, 120, 30, 0.25), (90, 560, 60, 20, 0.35)])
    bd = pulisci_vista(s, [])
    foto_forma(t, S.crop(s, IM, (270, 470, 418, 685)), 270, 470, 148, 215, fade=(0, 470, 0, 540, [(0, 0), (1, 1)]), id="foto-edificio")
    with t.gruppo("titolo-risultato", trasforma="rotate(-6 150 100)"):
        riga(t, "Il tuo risultato", 54, 88, 215, 700, "#FFFFFF", -0.01, id="titolo-riga-1"); riga(t, "in pochi minuti.", 54, 132, 222, 700, "#FFFFFF", -0.01, id="titolo-riga-2")
    contatore(s, "5/6", "#FFFFFF")
    telefono_risultato(s, 175, 440, -6)
    scritta_mano(s, [("SAPERE", 76), ("DOVE SEI", 98), ("È IL PRIMO", 100), ("PASSO.", 74)], 330, 362, (-1, 33), -12, "#1F4FD8")
    btn(s, 350, 632)
    return s.fine()


def telefono_risultato(s, cx, cy, rot):
    t = s.t
    with t.gruppo("telefono-quiz-completato", trasforma=f"translate({cx} {cy}) rotate({rot})"):
        t.rett(-148, -250, 300, 560, 44, fill="#000", opacita=0.3, filtro=t.sfoca(14))
        t.rett(-150, -275, 296, 600, 44, fill=t.sfumatura(["#7E88A4", "#1C2540", "#59627F"], 0, 0, 1, 1), id="telefono-telaio")
        t.rett(-145, -270, 286, 590, 40, fill="#10172C"); t.rett(-139, -264, 274, 578, 35, fill="#F3F7FD", id="telefono-schermo")
        t.rett(-37, -258, 72, 20, 10, fill="#10172C")
        wordmark(t, -34, -226, 68, id="telefono-wordmark")
        t.rett(-120, -190, 236, 440, 28, fill="#FFFFFF", id="telefono-scheda")
        riga(t, "Quiz completato!", 0, -150, 142, 700, INK_S, 0, ancora="middle", id="telefono-titolo")
        t.misuratore(0, -52, 75, 0.82, spessore=17, colore="#EF4444", chiaro="#FF8A8A", vuoto="#F3DADA", tacche=False, id="telefono-misuratore")
        riga(t, "82%", 0, -45, 74, 800, "#E5322D", 0, ancora="middle", id="telefono-percentuale")
        t.testo("Probabilità di non", 0, -10, 12, 600, INK_S, "middle"); t.testo("superare l’OFA", 0, 6, 12, 600, INK_S, "middle")
        for i, (ic, a) in enumerate([("play", "Simulazioni illimitate"), ("lampadina", "Spiegazioni dettagliate"), ("bersaglio", "Consigli personalizzati")]):
            y = 32 + i * 52
            t.rett(-104, y, 208, 42, 12, fill="#F7F9FE", stroke="#E3EAF7", sw=1)
            t.cerchio(-80, y + 21, 13, fill="#E4EDFD"); t.icona(ic, -88, y + 13, 16, AZ, 1.8)
            t.testo(a, -57, y + 26, 12, 400, "#27355F")
        t.rett(-120, 215, 236, 44, 14, fill=AZ2 if False else "#2B6BF3", id="telefono-pulsante")
        t.testo("Inizia a prepararti", 0, 243, 14, 600, "#FFFFFF", "middle")


def s06():
    s = S(6); t = s.t
    img = pulisci_vista(s, [(455, 70, 730, 270, "chiaro", 22), (445, 595, 625, 665, "tutto", 0), (835, 35, 885, 68, "chiaro", 20), (432, 35, 480, 62, "chiaro", 20)])
    foto_slide(s, img)
    trattino(s, "#FFFFFF"); contatore(s, "6/6", "#FFFFFF")
    for i, (txt, y, w) in enumerate([("Stessi", 112, 117), ("studenti.", 163, 176), ("Percorsi", 205, 158), ("più luminosi.", 248, 228)]):
        riga(t, txt, 467, y, w, 700, "#FFFFFF", -0.01, id=f"titolo-riga-{i + 1}")
    wordmark_testa(s, 457, 614, 142, scuro=True)
    t.rett(630, 604, 172, 60, 30, fill="#1D5CF0", id="pulsante-inizia-ora", filtro=t.ombra(3, 10, "#0B2E88", 0.3))
    t.testo("Inizia ora", 672, 641, 19, 600, "#FFFFFF"); t.icona("freccia-destra", 762, 626, 18, "#FFFFFF", 2.2)
    btn(s, 840, 634)
    return s.fine()


def s07():
    s = S(7); t = s.t
    img = pulisci_vista(s, [(60, 40, 220, 95, "scuro", 160), (60, 110, 540, 330, "scuro", 190), (60, 330, 420, 390, "scuro", 205), (520, 35, 585, 70, "scuro", 205), (180, 480, 290, 590, "blu", 120), (460, 80, 590, 240, "blu", 40)])
    foto_slide(s, img)
    wordmark_testa(s, 68, 52, 142)
    stella_grande(s, 527, 160, 78, "#8DB4F3", 0.65, id="stella-trasparente")
    riga(t, "3", 66, 266, 104, 800, INK_S, 0, id="numero-3")
    for i, (txt, y, w) in enumerate([("consigli", 162, 150), ("per superare", 214, 267), ("l’OFA di inglese", 264, 308)]):
        riga(t, txt, 202, y, w, 800, INK_S, -0.02, id=f"titolo-riga-{i + 1}")
    corpo(s, ["Strategie pratiche, basate", "su prove reali e sull’esperienza", "di altri studenti del Polimi."], 70, 308, 31, 21, "#2F4C85", larghezze=[222, 305, 296])
    stella_grande(s, 232, 530, 40, t.sfumatura(["#3E8BFF", "#0B5CF0"], 0, 0, 1, 1), id="stella-blu")
    contatore(s, "1/6", "#6B7A99"); btn(s, 533, 605)
    return s.fine()


def s08():
    s = S(8); t = s.t
    sfondo_chiaro(s); trattino(s); contatore(s, "2/6")
    badge_num(s, 1, 635, 77)
    tit(s, [("Conosci la struttura", 250), ("del test", 100)], 728, 114, 34, 25, INK_S, 700)
    corpo(s, ["L’OFA valuta reading, grammar,", "listening e use of English.", "Sapere cosa aspettarsi ti", "aiuta a prepararti nel modo", "giusto."], 640, 194, 30, 22, TXT_S, larghezze=[327, 262, 260, 296, 72])
    stella_grande(s, 990, 343, 88, "#9CC0F6", 0.55, id="stella-trasparente")
    with t.gruppo("scheda-struttura", trasforma="rotate(-5 830 495)"):
        t.rett(648, 345, 362, 295, 30, fill="#FFFFFF", id="scheda-fondo", filtro=t.ombra(8, 24, "#5B7FD0", 0.28))
        for i, (ic, lab) in enumerate([("libro", "Reading"), ("documento-pieno", "Grammar"), ("cuffie", "Listening"), ("ingranaggio", "Use of English")]):
            y = 380 + i * 62
            if ic == "cuffie":
                t.path("M690 %s a18 18 0 0 1 36 0" % (y + 34), stroke=AZ, sw=5, id="icona-cuffie"); t.rett(686, y + 30, 9, 20, 4, fill=AZ); t.rett(721, y + 30, 9, 20, 4, fill=AZ)
            elif ic == "ingranaggio": t.icona("ingranaggio", 690, y + 12, 38, AZ, 2.6, fill_pieno=AZ)
            elif ic == "libro": t.icona("libro", 688, y + 12, 40, AZ, 2.4)
            else: t.icona(ic, 692, y + 12, 36, AZ)
            t.testo(lab, 765, y + 28, 22, 500, "#1C2F66", id=f"voce-{i + 1}")
            if i < 3: t.linea(765, y + 46, 940, y + 46, "#DCE6F6", 1.4)
    btn(s, 1032, 603)
    return s.fine()


def s09():
    s = S(9); t = s.t
    sfondo_chiaro(s); trattino(s); contatore(s, "3/6")
    t.ellisse(120, 520, 120, 110, fill="#DCE8FB", opacita=0.7, filtro=t.sfoca(14), id="alone")
    badge_num(s, 2, 62, 72)
    tit(s, [("Esercitati con", 205), ("simulazioni reali", 212)], 172, 113, 37, 25, INK_S, 700)
    corpo(s, ["Fai quiz a tempo e simulazioni", "con domande simili a quelle", "dell’esame. Così migliori", "gestione del tempo e sicurezza."], 68, 197, 32, 22, "#2F4577", larghezze=[343, 317, 280, 380])
    with t.gruppo("telefono-quiz", trasforma="translate(222 560) rotate(-14) scale(0.86)"):
        t.rett(-170, -250, 340, 600, 48, fill="#000", opacita=0.25, filtro=t.sfoca(12))
        t.rett(-172, -260, 340, 700, 48, fill=t.sfumatura(["#7A849F", "#1A2340", "#5A6482"], 0, 0, 1, 1), id="telefono-telaio")
        t.rett(-166, -254, 328, 690, 44, fill="#0F1630"); t.rett(-160, -248, 316, 680, 39, fill="#F7F9FD", id="telefono-schermo")
        t.rett(-40, -240, 80, 22, 11, fill="#0F1630")
        t.testo("Choose the correct form:", -138, -170, 17, 400, INK_S)
        t.testo("She ______ to Milan", -138, -140, 20, 400, INK_S); t.testo("every day.", -138, -112, 20, 700, INK_S)
        for i, (r, err) in enumerate([("go", 0), ("goes", 1), ("going", 0), ("to go", 0)]):
            y = -88 + i * 64
            t.rett(-142, y, 288, 52, 18, fill="#FEE2E2" if err else "#F5F8FD", stroke="#F3A5A5" if err else "#E3E9F4", sw=1.5, id=f"risposta-{i + 1}")
            if err: t.cerchio(-110, y + 26, 13, fill="#EF4444"); t.icona("x", -116, y + 20, 12, "#FFFFFF", 3)
            else: t.cerchio(-110, y + 26, 12, fill="#FFFFFF", stroke="#C7D0E0", sw=2)
            t.testo(r, -82, y + 33, 19, 500, "#334155")
    for pts, col in [([(100, 355), (116, 372)], "#EF3B3B"), ([(84, 396), (96, 399)], "#EF3B3B"), ([(424, 330), (428, 345)], AZ), ([(446, 356), (466, 346)], AZ), ([(458, 396), (474, 398)], AZ)]:
        svolazzo(t, pts, col, 6, id="scintilla")
    btn(s, 452, 605)
    return s.fine()


def calendario(s, x, y):
    t = s.t
    with t.gruppo("calendario"):
        t.rett(x, y + 10, 300, 240, 26, fill="#000", opacita=0.12, filtro=t.sfoca(10))
        t.rett(x, y, 290, 235, 26, fill="#FFFFFF", id="calendario-corpo", filtro=t.ombra(6, 14, "#3B6BD8", 0.2))
        t.rett(x, y, 290, 74, 0, fill=t.sfumatura(["#3F8AFB", "#1F5BF0"], 0, 0, 0, 1), id="calendario-testata", r_angoli=(26, 26, 0, 0))
        for cx_ in (x + 55, x + 215): t.rett(cx_ - 8, y - 22, 16, 50, 8, fill="#2F6DF5", id="calendario-anello")
        for r in range(2):
            for c in range(3):
                xx, yy = x + 28 + c * 78, y + 98 + r * 66
                ok = (c == 2)
                t.rett(xx, yy, 56, 50, 12, fill="#2D6BF3" if ok else "#E3ECFB", id=f"giorno-{r}{c}")
                if ok: t.icona("spunta", xx + 14, yy + 12, 28, "#FFFFFF", 3.4)
        with t.gruppo("cappello-laurea", trasforma=f"translate({x - 40} {y + 168})"):
            t.path("M40 70V112Q95 140 150 112V70L95 90z", fill="#1546BC", id="cappello-corpo")
            t.path("M0 52 95 14 190 52 95 92z", fill=t.sfumatura(["#4A93FC", "#1F5BF0"], 0, 0, 1, 1), id="cappello-piano")
            t.path("M95 52 188 54 L196 118", stroke="#1D5BE8", sw=4, id="cappello-nappa-filo")
            t.rett(190, 112, 14, 30, 5, fill="#2D6BF3", id="cappello-nappa")


def s10():
    s = S(10); t = s.t
    sfondo_chiaro(s); trattino(s); contatore(s, "4/6")
    t.ellisse(700, 470, 140, 120, fill="#DCE8FB", opacita=0.6, filtro=t.sfoca(14))
    badge_num(s, 3, 552, 72)
    tit(s, [("Studia in modo", 197), ("costante (ma leggero)", 288)], 662, 113, 37, 25, INK_S, 700)
    corpo(s, ["Meglio 20–30 minuti al giorno", "che maratone infinite. La costanza", "fa la differenza, soprattutto", "nella grammatica e nel vocabolario."], 558, 197, 31, 22, "#2F4577", larghezze=[331, 402, 335, 407])
    calendario(s, 552, 384)
    scritta_mano(s, [("PICCOLI", 90), ("PASSI,", 80), ("GRANDI", 88), ("RISULTATI.", 126)], 880, 392, (2, 30), -12)
    btn(s, 948, 605)
    return s.fine()


def s11():
    s = S(11); t = s.t
    sfondo_chiaro(s, "#DCEAFC", "#EDF5FE"); contatore(s, "5/6")
    t.rett(65, 75, 245, 112, 30, fill="#FFFFFF", opacita=0.55, id="intestazione-fondo")
    tit(s, [("Strumenti utili", 148), ("dentro AddiOFA", 190)], 88, 123, 37, 23, INK_S, 700)
    t.ellisse(375, 140, 50, 12, fill="#C8DAF7", opacita=0.7)
    for i, hh in enumerate((32, 58, 80)): t.rett(346 + i * 22, 144 - hh, 16, hh, 4, fill=t.sfumatura(["#3F8AFB", "#1F5BF0"], 0, 0, 0, 1), id=f"grafico-barra-{i + 1}")
    for i, (ic, lab) in enumerate([("documento", "Quiz tematici"), ("lampadina", "Spiegazioni chiare"), ("orologio", "Simulazioni complete"), ("spunta", "Statistiche dei progressi")]):
        y = [205, 307, 408, 510][i]
        t.rett(75, y, 372, 85, 24, fill="#FFFFFF", stroke="#E3ECFA", sw=1.4, filtro=t.ombra(2, 12, "#6B8FD8", 0.16), id=f"voce-{i + 1}")
        t.cerchio(120, y + 42, 24, fill=t.sfumatura(["#3F8AFB", "#1F5BF0"], 0, 0, 1, 1)); t.icona(ic, 108, y + 30, 24, "#FFFFFF", 2.4)
        t.testo(lab, 168, y + 49, 20, 500, "#17306F", id=f"voce-{i + 1}-testo")
    btn(s, 442, 605)
    return s.fine()


def s12():
    s = S(12); t = s.t
    img = pulisci_vista(s, [(530, 80, 790, 345, "scuro", 205), (850, 410, 975, 560, "blu", 40)])
    foto_slide(s, img)
    trattino(s); contatore(s, "6/6", "#6B7A99")
    tit(s, [("Pronto", 140), ("a metterti", 210), ("alla prova?", 215)], 543, 115, 51, 46, INK_S, 800)
    corpo(s, ["Scopri il tuo livello, ricevi", "un piano di studio personalizzato", "e supera l’OFA di inglese."], 543, 262, 30, 20, "#34456E", larghezze=[250, 336, 252])
    scritta_mano(s, [("SAME", 56), ("STUDENTS.", 110), ("BRIGHTER", 106), ("PATHS.", 70)], 850, 440, (0, 34), -12, "#2347C0")
    btn(s, 937, 605)
    return s.fine()


def s13():
    s = S(13); t = s.t
    img = pulisci_vista(s, [(50, 35, 220, 90, "scuro", 160), (45, 100, 340, 290, "scuro", 200), (340, 100, 440, 235, "scuro", 150), (440, 40, 500, 70, "scuro", 205), (310, 390, 495, 545, "blu", 35)])
    foto_slide(s, img)
    wordmark_testa(s, 60, 46, 148)
    tit(s, [("Dalla paura", 255), ("al superamento.", 360)], 60, 150, 54, 42, INK_S, 800)
    corpo(s, ["Il percorso di uno studente", "come te."], 60, 245, 29, 21, "#3A4C78", larghezze=[276, 80])
    contatore(s, "1/6", "#6B7A99"); btn(s, 460, 578)
    scritta_mano(s, [("STESSI", 90), ("STUDENTI.", 120), ("PERCORSI", 120), ("PIÙ LUMINOSI.", 175)], 325, 428, (-3, 33), -12, "#2347C0")
    return s.fine()


def s14():
    s = S(14); t = s.t
    sfondo_chiaro(s); contatore(s, "2/6")
    pillola(s, "PRIMA", 562, 62, 98, 38, "#34456E", corpo_=17)
    tit(s, [("“Avevo paura", 190), ("di non superare", 220), ("l’OFA.”", 90)], 570, 156, 38, 30, "#1B2E7A", 700)
    corpo(s, ["Non sapevo bene", "il mio livello, il test mi", "sembrava difficile e non", "volevo rischiare di perdere", "tempo (e soldi)."], 570, 277, 28, 18, "#3A4C78", larghezze=[160, 218, 231, 233, 124])
    d = "M530 445H805V240Q805 95 905 95H1040V630H530Z"
    foto_forma(t, S.crop(s, IM, (530, 95, 1040, 630)), 530, 95, 510, 535, clip_d=d, id="foto-studente-libri")
    btn(s, 980, 578)
    return s.fine()


def s15():
    s = S(15); t = s.t
    img = pulisci_vista(s, [(40, 120, 330, 245, "scuro", 205), (200, 125, 345, 175, "blu", 60), (40, 250, 290, 395, "scuro", 205), (440, 40, 500, 70, "scuro", 205)])
    foto_slide(s, img)
    contatore(s, "3/6", "#6B7A99")
    pillola(s, "DURANTE", 55, 62, 125, 38, AZ, corpo_=17)
    x = 55; t.testo("“Ho usato ", x, 155, 30, 700, "#1B2E7A", id="citazione-1a"); wx = larghezza_testo("“Ho usato ", 30, 700)
    t.testo("AddiOFA", x + wx, 155, 30, 700, AZ, id="citazione-1b")
    t.testo("per capire da dove", 55, 195, 30, 700, "#1B2E7A", id="citazione-2"); t.testo("partire.”", 55, 235, 30, 700, "#1B2E7A", id="citazione-3")
    corpo(s, ["Ho fatto il test iniziale,", "ho visto i miei punti deboli", "e ho seguito il piano", "di studio personalizzato", "con quiz e simulazioni."], 55, 274, 27, 19, "#3A4C78", larghezze=[207, 238, 160, 208, 215])
    btn(s, 472, 578)
    return s.fine()


def s16():
    s = S(16); t = s.t
    img = pulisci_vista(s, [(555, 110, 820, 335, "scuro", 205), (555, 335, 745, 365, "scuro", 205), (745, 335, 830, 362, "scuro", 200), (560, 450, 665, 560, "blu", 40), (990, 35, 1050, 70, "scuro", 205)])
    foto_slide(s, img)
    contatore(s, "4/6", "#6B7A99")
    pillola(s, "RISULTATO", 570, 62, 132, 38, AZ, corpo_=16)
    tit(s, [("“Ho superato", 190), ("l’OFA al primo", 200), ("tentativo!”", 148)], 568, 155, 38, 30, "#1B2E7A", 700)
    corpo(s, ["Con esercizio costante", "e le simulazioni reali mi sono", "sentito molto più sicuro.", "Il test era come me l’aspettavo!"], 573, 270, 26, 19, "#3A4C78", larghezze=[198, 255, 220, 252])
    scritta_mano(s, [("CE", 36), ("L’HO", 54), ("FATTA!", 78)], 566, 478, (0, 30), -12, "#2347C0")
    btn(s, 997, 578)
    return s.fine()


def s17():
    s = S(17); t = s.t
    sfondo_chiaro(s, "#F0F5FD", "#EAF2FD"); contatore(s, "5/6")
    pillola(s, "CONSIGLI", 52, 58, 126, 38, AZ, corpo_=17)
    tit(s, [("Cosa mi ha aiutato", 350), ("di più?", 120)], 68, 155, 45, 38, "#14267A", 800)
    voci = [("documento-pieno", ["Fare il test iniziale"], 263), ("documento-pieno", ["Allenarmi con quiz reali"], 322), ("documento-pieno", ["Studiare un po’ ogni giorno"], 380),
            ("ingranaggio", ["Seguire le spiegazioni", "dell’app"], 437), ("grafico-linea", ["Tenere traccia dei progressi"], 511)]
    for i, (ic, ls, y) in enumerate(voci):
        t.rett(85, y - 28, 43, 43, 10, fill=t.sfumatura(["#3F8AFB", "#1F5BF0"], 0, 0, 1, 1), id=f"voce-{i + 1}-icona")
        if ic == "ingranaggio": t.icona("ingranaggio", 92, y - 21, 29, "#FFFFFF", 2.2)
        elif ic == "grafico-linea": t.path(f"M92 {y + 2} 103 {y - 8} 110 {y - 3} 121 {y - 16}", stroke="#FFFFFF", sw=3, id="voce-5-linea")
        else: t.icona("documento", 92, y - 21, 29, "#FFFFFF", 2.2)
        for j, l in enumerate(ls): t.testo(l, 165, y + j * 28, 21, 400, "#3E4F7A", id=f"voce-{i + 1}-testo-{j + 1}")
    btn(s, 425, 578)
    return s.fine()


def s18():
    s = S(18); t = s.t
    img = pulisci_vista(s, [(510, 40, 660, 90, "scuro", 160), (505, 110, 885, 270, "scuro", 205), (880, 40, 950, 70, "chiaro", 20), (510, 285, 810, 350, "blu", 120), (510, 380, 720, 530, "blu", 40)])
    foto_slide(s, img)
    wordmark_testa(s, 519, 46, 126)
    contatore(s, "6/6", "#FFFFFF")
    riga(t, "Il tuo turno.", 520, 150, 228, 800, "#0A1640", -0.02, id="titolo")
    corpo(s, ["Scopri il tuo livello, preparati", "con un piano su misura", "e supera anche tu l’OFA di inglese."], 520, 192, 29, 20, "#2B4A86", larghezze=[270, 193, 352])
    t.rett(516, 282, 291, 66, 33, fill="#0B5FF5", id="pulsante-inizia-ora", filtro=t.ombra(3, 10, "#0B2E88", 0.25))
    t.testo("Inizia ora", 662, 322, 21, 600, "#FFFFFF", "middle"); t.icona("freccia-destra", 755, 305, 22, "#FFFFFF", 2.3)
    scritta_mano(s, [("SMALL", 74), ("STEPS", 72), ("BIG", 40), ("OPPORTUNITIES.", 180)], 516, 412, (10, 36), -12, "#2347C0")
    btn(s, 920, 580)
    return s.fine()


GEN = {i: globals()[f"s{i:02d}"] for i in range(1, 19)}

if __name__ == "__main__":
    for num in [int(a) for a in sys.argv[1:]] or list(GEN):
        t = GEN[num]()
        out = OUTD / (NOMI[num] + ".svg"); t.salva(out)
        (ox, oy), (x0, y0, x1, y1) = SL[num]
        box = (int(round(x0 / 2 + ox)), int(round(y0 / 2 + oy)), int(round(x1 / 2 + ox)), int(round(y1 / 2 + oy)))
        print(num, out.name, out.stat().st_size // 1024, "KB", "scarto", round(tavola(out, SRC, box, f"carosello-{num:02d}"), 2))
