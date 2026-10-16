import type { ComponentType } from 'react';
import { SCHERMATE_PROFILO } from './profilo';
import { SCHERMATE_SFIDE } from './sfide';
import { SCHERMATE_STUDIO } from './studio';
import { SCHERMATE_SERVIZI } from './servizi';

/** Una schermata extra: `carica` è un import dinamico (le schermate si caricano solo quando servono). */
export interface DefSchermata {
  titolo: string;
  carica: () => Promise<{ default: ComponentType }>;
  /** Scheda della barra in basso evidenziata; `null` = schermata senza barra (a tutto schermo). Default: 'home'. */
  barra?: 'home' | 'esercizi' | 'sfide' | null;
}

export const SCHERMATE: Record<string, DefSchermata> = {
  ...SCHERMATE_PROFILO,
  ...SCHERMATE_SFIDE,
  ...SCHERMATE_STUDIO,
  ...SCHERMATE_SERVIZI,
};
