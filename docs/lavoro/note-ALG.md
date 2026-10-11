# Note ALG: casi critici dell'algoritmo

Percorsi toccati: `app/src/lib/{diagnostic,spacedRepetition,storage,utils,exam,guarantee}.ts`, `app/src/components/home/stima.ts`, `app/src/access/localProvider.ts`, `pass/src/questions.ts`, `pass/tests/smoke.mjs`, nuovi `app/tests/unit/**`, `package.json` (radice e `app/`).
Prova: `npm test` dalla radice (90 test, `node --test` con un loader di 30 righe che usa l'esbuild già presente in `app/`; nessuna dipendenza nuova). `npx tsc --noEmit` in `app/` e `npm run typecheck` in `pass/` puliti. `pass/tests/smoke.mjs` provato contro `wrangler dev --local` (17 su 17, con le nuove prove su idx -1 e -2).

## Decisioni

1. **Stima (soglia 25/30)**: modello invariato (beta-binomiale, prior uniforme). Valori verificati: 0/10 = 0,0 %, 5/10 = 2,4 %, 7/10 = 17,6 %, 8/10 = 36,3 %, 9/10 = 61,9 %, 10/10 = 86,8 %; simulazione 25/30 = 52,4 %, 26/30 = 65,6 %, 28/30 = 88,3 %. Monotona in `correct` per ogni totale da 1 a 80 (test). Senza risposte vale la probabilità a priori 6/31 = 19,4 %: chi la mostra deve prima controllare di avere risposte.
2. **Fasce 40/70: restano**, ora esportate (`SOGLIA_MEDIO`, `SOGLIA_ALTO`). Con 25/30 'medio' = sul filo della soglia (9/10, 25-26/30), 'alto' = con margine (10/10, 27/30+), 8/10 è 'basso' (36 %) perché serve l'83 %. Ricalibrare le abbasserebbe a un "alto" che non si guadagna con 10 domande. Il disagio di note-HOME ("un utente medio vedrà spesso bassa") è un problema di testo, non di soglia: la stima su 10 domande è larga (80 %: da meno di 1 a 91 % per 8/10), quindi mostrare anche `formatPunteggio` ("tra 18 e 27 su 30").
3. **Omesse in simulazione**: per la STIMA contano come errori (al test vero valgono zero; una simulazione scaduta con 10 risposte su 30 stima davvero un risultato basso). Per la CONOSCENZA non sono errori: `calcolaFattori` e le percentuali per area usano solo giuste/sbagliate; in SM-2 qualità 2 (`QUALITY_OMITTED`): la domanda torna domani come un errore ma toglie metà facilità (-0,32 invece di -0,80). Una simulazione senza nessuna risposta data non entra nella stima.
4. **Stima, finestra**: entrano le ultime 3 simulazioni per data; il diagnostico esce quando ce ne sono 2 o più (10 domande vecchie e imprecise). Chi migliora non resta ancorato ai primi risultati (prima: 10, 12, 27, 28, 28 su 30 = 105/150 davano il 9 %; ora le ultime tre, 83/90, danno il 93 %).
5. **"Imparata"** = `isLearned(stat)`: `box >= 2` (due risposte esatte di fila). Per rendere vero il "a distanza", `applySm2` non fa avanzare le ripetizioni se la risposta esatta arriva meno di 12 ore dopo l'ultima (serve passare `lastSeen`; `updateStats` lo fa già). Una sola esatta = `isInProgress` (box 1, "in corso"). Nota: il caso "sbagliata e rifatta giusta nella stessa sessione" in LearnMode NON dava già box 1 (la riprova ha qualità < 3); il difetto reale era la singola risposta fortunata e le due risposte nello stesso giorno.
6. **grade(-1)**: `idx = -1` = nessuna risposta. Worker e LocalProvider restituiscono `correct:false`, `correctIndex`, spiegazione, `theoryId`; nessun tentativo contato (il server non ne conta). `idx < -1`, non intero o oltre le opzioni = 400 / `Error('Opzione inesistente.')`. Per una domanda a pagamento senza Pass resta 403 anche con -1 (non regala la soluzione).

## Bug trovati e corretti (con esempio)

- `updateStats(…, NaN)` metteva `speedFactor = NaN` per sempre (poi ogni tempo atteso era NaN). Ora i tempi non validi (NaN, ≤ 0, > 60 s) non toccano la velocità.
- Tempo negativo = qualità 5 (premiato); scheda in background (1 h) = 3,0. Ora entrambi valgono rapporto neutro (4,38).
- Facilità e intervallo senza tetto: 100 risposte perfette = easiness 12,5, intervallo 2,2e83 giorni. Ora easiness 1,3-3,5 e intervallo massimo 90 giorni.
- Doppia penalità: errore (easiness 2,5 → 1,70) e riprova esatta nella stessa sessione (→ 1,43). Ora la riprova (`attempts > 1`) non cambia lo stato, e non conta due volte in `dailyActivity`.
- Con 20 domande scadute e 80 nuove la sessione da 10 prendeva 10 nuove e 0 scadute (le nuove avevano priorità 1000+). Ora quota riservata: 7 scadute + 3 nuove; solo scadute se non ci sono nuove, poi non scadute vicine alla scadenza e difficili. Data nel futuro = "vista adesso".
- Stima: la percentuale salvata dal diagnostico (soglia vecchia, 8/10 = 46 %) vinceva sui conteggi: ora si ricalcola da esatte/totali. Con la sola percentuale (salvataggio vecchio) il diagnostico valeva "0 su 10" nel calcolo combinato (0,36 + simulazione 25/30 dava 3,6 % invece del 51 %). Simulazioni duplicate (stesso id) e domande ripetute nei log contavano doppio. TENG senza log: `Math.round(score)` con la penalità sottostimava le esatte.
- `loadState` su `{}`, `null`, `[]` o JSON di versioni vecchie restituiva `history`/`stats` undefined (crash nelle schermate); restituiva anche lo stesso oggetto condiviso (mutabile). Ora `normalizeState`, usata anche da `importData` e da `syncFromCloud`; `syncFromCloud` non muta più lo stato locale.
- `toCloudState` lasciava campi `undefined` (`lastTrajectory`, `onboarding.diagnosticCorrect`, `projectLink`): Firestore li rifiuta e il salvataggio nel cloud falliva in silenzio. Ora passa da JSON.
- `updateStreak`: serie `NaN` o 0 con data di oggi restavano così. Ora almeno 1 se si è attivi oggi.
- Diagnostico: il completamento (quando mancano domande) non controllava le somiglianze; rifatto subito dopo ripeteva in media 0,9 domande uguali (ora 0 con memoria in `localStorage`, ripiego in memoria). `calculateSimilarity` di due frasi fatte solo di parole comuni valeva 0 anche se identiche; `selectExamQuestions` poteva mettere lo stesso id due volte.
- `lib/guarantee.ts` (spenta): contava il TENG con la soglia 25 sul punteggio con penalità. Ora solo il formato "ente".
- Giorno UTC contro giorno locale: tra mezzanotte e le 2 (ora italiana) l'attività finiva nel giorno prima, e la lettera del grafico non corrispondeva. `updateStats` e `ultimiGiorni` ora usano `chiaveGiorno()` (locale); vedi richieste.

## Funzioni nuove e punti d'uso

| Funzione | File | Da usare in |
|---|---|---|
| `formatProbabilita(p)` → `'<1 %'`, `'36 %'`, `'>99 %'` | `lib/diagnostic.ts` | `components/home/Indicatore.tsx:45` (`{Math.round(mostrato)}%`) e `:27` (aria-label); `brand/componenti.tsx:292` e `:282` (Misuratore); `Onboarding.tsx:112`, `:305`, `:329`; `CalcoloRisultato.tsx:42,57`; `home/Stima.tsx:69,100`; `FoglioStima.tsx:55` (esempio 7/8/9). Per i componenti che vogliono un numero: `percentualeVisibile(p)` (1-99). Durante l'animazione di conteggio mostrare il numero, e alla fine `formatProbabilita`. |
| `intervalloStima(correct, total)`, `formatIntervallo`, `formatPunteggio` | `lib/diagnostic.ts` | Onboarding (schermata risultato) e `home/Stima.tsx`: `Stima.intervallo` c'è già. Es. `Probabilità circa 36 %, ${formatPunteggio(i)}` → "tra 18 e 27 su 30". |
| `isLearned(stat)`, `isInProgress(stat)`, `countLearned(stats, ids)` | `lib/spacedRepetition.ts` | sostituire `box > 0` in: `LearnMode.tsx:60`, `StatsMode.tsx:51`, `:158`, `:179`, `Menu.tsx:75`, `App.tsx:410` (punteggio NOI). Es. `countLearned(appState.stats, activeMeta.map(q => q.id))`. |
| `qualityForResult(result, question?, log?, speed?)` | `lib/spacedRepetition.ts` | `App.tsx:289-300` (handleExamComplete) |
| `chiaveGiorno(d?)` | `lib/utils.ts` | giorno locale al posto di `toISOString().split('T')[0]`: `App.tsx:209`, `:321`; `StatsMode.tsx:138`, `:202`; `ActivityChart.tsx:20` |
| `normalizeState(raw)` | `lib/storage.ts` | già usata da `loadState`/`importData`/`syncFromCloud` |
| `SOGLIA_MEDIO/ALTO`, `Stima.intervallo`, `EsitoSim.date` | `home/stima.ts` | facoltativi |

## Richieste ad altri (codice esatto)

1. **App.tsx, handleExamComplete (righe 283-302)**: sostituire il calcolo della qualità e passare `lastSeen` (evita che una simulazione fatta subito dopo una sessione faccia avanzare il box):
```ts
const quality = qualityForResult(result, question, log, speed);   // import da './lib/spacedRepetition'
const sm2 = applySm2({ repetitions: currentQ.box, interval: currentQ.interval, easiness: currentQ.easiness, lastSeen: currentQ.lastSeen }, quality);
```
   (`question` può essere `undefined`: ora va bene. Togliere `calculateContinuousQuality`/`calculateExpectedResponseTimeMs` dagli import.)
2. **App.tsx:269-273 (bug di mutazione)**: `mergedCategoryStats = { ...prev.examCategoryStats }` è una copia superficiale e `+=` modifica gli oggetti di `prev` (in StrictMode il conteggio raddoppia). Sostituire con
```ts
const mergedCategoryStats = Object.fromEntries(Object.entries(prev.examCategoryStats || {}).map(([k, v]) => [k, { ...v }]));
```
3. **LearnMode.tsx:282/291**: passare l'omissione, `updateStats(..., telemetry, quiz, isTimeout && (chosen === null || chosen < 0))` (9° parametro `omessa`), così un tempo scaduto conta in `omitted` e non in `incorrect`.
4. **Onboarding.tsx:112-122**: salvare `passProbability: estimatePassProbability(correct, quiz.length)` senza arrotondare a centesimi, e mostrare con `formatProbabilita`. Non cambia `calcolaStima` (usa già i conteggi). Per un diagnostico rifatto, non serve altro: `pickDiagnosticQuestions()` ricorda l'ultimo da solo.
5. **FineSessione.tsx:99-101**: il testo "conta come imparata quando l'hai risposta bene e il ripasso la rimanda a più avanti" va cambiato in "quando l'hai risposta bene in due giorni diversi" (nuova regola); eventualmente mostrare anche `isInProgress` come "in corso". Con la regola nuova il numero "dopo" a fine prima sessione resta spesso uguale: il testo `differenza === 0` (riga 101) è già adatto.
6. **Home/Stima.tsx**: dopo 2 simulazioni `stima.fonte` è `'simulazioni'` anche se esiste il diagnostico (esce dal calcolo); `delta` resta definito rispetto al solo diagnostico. Testo di `fonteTesto` già corretto.

## Cosa non convince / non fatto

- Il modello assume che le domande del diagnostico e del test abbiano la stessa difficoltà e che l'accuratezza sia costante: non verificabile senza dati reali (le soglie 25/30 e la composizione del test LinguaViva non sono pubbliche). Con 10 domande l'intervallo all'80 % per la probabilità è sempre larghissimo: meglio comunicare il punteggio atteso.
- Le simulazioni TENG (5 opzioni, accuratezza di per sé più bassa) entrano nella stima per il test a 25/30 come le altre: è prudente, non è calibrato.
- Una domanda imparata resta tale anche dopo mesi di non ripasso (nessun decadimento): se serve, `isLearned` può guardare anche `lastSeen + interval`.
- `Math.random()` nella scelta (scadute e nuove) non è sotto test di distribuzione, solo di quote e proprietà.
- `lib/audio.ts`, `lib/firebase.ts`, `lib/atlas.ts`: non letti a fondo (nessuna logica di algoritmo).
