// I numeri dell'utente: una sola fonte per Profilo, Progressi, Obiettivi e NOI. «Domande imparate» e «probabilità» sono due grandezze diverse.
import test from 'node:test';
import assert from 'node:assert/strict';
import { numeriUtente } from '../../src/lib/profilo/numeri';
import { valoriNoi } from '../../src/lib/progetto/noi';
import { statoVuoto, simulazione, GIORNO } from './aiuti';

const banco = Array.from({ length: 10 }, (_, i) => ({ id: `q${i}`, level: 'A1' }));
const imparata = { correct: 2, incorrect: 0, lastSeen: 1, box: 2 };

test('numeri: stato vuoto = tutto a zero e nessuna stima (mai una probabilità a priori)', () => {
  const n = numeriUtente(statoVuoto(), banco);
  assert.equal(n.imparate, 0);
  assert.equal(n.totaleDomande, 10);
  assert.equal(n.probabilita, null);
  assert.equal(n.simulazioni, 0);
  assert.equal(n.migliorSimulazione, null);
  assert.equal(n.mediaSimulazioni, null);
  assert.equal(n.risposte, 0);
});

test('numeri: domande imparate e probabilità sono grandezze separate', () => {
  const stato = statoVuoto({ stats: { q0: imparata, q1: imparata, q2: { ...imparata, box: 1 } }, history: [simulazione({ id: 'a', date: 5 * GIORNO, esatte: 22 }), simulazione({ id: 'b', date: 6 * GIORNO, esatte: 26 })] });
  const n = numeriUtente(stato, banco);
  assert.equal(n.imparate, 2, 'conta isLearned, non le simulazioni');
  assert.equal(n.simulazioni, 2);
  assert.equal(n.migliorSimulazione, 26);
  assert.equal(n.mediaSimulazioni, 24);
  assert.ok(n.probabilita !== null && n.probabilita >= 0 && n.probabilita <= 100);
  assert.equal(n.probabilita, Math.round(n.stima!.p * 100));
  // risposte = quelle delle statistiche delle domande (3 + 2 + 1... q0 e q1: 2 esatte ciascuna, q2: 1)
  assert.equal(n.risposte, 6); // 2 esatte su ciascuna delle tre domande
});

test('numeri: NOI usa la stessa fonte (domande imparate e miglior simulazione)', () => {
  const stato = statoVuoto({ stats: { q0: imparata }, history: [simulazione({ id: 'a', date: 5 * GIORNO, esatte: 27 })] });
  const v = valoriNoi(stato);
  assert.equal(v.migliorSimulazione, 27);
  assert.equal(statoVuoto().history.length, 0);
  assert.equal(valoriNoi(statoVuoto()).migliorSimulazione, 0);
});
