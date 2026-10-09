"""18.004 · Quiz, domanda 3/10 «She ___ to Milan last year.»: quattro risposte (go, going, went, goes), «went» scelta, «Avanti».
Corregge: la barra di avanzamento nell'originale ha 8 segmenti con 2 pieni mentre il contatore dice 3/10 -> 10 segmenti uguali, 3 pieni;
risposte rimesse in ordine di riga uniforme (stesse altezze); nav con «Lezioni» attiva (nell'originale nessuna). Testi leggibili."""
from comp_s4 import *

t = nuova(4)
X, Y, s = t.X, t.Y, t.s
stato18(t, 25)
indietro_x = 39
t.icona("chevron-sinistra", X(32), Y(40), s(15), "#0B132B", 2.4, id="indietro")
riga(t, "3/10", 158, 53, corpo_per("3/10", 25, 500), 500, BLU_T, ancora="middle", id="contatore")
with t.gruppo("avanzamento"):
    n_seg, a, b, gap = 10, 41, 280, 2.6
    w = (b - a - gap * (n_seg - 1)) / n_seg
    for i in range(n_seg):
        t.rett(X(a + i * (w + gap)), Y(65.5), s(w), s(5.4), s(2.7), fill=ROSSO_B2 if i < 3 else GRIGIO_BAR, id=f"avanzamento-{i + 1}")
riga(t, "Scegli la risposta corretta.", 39, 104.5, corpo_per("Scegli la risposta corretta.", 162, 400), 400, BLU_T, id="consegna")
riga(t, "She ___ to Milan last year.", 39, 138, corpo_per("She ___ to Milan last year.", 235, 800), 800, INK_R, id="domanda")
for i, (tx, sel) in enumerate((("go", False), ("going", False), ("went", True), ("goes", False))):
    y0 = 162 + i * 44.3
    scheda(t, 38, y0, 284, y0 + 36.5, sel, r=9, id=f"risposta-{i + 1}")
    radio_r(t, 59.5, y0 + 18.3, 9.2, sel, id=f"risposta-{i + 1}-radio")
    riga(t, tx, 81, y0 + 23, 12.6, 700 if sel else 600, INK_R, id=f"risposta-{i + 1}-testo")
pulsante(t, 38, 418, 284, 458, "Avanti", corpo=13, freccia=True)
nav(t, 466, 520, attiva=1, centri=[69, 160, 252])
chiudi18(t)
