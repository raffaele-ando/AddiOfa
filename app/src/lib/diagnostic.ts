import { Question } from '../types';
import { getQuestionsByCorpus } from '../data/questions';
import { calculateSimilarity, shuffleArray, shuffleQuestion } from './utils';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../config/offer';

export const DIAGNOSTIC_LENGTH = 10;

// Stessa proporzione di livelli del banco (circa 30% A1, 20% A2, 50% B1), argomenti tutti diversi
const LEVEL_MIX: Record<string, number> = { A1: 3, A2: 2, B1: 5 };

/** Il diagnostico usa solo il nucleo gratuito, che sta già nell'app: funziona anche senza rete e senza Pass. */
export function diagnosticPool(): Question[] {
  return getQuestionsByCorpus('initial');
}

// Versione sincrona sul bundle: le domande del nucleo gratuito sono sempre nell'app, anche in produzione.
export function pickDiagnosticQuestions(pool: Question[] = diagnosticPool()): Question[] {
  const selected: Question[] = [];
  const usedTopics = new Set<string>();
  const topicOf = (q: Question) => q.grammarTopic || q.category;
  const free = (q: Question, strict: boolean) =>
    !selected.some(s => s.id === q.id) &&
    !(strict && usedTopics.has(topicOf(q))) &&
    !selected.some(s => calculateSimilarity(s.prompt, q.prompt) > 0.45);

  // Prima passata: livelli e argomenti diversi; seconda: stessi livelli ma argomenti che si possono ripetere
  for (const strict of [true, false]) {
    for (const [level, count] of Object.entries(LEVEL_MIX)) {
      let taken = selected.filter(q => q.level === level).length;
      for (const q of shuffleArray(pool.filter(q => q.level === level))) {
        if (taken >= count) break;
        if (!free(q, strict)) continue;
        selected.push(q);
        usedTopics.add(topicOf(q));
        taken++;
      }
    }
  }

  // Se mancano ancora domande (nucleo piccolo o senza livelli) completa con altre a caso
  for (const q of shuffleArray(pool)) {
    if (selected.length >= DIAGNOSTIC_LENGTH) break;
    if (!selected.some(s => s.id === q.id)) selected.push(q);
  }

  return shuffleArray(selected).slice(0, DIAGNOSTIC_LENGTH).map(shuffleQuestion);
}

function logFactorial(n: number): number {
  let result = 0;
  for (let i = 2; i <= n; i++) result += Math.log(i);
  return result;
}

// log B(a, b) per a, b interi positivi
function logBeta(a: number, b: number): number {
  return logFactorial(a - 1) + logFactorial(b - 1) - logFactorial(a + b - 1);
}

function logChoose(n: number, k: number): number {
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

/**
 * Probabilità di fare almeno REAL_TEST_PASS_MARK risposte esatte su REAL_TEST_QUESTIONS,
 * dato `correct` su `total` nel quiz diagnostico.
 * Modello beta-binomiale: accuratezza ignota con prior uniforme, aggiornata con le risposte date.
 * Con sole 10 domande la stima è volutamente prudente: è un'indicazione, non una sentenza.
 */
export function estimatePassProbability(
  correct: number,
  total: number,
  testQuestions = REAL_TEST_QUESTIONS,
  passMark = REAL_TEST_PASS_MARK
): number {
  const a = correct + 1;
  const b = total - correct + 1;
  const logNorm = logBeta(a, b);
  let p = 0;
  for (let x = passMark; x <= testQuestions; x++) {
    p += Math.exp(logChoose(testQuestions, x) + logBeta(x + a, testQuestions - x + b) - logNorm);
  }
  return Math.min(1, Math.max(0, p));
}

export function weakTopics(asked: Question[], answers: Record<string, number>): string[] {
  return asked
    .filter(q => answers[q.id] !== q.correctIndex)
    .map(q => q.grammarTopic || q.category)
    .filter((t, i, all) => all.indexOf(t) === i);
}
