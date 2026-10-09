"""19.002 · Le tue statistiche (kit rosso): 3 riquadri (Quiz svolti, Tempo di studio, Media risultati), grafico a barre
dell'andamento (20 giorni, barre più forti = risultati migliori), 4 abilità con barra. Stessa schermata di 18.002.
Corregge: icone delle abilità (illeggibili) -> libro, documento, cuffie, libro-aperto; barre del grafico a passo e larghezza uguali.
Valori (24, 4h 20m, 82%, 88/76/84/90) tenuti come nell'originale (leggibili); barre del grafico = dati d'esempio."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/002-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "02-statistiche.svg"
IDS = ["19.002"]
NOTA = "Le tue statistiche con grafico a barre. Barre del grafico: dati di esempio (testo/valori non leggibili); icone delle abilità rifatte; stessa schermata di 18.002."
VAL = [0.46, 0.27, 0.27, 0.55, 0.38, 0.28, 0.62, 0.40, 0.36, 0.72, 0.95, 0.34, 0.92, 0.70, 0.40, 0.68, 0.85, 0.44, 0.80, 0.93]


def disegna():
    t = schermata("statistiche", "rosso", 716)
    t.barra_stato()
    titolo(t, "Le tue statistiche", 84, 24, 26)
    t.rett(252, 91, 114, 28, 14, fill="#EEF1F7", id="periodo")
    t.testo("Ultimi 30 giorni", 262, 109.5, 11.5, 500, "#3F4E7E")
    t.icona("chevron-giu", 348, 99, 12, "#3F4E7E", 2.4)
    for x, fondo, ic, v, l in ((24, "#FEF1F2", "b", "24", "Quiz svolti"), (141, "#EEF3FD", "t", "4h 20m", "Tempo di studio"), (258, "#EDF8F2", "g", "82%", "Media risultati")):
        with t.gruppo("riquadro-" + l.lower().replace(" ", "-")):
            t.rett(x, 131, 108, 109, 16, fill=fondo)
            cx = x + 54
            if ic == "b":
                t.icona("barre-pieno", cx - 15, 144, 30, ROS, 1)
            elif ic == "t":
                t.cerchio(cx, 160, 15, fill="#1D6BF2"); t.icona("tempo", cx - 9, 151, 18, "#FFFFFF", 2.4)
            else:
                g_bersaglio(t, cx, 160, 32)
            t.testo(v, cx, 204, 21, 800, NAVY, "middle")
            t.testo(l, cx, 225, 12.5, 400, "#4A5C9A", "middle")
    with t.gruppo("andamento-risultati"):
        t.rett(24, 258, 342, 166, 18, fill="#FFFFFF", stroke="#EDF0F6", sw=1.2, filtro=t.ombra(1, 6, "#0F172A", 0.04))
        t.testo("Andamento risultati", 40, 292, 15.5, 800, NAVY)
        t.testo("82%", 350, 292, 19, 800, NAVY, "end")
        t.linea(40, 310, 350, 310, "#EEF1F7", 1, cap="butt")
        grafico_barre(t, 40, 326, 310, 76, VAL, id="grafico-barre")
    t.testo("Per abilità", 24, 452, 15.5, 800, NAVY)
    t.testo("Vedi dettagli", 342, 452, 13.5, 500, "#3B64C8", "end")
    t.icona("chevron-destra", 345, 441, 14, "#3B64C8", 2.4)
    abil = [("Grammar", 88, "#EF4444", "documento"), ("Vocabulary", 76, "#F0503C", "libro-aperto"), ("Listening", 84, "#F97316", "cuffie"), ("Reading", 90, "#F59E0B", "documento")]
    for i, (nm, v, c, ic) in enumerate(abil):
        yc = 487 + i * 37.3
        with t.gruppo("abilita-" + nm.lower()):
            t.rett(26, yc - 11, 22, 22, 6, fill=c)
            t.icona(ic, 30, yc - 7, 14, "#FFFFFF", 2.2)
            t.testo(nm, 61, yc + 5.5, 15, 600, NAVY)
            t.rett(154, yc - 4, 154, 8, 4, fill="#E9ECF4")
            t.rett(154, yc - 4, 154 * v / 100, 8, 4, fill=t.sfumatura(["#F5283A", "#EE1C2E"], 0, 0, 1, 0))
            t.testo(f"{v}%", 361, yc + 5.5, 15, 600, NAVY, "end")
    tab_bar(t, NAV5, None, h=84)
    return t
