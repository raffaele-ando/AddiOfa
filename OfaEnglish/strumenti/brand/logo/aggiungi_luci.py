"""
Aggiunge al logo delle luci (macchie radiali sfumate) dove il confronto con la reference mostra la
differenza più grande, una alla volta: si mette la luce, se ne rifiniscono posizione, dimensione,
colore e intensità, e si tiene solo se lo scarto scende.

    python3 strumenti/brand/logo/aggiungi_luci.py 24
"""
from __future__ import annotations

import copy
import json
import random
import sys

import numpy as np
from scipy import ndimage as ndi

from ottimizza import carica_reference, Giudice, RIDOTTO, PARAMETRI, salva_confronto, arrotonda_numeri
from logo import carica, svg, LATO
from render import Renderer


def zona_di(g: Giudice, y: int, x: int) -> str | None:
    if g.regioni["porta"][y, x]:
        return "porta"
    if g.regioni["pavimento"][y, x]:
        return "pavimento"
    if g.regioni["muro"][y, x]:
        return "muro"
    return None


def main(quante: int):
    ref = carica_reference()
    P = carica()
    P.setdefault("luci", [])
    k = LATO / RIDOTTO
    rng = random.Random(3)
    with Renderer() as r:
        g = Giudice(r, ref)
        e = g.errore(P)
        print(f"partenza {e:.3f}", flush=True)
        for n in range(quante):
            resa = g.rendi(P)
            diff = ndi.gaussian_filter(g.ref_ridotta - resa, (5, 5, 0))
            forza = np.abs(diff).mean(axis=2) * (~g.regioni["fondo"])
            y, x = np.unravel_index(np.argmax(forza), forza.shape)
            zona = zona_di(g, y, x)
            if zona is None:
                break
            # colore: quello della reference in quel punto, intensità in base a quanto manca
            colore = ndi.gaussian_filter(g.ref_ridotta, (4, 4, 0))[y, x].tolist()
            luce = {"zona": zona, "cx": float(x * k), "cy": float(y * k), "rx": 70.0, "ry": 70.0,
                    "colore": colore, "opacita": 0.5}
            prova = copy.deepcopy(P); prova["luci"].append(luce)
            ep = g.errore(prova)
            passi = {"cx": 20.0, "cy": 20.0, "rx": 25.0, "ry": 25.0, "opacita": 0.12, "col0": 14.0, "col1": 14.0, "col2": 14.0}
            for _ in range(160):
                chiave = rng.choice(list(passi))
                cand = copy.deepcopy(prova); l = cand["luci"][-1]
                if chiave.startswith("col"):
                    i = int(chiave[3]); l["colore"][i] = float(np.clip(l["colore"][i] + rng.gauss(0, passi[chiave]), 0, 255))
                else:
                    l[chiave] = l[chiave] + rng.gauss(0, passi[chiave])
                    l["opacita"] = float(np.clip(l["opacita"], 0, 1)); l["rx"] = max(8.0, l["rx"]); l["ry"] = max(8.0, l["ry"])
                ec = g.errore(cand)
                if ec < ep:
                    prova, ep = cand, ec; passi[chiave] *= 1.3
                else:
                    passi[chiave] *= 0.9
            if ep < e - 0.01:
                P, e = prova, ep
                print(f"luce {len(P['luci']):2d} su {zona:9s} → {e:.3f}", flush=True)
            else:
                print(f"luce scartata ({zona}), resta {e:.3f}", flush=True)
        P = arrotonda_numeri(P)
        PARAMETRI.write_text(json.dumps(P, indent=1))
        (PARAMETRI.parent / "addiofa-logo.svg").write_text(svg(P))
        (PARAMETRI.parent / "addiofa-logo-trasparente.svg").write_text(svg(P, sfondo=False))
        print("intero:", salva_confronto(r, P, "luci"), flush=True)


if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 20)
