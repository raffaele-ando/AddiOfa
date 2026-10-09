"""19.001 · Il tuo profilo (kit ROSSO come nell'immagine 19: pulsanti, barre e tab attiva sono rossi; i testi interni sono navy).
Stessa schermata di 18.001 (altra generazione, tab-bar a 3 voci): qui la tab-bar a 5 voci di 19. Avatar = silhouette neutra (già nell'originale).
Corregge: icone AI storte della lista (omino, scudo, ingranaggio) -> icone vere; icona livello (barre rosse) pulita. Testo ricostruito: nessuno."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/001-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "01-profilo.svg"
IDS = ["19.001"]
NOTA = "Il tuo profilo (kit rosso come nell'originale). Icone della lista rifatte; stessa schermata di 18.001. Nessun testo ricostruito."


def disegna():
    t = schermata("profilo", "rosso", 716)
    t.barra_stato()
    titolo(t, "Il tuo profilo", 82, 24, 27)
    t.icona("ingranaggio", 341, 50, 27, "#3F5A9A", 1.8, id="impostazioni")
    t.cerchio(65, 134, 37, fill="#DDE3EE", id="avatar-fondo")
    avatar(t, 65, 134, 36, 3, id="avatar-profilo")
    t.testo("Raffaele A.", 123, 132, 23, 800, NAVY, id="nome")
    t.testo("Studente @ Polimi", 123, 156, 16.5, 400, "#4A5C9A", id="ruolo")
    with t.gruppo("livello-attuale"):
        t.rett(21, 184, 347, 82, 18, fill="#F1F4FB", id="card-livello")
        t.rett(35, 200, 48, 50, 14, fill="#FDE6E8")
        t.icona("barre-pieno", 43, 208, 32, ROS, 1.2)
        t.testo("Livello attuale", 109, 209, 12.5, 400, "#4A5C9A")
        t.testo("B2", 109, 236, 20, 800, NAVY)
        t.testo("65%", 350, 236, 15, 600, NAVY, "end")
        t.rett(109, 244, 241, 8, 4, fill="#E6EAF3")
        t.rett(109, 244, 241 * 0.58, 8, 4, fill=t.sfumatura(["#F5283A", "#EE1C2E"], 0, 0, 1, 0), id="barra-livello")
    for x, ic, v, l in ((21, "fiamma", "12", "Giorni di streak"), (202, "trofeo", "#4", "in classifica")):
        with t.gruppo("riquadro-" + l.split()[-1]):
            t.rett(x, 279, 167, 68, 16, fill="#FFFFFF", stroke="#EDF0F6", sw=1.2, filtro=t.ombra(1, 6, "#0F172A", 0.05))
            (g_fiamma if ic == "fiamma" else g_trofeo)(t, x + 33, 313, 36 if ic == "fiamma" else 33)
            t.testo(v, x + 72, 312, 22, 800, NAVY)
            t.testo(l, x + 72, 332, 12.5, 400, "#4A5C9A")
    with t.gruppo("cram-pass-pro"):
        t.rett(21, 358, 347, 65, 16, fill="#FDF0E4", id="banner-cram")
        t.icona("stella", 36, 372, 38, "#F7A81B", 1)
        t.testo("CRAM Pass Pro", 91, 387, 17, 800, NAVY)
        t.testo("Sblocca simulazioni illimitate", 91, 408, 14, 400, "#4A5C9A")
        freccia_dx(t, 350, 391, NAVY, 15)
    for i, (ic, tx) in enumerate((("bersaglio", "I tuoi obiettivi"), ("barre-pieno", "Statistiche"), ("scudo", "Certificazioni"), ("ingranaggio", "Impostazioni"))):
        yc = 461 + i * 45.5
        with t.gruppo("voce-" + tx.lower().replace(" ", "-")):
            if i:
                t.linea(83, yc - 22.5, 366, yc - 22.5, "#EEF1F7", 1, cap="butt")
            if ic == "barre-pieno":
                t.icona(ic, 31, yc - 14, 26, "#5B6B9C", 1)
            else:
                t.icona(ic, 31, yc - 13, 26, "#5B6B9C", 1.8)
            t.testo(tx, 83, yc + 5.5, 16.5, 500, NAVY)
            freccia_dx(t, 352, yc, NAVY, 15)
    tab_bar(t, NAV5, 4, h=84)
    return t
