import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le sfide sono senza server: il confronto passa dai link (vedi lib/sfide/codice.ts).
 *  Stanno sotto la scheda Simulazioni (sfide, amici, classifica con la stessa testata). Amici e classifica sono locali. */
export const SCHERMATE_SFIDE: Record<string, DefSchermata> = {
  sfide: { titolo: 'Sfide', carica: () => import('./Sfide'), barra: 'sfide' },
  'sfida-gioco': { titolo: 'Sfida', carica: () => import('./SfidaGioco'), barra: null },
  'sfida-risultato': { titolo: 'Risultato della sfida', carica: () => import('./SfidaRisultato'), barra: 'sfide' },
  'sfida-accetta': { titolo: 'Accetta la sfida', carica: () => import('./SfidaAccetta'), barra: 'sfide' },
  amici: { titolo: 'Amici', carica: () => import('./Amici'), barra: 'sfide' },
  classifica: { titolo: 'Classifica', carica: () => import('./Classifica'), barra: 'sfide' },
  condividi: { titolo: 'Condividi', carica: () => import('./Condividi'), barra: 'sfide' },
};
