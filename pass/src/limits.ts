// Limiti giornalieri semplici con la tabella usage. L'indirizzo IP non si salva: solo un hash che cambia ogni giorno.

import type { Env } from './env';
import { HttpError } from './http';
import { sha256Hex, today } from './util';

async function hit(env: Env, key: string, max: number): Promise<void> {
  const day = today();
  const row = await env.DB.prepare(
    `INSERT INTO usage (day, user_id, n) VALUES (?, ?, 1)
     ON CONFLICT (day, user_id) DO UPDATE SET n = n + 1 RETURNING n`,
  ).bind(day, key).first<{ n: number }>();
  if (row && row.n > max) {
    throw new HttpError(429, 'rate_limited', 'Troppe richieste per oggi. Riprova domani.');
  }
  // Pulizia occasionale delle righe vecchie
  if (Math.random() < 0.01) {
    await env.DB.prepare('DELETE FROM usage WHERE day < ?').bind(today(Date.now() - 3 * 86400000)).run();
  }
}

async function ipKey(request: Request, scope: string): Promise<string> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'sconosciuto';
  return `ip:${scope}:${(await sha256Hex(`${ip}|${today()}`)).slice(0, 24)}`;
}

/** Per le rotte che usano il banco o gli esami: limite per identita' e, piu' largo, per indirizzo. */
export async function limitUser(env: Env, request: Request, userId: string): Promise<void> {
  await hit(env, userId, Number(env.DAILY_LIMIT) || 600);
  await hit(env, await ipKey(request, 'api'), Number(env.IP_DAILY_LIMIT) || 3000);
}

/** Per le rotte pubbliche senza identita' (lista d'attesa, recesso, eventi). */
export async function limitIp(env: Env, request: Request, scope: string, max: number): Promise<void> {
  await hit(env, await ipKey(request, scope), max);
}
