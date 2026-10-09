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


# ---------------------------------------------------------------- orologio, cappello, busta

def orologio(S: Scena, nome: str, c: V, r: float, anello: tuple, lancette: str, ore_minuti=(0, 12 * 4 / 12 * 30 + 0), spessore: float | None = None) -> None:
    """Orologio tondo: anello colorato (chiaro, scuro), quadrante chiaro, 4 tacche (12-3-6-9), due lancette tonde: minuti al 12 e
    ore verso le 4 (angoli misurati dal 12, in senso orario). Tutto in tracciati veri."""
    sp = spessore or r * 0.22
    S.d(lineare(f"{nome}-anello-luce", c + V(-r, -r), c + V(r, r), [(0, anello[0]), (1, anello[1])]),
        radiale(f"{nome}-quadrante-luce", c + V(-r * 0.3, -r * 0.4), r * 1.3, [(0, "#FFFFFF"), (1, "#E9EFFD")]))
    g = [f'<g id="{nome}">',
         f'<circle id="{nome}-alone" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r + 2.6)}" fill="#FFFFFF" opacity="0.9"/>',
         f'<circle id="{nome}-quadrante" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="url(#{nome}-quadrante-luce)"/>',
         f'<circle id="{nome}-anello" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r - sp / 2)}" stroke="url(#{nome}-anello-luce)" stroke-width="{n(sp)}" fill="none"/>']
    ri = r - sp - 1.8
    for k, a in enumerate((0, 90, 180, 270)):
        d = V(math.sin(math.radians(a)), -math.cos(math.radians(a)))
        g.append(f'<path id="{nome}-tacca-{k + 1}" d="M{p(c + d * ri)} L{p(c + d * (ri - r * 0.12))}" stroke="{lancette}" stroke-opacity="0.55" stroke-width="{n(r * 0.07)}" stroke-linecap="round"/>')
    for nm, ang, lung, sp2 in (("minuti", 0, r * 0.62, r * 0.1), ("ore", 120, r * 0.42, r * 0.12)):
        d = V(math.sin(math.radians(ang)), -math.cos(math.radians(ang)))
        g.append(f'<path id="{nome}-lancetta-{nm}" d="M{p(c)} L{p(c + d * lung)}" stroke="{lancette}" stroke-width="{n(sp2)}" stroke-linecap="round"/>')
    g.append(f'<circle id="{nome}-perno" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r * 0.1)}" fill="{lancette}"/></g>')
    S.c("".join(g))


def cappello_laurea(S: Scena, nome: str, c: V, larg: float, colori: dict, nappa: str = "#FFA21F", con_nappa: bool = True) -> None:
    """Tocco da laureato: losanga (faccia sopra) con il suo spessore, calotta sotto, bottone e cordino con nappa. `c` = centro della
    losanga, `larg` = larghezza della losanga (punta a punta). La losanga è simmetrica sul suo asse verticale."""
    L = larg
    top = [c + V(-L / 2, 0.06 * L), c + V(-0.02 * L, -0.24 * L), c + V(L / 2, 0.03 * L), c + V(0.0, 0.2 * L)]
    # la losanga è leggermente storta in prospettiva (punta sinistra più bassa), come nell'originale
    sp = L * 0.075
    sotto = [p_ + V(0, sp) for p_ in top]
    S.d(lineare(f"{nome}-sopra-luce", top[1], top[3], [(0, colori["chiaro"]), (1, colori["base"])]),
        lineare(f"{nome}-calotta-luce", c + V(0, L * 0.1), c + V(0, L * 0.5), [(0, colori["base"]), (1, colori["scuro"])]))
    # calotta: dalla losanga scende, larga ~0.58 L, fondo curvo
    cw = L * 0.27
    base_y = c.y + L * 0.4
    calotta = f"M{n(c.x - cw)} {n(c.y + L * 0.1)} L{n(c.x - cw)} {n(base_y - L * 0.06)} Q{n(c.x)} {n(base_y + L * 0.1)} {n(c.x + cw)} {n(base_y - L * 0.06)} L{n(c.x + cw)} {n(c.y + L * 0.1)} Z"
    g = [f'<g id="{nome}">', f'<path id="{nome}-calotta" d="{calotta}" fill="url(#{nome}-calotta-luce)"/>',
         f'<path id="{nome}-spessore" d="{arrotondato([top[0], top[3], top[2], sotto[2], sotto[3], sotto[0]], [2, 1, 2, 2, 1, 2])}" fill="{colori["scuro"]}"/>',
         f'<path id="{nome}-sopra" d="{arrotondato(top, [2.5, 3, 2.5, 3])}" fill="url(#{nome}-sopra-luce)"/>',
         f'<path id="{nome}-filo" d="M{p(top[0] + V(2, -0.4))} L{p(top[1] + V(0, 1))} L{p(top[2] + V(-2, -0.2))}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
         f'<circle id="{nome}-bottone" cx="{n(c.x)}" cy="{n(c.y - L * 0.02)}" r="{n(L * 0.025)}" fill="{colori["scuro"]}"/>']
    if con_nappa:
        a = c + V(0, -L * 0.02)
        b = top[2] + V(-L * 0.07, L * 0.045)
        g.append(f'<path id="{nome}-cordino" d="M{p(a)} L{p(b)}" stroke="{colori["scuro"]}" stroke-width="{n(L * 0.014)}" stroke-linecap="round" fill="none"/>')
        g.append(f'<path id="{nome}-cordino-giu" d="M{p(b)} V{n(b.y + L * 0.17)}" stroke="#9A4A2C" stroke-width="{n(L * 0.03)}" stroke-linecap="round" fill="none"/>')
        g.append(f'<path id="{nome}-nappa" d="{rettangolo(b.x - L * 0.03, b.y + L * 0.15, L * 0.06, L * 0.1, L * 0.03)}" fill="{nappa}"/>')
    g.append("</g>")
    S.c("".join(g))


def busta(S: Scena, nome: str, c: V, w: float, h: float, gradi: float, corpo: tuple, aletta: tuple, raggio: float = 8, pieghe: bool = True) -> None:
    """Busta chiusa: corpo arrotondato (chiaro, scuro), aletta triangolare (punta in basso al ~58% dell'altezza) con raccordi veri,
    due pieghe sottili dagli angoli di sotto al centro. Tutto in un gruppo ruotato in c."""
    x0, y0 = -w / 2, -h / 2
    S.d(lineare(f"{nome}-corpo-luce", V(x0, y0), V(x0 + w * 0.3, y0 + h), [(0, corpo[0]), (1, corpo[1])]),
        lineare(f"{nome}-aletta-luce", V(0, y0), V(0, y0 + h * 0.6), [(0, aletta[0]), (1, aletta[1])]))
    tip = V(0, y0 + h * 0.6)
    ale = arrotondato([V(x0 + 0.5, y0 + 0.5), tip, V(x0 + w - 0.5, y0 + 0.5)], [raggio * 0.9, raggio * 0.9, raggio * 0.9])
    g = [f'<g id="{nome}" transform="translate({n(c.x)} {n(c.y)}) rotate({n(gradi)})">',
         f'<path id="{nome}-corpo" d="{rettangolo(x0, y0, w, h, raggio)}" fill="url(#{nome}-corpo-luce)"/>']
    if pieghe:
        g.append(f'<path id="{nome}-pieghe" d="M{n(x0 + raggio * 0.6)} {n(y0 + h - raggio * 0.5)} L{n(-w * 0.04)} {n(y0 + h * 0.46)} M{n(x0 + w - raggio * 0.6)} {n(y0 + h - raggio * 0.5)} L{n(w * 0.04)} {n(y0 + h * 0.46)}" '
                 f'stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.1" stroke-linecap="round" fill="none"/>')
    g.append(f'<path id="{nome}-aletta-ombra" d="{ale}" transform="translate(0 1.8)" fill="{corpo[1]}" opacity="0.28"/>')
    g.append(f'<path id="{nome}-aletta" d="{ale}" fill="url(#{nome}-aletta-luce)" stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1.1" stroke-linejoin="round"/>')
    g.append("</g>")
    S.c("".join(g))
