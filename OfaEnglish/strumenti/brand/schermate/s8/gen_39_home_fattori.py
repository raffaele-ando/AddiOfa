"""Immagine 39 (home 'fattori': rischio + 'Fattori che influenzano il tuo rischio', obiettivo, prossima lezione, streak, progressi).
Originale 738x1672. Corregge: tile delle icone con ombra uniforme, 'Aa' costruito con testo vero, mini grafico a barre regolare,
cerchietto progresso con arco pulito. Testi tutti leggibili nell'originale (nessuna ricostruzione)."""
import sys, pathlib, math
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *

CART = "39-home-fattori"
ORIG = CONCEPT / CART / "001-schermata.png"
W, H = 738, 1672


def fattore_compatto(t, x_tile, y, nome, icona, valore, x_testo, w_barra, x_pct, larg_nome):
    c, ch = colore_fattore(valore)
    with t.gruppo(f"fattore-{nome.lower()}"):
        icona_fattore(t, icona, x_tile + 27, y, 54)
        T(t, nome, x_testo, y - 10, larg=larg_nome, peso=500, colore="#1F2937")
        barra_fattore(t, x_testo, y + 7, w_barra, valore, 10, c, ch)
        T(t, f"{round(valore * 100)}%", x_pct, y + 16, larg=30, peso=600, colore="#4B5A7A", ancora="end")
        I(t, "chevron-destra", x_pct + 20, y, 28, "#7A869C", 2)


def anello(t, cx, cy, r, frazione, sw, col_pieno, col_vuoto):
    with t.gruppo("anello-obiettivo"):
        C(t, cx, cy, r, "none", stroke=col_vuoto, sw=sw)
        a0 = -math.pi / 2
        a1 = a0 + 2 * math.pi * frazione
        p = t.p
        d = f"M{n(p(cx))} {n(p(cy - r))}A{n(p(r))} {n(p(r))} 0 0 1 {n(p(cx + r * math.cos(a1)))} {n(p(cy + r * math.sin(a1)))}"
        t.path(d, stroke=col_pieno, sw=p(sw))


def schermata():
    s = STATI["alto"]
    t = nuova(W, H, id="home-fattori")
    barra_stato(t, 54, 692, 40, corpo=21)
    logo(t, 55, 101, larg=145)
    campanella(t, 670, 89, 28)

    # --- card rischio
    with t.gruppo("card-rischio"):
        R(t, 18, 135, 702, 625, 30, "#FFFFFF", id="card-rischio-fondo", filtro=ombra(t, 4, 18, "#2563EB", 0.06))
        T(t, "Il tuo rischio OFA", 58, 183, larg=225, peso=700, id="titolo")
        info(t, 308, 171, 11)
        T(t, "Più studi, più il rischio si abbassa.", 58, 211, larg=297, peso=400, colore="#66708F", id="sottotitolo")
        with t.gruppo("variazione-stima"):
            R(t, 553, 160, 137, 100, 18, "#E9F8F0", id="variazione-fondo")
            I(t, "freccia-giu", 581, 190, 28, "#16A765", 2.6)
            T(t, "-28%", 606, 198, larg=56, peso=700, colore="#0B1033")
            T(t, "Rispetto alla", 606, 221, larg=66, peso=400, colore=GRIGIO)
            T(t, "prima stima", 606, 238, larg=64, peso=400, colore=GRIGIO)
        misuratore_rischio(t, 369, 490, 218, 0.749, 38, s["colore"], s["chiaro"], vuoto=s["vuoto"], alone=s["alone"])
        T(t, "82%", 369, 443, larg=132, peso=800, colore=s["num"], ancora="middle", id="percentuale")
        T(t, "Rischio di fallimento", 369, 481, larg=198, peso=600, colore=s["etichetta"], ancora="middle")
        T(t, "all'OFA di inglese", 368, 507, larg=133, peso=400, colore="#66708F", ancora="middle")
        avviso(t, 56, 538, 627, 103, "alto", "Rischio molto alto.",
               ["Con il tuo livello attuale potresti non superare l'OFA.", "Inizia a studiare per ridurre il rischio."],
               18, 17.5, 154, 571, 26, r=20, r_icona=26, x_icona=103, col_riga="#66708F", larg_righe=[404, 277], larg_titolo=162)
        pulsante_azione(t, 56, 656, 627, 82, "Inizia a studiare", 23, r=18, x_testo=167, peso=500)

    # --- fattori
    with t.gruppo("card-fattori"):
        R(t, 18, 775, 702, 215, 28, "#FFFFFF", id="card-fattori-fondo", filtro=ombra(t, 3, 14, "#2563EB", 0.05))
        titolo_sezione(t, "Fattori che influenzano il tuo rischio", 58, 808, larg=346, info_=True, peso=600)
        fattore_compatto(t, 55, 861, "Grammatica", "libro", 0.20, 127, 150, 321, 86)
        fattore_compatto(t, 55, 936, "Vocabolario", "Aa", 0.45, 127, 150, 321, 83)
        fattore_compatto(t, 392, 861, "Comprensione", "cuffie", 0.35, 465, 150, 660, 106)
        fattore_compatto(t, 392, 936, "Ragionamento", "ingranaggio", 0.50, 465, 150, 660, 103)

    # --- obiettivo
    with t.gruppo("card-obiettivo"):
        R(t, 32, 999, 670, 113, 26, "#E6F7EE", id="card-obiettivo-fondo")
        C(t, 86, 1049, 26, "#FFFFFF", filtro=ombra(t, 2, 8, "#16A765", 0.12))
        I(t, "bersaglio-freccia", 86, 1049, 38, "#12A56A", 2.8)
        T(t, "Il tuo obiettivo", 138, 1036, larg=122, peso=600, id="obiettivo-titolo")
        T(t, "Riduci il rischio sotto il 20% per essere sicuro", 138, 1061, larg=328, peso=400, colore="#66708F")
        T(t, "di superare l'OFA.", 138, 1086, larg=129, peso=400, colore="#66708F")
        anello(t, 581, 1051, 43, 0.22, 7, "#12A56A", "#CFEFE0")
        T(t, "20%", 581, 1059, larg=43, peso=700, colore="#0B1033", ancora="middle")
        T(t, "obiettivo", 581, 1076, larg=44, peso=400, colore=GRIGIO, ancora="middle")
        I(t, "chevron-destra", 668, 1054, 28, "#12A56A", 2.2)

    # --- prossima lezione
    with t.gruppo("card-prossima-lezione"):
        R(t, 24, 1125, 678, 203, 26, "#FFFFFF", id="card-lezione-fondo", filtro=ombra(t, 3, 14, "#2563EB", 0.06))
        tile_icona(t, "documento", 58, 1148, 50, id="lezione-tile", sw=1.8)
        T(t, "Prossima lezione consigliata", 132, 1165, larg=219, peso=600, id="lezione-etichetta")
        T(t, "Future tenses: will, going to, present continuous", 132, 1194, larg=402, peso=600, id="lezione-titolo")
        T(t, "Completa questa lezione per ridurre il rischio stimato", 132, 1219, larg=381, peso=400, colore="#66708F")
        T(t, "del 6%.", 132, 1241, larg=53, peso=400, colore="#66708F")
        R(t, 577, 1159, 106, 62, 16, "#EEF7F3", id="riduzione-stimata")
        T(t, "-6%", 628, 1197, larg=39, peso=700, colore="#0E9F63", ancora="middle")
        T(t, "rischio stimato", 630, 1215, larg=75, peso=400, colore=GRIGIO, ancora="middle")
        with t.gruppo("pulsante-lezione"):
            R(t, 55, 1261, 628, 57, 15, t.sfumatura(["#2F7BF6", "#1D6BF2"], 0, 0, 1, 0), filtro=t.ombra(t.p(3), t.p(9), "#2563EB", 0.2))
            C(t, 92, 1290, 16, "#FFFFFF")
            I(t, "play", 93, 1290, 22, "#1D6BF2", 1.2)
            T(t, "Inizia la lezione", 130, 1297, larg=147, peso=500, colore="#FFFFFF")
            I(t, "orologio", 560, 1289, 22, "#FFFFFF", 2)
            T(t, "10 min", 579, 1296, larg=47, peso=400, colore="#FFFFFF")
            I(t, "chevron-destra", 654, 1290, 24, "#FFFFFF", 2.2)

    # --- streak e progressi
    with t.gruppo("card-streak"):
        R(t, 32, 1355, 337, 112, 24, "#F5F8FD", id="card-streak-fondo")
        I(t, "fiamma", 74, 1381, 36, "#F97316", 1.2)
        T(t, "Streak di studio", 109, 1377, larg=100, peso=400, colore="#66708F")
        T(t, "3 giorni", 109, 1405, larg=72, peso=700, id="streak-giorni")
        I(t, "chevron-destra", 335, 1381, 28, "#6B7280", 2)
        for i in range(6):
            cx = 122 + i * 34
            if i < 3:
                C(t, cx, 1438, 14, "#1D6BF2")
                I(t, "spunta", cx, 1438, 16, "#FFFFFF", 3.2)
            else:
                C(t, cx, 1438, 14, "#E8ECF6")
    with t.gruppo("card-progressi"):
        R(t, 377, 1355, 325, 112, 24, "#F5F8FD", id="card-progressi-fondo")
        I(t, "barre-crescenti", 418, 1383, 32, "#1D6BF2", 1.2)
        T(t, "I tuoi progressi", 458, 1377, larg=95, peso=400, colore="#66708F")
        T(t, "12 lezioni", 458, 1405, larg=84, peso=700, id="progressi-lezioni")
        I(t, "chevron-destra", 678, 1381, 28, "#6B7280", 2)
        spec = [(7, "#9DC0F9"), (11, "#9DC0F9"), (15, "#2E78F2"), (18, "#A9C8FA"), (22, "#A9C8FA"), (26, "#A9C8FA"), (31, "#2E78F2"), (40, "#2E78F2"), (55, "#D3DAE8")]
        with t.gruppo("mini-grafico-progressi"):
            for i, (hh, c) in enumerate(spec):
                R(t, 458 + i * 21.5, 1448 - hh, 14, hh, 4, c)

    # --- citazione
    with t.gruppo("citazione"):
        R(t, 32, 1478, 670, 74, 22, "#EDF2FA", id="citazione-fondo")
        T(t, "“", 66, 1535, 70, 700, "#8A9BC2", id="citazione-virgolette")
        T(t, "Ogni lezione ti avvicina a un rischio più basso", 119, 1509, larg=352, peso=400, colore="#4B5A7A")
        T(t, "e a un anno universitario senza blocchi.", 119, 1533, larg=306, peso=400, colore="#4B5A7A")
        I(t, "chevron-destra", 669, 1509, 28, "#6B7280", 2)

    nav_home3(t, 0, 1575, 97, corpo=19, ico=50, indicatore=False, y_ico=34, y_lab=75)
    return t


if __name__ == "__main__":
    t = schermata()
    svg = salva(t, CART, "001-home-fattori.svg")
    if vuole_tavola():
        controlla(svg, ORIG, "39-home-fattori", 1.0)
