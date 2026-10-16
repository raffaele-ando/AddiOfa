#!/usr/bin/env python3
"""Genera app/dist-demo/dieci-strutture.html: dieci proposte per Home + due pagine di barra (il profilo è un hub a tessere; statistiche, obiettivi e badge stanno nel profilo).
Uso: python3 tools/make-opzioni-10.py"""
import base64, pathlib
RAD = pathlib.Path(__file__).resolve().parents[1]
SVG = RAD / 'app/src/brand/icone/svg'
usate = set()
def ico(n): return base64.b64encode((SVG / f'{n}.svg').read_bytes()).decode()
def I(n, cls='i'):
    usate.add(n); return f'<i class="{cls}" style="--m:var(--m-{n})"></i>'
# ---------- schizzi dei telefoni ----------
def head(t, dx=('user-round',), back=False, marchio=False):
    l = I('chevron-left', 'i sm') if back else ''
    nome = '<b class="mk">AddiOFA</b>' if marchio else f'<b>{t}</b>'
    return f'<div class="hd">{l}{nome}<span class="sp"></span>{"".join(f"<span class=ib>{I(x)}</span>" for x in dx)}</div>'
def meter(v='17%'): return f'<div class="meter"><div class="arc"></div><div class="v">{v}</div><small>probabilità stimata</small></div>'
def chip(t, i='trending-up'): return f'<div class="chip">{I(i)}<span>{t}</span></div>'
def cta(t='Continua'): return f'<div class="cta">{I("play")}<span>{t}</span><span class="sp"></span>{I("chevron-right")}</div>'
def card(i, t, s='', tono='az'): return f'<div class="card {tono}"><span class="ic">{I(i)}</span><span class="tx"><b>{t}</b><small>{s}</small></span>{I("chevron-right","i sm")}</div>'
def sec(t): return f'<div class="sec">{t}</div>'
def seg(items, on=0):
    return '<div class="seg">' + ''.join(f'<span class="{"on" if k==on else ""}">{I(i)}{t}</span>' for k, (i, t) in enumerate(items)) + '</div>'
def tiles(items, cols=2):
    return f'<div class="tiles c{cols}">' + ''.join(f'<div class="tile"><span class="ic {c}">{I(i)}</span><b>{t}</b></div>' for i, t, c in items) + '</div>'
def rows(items):
    return '<div class="rows">' + ''.join(f'<div class="row"><span class="st {c}">{I(i)}</span><b>{t}</b><span class="sp"></span><small>{r}</small></div>' for i, t, r, c in items) + '</div>'
def chart(): return '<div class="chart"><svg viewBox="0 0 160 50"><polyline points="6,40 40,34 74,26 108,22 150,10" fill="none" stroke="var(--az)" stroke-width="2.4" stroke-linecap="round"/><circle cx="150" cy="10" r="3.4" fill="var(--az)"/></svg></div>'
def prof():
    return '<div class="prof"><span class="av">S</span><span class="tx"><b>Studente</b><small>Livello A2 · 12 giorni</small></span></div>'
def bar(items, on):
    return '<div class="tb">' + ''.join(f'<span class="{"on" if k==on else ""}">{I(i)}<small>{t}</small></span>' for k, (i, t) in enumerate(items)) + '</div>'
def phone(titolo, corpo, tab=None):
    return f'<figure class="ph"><figcaption>{titolo}</figcaption><div class="scr"><div class="body">{corpo}</div>{tab or ""}</div></figure>'


# ---------- blocchi riusati ----------
LES = rows([('circle', 'Present Simple', '0/4', ''), ('lock-open', 'There is / are', '0/4', ''), ('circle', 'Quantificatori', '0/4', '')])
HIST = rows([('circle-x', '22/30', '9 ott', 'az'), ('circle-check', '26/30', '2 ott', 'az')])
SIMC = card('clipboard-check', 'Nuova simulazione', '30 domande · 15 min', 'am')
SFI = card('calendar-check-2', 'Sfida del giorno', '10 domande · 5 min', 'am') + card('swords', 'Duello', 'Invia un link', 'az')
MODI = cta('Intelligente') + tiles([('crosshair', 'Punti deboli', 'co'), ('zap', 'Blitz', 'am'), ('rotate-ccw', 'Richiamo', 'vi'), ('list-checks', 'Argomento', 'az')])
FP = tiles([('languages', 'Frasi', 'vi'), ('notebook-text', 'Prontuario', 'az')])
def home(extra=''): return head('', marchio=True) + meter() + chip('Da migliorare') + cta() + extra
HOME_S = sec('Prossima lezione') + card('book-open', 'Present Simple', '0/4') + sec('Simulazione') + card('clipboard-check', 'Nuova simulazione', 'Ultima 22/30', 'am') + sec('Andamento') + chart()
HOME_C = sec('Lezioni') + LES + sec('Simulazione') + card('clipboard-check', 'Nuova simulazione', 'Ultima 22/30', 'am') + chart()
def tabs(a, b): return [('house', 'Home'), a, b]

F = ['Diagnostico, probabilità, ▶', 'Percorso e teoria', 'Frasi', 'Prontuario', 'Esercizi e ripasso errori', 'Simulazioni', 'Sfide, amici, classifica']

# ogni proposta: nome, finalità, due pagine (icona, nome, corpo), dove sta cosa (per funzione: indice pagina 0=Home 1=A 2=B, testo), pro, contro
def mk(n, nome, fin, A, B, dove, pro, contro, home_cards=HOME_S, home_nota=None):
    return dict(n=n, nome=nome, fin=fin, A=A, B=B, dove=dove, pro=pro, contro=contro, home_cards=home_cards, home_nota=home_nota)
P = []
P.append(mk(1, 'Studia · Allenati', 'Per tipo di attività: ciò che si legge e ciò che fa domande.',
  ('book-open', 'Studia', head('Studia') + LES + sec('Altro') + FP),
  ('dumbbell', 'Allenati', head('Allenati') + seg([('dumbbell', 'Esercizi'), ('clipboard-check', 'Prove'), ('swords', 'Sfide')], 0) + MODI),
  [(1, 'Studia'), (1, 'Studia'), (1, 'Studia'), (2, 'Esercizi'), (2, 'Prove'), (2, 'Sfide')],
  'Due verbi chiari: leggo o rispondo. Simulazioni e sfide vicine agli esercizi.', 'Allenati ha tre sezioni con selettore.'))
P.append(mk(2, 'Percorso · Prove', 'Per scopo: costruire (guidato) e valutarmi (prove).',
  ('route', 'Percorso', head('Percorso') + seg([('book-open', 'Lezioni'), ('dumbbell', 'Esercizi')], 0) + LES + FP),
  ('clipboard-check', 'Prove', head('Prove') + seg([('clipboard-check', 'Simulazioni'), ('swords', 'Sfide')], 0) + SIMC + HIST),
  [(1, 'Percorso'), (1, 'Percorso'), (1, 'Percorso'), (1, 'Percorso · Esercizi'), (2, 'Prove'), (2, 'Prove · Sfide')],
  'Chiara la differenza tra imparare e misurarsi; ogni pagina ha un selettore da due voci.', 'Percorso contiene anche Frasi e Prontuario.'))
P.append(mk(3, 'Percorso · Libero', 'Per autonomia: seguo la strada guidata oppure scelgo io.',
  ('route', 'Percorso', head('Percorso') + cta('Continua') + LES + rows([('circle', 'Domande e risposte', '0/4', '')])),
  ('layout-dashboard', 'Libero', head('Libero') + tiles([('sparkles', 'Intelligente', 'az'), ('crosshair', 'Punti deboli', 'co'), ('zap', 'Blitz', 'am'), ('rotate-ccw', 'Richiamo', 'vi'), ('clipboard-check', 'Simulazione', 'am'), ('swords', 'Sfide', 'az'), ('languages', 'Frasi', 'vi'), ('notebook-text', 'Prontuario', 'az')])),
  [(1, 'Percorso'), (2, 'Libero'), (2, 'Libero'), (2, 'Libero'), (2, 'Libero'), (2, 'Libero')],
  'Chi vuole essere guidato ha una pagina lineare; chi sa cosa vuole ha tutto in una griglia.', 'Libero è una griglia di otto voci, senza gerarchia.'))
P.append(mk(4, 'Oggi · Libreria', 'Per tempo: cosa faccio oggi e dove consulto il materiale.',
  ('calendar-check-2', 'Oggi', head('Oggi') + seg([('calendar-check-2', 'Piano'), ('swords', 'Sfide')], 0) + MODI.replace('Argomento', 'Richiamo').replace('list-checks', 'rotate-ccw') + SIMC),
  ('library', 'Libreria', head('Libreria') + seg([('book-open', 'Lezioni'), ('languages', 'Frasi'), ('notebook-text', 'Prontuario')], 0) + LES),
  [(2, 'Libreria · Lezioni'), (2, 'Libreria'), (2, 'Libreria'), (1, 'Oggi'), (1, 'Oggi'), (1, 'Oggi · Sfide')],
  'La prima pagina risponde a «cosa faccio ora»; la seconda è un archivio ordinato.', 'Lezioni in Libreria: il percorso guidato perde peso. Esercizi per argomento solo dentro la lezione.',
  HOME_S))
P.append(mk(5, 'Rapido · Completo', 'Per tempo disponibile: cinque minuti oppure una sessione vera.',
  ('zap', 'Rapido', head('Rapido') + cta('Blitz 5 min') + tiles([('crosshair', 'Punti deboli', 'co'), ('rotate-ccw', 'Richiamo', 'vi'), ('calendar-check-2', 'Sfida', 'am'), ('languages', 'Frasi', 'vi')])),
  ('layers', 'Completo', head('Completo') + LES + SIMC + tiles([('list-checks', 'Argomento', 'az'), ('notebook-text', 'Prontuario', 'az')])),
  [(2, 'Completo'), (1, 'Rapido'), (2, 'Completo'), (1, 'Rapido (per argomento: Completo)'), (2, 'Completo'), (1, 'Rapido')],
  'Si sceglie in base ai minuti che ho. Perfetto per l\'uso da telefono in pausa.', 'Le funzioni sono divise per durata, non per argomento: Esercizi sta in due pagine.'))
P.append(mk(6, 'Costruisci · Verifica', 'Per fase: costruisco la conoscenza e poi la verifico.',
  ('pencil-ruler', 'Costruisci', head('Costruisci') + LES + tiles([('sparkles', 'Intelligente', 'az'), ('list-checks', 'Argomento', 'az'), ('languages', 'Frasi', 'vi'), ('notebook-text', 'Prontuario', 'az')])),
  ('list-checks', 'Verifica', head('Verifica') + SIMC + tiles([('crosshair', 'Punti deboli', 'co'), ('zap', 'Blitz', 'am'), ('rotate-ccw', 'Richiamo', 'vi'), ('swords', 'Sfide', 'az')])),
  [(1, 'Costruisci'), (1, 'Costruisci'), (1, 'Costruisci'), (1, 'Costruisci (2 modi) · Verifica (3)'), (2, 'Verifica'), (2, 'Verifica')],
  'Il percorso di preparazione è letto in due tempi, naturale per chi studia a ondate.', 'Esercizi divisi in due pagine; chi vuole fare solo esercizi deve scegliere dove cercarli.'))
P.append(mk(7, 'Lezioni · Simulazioni', 'Continuità con oggi: due pagine che già conosci.',
  ('book-open', 'Lezioni', head('Lezioni') + seg([('book-open', 'Percorso'), ('dumbbell', 'Esercizi')], 0) + LES + FP),
  ('clipboard-check', 'Simulazioni', head('Simulazioni') + seg([('clipboard-check', 'Prove'), ('swords', 'Sfide')], 0) + SIMC + HIST),
  [(1, 'Lezioni'), (1, 'Lezioni'), (1, 'Lezioni'), (1, 'Lezioni · Esercizi'), (2, 'Simulazioni'), (2, 'Simulazioni · Sfide')],
  'Nessuna sorpresa per chi usa l\'app: ora senza statistiche e profilo dentro.', 'Come la proposta 2 con nomi diversi: «Lezioni» contiene gli esercizi.'))
P.append(mk(8, 'Argomenti · Prove', 'Per argomento: ogni regola ha tutto il suo materiale.',
  ('layout-list', 'Argomenti', head('Argomenti') + seg([('layout-list', 'Regole'), ('languages', 'Frasi'), ('notebook-text', 'Prontuario')], 0) + rows([('circle', 'A1 · Present Simple', '0/4', ''), ('circle', 'A1 · There is / are', '0/4', ''), ('circle', 'A2 · Past Simple', '0/4', ''), ('circle', 'B1 · Conditionals', '0/4', '')])),
  ('clipboard-check', 'Prove', head('Prove') + cta('Intelligente') + tiles([('crosshair', 'Punti deboli', 'co'), ('zap', 'Blitz', 'am'), ('rotate-ccw', 'Richiamo', 'vi'), ('swords', 'Sfide', 'az')]) + SIMC),
  [(1, 'Argomenti'), (1, 'Argomenti'), (1, 'Argomenti'), (2, 'Prove (misti) · Argomenti (per regola)'), (2, 'Prove'), (2, 'Prove')],
  'Ogni argomento è un posto solo: teoria, esercizi, voce del prontuario. Prove è tutto ciò che mescola.', 'Più astratta per chi non conosce i nomi delle regole.'))
P.append(mk(9, 'Esercizi · Sfide (Home completa)', 'Per gerarchia: la Home fa il lavoro principale, le altre due sono specializzate.',
  ('dumbbell', 'Esercizi', head('Esercizi') + MODI + FP),
  ('swords', 'Sfide', head('Sfide') + seg([('calendar-check-2', 'Oggi'), ('users', 'Amici'), ('trophy', 'Classifica')], 0) + SFI),
  [(0, 'Home · Lezioni › Tutte'), (1, 'Esercizi'), (1, 'Esercizi'), (1, 'Esercizi'), (0, 'Home · Simulazione › Tutte'), (2, 'Sfide')],
  'Dalla Home si studia, si fa una prova e si vede l\'andamento. Meno salti.', 'La Home è lunga; Percorso e storico simulazioni sono pagine senza voce in barra.',
  HOME_C))
P.append(mk(10, 'Studio · Insieme', 'Per compagnia: da solo oppure con gli altri.',
  ('book-open', 'Studio', head('Studio') + seg([('book-open', 'Lezioni'), ('dumbbell', 'Esercizi'), ('clipboard-check', 'Prove')], 0) + LES + FP),
  ('users', 'Insieme', head('Insieme') + seg([('calendar-check-2', 'Oggi'), ('users', 'Amici'), ('trophy', 'Classifica')], 0) + SFI),
  [(1, 'Studio'), (1, 'Studio'), (1, 'Studio'), (1, 'Studio · Esercizi'), (1, 'Studio · Prove'), (2, 'Insieme')],
  'Separa lo studio personale dalla parte sociale: chi non vuole sfide non la incontra.', 'Studio è una pagina molto piena; Insieme ha pochi contenuti.'))

PAGE_COL = {0: 'h', 1: 'a', 2: 'b'}
def matrice():
    th = '<th></th>' + ''.join(f'<th><b>{p["n"]}</b><small>{p["nome"]}</small></th>' for p in P)
    righe = ''
    for k, f in enumerate(F):
        cel = ''
        for p in P:
            if k == 0: pg, t = 0, 'Home'
            else: pg, t = p['dove'][k - 1]
            cel += f'<td class="{PAGE_COL[pg]}">{t}</td>'
        righe += f'<tr><th>{f}</th>{cel}</tr>'
    righe += '<tr><th>Progressi, obiettivi, badge · Impostazioni, aiuto</th>' + '<td class="p">Profilo</td>' * 10 + '</tr>'
    return f'<div class="tw wide"><table class="mx"><thead><tr>{th}</tr></thead><tbody>{righe}</tbody></table></div>'

def sezione(p):
    A = p['A']; B = p['B']
    T = tabs((A[0], A[1]), (B[0], B[1]))
    ph = ''
    if p['home_cards'] is HOME_C: ph += phone('Home', home(p['home_cards']), bar(T, 0))
    ph += phone(A[1], A[2], bar(T, 1)) + phone(B[1], B[2], bar(T, 2))
    dove = ''.join(f'<li><span>{f}</span><b class="{PAGE_COL[pg]}">{t}</b></li>' for f, (pg, t) in zip(F[1:], p['dove']))
    return f'''<article class="opt" id="p{p["n"]}"><header><span class="num">{p["n"]}</span><div><h2>{p["nome"]}</h2><p class="tag">{p["fin"]}</p></div></header>
<div class="cols"><div class="strip">{ph}</div>
<div class="side"><ul class="dove">{dove}</ul><div class="pc"><p><b>Pro</b>{p["pro"]}</p><p><b>Contro</b>{p["contro"]}</p></div></div></div></article>'''

HOME_PH = phone('Home (uguale nelle proposte 1-8 e 10)', home(HOME_S), bar(tabs(('book-open', 'A'), ('dumbbell', 'B')), 0))
PROF_PH = phone('Profilo (scelto)', head('Profilo', ('settings',), back=True) + prof() + tiles([('chart-column-increasing', 'Progressi', 'az'), ('goal', 'Obiettivi', 'co'), ('award', 'Badge', 'am')], 3) + rows([('circle-question-mark', 'Aiuto', '', 'az'), ('info', 'Informazioni', '', 'az')]))

CORPO = f'''<main>
<header class="top"><p class="eye">AddiOFA · struttura</p><h1>Dieci strutture per la barra</h1>
<p class="lead">Home più due pagine. Ho tenuto fuori dalla barra le statistiche: la Home mostra già come cambi (misuratore e andamento) e il dettaglio, con obiettivi e badge, sta nel profilo, a tessere.</p></header>
<section class="blk intro"><div class="strip">{HOME_PH}{PROF_PH}</div>
<div class="regole"><h2>Regole comuni</h2><ul>
<li><b>Home</b>: misuratore, ▶ Continua, prossima lezione, simulazione, andamento. Nient'altro e niente che ripeta le pagine.</li>
<li><b>Profilo</b> (icona in alto a destra, in ogni pagina): avatar e livello, Progressi, Obiettivi, Badge, Aiuto, Informazioni; ingranaggio per le impostazioni.</li>
<li><b>Una funzione, un posto</b>: nessuna compare in due pagine.</li></ul></div></section>
<section class="blk"><h2>Tutte le proposte a colpo d'occhio</h2><p class="lead">Dove finisce ogni funzione. Verde = Home, blu = prima pagina, ambra = seconda pagina.</p>{matrice()}</section>
<nav class="tabs" aria-label="Proposte">{''.join(f'<a href="#p{p["n"]}">{p["n"]}</a>' for p in P)}</nav>
{''.join(sezione(p) for p in P)}
</main>'''
mask = ''.join(f'--m-{n}:url("data:image/svg+xml;base64,{ico(n)}");' for n in sorted(usate))
CSS = (RAD / 'tools/make-opzioni-struttura.css').read_text().split('\n', 2)[2] + '''
.top{display:flex;flex-direction:column}.intro{display:grid;gap:20px;grid-template-columns:minmax(0,auto) minmax(260px,1fr);align-items:start}
@media (max-width:760px){.intro{grid-template-columns:1fr}}
.regole{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px}.regole h2{font-size:18px}.regole ul{margin:10px 0 0;padding-left:18px;display:grid;gap:8px;font-size:14px}
.opt header{flex-direction:row;gap:14px;align-items:center}.num{flex:none;width:42px;height:42px;border-radius:14px;background:var(--az-t);color:var(--az-d);display:grid;place-items:center;font-weight:800;font-size:20px}
.cols{display:grid;grid-template-columns:minmax(0,auto) minmax(250px,1fr);gap:20px;align-items:start}@media (max-width:900px){.cols{grid-template-columns:1fr}}
.side{display:flex;flex-direction:column;gap:12px;min-width:0}
.dove{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}.dove li{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid var(--line);font-size:13.5px}.dove li span{color:var(--mut)}.dove b{text-align:right}
.dove b.a,.mx td.a{color:var(--az-d)}.dove b.b,.mx td.b{color:var(--am)}.dove b.h,.mx td.h{color:var(--gr)}
.wide{border:1px solid var(--line);border-radius:14px;background:var(--card)}
.mx{min-width:980px;font-size:12px}.mx th,.mx td{padding:8px 8px;vertical-align:top}.mx thead th{position:sticky;top:0;background:var(--card);font-weight:700;color:var(--fg);width:auto}.mx thead th b{display:block;font-size:15px;color:var(--az-d)}.mx thead th small{display:block;font-weight:500;color:var(--mut);font-size:10.5px}
.mx tbody th{width:190px;font-size:12.5px;color:var(--fg)}.mx td{font-weight:700}.mx td.a{background:var(--az-t)}.mx td.b{background:var(--am-t)}.mx td.h{background:var(--gr-t)}.mx td.p{color:var(--vi);background:var(--vi-t)}
.tabs a{min-width:38px;text-align:center}
'''
HTML = f'''<title>Dieci strutture della barra</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<meta name="claude:viewport-fit-sides" content="cover">
<style>:root{{{mask}}}
{CSS}</style>
{CORPO}'''
dest = RAD / 'app/dist-demo/dieci-strutture.html'
dest.write_text(HTML)
print(dest, len(HTML) // 1024, 'KB', len(usate), 'icone')
