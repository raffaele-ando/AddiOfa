import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le sfide sono senza server: il confronto passa dai link (vedi lib/sfide/codice.ts). */
export const SCHERMATE_SFIDE: Record<string, DefSchermata> = {
  sfide: { titolo: 'Sfide', carica: () => import('./Sfide'), barra: 'lezioni' },
  'sfida-gioco': { titolo: 'Sfida', carica: () => import('./SfidaGioco'), barra: null },
  'sfida-risultato': { titolo: 'Risultato della sfida', carica: () => import('./SfidaRisultato'), barra: 'lezioni' },
  'sfida-accetta': { titolo: 'Accetta la sfida', carica: () => import('./SfidaAccetta'), barra: 'lezioni' },
  amici: { titolo: 'Amici', carica: () => import('./Amici'), barra: 'lezioni' },
  classifica: { titolo: 'Classifica', carica: () => import('./Classifica'), barra: 'lezioni' },
  condividi: { titolo: 'Condividi', carica: () => import('./Condividi'), barra: 'lezioni' },
  'accesso-sbloccato': { titolo: 'Accesso sbloccato', carica: () => import('./AccessoSbloccato'), barra: 'lezioni' },
};
