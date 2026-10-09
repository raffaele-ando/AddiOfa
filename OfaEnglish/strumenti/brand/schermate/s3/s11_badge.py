"""06.011 · I miei badge (kit blu): tab Tutti/Sbloccati/Da sbloccare, griglia 3x3 (6 sbloccati, 3 bloccati).
Corregge: badge 'Sfida completata' e 'OFA superato' (lucchetti uguali) tenuti; libro grigio del 100 lezioni reso coerente con gli altri
bloccati; tutti i riquadri alla stessa dimensione. Tab-bar aggiunta."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/011-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "11-badge.svg"


def disegna():
    t = schermata("badge", "blu", 844)
    t.barra_stato()
    titolo(t, "I miei badge", 90, 24, 29)
    segmenti(t, ["Tutti", "Sbloccati", "Da sbloccare"], 0, y=119, h=40, x0=24, x1=366, gap=8, corpo=14.5)
    dati = [("7 giorni", "consecutivi", "fiamma"), ("10 lezioni", None, "libro"), ("Prima", "simulazione", "stella"),
            ("Accuracy", "> 80%", "bersaglio"), ("Sfida", "completata", "bandiera"), ("Top 10", "settimanale", "trofeo"),
            ("30 giorni", "consecutivi", "lucchetto"), ("100 lezioni", None, "libro-grigio"), ("OFA", "superato", "lucchetto")]
    for i, (a, b, k) in enumerate(dati):
        cx = 81 + (i % 3) * 114
        y = 193 + (i // 3) * 168
        badge_riga(t, cx, y, a, b, k, s=80, corpo=14, base_lab=y + 108)
    tab_bar(t, NAV3, None)
    return t
