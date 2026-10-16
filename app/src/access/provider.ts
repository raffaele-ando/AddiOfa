// Contratto tra l'app e il banco domande. Un solo provider (localProvider.ts): le domande stanno nel sito e tutto gira nel browser.
// Si usa con `import { provider } from '../access'`. Tutti i metodi restano asincroni (rispondono subito) per non cambiare le schermate.

import type { ExamFormat } from '../config/offer';

/** Una domanda come la vede lo studente: senza risposta esatta né spiegazione (arrivano da grade). */
export interface PublicQuestion {
  id: string;
  prompt: string;
  options: string[];
  category: string;
  level?: string;
  grammarTopic?: string;
}

export interface GradeResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;   // in italiano
  theoryId?: string;     // scheda di teoria collegata
}

export interface ExamSession {
  id: string;
  startedAt: number;
  questions: PublicQuestion[];
}

export interface ExamQuestionResult {
  id: string;
  correct: boolean | null; // null = senza risposta
  correctIndex: number;
  explanation: string;
  theoryId?: string;
}

export interface ExamResult {
  rawCorrect: number;     // risposte esatte
  wrong: number;
  omitted: number;
  score: number;          // punteggio: uguale alle risposte esatte (nessuna penalità)
  passed: boolean;        // rawCorrect >= soglia (EXAM.passMark)
  perQuestion: ExamQuestionResult[];
}

export type { ExamFormat };

export interface DataProvider {
  getQuestions(ids: string[]): Promise<PublicQuestion[]>;
  grade(questionId: string, optionIndex: number): Promise<GradeResult>;

  /** Prepara una simulazione: 30 domande diverse tra loro, opzioni rimescolate. */
  startExam(): Promise<ExamSession>;
  submitExam(sessionId: string, answers: Record<string, number | null>, elapsedSeconds: number): Promise<ExamResult>;
}
