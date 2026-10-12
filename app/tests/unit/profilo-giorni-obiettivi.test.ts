// Profilo: giorni di studio, calendario, attività e obiettivi. Date costruite in fuso locale: i test non dipendono dal fuso.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  registroGiorni, riassuntoStudio, formatoDurata, meseCalendario, spostaMese, ultimiGiorniAttivita, totaliPeriodo,
  leggiData, giornoStudiato, giornoVuoto, SECONDI_MINIMI_GIORNO,
} from '../../src/lib/profilo/giorni';
import {
  normalizzaObiettivi, giorniMancanti, avanzamentoGiornaliero, giorniConObiettivo, avanzamentoStima, OBIETTIVI_INIZIALI,
} from '../../src/lib/profilo/obiettivi';
import { simulazioniRecenti } from '../../src/lib/profilo/attivita';
import { chiaveGiorno } from '../../src/lib/utils';
import { statoVuoto, simulazione } from './aiuti';

const OGGI = new Date(2026, 9, 12, 15, 30); // 12 ottobre 2026, lunedì

test('leggiData accetta solo date vere', () => {
  assert.equal(leggiData('2026-02-31'), null);
  assert.equal(leggiData('2026-2-3'), null);
  assert.equal(leggiData('boh'), null);
  assert.equal(chiaveGiorno(leggiData('2026-10-12')!), '2026-10-12');
});

test('registro: unisce risposte, secondi e simulazioni per giorno; ignora chiavi e numeri non validi', () => {
  const stato = statoVuoto({
    dailyActivity: { '2026-10-10': 12, '2026-10-11': 0, 'rotto': 5, '2026-10-12': NaN as unknown as number },
    dailyTimeSpent: { '2026-10-10': 300, '2026-10-09': 30 },
    history: [simulazione({ date: new Date(2026, 9, 10, 18).getTime(), esatte: 26 }), simulazione({ id: 'b', date: new Date(2026, 9, 10, 9).getTime(), esatte: 10 })],
  });
  const r = registroGiorni(stato);
  assert.deepEqual([...r.keys()].sort(), ['2026-10-09', '2026-10-10']);
  assert.deepEqual(r.get('2026-10-10'), { data: '2026-10-10', domande: 12, secondi: 300, simulazioni: 2 });
  assert.equal(giornoStudiato(r.get('2026-10-09')!), false, '30 secondi non bastano');
  const ris = riassuntoStudio(stato);
  assert.deepEqual(ris, { giorniDiStudio: 1, secondiTotali: 330, domandeTotali: 12, simulazioni: 2 });
});

test('un giorno di studio: una risposta, una simulazione o un minuto', () => {
  assert.equal(giornoStudiato(giornoVuoto('x')), false);
  assert.equal(giornoStudiato({ ...giornoVuoto('x'), secondi: SECONDI_MINIMI_GIORNO }), true);
  assert.equal(giornoStudiato({ ...giornoVuoto('x'), domande: 1 }), true);
  assert.equal(giornoStudiato({ ...giornoVuoto('x'), simulazioni: 1 }), true);
});

test('formatoDurata', () => {
  assert.equal(formatoDurata(0), '0 min');
  assert.equal(formatoDurata(20), 'meno di 1 min');
  assert.equal(formatoDurata(35 * 60), '35 min');
  assert.equal(formatoDurata(3600), '1 h');
  assert.equal(formatoDurata(2 * 3600 + 5 * 60), '2 h 05 min');
});

test('calendario: ottobre 2026 parte di giovedì, settimane da lunedì a domenica, 5 righe', () => {
  const registro = registroGiorni(statoVuoto({ dailyActivity: { '2026-10-05': 3, '2026-10-12': 8, '2026-09-30': 2 } }));
  const m = meseCalendario(2026, 9, registro, OGGI, '2026-10-20');
  assert.equal(m.etichetta, 'Ottobre 2026');
  assert.equal(m.settimane.length, 5);
  assert.ok(m.settimane.every(s => s.length === 7));
  const prima = m.settimane[0];
  assert.deepEqual(prima.map(c => c.giorno), [28, 29, 30, 1, 2, 3, 4]);
  assert.deepEqual(prima.map(c => c.delMese), [false, false, false, true, true, true, true]);
  assert.equal(prima[2].studiato, true, 'il 30 settembre ha dati anche se è fuori dal mese');
  const tutte = m.settimane.flat();
  const get = (g: number) => tutte.find(c => c.delMese && c.giorno === g)!;
  assert.equal(get(5).studiato, true);
  assert.equal(get(6).studiato, false);
  assert.equal(get(12).oggi, true);
  assert.equal(get(13).futuro, true);
  assert.equal(get(12).futuro, false);
  assert.equal(get(20).test, true);
  assert.equal(tutte.filter(c => c.test).length, 1);
  assert.equal(tutte.filter(c => c.oggi).length, 1);
});

test('calendario: mesi che iniziano di lunedì e di domenica, febbraio di 4 righe', () => {
  const vuoto = new Map();
  const feb2027 = meseCalendario(2027, 1, vuoto, OGGI); // 1 febbraio 2027 è lunedì: 28 giorni = 4 righe
  assert.equal(feb2027.settimane.length, 4);
  assert.equal(feb2027.settimane[0][0].giorno, 1);
  assert.ok(feb2027.settimane.flat().every(c => c.delMese));
  const nov2026 = meseCalendario(2026, 10, vuoto, OGGI); // 1 novembre 2026 è domenica
  assert.equal(nov2026.settimane[0][6].giorno, 1);
  assert.equal(nov2026.settimane[0][0].giorno, 26);
  assert.equal(nov2026.settimane.length, 6); // domenica + 30 giorni = 36 celle
  assert.equal(meseCalendario(2026, 7, vuoto, OGGI).settimane.length, 6); // 1 agosto 2026 è sabato: 6 righe
});

test('spostaMese attraversa gli anni', () => {
  assert.deepEqual(spostaMese(2026, 11, 1), { anno: 2027, mese: 0 });
  assert.deepEqual(spostaMese(2026, 0, -1), { anno: 2025, mese: 11 });
  assert.deepEqual(spostaMese(2026, 5, 0), { anno: 2026, mese: 5 });
});

test('ultimi giorni: ordine dal più vecchio, oggi compreso, minuti arrotondati', () => {
  const stato = statoVuoto({ dailyActivity: { '2026-10-12': 7, '2026-10-10': 3 }, dailyTimeSpent: { '2026-10-12': 650 } });
  const g = ultimiGiorniAttivita(registroGiorni(stato), OGGI, 7);
  assert.equal(g.length, 7);
  assert.equal(g[0].data, '2026-10-06');
  assert.equal(g[6].data, '2026-10-12');
  assert.equal(g[6].lettera, 'L');
  assert.equal(g[6].minuti, 11);
  assert.equal(g[6].domande, 7);
  assert.deepEqual(totaliPeriodo(g), { domande: 10, secondi: 650, simulazioni: 0, giorniDiStudio: 2, giorni: 7 });
  assert.equal(ultimiGiorniAttivita(new Map(), OGGI, 30).length, 30);
});

test('simulazioni recenti: dalla più nuova, con soglia e esito', () => {
  const stato = statoVuoto({ history: [simulazione({ id: 'a', date: 10, esatte: 20 }), simulazione({ id: 'b', date: 30, esatte: 27 }), simulazione({ id: 'c', date: 20, esatte: 25 })] });
  const r = simulazioniRecenti(stato, 2);
  assert.deepEqual(r.map(x => x.id), ['b', 'c']);
  assert.deepEqual(r.map(x => x.superata), [true, true]);
  assert.equal(r[0].soglia, 25);
  assert.equal(simulazioniRecenti(stato)[2].superata, false);
  assert.deepEqual(simulazioniRecenti(statoVuoto()), []);
});

test('obiettivi: valori di partenza e dati rovinati', () => {
  assert.deepEqual(normalizzaObiettivi(undefined), OBIETTIVI_INIZIALI);
  assert.equal(OBIETTIVI_INIZIALI.minutiGiorno, 30);
  assert.equal(OBIETTIVI_INIZIALI.dataTest, null);
  const n = normalizzaObiettivi({ dataTest: '2026-02-31', minutiGiorno: 5000, stimaTarget: 'x' });
  assert.equal(n.dataTest, null);
  assert.equal(n.minutiGiorno, 600);
  assert.equal(n.stimaTarget, 70);
  assert.equal(normalizzaObiettivi({ dataTest: '2026-11-20', minutiGiorno: 45.4, stimaTarget: 99 }).dataTest, '2026-11-20');
  assert.equal(normalizzaObiettivi({ minutiGiorno: 45.4, stimaTarget: 99 }).minutiGiorno, 45);
  assert.equal(normalizzaObiettivi({ stimaTarget: 99 }).stimaTarget, 95);
  assert.equal(normalizzaObiettivi({ minutiGiorno: -3 }).minutiGiorno, 5);
});

test('giorni mancanti al test: futuro, oggi, passato, nessuna data', () => {
  assert.equal(giorniMancanti(null, OGGI), null);
  assert.equal(giorniMancanti('boh', OGGI), null);
  assert.deepEqual(giorniMancanti('2026-10-12', OGGI), { giorni: 0, quando: 'oggi' });
  assert.deepEqual(giorniMancanti('2026-10-13', OGGI), { giorni: 1, quando: 'futuro' });
  assert.deepEqual(giorniMancanti('2026-11-20', OGGI), { giorni: 39, quando: 'futuro' });
  assert.deepEqual(giorniMancanti('2026-10-10', OGGI), { giorni: -2, quando: 'passato' });
  // attraversa il cambio dell'ora legale (25 ottobre 2026): sempre giorni interi
  assert.equal(giorniMancanti('2026-10-26', OGGI)?.giorni, 14);
  assert.equal(giorniMancanti('2027-03-29', new Date(2027, 2, 20, 23, 59))?.giorni, 9);
});

test('obiettivo giornaliero: minuti di oggi contro quelli scelti', () => {
  const stato = statoVuoto({ dailyTimeSpent: { '2026-10-12': 20 * 60, '2026-10-11': 40 * 60, '2026-10-10': 30 * 60 } });
  const a = avanzamentoGiornaliero(stato, OGGI, 30);
  assert.equal(a.secondi, 1200);
  assert.equal(a.obiettivoSecondi, 1800);
  assert.ok(Math.abs(a.quota - 2 / 3) < 1e-9);
  assert.equal(a.raggiunto, false);
  assert.equal(avanzamentoGiornaliero(stato, OGGI, 15).raggiunto, true);
  assert.equal(avanzamentoGiornaliero(stato, OGGI, 15).quota, 1);
  assert.deepEqual(giorniConObiettivo(stato, OGGI, 30), { raggiunti: 2, giorni: 7 });
  assert.equal(avanzamentoGiornaliero(statoVuoto(), OGGI, 30).quota, 0);
});

test('obiettivo di stima: nessuna stima = nessun avanzamento inventato', () => {
  assert.deepEqual(avanzamentoStima(null, 70), { corrente: null, target: 70, quota: 0, raggiunto: false, mancano: 0 });
  assert.equal(avanzamentoStima(NaN, 70).corrente, null);
  const a = avanzamentoStima(0.36, 70);
  assert.equal(a.corrente, 36);
  assert.equal(a.mancano, 34);
  assert.equal(a.raggiunto, false);
  assert.ok(Math.abs(a.quota - 36 / 70) < 1e-9);
  const b = avanzamentoStima(0.88, 70);
  assert.equal(b.raggiunto, true);
  assert.equal(b.mancano, 0);
  assert.equal(b.quota, 1);
});
