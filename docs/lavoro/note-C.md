# Note agente C: simulazioni e studio

## Cosa ho fatto

- **Tutto passa dal provider.** `ExamMode`, `LearnMode`, `StatsMode` leggono domande e risposte solo con `useAccess().provider` (`getQuestions`, `grade`, `startExam`, `submitExam`). Dal bundle uso soltanto l'indice leggero (`bankMeta()` in `lib/spacedRepetition.ts`, costruito con `toMeta`) e `getQuestionsByCorpus('initial')` per il nucleo. Stato di caricamento, errori con messaggio nella pagina e pulsante "Riprova" ovunque.
- **ExamMode**: schermata di avvio con le due schede (`FORMATS`), blocco con `canStartSim` e `onNeedPass('simulazione' | 'teng')`, TENG "In arrivo" se `startExam` lancia `formato_non_disponibile`, cronometro calcolato da una scadenza (non si sfasa se la scheda va in secondo piano), 4 o 5 opzioni (A-E), esito `rawCorrect/30` + punteggio con penalità nel TENG + esito con `passMark`, revisione delle sbagliate e delle omesse con spiegazione e "Studia la regola" (se c'è `onOpenTheory` e `theoryId`), consegna con `submitExam`, errore di consegna con "Riprova a consegnare" (stesse risposte, niente doppio invio), `ConfirmDialog` per uscita e consegna incompleta, `format` nello storico. `PASSING_SCORE` e `EXAM_DURATION` spariti. La prop `corpus` resta accettata e ignorata (App la passa ancora).
- **LearnMode / PracticeMenu**: senza Pass solo nucleo gratuito (anche se in `selectedCorpus` c'è `'all'`); "Punti deboli" e "Tutte le domande"/"Tutto il banco" mostrano il lucchetto e chiamano `onNeedPass('errori' | 'domande')`; LearnMode ha una rete di sicurezza (weakness senza Pass chiama `onNeedPass('errori')` una volta e non rende nulla). Spiegazione da `grade()` dopo ogni risposta, anche sbagliata, con link "Studia la regola" solo se `onOpenTheory` esiste. Le opzioni si rimescolano in LearnMode con una permutazione: al provider va sempre l'indice originale.
- **StatsMode**: senza Pass solo domande imparate (sul nucleo), accuratezza, ultimo esame e un invito `onNeedPass('statistiche')`. Con il Pass tutto com'era, ma con testi delle domande da `getQuestions` (a gruppi da 80). Tracker garanzia dietro `FEATURE_FLAGS.guarantee`. Tolti i punti regalati ("50 XP di partenza", "+1 per aver aperto l'app"): livello e sfida giornaliera contano solo risposte vere.
- **lib**: `selectPracticeIds` (sull'indice, con parametro `pass`), `selectPracticeQuestions` resta come ripiego sincrono; `updateStats(…, quiz?)` e `calculateContinuousQuality` accettano la domanda "come vista" (`QuizLike`) invece di cercarla nel banco; `diagnostic.ts` usa solo il nucleo (`diagnosticPool()`), funziona senza rete, prima passata con argomenti diversi e seconda che rilassa solo l'argomento (così i livelli 3/2/5 restano anche con un nucleo piccolo); stima beta-binomiale intatta. `utils.ts`: `prefersReducedMotion`, `formatNumber`, `formatDuration`, `errorCode`. `shuffleQuestion` invariato (la quinta opzione resta in `extraOption`, per le simulazioni c'è `prepareQuestion`).
- **CheatSheet**: introduzione con i fatti verificati, presi da `FORMATS`/`REAL_TEST_*` (TENG 24/30 in 15 min; ente LinguaViva 25/30; gli altri enti non pubblicano la soglia). **ActivityChart**: etichette in italiano.
- Niente emoji nell'interfaccia (tolte quelle di fiamma e stelle), niente `alert/confirm`, coriandoli solo se `prefers-reduced-motion` lo permette.

## Prova

`npx tsc --noEmit` pulito su tutto il progetto. Pagina di prova **`app/tests/anteprime/studio.html`** (+ `studio.tsx`, lasciata nel repository): usa il `LocalProvider` vero con `AccessContext` regolato dall'URL (`s=exam|learn|practice|stats|cheat`, `pass=1`, `sims=1`, `tengfinto=1`, `fallisci=start|submit|grade|domande`, `tema=dark`, `dati=1`) e registra le chiamate in `window.__log`. Provata in Chromium (400 e 1280 px, chiaro e scuro, zero errori in console salvo la richiesta del favicon):
- esame `ente` completo (30 risposte, 26 giuste: Superata 26/30, soglia 25, revisione di 4 sbagliate), `onComplete` con `format: 'ente'`, 30 log di domanda; `sim_started`/`sim_done` tracciati;
- seconda simulazione senza Pass (`sims=1`): `onNeedPass('simulazione')`; TENG senza Pass: `onNeedPass('teng')`;
- TENG con Pass: senza quinte opzioni nel banco "In arrivo" (nessun errore); con `tengfinto=1` 5 opzioni, 22 giuste + 8 sbagliate = 22/30 non superata, punteggio con penalità 20;
- scadenza del tempo (orologio finto): consegna automatica a 15:00; errore di consegna e riprova (una sola `onComplete`); errore all'avvio e riprova; dialogo di uscita;
- ripasso smart senza Pass: 10 domande tutte dentro il nucleo (100 su 616), errore e retry, richiamo attivo, errori di caricamento e di `grade`;
- menu con lucchetti (`errori`, `domande` x2), statistiche gratuite e complete (`statistiche`).

Non provato: `ApiProvider` e Worker reali, `onOpenTheory` con un `theoryId` vero (il `LocalProvider` non lo restituisce ancora), 400 px con tema scuro per ogni schermata (solo statistiche ed esito TENG).

## Cosa non mi convince

- **Richiamo attivo**: prima le parole da toccare venivano dalla risposta esatta, che ora non si conosce prima di rispondere. Ora il mazzo contiene le parole di tutte le opzioni (ognuna quanto basta per una sola opzione), quindi è più difficile. La frase costruita deve coincidere con un'opzione.
- `grade(id, -1)` significa "nessuna risposta" (tempo scaduto, frase che non corrisponde, e in StatsMode per leggere la risposta esatta delle 5 domande più sbagliate, solo con il Pass). Va bene col `LocalProvider`; il Worker dovrebbe accettarlo e non contarlo come tentativo.
- `ExamHistory.score` resta il numero di risposte esatte (serve a stats e tracker); il punteggio con penalità si vede solo nell'esito, non è salvato.
- Una domanda con `correctIndex` rimescolato dal server tra `getQuestions` e `grade` romperebbe `LearnMode`: assumo che l'ordine delle opzioni sia stabile (lo è nel `LocalProvider`).
- Nei dati c'è un'opzione con refuso ("dcn't like") nella domanda "I ...... English Food": è contenuto, per chi cura le domande.

## Richieste ad altri

- **A (App)**: passare `onNeedPass` a `ExamMode`, `LearnMode`, `PracticeMenu`, `StatsMode` (obbligatoria) e a `CheatSheet` (facoltativa); `onOpenTheory` a `ExamMode` e `LearnMode` quando c'è la vista teoria; PracticeMenu ora usa `useAccess()`. Non emettere di nuovo `sim_started`/`sim_done`: li traccia già `ExamMode`. `handleExamComplete` in App cerca ancora le domande in `questions` per la qualità SM-2: con il banco servito dal Worker non le troverà (la funzione ora accetta il `QuizLike` anche senza `correctIndex`, ma serve un ripiego). Avvolgere l'app in `<MotionConfig reducedMotion="user">` per le animazioni di `motion`.
- **Contratti**: nessuna modifica richiesta a `lib/exam.ts` e `access/*`. Se il Worker serve già le opzioni rimescolate in `startExam`, va bene così; per `getQuestions` ordine stabile.
- **Layout**: a 1280 px con altezza 800 la barra di navigazione in fondo alla simulazione esce di poco dal riquadro (`h-[100dvh]` più `sm:p-6`): è di `Layout`, non l'ho toccato.
- Il server di sviluppo per la prova era sulla porta 3104 perché la 3103 era occupata da un altro agente.
