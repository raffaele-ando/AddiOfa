// Dà a tutta l'app il provider dei dati e lo stato del Pass (contratto in context.tsx).
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessContext, type AccessValue } from './context';
import { createProvider } from './createProvider';
import { FREE_ENTITLEMENT, countFreeSims, isPass } from './entitlement';
import type { DataProvider, Entitlement, TrackEvent } from './provider';

interface Props {
  /** Storico delle simulazioni: serve a contare quelle gratuite già fatte. */
  history: { format?: string }[];
  /** Per le prove: provider già pronto al posto di quello scelto dalle variabili di build. */
  provider?: DataProvider;
  children: ReactNode;
}

export function AccessProvider({ history, provider: fornito, children }: Props) {
  const provider = useMemo(() => fornito ?? createProvider(), [fornito]);
  const [entitlement, setEntitlement] = useState<Entitlement>(FREE_ENTITLEMENT);
  const vivo = useRef(true);
  useEffect(() => { vivo.current = true; return () => { vivo.current = false; }; }, []);

  const refresh = useCallback(async () => {
    const e = await provider.getEntitlement().catch(() => FREE_ENTITLEMENT);
    if (vivo.current) setEntitlement(e);
  }, [provider]);

  useEffect(() => { void refresh(); }, [refresh]);

  const track = useCallback((event: TrackEvent) => { try { provider.track(event); } catch { /* le statistiche non bloccano mai */ } }, [provider]);

  const unlockDemo = useCallback(async () => {
    if (!provider.unlockDemo) return;
    await provider.unlockDemo();
    await refresh();
    track({ name: 'pass_unlocked', source: 'demo' });
  }, [provider, refresh, track]);

  const simsDone = useMemo(() => countFreeSims(history), [history]);

  const value = useMemo<AccessValue>(() => ({
    provider, entitlement, pass: isPass(entitlement), simsDone, refresh, unlockDemo, track,
  }), [provider, entitlement, simsDone, refresh, unlockDemo, track]);

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export default AccessProvider;
