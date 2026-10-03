"""
Studio / Inglese, kit luminoso (16.022) e vivo (17.022): due libri impilati, bandiera del Regno Unito sulla copertina.

Riusa `oggetti.libro()` e `oggetti.bandiera_uk()` del kit blu cambiando palette; in più:
- luminoso: libro sotto più scuro, pagine color crema accese dall'alone arancione, alone dietro e sotto;
- vivo: tutti e due i libri blu pieno, pagine crema, bandiera in piedi sul libro sopra.
Difetti dell'originale corretti: bandiera storta rispetto alla copertina (qui è posata sul piano della
copertina, assi paralleli ai lati del libro) con diagonali rosse sfalsate e non centrate; spigoli dei libri
non paralleli (qui i due libri hanno le stesse direzioni); dorso a fasce (qui curvo con la cerniera).
"""
from __future__ import annotations

from comune import Scena, V, lineare, n, salva
from oggetti import libro, bandiera_uk

COLORI_LIBRO = {
    "luminoso": [
        ("libro-sotto", {"chiaro": "#3F67C9", "base": "#2B4FAE", "scuro": "#14246B", "pagine": "#E9EDF8", "righe": "#CBD5EA"}),
        ("libro-sopra", {"chiaro": "#5E93F6", "base": "#2E6BEA", "scuro": "#1B3FA6", "pagine": "#FFF0D2", "righe": "#F3D9AC"}),
    ],
    "vivo": [
        ("libro-sotto", {"chiaro": "#3F82F6", "base": "#1F5EE0", "scuro": "#1646B8", "pagine": "#F8EBD0", "righe": "#E9D9B8"}),
        ("libro-sopra", {"chiaro": "#4D8EF8", "base": "#2268EA", "scuro": "#1646B8", "pagine": "#F8EBD0", "righe": "#E9D9B8"}),
    ],
}


def studio_inglese(stile="luminoso") -> Scena:
    W, H = (210, 159) if stile == "luminoso" else (184, 150)
    S = Scena("Studio / Inglese", W, H, stile)
    if stile == "luminoso":
        S.nuvola([ "M20 70 C14 30 40 10 90 8 C150 6 200 12 204 60 C208 110 190 150 140 154 C80 158 20 150 18 110 Z"], caldo=1)
        F2, F1, u2, u1, v, sp2, sp1 = V(98, 121), V(100, 94), V(88, -40), V(96, -43), V(-74, -32), 29, 31
        S.alone("alone-sinistro", 46, 130, 64, 28, 1.0, "#FFA83A", "#FF8A1F")
        S.alone("alone-pagine", 140, 84, 62, 26, 0.75, "#FFC470", "#FF9A2E")
        S.alone("alone-fondo", 110, 146, 90, 12, 0.5)
        S.ombra("ombra", 108, 152, 88, 4, 0.22)
        flag_s = 1.0
    else:
        S.nuvola([ "M6 60 C4 22 30 6 80 4 C130 2 176 10 180 56 C184 100 168 142 120 146 C70 150 8 142 6 100 Z"])
        F2, F1, u2, u1, v, sp2, sp1 = V(80, 132), V(80, 106), V(74, -30), V(78, -32), V(-62, -27), 21, 24
        S.ombra("ombra", 90, 146, 74, 4, 0.16)
    for (nome, col), F, u, sp in zip(COLORI_LIBRO[stile], (F2, F1), (u2, u1), (sp2, sp1)):
        d, c = libro(nome, F, u, v, sp, col)
        S.d(d); S.c(c)
    if S.luminoso:
        # luce calda che sale dal basso sul fianco del libro sotto e sul bordo delle pagine
        S.d('<clipPath id="clip-libro-sotto"><use href="#libro-sotto-corpo"/></clipPath>')
        S.d(f'<radialGradient id="rim-sotto" gradientUnits="userSpaceOnUse" cx="40" cy="132" r="48" gradientTransform="translate(40 132) scale(1 0.8) translate(-40 -132)">'
            f'<stop offset="0" stop-color="#FFA21F" stop-opacity="0.95"/><stop offset="0.5" stop-color="#FF9A2E" stop-opacity="0.45"/><stop offset="1" stop-color="#FF9A2E" stop-opacity="0"/></radialGradient>')
        S.c('<rect id="rim-sotto-luce" x="0" y="90" width="130" height="64" fill="url(#rim-sotto)" clip-path="url(#clip-libro-sotto)"/>')
        S.d('<clipPath id="clip-libro-sopra"><use href="#libro-sopra-corpo"/></clipPath>')
        S.d(f'<radialGradient id="rim-sopra" gradientUnits="userSpaceOnUse" cx="46" cy="100" r="40" gradientTransform="translate(46 100) scale(1 0.7) translate(-46 -100)">'
            f'<stop offset="0" stop-color="#FFB347" stop-opacity="0.8"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>')
        S.c('<rect id="rim-sopra-luce" x="0" y="70" width="110" height="60" fill="url(#rim-sopra)" clip-path="url(#clip-libro-sopra)"/>')
    S.alone("alone-pagine-sopra", 150, 80, 50, 18, 0.7, "#FFD58A", "#FFB347") if S.luminoso else None
    # bandiera posata sulla copertina del libro sopra: asse x lungo u, asse y verso il fronte (= -v)
    F, u = F1, u1
    centro = F + u * 0.52 + v * 0.5
    fw, fh = (76.0, 45.0) if S.luminoso else (62.0, 37.0)
    ux, vx = u.uni(), (-v).uni()
    a, b = ux * (fw / 62.0) * 1.0, vx * 1.0
    # matrice (a b c d e f): x' = a*x + c*y + e
    e = centro - ux * (fw / 2) - vx * (fh / 2)
    M = (ux.x, ux.y, vx.x, vx.y, e.x, e.y)
    d, c = bandiera_uk("bandiera", M, fw, fh, blu="#2250D8" if S.luminoso else "#1D4ED8", rosso="#F0434F", raggio=2)
    S.d(d); S.c(c)
    S.c(f'<path id="spigolo-copertina" d="M{n(F.x + v.x * 0.03)} {n(F.y + v.y * 0.03)} L{n(F.x + u.x * 0.96)} {n(F.y + u.y * 0.96)}" stroke="#FFFFFF" stroke-opacity="0.0"/>')
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("studio-inglese", studio_inglese(st)))
