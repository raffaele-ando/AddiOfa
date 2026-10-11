#!/usr/bin/env python3
"""Icone per gli store dal logo 3D (resta così: è l'icona dell'app).

    python3 docs/design/store/genera-icone-store.py

Sorgente: grafica/strumenti/brand/logo/addiofa-icona-pieno-campo.svg (la piastrella 3D a pieno campo).
Scrive qui: ios-1024, play-512, maskable-512, apple-touch-180, favicon-32, android-adaptive-foreground-432,
android-adaptive-background-432, anteprima.png. Rende con Chromium (SVG come data URI in un <img>).
Il primo piano adattivo è la sola stella luminosa (con il suo bordo) sul trasparente, nella zona sicura.
"""
import base64, io, math, pathlib, re, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from playwright.sync_api import sync_playwright

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[2]
SORG = RADICE / "grafica/strumenti/brand/logo/addiofa-icona-pieno-campo.svg"
spec = importlib.util.spec_from_file_location("genera_logo", RADICE / "grafica/brand/logo/genera-logo.py")
gl = importlib.util.module_from_spec(spec); spec.loader.exec_module(gl)

VB = (68.1, 69.1, 1116.9)      # viewBox della piastrella a pieno campo (coordinate del concept 24)
PIASTRELLA = "M366.6 69.1H887.4C1080.3 69.1 1185.9 174.8 1185.9 367.6V887.5C1185.9 1080.3 1080.3 1186 887.4 1186H366.6C173.8 1186 68.1 1080.3 68.1 887.5V367.6C68.1 174.8 173.8 69.1 366.6 69.1Z"


def render(pw_page, svg: str, n: int, bg="#000") -> Image.Image:
    u = "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()
    pw_page.set_viewport_size({"width": n, "height": n})
    pw_page.set_content(f"<style>html,body{{margin:0;background:{bg}}}img{{display:block;width:{n}px;height:{n}px}}</style><img src='{u}'>")
    pw_page.wait_for_function("document.images[0].complete")
    return Image.open(io.BytesIO(pw_page.screenshot())).convert("RGB")


def maschera_svg(d: str, extra: str = "") -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB[0]} {VB[1]} {VB[2]} {VB[2]}" width="1000" height="1000">'
            f'<rect x="0" y="0" width="1400" height="1400" fill="#000"/><path d="{d}" fill="#fff" {extra}/></svg>')


def main():
    sorg = SORG.read_text(encoding="utf-8")
    big = 2048
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium"); p = b.new_page()
        S = re.sub(r'width="\d+" height="\d+"', f'width="{big}" height="{big}"', sorg, count=1)
        icona = render(p, S, big)                                   # piena, quadrata, senza angoli
        # stella (con il bordo) in coordinate del concept: poligono misurato, simmetrico, un po' allargato
        stella = gl.porta_path(626, 268, 5.94)
        m_stella = render(p, maschera_svg(stella, 'stroke="#fff" stroke-width="5" stroke-linejoin="round"').replace('width="1000" height="1000"', f'width="{big}" height="{big}"'), big)
        m_tile = render(p, maschera_svg(PIASTRELLA).replace('width="1000" height="1000"', f'width="{big}" height="{big}"'), big)
        b.close()

    def giu(img, n):
        return img.resize((n, n), Image.LANCZOS)

    # iOS: 1024, tutto campo, senza trasparenza e senza angoli arrotondati
    giu(icona, 1024).convert("RGB").save(QUI / "ios-1024.png", optimize=True)
    # Play Store: 512 a tutto campo (Google applica la sua maschera)
    giu(icona, 512).convert("RGB").save(QUI / "play-512.png", optimize=True)
    # maskable: lo stesso pieno campo; la stella sta ben dentro la zona sicura (cerchio dell'80%)
    giu(icona, 512).convert("RGB").save(QUI / "maskable-512.png", optimize=True)
    giu(icona, 180).convert("RGB").save(QUI / "apple-touch-180.png", optimize=True)
    # favicon: piastrella con gli angoli arrotondati veri (trasparenti), 32 px
    t = giu(icona, 512).convert("RGBA"); a = giu(m_tile, 512).convert("L"); t.putalpha(a)
    t.resize((32, 32), Image.LANCZOS).save(QUI / "favicon-32.png", optimize=True)

    # Android adattiva 432 (108 dp x 4): sfondo a gradiente, primo piano = la stella luminosa nella zona sicura
    N = 432
    sf = Image.new("RGB", (N, N))
    px = np.zeros((N, N, 3), float)
    yy, xx = np.mgrid[0:N, 0:N] / (N - 1)
    tt = np.clip(((xx - 0.2) * 0.6 + (1 - yy) * 0.8) / (0.6 * 0.6 + 0.8) , 0, 1)   # basso-sinistra scuro -> alto-destra chiaro
    tt = np.clip((xx * 0.45 + (1 - yy) * 0.55), 0, 1)
    stops = [(0.0, (5, 36, 112)), (0.55, (11, 75, 184)), (1.0, (58, 140, 253))]
    for c in range(3):
        px[:, :, c] = np.interp(tt, [s[0] for s in stops], [s[1][c] for s in stops])
    Image.fromarray(px.astype("uint8")).save(QUI / "android-adaptive-background-432.png", optimize=True)

    m = np.asarray(m_stella.convert("L")) > 128
    ys, xs = np.where(m); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    sub = icona.crop((x0, y0, x1 + 1, y1 + 1)).convert("RGBA")
    al = Image.fromarray((m[y0:y1 + 1, x0:x1 + 1] * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(2.2))
    sub.putalpha(al)
    # scala: l'intera stella (cerchio circoscritto) dentro il cerchio sicuro del 66% (raggio 0,33 N), con un filo di margine
    w, h = sub.size
    cx, cy = (w - 1) / 2, (h - 1) / 2
    r_max = np.hypot(ys - (y0 + y1) / 2, xs - (x0 + x1) / 2).max()
    k = (0.33 * N * 0.96) / r_max
    nw, nh = round(w * k), round(h * k)
    sub = sub.resize((nw, nh), Image.LANCZOS)
    fg = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    fg.alpha_composite(sub, ((N - nw) // 2, (N - nh) // 2))
    fg.save(QUI / "android-adaptive-foreground-432.png", optimize=True)
    # controllo: tutto il primo piano dentro il cerchio sicuro
    A = np.asarray(fg)[:, :, 3] > 8
    yy2, xx2 = np.where(A)
    r = np.hypot(yy2 - (N - 1) / 2, xx2 - (N - 1) / 2).max() / N
    print(f"primo piano: raggio massimo {r*100:.1f}% del lato (zona sicura: 33%)  bbox {nw}x{nh}")

    # foglio di anteprima
    C = Image.new("RGB", (1500, 760), "#F6F8FC")
    d = ImageDraw.Draw(C)

    def incolla(img, x, y, size, label, mask=None, bg=None):
        im = img.resize((size, size), Image.LANCZOS)
        if mask == "squircle":
            mk = Image.new("L", (size * 4, size * 4), 0)
            ImageDraw.Draw(mk).rounded_rectangle((0, 0, size * 4 - 1, size * 4 - 1), radius=int(size * 4 * 0.225), fill=255)
            mk = mk.resize((size, size), Image.LANCZOS)
            C.paste(im, (x, y), mk)
        elif mask == "cerchio":
            mk = Image.new("L", (size * 4, size * 4), 0)
            ImageDraw.Draw(mk).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
            mk = mk.resize((size, size), Image.LANCZOS)
            C.paste(im, (x, y), mk)
        else:
            C.paste(im.convert("RGBA"), (x, y), im.convert("RGBA")) if im.mode == "RGBA" else C.paste(im, (x, y))
        d.text((x, y + size + 6), label, fill="#333")

    ic = Image.open(QUI / "ios-1024.png")
    incolla(ic, 20, 20, 220, "ios-1024 (maschera iOS)", "squircle")
    incolla(Image.open(QUI / "play-512.png"), 260, 20, 220, "play-512 (maschera Play)", "squircle")
    comp = sf.copy()
    comp = Image.open(QUI / "android-adaptive-background-432.png").convert("RGBA")
    comp.alpha_composite(fg)
    incolla(comp.convert("RGB"), 500, 20, 220, "adattiva: cerchio", "cerchio")
    incolla(comp.convert("RGB"), 740, 20, 220, "adattiva: squircle", "squircle")
    # primo piano su scacchiera con cerchio sicuro
    sc = Image.new("RGB", (N, N), "#ccc"); dd = ImageDraw.Draw(sc)
    for i in range(0, N, 24):
        for j in range(0, N, 24):
            if (i // 24 + j // 24) % 2: dd.rectangle((i, j, i + 23, j + 23), fill="#eee")
    sc = sc.convert("RGBA"); sc.alpha_composite(fg)
    ImageDraw.Draw(sc).ellipse((N / 2 - 0.33 * N, N / 2 - 0.33 * N, N / 2 + 0.33 * N, N / 2 + 0.33 * N), outline="#e11", width=2)
    incolla(sc.convert("RGB"), 980, 20, 220, "primo piano + zona sicura 66%")
    incolla(Image.open(QUI / "maskable-512.png"), 1220, 20, 220, "maskable-512 (cerchio 80%)", "cerchio")
    # dimensioni d'uso: 96, 64, 48, 32, 180
    y = 330
    x = 20
    for n, nome, src in [(180, "apple-touch-180", "apple-touch-180.png"), (96, "96", "ios-1024.png"), (64, "64", "ios-1024.png"), (48, "48", "ios-1024.png"), (32, "favicon-32", "favicon-32.png")]:
        im = Image.open(QUI / src).convert("RGBA")
        im = im.resize((n, n), Image.LANCZOS) if im.size[0] != n else im
        if src == "favicon-32.png":
            C.paste(im, (x, y), im)
        else:
            mk = Image.new("L", (n * 4, n * 4), 0); ImageDraw.Draw(mk).rounded_rectangle((0, 0, n * 4 - 1, n * 4 - 1), radius=int(n * 4 * 0.225), fill=255)
            C.paste(im.convert("RGB"), (x, y), mk.resize((n, n), Image.LANCZOS))
        d.text((x, y + n + 6), f"{nome}", fill="#333")
        x += n + 30
    # su fondo scuro, a 48 px
    D = Image.new("RGB", (400, 120), "#0B1220"); x = 12
    for n in (96, 64, 48, 32):
        im = Image.open(QUI / "ios-1024.png").resize((n, n), Image.LANCZOS)
        mk = Image.new("L", (n * 4, n * 4), 0); ImageDraw.Draw(mk).rounded_rectangle((0, 0, n * 4 - 1, n * 4 - 1), radius=int(n * 4 * 0.225), fill=255)
        D.paste(im, (x, 12), mk.resize((n, n), Image.LANCZOS)); x += n + 20
    C.paste(D, (620, 330))
    d.text((620, 456), "stesse dimensioni su fondo scuro", fill="#333")
    C.save(QUI / "anteprima.png")
    print("ok")


if __name__ == "__main__":
    main()
