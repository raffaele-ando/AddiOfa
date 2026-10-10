"""
Successo (16.028, 17.030/28/29): coppa con la stella e tre raggi.

Difetti dell'originale corretti: nel 16 manico destro quasi sparito dietro il bagliore e raggio destro mancante (qui tre
raggi uguali a ventaglio e due manici specchiati); nel 17 i raggi erano pezzi staccati (17.028/029), qui sono nella scena.
Coppa, manici, stelo, base costruiti su un asse e specchiati (come successo.py del kit blu); stella a 5 punte regolare.
"""
from __future__ import annotations

import math
from comune import Scena, V, n, salva
from oggetti_nuovi import trofeo
from oggetti_a import barra


def successo(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    if lum:
        W, H = 202, 180
        S = Scena("Successo", W, H, stile)
        CX = 100
        S.nuvola(["M6 70 C4 30 40 16 70 20 C100 24 140 14 175 20 C202 28 204 60 200 100 C196 150 160 176 100 176 C40 176 8 150 6 100 Z"])
        S.alone("alone-centro", 100, 92, 96, 76, 0.95, "#FFE9BF", "#FFD38A")
        S.alone("alone-alto", 100, 28, 44, 28, 0.9, "#FFFFFF", "#FFF1CF")
        S.alone("alone-basso", 100, 150, 80, 22, 0.8, "#FFC470", "#FF9A2E")
        S.ombra("ombra", 100, 170, 56, 3, 0.22, "#C26A00")
        col = {"chiaro": "#FFC85E", "base": "#FFA826", "scuro": "#EE8606", "orlo": "#FFE2A0", "stelo": ("#E58A0E", "#FFB033", "#E58A0E"),
               "basamento": ("#FFAE2B", "#EE8A0A"), "manico": ("#FFB93D", "#F08C0C"), "stella": "#FFFCF2"}
        geo = dict(CX=CX, y_rim=41, hw_rim=48, y_bowl=122, hw_neck=12, y_stelo=0, base=(148, 18, 31, 8),
                   manico=((46, 60), (74, 56), (70, 92), (34, 106)), stella=(78, 21, 9.4), spessore_manico=11)
        raggi = dict(c=V(CX, 70), a0=52, a1=68, sp=6.5, col="#FFB21E")
    else:
        W, H = 152, 150
        S = Scena("Successo", W, H, stile)
        CX = 76
        S.nuvola(["M10 70 C8 40 40 30 76 30 C116 30 146 44 144 84 C142 130 120 146 76 146 C30 146 12 120 10 70 Z"])
        S.ombra("ombra", 76, 148, 46, 2.5, 0.14, "#C26A00")
        col = {"chiaro": "#FFC445", "base": "#FFAA14", "scuro": "#FF9F0A", "orlo": "#FFE2A0", "stelo": ("#FF9F0A", "#FFB52E", "#FF9F0A"),
               "basamento": ("#FFB42A", "#FFA20C"), "manico": ("#FFBE3A", "#FFA716"), "stella": "#FFFCF2"}
        geo = dict(CX=CX, y_rim=26, hw_rim=50, y_bowl=108, hw_neck=15, y_stelo=0, base=(128, 20, 36, 7),
                   manico=((46, 40), (82, 38), (78, 78), (36, 92)), stella=(58, 21, 9.4), spessore_manico=12)
        raggi = dict(c=V(CX, 52), a0=44, a1=58, sp=6, col="#FFB21E")
    # raggi: tre, a ventaglio, uguali e simmetrici
    rr = []
    for i, ang in enumerate((-39, 0, 39)):
        a = math.radians(ang)
        d = V(math.sin(a), -math.cos(a))
        rr.append(barra(f"raggio-{i + 1}", raggi["c"] + d * raggi["a0"], raggi["c"] + d * raggi["a1"], raggi["sp"], raggi["col"]))
    S.c('<g id="raggi">' + "".join(rr) + "</g>")
    trofeo(S, "coppa", colori=col, **geo)
    return S


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("successo", successo(st)))
