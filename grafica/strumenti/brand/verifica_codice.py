"""
Confronta i componenti React del Brand Kit con i PNG originali.

Avvia l'app (`npx vite`), apre /?brand=verifica, fotografa ogni componente e lo allinea al PNG
estratto sul riquadro del disegno (i pixel diversi dal fondo); poi misura lo scarto come per gli
SVG. Risultato in brand/verifica-codice.json e brand/tavole/codice.png.

    python3 strumenti/brand/verifica_codice.py
"""
from __future__ import annotations

import io
import json
import pathlib
import subprocess
import time
import urllib.request

import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

from render import CHROMIUM, su_fondo, confronta

QUI = pathlib.Path(__file__).resolve().parent
APP = QUI.parents[1]
BRAND = APP / "brand"
PORTA = 5181


def riquadro_disegno(rgb: np.ndarray, fondo, soglia=40.0):  # 40: il corpo, non l'ombra
    d = np.linalg.norm(rgb - np.asarray(fondo, dtype=np.float64), axis=2) > soglia
    ys, xs = np.nonzero(d)
    if len(xs) == 0:
        return 0, 0, rgb.shape[1], rgb.shape[0]
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def main():
    estrazione = {f"{e['kit']}/{e['gruppo']}/{e['nome']}": e for e in json.loads((BRAND / "estrazione.json").read_text())["elementi"]}
    server = subprocess.Popen(["npx", "vite", "--port", str(PORTA), "--strictPort"], cwd=APP,
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                urllib.request.urlopen(f"http://localhost:{PORTA}/", timeout=1); break
            except Exception:
                time.sleep(0.5)
        risultati = []
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=CHROMIUM)
            page = browser.new_page(viewport={"width": 1400, "height": 900}, device_scale_factor=1)
            page.emulate_media(reduced_motion="reduce")
            page.goto(f"http://localhost:{PORTA}/?brand=verifica")
            page.wait_for_selector("[data-verifica]")
            page.evaluate("document.fonts.ready")
            time.sleep(1.0)
            for el in page.query_selector_all("[data-verifica]"):
                chiave = el.get_attribute("data-verifica")
                orig = estrazione.get(chiave)
                if not orig:
                    continue
                shot = np.asarray(Image.open(io.BytesIO(el.screenshot())).convert("RGB")).astype(np.float64)
                fondo = orig["fondo"]
                esatto = Image.open(BRAND / orig["file"]).convert("RGBA")
                ref = su_fondo(esatto, fondo)
                # allinea i due disegni sul loro riquadro e confronta su un'area grande quanto l'originale
                rx0, ry0, rx1, ry1 = riquadro_disegno(ref, fondo)
                sx0, sy0, sx1, sy1 = riquadro_disegno(shot, fondo)
                cx_r, cy_r = (rx0 + rx1) / 2, (ry0 + ry1) / 2
                cx_s, cy_s = (sx0 + sx1) / 2, (sy0 + sy1) / 2
                H, W = ref.shape[:2]
                tela = np.ones((H, W, 3)) * np.asarray(fondo, dtype=np.float64)
                ox, oy = int(round(cx_s - cx_r)), int(round(cy_s - cy_r))
                ys0, xs0 = max(0, oy), max(0, ox)
                ys1, xs1 = min(shot.shape[0], oy + H), min(shot.shape[1], ox + W)
                tela[ys0 - oy:ys1 - oy, xs0 - ox:xs1 - ox] = shot[ys0:ys1, xs0:xs1]
                m = confronta(ref, tela)
                m["dimensioni_disegno"] = {"originale": [int(rx1 - rx0), int(ry1 - ry0)], "codice": [int(sx1 - sx0), int(sy1 - sy0)]}
                risultati.append({"elemento": chiave, **m, "_ref": ref, "_codice": tela})
                print(f"{chiave:45} scarto {m['mae_255']:5.2f}/255  SSIM {m['ssim']:.3f}  "
                      f"disegno {m['dimensioni_disegno']['originale']} → {m['dimensioni_disegno']['codice']}", flush=True)
            browser.close()
    finally:
        server.terminate()

    # tavola: originale | codice | differenza ×4
    righe = [(r["_ref"], r["_codice"]) for r in risultati]
    Hs = [a.shape[0] for a, _ in righe]
    Wmax = max(a.shape[1] for a, _ in righe)
    tav = Image.new("RGB", (Wmax * 3 + 380, sum(Hs) + 12 * len(Hs)), "white")
    d = ImageDraw.Draw(tav)
    y = 0
    for r, (a, b) in zip(risultati, righe):
        for j, c in enumerate([a, b, np.abs(a - b) * 4]):
            tav.paste(Image.fromarray(np.clip(c, 0, 255).astype(np.uint8)), (j * Wmax, y))
        d.text((Wmax * 3 + 10, y + 4), f"{r['elemento']}  {r['mae_255']}/255", fill=(20, 20, 20))
        y += a.shape[0] + 12
    (BRAND / "tavole").mkdir(exist_ok=True)
    tav.save(BRAND / "tavole" / "codice.png", optimize=True)
    for r in risultati:
        r.pop("_ref"); r.pop("_codice")
    (BRAND / "verifica-codice.json").write_text(json.dumps(risultati, indent=1))


if __name__ == "__main__":
    main()
