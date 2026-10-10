// Firebase si carica solo se serve (login attivo e versione non dimostrativa): nessuna inizializzazione all'import.
// In demo non viene mai caricato: l'Artifact non ha rete e il login non c'è.
import type { Auth, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCQAXK9Y6joahAoq8qDCqti9ktgzgpX96w",
  authDomain: "ofaenglish-f3719.firebaseapp.com",
  projectId: "ofaenglish-f3719",
  storageBucket: "ofaenglish-f3719.firebasestorage.app",
  messagingSenderId: "61902423708",
  appId: "1:61902423708:web:c3429beacf474dffa7cf59",
  measurementId: "G-PBW0FK07FF"
};

export const isDemoMode = (): boolean => import.meta.env.VITE_MODE === 'demo';

/** Errore di login con un messaggio già pronto da mostrare nella pagina. */
export class LoginError extends Error {}

interface FirebaseHandles { auth: Auth; db: Firestore }
let handles: Promise<FirebaseHandles> | null = null;

async function carica(): Promise<FirebaseHandles> {
  if (isDemoMode()) throw new LoginError('Il login non è disponibile in questa versione.');
  if (!handles) {
    handles = (async () => {
      const [{ initializeApp }, { getAuth, browserLocalPersistence, setPersistence }, { getFirestore }] = await Promise.all([
        import('firebase/app'), import('firebase/auth'), import('firebase/firestore'),
      ]);
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      await setPersistence(auth, browserLocalPersistence).catch(() => undefined);
      return { auth, db: getFirestore(app) };
    })();
    handles.catch(() => { handles = null; }); // un caricamento fallito si può ritentare
  }
  return handles;
}

export async function getAuthInstance(): Promise<Auth> {
  return (await carica()).auth;
}

export async function getDb(): Promise<Firestore> {
  return (await carica()).db;
}

/** Token del login, se Firebase è già stato caricato e c'è un utente. Non carica nulla da solo. */
export async function getIdToken(): Promise<string | null> {
  if (isDemoMode() || !handles) return null;
  try {
    const { auth } = await handles;
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  } catch {
    return null;
  }
}

function messaggioLogin(error: { code?: string; message?: string }): string {
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return "Il login non funziona dentro un'anteprima: apri l'app in una scheda a parte e riprova.";
  }
  if (error.code === 'auth/network-request-failed') {
    return "Non riesco a collegarmi per il login. Se usi Brave o un blocco delle pubblicità, prova a disattivarlo per questo sito e riprova.";
  }
  if (error.code === 'auth/unauthorized-domain') {
    return "Questo indirizzo non è autorizzato per il login. Il dominio va aggiunto nelle impostazioni di accesso.";
  }
  return "Non sono riuscito a fare il login. Riprova tra poco.";
}

/** Apre il login Google. Restituisce l'utente, null se chiudi la finestra, oppure lancia LoginError con un messaggio da mostrare. */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const auth = await getAuthInstance();
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result.user;
  } catch (error) {
    const e = error as { code?: string; message?: string };
    if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return null;
    if (error instanceof LoginError) throw error;
    console.error('Login Google', error);
    throw new LoginError(messaggioLogin(e));
  }
}

export async function logout(): Promise<void> {
  if (isDemoMode() || !handles) return;
  try {
    const [{ auth }, { signOut }] = await Promise.all([handles, import('firebase/auth')]);
    await signOut(auth);
  } catch (error) {
    console.error('Logout', error);
  }
}

/** Ascolta i cambi di login. In demo chiama subito con null e non carica Firebase. Restituisce la funzione per smettere. */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (isDemoMode()) {
    callback(null);
    return () => undefined;
  }
  let annullato = false;
  let smetti: (() => void) | null = null;
  (async () => {
    try {
      const auth = await getAuthInstance();
      const { onAuthStateChanged } = await import('firebase/auth');
      if (annullato) return;
      smetti = onAuthStateChanged(auth, callback);
    } catch (error) {
      console.error('Firebase non disponibile', error);
      if (!annullato) callback(null);
    }
  })();
  return () => { annullato = true; smetti?.(); };
}
