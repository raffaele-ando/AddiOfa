"""
Foglio di contatti degli elementi estratti da una o più immagini di design-concept: ogni elemento con il suo id
(es. 28.085 = immagine 28, elemento 085, file brand/concept/<NN>-<nome>/085-*.png).

    python3 strumenti/brand/schermate/foglio_contatti.py 28 [15 …] [--tipo schermata|grafica|pannello|foto] [--cella 130] [--colonne 12] [--uscita /percorso.png]

Senza --uscita scrive in $TMPDIR/contatti-<immagini>.png. Serve per CAPIRE cosa c'è, prima di ridisegnare.
"""
from __future__ import annotations

import json, os, pathlib, sys
from PIL import Image, ImageDraw

RADICE = pathlib.Path(__file__).resolve().parents[3]


def main():
    a = sys.argv[1:]
    def opz(nome, d):
        if nome in a:
            i = a.index(nome); v = a[i + 1]; del a[i:i + 2]; return v
        return d
    tipo = opz("--tipo", None); cella = int(opz("--cella", 130)); cols = int(opz("--colonne", 12)); out = opz("--uscita", None)
    imgs = [int(x) for x in a]
    cat = json.load(open(RADICE / "brand/concept/catalogo.json"))
    sel = [i for i in cat if i["img"] in imgs and (tipo is None or i["tipo"] == tipo)]
    alto = cella * 2 if tipo == "schermata" else cella
    rows = (len(sel) + cols - 1) // cols
    S = Image.new("RGB", (cols * cella, rows * (alto + 14)), (235, 235, 235)); d = ImageDraw.Draw(S)
    for k, it in enumerate(sel):
        im = Image.open(RADICE / it["path"]).convert("RGBA")
        im.thumbnail((cella - 6, alto - 6)); bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
        x, y = (k % cols) * cella, (k // cols) * (alto + 14)
        S.paste(bg.convert("RGB"), (x + 3, y + 14)); d.text((x + 3, y + 1), it["id"], fill=(200, 0, 0))
    out = out or os.path.join(os.environ.get("TMPDIR", "/tmp"), "contatti-" + "-".join(map(str, imgs)) + ".png")
    S.save(out); print(out, len(sel), "elementi")


if __name__ == "__main__":
    main()
