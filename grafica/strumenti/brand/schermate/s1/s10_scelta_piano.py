"""10 · Scelta del piano (02.010 = 47.010): Pass Simulatore 9,99 €, CRAM Pass Pro 14,99 € (scelto), Garanzia Promosso 24,99 €.

Prezzi e testi leggibili nell'originale e uguali a src/config/offer.ts. Corregge: l'ultima scheda era tagliata dal bordo del
ritaglio (qui completa); i tre «tondi con freccia» hanno colore per stato (grigio, rosso scelto, verde garanzia); l'etichetta
«Massima sicurezza» era storta, ora allineata a «Più scelto».
"""
from extra import *

t = nuova(10)
stato(t)
barra_superiore(t)
carte = [
    dict(y0=50, y1=118, nome="Pass Simulatore", d=["Simulazioni illimitate con", "timer ufficiale da 15 min"], prezzo="9,99 €", sel=False, badge=None),
    dict(y0=129, y1=205, nome="CRAM Pass Pro", d=["Tutto il simulatore + Archivio", "100 quesiti frequenti + Cheat Sheet"], prezzo="14,99 €", sel=True, badge=("Più scelto", "#F0262E", 56)),
    dict(y0=220, y1=300, nome="Garanzia Promosso", d=["Tutto il pacchetto + rimborso totale", "in caso di mancato superamento"], prezzo="24,99 €", sel=False, badge=("Massima sicurezza", "#34AE52", 96)),
]
cn = corpo_per("Garanzia Promosso", 100, 800)
cd = corpo_per("100 quesiti frequenti + Cheat Sheet", 138, 400)
cp = corpo_per("14,99 €", 46, 800)
for i, c in enumerate(carte):
    y0, y1 = c["y0"], c["y1"]
    verde = c["badge"] and c["badge"][1] == "#34AE52"
    with t.gruppo(f"piano-{i + 1}"):
        if verde:
            t.rett(t.X(27), t.Y(y0), t.s(200), t.s(y1 - y0), t.s(8), fill=t.sfumatura(["#F8FDF9", "#EEFAF1"]), stroke="#D5EEDB", sw=t.s(0.8), id=f"piano-{i + 1}-fondo")
        else:
            scheda(t, 27, y0, 227, y1, c["sel"], id=f"piano-{i + 1}-fondo")
        b = c["badge"]
        if b:
            t.rett(t.X(33), t.Y(y0 - 7), t.s(b[2]), t.s(17), t.s(8.5), fill=b[1], id=f"piano-{i + 1}-etichetta")
            riga(t, b[0], 33 + b[2] / 2, y0 + 4.6, 8.4, 700, "#FFFFFF", ancora="middle", id=f"piano-{i + 1}-etichetta-testo")
        yb = y0 + (18 if not b else 24)
        riga(t, c["nome"], 39, yb, cn, 800, INK_R, id=f"piano-{i + 1}-nome")
        righe(t, c["d"], 39, yb + 13.5, cd, 12.5, 400, SOTTO, id=f"piano-{i + 1}-descrizione")
        riga(t, c["prezzo"], 39, yb + 41, cp, 800, INK_R, id=f"piano-{i + 1}-prezzo")
        cy = (y0 + y1) / 2 + (2 if b else 0)
        if verde:
            tondo_freccia(t, 207, cy + 4, 10, "#CDEBD4", "#1F7A3C", id=f"piano-{i + 1}-freccia")
        elif c["sel"]:
            tondo_freccia(t, 205, cy, 11, "#EE2433", id=f"piano-{i + 1}-freccia")
        else:
            tondo_freccia(t, 205, cy, 11, "#D9DDE5", id=f"piano-{i + 1}-freccia")
chiudi(t)
