// Casi 4 e 5: SM-2, qualità delle risposte, "domanda imparata", scelta delle domande da ripassare.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applySm2, calculateContinuousQuality, calculateExpectedResponseTimeMs, calculateItemTextMetrics, confidenceFromEasiness,
  countLearned, EASINESS_MAX, EASINESS_MIN, getQuestionStats, isInProgress, isLearned, MAX_INTERVAL_DAYS, MIN_GAP_MS,
  poolMeta, QUALITY_OMITTED, qualityForResult, selectPracticeIds, updateStats,
} from '../../src/lib/spacedRepetition';
import { chiaveGiorno } from '../../src/lib/utils';
import { statoVuoto, GIORNO } from './aiuti';
import type { AppState, UserStats } from '../../src/types';

const nucleoIds = poolMeta(false).map(m => m.id);
const ADESSO = Date.UTC(2026, 9, 11, 10, 0, 0);
const base = { repetitions: 0, interval: 0, easiness: 2.5 };

// ---- SM-2

test('SM-2: 1 giorno, poi 6, poi 6 x facilità; un errore riporta a 1 giorno', () => {
  let s = applySm2(base, 5);
  assert.deepEqual([s.repetitions, s.interval], [1, 1]);
  s = applySm2(s, 5);
  assert.deepEqual([s.repetitions, s.interval], [2, 6]);
  const ef = s.easiness;
  s = applySm2(s, 5);
  assert.deepEqual([s.repetitions, s.interval], [3, Math.round(6 * ef)]);
  s = applySm2(s, 1);
  assert.deepEqual([s.repetitions, s.interval], [0, 1]);
});

test('SM-2: la facilità non scende sotto 1,3 né sale sopra 3,5', () => {
  let s = base;
  for (let i = 0; i < 50; i++) s = applySm2(s, 0);
  assert.equal(s.easiness, EASINESS_MIN);
  s = base;
  for (let i = 0; i < 100; i++) s = applySm2(s, 5);
  assert.equal(s.easiness, EASINESS_MAX);
});

test('SM-2: l\'intervallo ha un tetto di 90 giorni (senza tetto 100 risposte perfette davano anni)', () => {
  let s = base;
  for (let i = 0; i < 100; i++) s = applySm2(s, 5);
  assert.equal(s.interval, MAX_INTERVAL_DAYS);
  assert.equal(applySm2({ repetitions: 5, interval: 5000, easiness: 3 }, 5).interval, MAX_INTERVAL_DAYS);
});

test('SM-2: qualità o stato non numerici non producono NaN', () => {
  for (const q of [NaN, Infinity, -4, 99]) {
    const s = applySm2(base, q);
    assert.ok(Number.isFinite(s.easiness) && Number.isFinite(s.interval) && Number.isFinite(s.repetitions));
  }
  const s = applySm2({ repetitions: NaN, interval: NaN, easiness: NaN }, 4);
  assert.deepEqual(s, { repetitions: 1, interval: 1, easiness: s.easiness });
  assert.ok(Number.isFinite(s.easiness));
});

test('SM-2: stato vecchio con intervallo 0 ma già due ripetizioni non produce un intervallo di 1 giorno', () => {
  assert.ok(applySm2({ repetitions: 2, interval: 0, easiness: 2.5 }, 5).interval >= 6);
});

test('SM-2: una risposta esatta meno di 12 ore dopo l\'ultima non fa avanzare le ripetizioni', () => {
  const ora = ADESSO;
  const stato = { repetitions: 1, interval: 1, easiness: 2.5 };
  assert.deepEqual(applySm2({ ...stato, lastSeen: ora - 60 * 60 * 1000 }, 5, ora), stato);
  assert.equal(applySm2({ ...stato, lastSeen: ora - MIN_GAP_MS - 1 }, 5, ora).repetitions, 2);
  assert.equal(applySm2({ ...stato, lastSeen: ora - 2 * GIORNO }, 5, ora).repetitions, 2);
  // un errore ravvicinato vale comunque
  assert.equal(applySm2({ ...stato, lastSeen: ora - 1000 }, 0, ora).repetitions, 0);
  // data nel futuro (orologio spostato): non blocca la domanda
  assert.equal(applySm2({ ...stato, lastSeen: ora + 5 * GIORNO }, 5, ora).repetitions, 2);
  // domanda mai vista: la prima risposta esatta conta sempre
  assert.equal(applySm2({ repetitions: 0, interval: 0, easiness: 2.5, lastSeen: ora - 1000 }, 5, ora).repetitions, 1);
});

// ---- qualità delle risposte

test('qualità: sbagliata 0, omessa 2, esatta veloce 5, esatta lenta tra 3 e 3,5, indovinata sotto 3', () => {
  const atteso = 4000;
  assert.equal(calculateContinuousQuality(false, 1000, atteso), 0);
  assert.equal(qualityForResult('incorrect'), 0);
  assert.equal(qualityForResult('omitted'), QUALITY_OMITTED);
  assert.equal(calculateContinuousQuality(true, 3000, atteso), 5);
  const lenta = calculateContinuousQuality(true, atteso * 3, atteso);
  assert.ok(lenta >= 3 && lenta <= 3.5, String(lenta));
  assert.equal(calculateContinuousQuality(true, atteso * 9, atteso), 3);
  assert.ok(calculateContinuousQuality(true, 3000, atteso, 1, 'low') < 3);
  assert.ok(calculateContinuousQuality(true, 3000, atteso, 2) < 3, 'riprova dopo un errore: mai un successo pieno');
});

test('qualità: l\'omessa pesa meno dell\'errore sulla facilità e riporta comunque la domanda a domani', () => {
  const dopoErrore = applySm2({ repetitions: 3, interval: 20, easiness: 2.5 }, 0);
  const dopoOmessa = applySm2({ repetitions: 3, interval: 20, easiness: 2.5 }, QUALITY_OMITTED);
  assert.equal(dopoOmessa.interval, 1);
  assert.equal(dopoOmessa.repetitions, 0);
  assert.ok(dopoOmessa.easiness > dopoErrore.easiness);
});

test('tempi anomali (negativo, zero, NaN, enorme, scheda in background): rapporto neutro, né 5 né 3', () => {
  const neutro = calculateContinuousQuality(true, 6000, 4000); // rapporto 1,5
  for (const t of [-500, 0, NaN, Infinity, 10 * 60 * 1000, 60 * 60 * 1000]) {
    const q = calculateContinuousQuality(true, t, 4000);
    assert.equal(q, neutro, `tempo ${t}`);
    assert.ok(q > 3.5 && q < 5);
  }
  assert.equal(calculateContinuousQuality(true, 5000, NaN), calculateContinuousQuality(true, 5000, 4000));
});

test('domanda mancante (banco servito dal Worker): nessuna funzione si rompe', () => {
  const t = calculateExpectedResponseTimeMs(undefined);
  assert.ok(Number.isFinite(t) && t >= 2200);
  assert.deepEqual(calculateItemTextMetrics(undefined), { wordCount: 8, charCount: 40 });
  const strana = { prompt: undefined, options: undefined } as unknown as { prompt: string; options: string[] };
  assert.ok(Number.isFinite(calculateExpectedResponseTimeMs(strana)));
  assert.ok(Number.isFinite(calculateExpectedResponseTimeMs(undefined, NaN, 0)));
  assert.ok(Number.isFinite(calculateExpectedResponseTimeMs(undefined, 1, NaN)));
  assert.ok(qualityForResult('correct', undefined, { timeSpentMs: 3000 }) >= 3);
  assert.ok(qualityForResult('correct', undefined, undefined) > 3.5, 'senza tempo né domanda: neutro');
});

test('confidenceFromEasiness: da 0 a 100, anche con valori strani', () => {
  assert.equal(confidenceFromEasiness(1.3), 0);
  assert.equal(confidenceFromEasiness(3.5), 100);
  assert.equal(confidenceFromEasiness(9), 100);
  assert.equal(confidenceFromEasiness(NaN), confidenceFromEasiness(2.5));
});

// ---- updateStats

function dopo(stato: AppState, ...passi: Parameters<typeof updateStats> extends [AppState, ...infer R] ? R[] : never): AppState {
  return passi.reduce((s, p) => updateStats(s, ...p), stato);
}

test('updateStats con id che non è nel banco e senza domanda: funziona e registra la risposta', () => {
  const s = updateStats(statoVuoto(), 'id-inesistente', true, 4000);
  assert.equal(s.stats['id-inesistente'].correct, 1);
  assert.equal(s.stats['id-inesistente'].box, 1);
  assert.ok(Number.isFinite(s.speedStats!.speedFactor!));
});

test('updateStats: tempo NaN, negativo o enorme non avvelena il fattore di velocità', () => {
  let s = statoVuoto();
  for (const t of [NaN, -1000, 0, Infinity, 3 * 60 * 60 * 1000]) s = updateStats(s, 'x' + t, true, t);
  const v = s.speedStats!;
  for (const k of ['speedFactor', 'avgTimeMs', 'minTimeMs', 'maxTimeMs', 'totalAnswers'] as const) assert.ok(Number.isFinite(v[k]!), k);
  assert.equal(v.totalAnswers, 0, 'nessuno di questi tempi misura la velocità');
  const buono = updateStats(s, 'y', true, 5000);
  assert.equal(buono.speedStats!.totalAnswers, 1);
});

test('updateStats: statistiche rovinate nello stato non producono NaN', () => {
  const stato = statoVuoto({ stats: { q1: { correct: NaN, incorrect: 'x', lastSeen: null, box: undefined, easiness: NaN, interval: -9 } } as unknown as UserStats, speedStats: { minTimeMs: NaN, maxTimeMs: NaN, avgTimeMs: NaN, totalAnswers: NaN } });
  const s = updateStats(stato, 'q1', true, 4000);
  const q = s.stats.q1;
  for (const k of ['correct', 'incorrect', 'box', 'easiness', 'interval', 'lastSeen'] as const) assert.ok(Number.isFinite(q[k] as number), k);
  assert.ok(Number.isFinite(s.speedStats!.speedFactor!) && Number.isFinite(s.speedStats!.avgTimeMs));
});

test('updateStats: la risposta omessa conta in omitted, non tra gli errori, e riporta la domanda a domani', () => {
  const s = updateStats(statoVuoto(), 'q', false, 20000, 1, 'high', undefined, undefined, true);
  assert.equal(s.stats.q.omitted, 1);
  assert.equal(s.stats.q.incorrect, 0);
  assert.equal(s.stats.q.correct, 0);
  assert.equal(s.stats.q.lastQuality, QUALITY_OMITTED);
  assert.equal(s.stats.q.interval, 1);
});

test('updateStats: sbagliata e poi rifatta giusta nella stessa sessione non è imparata e la penalità si applica una volta sola', () => {
  const dopoErrore = updateStats(statoVuoto(), 'q', false, 5000);
  const riprova = updateStats(dopoErrore, 'q', true, 4000, 2);
  assert.equal(riprova.stats.q.box, 0);
  assert.equal(isLearned(riprova.stats.q), false);
  assert.equal(riprova.stats.q.easiness, dopoErrore.stats.q.easiness, 'la riprova non toglie altra facilità');
  assert.equal(riprova.stats.q.incorrect, 1);
  assert.equal(riprova.stats.q.correct, 0);
  assert.deepEqual(riprova.dailyActivity, dopoErrore.dailyActivity, 'la riprova non conta come un\'altra domanda del giorno');
});

test('updateStats: l\'attività del giorno usa il giorno locale, non quello UTC', () => {
  process.env.TZ = 'Europe/Rome';
  const mezzanotteEMezza = new Date(2026, 9, 11, 0, 30).getTime(); // 11 ottobre 00:30 a Roma = 10 ottobre in UTC
  const s = updateStats(statoVuoto(), 'q', true, 3000, 1, 'high', undefined, undefined, false, mezzanotteEMezza);
  assert.deepEqual(Object.keys(s.dailyActivity!), ['2026-10-11']);
  assert.equal(chiaveGiorno(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
});

test('updateStats: tentativi non validi non cambiano lo stato', () => {
  const s = statoVuoto();
  assert.equal(updateStats(s, 'q', true, 3000, NaN), s);
});

// ---- domande imparate

test('isLearned: serve la seconda risposta esatta di fila; una sola (o a caso) vale "in corso"', () => {
  assert.equal(isLearned(undefined), false);
  assert.equal(isLearned(null), false);
  assert.equal(isLearned({ box: 0, correct: 0, incorrect: 3, lastSeen: 1 }), false);
  assert.equal(isLearned({ box: 1, correct: 1, incorrect: 0, lastSeen: 1 }), false);
  assert.equal(isInProgress({ box: 1, correct: 1, incorrect: 0, lastSeen: 1 }), true);
  assert.equal(isLearned({ box: 2, correct: 2, incorrect: 0, lastSeen: 1 }), true);
  assert.equal(isLearned({ box: 7, correct: 9, incorrect: 1, lastSeen: 1 }), true);
  assert.equal(isLearned({ box: NaN as unknown as number, correct: 3, incorrect: 0, lastSeen: 1 }), false);
  assert.equal(isLearned({ box: 2, correct: 0, incorrect: 0, lastSeen: 1 }), false, 'dati incoerenti');
});

test('una sola risposta esatta, o due nello stesso giorno, non bastano; due in giorni diversi sì; un errore azzera', () => {
  const t0 = ADESSO;
  let s = updateStats(statoVuoto(), 'q', true, 3000, 1, 'high', undefined, undefined, false, t0);
  assert.equal(isLearned(s.stats.q), false);
  assert.equal(isInProgress(s.stats.q), true);
  s = updateStats(s, 'q', true, 3000, 1, 'high', undefined, undefined, false, t0 + 2 * 60 * 60 * 1000);
  assert.equal(isLearned(s.stats.q), false, 'due ore dopo non è un ripasso');
  s = updateStats(s, 'q', true, 3000, 1, 'high', undefined, undefined, false, t0 + 2 * GIORNO);
  assert.equal(isLearned(s.stats.q), true);
  s = updateStats(s, 'q', false, 3000, 1, 'high', undefined, undefined, false, t0 + 9 * GIORNO);
  assert.equal(isLearned(s.stats.q), false);
});

test('countLearned conta solo gli id del gruppo e ignora quelli senza statistiche', () => {
  const stats = { a: { box: 3, correct: 3, incorrect: 0, lastSeen: 1 }, b: { box: 1, correct: 1, incorrect: 0, lastSeen: 1 }, c: { box: 2, correct: 2, incorrect: 0, lastSeen: 1 } } as UserStats;
  assert.equal(countLearned(stats, ['a', 'b', 'zzz']), 1);
  assert.equal(countLearned(stats, new Set(['a', 'c'])), 2);
  assert.equal(countLearned(undefined, ['a']), 0);
});

// ---- scelta delle domande

function statsConScadute(scadute: string[], viste: string[] = []): UserStats {
  const out: UserStats = {};
  for (const id of scadute) out[id] = { correct: 2, incorrect: 0, lastSeen: ADESSO - 10 * GIORNO, box: 2, easiness: 2.5, interval: 6 };
  for (const id of viste) out[id] = { correct: 2, incorrect: 0, lastSeen: ADESSO - 1000, box: 2, easiness: 2.5, interval: 6 };
  return out;
}

test('selezione: 20 scadute e 80 nuove su 10 posti = 7 scadute e 3 nuove (le nuove non muoiono di fame)', () => {
  const scadute = nucleoIds.slice(0, 20);
  const ids = selectPracticeIds(statsConScadute(scadute), { numQuestions: 10, now: ADESSO });
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  assert.equal(ids.filter(id => scadute.includes(id)).length, 7);
  assert.equal(ids.filter(id => !scadute.includes(id)).length, 3);
  assert.deepEqual(ids.slice(0, 7).every(id => scadute.includes(id)), true, 'prima le scadute');
});

test('selezione: simulazione di 30 sessioni, ogni sessione porta almeno 3 domande nuove finché ce ne sono', () => {
  let stats: UserStats = {};
  let nuove = nucleoIds.length;
  for (let sessione = 0; sessione < 40 && nuove > 0; sessione++) {
    const ids = selectPracticeIds(stats, { numQuestions: 10, now: ADESSO });
    const nuoveScelte = ids.filter(id => !stats[id]).length;
    assert.ok(nuoveScelte >= Math.min(3, nuove), `sessione ${sessione}: ${nuoveScelte} nuove su ${nuove}`);
    for (const id of ids) stats[id] = { correct: 1, incorrect: 0, lastSeen: ADESSO - 30 * GIORNO, box: 1, easiness: 2.5, interval: 1 };
    nuove -= nuoveScelte;
  }
  assert.equal(nuove, 0, 'prima o poi le nuove sono tutte viste');
});

test('selezione: poche scadute (5) e tante nuove = 5 scadute + 5 nuove; tutte nuove = 10 nuove; tutte scadute = 10 scadute', () => {
  const cinque = nucleoIds.slice(0, 5);
  let ids = selectPracticeIds(statsConScadute(cinque), { now: ADESSO });
  assert.equal(ids.filter(id => cinque.includes(id)).length, 5);
  assert.equal(selectPracticeIds({}, { now: ADESSO }).length, 10);
  ids = selectPracticeIds(statsConScadute(nucleoIds), { now: ADESSO });
  assert.equal(ids.length, 10);
});

test('selezione: senza nuove né scadute si riempie con le non ancora scadute (più vicine alla scadenza e più difficili prima)', () => {
  const stats = statsConScadute([], nucleoIds);
  const ids = selectPracticeIds(stats, { numQuestions: 10, now: ADESSO });
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  // una domanda difficile (facilità 1,3, tre errori) non ancora scaduta passa avanti
  stats[nucleoIds[50]] = { correct: 1, incorrect: 3, lastSeen: ADESSO - 1000, box: 0, easiness: 1.3, interval: 1 };
  for (let i = 0; i < 5; i++) assert.ok(selectPracticeIds(stats, { numQuestions: 3, now: ADESSO }).includes(nucleoIds[50]));
});

test('selezione: 3 scadute, nessuna nuova = 3 scadute + 7 non scadute', () => {
  const tre = nucleoIds.slice(0, 3);
  const ids = selectPracticeIds(statsConScadute(tre, nucleoIds.slice(3)), { now: ADESSO });
  assert.equal(ids.filter(id => tre.includes(id)).length, 3);
  assert.equal(ids.length, 10);
});

test('selezione: data nel futuro (orologio spostato) non nasconde la domanda e non rompe l\'ordine', () => {
  const stats = statsConScadute([], nucleoIds);
  stats[nucleoIds[0]] = { correct: 1, incorrect: 0, lastSeen: ADESSO + 400 * GIORNO, box: 1, easiness: 2.5, interval: 1 };
  const ids = selectPracticeIds(stats, { numQuestions: 100, now: ADESSO });
  assert.equal(ids.length, nucleoIds.length);
  assert.ok(ids.includes(nucleoIds[0]));
});

test('selezione: numero di domande 0, NaN o oltre il pool; solo domande del nucleo senza Pass', () => {
  assert.deepEqual(selectPracticeIds({}, { numQuestions: 0 }), []);
  assert.equal(selectPracticeIds({}, { numQuestions: NaN }).length, 10);
  assert.equal(selectPracticeIds({}, { numQuestions: 100000 }).length, nucleoIds.length);
  const set = new Set(nucleoIds);
  assert.ok(selectPracticeIds({}, { numQuestions: 100000 }).every(id => set.has(id)));
  assert.ok(selectPracticeIds({}, { numQuestions: 100000, pass: true }).length > nucleoIds.length);
});

test('selezione: statistiche rovinate o di id che non esistono più non rompono nulla', () => {
  const stats = { [nucleoIds[0]]: null, [nucleoIds[1]]: { box: 'x', lastSeen: 'ieri' }, fantasma: { correct: 5, incorrect: 0, lastSeen: 1, box: 3 } } as unknown as UserStats;
  for (const mode of ['standard', 'smart', 'weakness', 'blitz', 'recall'] as const) {
    const ids = selectPracticeIds(stats, { mode, now: ADESSO });
    assert.equal(ids.length, 10, mode);
    assert.ok(!ids.includes('fantasma'));
  }
  assert.deepEqual(getQuestionStats(undefined, 'a'), getQuestionStats({}, 'a'));
});

test('selezione: il modo "weakness" mette per prime le domande con più errori e minore facilità', () => {
  const stats: UserStats = {};
  nucleoIds.slice(0, 5).forEach((id, i) => { stats[id] = { correct: 1, incorrect: 5 - i, lastSeen: ADESSO, box: 0, easiness: 1.3 + i * 0.1, interval: 1 }; });
  const ids = selectPracticeIds(stats, { mode: 'weakness', numQuestions: 5, now: ADESSO });
  assert.deepEqual(ids, nucleoIds.slice(0, 5));
});

test('selezione: il modo "category" filtra per livello, il modo "smart" rispetta le stesse quote', () => {
  const ids = selectPracticeIds({}, { mode: 'category', category: 'level:A1', numQuestions: 8 });
  const a1 = new Set(poolMeta(false).filter(m => m.level === 'A1').map(m => m.id));
  assert.ok(ids.length === 8 && ids.every(id => a1.has(id)));
  const scadute = nucleoIds.slice(0, 20);
  const smart = selectPracticeIds(statsConScadute(scadute), { mode: 'smart', numQuestions: 10, now: ADESSO });
  assert.equal(smart.filter(id => !scadute.includes(id)).length, 3);
});
