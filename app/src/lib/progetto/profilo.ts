// Il profilo di chi si registra e il collegamento al Project ID, salvati nel dispositivo dentro appState.extra.progetto
// (insieme ai progressi: entrano nell'esportazione e nell'importazione, e un vecchio salvataggio senza questo campo si legge lo stesso).
// Nome ed email sono obbligatori; corso, sede e provenienza sono facoltativi; i tre consensi partono SEMPRE tutti spenti.
import type { AppState } from '../../types';
import { ECOSYSTEM, ISCRIZIONE_VERSIONE, REQUIRED_SCOPES, SCOPES, type ScopeId } from '../../config/ecosystem';
import type { CorpoIscrizione } from '../atlas';
import { provenienzaDa, type Provenienza } from './corsi';
import { LIVELLI_ID, SCUOLE_ID, type LivelloId, type ScuolaId } from './percorso';
import { nomeDaEmail } from './nomeDaEmail';
import { controllaEmailPolimi, pulisciNome } from './validazione';

export const CHIAVE_PROGETTO = 'progetto';

export interface Consensi { noi: boolean; atlas: boolean; comunicazioni: boolean }

/** Nessun consenso preselezionato: è lo stato di partenza di ogni schermata che li chiede. */
export const CONSENSI_VUOTI: Readonly<Consensi> = Object.freeze({ noi: false, atlas: false, comunicazioni: false });

export interface Profilo {
  email: string;
  /** Ricavato dall'email (o scritto a mano quando non si ricava); modificabile con la matita. */
  nome: string;
  /** True solo dopo una verifica vera con il link (lib/progetto/verificaEmail.ts) per questa email; altrimenti false: l'indirizzo è controllato solo nel formato e nel dominio. */
  emailVerificata: boolean;
  /** Percorso di studi: ids di scuola e sede, livello, nome e id del corso, anno. */
  scuola?: ScuolaId;
  sede?: string;
  livello?: LivelloId;
  corso?: string;
  corsoId?: string;
  anno?: number;
  provenienza?: Provenienza;
  consensi: Consensi;
  /** Versione del testo dei consensi che l'utente ha visto quando li ha scelti. */
  versioneInformativa: string;
  /** False finché la registrazione non è arrivata ai consensi (salvataggi parziali dei passi); i profili senza il campo contano come completi. */
  completato: boolean;
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

const ID_BREVE = /^[a-z0-9-]{2,30}$/;
const testoBreve = (v: unknown, max: number): string | undefined => (typeof v === 'string' && v.trim() && v.trim().length <= max ? v.trim() : undefined);

/** I campi del percorso di studi, ripuliti: ids ammessi, anno intero da 1 a 6. */
function leggiPercorso(v: Record<string, unknown>) {
  const scuola = SCUOLE_ID.find(x => x === v.scuola);
  const livello = LIVELLI_ID.find(x => x === v.livello);
  // la sede della prima versione era il testo «Leonardo»: si rilegge come id minuscolo
  const sedeGrezza = typeof v.sede === 'string' ? v.sede.trim().toLowerCase() : '';
  const sede = ID_BREVE.test(sedeGrezza) ? sedeGrezza : undefined;
  const corso = testoBreve(v.corso, 120);
  const corsoId = typeof v.corsoId === 'string' && /^[A-Za-z0-9._-]{1,100}$/.test(v.corsoId) ? v.corsoId : undefined;
  const anno = typeof v.anno === 'number' && Number.isInteger(v.anno) && v.anno >= 1 && v.anno <= 6 ? v.anno : undefined;
  return { ...(scuola ? { scuola } : {}), ...(sede ? { sede } : {}), ...(livello ? { livello } : {}), ...(corso ? { corso } : {}), ...(corsoId ? { corsoId } : {}), ...(anno ? { anno } : {}) };
}

/** Rilegge un profilo salvato (anche rovinato, di una versione vecchia o venuto da un file importato). Se l'email non vale, non c'è profilo; il nome, se manca, si ricava dall'email. */
export function leggiProfilo(v: unknown): Profilo | undefined {
  if (!isObj(v)) return undefined;
  const e = typeof v.email === 'string' ? controllaEmailPolimi(v.email) : null;
  if (!e || !e.ok) return undefined;
  const nome = (typeof v.nome === 'string' ? pulisciNome(v.nome) : null) ?? nomeDaEmail(e.email)?.nome ?? null;
  if (!nome) return undefined;
  const ora = Date.now();
  const creatoIl = tempo(v.creatoIl, ora);
  const provenienza = provenienzaDa(v.provenienza);
  return {
    nome,
    email: e.email,
    emailVerificata: v.emailVerificata === true,
    ...leggiPercorso(v),
    ...(provenienza ? { provenienza } : {}),
    consensi: leggiConsensi(v.consensi),
    versioneInformativa: typeof v.versioneInformativa === 'string' && v.versioneInformativa ? v.versioneInformativa : ISCRIZIONE_VERSIONE,
    completato: v.completato !== false,
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
  /** Se manca o è vuoto si ricava dall'email. */
  nome?: string;
  email: string;
  scuola?: string;
  sede?: string;
  livello?: string;
  corso?: string;
  corsoId?: string;
  anno?: number;
  provenienza?: string;
  consensi?: Partial<Consensi>;
  /** Default true. I salvataggi dei passi intermedi della registrazione passano false. */
  completato?: boolean;
}

/**
 * Crea (o aggiorna) il profilo dai dati del modulo. Restituisce null se l'email non vale o il nome non c'è e non si ricava.
 * I consensi mancanti sono NON dati: nessuna scorciatoia verso «sì». «Verificata» si conserva solo se l'email è la stessa di prima.
 */
export function creaProfilo(form: FormProfilo, ora: number, precedente?: Profilo): Profilo | null {
  const e = controllaEmailPolimi(form.email);
  if (!e.ok) return null;
  const nome = pulisciNome(form.nome ?? '') ?? nomeDaEmail(e.email)?.nome ?? null;
  if (!nome) return null;
  const provenienza = provenienzaDa(form.provenienza);
  return {
    nome,
    email: e.email,
    emailVerificata: !!precedente?.emailVerificata && precedente.email === e.email,
    ...leggiPercorso({ ...form }),
    ...(provenienza ? { provenienza } : {}),
    consensi: { noi: form.consensi?.noi === true, atlas: form.consensi?.atlas === true, comunicazioni: form.consensi?.comunicazioni === true },
    versioneInformativa: ISCRIZIONE_VERSIONE,
    completato: form.completato !== false,
    creatoIl: precedente?.creatoIl ?? ora,
    aggiornatoIl: ora,
  };
}

/** Salva il profilo nello stato. */
export function impostaProfilo(stato: AppState, profilo: Profilo): AppState {
  return aggiornaProgetto(stato, p => ({ ...p, profilo }));
}

/** Il corpo di `POST /v1/signups` per questo profilo: nome ricavato, percorso di studi (ids), provenienza (id), consensi. Solo i campi compilati. */
export function corpoIscrizione(p: Profilo): CorpoIscrizione {
  return {
    appId: ECOSYSTEM.appId,
    nome: p.nome,
    email: p.email,
    ...(p.scuola ? { scuola: p.scuola } : {}),
    ...(p.sede ? { sede: p.sede } : {}),
    ...(p.livello ? { livello: p.livello } : {}),
    ...(p.corso ? { corso: p.corso } : {}),
    ...(p.anno ? { anno: p.anno } : {}),
    ...(p.provenienza ? { provenienza: p.provenienza } : {}),
    consensi: { ...p.consensi },
    consentVersion: p.versioneInformativa,
  };
}

/** Segna l'email «verificata» solo se è quella del profilo (dopo un `signInWithEmailLink` riuscito: vedi lib/firebase.ts). */
export function segnaEmailVerificata(stato: AppState, email: string): AppState {
  const { profilo } = leggiProgetto(stato);
  if (!profilo || profilo.email !== email.trim().toLowerCase() || profilo.emailVerificata) return stato;
  return impostaProfilo(stato, { ...profilo, emailVerificata: true, aggiornatoIl: Date.now() });
}

/** Chi ha già usato l'app ma non ha finito la registrazione (email e percorso di studi) la vede una volta come «Completa il profilo». Chi non ha mai usato l'app passa dalla registrazione nel funnel. */
export function serveRegistrazione(stato: AppState): boolean {
  if (leggiProgetto(stato).profilo?.completato) return false;
  return !!stato.onboarding || (stato.history?.length ?? 0) > 0 || Object.keys(stato.stats ?? {}).length > 0;
}
