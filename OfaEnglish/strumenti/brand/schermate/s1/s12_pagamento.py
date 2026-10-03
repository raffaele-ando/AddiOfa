"""12 · «Pagamento sicuro» (02.012 = 47.012): carta di credito (scelta), PayPal, Apple Pay, Google Pay, «Completa l'acquisto».

Marchi dei metodi di pagamento ridisegnati in forma semplice (extra.marchio_*): non sono copie dei loghi ufficiali.
Nell'originale il pulsante aveva il lucchetto; qui resta. Radio scelta: anello e pallino rossi. Avanzamento a 5 su 5.
"""
from extra import *

t = nuova(12)
stato(t)
barra_superiore(t)
riga(t, "Pagamento sicuro", 112, 69, corpo_per("Pagamento sicuro", 120, 800), 800, ancora="middle", id="titolo")
riga(t, "Scegli il metodo di pagamento.", 112, 85, corpo_per("Scegli il metodo di pagamento.", 135, 400), 400, SOTTO, ancora="middle", id="sottotitolo")
metodi = [("Carta di credito", marchio_carta, True), ("PayPal", marchio_paypal, False), ("Apple Pay", marchio_apple, False), ("Google Pay", marchio_google, False)]
cm = corpo_per("Carta di credito", 62, 500)
for i, (nome, marchio, sel) in enumerate(metodi):
    y0 = 100 + i * 36.2
    yc = y0 + 15.5
    scheda(t, 27, y0, 199, y0 + 31, sel, id=f"metodo-{i + 1}")
    marchio(t, 45, yc, 15)
    riga(t, nome, 65, yc + 3.4, cm, 500, "#25304A", id=f"metodo-{i + 1}-nome")
    radio_r(t, 182, yc, 6.8, sel, id=f"metodo-{i + 1}-radio")
pulsante(t, 27, 255, 199, 285, "Completa l’acquisto", icona_sx="lucchetto", dx_etichetta=-2)
scudo(t, 63, 293.5, 12)
riga(t, "Pagamento sicuro e protetto", 70, 296, corpo_per("Pagamento sicuro e protetto", 96, 400), 400, "#6A7488", id="nota")
chiudi(t)
