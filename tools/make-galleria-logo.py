#!/usr/bin/env python3
"""Costruisce la Galleria Logo: grafica/brand/logo/*.svg (+ manifest.json) e docs/design/store/*.png
-> app/dist-demo/galleria-logo.html (pagina unica, tutto inline, nessun file esterno né font esterno).

Uso (dalla radice):
    python3 grafica/brand/logo/genera-logo.py      # se i loghi vanno rigenerati
    python3 tools/make-galleria-logo.py            # poi si pubblica con lo strumento Artifact

Sezioni: A lettermark, B wordmark, C lockup, D stelle, E icona dell'app (il 3D, invariato), F mescolatore,
G riepilogo. Salvataggio con la capacità `db` dell'Artifact (documenti scelte/<sezione> e scelte/mescolatore,
stesso schema di tools/galleria/template.html) con ripiego localStorage e testo da copiare.
"""
import base64, io, json, pathlib
from PIL import Image

RADICE = pathlib.Path(__file__).resolve().parents[1]
LOGO = RADICE / 'grafica/brand/logo'
STORE = RADICE / 'docs/design/store'
USCITA = RADICE / 'app/dist-demo/galleria-logo.html'

ETICHETTE = {
    'lettermark/bicolore': 'Bicolore, navy e blu', 'lettermark/blu': 'Blu pieno', 'lettermark/navy': 'Navy, una tinta',
    'lettermark/contorno': 'Solo contorno', 'lettermark/tile-blu': 'Quadrato blu', 'lettermark/tile-notte': 'Quadrato blu notte',
    'lettermark/tile-sfumato': 'Quadrato sfumato', 'lettermark/tile-chiaro': 'Quadrato chiaro, A bicolore',
    'lettermark/cerchio-blu': 'Cerchio blu', 'lettermark/cerchio-notte': 'Cerchio blu notte',
    'lettermark/piena-blu': 'A piena con la stella a base piatta, blu', 'lettermark/piena-navy': 'A piena e stella a base piatta, navy',
    'lettermark/piena-contorno': 'A piena e stella a base piatta, contorno', 'lettermark/piena-tile-blu': 'A piena, quadrato blu',
    'lettermark/piena-tile-notte': 'A piena, quadrato blu notte', 'lettermark/piena-cerchio-blu': 'A piena, cerchio blu',
    'lettermark/scintilla-blu': 'A piena con la scintilla a 4 punte, blu', 'lettermark/scintilla-navy': 'A piena e scintilla, navy',
    'lettermark/scintilla-contorno': 'A piena e scintilla, contorno', 'lettermark/scintilla-tile-blu': 'A con la scintilla, quadrato blu',
    'lettermark/scintilla-tile-notte': 'A con la scintilla, quadrato blu notte', 'lettermark/scintilla-cerchio-blu': 'A con la scintilla, cerchio blu',
    'lockup/orizzontale-scintilla': 'Orizzontale, A con la scintilla', 'lockup/orizzontale-scintilla-tagline': 'Orizzontale, A con la scintilla e motto',
    'lockup/verticale-scintilla': 'Verticale, A con la scintilla',
    'lockup/orizzontale-piena': 'Orizzontale, A piena con la stella', 'lockup/orizzontale-piena-tagline': 'Orizzontale, A piena con la stella e motto',
    'lockup/verticale-piena': 'Verticale, A piena con la stella',
    'wordmark/primario': 'Primario, scintilla nella O', 'wordmark/o-stella5': 'Stella a 5 punte nella O',
    'wordmark/o-semplice': 'O semplice, senza stella', 'wordmark/solo-o-blu': 'Tutto navy, solo la O blu',
    'wordmark/con-tagline': 'Con il motto in maiuscole', 'wordmark/con-tagline-studia': '«Studia oggi, sblocca il tuo domani»',
    'wordmark/stella5-con-tagline': 'Stella a 5 punte e motto', 'wordmark/mono-navy': 'Monocromatico navy',
    'wordmark/lettermark-o-scintilla': 'Lettermark dentro, mono, O con scintilla', 'wordmark/lettermark-o-stella5': 'Lettermark dentro, mono, O con la stella',
    'wordmark/lettermark-o-semplice': 'Lettermark dentro, mono, O semplice', 'wordmark/lettermark-con-tagline': 'Lettermark dentro, mono, con il motto',
    'wordmark/mono-grigio': 'Monocromatico grigio',
    'lockup/orizzontale-tile': 'Orizzontale, quadrato blu', 'lockup/orizzontale-tile-tagline': 'Orizzontale, quadrato e motto',
    'lockup/orizzontale-bicolore': 'Orizzontale, A bicolore', 'lockup/orizzontale-bicolore-stella5': 'Orizzontale, A bicolore e stella nella O',
    'lockup/orizzontale-tile-notte': 'Orizzontale, quadrato blu notte', 'lockup/orizzontale-cerchio': 'Orizzontale, cerchio blu',
    'lockup/verticale-tile': 'Verticale, quadrato e motto', 'lockup/verticale-bicolore': 'Verticale, A bicolore',
    'lockup/verticale-bicolore-tagline': 'Verticale, A bicolore e motto', 'lockup/orizzontale-3d': 'Orizzontale con l\'icona 3D',
    'lockup/verticale-3d': 'Verticale con l\'icona 3D',
    'stella/porta-blu': 'Stella con la base piatta, blu', 'stella/porta-navy': 'Stella con la base piatta, navy',
    'stella/porta-contorno': 'Stella con la base piatta, contorno', 'stella/porta-tile-notte': 'Stella piatta nel quadrato blu notte',
    'stella/porta-tile-blu': 'Stella piatta nel quadrato blu', 'stella/porta-tile-chiaro': 'Stella piatta nel quadrato chiaro',
    'stella/porta-cerchio-blu': 'Stella piatta nel cerchio blu', 'stella/porta-cerchio-chiaro': 'Stella piatta nel cerchio chiaro',
    'stella/regolare-blu': 'Stella regolare a 5 punte', 'stella/regolare-contorno': 'Stella regolare, contorno',
    'stella/scintilla-blu': 'Scintilla a 4 punte', 'stella/scintilla-contorno': 'Scintilla, contorno',
    'stella/scintilla-cerchio': 'Scintilla nel cerchio blu', 'stella/scintilla-tondo-chiaro': 'Scintilla nel tondo chiaro',
    'stella/scintilla-tile': 'Scintilla nel quadrato blu',
}
SEZIONI = [
    ('lettermark', 'A', 'Lettermark', 'Due famiglie: la A con la stella a cinque punte dalla base piatta (concept 15: il vuoto tra le gambe è la stella, aperta sulla linea di base) e la A piena del concept 07/35, in due versioni: con la scintilla a 4 punte («scintilla» nel nome) e con la stella dalla base piatta («piena» nel nome). Ricostruite dai concept e rifinite a mano. Ogni scheda mostra la versione su chiaro e su scuro.'),
    ('wordmark', 'B', 'Wordmark', '«AddiOFA» in Inter Bold con gli spigoli raccordati, la O è un disco con la stella (scintilla a 4 punte come nei concept, oppure la stella a 5 punte con la base piatta, coerente con la A) o una O semplice. Varianti con il motto, monocromatiche. Le quattro «Lettermark dentro» hanno già la A con la stella al posto di tutte le A e sono monocolore: vanno usate da sole («Solo wordmark» nel mescolatore), senza aggiungere un altro lettermark.'),
    ('lockup', 'C', 'Lockup', 'Lettermark e wordmark insieme, in orizzontale e in verticale. Due varianti (3D) tengono l\'icona 3D com\'è nei concept. Se vuoi un abbinamento diverso, usa il mescolatore (F).'),
    ('stella', 'D', 'Stelle e simboli', 'La stella con la base piatta («la porta»), la stella regolare a 5 punte e la scintilla a 4 punte, nei contenitori dei concept: quadrato, cerchio, tondo chiaro.'),
]
TIPO = {'concept': 'dal concept', 'derivata': 'derivata (mescolata)', 'copia': 'dal concept, copiata'}


def uri_png(path, lato, qualita=85, fmt='WEBP', alpha=False):
    im = Image.open(path)
    im = im.convert('RGBA' if alpha else 'RGB')
    if im.size[0] != lato:
        im = im.resize((lato, lato), Image.LANCZOS)
    b = io.BytesIO()
    if fmt == 'WEBP':
        im.save(b, 'WEBP', quality=qualita, method=6)
        return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
    im.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


def main():
    man = json.loads((LOGO / 'manifest.json').read_text(encoding='utf-8'))
    varianti = {k: [] for k, *_ in SEZIONI}
    imgs = {}
    for m in man:
        cat, nome = m['categoria'], m['nome']
        vid = f'{cat}/{nome}'
        chiaro = (LOGO / m['file']).read_text(encoding='utf-8')
        if m.get('solo_chiaro'):
            tre = [chiaro, chiaro, chiaro]
        else:
            tre = [chiaro, (LOGO / 'su-scuro' / m['file']).read_text(encoding='utf-8'), (LOGO / 'su-blu' / m['file']).read_text(encoding='utf-8')]
        imgs[vid] = tre
        pad = m.get('pad', 0)
        v = dict(id=vid, nome=nome, titolo=ETICHETTE.get(vid, nome), fonte=('Concept ' + m['fonte']) if m['fonte'] not in ('—', '') else 'Mescolanza nuova',
                 tipo=TIPO.get(m['tipo'], m['tipo']), descrizione=m['descrizione'], w=m['w'], h=m['h'], pad=pad,
                 soloChiaro=bool(m.get('solo_chiaro')))
        if cat == 'lettermark':
            tile = 'tile' in nome or 'cerchio' in nome
            v['vis'] = [0, 0, 120, 120] if tile else ([7, 5, 106, 100] if nome.startswith('piena') else ([9.6, 5, 101.6, 100] if nome.startswith('scintilla') else [4.6, 5, 110.8, 100]))
            v['tile'] = tile
        if cat == 'wordmark':
            v['iw'] = round(m['w'] - 2 * pad, 2); v['ih'] = round(m['h'] - 2 * pad, 2)
        varianti[cat].append(v)
    sezioni = [dict(id=sid, lettera=let, titolo=tit, descrizione=desc, varianti=varianti[sid]) for sid, let, tit, desc in SEZIONI]
    # icona dell'app (3D): immagini piccole inline
    icone = {
        'ios': uri_png(STORE / 'ios-1024.png', 512, 86),
        'play': uri_png(STORE / 'play-512.png', 512, 86),
        'fg': uri_png(STORE / 'android-adaptive-foreground-432.png', 432, alpha=True, fmt='PNG'),
        'bg': uri_png(STORE / 'android-adaptive-background-432.png', 432, 88),
        'fav': uri_png(STORE / 'favicon-32.png', 32, alpha=True, fmt='PNG'),
        'maskable': uri_png(STORE / 'maskable-512.png', 512, 86),
    }
    html = MODELLO.replace('__DATA__', json.dumps({'sezioni': sezioni}, ensure_ascii=False, separators=(',', ':'))) \
                  .replace('__IMGS__', json.dumps(imgs, ensure_ascii=False, separators=(',', ':'))) \
                  .replace('__ICONE__', json.dumps(icone))
    USCITA.parent.mkdir(parents=True, exist_ok=True)
    USCITA.write_text(html, encoding='utf-8')
    n = sum(len(s['varianti']) for s in sezioni)
    print(f"{len(sezioni)} sezioni, {n} varianti, {USCITA.stat().st_size/1048576:.2f} MB -> {USCITA}")


MODELLO = r"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Galleria Logo AddiOFA</title>
<style>
:root{
  --bg:#F5F7FB; --surface:#FFFFFF; --ink:#0E1A33; --muted:#566280; --line:#DDE3EF;
  --accent:#1D4ED8; --accent-ink:#FFFFFF; --accent-soft:#E6EEFF;
  --ok:#0E7A47; --ok-soft:#DDF5E8; --warn:#8A5A00; --warn-soft:#FFF0CC; --off:#566280; --off-soft:#EDF1F8;
  --shadow:0 1px 2px rgba(14,26,51,.06),0 6px 18px rgba(14,26,51,.06);
  --font:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --p-chiaro:#F6F8FC; --p-notte:#071438; --p-azione:#0560FD;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#0B1220; --surface:#131C30; --ink:#E7ECF7; --muted:#9AA7C2; --line:#25324D;
  --accent:#6EA0FF; --accent-ink:#0B1220; --accent-soft:#17274A;
  --ok:#67D79F; --ok-soft:#10301F; --warn:#F2C35B; --warn-soft:#33270B; --off:#9AA7C2; --off-soft:#1B2640;
  --shadow:0 1px 2px rgba(0,0,0,.4),0 6px 18px rgba(0,0,0,.35); color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#0B1220; --surface:#131C30; --ink:#E7ECF7; --muted:#9AA7C2; --line:#25324D;
  --accent:#6EA0FF; --accent-ink:#0B1220; --accent-soft:#17274A;
  --ok:#67D79F; --ok-soft:#10301F; --warn:#F2C35B; --warn-soft:#33270B; --off:#9AA7C2; --off-soft:#1B2640;
  --shadow:0 1px 2px rgba(0,0,0,.4),0 6px 18px rgba(0,0,0,.35); color-scheme:dark}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);font-size:15px;line-height:1.5;padding-inline:16px;overflow-x:hidden}
h1,h2,h3{text-wrap:balance;margin:0}
button,input,select{font:inherit;color:inherit}
button{cursor:pointer}
:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:6px}
.top{position:sticky;top:0;z-index:20;background:var(--bg);margin-inline:-16px;padding:10px 16px 8px;border-bottom:1px solid var(--line)}
.top-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;max-width:1280px;margin:0 auto}
.top h1{font-size:18px;font-weight:800;letter-spacing:-.01em;flex:1 1 auto;min-width:0}
.prog{font-family:var(--mono);font-size:12px;color:var(--muted)}
.btn{border:1px solid var(--line);background:var(--surface);padding:8px 14px;border-radius:10px;font-weight:600;font-size:14px}
.btn.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.btn.small{padding:5px 10px;font-size:12px}
.nav{display:flex;gap:6px;overflow-x:auto;padding:8px 0 2px;max-width:1280px;margin:0 auto;scrollbar-width:thin}
.nav a{flex:0 0 auto;text-decoration:none;color:var(--muted);font-size:13px;font-weight:600;padding:5px 10px;border-radius:999px;border:1px solid var(--line);background:var(--surface);white-space:nowrap}
.nav a.done{color:var(--ok);border-color:var(--ok)}
main{max-width:1280px;margin:0 auto;padding-block:20px 80px;min-width:0}
.intro{max-width:72ch;color:var(--muted);margin:4px 0 24px}
section.sez{margin-block:0 48px;scroll-margin-top:120px;min-width:0}
.sez-head{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:baseline;justify-content:space-between;margin-bottom:6px}
.sez h2{font-size:24px;font-weight:800;letter-spacing:-.015em}
.sez h2 .let{font-family:var(--mono);font-size:14px;color:var(--accent);margin-right:8px;font-weight:600}
.sez .desc{color:var(--muted);max-width:78ch;margin:0 0 12px}
.scelta-stato{font-size:13px;font-family:var(--mono);color:var(--muted)}
.scelta-stato b{color:var(--ok);font-weight:600}
.nota{display:flex;gap:8px;align-items:center;margin:0 0 14px;flex-wrap:wrap}
.nota input{flex:1 1 240px;min-width:0;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:10px;padding:8px 12px;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,168px),1fr));gap:14px;align-items:start}
.grid.largo{grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))}
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);display:flex;flex-direction:column;min-width:0;overflow:hidden}
.card.sel{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent),var(--shadow)}
.prev{display:grid;grid-template-columns:1fr;gap:0}
.prev.due{grid-template-columns:1fr}
.pane{display:flex;align-items:center;justify-content:center;border:0;padding:14px 10px;min-height:92px;width:100%;position:relative}
.pane.largo{min-height:96px}
.pane img{display:block;max-width:100%;height:auto;max-height:96px;width:auto}
.pane.l img.quadro{max-height:84px}
.pane.chiaro{background:var(--p-chiaro)} .pane.notte{background:var(--p-notte)} .pane.azione{background:var(--p-azione)}
.pane .tag{position:absolute;left:6px;top:4px;font-family:var(--mono);font-size:10px;opacity:.55;color:#445} .pane.notte .tag,.pane.azione .tag{color:#fff}
.card .body{padding:10px 12px 12px;display:flex;flex-direction:column;gap:6px;min-width:0}
.badges{display:flex;gap:6px;flex-wrap:wrap}
.badge{font-family:var(--mono);font-size:11px;padding:2px 8px;border-radius:999px;background:var(--off-soft);color:var(--off)}
.badge.concept{background:var(--ok-soft);color:var(--ok)} .badge.derivata{background:var(--warn-soft);color:var(--warn)}
.card h3{font-size:14px;font-weight:700;line-height:1.25}
.fonte{font-family:var(--mono);font-size:11px;color:var(--muted);overflow-wrap:anywhere}
.card p{margin:0;font-size:12.5px;color:var(--muted)}
.card .nome{font-family:var(--mono);font-size:11px;color:var(--muted)}
.btnrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:2px}
.pick{flex:1 1 auto;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--surface);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;gap:6px}
.pick[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.card .notacard{display:none;border:1px solid var(--line);background:var(--bg);border-radius:8px;padding:6px 8px;font-size:13px;width:100%}
.card.sel .notacard{display:block}
.zoom{position:absolute;right:6px;top:4px;border:1px solid rgba(128,128,128,.4);background:rgba(255,255,255,.75);color:#123;border-radius:6px;padding:1px 6px;font-size:11px}
dialog{border:1px solid var(--line);border-radius:16px;background:var(--surface);color:var(--ink);padding:0;max-width:min(96vw,1000px);width:100%;max-height:92vh;overflow:auto}
dialog::backdrop{background:rgba(8,14,28,.66)}
.dlg-head{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--surface);z-index:1}
.dlg-head h2{font-size:17px}
.dlg-body{padding:16px}
.lb3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.lb3 .pane{min-height:200px;border-radius:12px}
.lb3 .pane img{max-height:220px}
@media (max-width:640px){.lb3{grid-template-columns:1fr}}
.sum{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:12px;margin:0 0 14px;padding:0;list-style:none}
.sum li{display:flex;gap:10px;border:1px solid var(--line);border-radius:12px;padding:8px;align-items:center;min-width:0}
.sum .mini{flex:0 0 72px;height:56px;background:var(--p-chiaro);border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.sum .mini img{max-width:64px;max-height:48px}
.sum b{display:block;font-size:13px}
.sum span{font-size:12px;color:var(--muted);overflow-wrap:anywhere}
textarea.copia{width:100%;min-height:170px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font-family:var(--mono);font-size:12px;padding:10px}
.stato-salvataggio{font-size:12px;color:var(--muted);margin:6px 0}
/* icona dell'app */
.icone{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr));gap:16px}
.ico{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:10px;box-shadow:var(--shadow);min-width:0;text-align:center}
.ico .area{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;min-height:120px;background:var(--p-chiaro);border-radius:12px;padding:12px;width:100%}
.ico.sc .area{background:#0B1220}
.ico h3{font-size:14px} .ico p{margin:0;font-size:12px;color:var(--muted)}
.sq{border-radius:22.37%;overflow:hidden;display:block;position:relative;flex:0 0 auto}
.ci{border-radius:50%;overflow:hidden;display:block;position:relative;flex:0 0 auto}
.sq img,.ci img{display:block;width:100%;height:100%}
.adapt{display:block;position:relative;width:100%;height:100%}
.adapt img{position:absolute;inset:0;width:100%;height:100%}
.restacosi{border:1px solid var(--accent);background:var(--accent-soft);border-radius:12px;padding:10px 14px;margin:0 0 16px;font-size:14px}
/* mescolatore */
.mix{display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:20px;align-items:start}
@media (max-width:900px){.mix{grid-template-columns:minmax(0,1fr)}}
.ctrl{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow);min-width:0}
.ctrl fieldset{border:0;margin:0;padding:0;min-width:0}
.ctrl legend{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);padding:0;margin-bottom:6px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 12px;font-size:13px;font-weight:600}
.chip[aria-checked="true"]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.chip:disabled{opacity:.4;cursor:not-allowed}
.thumbs{display:flex;flex-wrap:wrap;gap:8px;padding:2px}
.th{flex:0 0 auto;width:92px;border:2px solid var(--line);background:var(--p-chiaro);border-radius:10px;padding:6px;display:flex;align-items:center;justify-content:center;height:66px}
.th.w{width:128px}
.th img{max-width:100%;max-height:100%}
.th[aria-checked="true"]{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent)}
.th:disabled{opacity:.35}
.anteprime{display:flex;flex-direction:column;gap:16px;min-width:0}
.box{background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);overflow:hidden;min-width:0}
.box h3{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);padding:10px 14px 0;font-weight:500}
.grande{margin:10px;border-radius:12px;min-height:240px;display:flex;align-items:center;justify-content:center;padding:28px 18px}
.grande svg{display:block;max-width:100%;height:auto}
.fondo-chiaro{background:var(--p-chiaro)} .fondo-notte{background:var(--p-notte)} .fondo-azione{background:var(--p-azione)}
.telefono{margin:10px auto 14px;width:390px;max-width:100%;border:1px solid var(--line);border-radius:18px;overflow:hidden}
.app-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;min-height:60px}
.app-head .logo{display:flex;align-items:center;min-width:0}
.app-head .logo svg{display:block;height:34px;width:auto;max-width:240px}
.app-head .profilo{flex:0 0 auto;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(128,128,128,.35)}
.app-body{padding:14px 16px 18px;background:var(--bg);color:var(--ink);font-size:13px}
.app-body .riga{height:12px;border-radius:6px;background:var(--off-soft);margin:8px 0}
.foot{display:flex;flex-direction:column;align-items:center;gap:10px;padding:26px 16px;text-align:center;font-size:12px}
.foot svg{display:block;height:46px;width:auto;max-width:80%}
.foot .links{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;opacity:.85}
.nota-mix{margin:0;font-size:12px;color:var(--muted);padding:0 14px 12px}
.scegli-box{display:flex;flex-direction:column;gap:10px}
@media (max-width:520px){.sez h2{font-size:21px}.grande{padding:20px 12px}}
@media (prefers-reduced-motion:no-preference){.card{transition:box-shadow .15s,border-color .15s}}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
</style>
</head>
<body>
<div class="top">
  <div class="top-row">
    <h1>Galleria logo AddiOFA</h1>
    <span class="prog" id="prog" aria-live="polite"></span>
    <button class="btn" id="tema-btn" type="button" aria-label="Cambia tema">Tema</button>
    <button class="btn primary" id="apri-riepilogo" type="button">Riepilogo</button>
  </div>
  <nav class="nav" id="nav" aria-label="Sezioni"></nav>
</div>
<main>
  <p class="intro">Qui ci sono tutte le versioni del logo ricostruite dai tuoi concept, con la A dalla stella a cinque punte (base piatta). Il logo 3D resta l'icona dell'app (sezione E). Nelle sezioni A-D premi «Scelgo questa» su una variante per sezione (puoi scrivere una nota); nella sezione F mescoli lettermark, wordmark, disposizione e fondo e vedi subito come stanno nell'intestazione e nel piè di pagina dell'app. Le scelte si salvano e le leggo io.</p>
  <div id="sezioni"></div>
</main>

<dialog id="lb" aria-labelledby="lb-titolo">
  <div class="dlg-head"><h2 id="lb-titolo"></h2><button class="btn" id="lb-chiudi" type="button">Chiudi</button></div>
  <div class="dlg-body">
    <div class="lb3" id="lb-tre"></div>
    <p id="lb-note" style="color:var(--muted);margin:12px 0 0"></p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
      <button class="btn" id="lb-prec" type="button">‹ Precedente</button>
      <button class="btn" id="lb-succ" type="button">Successiva ›</button>
      <button class="btn primary" id="lb-pick" type="button" aria-pressed="false">Scelgo questa</button>
    </div>
  </div>
</dialog>

<dialog id="riep" aria-labelledby="riep-titolo">
  <div class="dlg-head"><h2 id="riep-titolo">Riepilogo delle scelte</h2><button class="btn" id="riep-chiudi" type="button">Chiudi</button></div>
  <div class="dlg-body">
    <ul class="sum" id="riep-lista"></ul>
    <p class="stato-salvataggio" id="salvataggio"></p>
    <label for="copia" style="font-size:13px;font-weight:600">Testo da incollare nella chat</label>
    <textarea class="copia" id="copia" readonly></textarea>
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" id="copia-btn" type="button">Copia il testo</button><span id="copia-esito" class="stato-salvataggio" role="status"></span></div>
  </div>
</dialog>

<script>
const DATA = __DATA__;
const IMGS = __IMGS__;
const ICONE = __ICONE__;
</script>
<script>
(function(){
  'use strict';
  const LS='galleria-logo-v1';
  const CAPH=65.2;
  const GROUNDS=['chiaro','notte','azione'];
  const GNOMI={chiaro:'Chiaro',notte:'Blu notte',azione:'Blu azione'};
  const GCOL={chiaro:'#F6F8FC',notte:'#071438',azione:'#0560FD'};
  let scelte={}, mix={lettermark:'lettermark/bicolore',wordmark:'wordmark/primario',disp:'orizzontale',fondo:'chiaro',nota:'',confermata:false};
  let db=null;
  try{const x=JSON.parse(localStorage.getItem(LS)||'{}')||{}; scelte=x.scelte||{}; Object.assign(mix,x.mix||{})}catch(e){}
  const $=(s,r)=>(r||document).querySelector(s);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e};
  const tutte=[]; DATA.sezioni.forEach(s=>s.varianti.forEach(v=>{v._s=s.id; tutte.push(v)}));
  const byId=Object.fromEntries(tutte.map(v=>[v.id,v]));
  const dati=(id,g)=>{const a=IMGS[id]; return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(a[g])};
  const gi=g=>GROUNDS.indexOf(g);
  function salvaLocale(){try{localStorage.setItem(LS,JSON.stringify({scelte:scelte,mix:mix}))}catch(e){}}
  function statoSalv(t){const n=$('#salvataggio'); if(n) n.textContent=t}
  async function salvaDb(sid){
    if(!db) return;
    try{const sc=scelte[sid]; const ref=db.doc('scelte/'+sid);
      if(sc&&sc.variante){const v=byId[sc.variante]||{}; await ref.set({variante:sc.variante,titolo:v.titolo||'',fonte:v.fonte||'',nota:sc.nota||'',aggiornato:new Date().toISOString()})}
      else if(sc&&sc.nota){await ref.set({variante:'',titolo:'',fonte:'',nota:sc.nota,aggiornato:new Date().toISOString()})}
      else await ref.delete();
      statoSalv('Salvato: lo leggo io da qui.')}catch(e){statoSalv('Salvato solo su questo dispositivo (il salvataggio condiviso non è disponibile).')}
  }
  async function salvaMix(){
    if(!db) return;
    try{const lm=byId[mix.lettermark], wm=byId[mix.wordmark];
      await db.doc('scelte/mescolatore').set({lettermark:mix.lettermark,wordmark:mix.wordmark,disposizione:mix.disp,fondo:mix.fondo,
        titolo:titoloMix(),confermata:!!mix.confermata,nota:mix.nota||'',aggiornato:new Date().toISOString()});
      statoSalv('Combinazione salvata: la leggo io da qui.')}catch(e){statoSalv('Combinazione salvata solo su questo dispositivo.')}
  }
  const DISP={lettermark:'Solo lettermark',wordmark:'Solo wordmark',orizzontale:'Orizzontale',verticale:'Verticale'};
  function titoloMix(){
    const lm=byId[mix.lettermark], wm=byId[mix.wordmark];
    const parti=[]; if(mix.disp!=='wordmark') parti.push('Lettermark '+lm.titolo); if(mix.disp!=='lettermark') parti.push('Wordmark '+wm.titolo);
    return DISP[mix.disp]+': '+parti.join(' + ')+' · fondo '+GNOMI[mix.fondo].toLowerCase();
  }

  /* ---------- sezioni A-D ---------- */
  function pane(v,g,cls){
    const d=el('div','pane '+g+(cls?' '+cls:'')); const im=el('img'); im.alt=v.titolo+' su '+GNOMI[g].toLowerCase(); im.src=dati(v.id,gi(g)); im.decoding='async';
    if(v.tile||v.nome.indexOf('tile')>=0||v.nome.indexOf('cerchio')>=0) im.className='quadro';
    d.append(im); return d;
  }
  function card(v,largo){
    const c=el('article','card'); c.dataset.id=v.id;
    const pv=el('div','prev');
    const bt=el('button','pane '+'chiaro'+(largo?' largo':'')); bt.type='button'; bt.setAttribute('aria-label','Ingrandisci: '+v.titolo);
    bt.append(el('span','tag','chiaro')); const i1=el('img'); i1.alt=v.titolo+' su fondo chiaro'; i1.src=dati(v.id,0); bt.append(i1); bt.addEventListener('click',()=>apriLb(v));
    const bd=el('button','pane notte'+(largo?' largo':'')); bd.type='button'; bd.setAttribute('aria-label','Ingrandisci: '+v.titolo+' su fondo scuro');
    bd.append(el('span','tag',v.soloChiaro?'(solo chiaro)':'scuro')); const i2=el('img'); i2.alt=v.titolo+' su fondo scuro'; i2.src=dati(v.id,1); bd.append(i2); bd.addEventListener('click',()=>apriLb(v));
    if(v.tile||/tile|cerchio|stella\//.test(v.id)){[i1,i2].forEach(i=>i.style.maxHeight='80px')}
    pv.append(bt,bd); c.append(pv);
    const b=el('div','body');
    const bg=el('div','badges'); const tp=v.tipo.indexOf('derivata')===0?'derivata':'concept'; bg.append(el('span','badge '+tp,v.tipo)); b.append(bg);
    b.append(el('h3',null,v.titolo)); b.append(el('div','nome',v.id)); b.append(el('div','fonte',v.fonte)); b.append(el('p',null,v.descrizione));
    const nt=el('input','notacard'); nt.type='text'; nt.placeholder='Nota su questa variante'; nt.setAttribute('aria-label','Nota su '+v.titolo);
    nt.addEventListener('change',()=>{const cur=scelte[v._s]||{variante:v.id,nota:''}; cur.nota=nt.value; scelte[v._s]=cur; salvaLocale(); aggiorna(true); salvaDb(v._s)}); b.append(nt);
    const row=el('div','btnrow'); const p=el('button','pick','Scelgo questa'); p.type='button'; p.setAttribute('aria-pressed','false'); p.addEventListener('click',()=>scegli(v)); row.append(p);
    if(v._s==='lettermark'||v._s==='wordmark'){const pm=el('button','btn small','Provo nel mescolatore'); pm.type='button'; pm.addEventListener('click',()=>{mix[v._s]=v.id; if(v._s==='lettermark'&&mix.disp==='wordmark') mix.disp='orizzontale'; if(v._s==='wordmark'&&mix.disp==='lettermark') mix.disp='orizzontale'; salvaLocale(); disegnaMix(); const t=$('#mescolatore'); if(t) t.scrollIntoView({behavior:'smooth'})}); row.append(pm)}
    b.append(row); c.append(b); return c;
  }
  function sezioneChiusa(s){
    const sec=el('section','sez'); sec.id=s.id; sec.dataset.sez=s.id;
    const h=el('div','sez-head'); const t=el('h2'); const l=el('span','let',s.lettera); t.append(l,document.createTextNode(s.titolo)); h.append(t); const st=el('span','scelta-stato'); st.id='st-'+s.id; h.append(st); sec.append(h);
    sec.append(el('p','desc',s.descrizione));
    const nt=el('div','nota'); const lab=el('label',null,'Nota'); lab.style.cssText='font-size:13px;font-weight:600'; const inp=el('input'); inp.type='text'; inp.id='nota-'+s.id; lab.htmlFor=inp.id; inp.placeholder='Facoltativa, per esempio «questa, ma con la O più grande»';
    inp.value=(scelte[s.id]&&scelte[s.id].nota)||''; inp.addEventListener('change',()=>{const c=scelte[s.id]||{variante:''}; c.nota=inp.value; scelte[s.id]=c; if(!c.variante&&!c.nota) delete scelte[s.id]; salvaLocale(); aggiorna(true); salvaDb(s.id)}); nt.append(lab,inp); sec.append(nt);
    const largo=(s.id==='wordmark'||s.id==='lockup'); const g=el('div','grid'+(largo?' largo':'')); s.varianti.forEach(v=>g.append(card(v,largo))); sec.append(g);
    return sec;
  }
  function scegli(v){
    const sid=v._s; const cur=scelte[sid]||{};
    if(cur.variante===v.id){cur.variante=''; if(!cur.nota) delete scelte[sid]; else scelte[sid]=cur} else scelte[sid]={variante:v.id,nota:cur.nota||''};
    salvaLocale(); aggiorna(); salvaDb(sid); if(lb.open) aggiornaLb();
  }
  function aggiorna(soloNote){
    const fatte=DATA.sezioni.filter(s=>scelte[s.id]&&scelte[s.id].variante).length+(mix.confermata?1:0);
    $('#prog').textContent=fatte+' di '+(DATA.sezioni.length+1)+' scelte';
    DATA.sezioni.forEach(s=>{
      const sc=scelte[s.id]; const v=sc&&sc.variante&&byId[sc.variante];
      const a=$('#nav a[href="#'+s.id+'"]'); if(a) a.classList.toggle('done',!!v);
      const st=$('#st-'+s.id); if(st){st.textContent=''; if(v){st.append(el('b',null,'Scelta: '),document.createTextNode(v.titolo))} else st.textContent='Nessuna scelta ancora'}
      const ni=$('#nota-'+s.id); if(ni&&document.activeElement!==ni) ni.value=(sc&&sc.nota)||'';
      document.querySelectorAll('[data-sez="'+s.id+'"] .card').forEach(c=>{
        const on=!!(v&&sc.variante===c.dataset.id); c.classList.toggle('sel',on);
        const p=c.querySelector('.pick'); if(p){p.setAttribute('aria-pressed',on?'true':'false'); p.textContent=on?'Scelta ✓':'Scelgo questa'}
        const n=c.querySelector('.notacard'); if(n&&document.activeElement!==n) n.value=on?((sc&&sc.nota)||''):'';
      });
    });
    const am=$('#nav a[href="#mescolatore"]'); if(am) am.classList.toggle('done',!!mix.confermata);
    const ac=$('#conferma-stato'); if(ac) ac.textContent=mix.confermata?'Combinazione scelta: '+titoloMix():'Non hai ancora scelto una combinazione.';
    const cb=$('#conferma-btn'); if(cb){cb.setAttribute('aria-pressed',mix.confermata?'true':'false'); cb.textContent=mix.confermata?'Combinazione scelta ✓':'Scelgo questa combinazione'}
  }

  /* ---------- lightbox ---------- */
  const lb=$('#lb'); let lbIdx=0, lbLista=[];
  function aggiornaLb(){
    const v=lbLista[lbIdx]; if(!v) return; $('#lb-titolo').textContent=v.titolo+' · '+v.id;
    const w=$('#lb-tre'); w.textContent='';
    GROUNDS.forEach((g,k)=>{const d=el('div','pane '+g); const i=el('img'); i.alt=v.titolo+' su '+GNOMI[g].toLowerCase(); i.src=dati(v.id,k); d.append(el('span','tag',GNOMI[g].toLowerCase())); d.append(i); w.append(d)});
    $('#lb-note').textContent=v.fonte+' · '+v.tipo+'. '+v.descrizione;
    const on=scelte[v._s]&&scelte[v._s].variante===v.id; const p=$('#lb-pick'); p.setAttribute('aria-pressed',on?'true':'false'); p.textContent=on?'Scelta ✓':'Scelgo questa';
  }
  function apriLb(v){lbLista=DATA.sezioni.find(s=>s.id===v._s).varianti; lbIdx=lbLista.indexOf(v); aggiornaLb(); if(!lb.open) lb.showModal()}
  $('#lb-chiudi').addEventListener('click',()=>lb.close());
  $('#lb-prec').addEventListener('click',()=>{lbIdx=(lbIdx-1+lbLista.length)%lbLista.length; aggiornaLb()});
  $('#lb-succ').addEventListener('click',()=>{lbIdx=(lbIdx+1)%lbLista.length; aggiornaLb()});
  $('#lb-pick').addEventListener('click',()=>scegli(lbLista[lbIdx]));
  lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft') $('#lb-prec').click(); if(e.key==='ArrowRight') $('#lb-succ').click()});
  lb.addEventListener('click',e=>{if(e.target===lb) lb.close()});

  /* ---------- E: icona dell'app ---------- */
  function sezioneIcona(){
    const sec=el('section','sez'); sec.id='icona'; sec.dataset.sez='icona';
    const h=el('div','sez-head'); const t=el('h2'); t.append(el('span','let','E'),document.createTextNode("Icona dell'app")); h.append(t); sec.append(h);
    sec.append(el('p','restacosi',"Resta così, decisione dell'utente: il logo 3D (la stella luminosa nel muro blu) è l'icona dell'app su telefono e sugli store. Qui sotto come appare nelle forme di iOS, Android, browser e store. Il lettermark e il wordmark servono per il resto (intestazione, piè di pagina, social)."));
    const g=el('div','icone');
    function ico(nome,desc,build,scuro){const d=el('div','ico'+(scuro?' sc':'')); const a=el('div','area'); build(a); d.append(a,el('h3',null,nome),el('p',null,desc)); g.append(d)}
    const sq=(px,src)=>{const s=el('span','sq'); s.style.width=px+'px'; s.style.height=px+'px'; const i=el('img'); i.src=src; i.alt=''; s.append(i); return s};
    const ci=(px,src)=>{const s=el('span','ci'); s.style.width=px+'px'; s.style.height=px+'px'; const i=el('img'); i.src=src; i.alt=''; s.append(i); return s};
    const ad=(px,forma)=>{const s=el('span',forma==='cerchio'?'ci':'sq'); s.style.width=px+'px'; s.style.height=px+'px'; const w=el('span','adapt'); const b=el('img'); b.src=ICONE.bg; b.alt=''; const f=el('img'); f.src=ICONE.fg; f.alt=''; w.append(b,f); s.append(w); return s};
    ico('iOS (schermata Home)','1024×1024 a tutto campo; lo squircle lo applica iOS.',a=>{a.append(sq(96,ICONE.ios),sq(60,ICONE.ios))});
    ico('iOS su fondo scuro','Stesse dimensioni su sfondo scuro.',a=>{a.append(sq(96,ICONE.ios),sq(60,ICONE.ios))},true);
    ico('Android: cerchio','Icona adattiva: sfondo blu a gradiente, primo piano la stella (zona sicura 66%).',a=>{a.append(ad(96,'cerchio'),ad(56,'cerchio'))});
    ico('Android: squircle','Stessa icona adattiva con la maschera arrotondata.',a=>{a.append(ad(96,'squircle'),ad(56,'squircle'))});
    ico('Google Play (scheda)','512×512, la scheda dello store.',a=>{a.append(sq(120,ICONE.play))});
    ico('Maskable (PWA)','512×512 a tutto campo, la stella dentro il cerchio dell\'80%.',a=>{a.append(ci(100,ICONE.maskable))});
    ico('Favicon','32×32 e ingrandita; accanto la stessa a 16 px.',a=>{const f1=el('img'); f1.src=ICONE.fav; f1.alt='favicon 32'; f1.width=32; f1.height=32; const f2=el('img'); f2.src=ICONE.fav; f2.alt='favicon 16'; f2.width=16; f2.height=16; const f3=el('img'); f3.src=ICONE.fav; f3.alt='favicon ingrandita'; f3.width=64; f3.height=64; f3.style.imageRendering='pixelated'; a.append(f1,f2,f3)});
    ico('Leggibilità a 48 px','La stella si riconosce ancora a 48 e a 32 px.',a=>{a.append(sq(48,ICONE.ios),sq(32,ICONE.ios))});
    sec.append(g); return sec;
  }

  /* ---------- F: mescolatore ---------- */
  const NS='http://www.w3.org/2000/svg';
  function compone(disp,lm,wm,g){
    const k=gi(g); const A=(v)=>dati(v.id,k);
    const pad=wm.pad||0;
    function img(uri,x,y,w,h){return '<image href="'+uri+'" x="'+x.toFixed(2)+'" y="'+y.toFixed(2)+'" width="'+w.toFixed(2)+'" height="'+h.toFixed(2)+'"/>'}
    if(disp==='lettermark'){const [vx,vy,vw,vh]=lm.vis; return {W:vw,H:vh,body:img(A(lm),-vx,-vy,lm.w,lm.h)}}
    if(disp==='wordmark'){return {W:wm.iw,H:wm.ih,body:img(A(wm),-pad,-pad,wm.w,wm.h)}}
    const [vx,vy,vw,vh]=lm.vis; const tile=lm.tile;
    if(disp==='orizzontale'){
      const hRef=wm.ih; const target=tile?Math.max(1.5*CAPH,hRef*0.98):1.15*CAPH; const kh=target/vh; const lh=vh*kh, lw=vw*kh; const gap=lh*(tile?0.24:0.30); const H=Math.max(lh,hRef);
      return {W:lw+gap+wm.iw,H:H,body:img(A(lm),-vx*kh,(H-lh)/2-vy*kh,lm.w*kh,lm.h*kh)+img(A(wm),lw+gap-pad,(H-hRef)/2-pad,wm.w,wm.h)};
    }
    const tw=wm.iw; const target=tw*(tile?0.40:0.36); const kh=target/vh; const lw=vw*kh; const gap=target*0.26; const W=Math.max(tw,lw);
    return {W:W,H:target+gap+wm.ih,body:img(A(lm),(W-lw)/2-vx*kh,-vy*kh,lm.w*kh,lm.h*kh)+img(A(wm),(W-tw)/2-pad,target+gap-pad,wm.w,wm.h)};
  }
  function svgLogo(disp,lm,wm,g,css){
    const c=compone(disp,lm,wm,g);
    return '<svg xmlns="'+NS+'" viewBox="0 0 '+c.W.toFixed(2)+' '+c.H.toFixed(2)+'" role="img" aria-label="'+titoloMix().replace(/"/g,'')+'" style="'+(css||'')+'">'+c.body+'</svg>';
  }
  const FINTA={chiaro:{bg:'#F6F8FC',ink:'#0F172A',mut:'#64748B',prof:'#0F172A'},notte:{bg:'#071438',ink:'#FFFFFF',mut:'#A9B6D3',prof:'#FFFFFF'},azione:{bg:'#0560FD',ink:'#FFFFFF',mut:'#D7E4FF',prof:'#FFFFFF'}};
  const IC_PROF='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20c1.2-4 4-5.6 7.5-5.6s6.3 1.6 7.5 5.6"/></svg>';
  function disegnaMix(){
    const lm=byId[mix.lettermark], wm=byId[mix.wordmark]; const g=mix.fondo; const F=FINTA[g];
    // controlli
    document.querySelectorAll('#c-disp .chip').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.v===mix.disp)));
    document.querySelectorAll('#c-fondo .chip').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.v===mix.fondo)));
    document.querySelectorAll('#c-lm .th').forEach(b=>{b.setAttribute('aria-checked',String(b.dataset.v===mix.lettermark)); b.disabled=(mix.disp==='wordmark')});
    document.querySelectorAll('#c-wm .th').forEach(b=>{b.setAttribute('aria-checked',String(b.dataset.v===mix.wordmark)); b.disabled=(mix.disp==='lettermark')});
    // grande
    const gr=$('#m-grande'); gr.className='grande fondo-'+g;
    const maxw=(mix.disp==='verticale')?220:(mix.disp==='lettermark'?150:Math.min(560,innerWidth-80));
    gr.innerHTML=svgLogo(mix.disp,lm,wm,g,'width:'+maxw+'px;max-width:100%');
    // intestazione dell'app: verticale -> si usa l'orizzontale
    const dh=(mix.disp==='verticale')?'orizzontale':mix.disp;
    const t=$('#m-testata'); t.style.background=F.bg; t.style.color=F.ink;
    t.querySelector('.logo').innerHTML=svgLogo(dh,lm,wm,g,'height:'+(dh==='wordmark'?'26':'34')+'px;width:auto;max-width:240px');
    t.querySelector('.profilo').style.color=F.prof; t.querySelector('.profilo').innerHTML=IC_PROF;
    $('#m-corpo').style.background=F.bg; $('#m-corpo').style.color=F.ink;
    $('#m-corpo').querySelectorAll('.riga').forEach(r=>{r.style.background=F.ink==='#FFFFFF'?'rgba(255,255,255,.16)':'rgba(15,23,42,.08)'});
    // piè di pagina
    const ft=$('#m-foot'); ft.style.background=F.bg; ft.style.color=F.mut;
    const dfoot=(mix.disp==='orizzontale')?'verticale':mix.disp;
    ft.querySelector('.logo').innerHTML=svgLogo(dfoot==='verticale'?'verticale':dfoot,lm,wm,g,'height:'+(dfoot==='verticale'?'84':'40')+'px;width:auto;max-width:80%');
    $('#m-nota-head').textContent=(mix.disp==='verticale')?'La disposizione verticale non sta in un\'intestazione: nell\'app si userebbe l\'orizzontale.':(mix.disp==='orizzontale'?'Nel piè di pagina l\'orizzontale si può sostituire con la verticale.':'');
    $('#m-titolo').textContent=titoloMix();
    aggiorna();
  }
  function sezioneMix(){
    const sec=el('section','sez'); sec.id='mescolatore'; sec.dataset.sez='mescolatore';
    const h=el('div','sez-head'); const t=el('h2'); t.append(el('span','let','F'),document.createTextNode('Mescolatore')); h.append(t); sec.append(h);
    sec.append(el('p','desc','Scegli un lettermark, un wordmark, la disposizione e il fondo: l\'anteprima grande, l\'intestazione dell\'app (390 px, con l\'icona profilo a destra come la home) e il piè di pagina si aggiornano subito.'));
    const mx=el('div','mix');
    const ctrl=el('div','ctrl');
    function chips(id,leg,opts,key){const f=el('fieldset'); const l=el('legend',null,leg); f.append(l); const w=el('div','chips'); w.id=id; w.setAttribute('role','radiogroup'); w.setAttribute('aria-label',leg);
      opts.forEach(([v,n])=>{const b=el('button','chip',n); b.type='button'; b.setAttribute('role','radio'); b.dataset.v=v; b.addEventListener('click',()=>{mix[key]=v; mix.confermata=false; salvaLocale(); disegnaMix()}); w.append(b)}); f.append(w); return f}
    ctrl.append(chips('c-disp','Disposizione',[['lettermark','Solo lettermark'],['wordmark','Solo wordmark'],['orizzontale','Orizzontale'],['verticale','Verticale']],'disp'));
    ctrl.append(chips('c-fondo','Fondo',[['chiaro','Chiaro'],['notte','Blu notte'],['azione','Blu azione']],'fondo'));
    function lista(id,leg,sid,key,w){const f=el('fieldset'); f.append(el('legend',null,leg)); const d=el('div','thumbs'); d.id=id; d.setAttribute('role','radiogroup'); d.setAttribute('aria-label',leg);
      DATA.sezioni.find(s=>s.id===sid).varianti.forEach(v=>{const b=el('button','th'+(w?' w':'')); b.type='button'; b.setAttribute('role','radio'); b.dataset.v=v.id; b.title=v.titolo; b.setAttribute('aria-label',v.titolo); const i=el('img'); i.src=dati(v.id,0); i.alt=''; b.append(i); b.addEventListener('click',()=>{mix[key]=v.id; mix.confermata=false; salvaLocale(); disegnaMix()}); d.append(b)}); f.append(d); return f}
    ctrl.append(lista('c-lm','Lettermark','lettermark','lettermark',false));
    ctrl.append(lista('c-wm','Wordmark','wordmark','wordmark',true));
    const sc=el('div','scegli-box'); const lab=el('label',null,'Nota sulla combinazione'); lab.style.cssText='font-size:13px;font-weight:600'; const ni=el('input'); ni.type='text'; ni.id='nota-mix'; ni.style.cssText='border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:10px;padding:8px 12px;width:100%'; lab.htmlFor='nota-mix'; ni.value=mix.nota||''; ni.addEventListener('change',()=>{mix.nota=ni.value; salvaLocale(); if(mix.confermata) salvaMix()}); sc.append(lab,ni);
    const cb=el('button','btn primary','Scelgo questa combinazione'); cb.id='conferma-btn'; cb.type='button'; cb.setAttribute('aria-pressed','false'); cb.addEventListener('click',()=>{mix.confermata=!mix.confermata; salvaLocale(); aggiorna(); if(mix.confermata) salvaMix(); else if(db){try{db.doc('scelte/mescolatore').delete()}catch(e){}} });
    const cs=el('div','stato-salvataggio'); cs.id='conferma-stato'; cs.setAttribute('aria-live','polite'); sc.append(cb,cs); ctrl.append(sc);
    mx.append(ctrl);
    const an=el('div','anteprime');
    const b1=el('div','box'); b1.append(el('h3',null,'Anteprima grande')); const tt=el('p','nota-mix'); tt.id='m-titolo'; tt.style.paddingTop='6px'; b1.append(tt); const gr=el('div','grande'); gr.id='m-grande'; b1.append(gr); an.append(b1);
    const b2=el('div','box'); b2.append(el('h3',null,"Intestazione dell'app (390 px)"));
    b2.innerHTML+='<div class="telefono" id="m-tel"><div class="app-head" id="m-testata"><div class="logo"></div><div class="profilo"></div></div><div class="app-body" id="m-corpo"><div class="riga" style="width:62%"></div><div class="riga" style="width:90%"></div><div class="riga" style="width:74%"></div></div></div><p class="nota-mix" id="m-nota-head"></p>';
    an.append(b2);
    const b3=el('div','box'); b3.append(el('h3',null,'Piè di pagina')); b3.innerHTML+='<div class="telefono"><div class="foot" id="m-foot"><div class="logo"></div><div class="links"><span>Privacy</span><span>Termini</span><span>Contatti</span></div><span>AddiOFA · progetto indipendente, non affiliato al Politecnico di Milano</span></div></div>'; an.append(b3);
    mx.append(an); sec.append(mx);
    const g2=el('div','sez-head'); g2.style.marginTop='28px'; const t2=el('h2'); t2.append(el('span','let','G'),document.createTextNode('Scelta finale')); g2.append(t2); sec.append(g2);
    sec.append(el('p','desc','Il riepilogo mette insieme le scelte di A-D e la combinazione del mescolatore, con il testo da copiare.'));
    const bb=el('button','btn primary','Apri il riepilogo'); bb.type='button'; bb.addEventListener('click',apriRiepilogo); sec.append(bb);
    return sec;
  }

  /* ---------- riepilogo ---------- */
  const riep=$('#riep');
  function testoRiepilogo(){
    const r=['Le mie scelte per il logo AddiOFA:'];
    DATA.sezioni.forEach(s=>{const sc=scelte[s.id]; const v=sc&&sc.variante&&byId[sc.variante]; r.push('- '+s.lettera+' '+s.titolo+': '+(v?(v.titolo+' ['+v.id+'; '+v.fonte+']'):'nessuna scelta')+(sc&&sc.nota?(' · nota: '+sc.nota):''))});
    r.push("- E Icona dell'app: resta il logo 3D (decisione dell'utente)");
    r.push('- F/G Mescolatore: '+(mix.confermata?titoloMix()+' ['+mix.lettermark+' + '+mix.wordmark+'; '+mix.disp+'; fondo '+mix.fondo+']':'nessuna combinazione scelta (provata: '+titoloMix()+')')+(mix.nota?' · nota: '+mix.nota:''));
    return r.join('\n');
  }
  function apriRiepilogo(){
    const ul=$('#riep-lista'); ul.textContent='';
    function voce(titolo,v,extra,svgsrc){const li=document.createElement('li'); const m=el('span','mini'); if(svgsrc){const im=el('img'); im.alt=''; im.src=svgsrc; m.append(im)} li.append(m); const d=el('div'); d.append(el('b',null,titolo)); d.append(el('span',null,v?v:'Nessuna scelta')+(extra?' · '+extra:'')); li.append(d); ul.append(li)}
    DATA.sezioni.forEach(s=>{const sc=scelte[s.id]; const v=sc&&sc.variante&&byId[sc.variante]; voce(s.lettera+' '+s.titolo,v?v.titolo:'',sc&&sc.nota,v?dati(v.id,0):'')});
    const lm=byId[mix.lettermark], wm=byId[mix.wordmark];
    voce('F/G Mescolatore',mix.confermata?titoloMix():'',mix.nota,mix.confermata?('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgLogo(mix.disp,lm,wm,mix.fondo,'').replace('role="img"','width="64" height="48" role="img"'))):'');
    $('#copia').value=testoRiepilogo(); $('#copia-esito').textContent='';
    statoSalv(db?'Le scelte sono salvate nello spazio condiviso di questa pagina.':'Le scelte sono salvate solo su questo dispositivo: incolla il testo nella chat.');
    riep.showModal();
  }
  $('#apri-riepilogo').addEventListener('click',apriRiepilogo);
  $('#riep-chiudi').addEventListener('click',()=>riep.close());
  riep.addEventListener('click',e=>{if(e.target===riep) riep.close()});
  $('#copia-btn').addEventListener('click',async()=>{const t=$('#copia'); try{await navigator.clipboard.writeText(t.value); $('#copia-esito').textContent='Copiato.'}catch(e){t.focus(); t.select(); $('#copia-esito').textContent='Seleziona il testo e copialo a mano.'}});

  /* ---------- tema ---------- */
  $('#tema-btn').addEventListener('click',()=>{const r=document.documentElement; const scuro=r.dataset.theme==='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches); r.dataset.theme=scuro?'light':'dark'});

  /* ---------- costruzione ---------- */
  function costruisci(){
    const nav=$('#nav'), root=$('#sezioni');
    const voci=[]; DATA.sezioni.forEach(s=>voci.push([s.id,s.lettera+' '+s.titolo])); voci.push(['icona','E Icona']); voci.push(['mescolatore','F Mescolatore']);
    voci.forEach(([id,n])=>{const a=el('a',null,n); a.href='#'+id; nav.append(a)});
    DATA.sezioni.forEach(s=>root.append(sezioneChiusa(s)));
    root.append(sezioneIcona()); root.append(sezioneMix());
  }
  costruisci(); disegnaMix();
  addEventListener('resize',()=>{clearTimeout(window.__rz); window.__rz=setTimeout(disegnaMix,120)});
  (async function(){
    try{
      if(!window.claude||!claude.use) return;
      db=await claude.use('db'); if(!db) return;
      const snap=await db.collection('scelte').get();
      snap.docs.forEach(d=>{const x=d.data(); if(!x) return;
        if(d.id==='mescolatore'){ if(byId[x.lettermark]&&byId[x.wordmark]){mix.lettermark=x.lettermark; mix.wordmark=x.wordmark; mix.disp=x.disposizione||mix.disp; mix.fondo=x.fondo||mix.fondo; mix.nota=x.nota||''; mix.confermata=!!x.confermata} }
        else if(DATA.sezioni.some(s=>s.id===d.id)&&(x.variante&&byId[x.variante]||x.nota)) scelte[d.id]={variante:(x.variante&&byId[x.variante])?x.variante:'',nota:x.nota||''}});
      salvaLocale(); const ni=$('#nota-mix'); if(ni) ni.value=mix.nota||''; disegnaMix();
    }catch(e){db=null}
  })();
})();
</script>
</body>
</html>
"""

if __name__ == '__main__':
    main()
