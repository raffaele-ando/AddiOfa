"""19.009 · Simulazione completata! (76 %): trofeo con stella (illustrazione già disegnata kit-rosso/successo-superamento) + coriandoli,
misuratore 76 %, Corrette 30 / Errate 10 / Tempo 25m, 'Vedi le correzioni', 'Torna alla home'. Kit rosso. Stessa schermata di 18.009.
Riusa la struttura di 19.005 (risultato): una sola funzione (corpo_risultato)."""
from componenti import *
from q05_quiz_completato import corpo_risultato, H

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/009-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "09-simulazione-completata.svg"
IDS = ["19.009"]
NOTA = "Simulazione completata 76%: trofeo riusato (kit-rosso/successo-superamento), coriandoli, misuratore. Stessa schermata di 18.009."


def disegna():
    t = schermata("simulazione-completata", "rosso", H)
    t.barra_stato()

    def illu(t):
        illu_in(t, "kit-rosso/illustrazioni/successo-superamento", 138, 34, 252 - 28, 136, soglia=60, per="altezza", id="trofeo")
        coriandoli(t, [(112, 70, 25, "#EF4444"), (270, 66, -28, "#F7A81B"), (96, 100, -20, "#F7C21B"), (290, 96, 15, "#2F7BF2")])
    corpo_risultato(t, "Simulazione completata!", "Ecco il tuo risultato.", 76, "30", "10", "25m", illu)
    return t
