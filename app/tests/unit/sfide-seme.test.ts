// Scelta deterministica delle domande delle sfide: stesso seme = stesse domande, per tutti.
import test from 'node:test';
import assert from 'node:assert/strict';
import { creaGeneratore, scegliDomande, ordineOpzioni, improntaBanco, semeDelGiorno, nuovoSeme, nuovoIdGiocatore, mescolaConSeme, DOMANDE_SFIDA, type VoceBanco } from '../../src/lib/sfide/seme';
import { bankMeta, poolMeta } from '../../src/lib/spacedRepetition';

const banco: VoceBanco[] = Array.from({ length: 60 }, (_, i) => ({ id: `q${i + 1}`, category: i % 3 === 0 ? 'Traduzione' : 'Grammatica' }));

test('il generatore con seme è ripetibile e resta in [0, 1)', () => {
  const a = creaGeneratore('x'), b = creaGeneratore('x'), c = creaGeneratore('y');
  const va = Array.from({ length: 50 }, a), vb = Array.from({ length: 50 }, b), vc = Array.from({ length: 50 }, c);
  assert.deepEqual(va, vb);
  assert.notDeepEqual(va, vc);
  assert.ok(va.every(v => v >= 0 && v < 1));
});

test('stesso seme = stesse 10 domande nello stesso ordine, anche se il banco arriva rimescolato', () => {
  const a = scegliDomande(banco, 'd-abc12345');
  const b = scegliDomande([...banco].reverse(), 'd-abc12345');
  assert.equal(a.length, DOMANDE_SFIDA);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, scegliDomande(banco, 'd-abc12346'));
});

test('niente domande ripetute e mai più della metà della stessa categoria', () => {
  for (let i = 0; i < 40; i++) {
    const ids = scegliDomande(banco, `d-prova${i}`);
    assert.equal(new Set(ids).size, ids.length);
    const per = new Map<string, number>();
    for (const id of ids) { const c = banco.find(v => v.id === id)!.category; per.set(c, (per.get(c) ?? 0) + 1); }
    assert.ok([...per.values()].every(n => n <= 5), JSON.stringify([...per]));
  }
});

test('banco più piccolo di n: restituisce quel che c\'è, senza ripetizioni', () => {
  const ids = scegliDomande(banco.slice(0, 4), 'd-x');
  assert.equal(ids.length, 4);
  assert.equal(new Set(ids).size, 4);
});

test('una categoria sola: riempie comunque le 10 domande', () => {
  const solo = banco.map(v => ({ ...v, category: 'Grammatica' }));
  assert.equal(scegliDomande(solo, 'd-x').length, 10);
});

test('ordine delle opzioni: permutazione valida, uguale per tutti, diversa da domanda a domanda', () => {
  const o = ordineOpzioni('d-abc12345', 'q7', 4);
  assert.deepEqual([...o].sort(), [0, 1, 2, 3]);
  assert.deepEqual(o, ordineOpzioni('d-abc12345', 'q7', 4));
  const diverse = new Set(Array.from({ length: 30 }, (_, i) => ordineOpzioni('d-abc12345', `q${i}`, 4).join()));
  assert.ok(diverse.size > 5);
});

test('mescolaConSeme non cambia l\'elenco di partenza e conserva gli elementi', () => {
  const orig = [1, 2, 3, 4, 5, 6];
  const m = mescolaConSeme(orig, 's');
  assert.deepEqual(orig, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual([...m].sort(), orig);
});

test('impronta del banco: stabile, indipendente dall\'ordine, cambia se cambia il banco', () => {
  assert.equal(improntaBanco(banco), improntaBanco([...banco].reverse()));
  assert.notEqual(improntaBanco(banco), improntaBanco(banco.slice(1)));
  assert.match(improntaBanco(banco), /^[a-z0-9]{4}$/);
});

test('seme del giorno: data locale, uguale nello stesso giorno, diverso il giorno dopo', () => {
  assert.equal(semeDelGiorno(new Date(2026, 9, 12, 0, 5)), 'g-2026-10-12');
  assert.equal(semeDelGiorno(new Date(2026, 9, 12, 23, 59)), 'g-2026-10-12');
  assert.equal(semeDelGiorno(new Date(2026, 9, 13, 0, 0)), 'g-2026-10-13');
});

test('semi e identificativi nuovi hanno il formato che il codice accetta', () => {
  for (let i = 0; i < 20; i++) {
    assert.match(nuovoSeme(), /^d-[a-z0-9]{8}$/);
    assert.match(nuovoIdGiocatore(), /^[A-Z0-9]{6}$/);
  }
  assert.notEqual(nuovoSeme(), nuovoSeme());
});

test('sul banco vero: le 10 domande del giorno esistono, sono del nucleo gratuito e nessuna ripetuta', () => {
  const nucleo = poolMeta(false);
  assert.ok(nucleo.length >= 30);
  const ids = scegliDomande(nucleo, semeDelGiorno(new Date(2026, 9, 12)));
  assert.equal(ids.length, DOMANDE_SFIDA);
  assert.ok(ids.every(id => nucleo.some(m => m.id === id)));
  assert.ok(bankMeta().length >= nucleo.length);
});
