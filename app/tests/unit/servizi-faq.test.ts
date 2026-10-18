// Guida e FAQ: ricerca per categoria e per parole, testi coerenti con l'app gratuita e statica.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIE_FAQ, cercaFaq, normalizza, vociFaq } from '../../src/lib/servizi/faq';
import { EXAM } from '../../src/config/offer';
import { questions } from '../../src/data/questions';

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
  assert.ok(cercaFaq(voci, 'cookie').some(v => v.id === 'dati-cookie'));
  assert.ok(cercaFaq(voci, 'PERCHE').length >= 0);
  assert.deepEqual(cercaFaq(voci, 'zzzzqqq'), []);
  assert.equal(cercaFaq(voci, '').length, voci.length);
  const a = cercaFaq(voci, 'diagnostico').length;
  const b = cercaFaq(voci, 'diagnostico browser').length;
  assert.ok(b <= a);
});

test('ricerca: la categoria restringe', () => {
  const t = cercaFaq(voci, '', 'test');
  assert.ok(t.length > 0 && t.every(v => v.categoria === 'test'));
  assert.ok(cercaFaq(voci, 'privacy', 'app').length === 0 || cercaFaq(voci, 'privacy', 'app').every(v => v.categoria === 'app'));
  assert.ok(cercaFaq(voci, 'browser', 'dati').length >= 1);
});

test('l\'app è gratuita e lo dice: nessuna voce parla di Pass, prezzi, pagamenti, lista d\'attesa, codici o account a pagamento', () => {
  // la sola voce che nomina i pagamenti è «È davvero gratis?», per dire che non ce ne sono
  const tutto = voci.filter(v => v.id !== 'app-gratis').map(v => [v.domanda, ...v.risposta, v.chiavi ?? ''].join(' ')).join(' ').toLowerCase();
  for (const vietata of ['il pass', 'pagamento', 'lista d\'attesa', 'invit', 'garanzia', 'recesso', 'beta', 'dimostrativ']) {
    assert.ok(!tutto.includes(vietata), `non deve comparire «${vietata}»`);
  }
  assert.ok(voci.find(v => v.id === 'app-gratis')!.risposta.join(' ').includes('Nessun pagamento'));
});

test('i numeri della guida vengono dal banco e dal formato veri', () => {
  const cosa = voci.find(v => v.id === 'studio-cosa-ce')!.risposta.join(' ');
  assert.ok(cosa.includes(String(questions.length)));
  const formato = voci.find(v => v.id === 'test-formato')!.risposta.join(' ');
  assert.ok(formato.includes(`${EXAM.passMark} su ${EXAM.questions}`));
});

test('nessuna voce promette ciò che l\'app non fa', () => {
  const tutto = voci.map(v => [v.domanda, ...v.risposta].join(' ')).join(' ').toLowerCase();
  for (const vietata of ['ufficiale del politecnico', 'garantiamo', 'sicuro di superare', 'teng', '100 %', 'studenti hanno già', 'in arrivo', 'presto']) {
    assert.ok(!tutto.includes(vietata), `non deve comparire «${vietata}»`);
  }
});
