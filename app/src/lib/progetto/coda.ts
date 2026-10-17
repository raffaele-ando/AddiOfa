// Coda di invio dell'iscrizione ad ATLAS (`POST /v1/signups`). Principio: i dati si salvano nel dispositivo SUBITO (profilo.ts) e l'invio
// è un lavoro a parte, che non blocca mai l'uso dell'app. Se il servizio non è configurato, il dispositivo è offline o il server non risponde,
// l'iscrizione resta «in attesa di collegamento» e si riprova da sola, con attese crescenti, finché non parte.
//
// Stati: 'in-attesa' (da inviare o da ritentare), 'invio' (in corso), 'inviata', 'rifiutata' (il server dice che i dati non vanno: non si ritenta
// finché l'utente non li corregge). Lo stato sta in una chiave a parte del localStorage (non nei progressi): serve a sapere cosa è già partito.
// La chiave contiene il corpo dell'iscrizione solo finché non è stato inviato; poi resta solo lo stato e una firma per riconoscere un cambio.
import { AtlasErrore, AtlasNonConfigurato, atlas, type CorpoIscrizione } from '../atlas';
import { ATLAS_API_URL } from '../../config/ecosystem';

export const CHIAVE_CODA = 'addiofa_progetto_coda';

export type StatoInvio = 'in-attesa' | 'invio' | 'inviata' | 'rifiutata';
/** Perché l'iscrizione non è ancora partita (solo per dirlo con una riga vera). */
export type MotivoAttesa = 'non-configurato' | 'offline' | 'rete' | 'server' | 'limite';

export interface RecordInvio {
  versione: 1;
  stato: StatoInvio;
  /** Da inviare; si toglie appena il server ha risposto bene. */
  corpo?: CorpoIscrizione;
  /** Firma del corpo (per riconoscere se il profilo è cambiato dopo l'invio). */
  firma: string;
  tentativi: number;
  creataIl: number;
  ultimoTentativo?: number;
  prossimoTentativo?: number;
  motivo?: MotivoAttesa;
  /** Messaggio del server quando rifiuta i dati. */
  messaggio?: string;
  inviataIl?: number;
}

/** Attese tra un tentativo e il successivo, in secondi: 30 s, 1 min, 2 min, 5 min, 15 min, 1 h, poi ogni 6 h. */
export const ATTESE_S = [30, 60, 120, 300, 900, 3600, 21600];

export function attesaDopo(tentativi: number): number {
  return ATTESE_S[Math.min(Math.max(tentativi, 1), ATTESE_S.length) - 1] * 1000;
}

/** Firma corta e stabile dei dati (non crittografica: serve solo a notare un cambiamento). */
export function firmaCorpo(c: CorpoIscrizione): string {
  const s = JSON.stringify([c.nome, c.email, c.scuola ?? '', c.sede ?? '', c.livello ?? '', c.corso ?? '', c.anno ?? '', c.provenienza ?? '', c.consensi.noi, c.consensi.atlas, c.consensi.comunicazioni, c.consentVersion]);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function nuovoRecord(corpo: CorpoIscrizione, ora: number): RecordInvio {
  return { versione: 1, stato: 'in-attesa', corpo, firma: firmaCorpo(corpo), tentativi: 0, creataIl: ora, prossimoTentativo: ora };
}

export type Esito =
  | { tipo: 'ok' }
  | { tipo: 'attesa'; motivo: MotivoAttesa; contaTentativo: boolean }
  | { tipo: 'rifiutata'; messaggio: string };

/** Che cosa è successo, a partire dall'errore della chiamata. 4xx = dati sbagliati (non si ritenta); rete, 429, 5xx e un indirizzo sbagliato (404/405) = si ritenta. */
export function classificaErrore(err: unknown): Esito {
  if (err instanceof AtlasNonConfigurato) return { tipo: 'attesa', motivo: 'non-configurato', contaTentativo: false };
  if (err instanceof AtlasErrore) {
    const s = err.stato;
    if (s === 0) return { tipo: 'attesa', motivo: 'rete', contaTentativo: true };
    if (s === 429) return { tipo: 'attesa', motivo: 'limite', contaTentativo: true };
    if (s >= 500 || s === 404 || s === 405 || s === 408) return { tipo: 'attesa', motivo: 'server', contaTentativo: true };
    if (s >= 400) return { tipo: 'rifiutata', messaggio: err.message };
  }
  return { tipo: 'attesa', motivo: 'rete', contaTentativo: true };
}

/** Applica l'esito di un tentativo al record. Pura: nessuna rete, nessun orologio. */
export function applicaEsito(rec: RecordInvio, esito: Esito, ora: number): RecordInvio {
  if (esito.tipo === 'ok') {
    const { corpo: _c, motivo: _m, messaggio: _s, prossimoTentativo: _p, ...resto } = rec;
    return { ...resto, stato: 'inviata', tentativi: rec.tentativi + 1, ultimoTentativo: ora, inviataIl: ora };
  }
  if (esito.tipo === 'rifiutata') {
    const { prossimoTentativo: _p, motivo: _m, ...resto } = rec;
    return { ...resto, stato: 'rifiutata', tentativi: rec.tentativi + 1, ultimoTentativo: ora, messaggio: esito.messaggio };
  }
  const tentativi = rec.tentativi + (esito.contaTentativo ? 1 : 0);
  const { messaggio: _s, ...resto } = rec;
  return {
    ...resto, stato: 'in-attesa', tentativi, motivo: esito.motivo,
    ...(esito.contaTentativo ? { ultimoTentativo: ora } : {}),
    // non configurato / offline: nessun orologio da attendere, si riprova quando qualcosa cambia (rete di nuovo su, nuova apertura)
    prossimoTentativo: esito.contaTentativo ? ora + attesaDopo(tentativi) : undefined,
  };
}

/** Quanto manca al prossimo tentativo (ms), o null se non c'è un orologio da attendere. */
export function attesaResidua(rec: RecordInvio, ora: number): number | null {
  if (rec.stato !== 'in-attesa' || rec.prossimoTentativo === undefined) return null;
  return Math.max(0, rec.prossimoTentativo - ora);
}

export type ChiaveStato = 'inviata' | 'in-attesa' | 'invio' | 'rifiutata' | 'solo-locale';

export interface StatoVisibile { chiave: ChiaveStato; titolo: string; dettaglio: string }

const DETTAGLIO_MOTIVO: Record<MotivoAttesa, string> = {
  'non-configurato': 'ATLAS non è collegato in questa versione: i dati restano su questo dispositivo.',
  offline: 'Sei offline: riprovo appena torna la connessione.',
  rete: 'ATLAS non risponde: riprovo da solo.',
  server: 'ATLAS ha dato un errore: riprovo da solo.',
  limite: 'Troppe richieste in poco tempo: riprovo tra poco.',
};

/** Lo stato come lo legge l'utente, in una riga vera. `rec` assente = profilo salvato ma mai messo in coda. */
export function descriviInvio(rec: RecordInvio | null, ora: number): StatoVisibile {
  if (!rec) return { chiave: 'solo-locale', titolo: 'Solo su questo dispositivo', dettaglio: 'L\'iscrizione non è stata inviata.' };
  const data = (t?: number) => (t ? new Date(t).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
  switch (rec.stato) {
    case 'inviata':
      return { chiave: 'inviata', titolo: 'Inviata', dettaglio: `Inviata ad ATLAS il ${data(rec.inviataIl)}.` };
    case 'invio':
      return { chiave: 'invio', titolo: 'Invio in corso', dettaglio: 'Sto inviando l\'iscrizione ad ATLAS.' };
    case 'rifiutata':
      return { chiave: 'rifiutata', titolo: 'Non accettata', dettaglio: `ATLAS non ha accettato i dati${rec.messaggio ? `: ${rec.messaggio}` : ''}. Correggili e salva di nuovo.` };
    default: {
      const attesa = attesaResidua(rec, ora);
      const quando = attesa !== null && attesa > 0 ? ` Prossimo tentativo tra ${attesa < 90_000 ? `${Math.ceil(attesa / 1000)} secondi` : `${Math.ceil(attesa / 60_000)} minuti`}.` : '';
      return { chiave: 'in-attesa', titolo: 'In attesa di collegamento', dettaglio: `${rec.motivo ? DETTAGLIO_MOTIVO[rec.motivo] : 'Da inviare.'}${rec.motivo === 'non-configurato' ? '' : quando}` };
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------
// Il lavoro vero: archivio, tentativo, orologio. Tutto dietro una fabbrica con le dipendenze iniettabili, per provarlo senza rete.

export interface ArchivioChiave { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }

export interface DipendenzeCoda {
  archivio?: ArchivioChiave;
  fetchImpl?: typeof fetch;
  baseUrl?: string | undefined;
  ora?: () => number;
  /** Il dispositivo è online? (default: navigator.onLine). */
  online?: () => boolean;
}

function archivioPredefinito(): ArchivioChiave {
  const memoria = new Map<string, string>();
  const ripiego: ArchivioChiave = { getItem: k => memoria.get(k) ?? null, setItem: (k, v) => { memoria.set(k, v); }, removeItem: k => { memoria.delete(k); } };
  try {
    if (typeof localStorage === 'undefined') return ripiego;
    localStorage.getItem(CHIAVE_CODA); // può lanciare (finestra privata, dati bloccati)
    return {
      getItem: k => { try { return localStorage.getItem(k); } catch { return memoria.get(k) ?? null; } },
      setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { memoria.set(k, v); } },
      removeItem: k => { try { localStorage.removeItem(k); } catch { /* niente */ } memoria.delete(k); },
    };
  } catch {
    return ripiego;
  }
}

function leggiGrezzo(raw: string | null): RecordInvio | null {
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as Partial<RecordInvio>;
    if (!r || r.versione !== 1 || typeof r.firma !== 'string' || !['in-attesa', 'invio', 'inviata', 'rifiutata'].includes(r.stato as string)) return null;
    // un «invio in corso» trovato all'apertura è rimasto a metà (pagina chiusa): si riprova
    return (r.stato === 'invio' ? { ...r, stato: 'in-attesa' } : r) as RecordInvio;
  } catch {
    return null;
  }
}

export function creaCoda(dip: DipendenzeCoda = {}) {
  const archivio = dip.archivio ?? archivioPredefinito();
  const ora = dip.ora ?? (() => Date.now());
  const online = dip.online ?? (() => typeof navigator === 'undefined' || navigator.onLine !== false);
  const baseUrl = 'baseUrl' in dip ? dip.baseUrl : ATLAS_API_URL;
  const ascoltatori = new Set<() => void>();
  let cache: { raw: string | null | undefined; rec: RecordInvio | null } = { raw: undefined, rec: null };
  let inCorso = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const leggi = (): RecordInvio | null => {
    const raw = archivio.getItem(CHIAVE_CODA);
    if (cache.raw !== raw) cache = { raw, rec: leggiGrezzo(raw) };
    return cache.rec;
  };
  const scrivi = (rec: RecordInvio | null) => {
    if (rec) archivio.setItem(CHIAVE_CODA, JSON.stringify(rec)); else archivio.removeItem(CHIAVE_CODA);
    ascoltatori.forEach(f => f());
  };

  function programma() {
    if (timer) { clearTimeout(timer); timer = null; }
    const rec = leggi();
    if (!rec) return;
    const resta = attesaResidua(rec, ora());
    if (resta === null) return;
    timer = setTimeout(() => { timer = null; void prova(); }, Math.max(resta, 1000));
    (timer as { unref?: () => void }).unref?.(); // in prova (Node) il timer non tiene vivo il processo
  }

  /** Un tentativo di invio, se c'è qualcosa da inviare. Non lancia mai: restituisce il record com'è dopo il tentativo. */
  async function prova(opzioni: { forza?: boolean } = {}): Promise<RecordInvio | null> {
    const rec = leggi();
    if (!rec || inCorso || rec.stato === 'inviata' || !rec.corpo) return rec;
    if (rec.stato === 'rifiutata' && !opzioni.forza) return rec;
    const adesso = ora();
    if (!opzioni.forza && rec.prossimoTentativo !== undefined && rec.prossimoTentativo > adesso) { programma(); return rec; }
    if (!baseUrl) { scrivi(applicaEsito(rec, { tipo: 'attesa', motivo: 'non-configurato', contaTentativo: false }, adesso)); return leggi(); }
    if (!online()) { scrivi(applicaEsito(rec, { tipo: 'attesa', motivo: 'offline', contaTentativo: false }, adesso)); return leggi(); }
    inCorso = true;
    scrivi({ ...rec, stato: 'invio' });
    let esito: Esito;
    try {
      await atlas.iscrivi(rec.corpo, { baseUrl, fetchImpl: dip.fetchImpl });
      esito = { tipo: 'ok' };
    } catch (err) {
      esito = classificaErrore(err);
    } finally {
      inCorso = false;
    }
    // se nel frattempo l'utente ha cambiato i dati (nuovo record), questo esito non vale più
    const dopo = leggi();
    if (dopo && (dopo.creataIl !== rec.creataIl || dopo.firma !== rec.firma)) return prova({ forza: true }); // dati cambiati durante l'invio: parte la versione nuova
    if (dopo) scrivi(applicaEsito(rec, esito, ora()));
    programma();
    return leggi();
  }

  /** Mette in coda l'iscrizione e prova a inviarla subito. Se gli stessi dati sono già partiti (o sono già in coda) non fa nulla. */
  async function accoda(corpo: CorpoIscrizione, opzioni: { forza?: boolean } = {}): Promise<RecordInvio | null> {
    const corrente = leggi();
    const firma = firmaCorpo(corpo);
    if (!opzioni.forza && corrente && corrente.firma === firma && corrente.stato !== 'rifiutata') {
      if (corrente.stato === 'in-attesa') return prova();
      return corrente;
    }
    scrivi(nuovoRecord(corpo, ora()));
    return prova({ forza: true });
  }

  /** Riprova adesso, anche se l'attesa non è finita (pulsante «Riprova»). */
  const riprova = () => prova({ forza: true });

  /** Toglie la coda (cancellazione dei dati dal dispositivo). */
  function svuota() {
    if (timer) { clearTimeout(timer); timer = null; }
    scrivi(null);
  }

  let avviata = false;
  /** Fa partire i tentativi automatici: subito, quando torna la rete, quando la pagina torna visibile, e allo scadere dell'attesa. Si può chiamare più volte. */
  function avvia() {
    if (!avviata && typeof window !== 'undefined') {
      avviata = true;
      window.addEventListener('online', () => { void prova(); });
      window.addEventListener('storage', e => { if (e.key === CHIAVE_CODA) ascoltatori.forEach(f => f()); }); // un'altra scheda ha cambiato lo stato
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void prova(); });
    }
    void prova();
    programma();
  }

  return {
    leggi, accoda, prova, riprova, svuota, avvia,
    iscriviti(f: () => void) { ascoltatori.add(f); return () => { ascoltatori.delete(f); }; },
    /** Istantanea per useSyncExternalStore: lo stesso oggetto finché la chiave non cambia. */
    istantanea: leggi,
  };
}

/** La coda dell'app, sui dati veri del dispositivo. */
export const coda = creaCoda();
