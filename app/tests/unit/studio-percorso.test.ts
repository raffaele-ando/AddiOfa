// Percorso di studio (lib/studio/percorso.ts): ordine didattico, stato di ogni lezione dai progressi veri, tempo stimato.
import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../../src/data/questions';
import { theoryTopics } from '../../src/data/theory';
import {
  ORDINE_PERCORSO, ordinaPercorso, lezioniPercorso, prossimaLezione, tempoLezione, statoDaConteggi,
  filtroArgomento, obiettivoLezione, titoloBreve, QUOTA_LEZIONE_IMPARATA, SECONDI_PER_DOMANDA,
} from '../../src/lib/studio/percorso';
import { statoVuoto } from './aiuti';

const imparata = { correct: 3, incorrect: 0, lastSeen: 1, box: 2 };

test('l\'ordine copre tutte le 31 schede una volta sola, senza id inventati', () => {
  assert.equal(theoryTopics.length, 31);
  const ordinate = ordinaPercorso();
  assert.equal(ordinate.length, theoryTopics.filter(t => t.pronta).length);
  assert.equal(new Set(ordinate.map(t => t.id)).size, ordinate.length);
  assert.deepEqual(new Set(ORDINE_PERCORSO), new Set(theoryTopics.map(t => t.id)), 'ORDINE_PERCORSO elenca esattamente le schede esistenti');
  assert.equal(ORDINE_PERCORSO.length, new Set(ORDINE_PERCORSO).size);
});

test('l\'ordine va da A1 a B1 senza tornare indietro e comincia dai più comuni', () => {
  const ordinate = ordinaPercorso();
  const liv = ['A1', 'A2', 'B1'];
  for (let i = 1; i < ordinate.length; i++) assert.ok(liv.indexOf(ordinate[i].livello) >= liv.indexOf(ordinate[i - 1].livello), `${ordinate[i].id} dopo ${ordinate[i - 1].id}`);
  assert.equal(ordinate[0].id, 'present-simple');
  const conta = (id: string) => questions.filter(q => q.theoryId === id).length;
  // dentro A1 il Present Simple (il più frequente del banco) viene prima delle schede con meno domande
  assert.ok(conta('present-simple') >= Math.max(...ordinate.filter(t => t.livello === 'A1').map(t => conta(t.id))));
  // i prerequisiti vengono prima: Present Perfect prima di Past Perfect e dei condizionali, Past Simple prima di Passive e Used to
  const pos = (id: string) => ordinate.findIndex(t => t.id === id);
  assert.ok(pos('present-perfect') < pos('past-perfect'));
  assert.ok(pos('first-conditional') < pos('second-conditional') && pos('second-conditional') < pos('third-conditional'));
  assert.ok(pos('past-simple') < pos('passive-voice') && pos('past-simple') < pos('used-to') && pos('past-simple') < pos('past-perfect'));
  assert.ok(pos('present-simple') < pos('present-continuous'));
});

test('una scheda nuova non elencata va in fondo al suo livello; una non pronta resta fuori', () => {
  const finta = { ...theoryTopics[0], id: 'nuovo-argomento', titolo: 'Nuovo', livello: 'A2' as const, pronta: true };
  const nonPronta = { ...theoryTopics[1], id: 'non-pronta', pronta: false };
  const o = ordinaPercorso([...theoryTopics, finta, nonPronta]);
  assert.ok(!o.some(t => t.id === 'non-pronta'));
  const ultimoA2 = [...o].reverse().find(t => t.livello === 'A2')!;
  assert.equal(ultimoA2.id, 'nuovo-argomento');
});

test('stato di una lezione: da iniziare, in corso, imparata (soglia 80 %)', () => {
  assert.equal(statoDaConteggi(0, 10, 0), 'da-iniziare');
  assert.equal(statoDaConteggi(0, 10, 3), 'in-corso');
  assert.equal(statoDaConteggi(7, 10, 10), 'in-corso');
  assert.equal(statoDaConteggi(8, 10, 10), 'imparata');
  assert.equal(statoDaConteggi(0, 0, 0), 'da-iniziare', 'mai «0 su 0» imparata');
  assert.equal(QUOTA_LEZIONE_IMPARATA, 0.8);
});

test('lezioniPercorso: senza progressi sono tutte da iniziare e numerate da 1', () => {
  const l = lezioniPercorso(statoVuoto());
  assert.equal(l.length, 31);
  assert.deepEqual(l.map(x => x.numero), Array.from({ length: 31 }, (_, i) => i + 1));
  assert.ok(l.every(x => x.stato === 'da-iniziare' && x.imparate === 0 && x.viste === 0));
  assert.equal(prossimaLezione(l)?.topic.id, 'present-simple');
});

test('lezioniPercorso: una lezione con tutte le domande imparate è «imparata» e la prossima la salta', () => {
  const ps = questions.filter(q => q.theoryId === 'present-simple');
  const stats = Object.fromEntries(ps.map(q => [q.id, imparata]));
  const l = lezioniPercorso(statoVuoto({ stats }));
  const prima = l[0];
  assert.equal(prima.topic.id, 'present-simple');
  assert.equal(prima.stato, 'imparata');
  assert.equal(prima.imparate, ps.length);
  assert.equal(prima.intere, ps.length);
  assert.equal(prossimaLezione(l)?.topic.id, l[1].topic.id, 'la prossima salta quelle imparate');
  assert.ok(l.every(x => x.intere > 0), 'tutte le lezioni hanno domande: nessuna è bloccata o vuota');
});

test('una domanda vista una sola volta (box 1) rende la lezione «in corso» ma non imparata', () => {
  const d = questions.find(q => q.theoryId === 'past-simple')!;
  const l = lezioniPercorso(statoVuoto({ stats: { [d.id]: { correct: 1, incorrect: 0, lastSeen: 1, box: 1 } } }));
  const x = l.find(y => y.topic.id === 'past-simple')!;
  assert.equal(x.stato, 'in-corso');
  assert.equal(x.imparate, 0);
  assert.equal(x.viste, 1);
});

test('tempo stimato: lettura della scheda + una sessione da 10 domande a 30 secondi, mai invenzioni', () => {
  const t = theoryTopics[0];
  const a = tempoLezione(t, 35);
  assert.equal(a.esercizi, Math.round((10 * SECONDI_PER_DOMANDA) / 60));
  assert.equal(a.totale, a.teoria + a.esercizi);
  assert.ok(a.teoria >= 1);
  assert.equal(tempoLezione(t, 4).esercizi, 2);
  assert.equal(tempoLezione(t, 0).esercizi, 0);
  assert.equal(tempoLezione(t, 1).esercizi, 1, 'almeno un minuto se c\'è almeno una domanda');
});

test('filtro per gli esercizi e obiettivo della lezione', () => {
  const ps = theoryTopics.find(t => t.id === 'present-simple')!;
  assert.equal(filtroArgomento(ps), 'topic:Present Simple');
  const o = obiettivoLezione(ps);
  assert.ok(o.cosa.toLowerCase().includes('abitudini e fatti'));
  assert.ok(!/\*/.test(o.inBreve) && o.inBreve.length > 10);
  assert.ok(!/%|rischio/i.test(o.cosa + o.inBreve), 'niente promesse sul punteggio');
  for (const t of theoryTopics) assert.ok(obiettivoLezione(t).inBreve.length > 5, t.id);
});

test('il titolo breve taglia ai due punti e non lascia mai un titolo vuoto', () => {
  assert.equal(titoloBreve({ titolo: 'Present Simple: abitudini e fatti' }), 'Present Simple');
  assert.equal(titoloBreve({ titolo: 'Imperativo' }), 'Imperativo');
  assert.equal(titoloBreve({ titolo: ': solo coda' }), ': solo coda');
  for (const t of theoryTopics) assert.ok(titoloBreve(t).length > 0 && titoloBreve(t).length <= t.titolo.length);
});
