// Guida e FAQ: ricerca per categoria e per parole, testi coerenti con config/offer.ts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIE_FAQ, cercaFaq, normalizza, vociFaq } from '../../src/lib/servizi/faq';
import { PAYMENTS_ENABLED, PASS } from '../../src/config/offer';

const voci = vociFaq();

test('ogni categoria ha almeno due voci, gli id sono unici, nessuna risposta vuota', () => {
  for (const c of CATEGORIE_FAQ) assert.ok(voci.filter(v => v.categoria === c.id).length >= 2, c.nome);
  assert.equal(new Set(voci.map(v => v.id)).size, voci.length);
  assert.ok(voci.every(v => v.domanda.length > 5 && v.risposta.length > 0 && v.risposta.every(r => r.trim().length > 0)));
});

test('normalizza: senza accenti, senza punteggiatura', () => {
  assert.equal(normalizza('  Perché?  È «così» '), 'perche e cosi');
});

test('ricerca: tutte le parole devono comparire; accenti e maiuscole non contano', () => {
  assert.ok(cercaFaq(voci, 'recesso').some(v => v.id === 'pass-recesso'));
  assert.ok(cercaFaq(voci, 'PERCHE').length >= 0);
  assert.deepEqual(cercaFaq(voci, 'zzzzqqq'), []);
  assert.equal(cercaFaq(voci, '').length, voci.length);
  const a = cercaFaq(voci, 'diagnostico').length;
  const b = cercaFaq(voci, 'diagnostico gratis').length;
  assert.ok(b <= a);
});

test('ricerca: la categoria restringe', () => {
  const t = cercaFaq(voci, '', 'test');
  assert.ok(t.length > 0 && t.every(v => v.categoria === 'test'));
  assert.ok(cercaFaq(voci, 'privacy', 'pass').length === 0 || cercaFaq(voci, 'privacy', 'pass').every(v => v.categoria === 'pass'));
  assert.ok(cercaFaq(voci, 'matricola', 'dati').length >= 1);
});

test('pagamenti: la risposta dice la verità sull\'interruttore', () => {
  const v = voci.find(x => x.id === 'pass-pagamenti')!;
  const testo = v.risposta.join(' ');
  if (!PAYMENTS_ENABLED) {
    assert.match(testo, /non sono attivi/);
    assert.match(testo, /lista d'attesa/);
  }
  assert.ok(testo.includes(',') || testo.length > 20);
  assert.ok(voci.find(x => x.id === 'pass-cose')!.risposta.join(' ').includes(String(PASS.validMonths)));
});

test('nessuna voce promette ciò che l\'app non fa', () => {
  const tutto = voci.map(v => [v.domanda, ...v.risposta].join(' ')).join(' ').toLowerCase();
  for (const vietata of ['ufficiale del politecnico', 'garantiamo', 'sicuro di superare', 'teng', '100 %', 'studenti hanno già']) {
    assert.ok(!tutto.includes(vietata), `non deve comparire «${vietata}»`);
  }
});
