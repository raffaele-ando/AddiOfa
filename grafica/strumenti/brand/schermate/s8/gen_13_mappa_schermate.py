"""Immagine 13 (mappa delle schermate ATLAS / NOI / Agora): 15 schermate dell'app, ognuna in un proprio SVG.

Le 13 schermate/grafiche catalogate (13.001-13.013) sono ritagli dal foglio, spesso con pezzi dei vicini e con le scritte di
didascalia ("4. Lezione"): si ridisegna solo il telefono. Tre schermate della mappa (3 Home, 5 Simulazione, 7 Profilo) non sono
tra gli elementi catalogati: sono disegnate lo stesso dal foglio intero (design-concept/file_000000003c40...png).

Ogni schermata e' disegnata nelle COORDINATE DEL SUO RITAGLIO SORGENTE (px) dentro un gruppo traslato e scalata a 390 punti di
larghezza (Tela.da_originale sul riquadro del telefono): si legge il numero dall'immagine e lo si scrive.

Corregge: Profilo nell'originale ha 4 voci di navigazione (manca Studio): qui 5 come tutte le altre; la barra di navigazione di
Agora ha 'Agora' al posto di NOI (come in originale: la terza voce e' la sezione corrente); simboli pieni/contorno coerenti;
nel radar 'La tua analisi' i cinque assi sono a 72 gradi esatti (nell'originale il pentagono e' storto); pentagoni sovrapposti
puliti; scritte sovrapposte ('Produzione scritta' / 'Comprensione') sistemate; titoli e nomi dei volti: foto raster.
Testi ricostruiti: le sottoscritte tagliate della 'Lezione' non ce ne sono; 'Prossimo passo' del Home e' leggibile. Nessun testo
inventato. Le illustrazioni astratte dentro le card di Esplora (onde, sfere, arco) sono rifatte come forme semplici vettoriali."""
import sys, pathlib, math
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *
from ui import clip_rett
import ui as _ui

CART = "13-mappa-schermate-atlas-noi-agora"
EL = CONCEPT / CART
FOGLIO = RADICE / "fonti" / "design-concept" / "file_000000003c4081f49a2084c79e44f624.png"
NAVY = "#0B1033"; AZZ = "#1D6BF2"; GRI = "#66708F"; GRI2 = "#8A94A6"
VERDE_N = "#0B6B4B"; VERDE_A = "#16A765"; ARA = "#F97316"


class TelaF(Tela):
    """Tela con filtri ombra sull'area giusta anche quando il contenuto e' traslato (origine del riquadro sorgente)."""
    off = (0.0, 0.0)

    def ombra(self, dy=3, sfoca=6, colore="#0F172A", opacita=0.10, dx=0):
        chiave = ("ombra", dx, dy, sfoca, colore, opacita)
        if chiave in self._chiavi:
            return self._chiavi[chiave]
        fid = self.uid("om")
        ox, oy = self.off
        self.defs.append(
            f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="{n(ox - 40)}" y="{n(oy - 40)}" width="{n(self.w + 80)}" height="{n(self.h + 80)}" '
            f'color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="{n(sfoca / 2)}"/>'
            f'<feOffset dx="{n(dx)}" dy="{n(dy)}" result="o"/><feFlood flood-color="{colore}" flood-opacity="{n(opacita)}"/>'
            f'<feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
        self._chiavi[chiave] = f"url(#{fid})"
        return self._chiavi[chiave]


def apri(box, id):
    x0, y0, x1, y1 = box
    k = 390 / (x1 - x0)
    t = TelaF(390, round((y1 - y0) * k, 2), "#FFFFFF", id)
    t.p = lambda v: v * k
    t.k = k
    t.off = (x0 * k, y0 * k)
    t.add(f'<g id="contenuto" transform="translate({n(-x0 * k)} {n(-y0 * k)})">')
    t._box = box
    return t


def chiudi(t):
    t.add("</g>")
    return t


def faccia(t, sorg, cx, cy, r, id):
    f = ritaglio(sorg, (int(cx - r), int(cy - r), int(cx + r) + 1, int(cy + r) + 1))
    p = t.p
    t.foto(f, p(cx - r), p(cy - r), p(2 * r), p(2 * r), p(r), id=id)


def sbar(t, x0, x1, y, corpo=9):
    barra_stato(t, x0, x1, y, corpo=corpo)


def intest(t, x, y, testo, larg, colore=NAVY, peso=800):
    T(t, testo, x, y, larg=larg, peso=peso, colore=colore, id="titolo-schermata")


def pill(t, x, y, w, h, testo, attivo, col_att=AZZ, fondo_in="#EEF1F6", corpo=8.5, col_testo_in=GRI, fondo_att=None):
    R(t, x, y, w, h, h * 0.36, (fondo_att or col_att) if attivo else fondo_in)
    lw = larghezza_testo(testo, corpo, 600) / t.k if False else None
    T(t, testo, x + w / 2, y + h / 2 + corpo * 0.36, corpo, 600, "#FFFFFF" if attivo and not fondo_att else (col_att if attivo else col_testo_in), "middle")


NAV_VOCI = [("casa-contorno", "Home"), ("barre-contorno", "ATLAS"), ("gruppo", "NOI"), ("libro", "Studio"), ("utente-contorno", "Profilo")]
ATT = {"casa-contorno": "casa", "barre-contorno": "barre-crescenti", "gruppo": "gruppo-tre", "utente-contorno": "utente", "libro": "libro-pieno"}


def nav5(t, attiva, y, h, centri, y_ico, y_lab, x0, x1, corpo=7.5, ico=16, col=None, voci=None):
    nav(t, voci or NAV_VOCI, attiva, y, h, corpo=corpo, ico=ico, x0=x0, x1=x1, indicatore=False, centri=centri,
        y_ico=y_ico, y_lab=y_lab, icone_attive=ATT, col_attivo=col)


def chev(t, x, y, d=11, col="#7A869C"):
    I(t, "chevron-destra", x, y, d, col, 2.0)


# ---------------------------------------------------------------------------- 1 splash (el 004)
def s_splash():
    t = apri((5, 0, 189, 457), "splash")
    sbar(t, 23, 177, 20)
    c = fit("AddiOfa", 800, 113)
    wa = T(t, "Addi", 37, 181, corpo=c, peso=800, colore="#0B1033", id="logo-addi")
    T(t, "Ofa", 37 + wa, 181, corpo=c, peso=800, colore=AZZ, id="logo-ofa")
    T(t, "Supera l'OFA di inglese.", 95, 217, larg=114, peso=400, colore=GRI, ancora="middle")
    T(t, "Senza blocchi.", 95, 233, larg=68, peso=400, colore=GRI, ancora="middle")
    g = t.sfumatura(["#0B6BFF", "#3E97FF"], 0, 0, 1, 0)
    p = t.p
    d = (f"M{n(p(5))} {n(p(346))}C{n(p(40))} {n(p(322))} {n(p(80))} {n(p(314))} {n(p(112))} {n(p(316))}C{n(p(160))} {n(p(320))} {n(p(186))} {n(p(350))} {n(p(187))} {n(p(385))}"
         f"L{n(p(187))} {n(p(440))}Q{n(p(187))} {n(p(456))} {n(p(170))} {n(p(456))}L{n(p(115))} {n(p(456))}C{n(p(118))} {n(p(420))} {n(p(100))} {n(p(372))} {n(p(52))} {n(p(370))}"
         f"C{n(p(30))} {n(p(370))} {n(p(15))} {n(p(378))} {n(p(5))} {n(p(388))}z")
    t.path(d, fill=g, id="arco-blu")
    return chiudi(t)


# ---------------------------------------------------------------------------- 2 onboarding (el 005)
def s_onboarding():
    t = apri((3, 0, 167, 458), "onboarding")
    sbar(t, 7, 160, 20)
    c = fit("AddiOfa", 800, 103)
    wa = T(t, "Addi", 29, 91, corpo=c, peso=800, colore="#0B1033", id="logo-addi")
    T(t, "Ofa", 29 + wa, 91, corpo=c, peso=800, colore=AZZ, id="logo-ofa")
    T(t, "Studia in modo mirato", 80, 136, larg=130, peso=400, colore=GRI, ancora="middle")
    T(t, "e riduci il rischio", 80, 155, larg=94, peso=400, colore=GRI, ancora="middle")
    T(t, "di fallire l'OFA.", 80, 173, larg=83, peso=400, colore=GRI, ancora="middle")
    t.illustrazione("kit-blu/illustrazioni/quiz-test", t.p(14), t.p(190), t.p(132), "illustrazione-quiz")
    C(t, 59, 344, 4.2, AZZ); C(t, 80, 344, 4.2, "#DDE2EC"); C(t, 100, 344, 4.2, "#DDE2EC")
    R(t, 3, 368, 153, 34, 9, t.sfumatura(["#1673FF", "#0B66F5"], 0, 0, 1, 0), id="pulsante-inizia", filtro=ombra(t, 2, 7, "#2563EB", 0.2))
    T(t, "Inizia", 80, 390, larg=25, peso=600, colore="#FFFFFF", ancora="middle")
    I(t, "freccia-destra", 138, 385, 15, "#FFFFFF", 2)
    T(t, "Ho già un account", 80, 428, larg=70, peso=600, colore=AZZ, ancora="middle")
    return chiudi(t)


# ---------------------------------------------------------------------------- 3 home (foglio)
def s_home():
    t = apri((388, 48, 597, 508), "home")
    sbar(t, 405, 582, 59)
    wa = T(t, "Addi", 400, 90, corpo=24, peso=800, colore="#0B1033", spaz=-0.5, id="logo-addi")
    T(t, "Ofa", 400 + wa - 0.5, 90, corpo=24, peso=800, colore=AZZ, spaz=-0.5, id="logo-ofa")
    C(t, 570, 85, 13, "#DCE8FB", id="avatar-r-fondo"); T(t, "R", 570, 91, corpo=16, peso=700, colore=AZZ, ancora="middle")
    s = STATI["alto"]
    misuratore_rischio(t, 491, 215, 81, 0.76, 13, s["colore"], s["chiaro"], vuoto="#E8EDF5", alone=s["alone"], estremi=False)
    T(t, "82%", 493, 199, larg=52, peso=800, colore=s["num"], ancora="middle", id="percentuale")
    T(t, "Rischio di fallimento", 493, 218, larg=91, peso=600, colore=s["num"], ancora="middle")
    T(t, "all'OFA di inglese", 493, 232, larg=71, peso=400, colore=GRI, ancora="middle")
    R(t, 400, 252, 185, 70, 12, "#FDEEEE", id="card-prossimo-passo")
    tile_icona(t, "libro", 402, 261, 38, sw=1.8)
    T(t, "Prossimo passo", 450, 271, larg=61, peso=400, colore=GRI)
    T(t, "Future tenses", 450, 287, larg=70, peso=700)
    I(t, "libro", 455, 300, 12, GRI, 1.6); T(t, "Lezione", 463, 305, larg=30, peso=400, colore=GRI)
    L(t, 501, 296, 501, 306, "#E6C9C9", 1)
    I(t, "orologio", 509, 300, 12, GRI, 1.6); T(t, "10 min", 518, 305, larg=23, peso=400, colore=GRI)
    L(t, 549, 296, 549, 306, "#E6C9C9", 1)
    T(t, "-6%", 560, 305, larg=19, peso=700, colore=AZZ)
    pulsante_azione(t, 400, 323, 185, 37, "Inizia la lezione", 11.5, r=9, icona=None, x_testo=448, peso=500)
    T(t, "Il tuo percorso", 400, 387, larg=71, peso=700)
    grafico_percorso(t, 410.6, 562, (407, 419, 426), 441, 451, valori=("82%", "62%", "28%"), etichette=("Oggi", "Dopo 5 lezioni", "Dopo 15 lezioni"),
                     corpo_v=9.5, corpo_e=7.5, r_pt=4, xs=(410.6, 484, 562), id="percorso")
    nav5(t, 0, 462, 46, [409, 450.6, 490.6, 532, 572.5], 17.5, 34, 388, 597, corpo=7.8, ico=17)
    return chiudi(t)


# ---------------------------------------------------------------------------- 4 lezione (el 001)
def opzione(t, x, y, w, h, testo, sel, lw):
    if sel:
        R(t, x, y, w, h, 9, "#EAF2FE", stroke="#8DBBFA", sw=1.4)
        C(t, x + 19, y + h / 2, 7.2, "#FFFFFF", stroke=AZZ, sw=4.2)
        T(t, testo, x + 39, y + h / 2 + 4, larg=lw, peso=700, colore=AZZ)
    else:
        R(t, x, y, w, h, 9, "#FFFFFF", stroke="#E7EAF1", sw=1.2)
        C(t, x + 19, y + h / 2, 6.6, "none", stroke="#D3D7E3", sw=1.6)
        T(t, testo, x + 39, y + h / 2 + 4, larg=lw, peso=500, colore="#4B5578")


def s_lezione():
    t = apri((0, 34, 171, 490), "lezione")
    sbar(t, 10, 165, 53)
    I(t, "chevron-sinistra", 9, 73, 14, NAVY, 2.2)
    T(t, "Future tenses", 84, 78, larg=64, peso=700, ancora="middle")
    R(t, 7, 94, 125, 4.5, 2.2, "#EEF1F6"); R(t, 7, 94, 29, 4.5, 2.2, t.sfumatura(["#3B82F6", "#1D6BF2"], 0, 0, 1, 0), id="avanzamento-quiz")
    T(t, "3/10", 165, 100, larg=17, peso=400, colore=GRI, ancora="end")
    T(t, "Completa la frase", 7, 144, larg=113, peso=800, id="titolo-quesito")
    T(t, "We", 7, 185, larg=13, peso=400, colore=GRI)
    L(t, 30, 187, 68, 187, "#7B86A5", 1.1)
    T(t, "to Milan", 72, 185, larg=47, peso=400, colore=GRI)
    T(t, "tomorrow.", 7, 203, larg=61, peso=400, colore=GRI)
    for i, (te, sel, lw) in enumerate((("go", False, 12), ("goes", False, 19), ("will go", True, 31), ("are going", False, 44))):
        opzione(t, 6, 223 + i * 34.3, 159, 31, te, sel, lw)
    R(t, 6, 374, 159, 44, 9, "#E3F6EA", id="esito-corretto")
    C(t, 27, 396, 9.5, "#16A765", stroke="#FFFFFF", sw=1.6); I(t, "spunta", 27, 396, 11, "#FFFFFF", 3)
    T(t, "Corretto!", 46, 402, larg=51, peso=700, colore="#0B7A4A")
    R(t, 6, 424, 159, 34, 9, t.sfumatura(["#1673FF", "#0B66F5"], 0, 0, 1, 0), id="pulsante-avanti", filtro=ombra(t, 2, 7, "#2563EB", 0.2))
    T(t, "Avanti", 84, 445, larg=26, peso=600, colore="#FFFFFF", ancora="middle")
    I(t, "freccia-destra", 146, 441, 14, "#FFFFFF", 2)
    return chiudi(t)


# ---------------------------------------------------------------------------- 5 simulazione (foglio)
def s_simulazione():
    t = apri((800, 46, 965, 505), "simulazione")
    sbar(t, 814, 964, 64)
    I(t, "chevron-sinistra", 814, 87, 13, NAVY, 2.2)
    T(t, "Simulazione", 886.6, 92, larg=62, peso=700, ancora="middle")
    R(t, 811, 108, 152, 4.5, 2.2, "#EEF1F6"); R(t, 811, 108, 37, 4.5, 2.2, t.sfumatura(["#3B82F6", "#1D6BF2"], 0, 0, 1, 0), id="avanzamento-simulazione")
    C(t, 925, 138.5, 5.6, "none", stroke=NAVY, sw=1.7); L(t, 925, 138.5, 925, 135, NAVY, 1.5); L(t, 922, 131.5, 928, 131.5, NAVY, 1.6)
    T(t, "32:15", 963, 143, larg=27, peso=700, ancora="end", id="timer")
    T(t, "Domanda 12/40", 812, 171, larg=42.5, peso=400, colore=GRI2)
    T(t, "Choose the correct form.", 812, 193, larg=130, peso=500, colore=NAVY)
    T(t, "By next year, I", 812, 225, larg=78, peso=400, colore=GRI)
    L(t, 890, 227, 928, 227, "#7B86A5", 1.1)
    T(t, "in Milan for five years.", 812, 242, larg=118, peso=400, colore=GRI)
    for i, (te, sel, lw) in enumerate((("will live", False, 31), ("will have been living", True, 92), ("have lived", False, 43), ("am living", False, 41))):
        opzione(t, 811, 267.5 + i * 36.8, 152, 31.5, te, sel, lw)
    R(t, 811, 454, 68, 31, 8, "#FFFFFF", stroke="#E7EAF1", sw=1.2)
    I(t, "commento", 828, 469.5, 11, GRI, 1.8); T(t, "Segnala", 837, 473, larg=30, peso=400, colore=GRI)
    R(t, 884, 454, 79, 31, 8, t.sfumatura(["#1673FF", "#0B66F5"], 0, 0, 1, 0), id="pulsante-avanti")
    T(t, "Avanti", 914, 473, larg=26, peso=600, colore="#FFFFFF", ancora="middle")
    I(t, "freccia-destra", 947, 469.5, 13, "#FFFFFF", 2)
    return chiudi(t)


# ---------------------------------------------------------------------------- 6 esplora (el 002)
def card_sezione(t, y, h, tit, wt, righe, grad, deco):
    p = t.p
    cl = clip_rett(t, p(17), p(y), p(170), p(h), p(11))
    with t.gruppo("card-" + tit.lower().replace("à", "a"), clip=cl):
        R(t, 17, y, 170, h, 0, t.sfumatura(grad, 0, 0, 1, 1), id="sfondo-" + tit.lower().replace("à", "a"))
        deco(t, y, h)
        T(t, tit, 30, y + 32, larg=wt, peso=800, colore="#FFFFFF", id="titolo-card")
        for i, (r_, lw) in enumerate(righe):
            T(t, r_, 30, y + 55 + i * 13.5, larg=lw, peso=400, colore="#E7EEFF")
        I(t, "freccia-destra", 169, y + h - 18, 12, "#FFFFFF", 1.8)


def deco_atlas(t, y, h):
    for dx, dy, r_, col, op in ((165, y + 50, 50, "#2E6BFF", 0.55), (150, y + 70, 42, "#1D4FD8", 0.6), (178, y + 95, 40, "#0B2A8A", 0.7)):
        C(t, dx, dy, r_, col, opacita=op)
        C(t, dx, dy, r_ - 8, "none", stroke="#8FB4FF", sw=1, opacita=0.35)


def deco_noi(t, y, h):
    C(t, 155, y + 70, 28, "#3DBA6E", opacita=0.85); C(t, 175, y + 40, 24, "#0F8F5A", opacita=0.9); C(t, 178, y + 82, 17, "#127A52", opacita=0.9)
    C(t, 148, y + 62, 12, "#7BE0A0", opacita=0.35)


def deco_agora(t, y, h):
    p = t.p
    t.path(f"M{n(p(100))} {n(p(y + h))}L{n(p(100))} {n(p(y + 40))}Q{n(p(100))} {n(p(y + 8))} {n(p(135))} {n(p(y + 8))}Q{n(p(170))} {n(p(y + 8))} {n(p(170))} {n(p(y + 40))}L{n(p(170))} {n(p(y + h))}z",
           fill="#C27A4E", opacita=0.45)
    t.path(f"M{n(p(116))} {n(p(y + h))}L{n(p(116))} {n(p(y + 52))}Q{n(p(116))} {n(p(y + 30))} {n(p(135))} {n(p(y + 30))}Q{n(p(154))} {n(p(y + 30))} {n(p(154))} {n(p(y + 52))}L{n(p(154))} {n(p(y + h))}z",
           fill="#E6A06E", opacita=0.35)


def s_esplora():
    t = apri((3, 33, 200, 493), "esplora")
    sbar(t, 19, 188, 53)
    T(t, "Esplora", 17, 87, larg=59, peso=800, id="titolo-schermata")
    card_sezione(t, 116, 93, "ATLAS", 55, [("Il tuo percorso", 66), ("personalizzato con l'AI.", 105)], ["#1546D8", "#0A1F6B", "#050B2B"], deco_atlas)
    card_sezione(t, 219, 97, "NOI", 32, [("Classifiche, sfide", 79), ("e community.", 61)], ["#2F7F6A", "#0F6B49", "#0A3F2E"], deco_noi)
    card_sezione(t, 327, 94, "Agorà", 53, [("Discussioni, eventi", 86), ("e confronto.", 56)], ["#7A4527", "#5C3019", "#3B1E10"], deco_agora)
    nav5(t, 1, 440, 53, [25, 63, 101, 139, 178], 24, 44, 3, 200, corpo=7.6, ico=17)
    return chiudi(t)


# ---------------------------------------------------------------------------- 7 profilo (foglio)
def s_profilo():
    t = apri((1201, 49, 1356, 505), "profilo")
    sbar(t, 1204, 1351, 67)
    I(t, "ingranaggio", 1342, 89, 15, NAVY, 1.7)
    C(t, 1229, 121, 27, "#DCE8FB", id="avatar-fondo"); T(t, "R", 1229, 131, corpo=30, peso=800, colore=AZZ, ancora="middle")
    T(t, "Raffaele", 1267.5, 117.5, larg=49, peso=800, id="nome")
    T(t, "@raffaele.ando", 1267.5, 133, larg=65, peso=400, colore=GRI2)
    R(t, 1201, 152.5, 151, 40, 12, "#F4F7FC", id="card-project-id")
    I(t, "orologio", 1225, 173, 15, AZZ, 2)
    T(t, "Project ID", 1242, 171, larg=38, peso=700)
    T(t, "#4821", 1242, 182, larg=25, peso=700)
    for cx, v, e in ((1217, "12", "livello"), (1257.5, "320", "pt"), (1298, "7", "sfide"), (1338, "3", "badge")):
        T(t, v, cx, 223, corpo=12, peso=800, ancora="middle", id="statistica-" + e)
        T(t, e, cx, 234, corpo=8, peso=400, colore=GRI2, ancora="middle")
    voci = [("barre-contorno", "I miei progressi", 61), ("gruppo", "Classifica", 40), ("sfida", "Le mie sfide", 49), ("cerchio-spunta", "Obiettivi", 35),
            ("utente-contorno", "Attività", 30), ("lucchetto", "Collegamenti", 55), ("ingranaggio", "Project ID", 40)]
    ic_alt = {"gruppo": "gruppo", "sfida": "bersaglio"}
    for i, (ic, te, lw) in enumerate(voci):
        y = 269.7 + i * 30
        I(t, ic if ic != "lucchetto" else "mondo", 1213, y, 15, "#2A3358", 1.7, fill_pieno=None)
        T(t, te, 1233.4, y + 3.5, larg=lw, peso=600, colore=NAVY)
        chev(t, 1345.6, y, 11)
    nav5(t, 4, 462, 43, [1212, 1245, 1278, 1311, 1344], 18, 34, 1201, 1356, corpo=7.6, ico=17)
    return chiudi(t)


# ---------------------------------------------------------------------------- 8 impostazioni (el 003)
def s_impostazioni():
    t = apri((50, 33, 204, 493), "impostazioni")
    sbar(t, 64, 193, 53)
    I(t, "chevron-sinistra", 64, 79, 13, NAVY, 2.2)
    T(t, "Impostazioni", 87, 91, larg=81, peso=800, id="titolo-schermata")
    L(t, 61, 112, 189, 112, "#EEF1F6", 1)
    righe = [("utente-contorno", "Account", 35, "Email, password, sicurezza", 95), ("campana", "Notifiche", 38, "Preferenze di notifica", 79),
             ("cerchio-aspetto", "Aspetto", 33, "Tema, lingua", 47), ("lucchetto", "Privacy", 31, "Dati e permessi", 63),
             ("cerchio-aiuto", "Aiuto", 23, "FAQ e supporto", 63), ("info", "Informazioni", 52, "Versione dell'app", 69)]
    for i, (ic, ti, lt, su, ls) in enumerate(righe):
        y = 135.3 + i * 48.1
        if ic == "cerchio-aspetto":
            C(t, 71, y, 6.5, "none", stroke="#2A3358", sw=1.5); C(t, 71, y, 3.2, "none", stroke="#2A3358", sw=1.2)
        elif ic == "cerchio-aiuto":
            C(t, 71, y, 6.5, "none", stroke="#2A3358", sw=1.5); T(t, "?", 71, y + 3.4, corpo=9.5, peso=700, colore="#2A3358", ancora="middle")
        elif ic == "lucchetto":
            I(t, "lucchetto", 71, y, 15, "#2A3358", 1.7, fill_pieno="none") if False else I(t, "lucchetto", 71, y, 15, "#2A3358", 1.6)
        else:
            I(t, ic, 71, y, 15, "#2A3358", 1.6)
        T(t, ti, 87, y - 2.5, larg=lt, peso=700, colore=NAVY)
        T(t, su, 87, y + 11, larg=ls, peso=400, colore=GRI2)
        if i < 5:
            L(t, 61, y + 24, 189, y + 24, "#F0F2F7", 1)
    return chiudi(t)


# ---------------------------------------------------------------------------- 9 atlas home (el 007)
def s_atlas_home():
    t = apri((0, 0, 209, 401), "atlas-home")
    sbar(t, 21, 203, 9)
    T(t, "ATLAS", 17, 40, larg=62, peso=800, id="titolo-schermata")
    I(t, "ricerca", 198, 32, 14, NAVY, 2)
    T(t, "Il tuo piano di studio", 17, 59, larg=96, peso=400, colore=GRI)
    T(t, "personalizzato.", 17, 73, larg=73, peso=400, colore=GRI)
    cl = clip_rett(t, t.p(17), t.p(84), t.p(191), t.p(102), t.p(10))
    with t.gruppo("card-analisi", clip=cl):
        R(t, 17, 84, 191, 102, 0, t.sfumatura(["#0A1640", "#0A2272", "#0A1A55"], 0, 0, 1, 1), id="card-analisi-fondo")
        deco_atlas(t, 70, 100)
        T(t, "Analisi del tuo rendimento", 30, 108, larg=121, peso=700, colore="#FFFFFF")
        T(t, "L'AI analizza i tuoi risultati", 30, 123, larg=105, peso=400, colore="#DDE7FF")
        T(t, "e adatta il percorso.", 30, 136, larg=82, peso=400, colore="#DDE7FF")
        R(t, 29, 150, 167, 25, 7, t.sfumatura(["#1673FF", "#0B66F5"], 0, 0, 1, 0), id="pulsante-vedi-analisi")
        T(t, "Vedi analisi", 98, 166, larg=47, peso=600, colore="#FFFFFF", ancora="middle")
        I(t, "freccia-destra", 135, 162.5, 12, "#FFFFFF", 2)
    T(t, "Focus attuale", 17, 214, larg=62, peso=800)
    for x, w, te, lw in ((17, 58, "Grammatica", 41), (81, 59, "Tempi verbali", 43), (146, 62, "Comprensione", 46)):
        R(t, x, 225, w, 20, 8, "#E8F0FD"); T(t, te, x + w / 2, 238, larg=lw, peso=600, colore=AZZ, ancora="middle")
    R(t, 17, 260, 191, 78, 10, "#F4F7FC", id="card-prossime-lezioni")
    T(t, "Prossime lezioni suggerite", 21, 275, larg=113, peso=700)
    T(t, "dall'algoritmo", 21, 289, larg=61, peso=700)
    chev(t, 196, 279, 11, NAVY)
    tile_icona(t, "libro", 21, 298, 30, sw=1.6)
    R(t, 57, 300, 151, 35, 9, "#FFFFFF", filtro=ombra(t, 1, 5, "#2563EB", 0.08))
    T(t, "Future tenses", 64, 316, larg=57, peso=700)
    T(t, "Alta priorità", 64, 328, larg=38, peso=500, colore="#16A765")
    T(t, "-6% rischio", 200, 326, larg=34, peso=600, colore="#16A765", ancora="end")
    nav5(t, 1, 345, 56, [28, 70, 111, 151, 194], 18, 37, 0, 209, corpo=7.4, ico=16)
    return chiudi(t)


# ---------------------------------------------------------------------------- 10 atlas analisi (el 008)
def pentagono(cx, cy, r, scala=1.0):
    return [(cx + r * scala * math.cos(math.radians(-90 + 72 * i)), cy + r * scala * math.sin(math.radians(-90 + 72 * i))) for i in range(5)]


def s_atlas_analisi():
    t = apri((18, 0, 215, 410), "atlas-analisi")
    p = t.p
    sbar(t, 37, 211, 17)
    I(t, "chevron-sinistra", 36, 39, 13, NAVY, 2.2)
    T(t, "La tua analisi", 33, 70, larg=85, peso=800, id="titolo-schermata")
    pill(t, 31, 85, 56, 21, "Rendimento", False)
    pill(t, 90, 85, 65, 21, "Competenze", True)
    pill(t, 160, 85, 55, 21, "Consigli", False)
    cx, cy, r = 120, 201, 51
    with t.gruppo("radar"):
        for sc in (1.0, 0.66, 0.33):
            pts = pentagono(cx, cy, r, sc)
            t.path("M" + "L".join(f"{n(p(x))} {n(p(y))}" for x, y in pts) + "z", stroke="#E3E7F0", sw=p(1))
        for x, y in pentagono(cx, cy, r):
            L(t, cx, cy, x, y, "#EBEEF5", 0.8)
        # ordine dei vertici: Grammatica (alto), Vocabolario, Comprensione, Prod. scritta, Prod. orale
        vals = [0.70, 0.45, 0.60, 0.50, 0.35]
        pts = [(cx + r * v * math.cos(math.radians(-90 + 72 * i)), cy + r * v * math.sin(math.radians(-90 + 72 * i))) for i, v in enumerate(vals)]
        t.path("M" + "L".join(f"{n(p(x))} {n(p(y))}" for x, y in pts) + "z", fill="#9EC2FA", stroke=AZZ, sw=p(1.6), opacita=1, id="radar-area", extra='fill-opacity="0.55" stroke-linejoin="round"')
        for x, y in pts:
            C(t, x, y, 2.4, AZZ)
    lab = [("Grammatica", "70%", 122, 133, 146, "#12A58A", 44), ("Vocabolario", "45%", 193, 171, 188, "#EF4444", 43),
           ("Comprensione", "60%", 176, 254, 267, "#EF4444", 55), ("Produzione scritta", "50%", 75, 254, 267, "#EF4444", 59),
           ("Produzione orale", "35%", 52, 171, 188, "#EF4444", 44)]
    for te, v, x, yb, yv, col, lw in lab:
        T(t, te, x, yb, larg=lw, peso=500, colore=GRI, ancora="middle")
        T(t, v, x, yv, corpo=9.5, peso=700, colore=col, ancora="middle")
    T(t, "Insight dell'AI", 33, 301, larg=60, peso=700)
    for i, (r_, lw) in enumerate((("Il tuo punto debole sono i tempi", 148), ("verbali complessi. Concentrati su", 149), ("Future tenses e Conditionals.", 135))):
        T(t, r_, 38, 320 + i * 15.5, larg=lw, peso=400, colore=GRI)
    chev(t, 207, 331, 11, "#4B5578")
    nav5(t, 1, 358, 52, [47, 88, 124, 163, 203], 15, 33, 18, 215, corpo=7.4, ico=16)
    return chiudi(t)


# ---------------------------------------------------------------------------- 11 atlas piano (el 009)
def s_atlas_piano():
    t = apri((10, 0, 218, 410), "atlas-piano")
    sbar(t, 28, 207, 17)
    I(t, "chevron-sinistra", 27, 40, 13, NAVY, 2.2); I(t, "ricerca", 205, 41, 13, NAVY, 2)
    T(t, "Il tuo piano", 26, 72, larg=70, peso=800, id="titolo-schermata")
    R(t, 23, 86, 187, 37, 9, "#E9F1FD", id="riga-evidenziata")
    L(t, 41, 112, 41, 252, "#6AA6F7", 1.6)
    righe = [("Future tenses", "Alta priorità", 57, 45, 104, "#EF4444"), ("Modal verbs", "Media priorità", 52, 53, 144, GRI2),
             ("Conditionals", "Media priorità", 53, 53, 182, GRI2), ("Relative clauses", "Bassa priorità", 67, 53, 221, GRI2),
             ("Simulazione mirata", "Consigliata", 79, 43, 262, GRI2)]
    for i, (ti, su, lt, ls, cy, col) in enumerate(righe):
        if i == 0:
            C(t, 41, cy, 11, "#1FA34F", stroke="#C7EBD3", sw=3); T(t, "1", 41, cy + 4, corpo=11, peso=800, colore="#FFFFFF", ancora="middle")
        else:
            C(t, 41, cy, 11, "#DCE8FB"); T(t, str(i + 1), 41, cy + 4.2, corpo=11, peso=800, colore="#1D4FD8" if i < 4 else NAVY, ancora="middle")
        T(t, ti, 65, cy - 1, larg=lt, peso=600, colore=NAVY)
        T(t, su, 65, cy + 13, larg=ls, peso=400, colore=col)
        if i:
            chev(t, 203, cy, 11, "#7A869C")
    R(t, 24, 302, 187, 34, 8, t.sfumatura(["#1673FF", "#0B66F5"], 0, 0, 1, 0), id="pulsante-nuovo-piano")
    I(t, "freccia-trend", 65, 319, 11, "#FFFFFF", 2) if False else C(t, 65, 319, 5.5, "none", stroke="#FFFFFF", sw=1.6)
    T(t, "Genera un nuovo piano", 77, 323, larg=99, peso=600, colore="#FFFFFF")
    nav5(t, 1, 358, 52, [38, 77, 117, 157, 197], 15, 33, 10, 218, corpo=7.4, ico=16)
    return chiudi(t)


# ---------------------------------------------------------------------------- 12 noi home (el 010)
SORG = {}


def s_noi_home():
    t = apri((24, 0, 209, 413), "noi-home")
    el = EL / "010-schermata.png"
    sbar(t, 42, 207, 17)
    T(t, "NOI", 40, 52, larg=36, peso=800, colore=VERDE_N, id="titolo-schermata")
    I(t, "ricerca", 203, 45, 13, NAVY, 2)
    T(t, "Studia insieme, sfida gli altri.", 40, 70, larg=128, peso=400, colore=GRI)
    R(t, 36, 85, 62, 24, 8, AZZ); T(t, "Classifica", 67, 100, larg=33, peso=600, colore="#FFFFFF", ancora="middle")
    R(t, 101, 85, 43, 24, 8, "#EEF1F6"); T(t, "Sfide", 122.5, 100, corpo=8.5, peso=600, colore=GRI, ancora="middle")
    R(t, 147, 85, 59, 24, 8, "#EEF1F6"); T(t, "Community", 176.5, 100, larg=40, peso=600, colore=GRI, ancora="middle")
    R(t, 38, 121, 57, 22, 7, "#6EA6F8"); T(t, "Settimana", 66.5, 135, larg=34, peso=600, colore="#FFFFFF", ancora="middle")
    R(t, 98, 121, 43, 22, 7, "#F4F6FA"); T(t, "Mese", 119.5, 135, larg=19, peso=600, colore=GRI, ancora="middle")
    R(t, 146, 121, 57, 22, 7, "#F4F6FA"); T(t, "Sempre", 174.5, 135, larg=28, peso=600, colore=GRI, ancora="middle")
    R(t, 38, 243, 167, 32, 9, "#E8F0FD", id="riga-raffaele")
    dati = [(165, "chiara.m", "1.240 pt", False), (194, "ale.dis", "1.120 pt", False), (223, "fede.it", "980 pt", False),
            (259, "raffaele.ando", "320 pt", True), (292, "giulia.p", "310 pt", False)]
    for i, (y, nome, pt, me) in enumerate(dati):
        col = AZZ if me else NAVY
        # posizione in classifica
        if i == 0:
            with t.gruppo("corona"):
                t.path(f"M{n(t.p(41))} {n(t.p(168))}L{n(t.p(42))} {n(t.p(160))}L{n(t.p(46))} {n(t.p(164))}L{n(t.p(48))} {n(t.p(159))}L{n(t.p(50))} {n(t.p(164))}L{n(t.p(54))} {n(t.p(160))}L{n(t.p(55))} {n(t.p(168))}z", fill="#F5B93B")
        elif i == 1:
            C(t, 47, y, 6.5, "#EEF1F6"); T(t, "2", 47, y + 3.4, corpo=9, peso=700, colore="#4B5578", ancora="middle")
        elif i == 2:
            t.path(f"M{n(t.p(47))} {n(t.p(y - 7))}L{n(t.p(53))} {n(t.p(y - 4))}L{n(t.p(53))} {n(t.p(y + 3))}L{n(t.p(47))} {n(t.p(y + 7))}L{n(t.p(41))} {n(t.p(y + 3))}L{n(t.p(41))} {n(t.p(y - 4))}z", fill="#F97316")
            T(t, "3", 47, y + 3.2, corpo=8, peso=800, colore="#FFFFFF", ancora="middle")
        else:
            T(t, str(i + 1), 47, y + 4, corpo=11, peso=800, colore=AZZ if me else NAVY, ancora="middle")
        if me:
            C(t, 72, y, 9.5, "#C9DBFA"); T(t, "R", 72, y + 4.5, corpo=13, peso=700, colore=AZZ, ancora="middle")
        else:
            faccia(t, el, 72, y, 9.5, f"volto-{nome}")
        T(t, nome, 88, y + 3.5, corpo=9.5, peso=700, colore=col)
        T(t, pt, 198, y + 3.5, corpo=9, peso=700 if me else 400, colore=AZZ if me else GRI, ancora="end")
    pulsante_azione(t, 36, 317, 169, 33, "Nuova sfida", 11, r=9, icona=None, freccia=False, x_testo=78, peso=600)
    I(t, "piu", 150, 334, 11, "#FFFFFF", 2.2)
    nav5(t, 2, 358, 55, [38, 81, 120, 158, 196], 17, 34, 24, 209, corpo=7.4, ico=16, col=VERDE_A)
    return chiudi(t)


# ---------------------------------------------------------------------------- 13 noi sfide (el 011)
def barra_sfida(t, x, y, w, frac):
    R(t, x, y, w, 5, 2.5, "#EAEEF5"); R(t, x, y, w * frac, 5, 2.5, t.sfumatura(["#3B82F6", "#1D6BF2"], 0, 0, 1, 0))


def s_noi_sfide():
    t = apri((14, 0, 205, 414), "noi-sfide")
    sbar(t, 30, 192, 17)
    I(t, "chevron-sinistra", 28, 40, 13, NAVY, 2.2); I(t, "ricerca", 186, 44, 13, NAVY, 2)
    T(t, "Sfide", 28, 70, larg=34, peso=800, id="titolo-schermata")
    R(t, 28, 86, 162, 24, 8, "#EEF1F6"); R(t, 28, 86, 78, 24, 8, AZZ)
    T(t, "Attive", 67, 101, larg=22, peso=600, colore="#FFFFFF", ancora="middle"); T(t, "Completate", 148, 101, larg=40, peso=600, colore=GRI, ancora="middle")
    righe = [("calendario", "#F1E6FD", "#8B2FE0", "7 giorni di grammatica", 94, "Completa 7 lezioni di grammatica.", 118, "3/7", 3 / 7, "2g rimasti", 131, 141, 154, 172, 184),
             ("trofeo", "#FDF0DC", "#F59E0B", "Sfida simulazioni", 71, "Ottieni più punti di 5 amici.", 100, "1/5", 1 / 5, "4g rimasti", 209, 219, 233, 250, 262),
             ("fiamma", "#FDEBDD", "#F97316", "Streak di studio", 66, "Studia per 5 giorni consecutivi.", 109, "2/5", 2 / 5, "3g rimasti", 288, 297, 311, 328, 340)]
    for ic, fondo, col, ti, lt, su, ls, frac_t, frac, rim, y_t, yb_t, yb_s, yb_f, yb_r in righe:
        R(t, 29, y_t - 10, 32, 34, 9, fondo)
        I(t, ic, 45, y_t + 7, 17, col, 2.0, fill_pieno=col if ic == "fiamma" else None)
        T(t, ti, 71, yb_t, larg=lt, peso=700)
        T(t, su, 71, yb_s, larg=ls, peso=400, colore=GRI)
        T(t, frac_t, 71, yb_f, corpo=8.5, peso=500, colore=GRI)
        barra_sfida(t, 71, yb_f + 5, 66, frac)
        T(t, rim, 186, yb_r, larg=39 if False else 36, peso=400, colore=GRI, ancora="end")
    nav5(t, 2, 358, 56, [36, 72, 108, 147, 183], 17, 35, 14, 205, corpo=7.4, ico=16, col=VERDE_A)
    return chiudi(t)


# ---------------------------------------------------------------------------- 14 agora home (el 012)
def s_agora_home():
    t = apri((11, 0, 203, 413), "agora-home")
    el = EL / "012-schermata.png"
    sbar(t, 29, 200, 17)
    T(t, "Agorà", 26, 52, larg=56, peso=800, colore=ARA, id="titolo-schermata")
    I(t, "ricerca", 198, 45, 13, NAVY, 2)
    T(t, "Idee, domande, prospettive.", 26, 70, larg=125, peso=400, colore=GRI)
    for x, w, te, lw, att in ((25, 39, "Tutti", 15, True), (68, 39, "OFA", 15, False), (110, 50, "Università", 35, False), (163, 40, "Carriera", 29, False)):
        R(t, x, 96, w, 21, 8, "#FDE0BE" if att else "#EEF1F6")
        T(t, te, x + w / 2, 109, larg=lw, peso=600, colore=ARA if att else GRI, ancora="middle")
    post = [(143, "sara.uni", "2h", ["Qual è il modo migliore per", "studiare i phrasal verbs?"], [116, 105], ("12", "8"), "012-schermata.png"),
            (226, "marco.polimi", "5h", ["Simulazioni: sono più difficili", "dell'esame?"], [113, 47], ("28", "12"), None),
            (310, "laura.s", "1g", ["Consigli per la parte di writing?"], [129], ("15", "6"), None)]
    for yc, nome, ora, righe, lws, (c1, c2), _ in post:
        faccia(t, el, 39, yc, 13.5, f"volto-{nome}")
        T(t, nome, 63, yc + 3, corpo=9, peso=600, colore="#2A3358")
        wn = larghezza_testo(nome, t.p(9), 600) / t.k
        T(t, "·  " + ora, 63 + wn + 3, yc + 3, corpo=9, peso=400, colore=GRI2)
        I(t, "tre-puntini", 198, yc, 12, GRI2, 1)
        for i, (r_, lw) in enumerate(zip(righe, lws)):
            T(t, r_, 63, yc + 19 + i * 14.5, larg=lw, peso=500, colore=NAVY)
        yy = yc + 19 + len(righe) * 14.5 + 11
        I(t, "commento", 69, yy - 3, 13, "#4B5578", 1.8); T(t, c1, 80, yy + 1, corpo=9.5, peso=500, colore="#4B5578")
        I(t, "cuore", 112, yy - 3, 13, "#4B5578", 1.8); T(t, c2, 122, yy + 1, corpo=9.5, peso=500, colore="#4B5578")
    voci = [("casa-contorno", "Home"), ("barre-contorno", "ATLAS"), ("gruppo", "Agorà"), ("libro", "Studio"), ("utente-contorno", "Profilo")]
    nav5(t, 2, 358, 55, [35, 74, 112, 150, 190], 17, 34, 11, 203, corpo=7.4, ico=16, col=ARA, voci=voci)
    return chiudi(t)


# ---------------------------------------------------------------------------- 15 agora discussione (el 013)
def s_agora_discussione():
    t = apri((12, 0, 192, 413), "agora-discussione")
    el = EL / "013-schermata.png"
    sbar(t, 28, 178, 17)
    I(t, "chevron-sinistra", 26, 40, 13, NAVY, 2.2); I(t, "ricerca", 170, 44, 13, NAVY, 2)
    faccia(t, el, 40, 77, 12, "volto-marco")
    T(t, "marco.polimi", 61, 74, larg=55, peso=700, colore="#2A3358")
    T(t, "2h fa", 61, 87, corpo=8.5, peso=400, colore=GRI2)
    T(t, "Simulazioni: sono più difficili", 29, 107, larg=147, peso=800, id="titolo-discussione")
    T(t, "dell'esame?", 29, 122, larg=63, peso=800)
    for i, (r_, lw) in enumerate((("Sto facendo delle simulazioni e", 136), ("mi sembrano molto più difficili", 130), ("delle prove ufficiali. È normale?", 136),
                                  ("Qualcuno può condividere la", 126), ("propria esperienza?", 86))):
        T(t, r_, 29, 143 + i * 14.6, larg=lw, peso=400, colore="#5B6784")
    I(t, "commento", 36, 221, 13, "#4B5578", 1.8); T(t, "28", 47, 226, corpo=10, peso=500, colore="#4B5578")
    I(t, "cuore", 80, 221, 13, "#4B5578", 1.8); T(t, "12", 91, 226, corpo=10, peso=500, colore="#4B5578")
    I(t, "segnalibro", 172, 221, 13, "#4B5578", 1.8)
    L(t, 29, 245, 176, 245, "#EEF1F6", 1)
    faccia(t, el, 40, 266, 12, "volto-raffaele")
    wn = T(t, "raffaele.ando", 61, 269, larg=62, peso=700, colore="#2A3358")
    T(t, "·  1h fa", 61 + wn + 3, 269, corpo=8.5, peso=400, colore=GRI2)
    I(t, "tre-puntini", 176, 264, 12, GRI2, 1)
    for i, (r_, lw) in enumerate((("Sì, anche a me sembravano più", 115), ("difficili all'inizio. In realtà ti", 113), ("preparano meglio perché", 94), ("coprono più casi.", 59))):
        T(t, r_, 61, 284 + i * 14.6, larg=lw, peso=400, colore="#5B6784")
    R(t, 28, 366, 148, 27, 9, "#FFFFFF", stroke="#E3E7F0", sw=1.2, id="campo-risposta")
    T(t, "Scrivi una risposta...", 37, 383, larg=64, peso=400, colore=GRI2)
    return chiudi(t)


# ---------------------------------------------------------------------------- grafica 6: avatar R
def s_avatar():
    t = apri((0, 0, 54, 54), "avatar-r")
    C(t, 27, 27, 26, "#DCE8FB", id="avatar-fondo")
    T(t, "R", 27, 38, corpo=32, peso=800, colore=AZZ, ancora="middle")
    return chiudi(t)


SCHERMATE = [
    ("01-splash", s_splash, EL / "004-schermata.png", (5, 0, 189, 457)),
    ("02-onboarding", s_onboarding, EL / "005-schermata.png", (3, 0, 167, 458)),
    ("03-home", s_home, FOGLIO, (388, 48, 597, 508)),
    ("04-lezione", s_lezione, EL / "001-schermata.png", (0, 34, 171, 490)),
    ("05-simulazione", s_simulazione, FOGLIO, (800, 46, 965, 505)),
    ("06-esplora", s_esplora, EL / "002-schermata.png", (3, 33, 200, 493)),
    ("07-profilo", s_profilo, FOGLIO, (1201, 49, 1356, 505)),
    ("08-impostazioni", s_impostazioni, EL / "003-schermata.png", (50, 33, 204, 493)),
    ("09-atlas-home", s_atlas_home, EL / "007-schermata.png", (0, 0, 209, 401)),
    ("10-atlas-analisi", s_atlas_analisi, EL / "008-schermata.png", (18, 0, 215, 410)),
    ("11-atlas-piano", s_atlas_piano, EL / "009-schermata.png", (10, 0, 218, 410)),
    ("12-noi-home", s_noi_home, EL / "010-schermata.png", (24, 0, 209, 413)),
    ("13-noi-sfide", s_noi_sfide, EL / "011-schermata.png", (14, 0, 205, 414)),
    ("14-agora-home", s_agora_home, EL / "012-schermata.png", (11, 0, 203, 413)),
    ("15-agora-discussione", s_agora_discussione, EL / "013-schermata.png", (12, 0, 192, 413)),
    ("16-avatar-r", s_avatar, EL / "006-grafica.png", (0, 0, 54, 54)),
]

if __name__ == "__main__":
    from PIL import Image
    solo = [a for a in sys.argv[1:] if not a.startswith("--")]
    for nome, fn, src, box in SCHERMATE:
        if solo and not any(nome.startswith(s) for s in solo):
            continue
        t = fn()
        svg = salva(t, CART, nome + ".svg")
        if vuole_tavola():
            import tempfile
            im = Image.open(src).convert("RGBA")
            bg = Image.new("RGB", im.size, (255, 255, 255)); bg.paste(im, mask=im.split()[3])
            f = tempfile.NamedTemporaryFile(suffix=".png", delete=False); bg.crop(box).save(f.name)
            controlla(svg, pathlib.Path(f.name), "13-" + nome, 2.0)
