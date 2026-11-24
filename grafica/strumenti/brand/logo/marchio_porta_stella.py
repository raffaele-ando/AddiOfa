#!/usr/bin/env python3
"""Marchio «porta a stella» di AddiOFA: geometria esatta (24/11/2026).

Ricostruito dalle misure del riferimento (grafica/fonti/ai-nuove/logo-porta-stella-ref.webp; analisi in
docs/design/logo/ANALISI-MARCHIO-PORTA-STELLA.md) con numeri uguali e simmetria per costruzione.
Unità: pixel di un riquadro da 448 (il disegno da 512 ha 32 di margine).

Regole:
- riquadro 448, raggio 0,25 (112), blu #0977FD;
- apertura a stella: tre punte con lo stesso angolo (60°), incavi uguali, asse x = 224;
- cornice blu notte #011537 di spessore unico W = 32 ovunque, stipiti compresi (bordo esterno parallelo all'apertura);
- punte esterne arrotondate con raggio W/2 = 16; spigoli interni vivi;
- stipiti dritti, base con la stessa inclinazione a destra e a sinistra (pendenza 7/16);
- luce: 4 fermate di colore, nitida dentro la porta, che si dissolve in una luce sfumata sotto gli stipiti.
Uso (dalla radice): python3 grafica/strumenti/brand/logo/marchio_porta_stella.py
"""
import math
import pathlib

RADICE = pathlib.Path(__file__).resolve().parents[4]
OUT = RADICE / 'grafica' / 'brand' / 'logo'

T = 448                    # lato del riquadro
CX = T / 2                 # asse di simmetria
RAGGIO = 0.25 * T          # angoli del riquadro (tavola di costruzione: R = 0,25x)
W = 34                     # spessore unico della cornice
R_PUNTA = W / 2            # raggio delle punte esterne
ANGOLO = 60                # angolo di ogni punta (gradi)
PENDENZA = 7 / 16          # inclinazione della base degli stipiti

# apertura (bordo interno), misure medie del riferimento rese simmetriche
INCAVO = (38, 207)         # scostamento dall'asse e quota degli incavi in alto
PUNTA_LAT = (112, 230)     # scostamento e quota delle punte laterali
STIPITE = 58               # scostamento dall'asse del lato interno degli stipiti
BASE = 380                 # quota della base interna degli stipiti

BLU = '#0977FD'
NOTTE = '#011537'


def geometria():
    mezzo = math.radians(ANGOLO / 2)
    y_top = INCAVO[1] - INCAVO[0] / math.tan(mezzo)                       # punta alta a 60°
    ln, lt = (CX - INCAVO[0], INCAVO[1]), (CX - PUNTA_LAT[0], PUNTA_LAT[1])
    # angolo interno di base dello stipite: la punta laterale deve avere anche lei 60°
    a = math.atan2(ln[1] - lt[1], ln[0] - lt[0])                           # lato verso l'incavo
    b = a + math.radians(ANGOLO)                                           # lato verso lo stipite
    y_c = lt[1] + (CX - STIPITE - lt[0]) * math.tan(b)
    sx = [(CX - STIPITE, y_c), lt, ln, (CX, y_top)]
    dx = [(2 * CX - x, y) for x, y in reversed(sx[:-1])]
    apertura = sx + dx                                                     # da stipite sinistro a stipite destro
    return apertura, y_top, y_c


def offset_esterno(apertura):
    """Bordo esterno: ogni lato dell'apertura spostato di W verso l'esterno, vertici = intersezioni."""
    pts = [(CX - STIPITE, BASE)] + apertura + [(CX + STIPITE, BASE)]
    linee = []
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy)
        nx, ny = dy / L, -dx / L                                           # normale verso l'esterno (percorso in senso orario)
        linee.append(((x1 + nx * W, y1 + ny * W), (dx / L, dy / L)))

    def interseca(l1, l2):
        (p, d), (q, e) = l1, l2
        den = d[0] * e[1] - d[1] * e[0]
        t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / den
        return (p[0] + d[0] * t, p[1] + d[1] * t)

    return [interseca(l1, l2) for l1, l2 in zip(linee, linee[1:])], linee


def percorso_porta(apertura):
    esterni, linee = offset_esterno(apertura)
    xo_s, xo_d = CX - STIPITE - W, CX + STIPITE + W
    calo = W * PENDENZA
    # anello: base interna sinistra, su per l'apertura, giù a destra, base, su per il bordo esterno, chiusura
    giro = [(CX - STIPITE, BASE)] + apertura + [(CX + STIPITE, BASE), (xo_d, BASE + calo)]
    giro += list(reversed(esterni)) + [(xo_s, BASE + calo)]
    convessi = {len(apertura) + 3 + i for i, p in enumerate(reversed(esterni))
                if p in (esterni[1], esterni[3], esterni[5])}                # le tre punte (esterni[i] corrisponde al vertice i+1 dell'apertura)
    out, n = [], len(giro)
    for i, p in enumerate(giro):
        if i in convessi:
            a, c = giro[i - 1], giro[(i + 1) % n]
            u = ((p[0] - a[0]), (p[1] - a[1])); v = ((c[0] - p[0]), (c[1] - p[1]))
            lu, lv = math.hypot(*u), math.hypot(*v)
            u, v = (u[0] / lu, u[1] / lu), (v[0] / lv, v[1] / lv)
            teta = math.pi - math.acos(max(-1, min(1, -(u[0] * v[0] + u[1] * v[1]))))  # angolo di svolta
            d = R_PUNTA / math.tan((math.pi - teta) / 2)
            p1 = (p[0] - u[0] * d, p[1] - u[1] * d)
            p2 = (p[0] + v[0] * d, p[1] + v[1] * d)
            giro_orario = u[0] * v[1] - u[1] * v[0] > 0
            out.append(('L', p1)); out.append(('A', p2, 1 if giro_orario else 0))
        else:
            out.append(('L', p))
    s = ''
    for k, el in enumerate(out):
        cmd = 'M' if k == 0 else el[0]
        if el[0] == 'A':
            s += f' A{R_PUNTA:g} {R_PUNTA:g} 0 0 {el[2]} {el[1][0]:.2f} {el[1][1]:.2f}'
        else:
            s += f' {cmd}{el[1][0]:.2f} {el[1][1]:.2f}'
    return s.strip() + ' Z', esterni


def svg(tutto_campo=False):
    apertura, y_top, y_c = geometria()
    porta, esterni = percorso_porta(apertura)
    luce = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in
                           [(CX - STIPITE, T)] + apertura + [(CX + STIPITE, T)]) + ' Z'
    m = 0 if tutto_campo else 32
    s = (512 - 2 * m) / T
    rx = 0 if tutto_campo else RAGGIO
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<title>AddiOFA</title>
<defs>
<linearGradient id="luce" gradientUnits="userSpaceOnUse" x1="0" y1="{y_top:.2f}" x2="0" y2="{T}">
<stop offset="0" stop-color="#FFFFFF"/><stop offset="0.62" stop-color="#FFFFFF"/><stop offset="0.82" stop-color="#CCE0FB"/><stop offset="0.93" stop-color="#70ADFD"/><stop offset="1" stop-color="{BLU}"/>
</linearGradient>
<filter id="sfuma" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="15"/></filter>
<linearGradient id="dissolvi" gradientUnits="userSpaceOnUse" x1="0" y1="345" x2="0" y2="390"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#000000"/></linearGradient>
<mask id="dentro" maskUnits="userSpaceOnUse" x="0" y="0" width="{T}" height="{T}"><rect width="{T}" height="{T}" fill="url(#dissolvi)"/></mask>
<clipPath id="riquadro"><rect width="{T}" height="{T}" rx="{rx:g}"/></clipPath>
</defs>
<g transform="translate({m} {m}) scale({s:g})" clip-path="url(#riquadro)">
<rect width="{T}" height="{T}" fill="{BLU}"/>
<path d="{luce}" fill="url(#luce)" filter="url(#sfuma)"/>
<path d="{luce}" fill="url(#luce)" mask="url(#dentro)"/>
<path d="{porta}" fill="{NOTTE}"/>
</g>
</svg>
'''


if __name__ == '__main__':
    apertura, y_top, y_c = geometria()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'marchio-porta-stella.svg').write_text(svg(), encoding='utf-8')
    (OUT / 'marchio-porta-stella-pieno-campo.svg').write_text(svg(tutto_campo=True), encoding='utf-8')
    print(f'punta alta interna y={y_top:.2f}, base delle braccia y={y_c:.2f}')
    print('scritti:', OUT / 'marchio-porta-stella.svg', OUT / 'marchio-porta-stella-pieno-campo.svg')
