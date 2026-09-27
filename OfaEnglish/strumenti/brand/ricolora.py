"""
Cambia una famiglia di colore di un'illustrazione tenendo luci, ombre e sfumature.

Lavora in OKLCH (luminosità, saturazione, tinta percettive): i colori con tinta vicina a quella
di partenza vengono ruotati verso la tinta di arrivo, con la stessa luminosità e la saturazione
riportata a quella del colore di arrivo. Vale sia per l'SVG (colori dei tracciati) sia per il PNG
(pixel per pixel), così le due versioni restano allineate.

    python3 strumenti/brand/ricolora.py kit-blu/illustrazioni/studio-inglese --da "#3B82F6" --a "#22C55E"
    python3 strumenti/brand/ricolora.py kit-rosso/illustrazioni/successo-superamento --da "#F59E0B" --a "#8B5CF6" --tolleranza 30
    # solo una parte: rettangolo in pixel del PNG (x0,y0,x1,y1); --escludi fa il contrario
    python3 strumenti/brand/ricolora.py kit-blu/illustrazioni/studio-inglese --da "#3B82F6" --a "#22C55E" --escludi "92,2 180,2 178,66 94,72"

Esce accanto all'originale come <nome>--<colore>.svg / .png (l'originale non si tocca).
"""
from __future__ import annotations

import argparse
import pathlib
import re

import numpy as np
from PIL import Image

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"


def _srgb_lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def _lin_srgb(c):
    c = np.clip(c, 0, 1)
    return np.clip(np.where(c <= 0.0031308, 12.92 * c, 1.055 * c ** (1 / 2.4) - 0.055) * 255, 0, 255)


def rgb_oklch(rgb: np.ndarray) -> np.ndarray:
    r, g, b = [_srgb_lin(rgb[..., i]) for i in range(3)]
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = np.cbrt(l), np.cbrt(m), np.cbrt(s)
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    Bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    return np.stack([L, np.hypot(A, Bb), np.degrees(np.arctan2(Bb, A)) % 360], axis=-1)


def oklch_rgb(lch: np.ndarray) -> np.ndarray:
    L, C, H = lch[..., 0], lch[..., 1], np.radians(lch[..., 2])
    A, Bb = C * np.cos(H), C * np.sin(H)
    l_ = L + 0.3963377774 * A + 0.2158037573 * Bb
    m_ = L - 0.1055613458 * A - 0.0638541728 * Bb
    s_ = L - 0.0894841775 * A - 1.2914855480 * Bb
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413283665 * s
    b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return np.stack([_lin_srgb(r), _lin_srgb(g), _lin_srgb(b)], axis=-1)


def esa_rgb(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float64)


def trasforma(rgb: np.ndarray, da: str, a: str, tolleranza: float, croma_min: float = 0.03) -> tuple[np.ndarray, np.ndarray]:
    lch = rgb_oklch(rgb.astype(np.float64))
    s = rgb_oklch(esa_rgb(da))
    t = rgb_oklch(esa_rgb(a))
    dh = (lch[..., 2] - s[2] + 180) % 360 - 180
    peso = np.clip(1 - np.abs(dh) / tolleranza, 0, 1) * (lch[..., 1] > croma_min)
    nuovo = lch.copy()
    nuovo[..., 2] = (t[2] + dh) % 360
    nuovo[..., 1] = lch[..., 1] * (t[1] / max(s[1], 1e-6))
    nuovo[..., 0] = lch[..., 0] + (t[0] - s[0]) * 0.5  # metà dello scarto di luminosità: tiene il chiaroscuro
    out = oklch_rgb(nuovo)
    return rgb * (1 - peso[..., None]) + out * peso[..., None], peso


def poligono(testo: str | None):
    """"x,y x,y x,y …" (poligono) oppure "x0,y0,x1,y1" (rettangolo), in pixel del PNG."""
    if not testo:
        return None
    if " " not in testo.strip():
        x0, y0, x1, y1 = [float(v) for v in testo.split(",")]
        return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
    return [tuple(float(v) for v in p.split(",")) for p in testo.split()]


def maschera(forma, w, h):
    from PIL import ImageDraw
    img = Image.new("L", (w, h), 0)
    ImageDraw.Draw(img).polygon(forma, fill=255)
    return np.asarray(img) > 127


def ricolora_svg(testo: str, da: str, a: str, tolleranza: float, zona=None, escludi=None, scala=1.0) -> str:
    """Tutti i tracciati ricolorati; con zona/esclusione la copia ricolorata viene ritagliata sul
    poligono, così l'SVG cambia esattamente la stessa area del PNG."""
    def sostituisci(m):
        c = esa_rgb(m.group(1))[None, None, :]
        nuovo, _ = trasforma(c, da, a, tolleranza)
        return 'fill="#%02X%02X%02X"' % tuple(int(round(v)) for v in nuovo[0, 0])
    ricolorato = re.sub(r'fill="#([0-9A-Fa-f]{6})"', sostituisci, testo)
    if not zona and not escludi:
        return ricolorato
    apri = re.search(r"<svg[^>]*>", testo).group(0)
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', apri).group(1).split()]
    corpo_orig = testo[len(apri):testo.rindex("</svg>")]
    corpo_nuovo = ricolorato[len(re.search(r"<svg[^>]*>", ricolorato).group(0)):ricolorato.rindex("</svg>")]
    pt = lambda forma: " ".join(f"{x * scala:.1f},{y * scala:.1f}" for x, y in forma)
    defs = '<defs><mask id="zonaRicolora" maskUnits="userSpaceOnUse" x="0" y="0" width="%s" height="%s">' % (vb[2], vb[3])
    defs += f'<rect width="{vb[2]}" height="{vb[3]}" fill="{"black" if zona else "white"}"/>'
    if zona:
        defs += f'<polygon points="{pt(zona)}" fill="white"/>'
    if escludi:
        defs += f'<polygon points="{pt(escludi)}" fill="black"/>'
    defs += "</mask></defs>"
    return f'{apri}{defs}<g>{corpo_orig}</g><g mask="url(#zonaRicolora)">{corpo_nuovo}</g></svg>'


def main():
    p = argparse.ArgumentParser()
    p.add_argument("elemento", help="kit/gruppo/nome, per esempio kit-blu/illustrazioni/studio-inglese")
    p.add_argument("--da", required=True, help="colore della famiglia da cambiare")
    p.add_argument("--a", required=True, help="colore di arrivo")
    p.add_argument("--tolleranza", type=float, default=35.0, help="ampiezza della famiglia in gradi di tinta")
    p.add_argument("--zona", help='poligono "x,y x,y …" o rettangolo "x0,y0,x1,y1" in pixel del PNG: cambia solo qui')
    p.add_argument("--escludi", help="come --zona, ma è l'area da lasciare com'è")
    x = p.parse_args()
    zona, escludi = poligono(x.zona), poligono(x.escludi)
    kit, gruppo, nome = x.elemento.split("/")
    suffisso = x.a.lstrip("#").lower()
    svg = BRAND / "vettori" / kit / gruppo / f"{nome}.svg"
    png = BRAND / "elementi" / kit / gruppo / f"{nome}.png"
    if svg.exists():
        testo = svg.read_text()
        vb = re.search(r'viewBox="0 0 ([\d.]+)', testo)
        larghezza_png = Image.open(png).width if png.exists() else None
        scala = float(vb.group(1)) / larghezza_png if vb and larghezza_png else 1.0
        dest = svg.with_name(f"{nome}--{suffisso}.svg")
        dest.write_text(ricolora_svg(testo, x.da, x.a, x.tolleranza, zona, escludi, scala))
        print(dest)
    if png.exists():
        a = np.asarray(Image.open(png).convert("RGBA")).astype(np.float64)
        rgb, peso = trasforma(a[..., :3], x.da, x.a, x.tolleranza)
        tieni = maschera(zona, a.shape[1], a.shape[0]) if zona else np.ones(a.shape[:2], bool)
        if escludi:
            tieni &= ~maschera(escludi, a.shape[1], a.shape[0])
        rgb = np.where(tieni[..., None], rgb, a[..., :3]); peso = peso * tieni
        out = np.concatenate([rgb, a[..., 3:4]], axis=-1)
        dest = png.with_name(f"{nome}--{suffisso}.png")
        Image.fromarray(np.round(out).astype(np.uint8), "RGBA").save(dest, optimize=True)
        print(dest, f"(pixel cambiati: {100 * (peso > 0.05).mean():.0f}%)")


if __name__ == "__main__":
    main()
