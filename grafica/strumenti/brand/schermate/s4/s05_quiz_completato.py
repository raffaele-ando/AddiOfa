"""18.005 · «Quiz completato!» 80 %: documento con spunta verde + coriandoli (illustrazione kit-rosso/stati/completato, riuso),
misuratore ellittico all'80 %, tessere Corrette 8 / Errate 2 / Tempo 3m, «Vedi le correzioni», «Torna alla home», nav.
Corregge: pomello e arco non allineati nell'originale (il pomello usciva dall'arco) -> costruiti sullo stesso tracciato; coriandoli
rifatti puliti; l'originale non aveva voci attive nella nav (qui nessuna, e' un esito, non una sezione). Testi leggibili."""
from comp_s4 import *

t = nuova(5)
X, Y, s = t.X, t.Y, t.s
stato18(t, 22.5)
t.icona("chevron-sinistra", X(25), Y(36), s(14), "#0B132B", 2.4, id="indietro")
illustrazione(t, "kit-rosso/stati/completato", 100, 28, 183, 103, soglia=60, per="altezza", id="illustrazione-completato")
with t.gruppo("coriandoli"):
    for i, (cx, cy, ang, col) in enumerate(((92, 49, 35, "#F22B36"), (147, 27, 80, "#F22B36"), (187, 47, -30, "#F8B01F"), (78, 73, -25, "#F8B01F"), (202, 73, 20, "#1F6BF0"))):
        capsula(t, cx, cy, 10.5, 3.2, ang, col, id=f"coriandolo-{i + 1}")
riga(t, "Quiz completato!", 144, 122, corpo_per("Quiz completato!", 154, 800), 800, INK_R, ancora="middle", id="titolo")
riga(t, "Hai ottenuto 8 su 10.", 144, 141, corpo_per("Hai ottenuto 8 su 10.", 120, 400), 400, BLU_T, ancora="middle", id="sottotitolo")
misuratore_ellittico(t, 143.3, 213, 77, 51, 13, 0.8, id="misuratore-80")
riga(t, "80%", 144, 211.5, corpo_per("80%", 62, 800), 800, "#E8232F", ancora="middle", id="percentuale")
for i, (x0, x1, f, ic, v, et, e0, e1) in enumerate(((23, 99, ("#F1F8F8", "#E8F2F5"), "ok", "8", "Corrette", 42, 80),
                                                    (108, 183, ("#FDF1F1", "#FCE9EA"), "no", "2", "Errate", 132, 159),
                                                    (193, 268, ("#F1F5FD", "#E8EFFB"), "tempo", "3m", "Tempo", 215, 245))):
    tessera_esito(t, x0, x1, 232, 303, f, ic, v, et, e0, e1, vy=278, ey=292.7, id=f"tessera-{i + 1}")
    # valore: dimensione fissa
pulsante(t, 24, 313, 268, 347, "Vedi le correzioni", corpo=12)
pulsante_contorno(t, 24, 356, 267, 386, "Torna alla home", corpo=11.6)
nav(t, 404, 462, attiva=None, centri=[57, 145, 233])
chiudi18(t)
