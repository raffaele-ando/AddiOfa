"""
Componenti ripetuti del funnel di onboarding rosso (immagini 02 e 47 di design-concept: 14 schermate, kit rosso).

Si disegna in PIXEL DEL RITAGLIO ORIGINALE (brand/concept/02-.../NNN-schermata.png) e i componenti convertono in
punti telefono (390 di larghezza): `t.X(x)` e `t.Y(y)` per le posizioni, `t.s(v)` per le lunghezze. Ogni schermata è la
sola parte bianca del telefono del ritaglio (x0..x1 in SCHERMATE), con angoli arrotondati e fondo trasparente.

Cosa uniformano rispetto all'originale (l'immagine AI ha le schermate diverse tra loro):
  - barra di stato, freccia indietro e barra di avanzamento: stessa posizione e stessa misura su tutte;
  - avanzamento a 5 segmenti uguali (nell'originale 3-5 segmenti di lunghezze diverse, a volte fuori asse con la freccia)
    e **monotono** lungo il flusso (1,1,2,2,3,-,4,-,4,4,5);
  - pulsante rosso largo con la freccia a destra, schede di scelta e righe radio con le stesse proporzioni.
"""
from __future__ import annotations

import json
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from ui import *  # noqa: E402,F401,F403
from ui import Tela, larghezza_testo, n, BRAND, RADICE  # noqa: E402

ORIG_DIR = RADICE / "brand/concept/02-schermate-onboarding-piani"
OUT_DIR = RADICE / "brand/concept-svg/schermate/funnel-rosso"
TAVOLE_DIR = RADICE / "brand/concept-svg/_tavole/funnel-rosso"

# ---------------------------------------------------------------------------- colori (campionati sull'originale)
INK_R = "#0A1230"          # titoli
SOTTO = "#5B6577"          # sottotitoli grigio-blu
TESTO = "#2A3447"          # testo di corpo
ROSSO_B = "#F22938"        # pulsante
ROSSO_B2 = "#EC2433"
ROSSO_T = "#E8232F"        # testo rosso (« inglese? », « OFA »)
ROSSO_SEL_FONDO = "#FEF3F3"
ROSSO_SEL_BORDO = "#E7A9AC"
LINEA_R = "#E9ECF1"
GRIGIO_BAR = "#E9ECF1"
GRIGIO_ICONA = "#B7BECB"
VERDE_B = "#2FA94B"

# ritaglio -> parte bianca del telefono (x0, x1) e altezza (px del ritaglio). Misurati sui bordi del fondo grigio.
SCHERMATE = {
    1: (3, 207, 332), 2: (20, 216, 332), 3: (1, 190, 332), 4: (0, 189, 332), 5: (0, 188, 332), 6: (17, 222, 332),
    7: (18, 210, 332), 8: (0, 209, 305), 9: (17, 212, 305), 10: (17, 235, 305), 11: (17, 209, 305), 12: (17, 208, 305),
    13: (0, 196, 305), 14: (17, 199, 305),
}
NOMI = {
    1: "intro", 2: "certificazione", 3: "ofa-assegnato", 4: "verifica-livello", 5: "domanda", 6: "salva-risultati",
    7: "se-non-superi", 8: "quiz-completato", 9: "momento-di-prepararti", 10: "scelta-piano", 11: "cram-pass-pro",
    12: "pagamento", 13: "accesso-completato", 14: "obiettivo",
}
# avanzamento (segmenti pieni su 5); None = niente barra. Nell'originale: 1,1,2,2,2,-,4,-,2,2,3 (incoerente).
AVANZAMENTO = {2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 8: 4, 10: 4, 11: 4, 12: 5}
INDIETRO = {2, 3, 4, 5, 6, 8, 10, 11, 12}


def percorso_originale(n_: int) -> pathlib.Path:
    return ORIG_DIR / f"{n_:03d}-schermata.png"


def percorso_svg(n_: int) -> pathlib.Path:
    return OUT_DIR / f"{n_:02d}-{NOMI[n_]}.svg"


# ---------------------------------------------------------------------------- la tela di una schermata
def nuova(n_: int) -> Tela:
    x0, x1, h = SCHERMATE[n_]
    k = 390 / (x1 - x0)
    t = Tela(390, round(h * k, 2), fondo=None, id=f"schermata-{n_:02d}-{NOMI[n_]}")
    t.k, t.x0, t.x1, t.h_px, t.num = k, x0, x1, h, n_
    t.X = lambda x: (x - x0) * k
    t.Y = lambda y: y * k
    t.s = lambda v: v * k
    t.p = t.s
    # il telefono: fondo bianco, angoli arrotondati, filo chiaro
    t.rett(0.5, 0.5, 389, t.h - 1, t.s(12), fill="#FFFFFF", stroke="#ECEEF3", sw=1, id="schermata-fondo")
    return t


def stato(t: Tela, y_base: float = 18.5):
    """Barra di stato: 9:41, segnale, wifi, batteria. Posizioni normalizzate (margine 20 px a sinistra, 14 a destra)."""
    c = INK_R
    x = t.x0 + 20
    r = t.x1 - 14
    s = t.s
    with t.gruppo("barra-di-stato"):
        t.testo("9:41", t.X(x), t.Y(y_base), s(8.3), 700, c, id="ora")
        # batteria
        bx = t.X(r) - s(13)
        t.rett(bx, t.Y(y_base - 6.6), s(12.5), s(6.4), s(2), fill="none", stroke=c, sw=s(0.6), opacita=0.5)
        t.rett(bx + s(0.9), t.Y(y_base - 5.7), s(10.7), s(4.6), s(1.2), fill=c)
        t.rett(bx + s(12.9), t.Y(y_base - 4.2), s(0.9), s(2.2), s(0.4), fill=c, opacita=0.5)
        # wifi
        wx = bx - s(12)
        t.icona("wifi", wx, t.Y(y_base - 8.2), s(9.4), c, 2.2)
        # segnale
        sx = wx - s(13.5)
        for i, h_ in enumerate((2.2, 3.5, 4.8, 6.2)):
            t.rett(sx + s(2.6) * i, t.Y(y_base - 0.9) - s(h_), s(1.6), s(h_), s(0.6), fill=c)


def indietro(t: Tela, y: float = 36.5):
    """Freccia indietro."""
    with t.gruppo("indietro"):
        t.icona("chevron-sinistra", t.X(t.x0 + 14.5), t.Y(y - 5.5), t.s(11), "#0B132B", 2.3 * 1.15)


def avanzamento(t: Tela, y: float = 36.5, pieni: int | None = None, totale: int = 5):
    """Barra di avanzamento a 5 segmenti uguali, centrata sulla freccia."""
    pieni = AVANZAMENTO.get(t.num, 0) if pieni is None else pieni
    xa, xb = t.x0 + 42, t.x1 - 40
    gap = 2.4
    w = (xb - xa - gap * (totale - 1)) / totale
    with t.gruppo("avanzamento"):
        for i in range(totale):
            fill = ROSSO_B2 if i < pieni else GRIGIO_BAR
            t.rett(t.X(xa + i * (w + gap)), t.Y(y - 1.6), t.s(w), t.s(3.2), t.s(1.6), fill=fill, id=f"avanzamento-{i + 1}")


def barra_superiore(t: Tela, pieni: int | None = None, y: float = 36.5):
    if t.num in INDIETRO:
        indietro(t, y)
    if AVANZAMENTO.get(t.num) is not None or pieni is not None:
        avanzamento(t, y, pieni)


# ---------------------------------------------------------------------------- testo
def riga(t: Tela, segmenti, x: float, y: float, corpo: float, peso: int = 700, colore: str = INK_R, ancora: str = "start",
         id: str | None = None, spaziatura: float = 0.0):
    """Una riga di testo in pixel del ritaglio. `segmenti` = stringa oppure [(testo, colore), …]. x = sinistra / centro / destra."""
    if isinstance(segmenti, str):
        segmenti = [(segmenti, colore)]
    cs = t.s(corpo)
    tot = sum(larghezza_testo(tx, cs, peso, t.s(spaziatura)) for tx, _ in segmenti)
    px = t.X(x) - tot / 2 if ancora == "middle" else t.X(x) - tot if ancora == "end" else t.X(x)
    with t.gruppo(id or "riga"):
        for tx, c in segmenti:
            px += t.testo(tx, px, t.Y(y), cs, peso, c, spaziatura=t.s(spaziatura))
    return tot


def righe(t: Tela, testi, x: float, y: float, corpo: float, interlinea: float, peso: int = 400, colore: str = SOTTO,
          ancora: str = "start", id: str = "testo"):
    """Più righe già spezzate (come nell'originale). Restituisce la y dell'ultima linea di base."""
    for i, tx in enumerate(testi):
        riga(t, tx, x, y + i * interlinea, corpo, peso, colore, ancora, id=f"{id}-{i + 1}")
    return y + (len(testi) - 1) * interlinea


# ---------------------------------------------------------------------------- pulsanti e schede
def pulsante(t: Tela, x0: float, y0: float, x1: float, y1: float, etichetta: str, corpo: float = 10.2, id: str = "pulsante-primario",
             icona_sx: str | None = None, freccia: bool = True, dx_etichetta: float = -4):
    """Pulsante rosso largo con la freccia fissata a destra (come nell'originale)."""
    h = y1 - y0
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo(id):
        t.rett(X(x0), Y(y0), s(x1 - x0), s(h), s(h * 0.34), id=f"{id}-fondo",
               fill=t.sfumatura(["#F43540", "#EE2433"]), filtro=t.ombra(s(1.6), s(5), "#E11D2B", 0.30))
        cx = (x0 + x1) / 2 + dx_etichetta
        cs = s(corpo)
        lw = larghezza_testo(etichetta, cs, 600, s(0.15))
        base = Y((y0 + y1) / 2) + cs * 0.355
        sx = X(cx) - lw / 2 + (s(6) if icona_sx else 0)
        t.testo(etichetta, sx, base, cs, 600, "#FFFFFF", id=f"{id}-testo", spaziatura=s(0.15))
        if icona_sx:
            t.icona(icona_sx, sx - s(13), Y((y0 + y1) / 2) - s(5.5), s(11), "#FFFFFF", 2.0, fill_pieno="#FFFFFF")
        if freccia:
            t.icona("chevron-destra", X(x1 - 22) , Y((y0 + y1) / 2) - s(4.5), s(9), "#FFFFFF", 2.6)


def spunta_tondo(t: Tela, cx: float, cy: float, r: float, tipo: str = "rosso", id: str | None = None):
    """Tondo con spunta: 'rosso' (selezionato), 'grigio' (pieno neutro), 'vuoto' (bordo e spunta chiara)."""
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo(id or f"spunta-{tipo}"):
        if tipo == "rosso":
            t.cerchio(X(cx), Y(cy), s(r), fill=t.sfumatura(["#FA5560", "#F03142"]), filtro=t.ombra(s(0.8), s(2.5), "#E11D2B", 0.25))
            t.icona("spunta", X(cx) - s(r * 0.52), Y(cy) - s(r * 0.52), s(r * 1.04), "#FFFFFF", 3.2)
        elif tipo == "grigio":
            t.cerchio(X(cx), Y(cy), s(r), fill="#B9C1D0")
            t.icona("spunta", X(cx) - s(r * 0.52), Y(cy) - s(r * 0.52), s(r * 1.04), "#FFFFFF", 3.2)
        else:
            t.cerchio(X(cx), Y(cy), s(r - 0.5), fill="#FFFFFF", stroke="#C5CBD8", sw=s(1.1))
            t.icona("spunta", X(cx) - s(r * 0.5), Y(cy) - s(r * 0.5), s(r * 1.0), "#C5CBD8", 2.6)


def scheda(t: Tela, x0: float, y0: float, x1: float, y1: float, selezionata: bool = False, r: float = 8, id: str = "scheda",
           fondo_sel: bool = True):
    """Scheda di scelta: selezionata = fondo rosato e filo rosso; altrimenti bianca con filo chiaro e ombra leggera."""
    X, Y, s = t.X, t.Y, t.s
    if selezionata:
        t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s(r), id=id, stroke=ROSSO_SEL_BORDO, sw=s(0.9),
               fill=t.sfumatura(["#FEF6F6", "#FDEEEF"]), filtro=t.ombra(s(1), s(4), "#E11D2B", 0.10))
    else:
        t.rett(X(x0), Y(y0), s(x1 - x0), s(y1 - y0), s(r), id=id, stroke=LINEA_R, sw=s(0.8), fill="#FFFFFF",
               filtro=t.ombra(s(0.8), s(3.5), "#0F172A", 0.05))


def radio_r(t: Tela, cx: float, cy: float, r: float, selezionato: bool, id: str = "radio"):
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo(id):
        if selezionato:
            t.cerchio(X(cx), Y(cy), s(r - 0.9), fill="#FFFFFF", stroke="#EE2433", sw=s(2.0))
            t.cerchio(X(cx), Y(cy), s(r * 0.42), fill="#EE2433")
        else:
            t.cerchio(X(cx), Y(cy), s(r - 0.5), fill="#FFFFFF", stroke="#C2C8D4", sw=s(1.0))


def tondo_freccia(t: Tela, cx: float, cy: float, r: float, fondo: str, colore: str = "#FFFFFF", id: str = "tondo-freccia"):
    """Cerchio con chevron (frecce dei piani)."""
    with t.gruppo(id):
        t.cerchio(t.X(cx), t.Y(cy), t.s(r), fill=fondo)
        t.icona("chevron-destra", t.X(cx) - t.s(r * 0.42), t.Y(cy) - t.s(r * 0.42), t.s(r * 0.84), colore, 2.8)


# ---------------------------------------------------------------------------- illustrazioni già disegnate
_BBOX = QUI / "bbox_illustrazioni.json"


def _bbox_illustrazione(nome: str, soglia: int = 60) -> tuple[float, float, float, float, float, float]:
    """(vw, vh, bx0, by0, bx1, by1): viewBox e riquadro dei pixel visibili (alfa > soglia), in unità viewBox."""
    cache = json.loads(_BBOX.read_text()) if _BBOX.exists() else {}
    chiave = f"{nome}@{soglia}"
    if chiave not in cache:
        import re
        sys.path.insert(0, str(RADICE / "strumenti/brand"))
        from render import Renderer
        import numpy as np
        svg = (BRAND / "disegni" / (nome + ".svg")).read_text()
        vb = re.search(r'viewBox="([\d.\-]+) ([\d.\-]+) ([\d.]+) ([\d.]+)"', svg)
        vx, vy, vw, vh = (float(v) for v in vb.groups())
        K = 8
        svg2 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{int(vw * K)}" height="{int(vh * K)}"', svg, count=1)
        with Renderer() as r:
            im = r.svg(svg2, int(vw * K), int(vh * K), fondo="transparent")
        a = np.asarray(im)[..., 3]
        ys, xs = np.nonzero(a > soglia)
        cache[chiave] = [vw, vh, vx + xs.min() / K, vy + ys.min() / K, vx + (xs.max() + 1) / K, vy + (ys.max() + 1) / K]
        _BBOX.write_text(json.dumps(cache, indent=1))
    return tuple(cache[chiave])


def illustrazione(t: Tela, nome: str, x0: float, y0: float, x1: float, y1: float, id: str | None = None, soglia: int = 60,
                  per: str = "larghezza"):
    """Inserisce un'illustrazione del kit (es. 'kit-rosso/illustrazioni/quiz-test') in modo che la parte visibile occupi
    il riquadro (x0,y0,x1,y1) in pixel del ritaglio. `per` = 'larghezza' | 'altezza' (che lato comanda la scala)."""
    vw, vh, bx0, by0, bx1, by1 = _bbox_illustrazione(nome, soglia)
    sc = (t.s(x1 - x0) / (bx1 - bx0)) if per == "larghezza" else (t.s(y1 - y0) / (by1 - by0))
    # centro del riquadro visibile -> centro del riquadro richiesto
    cx_t, cy_t = t.X((x0 + x1) / 2), t.Y((y0 + y1) / 2)
    ox = cx_t - ((bx0 + bx1) / 2) * sc
    oy = cy_t - ((by0 + by1) / 2) * sc
    t.illustrazione(nome, ox, oy, vw * sc, id=id or nome.split("/")[-1])


def chiudi(t: Tela):
    p = percorso_svg(t.num)
    t.salva(p)
    print(p)
    return p


def corpo_per(testo: str, larghezza_px: float, peso: int = 700, spaziatura: float = 0.0) -> float:
    """Corpo (in px del ritaglio) per cui `testo` è largo `larghezza_px` px del ritaglio (misurata sull'originale)."""
    return larghezza_px / larghezza_testo(testo, 1.0, peso, spaziatura)
