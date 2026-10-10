"""
Token visivi del Brand Kit: campioni di colore (palette.svg) e campioni tipografici (tipografia.svg).

    python3 strumenti/brand/schermate/ui/gen_token.py        ->  brand/concept-svg/token/{palette,tipografia}.svg

Fonti: palette e tipografia di 28 (le più nitide, con Azzurro #60A5FA e i cinque pesi), gerarchia testi di 35,
scala H1/H2/Body/Caption di 15, specimen di 07/40. Valori dalle scritte delle immagini (non dai pixel, falsati dal jpeg).
Corregge dell'originale: le lettere dello specimen (28/35 hanno «LIMm», «pbcdeg» e glifi fusi) sono scritte giuste
(AaBb… Zz) e in Inter vero; i cinque pesi sono davvero Light/Regular/Medium/Semibold/Bold (300…700).
"""
from __future__ import annotations

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from extra import *  # noqa

USCITA = RADICE / "brand" / "concept-svg" / "token"
PANNELLO = "#F6F8FC"
LINEA = "#E3E8F2"
GRIGIO_ETICHETTA = "#5E6E8E"

PRIMARI = [("Blu primario", "#0F172A"), ("Blu secondario", "#3B82F6"), ("Azzurro", "#60A5FA")]
NEUTRI = [("Sfondo", "#F6F8FC"), ("Superfici", "#E5E7EB"), ("Testo secondario", "#6B7280")]
STATO = [("Rischio/Errore", "#EF4444"), ("Attenzione", "#F59E0B"), ("Successo", "#22C55E"), ("Quiz/Apprendimento", "#8B5CF6")]


def etichetta_maiuscola(t, testo, x, y, corpo=11, id=None):
    t.testo(testo, x, y, corpo, 500, GRIGIO_ETICHETTA, id=id or "etichetta-" + testo.lower().replace(" ", "-"), spaziatura=corpo * 0.22)


def palette():
    W, H = 1000, 470
    t = TelaCompatta(W, H, fondo="#FFFFFF", id="palette")
    t.rett(20, 20, W - 40, H - 40, 20, fill=PANNELLO, stroke=LINEA, sw=1, id="pannello-palette")
    etichetta_maiuscola(t, "PALETTE COLORI", 52, 62, id="titolo-palette")
    # Primari (3) e Neutri (3): campioni 120x74; Stato (4): 188x58
    def gruppo(titolo, voci, x, y, w, h, passo, id):
        with t.gruppo(id):
            t.testo(titolo, x, y, 17, 500, INK, id=f"{id}-titolo")
            for i, (nome, hx) in enumerate(voci):
                campione(t, x + i * passo, y + 18, nome, hx, w=w, h=h, r=13, corpo_nome=13.5, colore_nome=GRIGIO_ETICHETTA,
                         id="campione-" + nome.lower().replace("/", "-").replace(" ", "-"))
    gruppo("Primari", PRIMARI, 52, 110, 120, 74, 144, "primari")
    gruppo("Neutri", NEUTRI, 52 + 3 * 144 + 36, 110, 120, 74, 144, "neutri")
    t.linea(52 + 3 * 144 + 14, 108, 52 + 3 * 144 + 14, 270, LINEA, 1, id="divisore")
    gruppo("Stato / Funzionali", STATO, 52, 330, 188, 58, 224, "stato-funzionali")
    return t


def tipografia():
    W, H = 1480, 900
    t = TelaCompatta(W, H, fondo="#FFFFFF", id="tipografia")
    # ---- pannello 1: famiglia, alfabeto, pesi
    t.rett(20, 20, 920, 480, 20, fill=PANNELLO, stroke=LINEA, sw=1, id="pannello-famiglia")
    etichetta_maiuscola(t, "TIPOGRAFIA", 52, 62, id="titolo-tipografia")
    t.testo("Inter", 48, 190, 128, 800, INK, id="specimen-inter", spaziatura=-4)
    righe = ["AaBbCcDdEe", "FfGgHhIiJjKkLlMm", "NnOoPpQqRrSsTtUu", "VvWwXxYyZz", "0123456789"]
    with t.gruppo("specimen-alfabeto"):
        for i, r in enumerate(righe):
            t.testo(r, 52, 262 + i * 46, 36, 400, "#1E2B4A", id=f"alfabeto-{i + 1}", spaziatura=0.4)
    with t.gruppo("specimen-pesi"):
        for i, (nome, peso) in enumerate((("Light", 300), ("Regular", 400), ("Medium", 500), ("Semibold", 600), ("Bold", 700))):
            y = 262 + i * 46
            t.testo(nome, 700, y, 24, peso, INK if peso >= 400 else "#4B5B7C", id=f"peso-{nome.lower()}")
            t.testo(str(peso), 884, y, 14, 400, GRIGIO_ETICHETTA, "end", id=f"peso-{nome.lower()}-valore")
    # ---- pannello 2: Aa nei cinque pesi
    t.rett(960, 20, 500, 480, 20, fill=PANNELLO, stroke=LINEA, sw=1, id="pannello-aa")
    etichetta_maiuscola(t, "PESI", 992, 62, id="titolo-pesi")
    with t.gruppo("aa-pesi"):
        for i, (nome, peso) in enumerate((("Light", 300), ("Regular", 400), ("Medium", 500), ("Semibold", 600), ("Bold", 700))):
            cx = 992 + (i % 3) * 150
            cy = 150 + (i // 3) * 170
            t.testo("Aa", cx, cy, 72, peso, INK, id=f"aa-{nome.lower()}")
            t.testo(nome, cx, cy + 32, 14, 400, GRIGIO_ETICHETTA, id=f"aa-{nome.lower()}-nome")
    # ---- pannello 3: gerarchia testi
    t.rett(20, 520, 1440, 360, 20, fill=PANNELLO, stroke=LINEA, sw=1, id="pannello-gerarchia")
    etichetta_maiuscola(t, "GERARCHIA TESTI", 52, 562, id="titolo-gerarchia")
    with t.gruppo("gerarchia"):
        x = 52
        t.testo("L’inglese a Polimi", x, 640, 52, 800, INK, id="h1-esempio", spaziatura=-1.2)
        t.testo("senza sorprese.", x, 700, 52, 800, "#1D5FF5", id="h2-esempio", spaziatura=-1.2)
        t.testo("Verifica il tuo livello", x, 748, 24, 600, "#27345A", id="h3-esempio")
        t.paragrafo("Scopri se sei a rischio e preparati per superare l’OFA di inglese.", x, 786, 700, 20, 400,
                    "#4B5B7C", interlinea=1.4, id="body-esempio")
        t.testo("Evita di perdere circa 30€, sblocca il tuo piano di studi.", x, 850, 14.5, 400, GRIGIO_ETICHETTA, id="caption-esempio")
        t.linea(920, 600, 920, 850, LINEA, 1, id="divisore-gerarchia")
        for i, (et, nome, peso) in enumerate((("H1 / Display", "Grande", 800), ("H2 / Titolo", "Medio", 700), ("H3 / Sottotitolo", "Sottotitolo", 600),
                                              ("Body / Testo", "Testo principale", 400), ("Caption", "Testo secondario", 400))):
            y = 628 + i * 52
            t.testo(et, 952, y, 16, 500, GRIGIO_ETICHETTA, id=f"scala-{i + 1}-etichetta")
            corpo = (30, 24, 20, 17, 13.5)[i]
            t.testo(nome, 1170, y, corpo, peso, INK if i < 4 else GRIGIO_ETICHETTA, id=f"scala-{i + 1}-campione")
    return t


def main():
    palette().salva(USCITA / "palette.svg")
    tipografia().salva(USCITA / "tipografia.svg")
    print("ok", USCITA)


if __name__ == "__main__":
    main()
