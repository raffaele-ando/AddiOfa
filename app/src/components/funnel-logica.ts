// Logica pura del percorso di ingresso (components/Onboarding.tsx): niente React, così si prova con `npm test`.
// 1. l'ordine delle schermate (le richieste SPARSE fra le domande, nessuna fra l'ultima domanda e il risultato);
// 2. i passi del percorso di studi da chiedere (quelli con una sola scelta si saltano);
// 3. gli argomenti da ripassare nel risultato (con il numero di errori, mai percentuali su così poche domande).
import type { Question } from '../types';
import { risolvi, type FonteCorsi, type ScelteCorso } from '../lib/progetto/percorso';

// ---------------------------------------------------------------------------------------------------------------------------------
// Ordine delle schermate

/** Le richieste che stanno fra una domanda e l'altra, una per schermata (la certificazione e l'OFA, che possono esonerare, stanno invece subito prima della prima domanda). */
export type PassoRichiesto = 'scuola' | 'sede' | 'livello' | 'corso';
export type Richiesta = 'email' | 'prov' | PassoRichiesto | 'consensi';
/** L'ordine in cui si chiedono. Decisione dell'autore: email PoliMi (nome ricavato), come ci hai conosciuto, percorso di studi a cascata (scuola, sede, livello, corso e anno), consensi. */
export const ORDINE_RICHIESTE: readonly Richiesta[] = ['email', 'prov', 'scuola', 'sede', 'livello', 'corso', 'consensi'];
/** Dopo quante domande può comparire la prima richiesta; poi una per ogni pausa fra due domande. */
export const PRIMA_RICHIESTA_DOPO = 2;

export interface OpzioniCammino {
  /** Quante domande ha il test (di norma 10). */
  domande: number;
  /** Le richieste da fare (quelle che non servono, come un passo con una sola scelta, non ci sono). */
  richieste: readonly Richiesta[];
  /** Schermata iniziale «Perché farlo» (pain e gain): chi apre il test dalla Home non la rivede. */
  racconto: boolean;
  /** Schermata di avvio del test (chi ha già la registrazione e lo rifà). */
  avvio: boolean;
  /** Serve chiedere certificazione e OFA prima del test. */
  certOfa: boolean;
}

/**
 * La sequenza delle schermate, nell'ordine: 'pain', 'gain', 'avvio', 'certOfa', 'q0'… 'q9' con le richieste in mezzo, 'result'.
 * Una richiesta per pausa fra due domande, a partire da dopo la `PRIMA_RICHIESTA_DOPO`-esima: email dopo la 2ª, provenienza dopo la 3ª, scuola dopo la 4ª,
 * sede dopo la 5ª, livello dopo la 6ª, corso e anno dopo la 7ª, consensi dopo l'8ª. Se un passo non serve le successive scorrono prima; se le
 * domande sono poche le ultime richieste si mettono di fila prima dell'ultima domanda. Dopo l'ultima domanda c'è solo il risultato.
 */
export function cammino(o: OpzioniCammino): string[] {
  const out: string[] = [];
  if (o.racconto) out.push('pain', 'gain');
  if (o.avvio) out.push('avvio');
  if (o.certOfa) out.push('certOfa');
  const da = ORDINE_RICHIESTE.filter(r => o.richieste.includes(r));
  const n = Math.max(1, o.domande);
  for (let i = 0; i < n; i++) {
    out.push(`q${i}`);
    const fatte = i + 1;
    if (fatte >= n) break;                                   // dopo l'ultima domanda: niente
    if (fatte >= n - 1) { out.push(...da.splice(0)); continue; } // prima dell'ultima domanda si chiude ogni richiesta rimasta
    if (da.length && fatte >= PRIMA_RICHIESTA_DOPO) out.push(da.shift()!);
  }
  out.push('result');
  return out;
}

/** Vero se la schermata `k` della sequenza è una domanda del test; restituisce l'indice (0-based). */
export function indiceDomanda(k: string): number | null {
  const m = /^q(\d+)$/.exec(k);
  return m ? Number(m[1]) : null;
}

/**
 * I passi del percorso di studi da chiedere: scuola, sede, livello, corso (con l'anno). I passi con una sola scelta si saltano: lo si sa solo
 * dopo aver scelto quelli prima (la sede dipende dalla scuola, il livello dalla scuola e dalla sede), quindi finché non si sa si contano tutti.
 */
export function passiPercorso(s: ScelteCorso, fonte: FonteCorsi): PassoRichiesto[] {
  const auto = risolvi(s, fonte).automatici;
  return (['scuola', 'sede', 'livello', 'corso'] as const).filter(p => !auto.includes(p));
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Risultato

export interface ArgomentoErrato { nome: string; errori: number }

/** Gli argomenti delle domande sbagliate (o saltate con «Non lo so»), dal più sbagliato al meno; a parità resta l'ordine delle domande. */
export function argomentiDaRipassare(domande: readonly Question[], risposte: Record<string, number>): ArgomentoErrato[] {
  const conti = new Map<string, number>();
  for (const q of domande) {
    if (risposte[q.id] === q.correctIndex) continue;
    const nome = q.grammarTopic || q.category;
    conti.set(nome, (conti.get(nome) ?? 0) + 1);
  }
  return [...conti.entries()].map(([nome, errori]) => ({ nome, errori })).sort((a, b) => b.errori - a.errori);
}

/** «1 errore» / «2 errori». */
export const testoErrori = (n: number): string => (n === 1 ? '1 errore' : `${n} errori`);
