// Codice del link di una sfida: andata e ritorno, link manomesso, valori impossibili.
import test from 'node:test';
import assert from 'node:assert/strict';
import { codificaSfida, decodificaSfida, estraiCodice, linkSfida, pulisciNome, NOME_MAX, type DatiSfida } from '../../src/lib/sfide/codice';

const base: DatiSfida = { tipo: 'd', seme: 'd-k3m9x2ab', banco: 'a1b2', id: 'K7M2PQ', nome: 'Marta', corrette: 8, totale: 10, secondi: 187 };

test('andata e ritorno: decodifica restituisce gli stessi dati', () => {
  assert.deepEqual(decodificaSfida(codificaSfida(base)), base);
  const r: DatiSfida = { ...base, tipo: 'r', corrette: 0, secondi: 0 };
  assert.deepEqual(decodificaSfida(codificaSfida(r)), r);
});

test('il nome con accenti, apostrofi ed emoji sopravvive; il codice è adatto a un indirizzo', () => {
  for (const nome of ["Niccolò", "D'Angelo", 'Zoë 🙂', 'Ana María']) {
    const c = codificaSfida({ ...base, nome });
    assert.match(c, /^[A-Za-z0-9_-]+\.[a-z0-9]{6}$/);
    assert.equal(decodificaSfida(c)?.nome, pulisciNome(nome));
  }
});

test('pulisciNome: toglie separatore, tag e controlli, accorcia, schiaccia gli spazi', () => {
  assert.equal(pulisciNome('  Ma~rta <b>  '), 'Ma rta b');
  assert.equal(pulisciNome('x'.repeat(50)).length, NOME_MAX);
  assert.equal(pulisciNome('a\nb\tc'), 'a b c');
  assert.equal(pulisciNome('   '), '');
});

test('un nome con il separatore non rompe il codice (viene ripulito prima)', () => {
  const d = decodificaSfida(codificaSfida({ ...base, nome: 'A~B' }));
  assert.equal(d?.nome, 'A B');
});

test('link manomesso: un carattere cambiato, tagliato o con il controllo sbagliato → null', () => {
  const c = codificaSfida(base);
  const i = Math.floor(c.indexOf('.') / 2);
  const cambiato = c.slice(0, i) + (c[i] === 'A' ? 'B' : 'A') + c.slice(i + 1);
  assert.equal(decodificaSfida(cambiato), null);
  assert.equal(decodificaSfida(c.slice(0, -2)), null);
  assert.equal(decodificaSfida(c.slice(0, c.indexOf('.') + 1) + 'zzzzzz'), null);
  assert.equal(decodificaSfida(c.replace('.', '')), null);
});

test('spazzatura, vuoto, codici enormi → null senza eccezioni', () => {
  for (const s of ['', '   ', 'abc', '....', '%%%.%%%%%%', 'a'.repeat(5000), 'null', '{"x":1}']) assert.equal(decodificaSfida(s), null);
});

test('valori impossibili (anche con un controllo corretto, scritti a mano) → null', () => {
  // codificaSfida non valida i numeri: decodifica sì
  assert.equal(decodificaSfida(codificaSfida({ ...base, corrette: 11 })), null);       // più corrette che domande
  assert.equal(decodificaSfida(codificaSfida({ ...base, totale: 0, corrette: 0 })), null);
  assert.equal(decodificaSfida(codificaSfida({ ...base, secondi: 999_999 })), null);
  assert.equal(decodificaSfida(codificaSfida({ ...base, seme: 'SEME CON SPAZI' })), null);
  assert.equal(decodificaSfida(codificaSfida({ ...base, id: 'x' })), null);
  assert.equal(decodificaSfida(codificaSfida({ ...base, nome: '' })), null);
  assert.equal(decodificaSfida(codificaSfida({ ...base, tipo: 'x' as 'd' })), null);
});

test('estraiCodice: da link intero, da «?sfida=» e dal solo codice', () => {
  const c = codificaSfida(base);
  assert.equal(estraiCodice(`https://esempio.it/app/?sfida=${c}`), c);
  assert.equal(estraiCodice(`https://esempio.it/app/?x=1&sfida=${c}&y=2`), c);
  assert.equal(estraiCodice(`?sfida=${c}`), c);
  assert.equal(estraiCodice(`  ${c}\n`), c);
  assert.equal(estraiCodice('ciao a tutti'), null);
  assert.equal(estraiCodice(''), null);
});

test('linkSfida: sostituisce query e hash dell\'indirizzo', () => {
  const c = codificaSfida(base);
  assert.equal(linkSfida('https://esempio.it/app/?vista=sfide#x', c), `https://esempio.it/app/?sfida=${c}`);
  assert.equal(estraiCodice(linkSfida('https://esempio.it/', c)), c);
});
