#!/usr/bin/env python3
"""Genera app/src/brand/marchio.generato.ts dal wordmark del concept 07/28 (grafica/brand/logo/wordmark-primario.svg).
Revisione del 18/10: wordmark bicolore come nei concept: «Addi» nel colore del testo, «OFA» nel blu d'azione, e UNA sola stella
(la scintilla a quattro punte) ritagliata nella O, che è un disco. Ogni tracciato porta il suo `ruolo` ('testo' | 'azione'):
il componente li colora con i token (fill-testo, fill-azione), quindi chiaro/scuro seguono il tema. Nessun <text>.
Il `lettermark` (la A piena con la stella a base piatta, solo per l'uso da solo) viene da wordmark-lettermark-o-semplice.svg.
La versione monocolore precedente (lettermark al posto delle due A) resta come file in grafica/brand/logo/.
Uso (dalla radice): python3 tools/genera-marchio.py   # serve Chromium (Playwright) solo per misurare gli ingombri."""
import json, re, pathlib, glob
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parent.parent
L = R / 'grafica/brand/logo'
svg = (L / 'wordmark-primario.svg').read_text()
P = {m.group(1): m.group(2) for m in re.finditer(r'<path id="([^"]+)" d="([^"]+)"', svg)}
cx, cy, r = map(float, re.search(r'<circle id="o-disco" cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"', svg).groups())
t = [sum(v) for v in zip(*[[float(x) for x in m.split()] for m in re.findall(r'translate\(([-\d. ]+)\)', svg)])]
disco = f'M{cx - r:.2f} {cy:.2f}a{r:.2f} {r:.2f} 0 1 0 {2 * r:.2f} 0a{r:.2f} {r:.2f} 0 1 0 {-2 * r:.2f} 0Z'
paths = []
for i in ('lettera-a', 'lettera-d1', 'lettera-d2', 'lettera-i'):
    paths.append({'id': i, 'd': P[i], 'eo': False, 'ruolo': 'testo'})
paths.append({'id': 'o-disco', 'd': disco + P['o-stella'], 'eo': True, 'ruolo': 'azione'})  # la stella è un vuoto
for i in ('lettera-f', 'lettera-a2'):
    paths.append({'id': i, 'd': P[i], 'eo': False, 'ruolo': 'azione'})

lm = re.search(r'<path id="lettermark" d="([^"]+)"', (L / 'wordmark-lettermark-o-semplice.svg').read_text()).group(1)
lm_t = [sum(v) for v in zip(*[[float(x) for x in m.split()] for m in re.findall(r'translate\(([-\d. ]+)\)', (L / 'wordmark-lettermark-o-semplice.svg').read_text())])]

def bbox(pg, corpo):
    pg.set_content(f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><g id="g">{corpo}</g></svg>')
    return pg.evaluate("(()=>{const r=document.getElementById('g').getBBox();return [r.x,r.y,r.width,r.height]})()")

exe = glob.glob('/opt/pw-browsers/chromium-*/chrome-linux/chrome')[0]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=exe); pg = b.new_page()
    bw = bbox(pg, ''.join(f'<path d="{x["d"]}" fill-rule="{"evenodd" if x["eo"] else "nonzero"}"/>' for x in paths))
    bl = bbox(pg, f'<path d="{lm}"/>')
    b.close()
f = lambda x: round(x, 2)
# viewBox stretto attorno ai tracciati (nello spazio locale, prima della traslazione); piccolo margine per i bordi arrotondati
out = {
  'parola': {'vb': [f(bw[0] - 1), f(bw[1] - 1), f(bw[2] + 2), f(bw[3] + 2)], 'trasl': [0, 0], 'percorsi': paths},
  'lettermark': {'vb': [f(bl[0] + lm_t[0]), f(bl[1] + lm_t[1]), f(bl[2]), f(bl[3])], 'trasl': [f(lm_t[0]), f(lm_t[1]), ], 'd': lm},
}
dest = R / 'app/src/brand/marchio.generato.ts'
dest.write_text('// GENERATO da tools/genera-marchio.py: non modificare. Wordmark bicolore (ruoli testo/azione), una sola stella nella O.\n'
                'export const MARCHIO = ' + json.dumps(out, separators=(',', ':'), ensure_ascii=False) + ' as const;\n')
print(dest, len(dest.read_text()), 'byte', out['parola']['vb'])
