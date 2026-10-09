"""
Landing desktop C (immagine 51): hero scuro (arco con stella e studente di spalle), fascia "La realtà / Il tuo domani" e
"Un percorso su misura, in 4 passi".

Un SVG a pagina intera (viewBox 1440 x 960): gruppi hero, la-realta, come-funziona. Raster: solo le fotografie (hero,
studente affaticato, studente sulla città), ripulite da testi/interfaccia con foto.py. Il SIGILLO sul pilastro è stato
cancellato dalla foto e sostituito dal segnaposto neutro `sigillo-segnaposto`. Le scritte a mano sono rifatte in Inter
inclinato (testo ricostruito: stesso contenuto, altra grafia); la paginazione "01 02 03 04 04" è corretta in 01-04;
le quattro mini-schermate dei passi sono ridisegnate semplificate (testi letti dall'originale).
"""
from componenti import *  # noqa
from componenti import Pagina, NAVY, BLU, BLU_BTN, ROSSO, VERDE, GIALLO

AZZ = "#3B7BFF"
CH = "#FFFFFF"


def nav_scuro(t):
    with t.gruppo("navigazione"):
        logo_orizzontale(t, 79, 7, 34, scuro=True, id="logo-addiofa", larg_testo=91)
        voci = [("Home", 306), ("Come funziona", 392), ("Funzionalità", 490), ("Storie", 564), ("Prezzi", 625), ("FAQ", 683)]
        for i, (v, cx) in enumerate(voci):
            t.testo(v, cx, 28, 11.8, 500, "#FFFFFF", "middle", id="menu-" + v.lower().replace(" ", "-"))
        t.rett(292, 35, 28, 2, 1, fill=AZZ, id="menu-attivo")
        with t.gruppo("pulsante-scarica-app"):
            t.rett(1271, 8, 131, 34, 17, fill="#FFFFFF", filtro=t.ombra(3, 10, "#0A1A50", 0.3))
            t.testo("Scarica l'app", 1295, 29.5, 11.8, 600, BLU_BTN)
            t.icona("freccia-destra", 1373, 20, 11.5, BLU_BTN, 2.4)
        with t.gruppo("selettore-lingua"):
            t.rett(1425, 14, 46, 26, 13, fill="#FFFFFF", opacita=0.16)
            t.testo("IT", 1434, 31, 10.5, 500, "#FFFFFF")
            t.icona("chevron-giu", 1454, 23, 8.5, "#FFFFFF", 2.6)


def costruisci() -> Pagina:
    t = Pagina("landing-c", fondo="#FFFFFF")

    # ------------------------------------------------------------------ hero
    with t.gruppo("hero"):
        t.rett(0, 0, 700, 487, 0, fill=t.sfumatura(["#01112A", "#02142F", "#041936", "#0B2040"], 0, 0, 0, 1), id="fondo-scuro")
        mk = maschera_dissolvenza(t, 470, 640, 0, 487, 0, 1)
        with con_maschera(t, mk, "foto-hero-colonna-stella"):
            t.foto_in("51-hero.jpg", 480, 0, 1056, 486, 0, id="foto-hero")
        sigillo_segnaposto(t, 999, 84, 27)
        nav_scuro(t)
        tw = t.testo("POLITECNICO DI MILANO", 80, 95, 9.4, 500, "#5A8CFF", spaziatura=1.9, id="etichetta-politecnico")
        t.linea(80 + tw + 10, 91.5, 80 + tw + 34, 91.5, "#8FB0FF", 1.2)
        t.T("Oltre l'OFA,", 80, 175, 66, 800, "#FFFFFF", larg=334, id="titolo-riga-1")
        t.T("un passo in più.", 80, 233, 66, 800, "#2F6EFF", larg=450, id="titolo-riga-2")
        t.righe(["AddiOFA ti aiuta a superare l'OFA di inglese", "con un percorso personalizzato, evitando rischi,",
                 "costi e blocchi del tuo piano di studi."], 80, 265, 16.5, 400, "#FFFFFF", passo=21, id="sottotitolo", larg=322)
        pulsante_pieno(t, 80, 329, 147, 37, "Inizia ora", 12.4, fondo="#FFFFFF", colore=NAVY, id="pulsante-inizia-ora", sfum=False, ombra=False)
        with t.gruppo("pulsante-video"):
            t.cerchio(263, 347.5, 16, fill="none", stroke="#FFFFFF", sw=1.4)
            t.icona("play", 257.5, 341.5, 12, "#FFFFFF", 1.2)
            t.testo("Scopri il video", 296, 351.5, 11.3, 500, "#FFFFFF")
        avatar_gruppo(t, 93, 418, 12, 23, AVATAR_51)
        t.rich([("Già ", 400, None), ("12.000+", 700, "#FFFFFF"), (" studenti", 400, None)], 193, 415, 10.6, "#E9EEFF", id="prova-sociale-1")
        t.T("si stanno preparando con AddiOFA", 193, 429, 10.6, 400, "#E9EEFF", id="prova-sociale-2")
        for i, (r, p, o) in enumerate([("STUDIA", 600, 1), ("PREPARATI", 600, 1), ("SUPERA", 400, 0.8), ("SBLOCCA", 400, 0.8), ("IL TUO PERCORSO", 400, 0.8)]):
            t.testo(r, 427, 387 + i * 15.4, 8.4, p, "#FFFFFF", spaziatura=1.35, opacita=o, id=f"parola-{i + 1}")
        # paginazione 01-04 (nell'originale 01 02 03 04 04)
        with t.gruppo("paginazione"):
            t.linea(80, 467, 646, 467, "#FFFFFF", 1, opacita=0.55)
            for lab, cx, att in [("01", 663, True), ("02", 727, False), ("03", 788, False), ("04", 849, False)]:
                t.testo(lab, cx, 471, 9.6, 700 if att else 400, "#FFFFFF", "middle", opacita=1 if att else 0.7)
            t.linea(678, 467, 712, 467, "#FFFFFF", 0.01)
        with t.gruppo("scorri"):
            t.testo("SCROLL", 1500, 238, 7.8, 500, "#FFFFFF", spaziatura=1.5, id="scroll-testo",
                    ) if False else None
            with t.gruppo("scroll-verticale", trasforma="translate(1503 241) rotate(90)"):
                t.testo("SCROLL", 0, 0, 7.8, 500, "#FFFFFF", spaziatura=1.6)
            t.linea(1501, 287, 1501, 327, "#FFFFFF", 1)
            t.icona("freccia-giu", 1496.5, 322, 9, "#FFFFFF", 2.4) if False else t.path("M1497 321l4 5 4-5", stroke="#FFFFFF", sw=1.1)
            t.linea(1501, 336, 1501, 357, "#FFFFFF", 1, opacita=0.7)
        t.righe(["UN FUTURO", "PIÙ APERTO"], 1366, 418, 8.8, 500, "#FFFFFF", passo=16, sp=1.5, id="un-futuro-piu-aperto")
        a_mano(t, ["Stessa", "partenza.", "Più possibilità."], 1278, 128, -15, 18.5, "#1E2F5A", 21, peso=300, inclina=-10, id="scritta-stessa-partenza")
        t.path("M1232 198Q1262 190 1292 178", stroke="#2D63D8", sw=4, id="sottolineatura-blu")

    # ------------------------------------------------------------------ la realtà / il tuo domani
    with t.gruppo("la-realta"):
        t.rett(0, 487, 1536, 253, 0, fill="#EAEDF5", id="fondo-fascia")
        t.rett(560, 487, 440, 253, 0, fill=t.sfumatura(["#E3E6EE", "#EEEFF4", "#F0EFF3"], 0, 0, 0, 1), id="velo-centrale")
        with con_maschera(t, maschera_dissolvenza(t, 500, 630, 0, 0, 1, 0), "foto-studente-affaticato"):
            t.foto_in("51-sinistra.jpg", 0, 487, 640, 254, 0, id="foto-sinistra")
        with con_maschera(t, maschera_dissolvenza(t, 930, 1040, 0, 0, 0, 1), "foto-studente-citta"):
            t.foto_in("51-destra.jpg", 940, 487, 596, 254, 0, id="foto-destra")
        # scritte a mano (bianche) sulla foto di sinistra
        for righe_, cx, cy, rot, nome in [(["Rischio di", "perdere 30€"], 160, 524, -13, "rischio"), (["Piano di studi", "bloccato"], 398, 553, -12, "piano"),
                                          (["Niente esami", "dal secondo anno"], 561, 549, 0, "esami"), (["Stress", "e incertezza"], 518, 606, -9, "stress")]:
            a_mano(t, righe_, cx, cy, rot, 14.5, "#FFFFFF", 19, peso=300, inclina=-9, id=f"nota-{nome}")
        for d, nome in [("M146 553q15 15 30 14", "freccia-rischio"), ("M410 590q-3 -14 8 -26", "freccia-piano"),
                        ("M494 554q-10 -2 -9 -21q8 -10 20 -10", "freccia-esami"), ("M496 664q22 4 33 -14", "freccia-stress")]:
            t.path(d, stroke="#FFFFFF", sw=1.3, id=nome)
        # centro
        t.testo("LA REALTÀ", 768, 520, 8.8, 500, "#2A3A66", "middle", spaziatura=1.6, id="etichetta-realta")
        gauge(t, 768, 630, 100, 0.82, sp=11, colore="#EF3B45", chiaro="#FF8C93", vuoto="#CBD1DE", id="misuratore-82", inizio=150, fine=30)
        t.T("82%", 768, 596, 40, 800, "#0A0F1E", "middle", id="valore-82")
        t.righe(["degli studenti che inizia senza", "preparazione adeguata"], 768, 621, 13.4, 400, "#1E2A4C", passo=16.5, ancora="middle", id="realta-testo")
        t.rich([("non supera", 800, "#0A0F1E"), (" l'OFA al primo tentativo.", 400, None)], 768, 654, 13.4, "#1E2A4C", ancora="middle", id="realta-testo-3")
        pulsante_contorno(t, 717, 671, 102, 28, "Scopri i dati", 10.5, bordo="#FFFFFF", fondo="#FFFFFF", opacita_fondo=0.95, icona="freccia-destra", id="pulsante-scopri-i-dati")
        with t.gruppo("pulsante-scorri-giu"):
            t.cerchio(769, 729, 17, fill="#7F8DAE", opacita=0.85, filtro=t.ombra(2, 6, "#1E2A4C", 0.25))
            t.icona("chevron-giu", 763, 724, 12, "#FFFFFF", 2.2)
        # a destra
        t.testo("IL TUO DOMANI", 1295, 521, 8.4, 500, "#2A3A66", spaziatura=1.5, id="etichetta-domani")
        t.righe(["Stesso punto", "di partenza."], 1295, 562, 26.5, 800, "#0A0F1E", passo=28.5, id="domani-titolo", larg=162)
        t.righe(["Più strade", "davanti a te."], 1295, 620, 26.5, 800, "#2F6EFF", passo=28.5, id="domani-titolo-blu", larg=152)

    # ------------------------------------------------------------------ come funziona
    with t.gruppo("come-funziona"):
        t.rett(0, 740, 1536, 284, 0, fill=t.sfumatura(["#FFFFFF", "#F5F8FF", "#F9FBFF"], 0, 0, 0, 1), id="fondo-sezione")
        sagome_sfondo(t, 480, 930, 1056, 94, "#E7EDFB", 0.55, 14, seme=4)
        t.testo("COME FUNZIONA", 80, 782, 8.8, 500, "#4B5C8C", spaziatura=1.6, id="etichetta-come-funziona")
        t.linea(176, 779, 190, 779, "#4B5C8C", 1)
        t.righe(["Un percorso", "su misura, in 4 passi."], 80, 828, 36, 800, NAVY, passo=35, id="titolo-sezione", larg=324)
        t.righe(["Dall'analisi iniziale al superamento,", "tutto in un'unica esperienza."], 80, 892, 16.4, 400, "#5870A8", passo=20, id="sottotitolo-sezione", larg=250)
        pulsante_contorno(t, 79, 935, 181, 36, "Scopri come funziona", 11.8, icona="freccia-destra", bordo="#C4CDE3", id="pulsante-scopri-come-funziona", peso=600)
        passi = [(525, 549, "01", "Test iniziale", ["Scopri il tuo livello", "e la probabilità di superare l'OFA."], 615),
                 (770, 791, "02", "Piano personalizzato", ["Un percorso adattato", "ai tuoi punti deboli."], 868),
                 (1027, 1051, "03", "Allenati", ["Prove reali con timer", "e correzioni dettagliate."], 1119),
                 (1268, 1293, "04", "Supera l'OFA", ["Accedi al secondo anno", "senza blocchi."], 1369)]
        for (cx, tx, num, tit, desc, mid) in passi:
            with t.gruppo(f"passo-{num}"):
                t.cerchio(cx, 777, 13, fill="#E4EDFF")
                t.T(num, cx, 781.5, 11.5, 700, BLU_BTN, "middle")
                t.T(tit, tx, 782, 13.2, 700, NAVY, id=f"passo-{num}-titolo")
                t.righe(desc, mid, 957, 12.4, 400, "#5E6E9A", passo=15.5, ancora="middle", id=f"passo-{num}-testo")
        for x in (755, 1000, 1243):
            t.linea(x, 760, x, 990, "#E3E9F6", 1, id="divisore")
        # 01 domanda
        with t.gruppo("passo-01-domanda"):
            t.vetro(543, 803, 146, 134, 12, opacita=0.96, id="card-domanda")
            t.rett(556, 811, 22, 3.5, 1.7, fill=ROSSO); t.rett(581, 811, 100, 3.5, 1.7, fill="#E6EAF2")
            t.T("Choose the correct form:", 557, 828, 7.2, 500, "#6B7794")
            t.T("She ____ to Milan", 557, 840, 8.4, 700, NAVY)
            t.T("every day.", 557, 850, 8.4, 700, NAVY)
            for i, (o, sel) in enumerate([("go", 0), ("goes", 1), ("going", 0), ("to go", 0)]):
                y = 857 + i * 17
                t.rett(555, y, 122, 14, 4, fill="#FEF0F0" if sel else "#FFFFFF", stroke="#E88A90" if sel else "#E3E8F1", sw=0.9)
                t.cerchio(563, y + 7, 3.4, fill="#FFFFFF", stroke=ROSSO if sel else "#C7CEDD", sw=1)
                if sel: t.cerchio(563, y + 7, 1.5, fill=ROSSO)
                t.T(o, 571, y + 9.6, 7, 500, NAVY)
        # 02 piano
        with t.gruppo("passo-02-piano", trasforma="rotate(-8 790 870)"):
            for i, (lab, ic) in enumerate([("Lezioni su misura", "ingranaggio"), ("Quiz mirati", "spunta"), ("Simulazioni ufficiali", "documento")]):
                y = 818 + i * 32
                t.vetro(748 + i * 4, y, 190, 28, 11, opacita=0.97, id=f"riga-{i + 1}")
                t.rett(759 + i * 4, y + 6, 17, 17, 5, fill="#E5F6EB" if i == 1 else "#EEF1F8")
                t.icona(ic, 762 + i * 4, y + 9, 11, VERDE if i == 1 else "#7C89A8", 2.4)
                t.T(lab, 783 + i * 4, y + 18, 8.2, 500, NAVY)
            t.rett(898, 826, 26, 14, 7, fill="#2FBF6B")
            t.cerchio(917, 833, 5.2, fill="#FFFFFF")
        # 03 simulazione
        with t.gruppo("passo-03-simulazione"):
            t.rett(1009, 812, 100, 108, 12, fill="#EEF2FB", opacita=0.9)
            t.rett(1115, 822, 94, 108, 12, fill="#E9EEF9", opacita=0.9)
            t.vetro(1052, 805, 140, 128, 12, opacita=1, id="card-simulazione")
            t.T("Simulazione ufficiale", 1064, 830, 8.6, 600, NAVY)
            t.icona("x", 1174, 822, 8, "#7C89A8", 2.2)
            t.icona("orologio", 1064, 838, 11, "#7C89A8", 2)
            t.T("15 min", 1079, 847, 8, 400, "#6B7794")
            t.rett(1064, 866, 118, 38, 8, fill=t.sfumatura(["#3B82FF", "#2358E8"], 0, 0, 0, 1), filtro=t.ombra(3, 8, "#2358E8", 0.25), id="pulsante-inizia-simulazione")
            t.T("Inizia simulazione", 1072, 889, 9.3, 600, "#FFFFFF")
            t.icona("freccia-destra", 1165, 881, 10, "#FFFFFF", 2.4)
        # 04 documento
        with t.gruppo("passo-04-documento"):
            t.path("M1315 905q-16 -2 -16 -16q2 -8 14 -9z", fill="#DCE5F8")
            t.rett(1310, 827, 76, 88, 12, fill="#F3F6FD", filtro=t.ombra(4, 12, "#6C8AD0", 0.25))
            t.path("M1386 835q12 -4 12 8v60q0 14 -12 14", fill="none", stroke="#DCE5F8", sw=6)
            for i, lw in enumerate((50, 50, 34)):
                t.rett(1323, 843 + i * 11, lw, 5, 2.5, fill="#BFCDEF")
            t.rett(1310, 903, 90, 12, 6, fill="#E3EAF9")
            t.path("M1305 905q-8 0 -8 8q0 8 14 8h14z", fill="#2B4FB5")
            t.cerchio(1381, 877, 20, fill=VERDE, filtro=t.ombra(3, 8, VERDE, 0.35), id="spunta-verde")
            t.icona("spunta", 1370, 866, 22, "#FFFFFF", 3.4)
            for (x1, y1, x2, y2, c) in [(1313, 817, 1320, 829, GIALLO), (1377, 827, 1384, 815, GIALLO), (1432, 818, 1424, 832, GIALLO),
                                        (1274, 842, 1286, 847, GIALLO), (1432, 896, 1442, 899, GIALLO)]:
                t.linea(x1, y1, x2, y2, c, 4.5, opacita=0.9)
            for (cx, cy, c) in [(1446, 851, ROSSO), (1296, 884, ROSSO), (1384, 818, ROSSO)]:
                t.linea(cx - 3, cy - 3, cx + 3, cy + 3, c, 4.5)
    return t


def main():
    t = costruisci()
    p = salva_landing(t, "51-landing-desktop-c", "01-landing.svg")
    print(p, p.stat().st_size // 1024, "KB")
    return p


if __name__ == "__main__":
    main()
