"""04 · «Verifica il tuo livello di inglese» (02.004 = 47.004). Titolo, sottotitolo, foglio del quiz, «Inizia il quiz».

Illustrazione: `kit-rosso/illustrazioni/quiz-test` (foglio con A/B/C e spunta; nell'originale c'è anche un tondo con la
bandiera UK, che il disegno del kit non ha: non aggiunto, per non cambiare un'illustrazione già approvata).
"""
from extra import *

t = nuova(4)
stato(t)
barra_superiore(t)
c = corpo_per("livello di inglese", 125, 800)
riga(t, "Verifica il tuo", 31, 85, c, 800, id="titolo-1")
riga(t, "livello di inglese", 31, 104, c, 800, id="titolo-2")
cs = corpo_per("10 domande, 3 minuti.", 111, 400)
righe(t, ["10 domande, 3 minuti.", "Il risultato è immediato."], 31, 124, cs, 14, 400, SOTTO, id="sottotitolo")
illustrazione(t, "kit-rosso/illustrazioni/quiz-test", 22, 156, 172, 268, soglia=25)
pulsante(t, 13, 279, 178, 313, "Inizia il quiz")
chiudi(t)
