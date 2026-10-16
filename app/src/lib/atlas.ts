// Client dell'API ATLAS (il Worker Cloudflare in atlas/). Due modi di chiamare:
//  - pubblico, senza token: l'iscrizione (`POST /v1/signups`), che l'app fa subito dopo la registrazione;
//  - con il token del login Google (Project ID): account, permessi, classifica NOI, esportazione e cancellazione.
// Se `VITE_ATLAS_API_URL` non c'è, ogni chiamata si rifiuta con AtlasNonConfigurato: l'app lo dice con una riga vera e resta locale.
import { getIdToken } from './firebase';
import { ATLAS_API_URL, CONSENT_VERSION, ECOSYSTEM, type ScopeId } from '../config/ecosystem';

export interface ProjectAccount {
  id: string;
  email: string | null;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  polimiEmail?: string | null;
  createdAt: number;
}

export interface AppLink {
  appId: string;
  scopes: ScopeId[];
  consentVersion: string;
  grantedAt: number;
  updatedAt: number;
}

export interface SignupRemota {
  email: string;
  nome: string;
  corso: string | null;
  sede: string | null;
  provenienza: string | null;
  consensi: { noi: boolean; atlas: boolean; comunicazioni: boolean };
  emailVerificata: boolean;
  creatoIl: number;
  aggiornatoIl: number;
}

export interface MeRisposta {
  account: ProjectAccount;
  links: AppLink[];
  profile?: { nome: string; corso: string | null; sede: string | null };
  consensi?: { noi: boolean; atlas: boolean; comunicazioni: boolean } | null;
  signup?: SignupRemota | null;
}

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  mastered: number;
  bestSim: number;
  isMe: boolean;
}

export interface Leaderboard {
  appId?: string;
  total: number;
  entries: LeaderboardEntry[];
  me: { rank: number; mastered: number; bestSim: number } | null;
}

/** Il servizio non ha un indirizzo configurato (nessuna chiamata è partita). */
export class AtlasNonConfigurato extends Error {
  constructor() { super(`${ECOSYSTEM.engineName} non è collegato in questa versione`); }
}

/** Il servizio ha risposto con un errore (`stato` = codice HTTP) oppure non ha risposto (`stato` = 0: rete, DNS, CORS, timeout). */
export class AtlasErrore extends Error {
  constructor(public stato: number, messaggio: string) { super(messaggio); }
}

export const isAtlasOnline = (): boolean => !!ATLAS_API_URL;

type FetchLike = typeof fetch;
export interface OpzioniChiamata { baseUrl?: string; fetchImpl?: FetchLike; token?: string | null; timeoutMs?: number }

/** Una chiamata HTTP al Worker. `autenticata`: serve il login (token Firebase). Lancia AtlasNonConfigurato o AtlasErrore. */
export async function chiama<T>(percorso: string, init: RequestInit = {}, autenticata = true, opz: OpzioniChiamata = {}): Promise<T> {
  const base = (opz.baseUrl ?? ATLAS_API_URL)?.replace(/\/+$/, '');
  if (!base) throw new AtlasNonConfigurato();
  const headers = new Headers(init.headers);
  const token = opz.token !== undefined ? opz.token : await getIdToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  else if (autenticata) throw new AtlasErrore(401, 'login richiesto');
  if (init.body) headers.set('Content-Type', 'application/json');
  const f = opz.fetchImpl ?? fetch;
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), opz.timeoutMs ?? 15000) : null;
  let res: Response;
  try {
    res = await f(`${base}${percorso}`, { ...init, headers, signal: ctl?.signal });
  } catch {
    throw new AtlasErrore(0, `${ECOSYSTEM.engineName} non risponde`);
  } finally {
    if (timer) clearTimeout(timer);
  }
  const dati = await res.json().catch(() => ({}));
  if (!res.ok) throw new AtlasErrore(res.status, (dati as { error?: string }).error || `errore ${res.status}`);
  return dati as T;
}

export interface CorpoIscrizione {
  appId: string;
  nome: string;
  email: string;
  corso?: string;
  sede?: string;
  provenienza?: string;
  consensi: { noi: boolean; atlas: boolean; comunicazioni: boolean };
  consentVersion: string;
}

export const atlas = {
  /** Iscrizione pubblica, senza token. Il Worker risponde sempre `{ ok: true }` (non dice se l'email esisteva già). */
  iscrivi: (corpo: CorpoIscrizione, opz?: OpzioniChiamata) =>
    chiama<{ ok: boolean }>('/v1/signups', { method: 'POST', body: JSON.stringify(corpo) }, false, { ...opz, token: null }),
  me: () => chiama<MeRisposta>('/v1/me'),
  updateMe: (patch: { displayName?: string; handle?: string; polimiEmail?: string | null; corso?: string | null; sede?: string | null; provenienza?: string | null }) =>
    chiama<MeRisposta>('/v1/me', { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteMe: () => chiama<{ deleted: boolean }>('/v1/me', { method: 'DELETE' }),
  exportMe: () => chiama<unknown>('/v1/me/export'),
  setLink: (appId: string, scopes: ScopeId[], polimiEmail?: string | null) =>
    chiama<MeRisposta>(`/v1/links/${appId}`, {
      method: 'PUT',
      body: JSON.stringify({ scopes, consentVersion: CONSENT_VERSION, ...(polimiEmail !== undefined ? { polimiEmail } : {}) }),
    }),
  removeLink: (appId: string) => chiama<{ links: AppLink[] }>(`/v1/links/${appId}`, { method: 'DELETE' }),
  postScore: (appId: string, mastered: number, bestSim: number) =>
    chiama<{ score: number }>(`/v1/noi/${appId}/score`, { method: 'POST', body: JSON.stringify({ mastered, bestSim }) }),
  /** La classifica è pubblica; con il login include anche la tua posizione. */
  leaderboard: (appId: string, limit = 50) =>
    chiama<Leaderboard>(`/v1/noi/${appId}/leaderboard?limit=${limit}`, {}, false),
};
