// Logica pura delle simulazioni: scelta delle domande e punteggio nei due formati. Usata da LocalProvider e dai test.
import type { Question } from '../types';
import type { ExamFormat } from '../config/offer';
import { calculateSimilarity, shuffleArray } from './utils';

/** Pool di domande adatte al formato: per il TENG servono quelle con la quinta opzione. */
export function poolForFormat(all: Question[], format: ExamFormat): Question[] {
  return format.options === 5 ? all.filter(q => typeof q.extraOption === 'string' && q.extraOption.length > 0) : all;
}

/** Sceglie `format.questions` domande diverse tra loro (soglia di somiglianza 0,45, con ripiego). */
export function selectExamQuestions(pool: Question[], format: ExamFormat): Question[] {
  const shuffled = shuffleArray(pool);
  const selected: Question[] = [];
  for (const q of shuffled) {
    if (selected.length >= format.questions) break;
    if (!selected.some(s => calculateSimilarity(s.prompt, q.prompt) > 0.45)) selected.push(q);
  }
  for (const q of shuffled) {
    if (selected.length >= format.questions) break;
    if (!selected.some(s => s.id === q.id)) selected.push(q);
  }
  return selected;
}

/** Prepara una domanda per il formato: opzioni (con la quinta se serve) rimescolate, correctIndex aggiornato. */
export function prepareQuestion(q: Question, format: ExamFormat): Question {
  const base = q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex }));
  if (format.options === 5 && q.extraOption) base.push({ text: q.extraOption, isCorrect: false });
  const mixed = shuffleArray(base);
  return { ...q, options: mixed.map(o => o.text), correctIndex: mixed.findIndex(o => o.isCorrect) };
}

export interface ExamScore {
  rawCorrect: number;
  wrong: number;
  omitted: number;
  score: number;   // risposte esatte meno penalità per le sbagliate (0 se negativo non si applica: può scendere sotto zero)
  passed: boolean; // rawCorrect >= soglia del formato
}

export function scoreExam(format: ExamFormat, questions: Question[], answers: Record<string, number | null | undefined>): ExamScore {
  let rawCorrect = 0, wrong = 0, omitted = 0;
  for (const q of questions) {
    const a = answers[q.id];
    if (a === null || a === undefined) omitted++;
    else if (a === q.correctIndex) rawCorrect++;
    else wrong++;
  }
  const score = Math.round((rawCorrect - wrong * format.penalty) * 100) / 100;
  return { rawCorrect, wrong, omitted, score, passed: rawCorrect >= format.passMark };
}
