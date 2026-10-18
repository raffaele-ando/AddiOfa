// Hook delle schermate di Project: l'accesso (Project ID) e il ritorno dal link inviato per email. Niente parte da solo: Firebase e ATLAS si contattano
// solo dopo un gesto dell'utente, oppure se su questo dispositivo c'è già un Project ID (`haCollegamento`) o si arriva da un link di accesso.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { atlas, AtlasErrore, AtlasNonConfigurato, type MeRisposta } from '../../../lib/atlas';
import { inviaLinkAccesso, loginDisponibile, logout, onAuthChange, signInWithGoogle, LoginError, type EsitoInvioLink, type EsitoRitorno } from '../../../lib/firebase';
import { aggiornaProgetto } from '../../../lib/progetto/profilo';
import { applicaRitornoVerifica } from '../../../lib/progetto/ritorno';
import { sembraLinkDiAccesso } from '../../../lib/progetto/verificaEmail';
import { ATLAS_API_URL, ECOSYSTEM, REQUIRED_SCOPES } from '../../../config/ecosystem';
import type { AppState } from '../../../types';

export interface StatoAccesso {
  /** Servizio ATLAS configurato in questa versione. */
  atlasOnline: boolean;
  /** L'accesso (Google o email) è disponibile in questa versione. */
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
  /** Scrive un link all'indirizzo; l'accesso si completa aprendolo (stesso browser). */
  accediEmail: (email: string) => Promise<EsitoInvioLink>;
  esci: () => Promise<void>;
  ricarica: () => Promise<MeRisposta | null>;
  /** Esegue un'azione sul servizio con gestione dell'errore in una riga di testo. */
  esegui: <T>(fn: () => Promise<T>) => Promise<T | null>;
  /** Sostituisce `me` con la risposta di un'azione (che restituisce già lo stato aggiornato). */
  impostaMe: (m: MeRisposta) => void;
}

export function messaggioErrore(e: unknown): string {
  if (e instanceof AtlasNonConfigurato) return 'ATLAS non è collegato in questa versione.';
  if (e instanceof AtlasErrore) return e.stato === 0 ? 'ATLAS non risponde. Riprova tra poco.' : e.stato === 401 ? 'L\'accesso è scaduto: accedi di nuovo.' : e.message;
  if (e instanceof LoginError) return e.message;
  return 'Qualcosa non è andato a buon fine. Riprova.';
}

/**
 * L'accesso con Google o con un link via email e il Project ID. Firebase si carica solo se serve: subito se su questo dispositivo c'è già un Project ID
 * (`haCollegamento`) o si arriva da un link di accesso, altrimenti solo quando l'utente tocca «Accedi».
 */
export function useAccesso(haCollegamento: boolean): StatoAccesso {
  const daLink = typeof location !== 'undefined' && sembraLinkDiAccesso(location.search);
  const [attivo, setAttivo] = useState(haCollegamento || daLink);
  const [controllo, setControllo] = useState((haCollegamento || daLink) && loginDisponibile());
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
  }, [esegui]);

  const accediEmail = useCallback(async (email: string): Promise<EsitoInvioLink> => {
    setOccupato(true);
    try { return await inviaLinkAccesso(email); } finally { setOccupato(false); }
  }, []);

  const esci = useCallback(async () => {
    await logout();
    setUtente(null);
    setMe(null);
  }, []);

  return { atlasOnline: !!ATLAS_API_URL, loginDisponibile: loginDisponibile(), controllo, utente, me, errore, occupato, accedi, accediEmail, esci, ricarica, esegui, impostaMe: setMe };
}

/**
 * Mentre c'è un accesso, su questo dispositivo c'è un Project ID: lo si ricorda (`collegamento`) così, aprendo l'app un'altra volta, l'accesso si ritrova
 * da solo. Con `me` del servizio si rispecchiano permessi e @nome utente. Nessuna scrittura se `me` non c'è.
 */
export function useSincronizzaCollegamento(me: MeRisposta | null, aggiorna: (fn: (s: AppState) => AppState) => void) {
  const fatto = useRef('');
  useEffect(() => {
    if (!me) return;
    const link = me.links.find(l => l.appId === ECOSYSTEM.appId);
    const firma = JSON.stringify([me.account.id, me.account.handle, link?.scopes, link?.updatedAt]);
    if (fatto.current === firma) return;
    fatto.current = firma;
    aggiorna(s => aggiornaProgetto(s, p => ({
      ...p,
      collegamento: {
        scopes: Array.from(new Set([...REQUIRED_SCOPES, ...(link?.scopes ?? [])])),
        collegatoIl: p.collegamento?.collegatoIl ?? link?.grantedAt ?? Date.now(),
        aggiornatoIl: link?.updatedAt ?? Date.now(),
        projectId: me.account.id,
        handle: me.account.handle,
      },
    })));
  }, [me, aggiorna]);
}

/** Al primo montaggio completa il link inviato per email se la pagina è stata aperta da lì (vedi lib/progetto/ritorno.ts). Restituisce l'esito da mostrare, o null. */
export function useRitornoLink(appState: AppState, aggiorna: (fn: (s: AppState) => AppState) => void): EsitoRitorno | null {
  const [esito, setEsito] = useState<EsitoRitorno | null>(null);
  const stato = useRef(appState);
  stato.current = appState;
  useEffect(() => {
    let vivo = true;
    void applicaRitornoVerifica(() => stato.current, aggiorna).then(e => { if (vivo && e.tipo !== 'nessuno') setEsito(e); });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return esito;
}
