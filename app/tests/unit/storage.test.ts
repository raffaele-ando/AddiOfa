// Caso 7: salvataggio, serie di giorni, stato rovinato, salvataggi di versioni precedenti.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadState, normalizeState, saveState, updateStreak } from '../../src/lib/storage';
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

test('normalizeState: i salvataggi delle versioni precedenti perdono ciò che non esiste più (formato TENG, nucleo, Project ID)', () => {
  const vecchio = {
    stats: {}, streak: 2, lastActiveDate: 5,
    selectedCorpus: 'initial',
    projectLink: { scopes: ['profile'], consentVersion: 'x', grantedAt: 1, updatedAt: 1 },
    history: [
      { id: 'a', date: 1, score: 26, passed: true, timeSpentSeconds: 100, format: 'ente' },
      { id: 'b', date: 2, score: 22.5, passed: true, timeSpentSeconds: 100, format: 'teng' },
      { id: 'c', date: 3, score: 20, passed: false, timeSpentSeconds: 100 },
    ],
  };
  const s = normalizeState(vecchio) as unknown as Record<string, unknown>;
  assert.equal('selectedCorpus' in s, false);
  assert.equal('projectLink' in s, false);
  const h = s.history as { id: string }[];
  assert.deepEqual(h.map(x => x.id), ['a', 'c'], 'la simulazione TENG non si conta');
  assert.ok(h.every(x => !('format' in x)));
  assert.equal(s.streak, 2);
});
