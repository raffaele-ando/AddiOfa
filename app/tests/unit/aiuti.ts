// Costruttori di stati e simulazioni per i test: niente dati veri dell'utente, solo numeri verificabili a mano.
import type { AppState, ExamHistory, ExamQuestionLog } from '../../src/types';

export const GIORNO = 24 * 60 * 60 * 1000;

export function statoVuoto(extra: Partial<AppState> = {}): AppState {
  return { stats: {}, history: [], streak: 0, lastActiveDate: null, ...extra };
}

/** Simulazione con i log per domanda: `esatte` giuste, `sbagliate` errate, il resto omesse (totale 30 o `totale`). */
export function simulazione(opz: {
  id?: string; date?: number; esatte: number; sbagliate?: number; totale?: number; prefisso?: string;
}): ExamHistory {
  const totale = opz.totale ?? 30;
  const sbagliate = opz.sbagliate ?? totale - opz.esatte;
  const prefisso = opz.prefisso ?? opz.id ?? 'q';
  const logs: ExamQuestionLog[] = [];
  for (let i = 0; i < totale; i++) {
    const esatta = i < opz.esatte;
    const errata = !esatta && i < opz.esatte + sbagliate;
    logs.push({
      questionId: `${prefisso}-${i}`,
      userAnswerIndex: esatta || errata ? (esatta ? 1 : 0) : null,
      correctIndex: 1,
      isCorrect: esatta,
      category: 'Grammatica',
    });
  }
  return {
    id: opz.id ?? `sim-${opz.date ?? 1}`,
    date: opz.date ?? 1,
    score: opz.esatte,
    passed: opz.esatte >= 25,
    timeSpentSeconds: 600,
    questionLogs: logs,
    questionIds: logs.map(l => l.questionId),
  };
}
