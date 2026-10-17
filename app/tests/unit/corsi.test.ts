// L'elenco dei corsi del Politecnico (generato da contenuti/corsi): scelta guidata scuola > sede > livello > corso > anno.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  scuole, sedi, corsi, corsiInEsaurimento, sediDellaScuola, livelliDisponibili, corsiDisponibili, anniDelCorso,
} from '../../src/data/corsi';

test('id unici e riferimenti validi (scuola, sede) in ogni corso', () => {
  const ids = corsi.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, 'id duplicati');
  for (const c of corsi) {
    assert.ok(scuole.some((s) => s.id === c.scuola), `${c.id}: scuola ${c.scuola}`);
    assert.ok(sedi.some((s) => s.id === c.sede), `${c.id}: sede ${c.sede}`);
    assert.ok(c.fonte.startsWith('https://'), `${c.id}: fonte`);
  }
});

test('le quattro scuole ci sono e ognuna ha sedi con corsi', () => {
  assert.deepEqual(scuole.map((s) => s.id).sort(), ['auic', 'design', 'icat', 'ing-ind-inf']);
  for (const s of scuole) assert.ok(sediDellaScuola(s.id).length > 0, s.id);
});

test('sediDellaScuola: solo sedi attive e con corsi; scuola sconosciuta = nessuna', () => {
  assert.deepEqual(sediDellaScuola('design').map((s) => s.id), ['bovisa', 'lecco']);
  assert.deepEqual(sediDellaScuola('non-esiste'), []);
  for (const s of scuole) for (const sede of sediDellaScuola(s.id)) assert.equal(sede.attiva, true);
});

test('una sede inattiva non compare mai tra le scelte', () => {
  const inattive = sedi.filter((s) => !s.attiva);
  for (const sede of inattive) {
    for (const s of scuole) {
      assert.ok(!sediDellaScuola(s.id).some((x) => x.id === sede.id), `${sede.id} in ${s.id}`);
      assert.deepEqual(livelliDisponibili(s.id, sede.id), []);
      for (const l of ['triennale', 'magistrale', 'ciclo-unico'] as const) assert.deepEqual(corsiDisponibili(s.id, sede.id, l), []);
    }
  }
});

test('livelliDisponibili: nell\'ordine triennale, ciclo unico, magistrale; nessuno se non ci sono corsi', () => {
  assert.deepEqual(livelliDisponibili('auic', 'lecco'), ['ciclo-unico', 'magistrale']);
  assert.deepEqual(livelliDisponibili('auic', 'leonardo'), ['triennale', 'magistrale']);
  assert.deepEqual(livelliDisponibili('design', 'lecco'), ['triennale']);
  assert.deepEqual(livelliDisponibili('design', 'cremona'), []);
});

test('corsiDisponibili: filtra per scuola, sede e livello, in ordine alfabetico', () => {
  const dis = corsiDisponibili('design', 'bovisa', 'triennale');
  assert.deepEqual(dis.map((c) => c.nome), [
    'Design degli Interni', 'Design del Prodotto Industriale', 'Design della Comunicazione', 'Design della Moda',
  ]);
  for (const l of ['triennale', 'magistrale', 'ciclo-unico'] as const) {
    for (const c of corsiDisponibili('ing-ind-inf', 'cremona', l)) {
      assert.equal(c.scuola, 'ing-ind-inf');
      assert.equal(c.sede, 'cremona');
      assert.equal(c.livello, l);
    }
  }
  const cremona = corsiDisponibili('ing-ind-inf', 'cremona', 'triennale').map((c) => c.nome);
  for (const nome of ['Ingegneria Gestionale', 'Ingegneria Informatica', 'Process Engineering']) assert.ok(cremona.includes(nome), nome);
});

test('un corso su più sedi compare una volta per sede, con lo stesso nome', () => {
  const gest = corsi.filter((c) => c.nome === 'Ingegneria Gestionale' && c.livello === 'triennale');
  assert.deepEqual(gest.map((c) => c.sede).sort(), ['bovisa', 'cremona']);
});

test('anniDelCorso: [1..anni] secondo la durata legale', () => {
  assert.deepEqual(anniDelCorso({ anni: 3 }), [1, 2, 3]);
  assert.deepEqual(anniDelCorso({ anni: 2 }), [1, 2]);
  const edile = corsi.find((c) => c.livello === 'ciclo-unico' && c.nome === 'Ingegneria Edile-Architettura');
  assert.ok(edile);
  assert.deepEqual(anniDelCorso(edile), [1, 2, 3, 4, 5]);
  for (const c of corsi) {
    if (c.livello === 'triennale') assert.equal(c.anni, 3, c.id);
    if (c.livello === 'magistrale') assert.equal(c.anni, 2, c.id);
  }
});

test('i corsi in esaurimento hanno anni attivi e riferimenti validi', () => {
  for (const c of corsiInEsaurimento) {
    assert.ok(c.anniAttivi.length > 0, c.id);
    assert.ok(scuole.some((s) => s.id === c.scuola), c.id);
    assert.ok(sedi.some((s) => s.id === c.sede), c.id);
  }
});
