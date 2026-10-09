"""Immagine 25 · flusso del rischio (kit blu): home con 82 %, finestra «Come viene calcolato il tuo rischio?», elenco «Fattori che
influenzano il tuo rischio», lezione «Future tenses», «Dettaglio obiettivo», «Come cambia il tuo rischio?» e «Il tuo percorso».
Si lancia da solo: python3 g25.py

Corregge: la home è la stessa del 03 (variante a minore risoluzione, qui con la sezione «Come cambia il tuo rischio»): punti del grafico
con valori/etichette sulla stessa linea di base (nell'originale a quote diverse); il titolo «Come cambia il tuo rischio ?» aveva una
parentesi spezzata al posto dell'icona (i): ora «?» e icona; nel «Dettaglio obiettivo» i titoli delle 5 lezioni erano a x diverse
(1385..1392): allineati; le linee blu con puntini del foglio (collegamenti tra schermate) non fanno parte delle schermate e non
sono riprodotte; lo sfondo sfocato scuro delle finestre è ricostruito con forme sfocate (non c'è altro da leggere). I
connettori e le frecce del foglio sono rappresentati solo nella tavola d'insieme.
"""
import sys, math
import registro  # noqa
from comuni import *
from extra import *
from s8comp import misuratore_rischio, icona_stato

TIT = "#0B1033"
GR = "#6B7690"
BLU_T = "#2E78F2"


def titolo_info(t, testo, x, y, larg, corpo_i=8.6):
    w = T(t, testo, x, y, None, 800, TIT, larg=larg)
    info(t, x + w + 9, y - 5.5, corpo_i)


def s01():
    t = nuova("25-01-home-rischio")
    barra_stato(t, 22, 290, 22, corpo=10.5)
    logo(t, 20, 62, larg=87)
    campanella(t, 275, 58, 17)
    titolo_info(t, "Il tuo rischio OFA", 20, 99, 139)
    T(t, "Più studi, più il rischio si abbassa.", 20, 118, None, 400, GR, larg=174, id="sottotitolo")
    misuratore_rischio(t, 157, 278, 118, 0.78, 13, "#F0303B", "#FF7A7A", id="misuratore")
    T(t, "82%", 154, 260, None, 800, "#E0101E", "middle", larg=77, id="percentuale")
    T(t, "Rischio di fallimento", 154, 287, None, 700, "#E0101E", "middle", larg=131, id="misuratore-etichetta")
    T(t, "all’OFA di inglese", 154, 304, None, 400, GR, "middle", larg=88)
    with t.gruppo("avviso-rischio"):
        R(t, 18, 329, 273, 79, 12, "#FDEEEE", id="avviso-fondo")
        icona_stato(t, "alto", 45, 358, 16)
        T(t, "Rischio molto alto.", 76, 355, None, 700, TIT, larg=105)
        T(t, "Completa le lezioni consigliate", 76, 374, None, 400, GR, larg=160)
        T(t, "per ridurre il rischio.", 76, 392, None, 400, GR, larg=104)
        I(t, "chevron-destra", 277, 370, 11, "#EF4444", 2.4)
    pulsante_azione(t, 18, 418, 272, 52, "Inizia a studiare", 14, id="pulsante-primario", x_testo=80)
    T(t, "Il tuo prossimo obiettivo", 20, 507, None, 800, TIT, larg=171, id="titolo-obiettivo")
    with t.gruppo("prossimo-obiettivo"):
        R(t, 18, 526, 273, 56, 12, "#F4F7FC", id="obiettivo-fondo")
        tile_icona(t, "libro", 24, 530, 48, id="obiettivo-tile")
        T(t, "GRAMMATICA", 84, 537, None, 500, GR, larg=60)
        T(t, "Future tenses", 84, 556, None, 600, TIT, larg=82)
        t.barra(t.p(84), t.p(568.5), t.p(128), 0.25, h=t.p(6), kit="blu", id="obiettivo-barra")
        T(t, "0/5 lezioni", 273, 575, None, 400, GR, "end", larg=48)
        I(t, "chevron-destra", 281, 543, 9, "#8A94A6", 2)
    titolo_info(t, "Come cambia il tuo rischio", 20, 622, 186)
    grafico(t, [40, 151, 261], [645, 666, 679], 694, 710, 12, 9.6)
    nav(t, [("casa-contorno", "Home"), ("barre-contorno", "Simulazioni"), ("libro", "Lezioni")], 0, 740, 60, corpo=11, ico=22, y_ico=16, y_lab=43,
        indicatore=False, centri=[52, 154, 256], icone_attive={"casa-contorno": "casa"})
    return chiudi(t)


def grafico(t, xs, ys, y_val, y_et, c_val, c_et, base=None):
    """Linea rosso -> blu con tre punti e area sfumata; valori ed etichette tutti sulla stessa linea di base."""
    p = t.p
    base = base if base is not None else y_val - c_val - 10
    with t.gruppo("grafico-rischio"):
        a = t.sfumatura([(0, "#FBD5D5"), (0.5, "#E3E3FA"), (1, "#DCE8FD")], p(xs[0]), 0, p(xs[2]), 0, userspace=True)
        t.path(f"M{n(p(xs[0]))} {n(p(ys[0]))}L{n(p(xs[1]))} {n(p(ys[1]))}L{n(p(xs[2]))} {n(p(ys[2]))}L{n(p(xs[2]))} {n(p(base))}L{n(p(xs[0]))} {n(p(base))}z",
               fill=a, opacita=0.55, id="grafico-area")
        g = t.sfumatura(["#F87171", "#A78BFA", "#3B82F6"], p(xs[0]), 0, p(xs[2]), 0, userspace=True)
        t.path(f"M{n(p(xs[0]))} {n(p(ys[0]))}L{n(p(xs[1]))} {n(p(ys[1]))}L{n(p(xs[2]))} {n(p(ys[2]))}", stroke=g, sw=p(1.6), id="grafico-linea")
        L(t, xs[0], ys[0], xs[0], base, "#F6B8B8", 3)
        L(t, xs[1], ys[1], xs[1], base, "#D6DDF8", 3)
        for i, (c, cv) in enumerate((("#F0303B", "#E6121F"), ("#6C9BF2", "#5B6C92"), ("#2E78F2", "#2E78F2"))):
            C(t, xs[i], ys[i], c_val * 0.34, c, id=f"punto-{i + 1}")
            T(t, ("82%", "62%", "28%")[i], xs[i], y_val, c_val, 700 if i == 0 else 600, cv, "middle", id=f"valore-{i + 1}")
            T(t, ("Oggi", "Dopo 5 lezioni", "Dopo 15 lezioni")[i], xs[i], y_et, c_et, 400, GR, "middle", id=f"etichetta-{i + 1}")


def sfondo_sfocato(t, w, h, y_logo=65, y_nav=None):
    """Telefono dietro una finestra: scuro, con le forme (logo, barra inferiore) sfocate."""
    R(t, 0, 0, w, h, 26, "#8D94A4", id="velo-scuro")
    with t.gruppo("sfondo-sfocato"):
        with t.gruppo("sfocatura", opacita=1):
            pass
    sf = t.sfoca(t.p(3.2))
    t.add(f'<g id="app-sfocata" filter="{sf}">')
    T(t, "9:41", 30, 24, 10, 700, "#5C6577"); R(t, w - 62, 14, 28, 11, 4, "#5C6577")
    T(t, "AddiOfa", 30, y_logo, 22, 700, "#4C5C86")
    C(t, w - 38, y_logo - 6, 15, "#9DA6B8")
    if y_nav is not None:
        R(t, 0, y_nav, w, h - y_nav, 0, "#99A0AF")
        for cx, col in ((w * 0.18, "#5E86D6"), (w * 0.5, "#8A93A6"), (w * 0.82, "#8A93A6")):
            R(t, cx - 12, y_nav + 14, 24, 24, 7, col)
    t.add("</g>")


def finestra_titolo(t, x, y, w, h, r=16, id="finestra"):
    R(t, x, y, w, h, r, "#FFFFFF", id=id, filtro=t.ombra(t.p(2), t.p(14), "#0F172A", 0.18))


def riga_info(t, ic, tile_x, y_c, testi, widths, x_t, corpo=11):
    R(t, tile_x - 15, y_c - 15, 30, 30, 9, "#FFFFFF", filtro=ombra(t, 2, 8, "#2563EB", 0.10))
    I(t, ic, tile_x, y_c, 17, BLU_T, 1.8, fill_pieno=BLU_T if ic in ("barre-crescenti", "gruppo") else None)
    for j, (tx, w) in enumerate(zip(testi, widths)):
        T(t, tx, x_t, y_c + 0.5 + (j - 0.5) * 18.5 + 4.5 - 0.5, None, 400, "#5B6580", larg=w)


def s02():
    t = nuova("25-02-come-viene-calcolato")
    sfondo_sfocato(t, t.W, t.H, y_nav=548)
    ox, oy = 4, 107
    finestra_titolo(t, ox, oy, 281, 393, 18, id="finestra-rischio")
    T(t, "Come viene calcolato", ox + 24, oy + 35, None, 700, TIT, larg=159, id="titolo-1")
    T(t, "il tuo rischio?", ox + 24, oy + 58, None, 700, TIT, larg=104, id="titolo-2")
    info(t, ox + 139, oy + 51, 8.4)
    I(t, "x", ox + 248, oy + 30, 12, "#46506E", 1.8, id="chiudi")
    T(t, "Il rischio di fallimento è una stima basata su:", ox + 24, oy + 92, None, 400, "#5B6580", larg=227, id="introduzione")
    righe = (("barre-crescenti", ["Il tuo livello attuale", "nei diversi argomenti"], [100, 111], 135),
             ("gruppo", ["Le prestazioni di altri studenti", "con un livello simile"], [164, 103], 199),
             ("documento", ["La difficoltà dell’esame", "e il numero di domande"], [122, 127], 264))
    for ic, tx, ws, yc in righe:
        with t.gruppo(f"fattore-{ic}"):
            R(t, ox + 33, oy + yc - 15, 30, 30, 9, "#FFFFFF", filtro=ombra(t, 2, 8, "#2563EB", 0.10))
            I(t, ic, ox + 48, oy + yc, 20, BLU_T, 2.4, fill_pieno=BLU_T if ic != "documento" else None)
            for j, (s_, w) in enumerate(zip(tx, ws)):
                T(t, s_, ox + 80, oy + yc - 4.5 + j * 18.5 + 4, None, 400, "#5B6580", larg=w)
    with t.gruppo("nota-lezioni"):
        R(t, ox + 20, oy + 307, 241, 60, 11, "#EEF3FC", id="nota-fondo")
        t.path(f"M{n(t.p(ox + 36))} {n(t.p(oy + 337))}a6 6 0 0 1 10-3M{n(t.p(ox + 47))} {n(t.p(oy + 336))}l-1.5 3.5-3-2.5M{n(t.p(ox + 45))} {n(t.p(oy + 341))}a6 6 0 0 1-9 2",
               stroke=BLU_T, sw=t.p(1.8), id="nota-icona")
        T(t, "Più completi le lezioni e migliori", ox + 64, oy + 333, None, 400, "#3F4C6B", larg=168)
        T(t, "nei test, più il rischio si abbassa.", ox + 64, oy + 351, None, 400, "#3F4C6B", larg=169)
    return chiudi(t)


def s03():
    t = nuova("25-03-fattori")
    W, dy = t.W, 59
    R(t, 0, 0, W, 60, 22, "#8D94A4", id="velo-scuro", r_angoli=(22, 22, 0, 0)) if False else R(t, 0, 0, W, t.H, 22, "#8D94A4", id="velo-scuro")
    sf = t.sfoca(t.p(3))
    t.add(f'<g id="app-sfocata" filter="{sf}">')
    T(t, "9:41", 22, 20, 9, 700, "#5C6577"); T(t, "AddiOfa", 20, 42, 17, 700, "#4C5C86")
    t.add("</g>")
    R(t, 0, 55, W, t.H - 55, 0, "#FFFFFF", id="finestra-fattori", r_angoli=(20, 20, 22, 22))
    T(t, "Fattori che influenzano", 19, dy + 28, None, 700, TIT, larg=148, id="titolo-1")
    T(t, "il tuo rischio", 19, dy + 48, None, 700, TIT, larg=94, id="titolo-2")
    I(t, "x", 205, dy + 23, 12, "#46506E", 1.8, id="chiudi")
    fatt = (("Grammatica", "libro-pieno", 59, ["Influisce molto: è la parte più", "frequente nell’esame."], 0.33, ("#F04A55", "#FF8A8F"), 92),
            ("Comprensione", "cuffie", 71, ["Molto importante per il punteggio", "totale."], 0.52, ("#F04A55", "#FF8A8F"), 183),
            ("Vocabolario", "Aa", 63, ["Ti aiuta a rispondere più velocemente", "e con più precisione."], 0.69, ("#F5A623", "#FFD98A"), 273),
            ("Ragionamento", "ingranaggio", 76, ["Serve per le domande più complesse."], 0.61, ("#F97316", "#FDBA74"), 368))
    for nome, ic, wn, righe, v, (c, ch), yc in fatt:
        with t.gruppo(f"fattore-{nome.lower()}"):
            s8.icona_fattore(t, "libro" if ic == "libro-pieno" else ic, 37.5, dy + yc, 30)
            T(t, nome, 66, dy + yc - 7, None, 600, TIT, larg=wn)
            for j, r_ in enumerate(righe):
                T(t, r_, 66, dy + yc + 11 + j * 15.3, 9.2, 400, "#6B7690")
            yb = dy + yc + 11 + (len(righe) - 1) * 15.3 + 14
            R(t, 66, yb, 137, 7, 3.5, "#E9EDF4"); R(t, 66, yb, 137 * v, 7, 3.5, t.sfumatura([ch, c], 0, 0, 1, 0))
    return chiudi(t)


def s04():
    t = nuova("25-04-lezione-future-tenses")
    barra_stato(t, 20, 208, 18, corpo=7.8)
    indietro(t, 19, 43, 11, "#111827")
    T(t, "Grammatica", 111, 47, None, 600, TIT, "middle", larg=62, id="titolo")
    for i in range(5):
        R(t, 14.5 + i * 39, 66, 37, 3, 1.5, "#EAEEF5", id=f"avanzamento-{i + 1}")
    R(t, 14.5, 66, 19, 3, 1.5, BLU_T, id="avanzamento-pieno")
    tile_icona(t, "libro", 76, 115, 70, id="lezione-tile", sw=1.7)
    T(t, "Future tenses", 111, 220, None, 800, TIT, "middle", larg=105, id="lezione-titolo")
    righe_t(t, ["Impara e pratica i tempi futuri", "più comuni."], 111, 245, 10.6, 18, 400, GR, "middle", larg=[158, 63], id="lezione-testo")
    for i, (tx, w, yc) in enumerate((("Spiegazioni semplici", 99, 300), ("Esempi pratici", 69, 327), ("Esercizi interattivi", 86, 355.6))):
        with t.gruppo(f"punto-{i + 1}"):
            R(t, 33, yc - 6, 12, 12, 3.4, "#E7F0FD")
            R(t, 36.5, yc - 2.5, 5, 5, 1.2, "none", stroke=BLU_T, sw=1.2)
            T(t, tx, 59, yc + 3.5, None, 400, "#5B6580", larg=w)
    pulsante_blu(t, 14, 404, 193, 48, "Inizia la lezione", 11.4, r=12, larg=95, freccia=True, x_testo=31, id="pulsante-primario")
    # etichetta a sinistra, freccia a destra
    return chiudi(t)


def s05():
    t = nuova("25-05-dettaglio-obiettivo")
    barra_stato(t, 24, 305, 21, corpo=8.8)
    indietro(t, 22, 49, 12, "#111827")
    T(t, "Dettaglio obiettivo", 153, 52.5, None, 600, TIT, "middle", larg=100, id="titolo")
    tile_icona(t, "libro", 20, 80, 61, id="obiettivo-tile")
    T(t, "Grammatica", 100, 100, None, 500, "#3B4560", larg=71.5)
    T(t, "Future tenses", 100, 121, None, 700, TIT, larg=95)
    t.barra(t.p(100), t.p(147.5), t.p(120), 0.19, h=t.p(6.5), kit="blu", id="obiettivo-barra")
    T(t, "0 / 5 lezioni", 303, 155, None, 400, GR, "end", larg=63)
    for i, (tx, tm, w) in enumerate((("Introduzione", "5 min", 65), ("Will", "8 min", 22), ("Going to", "8 min", 47), ("Present continuous", "8 min", 110), ("Esercizi finali", "10 min", 66))):
        yc = 198 + i * 41.8
        with t.gruppo(f"lezione-{i + 1}"):
            C(t, 32.5, yc, 11.5, "#EAF1FD", id="numero-fondo")
            T(t, str(i + 1), 32.5, yc + 4.6, 12.6, 600, BLU_T, "middle")
            T(t, tx, 64, yc + 4.3, None, 500, TIT, larg=w)
            T(t, tm, 275, yc + 4, None, 400, "#8A94AB", "end", larg=len(tm) * 4.9)
            I(t, "chevron-destra", 297, yc, 11, "#2A3350", 2)
    pulsante_blu(t, 17.5, 403, 286.5, 47, "Inizia la prima lezione", 12, r=12, larg=137, id="pulsante-primario")
    return chiudi(t)


def s06():
    t = nuova("25-06-come-cambia-rischio")
    barra_stato(t, 21, 333, 20, corpo=9.5)
    w = T(t, "Come cambia il tuo rischio?", 21, 56, None, 700, TIT, larg=216, id="titolo")
    info(t, 21 + w + 12, 50, 8.4)
    I(t, "x", 324, 50, 13, "#46506E", 1.8, id="chiudi")
    righe_t(t, ["Il grafico mostra una stima di come il tuo", "rischio potrebbe diminuire man mano", "che completi le lezioni consigliate."], 24, 86, 11.6, 18.7, 400, GR,
            larg=[229, 219, 198], id="testo")
    grafico(t, [40, 169, 296], [156, 179, 193.5], 214, 233, 13, 10.4, base=200)
    with t.gruppo("nota-stima"):
        R(t, 24, 266, 302, 98, 12, "#F3F6FC", id="nota-fondo")
        I(t, "barre-crescenti", 54, 296, 26, BLU_T, 2.4, fill_pieno=BLU_T)
        T(t, "Perché è solo una stima?", 86.5, 291, None, 700, TIT, larg=143)
        righe_t(t, ["La riduzione del rischio dipende dal tuo", "impegno, dai risultati nei quiz e dalla tua", "costanza nello studio."], 86.5, 311, 10.4, 18.5, 400, GR,
                larg=[208, 213, 115], id="nota-testo")
    return chiudi(t)


def s07():
    t = nuova("25-07-il-tuo-percorso")
    barra_stato(t, 24, 355, 20, corpo=9.5)
    indietro(t, 23, 47, 12, "#111827")
    T(t, "Il tuo percorso", 179, 51, None, 600, TIT, "middle", larg=84.5, id="titolo")
    righe_t(t, ["Se completi le lezioni consigliate,", "il tuo rischio può scendere così:"], 20.5, 101, 14.5, 21, 400, GR, larg=[216, 207], id="testo")
    grafico(t, [43.5, 173, 328], [160, 195.6, 234], 259, 278, 15.5, 12, base=244)
    with t.gruppo("obiettivo-20"):
        R(t, 20.5, 316, 334.5, 85, 12, "#F3F6FC", id="obiettivo-fondo")
        I(t, "bersaglio-freccia", 51, 348, 32, BLU_T, 2.2, id="obiettivo-icona")
        T(t, "Obiettivo: sotto il 20%", 86, 341, None, 700, TIT, larg=134)
        T(t, "Con un rischio inferiore al 20% aumenti", 86, 363.5, None, 400, GR, larg=215)
        T(t, "notevolmente le probabilità di superare l’OFA.", 86, 382.5, None, 400, GR, larg=249)
    return chiudi(t)


if __name__ == "__main__":
    for f in (s01, s02, s03, s04, s05, s06, s07):
        f()
