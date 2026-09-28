"""
Piano di studi bloccato: calendario con il lucchetto (kit blu).

    python3 strumenti/brand/illustrazioni/piano_studi_bloccato.py

Difetti dell'originale corretti: il foglio del calendario non ha un bordo (si confonde con la
nuvola), la testata ha gli angoli diversi, i quadratini sono sfocati e di misure diverse, l'arco
del lucchetto ha lo spessore che cambia. Qui: foglio bianco con bordo e ombra, griglia regolare,
lucchetto con arco a U di spessore costante e buco della chiave centrato.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 202, 159
C = {"nuvola": "#F2F6FE", "foglio": "#FFFFFF", "bordo": "#DBEAFE", "testata": ("#6C9BF0", "#3B72E6"),
     "anelli": ("#3B6FE0", "#1D4ED8"), "caselle": "#DCE7FB", "lucchetto": ("#F87171", "#EF4444", "#DC2626"),
     "ombra": "#1D4ED8"}

FOGLIO = (36, 43, 166, 152)       # x0 y0 x1 y1
TESTATA_H = 25
R = 10


def scena() -> str:
    x0, y0, x1, y1 = FOGLIO
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("testata-luce", V(x0, y0), V(x1, y0 + TESTATA_H), [(0, C["testata"][0]), (1, C["testata"][1])]),
            lineare("anello-luce", V(0, 31), V(0, 58), [(0, C["anelli"][0]), (1, C["anelli"][1])]),
            lineare("lucchetto-luce", V(130, 102), V(181, 153), [(0, C["lucchetto"][0]), (0.5, C["lucchetto"][1]), (1, C["lucchetto"][2])]),
            lineare("arco-luce", V(0, 78), V(0, 106), [(0, C["lucchetto"][0]), (1, C["lucchetto"][2])])]
    corpo = []
    corpo.append(f'<g id="nuvola" fill="{C["nuvola"]}"><ellipse cx="104" cy="86" rx="92" ry="66"/><circle cx="36" cy="112" r="30"/></g>')
    # foglio del calendario
    corpo.append(f'<rect id="ombra-foglio" x="{x0 + 4}" y="{y1 - 4}" width="{x1 - x0 - 8}" height="7" rx="3.5" fill="{C["ombra"]}" opacity="0.12" filter="url(#sfuma-ombra)"/>')
    corpo.append(f'<rect id="foglio" x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="{R}" fill="{C["foglio"]}" stroke="{C["bordo"]}" stroke-width="1.2"/>')
    testata = (f"M{x0} {y0 + TESTATA_H} V{y0 + R} A{R} {R} 0 0 1 {x0 + R} {y0} H{x1 - R} A{R} {R} 0 0 1 {x1} {y0 + R} V{y0 + TESTATA_H} Z")
    corpo.append(f'<path id="testata" d="{testata}" fill="url(#testata-luce)"/>')
    corpo.append(f'<path id="testata-riflesso" d="M{x0 + 8} {y0 + 4} H{x1 - 8}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"/>')
    # anelli
    anelli = "".join(f'<rect id="anello-{i + 1}" x="{cx - 4.5}" y="31" width="9" height="27" rx="4.5" fill="url(#anello-luce)"/>'
                     f'<rect x="{cx - 1.8}" y="34" width="2.4" height="14" rx="1.2" fill="#FFFFFF" opacity="0.35"/>'
                     for i, cx in enumerate((62.5, 138.5)))
    corpo.append(f'<g id="anelli">{anelli}</g>')
    # caselle: griglia regolare 3 x 2
    caselle = "".join(f'<rect x="{57 + c * 34}" y="{81 + r * 34}" width="20" height="21" rx="4.5"/>' for r in range(2) for c in range(3))
    corpo.append(f'<g id="caselle" fill="{C["caselle"]}">{caselle}</g>')
    # lucchetto
    corpo.append(f'<ellipse id="ombra-lucchetto" cx="156" cy="154" rx="24" ry="3" fill="#DC2626" opacity="0.2" filter="url(#sfuma-ombra)"/>')
    corpo.append(f'<path id="lucchetto-arco" d="M141.5 106 V93 A14 14 0 0 1 169.5 93 V106" fill="none" stroke="url(#arco-luce)" stroke-width="9" stroke-linecap="round"/>')
    corpo.append(f'<rect id="lucchetto-corpo" x="130" y="102" width="51" height="51" rx="8" fill="url(#lucchetto-luce)"/>')
    corpo.append(f'<path id="lucchetto-riflesso" d="M136 110 H160" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>')
    buco = arrotondato([V(153.2, 124), V(157.8, 124), V(159, 139), V(152, 139)], [0.5, 0.5, 1.5, 1.5])
    corpo.append(f'<g id="buco-chiave" fill="#FFFFFF"><circle cx="155.5" cy="122" r="5.5"/><path d="{buco}"/></g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n<title>Piano di studi bloccato</title>\n'
            f'<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-blu" / "illustrazioni" / "piano-studi-bloccato.svg"
    f.write_text(scena())
    print(f)
