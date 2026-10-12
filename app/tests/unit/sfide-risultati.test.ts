// Storico, rivali e classifica delle sfide: tutto dai duelli veri, niente numeri inventati.
import test from 'node:test';
import assert from 'node:assert/strict';
import { confronta, aggiungiVoce, agganciaRisposta, ricavaRivali, duelliInAttesa, costruisciClassifica, tempoBreve, idVoce, MAX_VOCI, type VoceSfida } from '../../src/lib/sfide/risultati';

function duello(seme: string, quando: number, io: [number, number], altro?: { id: string; nome: string; v: [number, number] }): VoceSfida {
  return {
    id: idVoce('duello', seme, 'sfidante'), tipo: 'duello', ruolo: 'sfidante', seme, quando, nome: 'Io',
    corrette: io[0], totale: 10, secondi: io[1], ids: [], risposte: [],
    ...(altro ? { avversario: { id: altro.id, nome: altro.nome, corrette: altro.v[0], totale: 10, secondi: altro.v[1] } } : {}),
  };
}

test('confronta: più corrette vince, a parità meno tempo, poi pari', () => {
  const r = (corrette: number, secondi: number) => ({ corrette, totale: 10, secondi });
  assert.equal(confronta(r(8, 300), r(7, 10)), 'vinto');
  assert.equal(confronta(r(6, 10), r(7, 300)), 'perso');
  assert.equal(confronta(r(7, 100), r(7, 120)), 'vinto');
  assert.equal(confronta(r(7, 130), r(7, 120)), 'perso');
  assert.equal(confronta(r(7, 120), r(7, 120)), 'pari');
});

test('tempoBreve', () => {
  assert.equal(tempoBreve(0), '0:00');
  assert.equal(tempoBreve(187), '3:07');
  assert.equal(tempoBreve(300), '5:00');
  assert.equal(tempoBreve(-4), '0:00');
});

test('aggiungiVoce: sostituisce la stessa sfida, ordina per data, taglia a MAX_VOCI', () => {
  let voci: VoceSfida[] = [];
  voci = aggiungiVoce(voci, duello('a', 1, [5, 100]));
  voci = aggiungiVoce(voci, duello('b', 2, [6, 100]));
  voci = aggiungiVoce(voci, duello('a', 3, [9, 50]));
  assert.deepEqual(voci.map(v => [v.seme, v.corrette]), [['a', 9], ['b', 6]]);
  let tante: VoceSfida[] = [];
  for (let i = 0; i < MAX_VOCI + 20; i++) tante = aggiungiVoce(tante, duello(`s${i}`, i, [1, 1]));
  assert.equal(tante.length, MAX_VOCI);
  assert.equal(tante[0].seme, `s${MAX_VOCI + 19}`);
});

test('agganciaRisposta: attacca il risultato dell\'amico al duello con lo stesso seme; è idempotente; senza duello dice «non trovata»', () => {
  const voci = [duello('x1', 5, [7, 100]), duello('x2', 6, [4, 100])];
  const dati = { seme: 'x1', id: 'AMICO1', nome: 'Marta', corrette: 6, totale: 10, secondi: 90 };
  const a = agganciaRisposta(voci, dati);
  assert.equal(a.trovata, true);
  assert.equal(a.voci.find(v => v.seme === 'x1')?.avversario?.nome, 'Marta');
  assert.equal(a.voci.find(v => v.seme === 'x2')?.avversario, undefined);
  assert.deepEqual(agganciaRisposta(a.voci, dati).voci, a.voci);
  assert.equal(agganciaRisposta(voci, { ...dati, seme: 'altro' }).trovata, false);
  assert.equal(voci[0].avversario, undefined); // non muta l'originale
});

test('rivali: saldo visto da te, raggruppati per identificativo (due Marta diverse restano due persone)', () => {
  const voci = [
    duello('a', 10, [8, 100], { id: 'M1', nome: 'Marta', v: [6, 100] }),   // vinto
    duello('b', 20, [5, 100], { id: 'M1', nome: 'Marti', v: [7, 100] }),   // perso (nome cambiato: vale l'ultimo)
    duello('c', 30, [7, 100], { id: 'M1', nome: 'Marti', v: [7, 100] }),   // pari
    duello('d', 40, [3, 100], { id: 'M2', nome: 'Marta', v: [9, 100] }),   // perso con un'altra Marta
    duello('e', 50, [9, 100]),                                             // ancora in attesa
  ];
  const r = ricavaRivali(voci);
  assert.equal(r.length, 2);
  const m2 = r[0], m1 = r[1]; // la più recente per prima
  assert.equal(m2.id, 'M2');
  assert.deepEqual([m1.duelli, m1.vinti, m1.pari, m1.persi, m1.nome], [3, 1, 1, 1, 'Marti']);
  assert.deepEqual([m2.duelli, m2.vinti, m2.pari, m2.persi], [1, 0, 0, 1]);
  assert.deepEqual(duelliInAttesa(voci).map(v => v.seme), ['e']);
});

test('classifica: vuota senza duelli conclusi; con un rivale ci siete voi due; ordine per media e poi tempo', () => {
  assert.deepEqual(costruisciClassifica([], 'Io'), []);
  assert.deepEqual(costruisciClassifica([duello('e', 1, [9, 10])], 'Io'), []);
  const voci = [
    duello('a', 10, [8, 100], { id: 'M1', nome: 'Marta', v: [6, 100] }),
    duello('b', 20, [6, 100], { id: 'L1', nome: 'Luca', v: [9, 80] }),
    duello('c', 30, [7, 100], { id: 'L1', nome: 'Luca', v: [7, 80] }),
  ];
  const c = costruisciClassifica(voci, 'Raffaele');
  assert.deepEqual(c.map(r => r.nome), ['Luca', 'Raffaele', 'Marta']);
  assert.equal(c[0].percentuale, 80);   // (9+7)/2 su 10
  assert.equal(c[1].percentuale, 70);   // (8+6+7)/3 su 10
  assert.equal(c[1].duelli, 3);
  assert.equal(c[1].io, true);
  assert.equal(c[2].percentuale, 60);
  const solo = costruisciClassifica([voci[0]], 'Raffaele');
  assert.equal(solo.length, 2);
  assert.deepEqual(solo.map(r => r.nome), ['Raffaele', 'Marta']);
});

test('classifica: a parità di percentuale vince chi è più veloce', () => {
  const voci = [duello('a', 1, [7, 200], { id: 'X1', nome: 'Zeno', v: [7, 100] })];
  assert.deepEqual(costruisciClassifica(voci, 'Io').map(r => r.nome), ['Zeno', 'Io']);
});
