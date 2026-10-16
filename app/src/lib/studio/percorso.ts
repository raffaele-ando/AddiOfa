// Il percorso di studio: le 31 schede di teoria in un ordine didattico, con lo stato di ogni lezione ricavato dai progressi veri.
// Una lezione = un argomento di teoria (data/theory.ts). Nessun numero inventato: i minuti e le percentuali si calcolano da qui.
import type { AppState } from '../../types';
import { questions } from '../../data/questions';
import { theoryTopics, type TheoryTopic } from '../../data/theory';
import { isLearned } from '../spacedRepetition';
import { minutiLettura } from '../../components/home/stima';

/**
 * Ordine didattico: dal livello A1 al B1; dentro ogni livello prima gli argomenti più comuni nel test (quelli con più domande
 * nel banco) e, dove un argomento ne richiede un altro, il prerequisito viene prima (il Present Perfect prima dei condizionali
 * e del Past Perfect, il Past Simple prima del Passive...). Un argomento nuovo non elencato qui va in fondo al suo livello.
 */
export const ORDINE_PERCORSO: readonly string[] = [
  // A1: le basi
  'present-simple', 'there-is-are', 'quantifiers', 'questions-origins', 'possessives', 'possessive-s',
  'object-pronouns', 'prepositions-place', 'demonstratives', 'imperative', 'modals-ability-permission',
  // A2: il passato, il futuro e il confronto
  'present-continuous', 'past-simple', 'comparatives-superlatives', 'going-to', 'past-continuous',
  'modals-obligation-advice', 'adverbs-manner',
  // B1: le strutture più avanzate del test
  'present-perfect', 'gerunds-infinitives', 'first-conditional', 'second-conditional', 'used-to',
  'relative-clauses', 'passive-voice', 'modals-deduction', 'question-tags', 'reported-speech',
  'past-perfect', 'third-conditional', 'prepositions-time',
];

const LIVELLI = ['A1', 'A2', 'B1'] as const;
const posLivello = (l: string) => { const i = (LIVELLI as readonly string[]).indexOf(l); return i < 0 ? LIVELLI.length : i; };

/** Le schede pronte nell'ordine del percorso (livello, poi ORDINE_PERCORSO, poi quelle non elencate nell'ordine del file). */
export function ordinaPercorso(topics: readonly TheoryTopic[] = theoryTopics): TheoryTopic[] {
  const pos = (t: TheoryTopic) => { const i = ORDINE_PERCORSO.indexOf(t.id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  return topics
    .map((t, i) => ({ t, i }))
    .filter(x => x.t.pronta)
    .sort((a, b) => posLivello(a.t.livello) - posLivello(b.t.livello) || pos(a.t) - pos(b.t) || a.i - b.i)
    .map(x => x.t);
}

/** Una lezione conta come imparata quando almeno questa quota delle sue domande è imparata (isLearned). */
export const QUOTA_LEZIONE_IMPARATA = 0.8;
/** Tempo medio per una domanda: quello del test (30 domande in 15 minuti). */
export const SECONDI_PER_DOMANDA = 30;
/** Domande di una sessione di esercizi sull'argomento. */
export const DOMANDE_PER_SESSIONE = 10;

export type StatoLezione = 'imparata' | 'in-corso' | 'da-iniziare';

export interface LezionePercorso {
  numero: number;
  topic: TheoryTopic;
  /** Domande dell'argomento nel banco. */
  intere: number;
  imparate: number;
  /** Domande già viste almeno una volta. */
  viste: number;
  stato: StatoLezione;
  /** Minuti: lettura della scheda + una sessione di esercizi. */
  minuti: TempoLezione;
}

export interface TempoLezione { teoria: number; esercizi: number; totale: number }

/** Tempo stimato: lettura della scheda (180 parole al minuto, come la home) e una sessione di esercizi a 30 secondi per domanda. */
export function tempoLezione(topic: TheoryTopic, domandeDisponibili: number): TempoLezione {
  const teoria = minutiLettura(topic);
  const n = Math.min(DOMANDE_PER_SESSIONE, Math.max(0, domandeDisponibili));
  const esercizi = n > 0 ? Math.max(1, Math.round((n * SECONDI_PER_DOMANDA) / 60)) : 0;
  return { teoria, esercizi, totale: teoria + esercizi };
}

export function statoDaConteggi(imparate: number, disponibili: number, viste: number): StatoLezione {
  if (disponibili > 0 && imparate / disponibili >= QUOTA_LEZIONE_IMPARATA) return 'imparata';
  if (viste > 0) return 'in-corso';
  return 'da-iniziare';
}

/** Tutte le lezioni del percorso con lo stato vero di ciascuna. */
export function lezioniPercorso(stato: AppState): LezionePercorso[] {
  return ordinaPercorso().map((topic, i) => {
    const interne = questions.filter(q => q.theoryId === topic.id);
    let imparate = 0, viste = 0;
    for (const q of interne) {
      const s = stato.stats?.[q.id];
      if (!s) continue;
      if ((s.correct ?? 0) + (s.incorrect ?? 0) + (s.omitted ?? 0) > 0) viste++;
      if (isLearned(s)) imparate++;
    }
    return {
      numero: i + 1,
      topic,
      intere: interne.length,
      imparate,
      viste,
      stato: statoDaConteggi(imparate, interne.length, viste),
      minuti: tempoLezione(topic, interne.length),
    };
  });
}

/** La prossima lezione da fare: la prima non imparata nell'ordine del percorso (null se sono tutte imparate). */
export function prossimaLezione(lezioni: readonly LezionePercorso[]): LezionePercorso | null {
  return lezioni.find(l => l.stato !== 'imparata') ?? null;
}

/** Il nome corto della lezione: il titolo della scheda fino ai due punti («Present Simple: abitudini e fatti» → «Present Simple»). */
export function titoloBreve(topic: Pick<TheoryTopic, 'titolo'>): string {
  const corto = topic.titolo.split(':')[0].trim();
  return corto || topic.titolo.trim();
}

/** Il filtro per avviare gli esercizi sull'argomento (selectPracticeIds: «topic:Nome»). */
export function filtroArgomento(topic: TheoryTopic): string {
  return `topic:${topic.grammarTopic}`;
}

/** Toglie dal testo delle schede i segni di enfasi (*corsivo*, **grassetto**). */
function senzaEnfasi(t: string): string { return t.replace(/\*+/g, ''); }

/**
 * Obiettivo di una lezione: cosa si impara (dal titolo della scheda) e, in breve, la prima regola della scheda.
 * Niente promesse sul punteggio: solo il contenuto vero.
 */
export function obiettivoLezione(topic: TheoryTopic): { cosa: string; inBreve: string } {
  const [, ...resto] = topic.titolo.split(':');
  const tema = resto.length > 0 ? resto.join(':').trim() : topic.titolo.trim();
  const cosa = `Riconoscere e usare: ${tema.charAt(0).toLowerCase()}${tema.slice(1)}`;
  const regola = senzaEnfasi(topic.regola[0] ?? '');
  // la prima frase della regola, fino ai due punti degli esempi
  const inBreve = regola.split(/:\s/)[0].replace(/\s+/g, ' ').trim().replace(/\.$/, '');
  return { cosa, inBreve };
}
