"""
Rende SVG e pagine HTML con Chromium (lo stesso motore dei browser in cui gira l'app) e misura
lo scarto con l'originale. Come in Aporia: niente stime a occhio, un numero per ogni elemento.
"""
from __future__ import annotations

import base64
import io
import os

import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
from skimage.metrics import structural_similarity

CHROMIUM = os.environ.get("CHROMIUM", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")


class Renderer:
    def __enter__(self):
        self._pw = sync_playwright().start()
        opzioni = {"executable_path": CHROMIUM} if os.path.exists(CHROMIUM) else {}
        self._browser = self._pw.chromium.launch(**opzioni)
        self._page = self._browser.new_page()
        return self

    def __exit__(self, *exc):
        self._browser.close()
        self._pw.stop()

    def svg(self, svg: str, w: int, h: int, fondo: str = "transparent") -> Image.Image:
        """PNG RGBA di uno SVG reso a w×h px (1 px CSS = 1 px), su un fondo CSS."""
        self._page.set_viewport_size({"width": w, "height": h})
        b64 = base64.b64encode(svg.encode()).decode()
        self._page.set_content(
            f"<style>html,body{{margin:0;background:{fondo}}}img{{display:block;width:{w}px;height:{h}px}}</style>"
            f"<img src='data:image/svg+xml;base64,{b64}'>"
        )
        self._page.wait_for_function("document.images[0].complete")
        png = self._page.screenshot(clip={"x": 0, "y": 0, "width": w, "height": h}, omit_background=(fondo == "transparent"))
        return Image.open(io.BytesIO(png)).convert("RGBA")


def su_fondo(rgba: Image.Image, fondo) -> np.ndarray:
    a = np.asarray(rgba.convert("RGBA")).astype(np.float64)
    al = a[..., 3:4] / 255.0
    return a[..., :3] * al + np.asarray(fondo, dtype=np.float64) * (1 - al)


def confronta(riferimento: np.ndarray, prova: np.ndarray) -> dict:
    """Scarti su 0-255 e somiglianza strutturale (SSIM, 1 = identico)."""
    diff = np.abs(riferimento - prova)
    grigio_r = riferimento.mean(axis=2)
    grigio_p = prova.mean(axis=2)
    lato = min(grigio_r.shape)
    finestra = max(3, min(7, lato - (1 - lato % 2)))
    ssim = structural_similarity(grigio_r, grigio_p, data_range=255, win_size=finestra)
    return {
        "mae_255": round(float(diff.mean()), 2),
        "p95_255": round(float(np.percentile(diff.max(axis=2), 95)), 1),
        "entro_8": round(float((diff.max(axis=2) <= 8).mean()), 4),
        "ssim": round(float(ssim), 4),
    }
