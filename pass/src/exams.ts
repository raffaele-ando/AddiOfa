// Simulazioni: le domande, il mescolamento e le risposte esatte restano sul server; il punteggio lo calcola il server.

import { getEntitlement } from './entitlement';
import type { Env } from './env';
import { badRequest, HttpError, json, readJson } from './http';
import { requireUser } from './identity';
import { limitUser } from './limits';
import { FORMATS, FREE_SIMULATIONS, isFormatId, SIMILARITY_MAX, TIME_TOLERANCE_SECONDS, type ExamFormat } from './formats';
import { parseOptions, passRequired, pubQuestion, type PublicQuestion, type QuestionRow } from './questions';
import { chunk, randomCode, shuffle, similarity, tokens } from './util';

interface StoredQuestion { id: string; options: string[]; correct: number }

interface ExamRow {
  id: string;
  user_id: string;
  format: string;
  started_at: number;
  questions: string;
  submitted_at: number | null;
  result: string | null;
}

interface ExamSession {
  id: string;
  format: ExamFormat['id'];
  startedAt: number;
  questions: PublicQuestion[];
}

/** Sceglie le domande: prima quelle poco simili tra loro, poi (se non bastano) le altre. */
function pickQuestions(pool: { id: string; prompt: string }[], count: number): string[] {
  const shuffled = shuffle(pool).map(q => ({ id: q.id, t: tokens(q.prompt) }));
  const chosen: typeof shuffled = [];
  for (const q of shuffled) {
    if (chosen.length >= count) break;
    if (!chosen.some(c => similarity(c.t, q.t) > SIMILARITY_MAX)) chosen.push(q);
  }
  for (const q of shuffled) {
    if (chosen.length >= count) break;
    if (!chosen.includes(q)) chosen.push(q);
  }
  return chosen.map(q => q.id);
}

async function fetchRows(env: Env, ids: string[]): Promise<Map<string, QuestionRow>> {
  const map = new Map<string, QuestionRow>();
  for (const part of chunk(ids, 90)) {
    const { results } = await env.DB.prepare(`SELECT * FROM questions WHERE id IN (${part.map(() => '?').join(',')})`)
      .bind(...part).all<QuestionRow>();
    for (const r of results) map.set(r.id, r);
  }
  return map;
}

async function buildSession(env: Env, exam: ExamRow): Promise<ExamSession> {
  const stored = JSON.parse(exam.questions) as StoredQuestion[];
  const rows = await fetchRows(env, stored.map(s => s.id));
  const questions = stored.flatMap(s => {
    const r = rows.get(s.id);
    return r ? [pubQuestion(s.id, r.prompt, s.options, r)] : [];
  });
  return { id: exam.id, format: exam.format as ExamFormat['id'], startedAt: exam.started_at, questions };
}

export async function examStart(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{ format?: unknown }>(request);
  if (!isFormatId(body.format)) throw badRequest("Formato non valido: usa 'ente' oppure 'teng'.", 'bad_format');
  const format = FORMATS[body.format];

  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);
  const ent = await getEntitlement(env, user.id);
  const hasPass = ent.tier === 'pass';

  if (!hasPass) {
    if (format.id !== 'ente') throw passRequired('La simulazione TENG fa parte del Pass AddiOFA.');
    const { results: prev } = await env.DB.prepare('SELECT * FROM exams WHERE user_id = ? ORDER BY started_at DESC')
      .bind(user.id).all<ExamRow>();
    if (prev.length >= FREE_SIMULATIONS) {
      // Una simulazione ancora aperta e nei tempi si riprende (non si perde per un aggiornamento della pagina)
      const open = prev.find(e => !e.submitted_at && Date.now() - e.started_at <= (format.minutes * 60 + TIME_TOLERANCE_SECONDS) * 1000);
      if (open) return json(await buildSession(env, open));
      throw passRequired('La simulazione gratuita è già stata usata. Il Pass le sblocca tutte.');
    }
  }

  // Senza Pass le simulazioni usano solo il nucleo gratuito: niente domande a pagamento.
  const conditions = ['1=1'];
  if (!hasPass) conditions.push('core = 1');
  if (format.options === 5) conditions.push("extra_option IS NOT NULL AND extra_option <> ''");
  const { results: pool } = await env.DB.prepare(`SELECT id, prompt FROM questions WHERE ${conditions.join(' AND ')}`)
    .all<{ id: string; prompt: string }>();

  const size = pool.length >= format.questions ? format.questions : env.ALLOW_SHORT_EXAMS === 'true' ? pool.length : 0;
  if (size === 0) {
    throw new HttpError(503, 'bank_too_small', 'Non ci sono ancora abbastanza domande per questa simulazione.');
  }

  const ids = pickQuestions(pool, size);
  const rows = await fetchRows(env, ids);
  const stored: StoredQuestion[] = ids.map(id => {
    const r = rows.get(id)!;
    const base = parseOptions(r.options).map((text, i) => ({ text, isCorrect: i === r.correct_index }));
    if (format.options === 5 && r.extra_option) base.push({ text: r.extra_option, isCorrect: false });
    const mixed = shuffle(base);
    return { id, options: mixed.map(o => o.text), correct: mixed.findIndex(o => o.isCorrect) };
  });

  const exam: ExamRow = {
    id: `EX-${randomCode(14)}`, user_id: user.id, format: format.id, started_at: Date.now(),
    questions: JSON.stringify(stored), submitted_at: null, result: null,
  };
  await env.DB.prepare('INSERT INTO exams (id, user_id, format, started_at, questions) VALUES (?, ?, ?, ?, ?)')
    .bind(exam.id, exam.user_id, exam.format, exam.started_at, exam.questions).run();
  return json(await buildSession(env, exam));
}

export async function examSubmit(request: Request, env: Env, examId: string): Promise<Response> {
  const body = await readJson<{ answers?: unknown; elapsed?: unknown }>(request);
  if (body.answers === null || typeof body.answers !== 'object' || Array.isArray(body.answers)) {
    throw badRequest('Servono le risposte (answers).');
  }
  const answers = body.answers as Record<string, unknown>;
  const elapsedClient = typeof body.elapsed === 'number' && Number.isFinite(body.elapsed) && body.elapsed >= 0
    ? Math.min(Math.round(body.elapsed), 86400) : 0;

  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);

  const exam = await env.DB.prepare('SELECT * FROM exams WHERE id = ? AND user_id = ?').bind(examId, user.id).first<ExamRow>();
  if (!exam) throw new HttpError(404, 'not_found', 'Simulazione non trovata.');
  if (exam.result) return json(JSON.parse(exam.result)); // consegna ripetuta: stesso esito

  const format = FORMATS[exam.format as ExamFormat['id']];
  const stored = JSON.parse(exam.questions) as StoredQuestion[];
  const rows = await fetchRows(env, stored.map(s => s.id));

  let rawCorrect = 0, wrong = 0, omitted = 0;
  const perQuestion = stored.map(s => {
    const a = answers[s.id];
    let correct: boolean | null;
    if (a === null || a === undefined) {
      omitted++; correct = null;
    } else if (typeof a === 'number' && Number.isInteger(a) && a >= 0 && a < s.options.length) {
      correct = a === s.correct;
      if (correct) rawCorrect++; else wrong++;
    } else {
      throw badRequest(`Risposta non valida per la domanda ${s.id}.`);
    }
    const r = rows.get(s.id);
    const item: { id: string; correct: boolean | null; correctIndex: number; explanation: string; theoryId?: string } = {
      id: s.id, correct, correctIndex: s.correct, explanation: r?.explanation_it ?? '',
    };
    if (r?.theory_id) item.theoryId = r.theory_id;
    return item;
  });

  const now = Date.now();
  const elapsedServer = Math.round((now - exam.started_at) / 1000);
  const limitSeconds = format.minutes * 60;
  const timedOut = elapsedServer > limitSeconds + TIME_TOLERANCE_SECONDS;
  const score = Math.round((rawCorrect - wrong * format.penalty) * 100) / 100;
  const result = {
    rawCorrect, wrong, omitted, score,
    passed: !timedOut && rawCorrect >= format.passMark, // fuori tempo non si supera
    timedOut,
    elapsedSeconds: elapsedServer,
    perQuestion,
  };

  const done = await env.DB.prepare('UPDATE exams SET submitted_at = ?, elapsed_client = ?, result = ? WHERE id = ? AND result IS NULL')
    .bind(now, elapsedClient, JSON.stringify(result), exam.id).run();
  if (done.meta.changes === 0) {
    // Consegna in parallelo: vale la prima
    const first = await env.DB.prepare('SELECT result FROM exams WHERE id = ?').bind(exam.id).first<{ result: string }>();
    if (first?.result) return json(JSON.parse(first.result));
  }
  return json(result);
}
