import type { DefSchermata } from '../registro';

/**
 * Schermate dell'ecosistema di Project: id → definizione.
 *  - esplora: l'hub (Project ID, ATLAS, NOI, Agorà); la tessera «Progetto» del Profilo apre questo id.
 *  - projectid: i dati della registrazione e il loro invio, l'accesso con Google e i permessi, esporta e cancella.
 *  - atlas-analisi: l'analisi del livello, sul dispositivo.
 *  - noi: la classifica (vera solo se ATLAS risponde).
 *  - agora: cos'è Agorà e il link a Instagram.
 *  - completa-profilo: la registrazione per chi ha già usato l'app (a tutto schermo, come il funnel).
 */
export const SCHERMATE_PROGETTO: Record<string, DefSchermata> = {
  esplora: { titolo: 'Esplora', carica: () => import('./Esplora') },
  projectid: { titolo: 'Project ID', carica: () => import('./ProjectId') },
  'atlas-analisi': { titolo: 'ATLAS', carica: () => import('./AtlasAnalisi') },
  noi: { titolo: 'NOI', carica: () => import('./Noi') },
  agora: { titolo: 'Agorà', carica: () => import('./Agora') },
  'completa-profilo': { titolo: 'Completa il profilo', carica: () => import('./CompletaProfilo'), barra: null },
};
