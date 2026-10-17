// «Cosa fai al Poli»: cascata Scuola → Sede → Livello → Corso → Anno, passi a scelta unica saltati, briciole, ricerca.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  anniDelCorso, briciole, CORSI_PER_RICERCA, CORSO_ALTRO_ID, esitoPercorso, filtraCorsi, opzioniPasso, risolvi, scegli, torna,
  type ScelteCorso,
} from '../../src/lib/progetto/percorso';
import { fonteProva } from '../../src/lib/progetto/percorsoProva';

const F = fonteProva;
const ids = (o: { id: string }[]) => o.map(x => x.id);

test('si parte dalle quattro scuole', () => {
  const r = risolvi({}, F);
  assert.equal(r.passo, 'scuola');
  assert.deepEqual(ids(r.opzioni), ['ing-ind-inf', 'icat', 'auic', 'design']);
  assert.deepEqual(r.automatici, []);
});

test('sede: solo le sedi attive di quella scuola', () => {
  const r = risolvi({ scuola: 'ing-ind-inf' }, F);
  assert.equal(r.passo, 'sede');
  assert.deepEqual(ids(r.opzioni), ['leonardo', 'bovisa', 'lecco']);
  assert.deepEqual(ids(risolvi({ scuola: 'icat' }, F).opzioni), ['leonardo', 'lecco']);
});

test('sede unica: il passo si salta da solo e compare come scelta automatica', () => {
  const r = risolvi({ scuola: 'design' }, F);
  assert.equal(r.scelte.sede, 'bovisa');
  assert.deepEqual(r.automatici, ['sede']);
  assert.equal(r.passo, 'livello');
  assert.deepEqual(ids(r.opzioni), ['triennale', 'magistrale']);
});

test('livello: solo quelli che esistono per quella scuola e sede', () => {
  assert.deepEqual(ids(opzioniPasso('livello', { scuola: 'ing-ind-inf', sede: 'lecco' }, F)), ['triennale']);
  assert.deepEqual(ids(opzioniPasso('livello', { scuola: 'auic', sede: 'leonardo' }, F)), ['triennale', 'magistrale', 'ciclo-unico']);
});

test('sede e livello a scelta unica: salta due passi di fila e arriva ai corsi', () => {
  const r = risolvi({ scuola: 'ing-ind-inf', sede: 'lecco' }, F);
  assert.deepEqual(r.automatici, ['livello']);
  assert.equal(r.scelte.livello, 'triennale');
  assert.equal(r.passo, 'corso');
  const r2 = risolvi({ scuola: 'icat', sede: 'lecco' }, F);
  assert.equal(r2.passo, 'corso');
  assert.equal(ids(r2.opzioni)[0], 'ic-c-t-1');
});

test('corso: elenco filtrato per scuola, sede e livello, con «Altro» in fondo', () => {
  const o = opzioniPasso('corso', { scuola: 'ing-ind-inf', sede: 'bovisa', livello: 'magistrale' }, F);
  assert.equal(o.length, 4 + 1);
  assert.equal(o[o.length - 1].id, CORSO_ALTRO_ID);
  assert.ok(o.every(c => c.id === CORSO_ALTRO_ID || c.id.startsWith('ii-b-m')));
});

test('anno: da 1 al numero di anni del corso; ciclo unico 5; «Altro» usa il livello', () => {
  assert.deepEqual(ids(opzioniPasso('anno', { scuola: 'auic', sede: 'leonardo', livello: 'triennale', corso: 'au-l-t-1' }, F)), ['1', '2', '3']);
  assert.deepEqual(ids(opzioniPasso('anno', { scuola: 'auic', sede: 'leonardo', livello: 'magistrale', corso: 'au-l-m-1' }, F)), ['1', '2']);
  assert.equal(anniDelCorso({ scuola: 'auic', sede: 'leonardo', livello: 'ciclo-unico', corso: 'au-l-u-1' }, F), 5);
  assert.equal(anniDelCorso({ scuola: 'auic', sede: 'leonardo', livello: 'magistrale', corso: CORSO_ALTRO_ID }, F), 2);
  assert.equal(anniDelCorso({}, F), 5);
});

test('percorso completo: tocco dopo tocco fino all\'anno, con i nomi veri e l\'id del corso', () => {
  let s: ScelteCorso = {};
  s = scegli(s, 'scuola', 'design');                 // sede si salta
  s = risolvi(s, F).scelte;
  s = scegli(s, 'livello', 'magistrale');
  s = scegli(s, 'corso', 'de-b-m-2');
  assert.equal(risolvi(s, F).passo, 'anno');
  s = scegli(s, 'anno', '2');
  const r = risolvi(s, F);
  assert.equal(r.passo, null);
  assert.deepEqual(esitoPercorso(s, F), { scuola: 'design', sede: 'bovisa', livello: 'magistrale', corso: 'Corso di prova DE-B-M 2', corsoId: 'de-b-m-2', anno: 2 });
});

test('percorso incompleto: nessun esito', () => {
  assert.equal(esitoPercorso({ scuola: 'design' }, F), null);
  assert.equal(esitoPercorso({}, F), null);
});

test('«Altro»: l\'esito porta il nome «Altro» e l\'id altro', () => {
  const e = esitoPercorso({ scuola: 'icat', sede: 'lecco', livello: 'triennale', corso: CORSO_ALTRO_ID, anno: 1 }, F)!;
  assert.equal(e.corso, 'Altro');
  assert.equal(e.corsoId, 'altro');
});

test('torna (briciole): toglie la scelta e le successive; i passi automatici si rimettono da soli', () => {
  const pieno: ScelteCorso = { scuola: 'ing-ind-inf', sede: 'bovisa', livello: 'triennale', corso: 'ii-b-t-1', anno: 2 };
  assert.deepEqual(torna(pieno, 'livello'), { scuola: 'ing-ind-inf', sede: 'bovisa' });
  assert.deepEqual(torna(pieno, 'scuola'), {});
  // si torna alla sede e se ne sceglie un'altra: le scelte dopo sono dimenticate
  assert.deepEqual(scegli(pieno, 'sede', 'lecco'), { scuola: 'ing-ind-inf', sede: 'lecco' });
  // scegliendo di nuovo la scuola «design» la sede unica si rimette da sola
  const r = risolvi(scegli(pieno, 'scuola', 'design'), F);
  assert.equal(r.scelte.sede, 'bovisa');
  assert.deepEqual(r.automatici, ['sede']);
});

test('briciole: nomi veri, «n° anno», automatiche segnate', () => {
  const r = risolvi({ scuola: 'design', livello: 'triennale', corso: 'de-b-t-1', anno: 3 }, F);
  const b = briciole(r.scelte, r.automatici, F);
  assert.deepEqual(b.map(x => x.passo), ['scuola', 'sede', 'livello', 'corso', 'anno']);
  assert.equal(b[0].nome, 'Design');
  assert.equal(b[1].nome, 'Milano Bovisa');
  assert.equal(b[1].automatica, true);
  assert.equal(b[0].automatica, false);
  assert.equal(b[4].nome, '3° anno');
});

test('ricerca: compare oltre 8 corsi; tutte le parole, senza accenti né maiuscole', () => {
  const corsi = opzioniPasso('corso', { scuola: 'ing-ind-inf', sede: 'leonardo', livello: 'triennale' }, F);
  assert.ok(corsi.length > CORSI_PER_RICERCA);
  assert.equal(filtraCorsi(corsi, 'PROVA ii-l-t 12').length, 1);
  assert.equal(filtraCorsi(corsi, '').length, corsi.length);
  assert.equal(filtraCorsi([{ id: 'a', nome: 'Ingegneria dell\'Automazione' }], 'automazione ingegneria').length, 1);
  assert.equal(filtraCorsi([{ id: 'a', nome: 'Città Ambiente' }], 'citta').length, 1);
});

test('dati mancanti: un passo senza scelte si salta senza inventare niente', () => {
  const vuota = { ...F, sedi: () => [] as { id: string; nome: string }[] };
  const r = risolvi({ scuola: 'design' }, vuota);
  assert.equal(r.scelte.sede, undefined);
  assert.equal(r.passo, 'livello');
});
