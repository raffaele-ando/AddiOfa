"""14 · «Il tuo obiettivo è a portata di mano.» (02.014 = 47.014): bersaglio con freccia, testo, «Vai alla dashboard».

Illustrazione: `kit-rosso/stati/obiettivo` (bersaglio con freccia e nuvola rosa), già nello stile del kit. Testi dall'originale.
"""
from extra import *

t = nuova(14)
stato(t)
illustrazione(t, "kit-rosso/stati/obiettivo", 65, 56, 157, 147, soglia=90, id="obiettivo")
c = corpo_per("è a portata di mano.", 149, 800)
riga(t, "Il tuo obiettivo", 108, 178, c, 800, ancora="middle", id="titolo-1")
riga(t, "è a portata di mano.", 108, 197, c, 800, ancora="middle", id="titolo-2")
cs = corpo_per("percorso al Polimi senza stop.", 139, 400)
righe(t, ["Supera l’OFA, sblocca il tuo", "piano di studi e inizia il tuo", "percorso al Polimi senza stop."], 108, 218, cs, 14, 400, SOTTO, ancora="middle", id="sottotitolo")
pulsante(t, 27, 258, 184, 288, "Vai alla dashboard")
chiudi(t)
