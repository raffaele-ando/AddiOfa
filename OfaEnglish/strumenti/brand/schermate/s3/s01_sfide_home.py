"""06.001 · Sfide, Home (kit blu). Nota: 22.001 è un'altra generazione della stessa idea (sfida della settimana col bersaglio,
sottotitolo diverso): non è la stessa immagine, qui si segue 06.001. I testi si leggono bene nell'originale.
Corregge: avatar-foto -> cerchio neutro con silhouette; freccette decorative storte intorno al trofeo -> raggi del trofeo
(illustrazione già disegnata, kit-rosso/successo-superamento); riga 3 tagliata dalla tab-bar come nell'originale; 3 voci uguali."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/001-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "01-sfide-home.svg"


def disegna():
    t = schermata("sfide-home", "blu", 878)
    t.barra_stato()
    w1 = t.testo("Addi", 26, 78, 23, 800, NAVY, id="logo-addi")
    t.testo("Ofa", 26 + w1, 78, 23, 800, AZZ, id="logo-ofa")
    avatar(t, 347, 73, 18, 0, id="avatar-utente")
    t.testo("Sfide", 24, 148, 36, 800, NAVY, id="titolo")
    t.testo("Studia, completa sfide e riduci", 24, 177, 15, 400, SOTTO, id="sottotitolo-1")
    t.testo("il rischio OFA.", 24, 197, 15, 400, SOTTO, id="sottotitolo-2")
    segmenti(t, ["Attive", "Classifica", "Amici"], 0, y=231, h=40, x0=24, x1=366, gap=8, corpo=14.5)

    with t.gruppo("sfida-della-settimana"):
        t.rett(24, 288, 342, 281, 20, fill=t.sfumatura(["#EAF9F1", "#E2F5EB"]), stroke="#D6F0E3", sw=1, id="card-sfida-settimana")
        illu_in(t, "kit-rosso/illustrazioni/successo-superamento", 164, 304, 232, 388, soglia=60, per="altezza", id="trofeo")
        t.testo("SFIDA DELLA SETTIMANA", 195, 417, 11, 700, "#128A55", "middle", spaziatura=0.25)
        t.testo("Completa 5 lezioni", 195, 449, 20, 800, NAVY, "middle")
        t.rett(44, 482, 270, 11, 5.5, fill=t.sfumatura(["#2DC27E", "#12A263"], 0, 0, 1, 0), id="barra-sfida")
        t.testo("5/5", 346, 494, 17, 700, NAVY, "end")
        t.cerchio(60, 534, 15, fill="#FDE9B8")
        g_medaglia(t, 60, 534, 20, "#F59E0B")
        t.testo("+100 pt", 86, 540, 16, 600, NAVY)
        t.cerchio(336, 534, 22, fill=AZZ, filtro=t.ombra(2, 7, AZZ, 0.3), id="vai")
        t.icona("freccia-destra", 324, 522, 24, "#FFFFFF", 2.2)
    for i, c in enumerate((AZZ, "#D5DBE8", "#D5DBE8")):
        t.cerchio(180 + i * 15, 585, 3.2, fill=c)

    t.testo("Sfide attive", 24, 619, 20, 800, NAVY, id="sezione-sfide-attive")
    link_destra(t, "Vedi tutte", 366, 618, 14)
    righe = [("7 giorni di studio", 5, 7, "+150 pt", g_fiamma, "#FFF1DD"),
             ("Duello simulazione", 0, 1, "+200 pt", lambda t, x, y, s: t.icona("gruppo", x - s / 2, y - s / 2, s, "#EF4B58", 1.2), "#FDE7E9"),
             ("Grammar Sprint", 6, 10, "+80 pt", g_libro, "#E6F1FE")]
    y = 639
    for tit, v, tot, pt, gl, fondo in righe:
        with t.gruppo("sfida-" + tit.lower().replace(" ", "-")):
            tile_icona(t, 30, y, 48, fondo, 13)
            gl(t, 54, y + 24, 38 if gl is g_fiamma else 29)
            t.testo(tit, 94, y + 19, 16, 700, NAVY)
            t.barra(94, y + 32, 124, v / tot if v else 0, h=6, kit="blu", fondo="#ECEFF5")
            t.testo(f"{v}/{tot}", 265, y + 40, 13, 400, SOTTO, "end")
            t.testo(pt, 360, y + 40, 14, 700, ARANCIO, "end")
        y += 60
    tab_bar(t, NAV3, 2, h=84)
    return t
