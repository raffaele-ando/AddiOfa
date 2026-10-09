"""Immagine 22 · app AddiOfa in kit blu: «Sfide» (con sfida della settimana, sfide attive, classifica settimanale) e «Profilo»
(Project ID, statistiche, progressi, obiettivi, badge). Originali 462x1024 px.

Corregge: i volti (foto) sono avatar disegnati; nel profilo «Punteggio medio» l'originale ha «+12%» doppio e storto («42%» con
freccia illeggibile): qui «+12%» con freccia in su, verde; icone dei badge e delle sfide ridisegnate pulite (fiamma, libro, stella,
bersaglio, lucchetto); tondo di moneta «+100 pt» ricostruito; l'etichetta «Sfida della settimana» e le altre scritte sono tutte
leggibili nell'originale (nessun testo ricostruito tranne il titolo del terzo punto della classifica, che è letto come «marti.s»).
Si lancia da solo: python3 g22.py
"""
import sys, math
import registro  # noqa
from comuni import *
from extra import *

BLU_T = "#0F6BFF"
TIT = "#0B1033"
GR = "#5E6A86"
GR2 = "#8A94AB"
VERDE_T = "#1F9E5A"


def testata_app(t, destra="avatar"):
    barra_stato(t, 44, 412, 30, corpo=17)
    logo(t, 25, 76, larg=94)
    if destra == "avatar":
        persona(t, "m1", 397, 67, 18, id="avatar-profilo", bordo=None)
    else:
        I(t, "impostazioni", 399, 67, 23, "#14204A", 1.8, id="impostazioni")


def sezione(t, titolo, y, lt, azione, la, x=21, x1=416):
    T(t, titolo, x, y, None, 800, TIT, larg=lt, id="titolo-" + titolo.lower().replace(" ", "-"))
    T(t, azione, x1, y, None, 500, BLU_T, "end", larg=la, id="azione-" + azione.lower().replace(" ", "-"))


def s01():
    t = nuova("22-01-sfide")
    testata_app(t)
    T(t, "Sfide", 23, 131, None, 800, TIT, larg=80, id="titolo")
    righe_t(t, ["Studia, completa sfide, scala la classifica", "e riduci il rischio OFA."], 23, 158, 15.2, 19.5, 400, "#5B6580",
            larg=[283, 149], id="sottotitolo")
    with t.gruppo("schede"):
        R(t, 22, 199, 101, 36, 10, t.sfumatura(["#1473FF", "#0A63F2"]), id="scheda-attive", filtro=t.ombra(t.p(2), t.p(8), "#0F6BFF", 0.25))
        T(t, "Attive", 72, 222, None, 500, "#FFFFFF", "middle", larg=36)
        R(t, 133, 199, 94, 36, 10, "#F1F4F9", id="scheda-classifica")
        T(t, "Classifica", 188, 222, None, 500, "#8A94AB", "middle", larg=57)
        R(t, 253, 199, 105, 36, 10, "#F1F4F9", id="scheda-amici")
        T(t, "Amici", 305, 222, None, 500, "#8A94AB", "middle", larg=33)
        R(t, 373, 199, 42, 38, 11, "#FFFFFF", id="calendario-fondo", filtro=t.ombra(t.p(1), t.p(6), "#0F172A", 0.08))
        I(t, "calendario", 394, 217, 19, "#0F4FD0", 1.9, id="calendario")
    # sfida della settimana
    with t.gruppo("sfida-della-settimana"):
        R(t, 21, 254, 399, 186, 18, t.sfumatura(["#E9F8EF", "#DFF5E8"]), id="sfida-fondo")
        C(t, 74, 306, 29, "#CBEFDA", opacita=0.55, id="sfida-icona-alone")
        I(t, "bersaglio-freccia", 74, 306, 50, "#14A863", 2.1, id="sfida-icona")
        T(t, "SFIDA DELLA SETTIMANA", 129, 279, None, 600, VERDE_T, larg=122, id="sfida-etichetta")
        T(t, "5 giorni rimanenti", 403, 279, None, 500, VERDE_T, "end", larg=79, id="sfida-scadenza")
        T(t, "Completa 5 lezioni", 129, 302, None, 700, TIT, larg=151, id="sfida-titolo")
        T(t, "Completa 5 lezioni di qualsiasi argomento", 129, 329, None, 400, "#5C6B66", larg=230, id="sfida-testo-1")
        T(t, "questa settimana.", 129, 346, None, 400, "#5C6B66", larg=97, id="sfida-testo-2")
        R(t, 40, 364, 320, 12, 6, "#FFFFFF", id="sfida-barra-fondo", opacita=0.85)
        R(t, 40, 364, 192, 12, 6, t.sfumatura(["#3CCB8E", "#10B26C"], 0, 0, 1, 0), id="sfida-barra-valore")
        T(t, "3/5", 387, 377, None, 600, TIT, "end", larg=24, id="sfida-avanzamento")
        C(t, 56, 407, 13, "#FDBA3B", id="moneta"); C(t, 56, 407, 9.5, "#FFFFFF", opacita=0.5)
        I(t, "stella", 56, 407, 11, "#F59E0B", 1, id="moneta-stella")
        T(t, "+100 pt", 80, 413, None, 600, TIT, larg=52, id="sfida-punti")
        C(t, 382, 407, 18, t.sfumatura(["#1D78FF", "#0A5FEF"]), id="sfida-vai", filtro=t.ombra(t.p(2), t.p(7), "#0F6BFF", 0.3))
        I(t, "freccia-destra", 382, 407, 17, "#FFFFFF", 2.2)
    for i, c in enumerate(("#0F6BFF", "#CBD5E6", "#CBD5E6")):
        C(t, 205 + i * 14.5, 450, 3.4, c, id=f"pagina-{i + 1}")
    sezione(t, "Sfide attive", 477, 96, "Vedi tutte", 58)
    cards = (("7 giorni di studio", ["Studia almeno un giorno per 7 giorni", "consecutivi."], [186, 62], 5 / 7, "5/7", "+150 pt", "#FFF1E0", "fiamma", "#F5821F", 520),
             ("Duello simulazione", ["Sfida un altro studente in una", "simulazione di 40 domande."], [150, 143], 0.0, "0/1", "+200 pt", "#FFE7E7", "gruppo", "#EF4444", 623),
             ("Grammar Sprint", ["Completa 10 esercizi di grammatica."], [198], 0.6, "6/10", "+80 pt", "#E3EFFE", "libro-pieno", "#2D78F0", 724))
    for i, (tit, sub, lw, v, fr, pt, fondo, ic, col, yb) in enumerate(cards):
        y0 = yb - 24
        with t.gruppo(f"sfida-attiva-{i + 1}"):
            scheda_ombra(t, 21, y0, 397, 88, 14, "#FFFFFF", "#F1F3F8", 0.05, id=f"sfida-attiva-{i + 1}-fondo")
            R(t, 33, y0 + 8, 47, 47, 12, fondo, id="tile")
            if ic == "fiamma":
                I(t, "fiamma", 56, y0 + 32, 28, col, 1, id="icona")
                I(t, "fiamma", 56, y0 + 36, 14, "#FFC56B", 1)
            else:
                I(t, ic, 56, y0 + 32, 28, col, 1.8, id="icona", fill_pieno=col if ic == "libro-pieno" else None)
            T(t, tit, 95, yb + 1, None, 700, TIT, larg={"7 giorni di studio": 113, "Duello simulazione": 127, "Grammar Sprint": 111}[tit], id="titolo")
            for j, (r_, w) in enumerate(zip(sub, lw)):
                T(t, r_, 95, yb + 18 + j * 17, None, 400, GR, larg=w, id=f"testo-{j + 1}")
            yb2 = yb + 47 if len(sub) == 2 else yb + 36
            R(t, 95, yb2 - 4, 177, 8, 4, "#EBEFF6")
            if v > 0:
                R(t, 95, yb2 - 4, max(8, 177 * v), 8, 4, t.sfumatura(["#4D9AFF", "#2A78F2"], 0, 0, 1, 0))
            T(t, fr, 303, yb2 + 4, None, 500, "#2B3550", "end", larg=len(fr) * 6.4)
            T(t, pt, 333, yb2 + 4, None, 600, "#F59E0B", larg=47)
            I(t, "chevron-destra", 402, y0 + 41, 9, "#7C86A0", 2)
    sezione(t, "Classifica settimanale", 820, 180, "Vedi completa", 88)
    with t.gruppo("podio"):
        R(t, 154, 840, 128, 90, 12, "#FFF3E2", id="podio-primo-evidenza")
        corona(t, 219, 836, 22, "#F4B72C", 1, num_col="none", id="podio-corona")
        for cx, pers, pos, col, nome, pt in ((90, "m3", "2", "#A9B3C7", "giulia.p", "1.240 pt"), (219, "f2", "1", "#F59E0B", "ale.dis", "1.560 pt"), (348, "f1", "3", "#E5252A", "marti.s", "1.120 pt")):
            persona(t, pers, cx, 873, 16.5, id=f"podio-{pos}-avatar")
            T(t, pos, cx - (40 if pos != "3" else 38), 893, 17, 700, col, "middle", id=f"podio-{pos}-posizione")
            T(t, nome, cx, 909, None, 600, TIT, "middle", larg=len(nome) * 5.1)
            T(t, pt, cx, 923, None, 400, GR2, "middle", larg=38)
    nav(t, [("casa-contorno", "Home"), ("barre-contorno", "Studia"), ("trofeo", "Sfide")], 2, 940, 67, corpo=12.5, ico=24, y_ico=16, y_lab=43,
        indicatore=False, icone_attive={"trofeo": "trofeo-pieno"}, centri=[73, 218, 362])
    return chiudi(t)


def mini(t, x, w, ic, col, tile, lab, val, sub, vf, sub_col="#8A94AB", trend=False):
    with t.gruppo(f"progresso-{lab.lower()}"):
        scheda_ombra(t, x, 407, w, 116, 12, "#FFFFFF", "#F1F3F8", 0.04, id="fondo")
        R(t, x + 12, 418, 28, 28, 8, tile, id="tile")
        I(t, ic, x + 26, 432, 18, col, 1.8, id="icona", fill_pieno=col if ic in ("barre-crescenti",) else None)
        T(t, lab, x + 12, 465, 10.8, 400, GR)
        T(t, val, x + 12, 489, 17, 700, TIT)
        T(t, sub, x + 12, 503, 10.4, 400, sub_col)
        if trend:
            I(t, "freccia-trend", x + 50, 498, 11, "#16A765", 2.2)
        R(t, x + 12, 511, w - 24, 6, 3, "#EAEFF7")
        R(t, x + 12, 511, (w - 24) * vf, 6, 3, t.sfumatura(["#4D9AFF", "#2A78F2"], 0, 0, 1, 0))


def s02():
    t = nuova("22-02-profilo")
    testata_app(t, "gear")
    persona(t, "m1", 72, 152, 47, id="avatar-profilo")
    T(t, "Raffaele", 143, 137, None, 700, TIT, larg=83, id="nome")
    T(t, "@raffaele.ando", 143, 166, None, 400, GR, larg=108, id="utente")
    I(t, "chevron-destra", 403, 152, 12, "#5E6A86", 2, id="profilo-vai")
    with t.gruppo("project-id"):
        R(t, 20, 211, 397, 66, 16, "#EDF1FA", id="project-id-fondo")
        R(t, 41, 233, 26, 24, 5, "#2F6FF0", id="project-id-icona")
        R(t, 45, 238, 8, 14, 1.5, "#FFFFFF", opacita=0.9); R(t, 56, 238, 7, 3, 1.4, "#FFFFFF", opacita=0.9); R(t, 56, 244, 7, 3, 1.4, "#FFFFFF", opacita=0.9)
        T(t, "Project ID", 92, 238, None, 600, TIT, larg=69)
        T(t, "#4821", 92, 261, None, 400, GR, larg=36)
        I(t, "copia", 389, 244, 20, "#14204A", 1.8, id="project-id-copia")
    for cx, v, lab, lw in ((67, "12", "livello", 33), (171, "320", "pt totali", 45), (276, "7", "giorni di studio", 80), (377, "3", "badge", 31)):
        T(t, v, cx, 316, None, 700, TIT, "middle", larg=len(v) * 11.3, id=f"statistica-{lab}-valore")
        T(t, lab, cx, 338, None, 400, GR, "middle", larg=lw, id=f"statistica-{lab}-etichetta")
    L(t, 223, 300, 223, 340, "#EEF1F6", 1); L(t, 328, 300, 328, 340, "#EEF1F6", 1)
    sezione(t, "I tuoi progressi", 391, 122, "Vedi dettagli", 71)
    mini(t, 20, 121, "libro", "#2D78F0", "#EAF1FD", "Lezioni", "24/60", "completate", 0.4)
    mini(t, 155, 131, "bersaglio-freccia", "#14A863", "#DDF6E8", "Simulazioni", "8", "completate", 0.27)
    mini(t, 291, 126, "barre-crescenti", "#34C27A", "#DDF6E8", "Punteggio medio", "72%", "+12%", 0.72, sub_col="#16A765", trend=True)
    sezione(t, "Obiettivi", 580, 69, "Vedi tutti", 52)
    with t.gruppo("obiettivo-supera-ofa"):
        R(t, 20, 593, 397, 69, 14, "#EAF1FD", id="fondo")
        C(t, 57, 626, 24, "#CBEFDA", opacita=0.5)
        I(t, "bersaglio-freccia", 57, 626, 44, "#14A863", 2.1, id="icona")
        T(t, "Supera l’OFA", 104, 618, None, 600, TIT, larg=89)
        T(t, "Riduci il rischio sotto il 20%", 104, 636, None, 400, GR, larg=151)
        R(t, 104, 648, 206, 8, 4, "#D5E3FA"); R(t, 104, 648, 131, 8, 4, t.sfumatura(["#2F86FF", "#0F6BFF"], 0, 0, 1, 0))
        T(t, "82%", 312, 657, None, 600, "#2B3550", larg=29)
        I(t, "freccia-destra", 354, 653, 12, "#2B3550", 2)
        T(t, "28%", 390, 657, None, 600, "#2B3550", "end", larg=29)
    for x, w, ic, tit, lw, v, fr in ((20, 191, "calendario", "Studia 30 giorni", 79, 7 / 30, "7/30"), (224, 193, "trofeo", "Completa 10 simulazioni", 120, 0.8, "8/10")):
        with t.gruppo(f"obiettivo-{tit.lower().replace(' ', '-')}"):
            scheda_ombra(t, x, 681, w, 61, 12, "#FFFFFF", "#F1F3F8", 0.04, id="fondo")
            I(t, ic, x + 25, 711, 22, "#2D78F0", 1.9, id="icona")
            xt = x + 53
            T(t, tit, xt, 703, None, 500, "#2B3550", larg=lw)
            bw = w - 53 - 56
            R(t, xt, 717, bw, 6, 3, "#EAEFF7"); R(t, xt, 717, bw * v, 6, 3, t.sfumatura(["#4D9AFF", "#2A78F2"], 0, 0, 1, 0))
            T(t, fr, x + w - 14, 727, 10.6, 400, GR2, "end")
    sezione(t, "Badge", 788, 49, "Vedi tutti", 52)
    for cx, tile, col, ic, l1, l2 in ((55, "#E3EFFE", "#2F6FF0", "fiamma", "7 giorni", "consecutivi"), (136, "#FFF1E0", "#2F6FF0", "libro-pieno", "10 lezioni", None),
                                      (217, "#F1E7FD", "#7C3AED", "stella", "Prima", "simulazione"), (298, "#DDF6E8", "#17A864", "bersaglio-freccia", "Accuracy", "> 80%"),
                                      (380, "#EEF1F6", "#B7BFD0", "lucchetto", "Sfida", "completata")):
        with t.gruppo(f"badge-{l1.lower()}"):
            R(t, cx - 26, 805, 52, 52, 14, tile, id="tile")
            C(t, cx, 831, 21, col, id="tondo")
            I(t, ic, cx, 831, 21, "#FFFFFF", 1.8, id="icona", fill_pieno="#FFFFFF" if ic in ("fiamma", "libro-pieno", "stella", "lucchetto") else None)
            T(t, l1, cx, 872, 10.6, 400, GR, "middle")
            if l2:
                T(t, l2, cx, 887, 10.6, 400, GR, "middle")
    nav(t, [("casa-contorno", "Home"), ("barre-contorno", "Studia"), ("trofeo", "Sfide")], -1, 940, 67, corpo=12.5, ico=24, y_ico=16, y_lab=43,
        indicatore=False, centri=[75, 216, 360])
    return chiudi(t)


if __name__ == "__main__":
    s01(); s02()
