// Attività recente: simulazioni fatte, dalla più nuova. I giorni (domande e minuti) sono in giorni.ts.
import type { AppState } from '../../types';
import { EXAM } from '../../config/offer';
import { esitoSimulazione } from '../../components/home/stima';

export interface SimulazioneRecente {
  id: string;
  /** Millisecondi. */
  data: number;
  esatte: number;
  totale: number;
  soglia: number;
  superata: boolean;
  secondi: number;
}

export function simulazioniRecenti(stato: AppState, quante = 5): SimulazioneRecente[] {
  const storico = (Array.isArray(stato.history) ? stato.history : []).filter(h => h && Number.isFinite(h.date));
  return [...storico]
    .sort((a, b) => b.date - a.date)
    .slice(0, quante)
    .map(h => {
      const { esatte, totale } = esitoSimulazione(h);
      return {
        id: typeof h.id === 'string' && h.id ? h.id : String(h.date),
        data: h.date, esatte, totale, soglia: EXAM.passMark,
        superata: esatte >= EXAM.passMark,
        secondi: Number.isFinite(h.timeSpentSeconds) ? Math.max(0, h.timeSpentSeconds) : 0,
      };
    });
}
