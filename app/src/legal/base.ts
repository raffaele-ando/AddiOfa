// Tipi e dati comuni dei testi legali di un sito gratuito, senza account, senza pagamenti e senza server.

export interface LegalSezione {
  titolo: string;
  paragrafi: string[];
  elenco?: string[];
}

export interface LegalDoc {
  titolo: string;
  /** Data di ultimo aggiornamento, già scritta per esteso. */
  aggiornato: string;
  sezioni: LegalSezione[];
}

export const LEGAL_AGGIORNATO = '16 ottobre 2026';

/** Avvertenza di indipendenza: una sola frase (config/offer.ts), usata nelle pagine legali, nel piè di pagina e dietro le «i». */
export { DISCLAIMER as AVVERTENZA_INDIPENDENZA } from '../config/offer';
