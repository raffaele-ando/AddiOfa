"""
Geometria per disegnare illustrazioni pulite in SVG: poligoni con angoli arrotondati veri (raccordo
circolare tangente ai due lati, non una curva qualsiasi), punti e vettori, sfumature.

Perché serve: un parallelogramma con gli angoli vivi o arrotondati "a occhio" con una Q piccola si
vede subito spigoloso. Un raccordo vero (cerchio tangente, raggio scelto per angolo) dà forme morbide
e coerenti a qualsiasi dimensione.

    from geometria import V, arrotondato, lineare
    d = arrotondato([V(0, 0), V(80, 0), V(80, 40), V(0, 40)], [8, 8, 4, 4])
"""
from __future__ import annotations

import math


class V:
    """Vettore 2D minimo (niente numpy: i file generati restano semplici)."""
    __slots__ = ("x", "y")

    def __init__(self, x: float, y: float):
        self.x, self.y = float(x), float(y)

    def __add__(self, o): return V(self.x + o.x, self.y + o.y)
    def __sub__(self, o): return V(self.x - o.x, self.y - o.y)
    def __mul__(self, k: float): return V(self.x * k, self.y * k)
    __rmul__ = __mul__
    def __truediv__(self, k: float): return V(self.x / k, self.y / k)
    def __neg__(self): return V(-self.x, -self.y)
    def lung(self) -> float: return math.hypot(self.x, self.y)
    def uni(self) -> "V": return self / (self.lung() or 1)
    def perp(self) -> "V": return V(-self.y, self.x)
    def __repr__(self): return f"V({self.x:.2f}, {self.y:.2f})"


def n(v: float) -> str:
    return f"{v:.2f}".rstrip("0").rstrip(".") if abs(v) >= 1e-9 else "0"


def p(v: V) -> str:
    return f"{n(v.x)} {n(v.y)}"


def arrotondato(punti: list[V], raggi, chiuso: bool = True) -> str:
    """Path SVG del poligono con ogni angolo raccordato da un arco di cerchio (cubica equivalente).
    `raggi`: un numero o uno per vertice; il raggio si riduce da solo se il lato è troppo corto."""
    k = len(punti)
    rs = raggi if isinstance(raggi, (list, tuple)) else [raggi] * k
    pezzi = []
    for i in range(k):
        P, A, B = punti[i], punti[i - 1], punti[(i + 1) % k]
        a, b = (A - P).uni(), (B - P).uni()
        cosang = max(-1.0, min(1.0, a.x * b.x + a.y * b.y))
        ang = math.acos(cosang)                      # angolo interno al vertice
        r = rs[i]
        if r <= 0 or ang < 1e-3 or abs(math.pi - ang) < 1e-3:
            pezzi.append((P, P, P, P)); continue
        t = r / math.tan(ang / 2)                    # distanza dei punti di tangenza dal vertice
        t = min(t, (A - P).lung() * 0.5, (B - P).lung() * 0.5)
        r = t * math.tan(ang / 2)
        e, u = P + a * t, P + b * t                  # entrata e uscita dell'arco
        giro = math.pi - ang                         # quanto gira la direzione
        h = 4 / 3 * math.tan(giro / 4) * r           # maniglie della cubica che approssima l'arco
        pezzi.append((e, e + (-a) * h, u + (-b) * h, u))
    d = f"M{p(pezzi[0][3])}"
    for i in range(1, k + 1):
        e, c1, c2, u = pezzi[i % k]
        d += f" L{p(e)}"
        if (u - e).lung() > 1e-6:
            d += f" C{p(c1)} {p(c2)} {p(u)}"
    return d + (" Z" if chiuso else "")


def linea(*punti: V) -> str:
    return "M" + " L".join(p(q) for q in punti)


def lineare(id_: str, da: V, a: V, fermate: list[tuple[float, str]] | list[tuple[float, str, float]]) -> str:
    """linearGradient in coordinate vere (userSpaceOnUse)."""
    s = "".join(f'<stop offset="{n(f[0])}" stop-color="{f[1]}"' + (f' stop-opacity="{n(f[2])}"' if len(f) > 2 else "") + "/>"
                for f in fermate)
    return (f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" x1="{n(da.x)}" y1="{n(da.y)}" '
            f'x2="{n(a.x)}" y2="{n(a.y)}">{s}</linearGradient>')


def radiale(id_: str, c: V, r: float, fermate) -> str:
    s = "".join(f'<stop offset="{n(f[0])}" stop-color="{f[1]}"' + (f' stop-opacity="{n(f[2])}"' if len(f) > 2 else "") + "/>"
                for f in fermate)
    return f'<radialGradient id="{id_}" gradientUnits="userSpaceOnUse" cx="{n(c.x)}" cy="{n(c.y)}" r="{n(r)}">{s}</radialGradient>'


def sfocatura(id_: str, dev: float, w: float, h: float) -> str:
    """Filtro di sfocatura con la regione grande quanto la tela (quella di default taglia le forme sottili)."""
    return (f'<filter id="{id_}" filterUnits="userSpaceOnUse" x="0" y="0" width="{n(w)}" height="{n(h)}">'
            f'<feGaussianBlur stdDeviation="{n(dev)}"/></filter>')
