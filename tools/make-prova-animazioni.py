#!/usr/bin/env python3
"""Costruisce app/dist-demo/prova-animazioni.html: pagina unica con le illustrazioni animate (SVG inline, CSS inline, nessuna risorsa esterna).
Legge gli SVG da app/src/brand/essenziali/disegni/kit-blu/illustrazioni/ e i CSS da app/src/brand/animazioni/.
Uso (dalla radice): python3 tools/make-prova-animazioni.py
Gli id di ogni SVG vengono prefissati con `<nome>--` (gli id sono unici per documento e più illustrazioni condividono nomi come `ombra`,
`arco-luce`, `sfuma-ombra`): i CSS scelgono i pezzi con [id$="--<id>"] dentro il wrapper `.anim-<nome>`.
Il programma `prefissa_id` qui sotto è la stessa operazione che farà il componente IllustrazioneAnimata."""
import re, sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
SVG_DIR = RADICE / 'app/src/brand/essenziali/disegni/kit-blu/illustrazioni'
CSS_DIR = RADICE / 'app/src/brand/animazioni'
USCITA = RADICE / 'app/dist-demo/prova-animazioni.html'

# (nome, titolo, cosa succede)
SCHEDE = [
    ('studio-inglese', 'Studio dell’inglese', 'Il libro giallo sale, il blu gli si posa sopra, le righe delle pagine si tracciano e la bandiera arriva dall’alto.'),
    ('quiz-test', 'Quiz e test', 'I fogli entrano, le tre risposte scorrono da sinistra e la spunta bianca si traccia per ultima.'),
    ('risultato-probabilita', 'Risultato e probabilità', 'L’arco si carica da sinistra con il cursore sulla punta, poi compare la percentuale.'),
    ('successo', 'Successo', 'La coppa si compone dal basso, i manici si tracciano, la stella compare e i raggi si accendono.'),
    ('celebrazione', 'Celebrazione', 'I coriandoli escono dalla bocca del cono e si distendono ognuno al suo posto.'),
    ('mancato-superamento', 'Mancato superamento', 'Il documento compare, le righe si tracciano e il distintivo rosso si posa con la croce, senza festa.'),
    ('progressi-statistiche', 'Progressi e statistiche', 'Le quattro barre crescono dalla base una dopo l’altra.'),
    ('piano-studi-bloccato', 'Piano di studi bloccato', 'Le caselle del calendario si accendono, il lucchetto arriva aperto e l’arco scende a chiuderlo.'),
    ('superamento', 'Superamento', 'I fogli entrano, le righe si tracciano e il distintivo verde si posa; la spunta si traccia per ultima.'),
    ('suggerimenti-consigli', 'Suggerimenti e consigli', 'La lampadina compare spenta, si accende, il filamento si traccia e i cinque raggi scattano uno dopo l\u2019altro.'),
    ('attesa-caricamento', 'Attesa e caricamento', 'La clessidra si capovolge e la sabbia comincia a scendere: sopra cala, sotto cresce.'),
]


def prefissa_id(svg: str, prefisso: str) -> str:
    """Prefissa ogni id e ogni suo riferimento (url(#..), href=\"#..\") con `prefisso--`."""
    ids = set(re.findall(r'\bid="([^"]+)"', svg))
    def sost_id(m): return f'id="{prefisso}--{m.group(1)}"'
    svg = re.sub(r'\bid="([^"]+)"', sost_id, svg)
    def sost_rif(m):
        return m.group(0) if m.group(2) not in ids else f'{m.group(1)}#{prefisso}--{m.group(2)}{m.group(3)}'
    svg = re.sub(r'(url\()#([^)\s]+)(\))', sost_rif, svg)
    svg = re.sub(r'(href=")#([^"]+)(")', sost_rif, svg)
    return svg


def svg_inline(nome: str, scuro: bool) -> str:
    f = SVG_DIR / (f'{nome}.scuro.svg' if scuro else f'{nome}.svg')
    s = f.read_text(encoding='utf-8').strip()
    s = prefissa_id(s, nome + ('-s' if scuro else ''))
    s = re.sub(r'<svg ', '<svg role="img" aria-label="%s" focusable="false" ' % nome.replace('-', ' '), s, count=1)
    return s


CSS_PAGINA = r"""
:root{--bg:#F5F8FF;--card:#FFFFFF;--ink:#0F172A;--muted:#475569;--line:#DCE5FA;--stage:#EAF1FF;--accent:#1D4ED8;--accent-ink:#FFFFFF;--ring:#93B4F8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0B1220;--card:#111B2E;--ink:#F1F5F9;--muted:#A9B7CC;--line:#243452;--stage:#16233B;--accent:#6C9BF0;--accent-ink:#0B1220;--ring:#3B5FA8}}
:root[data-theme="dark"]{--bg:#0B1220;--card:#111B2E;--ink:#F1F5F9;--muted:#A9B7CC;--line:#243452;--stage:#16233B;--accent:#6C9BF0;--accent-ink:#0B1220;--ring:#3B5FA8}
*{box-sizing:border-box}
html{color-scheme:light dark}
:root[data-theme="light"]{color-scheme:light}
:root[data-theme="dark"]{color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-text-size-adjust:100%}
main{max-width:960px;margin:0 auto;padding:20px 16px 40px}
header{display:flex;flex-wrap:wrap;gap:12px 16px;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
h1{font-size:24px;line-height:1.2;margin:0;font-weight:800;letter-spacing:-.01em}
.nota{margin:6px 0 18px;color:var(--muted);font-size:15px;max-width:60ch}
.azioni{display:flex;gap:8px;flex-wrap:wrap}
button{font:inherit;font-weight:700;font-size:15px;min-height:44px;padding:0 16px;border-radius:12px;border:1.5px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer}
button.pieno{background:var(--accent);color:var(--accent-ink)}
button:focus-visible{outline:3px solid var(--ring);outline-offset:2px}
.griglia{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}
@media (min-width:760px){.griglia{grid-template-columns:repeat(2,minmax(0,1fr))}}
.scheda{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0}
.scheda h2{font-size:17px;line-height:1.25;margin:0;font-weight:800}
.scheda code{font:600 12px/1 ui-monospace,Menlo,Consolas,monospace;color:var(--muted)}
.scheda p{margin:0;color:var(--muted);font-size:14.5px}
.palco{background:var(--stage);border-radius:14px;padding:18px 12px;display:flex;align-items:center;justify-content:center;min-height:240px}
.palco .anim{width:100%;max-width:300px}
.palco .anim svg{width:100%;height:auto;max-height:230px}
.palco .s-scuro{display:none}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .palco .s-chiaro{display:none}:root:not([data-theme="light"]) .palco .s-scuro{display:inline-block}}
:root[data-theme="dark"] .palco .s-chiaro{display:none}
:root[data-theme="dark"] .palco .s-scuro{display:inline-block}
.scheda button{align-self:flex-start}
"""

JS = r"""
(function(){
  var schede=[].slice.call(document.querySelectorAll('.scheda'));
  function riproduci(s){
    var w=s.querySelectorAll('.anim');
    for(var i=0;i<w.length;i++)w[i].classList.remove('in');
    void s.offsetWidth;
    for(var j=0;j<w.length;j++)w[j].classList.add('in');
  }
  window.riproduciScheda=riproduci;
  schede.forEach(function(s){s.querySelector('button').addEventListener('click',function(){riproduci(s)})});
  document.getElementById('tutte').addEventListener('click',function(){schede.forEach(riproduci)});
  var tema=document.getElementById('tema'),r=document.documentElement,modi=['auto','light','dark'],nomi={auto:'automatico',light:'chiaro',dark:'scuro'},k=0;
  tema.addEventListener('click',function(){k=(k+1)%3;var m=modi[k];if(m==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',m);tema.textContent='Tema: '+nomi[m]});
  if(location.hash==='#fermo')return; /* per i controlli automatici: niente avvio da solo */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);riproduci(e.target)}})},{threshold:.55});
    schede.forEach(function(s){io.observe(s)});
  }
})();
"""


def main():
    css = [(CSS_DIR / 'comune.css').read_text(encoding='utf-8')]
    for nome, *_ in SCHEDE:
        css.append((CSS_DIR / f'{nome}.css').read_text(encoding='utf-8'))
    schede_html = []
    for nome, titolo, testo in SCHEDE:
        chiaro = f'<span class="anim anim-{nome} s-chiaro">{svg_inline(nome, False)}</span>'
        scuro = f'<span class="anim anim-{nome} s-scuro">{svg_inline(nome, True)}</span>'
        schede_html.append(
            f'<section class="scheda" id="scheda-{nome}" data-nome="{nome}"><div><h2>{titolo}</h2><code>{nome}</code></div>'
            f'<div class="palco">{chiaro}{scuro}</div><p>{testo}</p><button type="button">Riproduci</button></section>')
    html = f"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prova animazioni AddiOFA</title>
<meta name="color-scheme" content="light dark">
<style>{CSS_PAGINA}
{chr(10).join(css)}</style>
</head>
<body>
<main>
<header>
<div><h1>Prova animazioni AddiOFA</h1></div>
<div class="azioni"><button type="button" id="tutte" class="pieno">Riproduci tutte</button><button type="button" id="tema">Tema: automatico</button></div>
</header>
<p class="nota">Partono una volta e finiscono; con movimento ridotto restano ferme.</p>
<div class="griglia">
{chr(10).join(schede_html)}
</div>
</main>
<script>{JS}</script>
</body>
</html>
"""
    USCITA.parent.mkdir(parents=True, exist_ok=True)
    USCITA.write_text(html, encoding='utf-8')
    print(f'{USCITA.relative_to(RADICE)}: {len(html.encode()) / 1024:.0f} KB')
    if re.search(r'(src|href)="https?://|url\(https?:|@import', html):
        print('ATTENZIONE: risorse esterne trovate'); sys.exit(1)


if __name__ == '__main__':
    main()
