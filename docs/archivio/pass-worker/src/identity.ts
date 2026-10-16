// Chi sei: un token Firebase (email verificata) oppure un identificativo anonimo del dispositivo in X-Device.
// Il dispositivo anonimo diventa utente al primo uso. L'identificativo si salva solo come hash SHA-256.

import { verifyFirebaseToken, type AuthClaims } from './auth';
import type { Env } from './env';
import { HttpError } from './http';
import { randomCode, sha256Hex } from './util';

export interface User {
  id: string;
  auth_uid: string | null;
  device_id: string | null;
  email: string | null;
  verified_email: string | null;
  verified_at: number | null;
  diag_seconds: number | null;
  created_at: number;
}

const DEVICE_RE = /^[A-Za-z0-9]{16,64}$/;

async function authenticate(token: string, env: Env): Promise<AuthClaims> {
  // Solo sviluppo locale: "test:<uid>:<email>[:unverified]"
  if (env.ALLOW_TEST_TOKENS === 'true' && token.startsWith('test:')) {
    const [, uid, email, flag] = token.split(':');
    return { uid: uid || 'test', email: email || `${uid}@example.test`, emailVerified: flag !== 'unverified' };
  }
  let claims: AuthClaims;
  try {
    claims = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);
  } catch {
    throw new HttpError(401, 'invalid_token', 'Accesso non valido o scaduto. Accedi di nuovo.');
  }
  return claims;
}

async function findBy(env: Env, column: 'auth_uid' | 'device_id', value: string): Promise<User | null> {
  return env.DB.prepare(`SELECT * FROM users WHERE ${column} = ?`).bind(value).first<User>();
}

async function insertUser(env: Env, fields: { auth_uid?: string; device_id?: string; email?: string }): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO users (id, auth_uid, device_id, email, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`,
  ).bind(`U-${randomCode(12)}`, fields.auth_uid ?? null, fields.device_id ?? null, fields.email ?? null, Date.now()).run();
}

async function fromToken(env: Env, claims: AuthClaims, deviceHash: string | null, create: boolean): Promise<User | null> {
  if (!claims.emailVerified || !claims.email) {
    throw new HttpError(403, 'email_not_verified', "Verifica l'email del tuo account per continuare.");
  }
  const existing = await findBy(env, 'auth_uid', claims.uid);
  if (existing) return existing;
  if (!create) return null;

  // Primo accesso con login: se il dispositivo era gia' un utente anonimo, ne eredita Pass e simulazioni
  if (deviceHash) {
    const anon = await findBy(env, 'device_id', deviceHash);
    if (anon && !anon.auth_uid) {
      await env.DB.prepare('UPDATE users SET auth_uid = ?, email = ? WHERE id = ? AND auth_uid IS NULL')
        .bind(claims.uid, claims.email, anon.id).run();
      const adopted = await findBy(env, 'auth_uid', claims.uid);
      if (adopted) return adopted;
    }
  }
  await insertUser(env, { auth_uid: claims.uid, email: claims.email });
  return findBy(env, 'auth_uid', claims.uid);
}

/** Restituisce l'utente di questa richiesta, o null se non c'e' nessuna identita' (o, con create=false, se non esiste ancora). */
export async function identify(request: Request, env: Env, create = true): Promise<User | null> {
  const authz = request.headers.get('Authorization') ?? '';
  const device = request.headers.get('X-Device') ?? '';

  let deviceHash: string | null = null;
  if (device) {
    if (!DEVICE_RE.test(device)) {
      throw new HttpError(400, 'bad_device', 'Identificativo del dispositivo non valido (16-64 caratteri alfanumerici).');
    }
    deviceHash = await sha256Hex(`device:${device}`);
  }

  if (authz) {
    if (!authz.startsWith('Bearer ') || authz.length < 8) {
      throw new HttpError(401, 'invalid_token', 'Accesso non valido o scaduto. Accedi di nuovo.');
    }
    const claims = await authenticate(authz.slice(7), env);
    return fromToken(env, claims, deviceHash, create);
  }

  if (!deviceHash) return null;
  const existing = await findBy(env, 'device_id', deviceHash);
  if (existing || !create) return existing;
  await insertUser(env, { device_id: deviceHash });
  return findBy(env, 'device_id', deviceHash);
}

export async function requireUser(request: Request, env: Env): Promise<User> {
  const user = await identify(request, env, true);
  if (!user) {
    throw new HttpError(401, 'identity_required', "Serve un accesso o l'identificativo del dispositivo (intestazione X-Device).");
  }
  return user;
}
