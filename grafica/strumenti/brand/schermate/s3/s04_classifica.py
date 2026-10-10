"""06.004 · Classifica settimanale (kit blu): tab a bordo (Settimanale/Mensile/Sempre), podio con corona, elenco 4-10 con la riga
dell'utente evidenziata. Nomi di esempio generici come nell'originale; foto -> avatar neutri. Corregge: pillola 'Sempre' tagliata."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/004-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "04-classifica.svg"


def disegna():
    t = schermata("classifica", "blu", 898)
    t.barra_stato()
    titolo(t, "Classifica", 88, 24, 30)
    segmenti(t, ["Settimanale", "Mensile", "Sempre"], 0, y=114, h=38, x0=24, x1=366, gap=6, stile="bordo", corpo=14.5)
    with t.gruppo("podio"):
        t.rett(139, 190, 113, 148, 16, fill="#FEF1DD", id="podio-primo")
        t.add('<g id="corona" transform="translate(195 181)"><path d="M-14 6l-4-13 8 5 10-11 10 11 8-5-4 13z" fill="#F7B21B"/><rect x="-14" y="7" width="28" height="3.500" rx="1.700" fill="#F59E0B"/></g>')
        for cx, cy, pos, nome, pt, col, ton, r in ((75, 243, "2", "giulia.p", "1.240", "#6F7FB5", 0, 24), (195, 225, "1", "ale.dis", "1.560", ARANCIO, 1, 24), (316, 244, "3", "marti.s", "1.120", "#E11D2B", 2, 24)):
            avatar(t, cx, cy, r, ton, id=f"podio-avatar-{pos}", anello="#FFFFFF")
            yb = 273 if pos == "1" else 287
            t.testo(pos, cx, yb, 15, 700, col, "middle")
            t.testo(nome, cx, yb + 22, 14.5, 700, NAVY, "middle")
            t.testo(f"{pt} pt", cx, yb + 44, 13.5, 400, SOTTO, "middle")
    nomi = [("fede.it", "980"), ("raffaele.ando", "820"), ("luca.m", "790"), ("chiara.m", "760"), ("davide.r", "700"), ("silvia.c", "680"), ("marco.p", "650")]
    with t.gruppo("elenco"):
        for i, (nm, pt) in enumerate(nomi):
            riga_classifica(t, 383 + i * 50.3, i + 4, nm, pt, evid=(nm == "raffaele.ando"), tono=i, sep=(i != 6 and nm != "raffaele.ando" and i != 0))
    tab_bar(t, NAV3, 2)
    return t
