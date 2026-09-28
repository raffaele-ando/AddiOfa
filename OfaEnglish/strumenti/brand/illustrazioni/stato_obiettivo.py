"""
Stato / Obiettivo: bersaglio rosso e bianco con la freccia nel centro (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_obiettivo.py

Difetti dell'originale corretti: gli anelli non sono concentrici e il rosso esterno è più largo a
destra, c'è una macchia rosa in alto a sinistra senza senso, le alette della freccia sono diverse
(quella di sopra più grande) e l'asta ha i bordi seghettati. Qui: anelli concentrici costruiti da un
centro e da raggi uguali per lato, freccia su un asse a 45° con le due alette specchiate sull'asta,
un'ombra morbida dell'asta sul bersaglio; la freccia sta nel gruppo `freccia` (per animarla).
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, radiale  # noqa: E402
from oggetti_d import filtro_ombra, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 92, 90
CENTRO = V(43, 45.5)
RAGGI = [35.5, 28.2, 18.9, 11.7, 4.9]       # dal fuori al centro: rosso, bianco, rosso, bianco, rosso
ANGOLO = -45                                # direzione della freccia (gradi, 0 = destra)
ASTA = 54.5                                   # lunghezza dal centro alla coda
ALETTE = (38, 54.5, 7.6)                  # inizio, fine lungo l'asta, mezza apertura
C = {"rosso": ("#FF8388", "#FB5D64", "#EC3F48"), "bianco": ("#FFFFFF", "#FFF0F0"), "centro": ("#FF6168", "#E83642"),
     "asta": ("#A3263A", "#6E1424"), "alette": ("#FF5A61", "#E3303A"), "ombra": "#B91C1C"}


def scena() -> str:
    c = CENTRO
    R0 = RAGGI[0]
    defs = [filtro_ombra(W, H, 1.3),
            lineare("rosso-luce", c + V(-R0, -R0) * 0.7, c + V(R0, R0) * 0.7, [(0, C["rosso"][0]), (0.5, C["rosso"][1]), (1, C["rosso"][2])]),
            lineare("bianco-luce", c + V(-R0, -R0) * 0.5, c + V(R0, R0) * 0.5, [(0, C["bianco"][0]), (1, C["bianco"][1])]),
            radiale("centro-luce", c + V(-1.5, -1.5), RAGGI[4] * 1.6, [(0, C["centro"][0]), (1, C["centro"][1])])]
    corpo = [ombra("bersaglio-ombra", c.x + 0.8, c.y + 2, R0, R0 - 1, C["ombra"], 0.14)]
    anelli = []
    nomi = ["anello-esterno", "fascia-esterna", "anello-interno", "fascia-interna", "centro"]
    for i, (r, nm) in enumerate(zip(RAGGI, nomi)):
        riemp = "url(#centro-luce)" if i == 4 else ("url(#rosso-luce)" if i % 2 == 0 else "url(#bianco-luce)")
        anelli.append(f'<circle id="{nm}" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="{riemp}"/>')
    # riflesso: arco sull'anello esterno in alto a sinistra
    rr = (RAGGI[0] + RAGGI[1]) / 2
    a0, a1 = math.radians(195), math.radians(245)
    pa, pb = c + V(math.cos(a0), math.sin(a0)) * rr, c + V(math.cos(a1), math.sin(a1)) * rr
    anelli.append(f'<path id="bersaglio-riflesso" d="M{n(pa.x)} {n(pa.y)} A{n(rr)} {n(rr)} 0 0 1 {n(pb.x)} {n(pb.y)}" fill="none" '
                  f'stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2.6" stroke-linecap="round"/>')
    corpo.append(f'<g id="bersaglio">{"".join(anelli)}</g>')
    # freccia: asse t lungo l'asta, s di traverso
    a = math.radians(ANGOLO)
    t, s = V(math.cos(a), math.sin(a)), V(-math.sin(a), math.cos(a))
    coda = c + t * ASTA
    f = [f'<path id="freccia-ombra" d="M{n(c.x + 1.5)} {n(c.y + 2.2)} L{n(coda.x - t.x * 16 + 1.5)} {n(coda.y - t.y * 16 + 2.2)}" '
         f'stroke="{C["ombra"]}" stroke-opacity="0.3" stroke-width="3" stroke-linecap="round" filter="url(#sfuma-ombra)"/>']
    defs.append(lineare("asta-luce", c + s * 1.6, c - s * 1.6, [(0, C["asta"][0]), (1, C["asta"][1])]))
    f.append(f'<path id="freccia-asta" d="M{n(c.x + t.x * 0.8)} {n(c.y + t.y * 0.8)} L{n(coda.x - t.x * 2)} {n(coda.y - t.y * 2)}" '
             f'stroke="url(#asta-luce)" stroke-width="3.8" stroke-linecap="round"/>')
    t0, t1, ap = ALETTE
    for lato, k in (("sinistra", 1), ("destra", -1)):
        pts = [c + t * t0 + s * (k * 1.2), c + t * (t0 + 4.5) + s * (k * ap), c + t * t1 + s * (k * ap),
               c + t * (t1 - 3.5) + s * (k * 1.2)]
        defs.append(lineare(f"aletta-{lato}-luce", c + t * t0, c + t * t1 + s * (k * ap),
                            [(0, C["alette"][0 if k > 0 else 1]), (1, C["alette"][1])]))
        f.append(f'<path id="freccia-aletta-{lato}" d="{arrotondato(pts, [1, 1.6, 1.4, 1])}" fill="url(#aletta-{lato}-luce)"/>')
    f.append(f'<path id="freccia-cocca" d="M{n((c + t * (t0 + 1)).x)} {n((c + t * (t0 + 1)).y)} L{n((c + t * (t1 - 1)).x)} {n((c + t * (t1 - 1)).y)}" '
             f'stroke="{C["asta"][1]}" stroke-width="2.8" stroke-linecap="round"/>')
    corpo.append(f'<g id="freccia">{"".join(f)}</g>')
    return svg(W, H, "Stato / Obiettivo", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "obiettivo.svg"
    f.write_text(scena())
    print(f)
