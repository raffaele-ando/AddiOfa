// Caso 6: grade(id, -1) = "nessuna risposta", uguale nel LocalProvider e nel Worker (pass/src/questions.ts).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LocalProvider } from '../../src/access/localProvider';
import { questions } from '../../src/data/questions';

const q = questions[0];

test('grade con -1: nessuna risposta = correct false, con risposta esatta e spiegazione', async () => {
  const p = new LocalProvider();
  const r = await p.grade(q.id, -1);
  assert.equal(r.correct, false);
  assert.equal(r.correctIndex, q.correctIndex);
  assert.equal(r.explanation, q.explanation);
});

test('grade con l\'indice esatto = correct true, con un altro indice valido = false', async () => {
  const p = new LocalProvider();
  assert.equal((await p.grade(q.id, q.correctIndex)).correct, true);
  const altro = (q.correctIndex + 1) % q.options.length;
  assert.equal((await p.grade(q.id, altro)).correct, false);
});

test('grade con indici impossibili o id inesistente: errore (come il 400 e il 404 del server)', async () => {
  const p = new LocalProvider();
  for (const i of [-2, q.options.length, 99, 1.5, NaN]) await assert.rejects(p.grade(q.id, i), /Opzione inesistente/, String(i));
  await assert.rejects(p.grade('non-esiste', 0), /Domanda non trovata/);
});

test('il Worker accetta idx -1 e rifiuta idx < -1 (stessa regola, letta dal sorgente)', () => {
  const src = readFileSync(new URL('../../../pass/src/questions.ts', import.meta.url), 'utf8');
  assert.match(src, /IDX_NESSUNA_RISPOSTA = -1/);
  assert.match(src, /body\.idx < IDX_NESSUNA_RISPOSTA/);
  assert.match(src, /correct: body\.idx !== IDX_NESSUNA_RISPOSTA && body\.idx === row\.correct_index/);
  // il controllo del Pass viene prima: con idx -1 una domanda a pagamento non regala la soluzione
  assert.ok(src.indexOf("row.core !== 1") < src.indexOf('result: { correct'));
});
