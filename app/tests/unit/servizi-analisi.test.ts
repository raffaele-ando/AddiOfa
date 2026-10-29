// Analisi del livello (lib/servizi/analisi.ts): numeri verificabili a mano su stati costruiti apposta.
import test from 'node:test';
import assert from 'node:assert/strict';
import { analisiArgomenti, analizzaLivello, argomentiRadar, descriviFonte, MIN_RISPOSTE_ARGOMENTO, SOGLIA_DA_MIGLIORARE } from '../../src/lib/servizi/analisi';
import { questions } from '../../src/data/questions';
import { theoryTopics } from '../../src/data/theory';
import { calcolaStima } from '../../src/components/home/stima';
import { statoVuoto, simulazione } from './aiuti';
import type { AppState } from '../../src/types';

const diag = (dc: number, dt = 10) => ({ completedAt: 1, hasCertification: false, hasOfa: 'unknown' as const, diagnosticCorrect: dc, diagnosticTotal: dt });

/** Stato con `esatte` e `errate` risposte distribuite sulle domande di un argomento. */
function conRisposte(s: AppState, theoryId: string, esatte: number, errate: number): AppState {
  const qs = questions.filter(q => q.theoryId === theoryId);
  assert.ok(qs.length > 0, `ci sono domande per ${theoryId}`);
  const stats = { ...s.stats };
  for (let i = 0; i < esatte + errate; i++) {
    const q = qs[i % qs.length];
    const prec = stats[q.id] ?? { correct: 0, incorrect: 0, lastSeen: 1, box: 0 };
    stats[q.id] = i < esatte ? { ...prec, correct: prec.correct + 1 } : { ...prec, incorrect: prec.incorrect + 1 };
  }
  return { ...s, stats };
}

test('utente senza dati: nessuna stima, nessun argomento con percentuale, haDati falso', () => {
  const a = analizzaLivello(statoVuoto());
  assert.equal(a.haDati, false);
  assert.equal(a.stima, null);
  assert.equal(a.livelloStima, null);
  assert.equal(a.conDati, 0);
  assert.equal(a.daMigliorare.length, 0);
  assert.equal(a.argomenti.length, theoryTopics.length);
  assert.equal(a.argomenti.length, 31);
  assert.ok(a.argomenti.every(x => x.stato === 'nessun-dato' && x.percento === null && x.risposte === 0));
  assert.deepEqual(a.serie, []);
});

test('percentuale per argomento: solo dalle risposte date, con la soglia minima', () => {
  const id = theoryTopics[0].id;
  let s = conRisposte(statoVuoto(), id, 1, 1); // 2 risposte: pochi dati
  let x = analisiArgomenti(s).find(a => a.id === id)!;
  assert.equal(x.risposte, 2);
  assert.equal(x.percento, null);
  assert.equal(x.stato, 'pochi-dati');

  s = conRisposte(statoVuoto(), id, 6, 2); // 6/8 = 75 %
  x = analisiArgomenti(s).find(a => a.id === id)!;
  assert.equal(x.percento, 75);
  assert.equal(x.stato, 'da-migliorare');
  assert.ok(MIN_RISPOSTE_ARGOMENTO <= 8);
  // gli altri argomenti non sono toccati
  assert.ok(analisiArgomenti(s).filter(a => a.id !== id).every(a => a.risposte === 0));
});

test('un argomento al 100 % è solido; la soglia è inclusa', () => {
  const id = theoryTopics[1].id;
  const solido = analisiArgomenti(conRisposte(statoVuoto(), id, 6, 0)).find(a => a.id === id)!;
  assert.equal(solido.percento, 100);
  assert.equal(solido.stato, 'solido');
  // 17 su 20 = 85 %: esattamente alla soglia, non da migliorare
  const alla = analisiArgomenti(conRisposte(statoVuoto(), id, 17, 3)).find(a => a.id === id)!;
  assert.equal(alla.percento, SOGLIA_DA_MIGLIORARE);
  assert.equal(alla.stato, 'solido');
});

test('le risposte omesse non sono errori di conoscenza', () => {
  const id = theoryTopics[0].id;
  const q = questions.find(x => x.theoryId === id)!;
  const s = statoVuoto({ stats: { [q.id]: { correct: 4, incorrect: 0, omitted: 9, lastSeen: 1, box: 0 } } });
  const x = analisiArgomenti(s).find(a => a.id === id)!;
  assert.equal(x.risposte, 4);
  assert.equal(x.percento, 100);
});

test('aree da migliorare: ordinate dalla più debole, solo con dati sufficienti', () => {
  const [a, b, c, d] = theoryTopics.map(t => t.id);
  let s = conRisposte(statoVuoto(), a, 5, 5);   // 50 %
  s = conRisposte(s, b, 7, 3);                  // 70 %
  s = conRisposte(s, c, 9, 1);                  // 90 % solido
  s = conRisposte(s, d, 0, 2);                  // 0 % ma solo 2 risposte: non entra
  const an = analizzaLivello(s);
  assert.deepEqual(an.daMigliorare.map(x => x.id), [a, b]);
  assert.equal(an.conDati, 3);
  assert.equal(an.haDati, true);
  assert.equal(an.stima, null, 'senza diagnostico né simulazioni la stima non c\'è, anche se ci sono risposte');
});

test('la stima dell\'analisi è quella della home, con intervallo e serie', () => {
  const s = statoVuoto({ onboarding: diag(8), history: [simulazione({ date: 5, esatte: 22 })] });
  const an = analizzaLivello(s);
  const home = calcolaStima(s)!;
  assert.equal(an.stima!.p, home.p);
  assert.ok(an.stima!.intervallo.probabilita.min <= home.p && home.p <= an.stima!.intervallo.probabilita.max);
  assert.equal(an.serie.length, 2);
  assert.equal(an.serie[an.serie.length - 1].p, home.p, 'l\'ultimo punto della serie coincide con la stima');
  assert.ok(an.livelloStima);
});

test('radar: servono almeno 3 argomenti con dati; si scelgono quelli con più risposte, nell\'ordine della teoria', () => {
  const ids = theoryTopics.map(t => t.id);
  let s = statoVuoto();
  s = conRisposte(s, ids[0], 4, 0);
  s = conRisposte(s, ids[1], 4, 0);
  assert.deepEqual(argomentiRadar(analisiArgomenti(s)), [], 'due assi non fanno un radar');
  s = conRisposte(s, ids[2], 3, 0);
  assert.equal(argomentiRadar(analisiArgomenti(s)).length, 3);

  // 10 argomenti con dati: ne restano 8, i più risposti
  let g = statoVuoto();
  for (let i = 0; i < 10; i++) g = conRisposte(g, ids[i], i < 2 ? 3 : 6, 0); // i primi due hanno meno risposte
  const radar = argomentiRadar(analisiArgomenti(g));
  assert.equal(radar.length, 8);
  assert.ok(!radar.some(r => r.id === ids[0] || r.id === ids[1]));
  const posizioni = radar.map(r => ids.indexOf(r.id));
  assert.deepEqual(posizioni, [...posizioni].sort((x, y) => x - y), 'ordine della teoria');
});

test('descrizione della fonte: una frase per ogni caso', () => {
  const solo = calcolaStima(statoVuoto({ onboarding: diag(8) }))!;
  assert.match(descriviFonte(solo), /test di livello/);
  const sim = calcolaStima(statoVuoto({ history: [simulazione({ id: 'a', date: 1, esatte: 20 })] }))!;
  assert.match(descriviFonte(sim), /simulazioni/);
  const ent = calcolaStima(statoVuoto({ onboarding: diag(8), history: [simulazione({ date: 5, esatte: 22 })] }))!;
  assert.match(descriviFonte(ent), /insieme/);
});

test('dati rovinati non fanno cadere l\'analisi', () => {
  const s = statoVuoto({ stats: { q1: { correct: NaN, incorrect: -3, lastSeen: 1, box: 0 } as never } });
  const an = analizzaLivello(s);
  assert.equal(an.argomenti.length, 31);
  assert.ok(an.argomenti.every(a => Number.isFinite(a.risposte)));
});
