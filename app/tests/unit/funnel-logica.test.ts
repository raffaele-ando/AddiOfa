// Percorso di ingresso: ordine delle schermate (richieste sparse, nessuna fra l'ultima domanda e il risultato), elenco dei corsi, argomenti da ripassare.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  anniDelLivello, argomentiDaRipassare, cammino, corsoScelto, elencoCorsi, indiceDomanda, livelliPresenti, ORDINE_RICHIESTE, sceltaDaCorso, testoErrori,
} from '../../src/components/funnel-logica';
import { fonteProva } from './percorso-fixture';
import type { Question } from '../../src/types';

const TUTTE = [...ORDINE_RICHIESTE];
const base = { domande: 10, richieste: TUTTE, racconto: true, avvio: false, certOfa: true };

test('percorso di un nuovo utente: 18 schermate, certificazione e OFA prima delle domande, risultato subito dopo la decima', () => {
  const c = cammino(base);
  assert.equal(c.length, 18);
  assert.deepEqual(c.slice(0, 4), ['pain', 'gain', 'certOfa', 'q0']);
  assert.equal(c[c.length - 1], 'result');
  assert.equal(c[c.length - 2], 'q9');
});

test('le richieste stanno SPARSE fra le domande, una per volta, nell\'ordine dell\'autore', () => {
  const c = cammino(base);
  const pos = (k: string) => c.indexOf(k);
  assert.ok(pos('email') < pos('prov') && pos('prov') < pos('corso') && pos('corso') < pos('consensi'));
  assert.equal(c[pos('email') - 1], 'q1');           // email dopo la 2ª domanda
  for (const r of ORDINE_RICHIESTE) assert.ok(indiceDomanda(c[pos(r) - 1]) !== null && indiceDomanda(c[pos(r) + 1]) !== null, `${r} sta fra due domande`);
});

test('le ultime tre domande sono solo domande e fra l\'ultima e il risultato non c\'è nessuna richiesta', () => {
  const c = cammino(base);
  assert.deepEqual(c.slice(-4), ['q7', 'q8', 'q9', 'result']);
});

test('con poche domande le richieste rimaste si chiudono tutte prima dell\'ultima domanda', () => {
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const c = cammino({ ...base, domande: n });
    assert.equal(c[c.length - 1], 'result');
    if (n > 1) assert.ok(indiceDomanda(c[c.length - 2]) === n - 1, `ultima domanda subito prima del risultato (n=${n})`);
    for (const r of ORDINE_RICHIESTE) if (n > 1) assert.ok(c.indexOf(r) < c.indexOf(`q${n - 1}`), `${r} prima dell'ultima domanda (n=${n})`);
  }
});

test('chi ha già la registrazione non rivede racconto né richieste; l\'avvio e certificazione/OFA dipendono da cosa sa già', () => {
  const c = cammino({ domande: 10, richieste: [], racconto: false, avvio: true, certOfa: false });
  assert.equal(c.length, 12);
  assert.deepEqual(c.slice(0, 2), ['avvio', 'q0']);
  assert.ok(cammino({ domande: 10, richieste: [], racconto: false, avvio: true, certOfa: true }).includes('certOfa'));
});

test('una richiesta già fatta non compare', () => {
  const c = cammino({ ...base, richieste: ['corso', 'consensi'] });
  assert.ok(!c.includes('email') && !c.includes('prov'));
  assert.equal(c.length, 16);
});

test('elenco dei corsi: tutte le scuole, una voce per sede, in ordine alfabetico; scuola, sede e livello si ricavano dal corso', () => {
  const v = elencoCorsi(fonteProva);
  assert.ok(v.length > 40);
  const nomi = v.map(x => x.nome.toLowerCase());
  assert.deepEqual(nomi, [...nomi].sort((a, b) => a.localeCompare(b, 'it')));
  const x = v.find(c => c.id === 'au-l-u-1')!;
  assert.equal(x.scuola, 'auic'); assert.equal(x.sede, 'leonardo'); assert.equal(x.livello, 'ciclo-unico'); assert.equal(x.anni, 5);
  assert.equal(new Set(v.map(c => c.chiave)).size, v.length, 'ogni voce ha una chiave unica');
});

test('livelli presenti e anni delle pillole', () => {
  const v = elencoCorsi(fonteProva);
  assert.deepEqual(livelliPresenti(v), ['triennale', 'ciclo-unico', 'magistrale']);
  assert.equal(anniDelLivello(v, 'triennale'), 3);
  assert.equal(anniDelLivello(v, 'magistrale'), 2);
  assert.equal(anniDelLivello(v, 'ciclo-unico'), 5);
});

test('scelta di un corso: l\'anno resta nei limiti del corso e il corso scelto si ritrova', () => {
  const v = elencoCorsi(fonteProva);
  const x = v.find(c => c.id === 'ii-l-m-1')!;
  const s = sceltaDaCorso(x, 3);
  assert.deepEqual(s, { scuola: 'ing-ind-inf', sede: 'leonardo', livello: 'magistrale', corso: 'ii-l-m-1', anno: 2 });
  assert.equal(sceltaDaCorso(x, 0).anno, 1);
  assert.equal(corsoScelto(v, s)?.chiave, x.chiave);
  assert.equal(corsoScelto(v, { corso: 'altro', anno: 1 }), undefined);
});

const dom = (id: string, topic: string, correctIndex = 0) => ({ id, grammarTopic: topic, category: 'Grammatica', correctIndex } as unknown as Question);

test('argomenti da ripassare: contano gli errori (anche «Non lo so» = -1), dal più sbagliato al meno', () => {
  const q = [dom('a', 'Past Simple'), dom('b', 'Past Simple'), dom('c', 'Quantifiers'), dom('d', 'Passive Voice')];
  const r = argomentiDaRipassare(q, { a: 1, b: -1, c: 0, d: 2 });
  assert.deepEqual(r, [{ nome: 'Past Simple', errori: 2 }, { nome: 'Passive Voice', errori: 1 }]);
  assert.deepEqual(argomentiDaRipassare(q, { a: 0, b: 0, c: 0, d: 0 }), []);
  assert.equal(testoErrori(1), '1 errore'); assert.equal(testoErrori(3), '3 errori');
});
