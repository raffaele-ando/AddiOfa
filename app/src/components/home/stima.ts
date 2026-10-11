// Calcoli veri della home: nessun numero inventato. Tutto deriva da appState e dalle funzioni già dell'app.
import type { AppState } from '../../types';
import { questions } from '../../data/questions';
import { theoryTopics, type TheoryTopic } from '../../data/theory';
import { estimatePassProbability, intervalloStima, normalizzaConteggio, type IntervalloStima } from '../../lib/diagnostic';
import { chiaveGiorno } from '../../lib/utils';
import { FORMATS, FREE_LIMITS, type FormatId } from '../../config/offer';

export const MIN_RISPOSTE = 5; // sotto questa soglia una percentuale per area non è affidabile

/**
 * Fasce della stima. Con la soglia 25/30 (83 % di risposte esatte) il modello dà, sul diagnostico da 10 domande:
 * 7/10 = 18 %, 8/10 = 36 %, 9/10 = 62 %, 10/10 = 87 %; su una simulazione 25/30 = 52 %, 26/30 = 66 %, 28/30 = 88 %.
 * Le soglie 40 e 70 restano giuste: 'medio' coincide con "sul filo della soglia" (25-26 su 30, 9 su 10), 'alto' con
 * "ci si arriva con margine" (27 su 30 o più, 10 su 10). 8 su 10 è 'basso' (36 %): è onesto, perché serve l'83 %.
 */
export const SOGLIA_MEDIO = 0.4;
export const SOGLIA_ALTO = 0.7;

export type Livello = 'basso' | 'medio' | 'alto';
export function livelloDi(p: number): Livello {
  if (!Number.isFinite(p)) return 'basso';
  return p < SOGLIA_MEDIO ? 'basso' : p < SOGLIA_ALTO ? 'medio' : 'alto';
}

// ---- Stima di superare il test
export interface Stima {
  p: number;          // 0-1
  risposte: number;   // risposte su cui è calcolata
  fonte: 'diagnostico' | 'simulazioni' | 'entrambi';
  /** Differenza in punti rispetto alla stima del solo diagnostico: solo con due stime vere. */
  delta?: number;
  /** Intervallo credibile all'80 % (intervalloStima) sulle stesse risposte: per dire "tra X e Y %". */
  intervallo: IntervalloStima;
}

/** Quante simulazioni, le più recenti, entrano nella stima: chi migliora non deve restare ancorato ai risultati di settimane fa. */
export const SIMULAZIONI_NELLA_STIMA = 3;
/** Con almeno questa quantità di simulazioni recenti le 10 domande del diagnostico (più vecchie e meno precise) escono dalla stima. */
export const SIMULAZIONI_CHE_SOSTITUISCONO_DIAGNOSTICO = 2;

export interface EsitoSim { esatte: number; totale: number; /** risposte date (le omesse no) */ date: number }

/**
 * Risposte esatte e domande di una simulazione (i log, se ci sono; altrimenti il punteggio).
 * - le risposte omesse sono nel totale e non tra le esatte: al test vero valgono zero, quindi per la stima sono come errori
 *   (per la conoscenza, invece, non sono errori: calcolaFattori e SM-2 le trattano a parte);
 * - la stessa domanda ripetuta nei log o negli id vale una volta;
 * - senza log il punteggio del TENG ha la penalità sugli errori: si ricava il numero di esatte dall'esito (superato o no).
 */
export function esitoSimulazione(h: AppState['history'][number]): EsitoSim {
  const formato = FORMATS[h.format ?? 'ente'] ?? FORMATS.ente;
  if (Array.isArray(h.questionLogs) && h.questionLogs.length > 0) {
    const perId = new Map<string, { esatta: boolean; data: boolean }>();
    for (const l of h.questionLogs) {
      if (!l || typeof l.questionId !== 'string' || perId.has(l.questionId)) continue;
      perId.set(l.questionId, { esatta: l.isCorrect === true, data: l.userAnswerIndex !== null && l.userAnswerIndex !== undefined });
    }
    const totale = perId.size;
    let esatte = 0, date = 0;
    for (const v of perId.values()) { if (v.esatta) esatte++; if (v.data) date++; }
    return { esatte, totale, date };
  }
  const ids = Array.isArray(h.questionIds) ? new Set(h.questionIds).size : 0;
  const totale = ids > 0 ? ids : formato.questions;
  const punteggio = Number.isFinite(h.score) ? Math.round(h.score) : 0;
  // Senza log si sa solo il punteggio. Lo conferma l'esito: superata => almeno la soglia; non superata => meno della soglia.
  const esatte = h.passed === true ? Math.max(punteggio, formato.passMark) : Math.min(Math.max(punteggio, 0), formato.passMark - 1);
  const ok = Math.max(0, Math.min(totale, esatte));
  // senza log non si sa quante risposte sono state date: si assume che siano tutte (come prima di questa regola)
  return { esatte: ok, totale, date: totale };
}

interface DatiStima {
  /** Diagnostico: esatte, totale e probabilità; assente se non c'è (o non è valido). */
  diag?: { dc: number; dt: number; p0: number };
  /** Simulazioni valide in ordine di data (tutte, non solo la finestra). */
  valide: EsitoSim[];
}

/** Legge dallo stato i dati che alimentano la stima: il diagnostico e le simulazioni valide, in ordine di data. */
function datiStima(stato: AppState): DatiStima {
  const o = stato?.onboarding;

  // diagnostico
  let diag: DatiStima['diag'];
  if (o && typeof o === 'object') {
    const haConteggi = Number.isFinite(o.diagnosticTotal) && (o.diagnosticTotal ?? 0) > 0 && Number.isFinite(o.diagnosticCorrect);
    if (haConteggi) {
      const { correct: dc, total: dt } = normalizzaConteggio(o.diagnosticCorrect as number, o.diagnosticTotal as number);
      diag = { dc, dt, p0: estimatePassProbability(dc, dt) };
    } else if (typeof o.passProbability === 'number' && Number.isFinite(o.passProbability)) {
      // salvataggio vecchio: solo la percentuale. Si risale al numero di esatte (su 10) che la produce.
      const p0 = Math.min(1, Math.max(0, o.passProbability));
      const dt = FREE_LIMITS.diagnostic;
      let migliore = 0, scarto = Infinity;
      for (let c = 0; c <= dt; c++) {
        const d = Math.abs(estimatePassProbability(c, dt) - p0);
        if (d < scarto) { scarto = d; migliore = c; }
      }
      diag = { dc: migliore, dt, p0 };
    }
  }

  // simulazioni: ordine per data, una sola volta per id, solo con almeno una risposta data
  const viste = new Set<string>();
  const valide = (Array.isArray(stato?.history) ? stato.history : [])
    .filter(h => h && typeof h === 'object' && Number.isFinite(h.date))
    .sort((a, b) => a.date - b.date)
    .filter(h => {
      if (typeof h.id === 'string' && h.id) { if (viste.has(h.id)) return false; viste.add(h.id); }
      return true;
    })
    .map(esitoSimulazione)
    .filter(e => e.totale > 0 && e.date > 0);
  return { diag, valide };
}

/** Stima dopo le prime `fino` simulazioni valide (0 = solo diagnostico): la stessa regola di calcolaStima, applicata a quel momento. */
function stimaDopo(d: DatiStima, fino: number): Stima | null {
  const finestra = d.valide.slice(Math.max(0, fino - SIMULAZIONI_NELLA_STIMA), fino);
  let sc = 0, st = 0;
  for (const e of finestra) { sc += e.esatte; st += e.totale; }

  if (!d.diag && st === 0) return null;
  if (st === 0) return { p: d.diag!.p0, risposte: d.diag!.dt, fonte: 'diagnostico', intervallo: intervalloStima(d.diag!.dc, d.diag!.dt) };

  const diagnosticoEntra = !!d.diag && finestra.length < SIMULAZIONI_CHE_SOSTITUISCONO_DIAGNOSTICO;
  const c = sc + (diagnosticoEntra ? d.diag!.dc : 0);
  const t = st + (diagnosticoEntra ? d.diag!.dt : 0);
  const p = estimatePassProbability(c, t);
  const base = { p, risposte: t, intervallo: intervalloStima(c, t) };
  if (!d.diag) return { ...base, fonte: 'simulazioni' };
  const delta = Math.round((p - d.diag.p0) * 100);
  return { ...base, fonte: diagnosticoEntra ? 'entrambi' : 'simulazioni', delta: Math.abs(delta) >= 1 ? delta : undefined };
}

/**
 * Stima con lo stesso modello del diagnostico (estimatePassProbability), alimentato dalle risposte che
 * misurano davvero il livello: il diagnostico e le simulazioni. Le sessioni di ripasso no: scelgono le domande
 * più difficili e darebbero una stima troppo severa.
 *
 * Regole (provate in app/tests/unit/stima.test.ts):
 * - niente diagnostico e niente simulazioni valide: null (mai la probabilità a priori);
 * - il diagnostico si riconta sempre da esatte/totali (la percentuale salvata può venire da una soglia vecchia);
 *   se ci sono solo i conteggi o solo la percentuale si usa quello che c'è;
 * - simulazioni: le ultime SIMULAZIONI_NELLA_STIMA per data, ognuna una volta sola (stesso id = stessa simulazione),
 *   escluse quelle senza nessuna risposta data (aperta e lasciata scadere: non misura niente);
 * - le omesse contano come errori, le scadute sono simulazioni normali con molte omesse;
 * - con almeno SIMULAZIONI_CHE_SOSTITUISCONO_DIAGNOSTICO simulazioni il diagnostico non entra più nel calcolo.
 */
export function calcolaStima(stato: AppState): Stima | null {
  const d = datiStima(stato);
  return stimaDopo(d, d.valide.length);
}

/** Un punto misurato della serie: la stima che si aveva dopo il diagnostico o dopo una simulazione. */
export interface PuntoStima {
  /** 0-1, la stima in quel momento (stesso modello di calcolaStima). */
  p: number;
  /** 'Diagnostico' oppure 'Dopo sim. N' (N = numero d'ordine della simulazione tra quelle valide). */
  nome: string;
  tipo: 'diagnostico' | 'simulazione';
}

/**
 * Serie delle stime MISURATE, in ordine, per il grafico "Come cambia la tua probabilità": la stima dopo il diagnostico
 * e quella dopo ciascuna simulazione (ricalcolata con la stessa finestra e la stessa regola di calcolaStima).
 * L'ultimo punto coincide sempre con calcolaStima(stato).p. Mai proiezioni: niente punti che non sono stati misurati.
 * Restano gli ultimi `max` punti; la numerazione delle simulazioni è quella assoluta ("Dopo sim. 3" resta tale).
 */
export function serieStime(stato: AppState, max = 5): PuntoStima[] {
  const d = datiStima(stato);
  const punti: PuntoStima[] = [];
  if (d.diag) { const s = stimaDopo(d, 0); if (s) punti.push({ p: s.p, nome: 'Diagnostico', tipo: 'diagnostico' }); }
  for (let k = 1; k <= d.valide.length; k++) {
    const s = stimaDopo(d, k);
    if (s) punti.push({ p: s.p, nome: `Dopo sim. ${k}`, tipo: 'simulazione' });
  }
  return max > 0 ? punti.slice(-max) : punti;
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
    const s = stato.stats?.[q.id];
    if (!s) continue;
    // solo risposte date: le omesse (simulazioni) non sono errori di conoscenza
    const c = Math.max(0, Number.isFinite(s.correct) ? s.correct : 0);
    const t = c + Math.max(0, Number.isFinite(s.incorrect) ? s.incorrect : 0);
    risposteTotali += t;
    somma(`category:${q.category}`, c, t);
    somma(q.level ? `level:${q.level}` : undefined, c, t);
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
    const s = stato.stats?.[q.id];
    if (!s || !q.theoryId) continue;
    const r = (tot[q.theoryId] ??= { c: 0, t: 0 });
    const c = Math.max(0, Number.isFinite(s.correct) ? s.correct : 0);
    r.c += c; r.t += c + Math.max(0, Number.isFinite(s.incorrect) ? s.incorrect : 0);
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
  const storico = (Array.isArray(stato.history) ? stato.history : []).filter(h => h && Number.isFinite(h.date));
  if (storico.length === 0) return null;
  const h = [...storico].sort((a, b) => b.date - a.date)[0];
  const formato: FormatId = FORMATS[h.format ?? 'ente'] ? (h.format ?? 'ente') : 'ente';
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
    const data = chiaveGiorno(d);
    out.push({ data, conteggio: stato.dailyActivity?.[data] ?? 0, lettera: 'DLMMGVS'[d.getDay()] });
  }
  return out;
}
