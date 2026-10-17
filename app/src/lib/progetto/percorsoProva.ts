// DATI DI PROVA, DA SCARTARE: servono finché `src/data/corsi.ts` (ricerca sulle fonti ufficiali, agente CORSI) non esiste. I corsi qui sono finti
// di proposito («Corso di prova …»): nessun corso vero è inventato. La struttura copre i casi della cascata: sede unica (si salta), un solo livello,
// più di 8 corsi (compare la ricerca), ciclo unico. Quando arriva `data/corsi.ts`, si cambia l'import in `percorsoDati.ts` e questo file si cancella.
import type { FonteCorsi, LivelloId, Opzione, OpzioneCorso } from './percorso';

const SCUOLE: Opzione[] = [
  { id: 'ing-ind-inf', nome: 'Ingegneria Industriale e dell\'Informazione' },
  { id: 'icat', nome: 'Ingegneria Civile, Ambientale e Territoriale' },
  { id: 'auic', nome: 'Architettura Urbanistica Ingegneria delle Costruzioni' },
  { id: 'design', nome: 'Design' },
];

const SEDI: Record<string, Opzione[]> = {
  'ing-ind-inf': [{ id: 'leonardo', nome: 'Milano Leonardo' }, { id: 'bovisa', nome: 'Milano Bovisa' }, { id: 'lecco', nome: 'Lecco' }],
  icat: [{ id: 'leonardo', nome: 'Milano Leonardo' }, { id: 'lecco', nome: 'Lecco' }],
  auic: [{ id: 'leonardo', nome: 'Milano Leonardo' }],
  design: [{ id: 'bovisa', nome: 'Milano Bovisa' }],
};

const corsi = (prefisso: string, n: number, anni: number): OpzioneCorso[] => Array.from({ length: n }, (_, i) => ({ id: `${prefisso}-${i + 1}`, nome: `Corso di prova ${prefisso.toUpperCase()} ${i + 1}`, anni }));

// scuola → sede → livello → corsi
const CORSI: Record<string, Record<string, Partial<Record<LivelloId, OpzioneCorso[]>>>> = {
  'ing-ind-inf': {
    leonardo: { triennale: corsi('ii-l-t', 12, 3), magistrale: corsi('ii-l-m', 9, 2) },
    bovisa: { triennale: corsi('ii-b-t', 5, 3), magistrale: corsi('ii-b-m', 4, 2) },
    lecco: { triennale: corsi('ii-c-t', 2, 3) },
  },
  icat: {
    leonardo: { triennale: corsi('ic-l-t', 3, 3), magistrale: corsi('ic-l-m', 3, 2) },
    lecco: { triennale: corsi('ic-c-t', 1, 3) },
  },
  auic: { leonardo: { triennale: corsi('au-l-t', 3, 3), magistrale: corsi('au-l-m', 4, 2), 'ciclo-unico': corsi('au-l-u', 1, 5) } },
  design: { bovisa: { triennale: corsi('de-b-t', 3, 3), magistrale: corsi('de-b-m', 2, 2) } },
};

const livelliDi = (scuola: string, sede?: string): LivelloId[] => {
  const sedi = sede ? [sede] : Object.keys(CORSI[scuola] ?? {});
  const set = new Set<LivelloId>();
  for (const s of sedi) for (const l of Object.keys(CORSI[scuola]?.[s] ?? {}) as LivelloId[]) set.add(l);
  return (['triennale', 'magistrale', 'ciclo-unico'] as LivelloId[]).filter(l => set.has(l));
};

export const fonteProva: FonteCorsi = {
  scuole: () => SCUOLE,
  sedi: scuola => SEDI[scuola] ?? [],
  livelli: livelliDi,
  corsi(scuola, sede, livello) {
    const sedi = sede ? [sede] : Object.keys(CORSI[scuola] ?? {});
    const out: OpzioneCorso[] = [];
    for (const s of sedi) {
      const per = CORSI[scuola]?.[s] ?? {};
      for (const l of (livello ? [livello] : (Object.keys(per) as LivelloId[]))) out.push(...(per[l] ?? []));
    }
    return out;
  },
};
