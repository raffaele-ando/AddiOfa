"""06.009 · I miei progressi, Panoramica (kit blu). Grafico a linea dell'andamento del rischio OFA 82% -> 28%.
Corregge: etichetta illeggibile ('26') sul primo punto -> 82% (coerente con la home e col profilo); ultimo punto a 28% (nell'originale
il punto era al 20% con etichetta 28%); asse x con 5 punti e 3 etichette (Ago, Set, Ott). Tab-bar aggiunta (l'originale è tagliato)."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/009-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "09-progressi.svg"


def disegna():
    t = schermata("progressi", "blu", 844)
    t.barra_stato()
    titolo(t, "I miei progressi", 88, 24, 29)
    segmenti(t, ["Panoramica", "Lezioni", "Simulazioni"], 0, y=116, h=38, x0=24, x1=366, gap=6, stile="bordo", corpo=14)
    t.testo("Andamento rischio OFA", 24, 207, 18, 800, NAVY)
    xs, ys = grafico_linea(t, 24, 244, 342, 158, [82, 62, 44, 34, 28], etich_x=["Ago", "Set", "Ott"])
    t.testo("82%", xs[0] + 14, ys[0] - 9, 12.5, 700, NAVY)
    t.testo("28%", xs[-1], ys[-1] - 12, 13, 700, NAVY, "middle")
    t.testo("Statistiche generali", 24, 481, 16.5, 800, NAVY)
    stat_tile(t, 24, 503, 165, 84, "Lezioni completate", ("24", "/60"))
    stat_tile(t, 201, 503, 165, 84, "Simulazioni", "8")
    stat_tile(t, 24, 603, 165, 84, "Punteggio medio", "72%")
    stat_tile(t, 201, 603, 165, 84, "Tempo di studio", "12h 30m")
    tab_bar(t, NAV3, None)
    return t
