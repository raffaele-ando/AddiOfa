import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le sfide sono senza server: il confronto passa dai link (vedi lib/sfide/codice.ts). */
export const SCHERMATE_SFIDE: Record<string, DefSchermata> = {
  sfide: { titolo: 'Sfide', carica: () => import('./Sfide') },
  'sfida-gioco': { titolo: 'Sfida', carica: () => import('./SfidaGioco'), barra: null },
  'sfida-risultato': { titolo: 'Risultato della sfida', carica: () => import('./SfidaRisultato') },
  'sfida-accetta': { titolo: 'Accetta la sfida', carica: () => import('./SfidaAccetta') },
  amici: { titolo: 'Amici', carica: () => import('./Amici') },
  classifica: { titolo: 'Classifica', carica: () => import('./Classifica') },
  condividi: { titolo: 'Condividi', carica: () => import('./Condividi') },
  'accesso-sbloccato': { titolo: 'Accesso sbloccato', carica: () => import('./AccessoSbloccato') },
};
