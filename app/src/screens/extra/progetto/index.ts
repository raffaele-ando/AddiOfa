import type { DefSchermata } from '../registro';

/**
 * Schermate dell'ecosistema di Project: id → definizione.
 *  - esplora: l'hub (Project ID, ATLAS, NOI, Agorà); la tessera «Progetto» del Profilo apre questo id.
 *  - projectid: l'account (Google o email, età 14+), le comunicazioni, il percorso di studi e il badge studente (solo nel dispositivo), esporta e cancella.
 *  - atlas-analisi: l'analisi del livello, sul dispositivo.
 *  - noi: la classifica (vera solo se ATLAS risponde) e la casella per entrarci.
 *  - agora: cos'è Agorà e il link a Instagram.
 */
export const SCHERMATE_PROGETTO: Record<string, DefSchermata> = {
  esplora: { titolo: 'Esplora', carica: () => import('./Esplora') },
  projectid: { titolo: 'Project ID', carica: () => import('./ProjectId') },
  'atlas-analisi': { titolo: 'ATLAS', carica: () => import('./AtlasAnalisi') },
  noi: { titolo: 'NOI', carica: () => import('./Noi') },
  agora: { titolo: 'Agorà', carica: () => import('./Agora') },
};
