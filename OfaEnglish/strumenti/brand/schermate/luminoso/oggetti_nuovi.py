"""
Oggetti nuovi del kit luminoso (non esistevano nel kit blu) e riutilizzabili: banconota, party popper, lente, carta d'identità,
finestra di browser con cappello da laurea, orologio, busta con sigillo, ecc. Ogni funzione prende la Scena e vi aggiunge
defs e corpo con id parlanti (prefisso = nome dell'oggetto) e restituisce i punti utili (es. id del contorno per il bagliore).

Costruiti con geometria.py come da STILE.md: una sola massa morbida, raccordi veri, luce con un filo chiaro, toni dall'originale.
"""
from __future__ import annotations

import math
from comune import Scena, V, arrotondato, lineare, radiale, n, p
from oggetti_a import barra, testo, rettangolo, ruota  # noqa: F401


def clip_da(S: Scena, nome: str, id_forma: str) -> str:
    S.d(f'<clipPath id="{nome}"><use href="#{id_forma}"/></clipPath>')
    return f'url(#{nome})'


def bagliore_clip(S: Scena, nome: str, clip: str, cx, cy, r, op=0.85, colore="#FF9A2E", sy=0.8, x=None, y=None, w=None, h=None):
    """Luce calda che accende il bordo di una forma: radiale arancione (op → 0) ritagliato sulla forma."""
    if not S.luminoso:
        return
    op *= S.s["alone_op"]
    S.d(f'<radialGradient id="{nome}-g" gradientUnits="userSpaceOnUse" cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" '
        f'gradientTransform="translate({n(cx)} {n(cy)}) scale(1 {n(sy)}) translate({n(-cx)} {n(-cy)})">'
        f'<stop offset="0" stop-color="#FFB02E" stop-opacity="{n(op)}"/><stop offset="0.5" stop-color="{colore}" stop-opacity="{n(op * 0.45)}"/>'
        f'<stop offset="1" stop-color="{colore}" stop-opacity="0"/></radialGradient>')
    S.c(f'<rect id="{nome}" x="{n(x if x is not None else cx - r)}" y="{n(y if y is not None else cy - r)}" width="{n(w if w is not None else 2 * r)}" '
        f'height="{n(h if h is not None else 2 * r)}" fill="url(#{nome}-g)" clip-path="{clip}"/>')


def banconota(S: Scena, nome: str, c: V, w: float, h: float, gradi: float, colori: tuple, raggio: float = 9,
              simbolo: bool = False, chip: bool = False, bordo_chiaro: bool = True, simbolo_col: str = "#FFF6E5",
              bagliori: tuple = (), dim_simbolo: float = 50, dx_simbolo: float = 10) -> str:
    """Banconota/biglietto rettangolare ruotato. colori = (chiaro, medio, scuro). Tutto sta in un gruppo ruotato in c.
    Con `simbolo` disegna il € (Inter) al centro e con `chip` il sigillino scuro in alto a destra.
    Restituisce l'id della faccia (per ritagliarci sopra il bagliore)."""
    a, b, d = colori
    x0, y0 = -w / 2, -h / 2
    forma = rettangolo(x0, y0, w, h, raggio)
    S.d(lineare(f"{nome}-luce", V(x0, y0), V(x0 + w * 0.7, y0 + h), [(0, a), (0.45, b), (1, d)]))
    g = [f'<g id="{nome}" transform="translate({n(c.x)} {n(c.y)}) rotate({n(gradi)})">',
         f'<path id="{nome}-faccia" d="{forma}" fill="url(#{nome}-luce)"/>']
    if bordo_chiaro:
        g.append(f'<path id="{nome}-filo" d="M{n(x0 + raggio * 0.6)} {n(y0 + 1.1)} H{n(x0 + w - raggio * 1.1)}" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.1" stroke-linecap="round" fill="none"/>')
    if chip:
        g.append(f'<rect id="{nome}-chip" x="{n(x0 + w - 33)}" y="{n(y0 + 11)}" width="15" height="10" rx="5" fill="{d}" opacity="0.7"/>')
    if simbolo:
        g.append(testo(f"{nome}-euro", "€", 800, dim_simbolo, dx_simbolo, dim_simbolo * 0.36, simbolo_col, centro=True))
    if bagliori and S.luminoso:
        S.d(f'<clipPath id="{nome}-ritaglio"><path d="{forma}"/></clipPath>')
        for k, (bx, by, br, bop) in enumerate(bagliori):
            S.d(f'<radialGradient id="{nome}-bag{k}" gradientUnits="userSpaceOnUse" cx="{n(bx)}" cy="{n(by)}" r="{n(br)}">'
                f'<stop offset="0" stop-color="#FFB02E" stop-opacity="{n(bop)}"/><stop offset="0.5" stop-color="#FF9A2E" stop-opacity="{n(bop * 0.45)}"/>'
                f'<stop offset="1" stop-color="#FF9A2E" stop-opacity="0"/></radialGradient>')
            g.append(f'<rect id="{nome}-bagliore-{k + 1}" x="{n(x0)}" y="{n(y0)}" width="{n(w)}" height="{n(h)}" fill="url(#{nome}-bag{k})" clip-path="url(#{nome}-ritaglio)"/>')
    g.append("</g>")
    S.c("".join(g))
    return f"{nome}-faccia"


# ---------------------------------------------------------------- lucchetto

def lucchetto(S: Scena, nome: str, x: float, y: float, w: float, h: float, arco_x: tuple, arco_y: float, spessore: float,
              colori: dict, raggio: float = 8, luce_chiave: bool = True, alone_bianco: bool = True) -> None:
    """Lucchetto: corpo arrotondato x,y,w,h; arco a U di spessore costante che esce dal lato di sopra tra arco_x=(x_sx,x_dx)
    (assi del tratto) con la cima a arco_y; buco della chiave (cerchio + trapezio) centrato, acceso se luce_chiave nel luminoso.
    colori: corpo=(chiaro,scuro), arco=(chiaro,scuro), chiave."""
    cx = x + w / 2
    xa, xb = arco_x
    r = (xb - xa) / 2
    arco = f"M{n(xa)} {n(y + 2)} V{n(arco_y + r)} A{n(r)} {n(r)} 0 0 1 {n(xb)} {n(arco_y + r)} V{n(y + 2)}"
    S.d(lineare(f"{nome}-corpo-luce", V(x, y), V(x + w * 0.6, y + h), [(0, colori["corpo"][0]), (1, colori["corpo"][1])]),
        lineare(f"{nome}-arco-luce", V(xa, arco_y), V(xb, arco_y + r * 2), [(0, colori["arco"][0]), (1, colori["arco"][1])]))
    g = [f'<g id="{nome}">']
    if alone_bianco:
        g.append(f'<path id="{nome}-arco-alone" d="{arco}" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="{n(spessore + 3)}" fill="none"/>'
                 f'<path id="{nome}-corpo-alone" d="{rettangolo(x - 1.6, y - 1.6, w + 3.2, h + 3.2, raggio + 1.6)}" fill="#FFFFFF" opacity="0.9"/>')
    g.append(f'<path id="{nome}-arco" d="{arco}" stroke="url(#{nome}-arco-luce)" stroke-width="{n(spessore)}" fill="none"/>')
    g.append(f'<path id="{nome}-arco-riflesso" d="M{n(xa - spessore * 0.15)} {n(arco_y + r + 3)} V{n(arco_y + r)} A{n(r)} {n(r)} 0 0 1 {n(cx - r * 0.3)} {n(arco_y + spessore * 0.15)}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6" stroke-linecap="round" fill="none"/>')
    g.append(f'<path id="{nome}-corpo" d="{rettangolo(x, y, w, h, raggio)}" fill="url(#{nome}-corpo-luce)"/>')
    g.append(f'<path id="{nome}-filo" d="M{n(x + raggio)} {n(y + 1.1)} H{n(x + w - raggio)}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.1" stroke-linecap="round" fill="none"/>')
    cy = y + h * 0.5
    rc = min(w, h) * 0.12
    yb = cy + rc * 0.866
    foro = (f"M{n(cx - rc * 0.5)} {n(yb)} A{n(rc)} {n(rc)} 0 1 1 {n(cx + rc * 0.5)} {n(yb)} L{n(cx + rc * 0.8)} {n(cy + rc * 3.1)} "
            f"Q{n(cx)} {n(cy + rc * 3.5)} {n(cx - rc * 0.8)} {n(cy + rc * 3.1)} Z")
    if luce_chiave and S.luminoso:
        S.d(radiale(f"{nome}-chiave-alone", V(cx, cy + rc), rc * 3.2, [(0, "#FFB02E", 0.95), (0.55, "#FF8A1F", 0.5), (1, "#FF8A1F", 0)]))
        g.append(f'<circle id="{nome}-chiave-bagliore" cx="{n(cx)}" cy="{n(cy + rc)}" r="{n(rc * 3.2)}" fill="url(#{nome}-chiave-alone)"/>')
        g.append(f'<path id="{nome}-chiave" d="{foro}" fill="#FFF3DC" stroke="#FF9A2E" stroke-width="1.1" stroke-linejoin="round"/>')
    else:
        g.append(f'<path id="{nome}-chiave" d="{foro}" fill="{colori["chiave"]}"/>')
    g.append("</g>")
    S.c("".join(g))


# ---------------------------------------------------------------- stella e trofeo

def stella5(c: V, R: float, r: float) -> list[V]:
    return [c + V(math.sin(math.pi * k / 5) * (R if k % 2 == 0 else r), -math.cos(math.pi * k / 5) * (R if k % 2 == 0 else r)) for k in range(10)]


def trofeo(S: Scena, nome: str, CX: float, y_rim: float, hw_rim: float, y_bowl: float, hw_neck: float, y_stelo: float,
           base: tuple, manico: tuple, colori: dict, stella: tuple, spessore_manico: float = 11, fianco: float = 0.72) -> None:
    """Coppa simmetrica su un asse (CX): si disegna la metà destra e la sinistra è lo specchio (stessi numeri), manici uguali.
    base = (y, alto, mezza larghezza, raggio); manico = (A, c1, c2, B) come scarti da CX (x) e y assoluta;
    stella = (cy, R, r); colori: chiaro, base, scuro, orlo, stelo=(c,s), basamento=(c,s), manico=(c,s), stella."""
    c = colori
    yb, ab, hb, rb = base
    # profilo della coppa: orlo piatto, fianco che scende con curva a tulipano fino al collo
    def meta(sgn):
        x = lambda d: CX + sgn * d
        return (f"L{n(x(hw_rim - 5))} {n(y_rim)} Q{n(x(hw_rim))} {n(y_rim)} {n(x(hw_rim))} {n(y_rim + 5)} "
                f"C{n(x(hw_rim - 1))} {n(y_rim + (y_bowl - y_rim) * fianco)} {n(x(hw_neck + 30))} {n(y_bowl - 2)} {n(x(hw_neck))} {n(y_bowl + 1)}")
    sx = f"M{n(CX)} {n(y_rim)} " + meta(-1) + f" L{n(CX)} {n(y_bowl + 1)} L{n(CX + hw_neck)} {n(y_bowl + 1)} " + \
        " ".join(reversed([])) 
    # percorso unico: sinistra dal centro-alto al collo, poi destra dal collo all'orlo
    sinistra = meta(-1)
    destra_pts = meta(1)
    # la destra va costruita al contrario: dal collo risalendo; si specchia la curva invertendola
    xr = lambda d: CX + d
    destra = (f"L{n(xr(hw_neck))} {n(y_bowl + 1)} C{n(xr(hw_neck + 30))} {n(y_bowl - 2)} {n(xr(hw_rim - 1))} {n(y_rim + (y_bowl - y_rim) * fianco)} {n(xr(hw_rim))} {n(y_rim + 5)} "
              f"Q{n(xr(hw_rim))} {n(y_rim)} {n(xr(hw_rim - 5))} {n(y_rim)} Z")
    coppa = f"M{n(CX)} {n(y_rim)} {sinistra} L{n(CX - 0)} {n(y_bowl + 1)} {destra}"
    A, c1, c2, B = manico
    mani = []
    for sgn in (-1, 1):
        a, b1, b2, bb = (V(CX + sgn * q[0], q[1]) for q in (A, c1, c2, B))
        mani.append(f'<path id="{nome}-manico-{"sx" if sgn < 0 else "dx"}" d="M{p(a)} C{p(b1)} {p(b2)} {p(bb)}" stroke="url(#{nome}-manico-luce)" '
                    f'stroke-width="{n(spessore_manico)}" stroke-linecap="round" fill="none"/>')
    base_basso = yb + ab
    S.d(lineare(f"{nome}-coppa-luce", V(CX - hw_rim, 0), V(CX + hw_rim, 0), [(0, c["chiaro"]), (0.38, c["base"]), (1, c["scuro"])]),
        lineare(f"{nome}-stelo-luce", V(CX - 14, 0), V(CX + 14, 0), [(0, c["stelo"][0]), (0.5, c["stelo"][1]), (1, c["stelo"][2])]),
        lineare(f"{nome}-base-luce", V(0, yb), V(0, base_basso), [(0, c["basamento"][0]), (1, c["basamento"][1])]),
        lineare(f"{nome}-manico-luce", V(0, A[1]), V(0, B[1]), [(0, c["manico"][0]), (1, c["manico"][1])]))
    g = [f'<g id="{nome}">']
    g.append(f'<g id="{nome}-manici">{"".join(mani)}</g>')
    # stelo (trapezio che si allarga in basso) e basamento
    ys0, ys1 = y_bowl - 2, yb + 2
    ym = ys0 + (ys1 - ys0) * 0.42
    hs = hw_neck - 1
    hf = hb * 0.58
    stelo = (f"M{n(CX - hs)} {n(ys0)} L{n(CX + hs)} {n(ys0)} L{n(CX + hs)} {n(ym)} C{n(CX + hs)} {n(ym + 9)} {n(CX + hf)} {n(ys1 - 9)} {n(CX + hf)} {n(ys1)} "
             f"L{n(CX - hf)} {n(ys1)} C{n(CX - hf)} {n(ys1 - 9)} {n(CX - hs)} {n(ym + 9)} {n(CX - hs)} {n(ym)} Z")
    g.append(f'<path id="{nome}-stelo" d="{stelo}" fill="url(#{nome}-stelo-luce)"/>')
    g.append(f'<path id="{nome}-base" d="{rettangolo(CX - hb, yb, 2 * hb, ab, rb)}" fill="url(#{nome}-base-luce)"/>')
    g.append(f'<path id="{nome}-base-filo" d="M{n(CX - hb + rb)} {n(yb + 2)} H{n(CX + hb - rb)}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round"/>')
    g.append(f'<path id="{nome}-coppa" d="{coppa}" fill="url(#{nome}-coppa-luce)"/>')
    g.append(f'<path id="{nome}-orlo" d="M{n(CX - hw_rim + 5)} {n(y_rim + 1.4)} H{n(CX + hw_rim - 5)}" stroke="{c["orlo"]}" stroke-width="3" stroke-linecap="round" opacity="0.65"/>')
    g.append(f'<path id="{nome}-riflesso" d="M{n(CX - hw_rim + 9)} {n(y_rim + 16)} C{n(CX - hw_rim + 8)} {n(y_rim + 30)} {n(CX - hw_rim + 11)} {n(y_rim + 44)} {n(CX - hw_rim + 18)} {n(y_rim + 54)}" '
             f'stroke="#FFFFFF" stroke-opacity="0.38" stroke-width="5" stroke-linecap="round" fill="none"/>')
    scy, SR, Sr = stella
    g.append(f'<path id="{nome}-stella" d="{arrotondato(stella5(V(CX, scy), SR, Sr), [2, 1.5] * 5)}" fill="{c["stella"]}"/>')
    g.append("</g>")
    S.c("".join(g))


def bulbo_lampadina(CX: float, cy: float, R: float, w: float, y_curva: float, y_fondo: float, ang: float = 0, k1: float = 0, k2: float = 0) -> str:
    """Bulbo = cerchio + collo a cono tangente al cerchio (la tangente parte da (CX-w, y_curva)), simmetrico su CX."""
    P = V(CX - w, y_curva)
    C = V(CX, cy)
    d = (P - C).lung()
    th = math.atan2(P.y - C.y, P.x - C.x)
    phi = th + math.acos(R / d)
    T = C + V(math.cos(phi), math.sin(phi)) * R
    if T.x > CX or T.y < cy:           # scegli il punto di tangenza in basso a sinistra
        phi = th - math.acos(R / d); T = C + V(math.cos(phi), math.sin(phi)) * R
    Ts = V(2 * CX - T.x, T.y)
    return (f"M{n(CX - w)} {n(y_fondo)} L{p(P)} L{p(T)} A{n(R)} {n(R)} 0 1 1 {p(Ts)} L{n(CX + w)} {n(y_curva)} L{n(CX + w)} {n(y_fondo)} Z")
