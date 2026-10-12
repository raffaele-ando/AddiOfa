import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le aggiunge l'agente che ne è proprietario. */
export const SCHERMATE_PROFILO: Record<string, DefSchermata> = {
  profilo: { titolo: 'Il tuo profilo', carica: () => import('./Profilo') },
  'profilo-modifica': { titolo: 'Modifica profilo', carica: () => import('./ProfiloModifica') },
  obiettivi: { titolo: 'Obiettivi', carica: () => import('./Obiettivi') },
  calendario: { titolo: 'Calendario', carica: () => import('./Calendario') },
  badge: { titolo: 'Badge', carica: () => import('./Badge') },
  attivita: { titolo: 'Attività', carica: () => import('./Attivita') },
};
