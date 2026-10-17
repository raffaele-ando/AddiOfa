// Prova VERA contro il Worker ATLAS in locale. Si salta da sola se non c'è `ATLAS_URL_PROVA`.
// Come si lancia: in un terminale `cd atlas && cp .dev.vars.example .dev.vars && npm run migrate:local && npm run dev` (http://localhost:8787),
// in un altro `ATLAS_URL_PROVA=http://localhost:8787 npm test` da app/. I token «test:<uid>:<nome>» funzionano solo con ALLOW_TEST_TOKENS (locale).
import test from 'node:test';
import assert from 'node:assert/strict';
import { atlas, chiama, type MeRisposta, type Leaderboard } from '../../src/lib/atlas';
import { creaCoda, type ArchivioChiave } from '../../src/lib/progetto/coda';
import { corpoIscrizione, creaProfilo } from '../../src/lib/progetto/profilo';
import { ECOSYSTEM } from '../../src/config/ecosystem';

const URL_PROVA = process.env.ATLAS_URL_PROVA;
const salta = URL_PROVA ? false : 'ATLAS_URL_PROVA non impostata (serve il Worker locale)';
const sigla = Date.now().toString(36);
const email = `prova.${sigla}@mail.polimi.it`;
const token = `test:u${sigla}:Prova ${sigla}`;

function archivio(): ArchivioChiave {
  const m = new Map<string, string>();
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => { m.set(k, v); }, removeItem: k => { m.delete(k); } };
}

test('Worker locale: iscrizione inviata dalla coda, poi collegata, poi in classifica, poi cancellata', { skip: salta }, async () => {
  const c = creaCoda({ archivio: archivio(), baseUrl: URL_PROVA, online: () => true });
  const profilo = creaProfilo({ nome: 'Prova Locale', email, scuola: 'ing-ind-inf', sede: 'bovisa', livello: 'triennale', corso: 'Ingegneria Gestionale', anno: 2, provenienza: 'gruppo-chat', consensi: { noi: true } }, Date.now())!;
  const r = await c.accoda(corpoIscrizione(profilo));
  assert.equal(r?.stato, 'inviata', `stato: ${r?.stato} ${r?.messaggio ?? r?.motivo ?? ''}`);

  const opz = { baseUrl: URL_PROVA, token };
  // collegamento con il Project ID: l'iscrizione si lega all'email indicata
  const link = await chiama<MeRisposta>(`/v1/links/${ECOSYSTEM.appId}`, { method: 'PUT', body: JSON.stringify({ scopes: ['profile', 'noi.leaderboard'], consentVersion: '2026-09-27', polimiEmail: email }) }, true, opz);
  assert.equal(link.signup?.email, email);
  assert.equal(link.signup?.emailVerificata, false);
  assert.deepEqual(link.signup?.consensi, { noi: true, atlas: false, comunicazioni: false });
  assert.equal(link.profile?.corso, 'Ingegneria Gestionale');
  // il percorso di studi e la provenienza sono arrivati con i nomi dei campi nuovi
  assert.deepEqual([link.signup?.scuola, link.signup?.sede, link.signup?.livello, link.signup?.anno, link.signup?.provenienza], ['ing-ind-inf', 'bovisa', 'triennale', 2, 'gruppo-chat']);
  assert.equal(link.signup?.nome, 'Prova Locale');

  // punteggio e classifica (dati veri del Worker)
  await chiama(`/v1/noi/${ECOSYSTEM.appId}/score`, { method: 'POST', body: JSON.stringify({ mastered: 12, bestSim: 20 }) }, true, opz);
  const classifica = await chiama<Leaderboard>(`/v1/noi/${ECOSYSTEM.appId}/leaderboard?limit=100`, {}, false, opz);
  assert.ok(classifica.entries.some(e => e.mastered === 12 && e.bestSim === 20 && e.isMe), 'la mia voce è in classifica');
  assert.ok(classifica.me && classifica.me.rank >= 1);

  // ritiro del permesso: il punteggio sparisce subito
  await chiama(`/v1/links/${ECOSYSTEM.appId}`, { method: 'PUT', body: JSON.stringify({ scopes: ['profile'], consentVersion: '2026-09-27' }) }, true, opz);
  const dopo = await chiama<Leaderboard>(`/v1/noi/${ECOSYSTEM.appId}/leaderboard?limit=100`, {}, false, opz);
  assert.ok(!dopo.entries.some(e => e.isMe));

  // cancellazione dell'account: toglie anche l'iscrizione collegata
  await chiama('/v1/me', { method: 'DELETE' }, true, opz);
  const nuovo = await chiama<MeRisposta>('/v1/me', {}, true, opz);
  assert.equal(nuovo.signup ?? null, null);
});

test('Worker locale: email non PoliMi rifiutata (4xx = dati sbagliati, non si ritenta) e CORS non blocca la coda', { skip: salta }, async () => {
  const c = creaCoda({ archivio: archivio(), baseUrl: URL_PROVA, online: () => true });
  const r = await c.accoda({ appId: 'addiofa', nome: 'Falso', email: 'falso@gmail.com', consensi: { noi: false, atlas: false, comunicazioni: false }, consentVersion: 'iscrizione-2026-10-17' });
  assert.equal(r?.stato, 'rifiutata');
  assert.ok(/Politecnico|polimi/i.test(r?.messaggio ?? ''));
  await assert.rejects(() => atlas.iscrivi({ appId: 'addiofa', nome: 'X', email: 'x@evilpolimi.it', consensi: { noi: false, atlas: false, comunicazioni: false }, consentVersion: 'iscrizione-2026-10-17' }, { baseUrl: URL_PROVA }), /Politecnico|polimi/i);
});

test('Worker locale: senza token le rotte dell\'account rispondono 401', { skip: salta }, async () => {
  await assert.rejects(() => chiama('/v1/me', {}, true, { baseUrl: URL_PROVA, token: null }), (e: { stato?: number }) => e.stato === 401);
});

test('Worker locale: il nome si ricava dall\'email e i valori fuori elenco di scuola, livello, anno sono rifiutati', { skip: salta }, async () => {
  const base = { appId: 'addiofa', consensi: { noi: false, atlas: false, comunicazioni: false }, consentVersion: 'iscrizione-2026-10-17' };
  const mail = `anna.maria.rossi.${sigla}@mail.polimi.it`;
  await atlas.iscrivi({ ...base, nome: 'Anna Maria Rossi', email: mail }, { baseUrl: URL_PROVA });
  for (const campo of [{ scuola: 'luna' }, { livello: 'dottorato' }, { anno: 9 }]) {
    await assert.rejects(() => atlas.iscrivi({ ...base, nome: 'Anna Maria Rossi', email: `x${sigla}@polimi.it`, ...campo } as never, { baseUrl: URL_PROVA }), /non valido/);
  }
});
