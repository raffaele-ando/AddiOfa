"""
Stato / Errore: foglio con le righe di testo e il badge rosso con la croce (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_errore.py

Difetti dell'originale corretti: il foglio non ha bordo e si confonde col fondo, il lembo piegato
ha il lato storto, le righe sono sfocate, il cerchio rosso ha un alone bianco sfrangiato e i bracci della croce
sono di spessore diverso e non centrati. Qui: foglio con bordo sottile e lembo con l'angolo morbido, righe
come barre arrotondate, badge con bordo bianco netto e croce centrata a tratto costante (oggetti_d.py).
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V  # noqa: E402
from oggetti_d import documento_con_badge  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 82, 84
FOGLIO = {"riquadro": (4, 3.5, 60, 77.5), "piega": 13,
          "colori": {"chiaro": "#FFF8F8", "carta": "#FEEEEE", "bordo": "#FDE0E1", "piega": "#FDCFD2",
                     "righe": "#FEC3C6", "ombra": "#DC2626"},
          "righe": [(23, 14, 49.5), (33.8, 14, 49.5), (44.6, 14, 36), (55.4, 14, 31.5)]}
BADGE = {"centro": V(55, 58.4), "raggio": 18.6, "simbolo": "croce",
         "colori": {"chiaro": "#FF6E72", "base": "#F5383F", "scuro": "#DC2626"}}

if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "errore.svg"
    f.write_text(documento_con_badge(W, H, "Stato / Errore", FOGLIO, BADGE))
    print(f)
