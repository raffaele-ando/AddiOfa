// Permessi che un'app Project può chiedere al Project ID. Devono coincidere con quelli mostrati
// nella schermata di consenso delle app (OfaEnglish/src/config/ecosystem.ts).

export const CONSENT_VERSION = '2026-09-27';

export const SCOPES = {
  profile: { required: true },            // nome, foto ed email del Project ID
  'progress.share': { required: false },  // progressi di studio condivisi con le altre app Project
  'noi.leaderboard': { required: false }, // @nome e punteggio visibili nella classifica NOI
  'atlas.personalize': { required: false }, // ATLAS usa questi dati per personalizzare le altre app
} as const;

export type Scope = keyof typeof SCOPES;

export function isScope(value: unknown): value is Scope {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(SCOPES, value);
}
