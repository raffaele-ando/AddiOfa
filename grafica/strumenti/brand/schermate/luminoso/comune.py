"""
Pezzi comuni del "kit blu luminoso" (immagine 16 di design-concept): sfondo pallido a macchia, alone caldo
arancione dietro/sotto gli oggetti, bagliore lungo gli spigoli, ombra morbida, scena con id parlanti.

Il kit luminoso è lo stesso soggetto del kit blu ma in 3D più scuro: blu cobalto `#2F6BEA`→`#1E3FA5`→notte
`#14246B`, riflessi chiari, e una luce calda arancione (`#FFB347`) che esce da dietro o da sotto e accende
i bordi. `STILI` contiene le due versioni dello stesso kit: "luminoso" (immagine 16) e "vivo" (immagine 17:
blu più acceso, piatto, senza bagliore, rosso per i lucchetti/X): i generatori leggono tutto da lì.
"""
from __future__ import annotations

import pathlib
import re
import sys

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[3]
ILL = QUI.parents[1] / "illustrazioni"
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI.parents[1])); sys.path.insert(0, str(ILL)); sys.path.insert(0, str(QUI.parents[0]))
from geometria import V, arrotondato, lineare, radiale, n, p, sfocatura  # noqa: E402,F401

USCITA = RADICE / "brand" / "concept-svg" / "illustrazioni-luminose"

STILI = {
    "luminoso": {
        "blu_chiaro": "#6C9DF8", "blu": "#2F6BEA", "blu_medio": "#2658D8", "blu_scuro": "#1E3FA5", "blu_notte": "#14246B",
        "fondo_alto": "#DCE9FD", "fondo_basso": "#F1F4FC", "fondo_caldo": "#FEF4E6",
        "alone": "#FFB347", "alone_forte": "#FF8A1F", "alone_op": 1.0,
        "ombra": "#14246B", "carta": "#F4F7FF", "carta_bordo": "#DCE6FB", "righe": "#C9D8FA",
    },
    "vivo": {
        "blu_chiaro": "#5E9BFB", "blu": "#2A74F4", "blu_medio": "#1F5EE0", "blu_scuro": "#1B4BC6", "blu_notte": "#0F2A78",
        "fondo_alto": "#EAF1FE", "fondo_basso": "#F4F7FE", "fondo_caldo": "#F4F7FE",
        "alone": "#FFB347", "alone_forte": "#FF8A1F", "alone_op": 0.0,
        "ombra": "#1D4ED8", "carta": "#F6F8FE", "carta_bordo": "#DCE6FB", "righe": "#D3E0FB",
    },
}


class Scena:
    """Una illustrazione: defs + corpo, con filtro d'ombra e documento SVG finale."""

    def __init__(self, titolo: str, W: float, H: float, stile: str = "luminoso"):
        self.titolo, self.W, self.H = titolo, W, H
        self.s = STILI[stile]
        self.stile = stile
        self.defs: list[str] = [sfocatura("sfuma-ombra", 2, W, H), sfocatura("sfuma-alone", 5, W, H), sfocatura("sfuma-lieve", 0.8, W, H)]
        self.corpo: list[str] = []
        self.per_scuro: dict[str, str] = {}   # id -> colore con cui diventa nel tema scuro (scritte, tracciati scuri)

    def d(self, *x: str): self.defs.extend(x)
    def c(self, *x: str): self.corpo.extend(x)

    @property
    def luminoso(self) -> bool:
        return self.s["alone_op"] > 0

    def svg(self) -> str:
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(self.W)} {n(self.H)}" width="{n(self.W)}" height="{n(self.H)}">\n'
                f'<title>{self.titolo}</title>\n<defs>{"".join(self.defs)}</defs>\n' + "\n".join(self.corpo) + "\n</svg>\n")

    # ------------------------------------------------------------ sfondo e luce
    def nuvola(self, forme, id_="nuvola", caldo: float = 0.0):
        """Sfondo pallido: unione di forme (ellissi (cx,cy,rx,ry) o path 'd'), gradiente dall'alto (azzurro) al
        basso (quasi bianco, caldo se caldo>0). Nel tema scuro il gruppo diventa un alone sottile (scuro_svg)."""
        s = self.s
        base = [(0, s["fondo_alto"]), (0.55, s["fondo_alto"]), (1, s["fondo_basso"])]
        self.d(lineare(f"{id_}-fondo", V(0, 0), V(0, self.H), base))
        el = []
        for f in forme:
            if isinstance(f, str):
                el.append(f'<path d="{f}"/>')
            else:
                el.append(f'<ellipse cx="{n(f[0])}" cy="{n(f[1])}" rx="{n(f[2])}" ry="{n(f[3])}"/>')
        self.c(f'<g id="{id_}" fill="url(#{id_}-fondo)">{"".join(el)}</g>')

    def alone(self, id_, cx, cy, rx, ry, op=0.6, colore=None, nucleo=None):
        """Bagliore caldo: ellisse con gradiente radiale che sfuma a zero (niente filtri). Solo nello stile luminoso."""
        if not self.luminoso:
            return
        colore = colore or self.s["alone"]
        nucleo = nucleo or colore
        if int(nucleo[5:7], 16) >= 0xA0 and not id_.endswith("-pallido"):   # alone chiaro: sul fondo scuro diventa nebbia, si attenua
            id_ += "-pallido"
        op *= self.s["alone_op"]
        self.d(f'<radialGradient id="{id_}-g" gradientUnits="userSpaceOnUse" cx="{n(cx)}" cy="{n(cy)}" r="{n(rx)}" '
               f'gradientTransform="translate({n(cx)} {n(cy)}) scale(1 {n(ry / rx)}) translate({n(-cx)} {n(-cy)})">'
               f'<stop offset="0" stop-color="{nucleo}" stop-opacity="{n(op)}"/><stop offset="0.45" stop-color="{colore}" stop-opacity="{n(op * 0.55)}"/>'
               f'<stop offset="1" stop-color="{colore}" stop-opacity="0"/></radialGradient>')
        self.c(f'<ellipse id="{id_}" cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="url(#{id_}-g)"/>')

    def ombra(self, id_, cx, cy, rx, ry, op=0.18, colore=None):
        self.c(f'<ellipse id="{id_}" cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="{colore or self.s["ombra"]}" '
               f'opacity="{n(op)}" filter="url(#sfuma-ombra)"/>')


def salva(nome: str, scena: Scena, scuro: bool = True) -> pathlib.Path:
    """Scrive <nome>.svg (e <nome>.scuro.svg) in brand/concept-svg/illustrazioni-luminose[/vivo]."""
    from scuro_svg import scuro as _scuro
    cart = USCITA if scena.stile == "luminoso" else USCITA / "vivo"
    cart.mkdir(parents=True, exist_ok=True)
    f = cart / f"{nome}.svg"
    s = scena.svg()
    f.write_text(s)
    if scuro:
        t = _scuro(s)
        t = re.sub(r'(<ellipse id="[^"]*-pallido")', r'\1 opacity="0.25"', t)
        for id_, col in scena.per_scuro.items():
            t, k = re.subn(rf'(<[a-z]+\s[^>]*?\bid="{re.escape(id_)}"[^>]*?\b(?:fill|stroke)=")#[0-9A-Fa-f]{{6}}"', rf'\g<1>{col}"', t)
            assert k, f"per_scuro: id non trovato o senza colore: {id_}"
        (cart / f"{nome}.scuro.svg").write_text(t)
    return f
