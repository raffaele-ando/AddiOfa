"""Immagine 14 (home rischio alto, versione con 'Il tuo prossimo obiettivo' + 'Come cambia il tuo rischio').
Originale 760x1672. Corregge: grafico del percorso con etichette a quote diverse (qui valori a quota del loro punto,
come nell'originale ma regolari), cerchietto (i) del misuratore centrato sopra la cifra, misuratore a semicerchio vero."""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *

CART = "14-home-rischio-alto"
ORIG = CONCEPT / CART / "001-schermata.png"
W, H = 760, 1672


def schermata():
    s = STATI["alto"]
    t = nuova(W, H, id="home-rischio-alto")
    barra_stato(t, 53, 716, 45, corpo=24)
    logo(t, 48, 143, larg=206)
    campanella(t, 682, 127, 34)
    misuratore_rischio(t, 381, 548, 275, 0.743, 50, s["colore"], s["chiaro"], vuoto=s["vuoto"], alone=s["alone"])
    info(t, 380, 378, 14)
    T(t, "82%", 383, 497, larg=186, peso=800, colore=s["num"], ancora="middle", id="percentuale")
    T(t, "Rischio di fallimento", 381, 547, larg=273, peso=600, colore=s["etichetta"], ancora="middle", id="etichetta-rischio")
    T(t, "all'OFA di inglese", 381, 585, larg=194, peso=400, colore="#66708F", ancora="middle", id="etichetta-ofa")
    avviso(t, 47, 627, 668, 156, "alto", "Rischio molto alto", ["Completa le lezioni consigliate", "per ridurre il rischio."],
           27, 26, 190, 677, 39, r=24, r_icona=39, x_icona=113, col_riga="#66708F")
    pulsante_azione(t, 47, 801, 668, 116, "Inizia a studiare", 31, r=26, x_testo=190, peso=500)
    titolo_sezione(t, "Il tuo prossimo obiettivo", 47, 1002, larg=351, azione="Vedi percorso", x_fine=716, corpo_az=23)
    card_obiettivo(t, 47, 1029, 668, 151, "Grammatica", "Future tenses", 0.26, "0/5 lezioni", 20, 28, 22, r=24, larg_barra=330)
    titolo_sezione(t, "Come cambia il tuo rischio", 47, 1250, larg=366, info_=True)
    grafico_percorso(t, 100, 656, (1293, 1336, 1361), (1381, 1399, 1400), (1412, 1430, 1433), corpo_v=23, corpo_e=20, r_pt=11, xs=(100, 378, 656), id="percorso")
    # l'originale ha i valori 2 e 3 piu' in basso: quota per punto
    nav_home3(t, 0, 1490, 182, corpo=22, ico=62, indicatore=False, y_ico=50, y_lab=107)
    indicatore_home(t, 380, 1648, 270, 8)
    return t


if __name__ == "__main__":
    t = schermata()
    svg = salva(t, CART, "001-home-rischio-alto.svg")
    if vuole_tavola():
        controlla(svg, ORIG, "14-home-rischio-alto", 1.0)
