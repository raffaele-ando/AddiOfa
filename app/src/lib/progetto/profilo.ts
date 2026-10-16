// Il profilo di chi si registra e il collegamento al Project ID, salvati nel dispositivo dentro appState.extra.progetto
// (insieme ai progressi: entrano nell'esportazione e nell'importazione, e un vecchio salvataggio senza questo campo si legge lo stesso).
// Nome ed email sono obbligatori; corso, sede e provenienza sono facoltativi; i tre consensi partono SEMPRE tutti spenti.
import type { AppState } from '../../types';
import { ECOSYSTEM, ISCRIZIONE_VERSIONE, REQUIRED_SCOPES, SCOPES, type ScopeId } from '../../config/ecosystem';
import type { CorpoIscrizione } from '../atlas';
import { eCorso, eProvenienza, eSede, type Provenienza, type Sede } from './corsi';
import { controllaEmailPolimi, pulisciNome } from './validazione';

export const CHIAVE_PROGETTO = 'progetto';

export interface Consensi { noi: boolean; atlas: boolean; comunicazioni: boolean }

/** Nessun consenso preselezionato: è lo stato di partenza di ogni schermata che li chiede. */
export const CONSENSI_VUOTI: Readonly<Consensi> = Object.freeze({ noi: false, atlas: false, comunicazioni: false });

export interface Profilo {
  nome: string;
  email: string;
  /** Sempre false: l'indirizzo è controllato solo nel formato e nel dominio, mai verificato con un invio di posta. */
  emailVerificata: false;
  corso?: string;
  sede?: Sede;
  provenienza?: Provenienza;
  consensi: Consensi;
  /** Versione del testo dei consensi che l'utente ha visto quando li ha scelti. */
  versioneInformativa: string;
  creatoIl: number;
  aggiornatoIl: number;
}

export interface Collegamento {
  scopes: ScopeId[];
  collegatoIl: number;
  aggiornatoIl: number;
  projectId?: string;
  handle?: string;
}

export interface DatiProgetto { profilo?: Profilo; collegamento?: Collegamento }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const tempo = (v: unknown, ripiego: number) => (typeof v === 'number' && Number.isFinite(v) ? v : ripiego);

function leggiConsensi(v: unknown): Consensi {
  const c = isObj(v) ? v : {};
  // solo `true` esplicito vale come consenso: qualunque altra cosa (mancante, stringa, 1) è «non dato»
  return { noi: c.noi === true, atlas: c.atlas === true, comunicazioni: c.comunicazioni === true };
}

/** Rilegge un profilo salvato (anche rovinato o venuto da un file importato). Se nome o email non valgono, non c'è profilo. */
export function leggiProfilo(v: unknown): Profilo | undefined {
  if (!isObj(v)) return undefined;
  const nome = typeof v.nome === 'string' ? pulisciNome(v.nome) : null;
  const e = typeof v.email === 'string' ? controllaEmailPolimi(v.email) : null;
  if (!nome || !e || !e.ok) return undefined;
  const ora = Date.now();
  const creatoIl = tempo(v.creatoIl, ora);
  return {
    nome,
    email: e.email,
    emailVerificata: false,
    ...(eCorso(v.corso) ? { corso: v.corso } : {}),
    ...(eSede(v.sede) ? { sede: v.sede } : {}),
    ...(eProvenienza(v.provenienza) ? { provenienza: v.provenienza } : {}),
    consensi: leggiConsensi(v.consensi),
    versioneInformativa: typeof v.versioneInformativa === 'string' && v.versioneInformativa ? v.versioneInformativa : ISCRIZIONE_VERSIONE,
    creatoIl,
    aggiornatoIl: tempo(v.aggiornatoIl, creatoIl),
  };
}

function leggiCollegamento(v: unknown): Collegamento | undefined {
  if (!isObj(v) || !Array.isArray(v.scopes)) return undefined;
  const validi = new Set(SCOPES.map(s => s.id));
  const scopes = Array.from(new Set(v.scopes.filter((s): s is ScopeId => typeof s === 'string' && validi.has(s as ScopeId))));
  const ora = Date.now();
  return {
    scopes: Array.from(new Set([...REQUIRED_SCOPES, ...scopes])),
    collegatoIl: tempo(v.collegatoIl, ora),
    aggiornatoIl: tempo(v.aggiornatoIl, ora),
    ...(typeof v.projectId === 'string' ? { projectId: v.projectId } : {}),
    ...(typeof v.handle === 'string' ? { handle: v.handle } : {}),
  };
}

export function leggiProgetto(stato: Pick<AppState, 'extra'>): DatiProgetto {
  const grezzo = stato.extra?.[CHIAVE_PROGETTO];
  if (!isObj(grezzo)) return {};
  const profilo = leggiProfilo(grezzo.profilo);
  const collegamento = leggiCollegamento(grezzo.collegamento);
  return { ...(profilo ? { profilo } : {}), ...(collegamento ? { collegamento } : {}) };
}

/** Lo stato con i dati del progetto cambiati da `fn`. Non tocca nient'altro. */
export function aggiornaProgetto(stato: AppState, fn: (p: DatiProgetto) => DatiProgetto): AppState {
  const nuovo = fn(leggiProgetto(stato));
  const extra = { ...(stato.extra ?? {}) };
  if (nuovo.profilo || nuovo.collegamento) extra[CHIAVE_PROGETTO] = nuovo; else delete extra[CHIAVE_PROGETTO];
  return { ...stato, extra };
}

export interface FormProfilo {
  nome: string;
  email: string;
  corso?: string;
  sede?: string;
  provenienza?: string;
  consensi?: Partial<Consensi>;
}

/**
 * Crea (o aggiorna) il profilo dai dati del modulo. Restituisce null se nome o email non valgono.
 * I consensi mancanti sono NON dati: nessuna scorciatoia verso «sì».
 */
export function creaProfilo(form: FormProfilo, ora: number, precedente?: Profilo): Profilo | null {
  const nome = pulisciNome(form.nome);
  const e = controllaEmailPolimi(form.email);
  if (!nome || !e.ok) return null;
  return {
    nome,
    email: e.email,
    emailVerificata: false,
    ...(eCorso(form.corso) ? { corso: form.corso } : {}),
    ...(eSede(form.sede) ? { sede: form.sede } : {}),
    ...(eProvenienza(form.provenienza) ? { provenienza: form.provenienza } : {}),
    consensi: { noi: form.consensi?.noi === true, atlas: form.consensi?.atlas === true, comunicazioni: form.consensi?.comunicazioni === true },
    versioneInformativa: ISCRIZIONE_VERSIONE,
    creatoIl: precedente?.creatoIl ?? ora,
    aggiornatoIl: ora,
  };
}

/** Salva il profilo nello stato. */
export function impostaProfilo(stato: AppState, profilo: Profilo): AppState {
  return aggiornaProgetto(stato, p => ({ ...p, profilo }));
}

/** Il corpo di `POST /v1/signups` per questo profilo. */
export function corpoIscrizione(p: Profilo): CorpoIscrizione {
  return {
    appId: ECOSYSTEM.appId,
    nome: p.nome,
    email: p.email,
    ...(p.corso ? { corso: p.corso } : {}),
    ...(p.sede ? { sede: p.sede } : {}),
    ...(p.provenienza ? { provenienza: p.provenienza } : {}),
    consensi: { ...p.consensi },
    consentVersion: p.versioneInformativa,
  };
}

/** Chi ha già usato l'app ma non ha ancora un profilo vede «Completa il profilo» una volta. Chi non ha mai usato l'app passa dalla registrazione nel funnel. */
export function serveRegistrazione(stato: AppState): boolean {
  if (leggiProgetto(stato).profilo) return false;
  return !!stato.onboarding || (stato.history?.length ?? 0) > 0 || Object.keys(stato.stats ?? {}).length > 0;
}
