import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le sfide sono senza server: il confronto passa dai link (vedi lib/sfide/codice.ts).
 *  Stanno sotto la scheda Simulazioni (sfide, amici, classifica con la stessa testata). Amici e classifica sono locali. */
export const SCHERMATE_SFIDE: Record<string, DefSchermata> = {
  sfide: { titolo: 'Sfide', carica: () => import('./Sfide'), barra: 'simulazioni' },
  'sfida-gioco': { titolo: 'Sfida', carica: () => import('./SfidaGioco'), barra: null },
  'sfida-risultato': { titolo: 'Risultato della sfida', carica: () => import('./SfidaRisultato'), barra: 'simulazioni' },
  'sfida-accetta': { titolo: 'Accetta la sfida', carica: () => import('./SfidaAccetta'), barra: 'simulazioni' },
  amici: { titolo: 'Amici', carica: () => import('./Amici'), barra: 'simulazioni' },
  classifica: { titolo: 'Classifica', carica: () => import('./Classifica'), barra: 'simulazioni' },
  condividi: { titolo: 'Condividi', carica: () => import('./Condividi'), barra: 'simulazioni' },
};
