"""
Accesso bloccato: finestra del browser con il profilo dello studente (tocco e toga) e l'orologio
dell'attesa.

    python3 strumenti/brand/illustrazioni/accesso_bloccato.py

Difetti dell'originale corretti: finestra storta (il bordo di sopra sale verso destra, il lato
destro è doppio), tocco asimmetrico con la punta sinistra più bassa, capelli a macchie, segni
scuri a caso sulla toga, anello dell'orologio di spessore variabile con una tacca nella parte
rossa, lancette non centrate, frange bianche. Qui: finestra dritta con raccordi veri, barra del
titolo e tre pallini uguali; studente costruito sull'asse ASSE (tocco a rombo simmetrico con
spessore, nappa appesa al bottone, capelli come fascia regolare, viso con il mento tondo, toga a
spalle raccordate tagliata dal bordo della finestra); orologio con anello a spessore costante
(metà blu, metà rossa), lancette dal centro, bordo bianco che lo stacca dalla finestra.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, p, sfocatura  # noqa: E402
from oggetti_a import nuvola, ombra, rettangolo, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"

KIT = {
    "kit-blu": {
        "tela": (169, 112), "nuvola": "#F3F7FE", "ombra": "#1D4ED8",
        "nuvola_forme": [(102.4, 48.5, 44.8, 43), (49.5, 60.2, 49, 51.3), (113.7, 76.8, 54.8, 34.7)],
        "finestra": (18, 14, 112, 100), "raggio": 9, "barra": 19, "bordo": "#DCE6FA",
        "barra_colori": ("#5089EC", "#3A70CC"), "pallini": ["#FDF1E0", "#F8C9C1", "#BFD6C3"],
        "asse": 68,
        "toga": ("#5A8FEC", "#4279DE"), "colletto": "#1D4F96",
        "pelle": ("#FACAC1", "#F3B0A4"), "pelle_scura": "#EBA597", "capelli": "#1D395B",
        "tocco": ("#5E91E8", "#3F75D6"), "tocco_fianco": "#2B5CB4", "calotta": "#1F4F98",
        "nappa": ("#7B8DB0", "#FDBC49"),
        "orologio": {"centro": V(129, 80), "raggio": 19.2, "spessore": 4.4, "colori": ("#3D6FD6", "#F25558"),
                     "lancette": "#1E3A64", "ore": V(0, -11.5), "minuti": V(7.2, 7.4)},
    },
}


def studente(k: dict) -> tuple[list[str], str]:
    A = k["asse"]
    defs = [lineare("toga-luce", V(A - 23, 78), V(A + 23, 100), [(0, k["toga"][0]), (1, k["toga"][1])]),
            lineare("pelle-luce", V(A - 9, 60), V(A + 9, 79), [(0, k["pelle"][0]), (1, k["pelle"][1])]),
            lineare("tocco-luce", V(A - 22, 39), V(A + 22, 55), [(0, k["tocco"][0]), (1, k["tocco"][1])])]
    x0, y0, x1, y1 = k["finestra"]
    top = y0 + k["barra"]
    defs.append(f'<clipPath id="finestra-contenuto"><path d="{arrotondato([V(x0 + 0.6, top), V(x1 - 0.6, top), V(x1 - 0.6, y1 - 0.6), V(x0 + 0.6, y1 - 0.6)], [0, 0, k["raggio"] - 0.6, k["raggio"] - 0.6])}"/></clipPath>')
    g = []
    # toga: spalle raccordate, tagliata dal fondo della finestra
    toga = arrotondato([V(A - 25, 104), V(A - 22, 78.5), V(A + 22, 78.5), V(A + 25, 104)], [0, 13, 13, 0])
    colletto = arrotondato([V(A - 7, 77), V(A + 7, 77), V(A, 87.5)], [1.5, 1.5, 2])
    g.append(f'<g id="toga" clip-path="url(#finestra-contenuto)">'
             f'<path id="toga-corpo" d="{toga}" fill="url(#toga-luce)"/>'
             f'<path id="toga-riflesso" d="M{n(A - 18)} 86 C{n(A - 17)} 83 {n(A - 14)} 81.5 {n(A - 11)} 81" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
             f'<path id="toga-collo" d="{rettangolo(A - 4, 73, 8, 8, 1.5)}" fill="{k["pelle_scura"]}"/>'
             f'<path id="toga-colletto" d="{colletto}" fill="{k["colletto"]}"/>'
             f'<path id="toga-abbottonatura" d="M{n(A)} 88 V104" stroke="{k["colletto"]}" stroke-width="1.3" stroke-linecap="round"/></g>')
    # testa: capelli (fascia sotto il tocco), orecchie, viso con il mento tondo
    g.append(f'<g id="testa">'
             f'<path id="capelli" d="{rettangolo(A - 12, 54, 24, 13.5, [3, 3, 4, 4])}" fill="{k["capelli"]}"/>'
             f'<circle id="orecchio-sinistro" cx="{n(A - 10)}" cy="69.5" r="2.4" fill="{k["pelle_scura"]}"/>'
             f'<circle id="orecchio-destro" cx="{n(A + 10)}" cy="69.5" r="2.4" fill="{k["pelle_scura"]}"/>'
             f'<path id="viso" d="{rettangolo(A - 9.5, 59.5, 19, 19.5, [4, 4, 9, 9])}" fill="url(#pelle-luce)"/>'
             f'<path id="frangia" d="{arrotondato([V(A - 10, 58), V(A + 10, 58), V(A + 10, 61.5), V(A - 10, 61.5)], [0, 0, 1.75, 1.75])}" fill="{k["capelli"]}"/></g>')
    # tocco: calotta, tavola a rombo simmetrica con lo spessore, bottone, nappa
    rombo = [V(A, 38.5), V(A + 23, 47), V(A, 55.5), V(A - 23, 47)]
    fianco = [q + V(0, 2.2) for q in rombo]
    g.append(f'<g id="tocco">'
             f'<path id="tocco-calotta" d="{arrotondato([V(A - 12.5, 49), V(A + 12.5, 49), V(A + 12, 59), V(A - 12, 59)], [0, 0, 2, 2])}" fill="{k["calotta"]}"/>'
             f'<path id="tocco-fianco" d="{arrotondato(fianco, [2, 2.5, 2, 2.5])}" fill="{k["tocco_fianco"]}"/>'
             f'<path id="tocco-tavola" d="{arrotondato(rombo, [2, 2.5, 2, 2.5])}" fill="url(#tocco-luce)"/>'
             f'<path id="tocco-riflesso" d="M{p(V(A - 16, 46))} L{p(V(A - 2, 41))}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6" stroke-linecap="round"/>'
             f'<g id="nappa"><path id="nappa-cordone" d="M{n(A)} 47 L{n(A + 18)} 48.6 V56" stroke="{k["nappa"][0]}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
             f'<path id="nappa-fiocco" d="{rettangolo(A + 16.2, 55.5, 3.6, 8, [1.2, 1.2, 1.8, 1.8])}" fill="{k["nappa"][1]}"/></g>'
             f'<circle id="tocco-bottone" cx="{n(A)}" cy="47" r="1.5" fill="{k["tocco_fianco"]}"/></g>')
    return defs, '<g id="studente">' + "".join(g) + "</g>"


def orologio(k: dict) -> tuple[list[str], str]:
    o = k["orologio"]
    c, R, s = o["centro"], o["raggio"], o["spessore"]
    blu, rosso = o["colori"]
    su, giu = c + V(0, -R), c + V(0, R)
    g = [ombra("orologio-ombra", c.x + 1, c.y + R + 1.5, R * 0.8, 3, "#1E3A64", 0.18),
         f'<circle id="orologio-bordo" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R + s / 2 + 2.4)}" fill="#FFFFFF"/>',
         f'<circle id="orologio-quadrante" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="#FFFFFF"/>',
         f'<path id="orologio-anello-blu" d="M{p(giu)} A{n(R)} {n(R)} 0 0 1 {p(su)}" stroke="{blu}" stroke-width="{n(s)}" fill="none"/>',
         f'<path id="orologio-anello-rosso" d="M{p(su)} A{n(R)} {n(R)} 0 0 1 {p(giu)}" stroke="{rosso}" stroke-width="{n(s)}" fill="none"/>',
         f'<g id="lancette" stroke="{o["lancette"]}" stroke-width="3" stroke-linecap="round">'
         f'<path id="lancetta-ore" d="M{p(c)} L{p(c + o["ore"])}"/><path id="lancetta-minuti" d="M{p(c)} L{p(c + o["minuti"])}"/></g>',
         f'<circle id="orologio-perno" cx="{n(c.x)}" cy="{n(c.y)}" r="2.2" fill="{o["lancette"]}"/>']
    return [], '<g id="orologio">' + "".join(g) + "</g>"


def scena(k: dict) -> str:
    W, H = k["tela"]
    x0, y0, x1, y1 = k["finestra"]
    R, B = k["raggio"], k["barra"]
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("barra-luce", V(x0, y0), V(x1, y0 + B), [(0, k["barra_colori"][0]), (1, k["barra_colori"][1])])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    barra = arrotondato([V(x0, y0), V(x1, y0), V(x1, y0 + B), V(x0, y0 + B)], [R, R, 0, 0])
    pallini = "".join(f'<circle id="pallino-{i + 1}" cx="{n(x0 + 9 + i * 8.5)}" cy="{n(y0 + B / 2 + 0.5)}" r="2.7" fill="{c}"/>'
                      for i, c in enumerate(k["pallini"]))
    corpo.append(f'<g id="finestra">'
                 f'<path id="finestra-ombra" d="{rettangolo(x0 + 4, y0 + 7, x1 - x0 - 8, y1 - y0 - 5, R)}" fill="{k["ombra"]}" opacity="0.13" filter="url(#sfuma-ombra)"/>'
                 f'<path id="finestra-foglio" d="{rettangolo(x0, y0, x1 - x0, y1 - y0, R)}" fill="#FFFFFF" stroke="{k["bordo"]}" stroke-width="1.2"/>'
                 f'<path id="finestra-barra" d="{barra}" fill="url(#barra-luce)"/>'
                 f'<path id="finestra-riflesso" d="M{n(x0 + 36)} {n(y0 + 3.4)} H{n(x1 - 9)}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.6" stroke-linecap="round"/>'
                 f'<g id="pallini">{pallini}</g></g>')
    d, c = studente(k); defs += d; corpo.append(c)
    d, c = orologio(k); defs += d; corpo.append(c)
    return svg("Accesso bloccato", W, H, defs, corpo)


if __name__ == "__main__":
    for kit, k in KIT.items():
        f = BRAND / "disegni" / kit / "illustrazioni" / "accesso-bloccato.svg"
        f.write_text(scena(k))
        print(f)
