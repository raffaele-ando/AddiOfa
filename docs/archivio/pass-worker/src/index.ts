// AddiOFA Pass: Worker Cloudflare + D1. Domande, Pass, simulazioni, lista d'attesa, inviti, pagamenti.
// Contratto con l'app: app/src/access/provider.ts (ApiProvider). Descrizione delle rotte in README.md.

import type { Env } from './env';
import { errorResponse, HttpError, json } from './http';
import { questionCheck, questionsBatch } from './questions';
import { examStart, examSubmit } from './exams';
import { createInvite, inviteProgress, redeemInvite, verifyConfirm, verifyStart } from './invites';
import { checkout, stripeWebhook } from './stripe';
import { deleteMe, entitlementRoute, exportMe, trackEvent, waitlist, withdraw } from './misc';

export type { Env };

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Device',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  // Origine non in elenco: niente intestazione, il browser blocca la risposta
  if (allowed.includes('*')) headers['Access-Control-Allow-Origin'] = '*';
  else if (allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method;
  let m: RegExpMatchArray | null;

  if (path === '/v1/health' && method === 'GET') return json({ ok: true, service: 'addiofa-pass' });

  if (path === '/v1/entitlement' && method === 'GET') return entitlementRoute(request, env);

  // --- Domande ---
  if (path === '/v1/q/batch' && method === 'POST') return questionsBatch(request, env);
  if ((m = path.match(/^\/v1\/q\/([\w.:-]{1,80})\/check$/)) && method === 'POST') return questionCheck(request, env, m[1]);

  // --- Simulazioni ---
  if (path === '/v1/exam/start' && method === 'POST') return examStart(request, env);
  if ((m = path.match(/^\/v1\/exam\/([\w-]{1,64})\/submit$/)) && method === 'POST') return examSubmit(request, env, m[1]);

  // --- Pubblico e statistiche ---
  if (path === '/v1/waitlist' && method === 'POST') return waitlist(request, env);
  if (path === '/v1/event' && method === 'POST') return trackEvent(request, env);
  if (path === '/v1/withdraw' && method === 'POST') return withdraw(request, env);

  // --- Dati personali ---
  if (path === '/v1/me' && method === 'DELETE') return deleteMe(request, env);
  if (path === '/v1/me/export' && method === 'GET') return exportMe(request, env);

  // --- Inviti ---
  if (path === '/v1/invites' && method === 'POST') return createInvite(request, env);
  if (path === '/v1/invites/progress' && method === 'GET') return inviteProgress(request, env);
  if (path === '/v1/invites/redeem' && method === 'POST') return redeemInvite(request, env);
  if (path === '/v1/invites/verify/start' && method === 'POST') return verifyStart(request, env);
  if (path === '/v1/invites/verify/confirm' && method === 'POST') return verifyConfirm(request, env);

  // --- Pagamenti ---
  if (path === '/v1/checkout' && method === 'POST') return checkout(request, env);
  if (path === '/v1/stripe/webhook' && method === 'POST') return stripeWebhook(request, env);

  throw new HttpError(404, 'not_found', 'Rotta non trovata.');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    let response: Response;
    try {
      response = await handle(request, env);
    } catch (err) {
      if (err instanceof HttpError) {
        response = errorResponse(err);
      } else {
        console.error(err);
        response = errorResponse(new HttpError(500, 'internal', 'Errore interno. Riprova tra poco.'));
      }
    }
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) headers.set(k, v);
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
