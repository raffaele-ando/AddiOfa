import { Question, UserStats, AppState, QuestionTelemetry, CorpusType } from '../types';
import { questions, getQuestionsByCorpus } from '../data/questions';
import type { QuestionMeta } from '../data/bank';
import { toMeta } from '../data/bank';

// Quanto serve di una domanda per misurare i tempi e la qualità della risposta: il testo e la risposta esatta
// (nell'ordine in cui l'utente l'ha vista). Dopo grade() la risposta esatta c'è; senza, la qualità non usa i cambi di opzione.
export interface QuizLike {
  prompt: string;
  options: string[];
  correctIndex?: number;
}

let metaCache: QuestionMeta[] | null = null;
let coreIds: Set<string> | null = null;

/** Indice leggero del banco (id, categoria, livello, argomento, se è del nucleo gratuito). Non contiene risposte. */
export function bankMeta(): QuestionMeta[] {
  if (!metaCache) {
    coreIds = new Set(getQuestionsByCorpus('initial').map(q => q.id));
    metaCache = questions.map((q, i) => ({ ...toMeta(q, i), core: coreIds!.has(q.id) }));
  }
  return metaCache;
}

/** Domande disponibili: con il Pass tutto il banco (o il solo nucleo se l'utente lo sceglie), senza Pass solo il nucleo gratuito. */
export function poolMeta(pass: boolean, corpus: CorpusType = 'all'): QuestionMeta[] {
  const all = bankMeta();
  return pass && corpus !== 'initial' ? all : all.filter(m => m.core);
}

// Initialize or update stats for a question
export function getQuestionStats(stats: UserStats, questionId: string) {
  if (!stats[questionId]) {
    return {
      correct: 0,
      incorrect: 0,
      omitted: 0,
      lastSeen: 0,
      box: 0, // Repetitions count
      easiness: 2.5,
      interval: 0,
    };
  }
  return {
    ...stats[questionId],
    correct: stats[questionId].correct ?? 0,
    incorrect: stats[questionId].incorrect ?? 0,
    omitted: stats[questionId].omitted ?? 0,
    // Migrate old stats if necessary
    box: stats[questionId].box === 1 && stats[questionId].correct === 0 ? 0 : stats[questionId].box,
    easiness: stats[questionId].easiness ?? 2.5,
    interval: stats[questionId].interval ?? 0,
  };
}

// Select questions for practice using SuperMemo-2 (SM-2) algorithm
export interface PracticeOptions {
  numQuestions?: number;
  mode?: 'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart';
  category?: string;
  corpus?: CorpusType;
  /** Senza Pass (default) il pool è sempre il nucleo gratuito. */
  pass?: boolean;
}

/** Sceglie gli id delle domande da studiare. Lavora solo sull'indice leggero: le domande intere arrivano dal provider. */
export function selectPracticeIds(stats: UserStats, options: PracticeOptions = {}): string[] {
  const { numQuestions = 10, mode = 'standard', category, corpus = 'all', pass = false } = options;
  const now = Date.now();
  
  const base = poolMeta(pass, corpus);
  let pool = base;
  if (category && mode === 'category') {
    if (category === 'corpus:initial') {
      pool = poolMeta(pass, 'initial');
    } else if (category === 'corpus:all') {
      pool = base;
    } else if (category.startsWith('level:')) {
      pool = pool.filter(q => q.level === category.substring(6));
    } else if (category.startsWith('topic:')) {
      pool = pool.filter(q => q.grammarTopic === category.substring(6));
    } else if (category.startsWith('category:')) {
      pool = pool.filter(q => q.category === category.substring(9));
    } else {
      pool = pool.filter(q => q.category === category);
    }
  }

  if (pool.length === 0) {
    pool = base;
  }

  const scoredQuestions = pool.map(q => {
    const qStats = getQuestionStats(stats, q.id);
    let score = 0;

    if (mode === 'weakness') {
      // Prioritize questions with lowest easiness, highest incorrect/correct ratio
      const totalAttempts = qStats.correct + qStats.incorrect;
      if (totalAttempts === 0) {
        score = Math.random(); // Not seen yet, not a weakness
      } else {
        const errorRate = qStats.incorrect / totalAttempts;
        score = (errorRate * 1000) + ((5 - qStats.easiness) * 100) + Math.random();
      }
    } else if (mode === 'smart') {
      // Academic approach for ADHD & Low Conscientiousness:
      // Combines Spaced Repetition (SM-2) for long-term retention,
      // Weakness targeting for immediate struggle areas,
      // and a degree of randomness (interleaving) to keep dopamine and engagement high.
      
      let sm2Score = 0;
      if (qStats.lastSeen === 0) {
        sm2Score = 800 + Math.random() * 200; // High priority for unseen
      } else {
        const daysSinceSeen = (now - qStats.lastSeen) / (1000 * 60 * 60 * 24);
        const isDue = daysSinceSeen >= qStats.interval;
        if (isDue) {
          sm2Score = 500 + (daysSinceSeen - qStats.interval) * 10;
        } else {
          sm2Score = (daysSinceSeen / Math.max(1, qStats.interval)) * 100;
        }
      }

      let weaknessScore = 0;
      const totalAttempts = qStats.correct + qStats.incorrect;
      if (totalAttempts > 0) {
        const errorRate = qStats.incorrect / totalAttempts;
        // Boost score significantly if error rate is high and easiness is low
        weaknessScore = (errorRate * 400) + ((5 - qStats.easiness) * 40);
      }

      // Combine scores and add some noise for interleaving
      score = sm2Score + weaknessScore + (Math.random() * 100);

    } else {
      // Standard SM-2 scoring
      if (qStats.lastSeen === 0) {
        score = 1000 + Math.random() * 100;
      } else {
        const daysSinceSeen = (now - qStats.lastSeen) / (1000 * 60 * 60 * 24);
        const isDue = daysSinceSeen >= qStats.interval;

        if (isDue) {
          score = 500 + (daysSinceSeen - qStats.interval) * 10;
        } else {
          score = (daysSinceSeen / Math.max(1, qStats.interval)) * 100;
        }
      }
    }

    return { id: q.id, score };
  });

  // Sort by score descending
  scoredQuestions.sort((a, b) => b.score - a.score);

  return scoredQuestions.slice(0, numQuestions).map(sq => sq.id);
}

/** Versione con le domande intere dal bundle, per chi non passa dal provider (diagnostico, test). */
export function selectPracticeQuestions(stats: UserStats, options: PracticeOptions = {}): Question[] {
  const byId = new Map(questions.map(q => [q.id, q]));
  return selectPracticeIds(stats, options).map(id => byId.get(id)).filter((q): q is Question => !!q);
}

// Helper to calculate total word count and complexity for a question (Prompt + Options)
export function calculateItemTextMetrics(question?: QuizLike) {
  if (!question) {
    return { wordCount: 8, charCount: 40 };
  }
  const fullText = question.prompt + ' ' + (question.options || []).join(' ');
  const words = fullText.trim().split(/\s+/).filter(w => w.length > 0);
  return {
    wordCount: Math.max(4, words.length),
    charCount: Math.max(20, fullText.length),
  };
}

// Calculate the item-specific expected time (in ms) adapting to item length and user speed baseline
export function calculateExpectedResponseTimeMs(question?: QuizLike, userSpeedFactor: number = 1.0, userWpm: number = 180): number {
  const { wordCount, charCount } = calculateItemTextMetrics(question);
  
  // Cognitive reading time: WPM to ms + character processing sanity floor (50ms/char)
  const readingTimeFromWordsMs = (wordCount / (userWpm / 60)) * 1000;
  const readingTimeFromCharsMs = charCount * 45;
  const baseReadingTimeMs = Math.max(readingTimeFromWordsMs, readingTimeFromCharsMs * 0.7);

  // Motor decision & recognition latency (1.2s base for EFL comprehension)
  const decisionLatencyMs = 1200;

  // Expected nominal time before user-specific speed factor
  const nominalExpectedMs = baseReadingTimeMs + decisionLatencyMs;

  // Apply user-specific speed factor (bounded between 0.5x and 2.5x)
  const speedFactor = Math.min(2.5, Math.max(0.5, userSpeedFactor || 1.0));
  const dynamicExpectedMs = nominalExpectedMs * speedFactor;

  // Ensure minimum baseline of 2.2 seconds for any question
  return Math.max(2200, Math.round(dynamicExpectedMs));
}

// Compute mathematically continuous quality rating (0.0 to 5.0) using response latency ratio and trajectory analysis
export function calculateContinuousQuality(
  isCorrect: boolean,
  timeTakenMs: number,
  expectedTimeMs: number,
  attempts: number = 1,
  confidence: 'low' | 'medium' | 'high' = 'high',
  telemetry?: QuestionTelemetry,
  question?: QuizLike
): number {
  if (!isCorrect) {
    return 0;
  }

  // Latency ratio: R = ActualTime / ExpectedTime
  const cappedTimeMs = Math.min(Math.max(800, timeTakenMs), 60000);
  const ratio = cappedTimeMs / Math.max(1500, expectedTimeMs);

  let quality = 5.0;

  if (attempts === 1) {
    const switchCount = telemetry?.switchCount ?? 0;
    const trajectory = telemetry?.trajectory ?? [];
    const correctIdx = question?.correctIndex;
    const firstOptionIdx = telemetry?.firstOptionIndex ?? (trajectory.length > 0 ? trajectory[0] : null);
    const firstChoiceCorrect = correctIdx !== undefined && firstOptionIdx !== null ? firstOptionIdx === correctIdx : true;

    if (switchCount === 0) {
      // Direct confident retrieval (no switches)
      if (ratio <= 1.0) {
        quality = 5.0;
      } else if (ratio <= 2.2) {
        // Smooth transition from 5.0 down to 3.5
        quality = 5.0 - 1.5 * ((ratio - 1.0) / 1.2);
      } else if (ratio <= 4.0) {
        // Hesitant retrieval with effort: smooth transition from 3.5 down to 3.0
        quality = 3.5 - 0.5 * ((ratio - 2.2) / 1.8);
      } else {
        quality = 3.0;
      }
    } else {
      // Option switching detected before submission
      if (firstChoiceCorrect) {
        // Pattern: Correct -> Incorrect -> ... -> Correct (Second-guessing recovery)
        // User had the right intuition, had moment of doubt with distractor, then recovered
        const baseCeiling = Math.max(3.1, 3.6 - (switchCount - 1) * 0.15);
        const latencyDeduction = Math.min(0.5, Math.max(0, (ratio - 1.0) * 0.25));
        quality = Math.max(3.0, baseCeiling - latencyDeduction);
      } else {
        // Pattern: Incorrect -> ... -> Correct (Elimination / Trial-and-error / Guessing)
        // User started on wrong option and switched into correct
        const baseCeiling = Math.max(2.6, 3.1 - (switchCount - 1) * 0.2);
        const latencyDeduction = Math.min(0.4, Math.max(0, (ratio - 1.0) * 0.2));
        quality = Math.max(2.5, baseCeiling - latencyDeduction);
      }
    }

    // Hesitation before final submission penalty (metacognitive uncertainty)
    const hesitationMs = telemetry?.hesitationBeforeSubmitMs ?? 0;
    if (hesitationMs > 4000) {
      const hesitationPenalty = Math.min(0.35, ((hesitationMs - 4000) / 10000) * 0.35);
      quality = Math.max(2.5, quality - hesitationPenalty);
    }
  } else {
    // Multiple attempts required in learning session
    const baseQuality = Math.max(1.0, 3.0 - (attempts - 1) * 0.6);
    const speedDeduction = Math.min(0.8, ratio * 0.15);
    quality = Math.max(0.1, baseQuality - speedDeduction);
  }

  // Subjective / metacognitive confidence modifiers
  if (confidence === 'low') {
    // "Indovino": tetto a 2,5 così una risposta azzeccata a caso non conta come imparata
    quality = Math.max(0.1, Math.min(2.5, quality - 2.0));
  } else if (confidence === 'medium') {
    quality = Math.max(0.1, quality - 0.6);
  }

  return Math.round(quality * 100) / 100;
}

// One SM-2 step with a continuous quality (0.0–5.0). Shared by practice sessions and mock exams.
export function applySm2(
  state: { repetitions: number; interval: number; easiness: number },
  quality: number
): { repetitions: number; interval: number; easiness: number } {
  let { repetitions, interval, easiness } = state;
  if (quality >= 3.0) {
    // Successful recall: increment spaced repetition interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.max(1, Math.round(interval * easiness));
    }
    repetitions += 1;
  } else {
    // Unsuccessful or high struggle: reset interval for immediate recovery
    repetitions = 0;
    interval = 1;
  }

  // Update SuperMemo-2 easiness factor continuously using the exact quality rating
  easiness = easiness + (0.1 - (5.0 - quality) * (0.08 + (5.0 - quality) * 0.02));
  easiness = Math.max(1.3, Math.round(easiness * 100) / 100); // Floor of 1.3
  return { repetitions, interval, easiness };
}

// Confidence shown in the UI (0–100) from the SM-2 easiness factor.
// Range 1.3–3.5: a new card (2.5) starts around 55%, about ten perfect answers reach 100%.
export function confidenceFromEasiness(easiness: number = 2.5): number {
  return Math.max(0, Math.min(100, Math.round(((easiness - 1.3) / 2.2) * 100)));
}

// Update stats after answering based on SM-2, dynamic fluency, and trajectory telemetry
export function updateStats(
  appState: AppState, 
  questionId: string, 
  isCorrect: boolean, 
  timeTakenMs: number = 0, 
  attempts: number = 1, 
  confidence: 'low' | 'medium' | 'high' = 'high',
  telemetry?: QuestionTelemetry,
  // La domanda come l'ha vista l'utente (opzioni nell'ordine mostrato, con la risposta esatta). Se manca la cerco nel banco.
  quiz?: QuizLike
): AppState {
  const stats = appState.stats;
  const speedStats = appState.speedStats || { 
    minTimeMs: 2500, 
    maxTimeMs: 14000, 
    avgTimeMs: 7000, 
    totalAnswers: 0,
    avgWpm: 180,
    speedFactor: 1.0 
  };
  const qStats = getQuestionStats(stats, questionId);
  const question: QuizLike | undefined = quiz ?? questions.find(q => q.id === questionId);
  
  let newRepetitions = qStats.box;
  let newEasiness = qStats.easiness;
  let newInterval = qStats.interval;

  let { 
    minTimeMs = 2500, 
    maxTimeMs = 14000, 
    avgTimeMs = 7000, 
    totalAnswers = 0,
    avgWpm = 180,
    speedFactor = 1.0 
  } = speedStats;

  // 1. Calculate dynamic expected response time based on this specific question text
  const expectedTimeMs = calculateExpectedResponseTimeMs(question, speedFactor, avgWpm);

  // 2. Grade continuously from 0.0 to 5.0 based on dynamic latency ratio and click trajectory
  const quality = calculateContinuousQuality(isCorrect, timeTakenMs, expectedTimeMs, attempts, confidence, telemetry, question);
  
  if (isCorrect && attempts === 1) {
    totalAnswers += 1;
    // Winsorize timeTakenMs to [1000, 35000] ms so long distractions don't skew the user's reading baseline
    const cleanTimeMs = Math.min(Math.max(1000, timeTakenMs), 35000);
    
    // Adaptive update of user speed factor using Exponential Moving Average (EMA)
    const nominalItemTime = calculateExpectedResponseTimeMs(question, 1.0, 180);
    const observedSpeedRatio = cleanTimeMs / Math.max(1500, nominalItemTime);
    
    const alpha = Math.max(0.05, 1 / Math.min(25, totalAnswers));
    speedFactor = speedFactor * (1 - alpha) + observedSpeedRatio * alpha;
    speedFactor = Math.min(2.5, Math.max(0.5, speedFactor));

    // Update rolling averages
    avgTimeMs = Math.round(avgTimeMs + (cleanTimeMs - avgTimeMs) / Math.min(50, totalAnswers));
    minTimeMs = Math.min(minTimeMs, cleanTimeMs);
    maxTimeMs = Math.max(maxTimeMs, cleanTimeMs);
  }

  ({ repetitions: newRepetitions, interval: newInterval, easiness: newEasiness } =
    applySm2({ repetitions: newRepetitions, interval: newInterval, easiness: newEasiness }, quality));

  const dateString = new Date().toISOString().split('T')[0];
  const dailyActivity = { ...(appState.dailyActivity || {}) };
  dailyActivity[dateString] = (dailyActivity[dateString] || 0) + 1;

  return {
    ...appState,
    speedStats: { minTimeMs, maxTimeMs, avgTimeMs, totalAnswers, avgWpm, speedFactor },
    dailyActivity,
    stats: {
      ...stats,
      [questionId]: {
        ...qStats,
        correct: qStats.correct + (isCorrect && attempts === 1 ? 1 : 0),
        incorrect: qStats.incorrect + (!isCorrect && attempts === 1 ? 1 : 0),
        lastSeen: Date.now(),
        box: newRepetitions,
        easiness: newEasiness,
        previousEasiness: qStats.easiness,
        interval: newInterval,
        lastResponseTimeMs: timeTakenMs,
        lastFirstClickTimeMs: telemetry?.firstClickTimeMs,
        lastSwitchCount: telemetry?.switchCount ?? 0,
        lastTrajectory: telemetry?.trajectory,
        lastQuality: quality,
      }
    }
  };
}
