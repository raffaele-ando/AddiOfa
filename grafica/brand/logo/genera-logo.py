#!/usr/bin/env python3
"""Genera i loghi puliti di AddiOFA (lettermark, wordmark, lockup, stelle) come SVG ricostruiti a mano.

    python3 grafica/brand/logo/genera-logo.py

Scrive in questa cartella: `lettermark-*.svg`, `wordmark-*.svg`, `lockup-*.svg`, `stella-*.svg`,
le versioni per fondo scuro in `su-scuro/` e per fondo blu in `su-blu/`, e `manifest.json`
(elenco con fonte NN del concept, usato da `tools/make-galleria-logo.py` e dal catalogo).

Geometria misurata dai concept (NN 15, 07, 35, 28, 24) e sovrapposta a vista; nessun <text>:
le lettere sono tracciati di Inter ExtraBold (come l'app) con gli spigoli raccordati.
Dipendenze: fontTools (e Pillow/Playwright solo per gli altri script). Il font è `app/node_modules/@fontsource/inter`.
"""
from __future__ import annotations

import json
import math
import pathlib
import re
from xml.dom import minidom

from fontTools.pens.basePen import decomposeQuadraticSegment
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[2]
FONT_DIR = RADICE / "app" / "node_modules" / "@fontsource" / "inter" / "files"
CONCEPT_SVG = RADICE / "grafica" / "brand" / "concept-svg" / "logo"

# ---------------------------------------------------------------- colori
NAVY = "#071438"      # lettere del wordmark, A bicolore (misurato sul concept: #011646 / #071438)
BLU = "#0560FD"       # blu del marchio (concept: #005AFE / #035CFB)
BLU_TILE = "#2B75F6"  # blu del tile (concept 15: #2774FD)
BLU_CH = "#3B8BFF"    # blu sul fondo notte
GRIGIO = "#8A94A9"
BIANCO = "#FFFFFF"
FONDI = {"chiaro": "#F6F8FC", "notte": NAVY, "azione": BLU}
GROUNDS = ["chiaro", "notte", "azione"]


def f(v: float) -> str:
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


# ---------------------------------------------------------------- poligoni raccordati
def rpath(pts, ox=0.0, oy=0.0, k=1.0) -> str:
    """pts: [(x, y, raggio)] -> path chiuso con gli angoli raccordati ad arco. Trasforma: x*k+ox, y*k+oy."""
    pts = [(x * k + ox, y * k + oy, r * k) for x, y, r in pts]
    n = len(pts)
    d = ""
    for i in range(n):
        p0, v, p1 = pts[i - 1], pts[i], pts[(i + 1) % n]
        r = v[2]
        a = (p0[0] - v[0], p0[1] - v[1])
        b = (p1[0] - v[0], p1[1] - v[1])
        la, lb = math.hypot(*a), math.hypot(*b)
        ua, ub = (a[0] / la, a[1] / la), (b[0] / lb, b[1] / lb)
        th = math.acos(max(-1.0, min(1.0, ua[0] * ub[0] + ua[1] * ub[1])))
        if r <= 0 or th < 1e-3 or abs(math.pi - th) < 1e-3:
            d += ("M" if i == 0 else "L") + f"{f(v[0])} {f(v[1])}"
            continue
        dd = min(r / math.tan(th / 2), la * 0.5, lb * 0.5)
        re_ = dd * math.tan(th / 2)
        s = (v[0] + ua[0] * dd, v[1] + ua[1] * dd)
        e = (v[0] + ub[0] * dd, v[1] + ub[1] * dd)
        cross = (v[0] - p0[0]) * (p1[1] - v[1]) - (v[1] - p0[1]) * (p1[0] - v[0])
        d += ("M" if i == 0 else "L") + f"{f(s[0])} {f(s[1])}A{f(re_)} {f(re_)} 0 0 {1 if cross > 0 else 0} {f(e[0])} {f(e[1])}"
    return d + "Z"


# ---------------------------------------------------------------- la A con la stella (lettermark)
# Misurata sul concept 15 (sovrapposta a vista): altezza 100, centro x = 0, simmetrica.
# Le gambe sono parallele (pendenza 0,414 = 22,5 gradi); la stella a cinque punte è il vuoto tra le
# gambe: il corpo della stella scende nell'apertura della A e la base piatta è la linea di base.
A_STELLA = [
    (-14.0, 0.0, 3.0), (14.0, 0.0, 3.0),            # cima piatta
    (55.4, 100.0, 3.2), (29.9, 100.0, 1.0),          # piede destro (fuori, dentro)
    (16.3, 67.1, 1.2),                               # sotto il braccio destro della stella
    (29.0, 56.9, 1.6), (9.2, 48.0, 0.9),             # punta del braccio destro, incavo
    (0.0, 26.0, 1.6),                                # punta alta della stella
    (-9.2, 48.0, 0.9), (-29.0, 56.9, 1.6),
    (-16.3, 67.1, 1.2),
    (-29.9, 100.0, 1.0), (-55.4, 100.0, 3.2),
]
A_LARG, A_ALT = 110.8, 100.0
A_Y_SPLIT = 56.9      # il bicolore cambia colore alla quota delle punte (concept 15)


def a_path(cx: float, top: float, k: float) -> str:
    return rpath(A_STELLA, cx, top, k)


def a_piede_destro(cx: float, top: float, k: float) -> str:
    """Solo la parte destra sotto la quota delle punte: A ∩ {x > cx, y > split} (il blu del bicolore)."""
    pts = A_STELLA
    # parte destra: bordo esterno destro dal punto alla quota split fino al piede, poi il bordo interno su fino alla punta
    s = A_Y_SPLIT
    ext_x = 14.0 + (55.4 - 14.0) * s / 100.0          # x del bordo esterno alla quota split
    poly = [(ext_x, s, 0), (55.4, 100.0, 3.2), (29.9, 100.0, 1.0), (16.3, 67.1, 1.2), (29.0, 56.9, 0)]
    return rpath(poly, cx, top, k)


# ---------------------------------------------------------------- la stella con la base piatta ("porta")
# Misurata sull'icona 3D (concept 24 e logo): altezza 100, centro 0, simmetrizzata.
PORTA = [
    (0.0, 0.0, 4.6),
    (20.4, 35.4, 1.8), (54.9, 42.4, 3.6), (33.2, 68.8, 2.4),
    (33.2, 100.0, 0.0), (-33.2, 100.0, 0.0),
    (-33.2, 68.8, 2.4), (-54.9, 42.4, 3.6), (-20.4, 35.4, 1.8),
]
PORTA_LARG = 109.8


def compensa(pts):
    """I punti misurati sul concept stanno già sul contorno arrotondato: sposto ogni vertice indietro della
    «recessione» dell'arco (r/sin(θ/2) - r) lungo la bisettrice, così dopo il raccordo la punta torna dov'era."""
    out = []
    n = len(pts)
    for i in range(n):
        p0, v, p1 = pts[i - 1], pts[i], pts[(i + 1) % n]
        r = v[2]
        if r <= 0:
            out.append(v)
            continue
        a = (p0[0] - v[0], p0[1] - v[1])
        b = (p1[0] - v[0], p1[1] - v[1])
        la, lb = math.hypot(*a), math.hypot(*b)
        ua, ub = (a[0] / la, a[1] / la), (b[0] / lb, b[1] / lb)
        th = math.acos(max(-1.0, min(1.0, ua[0] * ub[0] + ua[1] * ub[1])))
        e = r / math.sin(th / 2) - r
        bx, by = ua[0] + ub[0], ua[1] + ub[1]
        bl = math.hypot(bx, by)
        out.append((v[0] - e * bx / bl, v[1] - e * by / bl, r))
    return out


def porta_path(cx: float, top: float, k: float) -> str:
    return rpath(compensa(PORTA), cx, top, k)


def stella5_regolare(cx: float, cy: float, R: float) -> str:
    """Stella a cinque punte regolare con punte arrotondate (come nelle icone «Consigliato»)."""
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rr = R if i % 2 == 0 else R * 0.47
        pts.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang), R * (0.10 if i % 2 == 0 else 0.05)))
    return rpath(pts)


def sparkle(cx: float, cy: float, R: float) -> str:
    """Stella a quattro punte (scintilla) del concept: lati concavi, punte arrotondate. R = metà dell'altezza."""
    k1, k2 = 0.09, 0.46
    t = 0.075
    e = 0.17          # arrotondamento della punta
    dirs = [(0, -1), (1, 0), (0, 1), (-1, 0)]
    d = ""
    for i, (dx, dy) in enumerate(dirs):
        nx, ny = dirs[(i + 1) % 4]
        # punta i -> punta i+1: due controlli
        px, py = -dy, dx       # perpendicolare (verso la punta successiva)
        P0 = (cx + dx * R, cy + dy * R)
        P3 = (cx + nx * R, cy + ny * R)
        c1 = (cx + dx * k2 * R + nx * k1 * R, cy + dy * k2 * R + ny * k1 * R)
        c2 = (cx + nx * k2 * R + dx * k1 * R, cy + ny * k2 * R + dy * k1 * R)
        # arrotondo la punta: parto e arrivo un po' prima
        def lerp(a, b, u):
            return (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)
        a0 = lerp(P0, c1, e)
        a1 = lerp(P3, c2, e)
        if i == 0:
            first_tip = P0
            # inizio dopo la punta alta
            d += f"M{f(a0[0])} {f(a0[1])}"
        # curva da a0 ad a1 (stesso cubico, tagliato)
        d += f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(a1[0])} {f(a1[1])}"
        # raccordo sulla punta i+1: quadratica con controllo sulla punta
        nxt_c1 = (cx + nx * k2 * R + dirs[(i + 2) % 4][0] * k1 * R, cy + ny * k2 * R + dirs[(i + 2) % 4][1] * k1 * R)
        b0 = (P3[0] + (nxt_c1[0] - P3[0]) * e, P3[1] + (nxt_c1[1] - P3[1]) * e)
        d += f"Q{f(P3[0] + nx * R * 0.12)} {f(P3[1] + ny * R * 0.12)} {f(b0[0])} {f(b0[1])}"
    return d + "Z"



# ---------------------------------------------------------------- la A piena (concept 07 e 35) con la scintilla o con la stella
# Forma misurata sul concept 07 (ingrandito): A piena con la cima piatta e il vuoto sotto tra i piedi. Altezza 100, centro x = 0.
# Al centro un vuoto ritagliato: la scintilla a quattro punte del concept («scintilla») oppure la stella a cinque punte con la
# base piatta dell'icona 3D («piena»), questa ridisegnata perché stia bene nella A: stella più grande, spigoli più morbidi,
# fascia sotto la stella spessa quanto i piedi, vuoto tra i piedi alzato.
A_SCINT = [
    (-18.3, 0.0, 3.0), (18.3, 0.0, 3.0),            # cima piatta
    (50.8, 100.0, 3.2), (27.0, 100.0, 1.4),          # piede destro (fuori, dentro)
    (21.2, 85.2, 2.6), (-21.2, 85.2, 2.6),           # soffitto del vuoto tra i piedi
    (-27.0, 100.0, 1.4), (-50.8, 100.0, 3.2),
]
A_SCINT_LARG = 101.6
A_SCINT_CY, A_SCINT_R = 53.4, 24.4                   # centro e mezza altezza della scintilla
A_PIENA = [
    (-22.0, 0.0, 3.4), (22.0, 0.0, 3.4),
    (53.0, 100.0, 3.4), (30.0, 100.0, 1.6),
    (25.0, 76.0, 2.8), (-25.0, 76.0, 2.8),
    (-30.0, 100.0, 1.6), (-53.0, 100.0, 3.4),
]
A_PIENA_LARG = 106.0
A_PIENA_STELLA_ALT, A_PIENA_STELLA_TOP = 46.0, 18.0   # altezza e quota della punta della stella dalla base piatta
# raggi di raccordo della stella (in unità della stella a altezza 100): punta, braccia, incavi, base
PORTA_RAGGI = (9.0, 7.0, 4.0, 2.5)


def porta_morbida(cx: float, top: float, k: float) -> str:
    t, a, i, b = PORTA_RAGGI
    pts = [(0.0, 0.0, t), (20.4, 35.4, i), (54.9, 42.4, a), (33.2, 68.8, i * 1.3), (33.2, 100.0, b),
           (-33.2, 100.0, b), (-33.2, 68.8, i * 1.3), (-54.9, 42.4, a), (-20.4, 35.4, i)]
    return rpath(compensa(pts), cx, top, k)


def a_scint_path(cx: float, top: float, k: float, tipo: str = "scintilla") -> str:
    """Contorno della A piena + il vuoto come secondo percorso: va usato con fill-rule evenodd."""
    if tipo == "piena":
        return rpath(A_PIENA, cx, top, k) + porta_morbida(cx, top + A_PIENA_STELLA_TOP * k, A_PIENA_STELLA_ALT / 100.0 * k)
    return rpath(A_SCINT, cx, top, k) + sparkle(cx, top + A_SCINT_CY * k, A_SCINT_R * k)


# ---------------------------------------------------------------- lettere (Inter ExtraBold con spigoli raccordati)
_font = {}


def _carattere(peso: int):
    if peso not in _font:
        ft = TTFont(FONT_DIR / f"inter-latin-{peso}-normal.woff2")
        _font[peso] = (ft, ft.getGlyphSet(), ft.getBestCmap(), ft["head"].unitsPerEm)
    return _font[peso]


def _contorni(gs, nome):
    pen = DecomposingRecordingPen(gs)
    gs[nome].draw(pen)
    out, cur = [], None
    for op, args in pen.value:
        if op == "moveTo":
            cur = {"start": args[0], "segs": []}
        elif op == "lineTo":
            cur["segs"].append(("L", None, args[0]))
        elif op == "qCurveTo":
            pts = list(args)
            if pts[-1] is None:       # contorno solo con punti fuori curva (non in Inter)
                raise ValueError("contorno senza punti sulla curva")
            for cp, pt in decomposeQuadraticSegment(pts):
                cur["segs"].append(("Q", cp, pt))
        elif op in ("closePath", "endPath"):
            out.append(cur)
            cur = None
    return out


def glifo_path(ch: str, peso: int, s: float, ox: float, oy: float, r_conv=0.045, r_conc=0.012, rotondo_punto=True) -> str:
    """Tracciato SVG di un carattere Inter (scala s, origine ox,oy sulla linea di base), con gli spigoli
    tra due tratti dritti raccordati (raggi in frazione dell'altezza delle maiuscole)."""
    ft, gs, cm, upm = _carattere(peso)
    cap = 1490
    contorni = _contorni(gs, cm[ord(ch)])
    d = ""

    def T(p):
        return (ox + p[0] * s, oy - p[1] * s)

    for c in contorni:
        # il puntino della i diventa un cerchio (come nel concept)
        if ch == "i" and rotondo_punto:
            pp = [c["start"]] + [sg[2] for sg in c["segs"]]
            xs, ys = [p[0] for p in pp], [p[1] for p in pp]
            if min(ys) > 1000:
                cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
                rr = (max(xs) - min(xs)) / 2 * 1.10 * s
                X, Y = T((cx, cy))
                d += f"M{f(X - rr)} {f(Y)}a{f(rr)} {f(rr)} 0 1 0 {f(2 * rr)} 0a{f(rr)} {f(rr)} 0 1 0 {f(-2 * rr)} 0Z"
                continue
        edges = []
        p = c["start"]
        for t, cp, pt in c["segs"]:
            edges.append((p, cp, pt))
            p = pt
        if edges[-1][2] != edges[0][0]:
            edges.append((edges[-1][2], None, edges[0][0]))
        n = len(edges)
        pts = [e[0] for e in edges]
        area = sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n))
        trim = [0.0] * n        # trim[i]: lunghezza tolta da ogni lato al vertice i (inizio dell'edge i)
        for i in range(n):
            e0, e1 = edges[i - 1], edges[i]
            if e0[1] is not None or e1[1] is not None:
                continue
            a = (e0[2][0] - e0[0][0], e0[2][1] - e0[0][1])
            b = (e1[2][0] - e1[0][0], e1[2][1] - e1[0][1])
            la, lb = math.hypot(*a), math.hypot(*b)
            if la < 1e-6 or lb < 1e-6:
                continue
            cross = a[0] * b[1] - a[1] * b[0]
            if abs(cross) / (la * lb) < 0.05:
                continue
            cosang = (a[0] * b[0] + a[1] * b[1]) / (la * lb)
            th = math.pi - math.acos(max(-1, min(1, cosang)))
            r = (r_conv if cross * area > 0 else r_conc) * cap
            trim[i] = min(r / math.tan(th / 2), la * 0.45, lb * 0.45)

        def inizio(i):
            e = edges[i]
            if not trim[i]:
                return e[0]
            L = math.hypot(e[2][0] - e[0][0], e[2][1] - e[0][1])
            return (e[0][0] + (e[2][0] - e[0][0]) / L * trim[i], e[0][1] + (e[2][1] - e[0][1]) / L * trim[i])

        def fine(i):
            e = edges[i]
            t = trim[(i + 1) % n]
            if not t or e[1] is not None:
                return e[2]
            L = math.hypot(e[2][0] - e[0][0], e[2][1] - e[0][1])
            return (e[2][0] - (e[2][0] - e[0][0]) / L * t, e[2][1] - (e[2][1] - e[0][1]) / L * t)

        q = T(inizio(0))
        d += f"M{f(q[0])} {f(q[1])}"
        for i in range(n):
            e = edges[i]
            q1 = T(fine(i))
            if e[1] is None:
                d += f"L{f(q1[0])} {f(q1[1])}"
            else:
                qc = T(e[1])
                d += f"Q{f(qc[0])} {f(qc[1])} {f(q1[0])} {f(q1[1])}"
            if trim[(i + 1) % n]:
                v = T(edges[(i + 1) % n][0])
                q2 = T(inizio((i + 1) % n))
                d += f"Q{f(v[0])} {f(v[1])} {f(q2[0])} {f(q2[1])}"
        d += "Z"
    return d


def ink_box(ch: str, peso: int):
    from fontTools.pens.boundsPen import BoundsPen
    ft, gs, cm, upm = _carattere(peso)
    bp = BoundsPen(gs)
    gs[cm[ord(ch)]].draw(bp)
    return bp.bounds


def larghezza(ch: str, peso: int, s: float) -> float:
    ft, gs, cm, upm = _carattere(peso)
    return gs[cm[ord(ch)]].width * s


def testo_path(testo: str, peso: int, size: float, x: float, y: float, tracking: float = 0.0) -> tuple[str, float]:
    """Tracciato di una scritta (senza raccordi: per tagline). Restituisce (d, larghezza totale)."""
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen

    ft, gs, cm, upm = _carattere(peso)
    s = size / upm
    pen = SVGPathPen(gs, ntos=lambda v: f(v))
    cx = x
    for ch in testo:
        g = gs[cm[ord(ch)]]
        g.draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        cx += g.width * s + tracking
    return pen.getCommands(), cx - x - tracking


def larghezza_testo(testo: str, peso: int, size: float) -> float:
    ft, gs, cm, upm = _carattere(peso)
    return sum(gs[cm[ord(c)]].width for c in testo) * size / upm


# ---------------------------------------------------------------- pezzi: ogni pezzo = (corpo svg, larghezza, altezza)
class Pezzo:
    def __init__(self, corpo: str, w: float, h: float, defs: str = ""):
        self.corpo, self.w, self.h, self.defs = corpo, w, h, defs


def svg_doc(p: Pezzo, titolo: str, idroot: str, pad: float = 0.0, sfondo: str | None = None) -> str:
    w, h = p.w + 2 * pad, p.h + 2 * pad
    defs = f"<defs>{p.defs}</defs>" if p.defs else ""
    bg = f'<rect width="{f(w)}" height="{f(h)}" fill="{sfondo}"/>' if sfondo else ""
    inner = p.corpo if not pad else f'<g transform="translate({f(pad)} {f(pad)})">{p.corpo}</g>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" width="{f(w)}" height="{f(h)}" '
            f'role="img" aria-label="{titolo}"><title>{titolo}</title>{defs}{bg}<g id="{idroot}">{inner}</g></svg>')


def colori(g: str) -> dict:
    """Ruoli di colore per fondo: chiaro, notte (blu notte), azione (blu del marchio)."""
    if g == "chiaro":
        return dict(ink=NAVY, acc=BLU, acc2=BLU, tile=BLU_TILE, glifo=BIANCO, disco=BLU, stella=BIANCO,
                    sec=GRIGIO, tag="#4A5878", leg_dx=BLU_TILE)
    if g == "notte":
        return dict(ink=BIANCO, acc=BLU_CH, acc2=BLU_CH, tile=BLU_TILE, glifo=BIANCO, disco=BLU_CH, stella=NAVY,
                    sec="#8A94A9", tag="#B4BFD6", leg_dx=BLU_CH)
    return dict(ink=BIANCO, acc=BIANCO, acc2=NAVY, tile=BIANCO, glifo=BLU, disco=BIANCO, stella=BLU,
                sec="#D7E4FF", tag="#E3ECFF", leg_dx=NAVY)


# ---------------------------------------------------------------- lettermark
LM_W, LM_H, LM_PAD = 120.0, 110.0, 5.0
TILE = 120.0


def lm_a_nuda(g: str, modo: str, uid: str) -> Pezzo:
    c = colori(g)
    cx, top = LM_W / 2, LM_PAD
    d = a_path(cx, top, 1.0)
    if modo == "bicolore":
        # navy / blu: le due gambe di colore diverso, taglio alla quota delle punte (concept 15)
        dx = a_piede_destro(cx, top, 1.0)
        corpo = (f'<path id="lettera-a" d="{d}" fill="{c["ink"]}"/>'
                 f'<path id="piede-blu" d="{dx}" fill="{c["leg_dx"]}"/>')
    elif modo == "blu":
        col = BLU if g == "chiaro" else (BLU_CH if g == "notte" else BIANCO)
        corpo = f'<path id="lettera-a" d="{d}" fill="{col}"/>'
    elif modo == "navy":
        corpo = f'<path id="lettera-a" d="{d}" fill="{c["ink"]}"/>'
    elif modo == "contorno":
        col = NAVY if g == "chiaro" else BIANCO
        corpo = f'<path id="lettera-a" d="{d}" fill="none" stroke="{col}" stroke-width="4.2" stroke-linejoin="round"/>'
    else:
        raise ValueError(modo)
    return Pezzo(corpo, LM_W, LM_H)


def lm_tile(g: str, modo: str, uid: str) -> Pezzo:
    c = colori(g)
    rx = 27.0
    k = 0.648
    top = (TILE - A_ALT * k) / 2
    d = a_path(TILE / 2, top, k)
    defs = ""
    if modo == "blu":
        fondo, lettera = (BLU_TILE if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU)
        extra = ""
    elif modo == "notte":
        fondo, lettera = (NAVY if g != "notte" else "#12285F"), BIANCO
        if g == "azione":
            fondo = NAVY
        extra = ""
    elif modo == "sfumato":
        defs = (f'<linearGradient id="{uid}-sf" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#3F8CFF"/>'
                f'<stop offset="1" stop-color="#0546D0"/></linearGradient>')
        fondo = f"url(#{uid}-sf)" if g != "azione" else BIANCO
        lettera = BIANCO if g != "azione" else BLU
        extra = ""
    elif modo == "chiaro":
        fondo = "#DDE8FF"
        if g == "azione":
            fondo = BIANCO
        dx = a_piede_destro(TILE / 2, top, k)
        corpo = (f'<rect id="tile" width="{f(TILE)}" height="{f(TILE)}" rx="{f(rx)}" fill="{fondo}"/>'
                 f'<path id="lettera-a" d="{d}" fill="{NAVY}"/><path id="piede-blu" d="{dx}" fill="{BLU}"/>')
        return Pezzo(corpo, TILE, TILE)
    else:
        raise ValueError(modo)
    corpo = (f'<rect id="tile" width="{f(TILE)}" height="{f(TILE)}" rx="{f(rx)}" fill="{fondo}"/>'
             f'<path id="lettera-a" d="{d}" fill="{lettera}"/>')
    return Pezzo(corpo, TILE, TILE, defs)


def lm_cerchio(g: str, modo: str, uid: str) -> Pezzo:
    k = 0.60
    top = (TILE - A_ALT * k) / 2
    d = a_path(TILE / 2, top, k)
    if modo == "blu":
        fondo, lettera = (BLU if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU)
    else:
        fondo, lettera = (NAVY if g != "notte" else "#12285F"), BIANCO
    corpo = (f'<circle id="cerchio" cx="{f(TILE / 2)}" cy="{f(TILE / 2)}" r="{f(TILE / 2)}" fill="{fondo}"/>'
             f'<path id="lettera-a" d="{d}" fill="{lettera}"/>')
    return Pezzo(corpo, TILE, TILE)


def lm_scint(g: str, modo: str, uid: str, tipo: str = "scintilla") -> Pezzo:
    """Lettermark con la scintilla a quattro punte (concept 07/35): A nuda, a contorno, in quadrato o in cerchio."""
    c = colori(g)
    ev = 'fill-rule="evenodd"'
    if modo in ("blu", "navy", "contorno"):
        d = a_scint_path(LM_W / 2, LM_PAD, 1.0, tipo)
        if modo == "blu":
            col = BLU if g == "chiaro" else (BLU_CH if g == "notte" else BIANCO)
            corpo = f'<path id="lettera-a" d="{d}" {ev} fill="{col}"/>'
        elif modo == "navy":
            corpo = f'<path id="lettera-a" d="{d}" {ev} fill="{c["ink"]}"/>'
        else:
            col = NAVY if g == "chiaro" else BIANCO
            corpo = f'<path id="lettera-a" d="{d}" {ev} fill="none" stroke="{col}" stroke-width="4.2" stroke-linejoin="round"/>'
        return Pezzo(corpo, LM_W, LM_H)
    k = 0.648 if modo.startswith("tile") else 0.60
    top = (TILE - A_ALT * k) / 2
    d = a_scint_path(TILE / 2, top, k, tipo)
    if modo == "tile-blu":
        fondo, lettera, forma = (BLU_TILE if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU), "tile"
    elif modo == "tile-notte":
        fondo, lettera, forma = (NAVY if g != "notte" else "#12285F"), BIANCO, "tile"
    elif modo == "cerchio-blu":
        fondo, lettera, forma = (BLU if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU), "cerchio"
    else:
        raise ValueError(modo)
    if forma == "tile":
        sfondo = f'<rect id="tile" width="{f(TILE)}" height="{f(TILE)}" rx="27" fill="{fondo}"/>'
    else:
        sfondo = f'<circle id="cerchio" cx="{f(TILE / 2)}" cy="{f(TILE / 2)}" r="{f(TILE / 2)}" fill="{fondo}"/>'
    return Pezzo(sfondo + f'<path id="lettera-a" d="{d}" {ev} fill="{lettera}"/>', TILE, TILE)


LETTERMARK = {
    # nome: (builder, descrizione, fonte, tipo)
    "bicolore": (lambda g, u: lm_a_nuda(g, "bicolore", u), "A navy con il piede destro blu: la versione dei concept 15.", "15", "concept"),
    "blu": (lambda g, u: lm_a_nuda(g, "blu", u), "A blu pieno, un solo colore. Nei concept 07/35 aveva la stella a 4 punte: qui è quella a 5.", "35, 07, 15", "concept"),
    "navy": (lambda g, u: lm_a_nuda(g, "navy", u), "A tutta navy (bianca su fondo scuro): monocromatica per timbri, stampa, filigrana.", "28 (monocromatica)", "derivata"),
    "contorno": (lambda g, u: lm_a_nuda(g, "contorno", u), "A solo contorno, leggera; per sfondi fotografici o bollini.", "—", "derivata"),
    "tile-blu": (lambda g, u: lm_tile(g, "blu", u), "A bianca nel quadrato arrotondato blu: la versione tile dei concept 15.", "15", "concept"),
    "tile-notte": (lambda g, u: lm_tile(g, "notte", u), "A bianca nel quadrato blu notte (come l'icona «dark» del concept 35, con la A al posto della stella).", "35, 07", "derivata"),
    "tile-sfumato": (lambda g, u: lm_tile(g, "sfumato", u), "A bianca nel quadrato con sfumatura blu, vicina all'icona 3D.", "07, 35", "derivata"),
    "tile-chiaro": (lambda g, u: lm_tile(g, "chiaro", u), "A bicolore nel quadrato chiaro: per profili e miniature su fondo scuro.", "15 + 35", "derivata"),
    "cerchio-blu": (lambda g, u: lm_cerchio(g, "blu", u), "A bianca nel cerchio blu (come la scintilla nel cerchio dei concept 35, 37).", "35, 37", "derivata"),
    "cerchio-notte": (lambda g, u: lm_cerchio(g, "notte", u), "A bianca nel cerchio blu notte: avatar dei profili social.", "37", "derivata"),
    # la A piena (forma del concept 07/35) con la scintilla a 4 punte ritagliata al centro (pannello «Icon / Lettermark»)
    "scintilla-blu": (lambda g, u: lm_scint(g, "blu", u), "La A piena blu con la scintilla a 4 punte al centro: il lettermark dei concept 07 e 35.", "07, 35", "concept"),
    "scintilla-navy": (lambda g, u: lm_scint(g, "navy", u), "La A con la scintilla tutta navy (bianca su fondo scuro): timbri, stampa, filigrana.", "07, 35", "derivata"),
    "scintilla-contorno": (lambda g, u: lm_scint(g, "contorno", u), "La A con la scintilla solo a contorno.", "—", "derivata"),
    "scintilla-tile-blu": (lambda g, u: lm_scint(g, "tile-blu", u), "La A con la scintilla, bianca nel quadrato blu: avatar e profilo.", "35", "derivata"),
    "scintilla-tile-notte": (lambda g, u: lm_scint(g, "tile-notte", u), "La A con la scintilla, bianca nel quadrato blu notte.", "35", "derivata"),
    "scintilla-cerchio-blu": (lambda g, u: lm_scint(g, "cerchio-blu", u), "La A con la scintilla, bianca nel cerchio blu: avatar social tondi.", "35, 37", "derivata"),
    # la A piena (forma del concept 07/35) con la stella dalla base piatta ritagliata al centro (scelta dell'utente)
    "piena-blu": (lambda g, u: lm_scint(g, "blu", u, "piena"), "La A piena blu (la forma del concept 07/35) con dentro la stella a 5 punte dalla base piatta, ritagliata.", "07, 35", "concept"),
    "piena-navy": (lambda g, u: lm_scint(g, "navy", u, "piena"), "La A piena con la stella dalla base piatta, tutta navy (bianca su fondo scuro): timbri, stampa, filigrana.", "07, 35", "derivata"),
    "piena-contorno": (lambda g, u: lm_scint(g, "contorno", u, "piena"), "La A piena con la stella dalla base piatta, solo a contorno.", "—", "derivata"),
    "piena-tile-blu": (lambda g, u: lm_scint(g, "tile-blu", u, "piena"), "La A piena con la stella dalla base piatta, bianca nel quadrato blu: avatar e profilo.", "35", "derivata"),
    "piena-tile-notte": (lambda g, u: lm_scint(g, "tile-notte", u, "piena"), "La A piena con la stella dalla base piatta, bianca nel quadrato blu notte.", "35", "derivata"),
    "piena-cerchio-blu": (lambda g, u: lm_scint(g, "cerchio-blu", u, "piena"), "La A piena con la stella dalla base piatta, bianca nel cerchio blu: avatar social tondi.", "35, 37", "derivata"),
}
# larghezza visibile di ogni lettermark (la A con la scintilla è più stretta della A con la stella)
def larghezza_visibile(nome: str) -> float:
    if "tile" in nome or "cerchio" in nome:
        return A_LARG
    return A_PIENA_LARG if nome.startswith("piena") else (A_SCINT_LARG if nome.startswith("scintilla") else A_LARG)


# ---------------------------------------------------------------- wordmark
PESO = 700            # Inter Bold: i tratti del concept (stelo = 0,20 dell'altezza delle maiuscole)
S = 0.04376           # scala Inter -> px (altezza maiuscole 65,2)
CAPH = 1490 * S
RAGGIO_DISCO = 34.77  # il disco della O misurato sul concept 07 (diametro = 1,067 x altezza maiuscole)
BASE = CAPH           # linea di base (cima delle maiuscole a y=0)
TRACK = -4.9


def wm_geometria(o_vera: bool):
    """Posizioni delle lettere. Restituisce lista [(id, carattere, ox)] e il centro del disco (o None)."""
    pos = []
    x = 0.0
    peso = PESO
    for nome, ch in (("A", "A"), ("d1", "d"), ("d2", "d"), ("i", "i")):
        pos.append((nome, ch, x))
        x += larghezza(ch, peso, S) + TRACK
    # la O: disco (o O vera). Il disco sta a 3,2 px dalla i e dalla F, come sul concept 07.
    adv_o = larghezza("O", peso, S)
    if o_vera:
        pos.append(("O", "O", x))
        x += adv_o + TRACK
        disco = None
    else:
        x_i = pos[-1][2]
        ink_dx_i = x_i + ink_box('i', PESO)[2] * S
        cx = ink_dx_i + 3.2 + RAGGIO_DISCO
        disco = (cx, BASE / 2 - 0.2)
        x = cx + RAGGIO_DISCO + 3.2 - ink_box('F', PESO)[0] * S
    pos.append(("F", "F", x))
    x += larghezza("F", peso, S) + TRACK - 8.9   # kerning F-A (misurato sul concept)
    pos.append(("A2", "A", x))
    return pos, disco


def wordmark_corpo(g: str, o: str, uid: str, tagline: str | None = None, mono: str | None = None) -> Pezzo:
    """o: 'scintilla' | 'stella5' | 'vera' | 'blu-scintilla' (disco blu, resto navy)."""
    c = colori(g)
    pos, disco = wm_geometria(o == "vera")
    ink = mono or c["ink"]
    acc = mono or c["acc"]
    parti = []
    xmin, xmax = 1e9, -1e9
    for nome, ch, ox in pos:
        col = ink if nome in ("A", "d1", "d2", "i") else acc
        if o == "blu-scintilla" and nome in ("F", "A2"):
            col = ink
        d = glifo_path(ch, PESO, S, ox, BASE)
        parti.append(f'<path id="lettera-{nome.lower()}" d="{d}" fill="{col}"/>')
        ft, gs, cm, upm = _carattere(PESO)
        b_ = ink_box(ch, PESO)
        xmin, xmax = min(xmin, ox + b_[0] * S), max(xmax, ox + b_[2] * S)
    extra = ""
    if disco:
        cx, cy = disco
        r = RAGGIO_DISCO
        dcol = mono or c["disco"]
        scol = c["stella"] if not mono else (BIANCO if g == "chiaro" else NAVY)
        if mono and g == "azione":
            scol = BLU
        if o in ("scintilla", "blu-scintilla"):
            star = sparkle(cx, cy, r * 0.60)
        else:  # stella5: la stella con la base piatta dentro il disco
            hstar = r * 1.18
            star = porta_path(cx, cy - hstar / 2 + hstar * 0.02, hstar / 100.0)
        if o == "blu-scintilla":
            dcol = mono or (BLU if g == "chiaro" else c["disco"])
        extra = (f'<circle id="o-disco" cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{dcol}"/>'
                 f'<path id="o-stella" d="{star}" fill="{scol}"/>')
        xmin_disco, xmax_disco = cx - r, cx + r
        xmin, xmax = min(xmin, xmin_disco), max(xmax, xmax_disco)
    top = (BASE / 2 - RAGGIO_DISCO) if disco else 0.0     # il disco sporge sopra le maiuscole
    top = min(top, -1.0 if (not disco and False) else top)
    # la i ha il puntino sopra le maiuscole
    top = min(top, -0.04 * 0 + (BASE - ink_box('i', PESO)[3] * S))
    if disco:
        top = min(top, BASE / 2 - RAGGIO_DISCO)
    bottom = max(BASE, (BASE / 2 + RAGGIO_DISCO) if disco else BASE) + (20 * S)  # d, O scendono un poco
    w = xmax - xmin
    body = "".join(parti) + extra
    h = bottom - top
    tx, ty = -xmin, -top
    pezzo_corpo = f'<g id="wordmark" transform="translate({f(tx)} {f(ty)})">{body}</g>'
    pezzo = Pezzo(pezzo_corpo, w, h)
    pezzo.base = ty + BASE        # y della linea di base nel pezzo
    pezzo.cap_top = ty
    if tagline:
        gap = 13.0
        if tagline == "maiuscole":
            testo = "IL TUO INGLESE, SENZA OSTACOLI."
            size = 11.2
            nat = larghezza_testo(testo, 600, size)
            tr = (w - nat) / (len(testo) - 1)
            d, _ = testo_path(testo, 600, size, 0, pezzo.base + gap + size * 0.7275, tr)
            col = mono or c["tag"]
            tg = f'<path id="tagline" d="{d}" fill="{col}"/>'
            h2 = pezzo.base + gap + size * 0.7275 + 2
        else:
            testo = "Studia oggi, sblocca il tuo domani."
            size0 = 10.0
            size = size0 * (w * 0.95) / larghezza_testo(testo, 500, size0)
            d, tw = testo_path(testo, 500, size, 0, pezzo.base + gap + size * 0.74, 0.0)
            col = mono or c["tag"]
            tg = f'<path id="tagline" d="{d}" fill="{col}"/>'
            h2 = pezzo.base + gap + size * 0.74 + size * 0.25
        pezzo = Pezzo(pezzo_corpo + tg, w, h2)
        pezzo.base = ty + BASE
        pezzo.cap_top = ty
    return pezzo


WORDMARK = {
    "primario": (lambda g, u: wordmark_corpo(g, "scintilla", u), "AddiOFA con la scintilla a 4 punte nella O: il wordmark dei concept 07, 28, 35.", "07, 28, 35, 40", "concept"),
    "o-stella5": (lambda g, u: wordmark_corpo(g, "stella5", u), "Come il primario ma nella O c'è la stella a 5 punte con la base piatta, coerente con la A.", "—", "derivata"),
    "o-semplice": (lambda g, u: wordmark_corpo(g, "vera", u), "AddiOFA con la O vera (anello), senza stella; OFA in blu.", "15", "concept"),
    "solo-o-blu": (lambda g, u: wordmark_corpo(g, "blu-scintilla", u), "Tutto navy, solo il disco della O è blu (con la scintilla).", "07 (variante)", "derivata"),
    "con-tagline": (lambda g, u: wordmark_corpo(g, "scintilla", u, "maiuscole"), "Con «IL TUO INGLESE, SENZA OSTACOLI.» spaziato sotto.", "07, 28, 35, 40", "concept"),
    "con-tagline-studia": (lambda g, u: wordmark_corpo(g, "vera", u, "studia"), "O vera e il motto «Studia oggi, sblocca il tuo domani.».", "15", "concept"),
    "stella5-con-tagline": (lambda g, u: wordmark_corpo(g, "stella5", u, "maiuscole"), "O con la stella a 5 punte e il motto in maiuscole.", "—", "derivata"),
    "mono-navy": (lambda g, u: wordmark_corpo(g, "scintilla", u, None, mono=(NAVY if g == "chiaro" else BIANCO)), "Monocromatica, un solo colore (navy, bianco su scuro).", "28", "concept"),
    "mono-grigio": (lambda g, u: wordmark_corpo(g, "scintilla", u, None, mono=(GRIGIO if g != "azione" else "#CFE0FF")), "Monocromatica grigia: versione discreta, per filigrana.", "28", "concept"),
}


# ---------------------------------------------------------------- stelle e simboli
def simbolo(nome: str, g: str, uid: str) -> Pezzo:
    c = colori(g)
    W = TILE
    if nome == "porta-blu":
        col = BLU if g == "chiaro" else (BLU_CH if g == "notte" else BIANCO)
        h = 78.0
        d = porta_path(W / 2, (W - h) / 2, h / 100.0)
        return Pezzo(f'<path id="stella" d="{d}" fill="{col}"/>', W, W)
    if nome == "porta-navy":
        col = NAVY if g == "chiaro" else BIANCO
        h = 78.0
        d = porta_path(W / 2, (W - h) / 2, h / 100.0)
        return Pezzo(f'<path id="stella" d="{d}" fill="{col}"/>', W, W)
    if nome == "porta-contorno":
        col = NAVY if g == "chiaro" else BIANCO
        h = 76.0
        d = porta_path(W / 2, (W - h) / 2, h / 100.0)
        return Pezzo(f'<path id="stella" d="{d}" fill="none" stroke="{col}" stroke-width="4" stroke-linejoin="round"/>', W, W)
    if nome in ("porta-tile-notte", "porta-tile-blu", "porta-tile-chiaro"):
        h = 62.0
        d = porta_path(W / 2, (W - h) / 2 - 1.5, h / 100.0)
        if nome == "porta-tile-notte":
            fondo, st = (NAVY if g != "notte" else "#12285F"), BIANCO
        elif nome == "porta-tile-blu":
            fondo, st = (BLU if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU)
        else:
            fondo, st = "#E8F0FF", BLU
        return Pezzo(f'<rect id="tile" width="{f(W)}" height="{f(W)}" rx="27" fill="{fondo}"/><path id="stella" d="{d}" fill="{st}"/>', W, W)
    if nome in ("porta-cerchio-blu", "porta-cerchio-chiaro"):
        h = 56.0
        d = porta_path(W / 2, (W - h) / 2 - 1.5, h / 100.0)
        if nome == "porta-cerchio-blu":
            fondo, st = (BLU if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU)
        else:
            fondo, st = "#E8F0FF", BLU
        return Pezzo(f'<circle id="cerchio" cx="{f(W / 2)}" cy="{f(W / 2)}" r="{f(W / 2)}" fill="{fondo}"/><path id="stella" d="{d}" fill="{st}"/>', W, W)
    if nome == "regolare-blu":
        col = BLU if g == "chiaro" else (BLU_CH if g == "notte" else BIANCO)
        return Pezzo(f'<path id="stella" d="{stella5_regolare(W / 2, W / 2 + 4, 50)}" fill="{col}"/>', W, W)
    if nome == "regolare-contorno":
        col = BLU if g == "chiaro" else BIANCO
        return Pezzo(f'<path id="stella" d="{stella5_regolare(W / 2, W / 2 + 4, 47)}" fill="none" stroke="{col}" stroke-width="4.5" stroke-linejoin="round"/>', W, W)
    if nome == "scintilla-blu":
        col = BLU if g == "chiaro" else (BLU_CH if g == "notte" else BIANCO)
        return Pezzo(f'<path id="stella" d="{sparkle(W / 2, W / 2, 50)}" fill="{col}"/>', W, W)
    if nome == "scintilla-contorno":
        col = NAVY if g == "chiaro" else BIANCO
        return Pezzo(f'<path id="stella" d="{sparkle(W / 2, W / 2, 48)}" fill="none" stroke="{col}" stroke-width="3.2" stroke-linejoin="round"/>', W, W)
    if nome == "scintilla-cerchio":
        fondo, st = (BLU if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU)
        return Pezzo(f'<circle id="cerchio" cx="{f(W / 2)}" cy="{f(W / 2)}" r="{f(W / 2)}" fill="{fondo}"/><path id="stella" d="{sparkle(W / 2, W / 2, 33)}" fill="{st}"/>', W, W)
    if nome == "scintilla-tondo-chiaro":
        return Pezzo(f'<circle id="cerchio" cx="{f(W / 2)}" cy="{f(W / 2)}" r="{f(W / 2)}" fill="#E8F0FF"/><path id="stella" d="{sparkle(W / 2, W / 2, 30)}" fill="{BLU}"/>', W, W)
    if nome == "scintilla-tile":
        fondo, st = (BLU if g != "azione" else BIANCO), (BIANCO if g != "azione" else BLU)
        return Pezzo(f'<rect id="tile" width="{f(W)}" height="{f(W)}" rx="27" fill="{fondo}"/><path id="stella" d="{sparkle(W / 2, W / 2, 36)}" fill="{st}"/>', W, W)
    raise ValueError(nome)


SIMBOLI = {
    "porta-blu": ("La stella a 5 punte con la base piatta («la porta» dell'icona 3D), blu pieno.", "24, 07, 35", "concept"),
    "porta-navy": ("La stessa stella in navy (bianca su scuro).", "35 (app icon dark)", "derivata"),
    "porta-contorno": ("La stella con la base piatta solo a contorno.", "—", "derivata"),
    "porta-tile-notte": ("Stella piatta bianca nel quadrato blu notte: l'icona «dark» del concept 35.", "35, 07, 28", "concept"),
    "porta-tile-blu": ("Stella piatta bianca nel quadrato blu: la mini-icona piatta del concept 35.", "35", "concept"),
    "porta-tile-chiaro": ("Stella piatta blu nel quadrato chiaro.", "—", "derivata"),
    "porta-cerchio-blu": ("Stella piatta bianca nel cerchio blu (avatar).", "—", "derivata"),
    "porta-cerchio-chiaro": ("Stella piatta blu nel cerchio chiaro (copertine delle storie in evidenza).", "26, 44", "derivata"),
    "regolare-blu": ("Stella a 5 punte regolare, arrotondata, blu: per «Consigliato», valutazioni.", "16, 17, 23 (elementi extra)", "concept"),
    "regolare-contorno": ("Stella a 5 punte regolare, a contorno.", "35 (valori del brand)", "concept"),
    "scintilla-blu": ("La scintilla a 4 punte dei concept (dentro la O, avatar social).", "07, 28, 35, 37, 44", "concept"),
    "scintilla-contorno": ("La scintilla a contorno (stile icona).", "28 (stile icona)", "concept"),
    "scintilla-cerchio": ("La scintilla bianca nel cerchio blu.", "35, 44", "concept"),
    "scintilla-tondo-chiaro": ("La scintilla blu nel tondo chiaro (avatar del profilo Instagram).", "37", "concept"),
    "scintilla-tile": ("La scintilla bianca nel quadrato blu: l'icona «compatta» del concept 28.", "28", "concept"),
}


# ---------------------------------------------------------------- lockup
def piazza(p: Pezzo, x: float, y: float, k: float = 1.0) -> str:
    return f'<g transform="translate({f(x)} {f(y)}) scale({f(k)})">{p.corpo}</g>'


def lockup(nome: str, g: str, uid: str) -> Pezzo:
    ori, lm_nome, wm_nome = LOCKUP[nome][:3]
    lm = LETTERMARK[lm_nome][0](g, uid + "l") if lm_nome in LETTERMARK else None
    wm = WORDMARK[wm_nome][0](g, uid + "w")
    is_tile = "tile" in lm_nome or "cerchio" in lm_nome
    # parte visibile del lettermark: la A nuda ha 5 px di margine sopra e sotto
    vis_h = TILE if is_tile else A_ALT
    off_y = 0.0 if is_tile else LM_PAD
    vis_w = TILE if is_tile else larghezza_visibile(lm_nome)
    off_x = 0.0 if is_tile else (LM_W - vis_w) / 2
    if ori == "o":     # orizzontale: lettermark a sinistra
        h_ref = wm.h
        target = max(1.5 * CAPH, h_ref * 0.98) if is_tile else 1.15 * CAPH
        kh = target / vis_h
        lh, lw = vis_h * kh, vis_w * kh
        gap = lh * (0.24 if is_tile else 0.30)
        H = max(lh, h_ref)
        corpo = piazza(lm, -off_x * kh, (H - lh) / 2 - off_y * kh, kh) + piazza(wm, lw + gap, (H - h_ref) / 2)
        return Pezzo(corpo, lw + gap + wm.w, H, lm.defs + wm.defs)
    # verticale: lettermark sopra, wordmark centrato
    tw = wm.w
    target = tw * (0.40 if is_tile else 0.36)
    kh = target / vis_h
    lw = vis_w * kh
    gap = target * 0.26
    W = max(tw, lw)
    corpo = piazza(lm, (W - lw) / 2 - off_x * kh, -off_y * kh, kh) + piazza(wm, (W - tw) / 2, target + gap)
    return Pezzo(corpo, W, target + gap + wm.h, lm.defs + wm.defs)


# nome: (orientamento, lettermark, wordmark, descrizione, fonte, tipo)
LOCKUP = {
    "orizzontale-tile": ("o", "tile-blu", "primario", "Quadrato blu con la A + wordmark: la disposizione del concept 07/35 «logo orizzontale con icona».", "07, 28, 35", "derivata"),
    "orizzontale-tile-tagline": ("o", "tile-blu", "con-tagline", "Come sopra con il motto sotto il wordmark.", "07, 35", "derivata"),
    "orizzontale-bicolore": ("o", "bicolore", "primario", "La A bicolore libera + wordmark.", "15", "derivata"),
    "orizzontale-bicolore-stella5": ("o", "bicolore", "o-stella5", "A bicolore + wordmark con la stella a 5 punte nella O: tutto con la stessa stella.", "—", "derivata"),
    "orizzontale-tile-notte": ("o", "tile-notte", "primario", "Quadrato blu notte con la A + wordmark.", "35", "derivata"),
    "orizzontale-cerchio": ("o", "cerchio-blu", "primario", "Cerchio blu con la A + wordmark (per intestazioni compatte).", "35", "derivata"),
    "verticale-tile": ("v", "tile-blu", "con-tagline", "Quadrato con la A sopra, wordmark e motto centrati.", "07, 28", "derivata"),
    "orizzontale-scintilla": ("o", "scintilla-blu", "primario", "La A con la scintilla + wordmark: il lockup coerente con la scintilla nella O (concept 07/35).", "07, 35", "concept"),
    "orizzontale-scintilla-tagline": ("o", "scintilla-blu", "con-tagline", "La A con la scintilla + wordmark con il motto.", "07, 35", "derivata"),
    "verticale-scintilla": ("v", "scintilla-blu", "primario", "La A con la scintilla sopra il wordmark.", "07, 35", "derivata"),
    "orizzontale-piena": ("o", "piena-blu", "primario", "La A piena con la stella dalla base piatta + wordmark primario.", "07, 35", "concept"),
    "orizzontale-piena-tagline": ("o", "piena-blu", "con-tagline", "La A piena con la stella dalla base piatta + wordmark con il motto.", "07, 35", "derivata"),
    "verticale-piena": ("v", "piena-blu", "primario", "La A piena con la stella dalla base piatta sopra il wordmark.", "07, 35", "derivata"),
    "verticale-bicolore": ("v", "bicolore", "primario", "A bicolore sopra il wordmark.", "15", "derivata"),
    "verticale-bicolore-tagline": ("v", "bicolore", "con-tagline", "A bicolore sopra il wordmark con il motto.", "15, 07", "derivata"),
}


# ---------------------------------------------------------------- scrittura
def scrivi(path: pathlib.Path, svg: str):
    minidom.parseString(svg)      # se non è XML valido si ferma qui
    assert "<text" not in svg, "niente <text>"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg, encoding="utf-8")


def main():
    manifest = []

    def emetti(cat, nome, builder, titolo, desc, fonte, tipo, pad):
        for g in GROUNDS:
            uid = f"{cat[:2]}-{nome}-{g[:2]}"
            p = builder(g, uid)
            if g == "chiaro":
                dest = QUI / f"{cat}-{nome}.svg"
            else:
                dest = QUI / ("su-scuro" if g == "notte" else "su-blu") / f"{cat}-{nome}.svg"
            scrivi(dest, svg_doc(p, titolo, f"{cat}-{nome}", pad))
        manifest.append(dict(categoria=cat, nome=nome, file=f"{cat}-{nome}.svg", titolo=titolo, descrizione=desc, fonte=fonte, tipo=tipo,
                             pad=pad, w=round(p.w + 2 * pad, 2), h=round(p.h + 2 * pad, 2)))

    for nome, (b, desc, fonte, tipo) in LETTERMARK.items():
        emetti("lettermark", nome, b, f"AddiOFA lettermark {nome}", desc, fonte, tipo, 0.0)
    for nome, (b, desc, fonte, tipo) in WORDMARK.items():
        emetti("wordmark", nome, b, f"AddiOFA wordmark {nome}", desc, fonte, tipo, 6.0)
    for nome, (ori, lm, wm, desc, fonte, tipo) in LOCKUP.items():
        emetti("lockup", nome, (lambda g, u, nome=nome: lockup(nome, g, u)), f"AddiOFA lockup {nome}", desc, fonte, tipo, 6.0)
    for nome, (desc, fonte, tipo) in SIMBOLI.items():
        emetti("stella", nome, (lambda g, u, nome=nome: simbolo(nome, g, u)), f"AddiOFA stella {nome}", desc, fonte, tipo, 0.0)
    # i due lockup con l'icona 3D (copie dei concept-svg, buoni): restano come opzione, con l'icona 3D invariata
    for nome, desc in (("orizzontale-3d", "Icona 3D + wordmark + motto: la disposizione dei concept 07/35 con l'icona com'è."),
                       ("verticale-3d", "Icona 3D sopra il wordmark e il motto (concept 07).")):
        src = (CONCEPT_SVG / f"lockup-{nome.replace('-3d', '')}.svg").read_text(encoding="utf-8")
        minidom.parseString(src)
        assert "<text" not in src
        (QUI / f"lockup-{nome}.svg").write_text(src, encoding="utf-8")
        vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', src).group(1).split()]
        manifest.append(dict(categoria="lockup", nome=nome, file=f"lockup-{nome}.svg", titolo=f"AddiOFA lockup {nome}", descrizione=desc,
                             fonte="07, 35, 28", tipo="copia", pad=0, w=vb[2], h=vb[3], solo_chiaro=True))
    (QUI / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(manifest), "varianti,", len(manifest) * 3, "file svg")


if __name__ == "__main__":
    main()
