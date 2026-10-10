// Domande servite dal server. Le domande del nucleo (core=1) sono libere; le altre richiedono il Pass.

import { getEntitlement } from './entitlement';
import type { Env } from './env';
import { badRequest, HttpError, json, readJson } from './http';
import { requireUser } from './identity';
import { limitUser } from './limits';

export interface QuestionRow {
  id: string;
  prompt: string;
  options: string;
  extra_option: string | null;
  correct_index: number;
  explanation_it: string;
  theory_id: string | null;
  category: string;
  level: string | null;
  grammar_topic: string | null;
  core: number;
}

export interface PublicQuestion {
  id: string;
  prompt: string;
  options: string[];
  category: string;
  level?: string;
  grammarTopic?: string;
}

export function pubQuestion(id: string, prompt: string, options: string[], row: { category: string; level: string | null; grammar_topic: string | null }): PublicQuestion {
  const q: PublicQuestion = { id, prompt, options, category: row.category };
  if (row.level) q.level = row.level;
  if (row.grammar_topic) q.grammarTopic = row.grammar_topic;
  return q;
}

export function parseOptions(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (Array.isArray(v) && v.every(x => typeof x === 'string')) return v;
  } catch { /* ripiego sotto */ }
  throw new HttpError(500, 'bad_question', 'Domanda non valida nel banco.');
}

export function passRequired(message: string, extra: Record<string, unknown> = {}): HttpError {
  return new HttpError(403, 'pass_required', message, extra);
}

const ID_RE = /^[\w.:-]{1,80}$/;
const MAX_BATCH = 100; // D1 accetta al massimo 100 parametri per query

export async function questionsBatch(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{ ids?: unknown }>(request);
  if (!Array.isArray(body.ids) || body.ids.length === 0 || body.ids.length > MAX_BATCH
    || !body.ids.every(i => typeof i === 'string' && ID_RE.test(i))) {
    throw badRequest(`Servono da 1 a ${MAX_BATCH} identificativi di domanda.`);
  }
  const ids = Array.from(new Set(body.ids as string[]));

  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);

  const { results } = await env.DB.prepare(
    `SELECT id, prompt, options, category, level, grammar_topic, core FROM questions WHERE id IN (${ids.map(() => '?').join(',')})`,
  ).bind(...ids).all<QuestionRow>();

  const blocked = results.filter(r => r.core !== 1).map(r => r.id);
  if (blocked.length > 0) {
    const ent = await getEntitlement(env, user.id);
    if (ent.tier !== 'pass') {
      throw passRequired('Queste domande fanno parte del Pass AddiOFA.', { blocked });
    }
  }

  const byId = new Map(results.map(r => [r.id, r]));
  const questions = ids.flatMap(id => {
    const r = byId.get(id);
    return r ? [pubQuestion(r.id, r.prompt, parseOptions(r.options), r)] : [];
  });
  return json({ questions });
}

export async function questionCheck(request: Request, env: Env, id: string): Promise<Response> {
  const body = await readJson<{ idx?: unknown }>(request);
  if (typeof body.idx !== 'number' || !Number.isInteger(body.idx) || body.idx < 0) {
    throw badRequest("Serve l'indice dell'opzione scelta (idx).");
  }
  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);

  const row = await env.DB.prepare('SELECT options, correct_index, explanation_it, theory_id, core FROM questions WHERE id = ?')
    .bind(id).first<Pick<QuestionRow, 'options' | 'correct_index' | 'explanation_it' | 'theory_id' | 'core'>>();
  if (!row) throw new HttpError(404, 'not_found', 'Domanda non trovata.');

  if (row.core !== 1) {
    const ent = await getEntitlement(env, user.id);
    if (ent.tier !== 'pass') throw passRequired('Questa domanda fa parte del Pass AddiOFA.', { blocked: [id] });
  }
  if (body.idx >= parseOptions(row.options).length) throw badRequest('Opzione inesistente.');

  const result: { correct: boolean; correctIndex: number; explanation: string; theoryId?: string } = {
    correct: body.idx === row.correct_index,
    correctIndex: row.correct_index,
    explanation: row.explanation_it,
  };
  if (row.theory_id) result.theoryId = row.theory_id;
  return json(result);
}
