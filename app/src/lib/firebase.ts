// Accesso con Google (Firebase Authentication) per il Project ID. Si carica solo se serve: nessuna inizializzazione all'import,
// nessuna rete finché l'utente non tocca «Accedi con Google». Senza configurazione (VITE_FIREBASE_*) il login dice di non essere disponibile.
// L'accesso prova soltanto l'account Google: non dimostra di essere uno studente del Politecnico.
import type { Auth, User } from 'firebase/auth';
import { FIREBASE_CONFIG } from '../config/ecosystem';

export const isDemoMode = (): boolean => import.meta.env.VITE_MODE === 'demo';

// SOLO SVILUPPO (import.meta.env.DEV, assente da ogni build): con `?atlasProva=<uid>:<nome>` nell'indirizzo l'accesso è finto e usa il token
// «test:<uid>:<nome>», che il Worker accetta soltanto in locale (ALLOW_TEST_TOKENS). Serve a provare per davvero l'invio e la classifica
// contro `wrangler dev --local` senza un account Google. In produzione questo ramo non esiste.
const PROVA: { uid: string; nome: string } | null = (() => {
  if (!import.meta.env.DEV || typeof location === 'undefined') return null;
  const v = new URLSearchParams(location.search).get('atlasProva');
  if (!v) return null;
  const [uid, ...resto] = v.split(':');
  return uid ? { uid, nome: resto.join(':') || uid } : null;
})();
const utenteProva = (): User => ({ uid: PROVA!.uid, displayName: PROVA!.nome, email: `${PROVA!.uid}@example.test`, photoURL: null }) as unknown as User;

/** L'accesso con Google si può offrire solo con la configurazione di Firebase e fuori dalla build a file unico. */
export const loginDisponibile = (): boolean => !!PROVA || (!isDemoMode() && !!FIREBASE_CONFIG);

/** Errore di login con un messaggio già pronto da mostrare nella pagina. */
export class LoginError extends Error {}

// Unico punto in cui si carica l'SDK. Nella build a file unico (`demo`) il confronto letterale è sempre vero e Rollup elimina i due import:
// la pagina singola non porta con sé Firebase né indirizzi di Google (tools/check-artifact.mjs li vieta).
const sdkApp = async () => { if (import.meta.env.VITE_MODE === 'demo') throw new LoginError('Accesso non disponibile.'); return import('firebase/app'); };
const sdkAuth = async () => { if (import.meta.env.VITE_MODE === 'demo') throw new LoginError('Accesso non disponibile.'); return import('firebase/auth'); };

let handle: Promise<Auth> | null = null;

async function carica(): Promise<Auth> {
  // il confronto letterale con VITE_MODE permette alla build a file unico (`demo`) di eliminare tutto il codice di Firebase
  if (import.meta.env.VITE_MODE === 'demo') throw new LoginError('L\'accesso con Google non è disponibile in questa versione.');
  if (!loginDisponibile()) throw new LoginError('L\'accesso con Google non è configurato in questa versione.');
  if (!handle) {
    handle = (async () => {
      const [{ initializeApp }, { getAuth, browserLocalPersistence, setPersistence }] = await Promise.all([sdkApp(), sdkAuth()]);
      const auth = getAuth(initializeApp(FIREBASE_CONFIG!));
      await setPersistence(auth, browserLocalPersistence).catch(() => undefined);
      return auth;
    })();
    handle.catch(() => { handle = null; }); // un caricamento fallito si può ritentare
  }
  return handle;
}

/** Token del login, se Firebase è già stato caricato e c'è un utente. Non carica nulla da solo. */
export async function getIdToken(): Promise<string | null> {
  if (PROVA) return `test:${PROVA.uid}:${PROVA.nome}`;
  if (!handle) return null;
  try {
    const auth = await handle;
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  } catch {
    return null;
  }
}

function messaggioLogin(error: { code?: string }): string {
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return 'Il login non funziona dentro un\'anteprima: apri l\'app in una scheda a parte e riprova.';
  }
  if (error.code === 'auth/network-request-failed') {
    return 'Non riesco a collegarmi per il login. Se usi un blocco delle pubblicità, prova a disattivarlo per questo sito e riprova.';
  }
  if (error.code === 'auth/unauthorized-domain') {
    return 'Questo indirizzo non è autorizzato per il login: il dominio va aggiunto nelle impostazioni di Firebase.';
  }
  if (error.code === 'auth/popup-blocked') return 'Il browser ha bloccato la finestra di accesso: consentila e riprova.';
  return 'Non sono riuscito a fare il login. Riprova tra poco.';
}

/** Apre il login Google. Restituisce l'utente, null se chiudi la finestra, oppure lancia LoginError con un messaggio da mostrare. */
export async function signInWithGoogle(): Promise<User | null> {
  if (PROVA) return utenteProva();
  try {
    const auth = await carica();
    const { GoogleAuthProvider, signInWithPopup } = await sdkAuth();
    return (await signInWithPopup(auth, new GoogleAuthProvider())).user;
  } catch (error) {
    const e = error as { code?: string };
    if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return null;
    if (error instanceof LoginError) throw error;
    throw new LoginError(messaggioLogin(e));
  }
}

export async function logout(): Promise<void> {
  if (PROVA || !handle) return;
  try {
    const [auth, { signOut }] = await Promise.all([handle, sdkAuth()]);
    await signOut(auth);
  } catch {
    // niente: l'utente resta com'è, e lo vedrà al prossimo controllo
  }
}

/** Ascolta i cambi di login. Se l'accesso non è disponibile chiama subito con null e non carica Firebase. Restituisce la funzione per smettere. */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (PROVA) { callback(utenteProva()); return () => undefined; }
  if (!loginDisponibile()) {
    callback(null);
    return () => undefined;
  }
  let annullato = false;
  let smetti: (() => void) | null = null;
  (async () => {
    try {
      const auth = await carica();
      const { onAuthStateChanged } = await sdkAuth();
      if (annullato) return;
      smetti = onAuthStateChanged(auth, callback);
    } catch {
      if (!annullato) callback(null);
    }
  })();
  return () => { annullato = true; smetti?.(); };
}
