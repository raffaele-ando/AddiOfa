// Servire e correggere le domande delle sfide passando dal provider locale (come LearnMode ed ExamMode). Le opzioni si mostrano in un ordine fissato dal seme, uguale per chi sfida e per l'amico.
import type { DataProvider, ExamQuestionResult, PublicQuestion } from '../../../access/provider';
import { ordineOpzioni } from '../../../lib/sfide/seme';
import type { VoceSfida } from '../../../lib/sfide/risultati';

export interface DomandeSfida {
  /** Nell'ordine della sfida, con le opzioni già nell'ordine mostrato. */
  domande: PublicQuestion[];
  /** Per ogni domanda: ordine[i] = indice originale dell'opzione mostrata in posizione i. */
  ordini: Record<string, number[]>;
}

export interface Correzioni extends DomandeSfida {
  perQuestion: Map<string, ExamQuestionResult>;
  /** Risposte date, come posizione mostrata (quello che serve a CorrezioniComplete). */
  risposte: Record<string, number>;
}

/** Chiede le domande per id e le rimette nell'ordine della sfida. Se ne manca anche una sola, errore: il confronto non sarebbe valido. */
export async function preparaDomande(provider: DataProvider, ids: string[], seme: string): Promise<DomandeSfida> {
  const ricevute = await provider.getQuestions(ids);
  const perId = new Map(ricevute.map(q => [q.id, q]));
  const domande: PublicQuestion[] = [];
  const ordini: Record<string, number[]> = {};
  for (const id of ids) {
    const q = perId.get(id);
    if (!q) throw new Error('domanda_mancante');
    const ordine = ordineOpzioni(seme, id, q.options.length);
    ordini[id] = ordine;
    domande.push({ ...q, options: ordine.map(i => q.options[i]) });
  }
  return { domande, ordini };
}

/** Corregge: per ogni domanda chiama `grade` con l'indice ORIGINALE dell'opzione scelta (-1 se nessuna). */
export async function correggi(provider: DataProvider, base: DomandeSfida, risposte: Record<string, number>): Promise<{ perQuestion: Map<string, ExamQuestionResult>; corrette: number }> {
  const esiti = await Promise.all(base.domande.map(async q => {
    const mostrata = risposte[q.id];
    const ordine = base.ordini[q.id];
    const g = await provider.grade(q.id, mostrata === undefined ? -1 : ordine[mostrata]);
    const r: ExamQuestionResult = {
      id: q.id,
      correct: mostrata === undefined ? null : g.correct,
      correctIndex: ordine.indexOf(g.correctIndex),
      explanation: g.explanation,
      ...(g.theoryId ? { theoryId: g.theoryId } : {}),
    };
    return r;
  }));
  return { perQuestion: new Map(esiti.map(r => [r.id, r])), corrette: esiti.filter(r => r.correct === true).length };
}

// Subito dopo la partita le correzioni sono già in mano: si tengono qui per non ricalcolarle aprendo il risultato.
const recenti = new Map<string, Correzioni>();
export function ricordaCorrezioni(id: string, c: Correzioni): void {
  recenti.set(id, c);
  if (recenti.size > 5) recenti.delete(recenti.keys().next().value as string);
}

/** Le correzioni di una partita: dalla memoria se sono appena state fatte, altrimenti si richiedono (domande e `grade`). */
export async function caricaCorrezioni(provider: DataProvider, voce: VoceSfida): Promise<Correzioni> {
  const gia = recenti.get(voce.id);
  if (gia) return gia;
  const base = await preparaDomande(provider, voce.ids, voce.seme);
  const risposte: Record<string, number> = {};
  voce.ids.forEach((id, i) => {
    const orig = voce.risposte[i];
    if (typeof orig === 'number' && orig >= 0) risposte[id] = base.ordini[id].indexOf(orig);
  });
  const { perQuestion } = await correggi(provider, base, risposte);
  const c: Correzioni = { ...base, perQuestion, risposte };
  recenti.set(voce.id, c);
  return c;
}
