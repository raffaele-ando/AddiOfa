// Profilo: livello attuale e badge, calcolati dalle domande imparate. Banco finto, numeri verificabili a mano.
import test from 'node:test';
import assert from 'node:assert/strict';
import { livelloAttuale, livelloConNucleo } from '../../src/lib/profilo/livello';
import { BADGE, valutaBadge, argomentiPadroneggiati, type ContestoBadge } from '../../src/lib/profilo/badge';
import { normalizzaProfilo, nomeVisibile, iniziale, NOME_MAX, PROFILO_INIZIALE } from '../../src/lib/profilo/dati';
import { statoVuoto, simulazione, GIORNO } from './aiuti';
import type { UserStats } from '../../src/types';

// 10 domande A1, 10 A2, 10 B1; gli argomenti: t1 (A1, 5 domande), t2 (A1, 5), t3 (A2, 10), t4 (B1, 2: troppo piccolo)
function banco() {
  const out: { id: string; level: string; theoryId?: string }[] = [];
  for (let i = 0; i < 10; i++) out.push({ id: `a1-${i}`, level: 'A1', theoryId: i < 5 ? 't1' : 't2' });
  for (let i = 0; i < 10; i++) out.push({ id: `a2-${i}`, level: 'A2', theoryId: 't3' });
  for (let i = 0; i < 10; i++) out.push({ id: `b1-${i}`, level: 'B1', theoryId: i < 2 ? 't4' : undefined });
  return out;
}
const imparata = { correct: 2, incorrect: 0, lastSeen: 1, box: 2 };
const inCorso = { correct: 1, incorrect: 0, lastSeen: 1, box: 1 };
const imparate = (ids: string[], extra: Partial<UserStats[string]> = {}): UserStats =>
  Object.fromEntries(ids.map(id => [id, { ...imparata, ...extra }]));
const ids = (prefisso: string, da: number, a: number) => Array.from({ length: a - da }, (_, i) => `${prefisso}-${da + i}`);

test('livello: senza domande imparate nessun livello, prossimo A1 con 6 domande da imparare', () => {
  const r = livelloAttuale({}, banco());
  assert.equal(r.livello, null);
  assert.equal(r.prossimo?.livello, 'A1');
  assert.equal(r.mancanti, 6); // 60 % di 10
  assert.deepEqual(r.quote.map(q => q.totale), [10, 10, 10]);
});

test('livello: la soglia è il 60 % e le domande «in corso» non contano', () => {
  const quasi = livelloAttuale({ ...imparate(ids('a1', 0, 5)), ...Object.fromEntries(ids('a1', 5, 10).map(id => [id, inCorso])) }, banco());
  assert.equal(quasi.livello, null, '5 imparate su 10 non bastano, le altre sono solo in corso');
  assert.equal(quasi.mancanti, 1);
  const ok = livelloAttuale(imparate(ids('a1', 0, 6)), banco());
  assert.equal(ok.livello, 'A1');
  assert.equal(ok.prossimo?.livello, 'A2');
  assert.equal(ok.mancanti, 6);
});

test('livello: un livello alto non si raggiunge saltando quelli sotto', () => {
  const r = livelloAttuale(imparate(ids('b1', 0, 10)), banco());
  assert.equal(r.livello, null);
  assert.equal(r.quote.find(q => q.livello === 'B1')?.raggiunto, false);
  const tutto = livelloAttuale(imparate([...ids('a1', 0, 6), ...ids('a2', 0, 6), ...ids('b1', 0, 6)]), banco());
  assert.equal(tutto.livello, 'B1');
  assert.equal(tutto.prossimo, null);
  assert.equal(tutto.mancanti, 0);
});

test('livello: i livelli senza domande nel banco si saltano; il banco vuoto non rompe nulla', () => {
  const soloA1 = banco().filter(q => q.level === 'A1');
  assert.equal(livelloAttuale(imparate(ids('a1', 0, 6)), soloA1).livello, 'A1');
  assert.equal(livelloAttuale(imparate(ids('a1', 0, 6)), soloA1).prossimo, null);
  const vuoto = livelloAttuale(undefined, []);
  assert.equal(vuoto.livello, null);
  assert.equal(vuoto.prossimo, null);
});

test('argomenti: servono almeno 3 domande nel banco e l\'80 % imparate', () => {
  const stats = imparate(['a1-0', 'a1-1', 'a1-2', 'a1-3', 'b1-0', 'b1-1']);
  const r = argomentiPadroneggiati(stats, banco());
  assert.equal(r.possibili, 3, 't4 ha solo 2 domande: non conta');
  assert.equal(r.padroneggiati, 1, 't1: 4 su 5 = 80 %');
  assert.equal(argomentiPadroneggiati(imparate(['a1-0', 'a1-1', 'a1-2']), banco()).padroneggiati, 0, '3 su 5 = 60 %');
});

const ctx = (stato = statoVuoto()): ContestoBadge => ({ stato, pool: banco(), tutte: banco() });
const badge = (stato: ReturnType<typeof statoVuoto>, giaSbloccati: string[] = []) =>
  Object.fromEntries(valutaBadge(ctx(stato), giaSbloccati).map(b => [b.id, b]));

test('badge: stato vuoto = tutto bloccato, con avanzamento a zero e id unici', () => {
  const tutti = valutaBadge(ctx());
  assert.equal(tutti.length, BADGE.length);
  assert.equal(new Set(tutti.map(b => b.id)).size, BADGE.length);
  assert.ok(tutti.every(b => !b.sbloccato && b.quota === 0 && b.avanzamento.length > 0 && b.condizione.length > 0));
});

test('badge: prima domanda e argomento padroneggiato', () => {
  const b = badge(statoVuoto({ stats: imparate(['a1-0', 'a1-1', 'a1-2', 'a1-3', 'a1-4']) }));
  assert.equal(b['prima-domanda'].sbloccato, true);
  assert.equal(b['argomento-1'].sbloccato, true);
  assert.equal(b['argomenti-10'].sbloccato, false);
  assert.equal(b['domande-25'].avanzamento, '5 su 25 domande imparate');
  assert.equal(b['domande-25'].raggiungibile, true);
  assert.equal(b['domande-100'].raggiungibile, false, 'con 30 domande nel banco 100 non si raggiungono');
});

test('badge: simulazioni, solo formato ente; superata = 25 esatte su 30', () => {
  const b = badge(statoVuoto({ history: [simulazione({ date: 1, esatte: 24 }), simulazione({ date: 2, esatte: 25 }), simulazione({ date: 3, esatte: 30, format: 'teng' })] }));
  assert.equal(b['prima-simulazione'].sbloccato, true);
  assert.equal(b['simulazione-superata'].sbloccato, true);
  assert.equal(b['simulazioni-superate-3'].avanzamento, '1 su 3 simulazioni superate', 'il TENG non conta');
  const nessuna = badge(statoVuoto({ history: [simulazione({ date: 1, esatte: 24 })] }));
  assert.equal(nessuna['prima-simulazione'].sbloccato, true);
  assert.equal(nessuna['simulazione-superata'].sbloccato, false);
});

test('badge: sette giorni di studio anche non consecutivi, con dati veri di attività o di tempo', () => {
  const dailyActivity: Record<string, number> = { '2026-10-01': 4, '2026-10-03': 2, '2026-10-05': 9 };
  const dailyTimeSpent: Record<string, number> = { '2026-10-07': 120, '2026-10-09': 600, '2026-10-11': 60, '2026-10-12': 59 };
  const b = badge(statoVuoto({ dailyActivity, dailyTimeSpent }));
  assert.equal(b['giorni-7'].avanzamento, '6 su 7 giorni di studio', '59 secondi non fanno un giorno di studio');
  assert.equal(b['giorni-7'].sbloccato, false);
  dailyTimeSpent['2026-10-12'] = 60;
  assert.equal(badge(statoVuoto({ dailyActivity, dailyTimeSpent }))['giorni-7'].sbloccato, true);
});

test('badge: accuratezza solo con almeno 100 risposte; livelli dal livello vero', () => {
  const poche = statoVuoto({ stats: { x: { correct: 40, incorrect: 0, lastSeen: 1, box: 1 } } });
  assert.equal(badge(poche)['accuratezza-80'].sbloccato, false);
  assert.equal(badge(poche)['accuratezza-80'].avanzamento, '40 su 100 risposte date');
  const buona = statoVuoto({ stats: { x: { correct: 85, incorrect: 15, lastSeen: 1, box: 1 } } });
  assert.equal(badge(buona)['accuratezza-80'].sbloccato, true);
  const scarsa = statoVuoto({ stats: { x: { correct: 70, incorrect: 30, lastSeen: 1, box: 1 } } });
  assert.equal(badge(scarsa)['accuratezza-80'].sbloccato, false);
  const l = badge(statoVuoto({ stats: imparate(ids('a1', 0, 6)) }));
  assert.equal(l['livello-a1'].sbloccato, true);
  assert.equal(l['livello-a2'].sbloccato, false);
  assert.equal(l['livello-a2'].avanzamento, '0 su 6 domande A2 da imparare');
});

test('badge: memoria a lungo termine conta solo domande imparate con intervallo di 7 giorni o più', () => {
  const lunghe = imparate(ids('a1', 0, 10), { interval: 7 });
  assert.equal(badge(statoVuoto({ stats: lunghe }))['memoria-10'].sbloccato, true);
  const corte = imparate(ids('a1', 0, 10), { interval: 6 });
  assert.equal(badge(statoVuoto({ stats: corte }))['memoria-10'].sbloccato, false);
});

test('badge: un badge già visto sbloccato resta sbloccato anche se la domanda torna «in corso»', () => {
  const stato = statoVuoto({ stats: { 'a1-0': { ...inCorso, lastSeen: 1 + GIORNO } } });
  assert.equal(badge(stato)['prima-domanda'].sbloccato, false);
  assert.equal(badge(stato, ['prima-domanda'])['prima-domanda'].sbloccato, true);
});

test('profilo: nome, avatar e corso ripuliti; senza nome è «Studente»', () => {
  assert.deepEqual(normalizzaProfilo(undefined), PROFILO_INIZIALE);
  assert.deepEqual(normalizzaProfilo('boh'), PROFILO_INIZIALE);
  const p = normalizzaProfilo({ nome: '  Anna   Rossi ', avatar: 'sconosciuto', corso: 'x'.repeat(200) });
  assert.equal(p.nome, 'Anna Rossi');
  assert.equal(p.avatar, 'iniziale');
  assert.equal(p.corso.length, 60);
  assert.equal(normalizzaProfilo({ nome: 'y'.repeat(100), avatar: 'successo' }).nome.length, NOME_MAX);
  assert.equal(normalizzaProfilo({ avatar: 'successo' }).avatar, 'successo');
  assert.equal(nomeVisibile(PROFILO_INIZIALE), 'Studente');
  assert.equal(iniziale(PROFILO_INIZIALE), 'S');
  assert.equal(iniziale({ ...PROFILO_INIZIALE, nome: 'élodie' }), 'É');
});

test('livello con Pass: il livello raggiunto sul nucleo non si perde quando il banco si allarga', () => {
  const nucleo = banco().filter(q => q.id.endsWith('-0') || q.id.endsWith('-1') || q.id.endsWith('-2')); // 3 domande per livello
  const tutto = banco();
  const stats = imparate(['a1-0', 'a1-1']); // 2 su 3 = 67 % sul nucleo, 2 su 10 sul banco intero
  assert.equal(livelloAttuale(stats, tutto).livello, null);
  const r = livelloConNucleo(stats, tutto, nucleo);
  assert.equal(r.livello, 'A1');
  assert.equal(r.dalNucleo, true);
  // se il banco intero dà un livello uguale o migliore vale il banco intero
  const molte = imparate(ids('a1', 0, 6));
  const r2 = livelloConNucleo(molte, tutto, nucleo);
  assert.equal(r2.livello, 'A1');
  assert.equal(r2.dalNucleo, false);
  // senza nucleo distinto non cambia nulla
  assert.equal(livelloConNucleo(stats, tutto, tutto).livello, null);
  assert.equal(livelloConNucleo(stats, tutto, []).dalNucleo, false);
});
