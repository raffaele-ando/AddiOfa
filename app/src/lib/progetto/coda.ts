// La coda di invio dell'iscrizione ad ATLAS NON esiste più: all'avvio non si invia niente a nessuno (docs/design/PRIVACY-LEGGE.md, regola 3) e le richieste
// ad ATLAS partono solo da un gesto dell'utente, con l'esito mostrato subito. Resta questo modulo con `coda.avvia()` perché App.tsx lo chiama ancora:
// non fa nessuna richiesta di rete; cancella soltanto la vecchia coda salvata dalle versioni precedenti (conteneva nome ed email) e non lascia ascoltatori.
export const CHIAVE_CODA = 'addiofa_progetto_coda';

/** Toglie dal dispositivo la coda delle versioni precedenti. Non lancia mai. Restituisce true se c'era qualcosa da togliere. */
export function ripulisciVecchiaCoda(archivio: Pick<Storage, 'getItem' | 'removeItem'> | undefined = typeof localStorage === 'undefined' ? undefined : localStorage): boolean {
  try {
    if (!archivio || archivio.getItem(CHIAVE_CODA) === null) return false;
    archivio.removeItem(CHIAVE_CODA);
    return true;
  } catch {
    return false;
  }
}

export const coda = {
  /** Nessuna richiesta di rete, nessun timer: solo la pulizia della vecchia coda. */
  avvia(): void { ripulisciVecchiaCoda(); },
};
