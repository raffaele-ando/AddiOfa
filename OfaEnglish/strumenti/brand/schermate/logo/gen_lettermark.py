"""
Lettermark 'A' e stelle del brand AddiOFA (immagini 7, 15, 35, 28, 40).

Tre disegni diversi nell'AI, tutti ricondotti a forme costruite:
  - A piena blu con la stella 4 punte ritagliata (7.004, 35.007, 35.004): contorno unico con raccordi veri + stella evenodd;
  - A a Lambda (senza traversa) con la controforma a stella a 5 punte, bicolore navy/blu (15.012);
  - A bianca a Lambda su tile blu con la stella blu (15.013).
Corregge: A con gambe di spessore diverso e piedi asimmetrici, stella storta, angoli sfrangiati, taglio netto
tra le due tinte nel 15.012 (qui e' sulla stessa linea di raccordo della punta destra della stella).
"""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parents[1]))
from marchio import *
from geometria import V, arrotondato
from controlli import controlla, USCITA


def vb(b):
    return (b[0], b[1], b[2] - b[0], b[3] - b[1])


def salva(t, nome):
    t.salva(USCITA / f"{nome}.svg")


def lettermark_pieno(t, x, y, w, h, colore=BLU, id="lettermark-a"):
    """A piena con la stella 4 punte ritagliata. (x, y, w, h) = ingombro."""
    k = w / 147.0
    P = lambda px, py: V(x + px * k, y + py * h / 144.0)
    pts = [P(50, 1), P(98, 1), P(147, 143), P(114, 143), P(107, 127), P(41, 127), P(34, 143), P(0, 143)]
    r = [6.5 * k, 6.5 * k, 6.5 * k, 3.5 * k, 3.5 * k, 3.5 * k, 3.5 * k, 6.5 * k]
    d = arrotondato(pts, r)
    cx, cy = x + 73.5 * k, y + 80 * h / 144.0
    ds = stella4(cx, cy, 36 * k, 0.62, rx=34.5 * k, tondo=0.09)
    with t.gruppo(id):
        t.add(f'<path id="{id}-forma" d="{d}{ds}" fill="{colore}" fill-rule="evenodd"/>')
        # filo tondo sulle punte della stella (stesso colore del fondo non serve: il contorno e' gia' arrotondato dallo stroke)
    return d


def lettermark_lambda(t, x, y, w, h, colore_sx, colore_dx, controforma_fill, id="lettermark-a-lambda", dividi=0.57):
    """A a Lambda: gambe piene, controforma a stella a 5 punte + gola. Si disegna in due tinte (sx / dx sotto la linea
    `dividi`); la controforma e' ritagliata con una maschera, quindi lo sfondo si vede attraverso."""
    contorno, sc, gola = lambda_a(x, y, w, h)
    mid = t.uid("mk")
    t.defs.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="{n(x - 5)}" y="{n(y - 5)}" width="{n(w + 10)}" height="{n(h + 10)}">'
                  f'<rect x="{n(x - 5)}" y="{n(y - 5)}" width="{n(w + 10)}" height="{n(h + 10)}" fill="#fff"/>'
                  f'<path d="{sc}" fill="#000"/><path d="{gola}" fill="#000"/></mask>')
    with t.gruppo(id):
        with t.gruppo(f"{id}-forma", ):
            t.add(f'<g mask="url(#{mid})">')
            t.path(contorno, fill=colore_sx, id=f"{id}-gamba-sinistra")
            if colore_dx != colore_sx:
                cid = t.uid("cl")
                t.defs.append(f'<clipPath id="{cid}"><rect x="{n(x + w / 2)}" y="{n(y + h * dividi)}" width="{n(w)}" height="{n(h)}"/></clipPath>')
                t.add(f'<g clip-path="url(#{cid})">')
                t.path(contorno, fill=colore_dx, id=f"{id}-gamba-destra")
                t.add('</g>')
            t.add('</g>')


def main(controlli=True):
    out = []
    # A piena blu (7.004: ritaglio 1325,75 - 1473,221)
    b = (1325, 75, 1473, 221)
    t = Fo(vb(b), "lettermark-a-blu")
    lettermark_pieno(t, 1326, 76, 147, 144, colore="#005BFE")
    salva(t, "lettermark-a-blu"); out.append(("lettermark-a-blu", 7, b))
    # A a Lambda bicolore (15.012)
    b = (455, 226, 558, 326)
    t = Fo(vb(b), "lettermark-a-bicolore")
    lettermark_lambda(t, 460, 232, 97, 88, "#011646", "#2A73F9", "#FFFFFF")
    salva(t, "lettermark-a-bicolore"); out.append(("lettermark-a-bicolore", 15, b))
    # A bianca su tile blu (15.013)
    b = (576, 226, 670, 327)
    t = Fo(vb(b), "lettermark-a-tile")
    t.path(squircle(578, 229, 92), fill=BLU_SOFT, id="lettermark-a-tile-fondo")
    lettermark_lambda(t, 578 + 92 * 0.18, 229 + 92 * 0.25, 92 * 0.64, 92 * 0.56, BIANCO, BIANCO, BLU_SOFT, id="lettermark-a-tile-lettera")
    salva(t, "lettermark-a-tile"); out.append(("lettermark-a-tile", 15, b))
    if controlli:
        for nome, idx, bx in out:
            controlla(nome, idx, bx, 4)


if __name__ == "__main__":
    main()
