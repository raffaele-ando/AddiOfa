// Caso 1: stima di superare il test (beta-binomiale, soglia 25/30), formattazione e intervallo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePassProbability as stima, formatProbabilita, formatIntervallo, formatPunteggio, intervalloStima, percentualeVisibile } from '../../src/lib/diagnostic';
import { livelloDi, SOGLIA_ALTO, SOGLIA_MEDIO } from '../../src/components/home/stima';
import { REAL_TEST_PASS_MARK } from '../../src/config/offer';

test('la soglia della stima è 25 su 30', () => {
  assert.equal(REAL_TEST_PASS_MARK, 25);
});

test('monotona: più risposte esatte, probabilità mai più bassa (totali da 1 a 80)', () => {
  for (let t = 1; t <= 80; t++) {
    let prima = -1;
    for (let c = 0; c <= t; c++) {
      const p = stima(c, t);
      assert.ok(p >= prima, `${c}/${t}: ${p} < ${prima}`);
      assert.ok(p >= 0 && p <= 1);
      prima = p;
    }
  }
});

test('valori di riferimento sul diagnostico da 10 domande (soglia 25/30)', () => {
  assert.ok(stima(0, 10) < 0.005, '0/10');
  assert.ok(stima(5, 10) > 0.01 && stima(5, 10) < 0.05, `5/10 = ${stima(5, 10)}`);
  assert.ok(stima(8, 10) > 0.30 && stima(8, 10) < 0.42, `8/10 = ${stima(8, 10)}`);
  assert.ok(stima(9, 10) > 0.55 && stima(9, 10) < 0.70, `9/10 = ${stima(9, 10)}`);
  assert.ok(stima(10, 10) > 0.80 && stima(10, 10) < 0.92, `10/10 = ${stima(10, 10)}`);
});

test('con molte risposte la stima segue l\'evidenza: 90 su 100 è più sicura di 9 su 10, 70 su 100 più bassa di 7 su 10', () => {
  assert.ok(stima(90, 100) > stima(9, 10));
  assert.ok(stima(70, 100) < stima(7, 10));
  assert.ok(stima(95, 100) > 0.97);
});

test('la soglia più alta (25 invece di 24) abbassa la probabilità', () => {
  for (const [c, t] of [[8, 10], [9, 10], [25, 30], [40, 50]]) assert.ok(stima(c, t) < stima(c, t, 30, 24));
});

test('nessuna risposta: probabilità a priori (6/31), senza errori', () => {
  assert.ok(Math.abs(stima(0, 0) - 6 / 31) < 1e-9);
});

test('ingressi strani non rompono il calcolo', () => {
  for (const [c, t] of [[NaN, 10], [5, NaN], [-3, 10], [15, 10], [3.7, 10.2], [Infinity, 10], [5, 1e9], [1e9, 1e9]]) {
    const p = stima(c, t);
    assert.ok(Number.isFinite(p) && p >= 0 && p <= 1, `${c}/${t} -> ${p}`);
  }
  assert.equal(stima(15, 10), stima(10, 10)); // esatte oltre il totale = tutte esatte
});

test('formatProbabilita: mai "0 %" né "100 %"', () => {
  assert.equal(formatProbabilita(0), '<1 %');
  assert.equal(formatProbabilita(0.004), '<1 %');
  assert.equal(formatProbabilita(0.005), '1 %');
  assert.equal(formatProbabilita(0.364), '36 %');
  assert.equal(formatProbabilita(0.994), '99 %');
  assert.equal(formatProbabilita(0.995), '>99 %');
  assert.equal(formatProbabilita(1), '>99 %');
  assert.equal(formatProbabilita(NaN), '–');
  assert.equal(formatProbabilita(stima(0, 10)), '<1 %'); // 0/10 prima si leggeva "0 %"
  assert.equal(formatProbabilita(stima(100, 100)), '>99 %'); // 100/100 prima si leggeva "100 %"
  assert.equal(formatProbabilita(stima(30, 30)), '99 %'); // 98,9 %: arrotondato a 99, non a ">99"
});

test('percentualeVisibile: intero da 1 a 99 per i grafici', () => {
  assert.equal(percentualeVisibile(0), 1);
  assert.equal(percentualeVisibile(1), 99);
  assert.equal(percentualeVisibile(0.5), 50);
  assert.equal(percentualeVisibile(NaN), 1);
});

// logaritmo del coefficiente della Beta per la verifica numerica della copertura
function copertura(a: number, b: number, lo: number, hi: number): number {
  const lf = (n: number) => { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; };
  const logB = lf(a - 1) + lf(b - 1) - lf(a + b - 1);
  const pdf = (x: number) => (x <= 0 || x >= 1 ? 0 : Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB));
  const passi = 20000, h = (hi - lo) / passi;
  let s = 0;
  for (let i = 0; i < passi; i++) s += pdf(lo + (i + 0.5) * h) * h;
  return s;
}

test('intervalloStima: copre davvero l\'80 % dell\'accuratezza e si stringe con più dati', () => {
  for (const [c, t] of [[8, 10], [3, 10], [10, 10], [0, 10], [24, 30]]) {
    const i = intervalloStima(c, t);
    const cop = copertura(c + 1, t - c + 1, i.accuratezza.min, i.accuratezza.max);
    assert.ok(Math.abs(cop - 0.8) < 0.01, `${c}/${t}: copertura ${cop}`);
  }
  const poche = intervalloStima(8, 10), molte = intervalloStima(80, 100);
  assert.ok(molte.accuratezza.max - molte.accuratezza.min < poche.accuratezza.max - poche.accuratezza.min);
});

test('intervalloStima: contiene sempre la stima centrale e sta tra 0 e 1', () => {
  for (let t = 0; t <= 40; t++) for (let c = 0; c <= t; c++) {
    const i = intervalloStima(c, t), p = stima(c, t);
    assert.ok(i.probabilita.min <= p + 1e-12 && p <= i.probabilita.max + 1e-12, `${c}/${t}`);
    assert.ok(i.probabilita.min >= 0 && i.probabilita.max <= 1);
    assert.ok(i.accuratezza.min <= i.accuratezza.max);
    assert.ok(i.punteggio.min <= i.punteggio.max && i.punteggio.max <= 30);
  }
});

test('intervalloStima 8/10: probabilità tra meno di 1 e circa 91 %, punteggio atteso tra 18 e 27 su 30', () => {
  const i = intervalloStima(8, 10);
  assert.equal(formatIntervallo(i), 'tra meno di 1 e 91 %');
  assert.equal(formatPunteggio(i), 'tra 18 e 27 su 30');
  assert.ok(i.probabilita.min < 0.05 && i.probabilita.max > 0.85, JSON.stringify(i));
});

test('formatIntervallo con tutto vicino a 0 o a 1', () => {
  assert.equal(formatIntervallo(intervalloStima(0, 40)), 'meno di 1 %');
  assert.equal(formatIntervallo(intervalloStima(300, 300)), 'più di 99 %');
});

test('formatIntervallo usa "meno di 1" e "più di 99" agli estremi', () => {
  assert.equal(formatIntervallo({ livello: 0.8, accuratezza: { min: 0, max: 1 }, probabilita: { min: 0, max: 1 }, punteggio: { min: 0, max: 30 } }), 'tra meno di 1 e più di 99 %');
  assert.equal(formatIntervallo({ livello: 0.8, accuratezza: { min: 0, max: 1 }, probabilita: { min: 0.12, max: 0.71 }, punteggio: { min: 0, max: 30 } }), 'tra 12 e 71 %');
});

test('fasce 40/70 con la soglia 25/30: valori attesi sul diagnostico e sulle simulazioni', () => {
  assert.equal(SOGLIA_MEDIO, 0.4);
  assert.equal(SOGLIA_ALTO, 0.7);
  const f = (c: number, t: number) => livelloDi(stima(c, t));
  assert.equal(f(7, 10), 'basso');
  assert.equal(f(8, 10), 'basso');
  assert.equal(f(9, 10), 'medio');
  assert.equal(f(10, 10), 'alto');
  assert.equal(f(25, 30), 'medio'); // sul filo della soglia
  assert.equal(f(26, 30), 'medio');
  assert.equal(f(27, 30), 'alto');
  assert.equal(f(28, 30), 'alto');
  assert.equal(livelloDi(0.4), 'medio');
  assert.equal(livelloDi(0.7), 'alto');
  assert.equal(livelloDi(NaN), 'basso');
});
