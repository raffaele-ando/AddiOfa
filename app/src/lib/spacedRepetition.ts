import { Question, UserStats, AppState, QuestionTelemetry, CorpusType } from '../types';
import { questions, getQuestionsByCorpus } from '../data/questions';
import { toMeta, type QuestionMeta } from '../data/bank';
import { chiaveGiorno, shuffleArray } from './utils';

// Quanto serve di una domanda per misurare i tempi e la qualità della risposta: il testo e la risposta esatta
// (nell'ordine in cui l'utente l'ha vista). Dopo grade() la risposta esatta c'è; senza, la qualità non usa i cambi di opzione.
export interface QuizLike {
  prompt: string;
  options: string[];
  correctIndex?: number;
}

let metaCache: QuestionMeta[] | null = null;

/** Indice leggero del banco (id, categoria, livello, argomento, se è del nucleo gratuito). Non contiene risposte. */
export function bankMeta(): QuestionMeta[] {
  if (!metaCache) metaCache = questions.map(q => toMeta(q));
  return metaCache;
}

/** Domande disponibili: con il Pass tutto il banco (o il solo nucleo se l'utente lo sceglie), senza Pass solo il nucleo gratuito. */
export function poolMeta(pass: boolean, corpus: CorpusType = 'all'): QuestionMeta[] {
  const all = bankMeta();
  return pass && corpus !== 'initial' ? all : all.filter(m => m.core);
}

// ---- Costanti dell'algoritmo (SM-2 con qualità continua 0-5)
export const EASINESS_START = 2.5;
export const EASINESS_MIN = 1.3;
/** Tetto della facilità: con 3,5 ci vogliono circa dieci risposte perfette per arrivare a 100 % (vedi confidenceFromEasiness). */
export const EASINESS_MAX = 3.5;
/** Nessun intervallo supera questi giorni: oltre non serve a un test che si prepara in mesi, e un dato sbagliato non nasconde una domanda per anni. */
export const MAX_INTERVAL_DAYS = 90;
/** Una risposta esatta data meno di 12 ore dopo l'ultima non fa avanzare le ripetizioni: non è un ripasso a distanza. */
export const MIN_GAP_MS = 12 * 60 * 60 * 1000;
export const QUALITY_WRONG = 0;
/** Risposta omessa (simulazione senza risposta, tempo scaduto): non è un errore di conoscenza, ma al test vero vale zero.
 *  Sotto 3 la domanda torna domani (come un errore), con metà della penalità sulla facilità. */
export const QUALITY_OMITTED = 2;
/** Tempi oltre questa soglia (scheda in background, distrazione) non dicono nulla sulla velocità di risposta. */
export const TEMPO_ANOMALO_MS = 60_000;
/** Rapporto tempo/atteso assunto quando il tempo non è affidabile: né veloce né lento. */
const RAPPORTO_NEUTRO = 1.5;
const GIORNO_MS = 24 * 60 * 60 * 1000;

const num = (v: unknown, ripiego: number): number => (typeof v === 'number' && Number.isFinite(v) ? v : ripiego);
const limita = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export type QuestionStat = UserStats[string] & { omitted: number; easiness: number; interval: number };

// Statistiche di una domanda, sempre complete e con numeri validi (anche se il salvataggio è vecchio o rovinato)
export function getQuestionStats(stats: UserStats | undefined | null, questionId: string): QuestionStat {
  const s = stats?.[questionId];
  if (!s || typeof s !== 'object') {
    return {
      correct: 0,
      incorrect: 0,
      omitted: 0,
      lastSeen: 0,
      box: 0, // Repetitions count
      easiness: EASINESS_START,
      interval: 0,
    };
  }
  const correct = Math.max(0, num(s.correct, 0));
  const box = Math.max(0, Math.floor(num(s.box, 0)));
  return {
    ...s,
    correct,
    incorrect: Math.max(0, num(s.incorrect, 0)),
    omitted: Math.max(0, num(s.omitted, 0)),
    lastSeen: Math.max(0, num(s.lastSeen, 0)),
    // Migrate old stats if necessary
    box: box === 1 && correct === 0 ? 0 : box,
    easiness: limita(num(s.easiness, EASINESS_START), EASINESS_MIN, EASINESS_MAX),
    interval: limita(num(s.interval, 0), 0, MAX_INTERVAL_DAYS),
  };
}

// ---- "Domanda imparata": UNA sola definizione, usata da Menu, Home, StatsMode, FineSessione, App
/** Ripetizioni consecutive riuscite (box di SM-2) da cui una domanda conta come imparata. */
export const LEARNED_BOX = 2;

/**
 * Imparata = risposta esatta almeno due volte di fila, a distanza di almeno mezzo giorno una dall'altra
 * (applySm2 non fa avanzare le ripetizioni se la risposta arriva prima), con qualità sufficiente (mai un'esatta a caso).
 * Una sola risposta esatta (box 1) vale "in corso": basta una volta fortunata o un'esatta subito dopo averla letta.
 * Un errore o un'omissione riportano il box a 0 e la domanda torna "non imparata".
 */
export function isLearned(stat: Partial<UserStats[string]> | undefined | null): boolean {
  if (!stat) return false;
  return Math.floor(num(stat.box, 0)) >= LEARNED_BOX && num(stat.correct, 0) > 0;
}

/** Vista una volta con esito buono ma non ancora confermata: la mostra FineSessione/Home come "in corso". */
export function isInProgress(stat: Partial<UserStats[string]> | undefined | null): boolean {
  return !!stat && Math.floor(num(stat.box, 0)) === 1 && num(stat.correct, 0) > 0;
}

/** Quante delle domande `ids` sono imparate (con `ids` = gli id del gruppo che l'utente può studiare). */
export function countLearned(stats: UserStats | undefined | null, ids: Iterable<string>): number {
  let n = 0;
  for (const id of ids) if (isLearned(stats?.[id])) n++;
  return n;
}

// Select questions for practice using SuperMemo-2 (SM-2) algorithm
export interface PracticeOptions {
  numQuestions?: number;
  mode?: 'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart';
  category?: string;
  corpus?: CorpusType;
  /** Senza Pass (default) il pool è sempre il nucleo gratuito. */
  pass?: boolean;
  /** Ora di riferimento (millisecondi): per i test; di norma Date.now(). */
  now?: number;
}

/** Quota minima di domande nuove in ogni sessione (se ce ne sono): senza, finché ci sono scadute le nuove non arrivano mai. */
export const QUOTA_NUOVE = 0.3;

/**
 * Sceglie gli id delle domande da studiare. Lavora solo sull'indice leggero: le domande intere arrivano dal provider.
 * Ordine: prima le scadute (le più in ritardo per prime), poi le nuove, poi, se manca ancora qualcosa, le non scadute
 * più vicine alla scadenza e più difficili. Le nuove hanno una quota riservata del 30 % (QUOTA_NUOVE), le scadute il resto.
 * Modo 'weakness': per tasso d'errore e facilità, come prima. Modo 'smart': stesse quote, con il rimescolamento finale.
 */
export function selectPracticeIds(stats: UserStats, options: PracticeOptions = {}): string[] {
  const { mode = 'standard', category, corpus = 'all', pass = false } = options;
  const now = num(options.now, Date.now());
  const n = Number.isFinite(options.numQuestions) ? Math.max(0, Math.floor(options.numQuestions as number)) : 10;

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

  const nuove: { id: string; score: number }[] = [];
  const scadute: { id: string; score: number }[] = [];
  const future: { id: string; score: number }[] = [];
  const pesi: { id: string; score: number }[] = [];

  for (const q of pool) {
    const st = getQuestionStats(stats, q.id);
    const tentativi = st.correct + st.incorrect;
    const tassoErrore = tentativi > 0 ? st.incorrect / tentativi : 0;
    const debolezza = tassoErrore * 0.5 + ((EASINESS_MAX - st.easiness) / (EASINESS_MAX - EASINESS_MIN)) * 0.5; // 0-1

    if (mode === 'weakness') {
      // Prioritize questions with lowest easiness, highest incorrect/correct ratio
      pesi.push({ id: q.id, score: tentativi === 0 ? Math.random() : tassoErrore * 1000 + (5 - st.easiness) * 100 + Math.random() });
      continue;
    }

    if (st.lastSeen <= 0) {
      nuove.push({ id: q.id, score: Math.random() });
      continue;
    }
    // Una data nel futuro (orologio spostato) non deve nascondere la domanda per sempre: vale "vista adesso"
    const giorni = Math.max(0, (now - st.lastSeen) / GIORNO_MS);
    const rumore = Math.random();
    if (giorni >= st.interval) {
      // in ritardo: più giorni di ritardo e più difficile = prima; nel 'smart' conta anche la debolezza
      scadute.push({ id: q.id, score: (giorni - st.interval) * 10 + (mode === 'smart' ? debolezza * 400 + rumore * 100 : rumore) });
    } else {
      // non ancora scaduta: prima quelle vicine alla scadenza e quelle difficili
      future.push({ id: q.id, score: giorni / Math.max(1, st.interval) + debolezza + rumore * 0.1 });
    }
  }

  const perPunteggio = (a: { score: number }, b: { score: number }) => b.score - a.score;

  if (mode === 'weakness') {
    return pesi.sort(perPunteggio).slice(0, n).map(x => x.id);
  }

  nuove.sort(perPunteggio);
  scadute.sort(perPunteggio);
  future.sort(perPunteggio);

  const riservateNuove = Math.min(nuove.length, Math.ceil(n * QUOTA_NUOVE));
  const nScadute = Math.min(scadute.length, n - riservateNuove);
  const nNuove = Math.min(nuove.length, n - nScadute);
  const nFuture = Math.min(future.length, n - nScadute - nNuove);

  const scelte = [
    ...scadute.slice(0, nScadute),
    ...nuove.slice(0, nNuove),
    ...future.slice(0, nFuture),
  ].map(x => x.id);
  return mode === 'smart' ? shuffleArray(scelte) : scelte;
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
  const fullText = String(question.prompt ?? '') + ' ' + (Array.isArray(question.options) ? question.options : []).join(' ');
  const words = fullText.trim().split(/\s+/).filter(w => w.length > 0);
  return {
    wordCount: Math.max(4, words.length),
    charCount: Math.max(20, fullText.length),
  };
}

// Calculate the item-specific expected time (in ms) adapting to item length and user speed baseline
export function calculateExpectedResponseTimeMs(question?: QuizLike, userSpeedFactor: number = 1.0, userWpm: number = 180): number {
  const { wordCount, charCount } = calculateItemTextMetrics(question);
  const wpm = limita(num(userWpm, 180), 60, 600);

  // Cognitive reading time: WPM to ms + character processing sanity floor (50ms/char)
  const readingTimeFromWordsMs = (wordCount / (wpm / 60)) * 1000;
  const readingTimeFromCharsMs = charCount * 45;
  const baseReadingTimeMs = Math.max(readingTimeFromWordsMs, readingTimeFromCharsMs * 0.7);

  // Motor decision & recognition latency (1.2s base for EFL comprehension)
  const decisionLatencyMs = 1200;

  // Expected nominal time before user-specific speed factor
  const nominalExpectedMs = baseReadingTimeMs + decisionLatencyMs;

  // Apply user-specific speed factor (bounded between 0.5x and 2.5x)
  const speedFactor = limita(num(userSpeedFactor, 1.0) || 1.0, 0.5, 2.5);
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
    return QUALITY_WRONG;
  }
  attempts = Math.max(1, Math.floor(num(attempts, 1)));

  // Latency ratio: R = ActualTime / ExpectedTime. Un tempo negativo, non numerico o enorme (scheda in background)
  // non misura la velocità: si assume un rapporto neutro invece di premiare o punire.
  const tempoAffidabile = Number.isFinite(timeTakenMs) && timeTakenMs > 0 && timeTakenMs <= TEMPO_ANOMALO_MS;
  const cappedTimeMs = Math.max(800, timeTakenMs);
  const attesoMs = Math.max(1500, num(expectedTimeMs, 4000));
  const ratio = tempoAffidabile ? cappedTimeMs / attesoMs : RAPPORTO_NEUTRO;

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
    if (Number.isFinite(hesitationMs) && hesitationMs > 4000) {
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

export type EsitoRisposta = 'correct' | 'incorrect' | 'omitted';

/**
 * Qualità SM-2 di una risposta data in simulazione (stesso criterio dell'allenamento):
 * esatta = voto continuo da tempo e cambi di opzione, sbagliata = 0, omessa = QUALITY_OMITTED.
 * `question` può mancare (banco servito dal Worker): si usano un testo e un tempo attesi medi.
 */
export function qualityForResult(
  result: EsitoRisposta,
  question?: QuizLike,
  log?: { timeSpentMs?: number; switchCount?: number; trajectory?: number[]; firstOptionIndex?: number | null },
  speed?: { speedFactor?: number; avgWpm?: number }
): number {
  if (result === 'omitted') return QUALITY_OMITTED;
  if (result !== 'correct') return QUALITY_WRONG;
  const attesoMs = calculateExpectedResponseTimeMs(question, speed?.speedFactor ?? 1.0, speed?.avgWpm ?? 180);
  return calculateContinuousQuality(true, log?.timeSpentMs ?? NaN, attesoMs, 1, 'high', {
    switchCount: log?.switchCount ?? 0,
    trajectory: log?.trajectory ?? [],
    firstOptionIndex: log?.firstOptionIndex,
  }, question);
}

// One SM-2 step with a continuous quality (0.0–5.0). Shared by practice sessions and mock exams.
// `lastSeen` (facoltativo) è il momento dell'ultima risposta: se la risposta esatta arriva meno di MIN_GAP_MS dopo,
// non è un ripasso a distanza e le ripetizioni non avanzano. Senza `lastSeen` il passo è quello classico.
export function applySm2(
  state: { repetitions: number; interval: number; easiness: number; lastSeen?: number },
  quality: number,
  now: number = Date.now()
): { repetitions: number; interval: number; easiness: number } {
  const q = Number.isFinite(quality) ? limita(quality, 0, 5) : 0;
  let repetitions = Math.max(0, Math.floor(num(state.repetitions, 0)));
  let interval = limita(num(state.interval, 0), 0, MAX_INTERVAL_DAYS);
  let easiness = limita(num(state.easiness, EASINESS_START), EASINESS_MIN, EASINESS_MAX);

  if (q >= 3.0) {
    const trascorso = now - num(state.lastSeen, 0);
    if (repetitions > 0 && num(state.lastSeen, 0) > 0 && trascorso >= 0 && trascorso < MIN_GAP_MS) {
      // ripetizione troppo ravvicinata: nessun avanzamento né cambio di facilità
      return { repetitions, interval, easiness };
    }
    // Successful recall: increment spaced repetition interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.max(1, Math.round(Math.max(interval, 6) * easiness));
    }
    repetitions += 1;
  } else {
    // Unsuccessful or high struggle: reset interval for immediate recovery
    repetitions = 0;
    interval = 1;
  }
  interval = Math.min(MAX_INTERVAL_DAYS, interval);

  // Update SuperMemo-2 easiness factor continuously using the exact quality rating
  easiness = easiness + (0.1 - (5.0 - q) * (0.08 + (5.0 - q) * 0.02));
  easiness = limita(Math.round(easiness * 100) / 100, EASINESS_MIN, EASINESS_MAX);
  return { repetitions, interval, easiness };
}

// Confidence shown in the UI (0–100) from the SM-2 easiness factor.
// Range 1.3–3.5: a new card (2.5) starts around 55%, about ten perfect answers reach 100%.
export function confidenceFromEasiness(easiness: number = 2.5): number {
  return Math.max(0, Math.min(100, Math.round(((num(easiness, EASINESS_START) - EASINESS_MIN) / (EASINESS_MAX - EASINESS_MIN)) * 100)));
}

// Update stats after answering based on SM-2, dynamic fluency, and trajectory telemetry.
// Il primo tentativo di una domanda aggiorna tutto; i tentativi successivi (riprova dopo un errore nella stessa sessione)
// non cambiano nulla: l'errore è già registrato e una risposta esatta data subito dopo averla vista non è un ripasso.
// `omessa`: nessuna risposta data (tempo scaduto, frase che non corrisponde a niente): conta in `omitted`, non in `incorrect`.
export function updateStats(
  appState: AppState, 
  questionId: string, 
  isCorrect: boolean, 
  timeTakenMs: number = 0, 
  attempts: number = 1, 
  confidence: 'low' | 'medium' | 'high' = 'high',
  telemetry?: QuestionTelemetry,
  // La domanda come l'ha vista l'utente (opzioni nell'ordine mostrato, con la risposta esatta). Se manca la cerco nel banco.
  quiz?: QuizLike,
  omessa: boolean = false,
  now: number = Date.now()
): AppState {
  if (!Number.isFinite(attempts) || attempts > 1) return appState;
  if (omessa) isCorrect = false;

  const stats = appState.stats ?? {};
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

  let minTimeMs = num(speedStats.minTimeMs, 2500);
  let maxTimeMs = num(speedStats.maxTimeMs, 14000);
  let avgTimeMs = num(speedStats.avgTimeMs, 7000);
  let totalAnswers = Math.max(0, num(speedStats.totalAnswers, 0));
  const avgWpm = num(speedStats.avgWpm, 180);
  let speedFactor = limita(num(speedStats.speedFactor, 1.0), 0.5, 2.5);

  // 1. Calculate dynamic expected response time based on this specific question text
  const expectedTimeMs = calculateExpectedResponseTimeMs(question, speedFactor, avgWpm);

  // 2. Grade continuously from 0.0 to 5.0 based on dynamic latency ratio and click trajectory
  const quality = omessa
    ? QUALITY_OMITTED
    : calculateContinuousQuality(isCorrect, timeTakenMs, expectedTimeMs, attempts, confidence, telemetry, question);
  
  const tempoValido = Number.isFinite(timeTakenMs) && timeTakenMs > 0 && timeTakenMs <= TEMPO_ANOMALO_MS;
  if (isCorrect && tempoValido) {
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
    applySm2({ repetitions: newRepetitions, interval: newInterval, easiness: newEasiness, lastSeen: qStats.lastSeen }, quality, now));

  const dailyActivity = { ...(appState.dailyActivity || {}) };
  const giorno = chiaveGiorno(new Date(now));
  dailyActivity[giorno] = (dailyActivity[giorno] || 0) + 1;

  return {
    ...appState,
    speedStats: { minTimeMs, maxTimeMs, avgTimeMs, totalAnswers, avgWpm, speedFactor },
    dailyActivity,
    stats: {
      ...stats,
      [questionId]: {
        ...qStats,
        correct: qStats.correct + (isCorrect ? 1 : 0),
        incorrect: qStats.incorrect + (!isCorrect && !omessa ? 1 : 0),
        omitted: qStats.omitted + (omessa ? 1 : 0),
        lastSeen: now,
        box: newRepetitions,
        easiness: newEasiness,
        previousEasiness: qStats.easiness,
        interval: newInterval,
        lastResponseTimeMs: Number.isFinite(timeTakenMs) ? timeTakenMs : qStats.lastResponseTimeMs,
        lastFirstClickTimeMs: telemetry?.firstClickTimeMs,
        lastSwitchCount: telemetry?.switchCount ?? 0,
        lastTrajectory: telemetry?.trajectory,
        lastQuality: quality,
      }
    }
  };
}
