// Home: scelta della fascia, testi (titolo <= 3 parole, riga <= 10), pulsante principale, chip di variazione, ordine delle aree, scala del grafico.
import test from 'node:test';
import assert from 'node:assert/strict';
import { calcolaStima, serieStime, livelloDi, type Fattore, type PuntoStima } from '../../src/components/home/stima';
import { chiaveBanner, testiFascia, rigaSaluto, ctaPrincipale, variazioneDaPrima, areeOrdinate, nomeArea, scalaGrafico, type ChiaveBanner } from '../../src/components/home/stato';
import { statoVuoto, simulazione } from './aiuti';

const diag = (dc: number) => ({ completedAt: 1, hasCertification: false, hasOfa: 'unknown' as const, diagnosticCorrect: dc, diagnosticTotal: 10 });
const parole = (t: string) => t.split(/\s+/).filter(x => /[A-Za-zÀ-ÿ]/.test(x)).length;
const f = (filtro: string, nome: string, risposte: number, percento: number | null): Fattore => ({ id: filtro, nome, filtro, risposte, percento });

test('fascia: nuovo, in partenza, da migliorare, vicino, in linea', () => {
  assert.equal(chiaveBanner(null, 'basso'), 'nuovo');
  const d7 = calcolaStima(statoVuoto({ onboarding: diag(7) }))!;          // 18 %: solo diagnostico sotto il 20 %
  assert.equal(chiaveBanner(d7, livelloDi(d7.p)), 'partenza');
  const d8 = calcolaStima(statoVuoto({ onboarding: diag(8) }))!;          // 36 %
  assert.equal(chiaveBanner(d8, livelloDi(d8.p)), 'margine');
  const d9 = calcolaStima(statoVuoto({ onboarding: diag(9) }))!;          // 62 %
  assert.equal(chiaveBanner(d9, livelloDi(d9.p)), 'soglia');
  const d10 = calcolaStima(statoVuoto({ onboarding: diag(10) }))!;        // 87 %
  assert.equal(chiaveBanner(d10, livelloDi(d10.p)), 'strada');
  const conSim = calcolaStima(statoVuoto({ onboarding: diag(7), history: [simulazione({ date: 5, esatte: 10 }), simulazione({ date: 6, esatte: 12 })] }))!;
  assert.equal(chiaveBanner(conSim, livelloDi(conSim.p)), 'margine', 'dopo le simulazioni non si dice più «in partenza»');
});

test('testi della fascia: titolo di al massimo 3 parole, riga di al massimo 10, nessuna parola vietata', () => {
  const stime = [null, ...[7, 8, 9, 10].map(c => calcolaStima(statoVuoto({ onboarding: diag(c) }))!)];
  const chiavi: ChiaveBanner[] = ['nuovo', 'partenza', 'margine', 'soglia', 'strada'];
  for (const k of chiavi) for (const s of stime) for (const aree of [true, false]) {
    const { titolo, riga } = testiFascia(k, s, aree);
    assert.ok(parole(titolo) <= 3, `titolo: ${titolo}`);
    assert.ok(parole(riga) <= 10, `riga: ${riga}`);
    assert.doesNotMatch(titolo + ' ' + riga, /rischio|fallimento|Pass|Sblocca|beta|presto|in arrivo/i);
  }
  assert.ok(chiavi.every(k => parole(rigaSaluto(k)) <= 5));
});

test('riga del vicino alla soglia: il punteggio probabile viene dall\'intervallo vero', () => {
  const s = calcolaStima(statoVuoto({ onboarding: diag(9) }))!;
  const { riga } = testiFascia('soglia', s, true);
  assert.match(riga, /^Punteggio probabile (tra \d+ e \d+|\d+) su 30, soglia 25\.$/);
});

test('pulsante principale: cambia con lo stato e dice cosa fa', () => {
  const basso = calcolaStima(statoVuoto({ onboarding: diag(8) }))!;
  const alto = calcolaStima(statoVuoto({ onboarding: diag(10) }))!;
  assert.deepEqual(ctaPrincipale(null, 'basso', true, true).azione, 'diagnostico');
  assert.equal(ctaPrincipale(null, 'basso', true, true).etichetta, 'Fai il test iniziale');
  assert.equal(ctaPrincipale(null, 'basso', false, true).azione, 'allenamento', 'senza diagnostico disponibile si allena');
  assert.equal(ctaPrincipale(basso, 'basso', true, true).azione, 'allenamento');
  assert.match(ctaPrincipale(basso, 'basso', true, true).etichetta, /^Continua l.allenamento$/);
  const a = ctaPrincipale(alto, 'alto', true, true);
  assert.equal(a.azione, 'simulazione');
  assert.equal(a.etichetta, 'Fai una simulazione');
  assert.equal(a.sotto, '30 domande, 15 minuti');
  assert.equal(ctaPrincipale(alto, 'alto', true, false).azione, 'allenamento', 'senza la funzione si ripiega sull\'allenamento');
  for (const c of [ctaPrincipale(null, 'basso', true, true), ctaPrincipale(basso, 'basso', true, true), a]) assert.ok(parole(c.sotto) <= 5);
});

test('chip di variazione: solo con due misure e una differenza; direzione e prima stima vere', () => {
  const p = (x: number): PuntoStima => ({ p: x, nome: 'x', tipo: 'diagnostico' });
  assert.equal(variazioneDaPrima([]), null);
  assert.equal(variazioneDaPrima([p(0.4)]), null);
  assert.equal(variazioneDaPrima([p(0.4), p(0.401)]), null, 'stessa percentuale: nessun chip');
  assert.equal(variazioneDaPrima([p(0.18), p(0.17)]), null, 'un solo punto di differenza: nessun chip');
  assert.deepEqual(variazioneDaPrima([p(0.18), p(0.2), p(0.41)]), { da: 18, verso: 'su' });
  assert.deepEqual(variazioneDaPrima([p(0.62), p(0.51)]), { da: 62, verso: 'giu' });
  // la serie vera: la prima è il diagnostico
  const tutti = serieStime(statoVuoto({ onboarding: diag(7), history: [simulazione({ date: 5, esatte: 28 })] }), 0);
  const v = variazioneDaPrima(tutti)!;
  assert.equal(v.da, Math.round(tutti[0].p * 100));
  assert.equal(v.verso, 'su');
});

test('aree: prima quelle con dati dalla più debole, poi senza dati; i livelli si chiamano «Livello»', () => {
  const cat = [f('category:Grammatica', 'Grammatica', 40, 70), f('category:Traduzione', 'Traduzione', 3, null)];
  const liv = [f('level:A1', 'A1', 20, 35), f('level:A2', 'A2', 30, 70), f('level:B1', 'B1', 10, 90)];
  const o = areeOrdinate(cat, liv);
  assert.deepEqual(o.map(x => x.nome), ['A1', 'Grammatica', 'A2', 'B1', 'Traduzione']); // 35, 70 (più risposte), 70, 90, senza dati
  assert.equal(nomeArea(o[0]), 'Livello A1');
  assert.equal(nomeArea(o[1]), 'Grammatica');
  assert.equal(o.length, 5);
  assert.deepEqual(areeOrdinate([f('category:Grammatica', 'Grammatica', 0, null)], []).map(x => x.percento), [null]);
});

test('scala del grafico: min-10 .. max+10, tra 0 e 100, larga almeno 30', () => {
  assert.deepEqual(scalaGrafico([]), { lo: 0, hi: 100 });
  assert.deepEqual(scalaGrafico([20, 80]), { lo: 10, hi: 90 });
  const stretta = scalaGrafico([54, 51]);                       // 41..64 = 23 punti: si allarga a 30 attorno al centro
  assert.ok(stretta.hi - stretta.lo >= 30 - 1e-9);
  assert.ok(stretta.lo <= 51 && stretta.hi >= 54);
  const basso = scalaGrafico([1, 2]);
  assert.equal(basso.lo, 0); assert.ok(basso.hi - basso.lo >= 30 - 1e-9);
  const alto = scalaGrafico([98, 99]);
  assert.equal(alto.hi, 100); assert.ok(alto.hi - alto.lo >= 30 - 1e-9);
  for (const v of [[0], [100], [50, 50], [3, 97]]) { const s = scalaGrafico(v); assert.ok(s.lo >= 0 && s.hi <= 100 && s.hi > s.lo); }
});
