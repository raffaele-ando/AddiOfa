// NOI, la classifica: gli stati in cui può trovarsi per chi apre la schermata, e i due numeri che l'app calcola (e invia solo a chi ha dato il consenso).
// Niente classifiche inventate: la classifica la dà ATLAS e solo se risponde; qui si decide soltanto quale frase vera dire.
import type { AppState } from '../../types';
import { questions } from '../../data/questions';
import { numeriUtente } from '../profilo/numeri';

export interface IngressiNoi {
  /** ATLAS ha un indirizzo configurato. */
  atlasOnline: boolean;
  /** L'accesso con Google è configurato in questa versione. */
  loginDisponibile: boolean;
  /** C'è un accesso (Project ID) attivo in questo momento. */
  connesso: boolean;
  /** L'utente ha dato il permesso della classifica. */
  inClassifica: boolean;
}

export type StatoNoi = 'non-collegato' | 'senza-accesso' | 'da-accedere' | 'da-aderire' | 'aderito';

/**
 * In che punto è la classifica per questo utente.
 *  - non-collegato: ATLAS non è configurato, non c'è nessuna classifica da leggere;
 *  - senza-accesso: ATLAS c'è ma questa versione non ha l'accesso con Google: si legge la classifica, non si può entrare;
 *  - da-accedere / da-aderire / aderito: i tre passi di chi può entrare.
 */
export function statoNoi(i: IngressiNoi): StatoNoi {
  if (!i.atlasOnline) return 'non-collegato';
  if (!i.loginDisponibile) return 'senza-accesso';
  if (!i.connesso) return 'da-accedere';
  return i.inClassifica ? 'aderito' : 'da-aderire';
}

/** Domande imparate e miglior punteggio in simulazione: la formula che il Worker usa per ordinare (imparate × 100 + miglior simulazione). Dati locali: non sono una posizione.
 *  Stessa fonte di Profilo e Progressi (lib/profilo/numeri.ts): un numero ha un solo valore in tutta l'app. */
export function valoriNoi(stato: AppState): { imparate: number; migliorSimulazione: number } {
  const n = numeriUtente(stato, questions);
  return { imparate: n.imparate, migliorSimulazione: n.migliorSimulazione ?? 0 };
}
