// Frasi e vocaboli (lib/studio/frasi.ts): le frasi vengono dal banco vero, senza doppioni, segnaposto o risposte sbagliate.
import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, isCoreId } from '../../src/data/questions';
import {
  estraiFrasi, fraseDaDomanda, chiaveFrase, primaFrase, maiuscolaGiusta, filtraFrasi, contaFrasi, statoFrase,
} from '../../src/lib/studio/frasi';
import type { Question } from '../../src/types';

const q = (p: Partial<Question> & Pick<Question, 'id' | 'prompt' | 'options' | 'correctIndex'>): Question => ({ explanation: 'Si usa il Past Simple. Altro.', category: 'Grammatica', ...p });
const frasi = estraiFrasi(questions, isCoreId);

test('dal banco vero esce una frase per quasi ogni domanda, e nessuna domanda è scartata per errore', () => {
  assert.ok(frasi.length >= 600, `solo ${frasi.length} frasi`);
  assert.equal(questions.filter(d => !fraseDaDomanda(d)).length, 0, 'ogni domanda del banco dà una frase');
});

test('nessun doppione (stessa frase scritta uguale a meno di maiuscole e punteggiatura)', () => {
  const viste = new Set<string>();
  for (const f of frasi) {
    const k = chiaveFrase(f.en);
    assert.ok(!viste.has(k), `doppione: ${f.en}`);
    viste.add(k);
  }
  const ids = new Set(frasi.map(f => f.id));
  assert.equal(ids.size, frasi.length, 'id unici');
});

test('nessun segnaposto «___» né puntini né spazi doppi, e ogni frase ha un inglese e un italiano', () => {
  for (const f of frasi) {
    assert.ok(!/_/.test(f.en), `segnaposto in: ${f.en}`);
    assert.ok(!/…|\.\.\./.test(f.en), `puntini in: ${f.en}`);
    assert.ok(!/\s{2,}/.test(f.en), `spazi doppi in: ${f.en}`);
    assert.ok(!/\s[,.!?;:]/.test(f.en), `spazio prima della punteggiatura in: ${f.en}`);
    assert.ok(f.en.length >= 3 && /[A-Za-z]/.test(f.en));
    assert.ok(f.it.length > 0, `senza italiano: ${f.en}`);
  }
});

test('ogni frase è la risposta ESATTA della sua domanda: contiene il testo della risposta giusta e mai solo un distrattore', () => {
  const perId = new Map(questions.map(d => [d.id, d]));
  for (const f of frasi) {
    const d = perId.get(f.id)!;
    const esatta = d.options[d.correctIndex];
    const frase = chiaveFrase(f.en);
    if (d.category === 'Traduzione') assert.equal(frase, chiaveFrase(esatta), `traduzione ${d.id}`);
    else if (esatta.includes('/')) esatta.split('/').forEach(p => assert.ok(frase.includes(chiaveFrase(p.trim())), `${d.id}: manca «${p}»`));
    else assert.ok(frase.includes(chiaveFrase(esatta)), `${d.id}: «${f.en}» non contiene «${esatta}»`);
    // le risposte sbagliate che non sono contenute nella frase giusta non devono comparire come frase intera
    for (const [i, o] of d.options.entries()) {
      if (i === d.correctIndex) continue;
      if (d.category === 'Traduzione' || !/_/.test(d.prompt)) assert.notEqual(chiaveFrase(o), frase, `${d.id}: frase uguale a un distrattore`);
    }
  }
});

test('le traduzioni hanno la frase italiana vera della domanda; la grammatica usa la regola della spiegazione', () => {
  const t = frasi.filter(f => f.itTipo === 'traduzione');
  assert.ok(t.length >= 200);
  const f = frasi.find(x => x.id === 'q4')!;
  assert.equal(f.en, 'August is the hottest month of the year.');
  assert.equal(f.it, "Agosto è il mese più caldo dell'anno.");
  const g = frasi.find(x => x.id === 'q12')!;
  assert.equal(g.itTipo, 'regola');
  assert.ok(g.it.startsWith('Per un’azione') || g.it.startsWith("Per un'azione"));
});

test('riempie i vuoti: uno, due (more / more), maiuscole a metà frase, dialoghi e discorso indiretto', () => {
  const r = (prompt: string, options: string[], correctIndex = 0, extra: Partial<Question> = {}) => fraseDaDomanda(q({ id: 'x', prompt, options, correctIndex, ...extra }))?.en;
  assert.equal(r("Complete the sentence: 'She _____ to Milan last year.'", ['went', 'go']), 'She went to Milan last year.');
  assert.equal(r("Complete the sentence: 'The _____ you practice, the _____ confident you will feel.'", ['more / more', 'less / less']), 'The more you practice, the more confident you will feel.');
  assert.equal(r("Complete the sentence: 'In my town _____ are three cinemas.'", ['There', 'It']), 'In my town there are three cinemas.');
  assert.equal(r('The restaurant _____ we had dinner is expensive.', ['where', 'who']), 'The restaurant where we had dinner is expensive.');
  assert.equal(r("Complete the sentence: 'Where is Paolo?' - 'He has _____ to the shop.'", ['gone', 'went']), 'Where is Paolo? – He has gone to the shop.');
  assert.equal(r("He said, 'I like apples.' -> He said that he _____ apples.", ['liked', 'like']), 'He said that he liked apples.');
  assert.equal(r("Complete: 'This is _____ book.' (me/I/my/mine)", ['my', 'mine']), 'This is my book.');
  assert.equal(r('Which sentence is correct?', ['Is she here?', 'She is here?']), 'Is she here?');
});

test('scarta le domande che non danno una frase completa e sicura', () => {
  const r = (prompt: string, options: string[], category = 'Grammatica') => fraseDaDomanda(q({ id: 'x', prompt, options, correctIndex: 0, category }));
  assert.equal(r("Complete: 'I like _____ tea.'", ['-', 'the']), null, 'risposta senza lettere');
  assert.equal(r("Complete: 'I like _____ tea.'", ['(niente)', 'the']), null, 'risposta tra parentesi');
  assert.equal(r("Complete: 'A _____ B _____ C.'", ['solo una']), null, 'due vuoti con una risposta sola');
  assert.equal(r('Qualcosa di strano', ['x'], 'Altro'), null, 'altra categoria');
  assert.equal(r('Translate: senza apici', ['x'], 'Traduzione'), null, 'traduzione senza la frase italiana');
});

test('doppioni: vince la domanda del nucleo gratuito, poi quella con la traduzione; le altre restano tra le domande collegate', () => {
  const a = q({ id: 'a', prompt: 'Which sentence is correct?', options: ["I don't know them.", 'x'], correctIndex: 0 });
  const b = q({ id: 'b', category: 'Traduzione', prompt: "Translate: 'Non li conosco.'", options: ["I don't know them", 'x'], correctIndex: 0 });
  const unica = estraiFrasi([a, b], () => false);
  assert.equal(unica.length, 1);
  assert.equal(unica[0].id, 'b', 'a parità di nucleo vince la traduzione');
  assert.deepEqual(unica[0].domande, ['b', 'a']);
  const conNucleo = estraiFrasi([a, b], id => id === 'a');
  assert.equal(conNucleo[0].id, 'a', 'il nucleo gratuito vince');
  assert.equal(conNucleo[0].core, true);
});

test('primaFrase: prima frase della spiegazione, senza spezzare dentro le virgolette e con taglio pulito', () => {
  assert.equal(primaFrase("Per chiedere si inverte 'there is' in 'Is there...?'. Poi altro."), "Per chiedere si inverte 'there is' in 'Is there...?'.");
  assert.equal(primaFrase('  Una sola frase  '), 'Una sola frase');
  const lunga = 'parola '.repeat(60);
  const p = primaFrase(lunga, 100);
  assert.ok(p.length <= 101 && p.endsWith('…'));
  assert.equal(primaFrase(''), '');
});

test('maiuscolaGiusta: inizio frase maiuscola, metà frase minuscola solo per parole grammaticali, «I» resta', () => {
  assert.equal(maiuscolaGiusta('there', ''), 'There');
  assert.equal(maiuscolaGiusta('There', 'In my town '), 'there');
  assert.equal(maiuscolaGiusta('Italian', 'He is '), 'Italian');
  assert.equal(maiuscolaGiusta('I', 'Yesterday '), 'I');
  assert.equal(maiuscolaGiusta('where', 'Hello. '), 'Where');
});

test('filtri e conteggi: nucleo gratuito, da ripassare (sbagliate non imparate), già note (imparate), preferite, ricerca', () => {
  const nucleo = frasi.filter(f => f.core);
  assert.ok(nucleo.length >= 90 && nucleo.length <= 100);
  const base = { preferite: new Set<string>(), stats: {}, pass: false };
  assert.equal(filtraFrasi(frasi, { ...base, testo: '', filtro: 'tutte' }).length, nucleo.length, 'senza Pass solo il nucleo');
  assert.equal(filtraFrasi(frasi, { ...base, pass: true, testo: '', filtro: 'tutte' }).length, frasi.length);

  const [a, b, c] = nucleo;
  const stats = {
    [a.domande[0]]: { correct: 0, incorrect: 2, lastSeen: 1, box: 0 },        // sbagliata
    [b.domande[0]]: { correct: 3, incorrect: 0, lastSeen: 1, box: 2 },        // imparata
    [c.domande[0]]: { correct: 2, incorrect: 1, lastSeen: 1, box: 2 },        // sbagliata una volta ma poi imparata
  };
  assert.deepEqual(statoFrase(a, stats), { daRipassare: true, nota: false });
  assert.deepEqual(statoFrase(b, stats), { daRipassare: false, nota: true });
  assert.deepEqual(statoFrase(c, stats), { daRipassare: false, nota: true });
  const r = (filtro: 'da-ripassare' | 'gia-note') => filtraFrasi(frasi, { ...base, stats, testo: '', filtro }).map(f => f.id);
  assert.deepEqual(r('da-ripassare'), [a.id]);
  assert.deepEqual(new Set(r('gia-note')), new Set([b.id, c.id]));
  const pref = new Set([b.id]);
  assert.deepEqual(filtraFrasi(frasi, { ...base, preferite: pref, testo: '', filtro: 'preferite' }).map(f => f.id), [b.id]);
  assert.deepEqual(contaFrasi(frasi, { preferite: pref, stats, pass: false }), { tutte: nucleo.length, preferite: 1, 'da-ripassare': 1, 'gia-note': 2 });

  // ricerca: senza accenti e in inglese o in italiano
  const t = filtraFrasi(frasi, { ...base, pass: true, testo: 'PERCHE', filtro: 'tutte' });
  assert.ok(t.length > 0 && t.every(f => /perche/i.test(`${f.en} ${f.it} ${f.argomento ?? ''}`.normalize('NFD').replace(/[̀-ͯ]/g, ''))));
  assert.equal(filtraFrasi(frasi, { ...base, pass: true, testo: 'zzzzqq', filtro: 'tutte' }).length, 0);
});
