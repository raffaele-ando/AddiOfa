// Verifica dell'email con un link (Firebase Auth `sendSignInLinkToEmail`). Questo file è la parte PURA: impostazioni del link, riconoscimento del
// ritorno dal link, confronto tra l'email del link e quella del profilo, traduzione degli errori in una riga onesta. Le chiamate vere a Firebase
// stanno in lib/firebase.ts. Regola: `emailVerificata` diventa true SOLO dopo un `signInWithEmailLink` riuscito per la stessa email del profilo;
// in ogni altro caso (errore, offline, provider non abilitato, dominio non autorizzato) l'etichetta resta «non verificata» e si dice perché.

/** Dove si salva (nel browser) l'email a cui si è inviato il link e per quale scopo: serve al ritorno per completare l'operazione. Si cancella al ritorno. */
export const CHIAVE_VERIFICA_EMAIL = 'addiofa_verifica_email';

/** Un link serve a due cose diverse: entrare nel Project ID con l'email («accesso») oppure provare che un indirizzo PoliMi è tuo («verifica», per il badge studente). */
export type ScopoLink = 'accesso' | 'verifica';

export interface LinkPendente { email: string; scopo: ScopoLink }

export const serializzaPendente = (p: LinkPendente): string => JSON.stringify({ email: p.email.trim().toLowerCase(), scopo: p.scopo });

/** Rilegge ciò che si è salvato all'invio. Un testo semplice (versione precedente) era sempre una verifica. Null se non si capisce. */
export function leggiPendente(raw: string | null | undefined): LinkPendente | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<LinkPendente>;
    if (v && typeof v.email === 'string' && v.email && (v.scopo === 'accesso' || v.scopo === 'verifica')) return { email: v.email, scopo: v.scopo };
    return null;
  } catch {
    return raw.includes('@') ? { email: raw.trim().toLowerCase(), scopo: 'verifica' } : null;
  }
}

export interface ImpostazioniLink { url: string; handleCodeInApp: true }

/** Il link riporta alla stessa pagina, senza parametri: l'app la riconosce dal codice che Firebase aggiunge. */
export function impostazioniLink(base: { origin: string; pathname: string }): ImpostazioniLink {
  return { url: `${base.origin}${base.pathname}`, handleCodeInApp: true };
}

/** Vero se l'indirizzo sembra un link di accesso via email di Firebase (mode=signIn e oobCode). Serve a non caricare Firebase per niente. */
export function sembraLinkDiAccesso(search: string): boolean {
  const q = new URLSearchParams(search);
  return q.get('mode') === 'signIn' && !!q.get('oobCode');
}

/** L'email del link coincide con quella del profilo (senza badare a maiuscole e spazi)? Solo allora si può segnare «verificata». */
export function emailCoincide(profilo: string | undefined, link: string | null | undefined): boolean {
  if (!profilo || !link) return false;
  return profilo.trim().toLowerCase() === link.trim().toLowerCase();
}

export type FaseVerifica = 'invio' | 'ritorno';

/** Una riga vera per ogni errore che Firebase può dare. Mai «verificata»: l'etichetta resta «non verificata». */
export function messaggioVerifica(codice: string | undefined, fase: FaseVerifica = 'invio'): string {
  switch (codice) {
    case 'auth/operation-not-allowed':
      return 'L\'accesso con link non è abilitato nel progetto: per ora l\'email resta non verificata.';
    case 'auth/unauthorized-continue-uri':
    case 'auth/invalid-continue-uri':
    case 'auth/missing-continue-uri':
      return 'Questo indirizzo del sito non è autorizzato per il link: l\'email resta non verificata.';
    case 'auth/network-request-failed':
      return 'Sei offline o il servizio non risponde: l\'email resta non verificata. Riprova più tardi.';
    case 'auth/too-many-requests':
    case 'auth/quota-exceeded':
      return 'Troppi tentativi o limite del servizio raggiunto: riprova più tardi.';
    case 'auth/invalid-email':
      return 'L\'indirizzo non è valido per l\'invio del link.';
    case 'auth/expired-action-code':
      return 'Il link è scaduto: chiedine uno nuovo.';
    case 'auth/invalid-action-code':
      return 'Il link non è valido o è già stato usato: chiedine uno nuovo.';
    case 'auth/user-disabled':
      return 'Questo indirizzo non può essere verificato.';
    case 'auth/email-already-in-use':
    case 'auth/credential-already-in-use':
      return 'Questo indirizzo è già legato a un altro accesso: l\'email resta non verificata.';
    case 'nessuna-email-salvata':
      return 'Apri il link dallo stesso browser in cui l\'hai chiesto: qui non so a quale indirizzo si riferisce.';
    case 'email-diversa':
      return 'Il link è per un indirizzo diverso da quello del profilo: l\'email resta non verificata.';
    default:
      return fase === 'invio' ? 'Non sono riuscito a inviare il link: l\'email resta non verificata.' : 'Non sono riuscito a completare la verifica: l\'email resta non verificata.';
  }
}
