// Hook delle schermate di Project: lo stato dell'iscrizione in coda e quello dell'accesso (Project ID).
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { User } from 'firebase/auth';
import { atlas, AtlasErrore, AtlasNonConfigurato, type MeRisposta } from '../../../lib/atlas';
import { coda, type RecordInvio } from '../../../lib/progetto/coda';
import { loginDisponibile, logout, onAuthChange, signInWithGoogle, LoginError } from '../../../lib/firebase';
import { ATLAS_API_URL } from '../../../config/ecosystem';

/** Lo stato dell'invio dell'iscrizione, sempre aggiornato; e fa partire i tentativi automatici finché la schermata è aperta. */
export function useInvio(): RecordInvio | null {
  useEffect(() => { coda.avvia(); }, []);
  return useSyncExternalStore(coda.iscriviti, coda.istantanea, coda.istantanea);
}

export interface StatoAccesso {
  /** Servizio ATLAS configurato in questa versione. */
  atlasOnline: boolean;
  /** «Accedi con Google» è disponibile in questa versione. */
  loginDisponibile: boolean;
  /** Si sta controllando se c'è già un accesso. */
  controllo: boolean;
  utente: User | null;
  /** Risposta di `GET /v1/me`, se connesso e il servizio risponde. */
  me: MeRisposta | null;
  /** Una riga vera sul perché `me` manca o è vecchio (non raggiungibile, errore del servizio). */
  errore: string | null;
  occupato: boolean;
  accedi: () => Promise<boolean>;
  esci: () => Promise<void>;
  ricarica: () => Promise<MeRisposta | null>;
  /** Esegue un'azione sul servizio con gestione dell'errore in una riga di testo. */
  esegui: <T>(fn: () => Promise<T>) => Promise<T | null>;
}

export function messaggioErrore(e: unknown): string {
  if (e instanceof AtlasNonConfigurato) return 'ATLAS non è collegato in questa versione.';
  if (e instanceof AtlasErrore) return e.stato === 0 ? 'ATLAS non risponde. Riprova tra poco.' : e.stato === 401 ? 'L\'accesso è scaduto: accedi di nuovo.' : e.message;
  if (e instanceof LoginError) return e.message;
  return 'Qualcosa non è andato a buon fine. Riprova.';
}

/**
 * L'accesso con Google e il Project ID. Firebase si carica solo se serve: subito se su questo dispositivo c'è già un collegamento
 * (`haCollegamento`), altrimenti solo quando l'utente tocca «Accedi con Google».
 */
export function useAccesso(haCollegamento: boolean): StatoAccesso {
  const [attivo, setAttivo] = useState(haCollegamento);
  const [controllo, setControllo] = useState(haCollegamento && loginDisponibile());
  const [utente, setUtente] = useState<User | null>(null);
  const [me, setMe] = useState<MeRisposta | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [occupato, setOccupato] = useState(false);

  const ricarica = useCallback(async (): Promise<MeRisposta | null> => {
    try {
      const r = await atlas.me();
      setMe(r);
      setErrore(null);
      return r;
    } catch (e) {
      setErrore(messaggioErrore(e));
      return null;
    }
  }, []);

  useEffect(() => {
    if (!attivo || !loginDisponibile()) { setControllo(false); return; }
    return onAuthChange(u => {
      setUtente(u);
      setControllo(false);
      if (u && ATLAS_API_URL) void ricarica(); else setMe(null);
    });
  }, [attivo, ricarica]);

  const esegui = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setOccupato(true);
    setErrore(null);
    try { return await fn(); } catch (e) { setErrore(messaggioErrore(e)); return null; } finally { setOccupato(false); }
  }, []);

  const accedi = useCallback(async () => {
    const u = await esegui(signInWithGoogle);
    if (!u) return false;
    setAttivo(true);
    setUtente(u); // il resto (lettura dell'account) lo fa l'ascolto dei cambi di accesso
    return true;
  }, [esegui, ricarica]);

  const esci = useCallback(async () => {
    await logout();
    setUtente(null);
    setMe(null);
  }, []);

  return { atlasOnline: !!ATLAS_API_URL, loginDisponibile: loginDisponibile(), controllo, utente, me, errore, occupato, accedi, esci, ricarica, esegui };
}
