// Permessi che un'app Project può chiedere al Project ID. Devono coincidere con quelli mostrati dalle app (app/src/config/ecosystem.ts).
// Restano solo quelli che hanno un uso reale: il profilo di base (l'account stesso) e la classifica NOI.
// «Personalizzazione ATLAS» e «progress.share» non esistono più: nessun codice li usava.

/** Versione del testo dei consensi (classifica NOI e comunicazioni): una sola, registrata in `consent_log` con ogni scelta. Si cambia a ogni cambio di testo, qui e in app. */
export const CONSENT_VERSION = '2026-10-17';

export const SCOPES = {
  profile: { required: true },            // l'account (email e identificativo): servizio richiesto, non è un consenso
  'noi.leaderboard': { required: false }, // @nome utente, domande imparate e miglior simulazione visibili a tutti in classifica
} as const;

export type Scope = keyof typeof SCOPES;

export function isScope(value: unknown): value is Scope {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(SCOPES, value);
}
