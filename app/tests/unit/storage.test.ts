// Caso 7: salvataggio, serie di giorni, stato rovinato, copia per il cloud, guarantee.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadState, normalizeState, saveState, toCloudState, updateStreak } from '../../src/lib/storage';
import { computeGuaranteeProgress } from '../../src/lib/guarantee';
import { statoVuoto, simulazione, GIORNO } from './aiuti';
import type { AppState } from '../../src/types';

// localStorage finto: una mappa, oppure uno che lancia (finestra privata, dati bloccati)
function conStorage<T>(contenuto: Record<string, string> | 'lancia', f: (mappa: Record<string, string>) => T): T {
  const mappa = contenuto === 'lancia' ? {} : contenuto;
  const finto = contenuto === 'lancia'
    ? { getItem() { throw new Error('bloccato'); }, setItem() { throw new Error('bloccato'); } }
    : { getItem: (k: string) => (k in mappa ? mappa[k] : null), setItem: (k: string, v: string) => { mappa[k] = v; } };
  const originale = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { value: finto, configurable: true });
  const log = console.error;
  console.error = () => {};
  try { return f(mappa); } finally {
    console.error = log;
    if (originale) Object.defineProperty(globalThis, 'localStorage', originale); else delete (globalThis as { localStorage?: unknown }).localStorage;
  }
}
const CHIAVE = 'ofa_polimi_app_state';

test('loadState: stato mai salvato = stato vuoto nuovo ogni volta (non un oggetto condiviso)', () => {
  conStorage({}, () => {
    const a = loadState(), b = loadState();
    assert.deepEqual(a.history, []);
    a.stats.x = { correct: 1, incorrect: 0, lastSeen: 1, box: 1 };
    a.examCategoryStats!.Grammatica = { correct: 1, total: 1 };
    assert.deepEqual(b.stats, {}, 'modificare uno stato non cambia gli altri');
    assert.deepEqual(loadState().examCategoryStats, {});
  });
});

test('loadState: JSON rovinato o di forma sbagliata dà sempre uno stato utilizzabile', () => {
  for (const grezzo of ['null', '[]', '"testo"', '42', '{', '{"streak":"x"}', '{"history":"no","stats":3}', '{"history":[null,{"date":"ieri"},{"date":5}],"stats":{"a":null,"b":{"box":1}}}']) {
    conStorage({ [CHIAVE]: grezzo }, () => {
      const s = loadState();
      assert.ok(Array.isArray(s.history), grezzo);
      assert.ok(typeof s.stats === 'object' && s.stats !== null && !Array.isArray(s.stats), grezzo);
      assert.ok(Number.isFinite(s.streak), grezzo);
    });
  }
  conStorage({ [CHIAVE]: '{"history":[null,{"date":"ieri"},{"date":5}],"stats":{"a":null,"b":{"box":1}}}' }, () => {
    const s = loadState();
    assert.deepEqual(s.history.map(h => h.date), [5]);
    assert.deepEqual(Object.keys(s.stats), ['b']);
  });
});

test('loadState e saveState con localStorage che lancia: nessun errore', () => {
  conStorage('lancia', () => {
    assert.deepEqual(loadState().history, []);
    saveState(statoVuoto());
  });
});

test('salvare e ricaricare conserva i progressi', () => {
  conStorage({}, () => {
    const stato = statoVuoto({ streak: 4, stats: { q: { correct: 2, incorrect: 1, lastSeen: 9, box: 2, easiness: 2.2, interval: 6 } }, history: [simulazione({ esatte: 25 })] });
    saveState(stato);
    const letto = loadState();
    assert.equal(letto.streak, 4);
    assert.deepEqual(letto.stats.q, stato.stats.q);
    assert.equal(letto.history.length, 1);
  });
});

test('normalizeState non butta i dati buoni e non inventa quelli mancanti', () => {
  const n = normalizeState({ streak: 3.9, lastActiveDate: 5, onboarding: { completedAt: 1 }, selectedCorpus: 'initial', dailyActivity: { '2026-01-01': 4 } });
  assert.equal(n.streak, 3);
  assert.equal(n.lastActiveDate, 5);
  assert.equal(n.selectedCorpus, 'initial');
  assert.deepEqual(n.dailyActivity, { '2026-01-01': 4 });
  assert.equal(normalizeState(null).streak, 0);
});

test('serie di giorni: primo giorno, giorno dopo, stesso giorno, salto', () => {
  const adesso = Date.now();
  assert.equal(updateStreak(statoVuoto()).streak, 1);
  assert.equal(updateStreak(statoVuoto({ streak: 3, lastActiveDate: adesso - GIORNO })).streak, 4);
  assert.equal(updateStreak(statoVuoto({ streak: 3, lastActiveDate: adesso })).streak, 3);
  assert.equal(updateStreak(statoVuoto({ streak: 9, lastActiveDate: adesso - 3 * GIORNO })).streak, 1);
});

test('serie di giorni: valori rovinati, data nel futuro, serie a 0 con data di oggi', () => {
  const adesso = Date.now();
  assert.equal(updateStreak({ ...statoVuoto(), streak: NaN, lastActiveDate: adesso - GIORNO } as AppState).streak, 1);
  assert.equal(updateStreak({ ...statoVuoto(), streak: undefined, lastActiveDate: null } as unknown as AppState).streak, 1);
  assert.equal(updateStreak(statoVuoto({ streak: 5, lastActiveDate: adesso + 10 * GIORNO })).streak, 5, 'orologio avanti: la serie non si perde');
  assert.equal(updateStreak(statoVuoto({ streak: 0, lastActiveDate: adesso })).streak, 1, 'attivo oggi = almeno 1');
  assert.equal(updateStreak(statoVuoto({ streak: 2, lastActiveDate: NaN })).streak, 1);
});

test('toCloudState: nessun campo undefined (Firestore li rifiuta) e i log pesanti restano solo in locale', () => {
  const stato = statoVuoto({
    stats: { q: { correct: 1, incorrect: 0, lastSeen: 3, box: 1, lastTrajectory: undefined, lastFirstClickTimeMs: undefined } },
    onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'no', diagnosticCorrect: undefined },
    projectLink: undefined,
    history: Array.from({ length: 60 }, (_, i) => simulazione({ id: `s${i}`, date: i + 1, esatte: 20 })),
  });
  const cloud = toCloudState(stato);
  const cerca = (v: unknown, percorso: string): void => {
    if (v === undefined) assert.fail(`undefined in ${percorso}`);
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) cerca(x, `${percorso}.${k}`);
  };
  cerca(cloud, 'stato');
  assert.ok('stats' in cloud && !('lastTrajectory' in cloud.stats.q));
  assert.equal(cloud.history[0].questionLogs, undefined, 'le più vecchie senza log');
  assert.ok(cloud.history[59].questionLogs!.length === 30);
  assert.equal(stato.history[0].questionLogs!.length, 30, 'lo stato locale non cambia');
});

test('guarantee: il TENG non conta come simulazione superata (punteggio con penalità, soglia diversa)', () => {
  const stato = statoVuoto({ history: [
    simulazione({ id: 'a', date: 1, esatte: 26 }),
    simulazione({ id: 'b', date: 2, esatte: 27, format: 'teng' }),
    simulazione({ id: 'c', date: 3, esatte: 25 }),
  ] });
  const g = computeGuaranteeProgress(stato);
  assert.equal(g.passedSimulations, 2);
});
