// Piccole funzioni di servizio: id casuali, hash, mescolamento, somiglianza tra testi.

// 32 caratteri senza ambigui (0/O, 1/I): con 32 simboli il modulo non introduce distorsioni
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function randomCode(len: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, b => ALPHABET[b % 32]).join('');
}

/** Intero uniforme in [0, n) con scarto dei valori che distorcerebbero la distribuzione. */
export function randomInt(n: number): number {
  const limit = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % n;
  }
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return hex(new Uint8Array(digest));
}

export function hex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function fromHex(s: string): Uint8Array | null {
  if (!/^([0-9a-f]{2})+$/i.test(s)) return null;
  return Uint8Array.from(s.match(/../g)!, h => parseInt(h, 16));
}

export function timingSafeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

/** Giorno UTC come AAAA-MM-GG. */
export function today(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'choose', 'correct', 'sentence', 'translation',
  'which', 'complete', 'translate', 'and', 'or', 'but', 'if', 'by', 'from', 'as', 'about',
]);

/** Parole significative di una domanda (stessa logica dell'app). */
export function tokens(text: string): Set<string> {
  return new Set(
    text.toLowerCase().replace(/[^\w\s]|_/g, '').split(/\s+/).filter(w => w.length > 0 && !STOP_WORDS.has(w)),
  );
}

/** Somiglianza di Jaccard tra due insiemi di parole, 0..1. */
export function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
