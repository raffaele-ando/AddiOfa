import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le aggiunge l'agente che ne è proprietario. */
export const SCHERMATE_STUDIO: Record<string, DefSchermata> = {
  frasi: { titolo: 'Frasi utili', carica: () => import('./Frasi'), barra: 'esercizi' },
  percorso: { titolo: 'Percorso', carica: () => import('./Percorso'), barra: 'home' },
  'lezione-dettaglio': { titolo: 'Lezione', carica: () => import('./LezioneDettaglio'), barra: 'home' },
  simulazioni: { titolo: 'Simulazioni', carica: () => import('./Simulazioni'), barra: 'home' },
  'simulazione-dettaglio': { titolo: 'Simulazione', carica: () => import('./SimulazioneDettaglio'), barra: 'home' },
};
