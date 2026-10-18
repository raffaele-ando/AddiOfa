// Consensi dell'account: classifica NOI (permesso `noi.leaderboard`) e comunicazioni. Un solo registro (`consent_log`), una sola versione del testo.
// Ogni consenso si dà e si ritira con un'unica richiesta, senza eliminare l'account (art. 7.3 GDPR).

import { HttpError } from './http';
import { CONSENT_VERSION, type Scope } from './scopes';

export interface ConsensiEnv { DB: D1Database }

export interface AccountConsensi { id: string; comunicazioni_email: string | null; comunicazioni_stato: string | null; comunicazioni_at: number | null }

export interface StatoConsensi {
  noi: boolean;
  /** null = nessun consenso; 'in-attesa' = dato ma non confermato con il link (nessun messaggio parte); 'confermato' = confermato. */
  comunicazioni: { stato: 'in-attesa' | 'confermato'; email: string; dal: number } | null;
}

const EMAIL_RE = /^[a-z0-9][a-z0-9._%+'-]{0,63}@[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

/** Email qualunque (non solo PoliMi): minuscola, senza spazi ai bordi, forma plausibile. Null se non va. */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 6 || email.length > 254 || email.includes('..')) return null;
  return EMAIL_RE.test(email) ? email : null;
}

export function linkScopes(raw: string | null | undefined): Scope[] {
  try { return raw ? (JSON.parse(raw) as Scope[]) : []; } catch { return []; }
}

export function statoConsensi(account: AccountConsensi, scopes: Scope[] | null): StatoConsensi {
  const st = account.comunicazioni_stato;
  return {
    noi: !!scopes?.includes('noi.leaderboard'),
    comunicazioni: (st === 'in-attesa' || st === 'confermato') && account.comunicazioni_email
      ? { stato: st, email: account.comunicazioni_email, dal: account.comunicazioni_at ?? 0 }
      : null,
  };
}

/** Accende o spegne il permesso della classifica. Spento = il punteggio sparisce subito. Restituisce true se è cambiato qualcosa. */
export async function impostaNoi(env: ConsensiEnv, accountId: string, appId: string, acceso: boolean, now = Date.now()): Promise<boolean> {
  const row = await env.DB.prepare('SELECT scopes FROM app_links WHERE account_id = ? AND app_id = ?').bind(accountId, appId).first<{ scopes: string }>();
  const prima = linkScopes(row?.scopes);
  const aveva = prima.includes('noi.leaderboard');
  if (row && aveva === acceso) return false;
  if (!row && !acceso) return false;
  const scopes: Scope[] = acceso ? ['profile', 'noi.leaderboard'] : ['profile'];
  const json = JSON.stringify(scopes);
  const stmts = [
    env.DB.prepare(
      `INSERT INTO app_links (account_id, app_id, scopes, consent_version, granted_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (account_id, app_id) DO UPDATE SET scopes = excluded.scopes, consent_version = excluded.consent_version, updated_at = excluded.updated_at`
    ).bind(accountId, appId, json, CONSENT_VERSION, now, now),
    env.DB.prepare('INSERT INTO consent_log (account_id, app_id, action, scopes, consent_version, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(accountId, appId, row ? 'update' : 'grant', json, CONSENT_VERSION, now),
  ];
  if (!acceso) stmts.push(env.DB.prepare('DELETE FROM noi_scores WHERE account_id = ? AND app_id = ?').bind(accountId, appId));
  await env.DB.batch(stmts);
  return true;
}

/**
 * Accende (con un indirizzo qualunque) o spegne il consenso alle comunicazioni. Acceso = stato 'in-attesa': la conferma con il link richiede
 * l'invio di un'email, che oggi non esiste, quindi nessun messaggio parte. Spento = l'indirizzo si cancella. Restituisce true se è cambiato qualcosa.
 */
export async function impostaComunicazioni(env: ConsensiEnv, account: AccountConsensi, appId: string, acceso: boolean, emailGrezza: unknown, now = Date.now()): Promise<boolean> {
  if (acceso) {
    const email = normalizeEmail(emailGrezza);
    if (!email) throw new HttpError(400, 'serve un indirizzo email valido per le comunicazioni');
    if (account.comunicazioni_stato && account.comunicazioni_email === email) return false;
    await env.DB.batch([
      env.DB.prepare('UPDATE accounts SET comunicazioni_email = ?, comunicazioni_stato = ?, comunicazioni_at = ?, updated_at = ? WHERE id = ?').bind(email, 'in-attesa', now, now, account.id),
      env.DB.prepare('INSERT INTO consent_log (account_id, app_id, action, scopes, consent_version, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(account.id, appId, account.comunicazioni_stato ? 'update' : 'grant', JSON.stringify(['comunicazioni']), CONSENT_VERSION, now),
    ]);
    return true;
  }
  if (!account.comunicazioni_stato) return false;
  await env.DB.batch([
    env.DB.prepare('UPDATE accounts SET comunicazioni_email = NULL, comunicazioni_stato = NULL, comunicazioni_at = NULL, updated_at = ? WHERE id = ?').bind(now, account.id),
    env.DB.prepare('INSERT INTO consent_log (account_id, app_id, action, scopes, consent_version, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(account.id, appId, 'revoke', JSON.stringify(['comunicazioni']), CONSENT_VERSION, now),
  ]);
  return true;
}

// --- Esportazione per l'autore (solo con ADMIN_TOKEN) ----------------------------------------------------------------------------------

export const CSV_COLUMNS = ['project_id', 'email_comunicazioni', 'stato', 'consenso_dal', 'creato'] as const;

/** Chi ha dato il consenso alle comunicazioni. `soloConfermati` = solo chi ha confermato con il link (oggi nessuno: la conferma non esiste ancora). */
export async function esportaComunicazioni(env: ConsensiEnv, soloConfermati: boolean) {
  const { results } = await env.DB.prepare(
    `SELECT id, comunicazioni_email, comunicazioni_stato, comunicazioni_at, created_at FROM accounts
     WHERE comunicazioni_stato IS NOT NULL ${soloConfermati ? "AND comunicazioni_stato = 'confermato'" : ''} ORDER BY created_at`
  ).all<{ id: string; comunicazioni_email: string; comunicazioni_stato: string; comunicazioni_at: number; created_at: number }>();
  return results.map(r => ({
    project_id: r.id, email_comunicazioni: r.comunicazioni_email, stato: r.comunicazioni_stato,
    consenso_dal: new Date(r.comunicazioni_at).toISOString(), creato: new Date(r.created_at).toISOString(),
  }));
}

// CSV (RFC 4180). Le celle che iniziano con = + - @ vengono precedute da un apice: il file si apre spesso in Excel o Fogli, dove sarebbero formule.
export function toCsv(rows: Record<string, string | number>[]): string {
  const cell = (v: string | number) => {
    let s = String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [CSV_COLUMNS.join(',')];
  for (const r of rows) lines.push(CSV_COLUMNS.map(c => cell(r[c] ?? '')).join(','));
  return `﻿${lines.join('\r\n')}\r\n`;
}

// Confronto a tempo costante: si confrontano le impronte SHA-256, della stessa lunghezza.
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const x = new Uint8Array(ha), y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
