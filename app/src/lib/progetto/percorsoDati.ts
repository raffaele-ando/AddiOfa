// Il collegamento tra la cascata (percorso.ts) e i dati ufficiali dei corsi (src/data/corsi.ts, generato da contenuti/corsi/corsi-polimi.json,
// a.a. 2026/27). Le sedi senza corsi attivi non compaiono mai (lo garantisce data/corsi.ts). I corsi sono una voce per sede.
import { corsiDisponibili, livelliDisponibili, scuole, sediDellaScuola, anniDelCorso, VERSIONE_CORSI } from '../../data/corsi';
import { NOMI_LIVELLO, type FonteCorsi, type LivelloId, type Opzione, type OpzioneCorso } from './percorso';

const ORDINE: LivelloId[] = ['triennale', 'ciclo-unico', 'magistrale'];

export const fonteCorsi: FonteCorsi = {
  scuole: () => scuole.map(s => ({ id: s.id, nome: s.nome })),
  sedi: scuola => sediDellaScuola(scuola).map(s => ({ id: s.id, nome: s.nome })),
  livelli(scuola, sede) {
    const sedi = sede ? [sede] : sediDellaScuola(scuola).map(s => s.id);
    const presenti = new Set<LivelloId>(sedi.flatMap(s => livelliDisponibili(scuola, s)));
    return ORDINE.filter(l => presenti.has(l));
  },
  corsi(scuola, sede, livello) {
    const sedi = sede ? [sede] : sediDellaScuola(scuola).map(s => s.id);
    const out: OpzioneCorso[] = [];
    for (const s of sedi) {
      for (const l of (livello ? [livello] : livelliDisponibili(scuola, s))) {
        out.push(...corsiDisponibili(scuola, s, l).map(c => ({ id: c.id, nome: c.nome, anni: anniDelCorso(c).length })));
      }
    }
    return out;
  },
};

/** Versione dei dati dei corsi (a.a.). */
export const VERSIONE_DATI_CORSI = VERSIONE_CORSI;

export const nomeScuola = (id: string | undefined, fonte: FonteCorsi = fonteCorsi): string | undefined => fonte.scuole().find(s => s.id === id)?.nome;

export function nomeSede(id: string | undefined, fonte: FonteCorsi = fonteCorsi): string | undefined {
  if (!id) return undefined;
  const tutte: Opzione[] = fonte.scuole().flatMap(s => fonte.sedi(s.id));
  return tutte.find(s => s.id === id)?.nome;
}

export interface RigaPercorso { etichetta: string; valore: string }

/** Il percorso di studi del profilo, riga per riga, con i nomi leggibili (per Project ID e per il Profilo). Vuoto se non è stato indicato. */
export function riepilogoPercorso(p: { scuola?: string; sede?: string; livello?: LivelloId; corso?: string; anno?: number } | undefined, fonte: FonteCorsi = fonteCorsi): RigaPercorso[] {
  if (!p) return [];
  const righe: RigaPercorso[] = [];
  if (p.corso) righe.push({ etichetta: 'Corso', valore: p.corso });
  if (p.livello) righe.push({ etichetta: 'Livello', valore: NOMI_LIVELLO[p.livello] });
  if (p.anno) righe.push({ etichetta: 'Anno', valore: `${p.anno}°` });
  const scuola = nomeScuola(p.scuola, fonte);
  if (scuola) righe.push({ etichetta: 'Scuola', valore: scuola });
  const sede = nomeSede(p.sede, fonte) ?? p.sede;
  if (sede) righe.push({ etichetta: 'Sede', valore: sede });
  return righe;
}

/** Una riga sola: «Corso · 2° anno · Triennale». */
export function percorsoInUnaRiga(p: Parameters<typeof riepilogoPercorso>[0]): string {
  if (!p) return '';
  return [p.corso, p.anno ? `${p.anno}° anno` : '', p.livello ? NOMI_LIVELLO[p.livello] : ''].filter(Boolean).join(' · ');
}
