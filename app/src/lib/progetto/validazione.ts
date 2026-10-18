// Controlli del formato delle email e del @nome utente. Le regole sono le stesse del Worker (atlas/src/consensi.ts, atlas/src/index.ts):
// minuscola e senza spazi; per il badge «studente PoliMi» solo il dominio polimi.it, mail.polimi.it e i sottodomini *.polimi.it.
// IMPORTANTE: si controlla solo il formato e il dominio. Senza il link di verifica non si può sapere se l'indirizzo è davvero di chi lo scrive:
// per questo il badge esiste solo dopo la verifica.

const LOCAL_RE = /^[a-z0-9][a-z0-9._%+'-]{0,63}$/;
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

export type MotivoEmail = 'vuota' | 'formato' | 'dominio';

export type EsitoEmail = { ok: true; email: string } | { ok: false; motivo: MotivoEmail };

/** True se il dominio è polimi.it, mail.polimi.it o un sottodominio di polimi.it (e non, per esempio, evilpolimi.it o polimi.it.evil.com). */
export function dominioPolimi(dominio: string): boolean {
  const d = dominio.trim().toLowerCase();
  return d === 'polimi.it' || (d.endsWith('.polimi.it') && DOMAIN_RE.test(d));
}

/** Controlla un'email PoliMi. Restituisce l'indirizzo normalizzato (minuscolo, senza spazi ai bordi) o il motivo del rifiuto. */
export function controllaEmailPolimi(grezza: string): EsitoEmail {
  const email = (grezza ?? '').trim().toLowerCase();
  if (!email) return { ok: false, motivo: 'vuota' };
  if (email.length < 6 || email.length > 254) return { ok: false, motivo: 'formato' };
  const parti = email.split('@');
  if (parti.length !== 2) return { ok: false, motivo: 'formato' };
  const [locale, dominio] = parti;
  if (!LOCAL_RE.test(locale) || locale.includes('..') || locale.endsWith('.')) return { ok: false, motivo: 'formato' };
  if (!DOMAIN_RE.test(dominio)) return { ok: false, motivo: 'formato' };
  if (!dominioPolimi(dominio)) return { ok: false, motivo: 'dominio' };
  return { ok: true, email };
}

export const TESTO_MOTIVO_EMAIL: Record<MotivoEmail, string> = {
  vuota: 'Scrivi la tua email del Politecnico.',
  formato: 'L\'indirizzo non sembra corretto.',
  dominio: 'Serve un indirizzo @polimi.it o @mail.polimi.it.',
};

/** Email qualunque (non solo PoliMi), per l'accesso con link e per le comunicazioni: stessa regola del Worker (atlas/src/consensi.ts). Restituisce l'indirizzo normalizzato o il motivo. */
export function controllaEmail(grezza: string): { ok: true; email: string } | { ok: false; motivo: 'vuota' | 'formato' } {
  const email = (grezza ?? '').trim().toLowerCase();
  if (!email) return { ok: false, motivo: 'vuota' };
  if (email.length < 6 || email.length > 254 || email.includes('..')) return { ok: false, motivo: 'formato' };
  const parti = email.split('@');
  if (parti.length !== 2 || !LOCAL_RE.test(parti[0]) || parti[0].endsWith('.') || !DOMAIN_RE.test(parti[1])) return { ok: false, motivo: 'formato' };
  return { ok: true, email };
}

/** Il @nome utente: 3-20 caratteri tra a-z, 0-9, _ e . (stessa regola del Worker). Restituisce il nome normalizzato o null. */
export function controllaHandle(grezzo: string): string | null {
  const h = (grezzo ?? '').trim().toLowerCase();
  return /^[a-z0-9_.]{3,20}$/.test(h) ? h : null;
}
