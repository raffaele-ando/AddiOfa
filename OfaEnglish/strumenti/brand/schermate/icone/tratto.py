"""
Icone di tratto (immagini 35, "Valori del brand": successo, crescita, sicurezza, accessibilità, opportunità) più le
altre del set per averne uno coerente (libro, bersaglio, globo, messaggi, idea, documento).

    python3 strumenti/brand/schermate/icone/tratto.py

Scrive brand/concept-svg/icone/tratto/<nome>.svg (viewBox 24x24, tratto 1,9 arrotondato, blu #0A5AFB), _set.svg e
_tavola.png (32/64/128 px su chiaro e scuro).

Cosa corregge dell'originale: i cinque simboli sono disegnati in modi diversi (stella e scudo a contorno, barre, persone e
cappello pieni; spessori e dimensioni diverse). Qui un solo linguaggio: contorno di 1,9 con estremi e giunzioni tondi, sullo
stesso reticolo 24 e con un riempimento leggero (14 %) dello stesso blu, così a 32 px restano leggibili e il peso è uguale.
La stella è a cinque punte regolari (nell'originale è storta), lo scudo ha il lato sinistro e destro identici, le persone
hanno la stessa testa e lo stesso busto (la seconda dietro).
Le sei icone in più sono estensioni nello stesso stile (nell'originale ne esistono solo cinque a tratto).
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from base import Svg, V, arrotondato, polare, pt, n, set_svg, tavola, USCITA  # noqa: E402

DEST = USCITA / "tratto"
BLU = "#0A5AFB"
SPESSORE = 1.9
RIEMPI = 0.14


def stella5(cx, cy, R=9.6, r=4.3, raccordo=1.1):
    P = []
    for i in range(10):
        a = -90 + 36 * i
        P.append(polare(cx, cy, R if i % 2 == 0 else r, a))
    return arrotondato(P, [raccordo if i % 2 == 0 else 0.6 for i in range(10)])


def rett(x0, y0, x1, y1, r):
    return arrotondato([V(x0, y1), V(x0, y0), V(x1, y0), V(x1, y1)], [r, r, r, r])


# nome -> (etichetta, forme); forma = (path, riempi?) ; i tratti aperti non si riempiono
ICONE = {
    "successo": ("Successo", [(stella5(12, 12.9), True)]),
    "crescita": ("Crescita", [(rett(4, 13, 8.5, 20, 1.6), True), (rett(9.75, 8.5, 14.25, 20, 1.6), True), (rett(15.5, 4, 20, 20, 1.6), True)]),
    "sicurezza": ("Sicurezza", [("M12 3 4.5 6v5.6c0 4.6 3.1 8.1 7.5 9.4 4.4-1.3 7.5-4.8 7.5-9.4V6z", True), ("M8.7 12.1 11 14.4 15.4 9.6", False)]),
    "accessibilita": ("Accessibilità", [("M8.6 4.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 1 1 0-6.8z", True),
                                        ("M2.8 19.6c0-3.3 2.6-5.4 5.8-5.4s5.8 2.1 5.8 5.4z", True),
                                        ("M15.2 4.8a3.2 3.2 0 0 1 0 6.4", False), ("M16.4 14.4c2.5.5 4.8 2.2 4.8 5.2", False)]),
    "opportunita": ("Opportunità", [(arrotondato([V(12, 4.6), V(22, 9.6), V(12, 14.6), V(2, 9.6)], [1.4, 1.4, 1.4, 1.4]), True),
                                   ("M6 12.2v4.4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.4", False), ("M21.4 10.2v5.4", False)]),
    "libro": ("Libro", [("M12 6.6C10 5 7 4.6 3.6 5v12.6c3.4-.4 6.4 0 8.4 1.6 2-1.6 5-2 8.4-1.6V5C17 4.6 14 5 12 6.6z", True), ("M12 6.6v12.6", False)]),
    "bersaglio": ("Bersaglio", [("M12 3a9 9 0 1 1 0 18 9 9 0 1 1 0-18z", True), ("M12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 1 1 0-9.2z", False),
                                ("M12 11.2a.8.8 0 1 1 0 1.6.8.8 0 1 1 0-1.6z", True), ("M12.4 11.6 20.2 3.8M16.6 3.8h3.6v3.6", False)]),
    "globo": ("Globo", [("M12 3a9 9 0 1 1 0 18 9 9 0 1 1 0-18z", True), ("M3 12h18", False),
                        ("M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z", False)]),
    "messaggi": ("Messaggi", [("M8 8.4V6A2.5 2.5 0 0 1 10.5 3.5h8A2.5 2.5 0 0 1 21 6v6a2.5 2.5 0 0 1-2.5 2.5h-.7v3.2l-3.2-3.2", False),
                              ("M5.5 9.5h6.5A2.5 2.5 0 0 1 14.5 12v4A2.5 2.5 0 0 1 12 18.5H8.7L5.4 21.4v-2.9h-.1A2.5 2.5 0 0 1 3 16v-4a2.5 2.5 0 0 1 2.5-2.5z", True),
                              ("M6.4 14h.01M9.2 14h.01M12 14h.01", False)]),
    "idea": ("Idea", [("M12 3.2a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.3V17h5v-.7c0-.9.4-1.7 1.1-2.3A6 6 0 0 0 12 3.2z", True),
                      ("M9.8 20h4.4", False)]),
    "documento": ("Documento", [("M6.6 3h7l4.4 4.4V19.5a1.5 1.5 0 0 1-1.5 1.5h-9.9A1.5 1.5 0 0 1 5.1 19.5v-15A1.5 1.5 0 0 1 6.6 3z", True),
                                ("M13.6 3v4.4H18M8.6 12.4h6.8M8.6 16h4.6", False)]),
}
# elementi del catalogo coperti
ELEMENTI = {"successo": ["35.105"], "crescita": ["35.109"], "sicurezza": ["35.110"], "accessibilita": ["35.111"], "opportunita": ["35.112"]}


def icona(nome: str) -> Svg:
    etichetta, forme = ICONE[nome]
    s = Svg(0, 0, 24, 24, f"tratto-{nome}", f"Icona a tratto: {etichetta}")
    s.apri(id=f"icona-{nome}")
    for i, (d, riempi) in enumerate(forme):
        nodo = f'<path d="{d}" fill="{BLU if riempi else "none"}"' + (f' fill-opacity="{RIEMPI}"' if riempi else "") + \
            f' stroke="{BLU}" stroke-width="{n(SPESSORE)}" stroke-linecap="round" stroke-linejoin="round" id="{nome}-{i + 1}"/>'
        s.add(nodo)
    s.chiudi()
    return s


def main():
    percorsi = [icona(nome).salva(DEST / f"{nome}.svg") for nome in ICONE]
    set_svg(percorsi, DEST / "_set.svg", colonne=len(percorsi), cella=24, margine=12, id="set-tratto")
    tavola(percorsi, DEST / "_tavola.png", colonne=3)
    print("tratto:", len(percorsi), "icone")


if __name__ == "__main__":
    main()
