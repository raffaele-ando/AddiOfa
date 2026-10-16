// ATLAS: l'API condivisa dalle app Project.
// Gestisce il Project ID (account), i collegamenti tra app con consenso esplicito e la classifica NOI.

import { verifyFirebaseToken, AuthClaims } from './auth';
import { CONSENT_VERSION, SCOPES, Scope, isScope } from './scopes';

export interface Env {
  DB: D1Database;
  FIREBASE_PROJECT_ID: string;
  ALLOWED_ORIGINS: string; // elenco separato da virgole, oppure *
  ACCOUNT_ID_PREFIX: string; // es. PRJ
  // Solo sviluppo locale (.dev.vars): accetta token "test:<uid>:<nome>". Mai in produzione.
  ALLOW_TEST_TOKENS?: string;
}

interface AccountRow {
  id: string;
  auth_uid: string;
  email: string | null;
  display_name: string;
  handle: string;
  avatar_url: string | null;
  created_at: number;
  updated_at: number;
}

interface LinkRow {
  app_id: string;
  scopes: string;
  consent_version: string;
  granted_at: number;
  updated_at: number;
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const MAX_MASTERED = 5000;
const MAX_SIM_SCORE = 30;

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
  const allowOrigin = allowed.includes('*') ? '*' : allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new HttpError(400, 'JSON non valido');
  }
}

async function authenticate(request: Request, env: Env): Promise<AuthClaims> {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new HttpError(401, 'login richiesto');
  if (env.ALLOW_TEST_TOKENS === 'true' && token.startsWith('test:')) {
    const [, uid, name] = token.split(':');
    return { uid, name, email: `${uid}@example.test` };
  }
  try {
    return await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);
  } catch (err) {
    throw new HttpError(401, `token non valido: ${(err as Error).message}`);
  }
}

function randomId(prefix: string): string {
  // Alfabeto senza caratteri ambigui (0/O, 1/I)
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `${prefix}-${Array.from(bytes, b => alphabet[b % alphabet.length]).join('')}`;
}

function slugify(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 14);
  return base.length >= 3 ? base : 'studente';
}

const HANDLE_RE = /^[a-z0-9_.]{3,20}$/;

async function getOrCreateAccount(env: Env, claims: AuthClaims): Promise<AccountRow> {
  const existing = await env.DB.prepare('SELECT * FROM accounts WHERE auth_uid = ?').bind(claims.uid).first<AccountRow>();
  if (existing) return existing;

  const now = Date.now();
  const displayName = (claims.name || claims.email?.split('@')[0] || 'Studente').slice(0, 60);
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const row: AccountRow = {
      id: randomId(env.ACCOUNT_ID_PREFIX || 'PRJ'),
      auth_uid: claims.uid,
      email: claims.email ?? null,
      display_name: displayName,
      handle: `${slugify(displayName)}${suffix}`,
      avatar_url: claims.picture ?? null,
      created_at: now,
      updated_at: now,
    };
    const result = await env.DB.prepare(
      `INSERT INTO accounts (id, auth_uid, email, display_name, handle, avatar_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`
    ).bind(row.id, row.auth_uid, row.email, row.display_name, row.handle, row.avatar_url, row.created_at, row.updated_at).run();
    if (result.meta.changes === 1) return row;
    // Conflitto: o lo stesso uid creato in parallelo, o id/handle già usati → riprova
    const raced = await env.DB.prepare('SELECT * FROM accounts WHERE auth_uid = ?').bind(claims.uid).first<AccountRow>();
    if (raced) return raced;
  }
  throw new HttpError(500, 'impossibile creare il Project ID');
}

function publicAccount(a: AccountRow) {
  return {
    id: a.id,
    email: a.email,
    displayName: a.display_name,
    handle: a.handle,
    avatarUrl: a.avatar_url,
    createdAt: a.created_at,
  };
}

function publicLink(l: LinkRow) {
  return {
    appId: l.app_id,
    scopes: JSON.parse(l.scopes) as Scope[],
    consentVersion: l.consent_version,
    grantedAt: l.granted_at,
    updatedAt: l.updated_at,
  };
}

async function listLinks(env: Env, accountId: string) {
  const { results } = await env.DB.prepare(
    'SELECT app_id, scopes, consent_version, granted_at, updated_at FROM app_links WHERE account_id = ? ORDER BY granted_at'
  ).bind(accountId).all<LinkRow>();
  return results.map(publicLink);
}

async function getLinkScopes(env: Env, accountId: string, appId: string): Promise<Scope[] | null> {
  const row = await env.DB.prepare('SELECT scopes FROM app_links WHERE account_id = ? AND app_id = ?')
    .bind(accountId, appId).first<{ scopes: string }>();
  return row ? (JSON.parse(row.scopes) as Scope[]) : null;
}

async function requireApp(env: Env, appId: string) {
  const app = await env.DB.prepare('SELECT id FROM apps WHERE id = ?').bind(appId).first();
  if (!app) throw new HttpError(404, 'app sconosciuta');
}

async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method;
  let m: RegExpMatchArray | null;

  if (path === '/v1/health') return json({ ok: true, service: 'atlas', consentVersion: CONSENT_VERSION });

  if (path === '/v1/scopes' && method === 'GET') return json({ consentVersion: CONSENT_VERSION, scopes: SCOPES });

  // --- Project ID ---------------------------------------------------------
  if (path === '/v1/me') {
    const claims = await authenticate(request, env);
    const account = await getOrCreateAccount(env, claims);

    if (method === 'GET') {
      return json({ account: publicAccount(account), links: await listLinks(env, account.id) });
    }

    if (method === 'PATCH') {
      const body = await readJson<{ displayName?: string; handle?: string }>(request);
      const displayName = body.displayName?.trim().slice(0, 60) || account.display_name;
      const handle = body.handle?.trim().toLowerCase() ?? account.handle;
      if (!HANDLE_RE.test(handle)) throw new HttpError(400, 'nome utente: 3-20 caratteri tra a-z, 0-9, _ e .');
      const taken = await env.DB.prepare('SELECT 1 FROM accounts WHERE handle = ? AND id != ?').bind(handle, account.id).first();
      if (taken) throw new HttpError(409, 'nome utente già in uso');
      await env.DB.prepare('UPDATE accounts SET display_name = ?, handle = ?, updated_at = ? WHERE id = ?')
        .bind(displayName, handle, Date.now(), account.id).run();
      const updated = await env.DB.prepare('SELECT * FROM accounts WHERE id = ?').bind(account.id).first<AccountRow>();
      return json({ account: publicAccount(updated!) });
    }

    if (method === 'DELETE') {
      // ON DELETE CASCADE rimuove collegamenti, registro dei consensi e punteggi
      await env.DB.prepare('DELETE FROM accounts WHERE id = ?').bind(account.id).run();
      return json({ deleted: true });
    }
  }

  if (path === '/v1/me/export' && method === 'GET') {
    const claims = await authenticate(request, env);
    const account = await getOrCreateAccount(env, claims);
    const [consents, scores] = await Promise.all([
      env.DB.prepare('SELECT app_id, action, scopes, consent_version, created_at FROM consent_log WHERE account_id = ? ORDER BY created_at')
        .bind(account.id).all(),
      env.DB.prepare('SELECT app_id, score, mastered, best_sim, updated_at FROM noi_scores WHERE account_id = ?')
        .bind(account.id).all(),
    ]);
    return json({
      exportedAt: Date.now(),
      account: publicAccount(account),
      links: await listLinks(env, account.id),
      consentLog: consents.results,
      noiScores: scores.results,
    });
  }

  // --- Collegamenti tra app (consenso) ------------------------------------
  if ((m = path.match(/^\/v1\/links\/([a-z0-9-]+)$/))) {
    const appId = m[1];
    const claims = await authenticate(request, env);
    const account = await getOrCreateAccount(env, claims);
    await requireApp(env, appId);
    const now = Date.now();

    if (method === 'PUT') {
      const body = await readJson<{ scopes?: unknown[]; consentVersion?: string }>(request);
      const scopes = Array.from(new Set((body.scopes ?? []).filter(isScope)));
      const missingRequired = (Object.keys(SCOPES) as Scope[]).filter(s => SCOPES[s].required && !scopes.includes(s));
      if (missingRequired.length) throw new HttpError(400, `permessi obbligatori mancanti: ${missingRequired.join(', ')}`);
      if (body.consentVersion !== CONSENT_VERSION) throw new HttpError(409, 'informativa aggiornata: mostra di nuovo il consenso');

      const previous = await getLinkScopes(env, account.id, appId);
      const scopesJson = JSON.stringify(scopes);
      const statements = [
        env.DB.prepare(
          `INSERT INTO app_links (account_id, app_id, scopes, consent_version, granted_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT (account_id, app_id) DO UPDATE SET scopes = excluded.scopes,
             consent_version = excluded.consent_version, updated_at = excluded.updated_at`
        ).bind(account.id, appId, scopesJson, CONSENT_VERSION, now, now),
        env.DB.prepare(
          'INSERT INTO consent_log (account_id, app_id, action, scopes, consent_version, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(account.id, appId, previous ? 'update' : 'grant', scopesJson, CONSENT_VERSION, now),
      ];
      // Tolto il consenso alla classifica, il punteggio sparisce subito
      if (!scopes.includes('noi.leaderboard')) {
        statements.push(env.DB.prepare('DELETE FROM noi_scores WHERE account_id = ? AND app_id = ?').bind(account.id, appId));
      }
      await env.DB.batch(statements);
      return json({ links: await listLinks(env, account.id) });
    }

    if (method === 'DELETE') {
      await env.DB.batch([
        env.DB.prepare('DELETE FROM app_links WHERE account_id = ? AND app_id = ?').bind(account.id, appId),
        env.DB.prepare('DELETE FROM noi_scores WHERE account_id = ? AND app_id = ?').bind(account.id, appId),
        env.DB.prepare(
          'INSERT INTO consent_log (account_id, app_id, action, scopes, consent_version, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(account.id, appId, 'revoke', '[]', CONSENT_VERSION, now),
      ]);
      return json({ links: await listLinks(env, account.id) });
    }
  }

  // --- Classifica NOI -------------------------------------------------------
  if ((m = path.match(/^\/v1\/noi\/([a-z0-9-]+)\/score$/)) && method === 'POST') {
    const appId = m[1];
    const claims = await authenticate(request, env);
    const account = await getOrCreateAccount(env, claims);
    const scopes = await getLinkScopes(env, account.id, appId);
    if (!scopes?.includes('noi.leaderboard')) throw new HttpError(403, 'consenso alla classifica NOI non dato');

    const body = await readJson<{ mastered?: number; bestSim?: number }>(request);
    const mastered = Math.trunc(Number(body.mastered));
    const bestSim = Math.trunc(Number(body.bestSim ?? 0));
    if (!(mastered >= 0 && mastered <= MAX_MASTERED) || !(bestSim >= 0 && bestSim <= MAX_SIM_SCORE)) {
      throw new HttpError(400, 'punteggio fuori intervallo');
    }
    // Punteggio NOI: prima quanto sai (domande imparate), poi il miglior risultato in simulazione
    const score = mastered * 100 + bestSim;
    await env.DB.prepare(
      `INSERT INTO noi_scores (account_id, app_id, score, mastered, best_sim, updated_at) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (account_id, app_id) DO UPDATE SET score = excluded.score, mastered = excluded.mastered,
         best_sim = excluded.best_sim, updated_at = excluded.updated_at`
    ).bind(account.id, appId, score, mastered, bestSim, Date.now()).run();
    return json({ score, mastered, bestSim });
  }

  if ((m = path.match(/^\/v1\/noi\/([a-z0-9-]+)\/leaderboard$/)) && method === 'GET') {
    const appId = m[1];
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 50));
    const { results } = await env.DB.prepare(
      `SELECT a.id AS account_id, a.handle, a.display_name, a.avatar_url, s.score, s.mastered, s.best_sim
       FROM noi_scores s JOIN accounts a ON a.id = s.account_id
       WHERE s.app_id = ? ORDER BY s.score DESC, s.updated_at ASC LIMIT ?`
    ).bind(appId, limit).all<{ account_id: string; handle: string; display_name: string; avatar_url: string | null; score: number; mastered: number; best_sim: number }>();

    const entries = results.map((r, i) => ({
      rank: i + 1,
      handle: r.handle,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      mastered: r.mastered,
      bestSim: r.best_sim,
      isMe: false,
    }));

    let me: { rank: number; mastered: number; bestSim: number } | null = null;
    if (request.headers.get('Authorization')) {
      const claims = await authenticate(request, env);
      const account = await env.DB.prepare('SELECT id FROM accounts WHERE auth_uid = ?').bind(claims.uid).first<{ id: string }>();
      if (account) {
        results.forEach((r, i) => { if (r.account_id === account.id) entries[i].isMe = true; });
        const mine = await env.DB.prepare('SELECT score, mastered, best_sim, updated_at FROM noi_scores WHERE account_id = ? AND app_id = ?')
          .bind(account.id, appId).first<{ score: number; mastered: number; best_sim: number; updated_at: number }>();
        if (mine) {
          const ahead = await env.DB.prepare(
            'SELECT COUNT(*) AS n FROM noi_scores WHERE app_id = ? AND (score > ? OR (score = ? AND updated_at < ?))'
          ).bind(appId, mine.score, mine.score, mine.updated_at).first<{ n: number }>();
          me = { rank: (ahead?.n ?? 0) + 1, mastered: mine.mastered, bestSim: mine.best_sim };
        }
      }
    }
    const total = await env.DB.prepare('SELECT COUNT(*) AS n FROM noi_scores WHERE app_id = ?').bind(appId).first<{ n: number }>();
    return json({ appId, total: total?.n ?? 0, entries, me });
  }

  throw new HttpError(404, 'non trovato');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    let response: Response;
    try {
      response = await handle(request, env);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      if (status === 500) console.error(err);
      response = json({ error: err instanceof HttpError ? err.message : 'errore interno' }, status);
    }
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) headers.set(k, v);
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
