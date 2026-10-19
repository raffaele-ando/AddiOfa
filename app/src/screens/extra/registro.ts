import type { ComponentType } from 'react';
import { SCHERMATE_PROFILO } from './profilo';
import { SCHERMATE_SFIDE } from './sfide';
import { SCHERMATE_STUDIO } from './studio';
import { SCHERMATE_SERVIZI } from './servizi';
import { SCHERMATE_PROGETTO } from './progetto';

/** Una schermata extra: `carica` è un import dinamico (le schermate si caricano solo quando servono). */
export interface DefSchermata {
  titolo: string;
  carica: () => Promise<{ default: ComponentType }>;
  /** Scheda della barra in basso evidenziata; `null` = schermata senza barra (a tutto schermo); `'nessuna'` = la barra c'è ma nessuna voce è attiva
   *  (pagine che non appartengono a Home, Esercizi o Sfide: profilo, progressi, FAQ, community...). Default: 'home'. */
  barra?: 'home' | 'esercizi' | 'sfide' | 'nessuna' | null;
}

export const SCHERMATE: Record<string, DefSchermata> = {
  ...SCHERMATE_PROFILO,
  ...SCHERMATE_SFIDE,
  ...SCHERMATE_STUDIO,
  ...SCHERMATE_SERVIZI,
  ...SCHERMATE_PROGETTO,
};
