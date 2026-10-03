"""
Cassetta degli attrezzi per ridisegnare in SVG le schermate dell'app (e le locandine, le landing…)
delle immagini di design-concept. Stessa idea delle illustrazioni: un piccolo programma per ogni
schermata, forme pulite con nomi, testo come tracciati del font Inter, i toni dall'originale.

    from ui import Tela, KIT_ROSSO, KIT_BLU
    t = Tela(390, 844)                              # coordinate = "punti" di un telefono
    t.rett(20, 100, 350, 56, 14, fill="#FEE2E2", id="card-rischio")
    t.testo("Il tuo rischio OFA", 24, 150, 22, 700, "#0F172A")
    t.pulsante("Inizia a studiare", 20, 700, 350, 52, kit="blu", freccia=True)
    t.salva("brand/concept-svg/schermate/…/home.svg")

Tutte le misure sono in punti telefono: si prendono dall'originale moltiplicando i pixel per
390 / larghezza della schermata (`scala()` lo fa). Ogni elemento ha un `id` (parlante) per poterlo
cambiare dopo con modifica_disegno.py. Il testo non è mai <text>: sono <path> (nessuna dipendenza
dal font installato, e si può animare/colorare come le altre forme).
"""
from __future__ import annotations

import math
import pathlib
import re
import sys
from functools import lru_cache

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

_AQUI = pathlib.Path(__file__).resolve().parent
RADICE = _AQUI.parents[2]                       # OfaEnglish/
FONT = RADICE / "node_modules" / "@fontsource" / "inter" / "files"
BRAND = RADICE / "brand"

# ---------------------------------------------------------------------------- colori del kit
INK = "#0F172A"        # testo principale
GRIGIO = "#6B7280"     # testo secondario
LINEA = "#E5E7EB"
SFONDO = "#F6F8FC"
BLU = "#3B82F6"; BLU_FORTE = "#226EFD"; BLU_PALLIDO = "#EAF1FD"
ROSSO = "#EF4444"; ROSSO_FORTE = "#F22B36"; ROSSO_PALLIDO = "#FEE2E2"
VERDE = "#22C55E"; VERDE_PALLIDO = "#DCFCE7"
GIALLO = "#F59E0B"; GIALLO_PALLIDO = "#FEF3C7"
VIOLA = "#8B5CF6"

KIT_BLU = {"azione": BLU_FORTE, "azione_chiara": "#6EA0FE", "pallido": BLU_PALLIDO, "bordo": "#81ABFC"}
KIT_ROSSO = {"azione": ROSSO_FORTE, "azione_chiara": "#F87171", "pallido": "#FEEEEE", "bordo": "#FDA4AA"}
KIT = {"blu": KIT_BLU, "rosso": KIT_ROSSO}


def scala(pixel_originale: float, larghezza_originale: float, larghezza_telefono: float = 390) -> float:
    """Pixel dell'immagine originale -> punti telefono."""
    return pixel_originale * larghezza_telefono / larghezza_originale


def n(v: float) -> str:
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


# ---------------------------------------------------------------------------- testo come tracciati
@lru_cache(maxsize=None)
def _font(peso: int):
    f = TTFont(FONT / f"inter-latin-{peso}-normal.woff2")
    return f, f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm


def _peso(p: int) -> int:
    return min((400, 500, 600, 700, 800, 900), key=lambda q: abs(q - p))


def larghezza_testo(testo: str, dimensione: float, peso: int = 400, spaziatura: float = 0.0) -> float:
    _, gs, cmap, upm = _font(_peso(peso))
    return sum(gs[cmap.get(ord(c), cmap[ord("?")])].width for c in testo) * dimensione / upm + spaziatura * max(0, len(testo) - 1)


def a_capo(testo: str, dimensione: float, peso: int, larghezza_max: float, spaziatura: float = 0.0) -> list[str]:
    righe, riga = [], ""
    for parola in testo.split(" "):
        prova = (riga + " " + parola).strip()
        if riga and larghezza_testo(prova, dimensione, peso, spaziatura) > larghezza_max:
            righe.append(riga); riga = parola
        else:
            riga = prova
    righe.append(riga)
    return righe


def tracciato(testo: str, x: float, y: float, dimensione: float, peso: int = 400, ancora: str = "start",
              spaziatura: float = 0.0) -> str:
    """Comando `d` di un path: la scritta con la linea di base in (x, y)."""
    _, gs, cmap, upm = _font(_peso(peso))
    s = dimensione / upm
    tot = larghezza_testo(testo, dimensione, peso, spaziatura)
    cx = x - tot / 2 if ancora == "middle" else x - tot if ancora == "end" else x
    pen = SVGPathPen(gs, ntos=lambda v: n(v))
    for c in testo:
        g = cmap.get(ord(c), cmap[ord("?")])
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        cx += gs[g].width * s + spaziatura
    return pen.getCommands()


# ---------------------------------------------------------------------------- icone (griglia 24, tratto)
# Disegnate a mano, tratto arrotondato come quelle dell'app. Ogni voce: elenco di (tipo, dati).
# tipo "p" = path con tratto; "pf" = path pieno; "c" = cerchio (cx, cy, r) con tratto; "cf" = cerchio pieno.
ICONE = {
    "casa": [("pf", "M12 3.2 3.4 10.6V20a1 1 0 0 0 1 1h4.6v-6h6v6h4.6a1 1 0 0 0 1-1v-9.4z")],
    "grafico": [("p", "M5.5 20V13M12 20V5M18.5 20v-9")],
    "libro": [("p", "M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5zM12 6.5v13")],
    "campana": [("p", "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 0 0 4 0")],
    "chevron-destra": [("p", "M9 5.5 15.5 12 9 18.5")],
    "chevron-sinistra": [("p", "M15 5.5 8.5 12 15 18.5")],
    "chevron-giu": [("p", "M5.5 9 12 15.5 18.5 9")],
    "freccia-destra": [("p", "M4.5 12h15M13.5 6l6 6-6 6")],
    "freccia-sinistra": [("p", "M19.5 12h-15M10.5 6l-6 6 6 6")],
    "freccia-su": [("p", "M12 19.5v-15M6 10.5l6-6 6 6")],
    "info": [("c", (12, 12, 9)), ("p", "M12 11v5.5"), ("cf", (12, 7.6, 1.05))],
    "spunta": [("p", "M4.5 12.8 9.6 18 19.5 6.5")],
    "x": [("p", "M6 6l12 12M18 6 6 18")],
    "piu": [("p", "M12 5v14M5 12h14")],
    "lucchetto": [("pf", "M6 10.5h12a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19v-7A1.5 1.5 0 0 1 6 10.5z"),
                  ("p", "M8 10.5V8a4 4 0 0 1 8 0v2.5")],
    "utente": [("cf", (12, 8, 4)), ("pf", "M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z")],
    "ricerca": [("c", (10.5, 10.5, 6.5)), ("p", "M15.5 15.5 20.5 20.5")],
    "calendario": [("p", "M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18.5V8A1.5 1.5 0 0 1 5 6.5zM3.5 11h17M8 3.5v4M16 3.5v4")],
    "orologio": [("c", (12, 12, 9)), ("p", "M12 7v5.2l3.3 2")],
    "euro": [("p", "M17.5 6.5a7 7 0 1 0 0 11M5 10.5h8.5M5 13.5h8.5")],
    "stella": [("pf", "M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z")],
    "stella4": [("pf", "M12 2.5c.6 4.6 2.2 7 8 9.5-5.8 2.5-7.4 4.9-8 9.5-.6-4.6-2.2-7-8-9.5 5.8-2.5 7.4-4.9 8-9.5z")],
    "mail": [("p", "M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17V7A1.5 1.5 0 0 1 5 5.5zM4 7.5l8 6 8-6")],
    "play": [("pf", "M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z")],
    "fiamma": [("pf", "M12.5 2.5c.4 3-1.3 4.6-2.7 6.3C8.4 10.400 7 11.800 7 14.300a5 5 0 0 0 10 0c0-2-1-3.400-2-4.500.1 1.600-.6 2.500-1.500 2.800.6-3.500-.2-6.700-1-10.100z")],
    "trofeo": [("p", "M7.5 4h9v5.5a4.500 4.500 0 0 1-9 0zM7.500 6H4.500v1.500A3 3 0 0 0 7.500 10.500M16.500 6h3v1.500a3 3 0 0 1-3 3M12 14v3.500M8.500 20h7M10 17.500h4")],
    "bersaglio": [("c", (12, 12, 9)), ("c", (12, 12, 5)), ("cf", (12, 12, 1.4))],
    "condividi": [("p", "M12 15V3.500M7.500 8 12 3.500 16.500 8M5 12v7a1.500 1.500 0 0 0 1.500 1.500h11A1.500 1.500 0 0 0 19 19v-7")],
    "impostazioni": [("c", (12, 12, 3)), ("p", "M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M18.700 5.300l-2.100 2.100M7.400 16.600l-2.100 2.100")],
    "gruppo": [("cf", (9, 8.500, 3.500)), ("pf", "M2.500 19.500c0-3.500 2.900-5.500 6.500-5.500s6.500 2 6.500 5.500z"), ("p", "M16 5.300a3.500 3.500 0 0 1 0 6.400M17.500 14.300c2.300.6 4 2.300 4 5.200")],
    "scudo": [("p", "M12 3 4.500 6v5.500c0 4.700 3.100 8.200 7.500 9.500 4.400-1.300 7.500-4.800 7.500-9.500V6zM8.800 12 11 14.200 15.500 9.500")],
    "cappello": [("pf", "M12 4 1.800 9 12 14l10.200-5z"), ("p", "M6 11.500v4.500c0 1.400 2.700 3 6 3s6-1.600 6-3v-4.500M21 9.500v6")],
    "mondo": [("c", (12, 12, 9)), ("p", "M3 12h18M12 3c2.500 2.500 3.800 5.500 3.800 9S14.500 18.500 12 21c-2.500-2.500-3.800-5.500-3.800-9S9.500 5.500 12 3z")],
    "documento": [("p", "M6.500 3h7l4.500 4.500V19.500a1.500 1.500 0 0 1-1.500 1.500h-10A1.500 1.500 0 0 1 5 19.500v-15A1.500 1.500 0 0 1 6.500 3zM13.500 3v4.500H18M8.500 12.500h7M8.500 16h5")],
    "fulmine": [("pf", "M13.500 2.500 5 13.500h6l-1 8 8.500-11h-6z")],
    "aereo": [("pf", "M21 3.500 2.800 10.800l6.500 2.500 2.500 6.500zM9.300 13.300 21 3.500")],
    "ingranaggio": [("c", (12, 12, 3.200)), ("p", "M10.200 3.500h3.600l.5 2.400 1.600.9 2.300-.8 1.800 3.100-1.800 1.600v1.800l1.800 1.600-1.800 3.100-2.300-.8-1.600.9-.5 2.400h-3.600l-.5-2.400-1.600-.9-2.300.8-1.800-3.100 1.800-1.600v-1.800L3.900 9.800l1.800-3.100 2.300.8 1.600-.9z")],
    "eye": [("p", "M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12z"), ("c", (12, 12, 3))],
    "doppia-spunta": [("p", "M2.500 12.800 7 17.500 15.500 7M12 15.500l1.500 2L22 7")],
    "dot-menu": [("cf", (5.500, 12, 1.600)), ("cf", (12, 12, 1.600)), ("cf", (18.500, 12, 1.600))],
    "wifi": [("p", "M2.500 9.500a14 14 0 0 1 19 0M5.500 13a9.500 9.500 0 0 1 13 0M8.700 16.300a5 5 0 0 1 6.600 0")],
}


def _icona(nome: str, x: float, y: float, dim: float, colore: str, spessore: float = 2.0, fill_pieno: str | None = None) -> str:
    k = dim / 24
    out = [f'<g transform="translate({n(x)} {n(y)}) scale({n(k)})" fill="none" stroke="{colore}" stroke-width="{n(spessore)}" '
           f'stroke-linecap="round" stroke-linejoin="round">']
    for tipo, d in ICONE[nome]:
        if tipo == "p":
            out.append(f'<path d="{d}"/>')
        elif tipo == "pf":
            out.append(f'<path d="{d}" fill="{fill_pieno or colore}" stroke="{fill_pieno or colore}" stroke-width="{n(max(0.6, spessore * 0.4))}"/>')
        elif tipo == "c":
            out.append(f'<circle cx="{n(d[0])}" cy="{n(d[1])}" r="{n(d[2])}"/>')
        elif tipo == "cf":
            out.append(f'<circle cx="{n(d[0])}" cy="{n(d[1])}" r="{n(d[2])}" fill="{colore}" stroke="none"/>')
    out.append("</g>")
    return "".join(out)


# ---------------------------------------------------------------------------- la tela
class Tela:
    def __init__(self, w: float = 390, h: float = 844, fondo: str | None = "#FFFFFF", id: str = "schermata"):
        self.w, self.h, self.id = w, h, id
        self.defs: list[str] = []
        self.corpo: list[str] = []
        self._n = 0
        self._chiavi: dict = {}
        if fondo:
            self.rett(0, 0, w, h, 0, fill=fondo, id="sfondo")

    @classmethod
    def da_originale(cls, larghezza_px: float, altezza_px: float, fondo: str | None = "#FFFFFF", id: str = "schermata") -> "Tela":
        """Tela di 390 punti di larghezza con l'altezza in proporzione all'originale; `t.p(px)` converte i pixel
        dell'immagine originale in punti (si traccia in pixel e si scrive p(…))."""
        k = 390 / larghezza_px
        t = cls(390, round(altezza_px * k, 2), fondo, id)
        t.p = lambda v: v * k
        t.k = k
        return t

    # -- infrastruttura
    def uid(self, prefisso: str = "g") -> str:
        self._n += 1
        return f"{self.id}-{prefisso}{self._n}"

    def add(self, s: str):
        self.corpo.append(s)

    def gruppo(self, id: str, opacita: float | None = None, trasforma: str | None = None, clip: str | None = None):
        """Uso:  with t.gruppo('card'): ...   (tutto ciò che si disegna dentro va nel gruppo)"""
        return _Gruppo(self, id, opacita, trasforma, clip)

    def sfumatura(self, colori: list[tuple[float, str]] | list[str], x1=0, y1=0, x2=0, y2=1, userspace=False, opacita=None) -> str:
        """Dichiara un linearGradient e restituisce 'url(#id)'. Di default da (x1,y1) a (x2,y2) in 0..1 della forma."""
        if colori and isinstance(colori[0], str):
            m = len(colori) - 1
            colori = [(i / max(1, m), c) for i, c in enumerate(colori)]
        chiave = ("lin", tuple(colori), x1, y1, x2, y2, userspace)
        if chiave in self._chiavi:
            return self._chiavi[chiave]
        gid = self.uid("sf")
        unit = ' gradientUnits="userSpaceOnUse"' if userspace else ""
        fermate = "".join(f'<stop offset="{n(o)}" stop-color="{c}"/>' for o, c in colori)
        self.defs.append(f'<linearGradient id="{gid}" x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}"{unit}>{fermate}</linearGradient>')
        self._chiavi[chiave] = f"url(#{gid})"
        return self._chiavi[chiave]

    def radiale(self, colori: list[tuple[float, str, float]], cx=0.5, cy=0.5, r=0.5, userspace=False) -> str:
        """colori: (offset, colore, opacita)."""
        chiave = ("rad", tuple(colori), cx, cy, r, userspace)
        if chiave in self._chiavi:
            return self._chiavi[chiave]
        gid = self.uid("rd")
        unit = ' gradientUnits="userSpaceOnUse"' if userspace else ""
        fermate = "".join(f'<stop offset="{n(o)}" stop-color="{c}" stop-opacity="{n(a)}"/>' for o, c, a in colori)
        self.defs.append(f'<radialGradient id="{gid}" cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}"{unit}>{fermate}</radialGradient>')
        self._chiavi[chiave] = f"url(#{gid})"
        return self._chiavi[chiave]

    def ombra(self, dy: float = 3, sfoca: float = 6, colore: str = "#0F172A", opacita: float = 0.10, dx: float = 0) -> str:
        """Dichiara un filtro ombra e restituisce 'url(#id)' da usare come filter=. Area grande (userSpaceOnUse)."""
        chiave = ("ombra", dx, dy, sfoca, colore, opacita)
        if chiave in self._chiavi:
            return self._chiavi[chiave]
        fid = self.uid("om")
        self.defs.append(
            f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="-40" y="-40" width="{n(self.w + 80)}" height="{n(self.h + 80)}" '
            f'color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="{n(sfoca / 2)}"/>'
            f'<feOffset dx="{n(dx)}" dy="{n(dy)}" result="o"/><feFlood flood-color="{colore}" flood-opacity="{n(opacita)}"/>'
            f'<feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
        self._chiavi[chiave] = f"url(#{fid})"
        return self._chiavi[chiave]

    def sfoca(self, quanto: float) -> str:
        chiave = ("sfoca", quanto)
        if chiave in self._chiavi:
            return self._chiavi[chiave]
        fid = self.uid("sf")
        self.defs.append(f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="-40" y="-40" width="{n(self.w + 80)}" height="{n(self.h + 80)}">'
                         f'<feGaussianBlur stdDeviation="{n(quanto)}"/></filter>')
        self._chiavi[chiave] = f"url(#{fid})"
        return self._chiavi[chiave]

    # -- forme
    def rett(self, x, y, w, h, r=0, fill="#FFFFFF", id=None, stroke=None, sw=1, opacita=None, filtro=None, r_angoli=None) -> str:
        a = f' id="{id}"' if id else ""
        a += f' stroke="{stroke}" stroke-width="{n(sw)}"' if stroke else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        a += f' filter="{filtro}"' if filtro else ""
        if r_angoli:      # (tl, tr, br, bl)
            tl, tr, br, bl = r_angoli
            d = (f"M{n(x + tl)} {n(y)}H{n(x + w - tr)}A{n(tr)} {n(tr)} 0 0 1 {n(x + w)} {n(y + tr)}V{n(y + h - br)}"
                 f"A{n(br)} {n(br)} 0 0 1 {n(x + w - br)} {n(y + h)}H{n(x + bl)}A{n(bl)} {n(bl)} 0 0 1 {n(x)} {n(y + h - bl)}"
                 f"V{n(y + tl)}A{n(tl)} {n(tl)} 0 0 1 {n(x + tl)} {n(y)}z")
            s = f'<path d="{d}" fill="{fill}"{a}/>'
        else:
            rr = f' rx="{n(min(r, h / 2, w / 2))}"' if r else ""
            s = f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}"{rr} fill="{fill}"{a}/>'
        self.add(s)
        return s

    def cerchio(self, cx, cy, r, fill="#FFFFFF", id=None, stroke=None, sw=1, opacita=None, filtro=None) -> str:
        a = f' id="{id}"' if id else ""
        a += f' stroke="{stroke}" stroke-width="{n(sw)}"' if stroke else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        a += f' filter="{filtro}"' if filtro else ""
        s = f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" fill="{fill}"{a}/>'
        self.add(s)
        return s

    def ellisse(self, cx, cy, rx, ry, fill="#FFFFFF", id=None, opacita=None, filtro=None) -> str:
        a = f' id="{id}"' if id else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        a += f' filter="{filtro}"' if filtro else ""
        s = f'<ellipse cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="{fill}"{a}/>'
        self.add(s)
        return s

    def linea(self, x1, y1, x2, y2, colore=LINEA, sw=1, id=None, tratteggio=None, cap="round", opacita=None) -> str:
        a = f' id="{id}"' if id else ""
        a += f' stroke-dasharray="{tratteggio}"' if tratteggio else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        s = f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" stroke="{colore}" stroke-width="{n(sw)}" stroke-linecap="{cap}"{a}/>'
        self.add(s)
        return s

    def path(self, d: str, fill="none", stroke=None, sw=1, id=None, cap="round", join="round", opacita=None, filtro=None, extra="") -> str:
        a = f' id="{id}"' if id else ""
        a += f' stroke="{stroke}" stroke-width="{n(sw)}" stroke-linecap="{cap}" stroke-linejoin="{join}"' if stroke else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        a += f' filter="{filtro}"' if filtro else ""
        s = f'<path d="{d}" fill="{fill}"{a}{(" " + extra) if extra else ""}/>'
        self.add(s)
        return s

    # -- testo
    def testo(self, testo: str, x: float, y: float, dimensione: float, peso: int = 400, colore: str = INK,
              ancora: str = "start", id: str | None = None, spaziatura: float = 0.0, opacita: float | None = None) -> float:
        """Una riga. y = linea di base. Restituisce la larghezza."""
        d = tracciato(testo, x, y, dimensione, peso, ancora, spaziatura)
        a = f' id="{id}"' if id else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        self.add(f'<path d="{d}" fill="{colore}"{a}/>')
        return larghezza_testo(testo, dimensione, peso, spaziatura)

    def paragrafo(self, testo: str, x: float, y: float, larghezza: float, dimensione: float, peso: int = 400, colore: str = GRIGIO,
                  interlinea: float = 1.35, ancora: str = "start", id: str | None = None, spaziatura: float = 0.0) -> float:
        """Testo a capo entro `larghezza`; y = linea di base della prima riga. Restituisce l'altezza usata."""
        righe = a_capo(testo, dimensione, peso, larghezza, spaziatura)
        cx = x + larghezza / 2 if ancora == "middle" else x + larghezza if ancora == "end" else x
        for i, r in enumerate(righe):
            self.testo(r, cx, y + i * dimensione * interlinea, dimensione, peso, colore, ancora, id=(f"{id}-{i + 1}" if id else None), spaziatura=spaziatura)
        return len(righe) * dimensione * interlinea

    def icona(self, nome: str, x: float, y: float, dim: float = 24, colore: str = INK, spessore: float = 2.0,
              id: str | None = None, fill_pieno: str | None = None):
        """Icona dalla griglia 24 (ICONE), con l'angolo in alto a sinistra in (x, y)."""
        s = _icona(nome, x, y, dim, colore, spessore, fill_pieno)
        if id:
            s = s.replace("<g ", f'<g id="{id}" ', 1)
        self.add(s)

    # -- componenti dell'app
    def barra_stato(self, scuro: bool = False, y: float = 0, ora: str = "9:41"):
        c = "#FFFFFF" if scuro else INK
        with self.gruppo("barra-di-stato"):
            self.testo(ora, 24, y + 24, 15, 600, c)
            # segnale
            for i, h_ in enumerate((4, 6.5, 9, 11.5)):
                self.rett(self.w - 84 + i * 4.6, y + 24 - h_ , 3.2, h_, 1, fill=c)
            self.icona("wifi", self.w - 62, y + 10, 16, c, 2.1)
            self.rett(self.w - 40, y + 12.5, 22, 11, 3.2, fill="none", stroke=c, sw=1.1, opacita=0.45)
            self.rett(self.w - 38.5, y + 14, 17, 8, 2, fill=c)
            self.rett(self.w - 17, y + 16.2, 1.6, 3.6, 0.8, fill=c, opacita=0.5)

    def pulsante(self, etichetta: str, x: float, y: float, w: float, h: float = 52, kit: str = "blu", variante: str = "primario",
                 freccia: bool = False, id: str | None = None, r: float | None = None, corpo: float = 16, icona_sx: str | None = None):
        k = KIT[kit]
        r = h * 0.28 if r is None else r
        i = id or "pulsante"
        if variante == "primario":
            with self.gruppo(i):
                self.rett(x, y, w, h, r, fill=k["azione"], filtro=self.ombra(3, 8, k["azione"], 0.18))
                col = "#FFFFFF"
        elif variante == "secondario":
            with self.gruppo(i):
                self.rett(x, y, w, h, r, fill=k["pallido"] if kit == "rosso" else "#F4F6F9")
                col = k["azione"] if kit == "rosso" else INK
        else:  # outline
            with self.gruppo(i):
                self.rett(x, y, w, h, r, fill="#FFFFFF", stroke=k["bordo"], sw=1.5)
                col = k["azione"] if kit == "rosso" else BLU_FORTE
        lw = larghezza_testo(etichetta, corpo, 600)
        ax = 22 if freccia else 0
        sx = x + (w - lw - ax) / 2
        if icona_sx:
            sx += 14
        self.testo(etichetta, sx, y + h / 2 + corpo * 0.35, corpo, 600, col, id=f"{i}-testo")
        if freccia:
            self.icona("freccia-destra", sx + lw + 8, y + h / 2 - 8, 16, col, 2.2)
        if icona_sx:
            self.icona(icona_sx, sx - 28, y + h / 2 - 10, 20, col, 2.2)

    def chip(self, etichetta: str, x: float, y: float, fondo: str, colore: str, corpo: float = 12, peso: int = 600,
             h: float = 24, px: float = 10, id: str | None = None, bordo: str | None = None) -> float:
        """Etichetta a pillola; restituisce la larghezza."""
        w = larghezza_testo(etichetta, corpo, peso) + 2 * px
        self.rett(x, y, w, h, h / 2, fill=fondo, stroke=bordo, sw=1, id=id)
        self.testo(etichetta, x + px, y + h / 2 + corpo * 0.35, corpo, peso, colore)
        return w

    def interruttore(self, x: float, y: float, acceso: bool = True, kit: str = "blu", w: float = 46, h: float = 27, id: str | None = None):
        k = KIT[kit]
        with self.gruppo(id or "interruttore"):
            self.rett(x, y, w, h, h / 2, fill=k["azione"] if acceso else "#D7DBE3")
            px = x + w - h / 2 if acceso else x + h / 2
            self.cerchio(px, y + h / 2, h / 2 - 2.5, fill="#FFFFFF", filtro=self.ombra(1, 3, "#0F172A", 0.2))

    def casella(self, x: float, y: float, spuntata: bool = True, kit: str = "blu", lato: float = 24, id: str | None = None):
        k = KIT[kit]
        with self.gruppo(id or "casella"):
            if spuntata:
                self.rett(x, y, lato, lato, lato * 0.24, fill=k["azione"])
                self.icona("spunta", x + lato * 0.2, y + lato * 0.2, lato * 0.6, "#FFFFFF", 2.6)
            else:
                self.rett(x + 0.75, y + 0.75, lato - 1.5, lato - 1.5, lato * 0.24, fill="#FFFFFF", stroke="#D4D7E2", sw=1.5)

    def radio(self, x: float, y: float, selezionato: bool = True, kit: str = "blu", lato: float = 24, id: str | None = None):
        k = KIT[kit]
        c = lato / 2
        with self.gruppo(id or "radio"):
            if selezionato:
                self.cerchio(x + c, y + c, c - 1, fill="#FFFFFF", stroke=k["azione"], sw=2)
                self.cerchio(x + c, y + c, c * 0.5, fill=k["azione"])
            else:
                self.cerchio(x + c, y + c, c - 0.75, fill="#FFFFFF", stroke="#D4D7E2", sw=1.5)

    def barra(self, x: float, y: float, w: float, valore: float, h: float = 8, kit: str = "blu", fondo: str = "#EEF1F6",
              colore: str | None = None, id: str | None = None):
        k = KIT[kit]
        with self.gruppo(id or "barra"):
            self.rett(x, y, w, h, h / 2, fill=fondo)
            if valore > 0:
                self.rett(x, y, max(h, w * valore), h, h / 2, fill=colore or self.sfumatura([k["azione_chiara"], k["azione"]], 0, 0, 1, 0))

    def avatar(self, cx: float, cy: float, r: float, colore: str = "#CBD5E1", iniziale: str | None = None, id: str | None = None):
        with self.gruppo(id or "avatar"):
            self.cerchio(cx, cy, r, fill=colore)
            if iniziale:
                self.testo(iniziale, cx, cy + r * 0.35, r * 0.95, 700, "#FFFFFF", "middle")
            else:
                self.cerchio(cx, cy - r * 0.18, r * 0.36, fill="#FFFFFF", opacita=0.85)
                self.path(f"M{n(cx - r * 0.62)} {n(cy + r * 0.78)}a{n(r * 0.62)} {n(r * 0.58)} 0 0 1 {n(r * 1.24)} 0z", fill="#FFFFFF", opacita=0.85)

    def card(self, x: float, y: float, w: float, h: float, r: float = 16, fill: str = "#FFFFFF", id: str | None = None,
             ombra: bool = True, bordo: str | None = None):
        self.rett(x, y, w, h, r, fill=fill, id=id, stroke=bordo, sw=1,
                  filtro=self.ombra(2, 10, "#0F172A", 0.07) if ombra else None)

    def tondo_icona(self, nome: str, cx: float, cy: float, r: float, fondo: str, colore: str, spessore: float = 2.0, id: str | None = None):
        with self.gruppo(id or f"icona-{nome}"):
            self.cerchio(cx, cy, r, fill=fondo)
            self.icona(nome, cx - r * 0.5, cy - r * 0.5, r, colore, spessore)

    def nav_inferiore(self, voci: list[tuple[str, str]], attiva: int = 0, kit: str = "blu", y: float | None = None, h: float = 84,
                      fondo: str = "#FFFFFF"):
        """voci: [(icona, etichetta), …]."""
        k = KIT[kit]
        y = self.h - h if y is None else y
        with self.gruppo("barra-di-navigazione"):
            self.rett(0, y, self.w, h, 0, fill=fondo, filtro=self.ombra(-1, 12, "#0F172A", 0.06))
            self.linea(0, y, self.w, y, LINEA, 1)
            m = self.w / len(voci)
            for i, (ic, et) in enumerate(voci):
                cx = m * i + m / 2
                col = k["azione"] if i == attiva else "#8A94A6"
                self.icona(ic, cx - 13, y + 14, 26, col, 2.0)
                self.testo(et, cx, y + 54, 12, 600 if i == attiva else 500, col, "middle", id=f"nav-{et.lower()}")
            self.rett(self.w / 2 - 67, y + h - 12, 134, 5, 2.5, fill="#0F172A", id="indicatore-home")

    def misuratore(self, cx: float, cy: float, r: float, valore: float, spessore: float = 24, colore: str = ROSSO,
                   chiaro: str = "#FF8A8A", vuoto: str = "#E9EDF5", tacche: bool = True, id: str = "misuratore"):
        """Semicerchio (da sinistra a destra) con arco pieno fino a `valore` (0..1), tacche e pomello."""
        with self.gruppo(id):
            if tacche:
                for i in range(11):
                    a = math.pi - math.pi * i / 10
                    r0, r1 = r + spessore / 2 + 8, r + spessore / 2 + 22
                    pieno = i / 10 <= valore + 1e-6
                    self.linea(cx + r0 * math.cos(a), cy - r0 * math.sin(a), cx + r1 * math.cos(a), cy - r1 * math.sin(a),
                               colore if pieno else "#CBD5E1", 3, opacita=0.55 if pieno else 0.7)
            def arco(v0, v1):
                a0, a1 = math.pi - math.pi * v0, math.pi - math.pi * v1
                x0, y0, x1, y1 = cx + r * math.cos(a0), cy - r * math.sin(a0), cx + r * math.cos(a1), cy - r * math.sin(a1)
                return f"M{n(x0)} {n(y0)}A{n(r)} {n(r)} 0 0 1 {n(x1)} {n(y1)}"
            self.path(arco(0, 1), stroke=vuoto, sw=spessore, id=f"{id}-fondo")
            g = self.sfumatura([chiaro, colore], cx - r, 0, cx + r, 0, userspace=True)
            self.path(arco(0, valore), stroke=g, sw=spessore, id=f"{id}-valore")
            a = math.pi - math.pi * valore
            px, py = cx + r * math.cos(a), cy - r * math.sin(a)
            alone = self.radiale([(0, colore, 0.35), (1, colore, 0)], 0.5, 0.5, 0.5)
            self.cerchio(px, py, spessore * 1.5, fill=alone, id=f"{id}-alone")
            self.cerchio(px, py, spessore * 0.68, fill="#FFFFFF", filtro=self.ombra(1, 4, colore, 0.35))
            self.cerchio(px, py, spessore * 0.4, fill=colore)

    def illustrazione(self, percorso: str, x: float, y: float, larghezza: float, id: str | None = None):
        """Inserisce un SVG già disegnato (es. 'kit-rosso/illustrazioni/quiz-test' dentro brand/disegni) con la
        larghezza data (altezza in proporzione). Gli id interni vengono prefissati per non scontrarsi."""
        svg = (BRAND / "disegni" / (percorso if percorso.endswith(".svg") else percorso + ".svg")).read_text()
        self.inserisci_svg(svg, x, y, larghezza, id or pathlib.Path(percorso).stem)

    def inserisci_svg(self, svg: str, x: float, y: float, larghezza: float, id: str):
        vb = re.search(r'viewBox="([\d.\-]+) ([\d.\-]+) ([\d.]+) ([\d.]+)"', svg)
        vx, vy, vw, vh = (float(v) for v in vb.groups())
        pref = self.uid("i") + "-"
        interno = re.sub(r"^.*?<svg[^>]*>", "", svg, count=1, flags=re.S)
        interno = re.sub(r"</svg>\s*$", "", interno)
        interno = re.sub(r'\bid="([^"]+)"', lambda m: f'id="{pref}{m.group(1)}"', interno)
        interno = re.sub(r"url\(#([^)]+)\)", lambda m: f"url(#{pref}{m.group(1)})", interno)
        interno = re.sub(r'(xlink:href|href)="#([^"]+)"', lambda m: f'{m.group(1)}="#{pref}{m.group(2)}"', interno)
        h = larghezza * vh / vw
        self.add(f'<svg id="{id}" x="{n(x)}" y="{n(y)}" width="{n(larghezza)}" height="{n(h)}" viewBox="{n(vx)} {n(vy)} {n(vw)} {n(vh)}" overflow="visible">{interno}</svg>')

    def foto(self, percorso: str, x: float, y: float, w: float, h: float, r: float = 0, id: str = "foto", qualita: int = 85, max_px: int = 900):
        """Una fotografia (o un ritaglio che non si può ridisegnare) dentro lo SVG, come immagine incorporata
        (JPEG in base64, rimpicciolita a max_px) con angoli arrotondati r. Le foto restano raster: è l'unica
        parte non vettoriale e va dichiarata nel rapporto."""
        import base64, io
        from PIL import Image
        im = Image.open(percorso).convert("RGB")
        if max(im.size) > max_px:
            im.thumbnail((max_px, max_px), Image.LANCZOS)
        b = io.BytesIO(); im.save(b, "JPEG", quality=qualita)
        uri = "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
        cid = self.uid("cf")
        self.defs.append(f'<clipPath id="{cid}"><rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" rx="{n(r)}"/></clipPath>')
        self.add(f'<image id="{id}" x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" preserveAspectRatio="xMidYMid slice" '
                 f'clip-path="url(#{cid})" href="{uri}"/>')

    # -- uscita
    def svg(self) -> str:
        d = f"<defs>{''.join(self.defs)}</defs>" if self.defs else ""
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(self.w)} {n(self.h)}" width="{n(self.w)}" height="{n(self.h)}">'
                f'{d}<g id="{self.id}">{"".join(self.corpo)}</g></svg>')

    def salva(self, percorso) -> pathlib.Path:
        p = pathlib.Path(percorso)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(self.svg())
        return p


class _Gruppo:
    def __init__(self, t: Tela, id: str, opacita, trasforma, clip):
        self.t, self.id, self.o, self.tr, self.clip = t, id, opacita, trasforma, clip

    def __enter__(self):
        a = f' id="{self.id}"'
        if self.o is not None: a += f' opacity="{n(self.o)}"'
        if self.tr: a += f' transform="{self.tr}"'
        if self.clip: a += f' clip-path="url(#{self.clip})"'
        self.t.add(f"<g{a}>")
        return self.t

    def __exit__(self, *e):
        self.t.add("</g>")


def clip_rett(t: Tela, x, y, w, h, r=0) -> str:
    """Dichiara un clipPath rettangolare (arrotondato) e restituisce l'id da passare a gruppo(clip=…)."""
    cid = t.uid("cl")
    t.defs.append(f'<clipPath id="{cid}"><rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" rx="{n(r)}"/></clipPath>')
    return cid
