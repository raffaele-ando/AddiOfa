"""
Il logo di AddiOFA — la porta a stella da cui entra la luce — costruito come scena 3D in SVG.

Niente ricalco: ogni pezzo è una forma geometrica con un nome e i suoi parametri, così il file
resta leggibile e modificabile a mano (colori, luce, profondità, raggio degli angoli).

La scena, in prospettiva centrale con punto di fuga V:
  1. ombra blu attorno alla piastrella, sul fondo bianco
  2. piastrella a angoli continui (squircle) che fa da cornice a tutto
  3. muro blu con la sua sfumatura e il riflesso della luce attorno alla porta
  4. pavimento, con il bagliore all'orizzonte e il fascio di luce che esce dalla porta
  5. porta a stella: vano luminoso in fondo e pareti interne (lo spessore del muro),
     ognuna con la sua sfumatura dalla luce (in fondo) al bordo (davanti)
  6. filo di luce sul bordo del taglio e bagliore che trabocca dal vano

Il punto di partenza e i numeri sono misurati sulla reference; `ottimizza.py` li rifinisce
confrontando in continuazione il render con l'immagine originale.

Versione misurata (`rifinisci.py`): la geometria resta quella della scena (contorno del taglio,
vano, soglia, linea curva tra muro e pavimento, tutti con i loro vertici e raggi), mentre la luce
di muro, pavimento, pareti del taglio e vano è una "maglia di sfumature": una griglia di nodi
colorati interpolata in modo bilineare, fatta con semplici sfumature lineari e maschere SVG.
Quando una zona ha la sua maglia, le sfumature disegnate a mano di quella zona non si disegnano
(restano nei parametri come versione "modello"). Sopra: filo di luce del taglio, bordo in rilievo
della piastrella e grana del materiale. Le varianti di colore si fanno con `ricolora_logo.py`.
"""
from __future__ import annotations

import json
import math
import pathlib

QUI = pathlib.Path(__file__).resolve().parent
LATO = 1254

# Vertici della porta sul muro, in senso orario dalla punta in alto (misurati sulla reference).
# P4 e P5 sono gli stipiti che arrivano al pavimento: lì la stella diventa porta.
NOMI_VERTICI = ["punta_alto", "incavo_dx", "punta_dx", "incavo_basso_dx", "stipite_dx",
                "stipite_sx", "incavo_basso_sx", "punta_sx", "incavo_sx"]
NOMI_FACCE = ["alto_dx", "braccio_dx_sopra", "braccio_dx_sotto", "stipite_dx",
              "soglia", "stipite_sx", "braccio_sx_sotto", "braccio_sx_sopra", "alto_sx"]

PARAMETRI_INIZIALI = {
    "piastrella": {"x0": 68.0, "y0": 69.0, "x1": 1186.0, "y1": 1187.0, "raggio": 262.0, "continuita": 0.78},
    "ombra": {"colore": [70, 120, 225], "opacita": 0.30, "sfocatura": 26.0, "dy": 10.0, "allarga": 6.0},
    "fondo": [253, 254, 253],
    "orizzonte": 866.0,
    # il muro è curvo: la linea dove incontra il pavimento si piega (scarto in px a sinistra, al centro, a destra)
    "curva": {"sx": 6.0, "mezzo": 0.0, "dx": -4.0},
    "muro": {
        "da": [2, 22, 72], "a": [36, 116, 232], "angolo": -40.0, "centro": 0.55, "meta": [12, 60, 160],
        "riflesso": {"colore": [70, 110, 200], "opacita": 0.45, "cx": 627.0, "cy": 560.0, "r": 420.0},
        # curvatura: il centro del muro sta più avanti, i lati si piegano indietro e prendono meno luce
        "curvatura": {"colore": [0, 10, 40], "ombra_sx": 0.35, "ombra_dx": 0.25, "centro": 0.52},
    },
    "pavimento": {
        "vicino": [60, 90, 170], "lontano": [8, 44, 125], "lato": [3, 30, 95],
        "bagliore": {"colore": [255, 214, 150], "opacita": 0.85, "cx": 622.0, "cy": 872.0, "rx": 420.0, "ry": 70.0},
        "fascio": {"colore": [255, 222, 170], "opacita": 0.80, "sx": 150.0, "dx": 1080.0, "sfocatura": 40.0,
                   "fine": [150, 140, 190], "fine_opacita": 0.35},
        "penombra": {"colore": [200, 180, 200], "opacita": 0.35, "sx": -150.0, "dx": 1400.0, "sfocatura": 70.0},
        "ambiente": {"colore": [120, 140, 210], "opacita": 0.25},
        # pavimento lucido: riflette muro e porta, schiacciati e sfocati, sempre meno man mano che ci si allontana
        "specchio": {"opacita": 0.55, "schiaccia": 0.9, "sfocatura": 6.0, "fine": 0.0, "distanza": 320.0},
        # raggi di luce che escono dalla porta: bordo alto sull'orizzonte, bordo basso in fondo alla piastrella
        "raggi": [
            {"alto": [470.0, 820.0], "basso": [350.0, 960.0], "colore": [253, 224, 160], "opacita": 0.55, "sfocatura": 25.0},
            {"alto": [760.0, 830.0], "basso": [860.0, 960.0], "colore": [253, 198, 130], "opacita": 0.45, "sfocatura": 15.0},
            {"alto": [440.0, 560.0], "basso": [330.0, 470.0], "colore": [192, 160, 168], "opacita": 0.35, "sfocatura": 25.0},
            {"alto": [620.0, 760.0], "basso": [600.0, 860.0], "colore": [253, 224, 160], "opacita": 0.30, "sfocatura": 20.0},
        ],
    },
    "porta": {
        "vertici": [[631, 271], [743, 471], [948, 520], [818, 676], [827, 866],
                    [416, 866], [429, 678], [310, 516], [502, 478]],
        "raggio": 16.0, "fuga": [640.0, 660.0], "profondita": 0.70, "spostamento": [0.0, 0.0],
        "vano": {"centro": [255, 253, 240], "bordo": [255, 238, 190], "r": 330.0},
        # per ogni faccia: colore verso il fondo (luce) e verso il muro (davanti)
        "facce": {
            "alto_dx": [[255, 228, 160], [220, 150, 90]],
            "braccio_dx_sopra": [[255, 232, 170], [214, 160, 110]],
            "braccio_dx_sotto": [[255, 220, 150], [230, 160, 100]],
            "stipite_dx": [[255, 215, 140], [235, 170, 110]],
            "soglia": [[255, 240, 200], [245, 205, 150]],
            "stipite_sx": [[255, 215, 140], [225, 160, 110]],
            "braccio_sx_sotto": [[255, 220, 150], [215, 150, 100]],
            "braccio_sx_sopra": [[255, 232, 170], [200, 150, 120]],
            "alto_sx": [[255, 228, 160], [205, 150, 110]],
        },
        # seconda sfumatura lungo ogni parete (da un vertice all'altro): colore e opacità
        "lungo": {nome: [[255, 240, 200], 0.0] for nome in NOMI_FACCE},
        "morbidezza": 3.0,  # sfocatura del bordo del vano: in fondo la luce non ha un bordo netto
        "smussatura": 4.0,  # gli spigoli tra le pareti interne sono curvi, non netti
        "filo": {"colore": [160, 180, 235], "opacita": 0.55, "spessore": 3.0,
                 # quanto si vede il filo su ogni lato del taglio (0-1), nell'ordine delle pareti
                 "lati": {nome: 1.0 for nome in NOMI_FACCE}},
        "trabocco": {"colore": [255, 230, 170], "opacita": 0.35, "sfocatura": 28.0},
    },
}


def esa(c) -> str:
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(v)))) for v in c)


def f(v: float) -> str:
    return f"{v:.1f}".rstrip("0").rstrip(".")


def squircle(x0, y0, x1, y1, r, k) -> str:
    """Rettangolo ad angoli continui: `k` = quanto la curva si stende (0.55 cerchio, ~0.8 iOS)."""
    c = r * (1 - k)
    return (f"M{f(x0 + r)} {f(y0)}H{f(x1 - r)}C{f(x1 - c)} {f(y0)} {f(x1)} {f(y0 + c)} {f(x1)} {f(y0 + r)}"
            f"V{f(y1 - r)}C{f(x1)} {f(y1 - c)} {f(x1 - c)} {f(y1)} {f(x1 - r)} {f(y1)}"
            f"H{f(x0 + r)}C{f(x0 + c)} {f(y1)} {f(x0)} {f(y1 - c)} {f(x0)} {f(y1 - r)}"
            f"V{f(y0 + r)}C{f(x0)} {f(y0 + c)} {f(x0 + c)} {f(y0)} {f(x0 + r)} {f(y0)}Z")


def arrotonda(punti, raggio, spigoli=None) -> str:
    """Poligono con gli spigoli smussati (curva quadratica), tranne quelli in `spigoli`.
    `raggio` è un numero oppure uno per vertice."""
    spigoli = spigoli or set()
    n = len(punti)
    parti = []
    for i in range(n):
        p = punti[i]
        rv = raggio[i] if isinstance(raggio, (list, tuple)) else raggio
        if i in spigoli or rv <= 0:
            parti.append(("L", p))
            continue
        a, b = punti[i - 1], punti[(i + 1) % n]
        la = math.dist(p, a); lb = math.dist(p, b)
        ra = min(rv, la / 2.2); rb = min(rv, lb / 2.2)
        e = (p[0] + (a[0] - p[0]) * ra / la, p[1] + (a[1] - p[1]) * ra / la)
        u = (p[0] + (b[0] - p[0]) * rb / lb, p[1] + (b[1] - p[1]) * rb / lb)
        parti.append(("Q", e, p, u))
    d = ""
    for j, parte in enumerate(parti):
        if parte[0] == "L":
            d += ("M" if j == 0 else "L") + f"{f(parte[1][0])} {f(parte[1][1])}"
        else:
            _, e, p, u = parte
            d += ("M" if j == 0 else "L") + f"{f(e[0])} {f(e[1])}Q{f(p[0])} {f(p[1])} {f(u[0])} {f(u[1])}"
    return d + "Z"


def orizzonte_d(oz, curva, sopra: bool) -> str:
    """Muro (sopra) o pavimento (sotto) delimitati dalla linea curva dove si incontrano."""
    ys, yc, yd = oz + curva["sx"], oz + curva["mezzo"], oz + curva["dx"]
    # quadratica per tre punti (x = 0, LATO/2, LATO): punto di controllo che la fa passare per il centro
    ctrl = 2 * yc - (ys + yd) / 2
    linea = f"M0 {f(ys)}Q{f(LATO / 2)} {f(ctrl)} {LATO} {f(yd)}"
    return linea + (f"V0H0Z" if sopra else f"V{LATO}H0Z")


def verso_fuga(p, V, s, spost=(0.0, 0.0)):
    return (V[0] + (p[0] - V[0]) * s + spost[0], V[1] + (p[1] - V[1]) * s + spost[1])


def proietta_stella(vertici, base_y, g, basso=None):
    """La stella proiettata sul pavimento da una luce dietro il muro, vista dalla camera.

    Coordinate del muro: X = x dell'immagine, Y = altezza sopra il pavimento (base_y - y).
    Luce in (lx, ly) a distanza q·D dietro il muro (D = distanza camera-muro); camera con il
    centro in cx e l'occhio all'altezza dell'immagine cy. Un punto del pavimento a distanza Z
    davanti al muro si vede ingrandito di s = D / (D - Z)."""
    lx, ly, q, cx, cy = g["lx"], max(1.0, g["ly"] - 0.0), g["q"], g["cx"], g["cy"]
    tetto = ly * 0.985
    pts = [(x, min(max(0.0, base_y - y), 1e9)) for x, y in vertici]
    # la parte della stella più alta della luce non arriva sul pavimento: si taglia
    tagliati = []
    for i in range(len(pts)):
        a, b = pts[i - 1], pts[i]
        dentro_a, dentro_b = a[1] <= tetto, b[1] <= tetto
        if dentro_a != dentro_b:
            u = (tetto - a[1]) / (b[1] - a[1])
            tagliati.append((a[0] + u * (b[0] - a[0]), tetto))
        if dentro_b:
            tagliati.append(b)
    if len(tagliati) < 3:
        return None
    out = []
    for X, Y in tagliati:
        t = ly / (ly - Y)
        Xf = lx + t * (X - lx)
        zd = min(0.97, q * (t - 1))
        k = 1 / (1 - zd)
        y = cy + (base_y - cy) * k
        if basso is not None and y > basso:
            # oltre il bordo della piastrella: basta sapere la direzione
            k = (basso - cy) / (base_y - cy); y = basso
        out.append((cx + (Xf - cx) * k, y))
    return out


def gradiente(id_, g) -> str:
    n = len(g["colori"])
    stop = "".join(f'<stop offset="{i / (n - 1):.3f}" stop-color="{esa(c)}"/>' for i, c in enumerate(g["colori"]))
    return (f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" x1="{f(g["x1"])}" y1="{f(g["y1"])}" '
            f'x2="{f(g["x2"])}" y2="{f(g["y2"])}">{stop}</linearGradient>')


def riempi(id_, d, g, defs, attr="") -> str:
    """Forma `d` riempita con la sfumatura misurata `g`: lineare, oppure bilineare quando ha
    `colori2` (seconda sfumatura che entra piano piano lungo la direzione `w`, con una maschera)."""
    defs.append(gradiente(f"{id_}A", g))
    out = f'<path id="{id_}" d="{d}" fill="url(#{id_}A)"{attr}/>'
    if g.get("colori2"):
        defs.append(gradiente(f"{id_}B", g | {"colori": g["colori2"]}))
        w = g["w"]
        defs.append(f'<linearGradient id="{id_}W" gradientUnits="userSpaceOnUse" x1="{f(w["x1"])}" y1="{f(w["y1"])}" x2="{f(w["x2"])}" y2="{f(w["y2"])}">'
                    f'<stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>'
                    f'<mask id="{id_}M" maskUnits="userSpaceOnUse" x="0" y="0" width="{LATO}" height="{LATO}">'
                    f'<rect width="{LATO}" height="{LATO}" fill="url(#{id_}W)"/></mask>')
        out += f'<path d="{d}" fill="url(#{id_}B)" mask="url(#{id_}M)"{attr}/>'
    return out


def maglia_svg(id_, m, defs) -> str:
    """Maglia di sfumature (gradient mesh) fatta con SVG semplice: una griglia di nodi colorati,
    interpolata in modo bilineare. Ogni riga della griglia è un rettangolo con la sfumatura della
    linea di nodi in alto, più uno con la sfumatura della linea in basso che entra con una maschera
    verticale: in ogni cella il colore è esattamente l'interpolazione dei suoi quattro nodi.
    I colori dei nodi si possono cambiare a mano (o con ricolora_logo.py)."""
    x0, y0, x1, y1 = m["x0"], m["y0"], m["x1"], m["y1"]
    C, Rr = m["colonne"], m["righe"]
    col = m["colori"]
    ys = righe_maglia(m)
    tol = m.get("tolleranza", 2.0)
    for r in range(Rr + 1):
        riga = [col[r * (C + 1) + c] for c in range(C + 1)]
        tenuti = semplifica(riga, tol)
        stop = "".join(f'<stop offset="{f"{c / C:.4f}".rstrip("0").rstrip(".") or "0"}" stop-color="{esa(riga[c])}"/>' for c in tenuti)
        defs.append(f'<linearGradient id="{id_}L{r}" gradientUnits="userSpaceOnUse" x1="{f(x0)}" y1="0" x2="{f(x1)}" y2="0">{stop}</linearGradient>')
    defs.append(f'<linearGradient id="{id_}V" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>')
    righe = []
    for r in range(Rr):
        ya, yb = ys[r], ys[r + 1]
        defs.append(f'<mask id="{id_}M{r}" maskUnits="userSpaceOnUse" x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}">'
                    f'<rect x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}" fill="url(#{id_}V)"/></mask>')
        righe.append(f'<rect x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}" fill="url(#{id_}L{r})"/>'
                     f'<rect x="{f(x0)}" y="{f(ya)}" width="{f(x1 - x0)}" height="{f(yb - ya)}" fill="url(#{id_}L{r + 1})" mask="url(#{id_}M{r})"/>')
    # righe su pixel interi e senza antialiasing: nessuna fessura tra una riga e l'altra
    return f'<g id="{id_}" shape-rendering="crispEdges">{"".join(righe)}</g>'


def semplifica(riga, tol) -> list[int]:
    """Fermate da tenere in una linea di nodi: si salta un nodo quando la retta tra i due vicini
    tenuti lo riproduce entro `tol` (su 255). Il risultato cambia di meno di `tol`."""
    tenuti = [0]
    i = 0
    n = len(riga)
    while i < n - 1:
        j = i + 1
        while j + 1 < n:
            ok = True
            for k in range(i + 1, j + 1):
                u = (k - i) / (j + 1 - i)
                if any(abs(riga[i][c] + (riga[j + 1][c] - riga[i][c]) * u - riga[k][c]) > tol for c in range(3)):
                    ok = False; break
            if not ok:
                break
            j += 1
        tenuti.append(j)
        i = j
    return tenuti


def righe_maglia(m) -> list[int]:
    """Bordi delle righe della maglia, su pixel interi."""
    return [int(round(m["y0"] + (m["y1"] - m["y0"]) * r / m["righe"])) for r in range(m["righe"] + 1)]


def svg(P: dict, sfondo: bool = True) -> str:
    t = P["piastrella"]
    porta = P["porta"]
    V = porta["fuga"]; s = porta["profondita"]
    esterni = [tuple(v) for v in porta["vertici"]]
    spost = porta.get("spostamento", [0.0, 0.0])
    # vertici del fondo: se sono dati uno per uno (`fondo`) valgono quelli, altrimenti la prospettiva
    interni = [tuple(v) for v in porta["fondo"]] if porta.get("fondo") else [verso_fuga(p, V, s, spost) for p in esterni]
    # gli stipiti poggiano sul pavimento: in fondo restano alla quota della soglia in prospettiva

    oz = P["orizzonte"]
    muro, pav = P["muro"], P["pavimento"]
    stipiti = {4, 5}

    defs = []
    corpo = []

    forma_piastrella = squircle(t["x0"], t["y0"], t["x1"], t["y1"], t["raggio"], t["continuita"])
    defs.append(f'<clipPath id="piastrella"><path d="{forma_piastrella}"/></clipPath>')
    porta_d = arrotonda(esterni, porta.get("raggi") or porta["raggio"], stipiti)
    defs.append(f'<clipPath id="porta"><path d="{porta_d}"/></clipPath>')

    # 1. ombra della piastrella
    o = P["ombra"]
    defs.append(f'<filter id="sfumaOmbra" x="-20%" y="-20%" width="140%" height="140%">'
                f'<feGaussianBlur stdDeviation="{f(o["sfocatura"])}"/></filter>')
    if sfondo:
        corpo.append(f'<rect id="fondo" width="{LATO}" height="{LATO}" fill="{esa(P["fondo"])}"/>')
    a = o["allarga"]
    corpo.append(f'<path id="ombra" d="{squircle(t["x0"] - a, t["y0"] - a + o["dy"], t["x1"] + a, t["y1"] + a + o["dy"], t["raggio"] + a, t["continuita"])}" '
                 f'fill="{esa(o["colore"])}" opacity="{o["opacita"]:.3f}" filter="url(#sfumaOmbra)"/>')

    scena = []
    # 3. muro: sfumatura lineare lungo `angolo` + riflesso radiale della luce attorno alla porta
    ang = math.radians(muro["angolo"])
    cx, cy = (t["x0"] + t["x1"]) / 2, (t["y0"] + t["y1"]) / 2
    L = (t["x1"] - t["x0"]) * 0.75
    x1g, y1g = cx - math.cos(ang) * L, cy - math.sin(ang) * L
    x2g, y2g = cx + math.cos(ang) * L, cy + math.sin(ang) * L
    defs.append(f'<linearGradient id="muroLuce" gradientUnits="userSpaceOnUse" x1="{f(x1g)}" y1="{f(y1g)}" x2="{f(x2g)}" y2="{f(y2g)}">'
                f'<stop offset="0" stop-color="{esa(muro["da"])}"/><stop offset="{muro["centro"]:.3f}" stop-color="{esa(muro["meta"])}"/>'
                f'<stop offset="1" stop-color="{esa(muro["a"])}"/></linearGradient>')
    rf = muro["riflesso"]
    defs.append(f'<radialGradient id="muroRiflesso" gradientUnits="userSpaceOnUse" cx="{f(rf["cx"])}" cy="{f(rf["cy"])}" r="{f(rf["r"])}">'
                f'<stop offset="0" stop-color="{esa(rf["colore"])}" stop-opacity="{rf["opacita"]:.3f}"/>'
                f'<stop offset="1" stop-color="{esa(rf["colore"])}" stop-opacity="0"/></radialGradient>')
    curva = P.get("curva", PARAMETRI_INIZIALI["curva"])
    muro_d = orizzonte_d(oz, curva, True)
    pav_d = orizzonte_d(oz, curva, False)
    cu = muro.get("curvatura", PARAMETRI_INIZIALI["muro"]["curvatura"])
    defs.append(f'<linearGradient id="muroCurvatura" x1="{f(t["x0"])}" y1="0" x2="{f(t["x1"])}" y2="0" gradientUnits="userSpaceOnUse">'
                f'<stop offset="0" stop-color="{esa(cu["colore"])}" stop-opacity="{cu["ombra_sx"]:.3f}"/>'
                f'<stop offset="{cu["centro"]:.3f}" stop-color="{esa(cu["colore"])}" stop-opacity="0"/>'
                f'<stop offset="1" stop-color="{esa(cu["colore"])}" stop-opacity="{cu["ombra_dx"]:.3f}"/></linearGradient>')
    if muro.get("maglia"):
        sopra = [f'<g id="muro">{maglia_svg("muroMaglia", muro["maglia"], defs)}</g>']
    else:
        sopra = [f'<g id="muro"><path d="{muro_d}" fill="url(#muroLuce)"/>'
                 f'<path d="{muro_d}" fill="url(#muroCurvatura)"/>'
                 f'<path d="{muro_d}" fill="url(#muroRiflesso)"/></g>']

    # 4. pavimento: dal fondo scuro all'orizzonte, bagliore e fascio di luce dalla porta
    defs.append(f'<linearGradient id="pavimentoBase" x1="0" y1="{f(oz)}" x2="0" y2="{f(t["y1"])}" gradientUnits="userSpaceOnUse">'
                f'<stop offset="0" stop-color="{esa(pav["lontano"])}"/><stop offset="1" stop-color="{esa(pav["vicino"])}"/></linearGradient>')
    defs.append(f'<linearGradient id="pavimentoLati" x1="0" y1="0" x2="{LATO}" y2="0" gradientUnits="userSpaceOnUse">'
                f'<stop offset="0" stop-color="{esa(pav["lato"])}" stop-opacity="0.8"/>'
                f'<stop offset="0.35" stop-color="{esa(pav["lato"])}" stop-opacity="0"/>'
                f'<stop offset="0.65" stop-color="{esa(pav["lato"])}" stop-opacity="0"/>'
                f'<stop offset="1" stop-color="{esa(pav["lato"])}" stop-opacity="0.5"/></linearGradient>')
    bg = pav["bagliore"]
    defs.append(f'<radialGradient id="pavimentoBagliore" gradientUnits="userSpaceOnUse" cx="{f(bg["cx"])}" cy="{f(bg["cy"])}" r="{f(bg["rx"])}" '
                f'gradientTransform="translate(0 {f(bg["cy"])}) scale(1 {bg["ry"] / bg["rx"]:.4f}) translate(0 {f(-bg["cy"])})">'
                f'<stop offset="0" stop-color="{esa(bg["colore"])}" stop-opacity="{bg["opacita"]:.3f}"/>'
                f'<stop offset="1" stop-color="{esa(bg["colore"])}" stop-opacity="0"/></radialGradient>')
    fa = pav["fascio"]
    ps, pd = esterni[5], esterni[4]
    defs.append(f'<linearGradient id="fascioLuce" x1="0" y1="{f(oz)}" x2="0" y2="{f(t["y1"])}" gradientUnits="userSpaceOnUse">'
                f'<stop offset="0" stop-color="{esa(fa["colore"])}" stop-opacity="{fa["opacita"]:.3f}"/>'
                f'<stop offset="1" stop-color="{esa(fa["fine"])}" stop-opacity="{fa["fine_opacita"]:.3f}"/></linearGradient>')
    defs.append(f'<filter id="sfumaFascio" x="-30%" y="-30%" width="160%" height="160%">'
                f'<feGaussianBlur stdDeviation="{f(fa["sfocatura"])}"/></filter>')
    fondo_y = t["y1"] + 80
    raggi_svg = ""
    for k, rg in enumerate(pav.get("raggi", [])):
        defs.append(f'<filter id="sfumaRaggio{k}" x="-50%" y="-20%" width="200%" height="140%">'
                    f'<feGaussianBlur stdDeviation="{f(max(0.1, rg["sfocatura"]))}"/></filter>')
        (a1, a2), (b1, b2) = rg["alto"], rg["basso"]
        raggi_svg += (f'<path id="raggio{k + 1}" d="M{f(a1)} {f(oz)}L{f(a2)} {f(oz)}L{f(b2)} {f(t["y1"])}L{f(b1)} {f(t["y1"])}Z" '
                      f'fill="{esa(rg["colore"])}" opacity="{rg["opacita"]:.3f}" filter="url(#sfumaRaggio{k})"/>')
    pe = pav.get("penombra", PARAMETRI_INIZIALI["pavimento"]["penombra"])
    am = pav.get("ambiente", PARAMETRI_INIZIALI["pavimento"]["ambiente"])
    defs.append(f'<filter id="sfumaPenombra" x="-40%" y="-40%" width="180%" height="180%">'
                f'<feGaussianBlur stdDeviation="{f(pe["sfocatura"])}"/></filter>')
    defs.append(f'<linearGradient id="pavimentoAmbiente" x1="0" y1="{f(oz)}" x2="0" y2="{f(t["y1"])}" gradientUnits="userSpaceOnUse">'
                f'<stop offset="0" stop-color="{esa(am["colore"])}" stop-opacity="0"/>'
                f'<stop offset="1" stop-color="{esa(am["colore"])}" stop-opacity="{am["opacita"]:.3f}"/></linearGradient>')
    sp = pav.get("specchio", PARAMETRI_INIZIALI["pavimento"]["specchio"])
    oc = oz + curva["mezzo"]
    k = sp["schiaccia"]
    defs.append(f'<clipPath id="pavimentoArea"><path d="{pav_d}"/></clipPath>')
    defs.append(f'<filter id="sfumaSpecchio" x="-10%" y="-10%" width="120%" height="120%">'
                f'<feGaussianBlur stdDeviation="{f(max(0.1, sp["sfocatura"]))}"/></filter>')
    defs.append(f'<linearGradient id="dissolvenzaSpecchio" x1="0" y1="{f(oc)}" x2="0" y2="{f(oc + max(10, sp["distanza"]))}" gradientUnits="userSpaceOnUse">'
                f'<stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="{sp["fine"]:.3f}"/></linearGradient>')
    defs.append(f'<mask id="maskSpecchio" maskUnits="userSpaceOnUse" x="0" y="0" width="{LATO}" height="{LATO}">'
                f'<rect width="{LATO}" height="{LATO}" fill="url(#dissolvenzaSpecchio)"/></mask>')
    specchio = (f'<g id="specchio" clip-path="url(#pavimentoArea)"><g mask="url(#maskSpecchio)" opacity="{sp["opacita"]:.3f}">'
                f'<use href="#sopra" transform="matrix(1 0 0 {-k:.4f} 0 {f((1 + k) * oc)})" filter="url(#sfumaSpecchio)"/></g></g>')
    pr = pav.get("proiezione")
    proiezione = ""
    if pr and pr.get("sfumatura"):
        pts = proietta_stella(esterni, oz, pr, basso=LATO + 400)
        if pts:
            defs.append(gradiente("luceProiettata", pr["sfumatura"]))
            defs.append(f'<filter id="sfumaProiezione" x="-20%" y="-20%" width="140%" height="140%">'
                        f'<feGaussianBlur stdDeviation="{f(max(0.1, pr["sfocatura"]))}"/></filter>')
            proiezione = (f'<path id="luce-proiettata" d="{arrotonda(pts, porta["raggio"] * 1.5, stipiti)}" fill="url(#luceProiettata)" '
                          f'opacity="{max(0, min(1, pr["opacita"])):.3f}" filter="url(#sfumaProiezione)"/>')
    for k, ch in enumerate(pav.get("chiazze", [])):
        defs.append(f'<filter id="sfumaChiazza{k}" x="-20%" y="-20%" width="140%" height="140%">'
                    f'<feGaussianBlur stdDeviation="{f(max(0.1, ch["sfocatura"]))}"/></filter>')
        d = "M" + "L".join(f"{f(x)} {f(y)}" for x, y in ch["vertici"]) + "Z"
        proiezione += (f'<g id="chiazza-{k + 1}" opacity="{max(0, min(1, ch["opacita"])):.3f}" filter="url(#sfumaChiazza{k})">'
                       f'{riempi(f"chiazza{k}", d, ch["sfumatura"], defs)}</g>')
    gr = pav.get("grana")
    grana = ""
    if gr and gr.get("opacita", 0) > 0.001:
        defs.append(f'<filter id="granaPavimento" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'
                    f'<feTurbulence type="fractalNoise" baseFrequency="{gr["frequenza"]:.3f} {gr["frequenza"] * gr.get("allunga", 0.35):.3f}" numOctaves="2" seed="4"/>'
                    f'<feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1"/></filter>')
        grana = (f'<rect id="grana" x="0" y="{f(oz - 10)}" width="{LATO}" height="{f(LATO - oz + 10)}" filter="url(#granaPavimento)" '
                 f'opacity="{gr["opacita"]:.3f}" style="mix-blend-mode:overlay"/>')
    scena.append(f'<g id="pavimento"><path d="{pav_d}" fill="url(#pavimentoBase)"/>'
                 f'<path d="{pav_d}" fill="url(#pavimentoLati)"/>'
                 f'<path d="{pav_d}" fill="url(#pavimentoAmbiente)"/>'
                 f'{specchio}'
                 f'<path id="penombra" d="M{f(ps[0] - 40)} {f(oz)}L{f(pd[0] + 40)} {f(oz)}L{f(pe["dx"])} {f(fondo_y)}L{f(pe["sx"])} {f(fondo_y)}Z" '
                 f'fill="{esa(pe["colore"])}" opacity="{pe["opacita"]:.3f}" filter="url(#sfumaPenombra)"/>'
                 f'<path id="fascio" d="M{f(ps[0])} {f(oz)}L{f(pd[0])} {f(oz)}L{f(fa["dx"])} {f(fondo_y)}L{f(fa["sx"])} {f(fondo_y)}Z" '
                 f'fill="url(#fascioLuce)" filter="url(#sfumaFascio)"/>'
                 f'{raggi_svg}{proiezione}'
                 f'<rect x="0" y="{f(oz - 40)}" width="{LATO}" height="{f(LATO - oz + 40)}" fill="url(#pavimentoBagliore)"/>'
                 f'<g clip-path="url(#pavimentoArea)">{grana}</g></g>')
    pavimento_svg = scena.pop()
    if pav.get("maglia"):
        # la luce misurata sul pavimento (riflessi, fasci, penombra) è tutta nella maglia
        pavimento_svg = (f'<g id="pavimento"><g clip-path="url(#pavimentoArea)">{maglia_svg("pavimentoMaglia", pav["maglia"], defs)}'
                         f'{grana}</g></g>')

    # 5. porta: vano in fondo, pareti interne e soglia, tutto ritagliato dal contorno della porta
    va = porta["vano"]
    defs.append(f'<radialGradient id="vanoLuce" gradientUnits="userSpaceOnUse" cx="{f(V[0])}" cy="{f(V[1])}" r="{f(va["r"])}">'
                f'<stop offset="0" stop-color="{esa(va["centro"])}"/><stop offset="1" stop-color="{esa(va["bordo"])}"/></radialGradient>')
    facce = []
    n = len(esterni)
    for i in range(n):
        j = (i + 1) % n
        nome = NOMI_FACCE[i]
        misurata = porta.get("sfumature", {}).get(nome)
        if misurata:
            quad = [esterni[i], esterni[j], interni[j], interni[i]]
            d = "M" + "L".join(f"{f(x)} {f(y)}" for x, y in quad) + "Z"
            facce.append(riempi(f"parete_{nome}", d, misurata, defs))
            continue
        c_in, c_out = porta["facce"][nome]
        # sfumatura perpendicolare al bordo: dal lato di fondo (luce) al lato del muro
        mi = ((interni[i][0] + interni[j][0]) / 2, (interni[i][1] + interni[j][1]) / 2)
        me = ((esterni[i][0] + esterni[j][0]) / 2, (esterni[i][1] + esterni[j][1]) / 2)
        defs.append(f'<linearGradient id="faccia_{nome}" gradientUnits="userSpaceOnUse" x1="{f(mi[0])}" y1="{f(mi[1])}" x2="{f(me[0])}" y2="{f(me[1])}">'
                    f'<stop offset="0" stop-color="{esa(c_in)}"/><stop offset="1" stop-color="{esa(c_out)}"/></linearGradient>')
        quad = [esterni[i], esterni[j], interni[j], interni[i]]
        d = "M" + "L".join(f"{f(x)} {f(y)}" for x, y in quad) + "Z"
        facce.append(f'<path id="parete_{nome}" d="{d}" fill="url(#faccia_{nome})"/>')
        c_lungo, op_lungo = porta.get("lungo", {}).get(nome, [[255, 240, 200], 0.0])
        if op_lungo > 0.005:
            defs.append(f'<linearGradient id="lungo_{nome}" gradientUnits="userSpaceOnUse" x1="{f(esterni[i][0])}" y1="{f(esterni[i][1])}" '
                        f'x2="{f(esterni[j][0])}" y2="{f(esterni[j][1])}">'
                        f'<stop offset="0" stop-color="{esa(c_lungo)}" stop-opacity="0"/>'
                        f'<stop offset="1" stop-color="{esa(c_lungo)}" stop-opacity="{op_lungo:.3f}"/></linearGradient>')
            facce.append(f'<path d="{d}" fill="url(#lungo_{nome})"/>')
    vano_d = arrotonda(interni, porta.get("raggi_fondo") or porta["raggio"] * s, stipiti)
    tr = porta["trabocco"]
    defs.append(f'<filter id="sfumaTrabocco" x="-30%" y="-30%" width="160%" height="160%">'
                f'<feGaussianBlur stdDeviation="{f(tr["sfocatura"])}"/></filter>')
    mo = max(0.1, porta.get("morbidezza", 3.0))
    defs.append(f'<filter id="sfumaVano" x="-10%" y="-10%" width="120%" height="120%">'
                f'<feGaussianBlur stdDeviation="{f(max(0.1, mo))}"/></filter>')
    sm = max(0.1, porta.get("smussatura", 4.0))
    defs.append(f'<filter id="smussaPareti" x="-5%" y="-5%" width="110%" height="110%">'
                f'<feGaussianBlur stdDeviation="{f(sm)}"/></filter>')
    vano_fill = "url(#vanoLuce)"
    vano_pav = ""
    sf = porta.get("sfumature", {})
    vano_maglia = ""
    if porta.get("vano_maglia"):
        defs.append(f'<clipPath id="vanoClip"><path d="{vano_d}"/></clipPath>')
        vano_maglia = f'<g clip-path="url(#vanoClip)">{maglia_svg("vanoMaglia", porta["vano_maglia"], defs)}</g>'
    elif sf.get("vano"):
        defs.append(gradiente("vanoMisurato", sf["vano"])); vano_fill = "url(#vanoMisurato)"
    if sf.get("vano_pavimento"):
        defs.append(gradiente("vanoPavimento", sf["vano_pavimento"]))
        defs.append(f'<clipPath id="vanoArea"><path d="{vano_d}"/></clipPath>')
        yv = porta["vano_pavimento_y"]
        vano_pav = (f'<rect id="pavimento-di-fondo" x="0" y="{f(yv)}" width="{LATO}" height="{f(LATO - yv)}" '
                    f'fill="url(#vanoPavimento)" clip-path="url(#vanoArea)"/>')
    filtro_pareti = ' filter="url(#smussaPareti)"'
    if porta.get("pareti_maglia"):
        facce = [maglia_svg("paretiMaglia", porta["pareti_maglia"], defs)]
        filtro_pareti = ""
        if porta.get("soglia_maglia"):
            # la soglia (il pavimento dentro lo spessore del muro) ha bordi netti in diagonale
            quad = [esterni[4], esterni[5], interni[5], interni[4]]
            d = "M" + "L".join(f"{f(x)} {f(y)}" for x, y in quad) + "Z"
            defs.append(f'<clipPath id="sogliaClip"><path d="{d}"/></clipPath>')
            facce.append(f'<g id="soglia" clip-path="url(#sogliaClip)">{maglia_svg("sogliaMaglia", porta["soglia_maglia"], defs)}</g>')
    sopra.append(f'<g id="porta" clip-path="url(#porta)"><g id="pareti"{filtro_pareti}>{"".join(facce)}</g>'
                 + (f'<g id="vano" filter="url(#sfumaVano)">{vano_maglia}</g></g>' if vano_maglia else
                 f'<g id="vano" filter="url(#sfumaVano)"><path d="{vano_d}" fill="{vano_fill}"/>{vano_pav}</g></g>'))
    fl = porta["filo"]
    sopra.append(f'<path id="trabocco" d="{vano_d}" fill="{esa(tr["colore"])}" opacity="{tr["opacita"]:.3f}" filter="url(#sfumaTrabocco)"/>')
    lati = fl.get("lati", {})
    fili = ""
    for i, nome in enumerate(NOMI_FACCE):
        j = (i + 1) % len(esterni)
        op = fl["opacita"] * lati.get(nome, 1.0)
        if op > 0.01 and nome != "soglia":
            fili += (f'<line x1="{f(esterni[i][0])}" y1="{f(esterni[i][1])}" x2="{f(esterni[j][0])}" y2="{f(esterni[j][1])}" '
                     f'stroke-opacity="{op:.3f}"/>')
    if fl.get("contorno"):
        # il filo segue il contorno smussato del taglio (la soglia resta senza filo)
        y_taglio = min(esterni[4][1], esterni[5][1]) - 3
        defs.append(f'<clipPath id="filoArea"><rect width="{LATO}" height="{f(y_taglio)}"/></clipPath>')
        sopra.append(f'<g id="filo" clip-path="url(#porta)"><g clip-path="url(#filoArea)">'
                     f'<path d="{porta_d}" fill="none" stroke="{esa(fl["colore"])}" stroke-width="{f(fl["spessore"])}" '
                     f'stroke-opacity="{max(0, min(1, fl["opacita"])):.3f}"/></g></g>')
    else:
        sopra.append(f'<g id="filo" stroke="{esa(fl["colore"])}" stroke-width="{f(fl["spessore"])}" stroke-linecap="round" '
                     f'clip-path="url(#porta)">{fili}</g>')
    # il muro e la porta stanno sopra il pavimento; il pavimento li riflette (vedi #specchio)
    scena.append(f'<g id="sopra" clip-path="url(#muroArea)">{"".join(sopra)}</g>')
    defs.append(f'<clipPath id="muroArea"><path d="{muro_d}"/><path d="{porta_d}"/></clipPath>')
    scena.insert(0, pavimento_svg)

    # luci: macchie di luce radiali con nome, ognuna confinata alla sua zona (muro, porta, pavimento)
    zone = {"muro": "muroArea", "porta": "porta", "pavimento": "pavimentoArea"}
    for k, lu in enumerate(P.get("luci", [])):
        rx, ry = max(1.0, lu["rx"]), max(1.0, lu["ry"])
        defs.append(f'<radialGradient id="luce{k}"><stop offset="0" stop-color="{esa(lu["colore"])}" stop-opacity="{max(0, min(1, lu["opacita"])):.3f}"/>'
                    f'<stop offset="1" stop-color="{esa(lu["colore"])}" stop-opacity="0"/></radialGradient>')
        scena.append(f'<g clip-path="url(#{zone[lu["zona"]]})"><ellipse id="luce-{lu["zona"]}-{k + 1}" cx="{f(lu["cx"])}" cy="{f(lu["cy"])}" '
                     f'rx="{f(rx)}" ry="{f(ry)}" fill="url(#luce{k})"/></g>')
    gt = t.get("grana")
    if gt and gt.get("opacita", 0) > 0.001:
        defs.append(f'<filter id="granaPiastrella" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'
                    f'<feTurbulence type="fractalNoise" baseFrequency="{gt["frequenza"]:.3f}" numOctaves="2" seed="9"/>'
                    f'<feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1"/></filter>')
        scena.append(f'<rect id="grana-muro" width="{LATO}" height="{LATO}" filter="url(#granaPiastrella)" '
                     f'opacity="{gt["opacita"]:.3f}" style="mix-blend-mode:overlay"/>')
    bo = t.get("bordo")
    if bo:
        # bordo in rilievo: una linea scura appena dentro e una chiara sul filo della piastrella
        scena.append(f'<path id="bordo-scuro" d="{forma_piastrella}" fill="none" stroke="{esa(bo["scuro"])}" '
                     f'stroke-width="{f(bo["spessore_scuro"])}" stroke-opacity="{max(0, min(1, bo["opacita_scuro"])):.3f}"/>')
    corpo.append(f'<g id="piastrella-scena" clip-path="url(#piastrella)">{"".join(scena)}</g>')
    if bo:
        corpo.append(f'<path id="bordo-chiaro" d="{forma_piastrella}" fill="none" stroke="{esa(bo["chiaro"])}" '
                     f'stroke-width="{f(bo["spessore_chiaro"])}" stroke-opacity="{max(0, min(1, bo["opacita_chiaro"])):.3f}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LATO} {LATO}" width="{LATO}" height="{LATO}">'
            f'<title>AddiOFA</title><defs>{"".join(defs)}</defs>{"".join(corpo)}</svg>')


def _unisci(base, salvati):
    """I parametri salvati vincono; quelli nuovi del modello prendono il valore iniziale."""
    if isinstance(base, dict) and isinstance(salvati, dict):
        return {k: _unisci(base[k], salvati[k]) if k in salvati else base[k] for k in base} | \
               {k: v for k, v in salvati.items() if k not in base}
    return salvati


PARAMETRI = pathlib.Path(__import__("os").environ.get("LOGO_PARAMETRI", QUI / "parametri.json"))


def carica(percorso: pathlib.Path | None = None) -> dict:
    percorso = percorso or PARAMETRI
    iniziali = json.loads(json.dumps(PARAMETRI_INIZIALI))
    if percorso.exists():
        return _unisci(iniziali, json.loads(percorso.read_text()))
    return iniziali


if __name__ == "__main__":
    print(svg(carica()))
