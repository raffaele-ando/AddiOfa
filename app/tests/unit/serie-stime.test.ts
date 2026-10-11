// serieStime (home/stima.ts): i punti misurati del grafico "Come cambia la tua probabilità".
import test from 'node:test';
import assert from 'node:assert/strict';
import { calcolaStima, serieStime } from '../../src/components/home/stima';
import { estimatePassProbability as e } from '../../src/lib/diagnostic';
import { statoVuoto, simulazione } from './aiuti';

const diag = (dc: number, dt = 10) => ({ completedAt: 1, hasCertification: false, hasOfa: 'unknown' as const, diagnosticCorrect: dc, diagnosticTotal: dt });
const vicino = (a: number, b: number) => Math.abs(a - b) < 1e-9;

test('senza diagnostico né simulazioni: nessun punto (niente punti inventati)', () => {
  assert.deepEqual(serieStime(statoVuoto()), []);
});

test('solo diagnostico: un punto, uguale alla stima', () => {
  const st = statoVuoto({ onboarding: diag(8) });
  const s = serieStime(st);
  assert.equal(s.length, 1);
  assert.equal(s[0].nome, 'Diagnostico');
  assert.ok(vicino(s[0].p, e(8, 10)));
  assert.ok(vicino(s[0].p, calcolaStima(st)!.p));
});

test('diagnostico e due simulazioni: ogni punto usa la regola della stima di quel momento', () => {
  const st = statoVuoto({ onboarding: diag(8), history: [simulazione({ id: 'a', date: 10, esatte: 24 }), simulazione({ id: 'b', date: 20, esatte: 27 })] });
  const s = serieStime(st);
  assert.deepEqual(s.map(x => x.nome), ['Diagnostico', 'Dopo sim. 1', 'Dopo sim. 2']);
  assert.ok(vicino(s[0].p, e(8, 10)));
  assert.ok(vicino(s[1].p, e(8 + 24, 10 + 30)), 'con una sola simulazione il diagnostico entra ancora');
  assert.ok(vicino(s[2].p, e(24 + 27, 60)), 'con due simulazioni il diagnostico esce');
});

test("l'ultimo punto coincide sempre con la stima mostrata (anche con più di 3 simulazioni e finestra mobile)", () => {
  const esatte = [20, 22, 25, 27, 28, 26, 29];
  const history = esatte.map((n, i) => simulazione({ id: `s${i}`, date: 100 + i, esatte: n }));
  for (let k = 0; k <= history.length; k++) {
    for (const conDiag of [true, false]) {
      const st = statoVuoto({ history: history.slice(0, k), onboarding: conDiag ? diag(7) : undefined });
      const s = serieStime(st, 99);
      const stima = calcolaStima(st);
      if (!stima) { assert.equal(s.length, 0); continue; }
      assert.ok(vicino(s[s.length - 1].p, stima.p), `k=${k} diag=${conDiag}`);
      assert.equal(s.length, k + (conDiag ? 1 : 0));
    }
  }
});

test('finestra mobile: la quarta simulazione guarda solo le ultime tre', () => {
  const sims = [18, 22, 26, 28].map((n, i) => simulazione({ id: `s${i}`, date: 100 + i, esatte: n }));
  const s = serieStime(statoVuoto({ history: sims, onboarding: diag(5) }), 99);
  assert.ok(vicino(s[4].p, e(22 + 26 + 28, 90)));
});

test('ultimi 5 punti, con la numerazione assoluta delle simulazioni', () => {
  const sims = [20, 21, 22, 23, 24, 25, 26].map((n, i) => simulazione({ id: `s${i}`, date: 100 + i, esatte: n }));
  const s = serieStime(statoVuoto({ history: sims, onboarding: diag(6) }));
  assert.equal(s.length, 5);
  assert.deepEqual(s.map(x => x.nome), ['Dopo sim. 3', 'Dopo sim. 4', 'Dopo sim. 5', 'Dopo sim. 6', 'Dopo sim. 7']);
});

test('ordine per data (non per ordine di salvataggio), duplicati e simulazioni senza risposte non fanno punti', () => {
  const a = simulazione({ id: 'a', date: 30, esatte: 28 });
  const b = simulazione({ id: 'b', date: 10, esatte: 20 });
  const vuota = simulazione({ id: 'v', date: 20, esatte: 0, sbagliate: 0 }); // tutte omesse
  const doppia = { ...a };
  const s = serieStime(statoVuoto({ history: [a, vuota, b, doppia] }), 99);
  assert.equal(s.length, 2);
  assert.ok(vicino(s[0].p, e(20, 30)));
  assert.ok(vicino(s[1].p, e(48, 60)));
});

test('solo la percentuale salvata (vecchio salvataggio): un punto uguale alla stima', () => {
  const st = statoVuoto({ onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'no', passProbability: 0.36 } });
  const s = serieStime(st);
  assert.equal(s.length, 1);
  assert.equal(s[0].p, 0.36);
});

test('dati rovinati: nessun errore e nessun NaN', () => {
  const st = statoVuoto({ history: [{ id: 'x', date: NaN, score: NaN, passed: false, timeSpentSeconds: 0 } as never, null as never], onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'no', diagnosticCorrect: NaN, diagnosticTotal: NaN } });
  assert.deepEqual(serieStime(st), []);
});
