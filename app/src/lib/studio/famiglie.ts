// Le 31 lezioni (argomenti di teoria) in sette famiglie, solo come raggruppamento per nome. Nessuna immagine: ogni lezione si riconosce dal suo
// numero (TesseraLezione), perché sette illustrazioni per 31 lezioni facevano condividere la stessa immagine a lezioni diverse.

export type FamigliaId = 'tempi' | 'domande' | 'confronti' | 'condizionali' | 'discorso' | 'chi-dove' | 'resto';

export interface Famiglia {
  id: FamigliaId;
  /** Nome breve (1-2 parole), usato come etichetta accessibile. */
  nome: string;
  /** Gli id degli argomenti di teoria della famiglia. */
  argomenti: readonly string[];
}

export const FAMIGLIE: readonly Famiglia[] = [
  { id: 'tempi', nome: 'Tempi',
    argomenti: ['present-simple', 'present-continuous', 'past-simple', 'past-continuous', 'past-perfect', 'present-perfect', 'going-to', 'used-to'] },
  { id: 'domande', nome: 'Domande',
    argomenti: ['question-tags', 'questions-origins'] },
  { id: 'confronti', nome: 'Confronti',
    argomenti: ['comparatives-superlatives', 'quantifiers'] },
  { id: 'condizionali', nome: 'Condizionali e modali',
    argomenti: ['first-conditional', 'second-conditional', 'third-conditional', 'modals-obligation-advice', 'modals-ability-permission', 'modals-deduction'] },
  { id: 'discorso', nome: 'Discorso',
    argomenti: ['reported-speech', 'passive-voice', 'relative-clauses', 'gerunds-infinitives'] },
  { id: 'chi-dove', nome: 'Chi e dove',
    argomenti: ['object-pronouns', 'possessives', 'possessive-s', 'demonstratives', 'there-is-are', 'prepositions-place', 'prepositions-time'] },
  { id: 'resto', nome: 'Altro',
    argomenti: ['imperative', 'adverbs-manner'] },
];

const ULTIMA = FAMIGLIE[FAMIGLIE.length - 1];

/** La famiglia di un argomento. Un argomento nuovo non ancora elencato cade in «Altro». */
export function famigliaDi(topicId: string): Famiglia {
  return FAMIGLIE.find(f => f.argomenti.includes(topicId)) ?? ULTIMA;
}
