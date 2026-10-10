"""
Stato / In corso: foglio con le righe di testo e il badge con l'orologio (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_in_corso.py

Difetti dell'originale corretti: il foglio non ha bordo e si confonde col fondo, il lembo piegato
ha il lato storto, le righe sono sfocate, il cerchio ha un alone bianco sfrangiato e l'orologio
ha tre lancette (una di troppo) storte. Qui: foglio con bordo sottile e lembo con l'angolo morbido, righe
come barre arrotondate, badge con bordo bianco netto e orologio vero: due lancette (minuti su, ore verso le 4) con perno e quattro tacche (oggetti_d.py).
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V  # noqa: E402
from oggetti_d import documento_con_badge  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 85, 84
FOGLIO = {"riquadro": (4, 3.5, 62, 78.5), "piega": 13,
          "colori": {"chiaro": "#F8FAFF", "carta": "#EDF1FE", "bordo": "#DFE6FD", "piega": "#CDD9FC",
                     "righe": "#C9D6FC", "ombra": "#1D4ED8"},
          "righe": [(23.8, 14, 52), (35.3, 14, 51.5), (46.8, 14, 38), (58, 14, 34)]}
BADGE = {"centro": V(59.5, 55.2), "raggio": 18.8, "simbolo": "orologio",
         "colori": {"chiaro": "#9AA6FF", "base": "#7080FB", "scuro": "#5563EC"}}

if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "in-corso.svg"
    f.write_text(documento_con_badge(W, H, "Stato / In corso", FOGLIO, BADGE))
    print(f)
