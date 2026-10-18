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

/** Configurazione pubblica di Firebase (serve solo per «Accedi con Google»). Non sono segreti: finiscono nel sito. */
export const FIREBASE_CONFIG: { apiKey: string; authDomain: string; projectId: string; appId: string } | undefined = (() => {
  const env = import.meta.env;
  const apiKey = env.VITE_FIREBASE_API_KEY, authDomain = env.VITE_FIREBASE_AUTH_DOMAIN, projectId = env.VITE_FIREBASE_PROJECT_ID, appId = env.VITE_FIREBASE_APP_ID;
  return apiKey && authDomain && projectId && appId ? { apiKey, authDomain, projectId, appId } : undefined;
})();

/** Versione del testo dei consensi (classifica NOI e comunicazioni): una sola, uguale a CONSENT_VERSION di atlas/src/scopes.ts. Si cambia a ogni cambio di testo, qui e nel Worker. */
export const CONSENT_VERSION = '2026-10-17';

/** Permessi del Project ID. Restano solo quelli con un uso reale: il profilo (l'account) e la classifica NOI. «Personalizzazione ATLAS» e «progress.share» non esistono più. */
export type ScopeId = 'profile' | 'noi.leaderboard';

export interface ScopeInfo {
  id: ScopeId;
  title: string;
  description: string;
  required: boolean;
}

export const SCOPES: ScopeInfo[] = [
  {
    id: 'profile',
    title: 'Account',
    description: `La tua email e un identificativo, per creare il ${ECOSYSTEM.accountName} e riconoscerti.`,
    required: true,
  },
  {
    id: 'noi.leaderboard',
    title: `Classifica ${ECOSYSTEM.rankingName}`,
    description: 'Il tuo @nome utente, le domande imparate e il miglior punteggio in simulazione sono visibili a tutti i partecipanti.',
    required: false,
  },
];

export const REQUIRED_SCOPES: ScopeId[] = SCOPES.filter(s => s.required).map(s => s.id);
