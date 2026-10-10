"""
Simulazione d'esame: portablocco inclinato con la bandiera del Regno Unito, due caselle spuntate e
righe di testo (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_simulazione_esame.py

Difetti dell'originale corretti: il portablocco non ha il lato di sotto (la cornice rossa è una U
che sfuma), i due fianchi hanno inclinazioni diverse (uno 8°, l'altro 11°: non è una tavola rigida),
il fermaglio non è centrato, la bandiera ha le diagonali rosse centrate e sporche, le caselle hanno
misure diverse e non sono in colonna, macchie e bordi sfrangiati. Qui: una tavola sola con il bordo
rosso tutto intorno e il foglio sopra, tutto disegnato dritto in un gruppo ruotato di un solo angolo,
fermaglio sull'asse con l'anello e il foro, bandiera vera (oggetti.bandiera_uk), caselle uguali in
colonna con la spunta, righe come barre arrotondate.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402
from oggetti import bandiera_uk  # noqa: E402
from oggetti_c import documento, spunta  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 163, 152
INCLINAZIONE, PERNO = 6.3, V(82, 83)
CX = 82                                         # asse della tavola (nel sistema della tavola)
TAVOLA = (22, 23, 142, 143, 12)                 # x0 y0 x1 y1 raggio
BORDO = 6                                       # quanto si vede la tavola attorno al foglio
FERMAGLIO = (27, 14, 37, 6, 9, 3.6)             # mezza larghezza, y alto, y basso, raggio, raggio anello, raggio foro
C = {"nuvola": "#FEF1F1", "tavola": ("#FDA3A7", "#FB5A60", "#F2353D"), "foglio": ("#FFFFFF", "#FFF2F2"),
     "fermaglio": ("#F25A5D", "#E23A3F"), "testo": "#FDC9CA", "casella": ("#FD4A52", "#EE2831"),
     "ombra": "#DC2626", "bandiera_blu": "#1D4ED8", "bandiera_rosso": "#EF4444"}
BANDIERA = (75.5, 48.5, 45, 27)                  # x, y, larghezza, altezza (5:3 come nell'originale)
CASELLE = [V(54.5, 92), V(54.5, 122)]
LATO_CASELLA = 19
RIGHE = [(45, 60, 20), (74, 92, 43), (74, 122, 38)]   # x, y, lunghezza (spessore 7)


def scena() -> str:
    x0, y0, x1, y1, r = TAVOLA
    mf, fa, fb, fr, ra, rf = FERMAGLIO
    defs = [sfocatura("sfuma-ombra", 2.4, W, H),
            lineare("tavola-luce", V(x0, y0), V(x1, y1), [(0, C["tavola"][0]), (0.45, C["tavola"][1]), (1, C["tavola"][2])]),
            lineare("foglio-luce", V(x0, y0), V(x1, y1), [(0, C["foglio"][0]), (1, C["foglio"][1])]),
            lineare("fermaglio-luce", V(0, fa - ra), V(0, fb), [(0, C["fermaglio"][0]), (1, C["fermaglio"][1])])]
    corpo = [f'<g id="nuvola" fill="{C["nuvola"]}"><ellipse cx="82" cy="90" rx="78" ry="54"/><circle cx="36" cy="104" r="34"/>'
             f'<circle cx="128" cy="100" r="32"/></g>',
             f'<ellipse id="ombra" cx="80" cy="146" rx="52" ry="3.2" fill="{C["ombra"]}" opacity="0.14" filter="url(#sfuma-ombra)"/>']
    g = []
    g.append(f'<rect id="tavola" x="{n(x0)}" y="{n(y0)}" width="{n(x1 - x0)}" height="{n(y1 - y0)}" rx="{n(r)}" fill="url(#tavola-luce)"/>')
    g.append(f'<path id="tavola-filo" d="M{n(x0 + 1.4)} {n(y1 - r)} V{n(y0 + r)} A{n(r - 1.4)} {n(r - 1.4)} 0 0 1 {n(x0 + r)} {n(y0 + 1.4)} H{n(CX - mf - 3)}" '
             f'fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1.1" stroke-linecap="round"/>')
    b = BORDO
    g.append(f'<rect id="foglio" x="{n(x0 + b)}" y="{n(y0 + b)}" width="{n(x1 - x0 - 2 * b)}" height="{n(y1 - y0 - 2 * b)}" rx="{n(r - b + 1)}" '
             f'fill="url(#foglio-luce)"/>')
    # fermaglio: linguetta arrotondata + anello con il foro, sull'asse
    linguetta = arrotondato([V(CX - mf, fa), V(CX + mf, fa), V(CX + mf, fb), V(CX - mf, fb)], [fr, fr, fr, fr])
    g.append(f'<rect id="fermaglio-ombra" x="{n(CX - mf + 3)}" y="{n(fb - 2)}" width="{n(2 * mf - 6)}" height="4.5" rx="2.2" fill="{C["ombra"]}" '
             f'opacity="0.16" filter="url(#sfuma-ombra)"/>')
    g.append(f'<g id="fermaglio"><circle id="fermaglio-anello" cx="{n(CX)}" cy="{n(fa)}" r="{n(ra)}" fill="url(#fermaglio-luce)"/>'
             f'<path id="fermaglio-linguetta" d="{linguetta}" fill="url(#fermaglio-luce)"/>'
             f'<circle id="fermaglio-foro" cx="{n(CX)}" cy="{n(fa)}" r="{n(rf)}" fill="#FFFFFF"/>'
             f'</g>')
    # righe di testo
    righe = "".join(f'<path id="riga-{i + 1}" d="M{n(x + 3.5)} {n(y)} H{n(x + l - 3.5)}"/>' for i, (x, y, l) in enumerate(RIGHE))
    g.append(f'<g id="righe-testo" stroke="{C["testo"]}" stroke-width="7" stroke-linecap="round">{righe}</g>')
    # caselle spuntate
    lc = LATO_CASELLA
    for i, c in enumerate(CASELLE):
        defs.append(lineare(f"casella-{i + 1}-luce", c - V(lc / 2, lc / 2), c + V(lc / 2, lc / 2),
                            [(0, C["casella"][0]), (1, C["casella"][1])]))
        g.append(f'<g id="casella-{i + 1}"><rect id="casella-{i + 1}-fondo" x="{n(c.x - lc / 2)}" y="{n(c.y - lc / 2)}" width="{n(lc)}" '
                 f'height="{n(lc)}" rx="4.6" fill="url(#casella-{i + 1}-luce)"/>'
                 f'<path id="casella-{i + 1}-spunta" d="{spunta(c + V(0, -0.3), 12)}" fill="none" stroke="#FFFFFF" stroke-width="2.8" '
                 f'stroke-linecap="round" stroke-linejoin="round"/></g>')
    bx, by, bl, bh = BANDIERA
    g.append(f'<rect id="bandiera-ombra" x="{n(bx + 3)}" y="{n(by + bh - 1)}" width="{n(bl - 6)}" height="4" rx="2" fill="{C["ombra"]}" '
             f'opacity="0.14" filter="url(#sfuma-ombra)"/>')
    d, c = bandiera_uk("bandiera", (1, 0, 0, 1, bx, by), bl, bh, C["bandiera_blu"], C["bandiera_rosso"], 3)
    defs.append(d); g.append(c)
    corpo.append(f'<g id="portablocco" transform="rotate({n(INCLINAZIONE)} {n(PERNO.x)} {n(PERNO.y)})">' + "".join(g) + "</g>")
    return documento(W, H, "Simulazione d'esame", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "simulazione-esame.svg"
    f.write_text(scena())
    print(f)
