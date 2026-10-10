# AddiOFA: quanto è pronta per essere venduta

Revisione del 9 ottobre 2026 sul repository `/home/user/AddiOfa`, ultimo commit `3feece6`. Ho letto il codice, contato il banco di domande con uno script, controllato a mano un campione di 30 domande, eseguito il typecheck e la build (con output in una cartella temporanea, senza toccare `dist/`) e fatto il typecheck di `atlas`. Nel repository non ho modificato nulla.

## Giudizio in breve

**Come app di studio gratuita è buona e funziona. Come prodotto a pagamento oggi non è vendibile.** Il motivo è semplice: il pagamento non è collegato a niente. Non esiste uno stato "pagato", non c'è un blocco, non c'è un backend che verifichi gli acquisti, e tutte le 636 domande con le risposte arrivano già nel JavaScript che scarica il browser. In più ci sono quattro problemi che bloccano il lancio a prescindere dal codice:

1. **Provenienza di parte del banco.** Un blocco di 30 domande sembra trascritto da una prova esistente.
2. **Formato del test.** Chi compra è chi ha già l'OFA e deve fare il test di recupero presso gli enti convenzionati. Il formato di quel test non è verificato da nessuna parte, e i documenti si contraddicono.
3. **La garanzia di rimborso** si basa su dati che l'utente può falsificare.
4. **Mancano gli aspetti legali e fiscali**: termini, privacy, diritto di recesso, partita IVA.

Il lavoro per arrivare a una vendita seria è di circa **33 giorni di lavoro**, cioè 7 settimane per una persona sola, più i tempi esterni (commercialista, testi legali). Una beta a pagamento minima e onesta richiede circa **15 giorni**. Le stime sono al §4.

---

## 1. Contenuti

### 1.1 Numeri reali (`app/src/data/questions.ts`, 9.553 righe)

| Dato | Valore |
|---|---|
| Domande | **636** (`q1`–`q636`), ID tutti unici, tutte con 4 opzioni e una spiegazione |
| Categoria | Grammatica 405, Traduzione dall'italiano 231 |
| Livello | A1 195, A2 154, B1 287 |
| Argomenti (`grammarTopic`) | **31**. Da Present Simple (36) a Modals of Ability and Permission (6) e Prepositions of Time (10). Gli altri argomenti hanno 18–30 domande |
| "Primo Corpus" | Le prime 60 (`questions.ts:3-10`) |
| Posizione della risposta giusta nel file | Opzione A in 550 casi su 636 (86%). L'app però rimescola le opzioni con Fisher-Yates (`src/lib/utils.ts:19-27`, usato in `ExamMode.tsx:68`, `LearnMode.tsx:48` e `diagnostic.ts:34`), quindi nell'app non si vede. Chi copia il file però ha le risposte in chiaro |
| Spiegazioni | Mediana di 51 caratteri, 207 sotto i 40 (per esempio q64 "Singular negative existence.", q79 "First conditional structure."). **Circa il 95% è in inglese**: solo q607–q636 e pochi altri casi sono in italiano |

### 1.2 Teoria

- Esiste solo il **Prontuario**: `src/data/cheatSheet.ts:10-35`, 24 regole di una riga ciascuna, con la trappola tipica, mostrate da `CheatSheet.tsx`.
- **Non c'è una lezione o una pagina di teoria per argomento.** Sei argomenti su 31 non hanno nemmeno una riga nel prontuario: Past Continuous, Object Pronouns, Demonstratives, Imperative, Questions and Origins, Modals of Ability and Permission.
- Dopo ogni risposta, in allenamento, viene mostrata la spiegazione breve (`LearnMode.tsx:489`).
- Per un pubblico A1–B1 italiano che paga, spiegazioni brevi e in inglese sono un punto debole.

### 1.3 Qualità

- **Campione di 30 domande a caso** (seme fisso: q17, q26, q77, q149, q172, q178, q187, q218, q237, q260, q287, q298, q398, q405, q434, q442, q467, q484, q485, q513, q559, q568, q573, q580, q592, q599, q606, q608, q609, q633):
  - **30 risposte giuste su 30**, e l'inglese delle risposte è corretto.
  - Difetti minori:
    - q149: il distrattore "The house of my grandparents is big" è grammaticalmente corretto, anche se poco idiomatico.
    - q237: l'indizio "(us/we/our/ours)" nel testo ripete le opzioni.
    - Ortografia americana e britannica mescolate (neighbor, spilled).
    - Spiegazioni telegrafiche.
- **Duplicati.** Nessun duplicato esatto (stesso testo e stesse opzioni). Un testo di domanda uguale ("Choose the correct sentence:", q49 e q620, con contenuto diverso). Con uno script di somiglianza ho trovato **13 coppie quasi doppie**: q39/q53 e q627/q630 sono in pratica la stessa domanda; q12/q620, q22/q610, q25/q618, q30/q633, q42/q624, q47/q609 e q63/q621 si sovrappongono. Quasi tutte coinvolgono il blocco q607–q636 (§1.4). L'esame ha un filtro di somiglianza a 0,45 (`ExamMode.tsx:45-55`) che limita il problema nelle simulazioni.
- **Difetti evidenti nel blocco finale:**
  - q620 (`questions.ts:9299`): "- choose the correct sentence -", con due opzioni che differiscono solo per la maiuscola ("Look! It's raining" / "Look! it's raining") e un refuso nel distrattore "raning".
  - q612 (`:9179`): "dcn't like" e "English Food" con la maiuscola.
  - q629 (`:9434`): "Saras".
  - q621: prompt senza punto di domanda.
- **Il blocco q607–q636 non è mai stato controllato dal REPORT.** REPORT.md analizzava 606 domande, mentre le 30 in più erano già presenti al commit di import `9a074d9`.

### 1.4 Provenienza: c'è traccia di domande copiate?

**Probabilmente sì. Va chiarito prima di vendere.**

- q607–q636 (`questions.ts:9104-9553`) sono **esattamente 30 domande**, quante ne ha il test reale. Hanno il formato tipico di una prova stampata ("She ...... to the cinema yesterday.", "Hurry! The bus leaves ...... 2 minutes.") e refusi da ricopiatura o OCR (dcn't, raning, Saras).
- Il nucleo originale q1–q60 è costruito sulle stesse frasi, tradotte o riformulate: Brasile (q1↔q613), Africa 2009 (q5↔q622), Mr Smith's wife (q3↔q623), worst day (q4↔q615), New York more modern (q6↔q635), Tom away since Monday (q39/q53↔q607).
- La skill dice che il nucleo andrebbe formato "dalle domande più frequenti all'esame (ricordate da chi l'ha già fatto o prese dalle simulazioni ufficiali)" (`.claude/skills/metodo-di-studio/references/adattamento-per-esame.md:23`).
- Il REPORT scrive: "Se il nucleo ricalca le domande dell'esame vero, come fa pensare il nome…" (`REPORT.md:126`).
- `docs/strategia/addiofa-strategia.md:435` e `:490` segnalano già l'origine delle 636 frasi come "da chiarire".
- Non sono riuscito a identificare la fonte con una ricerca web.
- **Rischio:** se sono domande del test di Ateneo, di un ente o di un placement test editoriale, venderle è riproduzione di materiale protetto o riservato. In più comprometterebbe la tua posizione in PoliNetwork.
- **Cosa fare:** togliere o riscrivere q607–q636 e controllare q1–q60. Le restanti ~550 hanno lo stile uniforme da "generate a blocchi" (`tools/archivio/add_questions_*.cjs`) e non mostrano tracce di copia.

### 1.5 Formato della simulazione e confronto con il test reale

| | App (`ExamMode.tsx`) | Test reale |
|---|---|---|
| Domande | 30 (`:41-68`), estratte a caso da tutto il banco o dal Primo Corpus, senza un mix per livello | Sezione Inglese del TOL Polimi: 30 quesiti |
| Tempo | 15 min (`:20`) | 15 min |
| Soglia | **25/30** (`:21`, `offer.ts:76`). È volutamente un punto più severa | **24/30** per evitare l'OFA (fonte: [Supermat – OFA Polimi](https://supermat.it/test-ingegneria/ofa-polimi/)). `offer.ts:10` usa giustamente 24 per la stima del diagnostico |
| Penalità | Nessuna | −0,25 per errore (vale solo per la graduatoria, non per la soglia OFA, `REPORT.md:50-55`) |

- La frase "30 domande in 15 minuti, soglia 25/30" che ti è stata riferita mescola due cose: 30 domande in 15 minuti è il test reale, 25/30 è la soglia del simulatore. La soglia reale è 24.
- **Punto critico per la vendita.** Chi ha già l'OFA non rifà il TOL: fa il **test di recupero presso gli enti convenzionati** (`offer.ts:12-17`, `docs/strategia/simulatore-ofa.md:14`). Il formato di quel test **non è verificato**:
  - `docs/strategia/simulatore-ofa.md:10` dice "30 in 15 minuti, soglia 25/30, come il test degli enti convenzionati";
  - `docs/strategia/addiofa-strategia.md:55` dice "di solito 15 domande in 30 minuti".
  - Non ho trovato fonti online.
  - Bisogna verificarlo prima di promettere "simulazioni identiche al test" e soprattutto prima di offrire una garanzia legata a quel test.

---

## 2. Funzioni presenti

| Funzione | Stato | Dove |
|---|---|---|
| Algoritmo di ripasso | ✅ SM-2 con voto continuo 0–5 calcolato da tempo atteso, cambi di opzione e sicurezza dichiarata. 6 modalità: smart, standard, weakness, blitz, category, recall. Anche le simulazioni aggiornano SM-2 | `lib/spacedRepetition.ts:30-127`, `:246-273`; `App.tsx:163-238` |
| Simulazioni | ✅ 30 domande / 15 min, navigazione libera, risultati per categoria, conferma di uscita e consegna | `ExamMode.tsx` |
| Quiz diagnostico | ✅ 10 domande (3 A1, 2 A2, 5 B1), stima beta-binomiale della probabilità di fare ≥24/30. Ho ricalcolato i numeri del README: 6/10→11%, 8/10→46%, 10/10→91%. Sono corretti, ma il modello presume che le domande del banco abbiano la stessa difficoltà del test reale, e nessuno l'ha verificato | `lib/diagnostic.ts` |
| Statistiche | ✅ Imparate %, radar per argomento, barre per livello, confidenza, attività, tracker della garanzia. Nota: "imparata" significa `box>0`, cioè basta una risposta buona | `StatsMode.tsx`, `GuaranteeTracker.tsx` |
| Gamification | ⚠️ Suoni e coriandoli che crescono con la serie, ma resta la barra XP/livelli con "50 XP regalati" (`StatsMode.tsx:141-146`), che contraddice la filosofia dichiarata nella skill ("non livelli/XP/streak") | |
| Funnel di onboarding | ✅ intro → certificazione → OFA → quiz → login → rischio → risultato → piano → piani → obiettivo | `Onboarding.tsx` |
| Login | ✅ Google via Firebase Auth (popup). Dopo il login compare la schermata di consenso "Project ID": se si annulla, si viene disconnessi (`App.tsx:278-281`) | `lib/firebase.ts`, `ProjectConsent.tsx` |
| Paywall / pagamenti | ❌ **Solo una vetrina.** 3 piani (9,99 / 14,99 / 24,99 €, `offer.ts:38-65`) con link di pagamento esterni da `.env`, vuoti, quindi l'app mostra "Siamo in beta". Non esiste uno stato pagato e nessuna funzione è bloccata. La pagina `?pagamento=ok` (`PaymentThanks.tsx`) è solo un ringraziamento | `Plans.tsx:25-33` (passa `client_reference_id = uid`: è un buon aggancio per un futuro webhook) |
| Garanzia "Promosso" | ⚠️ Condizioni visibili accanto al prezzo (bene), ma misurate solo nel client (§3.2) | `offer.ts:69-83`, `lib/guarantee.ts` |
| Referral | ❌ Assente | |
| Verifica email @mail.polimi.it | ❌ Assente (solo Google) | |
| Classifica NOI | ⚠️ Codice pronto, ma spenta: senza `VITE_ATLAS_API_URL` mostra "arriva presto" (`Leaderboard.tsx:45`). Atlas non è pubblicato (§6) | `Leaderboard.tsx`, `lib/atlas.ts` |
| Tema scuro | ✅ Interruttore nel menu, preferenza di sistema, illustrazioni `.scuro.svg` | `hooks/useTheme.ts`, `index.html:16-22` |
| PWA / offline | ⚠️ C'è il `manifest.json` (`public/manifest.json`), ma **nessun service worker**: niente offline né cache | |
| Esporta / importa progressi | ✅ JSON. È anche un problema (§3.2) | `lib/storage.ts:207-233` |
| Pagine legali (privacy, termini, cookie) | ❌ Assenti nel codice | |
| Test automatici | ❌ Nessuno | |

---

## 3. Sicurezza e vendibilità

### 3.1 Contenuti nel bundle: copiabili in pochi secondi

- La build produce `assets/index-*.js` (853 KB, 208 KB gzip), che contiene **tutte le 636 domande con `correctIndex` e spiegazioni**: le ho trovate e contate (636 occorrenze di `correctIndex`).
- Il commento in `vite.config.ts:24` ("banco domande in file separati") non corrisponde al codice: `manualChunks` non separa `questions.ts`.
- Il README lo dice onestamente (`README.md`, sezione Pagamenti, punto 1).

### 3.2 Lo stato "premium" si può falsificare?

- **Oggi lo stato premium non esiste**, quindi non c'è niente da falsificare: è tutto gratis per tutti.
- Qualunque blocco aggiunto solo nel client si aggira, perché le domande sono già nel bundle.
- **La garanzia invece è falsificabile oggi.** Le condizioni del rimborso (giorni di studio, simulazioni ≥25) si calcolano da `state.history` e `state.dailyTimeSpent` (`guarantee.ts:11-19`). L'utente può modificarli in tre modi:
  1. **Importa** un JSON qualsiasi: l'unico controllo è che `streak` sia un numero (`storage.ts:224`; `App.tsx:240-253` lo carica e lo sincronizza sul cloud);
  2. scrive direttamente nel suo documento Firestore, perché le regole non validano nulla (`firestore.rules:5-6`);
  3. modifica `localStorage`.
- **Non si può vendere una garanzia di rimborso misurata così.**
- I punteggi della classifica sono inviati dal client. Atlas accetta fino a 5.000 domande imparate quando il banco ne ha 636 (`atlas/src/index.ts:41`, `:291`): la classifica si gonfia facilmente (il README di atlas lo ammette).

### 3.3 Regole Firestore

- `app/firestore.rules:5-6`: ogni utente legge e scrive solo `users/{uid}`. Per la privacy è corretto, ma **non c'è alcuna validazione** di schema, dimensione o campi.
- Nel repository non c'è un `firebase.json`, quindi non si può verificare se le regole pubblicate siano davvero queste.
- `firebase-blueprint.json` è un residuo di AI Studio e non è usato.

### 3.4 Salvataggi: frequenza e dimensione

- **Frequenza.** Ogni risposta in allenamento chiama `handleUpdateAppState` → `syncToCloud` (`LearnMode.tsx:181,193,226,243` → `App.tsx:152-157`), che riscrive tutto il documento con `setDoc(..., {merge:true})` (`storage.ts:65-72`). In più, durante lo studio, il tempo viene salvato ogni 10 secondi in locale e ogni 60 secondi sul cloud (`App.tsx:127-150`). Lo stesso succede alla fine di ogni simulazione, del consenso e dell'onboarding.
- **Dimensione.** Ho stimato un utente intenso (636 domande viste, 50–100 simulazioni con log): circa **240 KB dopo 10 simulazioni e circa 570 KB oltre le 50**. Il limite di 1 MiB è rispettato grazie a `toCloudState` (`storage.ts:43-63`), ma su rete mobile **ogni tocco carica fino a mezzo MB**. Vanno raggruppati i salvataggi (a fine sessione o ogni 30–60 secondi) e lo storico va spostato in sotto-documenti.

### 3.5 Chiavi e configurazione esposte

- **Config Firebase in chiaro** in `src/lib/firebase.ts:5-13` (progetto `ofaenglish-f3719`, `apiKey`, `measurementId`). Per Firebase web è normale: la chiave non è segreta, la protezione sono le regole e i domini autorizzati. Conviene comunque limitare la chiave per referrer HTTP nella console Google Cloud.
- **`app/firebase-applet-config.json`**: residuo di AI Studio con un **altro progetto** (`mimetic-resolver-7szp9`), `apiKey` e `oAuthClientId`. Non è usato dal codice ma è versionato in git: va tolto e la chiave va revocata se il progetto non serve più.
- `atlas/.dev.vars` contiene `ALLOW_TEST_TOKENS`. Non è versionato (`.gitignore`), ma in produzione non deve mai essere `true` (`atlas/src/index.ts:76`).
- Nessun segreto di pagamento nel repository (i link di pagamento sono pubblici per natura).

### 3.6 Debug e pagine interne

- La pagina Debug Firebase è solo in sviluppo (`App.tsx:358`, `:473`; `Menu.tsx:83`): va bene.
- **`?brand` apre il catalogo del Brand Kit anche in produzione** (`App.tsx:40`, `:332-338`, import statico di `BrandKit` a `App.tsx:29`). Va tolto dalla build pubblica o caricato solo in sviluppo.
- **Nomi segnaposto visibili all'utente:** "Accedi con **Project ID**", "le altre app **Project**" (`config/ecosystem.ts:4-10`, `Onboarding.tsx:205-208`, `Leaderboard.tsx:87-94`). Il README li indica come provvisori.

### 3.7 File da togliere o ripulire

- **Repository.** `.git` pesa 644 MB, `grafica/brand/` 508 MB, `strumenti/` 21 MB (inclusi `__pycache__`). Alla radice ci sono 7 PNG da circa 1,3 MB ciascuno, `chat-idea-bozza.md` (375 KB, chat grezza con tattiche che `docs/strategia/addiofa-strategia.md` §8 giudica scorrette: meglio non renderla pubblica) e `design-concept/`. Il codice dell'app va separato dal laboratorio grafico, soprattutto se il repository diventa pubblico.
- **Residui di AI Studio:** `firebase-applet-config.json`, `firebase-blueprint.json`, `metadata.json`, commenti `DISABLE_HMR` in `vite.config.ts:35-40`.
- **`contenuti/archivio/`**: fuori dal bundle, ma con dump completi del banco (`all_questions_detailed.txt`). Se il repository è pubblico, il banco è comunque già pubblico.
- **Peso della build:** 28 MB, di cui 20 MB di SVG. Le illustrazioni pesano 200–860 KB l'una e quella dell'intro, `studio-inglese`, circa 500–660 KB. Pesano sul primo caricamento da telefono, proprio nella prima schermata del funnel.

### 3.8 Compilazione

- `npx tsc --noEmit` in app: **0 errori**.
- `vite build`: **riuscita** in 11 secondi, con avviso per i chunk oltre 500 KB (index 853 KB, firebase 671 KB, charts 408 KB).
- `npx tsc --noEmit` in atlas: **0 errori**.

---

## 4. Cosa manca per il lancio a pagamento (stime prudenti, una persona)

| # | Voce | Giorni | Bloccante? |
|---|---|---|---|
| 1 | **Backend per gli acquisti e per le domande.** Worker + D1, riusando `atlas/src/auth.ts` che verifica già i token Firebase. Tabella degli acquisti, endpoint che dà il banco completo solo a chi ha pagato e un "free pool" agli altri, domande tolte dal bundle e caricate dopo il login. Variante più robusta, con le risposte validate sul server: +4–5 giorni | 4 | Sì |
| 2 | **Stripe**: Payment Link o Checkout, webhook `checkout.session.completed` con `client_reference_id`, rimborsi e contestazioni, ripristino dell'accesso su un altro dispositivo, modalità test | 2,5 | Sì |
| 3 | **Paywall nell'app**: stato del piano letto dal server, blocchi (dopo il diagnostico e N domande o 1 simulazione), schermate di sblocco, gestione degli errori | 2,5 | Sì |
| 4 | **Salvataggi**: salvataggi raggruppati invece che a ogni risposta, storico in sotto-documenti, regole Firestore con validazione, rimozione o firma dell'Importa | 1,5 | Sì |
| 5 | **Garanzia**: toglierla al lancio (0,5 giorni) **oppure** registrare simulazioni e tempo sul server, processo di richiesta, verifica dell'esito, testo legale (5–6 giorni) | 0,5 | Sì, se resta |
| 6 | **Legale e fiscale**: termini di vendita, informativa privacy (Firebase/Google, Stripe, eventuale Atlas), consenso esplicito e rinuncia al recesso per contenuti digitali nel checkout, dati del venditore, partita IVA. Lavoro di sviluppo per pagine e checkbox; testi da un professionista | 1,5 (+ esterni) | Sì |
| 7 | **Provenienza del banco**: rimuovere o riscrivere q607–q636, controllare q1–q60, sistemare i 13 quasi doppioni, q620, q612 e q629 | 2 | Sì |
| 8 | **Formato del test di recupero** presso gli enti: verificarlo e adattare simulatore, testi e soglie | 1 | Sì (riguarda le promesse commerciali) |
| 9 | **Spiegazioni in italiano** e più complete per 636 domande, con l'AI e revisione umana | 5 | Fortemente consigliato |
| 10 | **Teoria per argomento** (31 schede brevi con esempi, collegate agli errori) | 4 | Fortemente consigliato |
| 11 | **Analytics** con rispetto della privacy (Plausible, Umami o PostHog in UE): eventi del funnel, conversione, retention D1/D7, punteggi delle simulazioni, sondaggio sull'esito reale | 2 | Sì per capire se funziona |
| 12 | **Hosting**: Cloudflare Pages, dominio, domini autorizzati Firebase, intestazioni di sicurezza; service worker opzionale | 1,5 | Sì |
| 13 | **Peso**: SVG ottimizzati o convertiti, caricamento differito di BrandKit e recharts | 2 | Consigliato |
| 14 | **Pulizia**: `?brand` in produzione, nomi segnaposto "Project", residui XP, residui di AI Studio, REPORT aggiornato | 1 | Sì |
| 15 | **Prove su dispositivi**: flusso di pagamento end-to-end, iOS Safari (login con popup), Android, tema scuro | 4 | Sì |
| | **Totale percorso serio** (garanzia tolta) | **≈ 33 giorni** (6–8 settimane) | |
| | Garanzia mantenuta | + 5 | |
| | Opzionali: verifica @mail.polimi.it (1–2), referral (3–4), pubblicazione di Atlas e classifica (1–2 più privacy) | + 5–8 | |

**Beta a pagamento minima** (voci 1, 2, 3, 4, 5 tolta, 6, 7, 8, 11, 12, 14 e un giro di test di 2 giorni): circa **15 giorni** più i tempi esterni per legale e fisco.

---

## 5. Coerenza tra documenti e codice

| Documento | Affermazione | Codice reale |
|---|---|---|
| REPORT.md:13, :68, :188, :192 | 606 domande, tutte controllate, 0 chiavi sbagliate | **636** domande. Le 30 in più (q607–q636) non sono mai state controllate e contengono refusi e casi ambigui |
| REPORT.md:1, :26 | Nome "OFA Polimi Prep", pacchetto `react-example`, `GEMINI_API_KEY` | Superato: nome AddiOFA, pacchetto `addiofa`, `.env.example` senza Gemini |
| REPORT.md:17 | XP e livelli "residui" | Ancora visibili in Statistiche (`StatsMode.tsx:141-146`, `:612-621`) |
| REPORT.md:545 | Firestore pieno dopo ~60 simulazioni | Corretto da `toCloudState` (`storage.ts:43-63`); il README lo dice |
| REPORT.md:552, :557 | Debug visibile a tutti, `sort(()=>0.5-Math.random())` | Corretti (debug solo in sviluppo, Fisher-Yates) |
| REPORT.md:14, :49 | Test reale 30/15 min, soglia 24, simulatore a 25 | Coerente con il codice e con la fonte esterna. Non distingue però TOL e test di recupero |
| README.md | 636 domande, 24 regole, pagamenti disattivati, serve la verifica lato server | **Coerente.** È il documento più aggiornato e onesto |
| README.md, sezione Struttura | "funnel dei mockup … piani", "checkout esterno" | Coerente: il checkout esiste solo come link |
| vite.config.ts:24 | "banco domande in file separati" | Falso: le domande sono nel chunk principale |
| docs/strategia/simulatore-ofa.md:10 e docs/strategia/addiofa-strategia.md:55 | 30 in 15 min con soglia 25 / 15 in 30 min | Si contraddicono. Nessuno dei due è verificato per il test di recupero |
| docs/strategia/simulatore-ofa.md:30 | "eliminare il salvataggio ogni 60 secondi e il documento unico", "togliere domande dal codice" | **Non fatto** (§3.4, §3.1) |
| Skill metodo-di-studio (SKILL.md) | "gamification vera, non livelli/XP/streak" | L'app mostra ancora XP e livelli |
| Skill, `assets/codice-ofa/` | Copia del codice dell'app | Diverge già dal codice attuale (es. `ExamMode.tsx`). Va presentata come esempio, non come codice dell'app |
| sapere/*.md | Quasi tutto sul brand (logo, illustrazioni, strumenti) | Coerente, ma mostra dove è andato il lavoro: il brand è finito, monetizzazione e backend no |

---

## 6. Atlas

- **Cosa fa.** Worker Cloudflare con D1: account unico "Project ID" (prefisso `PRJ`), collegamenti tra app con consenso per singolo permesso e registro dei consensi, esportazione e cancellazione dei dati, classifica NOI. Verifica i token Firebase con RS256 senza dipendenze (`atlas/src/auth.ts:46-76`). Schema: `accounts`, `apps`, `app_links`, `consent_log`, `noi_scores` (`migrations/0001_init.sql`). Il typecheck passa.
- **Deploy.** Secondo il README, il database D1 è creato e migrato, ma il **Worker non è mai stato pubblicato** (`atlas/README.md:12`). L'app non ha `VITE_ATLAS_API_URL`, quindi Project ID resta solo locale e la classifica è spenta. `ALLOWED_ORIGINS` è `"*"` (`wrangler.jsonc`).
- **Serve al lancio?** **No, così com'è.** Non gestisce acquisti né domande, e aggiunge ambito GDPR (un altro trattamento, un altro registro, un'altra informativa) e un nome segnaposto ("Project") che l'utente vede. La classifica si falsifica facilmente (§3.2).
- **Cosa conviene riusare.** Lo scheletro (verifica dei token Firebase, D1, struttura delle rotte) è la base più rapida per il backend del §4.1: tabelle `entitlements` e `questions`, webhook Stripe. Project ID, consensi multi-app e NOI possono aspettare dopo il lancio.

## 7. Telemetria e analytics

- **Non ce n'è.** Firebase Analytics non è inizializzato (nessun `getAnalytics`, anche se `measurementId` è in `firebase.ts:12`). Non ci sono Plausible, PostHog o simili.
- La "telemetria" del codice è didattica e resta all'utente: tempi di risposta, clic, cambi di opzione per SM-2 (`types.ts:18-28`). Finisce solo nel `localStorage` e nel suo documento Firestore.
- **Non si possono misurare**:
  - la conversione (funnel → piani → checkout);
  - la retention;
  - il tasso di superamento reale, perché nessuno chiede l'esito del test e l'onboarding salva solo `hasOfa` (`types.ts:313-320`).
- La percentuale di simulazioni superate nell'app non misura i promossi al test vero.
- Senza questi dati non si può né sostenere un claim di efficacia né calibrare la stima del diagnostico.

---

## Rischi bloccanti (in ordine)

1. **Provenienza di q607–q636 e del nucleo q1–q60.** Rischio di diritto d'autore e di riservatezza del test, oltre che di reputazione.
2. **Nessuna protezione dei contenuti e nessuna verifica degli acquisti.** Pagare non sblocca nulla e il banco è già scaricabile gratis.
3. **Garanzia di rimborso basata su dati falsificabili**, legata a un test (il recupero presso gli enti) di cui non si conosce il formato.
4. **Legale e fiscale**: termini, privacy, recesso per contenuti digitali, partita IVA, uso di gruppi e canali dove hai un ruolo (`docs/strategia/simulatore-ofa.md:35`).
5. **Nessuna analytics**: si lancia senza poter misurare se vende o se funziona.
