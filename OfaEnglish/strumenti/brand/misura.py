"""
Misura gli elementi che diventano codice (pulsanti, interruttori, caselle, badge, card di stato,
chip delle icone): dimensioni del corpo, raggio degli angoli, riempimento, bordo, inchiostro e
ombra. I numeri finiscono in `brand/misure.json` e da lì nei componenti React.
"""
from __future__ import annotations

import json
import pathlib

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"


def esa(c) -> str:
    return "#%02X%02X%02X" % tuple(int(round(v)) for v in c)


def misura(percorso: pathlib.Path) -> dict:
    a = np.asarray(Image.open(percorso).convert("RGBA")).astype(np.float64)
    alfa = a[..., 3] / 255.0
    rgb = a[..., :3]
    # corpo = parte quasi opaca; il resto è ombra/alone
    corpo = alfa > 0.9
    lab, n = ndi.label(corpo)
    if n == 0:
        return {}
    grande = lab == (1 + int(np.argmax(ndi.sum(corpo, lab, range(1, n + 1)))))
    corpo = ndi.binary_fill_holes(grande)
    ys, xs = np.nonzero(corpo)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    w, h = x1 - x0, y1 - y0
    # raggio: quanto manca del corpo lungo la prima riga (dall'angolo in alto a sinistra)
    riga = corpo[y0 + 0, x0:x1]
    vuoti_riga = int(np.argmax(riga)) if riga.any() else 0
    col = corpo[y0:y1, x0]
    vuoti_col = int(np.argmax(col)) if col.any() else 0
    # stima dal punto diagonale: per un cerchio di raggio r il vuoto sulla diagonale è r(1-1/√2)
    diag = 0
    while diag < min(w, h) // 2 and not corpo[y0 + diag, x0 + diag]:
        diag += 1
    raggio = round(diag / (1 - 1 / np.sqrt(2)), 1) if diag else float(max(vuoti_riga, vuoti_col))
    raggio = min(raggio, min(w, h) / 2)

    interno = ndi.binary_erosion(corpo, iterations=max(2, min(w, h) // 8))
    bordo_anello = corpo & ~ndi.binary_erosion(corpo, iterations=2)
    pixel_int = rgb[interno] if interno.any() else rgb[corpo]
    # riempimento: il colore più comune dell'interno (mediana dei pixel vicini alla moda)
    q = np.round(pixel_int / 6) * 6
    valori, conteggi = np.unique(q, axis=0, return_counts=True)
    moda = valori[np.argmax(conteggi)]
    vicini = pixel_int[np.linalg.norm(pixel_int - moda, axis=1) < 14]
    riempimento = np.median(vicini, axis=0)
    anello = np.median(rgb[bordo_anello], axis=0)
    # inchiostro: i pixel dell'interno più lontani dal riempimento
    dist = np.linalg.norm(pixel_int - riempimento, axis=1)
    inchiostro = np.median(pixel_int[dist >= np.percentile(dist, 97)], axis=0) if len(dist) else riempimento
    ombra = alfa[(alfa > 0.02) & ~corpo]
    return {
        "dimensioni": [int(a.shape[1]), int(a.shape[0])],
        "corpo": {"x": int(x0), "y": int(y0), "w": int(w), "h": int(h)},
        "raggio": float(raggio),
        "riempimento": esa(riempimento),
        "bordo": esa(anello) if np.linalg.norm(anello - riempimento) > 18 else None,
        "inchiostro": esa(inchiostro),
        "ombra": {"pixel": int(len(ombra)), "alfa_media": round(float(ombra.mean()), 3) if len(ombra) else 0.0},
    }


def main():
    estrazione = json.loads((BRAND / "estrazione.json").read_text())
    misure = {}
    for el in estrazione["elementi"]:
        if el["gruppo"] in ("ui", "stati", "icone"):
            misure[f"{el['kit']}/{el['gruppo']}/{el['nome']}"] = misura(BRAND / el["file"])
    (BRAND / "misure.json").write_text(json.dumps(misure, indent=1, ensure_ascii=False))
    return misure


if __name__ == "__main__":
    for k, v in main().items():
        print(f"{k:45} {v.get('corpo')} r={v.get('raggio')} fill={v.get('riempimento')} bordo={v.get('bordo')} ink={v.get('inchiostro')}")
