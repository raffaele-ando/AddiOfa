"""
Cinque soggetti finali: Mondo internazionale (16.036, 17.040), Messaggi (16.037, 17.045), Celebrazione/party popper (16.038, 17.041),
Attesa/clessidra (16.039, 17.042), Ricerca/lente (16.040, 17.043).

Difetti dell'originale corretti: continenti del globo a macchie -> sagome lisce (liscio()) ritagliate sul disco; orbita con
l'aereo interrotta da un nodo (17) -> ellisse continua con aereo costruito simmetrico sul suo asse; fumetti con code diverse ->
due fumetti con la stessa coda (oggetti_d.fumetto); puntini di misure diverse -> tre puntini uguali; coriandoli a macchie ->
squiggle con tratto costante e colori alternati; clessidra con vetro asimmetrico -> costruita su asse e specchiata, due tappi uguali;
lente con anello e manico non allineati -> manico sulla diagonale del centro, anello a spessore costante.
Nuovi oggetti riutilizzabili: vedi oggetti_nuovi.py (party_popper, lente, aereo).
"""
from __future__ import annotations
import math
from comune import Scena, V, lineare, radiale, n, p, salva, arrotondato
from oggetti_a import barra, liscio, rettangolo
from oggetti_b import fumetto
from oggetti_nuovi import aereo, party_popper, lente, clessidra


def globo(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (162, 132) if lum else (151, 125)
    S = Scena("Mondo internazionale", W, H, stile)
    c, R = (V(66, 68), 56) if lum else (V(62, 64), 54)
    S.nuvola([f"M6 66 C4 24 34 6 82 6 C130 6 158 24 156 66 C154 108 126 126 80 126 C32 126 8 110 6 66 Z"] if lum else ["M4 62 C2 22 30 4 76 4 C122 4 148 22 146 62 C144 104 118 122 74 122 C28 122 6 106 4 62 Z"])
    if lum:
        S.alone("alone-destro", 118, 72, 34, 40, 0.9)
    S.ombra("ombra", c.x + 4, H - 6, 46, 3, 0.14)
    blu = ("#4C86F6", "#1F54D6", "#14246B") if lum else ("#2F7FF8", "#1B67EE", "#1555D0")
    S.d(radiale("globo-luce", c + V(-R * 0.35, -R * 0.4), R * 1.5, [(0, blu[0]), (0.55, blu[1]), (1, blu[2])]),
        f'<clipPath id="globo-ritaglio"><circle cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}"/></clipPath>')
    k = R / 56
    cont = [
        [V(-40, -30), V(-22, -42), V(-8, -34), V(-14, -22), V(-6, -10), V(-18, 4), V(-30, -6), V(-44, -14)],
        [V(-18, 14), V(-6, 10), V(2, 24), V(-4, 42), V(-14, 38), V(-20, 26)],
        [V(10, -36), V(30, -34), V(44, -20), V(34, -6), V(22, -12), V(12, -20)],
        [V(14, 4), V(30, 0), V(38, 16), V(26, 34), V(16, 24)],
    ]
    cc = "#8FB4FA" if lum else "#6FA5FB"
    paths = "".join(f'<path d="{liscio([c + q * k for q in poly], True, 0.9)}"/>' for poly in cont)
    globo_s = (f'<g id="globo"><circle id="globo-alone" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R + 2.4)}" fill="#FFFFFF" opacity="0.9"/>'
        f'<circle id="globo-disco" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="url(#globo-luce)"/>'
        f'<g id="continenti" fill="{cc}" opacity="0.85" clip-path="url(#globo-ritaglio)">{paths}</g>'
        f'<path id="globo-riflesso" d="M{p(c + V(-R * 0.72, -R * 0.1))} A{n(R * 0.74)} {n(R * 0.74)} 0 0 1 {p(c + V(-R * 0.2, -R * 0.7))}" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="4" stroke-linecap="round" fill="none"/></g>')
    # orbita: ellisse intera dietro il globo, mezza ellisse (quella davanti) ridisegnata sopra
    rot = -14; rx, ry = R * 1.14, R * 0.27; oc = V(c.x + 2, c.y + 12)
    cr, sr = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    pt = lambda x, y: oc + V(x * cr - y * sr, x * sr + y * cr)
    col = "#FFC470" if lum else "#FFD479"
    S.c(f'<g id="orbita-dietro" transform="translate({n(oc.x)} {n(oc.y)}) rotate({rot})"><ellipse rx="{n(rx)}" ry="{n(ry)}" fill="none" stroke="#FFFFFF" stroke-width="6.2" opacity="0.9"/>'
        f'<ellipse rx="{n(rx)}" ry="{n(ry)}" fill="none" stroke="{col}" stroke-width="3.8"/></g>')
    S.c(f'<g id="globo-sopra">{globo_s}</g>')
    S.c(f'<path id="orbita-fronte-alone" d="M{p(pt(-rx, 0))} A{n(rx)} {n(ry)} {rot} 0 0 {p(pt(rx, 0))}" fill="none" stroke="#FFFFFF" stroke-width="6.2" stroke-linecap="round"/>'
        f'<path id="orbita-fronte" d="M{p(pt(-rx, 0))} A{n(rx)} {n(ry)} {rot} 0 0 {p(pt(rx, 0))}" fill="none" stroke="{col}" stroke-width="3.8" stroke-linecap="round"/>')
    aereo(S, "aereo", pt(rx * 0.93, -ry * 0.55) + V(4, -10), 24, rot - 38, ("#3F78EF", "#1B45B8") if lum else ("#2F7FF8", "#1B67EE"))
    return S


def messaggi(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (156, 129) if lum else (147, 95)
    S = Scena("Messaggi", W, H, stile)
    S.nuvola(["M6 60 C4 20 34 6 78 6 C124 6 152 22 150 62 C148 104 122 124 78 124 C30 124 8 108 6 60 Z"] if lum else ["M4 44 C2 14 30 4 74 4 C118 4 144 14 143 46 C141 80 118 92 74 92 C26 92 6 78 4 44 Z"])
    if lum:
        S.alone("alone-basso", 100, 112, 50, 12, 0.7); S.ombra("ombra", 80, 124, 54, 2.5, 0.14)
        grande = (14, 14, 84, 70, V(28, 86)); piccolo = (68, 62, 142, 112, V(130, 124))
        c1 = ("#4F8AF8", "#2358D6"); c2 = ("#FFFFFF", "#DCE6FB")
    else:
        grande = (10, 8, 80, 52, V(24, 70)); piccolo = (68, 30, 138, 74, V(120, 90))
        c1 = ("#F4F8FF", "#E4ECFD"); c2 = ("#3C8AF8", "#1D67EE")
        c1, c2 = c1, c2
    for nome, (x0, y0, x1, y1, punta), col in (("fumetto-1", grande, c1 if lum else c1), ("fumetto-2", piccolo, c2 if lum else c2)):
        xa = x0 + 14 if punta.x < (x0 + x1) / 2 else x1 - 26
        d = fumetto(x0, y0, x1, y1, 11, (xa, xa + 14, punta), 2, 3)
        S.d(lineare(f"{nome}-luce", V(x0, y0), V(x1, y1), [(0, col[0]), (1, col[1])]))
        S.c(f'<g id="{nome}"><path d="{d}" fill="none" stroke="#FFFFFF" stroke-width="3.6" stroke-linejoin="round" opacity="0.9"/><path id="{nome}-corpo" d="{d}" fill="url(#{nome}-luce)"/>'
            f'<path id="{nome}-filo" d="M{n(x0 + 10)} {n(y0 + 1.2)} H{n(x1 - 10)}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.1" stroke-linecap="round"/>')
        bianco = col[0] in ("#4F8AF8", "#3C8AF8")
        cy = (y0 + y1) / 2; cx = (x0 + x1) / 2
        for k in (-1, 0, 1):
            S.c(f'<circle cx="{n(cx + k * 17)}" cy="{n(cy)}" r="4.4" fill="{"#FFFFFF" if bianco else ("#2B63DE" if lum else "#2C7BF7")}"/>')
        S.c("</g>")
    return S


def celebrazione(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (143, 130) if lum else (99, 122)
    S = Scena("Celebrazione", W, H, stile)
    S.nuvola(["M8 70 C6 30 36 14 74 14 C112 14 140 30 138 72 C136 112 112 126 72 126 C30 126 10 110 8 70 Z"] if lum else ["M4 70 C2 44 20 36 50 36 C80 36 96 46 95 76 C93 108 76 120 48 120 C20 120 6 104 4 70 Z"])
    if lum:
        S.alone("alone-bocca", 84, 56, 40, 34, 0.7)
    S.ombra("ombra", 50, H - 4, 34, 3, 0.12)
    party_popper(S, "party-popper", V(16, 116) if lum else V(14, 112), 76 if lum else 70, -46, lum)
    # coriandoli: squiggle a tratto costante, tutti della stessa lunghezza
    cols = ["#EF4444", "#2F6BEA", "#FFB21E", "#2F6BEA", "#FFB21E", "#EF4444", "#2F6BEA", "#C98B7C"]
    pos = ([(12, 40, 20), (36, 14, -70), (82, 16, 60), (92, 48, 70), (124, 28, 30), (112, 66, 10), (126, 92, 0), (100, 110, 40)] if lum else
           [(10, 40, 20), (24, 14, 90), (50, 12, -30), (68, 30, 0), (78, 46, 30), (28, 54, 10), (80, 96, 40), (70, 110, 80)])
    sq = []
    for (x, y, a), col in zip(pos, cols):
        sq.append(f'<path d="M-6 0 C-4 -4 -1 -4 0 0 S4 4 6 0" transform="translate({x} {y}) rotate({a})" stroke="{col}" stroke-width="3.4" stroke-linecap="round" fill="none"/>')
    S.c('<g id="coriandoli">' + "".join(sq) + "</g>")
    return S


def attesa(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (155, 133) if lum else (143, 119)
    S = Scena("Attesa / Caricamento", W, H, stile)
    cx = 77.5 if lum else 71.5
    S.nuvola(["M8 66 C6 26 36 8 78 8 C122 8 150 26 148 68 C146 108 120 126 78 126 C32 126 10 110 8 66 Z"] if lum else ["M6 60 C4 26 30 6 72 6 C114 6 140 26 138 64 C136 100 112 114 72 114 C28 114 8 98 6 60 Z"])
    if lum:
        S.alone("alone-sinistro", 24, 96, 26, 34, 0.55); S.alone("alone-destro", 132, 96, 26, 34, 0.55); S.alone("alone-centro", cx, 66, 36, 40, 0.8, "#FFE0A8", "#FFC470")
    S.ombra("ombra", cx, H - 5, 38, 2.5, 0.16)
    tappo = ("#FF6A5E", "#E02B2B") if lum else ("#FF5A52", "#EF3B33")
    sabbia = ("#FFB347", "#FF8A1F") if lum else ("#FFA25A", "#FF7A3A")
    clessidra(S, "clessidra", cx, 14 if lum else 8, H - 14 if lum else H - 10, 30 if lum else 31, tappo, sabbia, "#2B3F94" if lum else None)
    return S


def ricerca(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (133, 133) if lum else (134, 123)
    S = Scena("Ricerca", W, H, stile)
    S.nuvola(["M8 66 C6 26 36 8 68 8 C102 8 128 26 126 68 C124 108 100 126 66 126 C28 126 10 110 8 66 Z"] if lum else ["M6 60 C4 24 32 6 68 6 C104 6 130 26 128 64 C126 102 100 118 66 118 C28 118 8 102 6 60 Z"])
    if lum:
        S.alone("alone-basso", 66, 110, 50, 20, 0.7)
    S.ombra("ombra", 66, H - 6, 34, 2.5, 0.12)
    lente(S, "lente", V(54, 52) if lum else V(52, 48), 33 if lum else 32, 9.5 if lum else 9, 44 if lum else 40, ("#4F84F0", "#1B3FA5") if lum else ("#2F7FF8", "#1558D8"), "#1E2F7A" if lum else "#0F2F78")
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("mondo-internazionale", globo(st)))
        print(salva("messaggi-supporto", messaggi(st)))
        print(salva("celebrazione", celebrazione(st)))
        print(salva("attesa-caricamento", attesa(st)))
        print(salva("ricerca", ricerca(st)))
