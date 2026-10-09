"""
Forme decorative del brand board (kit blu "luminoso" morbido: forme arrotondate, scintilla, tratto con scia, griglia di punti):
7.054, 28.095, 28.097, 40.071, 35.092. Sono elementi di decorazione/pattern, non illustrazioni di soggetti.

    python3 strumenti/brand/schermate/ill/gen_forme.py

Le forme dell'originale sono sfumature morbide con i bordi sfocati dall'AI: qui bordi netti, raccordi veri e sfumature
lineari a due-tre fermate (colori campionati: #0057FF → #5A98FD → #DCE9FD). La scintilla a quattro punte è costruita simmetrica
(l'originale la ha storta: punta destra più bassa, braccio sinistro più corto), con le punte arrotondate. Nel 40.071 la
stella dietro il quadrato è irregolare: qui è una stella a quattro punte con i lati dritti, ritagliata dal quadrato.
Il fondo è trasparente (l'originale ha il fondo del foglio #F6F9FE).
"""
from __future__ import annotations

from comune import *

BLU, BLU_M, PAL = "#0A5FF5", "#6FA3FA", "#E1ECFE"


def scintilla(c: V, h: float, w: float, id_: str, colore: str = BLU, rr: float = 0.18) -> str:
    """Stella a 4 punte simmetrica (lati concavi): h = semialtezza, w = semilarghezza, punte arrotondate da un tratto."""
    q = 0.12
    d = (f"M{p(c + V(0, -h))} Q{p(c + V(w * q, -h * q))} {p(c + V(w, 0))} Q{p(c + V(w * q, h * q))} {p(c + V(0, h))} "
         f"Q{p(c + V(-w * q, h * q))} {p(c + V(-w, 0))} Q{p(c + V(-w * q, -h * q))} {p(c + V(0, -h))} Z")
    return f'<path id="{id_}" d="{d}" fill="{colore}" stroke="{colore}" stroke-width="{n(min(h, w) * rr)}" stroke-linejoin="round"/>'


def punti(x0, y0, dx, dy, nc, nr, r, colore, id_):
    return (f'<g id="{id_}" fill="{colore}">' + "".join(f'<circle cx="{n(x0 + i * dx)}" cy="{n(y0 + j * dy)}" r="{n(r)}"/>'
            for j in range(nr) for i in range(nc)) + "</g>")


def forma_a(dx=0, dy=0, s=1.0, id_="forma-onda") -> tuple[str, str]:
    """Onda: angolo alto a destra raccordato, rastremata in basso a sinistra (7.054, in alto a sinistra)."""
    d = ("M50 4 H82 Q91 4 91 13 V46 Q91 51 85 51 C66 51 56 56 47 68 C36 82 22 92 10 92 C2 92 -1 84 1 72 C5 46 22 20 50 4 Z")
    return d, id_


def s7054() -> str:
    W, H = 136, 95
    defs = [lineare("onda-luce", V(8, 90), V(88, 20), [(0, "#DDEAFD"), (0.45, "#A9C8FC"), (1, "#6EA2FA")]),
            radiale("onda-nucleo", V(58, 50), 28, [(0, "#4B8BF7", 0.9), (1, "#4B8BF7", 0)]),
            lineare("blob-luce", V(56, 90), V(127, 50), [(0, "#6AA0FA"), (1, "#8FB8FC")])]
    onda = "M50 4 H82 Q91 4 91 13 V46 Q91 51 85 51 C66 51 56 56 47 68 C36 82 22 92 10 92 C2 92 -1 84 1 72 C5 46 22 20 50 4 Z"
    blob = "M66 60 C80 58 105 60 119 44 L127 80 Q128 91 117 91 H66 Q56 91 56 81 V70 Q56 60 66 60 Z"
    corpo = [f'<path id="forma-onda" d="{onda}" fill="url(#onda-luce)"/>', f'<path id="forma-onda-nucleo" d="{onda}" fill="url(#onda-nucleo)"/>',
             f'<path id="forma-goccia-piatta" d="{blob}" fill="url(#blob-luce)"/>']
    return svg("Forme del brand (onda e goccia)", W, H, defs, corpo)


def s28095() -> str:
    W, H = 228, 127
    defs = [lineare("lato-luce", V(14, 70), V(58, 10), [(0, "#DCE9FD"), (0.5, "#B7D0FC"), (1, "#7FAEFB")]),
            lineare("goccia-luce", V(44, 90), V(138, 60), [(0, "#6AA0FA"), (1, "#A6C5FC")]),
            lineare("banda-luce", V(145, 112), V(228, 56), [(0, "#E4EDFE", 0.9), (1, "#DCE8FD", 0.6)])]
    lato = "M12 22 Q12 2 32 2 H58 Q61 2 61 6 V38 Q61 43 56 47 L24 73 Q12 78 12 62 Z"
    goccia = "M44 78 Q44 58 70 56 C90 54 100 48 108 32 L138 78 Q141 86 135 96 Q128 110 112 110 H52 Q44 110 44 102 Z"
    bande = ("M148 112 L210 58 Q216 54 222 55 H228 V112 Z")
    bande2 = ("M178 112 L228 80 V112 Z")
    corpo = [f'<path id="banda-chiara" d="{bande}" fill="url(#banda-luce)"/><path id="banda-chiara-2" d="{bande2}" fill="#D9E6FD" opacity="0.8"/>',
             f'<path id="forma-lato" d="{lato}" fill="url(#lato-luce)"/>', f'<path id="forma-goccia" d="{goccia}" fill="url(#goccia-luce)"/>',
             scintilla(V(167, 38), 29, 26.5, "scintilla")]
    return svg("Forme del brand con scintilla", W, H, defs, corpo)


def s28097() -> str:
    W, H = 207, 112
    defs = [lineare("onda-luce", V(80, 90), V(207, 40), [(0, "#5B9AFA"), (0.5, "#9EC3FC"), (1, "#E4EEFE", 0.4)])]
    onda = "M80 94 C80 82 100 70 125 64 C148 58 158 52 168 38 C178 24 190 8 203 0 L207 0 V80 C207 96 196 102 176 102 H88 C82 102 80 100 80 94 Z"
    corpo = [f'<path id="forma-onda" d="{onda}" fill="url(#onda-luce)"/>',
             '<path id="scia" d="M0 50 C25 54 38 46 52 32 C62 22 70 19 78 17" fill="none" stroke="#0B5BEF" stroke-width="3" stroke-linecap="round"/>',
             scintilla(V(91, 13), 12.5, 11, "scintilla")]
    return svg("Scia con scintilla e onda", W, H, defs, corpo)


def s40071() -> str:
    W, H = 148, 89
    defs = [lineare("stella-luce", V(10, 40), V(100, 40), [(0, "#E3ECFE"), (0.55, "#BBD2FC"), (1, "#8FB8FB")]),
            lineare("quadrato-luce", V(0, 0), V(110, 89), [(0, "#EDF3FE"), (1, "#E6EEFD")]),
            f'<clipPath id="quadrato-forma"><path d="{rettangolo(3, 5, 108, 82, 12)}"/></clipPath>']
    c = V(52, 46)
    stella = arrotondato([c + V(0, -52), c + V(14, -19), c + V(49, -8), c + V(35, 6), c + V(23, 22), c + V(21, 52), c + V(-26, 36),
                          c + V(-30, 4), c + V(-60, 0), c + V(-30, -14)], [3, 2, 4, 2, 2, 3, 3, 3, 3, 3])
    corpo = [f'<path id="quadrato" d="{rettangolo(3, 5, 108, 82, 12)}" fill="url(#quadrato-luce)"/>',
             f'<g clip-path="url(#quadrato-forma)"><path id="stella" d="{stella}" fill="url(#stella-luce)"/></g>',
             punti(130, 30, 9, 8.8, 3, 5, 1.9, "#7FAEFB", "griglia-di-punti")]
    return svg("Quadrato con stella e punti", W, H, defs, corpo)


def s35092() -> str:
    W, H = 177, 80
    defs = [lineare("piastra-luce", V(59, 40), V(177, 40), [(0, "#0057FF"), (0.35, "#3F85FD"), (0.7, "#8FB8FC"), (1, "#DCE9FD")])]
    piastra = "M64 4 H131 L177 44 V73 Q177 78 172 78 H64 Q59 78 59 73 V9 Q59 4 64 4 Z"
    corpo = [f'<path id="piastra" d="{piastra}" fill="url(#piastra-luce)"/>',
             punti(10, 22, 15.5, 13.5, 3, 4, 2.6, "#6A9EF7", "griglia-di-punti")]
    return svg("Piastra sfumata con punti", W, H, defs, corpo)


def s7055() -> str:
    return svg("Scintilla", 69, 91, [], [scintilla(V(35, 57.5), 30.5, 26.5, "scintilla", rr=0.1)])


GEN = [("07.055", "scintilla", s7055), ("7.054" if False else "07.054", "forme-onda-goccia", s7054), ("28.095", "forme-scintilla", s28095), ("28.097", "scia-scintilla-onda", s28097),
       ("40.071", "quadrato-stella-punti", s40071), ("35.092", "piastra-punti", s35092)]

if __name__ == "__main__":
    for id_, nome, fn in GEN:
        f = scrivi("kit-blu/forme", nome, fn())
        print(f); tavola(f, id_, k=3)
