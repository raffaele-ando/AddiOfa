"""
Pezzi comuni agli «stati» del kit rosso (completato, errore, in corso, notifica, attesa, messaggi…),
costruiti una volta sola perché la famiglia sia coerente: foglio con l'angolo piegato e le righe di
testo, badge tondo con bordo bianco (spunta, croce, orologio, numero), clessidra, fumetto.

Ogni funzione restituisce (defs, corpo) in SVG, con id in italiano su ogni pezzo e le parti
animabili (simbolo del badge, lancette, sabbia) in un <g> loro.
"""
from __future__ import annotations

import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
from geometria import V, arrotondato, linea, lineare, n, radiale, sfocatura  # noqa: E402
from testo_svg import tracciato  # noqa: E402


# ---------------------------------------------------------------- tela

def svg(W: float, H: float, titolo: str, defs: list[str], corpo: list[str]) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(W)} {n(H)}" width="{n(W)}" height="{n(H)}">\n'
            f'<title>{titolo}</title>\n<defs>{"".join(defs)}</defs>\n' + "\n".join(corpo) + "\n</svg>\n")


def filtro_ombra(W: float, H: float, dev: float = 1.6, id_: str = "sfuma-ombra") -> str:
    return sfocatura(id_, dev, W, H)


def ombra(nome: str, cx: float, cy: float, rx: float, ry: float, colore: str, opacita: float = 0.18,
          filtro: str = "sfuma-ombra") -> str:
    return (f'<ellipse id="{nome}" cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="{colore}" '
            f'opacity="{n(opacita)}" filter="url(#{filtro})"/>')


# ---------------------------------------------------------------- foglio

def foglio(nome: str, x0: float, y0: float, x1: float, y1: float, piega: float, colori: dict,
           righe: list[tuple[float, float, float]], alt_riga: float = 4.2, raggio: float = 5) -> tuple[str, str]:
    """Foglio con l'angolo in alto a destra piegato e le righe di testo come barre arrotondate.

    colori: chiaro, carta (tinta del foglio), bordo, piega (lembo), righe, ombra
    righe: (y centro, x inizio, x fine)
    La sagoma è una sola: il lato tagliato dalla piega ha i due angoli raccordati, il lembo piegato
    è un triangolo con l'angolo retto morbido e fa un'ombra leggera sul foglio.
    """
    c = colori
    sag = [V(x0, y0), V(x1 - piega, y0), V(x1, y0 + piega), V(x1, y1), V(x0, y1)]
    defs = [lineare(f"{nome}-luce", V(x0, y0), V(x1, y1), [(0, c["chiaro"]), (1, c["carta"])]),
            lineare(f"{nome}-piega-luce", V(x1 - piega * 0.5, y0 + piega * 0.5), V(x1 - piega, y0 + piega),
                    [(0, c["piega"]), (1, c["carta"])])]
    g = [f'<path id="{nome}-carta" d="{arrotondato(sag, [raggio, 1.6, 1.6, raggio, raggio])}" fill="url(#{nome}-luce)" '
         f'stroke="{c["bordo"]}" stroke-width="1"/>']
    # ombra del lembo sul foglio (appena sotto e a sinistra del lato diagonale)
    lembo = [V(x1 - piega, y0), V(x1 - piega, y0 + piega), V(x1, y0 + piega)]
    om = [q + V(-0.6, 0.9) for q in lembo]
    g.append(f'<path id="{nome}-piega-ombra" d="{arrotondato(om, [1, 2.4, 1])}" fill="{c["ombra"]}" opacity="0.12" '
             f'filter="url(#sfuma-piega)"/>')
    g.append(f'<path id="{nome}-piega" d="{arrotondato(lembo, [0.8, 2.4, 0.8])}" fill="url(#{nome}-piega-luce)"/>')
    barre = "".join(f'<rect id="{nome}-riga-{i + 1}" x="{n(xa)}" y="{n(y - alt_riga / 2)}" width="{n(xb - xa)}" '
                    f'height="{n(alt_riga)}" rx="{n(alt_riga / 2)}"/>' for i, (y, xa, xb) in enumerate(righe))
    g.append(f'<g id="{nome}-righe" fill="{c["righe"]}">{barre}</g>')
    defs.append(f'<filter id="sfuma-piega" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0.7"/></filter>')
    return "".join(defs), f'<g id="{nome}">{"".join(g)}</g>'


# ---------------------------------------------------------------- badge tondo

def badge(nome: str, c: V, r: float, colori: dict, simbolo: str, anello: float = 2.2, testo: str = "1") -> tuple[str, str]:
    """Badge tondo: cerchio pieno con bordo bianco, sfumatura dal chiaro in alto a sinistra, un
    riflesso ad arco e il simbolo bianco centrato nel suo gruppo (`<nome>-simbolo`).

    colori: chiaro, base, scuro (e ombra)
    simbolo: 'spunta' | 'croce' | 'orologio' | 'testo'
    """
    k = colori
    defs = [lineare(f"{nome}-luce", c + V(-r, -r) * 0.75, c + V(r, r) * 0.75,
                    [(0, k["chiaro"]), (0.5, k["base"]), (1, k["scuro"])])]
    g = [f'<circle id="{nome}-bordo" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r + anello)}" fill="#FFFFFF"/>',
         f'<circle id="{nome}-disco" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}" fill="url(#{nome}-luce)"/>']
    # riflesso: arco in alto a sinistra, parallelo al bordo
    ra = r * 0.74
    a0, a1 = math.radians(200), math.radians(250)
    pa, pb = c + V(math.cos(a0), math.sin(a0)) * ra, c + V(math.cos(a1), math.sin(a1)) * ra
    g.append(f'<path id="{nome}-riflesso" d="M{n(pa.x)} {n(pa.y)} A{n(ra)} {n(ra)} 0 0 1 {n(pb.x)} {n(pb.y)}" fill="none" '
             f'stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="{n(r * 0.11)}" stroke-linecap="round"/>')
    s = []
    tratto = f'fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"'
    if simbolo == "spunta":
        pts = [c + V(-0.40, 0.02) * r, c + V(-0.12, 0.30) * r, c + V(0.42, -0.26) * r]
        s.append(f'<path id="{nome}-spunta" d="{linea(*pts)}" {tratto} stroke-width="{n(r * 0.21)}"/>')
    elif simbolo == "croce":
        d = 0.29 * r
        s.append(f'<path id="{nome}-croce" d="{linea(c + V(-d, -d), c + V(d, d))} {linea(c + V(d, -d), c + V(-d, d))}" '
                 f'{tratto} stroke-width="{n(r * 0.21)}"/>')
    elif simbolo == "orologio":
        tacche = []
        for i in range(12):
            a = math.radians(i * 30)
            du = V(math.sin(a), -math.cos(a))
            lung = 0.1 if i % 3 == 0 else 0.0
            if lung:
                tacche.append(linea(c + du * r * 0.78, c + du * r * (0.78 - lung)))
        s.append(f'<path id="{nome}-tacche" d="{" ".join(tacche)}" {tratto} stroke-opacity="0.6" stroke-width="{n(r * 0.08)}"/>')
        s.append(f'<g id="lancetta-minuti"><path d="{linea(c, c + V(0, -0.56) * r)}" {tratto} stroke-width="{n(r * 0.13)}"/></g>')
        s.append(f'<g id="lancetta-ore" transform="rotate(120 {n(c.x)} {n(c.y)})"><path d="{linea(c, c + V(0, -0.40) * r)}" '
                 f'{tratto} stroke-width="{n(r * 0.15)}"/></g>')
        s.append(f'<circle id="{nome}-perno" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r * 0.1)}" fill="#FFFFFF"/>')
    elif simbolo == "testo":
        dim = r * 1.25
        s.append(f'<path id="{nome}-numero" d="{tracciato(testo, 700, dim, c.x, c.y + dim * 0.36, centro=True)}" fill="#FFFFFF"/>')
    g.append(f'<g id="{nome}-simbolo">{"".join(s)}</g>')
    return "".join(defs), f'<g id="{nome}">{"".join(g)}</g>'


# ---------------------------------------------------------------- clessidra

def clessidra(nome: str, cx: float, y_alto: float, y_basso: float, largo: float, colori: dict,
              livello: float = 0.55, mucchio: float = 0.55) -> tuple[str, str]:
    """Clessidra simmetrica sull'asse cx: due tappi arrotondati, il vetro a due bulbi con il collo
    in mezzo, la sabbia sopra (piatta, fino a `livello` del bulbo), il filo che scende e il mucchio
    sotto (alto `mucchio` del bulbo). Sabbia in `<nome>-sabbia` (alto, filo, basso) per animarla.

    colori: tappo (chiaro, base, scuro), vetro, vetro_bordo, sabbia_alto, sabbia_basso, filo
    """
    k = colori
    h_t = (y_basso - y_alto) * 0.105            # altezza di un tappo
    ya, yb = y_alto + h_t, y_basso - h_t        # dove il vetro tocca i tappi
    ym = (ya + yb) / 2                          # collo
    hv = largo / 2 * 0.86                       # mezza larghezza del bulbo al tappo
    collo = largo * 0.095
    PANCIA, COLLO = 0.8, 0.3                    # quanto il bulbo resta largo prima di stringersi al collo

    def meta_vetro(s: float, inset: float = 0.0) -> str:
        """Profilo del vetro da una parte (s=-1 sinistra, +1 destra), dall'alto al basso."""
        w, cw = hv - inset, collo - inset * 0.3
        a, b = ya, yb
        hb = (ym - a)
        return (f"{n(cx + s * w)} {n(a)} C{n(cx + s * w)} {n(a + hb * PANCIA)} {n(cx + s * cw)} {n(ym - hb * COLLO)} {n(cx + s * cw)} {n(ym)} "
                f"C{n(cx + s * cw)} {n(ym + hb * COLLO)} {n(cx + s * w)} {n(b - hb * PANCIA)} {n(cx + s * w)} {n(b)}")

    def vetro(inset: float = 0.0) -> str:
        w = hv - inset
        a, b = ya, yb
        dx = meta_vetro(1, inset)
        # la metà sinistra percorsa dal basso in alto
        cw = collo - inset * 0.3
        hb = (ym - a)
        sx = (f"L{n(cx - w)} {n(b)} C{n(cx - w)} {n(b - hb * PANCIA)} {n(cx - cw)} {n(ym + hb * COLLO)} {n(cx - cw)} {n(ym)} "
              f"C{n(cx - cw)} {n(ym - hb * COLLO)} {n(cx - w)} {n(a + hb * PANCIA)} {n(cx - w)} {n(a)} Z")
        return f"M{dx} {sx}"

    defs = [lineare(f"{nome}-tappo-luce", V(0, 0), V(0, h_t), [(0, k["tappo"][0]), (0.5, k["tappo"][1]), (1, k["tappo"][2])]),
            lineare(f"{nome}-vetro-luce", V(cx - hv, 0), V(cx + hv, 0), [(0, "#FFFFFF"), (0.45, k["vetro"]), (1, k["vetro"])]),
            f'<clipPath id="{nome}-dentro"><path d="{vetro(1.6)}"/></clipPath>',
            lineare(f"{nome}-sabbia-alto-luce", V(cx - hv, 0), V(cx + hv, 0), [(0, k["sabbia_alto"][0]), (1, k["sabbia_alto"][1])]),
            lineare(f"{nome}-sabbia-basso-luce", V(cx - hv, 0), V(cx + hv, 0), [(0, k["sabbia_basso"][0]), (1, k["sabbia_basso"][1])])]
    g = [f'<path id="{nome}-vetro" d="{vetro()}" fill="url(#{nome}-vetro-luce)" stroke="{k["vetro_bordo"]}" stroke-width="1"/>']
    # sabbia
    y_liv = ya + 1 + (ym - ya) * (1 - livello)
    alto = f'<rect id="{nome}-sabbia-alto" x="{n(cx - hv)}" y="{n(y_liv)}" width="{n(2 * hv)}" height="{n(ym - y_liv + 0.5)}" fill="url(#{nome}-sabbia-alto-luce)"/>'
    filo = (f'<path id="{nome}-sabbia-filo" d="{linea(V(cx, ym), V(cx, yb - 1))}" stroke="{k["filo"]}" '
            f'stroke-width="{n(largo * 0.065)}" stroke-linecap="round"/>')
    hm = (yb - ym) * mucchio
    top = yb - hm
    fondo = yb + 1
    mucchio_d = (f"M{n(cx - hv - 2)} {n(fondo)} L{n(cx - hv - 2)} {n(yb - hm * 0.22)} "
                 f"C{n(cx - hv * 0.55)} {n(yb - hm * 0.3)} {n(cx - hv * 0.28)} {n(top)} {n(cx)} {n(top)} "
                 f"C{n(cx + hv * 0.28)} {n(top)} {n(cx + hv * 0.55)} {n(yb - hm * 0.3)} {n(cx + hv + 2)} {n(yb - hm * 0.22)} "
                 f"L{n(cx + hv + 2)} {n(fondo)} Z")
    basso = f'<path id="{nome}-sabbia-basso" d="{mucchio_d}" fill="url(#{nome}-sabbia-basso-luce)"/>'
    g.append(f'<g id="{nome}-sabbia" clip-path="url(#{nome}-dentro)">{alto}{filo}{basso}</g>')
    # riflesso sul vetro: lungo il bulbo di sinistra, in alto
    rx = cx - hv * 0.62
    g.append(f'<path id="{nome}-riflesso" d="M{n(rx)} {n(ya + 3)} C{n(rx)} {n(ya + (ym - ya) * 0.35)} {n(rx + hv * 0.12)} {n(ya + (ym - ya) * 0.55)} {n(rx + hv * 0.3)} {n(ya + (ym - ya) * 0.7)}" '
             f'fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="{n(largo * 0.05)}" stroke-linecap="round"/>')
    # tappi (sopra al vetro, coprono le estremità)
    for nome_t, y in (("alto", y_alto), ("basso", y_basso - h_t)):
        g.append(f'<g id="{nome}-tappo-{nome_t}" transform="translate(0 {n(y)})">'
                 f'<rect x="{n(cx - largo / 2)}" y="0" width="{n(largo)}" height="{n(h_t)}" rx="{n(h_t / 2)}" fill="url(#{nome}-tappo-luce)"/>'
                 f'<path d="{linea(V(cx - largo / 2 + h_t * 0.6, h_t * 0.3), V(cx + largo / 2 - h_t * 0.6, h_t * 0.3))}" stroke="#FFFFFF" '
                 f'stroke-opacity="0.35" stroke-width="{n(h_t * 0.22)}" stroke-linecap="round"/></g>')
    return "".join(defs), f'<g id="{nome}">{"".join(g)}</g>'


# ---------------------------------------------------------------- fumetto

def fumetto(nome: str, x0: float, y0: float, x1: float, y1: float, raggio: float, coda: tuple[float, float, V],
            colori: dict, riflesso: bool = True, bordo: str | None = None) -> tuple[str, str]:
    """Fumetto come una sola massa: rettangolo arrotondato e coda nella stessa sagoma, con i raccordi
    anche dove la coda si attacca (angoli concavi) e sulla punta.

    coda: (xa, xb, punta) con xa < xb sul lato di sotto e la punta sotto il fumetto
    colori: chiaro, base, scuro
    Restituisce il gruppo con sagoma e riflesso; il contenuto (righe, puntini) si aggiunge fuori.
    """
    xa, xb, P = coda
    k = colori
    pts = [V(x0, y0), V(x1, y0), V(x1, y1), V(xb, y1), P, V(xa, y1), V(x0, y1)]
    rr = [raggio, raggio, raggio, 2.2, 1.4, 2.2, raggio]
    defs = [lineare(f"{nome}-luce", V(x0, y0), V(x1, y1 + (P.y - y1)),
                    [(0, k["chiaro"]), (0.55, k["base"]), (1, k["scuro"])])]
    tratto = f' stroke="{bordo}" stroke-width="1"' if bordo else ""
    g = [f'<path id="{nome}-sagoma" d="{arrotondato(pts, rr)}" fill="url(#{nome}-luce)"{tratto}/>']
    if riflesso:
        g.append(f'<path id="{nome}-riflesso" d="{linea(V(x0 + raggio + 1, y0 + 3), V(x1 - raggio - 1, y0 + 3))}" '
                 f'stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" stroke-linecap="round"/>')
    return "".join(defs), f'<g id="{nome}">{"".join(g)}</g>'


# ---------------------------------------------------------------- scena: foglio + badge

def documento_con_badge(W: float, H: float, titolo: str, f: dict, b: dict) -> str:
    """Scena comune di completato / errore / in corso: foglio con le righe e il badge tondo che lo
    copre in basso a destra, con un'ombra morbida del badge sul foglio."""
    defs = [filtro_ombra(W, H, 1.4)]
    d, foglio_g = foglio("foglio", *f["riquadro"], f["piega"], f["colori"], f["righe"])
    defs.append(d)
    c, r = b["centro"], b["raggio"]
    d, badge_g = badge("badge", c, r, b["colori"], b["simbolo"])
    defs.append(d)
    corpo = [foglio_g,
             ombra("badge-ombra", c.x + 0.6, c.y + 1.8, r + 1.6, r + 1.2, b["colori"]["scuro"], 0.22),
             badge_g]
    return svg(W, H, titolo, defs, corpo)


# ---------------------------------------------------------------- nuvola morbida

def nuvola_morbida(cerchi: list[tuple[V, float]], raccordo: float = 4.0) -> str:
    """Sagoma di nuvola: cerchi da sinistra a destra (il primo e l'ultimo toccano il fondo con la
    loro parte più bassa, che diventa il fondo piatto), uniti da raccordi concavi veri (un cerchietto
    tangente ai due vicini) invece degli spigoli che fa l'unione di cerchi."""
    def raccordo_tra(c1, R1, c2, R2):
        a, b = R1 + raccordo, R2 + raccordo
        d = (c2 - c1).lung()
        x = (a * a - b * b + d * d) / (2 * d)
        h = math.sqrt(max(0.0, a * a - x * x))
        u = (c2 - c1).uni()
        base = c1 + u * x
        F1, F2 = base + u.perp() * h, base - u.perp() * h
        F = F1 if F1.y < F2.y else F2
        return F, c1 + (F - c1).uni() * R1, c2 + (F - c2).uni() * R2

    def ang(c, q):
        return math.atan2(q.y - c.y, q.x - c.x)

    def arco(c, R, q0, q1, sweep):
        a0, a1 = ang(c, q0), ang(c, q1)
        giro = (a1 - a0) % (2 * math.pi) if sweep else (a0 - a1) % (2 * math.pi)
        grande = 1 if giro > math.pi else 0
        return f" A{n(R)} {n(R)} 0 {grande} {sweep} {n(q1.x)} {n(q1.y)}"

    giunti = [raccordo_tra(cerchi[i][0], cerchi[i][1], cerchi[i + 1][0], cerchi[i + 1][1]) for i in range(len(cerchi) - 1)]
    c0, R0 = cerchi[0]
    inizio = c0 + V(0, R0)
    d = f"M{p_(inizio)}"
    corrente = inizio
    for i, (c, R) in enumerate(cerchi):
        fine = giunti[i][1] if i < len(giunti) else c + V(0, R)
        d += arco(c, R, corrente, fine, 1)
        if i < len(giunti):
            F, _, t2 = giunti[i]
            d += arco(F, raccordo, fine, t2, 0)
            corrente = t2
    return d + " Z"


def p_(q: V) -> str:
    return f"{n(q.x)} {n(q.y)}"
