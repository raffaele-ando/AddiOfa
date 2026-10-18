// L'arte della Home: quale illustrazione del Brand Kit va con quale argomento e con quale stato (piano d'uso: docs/design/ILLUSTRAZIONI.md, sezione 3.1). La fascia di stato non usa più illustrazioni: ha un glifo da 40 px (Stima.tsx).

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
  // «There is / There are» e le preposizioni di luogo dicono dove sono le cose (lente), quelle di tempo l'orario (clessidra):
  // la carta d'identità della famiglia «Chi e dove» qui non c'entra
  'there-is-are': 'ricerca', 'prepositions-place': 'ricerca', 'prepositions-time': 'attesa-caricamento',
};

/** Nome dell'illustrazione (kit blu, gruppo illustrazioni) dell'argomento di teoria `topicId`. */
export function arteArgomento(topicId: string): string {
  return FAMIGLIA[topicId] ?? 'studio-inglese';
}
