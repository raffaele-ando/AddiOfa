// Segnalazioni: restano sul dispositivo (useExtraDati('segnalazioni')). Non c'è un canale che le invii: il testo si copia.
// Mai dati personali nel testo: né i progressi né l'identità, solo quello che l'utente scrive e l'id della domanda.

export type TipoSegnalazione = 'domanda' | 'spiegazione' | 'app' | 'idea';

export const TIPI_SEGNALAZIONE: readonly { id: TipoSegnalazione; nome: string; aiuto: string }[] = [
  { id: 'domanda', nome: 'Domanda sbagliata', aiuto: 'Testo, opzioni o risposta esatta che non tornano.' },
  { id: 'spiegazione', nome: 'Spiegazione poco chiara', aiuto: 'La spiegazione è sbagliata, incompleta o confusa.' },
  { id: 'app', nome: 'Problema dell\'app', aiuto: 'Qualcosa non funziona, si blocca o si vede male.' },
  { id: 'idea', nome: 'Suggerimento', aiuto: 'Un\'idea per migliorare l\'app.' },
];

export const LUNGHEZZA_MIN = 5;
export const LUNGHEZZA_MAX = 1000;
export const MASSIMO_SALVATE = 50;
export const MAX_ERRORE = 300;

export interface Segnalazione {
  id: string;
  /** Millisecondi dall'epoca. */
  quando: number;
  tipo: TipoSegnalazione;
  testo: string;
  domandaId?: string;
  /** Testo della domanda (primi caratteri), per ritrovarla senza l'app. */
  domandaTesto?: string;
  /** Dettaglio tecnico di un errore dell'app, già accorciato. */
  errore?: string;
}

export function eTipo(v: unknown): v is TipoSegnalazione {
  return TIPI_SEGNALAZIONE.some(t => t.id === v);
}

/** Il testo ripulito (spazi) e tagliato; vuoto se troppo corto per dire qualcosa. */
export function pulisciTesto(testo: string): string {
  return testo.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, LUNGHEZZA_MAX);
}

export function testoValido(testo: string): boolean {
  return pulisciTesto(testo).length >= LUNGHEZZA_MIN;
}

export function accorcia(testo: string | undefined, max: number): string | undefined {
  if (!testo) return undefined;
  const t = testo.replace(/\s+/g, ' ').trim();
  if (!t) return undefined;
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

export function creaSegnalazione(i: { tipo: TipoSegnalazione; testo: string; domandaId?: string; domandaTesto?: string; errore?: string }, quando: number, id: string): Segnalazione {
  const s: Segnalazione = { id, quando, tipo: i.tipo, testo: pulisciTesto(i.testo) };
  if (i.domandaId) s.domandaId = i.domandaId.slice(0, 40);
  const dt = accorcia(i.domandaTesto, 160); if (dt) s.domandaTesto = dt;
  const er = accorcia(i.errore, MAX_ERRORE); if (er) s.errore = er;
  return s;
}

/** Aggiunge in testa e tiene al massimo MASSIMO_SALVATE segnalazioni. */
export function aggiungi(lista: readonly Segnalazione[], nuova: Segnalazione): Segnalazione[] {
  return [nuova, ...lista.filter(s => s.id !== nuova.id)].slice(0, MASSIMO_SALVATE);
}

export function rimuovi(lista: readonly Segnalazione[], id: string): Segnalazione[] {
  return lista.filter(s => s.id !== id);
}

/** Il testo da copiare e inviare: niente progressi, niente identità. */
export function testoDaCopiare(s: Segnalazione, nomeApp = 'AddiOFA'): string {
  const tipo = TIPI_SEGNALAZIONE.find(t => t.id === s.tipo)?.nome ?? s.tipo;
  const data = new Date(s.quando).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const righe = [`Segnalazione ${nomeApp} · ${tipo} · ${data}`];
  if (s.domandaId) righe.push(`Domanda: ${s.domandaId}${s.domandaTesto ? ` · «${s.domandaTesto}»` : ''}`);
  righe.push('', s.testo);
  if (s.errore) righe.push('', `Dettaglio tecnico: ${s.errore}`);
  return righe.join('\n');
}

/** Lettura prudente di ciò che è salvato in appState.extra (può essere vecchio o rovinato). */
export function leggiSalvate(grezzo: unknown): Segnalazione[] {
  if (!Array.isArray(grezzo)) return [];
  const fuori: Segnalazione[] = [];
  for (const v of grezzo) {
    if (!v || typeof v !== 'object') continue;
    const r = v as Record<string, unknown>;
    if (typeof r.id !== 'string' || typeof r.testo !== 'string' || !eTipo(r.tipo) || typeof r.quando !== 'number' || !Number.isFinite(r.quando)) continue;
    fuori.push({
      id: r.id, quando: r.quando, tipo: r.tipo, testo: r.testo.slice(0, LUNGHEZZA_MAX),
      domandaId: typeof r.domandaId === 'string' ? r.domandaId : undefined,
      domandaTesto: typeof r.domandaTesto === 'string' ? r.domandaTesto : undefined,
      errore: typeof r.errore === 'string' ? r.errore.slice(0, MAX_ERRORE) : undefined,
    });
  }
  return fuori.slice(0, MASSIMO_SALVATE);
}
