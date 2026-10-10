// Lista d'attesa, statistiche aggregate, recesso, cancellazione ed esportazione dei dati.

import { getEntitlement } from './entitlement';
import type { Env } from './env';
import { badRequest, HttpError, json, readJson } from './http';
import { identify, requireUser } from './identity';
import { limitIp, limitUser } from './limits';
import { rewardForInvitee } from './invites';
import { randomCode, today } from './util';

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const AUDIENCES = ['recupero', 'prevenzione'] as const;
const FORMATS_ALL = ['ente', 'teng'] as const;
const SOURCES = ['none', 'demo', 'stripe', 'invite', 'manual'] as const;
const EVENT_NAMES = ['diag_done', 'paywall_seen', 'waitlist_join', 'sim_started', 'sim_done', 'pass_unlocked'] as const;
const MAX_DIAG_SECONDS = 7200;

function cleanEmail(raw: unknown): string {
  const email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL_RE.test(email)) throw badRequest("Scrivi un'email valida.", 'bad_email');
  return email;
}

function oneOf<T extends string>(v: unknown, list: readonly T[]): T | null {
  return typeof v === 'string' && (list as readonly string[]).includes(v) ? (v as T) : null;
}

export async function waitlist(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{ email?: unknown; audience?: unknown; consent?: unknown }>(request);
  const email = cleanEmail(body.email);
  const audience = oneOf(body.audience, AUDIENCES);
  if (!audience) throw badRequest("Indica se cerchi il recupero dell'OFA o la preparazione al test.", 'bad_audience');
  if (body.consent !== true) {
    throw new HttpError(400, 'consent_required', "Serve il tuo consenso a ricevere l'avviso di apertura.");
  }
  await limitIp(env, request, 'waitlist', 30);
  const now = Date.now();
  // Idempotente: una seconda iscrizione con la stessa email non cambia nulla e risponde come la prima
  await env.DB.prepare('INSERT OR IGNORE INTO waitlist (email, audience, consent_ts, created_at) VALUES (?, ?, ?, ?)')
    .bind(email, audience, now, now).run();
  return json({ ok: true, stored: 'server', message: "Ti abbiamo messo in lista. Ti scriveremo una volta sola, quando apriamo." });
}

/** Statistiche per giorno, senza identificativi. Unica eccezione dichiarata: vedi diag_done sotto. */
export async function trackEvent(request: Request, env: Env): Promise<Response> {
  const body = await readJson<Record<string, unknown>>(request);
  const name = oneOf(body.name, EVENT_NAMES);
  if (!name) throw badRequest('Evento sconosciuto.', 'bad_event');

  let detail = '';
  switch (name) {
    case 'diag_done': detail = oneOf(body.audience, AUDIENCES) ?? ''; break;
    case 'waitlist_join': detail = oneOf(body.audience, AUDIENCES) ?? ''; break;
    case 'sim_started': detail = oneOf(body.format, FORMATS_ALL) ?? ''; break;
    case 'sim_done': {
      const f = oneOf(body.format, FORMATS_ALL);
      if (f) detail = `${f}:${body.passed === true ? 'pass' : 'fail'}`;
      break;
    }
    case 'pass_unlocked': detail = oneOf(body.source, SOURCES) ?? ''; break;
    case 'paywall_seen': break;
  }

  await limitIp(env, request, 'event', 2000);
  await env.DB.prepare(
    `INSERT INTO events (day, name, detail, n) VALUES (?, ?, ?, 1) ON CONFLICT (day, name, detail) DO UPDATE SET n = n + 1`,
  ).bind(today(), name, detail).run();

  // Solo per gli inviti: se il client manda anche la durata del diagnostico e un'identita', la durata massima
  // si ricorda sull'utente (mai nella tabella events). Serve a contare l'invito come "verificato".
  if (name === 'diag_done' && typeof body.seconds === 'number' && Number.isFinite(body.seconds) && body.seconds >= 0) {
    try {
      const user = await identify(request, env, false);
      if (user) {
        const seconds = Math.min(Math.round(body.seconds), MAX_DIAG_SECONDS);
        await env.DB.prepare('UPDATE users SET diag_seconds = MAX(COALESCE(diag_seconds, 0), ?) WHERE id = ?').bind(seconds, user.id).run();
        await rewardForInvitee(env, user.id);
      }
    } catch (err) {
      if (!(err instanceof HttpError)) throw err; // identita' non valida: l'evento resta contato, la durata no
    }
  }
  return json({ ok: true });
}

export async function withdraw(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{ name?: unknown; email?: unknown; orderRef?: unknown }>(request);
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (name.length < 2 || name.length > 120) throw badRequest('Scrivi nome e cognome.', 'bad_name');
  const email = cleanEmail(body.email);
  const orderRef = typeof body.orderRef === 'string' && body.orderRef.trim() ? body.orderRef.trim().slice(0, 80) : null;
  await limitIp(env, request, 'withdraw', 10);

  let userId: string | null = null;
  try { userId = (await identify(request, env, false))?.id ?? null; } catch { /* il recesso non dipende dall'accesso */ }

  const id = `REC-${randomCode(8)}`;
  const at = Date.now();
  await env.DB.prepare('INSERT INTO withdrawals (id, user_id, name, email, order_ref, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, userId, name, email, orderRef, at).run();
  return json({ receiptId: id, at, stored: 'server' });
}

export async function entitlementRoute(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  return json(await getEntitlement(env, user.id));
}

export async function deleteMe(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  const emails = [user.email, user.verified_email].filter((e): e is string => !!e);
  const statements = [
    ...emails.map(e => env.DB.prepare('DELETE FROM waitlist WHERE email = ?').bind(e)),
    env.DB.prepare('DELETE FROM usage WHERE user_id = ?').bind(user.id),
    // A cascata: Pass, simulazioni, inviti, codici di verifica. Ordini e richieste di recesso restano (obbligo di legge), senza legame con l'utente.
    env.DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id),
  ];
  await env.DB.batch(statements);
  return json({ deleted: true });
}

export async function exportMe(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);
  const q = (sql: string, ...args: unknown[]) => env.DB.prepare(sql).bind(...args).all();
  const emails = [user.email, user.verified_email].filter((e): e is string => !!e);
  const [entitlements, orders, exams, withdrawals, invite, usedInvite, invited] = await Promise.all([
    q('SELECT source, starts_at, expires_at, order_id FROM entitlements WHERE user_id = ?', user.id),
    q('SELECT id, amount_cents, currency, email, consent_ts, waiver_ts, created_at FROM orders WHERE user_id = ?', user.id),
    q('SELECT id, format, started_at, submitted_at, elapsed_client, result FROM exams WHERE user_id = ? ORDER BY started_at', user.id),
    q('SELECT id, name, email, order_ref, created_at FROM withdrawals WHERE user_id = ?', user.id),
    q('SELECT code, created_at FROM invites WHERE inviter_id = ?', user.id),
    q('SELECT code, redeemed_at FROM invite_uses WHERE invitee_id = ?', user.id),
    q('SELECT COUNT(*) AS n FROM invite_uses iu JOIN invites i ON i.code = iu.code WHERE i.inviter_id = ?', user.id),
  ]);
  const waitlistRows = [];
  for (const e of emails) waitlistRows.push(...(await q('SELECT email, audience, consent_ts, created_at FROM waitlist WHERE email = ?', e)).results);

  return json({
    exportedAt: Date.now(),
    user: {
      id: user.id, email: user.email, verifiedEmail: user.verified_email, verifiedAt: user.verified_at,
      diagnosticSeconds: user.diag_seconds, createdAt: user.created_at, hasLogin: !!user.auth_uid, hasDevice: !!user.device_id,
    },
    entitlements: entitlements.results,
    orders: orders.results,
    exams: exams.results.map((e: any) => ({ ...e, result: e.result ? JSON.parse(e.result) : null })),
    withdrawals: withdrawals.results,
    waitlist: waitlistRows,
    invites: { myCode: invite.results[0] ?? null, usedCode: usedInvite.results[0] ?? null, peopleWhoUsedMyCode: (invited.results[0] as { n: number }).n },
  });
}
