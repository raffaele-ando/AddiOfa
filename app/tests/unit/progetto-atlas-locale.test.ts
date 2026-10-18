// Prova VERA contro il Worker ATLAS in locale. Si salta da sola se non c'è `ATLAS_URL_PROVA`.
// Come si lancia: in un terminale `cd atlas && cp .dev.vars.example .dev.vars && npm run migrate:local && npm run dev` (http://localhost:8787),
// in un altro `ATLAS_URL_PROVA=http://localhost:8787 npm test` da app/. I token «test:<uid>:<nome>» funzionano solo con ALLOW_TEST_TOKENS (locale).
// Il modello: nessun invio senza account; consensi (classifica NOI, comunicazioni) con PATCH /v1/me, spenti di partenza e revocabili senza eliminare l'account.
import test from 'node:test';
import assert from 'node:assert/strict';
import { atlas, chiama, type MeRisposta, type Leaderboard } from '../../src/lib/atlas';
import { ECOSYSTEM } from '../../src/config/ecosystem';

const URL_PROVA = process.env.ATLAS_URL_PROVA;
const salta = URL_PROVA ? false : 'ATLAS_URL_PROVA non impostata (serve il Worker locale)';
const sigla = Date.now().toString(36);
const token = `test:u${sigla}:Prova ${sigla}`;
const opz = { baseUrl: URL_PROVA, token };
const mia = <T,>(percorso: string, init: RequestInit = {}) => chiama<T>(percorso, init, true, opz);
const patch = (corpo: unknown) => mia<MeRisposta>('/v1/me', { method: 'PATCH', body: JSON.stringify(corpo) });

test('Worker locale: l\'account nasce neutro, con tutti i consensi spenti', { skip: salta }, async () => {
  const me = await mia<MeRisposta>('/v1/me');
  assert.match(me.account.handle, /^studente\d{4}$/);
  assert.equal(me.consensi.noi, false);
  assert.equal(me.consensi.comunicazioni, null);
  assert.ok(!('signup' in me) && !('displayName' in me.account));
});

test('Worker locale: classifica NOI si accende e si spegne con PATCH; il punteggio sparisce subito; l\'account resta', { skip: salta }, async () => {
  await patch({ handle: `prova_${sigla}`.slice(0, 20) });
  const acceso = await patch({ consensi: { noi: true } });
  assert.equal(acceso.consensi.noi, true);
  await mia(`/v1/noi/${ECOSYSTEM.appId}/score`, { method: 'POST', body: JSON.stringify({ mastered: 12, bestSim: 20 }) });
  const classifica = await chiama<Leaderboard>(`/v1/noi/${ECOSYSTEM.appId}/leaderboard?limit=100`, {}, false, opz);
  const io = classifica.entries.find(e => e.isMe);
  assert.ok(io && io.mastered === 12 && io.bestSim === 20, 'la mia voce è in classifica');
  assert.ok(io!.handle.startsWith('prova_'));
  assert.ok(!('displayName' in io!));

  const spento = await patch({ consensi: { noi: false } });
  assert.equal(spento.consensi.noi, false);
  const dopo = await chiama<Leaderboard>(`/v1/noi/${ECOSYSTEM.appId}/leaderboard?limit=100`, {}, false, opz);
  assert.ok(!dopo.entries.some(e => e.isMe));
  assert.equal((await mia<MeRisposta>('/v1/me')).account.id, acceso.account.id);
});

test('Worker locale: comunicazioni con email qualunque, in attesa di conferma, revoca che cancella l\'indirizzo', { skip: salta }, async () => {
  await assert.rejects(() => patch({ consensi: { comunicazioni: true } }), (e: { stato?: number }) => e.stato === 400);
  await assert.rejects(() => patch({ consensi: { comunicazioni: true }, comunicazioniEmail: 'non-una-email' }), (e: { stato?: number }) => e.stato === 400);
  const email = `Persona.${sigla}@Gmail.com`;
  const acceso = await patch({ consensi: { comunicazioni: true }, comunicazioniEmail: email });
  assert.equal(acceso.consensi.comunicazioni?.stato, 'in-attesa');
  assert.equal(acceso.consensi.comunicazioni?.email, email.toLowerCase());
  const spento = await patch({ consensi: { comunicazioni: false } });
  assert.equal(spento.consensi.comunicazioni, null);
});

test('Worker locale: un campo sconosciuto in PATCH è un errore, non un «ok» che non fa niente', { skip: salta }, async () => {
  await assert.rejects(() => patch({ corso: 'Ingegneria' }), (e: { stato?: number }) => e.stato === 400);
  await assert.rejects(() => patch({ consensi: { atlas: true } }), (e: { stato?: number }) => e.stato === 400);
  await assert.rejects(() => patch({ handle: 'a b' }), (e: { stato?: number }) => e.stato === 400);
});

test('Worker locale: POST /v1/signups non esiste più (410) e senza token le rotte dell\'account rispondono 401', { skip: salta }, async () => {
  await assert.rejects(() => chiama('/v1/signups', { method: 'POST', body: '{}' }, false, { baseUrl: URL_PROVA, token: null }), (e: { stato?: number }) => e.stato === 410);
  await assert.rejects(() => chiama('/v1/me', {}, true, { baseUrl: URL_PROVA, token: null }), (e: { stato?: number }) => e.stato === 401);
  await assert.rejects(() => atlas.modifica({ consensi: { noi: true } }), () => true); // senza login nel test non c'è token
});

test('Worker locale: esporta e cancella; dopo la cancellazione l\'account riparte da zero', { skip: salta }, async () => {
  await patch({ consensi: { noi: true } });
  const esportati = await mia<{ account: { id: string }; consensi?: unknown; consentLog?: unknown[] }>('/v1/me/export');
  assert.ok(esportati.account.id);
  await mia('/v1/me', { method: 'DELETE' });
  const nuovo = await mia<MeRisposta>('/v1/me');
  assert.notEqual(nuovo.account.id, esportati.account.id);
  assert.equal(nuovo.consensi.noi, false);
});
