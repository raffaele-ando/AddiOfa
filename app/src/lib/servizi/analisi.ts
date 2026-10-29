// Analisi del livello: tutto calcolato sui dati veri dell'utente (appState), nessun numero inventato e nessun confronto con altri.
// Riusa il modello della home (components/home/stima.ts): la stima, i fattori e la serie delle stime sono gli stessi che vede in Home.
import type { AppState } from '../../types';
import { questions } from '../../data/questions';
import { theoryTopics } from '../../data/theory';
import { isLearned } from '../spacedRepetition';
import {
  calcolaFattori, calcolaStima, livelloDi, serieStime,
  type Fattore, type Livello, type PuntoStima, type Stima,
} from '../../components/home/stima';

/** Risposte minime su un argomento perché la percentuale si mostri come tale (come in lezioneConsigliata). */
export const MIN_RISPOSTE_ARGOMENTO = 3;
/** Sotto questa percentuale, con risposte sufficienti, un argomento è «da migliorare» (stessa soglia di lezioneConsigliata). */
export const SOGLIA_DA_MIGLIORARE = 85;
/** Quanti assi al massimo ha il radar: oltre, le etichette non si leggono. */
export const ASSI_RADAR = 8;

export type StatoArgomento = 'nessun-dato' | 'pochi-dati' | 'da-migliorare' | 'solido';

export interface ArgomentoAnalisi {
  id: string;
  titolo: string;
  /** Nome breve (quello usato nelle domande): per le etichette del radar. */
  nome: string;
  livello: 'A1' | 'A2' | 'B1';
  /** Risposte date (esatte + errate; le omesse non sono errori di conoscenza). */
  risposte: number;
  corrette: number;
  /** 0-100, solo con almeno MIN_RISPOSTE_ARGOMENTO risposte. */
  percento: number | null;
  imparate: number;
  totaleDomande: number;
  stato: StatoArgomento;
}

export interface AnalisiLivello {
  /** C'è qualcosa da analizzare: una stima o almeno una risposta data. */
  haDati: boolean;
  stima: Stima | null;
  livelloStima: Livello | null;
  argomenti: ArgomentoAnalisi[];
  /** Argomenti da migliorare, dal più debole, con le risposte date a farne dato affidabile. */
  daMigliorare: ArgomentoAnalisi[];
  /** Argomenti con dati sufficienti (percento != null). */
  conDati: number;
  fattori: ReturnType<typeof calcolaFattori>;
  serie: PuntoStima[];
}

const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, v) : 0);

const stat = (percento: number | null, risposte: number): StatoArgomento =>
  risposte === 0 ? 'nessun-dato' : percento === null ? 'pochi-dati' : percento < SOGLIA_DA_MIGLIORARE ? 'da-migliorare' : 'solido';

/** Accuratezza, domande imparate e stato per ognuno dei 31 argomenti di teoria, nell'ordine della teoria. */
export function analisiArgomenti(stato: AppState): ArgomentoAnalisi[] {
  const per = new Map<string, { c: number; t: number; imparate: number; domande: number }>();
  for (const q of questions) {
    if (!q.theoryId) continue;
    const r = per.get(q.theoryId) ?? { c: 0, t: 0, imparate: 0, domande: 0 };
    r.domande++;
    const s = stato.stats?.[q.id];
    if (s) {
      const c = num(s.correct);
      r.c += c; r.t += c + num(s.incorrect);
      if (isLearned(s)) r.imparate++;
    }
    per.set(q.theoryId, r);
  }
  return theoryTopics.map(t => {
    const r = per.get(t.id) ?? { c: 0, t: 0, imparate: 0, domande: 0 };
    const percento = r.t >= MIN_RISPOSTE_ARGOMENTO ? Math.round((r.c / r.t) * 100) : null;
    return {
      id: t.id, titolo: t.titolo, nome: t.grammarTopic, livello: t.livello,
      risposte: r.t, corrette: r.c, percento, imparate: r.imparate, totaleDomande: r.domande,
      stato: stat(percento, r.t),
    };
  });
}

/**
 * Gli argomenti del radar: quelli con dati sufficienti, al massimo `max`, scegliendo quelli su cui si è risposto di più
 * (sono i dati più affidabili), nell'ordine della teoria. Con meno di 3 assi un radar non ha forma: lista vuota.
 */
export function argomentiRadar(argomenti: readonly ArgomentoAnalisi[], max = ASSI_RADAR): ArgomentoAnalisi[] {
  const scelti = argomenti.filter(a => a.percento !== null)
    .map((a, i) => ({ a, i }))
    .sort((x, y) => y.a.risposte - x.a.risposte || x.i - y.i)
    .slice(0, max)
    .sort((x, y) => x.i - y.i)
    .map(x => x.a);
  return scelti.length >= 3 ? scelti : [];
}

export function analizzaLivello(stato: AppState): AnalisiLivello {
  const argomenti = analisiArgomenti(stato);
  const stima = calcolaStima(stato);
  const fattori = calcolaFattori(stato);
  const daMigliorare = argomenti.filter(a => a.stato === 'da-migliorare')
    .sort((a, b) => (a.percento ?? 0) - (b.percento ?? 0) || b.risposte - a.risposte);
  return {
    haDati: stima !== null || fattori.risposteTotali > 0,
    stima,
    livelloStima: stima ? livelloDi(stima.p) : null,
    argomenti,
    daMigliorare,
    conDati: argomenti.filter(a => a.percento !== null).length,
    fattori,
    serie: serieStime(stato, 6),
  };
}

/** Quello che entra nella stima, in parole: per la sezione «Cosa pesa sulla stima». */
export function descriviFonte(stima: Stima): string {
  if (stima.fonte === 'diagnostico') return 'Solo il test di livello: dieci risposte sono poche, per questo l\'intervallo è largo.';
  if (stima.fonte === 'simulazioni') return 'Le tue ultime simulazioni (il test di livello non entra più, perché è più vecchio e meno preciso).';
  return 'Il test di livello e le tue simulazioni insieme.';
}

export type { Fattore };
