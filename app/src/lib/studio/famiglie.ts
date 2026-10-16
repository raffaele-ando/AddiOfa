// Le 31 lezioni (argomenti di teoria) in sette famiglie: ogni famiglia ha un'illustrazione del Brand Kit (piatta, piccola).
// Piano d'uso: docs/design/ILLUSTRAZIONI.md, tabella «Famiglie di argomento». Le illustrazioni si disegnano con <Illustrazione nome=… />.

export type FamigliaId = 'tempi' | 'domande' | 'confronti' | 'condizionali' | 'discorso' | 'chi-dove' | 'resto';

export interface Famiglia {
  id: FamigliaId;
  /** Nome breve (1-2 parole), usato come etichetta accessibile. */
  nome: string;
  /** Illustrazione del kit blu (gruppo «illustrazioni»). */
  illustrazione: string;
  /** Gli id degli argomenti di teoria della famiglia. */
  argomenti: readonly string[];
}

export const FAMIGLIE: readonly Famiglia[] = [
  { id: 'tempi', nome: 'Tempi', illustrazione: 'attesa-caricamento',
    argomenti: ['present-simple', 'present-continuous', 'past-simple', 'past-continuous', 'past-perfect', 'present-perfect', 'going-to', 'used-to'] },
  { id: 'domande', nome: 'Domande', illustrazione: 'ricerca',
    argomenti: ['question-tags', 'questions-origins'] },
  { id: 'confronti', nome: 'Confronti', illustrazione: 'progressi-statistiche',
    argomenti: ['comparatives-superlatives', 'quantifiers'] },
  { id: 'condizionali', nome: 'Condizionali e modali', illustrazione: 'suggerimenti-consigli',
    argomenti: ['first-conditional', 'second-conditional', 'third-conditional', 'modals-obligation-advice', 'modals-ability-permission', 'modals-deduction'] },
  { id: 'discorso', nome: 'Discorso', illustrazione: 'messaggi-supporto',
    argomenti: ['reported-speech', 'passive-voice', 'relative-clauses', 'gerunds-infinitives'] },
  { id: 'chi-dove', nome: 'Chi e dove', illustrazione: 'verifica-utente',
    argomenti: ['object-pronouns', 'possessives', 'possessive-s', 'demonstratives', 'there-is-are', 'prepositions-place', 'prepositions-time'] },
  { id: 'resto', nome: 'Altro', illustrazione: 'studio-inglese',
    argomenti: ['imperative', 'adverbs-manner'] },
];

const ULTIMA = FAMIGLIE[FAMIGLIE.length - 1];

/** La famiglia di un argomento. Un argomento nuovo non ancora elencato cade in «Altro». */
export function famigliaDi(topicId: string): Famiglia {
  return FAMIGLIE.find(f => f.argomenti.includes(topicId)) ?? ULTIMA;
}
