import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le aggiunge l'agente che ne è proprietario. */
export const SCHERMATE_SERVIZI: Record<string, DefSchermata> = {
  esplora: { titolo: 'Esplora', carica: () => import('./Esplora') },
  projectid: { titolo: 'Project ID', carica: () => import('./ProjectId') },
  'atlas-analisi': { titolo: 'Analisi del livello', carica: () => import('./AtlasAnalisi') },
  noi: { titolo: 'Classifica NOI', carica: () => import('./Noi') },
  agora: { titolo: 'Agorà', carica: () => import('./Agora') },
  faq: { titolo: 'Guida e FAQ', carica: () => import('./Faq') },
  segnala: { titolo: 'Segnala', carica: () => import('./Segnala') },
  'stato-vuoto': { titolo: 'Niente da vedere', carica: () => import('./StatoVuoto') },
  offline: { titolo: 'Offline', carica: () => import('./Offline') },
  splash: { titolo: 'Avvio', carica: () => import('./SplashExtra'), barra: null },
};
