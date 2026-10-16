#!/usr/bin/env python3
"""Controllo «niente frasi»: apre le viste dell'app a 400 px e segnala ogni blocco di testo visibile di 6 o più parole
(le spiegazioni non devono stare in pagina: si usano icone, etichette di 1-3 parole, numeri; il resto sta dietro il pulsante «i»).
Esenti: dentro `[data-testo-ok]` (contenuti: domande, teoria, risposte della FAQ, pagine legali, testi di marketing della landing) e dentro `[role=dialog]`.
Uso: python3 tools/controlla-testo.py --base http://localhost:5201 [--viste home,lezioni,simulazioni,profilo,...] [--max 5]
Le viste «home», «lezioni», «simulazioni» sono le tre schede (si aprono con la barra in basso); le altre sono id di schermate extra (?vista=id).
Esce con 1 se trova blocchi lunghi."""
import argparse, json, re, sys
from playwright.sync_api import sync_playwright

STATO = {"history": [{"id": "x", "date": 1760000000000, "score": 22, "passed": False, "timeSpentSeconds": 600}],
         "stats": {}, "streak": 0, "lastActiveDate": None,
         "onboarding": {"completedAt": 1760000000000, "hasCertification": False, "hasOfa": "yes", "diagnosticCorrect": 7, "diagnosticTotal": 10, "passProbability": 0.4}}
JS = r"""(maxParole) => {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const visto = new Set();
  while (w.nextNode()) {
    const n = w.currentNode; const t = n.textContent.replace(/\s+/g, ' ').trim();
    if (!t) continue; const el = n.parentElement; if (!el) continue;
    if (el.closest('[data-testo-ok],[role=dialog],script,style,noscript')) continue;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
    // testo del blocco: il paragrafo/elemento di riga intero, non il singolo nodo
    const blocco = el.closest('p,li,h1,h2,h3,h4,button,a,label,span,div') || el;
    if (visto.has(blocco)) continue; visto.add(blocco);
    const txt = (blocco.innerText || t).replace(/\s+/g, ' ').trim();
    const parole = txt.split(' ').filter(x => /[A-Za-zÀ-ÿ]/.test(x)).length;
    if (parole > maxParole && blocco.children.length < 4) out.push([parole, txt.slice(0, 140)]);
  }
  return out;
}"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True); ap.add_argument('--viste', default='home,lezioni,simulazioni,profilo')
    ap.add_argument('--max', type=int, default=5); ap.add_argument('--scuro', action='store_true')
    a = ap.parse_args(); tot = 0
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        c = b.new_context(viewport={'width': 400, 'height': 860}, color_scheme='dark' if a.scuro else 'light'); pg = c.new_page()
        pg.goto(a.base + '/'); pg.evaluate("s=>localStorage.setItem('ofa_polimi_app_state',s)", json.dumps(STATO))
        for v in [x.strip() for x in a.viste.split(',') if x.strip()]:
            if v in ('home', 'lezioni', 'simulazioni'):
                pg.goto(a.base + '/'); pg.wait_for_timeout(900)
                if v != 'home': pg.get_by_role('button', name=re.compile('^' + v.capitalize())).last.click(); pg.wait_for_timeout(700)
            else:
                pg.goto(f'{a.base}/?vista={v}'); pg.wait_for_timeout(900)
            righe = pg.evaluate(JS, a.max)
            print(f'[{v}] {len(righe)} blocchi con più di {a.max} parole')
            for n, t in righe: print(f'   {n:3d}  {t}')
            tot += len(righe)
        b.close()
    print(f'Totale: {tot}'); sys.exit(1 if tot else 0)

if __name__ == '__main__': main()
