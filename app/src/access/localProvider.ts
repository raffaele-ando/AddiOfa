// L'unico provider: tutte le domande sono nel sito (data/questions.ts) e la correzione avviene nel browser.
import type {
  DataProvider, ExamQuestionResult, ExamResult, ExamSession, GradeResult, PublicQuestion,
} from './provider';
import { EXAM } from '../config/offer';
import { questions } from '../data/questions';
import { toPublic } from '../data/bank';
import { prepareQuestion, scoreExam, selectExamQuestions } from '../lib/exam';
import type { Question } from '../types';

function casuale(lunghezza: number): string {
  // niente caratteri ambigui (0/O, 1/I)
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const byte = new Uint8Array(lunghezza);
  try { crypto.getRandomValues(byte); } catch { for (let i = 0; i < lunghezza; i++) byte[i] = Math.floor(Math.random() * 256); }
  return Array.from(byte, b => alfabeto[b % alfabeto.length]).join('');
}

function pubblica(q: Question): PublicQuestion {
  const p = toPublic(q);
  return { id: p.id, prompt: p.prompt, options: p.options, category: p.category, level: p.level, grammarTopic: p.grammarTopic };
}

interface SessioneLocale { startedAt: number; domande: Question[] }

export class LocalProvider implements DataProvider {
  private sessioni = new Map<string, SessioneLocale>();
  private perId = new Map<string, Question>(questions.map(q => [q.id, q]));

  async getQuestions(ids: string[]): Promise<PublicQuestion[]> {
    return ids.map(id => this.perId.get(id)).filter((q): q is Question => !!q).map(pubblica);
  }

  async grade(questionId: string, optionIndex: number): Promise<GradeResult> {
    const q = this.perId.get(questionId);
    if (!q) throw new Error('Domanda non trovata.');
    // -1 = nessuna risposta (tempo scaduto), correct: false; un indice che non esiste o non è intero è un errore.
    if (!Number.isInteger(optionIndex) || optionIndex < -1 || optionIndex >= q.options.length) throw new Error('Opzione inesistente.');
    return { correct: optionIndex >= 0 && optionIndex === q.correctIndex, correctIndex: q.correctIndex, explanation: q.explanation, ...(q.theoryId ? { theoryId: q.theoryId } : {}) };
  }

  async startExam(): Promise<ExamSession> {
    if (questions.length < EXAM.questions) throw new Error('Il banco non ha abbastanza domande.');
    const domande = selectExamQuestions(questions, EXAM).map(q => prepareQuestion(q));
    const id = `sim-${Date.now().toString(36)}-${casuale(4)}`;
    const startedAt = Date.now();
    this.sessioni.set(id, { startedAt, domande });
    return { id, startedAt, questions: domande.map(pubblica) };
  }

  async submitExam(sessionId: string, answers: Record<string, number | null>, _elapsedSeconds: number): Promise<ExamResult> {
    const s = this.sessioni.get(sessionId);
    if (!s) throw new Error('Simulazione non trovata: avviane una nuova.');
    const punteggio = scoreExam(s.domande, answers);
    const perQuestion: ExamQuestionResult[] = s.domande.map(q => {
      const a = answers[q.id];
      return {
        id: q.id,
        correct: a === null || a === undefined ? null : a === q.correctIndex,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        ...(q.theoryId ? { theoryId: q.theoryId } : {}),
      };
    });
    this.sessioni.delete(sessionId);
    return { ...punteggio, perQuestion };
  }
}
