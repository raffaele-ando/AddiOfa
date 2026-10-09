"""
Landing desktop A (immagine 41): chiara e luminosa, "L'inglese a Polimi senza sorprese." con la scena dell'arco-stella.

Un SVG a pagina intera (viewBox 1440 x 960), TUTTO VETTORIALE (nessuna foto): la scena 3D dell'originale (tile blu con la stella
luminosa, scalinata, edifici e alberi sfocati, pannelli di vetro) è ridisegnata con forme e sfumature; i testi come tracciati
Inter. Gruppi: hero (navigazione, titolo, pulsanti, scena), vantaggi, che-cose-ofa (cinque card di vetro con il nastro rosso).

Corregge: il simbolo "Home" della navigazione (sbilenco) -> icona a quadretti pulita; sigillo non presente (l'edificio ha solo la
scritta Politecnico di Milano); le scritte inglesi a terra ("SAME STUDENTS BRIGHTER PATHS", "SMALL STEPS BIG OPPORTUNITIES")
sono mantenute come scritte tenui sul pavimento (testo letto dall'originale, glifi ricostruiti in Inter); cifre (82 %, 30 €)
lette dall'originale, non verificate.
"""
import math
from componenti import *  # noqa
from componenti import Pagina, NAVY, BLU, BLU_BTN, ROSSO, VERDE, TESTO, SOTTO


def stella(cx, cy, R, r, rot=-90):
    pts = []
    for i in range(10):
        a = math.radians(rot + i * 36)
        rr = R if i % 2 == 0 else r
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts


def poligono(pts):
    return "M" + "L".join(f"{n(x)} {n(y)}" for x, y in pts) + "z"


def nuvola(t, cx, cy, w, h, op=0.8):
    for dx, dy, k in [(-0.3, 0.1, 0.65), (0, -0.1, 0.9), (0.28, 0.08, 0.7), (0.05, 0.12, 1.0)]:
        t.ellisse(cx + dx * w, cy + dy * h, w * 0.28 * k, h * 0.34 * k, fill="#FFFFFF", opacita=op * 0.55, filtro=t.sfoca(h * 0.12))


def edificio(t, x, y, w, h, colore, finestre=True, op=1.0, passo=14, id=None):
    t.add(f'<g id="{id or t.uid("ed")}" opacity="{op}" filter="{t.sfoca(1.4)}">')
    t.rett(x, y, w, h, 2, fill=colore)
    t.rett(x, y, w, 6, 0, fill="#FFFFFF", opacita=0.35)
    if finestre:
        for j in range(int(h // passo) - 1):
            for i in range(int(w // 16)):
                t.rett(x + 5 + i * 16, y + 14 + j * passo, 9, 6, 1, fill="#FFFFFF", opacita=0.3)
    t.add("</g>")


def albero(t, cx, base, h, colore="#2F5A52", op=0.9):
    with t.gruppo(t.uid("albero"), opacita=op):
        t.rett(cx - 1.5, base - h * 0.25, 3, h * 0.25, 1, fill="#4A4B55")
        for k, (dx, dy, rr) in enumerate([(0, 0.55, 0.30), (-0.14, 0.4, 0.22), (0.14, 0.38, 0.22), (0, 0.3, 0.2), (0, 0.72, 0.26)]):
            t.ellisse(cx + dx * h, base - h * dy, rr * h * 0.72, rr * h * 0.82, fill=colore)


def cipresso(t, cx, base, h, colore="#244A44"):
    t.path(f"M{n(cx)} {n(base - h)}C{n(cx + h * 0.08)} {n(base - h * 0.7)} {n(cx + h * 0.09)} {n(base - h * 0.2)} {n(cx + 3)} {n(base)}"
           f"L{n(cx - 3)} {n(base)}C{n(cx - h * 0.09)} {n(base - h * 0.2)} {n(cx - h * 0.08)} {n(base - h * 0.7)} {n(cx)} {n(base - h)}z", fill=colore, id=t.uid("cipresso"))


def scena(t: Pagina):
    """La scena dell'hero: x 520..1536, y 0..640."""
    # cielo
    cielo = t.sfumatura([(0, "#FEFEFF"), (0.28, "#EEF3FC"), (0.55, "#D6E3F8"), (1, "#B7CBEB")], 0, 0, 1, 0)
    t.rett(0, 0, W, 720, 0, fill=cielo, id="cielo")
    t.rett(0, 0, W, 640, 0, fill=t.sfumatura([(0, "#FFFFFF", ), (1, "#FFFFFF")], 0, 0, 0, 1), opacita=0.0)
    with t.gruppo("nuvole"):
        nuvola(t, 870, 170, 240, 90, 0.9)
        nuvola(t, 1520, 110, 220, 70, 0.7)
        nuvola(t, 1450, 560, 200, 100, 0.9)
        nuvola(t, 720, 260, 160, 60, 0.6)
        nuvola(t, 1180, 100, 150, 50, 0.6)
    # edifici lontani
    with t.gruppo("edifici-sfondo"):
        edificio(t, 760, 345, 120, 120, "#CDD5EA", op=0.7, id="edificio-sx-1")
        edificio(t, 650, 335, 100, 130, "#C3CBE2", op=0.65, id="edificio-sx-2")
        edificio(t, 535, 345, 90, 120, "#C7CEE6", op=0.6, id="edificio-sx-3")
        edificio(t, 905, 440, 60, 40, "#CFD6EC", op=0.6, id="edificio-sx-4")
        # edificio Politecnico a destra, con scritta
        t.rett(1383, 268, 153, 160, 2, fill="#9FB0CF", opacita=0.9, id="edificio-politecnico")
        t.rett(1383, 268, 153, 14, 0, fill="#C9D3E6", opacita=0.9)
        for j in range(5):
            for i in range(9):
                t.rett(1390 + i * 16.5, 360 + j * 11, 11, 5, 1, fill="#DCE6F6", opacita=0.75)
        with t.gruppo("scritta-politecnico-di-milano", trasforma="translate(1417 307) rotate(-12) skewX(-6)"):
            t.testo("POLITECNICO", 0, 0, 14.5, 600, "#27406B", spaziatura=0.8)
            t.testo("DI MILANO", 0, 17, 14.5, 600, "#27406B", spaziatura=0.8)
        # campanile e guglie
        t.path("M1190 440l8 -52l8 52z", fill="#B8C3DC", opacita=0.8)
        t.rett(1186, 440, 24, 40, 2, fill="#C3CCE2", opacita=0.8)
        t.path("M1198 362l-5 28h10z", fill="#AAB6D3", opacita=0.8)
        edificio(t, 1100, 425, 70, 70, "#C9D1E8", op=0.7, id="edificio-dx-2")
        edificio(t, 1240, 440, 120, 80, "#BFC9E3", op=0.75, id="edificio-dx-3")
    # pannelli di vetro alti (solo contorno e velo)
    with t.gruppo("pannelli-vetro-alti"):
        for (x, y, w, h, rot) in [(1252, 80, 90, 230, 0), (1288, 176, 160, 270, 0), (612, 218, 160, 250, 0)]:
            t.rett(x, y, w, h, 8, fill="#FFFFFF", opacita=0.16)
            t.rett(x + 0.5, y + 0.5, w - 1, h - 1, 8, fill="none", stroke="#FFFFFF", sw=1.4, opacita=0.75)
    # alberi
    with t.gruppo("alberi"):
        albero(t, 612, 500, 82, "#35604F")
        albero(t, 570, 470, 50, "#3C6E5A", 0.8)
        for cx, h in [(1300, 100), (1342, 84), (1380, 70)]:
            cipresso(t, cx, 440, h)
        albero(t, 1512, 470, 80, "#486A58", 0.85)
        albero(t, 1190, 520, 60, "#44705A", 0.85)
    # tile blu con la stella
    with t.gruppo("tile-stella"):
        # spessore a destra e in alto
        t.rett(900, 70, 352, 322, 92, fill="#16347E", id="tile-spessore")
        t.rett(893, 82, 350, 318, 92, fill=t.sfumatura(["#2A67D8", "#1F4DB5", "#263F96"], 0, 0, 0, 1), id="tile-faccia")
        t.rett(893.5, 82.5, 349, 317, 92, fill="none", stroke="#6FA2F2", sw=1.6, opacita=0.55)
        # riflesso in alto a sinistra
        t.path("M920 200C922 132 968 100 1040 98", fill="none", stroke="#9CC3FF", sw=3, opacita=0.3)
        # buco a forma di stella con porta
        pts = stella(1047, 266, 100, 45)
        # la stella si apre in basso nella porta: sostituisci i due punti bassi con montanti verticali
        sx = [pts[0], pts[1], pts[2], pts[3], (1100, 292)]
        # costruzione: apice, braccio destro, spalla, montante giù, base, montante su, spalla, braccio sinistro
        ap, d1, br, d2 = pts[0], pts[1], pts[2], pts[3]
        sl = pts[7]; bl = pts[8]
        foro = [pts[0], pts[1], pts[2], pts[3], (1091, 298), (1096, 398), (998, 398), (1003, 298), pts[7], pts[8], pts[9]]
        t.path(poligono(foro), fill="#8E5A4C", stroke="#8E5A4C", sw=10, join="round", id="foro-stella-bordo")
        luce = t.radiale([(0, "#FFFFFF", 1), (0.35, "#FFF8D2", 1), (0.75, "#FFD98A", 1), (1, "#F6B25A", 1)], 0.5, 0.78, 0.7)
        t.path(poligono(foro), fill=luce, stroke="#FFE7A3", sw=3, join="round", id="foro-stella-luce")
    # basamento, scalinata, pavimento
    with t.gruppo("scalinata"):
        t.path("M0 640L440 470L1536 560L1536 640z", fill=t.sfumatura(["#D9DDEF", "#E6E4EF"], 0, 0, 0, 1), opacita=0.0)
        # pavimento chiaro
        t.path("M520 720C560 600 860 520 1040 510C1250 520 1400 560 1536 590L1536 720z", fill=t.sfumatura(["#CBD2EC", "#E8E7F2", "#F4F5FB"], 0, 0, 0, 1), id="pavimento")
        # basamento cilindrico a destra
        t.path("M1075 392C1090 380 1240 382 1262 395L1272 480C1262 500 1090 500 1070 482z", fill=t.sfumatura(["#E7EAF6", "#CDD3EA"], 0, 0, 1, 0), id="basamento-dx")
        t.path("M1075 392C1092 402 1240 402 1262 395", fill="none", stroke="#FFFFFF", sw=3, opacita=0.9)
        # basamento a sinistra della porta
        t.path("M820 400C900 385 975 388 1002 392L1000 484C940 482 880 490 810 500z", fill="#DDE2F2")
        # gradini: da basso-sinistra alla porta
        passi = [(560, 540, 520, 22), (640, 520, 460, 20), (708, 500, 410, 18), (772, 482, 360, 16), (826, 466, 310, 14), (874, 452, 262, 12),
                 (918, 440, 214, 10), (956, 430, 170, 8)]
        for i, (x, y, w, h) in enumerate(passi):
            t.path(f"M{x} {y + h}L{x + 40} {y}L{x + w} {y}L{x + w - 12} {y + h}z",
                   fill=t.sfumatura(["#F3F6FE", "#D8E1F7"], 0, 0, 0, 1), stroke="#FFFFFF", sw=1.2, id=f"gradino-{i + 1}")
            t.path(f"M{x} {y + h}L{x + w - 12} {y + h}L{x + w - 12} {y + h + 5}L{x - 2} {y + h + 5}z", fill="#B7C4E6", opacita=0.7)
        t.path("M1000 400L1100 400L1100 430L1000 430z", fill="#EEF2FC", opacita=0.0)
    # bagliore della porta sui gradini e sul pavimento
    t.ellisse(1047, 410, 150, 38, fill=t.radiale([(0, "#FFE9B0", 0.95), (0.5, "#FFD98A", 0.5), (1, "#FFD98A", 0)]), id="bagliore-pavimento")
    t.path("M996 396L1098 396L1160 560L930 560z", fill=t.sfumatura([(0, "#FFF2C2"), (1, "#FFF2C2")], 0, 0, 0, 1), opacita=0.18)
    # scie luminose
    with t.gruppo("scie-luminose"):
        t.path("M700 400C760 360 850 372 915 337", fill="none", stroke="#FFFFFF", sw=3.5, opacita=0.95, filtro=t.sfoca(1))
        t.path("M706 398C760 372 840 385 905 345", fill="none", stroke="#F3B1BC", sw=2, opacita=0.8)
        t.path("M1180 284C1260 270 1330 320 1310 350C1280 400 1180 350 1160 392", fill="none", stroke="#FFFFFF", sw=3.5, opacita=0.9, filtro=t.sfoca(0.8))
        t.cerchio(1181, 284, 4, fill="#FFFFFF")
        t.cerchio(707, 398, 4, fill="#FFFFFF")
    # scritte a terra
    with t.gruppo("scritte-a-terra", opacita=0.62):
        with t.gruppo("scritta-same-students", trasforma="translate(1008 530) rotate(-8) skewX(-18)"):
            for j, r in enumerate(["SAME", "STUDENTS", "BRIGHTER", "PATHS"]):
                t.testo(r, 0, j * 17, 15, 300, "#6B7BA8", spaziatura=2)
        with t.gruppo("scritta-small-steps", trasforma="translate(1252 545) rotate(-14) skewX(-16)"):
            for j, r in enumerate(["SMALL", "STEPS", "BIG", "OPPORTUNITIES"]):
                t.testo(r, j * 8, j * 24, 22, 300, "#6F7FAE", spaziatura=2.5)
    # card di vetro fluttuanti
    # 1) probabilità
    with t.gruppo("card-probabilita", trasforma="rotate(-8 770 220)"):
        t.vetro(690, 137, 160, 162, 22, opacita=0.82, id="vetro-probabilita")
        t.T("Probabilità", 716, 193, 14, 500, "#3C4668")
        t.T("di non superare l'OFA", 716, 213, 14, 500, "#3C4668", larg=112)
        gauge(t, 768, 262, 44, 0.82, sp=10, inizio=165, fine=15, id="misuratore-82-card")
        t.T("82%", 770, 284, 28, 700, ROSSO, "middle")
    # 2) test inglese
    with t.gruppo("card-test-inglese", trasforma="rotate(-6 1300 170)"):
        t.vetro(1250, 82, 118, 178, 16, opacita=0.86, id="vetro-test")
        # bandiera (stilizzata: Union Jack)
        t.rett(1262, 130, 38, 26, 2, fill="#1F3E8F")
        t.path("M1262 130l38 26M1300 130l-38 26", stroke="#FFFFFF", sw=5)
        t.path("M1262 130l38 26M1300 130l-38 26", stroke="#E23744", sw=2)
        t.path("M1281 130v26M1262 143h38", stroke="#FFFFFF", sw=8)
        t.path("M1281 130v26M1262 143h38", stroke="#E23744", sw=4.5)
        for i, (lab, fill, col) in enumerate([("A", "#E4EDFF", BLU_BTN), ("✓", "#FFE5E6", ROSSO), ("C", "#E4EDFF", BLU_BTN)]):
            y = 178 + i * 24
            t.rett(1268, y, 18, 18, 5, fill=BLU_BTN if i != 1 else ROSSO)
            if i == 1:
                t.icona("spunta", 1271, y + 3, 12, "#FFFFFF", 3)
            else:
                t.T(lab, 1277, y + 13.5, 12, 700, "#FFFFFF", "middle")
            t.rett(1294, y + 3, 54, 4.5, 2.2, fill="#C9D5F0"); t.rett(1294, y + 11, 38, 4.5, 2.2, fill="#C9D5F0")
    # 3) piano bloccato
    with t.gruppo("card-piano-bloccato", trasforma="rotate(-8 1395 410)"):
        t.vetro(1318, 340, 152, 150, 20, opacita=0.86, id="vetro-piano-bloccato")
        t.rett(1337, 378, 26, 32, 6, fill=ROSSO)
        t.path("M1342 378v-7a8 8 0 0 1 16 0v7", stroke="#D83440", sw=3.4)
        t.cerchio(1350, 392, 3.4, fill="#FFFFFF")
        t.righe(["Piano di studi", "bloccato"], 1376, 385, 13.5, 500, "#2C3760", passo=17, id="card-testo")
        for r_ in range(2):
            for c_ in range(4):
                t.rett(1342 + c_ * 26, 429 + r_ * 22, 17, 14, 4, fill="#BFD0F2", opacita=0.9)
    # puntini di luce
    for (x, y, r) in [(1140, 330, 2), (900, 200, 1.5), (1220, 190, 1.5), (760, 330, 1.6)]:
        t.cerchio(x, y, r, fill="#FFFFFF", opacita=0.9)


def cards_rischi(t: Pagina):
    """Cinque card di vetro con il nastro rosso."""
    with t.gruppo("che-cose-ofa-card"):
        # nastro rosso dietro
        ribbon = "M560 842C660 800 700 840 740 850C800 868 840 882 870 884C940 892 1000 866 1040 850C1100 836 1150 840 1190 822C1230 806 1250 780 1262 770"
        t.path(ribbon, stroke="#F4A3AC", sw=24, opacita=0.45, filtro=t.sfoca(7), id="nastro-alone")
        t.path(ribbon, stroke=t.sfumatura(["#FFB1B8", "#F25C69", "#FFB1B8"], 560, 0, 1262, 0, userspace=True), sw=13, opacita=1, id="nastro-rosso")
        t.path("M1252 758l22 12-22 14z", fill="#F0343F", id="nastro-freccia")
        # card
        card = [("non-superi", 607, 758, 116, 156, ["Non superi", "l'OFA"], "x"), ("perdi-30", 727, 737, 139, 191, ["Perdi in media", "30€"], "portafoglio"),
                ("piano-bloccato", 868, 722, 155, 220, ["Piano di studi", "bloccato"], "lucchetto"),
                ("secondo-anno", 1027, 704, 177, 241, ["Dal secondo anno", "non puoi sostenere", "alcuni esami"], "cappello")]
        for (nome, x, y, w, h, testo, ic) in card:
            with t.gruppo("card-" + nome):
                t.rett(x - 9, y + 8, w, h, 16, fill="#C9D3EE", opacita=0.7)             # spessore
                t.vetro(x, y, w, h, 16, opacita=0.78, id=f"vetro-{nome}")
                t.rett(x + 10, y + 10, w - 20, h - 20, 10, fill="#FFFFFF", opacita=0.25)
                corpo = 15
                if nome == "perdi-30":
                    t.T(testo[0], x + 28, y + 50, 14.4, 500, "#2A3560")
                    t.T(testo[1], x + 28, y + 76, 21, 500, "#2A3560")
                else:
                    t.righe(testo, x + 22 if w < 130 else x + 28, y + 50, 14.4, 500, "#2A3560", passo=19, id="card-testo")
                cx, cy = x + w / 2 - (4 if nome == "perdi-30" else 0), y + h * (0.66 if nome != "secondo-anno" else 0.72)
                if ic == "x":
                    t.path(f"M{n(cx - 18)} {n(cy - 18)}l36 36M{n(cx + 18)} {n(cy - 18)}l-36 36", stroke="#F0414E", sw=13, cap="round", id="icona-x-rossa")
                elif ic == "portafoglio":
                    t.rett(cx - 28, cy - 22, 56, 44, 8, fill="#E5424F", id="icona-portafoglio")
                    t.rett(cx - 26, cy - 30, 40, 14, 5, fill="#F06A74", opacita=0.9)
                    t.rett(cx + 6, cy - 4, 24, 16, 6, fill="#C42B3A")
                    t.cerchio(cx + 14, cy + 4, 3, fill="#FFFFFF")
                elif ic == "lucchetto":
                    t.path(f"M{n(cx - 15)} {n(cy - 12)}v-10a15 15 0 0 1 30 0v10", stroke="#8794B5", sw=7, id="icona-lucchetto")
                    t.rett(cx - 24, cy - 12, 48, 42, 8, fill="#8F9BBC")
                    t.cerchio(cx, cy + 5, 5, fill="#4B5577")
                    t.rett(cx - 2, cy + 6, 4, 11, 2, fill="#4B5577")
                else:
                    t.path(f"M{n(cx)} {n(cy - 24)}l-48 20l48 20l48 -20z", fill="#6F82B4", id="icona-cappello")
                    t.path(f"M{n(cx - 28)} {n(cy - 2)}v18c0 8 56 8 56 0v-18l-28 12z", fill="#5B6FA3")
                    t.path(f"M{n(cx + 44)} {n(cy - 6)}v22", stroke="#5B6FA3", sw=3)
        # card finale blu
        with t.gruppo("card-con-addiofa"):
            t.rett(1262, 668, 196, 322, 22, fill="#9DB9F1", opacita=0.6)
            t.rett(1272, 657, 196, 322, 22, fill=t.sfumatura(["#9CC0FF", "#4F8CF5", "#7FB0FF"], 0, 0, 1, 1), filtro=t.ombra(10, 28, "#3A68D8", 0.35), id="vetro-con-addiofa")
            t.rett(1272.5, 657.5, 195, 321, 22, fill="none", stroke="#FFFFFF", sw=2, opacita=0.85)
            t.righe(["Con AddiOFA", "ti prepari", "ed eviti tutto questo."], 1298, 730, 16, 500, "#FFFFFF", passo=21, id="card-testo", larg=148)
            for i, hh in enumerate((40, 68, 96)):
                t.rett(1314 + i * 26, 868 - hh, 16, hh, 4, fill=t.sfumatura(["#3B82FF", "#1F4FE0"], 0, 0, 0, 1), id=f"barra-{i + 1}")
            t.cerchio(1411, 889, 22, fill="#2A63F0", filtro=t.ombra(4, 12, "#1F4FE0", 0.4), id="pulsante-freccia")
            t.icona("chevron-destra", 1402, 880, 18, "#FFFFFF", 3)


def costruisci() -> Pagina:
    t = Pagina("landing-a", fondo="#FFFFFF")
    scena(t)
    # velo bianco a sinistra (il testo sta su fondo quasi bianco) e in basso
    t.defs.append('<linearGradient id="velo41-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="1"/>'
                  '<stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.96"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>')
    t.rett(0, 0, 640, 700, 0, fill="url(#velo41-h)", id="velo-sinistro")
    t.defs.append('<linearGradient id="velo41-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8FAFF" stop-opacity="0"/>'
                  '<stop offset="1" stop-color="#F8FAFF" stop-opacity="1"/></linearGradient>')
    t.rett(0, 560, W, 140, 0, fill="url(#velo41-v)", id="velo-basso")
    t.rett(0, 696, W, 328, 0, fill=t.sfumatura(["#F8FAFF", "#FDFDFF", "#F4F7FE"], 0, 0, 0, 1), id="fondo-sezione-2")
    # alone lilla dietro le card
    t.ellisse(1200, 840, 400, 110, fill=t.radiale([(0, "#EAF0FF", 0.9), (1, "#EAF0FF", 0)]), id="alone-sezione-2")

    # ---------------------------------------------------------------- hero: navigazione
    with t.gruppo("hero"):
        with t.gruppo("navigazione"):
            logo_parola(t, 73, 21.5, 36.5, id="logo-addiofa")
            t.rett(512, 18, 497, 40, 20, fill="#FFFFFF", opacita=0.85, filtro=t.ombra(4, 14, "#5272C8", 0.12), id="barra-menu")
            t.rett(520, 24, 70, 28, 14, fill="#E8EFFD", id="menu-home-attivo")
            for k, (x_, y_) in enumerate([(530, 33), (530, 38.5), (536, 33), (536, 38.5)]):
                pass
            t.rett(530.5, 32.5, 5.5, 5.5, 1.6, fill=BLU_BTN); t.rett(530.5, 40, 5.5, 5.5, 1.6, fill=BLU_BTN, opacita=0.6)
            t.testo("Home", 545, 42.5, 12.5, 500, BLU_BTN, id="menu-home")
            for v, x in [("Come funziona", 617), ("Perché è importante", 728), ("Il percorso", 867), ("FAQ", 954)]:
                t.testo(v, x, 42.5, 12.5, 500, "#1F2A55", id="menu-" + v.lower().replace(" ", "-").replace("é", "e"))
            pulsante_pieno(t, 1331, 19, 135, 38, "Scarica l'app", 12.2, fondo="#1F62F0", tondo=True, id="pulsante-scarica-app")
        # ---- testo
        t.testo("POLITECNICO DI MILANO", 73, 144, 10.4, 500, "#6F7DA3", spaziatura=2.6, id="etichetta-politecnico")
        t.T("L'inglese", 73, 224, 64, 800, NAVY, larg=254, id="titolo-riga-1")
        t.T("a Polimi", 73, 287, 64, 800, NAVY, larg=239, id="titolo-riga-2")
        t.T("senza sorprese.", 73, 351, 64, 800, "#1760F2", larg=475, id="titolo-riga-3")
        t.righe(["Verifica il tuo livello, scopri se sei a rischio", "e preparati per superare l'OFA di inglese."], 74, 398, 19, 400, "#4A5778", passo=25.5, id="sottotitolo", larg=350)
        pulsante_pieno(t, 74, 459, 208, 50, "Inizia la verifica", 15, fondo="#1B62F5", tondo=True, id="pulsante-inizia-la-verifica")
        pulsante_contorno(t, 296, 457, 160, 54, "Scopri di più", 15, icona="freccia-giu", bordo="#9AA6C4", id="pulsante-scopri-di-piu", peso=500) if "freccia-giu" in U.ICONE else None
        if "freccia-giu" not in U.ICONE:
            with t.gruppo("pulsante-scopri-di-piu"):
                t.rett(296.5, 457.5, 159, 53, 26.5, fill="#FFFFFF", opacita=0.7, stroke="#9AA6C4", sw=1.4)
                lw = t.testo("Scopri di più", 322, 489, 14.6, 500, NAVY)
                t.path("M427 478v16M420.500 487.500 427 494l6.500-6.500", stroke=NAVY, sw=1.8)
        # ---- quattro punti di forza
        with t.gruppo("punti-di-forza"):
            for ix, tx, a, b, ic in [(77, 115, "Quiz realistici", "Come l'esame", "barre"), (222, 258, "Piano su misura", "Per il tuo livello", "lucchetto"),
                                     (363, 402, "Evita blocchi", "al piano di studi", "scudo"), (511, 550, "Creato per", "gli studenti del Polimi", "stella")]:
                if ic == "barre":
                    for j, hh in enumerate((10, 16, 22)):
                        t.rett(ix + 1 + j * 9, 593 - hh, 6, hh, 3, fill="none", stroke=BLU_SC, sw=1.8)
                elif ic == "stella":
                    t.path(poligono(stella(ix + 10, 582, 13, 5.6)), stroke=BLU_SC, sw=1.8, id="icona-stella")
                elif ic == "lucchetto":
                    t.rett(ix + 1, 578, 20, 17, 4, fill="none", stroke=BLU_SC, sw=1.8, id="icona-lucchetto")
                    t.path(f"M{ix + 5} 578v-5a6 6 0 0 1 12 0v5", stroke=BLU_SC, sw=1.8)
                    t.cerchio(ix + 11, 586.500, 1.8, fill=BLU_SC)
                else:
                    t.icona(ic, ix - 3, 568, 26, BLU_SC, 1.8)
                t.T(a, tx, 579, 11, 500, NAVY, id=f"punto-{ic}-titolo")
                t.T(b, tx, 594, 11, 400, SOTTO, id=f"punto-{ic}-testo")
            for x in (200, 346, 487):
                t.linea(x, 570, x, 595, "#DCE3F2", 1)
        with t.gruppo("scorri-per-scoprire"):
            t.rett(761, 592, 14, 26, 7, fill="none", stroke="#46506F", sw=1.4)
            t.rett(767, 598, 2, 6, 1, fill="#46506F")
            t.T("SCROLL", 768, 638, 7.6, 500, "#6C7690", "middle", sp=1.8)
            t.T("PER SCOPRIRE", 768, 649, 7.6, 500, "#6C7690", "middle", sp=1.8)

    # ---------------------------------------------------------------- sezione: Cos'è l'OFA di inglese?
    with t.gruppo("che-cose-ofa"):
        t.T("01", 73, 719, 8, 700, BLU_SC)
        t.linea(113, 716, 357, 716, "#E2E8F6", 1.4)
        t.linea(113, 716, 161, 716, BLU_SC, 2.2)
        t.T("Cos'è", 73, 790, 41, 800, NAVY, id="titolo-sezione-riga-1")
        t.rich([("l'", 800, NAVY), ("OFA di inglese?", 800, BLU)], 73, 833, 41, id="titolo-sezione-riga-2")
        t.rich([("Una verifica obbligatoria per gli studenti del Politecnico di Milano.", 400, None)], 73, 864, 14.4, "#6A7691", id="testo-1")
        t.rich([("Se non la superi, rischi di perdere circa ", 400, None), ("30€", 800, NAVY), (", avere il piano", 400, None)], 73, 884, 14.4, "#6A7691", id="testo-2")
        t.rich([("di studi ", 400, None), ("bloccato", 700, NAVY), (" e non poter sostenere alcuni esami dal secondo anno.", 400, None)], 73, 904, 14.4, "#6A7691", id="testo-3")
        with t.gruppo("pulsante-scopri-tutti-i-rischi"):
            t.rett(74.5, 932.5, 179, 41, 20.5, fill="#FFFFFF", opacita=0.85, stroke="#9AA6C4", sw=1.4)
            t.testo("Scopri tutti i rischi", 95, 958, 13.4, 500, NAVY)
            t.icona("chevron-destra", 220, 947, 13, NAVY, 2.2)
        cards_rischi(t)
    return t


BLU_SC = "#1F4FE0"


def main():
    t = costruisci()
    p = salva_landing(t, "41-landing-desktop", "01-landing.svg")
    print(p, p.stat().st_size // 1024, "KB")
    return p


if __name__ == "__main__":
    main()
