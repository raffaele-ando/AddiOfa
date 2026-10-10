"""
Base comune dei generatori di icone (agente `icone`): un piccolo costruttore SVG con id parlanti,
sfumature in coordinate vere, ombre sfocate con regione grande, e gli strumenti per le tavole
d'insieme (_tavola.png a 32/64/128 px su fondo chiaro e scuro, _set.svg con le icone affiancate).

    from base import Svg, tavola, set_svg, ...
    s = Svg(-136, -136, 272, 272, "sfera-studio", "Studio")   # viewBox con l'origine al centro
    s.cerchio(0, 0, 50, fill=s.rad([(0, "#fff"), (1, "#00f")], 0, 0, 50))
    s.salva(percorso)

Il testo non è mai <text>: tracciati Inter (ui.tracciato).
"""
from __future__ import annotations

import math
import pathlib
import re
import sys

QUI = pathlib.Path(__file__).resolve().parent
SCHERMATE = QUI.parent
BRAND_TOOLS = SCHERMATE.parent
RADICE = SCHERMATE.parents[2]
sys.path.insert(0, str(SCHERMATE)); sys.path.insert(0, str(BRAND_TOOLS)); sys.path.insert(0, str(BRAND_TOOLS / "illustrazioni"))
from ui import tracciato, larghezza_testo, n  # noqa: E402,F401
from geometria import V, arrotondato  # noqa: E402,F401

USCITA = RADICE / "brand" / "concept-svg" / "icone"
TMP = pathlib.Path("/tmp/claude-0/-home-user-AddiOfa/553cbc19-7099-5f91-95ed-46eecd1a1a4a/scratchpad/ic")


def _a(id, opacita) -> str:
    return (f' id="{id}"' if id else "") + (f' opacity="{n(opacita)}"' if opacita is not None else "")


def pt(x, y=None) -> str:
    if y is None:
        x, y = x.x, x.y
    return f"{n(x)} {n(y)}"


class Svg:
    def __init__(self, x0, y0, w, h, id: str, titolo: str = "", descr: str = ""):
        self.vb = (x0, y0, w, h)
        self.id, self.titolo, self.descr = id, titolo, descr
        self.defs: list[str] = []
        self.corpo: list[str] = []
        self._n = 0
        self._cache: dict = {}

    # ------------------------------------------------------------ infrastruttura
    def uid(self, p="g") -> str:
        self._n += 1
        return f"{self.id}-{p}{self._n}"

    def add(self, s: str):
        self.corpo.append(s)

    def apri(self, id=None, trasforma=None, opacita=None, clip=None, filtro=None, maschera=None):
        a = (f' id="{id}"' if id else "") + (f' transform="{trasforma}"' if trasforma else "") + \
            (f' opacity="{n(opacita)}"' if opacita is not None else "") + (f' clip-path="url(#{clip})"' if clip else "") + \
            (f' filter="{filtro}"' if filtro else "") + (f' mask="url(#{maschera})"' if maschera else "")
        self.add(f"<g{a}>")

    def chiudi(self):
        self.add("</g>")

    def g(self, *a, **k):
        return _G(self, a, k)

    def _stops(self, stops) -> str:
        out = ""
        for s in stops:
            o, c = s[0], s[1]
            op = f' stop-opacity="{n(s[2])}"' if len(s) > 2 else ""
            out += f'<stop offset="{n(o)}" stop-color="{c}"{op}/>'
        return out

    def lin(self, stops, x1, y1, x2, y2) -> str:
        k = ("lin", tuple(map(tuple, stops)), x1, y1, x2, y2)
        if k not in self._cache:
            gid = self.uid("sf")
            self.defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}">{self._stops(stops)}</linearGradient>')
            self._cache[k] = f"url(#{gid})"
        return self._cache[k]

    def rad(self, stops, cx, cy, r, fx=None, fy=None) -> str:
        k = ("rad", tuple(map(tuple, stops)), cx, cy, r, fx, fy)
        if k not in self._cache:
            gid = self.uid("rd")
            f = f' fx="{n(fx)}" fy="{n(fy)}"' if fx is not None else ""
            self.defs.append(f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}"{f}>{self._stops(stops)}</radialGradient>')
            self._cache[k] = f"url(#{gid})"
        return self._cache[k]

    def sfoca(self, dev: float) -> str:
        k = ("blur", dev)
        if k not in self._cache:
            fid = self.uid("bl")
            x0, y0, w, h = self.vb
            self.defs.append(f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="{n(x0 - 20)}" y="{n(y0 - 20)}" width="{n(w + 40)}" height="{n(h + 40)}" '
                             f'color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="{n(dev)}"/></filter>')
            self._cache[k] = f"url(#{fid})"
        return self._cache[k]

    def clip(self, d: str | None = None, cerchio=None, rett=None) -> str:
        cid = self.uid("cl")
        if cerchio:
            body = f'<circle cx="{n(cerchio[0])}" cy="{n(cerchio[1])}" r="{n(cerchio[2])}"/>'
        elif rett:
            body = f'<rect x="{n(rett[0])}" y="{n(rett[1])}" width="{n(rett[2])}" height="{n(rett[3])}" rx="{n(rett[4] if len(rett) > 4 else 0)}"/>'
        else:
            body = f'<path d="{d}"/>'
        self.defs.append(f'<clipPath id="{cid}">{body}</clipPath>')
        return cid

    # ------------------------------------------------------------ forme
    @staticmethod
    def _attr(id, stroke, sw, opacita, filtro, extra, cap="round", join="round", fillop=None):
        a = f' id="{id}"' if id else ""
        if stroke:
            a += f' stroke="{stroke}" stroke-width="{n(sw)}" stroke-linecap="{cap}" stroke-linejoin="{join}"'
        if opacita is not None:
            a += f' opacity="{n(opacita)}"'
        if fillop is not None:
            a += f' fill-opacity="{n(fillop)}"'
        if filtro:
            a += f' filter="{filtro}"'
        if extra:
            a += " " + extra
        return a

    def path(self, d, fill="none", stroke=None, sw=1, id=None, opacita=None, filtro=None, extra="", cap="round", join="round", fillop=None):
        self.add(f'<path d="{d}" fill="{fill}"{self._attr(id, stroke, sw, opacita, filtro, extra, cap, join, fillop)}/>')

    def cerchio(self, cx, cy, r, fill="none", stroke=None, sw=1, id=None, opacita=None, filtro=None, extra=""):
        self.add(f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" fill="{fill}"{self._attr(id, stroke, sw, opacita, filtro, extra)}/>')

    def ellisse(self, cx, cy, rx, ry, fill="none", stroke=None, sw=1, id=None, opacita=None, filtro=None, extra=""):
        self.add(f'<ellipse cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="{fill}"{self._attr(id, stroke, sw, opacita, filtro, extra)}/>')

    def rett(self, x, y, w, h, r=0, fill="none", stroke=None, sw=1, id=None, opacita=None, filtro=None, extra=""):
        rr = f' rx="{n(min(r, w / 2, h / 2))}"' if r else ""
        self.add(f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}"{rr} fill="{fill}"{self._attr(id, stroke, sw, opacita, filtro, extra)}/>')

    def linea(self, x1, y1, x2, y2, colore, sw=1, id=None, opacita=None, cap="round", extra=""):
        self.add(f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" stroke="{colore}" stroke-width="{n(sw)}" stroke-linecap="{cap}"'
                 f'{_a(id, opacita)}{(" " + extra) if extra else ""}/>')

    def testo(self, testo, x, y, dim, peso=600, fill="#0F172A", ancora="start", id=None, opacita=None, spaz=0.0):
        d = tracciato(testo, x, y, dim, peso, ancora, spaz)
        self.add(f'<path d="{d}" fill="{fill}"{_a(id, opacita)}/>')
        return larghezza_testo(testo, dim, peso, spaz)

    def barra(self, a: V, b: V, sp: float, colore: str, id=None, opacita=None):
        """Segmento con estremi tondi."""
        self.add(f'<path d="M{pt(a)} L{pt(b)}" stroke="{colore}" stroke-width="{n(sp)}" stroke-linecap="round" fill="none"'
                 f'{_a(id, opacita)}/>')

    # ------------------------------------------------------------ uscita
    def svg(self, w=None, h=None) -> str:
        x0, y0, vw, vh = self.vb
        w, h = w or vw, h or vh
        t = f"<title>{self.titolo}</title>" if self.titolo else ""
        d = f"<desc>{self.descr}</desc>" if self.descr else ""
        df = f"<defs>{''.join(self.defs)}</defs>" if self.defs else ""
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{n(x0)} {n(y0)} {n(vw)} {n(vh)}" width="{n(w)}" height="{n(h)}">'
                f'{t}{d}{df}<g id="{self.id}">{"".join(self.corpo)}</g></svg>')

    def salva(self, percorso, w=None, h=None) -> pathlib.Path:
        p = pathlib.Path(percorso)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(self.svg(w, h))
        return p


class _G:
    def __init__(self, s, a, k):
        self.s, self.a, self.k = s, a, k

    def __enter__(self):
        self.s.apri(*self.a, **self.k)
        return self.s

    def __exit__(self, *e):
        self.s.chiudi()


def polare(cx, cy, r, gradi) -> V:
    """Gradi in senso orario dall'asse x (SVG, y verso il basso)."""
    a = math.radians(gradi)
    return V(cx + r * math.cos(a), cy + r * math.sin(a))


def ruota(q: V, c: V, gradi: float) -> V:
    a = math.radians(gradi)
    d = q - c
    return c + V(d.x * math.cos(a) - d.y * math.sin(a), d.x * math.sin(a) + d.y * math.cos(a))


# ============================================================================ tavole e set
def _rende(percorsi, lati=(32, 64, 128), fondi=("#FFFFFF", "#0F172A")):
    from render import Renderer
    out = {}
    with Renderer() as r:
        for p in percorsi:
            svg = pathlib.Path(p).read_text()
            for L in lati:
                s2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{L}" height="{L}"', svg, count=1)
                for f in fondi:
                    out[(p, L, f)] = r.svg(s2, L, L, fondo=f)
    return out


def tavola(percorsi, uscita, colonne=None, lati=(32, 64, 128), titolo=None):
    """Tavola d'insieme: per ogni icona, a 128, 64, 32 px, su fondo chiaro e su fondo scuro (una riga per icona
    se sono poche; altrimenti a griglia di blocchi). Serve a controllare a dimensione d'uso."""
    from PIL import Image, ImageDraw
    percorsi = [pathlib.Path(p) for p in percorsi if not pathlib.Path(p).name.startswith("_")]
    rend = _rende(percorsi, lati)
    L1, L2, L3 = lati[2], lati[1], lati[0]
    pad = 8
    blocco_w = (L1 + L2 + L3 + pad * 4)
    blocco_h = L1 + pad * 2
    col = colonne or max(1, min(4, 1600 // (2 * blocco_w)))
    # ogni cella: [chiaro: 128 64 32] [scuro: 128 64 32] in due semi-blocchi affiancati
    cella_w = blocco_w * 2
    righe = (len(percorsi) + col - 1) // col
    S = Image.new("RGB", (cella_w * col, (blocco_h + 14) * righe), (255, 255, 255))
    d = ImageDraw.Draw(S)
    for i, p in enumerate(percorsi):
        cx, cy = (i % col) * cella_w, (i // col) * (blocco_h + 14)
        for k, f in enumerate(("#FFFFFF", "#0F172A")):
            x = cx + k * blocco_w
            d.rectangle([x, cy, x + blocco_w, cy + blocco_h + 14], fill=(255, 255, 255) if k == 0 else (15, 23, 42))
            xx = x + pad
            for Lk in (L1, L2, L3):
                S.paste(rend[(p, Lk, f)].convert("RGB"), (xx, cy + 14 + pad))
                xx += Lk + pad
            d.text((x + 3, cy + 1), p.stem, fill=(200, 0, 0) if k == 0 else (255, 180, 180))
    S.save(uscita)
    return uscita


def set_svg(percorsi, uscita, colonne=None, cella=None, margine=24, fondo="#FFFFFF", etichette=False, id="set"):
    """Un solo SVG con tutte le icone affiancate (ogni icona è inserita con gli id prefissati)."""
    from ui import Tela
    percorsi = [pathlib.Path(p) for p in percorsi if not pathlib.Path(p).name.startswith("_")]
    vbs = [tuple(float(v) for v in re.search(r'viewBox="([^"]+)"', p.read_text()).group(1).split()) for p in percorsi]
    cella = cella or max(v[2] for v in vbs)
    col = colonne or len(percorsi)
    righe = (len(percorsi) + col - 1) // col
    pitch = cella + margine
    et = 26 if etichette else 0
    W, H = margine + col * pitch, margine + righe * (pitch + et)
    t = Tela(W, H, fondo, id=id)
    for i, (p, vb) in enumerate(zip(percorsi, vbs)):
        x = margine + (i % col) * pitch + (cella - vb[2]) / 2
        y = margine + (i // col) * (pitch + et) + (cella - vb[3]) / 2
        t.inserisci_svg(p.read_text(), x, y, vb[2], p.stem)
        if etichette:
            t.testo(p.stem, margine + (i % col) * pitch + cella / 2, margine + (i // col) * (pitch + et) + cella + 18, 12, 500, "#475569", "middle")
    t.salva(uscita)
    return uscita
