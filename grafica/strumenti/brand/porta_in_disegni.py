"""
Porta in `brand/disegni/` (la cartella da cui l'app sincronizza le illustrazioni, vedi tools/sincronizza-essenziali.sh)
le grafiche già ridisegnate in `brand/concept-svg/` che prima restavano fuori dall'app:

- `kit-blu/illustrazioni/`  cappello di laurea con cronometro, composizione di tre illustrazioni;
- `kit-blu/sfere/`          le 13 icone «sfera» 3D (concept 28 e 35), col prefisso `sfera-`;
- `kit-luminoso/illustrazioni/` il kit blu «vivo» (concept 17): stessi soggetti del kit blu, blu più acceso, per i formati grandi.

Non si portano: `email-istituzionale-sigillo` e `email-polimi` (contengono il sigillo del Politecnico), i due
`piano-studi-bloccato-lucchetto-*` (doppioni del kit blu col lucchetto di altro colore), le forme decorative dei layout.
Le varianti scure si fanno dopo con `scuro_svg.py`.

    python3 strumenti/brand/porta_in_disegni.py
"""
from __future__ import annotations

import pathlib
import re
import shutil
import sys

BRAND = pathlib.Path(__file__).resolve().parents[2] / "brand"
CS = BRAND / "concept-svg"
DIS = BRAND / "disegni"

# (origine relativa a concept-svg, destinazione relativa a disegni)
COPIE: list[tuple[str, str]] = [
    ("illustrazioni/kit-blu/cappello-laurea-orologio.svg", "kit-blu/illustrazioni/cappello-laurea-orologio.svg"),
    ("illustrazioni/kit-blu/composizione-misuratore-globo-calendario.svg", "kit-blu/illustrazioni/composizione-tre.svg"),
]
SFERE = ["addiofa", "app", "community", "consigli", "costi", "faq", "ofa", "opportunita", "polimi", "quiz", "risultati", "studio", "successi", "tips"]
for s in SFERE:
    COPIE.append((f"icone/sfera/{s}.svg", f"kit-blu/sfere/sfera-{s}.svg"))
for f in sorted((CS / "illustrazioni-luminose" / "vivo").glob("*.svg")):
    if f.name.endswith(".scuro.svg") or f.stem == "email-polimi":
        continue
    COPIE.append((f"illustrazioni-luminose/vivo/{f.name}", f"kit-luminoso/illustrazioni/{f.name}"))


def senza_nuvole(testo: str) -> str:
    """La composizione di tre illustrazioni porta con sé le tre nuvolette (id `…-nuvola`): nell'app non si usano."""
    return re.sub(r'(<[a-z]+\s[^>]*\bid="[^"]*-nuvola"[^>]*?)(/?>)', lambda m: re.sub(r'\sopacity="[^"]*"', "", m.group(1)) + ' opacity="0"' + m.group(2), testo)


def adatta_tela(r, testo: str, margine: float = 1.5) -> str:
    """Se il disegno esce dalla tela (raggi, code, ombre tagliate sul bordo) allarga il viewBox quanto serve.
    Misura con Chromium su una tela più grande: il bordo vero è dove finiscono i pixel non trasparenti."""
    import numpy as np
    vb = re.search(r'viewBox="([-\d.\s]+)"', testo)
    if not vb:
        return testo
    x, y, w, h = [float(v) for v in vb.group(1).split()]
    pad, k = 40.0, 4.0
    grande = re.sub(r'viewBox="[^"]*"', f'viewBox="{x - pad} {y - pad} {w + 2 * pad} {h + 2 * pad}"', testo, count=1)
    grande = re.sub(r'(<svg\b[^>]*?)\swidth="[^"]*"', r'\1', grande, count=1)
    grande = re.sub(r'(<svg\b[^>]*?)\sheight="[^"]*"', r'\1', grande, count=1)
    W, H = int((w + 2 * pad) * k), int((h + 2 * pad) * k)
    a = np.asarray(r.svg(grande, W, H, "transparent"))[..., 3] > 6
    ys, xs = np.where(a)
    if not len(xs):
        return testo
    x0, x1 = x - pad + xs.min() / k - margine, x - pad + (xs.max() + 1) / k + margine
    y0, y1 = y - pad + ys.min() / k - margine, y - pad + (ys.max() + 1) / k + margine
    nx0, ny0, nx1, ny1 = min(x, x0), min(y, y0), max(x + w, x1), max(y + h, y1)
    if (nx0, ny0, nx1, ny1) == (x, y, x + w, y + h):
        return testo
    nw, nh = nx1 - nx0, ny1 - ny0
    nuovo = re.sub(r'viewBox="[^"]*"', f'viewBox="{nx0:.2f} {ny0:.2f} {nw:.2f} {nh:.2f}"', testo, count=1)
    nuovo = re.sub(r'(<svg\b[^>]*?\s)width="[^"]*"', rf'\g<1>width="{nw:.0f}"', nuovo, count=1)
    nuovo = re.sub(r'(<svg\b[^>]*?\s)height="[^"]*"', rf'\g<1>height="{nh:.0f}"', nuovo, count=1)
    return nuovo


def main():
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
    from render import Renderer
    with Renderer() as r:
        _main(r)


def _main(r):
    for o, d in COPIE:
        dest = DIS / d
        dest.parent.mkdir(parents=True, exist_ok=True)
        if d.endswith("composizione-tre.svg"):
            dest.write_text(senza_nuvole((CS / o).read_text()))
        else:
            shutil.copyfile(CS / o, dest)
        if d.startswith("kit-luminoso/"):   # alcuni raggi e ombre escono dalla tela dei concept: si allarga il viewBox
            dest.write_text(adatta_tela(r, dest.read_text()))
    print(len(COPIE), "file portati in brand/disegni")


if __name__ == "__main__":
    main()
