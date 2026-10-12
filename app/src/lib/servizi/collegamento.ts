// Stato onesto del collegamento con il Project ID e della classifica NOI: dice cosa è attivo e cosa no, mai di più.
import type { AppState } from '../../types';
import { countLearned } from '../spacedRepetition';
import { questions } from '../../data/questions';
import type { ScopeId } from '../../config/ecosystem';

export interface IngressiCollegamento {
  /** Versione dimostrativa: niente login, niente rete. */
  demo: boolean;
  /** FEATURE_FLAGS.projectId */
  flagProjectId: boolean;
  /** FEATURE_FLAGS.leaderboard */
  flagClassifica: boolean;
  /** Il Worker ATLAS ha un indirizzo configurato (isAtlasOnline). */
  atlasOnline: boolean;
  /** Permessi dati dall'utente (appState.projectLink), se ha già collegato. */
  permessi?: readonly ScopeId[];
}

export type MotivoSpento = 'demo' | 'flag' | 'atlas';

export interface StatoCollegamento {
  /** Il collegamento al Project ID si può fare ora. */
  attivo: boolean;
  /** Perché non è attivo (in questo ordine: demo, interruttore spento, servizio non raggiungibile). */
  motivo: MotivoSpento | null;
  /** L'utente ha già dato il consenso su questo dispositivo. */
  collegato: boolean;
  /** Ha dato il permesso della classifica. */
  inClassifica: boolean;
}

/** Il Project ID è attivo solo fuori dalla demo, con l'interruttore acceso e il servizio ATLAS configurato. */
export function statoCollegamento(i: IngressiCollegamento): StatoCollegamento {
  const motivo: MotivoSpento | null = i.demo ? 'demo' : !i.flagProjectId ? 'flag' : !i.atlasOnline ? 'atlas' : null;
  const permessi = i.permessi ?? [];
  return {
    attivo: motivo === null,
    motivo,
    collegato: !!i.permessi,
    inClassifica: permessi.includes('noi.leaderboard'),
  };
}

export type StatoNoi = 'demo' | 'project-id-spento' | 'classifica-spenta' | 'atlas' | 'da-collegare' | 'da-aderire' | 'aderito';

/** In che punto è la classifica NOI per questo utente. Ogni stato ha un testo onesto in ProjectId/Noi. */
export function statoNoi(i: IngressiCollegamento): StatoNoi {
  if (i.demo) return 'demo';
  if (!i.flagProjectId) return 'project-id-spento';
  if (!i.flagClassifica) return 'classifica-spenta';
  if (!i.atlasOnline) return 'atlas';
  const s = statoCollegamento(i);
  if (!s.collegato) return 'da-collegare';
  return s.inClassifica ? 'aderito' : 'da-aderire';
}

/**
 * I due numeri che la classifica userebbe, calcolati con la stessa formula con cui l'app li invia ad ATLAS (App.tsx):
 * domande imparate e miglior punteggio in simulazione. Sono dati locali: non dicono nulla sulla posizione.
 */
export function valoriNoi(stato: AppState): { imparate: number; migliorSimulazione: number } {
  const imparate = countLearned(stato.stats, questions.map(q => q.id));
  const punteggi = (Array.isArray(stato.history) ? stato.history : []).map(h => h.score).filter(Number.isFinite);
  return { imparate, migliorSimulazione: Math.max(0, ...punteggi) };
}
