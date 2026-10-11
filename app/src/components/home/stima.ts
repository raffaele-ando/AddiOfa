// Calcoli veri della home: nessun numero inventato. Tutto deriva da appState e dalle funzioni già dell'app.
import type { AppState } from '../../types';
import { questions } from '../../data/questions';
import { theoryTopics, type TheoryTopic } from '../../data/theory';
import { estimatePassProbability } from '../../lib/diagnostic';
import { FORMATS, FREE_LIMITS, type FormatId } from '../../config/offer';

export const MIN_RISPOSTE = 5; // sotto questa soglia una percentuale per area non è affidabile

export type Livello = 'basso' | 'medio' | 'alto';
export function livelloDi(p: number): Livello { return p < 0.4 ? 'basso' : p < 0.7 ? 'medio' : 'alto'; }

// ---- Stima di superare il test
export interface Stima {
  p: number;          // 0-1
  risposte: number;   // risposte su cui è calcolata
  fonte: 'diagnostico' | 'simulazioni' | 'entrambi';
  /** Differenza in punti rispetto alla stima del solo diagnostico: solo con due stime vere. */
  delta?: number;
}

/** Risposte esatte e domande di una simulazione (i log, se ci sono; altrimenti il punteggio). */
export function esitoSimulazione(h: AppState['history'][number]): { esatte: number; totale: number } {
  const totale = h.questionIds?.length ?? h.questionLogs?.length ?? FORMATS[h.format ?? 'ente'].questions;
  const esatte = h.questionLogs ? h.questionLogs.filter(l => l.isCorrect).length : Math.round(h.score);
  return { esatte: Math.max(0, Math.min(totale, esatte)), totale };
}

/**
 * Stima con lo stesso modello del diagnostico (estimatePassProbability), alimentato dalle risposte che
 * misurano davvero il livello: il diagnostico e le simulazioni. Le sessioni di ripasso no: scelgono le domande
 * più difficili e darebbero una stima troppo severa.
 */
export function calcolaStima(stato: AppState): Stima | null {
  const o = stato.onboarding;
  const haDiag = !!o && (o.passProbability !== undefined || o.diagnosticTotal !== undefined);
  let dc = 0, dt = 0, p0: number | undefined;
  if (o && haDiag) {
    dt = o.diagnosticTotal ?? FREE_LIMITS.diagnostic;
    dc = o.diagnosticCorrect ?? 0;
    p0 = o.passProbability ?? (o.diagnosticTotal !== undefined && o.diagnosticCorrect !== undefined ? estimatePassProbability(dc, dt) : undefined);
    if (p0 === undefined) dt = 0;
  }
  let sc = 0, st = 0;
  for (const h of stato.history) { const e = esitoSimulazione(h); sc += e.esatte; st += e.totale; }
  if (p0 === undefined && st === 0) return null;
  if (st === 0) return { p: p0!, risposte: dt, fonte: 'diagnostico' };
  const p = estimatePassProbability(dc + sc, dt + st);
  if (p0 === undefined) return { p, risposte: st, fonte: 'simulazioni' };
  const delta = Math.round((p - p0) * 100);
  return { p, risposte: dt + st, fonte: 'entrambi', delta: Math.abs(delta) >= 1 ? delta : undefined };
}

// ---- Fattori: accuratezza per categoria e per livello
export interface Fattore { id: string; nome: string; filtro: string; risposte: number; percento: number | null }

export function calcolaFattori(stato: AppState): { categorie: Fattore[]; livelli: Fattore[]; risposteTotali: number } {
  const per: Record<string, { c: number; t: number }> = {};
  let risposteTotali = 0;
  const somma = (chiave: string | undefined, c: number, t: number) => {
    if (!chiave) return;
    const r = (per[chiave] ??= { c: 0, t: 0 }); r.c += c; r.t += t;
  };
  for (const q of questions) {
    const s = stato.stats[q.id];
    if (!s) continue;
    const t = s.correct + s.incorrect;
    risposteTotali += t;
    somma(`category:${q.category}`, s.correct, t);
    somma(q.level ? `level:${q.level}` : undefined, s.correct, t);
  }
  const voce = (filtro: string, nome: string): Fattore => {
    const r = per[filtro] ?? { c: 0, t: 0 };
    return { id: filtro, nome, filtro, risposte: r.t, percento: r.t >= MIN_RISPOSTE ? Math.round((r.c / r.t) * 100) : null };
  };
  return {
    categorie: [voce('category:Grammatica', 'Grammatica'), voce('category:Traduzione', 'Traduzione')],
    livelli: [voce('level:A1', 'A1'), voce('level:A2', 'A2'), voce('level:B1', 'B1')],
    risposteTotali,
  };
}

// ---- Prossima lezione: la scheda dell'argomento più debole
const ORDINE_LIVELLI = ['A1', 'A2', 'B1'];
const ordinati: TheoryTopic[] = [...theoryTopics]
  .sort((a, b) => ORDINE_LIVELLI.indexOf(a.livello) - ORDINE_LIVELLI.indexOf(b.livello))
  .filter(t => t.pronta);
/** Stesso criterio di screens/Theory.tsx: gratis i primi N argomenti pronti nell'ordine di studio. */
const gratisIds = new Set(ordinati.slice(0, FREE_LIMITS.freeTheoryTopics).map(t => t.id));

export function minutiLettura(t: TheoryTopic): number {
  const testo = [...t.regola, ...t.esempi.flatMap(e => [e.en, e.it]), ...t.errori.flatMap(e => [e.sbagliato, e.giusto, e.perche]), t.consiglio].join(' ');
  const parole = testo.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(parole / 180));
}

export interface Lezione {
  topic: TheoryTopic;
  minuti: number;
  bloccata: boolean;
  motivo: 'debole' | 'inizio';
  percento?: number;
  risposte?: number;
}

export function lezioneConsigliata(stato: AppState, pass: boolean): Lezione | null {
  if (ordinati.length === 0) return null;
  const tot: Record<string, { c: number; t: number }> = {};
  for (const q of questions) {
    const s = stato.stats[q.id];
    if (!s || !q.theoryId) continue;
    const r = (tot[q.theoryId] ??= { c: 0, t: 0 });
    r.c += s.correct; r.t += s.correct + s.incorrect;
  }
  const candidati = ordinati.filter(t => (tot[t.id]?.t ?? 0) >= 3)
    .map(t => ({ topic: t, perc: Math.round((tot[t.id].c / tot[t.id].t) * 100), n: tot[t.id].t }))
    .sort((a, b) => a.perc - b.perc || b.n - a.n);
  const peggiore = candidati[0];
  if (peggiore && peggiore.perc < 85) {
    return { topic: peggiore.topic, minuti: minutiLettura(peggiore.topic), bloccata: !pass && !gratisIds.has(peggiore.topic.id), motivo: 'debole', percento: peggiore.perc, risposte: peggiore.n };
  }
  const nuovo = ordinati.find(t => !tot[t.id]) ?? ordinati[0];
  return { topic: nuovo, minuti: minutiLettura(nuovo), bloccata: !pass && !gratisIds.has(nuovo.id), motivo: 'inizio' };
}

// ---- Ultima simulazione contro la soglia
export interface Obiettivo { formato: FormatId; esatte: number; totale: number; soglia: number; superata: boolean }
export function ultimaSimulazione(stato: AppState): Obiettivo | null {
  if (stato.history.length === 0) return null;
  const h = [...stato.history].sort((a, b) => b.date - a.date)[0];
  const formato: FormatId = h.format ?? 'ente';
  const { esatte, totale } = esitoSimulazione(h);
  const soglia = FORMATS[formato].passMark;
  return { formato, esatte, totale, soglia, superata: esatte >= soglia };
}

// ---- Attività degli ultimi 7 giorni (stessa chiave data di App.tsx: ISO, UTC)
export function ultimiGiorni(stato: AppState, n = 7): { data: string; conteggio: number; lettera: string }[] {
  const out: { data: string; conteggio: number; lettera: string }[] = [];
  const oggi = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(oggi); d.setDate(oggi.getDate() - i);
    const data = d.toISOString().split('T')[0];
    out.push({ data, conteggio: stato.dailyActivity?.[data] ?? 0, lettera: 'DLMMGVS'[d.getDay()] });
  }
  return out;
}
