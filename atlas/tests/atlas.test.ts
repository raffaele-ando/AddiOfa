// Prove di ATLAS contro un Worker vero (`wrangler dev --local`). Si lanciano con `npm test`.

import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { avvia, postJson, wranglerD1, RADICE, type Istanza } from './aiuti.ts';

const ADMIN = 'segreto-di-prova-con-abbastanza-caratteri';
const SITO = 'https://addiofa.example';
const V = '2026-10-17'; // CONSENT_VERSION (src/scopes.ts)

let dev: Istanza;   // sviluppo: token di prova, ADMIN_TOKEN, CORS con *
let prod: Istanza;  // come in produzione: niente token di prova, niente ADMIN_TOKEN

before(async () => {
  [dev, prod] = await Promise.all([
    avvia({ ALLOW_TEST_TOKENS: 'true', ADMIN_TOKEN: ADMIN, ALLOWED_ORIGINS: `${SITO},*` }),
    avvia({ ALLOW_TEST_TOKENS: 'false', ALLOWED_ORIGINS: SITO, ADMIN_TOKEN: '' }),
  ]);
});
after(async () => { await Promise.all([dev?.ferma(), prod?.ferma()]); });

let ipN = 10;
const nuovoIp = () => `203.0.113.${ipN++}`;
const json = (corpo: unknown) => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
const patch = (token: string, corpo: unknown) => dev.chiama('/v1/me', { method: 'PATCH', token, ip: nuovoIp(), ...json(corpo) });
const me = async (token: string) => (await (await dev.chiama('/v1/me', { token, ip: nuovoIp() })).json()) as any;

describe('niente raccolta anonima', () => {
  test('POST /v1/signups non esiste più: 410 con qualunque corpo, nessun «ok» che non fa niente', async () => {
    const corpo = { appId: 'addiofa', email: 'mario.rossi@mail.polimi.it', consensi: { noi: true, comunicazioni: true }, consentVersion: V };
    for (const richiesta of [postJson(corpo), postJson({}), { method: 'GET' }, { method: 'DELETE' }]) {
      const r = await dev.chiama('/v1/signups', { ...richiesta, ip: nuovoIp() });
      assert.equal(r.status, 410);
      const testo = await r.text();
      assert.match(testo, /Project ID/);
      assert.ok(!/"ok":\s*true/.test(testo));
    }
  });

  test('le rotte dell\'account senza token rispondono 401: nessun dato si legge né si scrive da anonimi', async () => {
    for (const [metodo, percorso] of [['GET', '/v1/me'], ['PATCH', '/v1/me'], ['DELETE', '/v1/me'], ['GET', '/v1/me/export'], ['PUT', '/v1/links/addiofa']]) {
      assert.equal((await dev.chiama(percorso, { method: metodo, ip: nuovoIp() })).status, 401, `${metodo} ${percorso}`);
    }
  });
});

describe('migrazione 0004', () => {
  test('su un database con dati delle migrazioni precedenti: righe conservate, colonne inutili tolte, colonne nuove vuote', () => {
    const dir = mkdtempSync(join(tmpdir(), 'atlas-mig-'));
    const migrazioni = join(dir, 'migrazioni');
    mkdirSync(migrazioni);
    for (const f of ['0001_init.sql', '0002_signups.sql', '0003_percorso_studi.sql']) copyFileSync(join(RADICE, 'migrations', f), join(migrazioni, f));
    const config = join(dir, 'wrangler.jsonc');
    writeFileSync(config, JSON.stringify({
      name: 'atlas', compatibility_date: '2026-09-01',
      d1_databases: [{ binding: 'DB', database_name: 'atlas', database_id: 'fae6dddc-a787-474b-9699-e23bab53eb4d', migrations_dir: migrazioni }],
    }));
    const dati = join(dir, 'dati');
    wranglerD1(dati, config, ['migrations', 'apply', 'atlas']);
    wranglerD1(dati, config, ['execute', 'atlas', '--command',
      `INSERT INTO accounts (id, auth_uid, display_name, handle, created_at, updated_at, polimi_email) VALUES ('PRJ-1', 'u', 'N', 'n1', 1, 1, 'vecchio@polimi.it');
       INSERT INTO signups (email, nome, app_id, corso, sede, provenienza, scuola, livello, anno, consent_version, account_id, created_at, updated_at)
         VALUES ('vecchio@polimi.it', 'Vecchio', 'addiofa', 'Gestionale', 'leonardo', 'amici', 'icat', 'triennale', 2, 'v1', 'PRJ-1', 5, 6);
       INSERT INTO consent_log (account_id, signup_id, app_id, action, scopes, consent_version, created_at)
         VALUES (NULL, 1, 'addiofa', 'grant', '[]', 'v1', 5);`]);
    copyFileSync(join(RADICE, 'migrations', '0004_consensi_unificati.sql'), join(migrazioni, '0004_consensi_unificati.sql'));
    wranglerD1(dati, config, ['migrations', 'apply', 'atlas']);
    const interroga = (sql: string) => JSON.parse(wranglerD1(dati, config, ['execute', 'atlas', '--json', '--command', sql]))[0].results;
    assert.deepEqual(interroga('SELECT email, nome, account_id FROM signups'), [{ email: 'vecchio@polimi.it', nome: 'Vecchio', account_id: 'PRJ-1' }]);
    const colonneSignups = interroga("SELECT name FROM pragma_table_info('signups')").map((r: any) => r.name);
    for (const tolta of ['scuola', 'livello', 'anno', 'corso', 'sede', 'provenienza', 'consenso_atlas']) assert.ok(!colonneSignups.includes(tolta), tolta);
    const colonneAccounts = interroga("SELECT name FROM pragma_table_info('accounts')").map((r: any) => r.name);
    assert.ok(!colonneAccounts.includes('polimi_email'));
    for (const nuova of ['comunicazioni_email', 'comunicazioni_stato', 'comunicazioni_at']) assert.ok(colonneAccounts.includes(nuova), nuova);
    assert.deepEqual(interroga('SELECT id, comunicazioni_stato FROM accounts'), [{ id: 'PRJ-1', comunicazioni_stato: null }]);
    assert.equal(interroga('SELECT COUNT(*) AS n FROM consent_log')[0].n, 1);
  });
});

describe('admin: comunicazioni', () => {
  test('senza ADMIN_TOKEN impostato la rotta risponde 404, anche con un token; la vecchia rotta delle iscrizioni non c\'è più', async () => {
    assert.equal((await prod.chiama('/v1/admin/comunicazioni?formato=csv', { ip: nuovoIp() })).status, 404);
    assert.equal((await prod.chiama('/v1/admin/comunicazioni?formato=csv', { token: ADMIN, ip: nuovoIp() })).status, 404);
    assert.equal((await dev.chiama('/v1/admin/signups', { token: ADMIN, ip: nuovoIp() })).status, 404);
  });

  test('con il segreto sbagliato o mancante: 401 (e mai nell\'URL)', async () => {
    assert.equal((await dev.chiama('/v1/admin/comunicazioni', { ip: nuovoIp() })).status, 401);
    assert.equal((await dev.chiama('/v1/admin/comunicazioni', { token: ADMIN + 'x', ip: nuovoIp() })).status, 401);
    assert.equal((await dev.chiama('/v1/admin/comunicazioni?token=' + ADMIN, { ip: nuovoIp() })).status, 401);
  });

  test('con il segreto: elenco JSON e CSV di chi ha dato il consenso (stato in attesa); filtro «confermato» vuoto; formato sbagliato 400', async () => {
    assert.equal((await patch('test:adm1:Adm', { consensi: { comunicazioni: true }, comunicazioniEmail: 'Lista@Gmail.com' })).status, 200);
    const j = (await (await dev.chiama('/v1/admin/comunicazioni?formato=json', { token: ADMIN, ip: nuovoIp() })).json()) as any;
    const mia = j.comunicazioni.find((r: any) => r.email_comunicazioni === 'lista@gmail.com');
    assert.ok(mia);
    assert.equal(mia.stato, 'in-attesa');
    const csv = await dev.chiama('/v1/admin/comunicazioni?formato=csv', { token: ADMIN, ip: nuovoIp() });
    assert.match(csv.headers.get('Content-Type') ?? '', /text\/csv/);
    const testo = await csv.text();
    assert.deepEqual(testo.replace(/^﻿/, '').split('\r\n')[0].split(','), ['project_id', 'email_comunicazioni', 'stato', 'consenso_dal', 'creato']);
    assert.match(testo, /lista@gmail\.com/);
    const confermati = (await (await dev.chiama('/v1/admin/comunicazioni?formato=json&stato=confermato', { token: ADMIN, ip: nuovoIp() })).json()) as any;
    assert.equal(confermati.totale, 0);
    assert.equal((await dev.chiama('/v1/admin/comunicazioni?formato=xml', { token: ADMIN, ip: nuovoIp() })).status, 400);
    // spenta la casella, l'indirizzo sparisce dall'elenco
    await patch('test:adm1:Adm', { consensi: { comunicazioni: false } });
    const dopo = (await (await dev.chiama('/v1/admin/comunicazioni?formato=json', { token: ADMIN, ip: nuovoIp() })).json()) as any;
    assert.ok(!dopo.comunicazioni.some((r: any) => r.email_comunicazioni === 'lista@gmail.com'));
  });
});

describe('CORS', () => {
  test('origine consentita: eco dell\'origine; OPTIONS 204 con gli header giusti', async () => {
    const o = await prod.chiama('/v1/signups', { method: 'OPTIONS', headers: { Origin: SITO, 'Access-Control-Request-Method': 'POST' }, ip: nuovoIp() });
    assert.equal(o.status, 204);
    assert.equal(o.headers.get('Access-Control-Allow-Origin'), SITO);
    assert.match(o.headers.get('Access-Control-Allow-Methods') ?? '', /POST/);
    assert.match(o.headers.get('Access-Control-Allow-Headers') ?? '', /Authorization/);
    assert.match(o.headers.get('Vary') ?? '', /Origin/);
    const g = await prod.chiama('/v1/health', { headers: { Origin: SITO } });
    assert.equal(g.headers.get('Access-Control-Allow-Origin'), SITO);
  });

  test('origine non consentita: nessun Access-Control-Allow-Origin, anche in OPTIONS', async () => {
    const o = await prod.chiama('/v1/signups', { method: 'OPTIONS', headers: { Origin: 'https://cattivo.example' }, ip: nuovoIp() });
    assert.equal(o.headers.get('Access-Control-Allow-Origin'), null);
    const g = await prod.chiama('/v1/health', { headers: { Origin: 'https://cattivo.example' } });
    assert.equal(g.headers.get('Access-Control-Allow-Origin'), null);
  });

  test('"*" vale solo in sviluppo', async () => {
    const d = await dev.chiama('/v1/health', { headers: { Origin: 'https://qualunque.example' } });
    assert.equal(d.headers.get('Access-Control-Allow-Origin'), '*');
    const prodStar = await avvia({ ALLOW_TEST_TOKENS: 'false', ALLOWED_ORIGINS: '*' });
    try {
      const p = await prodStar.chiama('/v1/health', { headers: { Origin: 'https://qualunque.example' } });
      assert.equal(p.headers.get('Access-Control-Allow-Origin'), null);
    } finally { await prodStar.ferma(); }
  });
});

describe('Project ID: account, consensi, cancellazione', () => {
  const MARIA = 'test:maria:Maria';
  const LUCA = 'test:luca:Luca';

  test('token di prova: accettato solo con ALLOW_TEST_TOKENS; token falso 401', async () => {
    assert.equal((await dev.chiama('/v1/me', { token: MARIA, ip: nuovoIp() })).status, 200);
    assert.equal((await prod.chiama('/v1/me', { token: MARIA, ip: nuovoIp() })).status, 401);
    assert.equal((await prod.chiama('/v1/me', { token: 'aaa.bbb.ccc', ip: nuovoIp() })).status, 401);
    assert.equal((await prod.chiama('/v1/me', { ip: nuovoIp() })).status, 401);
  });

  test('il primo accesso crea l\'account con il minimo: email, identificativo, @nome neutro; niente nome né foto; nessun consenso', async () => {
    const q = await me('test:neutro:Nome Segreto Rossi');
    assert.match(q.account.id, /^PRJ-/);
    assert.match(q.account.handle, /^studente\d{4}$/);
    assert.equal(q.account.email, 'neutro@example.test');
    assert.deepEqual(Object.keys(q.account).sort(), ['createdAt', 'email', 'handle', 'id']);
    assert.ok(!JSON.stringify(q).includes('Segreto'));
    assert.deepEqual(q.consensi, { noi: false, comunicazioni: null });
    assert.equal(q.consentVersion, V);
    assert.deepEqual(q.links, []);
  });

  test('PATCH: @nome utente e controlli; i campi che non si conoscono sono un errore, non un «ok» che non fa niente', async () => {
    const r = await patch(MARIA, { handle: 'Maria.Rossi_1' });
    assert.equal(r.status, 200);
    assert.equal(((await r.json()) as any).account.handle, 'maria.rossi_1');
    assert.equal((await patch(LUCA, { handle: 'maria.rossi_1' })).status, 409);
    assert.equal((await patch(LUCA, { handle: 'a' })).status, 400);
    for (const campo of [{ polimiEmail: 'x@polimi.it' }, { corso: 'Gestionale' }, { scuola: 'icat' }, { provenienza: 'amici' }, { consensi: { atlas: true } }]) {
      const e = await patch(LUCA, campo);
      assert.equal(e.status, 400, JSON.stringify(campo));
      assert.match(await e.text(), /non riconosciut/);
    }
    assert.equal((await patch(LUCA, { consensi: { noi: 'sì' } })).status, 400);
  });

  test('classifica NOI: un tocco per entrare, un tocco per uscire (il punteggio sparisce subito), senza eliminare l\'account; registro unico', async () => {
    const T = 'test:noi1:Noi';
    assert.deepEqual((await me(T)).consensi.noi, false);
    const on = (await (await patch(T, { consensi: { noi: true } })).json()) as any;
    assert.equal(on.consensi.noi, true);
    assert.deepEqual(on.links[0].scopes, ['profile', 'noi.leaderboard']);
    assert.equal(on.links[0].consentVersion, V);
    // lo stesso valore due volte: niente righe doppie nel registro
    await patch(T, { consensi: { noi: true } });
    assert.equal((await dev.chiama('/v1/noi/addiofa/score', { method: 'POST', token: T, ip: nuovoIp(), ...json({ mastered: 10, bestSim: 20 }) })).status, 200);
    const off = (await (await patch(T, { consensi: { noi: false } })).json()) as any;
    assert.equal(off.consensi.noi, false);
    assert.equal(off.account.id, on.account.id, 'l\'account c\'è ancora');
    const lista = (await (await dev.chiama('/v1/noi/addiofa/leaderboard', { token: T, ip: nuovoIp() })).json()) as any;
    assert.ok(!lista.entries.some((e: any) => e.isMe), 'il punteggio è sparito');
    assert.equal((await dev.chiama('/v1/noi/addiofa/score', { method: 'POST', token: T, ip: nuovoIp(), ...json({ mastered: 1, bestSim: 1 }) })).status, 403);
    const ex = (await (await dev.chiama('/v1/me/export', { token: T, ip: nuovoIp() })).json()) as any;
    assert.deepEqual(ex.consentLog.map((l: any) => l.action), ['grant', 'update']);
    assert.ok(ex.consentLog.every((l: any) => l.consent_version === V));
  });

  test('classifica: in elenco solo @nome utente, domande imparate e miglior punteggio (mai nome, foto o email)', async () => {
    const T = 'test:noi2:Persona Vera';
    await patch(T, { consensi: { noi: true } });
    await dev.chiama('/v1/noi/addiofa/score', { method: 'POST', token: T, ip: nuovoIp(), ...json({ mastered: 5, bestSim: 5 }) });
    const lista = (await (await dev.chiama('/v1/noi/addiofa/leaderboard', { ip: nuovoIp() })).json()) as any;
    const mia = lista.entries.find((e: any) => e.mastered === 5 && e.bestSim === 5);
    assert.deepEqual(Object.keys(mia).sort(), ['bestSim', 'handle', 'isMe', 'mastered', 'rank']);
    assert.ok(!JSON.stringify(lista).includes('Persona'));
    assert.ok(!JSON.stringify(lista).includes('example.test'));
  });

  test('comunicazioni: indirizzo qualunque (anche personale), stato «in attesa» perché la conferma con link non esiste ancora; revoca con un tocco e l\'indirizzo si cancella', async () => {
    const T = 'test:com1:Com';
    assert.equal((await patch(T, { consensi: { comunicazioni: true } })).status, 400, 'serve un indirizzo');
    assert.equal((await patch(T, { consensi: { comunicazioni: true }, comunicazioniEmail: 'non-una-email' })).status, 400);
    const on = (await (await patch(T, { consensi: { comunicazioni: true }, comunicazioniEmail: ' Persona.Qualunque@Gmail.com ' })).json()) as any;
    assert.equal(on.consensi.comunicazioni.stato, 'in-attesa');
    assert.equal(on.consensi.comunicazioni.email, 'persona.qualunque@gmail.com');
    assert.ok(on.consensi.comunicazioni.dal > 0);
    // ripetere lo stesso non duplica il registro; cambiare indirizzo è un «update»
    await patch(T, { consensi: { comunicazioni: true }, comunicazioniEmail: 'persona.qualunque@gmail.com' });
    await patch(T, { consensi: { comunicazioni: true }, comunicazioniEmail: 'altra@posta.it' });
    const off = (await (await patch(T, { consensi: { comunicazioni: false } })).json()) as any;
    assert.equal(off.consensi.comunicazioni, null);
    assert.ok(!JSON.stringify(off).includes('posta.it'));
    assert.equal((await me(T)).account.id, off.account.id);
    const ex = (await (await dev.chiama('/v1/me/export', { token: T, ip: nuovoIp() })).json()) as any;
    assert.deepEqual(ex.consentLog.map((l: any) => [l.action, l.scopes]), [['grant', '["comunicazioni"]'], ['update', '["comunicazioni"]'], ['revoke', '["comunicazioni"]']]);
    assert.ok(ex.consentLog.every((l: any) => l.consent_version === V));
    // spegnere di nuovo non scrive niente
    await patch(T, { consensi: { comunicazioni: false } });
    const ex2 = (await (await dev.chiama('/v1/me/export', { token: T, ip: nuovoIp() })).json()) as any;
    assert.equal(ex2.consentLog.length, 3);
  });

  test('i due consensi sono indipendenti: spegnere uno non tocca l\'altro', async () => {
    const T = 'test:due:Due';
    await patch(T, { consensi: { noi: true, comunicazioni: true }, comunicazioniEmail: 'due@posta.it' });
    const r = (await (await patch(T, { consensi: { noi: false } })).json()) as any;
    assert.equal(r.consensi.noi, false);
    assert.equal(r.consensi.comunicazioni.email, 'due@posta.it');
    const r2 = (await (await patch(T, { consensi: { comunicazioni: false } })).json()) as any;
    assert.equal(r2.consensi.comunicazioni, null);
  });

  test('PUT /v1/links: solo permessi veri (profilo e classifica); versione vecchia 409; permessi che non esistono più 400', async () => {
    const put = (token: string, corpo: unknown) => dev.chiama('/v1/links/addiofa', { method: 'PUT', token, ip: nuovoIp(), ...json(corpo) });
    assert.equal((await put(LUCA, { scopes: ['profile'], consentVersion: '2026-09-27' })).status, 409);
    assert.equal((await put(LUCA, { scopes: ['profile', 'atlas.personalize'], consentVersion: V })).status, 400);
    assert.equal((await put(LUCA, { scopes: ['profile', 'progress.share'], consentVersion: V })).status, 400);
    assert.equal((await put(LUCA, { scopes: [], consentVersion: V })).status, 400);
    assert.equal((await put(LUCA, { scopes: ['profile'], consentVersion: V })).status, 200);
    const s = (await (await dev.chiama('/v1/scopes')).json()) as any;
    assert.deepEqual(Object.keys(s.scopes), ['profile', 'noi.leaderboard']);
    assert.equal(s.consentVersion, V);
  });

  test('DELETE /v1/me cancella tutto: account, collegamenti, punteggio, comunicazioni, registro', async () => {
    const T = 'test:del1:Del';
    await patch(T, { consensi: { noi: true, comunicazioni: true }, comunicazioniEmail: 'del@posta.it' });
    await dev.chiama('/v1/noi/addiofa/score', { method: 'POST', token: T, ip: nuovoIp(), ...json({ mastered: 3, bestSim: 3 }) });
    const prima = await me(T);
    assert.equal((await dev.chiama('/v1/me', { method: 'DELETE', token: T, ip: nuovoIp() })).status, 200);
    const dopo = await me(T);
    assert.notEqual(dopo.account.id, prima.account.id, 'un nuovo accesso crea un account vuoto');
    assert.deepEqual(dopo.consensi, { noi: false, comunicazioni: null });
    const ex = (await (await dev.chiama('/v1/me/export', { token: T, ip: nuovoIp() })).json()) as any;
    assert.deepEqual(ex.consentLog, []);
    assert.deepEqual(ex.noiScores, []);
    const elenco = (await (await dev.chiama('/v1/admin/comunicazioni?formato=json', { token: ADMIN, ip: nuovoIp() })).json()) as any;
    assert.ok(!elenco.comunicazioni.some((r: any) => r.email_comunicazioni === 'del@posta.it'));
  });
});

describe('classifica NOI', () => {
  const put = (token: string, scopes: string[]) => dev.chiama('/v1/links/addiofa', {
    method: 'PUT', token, ip: nuovoIp(), headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scopes, consentVersion: V }),
  });
  const punteggio = (token: string, body: unknown) => dev.chiama('/v1/noi/addiofa/score', {
    method: 'POST', token, ip: nuovoIp(), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });

  test('punteggio = imparate x 100 + simulazione; ordine; senza consenso 403; revoca toglie il punteggio', async () => {
    assert.equal((await put('test:a1:Anna', ['profile', 'noi.leaderboard'])).status, 200);
    assert.equal((await put('test:b1:Berto', ['profile', 'noi.leaderboard'])).status, 200);
    assert.equal((await put('test:c1:Carla', ['profile'])).status, 200);

    assert.deepEqual(await (await punteggio('test:a1:Anna', { mastered: 40, bestSim: 27 })).json(), { score: 4027, mastered: 40, bestSim: 27 });
    await punteggio('test:b1:Berto', { mastered: 40, bestSim: 29 });
    assert.equal((await punteggio('test:c1:Carla', { mastered: 99, bestSim: 30 })).status, 403);
    assert.equal((await punteggio('test:a1:Anna', { mastered: 9999, bestSim: 1 })).status, 400);

    const lista = (await (await dev.chiama('/v1/noi/addiofa/leaderboard', { token: 'test:a1:Anna', ip: nuovoIp() })).json()) as any;
    assert.deepEqual(lista.entries.slice(0, 2).map((e: any) => [e.rank, e.mastered, e.bestSim, e.isMe]), [[1, 40, 29, false], [2, 40, 27, true]]);
    assert.equal(lista.me.rank, 2);

    await put('test:a1:Anna', ['profile']);
    const dopo = (await (await dev.chiama('/v1/noi/addiofa/leaderboard', { ip: nuovoIp() })).json()) as any;
    assert.ok(!dopo.entries.some((e: any) => e.mastered === 40 && e.bestSim === 27));
  });

  test('scopes e health', async () => {
    const h = (await (await dev.chiama('/v1/health')).json()) as any;
    assert.equal(h.ok, true);
    const s = (await (await dev.chiama('/v1/scopes')).json()) as any;
    assert.ok(s.scopes['noi.leaderboard']);
  });
});
