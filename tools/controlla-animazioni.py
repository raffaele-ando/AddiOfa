#!/usr/bin/env python3
"""Controllo in Chromium delle animazioni di app/dist-demo/prova-animazioni.html (prima: python3 tools/make-prova-animazioni.py).
Per ogni illustrazione: fotogrammi a 0, 300, 700, 1200, 2000 ms (tempo fissato con le Web Animations, non in tempo reale),
diversi tra loro (c'e' movimento); stato finale (3 s) uguale all'illustrazione statica (senza `in`);
con prefers-reduced-motion i fotogrammi sono tutti uguali allo statico. Salva una striscia di fotogrammi per ognuna.
Uso (dalla radice): python3 tools/controlla-animazioni.py [cartella-strisce] [--scuro]"""
import io, subprocess, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
from playwright.sync_api import sync_playwright

RADICE = Path(__file__).resolve().parent.parent
PAGINA = (RADICE / 'app/dist-demo/prova-animazioni.html').as_uri() + '#fermo'
CHROMIUM = '/opt/pw-browsers/chromium'
NOMI = ['studio-inglese', 'quiz-test', 'risultato-probabilita', 'successo', 'celebrazione', 'mancato-superamento',
        'progressi-statistiche', 'piano-studi-bloccato', 'superamento', 'suggerimenti-consigli', 'attesa-caricamento']
TEMPI = [0, 300, 700, 1200, 2000]
STRISCIA = [0, 150, 300, 450, 600, 800, 1000, 1250, 1600, 2400]

args = [a for a in sys.argv[1:] if not a.startswith('--')]
SCURO = '--scuro' in sys.argv
OUT = Path(args[0]) if args else Path('/tmp/strisce-animazioni')
OUT.mkdir(parents=True, exist_ok=True)


def diff(a, b):
    """(scarto medio su 255, quota di pixel con scarto > 12)"""
    d = ImageChops.difference(a.convert('RGB'), b.convert('RGB')).convert('L')
    px = list(d.getdata())
    return sum(px) / len(px), sum(1 for v in px if v > 12) / len(px)


def fotogramma(pg, palco, t):
    pg.evaluate("""async ([n,t])=>{
      const vis=[...document.querySelectorAll('#scheda-'+n+' .anim')].find(e=>getComputedStyle(e).display!=='none');
      document.getAnimations().forEach(a=>a.cancel());   /* le animazioni messe in pausa a mano non si tolgono da sole */
      vis.classList.remove('in');void vis.offsetWidth;vis.classList.add('in');
      const an=vis.getAnimations({subtree:true});
      an.forEach(a=>a.pause());
      await Promise.all(an.map(a=>a.ready));   /* prima la pausa, poi il tempo: i fotogrammi cadono davvero a t */
      const fine=Math.max(...an.map(a=>a.effect.getComputedTiming().endTime));
      an.forEach(a=>{a.currentTime=t<0?fine+t:t});}""", [palco, t])
    pg.wait_for_timeout(60)
    return Image.open(io.BytesIO(pg.locator(f'#scheda-{palco} .palco').screenshot()))


def statico(pg, n):
    pg.evaluate("""n=>{document.getAnimations().forEach(a=>a.cancel());for(const e of document.querySelectorAll('#scheda-'+n+' .anim'))e.classList.remove('in')}""", n)
    pg.wait_for_timeout(60)
    return Image.open(io.BytesIO(pg.locator(f'#scheda-{n} .palco').screenshot()))


def main():
    esito = 0
    # la pagina si rifa ogni volta (build:demo svuota app/dist-demo)
    subprocess.run([sys.executable, str(RADICE / 'tools/make-prova-animazioni.py')], check=True)
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROMIUM)
        ctx = b.new_context(viewport={'width': 400, 'height': 900}, device_scale_factor=2, color_scheme='dark' if SCURO else 'light')
        pg = ctx.new_page()
        errori = []
        pg.on('console', lambda m: errori.append(m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: errori.append(str(e)))
        pg.goto(PAGINA)
        sx = pg.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth')
        print('scorrimento orizzontale a 400 px:', 'SI (male)' if sx else 'no')
        print(f"{'nome':24} {'0-300':>6} {'300-700':>8} {'700-1200':>9} {'1200-2000':>10} {'2000-fine':>10} | {'fine-statico':>12} {'px>12':>7} {'-3ms':>7} | ridotto")
        for n in NOMI:
            pg.locator(f'#scheda-{n}').scroll_into_view_if_needed()
            st = statico(pg, n)
            fr = {t: fotogramma(pg, n, t) for t in TEMPI + STRISCIA + [3000, -3]}
            d = [diff(fr[TEMPI[i]], fr[TEMPI[i + 1]])[0] for i in range(4)]
            d_end = diff(fr[2000], fr[3000])[0]
            fine = diff(fr[3000], st)
            quasi = diff(fr[-3], st)   # 3 ms prima della fine: l'ultimo fotogramma dell'animazione
            # movimento ridotto: contesto separato
            r_ctx = b.new_context(viewport={'width': 400, 'height': 900}, device_scale_factor=2, reduced_motion='reduce', color_scheme='dark' if SCURO else 'light')
            rp = r_ctx.new_page(); rp.goto(PAGINA)
            rp.locator(f'#scheda-{n}').scroll_into_view_if_needed()
            st_r = statico(rp, n)
            rp.evaluate("n=>{for(const e of document.querySelectorAll('#scheda-'+n+' .anim')){e.classList.remove('in');void e.offsetWidth;e.classList.add('in')}}", n)
            rp.wait_for_timeout(80)
            rid = diff(Image.open(io.BytesIO(rp.locator(f'#scheda-{n} .palco').screenshot())), st_r)[0]
            r_ctx.close()
            ok_mov = all(x > 0.05 for x in d)
            ok_fine = fine[0] < 0.1 and fine[1] < 0.001
            ok_rid = rid < 0.01
            ok_fine = ok_fine and quasi[0] < 0.25
            print(f'{n:24} {d[0]:6.2f} {d[1]:8.2f} {d[2]:9.2f} {d[3]:10.2f} {d_end:10.2f} | {fine[0]:12.4f} {fine[1]:7.4f} {quasi[0]:7.3f} | {rid:.4f} {"OK" if ok_mov and ok_fine and ok_rid else "DA VEDERE"}')
            esito |= not (ok_mov and ok_fine and ok_rid)
            # striscia: 5 colonne, 2 righe, ridotta a meta'
            w, h = fr[0].size; w2, h2 = w // 2, h // 2
            foglio = Image.new('RGB', (w2 * 5, h2 * 2 + 2), (255, 255, 255))
            dr = ImageDraw.Draw(foglio)
            for i, t in enumerate(STRISCIA):
                im = fr[t].convert('RGB').resize((w2, h2), Image.LANCZOS)
                x, y = (i % 5) * w2, (i // 5) * (h2 + 2)
                foglio.paste(im, (x, y)); dr.text((x + 6, y + 4), f'{t} ms', fill=(120, 130, 150))
            foglio.save(OUT / f'{n}{"-scuro" if SCURO else ""}.png')
        print('errori in console:', errori or 'nessuno')
        b.close()
    sys.exit(esito)


main()
