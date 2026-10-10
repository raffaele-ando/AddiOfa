import type { ScopeId } from './config/ecosystem';
import type { FormatId } from './config/offer';

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  level?: string;
  grammarTopic?: string;
  /** Scheda di teoria collegata (id di TheoryTopic in data/theory.ts). Lo imposta il generatore dei contenuti. */
  theoryId?: string;
  /** Quinta opzione (distrattore) per il pool del formato TENG, che ha 5 opzioni. Non fa parte di options. */
  extraOption?: string;
}

export interface QuestionClickEvent {
  optionIndex: number;
  elapsedMs: number;
  timestamp: number;
  isCorrect: boolean;
}

export interface QuestionTelemetry {
  firstClickTimeMs?: number;
  firstOptionIndex?: number | null;
  finalOptionIndex?: number | null;
  switchCount: number;
  trajectory: number[]; // sequence of selected option indices
  hesitationBeforeSubmitMs?: number;
  clickEvents?: QuestionClickEvent[];
}

export interface UserStats {
  [questionId: string]: {
    correct: number;
    incorrect: number;
    omitted?: number;
    lastSeen: number;
    box: number; // Repetitions (previously Leitner box)
    easiness?: number; // SuperMemo-2 E-factor
    interval?: number; // Interval in days
    previousEasiness?: number; // per calcolare il trend
    lastResponseTimeMs?: number;
    lastFirstClickTimeMs?: number;
    lastSwitchCount?: number;
    lastTrajectory?: number[];
    lastQuality?: number;
  };
}

export interface ExamQuestionLog {
  questionId: string;
  userAnswerIndex: number | null; // null if omitted
  correctIndex: number;
  isCorrect: boolean;
  timeSpentMs?: number;
  firstClickTimeMs?: number;
  firstOptionIndex?: number | null;
  switchCount?: number;
  trajectory?: number[];
  hesitationBeforeSubmitMs?: number;
  clickEvents?: QuestionClickEvent[];
  category: string;
  grammarTopic?: string;
  level?: string;
}

export interface ExamHistory {
  id: string;
  date: number;
  score: number;
  passed: boolean;
  timeSpentSeconds: number;
  categoryStats?: Record<string, { correct: number; total: number; }>;
  questionLogs?: ExamQuestionLog[];
  answers?: Record<string, number>;
  questionIds?: string[];
  format?: FormatId; // formato della simulazione (assente = 'ente', storico precedente)
}

export type CorpusType = 'all' | 'initial';

export interface OnboardingResult {
  completedAt: number;
  hasCertification: boolean;
  hasOfa: 'yes' | 'no' | 'unknown';
  diagnosticCorrect?: number;
  diagnosticTotal?: number;
  passProbability?: number; // 0–1, stima del quiz diagnostico
}

export interface AppState {
  stats: UserStats;
  history: ExamHistory[];
  streak: number;
  lastActiveDate: number | null;
  speedStats?: {
    minTimeMs: number;
    maxTimeMs: number;
    avgTimeMs: number;
    totalAnswers: number;
    avgWpm?: number;
    speedFactor?: number;
  };
  examCategoryStats?: Record<string, { correct: number; total: number; }>;
  dailyActivity?: Record<string, number>;
  dailyTimeSpent?: Record<string, number>;
  selectedCorpus?: CorpusType;
  onboarding?: OnboardingResult;
  projectLink?: ProjectLink;
}

// Consenso dato da questo utente al collegamento di AddiOFA con il suo Project ID
export interface ProjectLink {
  scopes: ScopeId[];
  consentVersion: string;
  grantedAt: number;
  updatedAt: number;
}

// Sezioni delle pagine legali (screens/Legal.tsx)
export type LegalSection = 'termini' | 'privacy' | 'cookie' | 'recesso';

// Perché si apre il paywall (testo dell'intestazione in screens/Paywall.tsx)
export type PaywallReason = 'simulazione' | 'domande' | 'teng' | 'teoria' | 'errori' | 'statistiche' | 'generico';
