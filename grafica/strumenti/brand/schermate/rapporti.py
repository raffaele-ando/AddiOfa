"""
Unisce i rapporti degli agenti (brand/concept-svg/_rapporti/*.json) e li confronta col catalogo degli elementi
(brand/concept/catalogo.json): per ogni id dice com'è finito (svg / riuso / raster / scartato) e quali non sono
stati contati da nessuno. Scrive brand/concept-svg/indice.json.

    python3 strumenti/brand/schermate/rapporti.py            # riepilogo
    python3 strumenti/brand/schermate/rapporti.py --manca    # elenco degli id non coperti, per immagine
"""
from __future__ import annotations

import collections, json, pathlib, sys

RADICE = pathlib.Path(__file__).resolve().parents[3]
CS = RADICE / "brand/concept-svg"


def main():
    cat = json.load(open(RADICE / "brand/concept/catalogo.json"))
    voce = {}
    for f in sorted((CS / "_rapporti").glob("*.json")):
        try:
            dati = json.load(open(f))
        except Exception as e:
            print("rapporto illeggibile", f.name, e); continue
        if isinstance(dati, dict):
            dati = dati.get("voci", [])
        def appiattisci(x):
            for e in x:
                if isinstance(e, list): yield from appiattisci(e)
                elif isinstance(e, dict): yield e
        for v in appiattisci(dati):
            for i in v.get("elementi", []):
                ex = voce.get(i)
                # uno svg/raster vale più di uno scartato
                peso = {"svg": 3, "raster": 3, "riuso": 2, "scartato": 1}
                if ex is None or peso.get(v.get("stato"), 0) > peso.get(ex["stato"], 0):
                    voce[i] = {"stato": v.get("stato"), "svg": v.get("svg"), "nota": v.get("nota", ""), "agente": f.stem}
    stati = collections.Counter(voce[i["id"]]["stato"] if i["id"] in voce else "non-contato" for i in cat)
    print(len(cat), "elementi:", dict(stati))
    per = collections.defaultdict(lambda: collections.Counter())
    for i in cat:
        per[i["img"]]["ok" if i["id"] in voce else "manca"] += 1
    if "--manca" in sys.argv:
        for img in sorted(per):
            m = [i["id"] for i in cat if i["img"] == img and i["id"] not in voce]
            if m: print(f"{img:02d}: {len(m)} -> {' '.join(m[:40])}{' …' if len(m) > 40 else ''}")
    json.dump({i["id"]: voce.get(i["id"], {"stato": "non-contato"}) for i in cat}, open(CS / "indice.json", "w"), indent=0, ensure_ascii=False)


if __name__ == "__main__":
    main()
