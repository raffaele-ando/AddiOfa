"""
Busta con il sigillo (email istituzionale) per i due kit: 50.028 (kit blu, 127x86, con l'aeroplanino di carta rosso) e
08.036 (kit rosso, 156x100, senza aeroplanino). Nessuno dei due ha un SVG in brand/disegni (il sigillo è dello stemma
del Politecnico e non si riproduce).

    python3 strumenti/brand/schermate/ill/gen_email_sigillo.py

Il SIGILLO DEL POLITECNICO NON È RIPRODOTTO: al suo posto un disco blu notte con un anello interno chiaro, id
`sigillo-segnaposto` (da sostituire con lo stemma quando c'è l'autorizzazione).
Difetti dell'originale corretti: la busta ha il lembo storto (il braccio destro sale più in fretta) e la punta schiacciata,
le pieghe di sotto sono chiazze, nel kit blu un doppio contorno chiaro dietro il lembo; l'aeroplanino è una macchia
rosa con una scia mozza. Qui: busta simmetrica costruita dritta e girata tutta insieme (rotazione), lembo a V con la punta
raccordata e ombra morbida, tasca con le due pieghe, aeroplanino con due ali e piega centrale e una scia tratteggiata.
Il kit rosso ha solo la busta e il sigillo, come l'originale (la busta resta lilla: è il tono del kit nel foglio 8).
"""
from __future__ import annotations

from comune import *

VARIANTI = {
    "blu": {"id": "50.028", "nome": "email-istituzionale-sigillo", "kit": "kit-blu", "tela": (127, 86),
            "busta": {"c": V(50, 49), "w": 88, "h": 54, "rot": -8, "r": 7},
            "sigillo": (V(82, 43), 25), "aereo": True,
            "nuvola": [(60, 50, 54, 33), (26, 60, 24, 22)]},
    "rosso": {"id": "08.036", "nome": "email-istituzionale-sigillo", "kit": "kit-rosso", "tela": (156, 100),
              "busta": {"c": V(58, 54), "w": 108, "h": 70, "rot": -10, "r": 8},
              "sigillo": (V(122, 50), 33), "aereo": False,
              "nuvola": [(70, 52, 66, 40), (28, 70, 28, 26)]},
}
C = {"corpo": ("#E6ECFE", "#CFDCFE"), "tasca": ("#D4DFFD", "#C6D4FC"), "lembo": ("#FFFFFF", "#EEF2FE"), "nuvola": "#EEF2FE",
     "ombra": "#2B4FC0", "sigillo": ("#0B4080", "#052F63"), "anello": "#FFFFFF"}


def aereo() -> list[str]:
    """Aeroplanino di carta rosso: due ali (chiara e scura) e una scia a due tratti."""
    tip, a, b, c = V(124, 4), V(105.5, 11.5), V(113.5, 16.5), V(118.5, 23)
    return [f'<g id="aeroplanino">'
            f'<path id="aeroplanino-ala-sinistra" d="{arrotondato([tip, a, b], [1.2, 1.5, 1.2])}" fill="#FF9EA1"/>'
            f'<path id="aeroplanino-ala-destra" d="{arrotondato([tip, b, c], [1.2, 1.2, 1.5])}" fill="#EF3F46"/>'
            f'<path id="aeroplanino-piega" d="M{p(tip)} L{p(b)}" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="0.8" stroke-linecap="round"/>'
            f'<path id="aeroplanino-scia" d="M104.5 26 L109.5 22" stroke="#F04146" stroke-width="3" stroke-linecap="round" opacity="0.9"/>'
            f'</g>']


def scena(nome: str) -> str:
    k = VARIANTI[nome]
    W, H = k["tela"]
    b = k["busta"]
    w, h, r = b["w"], b["h"], b["r"]
    x0, y0, x1, y1 = -w / 2, -h / 2, w / 2, h / 2
    punta = y0 + h * 0.6
    tasca_y = y0 + h * 0.52
    cx = 0
    defs = [sfocatura("sfuma-ombra", 2.0, W, H),
            f'<filter id="sfuma-lembo" filterUnits="userSpaceOnUse" x="{n(x0 - 10)}" y="{n(y0 - 10)}" width="{n(w + 20)}" height="{n(h + 20)}"><feGaussianBlur stdDeviation="1.6"/></filter>',
            lineare("busta-luce", V(0, y0), V(0, y1), [(0, C["corpo"][0]), (1, C["corpo"][1])]),
            lineare("tasca-luce", V(0, tasca_y), V(0, y1), [(0, C["tasca"][0]), (1, C["tasca"][1])]),
            lineare("lembo-luce", V(x0, y0), V(0, punta), [(0, C["lembo"][0]), (1, C["lembo"][1])]),
            lineare("sigillo-luce", V(0, 0), V(0, 1), [(0, C["sigillo"][0]), (1, C["sigillo"][1])]),
            f'<clipPath id="busta-forma"><path d="{arrotondato([V(x0, y0), V(x1, y0), V(x1, y1), V(x0, y1)], r)}"/></clipPath>']
    sag = [V(x0, y0), V(x1, y0), V(x1, y1), V(x0, y1)]
    g = [f'<path id="busta-corpo" d="{arrotondato(sag, r)}" fill="url(#busta-luce)"/>']
    tasca = [V(x0 - 2, y1 + 2), V(x0 - 2, y1 - 1), V(cx, tasca_y), V(x1 + 2, y1 - 1), V(x1 + 2, y1 + 2)]
    g.append(f'<path id="busta-tasca" d="{arrotondato(tasca, [0, 0, 11, 0, 0])}" fill="url(#tasca-luce)"/>')
    g.append(f'<path id="busta-pieghe" d="M{n(x0 + 3)} {n(y1 - 3)} L{n(cx - 8)} {n(tasca_y + 9)} M{n(x1 - 3)} {n(y1 - 3)} L{n(cx + 8)} {n(tasca_y + 9)}" '
             f'stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1" stroke-linecap="round"/>')
    lembo = [V(x0 - 2, y0 - 2), V(x1 + 2, y0 - 2), V(x1 + 2, y0 + 4), V(cx, punta), V(x0 - 2, y0 + 4)]
    g.append(f'<path id="busta-lembo-ombra" d="{arrotondato([q + V(0, 2.2) for q in lembo], [0, 0, 0, 11, 0])}" fill="{C["ombra"]}" opacity="0.14" filter="url(#sfuma-lembo)"/>')
    g.append(f'<path id="busta-lembo" d="{arrotondato(lembo, [0, 0, 0, 11, 0])}" fill="url(#lembo-luce)"/>')
    g.append(f'<path id="busta-lembo-filo" d="M{n(x0 + 4)} {n(y0 + 2.6)} H{n(x1 - 4)}" stroke="#FFFFFF" stroke-width="1" opacity="0.0"/>')
    rot = b["rot"]
    busta = (f'<g id="busta" transform="translate({n(b["c"].x)} {n(b["c"].y)}) rotate({rot})">'
             f'{ombra("busta-ombra", 1, y1 + 1.2, w * 0.4, 2.6, C["ombra"], 0.16)}'
             f'<g clip-path="url(#busta-forma)">{"".join(g)}</g></g>')
    c, R = k["sigillo"]
    sig = (f'<g id="sigillo-segnaposto">'
           f'{ombra("sigillo-ombra", c.x + 0.5, c.y + R * 0.8, R * 0.85, R * 0.18, "#052F63", 0.25)}'
           f'<circle id="sigillo-bordo" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R + 1.4)}" fill="#FFFFFF" opacity="0.7"/>'
           f'<circle id="sigillo-disco" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R)}" fill="{C["sigillo"][0]}" '
           f'style="fill:url(#sigillo-grad)"/>'
           f'<circle id="sigillo-anello" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(R * 0.72)}" fill="none" stroke="{C["anello"]}" stroke-opacity="0.45" stroke-width="{n(R * 0.05)}"/>'
           f'</g>')
    defs.append(lineare("sigillo-grad", V(0, c.y - R), V(0, c.y + R), [(0, C["sigillo"][0]), (1, C["sigillo"][1])]))
    corpo = [nuvola(k["nuvola"], C["nuvola"]), busta, sig] + (aereo() if k["aereo"] else [])
    return svg("Email istituzionale (sigillo segnaposto)", W, H, defs, corpo)


if __name__ == "__main__":
    for nome, k in VARIANTI.items():
        f = scrivi(k["kit"], k["nome"], scena(nome))
        print(f); tavola(f, k["id"], nome_tavola=f'{k["nome"]}--{k["kit"]}')
