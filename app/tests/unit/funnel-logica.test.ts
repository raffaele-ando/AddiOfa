// Percorso di ingresso: ordine delle schermate (richieste sparse, nessuna fra l'ultima domanda e il risultato), passi del percorso di studi, argomenti da ripassare.
import test from 'node:test';
import assert from 'node:assert/strict';
import { argomentiDaRipassare, cammino, indiceDomanda, ORDINE_RICHIESTE, passiPercorso, testoErrori } from '../../src/components/funnel-logica';
import { fonteProva } from './percorso-fixture';
import type { Question } from '../../src/types';

const TUTTE = [...ORDINE_RICHIESTE];
const base = { domande: 10, richieste: TUTTE, racconto: true, avvio: false, certOfa: true };

test('percorso di un nuovo utente con tutti i passi: pain, gain, certificazione/OFA, 10 domande, 7 richieste, risultato', () => {
  const c = cammino(base);
  assert.equal(c.length, 3 + 10 + 7 + 1);
  assert.deepEqual(c.slice(0, 4), ['pain', 'gain', 'certOfa', 'q0']);
  assert.equal(c[c.length - 1], 'result');
  assert.equal(c[c.length - 2], 'q9');
});

test('distribuzione: email dopo la 2ª, provenienza dopo la 3ª, scuola 4ª, sede 5ª, livello 6ª, corso 7ª, consensi 8ª', () => {
  const c = cammino(base);
  const dopo: Record<string, string> = { email: 'q1', prov: 'q2', scuola: 'q3', sede: 'q4', livello: 'q5', corso: 'q6', consensi: 'q7' };
  for (const [r, q] of Object.entries(dopo)) assert.equal(c[c.indexOf(r) - 1], q, `${r} dopo ${q}`);
  for (const r of ORDINE_RICHIESTE) assert.ok(indiceDomanda(c[c.indexOf(r) + 1]) !== null, `${r} è seguita da una domanda`);
});

test('le ultime due domande sono solo domande e fra l\'ultima e il risultato non c\'è nessuna richiesta', () => {
  const c = cammino(base);
  assert.deepEqual(c.slice(-3), ['q8', 'q9', 'result']);
  assert.equal(c[c.length - 4], 'consensi');
});

test('un passo con una sola scelta si salta e le richieste dopo scorrono prima', () => {
  const senzaSede = ORDINE_RICHIESTE.filter(r => r !== 'sede');
  const c = cammino({ ...base, richieste: senzaSede });
  assert.ok(!c.includes('sede'));
  assert.equal(c[c.indexOf('livello') - 1], 'q4');
  assert.equal(c[c.indexOf('consensi') - 1], 'q6');
  assert.equal(c.length, 3 + 10 + 6 + 1);
});

test('con poche domande le richieste rimaste si chiudono tutte prima dell\'ultima domanda', () => {
  for (const n of [2, 3, 4, 5, 6, 8]) {
    const c = cammino({ ...base, domande: n });
    assert.equal(c[c.length - 1], 'result');
    assert.ok(indiceDomanda(c[c.length - 2]) === n - 1, `ultima domanda subito prima del risultato (n=${n})`);
    for (const r of ORDINE_RICHIESTE) assert.ok(c.indexOf(r) < c.indexOf(`q${n - 1}`), `${r} prima dell'ultima domanda (n=${n})`);
  }
});

test('chi ha già la registrazione non rivede racconto né richieste; l\'avvio e certificazione/OFA dipendono da cosa sa già', () => {
  const c = cammino({ domande: 10, richieste: [], racconto: false, avvio: true, certOfa: false });
  assert.equal(c.length, 12);
  assert.deepEqual(c.slice(0, 2), ['avvio', 'q0']);
  assert.ok(cammino({ domande: 10, richieste: [], racconto: false, avvio: true, certOfa: true }).includes('certOfa'));
});

test('passi del percorso di studi: all\'inizio si contano tutti; sede e livello con una sola scelta si saltano', () => {
  assert.deepEqual(passiPercorso({}, fonteProva), ['scuola', 'sede', 'livello', 'corso']);
  // Design ha una sola sede attiva (Bovisa): la sede si salta, restano il livello e il corso
  assert.deepEqual(passiPercorso({ scuola: 'design' }, fonteProva), ['scuola', 'livello', 'corso']);
  // Ingegneria industriale ha tre sedi
  assert.deepEqual(passiPercorso({ scuola: 'ing-ind-inf' }, fonteProva), ['scuola', 'sede', 'livello', 'corso']);
  // sede con un solo livello (Lecco, solo triennale): salta anche il livello
  assert.deepEqual(passiPercorso({ scuola: 'ing-ind-inf', sede: 'lecco' }, fonteProva), ['scuola', 'sede', 'corso']);
});

const dom = (id: string, topic: string, correctIndex = 0) => ({ id, grammarTopic: topic, category: 'Grammatica', correctIndex } as unknown as Question);

test('argomenti da ripassare: contano gli errori (anche «Non lo so» = -1), dal più sbagliato al meno', () => {
  const q = [dom('a', 'Past Simple'), dom('b', 'Past Simple'), dom('c', 'Quantifiers'), dom('d', 'Passive Voice')];
  const r = argomentiDaRipassare(q, { a: 1, b: -1, c: 0, d: 2 });
  assert.deepEqual(r, [{ nome: 'Past Simple', errori: 2 }, { nome: 'Passive Voice', errori: 1 }]);
  assert.deepEqual(argomentiDaRipassare(q, { a: 0, b: 0, c: 0, d: 0 }), []);
  assert.equal(testoErrori(1), '1 errore'); assert.equal(testoErrori(3), '3 errori');
});
