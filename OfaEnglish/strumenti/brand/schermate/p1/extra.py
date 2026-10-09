"""Componenti comuni di p1 (locandine, banner, carosello): wordmark, corsivo a mano, svolazzi, QR, telefono, tessere."""
import sys, pathlib, math, re
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent)); sys.path.insert(0, str(QUI))
import ui
from ui import *
from ui import Tela, n, larghezza_testo, RADICE, BRAND, ICONE
from functools import lru_cache
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import qr as _qr

NAVY = "#071438"; AZZ = "#055EFD"; AZZ2 = "#1F6BF5"; CARTA = "#F6F6F4"
ORIG = RADICE.parent / "design-concept"
LAYOUT = RADICE / "brand/concept-svg/layout"
TAVOLE = RADICE / "brand/concept-svg/_tavole/p1"
LOGO = RADICE / "brand/concept-svg/logo"
TMP = pathlib.Path("/tmp/claude-0/s")

ICONE["lampadina"] = [("p", "M9 17.5h6M10 20.5h4M12 3a6 6 0 0 0-3.5 10.900c.6.5 1 1.200 1 2V17.500h5V15.900c0-.8.4-1.500 1-2A6 6 0 0 0 12 3z")]
ICONE["lampadina-fine"] = [("p", "M12 .5v1.500M3 4l1 1M21 4l-1 1M1 11h1.500M21.500 11H23")]
ICONE["grafico-pieno"] = [("pf", "M3.5 14h4.500v6.500H3.500zM9.800 8.500h4.500v12H9.800zM16 3.500h4.500v17H16z")]
ICONE["documento-pieno"] = [("pf", "M6.500 2.500h7l5 5V19.500a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2z")]
ICONE["cappello-pieno"] = [("pf", "M12 4.500 1.500 9.500 12 14.500l10.500-5z"), ("pf", "M5.500 12v4.500c0 1.600 2.900 3 6.500 3s6.500-1.400 6.500-3V12l-6.500 3z")]


@lru_cache(maxsize=None)
def _fc(peso):
    f = TTFont(ui.FONT / f"inter-latin-{peso}-italic.woff2")
    return f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm


def corsivo(t, testo, x, y, dim, peso=500, colore=AZZ, ancora="start", rot=0, id=None, spaz=0.0):
    """Scritta 'a mano' (Inter corsivo, maiuscole, ruotata): il font a mano libera non c'è, si dice nel rapporto."""
    gs, cmap, upm = _fc(peso); s = dim / upm
    tot = sum(gs[cmap[ord(c)]].width for c in testo) * s + spaz * (len(testo) - 1)
    cx = -tot / 2 if ancora == "middle" else -tot if ancora == "end" else 0
    pen = SVGPathPen(gs, ntos=lambda v: n(v))
    for c in testo:
        g = cmap.get(ord(c), cmap[ord("?")])
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, cx, 0))); cx += gs[g].width * s + spaz
    a = f' id="{id}"' if id else ""
    t.add(f'<path d="{pen.getCommands()}" fill="{colore}" transform="translate({n(x)} {n(y)}) rotate({n(rot)})"{a}/>')
    return tot


def corsivo_per(testo, larghezza, peso=500, spaz=0.0):
    gs, cmap, upm = _fc(peso)
    return larghezza / (sum(gs[cmap[ord(c)]].width for c in testo) / upm)


def corpo_per(testo, larghezza, peso=700, spaz_rel=0.0):
    """Corpo che dà `larghezza` (con spaziatura relativa al corpo)."""
    w1 = larghezza_testo(testo, 100, peso, spaz_rel * 100)
    return 100 * larghezza / w1


def riga(t, testo, x, y, larg, peso=800, colore=NAVY, spaz_rel=-0.02, id=None, ancora="start"):
    d = corpo_per(testo, larg, peso, spaz_rel)
    t.testo(testo, x, y, d, peso, colore, ancora, id=id, spaziatura=spaz_rel * d)
    return d


def wordmark(t, x, y, w, scuro=False, id="wordmark", rot=0):
    svg = (LOGO / "wordmark-primario.svg").read_text()
    if scuro:
        svg = svg.replace("#071438", "#FFFFFF")
    if rot:
        h = w * 77 / 365
        with t.gruppo(id + "-rot", trasforma=f"translate({n(x)} {n(y)}) rotate({n(rot)})"):
            t.inserisci_svg(svg, 0, 0, w, id)
    else:
        t.inserisci_svg(svg, x, y, w, id)


def wordmark_def(t, w, did, scuro=False):
    """Dichiara il wordmark una sola volta in <defs> (id did) per riusarlo con <use>: file più leggeri."""
    k = len(t.corpo)
    wordmark(t, 0, 0, w, scuro=scuro, id=did)
    t.defs.append(t.corpo.pop(k))
    assert len(t.corpo) == k


def wordmark_uso(t, x, y, did, rot=0, id=None):
    a = f' id="{id}"' if id else ""
    t.add(f'<use href="#{did}" transform="translate({n(x)} {n(y)}) rotate({n(rot)})"{a}/>')


def stella4(t, cx, cy, r, colore="#FFFFFF", id=None):
    """Stella a quattro punte del marchio (curve concave) centrata, raggio r (punta)."""
    k = r / 12.9
    d = ("M0 -12.9C.3 -7 4 -3.3 12.9 0 4 3.3.3 7 0 12.9-.3 7-4 3.3-12.9 0-4-3.3-.3-7 0-12.9z")
    a = f' id="{id}"' if id else ""
    t.add(f'<path d="{d}" fill="{colore}" transform="translate({n(cx)} {n(cy)}) scale({n(k)})"{a}/>')


def sigillo_o(t, cx, cy, r, id="icona-o"):
    t.cerchio(cx, cy, r, fill=AZZ, id=id); stella4(t, cx, cy, r * 0.55)


def svolazzo(t, pts, colore=AZZ, sw=4, id=None, cap="round"):
    """Tratto a mano: curva liscia per i punti (Catmull-Rom -> Bezier)."""
    d = f"M{n(pts[0][0])} {n(pts[0][1])}"
    P = [pts[0]] + list(pts) + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{n(c1[0])} {n(c1[1])} {n(c2[0])} {n(c2[1])} {n(p2[0])} {n(p2[1])}"
    t.path(d, stroke=colore, sw=sw, id=id, cap=cap)


def freccia_curva(t, pts, colore=AZZ, sw=4, id=None, testa=14):
    svolazzo(t, pts, colore, sw, id)
    (x0, y0), (x1, y1) = pts[-2], pts[-1]
    a = math.atan2(y1 - y0, x1 - x0)
    for da in (2.5, -2.5):
        t.linea(x1, y1, x1 - testa * math.cos(a + da * 0.0 + (0.5 if da > 0 else -0.5)), y1 - testa * math.sin(a + (0.5 if da > 0 else -0.5)), colore, sw)


def tratti_scintilla(t, cx, cy, r, ang, colore=AZZ, sw=5, lung=26, id=None):
    with t.gruppo(id or "scintille"):
        for a in ang:
            r0, r1 = r, r + lung
            t.linea(cx + r0 * math.cos(math.radians(a)), cy + r0 * math.sin(math.radians(a)),
                    cx + r1 * math.cos(math.radians(a)), cy + r1 * math.sin(math.radians(a)), colore, sw)


def qr_codice(t, x, y, lato, testo="https://linktr.ee/addiofa", colore=NAVY, id="codice-qr", logo=True, quiet=0):
    M = _qr.migliore(testo); N = M.shape[0]; c = lato / N
    with t.gruppo(id):
        d = []
        for r in range(N):
            c0 = None
            for cc in range(N + 1):
                on = cc < N and M[r, cc]
                if on and c0 is None: c0 = cc
                if not on and c0 is not None:
                    d.append(f"M{n(x + c0 * c)} {n(y + r * c)}h{n((cc - c0) * c)}v{n(c)}h{n(-(cc - c0) * c)}z"); c0 = None
        t.path("".join(d), fill=colore, id=id + "-moduli")
        # i tre riquadri di posizione: occhi arrotondati
    return M


def tessera(t, nome, x, y, lato, fondo="#DCE8FA", colore=AZZ, id=None, r=None):
    r = lato * 0.22 if r is None else r
    with t.gruppo(id or f"tessera-{nome}"):
        t.rett(x, y, lato, lato, r, fill=fondo)
        k = lato * 0.5
        if nome == "lampadina":
            t.icona("lampadina", x + (lato - k) / 2 + 1, y + lato * 0.22, k, colore, 2.2)
            t.icona("lampadina-fine", x + lato * 0.1, y + lato * 0.18, lato * 0.8, colore, 1.8)
        else:
            t.icona(nome, x + (lato - k) / 2, y + (lato - k) / 2, k, colore, 2.0, fill_pieno=colore if nome.endswith("pieno") else None)


def toni(img, box):
    from PIL import Image
    return Image.open(ORIG / img).convert("RGB").crop(box)


def foto_forma(t, im, x, y, w, h, clip_d=None, fade=None, id="foto", qualita=86, max_px=900):
    """Fotografia (PIL.Image) incorporata come JPEG, ritagliata da un tracciato vettoriale (strappo di carta, ecc.)
    e/o sfumata con una maschera a gradiente vettoriale. fade = (x1,y1,x2,y2,[(offset, opacita),...]) in coordinate tela."""
    import base64, io
    from PIL import Image
    im = im.convert("RGB")
    if max(im.size) > max_px: im.thumbnail((max_px, max_px), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=qualita)
    uri = "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
    extra = ""
    if clip_d:
        cid = t.uid("cp"); t.defs.append(f'<clipPath id="{cid}"><path d="{clip_d}"/></clipPath>'); extra += f' clip-path="url(#{cid})"'
    if fade:
        x1, y1, x2, y2, stops = fade
        gid = t.uid("mg"); mid = t.uid("mk")
        st = "".join(f'<stop offset="{n(o)}" stop-color="#fff" stop-opacity="{n(a)}"/>' for o, a in stops)
        t.defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}">{st}</linearGradient>'
                      f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}"><rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" fill="url(#{gid})"/></mask>')
        extra += f' mask="url(#{mid})"'
    t.add(f'<g{extra}><image id="{id}" x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" preserveAspectRatio="none" href="{uri}"/></g>')


def strappo(punti, ampiezza=3.0, passo=14, seme=1):
    """Bordo di carta strappata: poligono per i punti con piccole oscillazioni deterministiche."""
    import random
    rnd = random.Random(seme); out = []
    for (x0, y0), (x1, y1) in zip(punti, punti[1:] + punti[:1]):
        L = math.hypot(x1 - x0, y1 - y0); k = max(1, int(L / passo))
        nx, ny = -(y1 - y0) / (L or 1), (x1 - x0) / (L or 1)
        for i in range(k):
            f = i / k; o = rnd.uniform(-ampiezza, ampiezza)
            out.append((x0 + (x1 - x0) * f + nx * o, y0 + (y1 - y0) * f + ny * o))
    return "M" + "L".join(f"{n(a)} {n(b)}" for a, b in out) + "z"


def telefono_quiz(t, cx, cy, rot=0, k=1.0, scuro_corpo="#16181D", id="telefono", paese=None):
    """Telefono con la schermata del quiz di valutazione (ridisegnata, testi sensati). Coordinate locali: 330x650 centrato."""
    W, H = 330, 650
    with t.gruppo(id, trasforma=f"translate({n(cx)} {n(cy)}) rotate({n(rot)}) scale({n(k)}) translate({-W/2} {-H/2})"):
        t.rett(-6, 22, W + 12, H, 54, fill="#000", opacita=0.16, filtro=t.sfoca(14), id=id + "-ombra")
        t.rett(0, 0, W, H, 52, fill=t.sfumatura(["#9EA3AB", "#4B4F57", "#B9BDC4"], 0, 0, 1, 1), id=id + "-telaio")
        t.rett(4, 4, W - 8, H - 8, 48, fill=scuro_corpo)
        sx, sy, sw_, sh = 13, 13, W - 26, H - 26
        cl = ui.clip_rett(t, sx, sy, sw_, sh, 40)
        with t.gruppo(id + "-schermo", clip=cl):
            t.rett(sx, sy, sw_, sh, 0, fill="#F3F6FC")
            t.rett(sx, sy, sw_, 112, 0, fill=AZZ2, id=id + "-testata")
            t.rett(W / 2 - 50, sy, 100, 28, 14, fill=scuro_corpo, id=id + "-notch")
            t.icona("chevron-sinistra", sx + 18, sy + 34, 16, "#FFFFFF", 2.4)
            t.rett(sx + 14, sy + 66, sw_ - 28, sh, 28, fill="#FFFFFF", id=id + "-scheda")
        # contenuto della scheda
        wordmark(t, W / 2 - 60, 98, 120, id=id + "-wordmark")
        t.testo("Quiz di valutazione", W / 2, 166, 16, 700, NAVY, "middle")
        t.rett(34, 190, 222, 9, 4.5, fill="#E5EAF3"); t.rett(34, 190, 70, 9, 4.5, fill=AZZ2, id=id + "-avanzamento")
        t.testo("3/10", 296, 199, 12, 500, "#475569", "end")
        t.testo("Choose the correct form:", 34, 244, 17, 400, NAVY)
        t.testo("She ______ to Milan", 34, 270, 17, 400, NAVY)
        t.testo("every day.", 34, 294, 17, 700, NAVY)
        risp = [("goes", "#FEE2E2", "#F4A5A5", True), ("going", "#F7F9FC", "#E3E8F0", False), ("to go", "#F7F9FC", "#E3E8F0", False)]
        for i, (r, f, b, err) in enumerate(risp):
            y = 322 + i * 62
            t.rett(28, y, 274, 50, 16, fill=f, stroke=b, sw=1.4, id=f"{id}-risposta-{i + 1}")
            if err:
                t.cerchio(56, y + 25, 13, fill="#EF4444"); t.icona("x", 50, y + 19, 12, "#FFFFFF", 3)
            else:
                t.cerchio(56, y + 25, 12, fill="#FFFFFF", stroke="#C7D0E0", sw=2)
            t.testo(r, 82, y + 31, 16, 500, "#334155")
        t.rett(28, 538, 274, 54, 18, fill=AZZ2, id=id + "-pulsante", filtro=t.ombra(3, 8, AZZ2, 0.25))
        t.testo("Avanti", 150, 572, 18, 600, "#FFFFFF", "middle")
        t.icona("freccia-destra", 188, 556, 20, "#FFFFFF", 2.2)


def tavola(svg_path, orig_img, box, nome, larg_px=None, k=1.0):
    """Tavola originale | disegno | differenza in brand/concept-svg/_tavole/p1/<nome>.png. Restituisce scarto medio."""
    sys.path.insert(0, str(RADICE / "strumenti/brand"))
    from render import Renderer
    from PIL import Image, ImageChops
    import numpy as np
    TAVOLE.mkdir(parents=True, exist_ok=True); TMP.mkdir(parents=True, exist_ok=True)
    o = Image.open(ORIG / orig_img).convert("RGB").crop(box)
    w, h = o.size
    svg = pathlib.Path(svg_path).read_text()
    with Renderer() as r:
        d = r.svg(svg, w, h, "#fff").convert("RGB")
    diff = ImageChops.difference(o, d)
    mae = float(np.asarray(diff).mean())
    tv = Image.new("RGB", (w * 3 + 20, h), "#888")
    tv.paste(o, (0, 0)); tv.paste(d, (w + 10, 0)); tv.paste(diff.point(lambda v: min(255, v * 3)), (2 * w + 20, 0))
    tv.save(TAVOLE / f"{nome}.png")
    d.save(TMP / f"{nome}-render.png")
    return mae
