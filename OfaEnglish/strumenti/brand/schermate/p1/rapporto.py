"""Scrive brand/concept-svg/_rapporti/p1.json dai file che esistono davvero. Rilanciabile in qualsiasi momento."""
import json
from extra import RADICE, LAYOUT

V = []
def voce(elementi, stato, svg, nota):
    p = RADICE / svg
    if svg and not p.exists():
        return
    V.append({"elementi": elementi, "stato": stato, "svg": svg, "nota": nota})

NOTA_LOC = ("Locandina 1024x1536 px tutta vettoriale (wordmark del kit con marchio stella, titoli Inter tracciati, tessere con icone, telefono col quiz, "
            "QR VERO decodificabile verso linktr.ee/addiofa al posto di quello finto dell'AI, strisce staccabili, svolazzi, frecce e scritte a mano rifatte in "
            "Inter corsivo maiuscolo). RASTER dichiarato: solo la fotografia dell'edificio del Politecnico (JPEG incorporato, ritagliato con strappo vettoriale; "
            "testi/stella/telefono sovrapposti dall'AI tolti con inpaint e rifatti in vettoriale). Testo del telefono ricostruito (stesso quiz in tutte le varianti, "
            "'Choose the correct form: She ___ to Milan every day.'). Sigillo del Politecnico: non presente. ")
voce(["04.001"], "raster", "brand/concept-svg/layout/04-locandina-supera-ofa/01-locandina-a.svg",
     NOTA_LOC + "Corretto: la 'O' del wordmark dell'originale era un'icona storta (Ø), qui il marchio stella 4 punte.")
voce(["38.001"], "raster", "brand/concept-svg/layout/38-locandina-b/01-locandina-b.svg",
     NOTA_LOC + "La stella blu sull'edificio è rifatta vettoriale (era nella foto).")
voce(["46.001"], "raster", "brand/concept-svg/layout/46-locandina-c/01-locandina-c.svg",
     NOTA_LOC + "Omessa la mano grigia che regge il telefono (anatomia AI, fotografia): il telefono è libero.")

import importlib
for m in ("rapporto_altri",):
    try: importlib.import_module(m)
    except ModuleNotFoundError: pass

out = RADICE / "brand/concept-svg/_rapporti/p1.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(V, indent=1, ensure_ascii=False))
print(out, len(V), "voci")
