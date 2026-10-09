"""Locandine "Supera l'OFA" (immagini 4, 38, 46 di design-concept), 1024x1536 px, tre varianti.

Vettoriale: wordmark (dal kit), titoli Inter tracciati, tessere con icone, telefono col quiz, QR (vero, decodificabile),
strappi di carta, svolazzi e frecce, strisce staccabili. Raster (dichiarato): la fotografia dell'edificio del Politecnico.
Corregge dell'originale: wordmark con la "O" diversa tra le varianti (4 aveva un'icona storta) -> sempre il marchio stella 4
punte; QR finto -> QR vero che porta a linktr.ee/addiofa; testo del telefono ricostruito (stesso quiz in tutte e tre);
scritte a mano non leggibili/storte -> corsivo Inter in maiuscolo; il tratto del sottotitolo e le frecce ridisegnati;
nella 46 la mano grigia (anatomia AI) è omessa e il telefono è libero.
Uso: python3 gen_locandine.py [4|38|46]
"""
import sys
from extra import *
import numpy as np, cv2
from PIL import Image

W, H = 1024, 1536
SRC = {4: "file_000000000f0482469e5d13818e3ae27b.png", 38: "file_000000009fa48210af14ab230db94824.png",
       46: "file_00000000e63481f4b3860897e3f3c721.png"}
OUTD = {4: "04-locandina-supera-ofa", 38: "38-locandina-b", 46: "46-locandina-c"}
FOTO_TXT = "#14213F"


def foto_senza_telefono(num, quad):
    """Ritaglia l'immagine sorgente e ricostruisce (inpaint) la zona del telefono: sarà coperta dal telefono vettoriale."""
    im = cv2.imread(str(ORIG / SRC[num]))
    m = np.zeros(im.shape[:2], np.uint8)
    cv2.fillPoly(m, [np.array(quad, np.int32)], 255)
    m = cv2.dilate(m, np.ones((15, 15), np.uint8))
    out = cv2.inpaint(im, m, 7, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))


def tessera_riga(t, i, nome, x, y, l1, l2, lato=80, corpo=25, tx=None, colt=NAVY, peso_t=700):
    tx = tx or x + lato + 30
    tessera(t, nome, x, y, lato, id=f"vantaggio-{i}-icona")
    t.testo(l1, tx, y + lato / 2 - 6, corpo, peso_t, colt, id=f"vantaggio-{i}-titolo")
    t.testo(l2, tx, y + lato / 2 + corpo * 0.95, corpo, 400, colt, id=f"vantaggio-{i}-testo")


def tre_vantaggi(t, y0, x0=68, xs=(145, 388, 800), colonne=None, fondo_div=NAVY):
    pass


def striscia_staccabile(t, y0, stella):
    n_ = 9; x0, x1 = 24, 1000; w = (x1 - x0) / n_
    wordmark_def(t, 118, "wordmark-striscia")
    with t.gruppo("strisce-staccabili"):
        t.rett(x0, y0, x1 - x0, H - y0, 0, fill="#FBFBFA", id="strisce-fondo")
        t.linea(x0, y0, x1, y0, "#9AA3B5", 1.6, tratteggio="7 6", cap="butt", id="linea-di-taglio")
        for i in range(n_ + 1):
            if 0 < i < n_:
                t.linea(x0 + w * i, y0, x0 + w * i, H, "#9AA3B5", 1.4, tratteggio="6 6", cap="butt")
        for i in range(n_):
            cx = x0 + w * i + w / 2
            with t.gruppo(f"striscia-{i + 1}"):
                wordmark_uso(t, cx - 11, y0 + 128, "wordmark-striscia", -90, id=f"striscia-{i + 1}-wordmark")
                if stella:
                    stella4(t, cx, y0 + 142, 17, AZZ, id=f"striscia-{i + 1}-stella")
                else:
                    sigillo_o(t, cx, y0 + 142, 15, id=f"striscia-{i + 1}-icona")


def footer(t, y, xs, dividers, bordo_alto=None):
    voci = [("lucchetto", "Evita di bloccare", "il tuo piano di studi."),
            ("orologio", "Risparmia tempo", "e soldi (circa 30€)."),
            ("grafico-pieno", "Arriva preparato", "ai tuoi esami.")]
    with t.gruppo("piede-vantaggi"):
        if bordo_alto:
            t.linea(56, bordo_alto, 968, bordo_alto, NAVY, 1.4, opacita=0.7)
        for (ic, a, b), (xi, xt) in zip(voci, xs):
            if ic == "lucchetto":
                t.icona(ic, xi, y - 28, 56, NAVY, 2.6, fill_pieno=NAVY)
                t.cerchio(xi + 56 * 0.5, y - 28 + 56 * 0.60, 3.4, fill="#FFFFFF"); t.rett(xi + 56 * 0.5 - 1.4, y - 28 + 56 * 0.60, 2.8, 8, 1.2, fill="#FFFFFF")
            elif ic == "orologio":
                t.icona(ic, xi, y - 28, 58, NAVY, 2.4)
            else:
                t.icona(ic, xi, y - 28, 56, AZZ if False else NAVY, 1)
            t.testo(a, xt, y - 3, 20.5, 600, NAVY); t.testo(b, xt, y + 24, 20.5, 400, NAVY)
        for dx in dividers:
            t.linea(dx, y - 36, dx, y + 38, "#6B7488", 1.6)


# --------------------------------------------------------------------------- locandina 4
def loc4():
    t = TelaC(W, H, "#F6F6F4", id="locandina-supera-ofa-a")
    t.add('<rect id="carta-luce" x="0" y="0" width="1024" height="1536" fill="%s"/>' % t.radiale([(0, "#FFFFFF", 0.6), (1, "#E4E2DC", 0.35)], 0.35, 0.3, 0.9))
    # foto con strappo
    img = foto_senza_telefono(4, [(672, 548), (968, 600), (880, 1170), (555, 1105)])
    box = (500, 60, 1024, 1140)
    left = [(716, 162), (650, 296), (642, 430), (604, 480), (584, 566), (566, 650), (532, 790), (516, 936)]
    d = strappo([(716, 162), (792, 112), (905, 92), (1024, 118), (1024, 1100), (900, 1056), (780, 1018), (640, 990), (516, 936)] + left[::-1][1:-1], 3.2, 13, 4)
    foto_forma(t, img.crop(box), box[0], box[1], box[2] - box[0] + 0, box[3] - box[1], clip_d=d, id="foto-edificio-polimi")
    t.add('<g id="nastro-adesivo" transform="translate(624 416) rotate(-34)"><rect x="-44" y="-26" width="88" height="52" rx="3" fill="#2F6BF0" opacity="0.92"/><path d="M-44 -26 -28 -8 -44 26" fill="#1B4FC4" opacity="0.35"/></g>')
    # wordmark
    wordmark(t, 68, 42, 462, id="wordmark")
    t.testo("IL TUO INGLESE, SENZA OSTACOLI.", 68, 167, 19, 500, NAVY, spaziatura=6.1, id="tagline")
    corsivo(t, "PER STUDENTI", 676, 90, 35, 500, NAVY, rot=-11, id="nota-per-studenti-1")
    corsivo(t, "DEL POLIMI", 733, 133, 35, 500, NAVY, rot=-11, id="nota-per-studenti-2")
    svolazzo(t, [(752, 180), (820, 150), (885, 125), (932, 108)], AZZ, 5, id="nota-sottolineatura")
    # titolo
    for i, (s, c, y, lw) in enumerate([("Supera l’OFA", NAVY, 298, 622), ("di inglese", NAVY, 390, 440), ("e sblocca", AZZ, 478, 372), ("il tuo percorso.", AZZ, 548, 548)]):
        riga(t, s, 68 if i < 2 else 70, y, lw, 800, c, -0.025, id=f"titolo-riga-{i + 1}")
    svolazzo(t, [(255, 585), (330, 573), (420, 577), (527, 574)], AZZ, 6, id="titolo-sottolineatura")
    # vantaggi
    for i, (ic, a, b) in enumerate([("grafico-pieno", "Testa il tuo livello", "in pochi minuti"), ("documento-pieno", "Quiz e simulazioni", "realistiche"),
                                    ("cappello-pieno", "Ricevi un piano", "di studio personalizzato"), ("lampadina", "Consigli pratici", "da altri studenti")]):
        tessera_riga(t, i + 1, ic, 72, 610 + i * 96, a, b, tx=182)
    # scintille e svolazzi
    svolazzo(t, [(526, 676), (556, 696)], AZZ, 6, id="tratto-1"); svolazzo(t, [(494, 730), (538, 722)], AZZ, 6, id="tratto-2")
    tratti_scintilla(t, 928, 546, 10, [-110, -70, -30], AZZ, 5, 22, id="scintille-telefono")
    # telefono
    telefono_quiz(t, 768, 858, 10, 0.9, id="telefono")
    # nota + QR
    for i, (s, lw) in enumerate([("SMALL", 78), ("STEPS", 76), ("BIG", 44), ("OPPORTUNITIES", 168)]):
        corsivo(t, s, (410 + i * 12), 962 + i * 38, corsivo_per(s, lw), 500, AZZ, rot=-12, id=f"nota-small-steps-{i + 1}")
    freccia_curva(t, [(390, 1052), (352, 1048), (310, 1060), (290, 1086)], AZZ, 4, id="freccia-qr")
    t.rett(72, 1005, 198, 190, 18, fill="#FFFFFF", id="qr-scheda", filtro=t.ombra(3, 12, "#0F172A", 0.12))
    qr_codice(t, 88, 1020, 152, id="codice-qr")
    t.cerchio(164, 1096, 19, fill="#FFFFFF"); sigillo_o(t, 164, 1096, 15, id="qr-marchio")
    t.rett(72, 1180, 225, 38, 12, fill=AZZ2, id="link-pillola", r_angoli=(0, 0, 12, 12))
    t.testo("linktr.ee/addiofa", 184.5, 1207, 21, 600, "#FFFFFF", "middle", id="link-testo")
    footer(t, 1272, [(72, 144), (388, 478), (714, 800)], [350, 675])
    striscia_staccabile(t, 1345, stella=False)
    return t


# --------------------------------------------------------------------------- locandina 38
def quad(cx, cy, k, rot, W_=330, H_=650):
    a = math.radians(rot); c, s = math.cos(a), math.sin(a)
    pts = []
    for dx, dy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        x, y = dx * W_ * k / 2, dy * H_ * k / 2
        pts.append((cx + x * c - y * s, cy + x * s + y * c))
    return pts


def pulisci(img, regioni_scure=(), cerchi=(), rett=()):
    """Toglie dalla foto ciò che è stato sovrapposto dall'AI (testi, stella, frecce) con inpaint, per rifarlo in vettoriale."""
    a = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)
    m = np.zeros(a.shape[:2], np.uint8)
    for (x0, y0, x1, y1, soglia) in regioni_scure:
        sub = a[y0:y1, x0:x1]
        scuro = (sub.max(axis=2) < soglia).astype(np.uint8) * 255
        m[y0:y1, x0:x1] |= scuro
    m = cv2.dilate(m, np.ones((7, 7), np.uint8))
    for (cx, cy, r) in cerchi: cv2.circle(m, (cx, cy), r, 255, -1)
    for (x0, y0, x1, y1) in rett: m[y0:y1, x0:x1] = 255
    out = cv2.inpaint(a, m, 6, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))


def loc38():
    t = TelaC(W, H, "#F5F5F3", id="locandina-supera-ofa-b")
    t.add('<rect id="carta-luce" x="0" y="0" width="1024" height="1536" fill="%s"/>' % t.radiale([(0, "#FFFFFF", 0.7), (1, "#E4E2DC", 0.3)], 0.3, 0.4, 0.9))
    q = quad(725, 975, 0.98, 10)
    img = foto_senza_telefono(38, q)
    img = pulisci(img, regioni_scure=[(560, 300, 700, 430, 95), (700, 10, 960, 190, 110)], cerchi=[(845, 572, 84)])
    d = strappo([(655, 0), (1024, 0), (1024, 1360), (800, 1190), (542, 1000), (452, 900), (456, 880)] , 1.5, 30, 3)
    foto_forma(t, img.crop((440, 0, 1024, 1380)), 440, 0, 584, 1380, clip_d=d, id="foto-edificio-polimi")
    stella4(t, 845, 572, 72, t.sfumatura(["#2F7BFF", "#0A52F0"], 0, 0, 1, 1), id="stella-blu")
    wordmark(t, 60, 62, 468, id="wordmark")
    t.testo("IL TUO INGLESE, SENZA OSTACOLI.", 60, 185, 19, 500, NAVY, spaziatura=6.3, id="tagline")
    corsivo(t, "PER STUDENTI", 718, 62, corsivo_per("PER STUDENTI", 205, 400), 400, "#111827", rot=-9, id="nota-per-studenti-1")
    corsivo(t, "DEL POLIMI", 764, 110, corsivo_per("DEL POLIMI", 160, 400), 400, "#111827", rot=-9, id="nota-per-studenti-2")
    freccia_curva(t, [(818, 158), (790, 175), (762, 205), (758, 250)], "#111827", 3, id="freccia-nota", testa=14)
    for i, (s, c, y, lw) in enumerate([("Supera", NAVY, 318, 328), ("l’OFA di inglese", NAVY, 410, 633), ("e sblocca", AZZ, 495, 395),
                                       ("il tuo piano", AZZ, 585, 462), ("di studi.", AZZ, 672, 335)]):
        riga(t, s, 60, y, lw, 800, c, -0.025, id=f"titolo-riga-{i + 1}")
    svolazzo(t, [(64, 700), (150, 690), (260, 692), (448, 690)], AZZ, 6, id="titolo-sottolineatura-1")
    svolazzo(t, [(190, 711), (300, 702), (440, 700)], AZZ, 4, id="titolo-sottolineatura-2")
    for i, (ic, a, b) in enumerate([("grafico-pieno", "Testa il tuo livello", "in pochi minuti"), ("cappello-pieno", "Quiz e simulazioni", "realistiche"),
                                    ("documento-pieno", "Ricevi un piano", "di studio personalizzato"), ("lampadina", "Consigli pratici", "e risorse utili")]):
        tessera_riga(t, i + 1, ic, 60, 750 + i * 96, a, b, lato=76, tx=162)
    for i, (s, lw, x, y) in enumerate([("SCANSIONA", 130, 312, 1172), ("E PROVA ORA!", 182, 306, 1208)]):
        corsivo(t, s, x, y, corsivo_per(s, lw, 400), 400, "#111827", rot=-12, id=f"nota-scansiona-{i + 1}")
    svolazzo(t, [(326, 1236), (390, 1226), (470, 1210)], AZZ, 3.5, id="nota-sottolineatura")
    freccia_curva(t, [(300, 1318), (306, 1275), (290, 1246), (262, 1238)], "#111827", 3.2, id="freccia-qr", testa=14)
    telefono_quiz(t, 725, 975, 10, 0.98, id="telefono")
    t.rett(60, 1148, 190, 190, 18, fill="#FFFFFF", id="qr-scheda", filtro=t.ombra(3, 12, "#0F172A", 0.12))
    qr_codice(t, 76, 1163, 152, id="codice-qr")
    t.cerchio(152, 1239, 19, fill="#FFFFFF"); sigillo_o(t, 152, 1239, 15, id="qr-marchio")
    t.rett(60, 1322, 217, 40, 12, fill=AZZ2, id="link-pillola", r_angoli=(0, 0, 12, 12))
    t.testo("linktr.ee/addiofa", 168.5, 1350, 21, 600, "#FFFFFF", "middle", id="link-testo")
    footer(t, 1459, [(70, 146), (397, 484), (728, 808)], [362, 698], bordo_alto=1398)
    return t


def loc46():
    t = TelaC(W, H, "#ECE9E4", id="locandina-supera-ofa-c")
    t.add('<rect id="carta-luce" x="0" y="0" width="1024" height="1536" fill="%s"/>' % t.radiale([(0, "#F7F5F1", 0.9), (1, "#DAD6CE", 0.5)], 0.4, 0.35, 0.85))
    img = Image.open(ORIG / SRC[46]).convert("RGB")
    img = pulisci(img, regioni_scure=[(210, 930, 400, 1070, 70)] if False else [])
    box = (0, 820, 580, 1150)
    d = strappo([(0, 940), (70, 935), (120, 915), (180, 942), (260, 928), (330, 905), (420, 862), (490, 832), (505, 850), (540, 900), (548, 1000), (560, 1060),
                 (520, 1090), (430, 1126), (330, 1112), (230, 1140), (120, 1118), (0, 1150)], 3.0, 16, 6)
    foto_forma(t, img.crop(box), box[0], box[1], box[2] - box[0], box[3] - box[1], clip_d=d, id="foto-edificio-polimi")
    wordmark(t, 75, 46, 382, id="wordmark")
    t.testo("IL TUO INGLESE, SENZA OSTACOLI.", 75, 152, 17, 500, NAVY, spaziatura=5.2, id="tagline")
    corsivo(t, "PER STUDENTI", 706, 74, corsivo_per("PER STUDENTI", 192, 400), 400, AZZ, rot=-9, id="nota-per-studenti-1")
    corsivo(t, "DEL POLIMI", 745, 124, corsivo_per("DEL POLIMI", 150, 400), 400, AZZ, rot=-9, id="nota-per-studenti-2")
    svolazzo(t, [(796, 156), (850, 134), (920, 124), (960, 120)], AZZ, 4, id="nota-sottolineatura")
    svolazzo(t, [(634, 88), (655, 100), (668, 104)], AZZ, 4, id="nota-tratto-sx")
    svolazzo(t, [(926, 86), (938, 74), (948, 68)], AZZ, 4, id="nota-tratto-dx")
    for i, (s, c, y, lw) in enumerate([("Supera l’OFA", NAVY, 285, 740), ("di inglese.", NAVY, 390, 535), ("Senza stress.", AZZ, 497, 698)]):
        riga(t, s, 75, y, lw, 800, c, -0.025, id=f"titolo-riga-{i + 1}")
    svolazzo(t, [(115, 524), (200, 518), (330, 520), (455, 530)], AZZ, 5, id="titolo-sottolineatura-1")
    svolazzo(t, [(190, 536), (300, 528), (380, 526)], AZZ, 3.5, id="titolo-sottolineatura-2")
    for i, (ic, a, b_) in enumerate([("documento-pieno", "Testa il tuo livello", "in pochi minuti"), ("cappello-pieno", "Quiz e simulazioni", "realistiche"),
                                     ("grafico-pieno", "Ricevi un piano", "di studio personalizzato"), ("lampadina", "Consigli pratici", "e risorse utili")]):
        tessera_riga(t, i + 1, ic, 75, 566 + i * 85, a, b_, lato=72, corpo=23, tx=178, peso_t=500)
        # il titolo non è in grassetto in questa variante
    for i, (s, lw) in enumerate([("SMALL", 82), ("STEPS", 80), ("BIG", 42), ("OPPORTUNITIES", 172)]):
        corsivo(t, s, 812 + i * 14, 372 + i * 36, corsivo_per(s, lw, 400), 400, AZZ, rot=-17, id=f"nota-small-steps-{i + 1}")
    svolazzo(t, [(944, 498), (952, 512)], AZZ, 5, id="tratto-1"); svolazzo(t, [(962, 520), (984, 530)], AZZ, 5, id="tratto-2")
    svolazzo(t, [(626, 596), (632, 622)], AZZ, 5, id="tratto-3"); svolazzo(t, [(586, 640), (612, 654)], AZZ, 5, id="tratto-4")
    telefono_quiz(t, 790, 840, 8, 0.96, id="telefono")
    # blocco QR
    t.rett(410, 1082, 206, 200, 10, fill="#FFFFFF", id="qr-scheda", filtro=t.ombra(3, 12, "#0F172A", 0.14))
    qr_codice(t, 430, 1098, 160, id="codice-qr")
    t.cerchio(510, 1178, 20, fill="#FFFFFF"); sigillo_o(t, 510, 1178, 16, id="qr-marchio")
    t.rett(390, 1278, 240, 47, 14, fill=AZZ2, id="link-pillola")
    t.testo("linktr.ee/addiofa", 510, 1309, 24, 600, "#FFFFFF", "middle", id="link-testo")
    for i, (s, lw, x, y) in enumerate([("EVITA DI", 95, 76, 1196), ("BLOCCARE", 128, 90, 1232), ("IL TUO PIANO", 150, 106, 1270), ("DI STUDI!", 100, 136, 1305)]):
        corsivo(t, s, x, y, corsivo_per(s, lw, 400), 400, AZZ if False else "#1B3FA6", rot=-17, id=f"nota-evita-{i + 1}")
    svolazzo(t, [(120, 1330), (190, 1300), (258, 1276)], AZZ, 3.5, id="nota-evita-sottolineatura")
    freccia_curva(t, [(276, 1146), (306, 1192), (346, 1214), (390, 1222)], AZZ, 4, id="freccia-qr-sx", testa=16)
    freccia_curva(t, [(712, 1168), (672, 1150), (646, 1158), (632, 1168)], "#1B3FA6", 4, id="freccia-qr-dx", testa=15)
    for i, (s, lw, x, y) in enumerate([("PROVALA", 138, 676, 1236), ("ORA!", 84, 722, 1278)]):
        corsivo(t, s, x, y, corsivo_per(s, lw, 400), 400, "#1B3FA6", rot=-14, id=f"nota-provala-{i + 1}")
    striscia_staccabile(t, 1345, stella=True)
    return t


LOC = {4: loc4, 38: loc38, 46: loc46}

if __name__ == "__main__":
    for num in [int(a) for a in sys.argv[1:]] or [4]:
        t = LOC[num]()
        out = LAYOUT / OUTD[num] / {4: "01-locandina-a.svg", 38: "01-locandina-b.svg", 46: "01-locandina-c.svg"}[num]
        t.salva(out)
        print(out, out.stat().st_size // 1024, "KB", "scarto", round(tavola(out, SRC[num], (0, 0, W, H), f"locandina-{num}"), 2))
