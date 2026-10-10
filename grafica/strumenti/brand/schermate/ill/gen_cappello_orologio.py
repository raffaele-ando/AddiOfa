"""
Cappello di laurea con il cronometro (kit blu, 15.061 — nessun SVG esistente: accesso-bloccato è lo studente dentro una finestra).

    python3 strumenti/brand/schermate/ill/gen_cappello_orologio.py

Soggetto nuovo: tocco (tavola a rombo con lo spessore, calotta, cordone e nappa) + cronometro rosso in basso a destra.
Difetti dell'originale corretti: la tavola non è un parallelogramma (il lato sotto è più corto di quello sopra), la nappa è
storta e senza cordone che parte dal bottone, il cronometro ha l'anello di spessore variabile e due tacche di colore
diverso (rossa a destra, blu in basso); la lancetta delle ore non parte dal centro. Qui: parallelogramma con spessore
costante, bottone al centro e la nappa che scende dall'angolo di sinistra (l'originale non ha il cordone); cronometro con anello a
spessore costante, quattro tacche uguali, lancette dal centro (le 4:00 come nell'originale), pulsante e stelo.
Colori campionati sull'originale (tocco #4C8DFD → #2C71F4, calotta #125BE0 → #074BCD, cronometro #FD585B → #EF4049).
"""
from __future__ import annotations

import math

from comune import *

ID, W, H = "15.061", 114, 103
L, T, R_, B = V(10, 29), V(61, 16.5), V(111, 37), V(60, 49.5)       # tavola: parallelogramma (B = L + R - T)
SPESSORE = 3.6
CALOTTA = (32, 40, 85, 62, 69)                                       # x sx, y alto, x dx, y lato dx, y fondo centro
NAPPA_X = 20.5
CRON = {"c": V(91, 75), "R": 18.8, "s": 5.0, "colori": ("#FF6A6D", "#EC3F48"), "lancette": "#0A3FC0"}


def scena() -> str:
    defs = [sfocatura("sfuma-ombra", 1.8, W, H),
            lineare("tavola-luce", V(10, 20), V(111, 49), [(0, "#5C98FE"), (0.5, "#3F83F9"), (1, "#2A6DF2")]),
            lineare("tavola-bordo", V(0, 30), V(0, 54), [(0, "#2A68E8"), (1, "#154FD2")]),
            lineare("calotta-luce", V(32, 40), V(85, 69), [(0, "#1B63EE"), (0.55, "#0E55D8"), (1, "#0540C0")]),
            lineare("nappa-luce", V(17, 58), V(25, 76), [(0, "#1B62F0"), (1, "#0B45CC")]),
            lineare("anello-luce", V(0, 53), V(0, 97), [(0, CRON["colori"][0]), (1, CRON["colori"][1])])]
    cx0, cy0, cx1, cy1, cyf = CALOTTA
    calotta = f"M{cx0} {cy0} V{cy1 - 2} C{cx0} {cyf - 1} {cx0 + 14} {cyf} {(cx0 + cx1) / 2 + 1} {cyf} C{cx1 - 13} {cyf} {cx1} {cyf - 2} {cx1} {cy1 - 2} V{cy0} Z"
    rombo = [L, T, R_, B]
    rombo_giu = [q + V(0, SPESSORE) for q in rombo]
    tavola = arrotondato(rombo, [2.2, 2.2, 2.6, 2.2])
    fianco = arrotondato(rombo_giu, [2.2, 2.2, 2.6, 2.2])
    C = V((L.x + R_.x) / 2, (L.y + R_.y) / 2 + 0.5)                  # centro della tavola: bottone
    corpo = [nuvola([(57, 52, 54.5, 49.5), (30, 60, 28, 32)], "#EAF0FD")]
    # alone bianco che stacca il tocco dallo sfondo (come l'originale)
    halo = (f'<g id="cappello-alone" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4.6" stroke-linejoin="round">'
            f'<path d="{calotta}"/><path d="{fianco}"/><path d="{tavola}"/>'
            f'<path d="{rettangolo(NAPPA_X - 3.8, 56, 7.6, 21, 3)}"/></g>')
    cap = [f'<path id="calotta" d="{calotta}" fill="url(#calotta-luce)"/>',
           f'<path id="calotta-ombra-tavola" d="M{cx0} {cy0} H{cx1} V{cy0 + 9} C{cx1 - 20} {cy0 + 12} {cx0 + 20} {cy0 + 12} {cx0} {cy0 + 9} Z" fill="#0A3C9E" opacity="0.28"/>',
           f'<path id="calotta-riflesso" d="M{cx0 + 5} {cy0 + 12} V{cy1 - 3}" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="2.2" stroke-linecap="round"/>',
           f'<path id="tavola-spessore" d="{fianco}" fill="url(#tavola-bordo)"/>',
           f'<path id="tavola" d="{tavola}" fill="url(#tavola-luce)"/>',
           f'<path id="tavola-filo-di-luce" d="M{p(L + V(3, 0.2))} L{p(T + V(-1, 0.3))}" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.1" stroke-linecap="round"/>',
           f'<circle id="bottone" cx="{n(C.x)}" cy="{n(C.y)}" r="2.6" fill="#1D5FE8"/>',
           f'<circle id="bottone-luce" cx="{n(C.x - 0.7)}" cy="{n(C.y - 0.8)}" r="1" fill="#FFFFFF" opacity="0.45"/>']
    nappa = [f'<path id="nappa-cordone" d="M{n(NAPPA_X)} {n(L.y + 3)} V59" stroke="#1D5FE8" stroke-width="3.2" stroke-linecap="round" fill="none"/>',
             f'<path id="nappa-fascetta" d="{rettangolo(NAPPA_X - 2.9, 56.8, 5.8, 3.6, 1.4)}" fill="#0F4FDD"/>',
             f'<path id="nappa-frange" d="{arrotondato([V(NAPPA_X - 3, 59.5), V(NAPPA_X + 3, 59.5), V(NAPPA_X + 4.3, 76), V(NAPPA_X - 4.3, 76)], [1.5, 1.5, 2.2, 2.2])}" fill="url(#nappa-luce)"/>',
             f'<path id="nappa-riflesso" d="M{n(NAPPA_X - 1.2)} 62.5 V72" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.1" stroke-linecap="round"/>']
    # cronometro
    c, r, s = CRON["c"], CRON["R"], CRON["s"]
    ticks = "".join(f'<path d="M{p(c + V(math.sin(math.radians(a)), -math.cos(math.radians(a))) * (r - 2.4))} L{p(c + V(math.sin(math.radians(a)), -math.cos(math.radians(a))) * (r - 5))}"/>'
                    for a in (0, 90, 180, 270))
    ora = c + V(math.sin(math.radians(120)), -math.cos(math.radians(120))) * 9.5
    cr = [f'<circle id="cronometro-alone" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r + s / 2 + 2.2)}" fill="#FFFFFF"/>',
          ombra("cronometro-ombra", c.x + 0.8, c.y + r + s / 2 + 1.5, r * 0.7, 2.2, "#B91C1C", 0.18),
          f'<g id="cronometro-pulsante" transform="rotate(32 {n(c.x + 5.8)} {n(c.y - r - 3.5)})">'
          f'<path d="{rettangolo(c.x + 3.6, c.y - r - 6.2, 4.6, 5.2, 1.6)}" fill="#F45359"/></g>',
          f'<path id="cronometro-stelo" d="M{n(c.x + 6.6)} {n(c.y - r - 3)} L{n(c.x + 6)} {n(c.y - r - 0.5)}" stroke="#F45359" stroke-width="2.4" stroke-linecap="round"/>',
          f'<circle id="cronometro-quadrante" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="#FFFFFF"/>',
          f'<circle id="cronometro-anello" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="none" stroke="url(#anello-luce)" stroke-width="{n(s)}"/>',
          f'<g id="cronometro-tacche" stroke="#F96E71" stroke-width="1.6" stroke-linecap="round" fill="none">{ticks}</g>',
          f'<g id="lancette" stroke="{CRON["lancette"]}" stroke-width="2.8" stroke-linecap="round" fill="none">'
          f'<path id="lancetta-minuti" d="M{p(c)} V{n(c.y - 12.5)}"/><path id="lancetta-ore" d="M{p(c)} L{p(ora)}"/></g>',
          f'<circle id="cronometro-perno" cx="{n(c.x)}" cy="{n(c.y)}" r="2" fill="{CRON["lancette"]}"/>']
    corpo += [halo, f'<g id="cappello">{"".join(cap)}</g>', f'<g id="nappa">{"".join(nappa)}</g>', f'<g id="cronometro">{"".join(cr)}</g>']
    return svg("Cappello di laurea con cronometro", W, H, defs, corpo)


if __name__ == "__main__":
    f = scrivi("kit-blu", "cappello-laurea-orologio", scena())
    print(f); tavola(f, ID)
