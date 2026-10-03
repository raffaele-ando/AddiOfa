"""
Risultato / Probabilità (16.024, 17.024): arco misuratore 82 % con la pallina, e il numero.

Difetti dell'originale corretti: la pallina stava al 78 % dell'arco invece che all'82 % (qui è calcolata sull'angolo
147,6° = 0,82 · 180°); nel 17 il blu si fermava a metà arco, seguiva un tratto celeste e poi la pallina (tre stati
in uno): qui blu pieno fino alla pallina e binario grigio dopo; estremità dell'arco irregolari -> estremità tonde vere;
l'arco era tagliato dal bordo del foglio (17) -> intero.
"""
from __future__ import annotations

import math
from comune import Scena, V, lineare, radiale, n, p, salva
from oggetti_a import testo


def punto(c: V, r: float, gradi: float) -> V:
    """0° = destra, 180° = sinistra, verso l'alto (y dello schermo in giù)."""
    a = math.radians(gradi)
    return V(c.x + r * math.cos(a), c.y - r * math.sin(a))


def arco_d(c: V, r: float, da: float, a: float) -> str:
    """Arco dal grado `da` al grado `a` (da > a: senso orario sullo schermo, verso destra)."""
    P, Q = punto(c, r, da), punto(c, r, a)
    return f"M{p(P)} A{n(r)} {n(r)} 0 {1 if da - a > 180 else 0} 1 {p(Q)}"


def risultato(stile="luminoso", valore=82) -> Scena:
    lum = stile == "luminoso"
    W, H = (230, 175) if lum else (213, 140)
    S = Scena("Risultato / Probabilità", W, H, stile)
    s = S.s
    if lum:
        c, R, sp = V(115, 138), 93.0, 24.0
        S.nuvola(["M6 70 C4 24 56 5 115 5 C176 5 226 22 226 74 C228 128 206 172 115 172 C34 172 6 134 6 70 Z"])
        S.alone("alone-centro", 150, 104, 92, 56, 0.55, "#FFD9A0", "#FFC27A")
        S.alone("alone-pallina", 186, 80, 42, 40, 0.9, "#FFE3A8", "#FFC85A")
        base_fine = 0.0
    else:
        c, R, sp = V(106.5, 118), 87.0, 25.0
        S.nuvola(["M8 70 C6 26 40 6 106 6 C170 6 206 26 206 76 C206 120 190 134 106 134 C30 134 8 120 8 70 Z"])
    ang = 180 - 180 * valore / 100                       # grado della pallina
    # binario (tutto l'arco) e arco pieno
    S.d(lineare("arco-binario-luce", V(c.x - R, 0), V(c.x + R, 0),
                [(0, "#E4EAF6"), (1, "#E4EAF6")] if not lum else [(0, "#FFE7BE"), (1, "#FFE0A8")]))
    if lum:
        S.d(lineare("arco-luce", V(c.x - R - sp / 2, 0), V(c.x + R * 0.8, 0),
                    [(0, "#2D6FEE"), (0.3, "#3A78EE"), (0.58, "#7C93D2"), (0.8, "#F2BE8A"), (1, "#FFC470")]))
    else:
        S.d(lineare("arco-luce", V(c.x - R - sp / 2, 0), V(c.x + R, 0), [(0, "#2272FB"), (1, "#2A7BFA")]))
    S.c(f'<path id="arco-binario" d="{arco_d(c, R, 180, 0)}" stroke="url(#arco-binario-luce)" stroke-width="{n(sp)}" stroke-linecap="round" fill="none"/>')
    S.c(f'<path id="arco-alone" d="{arco_d(c, R, 180, ang)}" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="{n(sp + 3)}" stroke-linecap="round" fill="none"/>')
    S.c(f'<path id="arco-pieno" d="{arco_d(c, R, 180, ang)}" stroke="url(#arco-luce)" stroke-width="{n(sp)}" stroke-linecap="round" fill="none"/>')
    # filo di luce sul bordo interno dell'arco pieno
    S.c(f'<path id="arco-filo" d="{arco_d(c, R - sp * 0.28, 178, ang + 8)}" stroke="#FFFFFF" stroke-opacity="0.32" stroke-width="2" stroke-linecap="round" fill="none"/>')
    # pallina
    P = punto(c, R, ang)
    r = 11.5 if lum else 11
    if lum:
        S.d(radiale("pallina-luce", P + V(-3, -4), r * 1.5, [(0, "#FFD36A"), (0.5, "#FFA21F"), (1, "#FF7A00")]))
    else:
        S.d(radiale("pallina-luce", P + V(-3, -4), r * 1.5, [(0, "#FFD36A"), (0.55, "#FDB72E"), (1, "#F5A00C")]))
    S.c(f'<g id="pallina"><circle id="pallina-anello" cx="{n(P.x)}" cy="{n(P.y)}" r="{n(r + 3.4)}" fill="#FFFFFF"/>'
        f'<circle id="pallina-disco" cx="{n(P.x)}" cy="{n(P.y)}" r="{n(r)}" fill="url(#pallina-luce)"/>'
        f'<path id="pallina-riflesso" d="M{p(P + V(-6, -3))} A7 7 0 0 1 {p(P + V(-1.5, -7.2))}" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="1.8" stroke-linecap="round" fill="none"/></g>')
    # numero
    dim = 45.0
    ytesto = c.y - 4.5 if lum else c.y - 8.5
    if lum:
        S.c(f'<ellipse id="numero-alone" cx="{n(c.x)}" cy="{n(ytesto - 15)}" rx="56" ry="26" fill="#FFFFFF" opacity="0.55" filter="url(#sfuma-alone)"/>')
    S.c(testo("numero", f"{valore}%", 800, dim, c.x, ytesto, "#0F1D5A" if lum else "#0F1F52", centro=True, spaziatura=-0.6))
    S.per_scuro["numero"] = "#F1F5FF"
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("risultato-probabilita", risultato(st)))
