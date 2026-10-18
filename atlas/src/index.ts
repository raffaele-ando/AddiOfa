// ATLAS: l'API condivisa dalle app Project.
// Gestisce il Project ID (account), il permesso della classifica NOI, il consenso alle comunicazioni e la classifica.
// Nessuna raccolta anonima: ogni dato personale arriva da una persona che ha creato il suo Project ID (docs/design/PRIVACY-LEGGE.md).

import { verifyFirebaseToken, AuthClaims } from './auth';
import { CONSENT_VERSION, SCOPES, Scope, isScope } from './scopes';
import { HttpError, json, readJson } from './http';
import { enforceRateLimit, rateLimitKey } from './limite';
import { CSV_COLUMNS, esportaComunicazioni, impostaComunicazioni, impostaNoi, linkScopes, safeEqual, statoConsensi, toCsv, type AccountConsensi } from './consensi';

const ADMIN_LIMIT = 20;                // tentativi per IP al minuto sulle rotte admin
const ADMIN_WINDOW_MS = 60_000;
const APP_PREDEFINITA = 'addiofa';

export interface Env {
  DB: D1Database;
  FIREBASE_PROJECT_ID: string;
  // Origini del sito autorizzate dal browser, separate da virgole (es. https://addiofa.example). Vuoto = nessuna.
  // "*" vale solo in sviluppo locale (cioè con ALLOW_TEST_TOKENS=true).
  ALLOWED_ORIGINS: string;
  // Segreto dell'autore per scaricare l'elenco delle comunicazioni (wrangler secret put ADMIN_TOKEN). Non impostato = rotta admin 404.
  ADMIN_TOKEN?: string;
  ACCOUNT_ID_PREFIX: string; // es. PRJ
  // Solo sviluppo locale (.dev.vars): accetta token "test:<uid>:<nome>". Mai in produzione.
  ALLOW_TEST_TOKENS?: string;
}

interface AccountRow extends AccountConsensi {
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

const MAX_MASTERED = 5000;
const MAX_SIM_SCORE = 30;

// Origini consentite: elenco in ALLOWED_ORIGINS. Se l'origine della richiesta non è nell'elenco non si
// manda nessun Access-Control-Allow-Origin e il browser blocca la risposta.
function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const anyOrigin = allowed.includes('*') && env.ALLOW_TEST_TOKENS === 'true';
  const headers: Record<string, string> = { Vary: 'Origin' };
  if (anyOrigin) headers['Access-Control-Allow-Origin'] = '*';
  else if (origin && allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  else return headers;
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  headers['Access-Control-Max-Age'] = '86400';
  return headers;
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

const HANDLE_RE = /^[a-z0-9_.]{3,20}$/;

// Account: solo ciò che serve. Niente nome né foto dell'account Google (nessuna schermata li usa): l'identità pubblica è il @nome utente,
// che parte neutro («studente1234») e lo cambia l'utente.
async function getOrCreateAccount(env: Env, claims: AuthClaims): Promise<AccountRow> {
  const existing = await env.DB.prepare('SELECT * FROM accounts WHERE auth_uid = ?').bind(claims.uid).first<AccountRow>();
  if (existing) return existing;

  const now = Date.now();
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const row: AccountRow = {
      id: randomId(env.ACCOUNT_ID_PREFIX || 'PRJ'),
      auth_uid: claims.uid,
      email: claims.email ?? null,
      display_name: 'Studente',
      handle: `studente${suffix}`,
      avatar_url: null,
      comunicazioni_email: null, comunicazioni_stato: null, comunicazioni_at: null,
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
  return { id: a.id, email: a.email, handle: a.handle, createdAt: a.created_at };
}

function publicLink(l: LinkRow) {
  return {
    appId: l.app_id,
    scopes: linkScopes(l.scopes),
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
  return row ? linkScopes(row.scopes) : null;
}

async function requireApp(env: Env, appId: string) {
  const app = await env.DB.prepare('SELECT id FROM apps WHERE id = ?').bind(appId).first();
  if (!app) throw new HttpError(404, 'app sconosciuta');
}

/** Lo stato completo dell'account come lo vede l'app: account, collegamenti e consensi (classifica e comunicazioni). */
async function quadroAccount(env: Env, account: AccountRow) {
  const links = await listLinks(env, account.id);
  const scopes = links.find(l => l.appId === APP_PREDEFINITA)?.scopes ?? null;
  return { account: publicAccount(account), links, consensi: statoConsensi(account, scopes), consentVersion: CONSENT_VERSION };
}

const rileggi = async (env: Env, id: string) => (await env.DB.prepare('SELECT * FROM accounts WHERE id = ?').bind(id).first<AccountRow>())!;

async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method;
  let m: RegExpMatchArray | null;

  if (path === '/v1/health') return json({ ok: true, service: 'atlas', consentVersion: CONSENT_VERSION });

  if (path === '/v1/scopes' && method === 'GET') return json({ consentVersion: CONSENT_VERSION, scopes: SCOPES });

  // --- Nessuna iscrizione senza Project ID --------------------------------------------------------------------------------------------
  // Prima qui si raccoglievano nome ed email all'avvio. Ora non più: non si risponde «ok» a una richiesta che non fa niente.
  if (path === '/v1/signups') {
    throw new HttpError(410, 'iscrizione senza Project ID non più disponibile: crea il Project ID da AddiOFA e scegli lì i consensi');
  }

  // --- Elenco delle comunicazioni per l'autore (protetto da ADMIN_TOKEN) ----------------------------------------------------------------
  if (path === '/v1/admin/comunicazioni' && method === 'GET') {
    if (!env.ADMIN_TOKEN) throw new HttpError(404, 'non trovato'); // rotta spenta finché non c'è il segreto
    await enforceRateLimit(env, await rateLimitKey(request, 'admin'), ADMIN_LIMIT, ADMIN_WINDOW_MS);
    const header = request.headers.get('Authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token || !(await safeEqual(token, env.ADMIN_TOKEN))) throw new HttpError(401, 'non autorizzato');
    const formato = (url.searchParams.get('formato') ?? 'json').toLowerCase();
    if (formato !== 'csv' && formato !== 'json') throw new HttpError(400, 'formato: csv o json');
    const rows = await esportaComunicazioni(env, url.searchParams.get('stato') === 'confermato');
    if (formato === 'csv') {
      const day = new Date().toISOString().slice(0, 10);
      return new Response(toCsv(rows), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="comunicazioni-${day}.csv"`,
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    return json({ colonne: CSV_COLUMNS, totale: rows.length, comunicazioni: rows });
  }

  // --- Project ID ---------------------------------------------------------
  if (path === '/v1/me') {
    const claims = await authenticate(request, env);
    const account = await getOrCreateAccount(env, claims);

    if (method === 'GET') return json(await quadroAccount(env, account));

    if (method === 'PATCH') {
      const body = await readJson<Record<string, unknown>>(request);
      // Un campo che non si conosce è un errore, non un «ok» che non fa niente
      const noti = ['displayName', 'handle', 'consensi', 'comunicazioniEmail', 'appId'];
      for (const k of Object.keys(body)) if (!noti.includes(k)) throw new HttpError(400, `campo non riconosciuto: ${k}`);
      const appId = typeof body.appId === 'string' ? body.appId : APP_PREDEFINITA;
      await requireApp(env, appId);

      const displayName = typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 60) || account.display_name : account.display_name;
      if (body.displayName !== undefined && typeof body.displayName !== 'string') throw new HttpError(400, 'displayName non valido');
      const handle = typeof body.handle === 'string' ? body.handle.trim().toLowerCase() : account.handle;
      if (body.handle !== undefined && typeof body.handle !== 'string') throw new HttpError(400, 'handle non valido');
      if (!HANDLE_RE.test(handle)) throw new HttpError(400, 'nome utente: 3-20 caratteri tra a-z, 0-9, _ e .');
      const taken = await env.DB.prepare('SELECT 1 FROM accounts WHERE handle = ? AND id != ?').bind(handle, account.id).first();
      if (taken) throw new HttpError(409, 'nome utente già in uso');

      let noi: boolean | undefined; let comunicazioni: boolean | undefined;
      if (body.consensi !== undefined) {
        const c = body.consensi as Record<string, unknown>;
        if (!c || typeof c !== 'object' || Array.isArray(c)) throw new HttpError(400, 'consensi non valido');
        for (const k of Object.keys(c)) if (k !== 'noi' && k !== 'comunicazioni') throw new HttpError(400, `consenso non riconosciuto: ${k}`);
        for (const k of ['noi', 'comunicazioni'] as const) if (c[k] !== undefined && typeof c[k] !== 'boolean') throw new HttpError(400, `consensi.${k}: serve true o false`);
        noi = c.noi as boolean | undefined; comunicazioni = c.comunicazioni as boolean | undefined;
      }
      if (comunicazioni === true && body.comunicazioniEmail === undefined && !account.comunicazioni_email) throw new HttpError(400, 'serve un indirizzo email valido per le comunicazioni');

      if (displayName !== account.display_name || handle !== account.handle) {
        await env.DB.prepare('UPDATE accounts SET display_name = ?, handle = ?, updated_at = ? WHERE id = ?').bind(displayName, handle, Date.now(), account.id).run();
      }
      if (noi !== undefined) await impostaNoi(env, account.id, appId, noi);
      if (comunicazioni !== undefined) {
        await impostaComunicazioni(env, await rileggi(env, account.id), appId, comunicazioni, body.comunicazioniEmail ?? account.comunicazioni_email);
      }
      return json(await quadroAccount(env, await rileggi(env, account.id)));
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
      env.DB.prepare('SELECT app_id, action, scopes, consent_version, created_at FROM consent_log WHERE account_id = ? ORDER BY created_at, id')
        .bind(account.id).all(),
      env.DB.prepare('SELECT app_id, score, mastered, best_sim, updated_at FROM noi_scores WHERE account_id = ?')
        .bind(account.id).all(),
    ]);
    return json({ exportedAt: Date.now(), ...(await quadroAccount(env, account)), consentLog: consents.results, noiScores: scores.results });
  }

  // --- Permessi per app (profilo e classifica NOI) --------------------------------------------------------------------------------------
  if ((m = path.match(/^\/v1\/links\/([a-z0-9-]+)$/))) {
    const appId = m[1];
    const claims = await authenticate(request, env);
    const account = await getOrCreateAccount(env, claims);
    await requireApp(env, appId);
    const now = Date.now();

    if (method === 'PUT') {
      const body = await readJson<{ scopes?: unknown[]; consentVersion?: string }>(request);
      const richiesti = body.scopes ?? [];
      for (const s of richiesti) if (!isScope(s)) throw new HttpError(400, `permesso sconosciuto: ${String(s)}`);
      const scopes = Array.from(new Set(richiesti.filter(isScope)));
      const missingRequired = (Object.keys(SCOPES) as Scope[]).filter(s => SCOPES[s].required && !scopes.includes(s));
      if (missingRequired.length) throw new HttpError(400, `permessi obbligatori mancanti: ${missingRequired.join(', ')}`);
      if (body.consentVersion !== CONSENT_VERSION) throw new HttpError(409, 'informativa aggiornata: mostra di nuovo il testo');
      await impostaNoi(env, account.id, appId, scopes.includes('noi.leaderboard'), now);
      return json(await quadroAccount(env, await rileggi(env, account.id)));
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
      `SELECT a.id AS account_id, a.handle, s.score, s.mastered, s.best_sim
       FROM noi_scores s JOIN accounts a ON a.id = s.account_id
       WHERE s.app_id = ? ORDER BY s.score DESC, s.updated_at ASC LIMIT ?`
    ).bind(appId, limit).all<{ account_id: string; handle: string; score: number; mastered: number; best_sim: number }>();

    const entries = results.map((r, i) => ({
      rank: i + 1,
      handle: r.handle,
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
    // Le rotte admin sono per curl dell'autore, non per il browser: niente CORS
    const isAdmin = new URL(request.url).pathname.startsWith('/v1/admin');
    const cors = isAdmin ? { Vary: 'Origin' } : corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    let response: Response;
    try {
      response = await handle(request, env);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      if (status === 500) console.error(err);
      response = json({ error: err instanceof HttpError ? err.message : 'errore interno' }, status,
        err instanceof HttpError ? err.headers : {});
    }
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) headers.set(k, v);
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
