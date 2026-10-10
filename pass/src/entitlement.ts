import type { Env } from './env';
import { PASS_VALID_MONTHS } from './formats';

export interface Entitlement {
  tier: 'free' | 'pass';
  source: 'none' | 'stripe' | 'invite' | 'manual';
  expiresAt: number | null;
}

export async function getEntitlement(env: Env, userId: string, now = Date.now()): Promise<Entitlement> {
  const row = await env.DB.prepare(
    'SELECT source, expires_at FROM entitlements WHERE user_id = ? AND expires_at > ? ORDER BY expires_at DESC LIMIT 1',
  ).bind(userId, now).first<{ source: Entitlement['source']; expires_at: number }>();
  if (!row) return { tier: 'free', source: 'none', expiresAt: null };
  return { tier: 'pass', source: row.source, expiresAt: row.expires_at };
}

/** Scadenza a N mesi di calendario da `from` (ms). */
export function addMonths(from: number, months: number = PASS_VALID_MONTHS): number {
  const d = new Date(from);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.getTime();
}
