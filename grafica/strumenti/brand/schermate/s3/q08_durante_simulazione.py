"""19.008 · Durante la simulazione: timer 00:24:15, 12/40, barra a 10 segmenti (3 piene), chip Grammar, domanda a scelta con 'had' selezionata,
segnalibro e 'Avanti'. Kit rosso. Stessa schermata di 18.008. Corregge: icona del chip Grammar (storta) -> scudo/libro pulito."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/008-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "08-durante-la-simulazione.svg"
IDS = ["19.008"]
NOTA = "Domanda 12/40 con timer. Testi letti dall'originale; stessa schermata di 18.008."


def disegna():
    t = schermata("durante-simulazione", "rosso", 590)
    t.barra_stato()
    intestazione_indietro(t, 64)
    t.rett(256, 49, 110, 33, 16.5, fill="#FEE9EC", id="timer-fondo")
    t.icona("cronometro", 266, 56, 19, ROS, 2.2)
    t.testo("00:24:15", 290, 71, 14.5, 700, ROS)
    t.testo("12/40", 196, 101, 16.5, 600, NAVY, "middle")
    passi(t, 3, 10, y=117)
    t.rett(26, 141, 102, 32, 16, fill="#FDEDEF", id="chip-grammar")
    t.icona("libro-aperto", 36, 149, 16, ROS, 2.4)
    t.testo("Grammar", 57, 162, 13.5, 600, ROS)
    t.testo("Choose the best option.", 24, 201, 16.5, 400, "#5A6EA8")
    t.testo("If I ___ more time, I would travel", 24, 238, 21, 500, NAVY, id="domanda-1")
    t.testo("the world.", 24, 264, 21, 500, NAVY, id="domanda-2")
    for i, o in enumerate(["have", "had", "would have", "have had"]):
        opzione(t, 284 + i * 49.5, o, sel=(o == "had"), h=43, corpo=16)
    t.rett(25, 497, 44, 48, 14, fill="#EAF0FD", id="segnalibro-fondo")
    t.icona("segnalibro", 36, 508, 24, "#1D5FF0", 2)
    pulsante_pieno(t, 158, 497, 366, 48, "Avanti", freccia=True, corpo=16.5)
    t.rett(195 - 67, 578, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.85)
    return t
