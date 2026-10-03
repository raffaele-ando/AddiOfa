"""09 · «È il momento di prepararti.» (02.009 = 47.009). Tre vantaggi con icona tonda (libro, barre, fulmine). Nessun pulsante, come nell'originale.

Icone: chip tondi pastello con glifo pieno (extra.chip_icona), colori campionati: rosa/rosso, giallo, lilla/blu.
Testi dall'originale (l'app ha quattro voci più lunghe: qui le tre dell'immagine).
"""
from extra import *

t = nuova(9)
stato(t)
c = corpo_per("di prepararti.", 120, 800)
riga(t, "È il momento", 38.5, 70, c, 800, id="titolo-1")
riga(t, "di prepararti.", 38.5, 92, c, 800, id="titolo-2")
cs = corpo_per("Scegli il piano più adatto a te.", 136, 400)
righe(t, ["Scegli il piano più adatto a te.", "e supera l’OFA senza rischi."], 38.5, 114, cs, 15, 400, SOTTO, id="sottotitolo")
voci = [("libro", 171, "#FDEBEE", "#EE3340", "Simulazioni come l’esame"),
        ("barre", 212, "#FEF1DD", "#F5A31F", "Domande sempre aggiornate"),
        ("fulmine", 251, "#E9EBFE", "#3B3FE0", "Spiegazioni dettagliate")]
cv = corpo_per("Domande sempre aggiornate", 124, 500)
for i, (ic, cy, fondo, col, tx) in enumerate(voci):
    chip_icona(t, ic, 50, cy, 16.5, fondo, col, id=f"vantaggio-{i + 1}-icona", lato=17)
    riga(t, tx, 78.5, cy + 4, cv, 500, "#4A556B", id=f"vantaggio-{i + 1}")
chiudi(t)
