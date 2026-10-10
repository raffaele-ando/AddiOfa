"""
Tessere social dell'immagine 26 (post 1:1, storie 9:16, reel, formati). Ogni funzione disegna in una tessera di (w, h) px
dell'originale; i contenuti sono impostati su una base di 130 px di larghezza e scalati (s = w/130).
Cielo, nuvole, volumi bianchi, carte, grafici, pulsanti, icone, testi: tutto vettoriale. Le foto (persone, edificio Polimi, laptop)
sono ritagli raster dall'originale, puliti dalle scritte cotte con inpainting.
"""
from lib import *


class sc:
    """with sc(t, w): disegna in base 130 px di larghezza, scalato."""
    def __init__(self, t, w):
        self.t, self.s = t, w / 130

    def __enter__(self):
        self.t.add(f'<g transform="scale({n(self.s)})">')
        return self.t

    def __exit__(self, *e):
        self.t.add("</g>")


def cielo_tessera(t, w, h, scuro=False, nuvole=True):
    if scuro:
        t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#0D2A7A", "#1E4FC0", "#4F8EEA"]), id="fondo-cielo-scuro")
    else:
        t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#2F6FDC", "#78B0F3", "#CFE5FC", "#F2F8FF"]), id="fondo-cielo")
    if nuvole:
        nuvola(t, w * 0.12, h * 0.42, w * 0.5, 0.9, id="nuvola-1")
        nuvola(t, w * 0.88, h * 0.25, w * 0.45, 0.85, id="nuvola-2")


def volumi(t, w, h, y0, id="volumi-bianchi"):
    """Volumi bianchi dell'edificio in basso (due piani inclinati)."""
    with t.gruppo(id):
        t.path(f"M0 {n(y0 + 12)}L{n(w * 0.55)} {n(y0)}L{n(w)} {n(y0 + 18)}V{n(h)}H0z", fill=t.sfumatura(["#F4F6FA", "#D5DCE8"]), id=id + "-piano-1")
        t.path(f"M{n(w * 0.45)} {n(h)}L{n(w * 0.7)} {n(y0 + 14)}L{n(w)} {n(y0 + 24)}V{n(h)}z", fill=t.sfumatura(["#E3E8F1", "#C3CCDB"]), id=id + "-piano-2")


def arco_82(t, cx, cy, r, sw, id="arco-82"):
    def pt(deg):
        a = math.radians(deg)
        return cx + r * math.cos(a), cy - r * math.sin(a)
    xa, ya = pt(200); xb, yb = pt(-20); xv, yv = pt(18)
    t.path(f"M{n(xa)} {n(ya)}A{n(r)} {n(r)} 0 0 1 {n(xb)} {n(yb)}", stroke="#E9EEF7", sw=sw, id=id + "-fondo")
    t.path(f"M{n(xa)} {n(ya)}A{n(r)} {n(r)} 0 0 1 {n(xv)} {n(yv)}", stroke=t.sfumatura(["#F58A8A", "#E5383B"], 0, 0, 1, 0), sw=sw, id=id + "-valore")
    t.cerchio(xv, yv, sw * 0.62, fill="#E5383B", stroke="#FFFFFF", sw=sw * 0.2, id=id + "-pallino")


def pulsante_avanti(t, cx, cy, r=11):
    t.cerchio(cx, cy, r, fill="#FFFFFF", id="pulsante-avanti", filtro=t.ombra(1, 4, "#0A1633", 0.2))
    t.icona("freccia-destra", cx - r * 0.5, cy - r * 0.5, r, "#0A1633", 2.4)


def card_vetro(t, x, y, w, h, righe=3, rot=-6, id="card-checklist", quiz=True):
    cx, cy = x + w / 2, y + h / 2
    with t.gruppo(id, trasforma=f"rotate({rot} {n(cx)} {n(cy)})"):
        t.rett(x, y, w, h, 8, fill="#FFFFFF", opacita=0.9, id=id + "-fondo", filtro=t.ombra(4, 12, "#0A2A8A", 0.28))
        for i in range(righe):
            yy = y + 9 + i * (h - 14) / righe
            col = ["#2A63F0", "#E5383B", "#2A63F0"][i % 3] if quiz else "#2A63F0"
            t.rett(x + 8, yy, 13, 13, 4, fill=col, id=f"{id}-casella-{i+1}")
            t.rett(x + 28, yy + 4, w - 40, 4, 2, fill="#BFD3F2", id=f"{id}-riga-{i+1}")


def f_quiz_time(t, w, h):
    cielo_tessera(t, w, h)
    volumi(t, w, h, h * 0.85)
    with sc(t, w):
        t.testo("Quiz", 14, 46, 23, 800, "#FFFFFF", id="titolo-riga-1", spaziatura=-0.3)
        t.testo("Time", 14, 70, 23, 800, "#FFFFFF", id="titolo-riga-2", spaziatura=-0.3)
        card_vetro(t, 22, 88, 90, 62, 3, -6)
        pulsante_avanti(t, 112, 176 if h > 190 else 150, 10)


def f_tre_consigli(t, w, h, chiaro=True):
    cielo_tessera(t, w, h)
    t.rett(0, 0, w, h, 0, fill="#FFFFFF", opacita=0.35)
    volumi(t, w, h, h * 0.84)
    with sc(t, w):
        t.testo("3", 14, 66, 46, 800, "#0A1633", id="titolo-numero")
        for i, r in enumerate(["consigli", "per l'OFA", "di inglese"]):
            t.testo(r, 14, 90 + i * 16, 14.5, 800, "#0A1633", id=f"titolo-riga-{i+1}", spaziatura=-0.2)
        stella4(t, 104, 38, 11, "#FFFFFF", id="scintilla", opacita=0.9)


def f_82(t, w, h):
    t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#EAF3FE", "#FFFFFF", "#EAF3FE"]), id="fondo-chiaro")
    nuvola(t, w * 0.2, h * 0.12, w * 0.6, 0.9); nuvola(t, w * 0.8, h * 0.95, w * 0.7, 0.9)
    with sc(t, w):
        arco_82(t, 65, 58, 38, 8)
        t.testo("82%", 65, 76, 21, 800, "#E5383B", ancora="middle", id="percentuale")
        for i, r in enumerate(["degli studenti", "rischia di non", "superare l'OFA."]):
            t.testo(r, 65, 112 + i * 12.5, 9.6, 400, "#10244E", ancora="middle", id=f"testo-riga-{i+1}")
        t.testo("Tu sei tra questi?", 65, 156, 9.2, 700, "#0A1633", ancora="middle", id="domanda")
        if h > 180:
            pulsante_avanti(t, 112, 186 if h > 205 else 176, 10) if False else None


def f_errori(t, w, h):
    t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#F3F7FE", "#FFFFFF"]), id="fondo-chiaro")
    with sc(t, w):
        for i, r in enumerate(["Errori comuni", "all'OFA", "di inglese"]):
            t.testo(r, 12, 30 + i * 14.5, 12.5, 800, "#0A1633", id=f"titolo-riga-{i+1}", spaziatura=-0.2)
        for i, r in enumerate(["Tempi verbali", "Preposizioni", "Reading", "Listening"]):
            yy = 94 + i * 24
            if i == 0:
                t.rett(10, yy - 8, 16, 16, 4, fill="#FDE2E3", id="errore-1-sfondo")
                t.path(f"M14 {yy-4}l8 8M22 {yy-4}l-8 8", stroke="#E5383B", sw=2.2)
            else:
                t.cerchio(18, yy, 8, fill="#E3E8F1", id=f"errore-{i+1}-tondo")
                t.testo(str(i + 1), 18, yy + 3.6, 9.5, 600, "#6B7280", ancora="middle")
            t.testo(r, 33, yy + 4, 9.6, 500, "#2A3447", id=f"errore-{i+1}-testo")


def f_checklist_scura(t, w, h):
    t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#0A1E55", "#07123A"]), id="fondo-notte")
    with sc(t, w):
        for i, r in enumerate(["La tua", "checklist", "pre esame"]):
            t.testo(r, 14, 38 + i * 17, 15, 800, "#FFFFFF", id=f"titolo-riga-{i+1}", spaziatura=-0.2)
        card_vetro(t, 18, 102, 88, 56, 2, -5, quiz=False)
        pulsante_avanti(t, 112, 176 if h > 190 else 150, 10)


def f_nuovo_quiz(t, w, h):
    cielo_tessera(t, w, h)
    with sc(t, w):
        t.testo("Nuovo", 65, 36, 16, 800, "#0A1633", ancora="middle", id="titolo-riga-1", spaziatura=-0.2)
        t.testo("quiz!", 65, 54, 16, 800, "#0A1633", ancora="middle", id="titolo-riga-2", spaziatura=-0.2)
        telefono(t, 22, 70, 98, 190, id="telefono-quiz", rot=-6, schermo=lambda tt, a, b, c, d: (tt.rett(a + 8, b + 14, c - 16, 40, 6, fill="#EEF3FB"), tt.rett(a + 10, b + 60, c - 20, 10, 5, fill="#FDEBEC")))
        pillola(t, 22, 190, 86, 18, "#1A63F2", "Gioca ora", "#FFFFFF", 8.5)


def f_lo_sapevi(t, w, h):
    cielo_tessera(t, w, h)
    with sc(t, w):
        stella4(t, 70, 28, 11, "#FFFFFF", id="scintilla")
        t.testo("Lo sapevi?", 65, 72, 14.5, 800, "#0A1633", ancora="middle", id="titolo")
        t.rett(14, 88, 102, 76, 10, fill="#FFFFFF", opacita=0.95, id="scheda-testo", filtro=t.ombra(2, 8, "#0A2A8A", 0.2))
        for i, r in enumerate(["Dal secondo anno", "non puoi sostenere", "alcuni esami se", "non superi l'OFA."]):
            t.testo(r, 22, 106 + i * 12, 8, 400, "#2A3447", id=f"testo-riga-{i+1}")
        pillola(t, 28, 182, 74, 18, "#FFFFFF", "Scopri di più", BLU_T, 8.3, id="pulsante-scopri")


def f_tip(t, w, h):
    t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#DCEAFD", "#F2F7FF", "#CFE2FB"]), id="fondo-pallido")
    with sc(t, w):
        t.testo("Tip", 65 - 14, 40, 20, 800, "#0A1633", ancora="middle", id="titolo-tip", spaziatura=-0.3)
        t.testo("del giorno", 65, 62, 17, 800, BLU_T, ancora="middle", id="titolo-del-giorno", spaziatura=-0.3)
        t.illustrazione("kit-blu/illustrazioni/suggerimenti-consigli", 30, 76, 70, id="lampadina")
        for i, r in enumerate(["Guarda serie in inglese", "con sottotitoli per", "abituarti all'ascolto."]):
            t.testo(r, 65, 160 + i * 10.5, 7.6, 400, "#2A3447", ancora="middle", id=f"testo-riga-{i+1}")
        t.icona("freccia-destra", 52, 188, 26, "#0A1633", 2)


def f_risultato(t, w, h):
    t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#E3EEFD", "#F7FAFF"]), id="fondo-pallido")
    with sc(t, w):
        t.testo("Risultato", 12, 36, 14, 800, "#0A1633", id="titolo-riga-1", spaziatura=-0.2)
        t.testo("personale", 12, 53, 14, 800, "#0A1633", id="titolo-riga-2", spaziatura=-0.2)
        for k in range(5):
            t.linea(12, 80 + k * 17, 118, 80 + k * 17, "#D5E0F2", 0.8)
        for i, hh in enumerate([22, 38, 58, 78]):
            t.rett(16 + i * 18, 150 - hh, 13, hh, 2.5, fill=t.sfumatura(["#4F8CF7", "#1F5FE0"]), id=f"barra-{i+1}")
        pillola(t, 72, 96, 48, 22, "#22A455", "+40%", "#FFFFFF", 10, id="distintivo-40")
        for i, r in enumerate(["Progresso medio", "dopo 2 settimane", "di pratica."]):
            t.testo(r, 12, 170 + i * 11, 7.8, 400, "#2A3447", id=f"testo-riga-{i+1}")


def f_motivazione(t, w, h):
    cielo_tessera(t, w, h, scuro=True)
    volumi(t, w, h, h * 0.8)
    with sc(t, w):
        t.testo("Motivazione", 12, 22, 11, 700, "#FFFFFF", id="titolo")
        stella4(t, 100, 54, 14, "#FFFFFF", id="scintilla")
        for i, r in enumerate(["Il tuo", "inglese", "sblocca", "nuove", "opportunità."]):
            t.testo(r, 12, 88 + i * 17, 14, 700 if i < 4 else 600, "#FFFFFF", id=f"messaggio-riga-{i+1}", spaziatura=-0.2)
        pulsante_avanti(t, 112, 188, 10)


def f_stessi_studenti(t, w, h, nome, box_abs, rects):
    p = foto_pulita(S26, box_abs, nome, rects)
    t.foto(p, 0, 0, w, h, id="foto-sfondo")


def reel_giu(t, w, h, testo):
    ico_play(t, 10, h - 13, 8, "#FFFFFF")
    t.testo(testo, 20, h - 9.5, 9.5, 500, "#FFFFFF", id="visualizzazioni")
