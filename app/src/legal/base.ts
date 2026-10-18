// Tipi e dati comuni dei testi legali di AddiOFA: sito gratuito e senza pagamenti; si studia senza account, con nome ed email PoliMi
// chiesti all'inizio (inviati ad ATLAS, il servizio di Project) e un Project ID facoltativo.
import { CONTACT_EMAIL, TITOLARE } from '../config/offer';

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

/** «Project (Nome Cognome), indirizzo»: il titolare come è scritto in config/offer.ts, con le sole parti che esistono. */
export function descrizioneTitolare(): string {
  return [TITOLARE.nome, TITOLARE.responsabile ? `(${TITOLARE.responsabile})` : '', TITOLARE.indirizzo ? `, ${TITOLARE.indirizzo}` : ''].join(' ').replace(/ ,/g, ',').replace(/\s+/g, ' ').trim();
}

/** La riga del contatto, solo se esiste un indirizzo vero: altrimenti nessuna riga (non si rimanda a un contatto che non c'è). */
export function rigaContatto(): string[] {
  return CONTACT_EMAIL ? [`Contatto del titolare: ${CONTACT_EMAIL}.`] : [];
}

/** Come si cancella un'iscrizione inviata senza Project ID: sempre la strada dentro l'app; il contatto si aggiunge solo se c'è. */
export function testoCancellazioneIscrizione(): string {
  const strada = 'accedi con Google da «Project ID», collega la tua iscrizione ed elimina il Project ID: ATLAS cancella l\'account, i permessi, il punteggio e l\'iscrizione con il suo registro dei consensi';
  return CONTACT_EMAIL ? `${strada[0].toUpperCase()}${strada.slice(1)}. Oppure scrivi a ${CONTACT_EMAIL} dall\'indirizzo che hai usato per iscriverti.` : `${strada[0].toUpperCase()}${strada.slice(1)}.`;
}
