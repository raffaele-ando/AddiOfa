// Simulazioni svolte (lib/studio/simulazioni.ts): elenco, ricerca per id, riepilogo per argomento.
import test from 'node:test';
import assert from 'node:assert/strict';
import { elencoSimulazioni, trovaSimulazione, perArgomentoSimulazione, riepilogo, entrataStorico } from '../../src/lib/studio/simulazioni';
import { statoVuoto, simulazione } from './aiuti';
import type { ExamHistory } from '../../src/types';

test('elenco: dalla più recente, numerazione cronologica, superata se almeno 25', () => {
  const h = [simulazione({ id: 'b', date: 20, esatte: 24 }), simulazione({ id: 'a', date: 10, esatte: 18 }), simulazione({ id: 'c', date: 30, esatte: 25 })];
  const e = elencoSimulazioni(h);
  assert.deepEqual(e.map(s => s.id), ['c', 'b', 'a']);
  assert.deepEqual(e.map(s => s.numero), [3, 2, 1]);
  assert.deepEqual(e.map(s => s.superata), [true, false, false]);
  assert.deepEqual(e.map(s => s.esatte), [25, 24, 18]);
  assert.equal(e[0].totale, 30);
  assert.equal(e[0].soglia, 25);
});

test('riepilogo: sbagliate e senza risposta dai log; senza log restano null', () => {
  const s = riepilogo(simulazione({ id: 'x', date: 1, esatte: 20, sbagliate: 8 }), 1);
  assert.equal(s.esatte, 20);
  assert.equal(s.sbagliate, 8);
  assert.equal(s.omesse, 2);
  assert.equal(s.tempoSecondi, 600);
  const senzaLog: ExamHistory = { id: 'v', date: 5, score: 22, passed: false, timeSpentSeconds: 700 };
  const v = riepilogo(senzaLog, 1);
  assert.equal(v.omesse, null);
  assert.equal(v.sbagliate, null);
  assert.equal(v.superata, false);
  assert.equal(v.tempoSecondi, 700);
});

test('storico rovinato: voci senza data o non oggetti non rompono l\'elenco', () => {
  const sporco = [null, 3, { id: 'q' }, simulazione({ id: 'ok', date: 5, esatte: 26 })] as unknown as ExamHistory[];
  assert.deepEqual(elencoSimulazioni(sporco).map(s => s.id), ['ok']);
  assert.deepEqual(elencoSimulazioni(undefined as unknown as ExamHistory[]), []);
});

test('trovaSimulazione: per id, per numero d\'ordine, null se manca', () => {
  const h = [simulazione({ id: 'sim-a', date: 10, esatte: 18 }), simulazione({ id: 'sim-b', date: 20, esatte: 24 })];
  assert.equal(trovaSimulazione(h, 'sim-b')?.numero, 2);
  assert.equal(trovaSimulazione(h, '1')?.id, 'sim-a');
  assert.equal(trovaSimulazione(h, 'nonesiste'), null);
  assert.equal(trovaSimulazione(h, undefined), null);
  assert.equal(entrataStorico(h, 'sim-a')?.id, 'sim-a');
});

test('per argomento: dal più debole, con i log; con lo storico vecchio ripiega sulle categorie', () => {
  const h = simulazione({ id: 'a', date: 1, esatte: 3, sbagliate: 1, totale: 4 });
  h.questionLogs![0].grammarTopic = 'Present Simple';
  h.questionLogs![1].grammarTopic = 'Present Simple';
  h.questionLogs![2].grammarTopic = 'Past Simple';
  h.questionLogs![3].grammarTopic = 'Past Simple';
  h.questionLogs![3].isCorrect = false;
  const r = perArgomentoSimulazione(h);
  assert.equal(r.per, 'argomento');
  assert.deepEqual(r.righe.map(x => [x.nome, x.esatte, x.totale, x.percento]), [['Past Simple', 1, 2, 50], ['Present Simple', 2, 2, 100]]);

  const vecchia: ExamHistory = { id: 'v', date: 1, score: 20, passed: false, timeSpentSeconds: 100, categoryStats: { Grammatica: { correct: 12, total: 20 }, Traduzione: { correct: 8, total: 10 } } };
  const c = perArgomentoSimulazione(vecchia);
  assert.equal(c.per, 'categoria');
  assert.deepEqual(c.righe.map(x => x.nome), ['Grammatica', 'Traduzione']);
  assert.deepEqual(perArgomentoSimulazione({ id: 'z', date: 1, score: 0, passed: false, timeSpentSeconds: 0 }).righe, []);
});
