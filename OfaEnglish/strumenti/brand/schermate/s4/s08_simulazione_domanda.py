"""18.008 · Simulazione d'esame, domanda 12/40 «If I ___ more time, I would travel the world.» (sezione Grammar, timer 00:24:15):
quattro risposte, «had» scelta, segnalibro e «Avanti».
Corregge: avanzamento con 9 segmenti disuguali -> 10 uguali con 3 pieni (12/40 = 30 %); icona del timer e dello scudo «Grammar» ridisegnate vere;
segnalibro vero (l'originale lo ha storto); nav con «Lezioni» attiva (nell'originale nessuna). Testi leggibili: nessun testo ricostruito."""
from comp_s4 import *

t = nuova(8)
X, Y, s = t.X, t.Y, t.s
stato18(t, 24)
t.icona("chevron-sinistra", X(52), Y(40), s(15), "#0B132B", 2.4, id="indietro")
with t.gruppo("timer"):
    t.rett(X(217), Y(37), s(80), s(23), s(11.5), fill="#FDE4E6", id="timer-fondo")
    cronometro_icona(t, 233, 49, 8, "#EE2433")
    riga(t, "00:24:15", 246, 52.7, corpo_per("00:24:15", 42, 700), 700, "#EE2433", id="timer-testo")
riga(t, "12/40", 175, 74, corpo_per("12/40", 31, 500), 500, BLU_T, ancora="middle", id="contatore")
with t.gruppo("avanzamento"):
    n_seg, a, b, gap = 10, 53, 293, 2.6
    w = (b - a - gap * (n_seg - 1)) / n_seg
    for i in range(n_seg):
        t.rett(X(a + i * (w + gap)), Y(85), s(w), s(5.4), s(2.7), fill=ROSSO_B2 if i < 3 else GRIGIO_BAR, id=f"avanzamento-{i + 1}")
with t.gruppo("sezione"):
    t.rett(X(53), Y(102), s(73), s(23), s(8), fill="#FDE6E8", id="sezione-fondo")
    glifo_c(t, "scudo", 66.5, 113.5, 13, "#EE2433", id="sezione-icona")
    riga(t, "Grammar", 78, 117.3, corpo_per("Grammar", 40, 600), 600, "#EE2433", id="sezione-testo")
riga(t, "Choose the best option.", 55, 145.7, corpo_per("Choose the best option.", 132, 400), 400, BLU_T, id="consegna")
c = corpo_per("If I ___ more time, I would travel", 228, 700)
riga(t, "If I ___ more time, I would travel", 55, 170.7, c, 700, INK_R, id="domanda-1")
riga(t, "the world.", 55, 188.7, c, 700, INK_R, id="domanda-2")
for i, (tx, sel) in enumerate((("have", False), ("had", True), ("would have", False), ("have had", False))):
    y0 = 204 + i * 34.3
    scheda(t, 55, y0, 293, y0 + 31, sel, r=8, id=f"risposta-{i + 1}")
    radio_r(t, 73, y0 + 15.5, 8.7, sel, id=f"risposta-{i + 1}-radio")
    riga(t, tx, 92.7, y0 + 19.8, 12, 600 if sel else 500, INK_R, id=f"risposta-{i + 1}-testo")
t.rett(X(52), Y(356), s(31), s(32), s(9), fill="#EEF3FD", id="segnalibro-fondo")
segnalibro(t, 67.5, 372, 15, "#2563EB")
pulsante(t, 146, 355, 294, 389, "Avanti", corpo=12.4, freccia=True)
nav(t, 404, 463, attiva=1, centri=[84, 174, 264])
chiudi18(t)
