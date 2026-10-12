// Le simulazioni svolte (appState.history) viste per l'elenco e per il dettaglio: tutto ricavato dai dati salvati, niente di inventato.
import type { AppState, ExamHistory } from '../../types';
import { FORMATS, FREE_LIMITS, type FormatId } from '../../config/offer';
import { countFreeSims } from '../../access/entitlement';
import { esitoSimulazione } from '../../components/home/stima';

/** Il formato proposto: il test di recupero di LinguaViva (30 domande, 15 minuti, soglia 25/30). */
export const FORMATO_SIMULAZIONE: FormatId = 'ente';

export interface RiepilogoSimulazione {
  id: string;
  /** Numero d'ordine tra le simulazioni svolte (1 = la prima). */
  numero: number;
  data: number;
  esatte: number;
  totale: number;
  soglia: number;
  superata: boolean;
  tempoSecondi: number;
  formato: FormatId;
  /** Risposte lasciate vuote (se i log ci sono). */
  omesse: number | null;
  sbagliate: number | null;
}

const finito = (n: unknown, ripiego = 0) => (typeof n === 'number' && Number.isFinite(n) ? n : ripiego);

export function riepilogo(h: ExamHistory, numero: number): RiepilogoSimulazione {
  const formato: FormatId = FORMATS[h.format ?? 'ente'] ? (h.format ?? 'ente') : 'ente';
  const { esatte, totale } = esitoSimulazione(h);
  const soglia = FORMATS[formato].passMark;
  const logs = Array.isArray(h.questionLogs) && h.questionLogs.length > 0 ? h.questionLogs : null;
  let omesse: number | null = null, sbagliate: number | null = null;
  if (logs) {
    omesse = logs.filter(l => l.userAnswerIndex === null || l.userAnswerIndex === undefined).length;
    sbagliate = logs.filter(l => l.userAnswerIndex !== null && l.userAnswerIndex !== undefined && !l.isCorrect).length;
  }
  return {
    id: h.id, numero, data: finito(h.date), esatte, totale, soglia,
    superata: esatte >= soglia, tempoSecondi: Math.max(0, finito(h.timeSpentSeconds)), formato, omesse, sbagliate,
  };
}

/** Le simulazioni svolte, dalla più recente: il numero d'ordine resta quello cronologico («Simulazione 3»). */
export function elencoSimulazioni(history: readonly ExamHistory[]): RiepilogoSimulazione[] {
  const valide = (Array.isArray(history) ? history : []).filter(h => h && typeof h === 'object' && Number.isFinite(h.date));
  return [...valide]
    .sort((a, b) => a.date - b.date)
    .map((h, i) => riepilogo(h, i + 1))
    .reverse();
}

/** Trova una simulazione per id (o, come ripiego, per numero d'ordine «3»). */
export function trovaSimulazione(history: readonly ExamHistory[], chiave: string | undefined): RiepilogoSimulazione | null {
  if (!chiave) return null;
  const elenco = elencoSimulazioni(history);
  return elenco.find(s => s.id === chiave) ?? elenco.find(s => String(s.numero) === chiave && !history.some(h => h.id === chiave)) ?? null;
}

export function entrataStorico(history: readonly ExamHistory[], id: string): ExamHistory | undefined {
  return (Array.isArray(history) ? history : []).find(h => h && h.id === id);
}

export interface RigaArgomento { nome: string; esatte: number; totale: number; percento: number }

/**
 * Per argomento (grammarTopic dei log), dal più debole al più solido. Senza i log dettagliati (storico vecchio) si usano le categorie
 * della simulazione (Grammatica, Traduzione), che sono sempre salvate.
 */
export function perArgomentoSimulazione(h: ExamHistory): { righe: RigaArgomento[]; per: 'argomento' | 'categoria' } {
  const conta = new Map<string, { c: number; t: number }>();
  const logs = Array.isArray(h.questionLogs) ? h.questionLogs : [];
  const visti = new Set<string>();
  for (const l of logs) {
    if (!l || !l.grammarTopic || visti.has(l.questionId)) continue;
    visti.add(l.questionId);
    const r = conta.get(l.grammarTopic) ?? { c: 0, t: 0 };
    r.t++; if (l.isCorrect) r.c++;
    conta.set(l.grammarTopic, r);
  }
  let per: 'argomento' | 'categoria' = 'argomento';
  if (conta.size === 0 && h.categoryStats) {
    per = 'categoria';
    for (const [nome, v] of Object.entries(h.categoryStats)) conta.set(nome, { c: finito(v?.correct), t: finito(v?.total) });
  }
  const righe = [...conta.entries()]
    .filter(([, v]) => v.t > 0)
    .map(([nome, v]) => ({ nome, esatte: v.c, totale: v.t, percento: Math.round((v.c / v.t) * 100) }))
    .sort((a, b) => a.percento - b.percento || b.totale - a.totale || a.nome.localeCompare(b.nome));
  return { righe, per };
}

export interface LimiteGratuito {
  /** Simulazioni gratuite ancora disponibili (Infinity con il Pass). */
  restanti: number;
  /** Se oggi se ne può avviare una. */
  puoiIniziare: boolean;
  fatte: number;
  gratuite: number;
}

export function limiteGratuito(stato: Pick<AppState, 'history'>, pass: boolean): LimiteGratuito {
  const fatte = countFreeSims(Array.isArray(stato.history) ? stato.history : []);
  const gratuite = FREE_LIMITS.freeSimulations;
  if (pass) return { restanti: Infinity, puoiIniziare: true, fatte, gratuite };
  const restanti = Math.max(0, gratuite - fatte);
  return { restanti, puoiIniziare: restanti > 0, fatte, gratuite };
}
