// Testi puri dell'esito e delle correzioni (components/esito/testi.ts).
import test from 'node:test';
import assert from 'node:assert/strict';
import { differenzaEsatte, fraseDifferenza, tipografiche } from '../../src/components/esito/testi';

test('differenza: solo tra prove con lo stesso numero di domande', () => {
  assert.equal(differenzaEsatte({ esatte: 22, totale: 30 }, { esatte: 26, totale: 30 }), 4);
  assert.equal(differenzaEsatte({ esatte: 26, totale: 30 }, { esatte: 0, totale: 30 }), -26);
  assert.equal(differenzaEsatte({ esatte: 10, totale: 20 }, { esatte: 12, totale: 30 }), null);
});

test('riga della differenza: neutra, con singolare e plurale', () => {
  assert.equal(fraseDifferenza(0), 'Come la precedente');
  assert.equal(fraseDifferenza(1), '1 risposta esatta in più della precedente');
  assert.equal(fraseDifferenza(4), '4 risposte esatte in più della precedente');
  assert.equal(fraseDifferenza(-26), '26 risposte esatte in meno della precedente');
});

test('virgolette: le dritte diventano caporali, gli apostrofi restano', () => {
  assert.equal(tipografiche("Con 'more': 'more interesting than'. '-er' va con aggettivi brevi."), 'Con «more»: «more interesting than». «-er» va con aggettivi brevi.');
  assert.equal(tipografiche("Dopo 'did' il verbo è base: 'Did he win?'."), 'Dopo «did» il verbo è base: «Did he win?».');
  assert.equal(tipografiche("Il possessivo 'the baker's' indica il negozio."), 'Il possessivo «the baker\'s» indica il negozio.');
  assert.equal(tipografiche("Don't e l'auto non cambiano; i students' books neppure."), "Don't e l'auto non cambiano; i students' books neppure.");
});
