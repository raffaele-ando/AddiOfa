"""06.007 · Calendario (settembre 2026, streak). Kit blu.
Corregge: nell'originale il 1° settembre cade sotto «L», ma il 1/9/2026 è un MARTEDÌ: griglia ricostruita con il calendario vero
(30 giorni, righe da 7). Giorni di studio e streak resi coerenti: studiati 1,2,3,5,8,9,10,11,12 -> streak attuale 5 giorni
(8-12), oggi = 12 con anello rosso. L'originale è tagliato a destra: schermata completata alla larghezza intera."""
from componenti import *
import calendar

ORIGINALE = ORIG / "06-schermate-sfide-progressi/007-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "07-calendario.svg"
STUDIATI = {1, 2, 3, 5, 8, 9, 10, 11, 12}
OGGI = 12


def disegna():
    t = schermata("calendario", "blu", 898)
    t.barra_stato()
    titolo(t, "Calendario", 88, 24, 30)
    t.icona("chevron-sinistra", 30, 140, 22, "#1E3A9E", 2.4, id="mese-precedente")
    t.icona("chevron-destra", 338, 140, 22, "#1E3A9E", 2.4, id="mese-successivo")
    t.testo("Settembre 2026", 195, 158, 17, 600, NAVY, "middle", id="mese")
    col = lambda i: 24 + 342 / 7 * (i + 0.5)
    for i, g in enumerate("LMMGVSD"):
        t.testo(g, col(i), 218, 13.5, 500, "#A5AFC9", "middle")
    cal = calendar.Calendar(0).monthdayscalendar(2026, 9)
    assert cal[0][1] == 1 and len(cal) == 5
    with t.gruppo("giorni"):
        for r, sett in enumerate(cal):
            yc = 262 + r * 63
            for i, d in enumerate(sett):
                if not d:
                    continue
                x = col(i)
                if d in STUDIATI:
                    t.cerchio(x, yc, 16, fill=t.sfumatura(["#22B573", "#119A5E"]), id=f"giorno-{d}")
                    t.testo(str(d), x, yc + 5.5, 15, 700, "#FFFFFF", "middle")
                    t.cerchio(x, yc + 24, 2, fill="#22B573")
                    if d == OGGI:
                        t.cerchio(x, yc, 19.5, fill="none", stroke="#EF4444", sw=1.8, id="oggi")
                else:
                    t.testo(str(d), x, yc + 5.5, 15, 500, NAVY, "middle")
    with t.gruppo("streak-attuale"):
        t.rett(24, 590, 342, 82, 20, fill="#F6F8FC", id="card-streak")
        tile_icona(t, 38, 604, 56, "#FFF1DD", 16)
        g_fiamma(t, 66, 632, 48)
        t.testo("Streak attuale", 112, 626, 13.5, 600, SOTTO)
        t.testo("5 giorni", 112, 656, 21, 800, NAVY)
        freccia_dx(t, 344, 631, "#6B7690", 16)
    tab_bar(t, NAV3, 2)
    return t
