#!/usr/bin/env python3
"""Inventario dei colori dell'app: token chiaro/scuro, colori fissi nel codice, tavolozza di ogni illustrazione (chiara e scura), immagini raster.
Uso: python3 tools/inventario-colori.py [--md percorso]   (stampa un riepilogo; con --md lo salva)"""
import re, sys, pathlib, collections, glob
from PIL import Image
RAD = pathlib.Path(__file__).resolve().parents[1]
SRC = RAD / 'app/src'
css = (SRC / 'index.css').read_text()
def blocco(nome_apertura):
    i = css.index(nome_apertura); j = css.index('\n}', i); return css[i:j]
def variabili(b): return dict(re.findall(r'(--[\w-]+):\s*([^;]+);', b))
chiaro = variabili(blocco('@theme static {')); scuro = variabili(blocco('.dark {'))
landing = variabili(blocco(':root {\n  --landing-cielo-alto'))
out = []
out.append('## 1. Token dell\'interfaccia (nome: chiaro → scuro)\n')
for k, v in chiaro.items():
    out.append(f'- {k.replace("--color-", "")}: {v} → {scuro.get(k, "(uguale)")}')
out.append('\n## 2. Colori della landing (tema chiaro; in scuro la scena è notturna)\n')
for k, v in landing.items(): out.append(f'- {k.replace("--landing-", "")}: {v}')
# colori fissi nel codice
fissi = collections.defaultdict(set)
for p in list(SRC.rglob('*.tsx')) + list(SRC.rglob('*.ts')):
    if any(x in p.name for x in ('generato', 'questions', 'theory', 'corsi', 'BrandKit', 'tokens')): continue
    for m in re.findall(r'#[0-9A-Fa-f]{6}\b', p.read_text(errors='ignore')): fissi[m.upper()].add(p.name)
out.append('\n## 3. Colori scritti a mano nel codice (esadecimale: dove)\n')
for h, fs in sorted(fissi.items(), key=lambda x: -len(x[1])): out.append(f'- {h}: {", ".join(sorted(fs)[:5])}')
# illustrazioni
def palette(path, n=8):
    t = path.read_text(errors='ignore')
    c = collections.Counter(h.upper() for h in re.findall(r'#[0-9A-Fa-f]{6}\b', t))
    return ' '.join(f'{h}×{k}' for h, k in c.most_common(n))
out.append('\n## 4. Illustrazioni (per ognuna: i colori più usati, variante chiara e scura)\n')
D = SRC / 'brand/essenziali/disegni'
for kit in ('kit-blu', 'kit-luminoso'):
    for gr in sorted((D / kit).iterdir()):
        for f in sorted(gr.glob('*.svg')):
            if f.name.endswith('.scuro.svg'): continue
            s = f.with_name(f.stem + '.scuro.svg')
            out.append(f'- {kit}/{gr.name}/{f.stem}: CHIARA {palette(f)} | SCURA {palette(s) if s.exists() else "—"}')
# raster
out.append('\n## 5. Immagini raster (colori dominanti)\n')
for f in sorted((SRC / 'brand/essenziali').rglob('*.webp')):
    im = Image.open(f).convert('RGB').resize((96, 96)).quantize(6).convert('RGB')
    c = collections.Counter(im.getdata()).most_common(6)
    out.append(f'- {f.relative_to(SRC / "brand/essenziali")}: ' + ' '.join('#%02X%02X%02X' % rgb for rgb, _ in c))
testo = '\n'.join(out)
if '--md' in sys.argv:
    pathlib.Path(sys.argv[sys.argv.index('--md') + 1]).write_text('# Inventario dei colori (generato da tools/inventario-colori.py)\n\n' + testo + '\n')
print(testo[:1500]); print('...', len(testo), 'caratteri')
