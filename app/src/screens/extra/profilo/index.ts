import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. `progressi` unisce statistiche, analisi per argomento, calendario e attività. */
export const SCHERMATE_PROFILO: Record<string, DefSchermata> = {
  profilo: { titolo: 'Profilo', carica: () => import('./Profilo') },
  'profilo-modifica': { titolo: 'Modifica profilo', carica: () => import('./ProfiloModifica') },
  progressi: { titolo: 'Progressi', carica: () => import('./Progressi') },
  obiettivi: { titolo: 'Obiettivi', carica: () => import('./Obiettivi') },
  badge: { titolo: 'Badge', carica: () => import('./Badge') },
  pass: { titolo: 'Pass', carica: () => import('./Pass') },
};
