"""11 · «CRAM Pass Pro» (02.011 = 47.011): tre contenuti del piano (simulazioni, archivio, cheat sheet) e «Procedi al pagamento».

Testi dall'originale (l'app ha altre voci). Icone: chip tondi con glifi pieni (libro, lista, documento). Nessun prezzo qui
(nell'originale non c'è). Barra di avanzamento uniforme a 5 segmenti (nell'originale uno era corto).
"""
from extra import *

t = nuova(11)
stato(t)
barra_superiore(t)
riga(t, "CRAM Pass Pro", 113, 78, corpo_per("CRAM Pass Pro", 134, 800), 800, ancora="middle", id="titolo")
cs = corpo_per("Il piano completo per superare", 147, 400)
righe(t, ["Il piano completo per superare", "l’OFA di inglese."], 113, 98, cs, 14, 400, SOTTO, ancora="middle", id="sottotitolo")
voci = [("libro", 141, "#FDEBEE", "#EE3340", ["Simulazioni illimitate", "con timer ufficiale"]),
        ("lista", 186, "#FEF1DD", "#F5A31F", ["Archivio 100", "quesiti frequenti"]),
        ("documento", 231, "#E9EBFE", "#4046E6", ["Cheat Sheet", "riassuntiva"])]
cv = corpo_per("Simulazioni illimitate", 85, 500)
for i, (ic, cy, fondo, col, testi) in enumerate(voci):
    chip_icona(t, ic, 50, cy, 18, fondo, col, id=f"contenuto-{i + 1}-icona", lato=18)
    righe(t, testi, 82, cy - 3, cv, 12.5, 500, "#47526A", id=f"contenuto-{i + 1}")
pulsante(t, 29, 261, 199, 290, "Procedi al pagamento")
chiudi(t)
