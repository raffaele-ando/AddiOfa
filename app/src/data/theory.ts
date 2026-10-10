// GENERATO da contenuti/ con npm run contenuti: non modificare a mano.

export interface TheoryExample {
  en: string;
  it: string;
}

export interface TheoryMistake {
  sbagliato: string;
  giusto: string;
  perche: string;
}

export interface TheoryTopic {
  /** slug dell'argomento (es. 'present-perfect'); è anche il `theoryId` delle domande */
  id: string;
  titolo: string;
  livello: 'A1' | 'A2' | 'B1';
  /** nome dell'argomento nelle domande (`Question.grammarTopic`) */
  grammarTopic: string;
  /** l'argomento ha una voce nel prontuario (app/src/data/cheatSheet.ts) */
  inCheatSheet: boolean;
  /** false finché la scheda non è stata scritta: i campi sotto sono allora vuoti */
  pronta: boolean;
  regola: string[];
  esempi: TheoryExample[];
  errori: TheoryMistake[];
  consiglio: string;
  /** id di 3 domande del banco che esercitano l'argomento */
  domande: string[];
}

export const theoryTopics: TheoryTopic[] = [
  {
    "id": "present-simple",
    "titolo": "Present Simple: abitudini e fatti",
    "livello": "A1",
    "grammarTopic": "Present Simple",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "present-continuous",
    "titolo": "Present Continuous: azioni in corso",
    "livello": "A2",
    "grammarTopic": "Present Continuous",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "present-perfect",
    "titolo": "Present Perfect: esperienze e durata",
    "livello": "B1",
    "grammarTopic": "Present Perfect",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "past-simple",
    "titolo": "Past Simple: azioni concluse nel passato",
    "livello": "A2",
    "grammarTopic": "Past Simple",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "past-continuous",
    "titolo": "Past Continuous: azioni in corso nel passato",
    "livello": "A2",
    "grammarTopic": "Past Continuous",
    "inCheatSheet": false,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "past-perfect",
    "titolo": "Past Perfect: il passato del passato",
    "livello": "B1",
    "grammarTopic": "Past Perfect",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "used-to",
    "titolo": "Used to: abitudini del passato",
    "livello": "B1",
    "grammarTopic": "Used to",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "going-to",
    "titolo": "Going to: intenzioni e previsioni",
    "livello": "A2",
    "grammarTopic": "Future: going to",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "first-conditional",
    "titolo": "Primo periodo ipotetico (First Conditional)",
    "livello": "B1",
    "grammarTopic": "First Conditional",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "second-conditional",
    "titolo": "Secondo periodo ipotetico (Second Conditional)",
    "livello": "B1",
    "grammarTopic": "Second Conditional",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "third-conditional",
    "titolo": "Terzo periodo ipotetico (Third Conditional)",
    "livello": "B1",
    "grammarTopic": "Third Conditional",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "passive-voice",
    "titolo": "Forma passiva",
    "livello": "B1",
    "grammarTopic": "Passive Voice",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "reported-speech",
    "titolo": "Discorso indiretto (Reported Speech)",
    "livello": "B1",
    "grammarTopic": "Reported Speech",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "modals-obligation-advice",
    "titolo": "Obbligo e consiglio: must, have to, should",
    "livello": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "modals-ability-permission",
    "titolo": "Capacità e permesso: can, could, may",
    "livello": "A1",
    "grammarTopic": "Modals of Ability and Permission",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "modals-deduction",
    "titolo": "Deduzione: must, can't, might",
    "livello": "B1",
    "grammarTopic": "Modals of Deduction",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "gerunds-infinitives",
    "titolo": "Gerundio o infinito",
    "livello": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "relative-clauses",
    "titolo": "Frasi relative: who, which, that, whose",
    "livello": "B1",
    "grammarTopic": "Relative Clauses",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "question-tags",
    "titolo": "Question tags",
    "livello": "B1",
    "grammarTopic": "Question Tags",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "questions-origins",
    "titolo": "Domande e provenienza: how, where, whose",
    "livello": "A1",
    "grammarTopic": "Questions and Origins",
    "inCheatSheet": false,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "there-is-are",
    "titolo": "There is / There are",
    "livello": "A1",
    "grammarTopic": "There is / There are",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "quantifiers",
    "titolo": "Quantificatori: much, many, few, little, some, any",
    "livello": "A1",
    "grammarTopic": "Quantifiers",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "comparatives-superlatives",
    "titolo": "Comparativi e superlativi",
    "livello": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "adverbs-manner",
    "titolo": "Avverbi di modo",
    "livello": "A2",
    "grammarTopic": "Adverbs of Manner",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "prepositions-time",
    "titolo": "Preposizioni di tempo: at, on, in, for, since",
    "livello": "B1",
    "grammarTopic": "Prepositions of Time",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "prepositions-place",
    "titolo": "Preposizioni di luogo: in, on, at, under, between",
    "livello": "A1",
    "grammarTopic": "Prepositions of Place",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "possessives",
    "titolo": "Aggettivi e pronomi possessivi",
    "livello": "A1",
    "grammarTopic": "Possessives",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "possessive-s",
    "titolo": "Il genitivo sassone ('s)",
    "livello": "A1",
    "grammarTopic": "Possessive S",
    "inCheatSheet": true,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "object-pronouns",
    "titolo": "Pronomi complemento: me, you, him, her, us, them",
    "livello": "A1",
    "grammarTopic": "Object Pronouns",
    "inCheatSheet": false,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "demonstratives",
    "titolo": "Dimostrativi: this, that, these, those",
    "livello": "A1",
    "grammarTopic": "Demonstratives",
    "inCheatSheet": false,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  },
  {
    "id": "imperative",
    "titolo": "Imperativo",
    "livello": "A1",
    "grammarTopic": "Imperative",
    "inCheatSheet": false,
    "pronta": false,
    "regola": [],
    "esempi": [],
    "errori": [],
    "consiglio": "",
    "domande": []
  }
];

export const getTheoryTopic = (id: string): TheoryTopic | undefined => theoryTopics.find((t) => t.id === id);
