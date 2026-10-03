"""
Pezzi del marchio AddiOFA ridisegnati come forme vere (non ricalco): stella a 4 punte, O-disco con la stella,
wordmark "AddiOFA" (lettere Inter ExtraBold + O disegnata), tile ad angoli continui, sagoma "porta-stella",
lettermark A, tagline. Ogni funzione disegna su una `Tela` di ui.py e dà un id parlante a ogni pezzo.

Misure del wordmark prese dall'originale (28.003, 365x77 px): altezza maiuscole 66 px => corpo S = 90,7 px;
Inter 800 combacia con peso (stelo della i 16 px = 0,176 em) e larghezza delle lettere; l'originale è stretto
(tracking -0,045 em), la O è un disco pieno di diametro 0,772 S con la stella 4 punte bianca (semiasse 0,571 R)
al posto del vuoto, e "FA" è crenato (la A infila il piede sotto il braccio della F, -0,173 S rispetto al naturale).
Errori dell'AI corretti: lettere tagliate/storte, disco non perfettamente tondo, stella non centrata (nell'originale
è più bassa di ~1 px), punte disuguali -> stella costruita simmetrica; allineamenti e spazi uguali.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from fontTools.pens.boundsPen import BoundsPen  # noqa: E402
from ui import Tela, n, _font, tracciato  # noqa: E402,F401

# ---------------------------------------------------------------- colori campionati sugli originali
NAVY = "#071438"          # 28.003 "Addi" (#071235) / 15.004 (#011646): scelto in mezzo
BLU = "#055EFD"           # 28.003 O e FA (#035EFD)
BLU_SOFT = "#2B75F6"      # tile piatto chiaro di 15.013 / 35.020
TILE_SCURO = "#051232"    # 7.007 / 35.019
BIANCO = "#FFFFFF"
GRIGIO_MONO = "#8F98A9"   # wordmark grigio di 28 (monocromatica)

# sagoma della porta-stella (dal logo 3D: il taglio nel muro), coordinate del logo 1254 px
PORTA_D = ("M600.5 298.2Q629.8 244.9 656.4 299.6L736.8 464.3Q744.4 479.9 761.5 482.5L922.9 507.5Q970.7 514.9 936.9 549.5"
           "L828.7 660.2Q816.5 672.7 817.3 690.2L825.9 865L415.3 865L428.2 694Q429.5 677 417.7 664.8L309.5 553.4"
           "Q272 514.7 325.3 506.9L488.6 483Q499.7 481.4 505.1 471.6Z")
PORTA_BOX = (271.0, 245.0, 971.0, 865.0)       # x0, y0, x1, y1


def f(v: float) -> str:
    return n(v)


class Fo(Tela):
    """Tela con coordinate dell'immagine originale: il viewBox è il riquadro `box` (x0, y0, w, h) del ritaglio.
    Si disegna con le stesse misure dell'originale e il file coincide col ritaglio (serve alla tavola di controllo)."""
    def __init__(self, box, id: str, fondo=None):
        x0, y0, w, h = box
        super().__init__(w, h, None, id)
        self.box = box
        if fondo:
            self.rett(x0, y0, w, h, 0, fill=fondo, id="sfondo")

    def svg(self) -> str:
        s = super().svg()
        x0, y0, w, h = self.box
        return s.replace(f'viewBox="0 0 {n(w)} {n(h)}"', f'viewBox="{n(x0)} {n(y0)} {n(w)} {n(h)}"', 1)


# ---------------------------------------------------------------- forme di base
def squircle(x, y, s, r=None, k=0.65, h=None) -> str:
    """Quadrato (o rettangolo) ad angoli continui: raggio r (default 0,27 s), k = quanto si stende la curva."""
    h = s if h is None else h
    r = 0.27 * min(s, h) if r is None else r
    c = r * (1 - k)
    x1, y1 = x + s, y + h
    return (f"M{f(x + r)} {f(y)}H{f(x1 - r)}C{f(x1 - c)} {f(y)} {f(x1)} {f(y + c)} {f(x1)} {f(y + r)}"
            f"V{f(y1 - r)}C{f(x1)} {f(y1 - c)} {f(x1 - c)} {f(y1)} {f(x1 - r)} {f(y1)}"
            f"H{f(x + r)}C{f(x + c)} {f(y1)} {f(x)} {f(y1 - c)} {f(x)} {f(y1 - r)}"
            f"V{f(y + r)}C{f(x)} {f(y + c)} {f(x + c)} {f(y)} {f(x + r)} {f(y)}Z")


STELLA_U = 0.50     # quanto la curva rientra verso il centro (0,667 = astroide; più basso = più "magra")


def _cubica_tratto(P0, P1, P2, P3, t0, t1):
    """Sotto-cubica tra t0 e t1 (de Casteljau)."""
    def lerp(a, b, t): return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    def split(P, t):
        a, b, c, d = P
        ab, bc, cd = lerp(a, b, t), lerp(b, c, t), lerp(c, d, t)
        abc, bcd = lerp(ab, bc, t), lerp(bc, cd, t)
        m = lerp(abc, bcd, t)
        return (a, ab, abc, m), (m, bcd, cd, d)
    _, destra = split((P0, P1, P2, P3), t0)
    t = (t1 - t0) / (1 - t0) if t0 < 1 else 1
    sinistra, _ = split(destra, t)
    return sinistra


def stella4(cx, cy, r, u: float = STELLA_U, rx: float | None = None, tondo: float = 0.0) -> str:
    """Stella a 4 punte con i lati concavi: 4 cubiche tra le punte (su e giu' di raggio r, sinistra/destra rx).
    `tondo` = quota di ogni lato (0..0.2) sostituita da un raccordo quadratico sulla punta: punte arrotondate
    senza stroke (si puo' usare in evenodd o come maschera)."""
    rx = r if rx is None else rx
    P = [(cx, cy - r), (cx + rx, cy), (cx, cy + r), (cx - rx, cy)]
    segs = []
    for i in range(4):
        a, b = P[i], P[(i + 1) % 4]
        ca = (a[0] + (cx - a[0]) * (1 - u), a[1] + (cy - a[1]) * (1 - u))
        cb = (b[0] + (cx - b[0]) * (1 - u), b[1] + (cy - b[1]) * (1 - u))
        segs.append((a, ca, cb, b))
    if tondo <= 0:
        d = f"M{f(P[0][0])} {f(P[0][1])}"
        for a, ca, cb, b in segs:
            d += f"C{f(ca[0])} {f(ca[1])} {f(cb[0])} {f(cb[1])} {f(b[0])} {f(b[1])}"
        return d + "Z"
    sub = [_cubica_tratto(*s, tondo, 1 - tondo) for s in segs]
    d = f"M{f(sub[0][0][0])} {f(sub[0][0][1])}"
    for i, (a, ca, cb, b) in enumerate(sub):
        d += f"C{f(ca[0])} {f(ca[1])} {f(cb[0])} {f(cb[1])} {f(b[0])} {f(b[1])}"
        tip = P[(i + 1) % 4]
        nxt = sub[(i + 1) % 4][0]
        d += f"Q{f(tip[0])} {f(tip[1])} {f(nxt[0])} {f(nxt[1])}"
    return d + "Z"


def stella4_tonda(t: Tela, cx, cy, r, fill, id, u: float = STELLA_U, tondo: float = 0.07, opacita=None):
    """Stella 4 punte con le punte arrotondate (raccordo vero sulle punte, nessuno stroke)."""
    t.path(stella4(cx, cy, r, u, tondo=tondo), fill=fill, id=id, opacita=opacita)


def porta_trasformata(cx, y_alto, larghezza):
    """Parametri (scala, tx, ty) per mettere la sagoma porta-stella con la punta in (cx, y_alto) e la larghezza data."""
    x0, y0, x1, y1 = PORTA_BOX
    k = larghezza / (x1 - x0)
    return k, cx - ((x0 + x1) / 2) * k, y_alto - y0 * k


def porta_stella(t: Tela, cx, y_alto, larghezza, fill, id, stroke=None, sw=0, opacita=None, filtro=None):
    k, tx, ty = porta_trasformata(cx, y_alto, larghezza)
    a = f' id="{id}"'
    if stroke:
        a += f' stroke="{stroke}" stroke-width="{f(sw / k)}" stroke-linejoin="round"'
    if opacita is not None:
        a += f' opacity="{f(opacita)}"'
    if filtro:
        a += f' filter="{filtro}"'
    t.add(f'<path d="{PORTA_D}" transform="translate({f(tx)} {f(ty)}) scale({f(k)})" fill="{fill}"{a}/>')
    x0, y0, x1, y1 = PORTA_BOX
    return (y1 - y0) * k       # altezza


# ---------------------------------------------------------------- wordmark
PESO = 800               # peso Inter di base
ROUND = 0.0              # arrotondamento degli spigoli delle lettere (em): filo dello stesso colore con giunzione tonda
GAPS = {"d1": 0.004, "d2": 0.036, "i3": 0.045}   # distanza d'inchiostro dalla lettera precedente (em)
GAP_O = 0.036           # ink della i -> disco, disco -> ink della F (em)
O_DIAM = 0.776          # em
O_CY = 0.369            # centro del disco sopra la linea di base (em)
FA_LARGO = 1.121        # em: da sinistra della F a destra della A (le due lettere sono crenate)
STELLA_O = 0.571        # semiasse della stella / raggio del disco
CAP = 1490 / 2048       # altezza maiuscole in em (Inter)


def _g(ch, peso=None):
    f_, gs, cmap, upm = _font(peso or PESO)
    g = cmap[ord(ch)]
    bp = BoundsPen(gs); gs[g].draw(bp)
    return gs[g].width / upm, bp.bounds[0] / upm, bp.bounds[2] / upm


def misure_wordmark(S: float, x: float = 0.0, peso: int | None = None, rot: float | None = None):
    """Posizioni (origine di ogni lettera) e fine del wordmark, con l'inchiostro (compreso l'arrotondamento) della A in x."""
    peso = peso or PESO
    rot = ROUND if rot is None else rot
    h = rot / 2                                  # quanto il filo allarga l'inchiostro per parte
    pos = {}
    ink_r_prec = None
    for k, ch in enumerate("Addi"):
        adv, l, r = _g(ch, peso)
        if k == 0:
            px = x - (l - h) * S
        else:
            px = ink_r_prec + GAPS[f"{ch}{k}"] * S - (l - h) * S
        pos[f"{ch}{k}"] = (ch, px)
        ink_r_prec = px + (r + h) * S
    d = O_DIAM * S
    cx = ink_r_prec + GAP_O * S + d / 2
    pos["O"] = ("O", cx)
    advF, lF, rF = _g("F", peso)
    xF = cx + d / 2 + GAP_O * S - (lF - h) * S
    pos["F4"] = ("F", xF)
    advA, lA, rA = _g("A", peso)
    ink_l_F = xF + (lF - h) * S
    ink_r_A = ink_l_F + FA_LARGO * S
    xA2 = ink_r_A - (rA + h) * S
    pos["A5"] = ("A", xA2)
    return pos, ink_r_A


def lettera(t: Tela, ch: str, px: float, yb: float, S: float, colore: str, id: str, peso: int | None = None, rot: float | None = None):
    from ui import tracciato
    peso = peso or PESO
    rot = ROUND if rot is None else rot
    d = tracciato(ch, px, yb, S, peso)
    if rot > 0:
        t.path(d, fill=colore, stroke=colore, sw=rot * S, id=id, join="round")
    else:
        t.path(d, fill=colore, id=id)


def wordmark(t: Tela, x: float, yb: float, S: float, navy: str = NAVY, blu: str = BLU, stella: str = BIANCO,
             disco: str | None = None, id: str = "wordmark", o: str = "stella", peso_o: float = 0.19,
             peso: int | None = None, rot: float | None = None):
    """Disegna AddiOFA con l'inchiostro della A in x e la linea di base in yb. Restituisce (x_fine, y_alto, y_basso).
    `disco` = colore del disco O (default `blu`); `stella` = colore della stella nel disco; o='anello' = O come
    anello vuoto (variante del concept 15: O di Inter, senza stella)."""
    pos, fine = misure_wordmark(S, x, peso, rot)
    disco = disco or blu
    with t.gruppo(id):
        with t.gruppo(f"{id}-addi"):
            for k, ch in enumerate("Addi"):
                _, px = pos[f"{ch}{k}"]
                lettera(t, ch, px, yb, S, navy, f"{id}-lettera-{ch}{'' if ch in 'Ai' else k}", peso, rot)
        _, cx = pos["O"]
        cy = yb - O_CY * S
        R = O_DIAM * S / 2
        with t.gruppo(f"{id}-o"):
            if o == "stella":
                t.cerchio(cx, cy, R, fill=disco, id=f"{id}-o-disco")
                stella4_tonda(t, cx, cy, STELLA_O * R, stella, f"{id}-o-stella")
            else:
                t.path(f"M{f(cx - R + peso_o * S / 2)} {f(cy)}a{f(R - peso_o * S / 2)} {f(R - peso_o * S / 2)} 0 1 0 {f(2 * R - peso_o * S)} 0"
                       f"a{f(R - peso_o * S / 2)} {f(R - peso_o * S / 2)} 0 1 0 {f(-(2 * R - peso_o * S))} 0z",
                       stroke=disco, sw=peso_o * S, id=f"{id}-o-anello")
        with t.gruppo(f"{id}-fa"):
            for k in ("F4", "A5"):
                ch, px = pos[k]
                lettera(t, ch, px, yb, S, blu, f"{id}-lettera-{ch}{'-fa' if ch == 'A' else ''}", peso, rot)
    return fine, yb - CAP * S, yb


TAGLINE = "IL TUO INGLESE, SENZA OSTACOLI."


def tagline(t: Tela, x0: float, x1: float, yb: float, corpo: float, colore: str = NAVY, testo: str = TAGLINE,
            peso: int = 500, id: str = "tagline"):
    """Riga di tagline con spaziatura larga, distribuita in modo che occupi esattamente x0..x1 (come nell'originale)."""
    from ui import larghezza_testo
    nlett = len(testo)
    w0 = larghezza_testo(testo, corpo, peso)
    sp = ((x1 - x0) - w0) / (nlett - 1)
    t.testo(testo, x0, yb, corpo, peso, colore, spaziatura=sp, id=id)


# ---------------------------------------------------------------- tile (icona app semplificata, piatta)
BLU_TOP = "#0A6CF2"      # 28.012 / 7.005: dall'alto
BLU_BASSO = "#012265"    # ... al basso


def tile_sfumato(t: Tela, x, y, s, id, alto=BLU_TOP, basso=BLU_BASSO, centro="#0546BC", filo=0.22):
    """Tile ad angoli continui con sfumatura verticale blu->blu notte e un filo di luce sul bordo alto."""
    g = t.sfumatura([(0, alto), (0.5, centro), (1, basso)], x, y, x, y + s, userspace=True)
    d = squircle(x, y, s)
    t.path(d, fill=g, id=id)
    if filo:
        cid = t.uid("cl")
        t.defs.append(f'<clipPath id="{cid}"><path d="{d}"/></clipPath>')
        gl = t.sfumatura([(0, "#FFFFFF"), (0.35, "#FFFFFF")], x, y, x, y + s, userspace=True)
        t.add(f'<path d="{d}" fill="none" stroke="#FFFFFF" stroke-opacity="{n(filo)}" stroke-width="{n(max(0.8, s * 0.012))}" '
              f'clip-path="url(#{cid})" id="{id}-filo-di-luce"/>')
    return d


def marchio_stella4(t: Tela, x, y, s, id="marchio-stella", piatto=False):
    """Logo compatto: tile blu con la stella 4 punte bianca (28.012 sfumato, 28.042 piatto)."""
    with t.gruppo(id):
        if piatto:
            t.path(squircle(x, y, s), fill=BLU, id=f"{id}-tile")
        else:
            tile_sfumato(t, x, y, s, f"{id}-tile")
        cx, cy = x + s / 2, y + s * 0.505
        t.path(stella4(cx, cy, s * 0.315, STELLA_U, rx=s * 0.295, tondo=0.07), fill=BIANCO, id=f"{id}-stella")


def marchio_porta(t: Tela, x, y, s, id="marchio-porta", scuro=False, ky=1.12, larg=0.62, base=0.80, fondo=None):
    """Icona semplificata: tile con la stella-porta. scuro=False: tile blu con la porta luminosa e il pavimento chiaro
    (7.005); scuro=True: tile blu notte con la stella piena bianca (7.007 / 35.005 'App icon dark')."""
    x0, y0, x1, y1 = PORTA_BOX
    with t.gruppo(id):
        if scuro:
            g = fondo or t.sfumatura([(0, "#0B1B45"), (1, "#031030")], x, y, x + s, y + s, userspace=True)
            t.path(squircle(x, y, s), fill=g, id=f"{id}-tile")
        else:
            tile_sfumato(t, x, y, s, f"{id}-tile")
        kx = larg * s / (x1 - x0)
        ky_ = kx * ky
        h = (y1 - y0) * ky_
        top = y + base * s - h
        tx = x + s / 2 - ((x0 + x1) / 2) * kx
        ty = top - y0 * ky_
        tr = f'translate({n(tx)} {n(ty)}) scale({n(kx)} {n(ky_)})'
        if not scuro:
            cid = t.uid("cl")
            t.defs.append(f'<clipPath id="{cid}"><path d="{squircle(x, y, s)}"/></clipPath>')
            with t.gruppo(f"{id}-pavimento", clip=cid):
                chiaro = t.sfumatura([(0, "#0A3E9C"), (1, "#6C8FD0")], x, y + base * s, x, y + s, userspace=True)
                t.rett(x, y + base * s, s, s * (1 - base) + 1, 0, fill=chiaro, id=f"{id}-pavimento-fascia")
                t.ellisse(x + s / 2, y + base * s + 0.04 * s, 0.30 * s, 0.07 * s, fill=t.radiale([(0, "#FFFFFF", 0.85), (1, "#FFFFFF", 0)]),
                          id=f"{id}-pavimento-luce")
            rim = t.sfumatura([(0, "#06133C"), (1, "#0A2A7A")], x, y, x, y + s, userspace=True)
            t.add(f'<path d="{PORTA_D}" transform="{tr}" fill="{rim}" id="{id}-porta-bordo"/>')
            # vano luminoso: la stessa sagoma ridotta e spostata verso la luce (resta il bordo scuro sopra e a sinistra)
            kin = 0.88
            cxp, cyp = (x0 + x1) / 2, (y0 + y1) / 2
            tr2 = (f'translate({n(tx)} {n(ty)}) scale({n(kx)} {n(ky_)}) translate({n(cxp + 10)} {n(cyp + 14)}) '
                   f'scale({kin}) translate({n(-cxp)} {n(-cyp)})')
            vano = t.sfumatura([(0, "#FFFFFF"), (0.7, "#F4F8FF"), (1, "#C9D9FA")], 0, 0, 0, 1)
            t.add(f'<path d="{PORTA_D}" transform="{tr2}" fill="{vano}" id="{id}-porta-vano"/>')
        else:
            vano = t.sfumatura([(0, "#FFFFFF"), (1, "#E6EDFF")], 0, 0, 0, 1)
            t.add(f'<path d="{PORTA_D}" transform="{tr}" fill="{vano}" id="{id}-stella"/>')


# ---------------------------------------------------------------- stella a 5 punte (per il lettermark a Lambda)
def stella5_d(cx, cy, R, rapporto=0.46, raggio_punte=0.05):
    """Stella a 5 punte con la punta in alto; `rapporto` = raggio interno/esterno; punte arrotondate (raccordo vero)."""
    from geometria import V, arrotondato
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        r = R if i % 2 == 0 else R * rapporto
        pts.append(V(cx + r * math.cos(a), cy + r * math.sin(a)))
    return arrotondato(pts, [R * raggio_punte if i % 2 == 0 else R * 0.03 for i in range(10)])


def lambda_a(x, y, w, h, spessore=0.33, apice=0.115, stella_cy=0.60, stella_R=0.27, gola=(0.16, 0.19), raggi=(0.05, 0.03)):
    """Il lettermark 'A' a Lambda (senza traversa): restituisce (contorno, controforma).
    contorno = sagoma piena della A (apice piatto, due gambe); controforma = stella a 5 punte + gola tra le gambe,
    da sottrarre (maschera) o da riempire del colore di fondo."""
    from geometria import V, arrotondato
    cx = x + w / 2
    t_, a = spessore * w, apice * w
    pts = [V(cx - a, y), V(cx + a, y), V(x + w, y + h), V(x + w - t_, y + h), V(cx, y + h * 0.58), V(x + t_, y + h), V(x, y + h)]
    contorno = arrotondato(pts, [w * raggi[0], w * raggi[0], w * raggi[1] * 1.3, w * raggi[1], w * 0.02, w * raggi[1], w * raggi[1] * 1.3])
    sc = stella5_d(cx, y + h * stella_cy, stella_R * w)
    g1, g2 = gola
    gola_d = (f"M{n(cx - g1 * w)} {n(y + h * 0.66)}L{n(cx + g1 * w)} {n(y + h * 0.66)}L{n(cx + g2 * w)} {n(y + h + 1)}"
              f"L{n(cx - g2 * w)} {n(y + h + 1)}Z")
    return contorno, sc, gola_d
