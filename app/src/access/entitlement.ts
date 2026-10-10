// Cosa è gratis e cosa richiede il Pass. Funzioni pure: le stesse regole valgono in demo e in produzione.
import { FREE_LIMITS } from '../config/offer';
import type { Entitlement } from './provider';

export type Feature =
  | 'all_questions'
  | 'unlimited_sims'
  | 'sim_teng'
  | 'explanations_it'
  | 'theory_all'
  | 'error_mode'
  | 'full_stats';

export const FEATURE_LABELS: Record<Feature, string> = {
  all_questions: 'Tutte le domande',
  unlimited_sims: 'Simulazioni illimitate',
  sim_teng: 'Simulazioni nel formato TENG',
  explanations_it: 'Spiegazioni in italiano',
  theory_all: 'Teoria di tutti gli argomenti',
  error_mode: 'Ripasso sugli errori',
  full_stats: 'Statistiche complete',
};

export const FREE_ENTITLEMENT: Entitlement = { tier: 'free', source: 'none', expiresAt: null };

export function isPass(e: Entitlement, now: number = Date.now()): boolean {
  return e.tier === 'pass' && (e.expiresAt === null || e.expiresAt > now);
}

/** Vero se la funzione è disponibile. Le funzioni gratuite non passano di qui. */
export function canUse(e: Entitlement, _feature: Feature, now: number = Date.now()): boolean {
  return isPass(e, now);
}

/** Simulazioni gratuite ancora disponibili, dato il numero già fatte. */
export function remainingFreeSims(e: Entitlement, simsDone: number, now: number = Date.now()): number {
  if (isPass(e, now)) return Infinity;
  return Math.max(0, FREE_LIMITS.freeSimulations - simsDone);
}

/** Una simulazione si può avviare con il Pass, oppure se ne resta una gratuita nel formato "ente". */
export function canStartSim(e: Entitlement, format: 'ente' | 'teng', simsDone: number, now: number = Date.now()): boolean {
  if (isPass(e, now)) return true;
  return format === 'ente' && remainingFreeSims(e, simsDone, now) > 0;
}

/** Simulazioni gratuite già usate: quelle nel formato "ente" (lo storico senza formato conta come "ente"). */
export function countFreeSims(history: { format?: string }[]): number {
  return history.filter(h => (h.format ?? 'ente') === 'ente').length;
}
