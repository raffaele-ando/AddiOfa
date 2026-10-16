import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le aggiunge l'agente che ne è proprietario. */
export const SCHERMATE_SERVIZI: Record<string, DefSchermata> = {
  esplora: { titolo: 'Esplora', carica: () => import('./Esplora'), barra: 'lezioni' },
  projectid: { titolo: 'Project ID', carica: () => import('./ProjectId'), barra: 'lezioni' },
  'atlas-analisi': { titolo: 'Analisi del livello', carica: () => import('./AtlasAnalisi'), barra: 'lezioni' },
  noi: { titolo: 'Classifica NOI', carica: () => import('./Noi'), barra: 'lezioni' },
  agora: { titolo: 'Agorà', carica: () => import('./Agora'), barra: 'lezioni' },
  faq: { titolo: 'Guida e FAQ', carica: () => import('./Faq'), barra: 'lezioni' },
  segnala: { titolo: 'Segnala', carica: () => import('./Segnala'), barra: 'lezioni' },
  'stato-vuoto': { titolo: 'Niente da vedere', carica: () => import('./StatoVuoto') },
  offline: { titolo: 'Offline', carica: () => import('./Offline') },
  splash: { titolo: 'Avvio', carica: () => import('./SplashExtra'), barra: null },
};
