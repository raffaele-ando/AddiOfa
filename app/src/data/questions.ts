// GENERATO da contenuti/ con npm run contenuti: non modificare a mano.
import type { Question, CorpusType } from '../types';

/** Numero di domande del nucleo gratuito (core: true in contenuti/domande/). */
export const INITIAL_CORPUS_COUNT = 100;

/** Id delle domande del nucleo gratuito. */
const CORE_IDS: ReadonlySet<string> = new Set(["q61","q67","q69","q71","q75","q84","q91","q95","q98","q107","q111","q114","q121","q122","q133","q134","q135","q136","q137","q139","q143","q145","q146","q148","q150","q157","q160","q162","q165","q171","q172","q190","q191","q199","q210","q213","q214","q217","q222","q227","q237","q242","q251","q256","q258","q270","q271","q272","q280","q291","q296","q301","q311","q312","q322","q325","q326","q328","q335","q346","q347","q354","q363","q367","q370","q380","q381","q389","q396","q398","q404","q406","q425","q432","q436","q450","q459","q465","q468","q472","q489","q490","q494","q495","q499","q507","q521","q526","q529","q535","q546","q553","q566","q570","q581","q584","q590","q594","q605","q632"]);

export const isCoreId = (id: string): boolean => CORE_IDS.has(id);

export const getQuestionsByCorpus = (corpus: CorpusType = 'all'): Question[] => {
  if (corpus === 'initial') {
    return questions.filter((q) => CORE_IDS.has(q.id));
  }
  return questions;
};

export const questions: Question[] = [
  {
    "id": "q1",
    "prompt": "Which sentence is correct?",
    "options": [
      "Is your sister ever lived abroad?",
      "Has your sister ever lived abroad?",
      "Does your sister ever lived abroad?",
      "Have your sister ever lived abroad?"
    ],
    "correctIndex": 1,
    "explanation": "Per le esperienze di vita (senza dire quando) si usa il Present Perfect: have/has + participio passato. Con 'your sister' l'ausiliare è 'has' e il verbo resta al participio ('lived'). 'Is' e 'does' non si usano per costruire questo tempo, e 'have' non concorda con il soggetto singolare.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q2",
    "prompt": "Choose the correct question: '_____ a bank in this street?'",
    "options": [
      "Is there",
      "There is",
      "Are there",
      "Is it"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere se qualcosa esiste si inverte 'there is' in 'Is there...?'. 'A bank' è singolare, quindi non va bene 'Are there'. 'There is' è la forma affermativa e 'Is it' non esprime esistenza.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q3",
    "prompt": "Which sentence is correct?",
    "options": [
      "Did your brother won the match last night?",
      "Was your brother win the match last night?",
      "Does your brother won the match last night?",
      "Did your brother win the match last night?"
    ],
    "correctIndex": 3,
    "explanation": "Nelle domande al Past Simple l'ausiliare 'did' porta già il passato: il verbo resta alla forma base ('win', non 'won'). 'Was' e 'does' non si combinano con questo verbo e con 'last night' serve il passato.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q4",
    "prompt": "Choose the correct translation for 'Agosto è il mese più caldo dell'anno.'",
    "options": [
      "August is the most hot month of the year.",
      "August is the hotter month of the year.",
      "August is the hottest month of the year.",
      "August is more hot month of the year."
    ],
    "correctIndex": 2,
    "explanation": "'Hot' è un aggettivo corto: il superlativo si fa con 'the + -est' e la consonante finale si raddoppia ('hottest'). 'Most hot' si usa solo con aggettivi lunghi, 'hotter' è il comparativo (si usa con 'than').",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q5",
    "prompt": "Choose the correct translation for 'Abbiamo comprato questa casa nel 2018.'",
    "options": [
      "We have bought this house in 2018.",
      "We bought this house in 2018.",
      "We buyed this house in 2018.",
      "We are buying this house in 2018."
    ],
    "correctIndex": 1,
    "explanation": "Con un anno preciso nel passato ('in 2018') si usa il Past Simple, non il Present Perfect. 'Buy' è irregolare: il passato è 'bought', non 'buyed'. 'Are buying' è un presente.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q6",
    "prompt": "Which sentence compares the two bags correctly?",
    "options": [
      "The red bag is more expensive than the blue one.",
      "The red bag is more expensive that the blue one.",
      "The red bag is expensiver than the blue one.",
      "The red bag is the most expensive than the blue one."
    ],
    "correctIndex": 0,
    "explanation": "'Expensive' è un aggettivo lungo: il comparativo si fa con 'more + aggettivo' e il secondo termine si introduce con 'than'. 'That' non è il termine di paragone, '-er' va solo con aggettivi corti e 'the most' è un superlativo, che non si usa con 'than'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q7",
    "prompt": "Complete the sentence: '_____ did Anna buy that jacket?' - 'Last Saturday.'",
    "options": [
      "Where",
      "Who",
      "When",
      "Why"
    ],
    "correctIndex": 2,
    "explanation": "La risposta 'Last Saturday' indica un momento, quindi la domanda va introdotta da 'When'. 'Where' chiederebbe un luogo, 'Who' una persona e 'Why' un motivo.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q8",
    "prompt": "Choose the correct translation for 'Quanti libri ci sono sullo scaffale?'",
    "options": [
      "How much books are there on the shelf?",
      "How many books is there on the shelf?",
      "How many book are there on the shelf?",
      "How many books are there on the shelf?"
    ],
    "correctIndex": 3,
    "explanation": "'Libri' si può contare, quindi si usa 'How many' (non 'much', che è per i nomi non numerabili) seguito dal plurale ('books') e dal verbo al plurale ('are there'). 'Is there' e 'book' al singolare sono errori di concordanza.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q9",
    "prompt": "Choose the correct translation for 'Il film comincerà tra un'ora.'",
    "options": [
      "The film will start between an hour.",
      "The film will start in an hour.",
      "The film will start at an hour.",
      "The film will start for an hour."
    ],
    "correctIndex": 1,
    "explanation": "Per dire 'tra' un certo tempo da adesso si usa 'in' + durata ('in an hour'). 'Between' richiede due punti (between two and three), 'at' va con l'orario preciso e 'for' indica quanto dura qualcosa.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time"
  },
  {
    "id": "q10",
    "prompt": "Choose the correct translation for 'Posso usare il tuo telefono, per favore?'",
    "options": [
      "Can I use your phone, please?",
      "Can I to use your phone, please?",
      "Do I can use your phone, please?",
      "Can I using your phone, please?"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere il permesso si usa 'Can I + verbo base'. I verbi modali non vogliono 'to' dopo di sé, non usano 'do' nelle domande e non si usano con la forma in -ing.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Modals of Ability and Permission",
    "theoryId": "modals-ability-permission"
  },
  {
    "id": "q11",
    "prompt": "Choose the correct translation for 'Laura vive a Napoli con i suoi genitori.'",
    "options": [
      "Laura live in Naples with her parents.",
      "Laura living in Naples with her parents.",
      "Laura lives in Naples with her parents.",
      "Laura lives in Naples with she parents."
    ],
    "correctIndex": 2,
    "explanation": "Con il soggetto alla terza persona singolare (Laura = she) il Present Simple vuole la -s ('lives'). Senza verbo coniugato ('living') la frase non regge, e davanti a un nome serve l'aggettivo possessivo 'her', non il pronome 'she'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q12",
    "prompt": "Choose the correct sentence to describe what is happening now.",
    "options": [
      "Be quiet! The baby is sleep.",
      "Be quiet! The baby sleep.",
      "Be quiet! The baby sleeped.",
      "Be quiet! The baby is sleeping."
    ],
    "correctIndex": 3,
    "explanation": "Per un'azione che sta succedendo adesso si usa il Present Continuous: 'is' + verbo in -ing ('is sleeping'). Le altre forme sono errate: manca il -ing, manca la -s della terza persona, e 'sleeped' non esiste ('sleep' è irregolare).",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q13",
    "prompt": "Choose the correct question:",
    "options": [
      "Is there any rice in the cupboard?",
      "Are there any rice in the cupboard?",
      "Is there a rice in the cupboard?",
      "Is there any rices in the cupboard?"
    ],
    "correctIndex": 0,
    "explanation": "'Rice' (riso) è un nome non numerabile: si usa 'Is there' (non 'Are there'), senza 'a' e senza plurale. Nelle domande si usa 'any'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q14",
    "prompt": "Choose the correct translation for 'Da quanto tempo abiti a Milano?'",
    "options": [
      "How long do you live in Milan?",
      "How long have you lived in Milan?",
      "How long you have lived in Milan?",
      "How long did you lived in Milan?"
    ],
    "correctIndex": 1,
    "explanation": "Per chiedere da quanto dura una situazione ancora vera si usa 'How long have you + participio passato'. Il presente semplice non regge questa costruzione, nella domanda l'ausiliare va prima del soggetto e dopo 'did' il verbo non va al passato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q15",
    "prompt": "Choose the correct translation for 'Mia nonna sa suonare il pianoforte.'",
    "options": [
      "My grandmother can plays the piano.",
      "My grandmother can to play the piano.",
      "My grandmother knows play the piano.",
      "My grandmother can play the piano."
    ],
    "correctIndex": 3,
    "explanation": "'Can' è un verbo modale: non prende la -s della terza persona e il verbo che segue è alla forma base, senza 'to'. 'Knows play' è sbagliato: 'know' vuole 'how to' ('knows how to play').",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Modals of Ability and Permission",
    "theoryId": "modals-ability-permission"
  },
  {
    "id": "q16",
    "prompt": "Choose the correct translation for 'Cosa ha mangiato Marco ieri sera?'",
    "options": [
      "What did Marco ate last night?",
      "What Marco ate last night?",
      "What did Marco eat last night?",
      "What does Marco ate last night?"
    ],
    "correctIndex": 2,
    "explanation": "Nelle domande al Past Simple l'ordine è parola interrogativa + 'did' + soggetto + verbo base ('eat'). Dopo 'did' il verbo non si mette al passato, senza 'did' la domanda non è formata e 'does' è un presente.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q17",
    "prompt": "Choose the grammatically correct sentence:",
    "options": [
      "We have eaten pizza last Friday night.",
      "We ate pizza last Friday night.",
      "We eaten pizza last Friday night.",
      "We eat pizza last Friday night."
    ],
    "correctIndex": 1,
    "explanation": "Con 'last Friday night', un momento concluso nel passato, serve il Past Simple ('ate'). Il Present Perfect non si usa con indicazioni di tempo concluse, 'eaten' da solo è un participio senza ausiliare e 'eat' è un presente.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q18",
    "prompt": "Complete the sentence: 'In my building there are many students who _____ to university by bike.'",
    "options": [
      "go",
      "goes",
      "going",
      "to go"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase relativa il verbo si accorda con l'antecedente: 'students' è plurale, quindi 'who go'. 'Goes' è singolare e 'going' e 'to go' non sono forme coniugate.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q19",
    "prompt": "Complete the sentence: 'My sister _____ her driving test in 2019.'",
    "options": [
      "pass",
      "has passed",
      "passed",
      "is passing"
    ],
    "correctIndex": 2,
    "explanation": "Con un anno preciso nel passato ('in 2019') si usa il Past Simple: 'passed'. Il Present Perfect ('has passed') non ammette un anno concluso e le altre forme sono al presente.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q20",
    "prompt": "Complete the sentence: 'My umbrella is broken, so I need a new _____.'",
    "options": [
      "ones",
      "it",
      "a one",
      "one"
    ],
    "correctIndex": 3,
    "explanation": "Per non ripetere un nome singolare già detto si usa 'one': 'a new one' = 'a new umbrella'. 'Ones' è plurale, 'it' indicherebbe proprio l'ombrello rotto e 'a one' dopo 'new' è sbagliato perché l'articolo c'è già.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q21",
    "prompt": "Complete the sentence: 'The windows are open and I can hear music. Someone _____ at home.'",
    "options": [
      "must to be",
      "must be",
      "must is",
      "must being"
    ],
    "correctIndex": 1,
    "explanation": "Per una deduzione quasi certa si usa 'must + verbo base': 'must be at home'. Dopo un modale non si mette 'to', né il verbo coniugato ('is'), né la forma in -ing.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q22",
    "prompt": "Complete the sentence: 'My sister has lived in Turin _____ she started university.'",
    "options": [
      "for",
      "during",
      "since",
      "while"
    ],
    "correctIndex": 2,
    "explanation": "'Since' indica il punto di partenza di una situazione che dura ancora, anche seguito da una frase ('since she started'). 'For' vuole una durata (for three years), 'during' un nome e 'while' non si usa con il Present Perfect in questo senso.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q23",
    "prompt": "Complete the sentence: 'What time _____ the concert begin tomorrow?'",
    "options": [
      "is",
      "does",
      "do",
      "has"
    ],
    "correctIndex": 1,
    "explanation": "Per un evento programmato (orario di un concerto) si usa il Present Simple, che nelle domande vuole 'do/does'. 'The concert' è terza persona singolare, quindi 'does'. Con 'is' o 'has' il verbo 'begin' non starebbe in piedi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q24",
    "prompt": "Complete the sentence: 'When my uncle was young, he _____ run a marathon in under three hours, but now he can't.'",
    "options": [
      "could",
      "can",
      "is able to",
      "could to"
    ],
    "correctIndex": 0,
    "explanation": "Per un'abilità generale nel passato si usa 'could' + verbo base. 'Can' e 'is able to' sono presenti e non vanno con 'when he was young'; dopo un modale non si mette 'to' ('could to' è errato).",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Ability and Permission",
    "theoryId": "modals-ability-permission"
  },
  {
    "id": "q25",
    "prompt": "Combine the sentences correctly: 'I called Laura yesterday evening. She was cooking dinner.'",
    "options": [
      "I called Laura yesterday evening while she cooks dinner.",
      "I called Laura yesterday evening during she was cooking dinner.",
      "I called Laura yesterday evening while was cooking dinner.",
      "I called Laura yesterday evening while she was cooking dinner."
    ],
    "correctIndex": 3,
    "explanation": "'While' introduce l'azione in corso nel passato e vuole soggetto + Past Continuous ('she was cooking'). 'Cooks' è un presente che non si accorda con il passato, 'during' regge solo un nome e senza soggetto ('while was cooking') la frase è incompleta.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q26",
    "prompt": "Complete the sentence: 'My sister always does her homework very _____.'",
    "options": [
      "careful",
      "carefully",
      "carefulness",
      "care"
    ],
    "correctIndex": 1,
    "explanation": "Per descrivere come si fa un'azione serve un avverbio, che di solito si forma con -ly: 'carefully'. 'Careful' è un aggettivo, 'carefulness' e 'care' sono nomi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q27",
    "prompt": "Complete the sentence: 'Our teacher wants _____ to finish the project by Friday.'",
    "options": [
      "we",
      "our",
      "us",
      "ours"
    ],
    "correctIndex": 2,
    "explanation": "Dopo 'want' si usa il pronome complemento + infinito con 'to': 'wants us to finish'. 'We' è un pronome soggetto, 'our' è un aggettivo possessivo e 'ours' un pronome possessivo: nessuno dei tre può stare qui.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q28",
    "prompt": "Complete the sentence: 'I need to buy _____ apples for the cake.'",
    "options": [
      "a",
      "much",
      "an",
      "some"
    ],
    "correctIndex": 3,
    "explanation": "'Apples' è plurale e numerabile, quindi va bene 'some'. 'A' e 'an' vogliono un nome singolare e 'much' un nome non numerabile.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q29",
    "prompt": "Complete the sentence: 'We _____ a great film at the cinema last night.'",
    "options": [
      "saw",
      "see",
      "seen",
      "have seen"
    ],
    "correctIndex": 0,
    "explanation": "Con 'last night' si usa il Past Simple. 'See' è irregolare: il passato è 'saw', mentre 'seen' è il participio (serve un ausiliare). Il Present Perfect non va con un tempo concluso.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q30",
    "prompt": "Complete the sentence: 'The exam _____ at nine o'clock tomorrow, so don't be late.'",
    "options": [
      "start",
      "will starts",
      "starts",
      "starting"
    ],
    "correctIndex": 2,
    "explanation": "Per un orario fissato (l'inizio di un esame) in inglese si usa il Present Simple anche se si parla del futuro, con la -s per 'it' ('starts'). 'Start' manca della -s, 'will starts' è sbagliato perché dopo 'will' non c'è -s e 'starting' non è coniugato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q31",
    "prompt": "Choose the correct negative sentence:",
    "options": [
      "There isn't no sugar in my coffee.",
      "There isn't any sugar in my coffee.",
      "There aren't any sugar in my coffee.",
      "There is any sugar in my coffee."
    ],
    "correctIndex": 1,
    "explanation": "'Sugar' non è numerabile, quindi 'there isn't', non 'aren't'. Nelle frasi negative si usa 'any' ('isn't any'); 'isn't no' è una doppia negazione e 'any' non si usa in una frase affermativa.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q32",
    "prompt": "Complete the sentence: 'How long _____ your brother lived in London?'",
    "options": [
      "has",
      "have",
      "did",
      "is"
    ],
    "correctIndex": 0,
    "explanation": "Il Present Perfect si forma con have/has + participio passato. 'Your brother' è terza persona singolare, quindi 'has'. 'Have' non concorda con il soggetto, 'did' vorrebbe il verbo base e 'is' non si usa qui.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q33",
    "prompt": "Complete the sentence: 'Listen! Someone _____ at the door.'",
    "options": [
      "knocks",
      "knock",
      "knocked",
      "is knocking"
    ],
    "correctIndex": 3,
    "explanation": "'Listen!' indica che l'azione è in corso adesso: Present Continuous, 'is knocking'. Il presente semplice ('knocks') descrive abitudini, 'knock' manca della -s e 'knocked' è un passato.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q34",
    "prompt": "Complete the sentence: 'Who _____ the window in the kitchen?'",
    "options": [
      "did broke",
      "breaked",
      "broke",
      "has broke"
    ],
    "correctIndex": 2,
    "explanation": "Quando 'who' è il soggetto della domanda non si usa 'did': il verbo va direttamente al passato ('Who broke...?'). 'Break' è irregolare, quindi 'breaked' non esiste; 'did broke' e 'has broke' sono forme errate.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q35",
    "prompt": "Choose the correct translation for 'Questa è la città più bella che io abbia mai visitato.'",
    "options": [
      "This is the more beautiful city I have ever visited.",
      "This is the most beautiful city I have ever visited.",
      "This is the beautifullest city I have ever visited.",
      "This is the most beautifully city I have ever visited."
    ],
    "correctIndex": 1,
    "explanation": "'Beautiful' è un aggettivo lungo: il superlativo si fa con 'the most + aggettivo'. 'More' è un comparativo, '-est' non si aggiunge ad aggettivi lunghi e 'beautifully' è un avverbio, non può stare davanti a un nome.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q36",
    "prompt": "Choose the correct translation for 'Mio fratello gioca a calcio ogni sabato.'",
    "options": [
      "My brother plays football every Saturday.",
      "My brother play football every Saturday.",
      "My brother is play football every Saturday.",
      "My brother plays to football every Saturday."
    ],
    "correctIndex": 0,
    "explanation": "Un'abitudine (ogni sabato) si esprime con il Present Simple, e alla terza persona singolare il verbo prende la -s ('plays'). Con gli sport si dice 'play football', senza preposizione, e non si mescola 'is' con il verbo base.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q37",
    "prompt": "Complete the sentence: 'What time _____ the film finish last night?'",
    "options": [
      "do",
      "have",
      "did",
      "was"
    ],
    "correctIndex": 2,
    "explanation": "Per una domanda su un momento passato si usa l'ausiliare 'did' seguito dal verbo base. 'Do' è presente, 'have' vorrebbe il participio e 'was' non si combina con 'finish'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q38",
    "prompt": "Complete the sentence: 'Excuse me, where is your friend _____? Is he Spanish?'",
    "options": [
      "of",
      "from",
      "by",
      "at"
    ],
    "correctIndex": 1,
    "explanation": "Per chiedere la provenienza si usa la preposizione 'from' ('Where is he from?'). 'Of', 'by' e 'at' non hanno questo significato.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q39",
    "prompt": "Complete the sentence: 'The shop has been closed _____ last Tuesday.'",
    "options": [
      "for",
      "since",
      "from",
      "until"
    ],
    "correctIndex": 1,
    "explanation": "Con il Present Perfect e un punto preciso nel tempo ('last Tuesday') si usa 'since'. 'For' vuole una durata (for three days), 'from' non regge il Present Perfect in questo modo e 'until' indica un limite finale.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q40",
    "prompt": "Choose the correct translation for 'Ieri non ho studiato per l'esame.'",
    "options": [
      "I didn't study for the exam yesterday.",
      "I didn't studied for the exam yesterday.",
      "I wasn't study for the exam yesterday.",
      "I don't studied for the exam yesterday."
    ],
    "correctIndex": 0,
    "explanation": "La negazione del Past Simple si fa con 'didn't' + verbo base: 'I didn't study'. Il passato lo porta già 'didn't', quindi 'studied' è un errore; 'wasn't' e 'don't' non sono corretti qui.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q41",
    "prompt": "Complete the sentence: 'The last ferry to the island _____ at 11 p.m., so we mustn't miss it.'",
    "options": [
      "leaving",
      "leave",
      "left",
      "leaves"
    ],
    "correctIndex": 3,
    "explanation": "Per un orario ufficiale (l'ultimo traghetto) si usa il Present Simple, con la -s per la terza persona ('leaves'). 'Leave' manca della -s, 'left' è un passato e 'leaving' non è coniugato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q42",
    "prompt": "Complete the sentence: 'He is the kindest teacher I have _____ met.'",
    "options": [
      "never",
      "always",
      "ever",
      "still"
    ],
    "correctIndex": 2,
    "explanation": "Dopo un superlativo con il Present Perfect si usa 'ever' ('il più gentile che abbia mai incontrato'). 'Never' contraddice il senso, 'always' e 'still' non hanno senso con 'met'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q43",
    "prompt": "Complete the sentence: 'Our team _____ the national cup in 2016.'",
    "options": [
      "won",
      "wins",
      "has won",
      "was winning"
    ],
    "correctIndex": 0,
    "explanation": "Con un anno preciso nel passato serve il Past Simple: 'won'. 'Wins' è un presente, 'has won' non si usa con un anno concluso e 'was winning' indicherebbe un'azione in corso.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q44",
    "prompt": "Choose the correct translation for 'Hai già conosciuto il nuovo professore?'",
    "options": [
      "Did you already met the new professor?",
      "Have you already met the new professor?",
      "Have you already meet the new professor?",
      "Are you already meeting the new professor?"
    ],
    "correctIndex": 1,
    "explanation": "Per un'esperienza senza tempo preciso si usa il Present Perfect: 'Have you already met...?' con il participio 'met'. Dopo 'did' il verbo andrebbe alla forma base, 'meet' non è un participio e 'are you meeting' parla di un incontro in corso.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q45",
    "prompt": "Choose the correct translation for 'Lavoro qui da tre anni.'",
    "options": [
      "I have worked here for three years.",
      "I work here since three years.",
      "I have worked here since three years.",
      "I am working here for three years."
    ],
    "correctIndex": 0,
    "explanation": "Una situazione iniziata nel passato e ancora in corso si esprime con il Present Perfect. Con una durata (tre anni) si usa 'for', mentre 'since' vuole un punto di partenza. In italiano si dice 'lavoro', ma in inglese il presente semplice non va con 'for/since'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q46",
    "prompt": "Choose the correct translation for 'Mi piace la macchina di Paolo.'",
    "options": [
      "I like Paolo car.",
      "I like the car's Paolo.",
      "I like Paolo's car.",
      "I'm like Paolo's car."
    ],
    "correctIndex": 2,
    "explanation": "Il possesso si esprime con nome + 's ('Paolo's car'), senza articolo davanti. Senza 's manca il possessivo, l'ordine inverso è sbagliato e 'I'm like' non significa 'mi piace' (si dice 'I like').",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q47",
    "prompt": "Complete the sentence: 'In my town _____ are three cinemas.'",
    "options": [
      "It",
      "This",
      "That",
      "There"
    ],
    "correctIndex": 3,
    "explanation": "Per dire che qualcosa esiste si usa 'there is/there are'. 'It', 'this' e 'that' non introducono un'esistenza e non vanno con 'are' in questa frase.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q48",
    "prompt": "Complete the sentence: 'My parents _____ dinner in the kitchen at the moment.'",
    "options": [
      "are cooking",
      "cook",
      "cooking",
      "cooks"
    ],
    "correctIndex": 0,
    "explanation": "'At the moment' indica un'azione in corso adesso, quindi Present Continuous: 'are' + verbo in -ing. 'Cook' e 'cooks' sono presenti semplici (abitudini) e 'cooking' da solo non ha l'ausiliare.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q49",
    "prompt": "Choose the correct sentence:",
    "options": [
      "If the weather will be nice tomorrow, we go to the beach.",
      "If the weather is nice tomorrow, we would go to the beach.",
      "If the weather is nice tomorrow, we will go to the beach.",
      "If the weather be nice tomorrow, we will go to the beach."
    ],
    "correctIndex": 2,
    "explanation": "Il primo condizionale si forma con 'if + Present Simple' e 'will + verbo base' nella principale. Nella frase con 'if' non si mette 'will', 'would' appartiene al secondo condizionale e 'be' senza 'is' non è corretto.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q50",
    "prompt": "Complete the sentence: 'She _____ learning Chinese since she was twelve.'",
    "options": [
      "is",
      "has been",
      "was",
      "had been"
    ],
    "correctIndex": 1,
    "explanation": "'Since' con un punto di partenza nel passato e un'azione ancora in corso richiede il Present Perfect Continuous: 'has been learning'. 'Is' e 'was' non reggono 'since', e 'had been' si usa solo se c'è un altro momento passato di riferimento.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q51",
    "prompt": "Complete the sentence: 'What _____ for dinner last night?'",
    "options": [
      "did you cook",
      "you cooked",
      "did you cooked",
      "are you cooking"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande al Past Simple si usa 'did + soggetto + verbo base': 'What did you cook...?'. Senza 'did' la domanda non è formata, dopo 'did' il verbo non va al passato e 'are you cooking' è un presente.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q52",
    "prompt": "Choose the correct sentence for comparing two phones:",
    "options": [
      "This phone is more much cheaper than that one.",
      "This phone is very cheaper than that one.",
      "This phone is much cheaper as that one.",
      "This phone is much cheaper than that one."
    ],
    "correctIndex": 3,
    "explanation": "Per rafforzare un comparativo si mette 'much' davanti ('much cheaper') e il secondo termine si introduce con 'than'. 'Very' non si usa con i comparativi, 'more much' è nell'ordine sbagliato e 'as' non va con il comparativo.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q53",
    "prompt": "Complete the sentence: 'Anna is ill. She _____ in bed since Sunday.'",
    "options": [
      "was",
      "is",
      "has been",
      "had been"
    ],
    "correctIndex": 2,
    "explanation": "'Since Sunday' collega il passato al presente, quindi serve il Present Perfect: 'has been'. 'Was' e 'is' non vanno con 'since' e 'had been' ha bisogno di un altro momento passato di riferimento.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q54",
    "prompt": "Complete the sentence: 'The Moon _____ around the Earth every 27 days.'",
    "options": [
      "go",
      "goes",
      "went",
      "is going"
    ],
    "correctIndex": 1,
    "explanation": "Per un fatto che è sempre vero si usa il Present Simple, con la -s alla terza persona singolare: 'the Moon goes'. 'Go' manca della -s, 'went' è un passato e 'is going' descrive un'azione in corso, non un fatto ripetuto 'ogni 27 giorni'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q55",
    "prompt": "Complete the sentence: 'Where is Paolo?' - 'He has _____ to the supermarket. He'll be back in ten minutes.'",
    "options": [
      "been",
      "go",
      "went",
      "gone"
    ],
    "correctIndex": 3,
    "explanation": "'Has gone to' significa che è andato e non è ancora tornato; 'has been to' vuol dire che c'è stato ed è tornato. Qui Paolo non c'è ancora, quindi 'gone'. 'Go' e 'went' non sono participi passati.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q56",
    "prompt": "Complete the sentence: 'Are they _____ the match on TV?'",
    "options": [
      "watching",
      "watch",
      "watched",
      "watches"
    ],
    "correctIndex": 0,
    "explanation": "L'ausiliare 'are' introduce il Present Continuous, che vuole la forma in -ing: 'Are they watching...?'. Le altre forme non vanno dopo 'are'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q57",
    "prompt": "Choose the correct translation for 'Hai mai suonato la chitarra?'",
    "options": [
      "Did you ever played the guitar?",
      "Are you ever played the guitar?",
      "Have you ever played the guitar?",
      "Have you never played the guitar?"
    ],
    "correctIndex": 2,
    "explanation": "Per chiedere di un'esperienza di vita si usa il Present Perfect con 'ever': 'Have you ever played...?'. 'Did you ever played' ha il verbo al passato dopo 'did', 'are' non forma questo tempo e 'never' significa 'non... mai', non 'mai' in una domanda.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q58",
    "prompt": "Complete the sentence: 'The plane _____ just landed.'",
    "options": [
      "have",
      "has",
      "is",
      "did"
    ],
    "correctIndex": 1,
    "explanation": "'Just' si usa tipicamente con il Present Perfect: 'has just landed'. 'The plane' è singolare, quindi 'has' e non 'have'; 'is' e 'did' non si combinano con il participio 'landed' in questo modo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q59",
    "prompt": "Choose the correct translation for 'Marta non ha ancora risposto alla mia email.'",
    "options": [
      "Marta hasn't answered my email yet.",
      "Marta haven't answered my email yet.",
      "Marta doesn't answer my email yet.",
      "Marta hasn't answer my email yet."
    ],
    "correctIndex": 0,
    "explanation": "Per qualcosa di atteso che non è ancora successo si usa il Present Perfect negativo con 'yet': 'hasn't answered'. Con 'Marta' serve 'hasn't' (non 'haven't'), il verbo deve essere al participio, e il presente semplice non esprime 'non ancora'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q60",
    "prompt": "Complete the sentence: '_____ your parents ever visited Scotland?'",
    "options": [
      "Has",
      "Did",
      "Are",
      "Have"
    ],
    "correctIndex": 3,
    "explanation": "Il Present Perfect si forma con have/has + participio. 'Your parents' è plurale, quindi 'Have'. 'Has' non concorda, 'did' vorrebbe il verbo base e 'are' non forma questo tempo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q61",
    "prompt": "Translate 'Lui vive qui da dieci anni.'",
    "options": [
      "He has lived here for ten years.",
      "He is living here since ten years.",
      "He lived here since ten years.",
      "He have lived here for ten years."
    ],
    "correctIndex": 0,
    "explanation": "Se un'azione iniziata nel passato continua ancora oggi (\"vive qui da dieci anni\") si usa il Present Perfect, non il presente. Dopo \"da\" con un periodo di tempo (dieci anni) in inglese si usa 'for'; 'since' vuole un punto di partenza preciso. 'He have' è sbagliato perché con 'he' serve 'has'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect"
  },
  {
    "id": "q62",
    "prompt": "Translate 'Ci sono molte macchine per strada oggi.'",
    "options": [
      "There are many cars on the street today.",
      "They are many cars on the street today.",
      "There is many cars on the street today.",
      "There have many cars on the street today."
    ],
    "correctIndex": 0,
    "explanation": "Per dire che qualcosa esiste o è presente, con un nome plurale (many cars) si usa 'There are'. 'They are' significa \"loro sono\" e non traduce \"ci sono\"; 'There is' e 'There have' non vanno con il plurale.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q63",
    "prompt": "Complete the sentence: '_____ any milk in the fridge?'",
    "options": [
      "Is there",
      "Are there",
      "There is",
      "There are"
    ],
    "correctIndex": 0,
    "explanation": "'Milk' è un nome non numerabile, quindi singolare: la domanda si fa con 'Is there'. Nella domanda l'ordine si inverte (Is there...?), per cui 'There is' e 'There are' sono forme affermative e non vanno qui.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q64",
    "prompt": "Translate 'Non c'è nessun problema.'",
    "options": [
      "There is no problem.",
      "There isn't no problem.",
      "There are no problem.",
      "There have no problem."
    ],
    "correctIndex": 0,
    "explanation": "\"Non c'è nessun problema\" si dice 'There is no problem': 'no' contiene già la negazione, quindi non si aggiunge 'isn't' (doppia negazione). 'There are' non va con 'problem', che è singolare, e 'there have' non esiste: \"c'è/ci sono\" si traduce con 'there is/are'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q65",
    "prompt": "Complete the sentence: '_____ some apples on the table.'",
    "options": [
      "There are",
      "There is",
      "They are",
      "It is"
    ],
    "correctIndex": 0,
    "explanation": "'Some apples' è plurale, quindi si dice 'There are some apples'. 'There is' è per il singolare, mentre 'They are' e 'It is' non servono a dire che qualcosa si trova da qualche parte.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q66",
    "prompt": "Translate 'C'è un cane nel giardino?'",
    "options": [
      "Is there a dog in the garden?",
      "Are there a dog in the garden?",
      "There is a dog in the garden?",
      "Does there a dog in the garden?"
    ],
    "correctIndex": 0,
    "explanation": "La domanda con \"c'è\" si forma invertendo: 'Is there a dog...?'. 'Are there' è plurale e non va con 'a dog', 'There is...?' non inverte, e 'Does there' non esiste perché 'there is' non usa 'do'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q67",
    "prompt": "Complete the sentence: 'I _____ to the cinema yesterday.'",
    "options": [
      "went",
      "go",
      "am going",
      "have gone"
    ],
    "correctIndex": 0,
    "explanation": "'Yesterday' indica un momento finito nel passato, quindi serve il Past Simple: 'went' (passato irregolare di 'go'). 'Go' e 'am going' sono presenti, e il Present Perfect ('have gone') non si usa con un tempo preciso come 'yesterday'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q68",
    "prompt": "Translate 'Non hanno studiato per l'esame.'",
    "options": [
      "They didn't study for the exam.",
      "They don't studied for the exam.",
      "They wasn't study for the exam.",
      "They haven't study for the exam."
    ],
    "correctIndex": 0,
    "explanation": "La negazione del Past Simple si forma con 'didn't' + verbo base (study), senza -ed: 'They didn't study'. In 'don't studied' e 'haven't study' il verbo o l'ausiliare sono sbagliati, e 'wasn't' non si usa con 'they'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q69",
    "prompt": "Complete the sentence: '_____ you see the football match last night?'",
    "options": [
      "Did",
      "Do",
      "Have",
      "Were"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande al Past Simple l'ausiliare è 'Did' e il verbo resta alla forma base (Did you see...?). 'Do' è presente, 'Have' vorrebbe il participio passato (seen) e 'Were' non si usa con 'see'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q70",
    "prompt": "Translate 'Lei ha comprato un nuovo telefono la settimana scorsa.'",
    "options": [
      "She bought a new phone last week.",
      "She buys a new phone last week.",
      "She buyed a new phone last week.",
      "She have bought a new phone last week."
    ],
    "correctIndex": 0,
    "explanation": "'Last week' indica un momento passato concluso, quindi si usa il Past Simple; 'buy' è irregolare e fa 'bought' ('buyed' non esiste). 'Buys' è un presente e 'have bought' (Present Perfect) non si usa con 'last week'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q71",
    "prompt": "Complete the sentence: 'We _____ very tired after the trip.'",
    "options": [
      "were",
      "was",
      "did be",
      "have been"
    ],
    "correctIndex": 0,
    "explanation": "Il Past Simple di 'to be' con 'we' è 'were' (was è solo per I/he/she/it). 'Did be' non esiste, perché 'be' non usa 'did' qui, e 'have been' non è un passato semplice.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q72",
    "prompt": "Translate 'Quando sei arrivato?'",
    "options": [
      "When did you arrive?",
      "When you arrived?",
      "When do you arrive?",
      "When have you arrived?"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande con una parola interrogativa al Past Simple: parola interrogativa + did + soggetto + verbo base (When did you arrive?). Senza 'did' la frase è sbagliata, e 'do' o 'have' non corrispondono al passato semplice.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple"
  },
  {
    "id": "q73",
    "prompt": "Complete the sentence: 'Please be quiet, I _____.'",
    "options": [
      "am working",
      "work",
      "working",
      "am work"
    ],
    "correctIndex": 0,
    "explanation": "\"Please be quiet\" indica che l'azione si sta svolgendo ora, quindi serve il Present Continuous: am/is/are + verbo in -ing (I am working). 'Working' da solo manca di 'am', 'work' è il presente semplice e 'am work' non è una forma corretta.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q74",
    "prompt": "Translate 'Cosa stanno facendo?'",
    "options": [
      "What are they doing?",
      "What do they do?",
      "What they are doing?",
      "What are they do?"
    ],
    "correctIndex": 0,
    "explanation": "La domanda nel Present Continuous è: parola interrogativa + are/is + soggetto + verbo in -ing (What are they doing?). 'What do they do?' chiede cosa fanno di solito (professione o abitudine), mentre gli altri due ordinano male la frase o usano 'do' senza -ing.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q75",
    "prompt": "Complete the sentence: 'She _____ to music at the moment.'",
    "options": [
      "is listening",
      "listens",
      "listening",
      "listen"
    ],
    "correctIndex": 0,
    "explanation": "'At the moment' indica un'azione in corso ora: serve il Present Continuous, 'She is listening'. 'Listens' è per le abitudini, mentre 'listening' senza 'is' e 'listen' senza -s non sono frasi corrette.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q76",
    "prompt": "Translate 'Non sto leggendo un libro, sto guardando la TV.'",
    "options": [
      "I'm not reading a book, I'm watching TV.",
      "I don't read a book, I watch TV.",
      "I'm not read a book, I'm watch TV.",
      "I not reading a book, I watching TV."
    ],
    "correctIndex": 0,
    "explanation": "Per due azioni in corso adesso si usa il Present Continuous: 'I'm not reading, I'm watching'. Il presente semplice ('I don't read') esprime un'abitudine; 'not read' e 'I not reading' mancano dell'ausiliare corretto.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q77",
    "prompt": "Complete the sentence: '_____ it raining outside?'",
    "options": [
      "Is",
      "Does",
      "Are",
      "Do"
    ],
    "correctIndex": 0,
    "explanation": "Il Present Continuous si forma con 'to be' + -ing (it is raining), quindi la domanda comincia con 'Is it raining...?'. Con 'it' non vanno 'Does' e 'Do' (che vorrebbero il verbo base), né 'Are' (che va con you/we/they).",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q78",
    "prompt": "Complete the sentence: 'If you study hard, you _____ the exam.'",
    "options": [
      "will pass",
      "will passing",
      "would pass",
      "passed"
    ],
    "correctIndex": 0,
    "explanation": "Nel First Conditional (condizione reale e possibile) si usa if + presente semplice nella frase con 'if' e 'will' + verbo base nella principale: 'you will pass'. 'Would pass' è per situazioni ipotetiche, 'passed' è un passato e 'will passing' è sbagliato perché dopo 'will' serve il verbo base.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q79",
    "prompt": "Translate 'Se piove, non andremo in spiaggia.'",
    "options": [
      "If it rains, we won't go to the beach.",
      "If it will rain, we don't go to the beach.",
      "If it rain, we won't go to the beach.",
      "If it rains, we didn't go to the beach."
    ],
    "correctIndex": 0,
    "explanation": "Nel First Conditional il verbo dopo 'if' è al presente (it rains) e la principale ha 'will' (we won't go). 'If it will rain' è sbagliato perché dopo 'if' non si usa 'will', 'it rain' manca della -s e 'didn't' è un passato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q80",
    "prompt": "Complete the sentence: 'I will call you if I _____ any news.'",
    "options": [
      "hear",
      "will hear",
      "heard",
      "hearing"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'if' si usa il presente semplice anche se si parla del futuro: 'if I hear'. 'Will hear' dopo 'if' è un errore tipico, mentre 'heard' e 'hearing' non sono le forme richieste.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q81",
    "prompt": "Translate 'Cosa farai se perdi il treno?'",
    "options": [
      "What will you do if you miss the train?",
      "What do you do if you will miss the train?",
      "What would you do if you miss the train?",
      "What will you do if you missed the train?"
    ],
    "correctIndex": 0,
    "explanation": "La domanda del First Conditional ha 'will' nella principale e il presente semplice dopo 'if': 'What will you do if you miss the train?'. 'Would' e 'missed' appartengono a un'ipotesi irreale, e dopo 'if' non va 'will miss'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q82",
    "prompt": "Complete the sentence: 'If she _____ invite me, I won't go to the party.'",
    "options": [
      "doesn't",
      "don't",
      "won't",
      "didn't"
    ],
    "correctIndex": 0,
    "explanation": "Con 'she' (terza persona singolare) la negazione del presente semplice si fa con 'doesn't': 'If she doesn't invite me'. 'Don't' va con I/you/we/they, 'won't' non si usa dopo 'if' in questo caso e 'didn't' è un passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q83",
    "prompt": "Translate 'Se non ti sbrighi, faremo tardi.'",
    "options": [
      "If you don't hurry, we will be late.",
      "If you won't hurry, we are late.",
      "If you aren't hurry, we will be late.",
      "If you don't hurry, we would be late."
    ],
    "correctIndex": 0,
    "explanation": "Nel First Conditional: if + presente (anche negativo, 'don't hurry') e 'will' nella principale (we will be late). 'Won't hurry' dopo 'if' è sbagliato, 'aren't hurry' mescola 'to be' e un verbo, e 'would be' appartiene all'ipotesi irreale.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q84",
    "prompt": "Complete the sentence: 'Russia is the _____ country in the world.'",
    "options": [
      "largest",
      "larger",
      "most large",
      "more large"
    ],
    "correctIndex": 0,
    "explanation": "Il superlativo degli aggettivi corti si forma con 'the' + -est: 'the largest'. 'Larger' è un comparativo (serve 'than'), mentre 'most large' e 'more large' non si usano con un aggettivo corto.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q85",
    "prompt": "Translate 'L'inglese è più facile del cinese.'",
    "options": [
      "English is easier than Chinese.",
      "English is more easy than Chinese.",
      "English is easiest than Chinese.",
      "English is much easy than Chinese."
    ],
    "correctIndex": 0,
    "explanation": "Il comparativo di maggioranza di 'easy' è 'easier' (la -y diventa -ier), seguito da 'than'. 'More easy' non si usa con un aggettivo corto, 'easiest' è il superlativo e 'much easy' non è un comparativo.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q86",
    "prompt": "Complete the sentence: 'This book is _____ interesting than the last one.'",
    "options": [
      "more",
      "most",
      "much",
      "very"
    ],
    "correctIndex": 0,
    "explanation": "Con gli aggettivi lunghi (interesting) il comparativo si forma con 'more' + aggettivo + 'than'. 'Most' è il superlativo, 'much' e 'very' non formano un comparativo e non possono stare prima di 'interesting than'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q87",
    "prompt": "Translate 'È il film peggiore che abbia mai visto.'",
    "options": [
      "It's the worst movie I've ever seen.",
      "It's the worse movie I've ever seen.",
      "It's the baddest movie I've ever seen.",
      "It's the most bad movie I've ever seen."
    ],
    "correctIndex": 0,
    "explanation": "'Bad' ha il comparativo e il superlativo irregolari: 'worse' e 'the worst'. 'The worse' è un comparativo, mentre 'baddest' e 'most bad' non esistono in inglese standard.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q88",
    "prompt": "Complete the sentence: 'My brother is much _____ than me.'",
    "options": [
      "taller",
      "tall",
      "tallest",
      "more tall"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'much' serve un comparativo, e il comparativo di 'tall' è 'taller' (+ than). 'Tall' è la forma base, 'tallest' è il superlativo e 'more tall' non si usa con un aggettivo corto.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q89",
    "prompt": "Translate 'Questa è la città più costosa d'Europa.'",
    "options": [
      "This is the most expensive city in Europe.",
      "This is the more expensive city in Europe.",
      "This is the expensivest city in Europe.",
      "This is most expensive city in Europe."
    ],
    "correctIndex": 0,
    "explanation": "Con un aggettivo lungo (expensive) il superlativo si forma con 'the most': 'the most expensive city'. 'The more' è un comparativo, 'expensivest' non esiste e senza 'the' la frase è incompleta.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q90",
    "prompt": "Complete the sentence: 'I have been studying English _____ three years.'",
    "options": [
      "for",
      "since",
      "from",
      "during"
    ],
    "correctIndex": 0,
    "explanation": "Con un periodo di tempo (three years) si usa 'for'; 'since' vuole invece un punto di partenza (since 2020). 'From' e 'during' non si usano così con un'azione che dura fino ad ora.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time"
  },
  {
    "id": "q91",
    "prompt": "Translate 'Lavora in quella banca dal 2015.'",
    "options": [
      "He has worked in that bank since 2015.",
      "He works in that bank from 2015.",
      "He worked in that bank since 2015.",
      "He has worked in that bank for 2015."
    ],
    "correctIndex": 0,
    "explanation": "\"Dal 2015\" indica un punto di partenza preciso, quindi si usa 'since' con il Present Perfect: 'has worked ... since 2015'. 'From 2015' con il presente è scorretto, 'worked' al passato indica un lavoro finito e 'for 2015' è sbagliato perché 2015 non è una durata.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time"
  },
  {
    "id": "q92",
    "prompt": "Complete the sentence: 'She hasn't eaten anything _____ yesterday morning.'",
    "options": [
      "since",
      "for",
      "from",
      "until"
    ],
    "correctIndex": 0,
    "explanation": "'Yesterday morning' è un momento preciso nel passato, cioè un punto di partenza: si usa 'since' con il Present Perfect (hasn't eaten). 'For' vuole invece una durata (for two days), e 'from' e 'until' non vanno bene qui.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time"
  },
  {
    "id": "q93",
    "prompt": "Translate 'Stiamo aspettando da due ore.'",
    "options": [
      "We have been waiting for two hours.",
      "We are waiting since two hours.",
      "We have been waiting since two hours.",
      "We wait for two hours."
    ],
    "correctIndex": 0,
    "explanation": "\"Due ore\" è una durata, quindi si usa 'for': 'We have been waiting for two hours'. 'Since two hours' è un errore tipico, perché 'since' vuole un punto di partenza (since 8 o'clock). Il presente semplice 'We wait' non esprime \"da due ore\".",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time"
  },
  {
    "id": "q94",
    "prompt": "Complete the sentence: 'I haven't seen him _____ a long time.'",
    "options": [
      "for",
      "since",
      "during",
      "from"
    ],
    "correctIndex": 0,
    "explanation": "'A long time' è una durata, quindi si usa 'for' (I haven't seen him for a long time). 'Since' richiederebbe un punto di partenza (since Monday), mentre 'during' e 'from' non si usano in questa frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time"
  },
  {
    "id": "q95",
    "prompt": "Complete the sentence: 'He usually _____ up at 7 AM.'",
    "options": [
      "wakes",
      "wake",
      "is waking",
      "waked"
    ],
    "correctIndex": 0,
    "explanation": "'Usually' indica un'abitudine, quindi si usa il presente semplice; con 'he' il verbo prende la -s: 'wakes'. 'Wake' non ha la -s, 'is waking' è un'azione in corso e 'waked' non è un passato corretto.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q96",
    "prompt": "Translate 'I miei genitori non vivono a Londra.'",
    "options": [
      "My parents don't live in London.",
      "My parents doesn't live in London.",
      "My parents aren't live in London.",
      "My parents not live in London."
    ],
    "correctIndex": 0,
    "explanation": "Con un soggetto plurale (my parents) la negazione del presente semplice è 'don't' + verbo base. 'Doesn't' è solo per he/she/it, 'aren't live' mescola 'to be' e un verbo, e 'not live' manca dell'ausiliare.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q97",
    "prompt": "Complete the sentence: '_____ she like chocolate?'",
    "options": [
      "Does",
      "Do",
      "Is",
      "Has"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande al presente semplice con he/she/it l'ausiliare è 'Does' e il verbo resta alla forma base (Does she like...?). 'Do' va con I/you/we/they, 'Is' e 'Has' non si usano con 'like' in questo modo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q98",
    "prompt": "Translate 'Il treno parte alle 8 in punto.'",
    "options": [
      "The train leaves at 8 o'clock.",
      "The train leaving at 8 o'clock.",
      "The train leave at 8 o'clock.",
      "The train left at 8 o'clock."
    ],
    "correctIndex": 0,
    "explanation": "Gli orari e i programmi fissi (come quelli dei treni) si esprimono con il presente semplice: 'The train leaves at 8'. 'Leave' manca della -s, 'left' è un passato e 'leaving' da solo non è una frase corretta senza 'is'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q99",
    "prompt": "Complete the sentence: 'Water _____ at 100 degrees Celsius.'",
    "options": [
      "boils",
      "boil",
      "is boiling",
      "boiled"
    ],
    "correctIndex": 0,
    "explanation": "Le verità generali si esprimono con il presente semplice, e con un soggetto singolare ('water') il verbo prende la -s: 'boils'. 'Boil' manca della -s, 'is boiling' indica un'azione in corso e 'boiled' è un passato.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q100",
    "prompt": "Complete the sentence: 'This is my _____ car.' (The car belongs to my friend)",
    "options": [
      "friend's",
      "friends'",
      "friend",
      "friends"
    ],
    "correctIndex": 0,
    "explanation": "Per un solo possessore si aggiunge 's al nome singolare: 'my friend's car' (la macchina di un amico). 'Friends'' indicherebbe più amici, mentre 'friend' e 'friends' senza apostrofo non esprimono il possesso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q101",
    "prompt": "Translate 'Dov'è il computer di Marco?'",
    "options": [
      "Where is Marco's computer?",
      "Where is the Marco's computer?",
      "Where is Marcos' computer?",
      "Where is Marco computer?"
    ],
    "correctIndex": 0,
    "explanation": "Per le persone l'inglese usa il genitivo sassone ('s): 'Marco's computer'. Con 's non si mette l'articolo ('the Marco's' è sbagliato), 'Marcos'' è scritto male e 'Marco computer' manca del 's.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q102",
    "prompt": "Complete the sentence: 'Those are my _____ toys.' (The toys belong to my dogs)",
    "options": [
      "dogs'",
      "dog's",
      "dogs",
      "dog"
    ],
    "correctIndex": 0,
    "explanation": "I possessori sono più cani (plurale regolare in -s), quindi si aggiunge solo l'apostrofo: 'dogs''. 'Dog's' indica un solo cane, e 'dogs' e 'dog' senza apostrofo non esprimono il possesso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s",
    "extraOption": "of dogs"
  },
  {
    "id": "q103",
    "prompt": "Translate 'La borsa di Sarah è rossa.'",
    "options": [
      "Sarah's bag is red.",
      "The Sarah's bag is red.",
      "Sarahs bag is red.",
      "Sarah' bag is red."
    ],
    "correctIndex": 0,
    "explanation": "Per esprimere possesso con una persona si usa 's dopo il nome: 'Sarah's bag'. Con 's non si mette l'articolo ('the Sarah's' è sbagliato), 'Sarahs' non ha l'apostrofo e 'Sarah'' è scritto male per un nome singolare.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q104",
    "prompt": "Complete the sentence: 'We went to my _____ house yesterday.' (The house belongs to my parents)",
    "options": [
      "parents'",
      "parent's",
      "parents",
      "parent"
    ],
    "correctIndex": 0,
    "explanation": "'Parents' è un plurale regolare in -s, quindi il possesso si forma con il solo apostrofo finale: 'my parents' house'. 'Parent's' indicherebbe un solo genitore, mentre 'parents' e 'parent' senza apostrofo non esprimono il possesso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s",
    "extraOption": "parents's"
  },
  {
    "id": "q105",
    "prompt": "Complete the sentence: 'How _____ milk is left?'",
    "options": [
      "much",
      "many",
      "a lot of",
      "any"
    ],
    "correctIndex": 0,
    "explanation": "'Milk' è non numerabile, quindi nelle domande sulla quantità si usa 'How much'. 'How many' è per i nomi numerabili plurali, mentre 'a lot of' e 'any' non completano 'How ... milk'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers",
    "extraOption": "lot"
  },
  {
    "id": "q106",
    "prompt": "Translate 'Non ho molti amici.'",
    "options": [
      "I don't have many friends.",
      "I don't have much friends.",
      "I don't have a lot friends.",
      "I don't have many friend."
    ],
    "correctIndex": 0,
    "explanation": "'Friends' è numerabile plurale, e nelle frasi negative per \"molti\" si usa 'many': 'I don't have many friends'. 'Much' si usa con i nomi non numerabili, 'a lot friends' manca di 'of', e dopo 'many' il nome resta al plurale ('friend' è sbagliato).",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers",
    "extraOption": "I don't have a many friends."
  },
  {
    "id": "q107",
    "prompt": "Complete the sentence: 'There are _____ people at the concert.'",
    "options": [
      "a lot of",
      "much",
      "a lot",
      "many of"
    ],
    "correctIndex": 0,
    "explanation": "Nelle frasi affermative per una grande quantità si usa 'a lot of' + nome: 'a lot of people'. 'Much' non si usa così in una frase affermativa e con 'people', 'a lot' senza 'of' e 'many of' non funzionano davanti a un nome.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q108",
    "prompt": "Translate 'Quanto zucchero vuoi nel caffè?'",
    "options": [
      "How much sugar do you want in your coffee?",
      "How many sugar do you want in your coffee?",
      "How much of sugar do you want in your coffee?",
      "What much sugar do you want in your coffee?"
    ],
    "correctIndex": 0,
    "explanation": "'Sugar' è non numerabile, quindi \"quanto\" si dice 'How much' e il nome segue direttamente. 'How many' è per i numerabili, 'much of sugar' non è corretto e 'What much' non esiste.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q109",
    "prompt": "Complete the sentence: 'She has very _____ free time these days.'",
    "options": [
      "little",
      "few",
      "a few",
      "many"
    ],
    "correctIndex": 0,
    "explanation": "'Time' è non numerabile, quindi \"poco\" si dice 'little': 'very little free time'. 'Few' e 'a few' si usano solo con nomi numerabili plurali, e 'many' non va con un nome non numerabile.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q110",
    "prompt": "Translate 'Ci sono troppe macchine in questa città.'",
    "options": [
      "There are too many cars in this city.",
      "There is too much cars in this city.",
      "There are too much cars in this city.",
      "There are too many of cars in this city."
    ],
    "correctIndex": 0,
    "explanation": "'Cars' è numerabile plurale, quindi \"troppe\" si dice 'too many'. 'Too much' si usa con i nomi non numerabili, e 'There is' non va con un plurale. 'Too many of cars' è sbagliato: 'of' si mette solo davanti a un articolo o a un pronome ('too many of the cars').",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers",
    "extraOption": "There are too many car in this city."
  },
  {
    "id": "q111",
    "prompt": "Complete the sentence: 'Where _____ you born?'",
    "options": [
      "were",
      "was",
      "are",
      "did"
    ],
    "correctIndex": 0,
    "explanation": "\"Dove sei nato?\" si dice 'Where were you born?', perché 'be born' si usa al passato e con 'you' il passato di 'to be' è 'were'. 'Was' è per I/he/she/it, 'are' è un presente e 'did' non si usa con 'born'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "have"
  },
  {
    "id": "q112",
    "prompt": "Translate 'Da dove viene tuo fratello?'",
    "options": [
      "Where does your brother come from?",
      "Where do your brother come from?",
      "Where is your brother come from?",
      "Where does your brother comes from?"
    ],
    "correctIndex": 0,
    "explanation": "Con 'your brother' (terza persona singolare) la domanda al presente semplice usa 'does' e il verbo base: 'Where does your brother come from?'. 'Do' va con il plurale, 'is ... come' mescola due verbi e 'comes' dopo 'does' non è corretto (la -s è già in 'does').",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "Where comes your brother from?"
  },
  {
    "id": "q113",
    "prompt": "Complete the sentence: '_____ country are you from?'",
    "options": [
      "Which",
      "Whose",
      "Where",
      "How"
    ],
    "correctIndex": 0,
    "explanation": "'Which' si usa con un nome che segue ('Which country') per scegliere tra più possibilità. 'Where' e 'How' non possono essere seguiti direttamente da 'country', e 'Whose' chiede di chi è qualcosa.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q114",
    "prompt": "Translate 'Loro sono spagnoli?'",
    "options": [
      "Are they Spanish?",
      "Are they Spain?",
      "Do they Spanish?",
      "Is they Spanish?"
    ],
    "correctIndex": 0,
    "explanation": "Con il verbo 'to be' la domanda si fa invertendo: 'Are they Spanish?'. 'Spain' è il paese, mentre 'Spanish' è l'aggettivo di nazionalità. 'Do they Spanish' non ha un verbo adatto e 'Is they' non concorda.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "Are they from Spanish?"
  },
  {
    "id": "q115",
    "prompt": "Complete the sentence: '_____ is the capital of Italy?'",
    "options": [
      "What",
      "When",
      "How",
      "Who"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere un'informazione come \"qual è la capitale\" si usa 'What is...?'. 'When' chiede un momento, 'Who' una persona e 'How' un modo o una condizione: nessuno dei tre chiede il nome di una città.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q116",
    "prompt": "Translate 'Di dov'è Maria?'",
    "options": [
      "Where is Maria from?",
      "Where does Maria from?",
      "Where is from Maria?",
      "Where Maria is from?"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere la provenienza la forma standard è 'Where is Maria from?', con la preposizione in fondo. 'Where does Maria from' ha 'does' ma manca un verbo, 'Where is from Maria' ha l'ordine delle parole sbagliato e 'Where Maria is from' non ha l'inversione della domanda.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q117",
    "prompt": "Translate 'Questo è il libro più lungo che abbia mai letto.'",
    "options": [
      "This is the longest book I have ever read.",
      "This is the most long book I have ever read.",
      "This is the longer book I have ever read.",
      "This is longest book I have ever read."
    ],
    "correctIndex": 0,
    "explanation": "Il superlativo di un aggettivo corto (long) è 'the longest'. 'Most long' non si usa con un aggettivo corto, 'longer' è un comparativo e senza 'the' il superlativo è scorretto.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives",
    "extraOption": "This is the most longest book I have ever read."
  },
  {
    "id": "q118",
    "prompt": "Complete: 'My car is _____ than yours.'",
    "options": [
      "faster",
      "more fast",
      "fastest",
      "the fastest"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'than' si usa un comparativo, e il comparativo di 'fast' è 'faster'. 'More fast' non si usa con un aggettivo corto, mentre 'fastest' e 'the fastest' sono superlativi e non vanno con 'than'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives",
    "extraOption": "fast"
  },
  {
    "id": "q119",
    "prompt": "Translate 'Oggi è molto più caldo di ieri.'",
    "options": [
      "Today is much hotter than yesterday.",
      "Today is much more hot than yesterday.",
      "Today is very hotter than yesterday.",
      "Today is hotter that yesterday."
    ],
    "correctIndex": 0,
    "explanation": "Il comparativo di 'hot' è 'hotter' (si raddoppia la t) e si usa con 'than'. 'Much' rafforza il comparativo; 'much more hot' non è corretto con un aggettivo corto, 'very hotter' è sbagliato perché 'very' non va con i comparativi, e 'that' al posto di 'than' è un errore.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives",
    "extraOption": "Today is much more hotter than yesterday."
  },
  {
    "id": "q120",
    "prompt": "Complete: 'She is the _____ student in the class.'",
    "options": [
      "best",
      "better",
      "most good",
      "goodest"
    ],
    "correctIndex": 0,
    "explanation": "'Good' ha il comparativo e il superlativo irregolari: 'better' e 'the best'. 'Better' è un comparativo, mentre 'most good' e 'goodest' non esistono.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives",
    "extraOption": "most best"
  },
  {
    "id": "q121",
    "prompt": "Translate 'Sua sorella è meno socievole di lui.'",
    "options": [
      "His sister is less outgoing than him.",
      "His sister is least outgoing than him.",
      "His sister is not outgoing than him.",
      "His sister is minor outgoing than him."
    ],
    "correctIndex": 0,
    "explanation": "Per il comparativo di minoranza si usa 'less' + aggettivo + 'than': 'less outgoing than him'. 'Least' è il superlativo, 'not outgoing than' non è una struttura comparativa e 'minor' non si usa così in inglese.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives",
    "extraOption": "His sister is lesser outgoing than him."
  },
  {
    "id": "q122",
    "prompt": "Complete: 'This exercise is _____ difficult than the previous one.'",
    "options": [
      "more",
      "much",
      "most",
      "very"
    ],
    "correctIndex": 0,
    "explanation": "Con un aggettivo lungo (difficult) il comparativo si forma con 'more' + aggettivo + 'than'. 'Most' è il superlativo, mentre 'much' e 'very' non formano un comparativo.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q123",
    "prompt": "Translate 'Questo è il posto meno costoso in città.'",
    "options": [
      "This is the least expensive place in town.",
      "This is the less expensive place in town.",
      "This is the not expensive place in town.",
      "This is the most cheap place in town."
    ],
    "correctIndex": 0,
    "explanation": "Il superlativo di minoranza si forma con 'the least' + aggettivo: 'the least expensive'. 'The less' è un comparativo, 'the not expensive' non è una forma grammaticale e 'most cheap' non è un superlativo corretto (si direbbe 'cheapest').",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives",
    "extraOption": "This is the most less expensive place in town."
  },
  {
    "id": "q124",
    "prompt": "Complete: 'He is _____ taller than his brother.'",
    "options": [
      "slightly",
      "a little of",
      "few",
      "small"
    ],
    "correctIndex": 0,
    "explanation": "Per attenuare un comparativo si usano avverbi come 'slightly' (leggermente), 'much' o 'a lot': 'slightly taller'. 'A little of' non è corretto, 'few' è per i nomi numerabili e 'small' è un aggettivo, non un avverbio.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives",
    "extraOption": "a lot of"
  },
  {
    "id": "q125",
    "prompt": "Complete: 'If I have time, I _____ you.'",
    "options": [
      "will help",
      "helping",
      "would help",
      "helped"
    ],
    "correctIndex": 0,
    "explanation": "Nel First Conditional (situazione reale) si usa if + presente semplice e 'will' + verbo base nella principale: 'I will help you'. 'Would help' e 'helped' sono per ipotesi irreali, mentre 'helping' non è una forma coniugata e da solo non può essere il verbo della frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "will to help"
  },
  {
    "id": "q126",
    "prompt": "Translate 'Se lei studierà, passerà il test.'",
    "options": [
      "If she studies, she will pass the test.",
      "If she will study, she will pass the test.",
      "If she study, she will pass the test.",
      "If she studied, she will pass the test."
    ],
    "correctIndex": 0,
    "explanation": "Nel First Conditional dopo 'if' si usa il presente semplice (if she studies) e nella principale 'will': 'she will pass'. 'If she will study' è un errore tipico, 'she study' manca della -s e 'studied' è un passato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "If she studies, she will to pass the test."
  },
  {
    "id": "q127",
    "prompt": "Complete: 'We won't go to the park if it _____.'",
    "options": [
      "rains",
      "will rain",
      "rain",
      "raining"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'if' si usa il presente semplice anche per il futuro: 'if it rains' (terza persona, -s). 'Will rain' dopo 'if' è sbagliato, 'rain' manca della -s e 'raining' non è una forma verbale completa.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "to rain"
  },
  {
    "id": "q128",
    "prompt": "Translate 'Cosa dirai se lui ti chiamerà?'",
    "options": [
      "What will you say if he calls you?",
      "What do you say if he will call you?",
      "What will you say if he will call you?",
      "What would you say if he calls you?"
    ],
    "correctIndex": 0,
    "explanation": "La domanda del First Conditional si forma con 'will' nella principale e il presente semplice dopo 'if': 'What will you say if he calls you?'. 'Will call' dopo 'if' è sbagliato, e 'would' con 'calls' mescola due tipi di condizionale.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "What you will say if he calls you?"
  },
  {
    "id": "q129",
    "prompt": "Complete: 'If they don't hurry, they _____ the bus.'",
    "options": [
      "will miss",
      "will missing",
      "would miss",
      "missed"
    ],
    "correctIndex": 0,
    "explanation": "Nella principale del First Conditional si usa 'will' + verbo base: 'they will miss the bus'. 'Will missing' è sbagliato perché dopo 'will' serve il verbo base, mentre 'would miss' e 'missed' sono forme dell'ipotesi irreale.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "would have missed"
  },
  {
    "id": "q130",
    "prompt": "Translate 'Se non mi aiuti, non finirò il progetto.'",
    "options": [
      "If you don't help me, I won't finish the project.",
      "If you won't help me, I don't finish the project.",
      "If you not help me, I won't finish the project.",
      "If you didn't help me, I won't finish the project."
    ],
    "correctIndex": 0,
    "explanation": "Nel First Conditional: 'if' + presente (don't help) e 'won't' + verbo base nella principale (I won't finish). 'Won't' dopo 'if' è sbagliato, 'you not help' manca di 'don't', e 'didn't' appartiene a un passato o a un'ipotesi irreale.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "If you don't help me, I didn't finish the project."
  },
  {
    "id": "q131",
    "prompt": "Complete: 'If she _____ the job, she will move to London.'",
    "options": [
      "gets",
      "get",
      "will get",
      "got"
    ],
    "correctIndex": 0,
    "explanation": "Con 'she' il presente semplice prende la -s: 'if she gets'. 'Get' manca della -s, 'will get' dopo 'if' è un errore tipico, e 'got' è un passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "getting"
  },
  {
    "id": "q132",
    "prompt": "Translate 'Gli parlerò se lo vedo.'",
    "options": [
      "I will talk to him if I see him.",
      "I talk to him if I will see him.",
      "I will talk to him if I will see him.",
      "I would talk to him if I see him."
    ],
    "correctIndex": 0,
    "explanation": "Nel First Conditional la principale usa 'will' (I will talk) e la frase con 'if' il presente (if I see him). 'If I will see' è sbagliato, e 'would talk' appartiene all'ipotesi irreale.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q133",
    "prompt": "Complete: 'Unless you _____, you won't succeed.'",
    "options": [
      "try",
      "will try",
      "don't try",
      "tried"
    ],
    "correctIndex": 0,
    "explanation": "'Unless' significa 'if ... not', quindi ha già un significato negativo e il verbo resta affermativo: 'Unless you try'. 'Don't try' darebbe un doppio negativo, 'will try' non si usa dopo 'unless' e 'tried' è un passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "trying"
  },
  {
    "id": "q134",
    "prompt": "Translate 'A meno che non piova, andremo a fare una passeggiata.'",
    "options": [
      "Unless it rains, we will go for a walk.",
      "Unless it doesn't rain, we will go for a walk.",
      "If it unless rains, we will go for a walk.",
      "Unless it will rain, we will go for a walk."
    ],
    "correctIndex": 0,
    "explanation": "'Unless' significa 'se non' e ha già il senso negativo, quindi il verbo che segue è affermativo al presente: 'Unless it rains'. 'Unless it doesn't rain' è un doppio negativo, 'If it unless rains' è mal costruita e 'unless it will rain' ha 'will' dopo la congiunzione.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "Unless it is not raining, we will go for a walk."
  },
  {
    "id": "q135",
    "prompt": "Complete: 'I will buy that car if it _____ too expensive.'",
    "options": [
      "isn't",
      "not is",
      "doesn't be",
      "aren't"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'if' il verbo è al presente e, con 'it', la negazione di 'to be' è 'isn't': 'if it isn't too expensive'. 'Not is' ha l'ordine sbagliato, 'doesn't be' non esiste (con 'to be' non si usa 'do') e 'aren't' non concorda con 'it'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional",
    "extraOption": "not be"
  },
  {
    "id": "q136",
    "prompt": "Complete: 'I usually go to bed _____ 11 PM.'",
    "options": [
      "at",
      "in",
      "on",
      "to"
    ],
    "correctIndex": 0,
    "explanation": "Con gli orari precisi (11 PM) si usa 'at'. 'In' si usa con mesi, anni e parti del giorno (in the morning), 'on' con i giorni e le date, e 'to' non è una preposizione di tempo qui.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time",
    "extraOption": "during"
  },
  {
    "id": "q137",
    "prompt": "Translate 'Non mi piace il caffè.'",
    "options": [
      "I don't like coffee.",
      "I'm not like coffee.",
      "I doesn't like coffee.",
      "I not like coffee."
    ],
    "correctIndex": 0,
    "explanation": "La negazione del presente semplice con 'I' si forma con 'don't' + verbo base: 'I don't like coffee'. 'I'm not like' mescola 'to be' con un verbo, 'I doesn't' usa l'ausiliare della terza persona e 'I not like' manca di 'do'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple",
    "extraOption": "I no like coffee."
  },
  {
    "id": "q138",
    "prompt": "Complete: 'They _____ to Paris next weekend.'",
    "options": [
      "are going",
      "goes",
      "went",
      "have gone"
    ],
    "correctIndex": 0,
    "explanation": "Per un programma già organizzato nel futuro ('next weekend') si usa il Present Continuous: 'They are going'. 'Goes' non concorda con 'they', mentre 'went' e 'have gone' sono tempi del passato.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous",
    "extraOption": "will going"
  },
  {
    "id": "q139",
    "prompt": "Translate 'Posso aiutarti?'",
    "options": [
      "Can I help you?",
      "Do I can help you?",
      "Am I help you?",
      "May I helping you?"
    ],
    "correctIndex": 0,
    "explanation": "I verbi modali come 'can' formano la domanda per inversione, senza 'do': 'Can I help you?', e il verbo che segue è alla forma base. 'Do I can' è sbagliato, 'Am I help' mescola 'to be' con un verbo e 'May I helping' vuole la forma base e non -ing.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Modals of Ability and Permission",
    "theoryId": "modals-ability-permission",
    "extraOption": "Can I to help you?"
  },
  {
    "id": "q140",
    "prompt": "Complete: 'She is interested in _____ Spanish.'",
    "options": [
      "learning",
      "to learn",
      "learn",
      "learned"
    ],
    "correctIndex": 0,
    "explanation": "Dopo una preposizione ('in') il verbo prende la forma in -ing: 'interested in learning'. L'infinito ('to learn' o 'learn') e il passato ('learned') non si usano dopo una preposizione.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives",
    "extraOption": "to learning"
  },
  {
    "id": "q141",
    "prompt": "Translate 'Dobbiamo andare ora.'",
    "options": [
      "We must go now.",
      "We have go now.",
      "We are must go now.",
      "We need going now."
    ],
    "correctIndex": 0,
    "explanation": "'Must' esprime obbligo ed è seguito dal verbo base senza 'to': 'We must go'. 'Have go' ha 'have' senza 'to' (servirebbe 'have to go'), 'are must' non esiste e 'need going' non è la struttura corretta.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "We must to go now."
  },
  {
    "id": "q142",
    "prompt": "Complete: 'I look forward _____ from you soon.'",
    "options": [
      "to hearing",
      "to hear",
      "hearing",
      "hear"
    ],
    "correctIndex": 0,
    "explanation": "In 'look forward to' la parola 'to' è una preposizione, quindi il verbo che segue è in -ing: 'to hearing'. L'infinito 'to hear' è l'errore tipico, e 'hearing' e 'hear' senza 'to' non completano l'espressione.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives",
    "extraOption": "for hearing"
  },
  {
    "id": "q143",
    "prompt": "Translate 'Ero molto stanco ieri sera.'",
    "options": [
      "I was very tired last night.",
      "I am very tired last night.",
      "I had very tired last night.",
      "I were very tired last night."
    ],
    "correctIndex": 0,
    "explanation": "\"Ero\" è un passato di 'to be': con 'I' si dice 'was'. 'Am' è un presente (e non va con 'last night'), 'had' non si usa con un aggettivo come 'tired', e 'were' è per you/we/they.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Past Simple",
    "theoryId": "past-simple",
    "extraOption": "I have been very tired last night."
  },
  {
    "id": "q144",
    "prompt": "Complete: 'This is the book _____ I borrowed from the library.'",
    "options": [
      "which",
      "who",
      "where",
      "what"
    ],
    "correctIndex": 0,
    "explanation": "Per riferirsi a una cosa (the book) si usa il pronome relativo 'which' (o 'that'). 'Who' è per le persone, 'where' per i luoghi e 'what' non si usa come pronome relativo dopo un nome.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses",
    "extraOption": "whose"
  },
  {
    "id": "q145",
    "prompt": "Translate 'Lei sa nuotare molto bene.'",
    "options": [
      "She can swim very well.",
      "She can swims very well.",
      "She knows swim very well.",
      "She knows to swim very well."
    ],
    "correctIndex": 0,
    "explanation": "Per l'abilità si usa 'can' + verbo base: 'She can swim'. 'Can' non prende mai la -s, e \"sapere\" nel senso di essere capace non si traduce con 'know' ('knows swim' e 'knows to swim' sono errori tipici).",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Modals of Ability and Permission",
    "theoryId": "modals-ability-permission",
    "extraOption": "She can to swim very well."
  },
  {
    "id": "q146",
    "prompt": "Complete: 'You _____ smoke in the hospital.'",
    "options": [
      "mustn't",
      "don't have to",
      "needn't",
      "aren't"
    ],
    "correctIndex": 0,
    "explanation": "'Mustn't' esprime un divieto: \"non si deve\" fumare. 'Don't have to' e 'needn't' dicono che non c'è bisogno, non che è vietato; 'aren't' non è una forma corretta con 'smoke'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "don't must"
  },
  {
    "id": "q147",
    "prompt": "Translate 'Non ho abbastanza soldi.'",
    "options": [
      "I don't have enough money.",
      "I not have enough money.",
      "I don't have enough to money.",
      "I don't have enough of money."
    ],
    "correctIndex": 0,
    "explanation": "Nella frase negativa si dice 'I don't have enough money', con 'enough' direttamente davanti al nome. 'I not have' è sbagliato (la negazione vuole 'don't'), 'enough to money' e 'enough of money' sono errori: davanti a un nome senza articolo non si mette né 'to' né 'of'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q148",
    "prompt": "Complete: 'That is _____ jacket.' (The jacket belongs to Tom)",
    "options": [
      "Tom's",
      "Toms'",
      "Tom",
      "Toms"
    ],
    "correctIndex": 0,
    "explanation": "Per il possesso di una persona al singolare si aggiunge 's al nome: 'Tom's jacket'. 'Toms'' e 'Toms' sono scritti male, e 'Tom' da solo non esprime il possesso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s",
    "extraOption": "of Tom"
  },
  {
    "id": "q149",
    "prompt": "Translate 'La casa dei miei nonni è grande.'",
    "options": [
      "My grandparents' house is big.",
      "My grandparent's house is big.",
      "The house my grandparents is big.",
      "My grandparents house is big."
    ],
    "correctIndex": 0,
    "explanation": "'Grandparents' è un plurale regolare in -s, quindi il possesso si forma con il solo apostrofo finale: 'my grandparents' house'. 'Grandparent's' indicherebbe un solo nonno, 'grandparents house' manca dell'apostrofo e 'the house my grandparents' non ha né 'of' né il possessivo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q150",
    "prompt": "Complete: 'I love _____ new song.' (The song of the band)",
    "options": [
      "the band's",
      "the bands'",
      "the band",
      "the bands"
    ],
    "correctIndex": 0,
    "explanation": "'Band' è singolare, quindi il possesso si forma con 's: 'the band's new song'. 'The bands'' indicherebbe più gruppi, mentre 'the band' e 'the bands' senza apostrofo non esprimono il possesso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q151",
    "prompt": "Translate 'I giocattoli dei bambini sono sparsi ovunque.'",
    "options": [
      "The children's toys are scattered everywhere.",
      "The childrens' toys are scattered everywhere.",
      "The children toys are scattered everywhere.",
      "The childrens toys are scattered everywhere."
    ],
    "correctIndex": 0,
    "explanation": "'Children' è un plurale irregolare che non finisce in -s, quindi il possessivo si forma con 's: 'the children's toys'. 'Childrens'' è sbagliato perché l'apostrofo dopo la -s si usa solo con i plurali regolari, 'childrens toys' è sbagliato in più perché manca l'apostrofo, e 'the children toys' manca del possessivo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q152",
    "prompt": "Complete: 'This is _____ desk.' (The desk belongs to the boss)",
    "options": [
      "the boss's",
      "the bosses'",
      "the boss",
      "the bosses"
    ],
    "correctIndex": 0,
    "explanation": "Il possessivo di un nome singolare si forma con 's, anche se il nome finisce in -s: 'the boss's desk'. 'The bosses'' è il possessivo di più capi, 'the boss' da solo non indica possesso e 'the bosses' è un plurale.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q153",
    "prompt": "Translate 'La macchina di James è blu.'",
    "options": [
      "James's car is blue.",
      "James car is blue.",
      "The James's car is blue.",
      "Jame's car is blue."
    ],
    "correctIndex": 0,
    "explanation": "Per dire 'di qualcuno' con una persona si usa il possessivo: nome + 's. I nomi che finiscono in -s, come James, prendono comunque 's ('James's car'). 'James car' non ha il possessivo, 'the James's' non vuole l'articolo e 'Jame's' cambia il nome.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q154",
    "prompt": "Complete: 'I went to the _____.' (The shop of the baker)",
    "options": [
      "baker's",
      "bakers'",
      "baker",
      "bakers"
    ],
    "correctIndex": 0,
    "explanation": "Per indicare un negozio o un'attività si usa il possessivo da solo, senza ripetere il nome: 'the baker's' (il negozio del panettiere, uno solo). 'Bakers'' sarebbe il possessivo plurale e 'baker' o 'bakers' non hanno l'apostrofo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q155",
    "prompt": "Translate 'È il compleanno di mia madre.'",
    "options": [
      "It's my mother's birthday.",
      "It's the birthday my mother.",
      "It's my mothers birthday.",
      "It's my mother birthday."
    ],
    "correctIndex": 0,
    "explanation": "Per i possessori che sono persone si usa 's davanti al nome posseduto: 'my mother's birthday'. Senza apostrofo ('mothers') si scrive un plurale, 'my mother birthday' non esprime il possesso e 'the birthday my mother' non ha né 'of' né il possessivo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q156",
    "prompt": "Complete: 'We are meeting at _____.' (The house of Paul)",
    "options": [
      "Paul's",
      "Pauls'",
      "Paul",
      "Pauls"
    ],
    "correctIndex": 0,
    "explanation": "Con i nomi di persona si usa il possessivo da solo per dire 'a casa di': 'at Paul's'. 'Pauls'' e 'Pauls' sono plurali sbagliati, e 'at Paul' significherebbe 'da Paul' senza la casa.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s",
    "extraOption": "of Paul"
  },
  {
    "id": "q157",
    "prompt": "Translate 'Le scarpe da donna sono al secondo piano.'",
    "options": [
      "Women's shoes are on the second floor.",
      "Womens' shoes are on the second floor.",
      "Woman's shoes are on the second floor.",
      "Women shoes are on the second floor."
    ],
    "correctIndex": 0,
    "explanation": "'Women' è un plurale irregolare (non finisce in -s), quindi il possessivo è 's: 'women's shoes'. 'Womens'' è scritto male, 'woman's' è singolare ('di una donna') e 'women shoes' non ha il possessivo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q158",
    "prompt": "Complete: 'The _____ room is down the hall.' (The room for teachers)",
    "options": [
      "teachers'",
      "teacher's",
      "teachers's",
      "teacher"
    ],
    "correctIndex": 0,
    "explanation": "'Teachers' è un plurale regolare in -s, quindi il possessivo si fa solo con l'apostrofo dopo la s: 'the teachers' room' (la stanza per gli insegnanti). 'Teacher's' sarebbe la stanza di un solo insegnante, 'teachers's' è una forma sbagliata e 'teacher' da solo non indica il possesso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q159",
    "prompt": "Translate 'Hai visto le chiavi di Anna?'",
    "options": [
      "Have you seen Anna's keys?",
      "Have you seen the Anna's keys?",
      "Have you seen Annas keys?",
      "Have you seen Anna keys?"
    ],
    "correctIndex": 0,
    "explanation": "Con un nome di persona singolare il possessivo è nome + 's: 'Anna's keys'. 'Annas keys' dimentica l'apostrofo, 'Anna keys' non esprime il possesso e 'the Anna's keys' non vuole l'articolo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q160",
    "prompt": "Complete: 'I have known him _____ 2010.'",
    "options": [
      "since",
      "for",
      "from",
      "in"
    ],
    "correctIndex": 0,
    "explanation": "'Since' si usa con un punto di inizio nel tempo (qui il 2010) insieme al present perfect: 'I have known him since 2010'. 'For' si usa con una durata (for ten years), mentre 'from' e 'in' non esprimono 'da quando'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time",
    "extraOption": "during"
  },
  {
    "id": "q161",
    "prompt": "Translate 'Lavorano qui da molti anni.'",
    "options": [
      "They have worked here for many years.",
      "They work here since many years.",
      "They have worked here since many years.",
      "They work here for many years."
    ],
    "correctIndex": 0,
    "explanation": "'Da molti anni' con un'azione ancora in corso si traduce con il present perfect e 'for' (una durata): 'have worked here for many years'. 'Since' vuole una data o un momento preciso, e il present simple non va con 'da' in questo senso.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Prepositions of Time",
    "theoryId": "prepositions-time",
    "extraOption": "They have worked here from many years."
  },
  {
    "id": "q162",
    "prompt": "Complete: 'They _____ tennis right now.'",
    "options": [
      "are playing",
      "play",
      "playing",
      "is playing"
    ],
    "correctIndex": 0,
    "explanation": "'Right now' indica un'azione che accade in questo momento, quindi serve il present continuous: am/is/are + verbo in -ing. Il soggetto 'they' vuole 'are'; 'is playing' è per la terza persona singolare e 'playing' da solo manca dell'ausiliare.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous",
    "extraOption": "are play"
  },
  {
    "id": "q163",
    "prompt": "Translate 'Perché stai piangendo?'",
    "options": [
      "Why are you crying?",
      "Why do you cry?",
      "Why you are crying?",
      "Why you cry?"
    ],
    "correctIndex": 0,
    "explanation": "Nella domanda al present continuous l'ordine è parola interrogativa + are/is + soggetto + verbo in -ing: 'Why are you crying?'. 'Why you are crying?' non inverte soggetto e ausiliare, e 'do you cry' parla di un'abitudine.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous",
    "extraOption": "Why are you cry?"
  },
  {
    "id": "q164",
    "prompt": "Complete: 'I _____ to the doctor tomorrow afternoon.'",
    "options": [
      "am going",
      "goes",
      "went",
      "going"
    ],
    "correctIndex": 0,
    "explanation": "Il present continuous si usa anche per un programma già deciso nel futuro vicino, con 'tomorrow afternoon': 'I am going to the doctor'. 'Goes' non concorda con 'I', 'went' è passato e 'going' senza 'am' non è completo.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q165",
    "prompt": "Translate 'Il sole sta splendendo.'",
    "options": [
      "The sun is shining.",
      "The sun shines.",
      "The sun shining.",
      "The sun are shining."
    ],
    "correctIndex": 0,
    "explanation": "Il sole che splende in questo momento è un'azione in corso: present continuous 'is shining'. 'Shines' indica un fatto abituale, 'shining' senza ausiliare è incompleto e 'are' non concorda con 'the sun'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q166",
    "prompt": "Complete: 'Look! The bus _____.'",
    "options": [
      "is coming",
      "comes",
      "coming",
      "come"
    ],
    "correctIndex": 0,
    "explanation": "'Look!' introduce qualcosa che sta succedendo ora sotto i nostri occhi, quindi present continuous: 'The bus is coming'. 'Comes' e 'come' sono present simple (abitudini) e 'coming' da solo non ha l'ausiliare.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous",
    "extraOption": "are coming"
  },
  {
    "id": "q167",
    "prompt": "Translate 'Non stiamo usando il computer adesso.'",
    "options": [
      "We aren't using the computer right now.",
      "We don't use the computer right now.",
      "We not using the computer right now.",
      "We isn't using the computer right now."
    ],
    "correctIndex": 0,
    "explanation": "La forma negativa del present continuous è soggetto + be + not + verbo in -ing: 'We aren't using'. 'We don't use' è present simple e non va con 'right now', mentre 'We not using' manca di 'are' e 'isn't' non concorda con 'we'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous",
    "extraOption": "We don't using the computer right now."
  },
  {
    "id": "q168",
    "prompt": "Complete: '_____ he watching TV?'",
    "options": [
      "Is",
      "Does",
      "Are",
      "Do"
    ],
    "correctIndex": 0,
    "explanation": "Per fare una domanda al present continuous si mette l'ausiliare 'be' prima del soggetto, ed è 'is' con 'he': 'Is he watching TV?'. 'Does' e 'Do' sono per il present simple e 'Are' è per 'you/we/they'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous",
    "extraOption": "Has"
  },
  {
    "id": "q169",
    "prompt": "Translate 'Sto cercando le mie chiavi.'",
    "options": [
      "I am looking for my keys.",
      "I am look for my keys.",
      "I am looking my keys.",
      "I looking for my keys."
    ],
    "correctIndex": 0,
    "explanation": "'Cercare' si traduce 'look for', e un'azione che sta avvenendo ora vuole il present continuous: 'I am looking for my keys'. 'Am look' non è corretto (dopo 'am' serve -ing), 'looking my keys' manca della preposizione 'for' e 'I looking' manca di 'am'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous",
    "extraOption": "I am looking for to my keys."
  },
  {
    "id": "q170",
    "prompt": "Complete: 'The kids _____ sleeping in their room.'",
    "options": [
      "are",
      "is",
      "do",
      "does"
    ],
    "correctIndex": 0,
    "explanation": "'Kids' è plurale, quindi l'ausiliare del present continuous è 'are': 'The kids are sleeping'. 'Is' è per il singolare, mentre 'do' e 'does' non si usano come ausiliari prima di un verbo in -ing.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q171",
    "prompt": "Complete: 'I have _____ finished my dinner.'",
    "options": [
      "already",
      "yet",
      "ever",
      "since"
    ],
    "correctIndex": 0,
    "explanation": "'Already' (già) si mette tra 'have' e il participio in una frase affermativa: 'I have already finished'. 'Yet' si usa nelle domande e nelle negative, 'ever' nelle domande sull'esperienza e 'since' vuole un punto di inizio nel tempo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect",
    "extraOption": "ago"
  },
  {
    "id": "q172",
    "prompt": "Translate 'È la prima volta che guido una macchina.'",
    "options": [
      "It's the first time I have driven a car.",
      "It's the first time I driving a car.",
      "It's the first time I have drove a car.",
      "It's the first time I has driven a car."
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'It's the first time' si usa il present perfect: 'It's the first time I have driven a car'. 'I driving' non ha l'ausiliare, 'have drove' usa il passato semplice al posto del participio ('driven') e 'I has' non concorda con 'I'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Perfect",
    "theoryId": "present-perfect",
    "extraOption": "It's the first time I am drive a car."
  },
  {
    "id": "q173",
    "prompt": "Complete: 'She _____ coffee every morning.'",
    "options": [
      "drinks",
      "drink",
      "is drinking",
      "drank"
    ],
    "correctIndex": 0,
    "explanation": "'Every morning' indica un'abitudine, quindi present simple, e alla terza persona singolare (she) si aggiunge -s: 'drinks'. 'Drink' non ha la -s, 'is drinking' descrive un'azione in corso e 'drank' è passato.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple",
    "extraOption": "drinking"
  },
  {
    "id": "q174",
    "prompt": "Translate 'Io lavoro in un ospedale.'",
    "options": [
      "I work in a hospital.",
      "I working in a hospital.",
      "I works in a hospital.",
      "I work to a hospital."
    ],
    "correctIndex": 0,
    "explanation": "Per un lavoro stabile si usa il present simple: 'I work in a hospital'. 'I works' sbaglia la forma (la -s è solo per he/she/it), 'I working' non ha l'ausiliare e 'work to' non è la preposizione giusta, che è 'in'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q175",
    "prompt": "Complete: 'They _____ play tennis on Sundays.'",
    "options": [
      "don't",
      "doesn't",
      "aren't",
      "isn't"
    ],
    "correctIndex": 0,
    "explanation": "Con il soggetto plurale 'they' la negazione del present simple è 'don't' + verbo base: 'They don't play'. 'Doesn't' è per he/she/it, mentre 'aren't' e 'isn't' sono forme di 'be' e non si usano prima di 'play'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q176",
    "prompt": "Translate 'Lui non capisce la domanda.'",
    "options": [
      "He doesn't understand the question.",
      "He don't understand the question.",
      "He isn't understand the question.",
      "He not understands the question."
    ],
    "correctIndex": 0,
    "explanation": "Con la terza persona singolare (he) la negazione del present simple è 'doesn't' + verbo base: 'He doesn't understand'. 'Don't' non concorda con 'he', 'isn't understand' mescola 'be' e verbo, e 'not understands' manca dell'ausiliare.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple",
    "extraOption": "He doesn't understands the question."
  },
  {
    "id": "q177",
    "prompt": "Complete: '_____ you speak English?'",
    "options": [
      "Do",
      "Are",
      "Does",
      "Is"
    ],
    "correctIndex": 0,
    "explanation": "Le domande al present simple si fanno con 'do/does' + soggetto + verbo base, e con 'you' si usa 'do': 'Do you speak English?'. 'Are' e 'Is' vogliono un aggettivo o un participio, e 'does' è per he/she/it.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q178",
    "prompt": "Translate 'Cosa significa questa parola?'",
    "options": [
      "What does this word mean?",
      "What means this word?",
      "What do this word mean?",
      "What is meaning this word?"
    ],
    "correctIndex": 0,
    "explanation": "In una domanda al present simple 'this word' è terza persona singolare, quindi 'does' + verbo base: 'What does this word mean?'. 'What means this word?' non ha l'ausiliare, 'do ... mean' non concorda e 'is meaning' non si usa con un verbo di stato come 'mean'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple",
    "extraOption": "What does mean this word?"
  },
  {
    "id": "q179",
    "prompt": "Complete: 'The sun _____ in the east.'",
    "options": [
      "rises",
      "rise",
      "is rising",
      "rose"
    ],
    "correctIndex": 0,
    "explanation": "Un fatto sempre vero si esprime con il present simple e, con 'the sun' (terza persona singolare), il verbo prende la -s: 'rises'. 'Rise' manca della -s, 'is rising' descrive un'azione in corso e 'rose' è passato.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q180",
    "prompt": "Translate 'Quante volte vai in palestra?'",
    "options": [
      "How often do you go to the gym?",
      "How often you go to the gym?",
      "How much time do you go to the gym?",
      "How many times you go to the gym?"
    ],
    "correctIndex": 0,
    "explanation": "'How often' chiede la frequenza e nella domanda al present simple serve 'do' + soggetto: 'How often do you go to the gym?'. Senza 'do' la frase è sbagliata, e 'how much time' e 'how many times' non sono le forme corrette qui.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple",
    "extraOption": "How often do you to go to the gym?"
  },
  {
    "id": "q181",
    "prompt": "Complete: 'My brother never _____ his room.'",
    "options": [
      "cleans",
      "clean",
      "is cleaning",
      "cleaned"
    ],
    "correctIndex": 0,
    "explanation": "Con gli avverbi di frequenza come 'never' si usa il present simple, e con 'my brother' (he) il verbo prende la -s: 'cleans'. 'Clean' non ha la -s, 'is cleaning' non va con 'never' e 'cleaned' è passato.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple",
    "extraOption": "cleaning"
  },
  {
    "id": "q182",
    "prompt": "Translate 'Lei ha due gatti e un cane.'",
    "options": [
      "She has two cats and a dog.",
      "She have two cats and a dog.",
      "She is having two cats and a dog.",
      "She got two cats and a dog."
    ],
    "correctIndex": 0,
    "explanation": "Alla terza persona singolare il verbo 'have' diventa 'has': 'She has two cats'. 'She have' è sbagliato, 'is having' non si usa per il possesso e 'got' da solo è passato, non presente.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q183",
    "prompt": "Complete: 'We _____ like spicy food.'",
    "options": [
      "don't",
      "doesn't",
      "not",
      "aren't"
    ],
    "correctIndex": 0,
    "explanation": "Con 'we' la negazione del present simple è 'don't' + verbo base: 'We don't like'. 'Doesn't' è per he/she/it, 'not' da solo non basta senza ausiliare e 'aren't' non si usa prima di 'like'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q184",
    "prompt": "Translate 'Il film inizia alle 20:30.'",
    "options": [
      "The movie starts at 8:30 PM.",
      "The movie starting at 8:30 PM.",
      "The movie start at 8:30 PM.",
      "The movie will starting at 8:30 PM."
    ],
    "correctIndex": 0,
    "explanation": "Gli orari di film, treni e simili si esprimono con il present simple: 'The movie starts at 8:30 PM'. 'Start' manca della -s, 'starting' senza 'is' non è un verbo completo e 'will starting' è una forma impossibile.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q185",
    "prompt": "Complete: 'Does he _____ in London?'",
    "options": [
      "live",
      "lives",
      "living",
      "lived"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'does' il verbo resta alla forma base, perché la -s della terza persona è già sull'ausiliare: 'Does he live'. 'Lives' ripeterebbe la -s, mentre 'living' e 'lived' non sono forme base.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q186",
    "prompt": "Complete: 'I have _____ money in my pocket.'",
    "options": [
      "some",
      "any",
      "many",
      "few"
    ],
    "correctIndex": 0,
    "explanation": "'Money' è un nome non numerabile e in una frase affermativa si usa 'some': 'I have some money'. 'Any' si usa di solito nelle domande e nelle negative, mentre 'many' e 'few' vogliono nomi numerabili.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q187",
    "prompt": "Translate 'Non ci sono mele.'",
    "options": [
      "There aren't any apples.",
      "There aren't some apples.",
      "There aren't no apples.",
      "There are any apples."
    ],
    "correctIndex": 0,
    "explanation": "Nelle frasi negative si usa 'any' con i nomi numerabili plurali: 'There aren't any apples'. 'Some' non va nella negativa, e 'aren't no' è una doppia negazione, mentre 'are any' non ha la negazione.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers",
    "extraOption": "There don't have any apples."
  },
  {
    "id": "q188",
    "prompt": "Complete: 'Do you have _____ questions?'",
    "options": [
      "any",
      "a",
      "much",
      "little"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande si usa normalmente 'any' con 'questions': 'Do you have any questions?'. 'A' non va con un plurale ('questions'), e 'much' e 'little' non vanno con un nome numerabile plurale.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q189",
    "prompt": "Translate 'Vorresti del tè?'",
    "options": [
      "Would you like some tea?",
      "Would you like to some tea?",
      "Do you would like some tea?",
      "Would you like many tea?"
    ],
    "correctIndex": 0,
    "explanation": "Nelle offerte e nelle richieste cortesi si usa 'some' anche nella domanda: 'Would you like some tea?'. 'Would you like to some' ha un 'to' di troppo, 'Do you would like' mette insieme due ausiliari e 'many' non va con 'tea', che è non numerabile.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q190",
    "prompt": "Complete: 'There are only a _____ students in the class.'",
    "options": [
      "few",
      "little",
      "much",
      "many"
    ],
    "correctIndex": 0,
    "explanation": "'Students' è numerabile plurale, quindi si usa 'a few' (alcuni): 'a few students'. 'Little' e 'much' vogliono nomi non numerabili, mentre 'a many' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q191",
    "prompt": "Translate 'Ho pochissimo tempo.'",
    "options": [
      "I have very little time.",
      "I have very few time.",
      "I have much little time.",
      "I have very small time."
    ],
    "correctIndex": 0,
    "explanation": "'Time' è non numerabile, quindi 'pochissimo' si dice 'very little': 'I have very little time'. 'Few' si usa con i numerabili plurali, 'much little' non esiste e 'very small time' non è un'espressione corretta.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q192",
    "prompt": "Complete: 'She reads a _____ of books.'",
    "options": [
      "lot",
      "many",
      "much",
      "some"
    ],
    "correctIndex": 0,
    "explanation": "L'espressione è 'a lot of' davanti a un nome: 'a lot of books'. 'Many of' e 'much of' hanno un altro uso e non si usano con 'a', mentre 'a some of' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q193",
    "prompt": "Translate 'Abbiamo mangiato troppa pizza.'",
    "options": [
      "We ate too much pizza.",
      "We ate too many pizza.",
      "We ate very much pizza.",
      "We ate a lot pizza."
    ],
    "correctIndex": 0,
    "explanation": "In questa frase 'pizza' è usata in senso generale come non numerabile, quindi 'too much': 'too much pizza'. 'Too many' si usa con i nomi numerabili plurali, 'very much' non va davanti a un nome e 'a lot pizza' manca di 'of'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers",
    "extraOption": "We ate too much of pizza."
  },
  {
    "id": "q194",
    "prompt": "Complete: 'How _____ apples do you want?'",
    "options": [
      "many",
      "much",
      "some",
      "any"
    ],
    "correctIndex": 0,
    "explanation": "'Apples' è numerabile plurale, quindi si chiede la quantità con 'How many': 'How many apples'. 'Much' si usa con i non numerabili, mentre 'some' e 'any' non si usano dopo 'how'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q195",
    "prompt": "Translate 'Non abbiamo comprato niente.'",
    "options": [
      "We didn't buy anything.",
      "We bought anything.",
      "We didn't buy nothing.",
      "We didn't buy some."
    ],
    "correctIndex": 0,
    "explanation": "Nella negativa con 'didn't' si usa 'anything': 'We didn't buy anything'. 'Nothing' dopo 'didn't' sarebbe una doppia negazione, 'bought anything' non ha la negazione e 'some' da solo manca del nome.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q196",
    "prompt": "Complete: 'Is there _____ good on TV?'",
    "options": [
      "anything",
      "anythings",
      "everything",
      "somethings"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande si usa di solito 'any-': 'Is there anything good on TV?'. 'Anything' e 'something' non hanno il plurale ('anythings', 'somethings' sono sbagliati) e 'everything' cambia il senso e non funziona con 'Is there...?' in questa frase.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q197",
    "prompt": "Complete: '_____ is that man?'",
    "options": [
      "Who",
      "What",
      "Which",
      "Where"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere l'identità di una persona si usa 'Who': 'Who is that man?'. 'What' si usa per le cose, 'Which' per scegliere in un gruppo e 'Where' chiede un luogo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q198",
    "prompt": "Translate 'Perché sei in ritardo?'",
    "options": [
      "Why are you late?",
      "Because are you late?",
      "Why you are late?",
      "Why do you late?"
    ],
    "correctIndex": 0,
    "explanation": "'Perché' in una domanda è 'Why', seguito da verbo + soggetto: 'Why are you late?'. 'Because' è la risposta e non si usa per chiedere, mentre 'Why you are' non inverte l'ordine e 'Why do you late' non è corretto con 'be'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q199",
    "prompt": "Complete: '_____ old are you?'",
    "options": [
      "How",
      "What",
      "Who",
      "Which"
    ],
    "correctIndex": 0,
    "explanation": "L'età si chiede con 'How old': 'How old are you?'. 'What old', 'Who old' e 'Which old' non esistono in questa domanda.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q200",
    "prompt": "Translate 'Quando è il tuo compleanno?'",
    "options": [
      "When is your birthday?",
      "Where is your birthday?",
      "What is your birthday?",
      "How is your birthday?"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere una data o un momento si usa 'When': 'When is your birthday?'. 'Where' chiede un luogo, 'What' chiederebbe qual è il compleanno come oggetto e 'How' chiede il modo o lo stato.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q201",
    "prompt": "Complete: '_____ do you live?'",
    "options": [
      "Where",
      "What",
      "How",
      "When"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere un luogo si usa 'Where': 'Where do you live?'. 'What' e 'How' non chiedono dove, e 'When' chiede il tempo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "Who"
  },
  {
    "id": "q202",
    "prompt": "Translate 'Come vai al lavoro?'",
    "options": [
      "How do you go to work?",
      "What do you go to work?",
      "Where do you go to work?",
      "Why do you go to work?"
    ],
    "correctIndex": 0,
    "explanation": "'Come' riferito al modo o al mezzo si dice 'How': 'How do you go to work?'. 'What' e 'Where' chiederebbero cosa e dove, e 'Why' chiederebbe il motivo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "Who do you go to work?"
  },
  {
    "id": "q203",
    "prompt": "Complete: '_____ is your favorite color?'",
    "options": [
      "What",
      "Whose",
      "Who",
      "How"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere qual è una preferenza si usa 'What': 'What is your favorite color?'. 'Whose' chiede di chi è una cosa, 'Who' chiede una persona e 'How' chiede il modo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "When"
  },
  {
    "id": "q204",
    "prompt": "Translate 'Di chi è questa borsa?'",
    "options": [
      "Whose bag is this?",
      "Who bag is this?",
      "Which bag is this?",
      "What bag is this?"
    ],
    "correctIndex": 0,
    "explanation": "'Di chi è' si dice 'Whose' + nome: 'Whose bag is this?'. 'Who bag' è sbagliato perché 'who' non si usa con un nome, mentre 'Which' e 'What' chiedono quale o cosa, non il proprietario.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "Whom bag is this?"
  },
  {
    "id": "q205",
    "prompt": "Complete: '_____ time does the movie start?'",
    "options": [
      "What",
      "Where",
      "Who",
      "How"
    ],
    "correctIndex": 0,
    "explanation": "L'ora si chiede con 'What time': 'What time does the movie start?'. 'Where' si usa per i luoghi, 'Who' per le persone e 'How time' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q206",
    "prompt": "Translate 'Quanto costa questo libro?'",
    "options": [
      "How much does this book cost?",
      "How many does this book cost?",
      "How price is this book?",
      "What cost this book?"
    ],
    "correctIndex": 0,
    "explanation": "Il prezzo si chiede con 'How much' e l'ausiliare 'does': 'How much does this book cost?'. 'How many' si usa con i numerabili, 'How price' non esiste e 'What cost this book' non ha l'ausiliare.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "How much costs this book?"
  },
  {
    "id": "q207",
    "prompt": "Complete: '_____ languages do you speak?'",
    "options": [
      "How many",
      "How much",
      "How often",
      "How long"
    ],
    "correctIndex": 0,
    "explanation": "'Languages' è numerabile plurale e si chiede il numero con 'How many': 'How many languages do you speak?'. 'How much' è per i non numerabili, 'How often' chiede la frequenza e 'How long' la durata.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins",
    "extraOption": "How far"
  },
  {
    "id": "q208",
    "prompt": "Complete: '_____ a big tree in the garden.'",
    "options": [
      "There is",
      "There are",
      "It is",
      "They are"
    ],
    "correctIndex": 0,
    "explanation": "'Tree' è singolare, quindi per dire 'c'è' si usa 'There is': 'There is a big tree'. 'There are' è per il plurale, mentre 'It is' e 'They are' non esprimono l'esistenza di qualcosa.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are",
    "extraOption": "There has"
  },
  {
    "id": "q209",
    "prompt": "Translate 'Ci sono tre sedie nella stanza.'",
    "options": [
      "There are three chairs in the room.",
      "They are three chairs in the room.",
      "There is three chairs in the room.",
      "Have three chairs in the room."
    ],
    "correctIndex": 0,
    "explanation": "'Chairs' è plurale, quindi 'ci sono' si traduce 'There are': 'There are three chairs'. 'They are' vuol dire 'sono' e non 'ci sono', 'There is' è singolare e 'Have' non si usa così.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are",
    "extraOption": "There have three chairs in the room."
  },
  {
    "id": "q210",
    "prompt": "Complete: '_____ any messages for me?'",
    "options": [
      "Are there",
      "Is there",
      "Do there",
      "Have there"
    ],
    "correctIndex": 0,
    "explanation": "In una domanda sull'esistenza di cose al plurale si usa 'Are there': 'Are there any messages for me?'. 'Is there' è singolare, mentre 'Do there' e 'Have there' non esistono.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are",
    "extraOption": "Has there"
  },
  {
    "id": "q211",
    "prompt": "Translate 'C'è un buon ristorante qui vicino?'",
    "options": [
      "Is there a good restaurant near here?",
      "Are there a good restaurant near here?",
      "There is a good restaurant near here?",
      "Does there a good restaurant near here?"
    ],
    "correctIndex": 0,
    "explanation": "Con un nome singolare ('a good restaurant') la domanda è 'Is there...?': 'Is there a good restaurant near here?'. 'Are there' è plurale, 'There is' senza inversione non fa la domanda e 'Does there' non esiste.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are",
    "extraOption": "Has there a good restaurant near here?"
  },
  {
    "id": "q212",
    "prompt": "Complete: 'There _____ a lot of people at the party.'",
    "options": [
      "were",
      "was",
      "are been",
      "is"
    ],
    "correctIndex": 0,
    "explanation": "'Past' e 'people' (plurale) vogliono 'There were': 'There were a lot of people'. 'Was' è per il singolare, 'are been' non esiste e 'is' è presente singolare.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q213",
    "prompt": "Translate 'Non c'era nessuno in casa.'",
    "options": [
      "There was nobody at home.",
      "There wasn't nobody at home.",
      "There were nobody at home.",
      "It was nobody at home."
    ],
    "correctIndex": 0,
    "explanation": "Al passato 'There was' si usa con 'nobody', che è singolare: 'There was nobody at home'. 'Wasn't nobody' è una doppia negazione, 'were' è plurale e 'It was' non esprime 'non c'era'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are",
    "extraOption": "There is nobody at home."
  },
  {
    "id": "q214",
    "prompt": "Complete: '_____ going to be a storm tomorrow.'",
    "options": [
      "There is",
      "There are",
      "They are",
      "There have"
    ],
    "correctIndex": 0,
    "explanation": "Per dire che qualcosa ci sarà si usa 'There is going to be': 'There is going to be a storm tomorrow'. 'There are' è plurale mentre 'a storm' è singolare, 'They are' non esprime l'esistenza e 'There have' non si usa con 'going to'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q215",
    "prompt": "Translate 'Ci sono dei biscotti nella scatola?'",
    "options": [
      "Are there any biscuits in the box?",
      "Is there a biscuits in the box?",
      "Are there much biscuits in the box?",
      "Do there any biscuits in the box?"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande sull'esistenza con un plurale si usa 'Are there' + 'any': 'Are there any biscuits in the box?'. 'Is there a' non va con un plurale, 'much' si usa solo con i nomi non numerabili e 'Do there' non esiste.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q216",
    "prompt": "Complete: '_____ a mistake in this exercise.'",
    "options": [
      "There is",
      "There are",
      "It is",
      "This is"
    ],
    "correctIndex": 0,
    "explanation": "'Mistake' è singolare, quindi 'c'è' si dice 'There is': 'There is a mistake in this exercise'. 'There are' è plurale, mentre 'It is' e 'This is' non esprimono l'esistenza.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q217",
    "prompt": "Complete: 'This is not my pen. It is _____.'",
    "options": [
      "yours",
      "your",
      "you",
      "yours'"
    ],
    "correctIndex": 0,
    "explanation": "Quando il possessivo sostituisce il nome ('your pen') si usa il pronome possessivo: 'It is yours'. 'Your' vuole un nome dopo di sé, 'you' non è possessivo e 'yours'' ha un apostrofo che non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "yourself"
  },
  {
    "id": "q218",
    "prompt": "Complete: '_____ car is parked outside.'",
    "options": [
      "Her",
      "Hers",
      "She",
      "Hers'"
    ],
    "correctIndex": 0,
    "explanation": "Davanti a un nome ('car') serve l'aggettivo possessivo: 'Her car'. 'Hers' si usa da solo senza nome, 'she' è un pronome soggetto e 'hers'' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q219",
    "prompt": "Complete: 'That house is _____.' (of us)",
    "options": [
      "ours",
      "our",
      "we",
      "us"
    ],
    "correctIndex": 0,
    "explanation": "'That house is ___' non ha un nome dopo lo spazio, quindi serve il pronome possessivo 'ours'. 'Our' vuole un nome dopo di sé, mentre 'we' e 'us' non sono possessivi.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "ourselves"
  },
  {
    "id": "q220",
    "prompt": "Complete: 'Is this book _____?' (of him)",
    "options": [
      "his",
      "him",
      "he",
      "his'"
    ],
    "correctIndex": 0,
    "explanation": "'His' è sia aggettivo sia pronome possessivo di 'lui', e qui senza nome dopo funziona da pronome: 'Is this book his?'. 'Him' e 'he' non sono possessivi, e 'his'' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q221",
    "prompt": "Complete: 'These are _____ shoes.'",
    "options": [
      "my",
      "mine",
      "me",
      "I"
    ],
    "correctIndex": 0,
    "explanation": "Davanti al nome 'shoes' serve l'aggettivo possessivo 'my'. 'Mine' si usa da solo senza nome, mentre 'me' e 'I' non sono possessivi.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q222",
    "prompt": "Complete: 'The dog is wagging _____ tail.'",
    "options": [
      "its",
      "it's",
      "it",
      "its'"
    ],
    "correctIndex": 0,
    "explanation": "Il possessivo di 'it' è 'its' senza apostrofo: 'its tail'. 'It's' significa 'it is' o 'it has', mentre 'it' non è possessivo e 'its'' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "itself"
  },
  {
    "id": "q223",
    "prompt": "Complete: 'Are those keys _____?' (of them)",
    "options": [
      "theirs",
      "their",
      "them",
      "they"
    ],
    "correctIndex": 0,
    "explanation": "'Are those keys ___?' non ha un nome dopo lo spazio, quindi serve il pronome 'theirs': 'Are those keys theirs?'. 'Their' vuole un nome dopo di sé, mentre 'them' e 'they' non sono possessivi.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q224",
    "prompt": "Complete: 'I lost _____ keys yesterday.'",
    "options": [
      "my",
      "mine",
      "me",
      "I"
    ],
    "correctIndex": 0,
    "explanation": "Davanti al nome 'keys' serve l'aggettivo possessivo 'my': 'I lost my keys'. 'Mine' si usa da solo, e 'me' e 'I' non indicano possesso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "myself"
  },
  {
    "id": "q225",
    "prompt": "Complete: 'This laptop is _____, not yours.'",
    "options": [
      "mine",
      "my",
      "me",
      "I"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'is' e senza nome si usa il pronome possessivo 'mine', che sostituisce 'my laptop' ed è coordinato a 'yours'. 'My' vuole un nome, mentre 'me' e 'I' non sono possessivi.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "mines"
  },
  {
    "id": "q226",
    "prompt": "Translate 'Questo libro è mio.'",
    "options": [
      "This book is mine.",
      "This book is my.",
      "This book is me.",
      "This book is I."
    ],
    "correctIndex": 0,
    "explanation": "'Mio' senza nome dopo è un pronome possessivo, in inglese 'mine': 'This book is mine'. 'My' vuole un nome dopo, mentre 'me' e 'I' non indicano il possesso.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "This book is mines."
  },
  {
    "id": "q227",
    "prompt": "Translate 'La loro casa è molto grande.'",
    "options": [
      "Their house is very big.",
      "Theirs house is very big.",
      "They house is very big.",
      "Them house is very big."
    ],
    "correctIndex": 0,
    "explanation": "'Loro' davanti a un nome è l'aggettivo possessivo 'their': 'Their house'. 'Theirs' si usa da solo, mentre 'they' e 'them' sono pronomi personali.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "There house is very big."
  },
  {
    "id": "q228",
    "prompt": "Translate 'Quella è la tua giacca, non la sua (di lei).'",
    "options": [
      "That is your jacket, not hers.",
      "That is your jacket, not her.",
      "That is yours jacket, not hers.",
      "That is your jacket, not she."
    ],
    "correctIndex": 0,
    "explanation": "'La sua' senza il nome è un pronome possessivo, per 'lei' è 'hers': 'not hers'. 'Her' vuole un nome dopo, 'yours jacket' mette un pronome davanti a un nome e 'she' non è possessivo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "That is your jacket, not her's."
  },
  {
    "id": "q229",
    "prompt": "Translate 'I nostri amici stanno arrivando.'",
    "options": [
      "Our friends are coming.",
      "Ours friends are coming.",
      "We friends are coming.",
      "Us friends are coming."
    ],
    "correctIndex": 0,
    "explanation": "'Nostri' davanti a 'friends' è l'aggettivo possessivo 'our': 'Our friends'. 'Ours' si usa da solo senza nome, mentre 'we' e 'us' non esprimono il possesso.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q230",
    "prompt": "Translate 'Questi soldi sono vostri?'",
    "options": [
      "Is this money yours?",
      "Is this money your?",
      "Are these money yours?",
      "Is this money you?"
    ],
    "correctIndex": 0,
    "explanation": "'Money' è non numerabile e singolare, quindi 'this money' e 'Is'; senza nome dopo lo spazio si usa il pronome 'yours': 'Is this money yours?'. 'Your' vuole un nome, 'Are these money' è sbagliato perché 'money' non ha plurale e 'you' non è possessivo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q231",
    "prompt": "Translate 'Il suo (di lui) telefono è nuovo.'",
    "options": [
      "His phone is new.",
      "Him phone is new.",
      "He phone is new.",
      "His' phone is new."
    ],
    "correctIndex": 0,
    "explanation": "'Suo' di lui davanti a un nome è 'his': 'His phone'. 'Him' e 'he' non sono possessivi e 'his'' ha un apostrofo che non esiste.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives",
    "extraOption": "He's phone is new."
  },
  {
    "id": "q232",
    "prompt": "Translate 'La mia macchina è rossa, la sua (di lui) è blu.'",
    "options": [
      "My car is red, his is blue.",
      "My car is red, him is blue.",
      "Mine car is red, his is blue.",
      "My car is red, he is blue."
    ],
    "correctIndex": 0,
    "explanation": "'My car' ha il nome, quindi si usa l'aggettivo 'my'; 'la sua' senza nome è il pronome 'his'. 'Mine car' mette un pronome davanti a un nome, mentre 'him' e 'he' non sono possessivi.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q233",
    "prompt": "Translate 'Ho dimenticato il mio ombrello.'",
    "options": [
      "I forgot my umbrella.",
      "I forgot mine umbrella.",
      "I forgot me umbrella.",
      "I forgot I umbrella."
    ],
    "correctIndex": 0,
    "explanation": "'Il mio' davanti a 'umbrella' è l'aggettivo possessivo 'my': 'I forgot my umbrella'. 'Mine' non si usa davanti a un nome, mentre 'me' e 'I' non indicano il possesso.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q234",
    "prompt": "Translate 'Quelle penne sono loro (di loro).'",
    "options": [
      "Those pens are theirs.",
      "Those pens are their.",
      "Those pens are them.",
      "Those pens are they."
    ],
    "correctIndex": 0,
    "explanation": "'Sono loro' senza il nome dopo vuole il pronome possessivo 'theirs': 'Those pens are theirs'. 'Their' vuole un nome, mentre 'them' e 'they' sono pronomi personali.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Possessives",
    "theoryId": "possessives"
  },
  {
    "id": "q235",
    "prompt": "Complete: 'I call _____ every day.' (him/he/his/himself)",
    "options": [
      "him",
      "he",
      "his",
      "himself"
    ],
    "correctIndex": 0,
    "explanation": "Dopo un verbo come 'call' serve il pronome complemento: 'I call him'. 'He' è il soggetto, 'his' è possessivo e 'himself' è riflessivo, quindi qui non vanno.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q236",
    "prompt": "Complete: 'She loves _____ very much.' (me/I/my/mine)",
    "options": [
      "me",
      "I",
      "my",
      "mine"
    ],
    "correctIndex": 0,
    "explanation": "Dopo il verbo 'love' serve il pronome complemento: 'She loves me'. 'I' è il soggetto, mentre 'my' e 'mine' sono possessivi.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "myself"
  },
  {
    "id": "q237",
    "prompt": "Complete: 'Can you help _____ with this exercise?' (us/we/our/ours)",
    "options": [
      "us",
      "we",
      "our",
      "ours"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'help' serve il pronome complemento: 'help us'. 'We' è il soggetto, mentre 'our' e 'ours' sono possessivi.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "ourselves"
  },
  {
    "id": "q238",
    "prompt": "Complete: 'I don't know _____.' (them/they/their/theirs)",
    "options": [
      "them",
      "they",
      "their",
      "theirs"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'know' serve il pronome complemento 'them': 'I don't know them'. 'They' è il soggetto, mentre 'their' e 'theirs' sono possessivi.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q239",
    "prompt": "Complete: 'Look at _____!' (her/she/hers/herself)",
    "options": [
      "her",
      "she",
      "hers",
      "herself"
    ],
    "correctIndex": 0,
    "explanation": "Dopo una preposizione ('at') si usa il pronome complemento 'her': 'Look at her'. 'She' è il soggetto, 'hers' è un pronome possessivo e 'herself' è riflessivo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q240",
    "prompt": "Complete: 'He wants to speak to _____.' (you/your/yours/yourself)",
    "options": [
      "you",
      "your",
      "yours",
      "yourself"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'to' serve il pronome complemento 'you': 'speak to you'. 'Your' e 'yours' sono possessivi, mentre 'yourself' si usa quando il soggetto è già 'you', non 'he'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q241",
    "prompt": "Complete: 'Give _____ to me.' (it/its/it's/itself)",
    "options": [
      "it",
      "its",
      "it's",
      "itself"
    ],
    "correctIndex": 0,
    "explanation": "Dopo il verbo 'give' serve un pronome complemento, e per una cosa il pronome è 'it' (\"dallo a me\"). 'Its' è un possessivo (\"suo\"), \"it's\" significa \"it is\" e 'itself' è riflessivo (\"se stesso\"): nessuno dei tre può essere l'oggetto di 'give'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q242",
    "prompt": "Complete: 'My parents are visiting _____.' (me/I/my/mine)",
    "options": [
      "me",
      "I",
      "my",
      "mine"
    ],
    "correctIndex": 0,
    "explanation": "Il soggetto è 'My parents', quindi dopo il verbo 'visiting' serve il pronome complemento 'me' (\"mi vengono a trovare\"). 'I' è un pronome soggetto, mentre 'my' e 'mine' sono possessivi e non possono stare da soli come oggetto.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "myself"
  },
  {
    "id": "q243",
    "prompt": "Complete: 'Are you listening to _____?' (him/he/his/himself)",
    "options": [
      "him",
      "he",
      "his",
      "himself"
    ],
    "correctIndex": 0,
    "explanation": "Dopo una preposizione come 'to' si usa il pronome complemento: 'listening to him'. 'He' è un pronome soggetto, 'his' è possessivo e 'himself' si usa solo quando il soggetto e l'oggetto sono la stessa persona.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q244",
    "prompt": "Translate 'Non lo capisco.' (di lui)",
    "options": [
      "I don't understand him.",
      "I don't understand he.",
      "I don't understand his.",
      "I don't understand it."
    ],
    "correctIndex": 0,
    "explanation": "'Lo' riferito a un uomo (il suggerimento dice \"di lui\") si traduce con il pronome complemento 'him'. 'He' e 'his' sono soggetto e possessivo, mentre 'it' si usa per le cose, non per una persona.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "I don't understand himself."
  },
  {
    "id": "q245",
    "prompt": "Translate 'Puoi vederci?'",
    "options": [
      "Can you see us?",
      "Can you see we?",
      "Can you see our?",
      "Can you see me?"
    ],
    "correctIndex": 0,
    "explanation": "'Ci' in \"vederci\" significa \"vedere noi\", e il pronome complemento di 'we' è 'us'. 'We' è un pronome soggetto e 'our' è un possessivo, mentre 'me' indicherebbe solo una persona (io).",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "Can you see ourselves?"
  },
  {
    "id": "q246",
    "prompt": "Translate 'Le ho comprato un regalo.' (a lei)",
    "options": [
      "I bought her a present.",
      "I bought she a present.",
      "I bought hers a present.",
      "I bought for her a present."
    ],
    "correctIndex": 0,
    "explanation": "'Le' (a lei) diventa il pronome complemento 'her', messo subito dopo il verbo: 'bought her a present'. 'She' è soggetto, 'hers' è un possessivo e 'for her' va dopo il regalo ('a present for her'), non prima.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q247",
    "prompt": "Translate 'Li aspetto qui.'",
    "options": [
      "I'll wait for them here.",
      "I'll wait for they here.",
      "I'll wait them here.",
      "I'm waiting they here."
    ],
    "correctIndex": 0,
    "explanation": "'Li' = 'them' (pronome complemento), e in inglese 'wait' vuole 'for' prima dell'oggetto: 'wait for them'. 'They' è un pronome soggetto, e 'wait them' senza 'for' è sbagliato.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q248",
    "prompt": "Translate 'Dammi quel libro.'",
    "options": [
      "Give me that book.",
      "Give I that book.",
      "Give my that book.",
      "Give to me that book."
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'give' serve il pronome complemento 'me': 'Give me that book'. 'I' è soggetto e 'my' è possessivo (andrebbe seguito da un nome), mentre 'Give to me that book' ha l'ordine delle parole sbagliato (sarebbe 'Give that book to me').",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "Give myself that book."
  },
  {
    "id": "q249",
    "prompt": "Translate 'Non ti credo.'",
    "options": [
      "I don't believe you.",
      "I don't believe your.",
      "I don't believe to you.",
      "I not believe you."
    ],
    "correctIndex": 0,
    "explanation": "'Ti' si traduce con 'you', che in inglese è uguale come soggetto e come complemento. 'Your' è un possessivo, 'believe to you' ha una preposizione di troppo e 'I not believe' manca dell'ausiliare: la negazione si fa con 'don't'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "I don't believe yourself."
  },
  {
    "id": "q250",
    "prompt": "Translate 'Lo voglio adesso.' (un oggetto)",
    "options": [
      "I want it now.",
      "I want him now.",
      "I want them now.",
      "I want he now."
    ],
    "correctIndex": 0,
    "explanation": "Il suggerimento dice che 'lo' indica un oggetto singolare, e il pronome complemento per le cose è 'it'. 'Him' si usa solo per un uomo, 'them' è plurale e 'he' è un pronome soggetto, che dopo il verbo non si può usare.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q251",
    "prompt": "Translate 'Vieni con noi al cinema?'",
    "options": [
      "Are you coming with us to the cinema?",
      "Are you coming with we to the cinema?",
      "Are you coming with our to the cinema?",
      "Are you coming to us to the cinema?"
    ],
    "correctIndex": 0,
    "explanation": "'Con noi' richiede il pronome complemento 'us' dopo la preposizione 'with'. 'With we' è sbagliato perché 'we' è soggetto, 'with our' è un aggettivo possessivo che vuole un nome, e 'coming to us' cambia il senso (\"vieni da noi\").",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns"
  },
  {
    "id": "q252",
    "prompt": "Translate 'Non li conosco.'",
    "options": [
      "I don't know them.",
      "I don't know they.",
      "I don't know their.",
      "I not know them."
    ],
    "correctIndex": 0,
    "explanation": "'Li' = 'them', pronome complemento di 'they', dopo il verbo 'know'. 'They' è un pronome soggetto, 'their' è possessivo, e 'I not know' è sbagliato perché la negazione del presente semplice vuole 'don't'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Object Pronouns",
    "theoryId": "object-pronouns",
    "extraOption": "I don't know they're."
  },
  {
    "id": "q253",
    "prompt": "Complete: '_____ is my friend, Paul.' (near)",
    "options": [
      "This",
      "These",
      "Those",
      "That"
    ],
    "correctIndex": 0,
    "explanation": "'This' si usa per una persona o cosa singolare vicina a chi parla, e qui il suggerimento dice 'near'. 'These' e 'those' sono plurali ('is' va con il singolare) e 'that' indica qualcosa di lontano.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "Them"
  },
  {
    "id": "q254",
    "prompt": "Complete: 'Look at _____ birds in the sky.'",
    "options": [
      "those",
      "that",
      "this",
      "a"
    ],
    "correctIndex": 0,
    "explanation": "'Birds' è plurale, quindi serve un dimostrativo plurale: gli uccelli sono nel cielo, lontani da chi parla, quindi 'those'. 'That' e 'this' sono singolari e 'a' non si usa davanti a un plurale.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q255",
    "prompt": "Complete: 'Are _____ your shoes here?'",
    "options": [
      "these",
      "this",
      "that",
      "a"
    ],
    "correctIndex": 0,
    "explanation": "'Shoes' è plurale e la frase dice 'here', quindi le scarpe sono vicine a chi parla: 'these'. 'This' e 'that' sono singolari e 'a' non si usa davanti a un plurale.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q256",
    "prompt": "Complete: '_____ building over there is a hospital.'",
    "options": [
      "That",
      "This",
      "These",
      "Those"
    ],
    "correctIndex": 0,
    "explanation": "'Building' è singolare e 'over there' significa lontano, quindi 'That'. 'This' indica qualcosa di vicino, mentre 'these' e 'those' sono plurali e non vanno con 'building'.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "There"
  },
  {
    "id": "q257",
    "prompt": "Complete: '_____ days are the best of my life.'",
    "options": [
      "These",
      "This",
      "That",
      "Each"
    ],
    "correctIndex": 0,
    "explanation": "'Days' è plurale e 'are' è presente, quindi i giorni sono quelli di adesso e si usa 'These'. 'This' e 'That' sono singolari e non si accordano con 'days'; 'Each' vuole un nome singolare.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q258",
    "prompt": "Complete: 'I don't like _____ kind of music.' (near/current)",
    "options": [
      "this",
      "these",
      "those",
      "them"
    ],
    "correctIndex": 0,
    "explanation": "'Kind' è singolare, quindi serve un dimostrativo singolare, e il suggerimento 'near/current' dice di usare 'this'. 'These' e 'those' sono plurali, mentre 'them' è un pronome complemento, non un dimostrativo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q259",
    "prompt": "Complete: 'Did you buy _____ apples from the market?' (far/past)",
    "options": [
      "those",
      "that",
      "this",
      "them"
    ],
    "correctIndex": 0,
    "explanation": "'Apples' è plurale e il suggerimento dice 'far/past', quindi 'those'. 'That' e 'this' sono singolari, e 'them' è un pronome complemento che non si può mettere davanti a un nome.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q260",
    "prompt": "Complete: '_____ is a very interesting book.' (holding it)",
    "options": [
      "This",
      "These",
      "Those",
      "Them"
    ],
    "correctIndex": 0,
    "explanation": "'Is' e 'book' sono singolari, e se si ha il libro in mano è vicino: 'This'. 'These' e 'those' sono plurali, e 'Them' è un pronome complemento, che non può essere soggetto.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q261",
    "prompt": "Complete: 'Can you pass me _____ pen?' (far)",
    "options": [
      "that",
      "those",
      "these",
      "this"
    ],
    "correctIndex": 0,
    "explanation": "'Pen' è singolare e il suggerimento dice 'far', quindi 'that pen'. 'Those' e 'these' sono plurali (servirebbe 'pens'), mentre 'this' indica qualcosa di vicino.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "them"
  },
  {
    "id": "q262",
    "prompt": "Translate 'Questo è il mio gatto.'",
    "options": [
      "This is my cat.",
      "That is my cat.",
      "These is my cat.",
      "Those is my cat."
    ],
    "correctIndex": 0,
    "explanation": "'Questo' vicino a chi parla, singolare, è 'this'. 'That' sarebbe \"quello\" (lontano), e 'these is' e 'those is' sono sbagliati perché 'these/those' sono plurali e non vanno con 'is'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q263",
    "prompt": "Translate 'Quelli sono i miei libri.'",
    "options": [
      "Those are my books.",
      "That are my books.",
      "These are my books.",
      "This are my books."
    ],
    "correctIndex": 0,
    "explanation": "'Quelli' sono cose lontane e plurali: 'those', e il verbo plurale è 'are'. 'That' e 'this' sono singolari (non vanno con 'are'), mentre 'these' significa \"questi\", cioè vicini.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "Them are my books."
  },
  {
    "id": "q264",
    "prompt": "Translate 'Questa pizza è buonissima.'",
    "options": [
      "This pizza is very good.",
      "That pizza is very good.",
      "These pizza is very good.",
      "It pizza is very good."
    ],
    "correctIndex": 0,
    "explanation": "'Questa pizza' è singolare e vicina: 'This pizza'. 'That' vorrebbe dire \"quella\", 'These pizza' mischia plurale e singolare, e 'It' non è un dimostrativo e non può stare davanti a un nome.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives"
  },
  {
    "id": "q265",
    "prompt": "Translate 'Queste ragazze sono italiane.'",
    "options": [
      "These girls are Italian.",
      "This girls are Italian.",
      "Those girls are Italian.",
      "That girls are Italian."
    ],
    "correctIndex": 0,
    "explanation": "'Queste ragazze' è plurale e vicino: 'These girls'. 'This' e 'that' sono singolari e non vanno con 'girls', mentre 'those' vorrebbe dire \"quelle\" (lontane).",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "These girl are Italian."
  },
  {
    "id": "q266",
    "prompt": "Translate 'Quell'uomo è mio padre.'",
    "options": [
      "That man is my father.",
      "This man is my father.",
      "Those man is my father.",
      "The man is my father."
    ],
    "correctIndex": 0,
    "explanation": "'Quell'uomo' è singolare e lontano: 'That man'. 'This man' vorrebbe dire \"quest'uomo\", 'Those man' mischia plurale e singolare, e 'The man' non traduce l'idea di \"quello\".",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "That men is my father."
  },
  {
    "id": "q267",
    "prompt": "Translate 'Cosa sono quelle cose?'",
    "options": [
      "What are those things?",
      "What are these things?",
      "What is that things?",
      "What are that things?"
    ],
    "correctIndex": 0,
    "explanation": "'Cose' è plurale e 'quelle' indica lontananza: 'those things', con 'are'. 'These' vorrebbe dire \"queste\", mentre 'that' e 'is that' non vanno con il plurale 'things'.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "What is those things?"
  },
  {
    "id": "q268",
    "prompt": "Translate 'Preferisco questo vestito.'",
    "options": [
      "I prefer this dress.",
      "I prefer that dress.",
      "I prefer these dress.",
      "I prefer those dress."
    ],
    "correctIndex": 0,
    "explanation": "'Questo vestito' è singolare e vicino: 'this dress'. 'These' e 'those' sono plurali e non vanno con 'dress' al singolare, mentre 'that' vorrebbe dire \"quel\" (lontano).",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "I prefer them dress."
  },
  {
    "id": "q269",
    "prompt": "Translate 'Conosci quelle persone?'",
    "options": [
      "Do you know those people?",
      "Do you know these people?",
      "Do you know that people?",
      "Do you know this people?"
    ],
    "correctIndex": 0,
    "explanation": "'Quelle persone' è plurale e lontano: 'those people'. 'That' e 'this' sono singolari e non vanno con 'people' (che è plurale), mentre 'these' significa \"queste\".",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "Do you know them people?"
  },
  {
    "id": "q270",
    "prompt": "Translate 'Questi sono i miei appunti.'",
    "options": [
      "These are my notes.",
      "This are my notes.",
      "Those are my notes.",
      "That are my notes."
    ],
    "correctIndex": 0,
    "explanation": "'Questi' è plurale e vicino: 'These', seguito da 'are'. 'This' e 'that' sono singolari e non vanno con 'are', mentre 'those' vorrebbe dire \"quelli\" (lontani).",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Demonstratives",
    "theoryId": "demonstratives",
    "extraOption": "Them are my notes."
  },
  {
    "id": "q271",
    "prompt": "Complete: 'The cat is hiding _____ the bed.'",
    "options": [
      "under",
      "between",
      "on",
      "at"
    ],
    "correctIndex": 0,
    "explanation": "'Under' significa \"sotto\", ed è la posizione di un gatto che si nasconde sotto il letto. 'Between' richiede due cose in mezzo alle quali stare, e 'on' (sopra) e 'at' (in un punto) non descrivono qualcosa di sotto.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q272",
    "prompt": "Complete: 'She is waiting _____ the bus stop.'",
    "options": [
      "at",
      "in",
      "on",
      "under"
    ],
    "correctIndex": 0,
    "explanation": "Per aspettare a una fermata dell'autobus, cioè in un punto preciso, si usa 'at': 'at the bus stop'. 'In' significa dentro uno spazio chiuso, 'on' vuol dire sopra una superficie e 'under' sotto.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q273",
    "prompt": "Complete: 'The picture is hanging _____ the wall.'",
    "options": [
      "on",
      "in",
      "at",
      "under"
    ],
    "correctIndex": 0,
    "explanation": "Un quadro appeso sta su una superficie, quindi 'on the wall'. 'In' vorrebbe dire dentro il muro, 'at' non indica una superficie e 'under' vuol dire sotto.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "into"
  },
  {
    "id": "q274",
    "prompt": "Complete: 'He lives _____ London.'",
    "options": [
      "in",
      "at",
      "on",
      "by"
    ],
    "correctIndex": 0,
    "explanation": "Per città e paesi si usa 'in': 'lives in London'. 'At' è per punti precisi (una fermata, la stazione), 'on' per le superfici e 'by' vuol dire \"vicino a\".",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q275",
    "prompt": "Complete: 'The car is parked _____ the house.'",
    "options": [
      "behind",
      "under",
      "in",
      "on"
    ],
    "correctIndex": 0,
    "explanation": "'Behind' significa \"dietro\", ed è la posizione più normale per un'auto parcheggiata rispetto a una casa. 'Under', 'in' e 'on' (sotto, dentro, sopra la casa) non sono posti dove si parcheggia un'auto.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q276",
    "prompt": "Complete: 'She sat _____ her two best friends.'",
    "options": [
      "between",
      "among",
      "under",
      "in"
    ],
    "correctIndex": 0,
    "explanation": "Con due persone ('her two best friends') si usa 'between', che indica la posizione in mezzo a due. 'Among' si usa con più di due, e 'under' e 'in' non descrivono sedersi in mezzo a due persone.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q277",
    "prompt": "Complete: 'The bank is _____ the post office.'",
    "options": [
      "next to",
      "in",
      "on",
      "at"
    ],
    "correctIndex": 0,
    "explanation": "'Next to' significa \"accanto a\", e descrive due edifici vicini uno all'altro. 'In', 'on' e 'at' indicherebbero che la banca è dentro o sopra l'ufficio postale, oppure in un punto di esso.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q278",
    "prompt": "Complete: 'There is a bridge _____ the river.'",
    "options": [
      "over",
      "under",
      "in",
      "at"
    ],
    "correctIndex": 0,
    "explanation": "Un ponte attraversa il fiume stando sopra di esso: 'over the river'. 'Under' vuol dire sotto, e 'in' e 'at' non descrivono la posizione di un ponte rispetto a un fiume.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q279",
    "prompt": "Complete: 'I left my keys _____ the table.'",
    "options": [
      "on",
      "in",
      "from",
      "between"
    ],
    "correctIndex": 0,
    "explanation": "Le chiavi appoggiate sul tavolo stanno su una superficie: 'on the table'. 'In' vuol dire dentro, 'from' indica provenienza e non va con 'left' in questa frase, 'between' ha bisogno di due cose.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q280",
    "prompt": "Translate 'Il cane è sotto il tavolo.'",
    "options": [
      "The dog is under the table.",
      "The dog is on the table.",
      "The dog is at the table.",
      "The dog is in the table."
    ],
    "correctIndex": 0,
    "explanation": "'Sotto' si traduce con 'under'. 'On' vuol dire sopra, 'at' indica un punto e 'in' vuol dire dentro: sono tutte posizioni diverse.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "The dog is over the table."
  },
  {
    "id": "q281",
    "prompt": "Translate 'Sono al cinema.'",
    "options": [
      "I am at the cinema.",
      "I am into the cinema.",
      "I am on the cinema.",
      "I am to the cinema."
    ],
    "correctIndex": 0,
    "explanation": "'Al cinema' è un luogo dove si svolge un'attività, quindi 'at the cinema' (come 'at school'). 'Into' indica movimento verso l'interno, 'on' si usa per le superfici e 'to' indica direzione, non posizione.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "I am over the cinema."
  },
  {
    "id": "q282",
    "prompt": "Translate 'C'è un ragno sul soffitto.'",
    "options": [
      "There is a spider on the ceiling.",
      "There is a spider at the ceiling.",
      "There is a spider in the ceiling.",
      "There is a spider under the ceiling."
    ],
    "correctIndex": 0,
    "explanation": "Il soffitto è una superficie, quindi un ragno ci sta 'on the ceiling'. 'In' e 'at' non descrivono una superficie, mentre 'under' vuol dire sotto il soffitto.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q283",
    "prompt": "Translate 'L'ufficio è vicino alla banca.'",
    "options": [
      "The office is near the bank.",
      "The office is in the bank.",
      "The office is between the bank.",
      "The office is at the bank."
    ],
    "correctIndex": 0,
    "explanation": "'Vicino a' si traduce con 'near'. 'Between' ha bisogno di due luoghi, e 'in' e 'at' vorrebbero dire che l'ufficio è dentro la banca o in un punto della banca.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "The office is over the bank."
  },
  {
    "id": "q284",
    "prompt": "Translate 'Il bambino è tra i suoi genitori.'",
    "options": [
      "The child is between his parents.",
      "The child is among his parents.",
      "The child is next to his parents.",
      "The child is in his parents."
    ],
    "correctIndex": 0,
    "explanation": "Un bambino con due genitori sta in mezzo a due persone: 'between'. 'Among' si usa con più di due, 'next to' vuol dire \"accanto a\" e 'in' vorrebbe dire \"dentro\" i genitori.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q285",
    "prompt": "Translate 'Nasconditi dietro la porta.'",
    "options": [
      "Hide behind the door.",
      "Hide under the door.",
      "Hide next to the door.",
      "Hide in the door."
    ],
    "correctIndex": 0,
    "explanation": "'Dietro' si traduce con 'behind'. 'Under' vuol dire sotto, 'next to' accanto e 'in the door' dentro la porta, che non ha senso.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "Hide in front of the door."
  },
  {
    "id": "q286",
    "prompt": "Translate 'Metti i vestiti nell'armadio.'",
    "options": [
      "Put the clothes in the wardrobe.",
      "Put the clothes on the wardrobe.",
      "Put the clothes at the wardrobe.",
      "Put the clothes to the wardrobe."
    ],
    "correctIndex": 0,
    "explanation": "I vestiti si mettono dentro uno spazio chiuso, quindi 'in the wardrobe'. 'On' è per le superfici, 'at' per un punto e 'to' indica direzione verso un posto, non posizione.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "Put the clothes by the wardrobe."
  },
  {
    "id": "q287",
    "prompt": "Translate 'Ho incontrato Marco alla stazione.'",
    "options": [
      "I met Marco at the station.",
      "I met Marco into the station.",
      "I met Marco on the station.",
      "I met Marco to the station."
    ],
    "correctIndex": 0,
    "explanation": "'Alla stazione' è un punto preciso dove ci si incontra, quindi 'at the station'. 'Into' indica movimento verso l'interno, mentre 'on' e 'to' non si usano in questo modo.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "I met Marco over the station."
  },
  {
    "id": "q288",
    "prompt": "Translate 'C'è un giardino dietro la casa.'",
    "options": [
      "There is a garden behind the house.",
      "There is a garden under the house.",
      "There is a garden in the house.",
      "There is a garden next to the house."
    ],
    "correctIndex": 0,
    "explanation": "'Dietro' si traduce con 'behind'. 'Under' vuol dire sotto, 'in' dentro e 'next to' accanto: tutte posizioni diverse da \"dietro la casa\".",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place",
    "extraOption": "There is a garden in front of the house."
  },
  {
    "id": "q289",
    "prompt": "Complete: '_____ to me carefully.'",
    "options": [
      "Listen",
      "Listening",
      "Listens",
      "To listen"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo si fa con la forma base del verbo, senza soggetto: 'Listen to me'. 'Listening', 'Listens' e 'To listen' non sono forme dell'imperativo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative"
  },
  {
    "id": "q290",
    "prompt": "Complete: '_____ open the window. It's cold.'",
    "options": [
      "Don't",
      "Not",
      "No",
      "Doesn't"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo negativo si forma con 'Don't' + forma base: \"Don't open\". 'Not' e 'No' non si usano da soli all'inizio, e 'Doesn't' vale solo per la terza persona singolare, non per un ordine.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Aren't"
  },
  {
    "id": "q291",
    "prompt": "Complete: '_____ your vegetables!'",
    "options": [
      "Eat",
      "Eating",
      "Eats",
      "To eat"
    ],
    "correctIndex": 0,
    "explanation": "Un ordine diretto usa la forma base del verbo: 'Eat your vegetables!'. 'Eating', 'Eats' e 'To eat' non sono forme dell'imperativo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Ate"
  },
  {
    "id": "q292",
    "prompt": "Complete: '_____ be late for the meeting.'",
    "options": [
      "Don't",
      "Not",
      "Doesn't",
      "No"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo negativo è 'Don't' + forma base ('Don't be late'), anche con il verbo 'be'. 'Not', 'No' e 'Doesn't' non possono aprire un ordine.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Isn't"
  },
  {
    "id": "q293",
    "prompt": "Complete: '_____ quiet, please.'",
    "options": [
      "Be",
      "Are",
      "Is",
      "Am"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo di 'to be' è la forma base 'Be': 'Be quiet, please.'. 'Are', 'Is' e 'Am' sono forme coniugate e hanno bisogno di un soggetto (you, he, I).",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Been"
  },
  {
    "id": "q294",
    "prompt": "Complete: '_____ touch that plate, it's hot.'",
    "options": [
      "Don't",
      "No",
      "Not",
      "Doesn't"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo negativo si forma con 'Don't' + forma base: \"Don't touch\". 'No', 'Not' e 'Doesn't' non possono aprire un ordine.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative"
  },
  {
    "id": "q295",
    "prompt": "Complete: '_____ your homework before dinner.'",
    "options": [
      "Do",
      "Does",
      "Doing",
      "Did"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo di 'do' è la forma base 'Do': 'Do your homework'. 'Does' vale solo per he/she/it, 'Doing' è la forma -ing e 'Did' è passato: nessuno è un imperativo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Make"
  },
  {
    "id": "q296",
    "prompt": "Complete: '_____ me the salt, please.'",
    "options": [
      "Pass",
      "Passing",
      "Passes",
      "To pass"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo è la forma base del verbo e non ha soggetto: 'Pass me the salt'. 'Passing', 'Passes' e 'To pass' non sono forme dell'imperativo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Passed"
  },
  {
    "id": "q297",
    "prompt": "Complete: '_____ worry about it.'",
    "options": [
      "Don't",
      "Not",
      "No",
      "Doesn't"
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo negativo si forma con 'Don't' + forma base: \"Don't worry\". 'Not' e 'No' da soli non bastano e 'Doesn't' non va con un ordine.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Aren't"
  },
  {
    "id": "q298",
    "prompt": "Translate 'Non toccare il mio telefono.'",
    "options": [
      "Don't touch my phone.",
      "Not touch my phone.",
      "No touch my phone.",
      "Doesn't touch my phone."
    ],
    "correctIndex": 0,
    "explanation": "\"Non toccare\" si traduce con 'Don't touch', cioè 'Don't' + forma base. 'Not touch' e 'No touch' non sono frasi inglesi corrette, e 'Doesn't touch' è la terza persona singolare, non un ordine.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Don't to touch my phone."
  },
  {
    "id": "q299",
    "prompt": "Translate 'Fai attenzione!'",
    "options": [
      "Pay attention!",
      "Do attention!",
      "Make attention!",
      "Attention you!"
    ],
    "correctIndex": 0,
    "explanation": "\"Fare attenzione\" in inglese è 'pay attention', un'espressione fissa. 'Do attention' e 'Make attention' sono traduzioni letterali sbagliate, e 'Attention you!' non è una frase corretta.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Take attention!"
  },
  {
    "id": "q300",
    "prompt": "Translate 'Ascoltami quando parlo.'",
    "options": [
      "Listen to me when I speak.",
      "Listen me when I speak.",
      "Hear me when I speak.",
      "Hear to me when I speak."
    ],
    "correctIndex": 0,
    "explanation": "In inglese 'listen' vuole 'to' prima dell'oggetto: 'Listen to me'. 'Listen me' manca di 'to', 'Hear' significa \"sentire\" (percepire un suono) e non vuole mai 'to', quindi 'Hear to me' è sbagliato.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative"
  },
  {
    "id": "q301",
    "prompt": "Translate 'Non dimenticare le chiavi.'",
    "options": [
      "Don't forget your keys.",
      "Not forget your keys.",
      "No forget your keys.",
      "Don't missing your keys."
    ],
    "correctIndex": 0,
    "explanation": "\"Non dimenticare\" si traduce con 'Don't forget', cioè 'Don't' + forma base. 'Not forget' e 'No forget' non sono forme corrette, e 'Don't missing' sbaglia perché dopo 'don't' non si mette -ing (e 'miss' non significa \"dimenticare\").",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Don't to forget your keys."
  },
  {
    "id": "q302",
    "prompt": "Translate 'Chiudi la porta, per favore.'",
    "options": [
      "Close the door, please.",
      "Closing the door, please.",
      "To close the door, please.",
      "Closes the door, please."
    ],
    "correctIndex": 0,
    "explanation": "L'ordine si fa con la forma base del verbo: 'Close the door, please.'. 'Closing' e 'To close' non sono imperativi e 'Closes' è la terza persona singolare del presente.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Closed the door, please."
  },
  {
    "id": "q303",
    "prompt": "Translate 'Non parlare durante l'esame.'",
    "options": [
      "Don't speak during the exam.",
      "Not speak during the exam.",
      "Doesn't speak during the exam.",
      "Don't speaking during the exam."
    ],
    "correctIndex": 0,
    "explanation": "\"Non parlare\" è 'Don't speak': 'Don't' + forma base. 'Not speak' e 'Doesn't speak' non sono forme dell'imperativo, e dopo 'don't' non si mette -ing ('speaking').",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Don't to speak during the exam."
  },
  {
    "id": "q304",
    "prompt": "Translate 'Aspetta qui un momento.'",
    "options": [
      "Wait here a moment.",
      "Waiting here a moment.",
      "Wait here a time.",
      "Waits here a moment."
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo è la forma base: 'Wait here'. 'Waiting' e 'Waits' non sono imperativi, e 'un momento' è 'a moment', non 'a time' (che vuol dire \"una volta\").",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Waited here a moment."
  },
  {
    "id": "q305",
    "prompt": "Translate 'Scrivete i vostri nomi sul foglio.'",
    "options": [
      "Write your names on the paper.",
      "Writing your names on the paper.",
      "You write your names on the paper.",
      "To write your names on the paper."
    ],
    "correctIndex": 0,
    "explanation": "L'imperativo è uguale per 'tu' e 'voi': 'Write your names...'. 'Writing' e 'To write' non sono imperativi, e 'You write' è una frase dichiarativa, non un ordine normale.",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Wrote your names on the paper."
  },
  {
    "id": "q306",
    "prompt": "Translate 'Non fumare in questa stanza.'",
    "options": [
      "Don't smoke in this room.",
      "Smoke not in this room.",
      "Not smoke in this room.",
      "Doesn't smoke in this room."
    ],
    "correctIndex": 0,
    "explanation": "\"Non fumare\" si traduce con 'Don't smoke': 'Don't' + forma base. 'Not smoke' e 'Smoke not' non sono forme usate oggi, e 'Doesn't smoke' è una frase dichiarativa (\"lui non fuma\").",
    "category": "Traduzione",
    "level": "A1",
    "grammarTopic": "Imperative",
    "theoryId": "imperative",
    "extraOption": "Don't smoked in this room."
  },
  {
    "id": "q307",
    "prompt": "Complete: 'I _____ to visit my grandparents this weekend.'",
    "options": [
      "am going",
      "go",
      "going",
      "will going"
    ],
    "correctIndex": 0,
    "explanation": "Per un programma già deciso si usa 'be going to' + forma base: 'am going to visit'. 'Go' e 'going' da soli non esprimono il futuro (manca 'am ... to'), e 'will going' è una forma inesistente.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "am go"
  },
  {
    "id": "q308",
    "prompt": "Complete: 'Look at those dark clouds. It _____ rain.'",
    "options": [
      "is going to",
      "will to",
      "going to",
      "rains"
    ],
    "correctIndex": 0,
    "explanation": "'Going to' si usa per prevedere il futuro quando ci sono segnali evidenti adesso (nuvole scure): 'It is going to rain'. 'Going to' senza 'is' è incompleto, 'will to' è una forma sbagliata (dopo 'will' non c'è 'to') e 'rains' è un presente semplice che non esprime una previsione.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q309",
    "prompt": "Complete: 'What _____ you going to do tonight?'",
    "options": [
      "are",
      "do",
      "is",
      "will"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande con 'going to' si usa il verbo 'be' coniugato prima del soggetto: 'What are you going to do?'. 'Do' e 'will' non sono parte di questa struttura, e 'is' non concorda con 'you'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "have"
  },
  {
    "id": "q310",
    "prompt": "Complete: 'She _____ not going to buy a new car.'",
    "options": [
      "is",
      "does",
      "has",
      "will"
    ],
    "correctIndex": 0,
    "explanation": "La negazione di 'be going to' si fa con 'be' + not: 'is not going to'. 'Does', 'has' e 'will' non fanno parte della struttura e con 'going to' non si possono usare.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "do"
  },
  {
    "id": "q311",
    "prompt": "Complete: 'We are going to _____ a movie after dinner.'",
    "options": [
      "watch",
      "watching",
      "watched",
      "watches"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'going to' si usa la forma base del verbo: 'going to watch'. 'Watching', 'watched' e 'watches' non vanno dopo 'to' in questa struttura.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q312",
    "prompt": "Complete: '_____ he going to invite her to the party?'",
    "options": [
      "Is",
      "Does",
      "Will",
      "Has"
    ],
    "correctIndex": 0,
    "explanation": "Per fare una domanda con 'going to' si inverte 'be' e il soggetto: 'Is he going to...?'. 'Does' non va con 'going to', 'Will' non è parte della struttura e 'Has' non c'entra.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q313",
    "prompt": "Complete: 'They _____ going to start a new business next year.'",
    "options": [
      "are",
      "will",
      "do",
      "have"
    ],
    "correctIndex": 0,
    "explanation": "Il soggetto è 'They' (plurale), quindi 'be going to' diventa 'are going to'. 'Will' non può stare prima di 'going to' e 'do' e 'have' non fanno parte di questa struttura.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "is"
  },
  {
    "id": "q314",
    "prompt": "Complete: 'I'm going to _____ English in London.'",
    "options": [
      "study",
      "studying",
      "studied",
      "studies"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'going to' si usa la forma base: 'going to study'. 'Studying', 'studied' e 'studies' sono forme sbagliate dopo 'to' in questa struttura.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "to study"
  },
  {
    "id": "q315",
    "prompt": "Complete: 'My parents are _____ to travel to Spain.'",
    "options": [
      "going",
      "go",
      "will",
      "goes"
    ],
    "correctIndex": 0,
    "explanation": "La struttura è 'be going to', quindi 'are going to travel'. 'Go' e 'goes' non sono la forma -ing necessaria, e 'will' non può sostituire 'going' in questa struttura.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q316",
    "prompt": "Translate 'Cosa hai intenzione di fare?'",
    "options": [
      "What are you going to do?",
      "What will you do?",
      "What do you do?",
      "What you are going to do?"
    ],
    "correctIndex": 0,
    "explanation": "\"Avere intenzione di\" si esprime con 'be going to': 'What are you going to do?'. Nelle domande 'be' va prima del soggetto, quindi 'What you are going to do?' è sbagliato; 'What do you do?' significa \"che lavoro fai?\", cioè un'abitudine.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "What are you going to doing?"
  },
  {
    "id": "q317",
    "prompt": "Translate 'Non ho intenzione di aspettare tutto il giorno.'",
    "options": [
      "I am not going to wait all day.",
      "I don't go to wait all day.",
      "I won't to wait all day.",
      "I am not going to waiting all day."
    ],
    "correctIndex": 0,
    "explanation": "\"Non ho intenzione di\" si traduce con 'am not going to' + forma base. 'I don't go to wait' e 'I won't to wait' sono forme sbagliate (dopo 'won't' non ci va 'to'), e dopo 'going to' non ci va la forma -ing.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "I am not going wait all day."
  },
  {
    "id": "q318",
    "prompt": "Translate 'Lui studierà medicina all'università.' (intenzione)",
    "options": [
      "He is going to study medicine at university.",
      "He going to study medicine at university.",
      "He is going to studying medicine at university.",
      "He is going study medicine at university."
    ],
    "correctIndex": 0,
    "explanation": "Un'intenzione già decisa si esprime con 'be going to' + forma base: 'is going to study'. Le altre opzioni sbagliano la forma: manca 'is', oppure il verbo dopo 'to' è in -ing, oppure manca 'to'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q319",
    "prompt": "Translate 'Abbiamo intenzione di comprare una nuova casa.'",
    "options": [
      "We are going to buy a new house.",
      "We will buy a new house.",
      "We are going buy a new house.",
      "We buy a new house."
    ],
    "correctIndex": 0,
    "explanation": "Un'intenzione o una decisione già presa si esprime con 'be going to' + forma base: 'We are going to buy'. 'Going buy' senza 'to' è sbagliato, e 'We buy' è un presente abituale.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "We are going to buying a new house."
  },
  {
    "id": "q320",
    "prompt": "Translate 'Pioverà a breve.' (guardando il cielo scuro)",
    "options": [
      "It is going to rain soon.",
      "It going to rain soon.",
      "It is raining soon.",
      "It rains soon."
    ],
    "correctIndex": 0,
    "explanation": "Una previsione basata su ciò che si vede ora (cielo scuro) usa 'be going to': 'It is going to rain soon'. 'It going to' non ha il verbo 'be', mentre 'It is raining' e 'It rains' non sono previsioni sul futuro.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q321",
    "prompt": "Translate 'Non parteciperanno all'incontro.' (intenzione)",
    "options": [
      "They aren't going to attend the meeting.",
      "They not going to attend the meeting.",
      "They don't attend the meeting.",
      "They aren't going to attending the meeting."
    ],
    "correctIndex": 0,
    "explanation": "Una negazione che esprime l'intenzione si fa con 'be not going to' + forma base: 'They aren't going to attend'. 'They not going to' non ha il verbo 'be', 'don't attend' è un presente abituale e dopo 'to' non va il verbo in -ing.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q322",
    "prompt": "Translate 'Cosa mangerai a cena?' (che programmi hai)",
    "options": [
      "What are you going to eat for dinner?",
      "What are you going eat for dinner?",
      "What do you eat for dinner?",
      "What is you going to eat for dinner?"
    ],
    "correctIndex": 0,
    "explanation": "Il suggerimento indica che si parla di programmi già fatti, quindi 'be going to': 'What are you going to eat?'. Manca 'to' in 'going eat', 'is you' non si accorda (con 'you' serve 'are') e 'What do you eat?' parla di abitudine.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q323",
    "prompt": "Translate 'Venderà la sua macchina?' (ha intenzione di)",
    "options": [
      "Is she going to sell her car?",
      "Does she going to sell her car?",
      "Does she sell her car?",
      "Is she sell her car?"
    ],
    "correctIndex": 0,
    "explanation": "Una domanda sull'intenzione si fa con 'be' + soggetto + 'going to': 'Is she going to sell her car?'. 'Does' non si combina con 'going to', 'Does she sell' parla di abitudine e dopo 'is' non si può usare la forma base.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to"
  },
  {
    "id": "q324",
    "prompt": "Translate 'Cadrà!' (lo vedi correre sul ghiaccio)",
    "options": [
      "He's going to fall!",
      "He is going fall!",
      "He falls!",
      "He falling!"
    ],
    "correctIndex": 0,
    "explanation": "Una previsione basata su ciò che si vede ora (corre sul ghiaccio) usa 'be going to': \"He's going to fall!\". 'He is going fall' manca di 'to', 'He falls' è un presente abituale e 'He falling' non ha il verbo ausiliare.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Future: going to",
    "theoryId": "going-to",
    "extraOption": "He's go to fall!"
  },
  {
    "id": "q325",
    "prompt": "Complete: 'I _____ TV when the phone rang.'",
    "options": [
      "was watching",
      "watched",
      "am watching",
      "were watching"
    ],
    "correctIndex": 0,
    "explanation": "L'azione lunga in corso (guardare la TV) si mette al past continuous, quella breve che la interrompe (squilla il telefono) al past simple: 'was watching'. 'Were' non va con 'I', e 'watched' e 'am watching' non descrivono un'azione in corso nel passato.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q326",
    "prompt": "Complete: 'While she was reading, her brother _____ video games.'",
    "options": [
      "was playing",
      "were playing",
      "playing",
      "is playing"
    ],
    "correctIndex": 0,
    "explanation": "'While' introduce due azioni che avvengono nello stesso momento nel passato, quindi anche la seconda va al past continuous: 'was playing' (soggetto singolare, 'her brother'). 'Were' non si accorda, 'playing' senza ausiliare è incompleto e 'is playing' è presente.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q327",
    "prompt": "Complete: 'What _____ you doing at 8 PM yesterday?'",
    "options": [
      "were",
      "was",
      "are",
      "did"
    ],
    "correctIndex": 0,
    "explanation": "Il past continuous si forma con 'was/were' + -ing, e con 'you' si usa 'were'. 'Was' va con I/he/she/it, 'are' è presente e 'did' richiederebbe la forma base ('did you do').",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "have"
  },
  {
    "id": "q328",
    "prompt": "Complete: 'They _____ in the park when it started to rain.'",
    "options": [
      "were walking",
      "was walking",
      "are walking",
      "walking"
    ],
    "correctIndex": 0,
    "explanation": "L'azione lunga che fa da sfondo ('in the park') si mette al past continuous e il soggetto plurale vuole 'were walking'. 'Was walking' è singolare, 'are walking' è presente e 'walking' da solo manca dell'ausiliare.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q329",
    "prompt": "Complete: 'He _____ (not) listening to the teacher.'",
    "options": [
      "wasn't",
      "weren't",
      "didn't",
      "isn't"
    ],
    "correctIndex": 0,
    "explanation": "Il past continuous negativo si fa con 'was/were not' + -ing, e con 'He' si usa 'wasn't'. 'Weren't' va con you/we/they, 'didn't' vuole la forma base e 'isn't' è presente.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "hasn't"
  },
  {
    "id": "q330",
    "prompt": "Complete: 'While I _____ home, I saw a car accident.'",
    "options": [
      "was driving",
      "were driving",
      "am driving",
      "was drive"
    ],
    "correctIndex": 0,
    "explanation": "'While' introduce un'azione in corso nel passato (past continuous), interrotta da un'altra breve ('I saw'): 'was driving'. Con 'I' si usa 'was', non 'were'; 'am driving' è presente e 'was drive' manca di -ing.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q331",
    "prompt": "Complete: 'We were having dinner when the lights _____ out.'",
    "options": [
      "went",
      "were going",
      "go",
      "gone"
    ],
    "correctIndex": 0,
    "explanation": "L'azione breve che interrompe (le luci che si spengono) va al Past Simple: 'went out'. 'Were going' non ha senso con 'lights' qui, e 'go' o 'gone' non sono forme di passato semplice.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q332",
    "prompt": "Complete: '_____ it raining when you left?'",
    "options": [
      "Was",
      "Were",
      "Did",
      "Is"
    ],
    "correctIndex": 0,
    "explanation": "Il Past Continuous si forma con was/were + -ing; con 'it' (singolare) si usa 'was'. 'Were' va con you/we/they, 'Did' vuole il verbo base (did it rain) e 'Is' è presente.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "Has"
  },
  {
    "id": "q333",
    "prompt": "Complete: 'I broke my leg while I _____ football.'",
    "options": [
      "was playing",
      "played",
      "am playing",
      "play"
    ],
    "correctIndex": 0,
    "explanation": "Mentre si svolge un'azione lunga (giocavo a calcio), un'altra la interrompe (mi sono rotto la gamba): l'azione di sfondo va al Past Continuous, 'was playing'. 'Am playing' e 'play' sono presente; 'played' non rende l'azione in corso.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q334",
    "prompt": "Translate 'Cosa stavi facendo quando ti ho chiamato?'",
    "options": [
      "What were you doing when I called you?",
      "What did you do when I called you?",
      "What was you doing when I called you?",
      "What are you doing when I called you?"
    ],
    "correctIndex": 0,
    "explanation": "'Cosa stavi facendo?' è un'azione in corso nel passato: Past Continuous, 'were you doing'. 'What was you' è sbagliato (con 'you' si usa sempre 'were'), 'did you do' chiede cosa hai fatto, non cosa stavi facendo, e 'are' è presente.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "What were you do when I called you?"
  },
  {
    "id": "q335",
    "prompt": "Translate 'Stavo dormendo quando l'allarme ha suonato.'",
    "options": [
      "I was sleeping when the alarm rang.",
      "I am sleeping when the alarm rang.",
      "I was sleep when the alarm rang.",
      "I was sleeping when the alarm ringed."
    ],
    "correctIndex": 0,
    "explanation": "'Stavo dormendo' è l'azione lunga (Past Continuous: was sleeping), 'ha suonato' è l'evento breve che la interrompe (Past Simple: rang). 'Am sleeping' è presente, 'was sleep' manca di -ing e 'ringed' non è il passato di 'ring'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q336",
    "prompt": "Translate 'Mentre camminavamo, abbiamo trovato dei soldi.'",
    "options": [
      "While we were walking, we found some money.",
      "While we walked, we were finding some money.",
      "When we were walking, we were finding some money.",
      "While we walking, we found some money."
    ],
    "correctIndex": 0,
    "explanation": "'While' introduce di solito l'azione in corso (Past Continuous: were walking), poi arriva l'evento breve al Past Simple (found). 'We walking' manca di 'were', e 'were finding' non va bene perché trovare dei soldi è un momento, non un'azione che dura.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q337",
    "prompt": "Translate 'Lei non stava guardando la TV, stava leggendo.'",
    "options": [
      "She wasn't watching TV, she was reading.",
      "She didn't watching TV, she was reading.",
      "She wasn't watching TV, she reading.",
      "She wasn't watch TV, she was reading."
    ],
    "correctIndex": 0,
    "explanation": "Entrambe le azioni sono in corso nel passato, quindi due Past Continuous: 'wasn't watching' e 'was reading'. Le altre opzioni hanno errori di forma: 'didn't watching' mescola ausiliare e -ing, 'she reading' non ha 'was', 'wasn't watch' manca di -ing.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "She wasn't watched TV, she was reading."
  },
  {
    "id": "q338",
    "prompt": "Translate 'Mentre cucinavo, lui ascoltava la musica.'",
    "options": [
      "While I was cooking, he was listening to music.",
      "While I was cook, he was listening to music.",
      "While I cooking, he was listening to music.",
      "While I was cooking, he were listening to music."
    ],
    "correctIndex": 0,
    "explanation": "Due azioni contemporanee e in corso nel passato vanno entrambe al Past Continuous: 'was cooking' e 'was listening'. Le altre opzioni hanno errori netti: 'was cook' senza -ing, 'I cooking' senza 'was', 'he were' (con he/she/it si usa 'was').",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q339",
    "prompt": "Translate 'Pioveva forte ieri mattina?'",
    "options": [
      "Was it raining hard yesterday morning?",
      "Did it raining hard yesterday morning?",
      "Were it raining hard yesterday morning?",
      "Is it raining hard yesterday morning?"
    ],
    "correctIndex": 0,
    "explanation": "'Pioveva' è un'azione in corso in un momento del passato, quindi Past Continuous in forma interrogativa: 'Was it raining...?'. 'Did' non si usa con -ing, 'Were' non va con 'it' e 'Is' è presente.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "Was it rain hard yesterday morning?"
  },
  {
    "id": "q340",
    "prompt": "Translate 'Non stavamo andando troppo veloci.'",
    "options": [
      "We weren't going too fast.",
      "We didn't go too fast.",
      "We wasn't going too fast.",
      "We aren't going too fast."
    ],
    "correctIndex": 0,
    "explanation": "La negativa del Past Continuous è wasn't/weren't + -ing; con 'we' si usa 'weren't'. 'We wasn't' è sbagliato, 'didn't go' è un passato semplice (non 'stavamo andando') e 'aren't' è presente.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "We weren't go too fast."
  },
  {
    "id": "q341",
    "prompt": "Translate 'Cosa pensavi in quel momento?'",
    "options": [
      "What were you thinking at that moment?",
      "What was you thinking at that moment?",
      "What are you thinking at that moment?",
      "What did you thinking at that moment?"
    ],
    "correctIndex": 0,
    "explanation": "'Cosa pensavi in quel momento' descrive qualcosa che era in corso: 'What were you thinking'. 'Was you' è sbagliato (con you sempre 'were'), 'are you thinking' è presente e 'did you thinking' mescola 'did' con la forma in -ing.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous",
    "extraOption": "What were you think at that moment?"
  },
  {
    "id": "q342",
    "prompt": "Translate 'Loro ridevano quando sono entrato.'",
    "options": [
      "They were laughing when I entered.",
      "They laughing when I entered.",
      "They was laughing when I entered.",
      "They were laugh when I entered."
    ],
    "correctIndex": 0,
    "explanation": "'Ridevano' è lo sfondo (Past Continuous: were laughing), 'sono entrato' è l'evento breve (Past Simple: entered). Le altre opzioni sbagliano la forma: manca 'were', 'was' non si accorda con 'they', 'laugh' manca di -ing.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Past Continuous",
    "theoryId": "past-continuous"
  },
  {
    "id": "q343",
    "prompt": "Complete: 'You look tired. You _____ go to bed early.'",
    "options": [
      "should",
      "have to",
      "mustn't",
      "don't have to"
    ],
    "correctIndex": 0,
    "explanation": "Per un consiglio ('dovresti andare a letto presto, sei stanco') si usa 'should'. 'Have to' esprime un obbligo, 'mustn't' un divieto e 'don't have to' dice che non è necessario: nessuno ha senso dopo 'You look tired'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q344",
    "prompt": "Complete: 'In many countries, you _____ wear a seatbelt when driving.'",
    "options": [
      "have to",
      "has to",
      "don't have to",
      "mustn't"
    ],
    "correctIndex": 0,
    "explanation": "Una legge o una regola esterna si esprime con 'have to' (obbligo). 'Has to' non si accorda con 'you', 'don't have to' vuol dire non è necessario e 'mustn't' è un divieto, cioè il contrario di ciò che dice la legge sulle cinture.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q345",
    "prompt": "Complete: 'Tomorrow is Sunday, so I _____ wake up early.'",
    "options": [
      "don't have to",
      "mustn't",
      "shouldn't",
      "haven't to"
    ],
    "correctIndex": 0,
    "explanation": "Domani è domenica, quindi non è necessario svegliarsi presto: 'don't have to' indica assenza di obbligo. 'Mustn't' è un divieto, 'shouldn't' un consiglio negativo e 'haven't to' non esiste.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "doesn't have to"
  },
  {
    "id": "q346",
    "prompt": "Complete: 'You _____ use your phone during the exam! It's forbidden.'",
    "options": [
      "mustn't",
      "don't have to",
      "shouldn't",
      "haven't to"
    ],
    "correctIndex": 0,
    "explanation": "Se è vietato usare il telefono si usa 'mustn't', che indica divieto. 'Don't have to' significa solo che non è obbligatorio (non è proibito), 'shouldn't' è un consiglio e 'haven't to' non esiste.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q347",
    "prompt": "Complete: '_____ I wear a suit to the interview?'",
    "options": [
      "Should",
      "Does",
      "Have to",
      "Do I must"
    ],
    "correctIndex": 0,
    "explanation": "Per chiedere un consiglio si usa 'Should I...?'. 'Does I' ha il verbo sbagliato, 'Have to' non fa una domanda senza 'Do I' davanti e 'Do I must' è errato perché 'must' non si usa con 'do'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q348",
    "prompt": "Complete: 'We have plenty of time. We _____ hurry.'",
    "options": [
      "don't have to",
      "mustn't",
      "shouldn't",
      "don't must"
    ],
    "correctIndex": 0,
    "explanation": "C'è molto tempo, quindi non c'è bisogno di fare in fretta: 'don't have to' (assenza di obbligo). 'Mustn't' sarebbe un divieto, 'shouldn't' un consiglio negativo e 'don't must' non esiste, perché 'must' non vuole 'do'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q349",
    "prompt": "Complete: 'All visitors _____ wear a helmet on the building site. It's the law.'",
    "options": [
      "must",
      "mustn't",
      "don't have to",
      "musts"
    ],
    "correctIndex": 0,
    "explanation": "Per una regola o una legge si usa 'must' + verbo base. 'Mustn't' direbbe che indossare il casco è vietato, 'don't have to' che non serve, e 'musts' non esiste: i modali non prendono la -s.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "has to"
  },
  {
    "id": "q350",
    "prompt": "Complete: 'He _____ wear glasses to read because his eyesight is bad.'",
    "options": [
      "has to",
      "must to",
      "musts",
      "have to"
    ],
    "correctIndex": 0,
    "explanation": "Con 'he' si usa 'has to' per una necessità (ha la vista debole, quindi gli serve). 'Have to' è per I/you/we/they, 'must to' e 'musts' sono errate perché 'must' non vuole né 'to' né la -s.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q351",
    "prompt": "Complete: 'Do I _____ pay for this ticket now?'",
    "options": [
      "have to",
      "must",
      "should",
      "had to"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande con 'do' il verbo che segue deve essere alla forma base: 'Do I have to pay?'. 'Do I must', 'Do I should' e 'Do I had to' sono errate: 'must' e 'should' non si usano con 'do', e dopo 'do' non va il passato.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "to have"
  },
  {
    "id": "q352",
    "prompt": "Translate 'Dovresti mangiare più verdure.'",
    "options": [
      "You should eat more vegetables.",
      "You must eat more vegetables.",
      "You have to eat more vegetables.",
      "You shouldn't eat more vegetables."
    ],
    "correctIndex": 0,
    "explanation": "'Dovresti' è un consiglio, quindi 'should'. 'Must' e 'have to' esprimono obbligo (più forti), mentre 'shouldn't' dice l'opposto: non mangiare più verdure.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "You should to eat more vegetables."
  },
  {
    "id": "q353",
    "prompt": "Translate 'Non devi per forza venire se sei stanco.'",
    "options": [
      "You don't have to come if you're tired.",
      "You mustn't come if you're tired.",
      "You shouldn't come if you're tired.",
      "You haven't to come if you're tired."
    ],
    "correctIndex": 0,
    "explanation": "'Non devi per forza' vuol dire che non è necessario: 'don't have to'. 'Mustn't' significa che è vietato, 'shouldn't' che è meglio non farlo e 'haven't to' non esiste.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "You don't must come if you're tired."
  },
  {
    "id": "q354",
    "prompt": "Translate 'Non devi assolutamente toccare quel filo!'",
    "options": [
      "You mustn't touch that wire!",
      "You don't have to touch that wire!",
      "You shouldn't touch that wire!",
      "You haven't to touch that wire!"
    ],
    "correctIndex": 0,
    "explanation": "'Non devi assolutamente' è un divieto forte: 'mustn't'. 'Don't have to' dice soltanto che non è necessario, 'shouldn't' è un consiglio più debole e 'haven't to' non esiste.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "You not must touch that wire!"
  },
  {
    "id": "q355",
    "prompt": "Translate 'Lui deve lavorare fino a tardi oggi.' (obbligo esterno)",
    "options": [
      "He has to work late today.",
      "He should work late today.",
      "He have to work late today.",
      "He musts work late today."
    ],
    "correctIndex": 0,
    "explanation": "'Deve lavorare' per un obbligo esterno si traduce con 'has to' (he/she/it). 'Should' è un consiglio, 'he have to' non concorda e 'musts' non esiste perché i modali non prendono la -s.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q356",
    "prompt": "Translate 'Non dovresti bere così tanto caffè.'",
    "options": [
      "You shouldn't drink so much coffee.",
      "You mustn't drink so much coffee.",
      "You don't have to drink so much coffee.",
      "You haven't to drink so much coffee."
    ],
    "correctIndex": 0,
    "explanation": "'Non dovresti' è un consiglio negativo: 'shouldn't' + verbo base. 'Mustn't' sarebbe un divieto, 'don't have to' dice che non è necessario e 'haven't to' non esiste.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "You shouldn't to drink so much coffee."
  },
  {
    "id": "q357",
    "prompt": "Translate 'Devo togliermi le scarpe?'",
    "options": [
      "Do I have to take off my shoes?",
      "Must I to take off my shoes?",
      "Do I must take off my shoes?",
      "Have I to take off my shoes?"
    ],
    "correctIndex": 0,
    "explanation": "La domanda su un obbligo si fa con 'Do I have to' + verbo base. 'Must I to' è errata perché 'must' non vuole 'to', 'Do I must' perché 'must' non si usa con 'do', e 'Have I to' non è inglese corretto moderno.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "Do I have take off my shoes?"
  },
  {
    "id": "q358",
    "prompt": "Translate 'Non hai bisogno di pagare, è gratis.'",
    "options": [
      "You don't have to pay, it's free.",
      "You mustn't pay, it's free.",
      "You shouldn't pay, it's free.",
      "You haven't to pay, it's free."
    ],
    "correctIndex": 0,
    "explanation": "'Non hai bisogno di pagare' vuol dire che non è necessario: 'don't have to'. 'Mustn't' direbbe che pagare è vietato, 'shouldn't' che è meglio non pagare, e 'haven't to' non esiste.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice",
    "extraOption": "You not have to pay, it's free."
  },
  {
    "id": "q359",
    "prompt": "Translate 'Cosa dovrei fare?'",
    "options": [
      "What should I do?",
      "What must I do?",
      "What have I to do?",
      "What do I do?"
    ],
    "correctIndex": 0,
    "explanation": "'Cosa dovrei fare?' chiede un consiglio, quindi 'What should I do?'. 'Must' esprime obbligo, 'What have I to do' non è corretto e 'What do I do?' è un presente generico, non 'dovrei'.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q360",
    "prompt": "Translate 'Non devi dire niente a nessuno, è un segreto!'",
    "options": [
      "You mustn't tell anyone, it's a secret!",
      "You don't have to tell anyone, it's a secret!",
      "You shouldn't tell anyone, it's a secret!",
      "You haven't to tell anyone, it's a secret!"
    ],
    "correctIndex": 0,
    "explanation": "Dire qualcosa a qualcuno è proibito perché è un segreto: 'mustn't' (divieto). 'Don't have to' direbbe che non è obbligatorio, 'shouldn't' è solo un consiglio e 'haven't to' non esiste.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "theoryId": "modals-obligation-advice"
  },
  {
    "id": "q361",
    "prompt": "Complete: 'She speaks English very _____.' (good/well)",
    "options": [
      "well",
      "good",
      "goodly",
      "welling"
    ],
    "correctIndex": 0,
    "explanation": "Per descrivere come parla (un verbo) serve un avverbio; l'avverbio di 'good' è 'well'. 'Good' è un aggettivo, mentre 'goodly' e 'welling' non esistono.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "bad"
  },
  {
    "id": "q362",
    "prompt": "Complete: 'He drives very _____. It's dangerous!'",
    "options": [
      "fast",
      "fastly",
      "quick",
      "speedy"
    ],
    "correctIndex": 0,
    "explanation": "'Fast' è sia aggettivo sia avverbio e ha la stessa forma: 'drives fast'. 'Fastly' non esiste, e 'quick' è un aggettivo (l'avverbio sarebbe 'quickly').",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q363",
    "prompt": "Complete: 'Please do your work _____. Take your time.'",
    "options": [
      "carefully",
      "careful",
      "careless",
      "carelessly"
    ],
    "correctIndex": 0,
    "explanation": "Serve un avverbio che dica come lavorare: 'carefully' (con attenzione). 'Careful' è un aggettivo, e 'careless/carelessly' significano senza attenzione, in contrasto con 'Take your time'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "care"
  },
  {
    "id": "q364",
    "prompt": "Complete: 'They won the game _____. They were much better.'",
    "options": [
      "easily",
      "easy",
      "easier",
      "easying"
    ],
    "correctIndex": 0,
    "explanation": "Serve un avverbio per descrivere 'won': dall'aggettivo 'easy' si forma 'easily' (y diventa i + -ly). 'Easy' è aggettivo, 'easier' è un comparativo e 'easying' non esiste.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "easiest"
  },
  {
    "id": "q365",
    "prompt": "Complete: 'The old man walked _____ down the street.'",
    "options": [
      "slowly",
      "slowlier",
      "slowingly",
      "slowness"
    ],
    "correctIndex": 0,
    "explanation": "'Walked' è un verbo, quindi serve un avverbio: 'slowly' (aggettivo slow + -ly). 'Slowlier' e 'slowingly' non esistono e 'slowness' è un nome.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "slowy"
  },
  {
    "id": "q366",
    "prompt": "Complete: 'She looked at him _____ when he broke the glass.'",
    "options": [
      "angrily",
      "angry",
      "angrier",
      "angrying"
    ],
    "correctIndex": 0,
    "explanation": "Per dire come lo guardò serve un avverbio: da 'angry' si forma 'angrily' (y diventa i + -ly). 'Angry' è aggettivo, 'angrier' un comparativo e 'angrying' non esiste.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "with angry"
  },
  {
    "id": "q367",
    "prompt": "Complete: 'He worked _____ to pass the exam.'",
    "options": [
      "hard",
      "hardly",
      "hardy",
      "hards"
    ],
    "correctIndex": 0,
    "explanation": "'Hard' è un avverbio irregolare con la stessa forma dell'aggettivo e vuol dire 'con impegno'. 'Hardly' significa 'quasi per niente' (cambia il senso), 'hardy' è un aggettivo (robusto) e 'hards' non esiste.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q368",
    "prompt": "Complete: 'The children were playing _____ in the garden.'",
    "options": [
      "happily",
      "happy",
      "happier",
      "happiness"
    ],
    "correctIndex": 0,
    "explanation": "Per descrivere come giocavano serve un avverbio: da 'happy' si ottiene 'happily'. 'Happy' è aggettivo, 'happier' comparativo e 'happiness' un nome.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "happiest"
  },
  {
    "id": "q369",
    "prompt": "Complete: 'I can run very _____.'",
    "options": [
      "fast",
      "fastly",
      "quick",
      "faster"
    ],
    "correctIndex": 0,
    "explanation": "'Fast' ha la stessa forma come aggettivo e avverbio: 'run very fast'. 'Fastly' non esiste, 'quick' è un aggettivo e 'faster' è un comparativo, che non si usa con 'very'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q370",
    "prompt": "Translate 'Ha risposto alla domanda velocemente.'",
    "options": [
      "He answered the question quickly.",
      "He answered the question quickily.",
      "He answered the question fastly.",
      "He answered the question quickness."
    ],
    "correctIndex": 0,
    "explanation": "'Velocemente' modifica il verbo, quindi serve l'avverbio 'quickly' (aggettivo quick + -ly). 'Quickily' ha l'ortografia sbagliata, 'fastly' non esiste ('fast' ha già la forma di avverbio) e 'quickness' è un nome.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "He answered the question with quick."
  },
  {
    "id": "q371",
    "prompt": "Translate 'Canta davvero bene.'",
    "options": [
      "She sings really well.",
      "She sings really goodly.",
      "She sing really well.",
      "She is sings really well."
    ],
    "correctIndex": 0,
    "explanation": "Con il verbo 'sings' si usa l'avverbio 'well' (bene). 'Goodly' non esiste, 'She sing' non concorda (serve 'sings' con 'she') e 'is sings' mescola due forme verbali.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q372",
    "prompt": "Translate 'Hanno lavorato duramente tutto il giorno.'",
    "options": [
      "They worked hard all day.",
      "They worked hardly all day.",
      "They worked difficultly all day.",
      "They worked heavy all day."
    ],
    "correctIndex": 0,
    "explanation": "'Duramente' nel senso di 'con fatica' è 'hard', avverbio con la stessa forma dell'aggettivo. 'Hardly' vuol dire 'quasi per niente' (senso opposto), 'difficultly' non esiste e 'heavy' è un aggettivo.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q373",
    "prompt": "Translate 'Per favore, parla lentamente.'",
    "options": [
      "Please speak slowly.",
      "Please speak slowness.",
      "Please speak slowlier.",
      "Please speak slowingly."
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'speak' serve un avverbio: 'slowly' (aggettivo slow + -ly). 'Slowness' è un nome, 'slowlier' e 'slowingly' non esistono.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q374",
    "prompt": "Translate 'Ha chiuso la porta silenziosamente.'",
    "options": [
      "He closed the door quietly.",
      "He closed the door quietness.",
      "He closed the door quietlyly.",
      "He closed the door quietily."
    ],
    "correctIndex": 0,
    "explanation": "'Closed' è un verbo, quindi serve un avverbio: 'quietly'. 'Quietness' è un nome, 'quietlyly' ha il suffisso -ly doppio e 'quietily' ha l'ortografia sbagliata.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q375",
    "prompt": "Translate 'Hanno risolto il problema facilmente.'",
    "options": [
      "They solved the problem easily.",
      "They solved the problem easy.",
      "They solved the problem with easy.",
      "They solved the problem easier."
    ],
    "correctIndex": 0,
    "explanation": "Serve un avverbio per 'solved': da 'easy' si forma 'easily'. 'Easy' è aggettivo, 'with easy' non è corretto e 'easier' è un comparativo.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q376",
    "prompt": "Translate 'Guida sempre con molta attenzione (attentamente).'",
    "options": [
      "He always drives carefully.",
      "He always drives careful.",
      "He always drives care.",
      "He always drives with careful."
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'drives' serve un avverbio, 'carefully' (careful + -ly). 'Careful' è aggettivo, 'care' è un nome e 'with careful' non è una costruzione corretta.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q377",
    "prompt": "Translate 'L'insegnante ha spiegato la regola chiaramente.'",
    "options": [
      "The teacher explained the rule clearly.",
      "The teacher explained the rule clear.",
      "The teacher explained the rule cleary.",
      "The teacher explained the rule clearing."
    ],
    "correctIndex": 0,
    "explanation": "Per dire come ha spiegato serve un avverbio: 'clearly' (clear + -ly). 'Clear' è aggettivo, 'cleary' è scritto male e 'clearing' è un gerundio, non un avverbio.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner"
  },
  {
    "id": "q378",
    "prompt": "Translate 'Ho capito perfettamente.'",
    "options": [
      "I understood perfectly.",
      "I understood perfect.",
      "I understood perfection.",
      "I understood perfectlyly."
    ],
    "correctIndex": 0,
    "explanation": "'Understood' è un verbo, quindi serve un avverbio: 'perfectly'. 'Perfect' è aggettivo, 'perfection' è un nome e 'perfectlyly' ha il suffisso doppio.",
    "category": "Traduzione",
    "level": "A2",
    "grammarTopic": "Adverbs of Manner",
    "theoryId": "adverbs-manner",
    "extraOption": "I understood perfectest."
  },
  {
    "id": "q379",
    "prompt": "Complete the sentence: 'If I _____ the lottery, I would buy a big house.'",
    "options": [
      "win",
      "won",
      "will win",
      "had won"
    ],
    "correctIndex": 1,
    "explanation": "Il Second Conditional per situazioni irreali o improbabili nel presente/futuro si forma 'If + Past Simple, would + verbo base'. Perciò 'won'; 'win' e 'will win' appartengono ad altri periodi ipotetici, 'had won' al terzo (passato).",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional",
    "extraOption": "would win"
  },
  {
    "id": "q380",
    "prompt": "Translate 'Se fossi in te, studierei di più.'",
    "options": [
      "If I am you, I will study more.",
      "If I were you, I would study more.",
      "If I was you, I study more.",
      "If I would be you, I studied more."
    ],
    "correctIndex": 1,
    "explanation": "Nel Second Conditional si dice 'If I were you, I would + verbo base' ('Se fossi in te'). Le altre opzioni mescolano i tempi o mettono 'would' nella frase con 'if', che non è corretto.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional",
    "extraOption": "If I were you, I would studying more."
  },
  {
    "id": "q381",
    "prompt": "Complete the sentence: 'If I had studied, I _____ the exam.'",
    "options": [
      "would pass",
      "passed",
      "would have passed",
      "will pass"
    ],
    "correctIndex": 2,
    "explanation": "Con 'If + Past Perfect' (had studied) la frase principale è 'would have + participio passato': 'would have passed'. È il Third Conditional, per una situazione passata che non è più modificabile. 'Would pass' e 'will pass' sono tempi presenti/futuri.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional",
    "extraOption": "would had passed"
  },
  {
    "id": "q382",
    "prompt": "Translate 'Se fossimo partiti prima, non avremmo perso il treno.'",
    "options": [
      "If we left earlier, we wouldn't miss the train.",
      "If we had left earlier, we wouldn't have missed the train.",
      "If we would leave earlier, we hadn't missed the train.",
      "If we have left earlier, we didn't miss the train."
    ],
    "correctIndex": 1,
    "explanation": "'Se fossimo partiti prima, non avremmo perso' è un Third Conditional: 'If + had + participio, would(n't) have + participio'. Le altre opzioni usano tempi sbagliati (left, would leave, have left) o incrociano le due parti.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional",
    "extraOption": "If we had left earlier, we wouldn't missed the train."
  },
  {
    "id": "q383",
    "prompt": "Complete the sentence: 'The letter _____ by John yesterday.'",
    "options": [
      "wrote",
      "was written",
      "is written",
      "writes"
    ],
    "correctIndex": 1,
    "explanation": "'The letter' non scrive, viene scritta: passivo, e con 'yesterday' il Past Simple Passive è 'was written'. 'Wrote' e 'writes' sono attivi, 'is written' è presente.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice",
    "extraOption": "has written"
  },
  {
    "id": "q384",
    "prompt": "Translate 'La casa viene costruita proprio ora.'",
    "options": [
      "The house is built right now.",
      "The house builds right now.",
      "The house is being built right now.",
      "The house has been built right now."
    ],
    "correctIndex": 2,
    "explanation": "'Viene costruita proprio ora' è un'azione in corso nel presente: Present Continuous passivo, 'is being built'. 'Is built' indica un fatto abituale, 'builds' è attivo e 'has been built' dice che è già finita.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice",
    "extraOption": "is been built"
  },
  {
    "id": "q385",
    "prompt": "Change to reported speech: He said, 'I am tired.'",
    "options": [
      "He said that he were tired.",
      "He said that I was tired.",
      "He said that he was tired.",
      "He said that he is being tired."
    ],
    "correctIndex": 2,
    "explanation": "Nel discorso indiretto, dopo 'said' il verbo fa un passo indietro: 'am' diventa 'was', e il pronome segue chi parla: 'he was tired'. 'I was tired' ha il pronome sbagliato, 'he were' non concorda e 'is being tired' non è un tempo adatto.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q386",
    "prompt": "Change to reported speech: 'I will call you,' she told me.",
    "options": [
      "She told me she would calling me.",
      "She told me she would call me.",
      "She told me I would call her.",
      "She told me she called me."
    ],
    "correctIndex": 1,
    "explanation": "Nel discorso indiretto 'will' diventa 'would' (seguito dalla forma base) e il pronome 'I' diventa 'she', mentre 'you' diventa 'me': 'she would call me'. 'Would calling' è sbagliato, 'I would call her' scambia le persone e 'called' trasforma il futuro in passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q387",
    "prompt": "Complete the sentence: 'When I arrived at the station, the train _____.'",
    "options": [
      "will already leave",
      "has already left",
      "had already left",
      "already leaves"
    ],
    "correctIndex": 2,
    "explanation": "Di due azioni passate, quella avvenuta prima va al Past Perfect: il treno era già partito ('had already left') quando sono arrivato. 'Will leave' è futuro, 'has already left' è un Present Perfect e 'leaves' è presente.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q388",
    "prompt": "Translate 'Avevo già mangiato quando mi hai chiamato.'",
    "options": [
      "I had already eat when you called me.",
      "I had already eaten when you called me.",
      "I have already eaten when you called me.",
      "I was eating when you called me."
    ],
    "correctIndex": 1,
    "explanation": "L'azione avvenuta prima ('avevo già mangiato') va al Past Perfect: 'had already eaten'. 'Had eat' usa il participio sbagliato, 'have eaten' è Present Perfect e 'was eating' vorrebbe dire 'stavo mangiando'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q389",
    "prompt": "Complete the sentence: 'I _____ tennis when I was young.'",
    "options": [
      "used to play",
      "was playing",
      "am used to play",
      "use to play"
    ],
    "correctIndex": 0,
    "explanation": "Un'abitudine passata che ora non c'è più si dice con 'used to' + verbo base: 'used to play'. 'Was playing' descrive un'azione in corso, 'am used to play' è errato e 'use to' non va senza 'did' nelle frasi affermative.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q390",
    "prompt": "Choose the correct negative form:",
    "options": [
      "She didn't used to like vegetables.",
      "She hasn't used to like vegetables.",
      "She didn't use to like vegetables.",
      "She don't use to like vegetables."
    ],
    "correctIndex": 2,
    "explanation": "Nella forma negativa con 'didn't' il verbo torna alla forma base: 'didn't use to', senza la -d. 'Didn't used to' raddoppia il passato, 'hasn't used to' e 'don't use to' sono tempi sbagliati (e 'she don't' non concorda).",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q391",
    "prompt": "Complete the sentence: 'The man _____ lives next door is a doctor.'",
    "options": [
      "which",
      "who",
      "whose",
      "where"
    ],
    "correctIndex": 1,
    "explanation": "Per le persone nelle frasi relative si usa 'who': 'The man who lives next door'. 'Which' è per le cose, 'whose' indica possesso e 'where' i luoghi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses",
    "extraOption": "whom"
  },
  {
    "id": "q392",
    "prompt": "Complete the sentence: 'That's the house _____ I grew up.'",
    "options": [
      "which",
      "who",
      "whose",
      "where"
    ],
    "correctIndex": 3,
    "explanation": "Per un luogo si usa 'where' (nella casa dove sono cresciuto). 'Which' vorrebbe 'in which' o 'which I grew up in', 'who' è per le persone e 'whose' indica possesso.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses",
    "extraOption": "what"
  },
  {
    "id": "q393",
    "prompt": "Complete the sentence: 'The girl _____ car was stolen is at the police station.'",
    "options": [
      "who",
      "which",
      "whose",
      "that"
    ],
    "correctIndex": 2,
    "explanation": "'Whose' esprime il possesso (la ragazza la cui auto): 'whose car'. 'Who', 'which' e 'that' non si possono usare davanti a un nome posseduto come 'car'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses",
    "extraOption": "who's"
  },
  {
    "id": "q394",
    "prompt": "Complete the sentence: 'You are Italian, _____?'",
    "options": [
      "are you",
      "aren't you",
      "don't you",
      "isn't it"
    ],
    "correctIndex": 1,
    "explanation": "Dopo una frase affermativa la question tag è negativa e ripete il verbo: 'You are Italian, aren't you?'. 'Are you' è affermativa, 'don't you' ha l'ausiliare sbagliato e 'isn't it' non concorda con 'you'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags",
    "extraOption": "won't you"
  },
  {
    "id": "q395",
    "prompt": "Complete the sentence: 'She didn't go to the party, _____?'",
    "options": [
      "did she",
      "didn't she",
      "does she",
      "was she"
    ],
    "correctIndex": 0,
    "explanation": "Dopo una frase negativa la tag è affermativa e riprende l'ausiliare 'did' di 'didn't go': 'did she?'. 'Didn't she' è negativa, 'does' e 'was' sono ausiliari sbagliati per il passato di 'go'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags",
    "extraOption": "has she"
  },
  {
    "id": "q396",
    "prompt": "Complete the sentence: 'He has a Ferrari and a mansion. I am sure he _____ be very rich.'",
    "options": [
      "can't",
      "must",
      "mustn't",
      "might"
    ],
    "correctIndex": 1,
    "explanation": "Quando le prove sono forti (Ferrari e villa) e si è sicuri, si usa 'must' per una deduzione quasi certa: 'He must be very rich'. 'Can't' e 'mustn't' dicono il contrario, e 'might' indica solo una possibilità debole, che non va con 'I am sure'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q397",
    "prompt": "Complete the sentence: 'That _____ be Sarah. Sarah is currently in London.'",
    "options": [
      "mustn't",
      "will",
      "can't",
      "must"
    ],
    "correctIndex": 2,
    "explanation": "Se Sarah è a Londra, sei sicuro che non può essere lei: 'can't' esprime la deduzione negativa forte. 'Mustn't' è un divieto, 'will' è futuro e 'must' direbbe l'opposto (sei sicuro che è lei).",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q398",
    "prompt": "Complete the sentence: 'I really enjoy _____ books in my free time.'",
    "options": [
      "to read",
      "read",
      "reading",
      "to reading"
    ],
    "correctIndex": 2,
    "explanation": "'Enjoy' è seguito dal gerundio (-ing): 'enjoy reading'. L'infinito (to read, read) non si usa dopo 'enjoy', e 'to reading' non ha senso qui.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives",
    "extraOption": "for reading"
  },
  {
    "id": "q399",
    "prompt": "Complete the sentence: 'She decided _____ a new car.'",
    "options": [
      "buying",
      "to buy",
      "buy",
      "bought"
    ],
    "correctIndex": 1,
    "explanation": "'Decide' regge l'infinito con 'to': 'decided to buy'. Il gerundio (buying), il verbo base (buy) e il passato (bought) non si usano dopo 'decide'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives",
    "extraOption": "for buying"
  },
  {
    "id": "q400",
    "prompt": "Complete the sentence: 'Do you mind _____ the window?'",
    "options": [
      "open",
      "to open",
      "opening",
      "opened"
    ],
    "correctIndex": 2,
    "explanation": "'Mind' regge il gerundio: 'Do you mind opening...?'. Dopo 'do you mind' non si usa né il verbo base, né 'to open', né il passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives",
    "extraOption": "for opening"
  },
  {
    "id": "q401",
    "prompt": "The restaurant _____ we had dinner is very expensive.",
    "options": [
      "where",
      "which",
      "that",
      "who"
    ],
    "correctIndex": 0,
    "explanation": "Il ristorante è un luogo e la frase continua con un soggetto ('we had dinner'), quindi serve 'where' (= in cui). 'Which' e 'that' richiederebbero una preposizione ('at which', 'which we had dinner at'), 'who' è per le persone.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q402",
    "prompt": "This is the man _____ dog bit me.",
    "options": [
      "whose",
      "who",
      "which",
      "that"
    ],
    "correctIndex": 0,
    "explanation": "Il cane è dell'uomo: possesso, quindi 'whose'. Dopo 'who', 'which' e 'that' il nome 'dog' non può seguire direttamente per indicare il possessore.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q403",
    "prompt": "My sister, _____ lives in London, is coming to visit.",
    "options": [
      "who",
      "that",
      "which",
      "where"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase relativa non limitativa (tra virgole) riferita a una persona si usa 'who' e non si può usare 'that'. 'Which' è per le cose e 'where' per i luoghi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q404",
    "prompt": "Translate: 'Il film che abbiamo visto ieri era noioso.'",
    "options": [
      "The movie which we watched yesterday was boring.",
      "The movie who we watched yesterday was boring.",
      "The movie where we watched yesterday was boring.",
      "The movie whose we watched yesterday was boring."
    ],
    "correctIndex": 0,
    "explanation": "Il film è una cosa, quindi serve 'which'. 'Who' è per le persone, 'where' per i luoghi e 'whose' indica possesso.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q405",
    "prompt": "Translate: 'La donna la cui auto è stata rubata è la mia vicina.'",
    "options": [
      "The woman whose car was stolen is my neighbor.",
      "The woman who car was stolen is my neighbor.",
      "The woman which car was stolen is my neighbor.",
      "The woman that car was stolen is my neighbor."
    ],
    "correctIndex": 0,
    "explanation": "'La cui auto' esprime possesso e si traduce con 'whose': 'The woman whose car was stolen'. 'Who', 'which' e 'that' non si possono mettere davanti a 'car' con questo significato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q406",
    "prompt": "The days _____ I was young were the best.",
    "options": [
      "when",
      "where",
      "which",
      "who"
    ],
    "correctIndex": 0,
    "explanation": "Per un periodo di tempo ('i giorni in cui ero giovane') si usa 'when'. 'Where' è per i luoghi, 'who' per le persone e 'which' sostituisce una cosa, non un tempo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q407",
    "prompt": "I know a place _____ you can hide.",
    "options": [
      "where",
      "which",
      "that",
      "when"
    ],
    "correctIndex": 0,
    "explanation": "Per un luogo in cui si può fare qualcosa si usa 'where': 'a place where you can hide'. 'Which' e 'that' richiederebbero 'in' alla fine ('which you can hide in'), mentre 'when' è per il tempo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q408",
    "prompt": "The student _____ got the highest grade is from Spain.",
    "options": [
      "who",
      "which",
      "where",
      "whose"
    ],
    "correctIndex": 0,
    "explanation": "Lo studente è una persona e fa da soggetto: 'who'. 'Which' è per le cose, 'where' per i luoghi, 'whose' indica possesso e non ha senso con 'got the highest grade'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q409",
    "prompt": "Translate: 'Questo è il libro di cui ti parlavo.'",
    "options": [
      "This is the book which I was telling you about.",
      "This is the book who I was telling you about.",
      "This is the book where I was telling you about.",
      "This is the book whose I was telling you about."
    ],
    "correctIndex": 0,
    "explanation": "'Il libro di cui ti parlavo' è una cosa: 'which', con la preposizione 'about' in fondo (I was telling you about). 'Who' è per le persone, 'where' per i luoghi e 'whose' indica possesso.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q410",
    "prompt": "Translate: 'Parigi, che è la capitale della Francia, è bellissima.'",
    "options": [
      "Paris, which is the capital of France, is beautiful.",
      "Paris, who is the capital of France, is beautiful.",
      "Paris, where is the capital of France, is beautiful.",
      "Paris, that is the capital of France, is beautiful."
    ],
    "correctIndex": 0,
    "explanation": "Nella frase non limitativa (tra virgole) riferita a una cosa si usa 'which'. 'Who' è per le persone, 'where' non è corretto e 'that' non si usa dopo una virgola.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q411",
    "prompt": "Someone _____ travels a lot is lucky.",
    "options": [
      "who",
      "which",
      "whose",
      "where"
    ],
    "correctIndex": 0,
    "explanation": "'Someone' è una persona e fa da soggetto: 'who travels'. 'Which' è per le cose, 'whose' indica possesso e 'where' i luoghi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q412",
    "prompt": "The cake _____ she made was delicious.",
    "options": [
      "which",
      "who",
      "whose",
      "where"
    ],
    "correctIndex": 0,
    "explanation": "'The cake' è una cosa: 'which' (la torta che lei ha fatto). 'Who' è per le persone, 'whose' indica possesso e 'where' i luoghi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q413",
    "prompt": "A library is a place _____ you can borrow books.",
    "options": [
      "where",
      "which",
      "who",
      "when"
    ],
    "correctIndex": 0,
    "explanation": "Una biblioteca è un luogo in cui si fa qualcosa: 'where'. 'Which' richiederebbe 'in which', 'who' è per le persone e 'when' per il tempo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q414",
    "prompt": "The boy _____ sister is in my class is very tall.",
    "options": [
      "whose",
      "who",
      "which",
      "that"
    ],
    "correctIndex": 0,
    "explanation": "'Whose' indica possesso: la sorella del ragazzo. 'Who', 'which' e 'that' non si usano davanti a un nome posseduto come 'sister'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q415",
    "prompt": "Winter is the season _____ it snows.",
    "options": [
      "when",
      "which",
      "where",
      "who"
    ],
    "correctIndex": 0,
    "explanation": "L'inverno è un periodo di tempo, quindi 'when it snows'. 'Which' e 'who' non hanno senso qui e 'where' è per i luoghi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q416",
    "prompt": "I always try to avoid _____ in traffic during rush hour.",
    "options": [
      "driving",
      "to drive",
      "drive",
      "drove"
    ],
    "correctIndex": 0,
    "explanation": "'Avoid' è seguito dal gerundio: 'avoid driving'. L'infinito 'to drive', il verbo base e il passato non si usano dopo 'avoid'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q417",
    "prompt": "We hope _____ you again soon.",
    "options": [
      "to see",
      "seeing",
      "see",
      "saw"
    ],
    "correctIndex": 0,
    "explanation": "'Hope' regge l'infinito con 'to': 'hope to see'. Il gerundio (seeing), il verbo base (see) e il passato (saw) non si usano dopo 'hope'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q418",
    "prompt": "Avoid _____ mistakes by checking your work.",
    "options": [
      "making",
      "to make",
      "make",
      "made"
    ],
    "correctIndex": 0,
    "explanation": "'Avoid' è seguito dal gerundio: 'avoid making mistakes'. 'To make', 'make' e 'made' non sono possibili dopo 'avoid'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q419",
    "prompt": "She promised _____ me with my homework.",
    "options": [
      "to help",
      "helping",
      "help",
      "helped"
    ],
    "correctIndex": 0,
    "explanation": "'Promise' regge l'infinito con 'to': 'promised to help'. Dopo 'promise' non si usa il gerundio (helping), il verbo base o il passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q420",
    "prompt": "Translate: 'Ho finito di leggere il libro.'",
    "options": [
      "I finished reading the book.",
      "I finished to read the book.",
      "I finished read the book.",
      "I finish reading the book."
    ],
    "correctIndex": 0,
    "explanation": "'Finish' regge il gerundio: 'finished reading'. 'Finished to read' e 'finished read' sono errati, e 'I finish' è presente mentre 'ho finito' è passato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q421",
    "prompt": "Translate: 'Lui ha deciso di studiare all'estero.'",
    "options": [
      "He decided to study abroad.",
      "He decided studying abroad.",
      "He decided study abroad.",
      "He decides to study abroad."
    ],
    "correctIndex": 0,
    "explanation": "Il verbo decide vuole l'infinito con to (decided to study). L'italiano \"ha deciso\" è passato, quindi decides (presente) non va bene, e dopo decide non si usa né la forma in -ing né l'infinito senza to.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q422",
    "prompt": "Are you planning _____ to the party?",
    "options": [
      "to go",
      "going",
      "go",
      "went"
    ],
    "correctIndex": 0,
    "explanation": "Plan è seguito dall'infinito con to: plan to go. La forma in -ing (going) dopo plan è sbagliata, e went è un passato che non può stare dopo are you planning.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q423",
    "prompt": "I miss _____ near the sea.",
    "options": [
      "living",
      "to live",
      "live",
      "lived"
    ],
    "correctIndex": 0,
    "explanation": "Dopo miss (sentire la mancanza di, rimpiangere) si usa la forma in -ing: miss living. To live, live e lived non sono costruzioni possibili dopo questo verbo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q424",
    "prompt": "Translate: 'Non mi dispiace alzarmi presto.'",
    "options": [
      "I don't mind getting up early.",
      "I don't mind to get up early.",
      "I don't mind get up early.",
      "I not mind getting up early."
    ],
    "correctIndex": 0,
    "explanation": "Dopo mind si usa la forma in -ing: don't mind getting up. Nella frase negativa serve don't (non \"I not mind\"), e dopo mind non si mette to + infinito.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q425",
    "prompt": "Translate: 'Loro vogliono comprare una casa nuova.'",
    "options": [
      "They want to buy a new house.",
      "They want buying a new house.",
      "They want buy a new house.",
      "They want to buying a new house."
    ],
    "correctIndex": 0,
    "explanation": "Want è seguito dall'infinito con to: want to buy. Forme come \"want buying\" o \"want to buying\" mescolano due costruzioni e non esistono.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q426",
    "prompt": "He offered _____ for dinner.",
    "options": [
      "to pay",
      "paying",
      "pay",
      "paid"
    ],
    "correctIndex": 0,
    "explanation": "Offer vuole l'infinito con to: offered to pay (\"si è offerto di pagare\"). Paying e paid non sono possibili dopo offer.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q427",
    "prompt": "Keep _____ until you reach the station.",
    "options": [
      "walking",
      "to walk",
      "walk",
      "walked"
    ],
    "correctIndex": 0,
    "explanation": "Keep + -ing significa \"continuare a\": keep walking. Dopo keep non si usa l'infinito (to walk) né il verbo base.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q428",
    "prompt": "I would like _____ a pizza.",
    "options": [
      "to order",
      "ordering",
      "order",
      "ordered"
    ],
    "correctIndex": 0,
    "explanation": "Would like (\"vorrei\") si costruisce con l'infinito con to: I would like to order. La forma in -ing non va bene dopo would like.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q429",
    "prompt": "Please stop _____ noise, the baby is sleeping.",
    "options": [
      "making",
      "to making",
      "make",
      "made"
    ],
    "correctIndex": 0,
    "explanation": "Dopo stop si usa -ing per dire \"smettere di fare\": stop making noise. To making, make e made sono forme impossibili: dopo stop si può avere solo -ing oppure to + verbo base (con un altro significato).",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q430",
    "prompt": "I remembered _____ the door before leaving.",
    "options": [
      "to lock",
      "to locking",
      "lock",
      "locked"
    ],
    "correctIndex": 0,
    "explanation": "Remember + to + infinito vuol dire \"ricordarsi di fare\" (non dimenticare). Dopo to si usa sempre il verbo base: to lock, mai \"to locking\"; locked e lock da soli non completano la frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q431",
    "prompt": "If I _____ more time, I would learn a new language.",
    "options": [
      "had",
      "have",
      "would have",
      "will have"
    ],
    "correctIndex": 0,
    "explanation": "Nel secondo condizionale (situazione irreale o improbabile) la frase con if usa il past simple: if I had. Would have e will have non si mettono mai dopo if in questo tipo di frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q432",
    "prompt": "What would you do if you _____ a ghost?",
    "options": [
      "saw",
      "see",
      "would see",
      "will see"
    ],
    "correctIndex": 0,
    "explanation": "Se la frase principale ha would (what would you do), nella parte con if serve il past simple: if you saw. Would see e will see dopo if sono sbagliati.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q433",
    "prompt": "If she _____ closer, we would see her more often.",
    "options": [
      "lived",
      "lives",
      "would live",
      "will live"
    ],
    "correctIndex": 0,
    "explanation": "Secondo condizionale: if + past simple (lived), poi would + verbo base nella frase principale. Dopo if non si mette would e nemmeno will.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q434",
    "prompt": "Translate: 'Se fossi ricco, viaggerei per il mondo.'",
    "options": [
      "If I were rich, I would travel the world.",
      "If I am rich, I will travel the world.",
      "If I was rich, I travel the world.",
      "If I would be rich, I traveled the world."
    ],
    "correctIndex": 0,
    "explanation": "Il secondo condizionale è if + past simple (con be si usa were), poi would + verbo base. Le altre opzioni mischiano i tempi: if I am + will è primo condizionale, e would dopo if è sbagliato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q435",
    "prompt": "Translate: 'Se lei sapesse la verità, si arrabbierebbe.'",
    "options": [
      "If she knew the truth, she would be angry.",
      "If she knows the truth, she will be angry.",
      "If she would know the truth, she was angry.",
      "If she knew the truth, she will be angry."
    ],
    "correctIndex": 0,
    "explanation": "\"Se sapesse\" si traduce con if she knew (past simple) e \"si arrabbierebbe\" con she would be angry. Nelle altre opzioni compaiono knows, would know o will be, che non rispettano lo schema if + past simple, would + verbo.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q436",
    "prompt": "If they _____ so much pizza, they wouldn't feel sick.",
    "options": [
      "didn't eat",
      "don't eat",
      "wouldn't eat",
      "won't eat"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase con if negativa del secondo condizionale si usa didn't + verbo base: if they didn't eat. Wouldn't e won't non si usano dopo if, e don't eat è presente.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q437",
    "prompt": "I would buy that car if it _____ cheaper.",
    "options": [
      "were",
      "is",
      "would be",
      "will be"
    ],
    "correctIndex": 0,
    "explanation": "Nel secondo condizionale il verbo be nella frase con if diventa were per tutte le persone: if it were cheaper. Is, would be e will be non vanno dopo if in questo schema.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q438",
    "prompt": "If you _____ more, you would pass the exam.",
    "options": [
      "studied",
      "study",
      "would study",
      "will study"
    ],
    "correctIndex": 0,
    "explanation": "Secondo condizionale: if + past simple (studied), poi would + verbo base (would pass). Study è presente e would study / will study non si usano dopo if.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q439",
    "prompt": "Translate: 'Non andrei lì se fossi in te.'",
    "options": [
      "I wouldn't go there if I were you.",
      "I won't go there if I am you.",
      "I didn't go there if I were you.",
      "I don't go there if I was you."
    ],
    "correctIndex": 0,
    "explanation": "If I were you è la formula standard per dare un consiglio, con la frase principale in would + verbo base (wouldn't go). Le altre opzioni usano won't, didn't o don't, che non sono tempi da secondo condizionale.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q440",
    "prompt": "Translate: 'Se avessimo una macchina, potremmo andare in montagna.'",
    "options": [
      "If we had a car, we could go to the mountains.",
      "If we have a car, we can go to the mountains.",
      "If we had a car, we will go to the mountains.",
      "If we would have a car, we went to the mountains."
    ],
    "correctIndex": 0,
    "explanation": "Secondo condizionale: if we had a car (past simple) e nella principale un modale al condizionale come could (il condizionale di can). Can e will appartengono al primo condizionale, e would have dopo if è sbagliato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q441",
    "prompt": "If he _____ his job, he would travel more.",
    "options": [
      "quit",
      "quits",
      "will quit",
      "would quit"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase con if serve il past simple, e quit ha lo stesso aspetto al presente e al passato: if he quit. Would quit non si mette dopo if, e quits o will quit non sono passati.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q442",
    "prompt": "She would be happier if she _____ a better job.",
    "options": [
      "found",
      "finds",
      "will find",
      "would find"
    ],
    "correctIndex": 0,
    "explanation": "Nel secondo condizionale la frase con if va al past simple: if she found. Finds e will find sono tempi presente e futuro, would find non va dopo if.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q443",
    "prompt": "If it _____ snowing, we could go for a walk.",
    "options": [
      "stopped",
      "stops",
      "will stop",
      "would stop"
    ],
    "correctIndex": 0,
    "explanation": "Past simple dopo if: if it stopped snowing, we could go. Stops e will stop sono presente e futuro, would stop non si usa dopo if.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q444",
    "prompt": "I _____ you if I knew the answer.",
    "options": [
      "would tell",
      "tell",
      "told",
      "will tell"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase principale del secondo condizionale serve would + verbo base: I would tell you. Tell, told e will tell non danno il condizionale richiesto dalla frase con if knew.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q445",
    "prompt": "If we _____ in a big city, we would use public transport.",
    "options": [
      "lived",
      "live",
      "will live",
      "would live"
    ],
    "correctIndex": 0,
    "explanation": "Secondo condizionale: dopo if si usa il past simple (lived), nella principale would use. Live, will live e would live non vanno dopo if.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q446",
    "prompt": "Translate: 'Se parlassi francese, mi trasferirei a Parigi.'",
    "options": [
      "If I spoke French, I would move to Paris.",
      "If I speak French, I will move to Paris.",
      "If I would speak French, I moved to Paris.",
      "If I spoke French, I will move to Paris."
    ],
    "correctIndex": 0,
    "explanation": "\"Se parlassi\" è if I spoke (past simple) e \"mi trasferirei\" è I would move. Le altre opzioni mescolano i tempi: speak + will è primo condizionale, would speak dopo if è sbagliato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Second Conditional",
    "theoryId": "second-conditional"
  },
  {
    "id": "q447",
    "prompt": "If I _____ earlier, I would have caught the train.",
    "options": [
      "had woken up",
      "woke up",
      "would wake up",
      "have woken up"
    ],
    "correctIndex": 0,
    "explanation": "Terzo condizionale (passato irreale): if + past perfect (had woken up), poi would have + participio passato. Woke up e would wake up non esprimono ciò che non è successo nel passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q448",
    "prompt": "She would have passed if she _____ harder.",
    "options": [
      "had studied",
      "studied",
      "would study",
      "has studied"
    ],
    "correctIndex": 0,
    "explanation": "Nel terzo condizionale la frase con if usa il past perfect: if she had studied. Studied da solo è un past simple, would study e has studied non completano la struttura.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q449",
    "prompt": "If we had known, we _____ you.",
    "options": [
      "would have helped",
      "would help",
      "helped",
      "had helped"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase principale del terzo condizionale serve would have + participio passato: we would have helped you. Would help è secondo condizionale e had helped è un past perfect, che non va nella principale.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q450",
    "prompt": "Translate: 'Se fossi andato a letto presto, non sarei stato stanco.'",
    "options": [
      "If I had gone to bed early, I wouldn't have been tired.",
      "If I went to bed early, I wouldn't be tired.",
      "If I had gone to bed early, I wasn't tired.",
      "If I would go to bed early, I wouldn't have been tired."
    ],
    "correctIndex": 0,
    "explanation": "\"Se fossi andato\" è if I had gone (past perfect) e \"non sarei stato\" è I wouldn't have been (would have + participio). Le altre opzioni usano tempi che parlano del presente o non rispettano lo schema del terzo condizionale.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q451",
    "prompt": "Translate: 'Se avesse piovuto, saremmo rimasti a casa.'",
    "options": [
      "If it had rained, we would have stayed at home.",
      "If it rained, we would stay at home.",
      "If it had rained, we stayed at home.",
      "If it rains, we will stay at home."
    ],
    "correctIndex": 0,
    "explanation": "\"Se avesse piovuto, saremmo rimasti\" è if it had rained, we would have stayed. Se si usano rained o rains si parla di presente o futuro, e we stayed non è un condizionale.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q452",
    "prompt": "If he had driven carefully, he _____ the accident.",
    "options": [
      "wouldn't have had",
      "wouldn't have",
      "didn't have",
      "hadn't had"
    ],
    "correctIndex": 0,
    "explanation": "Nella principale negativa del terzo condizionale si usa wouldn't have + participio passato: wouldn't have had the accident. Wouldn't have da solo non ha il participio, e didn't have e hadn't had non sono condizionali.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q453",
    "prompt": "They would have won if they _____ better.",
    "options": [
      "had played",
      "played",
      "would play",
      "have played"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase con if del terzo condizionale serve il past perfect: if they had played. Played è un semplice passato, would play e have played non vanno dopo if in questo schema.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q454",
    "prompt": "If I _____ the umbrella, I would have gotten wet.",
    "options": [
      "hadn't taken",
      "didn't take",
      "wouldn't take",
      "haven't taken"
    ],
    "correctIndex": 0,
    "explanation": "La frase con if negativa del terzo condizionale usa hadn't + participio passato: if I hadn't taken. Didn't take, wouldn't take e haven't taken non sono past perfect.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q455",
    "prompt": "Translate: 'Cosa avresti fatto se lo avessi saputo?'",
    "options": [
      "What would you have done if you had known?",
      "What would you do if you knew?",
      "What did you do if you had known?",
      "What have you done if you knew?"
    ],
    "correctIndex": 0,
    "explanation": "Domanda al terzo condizionale: What would you have done if you had known? Le altre opzioni cambiano i tempi (would you do + knew è secondo condizionale) e non esprimono il passato irreale dell'italiano.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q456",
    "prompt": "Translate: 'Se avessi visto il messaggio, ti avrei risposto.'",
    "options": [
      "If I had seen the message, I would have replied.",
      "If I saw the message, I would reply.",
      "If I would have seen the message, I replied.",
      "If I had seen the message, I had replied."
    ],
    "correctIndex": 0,
    "explanation": "\"Se avessi visto, ti avrei risposto\" è if I had seen (past perfect), I would have replied. Would have dopo if (would have seen) e had replied nella principale sono sbagliati.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q457",
    "prompt": "If she _____ the directions, she wouldn't have gotten lost.",
    "options": [
      "had followed",
      "followed",
      "would follow",
      "has followed"
    ],
    "correctIndex": 0,
    "explanation": "Terzo condizionale: if + past perfect (had followed), poi would have + participio (wouldn't have gotten lost). Followed da solo, would follow e has followed non rispettano la struttura.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q458",
    "prompt": "I _____ to the party if they had invited me.",
    "options": [
      "would have gone",
      "would go",
      "went",
      "had gone"
    ],
    "correctIndex": 0,
    "explanation": "La principale del terzo condizionale usa would have + participio passato: I would have gone. Would go è secondo condizionale, went è un passato semplice e had gone è un past perfect, che qui non va.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q459",
    "prompt": "If it _____ so cold, we would have gone swimming.",
    "options": [
      "hadn't been",
      "wasn't",
      "wouldn't be",
      "hasn't been"
    ],
    "correctIndex": 0,
    "explanation": "Nella frase con if negativa del terzo condizionale serve hadn't + participio: if it hadn't been so cold. Wasn't, wouldn't be e hasn't been non sono past perfect.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q460",
    "prompt": "We would have bought the house if it _____ cheaper.",
    "options": [
      "had been",
      "was",
      "would be",
      "has been"
    ],
    "correctIndex": 0,
    "explanation": "Past perfect di be: had been (if it had been cheaper), perché si parla di un'occasione passata mancata. Was, would be e has been non vanno nel terzo condizionale dopo if.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q461",
    "prompt": "If you had asked me, I _____ yes.",
    "options": [
      "would have said",
      "would say",
      "said",
      "had said"
    ],
    "correctIndex": 0,
    "explanation": "Nella principale del terzo condizionale serve would have + participio passato: I would have said yes. Would say, said e had said non danno il senso di \"avrei detto\".",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q462",
    "prompt": "Translate: 'Sarebbe venuta se avesse avuto tempo.'",
    "options": [
      "She would have come if she had had time.",
      "She would come if she had time.",
      "She came if she had had time.",
      "She would have came if she had time."
    ],
    "correctIndex": 0,
    "explanation": "\"Sarebbe venuta se avesse avuto\" è she would have come if she had had time: had had è il past perfect di have (had + participio had). Would have came è sbagliato perché dopo would have serve il participio (come, non came).",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Third Conditional",
    "theoryId": "third-conditional"
  },
  {
    "id": "q463",
    "prompt": "The Mona Lisa _____ by Leonardo da Vinci.",
    "options": [
      "was painted",
      "painted",
      "is painted",
      "paints"
    ],
    "correctIndex": 0,
    "explanation": "Un dipinto fatto da Leonardo in passato richiede il passivo al past simple: was + participio passato (was painted). Painted da solo è attivo, is painted è presente e paints è attivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q464",
    "prompt": "English _____ in many countries around the world.",
    "options": [
      "is spoken",
      "speaks",
      "was spoken",
      "has spoken"
    ],
    "correctIndex": 0,
    "explanation": "Per un fatto generale si usa il passivo al present simple: is + participio passato (is spoken). Speaks è attivo, was spoken è passato e has spoken è attivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q465",
    "prompt": "My car _____ at the moment.",
    "options": [
      "is being repaired",
      "is repairing",
      "repairs",
      "has repaired"
    ],
    "correctIndex": 0,
    "explanation": "At the moment indica un'azione in corso, quindi passivo al present continuous: is being repaired. Is repairing è attivo (l'auto non ripara), repairs e has repaired sono tempi diversi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q466",
    "prompt": "Translate: 'Il libro è stato scritto nel 1990.'",
    "options": [
      "The book was written in 1990.",
      "The book is written in 1990.",
      "The book wrote in 1990.",
      "The book has been written in 1990."
    ],
    "correctIndex": 0,
    "explanation": "\"È stato scritto nel 1990\" ha una data precisa nel passato, quindi passivo al past simple: was written. Is written è presente, wrote è attivo e has been written non si usa con una data definita come 1990.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q467",
    "prompt": "Translate: 'La stanza viene pulita ogni giorno.'",
    "options": [
      "The room is cleaned every day.",
      "The room was cleaned every day.",
      "The room is being cleaned every day.",
      "The room cleans every day."
    ],
    "correctIndex": 0,
    "explanation": "\"Viene pulita ogni giorno\" è un'abitudine: passivo al present simple, is cleaned. Was cleaned è passato, is being cleaned indica un'azione in corso e non una routine, cleans è attivo.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q468",
    "prompt": "A new supermarket _____ in our town next year.",
    "options": [
      "will be built",
      "will build",
      "is built",
      "was built"
    ],
    "correctIndex": 0,
    "explanation": "Con next year serve il futuro passivo: will be + participio passato (will be built). Will build è attivo (il supermercato non costruisce), is built e was built sono presente e passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q469",
    "prompt": "The thieves _____ by the police yesterday.",
    "options": [
      "were caught",
      "caught",
      "are caught",
      "have caught"
    ],
    "correctIndex": 0,
    "explanation": "Yesterday richiede il passato e i ladri subiscono l'azione, quindi passivo al past simple plurale: were caught. Caught è attivo, are caught è presente, have caught è attivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q470",
    "prompt": "This picture _____ by my grandfather.",
    "options": [
      "was taken",
      "took",
      "is taken",
      "takes"
    ],
    "correctIndex": 0,
    "explanation": "Il quadro è stato fatto da qualcuno, in passato: passivo al past simple, was taken. Took è attivo, is taken è presente e takes è attivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q471",
    "prompt": "Translate: 'I biglietti sono già stati venduti.'",
    "options": [
      "The tickets have already been sold.",
      "The tickets has already been sold.",
      "The tickets have already being sold.",
      "The tickets have already be sold."
    ],
    "correctIndex": 0,
    "explanation": "\"Sono già stati venduti\" è un passivo al present perfect: have + been + participio (have already been sold). Has non concorda con tickets (plurale), being è il gerundio e be è la forma base: nessuna delle due completa il passivo del present perfect.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q472",
    "prompt": "Translate: 'Il problema deve essere risolto subito.'",
    "options": [
      "The problem must be solved immediately.",
      "The problem must solve immediately.",
      "The problem has to solve immediately.",
      "The problem must been solved immediately."
    ],
    "correctIndex": 0,
    "explanation": "Con un verbo modale il passivo è modale + be + participio: must be solved. Must solve è attivo, has to solve è attivo e must been solved sbaglia perché dopo must serve be, non been.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q473",
    "prompt": "The emails _____ every morning at 8 am.",
    "options": [
      "are sent",
      "send",
      "were sent",
      "have sent"
    ],
    "correctIndex": 0,
    "explanation": "Every morning indica un'abitudine, quindi passivo al present simple: are sent (le email sono inviate). Send è attivo, were sent è passato e have sent è attivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q474",
    "prompt": "The dinner _____ when the guests arrived.",
    "options": [
      "was being cooked",
      "was cooking",
      "is cooked",
      "has been cooked"
    ],
    "correctIndex": 0,
    "explanation": "When the guests arrived indica un'azione in corso nel passato: passivo al past continuous, was being cooked. Was cooking è attivo, is cooked è presente e has been cooked è un present perfect.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q475",
    "prompt": "The bridge _____ in 2005.",
    "options": [
      "was built",
      "built",
      "is built",
      "has built"
    ],
    "correctIndex": 0,
    "explanation": "In 2005 è una data passata e il ponte è stato costruito (non costruisce), quindi passivo al past simple: was built. Built è attivo, is built è presente e has built è attivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q476",
    "prompt": "All the cake _____ by the children before I came.",
    "options": [
      "had been eaten",
      "had eaten",
      "was eating",
      "is eaten"
    ],
    "correctIndex": 0,
    "explanation": "Before I came indica un'azione conclusa prima di un altro momento passato, quindi past perfect passivo: had been eaten. Had eaten è attivo (il dolce non mangia), was eating e is eaten non mostrano il prima.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q477",
    "prompt": "The keys _____ on the table yesterday.",
    "options": [
      "were left",
      "left",
      "are left",
      "have left"
    ],
    "correctIndex": 0,
    "explanation": "Yesterday richiede il passato e le chiavi subiscono l'azione: passivo al past simple, were left. Left è attivo, are left è presente e have left è attivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q478",
    "prompt": "Translate: 'La mia bicicletta è stata rubata ieri.'",
    "options": [
      "My bicycle was stolen yesterday.",
      "My bicycle is stolen yesterday.",
      "My bicycle has been stolen yesterday.",
      "My bicycle stole yesterday."
    ],
    "correctIndex": 0,
    "explanation": "\"È stata rubata ieri\" ha un tempo passato preciso, quindi passivo al past simple: was stolen. Has been stolen non si usa con yesterday, is stolen è presente e stole è attivo.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Passive Voice",
    "theoryId": "passive-voice"
  },
  {
    "id": "q479",
    "prompt": "He said, 'I like apples.' -> He said that he _____ apples.",
    "options": [
      "liked",
      "was liking",
      "like",
      "liking"
    ],
    "correctIndex": 0,
    "explanation": "Nel discorso indiretto con said (passato) il present simple slitta al past simple: he liked apples. Like senza -s è sbagliato con he, e was liking e liking non vanno con un verbo di gusto come like.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q480",
    "prompt": "She said, 'I am watching TV.' -> She said that she _____ TV.",
    "options": [
      "was watching",
      "were watching",
      "watching",
      "had watched"
    ],
    "correctIndex": 0,
    "explanation": "Nel discorso indiretto il present continuous diventa past continuous: she was watching TV. Were non concorda con she, watching da solo non ha l'ausiliare, e had watched è un past perfect che indicherebbe un'azione finita prima, non in corso.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q481",
    "prompt": "'I will go,' he said. -> He said that he _____ go.",
    "options": [
      "would",
      "going to",
      "can",
      "could"
    ],
    "correctIndex": 0,
    "explanation": "Nel discorso indiretto will diventa would: he said that he would go. Going to manca dell'ausiliare (was going to go), mentre can e could esprimono capacità o possibilità e non il futuro di \"I will go\".",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q482",
    "prompt": "Translate: 'Mi ha detto che era stanco.'",
    "options": [
      "He told me that he was tired.",
      "He said me that he was tired.",
      "He told to me that he was tired.",
      "He said that he is tired."
    ],
    "correctIndex": 0,
    "explanation": "Tell vuole sempre un complemento di persona (told me), mentre say no: he told me that... Said me e told to me sono costruzioni sbagliate, e he is tired non rispetta lo slittamento al passato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q483",
    "prompt": "Translate: 'Lei disse che non sapeva la risposta.'",
    "options": [
      "She said that she didn't know the answer.",
      "She told that she didn't know the answer.",
      "She said that she didn't knew the answer.",
      "She told me that she hasn't known the answer."
    ],
    "correctIndex": 0,
    "explanation": "Said non vuole il pronome (she said that...), told sì. Dopo said il verbo slitta al passato: didn't know. She told that è sbagliato senza complemento, didn't knew ha il passato dopo didn't e hasn't known è un present perfect che non rende \"non sapeva\".",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q484",
    "prompt": "'I have finished,' she said. -> She said that she _____ finished.",
    "options": [
      "had",
      "have",
      "been",
      "having"
    ],
    "correctIndex": 0,
    "explanation": "Nel discorso indiretto il present perfect diventa past perfect: she had finished. Con she il verbo have non concorda (servirebbe has) e non è al passato; been e having non formano il perfetto con finished.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q485",
    "prompt": "He asked me where I _____.",
    "options": [
      "lived",
      "living",
      "did I live",
      "do I live"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande indirette l'ordine è soggetto + verbo, senza do/did, e il tempo slitta al passato: where I lived. Did I live e do I live tengono l'ordine della domanda diretta, e living senza ausiliare non è un verbo coniugato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q486",
    "prompt": "She asked if I _____ coffee.",
    "options": [
      "liked",
      "liking",
      "did I like",
      "do I like"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande sì/no indirette si usa if + soggetto + verbo al passato: if I liked coffee. Did I like e do I like mantengono l'ordine della domanda diretta, e liking senza ausiliare non è un verbo coniugato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q487",
    "prompt": "Translate: 'Mi ha chiesto se volessi venire.'",
    "options": [
      "He asked me if I wanted to come.",
      "He asked me do I want to come.",
      "He said me if I wanted to come.",
      "He told me if I wanted to come."
    ],
    "correctIndex": 0,
    "explanation": "Per le domande indirette si usa asked + if + soggetto + verbo, senza do e al passato: asked me if I wanted. Dopo ask non si usa la domanda diretta (do I want), e said / told me if non reggono if.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q488",
    "prompt": "Translate: 'Ha detto che avrebbe chiamato più tardi.'",
    "options": [
      "He said that he would call later.",
      "He said that he would to call later.",
      "He told that he would call later.",
      "He said that he would called later."
    ],
    "correctIndex": 0,
    "explanation": "Nel discorso indiretto will diventa would: he said that he would call later. Dopo would il verbo resta alla forma base, quindi would to call e would called sono sbagliati; told that senza me è sbagliato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q489",
    "prompt": "'Don't touch that!' he said. -> He told me _____ that.",
    "options": [
      "not to touch",
      "don't touch",
      "didn't touch",
      "not touch"
    ],
    "correctIndex": 0,
    "explanation": "Un ordine negativo riportato si costruisce con told + persona + not to + verbo base: not to touch. Don't touch e didn't touch non si usano nel discorso indiretto, e not touch senza to è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q490",
    "prompt": "'Open the door,' she said. -> She told me _____ the door.",
    "options": [
      "to open",
      "open",
      "opened",
      "opening"
    ],
    "correctIndex": 0,
    "explanation": "Un ordine riportato si costruisce con told + persona + to + verbo base: told me to open. Open, opened e opening non si usano dopo told me.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q491",
    "prompt": "He said, 'I can swim.' -> He said that he _____ swim.",
    "options": [
      "could",
      "can to",
      "would",
      "might"
    ],
    "correctIndex": 0,
    "explanation": "Nel discorso indiretto can diventa could: he said that he could swim. Can to è sbagliato (i modali non vogliono to), mentre would e might cambiano il significato e non rendono la capacità di nuotare.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q492",
    "prompt": "She asked, 'Are you okay?' -> She asked me _____ okay.",
    "options": [
      "if I was",
      "if was I",
      "are you",
      "if am I"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande indirette il tempo slitta e l'ordine è soggetto + verbo: she asked me if I was okay. If was I e if am I mantengono l'ordine della domanda, e are you non ha if e non ha il verbo al passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q493",
    "prompt": "'I must go,' he said. -> He said that he _____ go.",
    "options": [
      "had to",
      "musts",
      "must to",
      "have to"
    ],
    "correctIndex": 0,
    "explanation": "Nel discorso indiretto must di solito diventa had to: he said that he had to go. Musts e must to non esistono, e have to non concorda con he (dovrebbe essere has to).",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q494",
    "prompt": "Translate: 'Mi ha consigliato di studiare.'",
    "options": [
      "He advised me to study.",
      "He advised to study.",
      "He said me to study.",
      "He told to me to study."
    ],
    "correctIndex": 0,
    "explanation": "Advise vuole persona + to + verbo base: he advised me to study. Advised to study manca del complemento di persona, said me e told to me to sono costruzioni sbagliate.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Reported Speech",
    "theoryId": "reported-speech"
  },
  {
    "id": "q495",
    "prompt": "By the time we arrived, the movie _____.",
    "options": [
      "had started",
      "started",
      "has started",
      "starts"
    ],
    "correctIndex": 0,
    "explanation": "By the time + un momento passato richiede il past perfect per ciò che era già successo prima: the movie had started. Started, has started e starts non indicano un'azione anteriore a quella dell'arrivo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q496",
    "prompt": "I realized I _____ my keys at home.",
    "options": [
      "had left",
      "has left",
      "had leave",
      "leaving"
    ],
    "correctIndex": 0,
    "explanation": "Prima hai lasciato le chiavi, poi te ne sei accorto (realized, passato): per l'azione più lontana serve il past perfect, had left. Has left non concorda con I, had leave non ha il participio e leaving non è un verbo coniugato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q497",
    "prompt": "She was tired because she _____ all day.",
    "options": [
      "had worked",
      "had work",
      "has worked",
      "works"
    ],
    "correctIndex": 0,
    "explanation": "Era stanca (passato) perché aveva lavorato prima: past perfect, had worked. Had work non ha il participio, has worked e works non sono tempi del passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q498",
    "prompt": "Translate: 'Avevo appena finito di mangiare quando ha bussato.'",
    "options": [
      "I had just finished eating when he knocked.",
      "I had just finish eating when he knocked.",
      "I have just finished eating when he knocked.",
      "I had just finished to eat when he knocked."
    ],
    "correctIndex": 0,
    "explanation": "\"Avevo appena finito\" è un past perfect con just: had just finished. Had just finish non ha il participio, il present perfect (have just finished) lega l'azione a oggi, e dopo finished si usa -ing (finished eating), non to eat.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q499",
    "prompt": "Translate: 'Non avevo mai visto quel film prima di ieri.'",
    "options": [
      "I had never seen that movie before yesterday.",
      "I had never saw that movie before yesterday.",
      "I have never seen that movie before yesterday.",
      "I hadn't never seen that movie before yesterday."
    ],
    "correctIndex": 0,
    "explanation": "\"Non avevo mai visto\" prima di ieri è un past perfect con never: had never seen. Had never saw usa il past simple al posto del participio, have never seen lega al presente e hadn't never ha una doppia negazione.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q501",
    "prompt": "By the time the manager called, they _____ the project.",
    "options": [
      "had finished",
      "finished",
      "have finished",
      "finish"
    ],
    "correctIndex": 0,
    "explanation": "By the time + passato richiede il past perfect per l'azione conclusa prima: they had finished. Finished, have finished e finish non mostrano che il progetto era già finito quando il manager ha chiamato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q502",
    "prompt": "He didn't want to eat because he _____ lunch.",
    "options": [
      "had already had",
      "had already have",
      "has already had",
      "already has"
    ],
    "correctIndex": 0,
    "explanation": "Non voleva mangiare perché aveva già pranzato prima: past perfect, had already had (had + participio had). Had already have non ha il participio, has already had e already has sono present perfect o presente.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q503",
    "prompt": "Translate: 'Ero arrabbiato perché avevo perso il portafoglio.'",
    "options": [
      "I was angry because I had lost my wallet.",
      "I was angry because I was lost my wallet.",
      "I was angry because I have lost my wallet.",
      "I was angry because I had lose my wallet."
    ],
    "correctIndex": 0,
    "explanation": "\"Avevo perso\" il portafoglio prima di arrabbiarsi: past perfect, had lost. Was lost my wallet non ha senso (was lost vuole un soggetto che si perde), have lost lega a oggi e had lose non ha il participio (lost).",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q504",
    "prompt": "Translate: 'Avevano vissuto lì per dieci anni prima di trasferirsi.'",
    "options": [
      "They had lived there for ten years before moving.",
      "They had live there for ten years before moving.",
      "They have lived there for ten years before moving.",
      "They had lived there since ten years before moving."
    ],
    "correctIndex": 0,
    "explanation": "\"Avevano vissuto per dieci anni prima di trasferirsi\" è un past perfect: had lived there for ten years. Had live non ha il participio, have lived collega al presente e since ten years è sbagliato (con una durata si usa for).",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q505",
    "prompt": "I _____ him before that day.",
    "options": [
      "had never met",
      "had never meet",
      "have never met",
      "never meet"
    ],
    "correctIndex": 0,
    "explanation": "Prima di quel giorno è un momento passato, quindi past perfect: had never met. Had never meet non ha il participio, have never met lega al presente e never meet è presente.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q506",
    "prompt": "The grass was yellow because it _____ all summer.",
    "options": [
      "hadn't rained",
      "hadn't rain",
      "hasn't rained",
      "doesn't rain"
    ],
    "correctIndex": 0,
    "explanation": "L'erba era gialla perché non aveva piovuto per tutta l'estate prima di allora: past perfect negativo, hadn't rained. Hadn't rain non ha il participio, hasn't rained lega al presente e doesn't rain è presente.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q507",
    "prompt": "She passed the test because she _____ hard.",
    "options": [
      "had studied",
      "had study",
      "has studied",
      "studies"
    ],
    "correctIndex": 0,
    "explanation": "Aveva studiato prima di superare il test: past perfect, had studied (had + participio). Had study non ha il participio passato, has studied e studies non vanno in un racconto al passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q508",
    "prompt": "I couldn't open the door because I _____ the key.",
    "options": [
      "had lost",
      "had lose",
      "have lost",
      "lose"
    ],
    "correctIndex": 0,
    "explanation": "Non riusciva ad aprire la porta perché aveva perso la chiave prima: past perfect, had lost. Had lose non ha il participio, have lost lega al presente e lose è presente.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q509",
    "prompt": "By the time I woke up, everyone _____.",
    "options": [
      "had gone",
      "went",
      "has gone",
      "goes"
    ],
    "correctIndex": 0,
    "explanation": "By the time + passato richiede il past perfect: everyone had gone, cioè erano già andati prima che mi svegliassi. Went, has gone e goes non esprimono ciò che era già successo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q510",
    "prompt": "Translate: 'La festa era già finita quando siamo arrivati.'",
    "options": [
      "The party had already ended when we arrived.",
      "The party had already end when we arrived.",
      "The party has already ended when we arrived.",
      "The party had already ending when we arrived."
    ],
    "correctIndex": 0,
    "explanation": "\"Era già finita quando siamo arrivati\" è un past perfect con already: had already ended. Had already end e had already ending non hanno il participio passato, e has already ended lega la festa al presente.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Past Perfect",
    "theoryId": "past-perfect"
  },
  {
    "id": "q511",
    "prompt": "I _____ eat a lot of chocolate, but now I don't.",
    "options": [
      "used to",
      "use to",
      "was used to",
      "am used to"
    ],
    "correctIndex": 0,
    "explanation": "Per un'abitudine passata che ora non c'è più si usa 'used to' + verbo base. 'Use to' senza -d non funziona nelle frasi affermative, e 'was/am used to' vuol dire 'essere abituato', che richiede un nome o un verbo in -ing.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q512",
    "prompt": "_____ you use to play video games when you were a kid?",
    "options": [
      "Did",
      "Do",
      "Were",
      "Are"
    ],
    "correctIndex": 0,
    "explanation": "Nelle domande sul passato si mette 'Did' all'inizio e 'use to' senza -d, perché 'did' porta già il passato. 'Do' e 'Are' sono al presente e 'Were' non si combina con 'use to'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q513",
    "prompt": "She _____ like coffee, but now she loves it.",
    "options": [
      "didn't use to",
      "didn't using to",
      "doesn't use to",
      "wasn't used to"
    ],
    "correctIndex": 0,
    "explanation": "Nella forma negativa si dice 'didn't use to' (senza -d), perché 'did' porta già il passato. 'Didn't using to' è impossibile, 'doesn't' è al presente e 'wasn't used to' significa 'non era abituata', non 'prima non le piaceva'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q514",
    "prompt": "Translate: 'Abitavamo a Londra quando ero piccolo.'",
    "options": [
      "We used to live in London when I was a kid.",
      "We used to lived in London when I was a kid.",
      "We are used to live in London when I was a kid.",
      "We use to live in London when I was a kid."
    ],
    "correctIndex": 0,
    "explanation": "Per le abitudini e le situazioni passate si usa 'used to' + verbo base: 'We used to live'. 'Used to lived' ha due passati, 'are used to' è un presente e vuol dire 'siamo abituati', e 'use to' senza -d è sbagliato nelle frasi affermative.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q515",
    "prompt": "Translate: 'Non fumava, ma ora fuma un pacchetto al giorno.'",
    "options": [
      "He didn't use to smoke, but now he smokes a pack a day.",
      "He didn't used to smoke, but now he smokes a pack a day.",
      "He wasn't used to smoke, but now he smokes a pack a day.",
      "He hasn't used to smoke, but now he smokes a pack a day."
    ],
    "correctIndex": 0,
    "explanation": "Il negativo di 'used to' è 'didn't use to' + verbo base: dopo 'didn't' non va la -d. 'Wasn't used to' significa 'non era abituato' e 'hasn't used to' non esiste.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q516",
    "prompt": "There _____ be a park here, but now there is a supermarket.",
    "options": [
      "used to",
      "use to",
      "was",
      "is"
    ],
    "correctIndex": 0,
    "explanation": "'There used to be' indica una situazione che esisteva nel passato e ora non c'è più (il parco). 'Was' e 'is' non si possono mettere prima di 'be', e 'use to' senza -d è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q517",
    "prompt": "I _____ have a dog, but he died last year.",
    "options": [
      "used to",
      "use to",
      "was used to",
      "am used to"
    ],
    "correctIndex": 0,
    "explanation": "'Used to' + verbo base descrive qualcosa che era vero nel passato e ora non lo è più (avevo un cane, ora no). 'Was/am used to' significa 'ero/sono abituato' e vuole un nome o un verbo in -ing, non 'have'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q518",
    "prompt": "What did you _____ do on Sundays?",
    "options": [
      "use to",
      "used to",
      "use",
      "used"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'did' il verbo resta alla forma base, quindi 'use to' senza -d: 'What did you use to do?'. 'Used to' ripeterebbe il passato, che 'did' ha già espresso.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q519",
    "prompt": "Translate: 'Andavamo al mare ogni estate.'",
    "options": [
      "We used to go to the sea every summer.",
      "We use to go to the sea every summer.",
      "We were used to go to the sea every summer.",
      "We had gone to the sea every summer."
    ],
    "correctIndex": 0,
    "explanation": "Per un'azione ripetuta nel passato e ora finita si usa 'used to' + verbo base: 'We used to go'. 'Use to' senza -d è sbagliato, 'were used to go' non esiste e 'had gone' è un trapassato che non rende 'andavamo'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q520",
    "prompt": "Translate: 'Aveva i capelli lunghi, vero?'",
    "options": [
      "She used to have long hair, didn't she?",
      "She used to have long hair, doesn't she?",
      "She used to had long hair, didn't she?",
      "She use to have long hair, didn't she?"
    ],
    "correctIndex": 0,
    "explanation": "'Used to' funziona come un verbo al passato semplice, quindi il tag è 'didn't she?'. 'Doesn't' è al presente, e 'used to had' o 'use to have' sono forme sbagliate.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q521",
    "prompt": "He _____ be so grumpy when he was younger.",
    "options": [
      "didn't use to",
      "didn't using to",
      "wasn't use to",
      "not used to"
    ],
    "correctIndex": 0,
    "explanation": "Una caratteristica del passato che è cambiata si nega con 'didn't use to' + verbo base. Dopo 'didn't' non va -ing né -d, e 'wasn't use to' e 'not used to' non sono forme corrette qui.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q522",
    "prompt": "We _____ walk to school every day.",
    "options": [
      "used to",
      "use to",
      "were used to",
      "are used to"
    ],
    "correctIndex": 0,
    "explanation": "'Used to' + verbo base indica un'abitudine passata (andavamo a scuola a piedi). 'Be used to' vuol dire 'essere abituato' e vuole il verbo in -ing, quindi 'were used to walk' è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q523",
    "prompt": "Did she _____ work in a bank?",
    "options": [
      "use to",
      "used to",
      "use",
      "used"
    ],
    "correctIndex": 0,
    "explanation": "Nella domanda al passato 'did' porta il tempo, quindi 'use to' perde la -d: 'Did she use to...?'. 'Used to' dopo 'did' ripeterebbe il passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q524",
    "prompt": "I _____ think that spiders were insects.",
    "options": [
      "used to",
      "use to",
      "was used to",
      "am used to"
    ],
    "correctIndex": 0,
    "explanation": "Una convinzione che avevo nel passato e ora non ho più si esprime con 'used to' + verbo base. 'Use to' senza -d è sbagliato nelle frasi affermative e 'was/am used to' significa 'ero/sono abituato'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q525",
    "prompt": "They _____ travel a lot before they had children.",
    "options": [
      "used to",
      "use to",
      "were used to",
      "are used to"
    ],
    "correctIndex": 0,
    "explanation": "'Used to' + verbo base indica un'abitudine passata che è finita (viaggiavano molto prima di avere figli). 'Were used to' significa 'erano abituati' e vuole un nome o un verbo in -ing.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q526",
    "prompt": "Translate: 'Prima non mi piaceva la verdura.'",
    "options": [
      "I didn't use to like vegetables.",
      "I didn't used to like vegetables.",
      "I wasn't used to like vegetables.",
      "I hadn't used to like vegetables."
    ],
    "correctIndex": 0,
    "explanation": "Il negativo di 'used to' è 'didn't use to' + verbo base, senza -d. 'Wasn't used to' significa 'non ero abituato' e 'hadn't used to' non è una forma corretta.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q527",
    "prompt": "It's a beautiful day, _____?",
    "options": [
      "isn't it",
      "is it",
      "does it",
      "doesn't it"
    ],
    "correctIndex": 0,
    "explanation": "Se la frase è affermativa, il tag è negativo e ripete il verbo 'to be': 'It's ... isn't it?'. 'Does/doesn't it' userebbe un ausiliare che nella frase non c'è.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q528",
    "prompt": "You don't like coffee, _____?",
    "options": [
      "do you",
      "don't you",
      "are you",
      "aren't you"
    ],
    "correctIndex": 0,
    "explanation": "Se la frase è negativa, il tag è affermativo e usa lo stesso ausiliare ('don't' -> 'do you'). 'Don't you' sarebbe un tag negativo dopo una frase già negativa.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q529",
    "prompt": "She went to Paris, _____?",
    "options": [
      "didn't she",
      "did she",
      "doesn't she",
      "wasn't she"
    ],
    "correctIndex": 0,
    "explanation": "Il tag riprende l'ausiliare del passato semplice, cioè 'did', e si inverte la polarità: frase affermativa, tag negativo 'didn't she?'. 'Doesn't' è al presente e 'wasn't' non c'entra con 'went'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q530",
    "prompt": "Translate: 'Siete italiani, vero?'",
    "options": [
      "You are Italian, aren't you?",
      "You are Italian, isn't it?",
      "You are Italian, don't you?",
      "You are Italian, are you?"
    ],
    "correctIndex": 0,
    "explanation": "Il tag ripete il soggetto (you) e il verbo 'to be' (are) in forma negativa, perché la frase è affermativa: 'aren't you?'. 'Isn't it' non concorda con 'you' e 'don't you' usa un ausiliare sbagliato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q531",
    "prompt": "Translate: 'Non hai visto il film, vero?'",
    "options": [
      "You haven't seen the movie, have you?",
      "You haven't seen the movie, haven't you?",
      "You didn't see the movie, have you?",
      "You haven't seen the movie, did you?"
    ],
    "correctIndex": 0,
    "explanation": "Nel present perfect negativo il tag è affermativo e usa 'have': 'haven't seen... have you?'. 'Haven't you' è negativo dopo una frase negativa e 'did you' non è l'ausiliare del present perfect.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q532",
    "prompt": "They have finished the project, _____?",
    "options": [
      "haven't they",
      "have they",
      "didn't they",
      "don't they"
    ],
    "correctIndex": 0,
    "explanation": "Nel present perfect il tag riprende 'have' e, con una frase affermativa, è negativo: 'haven't they?'. 'Didn't' e 'don't' sono ausiliari del passato e del presente semplice.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q533",
    "prompt": "He can speak Spanish, _____?",
    "options": [
      "can't he",
      "can he",
      "doesn't he",
      "isn't he"
    ],
    "correctIndex": 0,
    "explanation": "Con un verbo modale il tag riprende lo stesso modale con polarità opposta: 'can' -> 'can't he?'. 'Doesn't he' e 'isn't he' non c'entrano con 'can'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q534",
    "prompt": "You will come to the party, _____?",
    "options": [
      "won't you",
      "will you",
      "don't you",
      "aren't you"
    ],
    "correctIndex": 0,
    "explanation": "Il tag riprende l'ausiliare 'will' e, con la frase affermativa, è negativo: 'won't you?'. 'Don't' e 'aren't' sono ausiliari di altri tempi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q535",
    "prompt": "Translate: 'Fa freddo oggi, no?'",
    "options": [
      "It's cold today, isn't it?",
      "It's cold today, is it?",
      "It's cold today, doesn't it?",
      "It's cold today, wasn't it?"
    ],
    "correctIndex": 0,
    "explanation": "Quando la frase usa 'to be' al presente, il tag riprende 'is' in negativo: 'It's cold today, isn't it?'. 'Is it' ripeterebbe la polarità affermativa e 'doesn't/wasn't' non sono corretti.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q536",
    "prompt": "Translate: 'Lui non sa nuotare, vero?'",
    "options": [
      "He can't swim, can he?",
      "He can't swim, can't he?",
      "He doesn't know to swim, doesn't he?",
      "He can't swim, does he?"
    ],
    "correctIndex": 0,
    "explanation": "La frase è negativa ('can't swim'), quindi il tag è affermativo e riprende il modale: 'can he?'. 'Can't he' sarebbe negativo dopo una frase negativa, e 'does he' non riprende 'can'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q537",
    "prompt": "We should leave now, _____?",
    "options": [
      "shouldn't we",
      "should we",
      "don't we",
      "aren't we"
    ],
    "correctIndex": 0,
    "explanation": "Con 'should' il tag usa lo stesso modale in negativo: 'shouldn't we?'. 'Don't we' e 'aren't we' usano ausiliari diversi da quello della frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q538",
    "prompt": "She was at home, _____?",
    "options": [
      "wasn't she",
      "was she",
      "didn't she",
      "isn't she"
    ],
    "correctIndex": 0,
    "explanation": "Con 'was' il tag riprende 'was' in negativo perché la frase è affermativa: 'wasn't she?'. 'Didn't' e 'isn't' non corrispondono al verbo della frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q539",
    "prompt": "I am right, _____?",
    "options": [
      "aren't I",
      "am not I",
      "don't I",
      "isn't I"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'I am' il tag è la forma irregolare 'aren't I?'. 'Am not I' e 'isn't I' non esistono, e 'don't I' userebbe l'ausiliare sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q540",
    "prompt": "Let's go for a walk, _____?",
    "options": [
      "shall we",
      "will we",
      "do we",
      "are we"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'Let's' (proposta) il tag fisso è 'shall we?'. 'Will we', 'do we' e 'are we' non si usano con questo tipo di frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q541",
    "prompt": "You wouldn't do that, _____?",
    "options": [
      "would you",
      "wouldn't you",
      "do you",
      "did you"
    ],
    "correctIndex": 0,
    "explanation": "'Wouldn't' è negativo, quindi il tag è affermativo e riprende lo stesso modale: 'would you?'. 'Wouldn't you' sarebbe negativo dopo una frase negativa.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q542",
    "prompt": "Translate: 'Tua sorella vive qui, vero?'",
    "options": [
      "Your sister lives here, doesn't she?",
      "Your sister lives here, isn't she?",
      "Your sister lives here, doesn't it?",
      "Your sister lives here, don't she?"
    ],
    "correctIndex": 0,
    "explanation": "Il verbo 'lives' è al presente semplice con 'she', quindi il tag usa 'does' in negativo: 'doesn't she?'. 'Isn't she' non riprende il verbo, 'doesn't it' ha il soggetto sbagliato e 'don't she' non concorda.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q543",
    "prompt": "They have been traveling all day. They _____ be tired.",
    "options": [
      "must",
      "can't",
      "must to",
      "ought"
    ],
    "correctIndex": 0,
    "explanation": "Hanno viaggiato tutto il giorno, quindi siamo quasi certi: per una deduzione forte si usa 'must'. 'Can't' direbbe che è impossibile, 'must to' è sbagliato (i modali non vogliono 'to') e 'ought' vuole 'to'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q544",
    "prompt": "He just ate a huge meal. He _____ be hungry.",
    "options": [
      "can't",
      "must",
      "don't",
      "must to"
    ],
    "correctIndex": 0,
    "explanation": "Ha appena mangiato tantissimo, quindi è quasi impossibile che abbia fame: per l'impossibilità si usa 'can't'. 'Must' direbbe l'opposto, 'don't' non regge con be e 'must to' è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q545",
    "prompt": "I can't find my phone. It _____ be in the car, but I'm not sure.",
    "options": [
      "might",
      "must",
      "can't",
      "should"
    ],
    "correctIndex": 0,
    "explanation": "Dice 'non sono sicuro', quindi è solo una possibilità e serve 'might'. 'Must' esprimerebbe certezza e 'can't' impossibilità.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q546",
    "prompt": "Translate: 'Deve essere tardi, è già buio.'",
    "options": [
      "It must be late, it's already dark.",
      "It can be late, it's already dark.",
      "It may to be late, it's already dark.",
      "It should be late, it's already dark."
    ],
    "correctIndex": 0,
    "explanation": "Il buio è un indizio, quindi per una deduzione forte si usa 'must' + verbo base: 'It must be late'. 'May to be' è sbagliato perché dopo i modali non va 'to', e 'can' non esprime una deduzione positiva.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q547",
    "prompt": "Translate: 'Non può essere vero!'",
    "options": [
      "It can't be true!",
      "It mustn't be true!",
      "It shouldn't be true!",
      "It might not be true!"
    ],
    "correctIndex": 0,
    "explanation": "'Non può essere vero' esprime impossibilità, e il contrario di 'must' nelle deduzioni è 'can't'. 'Mustn't' indica un divieto e non una deduzione.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q548",
    "prompt": "That _____ be John's car. His car is blue, not red.",
    "options": [
      "can't",
      "must",
      "might",
      "could"
    ],
    "correctIndex": 0,
    "explanation": "L'auto di John è blu, non rossa: quella rossa non può essere la sua. Per escludere qualcosa con certezza si usa 'can't', non 'must'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q549",
    "prompt": "You've been working since 6 AM. You _____ be exhausted!",
    "options": [
      "must",
      "can't",
      "ought",
      "must to"
    ],
    "correctIndex": 0,
    "explanation": "Lavori dalle 6 del mattino, quindi la conclusione è quasi certa: 'must' + verbo base. 'Can't' direbbe che è impossibile, 'ought' vuole 'to' e 'must to' è sbagliato (i modali non vogliono 'to').",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q550",
    "prompt": "Take an umbrella. It _____ rain later.",
    "options": [
      "might",
      "must",
      "can't",
      "ought"
    ],
    "correctIndex": 0,
    "explanation": "Prendere l'ombrello 'per sicurezza' significa che la pioggia è possibile ma non certa: serve 'might'. 'Must' esprimerebbe certezza, 'can't' escluderebbe la pioggia e 'ought' vuole 'to'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q551",
    "prompt": "Translate: 'Potrebbe piovere più tardi.'",
    "options": [
      "It might rain later.",
      "It must rain later.",
      "It can rain later.",
      "It will rain later."
    ],
    "correctIndex": 0,
    "explanation": "'Potrebbe piovere' è una possibilità, e in inglese si rende con 'might' (o 'could'). 'Must' esprime certezza e 'will' è una previsione sicura.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q552",
    "prompt": "Translate: 'Quello dev'essere il tuo nuovo capo.'",
    "options": [
      "That must be your new boss.",
      "That can't be your new boss.",
      "That must to be your new boss.",
      "That musts be your new boss."
    ],
    "correctIndex": 0,
    "explanation": "'Dev'essere' è una deduzione quasi certa: 'must' + verbo base. 'That can't be' direbbe che è impossibile, 'must to be' è sbagliato perché i modali non vogliono 'to', e 'musts' non esiste (i modali non prendono la -s).",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q553",
    "prompt": "She speaks perfect French, has a French passport and her parents live in Paris. She _____ be from France.",
    "options": [
      "must",
      "can't",
      "ought",
      "must to"
    ],
    "correctIndex": 0,
    "explanation": "Lingua perfetta, passaporto e genitori a Parigi sono prove molto forti, quindi usiamo 'must' per una quasi certezza. 'Can't' direbbe il contrario, 'ought' vuole 'to' e 'must to' è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q554",
    "prompt": "He is holding a cinema ticket for tonight's film. He _____ be going to the cinema.",
    "options": [
      "must",
      "can't",
      "ought",
      "must to"
    ],
    "correctIndex": 0,
    "explanation": "Ha in mano il biglietto per stasera, quindi sono prove forti e usiamo 'must be going' per una deduzione. 'Can't' sarebbe l'opposto, 'ought' vuole 'to' e 'must to' è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q555",
    "prompt": "It's 3 a.m., the lights are out and the house is silent. They _____ be asleep.",
    "options": [
      "must",
      "can't",
      "ought",
      "must to"
    ],
    "correctIndex": 0,
    "explanation": "Sono le 3, luci spente e casa silenziosa: tutto fa pensare che dormano, quindi 'must'. 'Can't' direbbe che è impossibile, 'ought' vuole 'to' e 'must to' è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q556",
    "prompt": "She _____ be at home, but I haven't checked.",
    "options": [
      "could",
      "must",
      "can't",
      "won't"
    ],
    "correctIndex": 0,
    "explanation": "Chi parla non ha controllato, quindi esprime una semplice possibilità e 'could' va bene (come 'might'). 'Must' direbbe certezza e 'can't' impossibilità.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q557",
    "prompt": "Tom is in Tokyo until Friday, so that _____ be him at the door.",
    "options": [
      "can't",
      "must",
      "ought",
      "must to"
    ],
    "correctIndex": 0,
    "explanation": "Tom è a Tokyo fino a venerdì, quindi è impossibile che sia lui alla porta: per l'impossibilità si usa 'can't'. 'Must' direbbe che siamo certi che sia lui, 'ought' vuole 'to' e 'must to' è sbagliato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q558",
    "prompt": "Translate: 'Questa non può essere la casa giusta.'",
    "options": [
      "This can't be the right house.",
      "This mustn't be the right house.",
      "This shouldn't be the right house.",
      "This wouldn't be the right house."
    ],
    "correctIndex": 0,
    "explanation": "Per dire che qualcosa è impossibile in base a ciò che si sa, si usa 'can't be' ('non può essere'). 'Mustn't' esprime un divieto e non una deduzione.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Modals of Deduction",
    "theoryId": "modals-deduction"
  },
  {
    "id": "q559",
    "prompt": "Complete the sentence: 'Don't forget _____ the front door before you go to bed.'",
    "options": [
      "to lock",
      "locking",
      "lock",
      "locked"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'forget' si usa 'to' + verbo base quando si parla di un'azione da fare (non dimenticare di chiudere la porta). Con 'locking' avrebbe il senso di 'ricordare di aver chiuso'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q560",
    "prompt": "Complete the sentence: 'I will never forget _____ the Colosseum for the very first time.'",
    "options": [
      "seeing",
      "to see",
      "see",
      "saw"
    ],
    "correctIndex": 0,
    "explanation": "Con 'forget' + -ing si parla di un ricordo di un'azione già avvenuta: non dimenticherò mai di aver visto il Colosseo. 'To see' indicherebbe un'azione ancora da compiere.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q561",
    "prompt": "Complete the sentence: 'On the road trip, we stopped _____ a coffee and stretch our legs.'",
    "options": [
      "to have",
      "having",
      "have",
      "had"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'stop' + 'to' + verbo base si indica lo scopo per cui ci si ferma (ci siamo fermati per prendere un caffè). Con 'having' sembrerebbe che avessero smesso di prendere il caffè.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q562",
    "prompt": "Complete the sentence: 'The doctor told him that he must stop _____ immediately for his health.'",
    "options": [
      "smoking",
      "to smoke",
      "smoke",
      "smoked"
    ],
    "correctIndex": 0,
    "explanation": "'Stop' + -ing significa smettere di fare un'azione, quindi 'stop smoking' vuol dire smettere di fumare. 'Stop to smoke' vorrebbe dire fermarsi per fumare.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q563",
    "prompt": "Complete the sentence: 'If the app keeps crashing, try _____ your smartphone.'",
    "options": [
      "restarting",
      "to restarting",
      "restart",
      "restarted"
    ],
    "correctIndex": 0,
    "explanation": "'Try' + -ing significa provare qualcosa come esperimento per risolvere un problema: prova a riavviare il telefono. 'To restarting' mescola le due costruzioni, 'restart' e 'restarted' non sono forme possibili dopo try in questa frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q564",
    "prompt": "Complete the sentence: 'I tried _____ the heavy wardrobe, but it was impossible alone.'",
    "options": [
      "to lift",
      "to lifting",
      "lift",
      "lifted"
    ],
    "correctIndex": 0,
    "explanation": "'Try' + 'to' + verbo base indica lo sforzo di fare qualcosa di difficile (provai a sollevare l'armadio, ma era impossibile). 'To lifting' mescola le due costruzioni, 'lift' e 'lifted' non sono forme possibili dopo tried in questa frase.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q565",
    "prompt": "Complete the sentence: 'Look at the kitchen floor! It really needs _____.'",
    "options": [
      "cleaning",
      "to clean",
      "clean",
      "cleaned"
    ],
    "correctIndex": 0,
    "explanation": "'Need' + -ing ha un significato passivo: il pavimento ha bisogno di essere pulito (needs cleaning). 'To clean' vorrebbe dire che è il pavimento a dover pulire qualcosa.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q566",
    "prompt": "Complete the sentence: 'I am really looking forward to _____ you at the conference next week.'",
    "options": [
      "meeting",
      "meet",
      "to meet",
      "met"
    ],
    "correctIndex": 0,
    "explanation": "In 'look forward to' la parola 'to' è una preposizione, e dopo una preposizione si usa la forma in -ing: 'looking forward to meeting'. 'Meet' o 'to meet' sono sbagliati.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q567",
    "prompt": "Translate: 'Non riesco a fare a meno di ridere quando sento quella barzelletta.'",
    "options": [
      "I can't help laughing when I hear that joke.",
      "I can't help to laugh when I hear that joke.",
      "I can't stop to laugh when I hear that joke.",
      "I can't avoid to laugh when I hear that joke."
    ],
    "correctIndex": 0,
    "explanation": "'Can't help' + -ing è un'espressione fissa che vuol dire 'non riuscire a fare a meno di'. 'Help to laugh', 'stop to laugh' e 'avoid to laugh' non esistono o hanno un altro significato.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q568",
    "prompt": "Translate: 'È inutile piangere sul latte versato.'",
    "options": [
      "It's no use crying over spilled milk.",
      "It's no use cry over spilled milk.",
      "It's not useful crying on spilled milk.",
      "It has no use to cry on spilled milk."
    ],
    "correctIndex": 0,
    "explanation": "'It's no use' è seguito dal gerundio: 'It's no use crying'. 'No use cry' non ha il gerundio, e le altre opzioni inventano costruzioni sbagliate ('not useful crying', 'has no use to cry on').",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "theoryId": "gerunds-infinitives"
  },
  {
    "id": "q569",
    "prompt": "Complete the sentence: 'Could you please give me _____ about the flight schedule?'",
    "options": [
      "some information",
      "an information",
      "some informations",
      "many informations"
    ],
    "correctIndex": 0,
    "explanation": "'Information' è non numerabile: non prende l'articolo 'an' né la -s del plurale. Si dice 'some information', mai 'informations'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q570",
    "prompt": "Complete the sentence: 'My grandfather gave me a very useful _____ before my interview.'",
    "options": [
      "piece of advice",
      "advice",
      "advices",
      "piece of advices"
    ],
    "correctIndex": 0,
    "explanation": "'Advice' è non numerabile e non ha plurale, per questo per un singolo consiglio si dice 'a piece of advice'. Dopo 'a very useful' serve un nome singolare numerabile, quindi 'advice' da solo non va.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q571",
    "prompt": "Complete the sentence: 'The news _____ so surprising that nobody believed it at first.'",
    "options": [
      "was",
      "were",
      "are",
      "have been"
    ],
    "correctIndex": 0,
    "explanation": "'News' finisce in -s ma è singolare e non numerabile, quindi vuole il verbo al singolare. Si usa 'was', perché il contesto è al passato.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q572",
    "prompt": "Complete the sentence: 'All the furniture in their new apartment _____ made of solid oak.'",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctIndex": 0,
    "explanation": "'Furniture' è non numerabile e vuole il verbo al singolare, quindi 'is'. 'Are', 'were' e 'have been' sono forme plurali.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q573",
    "prompt": "Complete the sentence: 'How _____ luggage are you planning to take on the flight?'",
    "options": [
      "much",
      "many",
      "few",
      "a few"
    ],
    "correctIndex": 0,
    "explanation": "'Luggage' è non numerabile, e con i non numerabili in una domanda di quantità si usa 'how much'. 'Many', 'few' e 'a few' vogliono i nomi numerabili al plurale.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q574",
    "prompt": "Complete the sentence: 'The police _____ investigating the cause of the fire.'",
    "options": [
      "are",
      "is",
      "was",
      "has been"
    ],
    "correctIndex": 0,
    "explanation": "'Police' è un nome collettivo plurale: vuole sempre il verbo al plurale ('are'). 'Is', 'was' e 'has been' sono singolari.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q575",
    "prompt": "Translate: 'Non ho molti compiti per domani.'",
    "options": [
      "I don't have much homework for tomorrow.",
      "I don't have many homeworks for tomorrow.",
      "I don't have many homework for tomorrow.",
      "I haven't much homeworks for tomorrow."
    ],
    "correctIndex": 0,
    "explanation": "'Homework' è non numerabile: non ha plurale ('homeworks' è sbagliato) e con una frase negativa si usa 'much', non 'many'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q577",
    "prompt": "Complete the sentence: 'Let's take a short break, _____?'",
    "options": [
      "shall we",
      "will we",
      "don't we",
      "aren't we"
    ],
    "correctIndex": 0,
    "explanation": "Dopo una proposta introdotta da 'Let's' il tag fisso è 'shall we?'. 'Will we', 'don't we' e 'aren't we' non si usano con 'Let's'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q578",
    "prompt": "Complete the sentence: 'Close the window, _____?'",
    "options": [
      "will you",
      "do you",
      "don't you",
      "shall you"
    ],
    "correctIndex": 0,
    "explanation": "Dopo un imperativo (un ordine o una richiesta) il tag è 'will you?'. 'Do you', 'don't you' e 'shall you' non si usano con gli imperativi.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q579",
    "prompt": "Complete the sentence: 'She never drinks alcohol, _____?'",
    "options": [
      "does she",
      "doesn't she",
      "is she",
      "isn't she"
    ],
    "correctIndex": 0,
    "explanation": "'Never' ha un significato negativo, quindi la frase conta come negativa e il tag è affermativo: 'does she?'. 'Doesn't she' sarebbe negativo dopo una frase già negativa.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q580",
    "prompt": "Complete the sentence: 'Nobody phoned while I was away, _____?'",
    "options": [
      "did they",
      "didn't they",
      "did he",
      "didn't he"
    ],
    "correctIndex": 0,
    "explanation": "'Nobody' è negativo, quindi il tag è affermativo, e si riprende con 'they': 'did they?'. 'Didn't they' sarebbe negativo, e 'he' è meno corretto con 'nobody'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q581",
    "prompt": "Complete the sentence: 'Nothing went wrong during the test, _____?'",
    "options": [
      "did it",
      "didn't it",
      "did they",
      "was it"
    ],
    "correctIndex": 0,
    "explanation": "'Nothing' è negativo, quindi il tag è affermativo, e si riprende con 'it' perché si tratta di una cosa: 'did it?'. 'Didn't it' sarebbe negativo e 'was it' non riprende 'went'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q582",
    "prompt": "Complete the sentence: 'Everybody is ready for the presentation, _____?'",
    "options": [
      "aren't they",
      "isn't he",
      "isn't it",
      "are they"
    ],
    "correctIndex": 0,
    "explanation": "'Everybody is ready' è una frase affermativa, quindi il tag è negativo; per 'everybody' si usa 'they' e il verbo 'be' si ripete: 'aren't they?'. 'Are they' sarebbe affermativo dopo una frase affermativa.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Question Tags",
    "theoryId": "question-tags"
  },
  {
    "id": "q583",
    "prompt": "Complete the sentence: 'I will call you as soon as I _____ at the airport.'",
    "options": [
      "arrive",
      "will arrive",
      "am arriving",
      "arrived"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'as soon as' si usa il present simple anche se parliamo del futuro: 'as soon as I arrive'. 'Will arrive' è sbagliato nelle frasi temporali.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q584",
    "prompt": "Complete the sentence: 'We will stay inside until the heavy rain _____.'",
    "options": [
      "stops",
      "will stop",
      "stopped",
      "is stopping"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'until' per il futuro si usa il present simple, mai 'will': 'until the rain stops'. 'Will stop' non si usa in questa posizione.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q585",
    "prompt": "Complete the sentence: 'You won't pass your driving test unless you _____ every day.'",
    "options": [
      "practice",
      "don't practice",
      "will practice",
      "won't practice"
    ],
    "correctIndex": 0,
    "explanation": "'Unless' significa già 'se non', quindi il verbo che segue è affermativo e al present simple: 'unless you practice'. 'Don't practice' crea una doppia negazione e 'will' non si usa dopo 'unless'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "First Conditional",
    "theoryId": "first-conditional"
  },
  {
    "id": "q586",
    "prompt": "Complete the sentence: 'Take an umbrella with you in case it _____ later.'",
    "options": [
      "rains",
      "will rain",
      "rained",
      "is raining"
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'in case' per il futuro si usa il present simple: 'in case it rains'. 'Will rain' non si usa dopo 'in case'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q587",
    "prompt": "Translate: 'Te lo dirò non appena lo saprò.'",
    "options": [
      "I will tell you as soon as I know.",
      "I will tell you as soon as I will know.",
      "I tell you as soon as I will know.",
      "I will tell to you as soon as I know."
    ],
    "correctIndex": 0,
    "explanation": "Dopo 'as soon as' si usa il present simple, quindi 'as soon as I know'. 'Will know' è sbagliato nelle frasi temporali, e 'tell to you' è un errore: dopo 'tell' non va 'to'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q588",
    "prompt": "Complete the sentence: 'I _____ what you mean, but I still disagree with your conclusion.'",
    "options": [
      "understand",
      "am understanding",
      "have understand",
      "understanding"
    ],
    "correctIndex": 0,
    "explanation": "'Understand' è un verbo di stato (descrive una condizione mentale) e non si usa nella forma continua: 'I understand'. 'Am understanding' e 'have understand' sono sbagliati.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q589",
    "prompt": "Complete the sentence: 'Please don't disturb Marco right now; he _____ lunch with a client.'",
    "options": [
      "is having",
      "has",
      "have",
      "had"
    ],
    "correctIndex": 0,
    "explanation": "'Have' nel senso di 'mangiare' è un'azione e può stare nel present continuous. 'Right now' indica che succede in questo momento, quindi 'is having'. 'Has' darebbe l'idea di un'abitudine.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q590",
    "prompt": "Complete the sentence: 'Be quiet for a minute! I _____ about how to solve this math problem.'",
    "options": [
      "am thinking",
      "think",
      "thinks",
      "thought"
    ],
    "correctIndex": 0,
    "explanation": "'Think' nel senso di 'riflettere' è un'azione in corso e vuole il present continuous. 'Be quiet for a minute' mostra che sta succedendo ora: 'I am thinking'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q591",
    "prompt": "Complete the sentence: 'I _____ that learning English is essential for your career.'",
    "options": [
      "think",
      "am thinking",
      "thinking",
      "thought"
    ],
    "correctIndex": 0,
    "explanation": "Quando 'think' esprime un'opinione è un verbo di stato e non si usa al continuous: 'I think that...'. 'Am thinking' indicherebbe l'azione di riflettere in questo momento.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q592",
    "prompt": "Complete the sentence: 'This delicious pasta dish _____ of fresh tomatoes and basil.'",
    "options": [
      "tastes",
      "is tasting",
      "taste",
      "was tasting"
    ],
    "correctIndex": 0,
    "explanation": "'Taste' nel senso di 'avere sapore' è un verbo di stato e va al present simple. Con il soggetto 'dish' (terza persona singolare) serve la -s: 'tastes'.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q593",
    "prompt": "Complete the sentence: 'For _____ details regarding the hotel booking, contact customer support.'",
    "options": [
      "further",
      "farther",
      "farthest",
      "more far"
    ],
    "correctIndex": 0,
    "explanation": "Nel senso figurato di 'ulteriore' si usa 'further details'. 'Farther' si usa per la distanza fisica, e 'farthest' è un superlativo e 'more far' non esiste.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q594",
    "prompt": "Complete the sentence: 'Today the traffic is _____ than it was yesterday morning.'",
    "options": [
      "heavier",
      "more heavy",
      "more heavier",
      "heaviest"
    ],
    "correctIndex": 0,
    "explanation": "Gli aggettivi di due sillabe che finiscono in -y fanno il comparativo con -ier: 'heavy' -> 'heavier'. 'More heavy' e 'more heavier' sono sbagliati.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q595",
    "prompt": "Complete the sentence: 'The new laptop is great, but it is not _____ fast as I expected.'",
    "options": [
      "as",
      "so much",
      "more",
      "like"
    ],
    "correctIndex": 0,
    "explanation": "Il comparativo di uguaglianza si forma con 'as ... as', anche in forma negativa: 'not as fast as'. 'So much', 'more' e 'like' non si usano così.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q596",
    "prompt": "Complete the sentence: 'The _____ you practice speaking, the _____ confident you will feel.'",
    "options": [
      "more / more",
      "most / most",
      "better / better",
      "much / much"
    ],
    "correctIndex": 0,
    "explanation": "La struttura 'the + comparativo, the + comparativo' esprime due cose che crescono insieme: 'the more you practice, the more confident you feel'. 'Most' è un superlativo e 'much' non è un comparativo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q597",
    "prompt": "Translate: 'Mio fratello maggiore vive a Londra.'",
    "options": [
      "My elder brother lives in London.",
      "My elder brother living in London.",
      "My more old brother lives in London.",
      "My eldest brother live in London."
    ],
    "correctIndex": 0,
    "explanation": "'Elder' (come 'older') si usa solo davanti a un nome per dire 'maggiore' tra fratelli: 'my elder brother'. Le altre opzioni sbagliano il verbo ('living' senza ausiliare, 'live' senza -s) o inventano 'more old'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q598",
    "prompt": "Complete the sentence: 'When I moved to the UK, it took me a long time to get used to _____ on the left.'",
    "options": [
      "driving",
      "drive",
      "drove",
      "driven"
    ],
    "correctIndex": 0,
    "explanation": "In 'get used to' la parola 'to' è una preposizione, quindi segue la forma in -ing: 'get used to driving' (abituarsi a guidare). 'Drive' o 'drove' non vanno dopo una preposizione.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q599",
    "prompt": "Complete the sentence: 'I am a nurse, so I am used to _____ night shifts.'",
    "options": [
      "working",
      "work",
      "worked",
      "to work"
    ],
    "correctIndex": 0,
    "explanation": "In 'be used to' (essere abituato) la parola 'to' è una preposizione, quindi segue il verbo in -ing: 'used to working'. 'Work' e 'to work' sono sbagliati.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q600",
    "prompt": "Complete the sentence: 'I _____ drink coffee when I was younger, but now I drink three cups a day.'",
    "options": [
      "didn't use to",
      "don't use to",
      "not used to",
      "wasn't used to"
    ],
    "correctIndex": 0,
    "explanation": "Il negativo di 'used to' è 'didn't use to', perché 'did' porta già il passato. 'Don't use to' è al presente, 'wasn't used to' significa 'non ero abituato' e vuole un nome o -ing, mentre 'not used to' manca dell'ausiliare.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q601",
    "prompt": "Translate: 'Ti sei abituato al clima freddo?'",
    "options": [
      "Have you got used to the cold weather?",
      "Did you use to the cold weather?",
      "Have you used to the cold weather?",
      "Did you get use to cold weather?"
    ],
    "correctIndex": 0,
    "explanation": "'Get used to' + nome significa 'abituarsi a'; al present perfect ('Have you got used to...?') chiede se l'abitudine si è già formata. 'Use to' da solo non regge un nome e 'get use' è sbagliato: manca il participio 'used'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Used to",
    "theoryId": "used-to"
  },
  {
    "id": "q602",
    "prompt": "Complete the sentence: 'Venice, _____ is famous for its canals, attracts millions of tourists every year.'",
    "options": [
      "which",
      "that",
      "where",
      "what"
    ],
    "correctIndex": 0,
    "explanation": "Nelle relative non restrittive (tra virgole) per le cose si usa 'which', mai 'that'. 'Where' non va bene perché Venice è il soggetto di 'is famous', e 'what' non è un pronome relativo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q603",
    "prompt": "Complete the sentence: 'Mr. Davis, _____ you met yesterday at the reception, is our new director.'",
    "options": [
      "whom",
      "which",
      "that",
      "whose"
    ],
    "correctIndex": 0,
    "explanation": "Per una persona complemento oggetto in una relativa tra virgole si usa 'whom' ('you met' ha già il suo soggetto). 'That' non si usa tra virgole, 'which' è per le cose e 'whose' esprime possesso.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q604",
    "prompt": "Complete the sentence: 'That is the student _____ backpack was accidentally left in the classroom.'",
    "options": [
      "whose",
      "who's",
      "which",
      "that's"
    ],
    "correctIndex": 0,
    "explanation": "'Whose' esprime possesso: 'the student whose backpack' significa 'lo studente il cui zaino'. 'Who's' e 'that's' sono contrazioni di 'who is' e 'that is', e 'which' è per le cose.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q605",
    "prompt": "Complete the sentence: 'The hotel _____ we stayed at during our holiday was right on the beach.'",
    "options": [
      "that",
      "where",
      "what",
      "whose"
    ],
    "correctIndex": 0,
    "explanation": "'Stayed at' ha già la preposizione in fondo, quindi il pronome fa da oggetto e serve 'that' (o 'which'). 'Where' ripeterebbe il luogo ('where we stayed at'), 'whose' indica possesso e 'what' non è un pronome relativo.",
    "category": "Grammatica",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q606",
    "prompt": "Translate: 'Londra, che è la capitale del Regno Unito, ha molti musei gratuiti.'",
    "options": [
      "London, which is the capital of the UK, has many free museums.",
      "London, that is the capital of the UK, has many free museums.",
      "London, where is the capital of the UK, has many free museums.",
      "London, what is the capital of the UK, has many free museums."
    ],
    "correctIndex": 0,
    "explanation": "Nelle relative non restrittive (tra virgole) per le cose si usa 'which', non 'that'. 'Where' si usa per un luogo e 'what' non è un pronome relativo: davanti a 'is the capital' serve 'which'.",
    "category": "Traduzione",
    "level": "B1",
    "grammarTopic": "Relative Clauses",
    "theoryId": "relative-clauses"
  },
  {
    "id": "q612",
    "prompt": "Complete the sentence: 'Marco is a vegetarian, so he _____ meat.'",
    "options": [
      "eats not",
      "don't eat",
      "doesn't eat",
      "not eats"
    ],
    "correctIndex": 2,
    "explanation": "Con he/she/it il present simple negativo si forma con 'doesn't' + verbo base senza -s: 'he doesn't eat'. 'Don't' va con I/you/we/they, mentre 'eats not' e 'not eats' non sono forme corrette.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q615",
    "prompt": "Complete the sentence: 'Of all the subjects I studied this year, physics was the _____.'",
    "options": [
      "hardly",
      "hardest",
      "most hard",
      "more hard"
    ],
    "correctIndex": 1,
    "explanation": "Il superlativo degli aggettivi brevi si forma con 'the' + aggettivo + '-est': 'the hardest'. 'Most hard' e 'more hard' non si usano con un aggettivo di una sillaba, e 'hardly' è un avverbio che significa 'a malapena'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  },
  {
    "id": "q616",
    "prompt": "Complete the sentence: 'We can't make pancakes because there isn't _____ flour left.'",
    "options": [
      "some",
      "a",
      "many",
      "any"
    ],
    "correctIndex": 3,
    "explanation": "Con i nomi non numerabili come 'flour' nelle frasi negative si usa 'any', non 'some'. 'A' e 'many' richiedono nomi numerabili.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q617",
    "prompt": "Complete the sentence: 'Every morning Anna _____ to the university by bus.'",
    "options": [
      "goes",
      "go",
      "going",
      "is go"
    ],
    "correctIndex": 0,
    "explanation": "Con he/she/it il verbo al present simple prende -s/-es: 'Anna goes'. 'Go' va con I/you/we/they, 'going' avrebbe bisogno di 'is' e 'is go' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q619",
    "prompt": "Complete the sentence: 'How often _____ your sister visit your grandparents?'",
    "options": [
      "do",
      "is",
      "has",
      "does"
    ],
    "correctIndex": 3,
    "explanation": "Alla terza persona singolare la domanda al present simple si fa con 'does' + soggetto + verbo base: 'How often does your sister visit...?'. 'Do' va con I/you/we/they, mentre 'is' e 'has' non reggono il verbo base.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Present Simple",
    "theoryId": "present-simple"
  },
  {
    "id": "q620",
    "prompt": "Choose the correct sentence.",
    "options": [
      "Look! The children playing in the garden.",
      "Look! The children is playing in the garden.",
      "Look! The children are playing in the garden.",
      "Look! The children plays in the garden."
    ],
    "correctIndex": 2,
    "explanation": "Per un'azione in corso adesso (Look!) si usa il present continuous: 'be' + -ing. Con 'the children' (plurale) l'ausiliare è 'are'; 'is' non concorda, e senza ausiliare o con 'plays' la forma è sbagliata.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Present Continuous",
    "theoryId": "present-continuous"
  },
  {
    "id": "q621",
    "prompt": "Complete the sentence: '_____ a supermarket near the university?'",
    "options": [
      "Do there",
      "Is there",
      "Are there",
      "Has there"
    ],
    "correctIndex": 1,
    "explanation": "'A supermarket' è singolare, quindi la domanda è 'Is there...?'. 'Are there' si usa con i plurali, mentre 'Do there' e 'Has there' non esistono.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "There is / There are",
    "theoryId": "there-is-are"
  },
  {
    "id": "q628",
    "prompt": "Complete the sentence: 'My grandparents live _____ a small village near Bergamo.'",
    "options": [
      "in",
      "at",
      "to",
      "on"
    ],
    "correctIndex": 0,
    "explanation": "Per dire dove si vive con città, paesi e villaggi si usa 'in': 'live in a small village'. 'At' è per punti precisi, 'on' per superfici e strade, 'to' indica movimento e non posizione.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Prepositions of Place",
    "theoryId": "prepositions-place"
  },
  {
    "id": "q629",
    "prompt": "Complete the sentence: 'We went to my _____ house for dinner on Sunday.'",
    "options": [
      "grandmother",
      "grandmothers",
      "grandmothers's",
      "grandmother's"
    ],
    "correctIndex": 3,
    "explanation": "Il possesso di una persona si esprime con nome + 's: 'my grandmother's house'. 'Grandmother' senza 's non esprime possesso, 'grandmothers' è un plurale e 'grandmothers's' non esiste.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Possessive S",
    "theoryId": "possessive-s"
  },
  {
    "id": "q630",
    "prompt": "Complete the sentence: '_____ does the library close on Fridays?' 'At six o'clock.'",
    "options": [
      "Who",
      "What time",
      "How much",
      "Where"
    ],
    "correctIndex": 1,
    "explanation": "Per chiedere a che ora accade qualcosa si usa 'What time'. 'Who' chiede una persona, 'how much' una quantità o un prezzo e 'where' un luogo: nessuno dei tre può avere per risposta 'At six o'clock'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Questions and Origins",
    "theoryId": "questions-origins"
  },
  {
    "id": "q631",
    "prompt": "Complete the sentence: 'How _____ money do you spend on books every semester?'",
    "options": [
      "many",
      "few",
      "any",
      "much"
    ],
    "correctIndex": 3,
    "explanation": "'Money' è non numerabile, quindi si dice 'How much money'. 'Many' e 'few' si usano con i nomi numerabili plurali, e 'any' non si mette dopo 'how' in questa domanda.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Quantifiers",
    "theoryId": "quantifiers"
  },
  {
    "id": "q632",
    "prompt": "Complete the sentence: 'Sorry, I _____ come to the party on Saturday because I have to work.'",
    "options": [
      "not can",
      "don't can",
      "can't",
      "can't to"
    ],
    "correctIndex": 2,
    "explanation": "I verbi modali non usano 'do' nella negazione e vogliono il verbo base senza 'to': 'I can't come'. 'Not can' e 'don't can' sono sbagliate, e 'can't to' ha un 'to' di troppo.",
    "category": "Grammatica",
    "level": "A1",
    "grammarTopic": "Modals of Ability and Permission",
    "theoryId": "modals-ability-permission"
  },
  {
    "id": "q635",
    "prompt": "Complete the sentence: 'I think this book is _____ than the film.'",
    "options": [
      "more interesting",
      "interestinger",
      "most interesting",
      "very interesting"
    ],
    "correctIndex": 0,
    "explanation": "Gli aggettivi lunghi come 'interesting' formano il comparativo con 'more': 'more interesting than'. '-er' si usa solo con aggettivi brevi, 'most interesting' è un superlativo e 'very interesting' non regge 'than'.",
    "category": "Grammatica",
    "level": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "theoryId": "comparatives-superlatives"
  }
];
