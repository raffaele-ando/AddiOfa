"""06.012 · Attività (kit blu): tab Tutte/Lezioni/Simulazioni/Sfide, 6 voci del registro con riquadro d'icona, titolo, dettaglio, ora/giorno e punti.
Corregge: icona 'Simulazione' (illeggibile) -> documento con spunta; icona dell'ultima voce (storta) -> bandiera; passo uniforme. Tab-bar aggiunta."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/012-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "12-attivita.svg"


def disegna():
    t = schermata("attivita", "blu", 844)
    t.barra_stato()
    titolo(t, "Attività", 92, 24, 29)
    segmenti(t, ["Tutte", "Lezioni", "Simulazioni", "Sfide"], 0, y=121, h=40, x0=24, x1=366, gap=6, corpo=14)
    dati = [("Lezione completata", "Future tenses", "Oggi, 10:24", "+20 pt", "libro", "#E6F1FE"),
            ("Simulazione", "Risultato: 72%", "Ieri, 17:03", "+50 pt", "doc", "#E6F1FE"),
            ("Sfida aggiornata", "7 giorni di studio (5/7)", "Ieri, 12:11", None, "bandiera", "#E3F6EC"),
            ("Lezione completata", "Modal verbs", "2 giorni fa", "+20 pt", "libro", "#E6F1FE"),
            ("Badge sbloccato", "Accuracy > 80%", "3 giorni fa", None, "stella", "#F1E7FD"),
            ("Sfida completata", "Grammar Sprint", "5 giorni fa", "+80 pt", "bandiera", "#E3F6EC")]
    for i, (tit, d1, d2, pt, k, fondo) in enumerate(dati):
        y = 192 + i * 89
        with t.gruppo(f"attivita-{i + 1}"):
            tile_icona(t, 24, y, 54, fondo, 15)
            cx, cy = 51, y + 27
            if k == "libro":
                g_libro(t, cx, cy, 30)
            elif k == "doc":
                t.icona("documento", cx - 15, cy - 16, 31, AZZ, 1.9)
                t.cerchio(cx + 9, cy + 9, 7, fill=VERDE_S); t.icona("spunta", cx + 4.5, cy + 4.5, 9, "#FFFFFF", 3)
            elif k == "stella":
                g_medaglia(t, cx, cy, 34, "#8B3FF0")
            else:
                t.icona("bandiera", cx - 15, cy - 16, 32, "#17A765", 1.8)
            t.testo(tit, 92, y + 12, 15, 700, NAVY)
            t.testo(d1, 92, y + 33, 14, 400, SOTTO)
            t.testo(d2, 92, y + 53, 13, 400, "#8A94B0")
            if pt:
                t.testo(pt, 366, y + 33, 15, 700, VERDE_S, "end")
    tab_bar(t, NAV3, None)
    return t
