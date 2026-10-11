#!/usr/bin/env python3
"""Genera app/src/brand/marchio.generato.ts dal lettermark e dal wordmark scelti (grafica/brand/logo/).
Scelta dell'utente (galleria loghi, 11/10): lettermark «A piena con la stella a base piatta» + wordmark «Primario, scintilla nella O», orizzontale.
Uso (dalla radice): python3 tools/genera-marchio.py   # serve Chromium (Playwright) solo per misurare gli ingombri."""
import json, re, pathlib
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parent.parent
LOGO = R / 'grafica/brand/logo'
lm = (LOGO / 'lettermark-piena-blu.svg').read_text()
wm = (LOGO / 'wordmark-primario.svg').read_text()

lm_d = re.search(r'<path id="lettera-a" d="([^"]+)"', lm).group(1)
parti = re.findall(r'<(path|circle) id="([^"]+)"([^>]*?)/>', wm)
glifi = []
for tag, id_, attrs in parti:
    fill = re.search(r'fill="([^"]+)"', attrs).group(1)
    tono = {'#071438': 'testo', '#0560FD': 'marchio', '#FFFFFF': 'stella'}[fill]
    if tag == 'path':
        glifi.append({'id': id_, 'd': re.search(r' d="([^"]+)"', attrs).group(1), 'tono': tono})
    else:
        g = {k: float(v) for k, v in re.findall(r'\b(cx|cy|r)="([^"]+)"', attrs)}
        glifi.append({'id': id_, 'cerchio': g, 'tono': tono})
TRASL = (6 - 2.14, 6 + 3.59)  # translate annidati del wordmark

html = f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><g id="w" transform="translate({TRASL[0]} {TRASL[1]})">' + ''.join(
    (f'<path d="{g["d"]}"/>' if 'd' in g else f'<circle cx="{g["cerchio"]["cx"]}" cy="{g["cerchio"]["cy"]}" r="{g["cerchio"]["r"]}"/>') for g in glifi if g['tono'] != 'stella'
) + f'</g><path id="l" d="{lm_d}"/></svg>'
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium'); pg = b.new_page(); pg.set_content(html)
    bw = pg.evaluate("(()=>{const r=document.getElementById('w').getBBox();return [r.x,r.y,r.width,r.height]})()")
    bl = pg.evaluate("(()=>{const r=document.getElementById('l').getBBox();return [r.x,r.y,r.width,r.height]})()")
    b.close()
# ingombri in coordinate dell'SVG (il wordmark è già traslato)
wx, wy, ww, wh = bw[0] + TRASL[0], bw[1] + TRASL[1], bw[2], bw[3]
lx, ly, lw, lh = bl
cap = 65.2  # altezza delle maiuscole del wordmark
# orizzontale: A alta 1,15 volte le maiuscole, centrata sulla riga del wordmark, spazio 0,30 dell'altezza della A
k = 1.15 * cap / lh
Lw, Lh = lw * k, lh * k
gap = 0.30 * Lh
H = max(Lh, wh)
tx_l, ty_l = -lx * k, (H - Lh) / 2 - ly * k
tx_w, ty_w = Lw + gap - wx, (H - wh) / 2 - wy
W = Lw + gap + ww
# verticale: A sopra il wordmark, larga 0,36 del wordmark, centrata
kv = 0.36 * ww / lh
Lwv, Lhv = lw * kv, lh * kv
gv = 0.26 * Lhv
Wv = max(ww, Lwv)
v = dict(W=Wv, H=Lhv + gv + wh, lm=[(Wv - Lwv) / 2 - lx * kv, -ly * kv, kv], wm=[(Wv - ww) / 2 - wx, Lhv + gv - wy])

def f(x): return round(x, 2)
out = {
  'lettermark': {'d': lm_d, 'vb': [f(lx), f(ly), f(lw), f(lh)]},
  'wordmark': {'glifi': glifi, 'traslazione': [f(TRASL[0]), f(TRASL[1])], 'vb': [f(wx), f(wy), f(ww), f(wh)]},
  'orizzontale': {'W': f(W), 'H': f(H), 'lm': [f(tx_l), f(ty_l), round(k, 4)], 'wm': [f(tx_w), f(ty_w)]},
  'verticale': {'W': f(v['W']), 'H': f(v['H']), 'lm': [f(x) if i < 2 else round(x, 4) for i, x in enumerate(v['lm'])], 'wm': [f(x) for x in v['wm']]},
}
dest = R / 'app/src/brand/marchio.generato.ts'
dest.write_text('// GENERATO da tools/genera-marchio.py: non modificare. Lettermark Blu pieno + wordmark Primario (scelta del 11/10).\n'
                'export const MARCHIO = ' + json.dumps(out, separators=(',', ':')) + ' as const;\n')
print(dest, len(dest.read_text()), 'byte')
