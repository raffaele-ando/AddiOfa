// Le carte di «Esplora»: ognuna dice se è disponibile ora o richiede un collegamento. Logica pura, provata in tests/unit.

export type Disponibilita = 'ora' | 'collegamento' | 'presto';

export interface CartaEsplora {
  id: string;
  /** Dove porta: una schermata extra o l'apertura degli inviti. */
  vai: { schermata: string } | { inviti: true };
  gruppo: 'studio' | 'ecosistema' | 'aiuto';
  /** Disponibilità a prescindere dalle altre schermate (se `schermata` non esiste ancora, vedi disponibilitaCarta). */
  base: Disponibilita;
}

export const CARTE_ESPLORA: readonly CartaEsplora[] = [
  { id: 'atlas-analisi', vai: { schermata: 'atlas-analisi' }, gruppo: 'studio', base: 'ora' },
  { id: 'frasi', vai: { schermata: 'frasi' }, gruppo: 'studio', base: 'ora' },
  { id: 'percorso', vai: { schermata: 'percorso' }, gruppo: 'studio', base: 'ora' },
  { id: 'projectid', vai: { schermata: 'projectid' }, gruppo: 'ecosistema', base: 'ora' },
  { id: 'noi', vai: { schermata: 'noi' }, gruppo: 'ecosistema', base: 'collegamento' },
  { id: 'agora', vai: { schermata: 'agora' }, gruppo: 'ecosistema', base: 'presto' },
  { id: 'faq', vai: { schermata: 'faq' }, gruppo: 'aiuto', base: 'ora' },
  { id: 'inviti', vai: { inviti: true }, gruppo: 'aiuto', base: 'ora' },
  { id: 'segnala', vai: { schermata: 'segnala' }, gruppo: 'aiuto', base: 'ora' },
];

/**
 * Disponibilità vera di una carta: una schermata non ancora registrata nell'app è «presto», anche se sulla carta sarebbe pronta.
 * `schermate` = gli id delle schermate extra che esistono davvero. `collegamentoAttivo` = il Project ID si può usare ora
 * (con il collegamento attivo la carta «collegamento» passa a «ora»).
 */
export function disponibilitaCarta(carta: CartaEsplora, schermate: ReadonlySet<string>, collegamentoAttivo: boolean): Disponibilita {
  if ('schermata' in carta.vai && !schermate.has(carta.vai.schermata)) return 'presto';
  if (carta.base === 'collegamento') return collegamentoAttivo ? 'ora' : 'collegamento';
  return carta.base;
}

export const ETICHETTA_DISPONIBILITA: Record<Disponibilita, string> = {
  ora: 'Disponibile ora',
  collegamento: 'Richiede il Project ID',
  presto: 'Non ancora attiva',
};
