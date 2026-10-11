import { Question } from '../types';
import { getQuestionsByCorpus } from '../data/questions';
import { calculateSimilarity, shuffleArray, shuffleQuestion } from './utils';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../config/offer';

export const DIAGNOSTIC_LENGTH = 10;

// Stessa proporzione di livelli del banco (circa 30% A1, 20% A2, 50% B1), argomenti tutti diversi
const LEVEL_MIX: Record<string, number> = { A1: 3, A2: 2, B1: 5 };

/** Domande troppo simili tra loro (calculateSimilarity oltre questa soglia) non stanno nello stesso diagnostico. */
export const SOGLIA_SOMIGLIANZA = 0.45;

/** Il diagnostico usa solo il nucleo gratuito, che sta già nell'app: funziona anche senza rete e senza Pass. */
export function diagnosticPool(): Question[] {
  return getQuestionsByCorpus('initial');
}

// ---- Memoria dell'ultimo diagnostico: chi lo rifà non rivede le stesse domande di fila
const KEY_ULTIMO_DIAGNOSTICO = 'addiofa_diagnostico_ultimo';
let ultimoInMemoria: string[] = [];

function leggiUltimiIds(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY_ULTIMO_DIAGNOSTICO) ?? 'null');
    if (Array.isArray(v) && v.every(x => typeof x === 'string')) return v;
  } catch { /* storage assente o rovinato: si ripiega sulla memoria */ }
  return ultimoInMemoria;
}

function salvaUltimiIds(ids: string[]): void {
  ultimoInMemoria = ids;
  try { localStorage.setItem(KEY_ULTIMO_DIAGNOSTICO, JSON.stringify(ids)); } catch { /* resta in memoria */ }
}

/**
 * Sceglie le domande del diagnostico dal pool (di norma il nucleo). Livelli 3 A1 + 2 A2 + 5 B1, argomenti diversi
 * quando il pool lo permette, mai due domande quasi uguali, mai la stessa domanda due volte.
 * `evita`: id da lasciare per ultimi (di default quelli dell'ultimo diagnostico fatto su questo dispositivo).
 * Con un pool piccolo o senza qualche livello completa con le altre domande: restituisce meno di 10 solo se il pool ne ha meno.
 */
export function pickDiagnosticQuestions(pool: Question[] = diagnosticPool(), evita: readonly string[] = leggiUltimiIds()): Question[] {
  const recenti = new Set(evita);
  // prima le domande non viste nell'ultimo diagnostico, poi (solo se non bastano) le altre
  const ordinato = (list: Question[]) => {
    const mescolate = shuffleArray(list);
    return [...mescolate.filter(q => !recenti.has(q.id)), ...mescolate.filter(q => recenti.has(q.id))];
  };

  const selected: Question[] = [];
  const usedTopics = new Set<string>();
  const topicOf = (q: Question) => q.grammarTopic || q.category;
  const distinta = (q: Question) => !selected.some(s => s.id === q.id) && !selected.some(s => calculateSimilarity(s.prompt, q.prompt) > SOGLIA_SOMIGLIANZA);
  const free = (q: Question, strict: boolean) => distinta(q) && !(strict && usedTopics.has(topicOf(q)));

  // Prima passata: livelli e argomenti diversi; seconda: stessi livelli ma argomenti che si possono ripetere
  for (const strict of [true, false]) {
    for (const [level, count] of Object.entries(LEVEL_MIX)) {
      let taken = selected.filter(q => q.level === level).length;
      for (const q of ordinato(pool.filter(q => q.level === level))) {
        if (taken >= count) break;
        if (!free(q, strict)) continue;
        selected.push(q);
        usedTopics.add(topicOf(q));
        taken++;
      }
    }
  }

  // Se mancano ancora domande (nucleo piccolo, livello povero, domande senza livello) completa con le altre:
  // prima quelle diverse dalle già scelte, poi, solo se non c'è altro, anche quelle simili (ma mai lo stesso id)
  for (const conSomiglianza of [false, true]) {
    for (const q of ordinato(pool)) {
      if (selected.length >= DIAGNOSTIC_LENGTH) break;
      if (conSomiglianza ? !selected.some(s => s.id === q.id) : !distinta(q)) continue;
      selected.push(q);
    }
  }

  const scelte = shuffleArray(selected).slice(0, DIAGNOSTIC_LENGTH);
  salvaUltimiIds(scelte.map(q => q.id));
  return scelte.map(shuffleQuestion);
}

// ---- Probabilità di superare il test (modello beta-binomiale)

const LOG_FATT: number[] = [0, 0];
function logFactorial(n: number): number {
  for (let i = LOG_FATT.length; i <= n; i++) LOG_FATT.push(LOG_FATT[i - 1] + Math.log(i));
  return LOG_FATT[n];
}

// log B(a, b) per a, b interi positivi
function logBeta(a: number, b: number): number {
  return logFactorial(a - 1) + logFactorial(b - 1) - logFactorial(a + b - 1);
}

function logChoose(n: number, k: number): number {
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

/** Oltre questo numero di risposte il conteggio si riscala (dati corrotti non devono bloccare il calcolo). */
const MAX_RISPOSTE_MODELLO = 5000;

/** Porta (esatte, totali) a due interi coerenti: totali ≥ 0, 0 ≤ esatte ≤ totali. Valori non numerici valgono 0. */
export function normalizzaConteggio(correct: number, total: number): { correct: number; total: number } {
  let t = Number.isFinite(total) ? Math.max(0, Math.round(total)) : 0;
  let c = Number.isFinite(correct) ? Math.max(0, Math.round(correct)) : 0;
  if (t > MAX_RISPOSTE_MODELLO) { c = Math.round(c * MAX_RISPOSTE_MODELLO / t); t = MAX_RISPOSTE_MODELLO; }
  return { correct: Math.min(c, t), total: t };
}

/** P(almeno `passMark` esatte su `n`) se l'accuratezza vera è `p`. */
function codaBinomiale(n: number, passMark: number, p: number): number {
  const k = Math.max(0, Math.ceil(passMark));
  if (k <= 0) return 1;
  if (k > n) return 0;
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  let somma = 0;
  for (let x = k; x <= n; x++) somma += Math.exp(logChoose(n, x) + x * Math.log(p) + (n - x) * Math.log(1 - p));
  return Math.min(1, somma);
}

/**
 * Probabilità di fare almeno REAL_TEST_PASS_MARK risposte esatte su REAL_TEST_QUESTIONS,
 * dato `correct` su `total` nelle risposte date (diagnostico e/o simulazioni).
 * Modello beta-binomiale: accuratezza ignota con prior uniforme, aggiornata con le risposte date.
 * Con sole 10 domande la stima è volutamente prudente: è un'indicazione, non una sentenza.
 * Senza risposte (total = 0) restituisce la probabilità a priori (circa 19 %): chi mostra la stima deve evitare quel caso.
 * Per MOSTRARE il numero usa formatProbabilita: mai "0 %" né "100 %".
 */
export function estimatePassProbability(
  correct: number,
  total: number,
  testQuestions = REAL_TEST_QUESTIONS,
  passMark = REAL_TEST_PASS_MARK
): number {
  const n = normalizzaConteggio(correct, total);
  const a = n.correct + 1;
  const b = n.total - n.correct + 1;
  const logNorm = logBeta(a, b);
  let p = 0;
  for (let x = Math.max(0, Math.ceil(passMark)); x <= testQuestions; x++) {
    p += Math.exp(logChoose(testQuestions, x) + logBeta(x + a, testQuestions - x + b) - logNorm);
  }
  return Math.min(1, Math.max(0, p));
}

/**
 * Percentuale da mostrare: un numero intero tra 1 e 99, oppure "<1 %" e ">99 %" quando la probabilità è
 * solo molto bassa o molto alta. Mai "0 %" né "100 %": una stima su poche domande non è mai una certezza.
 * Usarla ovunque si scrive la percentuale (Onboarding, Misuratore/Indicatore, Stima in home, FoglioStima).
 */
export function formatProbabilita(p: number): string {
  if (!Number.isFinite(p)) return '–';
  const r = Math.round(Math.min(1, Math.max(0, p)) * 100);
  if (r < 1) return '<1 %';
  if (r > 99) return '>99 %';
  return `${r} %`;
}

/** Intero da 1 a 99 per grafici e misuratori (che vogliono un numero): stessa regola di formatProbabilita. */
export function percentualeVisibile(p: number): number {
  if (!Number.isFinite(p)) return 1;
  return Math.min(99, Math.max(1, Math.round(p * 100)));
}

export interface IntervalloStima {
  /** Livello di credibilità (0,8 = 80 %). */
  livello: number;
  /** Intervallo credibile dell'accuratezza vera (0-1). */
  accuratezza: { min: number; max: number };
  /** Intervallo credibile della probabilità di superare il test (0-1); contiene sempre la stima centrale. */
  probabilita: { min: number; max: number };
  /** Punteggio atteso su REAL_TEST_QUESTIONS, agli estremi dell'accuratezza (interi). */
  punteggio: { min: number; max: number };
}

// Quantile della Beta(a, b) con a, b interi: la sua funzione di ripartizione è una coda binomiale.
function quantileBeta(a: number, b: number, q: number): number {
  const n = a + b - 1;
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (codaBinomiale(n, a, mid) < q) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Intervallo di credibilità (default 80 %) per dire "tra X e Y %": l'accuratezza vera sta nell'intervallo con probabilità 0,8
 * e la probabilità di superare il test si calcola ai suoi estremi. Più sono le risposte più l'intervallo si stringe.
 */
export function intervalloStima(
  correct: number,
  total: number,
  livello = 0.8,
  testQuestions = REAL_TEST_QUESTIONS,
  passMark = REAL_TEST_PASS_MARK
): IntervalloStima {
  const n = normalizzaConteggio(correct, total);
  const l = Math.min(0.99, Math.max(0.5, Number.isFinite(livello) ? livello : 0.8));
  const a = n.correct + 1;
  const b = n.total - n.correct + 1;
  const accMin = quantileBeta(a, b, (1 - l) / 2);
  const accMax = quantileBeta(a, b, 1 - (1 - l) / 2);
  const centrale = estimatePassProbability(n.correct, n.total, testQuestions, passMark);
  return {
    livello: l,
    accuratezza: { min: accMin, max: accMax },
    // la coda è crescente in p: i quantili si trasportano agli estremi. La stima centrale è una media e,
    // con distribuzioni molto asimmetriche, può uscire di poco: l'intervallo la include sempre.
    probabilita: {
      min: Math.min(centrale, codaBinomiale(testQuestions, passMark, accMin)),
      max: Math.max(centrale, codaBinomiale(testQuestions, passMark, accMax)),
    },
    punteggio: { min: Math.round(accMin * testQuestions), max: Math.round(accMax * testQuestions) },
  };
}

/** "tra 12 e 71 %" (con "meno di 1" e "più di 99" agli estremi). */
export function formatIntervallo(i: IntervalloStima): string {
  const lo = Math.round(i.probabilita.min * 100);
  const hi = Math.round(i.probabilita.max * 100);
  const a = lo < 1 ? 'meno di 1' : String(lo);
  const b = hi > 99 ? 'più di 99' : String(hi);
  return `tra ${a} e ${b} %`;
}

export function weakTopics(asked: Question[], answers: Record<string, number>): string[] {
  return asked
    .filter(q => answers[q.id] !== q.correctIndex)
    .map(q => q.grammarTopic || q.category)
    .filter((t, i, all) => all.indexOf(t) === i);
}
