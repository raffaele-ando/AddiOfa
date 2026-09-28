"""
Risultato / Probabilità: indicatore a semicerchio all'82% con il cursore e la scritta «82%» (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_risultato_probabilita.py

Difetti dell'originale corretti: l'arco non è un cerchio preciso (lo spessore cambia, più grosso in
basso a sinistra), la parte vuota grigia quasi non si vede ed è più sottile, il cursore ha un alone
sfrangiato e non sta esattamente sull'arco, le cifre hanno i bordi sbavati. Qui: un solo semicerchio
(CENTRO, RAGGIO, SPESSORE uguali per la parte piena e la vuota), cursore esattamente all'82%
dell'arco, cifre vere (Inter 800). Cambiando PERCENTUALE si spostano insieme arco, cursore e scritta.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_b import ombra, polare, svg  # noqa: E402
from testo_svg import tracciato  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 228, 122
C = {"arco": ("#E6323A", "#FA5157", "#FF8488"), "vuoto": "#EDEFF4", "cursore": ("#F8454C", "#E5262E"),
     "cifre": ("#F9474D", "#E7262D"), "ombra": "#DC2626"}

CENTRO, RAGGIO, SPESSORE = V(117, 113), 97, 22
PERCENTUALE = 82
INIZIO, FINE = 176, 4           # estremi dell'arco (gradi): simmetrici, così le punte tonde restano nella tela
CURSORE = (15.5, 10.5)               # raggio dell'anello bianco e del pallino rosso
CIFRE = (49, V(119.5, 104.5))            # dimensione, centro della linea di base


def arco(a0: float, a1: float, r: float = RAGGIO) -> str:
    """Arco da a0 a a1 gradi (0 a destra, 180 a sinistra), in senso orario sullo schermo."""
    p0, p1 = polare(CENTRO, r, a0), polare(CENTRO, r, a1)
    grande = 1 if abs(a0 - a1) > 180 else 0
    return f"M{n(p0.x)} {n(p0.y)} A{n(r)} {n(r)} 0 {grande} 1 {n(p1.x)} {n(p1.y)}"


def scena() -> str:
    fine = INIZIO - (INIZIO - FINE) * PERCENTUALE / 100          # angolo del cursore
    k = polare(CENTRO, RAGGIO, fine)
    s, (dim, base) = SPESSORE, CIFRE
    defs = [sfocatura("sfuma-ombra", 2, W, H),
            lineare("arco-luce", V(CENTRO.x - RAGGIO, 0), V(CENTRO.x + RAGGIO, 0),
                    [(0, C["arco"][0]), (0.45, C["arco"][1]), (1, C["arco"][2])]),
            lineare("cursore-luce", k - V(8, 8), k + V(8, 8), [(0, C["cursore"][0]), (1, C["cursore"][1])]),
            lineare("cifre-luce", V(0, base.y - dim * 0.73), V(0, base.y), [(0, C["cifre"][0]), (1, C["cifre"][1])])]
    corpo = [f'<path id="arco-vuoto" d="{arco(INIZIO, FINE)}" stroke="{C["vuoto"]}" stroke-width="{s}" stroke-linecap="round" fill="none"/>',
             f'<g id="arco-pieno"><path id="arco-pieno-tratto" d="{arco(INIZIO, fine)}" stroke="url(#arco-luce)" stroke-width="{s}" '
             f'stroke-linecap="round" fill="none"/>'
             f'<path id="arco-riflesso" d="{arco(168, max(fine + 25, 95), RAGGIO + s * 0.22)}" stroke="#FFFFFF" stroke-opacity="0.3" '
             f'stroke-width="2.6" stroke-linecap="round" fill="none"/></g>',
             f'<g id="cursore">' + ombra("cursore-ombra", k.x + 1, k.y + 3, CURSORE[0], CURSORE[0] * 0.9, C["ombra"], 0.22) +
             f'<circle id="cursore-anello" cx="{n(k.x)}" cy="{n(k.y)}" r="{CURSORE[0]}" fill="#FFFFFF"/>'
             f'<circle id="cursore-pallino" cx="{n(k.x)}" cy="{n(k.y)}" r="{CURSORE[1]}" fill="url(#cursore-luce)"/></g>',
             f'<path id="percentuale" d="{tracciato(f"{PERCENTUALE}%", 800, dim, base.x, base.y, centro=True)}" fill="url(#cifre-luce)"/>']
    return svg(W, H, "Risultato / Probabilità", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "risultato-probabilita.svg"
    f.write_text(scena())
    print(f)
