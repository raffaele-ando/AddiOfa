"""Immagine 01 (home con rischio, tre stati: 82 % alto, 46 % medio, 18 % basso). UN generatore, tre SVG.

Layout comune (tre schermate da ~497x993 px): barra di stato, logo AddiOfa + pulsante profilo, "Ciao, Raffaele" + frase,
misuratore con percentuale, avviso di stato, "Cosa puoi fare ora?", pulsante, barra di navigazione.
Cosa corregge dell'originale: la frase "Stai facendo progressi!" e' spostata di ~6 px a destra rispetto al titolo (qui allineata
come le altre); il misuratore AI e' un'ellisse un po' schiacciata (qui un semicerchio vero); i tre pomelli hanno posizione
non proporzionale alla percentuale (82 -> 0,81; 46 -> 0,53; 18 -> 0,25): tenuta cosi', e' una scelta di design; le icone di
navigazione hanno tutte lo stesso tratto (nell'originale il tratto di 'Simulazioni' e 'Lezioni' cambia).
"""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *

CART = "01-home-rischio-tre-stati"
SRC = CONCEPT / CART

VARIANTI = {
    "alto": dict(n=1, dim=(497, 993), nome="001-home-rischio-alto", sub="Ecco la tua situazione attuale.",
                 titolo_av="Rischio molto alto", righe=["Con il tuo livello attuale potresti", "non superare l'OFA."],
                 cta="Inizia a studiare"),
    "medio": dict(n=2, dim=(498, 994), nome="002-home-rischio-medio", sub="Stai facendo progressi!",
                  titolo_av="Rischio medio", righe=["Stai migliorando. Continua", "a studiare per ridurre il rischio."],
                  cta="Continua a studiare"),
    "basso": dict(n=3, dim=(495, 995), nome="003-home-rischio-basso", sub="Ottimo lavoro!",
                  titolo_av="Rischio basso", righe=["Mantieni il ritmo! Sei sulla", "strada giusta."],
                  cta="Fai una simulazione"),
}


def schermata(stato: str, v: dict):
    s = STATI[stato]
    W, H = v["dim"]
    t = nuova(W, H, id=f"home-rischio-{stato}")
    barra_stato(t, 46, 453, 40, corpo=16)
    logo(t, 46, 108, larg=124)
    pulsante_profilo(t, 424, 100, 28)
    T(t, "Ciao, Raffaele", 46, 177, larg=213, peso=700, id="saluto")
    T(t, v["sub"], 46, 207, 19.5, 400, "#66708F", id="sottotitolo")
    # misuratore + cifra
    misuratore_rischio(t, 246, 441, 157, s["pos"], 33, s["colore"], s["chiaro"], vuoto=s["vuoto"], alone=s["alone"])
    T(t, s["pct"], 245, 446, larg=110, peso=800, colore=s["num"], ancora="middle", id="percentuale")
    T(t, "Rischio di fallimento", 245, 485, larg=195, peso=600, colore=s["etichetta"], ancora="middle", id="etichetta-rischio")
    T(t, "all'OFA di inglese", 245, 512, 16.5, 400, "#66708F", "middle", id="etichetta-ofa")
    # avviso
    avviso(t, 40, 548, 418, 131, stato, v["titolo_av"], v["righe"], 17.5, 17, 131, 591, 29, r=20, r_icona=22, x_icona=85,
           col_riga="#66708F")
    T(t, "Cosa puoi fare ora?", 46, 725, 19, 500, "#5F6B8A", id="titolo-azioni")
    pulsante_azione(t, 41, 747, 416, 89, v["cta"], 21, r=20, x_testo=142, peso=500)
    nav_home3(t, 0, 868, H - 868, corpo=14.5, ico=40, indicatore=False)
    return t


if __name__ == "__main__":
    for stato, v in VARIANTI.items():
        t = schermata(stato, v)
        svg = salva(t, CART, v["nome"] + ".svg")
        if vuole_tavola():
            controlla(svg, SRC / f"00{v['n']}-schermata.png", f"01-{stato}", 1.0)
