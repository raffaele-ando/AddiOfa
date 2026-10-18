// Ciò che AddiOFA ricorda di te nel dispositivo, dentro appState.extra.progetto (entra nell'esportazione dei progressi): il percorso di studi e
// «come ci hai conosciuto» (facoltativi, saltabili, MAI inviati a nessuno: nessuna funzione li usa fuori dal dispositivo), il badge «studente PoliMi»
// (solo dopo una verifica vera con il link) e il collegamento al Project ID. Niente email né nome nel funnel: all'avvio non si chiede nessun dato.
// Un salvataggio delle versioni precedenti (con email, nome e consensi) si rilegge tenendo solo ciò che serve; alla prima scrittura il resto sparisce.
import type { AppState } from '../../types';
import { ECOSYSTEM, REQUIRED_SCOPES, SCOPES, type ScopeId } from '../../config/ecosystem';
import { provenienzaDa, type Provenienza } from './corsi';
import { LIVELLI_ID, SCUOLE_ID, type LivelloId, type ScuolaId } from './percorso';
import { controllaEmailPolimi } from './validazione';

export const CHIAVE_PROGETTO = 'progetto';

/** Il badge «studente PoliMi»: esiste solo se l'indirizzo è stato verificato con il link. Non c'è uno stato «non verificata» salvato: o c'è la prova o non c'è niente. */
export interface StudentePoliMi { email: string; verificataIl: number }

export interface Profilo {
  /** Percorso di studi: ids di scuola e sede, livello, nome e id del corso, anno. Solo sul dispositivo. */
  scuola?: ScuolaId;
  sede?: string;
  livello?: LivelloId;
  corso?: string;
  corsoId?: string;
  anno?: number;
  provenienza?: Provenienza;
  studentePoliMi?: StudentePoliMi;
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

const ID_BREVE = /^[a-z0-9-]{2,30}$/;
const testoBreve = (v: unknown, max: number): string | undefined => (typeof v === 'string' && v.trim() && v.trim().length <= max ? v.trim() : undefined);

/** I campi del percorso di studi, ripuliti: ids ammessi, anno intero da 1 a 6. */
export function leggiPercorso(v: Record<string, unknown>) {
  const scuola = SCUOLE_ID.find(x => x === v.scuola);
  const livello = LIVELLI_ID.find(x => x === v.livello);
  // la sede delle prime versioni era il testo «Leonardo»: si rilegge come id minuscolo
  const sedeGrezza = typeof v.sede === 'string' ? v.sede.trim().toLowerCase() : '';
  const sede = ID_BREVE.test(sedeGrezza) ? sedeGrezza : undefined;
  const corso = testoBreve(v.corso, 120);
  const corsoId = typeof v.corsoId === 'string' && /^[A-Za-z0-9._-]{1,100}$/.test(v.corsoId) ? v.corsoId : undefined;
  const anno = typeof v.anno === 'number' && Number.isInteger(v.anno) && v.anno >= 1 && v.anno <= 6 ? v.anno : undefined;
  return { ...(scuola ? { scuola } : {}), ...(sede ? { sede } : {}), ...(livello ? { livello } : {}), ...(corso ? { corso } : {}), ...(corsoId ? { corsoId } : {}), ...(anno ? { anno } : {}) };
}

function leggiStudente(v: unknown): StudentePoliMi | undefined {
  if (!isObj(v) || typeof v.email !== 'string') return undefined;
  const e = controllaEmailPolimi(v.email);
  if (!e.ok || typeof v.verificataIl !== 'number' || !Number.isFinite(v.verificataIl)) return undefined;
  return { email: e.email, verificataIl: v.verificataIl };
}

/**
 * Rilegge il profilo salvato (anche rovinato, di una versione vecchia o venuto da un file importato). Tiene solo percorso, provenienza e badge:
 * email, nome e consensi delle versioni precedenti si scartano. Un'email PoliMi segnata «verificata» da una versione precedente diventa il badge.
 * Se non resta niente, non c'è profilo.
 */
export function leggiProfilo(v: unknown): Profilo | undefined {
  if (!isObj(v)) return undefined;
  const provenienza = provenienzaDa(v.provenienza);
  const percorso = leggiPercorso(v);
  const studentePoliMi = leggiStudente(v.studentePoliMi)
    ?? (v.emailVerificata === true ? leggiStudente({ email: v.email, verificataIl: tempo(v.aggiornatoIl, Date.now()) }) : undefined);
  if (!Object.keys(percorso).length && !provenienza && !studentePoliMi) return undefined;
  return { ...percorso, ...(provenienza ? { provenienza } : {}), ...(studentePoliMi ? { studentePoliMi } : {}), aggiornatoIl: tempo(v.aggiornatoIl, Date.now()) };
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

/** Lo stato con i dati del progetto cambiati da `fn`. Non tocca nient'altro. Un profilo vuoto sparisce. */
export function aggiornaProgetto(stato: AppState, fn: (p: DatiProgetto) => DatiProgetto): AppState {
  const nuovo = fn(leggiProgetto(stato));
  const extra = { ...(stato.extra ?? {}) };
  if (nuovo.profilo || nuovo.collegamento) extra[CHIAVE_PROGETTO] = nuovo; else delete extra[CHIAVE_PROGETTO];
  return { ...stato, extra };
}

/** Salva il profilo nello stato (ripulito come alla lettura). */
export function impostaProfilo(stato: AppState, profilo: Profilo): AppState {
  return aggiornaProgetto(stato, p => ({ ...p, profilo: leggiProfilo(profilo) }));
}

export interface CampiPercorso { scuola?: string; sede?: string; livello?: string; corso?: string; corsoId?: string; anno?: number }

/** Imposta (o toglie, con un oggetto vuoto) il percorso di studi, tenendo il resto del profilo. */
export function impostaPercorso(stato: AppState, campi: CampiPercorso, ora = Date.now()): AppState {
  return aggiornaProgetto(stato, p => {
    const { scuola: _a, sede: _b, livello: _c, corso: _d, corsoId: _e, anno: _f, ...resto } = p.profilo ?? { aggiornatoIl: ora };
    return { ...p, profilo: leggiProfilo({ ...resto, ...leggiPercorso({ ...campi }), aggiornatoIl: ora }) };
  });
}

/** Imposta (o toglie, con undefined) «come ci hai conosciuto». */
export function impostaProvenienza(stato: AppState, id: string | undefined, ora = Date.now()): AppState {
  return aggiornaProgetto(stato, p => {
    const { provenienza: _p, ...resto } = p.profilo ?? { aggiornatoIl: ora };
    return { ...p, profilo: leggiProfilo({ ...resto, ...(provenienzaDa(id) ? { provenienza: provenienzaDa(id) } : {}), aggiornatoIl: ora }) };
  });
}

/** Il badge «studente PoliMi»: solo dopo una verifica riuscita (lib/firebase.ts `ritornoDaLink`) per quell'indirizzo. */
export function segnaStudentePoliMi(stato: AppState, email: string, ora = Date.now()): AppState {
  const e = controllaEmailPolimi(email);
  if (!e.ok) return stato;
  return aggiornaProgetto(stato, p => ({ ...p, profilo: leggiProfilo({ ...(p.profilo ?? {}), studentePoliMi: { email: e.email, verificataIl: ora }, aggiornatoIl: ora }) }));
}

export function togliStudentePoliMi(stato: AppState): AppState {
  return aggiornaProgetto(stato, p => {
    const { studentePoliMi: _s, ...resto } = p.profilo ?? { aggiornatoIl: Date.now() };
    return { ...p, profilo: leggiProfilo(resto) };
  });
}
