// Ritorno dal link inviato per email (accesso al Project ID o verifica di un indirizzo PoliMi): lo si chiama all'avvio dell'app (App.tsx) o aprendo Project ID.
// Se l'indirizzo della pagina non è un link di Firebase non fa niente e non carica Firebase. Se lo è, completa l'operazione (lib/firebase.ts) e, solo per una
// verifica riuscita per la stessa email, scrive il badge «studente PoliMi». Non lancia mai.
import type { AppState } from '../../types';
import { ritornoDaLink, type EsitoRitorno } from '../firebase';
import { segnaStudentePoliMi } from './profilo';

let inCorso: Promise<EsitoRitorno> | null = null;

/**
 * `aggiorna` cambia lo stato. Il codice del link si usa una volta sola: chiamate ripetute (per esempio dal doppio avvio degli effetti in sviluppo)
 * restituiscono lo stesso esito.
 */
export function applicaRitornoVerifica(_leggi: () => AppState, aggiorna: (fn: (s: AppState) => AppState) => void): Promise<EsitoRitorno> {
  if (!inCorso) {
    inCorso = ritornoDaLink().then(esito => {
      if (esito.tipo === 'ok' && esito.scopo === 'verifica') aggiorna(s => segnaStudentePoliMi(s, esito.email));
      return esito;
    });
  }
  return inCorso;
}
