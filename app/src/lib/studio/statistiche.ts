// Numeri della schermata Statistiche: tutti ricavati da appState, nessun dato inventato.
import type { AppState } from '../../types';
import { questions } from '../../data/questions';
import { theoryTopics } from '../../data/theory';
import { isLearned } from '../spacedRepetition';
import { chiaveGiorno } from '../utils';
import { esitoSimulazione } from '../../components/home/stima';
import { ordinaPercorso } from './percorso';

const finito = (n: unknown, ripiego = 0) => (typeof n === 'number' && Number.isFinite(n) ? n : ripiego);

/** Secondi in «4 h 20 min», «35 min», «Meno di 1 min». */
export function formatTempoStudio(secondi: number): string {
  const s = Math.max(0, Math.round(secondi));
  const min = Math.floor(s / 60);
  if (min < 1) return s > 0 ? 'Meno di 1 min' : '0 min';
  const h = Math.floor(min / 60);
  return h > 0 ? `${h} h ${String(min % 60).padStart(2, '0')} min` : `${min} min`;
}

export interface TessereStatistiche {
  /** Risposte date (giuste e sbagliate) a tutte le domande, in allenamento e nelle simulazioni. */
  risposte: number;
  /** Tempo di studio vero: i secondi passati nelle sessioni e nelle simulazioni. */
  secondiStudio: number;
  /** Media delle simulazioni (risposte esatte) e numero di simulazioni; null se non ce ne sono. */
  mediaSimulazioni: { esatte: number; totale: number; quante: number } | null;
  simulazioni: number;
}

export function tessereStatistiche(stato: AppState): TessereStatistiche {
  let risposte = 0;
  for (const s of Object.values(stato.stats ?? {})) risposte += Math.max(0, finito(s?.correct)) + Math.max(0, finito(s?.incorrect));
  let secondiStudio = 0;
  for (const v of Object.values(stato.dailyTimeSpent ?? {})) secondiStudio += Math.max(0, finito(v));
  const sims = (Array.isArray(stato.history) ? stato.history : []).filter(h => h && Number.isFinite(h.date)).map(esitoSimulazione).filter(e => e.totale > 0 && e.date > 0);
  const mediaSimulazioni = sims.length > 0
    ? { esatte: Math.round((sims.reduce((a, e) => a + e.esatte, 0) / sims.length) * 10) / 10, totale: Math.round(sims.reduce((a, e) => a + e.totale, 0) / sims.length), quante: sims.length }
    : null;
  return { risposte, secondiStudio, mediaSimulazioni, simulazioni: sims.length };
}

export interface PuntoSimulazione { numero: number; esatte: number; totale: number; data: number }

/** Risultati delle simulazioni nel tempo (gli ultimi `max`), in ordine di data: solo simulazioni vere con almeno una risposta data. */
export function andamentoSimulazioni(stato: AppState, max = 10): PuntoSimulazione[] {
  const valide = (Array.isArray(stato.history) ? stato.history : [])
    .filter(h => h && Number.isFinite(h.date))
    .sort((a, b) => a.date - b.date)
    .map(h => ({ h, e: esitoSimulazione(h) }))
    .filter(x => x.e.totale > 0 && x.e.date > 0);
  const punti = valide.map((x, i) => ({ numero: i + 1, esatte: x.e.esatte, totale: x.e.totale, data: x.h.date }));
  return max > 0 ? punti.slice(-max) : punti;
}

export interface PadronanzaArgomento {
  id: string;
  titolo: string;
  /** Nome breve: la parte prima dei due punti, o il titolo. */
  nome: string;
  livello: string;
  imparate: number;
  totale: number;
  /** Padronanza: domande imparate su quelle dell'argomento, in %. */
  percento: number;
  /** Risposte date a domande di questo argomento. */
  risposte: number;
}

/** Padronanza per argomento (domande imparate su domande dell'argomento). */
export function padronanzaArgomenti(stato: AppState): PadronanzaArgomento[] {
  return ordinaPercorso(theoryTopics).map(t => {
    const base = questions.filter(q => q.theoryId === t.id);
    let imparate = 0, risposte = 0;
    for (const q of base) {
      const s = stato.stats?.[q.id];
      if (!s) continue;
      if (isLearned(s)) imparate++;
      risposte += Math.max(0, finito(s.correct)) + Math.max(0, finito(s.incorrect));
    }
    const nome = t.titolo.includes(':') ? t.titolo.split(':')[0].trim() : t.titolo;
    return { id: t.id, titolo: t.titolo, nome, livello: t.livello, imparate, totale: base.length, percento: base.length > 0 ? Math.round((imparate / base.length) * 100) : 0, risposte };
  });
}

// ---- Obiettivi impostati dall'utente (scritti dalla schermata Profilo in appState.extra.obiettivi: la forma non è garantita)

export interface ObiettivoVisto {
  id: string;
  titolo: string;
  /** Riga di dettaglio («Migliore: 24 su 25», «Mancano 12 giorni»). */
  dettaglio?: string;
  /** Avanzamento 0-100 se si può calcolare con dati veri. */
  percento?: number;
}

const testo = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const numero = (v: unknown): number | undefined => {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};
const primo = (o: Record<string, unknown>, chiavi: string[]) => { for (const k of chiavi) if (o[k] !== undefined && o[k] !== null && o[k] !== '') return o[k]; return undefined; };

function minutiOggi(stato: AppState): number { return Math.round(finito(stato.dailyTimeSpent?.[chiaveGiorno()]) / 60); }
function domandeOggi(stato: AppState): number { return finito(stato.dailyActivity?.[chiaveGiorno()]); }
function miglioreSimulazione(stato: AppState): number {
  return Math.max(0, ...andamentoSimulazioni(stato, 0).map(p => p.esatte));
}

const GIORNO = 24 * 60 * 60 * 1000;
function giorniAl(data: unknown, ora: number): number | undefined {
  const t = typeof data === 'number' ? data : typeof data === 'string' ? Date.parse(data) : NaN;
  if (!Number.isFinite(t)) return undefined;
  const inizio = new Date(ora); inizio.setHours(0, 0, 0, 0);
  return Math.ceil((t - inizio.getTime()) / GIORNO);
}

const pct = (v: number, t: number) => Math.max(0, Math.min(100, Math.round((v / t) * 100)));

/** Un obiettivo noto per tipo (punteggio, minuti, domande, data del test) con l'avanzamento calcolato dai progressi veri. */
function daTipo(tipo: string, target: number | undefined, dataVal: unknown, titolo: string | undefined, id: string, stato: AppState, ora: number): ObiettivoVisto | null {
  const t = tipo.toLowerCase();
  if (/punt|score|simul/.test(t) && target) {
    const m = miglioreSimulazione(stato);
    return { id, titolo: titolo ?? `Arrivare a ${target} su 30 in simulazione`, dettaglio: andamentoSimulazioni(stato, 0).length ? `La tua migliore: ${m} su 30` : 'Nessuna simulazione ancora', percento: pct(m, target) };
  }
  if (/minut|tempo/.test(t) && target) {
    const m = minutiOggi(stato);
    return { id, titolo: titolo ?? `${target} minuti di studio al giorno`, dettaglio: `Oggi: ${m} min su ${target}`, percento: pct(m, target) };
  }
  if (/doman|quiz|eserciz/.test(t) && target) {
    const n = domandeOggi(stato);
    return { id, titolo: titolo ?? `${target} domande al giorno`, dettaglio: `Oggi: ${n} su ${target}`, percento: pct(n, target) };
  }
  if (/data|test|esame|scaden/.test(t)) {
    const g = giorniAl(dataVal, ora);
    if (g === undefined) return null;
    return { id, titolo: titolo ?? 'Data del test', dettaglio: g > 1 ? `Mancano ${g} giorni` : g === 1 ? 'Manca 1 giorno' : g === 0 ? 'Il test è oggi' : 'Data passata' };
  }
  return null;
}

/**
 * Legge gli obiettivi dell'utente senza fidarsi della forma: un elenco di testi, un elenco di oggetti (titolo, tipo, target),
 * un oggetto con chiavi note (punteggio, minutiAlGiorno, domandeAlGiorno, dataTest) o un contenitore con un elenco dentro.
 * Restituisce [] se non c'è nulla di utilizzabile.
 */
export function leggiObiettivi(extra: Record<string, unknown> | undefined, stato: AppState, ora: number = Date.now()): ObiettivoVisto[] {
  const raw = extra?.obiettivi;
  if (raw === undefined || raw === null) return [];
  const out: ObiettivoVisto[] = [];
  const aggiungi = (o: ObiettivoVisto | null) => { if (o && o.titolo) out.push(o); };

  const daOggetto = (o: Record<string, unknown>, i: number) => {
    const id = testo(o.id) ?? `o${i}`;
    const titolo = testo(primo(o, ['titolo', 'nome', 'testo', 'label', 'descrizione']));
    const tipo = testo(primo(o, ['tipo', 'kind', 'categoria']));
    const target = numero(primo(o, ['target', 'obiettivo', 'valore', 'soglia', 'punteggio', 'quantita']));
    const dataVal = primo(o, ['data', 'dataTest', 'scadenza']);
    if (o.attivo === false) return;
    if (tipo) { const v = daTipo(tipo, target, dataVal, titolo, id, stato, ora); if (v) { aggiungi(v); return; } }
    if (titolo) {
      const attuale = numero(primo(o, ['attuale', 'progresso', 'corrente']));
      aggiungi({ id, titolo, dettaglio: testo(primo(o, ['dettaglio', 'nota'])), percento: target && attuale !== undefined ? pct(attuale, target) : undefined });
    }
  };

  if (Array.isArray(raw)) {
    raw.forEach((v, i) => {
      if (typeof v === 'string') aggiungi({ id: `o${i}`, titolo: v.trim() });
      else if (v && typeof v === 'object') daOggetto(v as Record<string, unknown>, i);
    });
  } else if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    const lista = [o.lista, o.voci, o.elenco, o.items, o.obiettivi].find(Array.isArray) as unknown[] | undefined;
    if (lista) {
      lista.forEach((v, i) => {
        if (typeof v === 'string') aggiungi({ id: `o${i}`, titolo: v.trim() });
        else if (v && typeof v === 'object') daOggetto(v as Record<string, unknown>, i);
      });
    }
    const punteggio = numero(primo(o, ['punteggio', 'punteggioTarget', 'puntiSimulazione', 'target']));
    if (punteggio) aggiungi(daTipo('punteggio', punteggio, undefined, undefined, 'punteggio', stato, ora));
    const minuti = numero(primo(o, ['minutiAlGiorno', 'minutiGiorno', 'minuti']));
    if (minuti) aggiungi(daTipo('minuti', minuti, undefined, undefined, 'minuti', stato, ora));
    const domande = numero(primo(o, ['domandeAlGiorno', 'domandeGiorno', 'domande']));
    if (domande) aggiungi(daTipo('domande', domande, undefined, undefined, 'domande', stato, ora));
    const dataTest = primo(o, ['dataTest', 'dataEsame', 'data']);
    if (dataTest) aggiungi(daTipo('data', undefined, dataTest, 'Il giorno del test', 'data', stato, ora));
  }
  return out;
}
