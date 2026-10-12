// Le sfide si giocano su domande scelte da un SEME: stesso seme e stesso banco = stesse domande, nello stesso ordine
// (e con le opzioni nello stesso ordine) per tutti, senza nessun server. Funzioni pure: niente rete, niente Date.now().
import { chiaveGiorno } from '../utils';

/** Domande di una sfida e tempo a disposizione (10 domande a 30 secondi l'una, come il test di recupero: 30 in 15 minuti). */
export const DOMANDE_SFIDA = 10;
export const SECONDI_SFIDA = 300;

/** Hash di una stringa in un intero a 32 bit (FNV-1a): stabile, uguale in ogni browser e in Node. */
export function hash32(testo: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < testo.length; i++) {
    h ^= testo.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Generatore con seme (mulberry32): restituisce numeri in [0, 1). */
export function creaGeneratore(seme: string): () => number {
  let a = hash32(`addiofa-sfida|${seme}`) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rimescola una copia dell'elenco (Fisher-Yates) con il generatore del seme. */
export function mescolaConSeme<T>(elenco: readonly T[], seme: string): T[] {
  const copia = [...elenco];
  const rnd = creaGeneratore(seme);
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Il minimo che serve per scegliere: l'indice leggero del banco (senza risposte) basta. */
export interface VoceBanco { id: string; category: string }

/** Ordine stabile del banco: per numero dell'id (q2 prima di q10), così non dipende da come è stato generato il file. */
export function ordinaBanco<T extends { id: string }>(banco: readonly T[]): T[] {
  return [...banco].sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

/** Impronta breve del banco di domande: se due persone hanno banchi diversi (app di versioni diverse) l'impronta cambia
 *  e il confronto non sarebbe valido. Non è sicurezza: serve solo a non confrontare cose diverse. */
export function improntaBanco(banco: readonly { id: string }[]): string {
  const ids = ordinaBanco(banco).map(v => v.id).join(',');
  return hash32(`banco|${banco.length}|${ids}`).toString(36).padStart(4, '0').slice(-4);
}

/** Sceglie `n` domande diverse dal banco in modo deterministico: rimescola con il seme e non prende più di
 *  ceil(n / categorie) domande della stessa categoria, così una sfida non è tutta di un solo tipo. */
export function scegliDomande(banco: readonly VoceBanco[], seme: string, n: number = DOMANDE_SFIDA): string[] {
  const mescolato = mescolaConSeme(ordinaBanco(banco), seme);
  const categorie = new Set(mescolato.map(v => v.category));
  const tetto = Math.ceil(n / Math.max(1, categorie.size));
  const scelte: VoceBanco[] = [];
  const perCategoria = new Map<string, number>();
  for (const v of mescolato) {
    if (scelte.length >= n) break;
    const gia = perCategoria.get(v.category) ?? 0;
    if (gia >= tetto) continue;
    perCategoria.set(v.category, gia + 1);
    scelte.push(v);
  }
  for (const v of mescolato) {
    if (scelte.length >= n) break;
    if (!scelte.includes(v)) scelte.push(v);
  }
  return scelte.map(v => v.id);
}

/** Ordine delle opzioni mostrato per una domanda: `ordine[i]` = indice originale dell'opzione mostrata in posizione i. */
export function ordineOpzioni(seme: string, idDomanda: string, quante: number): number[] {
  return mescolaConSeme(Array.from({ length: quante }, (_, i) => i), `${seme}|${idDomanda}`);
}

/** Il seme della sfida del giorno: la data locale, uguale per tutti nello stesso giorno. */
export function semeDelGiorno(d: Date = new Date()): string {
  return `g-${chiaveGiorno(d)}`;
}

const ALFABETO = 'abcdefghjkmnpqrstuvwxyz23456789';
/** Un seme nuovo per un duello (8 caratteri, nessun carattere ambiguo). */
export function nuovoSeme(caso: () => number = Math.random): string {
  let s = 'd-';
  for (let i = 0; i < 8; i++) s += ALFABETO[Math.floor(caso() * ALFABETO.length)];
  return s;
}

/** Un identificativo casuale per distinguere i giocatori nei duelli (6 caratteri maiuscoli): non identifica nessuno. */
export function nuovoIdGiocatore(): string {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const byte = new Uint8Array(6);
  try { crypto.getRandomValues(byte); } catch { for (let i = 0; i < 6; i++) byte[i] = Math.floor(Math.random() * 256); }
  return Array.from(byte, b => alfabeto[b % alfabeto.length]).join('');
}
