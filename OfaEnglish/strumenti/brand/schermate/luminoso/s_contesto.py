"""
Illustrazioni contestuali: Email Polimi (16.031, 17.034/35 bordo), Verifica utente (16.032, 17.035), Accesso bloccato dal
secondo anno (16.033, 17.036 + 17.044 orologio).

Difetti dell'originale corretti: sigillo con lo stemma del Politecnico (17.034) -> cerchio neutro `sigillo-segnaposto`;
busta con aletta e pieghe che non tornavano -> busta con aletta a V raccordata e pieghe simmetriche; carta d'identità con
testa/busto di misure diverse -> avatar costruito (testa = cerchio, busto = mezzo ellisse col fondo piatto) con alone tondo
concentrico e tre righe di lunghezze decrescenti; finestra con la barra del titolo inclinata -> finestra e contenuto nello
stesso gruppo ruotato; cappello con losanga storta -> losanga simmetrica; lancette dell'orologio storte -> 12 e 4 (ore),
tacche vere; nel 17 orologio spezzato in un frammento a parte -> dentro la scena.
"""
from __future__ import annotations

import math
from comune import Scena, V, lineare, radiale, n, p, salva, arrotondato
from oggetti_a import barra, rettangolo
from oggetti_nuovi import busta, cappello_laurea, orologio, stella5, bagliore_clip


def sigillo_stella(S: Scena, nome: str, c: V, r: float) -> None:
    """Sigillo tondo blu notte con la stella bianca accesa (luminoso)."""
    S.d(lineare(f"{nome}-luce", c + V(-r, -r), c + V(r, r), [(0, "#3A60CC"), (0.5, "#24409F"), (1, "#14246B")]),
        radiale(f"{nome}-bagliore-g", c + V(r * 0.35, -r * 0.7), r * 1.0, [(0, "#FFB347", 0.9), (0.6, "#FF9A2E", 0.3), (1, "#FF9A2E", 0)]))
    S.d(f'<clipPath id="{nome}-ritaglio"><circle cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}"/></clipPath>')
    S.c(f'<g id="{nome}"><circle id="{nome}-alone" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r + 2)}" fill="#FFFFFF" opacity="0.9"/>'
        f'<circle id="{nome}-disco" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="url(#{nome}-luce)"/>'
        f'<circle id="{nome}-bagliore" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="url(#{nome}-bagliore-g)" clip-path="url(#{nome}-ritaglio)"/>'
        f'<path id="{nome}-stella-luce" d="{arrotondato(stella5(c + V(0, 1), r * 0.52, r * 0.235), [2, 1.4] * 5)}" fill="#FFB347" stroke="#FFB347" stroke-width="3.4" stroke-linejoin="round" opacity="0.55" filter="url(#sfuma-lieve)"/>'
        f'<path id="{nome}-stella" d="{arrotondato(stella5(c + V(0, 1), r * 0.5, r * 0.225), [2, 1.4] * 5)}" fill="#FFFBF2"/></g>')


def email(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (168, 121) if lum else (157, 106)
    S = Scena("Email Polimi", W, H, stile)
    if lum:
        S.nuvola(["M6 60 C4 22 40 8 84 8 C128 8 164 20 162 62 C160 106 130 118 84 118 C34 118 8 104 6 60 Z"])
        S.alone("alone-sigillo", 125, 52, 50, 44, 0.9, "#FFD9A0", "#FFC27A")
        S.alone("alone-basso", 90, 110, 70, 10, 0.5)
        S.ombra("ombra", 84, 117, 66, 3, 0.18)
        busta(S, "busta", V(76, 68), 108, 74, -7, ("#A9C2FB", "#7C9CF3"), ("#F6F8FF", "#E4ECFD"), 8)
        sigillo_stella(S, "sigillo", V(122, 67), 31)
    else:
        S.nuvola(["M4 50 C2 20 30 6 74 6 C120 6 154 18 152 54 C150 96 120 104 76 104 C30 104 6 94 4 50 Z"])
        S.ombra("ombra", 76, 102, 62, 2.5, 0.12)
        busta(S, "busta", V(66, 58), 112, 74, -5, ("#D3E1FB", "#BDD0FA"), ("#FFFFFF", "#EAF1FE"), 8)
        c, r = V(103, 52), 34.5
        S.d(lineare("sigillo-luce", c + V(-r, -r), c + V(r, r), [(0, "#17469F"), (1, "#0F2F78")]))
        S.c(f'<g id="sigillo"><circle id="sigillo-alone" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r + 2.4)}" fill="#FFFFFF"/>'
            f'<circle id="sigillo-disco" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="url(#sigillo-luce)"/>'
            f'<circle id="sigillo-segnaposto" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r * 0.6)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2"/></g>')
        # freccia di invio (puntatore) rossa in alto a destra
        frec = arrotondato([V(150, 3), V(128, 11), V(139, 17), V(131, 28), V(141, 28), V(143.5, 18), V(152, 24)], [0, 0, 0, 0, 0, 0, 0]) if False else None
        S.d(lineare("freccia-luce", V(128, 3), V(152, 26), [(0, "#FF6B5E"), (1, "#EF3B33")]))
        S.c(f'<path id="freccia-invio" d="{arrotondato([V(151, 3), V(128, 11.5), V(139, 17.5), V(133.5, 27), V(141, 28.5), V(146.5, 21), V(152, 26)][:3] + [V(151, 3)][:0], [2, 2, 2]) if False else arrotondato([V(152, 4), V(129, 12), V(139, 18), V(150, 25)], [2, 2, 2, 2])}" fill="url(#freccia-luce)"/>')
    return S


def carta_id(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (168, 128) if lum else (164, 105)
    S = Scena("Verifica utente", W, H, stile)
    s = S.s
    if lum:
        S.nuvola(["M6 70 C4 26 40 6 88 6 C136 6 164 24 162 70 C160 114 130 124 84 124 C34 124 8 112 6 70 Z"])
        S.alone("alone-basso", 90, 112, 78, 16, 0.85)
        S.alone("alone-destro", 150, 92, 28, 30, 0.7)
        S.ombra("ombra", 84, 124, 64, 2.5, 0.16)
        cx, cy, w, h, g = 80, 70, 138, 82, -5.5
        toni = ("#EEF3FE", "#D9E5FC", "#BFD1F9")
        av = ("#3B7BF2", "#1B57E0")
        righe = [(12, 58, -19), (13, 51, -5), (15, 45, 9)]
        col_righe = "#8FAEF4"
    else:
        S.nuvola(["M4 56 C2 20 28 6 82 6 C136 6 162 18 160 52 C158 90 130 100 80 100 C30 100 6 92 4 56 Z"])
        S.ombra("ombra", 82, 102, 62, 2.5, 0.1)
        cx, cy, w, h, g = 82, 52, 140, 84, -3.5
        toni = ("#F4F8FF", "#E6EEFD", "#D5E2FB")
        av = ("#2C7BF7", "#1766F0")
        righe = [(14, 58, -21), (14, 49, -5), (17, 43, 10)]
        col_righe = "#A9C1FA"
    x0, y0 = -w / 2, -h / 2
    S.d(lineare("carta-luce", V(0, y0), V(0, y0 + h), [(0, toni[0]), (0.55, toni[1]), (1, toni[2])]),
        lineare("avatar-luce", V(-40, -25), V(-20, 35), [(0, av[0]), (1, av[1])]))
    d = [f'<g id="carta" transform="translate({cx} {cy}) rotate({g})">']
    d.append(f'<path id="carta-spessore" d="{rettangolo(x0, y0, w, h, 11)}" transform="translate(1.4 2.6)" fill="{toni[2]}"/>')
    d.append(f'<path id="carta-faccia" d="{rettangolo(x0, y0, w, h, 11)}" fill="url(#carta-luce)" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.9"/>')
    # fascia in alto (il lato di sopra della carta, in prospettiva) solo nel luminoso
    if lum:
        d.append(f'<path id="carta-lato-alto" d="M{n(x0 + 38)} {n(y0 + 0.6)} L{n(x0 + w - 11)} {n(y0 + 0.6)} Q{n(x0 + w)} {n(y0 + 0.6)} {n(x0 + w)} {n(y0 + 11)} V{n(y0 + 12)} L{n(x0 + 38)} {n(y0 + 7)} Z" fill="#8FAEF4" opacity="0.7"/>')
    # avatar: alone tondo chiaro, testa (cerchio), busto (mezzo ellisse col fondo piatto)
    ax = -28
    d.append(f'<circle id="avatar-alone-tondo" cx="{ax}" cy="-2" r="30" fill="#FFFFFF" opacity="0.8"/>')
    d.append(f'<circle id="avatar-testa-bordo" cx="{ax}" cy="-10" r="14.2" fill="#FFFFFF" opacity="0.9"/>')
    d.append(f'<circle id="avatar-testa" cx="{ax}" cy="-10" r="12.5" fill="url(#avatar-luce)"/>')
    busto = f"M{ax - 23.5} 31 C{ax - 23.5} 14 {ax - 12} 9 {ax} 9 C{ax + 12} 9 {ax + 23.5} 14 {ax + 23.5} 31 Z"
    d.append(f'<path id="avatar-busto-bordo" d="{busto}" fill="#FFFFFF" opacity="0.9" transform="translate(0 0.4) scale(1.0)" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>')
    d.append(f'<path id="avatar-busto" d="{busto}" fill="url(#avatar-luce)"/>')
    d.append(f'<path id="avatar-riflesso" d="M{ax - 6} -14 A6 6 0 0 1 {ax - 3} -19" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" fill="none"/>')
    for i, (a, b, y) in enumerate(righe):
        d.append(barra(f"riga-{i + 1}", V(a, y), V(a + b, y), 7.5, col_righe, 0.95 if i == 0 else 0.85))
    d.append("</g>")
    S.c("".join(d))
    if lum:
        S.alone("alone-carta-basso", 100, 104, 60, 10, 0.6, "#FFC470", "#FF9A2E")
    return S


def accesso(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (190, 126) if lum else (166, 116)
    S = Scena("Accesso bloccato dal secondo anno", W, H, stile)
    s = S.s
    if lum:
        S.nuvola(["M8 62 C6 22 44 6 96 6 C146 6 186 20 184 62 C182 104 150 120 96 120 C44 120 10 104 8 62 Z"])
        S.alone("alone-centro", 92, 90, 70, 36, 0.8, "#FFD9A0", "#FFC27A")
        S.alone("alone-orologio", 146, 108, 34, 18, 0.7)
        S.ombra("ombra", 88, 123, 66, 2.5, 0.14)
        cx, cy, w, h, g = 79, 66, 126, 96, -3.8
        barra_c = ("#3E74EE", "#1C46C6"); ch = 22
        cap = dict(c=V(84 - cx, 63 - cy), L=65)
        clock = (V(143, 89), 20)
    else:
        S.nuvola(["M4 56 C2 20 28 6 76 6 C124 6 160 20 158 60 C156 104 126 112 76 112 C28 112 6 100 4 56 Z"])
        S.ombra("ombra", 66, 113, 54, 2.5, 0.1)
        cx, cy, w, h, g = 60, 60, 112, 90, -4.5
        barra_c = ("#1F63E6", "#1050CC"); ch = 24
        cap = dict(c=V(61 - cx, 62 - cy), L=60)
        clock = (V(142, 94), 19)
    x0, y0 = -w / 2, -h / 2
    S.d(lineare("finestra-luce", V(0, y0), V(0, y0 + h), [(0, "#FBFCFF"), (1, "#E4ECFD" if lum else "#EAF1FE")]),
        lineare("barra-luce", V(0, y0), V(0, y0 + ch), [(0, barra_c[0]), (1, barra_c[1])]))
    forma = rettangolo(x0, y0, w, h, 12)
    g_ = [f'<g id="finestra" transform="translate({cx} {cy}) rotate({g})">',
          f'<path id="finestra-alone" d="{forma}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.9"/>',
          f'<path id="finestra-spessore" d="{forma}" transform="translate(1.4 2.6)" fill="#CBD9F8"/>',
          f'<path id="finestra-faccia" d="{forma}" fill="url(#finestra-luce)"/>',
          f'<path id="finestra-barra" d="{arrotondato([V(x0, y0), V(x0 + w, y0), V(x0 + w, y0 + ch), V(x0, y0 + ch)], [12, 12, 0, 0])}" fill="url(#barra-luce)"/>',
          f'<path id="finestra-barra-filo" d="M{n(x0 + 12)} {n(y0 + 1.2)} H{n(x0 + w - 12)}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.1" stroke-linecap="round"/>']
    for i in range(3):
        px, py = x0 + 15 + i * 10.5, y0 + ch / 2
        col = "#FFF1D6" if (lum and i < 2) else "#FFFFFF"
        if not lum:
            col = ("#FFC857", "#FFC857", "#FFFFFF")[i]
        g_.append(f'<circle id="finestra-punto-{i + 1}" cx="{n(px)}" cy="{n(py)}" r="3.4" fill="{col}"/>')
    g_.append("</g>")
    S.c("".join(g_))
    # sagoma dello studente e cappello, nello stesso gruppo ruotato
    cc = cap["c"]; L = cap["L"]
    sub = [f'<g id="studente" transform="translate({cx} {cy}) rotate({g})">']
    S.c(sub[0])
    if lum:
        S.d(lineare("busto-luce", cc + V(0, L * 0.42), cc + V(0, L * 0.78), [(0, "#3C66D6"), (1, "#3C66D6", 0.0)]) if False else
            f'<linearGradient id="busto-luce" gradientUnits="userSpaceOnUse" x1="0" y1="{n(cc.y + L * 0.38)}" x2="0" y2="{n(cc.y + L * 0.8)}"><stop offset="0" stop-color="#4A74E0"/><stop offset="1" stop-color="#4A74E0" stop-opacity="0"/></linearGradient>')
        bx, bw = cc.x, L * 0.36
        S.c(f'<path id="busto" d="M{n(bx - bw)} {n(cc.y + L * 0.8)} C{n(bx - bw)} {n(cc.y + L * 0.52)} {n(bx - bw * 0.5)} {n(cc.y + L * 0.4)} {n(bx)} {n(cc.y + L * 0.4)} C{n(bx + bw * 0.5)} {n(cc.y + L * 0.4)} {n(bx + bw)} {n(cc.y + L * 0.52)} {n(bx + bw)} {n(cc.y + L * 0.8)} Z" fill="url(#busto-luce)"/>')
        S.c(f'<path id="colletto" d="{arrotondato([V(bx - 5.5, cc.y + L * 0.45), V(bx + 5.5, cc.y + L * 0.45), V(bx, cc.y + L * 0.68)], [1.5, 1.5, 2])}" fill="#14246B"/>')
    cappello_laurea(S, "cappello", cc, L, {"chiaro": "#3F78EF" if lum else "#2F6FF0", "base": "#2358D6" if lum else "#1A55D8", "scuro": "#173B9E" if lum else "#0E3FA8"}, "#FFA21F" if lum else "#FFB300")
    S.c("</g>")
    cck, cr = clock
    orologio(S, "orologio", cck, cr, ("#4A82F5", "#1D45B8") if lum else ("#FF6A5E", "#EF3B33"), "#14246B" if lum else "#1D4ED8")
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("email-polimi", email(st)))
        print(salva("verifica-utente", carta_id(st)))
        print(salva("accesso-bloccato", accesso(st)))
