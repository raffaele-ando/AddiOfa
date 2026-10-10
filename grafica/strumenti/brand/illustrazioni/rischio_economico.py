"""
Rischio economico: banconota con il simbolo dell'euro tenuta da una cornice a due angolari, con i
lampi d'allarme rossi agli angoli aperti.

    python3 strumenti/brand/illustrazioni/rischio_economico.py

Difetti dell'originale corretti: i due angolari della cornice erano diversi (quello in basso a
sinistra spesso e smussato, quello in alto a destra sottile con una linguetta senza senso), la
banconota non aveva un bordo e si confondeva con la nuvola, lati non paralleli (17° a sinistra,
21° sotto), «€» sbavato con le frange bianche, lampi rossi di lunghezze e distanze diverse, bordo
della nuvola sfrangiato. Qui: tutto in un riferimento locale (centro CENTRO, rotazione ROT), due
angolari identici (uno è l'altro ruotato di 180°), banconota con spessore e bordo, «€» vero (Inter),
lampi uguali e simmetrici rispetto al loro centro.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402
from oggetti_a import barra, nuvola, rettangolo, svg, testo  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (198, 156), "nuvola": "#F0F4FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(56.6, 100.6, 56.1, 51.6), (93.2, 61.7, 91.5, 40), (114.1, 84.1, 66.3, 61.1), (161.7, 115.9, 35.8, 30.2)],
        "centro": V(106, 88), "rotazione": -19,
        "cornice": (146, 86), "spessore": 13.5, "braccio_lungo": 84, "braccio_corto": 80,
        "angolare": ("#6394E3", "#3D74CC", "#2C60B5"), "angolare_fianco": "#23519E",
        "banconota": ("#F7FAFF", "#E3EBFD"), "banconota_fianco": "#C9D8F6", "banconota_bordo": "#D3E0FA",
        "euro": ("#3A6FC0", "#2458AC"),
        "lampi": {"colore": "#F43F40", "spessore": 6, "centro": V(120.5, 72),
                  "coppia": [(V(87.5, 4.5), V(87.5, 17)), (V(58.5, 16.5), V(67.5, 25.5))]},
    },
}


def angolare(k: dict, spost: V = V(0, 0)) -> list[V]:
    """Angolare a L in basso a sinistra, in coordinate locali (origine al centro della cornice)."""
    L, A = k["cornice"][0] / 2, k["cornice"][1] / 2
    t = k["spessore"]
    x_fine = -L + k["braccio_lungo"]          # dove finisce il braccio lungo (in basso)
    y_fine = A - k["braccio_corto"]           # dove finisce il braccio corto (a sinistra)
    pts = [V(-L, y_fine), V(-L, A), V(x_fine, A), V(x_fine, A - t), V(-L + t, A - t), V(-L + t, y_fine)]
    return [q + spost for q in pts]


def scena(k: dict) -> str:
    W, H = k["tela"]
    C, rot = k["centro"], k["rotazione"]
    L, A = k["cornice"][0] / 2, k["cornice"][1] / 2
    t = k["spessore"]
    raggi = [t / 2, 12, t / 2, t / 2, 3.5, t / 2]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("banconota-luce", V(-L, -A), V(L, A), [(0, k["banconota"][0]), (1, k["banconota"][1])]),
            lineare("angolare-luce", V(-L, -A), V(L * 0.2, A), [(0, k["angolare"][0]), (0.55, k["angolare"][1]), (1, k["angolare"][2])]),
            # l'angolare alto è ruotato di 180°: la sua sfumatura è ribaltata, così la luce viene da sinistra in alto per tutti e due
            lineare("angolare-alto-luce", V(L, A), V(-L * 0.2, -A), [(0, k["angolare"][0]), (0.55, k["angolare"][1]), (1, k["angolare"][2])]),
            lineare("euro-luce", V(0, -20), V(0, 20), [(0, k["euro"][0]), (1, k["euro"][1])])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    g = []
    # ombra morbida sotto tutto l'oggetto
    g.append(f'<path id="ombra" d="{rettangolo(-L + 4, -A + 8, 2 * L - 8, 2 * A - 2, 12)}" fill="{k["ombra"]}" opacity="0.14" filter="url(#sfuma-ombra)"/>')
    # banconota: spessore, faccia, bordo, filo di luce in alto
    bx, by = L - 9, A - 8
    g.append(f'<g id="banconota">'
             f'<path id="banconota-fianco" d="{rettangolo(-bx, -by + 3, 2 * bx, 2 * by, 8)}" fill="{k["banconota_fianco"]}"/>'
             f'<path id="banconota-faccia" d="{rettangolo(-bx, -by, 2 * bx, 2 * by, 8)}" fill="url(#banconota-luce)" stroke="{k["banconota_bordo"]}" stroke-width="1"/>'
             f'<path id="banconota-riflesso" d="M{n(-bx + 9)} {n(-by + 3)} H{n(bx - 9)}" stroke="#FFFFFF" stroke-opacity="0.8" stroke-width="1.6" stroke-linecap="round"/>'
             + testo("euro", "€", 800, 50, 0.5, 18, "url(#euro-luce)") + "</g>")
    # due angolari identici: il secondo è il primo ruotato di 180° attorno al centro
    for nome, giro in (("angolare-basso", 0), ("angolare-alto", 180)):
        faccia = arrotondato(angolare(k), raggi)
        # il fianco (spessore) sta sempre sotto nel riferimento locale: si sposta dopo la rotazione
        g.append(f'<g id="{nome}">'
                 f'<g transform="translate(0 3.4) rotate({giro})"><path id="{nome}-fianco" d="{faccia}" fill="{k["angolare_fianco"]}"/></g>'
                 f'<g transform="rotate({giro})"><path id="{nome}-faccia" d="{faccia}" fill="url(#{"angolare-luce" if giro == 0 else "angolare-alto-luce"})"/>'
                 f'<path id="{nome}-riflesso" d="M{n(-L + 3.2)} {n(A - k["braccio_corto"] + 6)} V{n(A - 8)}" stroke="#FFFFFF" '
                 f'stroke-opacity="0.35" stroke-width="2" stroke-linecap="round"/></g></g>')
    corpo.append(f'<g id="banconota-cornice" transform="translate({n(C.x)} {n(C.y)}) rotate({n(rot)})">' + "".join(g) + "</g>")
    # lampi: una coppia in alto a sinistra e la stessa ribaltata in basso a destra
    lm = k["lampi"]
    S = lm["centro"]
    lampi = []
    for i, (a, b) in enumerate(lm["coppia"]):
        lampi.append(barra(f"lampo-alto-{i + 1}", a, b, lm["spessore"], lm["colore"]))
        lampi.append(barra(f"lampo-basso-{i + 1}", S * 2 - a, S * 2 - b, lm["spessore"], lm["colore"]))
    corpo.append('<g id="lampi">' + "".join(lampi) + "</g>")
    return svg("Rischio economico", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "rischio-economico.svg"
        f.write_text(scena(k))
        print(f)
