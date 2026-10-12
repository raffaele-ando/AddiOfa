// Lo storico delle sfide e i conti che ne derivano (esito, rivali, classifica). Tutto locale, tutto calcolato dalle partite
// vere: nessun punteggio, nessun livello, nessuna posizione che non venga da un duello giocato davvero.
import type { DatiSfida } from './codice';

export type TipoSfida = 'giorno' | 'duello';
export type RuoloSfida = 'solo' | 'sfidante' | 'sfidato';
export type Esito = 'vinto' | 'pari' | 'perso';

export interface Risultato { corrette: number; totale: number; secondi: number }
export interface Avversario extends Risultato { id: string; nome: string }

/** Una partita giocata su questo dispositivo. */
export interface VoceSfida extends Risultato {
  /** `${tipo}:${seme}:${ruolo}`: una sola partita per sfida. */
  id: string;
  tipo: TipoSfida;
  ruolo: RuoloSfida;
  seme: string;
  quando: number;
  /** Il nome con cui ti sei presentato nel duello. */
  nome?: string;
  /** Le domande (in ordine) e la risposta data a ciascuna (indice originale dell'opzione, -1 = nessuna). */
  ids: string[];
  risposte: number[];
  /** Chi hai affrontato, quando si sa. In un duello lanciato da te resta vuoto finché l'amico non rimanda il risultato. */
  avversario?: Avversario;
}

export const idVoce = (tipo: TipoSfida, seme: string, ruolo: RuoloSfida) => `${tipo}:${seme}:${ruolo}`;

/** Chi vince: più risposte corrette; a parità, meno tempo; a parità di tutto, pari. */
export function confronta(io: Risultato, altro: Risultato): Esito {
  if (io.corrette !== altro.corrette) return io.corrette > altro.corrette ? 'vinto' : 'perso';
  if (io.secondi !== altro.secondi) return io.secondi < altro.secondi ? 'vinto' : 'perso';
  return 'pari';
}

/** Un'etichetta di tempo «3:07». */
export function tempoBreve(secondi: number): string {
  const s = Math.max(0, Math.round(secondi));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export const MAX_VOCI = 200;

/** Aggiunge (o sostituisce, se la sfida c'è già) una partita; la più recente per prima; tiene le ultime MAX_VOCI. */
export function aggiungiVoce(voci: readonly VoceSfida[], nuova: VoceSfida): VoceSfida[] {
  return [nuova, ...voci.filter(v => v.id !== nuova.id)].sort((a, b) => b.quando - a.quando).slice(0, MAX_VOCI);
}

/** Un amico ha rimandato il suo risultato (codice di tipo «r»): lo si aggancia al duello lanciato da te con lo stesso seme.
 *  `trovata` è falso se qui non c'è quel duello (altro dispositivo, storico cancellato). Idempotente. */
export function agganciaRisposta(voci: readonly VoceSfida[], d: Pick<DatiSfida, 'seme' | 'id' | 'nome' | 'corrette' | 'totale' | 'secondi'>): { voci: VoceSfida[]; trovata: boolean } {
  const id = idVoce('duello', d.seme, 'sfidante');
  const mia = voci.find(v => v.id === id);
  if (!mia) return { voci: [...voci], trovata: false };
  const avv: Avversario = { id: d.id, nome: d.nome, corrette: d.corrette, totale: d.totale, secondi: d.secondi };
  return { voci: voci.map(v => (v.id === id ? { ...v, avversario: avv } : v)), trovata: true };
}

export interface Rivale {
  id: string;
  /** L'ultimo nome con cui si è presentato. */
  nome: string;
  duelli: number;
  vinti: number;
  pari: number;
  persi: number;
  ultimoQuando: number;
  /** I duelli con lui, il più recente per primo. */
  voci: VoceSfida[];
}

/** I «rivali»: chi hai affrontato in almeno un duello concluso, con il saldo visto da te. */
export function ricavaRivali(voci: readonly VoceSfida[]): Rivale[] {
  const per = new Map<string, Rivale>();
  for (const v of [...voci].sort((a, b) => b.quando - a.quando)) {
    if (v.tipo !== 'duello' || !v.avversario) continue;
    const r = per.get(v.avversario.id) ?? { id: v.avversario.id, nome: v.avversario.nome, duelli: 0, vinti: 0, pari: 0, persi: 0, ultimoQuando: v.quando, voci: [] };
    const e = confronta(v, v.avversario);
    r.duelli++;
    if (e === 'vinto') r.vinti++; else if (e === 'pari') r.pari++; else r.persi++;
    r.voci.push(v);
    per.set(v.avversario.id, r);
  }
  return [...per.values()].sort((a, b) => b.ultimoQuando - a.ultimoQuando);
}

/** I duelli lanciati da te che aspettano ancora il risultato dell'amico. */
export function duelliInAttesa(voci: readonly VoceSfida[]): VoceSfida[] {
  return voci.filter(v => v.tipo === 'duello' && v.ruolo === 'sfidante' && !v.avversario);
}

export interface RigaClassifica {
  /** 'io' per te, altrimenti l'identificativo del rivale. */
  id: string;
  nome: string;
  io: boolean;
  duelli: number;
  /** Media delle risposte corrette nei duelli con te, in percentuale sul totale delle domande (0-100). */
  percentuale: number;
  /** Tempo medio nei duelli con te. */
  secondiMedi: number;
}

function media(valori: number[]): number { return valori.reduce((a, b) => a + b, 0) / Math.max(1, valori.length); }

/** Classifica tra te e i tuoi rivali, dai soli duelli conclusi: per ciascuno, la media di risposte corrette (in %) nei duelli
 *  giocati CON TE; a parità, meno tempo. Non esiste una classifica oltre questi duelli: chi non ha duellato con te non c'è. */
export function costruisciClassifica(voci: readonly VoceSfida[], mioNome: string): RigaClassifica[] {
  const duelli = voci.filter(v => v.tipo === 'duello' && v.avversario);
  if (duelli.length === 0) return [];
  const pct = (r: Risultato) => (r.corrette / Math.max(1, r.totale)) * 100;
  const righe: RigaClassifica[] = [{
    id: 'io', nome: mioNome || 'Tu', io: true, duelli: duelli.length,
    percentuale: media(duelli.map(pct)), secondiMedi: media(duelli.map(v => v.secondi)),
  }];
  for (const r of ricavaRivali(voci)) {
    righe.push({
      id: r.id, nome: r.nome, io: false, duelli: r.duelli,
      percentuale: media(r.voci.map(v => pct(v.avversario!))), secondiMedi: media(r.voci.map(v => v.avversario!.secondi)),
    });
  }
  return righe.sort((a, b) => b.percentuale - a.percentuale || a.secondiMedi - b.secondiMedi || a.nome.localeCompare(b.nome, 'it'));
}

/** «Hai vinto», «Pari», «Ha vinto Marta»: la frase dell'esito. */
export function fraseEsito(e: Esito, nomeAvversario: string): string {
  return e === 'vinto' ? 'Hai vinto' : e === 'pari' ? 'Pari' : `Ha vinto ${nomeAvversario}`;
}
