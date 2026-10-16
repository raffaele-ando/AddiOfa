// Famiglie di argomento (lib/studio/famiglie.ts): ogni lezione ha una famiglia, nessuna è in due famiglie.
import test from 'node:test';
import assert from 'node:assert/strict';
import { theoryTopics } from '../../src/data/theory';
import { FAMIGLIE, famigliaDi } from '../../src/lib/studio/famiglie';

test('ogni argomento di teoria sta in una famiglia elencata (non nel ripiego)', () => {
  const elencati = FAMIGLIE.flatMap(f => f.argomenti);
  const mancanti = theoryTopics.filter(t => t.pronta && !elencati.includes(t.id)).map(t => t.id);
  assert.deepEqual(mancanti, [], `senza famiglia: ${mancanti.join(', ')}`);
});

test('nessun argomento è in due famiglie e tutti gli id esistono', () => {
  const elencati = FAMIGLIE.flatMap(f => f.argomenti);
  assert.equal(new Set(elencati).size, elencati.length);
  const ids = new Set(theoryTopics.map(t => t.id));
  assert.deepEqual(elencati.filter(id => !ids.has(id)), []);
});

test('un argomento sconosciuto cade in «Altro»', () => {
  assert.equal(famigliaDi('non-esiste').id, 'resto');
  assert.equal(famigliaDi('present-perfect').id, 'tempi');
});
