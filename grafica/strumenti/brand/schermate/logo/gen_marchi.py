"""
Marchi, tile e stelle del brand AddiOFA (immagini 28, 7, 35, 15, 40). Un SVG per variante, viewBox = ritaglio originale.

Corregge dell'originale: tile con angoli non uguali e bordi sfrangiati -> squircle vero; stella 4 punte con punte
disuguali o storte -> stella simmetrica costruita (marchio.stella4); 'App icon dark' dove la stella e' una sagoma
a casetta con la base tagliata male -> la stella-porta vera del logo 3D (stessa sagoma, stipiti dritti).
"""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from marchio import *
from controlli import controlla, USCITA


def vb(b):
    return (b[0], b[1], b[2] - b[0], b[3] - b[1])


def salva(t, nome):
    t.salva(USCITA / f"{nome}.svg")


def main(controlli=True):
    out = []
    # marchio compatto: tile blu sfumato + stella 4 punte (28.012)
    b = (867, 62, 940, 134)
    t = Fo(vb(b), "marchio-tile-stella4")
    marchio_stella4(t, 871.5, 68.5, 65.5)
    salva(t, "marchio-tile-stella4"); out.append(("marchio-tile-stella4", 28, b))
    # tile piatto + stella (28.042, 'Stile icona')
    b = (1426, 287, 1509, 366)
    t = Fo(vb(b), "marchio-tile-stella4-piatto")
    marchio_stella4(t, 1437.5, 288.5, 71.5, piatto=True)
    salva(t, "marchio-tile-stella4-piatto"); out.append(("marchio-tile-stella4-piatto", 28, b))
    # tile con la porta luminosa (7.005)
    b = (517, 156, 593, 221)
    t = Fo(vb(b), "marchio-tile-porta")
    marchio_porta(t, 521.5, 156.5, 63.5, larg=0.70, ky=1.1, base=0.80)
    salva(t, "marchio-tile-porta"); out.append(("marchio-tile-porta", 7, b))
    # tile scuro (7.007)
    b = (829, 156, 901, 225)
    t = Fo(vb(b), "marchio-tile-scuro")
    marchio_porta(t, 833.5, 156.5, 64, scuro=True, larg=0.62, ky=1.12, base=0.80)
    salva(t, "marchio-tile-scuro"); out.append(("marchio-tile-scuro", 7, b))
    if controlli:
        for nome, idx, bx in out:
            controlla(nome, idx, bx, 4)


if __name__ == "__main__":
    main()
