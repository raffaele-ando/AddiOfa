"""06.010 · I miei obiettivi (kit blu): obiettivo principale 'Supera l'OFA' (bersaglio verde) e 3 secondari con barra.
Corregge: ombra/alone 'fantasma' sul bordo sinistro della card; '20%' sfocato dietro la barra; testi minori riletti.
Il valore 82% -> 28% è quello degli altri schermi. Tab-bar aggiunta."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/010-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "10-obiettivi.svg"


def disegna():
    t = schermata("obiettivi", "blu", 844)
    t.barra_stato()
    titolo(t, "I miei obiettivi", 90, 24, 29)
    t.icona("piu", 328, 68, 28, AZZ, 2.4, id="aggiungi-obiettivo")
    t.testo("Obiettivo principale", 24, 153, 17, 800, NAVY)
    with t.gruppo("obiettivo-principale"):
        t.rett(24, 173, 342, 130, 20, fill="#F0F5FD", id="card-obiettivo")
        tile_icona(t, 38, 192, 92, "#DDF3E7", 22)
        g_bersaglio(t, 84, 238, 64)
        t.testo("Supera l'OFA", 150, 216, 21, 800, NAVY)
        t.testo("Riduci il rischio sotto il 20%", 150, 242, 14.5, 400, "#5A668F")
        t.barra(150, 275, 110, 0.6, h=8, kit="blu", fondo="#DCE6F8")
        da_a(t, 350, 285, "82%", "28%", 14)
    t.testo("Obiettivi secondari", 24, 385, 17, 800, NAVY)
    dati = [("giorno-cal", "Completa 30 giorni di studio", 7, 30), ("trofeo", "Completa 10 simulazioni", 8, 10), ("libro-aperto", "Raggiungi l'80% in Grammar", 65, 80)]
    for i, (ic, tx, v, tot) in enumerate(dati):
        yc = 455 + i * 107
        with t.gruppo("obiettivo-secondario-" + str(i + 1)):
            t.rett(24, yc - 46, 342, 92, 18, fill="#FFFFFF", stroke="#F0F2F8", sw=1, filtro=t.ombra(2, 8, "#0F172A", 0.04))
            tile_icona(t, 38, yc - 27, 54, "#EAF1FD", 15)
            if ic == "libro-aperto":
                g_libro(t, 65, yc, 32)
            elif ic == "trofeo":
                t.icona(ic, 50, yc - 15, 30, AZZ, 1.9)
            else:
                t.icona(ic, 52, yc - 14, 28, AZZ, 1.9)
            t.testo(tx, 108, yc - 6, 15, 700, NAVY)
            t.barra(108, yc + 12, 170, v / tot, h=7, kit="blu", fondo="#ECEFF5")
            t.testo(f"{v}/{tot}", 348, yc + 20, 13, 400, "#9AA3B8", "end")
    tab_bar(t, NAV3, None)
    return t
