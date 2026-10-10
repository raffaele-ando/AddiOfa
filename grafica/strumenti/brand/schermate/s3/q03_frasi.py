"""19.003 · Frasi e vocaboli (kit rosso): ricerca con filtri, chip (Tutte attiva), 6 frasi con audio e preferita.
Stessa schermata di 18.003. Corregge: chip 'Già note' tagliato dal bordo -> chip a larghezza naturale entro i margini;
stelle: due piene (preferite), quattro contorno. Testi (inglese + traduzione) letti dall'originale."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/003-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "03-frasi-e-vocaboli.svg"
IDS = ["19.003"]
NOTA = "Frasi e vocaboli con ricerca, chip e 6 frasi. Testi letti dall'originale; chip 'Già note' non più tagliato; stessa schermata di 18.003."


def disegna():
    t = schermata("frasi", "rosso", 722)
    t.barra_stato()
    titolo(t, "Frasi e vocaboli", 80, 24, 26)
    t.rett(24, 94, 292, 43, 14, fill="#F0F3FA", id="ricerca")
    t.icona("ricerca", 36, 104, 22, "#44527E", 1.9)
    t.testo("Cerca una frase, parola o tema...", 64, 121, 13.5, 400, "#6F7BA0")
    t.rett(324, 94, 42, 43, 14, fill="#F0F3FA", id="filtri")
    t.icona("sliders", 334, 104, 22, NAVY, 1.9)
    x = 24
    with t.gruppo("chip"):
        for i, v in enumerate(["Tutte", "Preferite", "Da ripassare", "Già note"]):
            w = larghezza_testo(v, 13, 600) + 26
            if i == 0:
                t.rett(x, 153, w, 35, 17.5, fill=t.sfumatura(["#F93C4C", "#F0222F"]))
                t.testo(v, x + w / 2, 175, 13, 600, "#FFFFFF", "middle")
            else:
                t.rett(x, 153, w, 35, 17.5, fill="#EBF1FC")
                t.testo(v, x + w / 2, 175, 13, 500, "#2F55C4", "middle")
            x += w + 8
    frasi = [("I'm looking forward to it.", "Non vedo l'ora.", True), ("It depends.", "Dipende.", False), ("Once in a while.", "Ogni tanto.", True),
             ("I'd rather not.", "Preferirei di no.", False), ("That makes sense.", "Ha senso.", False), ("Let me know.", "Fammi sapere.", False)]
    for i, (en, it, fav) in enumerate(frasi):
        y = 207 + i * 71.5
        with t.gruppo(f"frase-{i + 1}"):
            t.rett(24, y, 342, 63, 15, fill="#FFFFFF", stroke="#EDF0F6", sw=1.2, filtro=t.ombra(1, 5, "#0F172A", 0.04))
            t.rett(33, y + 14, 36, 35, 11, fill="#E9F0FD")
            t.icona("volume", 41, y + 21, 20, "#1D5FF0", 1.6)
            t.testo(en, 87, y + 27, 15.5, 700, NAVY)
            t.testo(it, 87, y + 48, 14, 400, "#5A6EA8")
            if fav:
                t.icona("stella", 337, y + 20, 24, "#F7A81B", 1)
            else:
                t.icona("stella-contorno", 337, y + 20, 24, "#B3BCD3", 1.5)
    tab_bar(t, NAV5, 1, h=84)
    return t
