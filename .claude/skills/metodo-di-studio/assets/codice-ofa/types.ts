export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  level?: string;
  grammarTopic?: string;
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
}

export type CorpusType = 'all' | 'initial';

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
}
