import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. `progressi` unisce statistiche, analisi per argomento, calendario e attività. */
export const SCHERMATE_PROFILO: Record<string, DefSchermata> = {
  profilo: { titolo: 'Profilo', carica: () => import('./Profilo'), barra: 'nessuna' },
  'profilo-modifica': { titolo: 'Modifica profilo', carica: () => import('./ProfiloModifica'), barra: 'nessuna' },
  progressi: { titolo: 'Progressi', carica: () => import('./Progressi'), barra: 'nessuna' },
  obiettivi: { titolo: 'Obiettivi', carica: () => import('./Obiettivi'), barra: 'nessuna' },
  badge: { titolo: 'Badge', carica: () => import('./Badge'), barra: 'nessuna' },
};
