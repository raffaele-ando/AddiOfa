// Client dell'API ATLAS (il Worker Cloudflare in atlas/). Si chiama solo dopo un gesto dell'utente (accesso al Project ID, casella della classifica,
// casella delle comunicazioni): all'avvio non parte nessuna richiesta. Tutte le rotte dell'account vogliono il token del login (Firebase);
// l'unica pubblica è la classifica NOI (sola lettura).
// Se `VITE_ATLAS_API_URL` non c'è, ogni chiamata si rifiuta con AtlasNonConfigurato: l'app lo dice con una riga vera e resta locale.
import { getIdToken } from './firebase';
import { ATLAS_API_URL, CONSENT_VERSION, ECOSYSTEM, type ScopeId } from '../config/ecosystem';

export interface ProjectAccount {
  id: string;
  email: string | null;
  handle: string;
  createdAt: number;
}

export interface AppLink {
  appId: string;
  scopes: ScopeId[];
  consentVersion: string;
  grantedAt: number;
  updatedAt: number;
}

/** I consensi dell'account: classifica (sì/no) e comunicazioni (null = nessun consenso; «in-attesa» = dato ma non confermato con il link, nessun messaggio parte). */
export interface ConsensiAccount {
  noi: boolean;
  comunicazioni: { stato: 'in-attesa' | 'confermato'; email: string; dal: number } | null;
}

export interface MeRisposta {
  account: ProjectAccount;
  links: AppLink[];
  consensi: ConsensiAccount;
  consentVersion: string;
}

export interface LeaderboardEntry {
  rank: number;
  handle: string;
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

/** Cosa si può cambiare con `PATCH /v1/me`: il @nome utente e i consensi (uno alla volta o insieme). Un campo che il Worker non conosce è un errore. */
export interface ModificaAccount {
  handle?: string;
  consensi?: { noi?: boolean; comunicazioni?: boolean };
  /** Serve quando si accende il consenso alle comunicazioni (indirizzo qualunque). */
  comunicazioniEmail?: string;
}

export const atlas = {
  /** Il primo accesso crea l'account sul servizio (solo email e identificativo). */
  me: () => chiama<MeRisposta>('/v1/me'),
  modifica: (patch: ModificaAccount) => chiama<MeRisposta>('/v1/me', { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteMe: () => chiama<{ deleted: boolean }>('/v1/me', { method: 'DELETE' }),
  exportMe: () => chiama<unknown>('/v1/me/export'),
  /** Permessi per app: il profilo è sempre dentro; la classifica solo se richiesta. */
  setLink: (appId: string, scopes: ScopeId[]) =>
    chiama<MeRisposta>(`/v1/links/${appId}`, { method: 'PUT', body: JSON.stringify({ scopes, consentVersion: CONSENT_VERSION }) }),
  postScore: (appId: string, mastered: number, bestSim: number) =>
    chiama<{ score: number }>(`/v1/noi/${appId}/score`, { method: 'POST', body: JSON.stringify({ mastered, bestSim }) }),
  /** La classifica è pubblica; con il login include anche la tua posizione. */
  leaderboard: (appId: string, limit = 50) =>
    chiama<Leaderboard>(`/v1/noi/${appId}/leaderboard?limit=${limit}`, {}, false),
};
