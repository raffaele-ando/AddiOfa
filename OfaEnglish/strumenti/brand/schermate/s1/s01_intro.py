"""01 · «Hai l’OFA di inglese?» (02.001 = 47.001). Intro del funnel: logo Politecnico, titolo, libri con bandiera, pulsante.

Corregge: il sigillo del Politecnico non si riproduce (segnaposto `sigillo-segnaposto`, il nome resta come testo);
i libri con la bandiera UK sono l'illustrazione `kit-rosso/illustrazioni/studio-inglese` (la bandiera dell'AI aveva la croce rossa
centrata: quella del kit ha le diagonali sfalsate come le vere). Testi dall'originale, leggibili.
"""
from extra import *

t = nuova(1)
stato(t)
logo_polimi(t, 74, 55, 17, 96, 53.5, 62.5, 7.4)
riga(t, [("Hai l’OFA", INK_R)], 26, 110, corpo_per("Hai l’OFA", 100, 800), 800, id="titolo-1")
riga(t, [("di ", INK_R), ("inglese?", ROSSO_T)], 26, 138.5, corpo_per("di inglese?", 115, 800), 800, id="titolo-2")
righe(t, ["Scopri subito se sei a rischio", "e come superarlo."], 26, 164, corpo_per("Scopri subito se sei a rischio", 152, 400), 15.5, 400, SOTTO, id="sottotitolo")
illustrazione(t, "kit-rosso/illustrazioni/studio-inglese", 70, 199, 176, 282, soglia=90, per="altezza")
pulsante(t, 15, 288, 197, 318, "Inizia la verifica")
chiudi(t)
