// Prove di ATLAS contro un Worker vero (`wrangler dev --local`). Si lanciano con `npm test`.

import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { avvia, iscrizione, postJson, type Istanza } from './aiuti.ts';

const ADMIN = 'segreto-di-prova-con-abbastanza-caratteri';
const SITO = 'https://addiofa.example';

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
const elenco = async () => {
  const r = await dev.chiama('/v1/admin/signups?formato=json', { token: ADMIN, ip: nuovoIp() });
  assert.equal(r.status, 200);
  return (await r.json()) as { totale: number; iscrizioni: Record<string, string | number>[] };
};

describe('iscrizioni', () => {
  test('iscrizione valida: { ok: true } e riga con email normalizzata, non verificata', async () => {
    const r = await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: '  Mario.Rossi@MAIL.Polimi.it ' })), ip: nuovoIp() });
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { ok: true });
    const { iscrizioni } = await elenco();
    const riga = iscrizioni.find(i => i.email === 'mario.rossi@mail.polimi.it');
    assert.ok(riga, 'riga non trovata');
    assert.equal(riga.nome, 'Mario Rossi');
    assert.equal(riga.email_verificata, 0);
    assert.equal(riga.consenso_noi, 1);
    assert.equal(riga.consenso_atlas, 0);
    assert.equal(riga.consenso_comunicazioni, 1);
  });

  test('accetta polimi.it, mail.polimi.it e sottodomini', async () => {
    for (const email of ['a.b@polimi.it', 'a.c@mail.polimi.it', 'a.d@dei.polimi.it']) {
      const r = await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email })), ip: nuovoIp() });
      assert.equal(r.status, 200, email);
    }
  });

  test('rifiuta email non PoliMi, domini simili e forme sbagliate', async () => {
    const cattive = ['mario@gmail.com', 'mario@polimi.com', 'mario@evilpolimi.it', 'mario@polimi.it.evil.com',
      'mario@xpolimi.it', 'mario@@polimi.it', 'mario polimi.it', '@polimi.it', 'a b@polimi.it', '', 42, null];
    for (const email of cattive) {
      const r = await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email })), ip: nuovoIp() });
      assert.equal(r.status, 400, `email ${JSON.stringify(email)}`);
    }
    const { iscrizioni } = await elenco();
    assert.ok(!iscrizioni.some(i => String(i.email).includes('gmail') || String(i.email).includes('evil')));
  });

  test('rifiuta forma sbagliata: consensi non booleani, nome vuoto, app sconosciuta', async () => {
    const casi: Record<string, unknown>[] = [
      { consensi: { noi: 'si', atlas: false, comunicazioni: false } },
      { consensi: { noi: true } },
      { nome: '   ' },
      { consentVersion: '' },
      { appId: 'inesistente' },
      { corso: 'x'.repeat(500) },
    ];
    for (const caso of casi) {
      const r = await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: 'forma@polimi.it', ...caso })), ip: nuovoIp() });
      assert.ok(r.status === 400 || r.status === 404, `${JSON.stringify(caso)} -> ${r.status}`);
    }
    const r = await dev.chiama('/v1/signups', { method: 'POST', body: 'non json', ip: nuovoIp() });
    assert.equal(r.status, 400);
  });

  test('doppia iscrizione: idempotente, stessa risposta, una sola riga', async () => {
    const corpo = iscrizione({ email: 'doppia@polimi.it' });
    const a = await dev.chiama('/v1/signups', { ...postJson(corpo), ip: nuovoIp() });
    const b = await dev.chiama('/v1/signups', { ...postJson(corpo), ip: nuovoIp() });
    const c = await dev.chiama('/v1/signups', { ...postJson({ ...corpo, email: 'DOPPIA@polimi.it', nome: 'Mario R.' }), ip: nuovoIp() });
    for (const r of [a, b, c]) {
      assert.equal(r.status, 200);
      assert.deepEqual(await r.json(), { ok: true });
    }
    const righe = (await elenco()).iscrizioni.filter(i => i.email === 'doppia@polimi.it');
    assert.equal(righe.length, 1);
    assert.equal(righe[0].nome, 'Mario R.');
  });

  test('corpo troppo grande: 413', async () => {
    const r = await dev.chiama('/v1/signups', { ...postJson(iscrizione({ nome: 'x'.repeat(10_000) })), ip: nuovoIp() });
    assert.equal(r.status, 413);
  });

  test('limite di richieste per IP: 429 con Retry-After, un altro IP passa', async () => {
    const ip = '198.51.100.7';
    const stati: number[] = [];
    let ultima!: Response;
    for (let i = 0; i < 12; i++) {
      ultima = await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: `limite${i}@polimi.it` })), ip });
      stati.push(ultima.status);
    }
    assert.deepEqual(stati, [...Array(10).fill(200), 429, 429]);
    assert.ok(Number(ultima.headers.get('Retry-After')) >= 1);
    const altro = await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: 'limite-altro@polimi.it' })), ip: '198.51.100.8' });
    assert.equal(altro.status, 200);
  });

  test('DELETE pubblico non esiste (405) e GET non è consentito', async () => {
    const d = await dev.chiama('/v1/signups', { method: 'DELETE', body: JSON.stringify({ email: 'doppia@polimi.it' }), ip: nuovoIp() });
    assert.equal(d.status, 405);
    const g = await dev.chiama('/v1/signups', { ip: nuovoIp() });
    assert.equal(g.status, 405);
    assert.ok((await elenco()).iscrizioni.some(i => i.email === 'doppia@polimi.it'));
  });
});

describe('admin', () => {
  test('senza ADMIN_TOKEN impostato la rotta risponde 404, anche con un token', async () => {
    const senza = await prod.chiama('/v1/admin/signups?formato=csv', { ip: nuovoIp() });
    assert.equal(senza.status, 404);
    const con = await prod.chiama('/v1/admin/signups?formato=csv', { token: ADMIN, ip: nuovoIp() });
    assert.equal(con.status, 404);
    const vuoto = await prod.chiama('/v1/admin/signups', { token: '', ip: nuovoIp() });
    assert.equal(vuoto.status, 404);
  });

  test('con il segreto sbagliato o mancante: 401', async () => {
    assert.equal((await dev.chiama('/v1/admin/signups', { ip: nuovoIp() })).status, 401);
    assert.equal((await dev.chiama('/v1/admin/signups', { token: ADMIN + 'x', ip: nuovoIp() })).status, 401);
    assert.equal((await dev.chiama('/v1/admin/signups?token=' + ADMIN, { ip: nuovoIp() })).status, 401); // mai nell'URL
  });

  test('con il segreto: elenco JSON e CSV con la colonna consenso_comunicazioni', async () => {
    await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: 'csv@polimi.it', nome: '=HYPERLINK("http://x")', consensi: { noi: false, atlas: false, comunicazioni: false } })), ip: nuovoIp() });
    const j = await elenco();
    assert.ok(j.totale >= 1);
    assert.ok('consenso_comunicazioni' in j.iscrizioni[0]);
    const csv = await dev.chiama('/v1/admin/signups?formato=csv', { token: ADMIN, ip: nuovoIp() });
    assert.equal(csv.status, 200);
    assert.match(csv.headers.get('Content-Type') ?? '', /text\/csv/);
    const testo = await csv.text();
    const intestazione = testo.replace(/^﻿/, '').split('\r\n')[0].split(',');
    assert.ok(intestazione.includes('consenso_comunicazioni'));
    assert.ok(intestazione.includes('email_verificata'));
    assert.match(testo, /'=HYPERLINK/, 'le formule devono essere neutralizzate');
    const solo = await dev.chiama('/v1/admin/signups?formato=json&comunicazioni=1', { token: ADMIN, ip: nuovoIp() });
    const filtrate = (await solo.json()) as { iscrizioni: Record<string, number>[] };
    assert.ok(filtrate.iscrizioni.length >= 1 && filtrate.iscrizioni.every(i => i.consenso_comunicazioni === 1));
    assert.equal((await dev.chiama('/v1/admin/signups?formato=xml', { token: ADMIN, ip: nuovoIp() })).status, 400);
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

describe('Project ID e collegamento con l\'iscrizione', () => {
  const MARIA = 'test:maria:Maria';
  const LUCA = 'test:luca:Luca';
  const link = (token: string, extra: Record<string, unknown> = {}) => dev.chiama('/v1/links/addiofa', {
    method: 'PUT', token, ip: nuovoIp(), headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scopes: ['profile'], consentVersion: '2026-09-27', ...extra }),
  });

  test('token di prova: accettato solo con ALLOW_TEST_TOKENS; token falso 401', async () => {
    assert.equal((await dev.chiama('/v1/me', { token: MARIA, ip: nuovoIp() })).status, 200);
    assert.equal((await prod.chiama('/v1/me', { token: MARIA, ip: nuovoIp() })).status, 401);
    assert.equal((await prod.chiama('/v1/me', { token: 'aaa.bbb.ccc', ip: nuovoIp() })).status, 401);
    assert.equal((await prod.chiama('/v1/me', { ip: nuovoIp() })).status, 401);
  });

  test('PUT /v1/links con polimiEmail collega l\'iscrizione; /me ed export mostrano nome, corso, sede, consensi', async () => {
    await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: 'maria@polimi.it', nome: 'Maria B.', corso: 'Informatica', sede: 'Bovisa' })), ip: nuovoIp() });
    const r = await link(MARIA, { polimiEmail: ' Maria@POLIMI.it ' });
    assert.equal(r.status, 200);
    const me = (await (await dev.chiama('/v1/me', { token: MARIA, ip: nuovoIp() })).json()) as any;
    assert.equal(me.account.polimiEmail, 'maria@polimi.it');
    assert.deepEqual(me.profile, { nome: 'Maria B.', corso: 'Informatica', sede: 'Bovisa' });
    assert.deepEqual(me.consensi, { noi: true, atlas: false, comunicazioni: true });
    assert.equal(me.signup.email, 'maria@polimi.it');
    assert.equal(me.signup.emailVerificata, false);

    // una nuova iscrizione con consensi cambiati non passa più dal modulo pubblico (è collegata a un login)
    await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: 'maria@polimi.it', nome: 'Hacker', consensi: { noi: false, atlas: true, comunicazioni: false } })), ip: nuovoIp() });
    const dopo = (await (await dev.chiama('/v1/me', { token: MARIA, ip: nuovoIp() })).json()) as any;
    assert.equal(dopo.profile.nome, 'Maria B.');

    const ex = (await (await dev.chiama('/v1/me/export', { token: MARIA, ip: nuovoIp() })).json()) as any;
    assert.equal(ex.signup.corso, 'Informatica');
    assert.equal(ex.signupConsentLog.length, 1);
    assert.equal(ex.signupConsentLog[0].action, 'grant');
    assert.deepEqual(JSON.parse(ex.signupConsentLog[0].scopes), ['noi.leaderboard', 'comunicazioni']);
    assert.equal(ex.consentLog.length, 1); // il consenso del collegamento resta separato
  });

  test('un secondo account non si prende un\'iscrizione già collegata', async () => {
    assert.equal((await link(LUCA, { polimiEmail: 'maria@polimi.it' })).status, 200);
    const me = (await (await dev.chiama('/v1/me', { token: LUCA, ip: nuovoIp() })).json()) as any;
    assert.equal(me.signup, null);
    assert.equal(me.consensi, null);
  });

  test('l\'iscrizione che arriva dopo l\'email indicata si collega da sola; email non PoliMi rifiutata', async () => {
    const BEA = 'test:bea:Bea';
    assert.equal((await link(BEA, { polimiEmail: 'bea@gmail.com' })).status, 400);
    assert.equal((await link(BEA, { polimiEmail: 'bea@polimi.it' })).status, 200);
    assert.equal(((await (await dev.chiama('/v1/me', { token: BEA, ip: nuovoIp() })).json()) as any).signup, null);
    await dev.chiama('/v1/signups', { ...postJson(iscrizione({ email: 'bea@polimi.it', nome: 'Bea' })), ip: nuovoIp() });
    const me = (await (await dev.chiama('/v1/me', { token: BEA, ip: nuovoIp() })).json()) as any;
    assert.equal(me.signup?.nome, 'Bea');
  });

  test('registro dei consensi: grant, poi update solo se i consensi cambiano', async () => {
    const NINA = 'test:nina:Nina';
    const corpo = iscrizione({ email: 'nina@polimi.it', nome: 'Nina' });
    await dev.chiama('/v1/signups', { ...postJson(corpo), ip: nuovoIp() });
    await dev.chiama('/v1/signups', { ...postJson(corpo), ip: nuovoIp() }); // uguale: nessuna voce nuova
    await dev.chiama('/v1/signups', { ...postJson({ ...corpo, consensi: { noi: false, atlas: true, comunicazioni: false } }), ip: nuovoIp() });
    await link(NINA, { polimiEmail: 'nina@polimi.it' });
    const ex = (await (await dev.chiama('/v1/me/export', { token: NINA, ip: nuovoIp() })).json()) as any;
    assert.deepEqual(ex.signupConsentLog.map((l: any) => l.action), ['grant', 'update']);
    assert.deepEqual(JSON.parse(ex.signupConsentLog[1].scopes), ['atlas.personalize']);
    assert.equal(ex.signupConsentLog[1].consent_version, 'iscrizione-2026-10-16');
    assert.ok(ex.signupConsentLog[1].created_at > 0);
    assert.deepEqual(ex.consensi, { noi: false, atlas: true, comunicazioni: false });
  });

  test('PATCH /v1/me: polimiEmail, corso e sede', async () => {
    const r = await dev.chiama('/v1/me', {
      method: 'PATCH', token: MARIA, ip: nuovoIp(), headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corso: 'Ingegneria Elettrica', sede: 'Leonardo' }),
    });
    assert.equal(r.status, 200);
    const j = (await r.json()) as any;
    assert.deepEqual(j.profile, { nome: 'Maria B.', corso: 'Ingegneria Elettrica', sede: 'Leonardo' });
    const senza = await dev.chiama('/v1/me', {
      method: 'PATCH', token: 'test:zeno:Zeno', ip: nuovoIp(), headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corso: 'X' }),
    });
    assert.equal(senza.status, 409);
    const cattiva = await dev.chiama('/v1/me', {
      method: 'PATCH', token: MARIA, ip: nuovoIp(), headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ polimiEmail: 'maria@altro.it' }),
    });
    assert.equal(cattiva.status, 400);
  });

  test('DELETE /v1/me cancella anche l\'iscrizione collegata e il suo registro', async () => {
    assert.ok((await elenco()).iscrizioni.some(i => i.email === 'maria@polimi.it'));
    const r = await dev.chiama('/v1/me', { method: 'DELETE', token: MARIA, ip: nuovoIp() });
    assert.equal(r.status, 200);
    assert.ok(!(await elenco()).iscrizioni.some(i => i.email === 'maria@polimi.it'));
  });
});

describe('classifica NOI (invariata)', () => {
  const put = (token: string, scopes: string[]) => dev.chiama('/v1/links/addiofa', {
    method: 'PUT', token, ip: nuovoIp(), headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scopes, consentVersion: '2026-09-27' }),
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
    assert.equal(lista.total, 2);
    assert.deepEqual(lista.entries.map((e: any) => [e.rank, e.mastered, e.bestSim, e.isMe]), [[1, 40, 29, false], [2, 40, 27, true]]);
    assert.equal(lista.me.rank, 2);

    await put('test:a1:Anna', ['profile']);
    const dopo = (await (await dev.chiama('/v1/noi/addiofa/leaderboard', { ip: nuovoIp() })).json()) as any;
    assert.equal(dopo.total, 1);
  });

  test('scopes e health', async () => {
    const h = (await (await dev.chiama('/v1/health')).json()) as any;
    assert.equal(h.ok, true);
    const s = (await (await dev.chiama('/v1/scopes')).json()) as any;
    assert.ok(s.scopes['noi.leaderboard']);
  });
});
