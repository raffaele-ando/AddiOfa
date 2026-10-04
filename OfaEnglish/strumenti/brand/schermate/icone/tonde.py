"""
Icone tonde dei kit (cerchio pallido + glifo pieno arrotondato), immagini 7, 8, 15, 16, 17, 23 (= 27 = 50), 28, 35, 40.

    python3 strumenti/brand/schermate/icone/tonde.py

Un solo insieme di glifi (dati qui sotto, in una griglia di ±15 attorno al centro) e cinque tavolozze:

    kit-blu        immagine 17   piatto, glifi a colori per significato (blu, rosso, verde, giallo)
    kit-rosso      immagine 8    piatto, libro rosso, lampo e utente indaco
    kit-luminoso   immagine 16   gli stessi glifi con sfumatura dall'alto e alone colorato sotto
    kit-d          immagine 23   (= 27 = 50, identiche) come il blu ma con ingranaggio e toni più smorzati
    marchio        immagini 7, 28, 40: glifi blu del marchio (cappello, globo, stella, lampadina, aereo, lente, calendario)

Scrive brand/concept-svg/icone/tonde/<kit>/<glifo>.svg (viewBox 64x64, cerchio r=32), per ogni kit _set.svg e
_tavola.png (32/64/128 px su chiaro e scuro) e tonde/_set.svg con tutti i kit in righe.

Cosa corregge dell'originale: le icone AI hanno bordi sfrangiati, spessori diversi da icona a icona, il libro con le due
pagine di forma diversa, la busta con le falde storte, il lucchetto con il buco della chiave sbavato, la X e la spunta con
estremi irregolari, "€" e "?" con il tratto diverso. Qui: stessa griglia (±15), stessi raccordi (arrotondato), "€" e "?" dal
glifo Inter ExtraBold, simmetrie costruite (libro, coppa, lucchetto, ingranaggio a 8 denti uguali), cerchio sempre r=32.
I colori sono campionati sulle zone pulite di ogni immagine (mediana del cerchio e del glifo).
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from base import Svg, V, arrotondato, polare, pt, n, set_svg, tavola, USCITA, tracciato  # noqa: E402
import mondo_internazionale as mondo  # noqa: E402

DEST = USCITA / "tonde"
LATO = 64
C = 32
ESCALA = 1.16        # i glifi originali occupano ~55 % del diametro: la griglia ±15 diventa ±17,4


# ------------------------------------------------------------------------------------------- glifi
# Ogni glifo -> lista di forme: dict(k="f"|"s", d=path, r=ruolo, w=spessore)  (f = pieno, s = tratto)
# ruoli: "base" (colore del glifo), "chiaro" (bianco 28 %), "bianco", "accento" (colore secondario), "scuro" (base più scura)
def F(d, r="base"):
    return {"k": "f", "d": d, "r": r}


def S(d, w, r="base"):
    return {"k": "s", "d": d, "r": r, "w": w}


def rr(x0, y0, x1, y1, r):
    return arrotondato([V(x0, y1), V(x0, y0), V(x1, y0), V(x1, y1)], [r, r, r, r])


def gl_libro():
    sx = "M-1 -8.4 C-4.2 -11 -9.2 -12.4 -13.3 -11.4 Q-15 -11 -15 -9.3 V9.6 Q-15 11.4 -13 11.2 C-8.8 10.7 -4.2 11.8 -1 14.4 Z"
    dx = "M1 -8.4 C4.2 -11 9.2 -12.4 13.3 -11.4 Q15 -11 15 -9.3 V9.6 Q15 11.4 13 11.2 C8.8 10.7 4.2 11.8 1 14.4 Z"
    return [F(sx), F(dx), F("M-1 -8.4 C-4.2 -11 -9.2 -12.4 -13.3 -11.4 Q-15 -11 -15 -9.3 V-2.5 C-10 -4.8 -5 -4.8 -1 -1.5 Z", "chiaro")]


def gl_grafico():
    return [F(rr(-12.5, 4, -6, 14, 3.25)), F(rr(-3.2, -4, 3.3, 14, 3.25)), F(rr(6, -13, 12.5, 14, 3.25))]


def gl_lampo():
    P = [V(3.2, -15), V(-8.6, 2.2), V(-1.4, 2.2), V(-4.4, 15), V(8.6, -2.6), V(1.4, -2.6)]
    return [F(arrotondato(P, [1.6, 1.4, 1.2, 1.6, 1.4, 1.2]))]


def gl_documento():
    P = [V(-10, -14), V(2.4, -14), V(10, -6.4), V(10, 14), V(-10, 14)]
    return [F(arrotondato(P, [2.8, 1.4, 1.4, 2.8, 2.8])),
            F(arrotondato([V(2.4, -14), V(10, -6.4), V(2.4, -6.4)], [0.6, 1.2, 1.0]), "chiaro"),
            F(rr(-5.2, -1.2, 5.2, 1.6, 1.4), "bianco"), F(rr(-5.2, 4, 5.2, 6.8, 1.4), "bianco")]


def gl_euro():
    return [F(tracciato("€", 0, 14.2, 39, 800, "middle"))]


def gl_lucchetto():
    return [S("M-6.2 -1 V-6.8 A6.2 6.2 0 0 1 6.2 -6.8 V-1", 3.8),
            F(rr(-11, -1.5, 11, 14.8, 3.6)),
            F("M0 2.8 a2.2 2.2 0 1 1 0 4.4 a2.2 2.2 0 1 1 0 -4.4 Z M-1.2 6.2 H1.2 L1.7 11 Q1.7 11.6 1.1 11.6 H-1.1 Q-1.7 11.6 -1.7 11 Z", "bianco")]


def gl_trofeo():
    coppa = "M-8.8 -13.6 H8.8 V-7.6 C8.8 -1.6 4.8 2.6 0 3.2 C-4.8 2.6 -8.8 -1.6 -8.8 -7.6 Z"
    return [S("M-8.4 -10.6 H-11.4 Q-14.6 -10.6 -14.6 -7.6 Q-14.6 -3.2 -9.4 -1.4", 2.8),
            S("M8.4 -10.6 H11.4 Q14.6 -10.6 14.6 -7.6 Q14.6 -3.2 9.4 -1.4", 2.8),
            F(coppa), F(rr(-2.3, 2.5, 2.3, 10, 0.6)), F(rr(-7.8, 9.6, 7.8, 14.2, 2.3))]


def gl_busta():
    return [F(rr(-14, -10, 14, 10, 3.2)),
            F(arrotondato([V(-14, -10), V(14, -10), V(0, 2.6)], [3.2, 3.2, 1.6]), "chiaro"),
            S("M-13.2 9 L-3.6 0.2 M13.2 9 L3.6 0.2", 1.2, "chiaro")]


def gl_utente():
    return [F("M0 -13 a5.8 5.8 0 1 1 0 11.6 a5.8 5.8 0 1 1 0 -11.6 Z"),
            F("M-12.6 14.4 V10.6 C-12.6 4.8 -7 1.8 0 1.8 C7 1.8 12.6 4.8 12.6 10.6 V14.4 Q12.6 15.6 11.4 15.6 H-11.4 Q-12.6 15.6 -12.6 14.4 Z")]


def gl_interrogativo():
    return [F(tracciato("?", 0, 14.2, 39, 800, "middle"))]


def gl_spunta():
    return [S("M-12.6 1 L-4.8 9 L12.8 -9.4", 5)]


def gl_x():
    return [S("M-9.8 -9.8 L9.8 9.8 M9.8 -9.8 L-9.8 9.8", 5)]


def gl_info():
    return [F("M0 -14.8 a14.8 14.8 0 1 1 0 29.6 a14.8 14.8 0 1 1 0 -29.6 Z", "bianco"),
            F("M0 -13.4 a13.4 13.4 0 1 1 0 26.8 a13.4 13.4 0 1 1 0 -26.8 Z"),
            F("M0 -8.6 a2.1 2.1 0 1 1 0 4.2 a2.1 2.1 0 1 1 0 -4.2 Z", "bianco"), F(rr(-2.1, -1.4, 2.1, 8.8, 2.1), "bianco")]


def gl_ingranaggio():
    pts, rad = [], []
    for i in range(8):
        t = i * 45
        for da, rp in ((-17, 10.6), (-11, 14.6), (11, 14.6), (17, 10.6)):
            pts.append(polare(0, 0, rp, t + da)); rad.append(1.5 if rp > 12 else 2.2)
    d = arrotondato(pts, rad) + " M4.6 0 a4.6 4.6 0 1 0 -9.2 0 a4.6 4.6 0 1 0 9.2 0 Z"
    return [{"k": "f", "d": d, "r": "base", "evenodd": True}]


# --- glifi in più del marchio (7, 28, 35, 40)
def gl_cappello():
    board = arrotondato([V(0, -12), V(15.5, -4), V(0, 4), V(-15.5, -4)], [1.8, 1.8, 1.8, 1.8])
    return [F("M-8.6 0 V6.4 C-8.6 10 -4.6 12.2 0 12.2 C4.6 12.2 8.6 10 8.6 6.4 V0 L0 4 Z", "scuro"), F(board),
            S("M11.6 -3.2 V7", 1.7, "scuro"), F(rr(10.2, 6.6, 13, 11, 1.2), "scuro")]


def gl_globo():
    return [S("M0 -13.6 a13.6 13.6 0 1 1 0 27.2 a13.6 13.6 0 1 1 0 -27.2 Z", 2.7),
            S("M0 -13.6 C-6.6 -7 -6.6 7 0 13.6 C6.6 7 6.6 -7 0 -13.6 Z", 2.3), S("M-13.2 0 H13.2", 2.3),
            S("M-11.6 -6.8 Q0 -3.6 11.6 -6.8 M-11.6 6.8 Q0 3.6 11.6 6.8", 2.1)]


def gl_stella():
    from sfera import stella4
    return [F(stella4(0, 0, 15.5, 15.5, k=0.46))]


def gl_lampadina():
    bulbo = "M-4.2 7.4 C-4.2 4.4 -7 3 -9 0 C-11.4 -3.6 -11 -8.4 -8 -11.4 C-5.4 -14 -2.6 -14.6 0 -14.6 C2.6 -14.6 5.4 -14 8 -11.4 C11 -8.4 11.4 -3.6 9 0 C7 3 4.2 4.4 4.2 7.4 Z"
    return [F(bulbo), F(rr(-4.6, 8.6, 4.6, 11.6, 1.2), "accento"), F(rr(-3.4, 12, 3.4, 14.8, 1.4), "accento"),
            S("M-2.2 7.4 V2.4 Q-2.2 -1 -4.2 -3.6 M2.2 7.4 V2.4 Q2.2 -1 4.2 -3.6 M-2.2 2.4 Q0 -1.6 2.2 2.4", 1.6, "bianco")]


def gl_aereo():
    sx = [V(0, -11), V(1.9, -8.5), V(2.1, -2.8), V(10.5, 2.2), V(10.5, 4.6), V(2.1, 2.2), V(1.7, 7.4), V(4.8, 10), V(4.8, 11.8), V(0, 10.6)]
    tutto = sx + [V(-q.x, q.y) for q in reversed(sx[1:-1])]
    raggi = [1.9, 1.2, 0.8, 1.2, 1.2, 0.8, 0.8, 1, 1, 0.8] + [1, 1, 0.8, 0.8, 1.2, 1.2, 0.8, 1.2]
    return [{"k": "f", "d": arrotondato(tutto, raggi), "r": "base", "tr": "rotate(-40) scale(1.28)"}]


def gl_lente():
    return [S("M-2.6 -13.2 a9.6 9.6 0 1 1 0 19.2 a9.6 9.6 0 1 1 0 -19.2 Z", 3.3), S("M4.6 4.6 L13 13", 3.8)]


def gl_calendario():
    return [F(rr(-11.5, -9, 11.5, 13.5, 3.4)), F(rr(-7.4, -13.4, -4.4, -6, 1.5)), F(rr(4.4, -13.4, 7.4, -6, 1.5)),
            F(rr(-11.5, -9, 11.5, -4.2, 0.1), "chiaro")] + \
        [F(rr(-7.4 + 5.3 * c, 0.6 + 5.4 * r, -4.2 + 5.3 * c + 0.2, 3.8 + 5.4 * r, 0.9), "bianco") for r in range(2) for c in range(3)]


GLIFI = {
    "libro": gl_libro, "grafico": gl_grafico, "lampo": gl_lampo, "documento": gl_documento, "euro": gl_euro,
    "lucchetto": gl_lucchetto, "trofeo": gl_trofeo, "busta": gl_busta, "utente": gl_utente, "interrogativo": gl_interrogativo,
    "spunta": gl_spunta, "x": gl_x, "info": gl_info, "ingranaggio": gl_ingranaggio,
    "cappello": gl_cappello, "globo": gl_globo, "stella": gl_stella, "lampadina": gl_lampadina, "aereo": gl_aereo,
    "lente": gl_lente, "calendario": gl_calendario,
}

# ------------------------------------------------------------------------------------------- tavolozze (campionate)
# glifo: (colore, cerchio[, accento])
KIT = {
    "kit-blu": {
        "immagine": 17, "stile": "piatto",
        "libro": ("#0C69FB", "#EEF5FE"), "grafico": ("#FEA708", "#FEF6E9"), "lampo": ("#0A68FC", "#EEF5FE"),
        "documento": ("#FD2E2C", "#FEF2EF"), "euro": ("#FE332F", "#FEF1EF"), "lucchetto": ("#FD2F2C", "#FEF2EE"),
        "trofeo": ("#17BE63", "#EBFBF1"), "busta": ("#FC3933", "#FEF3EE"), "utente": ("#1E7AFD", "#EDF5FE"),
        "interrogativo": ("#324E78", "#F0F4FA"), "spunta": ("#12BF65", "#ECFCF1"), "x": ("#FE3632", "#FEF0EE"),
        "info": ("#0B6CFD", "#ECF4FE"), "ingranaggio": ("#6D7B92", "#F3F4F8"),
    },
    "kit-rosso": {
        "immagine": 8, "stile": "piatto",
        "libro": ("#F62E35", "#FFEBEC"), "lampo": ("#3B30DB", "#ECEDFE"), "trofeo": ("#19A547", "#E4F7EB"),
        "utente": ("#6871EF", "#ECEFFF"), "interrogativo": ("#455267", "#EDEEF2"), "spunta": ("#169743", "#E3F7EC"),
        "x": ("#E21E28", "#FEE8EA"), "info": ("#3849F6", "#EAEDFF"), "grafico": ("#F5AD0A", "#FEF4E7"),
        "documento": ("#EE2B35", "#FEF0F0"), "euro": ("#DF242C", "#FFF0F0"), "lucchetto": ("#E5232F", "#FFECEC"),
        "busta": ("#F92C35", "#FEF1F1"), "ingranaggio": ("#78869E", "#F2F3F8"),
    },
    "kit-luminoso": {
        "immagine": 16, "stile": "lucido",
        "libro": ("#1068FC", "#ECF4FE"), "grafico": ("#FEA708", "#FEF6E9"), "lampo": ("#0C65FD", "#ECF4FE"),
        "documento": ("#FC433C", "#FAF5F5"), "euro": ("#FD342E", "#FEF1F0"), "lucchetto": ("#F83434", "#FCF4F4"),
        "trofeo": ("#05B867", "#ECFBF2"), "busta": ("#FB4C43", "#FCF4F3"), "utente": ("#3480FE", "#F0F6FE"),
        "interrogativo": ("#0E428F", "#EFF5FD"), "spunta": ("#06B367", "#ECFCF1"), "x": ("#FE4539", "#FEEFEE"),
        "info": ("#1069FC", "#E9F2FE"), "ingranaggio": ("#6D7B92", "#F3F4F8"),
    },
    "kit-d": {
        "immagine": 23, "stile": "piatto",
        "libro": ("#1363FA", "#F0F4FF"), "grafico": ("#F4A817", "#FEF7EC"), "lampo": ("#1857E2", "#F0F4FF"),
        "documento": ("#E6343B", "#FEEFEF"), "euro": ("#DE373C", "#FEEFF0"), "lucchetto": ("#E23139", "#FEEFEF"),
        "trofeo": ("#1DB152", "#EDF9F1"), "busta": ("#F0373E", "#FEF0F0"), "utente": ("#6788EE", "#ECF0FE"),
        "ingranaggio": ("#6D7B92", "#F3F4F8"), "interrogativo": ("#59667B", "#F2F2F6"), "spunta": ("#23A555", "#ECF9F0"),
        "x": ("#E5353C", "#FEEEEF"), "info": ("#316BED", "#ECF0FD"),
    },
    "marchio": {
        "immagine": 7, "stile": "piatto",
        "libro": ("#0D68FC", "#EAF1FE"), "cappello": ("#085FFB", "#EAF1FE", "#0A44C4"), "lucchetto": ("#014FFA", "#EAF1FE"),
        "trofeo": ("#18BD59", "#EDF9F1"), "documento": ("#156FFC", "#EAF1FE"), "busta": ("#F33C41", "#FEF0F0"),
        "utente": ("#1671FB", "#EAF1FE"), "ingranaggio": ("#4A5A7E", "#F1F3F7"), "grafico": ("#FEA708", "#FEF6E9"),
        "euro": ("#0A58FA", "#EAF1FE"), "globo": ("#0A58FA", "#EAF1FE"), "stella": ("#0A58FA", "#EAF1FE"),
        "lampadina": ("#FEB823", "#FEF6E9", "#0A58FA"), "aereo": ("#0A58FA", "#EAF1FE"), "lente": ("#0A58FA", "#EAF1FE"),
        "calendario": ("#0A58FA", "#EAF1FE"),
    },
}

# elementi del catalogo coperti da ogni glifo di ogni kit (per il rapporto)
ELEMENTI = {
    "kit-rosso": {"libro": ["08.041"], "lampo": ["08.042"], "trofeo": ["08.043"], "utente": ["08.044"], "interrogativo": ["08.045"],
                  "spunta": ["08.046"], "x": ["08.047"], "info": ["08.048"], "grafico": ["08.049"], "documento": ["08.050"],
                  "euro": ["08.051"], "lucchetto": ["08.052"], "busta": ["08.053"], "ingranaggio": ["08.054"]},
    "kit-luminoso": {"libro": ["16.041"], "grafico": ["16.042"], "lampo": ["16.043"], "documento": ["16.044"], "euro": ["16.045"],
                     "lucchetto": ["16.046"], "trofeo": ["16.047"], "busta": ["16.048"], "utente": ["16.049"], "interrogativo": ["16.051"],
                     "spunta": ["16.052"], "x": ["16.053"], "info": ["16.054"]},
    "kit-blu": {"libro": ["17.048"], "grafico": ["17.049"], "lampo": ["17.050"], "documento": ["17.051"], "euro": ["17.052"],
                "lucchetto": ["17.053"], "trofeo": ["17.054"], "busta": ["17.055"], "utente": ["17.056"], "interrogativo": ["17.058"],
                "spunta": ["17.059"], "x": ["17.060"], "info": ["17.061"]},
    "kit-d": {"libro": ["23.041"], "grafico": ["23.042"], "lampo": ["23.043"], "documento": ["23.044"], "euro": ["23.045"],
              "lucchetto": ["23.046"], "trofeo": ["23.047"], "busta": ["23.048"], "utente": ["23.049"], "ingranaggio": ["23.050"],
              "interrogativo": ["23.051"], "spunta": ["23.052"], "x": ["23.053"], "info": ["23.054"]},
    "marchio": {"libro": ["07.015", "28.038", "28.120"], "cappello": ["07.017", "28.122", "40.039"], "lucchetto": ["07.018", "28.041", "40.038"],
                "trofeo": ["07.019", "28.070", "28.124"], "documento": ["07.034", "28.138", "40.040"], "busta": ["07.036"], "utente": ["07.037", "28.058"],
                "ingranaggio": ["07.038", "28.141"], "grafico": ["28.040", "28.121", "40.037"], "globo": ["28.071", "40.059"], "stella": ["28.045", "35.091", "40.058"],
                "lampadina": ["28.072", "40.060"], "aereo": ["28.150"], "lente": ["28.151"], "calendario": ["28.147"]},
}
# i kit 27 e 50 sono copie di 23 (stessi elementi con numero uguale 041..054)
DUPLICATI_KIT_D = {"27": "23", "50": "23"}


# ------------------------------------------------------------------------------------------- disegno
def mescola(hexa: str, con: str, t: float) -> str:
    a = [int(hexa[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(con[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * t):02X}" for x, y in zip(a, b))


def icona(kit: str, nome: str) -> Svg:
    pal = KIT[kit][nome]
    col, cerchio = pal[0], pal[1]
    acc = pal[2] if len(pal) > 2 else mescola(col, "#000000", 0.25)
    lucido = KIT[kit]["stile"] == "lucido"
    s = Svg(0, 0, LATO, LATO, f"{kit}-{nome}", f"Icona tonda ({kit}): {nome}")
    s.cerchio(C, C, 32, fill=s.rad([(0, mescola(cerchio, "#FFFFFF", 0.55)), (1, cerchio)], 22, 20, 52), id="cerchio")
    scuro = mescola(col, "#000000", 0.28)
    s.apri("glifo", trasforma=f"translate({C} {C}) scale({ESCALA})")
    forme = GLIFI[nome]()
    colori = {"base": col, "bianco": "#FFFFFF", "accento": acc, "scuro": scuro}
    if lucido:
        g = s.lin([(0, mescola(col, "#FFFFFF", 0.32)), (1, col)], 0, -15, 0, 15)
        # alone colorato sotto il glifo
        s.apri("alone", opacita=0.42, filtro=s.sfoca(2.0), trasforma="translate(0 2.4)")
        for f in forme:
            if f["r"] in ("base", "scuro"):
                _forma(s, f, col, None)
        s.chiudi()
        colori["base"] = g
        colori["scuro"] = s.lin([(0, col), (1, scuro)], 0, -15, 0, 15)
    for f in forme:
        if f["r"] == "chiaro":
            _forma(s, f, "#FFFFFF", 0.28 if f["k"] == "f" else 0.35)
        else:
            _forma(s, f, colori[f["r"]], None)
    s.chiudi()
    return s


def _forma(s: Svg, f: dict, colore: str, op):
    tr = f' transform="{f["tr"]}"' if f.get("tr") else ""
    eo = ' fill-rule="evenodd"' if f.get("evenodd") else ""
    o = f' opacity="{n(op)}"' if op is not None else ""
    if f["k"] == "f":
        s.add(f'<path d="{f["d"]}" fill="{colore}"{eo}{o}{tr}/>')
    else:
        s.add(f'<path d="{f["d"]}" fill="none" stroke="{colore}" stroke-width="{n(f["w"])}" stroke-linecap="round" stroke-linejoin="round"{o}{tr}/>')


def main():
    tutti = []
    for kit, pal in KIT.items():
        cart = DEST / kit
        percorsi = []
        for nome in GLIFI:
            if nome in pal:
                percorsi.append(icona(kit, nome).salva(cart / f"{nome}.svg"))
        set_svg(percorsi, cart / "_set.svg", colonne=len(percorsi), cella=LATO, margine=16, id=f"set-{kit}")
        tavola(percorsi, cart / "_tavola.png", colonne=3)
        tutti.append(percorsi)
        print(kit, len(percorsi), "icone")
    # tutti i kit in righe
    from ui import Tela
    m = 16
    larg = max(len(p) for p in tutti)
    t = Tela(m + larg * (LATO + m), m + len(tutti) * (LATO + m), "#FFFFFF", id="set-tonde")
    for r, percorsi in enumerate(tutti):
        for c, p in enumerate(percorsi):
            t.inserisci_svg(p.read_text(), m + c * (LATO + m), m + r * (LATO + m), LATO, f"{p.parent.name}-{p.stem}")
    t.salva(DEST / "_set.svg")


if __name__ == "__main__":
    main()
