"""
Sistemi del marchio: costruzione del brandmark (7.001), griglia di costruzione del wordmark (28.013), area di rispetto
(28.014-.019). Corregge: linee guida AI sfocate, doppie e non allineate (qui: griglia regolare sulle misure vere del
wordmark, x = altezza della O/4), etichette 'x' e '2x' al posto giusto, testo 'COSTRUZIONE DEL BRANDMARK' vero.
"""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from marchio import *
from gen_wordmark import wm, vb, salva
from controlli import controlla, USCITA

LINEA = "#2461D6"


def costruzione(out):
    b = (938, 0, 1260, 265)
    t = Fo(vb(b), "costruzione-marchio")
    t.rett(945.5, 9.5, 310, 250, 6, fill="#04163F", id="costruzione-pannello")
    with t.gruppo("costruzione-guide"):
        t.rett(983, 44.5, 234.5, 177, 0, fill="none", stroke=LINEA, sw=0.6, id="guida-riquadro", opacita=0.8)
        for x in (1036.5, 1099.5, 1162.5):
            t.linea(x, 38, x, 228, LINEA, 0.5, opacita=0.8)
        t.linea(972, 142, 1223, 142, LINEA, 0.5, opacita=0.8)
        t.linea(983, 61, 1217, 61, LINEA, 0.4, opacita=0.5); t.linea(983, 205, 1217, 205, LINEA, 0.4, opacita=0.5)
        t.path("M1026 108C990 115 982 160 1000 182C1010 192 1020 196 1030 198", stroke=LINEA, sw=0.6, opacita=0.8, id="guida-arco-sinistro")
        t.path("M1173 108C1209 115 1217 160 1199 182C1189 192 1179 196 1169 198", stroke=LINEA, sw=0.6, opacita=0.8, id="guida-arco-destro")
    marchio_porta(t, 1026, 63, 148, id="costruzione-marchio-tile", larg=0.72, ky=1.12, base=0.91)
    tagline(t, 961.7, 1152.5, 246, 9.6, colore="#C9D5F0", testo="COSTRUZIONE DEL BRANDMARK", peso=500, id="costruzione-didascalia")
    salva(t, "costruzione-marchio"); out.append(("costruzione-marchio", 7, b))


def griglia(out):
    b = (1003, 65, 1271, 235)
    t = Fo(vb(b), "griglia-wordmark")
    G = "#9FB2E6"
    with t.gruppo("griglia-guide"):
        t.rett(1022.3, 55.5, 244.5, 147, 0, fill="none", stroke=G, sw=0.5, id="griglia-riquadro", opacita=0.9)
        for y in (86.7, 103.7, 142.3, 173):
            t.linea(1022.3, y, 1266.8, y, G, 0.5, tratteggio="2 2", cap="butt", opacita=0.9)
        for x in (1022.3, 1032, 1044.3, 1065.3, 1089.3, 1122, 1227.7, 1248.3, 1266.8):
            t.linea(x, 55.5, x, 202.5, G, 0.5, tratteggio="2 2", cap="butt", opacita=0.7)
    wm(t, 1031.7, 1249, 142.3, id="griglia-wordmark-logo")
    for txt, yb in (("x", 98.5), ("2x", 127.5), ("x", 166)):
        t.testo(txt, 1008.3, yb, 8, 500, "#5B6B93", "middle", id="griglia-etichetta-" + txt)
    salva(t, "griglia-wordmark"); out.append(("griglia-wordmark", 28, b))


def rispetto(out):
    b = (1296, 63, 1510, 177)
    t = Fo(vb(b), "area-rispetto-wordmark")
    G = "#B3C4EE"
    with t.gruppo("area-rispetto-guide"):
        t.rett(1298.5, 66, 206, 107, 5, fill="none", stroke=G, sw=0.8, id="area-rispetto-contorno")
        t.linea(1298.5, 87, 1504.5, 87, G, 0.6); t.linea(1298.5, 152.3, 1504.5, 152.3, G, 0.6)
        t.linea(1319, 66, 1319, 173, G, 0.6); t.linea(1484.5, 66, 1484.5, 173, G, 0.6)
        for cx, cy in ((1308.7, 76.5), (1494.7, 76.5), (1308.7, 162.7), (1494.7, 162.7)):
            t.rett(cx - 10.3, cy - 10.5, 20.6, 21, 3, fill="#E4EBFB", stroke=G, sw=0.6, id="area-rispetto-modulo")
            t.testo("x", cx, cy + 3, 8, 500, "#5B6B93", "middle")
    wm(t, 1330.7, 1474.3, 132.7, id="area-rispetto-logo")
    salva(t, "area-rispetto-wordmark"); out.append(("area-rispetto-wordmark", 28, b))


def main(controlli=True):
    out = []
    costruzione(out); griglia(out); rispetto(out)
    if controlli:
        for nome, idx, bx in out:
            controlla(nome, idx, bx, 3)


if __name__ == "__main__":
    main()
