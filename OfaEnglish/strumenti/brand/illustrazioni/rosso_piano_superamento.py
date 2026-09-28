"""
Piano di superamento: calendario con i giorni spuntati, due fogli dietro a ventaglio e tre raggi di
luce (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_piano_superamento.py

Difetti dell'originale corretti: i due anelli della testata sono diversi (a sinistra una barretta, a
destra un cerchietto), le spunte sono macchie rosse informi, tra le caselle ci sono puntini che le
collegano senza senso, le caselle hanno misure e distanze diverse, il foglio davanti non ha bordo e si
confonde con la nuvola, il foglio rosso dietro è un triangolo sfumato, quello a destra è una macchia
con un bitorzolo, i raggi non sono radiali. Qui: foglio bianco con bordo e ombra, testata con due
anelli uguali sull'asse, griglia regolare 3 x 2 con due caselle spuntate (✓ vero) e una "in corso",
due fogli interi dietro ruotati attorno al piede, raggi a ventaglio uguali dallo stesso centro.
Il gruppo `raggi` si può animare da solo.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, lineare, n, sfocatura  # noqa: E402
from oggetti_c import documento, raggio_luce, spunta  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 166, 149
C = {"nuvola": "#FEF1F1", "foglio": "#FFFFFF", "bordo": "#FCDADB", "testata": ("#FA4A52", "#EE2A34"),
     "anelli": ("#FFFFFF", "#FDE3E4"), "dietro_rosso": ("#FD9194", "#FB5A60"), "dietro_rosa": ("#FEEAEA", "#FDDCDD"),
     "fatta": ("#FC474F", "#EE2A34"), "in_corso": "#FDBABB", "vuota": "#FDE7E7", "raggi": ("#FEC43E", "#FEBC1E"),
     "ombra": "#DC2626"}
FOGLIO = (32, 42, 129, 140, 8)                   # x0 y0 x1 y1 raggio
TESTATA_H = 27
AX = (FOGLIO[0] + FOGLIO[2]) / 2                 # asse del calendario
ANELLI_DX = 22.5                                 # distanza degli anelli dall'asse
DIETRO = [("foglio-dietro-sinistra", "dietro_rosso", "translate(-3 0) rotate(-11 80 134)"),
          ("foglio-dietro-destra", "dietro_rosa", "translate(13 3) rotate(6 80 134)")]
CASELLA, COLONNE, RIGHE_Y = 17, (AX - 23, AX, AX + 23), (93.5, 119)
STATO = [["fatta", "in_corso", "vuota"], ["fatta", "vuota", "vuota"]]
ORIGINE_RAGGI = V(80, 70)
RAGGI = [(270, 47, 62), (240, 49, 61.5), (300, 49, 61.5)]


def scena() -> str:
    x0, y0, x1, y1, r = FOGLIO
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("testata-luce", V(x0, y0), V(x1, y0 + TESTATA_H), [(0, C["testata"][0]), (1, C["testata"][1])]),
            lineare("dietro_rosso-luce", V(0, y0), V(0, y1), [(0, C["dietro_rosso"][0]), (1, C["dietro_rosso"][1])]),
            lineare("dietro_rosa-luce", V(0, y0), V(0, y1), [(0, C["dietro_rosa"][0]), (1, C["dietro_rosa"][1])]),
            lineare("fatta-luce", V(0, 85), V(0, 128), [(0, C["fatta"][0]), (1, C["fatta"][1])]),
            lineare("raggi-luce", V(0, 8), V(0, 30), [(0, C["raggi"][0]), (1, C["raggi"][1])])]
    corpo = [f'<g id="nuvola" fill="{C["nuvola"]}"><ellipse cx="82" cy="94" rx="80" ry="54"/><circle cx="34" cy="106" r="32"/>'
             f'<circle cx="132" cy="104" r="32"/></g>']
    raggi = "".join(f'<path id="raggio-{i + 1}" d="{raggio_luce(ORIGINE_RAGGI, a, d, f)}"/>' for i, (a, d, f) in enumerate(RAGGI))
    corpo.append(f'<g id="raggi" stroke="url(#raggi-luce)" stroke-width="6" stroke-linecap="round" fill="none">{raggi}</g>')
    corpo.append(f'<ellipse id="ombra" cx="{n(AX)}" cy="{n(y1 + 1)}" rx="50" ry="3.5" fill="{C["ombra"]}" opacity="0.14" filter="url(#sfuma-ombra)"/>')
    # fogli dietro: interi, ruotati attorno al piede del calendario
    for nome, col, tr in DIETRO:
        bordo = f' stroke="{C["bordo"]}" stroke-width="1.2"' if col == "dietro_rosa" else ""
        corpo.append(f'<rect id="{nome}" x="{n(x0)}" y="{n(y0 + 9)}" width="{n(x1 - x0)}" height="{n(y1 - y0 - 13)}" rx="{n(r)}" '
                     f'fill="url(#{col}-luce)"{bordo} transform="{tr}"/>')
    # foglio davanti
    g = [f'<rect id="foglio" x="{n(x0)}" y="{n(y0)}" width="{n(x1 - x0)}" height="{n(y1 - y0)}" rx="{n(r)}" fill="{C["foglio"]}" '
         f'stroke="{C["bordo"]}" stroke-width="1.2"/>',
         f'<path id="testata" d="M{n(x0)} {n(y0 + TESTATA_H)} V{n(y0 + r)} A{n(r)} {n(r)} 0 0 1 {n(x0 + r)} {n(y0)} H{n(x1 - r)} '
         f'A{n(r)} {n(r)} 0 0 1 {n(x1)} {n(y0 + r)} V{n(y0 + TESTATA_H)} Z" fill="url(#testata-luce)"/>',
         f'<path id="testata-riflesso" d="M{n(x0 + 8)} {n(y0 + 3.5)} H{n(x1 - 8)}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.8" '
         f'stroke-linecap="round"/>']
    anelli = "".join(f'<rect id="anello-{i + 1}" x="{n(AX + s * ANELLI_DX - 3.5)}" y="{n(y0 - 7)}" width="7" height="19" rx="3.5"/>'
                     for i, s in enumerate((-1, 1)))
    defs.append(lineare("anello-luce", V(0, y0 - 7), V(0, y0 + 12), [(0, C["anelli"][0]), (1, C["anelli"][1])]))
    g.append(f'<g id="anelli" fill="url(#anello-luce)" stroke="#F4A3A6" stroke-width="0.8">{anelli}</g>')
    # griglia dei giorni
    caselle = []
    for ri, cy in enumerate(RIGHE_Y):
        for ci, cx in enumerate(COLONNE):
            stato = STATO[ri][ci]
            fill = "url(#fatta-luce)" if stato == "fatta" else C[stato]
            nome = f"casella-{ri + 1}-{ci + 1}"
            q = f'<rect id="{nome}" x="{n(cx - CASELLA / 2)}" y="{n(cy - CASELLA / 2)}" width="{CASELLA}" height="{CASELLA}" rx="4" fill="{fill}"/>'
            if stato == "fatta":
                q = (f'<g id="{nome}-gruppo">{q}<path id="{nome}-spunta" d="{spunta(V(cx, cy - 0.3), 11)}" fill="none" stroke="#FFFFFF" '
                     f'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>')
            caselle.append(q)
    g.append(f'<g id="caselle">{"".join(caselle)}</g>')
    corpo.append(f'<g id="calendario">{"".join(g)}</g>')
    return documento(W, H, "Piano di superamento", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "piano-superamento.svg"
    f.write_text(scena())
    print(f)
