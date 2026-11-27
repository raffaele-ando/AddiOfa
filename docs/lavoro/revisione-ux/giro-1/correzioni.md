# Correzioni giro 1

Ogni voce: numero, esito, file toccati, verifica. Server di prova: `vite preview --port 4310`, Playwright + Chromium.
Stato: giro completato. Tutte le 100 voci hanno un esito qui sotto (alcune raggruppate perché sono lo stesso problema). `npm run lint` passa; `npm test`: 313 passate, 0 fallite, 4 saltate.

## 1, 24, 58, 59 — nome e corso: Profilo vs iscrizione (stesso problema)
Esito: corretto. `useProfilo` legge nome e corso dall'iscrizione (la stessa fonte di Home e Project ID) quando c'è; salvando da Modifica profilo si aggiorna l'iscrizione (corsoId si toglie se il corso cambia; si rimanda ad ATLAS solo se non collegata a Project ID). Senza iscrizione resta `extra.profilo`.
File: `app/src/screens/extra/profilo/componenti.tsx`.
Verifica: Playwright 390 chiaro con lo stato reale degli ispettori (Mario Rossi): Profilo «M · Mario Rossi · Altro», Modifica profilo precompilata; salvato Giulia/Design → Home «Ciao, Giulia», Project ID «Nome Giulia, Corso Design», Profilo «G · Giulia · Design». Zero errori in console.

## 92 — Modifica profilo: Invio, doppio clic su Salva, avatar «S»
Esito: corretto. Avatar risolto con la voce 1; i campi stanno in un `<form>`: Invio salva; un secondo clic su Salva è ignorato (ref).
File: `app/src/screens/extra/profilo/ProfiloModifica.tsx`.
Verifica: Playwright, Invio nel campo Nome salva e torna indietro (Home «Ciao, Giulia»).

## 2, 25 — probabilità «<1%» in Home/ATLAS ma «0%» in Profilo, Progressi, Obiettivi
Esito: corretto. `numeriUtente` dà anche `probabilitaTesto` (formatProbabilita, lo stesso formatter di Home e ATLAS); Profilo (numero e «Probabilità ora»), Progressi (valore e etichetta del grafico) e Obiettivi lo usano.
File: `app/src/lib/profilo/numeri.ts`, `app/src/screens/extra/profilo/Profilo.tsx`, `PanoramicaProgressi.tsx`, `Obiettivi.tsx`.
Verifica: vedi verifica cumulativa più sotto (stato reale: Profilo «<1%»).

## 3, 23, 69 — FAQ, Informativa, Termini e pagina Iscrizioni parlano di consensi facoltativi
Esito: corretto (testi allineati all'unico consenso obbligatorio, decisione di prodotto invariata). Informativa §1 e §2, Termini, FAQ dell'app e FAQ della landing ora dicono «un solo consenso, termini e privacy, mai preselezionato». Pagina admin: «Solo chi ha il consenso ai messaggi» (il filtro del server resta, serve per le iscrizioni vecchie).
File: `app/src/legal/privacy.ts`, `app/src/legal/termini.ts`, `app/src/lib/servizi/faq.ts`, `app/src/screens/landing/Faq.tsx`, `app/src/screens/extra/servizi/Admin.tsx`, commento in `app/src/lib/progetto/profilo.ts`.
Nota per l'autore: è un testo legale; la revisione di un professionista resta consigliata. La data `LEGAL_AGGIORNATO` non è stata cambiata.

## 79 — il consenso unico registra anche «comunicazioni»
Esito: non corretto. Il campo `comunicazioni` fa parte del contratto con ATLAS e della versione del consenso; l'Informativa (§ basi giuridiche) dice già che i messaggi di Project e Agorà rientrano nell'unico consenso. Cambiare il testo della casella o i campi registrati richiede una nuova versione del consenso: decisione dell'autore.

## 4 — «Sistema» tagliato nel selettore del tema a 360
Esito: corretto nel componente condiviso `Segmenti`: sotto i 400 px di finestra l'icona delle voci si nasconde, restano le parole.
File: `app/src/screens/extra/ui.tsx`.
Verifica: 360x740 chiaro e scuro, Impostazioni: nessuna etichetta con scrollWidth > clientWidth («Sistema», «Chiaro», «Scuro» interi). Schermata imp-360-dark.png nello scratchpad.

## 21 — Esporta senza conferma
Esito: corretto: avviso «Copia salvata: addiofa_progressi.json, nei download.»
File: `app/src/App.tsx`. Verifica: Playwright, download avvenuto e testo dell'avviso letto in `[role=status]`.

## 64 — avvisi sopra la finestra Cancella
Esito: corretto: gli avvisi stanno sotto le finestre (z-40 contro z-50) e ne resta uno solo alla volta.
File: `app/src/components/Toast.tsx`. Verifica: con un avviso aperto, `elementFromPoint` al centro di Annulla e Cancella cade sui pulsanti della finestra.

## 82 — fuoco iniziale sul pulsante distruttivo
Esito: corretto in `ConfirmDialog` (condiviso da simulazione, sfida, impostazioni): il fuoco va su Annulla / Resta / Torna alle domande.
File: `app/src/components/ConfirmDialog.tsx`. Verifica: Impostazioni → Cancella i dati: `document.activeElement` = «Annulla».

## 91 — avvisi che si accumulano, importazione senza conferma, interruttore 51x31, × degli avvisi 22x28
Esito: corretto. Un avviso alla volta (il nuovo sostituisce il vecchio); «Sostituire i progressi?» prima di importare; interruttore Suoni con area di tocco 51x44; × degli avvisi 44x44.
File: `app/src/components/Toast.tsx`, `app/src/App.tsx`, `app/src/screens/Impostazioni.tsx`.
Verifica: 360 chiaro e scuro: importato un file valido → compare la finestra «Sostituire i progressi?»; interruttore misurato 51x44.

## 5, 71 — intestazione della landing a 360 e bersagli piccoli
Esito: corretto. Sotto i 380 px il marchio scende a 24 px (minimo leggibile del marchio); logo, «Inizia il test», voci del menu desktop alti 44 px; menu e «Inizia» non si schiacciano (shrink-0). «Fonte e regole» e «Privacy» (FAQ) alti 44 px; «Chiudi» dei fogli della landing 44x44.
File: `app/src/screens/landing/Barra.tsx`, `Perche.tsx`, `Faq.tsx`, `comune.tsx`.
Verifica: 360, 390, 1280: logo 144x44 (360) / 169x44, «Apri il menu» 44x44, «Inizia il test» 110x44 dopo l'hero, voci desktop 44 px, «Fonte e regole» 128x44. Schermata landing-360.png: niente sovrapposizioni.

## 6 — menu della landing non si chiude con Esc o tocco fuori
Esito: corretto (Esc chiude e rimette il fuoco sul pulsante; pointerdown fuori dall'intestazione chiude).
File: `app/src/screens/landing/Barra.tsx`. Verifica: 360 e 390, dopo Esc e dopo un tocco fuori `#menu-landing` non c'è più.

## 7 — il test di livello non avvisa delle domande «Su di te»
Esito: corretto (avviso prima): «10 domande e una stima subito dopo. Fra una domanda e l'altra ti chiediamo anche email PoliMi, corso e il consenso a termini e privacy.» L'ordine sparso resta (decisione dell'autore del 17-18/10).
File: `app/src/components/Onboarding.tsx`. Verifica: testo letto nella schermata «Arrivi al test».

## 8, 50 (in parte), 76, 77 — «Che corso frequenti?»: anno che compare sotto il dito, salto del campo di ricerca, voce scelta sotto la sfumatura
Esito: corretto. La domanda «In che anno sei?» c'è fin dall'inizio nello stesso posto (prima del corso: riquadro «Prima tocca il tuo corso qui sopra», poi le pillole); l'etichetta è ora 15 px, testo pieno. L'elenco dei corsi ha una quota fissa dello spazio (3 a 1 con il disegno), quindi cercando il campo non si sposta; la voce scelta scorre in vista.
File: `app/src/components/Onboarding.tsx`, `app/src/screens/extra/progetto/registrazione.tsx` (ElencoCorsi con `className`).
Verifica: 390 chiaro e 360 scuro: y del campo di ricerca 300.5 → 300.5 (390) e 274.5 → 274.5 (360) scrivendo «xyzzz»; schermata corso-dark-1.png con «Non trovo il mio corso» scelto e in vista e gli anni sotto.
Non fatto (50): altezza delle opzioni del test (fino a 104 px) contro 64 px nel profilo: è il disegno voluto delle domande del test (riempiono lo spazio), non cambiato.

## 9, 74 — «Continua» spento senza spiegazione; «Come li usiamo» alto 18 px
Esito: corretto. Sotto il pulsante: «Spunta «Termini e privacy» per continuare.» e, in «Da dove parti», «Rispondi alle due domande per continuare.». «Come li usiamo», «Informativa completa» e il nuovo «Termini» sono alti 44 px.
File: `app/src/components/Onboarding.tsx`, `app/src/screens/extra/progetto/registrazione.tsx`.
Verifica: Playwright 390: riga d'aiuto presente con la casella spenta; «Come li usiamo» 111x44, «Termini» 54x44.

## 10 — «e altri 1 argomento»
Esito: corretto: «e un altro argomento» al singolare. File: `app/src/components/Onboarding.tsx`. Verifica: lettura del codice (caso con 4 argomenti sbagliati non forzabile in modo affidabile con domande casuali).

## 22, 68, 78 — informativa completa che fa perdere il percorso; Esc; indice e link
Esito: corretto. Termini e Informativa si aprono dentro il percorso (al posto del passo, che resta montato): Indietro o Esc tornano a «Termini e privacy» con risposte, email e corso intatti. Aggiunto il link diretto «Termini». La pagina legale si chiude anche con Esc; le voci dell'indice sono alte 44 px.
File: `app/src/components/Onboarding.tsx`, `app/src/screens/Legal.tsx`, `app/src/screens/extra/progetto/registrazione.tsx`.
Verifica: Playwright 390 chiaro: Come li usiamo → Informativa completa (testo «un solo consenso» presente, «tre consensi» assente) → Esc → titolo «Termini e privacy», poi il percorso continua fino al risultato.

## 56 — doppio clic su «Continua» risponde alla domanda 9
Esito: corretto: per 300 ms dopo ogni cambio di schermata i tocchi sulle risposte si ignorano.
File: `app/src/components/Onboarding.tsx`. Verifica: doppio clic su Continua dopo il consenso → «Domanda 9 di 10» (prima: 10 di 10).

## 57 — ricarica sul risultato perde la stima
Esito: corretto: il risultato del test (onboarding) si salva appena compare.
File: `app/src/components/Onboarding.tsx`. Verifica: F5 sul risultato → Home «Ciao, Mario Rossi · 1% Probabilità stimata» (prima: «Nessuna stima»).

## 70 (e 22, seconda parte) — ricarica a metà percorso
Esito: corretto: passo, domande, risposte e dati si tengono in sessionStorage (`addiofa_percorso_in_corso`) e App riapre il percorso dopo una ricarica; il consenso non si conserva (va rispuntato). Arrivati al risultato la chiave si toglie.
File: `app/src/components/Onboarding.tsx`, `app/src/App.tsx`. Verifica: F5 su «Domanda 3 di 10» → stessa domanda, stesso passo.

## 72 — prima schermata del percorso senza Indietro
Esito: corretto: freccia Indietro verso la landing (solo per chi non ha ancora fatto il test). File: `Onboarding.tsx`, `App.tsx`. Verifica: pulsante «Indietro» presente su «Se non superi l'OFA di inglese».

## 73, 80 (Chiudi) — «Chiudi» dei fogli 36x36 / 34x40
Esito: corretto: Chiudi 44x44 nei fogli della landing e del percorso (InfoFoglio), in «Come viene calcolata la stima» e nel foglio di condivisione.
File: `app/src/screens/landing/comune.tsx`, `app/src/components/FoglioStima.tsx`, `app/src/screens/extra/sfide/FoglioCondividi.tsx`. Verifica: lettura delle classi (h-11 w-11) e misura nel foglio della landing.
Non fatto (80, prima parte): le righe «Da dove cominciare» non sono state rese cliccabili (servirebbe decidere quale lezione aprire per argomento).

## 75 — fuoco dopo una risposta nel test
Esito: corretto per il test di livello: il fuoco va sul titolo della nuova domanda (un secondo Invio non risponde da solo). Non toccati allenamento e simulazione (anello di fuoco 1 px): vedi voce 75 bis più sotto se ripresa.
File: `app/src/components/Onboarding.tsx`.

## 12, 38, 60, 81 — allenamento: «Riprova» con la giusta già in vista; doppio clic su «Sicuro»; «Leggi tutto» 79x40
Esito: corretto. Dopo un errore l'azione principale è «Avanti» (o «Vedi com'è andata»); «Riprova questa domanda» resta sotto come collegamento (44 px). Per 400 ms dopo l'esito i tocchi sui pulsanti dell'esito si ignorano. «Leggi tutto» alto 44 px.
File: `app/src/components/LearnMode.tsx`.
Verifica: 390 scuro, doppio clic su «Sicuro» con risposta sbagliata: l'esito resta («Non è questa», spiegazione, Rivedi la teoria / Avanti / Riprova questa domanda). Schermata allen-esito-dark.png.

## 13, 81 — timer mai annunciato; Esci senza conferma; Esc
Esito: corretto. Home e Esercizi dicono «10 domande, 30 secondi l'una»; X ed Esc a sessione iniziata chiedono «Uscire dall'allenamento?» (Resta / Esci: le risposte sono già nei progressi, si perde il riepilogo). Esc dentro la finestra la chiude.
File: `app/src/components/LearnMode.tsx`, `app/src/components/home/stato.ts`, `app/src/screens/Esercizi.tsx`, `app/src/components/ConfirmDialog.tsx`.
Verifica: Esc in allenamento → finestra; Esc nella finestra → chiusa; «Esci» nella finestra → si torna alla lezione.
Non fatto (81): la ricarica perde la sessione di allenamento (le risposte sono comunque già salvate nei progressi).

## 20 — «Allenamento consigliato / Inizia» contro «Continua l'allenamento»
Esito: corretto: il pulsante di Esercizi usa la stessa etichetta della Home («Continua l'allenamento» con la stima, «Inizia ad allenarti» senza). Il titolo della carta resta «Allenamento consigliato».
File: `app/src/screens/Esercizi.tsx`.

## 29, 63 — Rivedi la teoria dal risultato della simulazione → Indietro porta alla Home
Esito: corretto. La teoria aperta da allenamento o simulazione si mostra sopra la sessione, che resta montata: Indietro torna al risultato con le correzioni (stessa posizione).
File: `app/src/App.tsx`.
Verifica: 390 chiaro: consegna → Rivedi la teoria → Indietro → «Risultato · 0/30»; in allenamento Rivedi la teoria → Indietro → stessa domanda con l'esito.

## 30, 41 — allenamento aperto da una lezione / simulazione aperta da Simulazioni: X porta alla Home
Esito: corretto: esercizi e simulazioni aperti da una schermata tornano lì (lezione, Simulazioni, Esercizi); dalla Home tornano alla Home.
File: `app/src/App.tsx`. Verifica: lezione Present Simple → Esercizi → Esci → «Present Simple»; Simulazioni → Inizia → X con 0 risposte → «Simulazioni».

## 32 — contrasto delle opzioni spente e dei pulsanti di sicurezza spenti
Esito: corretto: niente più trasparenza; testo e lettera in `testo-tenue` pieno (token della palette pensato per ≥ 4,5:1 su superficie-2).
File: `app/src/screens/extra/studio/comune.tsx` (OpzioneRisposta, condivisa con la simulazione), `app/src/components/LearnMode.tsx`.
Verifica: schermata allen-esito-dark.png (B e C leggibili). Rapporto non rimisurato con lo strumento degli ispettori.

## 15, 42 (etichetta), 83, 84 (in parte), 85 — sfida del giorno: «— 10» senza etichetta, bersagli, uscita, ricarica
Esito: corretto in parte. Il numero ora dice «10 senza risposta» / «Tutte con risposta»; X 44x44, «Consegna» alto 44, frecce 44x44, puntini con area alta 44 px; nella finestra «Torna alle domande» invece di «Continua»; a sfida iniziata ricaricare o chiudere la scheda chiede conferma al browser (beforeunload).
File: `app/src/screens/extra/sfide/SfidaGioco.tsx`.
Verifica: 390 chiaro: Esci 44x44, Consegna 94x44, puntini 18x44, testo «10 senza risposta».
Non fatto: un componente di quiz unico per sfida e simulazione (42, 84) è un rifacimento, non una correzione minima; la sfida del giorno lasciata a metà si può ancora rigiocare (decisione di gioco: la finestra d'uscita lo dice già, «Potrai rigiocarla da capo»).

## 18, 62 — simulazione: Consegna 94x40, ricarica che perde la prova
Esito: corretto in parte: «Consegna» alto 44 px; a prova iniziata ricaricare o chiudere la scheda chiede conferma (beforeunload). Non fatto «Riprendi»: le sessioni d'esame vivono solo in memoria nel provider (`access/localProvider.ts`), riprenderle richiede cambiare il contratto del provider.
File: `app/src/components/ExamMode.tsx`. Verifica: Consegna misurata 94x44.

## 61 — spiegazione che cita un «suggerimento» che non c'è
Esito: non corretto (contenuti delle domande, fuori da questo giro). Trovate 4 spiegazioni in `contenuti/spiegazioni/q241-q330.json` che citano il suggerimento tolto dai testi da `contenuti/strumenti/ripulisci-prompt.py`: q253, q258, q259, q261. Da correggere nei contenuti e rigenerare con `npm run contenuti`.

## 27 — «meno di 1 min» che sborda
Esito: corretto: «< 1 min». File: `app/src/lib/profilo/giorni.ts` (e la prova unitaria in `app/tests/unit/profilo-giorni-obiettivi.test.ts`).

## 35 (in parte), 51, 90 — barra in basso in Riepilogo e Impostazioni; doppia × nella ricerca
Esito: corretto: Riepilogo di grammatica ha la barra (voce Esercizi attiva) come Frasi utili; Impostazioni ha la barra senza voce attiva, come Profilo; la × nativa dei campi di ricerca è nascosta in Riepilogo e Frasi e la × dell'app è 44x44.
File: `app/src/App.tsx`, `app/src/components/CheatSheet.tsx`, `app/src/screens/extra/studio/Frasi.tsx`.
Non fatto (35): padding di Esercizi contro Sfide e larghezza delle colonne (392/430 px) a 1280: vedi 33.

## 54, 55 — indietro del browser che esce dal sito; indirizzo che non segue la navigazione
Esito: corretto. Ogni cambio di schermata aggiunge una voce di cronologia con l'indirizzo della schermata (`?vista=…` per le schermate extra, `/` per Home, Esercizi e le altre); `popstate` riporta alla schermata precedente dell'app (stessa logica del tasto indietro di Android). Dentro allenamento, simulazione, sfida e percorso iniziale l'indietro del browser non chiude nulla (si esce con la X o la freccia, che chiedono conferma dove serve). Il link di sfida non si rimette nell'indirizzo.
File: `app/src/App.tsx`.
Verifica: 390 chiaro, stato pieno: Home → Tutte le lezioni (`?vista=percorso`), Esercizi, Sfide (`?vista=sfide`), Profilo (`?vista=profilo`) → `go_back()` → Home in tutti e 4 i casi (prima: about:blank). `?vista=frasi` → Indietro → indirizzo `/`, ricarica → Home (prima: di nuovo Frasi utili).

## 97 — vista inesistente apre la Home in silenzio
Esito: corretto: `?vista=nonesiste` apre la stessa schermata di `?vista=stato-vuoto` («Questa pagina non esiste»). Per un utente nuovo resta la landing.
File: `app/src/App.tsx`.

## 16 — Condividi dice «Niente da condividere» con una simulazione nello storico
Esito: corretto: senza parametri propone l'ultima simulazione («La tua ultima simulazione: 21/30.» e il testo da mandare con il link dell'app).
File: `app/src/screens/extra/sfide/Condividi.tsx`.

## 14, 43 — «Crea link» che non crea il link; nome chiesto di nuovo
Esito: corretto in parte. Il pulsante dice «Gioca e crea il link» e la frase sopra spiega l'ordine. Il nome NON si precompila con quello dell'iscrizione: l'Informativa (§ minori e sfide) chiede di usare un nome di fantasia nei link di sfida, perché il nome finisce nel link. Il campo ora si chiama «Il nome che vede il tuo amico» / «Il nome che vede chi ti sfida», segnaposto «Anche un soprannome»; il nome usato una volta resta salvato (comportamento già esistente).
File: `app/src/screens/extra/sfide/Sfide.tsx`, `SfidaAccetta.tsx`.

## 67 — «Novità da Project e Agorà» apre Project ID
Esito: corretto (rinominata): «L'email per le novità», con sottotitolo che dice che le novità arrivano all'email dell'iscrizione, visibile in Project ID.
File: `app/src/screens/extra/progetto/Agora.tsx`.

## 98 — NOI: «Alla classifica arrivano solo se aderisci» senza modo di aderire
Esito: corretto: la frase compare solo negli stati in cui si può aderire (da accedere, da aderire).
File: `app/src/screens/extra/progetto/Noi.tsx`.

## 96 — Segnala: destinazione solo nel foglio (i)
Esito: corretto: «Copia il testo e mandalo tu al contatto da cui hai conosciuto AddiOFA.» accanto al testo pronto.
File: `app/src/screens/extra/servizi/Segnala.tsx`.

## 47 (in parte), 100 — pagina Iscrizioni: Invio, pulsanti spenti senza motivo
Esito: corretto in parte: i campi stanno in un form (Invio scarica tutte le iscrizioni) e sotto c'è «Scrivi la password (almeno 8 caratteri) per scaricare». Non fatto: nasconderla o separarla dall'app (decisione dell'autore: la pagina non è in nessun menu e senza password non fa nulla).
File: `app/src/screens/extra/servizi/Admin.tsx`.

## 49 — pulsanti spenti senza dire cosa manca
Esito: corretto: una riga d'aiuto sotto «Salva» (Modifica profilo), «Prepara il testo» (Segnala: «Scrivi almeno 5 caratteri…»), «Apri la sfida» («Incolla il link che ti hanno mandato.»), «Inizia con questo argomento» («Scegli prima un argomento dall'elenco.»).
File: `ProfiloModifica.tsx`, `Segnala.tsx`, `Sfide.tsx`, `app/src/screens/Esercizi.tsx`.

## 17, 26, 66 — A1 «0 di 116» / «0 di 192» / «0 di 11» senza unità
Esito: corretto (etichette distinte, stessa definizione). Le cifre non sono in conflitto: 192 sono le domande A1, 116 è il 60 % che serve per raggiungere il livello (Profilo e Badge), 11 sono le lezioni A1. Ora: Profilo «0 di 116 domande», Progressi «0 di 192 domande imparate» con la riga «Un livello si raggiunge imparando il 60 % delle sue domande: è il numero che contano Profilo e Badge.», Percorso «0 di 11 lezioni imparate». Nel foglio della stima «Le 45 risposte della stima» (sono quelle di test di livello e simulazioni, non le risposte di Progressi).
File: `Profilo.tsx`, `PanoramicaProgressi.tsx`, `app/src/screens/extra/studio/Percorso.tsx`, `app/src/components/FoglioStima.tsx`.

## 93 — giorni di studio diversi; «1 giorni»
Esito: corretto (etichette): Calendario «1 giorno di studio su 7», Obiettivi «Obiettivo raggiunto 0 giorni su 7 questa settimana» (contano cose diverse: giorni con studio contro giorni con l'obiettivo di minuti raggiunto). La scheda Argomenti vuota dice già la causa («Servono tre risposte su un argomento per vederlo qui.»).
File: `ProgressiCalendario.tsx`, `Obiettivi.tsx`.

## 31 — ATLAS: Piano con «punto più debole» e «Priorità alta» su 1 risposta
Esito: corretto: sotto le 3 risposte per argomento (la soglia della scheda Argomenti) il Piano dice «Prime indicazioni: hai meno di 3 risposte per argomento. Per ora parti da …» e l'etichetta è «Poche risposte», non «Priorità alta».
File: `app/src/screens/extra/progetto/AtlasAnalisi.tsx`.

## 65 — «Verifica con un link» con il metodo non abilitato
Esito: corretto in parte: dopo la risposta «auth/operation-not-allowed» il pulsante non si offre più in questa scheda (sessionStorage), il messaggio resta visibile. La prima richiesta parte comunque: l'app non può sapere prima se il metodo è abilitato nel progetto Firebase.
File: `app/src/lib/firebase.ts`, `app/src/screens/extra/progetto/ProjectId.tsx`.

## 19, 48 (in parte), 94, 99 — bersagli sotto i 44 px
Esito: corretto per: icona Profilo (Home, Esercizi, Sfide: area 44, cerchio 36 come prima), «i» della stima 44x44, «i» di Andamento 44x44, voci Home/Esercizi/Sfide della barra desktop 44, filtri FAQ 44, interruttore Suoni 51x44, Chiudi dei fogli, voci dell'indice legale, «Come li usiamo», «Perché da verificare» (area 44, pillola com'era), puntini e pulsanti della sfida, Consegna.
File: `app/src/screens/extra/ui.tsx` (TestataScheda, FiltriChip), `app/src/components/Menu.tsx`, `app/src/components/home/Misuratore.tsx`, `GraficoStime.tsx`, più i file delle voci già elencate.
Non toccato: anello di fuoco 1 px in allenamento/simulazione (75): resta l'anello predefinito del browser.

## 95 — filtri FAQ fuori schermo
Esito: corretto: i filtri vanno a capo (nessuno nascosto) e sono alti 44 px. File: `app/src/screens/extra/ui.tsx` (FiltriChip, usato solo dalla FAQ).

## 86 — fogli senza fuoco; frecce sui gruppi role=radio
Esito: corretto: FoglioInfo porta il fuoco sul primo campo (o su Chiudi) e alla chiusura lo rimette dov'era; Segmenti e FiltriChip gestiscono le frecce come i radio nativi (fuoco solo sulla voce scelta, Tab entra ed esce dal gruppo).
File: `app/src/screens/extra/ui.tsx`.

## 11 — «Da dove cominciare» del risultato contro «Prossima lezione» della Home
Esito: corretto con una spiegazione (l'ordine del percorso è una decisione di prodotto e non è cambiato): sotto «Prossima lezione» la Home dice «Il percorso va in ordine, dalla prima lezione non imparata. Gli argomenti da ripassare sono in «Le tue aree».»
File: `app/src/components/home/Lezione.tsx`.

## 39 — «Da evitare» nello stesso blu delle forme corrette
Esito: corretto: nelle trappole del Riepilogo le parole in evidenza sono rosse e barrate (`RichText` con `errore`).
File: `app/src/components/ui.tsx`, `app/src/components/CheatSheet.tsx`.

## 40, 87 — «Come sei andato per argomento» con una riga sola «Grammatica»
Esito: corretto: con una sola categoria il blocco si divide per livello («Come sei andato per livello»: Livello A1, A2, B1). I 30 «Rivedi la teoria» hanno ora il nome accessibile con l'argomento («Rivedi la teoria: Present Simple»).
File: `app/src/components/esito/EsitoSimulazione.tsx`, `app/src/components/esito/CorrezioniComplete.tsx`.

## 44, 89 — dettaglio lezione e teoria: riquadri numerici senza parola, Verifica che sembra un pulsante, Indietro 40x40
Esito: corretto. Tolto il riquadro «1» in alto nel dettaglio (sotto il titolo c'è già «Lezione 1 di 31»); nella teoria accanto al livello c'è «Lezione N di 31»; la riga Verifica è un riquadro tratteggiato senza fondo con «Verifica · domande imparate»; la riga della lezione dopo dice «Lezione successiva»; Indietro della teoria 44x44. Teoria (›) ed Esercizi (▶, l'unica azione primaria) restano come da concept.
File: `app/src/screens/extra/studio/LezioneDettaglio.tsx`, `app/src/screens/Theory.tsx`.
Verifica: schermata lezione-400.png.
Non fatto (89): selettore dell'argomento alto 37 px nella teoria (non trovato con certezza nel codice in questo giro).

## 45 — teoria: successiva prima della precedente, senza parole
Esito: corretto: ordine Precedente → Successiva, ognuna con la sua parola visibile sopra il titolo.
File: `app/src/screens/Theory.tsx`.

## 46 — «21» sovrapposto alla linea «Soglia 25»
Esito: corretto: l'asse era già 0-30; quando il numero toccherebbe la linea della soglia si scrive dentro la colonna.
File: `app/src/screens/extra/profilo/PanoramicaProgressi.tsx`. Verifica: schermata progressi-400.png (stato pieno, 21/30).

## 52 — nome accessibile diverso dal testo visibile
Esito: corretto: filtri delle correzioni «Sbagliate 18» (spazio fra parola e numero), righe della lezione senza aria-label (nome = testo visibile, «, fatto» solo per lettori di schermo).
File: `CorrezioniComplete.tsx`, `LezioneDettaglio.tsx`. Verifica: `get_by_role('button', name='Esercizi 5 min')` trova 1 elemento.

## 33, 34, 35 (resto), 36, 37, 42/84 (componente unico), 53, 88 — impaginazione desktop/tablet, componenti unici, selettore di data
Esito: non corretto. Sono rifacimenti di impaginazione o di componenti (barra in alto e griglia desktop su tutte le pagine, uso della larghezza da 768 px, una sola regola di sfondo della colonna, un indicatore di probabilità unico, un quiz unico per sfida e simulazione, un selettore di data al posto dei select nativi), non correzioni minime: servono una decisione di disegno e un giro dedicato. Annotati qui per il prossimo giro.

## 75 (resto), 80 (prima parte), 81 (ricarica), 47 (separare la pagina)
Esito: non corretto, motivi nelle voci sopra.

## Verifica finale di questo giro
- Playwright, Chromium, 400x860 e 1280x800, chiaro e scuro, 20 viste (Home, Profilo, Modifica profilo, Progressi, Badge, Percorso, Lezione, Sfide, Condividi, Agorà, NOI, FAQ, Segnala, Iscrizioni, ATLAS, Obiettivi, Project ID, vista inesistente, Frasi, Simulazioni) più Impostazioni: zero errori in console, nessuno scorrimento orizzontale.
- Percorso iniziale completo a 390 chiaro (ricarica a metà, informativa e ritorno, doppio clic, risultato e ricarica): vedi voci 22, 56, 57, 70.
- Lint e prove: vedi in fondo.

## Lint e prove (fine giro)
- `npm --prefix app run lint` (tsc --noEmit): passa.
- `npm --prefix app test`: 317 prove, 313 passate, 0 fallite, 4 saltate. Adattata una prova al nuovo testo «< 1 min» (`app/tests/unit/profilo-giorni-obiettivi.test.ts`).
- Non eseguito: `npm run check` completo dalla radice (link e build demo).
