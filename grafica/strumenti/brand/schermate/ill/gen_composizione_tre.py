"""
Composizione di tre illustrazioni del kit blu (40.026): misuratore 82 %, globo e calendario con il lucchetto rosso.

    python3 strumenti/brand/schermate/ill/gen_composizione_tre.py

È una COMPOSIZIONE di illustrazioni già disegnate (riuso: risultato-probabilita, mondo-internazionale, piano-studi-bloccato
di brand/disegni/kit-blu) su due sagome pallide che le legano; nessun oggetto nuovo. Disegnata nei pixel dell'originale
(219x198, fondo trasparente). Si può ricomporre cambiando le costanti in alto (posizione e larghezza di ogni pezzo).
"""
from __future__ import annotations

from comune import *
from ui import Tela

ID, W, H = "40.026", 219, 198
PEZZI = [  # (illustrazione, x, y, larghezza, id)
    ("kit-blu/illustrazioni/risultato-probabilita", -3, 36, 108, "misuratore"),
    ("kit-blu/illustrazioni/mondo-internazionale", 119, 18, 90, "globo"),
    ("kit-blu/illustrazioni/piano-studi-bloccato", 58, 95, 116, "calendario-lucchetto"),
]


def scena() -> str:
    t = Tela(W, H, fondo=None, id="composizione-tre")
    t.add('<g id="sagome-pallide" fill="#EDF2FE">'
          '<path id="sagoma-sinistra" d="M30 134 C42 128 62 136 78 150 C92 162 98 178 96 188 C70 192 46 190 34 178 C24 166 22 142 30 134 Z"/>'
          '<path id="sagoma-destra" d="M158 132 C174 128 196 134 205 148 C212 162 206 180 196 188 C182 192 164 188 156 176 Z"/></g>')
    for percorso, x, y, w, id_ in PEZZI:
        t.illustrazione(percorso, x, y, w, id=id_)
    return t.svg()


if __name__ == "__main__":
    f = scrivi("kit-blu", "composizione-misuratore-globo-calendario", scena())
    print(f); tavola(f, ID)
