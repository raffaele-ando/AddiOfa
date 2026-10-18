// All'avvio non si invia niente a nessuno: la vecchia coda dell'iscrizione non esiste più. `coda.avvia()` non fa richieste di rete e toglie solo la coda
// salvata dalle versioni precedenti (conteneva nome ed email). L'Onboarding non importa né Firebase né ATLAS né la coda.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHIAVE_CODA, coda, ripulisciVecchiaCoda } from '../../src/lib/progetto/coda';

function archivio(iniziale: Record<string, string> = {}) {
  const mappa = new Map(Object.entries(iniziale));
  return { mappa, getItem: (k: string) => mappa.get(k) ?? null, removeItem: (k: string) => { mappa.delete(k); } };
}

test('vecchia coda: se c\'è si toglie, se non c\'è non fa niente', () => {
  const a = archivio({ [CHIAVE_CODA]: '{"corpo":{"email":"x@polimi.it","nome":"X"}}', altra: '1' });
  assert.equal(ripulisciVecchiaCoda(a), true);
  assert.equal(a.mappa.has(CHIAVE_CODA), false);
  assert.equal(a.mappa.get('altra'), '1');
  assert.equal(ripulisciVecchiaCoda(a), false);
  assert.equal(ripulisciVecchiaCoda(undefined), false);
});

test('vecchia coda: un archivio che lancia non fa lanciare', () => {
  const rotto = { getItem: () => { throw new Error('bloccato'); }, removeItem: () => undefined };
  assert.equal(ripulisciVecchiaCoda(rotto), false);
});

test('coda.avvia(): nessuna richiesta di rete', () => {
  const vera = globalThis.fetch;
  let chiamate = 0;
  globalThis.fetch = (async () => { chiamate++; return new Response('{}'); }) as typeof fetch;
  try { coda.avvia(); } finally { globalThis.fetch = vera; }
  assert.equal(chiamate, 0);
});

test('Onboarding: non importa firebase, atlas, coda né i controlli delle email', () => {
  const sorgente = readFileSync(new URL('../../src/components/Onboarding.tsx', import.meta.url), 'utf8');
  const importi = sorgente.split('\n').filter(r => r.startsWith('import ')).join('\n');
  for (const vietato of ['firebase', 'lib/atlas', 'progetto/coda', 'progetto/validazione', 'progetto/profilo', 'nomeDaEmail']) assert.ok(!importi.includes(vietato), `Onboarding importa ${vietato}`);
});
