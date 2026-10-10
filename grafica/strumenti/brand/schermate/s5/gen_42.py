"""Immagine 42 (schermate-risultato-animazioni): ogni elemento ha DUE riquadri: la schermata (sopra) e il dettaglio ingrandito
del misuratore con scie, coriandoli, tessere e raggi (sotto). Si ridisegnano entrambi in un solo SVG (stesse misure del ritaglio,
268x939 px circa). Le decorazioni sono forme vettoriali con sfumature e sfocature (decor.py), non raster.
Errori dell'originale corretti: barra "10/10" ora sempre piena (nell'AI è vuota/a metà), pomello blu rimasto al piede dell'arco in 42.2
(qui solo il pomello di fine arco), percentuale e arco coerenti. Testi piccoli leggibili: copiati."""
import pathlib, sys
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from decor import *             # noqa: F401,F403
from ui import RADICE, clip_rett   # noqa: E402
from gen_43 import BLU, stops_v   # noqa: E402

USCITA = RADICE / "brand/concept-svg/schermate/calcolo-risultato"
NOME = "42-schermate-risultato-animazioni"
ROSSO_PCT = "#E01B1F"
CAP = "#4B5F91"
BARRE = {1: (46, 240), 2: (47, 240), 3: (41, 233), 4: (45, 237), 5: (45, 239), 6: (46, 239)}


def gauge(v, stops, **k):
    return dict(v=v, stops=stops_v(stops, v), cy_r=(300, 380, 4), rx_r=(70, 100, 3), ry_r=(70, 125, 6), **{"pr": 0.42, "glow": 0.35, **k})


def base(k, W, id, tit, sot, **kw):
    bx0, bx1 = BARRE[k]; cx = (bx0 + bx1) / 2
    sp = dict(id=id, nn=42, k=k, titolo=tit, sotto=sot, schede=[(9, 3, W - 6, 559, 22), (9, 570, W - 6, 969, 22)],
              hdr=dict(bar=(bx0, bx1, 64, 4.4), passo=(cx - 13, cx + 13, 43.8, 51.6)), soglia_titolo=135, soglia_sotto=185)
    sp.update(kw)
    return sp


DID = ["Probabilità di", "non superarlo"]


# ---------------------------------------------------------------------------- dettagli (riquadro inferiore)
def dettaglio(t, W, corpo):
    P = t.p
    cid = clip_rett(t, P(9), P(570), P(W - 15), P(400), P(22))
    with t.gruppo("dettaglio-misuratore", clip=cid):
        corpo(t)


def d1(t, W):
    def c(t):
        fascia(t, [(56, 775), (85, 705), (170, 655), (285, 652)], 52, ["#B2CDFA", "#CFE0FB", "#E6EEFB"], 56, 775, 285, 652, op=1.0, sfoca=0.6, id="fascia-arco")
        fascia(t, [(56, 775), (85, 705), (170, 655), (285, 652)], 14, ["#FFFFFF", "#FFFFFF"], 56, 775, 285, 652, op=0.25, sfoca=3, id="fascia-luce")
        scia_curva(t, [(70, 745), (92, 712), (118, 692)], 1.6, "#FFFFFF", 0.7, 0.4, id="riflesso-1")
        scia_curva(t, [(86, 752), (106, 726), (128, 706)], 1.2, "#FFFFFF", 0.55, 0.4, id="riflesso-2")
        pomello(t, 58, 770, 25, 33.5, "#1F6BFF", "#5B8DFB", 0.6)
    dettaglio(t, W, c)


def d2(t, W):
    def c(t):
        fascia(t, [(30, 935), (50, 800), (150, 690), (290, 640)], 62, ["#D9E2F3", "#E4EAF6"], 30, 935, 290, 640, op=0.85, sfoca=1.0, id="fascia-arco")
        fascia(t, [(10, 880), (70, 790), (115, 745), (170, 700)], 64, ["#FFFFFF", "#FBD58C", "#F9C262"], 10, 880, 170, 700, op=0.55, sfoca=8, id="alone-caldo")
        for i, (dx, dy, w, op) in enumerate(((-26, -8, 2.2, 0.55), (-14, -16, 1.6, 0.45), (-36, 2, 1.8, 0.4), (-8, -26, 1.4, 0.4))):
            scia_curva(t, [(28 + dx, 800 + dy), (60 + dx, 735 + dy), (150 + dx * 0.3, 690 + dy)], w, "#F9C262", op, 1.2, id=f"scia-{i + 1}")
        scia_curva(t, [(60, 770), (90, 735), (118, 712)], 1.8, "#FFFFFF", 0.6, 0.8, id="riflesso")
        for x, y, rx, ry, a in ((56, 696, 11, 3.8, -58), (47, 745, 5, 3, -60), (55, 765, 5, 3, -60), (32, 772, 5, 2.8, -62), (151, 662, 10, 4.5, -42), (176, 640, 6, 4, -35), (199, 619, 9, 4.5, -35)):
            puntino(t, x, y, rx, ry, a, "#F9B535", 0.95, id="coriandolo", luce=False)
        pomello(t, 120, 752.5, 21.5, 29.6, "#FBB02E", "#FBC85A", 0.6)
    dettaglio(t, W, c)


def d3(t, W):
    def c(t):
        P = t.p
        fascia(t, [(165, 692), (205, 678), (240, 658), (290, 648)], 60, ["#E1E7F2", "#E6EBF4"], 165, 692, 290, 648, op=0.9, sfoca=0.6, id="fascia-vuota")
        fascia(t, [(24, 945), (45, 820), (105, 728), (165, 692)], 66, ["#FFD06A", "#FCB23E", "#F89A1F"], 24, 945, 165, 692, op=1.0, sfoca=0.5, id="fascia-arco")
        fascia(t, [(24, 945), (45, 820), (105, 728), (165, 692)], 74, ["#FFE3A6", "#FFC25C"], 24, 945, 165, 692, op=0.35, sfoca=7, id="alone-fascia")
        # dissolvenza in basso
        t.rett(P(0), P(850), P(W), P(110), 0, fill=sfumatura_op(t, [(0, "#F9FBFE", 0), (1, "#F9FBFE", 1)], 0, 850, 0, 940))
        for i, (a, b, c_, w, op) in enumerate((((20, 740), (80, 695), (170, 650), 5, 0.35), ((30, 760), (90, 705), (170, 662), 3, 0.3), ((55, 690), (110, 662), (150, 640), 2, 0.28))):
            scia_curva(t, [a, b, c_], w, "#F9C262", op, 1.5, id=f"scia-{i + 1}")
        scia_curva(t, [(66, 800), (95, 752), (118, 728)], 2.2, "#FFFFFF", 0.65, 0.8, id="riflesso-1")
        scia_curva(t, [(48, 845), (70, 800), (90, 770)], 1.6, "#FFFFFF", 0.45, 0.8, id="riflesso-2")
        for x, y, rx, ry in ((138, 620, 7.5, 6.5), (180, 624, 7.5, 6.5), (162, 641, 3.5, 3), (20, 742, 5, 4)):
            puntino(t, x, y, rx, ry, 0, "#FBB945", 0.95, id="coriandolo")
        pomello(t, 164.6, 692, 19.6, 31, "#F8A024", "#FBC95A", 0.55)
    dettaglio(t, W, c)


def d4(t, W):
    def c(t):
        P = t.p
        fascia(t, [(170, 692), (210, 678), (240, 660), (290, 650)], 60, ["#EBEAF0", "#E8ECF4"], 170, 692, 290, 650, op=0.9, sfoca=0.6, id="fascia-vuota")
        fascia(t, [(10, 945), (28, 800), (95, 722), (170, 692)], 70, ["#FF6A3C", "#FF7A49", "#FA5A3E"], 10, 945, 170, 692, op=1.0, sfoca=0.5, id="fascia-arco")
        fascia(t, [(10, 945), (28, 800), (95, 722), (170, 692)], 84, ["#FFC9A8", "#FF9E80"], 10, 945, 170, 692, op=0.35, sfoca=7, id="alone-fascia")
        t.rett(P(0), P(880), P(W), P(90), 0, fill=sfumatura_op(t, [(0, "#FFF6F2", 0), (1, "#FFF6F2", 0.85)], 0, 880, 0, 940))
        for i, (a, b, c_, w, op) in enumerate((((12, 735), (70, 690), (160, 640), 5, 0.35), ((30, 700), (90, 660), (150, 620), 2.5, 0.35), ((70, 760), (110, 722), (150, 700), 2, 0.3))):
            scia_curva(t, [a, b, c_], w, "#FF9C74", op, 1.5, id=f"scia-{i + 1}")
        scia_curva(t, [(60, 800), (95, 748), (125, 722)], 2.2, "#FFFFFF", 0.7, 0.8, id="riflesso")
        for x, y, r, col in ((43, 668, 6, "#F1452E"), (105, 666, 8, "#F25A2E"), (187, 760, 7, "#F23A4C"), (216, 737, 3.5, "#F78B94"), (131, 870, 6, "#FB9A3A"), (125, 829, 5, "#F25A5E")):
            puntino(t, x, y, r, r * (0.8 if r > 5 else 1), 15, col, 0.95)
        tessera(t, 204, 625, 70, 12, g_tablet, "#FFB4A0", id="tessera-carta")
        tessera(t, 198, 836, 78, -10, g_puzzle, "#FFC9A8", id="tessera-puzzle")
        pomello(t, 168, 692, 20, 31, "#F9432A", "#FF8A5E", 0.5)
    dettaglio(t, W, c)


def d5(t, W):
    def c(t):
        P = t.p
        fascia(t, [(5, 905), (22, 790), (88, 722), (165, 721)], 82, ["#FF3E50", "#F83245", "#F5202F"], 5, 905, 165, 721, op=1.0, sfoca=0.5, id="fascia-arco")
        fascia(t, [(5, 905), (22, 790), (88, 722), (165, 721)], 100, ["#FFB4B8", "#FF8C96"], 5, 905, 165, 721, op=0.35, sfoca=8, id="alone-fascia")
        t.rett(P(0), P(880), P(W), P(90), 0, fill=sfumatura_op(t, [(0, "#FFF4F4", 0), (1, "#FFF4F4", 0.9)], 0, 870, 0, 940))
        for i, (a, b, c_, w, op) in enumerate((((10, 700), (80, 660), (170, 630), 5, 0.35), ((20, 650), (90, 628), (150, 612), 3, 0.35), ((20, 760), (60, 700), (110, 676), 2.5, 0.3))):
            scia_curva(t, [a, b, c_], w, "#FF9C74", op, 1.5, id=f"scia-{i + 1}")
        for x, y, lung, sp_, a, col in ((96, 605, 36, 7, -32, "#F2283A"), (117, 816, 36, 7, -55, "#F2283A"), (30, 700, 14, 6, 35, "#F2283A"), (80, 640, 16, 6, -35, "#FFB27E"), (150, 625, 22, 4, -22, "#F8A57F")):
            trattino(t, x, y, lung, sp_, a, col, 0.95)
        for x, y, r, col in ((54, 607, 7.5, "#F2283A"), (147, 605, 5, "#F2283A"), (30, 674, 5.5, "#FB8C3E"), (240, 796, 7, "#F23A4C"), (182, 814, 8, "#F2283A"), (140, 872, 6.5, "#F2283A"), (90, 893, 6.5, "#F2283A")):
            puntino(t, x, y, r, r * 0.85, 20, col, 0.95)
        tessera(t, 225, 632, 85, 12, g_orologio, "#FFB4B8", id="tessera-orologio")
        pomello(t, 164, 721, 29, 40, "#F4172C", "#FF6A78", 0.55)
    dettaglio(t, W, c)


def d6(t, W):
    def c(t):
        P = t.p
        # raggi pallidi dietro
        for ang in range(-10, 200, 9):
            a = math.radians(ang)
            r0, r1 = 56, 120 + (ang % 4) * 10
            t.linea(P(173 + r0 * math.cos(a)), P(737 + r0 * math.sin(a)), P(173 + r1 * math.cos(a)), P(737 + r1 * math.sin(a)), "#FBD8B0", P(2.2 + (ang % 3)), opacita=0.45)
        t.cerchio(P(173), P(737), P(130), fill=t.radiale([(0, "#FFE1B8", 0.65), (0.6, "#FFE9D2", 0.3), (1, "#FFF3E8", 0)], 0.5, 0.5, 0.5))
        fascia(t, [(-10, 692), (60, 690), (115, 700), (173, 737)], 84, ["#FF3E50", "#F8283A", "#F0182A"], -10, 692, 173, 737, op=1.0, sfoca=0.4, id="fascia-arco")
        scia_curva(t, [(0, 676), (60, 674), (110, 686)], 1.6, "#FFFFFF", 0.45, 0.5, id="riflesso-1")
        scia_curva(t, [(0, 700), (60, 698), (110, 712)], 1.2, "#FFFFFF", 0.35, 0.5, id="riflesso-2")
        # corona di spuntoni rossi sotto il pomello
        with t.gruppo("spuntoni"):
            for ang, ln, wd in ((50, 56, 16), (68, 70, 18), (88, 64, 18), (108, 72, 18), (127, 58, 16), (32, 40, 12), (146, 44, 12)):
                a = math.radians(ang); ca, sa = math.cos(a), math.sin(a)
                x0, y0 = 173 + 46 * ca, 737 + 46 * sa
                x1, y1 = 173 + (46 + ln) * ca, 737 + (46 + ln) * sa
                nx, ny = -sa, ca
                d = (f"M{n(P(x0 + nx * wd / 2))} {n(P(y0 + ny * wd / 2))}L{n(P(x1))} {n(P(y1))}L{n(P(x0 - nx * wd / 2))} {n(P(y0 - ny * wd / 2))}z")
                t.path(d, fill="#F2192D", stroke="#F2192D", sw=P(1.2))
        for x, y, w, h, a, col in ((119, 613, 12, 36, -8, "#F2283A"), (178, 605, 20, 20, 25, "#F2283A"), (222, 644, 22, 38, 20, "#F2283A"), (247, 686, 18, 8, -30, "#F2283A"),
                                   (245, 727, 16, 8, 0, "#F2283A"), (247, 770, 28, 12, 30, "#F2283A"), (29, 824, 24, 10, -35, "#F2283A"), (112, 850, 22, 26, 35, "#F2283A"),
                                   (36, 882, 24, 24, -15, "#F2283A"), (172, 892, 16, 28, -20, "#F2283A"), (226, 868, 30, 38, -25, "#F2283A"), (131, 790, 18, 8, 25, "#F2283A")):
            rombo(t, x, y, w, h, a, col, 0.95, skew=1.5)
        pomello(t, 173, 737, 40, 52, "#E8081E", "#FF6A78", 0.45)
    dettaglio(t, W, c)


# ---------------------------------------------------------------------------- schermate (riquadro superiore) + dettaglio
def s1():
    W = 268
    sp = base(1, W, "calcolo-0", ["Calcoliamo", "il tuo risultato"], ["Analizziamo le tue risposte per", "stimare la probabilità di superare", "l'OFA di inglese."], y_gauge0=215, pct=None,
              arco_fisso=dict(cx=135.5, cy=322, rx=87, ry=81, th=21), gauge=gauge(0.0, BLU, pomello="#2F7BF5", glow=0.25, pr=0.5))
    c = dict(card=(29, 366, 244, 536), card_r=18, card_fill="#F0F5FC", titolo="Analizzando le risposte...", titolo_y=(378, 396), x_tit=60, tit_peso=600, tit_col="#2B4A9E",
             cx=69.5, r=7.5, x_txt=88, y=(405, 520), stati=["fatto", "fatto", "fatto", "vuoto"], testi=["Grammatica", "Comprensione", "Vocabolario", "Ragionamento"], soglia=170)
    return sp, lambda t, mis: (corpo_passi(t, mis, sp, c), d1(t, W))


def s2():
    W = 274
    sp = base(2, W, "elaboriamo-8", ["Elaboriamo", "i tuoi risultati"], ["Stiamo confrontando le tue risposte", "con migliaia di studenti del Polimi."], y_gauge0=200,
              pct_y=(303, 342), pct="8%", pct_col=NAVY, did=DID, did_y=(346, 384), did_col=CAP, did_peso=500,
              gauge=gauge(0.22, [(0, "#3B82F6"), (0.12, "#7AA6F0"), (0.35, "#F9C36A"), (1, "#F8A93A")], pomello="#FBB02E", glow=0.45, scia=True))
    c = dict(card=(30, 395, 239, 536), card_r=18, card_fill="#F0F5FC", cx=67, r=7, x_txt=87, y=(405, 530), stati=["fatto", "fatto", "fatto", "corso"],
             testi=["Grammatica", "Comprensione", "Vocabolario", ["Ragionamento", "in corso..."]], soglia=170)
    return sp, lambda t, mis: (corpo_passi(t, mis, sp, c), d2(t, W))


def s3():
    W = 264
    sp = base(3, W, "analizzando-28", ["Stiamo analizzando..."], ["Quasi fatto! Stiamo pesando la", "difficoltà delle diverse sezioni."], y_gauge0=175,
              pct_y=(318, 356), pct="28%", pct_col=NAVY, did=DID, did_y=(359, 395), did_col=CAP, did_peso=500,
              gauge=gauge(0.30, [(0, "#F7735A"), (0.5, "#F9964A"), (1, "#F9B23A")], pomello="#F9A12E", glow=0.45, scia=True))
    chips = [(55, 235, 84, 27, -15, "Grammatica", "documento-lista", "#2F6FF0", ("#DDE8FF", "#F2F6FF"), "#2F5BC5"),
             (205, 236, 84, 27, 14, "Vocabolario", "documento-lista", "#F5A623", ("#FFEFD0", "#FFF8EA"), "#B26A10"),
             (70, 432, 98, 27, 17, "Comprensione", "chat", "#1FB67A", ("#D8F6EC", "#F0FBF7"), "#12936B"),
             (195, 447, 100, 27, -22, "Ragionamento", "chat", "#4B6FE0", ("#DCE5FB", "#F1F4FE"), "#2B4BA8")]
    def corpo(t, mis):
        with t.gruppo("chip-sezioni"):
            for cx, cy, w, h, a, et, ic, col, fondo, tc in chips:
                chip(t, cx, cy, w, h, a, fondo, tc, et, ic, col, id=f"chip-{et.lower()}", corpo=8.6)
        for x, y, rx, ry, a, col in ((40, 258, 3, 2, 0, "#F9C36A"),):
            pass
        d3(t, W)
    return sp, corpo


def swirl(t, cx, cy, col, col2):
    with t.gruppo("vortice"):
        for i, (rx, ry, ang, w, op, a0, a1) in enumerate(((128, 98, 12, 9, 0.40, 20, 300), (118, 88, 14, 4, 0.6, 60, 340), (136, 104, 8, 3, 0.55, 200, 440), (110, 80, 18, 5, 0.40, 140, 400))):
            ellisse_scia(t, cx, cy, rx, ry, ang, w, col if i % 2 == 0 else col2, op, 2.0, a0, a1, id=f"vortice-{i + 1}")


def s4():
    W = 267
    sp = base(4, W, "ultimi-calcoli-56", ["Ultimi calcoli..."], ["Consideriamo anche la difficoltà", "delle domande che hai provato", "e il tempo impiegato."], y_gauge0=195,
              pct_y=(320, 354), pct="56%", pct_col=ROSSO_PCT, soglia_pct=120, did=DID, did_y=(358, 394), did_col=CAP, did_peso=500,
              gauge=gauge(0.60, [(0, "#FFC561"), (0.5, "#FF9B4B"), (1, "#FF6A3D")], pomello="#F9432A", glow=0.45))
    sp["sfondo_fn"] = lambda t, mis: swirl(t, 133, 336, "#FFC2AE", "#FFD9A8")
    def corpo(t, mis):
        for x, y, r, col in ((162, 200, 3.5, "#F9A530"), (82, 233, 3, "#F9A530"), (25, 403, 3, "#F9A530"), (109, 424, 3, "#F2453A"), (162, 498, 4.5, "#F9A530"), (76, 498, 4, "#FBC26A"),
                             (236, 464, 4, "#F26A7A"), (120, 467, 2.5, "#F2453A")):
            puntino(t, x, y, r, r, 0, col, 0.95, luce=False)
        tessera(t, 219, 237, 48, 8, g_cartella, "#FFC4B0", id="tessera-cartella")
        tessera(t, 66, 425, 54, -22, g_documento_arancio, "#FFC9A0", id="tessera-documento")
        tessera(t, 211, 416, 48, 14, g_nuvola, "#FFB4C0", id="tessera-bolla")
        d4(t, W)
    return sp, corpo


def s5():
    W = 270
    sp = base(5, W, "quasi-pronto-76", ["Quasi pronto..."], ["Stiamo finalizzando il tuo risultato", "in base al modello di previsione", "dell'OFA."], y_gauge0=195,
              pct_y=(326, 362), pct="76%", pct_col=ROSSO_PCT, soglia_pct=120, did=DID, did_y=(366, 402), did_col=CAP, did_peso=500,
              gauge=gauge(0.86, [(0, "#FF8A5E"), (0.5, "#FF5A55"), (1, "#F5303E")], pomello="#F5202F", glow=0.45))
    sp["sfondo_fn"] = lambda t, mis: swirl(t, 135, 350, "#FFB8B8", "#FFD2B8")
    def corpo(t, mis):
        for x, y, r, col in ((93, 218, 4, "#F2283A"), (165, 208, 3.5, "#F2283A"), (155, 456, 5, "#F2283A"), (232, 480, 5, "#F2283A"), (133, 501, 4, "#F2283A"), (46, 514, 4, "#F2283A"),
                             (29, 395, 3, "#F26A5A"), (30, 330, 3, "#FB9A5A")):
            puntino(t, x, y, r, r, 0, col, 0.95, luce=False)
        trattino(t, 207, 427, 12, 5, -35, "#F2283A", 0.95)
        tessera(t, 213, 234, 46, 10, g_anello, "#FFB4B8", id="tessera-anello")
        tessera(t, 48, 269, 44, -18, g_barre_rosse, "#FFB4B8", id="tessera-barre-1")
        tessera(t, 74, 440, 56, -12, g_barre_rosse, "#FFB4B8", id="tessera-barre-2")
        d5(t, W)
    return sp, corpo


def s6():
    W = 268
    sp = base(6, W, "risultato-82", ["Ecco il tuo risultato"], [], y_gauge0=130,
              pct_y=(312, 358), pct="82%", pct_col=ROSSO_PCT, soglia_pct=120, did=DID, did_y=(366, 410), did_col="#DD1E24", did_peso=500,
              gauge=gauge(0.85, [(0, "#FF7A62"), (0.5, "#FF4D55"), (1, "#F5202F")], pomello="#F5202F", glow=0.5))
    def sfondo(t, mis):
        P = t.p
        t.cerchio(P(135), P(330), P(150), fill=t.radiale([(0, "#FFE3E3", 0.7), (0.7, "#FFEEEE", 0.3), (1, "#FFF5F5", 0)], 0.5, 0.5, 0.5), id="alone-esplosione")
        with t.gruppo("raggi"):
            for x, y, lung, w in ((32, 162, 20, 9), (72, 178, 30, 11), (112, 197, 10, 7), (169, 180, 44, 13), (204, 207, 26, 14), (240, 242, 30, 13), (26, 255, 30, 13),
                                  (36, 426, 32, 13), (77, 451, 22, 8), (44, 494, 44, 13), (171, 464, 30, 8), (204, 456, 34, 10), (225, 429, 20, 13), (105, 514, 8, 6), (228, 514, 8, 6),
                                  (18, 298, 7, 6), (241, 272, 6, 6), (131, 464, 6, 5)):
                cuneo(t, x, y, lung, w, 135, 334, "#F2283A")
            for ang in range(0, 360, 12):
                a = math.radians(ang)
                t.linea(P(135 + 118 * math.cos(a)), P(334 + 118 * math.sin(a)), P(135 + 136 * math.cos(a)), P(334 + 136 * math.sin(a)), "#F9B6A8", P(1.6), opacita=0.5)
    sp["sfondo_fn"] = sfondo
    def corpo(t, mis):
        d6(t, W)
    return sp, corpo


SCHERMATE = [("001", "calcoliamo", s1), ("002", "elaboriamo-8", s2), ("003", "analizzando-28", s3), ("004", "ultimi-calcoli-56", s4),
             ("005", "quasi-pronto-76", s5), ("006", "risultato-82", s6)]


def main(solo=None):
    USCITA.mkdir(parents=True, exist_ok=True)
    for nn, nome, f in SCHERMATE:
        if solo and nn not in solo: continue
        sp, corpo = f()
        mis = Mis(sp["nn"], sp["k"])
        t = disegna_base(sp, mis)
        corpo(t, mis)
        out = USCITA / f"{NOME}-{nn}-{nome}.svg"
        t.salva(out)
        print(out.name, len(t.svg()) // 1024, "KB", {k: v for k, v in sp["_arco"].items() if k in ("cx", "cy", "rx", "ry", "th", "score")})


if __name__ == "__main__":
    main(sys.argv[1:] or None)
