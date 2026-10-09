"""06.005 · Amici (kit blu): tab I tuoi amici / Richieste, 5 amici con avatar neutri e menu, 'Invita amici', card 'Sfida un amico'.
L'originale è tagliato a destra: la schermata è completata alla larghezza intera (stessi margini della Classifica)."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/005-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "05-amici.svg"


def disegna():
    t = schermata("amici", "blu", 898)
    t.barra_stato()
    titolo(t, "Amici", 88, 24, 30)
    t.icona("gruppo", 335, 58, 30, "#1E3A9E", 1.7, id="aggiungi-amico")
    segmenti(t, ["I tuoi amici", "Richieste"], 0, y=114, h=38, x0=24, x1=366, gap=6, stile="bordo", corpo=14.5)
    nomi = [("ale.dis", "1.560"), ("fede.it", "980"), ("luca.m", "790"), ("chiara.m", "760"), ("silvia.c", "680")]
    for i, (nm, pt) in enumerate(nomi):
        riga_amico(t, 215 + i * 82.5, i + 1, nm, pt, tono=i)
    with t.gruppo("invita-amici"):
        t.rett(24, 603, 342, 58, 16, fill="#EEF5FE", stroke="#A9CBFA", sw=1.4, id="invita-fondo")
        w = larghezza_testo("Invita amici", 17, 600) + 30
        x = 195 - w / 2
        t.icona("condividi", x, 620, 24, AZZ, 1.9)
        t.testo("Invita amici", x + 32, 638, 17, 600, AZZ)
    with t.gruppo("sfida-un-amico"):
        t.rett(24, 686, 342, 113, 20, fill="#E7F7EE", id="card-sfida-amico")
        t.icona("gruppo", 36, 714, 48, "#1FAE70", 1, fill_pieno="#1FAE70")
        t.testo("Sfida un amico", 106, 727, 17, 700, "#0E8A52")
        t.testo("Confronta il tuo risultato", 106, 751, 13.5, 400, "#45617A")
        t.testo("in una simulazione.", 106, 771, 13.5, 400, "#45617A")
        t.icona("chevron-destra", 337, 731, 18, "#0E8A52", 2.2)
    tab_bar(t, NAV3, 2)
    return t
