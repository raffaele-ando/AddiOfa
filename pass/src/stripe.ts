// Pagamenti: Stripe Checkout (REST, senza SDK) e webhook con firma verificata a mano.
// Restano spenti finche' PAYMENTS_ENABLED non e' 'true'.

import { addMonths, getEntitlement } from './entitlement';
import type { Env } from './env';
import { badRequest, HttpError, json, readJson, readText } from './http';
import { requireUser } from './identity';
import { limitUser } from './limits';
import { fromHex } from './util';

const TOLERANCE_SECONDS = 300;

/** Prezzo in centesimi: quello di lancio fino a LAUNCH_UNTIL (compreso), poi quello pieno. */
export function priceCents(env: Env, now = Date.now()): number {
  const full = Number(env.PRICE_CENTS);
  const launch = Number(env.LAUNCH_PRICE_CENTS);
  const until = Date.parse(`${env.LAUNCH_UNTIL}T23:59:59+01:00`);
  return Number.isFinite(until) && now <= until ? launch : full;
}

function allowedOrigin(request: Request, env: Env): string {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!origin || (!allowed.includes('*') && !allowed.includes(origin))) {
    throw new HttpError(400, 'bad_origin', 'Origine non consentita per il pagamento.');
  }
  return origin;
}

export async function checkout(request: Request, env: Env): Promise<Response> {
  if (env.PAYMENTS_ENABLED !== 'true') {
    return json({ error: 'payments_off', message: 'I pagamenti non sono ancora attivi.' }, 503);
  }
  if (!env.STRIPE_SECRET) {
    throw new HttpError(503, 'payments_not_configured', 'Il pagamento non è configurato.');
  }
  const body = await readJson<{ terms?: unknown; waiver?: unknown }>(request);
  // Le due accettazioni arrivano dall'app e finiscono (con la data) nell'ordine: termini e avvio immediato con rinuncia al recesso.
  if (body.terms !== true || body.waiver !== true) {
    throw badRequest('Servono l’accettazione dei termini e il consenso all’avvio immediato del servizio.', 'consent_required');
  }
  const origin = allowedOrigin(request, env);
  const user = await requireUser(request, env);
  await limitUser(env, request, user.id);

  const ent = await getEntitlement(env, user.id);
  if (ent.tier === 'pass') throw new HttpError(409, 'already_pass', 'Hai già un Pass attivo.');

  const now = Date.now();
  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('locale', 'it');
  form.set('client_reference_id', user.id);
  form.set('success_url', `${origin}/?pagamento=ok`);
  form.set('cancel_url', `${origin}/?pagamento=annullato`);
  form.set('line_items[0][quantity]', '1');
  form.set('line_items[0][price_data][currency]', 'eur');
  form.set('line_items[0][price_data][unit_amount]', String(priceCents(env, now)));
  form.set('line_items[0][price_data][product_data][name]', 'Pass AddiOFA (12 mesi)');
  form.set('consent_collection[terms_of_service]', 'required');
  form.set('metadata[user_id]', user.id);
  form.set('metadata[terms_ts]', String(now));
  form.set('metadata[waiver_ts]', String(now));
  if (user.email) form.set('customer_email', user.email);

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };
  if (!res.ok || !data.url) {
    console.error('stripe checkout', res.status, data.error?.message);
    throw new HttpError(502, 'stripe_error', 'Non riesco ad aprire il pagamento. Riprova tra poco.');
  }
  return json({ url: data.url });
}

/** Verifica `Stripe-Signature: t=...,v1=...` (HMAC-SHA256 di "t.corpo") con tolleranza di 5 minuti. */
export async function verifyStripeSignature(rawBody: string, header: string, secret: string, now = Date.now()): Promise<boolean> {
  let t = '';
  const sigs: string[] = [];
  for (const part of header.split(',')) {
    const [k, v] = part.split('=');
    if (k === 't') t = v ?? '';
    else if (k === 'v1' && v) sigs.push(v);
  }
  const ts = Number(t);
  if (!t || !Number.isFinite(ts) || sigs.length === 0) return false;
  if (Math.abs(now / 1000 - ts) > TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const data = new TextEncoder().encode(`${t}.${rawBody}`);
  for (const sig of sigs) {
    const bytes = fromHex(sig);
    if (bytes && (await crypto.subtle.verify('HMAC', key, bytes, data))) return true; // verify e' a tempo costante
  }
  return false;
}

interface StripeSession {
  id: string;
  object?: string;
  client_reference_id?: string | null;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
  consent?: { terms_of_service?: string | null } | null;
  metadata?: Record<string, string> | null;
  created?: number;
}

interface StripeEvent {
  id: string;
  type: string;
  created: number;
  data?: { object?: StripeSession };
}

export async function stripeWebhook(request: Request, env: Env): Promise<Response> {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new HttpError(503, 'webhook_not_configured', 'Il webhook non è configurato.');
  }
  const raw = await readText(request);
  const header = request.headers.get('Stripe-Signature') ?? '';
  if (!(await verifyStripeSignature(raw, header, env.STRIPE_WEBHOOK_SECRET))) {
    throw new HttpError(400, 'bad_signature', 'Firma non valida.');
  }

  let event: StripeEvent;
  try { event = JSON.parse(raw) as StripeEvent; } catch { throw badRequest('JSON non valido.', 'bad_json'); }

  // Si agisce solo sui pagamenti andati a buon fine; gli altri eventi si confermano e si ignorano
  const relevant = event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded';
  const session = event.data?.object;
  if (!relevant || !session?.id || session.payment_status !== 'paid') {
    return json({ received: true, ignored: true });
  }

  const now = Date.now();
  const meta = session.metadata ?? {};
  const toTs = (v: string | undefined) => (v && /^\d{10,}$/.test(v) ? Number(v) : null);
  // Termini: la data dell'accettazione nell'app, altrimenti quella dell'evento se Stripe conferma l'accettazione
  const consentTs = toTs(meta.terms_ts) ?? (session.consent?.terms_of_service === 'accepted' ? event.created * 1000 : null);
  const waiverTs = toTs(meta.waiver_ts);

  const userId = session.client_reference_id || meta.user_id || null;
  const user = userId ? await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first<{ id: string }>() : null;

  // Entrambe le scritture sono idempotenti (id ordine = id sessione, indice unico su order_id):
  // se il primo tentativo si e' interrotto a meta', la consegna ripetuta di Stripe completa il lavoro.
  const order = await env.DB.prepare(
    `INSERT OR IGNORE INTO orders (id, user_id, stripe_event_id, amount_cents, currency, email, consent_ts, waiver_ts, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    session.id, user?.id ?? null, event.id, session.amount_total ?? 0, session.currency ?? 'eur',
    session.customer_details?.email ?? session.customer_email ?? null, consentTs, waiverTs, now,
  ).run();

  let granted = false;
  if (user) {
    const ent = await env.DB.prepare(
      `INSERT OR IGNORE INTO entitlements (user_id, source, starts_at, expires_at, order_id, created_at)
       VALUES (?, 'stripe', ?, ?, ?, ?)`,
    ).bind(user.id, now, addMonths(now), session.id, now).run();
    granted = ent.meta.changes > 0;
  } else {
    console.error('ordine senza utente', session.id);
  }
  return json({ received: true, duplicate: order.meta.changes === 0 && !granted });
}
