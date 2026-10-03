"""
Wordmark AddiOFA e sue varianti (immagini 28, 7, 15, 35, 40 del concept).

Corregge dell'originale: lettere AI non identiche tra le versioni (nell'originale "Addi" cambia spessore e
rotondità da un'istanza all'altra), disco della O non perfettamente tondo, stella della O storta e con punte
disuguali, spaziatura irregolare, tagline con lettere di larghezza variabile. Qui: lettere Inter ExtraBold, O =
cerchio vero + stella 4 punte simmetrica (marchio.stella4), tagline distribuita in modo uniforme.

Ogni SVG ha il viewBox del ritaglio originale (coordinate dell'immagine intera) cosi' la tavola di controllo
confronta pixel con pixel. Uscita: brand/concept-svg/logo/*.svg
"""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
import marchio as M
from marchio import *
from controlli import controlla, USCITA
from rif import RADICE

TAG_COL = "#1B2350"


def larg_em(o="stella"):
    return misure_wordmark(1.0, 0.0)[1]


def wm(t, x0, x1, yb, **kw):
    """Wordmark con l'inchiostro da x0 a x1 (misurati sull'originale) e la linea di base in yb."""
    S = (x1 - x0) / larg_em()
    return S, wordmark(t, x0, yb, S, **kw)


def salva(t, nome):
    p = USCITA / f"{nome}.svg"
    t.salva(p)
    return p


def main(controlli=True):
    out = []
    # 1) wordmark primario: ritaglio 28.003 (33,77)-(398,154)
    b = (33, 77, 398, 154)
    t = Fo((b[0], b[1], b[2] - b[0], b[3] - b[1]), "wordmark-primario")
    wm(t, 34.4, 397, 145.15)
    salva(t, "wordmark-primario"); out.append(("wordmark-primario", 28, b))

    # 2) wordmark con tagline (logo secondario / hero del sistema visivo): 28, riquadro del titolo
    b = (22, 70, 410, 188)
    t = Fo((b[0], b[1], b[2] - b[0], b[3] - b[1]), "wordmark-con-tagline")
    wm(t, 34.4, 397, 145.15)
    tagline(t, 34, 396, 175.3, 15.0, colore=TAG_COL, id="tagline")
    salva(t, "wordmark-con-tagline"); out.append(("wordmark-con-tagline", 28, b))

    if controlli:
        for nome, idx, bx in out:
            controlla(nome, idx, bx)


if __name__ == "__main__":
    main()
