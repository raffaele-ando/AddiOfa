# NOTE dell'agente G0 (pipeline dei contenuti)

## Cosa c'è

- `domande/q001-q100.json` ... `q601-q636.json`: 636 domande convertite dal vecchio `questions.ts` (che prima era a mano). Campi: `id, prompt, options, correctIndex, explanation, category, level, grammarTopic, core, extraOption?, stato`.
  - **Gli id restano `q1`, `q2`, ... (senza zeri)**: sono gli stessi che l'app salva nei progressi degli utenti. I nomi dei file hanno gli zeri. Nelle chiavi di `spiegazioni/` il generatore accetta anche `q001`, ma si scrive `q1`.
  - `stato`: `originale` (544), `da-riscrivere` (72: q1-q60 e q607-q636 non duplicate), `riscritta` / `rivista` (li imposta chi lavora sui contenuti), `duplicata-di:qN` (20).
- `domande/da-rivedere.json`: le 32 coppie con somiglianza >= 0,6, con le due frasi, le opzioni, la risposta esatta e l'esito (`duplicata-di:qN` oppure `distinta` con la motivazione).
- `spiegazioni/*.json`: 7 file vuoti (`{}`), uno per blocco. Chi scrive una spiegazione in italiano la mette qui; se manca, il generatore usa `explanation` della domanda.
- `teoria/argomenti.json`: 31 argomenti (`id` slug, `titolo`, `livello`, `grammarTopic`, `inCheatSheet`, `voceCheatSheet`, `domande`, `nucleo`). `teoria/SCHEMA.md`: formato della scheda. Nessuna scheda scritta ancora.
- `strumenti/`: `genera.mjs`, `valida.mjs`, `trova-duplicati.mjs`, `scegli-nucleo.mjs`, `crea-argomenti.mjs`, `converti-da-ts.mjs` (si usa una volta sola: rifiuta di rifare la conversione se i blocchi esistono; `--forza` perde le modifiche), `lib.mjs`.
- Generati: `app/src/data/questions.ts`, `app/src/data/theory.ts`, `pass/seed.sql`. In `app/src/types.ts` ho aggiunto `Question.theoryId?`.

## Come si lavora (per gli agenti di contenuto)

1. Modificare solo i file in `contenuti/` (un agente per blocco di file, per non sovrascriversi). Una domanda rifatta: aggiornare `prompt/options/correctIndex/...` e mettere `stato: "riscritta"`; una controllata a mano: `"rivista"`. Non cambiare gli id.
2. Spiegazioni in `spiegazioni/qNNN-qMMM.json` (stesso intervallo del blocco di domande). Schede in `teoria/<slug>.json`.
3. `npm run contenuti:valida` (esce con 1 se ci sono errori), poi `npm run contenuti`. Prima della pubblicazione: `node contenuti/strumenti/valida.mjs --finale` (le domande ancora `da-riscrivere` e le schede mancanti diventano errori) e `node contenuti/strumenti/genera.mjs --escludi-da-riscrivere` se la provenienza di q1-q60 e q607-q636 non è chiarita.
4. Se una riscrittura fa risultare simile (>= 0,6) a un'altra domanda, la validazione lo dice: segnare la duplicata con `node contenuti/strumenti/trova-duplicati.mjs --applica` oppure giudicare `distinta` la coppia in `da-rivedere.json`.
5. Per il TENG (5 opzioni) servono `extraOption` sulle domande: oggi **nessuna domanda ce l'ha**, quindi `poolForFormat(..., teng)` è vuoto. È un lavoro di contenuto da fare (un distrattore plausibile e diverso dalle altre 4 opzioni; la validazione controlla che sia diverso).

## Nucleo gratuito (100 domande, `core: true`)

Criteri, applicati da `strumenti/scegli-nucleo.mjs` (deterministico, seme fisso):

- Solo domande con stato `originale` (mai le sospette q1-q60 / q607-q636), mai le duplicate e mai quelle che compaiono in una coppia di `da-rivedere.json`.
- 3 domande per ciascuno dei 31 argomenti (93), più 7 in più sugli argomenti più frequenti e ricchi: Present Simple (+2), Quantifiers, Past Simple, Comparatives, Present Continuous, Past Continuous... (vedi `EXTRA` nello script). Unica eccezione: **Modals of Ability and Permission ha solo 2 domande**, perché ne esistono 2 `originale` su 6 (le altre sono nel blocco sospetto).
- Mix di livelli: A1 33, A2 24, B1 43 (dipende da come è fatto il banco: molti argomenti sono monolivello; negli argomenti misti si prende un livello diverso per domanda). Mix di categorie: 66 Grammatica, 34 Traduzione (circa un terzo di traduzioni per argomento). Nessuna coppia del nucleo con somiglianza > 0,45 (come il filtro di `ExamMode`).
- **Verifica a mano: le ho lette tutte e 100, non un campione**, controllando che la risposta indicata sia l'unica difendibile. Ne ho scartate 15 perché un distrattore è accettabile in inglese: reported speech con il verbo al presente ancora vero (q385, q479, q480, q485), past perfect dove va bene anche il past simple (q496, q497, q498, q505), q397 (might not), q254 e q257 (these/those), q344 (should/have to), q279 (at/on the table), q164 e q174 (presente continuo/semplice). Gli scarti e i motivi stanno in `SCARTATE` nello script. Restano due scelte discutibili ma accettate: q322 ("What are you going to eat" contro "will", c'è il suggerimento tra parentesi) e q396/q553 (must contro might nelle deduzioni forti).
- Per rifare la scelta: `node contenuti/strumenti/scegli-nucleo.mjs --applica` (poi `crea-argomenti.mjs` per aggiornare `nucleo` in `argomenti.json`).

## Duplicati

Funzione: `calculateSimilarity` di `app/src/lib/utils.ts` copiata in `strumenti/lib.mjs` (se cambia di là va cambiata anche lì), soglia 0,6, applicata al testo della domanda e a testo + opzioni (si prende il valore più alto; il solo testo si usa solo se ha almeno 2 parole non vuote). Sul solo testo molte domande sono "Complete the sentence: '...'" e la somiglianza dice poco: per questo si guarda anche alle opzioni.

Risultato: 32 coppie sopra soglia (più delle 13 di `stato_app.md`, che usava un altro criterio): 21 coppie sono doppioni veri, 11 le ho giudicate `distinta` (stessa regola, item diverso: q2/q47, q28/q56, q31/q621, q32/q630, q34/q631, q63/q621, q78/q438, q185/q274, q394/q530, q481/q491, q481/q493). Segnate 20 domande come `duplicata-di:qN` (sempre la seconda; se la prima è a sua volta duplicata si punta alla radice): q53>q39, q500>q387, q576>q539, q607>q39, q608>q17, q609>q47, q610>q22, q611>q56, q613>q55, q614>q20, q618>q25, q622>q43, q623>q3, q624>q42, q625>q37, q626>q41, q627>q32, q633>q30, q634>q19, q636>q29. Sono quasi tutte nel blocco sospetto q607-q636: **un effetto collaterale utile** è che 18 delle 30 domande sospette escono dal banco senza doverle riscrivere. Niente è stato cancellato.

## Cosa sa la validazione

Id unici e senza buchi, id dentro l'intervallo del file, 4 opzioni non vuote e diverse (confronto senza maiuscole: gli apostrofi contano, `dogs` e `dogs'` sono diverse), `extraOption` diversa dalle altre, `correctIndex` valido, nessuna opzione uguale alla risposta esatta, `category` Grammatica/Traduzione, `level` A1/A2/B1, `grammarTopic` tra i 31, `core` booleano e mai su sospette o duplicate, stato valido e `duplicata-di` che punta a una domanda tenuta, spiegazione finale non vuota, refusi (`dcn't`, `raning`, `Saras`), spiegazioni con id esistenti e non doppie, 31 argomenti coperti, coppie sopra soglia non segnate né giudicate `distinta`, schede con i campi giusti e 3 domande esistenti non duplicate (avviso se di un altro argomento). Per le domande `da-riscrivere` i difetti sono avvisi (si riscrivono); con `--finale` diventano errori.

Stato attuale: 0 errori, 7 avvisi (q612 "dcn't", q620 opzione ripetuta e "raning", q629 "Saras", Ability con 2 nel nucleo, 31 schede mancanti).

## Cosa non mi convince

- Le 72 domande `da-riscrivere` sono ancora nel banco generato e quindi nell'app, finché qualcuno non le riscrive o si usa `--escludi-da-riscrivere`.
- Il 95% delle spiegazioni è ancora in inglese e molte sono di poche parole: `explanation_it` nel seed contiene quel testo finché `spiegazioni/` non si riempie.
- Il banco non ha A1 per tutti gli argomenti e il nucleo è sbilanciato su B1 (43%): il diagnostico del brief (3 A1, 2 A2, 5 B1) può comunque pescare dal nucleo.
- q612, q620, q629 (e gli altri sospetti) hanno problemi già noti da `stato_app.md`: li tratta chi riscrive.
- Il confronto di somiglianza in `valida.mjs` è O(n^2) ma ci mette un secondo circa a 636 domande.

## Richieste ad altri

- `app/src/data/bank.ts` ha `isCore(index)` "interim" basato su `FREE_LIMITS.coreQuestions`: ora può usare `isCoreId(q.id)` esportato da `questions.ts` (oppure `getQuestionsByCorpus('initial')`) e togliere l'indice. Il nucleo non è più "le prime 100".
- Chi scrive `Theory.tsx`: `theory.ts` esporta `theoryTopics: TheoryTopic[]` (tutti i 31 argomenti, con `pronta: false` finché non c'è la scheda) e `getTheoryTopic(id)`. `Question.theoryId` è lo slug dell'argomento, presente solo quando la scheda esiste.
- Il TENG ha bisogno delle `extraOption` (vedi sopra): serve un agente di contenuto.
- `pass/seed.sql` va eseguito dopo `migrations/0001_init.sql` (`wrangler d1 execute <db> --file=pass/seed.sql`); è idempotente (INSERT OR REPLACE) e l'ho provato con SQLite sui dati reali (616 righe, 100 core, stessi valori di `questions.ts`).
