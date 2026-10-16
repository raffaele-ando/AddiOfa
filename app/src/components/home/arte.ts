// L'arte della Home: quale illustrazione del Brand Kit va con quale argomento e con quale stato (piano d'uso: docs/design/ILLUSTRAZIONI.md, sezione 3.1).
import type { ChiaveBanner } from './Stima';

/**
 * Una illustrazione per famiglia di argomento (tabella «Famiglie di argomento» del piano d'uso). Chiave = id della scheda di teoria.
 * Una scheda non elencata prende `studio-inglese` (la famiglia «Il resto»).
 */
const FAMIGLIA: Record<string, string> = {
  // Tempi
  'present-simple': 'attesa-caricamento', 'present-continuous': 'attesa-caricamento', 'past-simple': 'attesa-caricamento',
  'past-continuous': 'attesa-caricamento', 'past-perfect': 'attesa-caricamento', 'present-perfect': 'attesa-caricamento',
  'going-to': 'attesa-caricamento', 'used-to': 'attesa-caricamento',
  // Domande
  'question-tags': 'ricerca', 'questions-origins': 'ricerca',
  // Confronti e quantità
  'comparatives-superlatives': 'progressi-statistiche', quantifiers: 'progressi-statistiche',
  // Condizionali e modali
  'first-conditional': 'suggerimenti-consigli', 'second-conditional': 'suggerimenti-consigli', 'third-conditional': 'suggerimenti-consigli',
  'modals-obligation-advice': 'suggerimenti-consigli', 'modals-ability-permission': 'suggerimenti-consigli', 'modals-deduction': 'suggerimenti-consigli',
  // Discorso e frase
  'reported-speech': 'messaggi-supporto', 'passive-voice': 'messaggi-supporto', 'relative-clauses': 'messaggi-supporto', 'gerunds-infinitives': 'messaggi-supporto',
  // Chi e dove
  'object-pronouns': 'verifica-utente', possessives: 'verifica-utente', 'possessive-s': 'verifica-utente', demonstratives: 'verifica-utente',
  'there-is-are': 'verifica-utente', 'prepositions-place': 'verifica-utente', 'prepositions-time': 'verifica-utente',
};

/** Nome dell'illustrazione (kit blu, gruppo illustrazioni) dell'argomento di teoria `topicId`. */
export function arteArgomento(topicId: string): string {
  return FAMIGLIA[topicId] ?? 'studio-inglese';
}

/** Illustrazione della fascia di stato sotto il misuratore: nuovo, basso, medio, alto (concept 01: avvertenza, andamento, traguardo). */
export const ARTE_STATO: Record<ChiaveBanner, string> = {
  nuovo: 'quiz-test-lista',
  partenza: 'attenzione-rischio',
  margine: 'attenzione-rischio',
  soglia: 'progressi-statistiche',
  strada: 'successo',
};
