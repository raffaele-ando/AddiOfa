"""13 · «Accesso completato!» (02.013 = 47.013): foglio con spunta verde, coriandoli, «Inizia a prepararti».

Illustrazione: `kit-rosso/stati/completato` (foglio + spunta verde). I coriandoli (capsule e croci rosse/gialle) sono disegnati
qui, in cerchio attorno al foglio: nell'originale erano «ossi» storti e disuguali; ora capsule pulite con le posizioni
dell'immagine. Testi dall'originale.
"""
from extra import *

t = nuova(13)
stato(t)
ROS, GIA = "#EB3341", "#F7B72B"
with t.gruppo("coriandoli"):
    capsula(t, 46, 50, 10, 4.8, 40, ROS)
    capsula(t, 80, 49, 9, 4.6, 70, GIA)
    capsula(t, 146, 49, 10, 4.8, -40, ROS)
    capsula(t, 30, 79, 10, 4.8, 25, ROS)
    capsula(t, 165, 110, 9, 4.6, -35, ROS)
    capsula(t, 31, 142, 10, 4.8, -40, ROS)
    capsula(t, 164, 144, 10, 4.8, 40, ROS)
    croce(t, 157, 79, 11, 4.2, 0, ROS)
    croce(t, 37, 109, 12, 4.6, 0, GIA)
illustrazione(t, "kit-rosso/stati/completato", 62, 65, 144, 151, soglia=40, id="completato")
riga(t, "Accesso completato!", 98, 188, corpo_per("Accesso completato!", 156, 800), 800, ancora="middle", id="titolo")
cs = corpo_per("Hai ora accesso al", 89, 400)
righe(t, ["Hai ora accesso al", "CRAM Pass Pro."], 98, 207, cs, 15.5, 400, SOTTO, ancora="middle", id="sottotitolo")
pulsante(t, 10, 259, 187, 288, "Inizia a prepararti")
chiudi(t)
