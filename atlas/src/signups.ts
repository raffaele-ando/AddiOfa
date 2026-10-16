// Iscrizioni: nome, email PoliMi e consensi raccolti dalle app Project.
// L'email PoliMi qui è solo controllata nel formato e nel dominio: NON è verificata (email_verificata = 0)
// finché ATLAS non potrà inviare un codice per posta.

import { HttpError } from './http';

export interface SignupEnv { DB: D1Database }

export interface SignupRow {
  id: number;
  email: string;
  nome: string;
  app_id: string;
  corso: string | null;
  sede: string | null;
  provenienza: string | null;
  consenso_noi: number;
  consenso_atlas: number;
  consenso_comunicazioni: number;
  consent_version: string;
  email_verificata: number;
  account_id: string | null;
  created_at: number;
  updated_at: number;
}

export interface SignupInput {
  appId: string;
  nome: string;
  email: string;
  corso: string | null;
  sede: string | null;
  provenienza: string | null;
  consensi: { noi: boolean; atlas: boolean; comunicazioni: boolean };
  consentVersion: string;
}

// Nomi dei consensi come compaiono nel registro (consent_log.scopes)
const CONSENT_NAMES = { noi: 'noi.leaderboard', atlas: 'atlas.personalize', comunicazioni: 'comunicazioni' } as const;

export function consentScopes(c: SignupInput['consensi']): string[] {
  return (Object.keys(CONSENT_NAMES) as (keyof typeof CONSENT_NAMES)[]).filter(k => c[k]).map(k => CONSENT_NAMES[k]);
}

const LOCAL_RE = /^[a-z0-9][a-z0-9._%+'-]{0,63}$/;
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

// Minuscola e senza spazi; accetta solo @polimi.it, @mail.polimi.it e sottodomini di polimi.it. Altrimenti null.
export function normalizePolimiEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!LOCAL_RE.test(local) || local.includes('..') || local.endsWith('.')) return null;
  if (!DOMAIN_RE.test(domain)) return null;
  if (domain !== 'polimi.it' && !domain.endsWith('.polimi.it')) return null; // include mail.polimi.it
  return email;
}

// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u001f\u007f]/g;

function cleanText(value: unknown, field: string, max: number, required: boolean): string | null {
  if (value === undefined || value === null || value === '') {
    if (required) throw new HttpError(400, `campo obbligatorio: ${field}`);
    return null;
  }
  if (typeof value !== 'string') throw new HttpError(400, `${field} non valido`);
  const text = value.replace(CONTROL_RE, ' ').replace(/\s+/g, ' ').trim();
  if (!text) {
    if (required) throw new HttpError(400, `campo obbligatorio: ${field}`);
    return null;
  }
  if (text.length > max) throw new HttpError(400, `${field} troppo lungo (massimo ${max} caratteri)`);
  return text;
}

export function parseSignup(body: unknown): SignupInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'corpo non valido');
  const b = body as Record<string, unknown>;

  const appId = typeof b.appId === 'string' ? b.appId.trim() : '';
  if (!/^[a-z0-9-]{1,32}$/.test(appId)) throw new HttpError(400, 'appId non valido');

  const nome = cleanText(b.nome, 'nome', 80, true)!;
  const email = normalizePolimiEmail(b.email);
  if (!email) throw new HttpError(400, 'serve un\'email del Politecnico (@polimi.it, @mail.polimi.it o @…polimi.it)');

  const c = b.consensi as Record<string, unknown> | undefined;
  if (!c || typeof c !== 'object' || Array.isArray(c)
    || typeof c.noi !== 'boolean' || typeof c.atlas !== 'boolean' || typeof c.comunicazioni !== 'boolean') {
    throw new HttpError(400, 'consensi: servono noi, atlas e comunicazioni (true o false)');
  }

  const consentVersion = typeof b.consentVersion === 'string' ? b.consentVersion.trim() : '';
  if (!/^[A-Za-z0-9._-]{1,32}$/.test(consentVersion)) throw new HttpError(400, 'consentVersion non valida');

  return {
    appId,
    nome,
    email,
    corso: cleanText(b.corso, 'corso', 120, false),
    sede: cleanText(b.sede, 'sede', 60, false),
    provenienza: cleanText(b.provenienza, 'provenienza', 80, false),
    consensi: { noi: c.noi, atlas: c.atlas, comunicazioni: c.comunicazioni },
    consentVersion,
  };
}

// Inserisce o aggiorna l'iscrizione in modo idempotente (chiave: email). Non rivela se esisteva.
// Un'iscrizione già collegata a un Project ID (cioè a un login Google) non si cambia da qui, senza token:
// chiunque conosca un'email potrebbe altrimenti riscriverne nome e consensi.
export async function upsertSignup(env: SignupEnv, input: SignupInput, now = Date.now()): Promise<void> {
  const scopesJson = JSON.stringify(consentScopes(input.consensi));
  const flags = [input.consensi.noi ? 1 : 0, input.consensi.atlas ? 1 : 0, input.consensi.comunicazioni ? 1 : 0];

  const [ins] = await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO signups (email, nome, app_id, corso, sede, provenienza, consenso_noi, consenso_atlas,
         consenso_comunicazioni, consent_version, email_verificata, account_id, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 0,
         (SELECT id FROM accounts WHERE polimi_email = ?1 ORDER BY created_at LIMIT 1), ?11, ?11)
       ON CONFLICT (email) DO NOTHING`
    ).bind(input.email, input.nome, input.appId, input.corso, input.sede, input.provenienza,
      flags[0], flags[1], flags[2], input.consentVersion, now),
    // Prima voce del registro, solo se l'iscrizione ne è ancora priva (vale per l'inserimento appena fatto)
    env.DB.prepare(
      `INSERT INTO consent_log (account_id, signup_id, app_id, action, scopes, consent_version, created_at)
       SELECT NULL, s.id, ?, 'grant', ?, ?, ? FROM signups s
       WHERE s.email = ? AND NOT EXISTS (SELECT 1 FROM consent_log l WHERE l.signup_id = s.id)`
    ).bind(input.appId, scopesJson, input.consentVersion, now, input.email),
  ]);
  if (ins.meta.changes > 0) return;

  // Iscrizione già presente: aggiorna i dati e annota nel registro solo se i consensi o la versione cambiano
  const row = await env.DB.prepare('SELECT * FROM signups WHERE email = ?').bind(input.email).first<SignupRow>();
  if (!row || row.account_id) return;
  const changed = row.consenso_noi !== flags[0] || row.consenso_atlas !== flags[1]
    || row.consenso_comunicazioni !== flags[2] || row.consent_version !== input.consentVersion;
  const statements = [
    env.DB.prepare(
      `UPDATE signups SET nome = ?, corso = COALESCE(?, corso), sede = COALESCE(?, sede),
         provenienza = COALESCE(?, provenienza), consenso_noi = ?, consenso_atlas = ?, consenso_comunicazioni = ?,
         consent_version = ?, updated_at = ? WHERE id = ? AND account_id IS NULL`
    ).bind(input.nome, input.corso, input.sede, input.provenienza, flags[0], flags[1], flags[2],
      input.consentVersion, now, row.id),
  ];
  if (changed) {
    statements.push(env.DB.prepare(
      `INSERT INTO consent_log (account_id, signup_id, app_id, action, scopes, consent_version, created_at)
       VALUES (NULL, ?, ?, 'update', ?, ?, ?)`
    ).bind(row.id, input.appId, scopesJson, input.consentVersion, now));
  }
  await env.DB.batch(statements);
}

// --- Collegamento con il Project ID ------------------------------------------------------------

// Ricorda l'email PoliMi dell'account e collega l'iscrizione con quell'email, se esiste ed è ancora libera.
// raw === null: scollega. Chi arriva per primo si prende l'iscrizione (l'email non è verificata).
export async function setPolimiEmail(env: SignupEnv, accountId: string, raw: unknown, now = Date.now()): Promise<void> {
  if (raw === null || raw === '') {
    await env.DB.batch([
      env.DB.prepare('UPDATE accounts SET polimi_email = NULL, updated_at = ? WHERE id = ?').bind(now, accountId),
      env.DB.prepare('UPDATE signups SET account_id = NULL WHERE account_id = ?').bind(accountId),
    ]);
    return;
  }
  const email = normalizePolimiEmail(raw);
  if (!email) throw new HttpError(400, 'email PoliMi non valida (@polimi.it, @mail.polimi.it o @…polimi.it)');
  await env.DB.batch([
    env.DB.prepare('UPDATE accounts SET polimi_email = ?, updated_at = ? WHERE id = ?').bind(email, now, accountId),
    env.DB.prepare('UPDATE signups SET account_id = NULL WHERE account_id = ? AND email != ?').bind(accountId, email),
    env.DB.prepare('UPDATE signups SET account_id = ? WHERE email = ? AND account_id IS NULL').bind(accountId, email),
  ]);
}

export async function getLinkedSignup(env: SignupEnv, accountId: string): Promise<SignupRow | null> {
  return env.DB.prepare('SELECT * FROM signups WHERE account_id = ?').bind(accountId).first<SignupRow>();
}

export function publicSignup(s: SignupRow) {
  return {
    email: s.email,
    nome: s.nome,
    appId: s.app_id,
    corso: s.corso,
    sede: s.sede,
    provenienza: s.provenienza,
    consensi: consensiOf(s),
    consentVersion: s.consent_version,
    emailVerificata: s.email_verificata === 1,
    creatoIl: s.created_at,
    aggiornatoIl: s.updated_at,
  };
}

export function consensiOf(s: SignupRow) {
  return { noi: s.consenso_noi === 1, atlas: s.consenso_atlas === 1, comunicazioni: s.consenso_comunicazioni === 1 };
}

// Aggiornamento di corso, sede e provenienza da parte di chi ha il Project ID (PATCH /v1/me)
export async function updateLinkedSignupFields(
  env: SignupEnv, signup: SignupRow, fields: { corso?: unknown; sede?: unknown; provenienza?: unknown }, now = Date.now()
): Promise<void> {
  const corso = fields.corso === undefined ? signup.corso : cleanText(fields.corso, 'corso', 120, false);
  const sede = fields.sede === undefined ? signup.sede : cleanText(fields.sede, 'sede', 60, false);
  const provenienza = fields.provenienza === undefined ? signup.provenienza : cleanText(fields.provenienza, 'provenienza', 80, false);
  await env.DB.prepare('UPDATE signups SET corso = ?, sede = ?, provenienza = ?, updated_at = ? WHERE id = ?')
    .bind(corso, sede, provenienza, now, signup.id).run();
}

export function validateProfileFields(fields: { corso?: unknown; sede?: unknown; provenienza?: unknown }) {
  cleanText(fields.corso, 'corso', 120, false);
  cleanText(fields.sede, 'sede', 60, false);
  cleanText(fields.provenienza, 'provenienza', 80, false);
}

// --- Esportazione (solo per l'autore, con ADMIN_TOKEN) -----------------------------------------

export const CSV_COLUMNS = [
  'id', 'email', 'nome', 'app', 'corso', 'sede', 'provenienza',
  'consenso_noi', 'consenso_atlas', 'consenso_comunicazioni', 'versione_consenso',
  'email_verificata', 'project_id', 'creato', 'aggiornato',
] as const;

export async function exportSignups(env: SignupEnv, onlyComunicazioni: boolean) {
  const out: Record<(typeof CSV_COLUMNS)[number], string | number>[] = [];
  let after = 0;
  for (;;) {
    const { results } = await env.DB.prepare(
      `SELECT s.*, a.id AS project_id FROM signups s LEFT JOIN accounts a ON a.id = s.account_id
       WHERE s.id > ? ${onlyComunicazioni ? 'AND s.consenso_comunicazioni = 1' : ''} ORDER BY s.id LIMIT 2000`
    ).bind(after).all<SignupRow & { project_id: string | null }>();
    for (const r of results) {
      out.push({
        id: r.id, email: r.email, nome: r.nome, app: r.app_id, corso: r.corso ?? '', sede: r.sede ?? '',
        provenienza: r.provenienza ?? '', consenso_noi: r.consenso_noi, consenso_atlas: r.consenso_atlas,
        consenso_comunicazioni: r.consenso_comunicazioni, versione_consenso: r.consent_version,
        email_verificata: r.email_verificata, project_id: r.project_id ?? '',
        creato: new Date(r.created_at).toISOString(), aggiornato: new Date(r.updated_at).toISOString(),
      });
      after = r.id;
    }
    if (results.length < 2000) break;
  }
  return out;
}

// CSV (RFC 4180). Le celle che iniziano con = + - @ vengono precedute da un apice: i dati arrivano da un
// modulo pubblico e il file si apre spesso in Excel o Fogli, dove sarebbero formule.
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
