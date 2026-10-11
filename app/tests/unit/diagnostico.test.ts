// Caso 3: scelta delle domande del diagnostico (nucleo, mix di livelli, niente doppioni, ripetibilità) e simulazioni.
import test from 'node:test';
import assert from 'node:assert/strict';
import { pickDiagnosticQuestions, diagnosticPool, DIAGNOSTIC_LENGTH } from '../../src/lib/diagnostic';
import { calculateSimilarity } from '../../src/lib/utils';
import { selectExamQuestions, scoreExam, poolForFormat } from '../../src/lib/exam';
import { FORMATS } from '../../src/config/offer';
import type { Question } from '../../src/types';

const nucleo = diagnosticPool();
const idNucleo = new Set(nucleo.map(q => q.id));
const argomento = (q: Question) => q.grammarTopic || q.category;

const domanda = (id: string, prompt: string, level?: string, extra: Partial<Question> = {}): Question => ({
  id, prompt, options: ['a', 'b', 'c', 'd'], correctIndex: 1, explanation: '', category: 'Grammatica', level, ...extra,
});

test('il pool del diagnostico è il nucleo: 100 domande', () => {
  assert.equal(nucleo.length, 100);
});

test('200 diagnostici: 10 domande del solo nucleo, 3 A1 + 2 A2 + 5 B1, argomenti tutti diversi, risposta esatta valida', () => {
  for (let i = 0; i < 200; i++) {
    const d = pickDiagnosticQuestions();
    assert.equal(d.length, DIAGNOSTIC_LENGTH);
    assert.ok(d.every(q => idNucleo.has(q.id)), 'solo domande del nucleo');
    const per = (l: string) => d.filter(q => q.level === l).length;
    assert.deepEqual([per('A1'), per('A2'), per('B1')], [3, 2, 5]);
    assert.equal(new Set(d.map(q => argomento(q))).size, d.length, 'un argomento per domanda');
    assert.ok(d.every(q => q.correctIndex >= 0 && q.correctIndex < q.options.length));
  }
});

test('mai due volte la stessa domanda né due domande quasi uguali', () => {
  for (let i = 0; i < 200; i++) {
    const d = pickDiagnosticQuestions();
    assert.equal(new Set(d.map(q => q.id)).size, d.length);
    for (let a = 0; a < d.length; a++) for (let b = a + 1; b < d.length; b++) {
      assert.ok(calculateSimilarity(d[a].prompt, d[b].prompt) <= 0.45, `${d[a].id} ~ ${d[b].id}`);
    }
  }
});

test('rifatto subito dopo non ripete le domande del diagnostico precedente', () => {
  let prima = pickDiagnosticQuestions().map(q => q.id);
  for (let i = 0; i < 100; i++) {
    const ora = pickDiagnosticQuestions().map(q => q.id);
    assert.deepEqual(ora.filter(id => prima.includes(id)), [], 'nessuna domanda in comune con quello di prima');
    prima = ora;
  }
});

test('"evita" esplicito: le domande indicate restano fuori finché il pool basta', () => {
  const evita = nucleo.slice(0, 25).map(q => q.id);
  for (let i = 0; i < 50; i++) {
    const d = pickDiagnosticQuestions(nucleo, evita);
    assert.ok(d.every(q => !evita.includes(q.id)));
  }
});

test('pool piccolo: restituisce quello che c\'è, senza doppioni e senza errori', () => {
  assert.deepEqual(pickDiagnosticQuestions([], []), []);
  const poche = [domanda('a', 'alpha beta gamma', 'A1'), domanda('b', 'delta epsilon zeta', 'B1'), domanda('c', 'eta theta iota', 'B1')];
  const d = pickDiagnosticQuestions(poche, []);
  assert.equal(d.length, 3);
  assert.equal(new Set(d.map(q => q.id)).size, 3);
});

test('un livello senza domande (niente A2): si completa con gli altri livelli fino a 10', () => {
  const pool = Array.from({ length: 30 }, (_, i) => domanda(`q${i}`, `parolauno${i} parola${i}due parola${i}tre`, i % 2 ? 'A1' : 'B1', { grammarTopic: `t${i}` }));
  const d = pickDiagnosticQuestions(pool, []);
  assert.equal(d.length, 10);
  assert.equal(new Set(d.map(q => q.id)).size, 10);
  assert.equal(d.filter(q => q.level === 'A2').length, 0);
});

test('livello povero: ne basta uno solo di A1 e il resto è B1', () => {
  const pool = [domanda('solo-a1', 'uno due tre quattro', 'A1'), ...Array.from({ length: 14 }, (_, i) => domanda(`b${i}`, `termine${i}x termine${i}y termine${i}z`, 'B1'))];
  const d = pickDiagnosticQuestions(pool, []);
  assert.equal(d.length, 10);
  assert.ok(d.some(q => q.id === 'solo-a1'));
});

test('quasi doppioni nel pool: se ci sono alternative diverse, il completamento non li prende', () => {
  const originali = Array.from({ length: 10 }, (_, i) => domanda(`o${i}`, `lessico${i}a lessico${i}b lessico${i}c lessico${i}d`, 'B1', { grammarTopic: `t${i}` }));
  const cloni = originali.map((q, i) => domanda(`c${i}`, `${q.prompt} extra`, 'B1', { grammarTopic: `t${i}` }));
  for (let k = 0; k < 50; k++) {
    const d = pickDiagnosticQuestions([...originali, ...cloni], []);
    assert.equal(d.length, 10);
    for (let a = 0; a < d.length; a++) for (let b = a + 1; b < d.length; b++) {
      assert.ok(calculateSimilarity(d[a].prompt, d[b].prompt) <= 0.45, `${d[a].id} ~ ${d[b].id}`);
    }
  }
});

test('stesso id due volte nel pool: entra una volta sola', () => {
  const x = domanda('x', 'prima seconda terza', 'B1');
  const d = pickDiagnosticQuestions([x, { ...x }, { ...x }], []);
  assert.equal(d.length, 1);
});

test('calculateSimilarity: due frasi di sole parole comuni identiche sono la stessa domanda', () => {
  assert.equal(calculateSimilarity('Choose the correct sentence', 'choose the correct sentence'), 1);
  assert.equal(calculateSimilarity('Choose the correct sentence', 'Which of the following'), 0);
  assert.ok(calculateSimilarity('she goes to school', 'she goes to school every day') > 0.45);
});

test('simulazione: selectExamQuestions non mette due volte lo stesso id, anche con testo fatto di sole parole comuni', () => {
  const pool = [domanda('a', 'Choose the correct sentence'), domanda('a', 'Choose the correct sentence'), ...Array.from({ length: 5 }, (_, i) => domanda(`z${i}`, `termine${i}p termine${i}q`))];
  const scelte = selectExamQuestions(pool, { ...FORMATS.ente, questions: 4 });
  assert.equal(scelte.length, 4);
  assert.equal(new Set(scelte.map(q => q.id)).size, 4);
});

test('scoreExam: omesse non sono errate, il TENG toglie 0,25 per errore e la soglia guarda le esatte', () => {
  const qs = Array.from({ length: 30 }, (_, i) => domanda(`s${i}`, `p${i}`));
  const risp: Record<string, number | null> = {};
  qs.forEach((q, i) => { risp[q.id] = i < 24 ? 1 : i < 28 ? 0 : null; });
  const teng = scoreExam(FORMATS.teng, qs, risp);
  assert.deepEqual([teng.rawCorrect, teng.wrong, teng.omitted, teng.score, teng.passed], [24, 4, 2, 23, true]);
  const ente = scoreExam(FORMATS.ente, qs, risp);
  assert.deepEqual([ente.rawCorrect, ente.score, ente.passed], [24, 24, false]); // 24 su 30 non basta: la soglia è 25
});

test('poolForFormat: il TENG usa solo domande con la quinta opzione', () => {
  const qs = [domanda('a', 'x'), domanda('b', 'y', undefined, { extraOption: 'e' })];
  assert.deepEqual(poolForFormat(qs, FORMATS.teng).map(q => q.id), ['b']);
  assert.equal(poolForFormat(qs, FORMATS.ente).length, 2);
});
