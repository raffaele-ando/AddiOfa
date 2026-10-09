"""
Landing desktop B (immagine 45): "Oltre l'OFA, un passo in più." con quattro telefoni nell'hero, fascia dei vantaggi,
"Più di un semplice quiz", quattro card, dato 82 %, pannello "Il tuo futuro" (foto) e CTA con store.

Un SVG a pagina intera (viewBox 1440 x 960) con le sezioni come gruppi: hero, vantaggi, perche-addiofa, dati-reali,
pannello-futuro, cta-store. Raster: solo le tre fotografie (hero, edificio del Politecnico, tile con stella nel cielo), ripulite
da testi e interfaccia con foto.py; tutto il resto è vettoriale.
Corregge: menu "Prezz" -> "Prezzi"; tab dei telefoni illeggibili -> Home/Studio/Statistiche (testo ricostruito); schermate dei
telefoni ridisegnate dal kit (Sei a rischio? / Domanda 3 di 10 / Obiettivo raggiunto!); il resto del testo è letto dall'originale.
"""
from componenti import *  # noqa
from componenti import Pagina, NAVY, BLU, BLU_BTN, TESTO, SOTTO, PALLIDO


def costruisci() -> Pagina:
    t = Pagina("landing-b", fondo="#FCFDFF")
    # ------------------------------------------------------------------ fondo pagina
    t.rett(0, 0, W, H, 0, fill=t.sfumatura(["#FFFFFF", "#F7FAFF", "#FFFFFF"], 0, 0, 0, 1), id="sfondo-pagina")

    # ------------------------------------------------------------------ hero: foto + velo bianco a sinistra
    with t.gruppo("hero"):
        t.foto_in("45-hero.jpg", 420, 0, 1116, 478, 0, id="foto-hero-arco-stella")
        t.defs.append('<linearGradient id="velo-hero" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FCFDFF" stop-opacity="1"/>'
                      '<stop offset="0.55" stop-color="#FCFDFF" stop-opacity="0.9"/><stop offset="1" stop-color="#FCFDFF" stop-opacity="0"/></linearGradient>')
        t.rett(420, 0, 150, 478, 0, fill="url(#velo-hero)", id="velo-sinistro")
        t.rett(0, 0, 421, 478, 0, fill="#FCFDFF", id="fondo-testo")
        # fascia alta di mistura sopra la foto per il menu
        # ---- navigazione
        with t.gruppo("navigazione"):
            logo_orizzontale(t, 45, 11, 38, id="logo-addiofa")
            for i, (voce, x) in enumerate([("Home", 273.5), ("Funzionalità", 348.5), ("Come funziona", 445.5), ("Prezzi", 527), ("FAQ", 586)]):
                t.testo(voce, x, 32, 12.2, 600 if i == 0 else 500, NAVY if i == 0 else "#2E3A66", "middle", id="menu-" + voce.lower().replace(" ", "-"))
            t.rett(259, 38, 29, 2, 1, fill=BLU, id="menu-attivo")
            with t.gruppo("pulsante-scarica-app"):
                t.rett(1371, 11, 125, 34, 17, fill="#FFFFFF", opacita=0.97, filtro=t.ombra(4, 12, "#3355AA", 0.18))
                t.testo("Scarica l'app", 1393, 32, 11.6, 600, BLU_BTN)
                t.icona("freccia-destra", 1468, 21, 12, BLU_BTN, 2.4)
        # ---- testi
        chip_etichetta(t, 45, 87, 257, 30, "PER GLI STUDENTI DEL POLITECNICO DI MILANO", 9.4, id="etichetta-politecnico", sp=0.7)
        t.T("Oltre l'OFA,", 45, 180, 70, 800, NAVY, larg=356, id="titolo-riga-1")
        t.T("un passo in più.", 45, 243, 70, 800, BLU, larg=470, id="titolo-riga-2")
        t.righe(["AddiOFA ti aiuta a superare l'OFA di inglese", "con un percorso personalizzato, evitando rischi,",
                 "costi e blocchi del tuo piano di studi."], 45, 281, 17, 400, "#3A4668", passo=22.3, id="sottotitolo", larg=334)
        pulsante_pieno(t, 45, 352, 178, 44, "Inizia ora", 15.5, fondo="#2F72F8", id="pulsante-inizia-ora")
        pulsante_contorno(t, 236, 353, 162, 42, "Scopri come funziona", 13, id="pulsante-scopri", bordo="#E3E8F4", opacita_fondo=1)
        avatar_gruppo(t, 59, 436, 12.6, 17.5, AVATAR_45)
        t.rich([("Già ", 400, None), ("12.000+", 700, NAVY), (" studenti si stanno preparando", 400, None)], 140, 433, 12.2, "#3A4668", id="prova-sociale-1")
        t.T("con AddiOFA", 140, 449, 12.2, 400, "#3A4668", id="prova-sociale-2")

        # ---- bolle flottanti + telefoni
        with t.gruppo("telefoni-app"):
            telefono(t, 962, 150, 104, 270, schermo_piano, rot=-1.2, id="telefono-piano-di-studio")
            telefono(t, 1340, 185, 143, 266, schermo_obiettivo, rot=1.5, id="telefono-obiettivo")
            telefono(t, 1215, 111, 144, 322, schermo_domanda, rot=1.5, id="telefono-domanda")
            telefono(t, 1044, 66, 178, 381, schermo_rischio, rot=0, id="telefono-rischio")
        with t.gruppo("bolle-funzionalita"):
            bolla(t, 941, 108, 112, 37, "Quiz interattivi", "scudo", 11.6, coda="dx", rot=-4)
            bolla(t, 884, 214, 138, 34, "Simulazioni realistiche", "documento", 11.4, rot=-5)
            bolla(t, 917, 300, 118, 34, "Piano di studio", "calendario", 11.4, rot=-4)
            bolla(t, 1241, 52, 126, 38, "Analisi del livello", "grafico", 11.4, coda="sx")
            bolla(t, 1389, 123, 98, 36, "Statistiche", "grafico", 11.4)

    # ------------------------------------------------------------------ fascia vantaggi
    with t.gruppo("vantaggi"):
        t.rett(12, 478, 1510, 76, 26, fill="#FFFFFF", opacita=0.82, filtro=t.ombra(-2, 16, "#4A6AB8", 0.10), id="fascia-vantaggi")
        voci = [("scudo", 202, 236, "Evita il rischio", "di non superare l'OFA", None),
                ("euro", 503, 543, "Non perdere", "i circa ", "30€"),
                ("lucchetto", 858, 899, "Sblocca il tuo", "piano di studi", None),
                ("grafico", 1135, 1176, "Un percorso su misura", "per il tuo livello", None)]
        for ic, cx, tx, a, b, bold in voci:
            icona_tonda(t, ic, cx, 516, 24, "#E8EFFD", BLU_BTN, 2.1, id=f"vantaggio-icona-{ic}")
            t.T(a, tx, 513, 13.6, 600, NAVY, id=f"vantaggio-{ic}-titolo")
            if bold:
                t.rich([(b, 400, None), (bold, 800, NAVY), (" di tasse aggiuntive", 400, None)], tx, 531, 13.6, "#26325E")
            else:
                t.T(b, tx, 531, 13.6, 400, "#26325E", id=f"vantaggio-{ic}-testo")

    # ------------------------------------------------------------------ Perché AddiOFA
    with t.gruppo("perche-addiofa"):
        chip_etichetta(t, 48, 574, 110, 20, "PERCHÉ ADDIOFA", 8.6, id="etichetta-perche", sp=0.5)
        t.T("Più di un semplice quiz.", 50, 642, 40, 800, NAVY, larg=420, id="titolo-sezione")
        t.T("Un sistema completo per farti arrivare preparato.", 50, 674, 20, 400, "#4A5878", larg=438, id="sottotitolo-sezione")
        schede = [("grafico", "#E4EDFF", BLU_BTN, "Test iniziale", ["Scopri il tuo livello", "e la probabilità", "di superare l'OFA."]),
                  ("bersaglio", "#FDE4E6", "#E8293A", "Percorso personalizzato", ["Lezioni e quiz mirati", "sui tuoi punti deboli."]),
                  ("documento", "#DDF4E4", "#22A559", "Simulazioni realistiche", ["Prove complete come", "l'esame ufficiale."]),
                  ("fiamma", "#FFF0C9", "#F2A100", "Spiegazioni chiare", ["Teoria, esempi e", "consigli pratici."])]
        xs = [47, 224, 403, 584]
        for (ic, fondo, col, tit, desc), x in zip(schede, xs):
            with t.gruppo("scheda-" + tit.lower().replace(" ", "-")):
                t.rett(x, 696, 168, 145, 22, fill="#F6F9FF", opacita=0.9, filtro=t.ombra(3, 14, "#5A78C8", 0.09))
                t.rett(x + 12, 708, 42, 42, 12, fill=fondo)
                if ic == "grafico":
                    for j, hh in enumerate((10, 16, 22)):
                        t.rett(x + 22 + j * 8, 740 - hh, 6, hh, 2, fill=col)
                elif ic == "fiamma":
                    t.icona("stella4", x + 20, 716, 26, col, 1.6, fill_pieno="#FFD36B")
                    t.cerchio(x + 33, 730, 9, fill="#FFD36B", stroke=col, sw=2)
                    t.linea(x + 30, 741, x + 36, 741, col, 2.2)
                else:
                    t.icona(ic, x + 21, 717, 24, col, 2.2, fill_pieno=(fondo if ic == "documento" else None) if ic != "bersaglio" else None)
                t.T(tit, x + 14, 771, 14.4, 700, NAVY, id="scheda-titolo")
                t.righe(desc, x + 14, 789, 12.6, 400, SOTTO, passo=16.3, id="scheda-testo")

    # ------------------------------------------------------------------ dati reali
    with t.gruppo("dati-reali"):
        t.rett(15, 853, 742, 155, 28, fill="#F4F7FE", opacita=0.95, id="pannello-dati")
        anello(t, 124, 931, 56, 0.82, 13, id="anello-82")
        t.T("82%", 124, 942, 32, 700, BLU_SC, "middle", id="valore-82")
        chip_etichetta(t, 219, 874, 72, 19, "DATI REALI", 8.2, id="etichetta-dati", freccia_=False, sp=0.5)
        t.T("Molti studenti partono a rischio.", 219, 919, 21.5, 800, NAVY, larg=310, id="dati-titolo")
        t.righe(["In base alle nostre analisi, l'82% degli studenti", "che inizia senza preparazione adeguata",
                 "non supera l'OFA al primo tentativo."], 219, 945, 13.4, 400, "#4A5878", passo=19.8, id="dati-testo", larg=262)

    # ------------------------------------------------------------------ pannello "Il tuo futuro"
    with t.gruppo("pannello-futuro"):
        t.foto_in("45-futuro.jpg", 778, 565, 740, 247, 22, id="foto-politecnico")
        t.righe(["Il tuo futuro", "non si ferma a un esame."], 817, 622, 27, 700, "#FFFFFF", passo=28, id="futuro-titolo", larg=232)
        t.righe(["Superare l'OFA ti permette di accedere", "al secondo anno, sostenere gli esami",
                 "e costruire senza ostacoli il tuo percorso", "al Politecnico di Milano."], 817, 681, 15.6, 400, "#FFFFFF", passo=20.7,
                id="futuro-testo", larg=251)
        with t.gruppo("pulsante-freccia"):
            t.cerchio(836, 775, 18, fill="#1E2235", opacita=0.85, stroke="#FFFFFF", sw=0.8)
            t.icona("freccia-destra", 828, 767, 16, "#FFFFFF", 2.2)

    # ------------------------------------------------------------------ CTA store
    with t.gruppo("cta-store"):
        t.foto_in("45-cta.jpg", 778, 823, 740, 183, 22, id="foto-tile-stella")
        t.righe(["Inizia oggi.", "Sblocca il tuo domani."], 817, 861, 22, 700, "#FFFFFF", passo=26, id="cta-titolo", larg=210)
        t.righe(["Un piccolo passo ora, per un percorso universitario", "senza ostacoli."], 817, 912, 12.2, 400, "#F2F6FF", passo=15.6, id="cta-testo", larg=262)
        for i, (x, w_, p1, p2) in enumerate([(817, 111, "Scarica su", "App Store"), (937, 112, "Disponibile su", "Google Play")]):
            with t.gruppo("badge-" + p2.lower().replace(" ", "-")):
                t.rett(x, 946, w_, 38, 9, fill="#0B0B10", stroke="#7C8296", sw=0.9)
                if i == 0:
                    t.path("M840 971c-3-2.400-3.200-6.400-1-9 1.500-1.800 3.800-1.500 4.700-1.500 1 0 2-.7 3.500-.2-1.800 1-2.500 2.700-2.500 4.200 0 2 1 3.200 2.600 3.900-.9 2.400-2.700 4.600-4.500 4.600-1 0-1.200-.6-2.800-.6z"
                           .replace("840", str(x + 14)), fill="#FFFFFF", id="icona-apple")
                else:
                    t.path(f"M{x + 12} 955l16 11-16 12z", fill="#34A853")
                    t.path(f"M{x + 12} 955l11 8-3 3z", fill="#4285F4")
                    t.path(f"M{x + 12} 978l11-8-3-4z", fill="#EA4335")
                    t.path(f"M{x + 23} 963l5 3-5 3-3-3z", fill="#FBBC04")
                t.T(p1, x + 36, 960, 7.8, 400, "#FFFFFF")
                t.T(p2, x + 36, 976, 13.5, 600, "#FFFFFF", larg=(w_ - 48) if i == 1 else 60)
        # scritta a mano della foto (rifatta: Inter inclinato; testo letto dall'originale)
        with t.gruppo("scritta-stessa-partenza", trasforma="rotate(-12 1455 930) skewX(-10)"):
            for j, r in enumerate(["Stessa", "partenza.", "Più possibilità."]):
                t.T(r, 1436 + (2 - j) * 0 + j * 7.5, 905 + j * 21, 15, 500, "#2B4C9E", id=f"mano-{j + 1}")
    return t


def main():
    t = costruisci()
    p = salva_landing(t, "45-landing-desktop-b", "01-landing.svg")
    print(p, p.stat().st_size // 1024, "KB")
    return p


if __name__ == "__main__":
    main()
