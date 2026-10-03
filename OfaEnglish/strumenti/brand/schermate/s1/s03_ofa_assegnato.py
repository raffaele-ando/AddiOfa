"""03 · «Hai l'OFA di inglese assegnato?» (02.003 = 47.003). Due schede: «Sì» selezionata, «No» con tondo vuoto.

Corregge: avanzamento uniforme; la «l’OFA» del titolo in rosso come nell'originale; tondo vuoto con spunta chiara pulito.
Testi dall'originale (l'app ha anche «Non lo so ancora», assente nell'immagine: non aggiunta).
"""
from extra import *

t = nuova(3)
stato(t)
barra_superiore(t)
c = corpo_per("di inglese assegnato?", 159, 800)
riga(t, [("Hai ", INK_R), ("l’OFA", ROSSO_T)], 19.5, 98, c, 800, id="titolo-1")
riga(t, "di inglese assegnato?", 19.5, 119, c, 800, id="titolo-2")
cs = corpo_per("Puoi verificarlo sulla tua pagina", 143, 400)
righe(t, ["Puoi verificarlo sulla tua pagina", "di iscrizione al Polimi."], 19.5, 139, cs, 14.5, 400, SOTTO, id="sottotitolo")
cc = corpo_per("No, non ho l’OFA", 84, 600)
scheda(t, 15, 188, 178, 238, True, id="scheda-si")
spunta_tondo(t, 36, 213, 8, "rosso", id="spunta-si")
riga(t, "Sì, ho l’OFA", 56, 209, cc, 600, TESTO, id="scheda-si-titolo-1")
riga(t, "di inglese", 56, 224, cc, 600, TESTO, id="scheda-si-titolo-2")
scheda(t, 15, 250, 178, 300, False, id="scheda-no")
spunta_tondo(t, 36, 275, 8, "vuoto", id="spunta-no")
riga(t, "No, non ho l’OFA", 56, 271, cc, 600, TESTO, id="scheda-no-titolo-1")
riga(t, "di inglese", 56, 286, cc, 600, TESTO, id="scheda-no-titolo-2")
chiudi(t)
