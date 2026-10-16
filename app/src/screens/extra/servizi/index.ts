import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione (FAQ, segnala, stati di sistema). */
export const SCHERMATE_SERVIZI: Record<string, DefSchermata> = {
  faq: { titolo: 'FAQ', carica: () => import('./Faq') },
  segnala: { titolo: 'Segnala', carica: () => import('./Segnala') },
  'stato-vuoto': { titolo: 'Niente da vedere', carica: () => import('./StatoVuoto') },
  offline: { titolo: 'Offline', carica: () => import('./Offline') },
  splash: { titolo: 'Avvio', carica: () => import('./SplashExtra'), barra: null },
};
