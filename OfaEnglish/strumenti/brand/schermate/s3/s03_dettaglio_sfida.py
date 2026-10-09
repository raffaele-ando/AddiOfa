"""06.003 · Dettaglio sfida «7 giorni di studio» (kit blu). Intestazione con cielo, montagna e bandierina disegnati (nessuna
illustrazione già pronta); 7 cerchi dei giorni (L M M G V S D) con 4 spuntati, il 5° chiaro (oggi), gli altri vuoti, barra 5/7,
Ricompensa, Consigli e pulsante. Corregge: giorni 'M M' invece di 'M M' storti, spunta del 5° cerchio più leggibile."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/003-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "03-dettaglio-sfida.svg"


def disegna():
    t = schermata("dettaglio-sfida", "blu", 936)
    cl = clip_rett(t, 0.5, 0.5, 389, 935, 26)
    with t.gruppo("cielo", clip=cl):
        t.rett(0, 0, 390, 230, 0, fill=t.sfumatura(["#B4D2FA", "#D9E8FD", "#EBF3FE"]), id="cielo-fondo")
        # nuvole
        for cx, cy, r in ((70, 92, 1.0), (330, 80, 1.0)):
            t.add(f'<g id="nuvola" opacity="0.55" fill="#FFFFFF"><ellipse cx="{cx}" cy="{cy + 8}" rx="{34 * r}" ry="9"/><ellipse cx="{cx - 6}" cy="{cy}" rx="{18 * r}" ry="12"/><ellipse cx="{cx + 12}" cy="{cy + 3}" rx="{14 * r}" ry="9"/></g>')
        # montagna
        t.path("M120 215C170 175 215 148 253 128C285 146 330 180 372 215Z", fill=t.sfumatura(["#6FA8F6", "#3F86F0"]), id="montagna")
        t.path("M253 128C285 146 330 180 372 215H262C268 186 262 150 253 128Z", fill="#2D72E6", opacita=0.85, id="montagna-ombra")
        t.path("M253 128 238 143C246 152 252 150 258 158 262 150 262 140 253 128Z", fill="#FFFFFF", opacita=0.5, id="vetta")
        t.linea(253, 62, 253, 130, "#5E9AF2", 2.2, id="asta")
        t.path("M253 63 218 70 232 78 218 90 253 85Z", fill="#2F7BF2", id="bandierina")
        # onda bianca
        t.path("M0 188C70 168 140 176 210 204S340 200 390 178V240H0Z", fill="#FFFFFF", id="onda")
    stato(t)
    t.icona("chevron-sinistra", 24, 66, 24, NAVY, 2.2, id="indietro")
    t.testo("7 giorni di studio", 24, 268, 29, 800, NAVY, id="titolo")
    t.testo("Studia almeno un giorno", 24, 310, 16.5, 400, SOTTO)
    t.testo("per 7 giorni consecutivi.", 24, 334, 16.5, 400, SOTTO)
    giorni = "LMMGVSD"
    with t.gruppo("giorni-della-settimana"):
        for i, g in enumerate(giorni):
            cx = 42 + i * 51.2
            if i < 4:
                t.cerchio(cx, 396, 17, fill=t.sfumatura(["#22B573", "#119A5E"]))
                t.icona("spunta", cx - 8, 388, 16, "#FFFFFF", 3)
            elif i == 4:
                t.cerchio(cx, 396, 16.2, fill="#E6F7EE", stroke="#9ADBBC", sw=1.6)
                t.icona("spunta", cx - 8, 388, 16, "#9ADBBC", 2.6)
            else:
                t.cerchio(cx, 396, 17, fill="#EEF1F7")
            t.testo(g, cx, 444, 14, 500, SOTTO if i != 4 else NAVY, "middle")
    t.rett(24, 489, 292, 14, 7, fill="#EAEFF8", id="barra-fondo")
    t.rett(24, 489, 292 * 5 / 7, 14, 7, fill=t.sfumatura(["#2F7BF5", "#5E97F8"], 0, 0, 1, 0), id="barra-valore")
    t.testo("5/7", 366, 505, 20, 700, NAVY, "end")
    with t.gruppo("card-ricompensa"):
        t.rett(24, 544, 342, 99, 20, fill="#FEF5E5")
        t.add('<g id="medaglia" transform="translate(65 593)"><path d="M0-26 22-14 22 14 0 26-22 14-22-14Z" fill="#F59E0B" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round"/></g>')
        t.icona("stella", 50, 578, 30, "#FFFFFF", 1)
        t.testo("Ricompensa", 112, 583, 14.5, 700, NAVY)
        t.testo("+150 punti", 112, 612, 18, 600, ARANCIO)
    with t.gruppo("card-consigli"):
        t.rect = t.rett(24, 660, 342, 100, 20, fill="#F5F7FC")
        t.icona("lampadina", 49, 683, 30, NAVY, 1.6)
        t.testo("Consigli", 112, 692, 14.5, 700, NAVY)
        t.testo("Sessioni brevi ma costanti", 112, 719, 14.5, 400, SOTTO)
        t.testo("sono più efficaci.", 112, 740, 14.5, 400, SOTTO)
    with t.gruppo("pulsante-primario"):
        t.rett(24, 774, 342, 62, 18, fill=AZZ, filtro=t.ombra(3, 9, AZZ, 0.25), id="pulsante-fondo")
        t.testo("Continua a studiare", 195, 812, 18, 600, "#FFFFFF", "middle", id="pulsante-testo")
    t.rett(195 - 67, 924, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.85)
    return t
