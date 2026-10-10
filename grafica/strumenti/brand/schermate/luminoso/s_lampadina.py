"""
Suggerimenti / Consigli (16.029, 17.031/28/29): lampadina accesa con cinque raggi.

Riusa `bulbo()` di suggerimenti_consigli.py (bulbo = cerchio + collo raccordato in tangenza) e ricostruisce attacco, filamento
e raggi. Difetti dell'originale corretti: raggi a distanze diverse (il luminoso ha quelli bassi inclinati, qui sono tutti
radiali alla stessa distanza dal centro del bulbo e simmetrici), filamento senza senso (macchie bianche asimmetriche) -> due
steli uguali con ricciolo specchiato, anelli dell'attacco sbavati -> tre pezzi uguali e simmetrici.
"""
from __future__ import annotations

import math
from comune import Scena, V, lineare, radiale, n, p, salva, arrotondato
from oggetti_a import barra, rettangolo
from oggetti_nuovi import bulbo_lampadina


def lampadina(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    if lum:
        W, H, CX, cy, R = 185, 171, 92.5, 80, 37
        S = Scena("Suggerimenti / Consigli", W, H, stile)
        S.nuvola(["M8 70 C6 30 44 6 96 6 C150 6 182 24 180 80 C178 136 150 166 96 166 C40 166 10 136 8 70 Z"])
        S.alone("alone-bulbo", CX, 80, 74, 66, 0.95, "#FFF4D0", "#FFE19A")
        S.alone("alone-caldo", CX, 98, 50, 40, 0.7, "#FFD27A", "#FFB347")
        S.ombra("ombra", CX, 160, 34, 3.5, 0.22, "#1E3A8A")
        vetro = ("#FFE37A", "#FFCB3A", "#FFB61F")
        ray = ("#FFB519", 6.5)
        att = ("#3A52B0", "#27399A", "#16215E")
        collo = (18, 122, 127)
    else:
        W, H, CX, cy, R = 169, 140, 84.5, 52, 40
        S = Scena("Suggerimenti / Consigli", W, H, stile)
        S.nuvola(["M6 60 C4 40 30 36 84 36 C140 36 166 46 164 80 C162 120 140 138 84 138 C30 138 8 120 6 60 Z"])
        S.ombra("ombra", CX, 136, 32, 2.5, 0.14, "#1E3A8A")
        vetro = ("#FFC857", "#FFB83A", "#FFA81C")
        ray = ("#FFB300", 7)
        att = ("#1F5BD0", "#1B4DB8", "#0F2E80")
        collo = (19, 94, 99)
    k = {"asse": CX, "bulbo": (cy, R), "collo": collo}
    y_fondo = collo[2]
    S.d(lineare("vetro-luce", V(CX - R, cy - R), V(CX + R * 0.7, y_fondo), [(0, vetro[0]), (0.5, vetro[1]), (1, vetro[2])]),
        lineare("attacco-luce", V(CX - 20, 0), V(CX + 20, 0), [(0, att[0]), (0.35, att[1]), (1, att[2])]))
    # raggi: radiali, tutti alla stessa distanza dal centro del bulbo, simmetrici
    r0, r1 = R + 17, R + 36
    rr = []
    for i, ang in enumerate((145, 90, 35, 198, -18)):
        d = V(math.cos(math.radians(ang)), -math.sin(math.radians(ang)))
        c0 = V(CX, cy)
        rr.append(barra(f"raggio-{i + 1}", c0 + d * r0, c0 + d * r1, ray[1], ray[0]))
    S.c('<g id="raggi">' + "".join(rr) + "</g>")
    g = ['<g id="lampadina">', f'<path id="bulbo" d="{bulbo_lampadina(CX, cy, R, collo[0], collo[1], collo[2])}" fill="url(#vetro-luce)"/>']
    rb = R * 0.72
    a0, a1 = math.radians(200), math.radians(250)
    P0, P1 = V(CX + rb * math.cos(a0), cy + rb * math.sin(a0)), V(CX + rb * math.cos(a1), cy + rb * math.sin(a1))
    g.append(f'<path id="bulbo-riflesso" d="M{p(P0)} A{n(rb)} {n(rb)} 0 0 1 {p(P1)}" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="7" stroke-linecap="round" fill="none"/>')
    # filamento: due steli verticali che in alto si aprono verso l'esterno con un ricciolo (metà + specchio) e uno stelo centrale corto
    ys = y_fondo - 3
    yt = y_fondo - 24
    fil = []
    for s_ in (-1, 1):
        x0 = CX + s_ * 5.2
        fil.append(f"M{n(x0)} {n(ys)} L{n(x0)} {n(yt)} C{n(x0)} {n(yt - 4)} {n(x0 + s_ * 3)} {n(yt - 6)} {n(x0 + s_ * 6)} {n(yt - 7.5)} C{n(x0 + s_ * 9)} {n(yt - 9)} {n(x0 + s_ * 9.5)} {n(yt - 13)} {n(x0 + s_ * 8.5)} {n(yt - 15)}")
    g.append(f'<path id="filamento" d="{" ".join(fil)}" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
    g.append(f'<path id="filamento-centro" d="M{n(CX)} {n(ys)} V{n(yt - 4)}" stroke="#FFFFFF" stroke-opacity="0" stroke-width="1"/>')
    # attacco: due anelli uguali e punta (tutti sull'asse)
    hw = collo[0] + 1
    y1 = y_fondo - 1.5
    g.append(f'<g id="attacco">')
    g.append(f'<path id="attacco-punta" d="{arrotondato([V(CX - 10, y1 + 23), V(CX + 10, y1 + 23), V(CX + 5.5, y1 + 31), V(CX - 5.5, y1 + 31)], [2, 2, 4, 4])}" fill="{att[2]}"/>')
    g.append(f'<path id="attacco-corpo" d="{rettangolo(CX - hw + 2, y1, 2 * hw - 4, 24, 4)}" fill="url(#attacco-luce)"/>')
    for i, y in enumerate((y1, y1 + 11)):
        g.append(f'<path id="attacco-anello-{i + 1}" d="{rettangolo(CX - hw, y, 2 * hw, 11, 5.5)}" fill="url(#attacco-luce)"/>'
                 f'<path d="M{n(CX - hw + 6)} {n(y + 2.8)} H{n(CX + hw - 12)}" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="1.6" stroke-linecap="round"/>')
    g.append("</g></g>")
    S.c("".join(g))
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("suggerimenti-consigli", lampadina(st)))
