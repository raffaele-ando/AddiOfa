"""
Successo: coppa con la stella e tre raggi di luce, per i due kit.

    python3 strumenti/brand/illustrazioni/successo.py        # scrive i due SVG in brand/disegni

kit-blu  → illustrazioni/successo.svg              (coppa a tulipano, manici ad arco, nuvola)
kit-rosso → illustrazioni/successo-superamento.svg (coppa più dritta, manici larghi, senza nuvola)

Difetti dell'originale corretti: coppa e manici non simmetrici (il manico destro più piccolo e più
basso), stella storta, raggi di lunghezza e distanza diverse, macchie di colore. Nel kit rosso anche:
la coppa divisa in due metà di colore con uno stacco netto, i raggi laterali storti, i resti della
didascalia del foglio sotto la base. Qui tutto è costruito su un asse (CX) e specchiato: coppa,
manici, stelo, base e raggi. Le misure di ogni kit sono nel dizionario KIT.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402
from oggetti_c import raccordata  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "file": "illustrazioni/successo.svg", "titolo": "Successo",
        "tela": (191, 171), "cx": 89.5,
        "colori": {"chiaro": "#FFD27A", "base": "#FEBA3D", "scuro": "#F59E0B", "orlo": "#FDE2AA",
                   "nuvola": "#FEF6EC", "ombra": "#F59E0B", "stella": "#FFFFFF"},
        "nuvola": [("ellipse", 95, 92, 88, 66), ("circle", 40, 120, 34), ("circle", 150, 118, 34)],
        # coppa: orlo sinistro (x0, y0), fianco (controllo 1), pancia (controllo 2), fondo (metà larghezza, y)
        "coppa": {"x0": 40, "y0": 51, "fianco": (0, 96), "pancia": (30, 117), "fondo": (10, 121)},
        "riflesso": ((49, 62), (49, 84), (56, 100), (66, 110)),
        # manico: distanze dall'asse di attacco alto, controlli e attacco basso; spessore del tratto
        "manico": {"alto": (48.5, 60), "c1": (73.5, 60), "c2": (75.5, 96), "basso": (30, 108), "spessore": 9},
        "raggi": {"centro": 60, "angolo": 42, "dentro": (31, 34), "fuori": (51, 48), "spessore": 6},
        "stelo": {"alto": (10, 119), "basso": (13, 149)},
        "base": {"mezza": 31, "y": 146, "alto": 20, "raggio": 8},
        "stella": {"centro": 88, "R": 19, "r": 8.3},
        "ombra": {"rx": 40, "ry": 3.5, "opacita": "0.22"},
        "sfumature": {"coppa": None, "stelo": None, "base": None, "manico": None},
    },
    "kit-rosso": {
        "file": "illustrazioni/successo-superamento.svg", "titolo": "Successo / Superamento",
        "tela": (152, 164), "cx": 76,
        "colori": {"chiaro": "#FEC952", "base": "#FDB91E", "scuro": "#F8AD06", "orlo": "#FEDC8C",
                   "nuvola": None, "ombra": "#F59E0B", "stella": "#FFFFFF"},
        "nuvola": [],
        "coppa": {"x0": 30, "y0": 42, "fianco": (0, 100), "pancia": (30, 121), "fondo": (16, 121)},
        "riflesso": ((39, 53), (39, 80), (44, 96), (54, 107)),
        # manico largo: barra dritta in alto, angolo morbido, discesa obliqua che rientra sotto la coppa
        "manico": {"alto": (45, 57), "basso": (28, 96), "spessore": 11.5,
                   "polilinea": [(45, 57), (64, 57), (64, 101), (28, 96)], "raggi": [9, 23]},
        "raggi": {"centro": 64, "angolo": 30, "dentro": (41, 42), "fuori": (57, 56), "spessore": 6},
        "stelo": {"alto": (12, 119), "basso": (13, 137)},
        "base": {"mezza": 30, "y": 135, "alto": 19, "raggio": 8.5},
        "stella": {"centro": 79.5, "R": 20, "r": 8.8},
        "ombra": {"rx": 34, "ry": 3, "opacita": "0.2"},
        # toni campionati sull'originale: manici e stelo più chiari della coppa, base più piena
        "sfumature": {"coppa": ("#FECB58", "#FDBA20", "#F9AE08"), "stelo": ("#FED983", "#FDC24C"),
                      "base": ("#FBB516", "#F5A905"), "manico": ("#FED886", "#FDC860")},
    },
}


def stella(c: V, R: float, r: float) -> list[V]:
    return [c + V(math.sin(math.pi * k / 5) * (R if k % 2 == 0 else r), -math.cos(math.pi * k / 5) * (R if k % 2 == 0 else r))
            for k in range(10)]


def scena(k: dict) -> str:
    W, H = k["tela"]
    CX = k["cx"]
    C = k["colori"]
    cp, mn, rg, st, bs = k["coppa"], k["manico"], k["raggi"], k["stelo"], k["base"]
    x0, y0 = cp["x0"], cp["y0"]
    x1 = 2 * CX - x0                               # orlo destro
    fy = cp["fondo"][1]
    sf = k["sfumature"]
    col_coppa = sf["coppa"] or (C["chiaro"], C["base"], C["scuro"])
    col_stelo = sf["stelo"] or (C["chiaro"], C["scuro"])
    col_base = sf["base"] or (C["base"], C["scuro"])
    col_manico = sf["manico"] or (C["chiaro"], C["scuro"])
    base_basso = bs["y"] + bs["alto"]

    def coppa() -> str:
        # metà sinistra della coppa, dall'orlo allo stelo (curva a tulipano), poi la destra specchiata
        f1, pz, fd = cp["fianco"], cp["pancia"], cp["fondo"]
        sx = (f"M{n(CX)} {n(y0)} L{n(x0 + 5)} {n(y0)} C{n(x0 + 1)} {n(y0)} {n(x0)} {n(y0 + 3)} {n(x0)} {n(y0 + 6)} "
              f"C{n(x0 + f1[0])} {n(f1[1])} {n(CX - pz[0])} {n(pz[1])} {n(CX - fd[0])} {n(fd[1])} L{n(CX)} {n(fd[1])}")
        dx = (f"L{n(CX + fd[0])} {n(fd[1])} C{n(CX + pz[0])} {n(pz[1])} {n(x1 - f1[0])} {n(f1[1])} {n(x1)} {n(y0 + 6)} "
              f"C{n(x1)} {n(y0 + 3)} {n(x1 - 1)} {n(y0)} {n(x1 - 5)} {n(y0)} Z")
        return sx + " " + dx

    def manico(lato: int) -> str:
        """Manico ad anello: un tratto spesso che esce dal bordo della coppa e rientra più in basso."""
        s = 1 if lato > 0 else -1
        if "polilinea" in mn:
            return raccordata([V(CX + s * q[0], q[1]) for q in mn["polilinea"]], mn["raggi"])
        a, c1, c2, b = (V(CX + s * mn[q][0], mn[q][1]) for q in ("alto", "c1", "c2", "basso"))
        return f"M{n(a.x)} {n(a.y)} C{n(c1.x)} {n(c1.y)} {n(c2.x)} {n(c2.y)} {n(b.x)} {n(b.y)}"

    defs = [sfocatura("sfuma-ombra", 2.2, W, H),
            lineare("coppa-luce", V(x0, 0), V(x1, 0), [(0, col_coppa[0]), (0.45, col_coppa[1]), (1, col_coppa[2])]),
            lineare("stelo-luce", V(CX - 13.5, 0), V(CX + 13.5, 0), [(0, col_stelo[0]), (1, col_stelo[1])]),
            lineare("base-luce", V(0, bs["y"] + 1), V(0, base_basso), [(0, col_base[0]), (1, col_base[1])]),
            lineare("manico-luce", V(0, mn["alto"][1]), V(0, mn["basso"][1] + 2), [(0, col_manico[0]), (1, col_manico[1])])]
    corpo = []
    if k["nuvola"]:
        forme = "".join(f'<ellipse cx="{f[1]}" cy="{f[2]}" rx="{f[3]}" ry="{f[4]}"/>' if f[0] == "ellipse"
                        else f'<circle cx="{f[1]}" cy="{f[2]}" r="{f[3]}"/>' for f in k["nuvola"])
        corpo.append(f'<g id="nuvola" fill="{C["nuvola"]}">{forme}</g>')
    om = k["ombra"]
    corpo.append(f'<ellipse id="ombra" cx="{n(CX)}" cy="{n(base_basso)}" rx="{n(om["rx"])}" ry="{n(om["ry"])}" fill="{C["ombra"]}" '
                 f'opacity="{om["opacita"]}" filter="url(#sfuma-ombra)"/>')
    # raggi di luce: tre tratti a ventaglio, simmetrici
    raggi = []
    for ang in (-rg["angolo"], 0, rg["angolo"]):
        a = math.radians(ang)
        d = V(math.sin(a), -math.cos(a))
        centro = V(CX, rg["centro"])
        p0 = centro + d * (rg["dentro"][0] if ang == 0 else rg["dentro"][1])
        p1 = centro + d * (rg["fuori"][0] if ang == 0 else rg["fuori"][1])
        raggi.append(f'<path d="M{n(p0.x)} {n(p0.y)} L{n(p1.x)} {n(p1.y)}"/>')
    corpo.append(f'<g id="raggi" stroke="{C["base"]}" stroke-width="{n(rg["spessore"])}" stroke-linecap="round">{"".join(raggi)}</g>')
    # manici dietro la coppa
    corpo.append(f'<g id="manici" fill="none" stroke="url(#manico-luce)" stroke-width="{n(mn["spessore"])}" stroke-linecap="round">'
                 f'<path id="manico-sinistro" d="{manico(-1)}"/><path id="manico-destro" d="{manico(1)}"/></g>')
    # stelo e base
    (sa, ya), (sb, yb) = st["alto"], st["basso"]
    corpo.append(f'<path id="stelo" d="M{n(CX - sa)} {n(ya)} L{n(CX + sa)} {n(ya)} L{n(CX + sb)} {n(yb)} L{n(CX - sb)} {n(yb)} Z" fill="url(#stelo-luce)"/>')
    corpo.append(f'<rect id="base" x="{n(CX - bs["mezza"])}" y="{n(bs["y"])}" width="{n(2 * bs["mezza"])}" height="{n(bs["alto"])}" '
                 f'rx="{n(bs["raggio"])}" fill="url(#base-luce)"/>')
    corpo.append(f'<rect id="base-riflesso" x="{n(CX - bs["mezza"] + 6)}" y="{n(bs["y"] + 3)}" width="{n(2 * bs["mezza"] - 12)}" height="3" rx="1.5" '
                 f'fill="#FFFFFF" opacity="0.35"/>')
    # coppa
    corpo.append(f'<path id="coppa" d="{coppa()}" fill="url(#coppa-luce)"/>')
    corpo.append(f'<path id="coppa-orlo" d="M{n(x0 + 4)} {n(y0 + 0.5)} H{n(x1 - 4)} Q{n(x1 - 0.5)} {n(y0 + 0.5)} {n(x1 - 0.5)} {n(y0 + 4)} '
                 f'L{n(x1 - 0.5)} {n(y0 + 6)} H{n(x0 + 0.5)} L{n(x0 + 0.5)} {n(y0 + 4)} Q{n(x0 + 0.5)} {n(y0 + 0.5)} {n(x0 + 4)} {n(y0 + 0.5)} Z" '
                 f'fill="{C["orlo"]}" opacity="0.55"/>')
    r0, r1, r2, r3 = k["riflesso"]
    corpo.append(f'<path id="coppa-riflesso" d="M{n(r0[0])} {n(r0[1])} C{n(r1[0])} {n(r1[1])} {n(r2[0])} {n(r2[1])} {n(r3[0])} {n(r3[1])}" '
                 f'stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round" fill="none"/>')
    sl = k["stella"]
    corpo.append(f'<path id="stella" d="{arrotondato(stella(V(CX, sl["centro"]), sl["R"], sl["r"]), [1.6, 1.2] * 5)}" fill="{C["stella"]}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n<title>{k["titolo"]}</title>\n'
            f'<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / k["file"]
        f.write_text(scena(k))
        print(f)
