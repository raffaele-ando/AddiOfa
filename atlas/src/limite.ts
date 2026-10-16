// Limite di richieste per IP con finestra scorrevole, su D1 (tabella rate_limit).
// Su Cloudflare l'header CF-Connecting-IP lo imposta sempre Cloudflare, quindi non è falsificabile dal client.

import { HttpError } from './http';

interface LimitEnv { DB: D1Database }

async function fingerprint(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest).slice(0, 8), b => b.toString(16).padStart(2, '0')).join('');
}

export async function rateLimitKey(request: Request, route: string): Promise<string> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'locale';
  return `${route}:${await fingerprint(ip)}`;
}

const RETENTION_MS = 60 * 60 * 1000; // le righe più vecchie di un'ora non servono a nessuna finestra

// Registra una richiesta; se nella finestra ce ne sono già `limit`, lancia 429 con Retry-After.
export async function enforceRateLimit(env: LimitEnv, key: string, limit: number, windowMs: number): Promise<void> {
  const now = Date.now();
  const [, count] = await env.DB.batch([
    env.DB.prepare('DELETE FROM rate_limit WHERE ts < ?').bind(now - RETENTION_MS),
    env.DB.prepare('SELECT COUNT(*) AS n, MIN(ts) AS oldest FROM rate_limit WHERE key = ? AND ts > ?').bind(key, now - windowMs),
  ]);
  const row = count.results[0] as { n: number; oldest: number | null } | undefined;
  if ((row?.n ?? 0) >= limit) {
    const retry = Math.max(1, Math.ceil(((row?.oldest ?? now) + windowMs - now) / 1000));
    throw new HttpError(429, 'troppe richieste: riprova tra poco', { 'Retry-After': String(retry) });
  }
  await env.DB.prepare('INSERT INTO rate_limit (key, ts) VALUES (?, ?)').bind(key, now).run();
}
