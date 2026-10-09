"""
Calendario con il lucchetto BLU (variante di piano-studi-bloccato, che ha il lucchetto rosso): immagini 7 (7.049) e 28 (28.089).

    python3 strumenti/brand/schermate/ill/gen_calendario_lucchetto.py

Sono due inquadrature dello stesso soggetto, con il calendario "sbiadito" e il lucchetto blu al centro:
  - `navy`  (7.049, 105x86): foglio chiaro, lucchetto blu notte con il buco della chiave a goccia;
  - `blu`   (28.089, 106x89): calendario più pallido, lucchetto blu pieno con il buco della chiave bianco.
Difetti dell'originale corretti: il calendario ha un solo anello (7.049: un'ansa blu notte, 28.089: una molletta con un
bozzo) e la testata non si distingue; qui due anelli uguali e simmetrici sulla stessa testata; la nuvola ha una punta
a triangolo a sinistra (7.049) e un foglio "fantasma" storto dietro: qui nuvola a ellissi e un foglio dietro dritto;
nel 28.089 il simbolo del buco della chiave è una freccia in su (non è una chiave): qui buco vero (cerchio + trapezio);
lo spessore dell'arco del lucchetto cambiava: ora costante. Colori campionati dall'originale.
"""
from __future__ import annotations

from comune import *

VARIANTI = {
    "navy": {
        "id": "07.049", "tela": (105, 86),
        "nuvola": "#EEF3FE", "nuvola_forme": [(56, 47, 49, 35), (26, 52, 23, 24)],
        "dietro": (30, 6, 99, 70), "dietro_colore": "#E9F0FE",
        "foglio": (18, 13, 100, 79), "r": 8, "foglio_toni": ("#FAFCFF", "#E9F0FD"), "bordo": "#DCE7FB",
        "testata": (25, "#E1EAFD"), "anelli": {"x": (38, 80), "alto": 3, "basso": 19, "spessore": 4.0, "colore": ("#2563D8", "#0338A8")},
        "caselle": {"colore": "#C6D8FC", "x0": 34, "dx": 17.5, "y0": 27, "dy": 19, "w": 16, "h": 13, "r": 3},
        "lucchetto": {"corpo": (33, 44, 27.5, 24, 4.5), "arco": (46.75, 38.6, 8.3, 4.6), "colori": ("#2662DA", "#0A46C0", "#032E9C"),
                      "buco": "goccia", "buco_colore": "#2A67E3", "alone": 1.8, "ombra": "#0B3DAA"},
        "ombra": "#1D4ED8",
    },
    "blu": {
        "id": "28.089", "tela": (106, 89),
        "nuvola": "#F1F6FE", "nuvola_forme": [(54, 50, 47, 33), (22, 52, 16, 20), (88, 52, 14, 20)],
        "dietro": None, "dietro_colore": None,
        "foglio": (15, 21, 89, 79), "r": 7, "foglio_toni": ("#F8FAFF", "#EAF1FE"), "bordo": "#DCE8FD",
        "testata": (0, None), "anelli": {"x": (31, 73), "alto": 10, "basso": 26, "spessore": 4.2, "colore": ("#3B84F8", "#0B5BEF")},
        "caselle": {"colore": "#CFE0FD", "x0": 25, "dx": 20.5, "y0": 30, "dy": 24, "w": 13, "h": 14.5, "r": 3},
        "lucchetto": {"corpo": (35, 42, 23, 20.5, 4.5), "arco": (46.5, 37.2, 6.6, 4.4), "colori": ("#2F7BFA", "#0B5BEF", "#0048E6"),
                      "buco": "chiave", "buco_colore": "#FFFFFF", "alone": 1.6, "ombra": "#0B4FD8"},
        "ombra": "#1D4ED8",
    },
}


def scena(nome: str) -> str:
    k = VARIANTI[nome]
    W, H = k["tela"]
    x0, y0, x1, y1 = k["foglio"]
    R = k["r"]
    cs, an, lu = k["caselle"], k["anelli"], k["lucchetto"]
    lx, ly, lw, lh, lr = lu["corpo"]
    acx, acy, ar, asp = lu["arco"]
    th, tcol = k["testata"]
    defs = [sfocatura("sfuma-ombra", 2.0, W, H),
            lineare("foglio-luce", V(x0, y0), V(x1, y1), [(0, k["foglio_toni"][0]), (1, k["foglio_toni"][1])]),
            lineare("anello-luce", V(0, an["alto"]), V(0, an["basso"]), [(0, an["colore"][0]), (1, an["colore"][1])]),
            lineare("lucchetto-luce", V(lx, ly), V(lx + lw, ly + lh), [(0, lu["colori"][0]), (0.45, lu["colori"][1]), (1, lu["colori"][2])]),
            lineare("arco-luce", V(0, acy - ar - asp / 2), V(0, ly), [(0, lu["colori"][0]), (1, lu["colori"][1])])]
    corpo = [nuvola(k["nuvola_forme"], k["nuvola"])]
    if k["dietro"]:
        bx0, by0, bx1, by1 = k["dietro"]
        corpo.append(f'<path id="foglio-dietro" d="{rettangolo(bx0, by0, bx1 - bx0, by1 - by0, R)}" fill="{k["dietro_colore"]}"/>')
    # foglio del calendario con ombra e bordo
    cal = [ombra("foglio-ombra", (x0 + x1) / 2, y1 + 0.5, (x1 - x0) / 2 - 4, 3.2, k["ombra"], 0.14),
           f'<path id="foglio" d="{rettangolo(x0, y0, x1 - x0, y1 - y0, R)}" fill="url(#foglio-luce)" stroke="{k["bordo"]}" stroke-width="1"/>']
    if th:
        cal.append(f'<path id="testata" d="{arrotondato([V(x0, y0), V(x1, y0), V(x1, y0 + th), V(x0, y0 + th)], [R, R, 0, 0])}" fill="{tcol}"/>')
    # anelli: anse a "n" uguali, simmetriche rispetto al centro del foglio
    ring = []
    for i, cx in enumerate(an["x"]):
        a, b = an["alto"], an["basso"]
        rr = 3.9
        ring.append(f'<path id="anello-{i + 1}" d="M{n(cx - rr)} {n(b)} V{n(a + rr)} A{n(rr)} {n(rr)} 0 0 1 {n(cx + rr)} {n(a + rr)} V{n(b)}" '
                    f'fill="none" stroke="url(#anello-luce)" stroke-width="{an["spessore"]}" stroke-linecap="round"/>')
    cal.append(f'<g id="anelli">{"".join(ring)}</g>')
    cas = "".join(f'<path d="{rettangolo(cs["x0"] + c * cs["dx"], cs["y0"] + r * cs["dy"], cs["w"], cs["h"], cs["r"])}"/>' for r in range(2) for c in range(3))
    cal.append(f'<g id="caselle" fill="{cs["colore"]}">{cas}</g>')
    corpo.append(f'<g id="calendario">{"".join(cal)}</g>')
    # lucchetto: alone bianco che lo stacca dal calendario, ombra, arco a U di spessore costante, corpo, buco della chiave
    cx = lx + lw / 2
    arco = f"M{n(cx - ar)} {n(ly + 2)} V{n(acy)} A{n(ar)} {n(ar)} 0 0 1 {n(cx + ar)} {n(acy)} V{n(ly + 2)}"
    L = [ombra("lucchetto-ombra", cx + 0.6, ly + lh + 1.2, lw / 2, 2.4, lu["ombra"], 0.22),
         f'<path id="lucchetto-alone" d="{arco}" fill="none" stroke="#FFFFFF" stroke-width="{n(asp + 2 * lu["alone"])}" stroke-linecap="round" opacity="0.9"/>',
         f'<path id="lucchetto-corpo-alone" d="{rettangolo(lx - lu["alone"], ly - lu["alone"], lw + 2 * lu["alone"], lh + 2 * lu["alone"], lr + lu["alone"])}" fill="#FFFFFF" opacity="0.9"/>',
         f'<path id="lucchetto-arco" d="{arco}" fill="none" stroke="url(#arco-luce)" stroke-width="{asp}" stroke-linecap="round"/>',
         f'<path id="lucchetto-corpo" d="{rettangolo(lx, ly, lw, lh, lr)}" fill="url(#lucchetto-luce)"/>',
         f'<path id="lucchetto-riflesso" d="M{n(lx + 4)} {n(ly + 3)} H{n(lx + lw - 8)}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" stroke-linecap="round"/>']
    by = ly + lh * 0.42
    if lu["buco"] == "chiave":
        trap = arrotondato([V(cx - 1.1, by + 1.5), V(cx + 1.1, by + 1.5), V(cx + 2.0, by + 8.6), V(cx - 2.0, by + 8.6)], [0.4, 0.4, 0.9, 0.9])
        L.append(f'<g id="buco-chiave" fill="{lu["buco_colore"]}"><circle cx="{n(cx)}" cy="{n(by)}" r="2.7"/><path d="{trap}"/></g>')
    else:   # goccia: buco della chiave appena accennato, tono su tono (come l'originale)
        trap = arrotondato([V(cx - 0.9, by + 1.5), V(cx + 0.9, by + 1.5), V(cx + 1.5, by + 8), V(cx - 1.5, by + 8)], [0.3, 0.3, 0.7, 0.7])
        L.append(f'<g id="buco-chiave" fill="{lu["buco_colore"]}" opacity="0.85"><circle cx="{n(cx)}" cy="{n(by)}" r="2.3"/><path d="{trap}"/></g>')
    corpo.append(f'<g id="lucchetto">{"".join(L)}</g>')
    return svg("Piano di studi bloccato (lucchetto blu)", W, H, defs, corpo)


if __name__ == "__main__":
    for nome, k in VARIANTI.items():
        f = scrivi("kit-blu", {"navy": "piano-studi-bloccato-lucchetto-navy", "blu": "piano-studi-bloccato-lucchetto-blu"}[nome], scena(nome))
        print(f)
        tavola(f, k["id"])
