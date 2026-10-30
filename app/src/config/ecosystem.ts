// L'ecosistema di cui AddiOFA fa parte: Project (l'autore), Project ID (account unico), ATLAS (algoritmo e infrastruttura),
// NOI (classifica e community), Agorà (la pagina per gli studenti del Politecnico). Nomi e permessi stanno qui, in un posto solo.
// I permessi devono coincidere con atlas/src/scopes.ts (lato server).

export const ECOSYSTEM = {
  name: 'Project',           // l'autore: la famiglia di app
  accountName: 'Project ID', // l'account unico per tutte le app
  engineName: 'ATLAS',       // algoritmo e infrastruttura
  rankingName: 'NOI',        // classifica e community
  agoraName: 'Agorà',        // la pagina degli studenti del Politecnico
  appId: 'addiofa',          // id di questa app su ATLAS
};

/** Profilo Instagram di Agorà (nessun numero di follower: non è un dato che l'app possa conoscere). */
export const AGORA_URL = 'https://www.instagram.com/polimi.agora/';
export const AGORA_HANDLE = 'polimi.agora';

/** Una sola frase: chi sono gli autori e che cosa non sono. Compare in Esplora, nella registrazione e nelle pagine legali. */
export const FRASE_PROJECT = 'AddiOFA fa parte di Project, insieme a NOI, ATLAS e Agorà. Progetto studentesco indipendente, non affiliato al Politecnico di Milano.';

// URL del Worker ATLAS (es. https://atlas.<sottodominio>.workers.dev), impostato alla build con VITE_ATLAS_API_URL.
// Senza URL l'app non contatta nessun server: le iscrizioni restano in coda nel dispositivo e NOI dice «non collegato».
export const ATLAS_API_URL: string | undefined = import.meta.env.VITE_ATLAS_API_URL?.replace(/\/+$/, '') || undefined;

/**
 * Configurazione pubblica di Firebase del progetto di Project (serve solo per «Accedi con Google» e per il link di verifica dell'email).
 * Non sono segreti: finiscono comunque nel sito. Si possono sovrascrivere alla build con le variabili VITE_FIREBASE_*; senza, valgono questi valori
 * (gli stessi di app/firebase-applet-config.json), così per pubblicare il sito non serve impostare nulla.
 */
const FIREBASE_PREDEFINITA = {
  apiKey: 'AIzaSyARzkGVZMnvklPOqtxFkW2fgUs5Ygptum0',
  authDomain: 'mimetic-resolver-7szp9.firebaseapp.com',
  projectId: 'mimetic-resolver-7szp9',
  appId: '1:92251035376:web:0e0b135d58c86431495435',
};
export const FIREBASE_CONFIG: { apiKey: string; authDomain: string; projectId: string; appId: string } | undefined = (() => {
  const env = import.meta.env;
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || FIREBASE_PREDEFINITA.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || FIREBASE_PREDEFINITA.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || FIREBASE_PREDEFINITA.projectId,
    appId: env.VITE_FIREBASE_APP_ID || FIREBASE_PREDEFINITA.appId,
  };
})();

/** Versione del consenso ai permessi del Project ID: uguale a CONSENT_VERSION di atlas/src/scopes.ts. Cambiando testi o permessi si aumenta in tutti e due. */
export const CONSENT_VERSION = '2026-09-27';

/** Versione del testo dei consensi dell'iscrizione (nome, email, corso, tre consensi facoltativi): si cambia a ogni cambio di testo. Formato richiesto dal Worker: [A-Za-z0-9._-]{1,32}. */
export const ISCRIZIONE_VERSIONE = 'iscrizione-2026-10-17';

export type ScopeId = 'profile' | 'progress.share' | 'noi.leaderboard' | 'atlas.personalize';

export interface ScopeInfo {
  id: ScopeId;
  title: string;
  description: string;
  required: boolean;
}

export const SCOPES: ScopeInfo[] = [
  {
    id: 'profile',
    title: 'Profilo di base',
    description: `Nome, foto ed email del tuo ${ECOSYSTEM.accountName}, per creare l'account e riconoscerti.`,
    required: true,
  },
  {
    id: 'progress.share',
    title: `Progressi condivisi tra le app ${ECOSYSTEM.name}`,
    description: 'Domande imparate, simulazioni e statistiche disponibili anche nelle altre app collegate.',
    required: false,
  },
  {
    id: 'noi.leaderboard',
    title: `Classifica ${ECOSYSTEM.rankingName}`,
    description: 'Il tuo @nome utente, le domande imparate e il miglior punteggio in simulazione sono visibili agli altri.',
    required: false,
  },
  {
    id: 'atlas.personalize',
    title: `Personalizzazione con ${ECOSYSTEM.engineName}`,
    description: `${ECOSYSTEM.engineName} usa i dati di questa app per adattare ripasso e suggerimenti nelle altre app ${ECOSYSTEM.name}.`,
    required: false,
  },
];

export const REQUIRED_SCOPES: ScopeId[] = SCOPES.filter(s => s.required).map(s => s.id);
