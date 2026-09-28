"""
Oggetti ricorrenti delle illustrazioni, costruiti per bene e con parametri (posizione, misure,
colori). Ogni funzione restituisce (defs, corpo) in SVG, con id in italiano su ogni pezzo.
"""
from __future__ import annotations

import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from geometria import V, arrotondato, linea, lineare, n, p  # noqa: E402


def libro(nome: str, F: V, u: V, v: V, spessore: float, colori: dict) -> tuple[str, str]:
    """Libro chiuso appoggiato, in 3/4.

    F  spigolo davanti in alto, dove il dorso incontra il lato delle pagine
    u  direzione e lunghezza del lato delle pagine (verso destra-dietro)
    v  direzione e lunghezza del dorso (verso sinistra-dietro)
    colori: chiaro, base, scuro (copertina), pagine, righe

    È una sola massa morbida: la sagoma intera (dorso + copertina + lato) ha gli angoli raccordati,
    la copertina di sopra è più chiara e si stacca dal dorso con un filo di luce (lo spigolo
    arrotondato della copertina), il dorso è curvo (chiaro in alto, scuro in basso, con il solco
    della cerniera vicino alla costa), il blocco delle pagine è rientrato tra le due copertine.
    """
    H = V(0, spessore)
    c = colori
    t = spessore * 0.17                      # spessore di una copertina
    defs, g = [], []
    # sagoma intera: sei vertici visibili
    sag = [F + u + v, F + u, F + u + H, F + H, F + v + H, F + v]
    r_costa = spessore * 0.5                 # la costa (estremità del dorso) è mezzo cerchio
    g.append(f'<path id="{nome}-corpo" d="{arrotondato(sag, [8, 5, 4, 3, r_costa, r_costa])}" fill="url(#{nome}-dorso-luce)"/>')
    # lato delle pagine: tra le due copertine, rientrato di un filo
    rientro = u.uni() * 1.2
    a0 = F + V(0, t) + rientro * 1.5
    pag = [a0, F + u * 0.975 + V(0, t), F + u * 0.975 + H - V(0, t), F + H - V(0, t) + rientro * 1.5]
    g.append(f'<path id="{nome}-pagine" d="{arrotondato(pag, [1, 2, 2, 1])}" fill="url(#{nome}-pagine-luce)"/>')
    for k, frazione in enumerate((0.34, 0.5, 0.66)):
        y = V(0, t + (spessore - 2 * t) * frazione)
        g.append(f'<path id="{nome}-riga-{k + 1}" d="{linea(F + y + u * 0.05, F + y + u * 0.94)}" stroke="{c["righe"]}" '
                 f'stroke-width="0.6" stroke-linecap="round" fill="none"/>')
    # ombra della copertina di sopra sulle pagine
    g.append(f'<path id="{nome}-ombra-pagine" d="{linea(a0 + V(0, 0.7), F + u * 0.975 + V(0, t + 0.7))}" stroke="{c["scuro"]}" '
             f'stroke-opacity="0.22" stroke-width="1.2" fill="none"/>')
    # copertina di sopra, con angoli morbidi
    sopra = [F + v, F + u + v, F + u, F]
    g.append(f'<path id="{nome}-copertina" d="{arrotondato(sopra, [r_costa * 0.9, 8, 5, 3])}" fill="url(#{nome}-copertina-luce)"/>')
    # filo di luce sullo spigolo davanti della copertina (dal dorso al lato delle pagine)
    g.append(f'<path id="{nome}-spigolo" d="{linea(F + v * 0.93, F + v * 0.03, F + u * 0.03, F + u * 0.96)}" stroke="#FFFFFF" '
             f'stroke-opacity="0.45" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" fill="none"/>')
    # solco della cerniera sul dorso, vicino alla costa, e riflesso lungo il dorso
    s0 = F + v * 0.86
    g.append(f'<path id="{nome}-cerniera" d="{linea(s0 + V(0, 2.5), s0 + H - V(0, 2.5))}" stroke="{c["scuro"]}" '
             f'stroke-opacity="0.35" stroke-width="0.9" stroke-linecap="round" fill="none"/>')
    g.append(f'<path id="{nome}-riflesso" d="{linea(F + v * 0.8 + H * 0.3, F + v * 0.08 + H * 0.3)}" stroke="#FFFFFF" '
             f'stroke-opacity="0.22" stroke-width="{n(spessore * 0.14)}" stroke-linecap="round" fill="none"/>')
    defs.append(lineare(f"{nome}-dorso-luce", F, F + H, [(0, c["base"]), (1, c["scuro"])]))
    defs.append(lineare(f"{nome}-copertina-luce", F + v, F + u, [(0, c["chiaro"]), (0.55, c["base"]), (1, c["base"])]))
    defs.append(lineare(f"{nome}-pagine-luce", F, F + u, [(0, "#FFFFFF"), (1, c["pagine"])]))
    return "".join(defs), f'<g id="{nome}">{"".join(g)}</g>'


def bandiera_uk(nome: str, matrice: tuple, larghezza: float = 72, altezza: float = 48,
                blu: str = "#1D4ED8", rosso: str = "#EF4444", raggio: float = 3) -> tuple[str, str]:
    """Bandiera del Regno Unito costruita come quella vera: campo blu, diagonali bianche, diagonali
    rosse sfalsate (controcambiate: il rosso sta dalla parte in senso orario di ogni braccio),
    croce bianca e croce rossa. `matrice` = transform SVG (a b c d e f) per posarla nella scena."""
    L, A = larghezza, altezza
    cx, cy = L / 2, A / 2
    defs = (f'<clipPath id="{nome}-forma"><rect width="{n(L)}" height="{n(A)}" rx="{n(raggio)}"/></clipPath>'
            f'<clipPath id="{nome}-controcambio"><path d="M{n(cx)} {n(cy)} H{n(L)} V{n(A)} Z V{n(A)} H0 Z H0 V0 Z V0 H{n(L)} Z"/></clipPath>'
            + lineare(f"{nome}-lucentezza", V(0, 0), V(0, A), [(0, "#FFFFFF", 0.18), (0.5, "#FFFFFF", 0), (1, "#000000", 0.06)]))
    diag = f"M0 0 L{n(L)} {n(A)} M{n(L)} 0 L0 {n(A)}"
    croce = f"M{n(cx)} 0 V{n(A)} M0 {n(cy)} H{n(L)}"
    corpo = (f'<g id="{nome}" transform="matrix({" ".join(n(x) for x in matrice)})"><g clip-path="url(#{nome}-forma)">'
             f'<rect id="{nome}-campo" width="{n(L)}" height="{n(A)}" fill="{blu}"/>'
             f'<path id="{nome}-diagonali-bianche" d="{diag}" stroke="#FFFFFF" stroke-width="{n(A * 0.2)}"/>'
             f'<path id="{nome}-diagonali-rosse" d="{diag}" stroke="{rosso}" stroke-width="{n(A * 0.08)}" clip-path="url(#{nome}-controcambio)"/>'
             f'<path id="{nome}-croce-bianca" d="{croce}" stroke="#FFFFFF" stroke-width="{n(A * 0.3)}"/>'
             f'<path id="{nome}-croce-rossa" d="{croce}" stroke="{rosso}" stroke-width="{n(A * 0.18)}"/>'
             f'<rect id="{nome}-lucentezza" width="{n(L)}" height="{n(A)}" fill="url(#{nome}-lucentezza)"/>'
             f'</g></g>')
    return defs, corpo
