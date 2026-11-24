#!/usr/bin/env python3
"""Schermate di AddiOFA in tema chiaro e scuro, a 400 px e 1280 px.

Uso:
  python3 scatta.py <URL_base> <cartella_output> [--solo NOME[,NOME...]] [--senza-2x] [--elenco]

Per ogni schermo e tema:
  <cartella>/<schermo>-400-<tema>.png        (viewport 400x2600, deviceScaleFactor 1)
  <cartella>/<schermo>-1280-<tema>.png       (viewport 1280x1800, deviceScaleFactor 1)
  <cartella>/hd/<schermo>-1280-<tema>.png    (viewport 1280x1800, deviceScaleFactor 2; salta con --senza-2x)
Scrive anche <cartella>/errori.json (errori di console, eccezioni, richieste fallite, scorrimento orizzontale)
e <cartella>/esito.json (per ogni schermo: raggiunto sì/no e motivo).

Il tema si imposta con localStorage 'theme' ('light' / 'dark'), come fa app/src/hooks/useTheme.ts.
Lo stato di prova (utente già registrato con una simulazione) si inietta in localStorage con la chiave
'ofa_polimi_app_state' solo se la chiave non c'è già (add_init_script), così ogni scatto parte da zero.
Le animazioni CSS e le transizioni si fermano allo stato finale, così gli scatti sono ripetibili.
"""
import argparse
import json
import os
import re
import sys
import time

from playwright.sync_api import sync_playwright

CHIAVE_STATO = 'ofa_polimi_app_state'
CHIAVE_TEMA = 'theme'
ESEGUIBILE = '/opt/pw-browsers/chromium'
LARGHEZZE = [(400, 2600), (1280, 1800)]
TEMI = [('chiaro', 'light'), ('scuro', 'dark')]

STILE_FERMO = (
    '*,*::before,*::after{animation-duration:0.001ms!important;animation-delay:0s!important;'
    'animation-iteration-count:1!important;transition-duration:0.001ms!important;'
    'transition-delay:0s!important;scroll-behavior:auto!important;caret-color:transparent!important}'
)


def stato_seme(profilo=True, storico=True):
    """Stato di prova: utente già registrato (test iniziale fatto), con una simulazione nello storico."""
    adesso = int(time.time() * 1000)
    giorno = 86400000
    st = {
        'stats': {},
        'history': [],
        'streak': 2,
        'lastActiveDate': adesso,
        'speedStats': {'minTimeMs': 3000, 'maxTimeMs': 15000, 'avgTimeMs': 8000, 'totalAnswers': 0},
        'examCategoryStats': {},
        'onboarding': {'completedAt': adesso - 5 * giorno, 'hasCertification': False, 'hasOfa': 'no',
                       'diagnosticCorrect': 9, 'diagnosticTotal': 15, 'passProbability': 0.4},
    }
    if storico:
        st['history'] = [{
            'id': 'sim-1', 'date': adesso - 3 * giorno, 'score': 21, 'passed': False,
            'timeSpentSeconds': 1140, 'categoryStats': {}, 'questionLogs': [], 'answers': {}, 'questionIds': [],
        }]
    if profilo:
        st['extra'] = {'progetto': {'profilo': {
            'nome': 'Mario Rossi', 'email': 'mario.rossi@polimi.it', 'emailVerificata': False,
            'consensi': {}, 'versioneInformativa': '', 'completato': True,
            'creatoIl': adesso - 5 * giorno, 'aggiornatoIl': adesso - 5 * giorno,
        }}}
    return st


SEMI = {
    None: None,
    'pieno': stato_seme(profilo=True, storico=True),
    # ha già fatto il test iniziale ma non ha ancora completato il profilo: il primo avvio porta a «Completa il profilo»
    'senza-profilo': stato_seme(profilo=False, storico=True),
}


def rispondi_tutte(page):
    """Simulazione: sceglie la prima risposta delle 30 domande e consegna (conferma nel riquadro)."""
    for i in range(30):
        ok = page.evaluate("""() => {
            const h = document.querySelector('h2[data-testo-ok]');
            if (!h || !h.nextElementSibling) return false;
            const b = h.nextElementSibling.querySelectorAll('button');
            if (!b.length) return false;
            b[0].click(); return true;
        }""")
        if not ok:
            raise RuntimeError(f'domanda {i + 1}: opzioni non trovate')
        page.wait_for_timeout(40)
        succ = page.get_by_role('button', name='Domanda successiva')
        if i < 29 and succ.count() and succ.first.is_enabled():
            succ.first.click()
            page.wait_for_timeout(40)
    page.get_by_role('button', name='Consegna', exact=True).first.click()
    page.wait_for_timeout(500)
    dlg = page.get_by_role('dialog')
    if dlg.count():
        dlg.get_by_role('button', name='Consegna').last.click()
    page.wait_for_timeout(2500)


def scorri(page, ms):
    """Scorre la pagina con la rotella (come chi legge), poi aspetta che le schede compaiano."""
    w = page.viewport_size['width']; h = page.viewport_size['height']
    page.mouse.move(w / 2, h / 2)
    for _ in range(12):
        page.mouse.wheel(0, 400)
        page.wait_for_timeout(120)
    page.wait_for_timeout(ms)


def clicca(page, nome, contiene=False):
    if contiene:
        rx = re.compile(re.escape(nome), re.I)
        loc = page.get_by_role('button', name=rx).filter(visible=True)
        if loc.count() == 0:
            loc = page.get_by_role('link', name=rx).filter(visible=True)
    else:
        loc = page.get_by_role('button', name=nome, exact=True).filter(visible=True)
    if loc.count() == 0:
        raise RuntimeError(f'nessun pulsante o link visibile «{nome}»')
    loc.first.click()
    page.wait_for_timeout(400)


def passo(page, p):
    tipo = p[0]
    if tipo == 'vai':
        page.goto(p[1], wait_until='networkidle')
        page.wait_for_timeout(900)
    elif tipo == 'clicca':
        clicca(page, p[1])
        page.wait_for_timeout(700)
    elif tipo == 'clicca_contiene':
        clicca(page, p[1], contiene=True)
        page.wait_for_timeout(700)
    elif tipo == 'scorri':
        scorri(page, p[1])
    elif tipo == 'simulazione_completa':
        rispondi_tutte(page)
    elif tipo == 'attendi':
        page.wait_for_timeout(p[1])
    else:
        raise ValueError(tipo)


# Ogni schermo: nome, semi di prova (chiave di SEMI), passi per raggiungerlo, nota.
SCHERMI = [
    dict(nome='landing', seme=None, passi=[('vai', '/?landing')], nota='Prima pagina per chi non ha ancora usato l’app (vista landing).'),
    dict(nome='landing-scorrimento', seme=None, passi=[('vai', '/?landing'), ('scorri', 1200)], nota='Landing dopo lo scorrimento: compaiono le schede sotto l’hero.'),
    dict(nome='test-iniziale', seme=None, passi=[('vai', '/?landing'), ('clicca_contiene', 'test')], nota='Landing → pulsante del test iniziale (vista onboarding/diagnostico).'),
    dict(nome='home', seme='pieno', passi=[('vai', '/')], nota='Home (vista menu) per utente già registrato con una simulazione nello storico.'),
    dict(nome='home-scorrimento', seme='pieno', passi=[('vai', '/'), ('scorri', 900)], nota='Home scorsa in basso.'),
    dict(nome='completa-profilo', seme='senza-profilo', passi=[('vai', '/')], nota='Primo avvio dopo il test: «Completa il profilo» (registrazione).'),
    dict(nome='esercizi', seme='pieno', passi=[('vai', '/'), ('clicca', 'Esercizi')], nota='Scheda Esercizi dalla barra in basso.'),
    dict(nome='prontuario', seme='pieno', passi=[('vai', '/'), ('clicca', 'Esercizi'), ('clicca_contiene', 'Riepilogo di grammatica')], nota='Prontuario (riepilogo di grammatica) dalla scheda Esercizi.'),
    dict(nome='frasi', seme='pieno', passi=[('vai', '/?vista=frasi')], nota='Frasi utili (vista extra frasi).'),
    dict(nome='allenamento', seme='pieno', passi=[('vai', '/'), ('clicca_contiene', 'Continua l’allenamento'), ('attendi', 800)], nota='Sessione di allenamento (LearnMode) avviata dal pulsante della Home.'),
    dict(nome='sfide', seme='pieno', passi=[('vai', '/'), ('clicca', 'Sfide')], nota='Scheda Sfide dalla barra in basso.'),
    dict(nome='classifica', seme='pieno', passi=[('vai', '/?vista=classifica')], nota='Classifica delle sfide.'),
    dict(nome='amici', seme='pieno', passi=[('vai', '/?vista=amici')], nota='Amici (sfide).'),
    dict(nome='condividi', seme='pieno', passi=[('vai', '/?vista=condividi')], nota='Condividi la sfida.'),
    dict(nome='sfida-accetta', seme='pieno', passi=[('vai', '/?sfida=ABC123')], nota='Accetta una sfida (link con codice di prova).'),
    dict(nome='lezione', seme='pieno', passi=[('vai', '/?vista=lezione-dettaglio&id=present-simple')], nota='Dettaglio di una lezione (teoria, esercizi, verifica).'),
    dict(nome='percorso', seme='pieno', passi=[('vai', '/?vista=percorso')], nota='Percorso con tutte le lezioni.'),
    dict(nome='teoria', seme='pieno', passi=[('vai', '/'), ('clicca_contiene', 'Inizia la lezione'), ('attendi', 800)], nota='Teoria di un argomento, aperta dalla Home («Inizia la lezione»).'),
    dict(nome='simulazioni', seme='pieno', passi=[('vai', '/?vista=simulazioni')], nota='Elenco delle simulazioni svolte.'),
    dict(nome='simulazione-dettaglio', seme='pieno', passi=[('vai', '/?vista=simulazione-dettaglio&id=sim-1')], nota='Esito di una simulazione svolta (dallo storico di prova).'),
    dict(nome='simulazione-esame', seme='pieno', passi=[('vai', '/'), ('clicca_contiene', 'Fai un’altra simulazione'), ('attendi', 1500)], nota='Simulazione d’esame, prima domanda (30 domande, 15 minuti).'),
    dict(nome='simulazione-risultato', seme='pieno', passi=[('vai', '/'), ('clicca_contiene', 'Fai un’altra simulazione'), ('attendi', 1200), ('simulazione_completa',)], nota='Simulazione consegnata con risposte scelte in automatico: schermata di esito reale.'),
    dict(nome='progressi', seme='pieno', passi=[('vai', '/?vista=progressi')], nota='Progressi (profilo).'),
    dict(nome='profilo', seme='pieno', passi=[('vai', '/?vista=profilo')], nota='Profilo.'),
    dict(nome='profilo-modifica', seme='pieno', passi=[('vai', '/?vista=profilo-modifica')], nota='Modifica del profilo.'),
    dict(nome='obiettivi', seme='pieno', passi=[('vai', '/?vista=obiettivi')], nota='Obiettivi.'),
    dict(nome='badge', seme='pieno', passi=[('vai', '/?vista=badge')], nota='Badge.'),
    dict(nome='impostazioni', seme='pieno', passi=[('vai', '/?vista=profilo'), ('clicca_contiene', 'Impostazioni')], nota='Impostazioni, dal Profilo (se il Profilo ha il pulsante).'),
    dict(nome='faq', seme='pieno', passi=[('vai', '/?vista=faq')], nota='Domande frequenti.'),
    dict(nome='segnala', seme='pieno', passi=[('vai', '/?vista=segnala')], nota='Segnala un problema.'),
    dict(nome='community', seme='pieno', passi=[('vai', '/?vista=esplora')], nota='Community (Esplora).'),
    dict(nome='noi', seme='pieno', passi=[('vai', '/?vista=noi')], nota='NOI (classifica e community).'),
    dict(nome='agora', seme='pieno', passi=[('vai', '/?vista=agora')], nota='Agorà.'),
    dict(nome='project-id', seme='pieno', passi=[('vai', '/?vista=projectid')], nota='Project ID (accesso).'),
    dict(nome='atlas', seme='pieno', passi=[('vai', '/?vista=atlas-analisi')], nota='ATLAS.'),
    dict(nome='stato-vuoto', seme='pieno', passi=[('vai', '/?vista=stato-vuoto')], nota='Stato vuoto («Niente da vedere»).'),
    dict(nome='offline', seme='pieno', passi=[('vai', '/?vista=offline')], nota='Schermata offline.'),
    dict(nome='avvio', seme='pieno', passi=[('vai', '/?vista=splash')], nota='Schermata di avvio (splash).'),
    dict(nome='iscrizioni-admin', seme='pieno', passi=[('vai', '/?vista=admin')], nota='Iscrizioni (vista amministratore; può chiedere accesso).'),
    dict(nome='legale-privacy', seme=None, passi=[('vai', '/?landing'), ('clicca_contiene', 'Come usiamo i tuoi dati')], nota='Informativa privacy, aperta da «Come usiamo i tuoi dati» nella landing.'),
]


def scatta_uno(browser, base, out, sc, larghezza, altezza, tema, nome_tema, dsf, errori, esito, hd=False):
    ctx = browser.new_context(
        viewport={'width': larghezza, 'height': altezza},
        device_scale_factor=dsf,
        color_scheme='light',
    )
    init = (
        "(() => { try {"
        f" localStorage.setItem('{CHIAVE_TEMA}', '{tema}');"
        + (f" if (!localStorage.getItem('{CHIAVE_STATO}')) localStorage.setItem('{CHIAVE_STATO}', {json.dumps(json.dumps(SEMI[sc['seme']]))});" if SEMI.get(sc['seme']) else '')
        + " } catch (e) {} })();"
    )
    ctx.add_init_script(init)
    ctx.add_init_script(
        "document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style');"
        f" s.textContent = {json.dumps(STILE_FERMO)}; document.head.appendChild(s); }});"
    )
    pagina = ctx.new_page()
    etichetta = f"{sc['nome']}-{larghezza}-{nome_tema}"
    def cattura_console(msg):
        if msg.type == 'error':
            errori.append({'schermo': sc['nome'], 'quando': etichetta, 'tipo': 'console', 'testo': msg.text[:400]})
    pagina.on('console', cattura_console)
    pagina.on('pageerror', lambda e: errori.append({'schermo': sc['nome'], 'quando': etichetta, 'tipo': 'eccezione', 'testo': str(e)[:400]}))
    pagina.on('requestfailed', lambda r: errori.append({'schermo': sc['nome'], 'quando': etichetta, 'tipo': 'richiesta-fallita', 'testo': f"{r.method} {r.url[:200]} {r.failure}"}))
    pagina.on('response', lambda r: errori.append({'schermo': sc['nome'], 'quando': etichetta, 'tipo': f'http-{r.status}', 'testo': r.url[:200]}) if r.status >= 400 and r.url.startswith(base) else None)
    motivo = None
    try:
        for p in sc['passi']:
            if p[0] == 'vai':
                pagina.goto(base.rstrip('/') + p[1], wait_until='load', timeout=30000)
                pagina.wait_for_timeout(1200)
            else:
                passo(pagina, p)
        pagina.wait_for_timeout(300)
        largo = pagina.evaluate("() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})")
        cartella = os.path.join(out, 'hd') if hd else out
        os.makedirs(cartella, exist_ok=True)
        file = os.path.join(cartella, f"{sc['nome']}-{larghezza}-{nome_tema}.png")
        pagina.screenshot(path=file, full_page=False)
        if not hd:
            esito.setdefault(sc['nome'], {})
            esito[sc['nome']].update({'raggiunto': True, 'nota': sc['nota']})
            esito[sc['nome']].setdefault('scorrimento_orizzontale', {})[f'{larghezza}-{nome_tema}'] = largo['sw'] > largo['cw']
            esito[sc['nome']].setdefault('file', {})[f'{larghezza}-{nome_tema}'] = file
    except Exception as e:  # passo non riuscito: lo schermo non è raggiunto
        motivo = f'{type(e).__name__}: {str(e).splitlines()[0][:300]}'
        if not hd:
            esito.setdefault(sc['nome'], {}).update({'raggiunto': False, 'motivo': motivo, 'nota': sc['nota']})
        try:
            pagina.screenshot(path=os.path.join(out, f"NON-RAGGIUNTO-{sc['nome']}-{larghezza}-{nome_tema}.png"))
        except Exception:
            pass
    finally:
        ctx.close()
    return motivo


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('base')
    ap.add_argument('out')
    ap.add_argument('--solo', default='')
    ap.add_argument('--senza-2x', action='store_true')
    ap.add_argument('--elenco', action='store_true')
    ap.add_argument('--schermi-json', default='')
    a = ap.parse_args()

    if a.elenco:
        for s in SCHERMI:
            print(s['nome'], '|', s['nota'])
        return
    if a.schermi_json:
        dati = {
            'come': 'Viewport 400x2600 e 1280x1800, deviceScaleFactor 1; 1280 anche a 2 in hd/. Tema via localStorage theme (light/dark). '
                    'Stato di prova iniettato in localStorage ofa_polimi_app_state (pieno = registrato con una simulazione; senza-profilo = test fatto, profilo da completare). '
                    'Animazioni e transizioni fermate con uno stile iniettato. Navigazione: ?vista=<schermata> oppure clic sui pulsanti indicati.',
            'schermi': [{'nome': s['nome'], 'stato_di_prova': s['seme'], 'passi': [list(p) for p in s['passi']], 'nota': s['nota']} for s in SCHERMI],
        }
        with open(a.schermi_json, 'w', encoding='utf-8') as f:
            json.dump(dati, f, ensure_ascii=False, indent=2)
        print('scritto', a.schermi_json, len(SCHERMI), 'schermi')
        return

    os.makedirs(a.out, exist_ok=True)
    filtro = set(x for x in a.solo.split(',') if x)
    schermi = [s for s in SCHERMI if not filtro or s['nome'] in filtro]
    errori, esito = [], {}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=ESEGUIBILE, args=['--no-sandbox'])
        for sc in schermi:
            for larghezza, altezza in LARGHEZZE:
                for nome_tema, tema in TEMI:
                    scatta_uno(browser, a.base, a.out, sc, larghezza, altezza, tema, nome_tema, 1, errori, esito)
                    if larghezza == 1280 and not a.senza_2x:
                        scatta_uno(browser, a.base, a.out, sc, larghezza, altezza, tema, nome_tema, 2, errori, esito, hd=True)
            print('ok', sc['nome'], esito.get(sc['nome'], {}).get('raggiunto'), esito.get(sc['nome'], {}).get('motivo', ''), flush=True)
        browser.close()

    # Dedup degli errori: stesso messaggio, più schermi
    vista = {}
    for e in errori:
        k = (e['tipo'], e['testo'])
        vista.setdefault(k, {'tipo': e['tipo'], 'testo': e['testo'], 'schermi': set()})['schermi'].add(e['schermo'])
    riepilogo = [{'tipo': v['tipo'], 'testo': v['testo'], 'schermi': sorted(v['schermi'])} for v in vista.values()]
    with open(os.path.join(a.out, 'errori.json'), 'w', encoding='utf-8') as f:
        json.dump({'totale_eventi': len(errori), 'distinti': riepilogo}, f, ensure_ascii=False, indent=2)
    with open(os.path.join(a.out, 'esito.json'), 'w', encoding='utf-8') as f:
        json.dump(esito, f, ensure_ascii=False, indent=2)
    print('FINE', 'schermi:', len(schermi), 'eventi errore:', len(errori), 'distinti:', len(riepilogo), flush=True)


if __name__ == '__main__':
    main()
