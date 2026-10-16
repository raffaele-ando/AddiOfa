// Badge: traguardi VERI di studio, calcolati da quello che l'utente ha fatto. Nessun punteggio, nessun XP, nessuna serie da non spezzare.
// Ogni badge ha una condizione scritta in chiaro e, finché è bloccato, un avanzamento vero («37 su 50»).
// Un badge sbloccato resta sbloccato (lo ricorda la schermata, che salva gli id): un errore che riporta una domanda a «in corso» non lo toglie.
import type { AppState } from '../../types';
import { FORMATS } from '../../config/offer';
import { esitoSimulazione } from '../../components/home/stima';
import { getQuestionStats, isLearned } from '../spacedRepetition';
import { riassuntoStudio } from './giorni';
import { livelloConNucleo, LIVELLI, type Livello } from './livello';
import type { DomandaBanco } from './tipi';

export type GruppoBadge = 'studio' | 'simulazioni' | 'costanza' | 'livello';
export const GRUPPI_BADGE: { id: GruppoBadge; titolo: string }[] = [
  { id: 'studio', titolo: 'Studio' },
  { id: 'simulazioni', titolo: 'Simulazioni' },
  { id: 'costanza', titolo: 'Costanza' },
  { id: 'livello', titolo: 'Livello' },
];

/** Un argomento è «padroneggiato» quando ha imparato questa quota delle sue domande (con almeno MIN_DOMANDE_ARGOMENTO nel banco). */
export const SOGLIA_ARGOMENTO = 0.8;
export const MIN_DOMANDE_ARGOMENTO = 3;
/** Intervallo di ripasso (giorni) da cui una domanda conta come ricordata a lungo. */
export const GIORNI_MEMORIA = 7;
export const MIN_RISPOSTE_ACCURATEZZA = 100;
export const SOGLIA_ACCURATEZZA = 0.8;

export interface ContestoBadge {
  stato: AppState;
  /** Le domande che l'utente può studiare adesso (nucleo gratuito, o tutto il banco con il Pass). */
  pool: readonly DomandaBanco[];
  /** Tutto il banco: serve a sapere quanti argomenti esistono. */
  tutte: readonly DomandaBanco[];
  /** Il nucleo gratuito: il livello raggiunto su di esso resta valido anche con il Pass (vedi livelloConNucleo). Assente = solo il `pool`. */
  nucleo?: readonly DomandaBanco[];
}

export interface ValutazioneBadge {
  sbloccato: boolean;
  /** 0-1, per la barra dei badge bloccati. */
  quota: number;
  /** «37 su 50 domande imparate». */
  avanzamento: string;
  /** Falso se con le domande di adesso non si può arrivare alla fine (serve il Pass). */
  raggiungibile: boolean;
}

export interface DefinizioneBadge {
  id: string;
  gruppo: GruppoBadge;
  titolo: string;
  /** La condizione, in una frase. */
  condizione: string;
  /** Nome dell'illustrazione del kit blu (brand/essenziali/disegni/kit-blu/illustrazioni). */
  illustrazione: string;
  valuta: (c: ContestoBadge, m: Misure) => ValutazioneBadge;
}

/** Numeri calcolati una sola volta e usati da più badge. */
export interface Misure {
  imparate: number;
  argomentiPadroneggiati: number;
  argomentiPossibili: number;
  argomentiTotali: number;
  ricordateA7Giorni: number;
  risposte: number;
  accuratezza: number;
  simulazioni: number;
  simulazioniSuperate: number;
  giorniDiStudio: number;
  secondiTotali: number;
  livelli: ReturnType<typeof livelloConNucleo>;
}

function perArgomento(banco: readonly DomandaBanco[]): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const q of banco) {
    if (!q.theoryId) continue;
    const l = m.get(q.theoryId) ?? [];
    l.push(q.id);
    m.set(q.theoryId, l);
  }
  return m;
}

/** Argomenti con abbastanza domande nel banco dato e la quota imparata richiesta. */
export function argomentiPadroneggiati(stats: AppState['stats'], banco: readonly DomandaBanco[]): { padroneggiati: number; possibili: number } {
  let padroneggiati = 0, possibili = 0;
  for (const ids of perArgomento(banco).values()) {
    if (ids.length < MIN_DOMANDE_ARGOMENTO) continue;
    possibili++;
    const imparate = ids.filter(id => isLearned(stats?.[id])).length;
    if (imparate / ids.length >= SOGLIA_ARGOMENTO) padroneggiati++;
  }
  return { padroneggiati, possibili };
}

export function misura(c: ContestoBadge): Misure {
  const { stato, pool, tutte } = c;
  const stats = stato.stats ?? {};
  const arg = argomentiPadroneggiati(stats, pool);
  let risposte = 0, esatte = 0;
  for (const st of Object.values(stats)) {
    const ok = Math.max(0, Number.isFinite(st?.correct) ? st.correct : 0);
    const no = Math.max(0, Number.isFinite(st?.incorrect) ? st.incorrect : 0);
    esatte += ok; risposte += ok + no;
  }
  const storico = (Array.isArray(stato.history) ? stato.history : []).filter(h => h && Number.isFinite(h.date) && (h.format ?? 'ente') === 'ente');
  const studio = riassuntoStudio(stato);
  return {
    imparate: pool.filter(q => isLearned(stats[q.id])).length,
    argomentiPadroneggiati: arg.padroneggiati,
    argomentiPossibili: arg.possibili,
    argomentiTotali: perArgomento(tutte).size,
    ricordateA7Giorni: pool.filter(q => isLearned(stats[q.id]) && getQuestionStats(stats, q.id).interval >= GIORNI_MEMORIA).length,
    risposte,
    accuratezza: risposte > 0 ? esatte / risposte : 0,
    simulazioni: storico.length,
    simulazioniSuperate: storico.filter(h => esitoSimulazione(h).esatte >= FORMATS.ente.passMark).length,
    giorniDiStudio: studio.giorniDiStudio,
    secondiTotali: studio.secondiTotali,
    livelli: livelloConNucleo(stats, pool, c.nucleo ?? pool),
  };
}

const conteggio = (corrente: number, obiettivo: number, unita: string, possibile = obiettivo): ValutazioneBadge => ({
  sbloccato: corrente >= obiettivo,
  quota: Math.min(1, corrente / obiettivo),
  avanzamento: `${Math.min(corrente, obiettivo)} su ${obiettivo} ${unita}`,
  raggiungibile: possibile >= obiettivo,
});

const domande = (id: string, obiettivo: number, titolo: string, illustrazione: string): DefinizioneBadge => ({
  id, gruppo: 'studio', titolo, illustrazione,
  condizione: obiettivo === 1 ? 'Impara la prima domanda: due risposte esatte di fila, a distanza di mezza giornata.' : `Impara ${obiettivo} domande.`,
  valuta: (c, m) => conteggio(m.imparate, obiettivo, obiettivo === 1 ? 'domanda imparata' : 'domande imparate', c.pool.length),
});

const argomenti = (id: string, obiettivo: number | 'tutti', titolo: string, illustrazione: string): DefinizioneBadge => ({
  id, gruppo: 'studio', titolo, illustrazione,
  condizione: obiettivo === 1
    ? `Padroneggia il primo argomento: impara l'${Math.round(SOGLIA_ARGOMENTO * 100)} % delle sue domande.`
    : `Padroneggia ${obiettivo === 'tutti' ? 'tutti gli argomenti' : `${obiettivo} argomenti`} (almeno l'${Math.round(SOGLIA_ARGOMENTO * 100)} % delle domande di ciascuno imparate).`,
  valuta: (_c, m) => {
    const o = obiettivo === 'tutti' ? Math.max(1, m.argomentiTotali) : obiettivo;
    return conteggio(m.argomentiPadroneggiati, o, o === 1 ? 'argomento padroneggiato' : 'argomenti padroneggiati', m.argomentiPossibili);
  },
});

const giorni = (id: string, obiettivo: number, titolo: string, illustrazione: string): DefinizioneBadge => ({
  id, gruppo: 'costanza', titolo, illustrazione,
  condizione: `Studia in ${obiettivo} giorni diversi. Non devono essere di fila: conta ogni giorno in cui studi.`,
  valuta: (_c, m) => conteggio(m.giorniDiStudio, obiettivo, 'giorni di studio'),
});

const livello = (l: Livello, titolo: string, illustrazione: string): DefinizioneBadge => ({
  id: `livello-${l.toLowerCase()}`, gruppo: 'livello', titolo, illustrazione,
  condizione: `Raggiungi il livello ${l}: impara il 60 % delle domande ${l}${l === 'A1' ? '' : ` dopo aver raggiunto ${LIVELLI[LIVELLI.indexOf(l) - 1]}`}.`,
  valuta: (_c, m) => {
    const q = m.livelli.quote.find(x => x.livello === l);
    if (!q) return { sbloccato: false, quota: 0, avanzamento: 'Livello non misurabile con queste domande', raggiungibile: false };
    const necessarie = Math.ceil(0.6 * q.totale - 1e-9);
    return {
      sbloccato: q.raggiunto,
      quota: q.raggiunto ? 1 : Math.min(1, q.imparate / necessarie),
      avanzamento: `${Math.min(q.imparate, necessarie)} su ${necessarie} domande ${l} da imparare`,
      raggiungibile: true,
    };
  },
});

export const BADGE: DefinizioneBadge[] = [
  domande('prima-domanda', 1, 'Prima domanda imparata', 'suggerimenti-consigli'),
  domande('domande-25', 25, '25 domande imparate', 'studio-inglese'),
  domande('domande-100', 100, '100 domande imparate', 'quiz-test'),
  argomenti('argomento-1', 1, 'Primo argomento', 'ricerca'),
  argomenti('argomenti-10', 10, '10 argomenti', 'successo'),
  argomenti('argomenti-20', 20, '20 argomenti', 'risultato-probabilita'),
  argomenti('argomenti-tutti', 'tutti', 'Tutti gli argomenti', 'celebrazione'),
  {
    id: 'memoria-10', gruppo: 'studio', titolo: 'Memoria a lungo termine', illustrazione: 'attesa-caricamento',
    condizione: `Ricorda 10 domande imparate anche a distanza: il ripasso le ha portate a un intervallo di almeno ${GIORNI_MEMORIA} giorni.`,
    valuta: (c, m) => conteggio(m.ricordateA7Giorni, 10, 'domande ricordate a lungo', c.pool.length),
  },
  {
    id: 'accuratezza-80', gruppo: 'studio', titolo: 'Accuratezza 80 %', illustrazione: 'verifica-utente',
    condizione: `Rispondi bene all'${Math.round(SOGLIA_ACCURATEZZA * 100)} % o più, su almeno ${MIN_RISPOSTE_ACCURATEZZA} risposte date.`,
    valuta: (_c, m) => {
      if (m.risposte < MIN_RISPOSTE_ACCURATEZZA) {
        return { sbloccato: false, quota: m.risposte / MIN_RISPOSTE_ACCURATEZZA, avanzamento: `${m.risposte} su ${MIN_RISPOSTE_ACCURATEZZA} risposte date`, raggiungibile: true };
      }
      const perc = Math.round(m.accuratezza * 100);
      const ok = m.accuratezza >= SOGLIA_ACCURATEZZA;
      return { sbloccato: ok, quota: Math.min(1, m.accuratezza / SOGLIA_ACCURATEZZA), avanzamento: `Ora sei al ${perc} %, serve l'${Math.round(SOGLIA_ACCURATEZZA * 100)} %`, raggiungibile: true };
    },
  },
  {
    id: 'ore-5', gruppo: 'studio', titolo: '5 ore di studio', illustrazione: 'mondo-internazionale',
    condizione: 'Studia per 5 ore in tutto (tempo attivo nelle schermate di studio).',
    valuta: (_c, m) => {
      const minuti = Math.floor(m.secondiTotali / 60);
      return { sbloccato: minuti >= 300, quota: Math.min(1, minuti / 300), avanzamento: `${Math.min(minuti, 300)} su 300 minuti`, raggiungibile: true };
    },
  },
  {
    id: 'prima-simulazione', gruppo: 'simulazioni', titolo: 'Prima simulazione', illustrazione: 'quiz-test',
    condizione: 'Completa la prima simulazione del test.',
    valuta: (_c, m) => conteggio(m.simulazioni, 1, 'simulazione fatta'),
  },
  {
    id: 'simulazione-superata', gruppo: 'simulazioni', titolo: 'Simulazione superata', illustrazione: 'superamento',
    condizione: `Supera una simulazione: almeno ${FORMATS.ente.passMark} risposte esatte su ${FORMATS.ente.questions}.`,
    valuta: (_c, m) => conteggio(m.simulazioniSuperate, 1, 'simulazione superata'),
  },
  {
    id: 'simulazioni-superate-3', gruppo: 'simulazioni', titolo: 'Tre simulazioni superate', illustrazione: 'celebrazione',
    condizione: `Supera tre simulazioni (${FORMATS.ente.passMark}/${FORMATS.ente.questions} o più), anche non di fila.`,
    valuta: (_c, m) => conteggio(m.simulazioniSuperate, 3, 'simulazioni superate'),
  },
  giorni('giorni-7', 7, '7 giorni di studio', 'progressi-statistiche'),
  giorni('giorni-14', 14, '14 giorni di studio', 'studio-inglese'),
  giorni('giorni-31', 31, '31 giorni di studio', 'celebrazione'),
  livello('A1', 'Livello A1', 'suggerimenti-consigli'),
  livello('A2', 'Livello A2', 'verifica-utente'),
  livello('B1', 'Livello B1', 'superamento'),
];

export interface BadgeValutato extends DefinizioneBadge, ValutazioneBadge {}

/** Valuta tutti i badge. `giaSbloccati` = gli id che l'utente ha già visto sbloccati: restano tali. */
export function valutaBadge(c: ContestoBadge, giaSbloccati: readonly string[] = []): BadgeValutato[] {
  const m = misura(c);
  const memoria = new Set(giaSbloccati);
  return BADGE.map(b => {
    const v = b.valuta(c, m);
    return { ...b, ...v, sbloccato: v.sbloccato || memoria.has(b.id) };
  });
}
