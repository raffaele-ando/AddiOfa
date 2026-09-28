"""
Mondo / Internazionale: globo con i continenti veri (vista sull'Atlantico), un'orbita inclinata e
l'aereo che la percorre.

    python3 strumenti/brand/illustrazioni/mondo_internazionale.py

Difetti dell'originale corretti: il globo era un'ellisse storta, i continenti erano macchie senza
forma (nessuno riconoscibile), la scia bianca faceva un ricciolo senza senso e si interrompeva,
l'aereo era sbavato e staccato dalla scia, frange bianche attorno. Qui: globo tondo (centro, raggio)
con i continenti presi da contorni in longitudine/latitudine (semplificati) e proiettati in modo
ortografico dal punto di vista VISTA, poi ammorbiditi; orbita = ellisse inclinata, la metà dietro
nascosta dal globo, bianca dove passa davanti al globo e azzurra fuori; aereo disegnato dall'alto,
posato sull'orbita e girato lungo la sua tangente.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, p, radiale, sfocatura  # noqa: E402
from oggetti_a import liscio, nuvola, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"

# contorni semplificati (longitudine, latitudine) in gradi
CONTINENTI = {
    "america-nord": [(-165, 64), (-160, 70), (-140, 70), (-125, 70), (-100, 72), (-85, 70), (-80, 63), (-94, 59), (-86, 55),
                     (-79, 57), (-78, 62), (-65, 60), (-56, 52), (-66, 45), (-70, 42), (-76, 35), (-81, 31), (-80, 25.5),
                     (-83, 29), (-90, 30), (-97, 27), (-97, 21), (-92, 18.5), (-87, 21.5), (-88, 15), (-83, 10), (-77.5, 8),
                     (-80, 7), (-86, 11), (-92, 14.5), (-105, 20), (-110, 24), (-112, 30), (-117, 33), (-124, 40), (-124, 48),
                     (-132, 55), (-140, 60), (-150, 60), (-160, 58)],
    "groenlandia": [(-52, 62), (-43, 60), (-22, 70), (-19, 78), (-35, 83), (-60, 81), (-70, 77), (-56, 72)],
    "america-sud": [(-77, 8), (-72, 12), (-62, 10.5), (-52, 5), (-50, 0), (-44, -2.5), (-35, -6), (-35.5, -10), (-39, -15),
                    (-41, -22), (-48, -26), (-53, -34), (-58, -38), (-65, -41), (-66, -47), (-68, -52), (-72, -54),
                    (-75, -48), (-73, -38), (-71, -30), (-70.5, -18), (-76, -14), (-81, -6), (-80, 0), (-78, 3)],
    "africa": [(-17, 21), (-16.5, 15), (-17, 12), (-13, 8), (-8, 4.5), (-2, 5), (5, 6), (9, 4), (9.5, -1), (13, -6), (12, -15),
               (15, -27), (18, -34), (22, -34), (27, -33), (33, -27), (35, -20), (40, -15), (40, -5), (44, 0), (51, 11),
               (43, 12), (38, 18), (33, 29), (25, 32), (20, 31), (10, 34), (11, 37), (0, 36), (-6, 35.5), (-10, 30), (-13, 27)],
    "europa": [(-9, 37), (-9, 43), (-2, 43.5), (-4.5, 48), (0, 49.5), (4, 51.5), (8, 54), (8.5, 57), (5.5, 59), (5, 62), (10, 64),
               (15, 69), (25, 71), (32, 70), (42, 67), (50, 69), (60, 70), (62, 50), (48, 44), (40, 41.5), (29, 41), (26, 40),
               (23, 37), (21, 39), (19, 42), (14, 45), (12.5, 44), (16, 41), (18.5, 40), (16, 38), (12, 42), (8.5, 44.2),
               (3, 43), (0, 39), (-2, 36.8)],
    "gran-bretagna": [(-5.5, 50), (1.3, 51), (1.7, 53), (-2, 56), (-3, 58.5), (-5.5, 58.3), (-5, 55), (-3.3, 54.3), (-4.5, 52.5)],
}

KIT = {
    "kit-blu": {
        "tela": (156, 120), "nuvola": "#F0F4FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(57.1, 49.4, 56.6, 46.6), (92.4, 73.1, 46.4, 46.4), (50.1, 74.6, 45.1, 44.9)],
        "globo": (V(71, 64), 49), "vista": (-32, 22),          # longitudine e latitudine al centro della vista
        "mare": ("#92B9FC", "#719EF1", "#517FDB"), "terra": ("#3F71CC", "#2256B2"),
        "orbita": {"raggi": (69, 17), "rotazione": -26, "spessore": 2.6, "fuori": "#A9C2F5", "aereo_verso": V(136, 41)},
        "aereo": ("#3A7BF0", "#1557D6"),
    },
}


def proietta(lon: float, lat: float, vista, c: V, R: float) -> V:
    l0, f0 = (math.radians(v) for v in vista)
    l, f = math.radians(lon), math.radians(lat)
    x = math.cos(f) * math.sin(l - l0)
    y = math.cos(f0) * math.sin(f) - math.sin(f0) * math.cos(f) * math.cos(l - l0)
    vis = math.sin(f0) * math.sin(f) + math.cos(f0) * math.cos(f) * math.cos(l - l0)
    if vis < 0:                                   # dietro il globo: si schiaccia sul bordo (poi il cerchio taglia)
        m = math.hypot(x, y) or 1
        x, y = x / m * 1.02, y / m * 1.02
    return c + V(x, -y) * R


def densifica(punti, passo=4.0):
    """Aggiunge punti lungo i lati lunghi, così la proiezione curva bene vicino al bordo."""
    out = []
    for i, a in enumerate(punti):
        b = punti[(i + 1) % len(punti)]
        k = max(1, int(max(abs(b[0] - a[0]), abs(b[1] - a[1])) / passo))
        out += [(a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k) for j in range(k)]
    return out


def ellisse(o: dict, c: V, t: float) -> V:
    rx, ry = o["raggi"]
    a = math.radians(o["rotazione"])
    x, y = rx * math.cos(t), ry * math.sin(t)
    return c + V(x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a))


def mezza(o: dict, c: V, t0: float, t1: float, k: int = 48) -> str:
    return "M" + " L".join(p(ellisse(o, c, t0 + (t1 - t0) * i / k)) for i in range(k + 1))


def aereo(nome: str, pos: V, gradi: float, colori) -> tuple[str, str]:
    """Aereo visto dall'alto, muso verso l'alto nel riferimento locale, simmetrico sull'asse x=0."""
    sx = [V(0, -11), V(1.9, -8.5), V(2.1, -2.8), V(10.5, 2.2), V(10.5, 4.6), V(2.1, 2.2), V(1.7, 7.4),
          V(4.8, 10), V(4.8, 11.8), V(0, 10.6)]
    tutto = sx + [V(-q.x, q.y) for q in reversed(sx[1:-1])]
    raggi = [1.9, 1.2, 0.8, 1.2, 1.2, 0.8, 0.8, 1, 1, 0.8] + [1, 1, 0.8, 0.8, 1.2, 1.2, 0.8, 1.2]
    defs = lineare(f"{nome}-luce", V(-8, -10), V(8, 10), [(0, colori[0]), (1, colori[1])])
    corpo = (f'<g id="{nome}" transform="translate({n(pos.x)} {n(pos.y)}) rotate({n(gradi)})">'
             f'<path id="{nome}-sagoma" d="{arrotondato(tutto, raggi)}" fill="url(#{nome}-luce)" stroke="#FFFFFF" stroke-width="1.6" '
             f'stroke-linejoin="round" paint-order="stroke"/>'
             f'<path id="{nome}-riflesso" d="M0 -8.5 V4" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1.1" stroke-linecap="round"/></g>')
    return defs, corpo


def scena(k: dict) -> str:
    W, H = k["tela"]
    c, R = k["globo"]
    m1, m2, m3 = k["mare"]
    o = k["orbita"]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("mare-luce", c + V(-R, -R) * 0.7, c + V(R, R) * 0.8, [(0, m1), (0.5, m2), (1, m3)]),
            lineare("terra-luce", c + V(-R, -R) * 0.7, c + V(R, R) * 0.8, [(0, k["terra"][0]), (1, k["terra"][1])]),
            radiale("globo-ombreggiatura", c + V(-R * 0.35, -R * 0.4), R * 1.45, [(0, "#FFFFFF", 0), (0.62, "#FFFFFF", 0), (1, "#0F2A66", 0.28)]),
            f'<clipPath id="globo-taglio"><circle cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}"/></clipPath>',
            # fuori dal globo l'orbita è azzurra, sopra il globo bianca
            f'<mask id="fuori-dal-globo" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}"><rect width="{W}" height="{H}" fill="#FFFFFF"/>'
            f'<circle cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="#000000"/></mask>']
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    corpo.append(ombra("ombra", c.x, c.y + R + 2, R * 0.75, 3.2, k["ombra"], 0.16))
    # metà dietro dell'orbita (t da pi a 2pi: la parte alta nel riferimento dell'ellisse)
    corpo.append(f'<path id="orbita-dietro" d="{mezza(o, c, math.pi, 2 * math.pi)}" stroke="{o["fuori"]}" stroke-width="{n(o["spessore"])}" '
                 f'stroke-linecap="round" fill="none" mask="url(#fuori-dal-globo)"/>')
    # globo
    terre = "".join(f'<path id="continente-{nome}" d="{liscio([proietta(lo, la, k["vista"], c, R) for lo, la in densifica(pts)], tensione=0.9)}"/>'
                    for nome, pts in CONTINENTI.items())
    rr = R * 0.84
    a0, a1 = math.radians(206), math.radians(244)
    corpo.append(f'<g id="globo">'
                 f'<circle id="globo-mare" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="url(#mare-luce)"/>'
                 f'<g id="continenti" clip-path="url(#globo-taglio)" fill="url(#terra-luce)">{terre}</g>'
                 f'<circle id="globo-ombreggiatura" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="url(#globo-ombreggiatura)"/>'
                 f'<path id="globo-riflesso" d="M{p(c + V(math.cos(a0), math.sin(a0)) * rr)} A{n(rr)} {n(rr)} 0 0 1 {p(c + V(math.cos(a1), math.sin(a1)) * rr)}" '
                 f'stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3.2" stroke-linecap="round" fill="none"/></g>')
    # metà davanti: bianca sul globo, azzurra fuori
    davanti = mezza(o, c, 0, math.pi)
    corpo.append(f'<g id="orbita-davanti" stroke-width="{n(o["spessore"])}" stroke-linecap="round" fill="none">'
                 f'<path id="orbita-davanti-fuori" d="{davanti}" stroke="{o["fuori"]}" mask="url(#fuori-dal-globo)"/>'
                 f'<path id="orbita-davanti-globo" d="{davanti}" stroke="#FFFFFF" stroke-opacity="0.9" clip-path="url(#globo-taglio)"/></g>')
    # aereo: il punto dell'orbita più vicino a «aereo_verso», girato lungo la tangente (verso di marcia: t che cala)
    ts = [2 * math.pi * i / 720 for i in range(720)]
    t = min(ts, key=lambda s: (ellisse(o, c, s) - o["aereo_verso"]).lung())
    pos = ellisse(o, c, t)
    d = ellisse(o, c, t - 0.01) - ellisse(o, c, t + 0.01)
    gradi = math.degrees(math.atan2(d.x, -d.y))
    dd, cc = aereo("aereo", pos, gradi, k["aereo"])
    defs.append(dd)
    corpo.append(cc)
    return svg("Mondo / Internazionale", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "mondo-internazionale.svg"
        f.write_text(scena(k))
        print(f)
