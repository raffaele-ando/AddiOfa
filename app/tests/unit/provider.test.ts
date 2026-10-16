// Il provider unico: correzione (grade) e simulazione (startExam/submitExam) nel browser, senza server.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalProvider } from '../../src/access/localProvider';
import { questions } from '../../src/data/questions';
import { EXAM } from '../../src/config/offer';

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

test('grade con indici impossibili o id inesistente: errore', async () => {
  const p = new LocalProvider();
  for (const i of [-2, q.options.length, 99, 1.5, NaN]) await assert.rejects(p.grade(q.id, i), /Opzione inesistente/, String(i));
  await assert.rejects(p.grade('non-esiste', 0), /Domanda non trovata/);
});

test('getQuestions serve tutto il banco, senza risposta né spiegazione', async () => {
  const p = new LocalProvider();
  const tutte = await p.getQuestions(questions.map(x => x.id));
  assert.equal(tutte.length, questions.length);
  assert.ok(tutte.every(x => !('correctIndex' in x) && !('explanation' in x)));
  assert.deepEqual(await p.getQuestions(['non-esiste']), []);
});

test('startExam: 30 domande diverse con 4 opzioni, senza la risposta esatta; submitExam corregge', async () => {
  const p = new LocalProvider();
  const s = await p.startExam();
  assert.equal(s.questions.length, EXAM.questions);
  assert.equal(new Set(s.questions.map(x => x.id)).size, EXAM.questions);
  assert.ok(s.questions.every(x => x.options.length === 4 && !('correctIndex' in x)));
  // le opzioni sono rimescolate: l'indice esatto si ritrova dal testo della risposta esatta del banco
  const risposte: Record<string, number | null> = {};
  for (const [i, d] of s.questions.entries()) {
    const originale = questions.find(x => x.id === d.id)!;
    const esatta = d.options.indexOf(originale.options[originale.correctIndex]);
    assert.ok(esatta >= 0);
    risposte[d.id] = i < 25 ? esatta : i < 28 ? (esatta + 1) % 4 : null;
  }
  const r = await p.submitExam(s.id, risposte, 600);
  assert.deepEqual([r.rawCorrect, r.wrong, r.omitted, r.score, r.passed], [25, 3, 2, 25, true]);
  assert.equal(r.perQuestion.length, EXAM.questions);
  assert.equal(r.perQuestion.filter(x => x.correct === null).length, 2);
  await assert.rejects(p.submitExam(s.id, risposte, 600), /non trovata/, 'una simulazione si consegna una volta sola');
});
