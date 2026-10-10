// Tipi e dati comuni dei testi legali. I dati del venditore stanno qui, in un solo punto:
// finché sono "[da compilare]" i testi restano una bozza (LEGAL_DRAFT in index.ts).

export interface LegalSezione {
  titolo: string;
  paragrafi: string[];
  elenco?: string[];
  /** Solo nel documento del recesso: dopo questa sezione la schermata inserisce il modulo "Recedi dal contratto qui". */
  modulo?: boolean;
}

export interface LegalDoc {
  titolo: string;
  /** Data di ultimo aggiornamento, già scritta per esteso. */
  aggiornato: string;
  sezioni: LegalSezione[];
}

export const LEGAL_SELLER = {
  nome: '[da compilare]',
  indirizzo: '[da compilare]',
  email: '[da compilare]',
  partitaIva: '[da compilare]',
};

export const LEGAL_AGGIORNATO = '10 ottobre 2026';

/** Righe con i dati del venditore, riusate in termini, privacy e recesso. */
export function righeVenditore(): string[] {
  return [
    `Nome o ragione sociale: ${LEGAL_SELLER.nome}`,
    `Indirizzo: ${LEGAL_SELLER.indirizzo}`,
    `Email: ${LEGAL_SELLER.email}`,
    `Partita IVA: ${LEGAL_SELLER.partitaIva}`,
  ];
}
