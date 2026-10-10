"""
Piano di studi bloccato: calendario con il lucchetto, per i due kit.

    python3 strumenti/brand/illustrazioni/piano_studi_bloccato.py        # scrive i due SVG in brand/disegni

Difetti dell'originale corretti: il foglio del calendario non ha un bordo (si confonde con la
nuvola), la testata ha gli angoli diversi, i quadratini sono sfocati e di misure diverse, l'arco
del lucchetto ha lo spessore che cambia. Qui: foglio bianco con bordo e ombra, griglia regolare,
lucchetto con arco a U di spessore costante e buco della chiave centrato.

Kit rosso: altra inquadratura (calendario girato di 6°, lucchetto dritto, niente nuvola). Difetti
corretti lì: macchia rosso scuro sull'angolo sinistro della testata, fondo del foglio storto (i lati
non sono paralleli), quadratini di misure e distanze diverse, arco del lucchetto non centrato sul
corpo. Qui il calendario è costruito dritto e girato tutto insieme (`rotazione`).
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (202, 159),
        "C": {"nuvola": "#F2F6FE", "foglio": "#FFFFFF", "bordo": "#DBEAFE", "testata": ("#6C9BF0", "#3B72E6"),
              "anelli": ("#3B6FE0", "#1D4ED8"), "caselle": "#DCE7FB", "lucchetto": ("#F87171", "#EF4444", "#DC2626"),
              "ombra": "#1D4ED8", "ombra-lucchetto": "#DC2626"},
        "nuvola_forme": [(104, 86, 92, 66), (36, 112, 30)],
        "foglio": (36, 43, 166, 152), "testata_h": 25, "r": 10, "rotazione": None,
        "anelli": {"x": (62.5, 138.5), "y": 31, "h": 27},
        "caselle": {"x0": 57, "dx": 34, "y0": 81, "dy": 34, "w": 20, "h": 21},
        "lucchetto": {"corpo": (130, 102, 51, 51, 8), "arco": (155.5, 14, 93, 106, 9), "arco_luce": (78, 106),
                      "ombra": (156, 154, 24, 3), "riflesso": (136, 110, 160),
                      "buco": (155.5, 122, 5.5, [V(153.2, 124), V(157.8, 124), V(159, 139), V(152, 139)])},
    },
    "kit-rosso": {
        "tela": (156, 137),
        "C": {"nuvola": "#FEF1F1", "foglio": "#FFF7F7", "bordo": "#FDDADB", "testata": ("#FA6468", "#EE3C42"),
              "anelli": ("#FF9DA0", "#FB6F75"), "caselle": "#FEC4C5", "lucchetto": ("#FE777B", "#FB5A60", "#E93D44"),
              "ombra": "#DC2626", "ombra-lucchetto": "#DC2626"},
        "nuvola_forme": [],                       # l'originale non ha la nuvola
        "foglio": (15, 21, 137, 127), "testata_h": 29, "r": 9, "rotazione": (-6, 76.2, 74.3),
        "anelli": {"x": (46.5, 106.5), "y": 8, "h": 26},
        "caselle": {"x0": 36.6, "dx": 29.6, "y0": 62.5, "dy": 29, "w": 20, "h": 20},
        "lucchetto": {"corpo": (98, 80, 51, 43, 7), "arco": (123.5, 11.5, 70, 84, 9), "arco_luce": (54, 84),
                      "ombra": (124, 124, 24, 3), "riflesso": (104, 87.5, 128),
                      "buco": (123.5, 98, 5, [V(121.3, 100), V(125.7, 100), V(126.8, 112), V(120.2, 112)])},
    },
}


def scena(k: dict) -> str:
    W, H = k["tela"]
    C = k["C"]
    x0, y0, x1, y1 = k["foglio"]
    TESTATA_H, R = k["testata_h"], k["r"]
    a, cs, lu = k["anelli"], k["caselle"], k["lucchetto"]
    lx, ly, lw, lh, lr = lu["corpo"]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("testata-luce", V(x0, y0), V(x1, y0 + TESTATA_H), [(0, C["testata"][0]), (1, C["testata"][1])]),
            lineare("anello-luce", V(0, a["y"]), V(0, a["y"] + a["h"]), [(0, C["anelli"][0]), (1, C["anelli"][1])]),
            lineare("lucchetto-luce", V(lx, ly), V(lx + lw, ly + lh), [(0, C["lucchetto"][0]), (0.5, C["lucchetto"][1]), (1, C["lucchetto"][2])]),
            lineare("arco-luce", V(0, lu["arco_luce"][0]), V(0, lu["arco_luce"][1]), [(0, C["lucchetto"][0]), (1, C["lucchetto"][2])])]
    corpo = []
    if k["nuvola_forme"]:
        corpo.append(f'<g id="nuvola" fill="{C["nuvola"]}">' + "".join(
            f'<ellipse cx="{f[0]}" cy="{f[1]}" rx="{f[2]}" ry="{f[3]}"/>' if len(f) == 4 else f'<circle cx="{f[0]}" cy="{f[1]}" r="{f[2]}"/>'
            for f in k["nuvola_forme"]) + "</g>")
    # foglio del calendario
    cal = []
    cal.append(f'<rect id="ombra-foglio" x="{x0 + 4}" y="{y1 - 4}" width="{x1 - x0 - 8}" height="7" rx="3.5" fill="{C["ombra"]}" opacity="0.12" filter="url(#sfuma-ombra)"/>')
    cal.append(f'<rect id="foglio" x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="{R}" fill="{C["foglio"]}" stroke="{C["bordo"]}" stroke-width="1.2"/>')
    testata = (f"M{x0} {y0 + TESTATA_H} V{y0 + R} A{R} {R} 0 0 1 {x0 + R} {y0} H{x1 - R} A{R} {R} 0 0 1 {x1} {y0 + R} V{y0 + TESTATA_H} Z")
    cal.append(f'<path id="testata" d="{testata}" fill="url(#testata-luce)"/>')
    cal.append(f'<path id="testata-riflesso" d="M{x0 + 8} {y0 + 4} H{x1 - 8}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"/>')
    # anelli
    anelli = "".join(f'<rect id="anello-{i + 1}" x="{cx - 4.5}" y="{a["y"]}" width="9" height="{a["h"]}" rx="4.5" fill="url(#anello-luce)"/>'
                     f'<rect x="{cx - 1.8}" y="{a["y"] + 3}" width="2.4" height="14" rx="1.2" fill="#FFFFFF" opacity="0.35"/>'
                     for i, cx in enumerate(a["x"]))
    cal.append(f'<g id="anelli">{anelli}</g>')
    # caselle: griglia regolare 3 x 2
    caselle = "".join(f'<rect x="{n(cs["x0"] + c * cs["dx"])}" y="{n(cs["y0"] + r * cs["dy"])}" width="{cs["w"]}" height="{cs["h"]}" rx="4.5"/>'
                      for r in range(2) for c in range(3))
    cal.append(f'<g id="caselle" fill="{C["caselle"]}">{caselle}</g>')
    if k["rotazione"]:
        ang, rx, ry = k["rotazione"]
        corpo.append(f'<g id="calendario" transform="rotate({ang} {rx} {ry})">{"".join(cal)}</g>')
    else:
        corpo.extend(cal)
    # lucchetto (dritto)
    ox, oy, orx, ory = lu["ombra"]
    corpo.append(f'<ellipse id="ombra-lucchetto" cx="{ox}" cy="{oy}" rx="{orx}" ry="{ory}" fill="{C["ombra-lucchetto"]}" opacity="0.2" filter="url(#sfuma-ombra)"/>')
    acx, ar, atop, agambe, asp = lu["arco"]
    corpo.append(f'<path id="lucchetto-arco" d="M{acx - ar} {agambe} V{atop} A{ar} {ar} 0 0 1 {acx + ar} {atop} V{agambe}" fill="none" stroke="url(#arco-luce)" stroke-width="{asp}" stroke-linecap="round"/>')
    corpo.append(f'<rect id="lucchetto-corpo" x="{lx}" y="{ly}" width="{lw}" height="{lh}" rx="{lr}" fill="url(#lucchetto-luce)"/>')
    rx0, ry0, rx1 = lu["riflesso"]
    corpo.append(f'<path id="lucchetto-riflesso" d="M{rx0} {ry0} H{rx1}" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>')
    bcx, bcy, br, trapezio = lu["buco"]
    buco = arrotondato(trapezio, [0.5, 0.5, 1.5, 1.5])
    corpo.append(f'<g id="buco-chiave" fill="#FFFFFF"><circle cx="{bcx}" cy="{bcy}" r="{br}"/><path d="{buco}"/></g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n<title>Piano di studi bloccato</title>\n'
            f'<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "piano-studi-bloccato.svg"
        f.write_text(scena(k))
        print(f)
