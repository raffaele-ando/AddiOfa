"""
Attesa / Caricamento: clessidra con la sabbia che scende (kit blu).

    python3 strumenti/brand/illustrazioni/attesa_caricamento.py

Difetti dell'originale corretti: il vetro è una macchia rosata senza contorno (non si capisce dove
finisce), le due metà non sono uguali, il filo di sabbia cambia spessore, il mucchio di sotto ha due
"spalle" a gradino ai lati, i tappi hanno il bordo sfrangiato. Qui tutto è costruito su un asse (CX)
e specchiato: vetro a due bulbi con il collo, sabbia che segue il vetro (ritagliata sull'interno),
mucchio a campana, filo di spessore costante, tappi uguali con raccordi veri.
Parti animabili: sabbia-sopra, filo-sabbia, sabbia-sotto (e il gruppo clessidra per girarla).
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_b import nuvola, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 150, 118
CX = 75.5                          # asse di simmetria
C = {"nuvola": "#FEF6EC", "tappo": ("#FD7474", "#F7575A", "#EC3A40"), "vetro": ("#FFFFFF", "#FBE3E4"),
     "vetro-bordo": "#F6C9CC", "sabbia": ("#FD9A98", "#F9777A", "#F2585D"), "ombra": "#DC2626"}

TAPPO_SOPRA = (5, 15.5)            # y0 y1
TAPPO_SOTTO = (97, 108)
TAPPO_MEZZA = 31                   # mezza larghezza dei tappi
VETRO = {"alto": 15, "basso": 97.5, "collo": 53, "mezza": 26.5, "mezza_collo": 6.5}
SPESSORE_VETRO = 5                 # dal bordo esterno del vetro alla sabbia
SABBIA_SOPRA_Y = 29                # superficie della sabbia di sopra
MUCCHIO = {"cima": 77, "piede": 91.5, "mezza": 24}   # mucchio di sotto


def controlli(rientro: float) -> tuple[list[V], list[V]]:
    """Punti di controllo della metà destra del vetro: bulbo di sopra (dall'alto al collo) e bulbo di
    sotto (dal collo al basso). Il bulbo resta largo fin quasi al collo e poi gira tondo."""
    v = VETRO
    m, mc = v["mezza"] - rientro, v["mezza_collo"] - rientro * 0.8
    a, b, c = v["alto"] - (1 if rientro else 0), v["basso"] + (1 if rientro else 0), v["collo"]
    sopra = [V(CX + m, a), V(CX + m, c - 13), V(CX + mc, c - 11), V(CX + mc, c - 2)]
    sotto = [V(CX + mc, c + 2), V(CX + mc, c + 11), V(CX + m, c + 13), V(CX + m, b)]
    return sopra, sotto


def bezier(q: list[V], t: float) -> V:
    u = 1 - t
    return q[0] * (u ** 3) + q[1] * (3 * u * u * t) + q[2] * (3 * u * t * t) + q[3] * (t ** 3)


def vetro(rientro: float = 0.0) -> str:
    """Contorno del vetro (due bulbi e il collo), rientrato di `rientro` per l'interno; la metà
    sinistra è lo specchio esatto della destra."""
    sopra, sotto = controlli(rientro)
    sp = lambda q: V(2 * CX - q.x, q.y)  # noqa: E731
    P = lambda q: f"{n(q.x)} {n(q.y)}"  # noqa: E731
    dx = f"C{P(sopra[1])} {P(sopra[2])} {P(sopra[3])} L{P(sotto[0])} C{P(sotto[1])} {P(sotto[2])} {P(sotto[3])}"
    sx = (f"C{P(sp(sotto[2]))} {P(sp(sotto[1]))} {P(sp(sotto[0]))} L{P(sp(sopra[3]))} "
          f"C{P(sp(sopra[2]))} {P(sp(sopra[1]))} {P(sp(sopra[0]))}")
    return f"M{P(sp(sopra[0]))} L{P(sopra[0])} {dx} L{P(sp(sotto[3]))} {sx} Z"


def riflesso(rientro: float, tratti: list[tuple[int, float, float]]) -> str:
    """Tratti lungo il bulbo sinistro, a `rientro` dal bordo: (bulbo 0/1, t0, t1)."""
    sopra, sotto = controlli(rientro)
    out = []
    for bulbo, t0, t1 in tratti:
        q = [V(2 * CX - k.x, k.y) for k in (sopra if bulbo == 0 else sotto)]
        pts = [bezier(q, t0 + (t1 - t0) * i / 12) for i in range(13)]
        out.append("M" + " L".join(f"{n(k.x)} {n(k.y)}" for k in pts))
    return " ".join(out)


def tappo(nome: str, y0: float, y1: float) -> tuple[str, str]:
    h = y1 - y0
    defs = lineare(f"{nome}-luce", V(0, y0), V(0, y1), [(0, C["tappo"][0]), (0.55, C["tappo"][1]), (1, C["tappo"][2])])
    g = (f'<g id="{nome}"><rect id="{nome}-corpo" x="{n(CX - TAPPO_MEZZA)}" y="{n(y0)}" width="{n(2 * TAPPO_MEZZA)}" '
         f'height="{n(h)}" rx="{n(h / 2)}" fill="url(#{nome}-luce)"/>'
         f'<path id="{nome}-riflesso" d="M{n(CX - TAPPO_MEZZA + 6)} {n(y0 + 2.6)} H{n(CX + TAPPO_MEZZA - 6)}" stroke="#FFFFFF" '
         f'stroke-opacity="0.4" stroke-width="1.8" stroke-linecap="round"/></g>')
    return defs, g


def scena() -> str:
    defs = [sfocatura("sfuma-ombra", 2.2, W, H),
            lineare("vetro-luce", V(CX - VETRO["mezza"], 0), V(CX + VETRO["mezza"], 0),
                    [(0, C["vetro"][1]), (0.35, C["vetro"][0]), (1, C["vetro"][1])]),
            lineare("sabbia-luce", V(0, SABBIA_SOPRA_Y), V(0, TAPPO_SOTTO[0]),
                    [(0, C["sabbia"][0]), (0.6, C["sabbia"][1]), (1, C["sabbia"][2])]),
            f'<clipPath id="vetro-dentro"><path d="{vetro(SPESSORE_VETRO)}"/></clipPath>']
    corpo = [nuvola(C["nuvola"], [(76, 62, 72, 46)])]
    corpo.append(ombra("ombra", CX, 108.5, 34, 3, C["ombra"], 0.18))
    g = [f'<path id="vetro" d="{vetro()}" fill="url(#vetro-luce)" stroke="{C["vetro-bordo"]}" stroke-width="1"/>']
    # sabbia: ritagliata sull'interno del vetro, così ne segue la forma
    m = MUCCHIO
    mucchio = (f"M{n(CX - m['mezza'] - 6)} {n(TAPPO_SOTTO[0] + 2)} V{n(m['piede'])} "
               f"C{n(CX - m['mezza'] + 6)} {n(m['piede'] - 1)} {n(CX - 9)} {n(m['cima'])} {n(CX)} {n(m['cima'])} "
               f"C{n(CX + 9)} {n(m['cima'])} {n(CX + m['mezza'] - 6)} {n(m['piede'] - 1)} {n(CX + m['mezza'] + 6)} {n(m['piede'])} "
               f"V{n(TAPPO_SOTTO[0] + 2)} Z")
    g.append(f'<g id="sabbia" clip-path="url(#vetro-dentro)" fill="url(#sabbia-luce)">'
             f'<rect id="sabbia-sopra" x="{n(CX - 30)}" y="{n(SABBIA_SOPRA_Y)}" width="60" height="{n(VETRO["collo"] - SABBIA_SOPRA_Y)}"/>'
             f'<rect id="filo-sabbia" x="{n(CX - 1.6)}" y="{n(VETRO["collo"] - 2)}" width="3.2" height="{n(m["cima"] - VETRO["collo"] + 4)}" rx="1.6"/>'
             f'<path id="sabbia-sotto" d="{mucchio}"/></g>')
    # superficie della sabbia di sopra: un filo più chiaro
    g.append(f'<path id="sabbia-sopra-luce" d="M{n(CX - 19)} {n(SABBIA_SOPRA_Y + 0.8)} H{n(CX + 19)}" stroke="#FFFFFF" '
             f'stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round"/>')
    # riflesso sul vetro, sul bulbo di sinistra (sopra e sotto)
    g.append(f'<path id="vetro-riflesso" d="{riflesso(2.6, [(0, 0.06, 0.5), (1, 0.55, 0.95)])}" stroke="#FFFFFF" '
             f'stroke-opacity="0.85" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
    for nome, (y0, y1) in (("tappo-sopra", TAPPO_SOPRA), ("tappo-sotto", TAPPO_SOTTO)):
        d, t = tappo(nome, y0, y1)
        defs.append(d); g.append(t)
    corpo.append(f'<g id="clessidra">{"".join(g)}</g>')
    return svg(W, H, "Attesa / Caricamento", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-blu" / "illustrazioni" / "attesa-caricamento.svg"
    f.write_text(scena())
    print(f)
