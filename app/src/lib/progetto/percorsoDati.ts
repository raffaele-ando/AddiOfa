// Il collegamento tra la cascata (percorso.ts) e i dati dei corsi. Oggi i dati sono quelli di PROVA (percorsoProva.ts, corsi finti);
// quando esiste `src/data/corsi.ts` basta sostituire `fonteCorsi` con un adattatore su sediDellaScuola, livelliDisponibili,
// corsiDisponibili e anniDelCorso, e cancellare percorsoProva.ts.
import { NOMI_LIVELLO, type FonteCorsi, type LivelloId, type Opzione } from './percorso';
import { fonteProva } from './percorsoProva';

export const fonteCorsi: FonteCorsi = fonteProva;
/** Vero finché i dati sono quelli di prova (la schermata lo dice solo in sviluppo). */
export const DATI_DI_PROVA = true;

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
