"""Componenti riusabili delle schermate "home rischio / ATLAS" (agente s8).

Tutte le funzioni lavorano in PIXEL DELL'ORIGINALE (come gen_03): `t = nuova(w_px, h_px)` crea una Tela da 390 punti
e ogni funzione converte con `t.p`. Cosi' le misure si prendono dall'immagine e si scrivono come sono.
`T(...)` e' un testo che si puo' tarare sulla LARGHEZZA misurata nell'originale (`larg=`), utile per titoli
e cifre: il font AI non e' Inter, ma la larghezza sta entro il 3-5 %.

Le icone in piu' (barre con contorno, cuffie, bersaglio con freccia, lampadina...) sono registrate in ui.ICONE da qui,
senza toccare ui.py.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
import ui  # noqa: E402
from ui import (Tela, INK, GRIGIO, LINEA, BLU, BLU_FORTE, BLU_PALLIDO, ROSSO, VERDE, GIALLO, KIT, n,  # noqa: E402,F401
                larghezza_testo)

RADICE = ui.RADICE
CONCEPT = RADICE / "brand" / "concept"
OUT = RADICE / "brand" / "concept-svg" / "schermate" / "home"
TAVOLE = RADICE / "brand" / "concept-svg" / "_tavole" / "home"
LOGO_STELLA = RADICE / "strumenti" / "brand" / "logo" / "addiofa-icona-pieno-campo.svg"

# ---------------------------------------------------------------------------- icone in piu'
ui.ICONE.update({
    "barre-contorno": [("p", "M4.5 14.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4.500a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM10.500 9.500a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v9.500a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zM16 5.500a1 1 0 0 1 1-1h1.500a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H17a1 1 0 0 1-1-1z")],
    "barre-crescenti": [("pf", "M4 14.500h4V20H4zM10 10h4v10h-4zM16 4.500h4V20h-4z")],
    "cuffie": [("p", "M4.500 15.500V12a7.500 7.500 0 0 1 15 0v3.500"),
               ("pf", "M3.800 13.500h2.700a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5.800a2 2 0 0 1-2-2zM20.200 13.500h-2.700a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h.7a2 2 0 0 0 2-2z")],
    "bersaglio-freccia": [("p", "M20 12.500A8.500 8.500 0 1 1 11.500 4"), ("p", "M16 12.500A4.500 4.500 0 1 1 11.500 8"),
                          ("p", "M11.500 12.500 20 4M16.500 3.500l.5 3.500 3.500.5")],
    "lampadina": [("p", "M9.200 18.500h5.600M10 21.500h4M12 2.800a6 6 0 0 0-3.600 10.800c.7.600 1.100 1.400 1.100 2.400h5c0-1 .4-1.800 1.100-2.400A6 6 0 0 0 12 2.800z")],
    "casa-contorno": [("p", "M12 3.500 3.800 10.500V19.500a1 1 0 0 0 1 1h4.200v-5.500h6v5.500h4.200a1 1 0 0 0 1-1V10.500z")],
    "cerchio-spunta": [("c", (12, 12, 9)), ("p", "M7.800 12.500 10.700 15.400 16.300 9.200")],
    "freccia-giu": [("p", "M12 4.500v15M6 13.500l6 6 6-6")],
    "freccia-trend": [("p", "M3.500 17 9.500 11l4 4 7-8M15.500 7h5v5")],
    "cappello-laurea": [("pf", "M12 4 1.800 9 12 14l10.200-5z"), ("p", "M6 11.500v4.500c0 1.400 2.700 3 6 3s6-1.600 6-3v-4.500")],
    "gruppo-tre": [("cf", (12, 8, 3.300)), ("pf", "M5.500 19.500c0-3.300 2.900-5.300 6.500-5.300s6.500 2 6.500 5.300z"),
                   ("cf", (4.800, 9.500, 2.300)), ("cf", (19.200, 9.500, 2.300))],
    "mano-aiuto": [("p", "M4 12.500c1.800-2 3.600-2.500 5.500-1.500l4 2c1 .5.500 2-.6 1.800L10 14M10 14l3.500 1.800c.8.400 1.500.3 2.200-.3L20 11.500M3 11v8")],
    "tre-puntini": [("cf", (5.500, 12, 1.500)), ("cf", (12, 12, 1.500)), ("cf", (18.500, 12, 1.500))],
    "segnalibro": [("p", "M7 4h10a1 1 0 0 1 1 1v15l-6-3.800L6 20V5a1 1 0 0 1 1-1z")],
    "commento": [("p", "M5 5h14a1.500 1.500 0 0 1 1.500 1.500v9A1.500 1.500 0 0 1 19 17h-7l-4.500 3.500V17H5a1.500 1.500 0 0 1-1.500-1.500v-9A1.500 1.500 0 0 1 5 5z")],
    "cuore": [("p", "M12 20s-7.500-4.500-7.500-10.200A4.300 4.300 0 0 1 12 7.200a4.300 4.300 0 0 1 7.500 2.600C19.500 15.500 12 20 12 20z")],
    "sfida": [("p", "M5 20V4M5 5h11l-2 3.500 2 3.500H5")],
    "scudo-spunta": [("p", "M12 3 4.500 6v5.500c0 4.700 3.100 8.200 7.500 9.500 4.400-1.300 7.500-4.800 7.500-9.500V6zM8.800 12 11 14.200 15.500 9.500")],
    "tasti": [("p", "M4 6h16M4 12h16M4 18h16")],
    "virgolette": [("pf", "M4 12.500C4 9 6 6.800 9.500 5.800l.8 1.600C8.700 8.200 7.800 9.200 7.600 10.700H9.500V18H4zM13.700 12.500C13.700 9 15.700 6.800 19.200 5.800l.8 1.600c-1.600.8-2.500 1.800-2.700 3.300h1.900V18h-5.500z")],
    "libro-pieno": [("pf", "M2.800 5.600C5.600 4.800 9 5 11.200 6.500V19.200c-2.300-1.300-5.600-1.600-8.400-.8zM12.800 6.500C15 5 18.400 4.800 21.200 5.600v12.800c-2.800-.8-6.100-.5-8.400.8z")],
    "monete": [("p", "M4.5 7.5c0-1.4 3.4-2.5 7.5-2.5s7.5 1.1 7.5 2.5-3.4 2.5-7.5 2.5-7.5-1.1-7.5-2.5zM4.5 7.5v4c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-4M4.5 11.5v4c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-4M4.5 15.5v2c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-2")],
    "utente-contorno": [("c", (12, 8, 4)), ("p", "M4.500 20.500c0-3.800 3.300-6 7.500-6s7.500 2.200 7.500 6z")],
})


# ---------------------------------------------------------------------------- base
def nuova(w_px: float, h_px: float, id: str = "schermata", fondo: str | None = "#FFFFFF") -> Tela:
    return Tela.da_originale(w_px, h_px, fondo, id)


def fit(testo: str, peso: int, larg_px: float) -> float:
    """Corpo (px) per cui `testo` e' largo `larg_px`."""
    return larg_px / larghezza_testo(testo, 1.0, peso)


def T(t: Tela, testo: str, x: float, y: float, corpo: float | None = None, peso: int = 400, colore: str = INK,
      ancora: str = "start", id: str | None = None, larg: float | None = None, spaz: float = 0.0, opacita=None) -> float:
    """Testo in px dell'originale; `larg` (px) calcola il corpo dalla larghezza misurata. Restituisce la larghezza in px."""
    if larg is not None:
        corpo = fit(testo, peso, larg - spaz * max(0, len(testo) - 1)) if spaz else fit(testo, peso, larg)
    w = t.testo(testo, t.p(x), t.p(y), t.p(corpo), peso, colore, ancora, id=id, spaziatura=t.p(spaz), opacita=opacita)
    return w / t.k


def R(t: Tela, x, y, w, h, r=0, fill="#FFFFFF", **kw):
    p = t.p
    if "r_angoli" in kw and kw["r_angoli"]:
        kw["r_angoli"] = tuple(p(v) for v in kw["r_angoli"])
    if "sw" in kw:
        kw["sw"] = p(kw["sw"])
    return t.rett(p(x), p(y), p(w), p(h), p(r), fill=fill, **kw)


def C(t: Tela, cx, cy, r, fill="#FFFFFF", **kw):
    if "sw" in kw:
        kw["sw"] = t.p(kw["sw"])
    return t.cerchio(t.p(cx), t.p(cy), t.p(r), fill=fill, **kw)


def L(t: Tela, x1, y1, x2, y2, colore=LINEA, sw=1, **kw):
    return t.linea(t.p(x1), t.p(y1), t.p(x2), t.p(y2), colore, t.p(sw), **kw)


def I(t: Tela, nome: str, cx: float, cy: float, dim: float, colore: str = INK, sw: float = 2.0, **kw):
    """Icona centrata in (cx, cy), lato `dim` px."""
    p = t.p
    t.icona(nome, p(cx - dim / 2), p(cy - dim / 2), p(dim), colore, sw, **kw)


def ombra(t: Tela, dy=2, sfoca=8, colore="#0F172A", op=0.08):
    return t.ombra(t.p(dy), t.p(sfoca), colore, op)


# ---------------------------------------------------------------------------- barra di stato
def barra_stato(t: Tela, x0: float, x1: float, y: float, corpo: float = 16, colore: str = INK):
    """9:41 a sinistra, segnale+wifi+batteria a destra (x1 = bordo destro della batteria); y = linea di base dell'ora."""
    with t.gruppo("barra-di-stato"):
        T(t, "9:41", x0, y, corpo, 700, colore)
        bw, bh = corpo * 1.5, corpo * 0.72
        bx, by = x1 - bw, y - corpo * 0.78
        R(t, bx, by, bw, bh, bh * 0.3, "none", stroke=colore, sw=corpo * 0.07, opacita=0.45)
        R(t, bx + bw * 0.07, by + bh * 0.14, bw * 0.78, bh * 0.72, bh * 0.2, colore)
        R(t, bx + bw + corpo * 0.07, by + bh * 0.33, corpo * 0.1, bh * 0.34, corpo * 0.05, colore, opacita=0.5)
        I(t, "wifi", bx - corpo * 1.2, by + bh * 0.3, corpo * 1.5, colore, 2.4)
        sx = bx - corpo * 3.4
        for i, hh in enumerate((0.34, 0.5, 0.68, 0.86)):
            R(t, sx + i * corpo * 0.36, y - corpo * hh, corpo * 0.23, corpo * hh, corpo * 0.08, colore)


def indicatore_home(t: Tela, cx: float, y: float, w: float = 134, h: float = 5):
    R(t, cx - w / 2, y, w, h, h / 2, "#0F172A", id="indicatore-home")


# ---------------------------------------------------------------------------- testata
def logo(t: Tela, x: float, y: float, corpo: float = None, larg: float = None, colore_ofa: str = BLU_FORTE, id: str = "logo-addiofa"):
    """AddiOfa testuale (Addi scuro + Ofa blu), y = linea di base. Restituisce la larghezza in px."""
    if larg is not None:
        corpo = larg / (larghezza_testo("AddiOfa", 1.0, 700) / 1.0)
    with t.gruppo(id):
        w1 = T(t, "Addi", x, y, corpo, 700, "#0B1033", id="logo-addi", spaz=-corpo * 0.02)
        w2 = T(t, "Ofa", x + w1 - corpo * 0.02, y, corpo, 700, colore_ofa, id="logo-ofa", spaz=-corpo * 0.02)
    return w1 + w2


def campanella(t: Tela, cx: float, cy: float, r: float = 28, fondo: str = "#EDF1F8", colore: str = "#243B6B"):
    with t.gruppo("campanella"):
        C(t, cx, cy, r, fondo, id="campanella-fondo")
        I(t, "campana", cx, cy, r * 1.2, colore, 1.7)


def pulsante_profilo(t: Tela, cx: float, cy: float, r: float = 28, fondo: str = "#EDF1F8", colore: str = "#243B6B"):
    with t.gruppo("pulsante-profilo"):
        C(t, cx, cy, r, fondo, id="profilo-fondo")
        I(t, "utente-contorno", cx, cy, r * 1.15, colore, 1.7)


def info(t: Tela, cx: float, cy: float, r: float = 9, colore: str = "#6B7280"):
    """Cerchietto con la i (info)."""
    I(t, "info", cx, cy, r * 2.2, colore, 1.6)


# ---------------------------------------------------------------------------- misuratore
def misuratore_rischio(t: Tela, cx: float, cy: float, r: float, pos: float, spess: float, colore: str, chiaro: str,
                       vuoto: str = "#E8EDF5", ticks_esterni: bool = True, ticks_interni: bool = True, estremi: bool = True,
                       alone: float = 0.30, tacca_col: str | None = None, id: str = "misuratore", tacca_vuota: str = "#CBD5E1"):
    """Semicerchio del rischio. `pos` (0..1) = dove sta il pomello lungo l'arco (non e' sempre la percentuale:
    nell'originale 82 % sta a 0,81, 46 % a 0,53, 18 % a 0,25). Tacche fuori (11, le piene colorate) e dentro (19, quasi invisibili)."""
    p = t.p
    tc = tacca_col or colore
    a_pomello = math.pi - math.pi * pos
    with t.gruppo(f"{id}-completo"):
        if ticks_esterni:
            with t.gruppo(f"{id}-tacche-esterne"):
                for i in range(13):
                    if not estremi and i in (0, 12):
                        continue
                    a = math.pi - math.pi * i / 12
                    r0, r1 = r + spess / 2 + spess * 0.28, r + spess / 2 + spess * (0.68 if i % 3 == 0 else 0.52)
                    pieno = i / 12 <= pos + 0.02
                    L(t, cx + r0 * math.cos(a), cy - r0 * math.sin(a), cx + r1 * math.cos(a), cy - r1 * math.sin(a),
                      tc if pieno else tacca_vuota, 2.6, opacita=0.55 if pieno else 0.55)
        if ticks_interni:
            with t.gruppo(f"{id}-tacche-interne"):
                for i in range(1, 12):
                    a = math.pi - math.pi * i / 12
                    r0, r1 = r - spess / 2 - spess * 0.62, r - spess / 2 - spess * 0.9
                    L(t, cx + r0 * math.cos(a), cy - r0 * math.sin(a), cx + r1 * math.cos(a), cy - r1 * math.sin(a),
                      "#D3DAE6" if i / 12 > pos else tc, 1.6, opacita=0.5 if i / 12 > pos else 0.18)
        if alone:
            px, py = cx + r * math.cos(a_pomello), cy - r * math.sin(a_pomello)
            C(t, px, py, spess * 2.0, t.radiale([(0, colore, alone), (0.55, colore, alone * 0.35), (1, colore, 0)], 0.5, 0.5, 0.5),
              id=f"{id}-alone-grande")
        t.misuratore(p(cx), p(cy), p(r), pos, spessore=p(spess), colore=colore, chiaro=chiaro, vuoto=vuoto, tacche=False, id=id)


# ---------------------------------------------------------------------------- avvisi / card di stato
STATI = {
    "alto": dict(pct="82%", pos=0.807, alone=0.30, colore="#F5303B", chiaro="#FF8E8E", num="#E8101E", etichetta="#A31217",
                 fondo_avviso="#FEF0F0", bordo_avviso="#FDE3E3", icona="#EF4444", chevron="#EF4444", vuoto="#E8EDF5"),
    "medio": dict(pct="46%", pos=0.53, alone=0.10, colore="#FFA92D", chiaro="#FFD98A", num="#F59A1B", etichetta="#B45F06",
                  fondo_avviso="#FFF8EC", bordo_avviso="#FFEFD0", icona="#F59E0B", chevron="#F59E0B", vuoto="#E8EDF5"),
    "basso": dict(pct="18%", pos=0.25, alone=0.08, colore="#0BB474", chiaro="#8DE3B9", num="#079A62", etichetta="#0B7A4A",
                  fondo_avviso="#EEF9F3", bordo_avviso="#DDF3E8", icona="#16A765", chevron="#16A765", vuoto="#E8EDF5"),
}


def icona_stato(t: Tela, stato: str, cx: float, cy: float, r: float):
    """Pallino dello stato di rischio: ! rosso, barre gialle, spunta verde."""
    s = STATI[stato]
    with t.gruppo(f"avviso-icona-{stato}"):
        if stato == "alto":
            C(t, cx, cy, r, t.sfumatura(["#FF6A6A", "#EC2230"]), filtro=ombra(t, 2, 6, "#EF4444", 0.25))
            R(t, cx - r * 0.1, cy - r * 0.5, r * 0.2, r * 0.58, r * 0.1, "#FFFFFF")
            C(t, cx, cy + r * 0.45, r * 0.12, "#FFFFFF")
        elif stato == "medio":
            R(t, cx - r, cy - r, 2 * r, 2 * r, r * 0.45, "#FFFFFF", filtro=ombra(t, 2, 8, "#F59E0B", 0.16))
            for i, (hh, c) in enumerate(((0.45, "#FFC04D"), (0.75, "#FFAE2C"), (1.05, "#F99B0F"))):
                R(t, cx - r * 0.58 + i * r * 0.45, cy + r * 0.52 - r * hh, r * 0.32, r * hh, r * 0.1, c)
        else:
            C(t, cx, cy, r, t.sfumatura(["#2ED38B", "#0FA564"]), filtro=ombra(t, 2, 6, "#16A765", 0.25))
            I(t, "spunta", cx, cy, r * 1.05, "#FFFFFF", 3.2)


def avviso(t: Tela, x: float, y: float, w: float, h: float, stato: str, titolo: str, righe: list[str],
           corpo_t: float, corpo_r: float, x_testo: float, y_titolo: float, passo: float, r: float = 18,
           r_icona: float | None = None, id: str = "avviso-rischio", peso_t: int = 600, col_riga: str = GRIGIO,
           x_icona: float | None = None, chevron: bool = True, larg_righe: list[float] | None = None, larg_titolo: float | None = None, col_titolo: str = INK):
    """Card di avviso con icona di stato, titolo, righe di testo, chevron. Le coordinate del testo sono assolute (px)."""
    s = STATI[stato]
    with t.gruppo(id):
        R(t, x, y, w, h, r, s["fondo_avviso"], id=f"{id}-fondo", filtro=ombra(t, 2, 12, s["icona"], 0.06))
        r_i = r_icona or h * 0.17
        icona_stato(t, stato, x_icona if x_icona is not None else x + h * 0.33, y + h / 2, r_i)
        T(t, titolo, x_testo, y_titolo, corpo_t, peso_t, col_titolo, id=f"{id}-titolo", larg=larg_titolo)
        for i, riga in enumerate(righe):
            T(t, riga, x_testo, y_titolo + passo * (i + 1), corpo_r, 400, col_riga, id=f"{id}-testo-{i + 1}",
              larg=(larg_righe[i] if larg_righe else None))
        if chevron:
            I(t, "chevron-destra", x + w - h * 0.17, y + h / 2 + h * 0.03, corpo_r * 1.8, s["chevron"], 2.2, id=f"{id}-chevron")


# ---------------------------------------------------------------------------- pulsante primario
def pulsante_azione(t: Tela, x: float, y: float, w: float, h: float, etichetta: str, corpo: float, r: float | None = None,
                    id: str = "pulsante-primario", icona: str = "play", freccia: bool = True, x_testo: float | None = None,
                    peso: int = 600, a_destra: str | None = None, colore_a: str = "#2E78F2"):
    """Pulsante blu con pallino bianco a sinistra (play) e freccia a destra; `x_testo` assoluto o centrato."""
    r = r if r is not None else h * 0.26
    with t.gruppo(id):
        R(t, x, y, w, h, r, t.sfumatura(["#3F88F8", "#2A74F0"], 0, 0, 1, 0), id=f"{id}-fondo",
          filtro=t.ombra(t.p(4), t.p(12), "#2563EB", 0.24))
        rc = h * 0.31
        if icona:
            C(t, x + h * 0.52, y + h / 2, rc, "#FFFFFF", id=f"{id}-pallino")
            if icona == "play":
                I(t, "play", x + h * 0.52 + rc * 0.08, y + h / 2, rc * 1.35, colore_a, 1.2)
            else:
                I(t, icona, x + h * 0.52, y + h / 2, rc * 1.1, colore_a, 2)
        xt = x_testo if x_testo is not None else x + h * 1.05
        T(t, etichetta, xt, y + h / 2 + corpo * 0.36, corpo, peso, "#FFFFFF", id=f"{id}-testo")
        if a_destra:
            T(t, a_destra, x + w - h * 0.8, y + h / 2 + corpo * 0.36, corpo * 0.9, 500, "#FFFFFF", "end")
        if freccia:
            I(t, "freccia-destra", x + w - h * 0.42, y + h / 2, h * 0.4, "#FFFFFF", 1.7, id=f"{id}-freccia")


# ---------------------------------------------------------------------------- navigazione
def nav(t: Tela, voci: list[tuple[str, str]], attiva: int, y: float, h: float, corpo: float = 14, ico: float = 30,
        x0: float = 0, x1: float | None = None, indicatore: bool = True, centri: list[float] | None = None,
        icone_attive: dict | None = None, kit: str = "blu", y_ico: float | None = None, y_lab: float | None = None):
    """Barra di navigazione inferiore: icone con contorno, la voce attiva piena e blu."""
    x1 = x1 if x1 is not None else t.w / t.k
    k = KIT[kit]
    with t.gruppo("barra-di-navigazione"):
        R(t, x0, y, x1 - x0, h, 0, "#FFFFFF", id="nav-fondo", filtro=t.ombra(-t.p(1), t.p(12), "#0F172A", 0.05))
        L(t, x0, y, x1, y, "#E9EDF3", 1)
        m = (x1 - x0) / len(voci)
        for i, (ic, et) in enumerate(voci):
            cx = centri[i] if centri else x0 + m * i + m / 2
            att = i == attiva
            col = k["azione"] if att else "#718096"
            nome = ic
            if att and icone_attive and ic in icone_attive:
                nome = icone_attive[ic]
            I(t, nome, cx, y + (y_ico if y_ico is not None else h * 0.296), ico, col, 2.0, id=f"nav-icona-{et.lower()}")
            T(t, et, cx, y + (y_lab if y_lab is not None else h * 0.648), corpo, 600 if att else 500, col, "middle", id=f"nav-{et.lower()}")
    if indicatore:
        indicatore_home(t, x0 + (x1 - x0) / 2, y + h - 0.1 * h - 5)


def nav_home3(t: Tela, attiva: int, y: float, h: float, **kw):
    """Home / Simulazioni / Lezioni (app attuale)."""
    return nav(t, [("casa", "Home"), ("barre-contorno", "Simulazioni"), ("libro", "Lezioni")], attiva, y, h, **kw)


# ---------------------------------------------------------------------------- card: prossimo obiettivo, impatto, fattori
def tile_icona(t: Tela, nome: str, x: float, y: float, lato: float, colore: str = "#2E78F2", r: float | None = None, sw: float = 1.7,
               id: str | None = None, fondo: str = "#FFFFFF"):
    """Quadrato bianco arrotondato con ombra e icona blu."""
    r = r if r is not None else lato * 0.24
    with t.gruppo(id or f"tile-{nome}"):
        R(t, x, y, lato, lato, r, fondo, filtro=ombra(t, 3, 12, "#2563EB", 0.10))
        I(t, nome, x + lato / 2, y + lato / 2, lato * 0.58, colore, sw + 0.5)


def card_obiettivo(t: Tela, x: float, y: float, w: float, h: float, materia: str, titolo: str, avanzamento: float, etichetta_av: str,
                   corpo_m: float, corpo_t: float, corpo_a: float, r: float = 18, ico: str = "libro", id: str = "prossimo-obiettivo",
                   larg_barra: float | None = None, chevron: bool = True, fondo: str = "#F4F7FC"):
    """Card 'prossimo obiettivo': tile con icona, MATERIA, titolo, barra di avanzamento, n/N lezioni.
    Proporzioni prese da 14/33 (h = altezza card): tile 0,68 h a 0,126 h dal bordo, testo a 0,99 h dopo il tile."""
    lato = h * 0.68
    with t.gruppo(id):
        R(t, x, y, w, h, r, fondo, id=f"{id}-fondo")
        tile_icona(t, ico, x + h * 0.126, y + h * 0.146, lato, id=f"{id}-tile")
        xt = x + h * 0.126 + lato + h * 0.185
        T(t, materia.upper(), xt, y + h * 0.27, corpo_m, 500, GRIGIO, spaz=corpo_m * 0.03, id=f"{id}-materia")
        T(t, titolo, xt, y + h * 0.545, corpo_t, 600, INK, id=f"{id}-titolo")
        lb = larg_barra if larg_barra is not None else w * 0.49
        hb = corpo_a * 0.63
        t.barra(t.p(xt), t.p(y + h * 0.77 - hb / 2), t.p(lb), avanzamento, h=t.p(hb), kit="blu", id=f"{id}-barra")
        T(t, etichetta_av, x + w - h * 0.22, y + h * 0.82, corpo_a, 400, GRIGIO, "end", id=f"{id}-conteggio")
        if chevron:
            I(t, "chevron-destra", x + w - h * 0.22, y + h * 0.37, corpo_t * 1.5, "#8A94A6", 2.0)


def titolo_sezione(t: Tela, testo: str, x: float, y: float, corpo: float | None = None, larg: float | None = None, info_: bool = False,
                   azione: str | None = None, x_fine: float | None = None, corpo_az: float | None = None, peso: int = 700,
                   id: str | None = None):
    """Titolo di sezione (a sinistra, y = linea di base), con eventuale (i) e azione 'Vedi percorso >' a destra fino a x_fine."""
    with t.gruppo(id or "titolo-sezione"):
        w = T(t, testo, x, y, corpo, peso, "#0B1033", larg=larg, id=(id or "titolo-sezione") + "-testo")
        corpo_eff = corpo if larg is None else fit(testo, peso, larg)
        if info_:
            info(t, x + w + corpo_eff * 0.95, y - corpo_eff * 0.3, corpo_eff * 0.43)
        if azione:
            ca = corpo_az or corpo_eff * 0.72
            I(t, "chevron-destra", x_fine - ca * 0.45, y - ca * 0.3, ca * 1.5, "#6B7280", 2.0)
            T(t, azione, x_fine - ca * 1.05, y - corpo_eff * 0.03, ca, 400, "#66708F", "end")


def grafico_percorso(t: Tela, x0: float, x1: float, ys: tuple[float, float, float], y_val, y_et,
                     valori=("82%", "62%", "28%"), etichette=("Oggi", "Dopo 5 lezioni", "Dopo 15 lezioni"),
                     corpo_v: float = 16, corpo_e: float = 14, r_pt: float = 8, xs: tuple[float, float, float] | None = None,
                     ancore=("middle", "middle", "middle"), id: str = "percorso"):
    """Linea rosso->blu con tre punti (oggi, dopo 5, dopo 15 lezioni), valori e didascalie."""
    p = t.p
    xs = xs or (x0, (x0 + x1) / 2, x1)
    col = ("#F0303B", "#6C9BF2", "#2E78F2")
    cv = ("#E6121F", "#5B6C92", "#2E78F2")
    with t.gruppo(id):
        g = t.sfumatura(["#F87171", "#A78BFA", "#3B82F6"], p(xs[0]), 0, p(xs[2]), 0, userspace=True)
        t.path(f"M{n(p(xs[0]))} {n(p(ys[0]))}L{n(p(xs[1]))} {n(p(ys[1]))}L{n(p(xs[2]))} {n(p(ys[2]))}", stroke=g, sw=p(2.4), id=f"{id}-linea")
        L(t, xs[0], ys[0] + 6, xs[0], ys[0] + 34, "#F8B4B4", 2.4)
        for i in range(3):
            C(t, xs[i], ys[i], r_pt, col[i], id=f"{id}-punto-{i + 1}")
            if i == 1:
                C(t, xs[i], ys[i], r_pt * 0.95, "#FFFFFF", opacita=0.0)
        yv = y_val if isinstance(y_val, (tuple, list)) else (y_val,) * 3
        ye = y_et if isinstance(y_et, (tuple, list)) else (y_et,) * 3
        for i in range(3):
            T(t, valori[i], xs[i], yv[i], corpo_v, 700 if i == 0 else 600, cv[i], ancore[i], id=f"{id}-valore-{i + 1}")
            T(t, etichette[i], xs[i], ye[i], corpo_e, 400, GRIGIO, ancore[i], id=f"{id}-etichetta-{i + 1}")


def barra_fattore(t: Tela, x: float, y: float, w: float, valore: float, h: float, colore: str, chiaro: str, id: str | None = None):
    """Barra di progresso di un fattore (grammatica…): fondo grigio chiaro, riempimento a sfumatura."""
    with t.gruppo(id or "barra-fattore"):
        R(t, x, y, w, h, h / 2, "#E9EDF4")
        if valore > 0:
            R(t, x, y, max(h, w * valore), h, h / 2, t.sfumatura([chiaro, colore], 0, 0, 1, 0))


# colore delle barre: rosso <30, arancio <50, giallo..., verde
def colore_fattore(v: float) -> tuple[str, str]:
    if v < 0.4:
        return "#F04A55", "#FF8A8F"
    if v < 0.5:
        return "#F59E0B", "#FFD27A"
    if v < 0.7:
        return "#F5A623", "#FFD98A"
    return "#10B070", "#6FDBA9"


def icona_fattore(t: Tela, nome: str, cx: float, cy: float, lato: float, id: str | None = None):
    """Tile bianco con icona blu della competenza (grammatica=libro, comprensione=cuffie, vocabolario=Aa, ragionamento=ingranaggio)."""
    x, y = cx - lato / 2, cy - lato / 2
    with t.gruppo(id or f"fattore-{nome}"):
        R(t, x, y, lato, lato, lato * 0.28, "#FFFFFF", filtro=ombra(t, 3, 12, "#2563EB", 0.10))
        if nome == "Aa":
            T(t, "Aa", cx, cy + lato * 0.19, lato * 0.58, 600, "#2E78F2", "middle")
        else:
            ic = {"libro": ("libro-pieno", 1.0), "cuffie": ("cuffie", 1.8), "ingranaggio": ("ingranaggio", 1.8)}[nome]
            I(t, ic[0], cx, cy, lato * 0.62, "#2E78F2", ic[1] + 0.3)


def riga_fattore(t: Tela, x: float, y: float, w: float, nome: str, icona: str, valore: float, corpo_n: float,
                 corpo_v: float, lato_ico: float, x_barra: float, w_barra: float, h_barra: float, y_nome: float,
                 y_barra: float, x_pct: float, id: str | None = None, chevron: bool = True, pct_col: str = INK):
    """Una riga dell'elenco 'fattori': icona, nome, barra, percentuale, chevron. y = centro verticale della riga."""
    c, ch = colore_fattore(valore)
    with t.gruppo(id or f"fattore-{nome.lower()}"):
        icona_fattore(t, icona, x + lato_ico / 2, y, lato_ico)
        T(t, nome, x_barra, y_nome, corpo_n, 500, "#1F2937", id=f"{id or nome.lower()}-nome")
        barra_fattore(t, x_barra, y_barra, w_barra, valore, h_barra, c, ch)
        T(t, f"{round(valore * 100)}%", x_pct, y_barra + h_barra / 2 + corpo_v * 0.36 + 2, corpo_v, 600, pct_col, "end")
        if chevron:
            I(t, "chevron-destra", x + w - 14, y, corpo_v * 2.0, "#8A94A6", 2.0)


def salva(t: Tela, cartella: str, nome: str):
    p = t.salva(OUT / cartella / nome)
    print(p)
    return p


def controlla(svg: pathlib.Path, originale: pathlib.Path, nome_tavola: str, k: float = 1.0):
    """Lancia controlla_schermata.py e salva la tavola in brand/concept-svg/_tavole/home/<nome_tavola>.png."""
    import subprocess
    TAVOLE.mkdir(parents=True, exist_ok=True)
    r = subprocess.run([sys.executable, str(QUI.parent / "controlla_schermata.py"), str(svg), str(originale),
                        str(TAVOLE / f"{nome_tavola}.png"), "--k", str(k)], capture_output=True, text=True)
    print((r.stdout or r.stderr).strip())
    return r.stdout.strip()


def vuole_tavola() -> bool:
    return "--tavola" in sys.argv


def sfum_op(t: Tela, stops: list[tuple[float, str, float]], x1=0, y1=0, x2=1, y2=0, userspace=False) -> str:
    """linearGradient con opacita' per fermata: stops = [(offset, colore, opacita)] (ui.sfumatura non le ha)."""
    chiave = ("linop", tuple(stops), x1, y1, x2, y2, userspace)
    if chiave in t._chiavi:
        return t._chiavi[chiave]
    gid = t.uid("so")
    unit = ' gradientUnits="userSpaceOnUse"' if userspace else ""
    fermate = "".join(f'<stop offset="{n(o)}" stop-color="{c}" stop-opacity="{n(a)}"/>' for o, c, a in stops)
    t.defs.append(f'<linearGradient id="{gid}" x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}"{unit}>{fermate}</linearGradient>')
    t._chiavi[chiave] = f"url(#{gid})"
    return t._chiavi[chiave]


def ritaglio(percorso, box, inpaint=None) -> str:
    """Ritaglia `box` (x0,y0,x1,y1) da un'immagine; `inpaint` = rettangoli (pulsanti dell'interfaccia sopra la foto)
    ripuliti con cv2.inpaint. Restituisce il percorso di un PNG temporaneo (le foto restano raster)."""
    import tempfile
    import numpy as np
    from PIL import Image
    im = Image.open(percorso).convert("RGB")
    if inpaint:
        import cv2
        a = np.asarray(im).copy()
        m = np.zeros(a.shape[:2], np.uint8)
        for x0, y0, x1, y1 in inpaint:
            m[y0:y1, x0:x1] = 255
        im = Image.fromarray(cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA))
    f = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    im.crop(box).save(f.name)
    return f.name
