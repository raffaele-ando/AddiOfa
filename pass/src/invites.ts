// Inviti: 3 compagni verificati che finiscono il diagnostico = Pass gratis (12 mesi) per chi invita.
// "Verificato" = email @mail.polimi.it confermata con un codice monouso + diagnostico di almeno 240 secondi.
// Un'email conta una sola volta (users.verified_email e' UNIQUE).

import { addMonths } from './entitlement';
import type { Env } from './env';
import { emailConfigured, sendEmail } from './email';
import { badRequest, HttpError, json, readJson } from './http';
import { requireUser } from './identity';
import { limitUser } from './limits';
import { INVITE } from './formats';
import { randomCode, randomInt, sha256Hex, timingSafeEqual } from './util';

const CODE_RE = /^OFA-[2-9A-HJ-NP-Z]{6}$/;
const EMAIL_RE = /^[a-z0-9._-]{1,64}$/; // niente "+": un alias non deve contare come un'altra persona
const VERIFY_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_CODES_PER_HOUR = 3;

async function countVerified(env: Env, inviterId: string): Promise<number> {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM invite_uses iu
     JOIN invites i ON i.code = iu.code
     JOIN users u ON u.id = iu.invitee_id
     WHERE i.inviter_id = ? AND u.verified_email IS NOT NULL AND COALESCE(u.diag_seconds, 0) >= ?`,
  ).bind(inviterId, INVITE.minDiagnosticSeconds).first<{ n: number }>();
  return row?.n ?? 0;
}

/** Se chi invita ha raggiunto la soglia, gli concede il Pass (una volta sola: indice unico). */
async function rewardInviter(env: Env, inviterId: string): Promise<number> {
  const verified = await countVerified(env, inviterId);
  if (verified >= INVITE.required) {
    const now = Date.now();
    await env.DB.prepare(
      `INSERT OR IGNORE INTO entitlements (user_id, source, starts_at, expires_at, created_at) VALUES (?, 'invite', ?, ?, ?)`,
    ).bind(inviterId, now, addMonths(now), now).run();
  }
  return verified;
}

/** Da chiamare quando un invitato cambia stato (email confermata, diagnostico registrato). */
export async function rewardForInvitee(env: Env, inviteeId: string): Promise<void> {
  const row = await env.DB.prepare(
    'SELECT i.inviter_id FROM invite_uses iu JOIN invites i ON i.code = iu.code WHERE iu.invitee_id = ?',
  ).bind(inviteeId).first<{ inviter_id: string }>();
  if (row) await rewardInviter(env, row.inviter_id);
}

export async function createInvite(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await env.DB.prepare('SELECT code FROM invites WHERE inviter_id = ?').bind(user.id).first<{ code: string }>();
    if (existing) return json({ code: existing.code });
    await env.DB.prepare('INSERT INTO invites (code, inviter_id, created_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING')
      .bind(`OFA-${randomCode(6)}`, user.id, Date.now()).run();
  }
  throw new HttpError(500, 'internal', 'Non sono riuscito a creare il codice. Riprova.');
}

export async function inviteProgress(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);
  const invite = await env.DB.prepare('SELECT code FROM invites WHERE inviter_id = ?').bind(user.id).first<{ code: string }>();
  if (!invite) return json({ code: null, verified: 0, required: INVITE.required });
  const verified = await rewardInviter(env, user.id);
  return json({ code: invite.code, verified, required: INVITE.required });
}

export async function redeemInvite(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{ code?: unknown }>(request);
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (!CODE_RE.test(code)) throw new HttpError(400, 'invalid_code', 'Il codice non è nel formato giusto (OFA-XXXXXX).');

  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);

  const invite = await env.DB.prepare('SELECT code, inviter_id FROM invites WHERE code = ?').bind(code).first<{ code: string; inviter_id: string }>();
  if (!invite) throw new HttpError(404, 'invalid_code', 'Codice non trovato.');
  if (invite.inviter_id === user.id) throw new HttpError(400, 'own_code', 'Questo è il tuo codice: va condiviso con i compagni.');

  const res = await env.DB.prepare('INSERT INTO invite_uses (invitee_id, code, redeemed_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING')
    .bind(user.id, code, Date.now()).run();
  if (res.meta.changes === 0) {
    const used = await env.DB.prepare('SELECT code FROM invite_uses WHERE invitee_id = ?').bind(user.id).first<{ code: string }>();
    if (used?.code === code) return json({ ok: true, message: 'Codice già applicato.' });
    throw new HttpError(409, 'already_redeemed', 'Hai già usato un codice invito.');
  }
  await rewardForInvitee(env, user.id); // l'invitato poteva aver gia' verificato email e diagnostico
  return json({ ok: true, message: 'Codice applicato. Conferma la tua email @mail.polimi.it e fai il diagnostico: il tuo compagno conterà come verificato.' });
}

function normalizePolimiEmail(raw: unknown): string {
  const email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  const at = email.lastIndexOf('@');
  if (at < 1 || email.length > 254) throw badRequest("Scrivi un'email valida.", 'bad_email');
  if (email.slice(at + 1) !== INVITE.emailDomain) {
    throw new HttpError(400, 'domain_not_allowed', `Serve un'email @${INVITE.emailDomain}.`);
  }
  if (!EMAIL_RE.test(email.slice(0, at))) throw badRequest("Scrivi un'email valida.", 'bad_email');
  return email;
}

async function codeHash(userId: string, email: string, code: string): Promise<string> {
  return sha256Hex(`verify|${userId}|${email}|${code}`);
}

export async function verifyStart(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{ email?: unknown }>(request);
  const email = normalizePolimiEmail(body.email);

  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);

  if (user.verified_email === email) return json({ ok: true, alreadyVerified: true });
  if (user.verified_email) throw new HttpError(409, 'already_verified', 'Hai già verificato un’altra email.');
  const taken = await env.DB.prepare('SELECT 1 AS x FROM users WHERE verified_email = ? AND id <> ?').bind(email, user.id).first();
  if (taken) throw new HttpError(409, 'email_already_used', 'Questa email è già stata usata da un altro account.');

  const devCode = env.DEV_RETURN_CODE === 'true';
  if (!emailConfigured(env) && !devCode) {
    throw new HttpError(501, 'email_not_configured', "L'invio delle email non è ancora configurato: la verifica non è disponibile.");
  }

  const now = Date.now();
  const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM email_verifications WHERE user_id = ? AND created_at > ?')
    .bind(user.id, now - 3600_000).first<{ n: number }>();
  if ((recent?.n ?? 0) >= MAX_CODES_PER_HOUR) {
    throw new HttpError(429, 'rate_limited', 'Hai chiesto troppi codici. Riprova tra un’ora.');
  }

  const code = String(randomInt(1_000_000)).padStart(6, '0');
  await env.DB.prepare('UPDATE email_verifications SET used_at = ? WHERE user_id = ? AND used_at IS NULL').bind(now, user.id).run();
  const ins = await env.DB.prepare(
    'INSERT INTO email_verifications (user_id, email, code_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
  ).bind(user.id, email, await codeHash(user.id, email, code), now + VERIFY_TTL_MS, now).run();

  if (devCode) return json({ ok: true, expiresInSeconds: VERIFY_TTL_MS / 1000, devCode: code });

  try {
    await sendEmail(env, {
      to: email,
      subject: 'Il tuo codice AddiOFA',
      text: `Il tuo codice di verifica AddiOFA è ${code}.\nVale 10 minuti. Se non l'hai chiesto tu, ignora questa email.`,
    });
  } catch (err) {
    await env.DB.prepare('DELETE FROM email_verifications WHERE id = ?').bind(ins.meta.last_row_id).run();
    throw err;
  }
  return json({ ok: true, expiresInSeconds: VERIFY_TTL_MS / 1000 });
}

export async function verifyConfirm(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{ email?: unknown; code?: unknown }>(request);
  const email = normalizePolimiEmail(body.email);
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  if (!/^\d{6}$/.test(code)) throw badRequest('Il codice ha 6 cifre.', 'bad_code');

  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);
  if (user.verified_email === email) return json({ ok: true, verified: true });

  const now = Date.now();
  const row = await env.DB.prepare(
    'SELECT id, code_hash, expires_at FROM email_verifications WHERE user_id = ? AND email = ? AND used_at IS NULL ORDER BY id DESC LIMIT 1',
  ).bind(user.id, email).first<{ id: number; code_hash: string; expires_at: number }>();
  if (!row || row.expires_at < now) throw new HttpError(400, 'code_expired', 'Il codice è scaduto o non esiste. Chiedine uno nuovo.');

  // Il tentativo si conta prima del confronto: cosi' non si puo' indovinare a raffica
  const attempt = await env.DB.prepare('UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ? AND attempts < ? RETURNING attempts')
    .bind(row.id, MAX_ATTEMPTS).first<{ attempts: number }>();
  if (!attempt) throw new HttpError(429, 'too_many_attempts', 'Troppi tentativi. Chiedi un codice nuovo.');

  if (!timingSafeEqual(row.code_hash, await codeHash(user.id, email, code))) {
    throw new HttpError(400, 'code_wrong', 'Il codice non è corretto.');
  }

  try {
    await env.DB.batch([
      env.DB.prepare('UPDATE email_verifications SET used_at = ? WHERE id = ?').bind(now, row.id),
      env.DB.prepare('UPDATE users SET verified_email = ?, verified_at = ? WHERE id = ?').bind(email, now, user.id),
    ]);
  } catch (err) {
    if (/UNIQUE/i.test((err as Error).message)) {
      throw new HttpError(409, 'email_already_used', 'Questa email è già stata usata da un altro account.');
    }
    throw err;
  }
  await rewardForInvitee(env, user.id);
  return json({ ok: true, verified: true });
}
