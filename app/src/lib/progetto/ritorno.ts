// Ritorno dal link di verifica dell'email: lo si chiama all'avvio dell'app (o aprendo Project ID). Se l'indirizzo della pagina è un link di accesso di Firebase
// completa la verifica (lib/firebase.ts) e, solo in caso di successo per la stessa email del profilo, segna `emailVerificata: true`. Non lancia mai.
import type { AppState } from '../../types';
import { ritornoDaLinkVerifica, type EsitoRitorno } from '../firebase';
import { leggiProgetto, segnaEmailVerificata } from './profilo';

let inCorso: Promise<EsitoRitorno> | null = null;

/**
 * `leggi` dà lo stato attuale (per sapere l'email del profilo), `aggiorna` lo cambia. Il codice del link si può usare una volta sola: chiamate ripetute
 * (per esempio dal doppio avvio degli effetti in sviluppo) restituiscono lo stesso esito.
 */
export function applicaRitornoVerifica(leggi: () => AppState, aggiorna: (fn: (s: AppState) => AppState) => void): Promise<EsitoRitorno> {
  if (!inCorso) {
    inCorso = ritornoDaLinkVerifica(leggiProgetto(leggi()).profilo?.email).then(esito => {
      if (esito.tipo === 'ok') aggiorna(s => segnaEmailVerificata(s, esito.email));
      return esito;
    });
  }
  return inCorso;
}
