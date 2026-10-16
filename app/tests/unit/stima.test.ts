// Caso 2: stima con diagnostico + simulazioni (home/stima.ts): vuoto, solo uno dei due, omesse, scadute, duplicati, dati rovinati.
import test from 'node:test';
import assert from 'node:assert/strict';
import { calcolaStima, esitoSimulazione, ultimaSimulazione, calcolaFattori, ultimiGiorni } from '../../src/components/home/stima';
import { estimatePassProbability as e } from '../../src/lib/diagnostic';
import { statoVuoto, simulazione } from './aiuti';
import type { AppState } from '../../src/types';

const diag = (dc: number, dt = 10, extra = {}) => ({ completedAt: 1, hasCertification: false, hasOfa: 'unknown' as const, diagnosticCorrect: dc, diagnosticTotal: dt, ...extra });
const vicino = (a: number, b: number) => Math.abs(a - b) < 1e-9;

test('nessuna risposta: nessuna stima (mai la probabilità a priori)', () => {
  assert.equal(calcolaStima(statoVuoto()), null);
  assert.equal(calcolaStima(statoVuoto({ onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'no' } })), null);
  assert.equal(calcolaStima(statoVuoto({ onboarding: diag(0, 0) })), null, 'diagnostico da 0 domande');
});

test('solo diagnostico: stima dai conteggi e fonte "diagnostico"', () => {
  const s = calcolaStima(statoVuoto({ onboarding: diag(8) }))!;
  assert.equal(s.fonte, 'diagnostico');
  assert.equal(s.risposte, 10);
  assert.ok(vicino(s.p, e(8, 10)));
  assert.equal(s.delta, undefined);
  assert.ok(s.intervallo.probabilita.min <= s.p && s.p <= s.intervallo.probabilita.max);
});

test('la percentuale salvata con una soglia vecchia non vince sui conteggi', () => {
  // 8/10 con la soglia 24 dava 0,46: oggi, con 25, dà 0,36
  const s = calcolaStima(statoVuoto({ onboarding: diag(8, 10, { passProbability: 0.46 }) }))!;
  assert.ok(vicino(s.p, e(8, 10)));
  assert.ok(s.p < 0.4);
});

test('salvataggio vecchio con la sola percentuale: si usa quella e, con simulazioni, si risale ai conteggi', () => {
  const solo = calcolaStima(statoVuoto({ onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'no', passProbability: 0.36 } }))!;
  assert.equal(solo.fonte, 'diagnostico');
  assert.equal(solo.p, 0.36);
  const con = calcolaStima(statoVuoto({
    onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'no', passProbability: 0.36 },
    history: [simulazione({ date: 5, esatte: 25 })],
  }))!;
  // 0,36 corrisponde a 8/10: il diagnostico non vale più "0 su 10" come faceva il vecchio calcolo
  assert.equal(con.fonte, 'entrambi');
  assert.ok(vicino(con.p, e(8 + 25, 40)), String(con.p));
});

test('solo simulazioni: conteggio su tutte le domande', () => {
  const s = calcolaStima(statoVuoto({ history: [simulazione({ esatte: 25 })] }))!;
  assert.equal(s.fonte, 'simulazioni');
  assert.equal(s.risposte, 30);
  assert.ok(vicino(s.p, e(25, 30)));
});

test('diagnostico e una simulazione: si sommano, delta in punti rispetto al solo diagnostico', () => {
  const s = calcolaStima(statoVuoto({ onboarding: diag(8), history: [simulazione({ esatte: 27 })] }))!;
  assert.equal(s.fonte, 'entrambi');
  assert.equal(s.risposte, 40);
  assert.ok(vicino(s.p, e(35, 40)));
  assert.equal(s.delta, Math.round((e(35, 40) - e(8, 10)) * 100));
});

test('risposte omesse: contano come errori nella stima (al test vero valgono zero)', () => {
  const conOmesse = simulazione({ esatte: 20, sbagliate: 5 }); // 5 omesse
  const esito = esitoSimulazione(conOmesse);
  assert.deepEqual(esito, { esatte: 20, totale: 30, date: 25 });
  const s = calcolaStima(statoVuoto({ history: [conOmesse] }))!;
  assert.ok(vicino(s.p, e(20, 30)));
  // identica a 10 errate al posto delle omesse
  assert.ok(vicino(s.p, calcolaStima(statoVuoto({ history: [simulazione({ esatte: 20, sbagliate: 10 })] }))!.p));
});

test('simulazione lasciata scadere con 10 risposte su 30: conta (omesse = errori)', () => {
  const s = calcolaStima(statoVuoto({ history: [simulazione({ esatte: 9, sbagliate: 1 })] }))!;
  assert.equal(s.risposte, 30);
  assert.ok(vicino(s.p, e(9, 30)));
});

test('simulazione senza nemmeno una risposta (aperta e lasciata scadere): non misura nulla, si ignora', () => {
  const vuota = simulazione({ esatte: 0, sbagliate: 0 });
  assert.equal(calcolaStima(statoVuoto({ history: [vuota] })), null);
  const s = calcolaStima(statoVuoto({ onboarding: diag(9), history: [vuota] }))!;
  assert.equal(s.fonte, 'diagnostico');
  assert.ok(vicino(s.p, e(9, 10)));
});

test('la stessa simulazione due volte nello storico (stesso id) conta una volta', () => {
  const a = simulazione({ id: 'sim-x', date: 10, esatte: 24 });
  const s = calcolaStima(statoVuoto({ history: [a, { ...a }] }))!;
  assert.equal(s.risposte, 30);
  assert.ok(vicino(s.p, e(24, 30)));
});

test('la stessa domanda ripetuta nei log vale una volta sola', () => {
  const h = simulazione({ esatte: 25 });
  h.questionLogs = [...h.questionLogs!, h.questionLogs![0], h.questionLogs![1]]; // 32 log, 30 domande diverse
  assert.deepEqual(esitoSimulazione(h), { esatte: 25, totale: 30, date: 30 });
});

test('conta solo l\'ultima finestra di 3 simulazioni: chi migliora non resta ancorato ai risultati vecchi', () => {
  const storico = [
    simulazione({ id: 'a', date: 1, esatte: 10, prefisso: 'a' }),
    simulazione({ id: 'b', date: 2, esatte: 12, prefisso: 'b' }),
    simulazione({ id: 'c', date: 3, esatte: 27, prefisso: 'c' }),
    simulazione({ id: 'd', date: 4, esatte: 28, prefisso: 'd' }),
    simulazione({ id: 'e', date: 5, esatte: 28, prefisso: 'e' }),
  ];
  const s = calcolaStima(statoVuoto({ onboarding: diag(5), history: storico }))!;
  assert.equal(s.fonte, 'simulazioni', 'con 2 o più simulazioni il diagnostico esce');
  assert.equal(s.risposte, 90);
  assert.ok(vicino(s.p, e(83, 90)));
  assert.ok(s.p > 0.7);
  // l'ordine nello storico non conta: si ordina per data
  const s2 = calcolaStima(statoVuoto({ onboarding: diag(5), history: [...storico].reverse() }))!;
  assert.ok(vicino(s2.p, s.p));
});

test('simulazione senza log: il numero di esatte si ricava dal punteggio e dall\'esito', () => {
  const base = { id: 't', date: 3, timeSpentSeconds: 800, questionIds: undefined };
  // superata: almeno la soglia (25); non superata: meno della soglia, mai di più
  assert.equal(esitoSimulazione({ ...base, score: 27, passed: true }).esatte, 27);
  assert.equal(esitoSimulazione({ ...base, score: 20, passed: false }).esatte, 20);
  assert.equal(esitoSimulazione({ ...base, score: 29, passed: false }).esatte, 24, 'non superata: sotto la soglia');
  assert.equal(esitoSimulazione({ id: 'e', date: 1, score: 40, passed: true, timeSpentSeconds: 1 }).esatte, 30, 'mai oltre il totale');
});

test('storico rovinato: voci nulle, date non valide, punteggi NaN, storico mancante', () => {
  const rovinato = {
    ...statoVuoto(),
    history: [null, 'x', { id: 'z', date: NaN, score: 5 }, { id: 'y', date: 3, score: NaN, passed: false, timeSpentSeconds: 1 }, simulazione({ id: 'ok', date: 9, esatte: 26 })],
  } as unknown as AppState;
  const s = calcolaStima(rovinato)!;
  assert.ok(Number.isFinite(s.p) && s.p >= 0 && s.p <= 1);
  assert.equal(calcolaStima({} as AppState), null);
  assert.equal(calcolaStima({ history: 'no', stats: {} } as unknown as AppState), null);
  assert.equal(ultimaSimulazione({ history: undefined } as unknown as AppState), null);
});

test('ultimaSimulazione: usa la più recente per data e la soglia 25', () => {
  const stato = statoVuoto({ history: [simulazione({ id: 'a', date: 2, esatte: 20 }), simulazione({ id: 'b', date: 1, esatte: 29 })] });
  const u = ultimaSimulazione(stato)!;
  assert.equal(u.soglia, 25);
  assert.equal(u.esatte, 20);
  assert.equal(u.superata, false);
});

test('calcolaFattori: le omesse non sono errori di conoscenza e i numeri rovinati non rompono nulla', () => {
  const f = calcolaFattori({ ...statoVuoto(), stats: { x: null, y: { correct: NaN, incorrect: 3, lastSeen: 0, box: 0 } } } as unknown as AppState);
  assert.ok(f.livelli.every(l => l.percento === null || Number.isFinite(l.percento)));
  assert.equal(calcolaFattori({} as AppState).risposteTotali, 0);
});

test('ultimiGiorni: 7 giorni, chiave nel fuso locale e lettera dello stesso giorno', () => {
  process.env.TZ = 'Europe/Rome';
  const g = ultimiGiorni(statoVuoto());
  assert.equal(g.length, 7);
  const oggi = new Date();
  const locale = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).padStart(2, '0')}-${String(oggi.getDate()).padStart(2, '0')}`;
  assert.equal(g[6].data, locale);
  assert.equal(g[6].lettera, 'DLMMGVS'[oggi.getDay()]);
});
