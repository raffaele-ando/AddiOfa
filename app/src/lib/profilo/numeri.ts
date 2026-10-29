// I numeri dell'utente, calcolati UNA volta sola e usati da Profilo, Progressi, Obiettivi e NOI.
// Prima ogni schermata faceva i suoi conti e davano risposte diverse («Progressi 41 %» accanto a «0/116», «Risposte 0» accanto a «Media 24/30»).
// Due grandezze con due nomi, in tutta l'app:
//  - «Domande imparate» (`imparate` su `totaleDomande`): quante domande del banco conta isLearned, solo dal ripasso;
//  - «Probabilità» (`probabilita`): la stima di superare il test, che nasce dal test di livello e dalle simulazioni (calcolaStima).
// Le risposte date e le simulazioni sono altre due misure, con il loro nome: «Risposte» (allenamento e simulazioni, dalle statistiche
// delle domande) e «Simulazioni» (quante, miglior punteggio, media). Nessuna misura prende il nome di un'altra.
import type { AppState } from '../../types';
import { calcolaStima, esitoSimulazione, type Stima } from '../../components/home/stima';
import { EXAM } from '../../config/offer';
import { isLearned } from '../spacedRepetition';
import type { DomandaBanco } from './tipi';

export interface NumeriUtente {
  /** Domande del banco che l'utente ha imparato (isLearned). */
  imparate: number;
  /** Domande del banco. */
  totaleDomande: number;
  /** Stima di superare il test (0-1), oppure null se non c'è ancora (serve il test di livello o una simulazione). */
  stima: Stima | null;
  /** La stessa stima in percentuale intera, per scriverla. */
  probabilita: number | null;
  /** Simulazioni valide (con almeno una risposta data). */
  simulazioni: number;
  /** Miglior punteggio in simulazione (risposte esatte su EXAM.questions), null senza simulazioni. */
  migliorSimulazione: number | null;
  /** Media delle esatte nelle simulazioni, con un decimale; null senza simulazioni. */
  mediaSimulazioni: number | null;
  /** Risposte date (giuste e sbagliate) in allenamento e in simulazione. */
  risposte: number;
}

const finito = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, v) : 0);

export function numeriUtente(stato: AppState, banco: readonly DomandaBanco[]): NumeriUtente {
  const stats = stato.stats ?? {};
  let imparate = 0;
  for (const q of banco) if (isLearned(stats[q.id])) imparate++;
  let risposte = 0;
  for (const s of Object.values(stats)) risposte += finito(s?.correct) + finito(s?.incorrect);
  const esatte = (Array.isArray(stato.history) ? stato.history : [])
    .filter(h => h && Number.isFinite(h.date))
    .map(esitoSimulazione)
    .filter(e => e.totale > 0 && e.date > 0)
    .map(e => e.esatte);
  const stima = calcolaStima(stato);
  return {
    imparate,
    totaleDomande: banco.length,
    stima,
    probabilita: stima ? Math.round(Math.min(1, Math.max(0, stima.p)) * 100) : null,
    simulazioni: esatte.length,
    migliorSimulazione: esatte.length ? Math.max(...esatte) : null,
    mediaSimulazioni: esatte.length ? Math.round((esatte.reduce((a, n) => a + n, 0) / esatte.length) * 10) / 10 : null,
    risposte,
  };
}

/** Il test si supera con questo numero di risposte esatte (per scrivere «25 su 30» senza ripeterlo ovunque). */
export const SOGLIA_TEST = EXAM.passMark;
export const DOMANDE_TEST = EXAM.questions;
