"""06.006 · Sfide completate (tab Completate). Kit blu. Spunte verdi, titolo, data e punti; 5 righe a passo uguale
(nell'originale il passo è irregolare). Date e punti letti dall'originale (testo leggibile)."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/006-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "06-sfide-completate.svg"


def disegna():
    t = schermata("sfide-completate", "blu", 898)
    t.barra_stato()
    titolo(t, "Sfide", 88, 24, 30)
    segmenti(t, ["Attive", "Completate", "Tutte"], 1, y=114, h=38, x0=24, x1=366, gap=6, stile="bordo", corpo=14.5)
    dati = [("Completa 5 lezioni", "12 set 2026", "+100 pt"), ("Grammar Sprint", "8 set 2026", "+80 pt"),
            ("Simulazione completa", "1 set 2026", "+120 pt"), ("3 giorni di studio", "28 ago 2026", "+50 pt"),
            ("Duello simulazione", "20 ago 2026", "+200 pt")]
    for i, (tit, data, pt) in enumerate(dati):
        yc = 222 + i * 116
        with t.gruppo("completata-" + tit.lower().replace(" ", "-")):
            t.cerchio(52, yc, 19, fill=t.sfumatura(["#22B573", "#119A5E"]), filtro=t.ombra(2, 6, "#119A5E", 0.25))
            t.icona("spunta", 52 - 9.5, yc - 9.5, 19, "#FFFFFF", 3)
            t.testo(tit, 92, yc - 2, 16.5, 700, NAVY)
            t.testo(data, 92, yc + 22, 14, 400, "#7A86A8")
            t.testo(pt, 360, yc + 11, 15, 700, ARANCIO, "end")
    tab_bar(t, NAV3, 2)
    return t
