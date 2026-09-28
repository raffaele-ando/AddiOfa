"""
Modifica un disegno SVG pezzo per pezzo, usando gli id delle forme e dei gruppi: colore, posizione,
dimensione, rotazione, visibilità. Vale per le illustrazioni disegnate (brand/disegni) e per il logo.

    # il libro blu diventa verde (la luce e le ombre restano: cambia solo la famiglia di colore)
    python3 strumenti/brand/modifica_disegno.py brand/disegni/kit-blu/illustrazioni/studio-inglese.svg \\
        --colore libro-blu=#22C55E --uscita /tmp/libro-verde.svg
    # la bandiera più in alto di 6 px, più grande del 15% e ruotata di 8 gradi
    python3 strumenti/brand/modifica_disegno.py <svg> --sposta bandiera=0,-6 --scala bandiera=1.15 --ruota bandiera=8
    # nascondere un pezzo
    python3 strumenti/brand/modifica_disegno.py <svg> --nascondi nuvola

Più operazioni insieme si possono ripetere (--colore a=#… --colore b=#…). Il colore si applica a
tutti i colori dentro l'elemento, comprese le sfumature che usa (che vengono copiate, così le altre
forme che le condividono non cambiano). Scala e rotazione sono attorno al centro dell'elemento,
misurato in Chromium.
"""
from __future__ import annotations

import argparse
import itertools
import pathlib
import re

import numpy as np

from ricolora import rgb_oklch, oklch_rgb, esa_rgb
from render import Renderer

contatore = itertools.count(1)


def elemento(svg: str, id_: str) -> tuple[int, int]:
    """Inizio e fine (esclusa) dell'elemento con quell'id, compresi i figli."""
    m = re.search(rf'<([\w:-]+)\b[^>]*\bid="{re.escape(id_)}"[^>]*?(/?)>', svg)
    if not m:
        raise SystemExit(f"nessun elemento con id «{id_}»")
    if m.group(2) == "/":
        return m.start(), m.end()
    tag = m.group(1)
    livello, pos = 1, m.end()
    for t in re.finditer(rf"<(/?){tag}\b[^>]*?(/?)>", svg[m.end():]):
        if t.group(1):
            livello -= 1
        elif not t.group(2):
            livello += 1
        if livello == 0:
            return m.start(), m.end() + t.end()
    raise SystemExit(f"elemento «{id_}» non chiuso")


def ricolora_testo(testo: str, verso: str) -> str:
    """Porta ogni colore del testo nella famiglia di `verso`: tinta e croma del nuovo colore,
    la luminosità di ciascuno spostata della differenza media (le luci restano luci)."""
    colori = re.findall(r"#[0-9A-Fa-f]{6}\b", testo)
    if not colori:
        return testo
    lch = np.array([rgb_oklch(esa_rgb(c)) for c in colori])
    t = rgb_oklch(esa_rgb(verso))
    peso = lch[:, 1] > 0.02  # i grigi e i bianchi restano come sono
    if not peso.any():
        return testo
    media_l = lch[peso, 0].mean(); media_c = lch[peso, 1].mean()
    mappa = {}
    for c, v, p in zip(colori, lch, peso):
        if not p:
            continue
        nuovo = np.array([v[0] + (t[0] - media_l), v[1] * (t[1] / max(media_c, 1e-6)), t[2]])
        rgb = np.clip(oklch_rgb(nuovo), 0, 255)
        mappa[c.upper()] = "#%02X%02X%02X" % tuple(int(round(x)) for x in rgb)
    return re.sub(r"#[0-9A-Fa-f]{6}\b", lambda m: mappa.get(m.group(0).upper(), m.group(0)), testo)


def colora(svg: str, id_: str, verso: str) -> str:
    a, b = elemento(svg, id_)
    pezzo = svg[a:b]
    # sfumature e maschere usate dal pezzo: si copiano con un id nuovo e si ricolorano le copie
    usati = set(re.findall(r'url\(#([^)]+)\)', pezzo))
    nuove = []
    for u in sorted(usati):
        try:
            ua, ub = elemento(svg, u)
        except SystemExit:
            continue
        orig = svg[ua:ub]
        if not re.match(r"<(linearGradient|radialGradient)", orig):
            continue
        nid = f"{u}-m{next(contatore)}"
        nuove.append(ricolora_testo(orig.replace(f'id="{u}"', f'id="{nid}"', 1), verso))
        pezzo = pezzo.replace(f"url(#{u})", f"url(#{nid})")
    pezzo = ricolora_testo(pezzo, verso)
    svg = svg[:a] + pezzo + svg[b:]
    if nuove:
        svg = svg.replace("</defs>", "".join(nuove) + "</defs>", 1) if "</defs>" in svg else \
            re.sub(r"(<svg[^>]*>)", lambda m: m.group(1) + "<defs>" + "".join(nuove) + "</defs>", svg, count=1)
    return svg


def avvolgi(svg: str, id_: str, trasformazione: str) -> str:
    """Mette l'elemento in un gruppo con la trasformazione (così non si tocca il suo transform)."""
    a, b = elemento(svg, id_)
    return svg[:a] + f'<g data-modifica="{id_}" transform="{trasformazione}">' + svg[a:b] + "</g>" + svg[b:]


def centro(r: Renderer, svg: str, id_: str) -> tuple[float, float]:
    w, h = (float(v) for v in re.search(r'viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"', svg).groups())
    r._page.set_content(f"<body style='margin:0'>{svg}</body>")
    r._rapido = None
    box = r._page.evaluate(f"() => {{ const e = document.getElementById({id_!r}); const b = e.getBBox(); "
                           f"const m = e.getCTM(); const s = e.ownerSVGElement.getCTM() || m; "
                           f"const p = new DOMPoint(b.x + b.width / 2, b.y + b.height / 2).matrixTransform(m); "
                           f"return [p.x, p.y]; }}")
    # coordinate dello schermo = coordinate del viewBox (lo SVG è reso a 1:1)
    return box[0], box[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("svg")
    ap.add_argument("--colore", action="append", default=[], help="id=#RRGGBB")
    ap.add_argument("--sposta", action="append", default=[], help="id=dx,dy")
    ap.add_argument("--scala", action="append", default=[], help="id=fattore")
    ap.add_argument("--ruota", action="append", default=[], help="id=gradi")
    ap.add_argument("--nascondi", action="append", default=[], help="id")
    ap.add_argument("--uscita", help="file di uscita (default: <nome>--modificato.svg)")
    x = ap.parse_args()
    percorso = pathlib.Path(x.svg)
    svg = percorso.read_text()
    for voce in x.colore:
        id_, c = voce.split("=")
        svg = colora(svg, id_, c)
    with Renderer() as r:
        for voce in x.scala:
            id_, f = voce.split("="); cx, cy = centro(r, svg, id_)
            svg = avvolgi(svg, id_, f"translate({cx:.2f} {cy:.2f}) scale({float(f)}) translate({-cx:.2f} {-cy:.2f})")
        for voce in x.ruota:
            id_, g = voce.split("="); cx, cy = centro(r, svg, id_)
            svg = avvolgi(svg, id_, f"rotate({float(g)} {cx:.2f} {cy:.2f})")
    for voce in x.sposta:
        id_, d = voce.split("="); dx, dy = (float(v) for v in d.split(","))
        svg = avvolgi(svg, id_, f"translate({dx} {dy})")
    for id_ in x.nascondi:
        a, b = elemento(svg, id_)
        svg = svg[:a] + '<g display="none">' + svg[a:b] + "</g>" + svg[b:]
    uscita = pathlib.Path(x.uscita) if x.uscita else percorso.with_name(percorso.stem + "--modificato.svg")
    uscita.write_text(svg)
    print(uscita)


if __name__ == "__main__":
    main()
