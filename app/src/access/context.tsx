// Il Provider React che dà accesso a dati e Pass a tutta l'app. L'implementazione (AccessProvider) la scrive access/AccessProvider.tsx.
import { createContext, useContext } from 'react';
import type { DataProvider, Entitlement, TrackEvent } from './provider';

export interface AccessValue {
  provider: DataProvider;
  entitlement: Entitlement;
  /** Vero se il Pass è attivo ora. */
  pass: boolean;
  /** Simulazioni "ente" già fatte (per il limite della parte gratuita). */
  simsDone: number;
  refresh(): Promise<void>;
  /** Solo demo: sblocca il Pass in prova. */
  unlockDemo(): Promise<void>;
  track(event: TrackEvent): void;
}

export const AccessContext = createContext<AccessValue | null>(null);

export function useAccess(): AccessValue {
  const v = useContext(AccessContext);
  if (!v) throw new Error('useAccess fuori da AccessProvider');
  return v;
}
