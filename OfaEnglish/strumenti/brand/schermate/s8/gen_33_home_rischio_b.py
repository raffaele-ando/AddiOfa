"""Immagine 33 (home rischio B: misuratore, card 'Prossimo passo' con pulsante, 'Il tuo percorso', 'Il tuo progresso').
Originale 749x1672. Corregge: le icone della riga meta (libro, orologio, barre) hanno lo stesso tratto; il mini grafico a barre
del progresso ha barre regolari (nell'originale larghezze/passi diversi); icona (i) allineata."""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *

CART = "33-home-rischio-b"
ORIG = CONCEPT / CART / "001-schermata.png"
W, H = 749, 1672


def barre_progresso(t, x, y_base, passo=28, larg=17):
    """Mini grafico a barre crescenti: tre piene (blu) poi chiare e grigie."""
    spec = [(10, "#B9D3FB"), (18, "#8DB8FA"), (27, "#2E78F2"), (35, "#2E78F2"), (46, "#D6E3F8"), (61, "#D6E3F8"), (77, "#D6E3F8")]
    with t.gruppo("mini-grafico-progresso"):
        for i, (hh, c) in enumerate(spec):
            R(t, x + i * passo, y_base - hh, larg, hh, larg / 2, c)


def schermata():
    s = STATI["alto"]
    t = nuova(W, H, id="home-rischio-b")
    barra_stato(t, 63, 693, 46, corpo=24)
    logo(t, 55, 140, larg=231)
    campanella(t, 661, 127, 35)
    info(t, 668, 227, 17)
    misuratore_rischio(t, 370, 525, 268, 0.744, 50, s["colore"], s["chiaro"], vuoto=s["vuoto"], alone=s["alone"])
    T(t, "82%", 375, 495, larg=196, peso=800, colore=s["num"], ancora="middle", id="percentuale")
    T(t, "Rischio di fallimento", 374, 543, larg=265, peso=600, colore=s["etichetta"], ancora="middle", id="etichetta-rischio")
    T(t, "all'OFA di inglese", 372, 581, larg=197, peso=400, colore="#66708F", ancora="middle", id="etichetta-ofa")

    # card prossimo passo
    with t.gruppo("prossimo-passo"):
        R(t, 43, 619, 660, 422, 28, t.sfumatura(["#FCEAEA", "#FBEFEC"]), id="prossimo-passo-fondo", filtro=ombra(t, 3, 14, "#EF4444", 0.07))
        tile_icona(t, "libro", 70, 665, 113, id="prossimo-passo-tile", sw=1.6)
        T(t, "PROSSIMO PASSO", 213, 677, 19, 500, GRIGIO, spaz=0.6, id="prossimo-passo-etichetta")
        T(t, "Future tenses", 213, 730, larg=240, peso=600, id="prossimo-passo-titolo")
        I(t, "chevron-destra", 658, 680, 36, "#6B7280", 2)
        # riga meta
        I(t, "libro", 228, 771, 30, "#6B7280", 1.5); T(t, "Lezione", 252, 778, 18, 400, "#6B7280")
        L(t, 331, 760, 331, 784, "#D9B8B8", 1.5)
        I(t, "orologio", 362, 771, 30, "#6B7280", 1.5); T(t, "10 min", 386, 778, 18, 400, "#6B7280")
        L(t, 458, 760, 458, 784, "#D9B8B8", 1.5)
        I(t, "barre-crescenti", 484, 771, 28, "#2E78F2", 1.2); T(t, "Riduce il rischio ~6%", 507, 778, 18, 400, "#6B7280")
        T(t, "Completa questa lezione per abbassare", 74, 840, 25, 400, "#66708F")
        T(t, "il tuo rischio di fallimento.", 74, 875, 25, 400, "#66708F")
        pulsante_azione(t, 64, 916, 619, 99, "Inizia la lezione", 28, r=22, x_testo=212, peso=500)

    # il tuo percorso
    with t.gruppo("card-percorso"):
        R(t, 44, 1070, 660, 238, 24, "#F4F7FC", id="card-percorso-fondo")
        titolo_sezione(t, "Il tuo percorso", 63, 1117, larg=198, azione="Vedi tutti", x_fine=686, corpo_az=22, id="percorso-titolo")
        grafico_percorso(t, 115, 628, (1166, 1184, 1191), 1243, 1275, corpo_v=23, corpo_e=20, r_pt=12, xs=(115, 372, 628), id="percorso")

    # il tuo progresso
    with t.gruppo("card-progresso"):
        R(t, 45, 1328, 656, 137, 24, "#F4F7FC", id="card-progresso-fondo")
        R(t, 80, 1356, 80, 80, 20, "#E8F0FD")
        I(t, "barre-crescenti", 120, 1396, 40, "#2E78F2", 1.2)
        T(t, "Il tuo progresso", 186, 1384, larg=189, peso=600, id="progresso-titolo")
        T(t, "3 lezioni completate", 186, 1423, 24, 400, "#66708F", id="progresso-testo")
        barre_progresso(t, 431, 1433)
        I(t, "chevron-destra", 662, 1396, 36, "#6B7280", 2)

    nav_home3(t, 0, 1498, 174, corpo=22, ico=62, indicatore=False, y_ico=46, y_lab=99)
    indicatore_home(t, 372, 1644, 265, 8)
    return t


if __name__ == "__main__":
    t = schermata()
    svg = salva(t, CART, "001-home-rischio-b.svg")
    if vuole_tavola():
        controlla(svg, ORIG, "33-home-rischio-b", 1.0)
