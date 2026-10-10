"""
Estrae dalle tavole originali ogni elemento (illustrazioni, icone, UI, palette, logo) e ogni
schermata, come PNG a risoluzione originale.

- Elementi: in ogni banda di `sorgenti.json` separa gli elementi dagli spazi vuoti in orizzontale
  e li nomina in ordine; poi li stacca dal fondo (`stacca.py`) e controlla che, ricomposti sul
  fondo originale, ridiano esattamente il ritaglio.
- Palette: misura il colore vero al centro di ogni campione e lo confronta con l'esadecimale
  scritto sotto.
- Schermate: dentro il riquadro approssimativo trova il bordo esatto del telefono.
"""
from __future__ import annotations

import json
import pathlib

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

from stacca import stacca, stacca_morbido, ritaglia_stretto, verifica_ricomposizione

QUI = pathlib.Path(__file__).resolve().parent
RADICE_REPO = QUI.parents[1] / "fonti"      # le immagini originali stanno in grafica/fonti/
USCITA = QUI.parents[1] / "brand"     # grafica/brand


def fondo_tavola(rgb: np.ndarray) -> np.ndarray:
    return np.median(rgb.reshape(-1, 3), axis=0)


def gruppi_orizzontali(maschera: np.ndarray, spazio: int) -> list[tuple[int, int]]:
    """Intervalli di colonne con inchiostro, uniti se separati da meno di `spazio` px."""
    colonne = maschera.any(axis=0)
    gruppi: list[list[int]] = []
    for x in np.nonzero(colonne)[0]:
        if gruppi and x - gruppi[-1][1] <= spazio:
            gruppi[-1][1] = x
        else:
            gruppi.append([x, x])
    return [(a, b) for a, b in gruppi if b - a >= 3]


def estrai_kit(kit: dict, rapporto: dict) -> None:
    sorgente = Image.open(RADICE_REPO / kit["file"]).convert("RGB")
    rgb = np.asarray(sorgente).astype(np.float64)
    B = fondo_tavola(rgb)
    H, W = rgb.shape[:2]
    for banda in kit["bande"]:
        y0, y1 = banda["y"]
        x0, x1 = banda.get("x", [0, W])
        soglia = banda.get("soglia", 6)
        zona = rgb[y0:y1, x0:x1]
        maschera = np.linalg.norm(zona - B, axis=2) > soglia
        for ex0, ey0, ex1, ey1 in banda.get("escludi", []):
            maschera[max(0, ey0 - y0):max(0, ey1 - y0), max(0, ex0 - x0):max(0, ex1 - x0)] = False
        gruppi = gruppi_orizzontali(maschera, banda.get("spazio", 14))
        nomi = banda["nomi"]
        if len(gruppi) != len(nomi):
            raise SystemExit(f"{kit['id']} banda y={banda['y']}: trovati {len(gruppi)} elementi, attesi {len(nomi)}: "
                             f"{[(g[0] + x0, g[1] + x0) for g in gruppi]}")
        for i, ((gx0, gx1), nome) in enumerate(zip(gruppi, nomi)):
            righe = np.nonzero(maschera[:, gx0:gx1 + 1].any(axis=1))[0]
            margine = 6
            bx0 = max(0, x0 + gx0 - margine); bx1 = min(W, x0 + gx1 + 1 + margine)
            by0 = max(0, y0 + righe[0] - margine); by1 = min(H, y0 + righe[-1] + 1 + margine)
            ritaglio = sorgente.crop((bx0, by0, bx1, by1))
            if banda["gruppo"] == "palette":
                registra_palette(kit, banda, i, nome, ritaglio, B, (bx0, by0, bx1, by1), rapporto)
                continue
            rgba, info = stacca(ritaglio, fondo=B)
            controllo = verifica_ricomposizione(ritaglio, rgba, B)
            stretto, (sx0, sy0, sx1, sy1) = ritaglia_stretto(rgba)
            cartella = USCITA / "elementi" / kit["id"] / banda["gruppo"]
            cartella.mkdir(parents=True, exist_ok=True)
            percorso = cartella / f"{nome}.png"
            stretto.save(percorso, optimize=True)
            extra = {}
            if banda["gruppo"] == "illustrazioni":
                # variante per fondi scuri: aloni e nuvolette diventano semitrasparenti.
                # Solo per le illustrazioni: icone, pulsanti e card sono già pieni.
                morbido = stacca_morbido(ritaglio, fondo=B).crop((sx0, sy0, sx1, sy1))
                cartella_scuro = USCITA / "elementi" / kit["id"] / "fondo-scuro"
                cartella_scuro.mkdir(parents=True, exist_ok=True)
                morbido.save(cartella_scuro / f"{nome}.png", optimize=True)
                extra = {
                    "file_fondo_scuro": str((cartella_scuro / f"{nome}.png").relative_to(USCITA)),
                    "ricomposizione_fondo_scuro": verifica_ricomposizione(ritaglio.crop((sx0, sy0, sx1, sy1)), morbido, B),
                }
            rapporto["elementi"].append({
                "kit": kit["id"], "gruppo": banda["gruppo"], "nome": nome,
                "file": str(percorso.relative_to(USCITA)),
                "sorgente": kit["file"],
                "riquadro": [bx0 + sx0, by0 + sy0, bx0 + sx1, by0 + sy1],
                "dimensioni": list(stretto.size), "fondo": info["fondo"],
                "ricomposizione": controllo,
                **extra,
            })


def registra_palette(kit, banda, i, nome, ritaglio, B, riquadro, rapporto):
    # il campione è la parte alta (sotto c'è il testo): colore misurato al centro del rettangolo pieno
    a = np.asarray(ritaglio).astype(np.float64)
    d = np.linalg.norm(a - B, axis=2)
    pieno = d > 1.5
    righe = np.nonzero(pieno.sum(axis=1) > pieno.shape[1] * 0.6)[0]
    if len(righe) == 0:
        righe = np.arange(a.shape[0] // 3)
    cy = int(np.median(righe)); cx = a.shape[1] // 2
    campione = a[max(0, cy - 3):cy + 4, max(0, cx - 10):cx + 11].reshape(-1, 3)
    misurato = np.median(campione, axis=0)
    dichiarato = banda["esadecimali"][i]
    atteso = np.array([int(dichiarato[k:k + 2], 16) for k in (1, 3, 5)], dtype=np.float64)
    rapporto["palette"].append({
        "kit": kit["id"], "nome": nome, "dichiarato": dichiarato,
        "misurato": "#%02X%02X%02X" % tuple(int(round(c)) for c in misurato),
        "scarto_255": round(float(np.abs(misurato - atteso).max()), 1),
        "riquadro": list(riquadro),
    })


def trova_telefono(zona: np.ndarray, fondo: str) -> tuple[int, int, int, int]:
    """Il riquadro esatto del telefono dentro una zona approssimativa."""
    if fondo == "bianco":
        # tavola bianca: il telefono si riconosce dal bordo grigio chiaro
        pieno = np.linalg.norm(zona - np.array([254.0, 254.0, 254.0]), axis=2) > 3
    else:
        # tavola colorata: il telefono è la grande superficie bianca
        pieno = zona.min(axis=2) >= 251
    pieno = ndi.binary_closing(pieno, np.ones((5, 5)))
    pieno = ndi.binary_fill_holes(pieno)
    pieno = ndi.binary_opening(pieno, np.ones((9, 9)))
    lab, n = ndi.label(pieno)
    if n == 0:
        return 0, 0, zona.shape[1], zona.shape[0]
    aree = ndi.sum(pieno, lab, range(1, n + 1))
    sl = ndi.find_objects(lab)[int(np.argmax(aree))]
    return sl[1].start, sl[0].start, sl[1].stop, sl[0].stop


def estrai_schermate(tavola: dict, rapporto: dict) -> None:
    sorgente = Image.open(RADICE_REPO / tavola["file"]).convert("RGB")
    rgb = np.asarray(sorgente).astype(np.float64)
    nomi = iter(tavola["nomi"])
    n = 0
    for riga in tavola["righe"]:
        y0, y1 = riga["y"]
        for x0, x1 in riga["x"]:
            n += 1
            nome = next(nomi)
            tx0, ty0, tx1, ty1 = trova_telefono(rgb[y0:y1, x0:x1], tavola["fondo"])
            riquadro = (x0 + tx0, y0 + ty0, x0 + tx1, y0 + ty1)
            cartella = USCITA / "schermate" / tavola["id"]
            cartella.mkdir(parents=True, exist_ok=True)
            percorso = cartella / f"{n:02d}-{nome}.png"
            sorgente.crop(riquadro).save(percorso, optimize=True)
            rapporto["schermate"].append({
                "tavola": tavola["id"], "n": n, "nome": nome, "file": str(percorso.relative_to(USCITA)),
                "sorgente": tavola["file"], "riquadro": list(riquadro),
                "dimensioni": [riquadro[2] - riquadro[0], riquadro[3] - riquadro[1]],
            })


def main() -> dict:
    config = json.loads((QUI / "sorgenti.json").read_text())
    rapporto = {"elementi": [], "palette": [], "schermate": []}
    for kit in config["kit"]:
        estrai_kit(kit, rapporto)
    for tavola in config["schermate"]:
        estrai_schermate(tavola, rapporto)
    USCITA.mkdir(parents=True, exist_ok=True)
    (USCITA / "estrazione.json").write_text(json.dumps(rapporto, indent=1, ensure_ascii=False, default=int))
    return rapporto


if __name__ == "__main__":
    r = main()
    peggiore = max((e["ricomposizione"]["mae_255"] for e in r["elementi"]), default=0)
    print(f"{len(r['elementi'])} elementi, {len(r['palette'])} colori, {len(r['schermate'])} schermate; "
          f"ricomposizione peggiore: {peggiore}/255 di scarto medio")
