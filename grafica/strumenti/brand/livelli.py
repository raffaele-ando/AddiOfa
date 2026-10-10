"""
Scompone ogni illustrazione in livelli: parti con i pixel originali (quindi l'insieme è identico
all'illustrazione) che si possono spostare, ingrandire, ricolorare o nascondere una per una.

    python3 strumenti/brand/livelli.py tutto                       # scompone tutte le illustrazioni
    python3 strumenti/brand/livelli.py kit-blu/illustrazioni/studio-inglese

Esce in brand/livelli/<kit>/<gruppo>/<nome>/:
  livelli.json       elenco delle parti: nome, riquadro, colore medio, area
  base.png           l'illustrazione intera (identica)
  parte-N.png        ogni parte da sola, con la sua trasparenza
  anteprima.png      le parti colorate una per una, per sapere quale numero dire
  <nome>.svg         SVG con un livello per parte (<g id="parte-N">), identico all'originale

Le modifiche si fanno con modifica.py.
"""
from __future__ import annotations

import base64
import io
import json
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"

NOMI_COLORE = [((59, 130, 246), "blu"), ((239, 68, 68), "rosso"), ((245, 158, 11), "giallo"), ((34, 197, 94), "verde"),
               ((139, 92, 246), "viola"), ((255, 255, 255), "bianco"), ((148, 163, 184), "grigio"), ((15, 23, 42), "scuro"),
               ((219, 234, 254), "azzurro"), ((254, 226, 226), "rosa")]


def nome_colore(c) -> str:
    return min(NOMI_COLORE, key=lambda nc: sum((a - b) ** 2 for a, b in zip(c, nc[0])))[1]


def dataurl(im: Image.Image) -> str:
    buf = io.BytesIO(); im.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def scomponi(esatto: Image.Image, soglia: float = 16.0, colori: int = 14, area_min: float = 0.003):
    """Parti "oggetto": zone separate da bordi netti (le sfumature restano dentro la stessa parte)."""
    from disegna import parti
    a = np.asarray(esatto.convert("RGBA")).astype(np.float64)
    pieno = a[..., 3] >= 128
    et = parti(a[..., :3], pieno, colori, soglia)
    ids = [i for i in np.unique(et) if i > 0]
    area_tot = max(1, pieno.sum())
    grandi = [i for i in ids if (et == i).sum() >= area_min * area_tot]
    # le parti troppo piccole vanno alla parte grande più vicina
    maschera_grandi = np.isin(et, grandi)
    if maschera_grandi.any():
        _, (iy, ix) = ndi.distance_transform_edt(~maschera_grandi, return_indices=True)
        et = np.where(pieno & ~maschera_grandi, et[iy, ix], et)
    # anche i pixel semitrasparenti (bordi, aloni) vanno alla parte più vicina: così l'insieme ricompone l'originale
    visibile = a[..., 3] > 0
    if (visibile & ~pieno).any() and maschera_grandi.any():
        _, (iy, ix) = ndi.distance_transform_edt(~np.isin(et, grandi), return_indices=True)
        et = np.where(visibile & (et == 0), et[iy, ix], et)
    return et, grandi


def main(filtro: str):
    estrazione = json.loads((BRAND / "estrazione.json").read_text())
    indice = {}
    for el in estrazione["elementi"]:
        if el["gruppo"] not in ("illustrazioni", "stati") or el["kit"] == "logo":
            continue
        chiave = f"{el['kit']}/{el['gruppo']}/{el['nome']}"
        if filtro != "tutto" and filtro not in chiave:
            continue
        esatto = Image.open(BRAND / el["file"]).convert("RGBA")
        a = np.asarray(esatto)
        et, ids = scomponi(esatto)
        cartella = BRAND / "livelli" / el["kit"] / el["gruppo"] / el["nome"]
        cartella.mkdir(parents=True, exist_ok=True)
        esatto.save(cartella / "base.png", optimize=True)
        parti_info = []
        gruppi_svg = []
        ricomposto = Image.new("RGBA", esatto.size, (0, 0, 0, 0))
        tavola = Image.new("RGBA", esatto.size, (255, 255, 255, 255))
        rng = np.random.default_rng(1)
        for n, i in enumerate(sorted(ids, key=lambda i: -(et == i).sum()), start=1):
            m = et == i
            pezzo = a.copy(); pezzo[..., 3] = np.where(m, a[..., 3], 0)
            im = Image.fromarray(pezzo, "RGBA")
            bbox = im.getbbox()
            if not bbox:
                continue
            ritaglio = im.crop(bbox)
            ritaglio.save(cartella / f"parte-{n}.png", optimize=True)
            media = a[..., :3][m & (a[..., 3] > 200)].mean(axis=0) if (m & (a[..., 3] > 200)).any() else a[..., :3][m].mean(axis=0)
            nome = f"parte-{n}-{nome_colore(media)}"
            parti_info.append({"n": n, "id": nome, "riquadro": list(bbox), "area": int(m.sum()),
                               "colore": "#%02X%02X%02X" % tuple(int(v) for v in media), "file": f"parte-{n}.png"})
            gruppi_svg.append(f'<g id="{nome}"><image x="{bbox[0]}" y="{bbox[1]}" width="{bbox[2] - bbox[0]}" '
                              f'height="{bbox[3] - bbox[1]}" href="{dataurl(ritaglio)}"/></g>')
            ricomposto.alpha_composite(im)
            tinta = tuple(int(v) for v in rng.integers(40, 230, 3)) + (170,)
            strato = Image.new("RGBA", esatto.size, (0, 0, 0, 0))
            strato.paste(Image.new("RGBA", esatto.size, tinta), mask=Image.fromarray((m * 255).astype(np.uint8)))
            tavola.alpha_composite(strato)
        # anteprima con i numeri delle parti sopra ogni parte
        tav = Image.new("RGBA", (esatto.width * 2 + 10, esatto.height), (255, 255, 255, 255))
        tav.alpha_composite(esatto, (0, 0)); tav.alpha_composite(tavola, (esatto.width + 10, 0))
        d = ImageDraw.Draw(tav)
        for p in parti_info:
            x0, y0, x1, y1 = p["riquadro"]
            d.text((esatto.width + 10 + (x0 + x1) // 2 - 3, (y0 + y1) // 2 - 5), str(p["n"]), fill=(0, 0, 0, 255))
        tav.convert("RGB").resize((tav.width * 2, tav.height * 2)).save(cartella / "anteprima.png")
        # controllo: le parti ricompongono l'originale
        # si confronta ciò che si vede: colore pesato per la trasparenza, più la trasparenza stessa
        r = np.asarray(ricomposto).astype(float); o = a.astype(float)
        vis = lambda x: np.concatenate([x[..., :3] * x[..., 3:4] / 255.0, x[..., 3:4]], axis=-1)
        scarto = float(np.abs(vis(r) - vis(o)).mean())
        w, h = esatto.size
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
               f'<title>{el["nome"]}</title>{"".join(gruppi_svg)}</svg>')
        (cartella / f"{el['nome']}.svg").write_text(svg)
        (cartella / "livelli.json").write_text(json.dumps({"elemento": chiave, "dimensioni": [w, h], "parti": parti_info,
                                                           "scarto_ricomposizione_255": round(scarto, 3)}, indent=1))
        indice[chiave] = {"cartella": str(cartella.relative_to(BRAND)), "parti": len(parti_info), "scarto": round(scarto, 3)}
        print(f"{chiave:52} {len(parti_info):3d} livelli  ricomposizione {scarto:.3f}/255", flush=True)
    if filtro == "tutto":
        (BRAND / "livelli.json").write_text(json.dumps(indice, indent=1))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "tutto")
