// Tipi e dati comuni dei testi legali di AddiOFA: sito gratuito e senza pagamenti; si studia senza dare nessun dato. Project ID, classifica NOI e
// comunicazioni sono facoltativi e si attivano solo con un gesto dell'utente (docs/design/PRIVACY-LEGGE.md).
import { ECOSYSTEM } from '../config/ecosystem';
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

export const LEGAL_AGGIORNATO = '18 ottobre 2026';

/** Avvertenza di indipendenza: una sola frase (config/offer.ts), usata nelle pagine legali, nel piè di pagina e dietro le «i». */
export { DISCLAIMER as AVVERTENZA_INDIPENDENZA } from '../config/offer';

/** Il titolare del trattamento come è scritto in config/offer.ts. Finché il nome non c'è non se ne inventa uno: si dice che è l'autore, persona fisica. */
export function rigaTitolare(): string {
  if (!TITOLARE.nome) return 'Titolare del trattamento: l\'autore di AddiOFA, una persona fisica. Nome e recapito si indicano in questa pagina prima di collegare ATLAS; senza ATLAS collegato non raccogliamo nessun dato.';
  return `Titolare del trattamento: ${TITOLARE.nome}${TITOLARE.indirizzo ? `, ${TITOLARE.indirizzo}` : ''}.`;
}

/** La riga del contatto, solo se esiste un indirizzo vero: altrimenti nessuna riga (non si rimanda a un contatto che non c'è). */
export function rigaContatto(): string[] {
  return CONTACT_EMAIL ? [`Contatto del titolare: ${CONTACT_EMAIL}. Rispondiamo entro un mese (prorogabile di due, se serve).`] : [];
}

/** Come si cancellano i dati su ATLAS: sempre la strada dentro l'app; il contatto si aggiunge solo se c'è. */
export function testoCancellazioneDati(): string {
  const strada = `accedi da «${ECOSYSTEM.accountName}» ed elimina il ${ECOSYSTEM.accountName}: ${ECOSYSTEM.engineName} cancella l'account, i permessi, il punteggio, l'email delle comunicazioni e il registro dei consensi`;
  return `${strada[0].toUpperCase()}${strada.slice(1)}.${CONTACT_EMAIL ? ` Se non hai un account, scrivi a ${CONTACT_EMAIL}.` : ''}`;
}
