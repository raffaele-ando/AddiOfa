"""19.004 · Test: domanda a scelta («She ___ to Milan last year.») con 4 opzioni, 'went' selezionata, barra a 10 segmenti (2 piene), 'Avanti'.
Kit rosso. Stessa schermata di 18.004. Corregge: radio e opzioni di larghezza e passo uguali; barra con 10 segmenti uguali."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/004-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "04-test.svg"
IDS = ["19.004"]
NOTA = "Test, domanda 3/10, opzione selezionata. Testi letti dall'originale; stessa schermata di 18.004."


def disegna():
    t = schermata("test", "rosso", 700)
    t.barra_stato()
    intestazione_indietro(t, 60)
    t.testo("3/10", 195, 65, 16.5, 600, NAVY, "middle")
    passi(t, 2, 10, y=80)
    t.testo("Scegli la risposta corretta.", 24, 135, 17, 400, "#5A6EA8")
    q = "She ___ to Milan last year."
    t.testo(q, 24, 183, corpo_per(q, 326, 800), 800, NAVY, id="domanda")
    for i, o in enumerate(["go", "going", "went", "goes"]):
        opzione(t, 214 + i * 61, o, sel=(o == "went"), h=50)
    pulsante_pieno(t, 24, 567, 366, 54, "Avanti", freccia=True)
    t.rett(195 - 67, 688, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.85)
    return t
