// «Come ci hai conosciuto?»: le risposte sono scelte da chi legge, nessuna è suggerita. Salvate e inviate come id brevi (a-z, 0-9, trattino).
// (Il nome del file è storico: i corsi di laurea stanno ora in lib/progetto/percorso.ts.)

export const PROVENIENZE = [
  { id: 'gruppo-chat', nome: 'Gruppo o chat' },
  { id: 'instagram', nome: 'Instagram' },
  { id: 'amici', nome: 'Amici' },
  { id: 'altro', nome: 'Altro' },
] as const;
export type Provenienza = (typeof PROVENIENZE)[number]['id'];

export const eProvenienza = (v: unknown): v is Provenienza => typeof v === 'string' && PROVENIENZE.some(p => p.id === v);
export const nomeProvenienza = (id: string | undefined): string | undefined => PROVENIENZE.find(p => p.id === id)?.nome;

/** Le risposte salvate dalla prima versione della registrazione (testo) si rileggono come id. */
const VECCHIE: Record<string, Provenienza> = {
  'gruppo o chat': 'gruppo-chat', 'instagram (polimi.agora)': 'instagram', 'amici o compagni': 'amici', 'ricerca su internet': 'altro', altro: 'altro',
};
export function provenienzaDa(v: unknown): Provenienza | undefined {
  if (eProvenienza(v)) return v;
  return typeof v === 'string' ? VECCHIE[v.trim().toLowerCase()] : undefined;
}
