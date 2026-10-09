"""Scrive brand/concept-svg/_rapporti/s5.json: una voce per ogni id (09, 10, 29, 42, 43 .001-.006) con l'SVG se esiste.
Rilanciabile in qualsiasi momento (salvataggio incrementale)."""
import glob, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from ui import RADICE

USCITA = RADICE / "brand/concept-svg/schermate/calcolo-risultato"
OUT = RADICE / "brand/concept-svg/_rapporti/s5.json"
NOTE = {
    "09": "Misuratore a mezza ellisse (come nell'originale); passi con spunte; avanzamento 10/10 sempre pieno.",
    "10": "Misuratore a mezza ellisse con alone; corpi: passi, aree, curva di confronto, fattori, avviso + istogramma, costi + pulsanti.",
    "29": "Striscia di stato sotto il misuratore (icona + testo breve); avviso + pulsante nell'ultima.",
    "42": "Due riquadri in uno SVG: schermata con decorazioni (carte, scie) sopra e dettaglio ingrandito del misuratore sotto; decorazioni come forme vettoriali con sfumature.",
    "43": "Misuratore con tacche; corpi: passi, aree, fattori + nota, fattori, avviso + istogramma, costi + pulsanti.",
}
EXTRA = {}   # id -> nota aggiuntiva (riempito da chi genera)
if (pathlib.Path(__file__).parent / "note_voci.json").exists():
    EXTRA = json.loads((pathlib.Path(__file__).parent / "note_voci.json").read_text())


def main():
    voci = []
    for nn in ("09", "10", "29", "42", "43"):
        for k in range(1, 7):
            idv = f"{nn}.{k:03d}"
            f = sorted(glob.glob(str(USCITA / f"{nn}-*-{k:03d}-*.svg")))
            nota = NOTE[nn] + " Testo piccolo ricostruito/ricontrollato a ingrandimento." + (" " + EXTRA[idv] if idv in EXTRA else "")
            if f:
                voci.append({"elementi": [idv], "stato": "svg", "svg": str(pathlib.Path(f[0]).relative_to(RADICE)), "nota": nota})
            else:
                voci.append({"elementi": [idv], "stato": "scartato", "nota": "IN LAVORAZIONE: SVG non ancora generato"})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(voci, ensure_ascii=False, indent=1))
    print(OUT, sum(v["stato"] == "svg" for v in voci), "svg su", len(voci))


if __name__ == "__main__":
    main()
