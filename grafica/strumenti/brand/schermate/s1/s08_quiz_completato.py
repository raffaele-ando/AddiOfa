"""08 · «Quiz completato!» con il misuratore all'82 % (02.008 = 47.008). Scheda «Rischi di perdere circa 30€» e «Scopri come evitarlo».

Illustrazione: il misuratore è `kit-rosso/illustrazioni/risultato-probabilita` (arco, pomello e «82%» già disegnati nel kit);
le due righe sotto («Probabilità di / non superare l'OFA») sono testo. Nella scheda, i soldi con le ali sono
`rischio-economico` rimpicciolito. Corregge: il pomello dell'originale era una pallina rossa piatta, quello del kit ha
alone e bordo bianco; le 4 barre di avanzamento (lunghezze diverse) diventano 4 segmenti su 5 uguali.
"""
from extra import *

t = nuova(8)
stato(t)
barra_superiore(t)
riga(t, "Quiz completato!", 104, 65, corpo_per("Quiz completato!", 124, 800), 800, ancora="middle", id="titolo")
cs = corpo_per("Ecco la tua previsione", 99, 400)
righe(t, ["Ecco la tua previsione", "per l’OFA di inglese."], 104, 83, cs, 13.5, 400, SOTTO, ancora="middle", id="sottotitolo")
illustrazione(t, "kit-rosso/illustrazioni/risultato-probabilita", 18, 108, 187, 183, soglia=60, id="misuratore-82")
riga(t, "Probabilità di", 104, 191, corpo_per("Probabilità di", 59, 700), 700, INK_R, ancora="middle", id="misuratore-didascalia-1")
riga(t, "non superare l’OFA", 104, 202.5, corpo_per("non superare l’OFA", 88, 600), 600, ROSSO_T, ancora="middle", id="misuratore-didascalia-2")
t.rett(t.X(11), t.Y(217), t.s(189), t.s(41), t.s(8), fill=t.sfumatura(["#FEF4F4", "#FDEDEE"]), stroke="#FBE0E2", sw=t.s(0.6), id="scheda-rischio")
illustrazione(t, "kit-rosso/illustrazioni/rischio-economico", 29, 222, 64, 252, soglia=60, id="soldi")
riga(t, "Rischi di perdere", 77, 233, corpo_per("Rischi di perdere", 68, 400), 400, "#6A7488", id="scheda-rischio-1")
riga(t, "circa 30€", 77, 247, corpo_per("circa 30€", 48, 800), 800, INK_R, id="scheda-rischio-2")
t.icona("info", t.X(177), t.Y(227), t.s(10), "#8590A5", 1.9, id="scheda-rischio-info")
pulsante(t, 10, 262, 200, 294, "Scopri come evitarlo")
chiudi(t)
