"""
Progressi / Statistiche (16.035, 17.039): quattro barre crescenti.

Difetti dell'originale corretti: barre con larghezze e passi leggermente diversi e la prima più alta dell'appoggio -> quattro
barre larghe uguali, passo costante, tutte appoggiate alla stessa linea, altezze in progressione regolare (23-41-64-92);
ombre irregolari sotto le barre -> un'unica ombra. Nel luminoso le barre si accendono d'arancione dal piede, più forte
sulle più alte (come nell'originale).
"""
from __future__ import annotations

from comune import Scena, V, lineare, n, salva
from oggetti_a import rettangolo


def barre(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    if lum:
        W, H = 156, 122
        S = Scena("Progressi / Statistiche", W, H, stile)
        S.nuvola(["M6 60 C4 22 34 4 80 4 C126 4 154 22 152 62 C150 100 128 118 80 118 C30 118 8 100 6 60 Z"])
        S.alone("alone-barre", 108, 98, 48, 34, 0.95)
        S.alone("alone-sinistro", 50, 96, 40, 20, 0.5)
        x0, pitch, w, base, hs, r = 16, 28.4, 22, 107, (23, 41, 64, 92), 8
        top, bot = "#3C7BF7", "#1B52DC"
    else:
        W, H = 144, 110
        S = Scena("Progressi / Statistiche", W, H, stile)
        S.nuvola(["M4 56 C2 20 40 2 90 2 C130 2 142 22 140 62 C138 96 120 106 72 106 C24 106 6 94 4 56 Z"])
        x0, pitch, w, base, hs, r = 11, 29.5, 22, 106, (20, 41, 65, 92), 6.5
        top, bot = "#2B7BF8", "#1768F0"
    S.ombra("ombra", 72 if not lum else 78, base + 1.5, 64, 2.5, 0.14 if lum else 0.1)
    for i, hh in enumerate(hs):
        x = x0 + i * pitch
        y = base - hh
        nome = f"barra-{i + 1}"
        S.d(lineare(f"{nome}-luce", V(x, y), V(x, base), [(0, top), (1, bot)]))
        forma = rettangolo(x, y, w, hh, r)
        S.c(f'<g id="{nome}"><path id="{nome}-alone" d="{rettangolo(x - 1.8, y - 1.8, w + 3.6, hh + 3.6, r + 1.8)}" fill="#FFFFFF" opacity="0.9"/>'
            f'<path id="{nome}-corpo" d="{forma}" fill="url(#{nome}-luce)"/>'
            f'<path id="{nome}-testa" d="{rettangolo(x + 1.5, y + 1.5, w - 3, min(7, hh * 0.3), r * 0.7)}" fill="#FFFFFF" opacity="0.2"/>'
            f'<path id="{nome}-filo" d="M{n(x + r * 0.8)} {n(y + 1)} H{n(x + w - r * 0.8)}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.1" stroke-linecap="round"/>'
            f'<path id="{nome}-riflesso" d="M{n(x + 4)} {n(y + 12)} V{n(base - 10)}" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="2.2" stroke-linecap="round"/></g>')
        if lum:
            k = (0.5, 0.6, 0.85, 1.0)[i]
            S.d(f'<clipPath id="{nome}-ritaglio"><path d="{forma}"/></clipPath>'
                f'<linearGradient id="{nome}-calore" gradientUnits="userSpaceOnUse" x1="0" y1="{n(base - 38)}" x2="0" y2="{n(base)}"><stop offset="0" stop-color="#FFB02E" stop-opacity="0"/><stop offset="1" stop-color="#FFB02E" stop-opacity="{n(0.95 * k)}"/></linearGradient>')
            S.c(f'<rect id="{nome}-calore-bagliore" x="{n(x)}" y="{n(base - 38)}" width="{w}" height="38" fill="url(#{nome}-calore)" clip-path="url(#{nome}-ritaglio)"/>')
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("progressi-statistiche", barre(st)))
