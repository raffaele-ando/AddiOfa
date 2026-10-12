#!/usr/bin/env python3
"""Genera app/src/brand/marchio.generato.ts dal wordmark con il lettermark dentro (grafica/brand/logo/).
Scelta dell'utente (12/10): il lettermark (A piena con la stella a base piatta) inserito nel wordmark come prima A, tutto MONOCOLORE.
Uso (dalla radice): python3 tools/genera-marchio.py   # serve Chromium (Playwright) solo per misurare gli ingombri."""
import json, re, pathlib
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parent.parent
SRC = R / 'grafica/brand/logo/wordmark-lettermark-o-semplice.svg'
svg = SRC.read_text()
vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
trasl = [float(x) for x in re.findall(r'translate\(([-\d. ]+)\)', svg)[0].split()]
trasl2 = [float(x) for x in re.findall(r'translate\(([-\d. ]+)\)', svg)[1].split()]
t = [trasl[0] + trasl2[0], trasl[1] + trasl2[1]]
paths = []
for m in re.finditer(r'<path id="([^"]+)" d="([^"]+)"([^>]*)/>', svg):
    paths.append({'id': m.group(1), 'd': m.group(2), 'eo': 'evenodd' in m.group(3)})
assert any(p['id'] == 'lettermark' for p in paths)

# ingombro del solo lettermark (per l'uso da solo)
html = f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><path id="l" d="{[p for p in paths if p["id"] == "lettermark"][0]["d"]}"/></svg>'
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium'); pg = b.new_page(); pg.set_content(html)
    bl = pg.evaluate("(()=>{const r=document.getElementById('l').getBBox();return [r.x,r.y,r.width,r.height]})()")
    b.close()
f = lambda x: round(x, 2)
out = {
  'parola': {'vb': [6.0, 6.0, f(vb[2] - 12), f(vb[3] - 12)], 'trasl': [f(t[0]), f(t[1])], 'percorsi': paths},
  'lettermark': {'vb': [f(bl[0] + t[0]), f(bl[1] + t[1]), f(bl[2]), f(bl[3])]},
}
dest = R / 'app/src/brand/marchio.generato.ts'
dest.write_text('// GENERATO da tools/genera-marchio.py: non modificare. Wordmark con il lettermark come prima A, monocolore.\n'
                'export const MARCHIO = ' + json.dumps(out, separators=(',', ':'), ensure_ascii=False) + ' as const;\n')
print(dest, len(dest.read_text()), 'byte')
