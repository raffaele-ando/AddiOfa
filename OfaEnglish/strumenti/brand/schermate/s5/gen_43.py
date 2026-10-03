"""Immagine 43 (schermate-risultato-sette): 6 schermate, scheda senza angoli visibili, misuratore con tacche.
Corpi: elenco passi · barre per area · fattori + nota · avviso + istogramma · costi + pulsanti.
Si lancia da solo e riscrive i 6 SVG in brand/concept-svg/schermate/calcolo-risultato/. Misure in pixel dell'originale."""
import pathlib, sys
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from calcolo import *
from corpi import *

RADICE = AQUI.parents[2]
USCITA = RADICE / "brand/concept-svg/schermate/calcolo-risultato"
ORIG = RADICE / "brand/concept/43-schermate-risultato-sette"

# colori del misuratore (campionati sull'originale)
BLU_ARCO = [(0, "#2F7DF6"), (1, "#5F9CFA")]
AMBRA = [(0, "#3B82F6"), (0.05, "#4F8BEF"), (0.13, "#F8B550"), (0.50, "#F9A825"), (1, "#F59E0B")]
GIALLO_ROSSO_A = [(0, "#FFD067"), (0.34, "#FFA24F"), (0.68, "#FF6B47"), (1, "#F5303E")]
GIALLO_ROSSO_B = [(0, "#FFC561"), (0.30, "#FF9150"), (0.60, "#FF5C4A"), (1, "#F52C3E")]
ROSSO = [(0, "#FF6E72"), (0.5, "#FF4A55"), (1, "#F5202F")]

# riquadri comuni dell'intestazione (y uguali in tutte e 6; cambia la x)
def base(W, H, tx, ic, ind, passo, barra, tit, sot, gauge, pct, did):
    return dict(W=W, H=H, tempo=tx, icone_stato=ic, indietro=ind, passo=passo, barra=barra, titolo=tit, sotto=sot,
                gauge=gauge, pct=pct, didascalia=did, striscia="#EEF6FD", card=(11, W, 8), card_r=0, card_fondo="#F8FBFE")

NAV = "#0C1446"
G = lambda cx, cy, rx, ry, th, v, stops, **k: dict(cx=cx, cy=cy, rx=rx, ry=ry, th=th, v=v, stops=stops, tacche="doppie", **k)


def s1():
    sp = base(244, 707, (38, 59, 19, 27), (195, 241, 19, 27), (38.5, 63, 17), (120, 149, 57, 69), (57, 236, 78, 5),
              [("Calcoliamo", 37, 158, 120, 139), ("il tuo risultato", 38, 186, 150, 168)],
              [("Stiamo analizzando le tue risposte", 38, 239, 190, 203), ("per stimare il tuo livello di", 38, 193, 211, 224), ("preparazione.", 38, 120, 235, 245)],
              G(139, 413, 94, 106, 22, 0.0, BLU_ARCO, pomello="#2F7BF5", glow=0, luce=0),
              ("0%", 113, 162, 424, 452, NAV), [("Rischio di fallimento", 64, 211, 468, 481, NAV, 600)])
    sp["id"] = "calcolo-0"
    def corpo(t, sp):
        corpo_passi(t, [("fatto", ("Grammatica", 93, 167, 568, 578), 573), ("fatto", ("Comprensione", 93, 183, 607, 620), 613.5),
                        ("vuoto", ("Vocabolario", 92, 166, 648, 658), 654), ("vuoto", ("Ragionamento", 93, 185, 689, 702), 694.5)], 66, 11.5,
                    x_card=(26, 540, 244, 760))
    return sp, corpo


SCHERMATE = [("001", "calcoliamo-0", s1)]


def main():
    USCITA.mkdir(parents=True, exist_ok=True)
    for nn, nome, f in SCHERMATE:
        sp, corpo = f()
        t = disegna(sp, corpo)
        out = USCITA / f"43-schermate-risultato-sette-{nn}-{nome}.svg"
        t.salva(out)
        print(out.name, len(t.svg()) // 1024, "KB")


if __name__ == "__main__":
    main()
