# Report completo: OFA Polimi Prep (OfaEnglish)

> Analisi di tutto il repository `raffaele-ando/OfaEnglish`: contenuti didattici, qualità delle domande, confronto con il test OFA reale, **funzionamento completo dell'app** (schermate, algoritmo con esempi numerici reali, metriche, feedback, sincronizzazione, evoluzione del progetto) e stato tecnico del codice.
> Data dell'analisi: 25 settembre 2026. Ultimo commit analizzato: `0a7163d` (9 settembre 2026).

---

## 0. In breve

| | |
|---|---|
| **Cos'è** | Una web app (PWA, React 19 + Vite + Firebase) per allenarsi all'**OFA di Inglese del Politecnico di Milano**, con un'interfaccia in stile Duolingo |
| **Database** | **606 domande** a scelta multipla con 4 opzioni: 375 di grammatica e 231 di traduzione dall'italiano all'inglese, su 31 argomenti grammaticali, livelli CEFR **A1 → B1** |
| **Simulatore** | 30 domande in 15 minuti, soglia **25/30**. Il test reale chiede **24/30**, quindi il simulatore è volutamente un po' più severo |
| **Correttezza** | **Nessuna risposta segnata come corretta è sbagliata** su 606. Ci sono 82 segnalazioni minori su 79 domande (13%), quasi tutte distrattori "troppo corretti" o metadati imprecisi |
| **Motore di studio** | Ripetizione dilazionata SM-2 con voto continuo (0–5) calcolato da tempo di risposta rispetto a un tempo atteso personale, cambi di opzione, esitazione e sicurezza dichiarata; 6 modalità di pratica. Esempi reali al §6.4–6.7 |
| **Gamification** | Basata su **quanto sai**: Imparate %, accuratezza, radar per argomento, confidenza con tendenza, pass rate. Feedback che **cresce con la serie della sessione** (tono dei suoni che sale, coriandoli sempre più grandi). XP, livelli e serie di giorni sono residui (§6.8) |
| **Filosofia** | Tutto è **dinamico** (tempo atteso, voto, intervalli e confidenza si adattano a te) e si **comincia con poco** (Primo Corpus da 60, sessioni da 10, un tocco per iniziare): §6.12–6.13 |
| **Stato tecnico** | Typecheck e build **passano**. Ci sono alcuni problemi pratici (lockfile non allineato, file di lavoro rimasti in root, limite di 1 MB del documento Firestore) |
| **Perché ha funzionato** | Il banco copre in modo sistematico il sillabo A1–B1 che l'OFA misura e allena proprio le trappole tipiche di chi parla italiano. In più il simulatore è più difficile dell'esame vero |

---

## 1. Il sito: identità e storia

- **Nome**: *OFA Polimi Prep* (`metadata.json`, `manifest.json`). È nato come applet di **Google AI Studio**: lo si capisce dal nome del pacchetto `react-example`, da `.env.example` con `GEMINI_API_KEY` e dai commenti su `DISABLE_HMR` in `vite.config.ts`.
- **Stack**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, `motion` per le animazioni, `recharts` per i grafici, `lucide-react` per le icone, `canvas-confetti`, Firebase Auth (Google) e Firestore.
- **Storia**: 39 commit su 10 giorni di lavoro, dal 23 luglio al 9 settembre 2026, tutti di `raffaele-ando`. Il database di domande è cresciuto a tappe:

| Data | Commit | Domande |
|---|---|---|
| 23/07 | `b7740f2` progetto iniziale | 50 |
| 25/07 | `6a061a9` | 56 |
| 27/07 | `b21f33f` / `ccb753e` | 116 → 216 |
| 24/08 | `792dbe1` | 378 |
| 30/08 | `f314d3c` | **606** |
| 09/09 | `0a7163d` selezione del corpus ("Primo Corpus" = prime 60) | 606 |

Il codice sorgente vero e proprio sta in `src/`: 9 componenti più `App.tsx`, 5 moduli in `lib/`, un hook e `data/questions.ts`, che da solo occupa 9.103 righe.

---

## 2. Il test OFA reale e il simulatore dell'app a confronto

| Aspetto | **Test reale** (sezione Inglese del TOL Polimi) | **Simulatore dell'app** (`ExamMode.tsx`) |
|---|---|---|
| Numero di domande | 30 a scelta multipla | 30 a scelta multipla ✅ |
| Tempo | 15 minuti | 15 minuti ✅ |
| Soglia per evitare l'OFA | **almeno 24 risposte esatte su 30** | **25/30**, cioè un punto in più ✅ (margine di sicurezza) |
| Punteggio | +1 per risposta esatta, **−0,25 per risposta errata**, 0 per risposta omessa (vale per la graduatoria) | +1 per risposta esatta, nessuna penalità ⚠️ |
| Feedback | nessuno durante la prova | nessuno durante la prova ✅ |
| Navigazione | libera tra le domande | libera, avanti e indietro ✅ |
| Peso sul TOL | 1/3 | — |

**Cosa significa in pratica.** La soglia dell'OFA conta le risposte *esatte*, non il punteggio netto. Rispondere a caso quindi non abbassa il numero di risposte esatte. Anche per la graduatoria il valore atteso di una risposta tirata a caso su 4 opzioni resta leggermente positivo: 0,25 − 0,75 × 0,25 = +0,06. Il simulatore ignora la penalità, ma per l'OFA non cambia niente. Il suo vantaggio vero è la soglia a 25: se superi 25/30 nell'app, hai un punto di margine sul test reale.

**Nota per il 2026/27**: gli OFA sono stati aboliti per tutte le materie tranne l'Inglese. Quello di Inglese si recupera entro il primo anno, con una certificazione accettata dall'Ateneo, con un test presso enti convenzionati o con corsi di 40 ore.
Fonti: [Futura – Bando Polimi 2026/27](https://futura.study/blog/ingegneria/bando-ammissione-ingegneria-polimi-2026-27-tolc-i/), [Supermat – OFA Polimi 2026](https://supermat.it/test-ingegneria/ofa-polimi/).

---

## 3. Il database delle domande in numeri

### 3.1 Composizione

| Dimensione | Valori |
|---|---|
| Totale | **606** domande, ID da `q1` a `q606` senza buchi né duplicati, tutte con 4 opzioni |
| Categoria | **Grammatica 375 (62%)**, **Traduzione 231 (38%)** |
| Livello CEFR | **B1 286 (47%)**, A1 182 (30%), A2 138 (23%) |
| Formato del prompt | 361 completamenti ("Complete: '…_____…'"), 232 traduzioni ("Translate '…'"), 9 "scegli la frase corretta", 4 altri |
| Spiegazioni | presenti in tutte le domande, in media 48 caratteri (da 7 in su), quindi molto sintetiche |

| | A1 | A2 | B1 |
|---|---|---|---|
| Grammatica | 93 | 78 | 204 |
| Traduzione | 89 | 60 | 82 |

### 3.2 I 31 argomenti grammaticali

| # | Argomento | Domande | Livello prevalente | Nel "Primo Corpus" (60) |
|---|---|---|---|---|
| 1 | Gerunds vs Infinitives | 30 | B1 | 0 |
| 2 | Present Simple | 28 | A1 | 6 |
| 3 | Quantifiers (some/any/much/many…) | 27 | A1 | 2 |
| 4 | Relative Clauses | 25 | B1 | 1 |
| 5 | Question Tags | 25 | B1 | 0 |
| 6 | Comparatives and Superlatives | 23 | A2 | 4 |
| 7 | First Conditional | 23 | B1 | 1 |
| 8 | Modals of Obligation and Advice | 22 | A2 | 0 |
| 9 | Used to | 22 | B1 | 0 |
| 10 | Present Continuous | 21 | A2 | 4 |
| 11 | Object Pronouns | 20 | A1 | 2 |
| 12 | Past Simple | 19 | A2 | **12** |
| 13 | Modals of Deduction | 19 | B1 | 1 |
| 14 | Past Continuous | 19 | A2 | 1 |
| 15 | Adverbs of Manner | 19 | A2 | 1 |
| 16 | Present Perfect | 18 | B1 | **15** |
| 17 | There is / There are | 18 | A1 | 4 |
| 18 | Questions and Origins | 18 | A1 | 1 |
| 19 | Possessive S | 18 | A1 | 1 |
| 20 | Possessives | 18 | A1 | 0 |
| 21 | Demonstratives | 18 | A1 | 0 |
| 22 | Prepositions of Place | 18 | A1 | 0 |
| 23 | Imperative | 18 | A1 | 0 |
| 24 | Future: going to | 18 | A2 | 0 |
| 25 | Second Conditional | 18 | B1 | 0 |
| 26 | Third Conditional | 18 | B1 | 0 |
| 27 | Passive Voice | 18 | B1 | 0 |
| 28 | Reported Speech | 18 | B1 | 0 |
| 29 | Past Perfect | 18 | B1 | 0 |
| 30 | Prepositions of Time | 9 | B1 | 1 |
| 31 | Modals of Ability and Permission | 3 | B1 | 3 |

**Come è costruito il file.** Le prime 60 domande sono il nucleo originale di 50 (primo commit) più le prime 10 aggiunte (25 e 27 luglio). Da `q61` a circa `q216` c'è una prima espansione sugli stessi temi. Da `q217` in poi ogni argomento ha il suo blocco di circa 18 domande (9 di grammatica e 9 di traduzione), in ordine di sillabo A1 → A2 → B1. La parte finale (`q559`–`q606`) aggiunge approfondimenti B1 con spiegazioni più lunghe e glosse in italiano.

### 3.3 Il "Primo Corpus" (le prime 60 domande)

Comprende il banco con cui è partita l'app (50 domande) più le prime aggiunte, e l'app permette di allenarsi solo su quello. Il profilo è molto netto:

- **Present Perfect (15) e Past Simple (12) da soli fanno il 45%.** È il contrasto *"Sei mai stato…?" / "Sono stato in Africa nel 2009"* che mette in difficoltà l'italiano, perché il passato prossimo si traduce a volte in un modo e a volte nell'altro.
- Poi vengono Present Simple (6), There is/are (4), comparativi (4), Present Continuous (4) e modali di abilità e permesso (3).
- Livello: B1 27, A2 26, A1 7. È **più difficile** della media del banco.
- Categoria: 43 di grammatica e 17 di traduzione.

Se il nucleo ricalca le domande dell'esame vero, come fa pensare il nome, il messaggio è chiaro: **i tempi verbali, soprattutto la coppia Present Perfect / Past Simple, sono il cuore dell'OFA.**

---

## 4. Perché studiare solo da qui è bastato

1. **Copre per intero il sillabo che l'OFA misura.** I 31 argomenti sono in pratica l'indice di un libro di grammatica A1–B1 (tipo *English File* o *Murphy Essential/Intermediate*). Nessun argomento importante per un test di questo livello resta fuori.
2. **I distrattori sono costruiti sugli errori tipici di chi parla italiano.** Ogni distrattore è un calco dall'italiano. Qualche esempio contato nel database (sempre come opzione sbagliata, mai come risposta giusta):

| Trappola (interferenza dall'italiano) | Occorrenze come distrattore |
|---|---|
| *If I **would/will**…* nella frase con "if" | 16 |
| *Do I **can**…* / *can **to*** / *must **to*** / *musts* | 7 |
| *-ly* forzato: *fastly, goodly* | 7 |
| *didn't **used** to* | 6 |
| *since/from ten years* (al posto di *for*) | 5 |
| *said **me*** / *told **to** me* | 5 |
| *peoples, informations, furnitures, advices* | 5 |
| *more easy / baddest / more bigger* | 4 |
| *enjoy **to**, avoid **to**, finish **to*** | 4 |
| *did you **met** / didn't **went*** | 3 |
| ***Are** you ever been…*, *I **am** born* | 3 |
| *the book **who*** / *the man **which*** | 3 |

3. **Le traduzioni sono il 38% del banco.** Obbligano a passare dall'italiano all'inglese, che è proprio il passaggio dove nascono gli errori.
4. **Il simulatore è più severo del vero**: soglia a 25 contro 24, stesso tempo, nessun feedback.
5. **Il motore di studio segue principi solidi** (§6): ripetizione dilazionata SM-2, *active recall* (la modalità che nasconde le opzioni), *interleaving* (la modalità "Smart" mescola gli argomenti) e un voto di sicurezza (*Indovino / Incerto / Sicuro*) che abbassa il voto delle risposte incerte o tirate a caso (con un limite: un "Indovino" giusto e veloce vale 3,0 e conta ancora come imparata, §7).
6. **L'ordine delle opzioni viene rimescolato a ogni domanda** (`shuffleQuestion`, algoritmo Fisher-Yates). Nel file sorgente la risposta giusta è la **A nell'89% dei casi** (542 su 606), ma grazie al rimescolamento nell'app non si può imparare "la posizione": bisogna imparare davvero la regola.

### 4.1 Le regole da ricordare (ricavate dal banco)

| Argomento | Regola chiave | Trappola tipica |
|---|---|---|
| Present Perfect / Past Simple | Esperienza senza data → *Have you ever been…?*; data o momento concluso (*in 2009, yesterday, last week*) → Past Simple | *I have been to Africa in 2009* ❌ |
| for / since | *for* + durata (*for ten years*), *since* + punto d'inizio (*since 2015*), sempre con il Present Perfect | *I live here since ten years* ❌ |
| Past Simple | Dopo *did/didn't* va la forma base | *Did you met…?* ❌ |
| Present Simple | 3ª persona singolare con **-s**; negativa e domanda con *does* + forma base | *She don't like* / *Does he works* ❌ |
| Present Continuous | Azione in corso adesso; mai con verbi di stato (*think* come opinione, *know*, *like*) | *I am knowing* ❌ |
| There is / are | *Is there a…?* (singolare), *Are there any…?* (plurale) | *There is people* ❌ |
| Quantifiers | *much* con i non numerabili, *many* con i numerabili; *some* nelle affermative e nelle offerte, *any* nelle negative e nelle domande | *many informations* ❌ |
| Comparativi | *-er than* per gli aggettivi corti, *more … than* per quelli lunghi; irregolari *good/better/best*, *bad/worse/worst* | *more easy*, *baddest* ❌ |
| Avverbi | *well* (non *goodly*), *fast* e *hard* invariati (*hardly* significa "a malapena") | *He drives fastly* ❌ |
| Modali | *must/have to* + forma base, niente *to* dopo i modali, *mustn't* = divieto, *don't have to* = non serve | *You must to go* ❌ |
| Deduzione | *must be* = sono sicuro che sì, *can't be* = sono sicuro che no, *might be* = forse | *It mustn't be him* ❌ |
| Going to | Intenzione o previsione basata su un'evidenza (*Look out! He's going to fall*) | — |
| First Conditional | *If* + present, *will* + verbo | *If it will rain* ❌ |
| Second Conditional | *If* + past, *would* + verbo; *If I were you* | *If I would have* ❌ |
| Third Conditional | *If* + had + participio, *would have* + participio | *If I would have known* ❌ |
| Passive | *be* + participio passato (*was built*) | *was build* ❌ |
| Reported speech | Nei test fai il *backshift* (*is → was*, *will → would*); *say* (senza "me"), *tell someone* | *He said me* ❌ |
| Past Perfect | L'azione più vecchia di due azioni passate: *had* + participio | — |
| Used to | *used to* = abitudine passata; *didn't use to*; *be/get used to + -ing* = essere abituato | *didn't used to* ❌ |
| Gerundio / infinito | *enjoy, avoid, finish, mind, can't stand* + **-ing**; *want, decide, hope, plan* + **to**; *stop/remember/try* cambiano significato | *I enjoy to swim* ❌ |
| Relative clauses | *who* per le persone, *which* per le cose, *that* per entrambe; *where* per i luoghi; nelle frasi tra virgole niente *that* | *the book who* ❌ |
| Question tags | Frase positiva → tag negativo e viceversa, stesso ausiliare (*I'm right, aren't I?*) | *She didn't go, didn't she?* ❌ |
| Possessivi | *my/your/his/her* + nome, *mine/yours/hers* da soli; *'s* per le persone (*Mr Smith's wife*) | *the wife of Mr Smith*, *your's* ❌ |
| Preposizioni | *at* + ora, *on* + giorno, *in* + mese/anno; *in/on/at* per i luoghi; *between* (due) e *among* (più di due) | *on 2009* ❌ |

---

## 5. Qualità delle domande

Ho letto tutte le 606 domande (divise in 4 blocchi controllati in parallelo, voce per voce) e ho affiancato controlli automatici.

### 5.1 Risultato

- ✅ **Risposte segnate come corrette sbagliate: 0 su 606.** È il dato più importante: il banco non insegna niente di sbagliato.
- ✅ Nessun ID duplicato, nessun indice fuori intervallo, nessuna opzione ripetuta dentro la stessa domanda.
- ⚠️ **82 segnalazioni su 79 domande (13%)**, tutte di gravità bassa o media:

| Tipo | N. | Cosa significa |
|---|---|---|
| **AMBIGUOUS** | 44 | Un distrattore è anch'esso inglese accettabile: *did* enfatico, present continuous per un programma, *has to* per la deduzione, *older* invece di *elder*, forme britanniche come *I haven't enough money*… |
| **WRONG_METADATA** | 16 | Argomento o livello sbagliato: *as soon as / until / in case* classificati come "Conditional", *news/furniture/police* come "Quantifiers", present simple base segnato B1 |
| **BAD_EXPLANATION** | 9 | Spiegazione confusa o contraddittoria (per esempio q10 contro q24 su *something/anything*) |
| **TYPO** | 7 | *Brasil* (q55), barre rovesciate visibili *That\'s* / *didn\'t* (q392, q395), spiegazioni metà in italiano e metà in inglese |
| **BAD_TRANSLATION** | 6 | La risposta non traduce bene l'italiano (q61 "Ha vissuto qui per dieci anni", q283 "vicino a" reso con *next to*, q515 senza "un pacchetto al giorno") |
| **WRONG_KEY** | **0** | — |

### 5.2 Difetti ricorrenti

1. **Troppa rigidità.** Alcune regole sono presentate come assolute ("always", "only gerund"), mentre l'inglese reale le rende opzionali: il backshift nel discorso indiretto, il past perfect quando la sequenza è già chiara, *can't stand to*, *used not to*. Per il test va bene (si sceglie la forma "da manuale"), ma conviene saperlo.
2. **Deduzioni con indizi deboli** (q553–q555): *must be* viene giustificato da indizi che reggerebbero anche *might*.
3. **Quasi duplicati**: 3 coppie hanno un prompt letteralmente identico (q4/q35, q34/q51, q146/q349) e altre 3 sono identiche a meno di parole comuni (q1/q45, q13/q24, q41/q54), più 2 molto simili (q481/q493, q539/q576). Il simulatore ha un filtro di similarità (soglia 0,45) che evita di proporne due insieme.
4. **Spiegazioni troppo brevi** nella parte centrale ("Advice.", "Prohibition.", "If + Past Simple."). Dicono la regola, ma non perché le altre opzioni sono sbagliate.
5. **Nessun indizio dalla lunghezza.** La risposta giusta è l'opzione più lunga solo nel 18% dei casi e la più corta nel 12% (a caso sarebbe circa il 25%): non si può indovinare guardando la lunghezza.

L'elenco completo, domanda per domanda, è nell'**Appendice A**.

---

## 6. Come funziona l'app, nel dettaglio

Questa è la parte centrale del report: come l'app è costruita e come si comporta davvero, ricavata dalla lettura di tutto il codice in `src/` e verificata eseguendo le funzioni reali dell'algoritmo (i numeri del §6.5 sono output effettivi, non stime).

### 6.1 Architettura in una pagina

```
main.tsx ─ StrictMode ─ ErrorBoundary ─ App.tsx  (unico "cervello": tiene lo stato e decide la schermata)
                                            │
      ┌──────────────┬──────────────┬───────┴──────┬──────────────┬─────────────┐
   Menu.tsx   PracticeMenu.tsx   LearnMode.tsx   ExamMode.tsx   StatsMode.tsx   DebugMode.tsx
                                     │                │
                     lib/spacedRepetition.ts   (scelta delle domande, voto 0–5, SM-2, velocità)
                     lib/utils.ts              (rimescolamento opzioni, similarità tra domande)
                     lib/audio.ts              (suoni, vibrazione, coriandoli)
                     lib/storage.ts            (localStorage, unione con il cloud, streak, export/import)
                     lib/firebase.ts           (login Google, Firestore)
                     data/questions.ts         (606 domande + "Primo Corpus" = prime 60)
```

- **Non c'è un router**: `App.tsx` ha una variabile `view` (`menu`, `practiceMenu`, `learn`, `exam`, `stats`, `debug`) e mostra un componente alla volta.
- **Tutto lo stato vive in un solo oggetto `AppState`**:
  - `stats`: una scheda per domanda;
  - `history`: le simulazioni svolte;
  - `streak` e `lastActiveDate`;
  - `speedStats`: la velocità personale;
  - `examCategoryStats`;
  - `dailyActivity`: domande al giorno;
  - `dailyTimeSpent`: secondi al giorno;
  - `selectedCorpus`: tutto il materiale o solo il Primo Corpus.
- **Ciclo di salvataggio.** Ogni modifica passa da `handleUpdateAppState`, che fa sempre gli stessi passi:
  1. `updateStreak` aggiorna la serie di giorni;
  2. `setAppState` aggiorna lo stato;
  3. `saveState` salva in `localStorage` (chiave `ofa_polimi_app_state`);
  4. `syncToCloud` salva su Firestore, se l'utente ha fatto il login.
- **Cronometro dello studio.** Ogni 10 secondi, *solo se la scheda del browser è visibile*, aggiunge 10 s al tempo di studio del giorno (`dailyTimeSpent`). Sincronizza con il cloud al massimo una volta al minuto.

### 6.2 La scheda di ogni domanda

Per ognuna delle 606 domande l'app tiene (in `stats[id]`):

| Campo | Significato |
|---|---|
| `correct` / `incorrect` / `omitted` | Quante volte è stata giusta, sbagliata o lasciata in bianco. **Conta solo il primo tentativo**: dopo un "Riprova" i contatori non cambiano |
| `lastSeen` | Quando è stata vista l'ultima volta |
| `box` | Quante volte di fila è stata ricordata bene (voto ≥ 3). **0 = da imparare**, > 0 = imparata |
| `easiness` / `previousEasiness` | Facilità SM-2 (parte da 2,5, minimo 1,3) e il valore precedente, per la freccia di tendenza |
| `interval` | Tra quanti giorni riproporla |
| `lastQuality` | Voto 0–5 dell'ultima risposta |
| `lastResponseTimeMs`, `lastFirstClickTimeMs`, `lastSwitchCount`, `lastTrajectory` | Telemetria: tempo totale, tempo al primo clic, quante volte ha cambiato opzione, sequenza delle opzioni toccate |

### 6.3 Il percorso dell'utente, schermata per schermata

**Menu**
1. In alto: titolo e pulsanti per debug, audio on/off e tema. Poi la fiammella con la **serie di giorni** e il login ("Synced come Nome" quando è attivo). Se l'app è aperta dentro un'anteprima compare l'avviso di aprirla in una nuova scheda per fare il login.
2. **Scelta del materiale**: "Tutte le frasi (606)" oppure "Primo Corpus (60)". La scelta viene salvata e vale per tutte le modalità e per la simulazione.
3. Due barre calcolate sul materiale scelto:
   - **Imparate %**: domande con `box > 0` sul totale;
   - **Accuratezza %**: risposte giuste sul totale dei tentativi.
4. Il pulsante grande **"Inizia Sessione"** (sottotitolo "Algoritmo Ottimizzato (606)" oppure "Primo Corpus (60 frasi)") avvia **subito** la modalità Smart, senza altre scelte.
5. Sotto: **Modalità Custom** e **Simulazione Esame**; in fondo **Stats**, **Import** ed **Export**.

**Modalità Custom** (`PracticeMenu`)
- Scelta del materiale (come nel menu), poi quattro schede: **Standard** ("Spaced repetition classica"), **Weakness** ("Focalizzati sugli errori"), **Blitz** ("Timer aggressivo (10s)") e **Active Recall** ("Nasconde le opzioni").
- **Filtro Mirato**: un menu a tendina diviso in *Corpus* (Primo Corpus o tutto il database), *Categorie* (Grammatica, Traduzione), *Livelli* (A1, A2, B1) e *Argomenti grammaticali* (31, oppure 17 se è attivo il Primo Corpus: le liste si costruiscono sul materiale scelto). Poi si preme "INIZIA".

**Sessione di studio** (`LearnMode`), fino a 10 domande (meno se il filtro scelto ne contiene meno, per esempio 3 su "Modals of Ability and Permission")
1. **Scelta**: l'algoritmo (§6.6) sceglie 10 domande dal materiale attivo e **rimescola le opzioni** di ognuna (algoritmo Fisher-Yates).
2. **Schermo**:
   - in alto: X per uscire, barra di avanzamento verde, fiammella "N x" se la serie di risposte giuste è > 1, timer (**30 s**, oppure **10 s** in Blitz), che diventa rosso e lampeggia sotto i 5 s;
   - al centro: l'etichetta "Domanda N" (più "Primo Corpus (60)" se è attivo), il testo e le 4 opzioni A–D.
3. **Risposta in due tempi**: prima tocchi un'opzione (diventa azzurra, e puoi cambiarla: ogni tocco viene registrato), poi confermi con uno dei tre pulsanti **Indovino / Incerto / Sicuro**. La scelta della sicurezza entra nel voto.
4. **Se è giusta**:
   - la barra in basso diventa verde e dice "Ottimo!", oppure "Fantastico! 🔥 N di fila!" dalla terza di fila in poi;
   - compaiono la **categoria (e l'argomento)** e la **spiegazione**;
   - suona un accordo, il telefono vibra e partono i coriandoli: *mini* → *burst* dalla seconda di fila → *cannon* dalla quarta;
   - con il pulsante "Next" si passa alla domanda successiva.
5. **Se è sbagliata**:
   - la barra diventa rossa con "Errata. Riprova!" e un suono discendente;
   - **l'opzione giusta viene evidenziata in verde** e quella scelta in rosso;
   - premendo "Riprova" la domanda torna uguale, con l'opzione sbagliata **disattivata**, e si deve arrivare alla giusta prima di andare avanti;
   - la spiegazione compare solo quando si arriva alla risposta giusta;
   - il primo errore aggiorna subito le statistiche come "sbagliata" (voto 0); il successo al secondo tentativo viene registrato con un voto basso (circa 2,2), quindi la domanda **resta da imparare** e torna presto.
6. **Tempo scaduto**: conta come risposta sbagliata data con "Indovino". Dopo il primo errore il timer si ferma, così il nuovo tentativo non ha fretta.
7. **Fine**: una schermata con "Sessione Completata! Hai risposto a X su N correttamente **al primo tentativo**", fanfara e coriandoli *celebration*.

**Active Recall**
- Le opzioni sono nascoste. Si ricostruisce la frase giusta toccando le parole da una riserva che contiene **le parole della risposta più alcune parole trappola**: al massimo 8 se la risposta ha fino a 3 parole, altrimenti al massimo 5. Le trappole vengono dalle opzioni sbagliate della domanda e, se non bastano, dalle opzioni delle altre domande della sessione; poi l'insieme viene mescolato e tagliato a caso. In caso di errore la risposta giusta non viene mostrata e le parole scelte restano al loro posto dopo "Riprova". Le parole scelte si possono togliere con un tocco.
- **"Mostra Suggerimento"** rivela solo *Argomento: … (Livello)*, mai la risposta.
- **"Troppo difficile? Usa le opzioni multiple"** fa tornare alla scelta tra 4 opzioni.
- La risposta è giusta solo se la sequenza di parole è **identica** a quella attesa.

**Simulazione d'esame** (`ExamMode`)
1. **Scelta delle 30 domande**: le domande del materiale attivo vengono mescolate e scelte una per una, scartando quelle **troppo simili** a una già presa (similarità di Jaccard tra i testi > 0,45, calcolata ignorando parole comuni come "the", "choose", "translate"). Se non se ne trovano 30 abbastanza diverse, si completa con le altre. Anche qui le opzioni sono rimescolate.
2. **Schermata iniziale**: titolo "Mock Exam" e "30 Multiple choice questions · 15 Minutes time limit · 25/30 required to pass · No immediate feedback", con i pulsanti *Start Exam* e *Cancel*.
3. **Durante la prova**:
   - in alto: X, conto alla rovescia *m:ss* e "Submit";
   - sotto: "risposte date/30" con una barra;
   - si può cambiare risposta e muoversi liberamente con le frecce o con la striscia scorrevole delle 30 domande;
   - nessun feedback;
   - per ogni domanda si registrano il tempo speso, ogni clic (opzione, momento, giusta o no), il primo clic e i cambi (il campo "esitazione" qui misura in realtà il tempo tra l'ultimo clic e la consegna dell'intero esame, quindi non è utilizzabile).
4. **Fine** (con "Submit" o a tempo scaduto):
   - "PASSED" o "FAILED", **punteggio/30**, tempo impiegato, fanfara e coriandoli se è superata;
   - poi **"Review Incorrect Answers"**, cioè solo le sbagliate e le omesse, ognuna con *Categoria • Argomento*, "Your Answer" (oppure "No answer"), "Correct" e la spiegazione.
5. **Effetto sulle statistiche**:
   - ogni risposta giusta aumenta `box` di 1;
   - ogni risposta sbagliata azzera `box`;
   - le domande omesse aumentano `omitted`;
   - l'esame viene aggiunto allo storico con il dettaglio completo;
   - l'attività del giorno aumenta di 30;
   - intervallo e facilità SM-2 **non** vengono aggiornati (vedi §7).

**Statistiche** (`StatsMode`)
1. **Quattro riquadri**:
   - **Domande Imparate %**: `box > 0` sul totale di 606;
   - **Accuratezza %**: giuste / (giuste + sbagliate), su tutto lo storico;
   - **Pass Rate %**: simulazioni superate / svolte;
   - **Record**: il punteggio migliore su 30.
2. **"Costanza (Ultimi 7 Giorni)"**: barre giornaliere con **domande** (azzurro) e **minuti** (verde).
3. **"Simulazioni"**: esami completati, esami superati, miglior punteggio.
4. **"Skill Profile"**: un radar con l'**accuratezza per argomento**. Compare solo quando ci sono dati su almeno 3 argomenti (basta anche una domanda omessa in simulazione); prima dice "Rispondi a più domande su diversi argomenti…".
5. **"Progresso per Livello"** e **"Progresso per Argomento"**: barre orizzontali impilate, **Imparate** (verde per livello, azzurro per argomento) contro **Da imparare** (grigio).
6. **"Errori Comuni"**: le 5 domande con il tasso di errore più alto (le omesse contano come errori), con giuste/sbagliate/omesse, % di errore e la risposta giusta in verde. Senza dati: "Non ci sono ancora dati sufficienti."
7. In fondo, ancora visibili: la barra **XP/Livello** e la **"Sfida Quotidiana – Fase N"** (vedi §6.8).
Il pulsante blu **"Vedi Dettaglio Frasi"**, che apre il dettaglio, non sta in fondo: è il primo elemento della colonna destra, sopra lo Skill Profile. La colonna sinistra ha i riquadri, la Costanza e le Simulazioni.

**Dettaglio Frasi**
- **Filtri**: tutte le categorie, solo il Primo Corpus, oppure una singola categoria. **Ordinamento**: "Peggiori prima" (predefinito: le domande mai viste compaiono per prime) o "Migliori prima" in base alla confidenza. Un contatore mostra quante domande restano dopo il filtro.
- **Per ogni domanda**:
  - il testo, con *categoria · livello · argomento*;
  - etichette colorate con giuste, sbagliate e omesse;
  - i **cambi** di risposta e il **tempo** dell'ultima risposta;
  - a destra, l'**Accuratezza %** a semaforo (verde oltre 70%, giallo oltre 40%, altrimenti rosso) e la barra **Confidenza %** con la freccia ↑ ↓ – rispetto all'ultima volta;
  - "Mai vista" se non è ancora stata proposta.

### 6.4 Il tempo atteso: quanto "dovrebbe" metterci

Per ogni domanda l'app calcola quanto ci metterebbe una persona che la sa (`calculateExpectedResponseTimeMs`):

- **Lettura** = il valore più alto tra *parole / 180 al minuto* e *caratteri × 45 ms × 0,7*.
- **+ 1,2 s** per decidere.
- **× fattore di velocità personale**, tra 0,5 e 2,5. Il minimo assoluto è 2,2 s.

Esempi reali: **q1** ("Sei mai stato in Brasile?", 34 parole e 181 caratteri tra domanda e opzioni) → **12,5 s** per un utente con velocità nella media, **18,8 s** per uno con fattore 1,5. La domanda più corta (q429) → 3,9 s; quella con il tempo atteso più alto (q25, 64 parole) → 22,5 s.

**Il fattore di velocità impara da te.** Dopo ogni risposta giusta al primo tentativo, il tempo impiegato (limitato tra 1 e 35 s, così una distrazione non falsa la media) viene confrontato con il tempo nominale della domanda. Il fattore si aggiorna con una media mobile esponenziale:
- con peso α = 1/n per le prime 20 risposte giuste;
- poi con peso fisso 0,05.

In pratica, se sei lento a leggere l'inglese l'app non ti penalizza per sempre: si adatta a te.

### 6.5 Il voto da 0 a 5: esempi reali

Il voto (`calculateContinuousQuality`) mette insieme **velocità relativa**, **comportamento** (cambi di opzione, esitazione) e **sicurezza dichiarata**. Questi sono gli output della funzione vera su q1 (tempo atteso 12,5 s):

| Scenario | Voto | Conta come imparata? |
|---|---|---|
| Giusta, senza cambi, entro il tempo atteso, **Sicuro** | **5,00** | sì |
| Giusta, ma in 1,5 volte il tempo atteso | 4,38 | sì |
| Giusta, ma in 3 volte il tempo atteso | 3,28 | sì, appena |
| Giusta, entro il tempo, ma **Incerto** | 4,40 | sì |
| Giusta, entro il tempo, ma **Indovino** | **3,00** | sì, per un soffio (vedi §7) |
| Giusta dopo 1 cambio, partendo dall'opzione **giusta** (dubbio poi ritorno) | 3,60 (3,55 se in 1,2× il tempo) | sì |
| Giusta dopo 1 cambio, partendo da un'opzione **sbagliata** (per esclusione) | 3,10 (3,06 se in 1,2× il tempo) | sì, appena |
| Giusta entro il tempo, ma con **10 s di esitazione** prima di confermare | 4,79 | sì |
| Giusta solo **al secondo tentativo** (dopo Riprova) | **2,22** | **no**, torna domani |
| Sbagliata o tempo scaduto | **0** | **no** |

Le regole dietro la tabella:
- **Nessun cambio**: voto 5 fino al tempo atteso, poi scende fino a 3,5 a 2,2 volte il tempo atteso e fino a 3 a 4 volte.
- **Con cambi**: il massimo è 3,6 se partivi dall'opzione giusta, 3,1 se partivi da una sbagliata. Ogni cambio in più e la lentezza tolgono ancora qualcosa.
- **Esitazione** oltre 4 s: fino a −0,35.
- **Sicurezza**: Incerto −0,6, Indovino −2.

### 6.6 Il ripasso dilazionato (SM-2): cosa succede nel tempo

**Regola**: con un voto ≥ 3 la domanda "passa". `box` aumenta di 1 e l'intervallo diventa 1 giorno, poi 6, poi intervallo × facilità. Con un voto < 3 si torna a zero (`box` = 0, intervallo 1 giorno). La facilità cambia a ogni risposta con la formula SM-2: +0,1 con voto 5, circa −0,14 con voto 3, −0,8 con voto 0.

Una storia di q1, simulata con la funzione vera (senza il passaggio "Riprova", vedi la nota sotto la tabella):

| Risposta | Voto | `box` | Facilità | Prossimo ripasso |
|---|---|---|---|---|
| Giusta e sicura | 5 | 1 | 2,60 | tra 1 giorno |
| Giusta e sicura | 5 | 2 | 2,70 | tra 6 giorni |
| Giusta e sicura | 5 | 3 | 2,80 | tra 16 giorni |
| Giusta ma Incerto | 4,4 | 4 | 2,84 | tra 45 giorni |
| **Sbagliata** | 0 | **0** | 2,04 | **tra 1 giorno** |
| Giusta e sicura | 5 | 1 | 2,14 | tra 1 giorno |

**Nota — nell'uso reale l'errore pesa di più.** In una sessione, dopo l'errore bisogna rispondere di nuovo (Riprova), e anche quel secondo tentativo aggiorna SM-2 con un voto di circa 2. La sequenza reale diventa: sbagliata → facilità 2,04; Riprova giusto → **1,73**; poi giusta e sicura → **1,83** (non 2,14). Ogni errore fa quindi calare la facilità due volte.

Si vede la logica: **un solo errore azzera il percorso**, e la facilità che resta più bassa fa crescere gli intervalli più lentamente. La domanda "si ricorda" di essere stata difficile.

### 6.7 Come vengono scelte le 10 domande

Per ogni domanda del materiale attivo si calcola un punteggio; si prendono le 10 con il punteggio più alto.

| Modalità | Punteggio |
|---|---|
| **Smart** ("Inizia Sessione") | **Urgenza**: mai vista 800–1000 (con un po' di casualità); in scadenza 500 + 10 per ogni giorno di ritardo; non ancora in scadenza (giorni trascorsi / intervallo) × 100. **+ Debolezza**: tasso di errore × 400 + (5 − facilità) × 40. **+ casuale** tra 0 e 100 |
| **Standard** | Solo urgenza (mai vista 1000–1100) |
| **Weakness** | Tasso di errore × 1000 + (5 − facilità) × 100. Le domande mai viste valgono 0 |
| **Blitz** / **Active Recall** / **Filtro** | Come Standard: cambia l'esperienza (10 s, opzioni nascoste, sottoinsieme), non la scelta |

Cosa succede in pratica con Smart:
- **All'inizio** vince il nuovo: le domande mai viste (800–1000) battono quasi tutto, e il rumore casuale mescola gli argomenti.
- **Man mano** le domande in scadenza (500+) e quelle sbagliate spesso (fino a +400 di debolezza) prendono il sopravvento.
- Le domande sapute bene e non ancora in scadenza hanno punteggi bassi e quasi non ricompaiono. È esattamente il comportamento di un buon sistema di ripasso, con in più **l'interleaving** dato dalla casualità.

### 6.8 Le metriche e la gamification

| Metrica | Formula | Dove si vede | Che cosa misura |
|---|---|---|---|
| **Imparate %** | domande con `box > 0` / totale | Menu (sul materiale scelto), Statistiche (sulle 606) | Quanto sai **adesso**: scende se sbagli |
| **Accuratezza** | giuste / (giuste + sbagliate), solo primi tentativi più le risposte date in simulazione | Menu, Statistiche, Dettaglio (per domanda, a semaforo) | Quanto sei preciso |
| **Skill Profile** | accuratezza per argomento | Radar in Statistiche | Argomenti forti e deboli |
| **Imparate / Da imparare** | conteggio di `box > 0` per livello e per argomento | Barre in Statistiche | Quanto manca, e dove |
| **Confidenza** | (facilità − 1,3) / 1,3 × 100, massimo 100 | Dettaglio, con freccia di tendenza | Quanto una domanda è "facile" per te |
| **Pass Rate / Record** | superate / svolte; punteggio massimo | Statistiche | Quanto sei pronto per l'esame |
| **Costanza** | domande e minuti al giorno | Grafico degli ultimi 7 giorni | Quanto studi (informativo) |
| Serie di giorni | giorni consecutivi in cui l'app è stata aperta (basta aprirla) | Fiammella nel menu | *residuo* |
| XP / Livello | 50 + 10 per ogni risposta giusta; livello = ⌊√(XP/50)⌋ + 1 | In fondo alle Statistiche | *residuo* |
| Sfida quotidiana | traguardi 10 → 25 → 50 → 100 → 150 → … domande | In fondo alle Statistiche | *residuo* |

**La gamification che funziona è quella delle prime sette righe**: sono tutti numeri che si muovono **solo se impari davvero**. Imparate % scende quando sbagli, l'accuratezza conta solo il primo tentativo, il radar mostra senza pietà gli argomenti deboli. Le ultime tre righe sono tentativi più "da videogioco" (XP con bonus iniziale regalato, sfida a fasi, serie di giorni). La storia dei commit mostra che XP e sfida quotidiana sono stati tolti dal menu e spostati in fondo alle statistiche; la serie di giorni è rimasta come numerino nel menu. Con i 50 XP regalati si parte già da "Liv. 2", e la sfida aggiunge ogni giorno 1 passo gratis.

Due dettagli da sapere:
- La **confidenza si satura subito**. Parte da 2,5, cioè 92%, e arriva al 100% già con una risposta perfetta (facilità 2,6). In pratica **segnala soprattutto i cali**.
- **Imparate %** nel menu si calcola sul materiale scelto (per esempio "su 60"), mentre nelle Statistiche è sempre sulle 606.

### 6.9 Il feedback sensoriale

Tutti i suoni sono **sintetizzati al momento** con la Web Audio API: niente file audio, latenza zero. Si possono disattivare (la preferenza è salvata in `localStorage`).

| Evento | Suono | Vibrazione | Coriandoli |
|---|---|---|---|
| Tocco su un pulsante | "pop" 440 → 880 Hz in 40 ms | — | — |
| Risposta giusta | accordo di Do maggiore (Do5–Mi5–Sol5–Do6) più una scintilla acuta; **dalla terza di fila il tono sale** fino a +20% | 15–30–25 ms | *mini* (28 particelle) → *burst* (65) dalla seconda di fila → *cannon* (due cannoni laterali) dalla quarta |
| Risposta sbagliata | due toni discendenti (260 → 180 Hz, 190 → 120 Hz) | 30–40–30 ms | — |
| Fine sessione / esame superato | fanfara | 40–40–60–40–100 ms | *celebration* (120 particelle più due raffiche laterali) |

I colori dei coriandoli sono quelli dell'app: azzurro, verde, giallo, viola, rosso, turchese.

### 6.10 Dati, login e sincronizzazione

- **Locale**: tutto l'`AppState` sta in `localStorage`. **Export** scarica `ofa_polimi_progress.json`; **Import** lo ricarica, controllando solo che `streak` sia un numero.
- **Login**: Google tramite popup, con la sessione che resta attiva anche dopo aver chiuso il browser. Messaggi d'errore dedicati per chi usa Brave o un adblocker e per chi apre l'app dentro un'anteprima.
- **Cloud**: un documento Firestore `users/{uid}`, leggibile e scrivibile solo dal proprietario.
- **Unione tra telefono e computer** al login (`syncFromCloud`), in 7 regole:
  1. **Storico esami**: unione dei due storici, senza duplicati (la chiave è la data), ordinata nel tempo.
  2. **Statistiche per categoria degli esami**: ricalcolate da zero dallo storico unito.
  3. **Schede delle domande**: per ogni domanda vince la versione con `lastSeen` più recente.
  4. **Velocità personale**: vince la versione con più risposte.
  5. **Serie di giorni**: vince quella con l'attività più recente; a parità di data si tiene la più alta.
  6. **Attività giornaliera**: per ogni giorno si tiene il valore più alto.
  7. **Tempo di studio**: per ogni giorno si tiene il valore più alto.
- Dopo l'unione, ogni modifica viene salvata subito sia in locale sia sul cloud.

### 6.11 Comportamenti meno visibili (da sapere)

- **La simulazione altera la scelta di Smart**: imposta `lastSeen` ma lascia l'intervallo a 0, quindi le domande mai viste che compaiono in un esame perdono la priorità "nuova" (800–1000) e diventano subito "in scadenza" (500+).
- **Toccare di nuovo la stessa opzione conta come un cambio**: una risposta giusta toccata due volte ha un voto massimo di 3,6 invece di 5.
- **Nel Riprova la risposta è già svelata** (la giusta è stata evidenziata in verde) e il cronometro non riparte: il secondo tentativo include tutto il tempo dall'inizio della domanda.
- **Attività gonfiata**: una domanda sbagliata e poi corretta conta 2 nelle domande del giorno; una simulazione ne aggiunge sempre 30.
- **Il "tempo di studio" è il tempo con l'app aperta** su qualsiasi schermata (anche menu e statistiche).
- **Il pulsante muto disattiva anche le vibrazioni** (i coriandoli restano).
- **Simulazione**: il timer diventa rosso negli ultimi 2 minuti; la X esce senza conferma e senza salvare; "Submit" non chiede conferma anche con domande in bianco; con 30/30 compare "Perfect score! Nothing to review."
- **Weakness con pochi dati**: le domande mai viste valgono tutte 0 e la sessione si riempie con le prime del file (q1, q2…).
- **Date miste**: attività e tempo usano giorni UTC, la serie giorni locali; in Italia lo studio tra mezzanotte e le 2 finisce nel giorno prima.
- **Minori**: tema e muto stanno fuori dallo stato (in `localStorage`); Import sostituisce tutto senza unire; "PWA" vuol dire solo `manifest.json` (niente funzionamento offline).

### 6.12 Tutto è dinamico e progressivo

Uno dei tratti più riusciti dell'app è che **quasi nulla è fisso**: ogni numero viene calcolato dai tuoi dati e cambia mentre studi.

| Cosa | Come si adatta |
|---|---|
| Tempo atteso | Calcolato per ogni domanda dalla lunghezza del testo, moltiplicato per la **tua** velocità, che si aggiorna a ogni risposta giusta |
| Voto | Continuo (per esempio 4,38), da tempo, cambi di opzione, esitazione e sicurezza |
| Intervallo di ripasso | Cresce (1 → 6 → 16 → 45 giorni…) o crolla a 1 dopo un errore |
| Facilità e confidenza | Cambiano a ogni risposta; la freccia ↑ ↓ – mostra la tendenza |
| Scelta delle domande | Si riordina a ogni sessione (urgenza + debolezza + casualità) |
| Padronanza, accuratezza, radar | Ricalcolati dopo ogni risposta |
| Feedback | **Cresce con la serie della sessione**: "Ottimo!" → "Fantastico! 🔥 N di fila!"; il tono dell'accordo sale del 4% per ogni risposta dopo la seconda (fino a +20%); coriandoli mini → burst → cannon; si azzera con un errore |
| Interfaccia | Barra di avanzamento animata; timer che diventa rosso e lampeggia negli ultimi 5 s; colori a semaforo |

È una differenza importante rispetto alla gamification "a punti": la serie *dentro la sessione* premia risposte vere nel momento in cui avvengono e dura pochi minuti. La serie *di giorni* (la fiammella nel menu) misura solo la presenza.

### 6.13 Cominciare con poco, per iniziare bene

L'app è costruita perché **i primi passi riescano**:
- **Il Primo Corpus da 60 domande.** È selezionabile dal menu e vale per tutte le modalità, per la simulazione e per le statistiche del menu ("Imparate (su 60)"). Con 60 domande ogni domanda imparata vale l'1,7% e la barra si muove subito; sulle 606 varrebbe lo 0,17%. Cominciare dal nucleo rende visibile il progresso vero fin dal primo giorno.
- **Sessioni da 10**, che si chiudono sempre con una schermata di fine e una celebrazione.
- **Un tocco per iniziare** ("Inizia Sessione"), senza scegliere niente.
- **All'inizio vince il nuovo.** In Smart le domande mai viste hanno la priorità più alta (800–1000), quindi le prime sessioni sono varie. Il ripasso degli errori pesa man mano che ci sono dati.
- **Ogni domanda si chiude con la risposta giusta** (Riprova), mai con un fallimento.
- **Aiuti che non spoilerano**: in Active Recall il suggerimento mostra solo l'argomento, e se è troppo difficile si può passare alle 4 opzioni invece di arrendersi.

### 6.14 Come si è arrivati a questa versione

Leggendo i 39 commit si vede come l'app sia stata raffinata:

| Periodo | Cosa è cambiato | Cosa dice del metodo |
|---|---|---|
| 23/07 | Prima versione: SM-2, sessioni da 10, timer 30/10 s, Indovino/Incerto/Sicuro, Riprova, simulazione 30/15' | L'ossatura c'era da subito |
| 23/07 | Grafico dell'attività; molte modifiche al layout mobile (`100dvh`, spaziature) | Si studia dal telefono |
| 23/07 | Sistema **XP e livelli** con "endowed progress" (50 XP regalati) | Primo tentativo di gamification a punti |
| 23/07 | Modalità **Smart** (SM-2 + debolezze + casualità) | Nasce il pulsante unico |
| 24/07 | Obiettivo giornaliero fisso (5) → **traguardi a fasi senza fine** | La quota fissa non convinceva |
| 24/07 | "Imparate" contate solo con `box > 0`; accuratezza globale | Metriche più oneste |
| 25/07 | Login e sincronizzazione più robusti; **tempo di studio** misurato; `previousEasiness` per la **tendenza** | Più dati, più dinamica |
| 27/07 | Menu con **Imparate % e Accuratezza %**; etichette **livello e argomento**; radar **per argomento** (prima era sulle 2 categorie d'esame, dal 23/07); filtri per livello e argomento; suggerimento in Active Recall; da 56 a 216 domande | La struttura delle informazioni prende forma |
| 24/08 | **XP e sfida quotidiana spostati fuori dal menu**; domande omesse tracciate; 378 domande | La gamification a punti viene declassata |
| 27/08 | **Telemetria** (cambi, primo clic, esitazione), **velocità personale**, voto continuo; font Nunito Sans; **sistema audio** | L'algoritmo diventa "onesto" e il feedback progressivo |
| 30/08 – 09/09 | 606 domande; categoria e argomento mostrati anche nelle revisioni; **selezione del Primo Corpus** | Si comincia con poco |

---

## 7. Stato tecnico del codice

| Verifica | Esito |
|---|---|
| `tsc --noEmit` | ✅ nessun errore |
| `vite build` | ✅ build riuscita, ma un unico bundle JS da **1,76 MB** (473 KB gzip) |
| `npm ci` | ❌ fallisce: `package-lock.json` non è allineato con `package.json`. In repo c'è anche un `bun.lock` |

### Problemi trovati (per priorità)

1. **Limite di 1 MiB del documento Firestore.** Ogni esame salva `questionLogs` con tutti i clic, circa **14 KB** a esame, e le statistiche di 606 domande pesano circa 144 KB. **Dopo una sessantina di simulazioni** la sincronizzazione cloud smette di funzionare **senza avvisare nessuno** (l'errore finisce solo in `console.error`). Soluzione: spostare lo storico in una sotto-collezione o togliere `clickEvents` dal cloud.
2. **Lockfile disallineato**: chi clona il progetto non può fare `npm ci`. Bisogna rigenerare `package-lock.json` e scegliere un solo package manager.
3. **Circa 30 file di lavoro in root** (`add_questions*.cjs`, `inspect_*.cjs/.txt`, `full_audit*.txt`, `part1.txt`, `initial_60.json`, che in realtà non è JSON valido ma un dump di testo, e altri), circa 700 KB in tutto. Andrebbero spostati in `scripts/` o eliminati.
4. **Due barre rovesciate letterali** nei prompt di q392 e q395 (`That\'s`, `didn\'t`) che si vedono sullo schermo.
5. **La simulazione non aggiorna davvero SM-2**: nelle risposte date in esame viene aggiornato solo `box`, mentre `interval` e `easiness` restano invariati. Inoltre `dailyActivity` aumenta sempre di 30, anche con domande lasciate in bianco.
6. **Effetto collaterale dentro un aggiornamento di stato**: quando scade il tempo, `handleFinish` viene chiamata dentro l'updater di `setTimeLeft`. In sviluppo, con `StrictMode`, l'esame può essere registrato due volte (in produzione no).
7. **Dipendenze non usate**: `@google/genai`, `express`, `dotenv` (residui di AI Studio). C'è anche `firebase-applet-config.json`, che punta a un altro progetto Firebase e non viene usato.
8. **La pagina di debug di Firebase** mostra la configurazione a chiunque. Per una web app Firebase non è un segreto (la chiave è pubblica per design e la protezione sono le regole), ma è un pulsante inutile per l'utente finale.
9. **Una risposta "Indovino" veloce conta come imparata**: il voto è 5 − 2 = 3,0, esattamente sulla soglia, quindi `box` aumenta. Chi tira a caso e ci azzecca vede salire "Imparate". Con una soglia a > 3, oppure una penalità di −2,5, tornerebbe da ripassare.
10. **La confidenza si satura**: vale già il 92% alla prima vista e il 100% dopo una sola risposta perfetta, quindi mostra quasi solo i cali.
11. **Codice e dati non usati**: il componente `ActivityChart.tsx` (calendario di 4 settimane) non è più importato da nessuna parte; `examCategoryStats` viene salvato e unito al cloud ma non è mostrato in nessuna schermata; nella simulazione il risultato per categoria viene calcolato ma non visualizzato.
12. **Imparate % diversa tra menu e statistiche**: nel menu si calcola sul materiale scelto, nelle statistiche sempre sulle 606.
13. Dettagli minori: il nome del pacchetto è `react-example`; i conteggi "606" e "60" sono scritti a mano nell'interfaccia; per scegliere le domande dell'esame viene usato `sort(() => 0.5 - Math.random())`, un rimescolamento non uniforme (poco importante qui).

---

## 8. Raccomandazioni

**Per chi studia per l'OFA:**
1. Parti dal **Primo Corpus**: Present Perfect e Past Simple sono metà del nucleo.
2. Usa *Smart* ogni giorno, *Weakness* per rimediare e *Active Recall* sugli argomenti B1 (condizionali, discorso indiretto, gerundio/infinito).
3. Considerati pronto quando superi **stabilmente 25/30** nel simulatore: al test reale ne bastano 24.
4. Rispondi con sincerità *Indovino / Incerto / Sicuro*: "Indovino" e "Incerto" abbassano il voto e la facilità. Attenzione però: oggi un "Indovino" giusto e veloce vale esattamente 3,0 e conta ancora come imparata (§7), quindi le domande azzeccate per caso tornano più tardi del dovuto.

**Per migliorare il progetto:**
1. Correggere le 82 segnalazioni dell'Appendice A, dando priorità ai 44 distrattori ambigui e alle 6 traduzioni imprecise.
2. Rimescolare le opzioni anche nel file sorgente (oggi la risposta giusta è la A nell'89% dei casi), così che eventuali export o riusi non ereditino lo sbilanciamento.
3. Allungare le spiegazioni della parte centrale, dicendo perché le altre opzioni sono sbagliate.
4. Aggiungere la penalità di −0,25 come opzione nel simulatore e mostrare anche il punteggio netto.
5. Risolvere il limite di Firestore, rigenerare il lockfile, pulire la root e dividere il bundle in più parti.
6. **Rendere l'algoritmo coerente con il suo principio**: un tetto di 2,5 alle risposte "Indovino" (oggi una risposta veloce azzeccata a caso vale 3,0 e conta come imparata); normalizzare la confidenza su un intervallo più largo (oggi è al 100% dopo una sola risposta perfetta); aggiornare SM-2 anche con le risposte date nella simulazione.
7. Rimettere in uso il calendario delle 4 settimane (`ActivityChart.tsx`) oppure eliminarlo, e mostrare il risultato per categoria nelle simulazioni, visto che viene già calcolato.

---

## 9. Dal progetto alla skill "metodo-di-studio"

Quello che funziona in quest'app è stato estratto in una skill riutilizzabile per qualsiasi esame (`.claude/skills/metodo-di-studio/`). La skill **non copia** il formato dell'OFA; ne tiene i principi:

| Principio (dall'app) | Come la skill lo riusa per altri esami |
|---|---|
| Algoritmo onesto (voto 0–5 da tempo, cambi di opzione, sicurezza; SM-2) | Stesso algoritmo, con voti adattati per esercizi (aiuti usati), orali (punti chiave coperti) e chat. Lo script `registro.cjs` lo applica anche senza app |
| Etichette categoria / argomento / livello / nucleo | Ridefinite per ogni esame (per esempio esercizio-tipo × metodo × frequenza nei temi passati) |
| Informazioni al momento giusto | Stessa sequenza: apertura → risposta → spiegazione → fine sessione → simulazione → statistiche dal generale al particolare |
| Gamification vera (Imparate %, accuratezza, radar, confidenza con tendenza, pass rate) | Stesse metriche, niente XP, livelli o serie di giorni |
| Tutto dinamico e progressivo | Tempo atteso e velocità personale, feedback che cresce nella sessione |
| Cominciare con poco | Un nucleo piccolo per ogni esame, sessioni brevi, un tocco per iniziare |
| Simulazione più severa del vero | Formato reale ricostruito con esattezza, poi reso più duro |

Nei test la skill ha superato 30 verifiche su 30 su tre richieste realistiche (piano per Analisi 1, interrogazione orale di Fisica in chat, progetto di un'app per il TOLC-I). Claude senza skill ne ha superate 20 su 30.

---

## Appendice A: tutte le segnalazioni, domanda per domanda

Legenda: **AMB** = ambigua, **TRAD** = traduzione imprecisa, **SPIEG** = spiegazione, **TYPO** = refuso, **META** = argomento o livello sbagliato. In nessun caso la risposta segnata come corretta è sbagliata.

### q1–q152 (29 segnalazioni)
| ID | Tipo | Problema | Correzione proposta |
|---|---|---|---|
| q10 | SPIEG | Dice che nelle offerte non si usa *anything*, ma q24 lo dà come risposta corretta; A è sbagliata per *for drink* | Spiegare che l'errore è *for drink* (serve *to drink*) |
| q11 | META | 3ª persona singolare del present simple segnata B1 | A1 |
| q13 | AMB | Anche *Is there some milk…?* è naturale | Distrattore *Is there a milk…?* |
| q20 | AMB + META | Anche *a clean plate* è corretta; il tema è *one/ones*, non i pronomi oggetto | Distrattore *a one*; topic "Pronouns (one/ones)" |
| q21 | META | *could be living* non è A2 e non è una deduzione | B1, "Modals of Possibility" |
| q25 | AMB | Anche *while he waited* è accettabile | Distrattore *while he waits* |
| q28 | META | Testa articoli e plurali, non i quantificatori | "Articles / Plural nouns" |
| q30 | AMB | Anche *It is leaving at 9* è naturale | Distrattore *will leaves* |
| q34 | AMB | *were coming* e *did come* (enfatico) sono grammaticali | *did came*, *comed* |
| q36 | AMB + META | Anche *is working for* traduce bene; il livello non è B1 | Distrattore *Steven working…*; A1 |
| q49 | AMB | *If it rains, we stay home* (zero conditional) è corretta | Distrattore *…we would stay* |
| q55 | TYPO | *Brasil* | *Brazil* |
| q61 | TRAD | "Ha vissuto qui per dieci anni" indica un periodo concluso | Prompt "Vive qui da dieci anni" |
| q70 | AMB | *She did buy…* (enfatico) è grammaticale | *She buyed…* |
| q94 | AMB | *in a long time* è americano standard | Distrattore *from* |
| q98 | AMB | *The train is leaving at 8* è accettabile | *The train leaving…* |
| q104 | TYPO | *the parents' house* non torna con l'indizio "my parents" | *my _____ house* |
| q106 | AMB | *I haven't many friends* è britannico corretto | *I don't have many friend* |
| q109 | AMB | *She has not much free time* è poco naturale: nessuna opzione è davvero buona | Riformulare con little/few |
| q113 | AMB + SPIEG | *What country* va bene quanto *Which*; la spiegazione si contraddice | Distrattore *Whose*; riscrivere la spiegazione |
| q136 | AMB | *by 11 PM* (= entro) è corretta | Distrattore *to* |
| q139 | META | *Can I help you?* è un'offerta o un permesso, non obbligo o consiglio | "Ability and Permission" |
| q140 | META | Testa *interested in*, non gerundio vs infinito | "Dependent Prepositions" |
| q145 | META | *can swim* è abilità | "Ability and Permission" |
| q147 | AMB | *I haven't enough money* è britannico corretto | *…enough of money* |
| q151 | TRAD | Manca la traduzione di "sparsi" | *…are scattered everywhere* |

### q153–q304 (13 segnalazioni)
| ID | Tipo | Problema | Correzione proposta |
|---|---|---|---|
| q203 | AMB | *Which is your favourite colour?* esiste in britannico | Distrattore *Whose* |
| q207 | AMB | *What/Which languages do you speak?* sono corrette | Distrattori sbagliati o indizio "(numero)" |
| q247 | TRAD | *I wait for them here* suona innaturale | *I'll wait / I'm waiting for them here* |
| q271 | AMB | *hiding in the bed* è plausibile | Distrattore *at/between* |
| q276 | AMB | *next to her two best friends* è corretta | Distrattore *among/above* |
| q278 | SPIEG | Definizione di *over* confusa | "*Over* = above/across" |
| q281 | AMB | *I am in the cinema* è accettabile | Distrattore *into* |
| q283 | TRAD | "vicino a" si traduce *near*, non *next to* | Chiave *near the bank* |
| q284 | TYPO | Spiegazione metà in italiano e metà in inglese | Una lingua sola |
| q286 | AMB | *put … into the wardrobe* è corretto | Distrattore *to the wardrobe* |
| q287 | AMB | *in the station* è possibile | Distrattore *into/by* |
| q292 | SPIEG | "Negative commands always start with Don't" non è vero | "usually" |
| q300 | SPIEG | È *listen* che vuole *to*, non "ascoltare" | Correggere il soggetto della regola |

### q305–q456 (17 segnalazioni)
| ID | Tipo | Problema | Correzione proposta |
|---|---|---|---|
| q306 | AMB | *No smoking in this room* è un divieto naturale | Distrattore *Smoke not…* |
| q316 | SPIEG | *have intention to* è un calco che non esiste | "Avere intenzione di" = *be going to* |
| q319 | TRAD | "Stiamo per" vuol dire *about to*; anche *We are buying* va bene | Prompt "Abbiamo intenzione di…"; nuovo distrattore |
| q324 | AMB | *I'm sure he will fall* è naturale | Togliere "Sono certo che" |
| q328 | META | Lo spazio testa *started to + forma base*, non il past continuous | Spostare lo spazio o cambiare topic |
| q338 | AMB | Anche le altre combinazioni con *while* sono corrette | Distrattori agrammaticali |
| q339 | AMB | *Did it rain hard…?* traduce bene | Aggiungere contesto |
| q347 | AMB | *Must I wear a suit?* è corretta (formale) | Distrattore *Do I must* |
| q349 | AMB | *You shouldn't smoke…* è accettabile senza un indizio di divieto | Aggiungere "It's against the rules" |
| q350 | AMB | *should wear glasses* ha senso; non si tratta di "obbligo esterno" | Nuovo distrattore; parlare di necessità |
| q357 | AMB | *Should I take off my shoes?* va bene | Distrattore *Do I must…* |
| q367 | AMB | *worked harder* è corretto | Distrattore *hardy* |
| q373 | TYPO | Virgola italiana in *Please, speak slowly* | *Please speak slowly* |
| q392 | TYPO | Barra rovesciata visibile: *That\'s* | *That's* |
| q395 | TYPO | Barra rovesciata visibile: *didn\'t* | *didn't* |
| q416 | AMB | *can't stand to wait* è accettato | Verbo solo con -ing (*can't help*) |
| q430 | AMB | *remembered locking* è corretto (con un altro significato) | Contesto univoco |

### q457–q606 (23 segnalazioni)
| ID | Tipo | Problema | Correzione proposta |
|---|---|---|---|
| q493 | AMB | *must* può restare invariato nel discorso indiretto | Distrattore *musts* |
| q501 | AMB | *finished* senza un'azione passata di riferimento è naturale | "By the time the manager called…" |
| q502 | SPIEG | Esempio in inglese goffo | "He had lunch first, so later he wasn't hungry" |
| q507 | AMB | *because she studied hard* è standard | Nuovo contesto |
| q515 | TRAD | Manca "un pacchetto al giorno" | *…smokes a pack a day* |
| q546 | AMB | *It has to be late* va bene per la deduzione | Distrattore *may to be* |
| q552 | AMB | *That has to be your new boss* va bene | *must to be* |
| q553 | AMB | Indizio debole: *might* è altrettanto valido | Rafforzare l'indizio |
| q554 | AMB | Indizio debole (*a ticket*) | *a cinema ticket…* |
| q555 | AMB | Luci spente può voler dire anche "sono usciti" | *It's 3 a.m.…* |
| q560 | SPIEG | Glossa italiana innaturale | "la prima volta che ho visto…" |
| q563 | SPIEG | *to test an experiment* non ha senso | "as an experiment" |
| q571 | META | *news was* non riguarda i quantificatori | "Countable/Uncountable" |
| q572 | META | *furniture is* | "Countable/Uncountable" |
| q574 | META | *police are* | "Collective nouns" |
| q583 | META | *as soon as* è una subordinata temporale | "Future Time Clauses" |
| q584 | META | *until* | "Future Time Clauses" |
| q586 | META | *in case* | "Future Time Clauses / In case" |
| q587 | META | *non appena* | "Future Time Clauses" |
| q597 | AMB | *older brother* è corretto, anzi più comune | Distrattore davvero sbagliato |
| q600 | AMB | *used not to* è corretto (britannico formale) | Distrattore *didn't used* |
| q601 | AMB | *Are you used to…?* rende il senso | *Have you used to…?* |
| q606 | TYPO | Spiegazione metà in inglese e metà in italiano | Una lingua sola |

---

## Appendice B: metodologia

- **Estrazione**: `src/data/questions.ts` convertito in JSON, con statistiche calcolate via script (distribuzioni, duplicati, similarità di Jaccard tra i prompt con la stessa funzione dell'app, bias di posizione e di lunghezza, conteggio dei distrattori-trappola con espressioni regolari).
- **Controllo linguistico**: le 606 domande sono state divise in 4 blocchi di circa 150, e ogni domanda è stata controllata una per una su chiave, ambiguità, traduzione, spiegazione, refusi e metadati.
- **Codice**: lettura di tutti i componenti e le librerie in `src/`, `npm install` (senza modificare il lockfile), `tsc --noEmit`, `vite build`, stima della dimensione del documento Firestore con un esame simulato.
- **Test reale**: confronto con fonti pubbliche aggiornate al bando 2026/27 (link al §2). La pagina ufficiale polimi.it non era raggiungibile durante l'analisi: per le regole definitive fa fede il bando ufficiale del Politecnico.
