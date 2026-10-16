// Utilità HTTP condivise: errori, risposte JSON, lettura del corpo con limite di dimensione.

export class HttpError extends Error {
  constructor(public status: number, message: string, public headers?: Record<string, string>) {
    super(message);
  }
}

export function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });
}

export const DEFAULT_BODY_MAX = 16 * 1024;

// Legge il corpo come testo fermandosi (413) appena supera maxBytes, anche senza Content-Length.
export async function readBodyText(request: Request, maxBytes: number): Promise<string> {
  const declared = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declared) && declared > maxBytes) throw new HttpError(413, 'richiesta troppo grande');
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new HttpError(413, 'richiesta troppo grande');
    }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) { all.set(c, offset); offset += c.byteLength; }
  return new TextDecoder().decode(all);
}

export async function readJson<T>(request: Request, maxBytes = DEFAULT_BODY_MAX): Promise<T> {
  const text = await readBodyText(request, maxBytes);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, 'JSON non valido');
  }
}
