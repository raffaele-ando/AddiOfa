// Controlli dei dati della registrazione. Le regole dell'email sono le stesse del Worker (atlas/src/signups.ts):
// minuscola e senza spazi; solo il dominio polimi.it, mail.polimi.it e i sottodomini *.polimi.it.
// IMPORTANTE: si controlla solo il formato e il dominio. Senza un invio di posta non si può sapere se l'indirizzo è davvero di chi lo scrive:
// per questo il dato si chiama sempre «non verificata» e non esiste nessuna funzione che dica il contrario.

const LOCAL_RE = /^[a-z0-9][a-z0-9._%+'-]{0,63}$/;
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
// eslint-disable-next-line no-control-regex
const CONTROLLO_RE = /[\u0000-\u001f\u007f]/g;

export const NOME_MAX = 80;
export const NOME_MIN = 2;

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

/** Nome come lo vuole essere chiamato: spazi ripuliti, niente caratteri di controllo. Restituisce null se troppo corto o troppo lungo. */
export function pulisciNome(grezzo: string): string | null {
  const nome = (grezzo ?? '').replace(CONTROLLO_RE, ' ').replace(/\s+/g, ' ').trim();
  return nome.length >= NOME_MIN && nome.length <= NOME_MAX ? nome : null;
}

export interface DatiMinimi { nome: string; email: string }

export interface ErroriDati { nome?: string; email?: string }

/** I due soli dati obbligatori. Restituisce gli errori da mostrare (vuoto = tutto a posto). */
export function controllaDatiMinimi(d: DatiMinimi): ErroriDati {
  const errori: ErroriDati = {};
  if (pulisciNome(d.nome) === null) errori.nome = d.nome.trim().length > NOME_MAX ? `Al massimo ${NOME_MAX} caratteri.` : 'Scrivi il tuo nome.';
  const e = controllaEmailPolimi(d.email);
  if ('motivo' in e) errori.email = TESTO_MOTIVO_EMAIL[e.motivo];
  return errori;
}
