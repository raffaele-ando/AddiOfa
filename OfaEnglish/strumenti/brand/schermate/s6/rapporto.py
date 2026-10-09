"""Scrive brand/concept-svg/_rapporti/s6.json in base alle schermate effettivamente generate (esistono come file).
Mappa elemento del catalogo -> schermate; incrementale: rilanciare dopo ogni gruppo."""
import json
from componenti import OUT, RADICE
C30 = "30-flusso-schermate-a"; C31 = "31-flusso-schermate-b"
def f(c, nn, nome): return f"brand/concept-svg/schermate/{c}/{nn:02d}-{nome}.svg"
# (elemento, schermata n, nome, cartella, stato, nota)
V = []
def add(el, c, nn, nome, nota, stato="svg"):
    V.append((el, c, nn, nome, stato, nota))
exec(open(__file__.replace("rapporto.py", "elenco_rapporto.py")).read())
out = []
for el, c, nn, nome, stato, nota in V:
    p = f(c, nn, nome) if nome else None
    if p and not (RADICE / p).exists():
        out.append({"elementi": el if isinstance(el, list) else [el], "stato": "scartato", "svg": None, "nota": "NON ANCORA FATTO: " + nota}); continue
    out.append({"elementi": el if isinstance(el, list) else [el], "stato": stato, "svg": p, "nota": nota})
dest = RADICE / "brand/concept-svg/_rapporti/s6.json"
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(json.dumps(out, indent=1, ensure_ascii=False))
print(dest, len(out), "voci;", sum(1 for o in out if o["nota"].startswith("NON ANCORA")), "da fare")
