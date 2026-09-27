// Nomi dell'ecosistema: cambiali qui quando scegli quelli definitivi.
// I permessi devono coincidere con atlas/src/scopes.ts (lato server).

export const ECOSYSTEM = {
  name: 'Project',          // l'azienda / famiglia di app
  accountName: 'Project ID', // l'account unico per tutte le app
  engineName: 'ATLAS',       // algoritmo e infrastruttura
  rankingName: 'NOI',        // classifiche e community
  appId: 'addiofa',          // id di questa app su ATLAS
};

// URL del Worker ATLAS (es. https://atlas.<tuo-sottodominio>.workers.dev).
// Senza URL il Project ID funziona solo su questo dispositivo e la classifica NOI resta spenta.
export const ATLAS_API_URL: string | undefined = import.meta.env.VITE_ATLAS_API_URL?.replace(/\/+$/, '') || undefined;

export const CONSENT_VERSION = '2026-09-27';

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
    description: `Nome, foto ed email del tuo ${ECOSYSTEM.accountName}, per creare il tuo account e riconoscerti.`,
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
    description: 'Il tuo @nome utente, le domande imparate e il miglior punteggio in simulazione saranno visibili agli altri utenti.',
    required: false,
  },
  {
    id: 'atlas.personalize',
    title: `Personalizzazione con ${ECOSYSTEM.engineName}`,
    description: `${ECOSYSTEM.engineName} usa i dati di questa app per adattare ripasso e suggerimenti nelle altre app ${ECOSYSTEM.name}.`,
    required: false,
  },
];

export const REQUIRED_SCOPES = SCOPES.filter(s => s.required).map(s => s.id);
