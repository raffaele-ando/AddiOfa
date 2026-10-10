"""python3 coppie.py k chiave... -> scratchpad/coppie.png: per ogni schermata originale|disegno affiancati"""
import sys
from PIL import Image
import registro
from comuni import SCHERMATE, ritaglio, SCRATCH
from controlla import rendi
sys.path.insert(0, str(__import__('comuni').QUI.parent.parent))
from render import Renderer
k = float(sys.argv[1]); out = []
with Renderer() as r:
    for ch in sys.argv[2:]:
        o = ritaglio(ch); O = o.resize((int(o.width * k), int(o.height * k)), Image.LANCZOS)
        d = rendi(r, ch, k); B = O.copy(); B.paste(d.convert("RGB"), (0, 0), d.split()[3])
        P = Image.new("RGB", (O.width * 2 + 4, O.height), (120, 120, 120)); P.paste(O, (0, 0)); P.paste(B, (O.width + 4, 0)); out.append(P)
S = Image.new("RGB", (sum(i.width for i in out) + 14 * len(out), max(i.height for i in out)), (190, 190, 190)); x = 0
for i in out: S.paste(i, (x, 0)); x += i.width + 14
S.save(SCRATCH / "coppie.png"); print(S.size)
