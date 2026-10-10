"""
Libreria comune dell'agente p2 (layout non-schermata delle immagini 26, 37, 48 di design-concept).

Tutto si disegna in PIXEL DELL'ORIGINALE (1 unita' = 1 px dell'immagine sorgente) dentro tessere locali
(0..w, 0..h) che si collocano con `tessera()` (translate + scala + clip arrotondato).
Le FOTO restano raster (t.foto) ma "pulite": le scritte cotte nella foto vengono tolte con inpainting
(`foto_pulita`) e rifatte in vettoriale (testi Inter come tracciati).
"""
from __future__ import annotations

import json
import math
import pathlib
import sys

import numpy as np

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from ui import *  # noqa: E402,F401,F403
import ui as U  # noqa: E402
from ui import Tela as _Tela, RADICE, larghezza_testo, n, clip_rett  # noqa: E402


class Tela(_Tela):
    """Tela con glifi condivisi: ogni lettera (per peso) e' definita una volta in <defs> e riusata con <use>
    (stesso metodo di ui/extra.py TelaCompatta). Niente <text>: restano tracciati di Inter."""

    def __init__(self, *a, **k):
        super().__init__(*a, **k)
        self._glifi: dict = {}

    def ombra(self, dy=3, sfoca=6, colore="#0F172A", opacita=0.10, dx=0):
        """Come Tela.ombra ma con regione di filtro molto grande (serve quando si disegna in coordinate assolute della sorgente)."""
        chiave = ("ombra", dx, dy, sfoca, colore, opacita)
        if chiave in self._chiavi:
            return self._chiavi[chiave]
        fid = self.uid("om")
        self.defs.append(
            f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="-100" y="-100" width="2400" height="1400" '
            f'color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="{n(sfoca / 2)}"/>'
            f'<feOffset dx="{n(dx)}" dy="{n(dy)}" result="o"/><feFlood flood-color="{colore}" flood-opacity="{n(opacita)}"/>'
            f'<feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
        self._chiavi[chiave] = f"url(#{fid})"
        return self._chiavi[chiave]

    def sfoca(self, quanto):
        chiave = ("sfoca", quanto)
        if chiave in self._chiavi:
            return self._chiavi[chiave]
        fid = self.uid("sf")
        self.defs.append(f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="-100" y="-100" width="2400" height="1400">'
                         f'<feGaussianBlur stdDeviation="{n(quanto)}"/></filter>')
        self._chiavi[chiave] = f"url(#{fid})"
        return self._chiavi[chiave]

    def _glifo(self, peso, carattere):
        from fontTools.pens.svgPathPen import SVGPathPen
        from fontTools.pens.transformPen import TransformPen
        pw = U._peso(peso)
        _, gs, cmap, upm = U._font(pw)
        g = cmap.get(ord(carattere), cmap[ord("?")])
        chiave = (pw, g)
        if chiave not in self._glifi:
            pen = SVGPathPen(gs, ntos=lambda v: str(int(round(v))))
            gs[g].draw(TransformPen(pen, (1, 0, 0, -1, 0, 0)))
            d = pen.getCommands()
            gid = f"{self.id}-gl{pw}-{g}"
            self._glifi[chiave] = (gid if d else None, gs[g].width)
            if d:
                self.defs.append(f'<path id="{gid}" d="{d}"/>')
        return self._glifi[chiave], upm

    def testo(self, testo, x, y, dimensione, peso=400, colore=U.INK, ancora="start", id=None, spaziatura=0.0, opacita=None):
        tot = larghezza_testo(testo, dimensione, peso, spaziatura)
        cx = x - tot / 2 if ancora == "middle" else x - tot if ancora == "end" else x
        usi = []
        for c in testo:
            (gid, adv), upm = self._glifo(peso, c)
            s = dimensione / upm
            if gid:
                usi.append(f'<use href="#{gid}" transform="translate({n(cx)} {n(y)}) scale({s:.5f})"/>')
            cx += adv * s + spaziatura
        a = f' id="{id}"' if id else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        self.add(f'<g fill="{colore}"{a}>{"".join(usi)}</g>')
        return tot

SORGENTI = RADICE / "fonti" / "design-concept"
S26 = SORGENTI / "file_000000007c448210acbc3b891fe6e023.png"
S37 = SORGENTI / "file_000000009e5c81f4b0baad22bd7f8b7a.png"
S48 = SORGENTI / "file_00000000ef148210badb0fcc37386407.png"
FOTO_DIR = QUI / "_foto"
OUT = RADICE / "brand/concept-svg/layout"
TAVOLE = RADICE / "brand/concept-svg/_tavole/p2"
RAPPORTO = RADICE / "brand/concept-svg/_rapporti/p2.json"

# colori (campionati sulle zone pulite delle immagini)
NAVY = "#0A1633"
BLU_T = "#1D63F2"      # blu dei titoli social
BLU_A = "#2B6BF0"
NERO = "#0B1020"
GRIGIO_T = "#4B5563"


def corpo_per(testo: str, larghezza_px: float, peso: int = 700, spaziatura: float = 0.0) -> float:
    return larghezza_px / larghezza_testo(testo, 1.0, peso, spaziatura)


# ------------------------------------------------------------------------------------------ foto
def foto_pulita(sorgente, box, nome, rects=(), thr=14, raggio=7, dil=7, liscia=True, chiaro=None):
    """Ritaglia `box` (x0,y0,x1,y1) dalla sorgente, toglie le scritte/icone cotte nella foto dentro i rettangoli
    `rects` (coordinate assolute della sorgente): maschera = pixel che differiscono dalla mediana locale (contrasto
    fine = lettere), dilatata, poi inpainting; dentro i rettangoli si leviga leggermente il residuo.
    Salva in _foto/<nome>.png e restituisce il percorso."""
    import cv2
    from PIL import Image
    im = Image.open(sorgente).convert("RGB")
    a = np.array(im.crop(box))
    x0, y0 = box[0], box[1]
    med = cv2.medianBlur(a, 21)
    diff = np.abs(a.astype(int) - med.astype(int)).max(axis=2)
    mask = np.zeros(a.shape[:2], np.uint8)
    for (rx0, ry0, rx1, ry1) in rects:
        sub = np.zeros_like(mask)
        sub[max(0, ry0 - y0):ry1 - y0, max(0, rx0 - x0):rx1 - x0] = 1
        m = (diff > thr)
        if chiaro:
            m |= (a.min(axis=2) >= chiaro)
        mask |= (m & (sub > 0)).astype(np.uint8)
    if mask.any():
        mask = cv2.dilate(mask, np.ones((dil, dil), np.uint8))
        a = cv2.inpaint(a, mask * 255, raggio, cv2.INPAINT_TELEA)
        if liscia:
            bl = cv2.GaussianBlur(a, (0, 0), 3)
            m = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 3)[..., None]
            a = (a * (1 - m) + bl * m).astype(np.uint8)
    FOTO_DIR.mkdir(exist_ok=True)
    p = FOTO_DIR / f"{nome}.png"
    Image.fromarray(a).save(p)
    return p


# ------------------------------------------------------------------------------------------ tessere
def tessera(t: Tela, id: str, x, y, w, h, r=0, scala=1.0, fondo=None):
    """Gruppo con translate/scala e clip arrotondato di (w,h) unita' locali. Uso: with tessera(...): disegna in 0..w,0..h"""
    cid = clip_rett(t, 0, 0, w, h, r)
    tr = f"translate({n(x)} {n(y)})" + (f" scale({n(scala)})" if scala != 1 else "")
    g = t.gruppo(id, trasforma=tr, clip=cid)
    return g


def salva(t: Tela, sotto: str, nome: str) -> pathlib.Path:
    p = OUT / sotto / f"{nome}.svg"
    t.salva(p)
    kb = p.stat().st_size / 1024
    print(f"  {p.relative_to(RADICE)}  {kb:.0f} KB")
    return p


def nuova(w, h, id, fondo="#FFFFFF"):
    return Tela(w, h, fondo, id)


# ------------------------------------------------------------------------------------------ forme di marca
def stella4_d(cx, cy, r, curva=0.18):
    """Stella a 4 punte con lati concavi (costruita simmetrica)."""
    k = r * curva
    return (f"M{n(cx)} {n(cy - r)}Q{n(cx + k)} {n(cy - k)} {n(cx + r)} {n(cy)}Q{n(cx + k)} {n(cy + k)} {n(cx)} {n(cy + r)}"
            f"Q{n(cx - k)} {n(cy + k)} {n(cx - r)} {n(cy)}Q{n(cx - k)} {n(cy - k)} {n(cx)} {n(cy - r)}z")


def stella4(t, cx, cy, r, fill="#FFFFFF", id="stella", opacita=None, curva=0.18):
    t.path(stella4_d(cx, cy, r, curva), fill=fill, id=id, opacita=opacita)


def stella5_d(cx, cy, r, ri=None):
    ri = ri or r * 0.5
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else ri
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return "M" + "L".join(f"{n(x)} {n(y)}" for x, y in pts) + "z"


def wordmark(t, x, yb, corpo, col=NAVY, col_o=BLU_A, id="wordmark-addiofa", peso=800):
    """AddiOFA: 'Addi' + O (anello blu con stella) + 'FA'. x = inizio, yb = linea di base. Restituisce larghezza."""
    sp = -corpo * 0.02
    w1 = larghezza_testo("Addi", corpo, peso, sp)
    wo = corpo * 0.80
    with t.gruppo(id):
        t.testo("Addi", x, yb, corpo, peso, col, spaziatura=sp, id=id + "-addi")
        cx = x + w1 + corpo * 0.03 + wo / 2
        cy = yb - corpo * 0.36
        t.cerchio(cx, cy, wo / 2 - corpo * 0.07, fill="none", stroke=col_o, sw=corpo * 0.14, id=id + "-o")
        stella4(t, cx, cy, wo * 0.26, fill=col_o, id=id + "-stella")
        x2 = x + w1 + corpo * 0.06 + wo
        t.testo("FA", x2, yb, corpo, peso, col, spaziatura=sp, id=id + "-fa")
    return (x2 - x) + larghezza_testo("FA", corpo, peso, sp)


def tile_marchio(t, x, y, lato, id="marchio-tile", scuro=True):
    """Marchio app: tile blu con stella (versione piatta con luce: sfumatura + filo chiaro + stella a 4 punte
    bianca con alone caldo), in sostituzione del 3D."""
    r = lato * 0.26
    with t.gruppo(id):
        t.rett(x, y, lato, lato, r, fill=t.sfumatura(["#1F6BF5", "#0B3FB8", "#071E66"]), id=id + "-corpo",
               filtro=t.ombra(lato * 0.05, lato * 0.12, "#021040", 0.35))
        t.rett(x + 0.5, y + 0.5, lato - 1, lato - 1, r, fill="none", stroke="#FFFFFF", sw=max(0.8, lato * 0.012), opacita=0.25, id=id + "-filo")
        alone = t.radiale([(0, "#FFE9A6", 0.9), (0.5, "#FFD05A", 0.35), (1, "#FFD05A", 0)], 0.5, 0.5, 0.5)
        t.cerchio(x + lato / 2, y + lato / 2, lato * 0.42, fill=alone, id=id + "-alone")
        t.path(stella5_d(x + lato / 2, y + lato / 2 + lato * 0.01, lato * 0.30, lato * 0.135),
               fill=t.sfumatura(["#FFF6CC", "#FFD35E"]), stroke="#FFF0B0", sw=lato * 0.03, id=id + "-stella")


def pillola(t, x, y, w, h, fill, testo=None, col="#FFFFFF", corpo=None, peso=700, id=None, stroke=None, opacita=None):
    t.rett(x, y, w, h, h / 2, fill=fill, id=id, stroke=stroke, opacita=opacita)
    if testo:
        c = corpo or h * 0.45
        t.testo(testo, x + w / 2, y + h / 2 + c * 0.36, c, peso, col, ancora="middle")


def freccia_tonda(t, cx, cy, r, id="pulsante-avanti", col=BLU_T):
    t.cerchio(cx, cy, r, fill="#FFFFFF", id=id, filtro=t.ombra(r * 0.15, r * 0.5, "#0A1633", 0.25))
    t.icona("freccia-destra", cx - r * 0.5, cy - r * 0.5, r, col, 2.4)


def segnalibro_pin(t, cx, cy, s, col="#FFFFFF"):
    """Spillo (post fissato), forma generica."""
    t.path(f"M{n(cx - s*0.3)} {n(cy - s*0.5)}h{n(s*0.6)}l{n(s*0.12)} {n(s*0.1)}-{n(s*0.1)} {n(s*0.35)}l{n(s*0.25)} {n(s*0.25)}h-{n(s*0.8)}l{n(s*0.25)}-{n(s*0.25)}-{n(s*0.1)}-{n(s*0.35)}z", fill=col, id="spillo-fissato")


def cielo(t, x, y, w, h, id="cielo", chiaro=False):
    """Fondo cielo azzurro con sfumatura e nuvole morbide (vettoriale)."""
    t.rett(x, y, w, h, 0, fill=t.sfumatura(["#1D63D9", "#4A97F0", "#BCDDFB"] if not chiaro else ["#9CC8F8", "#D6EAFD", "#F4FAFF"]), id=id)


def nuvola(t, cx, cy, w, op=0.9, id="nuvola"):
    h = w * 0.34
    with t.gruppo(id, opacita=op):
        for dx, dy, rr in [(-0.28, 0.05, 0.22), (-0.08, -0.12, 0.3), (0.16, -0.02, 0.26), (0.34, 0.08, 0.17), (0.04, 0.1, 0.24)]:
            t.cerchio(cx + dx * w, cy + dy * w, rr * w * 0.5 + h * 0.2, fill="#FFFFFF", filtro=t.sfoca(w * 0.03))


def rapporto_aggiungi(voci: list):
    """Aggiorna incrementalmente il rapporto p2.json (sostituisce le voci con lo stesso svg)."""
    RAPPORTO.parent.mkdir(parents=True, exist_ok=True)
    cur = json.loads(RAPPORTO.read_text()) if RAPPORTO.exists() else []
    chiavi = {(v["svg"], tuple(v["elementi"])) for v in voci}
    cur = [v for v in cur if (v["svg"], tuple(v["elementi"])) not in chiavi]
    cur.extend(voci)
    RAPPORTO.write_text(json.dumps(cur, ensure_ascii=False, indent=1))


def tavola(svg_path, orig_crop_png, nome, k=1.0):
    """Tavola originale | disegno | differenza in _tavole/p2."""
    import subprocess
    TAVOLE.mkdir(parents=True, exist_ok=True)
    r = subprocess.run([sys.executable, str(QUI.parent / "controlla_schermata.py"), str(svg_path), str(orig_crop_png),
                        str(TAVOLE / f"{nome}.png"), "--k", str(k)], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr[-300:])


def ritaglio(sorgente, box, nome):
    from PIL import Image
    FOTO_DIR.mkdir(exist_ok=True)
    p = FOTO_DIR / f"_orig_{nome}.png"
    Image.open(sorgente).convert("RGB").crop(box).save(p)
    return p


# ------------------------------------------------------------------------------------------ elementi condivisi
def cappello_laurea(t, cx, cy, w, id="cappello-laurea"):
    """Tocco da laureato blu (vettoriale), largo w."""
    h = w * 0.52
    x0, y0 = cx - w / 2, cy - h / 2
    with t.gruppo(id):
        # base (calotta)
        t.path(f"M{n(cx - w*0.27)} {n(cy + h*0.02)}V{n(cy + h*0.26)}Q{n(cx)} {n(cy + h*0.52)} {n(cx + w*0.27)} {n(cy + h*0.26)}V{n(cy + h*0.02)}z",
               fill=t.sfumatura(["#1E5BE0", "#0F3AA8"]), id=id + "-calotta")
        # piano
        t.path(f"M{n(cx)} {n(cy - h*0.46)}L{n(cx + w*0.5)} {n(cy - h*0.1)}L{n(cx)} {n(cy + h*0.26)}L{n(cx - w*0.5)} {n(cy - h*0.1)}z",
               fill=t.sfumatura(["#3E86FA", "#1F63EA"]), id=id + "-piano")
        t.path(f"M{n(cx)} {n(cy - h*0.46)}L{n(cx + w*0.5)} {n(cy - h*0.1)}L{n(cx)} {n(cy - h*0.2)}L{n(cx - w*0.5)} {n(cy - h*0.1)}z", fill="#FFFFFF", opacita=0.22, id=id + "-luce")
        # nappa
        t.path(f"M{n(cx)} {n(cy - h*0.12)}L{n(cx + w*0.3)} {n(cy - h*0.1)}V{n(cy + h*0.28)}", fill="none", stroke="#0F3AA8", sw=max(1, w*0.012), id=id + "-cordino")
        t.rett(cx + w*0.3 - w*0.022, cy + h*0.26, w*0.044, h*0.22, w*0.02, fill="#1448C0", id=id + "-nappa")


def punto_interrogativo_tondo(t, cx, cy, r, id="faq-punto-interrogativo"):
    with t.gruppo(id):
        t.cerchio(cx, cy, r, fill=t.sfumatura(["#2F78FA", "#1555E0"]), filtro=t.ombra(r*0.12, r*0.4, "#0A3AA8", 0.3), id=id + "-tondo")
        t.path(f"M{n(cx - r*0.3)} {n(cy - r*0.22)}a{n(r*0.3)} {n(r*0.3)} 0 1 1 {n(r*0.46)} {n(r*0.28)}c-{n(r*0.12)} {n(r*0.08)}-{n(r*0.16)} {n(r*0.14)}-{n(r*0.16)} {n(r*0.3)}",
               stroke="#FFFFFF", sw=r*0.17, id=id + "-segno")
        t.cerchio(cx, cy + r*0.52, r*0.1, fill="#FFFFFF", id=id + "-punto")


def copertina_highlight(t, cx, cy, r, ill=None, id="copertina", glifo=None, scala_ill=1.15, dy=0.0):
    """Cover delle storie in evidenza: tondo pallido con anello e illustrazione del kit dentro."""
    with t.gruppo(id):
        t.cerchio(cx, cy, r, fill=t.radiale([(0, "#F6F9FF", 1), (0.7, "#E7F0FE", 1), (1, "#DCE8FD", 1)], 0.5, 0.4, 0.62),
                  stroke="#C9DBFB", sw=max(1.2, r * 0.025), id=id + "-tondo", filtro=t.ombra(r * 0.06, r * 0.18, "#4C7CE0", 0.14))
        t.cerchio(cx, cy, r * 0.9, fill="none", stroke="#FFFFFF", sw=max(1, r * 0.03), opacita=0.9, id=id + "-filo")
        if ill:
            vb = {"kit-blu/illustrazioni/studio-inglese": (218, 151), "kit-blu/illustrazioni/quiz-test": (205, 166),
                  "kit-blu/illustrazioni/suggerimenti-consigli": (185, 158), "kit-blu/illustrazioni/progressi-statistiche": (146, 105),
                  "kit-blu/illustrazioni/successo": (191, 171)}[ill]
            w = r * 2 * 0.66 * scala_ill
            h = w * vb[1] / vb[0]
            t.illustrazione(ill, cx - w / 2, cy - h / 2 + r * dy, w, id=id + "-illustrazione")
        if glifo:
            glifo(t, cx, cy, r)


def contatore(t, cx, cy, testo, w=48, h=38, id="contatore-pagine", corpo=18):
    t.rett(cx - w / 2, cy - h / 2, w, h, h / 2, fill="#1A2F66", opacita=0.62, id=id)
    t.testo(testo, cx, cy + corpo * 0.36, corpo, 600, "#FFFFFF", ancora="middle", id=id + "-testo")


def spillo(t, cx, cy, s=26, col="#FFFFFF", id="spillo"):
    """Spillo 'post fissato' (forma generica): testa, corpo, punta."""
    with t.gruppo(id, trasforma=f"rotate(40 {n(cx)} {n(cy)})"):
        t.rett(cx - s*0.3, cy - s*0.5, s*0.6, s*0.34, s*0.1, fill=col)
        t.path(f"M{n(cx - s*0.18)} {n(cy - s*0.18)}H{n(cx + s*0.18)}L{n(cx + s*0.32)} {n(cy + s*0.12)}H{n(cx - s*0.32)}z", fill=col)
        t.rett(cx - s*0.04, cy + s*0.1, s*0.08, s*0.42, s*0.04, fill=col)


def telefono(t, x, y, w, h, id="telefono", rot=0, schermo=None, r=None):
    """Telefono in vettoriale (corpo nero con filo, schermo bianco, isola). `schermo(t, sx, sy, sw, sh)` disegna il contenuto."""
    r = r or w * 0.16
    b = w * 0.032
    cid = clip_rett(t, x + b, y + b, w - 2 * b, h - 2 * b, r - b)
    tr = f"rotate({n(rot)} {n(x + w/2)} {n(y + h/2)})" if rot else None
    with t.gruppo(id, trasforma=tr):
        t.rett(x, y, w, h, r, fill=t.sfumatura(["#2A2F3A", "#0B0E14"]), id=id + "-corpo", filtro=t.ombra(w*0.03, w*0.1, "#071030", 0.35))
        t.rett(x + 1, y + 1, w - 2, h - 2, r, fill="none", stroke="#6B7384", sw=1.2, opacita=0.7, id=id + "-filo")
        with t.gruppo(id + "-schermo", clip=cid):
            t.rett(x + b, y + b, w - 2 * b, h - 2 * b, 0, fill="#FFFFFF")
            if schermo:
                schermo(t, x + b, y + b, w - 2 * b, h - 2 * b)
        t.rett(x + w * 0.5 - w * 0.14, y + b * 2.3, w * 0.28, w * 0.085, w * 0.043, fill="#05070B", id=id + "-isola")


# ------------------------------------------------------------------------------------------ icone dei social (forme generiche)
def ico_cuore(t, cx, cy, s, col="#FFFFFF", id="icona-cuore"):
    k = s / 24
    t.path(f"M{n(cx)} {n(cy + 10*k)}C{n(cx - 14*k)} {n(cy - 1*k)} {n(cx - 9*k)} {n(cy - 11*k)} {n(cx - 4.5*k)} {n(cy - 9.5*k)}C{n(cx - 2*k)} {n(cy - 8.5*k)} {n(cx)} {n(cy - 6*k)} {n(cx)} {n(cy - 6*k)}"
           f"C{n(cx)} {n(cy - 6*k)} {n(cx + 2*k)} {n(cy - 8.5*k)} {n(cx + 4.5*k)} {n(cy - 9.5*k)}C{n(cx + 9*k)} {n(cy - 11*k)} {n(cx + 14*k)} {n(cy - 1*k)} {n(cx)} {n(cy + 10*k)}z", fill=col, id=id)


def ico_commento(t, cx, cy, s, col="#FFFFFF", id="icona-commento"):
    k = s / 24
    t.path(f"M{n(cx)} {n(cy - 10*k)}C{n(cx + 6*k)} {n(cy - 10*k)} {n(cx + 10.5*k)} {n(cy - 5.5*k)} {n(cx + 10.5*k)} {n(cy)}C{n(cx + 10.5*k)} {n(cy + 5.5*k)} {n(cx + 6*k)} {n(cy + 10*k)} {n(cx)} {n(cy + 10*k)}"
           f"C{n(cx - 1.8*k)} {n(cy + 10*k)} {n(cx - 3.5*k)} {n(cy + 9.6*k)} {n(cx - 5*k)} {n(cy + 8.8*k)}L{n(cx - 10*k)} {n(cy + 10.5*k)}L{n(cx - 8.6*k)} {n(cy + 5.6*k)}"
           f"C{n(cx - 9.8*k)} {n(cy + 3.8*k)} {n(cx - 10.5*k)} {n(cy + 2*k)} {n(cx - 10.5*k)} {n(cy)}C{n(cx - 10.5*k)} {n(cy - 5.5*k)} {n(cx - 6*k)} {n(cy - 10*k)} {n(cx)} {n(cy - 10*k)}z", fill=col, id=id)


def ico_segnalibro(t, cx, cy, s, col="#FFFFFF", id="icona-salva"):
    k = s / 24
    t.path(f"M{n(cx - 6.5*k)} {n(cy - 10*k)}H{n(cx + 6.5*k)}V{n(cy + 10*k)}L{n(cx)} {n(cy + 4.5*k)}L{n(cx - 6.5*k)} {n(cy + 10*k)}z", fill=col, id=id)


def ico_x(t, cx, cy, s, col="#FFFFFF", id="icona-chiudi"):
    d = s * 0.28
    t.path(f"M{n(cx - d)} {n(cy - d)}L{n(cx + d)} {n(cy + d)}M{n(cx + d)} {n(cy - d)}L{n(cx - d)} {n(cy + d)}", stroke=col, sw=max(1.4, s * 0.1), id=id)


def ico_condividi(t, cx, cy, s, col="#FFFFFF", id="icona-condividi"):
    k = s / 24
    t.path(f"M{n(cx - 9*k)} {n(cy + 8*k)}C{n(cx - 9*k)} {n(cy)} {n(cx - 4*k)} {n(cy - 5*k)} {n(cx + 3*k)} {n(cy - 5*k)}V{n(cy - 9*k)}L{n(cx + 10*k)} {n(cy - 1.5*k)}L{n(cx + 3*k)} {n(cy + 5.5*k)}V{n(cy + 1.8*k)}"
           f"C{n(cx - 3*k)} {n(cy + 1.8*k)} {n(cx - 6.5*k)} {n(cy + 4*k)} {n(cx - 9*k)} {n(cy + 8*k)}z", fill=col, id=id)


def ico_play(t, cx, cy, s, col="#FFFFFF", id="icona-play"):
    t.path(f"M{n(cx - s*0.35)} {n(cy - s*0.45)}L{n(cx + s*0.45)} {n(cy)}L{n(cx - s*0.35)} {n(cy + s*0.45)}z", fill="none", stroke=col, sw=max(1.3, s * 0.11), id=id)


def reel_chrome(t, w, h, conteggi=None, didascalia=(), alto="x", scuro=False, corpo_cap=12.2, ombra_basso=True, id_pref=""):
    """Interfaccia da storia/reel: wordmark in alto a sinistra, icona in alto a destra, colonna cuore/commenti/salva,
    didascalia in basso e freccia di condivisione. Coordinate locali della tessera (w x h)."""
    col = NAVY if scuro else "#FFFFFF"
    wordmark(t, 13, 31, 14.5, col=col, col_o=col, id="wordmark-in-alto")
    (ico_x if alto == "x" else ico_condividi)(t, w - 16, 24, 15 if alto == "x" else 17, col, id="icona-in-alto")
    if conteggi:
        with t.gruppo("colonna-azioni"):
            for (fn, etich, yy) in zip((ico_cuore, ico_commento, ico_segnalibro), conteggi, (246, 297, 344)):
                fn(t, w - 20, yy * h / 424 if False else yy, 19, col)
                t.testo(etich, w - 20, yy + 23, 10.5, 500, col, ancora="middle", id="conteggio-" + etich)
    with t.gruppo("didascalia"):
        for i, r in enumerate(didascalia):
            t.testo(r, 13, h - 36 + i * 22, corpo_cap, 500, col, id=f"didascalia-riga-{i+1}")
    ico_condividi(t, w - 20, h - 22, 17, col, id="icona-condividi-basso")


def corsivo(t, righe, x, y, corpo, col="#FFFFFF", rot=-12, passo=None, id="scritta-corsiva", peso=400, skew=-10):
    """Scritta a mano (Small steps / Stessi studenti): Inter inclinata e ruotata, righe in colonna."""
    passo = passo or corpo * 1.25
    with t.gruppo(id, trasforma=f"translate({n(x)} {n(y)}) rotate({rot}) skewX({skew}) translate({n(-x)} {n(-y)})"):
        for i, r in enumerate(righe):
            t.testo(r, x + i * passo * 0.3, y + i * passo, corpo, peso, col, spaziatura=corpo * 0.04, id=f"{id}-riga-{i+1}")


def bandiera_uk(t, cx, cy, w, id="bandiera-regno-unito"):
    h = w * 0.62
    x, y = cx - w / 2, cy - h / 2
    cid = clip_rett(t, x, y, w, h, 2)
    with t.gruppo(id, clip=cid, trasforma=f"rotate(-4 {n(cx)} {n(cy)})"):
        t.rett(x, y, w, h, 0, fill="#1C3F94")
        t.path(f"M{n(x)} {n(y)}L{n(x+w)} {n(y+h)}M{n(x+w)} {n(y)}L{n(x)} {n(y+h)}", stroke="#FFFFFF", sw=h * 0.2, cap="butt")
        t.path(f"M{n(x)} {n(y)}L{n(x+w)} {n(y+h)}", stroke="#D0202E", sw=h * 0.07, cap="butt")
        t.path(f"M{n(x+w)} {n(y)}L{n(x)} {n(y+h)}", stroke="#D0202E", sw=h * 0.07, cap="butt")
        t.path(f"M{n(cx)} {n(y)}V{n(y+h)}M{n(x)} {n(cy)}H{n(x+w)}", stroke="#FFFFFF", sw=h * 0.34, cap="butt")
        t.path(f"M{n(cx)} {n(y)}V{n(y+h)}M{n(x)} {n(cy)}H{n(x+w)}", stroke="#D0202E", sw=h * 0.2, cap="butt")


def logo_mini(t, x, y, lato, id="logo-mini"):
    """App-icon piatta: quadrato blu notte con stella a 4 punte bianca (logo piccolo delle testate)."""
    t.rett(x, y, lato, lato, lato * 0.26, fill=t.sfumatura(["#123C9C", "#0A1E66"]), id=id)
    stella4(t, x + lato / 2, y + lato / 2, lato * 0.3, "#FFFFFF", id=id + "-stella", curva=0.2)


def pannello_chiaro(t, x, y, w, h, r=12, id="pannello", rad=None):
    """Scheda chiara di carosello: sfumatura azzurro pallido, filo bianco, ombra leggera."""
    t.rett(x, y, w, h, r, fill=t.sfumatura(["#E9F0FF", "#F4F8FF", "#EAF1FE"]), id=id, filtro=t.ombra(2, 10, "#4C7CE0", 0.12), stroke="#FFFFFF", sw=1.2,
           r_angoli=rad)


def intestazione_post(t, x, y, w=110, pag=None, corpo=11.5):
    logo_mini(t, x, y - 2, 17)
    wordmark(t, x + 22, y + 11, corpo, col=NAVY, col_o=BLU_T, id="wordmark-testata")
    if pag:
        t.testo(pag, x + w, y + 10, 8.5, 500, "#6B7280", ancora="end", id="numero-pagina")


class Origine:
    """with Origine(t, x0, y0): disegna in coordinate ASSOLUTE della sorgente dentro una tela grande come il riquadro."""
    def __init__(self, t, x0, y0, id="contenuto"):
        self.t, self.x0, self.y0, self.id = t, x0, y0, id

    def __enter__(self):
        self.t.add(f'<g id="{self.id}" transform="translate({-self.x0} {-self.y0})">')
        return self.t

    def __exit__(self, *e):
        self.t.add("</g>")


def scrim_basso(t, x, y, w, h, alto=70, col="#0A1226", op=0.55, id="velo-basso"):
    """Sfumatura scura in basso (come nei reel) per leggere visualizzazioni/didascalie."""
    t.rett(x, y + h - alto, w, alto, 0, fill=t.sfumatura([(0, col + "00"), (1, col)]), opacita=op, id=id)
