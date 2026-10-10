"""
Adatta un disegno SVG fatto a mano all'illustrazione originale: il disegno resta com'è (stesse
forme, stessi nomi, stessa struttura, leggibile e modificabile), cambiano solo i numeri —
posizioni, misure, raggi, colori, opacità, sfocature — finché il render in Chromium non
coincide il più possibile con l'originale.

    python3 strumenti/brand/adatta_svg.py brand/disegni/kit-blu/illustrazioni/studio-inglese.svg
    python3 strumenti/brand/adatta_svg.py <svg> --prove 3000
    python3 strumenti/brand/adatta_svg.py <svg> --solo-tavola        # solo il confronto, niente modifiche

Il riferimento si trova da solo dal percorso (brand/disegni/<kit>/<gruppo>/<nome>.svg ->
brand/elementi/<kit>/<gruppo>/<nome>.png); si può dare con --riferimento.

Regole per chi disegna:
  - l'SVG ha viewBox="0 0 W H" con le misure dell'originale (1 unità = 1 pixel dell'originale);
  - ogni forma ha un id che dice cos'è (id="libro-blu-copertina"), i gruppi raccolgono gli oggetti;
  - colori in esadecimale a 6 cifre (#3B82F6), niente nomi di colore né rgb();
  - un attributo o un elemento con data-fisso="1" non viene toccato (per esempio un testo, o una
    forma già perfetta); con data-fisso="colori" restano fermi solo i colori;
  - lo scarto (0-255, su fondo chiaro e scuro) va in <nome>.misure.json accanto al disegno, le
    tavole di confronto (originale | disegno, 4x, fondo chiaro e scuro) in brand/tavole/disegni/.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import random
import re
import time

import numpy as np
from PIL import Image

from render import Renderer, confronta, su_fondo

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"

CHIARO, SCURO = (246, 248, 252), (15, 23, 42)
NUMERO = re.compile(r"-?(?:\d+\.\d*|\.\d+|\d+)(?:[eE]-?\d+)?")
COLORE = re.compile(r"#[0-9a-fA-F]{6}\b")
# attributi i cui numeri non si toccano
FERMI = {"id", "viewBox", "xmlns", "class", "font-family", "font-weight", "data-fisso", "href", "version",
         "gradientUnits", "clip-path", "mask", "filter", "fill-rule", "clip-rule", "stroke-linecap",
         "stroke-linejoin", "text-anchor", "dominant-baseline", "style", "numOctaves", "seed", "type",
         "in", "in2", "result", "operator", "mode", "preserveAspectRatio", "font-size"}
PASSI = {"fattore": 0.01, "coordinata": 0.6, "colore": 8.0, "opacita": 0.05, "offset": 0.04, "sfocatura": 0.3, "angolo": 2.0}


class Parametro:
    def __init__(self, inizio, fine, tipo, valore):
        self.inizio, self.fine, self.tipo, self.valore = inizio, fine, tipo, valore


def tipo_di(attr: str) -> str:
    if attr in ("opacity", "fill-opacity", "stroke-opacity", "stop-opacity", "flood-opacity"):
        return "opacita"
    if attr == "offset":
        return "offset"
    if attr == "stdDeviation":
        return "sfocatura"
    return "coordinata"


def analizza(svg: str) -> list:
    """Trova i numeri e i colori modificabili, con la loro posizione nel testo."""
    parametri = []
    for tag in re.finditer(r"<(?!/|!|\?)([\w:-]+)([^>]*)>", svg):
        nome_tag, attrs = tag.group(1), tag.group(2)
        base = tag.start(2)
        fisso_elemento = re.search(r'data-fisso="1"', attrs) is not None
        solo_forme = re.search(r'data-fisso="colori"', attrs) is not None
        if fisso_elemento or nome_tag in ("svg", "title", "desc"):
            continue
        for a in re.finditer(r'([\w:-]+)="([^"]*)"', attrs):
            attr, val = a.group(1), a.group(2)
            if attr in FERMI:
                continue
            v0 = base + a.start(2)
            colori = list(COLORE.finditer(val))
            if colori:
                if solo_forme:
                    continue
                for c in colori:
                    h = c.group(0)
                    rgb = [int(h[i:i + 2], 16) for i in (1, 3, 5)]
                    parametri.append(Parametro(v0 + c.start(), v0 + c.end(), "colore", rgb))
                continue
            if attr == "transform":
                # rotate(a cx cy): l'angolo ha passo in gradi
                for m in re.finditer(r"(rotate|translate|scale|matrix)\(([^)]*)\)", val):
                    for k, n in enumerate(NUMERO.finditer(m.group(2))):
                        if m.group(1) == "matrix":
                            tipo = "fattore" if k < 4 else "coordinata"
                        else:
                            tipo = "angolo" if m.group(1) == "rotate" and k == 0 else ("fattore" if m.group(1) == "scale" else "coordinata")
                        s = v0 + m.start(2) + n.start()
                        parametri.append(Parametro(s, s + len(n.group(0)), tipo, float(n.group(0))))
                continue
            for n in NUMERO.finditer(val):
                # nei path i numeri dopo A/a (archi) includono flag 0/1: si lasciano stare gli interi 0 e 1 isolati dei flag
                parametri.append(Parametro(v0 + n.start(), v0 + n.end(), tipo_di(attr), float(n.group(0))))
    parametri = _togli_flag_archi(svg, parametri)
    return parametri


def _togli_flag_archi(svg: str, parametri: list) -> list:
    """Negli archi dei path (A rx ry rot grande verso x y) i due flag non sono numeri da muovere."""
    vietati = set()
    for d in re.finditer(r'\sd="([^"]*)"', svg):
        testo, base = d.group(1), d.start(1)
        for arco in re.finditer(r"[Aa]([^A-Za-z]*)", testo):
            nums = list(NUMERO.finditer(arco.group(1)))
            for k, n in enumerate(nums):
                if k % 7 in (3, 4):
                    vietati.add(base + arco.start(1) + n.start())
    return [p for p in parametri if not (p.tipo == "coordinata" and p.inizio in vietati)]


def scrivi(svg: str, parametri: list) -> str:
    out, ultimo = [], 0
    for p in sorted(parametri, key=lambda p: p.inizio):
        out.append(svg[ultimo:p.inizio])
        if p.tipo == "colore":
            out.append("#%02X%02X%02X" % tuple(int(round(min(255, max(0, c)))) for c in p.valore))
        elif p.tipo in ("opacita", "offset"):
            out.append(f"{min(1.0, max(0.0, p.valore)):.3f}".rstrip("0").rstrip(".") or "0")
        else:
            v = p.valore
            if p.tipo == "sfocatura":
                v = max(0.0, v)
            out.append((f"{v:.4f}" if p.tipo == "fattore" else f"{v:.2f}").rstrip("0").rstrip(".") or "0")
        ultimo = p.fine
    out.append(svg[ultimo:])
    return "".join(out)


def riferimento_di(percorso: pathlib.Path) -> pathlib.Path:
    rel = percorso.resolve().relative_to((BRAND / "disegni").resolve())
    return BRAND / "elementi" / rel.with_suffix(".png")


class Giudice:
    def __init__(self, r: Renderer, originale: Image.Image):
        self.r = r
        self.W, self.H = originale.size
        self.chiaro = su_fondo(originale, CHIARO)
        self.scuro = su_fondo(originale, SCURO)

    def rendi(self, svg):
        return self.r.rapido(svg, self.W, self.H)

    def errore(self, svg) -> float:
        im = self.rendi(svg)
        return 0.5 * (np.abs(su_fondo(im, CHIARO) - self.chiaro).mean() + np.abs(su_fondo(im, SCURO) - self.scuro).mean())


def tavola(r: Renderer, originale: Image.Image, svg: str, uscita: pathlib.Path, k=4):
    W, H = originale.size
    s4 = re.sub(r'(<svg[^>]*?)\swidth="[^"]*"\s+height="[^"]*"', rf'\1 width="{W * k}" height="{H * k}"', svg, count=1)
    grande = r.svg(s4, W * k, H * k)
    orig = originale.resize((W * k, H * k), Image.LANCZOS)
    t = Image.new("RGB", (W * k * 2 + 12, H * k * 2 + 12), (255, 255, 255))
    for j, fondo in enumerate((CHIARO, SCURO)):
        t.paste(Image.fromarray(su_fondo(orig, fondo).astype(np.uint8)), (0, j * (H * k + 12)))
        t.paste(Image.fromarray(su_fondo(grande, fondo).astype(np.uint8)), (W * k + 12, j * (H * k + 12)))
    uscita.parent.mkdir(parents=True, exist_ok=True)
    t.save(uscita)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("svg")
    ap.add_argument("--riferimento")
    ap.add_argument("--prove", type=int, default=2500)
    ap.add_argument("--solo-tavola", action="store_true")
    ap.add_argument("--seme", type=int, default=1)
    x = ap.parse_args()
    percorso = pathlib.Path(x.svg)
    rif = pathlib.Path(x.riferimento) if x.riferimento else riferimento_di(percorso)
    originale = Image.open(rif).convert("RGBA")
    svg = percorso.read_text()
    with Renderer() as r:
        g = Giudice(r, originale)
        e = g.errore(svg)
        print(f"{percorso.name}: partenza {e:.3f}/255", flush=True)
        if not x.solo_tavola:
            parametri = analizza(svg)
            print(f"  {len(parametri)} numeri da adattare", flush=True)
            passi = [PASSI[p.tipo] for p in parametri]
            rng = random.Random(x.seme)
            inizio = time.time()
            for it in range(x.prove):
                i = rng.randrange(len(parametri))
                p = parametri[i]
                vecchio = p.valore
                if p.tipo == "colore":
                    c = rng.randrange(3)
                    nuovo = list(vecchio); nuovo[c] = min(255, max(0, nuovo[c] + rng.gauss(0, passi[i])))
                    # a volte si muove tutto il colore insieme (più chiaro / più scuro)
                    if rng.random() < 0.3:
                        d = rng.gauss(0, passi[i]); nuovo = [min(255, max(0, v + d)) for v in vecchio]
                    p.valore = nuovo
                else:
                    p.valore = vecchio + rng.gauss(0, passi[i])
                    if p.tipo in ("opacita", "offset"):
                        p.valore = min(1.0, max(0.0, p.valore))
                    if p.tipo == "sfocatura":
                        p.valore = max(0.0, p.valore)
                prova = scrivi(svg, parametri)
                ep = g.errore(prova)
                if ep < e:
                    e = ep; passi[i] *= 1.25
                else:
                    p.valore = vecchio; passi[i] = max(passi[i] * 0.9, 0.02)
                if it % 250 == 249:
                    print(f"  prova {it + 1:5d}  {e:.3f}/255  ({time.time() - inizio:.0f}s)", flush=True)
                    percorso.write_text(scrivi(svg, parametri))
            svg = scrivi(svg, parametri)
            percorso.write_text(svg)
        im = r.svg(svg, g.W, g.H)
        misure = {"fondo_chiaro": confronta(su_fondo(originale, CHIARO), su_fondo(im, CHIARO)),
                  "fondo_scuro": confronta(su_fondo(originale, SCURO), su_fondo(im, SCURO))}
        rel = percorso.resolve().relative_to((BRAND / "disegni").resolve())
        tavola(r, originale, svg, BRAND / "tavole" / "disegni" / (str(rel.with_suffix("")).replace("/", "--") + ".png"))
    # misure accanto al disegno (un file per disegno: più disegni si possono adattare insieme)
    f_m = percorso.with_suffix(".misure.json")
    voce = json.loads(f_m.read_text()) if f_m.exists() else {}
    voce["forme"] = {"svg": f"disegni/{rel}", "byte": len(svg), **misure}
    f_m.write_text(json.dumps(voce, indent=1))
    print(f"  fine: chiaro {misure['fondo_chiaro']['mae_255']}  scuro {misure['fondo_scuro']['mae_255']}  "
          f"ssim {misure['fondo_chiaro']['ssim']}", flush=True)


if __name__ == "__main__":
    main()
