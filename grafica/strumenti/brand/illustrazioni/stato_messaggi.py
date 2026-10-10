"""
Stato / Messaggi: tre fumetti (rosso chiaro, pallido con due righe, rosso con tre puntini) (kit rosso).

    python3 strumenti/brand/illustrazioni/stato_messaggi.py

Difetti dell'originale corretti: il fumetto di destra ha una tacca senza senso sul lato sinistro e
l'angolo in alto a sinistra vivo, la coda del fumetto centrale è sfocata e quasi staccata, la
seconda riga del fumetto centrale è spezzata in un pezzo e un puntino, gli angoli dei fumetti hanno
raggi diversi, bordi bianchi sfrangiati. Qui: ogni fumetto è una sagoma sola con la coda raccordata
(oggetti_d.fumetto), righe come barre arrotondate, tre puntini uguali ed equidistanti, il fumetto
di destra staccato da quello centrale con un bordo bianco netto.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, n  # noqa: E402
from oggetti_d import filtro_ombra, fumetto, ombra, svg  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 180, 77
FUMETTI = {  # nome: (x0, y0, x1, y1, raggio, coda (xa, xb, punta), colori)
    "fumetto-centrale": (73, 3.5, 135, 54, 7, (82, 93, V(82.5, 61.5)), {"chiaro": "#F5F7FE", "base": "#EBEFFB", "scuro": "#E0E6F8"}),
    "fumetto-sinistro": (6, 21, 64, 63, 6, (24, 36.5, V(24.5, 73.5)), {"chiaro": "#FF9FA0", "base": "#FD8487", "scuro": "#F66C73"}),
    "fumetto-destro": (130.5, 34, 171.5, 67.5, 6, (152, 163, V(163.5, 75)), {"chiaro": "#FF8184", "base": "#FB6167", "scuro": "#EE4850"}),
}
C = {"barra": ("#F2383F", "#E3262F"), "righe": "#6D82A5", "puntini": "#FFFFFF", "ombra": "#DC2626", "ombra_pallida": "#475569"}


def scena() -> str:
    defs = [filtro_ombra(W, H, 1.4)]
    corpo = []
    gruppi = {}
    for nome, (x0, y0, x1, y1, r, coda, col) in FUMETTI.items():
        d, g = fumetto(nome, x0, y0, x1, y1, r, coda, col, riflesso=nome != "fumetto-centrale",
                       bordo="#DEE4F7" if nome == "fumetto-centrale" else None)
        defs.append(d)
        gruppi[nome] = g
    # ombre morbide sotto i fumetti
    corpo.append(ombra("ombra-centrale", 104, 55, 28, 2, C["ombra_pallida"], 0.1))
    corpo.append(ombra("ombra-sinistra", 35, 64, 26, 2, C["ombra"], 0.16))
    corpo.append(ombra("ombra-destra", 151, 68.5, 18, 1.8, C["ombra"], 0.16))
    # fumetto centrale (dietro) con le due righe di testo
    corpo.append(f'<g id="messaggio-centrale">{gruppi["fumetto-centrale"]}'
                 f'<g id="righe" fill="{C["righe"]}"><rect id="riga-1" x="90" y="21.3" width="28" height="5" rx="2.5"/>'
                 f'<rect id="riga-2" x="90" y="32.8" width="22" height="5" rx="2.5"/></g></g>')
    # fumetto sinistro con la barra
    from geometria import lineare
    defs.append(lineare("barra-luce", V(0, 38), V(0, 45), [(0, C["barra"][0]), (1, C["barra"][1])]))
    corpo.append(f'<g id="messaggio-sinistro">{gruppi["fumetto-sinistro"]}'
                 f'<rect id="barra" x="20" y="38" width="29.5" height="7" rx="3.5" fill="url(#barra-luce)"/></g>')
    # fumetto destro davanti al centrale: bordo bianco netto, poi la sagoma e i tre puntini
    x0, y0, x1, y1, r, coda, col = FUMETTI["fumetto-destro"]
    from geometria import arrotondato
    xa, xb, P = coda
    pts = [V(x0, y0), V(x1, y0), V(x1, y1), V(xb, y1), P, V(xa, y1), V(x0, y1)]
    bordo = arrotondato(pts, [r, r, r, 2.2, 1.4, 2.2, r])
    cy = (y0 + y1) / 2 + 0.2
    puntini = "".join(f'<circle id="puntino-{i + 1}" cx="{n((x0 + x1) / 2 + (i - 1) * 7.6)}" cy="{n(cy)}" r="2.4"/>' for i in range(3))
    corpo.append(f'<g id="messaggio-destro"><path id="fumetto-destro-bordo" d="{bordo}" fill="none" stroke="#FFFFFF" '
                 f'stroke-width="3" stroke-linejoin="round"/>{gruppi["fumetto-destro"]}'
                 f'<g id="puntini" fill="{C["puntini"]}">{puntini}</g></g>')
    return svg(W, H, "Stato / Messaggi", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "stati" / "messaggi.svg"
    f.write_text(scena())
    print(f)
