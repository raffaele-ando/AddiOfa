import { auth } from './firebase';
import { ATLAS_API_URL, CONSENT_VERSION, ECOSYSTEM, ScopeId } from '../config/ecosystem';

// Client dell'API ATLAS (Worker Cloudflare in atlas/). Ogni chiamata usa il token del login Google.

export interface ProjectAccount {
  id: string;
  email: string | null;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  createdAt: number;
}

export interface AppLink {
  appId: string;
  scopes: ScopeId[];
  consentVersion: string;
  grantedAt: number;
  updatedAt: number;
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
  total: number;
  entries: LeaderboardEntry[];
  me: { rank: number; mastered: number; bestSim: number } | null;
}

export const isAtlasOnline = () => !!ATLAS_API_URL;

async function call<T>(path: string, init: RequestInit = {}, requireAuth = true): Promise<T> {
  if (!ATLAS_API_URL) throw new Error(`${ECOSYSTEM.engineName} non è configurato`);
  const headers = new Headers(init.headers);
  const user = auth.currentUser;
  if (user) headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  else if (requireAuth) throw new Error('login richiesto');
  if (init.body) headers.set('Content-Type', 'application/json');
  const res = await fetch(`${ATLAS_API_URL}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `errore ${res.status}`);
  return data as T;
}

export const atlas = {
  me: () => call<{ account: ProjectAccount; links: AppLink[] }>('/v1/me'),
  updateMe: (patch: { displayName?: string; handle?: string }) =>
    call<{ account: ProjectAccount }>('/v1/me', { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteMe: () => call<{ deleted: boolean }>('/v1/me', { method: 'DELETE' }),
  exportMe: () => call<unknown>('/v1/me/export'),
  setLink: (appId: string, scopes: ScopeId[]) =>
    call<{ links: AppLink[] }>(`/v1/links/${appId}`, {
      method: 'PUT',
      body: JSON.stringify({ scopes, consentVersion: CONSENT_VERSION }),
    }),
  removeLink: (appId: string) => call<{ links: AppLink[] }>(`/v1/links/${appId}`, { method: 'DELETE' }),
  postScore: (appId: string, mastered: number, bestSim: number) =>
    call<{ score: number }>(`/v1/noi/${appId}/score`, { method: 'POST', body: JSON.stringify({ mastered, bestSim }) }),
  leaderboard: (appId: string, limit = 50) =>
    call<Leaderboard>(`/v1/noi/${appId}/leaderboard?limit=${limit}`, {}, false),
};
