// Risposte JSON uniformi: errori sempre come { error: codice, message: italiano }.

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export function errorResponse(err: HttpError): Response {
  return json({ error: err.code, message: err.message, ...err.extra }, err.status);
}

const MAX_BODY = 64 * 1024;

export async function readText(request: Request): Promise<string> {
  const text = await request.text();
  if (text.length > MAX_BODY) throw new HttpError(413, 'body_too_large', 'Richiesta troppo grande.');
  return text;
}

export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T> {
  const text = await readText(request);
  try {
    const value = JSON.parse(text) as unknown;
    if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('non oggetto');
    return value as T;
  } catch {
    throw new HttpError(400, 'bad_json', 'La richiesta non è un JSON valido.');
  }
}

export function badRequest(message: string, code = 'bad_request'): HttpError {
  return new HttpError(400, code, message);
}
