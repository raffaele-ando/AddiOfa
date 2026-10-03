"""
Generatore parametrico della sequenza "Calcoliamo il tuo risultato" (immagini 9, 10, 29, 42, 43 di design-concept).

Ogni schermata è una `dict` di parametri in PIXEL dell'immagine originale (misurati con l'analisi delle bande di
testo: x0..x1, y0..y1 dell'inchiostro di ogni riga) e `disegna(sp)` produce la Tela:

    cornice (striscia azzurra + scheda del telefono) · barra di stato · indietro + "10/10" + barra di avanzamento ·
    titolo · sottotitolo · misuratore (percentuale, colori, tacche…) · percentuale · didascalia · corpo.

Il corpo cambia da una schermata all'altra (elenco di passi, barre per area, fattori, avviso + istogramma, costi,
striscia di stato…): sono funzioni in `corpi.py`, scelte da `sp["corpo"]`.

Errori degli originali corretti: testo AI illeggibile/simboli storti nelle icone (rifatte vere), pomello e arco
non allineati, bordi sfocati sulle forme; i colori sono campionati sull'originale. Il testo piccolo è ricostruito
(vedi rapporto): le stringhe leggibili sono state copiate, le altre sono plausibili e brevi.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
sys.path.insert(0, str(QUI.parent))
from extra import *          # noqa: F401,F403,E402
from extra import testo_box, misuratore_arco, Tela, INK, n  # noqa: E402

NAVY = "#0C1446"        # titoli e numeri
SOTTO = "#4B5F91"       # sottotitolo e didascalie
ETICHETTA = "#3C4F82"   # voci delle liste


def cornice(t: Tela, sp: dict):
    """Fondo: striscia azzurra del foglio e scheda bianca del telefono (a volte con angoli arrotondati)."""
    P = t.p
    t.rett(0, 0, t.w, t.h, 0, fill=sp.get("striscia", "#EEF6FD"), id="sfondo-pagina")
    x0, x1, y0 = sp.get("card", (0, sp["W"], 0))
    r = sp.get("card_r", 0)
    y1 = sp.get("card_y1", sp["H"] + 40)
    t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P(r), fill=sp.get("card_fondo", "#F9FBFE"), id="scheda-telefono",
           r_angoli=None if not r else (P(r), P(r), P(r), P(r)))


def barra_stato_px(t: Tela, sp: dict):
    """Ora a sinistra, segnale + wifi + batteria a destra (misure dall'originale)."""
    P = t.p
    x0, x1, y0, y1 = sp["tempo"]
    with t.gruppo("barra-di-stato"):
        testo_box(t, "9:41", P(x0), P(x1), P(y0), P(y1), 700, "#0A0A0F", id="ora")
        cx0, cx1, cy0, cy1 = sp["icone_stato"]
        W = P(cx1 - cx0); h = P(cy1 - cy0); X = P(cx0); Y1 = P(cy1)
        # segnale: 4 barrette
        for i, f in enumerate((0.40, 0.58, 0.78, 1.0)):
            t.rett(X + i * W * 0.068, Y1 - h * f, W * 0.05, h * f, W * 0.015, fill="#0A0A0F")
        # wifi
        t.icona("wifi", X + W * 0.36, Y1 - h * 1.06, h * 1.05, "#0A0A0F", 2.4)
        # batteria
        bx = X + W * 0.66; bw = W * 0.34
        t.rett(bx, Y1 - h * 0.92, bw, h * 0.92, h * 0.28, fill="#0A0A0F")


def intestazione(t: Tela, sp: dict):
    P = t.p
    with t.gruppo("intestazione"):
        # indietro
        cx, cy, hh = sp["indietro"]
        t.path(f"M{n(P(cx) + P(hh) * 0.30)} {n(P(cy) - P(hh) * 0.5)}L{n(P(cx) - P(hh) * 0.22)} {n(P(cy))}L{n(P(cx) + P(hh) * 0.30)} {n(P(cy) + P(hh) * 0.5)}",
               stroke="#101A4A", sw=P(2.1), id="indietro")
        a, b, c, d = sp["passo"]
        testo_box(t, "10/10", P(a), P(b), P(c), P(d), 500, "#4B5F91", id="passo")
        bx0, bx1, by, bh = sp["barra"]
        fr = sp.get("barra_pieno", 1.0)
        t.rett(P(bx0), P(by - bh / 2), P(bx1 - bx0), P(bh), P(bh / 2), fill="#E3E9F4", id="barra-avanzamento-vuota")
        if fr > 0:
            t.rett(P(bx0), P(by - bh / 2), P((bx1 - bx0) * fr), P(bh), P(bh / 2), id="barra-avanzamento",
                   fill=t.sfumatura(["#5B9BFB", "#2F73F2"], 0, 0, 1, 0), filtro=t.ombra(1, P(3), "#2F73F2", 0.22))


def testi(t: Tela, righe: list, peso: int, colore: str, prefisso: str):
    P = t.p
    for i, (s, x0, x1, y0, y1) in enumerate(righe):
        testo_box(t, s, P(x0), P(x1), P(y0), P(y1), peso, colore, id=f"{prefisso}-{i + 1}")


def disegna(sp: dict, corpo=None) -> Tela:
    t = Tela.da_originale(sp["W"], sp["H"], fondo=None, id=sp.get("id", "schermata"))
    P = t.p
    cornice(t, sp)
    barra_stato_px(t, sp)
    intestazione(t, sp)
    testi(t, sp["titolo"], 700, NAVY, "titolo")
    testi(t, sp["sotto"], 400, SOTTO, "sottotitolo")
    g = sp["gauge"]
    misuratore_arco(t, P(g["cx"]), P(g["cy"]), P(g["rx"]), P(g["ry"]), P(g["th"]), g["v"], g["stops"],
                    colore_pomello=g.get("pomello"), pomello_r=P(g["pr"]) if "pr" in g else None, tacche=g.get("tacche"),
                    scia=g.get("scia", False), glow=g.get("glow", 0.42), luce=g.get("luce", 0.22), anello=g.get("anello", True),
                    traccia=g.get("traccia", ("#EEF2F9", "#E6EBF5")), id="misuratore")
    s, x0, x1, y0, y1, col = sp["pct"]
    testo_box(t, s, P(x0), P(x1), P(y0), P(y1), 800, col, id="percentuale")
    for i, (s, x0, x1, y0, y1, col, peso) in enumerate(sp["didascalia"]):
        testo_box(t, s, P(x0), P(x1), P(y0), P(y1), peso, col, id=f"didascalia-{i + 1}")
    if corpo:
        corpo(t, sp)
    return t
