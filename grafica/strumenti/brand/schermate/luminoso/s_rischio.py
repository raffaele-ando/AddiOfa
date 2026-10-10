"""
Rischio economico (16.025, 17.025): mazzetto di tre banconote con il simbolo €.

Difetti dell'originale corretti: le tre banconote avevano angoli e inclinazioni diversi e il € era storto; qui sono tre
rettangoli arrotondati con la stessa inclinazione (-18°) e passo costante, il € è quello vero (Inter) allineato alla
banconota, il sigillino in alto a destra è un rettangolo tondo regolare. Il bagliore arancione esce dal bordo in basso a
destra e dalla banconota crema dietro (luminoso); nel 17 niente bagliore e la banconota dietro è gialla.
"""
from __future__ import annotations

from comune import Scena, V, salva
from oggetti_nuovi import banconota, clip_da, bagliore_clip


def rischio(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (201, 176) if lum else (189, 155)
    S = Scena("Rischio economico", W, H, stile)
    if lum:
        S.nuvola(["M8 80 C6 36 40 10 100 8 C160 6 198 40 196 100 C194 150 160 174 100 172 C40 170 10 140 8 80 Z"])
        S.alone("alone-retro", 120, 60, 70, 36, 0.8, "#FFE2A8", "#FFC470")
        S.alone("alone-destra", 165, 128, 52, 46, 0.9)
        S.alone("alone-sotto", 100, 160, 80, 14, 0.5)
        S.ombra("ombra", 108, 168, 70, 3.5, 0.2)
        cf, w, h, g = V(110.5, 108), 135, 77, -18
        cols = {"retro": ("#FFF6DE", "#FFEBC4", "#FFDDA0"), "medio": ("#2C62D6", "#1F4FC4", "#173FA6"), "fronte": ("#4A85F5", "#2D63DE", "#1E45B5")}
        sh_r, sh_m = V(-24, -26), V(-14, -3)
    else:
        S.nuvola(["M96 40 C150 30 185 62 185 105 C185 140 150 152 110 152 C60 152 70 60 96 40 Z"])
        S.ombra("ombra", 100, 152, 70, 3, 0.14)
        cf, w, h, g = V(96, 92), 130, 79, -19.5
        cols = {"retro": ("#FFEAB8", "#FDE2A0", "#FBD98A"), "medio": ("#0F4FC9", "#0B45B8", "#093A9C"), "fronte": ("#3A88F8", "#2579F5", "#1F6AE6")}
        sh_r, sh_m = V(-26, -26), V(-13, 0)
    r = 9
    banconota(S, "banconota-retro", cf + sh_r, w * 0.94, h * 0.9, g, cols["retro"], r, bordo_chiaro=False)
    if not lum:   # nel 17 la banconota dietro ha un margine bianco interno (assegno)
        S.c(f'<g transform="translate({cf.x + sh_r.x:.2f} {cf.y + sh_r.y:.2f}) rotate({g})"><rect x="{-w * 0.94 / 2 + 8}" y="{-h * 0.9 / 2 + 6}" width="{w * 0.94 - 16}" height="{h * 0.9 - 12}" rx="5" fill="#FFF8E6"/></g>')
    banconota(S, "banconota-mezzo", cf + sh_m, w, h, g - 0.5, cols["medio"], r, bordo_chiaro=False)
    idf = banconota(S, "banconota-fronte", cf, w, h, g, cols["fronte"], r, simbolo=True, chip=True, simbolo_col="#FFF6E5" if lum else "#F4F8FF",
                   bagliori=((62, 36, 58, 0.95), (30, 40, 40, 0.5)) if lum else ())
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("rischio-economico", rischio(st)))
