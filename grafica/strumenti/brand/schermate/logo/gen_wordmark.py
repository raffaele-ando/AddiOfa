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


def vb(b):
    return (b[0], b[1], b[2] - b[0], b[3] - b[1])


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
    tagline(t, 34, 396, 175.1, 14.5, colore=TAG_COL, id="tagline")
    salva(t, "wordmark-con-tagline"); out.append(("wordmark-con-tagline", 28, b))

    # 3) bianco su scuro (28.024: variante 'Varianti' del sistema logo)
    b = (435, 168, 576, 229)
    t = Fo(vb(b), "wordmark-bianco-su-scuro")
    t.rett(441, 174, 131, 51, 9, fill="#06112F", id="wordmark-bianco-su-scuro-fondo")
    wm(t, 460, 553, 208.7, navy=BIANCO, blu=BIANCO, disco=BIANCO, stella="#06112F", id="wordmark-bianco")
    salva(t, "wordmark-bianco-su-scuro"); out.append(("wordmark-bianco-su-scuro", 28, b))

    # 4) su fondo chiaro: scheda bianca col bordo (28, 'Varianti')
    b = (575, 166, 722, 225)
    t = Fo(vb(b), "wordmark-su-chiaro")
    t.rett(582.5, 172.5, 132, 45, 9, fill="#FBFDFE", stroke="#E3EBF5", sw=1, id="wordmark-su-chiaro-scheda")
    wm(t, 604, 695, 208.7, id="wordmark-colori")
    salva(t, "wordmark-su-chiaro"); out.append(("wordmark-su-chiaro", 28, b))

    # 5) monocromatico nero e 6) grigio (28, 'Monocromatica'): la stella e' un ritaglio (colore del fondo)
    PAN = "#F6F9FE"
    b = (746, 184, 850, 216)
    t = Fo(vb(b), "wordmark-mono-nero")
    wm(t, 754, 841, 208.8, navy=NAVY, blu=NAVY, disco=NAVY, stella=PAN, id="wordmark-mono")
    salva(t, "wordmark-mono-nero"); out.append(("wordmark-mono-nero", 28, b))
    b = (863, 184, 965, 216)
    t = Fo(vb(b), "wordmark-mono-grigio")
    wm(t, 871, 957, 208.8, navy=GRIGIO_MONO, blu=GRIGIO_MONO, disco=GRIGIO_MONO, stella=PAN, id="wordmark-mono")
    salva(t, "wordmark-mono-grigio"); out.append(("wordmark-mono-grigio", 28, b))

    # 7) scuro con tagline a due righe (40, hero 'Art direction'): Addi bianco, O/FA blu, stella ritagliata nel colore del fondo
    b = (20, 75, 400, 230)
    t = Fo(vb(b), "wordmark-hero-scuro")
    g = t.sfumatura([(0, "#000917"), (1, "#061936")], 0, 0, 1, 1)
    t.rett(20, 75, 380, 155, 0, fill=g, id="wordmark-hero-scuro-fondo")
    wm(t, 32, 384, 156.6, navy=BIANCO, blu="#0663F8", stella="#03102B", id="wordmark-hero")
    tagline(t, 32, 244, 195, 14.8, colore=BIANCO, testo="IL TUO INGLESE,", id="tagline-riga-1")
    tagline(t, 32, 268, 219, 14.8, colore=BIANCO, testo="SENZA OSTACOLI.", id="tagline-riga-2")
    salva(t, "wordmark-hero-scuro"); out.append(("wordmark-hero-scuro", 40, b))

    # 8) variante del concept 15: O come anello (senza stella), tagline 'Studia oggi, sblocca il tuo domani.'
    b = (180, 18, 612, 150)
    t = Fo(vb(b), "wordmark-o-anello")
    wm(t, 187, 605, 110.5, navy="#011646", blu="#2A73F9", o="anello", peso_o=0.2, id="wordmark-anello")
    tagline(t, 187, 569, 141.5, 23.5, colore="#37476A", testo="Studia oggi, sblocca il tuo domani.", peso=400, id="tagline-studia-oggi")
    salva(t, "wordmark-o-anello"); out.append(("wordmark-o-anello", 15, b))

    # 9) lockup orizzontale (7: icona + wordmark + tagline)
    b = (510, 150, 800, 225)
    t = Fo(vb(b), "lockup-orizzontale")
    marchio_porta(t, 521.5, 156.5, 63.5, id="lockup-orizzontale-icona", larg=0.70, ky=1.1, base=0.80)
    wm(t, 603, 780, 199.5, id="lockup-orizzontale-wordmark")
    tagline(t, 602, 784, 215.2, 6.9, colore=TAG_COL, peso=600, id="lockup-orizzontale-tagline")
    salva(t, "lockup-orizzontale"); out.append(("lockup-orizzontale", 7, b))

    # 10) lockup verticale (7, pannello 'Brandmark': icona grande + wordmark + tagline)
    b = (50, 40, 430, 372)
    t = Fo(vb(b), "lockup-verticale")
    marchio_porta(t, 148.5, 60.5, 185, id="lockup-verticale-icona", larg=0.70, ky=1.1, base=0.80)
    wm(t, 68, 412, 324.5, id="lockup-verticale-wordmark")
    tagline(t, 64, 416, 357.2, 12.4, colore=TAG_COL, peso=500, id="lockup-verticale-tagline")
    salva(t, "lockup-verticale"); out.append(("lockup-verticale", 7, b))

    if controlli:
        for nome, idx, bx in out:
            controlla(nome, idx, bx)


if __name__ == "__main__":
    main()
