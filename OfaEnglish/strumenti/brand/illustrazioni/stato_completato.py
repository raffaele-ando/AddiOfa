"""
Stato / Completato: foglio con le righe di testo e il badge verde con la spunta (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_completato.py

Difetti dell'originale corretti: il foglio non ha bordo e si confonde col fondo, il lembo piegato
ha il lato storto, le righe sono sfocate, il cerchio verde ha un alone bianco sfrangiato e la spunta
ha i bracci di spessore diverso. Qui: foglio con bordo sottile e lembo con l'angolo morbido, righe
come barre arrotondate, badge con bordo bianco netto e spunta a tratto costante (oggetti_d.py).
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
FOGLIO = {"riquadro": (3.5, 3.5, 59.5, 77.5), "piega": 13,
          "colori": {"chiaro": "#F8FAFF", "carta": "#EDF1FE", "bordo": "#DFE6FD", "piega": "#CDD9FC",
                     "righe": "#C9D6FC", "ombra": "#1D4ED8"},
          "righe": [(23, 13, 49), (34, 13, 49), (44.8, 13, 35.5), (55.5, 13, 31)]}
BADGE = {"centro": V(54, 58.4), "raggio": 18.6, "simbolo": "spunta",
         "colori": {"chiaro": "#4FD37C", "base": "#26B856", "scuro": "#16A34A"}}

if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "completato.svg"
    f.write_text(documento_con_badge(W, H, "Stato / Completato", FOGLIO, BADGE))
    print(f)
