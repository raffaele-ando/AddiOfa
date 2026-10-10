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
    "pronta": true,
    "regola": [
      "Si usa per abitudini, fatti sempre veri e orari fissi: *I wake up at 7*, *water boils at 100 degrees*.",
      "Alla 3ª persona singolare (*he, she, it*) il verbo prende la **-s**: *she drinks*, *he has*.",
      "Negativa e domanda si fanno con *do/does* + forma base: *She doesn't like coffee*, *Does he live here?* Dopo *does* il verbo non ha la -s.",
      "I verbi di stato (*understand, like, know*) restano al Present Simple anche quando parli di adesso.",
      "Dopo *when, as soon as, until, in case* il futuro si esprime con il presente: *I will call you as soon as I arrive*."
    ],
    "esempi": [
      {
        "en": "He usually wakes up at seven.",
        "it": "Di solito si sveglia alle sette."
      },
      {
        "en": "My parents don't live in London.",
        "it": "I miei genitori non vivono a Londra."
      },
      {
        "en": "Does she like chocolate?",
        "it": "A lei piace il cioccolato?"
      },
      {
        "en": "The train leaves at eight o'clock.",
        "it": "Il treno parte alle otto in punto."
      },
      {
        "en": "What does this word mean?",
        "it": "Cosa significa questa parola?"
      },
      {
        "en": "I will call you as soon as I arrive.",
        "it": "Ti chiamerò non appena arrivo."
      }
    ],
    "errori": [
      {
        "sbagliato": "She don't like coffee.",
        "giusto": "She doesn't like coffee.",
        "perche": "Con he/she/it l'ausiliare della negativa è *doesn't*, non *don't*."
      },
      {
        "sbagliato": "Does he works here?",
        "giusto": "Does he work here?",
        "perche": "Dopo *does* il verbo resta alla forma base, senza -s."
      },
      {
        "sbagliato": "I'm not like coffee.",
        "giusto": "I don't like coffee.",
        "perche": "Per negare un verbo normale si usa *do not*, non il verbo *be*."
      },
      {
        "sbagliato": "I am understanding what you mean.",
        "giusto": "I understand what you mean.",
        "perche": "*Understand* è un verbo di stato e non si usa nella forma in -ing."
      }
    ],
    "consiglio": "Quando vedi *does* o *doesn't*, controlla che il verbo subito dopo sia nella forma base, senza -s.",
    "domande": [
      "q95",
      "q98",
      "q137"
    ]
  },
  {
    "id": "present-continuous",
    "titolo": "Present Continuous: azioni in corso",
    "livello": "A2",
    "grammarTopic": "Present Continuous",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Si forma con *am/is/are* + verbo in -ing: *She is listening to music*.",
      "Descrive un'azione che sta succedendo adesso (*right now, at the moment, Look!*) o una situazione temporanea.",
      "Si usa anche per un programma già fissato nel futuro vicino: *I'm going to the doctor tomorrow afternoon*.",
      "La negativa si fa con *not* dopo *be*, la domanda con l'inversione: *Is it raining?* (mai *Does it raining?*).",
      "Non si usa con i verbi di stato (*know, like, want*); *think* con il senso di \"avere un'opinione\" resta al Present Simple, mentre *I'm thinking about...* descrive un pensiero in corso."
    ],
    "esempi": [
      {
        "en": "Look! It's raining.",
        "it": "Guarda! Sta piovendo."
      },
      {
        "en": "She is listening to music at the moment.",
        "it": "In questo momento sta ascoltando musica."
      },
      {
        "en": "We aren't using the computer right now.",
        "it": "Adesso non stiamo usando il computer."
      },
      {
        "en": "Why are you crying?",
        "it": "Perché stai piangendo?"
      },
      {
        "en": "I'm going to the doctor tomorrow afternoon.",
        "it": "Domani pomeriggio vado dal dottore."
      },
      {
        "en": "Marco is having lunch with a client.",
        "it": "Marco sta pranzando con un cliente."
      }
    ],
    "errori": [
      {
        "sbagliato": "She is listen to music.",
        "giusto": "She is listening to music.",
        "perche": "Dopo *am/is/are* il verbo va in -ing."
      },
      {
        "sbagliato": "I am knowing the answer.",
        "giusto": "I know the answer.",
        "perche": "*Know* è un verbo di stato e non si usa al Continuous."
      },
      {
        "sbagliato": "Does it raining outside?",
        "giusto": "Is it raining outside?",
        "perche": "La domanda al Present Continuous si fa con *be*, non con *do/does*."
      },
      {
        "sbagliato": "They playing tennis right now.",
        "giusto": "They are playing tennis right now.",
        "perche": "Senza *am/is/are* la forma in -ing da sola non basta."
      }
    ],
    "consiglio": "Se nella frase trovi *right now*, *at the moment* o *Look!*, cerca un'opzione con *am/is/are* + -ing.",
    "domande": [
      "q75",
      "q162",
      "q590"
    ]
  },
  {
    "id": "present-perfect",
    "titolo": "Present Perfect: esperienze e durata",
    "livello": "B1",
    "grammarTopic": "Present Perfect",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Si forma con *have/has* + participio passato: *I have seen*, *she has finished*.",
      "Si usa per esperienze senza una data precisa (*Have you ever been to Brazil?*) e per situazioni iniziate nel passato che durano ancora.",
      "Con la durata si usa *for* (*for ten years*), con il punto d'inizio *since* (*since 2015*).",
      "Se c'è una data o un momento concluso (*in 2009, yesterday, last week*) si usa il Past Simple.",
      "Parole tipiche: *ever, never, already, just, yet*."
    ],
    "esempi": [
      {
        "en": "Have you ever been to Brazil?",
        "it": "Sei mai stato in Brasile?"
      },
      {
        "en": "He has lived here for ten years.",
        "it": "Vive qui da dieci anni."
      },
      {
        "en": "I have known Luca since we were children.",
        "it": "Conosco Luca da quando eravamo bambini."
      },
      {
        "en": "We haven't seen that movie yet.",
        "it": "Non abbiamo ancora visto quel film."
      },
      {
        "en": "It's the first time I have driven a car.",
        "it": "È la prima volta che guido una macchina."
      },
      {
        "en": "She has just finished her homework.",
        "it": "Ha appena finito i compiti."
      }
    ],
    "errori": [
      {
        "sbagliato": "I have been to Africa in 2009.",
        "giusto": "I went to Africa in 2009.",
        "perche": "Con una data precisa si usa il Past Simple."
      },
      {
        "sbagliato": "I live here since ten years.",
        "giusto": "I have lived here for ten years.",
        "perche": "Una situazione che dura ancora vuole il Present Perfect, e una durata si introduce con *for*."
      },
      {
        "sbagliato": "Tom has been away for Monday.",
        "giusto": "Tom has been away since Monday.",
        "perche": "*Since* indica il punto d'inizio, *for* la durata."
      },
      {
        "sbagliato": "Have you ever flew in a helicopter?",
        "giusto": "Have you ever flown in a helicopter?",
        "perche": "Dopo *have/has* serve il participio passato (*flown*), non il Past Simple (*flew*)."
      }
    ],
    "consiglio": "Cerca nella frase una data o un momento finito (*yesterday, in 2009, last week*): se c'è, il Present Perfect non va bene.",
    "domande": [
      "q61",
      "q171",
      "q172"
    ]
  },
  {
    "id": "past-simple",
    "titolo": "Past Simple: azioni concluse nel passato",
    "livello": "A2",
    "grammarTopic": "Past Simple",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Si usa per azioni concluse in un momento passato definito: *yesterday, last week, in 2001, two years ago*.",
      "I verbi regolari prendono *-ed*; quelli irregolari cambiano forma (*go → went, buy → bought, meet → met*).",
      "Negativa e domanda si fanno con *did/didn't* + forma base: *Did you see...?*, *They didn't study*.",
      "Il verbo *be* fa eccezione: *was/were*, senza *did*."
    ],
    "esempi": [
      {
        "en": "I went to the cinema yesterday.",
        "it": "Ieri sono andato al cinema."
      },
      {
        "en": "Did you see the football match last night?",
        "it": "Hai visto la partita ieri sera?"
      },
      {
        "en": "They didn't study for the exam.",
        "it": "Non hanno studiato per l'esame."
      },
      {
        "en": "She bought a new phone last week.",
        "it": "La settimana scorsa ha comprato un telefono nuovo."
      },
      {
        "en": "We were very tired after the trip.",
        "it": "Eravamo molto stanchi dopo il viaggio."
      },
      {
        "en": "When did you arrive?",
        "it": "Quando sei arrivato?"
      }
    ],
    "errori": [
      {
        "sbagliato": "Did you met his wife?",
        "giusto": "Did you meet his wife?",
        "perche": "Dopo *did* il verbo torna alla forma base: il passato è già espresso da *did*."
      },
      {
        "sbagliato": "I have been to Africa in 2009.",
        "giusto": "I went to Africa in 2009.",
        "perche": "Con una data precisa si usa il Past Simple, non il Present Perfect."
      },
      {
        "sbagliato": "I buyed a new pair of shoes yesterday.",
        "giusto": "I bought a new pair of shoes yesterday.",
        "perche": "*Buy* è irregolare: il passato è *bought*."
      },
      {
        "sbagliato": "We was very tired.",
        "giusto": "We were very tired.",
        "perche": "Con we, you, they il passato di *be* è *were*."
      }
    ],
    "consiglio": "Se vedi *yesterday, last night, ago* o un anno preciso, scegli il Past Simple; se la frase ha *did*, il verbo principale non cambia.",
    "domande": [
      "q67",
      "q69",
      "q143"
    ]
  },
  {
    "id": "past-continuous",
    "titolo": "Past Continuous: azioni in corso nel passato",
    "livello": "A2",
    "grammarTopic": "Past Continuous",
    "inCheatSheet": false,
    "pronta": true,
    "regola": [
      "Si forma con *was/were* + verbo in -ing: *I was watching TV*.",
      "Descrive un'azione che era in corso in un momento del passato (*What were you doing at 8 PM?*) o due azioni che si svolgevano nello stesso tempo con *while*.",
      "Spesso un'azione lunga (Past Continuous) viene interrotta da una breve (Past Simple): *I was watching TV when the phone rang*.",
      "La negativa è *wasn't/weren't* + -ing; la domanda si fa con l'inversione: *Was it raining?*"
    ],
    "esempi": [
      {
        "en": "I was watching TV when the phone rang.",
        "it": "Stavo guardando la TV quando ha squillato il telefono."
      },
      {
        "en": "While she was reading, her brother was playing video games.",
        "it": "Mentre lei leggeva, suo fratello giocava ai videogiochi."
      },
      {
        "en": "What were you doing at 8 PM yesterday?",
        "it": "Cosa stavi facendo ieri alle 20?"
      },
      {
        "en": "They were walking in the park when it started to rain.",
        "it": "Stavano camminando nel parco quando ha iniziato a piovere."
      },
      {
        "en": "He wasn't listening to the teacher.",
        "it": "Non stava ascoltando l'insegnante."
      },
      {
        "en": "Was it raining when you left?",
        "it": "Pioveva quando sei uscito?"
      }
    ],
    "errori": [
      {
        "sbagliato": "I watched TV when the phone was ringing.",
        "giusto": "I was watching TV when the phone rang.",
        "perche": "L'azione già in corso va al Past Continuous, quella breve che la interrompe al Past Simple."
      },
      {
        "sbagliato": "They was walking in the park.",
        "giusto": "They were walking in the park.",
        "perche": "Con they il passato di *be* è *were*."
      },
      {
        "sbagliato": "He didn't listening to the teacher.",
        "giusto": "He wasn't listening to the teacher.",
        "perche": "Il Past Continuous si nega con *wasn't/weren't*, non con *didn't*."
      },
      {
        "sbagliato": "Did it raining when you left?",
        "giusto": "Was it raining when you left?",
        "perche": "La domanda si fa con *was/were*, non con *did*."
      }
    ],
    "consiglio": "Chiediti quale azione era già in corso: quella va al Past Continuous, l'azione che la interrompe al Past Simple.",
    "domande": [
      "q325",
      "q326",
      "q328"
    ]
  },
  {
    "id": "past-perfect",
    "titolo": "Past Perfect: il passato del passato",
    "livello": "B1",
    "grammarTopic": "Past Perfect",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Si forma con *had* + participio passato, uguale per tutte le persone: *I had left*.",
      "Indica l'azione più vecchia fra due azioni passate: quella già finita quando succede l'altra.",
      "Di solito accanto c'è un verbo al Past Simple: *When I arrived, the train had left*.",
      "Parole tipiche: *already, just, never, before, by the time, because*.",
      "La negativa è *hadn't* + participio passato."
    ],
    "esempi": [
      {
        "en": "When I arrived at the station, the train had already left.",
        "it": "Quando sono arrivato alla stazione, il treno era già partito."
      },
      {
        "en": "I had never seen that movie before yesterday.",
        "it": "Non avevo mai visto quel film prima di ieri."
      },
      {
        "en": "She passed the test because she had studied hard.",
        "it": "Ha superato il test perché aveva studiato molto."
      },
      {
        "en": "By the time we arrived, the movie had started.",
        "it": "Quando siamo arrivati, il film era già iniziato."
      },
      {
        "en": "The grass was yellow because it hadn't rained all summer.",
        "it": "L'erba era gialla perché non pioveva da tutta l'estate."
      },
      {
        "en": "I couldn't open the door because I had lost the key.",
        "it": "Non riuscivo ad aprire la porta perché avevo perso la chiave."
      }
    ],
    "errori": [
      {
        "sbagliato": "When I arrived, the train already left.",
        "giusto": "When I arrived, the train had already left.",
        "perche": "La partenza è avvenuta prima del mio arrivo, quindi serve il Past Perfect."
      },
      {
        "sbagliato": "I had never saw that movie.",
        "giusto": "I had never seen that movie.",
        "perche": "Dopo *had* serve il participio passato (*seen*), non il Past Simple (*saw*)."
      },
      {
        "sbagliato": "I hadn't never seen that movie.",
        "giusto": "I had never seen that movie.",
        "perche": "*Never* è già negativo: non si aggiunge un secondo *not*."
      },
      {
        "sbagliato": "I have never seen that movie before yesterday.",
        "giusto": "I had never seen that movie before yesterday.",
        "perche": "Il punto di riferimento (*yesterday*) è nel passato, quindi non va il Present Perfect."
      }
    ],
    "consiglio": "Se la frase spiega qualcosa successo prima di un altro momento passato (*because, already, by the time*), prova il Past Perfect.",
    "domande": [
      "q495",
      "q499",
      "q507"
    ]
  },
  {
    "id": "used-to",
    "titolo": "Used to: abitudini del passato",
    "livello": "B1",
    "grammarTopic": "Used to",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "*Used to* + forma base indica un'abitudine o una situazione del passato che ora non c'è più: *I used to play tennis*.",
      "Negativa e domanda si fanno con *did*: *didn't use to*, *Did you use to...?* Qui la forma è *use* senza -d, perché il passato è già in *did*.",
      "*Be used to* e *get used to* + -ing significano \"essere abituato\" e \"abituarsi\": *I'm used to working nights*. Qui *to* è una preposizione, quindi segue il gerundio.",
      "*Used to* esiste solo al passato: per il presente si usa il Present Simple."
    ],
    "esempi": [
      {
        "en": "I used to play tennis when I was young.",
        "it": "Giocavo a tennis quando ero giovane."
      },
      {
        "en": "She didn't use to like vegetables.",
        "it": "Una volta non le piacevano le verdure."
      },
      {
        "en": "Did you use to play video games when you were a kid?",
        "it": "Giocavi ai videogiochi da bambino?"
      },
      {
        "en": "There used to be a park here, but now there is a supermarket.",
        "it": "Qui c'era un parco, ma adesso c'è un supermercato."
      },
      {
        "en": "I am used to working night shifts.",
        "it": "Sono abituato a fare i turni di notte."
      },
      {
        "en": "Have you got used to the cold weather?",
        "it": "Ti sei abituato al clima freddo?"
      }
    ],
    "errori": [
      {
        "sbagliato": "She didn't used to like vegetables.",
        "giusto": "She didn't use to like vegetables.",
        "perche": "Dopo *didn't* il verbo torna alla forma base: *use*, non *used*."
      },
      {
        "sbagliato": "I use to play tennis when I was young.",
        "giusto": "I used to play tennis when I was young.",
        "perche": "Nelle frasi affermative la forma è *used to*, con la -d."
      },
      {
        "sbagliato": "I'm used to work at night.",
        "giusto": "I'm used to working at night.",
        "perche": "Con *be used to* il verbo che segue va in -ing."
      },
      {
        "sbagliato": "We used to lived in London.",
        "giusto": "We used to live in London.",
        "perche": "Dopo *used to* serve la forma base."
      }
    ],
    "consiglio": "Se nella frase c'è *did/didn't*, scrivi *use to* senza -d; se prima di *used to* c'è *be* o *get*, dopo ci vuole il gerundio.",
    "domande": [
      "q511",
      "q521",
      "q526"
    ]
  },
  {
    "id": "going-to",
    "titolo": "Going to: intenzioni e previsioni",
    "livello": "A2",
    "grammarTopic": "Future: going to",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Si forma con *am/is/are* + *going to* + forma base: *We are going to watch a movie*.",
      "Esprime un'intenzione già decisa: *I'm going to visit my grandparents this weekend*.",
      "Esprime anche una previsione basata su un'evidenza che vedi adesso: *Look at those clouds! It's going to rain*.",
      "La negativa è *am/is/are not going to*; la domanda si fa con l'inversione di *be*: *Is he going to...?* (non con *do/does*)."
    ],
    "esempi": [
      {
        "en": "I'm going to visit my grandparents this weekend.",
        "it": "Questo fine settimana andrò a trovare i miei nonni."
      },
      {
        "en": "Look at those dark clouds. It's going to rain.",
        "it": "Guarda quelle nuvole scure. Sta per piovere."
      },
      {
        "en": "What are you going to do tonight?",
        "it": "Cosa hai intenzione di fare stasera?"
      },
      {
        "en": "She isn't going to buy a new car.",
        "it": "Non ha intenzione di comprare una macchina nuova."
      },
      {
        "en": "Is he going to invite her to the party?",
        "it": "La inviterà alla festa?"
      },
      {
        "en": "Look out! He's going to fall!",
        "it": "Attento! Sta per cadere!"
      }
    ],
    "errori": [
      {
        "sbagliato": "We are going to watching a movie.",
        "giusto": "We are going to watch a movie.",
        "perche": "Dopo *going to* il verbo è alla forma base, senza -ing."
      },
      {
        "sbagliato": "Does he going to invite her?",
        "giusto": "Is he going to invite her?",
        "perche": "La domanda si fa con *be*, perché *going* fa parte di una forma con *be*."
      },
      {
        "sbagliato": "They going to start a new business.",
        "giusto": "They are going to start a new business.",
        "perche": "Manca *am/is/are* prima di *going to*."
      }
    ],
    "consiglio": "Se la frase esprime un piano o un indizio che vedi adesso, cerca *am/is/are going to* + forma base.",
    "domande": [
      "q311",
      "q312",
      "q309"
    ]
  },
  {
    "id": "first-conditional",
    "titolo": "Primo periodo ipotetico (First Conditional)",
    "livello": "B1",
    "grammarTopic": "First Conditional",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Descrive una situazione futura possibile o probabile: *If it rains, we will stay home*.",
      "Struttura: *if* + Present Simple, *will* + forma base. Nella parte con *if* non si mette *will*.",
      "Le due parti si possono invertire: *I will call you if I hear any news* (senza virgola).",
      "*Unless* significa \"se non\": *Unless you try, you won't succeed*. Dopo *unless* il verbo è affermativo."
    ],
    "esempi": [
      {
        "en": "If you study hard, you will pass the exam.",
        "it": "Se studi molto, supererai l'esame."
      },
      {
        "en": "I will call you if I hear any news.",
        "it": "Ti chiamerò se avrò notizie."
      },
      {
        "en": "If it rains, we won't go to the beach.",
        "it": "Se piove, non andremo in spiaggia."
      },
      {
        "en": "What will you do if you miss the train?",
        "it": "Cosa farai se perdi il treno?"
      },
      {
        "en": "If you don't hurry, we will be late.",
        "it": "Se non ti sbrighi, faremo tardi."
      },
      {
        "en": "Unless it rains, we will go for a walk.",
        "it": "A meno che non piova, andremo a fare una passeggiata."
      }
    ],
    "errori": [
      {
        "sbagliato": "If it will rain, we will stay home.",
        "giusto": "If it rains, we will stay home.",
        "perche": "Dopo *if* si usa il Present Simple, anche se il senso è futuro."
      },
      {
        "sbagliato": "If I would have time, I will help you.",
        "giusto": "If I have time, I will help you.",
        "perche": "Nel primo periodo ipotetico *would* non va mai dopo *if*."
      },
      {
        "sbagliato": "Unless you don't try, you won't succeed.",
        "giusto": "Unless you try, you won't succeed.",
        "perche": "*Unless* contiene già la negazione, quindi il verbo resta affermativo."
      }
    ],
    "consiglio": "Nella parte con *if* o *unless* cerca il verbo al presente; *will* va solo nella parte principale.",
    "domande": [
      "q131",
      "q133",
      "q135"
    ]
  },
  {
    "id": "second-conditional",
    "titolo": "Secondo periodo ipotetico (Second Conditional)",
    "livello": "B1",
    "grammarTopic": "Second Conditional",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Descrive situazioni immaginarie o poco probabili nel presente o nel futuro: *If I won the lottery, I would buy a big house*.",
      "Struttura: *if* + Past Simple, *would* + forma base.",
      "Il verbo dopo *if* è al passato ma non parla del passato: è la forma dell'irrealtà, come il congiuntivo imperfetto italiano.",
      "Con *be* si usa *were* per tutte le persone, soprattutto nei consigli: *If I were you...*",
      "Dopo *if* non si mette *would*."
    ],
    "esempi": [
      {
        "en": "If I won the lottery, I would buy a big house.",
        "it": "Se vincessi alla lotteria, comprerei una grande casa."
      },
      {
        "en": "If I were you, I would study more.",
        "it": "Se fossi in te, studierei di più."
      },
      {
        "en": "What would you do if you saw a ghost?",
        "it": "Cosa faresti se vedessi un fantasma?"
      },
      {
        "en": "If we had a car, we could go to the mountains.",
        "it": "Se avessimo una macchina, potremmo andare in montagna."
      },
      {
        "en": "I wouldn't go there if I were you.",
        "it": "Non ci andrei, se fossi in te."
      },
      {
        "en": "If she knew the truth, she would be angry.",
        "it": "Se sapesse la verità, si arrabbierebbe."
      }
    ],
    "errori": [
      {
        "sbagliato": "If I would have more time, I would learn a new language.",
        "giusto": "If I had more time, I would learn a new language.",
        "perche": "Dopo *if* si usa il Past Simple, non *would*."
      },
      {
        "sbagliato": "If I am you, I will study more.",
        "giusto": "If I were you, I would study more.",
        "perche": "È un'ipotesi irreale: servono *were* e *would*, non il presente e *will*."
      },
      {
        "sbagliato": "If they don't eat so much pizza, they wouldn't feel sick.",
        "giusto": "If they didn't eat so much pizza, they wouldn't feel sick.",
        "perche": "Nella parte con *if* il verbo è al Past Simple (*didn't eat*), non al presente."
      }
    ],
    "consiglio": "Quando in italiano trovi \"se + congiuntivo imperfetto\" (*se avessi, se fossi*), pensa a *if* + Past Simple e *would* + forma base.",
    "domande": [
      "q380",
      "q432",
      "q436"
    ]
  },
  {
    "id": "third-conditional",
    "titolo": "Terzo periodo ipotetico (Third Conditional)",
    "livello": "B1",
    "grammarTopic": "Third Conditional",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Serve per parlare di qualcosa che nel passato non è successo e di che cosa sarebbe successo altrimenti.",
      "Si forma con *If* + *had* + participio passato, poi *would have* + participio passato.",
      "Le due parti si possono invertire: *We would have missed the bus if we hadn't left early.*",
      "Nella parte con *if* non va mai *would*: ci vuole *had*."
    ],
    "esempi": [
      {
        "en": "If I had studied more, I would have passed the exam.",
        "it": "Se avessi studiato di più, avrei superato l'esame."
      },
      {
        "en": "If she had known about the party, she would have come.",
        "it": "Se avesse saputo della festa, sarebbe venuta."
      },
      {
        "en": "We would have missed the bus if we hadn't left early.",
        "it": "Avremmo perso l'autobus se non fossimo usciti presto."
      },
      {
        "en": "If it hadn't been so cold, we would have gone swimming.",
        "it": "Se non avesse fatto così freddo, saremmo andati a nuotare."
      },
      {
        "en": "What would you have done if you had lost your passport?",
        "it": "Che cosa avresti fatto se avessi perso il passaporto?"
      }
    ],
    "errori": [
      {
        "sbagliato": "If I would have known, I would have called you.",
        "giusto": "If I had known, I would have called you.",
        "perche": "Dopo *if* non si usa *would*: serve *had* + participio."
      },
      {
        "sbagliato": "If we had left earlier, we didn't miss the train.",
        "giusto": "If we had left earlier, we wouldn't have missed the train.",
        "perche": "Nella principale serve *would have* + participio, non il Past Simple."
      },
      {
        "sbagliato": "If I have seen the message, I would have replied.",
        "giusto": "If I had seen the message, I would have replied.",
        "perche": "Per il passato irreale ci vuole *had*, non *have*."
      }
    ],
    "consiglio": "Se la frase parla di qualcosa che non è accaduto, cerca *had* + participio dopo *if* e *would have* + participio nell'altra parte: se ne manca una, l'opzione è sbagliata.",
    "domande": [
      "q381",
      "q450",
      "q459"
    ]
  },
  {
    "id": "passive-voice",
    "titolo": "Forma passiva",
    "livello": "B1",
    "grammarTopic": "Passive Voice",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Si forma con *be* + participio passato: *The bridge was built in 2005.*",
      "Si usa quando interessa l'azione o chi la subisce, e chi la compie non si sa o non conta.",
      "Il tempo si vede da *be*: *is built* (presente), *was built* (passato), *will be built* (futuro), *has been built* (Present Perfect), *is being built* (azione in corso).",
      "Chi compie l'azione, se serve, si aggiunge con *by*; dopo un modale si usa *be* + participio (*must be solved*)."
    ],
    "esempi": [
      {
        "en": "English is spoken in many countries.",
        "it": "In molti paesi si parla inglese."
      },
      {
        "en": "My bicycle was stolen yesterday.",
        "it": "La mia bicicletta è stata rubata ieri."
      },
      {
        "en": "My car is being repaired at the moment.",
        "it": "La mia auto è in riparazione in questo momento."
      },
      {
        "en": "A new library will be built next year.",
        "it": "L'anno prossimo verrà costruita una nuova biblioteca."
      },
      {
        "en": "The tickets have already been sold.",
        "it": "I biglietti sono già stati venduti."
      },
      {
        "en": "The problem must be solved immediately.",
        "it": "Il problema deve essere risolto subito."
      }
    ],
    "errori": [
      {
        "sbagliato": "The bridge was build in 2005.",
        "giusto": "The bridge was built in 2005.",
        "perche": "Dopo *be* serve il participio passato, non la forma base."
      },
      {
        "sbagliato": "My car is repairing at the moment.",
        "giusto": "My car is being repaired at the moment.",
        "perche": "Il passivo di un'azione in corso è *is being* + participio."
      },
      {
        "sbagliato": "The letter wrote by John yesterday.",
        "giusto": "The letter was written by John yesterday.",
        "perche": "Nel passivo manca *be*: ci vuole *was* + participio."
      },
      {
        "sbagliato": "The problem must solved immediately.",
        "giusto": "The problem must be solved immediately.",
        "perche": "Dopo il modale va *be* prima del participio."
      }
    ],
    "consiglio": "Chiediti se il soggetto fa l'azione o la subisce: se la subisce, scegli l'opzione con *be* nel tempo giusto + participio passato.",
    "domande": [
      "q465",
      "q468",
      "q472"
    ]
  },
  {
    "id": "reported-speech",
    "titolo": "Discorso indiretto (Reported Speech)",
    "livello": "B1",
    "grammarTopic": "Reported Speech",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Quando riporti le parole di qualcuno con un verbo al passato (*said, told, asked*), i tempi fanno un passo indietro (*backshift*): *am/is → was*, presente → passato, *will → would*, *can → could*, *have finished → had finished*.",
      "Cambiano anche i pronomi: *I* diventa *he* o *she*.",
      "*say* non vuole la persona (*He said that…*); con la persona si usa *tell* (*He told me that…*).",
      "Nelle domande riportate l'ordine è quello della frase affermativa, senza *do/does/did*: *She asked if I liked coffee.*",
      "Per ordini e consigli: *tell/ask/advise* + persona + *to* + verbo, al negativo *not to*."
    ],
    "esempi": [
      {
        "en": "She said that she was tired.",
        "it": "Disse che era stanca."
      },
      {
        "en": "He told me he would call me later.",
        "it": "Mi disse che mi avrebbe chiamato più tardi."
      },
      {
        "en": "He asked me where I lived.",
        "it": "Mi chiese dove abitassi."
      },
      {
        "en": "She asked me if I was okay.",
        "it": "Mi chiese se stessi bene."
      },
      {
        "en": "He told me not to touch that.",
        "it": "Mi disse di non toccare quella cosa."
      },
      {
        "en": "He advised me to study.",
        "it": "Mi ha consigliato di studiare."
      }
    ],
    "errori": [
      {
        "sbagliato": "He said me that he was tired.",
        "giusto": "He told me that he was tired.",
        "perche": "*say* non è seguito dalla persona; con la persona si usa *tell*."
      },
      {
        "sbagliato": "She asked me where did I live.",
        "giusto": "She asked me where I lived.",
        "perche": "Nella domanda riportata non c'è inversione né *did*."
      },
      {
        "sbagliato": "He said that he will call later.",
        "giusto": "He said that he would call later.",
        "perche": "Con *said* al passato *will* diventa *would*."
      },
      {
        "sbagliato": "He told me don't touch that.",
        "giusto": "He told me not to touch that.",
        "perche": "Un ordine negativo riportato si fa con *not to* + verbo."
      }
    ],
    "consiglio": "Guarda prima il verbo che introduce (*said, told, asked*): se è al passato, sposta i tempi indietro, poi controlla *say/tell* e l'ordine delle parole.",
    "domande": [
      "q489",
      "q492",
      "q494"
    ]
  },
  {
    "id": "modals-obligation-advice",
    "titolo": "Obbligo e consiglio: must, have to, should",
    "livello": "A2",
    "grammarTopic": "Modals of Obligation and Advice",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "*must* e *have to* esprimono obbligo; *have to* è più usato per regole e doveri che vengono da fuori (*He has to work late today*).",
      "*should* dà un consiglio: *You should eat more vegetables.*",
      "*mustn't* esprime un divieto; *don't have to* vuol dire che non è necessario, ma si può fare.",
      "*must* e *should* sono seguiti dalla forma base senza *to*; *have to* si comporta come un verbo normale: *Do I have to…?*, *He has to…*"
    ],
    "esempi": [
      {
        "en": "You mustn't use your phone during the exam.",
        "it": "Non devi usare il telefono durante l'esame."
      },
      {
        "en": "You don't have to come if you're tired.",
        "it": "Non sei obbligato a venire se sei stanco."
      },
      {
        "en": "You should drink more water.",
        "it": "Dovresti bere più acqua."
      },
      {
        "en": "Should I wear a suit to the interview?",
        "it": "Dovrei mettere il completo per il colloquio?"
      },
      {
        "en": "Do I have to take off my shoes?",
        "it": "Devo togliermi le scarpe?"
      },
      {
        "en": "He has to work late today.",
        "it": "Oggi deve lavorare fino a tardi."
      }
    ],
    "errori": [
      {
        "sbagliato": "You must to go now.",
        "giusto": "You must go now.",
        "perche": "Dopo un modale non si mette *to*."
      },
      {
        "sbagliato": "You don't have to touch that wire! It's dangerous.",
        "giusto": "You mustn't touch that wire! It's dangerous.",
        "perche": "Per un divieto serve *mustn't*: *don't have to* vuol dire solo che non è necessario."
      },
      {
        "sbagliato": "He musts work late today.",
        "giusto": "He has to work late today.",
        "perche": "*must* non prende la -s; alla terza persona si usa *has to*."
      },
      {
        "sbagliato": "Do I must wear a suit?",
        "giusto": "Do I have to wear a suit?",
        "perche": "*must* non usa *do*: o *Must I…?* oppure *Do I have to…?*"
      }
    ],
    "consiglio": "Quando in italiano trovi 'non devi', chiediti se è un divieto (*mustn't*) o solo non necessario (*don't have to*).",
    "domande": [
      "q347",
      "q354",
      "q358"
    ]
  },
  {
    "id": "modals-ability-permission",
    "titolo": "Capacità e permesso: can, could, may",
    "livello": "A1",
    "grammarTopic": "Modals of Ability and Permission",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "*can* indica capacità (*She can swim*) e serve anche per chiedere o dare un permesso (*Can I help you?*).",
      "Resta sempre uguale: niente -s alla terza persona e dopo va la forma base senza *to*.",
      "Nella domanda *can* passa davanti al soggetto, senza *do*; la negazione è *can't* o *cannot*.",
      "Per una capacità che avevi nel passato si usa *could*; *may* è più formale per chiedere permesso (*May I come in?*)."
    ],
    "esempi": [
      {
        "en": "She can swim very well.",
        "it": "Sa nuotare molto bene."
      },
      {
        "en": "Can I help you?",
        "it": "Posso aiutarti?"
      },
      {
        "en": "Can I offer you something to drink?",
        "it": "Ti posso offrire qualcosa da bere?"
      },
      {
        "en": "James can speak English very well.",
        "it": "James parla molto bene l'inglese."
      },
      {
        "en": "When I was ten, I could swim across the lake.",
        "it": "Quando avevo dieci anni riuscivo ad attraversare il lago a nuoto."
      },
      {
        "en": "May I open the window?",
        "it": "Posso aprire la finestra?"
      }
    ],
    "errori": [
      {
        "sbagliato": "She can swims very well.",
        "giusto": "She can swim very well.",
        "perche": "Dopo *can* il verbo è alla forma base, anche con *she*."
      },
      {
        "sbagliato": "Do I can help you?",
        "giusto": "Can I help you?",
        "perche": "*can* fa la domanda da solo: non vuole *do*."
      },
      {
        "sbagliato": "Francesco can to speak English.",
        "giusto": "Francesco can speak English.",
        "perche": "Dopo *can* non si mette *to*."
      },
      {
        "sbagliato": "She knows swim very well.",
        "giusto": "She can swim very well.",
        "perche": "Per 'sapere fare' si usa *can*, non *know*."
      }
    ],
    "consiglio": "Dopo *can* e *could* il verbo resta nudo: niente -s, niente *to*, niente *do* nelle domande.",
    "domande": [
      "q139",
      "q145",
      "q24"
    ]
  },
  {
    "id": "modals-deduction",
    "titolo": "Deduzione: must, can't, might",
    "livello": "B1",
    "grammarTopic": "Modals of Deduction",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Servono per dire che cosa pensi sia vero, in base agli indizi che hai.",
      "*must be* = sono quasi sicuro che sia così; *can't be* = sono quasi sicuro che non sia così; *might be* (o *may*, *could*) = è possibile, ma non lo so.",
      "Dopo il modale va la forma base senza *to*: *must be*, *can't be*.",
      "Il contrario di *must* in una deduzione è *can't*, non *mustn't*, che esprime un divieto."
    ],
    "esempi": [
      {
        "en": "He has a Ferrari and a mansion. He must be very rich.",
        "it": "Ha una Ferrari e una villa. Deve essere molto ricco."
      },
      {
        "en": "That can't be Sarah. She's in London this week.",
        "it": "Non può essere Sarah. Questa settimana è a Londra."
      },
      {
        "en": "It's dark and the house is silent. They must be asleep.",
        "it": "È buio e la casa è silenziosa. Devono dormire."
      },
      {
        "en": "I can't find my phone. It might be in the car.",
        "it": "Non trovo il telefono. Potrebbe essere in macchina."
      },
      {
        "en": "That can't be John's car. His is blue, not red.",
        "it": "Quella non può essere l'auto di John. La sua è blu, non rossa."
      },
      {
        "en": "Take an umbrella. It might rain later.",
        "it": "Prendi un ombrello. Potrebbe piovere più tardi."
      }
    ],
    "errori": [
      {
        "sbagliato": "It mustn't be him.",
        "giusto": "It can't be him.",
        "perche": "Per dire 'sono sicuro che non sia lui' si usa *can't*; *mustn't* è un divieto."
      },
      {
        "sbagliato": "He just ate a huge meal. He must be hungry.",
        "giusto": "He just ate a huge meal. He can't be hungry.",
        "perche": "L'indizio porta a escludere la fame, quindi serve *can't*."
      },
      {
        "sbagliato": "She must to be from France.",
        "giusto": "She must be from France.",
        "perche": "Dopo un modale non si mette *to*."
      },
      {
        "sbagliato": "I haven't checked, but she must be at home.",
        "giusto": "I haven't checked, but she might be at home.",
        "perche": "Se non sei sicuro, *must* è troppo forte: serve *might* o *could*."
      }
    ],
    "consiglio": "Misura quanto sei sicuro: molto sicuro di sì = *must*, molto sicuro di no = *can't*, non sicuro = *might*.",
    "domande": [
      "q396",
      "q546",
      "q548"
    ]
  },
  {
    "id": "gerunds-infinitives",
    "titolo": "Gerundio o infinito",
    "livello": "B1",
    "grammarTopic": "Gerunds vs Infinitives",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Dopo alcuni verbi va il gerundio (-ing): *enjoy, avoid, finish, mind, keep, miss, can't stand*.",
      "Dopo altri va l'infinito con *to*: *want, decide, hope, plan, promise, offer, would like*.",
      "Dopo una preposizione si usa sempre -ing: *interested in learning*, *look forward to meeting* (qui *to* è una preposizione).",
      "*stop, remember, forget, try* cambiano significato: *stop to have a coffee* (mi fermo per prendere un caffè), *stop smoking* (smetto di fumare)."
    ],
    "esempi": [
      {
        "en": "I really enjoy reading books in my free time.",
        "it": "Mi piace molto leggere libri nel tempo libero."
      },
      {
        "en": "She decided to buy a new car.",
        "it": "Ha deciso di comprare un'auto nuova."
      },
      {
        "en": "Do you mind opening the window?",
        "it": "Ti dispiace aprire la finestra?"
      },
      {
        "en": "I look forward to meeting you next week.",
        "it": "Non vedo l'ora di incontrarti la settimana prossima."
      },
      {
        "en": "We stopped to have a coffee.",
        "it": "Ci siamo fermati per prendere un caffè."
      },
      {
        "en": "He stopped smoking last year.",
        "it": "Ha smesso di fumare l'anno scorso."
      }
    ],
    "errori": [
      {
        "sbagliato": "I enjoy to swim.",
        "giusto": "I enjoy swimming.",
        "perche": "*enjoy* vuole il gerundio, non l'infinito."
      },
      {
        "sbagliato": "They want buying a new house.",
        "giusto": "They want to buy a new house.",
        "perche": "*want* vuole l'infinito con *to*."
      },
      {
        "sbagliato": "I look forward to meet you.",
        "giusto": "I look forward to meeting you.",
        "perche": "In *look forward to* il *to* è una preposizione, quindi segue -ing."
      },
      {
        "sbagliato": "Stop to make noise!",
        "giusto": "Stop making noise!",
        "perche": "*stop to* + verbo vuol dire 'fermarsi per fare'; per 'smettere di' si usa -ing."
      }
    ],
    "consiglio": "Impara le due liste corte (*enjoy, avoid, finish, mind* + -ing; *want, decide, hope, plan* + *to*) e ricorda che dopo una preposizione c'è sempre -ing.",
    "domande": [
      "q398",
      "q425",
      "q566"
    ]
  },
  {
    "id": "relative-clauses",
    "titolo": "Frasi relative: who, which, that, whose",
    "livello": "B1",
    "grammarTopic": "Relative Clauses",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "*who* si usa per le persone, *which* per le cose, *that* per entrambe quando la relativa serve a identificare il nome.",
      "*whose* indica possesso: *the girl whose car was stolen*.",
      "*where* si usa per i luoghi e *when* per i periodi di tempo: *the days when I was young*.",
      "Se la relativa è tra virgole (informazione in più), *that* non si può usare: *Paris, which is the capital of France, is beautiful.*"
    ],
    "esempi": [
      {
        "en": "The man who lives next door is a doctor.",
        "it": "L'uomo che abita accanto è un dottore."
      },
      {
        "en": "This is the book which I borrowed from the library.",
        "it": "Questo è il libro che ho preso in prestito in biblioteca."
      },
      {
        "en": "The girl whose car was stolen is at the police station.",
        "it": "La ragazza a cui hanno rubato l'auto è alla stazione di polizia."
      },
      {
        "en": "That's the house where I grew up.",
        "it": "Quella è la casa in cui sono cresciuto."
      },
      {
        "en": "Winter is the season when it snows.",
        "it": "L'inverno è la stagione in cui nevica."
      },
      {
        "en": "Paris, which is the capital of France, is beautiful.",
        "it": "Parigi, che è la capitale della Francia, è bellissima."
      }
    ],
    "errori": [
      {
        "sbagliato": "The book who I bought was boring.",
        "giusto": "The book which I bought was boring.",
        "perche": "*who* si usa solo per le persone; per le cose serve *which* o *that*."
      },
      {
        "sbagliato": "The woman who car was stolen is my neighbor.",
        "giusto": "The woman whose car was stolen is my neighbor.",
        "perche": "Per il possesso ('la cui') serve *whose*."
      },
      {
        "sbagliato": "Paris, that is the capital of France, is beautiful.",
        "giusto": "Paris, which is the capital of France, is beautiful.",
        "perche": "Tra virgole non si usa *that*."
      },
      {
        "sbagliato": "The hotel where we stayed at was on the beach.",
        "giusto": "The hotel that we stayed at was on the beach.",
        "perche": "Con *where* non si aggiunge la preposizione: o *where we stayed* oppure *that we stayed at*."
      }
    ],
    "consiglio": "Guarda il nome che precede: persona = *who*, cosa = *which* o *that*, luogo = *where*, tempo = *when*, 'di cui è' = *whose*.",
    "domande": [
      "q404",
      "q406",
      "q605"
    ]
  },
  {
    "id": "question-tags",
    "titolo": "Question tags",
    "livello": "B1",
    "grammarTopic": "Question Tags",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Il tag è la piccola domanda finale con cui si chiede conferma: *It's cold today, isn't it?*",
      "Frase positiva → tag negativo; frase negativa → tag positivo.",
      "Il tag riprende lo stesso ausiliare della frase (*can → can't he*, *will → won't you*); se non c'è, si usa *do/does/did*: *She went to Paris, didn't she?*",
      "Casi particolari: *I am → aren't I*, *Let's → shall we*, imperativo → *will you*; con *nothing, nobody, never* la frase è già negativa, quindi il tag è positivo."
    ],
    "esempi": [
      {
        "en": "You are Italian, aren't you?",
        "it": "Siete italiani, vero?"
      },
      {
        "en": "She went to Paris, didn't she?",
        "it": "È andata a Parigi, vero?"
      },
      {
        "en": "He can't swim, can he?",
        "it": "Non sa nuotare, vero?"
      },
      {
        "en": "I am right, aren't I?",
        "it": "Ho ragione, vero?"
      },
      {
        "en": "Let's take a short break, shall we?",
        "it": "Facciamo una breve pausa, ti va?"
      },
      {
        "en": "Nothing went wrong during the test, did it?",
        "it": "Durante il test non è andato storto niente, vero?"
      }
    ],
    "errori": [
      {
        "sbagliato": "She didn't go to the party, didn't she?",
        "giusto": "She didn't go to the party, did she?",
        "perche": "Dopo una frase negativa il tag è positivo."
      },
      {
        "sbagliato": "I am right, am not I?",
        "giusto": "I am right, aren't I?",
        "perche": "Con *I am* il tag è *aren't I*."
      },
      {
        "sbagliato": "She went to Paris, wasn't she?",
        "giusto": "She went to Paris, didn't she?",
        "perche": "Senza ausiliare nella frase si usa *did/do/does*, non *be*."
      },
      {
        "sbagliato": "Nobody phoned, didn't they?",
        "giusto": "Nobody phoned, did they?",
        "perche": "*Nobody* rende già negativa la frase, quindi il tag è positivo."
      }
    ],
    "consiglio": "Individua il verbo della frase, ripeti lo stesso ausiliare (o *do/does/did*) con il segno opposto e chiudi con un pronome.",
    "domande": [
      "q529",
      "q535",
      "q581"
    ]
  },
  {
    "id": "questions-origins",
    "titolo": "Domande e provenienza: how, where, whose",
    "livello": "A1",
    "grammarTopic": "Questions and Origins",
    "inCheatSheet": false,
    "pronta": true,
    "regola": [
      "Le domande si aprono con una parola interrogativa: *what* (che cosa), *where* (dove), *when* (quando), *why* (perché), *who* (chi), *whose* (di chi), *how* (come).",
      "Con *be* il verbo va prima del soggetto: *Where is Maria from?*, *Are they Spanish?*",
      "Con gli altri verbi servono *do/does/did*: *Where does your brother come from?*",
      "Per la provenienza si dice *Where are you from?* oppure *Where do you come from?*, con *from* in fondo.",
      "*how* si combina con altre parole: *how old* (età), *how much* (non numerabili e prezzi), *how many* (numerabili)."
    ],
    "esempi": [
      {
        "en": "Where does your brother come from?",
        "it": "Da dove viene tuo fratello?"
      },
      {
        "en": "Where is Maria from?",
        "it": "Di dov'è Maria?"
      },
      {
        "en": "Where were you born?",
        "it": "Dove sei nato?"
      },
      {
        "en": "How old are you?",
        "it": "Quanti anni hai?"
      },
      {
        "en": "Whose bag is this?",
        "it": "Di chi è questa borsa?"
      },
      {
        "en": "How many languages do you speak?",
        "it": "Quante lingue parli?"
      }
    ],
    "errori": [
      {
        "sbagliato": "Where is your brother come from?",
        "giusto": "Where does your brother come from?",
        "perche": "*come* è un verbo normale: la domanda si fa con *does*, non con *is*."
      },
      {
        "sbagliato": "Are they Spain?",
        "giusto": "Are they Spanish?",
        "perche": "Per la nazionalità serve l'aggettivo (*Spanish*), non il nome del paese."
      },
      {
        "sbagliato": "Why you are late?",
        "giusto": "Why are you late?",
        "perche": "Nella domanda il verbo *be* precede il soggetto."
      },
      {
        "sbagliato": "Who bag is this?",
        "giusto": "Whose bag is this?",
        "perche": "Per il possesso ('di chi') si usa *whose*."
      }
    ],
    "consiglio": "Traduci bene la parola italiana (*dove* = where, *di chi* = whose, *quanti anni* = how old) e controlla che dopo ci sia verbo + soggetto, con *do/does/did* se il verbo non è *be*.",
    "domande": [
      "q111",
      "q114",
      "q199"
    ]
  },
  {
    "id": "there-is-are",
    "titolo": "There is / There are: esistenza e presenza",
    "livello": "A1",
    "grammarTopic": "There is / There are",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Si usa per dire che qualcosa esiste o si trova in un posto: *there is* con il singolare e con i non numerabili, *there are* con il plurale.",
      "Nel passato diventa *there was* / *there were*; la domanda si fa invertendo: *Is there a bank here?*, *Are there any messages?*",
      "Nelle negative e nelle domande con i plurali e i non numerabili si usa *any*: *There aren't any chairs*, *Is there any milk?* Con *no* il verbo resta affermativo: *There is no problem*.",
      "*There* indica che qualcosa c'è, *it* parla di qualcosa che già conosci: *There is a bus at six* ma *It is late*.",
      "Non si usano *have* né *do* per dire \"c'è\": *Do there...?* e *There have...* sono sbagliati."
    ],
    "esempi": [
      {
        "en": "There is a big tree in the garden.",
        "it": "C'è un grande albero in giardino."
      },
      {
        "en": "There are three chairs in the room.",
        "it": "Ci sono tre sedie nella stanza."
      },
      {
        "en": "Is there a good restaurant near here?",
        "it": "C'è un buon ristorante qui vicino?"
      },
      {
        "en": "Are there any messages for me?",
        "it": "Ci sono messaggi per me?"
      },
      {
        "en": "There isn't any sugar in my coffee.",
        "it": "Non c'è zucchero nel mio caffè."
      },
      {
        "en": "There was nobody at home.",
        "it": "Non c'era nessuno in casa."
      }
    ],
    "errori": [
      {
        "sbagliato": "There is people in the room.",
        "giusto": "There are people in the room.",
        "perche": "*People* è plurale, quindi serve *there are*."
      },
      {
        "sbagliato": "They are many cars on the street.",
        "giusto": "There are many cars on the street.",
        "perche": "Per dire \"ci sono\" si usa *there are*, non *they are*."
      },
      {
        "sbagliato": "There isn't no sugar in my coffee.",
        "giusto": "There isn't any sugar in my coffee.",
        "perche": "Una sola negazione: con *isn't* si usa *any*, non *no*."
      },
      {
        "sbagliato": "Do there any biscuits in the box?",
        "giusto": "Are there any biscuits in the box?",
        "perche": "La domanda si fa con *are there*, senza *do*."
      }
    ],
    "consiglio": "Guarda il nome dopo il verbo: se è singolare o non numerabile scegli *is*, se è plurale scegli *are*.",
    "domande": [
      "q210",
      "q213",
      "q62"
    ]
  },
  {
    "id": "quantifiers",
    "titolo": "Quantificatori: much, many, few, little, some, any",
    "livello": "A1",
    "grammarTopic": "Quantifiers",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "*Much* e *little* si usano con i nomi non numerabili (*money, time, milk*); *many* e *few* con i numerabili al plurale (*friends, cars*). Nelle frasi affermative si usa spesso *a lot of* per entrambi.",
      "*A few* e *a little* significano «qualche, un po'»; senza *a* (*few, little*) significano «pochi, poco» in senso negativo.",
      "*Some* si usa nelle affermative e nelle offerte o richieste (*Would you like some tea?*); *any* nelle negative e nelle domande.",
      "*Information, advice, news, furniture, luggage, homework* sono non numerabili: non hanno il plurale e vogliono il verbo al singolare."
    ],
    "esempi": [
      {
        "en": "How many people are at the party?",
        "it": "Quante persone ci sono alla festa?"
      },
      {
        "en": "How much sugar do you want in your coffee?",
        "it": "Quanto zucchero vuoi nel caffè?"
      },
      {
        "en": "I have very little time today.",
        "it": "Oggi ho pochissimo tempo."
      },
      {
        "en": "Only a few students came to the lecture.",
        "it": "Alla lezione sono venuti solo pochi studenti."
      },
      {
        "en": "Would you like some tea?",
        "it": "Vorresti del tè?"
      },
      {
        "en": "Could you give me some information about the course?",
        "it": "Puoi darmi qualche informazione sul corso?"
      }
    ],
    "errori": [
      {
        "sbagliato": "How much people are at the party?",
        "giusto": "How many people are at the party?",
        "perche": "*People* è un plurale numerabile, quindi vuole *many*."
      },
      {
        "sbagliato": "I need many informations.",
        "giusto": "I need some information.",
        "perche": "*Information* è non numerabile: niente plurale e niente *many*."
      },
      {
        "sbagliato": "I have very few time.",
        "giusto": "I have very little time.",
        "perche": "*Time* non è numerabile, quindi serve *little*, non *few*."
      },
      {
        "sbagliato": "There aren't some apples.",
        "giusto": "There aren't any apples.",
        "perche": "Nelle frasi negative si usa *any*."
      }
    ],
    "consiglio": "Prima di scegliere, chiediti se il nome può avere il plurale: se non può (*money, advice, luggage*), niente *many* né *few*.",
    "domande": [
      "q107",
      "q191",
      "q570"
    ]
  },
  {
    "id": "comparatives-superlatives",
    "titolo": "Comparativi e superlativi",
    "livello": "A2",
    "grammarTopic": "Comparatives and Superlatives",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Aggettivi corti: comparativo con *-er than* (*taller than*), superlativo con *the -est* (*the tallest*). Con *-y* diventa *-ier* (*heavy → heavier*); dopo una consonante singola questa si raddoppia (*hot → hotter*).",
      "Aggettivi lunghi: *more … than* e *the most …* (*more difficult, the most expensive*). Per il contrario si usa *less … than* e *the least …*.",
      "Irregolari: *good → better → the best*, *bad → worse → the worst*.",
      "Non si mescolano le due forme (mai *more* + *-er*) e il superlativo vuole *the*."
    ],
    "esempi": [
      {
        "en": "My brother is much taller than me.",
        "it": "Mio fratello è molto più alto di me."
      },
      {
        "en": "English is easier than Chinese.",
        "it": "L'inglese è più facile del cinese."
      },
      {
        "en": "This exercise is more difficult than the previous one.",
        "it": "Questo esercizio è più difficile del precedente."
      },
      {
        "en": "It's the worst movie I've ever seen.",
        "it": "È il film peggiore che abbia mai visto."
      },
      {
        "en": "This is the most expensive city in Europe.",
        "it": "Questa è la città più costosa d'Europa."
      },
      {
        "en": "Today is much hotter than yesterday.",
        "it": "Oggi è molto più caldo di ieri."
      }
    ],
    "errori": [
      {
        "sbagliato": "English is more easy than Chinese.",
        "giusto": "English is easier than Chinese.",
        "perche": "*Easy* è un aggettivo corto (finisce in *-y*): forma *easier*."
      },
      {
        "sbagliato": "It's the baddest movie I've ever seen.",
        "giusto": "It's the worst movie I've ever seen.",
        "perche": "*Bad* è irregolare: *worse*, *the worst*."
      },
      {
        "sbagliato": "The traffic is more heavier today.",
        "giusto": "The traffic is heavier today.",
        "perche": "Si usa una sola forma di comparativo: *-er* oppure *more*, non entrambe."
      },
      {
        "sbagliato": "New York is more modern that London.",
        "giusto": "New York is more modern than London.",
        "perche": "Il secondo termine del paragone è introdotto da *than*."
      }
    ],
    "consiglio": "Cerca nella frase *than* (comparativo) o *the* (superlativo), poi conta le sillabe dell'aggettivo e ricorda *good* e *bad*.",
    "domande": [
      "q84",
      "q121",
      "q594"
    ]
  },
  {
    "id": "adverbs-manner",
    "titolo": "Avverbi di modo",
    "livello": "A2",
    "grammarTopic": "Adverbs of Manner",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "L'avverbio di modo dice *come* si fa un'azione e si forma di solito aggiungendo *-ly* all'aggettivo: *slow → slowly*, *careful → carefully*. Con *-y* finale diventa *-ily* (*easy → easily*).",
      "Irregolare: *good* (aggettivo) → *well* (avverbio), mai *goodly*.",
      "*Fast* e *hard* hanno la stessa forma come aggettivo e avverbio (*He drives fast*, *She works hard*); *hardly* significa «a malapena».",
      "Dopo un verbo d'azione (*speak, work, drive*) serve l'avverbio; dopo *be* si usa l'aggettivo (*She is careful*)."
    ],
    "esempi": [
      {
        "en": "She speaks English very well.",
        "it": "Parla l'inglese molto bene."
      },
      {
        "en": "He drives very fast.",
        "it": "Guida molto velocemente."
      },
      {
        "en": "Please do your work carefully.",
        "it": "Per favore, fai il tuo lavoro con attenzione."
      },
      {
        "en": "They won the game easily.",
        "it": "Hanno vinto la partita facilmente."
      },
      {
        "en": "He worked hard to pass the exam.",
        "it": "Ha lavorato duramente per superare l'esame."
      },
      {
        "en": "Please speak slowly.",
        "it": "Per favore, parla lentamente."
      }
    ],
    "errori": [
      {
        "sbagliato": "He drives fastly.",
        "giusto": "He drives fast.",
        "perche": "*Fast* è già un avverbio: non prende *-ly*."
      },
      {
        "sbagliato": "She speaks English very good.",
        "giusto": "She speaks English very well.",
        "perche": "Il verbo *speak* vuole l'avverbio *well*, non l'aggettivo *good*."
      },
      {
        "sbagliato": "They worked hardly all day.",
        "giusto": "They worked hard all day.",
        "perche": "*Hardly* significa «a malapena»; «duramente» si dice *hard*."
      },
      {
        "sbagliato": "He closed the door quiet.",
        "giusto": "He closed the door quietly.",
        "perche": "Per descrivere come si compie l'azione serve l'avverbio in *-ly*."
      }
    ],
    "consiglio": "Se la parola risponde alla domanda «come?» riferita a un verbo, cerca la forma in *-ly* e controlla prima le eccezioni *well, fast, hard*.",
    "domande": [
      "q363",
      "q367",
      "q370"
    ]
  },
  {
    "id": "prepositions-time",
    "titolo": "Preposizioni di tempo: at, on, in, for, since",
    "livello": "B1",
    "grammarTopic": "Prepositions of Time",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "*At* + ora o momento preciso (*at 7 o'clock, at night*); *on* + giorni e date (*on Monday, on 5 May*); *in* + mesi, anni, stagioni e parti del giorno (*in March, in 2009, in the morning*).",
      "*For* + durata (*for two hours*); *since* + punto d'inizio (*since 2015, since Monday*). Con entrambe si usa di solito il Present Perfect.",
      "*In* + durata riferita al futuro significa «tra» (*in two minutes*); *between* non si usa in questo senso."
    ],
    "esempi": [
      {
        "en": "I usually go to bed at 11 PM.",
        "it": "Di solito vado a letto alle 23."
      },
      {
        "en": "The exam is on Friday.",
        "it": "L'esame è venerdì."
      },
      {
        "en": "My birthday is in March.",
        "it": "Il mio compleanno è a marzo."
      },
      {
        "en": "He has worked in that bank since 2015.",
        "it": "Lavora in quella banca dal 2015."
      },
      {
        "en": "We have been waiting for two hours.",
        "it": "Stiamo aspettando da due ore."
      },
      {
        "en": "The train will leave in two minutes.",
        "it": "Il treno partirà tra due minuti."
      }
    ],
    "errori": [
      {
        "sbagliato": "I have known him for 2010.",
        "giusto": "I have known him since 2010.",
        "perche": "*2010* è un punto d'inizio, non una durata: serve *since*."
      },
      {
        "sbagliato": "I live here since ten years.",
        "giusto": "I have lived here for ten years.",
        "perche": "*Ten years* è una durata (*for*) e con essa si usa il Present Perfect."
      },
      {
        "sbagliato": "He was born on 2005.",
        "giusto": "He was born in 2005.",
        "perche": "Con gli anni si usa *in*; *on* è per giorni e date."
      },
      {
        "sbagliato": "The bus leaves between two minutes.",
        "giusto": "The bus leaves in two minutes.",
        "perche": "Per «tra» riferito al tempo che manca si usa *in*."
      }
    ],
    "consiglio": "Davanti a una durata (*two hours, ten years*) scegli *for*; davanti a una data o a un momento di partenza (*2015, Monday*) scegli *since*.",
    "domande": [
      "q91",
      "q136",
      "q160"
    ]
  },
  {
    "id": "prepositions-place",
    "titolo": "Preposizioni di luogo: in, on, at, under, between",
    "livello": "A1",
    "grammarTopic": "Prepositions of Place",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "*In* = dentro uno spazio, una città o un paese (*in the wardrobe, in London*); *on* = su una superficie (*on the table, on the wall*); *at* = in un punto preciso o in un luogo dove si svolge un'attività (*at the bus stop, at the cinema*).",
      "*Under* = sotto, *behind* = dietro, *next to* = accanto a, *near* = vicino a.",
      "*Between* si usa per due persone o cose, *among* per più di due, in mezzo a un gruppo."
    ],
    "esempi": [
      {
        "en": "The cat is hiding under the bed.",
        "it": "Il gatto si sta nascondendo sotto il letto."
      },
      {
        "en": "She is waiting at the bus stop.",
        "it": "Sta aspettando alla fermata dell'autobus."
      },
      {
        "en": "The picture is hanging on the wall.",
        "it": "Il quadro è appeso alla parete."
      },
      {
        "en": "He lives in London.",
        "it": "Vive a Londra."
      },
      {
        "en": "The bank is next to the post office.",
        "it": "La banca è accanto all'ufficio postale."
      },
      {
        "en": "She sat between her two best friends.",
        "it": "Si è seduta tra le sue due migliori amiche."
      }
    ],
    "errori": [
      {
        "sbagliato": "I am into the cinema.",
        "giusto": "I am at the cinema.",
        "perche": "Per dire dove ci si trova si usa *at*; *into* indica un movimento verso l'interno."
      },
      {
        "sbagliato": "There is a spider at the ceiling.",
        "giusto": "There is a spider on the ceiling.",
        "perche": "Il ragno sta su una superficie, quindi *on*."
      },
      {
        "sbagliato": "The child is among his parents.",
        "giusto": "The child is between his parents.",
        "perche": "Con due persone si usa *between*, *among* è per più di due."
      },
      {
        "sbagliato": "He lives at London.",
        "giusto": "He lives in London.",
        "perche": "Con città e paesi si usa *in*."
      }
    ],
    "consiglio": "Immagina la scena: dentro qualcosa è *in*, sopra a contatto è *on*, un punto preciso è *at*.",
    "domande": [
      "q271",
      "q272",
      "q280"
    ]
  },
  {
    "id": "possessives",
    "titolo": "Aggettivi e pronomi possessivi",
    "livello": "A1",
    "grammarTopic": "Possessives",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Gli aggettivi possessivi stanno prima del nome e non vogliono l'articolo: *my, your, his, her, its, our, their* (*my car*, non *the my car*).",
      "I pronomi possessivi stanno da soli, senza nome: *mine, yours, his, hers, ours, theirs* (*This pen is mine*).",
      "Il possessivo si accorda con il possessore, non con la cosa posseduta: *his sister* è la sorella di lui, *her brother* è il fratello di lei.",
      "*Its* (di una cosa o di un animale) non ha apostrofo; *it's* significa *it is*. Nemmeno i pronomi hanno l'apostrofo (*yours*, mai *your's*)."
    ],
    "esempi": [
      {
        "en": "This is not my pen. It is yours.",
        "it": "Questa non è la mia penna. È la tua."
      },
      {
        "en": "Their house is very big.",
        "it": "La loro casa è molto grande."
      },
      {
        "en": "That is your jacket, not hers.",
        "it": "Quella è la tua giacca, non la sua."
      },
      {
        "en": "The dog is wagging its tail.",
        "it": "Il cane scodinzola."
      },
      {
        "en": "Our friends are coming.",
        "it": "I nostri amici stanno arrivando."
      },
      {
        "en": "This laptop is mine, not yours.",
        "it": "Questo portatile è mio, non tuo."
      }
    ],
    "errori": [
      {
        "sbagliato": "This book is my.",
        "giusto": "This book is mine.",
        "perche": "Se dopo non c'è un nome serve il pronome *mine*."
      },
      {
        "sbagliato": "The dog is wagging it's tail.",
        "giusto": "The dog is wagging its tail.",
        "perche": "*It's* è la forma abbreviata di *it is*; il possessivo è *its*."
      },
      {
        "sbagliato": "Is this your's?",
        "giusto": "Is this yours?",
        "perche": "I pronomi possessivi si scrivono senza apostrofo."
      },
      {
        "sbagliato": "Theirs house is very big.",
        "giusto": "Their house is very big.",
        "perche": "Prima di un nome si usa l'aggettivo *their*, non il pronome *theirs*."
      }
    ],
    "consiglio": "Guarda cosa viene dopo il possessivo: un nome vuole *my/your/their…*, la fine della frase vuole *mine/yours/theirs…*.",
    "domande": [
      "q217",
      "q222",
      "q227"
    ]
  },
  {
    "id": "possessive-s",
    "titolo": "Il genitivo sassone ('s)",
    "livello": "A1",
    "grammarTopic": "Possessive S",
    "inCheatSheet": true,
    "pronta": true,
    "regola": [
      "Per dire di chi è qualcosa si mette il possessore prima, con *'s*, e subito dopo la cosa posseduta, senza articolo: *Marco's computer*, *my mother's birthday*.",
      "Se il possessore è un plurale in *-s* si aggiunge solo l'apostrofo (*my parents' house*); i plurali irregolari prendono *'s* (*children's, women's, men's*).",
      "Si usa soprattutto con persone e animali; *'s* può anche indicare un luogo o un negozio (*at Paul's*, *the baker's*).",
      "L'apostrofo si mette prima della *s* se il possessore è uno solo (*friend's*) e dopo la *s* se sono più di uno (*friends'*)."
    ],
    "esempi": [
      {
        "en": "Where is Marco's computer?",
        "it": "Dov'è il computer di Marco?"
      },
      {
        "en": "My grandparents' house is big.",
        "it": "La casa dei miei nonni è grande."
      },
      {
        "en": "The children's toys are scattered everywhere.",
        "it": "I giocattoli dei bambini sono sparsi ovunque."
      },
      {
        "en": "Have you seen Anna's keys?",
        "it": "Hai visto le chiavi di Anna?"
      },
      {
        "en": "It's my mother's birthday.",
        "it": "È il compleanno di mia madre."
      },
      {
        "en": "Women's shoes are on the second floor.",
        "it": "Le scarpe da donna sono al secondo piano."
      }
    ],
    "errori": [
      {
        "sbagliato": "I don't like Sara makeup.",
        "giusto": "I don't like Sara's makeup.",
        "perche": "Il possessore ha bisogno di *'s*."
      },
      {
        "sbagliato": "Sarahs bag is red.",
        "giusto": "Sarah's bag is red.",
        "perche": "Senza apostrofo *Sarahs* sarebbe solo un plurale."
      },
      {
        "sbagliato": "My grandparent's house is big.",
        "giusto": "My grandparents' house is big.",
        "perche": "I nonni sono più di uno: plurale in *-s* e apostrofo dopo la *s*."
      },
      {
        "sbagliato": "The childrens' toys are here.",
        "giusto": "The children's toys are here.",
        "perche": "*Children* è già plurale (irregolare), quindi prende *'s*."
      }
    ],
    "consiglio": "Prima chiediti se il possessore è uno o più di uno, poi guarda se il plurale finisce in *-s*: questo ti dice dove va l'apostrofo.",
    "domande": [
      "q148",
      "q150",
      "q157"
    ]
  },
  {
    "id": "object-pronouns",
    "titolo": "Pronomi complemento: me, you, him, her, us, them",
    "livello": "A1",
    "grammarTopic": "Object Pronouns",
    "inCheatSheet": false,
    "pronta": true,
    "regola": [
      "I pronomi soggetto (*I, you, he, she, it, we, they*) stanno prima del verbo; quelli complemento (*me, you, him, her, it, us, them*) stanno dopo un verbo o una preposizione.",
      "Corrispondono a «mi, ti, lo, la, ci, li, le» e a «a me, con noi…»: *Call me*, *with us*, *for them*.",
      "In inglese il pronome complemento va sempre dopo il verbo (*I know them*), non prima come in italiano.",
      "*It* si usa per cose e animali, *him* e *her* per le persone. Non vanno confusi con i possessivi (*my, mine*) né con i riflessivi (*myself*)."
    ],
    "esempi": [
      {
        "en": "Can you help us with this exercise?",
        "it": "Puoi aiutarci con questo esercizio?"
      },
      {
        "en": "My parents are visiting me.",
        "it": "I miei genitori vengono a trovarmi."
      },
      {
        "en": "Are you coming with us to the cinema?",
        "it": "Vieni con noi al cinema?"
      },
      {
        "en": "I don't understand him.",
        "it": "Non lo capisco."
      },
      {
        "en": "I'll wait for them here.",
        "it": "Li aspetto qui."
      },
      {
        "en": "I bought her a present.",
        "it": "Le ho comprato un regalo."
      }
    ],
    "errori": [
      {
        "sbagliato": "I don't know they.",
        "giusto": "I don't know them.",
        "perche": "Dopo il verbo serve la forma complemento *them*, non il soggetto *they*."
      },
      {
        "sbagliato": "Can you help we?",
        "giusto": "Can you help us?",
        "perche": "*Help* ha un complemento: *us*, non *we*."
      },
      {
        "sbagliato": "Give I that book.",
        "giusto": "Give me that book.",
        "perche": "Chi riceve è un complemento: *me*."
      },
      {
        "sbagliato": "I don't believe to you.",
        "giusto": "I don't believe you.",
        "perche": "*Believe* vuole il complemento diretto, senza *to*."
      }
    ],
    "consiglio": "Dopo un verbo o dopo una preposizione (*with, for, to*) scegli sempre tra *me, you, him, her, it, us, them*.",
    "domande": [
      "q237",
      "q242",
      "q251"
    ]
  },
  {
    "id": "demonstratives",
    "titolo": "Dimostrativi: this, that, these, those",
    "livello": "A1",
    "grammarTopic": "Demonstratives",
    "inCheatSheet": false,
    "pronta": true,
    "regola": [
      "*This* (singolare) e *these* (plurale) indicano ciò che è vicino a chi parla; *that* (singolare) e *those* (plurale) ciò che è lontano.",
      "Concordano in numero con il nome: *this pen / these pens*, *that man / those men*.",
      "Con *to be* il verbo segue il numero di ciò che si indica: *This is my cat*, *These are my notes*.",
      "Valgono anche per il tempo: *this week* è la settimana in corso, *those days* indica un periodo lontano."
    ],
    "esempi": [
      {
        "en": "This is my cat.",
        "it": "Questo è il mio gatto."
      },
      {
        "en": "Those are my books.",
        "it": "Quelli sono i miei libri."
      },
      {
        "en": "That building over there is a hospital.",
        "it": "Quell'edificio laggiù è un ospedale."
      },
      {
        "en": "These are my notes.",
        "it": "Questi sono i miei appunti."
      },
      {
        "en": "Do you know those people?",
        "it": "Conosci quelle persone?"
      },
      {
        "en": "Can you pass me that pen?",
        "it": "Puoi passarmi quella penna?"
      }
    ],
    "errori": [
      {
        "sbagliato": "This are my notes.",
        "giusto": "These are my notes.",
        "perche": "*Notes* è plurale: serve *these*."
      },
      {
        "sbagliato": "Those man is my father.",
        "giusto": "That man is my father.",
        "perche": "*Man* è singolare, quindi *that*; *those* è il plurale."
      },
      {
        "sbagliato": "Do you know that people?",
        "giusto": "Do you know those people?",
        "perche": "*People* è plurale: *those*."
      },
      {
        "sbagliato": "These pizza is very good.",
        "giusto": "This pizza is very good.",
        "perche": "*Pizza* è singolare: *this*."
      }
    ],
    "consiglio": "Controlla per prima cosa se il nome è singolare o plurale, poi decidi vicino (*this/these*) o lontano (*that/those*).",
    "domande": [
      "q256",
      "q258",
      "q270"
    ]
  },
  {
    "id": "imperative",
    "titolo": "Imperativo",
    "livello": "A1",
    "grammarTopic": "Imperative",
    "inCheatSheet": false,
    "pronta": true,
    "regola": [
      "L'imperativo affermativo è la forma base del verbo, senza soggetto e senza *to*: *Close the door*, *Listen to me*.",
      "Il negativo si fa con *Don't* + forma base: *Don't touch that*. Non si usano *not*, *no* né *doesn't*.",
      "Con il verbo *be* si dice *Be quiet*, *Don't be late* (non *Are quiet*).",
      "*Please* rende l'ordine più cortese; per proporre qualcosa insieme si usa *Let's* + forma base (*Let's go*)."
    ],
    "esempi": [
      {
        "en": "Pass me the salt, please.",
        "it": "Passami il sale, per favore."
      },
      {
        "en": "Don't forget your keys.",
        "it": "Non dimenticare le chiavi."
      },
      {
        "en": "Be quiet, please.",
        "it": "Fai silenzio, per favore."
      },
      {
        "en": "Listen to me when I speak.",
        "it": "Ascoltami quando parlo."
      },
      {
        "en": "Don't touch my phone.",
        "it": "Non toccare il mio telefono."
      },
      {
        "en": "Do your homework before dinner.",
        "it": "Fai i compiti prima di cena."
      }
    ],
    "errori": [
      {
        "sbagliato": "Not touch my phone.",
        "giusto": "Don't touch my phone.",
        "perche": "Il divieto si forma con *Don't* + forma base."
      },
      {
        "sbagliato": "Closing the door, please.",
        "giusto": "Close the door, please.",
        "perche": "L'ordine usa la forma base, non il gerundio."
      },
      {
        "sbagliato": "Listen me when I speak.",
        "giusto": "Listen to me when I speak.",
        "perche": "*Listen* vuole la preposizione *to* davanti al complemento."
      },
      {
        "sbagliato": "Are quiet, please.",
        "giusto": "Be quiet, please.",
        "perche": "All'imperativo il verbo *be* diventa *be*."
      }
    ],
    "consiglio": "Per un ordine togli il soggetto e usa il verbo base; per un divieto aggiungi *Don't* davanti, qualunque sia il verbo.",
    "domande": [
      "q291",
      "q296",
      "q301"
    ]
  }
];

export const getTheoryTopic = (id: string): TheoryTopic | undefined => theoryTopics.find((t) => t.id === id);
