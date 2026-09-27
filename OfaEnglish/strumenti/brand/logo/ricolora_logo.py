"""
Varianti di colore del logo: cambia una famiglia di colori (in OKLCH, come ricolora.py) in tutti i
colori della scena — nodi delle maglie, sfumature, fili di luce — e scrive un nuovo SVG.
Il logo originale e parametri.json non si toccano.

    # muro e pavimento rossi invece che blu, la luce resta calda
    python3 strumenti/brand/logo/ricolora_logo.py --da "#1D4ED8" --a "#DC2626" --uscita rosso
    # luce fredda invece che dorata
    python3 strumenti/brand/logo/ricolora_logo.py --da "#F59E0B" --a "#38BDF8" --uscita luce-fredda
"""
from __future__ import annotations

import argparse
import copy
import json
import pathlib
import sys

import numpy as np

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
sys.path.insert(0, str(QUI))

from logo import carica, svg  # noqa: E402
from ricolora import trasforma  # noqa: E402


def colori(nodo, fuori):
    """Tutte le terne [r, g, b] della scena (per riferimento, per poterle riscrivere)."""
    if isinstance(nodo, dict):
        for v in nodo.values():
            colori(v, fuori)
    elif isinstance(nodo, list):
        if len(nodo) == 3 and all(isinstance(c, (int, float)) for c in nodo):
            fuori.append(nodo)
        else:
            for v in nodo:
                colori(v, fuori)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--da", required=True, help="colore della famiglia da cambiare")
    p.add_argument("--a", required=True, help="colore nuovo")
    p.add_argument("--tolleranza", type=float, default=40.0, help="ampiezza della famiglia, in gradi di tinta")
    p.add_argument("--uscita", default="variante")
    x = p.parse_args()
    P = copy.deepcopy(carica())
    terne = []
    for chiave in ("muro", "pavimento", "porta", "piastrella", "ombra", "luci"):
        colori(P.get(chiave), terne)
    rgb = np.array(terne, dtype=np.float64)[None]
    nuovo, _ = trasforma(rgb, x.da, x.a, x.tolleranza)
    for t, n in zip(terne, nuovo[0]):
        t[:] = [round(float(v), 1) for v in np.clip(n, 0, 255)]
    uscita = QUI / f"addiofa-logo--{x.uscita}.svg"
    uscita.write_text(svg(P))
    (QUI / f"parametri--{x.uscita}.json").write_text(json.dumps(P))
    print(uscita, f"({len(terne)} colori)")


if __name__ == "__main__":
    main()
