"""18.009 · «Simulazione completata!» 76 %: coppa (riuso kit-rosso/illustrazioni/successo-superamento) + coriandoli, misuratore ellittico al 76 %,
tessere Corrette 30 / Errate 10 / Tempo 25m, «Vedi le correzioni», «Torna alla home», nav.
Corregge: coppa dell'originale con stella e manici asimmetrici -> coppa del kit (simmetrica); coriandoli puliti; pomello sull'arco.
Valori leggibili (30 + 10 = 40 domande, coerente con 12/40 della schermata 08). Nessun testo ricostruito."""
from comp_s4 import *

t = nuova(9)
X, Y, s = t.X, t.Y, t.s
stato18(t, 24)
illustrazione(t, "kit-rosso/illustrazioni/successo-superamento", 100, 26, 198, 113, soglia=60, per="altezza", id="coppa")
with t.gruppo("coriandoli"):
    for i, (cx, cy, ang, col) in enumerate(((87, 66, -10, "#F22B36"), (206, 59, -15, "#F8B01F"), (99, 90, -35, "#F8B01F"), (196, 89, 40, "#F22B36"), (102, 52, 30, "#F22B36"))):
        capsula(t, cx, cy, 10, 3.1, ang, col, id=f"coriandolo-{i + 1}")
riga(t, "Simulazione completata!", 151.5, 131.5, corpo_per("Simulazione completata!", 211, 800), 800, INK_R, ancora="middle", id="titolo")
riga(t, "Ecco il tuo risultato.", 151, 149, corpo_per("Ecco il tuo risultato.", 112, 400), 400, BLU_T, ancora="middle", id="sottotitolo")
misuratore_ellittico(t, 149.7, 218, 77, 51, 13, 0.76, id="misuratore-76")
riga(t, "76%", 151.5, 216.7, corpo_per("76%", 61, 800), 800, "#E8232F", ancora="middle", id="percentuale")
for i, (x0, x1, f, ic, v, et, e0, e1) in enumerate(((30, 105, ("#F1F8F8", "#E8F2F5"), "ok", "30", "Corrette", 48, 85),
                                                    (114, 189, ("#FDF1F1", "#FCE9EA"), "no", "10", "Errate", 138, 165),
                                                    (198, 273, ("#F1F5FD", "#E8EFFB"), "tempo", "25m", "Tempo", 221, 251))):
    tessera_esito(t, x0, x1, 234, 303, f, ic, v, et, e0, e1, vy=278.7, ey=293, id=f"tessera-{i + 1}")
pulsante(t, 30, 313, 273, 347, "Vedi le correzioni", corpo=12)
pulsante_contorno(t, 30, 355, 272, 387, "Torna alla home", corpo=11.6)
nav(t, 407, 463, attiva=1, centri=[63, 151, 239])
chiudi18(t)
