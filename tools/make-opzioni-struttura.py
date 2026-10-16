#!/usr/bin/env python3
"""Genera app/dist-demo/opzioni-struttura.html: elenco delle funzioni e tre strutture a confronto (barra, Home, profilo) con schizzi.
Uso: python3 tools/make-opzioni-struttura.py   (le icone sono quelle dell'app: app/src/brand/icone/svg)"""
import base64, html, pathlib
RAD = pathlib.Path(__file__).resolve().parents[1]
SVG = RAD / 'app/src/brand/icone/svg'
def ico(n):
    p = SVG / f'{n}.svg'
    return base64.b64encode(p.read_bytes()).decode()
usate = set()
def I(n, cls='i'):
    usate.add(n)
    return f'<i class="{cls}" style="--m:var(--m-{n})"></i>'

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

HOME_I = ('house', 'Home')
def home_base(extra=''):
    return head('', marchio=True) + meter() + chip('Da migliorare') + cta() + extra

# ----- Opzione A: Studia | Allenati -----
TA = [HOME_I, ('book-open', 'Studia'), ('dumbbell', 'Allenati')]
A = {
 'nome': 'A · Studia e Allenati', 'tag': 'Contenuti da una parte, domande dall\'altra',
 'idea': 'Studia raccoglie ciò che si legge (lezioni, frasi, prontuario). Allenati raccoglie tutto ciò che fa domande (esercizi, simulazioni, sfide). Il profilo tiene i risultati.',
 'pro': 'Due verbi chiari, ognuno con una sola risposta alla domanda «che cosa faccio ora?». Simulazioni e sfide vicine ai tuoi esercizi.',
 'contro': 'Allenati è ricca: tre sezioni con selettore.',
 'ph': [
  phone('Home', home_base(sec('Prossima lezione') + card('book-open', 'Present Simple', '0/4') + sec('Simulazione') + card('clipboard-check', 'Nuova simulazione', 'Ultima 22/30', 'am') + sec('Andamento') + chart()), bar(TA, 0)),
  phone('Studia', head('Studia') + rows([('circle', 'Present Simple', '0/4', ''), ('lock-open', 'There is / are', '0/4', ''), ('circle', 'Quantificatori', '0/4', ''), ('circle', 'Domande', '0/4', '')]) + sec('Altro') + tiles([('languages', 'Frasi', 'vi'), ('notebook-text', 'Prontuario', 'az')]), bar(TA, 1)),
  phone('Allenati', head('Allenati') + seg([('dumbbell', 'Esercizi'), ('clipboard-check', 'Prove'), ('swords', 'Sfide')], 0) + cta('Intelligente') + tiles([('crosshair', 'Punti deboli', 'co'), ('zap', 'Blitz', 'am'), ('rotate-ccw', 'Richiamo', 'vi'), ('list-checks', 'Argomento', 'az')]), bar(TA, 2)),
 ],
 'dove': {'Misuratore, andamento, ▶': 'Home', 'Percorso e teoria': 'Studia', 'Frasi, Prontuario': 'Studia', 'Esercizi (5 modi), ripasso errori': 'Allenati · Esercizi', 'Simulazioni, storico, esito': 'Allenati · Prove', 'Sfide, amici, classifica': 'Allenati · Sfide', 'Progressi, obiettivi, badge': 'Profilo', 'Impostazioni, aiuto': 'Profilo'},
}
# ----- Opzione B: Percorso | Progressi -----
TB = [HOME_I, ('route', 'Percorso'), ('chart-column-increasing', 'Progressi')]
B = {
 'nome': 'B · Percorso e Progressi', 'tag': 'Quello che faccio / quanto sto migliorando',
 'idea': 'Percorso è l\'unico posto dove si fa qualcosa: lezioni, esercizi, prove e sfide, scelti con un selettore. Progressi misura tutto: statistiche, argomenti, calendario, obiettivi, badge. Il profilo diventa leggero.',
 'pro': 'Chiaro «fare» contro «misurare». Il profilo è corto: nome, impostazioni, aiuto.',
 'contro': 'Percorso contiene molte cose: il selettore a quattro voci è l\'elemento più carico.',
 'ph': [
  phone('Home', home_base(sec('Prossima lezione') + card('book-open', 'Present Simple', '0/4') + sec('Simulazione') + card('clipboard-check', 'Nuova simulazione', 'Ultima 22/30', 'am') + chart()), bar(TB, 0)),
  phone('Percorso', head('Percorso') + seg([('book-open', 'Lezioni'), ('dumbbell', 'Esercizi'), ('clipboard-check', 'Prove'), ('swords', 'Sfide')], 0) + rows([('circle', 'Present Simple', '0/4', ''), ('lock-open', 'There is / are', '0/4', ''), ('circle', 'Quantificatori', '0/4', '')]) + tiles([('languages', 'Frasi', 'vi'), ('notebook-text', 'Prontuario', 'az')]), bar(TB, 1)),
  phone('Progressi', head('Progressi') + seg([('layout-dashboard', 'Panoramica'), ('radar', 'Argomenti'), ('calendar-days', 'Calendario')], 0) + chart() + tiles([('goal', 'Obiettivi', 'co'), ('award', 'Badge', 'am')]), bar(TB, 2)),
 ],
 'dove': {'Misuratore, andamento, ▶': 'Home', 'Percorso e teoria': 'Percorso · Lezioni', 'Frasi, Prontuario': 'Percorso · Lezioni', 'Esercizi (5 modi), ripasso errori': 'Percorso · Esercizi', 'Simulazioni, storico, esito': 'Percorso · Prove', 'Sfide, amici, classifica': 'Percorso · Sfide', 'Progressi, obiettivi, badge': 'Progressi', 'Impostazioni, aiuto': 'Profilo'},
}
# ----- Opzione C: Home completa -----
TC = [HOME_I, ('dumbbell', 'Esercizi'), ('swords', 'Sfide')]
C = {
 'nome': 'C · Home completa', 'tag': 'La Home fa quasi tutto, le altre due sono specializzate',
 'idea': 'La Home mostra lezioni e simulazione per intero (prossime tre lezioni, ultimo punteggio), con «Tutte» che apre l\'elenco completo. Le altre due pagine sono gli esercizi liberi e le sfide.',
 'pro': 'Meno salti: dalla Home si studia, si fa una prova e si controlla l\'andamento.',
 'contro': 'La Home è lunga da scorrere; Percorso e Simulazioni sono pagine secondarie senza voce in barra.',
 'ph': [
  phone('Home', home_base(sec('Lezioni') + rows([('circle', 'Present Simple', '0/4', ''), ('lock-open', 'There is / are', '0/4', ''), ('circle', 'Quantificatori', '0/4', '')]) + sec('Simulazione') + card('clipboard-check', 'Nuova simulazione', 'Ultima 22/30', 'am') + chart()), bar(TC, 0)),
  phone('Esercizi', head('Esercizi') + cta('Intelligente') + tiles([('crosshair', 'Punti deboli', 'co'), ('zap', 'Blitz', 'am'), ('rotate-ccw', 'Richiamo', 'vi'), ('list-checks', 'Argomento', 'az'), ('languages', 'Frasi', 'vi'), ('notebook-text', 'Prontuario', 'az')]), bar(TC, 1)),
  phone('Sfide', head('Sfide') + seg([('calendar-check-2', 'Oggi'), ('users', 'Amici'), ('trophy', 'Classifica')], 0) + card('calendar-check-2', 'Sfida del giorno', '10 domande · 5 min', 'am') + card('swords', 'Duello', 'Invia un link', 'az'), bar(TC, 2)),
 ],
 'dove': {'Misuratore, andamento, ▶': 'Home', 'Percorso e teoria': 'Home · Lezioni › Tutte', 'Frasi, Prontuario': 'Esercizi', 'Esercizi (5 modi), ripasso errori': 'Esercizi', 'Simulazioni, storico, esito': 'Home · Simulazione › Tutte', 'Sfide, amici, classifica': 'Sfide', 'Progressi, obiettivi, badge': 'Profilo', 'Impostazioni, aiuto': 'Profilo'},
}
# ----- Profilo -----
P1 = phone('P1 · Hub a tessere', head('Profilo', ('settings',), back=True) + prof() + tiles([('chart-column-increasing', 'Progressi', 'az'), ('goal', 'Obiettivi', 'co'), ('award', 'Badge', 'am')], 3) + rows([('circle-question-mark', 'Aiuto', '', 'az'), ('info', 'Informazioni', '', 'az')]))
P2 = phone('P2 · Pagina unica', head('Profilo', ('settings',), back=True) + prof() + sec('Progressi') + chart() + sec('Obiettivi') + card('goal', 'Test il 12 giu', '30 min al giorno', 'co') + sec('Badge') + tiles([('award', '', 'am'), ('award', '', 'am'), ('award', '', 'am')], 3))
P3 = phone('P3 · Io e impostazioni', head('Profilo', back=True) + prof() + rows([('sun-moon', 'Tema', '', 'az'), ('volume-2', 'Suoni', '', 'az'), ('database', 'Dati', 'Esporta', 'az'), ('circle-question-mark', 'Aiuto', '', 'az'), ('info', 'Informazioni', '', 'az')]))
PROF = [(P1, 'Il profilo di oggi: tre tessere che aprono pagine, ingranaggio per le impostazioni.', 'Con le opzioni A e C.'),
        (P2, 'Tutto in una pagina che scorre: anteprima di progressi, obiettivi e badge, ognuno con «Tutti».', 'Con le opzioni A e C, se si vuole meno salti.'),
        (P3, 'Solo identità e impostazioni. Progressi, obiettivi e badge stanno nella pagina Progressi.', 'Con l\'opzione B.')]

A['prof'] = P1.replace('P1 · Hub a tessere', 'Profilo'); B['prof'] = P3.replace('P3 · Io e impostazioni', 'Profilo'); C['prof'] = P1.replace('P1 · Hub a tessere', 'Profilo')
# ---------- inventario ----------
INV = [
 ('Capire a che punto sono', 'target', [('Diagnostico di 10 domande', 'activity'), ('Probabilità stimata e come si calcola', 'gauge'), ('Andamento delle stime', 'chart-line'), ('Obiettivo: data del test e minuti', 'calendar-check')]),
 ('Imparare', 'book-open', [('Percorso di 31 lezioni (A1, A2, B1)', 'route'), ('Teoria con regole ed esempi', 'graduation-cap'), ('Frasi salvate e ricerca', 'languages'), ('Prontuario', 'notebook-text')]),
 ('Allenarsi', 'dumbbell', [('Esercizio intelligente', 'sparkles'), ('Punti deboli e ripasso errori', 'crosshair'), ('Blitz', 'zap'), ('Richiamo', 'rotate-ccw'), ('Per argomento', 'list-checks')]),
 ('Mettersi alla prova', 'clipboard-check', [('Simulazione: 30 domande, 15 min, soglia 25', 'clipboard-check'), ('Storico, dettaglio e correzioni complete', 'history'), ('Sfida del giorno', 'calendar-check-2'), ('Duello con link, amici e classifica locali', 'swords')]),
 ('Misurarmi', 'chart-column-increasing', [('Statistiche e accuratezza', 'chart-column-increasing'), ('Analisi per argomento', 'radar'), ('Calendario e attività', 'calendar-days'), ('Badge', 'award')]),
 ('Io e l\'app', 'user-round', [('Profilo: nome e avatar', 'user-round'), ('Tema, suoni, esporta e importa i dati', 'settings'), ('Domande frequenti e segnalazioni', 'circle-question-mark'), ('Termini, privacy, cookie, presentazione', 'file-text')]),
]
FUNZ = list(A['dove'].keys())

def inv_html():
    out = ''
    for t, i, voci in INV:
        out += f'<section class="grp"><h3>{I(i)}{t}<em>{len(voci)}</em></h3><ul>' + ''.join(f'<li>{I(vi, "i sm")}{v}</li>' for v, vi in voci) + '</ul></section>'
    return out

def opt_html(k, o):
    tab = ''.join(o['ph']) + o['prof']
    dove = ''.join(f'<tr><th>{f}</th><td>{o["dove"][f]}</td></tr>' for f in FUNZ)
    return f'''<article class="opt" id="o{k}"><header><h2>{o["nome"]}</h2><p class="tag">{o["tag"]}</p></header>
<p class="idea">{o["idea"]}</p>
<div class="strip">{tab}</div>
<div class="pc"><p><b>Pro</b>{o["pro"]}</p><p><b>Contro</b>{o["contro"]}</p></div>
<details><summary>Dove sta ogni funzione</summary><div class="tw"><table>{dove}</table></div></details></article>'''

def prof_html():
    return '<div class="strip">' + ''.join(p for p, _, _ in PROF) + '</div><ul class="pl">' + ''.join(f'<li><b>{p[0:0]}{["P1","P2","P3"][k]}</b> {d} <em>{u}</em></li>' for k, (p, d, u) in enumerate(PROF)) + '</ul>'

CORPO = f'''<main>
<header class="top"><p class="eye">AddiOFA · struttura</p><h1>Dove va ogni funzione</h1><p class="lead">L'app ha 6 gruppi di funzioni. Qui sotto tre modi di distribuirle tra Home, due pagine in barra e profilo. Ogni funzione sta in un solo posto.</p></header>
<section class="blk"><h2>Le funzioni dell'app</h2><div class="inv">{inv_html()}</div></section>
<section class="blk"><h2>Regola della Home</h2><p class="lead">La Home mostra lo stato e porta avanti: misuratore, ▶ Continua, prossima lezione, simulazione, andamento. Non contiene altre funzioni oltre a queste e non ripete le pagine.</p></section>
<nav class="tabs" aria-label="Opzioni">{''.join(f'<a href="#o{k}">{o["nome"]}</a>' for k, o in (('A', A), ('B', B), ('C', C)))}</nav>
{opt_html('A', A)}{opt_html('B', B)}{opt_html('C', C)}
<section class="blk" id="profilo"><h2>Il profilo</h2><p class="lead">Tre modi di organizzarlo. Il profilo si apre dall'icona in alto a destra in ogni pagina.</p>{prof_html()}</section>
</main>'''
mask = ''.join(f'--m-{n}:url("data:image/svg+xml;base64,{ico(n)}");' for n in sorted(usate))
CSS = pathlib.Path(__file__).with_suffix('.css').read_text().split('\n',2)[2]
HTML = f'''<title>Struttura di AddiOFA</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<meta name="claude:viewport-fit-sides" content="cover">
<style>:root{{{mask}}}
{CSS}</style>
{CORPO}'''
dest = RAD / 'app/dist-demo/opzioni-struttura.html'
dest.write_text(HTML)
print(dest, len(HTML) // 1024, 'KB', len(usate), 'icone')
