import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione (FAQ, segnala, stati di sistema). */
export const SCHERMATE_SERVIZI: Record<string, DefSchermata> = {
  faq: { titolo: 'Domande frequenti', carica: () => import('./Faq'), barra: 'nessuna' },
  segnala: { titolo: 'Segnala un problema', carica: () => import('./Segnala'), barra: 'nessuna' },
  'stato-vuoto': { titolo: 'Niente da vedere', carica: () => import('./StatoVuoto'), barra: 'nessuna' },
  offline: { titolo: 'Offline', carica: () => import('./Offline'), barra: 'nessuna' },
  splash: { titolo: 'Avvio', carica: () => import('./SplashExtra'), barra: null },
};
