// Logica pura del percorso di ingresso (components/Onboarding.tsx): niente React, così si prova con `npm test`.
// 1. l'ordine delle schermate (le richieste SPARSE fra le domande, nessuna fra l'ultima domanda e il risultato);
// 2. l'elenco dei corsi di «Che corso frequenti?» (scuola, sede e livello si ricavano dal corso);
// 3. gli argomenti da ripassare nel risultato (con il numero di errori, mai percentuali su così poche domande).
import type { Question } from '../types';
import { CORSO_ALTRO_ID, NOMI_LIVELLO, type FonteCorsi, type LivelloId, type ScelteCorso } from '../lib/progetto/percorso';

// ---------------------------------------------------------------------------------------------------------------------------------
// Ordine delle schermate

/** Le richieste che stanno fra una domanda e l'altra (la certificazione e l'OFA, che possono esonerare, stanno invece subito prima della prima domanda). */
export type Richiesta = 'email' | 'prov' | 'corso' | 'consensi';
/** L'ordine in cui si chiedono. Decisione dell'autore: email PoliMi (nome ricavato), come ci hai conosciuto, percorso di studi, consensi. */
export const ORDINE_RICHIESTE: readonly Richiesta[] = ['email', 'prov', 'corso', 'consensi'];
/** Dopo quante domande può comparire ciascuna richiesta: le ultime tre domande restano sempre solo domande. */
export const DOPO_DOMANDA: Record<Richiesta, number> = { email: 2, prov: 3, corso: 5, consensi: 7 };

export interface OpzioniCammino {
  /** Quante domande ha il test (di norma 10). */
  domande: number;
  /** Le richieste ancora da fare, qualunque ordine. */
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
 * Una richiesta per volta fra una domanda e l'altra (dopo la `DOPO_DOMANDA[r]`-esima); se le domande sono poche, le ultime richieste
 * si mettono di fila prima dell'ultima domanda. Dopo l'ultima domanda c'è solo il risultato.
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
    if (da.length && fatte >= DOPO_DOMANDA[da[0]]) out.push(da.shift()!);
  }
  out.push('result');
  return out;
}

/** Vero se la schermata `k` della sequenza è una domanda del test; restituisce l'indice (0-based). */
export function indiceDomanda(k: string): number | null {
  const m = /^q(\d+)$/.exec(k);
  return m ? Number(m[1]) : null;
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Elenco dei corsi

export interface VoceCorso { chiave: string; id: string; nome: string; scuola: string; sede: string; sedeNome: string; livello: LivelloId; anni: number }

/** Tutti i corsi di tutte le scuole, uno per sede, in ordine alfabetico (poi per sede). */
export function elencoCorsi(fonte: FonteCorsi): VoceCorso[] {
  const out: VoceCorso[] = [];
  for (const sc of fonte.scuole()) {
    for (const se of fonte.sedi(sc.id)) {
      for (const lv of fonte.livelli(sc.id, se.id)) {
        for (const c of fonte.corsi(sc.id, se.id, lv)) {
          out.push({ chiave: `${sc.id}/${se.id}/${lv}/${c.id}`, id: c.id, nome: c.nome, scuola: sc.id, sede: se.id, sedeNome: se.nome, livello: lv, anni: c.anni });
        }
      }
    }
  }
  const norma = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return out.sort((a, b) => norma(a.nome).localeCompare(norma(b.nome), 'it') || a.sedeNome.localeCompare(b.sedeNome, 'it'));
}

/** I livelli che hanno almeno un corso, nell'ordine Triennale, Ciclo unico, Magistrale. */
export function livelliPresenti(voci: readonly VoceCorso[]): LivelloId[] {
  const ordine: LivelloId[] = ['triennale', 'ciclo-unico', 'magistrale'];
  return ordine.filter(l => voci.some(v => v.livello === l));
}

export const NOME_LIVELLO_ELENCO: Record<LivelloId, string> = { ...NOMI_LIVELLO, 'ciclo-unico': 'Ciclo unico' };

/** Quanti anni mostrare per un livello (le pillole prima di scegliere il corso): quelli del livello più lungo fra i suoi corsi. */
export function anniDelLivello(voci: readonly VoceCorso[], livello: LivelloId): number {
  return Math.max(1, ...voci.filter(v => v.livello === livello).map(v => v.anni));
}

/** Le scelte da salvare quando si tocca un corso con un certo anno (l'anno si porta nei limiti del corso). */
export function sceltaDaCorso(v: VoceCorso, anno: number): ScelteCorso {
  return { scuola: v.scuola, sede: v.sede, livello: v.livello, corso: v.id, anno: Math.max(1, Math.min(v.anni, Math.round(anno))) };
}

/** Il corso già scelto (per riaprire la schermata con la voce evidenziata). */
export function corsoScelto(voci: readonly VoceCorso[], s: ScelteCorso): VoceCorso | undefined {
  return s.corso && s.corso !== CORSO_ALTRO_ID ? voci.find(v => v.id === s.corso && v.scuola === s.scuola && (!s.sede || v.sede === s.sede)) : undefined;
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
