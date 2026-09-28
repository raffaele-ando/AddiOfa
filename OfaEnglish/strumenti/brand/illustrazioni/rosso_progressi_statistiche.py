"""
Progressi / statistiche: scheda inclinata con due righe di testo, quattro barre che crescono e il
segno di crescita sopra l'ultima (kit rosso).

    python3 strumenti/brand/illustrazioni/rosso_progressi_statistiche.py

Difetti dell'originale corretti: barre di larghezze diverse, con la base che non sta su una linea e
i capi un po' storti; il cerchio sopra l'ultima barra la fa sembrare una "i" (un simbolo senza
senso); scheda senza bordo con i bordi sfrangiati. Qui: tutto è disegnato dritto in un gruppo
ruotato di un solo angolo (le barre restano parallele al bordo della scheda), barre uguali su una
base comune con altezze che crescono in modo regolare, il cerchio diventa un distintivo con la
freccia in su (progresso), righe di testo come barre arrotondate.
Le barre stanno ciascuna nel suo gruppo (`barra-1` … `barra-4`) per animarne la crescita.
"""
from __future__ import annotations

import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, lineare, n, sfocatura  # noqa: E402
from oggetti_c import documento, raccordata  # noqa: E402

BRAND = QUI.parents[2] / "brand"
W, H = 172, 140
INCLINAZIONE, PERNO = -3.4, V(86, 70)
SCHEDA = (8, 8, 164, 132, 16)                     # x0 y0 x1 y1 raggio (nel sistema della scheda, prima della rotazione)
C = {"scheda": ("#FFF4F4", "#FEEDED"), "bordo": "#FDDCDC", "testo": "#FEC5C6", "ombra": "#DC2626",
     "barre": [("#FEADAF", "#FD9597"), ("#FD5058", "#F8343D"), ("#FC3C45", "#EE2530"), ("#FC3C45", "#EE2530")]}
BASE_Y, LARGHEZZA, PASSO, X0 = 112.5, 20, 28.8, 37.2
ALTEZZE = (19, 35, 52, 63)
DISTINTIVO = (123.4, 33.2, 10.6)
RIGHE = [(28, 32.2, 50), (28, 51.3, 31)]          # x, y del centro, lunghezza (spessore 8)


def scena() -> str:
    x0, y0, x1, y1, r = SCHEDA
    defs = [sfocatura("sfuma-ombra", 2.5, W, H),
            lineare("scheda-luce", V(x0, y0), V(x1, y1), [(0, C["scheda"][0]), (1, C["scheda"][1])])]
    corpo = []
    g = [f'<rect id="scheda-ombra" x="{n(x0 + 8)}" y="{n(y1 - 5)}" width="{n(x1 - x0 - 16)}" height="8" rx="4" fill="{C["ombra"]}" '
         f'opacity="0.08" filter="url(#sfuma-ombra)"/>',
         f'<rect id="scheda" x="{n(x0)}" y="{n(y0)}" width="{n(x1 - x0)}" height="{n(y1 - y0)}" rx="{n(r)}" fill="url(#scheda-luce)" '
         f'stroke="{C["bordo"]}" stroke-width="1.2"/>']
    righe = "".join(f'<path id="riga-{i + 1}" d="M{n(x + 4)} {n(y)} H{n(x + l - 4)}"/>' for i, (x, y, l) in enumerate(RIGHE))
    g.append(f'<g id="righe-testo" stroke="{C["testo"]}" stroke-width="8" stroke-linecap="round">{righe}</g>')
    for i, h in enumerate(ALTEZZE):
        cx = X0 + i * PASSO
        a, b = cx - LARGHEZZA / 2, cx + LARGHEZZA / 2
        top = BASE_Y - h
        chiaro, scuro = C["barre"][i]
        defs.append(lineare(f"barra-{i + 1}-luce", V(a, top), V(b, BASE_Y), [(0, chiaro), (1, scuro)]))
        d = arrotondato([V(a, top), V(b, top), V(b, BASE_Y), V(a, BASE_Y)], 4.5)
        g.append(f'<g id="barra-{i + 1}"><path id="barra-{i + 1}-corpo" d="{d}" fill="url(#barra-{i + 1}-luce)"/>'
                 f'<path id="barra-{i + 1}-riflesso" d="M{n(a + 4.5)} {n(top + 5)} V{n(top + max(1.5, min(18, h * 0.35)))}" stroke="#FFFFFF" '
                 f'stroke-opacity="0.3" stroke-width="2.4" stroke-linecap="round"/></g>')
    # distintivo con la freccia in su, sopra l'ultima barra
    dx, dy, dr = DISTINTIVO
    defs.append(lineare("distintivo-luce", V(dx - dr, dy - dr), V(dx + dr, dy + dr), [(0, "#FC444C"), (1, "#EE2530")]))
    punta = raccordata([V(dx - 5, dy + 0.2), V(dx, dy - 5), V(dx + 5, dy + 0.2)], [1.2])
    g.append(f'<g id="distintivo"><circle id="distintivo-cerchio" cx="{n(dx)}" cy="{n(dy)}" r="{n(dr)}" fill="url(#distintivo-luce)"/>'
             f'<g id="freccia" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
             f'<path id="freccia-asta" d="M{n(dx)} {n(dy - 4.4)} V{n(dy + 5.6)}"/><path id="freccia-punta" d="{punta}"/></g></g>')
    corpo.append(f'<g id="statistiche" transform="rotate({n(INCLINAZIONE)} {n(PERNO.x)} {n(PERNO.y)})">' + "".join(g) + "</g>")
    return documento(W, H, "Progressi / Statistiche", defs, corpo)


if __name__ == "__main__":
    f = BRAND / "disegni" / "kit-rosso" / "illustrazioni" / "progressi-statistiche.svg"
    f.write_text(scena())
    print(f)
