// Giorni di studio, calendario e attività: tutto letto da appState.dailyActivity (risposte date per giorno),
// appState.dailyTimeSpent (secondi di studio attivo per giorno) e appState.history (simulazioni). Niente numeri inventati.
import type { AppState } from '../../types';
import { chiaveGiorno } from '../utils';

/** Un giorno conta come «di studio» con almeno una risposta, una simulazione o un minuto di studio attivo. */
export const SECONDI_MINIMI_GIORNO = 60;

export interface GiornoStudio {
  /** Chiave del giorno, fuso locale: «2026-10-11». */
  data: string;
  /** Risposte date (domande). */
  domande: number;
  secondi: number;
  simulazioni: number;
}

const numero = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 0);
const CHIAVE = /^\d{4}-\d{2}-\d{2}$/;

/** «2026-10-11» → Date a mezzanotte locale; null se non è una data vera (niente 31 febbraio). */
export function leggiData(s: string): Date | null {
  if (typeof s !== 'string' || !CHIAVE.test(s)) return null;
  const [a, m, g] = s.split('-').map(Number);
  const d = new Date(a, m - 1, g);
  return d.getFullYear() === a && d.getMonth() === m - 1 && d.getDate() === g ? d : null;
}

export function mezzanotte(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Somma giorni di calendario (non di 24 ore: regge il cambio dell'ora). */
export function aggiungiGiorni(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function giornoVuoto(data: string): GiornoStudio {
  return { data, domande: 0, secondi: 0, simulazioni: 0 };
}

export function giornoStudiato(g: GiornoStudio): boolean {
  return g.domande > 0 || g.simulazioni > 0 || g.secondi >= SECONDI_MINIMI_GIORNO;
}

/** Tutti i giorni su cui c'è almeno un dato, per chiave. */
export function registroGiorni(stato: AppState): Map<string, GiornoStudio> {
  const mappa = new Map<string, GiornoStudio>();
  const giorno = (data: string) => {
    let g = mappa.get(data);
    if (!g) { g = giornoVuoto(data); mappa.set(data, g); }
    return g;
  };
  for (const [data, n] of Object.entries(stato.dailyActivity ?? {})) if (leggiData(data) && numero(n)) giorno(data).domande += numero(n);
  for (const [data, s] of Object.entries(stato.dailyTimeSpent ?? {})) if (leggiData(data) && numero(s)) giorno(data).secondi += numero(s);
  for (const h of Array.isArray(stato.history) ? stato.history : []) {
    if (!h || !Number.isFinite(h.date)) continue;
    giorno(chiaveGiorno(new Date(h.date))).simulazioni += 1;
  }
  return mappa;
}

export function datiDelGiorno(registro: Map<string, GiornoStudio>, data: string): GiornoStudio {
  return registro.get(data) ?? giornoVuoto(data);
}

export interface RiassuntoStudio {
  giorniDiStudio: number;
  secondiTotali: number;
  domandeTotali: number;
  simulazioni: number;
}

export function riassuntoStudio(stato: AppState): RiassuntoStudio {
  const registro = registroGiorni(stato);
  let giorniDiStudio = 0, secondiTotali = 0, domandeTotali = 0, simulazioni = 0;
  for (const g of registro.values()) {
    if (giornoStudiato(g)) giorniDiStudio++;
    secondiTotali += g.secondi;
    domandeTotali += g.domande;
    simulazioni += g.simulazioni;
  }
  return { giorniDiStudio, secondiTotali, domandeTotali, simulazioni };
}

/** «35 min», «2 h 05 min», «meno di 1 min» (mai 0 se c'è stato studio). */
export function formatoDurata(secondi: number): string {
  const s = Math.max(0, Math.round(secondi));
  if (s === 0) return '0 min';
  const minuti = Math.floor(s / 60);
  if (minuti === 0) return 'meno di 1 min';
  if (minuti < 60) return `${minuti} min`;
  const ore = Math.floor(minuti / 60);
  const resto = minuti % 60;
  return resto === 0 ? `${ore} h` : `${ore} h ${String(resto).padStart(2, '0')} min`;
}

// ---- Calendario del mese

export interface CellaMese {
  data: string;
  giorno: number;
  /** Il giorno appartiene al mese mostrato (le celle di riempimento no). */
  delMese: boolean;
  studiato: boolean;
  oggi: boolean;
  /** Dopo oggi: non si può aver studiato. */
  futuro: boolean;
  /** È la data del test impostata dall'utente. */
  test: boolean;
}

export const NOMI_MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
export const INTESTAZIONE_SETTIMANA = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

/** Sposta (anno, mese 0-11) di `delta` mesi. */
export function spostaMese(anno: number, mese: number, delta: number): { anno: number; mese: number } {
  const d = new Date(anno, mese + delta, 1);
  return { anno: d.getFullYear(), mese: d.getMonth() };
}

/** Il mese in settimane intere, da lunedì a domenica, con i giorni dei mesi vicini a riempire. */
export function meseCalendario(
  anno: number, mese: number, registro: Map<string, GiornoStudio>, oggi: Date, dataTest?: string | null,
): { anno: number; mese: number; etichetta: string; settimane: CellaMese[][] } {
  const primo = new Date(anno, mese, 1);
  const scostamento = (primo.getDay() + 6) % 7; // lunedì = 0
  const inizio = aggiungiGiorni(primo, -scostamento);
  const ultimo = new Date(anno, mese + 1, 0);
  const righe = Math.ceil((scostamento + ultimo.getDate()) / 7);
  const chiaveOggi = chiaveGiorno(oggi);
  const settimane: CellaMese[][] = [];
  for (let r = 0; r < righe; r++) {
    const riga: CellaMese[] = [];
    for (let c = 0; c < 7; c++) {
      const d = aggiungiGiorni(inizio, r * 7 + c);
      const data = chiaveGiorno(d);
      const g = registro.get(data);
      riga.push({
        data, giorno: d.getDate(), delMese: d.getMonth() === mese,
        studiato: !!g && giornoStudiato(g), oggi: data === chiaveOggi, futuro: data > chiaveOggi, test: !!dataTest && data === dataTest,
      });
    }
    settimane.push(riga);
  }
  return { anno, mese, etichetta: `${NOMI_MESI[mese][0].toUpperCase()}${NOMI_MESI[mese].slice(1)} ${anno}`, settimane };
}

// ---- Ultimi giorni

export interface GiornoRecente extends GiornoStudio {
  /** Iniziale del giorno della settimana («L», «M»...). */
  lettera: string;
  /** Numero del giorno nel mese. */
  numero: number;
  minuti: number;
}

/** Gli ultimi `quanti` giorni fino a oggi compreso, dal più vecchio al più recente. */
export function ultimiGiorniAttivita(registro: Map<string, GiornoStudio>, oggi: Date, quanti: number): GiornoRecente[] {
  const out: GiornoRecente[] = [];
  const fine = mezzanotte(oggi);
  for (let i = quanti - 1; i >= 0; i--) {
    const d = aggiungiGiorni(fine, -i);
    const g = datiDelGiorno(registro, chiaveGiorno(d));
    out.push({ ...g, lettera: 'DLMMGVS'[d.getDay()], numero: d.getDate(), minuti: Math.round(g.secondi / 60) });
  }
  return out;
}

export interface TotaliPeriodo {
  domande: number;
  secondi: number;
  simulazioni: number;
  giorniDiStudio: number;
  /** Giorni del periodo. */
  giorni: number;
}

export function totaliPeriodo(giorni: GiornoStudio[]): TotaliPeriodo {
  let domande = 0, secondi = 0, simulazioni = 0, giorniDiStudio = 0;
  for (const g of giorni) {
    domande += g.domande; secondi += g.secondi; simulazioni += g.simulazioni;
    if (giornoStudiato(g)) giorniDiStudio++;
  }
  return { domande, secondi, simulazioni, giorniDiStudio, giorni: giorni.length };
}
