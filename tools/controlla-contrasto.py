#!/usr/bin/env python3
"""Controlla il contrasto del testo nelle schermate della demo (Playwright + Chromium).

Per ogni elemento con testo visibile calcola il rapporto di contrasto WCAG tra il colore del testo e lo sfondo
(il primo sfondo opaco tra gli antenati, componendo i colori semitrasparenti; per i gradienti vale il caso peggiore
tra le tinte). Stampa gli elementi sotto 4,5:1 (3:1 se il testo è >= 24 px, o >= 18,66 px in grassetto):
selettore, testo, rapporto, colori.

Uso (dalla radice del repository, dopo `npm run build:demo` in app/):
  python3 tools/controlla-contrasto.py                      # 390 px, chiaro e scuro, tutte le schermate
  python3 tools/controlla-contrasto.py --larghezza 1280 --altezza 800 --schema dark
  python3 tools/controlla-contrasto.py --schermate home,lezioni --foto /tmp/foto
  python3 tools/controlla-contrasto.py --pagina file:///.../altra.html --solo-pagina   # una sola pagina, senza il percorso della demo
Opzioni: --risposte file.json  (testo domanda -> testo risposta giusta, per avere anche risposte esatte; senza, si tocca la prima opzione)

Esce con codice 1 se resta qualche violazione. Esclusi: controlli disabilitati, elementi con opacità < 0,5 (stati "spenti"
voluti), testo nascosto (sr-only) o fuori pagina (span di misura di Recharts), icone e SVG (nessun <text>). Falsi positivi noti: vedi docs/lavoro/note-DARK.md.
"""
import argparse, asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

RADICE = Path(__file__).resolve().parent.parent
ARTIFACT = RADICE / 'app' / 'dist-demo' / 'artifact.html'
CHROMIUM = '/opt/pw-browsers/chromium'

JS = r"""
() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const norm = (css) => {           // qualunque sintassi CSS -> [r,g,b,a(0-1)]; null se non è un colore
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#010203'; cx.fillStyle = css;
    if (cx.fillStyle === '#010203' && !/^#010203$/i.test(css)) return null;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255];
  };
  const NERO = [0, 0, 0, 1];
  const argomenti = (s) => {        // argomenti al livello più esterno della prima funzione
    const i = s.indexOf('('); const out = []; let prof = 0, cur = '';
    for (let k = i + 1; k < s.length; k++) {
      const ch = s[k];
      if (ch === '(') prof++;
      if (ch === ')') { if (prof === 0) break; prof--; }
      if (ch === ',' && prof === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const coloriGradiente = (img) => {
    const out = [];
    for (const arg of argomenti(img)) {
      const senza = arg.replace(/\s+-?[\d.]+(%|px|em|rem)?\s*$/, '').replace(/\s+-?[\d.]+(%|px|em|rem)\s*$/, '');
      const c = norm(senza) || norm(arg);
      if (c) out.push(c);
    }
    return out;
  };
  const sopra = (f, b) => { const a = f[3]; return [f[0]*a + b[0]*(1-a), f[1]*a + b[1]*(1-a), f[2]*a + b[2]*(1-a), 1]; };
  const lum = (c) => { const t = c.slice(0,3).map(v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }); return 0.2126*t[0] + 0.7152*t[1] + 0.0722*t[2]; };
  const rapporto = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
  const sel = (el) => {
    const out = []; let e = el;
    for (let i = 0; e && e.nodeType === 1 && i < 4; i++, e = e.parentElement) {
      let s = e.tagName.toLowerCase();
      if (e.id) s += '#' + e.id;
      else if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.').replace(/[^\w.\-\[\]#:/]/g, '');
      out.unshift(s);
    }
    return out.join(' > ');
  };
  // sfondi possibili di un elemento: dalla radice in giù si compongono i colori (con più candidati se c'è un gradiente)
  const sfondi = (el) => {
    const catena = []; for (let e = el; e; e = e.parentElement) catena.unshift(e);
    let cand = [[255, 255, 255, 1]];
    for (const e of catena) {
      const cs = getComputedStyle(e);
      const bg = norm(cs.backgroundColor) || NERO;
      if (bg[3] > 0) cand = cand.map(c => sopra(bg, c));
      const img = cs.backgroundImage;
      if (img && img !== 'none' && /gradient/.test(img)) {
        const stops = coloriGradiente(img);
        if (stops.length) {
          const nuovi = [];
          for (const c of cand) for (const st of stops) nuovi.push(sopra(st, c));
          const visti = new Set(); cand = nuovi.filter(c => { const k = c.map(Math.round).join(); if (visti.has(k)) return false; visti.add(k); return true; }).slice(0, 12);
        }
      }
    }
    return cand;
  };
  const opacita = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
  const out = [];
  const visti = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const controlla = (el, testo, fgCss, esteso) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (r.right < -500 || r.bottom < -500 || r.left > innerWidth + 5000) return; // fuori pagina (es. span di misura di Recharts)
    const op = opacita(el);
    if (op < 0.5) return;
    if (el.closest('[disabled], [aria-disabled="true"], svg, [aria-hidden="true"] svg')) return;
    if (el.closest('.sr-only')) return;
    const fg0 = norm(fgCss);
    if (!fg0 || fg0[3] === 0) return;
    const bgs = sfondi(el);
    let peggio = null;
    for (const bg of bgs) {
      const fg = sopra([fg0[0], fg0[1], fg0[2], fg0[3] * op], bg);
      const rr = rapporto(fg, bg);
      if (!peggio || rr < peggio.r) peggio = { r: rr, fg, bg };
    }
    const px = parseFloat(cs.fontSize), peso = parseInt(cs.fontWeight) || 400;
    const grande = px >= 24 || (px >= 18.66 && peso >= 700);
    const soglia = grande ? 3 : 4.5;
    if (peggio.r < soglia - 0.005) {
      const h = (c) => '#' + c.slice(0,3).map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
      out.push({ sel: sel(el), testo: testo.trim().replace(/\s+/g, ' ').slice(0, 48), r: Math.round(peggio.r * 100) / 100, soglia, fg: h(peggio.fg), bg: h(peggio.bg), px, peso, y: Math.round(r.top + scrollY) });
    }
  };
  while (walker.nextNode()) {
    const n = walker.currentNode; const t = n.nodeValue;
    if (!t || !t.trim()) continue;
    const el = n.parentElement; if (!el || visti.has(el)) continue;
    if (['SCRIPT','STYLE','NOSCRIPT','OPTION'].includes(el.tagName)) continue;
    visti.add(el);
    controlla(el, t, getComputedStyle(el).color);
  }
  // segnaposto dei campi di testo
  for (const el of document.querySelectorAll('input[placeholder], textarea[placeholder]')) {
    const ph = getComputedStyle(el, '::placeholder');
    controlla(el, 'placeholder: ' + el.getAttribute('placeholder'), ph.color);
  }
  return out;
}
"""


async def controlla(page, nome, schema, larghezza, risultati, foto=None):
    """Controlla la pagina com'è adesso. Aggiunge a `risultati` le violazioni e stampa un riepilogo."""
    await page.wait_for_timeout(250)
    viol = await page.evaluate(JS)
    scroll = await page.evaluate('document.documentElement.scrollWidth - window.innerWidth')
    if foto:
        Path(foto).mkdir(parents=True, exist_ok=True)
        await page.screenshot(path=f'{foto}/{larghezza}-{schema}-{nome}.png')
    stato = 'ok' if not viol else f'{len(viol)} violazioni'
    print(f'[{larghezza} {schema}] {nome}: {stato}' + (f' (overflow orizzontale {scroll}px)' if scroll > 0 else ''))
    gruppi = {}
    for v in viol:
        k = (v['fg'], v['bg'], v['px'], v['peso'], re.sub(r'#[\w\-]+', '', v['sel']))
        gruppi.setdefault(k, []).append(v)
        risultati.append((schema, nome, v))
    for k, lista in gruppi.items():
        v = lista[0]
        molti = f'  x{len(lista)}' if len(lista) > 1 else ''
        print(f"    {v['r']:>5} < {v['soglia']}  {v['fg']} su {v['bg']}  {v['px']:.0f}px/{v['peso']}  «{v['testo']}»  {v['sel']}{molti}")
    return viol


async def percorso(page, nome_schema, larghezza, risposte, foto, risultati, quali):
    """Porta la demo attraverso le schermate principali e controlla ciascuna."""
    def voluta(n): return quali is None or n in quali

    async def c(n):
        if voluta(n): await controlla(page, n, nome_schema, larghezza, risultati, foto)

    async def clic(nome, nth=0, t=6000):
        await page.get_by_role('button', name=re.compile(nome)).nth(nth).click(timeout=t)
        await page.wait_for_timeout(450)

    async def esiste(nome):
        return await page.get_by_role('button', name=re.compile(nome)).count() > 0

    async def ricarica_e_vai(scheda):
        """Ricarica (si torna alla home con i dati salvati) e apre una scheda della barra in basso."""
        await page.reload(); await page.wait_for_timeout(1500)
        await clic(f'^{scheda}$')

    async def rispondi(selettore, quante, giuste, finisci):
        for i in range(quante):
            prompt = await page.locator('h2').first.inner_text()
            buona = risposte.get(prompt)
            opts = page.locator(selettore); n = await opts.count(); scelta = None
            for k in range(n):
                t = (await opts.nth(k).inner_text()).split('\n', 1)[-1].strip()
                if buona and ((t == buona) == (i < giuste)) and scelta is None: scelta = opts.nth(k)
            if scelta is None: scelta = opts.nth(0 if i < giuste else min(1, n - 1))
            await scelta.click(timeout=5000); await page.wait_for_timeout(150)
            if finisci == 'auto' and i < quante - 1:
                await page.get_by_role('button', name='Domanda successiva').click(timeout=5000)
            if finisci == 'avanti':
                await page.locator('button:has-text("Avanti"), button:has-text("Vedi il risultato")').last.click(timeout=5000)
            await page.wait_for_timeout(200)

    OPZ_SIM = ', '.join(f'button:has(span:text-is("{l}"))' for l in 'ABCDE')

    await page.wait_for_timeout(1200)
    await c('landing')
    # diagnostico
    await clic('^Fai il diagnostico'); await c('diagnostico-intro')
    await clic('^Inizia')
    await clic('^No$'); await clic('^Avanti'); await clic('^Sì$'); await clic('^Avanti')
    await c('diagnostico-pronto')
    await c('diagnostico-quiz')
    await rispondi('h2 + div button', 10, 7, 'avanti')
    await page.wait_for_timeout(800)
    visto = False
    for _ in range(10):
        if await page.locator('nav[aria-label="Sezioni"]').count(): break
        if not visto and await page.get_by_text('Probabilità stimata').count():
            visto = True; await c('diagnostico-risultato')
        for passo in ('Risultato', 'Avanti', 'Continua', 'Salta'):
            if await esiste('^' + passo):
                if passo == 'Vedi il risultato': await c('diagnostico-calcolo')
                await clic('^' + passo); await page.wait_for_timeout(700); break
        else:
            await page.wait_for_timeout(500)
    await page.wait_for_timeout(600)
    # home e foglio della stima
    await c('home')
    try:
        await page.get_by_role('button', name='Come è calcolata la stima').first.click(timeout=2500)
        await page.wait_for_timeout(500); await c('foglio-stima')
        await page.keyboard.press('Escape'); await page.wait_for_timeout(300)
        if await page.locator('[role=dialog]').count():
            await page.locator('[role=dialog] button').last.click(); await page.wait_for_timeout(300)
    except Exception as e:
        print('  (foglio stima non raggiunto:', str(e)[:80], ')')
    # Lezioni e Impostazioni
    await clic('^Lezioni$'); await c('lezioni')
    await clic('^Home$')
    await page.get_by_role('button', name='Impostazioni e profilo').click(timeout=4000); await page.wait_for_timeout(600)
    await c('impostazioni')
    for t in ('Termini', 'Condizioni', 'Privacy'):
        if await esiste(t):
            await clic(t); await page.wait_for_timeout(500); await c('legale'); break
    # simulazione
    await ricarica_e_vai('Simulazioni'); await c('simulazione-scelta')
    await clic('^Inizia'); await page.wait_for_timeout(900); await c('simulazione-domanda')
    await page.locator(OPZ_SIM).first.click(); await page.wait_for_timeout(200)
    await page.get_by_role('button', name=re.compile('Esci dalla simulazione')).click(timeout=3000); await page.wait_for_timeout(400)
    await c('dialogo-conferma')
    if await page.locator('[role=dialog]').count():
        await page.locator('[role=dialog] button').first.click(); await page.wait_for_timeout(300)
    await rispondi(OPZ_SIM, 30, 22, 'auto')
    cons = page.locator('button:has-text("Consegna")')
    if await cons.count(): await cons.first.click(); await page.wait_for_timeout(500)
    await c('dialogo-consegna')
    if await page.locator('[role=dialog]').count(): await page.locator('[role=dialog] button').last.click()
    await page.wait_for_timeout(1800); await c('simulazione-esito')
    for nome_btn in ('Rivedi', 'orrezion', 'Vedi le risposte'):
        if await page.get_by_role('button', name=re.compile(nome_btn)).count():
            await page.get_by_role('button', name=re.compile(nome_btn)).first.click(); await page.wait_for_timeout(700)
            await c('correzioni'); break
    # Progressi, Teoria, Esercizi, Prontuario
    for voce, nome in (('^Progressi', 'progressi'), ('^Teoria', 'teoria'), ('^Prontuario', 'prontuario'), ('^Esercizi mirati', 'esercizi')):
        await ricarica_e_vai('Lezioni')
        await page.get_by_role('button', name=re.compile(voce)).first.click(timeout=4000); await page.wait_for_timeout(1000)
        await c(nome)
        if nome == 'teoria':
            try:
                await page.get_by_role('button').filter(has_text=re.compile('Present|Past|Articles|Modal|Conditional', re.I)).first.click(timeout=3000)
                await page.wait_for_timeout(600); await c('teoria-scheda')
            except Exception as e: print('  (scheda di teoria non aperta)')
        if nome == 'progressi':
            await page.evaluate('document.querySelector("main, .overflow-y-auto")?.scrollTo(0, 99999)'); await c('progressi-fondo')
        if nome == 'esercizi':
            for modo in ('Studio intelligente', 'Punti deboli', 'Ripasso'):
                if await page.get_by_role('button', name=re.compile(modo)).count():
                    await page.get_by_role('button', name=re.compile(modo)).first.click(); break
            await page.wait_for_timeout(1500); await c('esercizio-domanda')
            for esito in ('giusta', 'sbagliata'):
                opts = page.locator('h2 ~ div button, main button:has(span:text-is("A"))')
                prompt = await page.locator('h2').first.inner_text()
                buona = risposte.get(prompt); n = await opts.count(); scelta = None
                for k in range(n):
                    t = (await opts.nth(k).inner_text()).split('\n', 1)[-1].strip()
                    if buona and ((t == buona) == (esito == 'giusta')) and scelta is None: scelta = opts.nth(k)
                if scelta is None and n: scelta = opts.nth(0 if esito == 'giusta' else min(1, n - 1))
                if scelta is None: break
                await scelta.click(timeout=3000); await page.wait_for_timeout(200)
                if await esiste('^Sicuro'): await clic('^Sicuro')
                await page.wait_for_timeout(500); await c('esercizio-' + esito)
                if await esiste('^Avanti|^Riprova'): await clic('^Avanti|^Riprova')
    # risultato del diagnostico visto in schermata di verifica livello non ripetuta: finito


async def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--larghezza', type=int, default=390)
    ap.add_argument('--altezza', type=int, default=858)
    ap.add_argument('--schema', default='both', choices=['light', 'dark', 'both'])
    ap.add_argument('--pagina', default='file://' + str(ARTIFACT), help='pagina da aprire (default: la demo costruita)')
    ap.add_argument('--solo-pagina', action='store_true', help='controlla solo la pagina aperta, senza percorrere la demo')
    ap.add_argument('--schermate', default='', help='elenco separato da virgole (default: tutte)')
    ap.add_argument('--foto', default='', help='cartella in cui salvare uno screenshot per schermata')
    ap.add_argument('--risposte', default='', help='JSON {testo domanda: testo risposta giusta}')
    a = ap.parse_args()
    risposte = json.load(open(a.risposte)) if a.risposte else {}
    quali = set(s for s in a.schermate.split(',') if s) or None
    schemi = ['light', 'dark'] if a.schema == 'both' else [a.schema]
    risultati = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROMIUM)
        for schema in schemi:
            ctx = await b.new_context(viewport={'width': a.larghezza, 'height': a.altezza}, color_scheme=schema)
            page = await ctx.new_page(); errori = []
            page.on('console', lambda m: errori.append(f'{m.type}: {m.text[:140]}') if m.type in ('error', 'warning') else None)
            page.on('pageerror', lambda e: errori.append('pageerror: ' + str(e)[:160]))
            await page.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('file:', 'data:', 'blob:', 'http://localhost', 'http://127.0.0.1')) else r.abort())
            await page.goto(a.pagina); await page.wait_for_timeout(1200)
            if a.solo_pagina: await controlla(page, 'pagina', schema, a.larghezza, risultati, a.foto or None)
            else:
                try: await percorso(page, schema, a.larghezza, risposte, a.foto or None, risultati, quali)
                except Exception as e:
                    print(f'  ATTENZIONE: percorso interrotto ({schema}): {str(e)[:200]}')
                    await controlla(page, 'interrotta', schema, a.larghezza, risultati, a.foto or None)
            print(f'[{a.larghezza} {schema}] console: {len(errori)} errori/avvisi' + (' ' + '; '.join(errori[:3]) if errori else ''))
            await ctx.close()
        await b.close()
    print(f'\nTotale violazioni: {len(risultati)}')
    sys.exit(1 if risultati else 0)


if __name__ == '__main__':
    asyncio.run(main())
