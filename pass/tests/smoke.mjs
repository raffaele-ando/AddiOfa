// Prova di fumo contro un Worker in esecuzione (npm run dev). Nessuna dipendenza: Node 20+ con fetch e node:test.
// Prerequisiti: migrazione e seed-prova.sql applicati in locale, pass/.dev.vars come tests/dev.vars.example.
//   BASE=http://127.0.0.1:8787  STRIPE_WEBHOOK_SECRET=whsec_prova_locale  node --test tests/smoke.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { execSync } from 'node:child_process';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8787';
const SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_prova_locale';
const ORIGIN = 'http://localhost:5173'; // deve stare in ALLOWED_ORIGINS

const rnd = () => randomBytes(16).toString('hex'); // 32 caratteri alfanumerici
async function api(method, path, { device, token, body, headers = {}, raw } = {}) {
  const h = { ...headers };
  if (device) h['X-Device'] = device;
  if (token) h.Authorization = `Bearer ${token}`;
  if (body !== undefined && !raw) h['Content-Type'] = 'application/json';
  const res = await fetch(BASE + path, { method, headers: h, body: raw ?? (body === undefined ? undefined : JSON.stringify(body)) });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { /* corpo vuoto */ }
  return { status: res.status, data, text, headers: res.headers };
}

function sign(body, { t = Math.floor(Date.now() / 1000), secret = SECRET } = {}) {
  return `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')}`;
}
function stripeEvent({ eventId, sessionId, userId, paid = true }) {
  return JSON.stringify({
    id: eventId, type: 'checkout.session.completed', created: Math.floor(Date.now() / 1000),
    data: { object: {
      id: sessionId, client_reference_id: userId, payment_status: paid ? 'paid' : 'unpaid', amount_total: 999, currency: 'eur',
      customer_details: { email: 'cliente@example.com' }, metadata: { terms_ts: String(Date.now()), waiver_ts: String(Date.now()) },
    } },
  });
}
async function userId(device) {
  const r = await api('GET', '/v1/me/export', { device });
  assert.equal(r.status, 200);
  return r.data.user.id;
}
async function giveWebhookPass(device) {
  const uid = await userId(device);
  const body = stripeEvent({ eventId: 'evt_' + rnd(), sessionId: 'cs_test_' + rnd(), userId: uid });
  const r = await api('POST', '/v1/stripe/webhook', { raw: body, headers: { 'Stripe-Signature': sign(body) } });
  assert.equal(r.status, 200);
  return uid;
}

/** Risposte esatte di una simulazione, come le troverebbe un client: usa batch+check sui testi (le opzioni sono rimescolate). */
async function correctIndexes(device, session) {
  const batch = await api('POST', '/v1/q/batch', { device, body: { ids: session.questions.map(q => q.id) } });
  assert.equal(batch.status, 200);
  const out = {};
  for (const q of session.questions) {
    const orig = batch.data.questions.find(x => x.id === q.id);
    const chk = await api('POST', `/v1/q/${q.id}/check`, { device, body: { idx: 0 } });
    assert.equal(chk.status, 200);
    out[q.id] = q.options.indexOf(orig.options[chk.data.correctIndex]);
    assert.ok(out[q.id] >= 0);
  }
  return out;
}
function mixAnswers(session, correct, nCorrect, nWrong) {
  const answers = {};
  session.questions.forEach((q, i) => {
    if (i < nCorrect) answers[q.id] = correct[q.id];
    else if (i < nCorrect + nWrong) answers[q.id] = (correct[q.id] + 1) % q.options.length;
    else answers[q.id] = null;
  });
  return answers;
}

test('health e rotta sconosciuta', async () => {
  const r = await api('GET', '/v1/health');
  assert.equal(r.status, 200);
  assert.equal(r.data.ok, true);
  const nf = await api('GET', '/v1/nulla');
  assert.equal(nf.status, 404);
  assert.equal(nf.data.error, 'not_found');
  assert.equal(typeof nf.data.message, 'string');
});

test('CORS: solo le origini consentite', async () => {
  const ok = await fetch(BASE + '/v1/health', { method: 'OPTIONS', headers: { Origin: ORIGIN } });
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get('access-control-allow-origin'), ORIGIN);
  assert.match(ok.headers.get('access-control-allow-headers'), /X-Device/);
  const no = await fetch(BASE + '/v1/health', { headers: { Origin: 'https://evil.example' } });
  assert.equal(no.headers.get('access-control-allow-origin'), null);
});

test('identita: serve un token o X-Device', async () => {
  assert.equal((await api('GET', '/v1/entitlement')).data.error, 'identity_required');
  assert.equal((await api('GET', '/v1/entitlement', { device: 'corto' })).data.error, 'bad_device');
  assert.equal((await api('GET', '/v1/entitlement', { token: 'x.y.z' })).status, 401);
  const unverified = await api('GET', '/v1/entitlement', { token: 'test:u1:a@example.com:unverified' });
  assert.equal(unverified.status, 403);
  assert.equal(unverified.data.error, 'email_not_verified');
  const verified = await api('GET', '/v1/entitlement', { token: `test:${rnd()}:a@example.com` });
  assert.equal(verified.status, 200);
});

test('entitlement gratuito e domanda del nucleo senza risposta nel payload', async () => {
  const device = rnd();
  const ent = await api('GET', '/v1/entitlement', { device });
  assert.deepEqual(ent.data, { tier: 'free', source: 'none', expiresAt: null });

  const r = await api('POST', '/v1/q/batch', { device, body: { ids: ['T001'] } });
  assert.equal(r.status, 200);
  const q = r.data.questions[0];
  assert.deepEqual(Object.keys(q).sort(), ['category', 'grammarTopic', 'id', 'level', 'options', 'prompt']);
  assert.equal(q.options.length, 4);
  assert.ok(!/correct|explanation|theory/i.test(r.text), 'nel payload non deve comparire la risposta');

  const chk = await api('POST', '/v1/q/T001/check', { device, body: { idx: 1 } });
  assert.deepEqual(chk.data, { correct: true, correctIndex: 1, explanation: 'Con she serve la -s del present simple: goes.', theoryId: 'present-simple' });
  assert.equal((await api('POST', '/v1/q/T001/check', { device, body: { idx: 0 } })).data.correct, false);
  assert.equal((await api('POST', '/v1/q/T001/check', { device, body: { idx: 9 } })).status, 400);
  assert.equal((await api('POST', '/v1/q/NESSUNA/check', { device, body: { idx: 0 } })).status, 404);
});

test('domanda non del nucleo: 403 pass_required', async () => {
  const device = rnd();
  const b = await api('POST', '/v1/q/batch', { device, body: { ids: ['T001', 'T004'] } });
  assert.equal(b.status, 403);
  assert.equal(b.data.error, 'pass_required');
  assert.deepEqual(b.data.blocked, ['T004']);
  const c = await api('POST', '/v1/q/T004/check', { device, body: { idx: 1 } });
  assert.equal(c.status, 403);
  assert.equal(c.data.error, 'pass_required');
  assert.ok(!/explanation|correctIndex/.test(c.text));
});

test('webhook Stripe: firma valida, errata, vecchia e consegna ripetuta', async () => {
  const device = rnd();
  const uid = await userId(device);
  const eventId = 'evt_' + rnd(), sessionId = 'cs_test_' + rnd();
  const body = stripeEvent({ eventId, sessionId, userId: uid });

  const bad = await api('POST', '/v1/stripe/webhook', { raw: body, headers: { 'Stripe-Signature': sign(body, { secret: 'whsec_sbagliato' }) } });
  assert.equal(bad.status, 400);
  assert.equal(bad.data.error, 'bad_signature');
  assert.equal((await api('POST', '/v1/stripe/webhook', { raw: body })).status, 400);
  const old = await api('POST', '/v1/stripe/webhook', { raw: body, headers: { 'Stripe-Signature': sign(body, { t: Math.floor(Date.now() / 1000) - 3600 }) } });
  assert.equal(old.status, 400, 'oltre i 5 minuti di tolleranza');
  assert.equal((await api('GET', '/v1/entitlement', { device })).data.tier, 'free', 'nulla concesso con firma errata');

  const ok = await api('POST', '/v1/stripe/webhook', { raw: body, headers: { 'Stripe-Signature': sign(body) } });
  assert.equal(ok.status, 200);
  const ent = await api('GET', '/v1/entitlement', { device });
  assert.equal(ent.data.tier, 'pass');
  assert.equal(ent.data.source, 'stripe');
  const months = (ent.data.expiresAt - Date.now()) / (30.44 * 86400000);
  assert.ok(months > 11.9 && months < 12.1, `12 mesi, trovati ${months}`);

  // Stessa consegna ripetuta, e stessa sessione con un altro evento: niente secondo Pass ne' secondo ordine
  const again = await api('POST', '/v1/stripe/webhook', { raw: body, headers: { 'Stripe-Signature': sign(body) } });
  assert.equal(again.status, 200);
  assert.equal(again.data.duplicate, true);
  const other = stripeEvent({ eventId: 'evt_' + rnd(), sessionId, userId: uid });
  assert.equal((await api('POST', '/v1/stripe/webhook', { raw: other, headers: { 'Stripe-Signature': sign(other) } })).status, 200);
  const exp = (await api('GET', '/v1/me/export', { device })).data;
  assert.equal(exp.entitlements.length, 1);
  assert.equal(exp.orders.length, 1);
  assert.equal(exp.orders[0].amount_cents, 999);
  assert.ok(exp.orders[0].consent_ts > 0 && exp.orders[0].waiver_ts > 0);

  // Pagamento non completato: ignorato
  const dev2 = rnd(); const uid2 = await userId(dev2);
  const unpaid = stripeEvent({ eventId: 'evt_' + rnd(), sessionId: 'cs_test_' + rnd(), userId: uid2, paid: false });
  assert.equal((await api('POST', '/v1/stripe/webhook', { raw: unpaid, headers: { 'Stripe-Signature': sign(unpaid) } })).status, 200);
  assert.equal((await api('GET', '/v1/entitlement', { device: dev2 })).data.tier, 'free');
});

test('con il Pass: domande a pagamento accessibili', async () => {
  const device = rnd();
  await giveWebhookPass(device);
  const b = await api('POST', '/v1/q/batch', { device, body: { ids: ['T001', 'T004', 'T005'] } });
  assert.equal(b.status, 200);
  assert.equal(b.data.questions.length, 3);
  const c = await api('POST', '/v1/q/T004/check', { device, body: { idx: 1 } });
  assert.equal(c.status, 200);
  assert.equal(c.data.correct, true);
});

test('esame gratuito: solo ente, una volta, solo nucleo, senza risposte', async () => {
  const device = rnd();
  const teng = await api('POST', '/v1/exam/start', { device, body: { format: 'teng' } });
  assert.equal(teng.status, 403);
  assert.equal(teng.data.error, 'pass_required');
  assert.equal((await api('POST', '/v1/exam/start', { device, body: { format: 'zzz' } })).status, 400);

  const s = await api('POST', '/v1/exam/start', { device, body: { format: 'ente' } });
  assert.equal(s.status, 200);
  assert.equal(s.data.format, 'ente');
  assert.match(s.data.id, /^EX-/);
  assert.ok(s.data.questions.length >= 1);
  assert.ok(s.data.questions.every(q => q.options.length === 4));
  assert.ok(s.data.questions.every(q => ['T001', 'T002', 'T003'].includes(q.id) || q.id.startsWith('X')), 'solo domande del nucleo');
  assert.ok(!/correct|explanation|theory/i.test(s.text));

  // Riaprendo senza consegnare si riprende la stessa simulazione
  const again = await api('POST', '/v1/exam/start', { device, body: { format: 'ente' } });
  assert.equal(again.data.id, s.data.id);

  const correct = await correctIndexes(device, s.data);
  const done = await api('POST', `/v1/exam/${s.data.id}/submit`, { device, body: { answers: mixAnswers(s.data, correct, s.data.questions.length, 0), elapsed: 60 } });
  assert.equal(done.status, 200);
  assert.equal(done.data.rawCorrect, s.data.questions.length);
  assert.equal(done.data.wrong, 0);
  assert.equal(done.data.timedOut, false);
  assert.ok(done.data.perQuestion.every(p => p.correct === true && typeof p.explanation === 'string' && p.explanation.length > 0));

  const second = await api('POST', '/v1/exam/start', { device, body: { format: 'ente' } });
  assert.equal(second.status, 403, 'la simulazione gratuita e una sola');
  assert.equal(second.data.error, 'pass_required');

  // Un altro utente non puo consegnare l'esame altrui
  const stranger = await api('POST', `/v1/exam/${s.data.id}/submit`, { device: rnd(), body: { answers: {}, elapsed: 1 } });
  assert.equal(stranger.status, 404);
});

test('esame con Pass: punteggio ente e TENG con penalita calcolato dal server', async (ctx) => {
  const device = rnd();
  await giveWebhookPass(device);

  // ENTE: 4 opzioni, nessuna penalita
  const e = await api('POST', '/v1/exam/start', { device, body: { format: 'ente' } });
  assert.equal(e.status, 200);
  const n = e.data.questions.length;
  assert.ok(e.data.questions.every(q => q.options.length === 4));
  const ce = await correctIndexes(device, e.data);
  const bad = await api('POST', `/v1/exam/${e.data.id}/submit`, { device, body: { answers: { [e.data.questions[0].id]: 99 }, elapsed: 5 } });
  assert.equal(bad.status, 400, 'indice fuori intervallo');
  const nc = Math.min(2, n), nw = Math.min(2, n - nc);
  const re = await api('POST', `/v1/exam/${e.data.id}/submit`, { device, body: { answers: mixAnswers(e.data, ce, nc, nw), elapsed: 100 } });
  assert.equal(re.status, 200);
  assert.deepEqual([re.data.rawCorrect, re.data.wrong, re.data.omitted], [nc, nw, n - nc - nw]);
  assert.equal(re.data.score, nc, 'nessuna penalita nel formato ente');
  assert.equal(re.data.passed, nc >= 25);
  const rep = await api('POST', `/v1/exam/${e.data.id}/submit`, { device, body: { answers: {}, elapsed: 1 } });
  assert.deepEqual(rep.data, re.data, 'consegna ripetuta: stesso esito');

  // TENG: 5 opzioni, -0,25 per errore
  const t = await api('POST', '/v1/exam/start', { device, body: { format: 'teng' } });
  assert.equal(t.status, 200);
  const nt = t.data.questions.length;
  assert.ok(t.data.questions.every(q => q.options.length === 5));
  assert.ok(!t.data.questions.some(q => q.id === 'T003'), 'T003 non ha la quinta opzione');
  const ct = await correctIndexes(device, t.data);
  const tc = Math.min(2, nt), tw = Math.min(1, nt - tc);
  const rt = await api('POST', `/v1/exam/${t.data.id}/submit`, { device, body: { answers: mixAnswers(t.data, ct, tc, tw), elapsed: 100 } });
  assert.equal(rt.status, 200);
  assert.deepEqual([rt.data.rawCorrect, rt.data.wrong, rt.data.omitted], [tc, tw, nt - tc - tw]);
  assert.equal(rt.data.score, tc - tw * 0.25);

  // Soglie vere, solo se il banco ha 30 domande per formato
  ctx.diagnostic(`soglie 30/30 provate: ente=${n === 30}, teng=${nt === 30}`);
  if (n === 30) {
    const e2 = await api('POST', '/v1/exam/start', { device, body: { format: 'ente' } });
    const c2 = await correctIndexes(device, e2.data);
    const r25 = await api('POST', `/v1/exam/${e2.data.id}/submit`, { device, body: { answers: mixAnswers(e2.data, c2, 25, 5), elapsed: 300 } });
    assert.equal(r25.data.passed, true, '25/30 supera il formato ente');
    const e3 = await api('POST', '/v1/exam/start', { device, body: { format: 'ente' } });
    const c3 = await correctIndexes(device, e3.data);
    assert.equal((await api('POST', `/v1/exam/${e3.data.id}/submit`, { device, body: { answers: mixAnswers(e3.data, c3, 24, 6), elapsed: 300 } })).data.passed, false, '24/30 non basta per ente');
  }
  if (nt === 30) {
    const t2 = await api('POST', '/v1/exam/start', { device, body: { format: 'teng' } });
    const c4 = await correctIndexes(device, t2.data);
    const r24 = await api('POST', `/v1/exam/${t2.data.id}/submit`, { device, body: { answers: mixAnswers(t2.data, c4, 24, 6), elapsed: 300 } });
    assert.equal(r24.data.passed, true, '24/30 supera il TENG');
    assert.equal(r24.data.score, 22.5);
  }
});

test('esame fuori tempo: oltre 15 minuti + 20 secondi non si supera (se e possibile ritoccare il DB locale)', async (t) => {
  const device = rnd();
  await giveWebhookPass(device);
  const e = await api('POST', '/v1/exam/start', { device, body: { format: 'ente' } });
  const old = Date.now() - (15 * 60 + 25) * 1000;
  try {
    execSync(`npx wrangler d1 execute addiofa-pass --local --command "UPDATE exams SET started_at = ${old} WHERE id = '${e.data.id}'"`, { stdio: 'ignore' });
  } catch { t.skip('wrangler d1 execute non disponibile'); return; }
  // Il comando puo far ricaricare il server locale: si aspetta che risponda di nuovo
  for (let i = 0; i < 30; i++) {
    try { if ((await fetch(BASE + '/v1/health')).ok) break; } catch { /* riprova */ }
    await new Promise(r => setTimeout(r, 500));
  }
  const c = await correctIndexes(device, e.data);
  const r = await api('POST', `/v1/exam/${e.data.id}/submit`, { device, body: { answers: mixAnswers(e.data, c, e.data.questions.length, 0), elapsed: 10 } });
  assert.equal(r.status, 200);
  assert.equal(r.data.timedOut, true);
  assert.equal(r.data.passed, false);
  assert.equal(r.data.rawCorrect, e.data.questions.length, 'il punteggio si calcola comunque');
});

test('lista d\'attesa: idempotente, senza consenso rifiutata', async () => {
  const email = `Prova.${rnd().slice(0, 8)}@Example.com`;
  const body = { email, audience: 'recupero', consent: true };
  const a = await api('POST', '/v1/waitlist', { body });
  assert.equal(a.status, 200);
  assert.equal(a.data.ok, true);
  assert.equal(a.data.stored, 'server');
  const b = await api('POST', '/v1/waitlist', { body: { ...body, email: email.toLowerCase(), audience: 'prevenzione' } });
  assert.equal(b.status, 200);
  assert.deepEqual(b.data, a.data);
  const noConsent = await api('POST', '/v1/waitlist', { body: { ...body, email: `x${rnd().slice(0, 6)}@example.com`, consent: false } });
  assert.equal(noConsent.status, 400);
  assert.equal(noConsent.data.error, 'consent_required');
  assert.equal((await api('POST', '/v1/waitlist', { body: { email: 'non-una-email', audience: 'recupero', consent: true } })).status, 400);
  assert.equal((await api('POST', '/v1/waitlist', { body: { email: 'a@example.com', audience: 'boh', consent: true } })).status, 400);
});

test('eventi e recesso', async () => {
  assert.equal((await api('POST', '/v1/event', { body: { name: 'paywall_seen' } })).status, 200);
  assert.equal((await api('POST', '/v1/event', { body: { name: 'sim_done', format: 'teng', passed: false } })).status, 200);
  assert.equal((await api('POST', '/v1/event', { body: { name: 'inventato' } })).data.error, 'bad_event');
  const w = await api('POST', '/v1/withdraw', { body: { name: 'Mario Rossi', email: 'mario@example.com', orderRef: 'cs_test_1' } });
  assert.equal(w.status, 200);
  assert.match(w.data.receiptId, /^REC-/);
  assert.ok(Math.abs(w.data.at - Date.now()) < 60000);
  assert.equal(w.data.stored, 'server');
  assert.equal((await api('POST', '/v1/withdraw', { body: { name: 'M', email: 'x' } })).status, 400);
});

test('pagamenti spenti: checkout 503 payments_off', async () => {
  const r = await api('POST', '/v1/checkout', { device: rnd(), body: { terms: true, waiver: true }, headers: { Origin: ORIGIN } });
  assert.equal(r.status, 503);
  assert.equal(r.data.error, 'payments_off');
});

test('inviti: codice, dominio sbagliato, verifica email e Pass con 3 verificati', async (t) => {
  const inviter = rnd();
  const c1 = await api('POST', '/v1/invites', { device: inviter });
  const c2 = await api('POST', '/v1/invites', { device: inviter });
  assert.equal(c1.status, 200);
  assert.match(c1.data.code, /^OFA-[2-9A-HJ-NP-Z]{6}$/);
  assert.equal(c2.data.code, c1.data.code, 'un solo codice per utente');
  assert.deepEqual((await api('GET', '/v1/invites/progress', { device: inviter })).data, { code: c1.data.code, verified: 0, required: 3 });
  assert.equal((await api('POST', '/v1/invites/redeem', { device: inviter, body: { code: c1.data.code } })).data.error, 'own_code');

  const invitee = rnd();
  assert.equal((await api('POST', '/v1/invites/redeem', { device: invitee, body: { code: 'OFA-ZZZZZZ' } })).status, 404);
  const wrongDomain = await api('POST', '/v1/invites/verify/start', { device: invitee, body: { email: 'mario@gmail.com' } });
  assert.equal(wrongDomain.status, 400);
  assert.equal(wrongDomain.data.error, 'domain_not_allowed');
  assert.equal((await api('POST', '/v1/invites/verify/start', { device: invitee, body: { email: 'mario+x@mail.polimi.it' } })).status, 400, 'niente alias con +');
  assert.equal((await api('POST', '/v1/invites/verify/start', { device: invitee, body: { email: 'mario@polimi.it' } })).data.error, 'domain_not_allowed');

  const probe = await api('POST', '/v1/invites/verify/start', { device: invitee, body: { email: `${rnd().slice(0, 8)}@mail.polimi.it` } });
  if (probe.status === 501) {
    assert.equal(probe.data.error, 'email_not_configured');
    t.skip('invio email non configurato (501): resto del flusso non provabile senza DEV_RETURN_CODE');
    return;
  }
  assert.equal(probe.status, 200);
  assert.match(probe.data.devCode, /^\d{6}$/);

  async function makeVerified(seconds, email = `${rnd().slice(0, 10)}@mail.polimi.it`) {
    const dev = rnd();
    assert.equal((await api('POST', '/v1/invites/redeem', { device: dev, body: { code: c1.data.code } })).status, 200);
    const start = await api('POST', '/v1/invites/verify/start', { device: dev, body: { email } });
    assert.equal(start.status, 200);
    const wrong = await api('POST', '/v1/invites/verify/confirm', { device: dev, body: { email, code: start.data.devCode === '000000' ? '111111' : '000000' } });
    assert.equal(wrong.data.error, 'code_wrong');
    const ok = await api('POST', '/v1/invites/verify/confirm', { device: dev, body: { email, code: start.data.devCode } });
    assert.equal(ok.status, 200);
    assert.equal(ok.data.verified, true);
    const ev = await api('POST', '/v1/event', { device: dev, body: { name: 'diag_done', audience: 'recupero', seconds } });
    assert.equal(ev.status, 200);
    return { dev, email };
  }
  const progress = async () => (await api('GET', '/v1/invites/progress', { device: inviter })).data.verified;

  await makeVerified(100);                        // diagnostico troppo corto: non conta
  assert.equal(await progress(), 0);
  const first = await makeVerified(300);
  assert.equal(await progress(), 1);

  // La stessa email non conta due volte
  const dup = rnd();
  await api('POST', '/v1/invites/redeem', { device: dup, body: { code: c1.data.code } });
  const dupStart = await api('POST', '/v1/invites/verify/start', { device: dup, body: { email: first.email } });
  assert.equal(dupStart.status, 409);
  assert.equal(dupStart.data.error, 'email_already_used');

  await makeVerified(240);
  assert.equal((await api('GET', '/v1/entitlement', { device: inviter })).data.tier, 'free', 'con 2 verificati niente Pass');
  await makeVerified(500);
  assert.equal(await progress(), 3);
  const ent = (await api('GET', '/v1/entitlement', { device: inviter })).data;
  assert.equal(ent.tier, 'pass');
  assert.equal(ent.source, 'invite');
  const months = (ent.expiresAt - Date.now()) / (30.44 * 86400000);
  assert.ok(months > 11.9 && months < 12.1);
  await makeVerified(500); // un quarto invitato non genera un secondo Pass
  assert.equal((await api('GET', '/v1/me/export', { device: inviter })).data.entitlements.length, 1);
});

test('dati personali: esportazione e cancellazione', async () => {
  const device = rnd();
  await giveWebhookPass(device);
  const exp = await api('GET', '/v1/me/export', { device });
  assert.equal(exp.status, 200);
  assert.equal(exp.data.entitlements.length, 1);
  const del = await api('DELETE', '/v1/me', { device });
  assert.deepEqual(del.data, { deleted: true });
  // Lo stesso dispositivo riparte da zero, senza Pass
  assert.equal((await api('GET', '/v1/entitlement', { device })).data.tier, 'free');
});

test('login: il dispositivo anonimo diventa l\'account al primo accesso', async () => {
  const device = rnd();
  const uidBefore = await giveWebhookPass(device);
  const token = `test:${rnd()}:persona@example.com`;
  const withLogin = await api('GET', '/v1/me/export', { device, token });
  assert.equal(withLogin.data.user.id, uidBefore, 'stesso utente, ora con login');
  assert.equal(withLogin.data.user.hasLogin, true);
  assert.equal((await api('GET', '/v1/entitlement', { token })).data.tier, 'pass', 'il Pass resta anche solo col login');
});

test('limite giornaliero: 429 oltre 600 richieste per identita', async () => {
  const device = rnd();
  let last;
  for (let i = 0; i < 601; i++) {
    last = await api('POST', '/v1/q/T001/check', { device, body: { idx: 0 } });
    if (last.status === 429) break;
  }
  assert.equal(last.status, 429);
  assert.equal(last.data.error, 'rate_limited');
});
