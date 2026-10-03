"""02 · «Hai già una certificazione di inglese riconosciuta dal Polimi?» (02.002 = 47.002). Due schede di scelta.

Corregge: avanzamento a 5 segmenti uguali sull'asse della freccia; scheda «Sì» con tondo grigio e chevron come nell'originale
(scelta con approfondimento), scheda «No» selezionata. Testi dall'originale (l'app dice «dal tuo ateneo»: qui resta «dal Polimi»).
"""
from extra import *

t = nuova(2)
stato(t)
barra_superiore(t)
c = corpo_per("inglese riconosciuta", 149, 800)
for i, (tx, y) in enumerate((("Hai già una", 87), ("certificazione di", 107), ("inglese riconosciuta", 127), ("dal Polimi?", 147))):
    riga(t, tx, 40.5, y, c, 800, id=f"titolo-{i + 1}")
# scheda «Sì, ho una certificazione»
scheda(t, 34, 177, 205, 239, False, id="scheda-si")
spunta_tondo(t, 56, 209, 9, "grigio", id="spunta-si")
cc = corpo_per("certificazione", 71, 600)
riga(t, "Sì, ho una", 79, 197, cc, 600, TESTO, id="scheda-si-titolo-1")
riga(t, "certificazione", 79, 212, cc, 600, TESTO, id="scheda-si-titolo-2")
riga(t, "Cambridge, IELTS, TOEFL…", 79, 225.5, corpo_per("Cambridge, IELTS, TOEFL…", 102, 500), 500, "#7C8598", id="scheda-si-sottotitolo")
t.icona("chevron-destra", t.X(186), t.Y(204.5), t.s(9), "#4B5870", 2.6, id="scheda-si-chevron")
# scheda «No, non ho una certificazione» (selezionata)
scheda(t, 34, 251, 205, 305, True, id="scheda-no")
spunta_tondo(t, 56, 277, 9, "rosso", id="spunta-no")
riga(t, "No, non ho una", 79, 273, cc, 600, TESTO, id="scheda-no-titolo-1")
riga(t, "certificazione", 79, 288, cc, 600, TESTO, id="scheda-no-titolo-2")
chiudi(t)
