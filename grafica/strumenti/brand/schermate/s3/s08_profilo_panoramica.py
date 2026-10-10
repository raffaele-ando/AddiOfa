"""06.008 · Profilo, panoramica (kit blu). Foto-avatar -> cerchio neutro; 'Project ID' con icona-documento disegnata.
L'originale è tagliato sotto «Obiettivi attivi»: schermata completata con la parte bassa (altri 2 obiettivi, Badge) come nella
rigenerazione 22.002 della stessa schermata, e tab-bar a 3 voci. Testo ricostruito: nomi dei badge (letti da 22.002)."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/008-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "08-profilo-panoramica.svg"


def disegna():
    t = schermata("profilo-panoramica", "blu", 880)
    t.barra_stato()
    logo_testata(t, 72)
    t.icona("ingranaggio", 332, 46, 26, "#1E3A9E", 1.8, id="impostazioni")
    avatar(t, 62, 134, 40, 0, id="avatar-profilo")
    t.testo("Raffaele", 124, 126, 25, 800, NAVY, id="nome")
    t.testo("@raffaele.ando", 124, 150, 16, 400, "#5A668F", id="username")
    freccia_dx(t, 350, 135, "#8A94A6", 14)
    with t.gruppo("project-id"):
        t.rett(18, 186, 342, 58, 18, fill="#EDF1FB", id="card-project-id")
        t.icona("documento", 32, 201, 28, AZZ, 1.9)
        t.testo("Project ID", 78, 210, 15.5, 700, NAVY)
        t.testo("#4821", 78, 230, 15, 400, "#5A668F")
        t.icona("copia", 326, 203, 22, NAVY, 1.8)
    with t.gruppo("statistiche-rapide"):
        for cx, v, l in ((58, "12", "livello"), (148, "320", "pt totali"), (238, "7", "giorni di studio"), (326, "3", "badge")):
            t.testo(v, cx, 280, 22, 800, NAVY, "middle")
            t.testo(l, cx, 297, 12.5, 400, SOTTO, "middle")
        for x in (103, 193, 283):
            t.linea(x, 262, x, 300, "#EEF1F6", 1, cap="butt")
    t.testo("I miei progressi", 18, 346, 19, 800, NAVY)
    link_destra(t, "Vedi tutti", 360, 345, 14)
    stat_tile(t, 18, 360, 105, 100, "Lezioni", ("24", "/60"), barra=0.4)
    stat_tile(t, 134, 360, 109, 100, "Simulazioni", "8", barra=0)
    stat_tile(t, 253, 360, 107, 100, "Punteggio medio", "72%", barra=0.72)
    t.testo("Obiettivi attivi", 18, 500, 19, 800, NAVY)
    link_destra(t, "Vedi tutti", 360, 499, 14)
    t.rett(18, 514, 342, 70, 18, fill="#EAF1FD", id="obiettivo-principale")
    tile_icona(t, 28, 523, 52, "#DDF3E7", 14)
    g_bersaglio(t, 54, 549, 36)
    t.testo("Supera l'OFA", 92, 540, 16.5, 800, NAVY)
    t.testo("Riduci il rischio sotto il 20%", 92, 557, 13, 400, "#5A668F")
    t.barra(92, 566, 172, 0.55, h=7, kit="blu", fondo="#D9E5FA")
    da_a(t, 346, 574, "82%", "28%")
    for x, ic, tx, val, tot in ((18, "giorno-cal", "Studia 30 giorni", 7, 30), (194, "trofeo", "Completa 10 simulazioni", 8, 10)):
        t.rett(x, 598, 166, 54, 14, fill="#FFFFFF", stroke="#EDF0F6", sw=1, filtro=t.ombra(2, 8, "#0F172A", 0.05))
        tile_icona(t, x + 8, 610, 30, "#EAF1FD", 9)
        t.icona(ic, x + 14, 616, 18, AZZ, 1.8)
        t.testo(tx, x + 46, 624, 9.8, 500, NAVY)
        t.barra(x + 46, 634, 70, val / tot, h=5, kit="blu", fondo="#ECEFF5")
        t.testo(f"{val}/{tot}", x + 156, 640, 10.5, 400, SOTTO, "end")
    t.testo("Badge", 18, 685, 19, 800, NAVY)
    link_destra(t, "Vedi tutti", 360, 684, 14)
    for cx, a, b, k in ((48, "7 giorni", "consecutivi", "fiamma"), (118, "10 lezioni", None, "libro"), (188, "Prima", "simulazione", "stella"),
                        (258, "Accuracy", "> 80%", "bersaglio"), (328, "Sfida", "completata", "lucchetto")):
        badge_riga(t, cx, 700, a, b, k)
    tab_bar(t, NAV3, None)
    return t
