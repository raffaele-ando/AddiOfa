// Il codice di una sfida: tutto ciò che serve a un amico per giocare le stesse domande e confrontarsi, dentro un link.
// Nessun server: il link porta il seme delle domande, il nome scelto da chi sfida e il suo risultato.
// Il controllo di integrità è un semplice codice di controllo contro i link spezzati o modificati per sbaglio:
// NON è sicurezza (chi vuole può scrivere un risultato falso) e nessuno deve farci affidamento.
import { hash32 } from './seme';

export type TipoCodice = 'd' | 'r'; // d = sfida (duello), r = risposta (il risultato rimandato a chi ha sfidato)

export interface DatiSfida {
  tipo: TipoCodice;
  seme: string;
  /** Impronta del banco di domande di chi ha creato il codice (vedi improntaBanco). */
  banco: string;
  /** Identificativo casuale del giocatore (non è un account). */
  id: string;
  nome: string;
  corrette: number;
  totale: number;
  secondi: number;
}

const VERSIONE = '1';
const SEP = '~';
export const NOME_MAX = 20;

/** Toglie dal nome i caratteri che romperebbero il codice o l'interfaccia (controllo, separatore) e lo accorcia. */
export function pulisciNome(nome: string): string {
  // eslint-disable-next-line no-control-regex
  return nome.replace(/[\u0000-\u001f\u007f~<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, NOME_MAX).trim();
}

function aBase64Url(testo: string): string {
  const byte = new TextEncoder().encode(testo);
  let bin = '';
  for (const b of byte) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function daBase64Url(b64: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(b64)) return null;
  try {
    const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
    const byte = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(byte);
  } catch {
    return null;
  }
}

function controllo(corpo: string): string {
  return hash32(`controllo-sfida|${corpo}`).toString(36).padStart(6, '0').slice(-6);
}

/** Costruisce il codice (solo caratteri adatti a un indirizzo: lettere, numeri, «-», «_» e un punto). */
export function codificaSfida(d: DatiSfida): string {
  const corpo = aBase64Url([VERSIONE, d.tipo, d.seme, d.banco, d.id, d.corrette, d.totale, d.secondi, pulisciNome(d.nome)].join(SEP));
  return `${corpo}.${controllo(corpo)}`;
}

const intero = (s: string, max: number): number | null => (/^\d{1,6}$/.test(s) && Number(s) <= max ? Number(s) : null);

/** Legge un codice. Restituisce null se è manomesso, tagliato, di un'altra versione o con valori impossibili. */
export function decodificaSfida(codice: string): DatiSfida | null {
  const c = codice.trim();
  if (c.length < 10 || c.length > 400) return null;
  const punto = c.lastIndexOf('.');
  if (punto < 1) return null;
  const corpo = c.slice(0, punto);
  if (c.slice(punto + 1) !== controllo(corpo)) return null;
  const testo = daBase64Url(corpo);
  if (!testo) return null;
  const p = testo.split(SEP);
  if (p.length !== 9 || p[0] !== VERSIONE) return null;
  const [, tipo, seme, banco, id, c1, t1, s1, nome] = p;
  if (tipo !== 'd' && tipo !== 'r') return null;
  if (!/^[a-z0-9-]{3,24}$/.test(seme) || !/^[a-z0-9]{3,6}$/.test(banco) || !/^[A-Z0-9]{4,10}$/.test(id)) return null;
  const corrette = intero(c1, 100), totale = intero(t1, 100), secondi = intero(s1, 86_400);
  if (corrette === null || totale === null || secondi === null || totale < 1 || corrette > totale) return null;
  if (pulisciNome(nome) !== nome || nome.length < 1) return null;
  return { tipo, seme, banco, id, nome, corrette, totale, secondi };
}

/** Da quello che l'utente incolla (il link intero, `?sfida=...` o il solo codice) al codice. */
export function estraiCodice(testo: string): string | null {
  const t = testo.trim();
  if (!t) return null;
  const m = t.match(/[?&]sfida=([A-Za-z0-9_.-]+)/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]+\.[a-z0-9]{6}$/.test(t) ? t : null;
}

/** Il link da condividere: la pagina dell'app con `?sfida=<codice>`. `base` è l'indirizzo dell'app senza query. */
export function linkSfida(base: string, codice: string): string {
  return `${base.split(/[?#]/)[0]}?sfida=${codice}`;
}
