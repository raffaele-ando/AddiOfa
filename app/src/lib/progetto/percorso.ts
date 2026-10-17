// «Cosa fai al Poli»: scelta a cascata, una scelta per schermata: Scuola → Sede → Livello → Corso → Anno. Qui c'è solo la logica, pura e senza rete:
// quali opzioni ha un passo dati le scelte già fatte, quali passi si saltano da soli (una sola scelta), come si torna indietro.
// I dati vengono da una «fonte» (data/corsi.ts, vedi percorsoDati.ts); nei test se ne passa una di prova.

export const SCUOLE_ID = ['ing-ind-inf', 'icat', 'auic', 'design'] as const;
export type ScuolaId = (typeof SCUOLE_ID)[number];
export const LIVELLI_ID = ['triennale', 'magistrale', 'ciclo-unico'] as const;
export type LivelloId = (typeof LIVELLI_ID)[number];
export const NOMI_LIVELLO: Record<LivelloId, string> = { triennale: 'Triennale', magistrale: 'Magistrale', 'ciclo-unico': 'Ciclo unico' };
export const ANNI_DEL_LIVELLO: Record<LivelloId, number> = { triennale: 3, magistrale: 2, 'ciclo-unico': 5 };

export const CORSO_ALTRO_ID = 'altro';
export const CORSO_ALTRO_NOME = 'Altro';

export interface Opzione { id: string; nome: string; /** Nome breve da mostrare nelle briciole (la sigla della scuola). */ sigla?: string }
export interface OpzioneCorso extends Opzione { anni: number }

/** I dati di cui la cascata ha bisogno. `sede` e `livello` assenti = «qualunque» (serve quando un passo è senza scelte e si salta). */
export interface FonteCorsi {
  scuole(): Opzione[];
  sedi(scuola: string): Opzione[];
  livelli(scuola: string, sede?: string): LivelloId[];
  corsi(scuola: string, sede?: string, livello?: LivelloId): OpzioneCorso[];
}

export type PassoPercorso = 'scuola' | 'sede' | 'livello' | 'corso' | 'anno';
export const PASSI: readonly PassoPercorso[] = ['scuola', 'sede', 'livello', 'corso', 'anno'];

/** Le scelte fatte: ids (il corso è l'id del corso o `altro`). */
export interface ScelteCorso { scuola?: string; sede?: string; livello?: LivelloId; corso?: string; anno?: number }

export function opzioniPasso(passo: PassoPercorso, s: ScelteCorso, fonte: FonteCorsi): Opzione[] {
  switch (passo) {
    case 'scuola': return fonte.scuole();
    case 'sede': return s.scuola ? fonte.sedi(s.scuola) : [];
    case 'livello': return s.scuola ? fonte.livelli(s.scuola, s.sede).map(l => ({ id: l, nome: NOMI_LIVELLO[l] })) : [];
    case 'corso': {
      if (!s.scuola) return [];
      return [...fonte.corsi(s.scuola, s.sede, s.livello).map(({ id, nome }) => ({ id, nome })), { id: CORSO_ALTRO_ID, nome: CORSO_ALTRO_NOME }];
    }
    case 'anno': {
      const n = anniDelCorso(s, fonte);
      return Array.from({ length: n }, (_, i) => ({ id: String(i + 1), nome: String(i + 1) }));
    }
  }
}

/** Quanti anni ha il corso scelto (3, 2, 5 o 6 secondo i dati); per «Altro» quelli del livello, o 5 se non si sa. */
export function anniDelCorso(s: ScelteCorso, fonte: FonteCorsi): number {
  const c = s.scuola && s.corso && s.corso !== CORSO_ALTRO_ID ? fonte.corsi(s.scuola, s.sede, s.livello).find(x => x.id === s.corso) : undefined;
  if (c) return Math.max(1, Math.min(6, c.anni));
  return s.livello ? ANNI_DEL_LIVELLO[s.livello] : 5;
}

export interface StatoCascata {
  /** Le scelte con i passi a scelta unica già compilati. */
  scelte: ScelteCorso;
  /** I passi compilati da soli (una sola scelta): nelle briciole si mostrano ma non si toccano. */
  automatici: PassoPercorso[];
  /** Il passo da chiedere ora, o null se il percorso è completo. */
  passo: PassoPercorso | null;
  opzioni: Opzione[];
}

const valoreDi = (s: ScelteCorso, p: PassoPercorso): string | undefined => {
  const v = s[p];
  return v === undefined ? undefined : String(v);
};

function assegna(s: ScelteCorso, p: PassoPercorso, id: string): ScelteCorso {
  return { ...s, [p]: p === 'anno' ? Number(id) : id } as ScelteCorso;
}

/** Applica i passi a scelta unica e dice cosa chiedere ora. Un passo senza nessuna scelta (dati mancanti) si salta senza compilarlo. */
export function risolvi(s: ScelteCorso, fonte: FonteCorsi): StatoCascata {
  let scelte = { ...s };
  const automatici: PassoPercorso[] = [];
  for (const passo of PASSI) {
    if (valoreDi(scelte, passo) !== undefined) continue;
    const opzioni = opzioniPasso(passo, scelte, fonte);
    if (opzioni.length === 0) continue; // niente da scegliere: si va avanti
    if (opzioni.length === 1) {
      scelte = assegna(scelte, passo, opzioni[0].id);
      automatici.push(passo);
      continue;
    }
    return { scelte, automatici, passo, opzioni };
  }
  return { scelte, automatici, passo: null, opzioni: [] };
}

/** Sceglie `id` al passo `passo` e dimentica tutto ciò che veniva dopo. */
export function scegli(s: ScelteCorso, passo: PassoPercorso, id: string): ScelteCorso {
  return assegna(torna(s, passo), passo, id);
}

/** Torna a `passo`: toglie questa scelta e tutte le successive (le briciole). */
export function torna(s: ScelteCorso, passo: PassoPercorso): ScelteCorso {
  const fuori = PASSI.slice(PASSI.indexOf(passo));
  const nuovo = { ...s } as Record<string, unknown>;
  for (const p of fuori) delete nuovo[p];
  return nuovo as ScelteCorso;
}

export interface Briciola { passo: PassoPercorso; id: string; nome: string; automatica: boolean }

/** Le scelte fatte, in ordine, con i nomi da mostrare (le briciole). */
export function briciole(s: ScelteCorso, automatici: readonly PassoPercorso[], fonte: FonteCorsi): Briciola[] {
  const out: Briciola[] = [];
  for (const passo of PASSI) {
    const v = valoreDi(s, passo);
    if (v === undefined) continue;
    const opz = passo === 'anno' ? undefined : opzioniPasso(passo, s, fonte).find(o => o.id === v);
    const nome = passo === 'anno' ? `${v}° anno` : opz?.sigla ?? opz?.nome ?? v;
    out.push({ passo, id: v, nome, automatica: automatici.includes(passo) });
  }
  return out;
}

/** Il percorso completo come lo si salva nel profilo. `corso` è il nome (come lo si legge nel profilo e lo riceve ATLAS). */
export interface EsitoPercorso { scuola: string; sede?: string; livello: LivelloId; corso: string; corsoId: string; anno: number }

export function esitoPercorso(s: ScelteCorso, fonte: FonteCorsi): EsitoPercorso | null {
  const r = risolvi(s, fonte);
  const c = r.scelte;
  if (r.passo !== null || !c.scuola || !c.livello || !c.corso || !c.anno) return null;
  const nome = c.corso === CORSO_ALTRO_ID ? CORSO_ALTRO_NOME : fonte.corsi(c.scuola, c.sede, c.livello).find(x => x.id === c.corso)?.nome ?? c.corso;
  return { scuola: c.scuola, ...(c.sede ? { sede: c.sede } : {}), livello: c.livello, corso: nome, corsoId: c.corso, anno: c.anno };
}

/** Ricerca nell'elenco dei corsi: tutte le parole, senza accenti e senza maiuscole. */
export function filtraCorsi<T extends Opzione>(corsi: readonly T[], testo: string): T[] {
  const norma = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const parole = norma(testo).split(/\s+/).filter(Boolean);
  if (parole.length === 0) return [...corsi];
  return corsi.filter(c => { const n = norma(c.nome); return parole.every(p => n.includes(p)); });
}

/** Sopra questo numero di corsi si mostra la ricerca. */
export const CORSI_PER_RICERCA = 8;
