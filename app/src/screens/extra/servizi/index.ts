import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. `projectid` unisce Project ID, classifica NOI e Agorà (tolte `noi`, `agora`, `esplora`, `atlas-analisi`). */
export const SCHERMATE_SERVIZI: Record<string, DefSchermata> = {
  projectid: { titolo: 'Project ID', carica: () => import('./ProjectId') },
  faq: { titolo: 'FAQ', carica: () => import('./Faq') },
  segnala: { titolo: 'Segnala', carica: () => import('./Segnala') },
  'stato-vuoto': { titolo: 'Niente da vedere', carica: () => import('./StatoVuoto') },
  offline: { titolo: 'Offline', carica: () => import('./Offline') },
  splash: { titolo: 'Avvio', carica: () => import('./SplashExtra'), barra: null },
};
