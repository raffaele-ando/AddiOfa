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
  scuola: string | null;
  livello: string | null;
  anno: number | null;
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
  scuola: string | null;
  livello: string | null;
  anno: number | null;
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

export const SCUOLE = ['ing-ind-inf', 'icat', 'auic', 'design'] as const;
export const LIVELLI = ['triennale', 'magistrale', 'ciclo-unico'] as const;

// Id breve: a-z, 0-9 e trattino (sede, provenienza). Accetta maiuscole e spazi ai bordi, che normalizza.
function cleanId(value: unknown, field: string, min = 2, max = 30): string | null {
  if (value === undefined || value === null || value === '') return null;
  const id = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!new RegExp(`^[a-z0-9-]{${min},${max}}$`).test(id)) {
    throw new HttpError(400, `${field} non valido (${min}-${max} caratteri tra a-z, 0-9 e -)`);
  }
  return id;
}

function cleanEnum<T extends string>(value: unknown, field: string, allowed: readonly T[]): T | null {
  if (value === undefined || value === null || value === '') return null;
  const v = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!(allowed as readonly string[]).includes(v)) throw new HttpError(400, `${field} non valido (${allowed.join(', ')})`);
  return v as T;
}

function cleanAnno(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 6) {
    throw new HttpError(400, 'anno non valido (intero da 1 a 6)');
  }
  return value;
}

// Nome ricavato dall'email quando l'app non lo manda: parte prima della @ (e prima di un eventuale +),
// separata sui punti, senza cifre, con l'iniziale maiuscola: "mario.rossi12@polimi.it" -> "Mario Rossi".
export function nomeDaEmail(email: string): string | null {
  const locale = email.split('@')[0].split('+')[0];
  const parti = locale.split('.').map(p => p.replace(/[0-9]/g, '').replace(/[^a-z'-]/g, '')).filter(p => p.length > 0);
  const nome = parti.map(p => p[0].toUpperCase() + p.slice(1)).join(' ').slice(0, 80);
  return nome.length >= 2 ? nome : null;
}

export function parseSignup(body: unknown): SignupInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'corpo non valido');
  const b = body as Record<string, unknown>;

  const appId = typeof b.appId === 'string' ? b.appId.trim() : '';
  if (!/^[a-z0-9-]{1,32}$/.test(appId)) throw new HttpError(400, 'appId non valido');

  const email = normalizePolimiEmail(b.email);
  if (!email) throw new HttpError(400, 'serve un\'email del Politecnico (@polimi.it, @mail.polimi.it o @…polimi.it)');
  // Il nome è facoltativo: se manca (o è vuoto) si ricava dall'email
  const nome = cleanText(b.nome, 'nome', 80, false) ?? nomeDaEmail(email);
  if (!nome) throw new HttpError(400, 'campo obbligatorio: nome (non si ricava dall\'email)');

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
    sede: cleanId(b.sede, 'sede'),
    provenienza: cleanId(b.provenienza, 'provenienza'),
    scuola: cleanEnum(b.scuola, 'scuola', SCUOLE),
    livello: cleanEnum(b.livello, 'livello', LIVELLI),
    anno: cleanAnno(b.anno),
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
         consenso_comunicazioni, consent_version, email_verificata, account_id, created_at, updated_at,
         scuola, livello, anno)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 0,
         (SELECT id FROM accounts WHERE polimi_email = ?1 ORDER BY created_at LIMIT 1), ?11, ?11, ?12, ?13, ?14)
       ON CONFLICT (email) DO NOTHING`
    ).bind(input.email, input.nome, input.appId, input.corso, input.sede, input.provenienza,
      flags[0], flags[1], flags[2], input.consentVersion, now, input.scuola, input.livello, input.anno),
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
         provenienza = COALESCE(?, provenienza), scuola = COALESCE(?, scuola), livello = COALESCE(?, livello),
         anno = COALESCE(?, anno), consenso_noi = ?, consenso_atlas = ?, consenso_comunicazioni = ?,
         consent_version = ?, updated_at = ? WHERE id = ? AND account_id IS NULL`
    ).bind(input.nome, input.corso, input.sede, input.provenienza, input.scuola, input.livello, input.anno,
      flags[0], flags[1], flags[2], input.consentVersion, now, row.id),
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
    scuola: s.scuola,
    sede: s.sede,
    livello: s.livello,
    corso: s.corso,
    anno: s.anno,
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

// Campi del percorso di studi modificabili da chi ha il Project ID (PATCH /v1/me). Un campo assente non cambia;
// null o stringa vuota lo svuota.
export interface ProfileFields {
  corso?: unknown; sede?: unknown; provenienza?: unknown; scuola?: unknown; livello?: unknown; anno?: unknown;
}

function parseProfileFields(f: ProfileFields) {
  return {
    corso: f.corso === undefined ? undefined : cleanText(f.corso, 'corso', 120, false),
    sede: f.sede === undefined ? undefined : cleanId(f.sede, 'sede'),
    provenienza: f.provenienza === undefined ? undefined : cleanId(f.provenienza, 'provenienza'),
    scuola: f.scuola === undefined ? undefined : cleanEnum(f.scuola, 'scuola', SCUOLE),
    livello: f.livello === undefined ? undefined : cleanEnum(f.livello, 'livello', LIVELLI),
    anno: f.anno === undefined ? undefined : cleanAnno(f.anno),
  };
}

export function validateProfileFields(fields: ProfileFields) {
  parseProfileFields(fields);
}

export function hasProfileFields(fields: ProfileFields): boolean {
  return Object.values(fields).some(v => v !== undefined);
}

export async function updateLinkedSignupFields(
  env: SignupEnv, signup: SignupRow, fields: ProfileFields, now = Date.now()
): Promise<void> {
  const p = parseProfileFields(fields);
  await env.DB.prepare(
    'UPDATE signups SET corso = ?, sede = ?, provenienza = ?, scuola = ?, livello = ?, anno = ?, updated_at = ? WHERE id = ?'
  ).bind(
    p.corso === undefined ? signup.corso : p.corso,
    p.sede === undefined ? signup.sede : p.sede,
    p.provenienza === undefined ? signup.provenienza : p.provenienza,
    p.scuola === undefined ? signup.scuola : p.scuola,
    p.livello === undefined ? signup.livello : p.livello,
    p.anno === undefined ? signup.anno : p.anno,
    now, signup.id,
  ).run();
}

// --- Esportazione (solo per l'autore, con ADMIN_TOKEN) -----------------------------------------

export const CSV_COLUMNS = [
  'id', 'email', 'nome', 'app', 'scuola', 'sede', 'livello', 'corso', 'anno', 'provenienza',
  'consenso_noi', 'consenso_atlas', 'consenso_comunicazioni', 'versione_consenso',
  'email_verificata', 'project_id', 'creato', 'aggiornato',
] as const;

export interface ExportFilters { comunicazioni?: boolean; scuola?: string | null; livello?: string | null }

export function parseExportFilters(params: URLSearchParams): ExportFilters {
  return {
    comunicazioni: params.get('comunicazioni') === '1',
    scuola: cleanEnum(params.get('scuola'), 'scuola', SCUOLE),
    livello: cleanEnum(params.get('livello'), 'livello', LIVELLI),
  };
}

export async function exportSignups(env: SignupEnv, filters: ExportFilters = {}) {
  const where: string[] = [];
  const extra: (string | number)[] = [];
  if (filters.comunicazioni) where.push('s.consenso_comunicazioni = 1');
  if (filters.scuola) { where.push('s.scuola = ?'); extra.push(filters.scuola); }
  if (filters.livello) { where.push('s.livello = ?'); extra.push(filters.livello); }
  const out: Record<(typeof CSV_COLUMNS)[number], string | number>[] = [];
  let after = 0;
  for (;;) {
    const { results } = await env.DB.prepare(
      `SELECT s.*, a.id AS project_id FROM signups s LEFT JOIN accounts a ON a.id = s.account_id
       WHERE s.id > ? ${where.map(w => `AND ${w}`).join(' ')} ORDER BY s.id LIMIT 2000`
    ).bind(after, ...extra).all<SignupRow & { project_id: string | null }>();
    for (const r of results) {
      out.push({
        id: r.id, email: r.email, nome: r.nome, app: r.app_id, scuola: r.scuola ?? '', sede: r.sede ?? '',
        livello: r.livello ?? '', corso: r.corso ?? '', anno: r.anno ?? '',
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
