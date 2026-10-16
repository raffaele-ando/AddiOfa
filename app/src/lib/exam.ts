// Logica pura delle simulazioni: scelta delle domande e punteggio (un solo formato: EXAM in config/offer.ts). Usata da LocalProvider e dai test.
import type { Question } from '../types';
import { EXAM, type ExamFormat } from '../config/offer';
import { calculateSimilarity, shuffleArray } from './utils';

/** Sceglie `format.questions` domande diverse tra loro (soglia di somiglianza 0,45, con ripiego). */
export function selectExamQuestions(pool: Question[], format: Pick<ExamFormat, 'questions'> = EXAM): Question[] {
  const shuffled = shuffleArray(pool);
  const selected: Question[] = [];
  for (const q of shuffled) {
    if (selected.length >= format.questions) break;
    if (selected.some(s => s.id === q.id)) continue; // lo stesso id due volte nel pool non entra due volte
    if (!selected.some(s => calculateSimilarity(s.prompt, q.prompt) > 0.45)) selected.push(q);
  }
  for (const q of shuffled) {
    if (selected.length >= format.questions) break;
    if (!selected.some(s => s.id === q.id)) selected.push(q);
  }
  return selected;
}

/** Prepara una domanda: opzioni rimescolate, correctIndex aggiornato. */
export function prepareQuestion(q: Question): Question {
  const mixed = shuffleArray(q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex })));
  return { ...q, options: mixed.map(o => o.text), correctIndex: mixed.findIndex(o => o.isCorrect) };
}

export interface ExamScore {
  rawCorrect: number;
  wrong: number;
  omitted: number;
  score: number;   // = risposte esatte (nessuna penalità per le sbagliate)
  passed: boolean; // rawCorrect >= soglia
}

export function scoreExam(questions: Question[], answers: Record<string, number | null | undefined>, format: Pick<ExamFormat, 'passMark'> = EXAM): ExamScore {
  let rawCorrect = 0, wrong = 0, omitted = 0;
  for (const q of questions) {
    const a = answers[q.id];
    if (a === null || a === undefined) omitted++;
    else if (a === q.correctIndex) rawCorrect++;
    else wrong++;
  }
  return { rawCorrect, wrong, omitted, score: rawCorrect, passed: rawCorrect >= format.passMark };
}
