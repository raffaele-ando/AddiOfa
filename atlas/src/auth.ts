// Verifica dei token di Firebase Authentication (login Google) senza dipendenze:
// firma RS256 controllata con le chiavi pubbliche di Google, poi iss, aud ed exp.

const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

export interface AuthClaims {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

interface Jwk extends JsonWebKey {
  kid: string;
}

let cachedKeys: { keys: Map<string, CryptoKey>; expiresAt: number } | null = null;

async function getKeys(): Promise<Map<string, CryptoKey>> {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) return cachedKeys.keys;
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error(`JWKS ${res.status}`);
  const body = (await res.json()) as { keys: Jwk[] };
  const keys = new Map<string, CryptoKey>();
  for (const jwk of body.keys) {
    keys.set(
      jwk.kid,
      await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    );
  }
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get('cache-control') ?? '')?.[1] ?? 3600);
  cachedKeys = { keys, expiresAt: Date.now() + maxAge * 1000 };
  return keys;
}

function base64UrlDecode(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  const bin = atob(b64);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

function decodeJson<T>(part: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlDecode(part))) as T;
}

export async function verifyFirebaseToken(token: string, firebaseProjectId: string): Promise<AuthClaims> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('token malformato');
  const [headerB64, payloadB64, signatureB64] = parts;

  const header = decodeJson<{ alg: string; kid: string }>(headerB64);
  if (header.alg !== 'RS256') throw new Error('algoritmo non valido');

  const key = (await getKeys()).get(header.kid);
  if (!key) throw new Error('chiave sconosciuta');

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    base64UrlDecode(signatureB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );
  if (!valid) throw new Error('firma non valida');

  const payload = decodeJson<{
    iss: string; aud: string; sub: string; exp: number; iat: number;
    email?: string; name?: string; picture?: string;
  }>(payloadB64);
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== firebaseProjectId) throw new Error('aud non valido');
  if (payload.iss !== `https://securetoken.google.com/${firebaseProjectId}`) throw new Error('iss non valido');
  if (payload.exp <= now || payload.iat > now + 300) throw new Error('token scaduto');
  if (!payload.sub) throw new Error('sub mancante');

  return { uid: payload.sub, email: payload.email, name: payload.name, picture: payload.picture };
}
