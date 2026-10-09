"""
Attrezzi in più per la sequenza "Calcoliamo il tuo risultato" (immagini 9, 10, 29, 42, 43), sopra ui.py.

- ICONE nuove (griglia 24, tratto come quelle dell'app) aggiunte a `ui.ICONE` a runtime (ui.py non si tocca).
- `testo_box`: scrive una riga di testo dentro il riquadro misurato sull'originale (x0..x1, y0..y1): la
  dimensione viene dall'altezza, lo scarto di larghezza (il font AI non è Inter) si assorbe nella spaziatura.
- `misuratore_arco`: misuratore a mezza ellisse (gli originali hanno un arco un po' più alto che largo), arco
  pieno con sfumatura lungo l'arco (multi-colore), alone sfocato, anello bianco, pomello con riflesso, tacche
  fuori/dentro, scia sfocata. Tutto in punti telefono; il chiamante converte i pixel con t.p().
- Piccoli pezzi ripetuti: tessera con icona, spinner, spunta in cerchio, scie/particelle.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from ui import *          # noqa: F401,F403,E402
from ui import ICONE, Tela, n, larghezza_testo, KIT  # noqa: E402

# ---------------------------------------------------------------------------- icone nuove
ICONE.update({
    "trend": [("p", "M3.5 17.5 9 12l3.5 3.5L20 7.5M15 7.5h5V12.5")],
    "elenco": [("cf", (5, 7, 1.5)), ("cf", (5, 12, 1.5)), ("cf", (5, 17, 1.5)), ("p", "M10 7h10M10 12h10M10 17h10")],
    "spunta-cerchio": [("c", (12, 12, 9)), ("p", "M7.8 12.4 10.8 15.4 16.4 9.2")],
    "barre-piene": [("pf", "M4 20v-6.2a1 1 0 0 1 1-1h2.8a1 1 0 0 1 1 1V20zM9.9 20V9.2a1 1 0 0 1 1-1h2.8a1 1 0 0 1 1 1V20zM15.8 20V4.8a1 1 0 0 1 1-1H19.6a1 1 0 0 1 1 1V20z")],
    "cronometro": [("c", (12, 13.6, 7.4)), ("p", "M9.6 2.6h4.8M12 2.6v3.6M12 13.6V9.8M18 7.2l1.4-1.4")],
    "chat": [("p", "M5.5 4.5h13a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2h-6.3L7.4 20.2v-3.5H5.5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z"),
             ("cf", (8.4, 10.6, 1.05)), ("cf", (12, 10.6, 1.05)), ("cf", (15.6, 10.6, 1.05))],
    "lampadina": [("pf", "M12 2.6a6.2 6.2 0 0 0-3.7 11.2c.7.6 1 1.3 1 2.2v.4h5.4V16c0-.9.3-1.6 1-2.2A6.2 6.2 0 0 0 12 2.6z"),
                  ("p", "M9.6 19h4.8M10.6 21.6h2.8")],
    "monete": [("p", "M5 6.4C5 5 8.1 3.900 12 3.900s7 1.100 7 2.500-3.100 2.500-7 2.500S5 7.800 5 6.400zM5 6.400v3.800c0 1.400 3.100 2.500 7 2.500s7-1.100 7-2.500V6.400M5 10.200V14c0 1.400 3.100 2.500 7 2.500s7-1.100 7-2.500v-3.800M5 14v3.600c0 1.400 3.100 2.500 7 2.500s7-1.100 7-2.500V14")],
    "vietato": [("c", (12, 12, 8.8)), ("p", "M5.800 5.800l12.400 12.400")],
    "power": [("p", "M12 3.200v8.300M7.100 6.600a7.600 7.600 0 1 0 9.800 0")],
    "documento-lista": [("p", "M6.200 3h8.300l4.500 4.500V20a1.200 1.200 0 0 1-1.200 1.200H6.200A1.200 1.200 0 0 1 5 20V4.200A1.200 1.200 0 0 1 6.200 3zM8.400 11.200h7.200M8.400 14.600h7.200M8.400 18h4.200")],
    "puzzle": [("p", "M10 4.500a2 2 0 1 1 4 0V6h4a1 1 0 0 1 1 1v3.400h-1.500a2 2 0 1 0 0 4H19V18a1 1 0 0 1-1 1h-4.500v-1.500a2 2 0 1 0-4 0V19H5a1 1 0 0 1-1-1v-3.600h1.500a2 2 0 1 0 0-4H4V7a1 1 0 0 1 1-1h5z")],
    "scudo-pieno": [("pf", "M12 2.800 4.800 5.700v5.600c0 4.500 3 7.900 7.200 9.200 4.200-1.300 7.200-4.700 7.200-9.200V5.700z")],
    "testo-aa": [("p", "M3 18.500 7.800 6l4.800 12.500M4.800 14h6M14.500 18.500v-5.600a2.600 2.600 0 0 1 5.200 0v5.600M14.500 15.600h5.200")],
})


# ---------------------------------------------------------------------------- testo dentro un riquadro
_ASC = set("bdfhklt") | set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ij%/&?!()€~")
_DESC = set("gjpqy,;()€~")
_XH = set("acemnorsuvwxz.:-…")


def testo_box(t: Tela, s: str, x0: float, x1: float, y0: float, y1: float, peso: int = 400, colore: str = INK,  # noqa: F405
              ancora: str = "start", id: str | None = None, clamp: float = 0.14, forza_dim: float | None = None,
              opacita: float | None = None) -> float:
    """Scrive `s` nel riquadro d'inchiostro misurato (x0..x1 larghezza, y0..y1 dall'alto al basso, inclusi).
    Tutto in punti telefono. Dimensione = altezza dell'inchiostro / (altezza tipica Inter), con scarto massimo
    `clamp`  rispetto alla dimensione che darebbe la larghezza; il resto va nella spaziatura. Restituisce la dimensione."""
    top = 0.74 if any(c in _ASC for c in s) else 0.55
    desc = 0.21 if any(c in _DESC for c in s) else 0.0
    alto = (y1 - y0) / (top + desc)
    nat1 = larghezza_testo(s, 1.0, peso)
    larg = x1 - x0
    dim_w = larg / nat1
    dim = forza_dim or (min(max(dim_w, alto * (1 - clamp)), alto * (1 + clamp)) if len(s) > 3 else alto)
    sp = 0.0
    if len(s) > 3 and not forza_dim:
        sp = (larg - larghezza_testo(s, dim, peso)) / (len(s) - 1)
        sp = max(-0.05 * dim, min(0.06 * dim, sp))
    base = y1 - desc * dim
    if ancora == "middle":
        t.testo(s, (x0 + x1) / 2, base, dim, peso, colore, "middle", id=id, spaziatura=sp, opacita=opacita)
    elif ancora == "end":
        t.testo(s, x1, base, dim, peso, colore, "end", id=id, spaziatura=sp, opacita=opacita)
    else:
        t.testo(s, x0 - 0.03 * dim, base, dim, peso, colore, "start", id=id, spaziatura=sp, opacita=opacita)
    return dim


# ---------------------------------------------------------------------------- pezzi piccoli
def tessera_icona(t: Tela, nome: str, cx: float, cy: float, lato: float, colore: str, spessore: float = 1.8,
                  fondo: str = "#FFFFFF", id: str | None = None, alone: str | None = None, aa: bool = False):
    """Quadratino bianco arrotondato con ombra morbida e icona al centro (card di fattori / aree)."""
    with t.gruppo(id or f"tessera-{nome}"):
        if alone:
            t.cerchio(cx, cy, lato * 0.75, fill=t.radiale([(0, alone, 0.35), (1, alone, 0)], 0.5, 0.5, 0.5))
        t.rett(cx - lato / 2, cy - lato / 2, lato, lato, lato * 0.26, fill=fondo, filtro=t.ombra(2, lato * 0.35, "#3B5BA8", 0.13))
        if aa:
            t.testo("Aa", cx, cy + lato * 0.14, lato * 0.42, 600, colore, "middle")
        else:
            ic = lato * 0.56
            t.icona(nome, cx - ic / 2, cy - ic / 2, ic, colore, spessore)


def spunta_cerchio(t: Tela, cx: float, cy: float, r: float, kit: str = "blu", id: str | None = None):
    k = KIT[kit]
    with t.gruppo(id or "passo-fatto"):
        t.cerchio(cx, cy, r, fill=t.sfumatura([k["azione_chiara"], k["azione"]], 0.2, 0, 0.8, 1), filtro=t.ombra(1.5, r * 0.5, k["azione"], 0.25))
        t.icona("spunta", cx - r * 0.55, cy - r * 0.55, r * 1.1, "#FFFFFF", 2.7)


def cerchio_vuoto(t: Tela, cx: float, cy: float, r: float, id: str | None = None, colore: str = "#E6EBF4"):
    t.cerchio(cx, cy, r, fill=t.sfumatura([colore, "#EEF2F8"], 0.3, 0, 0.7, 1), id=id or "passo-da-fare", stroke="#E3E8F2", sw=max(0.6, r * 0.08))


def spinner(t: Tela, cx: float, cy: float, r: float, colore: str = BLU_FORTE, id: str | None = None):  # noqa: F405
    """Cerchio che gira: anello chiaro + arco pieno di circa 60 %."""
    sw = r * 0.26
    with t.gruppo(id or "passo-in-corso"):
        t.cerchio(cx, cy, r - sw / 2, fill="#FFFFFF", stroke="#DCE6F8", sw=sw)
        a0, a1 = math.radians(-70), math.radians(150)
        x0, y0, x1, y1 = cx + (r - sw / 2) * math.cos(a0), cy + (r - sw / 2) * math.sin(a0), cx + (r - sw / 2) * math.cos(a1), cy + (r - sw / 2) * math.sin(a1)
        t.path(f"M{n(x0)} {n(y0)}A{n(r - sw / 2)} {n(r - sw / 2)} 0 1 1 {n(x1)} {n(y1)}", stroke=colore, sw=sw)


def tondo_rosso(t: Tela, nome: str, cx: float, cy: float, r: float, id: str | None = None):
    """Pallino rosso con icona bianca (elenco dei costi del risultato)."""
    with t.gruppo(id or f"costo-{nome}"):
        t.cerchio(cx, cy, r, fill=t.sfumatura(["#FF6A70", "#F22B36"], 0.2, 0, 0.8, 1), filtro=t.ombra(1.5, r * 0.6, "#F22B36", 0.28))
        t.icona(nome, cx - r * 0.52, cy - r * 0.52, r * 1.04, "#FFFFFF", 2.1)


# ---------------------------------------------------------------------------- misuratore a mezza ellisse
def _pt(cx, cy, rx, ry, f):
    a = math.pi * (1 - f)
    return cx + rx * math.cos(a), cy - ry * math.sin(a)


def arco_ell(cx, cy, rx, ry, f0, f1) -> str:
    x0, y0 = _pt(cx, cy, rx, ry, f0)
    x1, y1 = _pt(cx, cy, rx, ry, f1)
    return f"M{n(x0)} {n(y0)}A{n(rx)} {n(ry)} 0 0 1 {n(x1)} {n(y1)}"


def _fermate_x(cx, rx, stops):
    """stops: [(f, colore)] con f = frazione dell'arco (0 sinistra .. 1 destra) -> offset 0..1 sulla larghezza."""
    return [((1 - math.cos(math.pi * f)) / 2, c) for f, c in stops]


def misuratore_arco(t: Tela, cx: float, cy: float, rx: float, ry: float, th: float, v: float, stops: list[tuple[float, str]],
                    *, traccia: tuple[str, str] = ("#EEF2F9", "#E6EBF5"), colore_pomello: str | None = None,
                    pomello_r: float | None = None, anello: bool = True, glow: float = 0.42, glow_sfoca: float | None = None,
                    tacche: str | None = None, tacche_col: tuple[str, str] = ("#F04050", "#CBD5E1"), scia: bool = False,
                    luce: float = 0.22, vuoto_col: str | None = None, id: str = "misuratore"):
    """Mezza ellisse con centro (cx, cy) = punto medio dei due estremi (cy = centro dei cappucci).
    v = 0..1 riempimento; stops = colori lungo l'arco intero (f 0..1); il pieno usa quelli fino a v."""
    ink = pomello_r or th * 0.5
    col_fine = colore_pomello or stops[-1][1]
    # colore del pomello = colore dell'arco in v
    def colore_in(f):
        pts = sorted(stops)
        for (fa, ca), (fb, cb) in zip(pts, pts[1:]):
            if fa <= f <= fb:
                u = 0 if fb == fa else (f - fa) / (fb - fa)
                a = [int(ca[i:i + 2], 16) for i in (1, 3, 5)]; b = [int(cb[i:i + 2], 16) for i in (1, 3, 5)]
                return "#%02X%02X%02X" % tuple(round(a[i] + (b[i] - a[i]) * u) for i in range(3))
        return pts[0][1] if f < pts[0][0] else pts[-1][1]
    col_v = colore_pomello or colore_in(v)
    gr = t.sfumatura(_fermate_x(cx, rx, stops), cx - rx, 0, cx + rx, 0, userspace=True)
    with t.gruppo(id):
        # alone morbido sotto tutto l'arco
        if tacche:
            _tacche(t, cx, cy, rx, ry, th, v, tacche, tacche_col, stops, colore_in)
        with t.gruppo(f"{id}-traccia"):
            gt = t.sfumatura([(0, traccia[0]), (1, traccia[1])], 0, cy - ry, 0, cy, userspace=True)
            t.path(arco_ell(cx, cy, rx, ry, 0, 1), stroke=vuoto_col or gt, sw=th, id=f"{id}-traccia-arco")
            t.path(arco_ell(cx, cy, rx, ry, 0, 1), stroke="#FFFFFF", sw=th * 0.22, opacita=0.55, id=f"{id}-traccia-luce")
        if v > 0.001:
            with t.gruppo(f"{id}-valore"):
                if glow:
                    t.path(arco_ell(cx, cy, rx, ry, 0.0, v), stroke=gr, sw=th * 1.5, opacita=glow, filtro=t.sfoca(glow_sfoca or th * 0.42), id=f"{id}-alone")
                if scia:
                    t.path(arco_ell(cx, cy, rx + th * 0.5, ry + th * 0.5, max(0, v - 0.42), v + 0.02), stroke=gr, sw=th * 0.5, opacita=0.55,
                           filtro=t.sfoca(th * 0.35), id=f"{id}-scia")
                if anello:
                    t.path(arco_ell(cx, cy, rx, ry, 0.0, v), stroke="#FFFFFF", sw=th * 1.16, opacita=0.55, id=f"{id}-anello")
                t.path(arco_ell(cx, cy, rx, ry, 0.0, v), stroke=gr, sw=th, id=f"{id}-arco")
                if luce:
                    t.path(arco_ell(cx, cy, rx + th * 0.22, ry + th * 0.22, 0.0, v), stroke="#FFFFFF", sw=th * 0.36, opacita=luce,
                           filtro=t.sfoca(th * 0.12), id=f"{id}-riflesso")
        px, py = _pt(cx, cy, rx, ry, v)
        with t.gruppo(f"{id}-pomello"):
            t.cerchio(px, py, ink * 2.3, fill=t.radiale([(0, col_v, 0.42), (0.55, col_v, 0.16), (1, col_v, 0)], 0.5, 0.5, 0.5), id=f"{id}-alone-pomello")
            t.cerchio(px, py, ink * 1.35, fill="#FFFFFF", filtro=t.ombra(1, ink * 0.9, col_v, 0.35), id=f"{id}-anello-pomello")
            rd = t.radiale([(0, _chiaro(col_v, 0.55), 1), (0.6, col_v, 1), (1, _scuro(col_v, 0.08), 1)], 0.38, 0.32, 0.75)
            t.cerchio(px, py, ink * 0.98, fill=rd, id=f"{id}-pomello-centro")


def _chiaro(c: str, q: float) -> str:
    a = [int(c[i:i + 2], 16) for i in (1, 3, 5)]
    return "#%02X%02X%02X" % tuple(round(x + (255 - x) * q) for x in a)


def _scuro(c: str, q: float) -> str:
    a = [int(c[i:i + 2], 16) for i in (1, 3, 5)]
    return "#%02X%02X%02X" % tuple(round(x * (1 - q)) for x in a)


def _tacche(t, cx, cy, rx, ry, th, v, tipo, tacche_col, stops, colore_in):
    """Tacche piccole fuori dall'arco (e, se tipo == 'doppie', più chiare anche dentro): 11 posizioni."""
    with t.gruppo("tacche"):
        for i in range(1, 10):
            f = i / 10
            a = math.pi * (1 - f)
            for lato, lung, op in ((1, th * 0.30, 0.55), (-1, th * 0.24, 0.28)):
                if lato == -1 and tipo != "doppie":
                    continue
                d0 = th * 0.5 + (th * 0.38 if lato == 1 else th * 0.42)
                rxa, rya = rx + lato * d0, ry + lato * d0
                rxb, ryb = rx + lato * (d0 + lung), ry + lato * (d0 + lung)
                if lato == -1:
                    rxa, rya = rx - d0, ry - d0
                    rxb, ryb = rx - d0 - lung, ry - d0 - lung
                x0, y0 = cx + rxa * math.cos(a), cy - rya * math.sin(a)
                x1, y1 = cx + rxb * math.cos(a), cy - ryb * math.sin(a)
                pieno = f <= v + 0.02
                col = colore_in(max(0, min(1, f))) if pieno else tacche_col[1]
                t.linea(x0, y0, x1, y1, col, max(0.8, th * 0.09), opacita=op * (0.9 if pieno else 0.8))


# ---------------------------------------------------------------------------- decorazioni
def particelle(t: Tela, punti: list[tuple[float, float, float, str, float]], id: str = "particelle"):
    """punti: (x, y, raggio, colore, opacità): pallini piccoli che volano (coriandoli tondi)."""
    with t.gruppo(id):
        for x, y, r, c, o in punti:
            t.cerchio(x, y, r, fill=c, opacita=o)


def trattini(t: Tela, segmenti: list[tuple[float, float, float, float, float, str, float]], id: str = "trattini"):
    """segmenti: (x1, y1, x2, y2, spessore, colore, opacità): coriandoli a trattino con punte arrotondate."""
    with t.gruppo(id):
        for x1, y1, x2, y2, sw, c, o in segmenti:
            t.linea(x1, y1, x2, y2, c, sw, opacita=o)
