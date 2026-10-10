"""07 · «Se non superi l'OFA…» (02.007 = 47.007). Illustrazione dei soldi con le ali e il lucchetto, quattro conseguenze, «Continua il quiz».

Illustrazione: `kit-rosso/illustrazioni/rischio-economico` + lucchetto disegnato (extra.glifo). Le quattro icone delle righe,
nell'originale quattro glifi diversi e illeggibili (libro, tondo con freccia, foglio, libro con chevron), sono sostituite da
simboli che dicono la cosa: euro (costo), lucchetto (piano bloccato), foglio (esami), calendario (anno). Nessun avanzamento
né freccia indietro, come nell'originale. Testi dall'originale (4 conseguenze; l'app ne ha 3 con formulazione diversa).
"""
from extra import *

t = nuova(7)
stato(t)
illustrazione(t, "kit-rosso/illustrazioni/rischio-economico", 66, 38, 150, 104, soglia=60, per="altezza")
with t.gruppo("lucchetto"):
    t.cerchio(t.X(167), t.Y(85), t.s(14), fill="#FDECEE", opacita=0.9)
    glifo(t, "lucchetto", 167, 85, 24, "#F0525C")
riga(t, "Se non superi l’OFA…", 115, 127, corpo_per("Se non superi l’OFA…", 155, 800), 800, ancora="middle", id="titolo")
voci = [("euro", 156, ["Rischi di perdere in media", "30€ per i servizi aggiuntivi"], 155),
        ("lucchetto", 189, ["Il piano di studi viene bloccato"], 193),
        ("documento", 221, ["Dal secondo anno non puoi", "sostenere nessun esame"], 222),
        ("calendario", 254, ["Rischi di perdere un anno"], 257)]
cs = corpo_per("Il piano di studi viene bloccato", 129, 500)
for i, (ic, cy, testi, yb) in enumerate(voci):
    chip_icona(t, ic, 47, cy, 10, "#FDEDEF", "#EE3340", id=f"conseguenza-{i + 1}-icona", lato=13)
    righe(t, testi, 66, yb, cs, 13.5, 500, "#47526A", id=f"conseguenza-{i + 1}")
pulsante(t, 31, 283, 199, 316, "Continua il quiz")
chiudi(t)
