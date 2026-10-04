"""
La stella a 4 punte del brand AddiOFA: piena, a contorno, in cerchio, in tondo chiaro (icona), e il tile con la
stella a 5 punte-porta (icona semplificata blu piatta di 35).

Corregge dell'originale: punte disuguali (la stella 7.055 e' piu' alta che larga di ~10%, quella di 28.044 ha un
braccio piu' corto), bordo del contorno che cambia spessore, cerchio non tondo. Qui: stella simmetrica (stessa
costruzione della O del wordmark), tratto costante con giunzioni tonde.
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
    # stella piena (7.055)
    b = (1174, 512, 1243, 603)
    t = Fo(vb(b), "stella4-piena")
    stella4_tonda(t, 1209.5, 565.5, 29, "#0161FA", "stella4-piena-forma", tondo=0.10)
    salva(t, "stella4-piena"); out.append(("stella4-piena", 7, b))
    # contorno (28.044)
    b = (1268, 296, 1330, 358)
    t = Fo(vb(b), "stella4-contorno")
    t.path(stella4(1299, 327, 24.2, STELLA_U, rx=23.6, tondo=0.04), fill="none", stroke="#0A1538", sw=3.1, id="stella4-contorno-tratto", join="round")
    salva(t, "stella4-contorno"); out.append(("stella4-contorno", 28, b))
    # in cerchio (35, icone semplificate)
    b = (1275, 210, 1335, 270)
    t = Fo(vb(b), "stella4-in-cerchio")
    with t.gruppo("stella4-in-cerchio"):
        t.cerchio(1305, 239, 24, fill="#0560FD", id="stella4-in-cerchio-disco")
        stella4_tonda(t, 1305, 239, STELLA_O * 24, BIANCO, "stella4-in-cerchio-stella")
    salva(t, "stella4-in-cerchio"); out.append(("stella4-in-cerchio", 35, b))
    # in tondo chiaro (40.058, iconografia)
    b = (951, 639, 1005, 698)
    t = Fo(vb(b), "stella4-in-tondo-chiaro")
    with t.gruppo("stella4-in-tondo-chiaro"):
        t.cerchio(978, 668.5, 26.5, fill="#EBF4FD", id="stella4-in-tondo-chiaro-fondo")
        stella4_tonda(t, 978, 669, 15, "#0863FE", "stella4-in-tondo-chiaro-stella")
    salva(t, "stella4-in-tondo-chiaro"); out.append(("stella4-in-tondo-chiaro", 40, b))
    # tile blu piatto con la stella-porta (35, 4a icona semplificata)
    b = (1440, 211, 1497, 268)
    t = Fo(vb(b), "marchio-tile-piatto-porta")
    marchio_porta(t, 1444, 215, 49, id="marchio-tile-piatto-porta", scuro=True, fondo="#0560FD", larg=0.62, ky=1.12, base=0.80)
    salva(t, "marchio-tile-piatto-porta"); out.append(("marchio-tile-piatto-porta", 35, b))
    if controlli:
        for nome, idx, bx in out:
            controlla(nome, idx, bx, 5)


if __name__ == "__main__":
    main()
