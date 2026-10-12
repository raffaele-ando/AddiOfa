// Segnalazioni: creazione, limiti, testo da copiare, lettura di dati rovinati.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  accorcia, aggiungi, creaSegnalazione, leggiSalvate, LUNGHEZZA_MAX, MASSIMO_SALVATE, pulisciTesto, rimuovi, testoDaCopiare, testoValido,
} from '../../src/lib/servizi/segnalazioni';

const T0 = Date.UTC(2026, 9, 12, 10, 0, 0);

test('testo: ripulito, tagliato, minimo cinque caratteri veri', () => {
  assert.equal(pulisciTesto('  la   risposta \t è  sbagliata  '), 'la risposta è sbagliata');
  assert.equal(pulisciTesto('x'.repeat(LUNGHEZZA_MAX + 50)).length, LUNGHEZZA_MAX);
  assert.equal(testoValido('    ab   '), false);
  assert.equal(testoValido('non va'), true);
});

test('accorcia: aggiunge i puntini solo se taglia', () => {
  assert.equal(accorcia('corto', 10), 'corto');
  assert.equal(accorcia('abcdefghij', 5), 'abcd…');
  assert.equal(accorcia('   ', 5), undefined);
  assert.equal(accorcia(undefined, 5), undefined);
});

test('creazione: campi opzionali solo se presenti', () => {
  const s = creaSegnalazione({ tipo: 'app', testo: ' non si apre ' }, T0, 'a');
  assert.deepEqual(s, { id: 'a', quando: T0, tipo: 'app', testo: 'non si apre' });
  const d = creaSegnalazione({ tipo: 'domanda', testo: 'la risposta esatta è B', domandaId: 'q12', domandaTesto: 'Which sentence is correct?' }, T0, 'b');
  assert.equal(d.domandaId, 'q12');
  assert.equal(d.domandaTesto, 'Which sentence is correct?');
});

test('lista: la più recente in testa, massimo 50, un id una volta sola, rimozione', () => {
  let l = [] as ReturnType<typeof aggiungi>;
  for (let i = 0; i < MASSIMO_SALVATE + 5; i++) l = aggiungi(l, creaSegnalazione({ tipo: 'idea', testo: `idea numero ${i}` }, T0 + i, `id${i}`));
  assert.equal(l.length, MASSIMO_SALVATE);
  assert.equal(l[0].id, `id${MASSIMO_SALVATE + 4}`);
  const doppia = aggiungi(l, { ...l[3], testo: 'cambiata davvero' });
  assert.equal(doppia.length, MASSIMO_SALVATE);
  assert.equal(doppia[0].testo, 'cambiata davvero');
  assert.equal(rimuovi(l, l[0].id).length, MASSIMO_SALVATE - 1);
});

test('testo da copiare: tipo, domanda e testo; mai altro', () => {
  const s = creaSegnalazione({ tipo: 'domanda', testo: 'La B e la C sono entrambe giuste', domandaId: 'q7', domandaTesto: 'Choose the correct form' }, T0, 'z');
  const t = testoDaCopiare(s);
  assert.match(t, /^Segnalazione AddiOFA · Domanda sbagliata · 12 ottobre 2026/);
  assert.match(t, /Domanda: q7 · «Choose the correct form»/);
  assert.match(t, /La B e la C sono entrambe giuste/);
  assert.ok(!/stats|history|email|@/.test(t));
  const e = testoDaCopiare(creaSegnalazione({ tipo: 'app', testo: 'schermata bianca', errore: 'TypeError: x is undefined' }, T0, 'y'));
  assert.match(e, /Dettaglio tecnico: TypeError: x is undefined/);
});

test('lettura salvate: scarta le voci rovinate', () => {
  assert.deepEqual(leggiSalvate(undefined), []);
  assert.deepEqual(leggiSalvate('no'), []);
  const l = leggiSalvate([
    { id: 'a', quando: T0, tipo: 'app', testo: 'ok ok ok' },
    { id: 'b', quando: 'ieri', tipo: 'app', testo: 'x' },
    { id: 'c', quando: T0, tipo: 'inventato', testo: 'x' },
    null, 3,
  ]);
  assert.deepEqual(l.map(x => x.id), ['a']);
});
