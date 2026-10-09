"""06.002 · Tutte le sfide (tab Attive/Completate/Tutte). Kit blu. Corregge: icona tonda in alto a destra (illeggibile) -> calendario;
5 righe con la stessa struttura e un solo passo; testo piccolo riletto da 22.001 (stesse sfide, stessi testi)."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/002-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "02-tutte-le-sfide.svg"
GL_GRUPPO = lambda t, x, y, s: t.icona("gruppo", x - s / 2, y - s / 2, s, "#EF4B58", 1.2)


def disegna():
    t = schermata("tutte-le-sfide", "blu", 878)
    t.barra_stato()
    titolo(t, "Sfide", 88, 24, 30)
    tondo_azione(t, "giorno-cal", 347, 73, 19, "#E4EBF8", "#243B6B")
    segmenti(t, ["Attive", "Completate", "Tutte"], 0, y=116, h=39, x0=24, x1=366, gap=8, corpo=14.5)
    dati = [("7 giorni di studio", "Studia almeno un giorno", "per 7 giorni consecutivi.", 5, 7, "+150 pt", g_fiamma, "#FFF1DD"),
            ("Completa 5 lezioni", "Completa 5 lezioni di", "qualsiasi argomento.", 3, 5, "+100 pt", g_bersaglio, "#E3F6EC"),
            ("Duello simulazione", "Sfida un altro studente", "in una simulazione.", 0, 1, "+200 pt", GL_GRUPPO, "#FDE7E9"),
            ("Grammar Sprint", "Completa 10 esercizi", "di grammatica.", 6, 10, "+80 pt", g_libro, "#E6F1FE"),
            ("Simulazione completa", "Completa una simulazione", "da 40 domande.", 0, 1, "+120 pt", g_trofeo, "#FFF1DD")]
    for i, d in enumerate(dati):
        riga_sfida(t, 203 + i * 131, *d)
    tab_bar(t, NAV3, 2)
    return t
