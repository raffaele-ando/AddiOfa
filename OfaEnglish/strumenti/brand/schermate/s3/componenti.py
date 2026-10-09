"""
Componenti ripetuti delle schermate delle immagini 06 (sfide, classifica, profilo, progressi: kit BLU) e
19 (profilo, statistiche, frasi, quiz, simulazione: kit ROSSO, nell'originale). Si disegna in PUNTI TELEFONO
(390 di larghezza): le schermate AI hanno scale diverse tra loro, qui hanno tutte la stessa scala tipografica.

Contenuto: barra di stato, tab-bar (3 o 5 voci), header con titolo, segmenti (tab a pillola), riga classifica,
riga sfida, riga impostazioni, scheda statistica, barre di progresso, grafico a barre, grafico a linea,
avatar neutro, riquadro d'icona, glifi colorati (fiamma, bersaglio verde, libro, medaglie) e il riuso di
illustrazioni già disegnate (`illu_in`).
"""
from __future__ import annotations

import json, math, pathlib, sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from ui import *  # noqa
from ui import Tela, ICONE, larghezza_testo, n, BRAND, RADICE, KIT  # noqa

OUT = RADICE / "brand/concept-svg/schermate"
TAVOLE = RADICE / "brand/concept-svg/_tavole/s3"
ORIG = RADICE / "brand/concept"
BBOX = QUI.parent / "bbox_illustrazioni.json"

# colori campionati sulle immagini
NAVY = "#0B1250"      # titoli
SOTTO = "#5A668F"     # sottotitoli
TESTO = "#1B2459"
PILL = "#F1F4F9"      # tab non attiva
AZZ = "#0A6CF8"       # azione kit blu (06)
ROS = "#F5283A"       # azione kit rosso (19)
ARANCIO = "#F59E0B"
VERDE_S = "#17A765"
VERDE_F = "#E8F8F0"
GRIGIO_I = "#8A94A6"
FILO = "#E8ECF3"

KITS = {"blu": dict(az=AZZ, pallido="#EAF2FE", bordo="#9CC2FB", chiaro="#6EA6FB", fondo_sel="#EAF2FE"),
        "rosso": dict(az=ROS, pallido="#FEEEF0", bordo="#F9A3AB", chiaro="#F87171", fondo_sel="#FEEEF0")}

# ---------------------------------------------------------------------------- icone in più (griglia 24)
ICONE.update({
    "link": [("p", "M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1")],
    "aiuto": [("c", (12, 12, 9)), ("p", "M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.7.400-1 .900-1 1.700"), ("cf", (12, 17, 1.100))],
    "sliders": [("p", "M4 7h8M18 7h2M4 17h2M12 17h8"), ("c", (15, 7, 2.500)), ("c", (9, 17, 2.500))],
    "volume": [("pf", "M4 9.500h3.500L12 6v12l-4.500-3.500H4z"), ("p", "M15.500 9a4 4 0 0 1 0 6M18.300 6.500a8 8 0 0 1 0 11")],
    "stella-contorno": [("p", "M12 3.500l2.600 5.300 5.800.8-4.200 4.100 1 5.800-5.200-2.700-5.200 2.700 1-5.800L3.600 9.600l5.800-.8z")],
    "bandiera": [("pf", "M6 4.500h11.500l-2.200 4 2.200 4H6z"), ("p", "M6 3.500V21")],
    "segnalibro": [("p", "M7 4h10v17l-5-4-5 4z")],
    "cronometro": [("c", (12, 13.500, 7.500)), ("p", "M12 9.500v4l2.500 1.500M9.500 3h5M12 3v3")],
    "copia": [("p", "M9 8h10a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3")],
    "fotocamera": [("p", "M4 8h3l1.500-2.500h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"), ("c", (12, 13.500, 3.500))],
    "lampadina": [("p", "M9 17h6M10 20.500h4M12 3a6 6 0 0 0-3.500 10.900c.6.500 1 1.200 1 2.100h5c0-.9.400-1.600 1-2.100A6 6 0 0 0 12 3z")],
    "cuffie": [("p", "M4 15v-3a8 8 0 0 1 16 0v3"), ("pf", "M4 14h3v6H5.500A1.500 1.500 0 0 1 4 18.500zM17 14h3v4.500a1.500 1.500 0 0 1-1.500 1.500H17z")],
    "giorno-cal": [("p", "M5 6.500h14a1.500 1.500 0 0 1 1.500 1.500v10.500a1.500 1.500 0 0 1-1.500 1.500H5A1.500 1.500 0 0 1 3.500 18.500V8A1.500 1.500 0 0 1 5 6.500zM3.500 11h17M8 3.500v4M16 3.500v4"), ("cf", (12, 15, 1.300))],
    "utente-contorno": [("c", (12, 8, 4)), ("p", "M4.500 20.500c0-3.700 3.300-6 7.500-6s7.500 2.300 7.500 6")],
    "libro-aperto": [("p", "M12 6.500C10 5 7 4.600 3.500 5v13c3.500-.4 6.500 0 8.500 1.500 2-1.500 5-1.900 8.500-1.500V5C17 4.600 14 5 12 6.500zM12 6.500v13")],
    "ingr": [("c", (12, 12, 3.200)), ("p", "M12 2.800v2.400M12 18.800v2.400M2.800 12h2.400M18.800 12h2.400M5.500 5.500l1.700 1.700M16.800 16.800l1.700 1.700M18.500 5.500l-1.700 1.700M7.200 16.800l-1.700 1.700"), ("c", (12, 12, 6.800))],
    "notifica": [("p", "M6 16.500V11a6 6 0 0 1 12 0v5.500l1.500 1.500h-15zM10 20.500a2 2 0 0 0 4 0")],
    "mic": [("p", "M12 3.500a3 3 0 0 0-3 3V11a3 3 0 0 0 6 0V6.500a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v3.500")],
    "casa-contorno": [("p", "M4 11 12 4l8 7v8.500a1.500 1.500 0 0 1-1.500 1.500H15v-6H9v6H5.500A1.500 1.500 0 0 1 4 19.500z")],
    "barre-contorno": [("p", "M4.500 20.500v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6zM9.500 20.500v-11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11zM14.500 20.500V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v15.500z")],
    "barre-pieno": [("pf", "M4.500 20.500v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6zM9.500 20.500v-11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11zM14.500 20.500V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v15.500z")],
    "casa-pieno": [("pf", "M4 11 12 4l8 7v8.500a1.500 1.500 0 0 1-1.500 1.500H15v-6H9v6H5.500A1.500 1.500 0 0 1 4 19.500z")],
    "trofeo-pieno": [("pf", "M7.500 4h9v5.500a4.500 4.500 0 0 1-9 0z"), ("p", "M7.500 6H4.500v1.500A3 3 0 0 0 7.500 10.500M16.500 6h3v1.500a3 3 0 0 1-3 3M12 14v3.500M8.500 20h7M10 17.500h4")],
    "libro-pieno": [("pf", "M12 6.500C10 5 7 4.600 3.500 5v13c3.500-.4 6.500 0 8.500 1.500 2-1.500 5-1.900 8.500-1.500V5C17 4.600 14 5 12 6.500z")],
    "documento-pieno": [("pf", "M6.500 3h7l4.500 4.500V19.500a1.500 1.500 0 0 1-1.500 1.500h-10A1.500 1.500 0 0 1 5 19.500v-15A1.500 1.500 0 0 1 6.500 3z")],
    "utente-pieno": [("cf", (12, 8, 4)), ("pf", "M4 20.500c0-4 3.600-6.500 8-6.500s8 2.500 8 6.500z")],
    "tempo": [("c", (12, 12, 9)), ("p", "M12 7v5.200l3.300 2")],
})


def stato(t):
    t.barra_stato()


def schermata(nome: str, kit: str = "blu", h: float = 844, sfondo: str = "#FFFFFF") -> Tela:
    """Telefono: parte bianca con angoli arrotondati e filo chiaro, fondo trasparente (come s1)."""
    t = Tela(390, h, fondo=None, id=f"schermata-{nome}")
    t.kit = kit
    t.K = KITS[kit]
    t.rett(0.5, 0.5, 389, h - 1, 26, fill=sfondo, stroke="#E6EAF2", sw=1, id="schermata-fondo")
    return t


def corpo_per(testo: str, larghezza: float, peso: int = 700) -> float:
    return larghezza / larghezza_testo(testo, 1.0, peso)


# ---------------------------------------------------------------------------- strutture
def tab_bar(t: Tela, voci, attiva: int | None, y: float | None = None, h: float = 84):
    """voci: [(icona, etichetta)]; attiva = indice o None. Colore attivo del kit."""
    y = t.h - h if y is None else y
    az = t.K["az"]
    with t.gruppo("barra-di-navigazione"):
        t.rett(0, y, 390, h, 0, fill="#FFFFFF", r_angoli=(0, 0, 26, 26), filtro=t.ombra(-1, 12, "#0F172A", 0.05))
        t.linea(14, y, 376, y, "#EEF1F6", 1, cap="butt")
        m = 390 / len(voci)
        for i, (ic, ic_on, et) in enumerate(voci):
            cx = m * i + m / 2
            on = i == attiva
            col = az if on else "#7C87A6"
            t.icona(ic_on if on else ic, cx - 13, y + 13, 26, col, 1.9, id=f"nav-icona-{et.lower()}")
            t.testo(et, cx, y + 53, 11.5, 600 if on else 500, col, "middle", id=f"nav-{et.lower()}")
        t.rett(195 - 67, y + h - 11, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.9)


NAV3 = [("casa-contorno", "casa-pieno", "Home"), ("barre-contorno", "barre-pieno", "Studia"), ("trofeo", "trofeo-pieno", "Sfide")]
NAV5 = [("casa-contorno", "casa-pieno", "Home"), ("libro-aperto", "libro-pieno", "Lezioni"), ("documento", "documento-pieno", "Quiz"),
        ("trofeo", "trofeo-pieno", "Classifica"), ("utente-contorno", "utente-pieno", "Profilo")]


def titolo(t: Tela, testo: str, y: float = 66, x: float = 24, corpo: float = 28, peso: int = 800, id: str = "titolo"):
    t.testo(testo, x, y, corpo, peso, NAVY, id=id)


def tondo_azione(t: Tela, icona: str, cx: float = 351, cy: float = 55, r: float = 19, fondo: str = "#E8EEFA", colore: str = NAVY):
    with t.gruppo("azione-header"):
        t.cerchio(cx, cy, r, fill=fondo)
        t.icona(icona, cx - r * 0.56, cy - r * 0.56, r * 1.12, colore, 1.9)


def segmenti(t: Tela, voci, attiva: int, y: float = 100, h: float = 38, x0: float = 24, x1: float = 366, gap: float = 6,
             stile: str = "pieno", pesi=None, corpo: float = 13.5, id: str = "segmenti"):
    """Tab a pillola. stile 'pieno' = attiva piena di colore (testo bianco); 'bordo' = fondo pallido e filo colorato."""
    K = t.K
    tot = [larghezza_testo(v, corpo, 600) + 30 for v in voci]
    # larghezze proporzionali alle etichette, riempiendo [x0, x1]
    spazio = (x1 - x0) - gap * (len(voci) - 1)
    ws = [w / sum(tot) * spazio for w in tot]
    x = x0
    with t.gruppo(id):
        for i, (v, w) in enumerate(zip(voci, ws)):
            on = i == attiva
            if on and stile == "pieno":
                t.rett(x, y, w, h, h * 0.3, fill=K["az"], id=f"segmento-{i + 1}", filtro=t.ombra(2, 6, K["az"], 0.22))
                col = "#FFFFFF"
            elif on:
                t.rett(x, y, w, h, h * 0.3, fill=K["pallido"], stroke=K["bordo"], sw=1.3, id=f"segmento-{i + 1}")
                col = K["az"]
            else:
                t.rett(x, y, w, h, h * 0.3, fill=PILL, id=f"segmento-{i + 1}")
                col = SOTTO
            t.testo(v, x + w / 2, y + h / 2 + corpo * 0.35, corpo, 600 if on else 500, col, "middle")
            x += w + gap


def link_destra(t: Tela, testo: str, x: float, y: float, corpo: float = 13.5):
    t.testo(testo, x, y, corpo, 500, t.K["az"], "end", id="link-" + testo.lower().replace(" ", "-"))


def sezione(t: Tela, testo: str, y: float, link: str | None = None, x: float = 24, corpo: float = 18):
    t.testo(testo, x, y, corpo, 700, NAVY, id="sezione-" + testo.lower().replace(" ", "-"))
    if link:
        link_destra(t, link, 366, y - 1)


def freccia_dx(t: Tela, x: float, cy: float, col: str = "#8A94A6", s: float = 14):
    t.icona("chevron-destra", x - s / 2, cy - s / 2, s, col, 2.2)


def avatar(t: Tela, cx: float, cy: float, r: float, tono: int = 0, id: str = "avatar", anello: str | None = None):
    """Foto-avatar dei dati di esempio: cerchio neutro con silhouette (le foto non si riproducono)."""
    toni = ["#CBD5E1", "#C7D2E4", "#D3DAE6", "#BFCADB", "#CDD3DF"]
    if anello:
        t.cerchio(cx, cy, r + 2.5, fill="none", stroke=anello, sw=2.2)
    t.avatar(cx, cy, r, toni[tono % len(toni)], id=id)


def tile_icona(t: Tela, x: float, y: float, s: float, fondo: str, r: float | None = None, id: str = "riquadro-icona"):
    t.rett(x, y, s, s, r if r is not None else s * 0.27, fill=fondo, id=id)


# ---------------------------------------------------------------------------- glifi colorati
def _grad(t, a, b, vert=True):
    return t.sfumatura([a, b]) if vert else t.sfumatura([a, b], 0, 0, 1, 0)


def g_fiamma(t, cx, cy, s):
    d = dict(ICONE["fiamma"])
    k = s / 24
    g = t.sfumatura(["#FFB020", "#F2601B"], 0, 0, 0, 1)
    with t.gruppo("glifo-fiamma"):
        t.add(f'<g transform="translate({n(cx - s / 2)} {n(cy - s / 2)}) scale({n(k)})"><path d="{ICONE["fiamma"][0][1]}" fill="{g}" stroke="{g}" stroke-width="1" stroke-linejoin="round"/>'
              f'<path d="M12 21a3 3 0 0 1-3-3c0-2 1.800-2.800 3-5 1.200 2.200 3 3 3 5a3 3 0 0 1-3 3z" fill="#FFD25A"/></g>')


def g_bersaglio(t, cx, cy, s, col="#17A765", freccia="#0E7A4A"):
    r = s / 2 * 0.86
    with t.gruppo("glifo-bersaglio"):
        t.cerchio(cx - s * 0.04, cy + s * 0.05, r, fill=col)
        t.cerchio(cx - s * 0.04, cy + s * 0.05, r * 0.66, fill="#FFFFFF")
        t.cerchio(cx - s * 0.04, cy + s * 0.05, r * 0.52, fill=col)
        t.cerchio(cx - s * 0.04, cy + s * 0.05, r * 0.26, fill="#FFFFFF")
        t.cerchio(cx - s * 0.04, cy + s * 0.05, r * 0.15, fill=freccia)
        x0, y0 = cx - s * 0.04, cy + s * 0.05
        t.linea(x0, y0, x0 + s * 0.42, y0 - s * 0.42, freccia, s * 0.06)
        t.path(f"M{n(x0 + s * 0.30)} {n(y0 - s * 0.46)}L{n(x0 + s * 0.40)} {n(y0 - s * 0.50)}L{n(x0 + s * 0.50)} {n(y0 - s * 0.40)}L{n(x0 + s * 0.46)} {n(y0 - s * 0.30)}z", fill=freccia)


def g_libro(t, cx, cy, s, col="#1B7BF0"):
    with t.gruppo("glifo-libro"):
        t.add(f'<g transform="translate({n(cx - s / 2)} {n(cy - s / 2)}) scale({n(s / 24)})"><path d="M12 6.500C10 5 7 4.600 3 5v13.500c3.500-.4 6.500 0 9 1.700 2.500-1.700 5.500-2.100 9-1.700V5c-4-.4-7 0-9 1.500z" fill="{col}"/>'
              f'<path d="M12 7v12.500" stroke="#FFFFFF" stroke-width="1.100"/><g fill="#FFFFFF"><rect x="5.500" y="8.500" width="2.200" height="2.200" rx=".5"/><rect x="5.500" y="12.500" width="2.200" height="2.200" rx=".5"/><rect x="16.300" y="8.500" width="2.200" height="2.200" rx=".5"/><rect x="16.300" y="12.500" width="2.200" height="2.200" rx=".5"/></g></g>')


def g_medaglia(t, cx, cy, s, fondo="#8B3FF0", icona="stella"):
    with t.gruppo(f"glifo-medaglia-{icona}"):
        g = t.sfumatura([fondo, "#6D28D9" if fondo.startswith("#8") else fondo], 0, 0, 1, 1)
        t.cerchio(cx, cy, s / 2, fill=g)
        t.icona(icona, cx - s * 0.27, cy - s * 0.28, s * 0.54, "#FFFFFF", 1.4, fill_pieno="#FFFFFF")


def g_trofeo(t, cx, cy, s, col="#F5A31A"):
    g = t.sfumatura(["#FFC94A", "#F59E0B"])
    with t.gruppo("glifo-trofeo"):
        k = s / 24
        t.add(f'<g transform="translate({n(cx - s / 2)} {n(cy - s / 2)}) scale({n(k)})" fill="none" stroke="{col}" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round">'
              f'<path d="M7.500 3.500h9v6a4.500 4.500 0 0 1-9 0z" fill="{g}"/><path d="M7.500 5.500h-3v1.500a3 3 0 0 0 3 3M16.500 5.500h3v1.500a3 3 0 0 1-3 3"/><path d="M12 14v3.500M8.500 20.500h7M10 17.500h4"/></g>')


def g_lucchetto(t, cx, cy, s, col="#9AA5BC"):
    with t.gruppo("glifo-lucchetto"):
        t.icona("lucchetto", cx - s / 2, cy - s / 2, s, col, 1.6)


# ---------------------------------------------------------------------------- righe e schede
def riga_sfida(t, y0, tit, d1, d2, val, tot, pt, glifo, fondo, x=24, tile=62):
    """Riga di sfida a tutta larghezza (y0 = linea di base del titolo): riquadro d'icona, titolo, 2 righe di testo, barra, n/tot, punti."""
    with t.gruppo("sfida-" + tit.lower().replace(" ", "-")):
        tile_icona(t, x + 6, y0 - 17, tile, fondo, 16)
        glifo(t, x + 6 + tile / 2, y0 - 17 + tile / 2, tile * (0.7 if glifo is not g_fiamma else 0.85))
        t.testo(tit, x + 92, y0, 17, 700, NAVY)
        t.testo(d1, x + 92, y0 + 24, 13, 400, SOTTO)
        if d2:
            t.testo(d2, x + 92, y0 + 42, 13, 400, SOTTO)
        t.barra(x + 92, y0 + 56, 135, val / tot if val else 0, h=7, kit=t.kit, fondo="#ECEFF5")
        t.testo(f"{val}/{tot}", x + 262, y0 + 64, 13, 400, SOTTO, "end")
        t.testo(pt, 366, y0 + 64, 14.5, 700, ARANCIO, "end")
        freccia_dx(t, 354, y0 + 20, "#8A94A6", 14)


def riga_classifica(t, yc, pos, nome, pt, evid=False, tono=0, sep=True):
    """Riga di classifica (yc = centro): posizione, avatar, nome, punti; evidenziata = la riga dell'utente."""
    with t.gruppo(f"classifica-{pos}"):
        if evid:
            t.rett(24, yc - 25, 342, 50, 15, fill="#E8F1FE", id="riga-utente")
        elif sep:
            t.linea(40, yc + 25, 366, yc + 25, "#F0F2F8", 1, cap="butt")
        t.testo(str(pos), 48, yc + 5, 15, 700, NAVY, "middle")
        if evid:
            t.cerchio(105, yc, 17, fill="#D8E7FD")
            t.testo("R", 105, yc + 6.5, 18, 600, AZZ, "middle")
        else:
            avatar(t, 105, yc, 17, tono)
        t.testo(nome, 136, yc + 5.5, 15, 600, AZZ if evid else NAVY)
        t.testo(f"{pt} pt", 351, yc + 5.5, 14.5, 400, "#7A86A8" if not evid else AZZ, "end")


def riga_amico(t, y, pos, nome, pt, tono=0, x0=24):
    rosso = pos in (1, 3)
    with t.gruppo(f"amico-{pos}"):
        t.testo(str(pos), x0 + 8, y + 6, 17, 700, "#B3171D" if rosso else NAVY, "middle")
        avatar(t, x0 + 62, y, 23, tono)
        t.testo(nome, x0 + 100, y - 3, 15, 700, NAVY)
        t.testo(f"{pt} pt", x0 + 100, y + 16, 13, 400, "#7A86A8")
        t.icona("dot-menu", 322, y - 12, 24, "#1E3A9E", 2)


def scheda_stat(t, x, y, w, h, etichetta, valore, sub=None, barra=None, glifo=None, fondo="#FFFFFF", id="scheda-statistica"):
    t.rett(x, y, w, h, 14, fill=fondo, stroke="#EDF0F6", sw=1, id=id, filtro=t.ombra(2, 8, "#0F172A", 0.05))


def barra_etichettata(t, x, y, w, valore, h=7, colore=None):
    t.barra(x, y, w, valore, h=h, kit=t.kit, colore=colore)


# ---------------------------------------------------------------------------- grafici
def grafico_barre(t: Tela, x: float, y: float, w: float, h: float, valori, evid_da: int = 0, id: str = "grafico-barre"):
    """Barre arrotondate, altezza proporzionale (0..1); più scure le recenti (opacità crescente) come nell'originale."""
    n_ = len(valori)
    gap = 5
    bw = (w - gap * (n_ - 1)) / n_
    with t.gruppo(id):
        for i, v in enumerate(valori):
            bh = max(6, h * v)
            op = 0.28 + 0.72 * (i / (n_ - 1)) ** 0.8
            col = t.K["az"]
            t.rett(x + i * (bw + gap), y + h - bh, bw, bh, min(3, bw / 2), fill=col, opacita=op, id=f"barra-{i + 1}")


def grafico_linea(t: Tela, x: float, y: float, w: float, h: float, punti, etich_y=(100, 75, 50, 25, 0), etich_x=None, id="grafico-andamento"):
    """punti: valori 0..100; asse y a 5 livelli, linea blu con area sfumata e pallini."""
    K = t.K
    with t.gruppo(id):
        for i, e in enumerate(etich_y):
            yy = y + h * i / (len(etich_y) - 1)
            t.linea(x + 34, yy, x + w, yy, "#EEF1F6", 1, cap="butt")
            t.testo(f"{e}%", x, yy + 4, 10.5, 500, "#98A1B8")
        gx0, gx1 = x + 52, x + w - 10
        xs = [gx0 + (gx1 - gx0) * i / (len(punti) - 1) for i in range(len(punti))]
        ys = [y + h * (1 - v / 100) for v in punti]
        for xx in (xs[0], xs[len(xs) // 2], xs[-1]):
            t.linea(xx, y, xx, y + h, "#EEF1F6", 1, cap="butt")
        d = f"M{n(xs[0])} {n(ys[0])}" + "".join(f"L{n(a)} {n(b)}" for a, b in zip(xs[1:], ys[1:]))
        area = d + f"L{n(xs[-1])} {n(y + h)}L{n(xs[0])} {n(y + h)}z"
        t.path(area, fill=t.sfumatura(["#DCE9FD", "#FFFFFF"]), id="area")
        t.path(d, stroke=K["az"], sw=2.6, id="linea")
        for a, b in zip(xs, ys):
            t.cerchio(a, b, 5, fill=K["az"], stroke="#FFFFFF", sw=1.5)
        if etich_x:
            for xx, e in zip((xs[0], xs[len(xs) // 2], xs[-1]), etich_x):
                t.testo(e, xx, y + h + 20, 11, 500, "#98A1B8", "middle")
    return xs, ys


# ---------------------------------------------------------------------------- illustrazioni
def illu_in(t: Tela, nome: str, x0: float, y0: float, x1: float, y1: float, id: str | None = None, soglia: int = 60, per="larghezza"):
    """Illustrazione già disegnata: la parte visibile occupa il riquadro (pt)."""
    cache = json.loads(BBOX.read_text()) if BBOX.exists() else {}
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
        try:
            BBOX.write_text(json.dumps(cache, indent=1))
        except Exception:
            pass
    vw, vh, bx0, by0, bx1, by1 = cache[chiave]
    sc = ((x1 - x0) / (bx1 - bx0)) if per == "larghezza" else ((y1 - y0) / (by1 - by0))
    ox = (x0 + x1) / 2 - ((bx0 + bx1) / 2) * sc
    oy = (y0 + y1) / 2 - ((by0 + by1) / 2) * sc
    t.illustrazione(nome, ox, oy, vw * sc, id=id or nome.split("/")[-1])


def salva(t: Tela, cartella: str, nome: str):
    p = OUT / cartella / nome
    t.salva(p)
    print(p)
    return p
