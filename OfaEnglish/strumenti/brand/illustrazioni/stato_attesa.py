"""
Stato / Attesa: clessidra rossa (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_attesa.py

Difetti dell'originale corretti: il vetro non ha un contorno (si confonde col fondo e i bulbi hanno
i fianchi sfrangiati), la sabbia di sotto è un mucchio a gradini, il filo di sabbia è staccato dal
collo, i tappi hanno le estremità diverse. Qui: clessidra simmetrica sull'asse CX (oggetti_d.clessidra):
vetro a due bulbi con bordo sottile e riflesso, sabbia di sopra piatta, filo continuo dal collo al
mucchio, mucchio morbido; tappi uguali arrotondati. La sabbia sta nel gruppo `clessidra-sabbia`.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from oggetti_d import clessidra, filtro_ombra, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 57, 82
CX = 28                                     # asse di simmetria
ALTO, BASSO, LARGO = 6.2, 77.5, 42.5
C = {"tappo": ("#FF7A7E", "#FB4B52", "#E0303A"), "vetro": "#FEE5E6", "vetro_bordo": "#FDD3D5",
     "sabbia_alto": ("#FFB6B8", "#FF9A9F"), "sabbia_basso": ("#FF7077", "#F54A53"), "filo": "#FF9EA3",
     "ombra": "#DC2626"}


def scena() -> str:
    defs = [filtro_ombra(W, H, 1.4)]
    d, c = clessidra("clessidra", CX, ALTO, BASSO, LARGO, C, livello=0.64, mucchio=0.5)
    defs.append(d)
    corpo = [ombra("clessidra-ombra", CX, BASSO + 0.6, LARGO / 2 - 1, 1.8, C["ombra"], 0.2), c]
    return svg(W, H, "Stato / Attesa", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "attesa.svg"
    f.write_text(scena())
    print(f)
