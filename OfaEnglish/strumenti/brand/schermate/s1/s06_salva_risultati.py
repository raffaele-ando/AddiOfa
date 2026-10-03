"""06 · «Salva i tuoi risultati» (02.006 = 47.006). Busta con timbro, testo, campo email, «Continua», nota dati sicuri.

Corregge: il sigillo del Politecnico sul timbro non si riproduce: disco blu notte neutro con anelli (`sigillo-segnaposto`);
busta ridisegnata nello stile pastello del kit (stati/notifica); barra di avanzamento uniforme. Testi dall'originale
(l'app, invece, chiede «Accedi con…»: qui resta la versione email dell'immagine).
"""
from extra import *

t = nuova(6)
stato(t)
barra_superiore(t)
busta(t, 82, 64, 152, 114, id="busta")
with t.gruppo("sigillo-segnaposto"):
    t.cerchio(t.X(141), t.Y(91), t.s(22), fill=t.sfumatura(["#1B3358", "#0F2342"]), filtro=t.ombra(t.s(1.5), t.s(5), "#0F2342", 0.28))
    t.cerchio(t.X(141), t.Y(91), t.s(17.5), fill="none", stroke="#8FA6C6", sw=t.s(0.9), opacita=0.8)
    t.cerchio(t.X(141), t.Y(91), t.s(6), fill="#8FA6C6", opacita=0.55)
riga(t, "Salva i tuoi risultati", 120, 146, corpo_per("Salva i tuoi risultati", 145, 800), 800, ancora="middle", id="titolo")
cs = corpo_per("e ricevere il piano personalizzato.", 160, 400)
righe(t, ["Inserisci la tua email istituzionale", "@polimi.it per salvare i risultati", "e ricevere il piano personalizzato."], 120, 164, cs, 14, 400, SOTTO, ancora="middle", id="sottotitolo")
t.rett(t.X(31), t.Y(210), t.s(178), t.s(28), t.s(8), fill="#FFFFFF", stroke="#E4E8EF", sw=t.s(0.9), filtro=t.ombra(t.s(0.8), t.s(3), "#0F172A", 0.05), id="campo-email")
riga(t, "nome.cognome@polimi.it", 44, 227.5, corpo_per("nome.cognome@polimi.it", 126, 400), 400, "#6A7488", id="campo-email-testo")
pulsante(t, 31, 249, 209, 279, "Continua")
scudo(t, 58, 304, 17)
riga(t, "I tuoi dati sono sicuri", 73, 302.5, corpo_per("e utilizzati solo per il servizio.", 116, 400), 400, "#6A7488", id="nota-1")
riga(t, "e utilizzati solo per il servizio.", 73, 315.5, corpo_per("e utilizzati solo per il servizio.", 116, 400), 400, "#6A7488", id="nota-2")
chiudi(t)
