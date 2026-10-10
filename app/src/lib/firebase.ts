import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCQAXK9Y6joahAoq8qDCqti9ktgzgpX96w",
  authDomain: "ofaenglish-f3719.firebaseapp.com",
  projectId: "ofaenglish-f3719",
  storageBucket: "ofaenglish-f3719.firebasestorage.app",
  messagingSenderId: "61902423708",
  appId: "1:61902423708:web:c3429beacf474dffa7cf59",
  measurementId: "G-PBW0FK07FF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('User closed the login popup.');
      return null;
    }
    console.error("Error signing in with Google", error);
    
    if (window.self !== window.top) {
      alert(`Errore di login: ${error.message}\n\nATTENZIONE: Stai usando l'app dentro un'anteprima. Per fare il login con Google, apri l'app in una nuova scheda cliccando l'icona in alto a destra o copiando l'URL del browser.`);
    } else {
      if (error.code === 'auth/network-request-failed') {
        alert(`Errore di connessione: il tuo browser sta bloccando il login. Se stai usando Brave, disattiva gli "Scudi" per questo sito. Se usi un Adblocker (es. uBlock Origin) prova a disattivarlo temporaneamente. Assicurati anche di aver aggiunto il dominio in Firebase Console.`);
      } else {
        alert(`Errore di login: ${error.message}. Assicurati di aver aggiunto il dominio in Firebase.`);
      }
    }
    
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
