"""
s2 · componenti comuni delle schermate delle immagini 5, 22, 25, 49 (design-concept).

Si disegna in PIXEL DEL RITAGLIO ORIGINALE (la sola parte bianca di ogni telefono, con coordinate locali: 0,0 = angolo in
alto a sinistra del ritaglio). Le funzioni di s8/componenti.py (T testo, R rettangolo, C cerchio, L linea, I icona, nav,
barra di stato...) lavorano già così; qui si aggiungono: registro dei ritagli (SCHERMATE), `nuova()` con angoli arrotondati e
fondo trasparente, componenti ripetuti (avatar disegnati, righe, chip, nav a 4 voci, ecc.), `chiudi()`.

Avatar: nelle immagini sono fotografie di volti generati; qui sono avatar vettoriali neutri (testa, capelli, spalle) con id
`avatar-*`, perché una foto di 28 px non si può ridisegnare e un avatar disegnato si può ricolorare. Dichiarato nel rapporto.
"""
from __future__ import annotations

import importlib.util
import json
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
import ui  # noqa: E402
from ui import (Tela, INK, GRIGIO, LINEA, BLU, BLU_FORTE, BLU_PALLIDO, ROSSO, VERDE, GIALLO, KIT, n, larghezza_testo,  # noqa: E402,F401
                RADICE)

# s8/componenti.py sotto un altro nome (s1 ha già un modulo `componenti`)
_sp = importlib.util.spec_from_file_location("s8comp", QUI.parent / "s8" / "componenti.py")
s8 = importlib.util.module_from_spec(_sp); sys.modules["s8comp"] = s8; _sp.loader.exec_module(s8)
from s8comp import (T, R, C, L, I, fit, ombra, barra_stato, indicatore_home, logo, campanella, info, nav,  # noqa: E402,F401
                    pulsante_azione, tile_icona, barra_fattore, STATI)

ORIG = RADICE / "fonti" / "design-concept"
SORG = {5: "file_00000000106881f4928db217ddf2162e.jpg", 22: "file_00000000715481f49fb2ead59f0c4fa8.png",
        25: "file_0000000079808210b70464a09e79ef88.png", 49: "file_00000000fac08210954140c04c3f104a.png"}
CART = {5: "05-schermate-onboarding-invito", 22: "22-schermate-sfide-profilo", 25: "25-flusso-rischio",
        49: "49-schermate-esplora-atlas-noi-agora"}
OUT = RADICE / "brand/concept-svg/schermate"
TAVOLE = RADICE / "brand/concept-svg/_tavole/s2"
RAPPORTO = RADICE / "brand/concept-svg/_rapporti/s2.json"
SCRATCH = pathlib.Path("/tmp/claude-0/-home-user-AddiOfa/553cbc19-7099-5f91-95ed-46eecd1a1a4a/scratchpad")

# chiave -> (immagine, (x0,y0,x1,y1) nella sorgente, raggio angoli px, nome file)
SCHERMATE: dict[str, tuple] = {}


def reg(im, nome, box, r=16):
    SCHERMATE[f"{im:02d}-{nome}"] = (im, box, r, nome)


def sorgente(im: int):
    from PIL import Image
    return Image.open(ORIG / SORG[im]).convert("RGB")


def ritaglio(chiave: str):
    im, box, r, nome = SCHERMATE[chiave]
    return sorgente(im).crop(box)


def percorso_svg(chiave: str) -> pathlib.Path:
    im, box, r, nome = SCHERMATE[chiave]
    return OUT / CART[im] / f"{nome}.svg"


def nuova(chiave: str, fondo: str = "#FFFFFF") -> Tela:
    im, (x0, y0, x1, y1), r, nome = SCHERMATE[chiave]
    t = Tela.da_originale(x1 - x0, y1 - y0, None, id=f"schermata-{nome}")
    t.chiave = chiave
    t.W, t.H = x1 - x0, y1 - y0
    R(t, 0, 0, t.W, t.H, r, fondo, id="schermata-fondo")
    return t


def chiudi(t: Tela):
    p = percorso_svg(t.chiave)
    t.salva(p)
    print(p)
    return p


# ---------------------------------------------------------------------------- testo a larghezza misurata
def TL(t, testo, x, y, larg, peso=400, colore=INK, ancora="start", id=None, **kw):
    """Testo con corpo tarato sulla larghezza misurata (px del ritaglio)."""
    return T(t, testo, x, y, None, peso, colore, ancora, id=id, larg=larg, **kw)


def righe_t(t, testi, x, y, corpo, passo, peso=400, colore=GRIGIO, ancora="start", id="testo", larg=None):
    for i, s in enumerate(testi):
        T(t, s, x, y + i * passo, corpo, peso, colore, ancora, id=f"{id}-{i + 1}", larg=(larg[i] if larg else None))


# ---------------------------------------------------------------------------- avatar vettoriali
def avatar(t, cx, cy, r, pelle="#E8B796", capelli="#3A2A22", camicia="#3B4A6B", sfondo="#DDE6F3", stile="corto", id="avatar",
           bordo=None):
    """Busto stilizzato in un tondo: testa, capelli (corto | lungo | raccolto | riccio), spalle."""
    cid = t.uid("av")
    t.defs.append(f'<clipPath id="{cid}"><circle cx="{n(t.p(cx))}" cy="{n(t.p(cy))}" r="{n(t.p(r))}"/></clipPath>')
    with t.gruppo(id):
        C(t, cx, cy, r, sfondo, id=f"{id}-fondo")
        t.add(f'<g clip-path="url(#{cid})">')
        if stile in ("lungo", "raccolto"):
            R(t, cx - r * 0.5, cy - r * 0.28, r * 1.0, r * 1.1, r * 0.4, capelli, id=f"{id}-capelli-dietro")
        # spalle
        t.path(f"M{n(t.p(cx - r * 0.95))} {n(t.p(cy + r * 1.05))}C{n(t.p(cx - r * 0.9))} {n(t.p(cy + r * 0.5))} {n(t.p(cx - r * 0.45))} {n(t.p(cy + r * 0.42))} {n(t.p(cx))} {n(t.p(cy + r * 0.42))}"
               f"C{n(t.p(cx + r * 0.45))} {n(t.p(cy + r * 0.42))} {n(t.p(cx + r * 0.9))} {n(t.p(cy + r * 0.5))} {n(t.p(cx + r * 0.95))} {n(t.p(cy + r * 1.05))}z",
               fill=camicia, id=f"{id}-spalle")
        R(t, cx - r * 0.13, cy + r * 0.2, r * 0.26, r * 0.3, r * 0.08, pelle, id=f"{id}-collo")
        t.ellisse(t.p(cx), t.p(cy - r * 0.1), t.p(r * 0.31), t.p(r * 0.38), fill=pelle, id=f"{id}-testa")
        # capelli
        if stile == "corto":
            t.path(f"M{n(t.p(cx - r * 0.33))} {n(t.p(cy - r * 0.1))}C{n(t.p(cx - r * 0.4))} {n(t.p(cy - r * 0.55))} {n(t.p(cx + r * 0.4))} {n(t.p(cy - r * 0.55))} {n(t.p(cx + r * 0.33))} {n(t.p(cy - r * 0.1))}"
                   f"C{n(t.p(cx + r * 0.2))} {n(t.p(cy - r * 0.3))} {n(t.p(cx - r * 0.2))} {n(t.p(cy - r * 0.3))} {n(t.p(cx - r * 0.33))} {n(t.p(cy - r * 0.1))}z", fill=capelli, id=f"{id}-capelli")
        elif stile == "riccio":
            for dx, dy, rr in ((-0.22, -0.4, 0.2), (0, -0.5, 0.22), (0.22, -0.4, 0.2), (-0.3, -0.25, 0.15), (0.3, -0.25, 0.15)):
                C(t, cx + r * dx, cy + r * dy, r * rr, capelli)
        else:
            t.path(f"M{n(t.p(cx - r * 0.36))} {n(t.p(cy + r * 0.05))}C{n(t.p(cx - r * 0.45))} {n(t.p(cy - r * 0.62))} {n(t.p(cx + r * 0.45))} {n(t.p(cy - r * 0.62))} {n(t.p(cx + r * 0.36))} {n(t.p(cy + r * 0.05))}"
                   f"C{n(t.p(cx + r * 0.3))} {n(t.p(cy - r * 0.25))} {n(t.p(cx + r * 0.1))} {n(t.p(cy - r * 0.42))} {n(t.p(cx - r * 0.1))} {n(t.p(cy - r * 0.38))}"
                   f"C{n(t.p(cx - r * 0.25))} {n(t.p(cy - r * 0.3))} {n(t.p(cx - r * 0.33))} {n(t.p(cy - r * 0.2))} {n(t.p(cx - r * 0.36))} {n(t.p(cy + r * 0.05))}z", fill=capelli, id=f"{id}-capelli")
        t.add("</g>")
        if bordo:
            C(t, cx, cy, r, "none", stroke=bordo, sw=max(1, r * 0.08))


PERSONE = {  # nome -> parametri dell'avatar (tutti disegnati, nessun volto reale)
    "m1": dict(pelle="#D9A383", capelli="#2B1F1A", camicia="#2F3E5E", sfondo="#D9E4F4", stile="corto"),
    "f1": dict(pelle="#EFC3A5", capelli="#4A2E22", camicia="#E9EEF7", sfondo="#E6ECF6", stile="lungo"),
    "f2": dict(pelle="#D8A88A", capelli="#1E1714", camicia="#27324F", sfondo="#DCE5F3", stile="lungo"),
    "m2": dict(pelle="#E2B596", capelli="#3B2A20", camicia="#3C4A6A", sfondo="#E3E9F2", stile="corto"),
    "m3": dict(pelle="#C99674", capelli="#1F1814", camicia="#5B6580", sfondo="#D4DDEC", stile="corto"),
    "m4": dict(pelle="#D7A584", capelli="#2A1D17", camicia="#1F2C4A", sfondo="#E1E8F4", stile="riccio"),
    "f3": dict(pelle="#EDBF9F", capelli="#5A3A28", camicia="#8590AA", sfondo="#E9EDF5", stile="raccolto"),
}


def persona(t, nome, cx, cy, r, id=None, bordo=None):
    avatar(t, cx, cy, r, id=id or f"avatar-{nome}", bordo=bordo, **PERSONE[nome])


def avatar_neutro(t, cx, cy, r, fondo="#D8E0EC", colore="#7B8DB0", id="avatar-neutro"):
    """Sagoma grigio-blu (utente senza foto)."""
    with t.gruppo(id):
        C(t, cx, cy, r, fondo)
        cid = t.uid("avn")
        t.defs.append(f'<clipPath id="{cid}"><circle cx="{n(t.p(cx))}" cy="{n(t.p(cy))}" r="{n(t.p(r))}"/></clipPath>')
        t.add(f'<g clip-path="url(#{cid})">')
        C(t, cx, cy - r * 0.22, r * 0.3, colore)
        t.ellisse(t.p(cx), t.p(cy + r * 0.78), t.p(r * 0.62), t.p(r * 0.5), fill=colore)
        t.add("</g>")


# ---------------------------------------------------------------------------- bottoni e simili
ROSSO_B = "#F22938"


def pulsante_rosso(t, x, y, w, h, etichetta, corpo, id="pulsante-primario", freccia=False, larg=None, icona_sx=None, r=None, x_testo=None):
    r = r if r is not None else h * 0.3
    with t.gruppo(id):
        R(t, x, y, w, h, r, t.sfumatura(["#F43540", "#EE2433"]), id=f"{id}-fondo", filtro=t.ombra(t.p(h * 0.07), t.p(h * 0.2), "#E11D2B", 0.28))
        lw = larghezza_testo(etichetta, t.p(corpo), 600) / t.k if larg is None else larg
        cx = x + w / 2 - (corpo * 0.7 if freccia else 0) + (corpo * 0.9 if icona_sx else 0)
        if etichetta:
            T(t, etichetta, (x_testo if x_testo is not None else cx - lw / 2), y + h / 2 + corpo * 0.36, corpo, 600, "#FFFFFF", id=f"{id}-testo", larg=larg)
        if freccia:
            I(t, "chevron-destra", x + w - h * 0.5, y + h / 2, h * 0.3, "#FFFFFF", 2.4)
        if icona_sx:
            I(t, icona_sx, cx - lw / 2 - corpo * 1.05, y + h / 2, corpo * 1.25, "#FFFFFF", 2.2)


def pulsante_blu(t, x, y, w, h, etichetta, corpo, id="pulsante-primario", freccia=False, r=None, larg=None, peso=600, x_testo=None):
    r = r if r is not None else h * 0.26
    with t.gruppo(id):
        R(t, x, y, w, h, r, t.sfumatura(["#2F7BFB", "#1F6BF5"], 0, 0, 0, 1), id=f"{id}-fondo", filtro=t.ombra(t.p(h * 0.07), t.p(h * 0.22), "#2563EB", 0.24))
        lw = larghezza_testo(etichetta, t.p(corpo), peso) / t.k if larg is None else larg
        cx = x + w / 2 - (corpo * 0.4 if freccia else 0)
        T(t, etichetta, (x_testo if x_testo is not None else cx - lw / 2), y + h / 2 + corpo * 0.36, corpo, peso, "#FFFFFF", id=f"{id}-testo", larg=larg)
        if freccia:
            I(t, "freccia-destra", x + w - h * 0.55, y + h / 2, h * 0.38, "#FFFFFF", 1.9, id=f"{id}-freccia")


def pulsante_contorno(t, x, y, w, h, etichetta, corpo, id="pulsante-secondario", freccia=False, r=None, larg=None, colore=INK,
                      bordo="#D9DEE8", x_testo=None):
    r = r if r is not None else h * 0.26
    with t.gruppo(id):
        R(t, x + 0.6, y + 0.6, w - 1.2, h - 1.2, r, "#FFFFFF", stroke=bordo, sw=1.2, id=f"{id}-fondo")
        lw = larghezza_testo(etichetta, t.p(corpo), 500) / t.k if larg is None else larg
        T(t, etichetta, (x_testo if x_testo is not None else x + w / 2 - lw / 2 - (corpo * 0.5 if freccia else 0)), y + h / 2 + corpo * 0.36, corpo, 500, colore, id=f"{id}-testo", larg=larg)
        if freccia:
            I(t, "chevron-destra", x + w - h * 0.5, y + h / 2, h * 0.3, colore, 2.2)


def indietro(t, cx, cy, dim=14, colore="#111827"):
    I(t, "chevron-sinistra", cx, cy, dim, colore, 2.4, id="indietro")


def avanzamento3(t, cx, cy, attivo=0, w=14, gap=3, h=3.4, colore="#5B7AB8", vuoto="#E3E8F1", n_seg=3, id="avanzamento"):
    """Piccola barra a tre segmenti (onboarding): `attivo` = segmenti pieni."""
    tot = n_seg * w + (n_seg - 1) * gap
    with t.gruppo(id):
        for i in range(n_seg):
            R(t, cx - tot / 2 + i * (w + gap), cy - h / 2, w, h, h / 2, colore if i < attivo else vuoto, id=f"{id}-{i + 1}")


def scheda_ombra(t, x, y, w, h, r, fondo="#FFFFFF", bordo="#EDF0F5", sh=0.05, id=None):
    R(t, x, y, w, h, r, fondo, stroke=bordo, sw=0.9, id=id, filtro=t.ombra(t.p(1), t.p(5), "#0F172A", sh))


def chip(t, testo, x, y, w, h, fondo, colore, corpo, peso=600, id=None, bordo=None):
    R(t, x, y, w, h, h / 2, fondo, id=id, stroke=bordo, sw=1 if bordo else 1)
    T(t, testo, x + w / 2, y + h / 2 + corpo * 0.36, corpo, peso, colore, "middle")


def verde_spunta(t, cx, cy, r, id="spunta-verde"):
    with t.gruppo(id):
        C(t, cx, cy, r, t.sfumatura(["#35C970", "#1FAE55"]))
        I(t, "spunta", cx, cy, r * 1.05, "#FFFFFF", 3.2)


# icone aggiuntive non presenti
ui.ICONE.update({
    "condividi-nodi": [("c", (6, 12, 2.4)), ("c", (18, 5.5, 2.4)), ("c", (18, 18.5, 2.4)), ("p", "M8.1 10.9 15.9 6.6M8.1 13.1l7.8 4.3")],
    "copia": [("p", "M8.5 8.5h8a1.5 1.5 0 0 1 1.5 1.5v8.500a1.500 1.500 0 0 1-1.500 1.500h-8A1.500 1.500 0 0 1 7 18.500V10a1.500 1.500 0 0 1 1.500-1.500zM9.500 6.200V5.500A1.500 1.500 0 0 1 11 4h6.500A1.500 1.500 0 0 1 19 5.500V14"), ],
})


# ---------------------------------------------------------------------------- illustrazioni già disegnate (riquadro visibile)
def illus(t, nome, x0, y0, x1, y1, id=None, soglia=60, per="larghezza"):
    """Inserisce un disegno di brand/disegni/** in modo che la parte visibile occupi il riquadro (px locali)."""
    sys.path.insert(0, str(QUI.parent / "s1"))
    _sp1 = importlib.util.spec_from_file_location("s1comp", QUI.parent / "s1" / "componenti.py")
    m = sys.modules.get("s1comp")
    if m is None:
        m = importlib.util.module_from_spec(_sp1); sys.modules["s1comp"] = m; _sp1.loader.exec_module(m)
    vw, vh, bx0, by0, bx1, by1 = m._bbox_illustrazione(nome, soglia)
    p = t.p
    sc = (p(x1 - x0) / (bx1 - bx0)) if per == "larghezza" else (p(y1 - y0) / (by1 - by0))
    cx_t, cy_t = p((x0 + x1) / 2), p((y0 + y1) / 2)
    t.illustrazione(nome, cx_t - ((bx0 + bx1) / 2) * sc, cy_t - ((by0 + by1) / 2) * sc, vw * sc, id=id or nome.split("/")[-1])


def stato_telefono(t, x0=18, x1=None, y=21, corpo=8.6, colore=INK):
    barra_stato(t, x0, (x1 if x1 is not None else t.W - 17), y, corpo=corpo, colore=colore)


ui.ICONE.update({
    "quiz": [("p", "M6 4.5h12a1.5 1.5 0 0 1 1.500 1.500v12a1.500 1.500 0 0 1-1.500 1.500H6A1.500 1.500 0 0 1 4.500 18V6A1.500 1.500 0 0 1 6 4.500zM8.500 9.500h7M8.500 13.500h7")],
    "trofeo-pieno": [("pf", "M7.5 4h9v5.500a4.500 4.500 0 0 1-9 0z"), ("p", "M7.500 6H4.500v1.500A3 3 0 0 0 7.500 10.500M16.500 6h3v1.500a3 3 0 0 1-3 3M12 14v3.500M8.500 20h7M10 17.500h4")],
})


def nav4(t, attiva, y, h, kit="rosso", corpo=9.6, ico=21, y_ico=16, y_lab=36.5, x0=0, x1=None, voci=None):
    """Barra inferiore a 4 voci: Home, Lezioni, Quiz, Classifica (la voce attiva piena nel colore del kit)."""
    voci = voci or [("casa-contorno", "Home"), ("barre-contorno", "Lezioni"), ("quiz", "Quiz"), ("trofeo", "Classifica")]
    nav(t, voci, attiva, y, h, corpo=corpo, ico=ico, x0=x0, x1=x1, indicatore=False, kit=kit, y_ico=y_ico, y_lab=y_lab,
        icone_attive={"casa-contorno": "casa", "trofeo": "trofeo-pieno"})


def corona(t, cx, cy, lato, colore, numero, num_col="#FFFFFF", id="corona"):
    """Corona con il numero della posizione (1, 2, 3)."""
    p = lambda x, y: f"{n(t.p(cx + x * lato))} {n(t.p(cy + y * lato))}"
    with t.gruppo(id):
        t.path(f"M{p(-0.5, 0.45)}L{p(-0.5, -0.3)}L{p(-0.25, -0.05)}L{p(0, -0.5)}L{p(0.25, -0.05)}L{p(0.5, -0.3)}L{p(0.5, 0.45)}z", fill=colore, stroke=colore, sw=t.p(lato * 0.1))
        T(t, str(numero), cx, cy + lato * 0.3, lato * 0.6, 700, num_col, "middle")


def mano_saluto(t, cx, cy, s=1.0, id="emoji-saluto"):
    """Mano che saluta (emoji disegnata): palma e quattro dita gialle."""
    with t.gruppo(id, trasforma=f"rotate(18 {n(t.p(cx))} {n(t.p(cy))})"):
        for i, (dx, h_) in enumerate(((-6, 11), (-2, 14), (2, 14), (6, 11))):
            R(t, cx + (dx - 1.8) * s, cy - h_ * s, 3.6 * s, (h_ + 6) * s, 1.8 * s, "#F8C02F", id=f"dito-{i + 1}")
        t.ellisse(t.p(cx), t.p(cy + 5 * s), t.p(8.6 * s), t.p(7.5 * s), fill="#F5B51E", id="palma")
        R(t, cx - 11 * s, cy + 0 * s, 5 * s, 3.4 * s, 1.7 * s, "#F8C02F", id="pollice", )
