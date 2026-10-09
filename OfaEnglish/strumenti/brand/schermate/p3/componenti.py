"""
Componenti condivisi delle tre landing desktop (immagini 41, 45, 51 di design-concept).

Le pagine si disegnano in PIXEL DELL'IMMAGINE ORIGINALE (1536 x 1024) e `Pagina.svg()` le porta a un viewBox di
1440 x 960 (scala 0,9375): così le misure lette sugli ingrandimenti si scrivono come sono.
Testo = tracciati Inter (TelaCompatta: ogni lettera definita una volta e riusata con <use>), mai <text>.
Le fotografie restano raster (t.foto) e sono preparate da foto.py (testi/telefoni/sigillo cancellati).

Cosa uniformano/correggono rispetto agli originali AI:
  - menu "Prezz" tagliato -> "Prezzi"; nomi delle tab dei telefoni illeggibili -> Home / Studio / Statistiche (testo ricostruito);
  - telefoni con schermate vere del kit (Sei a rischio? / Domanda / Obiettivo raggiunto) disegnate pulite e simmetriche;
  - icone tonde e a griglia dello stesso set (non i glifi sbilenchi dell'AI); stessi pulsanti ovunque;
  - il sigillo del Politecnico non si riproduce: segnaposto circolare neutro (id sigillo-segnaposto).
"""
from __future__ import annotations

import importlib.util
import math
import pathlib
import re
import sys

QUI = pathlib.Path(__file__).resolve().parent
SCHERMATE = QUI.parent
sys.path.insert(0, str(SCHERMATE))
_spec = importlib.util.spec_from_file_location("ui_extra_p3", SCHERMATE / "ui" / "extra.py")
X = importlib.util.module_from_spec(_spec)
sys.modules["ui_extra_p3"] = X
_spec.loader.exec_module(X)
U = X.U
from ui import RADICE, BRAND, larghezza_testo, n  # noqa: E402

TelaCompatta = X.TelaCompatta
LOGO = RADICE / "brand/concept-svg/logo"
FOTO = QUI / "foto"
USCITA = RADICE / "brand/concept-svg/layout"
TAVOLE = RADICE / "brand/concept-svg/_tavole/p3"
SORGENTI = RADICE.parent / "design-concept"
FILE_SORGENTE = {41: "file_00000000c23c82108838e288ab528e67.png", 45: "file_00000000e55481f4afd0f6b1727320de.png",
                 51: "file_00000000fe4482108b4c6e950fe1b4ca.png"}

W, H = 1536, 1024
SC = 0.9375

# ---------------------------------------------------------------------------- colori (campionati sugli originali)
NAVY = "#0A1544"          # titoli
NAVY2 = "#17235A"
BLU = "#2B6BFF"           # blu dei titoli / pulsanti
BLU_BTN = "#2F6FF5"
BLU_SC = "#1F4FE0"
TESTO = "#3E4B70"         # testo di corpo
SOTTO = "#6B7794"
PALLIDO = "#EAF0FD"
ROSSO = "#F0343F"
ROSSO_P = "#FDE8E9"
VERDE = "#22B35E"
GIALLO = "#F5A623"


def corpo_per(testo: str, larghezza: float, peso: int = 600, spaziatura: float = 0.0) -> float:
    """Corpo (px) con cui `testo` risulta largo `larghezza` px."""
    return larghezza / larghezza_testo(testo, 1, peso, spaziatura)


def mix(a: str, b: str, k: float) -> str:
    return X.mix(a, b, k)


# ---------------------------------------------------------------------------- la pagina
class Pagina(TelaCompatta):
    def __init__(self, id: str, fondo: str | None = "#FFFFFF"):
        super().__init__(W, H, fondo=fondo, id=id)

    def svg(self) -> str:
        s = super().svg()
        s = re.sub(r'viewBox="[^"]*" width="[^"]*" height="[^"]*"', 'viewBox="0 0 1440 960" width="1440" height="960"', s, count=1)
        s = s.replace(f'<g id="{self.id}">', f'<g id="{self.id}" transform="scale({SC})">', 1)
        return s

    def testo(self, testo, *a, **k):
        return super().testo(testo.replace("'", "\u2019"), *a, **k)

    # -- scorciatoie
    def T(self, testo, x, y, corpo, peso=500, colore=NAVY, ancora="start", id=None, sp=0.0, opacita=None, larg=None):
        """Testo; se `larg` è dato il corpo è accordato a quella larghezza (px originali)."""
        if larg:
            corpo = corpo_per(testo, larg, peso, sp)
        return self.testo(testo, x, y, corpo, peso, colore, ancora, id=id, spaziatura=sp, opacita=opacita)

    def righe(self, righe, x, y, corpo, peso=400, colore=TESTO, passo=None, ancora="start", id=None, sp=0.0, larg=None):
        """Più righe già spezzate; `larg` accorda il corpo sulla riga più lunga."""
        if larg:
            corpo = corpo_per(max(righe, key=lambda r: larghezza_testo(r, 1, peso, sp)), larg, peso, sp)
        passo = passo or corpo * 1.35
        for i, r in enumerate(righe):
            self.testo(r, x, y + i * passo, corpo, peso, colore, ancora, id=(f"{id}-{i + 1}" if id else None), spaziatura=sp)

    def rich(self, parti, x, y, corpo, colore=TESTO, ancora="start", id=None):
        """Riga con pezzi di peso/colore diverso: parti = [(testo, peso, colore|None), ...]."""
        tot = sum(larghezza_testo(t, corpo, p) for t, p, _ in parti)
        cx = x - tot / 2 if ancora == "middle" else x - tot if ancora == "end" else x
        with self.gruppo(id or self.uid("riga")):
            for t, p, c in parti:
                cx += self.testo(t, cx, y, corpo, p, c or colore)
        return tot

    def vetro(self, x, y, w, h, r=18, fill="#FFFFFF", opacita=0.7, bordo="#FFFFFF", ombra=True, id=None, bordo_op=0.9):
        """Pannello di vetro chiaro: velo bianco, filo di luce e ombra morbida."""
        with self.gruppo(id or self.uid("vetro")):
            self.rett(x, y, w, h, r, fill=fill, opacita=opacita, filtro=self.ombra(8, 26, "#3A5BA8", 0.16) if ombra else None)
            self.rett(x + 0.5, y + 0.5, w - 1, h - 1, r, fill="none", stroke=bordo, sw=1.2, opacita=bordo_op)

    def sfondo_sfumato(self, x, y, w, h, colori, direzione=(0, 0, 0, 1), id=None, r=0):
        self.rett(x, y, w, h, r, fill=self.sfumatura(colori, *direzione), id=id)

    def foto_in(self, nome, x, y, w, h, r=0, id="foto", qualita=84):
        self.foto(str(FOTO / nome), x, y, w, h, r, id=id, qualita=qualita, max_px=900)


# ---------------------------------------------------------------------------- loghi
def logo_parola(t: Pagina, x, y, h, scuro=False, id="logo-addiofa"):
    """Parola-marchio AddiOFA (O con la stella) da brand/concept-svg/logo/wordmark-primario.svg; x,y angolo alto-sinistra, h altezza."""
    svg = (LOGO / "wordmark-primario.svg").read_text()
    if scuro:
        svg = svg.replace("#071438", "#FFFFFF")
    larg = h * 365 / 77
    t.inserisci_svg(svg, x, y, larg, id)
    return larg


def tile_app(t: Pagina, x, y, lato, id="icona-app"):
    """Tile dell'app con la stella (brand/concept-svg/logo/marchio-tile-porta.svg)."""
    t.inserisci_svg((LOGO / "marchio-tile-porta.svg").read_text(), x, y, lato, id)


def logo_orizzontale(t: Pagina, x, y, lato, scuro=False, id="logo", larg_testo=None):
    """Tile + AddiOFA scritto (come nelle landing 45 e 51): x,y alto-sinistra del tile."""
    with t.gruppo(id):
        tile_app(t, x, y, lato, id=f"{id}-icona")
        c1 = "#FFFFFF" if scuro else "#0B1D5B"
        c2 = "#FFFFFF" if scuro else BLU
        corpo = corpo_per("AddiOFA", larg_testo, 800) if larg_testo else lato * 0.68
        tx = x + lato * 1.12
        w1 = t.testo("Addi", tx, y + lato * 0.72, corpo, 800, c1, id=f"{id}-addi")
        t.testo("OFA", tx + w1, y + lato * 0.72, corpo, 800, c2, id=f"{id}-ofa")


# ---------------------------------------------------------------------------- pulsanti e chip
def freccia(t: Pagina, cx, cy, colore, lato=15, sp=2.0, id=None):
    t.icona("freccia-destra", cx - lato / 2, cy - lato / 2, lato, colore, sp, id=id)


def pulsante_pieno(t: Pagina, x, y, w, h, etichetta, corpo=15, fondo=BLU_BTN, colore="#FFFFFF", tondo=False, freccia_=True,
                   id="pulsante-primario", sfum=True, ombra=True, px=None):
    """Pulsante a pillola. tondo=True: freccia dentro un cerchio bianco a destra (41); altrimenti freccia accanto all'etichetta."""
    with t.gruppo(id):
        f = t.sfumatura([mix(fondo, "#FFFFFF", 0.14), fondo, mix(fondo, "#000000", 0.08)], 0, 0, 0, 1) if sfum else fondo
        t.rett(x, y, w, h, h / 2, fill=f, filtro=t.ombra(6, 14, fondo, 0.30) if ombra else None, id=f"{id}-forma")
        if tondo:
            t.testo(etichetta, x + h * 0.55, y + h / 2 + corpo * 0.36, corpo, 500, colore, id=f"{id}-testo")
            r = h * 0.38
            t.cerchio(x + w - r - h * 0.12, y + h / 2, r, fill="#FFFFFF", id=f"{id}-tondo")
            freccia(t, x + w - r - h * 0.12, y + h / 2, fondo, r * 0.95, 2.4)
        else:
            lw = larghezza_testo(etichetta, corpo, 600)
            ax = (corpo + 12) if freccia_ else 0
            sx = x + (w - lw - ax) / 2
            t.testo(etichetta, sx, y + h / 2 + corpo * 0.36, corpo, 600, colore, id=f"{id}-testo")
            if freccia_:
                freccia(t, sx + lw + 10 + corpo / 2, y + h / 2, colore, corpo + 1, 2.2)


def pulsante_contorno(t: Pagina, x, y, w, h, etichetta, corpo=15, colore=NAVY, bordo="#B9C2DA", icona=None, fondo="#FFFFFF",
                      opacita_fondo=0.85, id="pulsante-secondario", peso=500):
    with t.gruppo(id):
        t.rett(x, y, w, h, h / 2, fill=fondo, opacita=opacita_fondo, id=f"{id}-forma")
        t.rett(x + 0.5, y + 0.5, w - 1, h - 1, h / 2, fill="none", stroke=bordo, sw=1.3)
        lw = larghezza_testo(etichetta, corpo, peso)
        ax = (corpo + 14) if icona else 0
        sx = x + (w - lw - ax) / 2
        t.testo(etichetta, sx, y + h / 2 + corpo * 0.36, corpo, peso, colore, id=f"{id}-testo")
        if icona:
            t.icona(icona, sx + lw + 12, y + h / 2 - (corpo + 1) / 2, corpo + 1, colore, 2.1)


def chip_etichetta(t: Pagina, x, y, w, h, testo, corpo=9.5, fondo=PALLIDO, colore="#3659C8", freccia_=True, id="chip", sp=0.9):
    with t.gruppo(id):
        t.rett(x, y, w, h, h / 2, fill=fondo)
        px = x + 11
        if freccia_:
            t.icona("freccia-destra", px, y + h / 2 - 4.5, 9, colore, 2.8)
            px += 14
        t.testo(testo, px, y + h / 2 + corpo * 0.36, corpo, 600, colore, spaziatura=sp)


def icona_tonda(t: Pagina, nome, cx, cy, r, fondo=PALLIDO, colore=BLU, sp=2.1, id=None, riempi=None):
    with t.gruppo(id or f"icona-{nome}"):
        t.cerchio(cx, cy, r, fill=fondo)
        t.icona(nome, cx - r * 0.5, cy - r * 0.5, r, colore, sp, fill_pieno=riempi)


def icona_quadra(t: Pagina, nome, x, y, lato, fondo, colore, sp=2.0, id=None, r=None, riempi=None):
    with t.gruppo(id or f"icona-{nome}"):
        t.rett(x, y, lato, lato, r or lato * 0.3, fill=fondo)
        t.icona(nome, x + lato * 0.22, y + lato * 0.22, lato * 0.56, colore, sp, fill_pieno=riempi)


def bolla(t: Pagina, x, y, w, h, testo, icona="spunta", corpo=11.5, coda=None, rot=0, id=None, colore_icona=BLU):
    """Bolla flottante bianca con icona piccola e testo (45: Quiz interattivi, Statistiche…). coda = 'sx'|'dx'|None."""
    ic0 = h * 0.46
    w = h * 0.3 + ic0 + 8 + larghezza_testo(testo, corpo, 500) + h * 0.5
    tr = f"rotate({rot} {n(x + w / 2)} {n(y + h / 2)})" if rot else None
    with t.gruppo(id or "bolla-" + testo.lower().replace(" ", "-").replace("'", ""), trasforma=tr):
        t.rett(x, y, w, h, h / 2, fill="#FFFFFF", opacita=0.96, filtro=t.ombra(5, 16, "#2B4FA0", 0.20))
        if coda == "sx":
            t.path(f"M{n(x + h * 0.55)} {n(y + h - 1)}l-{n(h * 0.28)} {n(h * 0.34)}l{n(h * 0.5)} -{n(h * 0.3)}z", fill="#FFFFFF")
        elif coda == "dx":
            t.path(f"M{n(x + w - h * 0.55)} {n(y + h - 1)}l{n(h * 0.28)} {n(h * 0.34)}l-{n(h * 0.5)} -{n(h * 0.3)}z", fill="#FFFFFF")
        ic = h * 0.46
        t.rett(x + h * 0.3, y + h / 2 - ic / 2, ic, ic, ic * 0.3, fill="#E5EEFF")
        t.icona(icona, x + h * 0.3 + ic * 0.2, y + h / 2 - ic * 0.3, ic * 0.6, colore_icona, 2.6)
        t.testo(testo, x + h * 0.3 + ic + 8, y + h / 2 + corpo * 0.36, corpo, 500, NAVY2)


# ---------------------------------------------------------------------------- grafiche piccole
def volto(t: Pagina, cx, cy, r, sfondo, capelli, pelle, camicia, lunghi=True, id="volto"):
    """Avatar illustrato (al posto delle foto sfocate): sfondo tondo, capelli, viso, spalle, anello bianco."""
    cid = t.uid("cv")
    t.defs.append(f'<clipPath id="{cid}"><circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}"/></clipPath>')
    with t.gruppo(id):
        t.cerchio(cx, cy, r + 1.6, fill="#FFFFFF")
        with t.gruppo(id + "-contenuto", clip=cid):
            t.cerchio(cx, cy, r, fill=sfondo)
            if lunghi:
                t.rett(cx - r * 0.5, cy - r * 0.55, r * 1.0, r * 1.45, r * 0.45, fill=capelli)
            t.path(f"M{n(cx - r * 0.95)} {n(cy + r * 1.1)}c0 -{n(r * 0.55)} {n(r * 0.4)} -{n(r * 0.75)} {n(r * 0.95)} -{n(r * 0.75)}"
                   f"s{n(r * 0.95)} {n(r * 0.2)} {n(r * 0.95)} {n(r * 0.75)}z", fill=camicia)
            t.rett(cx - r * 0.13, cy + r * 0.12, r * 0.26, r * 0.4, 1, fill=mix(pelle, "#000000", 0.08))
            t.ellisse(cx, cy - r * 0.08, r * 0.36, r * 0.46, fill=pelle)
            t.path(f"M{n(cx - r * 0.42)} {n(cy - r * 0.12)}c0 -{n(r * 0.5)} {n(r * 0.84)} -{n(r * 0.5)} {n(r * 0.84)} 0c-{n(r * 0.2)} -{n(r * 0.22)} -{n(r * 0.6)} -{n(r * 0.2)} -{n(r * 0.84)} 0z",
                   fill=capelli)


def avatar_gruppo(t: Pagina, x0, cy, r, passo, serie, id="avatar-studenti"):
    with t.gruppo(id):
        for i, (sf, cap, pel, cam) in enumerate(serie):
            volto(t, x0 + i * passo, cy, r, sf, cap, pel, cam, id=f"studente-{i + 1}")


def gauge(t: Pagina, cx, cy, r, valore=0.82, sp=None, colore=ROSSO, chiaro="#FF8C93", vuoto="#E2E7F2", puntino=True, id="misuratore",
          inizio=205, fine=-25, alone=True):
    """Arco aperto (da `inizio` a `fine` gradi, senso orario) pieno fino a `valore`: il misuratore rischio delle landing."""
    sp = sp or r * 0.22
    tot = inizio - fine

    def pt(a):
        return cx + r * math.cos(math.radians(a)), cy - r * math.sin(math.radians(a))

    def arco(v0, v1):
        a0, a1 = inizio - tot * v0, inizio - tot * v1
        (x0, y0), (x1, y1) = pt(a0), pt(a1)
        grande = 1 if tot * (v1 - v0) > 180 else 0
        return f"M{n(x0)} {n(y0)}A{n(r)} {n(r)} 0 {grande} 1 {n(x1)} {n(y1)}"

    with t.gruppo(id):
        t.path(arco(0, 1), stroke=vuoto, sw=sp, id=f"{id}-fondo")
        g = t.sfumatura([chiaro, colore], cx - r, cy, cx + r, cy, userspace=True)
        t.path(arco(0, valore), stroke=g, sw=sp, id=f"{id}-valore")
        if puntino:
            px, py = pt(inizio - tot * valore)
            if alone:
                t.cerchio(px, py, sp * 1.1, fill=t.radiale([(0, colore, 0.35), (1, colore, 0)]))
            t.cerchio(px, py, sp * 0.6, fill="#FFFFFF", filtro=t.ombra(1, 3, colore, 0.35))
            t.cerchio(px, py, sp * 0.36, fill=colore)


def anello(t: Pagina, cx, cy, r, valore, sp, colore=BLU_SC, chiaro="#8FB2FF", vuoto="#E6ECF8", id="anello-percentuale"):
    """Anello di avanzamento (dall'alto, in senso orario), con testa arrotondata."""
    with t.gruppo(id):
        t.cerchio(cx, cy, r, fill="none", stroke=vuoto, sw=sp)
        a = 2 * math.pi * valore
        x1, y1 = cx + r * math.sin(a), cy - r * math.cos(a)
        g = t.sfumatura([chiaro, colore], cx - r, cy + r, cx + r, cy - r, userspace=True)
        t.path(f"M{n(cx)} {n(cy - r)}A{n(r)} {n(r)} 0 {1 if valore > 0.5 else 0} 1 {n(x1)} {n(y1)}", stroke=g, sw=sp, id=f"{id}-valore")


def sigillo_segnaposto(t: Pagina, cx, cy, r, colore="#C9CFDA", opacita=0.9):
    with t.gruppo("sigillo-segnaposto", opacita=opacita):
        t.cerchio(cx, cy, r, fill="none", stroke=colore, sw=2.2)
        t.cerchio(cx, cy, r * 0.62, fill="none", stroke=colore, sw=1.2)


def sagome_sfondo(t: Pagina, x, y, w, h, colore="#DDE6F6", opacita=0.6, n_picchi=6, seme=1, id="sagome-edifici"):
    """Profilo di guglie/edifici molto sfumato (fondo delle sezioni chiare): triangoli che sfumano verso l'alto."""
    import random
    rnd = random.Random(seme)
    g = t.sfumatura([(0, colore + "00"), (1, colore)], 0, 0, 0, 1) if False else None
    with t.gruppo(id, opacita=opacita):
        px = x - 20
        while px < x + w:
            bw = rnd.uniform(w / (n_picchi * 1.1), w / (n_picchi * 0.6))
            bh = rnd.uniform(h * 0.45, h)
            gid = t.uid("sg")
            t.defs.append(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{colore}" stop-opacity="0"/>'
                          f'<stop offset="1" stop-color="{colore}" stop-opacity="1"/></linearGradient>')
            t.path(f"M{n(px)} {n(y + h)}L{n(px + bw / 2)} {n(y + h - bh)}L{n(px + bw)} {n(y + h)}z", fill=f"url(#{gid})")
            px += bw * rnd.uniform(0.55, 0.9)


# ---------------------------------------------------------------------------- telefono
def telefono(t: Pagina, x, y, w, h, schermo, rot=0, id="telefono", ombra=True, scuro=False, profondo=True, nome_schermo=None):
    """Telefono con bordo d'acciaio e schermo (funzione `schermo(t, w_pt, h_pt)` che disegna in punti 390 x (h/w*390))."""
    cx, cy = x + w / 2, y + h / 2
    tr = f"rotate({n(rot)} {n(cx)} {n(cy)})" if rot else None
    r = w * 0.17
    bz = w * 0.028
    k = (w - 2 * bz) / 390
    hp = (h - 2 * bz) / k
    cid = t.uid("cs")
    t.defs.append(f'<clipPath id="{cid}"><rect x="{n(x + bz)}" y="{n(y + bz)}" width="{n(w - 2 * bz)}" height="{n(h - 2 * bz)}" rx="{n(r - bz)}"/></clipPath>')
    with t.gruppo(id, trasforma=tr):
        if ombra:
            t.rett(x + w * 0.03, y + h * 0.04, w * 0.96, h * 0.97, r, fill="#1D3A8C", opacita=0.28, filtro=t.sfoca(w * 0.07))
        # corpo: acciaio azzurro, bordo luminoso a sinistra
        corpo = t.sfumatura(["#E9EEF8", "#8D9BBE", "#3A4468", "#8F9DC0"], 0, 0, 1, 1)
        t.rett(x - w * 0.012, y - h * 0.004, w * 1.024, h * 1.008, r * 1.04, fill=corpo, id=f"{id}-acciaio")
        t.rett(x, y, w, h, r, fill="#10162E", id=f"{id}-cornice")
        with t.gruppo(f"{id}-schermo", clip=cid):
            t.rett(x + bz, y + bz, w - 2 * bz, h - 2 * bz, 0, fill="#FFFFFF")
            with t.gruppo(f"{id}-contenuto", trasforma=f"translate({n(x + bz)} {n(y + bz)}) scale({n(k)})"):
                schermo(t, 390, hp)
        # isola dinamica
        iw = w * 0.30
        t.rett(x + w / 2 - iw / 2, y + bz + w * 0.04, iw, w * 0.075, w * 0.037, fill="#0A0F22", id=f"{id}-isola")
        # riflesso sul vetro
        t.path(f"M{n(x + bz)} {n(y + bz + h * 0.02)}L{n(x + w * 0.55)} {n(y + bz)}L{n(x + bz)} {n(y + h * 0.28)}z", fill="#FFFFFF", opacita=0.07)


# ---- schermate semplificate (punti telefono; ricalcano le schermate del kit rosso in brand/concept-svg/schermate/funnel-rosso)
def _stato(t: Pagina, w, scuro=False):
    c = "#FFFFFF" if scuro else NAVY
    t.testo("9:41", 36, 44, 15, 700, c)
    for i, h_ in enumerate((5, 8, 11, 14)):
        t.rett(w - 96 + i * 5, 44 - h_, 3.4, h_, 1, fill=c)
    t.icona("wifi", w - 70, 28, 17, c, 2.2)
    t.rett(w - 46, 30, 26, 13, 4, fill="none", stroke=c, sw=1.3, opacita=0.5)
    t.rett(w - 44, 32, 20, 9, 2.4, fill=c)


def _nav(t: Pagina, w, h, attiva=0, kit_col=ROSSO):
    y = h - 86
    t.rett(0, y, w, 86, 0, fill="#FFFFFF")
    t.linea(0, y, w, y, "#E8ECF4", 1.5)
    voci = [("casa", "Home"), ("libro", "Studio"), ("grafico", "Statistiche")]
    m = w / 3
    for i, (ic, et) in enumerate(voci):
        cx = m * i + m / 2
        col = BLU_BTN if i == attiva else "#8A94A8"
        t.icona(ic, cx - 15, y + 14, 30, col, 2.2)
        t.testo(et, cx, y + 62, 14, 600 if i == attiva else 500, col, "middle")
    t.rett(w / 2 - 70, h - 14, 140, 6, 3, fill=NAVY)


def schermo_rischio(t: Pagina, w, h):
    """Sei a rischio? 82% – home del kit rosso."""
    _stato(t, w)
    tile_app(t, w / 2 - 58, 62, 34, id="app-icona")
    t.testo("AddiOFA", w / 2 - 14, 88, 24, 800, NAVY)
    t.T("Sei a rischio?", w / 2, 190, 38, 800, NAVY, "middle", id="titolo-schermo")
    gauge(t, w / 2, 340, 118, 0.82, sp=26, id="misuratore-rischio")
    t.T("82%", w / 2, 360, 58, 800, ROSSO, "middle", id="valore-rischio")
    t.T("Probabilità di", w / 2, 432, 20, 600, NAVY, "middle")
    t.T("non superare l'OFA", w / 2, 460, 20, 600, ROSSO, "middle")
    # card rischio
    t.rett(26, 496, w - 52, 104, 22, fill="#FDECEC", stroke="#F6C9CC", sw=1.5, id="card-rischio-economico")
    t.rett(48, 518, 68, 60, 14, fill="#FFFFFF", opacita=0.9)
    t.icona("euro", 60, 526, 44, ROSSO, 2.4)
    t.T("Rischi di perdere", 134, 546, 19, 500, SOTTO)
    t.T("circa 30€", 134, 576, 26, 800, ROSSO)
    t.icona("info", w - 66, 520, 24, "#9AA3B8", 2)
    t.rett(26, h - 226, w - 52, 82, 24, fill=ROSSO, filtro=t.ombra(8, 18, ROSSO, 0.3), id="pulsante-inizia-a-studiare")
    t.T("Inizia a studiare", w / 2, h - 226 + 51, 25, 700, "#FFFFFF", "middle")
    _nav(t, w, h, 0)


def schermo_domanda(t: Pagina, w, h):
    _stato(t, w)
    t.icona("chevron-sinistra", 30, 66, 26, NAVY, 2.8)
    for i in range(5):
        t.rett(70 + i * 56, 76, 52, 8, 4, fill=ROSSO if i < 2 else "#E6EAF2")
    t.T("Domanda 3 di 10", 30, 128, 21, 500, SOTTO, id="progresso-quiz")
    t.T("Choose the correct form:", 30, 176, 24, 500, TESTO)
    t.T("She ____ to Milan", 30, 222, 33, 800, NAVY)
    t.T("every day.", 30, 262, 33, 800, NAVY)
    opz = [("go", False), ("goes", True), ("going", False), ("to go", False)]
    for i, (o, sel) in enumerate(opz):
        y = 300 + i * 74
        t.rett(24, y, w - 48, 62, 18, fill="#FEF1F1" if sel else "#FFFFFF", stroke="#E88F95" if sel else "#E4E8F0", sw=2 if sel else 1.6, id=f"opzione-{o.replace(' ', '-')}")
        if sel:
            t.cerchio(62, y + 31, 13, fill="#FFFFFF", stroke=ROSSO, sw=3)
            t.cerchio(62, y + 31, 6, fill=ROSSO)
        else:
            t.cerchio(62, y + 31, 13, fill="#FFFFFF", stroke="#CCD3E0", sw=2)
        t.T(o, 96, y + 40, 24, 500, NAVY)
    t.rett(26, h - 190, w - 52, 78, 24, fill=ROSSO, filtro=t.ombra(8, 18, ROSSO, 0.3), id="pulsante-avanti")
    t.T("Avanti", w / 2, h - 190 + 49, 25, 700, "#FFFFFF", "middle")
    _nav(t, w, h, 1)


def schermo_obiettivo(t: Pagina, w, h):
    _stato(t, w)
    # documento con spunta e coriandoli
    cx, cy = w / 2, 225
    t.rett(cx - 78, cy - 100, 156, 196, 20, fill="#E8EEFB", filtro=t.ombra(6, 18, "#4C70C8", 0.2))
    for i, lw in enumerate((100, 100, 70)):
        t.rett(cx - 50, cy - 62 + i * 26, lw, 11, 5.5, fill="#C5D2EE")
    t.cerchio(cx + 56, cy + 62, 44, fill=VERDE, filtro=t.ombra(4, 12, VERDE, 0.35), id="spunta-obiettivo")
    t.icona("spunta", cx + 56 - 25, cy + 62 - 25, 50, "#FFFFFF", 4.5)
    for (dx, dy, c, rot) in [(-120, -70, ROSSO, 20), (-90, -120, GIALLO, -30), (100, -110, GIALLO, 30), (130, -30, ROSSO, 60),
                             (-130, 20, ROSSO, -40), (-60, 100, GIALLO, 10), (150, 40, GIALLO, 0)]:
        t.path(f"M{n(cx + dx - 9)} {n(cy + dy)}l18 0", stroke=c, sw=8, opacita=0.95, id=f"coriandolo-{abs(dx)}-{abs(dy)}")
    t.T("Obiettivo raggiunto!", w / 2, 410, 33, 800, NAVY, "middle", id="titolo-schermo", larg=340)
    t.T("Puoi iscriverti al", w / 2, 458, 24, 400, TESTO, "middle")
    t.T("secondo anno!", w / 2, 490, 24, 400, TESTO, "middle")
    t.rett(26, h - 190, w - 52, 78, 24, fill=BLU_BTN, filtro=t.ombra(8, 18, BLU_BTN, 0.3), id="pulsante-dashboard")
    t.T("Vai alla dashboard", w / 2, h - 190 + 49, 25, 700, "#FFFFFF", "middle")
    _nav(t, w, h, 0, BLU_BTN)


def schermo_piano(t: Pagina, w, h):
    """Schermata di 'Piano di studio' (il telefono di sinistra, in gran parte coperto)."""
    _stato(t, w)
    t.T("Il tuo piano", 30, 110, 30, 800, NAVY)
    t.T("Politecnico di Milano", 30, 142, 18, 500, SOTTO)
    voci = [("Lezioni su misura", True), ("Quiz mirati", True), ("Simulazioni ufficiali", False), ("Ripasso finale", False)]
    for i, (v, ok) in enumerate(voci):
        y = 190 + i * 96
        t.rett(24, y, w - 48, 78, 20, fill="#F6F8FD", stroke="#E3E8F3", sw=1.5)
        t.cerchio(66, y + 39, 20, fill="#DDF4E6" if ok else "#E9EEFA")
        t.icona("spunta" if ok else "orologio", 54, y + 27, 24, VERDE if ok else BLU, 2.8)
        t.T(v, 104, y + 47, 22, 600, NAVY)
    t.rett(26, h - 190, w - 52, 78, 24, fill=BLU_BTN)
    t.T("Continua", w / 2, h - 190 + 49, 25, 700, "#FFFFFF", "middle")
    _nav(t, w, h, 1, BLU_BTN)


AVATAR_45 = [("#CFE0F5", "#2B1E1B", "#E6B896", "#9FC0E8"), ("#C9C58A", "#1C1512", "#E2B08C", "#D8D2C8"),
             ("#8DA98B", "#241A17", "#E6B896", "#2A4A7A"), ("#D86F63", "#150F0F", "#E7BC9D", "#14264E")]
AVATAR_51 = [("#D7D9DE", "#141214", "#E4B391", "#3A3A44"), ("#B7C0A2", "#6F5A44", "#E7BE9C", "#C8C9D4"),
             ("#7FA07A", "#1A1514", "#E6B994", "#1E3350"), ("#E99B6F", "#110C0C", "#E8BE9E", "#161A2E")]


# ---------------------------------------------------------------------------- utilità di uscita
def salva_landing(t: Pagina, cartella: str, nome: str) -> pathlib.Path:
    p = USCITA / cartella / nome
    t.salva(p)
    return p


def tavola(svg_path: pathlib.Path, nimg: int, uscita: pathlib.Path, k: float = 1.0):
    """Tavola originale | disegno | differenza."""
    import numpy as np
    from PIL import Image
    sys.path.insert(0, str(RADICE / "strumenti/brand"))
    from render import Renderer, confronta
    orig = Image.open(SORGENTI / FILE_SORGENTE[nimg]).convert("RGB")
    W2, H2 = int(orig.width * k), int(orig.height * k)
    svg = svg_path.read_text()
    svg2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W2}" height="{H2}"', svg, count=1)
    with Renderer() as r:
        im = r.svg(svg2, W2, H2, fondo="#FFFFFF")
    a = np.asarray(orig.resize((W2, H2), Image.LANCZOS)).astype(float)
    b = np.asarray(im.convert("RGB")).astype(float)
    m = confronta(a, b)
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255)
    d = np.stack([255 - diff] * 3, axis=2)
    tv = Image.new("RGB", (W2 * 3 + 24, H2), (255, 255, 255))
    tv.paste(Image.fromarray(a.astype(np.uint8)), (0, 0))
    tv.paste(Image.fromarray(b.astype(np.uint8)), (W2 + 12, 0))
    tv.paste(Image.fromarray(d.astype(np.uint8)), (2 * W2 + 24, 0))
    uscita.parent.mkdir(parents=True, exist_ok=True)
    tv.save(uscita)
    im.convert("RGB").save(uscita.with_name(uscita.stem + "-solo.png"))
    return m


def a_mano(t: Pagina, righe, cx, cy, rot=-12, corpo=15, colore="#2B4C9E", passo=None, id="scritta-a-mano", peso=400, inclina=-9):
    """Scritta a mano rifatta con Inter inclinato (il corsivo dell'originale non esiste nel kit): righe centrate su (cx, cy)."""
    passo = passo or corpo * 1.3
    with t.gruppo(id, trasforma=f"translate({n(cx)} {n(cy)}) rotate({n(rot)}) skewX({n(inclina)})"):
        for j, r in enumerate(righe):
            t.testo(r, 0, (j - (len(righe) - 1) / 2) * passo + corpo * 0.35, corpo, peso, colore, "middle", id=f"{id}-{j + 1}")


def maschera_dissolvenza(t: Pagina, x0, x1, y0, y1, a0=0.0, a1=1.0, id=None) -> str:
    """Maschera rettangolare con rampa orizzontale di trasparenza da x0 (alpha a0) a x1 (alpha a1); restituisce l'id."""
    mid = id or t.uid("mk")
    gid = mid + "-g"
    t.defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{n(x0)}" y1="0" x2="{n(x1)}" y2="0">'
                  f'<stop offset="0" stop-color="#FFF" stop-opacity="{n(a0)}"/><stop offset="1" stop-color="#FFF" stop-opacity="{n(a1)}"/></linearGradient>')
    t.defs.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-10" y="-10" width="{W + 20}" height="{H + 20}">'
                  f'<rect x="-10" y="-10" width="{W + 20}" height="{H + 20}" fill="url(#{gid})"/></mask>')
    return mid


class con_maschera:
    def __init__(self, t, mid, id=None):
        self.t, self.mid, self.id = t, mid, id

    def __enter__(self):
        self.t.add(f'<g mask="url(#{self.mid})"' + (f' id="{self.id}"' if self.id else "") + ">")

    def __exit__(self, *e):
        self.t.add("</g>")
