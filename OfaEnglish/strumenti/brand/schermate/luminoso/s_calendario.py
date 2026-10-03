"""
Piano di studi bloccato (16.026, 17.026): calendario con anelli e lucchetto.

Riusa l'idea di piano_studi_bloccato.py (griglia regolare 3x2, arco del lucchetto a U di spessore costante, buco della
chiave centrato) con un calendario 3D: fianco sinistro scuro che sale dal basso e si accende d'arancione, testata con due
anelli uguali, caselle tutte uguali. Difetti dell'originale corretti: caselle di misure diverse, anelli di forma diversa
(il destro più basso), lucchetto con arco irregolare e buco della chiave sbavato; nel 17 il lucchetto copriva la terza
colonna a caso (qui la terza colonna è completa e il lucchetto la copre in modo uguale sulle due righe).
"""
from __future__ import annotations

from comune import Scena, V, lineare, n, salva, arrotondato
from oggetti_a import rettangolo
from oggetti_nuovi import lucchetto


def anello(S: Scena, nome: str, cx: float, y0: float, y1: float, w: float, col: tuple, buco: str, ombra_sotto: str):
    S.d(lineare(f"{nome}-luce", V(cx - w / 2, 0), V(cx + w / 2, 0), [(0, col[0]), (1, col[1])]))
    r = w / 2
    S.c(f'<g id="{nome}"><path id="{nome}-ombra" d="{rettangolo(cx - r * 0.9, y1 - 11, w * 0.9, 14, 5)}" fill="{ombra_sotto}" opacity="0.8"/>'
        f'<path id="{nome}-corpo" d="{rettangolo(cx - r, y0, w, y1 - y0, r)}" fill="url(#{nome}-luce)"/>'
        f'<path id="{nome}-buco" d="{rettangolo(cx - r * 0.38, y0 + 8, r * 0.76, (y1 - y0) * 0.36, r * 0.38)}" fill="{buco}"/>'
        f'<path id="{nome}-riflesso" d="M{n(cx - r * 0.7)} {n(y0 + r * 0.9)} V{n(y0 + r * 0.9 + 4)}" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.6" stroke-linecap="round"/></g>')


def calendario(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (217, 178) if lum else (179, 160)
    S = Scena("Piano di studi bloccato", W, H, stile)
    s = S.s
    if lum:
        S.nuvola(["M10 80 C8 34 44 8 108 8 C172 8 212 30 210 90 C208 150 176 174 108 174 C40 174 12 140 10 80 Z"])
        S.alone("alone-sinistro", 40, 128, 40, 50, 1.0)
        S.alone("alone-basso", 100, 166, 70, 12, 0.5)
        S.ombra("ombra", 106, 168, 76, 3.5, 0.2)
        fx0, fx1, ty0, ty1, by1 = 53, 181, 41, 73, 163     # fronte: da x, testata, fondo
        # fianco sinistro (spessore del calendario)
        S.d(lineare("fianco-luce", V(0, 41), V(0, 163), [(0, "#2A5BD8"), (0.45, "#3A62CC"), (1, "#8A8BCF")]))
        S.c(f'<path id="calendario-fianco" d="{rettangolo(38, 41, 40, 122, 12)}" fill="url(#fianco-luce)"/>')
        S.alone("alone-fianco", 46, 140, 26, 36, 0.95, "#FFB347", "#FF9A2E")
        cols = {"testata": ("#4B86F5", "#2358D6"), "anello": ("#3D78EE", "#2358D6"), "buco": "#0F2A78", "ombra": "#102A7A",
                "corpo": ("#F7F9FF", "#E4ECFD"), "casella": ("#BCCDFA", "#A8BEF6")}
        ring_x, ring_y = (77, 150), (24, 62)
        cas_x, cas_y, cas_w, cas_h = (81, 111, 140), (100, 132), 20, 22
        lk = dict(x=140, y=120, w=52, h=48, arco_x=(153.5, 178.5), arco_y=94, sp=8.5, col={"corpo": ("#3F6FDF", "#1E3FA5"), "arco": ("#2C57D0", "#1B3A9B"), "chiave": "#FFFFFF"})
        raggio_c = 5
    else:
        S.nuvola(["M6 70 C4 26 36 8 90 8 C146 8 176 28 174 82 C172 130 150 158 90 158 C34 158 8 130 6 70 Z"])
        S.ombra("ombra", 88, 154, 68, 3, 0.12)
        fx0, fx1, ty0, ty1, by1 = 17, 156, 21, 51, 150
        cols = {"testata": ("#1D63E6", "#0F50CC"), "anello": ("#2C74F0", "#1F5FE0"), "buco": "#0A3AA8", "ombra": "#0A3AA8",
                "corpo": ("#FBFCFF", "#F0F4FE"), "casella": ("#CBDAFB", "#C0D2FA")}
        ring_x, ring_y = (51, 125), (8, 40)
        cas_x, cas_y, cas_w, cas_h = (49, 75, 100), (83, 115), 17, 22
        lk = dict(x=112, y=102, w=56, h=51, arco_x=(125, 155), arco_y=74, sp=10, col={"corpo": ("#FF5A52", "#F03A36"), "arco": ("#FF4A44", "#EE3430"), "chiave": "#FFFFFF"})
        raggio_c = 4.5
    # corpo del calendario (fronte): testata colorata + foglio
    S.d(lineare("corpo-luce", V(0, ty1), V(0, by1), [(0, cols["corpo"][0]), (1, cols["corpo"][1])]),
        lineare("testata-luce", V(0, ty0), V(0, ty1), [(0, cols["testata"][0]), (1, cols["testata"][1])]))
    S.c(f'<path id="calendario-alone" d="{arrotondato([V(fx0, ty0), V(fx1, ty0), V(fx1, by1), V(fx0, by1)], [14, 14, 10, 10])}" fill="none" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="3"/>')
    S.c(f'<path id="calendario-foglio" d="{arrotondato([V(fx0, ty0), V(fx1, ty0), V(fx1, by1), V(fx0, by1)], [14, 14, 10, 10])}" fill="url(#corpo-luce)"/>')
    S.c(f'<path id="calendario-testata" d="{arrotondato([V(fx0, ty0), V(fx1, ty0), V(fx1, ty1), V(fx0, ty1)], [14, 14, 0, 0])}" fill="url(#testata-luce)"/>')
    S.c(f'<path id="calendario-testata-filo" d="M{n(fx0 + 12)} {n(ty0 + 1.2)} H{n(fx1 - 12)}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.2" stroke-linecap="round"/>')
    # caselle: griglia regolare 3x2
    for j, y in enumerate(cas_y):
        for i, x in enumerate(cas_x):
            S.d(lineare(f"casella-{j}{i}-luce", V(0, y - cas_h / 2), V(0, y + cas_h / 2), [(0, cols["casella"][0]), (1, cols["casella"][1])])) if False else None
            S.c(f'<rect id="casella-{j + 1}{i + 1}" x="{n(x - cas_w / 2)}" y="{n(y - cas_h / 2)}" width="{n(cas_w)}" height="{n(cas_h)}" rx="{n(raggio_c)}" fill="{cols["casella"][0]}"/>')
    # anelli
    for i, cx in enumerate(ring_x):
        anello(S, f"anello-{i + 1}", cx, ring_y[0], ring_y[1], 20 if lum else 11.5, cols["anello"], cols["buco"] if lum else cols["anello"][1], cols["ombra"])
    lucchetto(S, "lucchetto", lk["x"], lk["y"], lk["w"], lk["h"], lk["arco_x"], lk["arco_y"], lk["sp"], lk["col"], raggio=8, luce_chiave=True)
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("piano-studi-bloccato", calendario(st)))
