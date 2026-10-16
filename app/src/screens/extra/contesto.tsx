import { createContext, useCallback, useContext, type ReactNode } from 'react';
import type { AppState, LegalSection } from '../../types';

/**
 * Contratto tra l'App e le schermate «extra» (profilo, sfide, frasi, esplora...): ogni schermata è un componente senza props
 * che legge tutto da `useExtra()`. Così le schermate si scrivono e si provano da sole, senza toccare App.tsx.
 * Navigazione: `vai('id', {param: 'valore'})` apre un'altra schermata extra (e `indietro()` torna alla precedente);
 * `params` sono i parametri della schermata corrente. Dati propri: `useExtraDati('chiave', iniziale)` salva dentro
 * appState.extra[chiave] (resta su questo dispositivo, entra nell'esportazione dei progressi).
 */
export interface ExtraCtx {
  /** Progressi dell'utente (solo lettura). */
  appState: AppState;
  /** Aggiorna e salva lo stato: `aggiorna(s => ({ ...s, extra: {...} }))`. */
  aggiorna: (fn: (s: AppState) => AppState) => void;
  pass: boolean;
  demo: boolean;
  /** Id della schermata extra corrente e suoi parametri. */
  id: string;
  params: Record<string, string>;
  vai: (id: string, params?: Record<string, string>) => void;
  indietro: () => void;
  // aperture di altre parti dell'app
  apriPaywall: () => void;
  apriTeoria: (topicId?: string) => void;
  apriImpostazioni: () => void;
  apriLegale: (s: LegalSection) => void;
  apriInviti: () => void;
  apriLanding: () => void;
  /** Avvia una sessione di studio (stesse modalità della schermata Esercizi). */
  avviaEsercizi: (modo: 'smart' | 'weakness' | 'blitz' | 'category' | 'recall' | 'standard', categoria?: string) => void;
  avviaSimulazione: () => void;
  vaiHome: () => void;
  avviaDiagnostico: () => void;
}

const Ctx = createContext<ExtraCtx | null>(null);

export function ExtraProvider({ valore, children }: { valore: ExtraCtx; children: ReactNode }) {
  return <Ctx.Provider value={valore}>{children}</Ctx.Provider>;
}

export function useExtra(): ExtraCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useExtra fuori da ExtraProvider');
  return c;
}

/** Un dato proprio di una schermata, salvato in appState.extra[chiave]. */
export function useExtraDati<T>(chiave: string, iniziale: T): [T, (v: T | ((p: T) => T)) => void] {
  const { appState, aggiorna } = useExtra();
  const letto = (appState.extra?.[chiave] as T | undefined) ?? iniziale;
  const scrivi = useCallback((v: T | ((p: T) => T)) => {
    aggiorna(s => {
      const prec = (s.extra?.[chiave] as T | undefined) ?? iniziale;
      const nuovo = typeof v === 'function' ? (v as (p: T) => T)(prec) : v;
      return { ...s, extra: { ...(s.extra ?? {}), [chiave]: nuovo } };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggiorna, chiave]);
  return [letto, scrivi];
}
