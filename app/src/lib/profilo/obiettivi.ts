// Obiettivi dell'utente: data del test (facoltativa), minuti di studio al giorno, probabilità stimata da raggiungere.
// Sono scelte dell'utente, salvate sul dispositivo (appState.extra['obiettivi']). L'avanzamento è sempre quello vero:
// nessuna proiezione («-6 % per lezione») e nessuna data suggerita.
import type { AppState } from '../../types';
import { chiaveGiorno } from '../utils';
import { leggiData, mezzanotte, registroGiorni, ultimiGiorniAttivita, datiDelGiorno } from './giorni';

export interface ObiettiviDati {
  /** «2026-11-20» o null. */
  dataTest: string | null;
  minutiGiorno: number;
  /** Probabilità stimata da raggiungere, in percentuale (50-95). */
  stimaTarget: number;
}

export const OBIETTIVI_INIZIALI: ObiettiviDati = { dataTest: null, minutiGiorno: 30, stimaTarget: 70 };
export const MINUTI_OPZIONI = [15, 30, 45, 60, 90];
export const STIMA_OPZIONI = [50, 60, 70, 80, 90];
const MINUTI_MAX = 600;

export function normalizzaObiettivi(raw: unknown): ObiettiviDati {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const minuti = typeof r.minutiGiorno === 'number' && Number.isFinite(r.minutiGiorno) ? Math.round(r.minutiGiorno) : OBIETTIVI_INIZIALI.minutiGiorno;
  const stima = typeof r.stimaTarget === 'number' && Number.isFinite(r.stimaTarget) ? Math.round(r.stimaTarget) : OBIETTIVI_INIZIALI.stimaTarget;
  return {
    dataTest: typeof r.dataTest === 'string' && leggiData(r.dataTest) ? r.dataTest : null,
    minutiGiorno: Math.min(MINUTI_MAX, Math.max(5, minuti)),
    stimaTarget: Math.min(95, Math.max(50, stima)),
  };
}

export type QuandoTest = 'futuro' | 'oggi' | 'passato';

/** Giorni di calendario dalla data di oggi a quella del test (0 = oggi, negativo = passata); null senza data valida. */
export function giorniMancanti(dataTest: string | null, oggi: Date): { giorni: number; quando: QuandoTest } | null {
  const d = dataTest ? leggiData(dataTest) : null;
  if (!d) return null;
  const giorni = Math.round((d.getTime() - mezzanotte(oggi).getTime()) / 86_400_000);
  return { giorni, quando: giorni > 0 ? 'futuro' : giorni === 0 ? 'oggi' : 'passato' };
}

export interface AvanzamentoGiorno {
  secondi: number;
  obiettivoSecondi: number;
  /** 0-1 */
  quota: number;
  raggiunto: boolean;
}

/** Studio di oggi contro i minuti scelti. */
export function avanzamentoGiornaliero(stato: AppState, oggi: Date, minutiGiorno: number): AvanzamentoGiorno {
  const g = datiDelGiorno(registroGiorni(stato), chiaveGiorno(oggi));
  const obiettivoSecondi = Math.max(1, minutiGiorno) * 60;
  return { secondi: g.secondi, obiettivoSecondi, quota: Math.min(1, g.secondi / obiettivoSecondi), raggiunto: g.secondi >= obiettivoSecondi };
}

/** In quanti degli ultimi `quanti` giorni (oggi compreso) l'utente ha raggiunto i minuti scelti. */
export function giorniConObiettivo(stato: AppState, oggi: Date, minutiGiorno: number, quanti = 7): { raggiunti: number; giorni: number } {
  const giorni = ultimiGiorniAttivita(registroGiorni(stato), oggi, quanti);
  return { raggiunti: giorni.filter(g => g.secondi >= minutiGiorno * 60).length, giorni: quanti };
}

export interface AvanzamentoStima {
  /** Stima attuale in percentuale intera; null se non ce n'è ancora una (serve il diagnostico o una simulazione). */
  corrente: number | null;
  target: number;
  /** 0-1: la stima attuale sul valore da raggiungere. */
  quota: number;
  raggiunto: boolean;
  /** Punti percentuali che mancano (0 se raggiunto o senza stima). */
  mancano: number;
}

export function avanzamentoStima(p: number | null | undefined, target: number): AvanzamentoStima {
  if (typeof p !== 'number' || !Number.isFinite(p)) return { corrente: null, target, quota: 0, raggiunto: false, mancano: 0 };
  const corrente = Math.round(Math.min(1, Math.max(0, p)) * 100);
  return { corrente, target, quota: Math.min(1, corrente / target), raggiunto: corrente >= target, mancano: Math.max(0, target - corrente) };
}

