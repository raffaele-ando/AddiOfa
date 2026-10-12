// Numeri delle Statistiche (lib/studio/statistiche.ts): tessere, andamento (solo punti veri), padronanza per argomento, obiettivi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, isCoreId } from '../../src/data/questions';
import { tessereStatistiche, andamentoSimulazioni, formatTempoStudio, padronanzaArgomenti, leggiObiettivi } from '../../src/lib/studio/statistiche';
import { chiaveGiorno } from '../../src/lib/utils';
import { statoVuoto, simulazione, GIORNO } from './aiuti';

test('formatTempoStudio', () => {
  assert.equal(formatTempoStudio(0), '0 min');
  assert.equal(formatTempoStudio(20), 'Meno di 1 min');
  assert.equal(formatTempoStudio(600), '10 min');
  assert.equal(formatTempoStudio(4 * 3600 + 20 * 60), '4 h 20 min');
  assert.equal(formatTempoStudio(3600 + 5 * 60), '1 h 05 min');
  assert.equal(formatTempoStudio(-5), '0 min');
});

test('tessere: senza dati tutto a zero e nessuna media inventata', () => {
  const t = tessereStatistiche(statoVuoto());
  assert.deepEqual([t.risposte, t.secondiStudio, t.mediaSimulazioni, t.simulazioni], [0, 0, null, 0]);
});

test('tessere: risposte giuste e sbagliate (non le omesse), tempo di studio, media delle simulazioni', () => {
  const st = statoVuoto({
    stats: { a: { correct: 3, incorrect: 1, omitted: 5, lastSeen: 1, box: 0 }, b: { correct: 2, incorrect: 0, lastSeen: 1, box: 1 } },
    dailyTimeSpent: { '2026-10-10': 1800, '2026-10-11': 900 },
    history: [simulazione({ id: 'a', date: 1, esatte: 20 }), simulazione({ id: 'b', date: 2, esatte: 25 })],
  });
  const t = tessereStatistiche(st);
  assert.equal(t.risposte, 6);
  assert.equal(t.secondiStudio, 2700);
  assert.deepEqual(t.mediaSimulazioni, { esatte: 22.5, totale: 30, quante: 2 });
  assert.equal(t.simulazioni, 2);
});

test('andamento: solo simulazioni vere (con almeno una risposta), in ordine di data, ultime N', () => {
  const vuota = simulazione({ id: 'v', date: 5, esatte: 0, sbagliate: 0 }); // tutte omesse: non misura niente
  const h = [simulazione({ id: 'c', date: 30, esatte: 27 }), vuota, simulazione({ id: 'a', date: 10, esatte: 18 }), simulazione({ id: 'b', date: 20, esatte: 24 })];
  const a = andamentoSimulazioni(statoVuoto({ history: h }));
  assert.deepEqual(a.map(p => p.esatte), [18, 24, 27]);
  assert.deepEqual(a.map(p => p.numero), [1, 2, 3]);
  const molte = Array.from({ length: 15 }, (_, i) => simulazione({ id: `s${i}`, date: 100 + i, esatte: 10 + i }));
  assert.equal(andamentoSimulazioni(statoVuoto({ history: molte }), 10).length, 10);
  assert.equal(andamentoSimulazioni(statoVuoto({ history: molte }), 10)[9].esatte, 24);
  assert.deepEqual(andamentoSimulazioni(statoVuoto()), []);
});

test('padronanza per argomento: imparate su domande dell\'argomento, nucleo gratuito senza Pass', () => {
  const ps = questions.filter(q => q.theoryId === 'present-simple');
  const stats = Object.fromEntries(ps.slice(0, 7).map(q => [q.id, { correct: 3, incorrect: 1, lastSeen: 1, box: 2 }]));
  const pass = padronanzaArgomenti(statoVuoto({ stats }), true).find(r => r.id === 'present-simple')!;
  assert.equal(pass.totale, ps.length);
  assert.equal(pass.imparate, 7);
  assert.equal(pass.percento, Math.round((7 / ps.length) * 100));
  assert.equal(pass.risposte, 28);
  const core = ps.filter(q => isCoreId(q.id));
  const free = padronanzaArgomenti(statoVuoto({ stats: Object.fromEntries(core.map(q => [q.id, { correct: 2, incorrect: 0, lastSeen: 1, box: 2 }])) }), false).find(r => r.id === 'present-simple')!;
  assert.equal(free.totale, core.length);
  assert.equal(free.percento, 100);
  assert.equal(padronanzaArgomenti(statoVuoto(), true).length, 31);
  assert.ok(padronanzaArgomenti(statoVuoto(), true).every(r => r.percento === 0 && r.risposte === 0));
});

test('obiettivi: assenza o forma sconosciuta non rompono niente', () => {
  const st = statoVuoto();
  assert.deepEqual(leggiObiettivi(undefined, st), []);
  assert.deepEqual(leggiObiettivi({}, st), []);
  assert.deepEqual(leggiObiettivi({ obiettivi: null }, st), []);
  assert.deepEqual(leggiObiettivi({ obiettivi: 42 }, st), []);
  assert.deepEqual(leggiObiettivi({ obiettivi: { boh: true } }, st), []);
  assert.deepEqual(leggiObiettivi({ obiettivi: [null, 7, {}, []] }, st), []);
});

test('obiettivi: elenco di testi, di oggetti, oggetto con chiavi note (avanzamento dai progressi veri)', () => {
  const oggi = chiaveGiorno();
  const st = statoVuoto({
    history: [simulazione({ id: 'a', date: 10, esatte: 21 }), simulazione({ id: 'b', date: 20, esatte: 24 })],
    dailyTimeSpent: { [oggi]: 900 }, dailyActivity: { [oggi]: 12 },
  });
  assert.deepEqual(leggiObiettivi({ obiettivi: ['Superare il test'] }, st).map(o => o.titolo), ['Superare il test']);

  const punteggio = leggiObiettivi({ obiettivi: { punteggio: 30 } }, st)[0];
  assert.equal(punteggio.percento, 80);
  assert.match(punteggio.dettaglio!, /24 su 30/);
  const min = leggiObiettivi({ obiettivi: { minutiAlGiorno: 30 } }, st)[0];
  assert.equal(min.percento, 50);
  assert.match(min.dettaglio!, /15 min su 30/);
  const dom = leggiObiettivi({ obiettivi: [{ tipo: 'domande', target: 24 }] }, st)[0];
  assert.equal(dom.percento, 50);

  const ora = Date.parse('2026-10-12T10:00:00');
  const data = leggiObiettivi({ obiettivi: { dataTest: new Date(ora + 10 * GIORNO).toISOString() } }, st, ora)[0];
  assert.match(data.dettaglio!, /Mancano (10|11) giorni/);
  assert.equal(data.percento, undefined, 'nessuna barra senza un avanzamento misurabile');

  const lista = leggiObiettivi({ obiettivi: { lista: [{ titolo: 'Fare 3 simulazioni', target: 3, attuale: 2 }, 'Ripassare i condizionali'] } }, st);
  assert.deepEqual(lista.map(o => o.titolo), ['Fare 3 simulazioni', 'Ripassare i condizionali']);
  assert.equal(lista[0].percento, 67);
});

test('obiettivi: percentuale sempre tra 0 e 100, anche con target 0 o valori oltre l\'obiettivo', () => {
  const st = statoVuoto({ history: [simulazione({ id: 'a', date: 10, esatte: 29 })] });
  const o = leggiObiettivi({ obiettivi: { punteggio: 25 } }, st)[0];
  assert.equal(o.percento, 100);
  assert.deepEqual(leggiObiettivi({ obiettivi: { punteggio: 0 } }, st), []);
  assert.deepEqual(leggiObiettivi({ obiettivi: [{ titolo: 'x', target: 0, attuale: 5 }] }, st).map(o => o.percento), [undefined]);
});
