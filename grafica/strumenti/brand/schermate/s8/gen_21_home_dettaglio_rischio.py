"""Immagine 21 (home dettaglio rischio: misuratore, avviso, 'Fattori principali', 'Come ridurre il rischio?', 'Il tuo percorso').
Originale 625x1655. Corregge: la terza card dei consigli e' tagliata dal bordo (scorrimento orizzontale: resta tagliata, e'
una scelta di design, ma il testo tagliato e' ricostruito: 'Studia le aree deboli / Concentrati sugli argomenti in cui hai
piu' difficolta.' = testo ricostruito); il percorso e' reso come una linea con tre punti (nell'originale i punti hanno
stili diversi senza motivo: pieno / vuoto / vuoto = oggi / futuro / futuro, qui mantenuto ma con lo stesso diametro)."""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *
from ui import clip_rett

CART = "21-home-dettaglio-rischio"
ORIG = CONCEPT / CART / "001-schermata.png"
W, H = 625, 1655


def card_consiglio(t, x, w, ico, titolo_righe, testo_righe, larg_t, larg_x, clip):
    y = 1213
    with t.gruppo("consiglio-" + ico):
        R(t, x, y, w, 119, 18, "#F6F8FC")
        I(t, ico, x + 36, 1253, 36, "#2E78F2" if ico != "lampadina" else "#F5A623", 1.8)
        for i, r_ in enumerate(titolo_righe):
            T(t, r_, x + 78, 1247 + i * 20, larg=larg_t[i], peso=600)
        for i, r_ in enumerate(testo_righe):
            T(t, r_, x + 78, 1291 + (i - (len(testo_righe) - 2)) * 20 if False else 1271 + i * 20 if len(testo_righe) == 3 else 1291 + i * 20,
              larg=larg_x[i], peso=400, colore="#66708F")


def schermata():
    s = STATI["alto"]
    t = nuova(W, H, id="home-dettaglio-rischio")
    barra_stato(t, 40, 585, 20, corpo=17)
    logo(t, 33, 88, larg=140)
    campanella(t, 567, 77, 27)
    T(t, "Il tuo rischio OFA", 33, 150, larg=239, peso=700, id="titolo")
    info(t, 298, 139, 11)
    T(t, "Più studi, più il rischio si abbassa.", 33, 181, larg=312, peso=400, colore="#66708F", id="sottotitolo")
    misuratore_rischio(t, 311, 450, 207, 0.762, 40, s["colore"], s["chiaro"], vuoto=s["vuoto"], alone=s["alone"])
    T(t, "82%", 311, 415, larg=125, peso=800, colore=s["num"], ancora="middle", id="percentuale")
    T(t, "Rischio di fallimento", 311, 453, larg=202, peso=600, colore=s["etichetta"], ancora="middle")
    T(t, "all'OFA di inglese", 310, 482, larg=141, peso=400, colore="#66708F", ancora="middle")
    avviso(t, 31, 515, 564, 146, "alto", "Rischio molto alto",
           ["Con il tuo livello attuale potresti", "non superare l'OFA. Inizia a studiare", "per ridurre il rischio."],
           20, 18.5, 132, 555, 27.5, r=20, r_icona=28, x_icona=78, col_riga="#66708F", larg_righe=[268, 306, 168], larg_titolo=164)
    pulsante_azione(t, 31, 679, 564, 75, "Inizia a studiare", 20, r=14, x_testo=129, peso=500)

    # fattori principali
    titolo_sezione(t, "Fattori principali", 33, 812, larg=168, info_=True)
    with t.gruppo("lista-fattori"):
        R(t, 31, 836, 564, 296, 18, "#FFFFFF", id="lista-fattori-fondo", filtro=ombra(t, 2, 12, "#2563EB", 0.06))
        dati = [("Grammatica", "libro", 0.20, 92), ("Comprensione", "cuffie", 0.35, 112), ("Vocabolario", "Aa", 0.45, 90), ("Ragionamento", "ingranaggio", 0.50, 112)]
        for i, (nome, ic, v, lw) in enumerate(dati):
            yc = 872 + i * 73.5
            c, ch = colore_fattore(v)
            with t.gruppo(f"fattore-{nome.lower()}"):
                icona_fattore(t, ic, 70, yc, 44)
                T(t, nome, 124, yc - 8, larg=lw, peso=500, colore="#1F2937")
                barra_fattore(t, 124, yc + 5, 323, v, 11, c, ch)
                T(t, f"{round(v * 100)}%", 520, yc + 17, larg=33, peso=600, colore="#4B5A7A", ancora="end")
                I(t, "chevron-destra", 568, yc, 26, "#7A869C", 2)
            if i < 3:
                L(t, 56, yc + 36.5, 574, yc + 36.5, "#EEF1F6", 1)

    # come ridurre il rischio
    titolo_sezione(t, "Come ridurre il rischio?", 33, 1195, larg=244, azione="Vedi tutti", x_fine=588, corpo_az=18)
    p = t.p
    cl = clip_rett(t, 0, p(1200), t.w, p(150), 0)
    with t.gruppo("consigli-scorrevoli", clip=cl):
        card_consiglio(t, 31, 224, "bersaglio-freccia", ["Completa le lezioni", "consigliate"], ["Puoi ridurre il rischio", "fino al 20%."],
                       [122, 76], [118, 62], cl)
        card_consiglio(t, 272, 213, "documento", ["Fai una simulazione"], ["Scopri il tuo livello", "attuale con un test", "completo."],
                       [122], [112, 112, 62], cl)
        card_consiglio(t, 502, 213, "lampadina", ["Studia le aree deboli"], ["Concentrati sugli", "argomenti in cui hai più", "difficoltà."],
                       [122], [112, 128, 62], cl)

    # percorso
    T(t, "Il tuo percorso", 33, 1396, larg=164, peso=700)
    with t.gruppo("percorso-timeline"):
        L(t, 80, 1433, 541, 1433, "#E2E8F2", 4)
        L(t, 80, 1433, 166, 1433, "#2E78F2", 4)
        C(t, 80, 1433, 11, "#2E78F2", stroke="#CFE0FC", sw=4)
        C(t, 311, 1433, 10, "#FFFFFF", stroke="#C9D2E2", sw=3)
        C(t, 541, 1433, 10, "#FFFFFF", stroke="#C9D2E2", sw=3)
        for x, e, v, col, w_e, w_v in ((80, "Oggi", "82%", "#E6121F", 35, 33), (311, "Dopo 5 lezioni", "62%", "#4B5A7A", 100, 33), (541, "Dopo 15 lezioni", "28%", "#4B5A7A", 106, 33)):
            T(t, e, x, 1473, larg=w_e, peso=400, colore=GRIGIO, ancora="middle")
            T(t, v, x, 1496, larg=w_v, peso=700, colore=col, ancora="middle")

    nav_home3(t, 0, 1522, 133, corpo=17, ico=44, indicatore=False, y_ico=38, y_lab=80)
    indicatore_home(t, 311, 1633, 207, 7)
    return t


if __name__ == "__main__":
    t = schermata()
    svg = salva(t, CART, "001-home-dettaglio-rischio.svg")
    if vuole_tavola():
        controlla(svg, ORIG, "21-home-dettaglio-rischio", 1.0)
