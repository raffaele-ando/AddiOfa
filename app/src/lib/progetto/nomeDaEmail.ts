// Il nome si ricava dall'email del Politecnico, così non si chiede due volte: `nome.cognome@mail.polimi.it` → «Nome Cognome».
// Puro, senza rete. Non è mai una certezza: la schermata mostra il risultato come conferma («Ciao Mario Rossi») con una matita per correggerlo.
// Quando la parte prima della chiocciola non dice un nome (`10501234@polimi.it`, `mrossi@…`, una sola parola) restituisce null: solo allora si chiede «Come ti chiami?».

export interface NomeDaEmail {
  /** Il nome da mostrare, con le iniziali maiuscole: «Anna Maria Bianchi». */
  nome: string;
  /** Le parole che lo compongono, nell'ordine dell'indirizzo: ['Anna', 'Maria', 'Bianchi']. Più di due = nome composto (si mostra tutto, con la matita per correggere). */
  parti: string[];
}

const SEPARATORI = /[._]+/;

/** «d'arco» → «D'Arco», «maria-chiara» → «Maria-Chiara»: maiuscola a ogni inizio di segmento. */
function maiuscole(parola: string): string {
  return parola.replace(/(^|['’-])([a-zà-öø-ÿ])/g, (_t, prima: string, lettera: string) => prima + lettera.toUpperCase());
}

/**
 * Ricava il nome dalla parte locale di un indirizzo (o da un indirizzo intero). Regole:
 *  - si guarda solo prima della chiocciola, in minuscolo, e si toglie un eventuale «+etichetta»;
 *  - si separa sui punti (e sui trattini bassi), si tolgono le cifre (`nome.cognome2`);
 *  - servono almeno due parole di almeno due lettere ciascuna, fatte solo di lettere (con apostrofo o trattino dentro);
 *  - altrimenti null (matricola, una sola parola, iniziali: non si indovina).
 */
export function nomeDaEmail(email: string): NomeDaEmail | null {
  const locale = (email ?? '').trim().toLowerCase().split('@')[0].split('+')[0];
  if (!locale) return null;
  const parole = locale.split(SEPARATORI).map(p => p.replace(/\d+/g, '')).filter(Boolean);
  if (parole.length < 2) return null;
  const LETTERE = /^[a-zà-öø-ÿ]+(?:['’-][a-zà-öø-ÿ]+)*$/;
  if (!parole.every(p => p.length >= 2 && LETTERE.test(p))) return null;
  const parti = parole.map(maiuscole);
  return { nome: parti.join(' '), parti };
}
