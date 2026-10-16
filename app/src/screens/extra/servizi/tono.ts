// Tono di un valore di accuratezza (0-100) nell'analisi del livello: verde = solido (dalla soglia «da migliorare» in su),
// ambra = da migliorare, corallo = da ripassare. Senza dato sufficiente: nessun tono (grigio). Il numero è sempre scritto accanto.
import type { Tono } from '../ui';
import { SOGLIA_DA_MIGLIORARE } from '../../../lib/servizi/analisi';

/** Sotto questa percentuale un argomento è «da ripassare» (corallo); tra questa e la soglia è «da migliorare» (ambra). */
export const SOGLIA_DA_RIPASSARE = 50;

export function tonoAccuratezza(percento: number | null): Tono | null {
  if (percento === null) return null;
  return percento >= SOGLIA_DA_MIGLIORARE ? 'alto' : percento >= SOGLIA_DA_RIPASSARE ? 'medio' : 'basso';
}

/** Classe del testo (leggibile su fondo chiaro e tinta) del tono, o grigio. */
export const TESTO_TONO: Record<Tono | 'nessuno', string> = {
  alto: 'text-alto-testo', medio: 'text-medio-testo', basso: 'text-basso-testo', azione: 'text-azione-scuro', viola: 'text-viola-testo', nessuno: 'text-testo-tenue',
};

/** Colore pieno (per i punti del radar), come variabile CSS. */
export const VAR_TONO: Record<Tono, string> = {
  alto: 'var(--color-alto)', medio: 'var(--color-medio)', basso: 'var(--color-basso)', azione: 'var(--color-azione)', viola: 'var(--color-viola)',
};
