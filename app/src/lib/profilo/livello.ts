// Livello attuale: quanta parte delle domande di ogni livello (A1, A2, B1) l'utente ha davvero imparato.
//
// Definizione (onesta e semplice, scritta qui e mostrata all'utente):
//  - una domanda è «imparata» quando lo dice isLearned (risposta esatta due volte di fila a distanza di mezza giornata);
//  - si conta su tutte le domande del banco;
//  - un livello è «raggiunto» quando ha imparato almeno il 60 % delle sue domande E ha già raggiunto i livelli sotto;
//  - il livello attuale è l'ultimo raggiunto; se non è raggiunto nemmeno A1 il livello è «non ancora definito».
// Non è una certificazione né una stima dell'esito del test: quella è la «Probabilità stimata di superare il test».
import type { UserStats } from '../../types';
import { isLearned } from '../spacedRepetition';
import type { DomandaBanco } from './tipi';

export const LIVELLI = ['A1', 'A2', 'B1'] as const;
export type Livello = (typeof LIVELLI)[number];
export const SOGLIA_LIVELLO = 0.6;

export interface QuotaLivello {
  livello: Livello;
  imparate: number;
  totale: number;
  /** 0-1 */
  quota: number;
  raggiunto: boolean;
}

export interface LivelloAttuale {
  /** Ultimo livello raggiunto; null = nessuno. */
  livello: Livello | null;
  /** Il livello che viene dopo (o il primo se non c'è un livello); null = B1 raggiunto, o banco senza livelli. */
  prossimo: QuotaLivello | null;
  /** Domande ancora da imparare per raggiungere la soglia del prossimo livello. */
  mancanti: number;
  quote: QuotaLivello[];
}

export function livelloAttuale(stats: UserStats | undefined | null, banco: readonly DomandaBanco[], soglia = SOGLIA_LIVELLO): LivelloAttuale {
  const conteggi = new Map<Livello, { imparate: number; totale: number }>();
  for (const q of banco) {
    if (!q.level || !(LIVELLI as readonly string[]).includes(q.level)) continue;
    const c = conteggi.get(q.level as Livello) ?? { imparate: 0, totale: 0 };
    c.totale++;
    if (isLearned(stats?.[q.id])) c.imparate++;
    conteggi.set(q.level as Livello, c);
  }
  const quote: QuotaLivello[] = [];
  let sotto = true;
  let livello: Livello | null = null;
  for (const l of LIVELLI) {
    const c = conteggi.get(l);
    if (!c || c.totale === 0) continue; // un livello senza domande non si può misurare: si salta
    const quota = c.imparate / c.totale;
    const raggiunto = sotto && quota >= soglia;
    if (raggiunto) livello = l; else sotto = false;
    quote.push({ livello: l, imparate: c.imparate, totale: c.totale, quota, raggiunto });
  }
  const prossimo = quote.find(q => !q.raggiunto) ?? null;
  const mancanti = prossimo ? Math.max(0, Math.ceil(soglia * prossimo.totale - 1e-9) - prossimo.imparate) : 0;
  return { livello, prossimo, mancanti, quote };
}
