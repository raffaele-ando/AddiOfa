import type { DefSchermata } from '../registro';

/** Schermate di quest'area: id → definizione. Le aggiunge l'agente che ne è proprietario. */
export const SCHERMATE_STUDIO: Record<string, DefSchermata> = {
  frasi: { titolo: 'Frasi', carica: () => import('./Frasi'), barra: 'lezioni' },
  percorso: { titolo: 'Percorso', carica: () => import('./Percorso'), barra: 'lezioni' },
  'lezione-dettaglio': { titolo: 'Lezione', carica: () => import('./LezioneDettaglio'), barra: 'lezioni' },
  simulazioni: { titolo: 'Simulazioni', carica: () => import('./Simulazioni'), barra: 'simulazioni' },
  'simulazione-dettaglio': { titolo: 'Simulazione', carica: () => import('./SimulazioneDettaglio'), barra: 'simulazioni' },
};
