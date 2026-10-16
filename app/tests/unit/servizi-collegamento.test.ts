// Stato del collegamento Project ID / NOI (Esplora non esiste più).
import test from 'node:test';
import assert from 'node:assert/strict';
import { statoCollegamento, statoNoi, valoriNoi, type IngressiCollegamento } from '../../src/lib/servizi/collegamento';
import { questions } from '../../src/data/questions';
import { statoVuoto, simulazione } from './aiuti';

const base: IngressiCollegamento = { demo: false, flagProjectId: true, flagClassifica: true, atlasOnline: true };

test('collegamento: demo, interruttore e servizio spengono in quest\'ordine', () => {
  assert.equal(statoCollegamento({ ...base, demo: true, flagProjectId: false }).motivo, 'demo');
  assert.equal(statoCollegamento({ ...base, flagProjectId: false, atlasOnline: false }).motivo, 'flag');
  assert.equal(statoCollegamento({ ...base, atlasOnline: false }).motivo, 'atlas');
  const ok = statoCollegamento(base);
  assert.equal(ok.attivo, true);
  assert.equal(ok.motivo, null);
  assert.equal(ok.collegato, false);
});

test('collegamento: permessi dati dall\'utente', () => {
  assert.equal(statoCollegamento({ ...base, permessi: ['profile'] }).collegato, true);
  assert.equal(statoCollegamento({ ...base, permessi: ['profile'] }).inClassifica, false);
  assert.equal(statoCollegamento({ ...base, permessi: ['profile', 'noi.leaderboard'] }).inClassifica, true);
});

test('NOI: ogni stato spento ha il suo e l\'adesione richiede collegamento e permesso', () => {
  assert.equal(statoNoi({ ...base, demo: true }), 'demo');
  assert.equal(statoNoi({ ...base, flagProjectId: false }), 'project-id-spento');
  assert.equal(statoNoi({ ...base, flagClassifica: false }), 'classifica-spenta');
  assert.equal(statoNoi({ ...base, atlasOnline: false }), 'atlas');
  assert.equal(statoNoi(base), 'da-collegare');
  assert.equal(statoNoi({ ...base, permessi: ['profile'] }), 'da-aderire');
  assert.equal(statoNoi({ ...base, permessi: ['profile', 'noi.leaderboard'] }), 'aderito');
});

test('valori NOI locali: 0 senza dati; miglior punteggio = massimo tra le simulazioni', () => {
  assert.deepEqual(valoriNoi(statoVuoto()), { imparate: 0, migliorSimulazione: 0 });
  const q = questions[0].id;
  const s = statoVuoto({
    stats: { [q]: { correct: 3, incorrect: 0, lastSeen: 1, box: 2 } },
    history: [simulazione({ date: 1, esatte: 18 }), simulazione({ date: 2, esatte: 26 }), simulazione({ date: 3, esatte: 21 })],
  });
  assert.deepEqual(valoriNoi(s), { imparate: 1, migliorSimulazione: 26 });
});
