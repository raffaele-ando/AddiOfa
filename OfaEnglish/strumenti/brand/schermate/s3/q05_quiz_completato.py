"""19.005 · Quiz completato! (80 %): documento con spunta (illustrazione già disegnata kit-rosso/stati/completato) + coriandoli, misuratore
80 % rosso, riquadri Corrette 8 / Errate 2 / Tempo 3m, 'Vedi le correzioni' e 'Torna alla home'. Stessa schermata di 18.005 e idea di
s1 08 (funnel). Kit rosso. Corregge: misuratore (ellittico e asimmetrico nell'AI) -> semi-ellisse costruita con pomello a 80 %."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/005-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "05-quiz-completato.svg"
IDS = ["19.005"]
NOTA = "Quiz completato 80%: illustrazione riusata (kit-rosso/stati/completato), coriandoli e misuratore ridisegnati. Stessa schermata di 18.005."
H = 596


def corpo_risultato(t, titolo_, sotto, pct, ok, no, tempo, illustrazione):
    intestazione_indietro(t, 60)
    illustrazione(t)
    t.testo(titolo_, 195, 171, 27, 800, NAVY, "middle", id="titolo")
    t.testo(sotto, 195, 198, 17, 400, "#4A5C9A", "middle", id="sottotitolo")
    misuratore_ellittico(t, 195, 306, 109, 90, pct / 100, spessore=15)
    t.testo(f"{pct}%", 195, 284, 44, 800, "#E5192E", "middle", id="percentuale")
    for x, k, v, l in ((24, "ok", ok, "Corrette"), (141, "no", no, "Errate"), (258, "t", tempo, "Tempo")):
        riquadro_risultato(t, x, 326, 108, 100, k, v, l)
    pulsante_pieno(t, 24, 441, 366, 48, "Vedi le correzioni", corpo=16.5)
    pulsante_bordo(t, 24, 501, 366, 44, "Torna alla home")
    t.rett(195 - 67, 584, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.85)


def disegna():
    t = schermata("quiz-completato", "rosso", H)
    t.barra_stato()

    def illu(t):
        illu_in(t, "kit-rosso/stati/completato", 116, 36, 252, 142, soglia=60, per="altezza", id="documento-completato")
        coriandoli(t, [(118, 66, 25, "#EF4444"), (254, 64, -28, "#F7A81B"), (99, 100, -20, "#F7C21B"), (277, 98, 15, "#2F7BF2"), (198, 36, 80, "#EF4444")])
    corpo_risultato(t, "Quiz completato!", "Hai ottenuto 8 su 10.", 80, "8", "2", "3m", illu)
    return t
