"""05 · Domanda del quiz «She ___ to Milan every day.» (02.005 = 47.005). Quattro risposte (radio), «goes» scelta, «Avanti».

Corregge: la barra di avanzamento era sopra la freccia (fuori asse): ora centrata; 5 segmenti uguali. Il vuoto della frase è
la riga «____» del font. Testi dall'originale (stessi dell'app: «Domanda 3 di 10»).
"""
from extra import *

t = nuova(5)
stato(t)
barra_superiore(t)
riga(t, "Domanda 3 di 10", 16, 58, corpo_per("Domanda 3 di 10", 69, 500), 500, "#6C7A94", id="contatore")
riga(t, "Choose the correct form:", 16.5, 87, corpo_per("Choose the correct form:", 138, 400), 400, "#1E2A44", id="consegna")
c = corpo_per("She ____ to Milan", 112, 800)
riga(t, "She ____ to Milan", 17, 110, c, 800, id="domanda-1")
riga(t, "every day.", 17, 126, c, 800, id="domanda-2")
for i, (tx, sel) in enumerate((("go", False), ("goes", True), ("going", False), ("to go", False))):
    y0 = 150 + i * 30
    scheda(t, 16, y0, 172, y0 + 26, sel, r=6.5, id=f"risposta-{i + 1}")
    radio_r(t, 31, y0 + 13, 6.4, sel, id=f"risposta-{i + 1}-radio")
    riga(t, tx, 50, y0 + 16.2, 10.2, 500, "#4A556B" if not sel else "#2A3447", id=f"risposta-{i + 1}-testo")
pulsante(t, 12, 282, 177, 315, "Avanti")
chiudi(t)
