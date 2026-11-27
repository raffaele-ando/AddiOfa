# Giro 2: interazioni e stati limite (tastiera, indietro, ricarica, vuoti, errori, offline, campi, fogli)

Ispezione con Playwright/Chromium su `app/dist` (vite preview :4303), viewport 390x844 e 1280x800, tema chiaro e scuro. Schermate in `scratchpad/ux/giro-2/interazioni-e-stati/`.

## Landing (stato vuoto, localStorage pulito) — 390x844 chiaro

- Nessun errore in console, nessuno scorrimento orizzontale (scrollWidth 390 = clientWidth 390).
- Tab: ordine logico (logo, menu, CTA, «Vai all'app senza test», sezioni, FAQ, piè di pagina); anello di fuoco visibile (2 px blu o bianco sui blocchi blu). Menu ad hamburger: si apre, il fuoco va su «Chiudi il menu», Esc lo chiude e riporta il fuoco su «Apri il menu». Le voci del menu portano alla sezione e spostano il fuoco sul titolo H2: bene.

### Problema L1 — titolo di sezione invisibile quando si arriva con Tab
- Schermata: landing, sezione «Prima del test». Viewport 390x844, tema chiaro.
- Gravità: media.
- Cosa succede: premendo Tab dal CTA dell'hero si salta al pulsante «Inizia il test di livello» della sezione OFA; la pagina scorre di colpo e il titolo «Cos'è l'OFA di inglese?» resta a opacità 0 (rivelazione allo scorrimento mai scattata): si vede il riquadro con il pulsante a fuoco ma non il titolo della sezione. Con Shift+Tab di ritorno resta uno spazio vuoto tra «PRIMA DEL TEST» e il paragrafo. Ricompare solo scorrendo con la rotella.
- Come riprodurre: localStorage pulito, `/`, premere Tab 5 volte, attendere 2 s; `getComputedStyle(h2).opacity === '0'`.
- File: `landing-tab5-titolo-invisibile-390-light.png`, `landing-shifttab-390-light.png`.
- Proposta: rivelare anche su `focusin` dentro la sezione (o al primo Tab rivelare tutto), oppure non nascondere i titoli H2.

## Percorso iniziale: «Se non superi l'OFA di inglese» — 390x844 chiaro

### Problema O1 — CTA «Scopri a che punto sei» senza anello di fuoco visibile
- Gravità: alta (accessibilità da tastiera: non si vede dove si è).
- Cosa succede: con Tab sul pulsante blu principale l'outline calcolato è `auto 1px rgb(255,255,255)` e nello scatto non si vede alcun anello (pagina chiara). Nella landing invece gli stessi CTA hanno anello 2 px blu con offset. Anche «Indietro» usa l'outline di sistema (`auto 1px`), diverso dalla landing.
- Riproduzione: `/` → «Inizia il test di livello» → Tab ×3.
- File: `onb-conseguenze-fuoco-cta-390-light.png`.
- Proposta: usare la stessa classe `focus-visible:outline-2 outline-offset-2 outline-azione` della landing per tutti i pulsanti del percorso iniziale.

### Problema O2 — foglio «OFA di inglese» (i): il fuoco resta fuori dal foglio
- Gravità: media.
- Cosa succede: il foglio ha `role=dialog aria-modal=true`, ma all'apertura il fuoco resta sul pulsante (i) dietro lo sfondo scuro; il primo Tab va su «Scopri a che punto sei» (coperto dal velo), poi su «Chiudi», poi sul body e sui pulsanti sotto. Nessuna trappola del fuoco. Esc chiude correttamente e il fuoco torna su (i).
- Riproduzione: percorso iniziale → (i) → Tab.
- File: `onb-info-aperto-390-light.png`, `onb-info-tab-390-light.png`.
- Proposta: spostare il fuoco su «Chiudi» o sul titolo all'apertura e contenerlo nel foglio finché è aperto.

### Problema O3 — «30 €» va a capo con il simbolo da solo
- Gravità: bassa. «Un nuovo tentativo costa circa 30 / €»: il simbolo dell'euro finisce da solo sulla riga successiva a 390 px. File: `onb-conseguenze-fuoco-cta-390-light.png`. Proposta: spazio indivisibile tra numero e €.

### Problema O4 — il pulsante Indietro del browser non fa nulla nel percorso iniziale (e non fa uscire)
- Schermata: percorso iniziale («Se non superi…», «Arrivi al test sapendo a che punto sei», «Da dove parti»). 390x844 chiaro.
- Gravità: alta (azione che non funziona).
- Cosa succede: l'URL resta sempre `/`. Partendo da `about:blank` → `/` → «Inizia il test di livello» → «Scopri a che punto sei», premere Indietro del browser 4 volte: la pagina resta su «Arrivi al test sapendo a che punto sei», `history.length` resta 3 e non si torna né al passo precedente né alla pagina da cui si veniva. Il pulsante «<» in alto invece torna correttamente al passo precedente.
- File: `onb-dopo-indietro-browser-390-light.png`.
- Proposta: un `pushState` per passo e `popstate` che torna al passo precedente (come «<»); dal primo passo lasciare uscire.

### Problema O5 — radio «Hai l'OFA?» / «Hai una certificazione?»: frecce non funzionano
- Gravità: media. Le opzioni hanno `role=radio` dentro un `radiogroup`, ma ognuna è una fermata di Tab (tabIndex 0 per tutte) e ArrowRight non sposta né seleziona. Lo schema ARIA dei radio prevede una sola fermata di Tab e le frecce. L'anello di fuoco è quello di sistema (`auto 1px`), poco visibile sulle pillole chiare.
- Riproduzione: «Da dove parti» → Tab ×2 → ArrowRight. File: `onb-dadoveparti-scelte-390-light.png`.
- Proposta: tabindex mobile (roving) e frecce, oppure `role=button aria-pressed`.

### Diagnostico: domande
- Doppio clic su una risposta avanza di una sola domanda (bene). File: `onb-q1-dopo-dblclick-390-light.png`.

### Problema O6 — «Verifica con un link» fallisce in silenzio (400 in console)
- Schermata: percorso iniziale, passo «La tua email PoliMi». 390x844 chiaro.
- Gravità: alta (azione che non funziona, errore in console, nessun messaggio).
- Cosa succede: con email valida e nome scritto, «Verifica con un link» invia `POST identitytoolkit.googleapis.com/v1/accounts:sendOobCode` che risponde 400 `OPERATION_NOT_ALLOWED`; in console «Failed to load resource: … 400». Il pulsante sparisce, nessun messaggio né di conferma né di errore (la regione `role=status` resta vuota per 4 s). L'utente crede che il link sia partito.
- Riproduzione: test iniziale → 2 domande → email `m.rossi12@mail.polimi.it`, nome `Mario` → «Verifica con un link».
- File: `onb-verifica-link-390-light.png` (dopo il clic: il pulsante non c'è più, nessun avviso).
- Proposta: mostrare l'esito («Link inviato a …» oppure «Non riesco a inviare il link adesso: puoi continuare, l'email resta da verificare») e non nascondere il pulsante se l'invio fallisce.

### Problema O7 — campo email: messaggio d'errore non collegato al campo, fuoco non torna al campo
- Gravità: media. Con email vuota o sbagliata e clic su «Continua», compare «Scrivi la tua email del Politecnico.» / «L'indirizzo non sembra corretto.» e `aria-invalid=true`, ma il campo non ha `aria-describedby` verso il messaggio e il fuoco resta sul pulsante. Il bordo del campo in errore resta blu, non rosso. Con Invio invece funziona (fuoco nel campo). Prima pressione di Invio con email valida mostra «Ciao Mario Rossi» e non avanza: serve un secondo Invio.
- File: `onb-email-0-390-light.png`, `onb-email-1-390-light.png`, `onb-email-3-390-light.png`.
- Proposta: `aria-describedby` sul messaggio, fuoco sul campo in errore, bordo `errore`.

### Problema O8 — testo del foglio «Email da verificare»: «l'indirizzo resta «non verificata»»
- Gravità: bassa. Concordanza (indirizzo… verificata). File: `onb-da-verificare-390-light.png`.

### Passi «Su di te» (fonte, scuola, sede, laurea, corso, anno)
- Le sedi dipendono dalla scuola (Industriale → anche Bovisa e Cremona; Design → Bovisa, Lecco), i corsi dipendono da sede e laurea: coerente. Ricarica a metà (domanda 3) riprende dalla stessa domanda: bene. Doppio clic su «1°» non salta la domanda successiva: bene.
- Le voci «1°/2°/3°» sono `role=radio` come quelle di «Da dove parti» (stesso limite di O5).

### Problema O9 — Termini/Informativa aperti dal percorso: il pulsante «Indietro» è nascosto sopra lo schermo
- Schermata: percorso iniziale, passo «Termini e privacy» → «Termini»; anche landing → piè di pagina «Termini». 390x844 e 1280x800, chiaro.
- Gravità: media (su telefono non si vede come tornare: nessuna X, nessun «<» visibile; Esc funziona solo con la tastiera).
- Cosa succede: la pagina legale si apre con il contenitore interno già scorso di 64 px; il pulsante «Indietro» sta a y = −58 px, fuori dallo schermo. In cima si vedono solo le schede Termini/Privacy/Cookie. Compare solo scorrendo in su il contenitore. Il pulsante Indietro del browser non chiude la pagina legale aperta dal percorso iniziale (resta su «Termini di uso»). Nell'ordine di Tab «Indietro» arriva dopo l'indice, non per primo.
- Riproduzione: test iniziale fino a «Termini e privacy» → «Termini». `getBoundingClientRect()` di «Indietro»: y −58.
- File: `onb-termini-apre-Termini-390-light.png` (all'apertura), `onb-termini-rotella-su-390-light.png` (dopo aver scorso in su), `onb-termini-pagina-back-390-light.png`.
- Proposta: aprire con scrollTop 0 o tenere l'intestazione con «<» fissa; far chiudere la pagina legale anche con Indietro del browser.

### Passo «Termini e privacy»
- La casella non è preselezionata, «Continua» resta disabilitato con la riga «Spunta «Termini e privacy» per continuare.»; Spazio sulla casella la spunta (`aria-checked=true`). «Come li usiamo» apre un foglio (`role=dialog`) che si chiude con Esc; uscendo e rientrando dai Termini la spunta resta com'era. Bene.
- Stesso limite di O2: all'apertura del foglio «Come usiamo i tuoi dati» il fuoco resta sul pulsante dietro il velo.
- I link di testo «Come li usiamo» e «Termini» usano l'outline di sistema (`auto 1px`), non l'anello del resto dell'app.

### Esito del test iniziale
- «Come viene calcolata la stima» apre un foglio; qui il fuoco va sul titolo H2 del foglio (bene, diverso da O2). Esc chiude.
- Problema O10 — ricaricando la pagina sull'esito si finisce sulla Home: l'esito («Da dove cominciare», gli argomenti con errori, «e altri 6 argomenti») non si può più rivedere. Gravità: bassa/media. Riproduzione: completare il test iniziale → F5. File: `onb-risultato-390-light.png`, `onb-risultato-ricarica-390-light.png`. Proposta: ricordare l'ultimo esito e renderlo raggiungibile dalla Home o dai Progressi.
- Nessun errore in console nel percorso completo (a parte O6), nessuno scorrimento orizzontale a 390 e 1280.

### Verifica tema scuro e 1280 del percorso iniziale
- O1 confermato in scuro e a 1280: sul CTA «Scopri a che punto sei» l'outline è `auto 1px rgb(10,16,31)` (scuro su sfondo scuro): anello di fuoco invisibile. File: `onb-conseguenze-fuoco-cta-1280-dark.png`, `onb-conseguenze-fuoco-cta-390-dark.png`.
- Le schede di risposta delle domande mostrano un bordo bianco/scuro di 2 px quando hanno il fuoco: visibile in entrambi i temi (`onb-q1-fuoco-390-dark.png`).

## App con stato di prova (utente registrato, una simulazione 21/30)

### Home — 390x844 chiaro
- Tab: Profilo, (i) stima, «Continua l'allenamento», «Tutte le lezioni», 3 lezioni, simulazioni, (i) andamento, barra in basso. Anello 3 px azzurro semitrasparente; i pulsanti (i) usano l'outline di sistema `auto 1px` (incoerente). Nessun elemento coperto dalla barra in basso in fondo alla pagina (`home-fondo-390-light.png`). Nessun errore in console.

### Problema N1 — «Esercizi» non ha un indirizzo: ricarica e Indietro lo perdono
- Schermata: barra in basso, scheda Esercizi. 390x844 chiaro.
- Gravità: media.
- Cosa succede: Home → Esercizi lascia l'URL a `/` (mentre Sfide diventa `/?vista=sfide`, Profilo `/?vista=profilo`). Ricaricando su Esercizi si torna alla Home. Con Home → Esercizi → Sfide → Profilo, Indietro fa Profilo → Sfide → Home (salta Esercizi) e il passo successivo resta sulla Home (la voce di cronologia di Esercizi mostra la Home: una pressione di Indietro «a vuoto»).
- Riproduzione: `/` con stato di prova → Esercizi → F5; oppure la sequenza sopra con `history.back()`.
- File: `esercizi-390-light.png`.
- Proposta: `?vista=esercizi` come per le altre schede.

### Allenamento (Home → «Continua l'allenamento») — 390x844 chiaro
- Funziona: scelta → «Quanto sei sicuro?» → «Tirato a caso / Non del tutto / Sicuro» → riscontro con spiegazione, «Leggi tutto/Mostra meno», «Riprova questa domanda» (stessa domanda, l'opzione sbagliata resta disabilitata), «Rivedi la teoria» e «Indietro» dell'app tornano alla stessa domanda col riscontro. Timer da 30 s: a 0 s mostra «Tempo scaduto» con la risposta giusta (`allenamento-timer-scaduto-390-light.png`). Doppio clic su «Sicuro» non salta domande. Nessun errore in console. Esc apre «Uscire dall'allenamento?» con «Resta/Esci», un secondo Esc lo chiude.

### Problema A1 — doppio clic su «Vedi com'è andata» salta il riepilogo della sessione
- Schermata: allenamento, ultima domanda (10 di 10). 390x844 chiaro.
- Gravità: alta (porta nel posto sbagliato e il riepilogo si perde).
- Cosa succede: «Vedi com'è andata» sta a y 720–776; nel riepilogo, nello stesso punto, ci sono «Altre 10 domande» (y 720) e «Torna alla Home» (y 780). Il secondo clic del doppio clic finisce su questi: in una prova è partita subito una nuova sessione («Domanda 1 di 10»), in un'altra si è tornati alla Home. Il riepilogo («Sessione completata 5/10», «Da riprendere») non si vede mai.
- Riproduzione: completare le 10 domande → doppio clic su «Vedi com'è andata».
- File: `allenamento-dblclick-vedi-0-390-light.png` (nuova sessione), `allenamento-dblclick-vedi-1-390-light.png` (Home), `allenamento-riepilogo-390-light.png` (il riepilogo atteso).
- Proposta: ignorare i clic per ~400 ms dopo il cambio di schermata o spostare i pulsanti del riepilogo; mettere il fuoco sul titolo «Sessione completata».

### Problema A2 — Indietro del browser non fa nulla durante l'allenamento; ricarica perde la sessione senza avviso
- Gravità: media.
- Cosa succede: in sessione l'URL resta `/`; tre pressioni di Indietro non cambiano nulla (né domanda precedente, né dialogo «Uscire?», né Home). Dalla teoria aperta con «Rivedi la teoria», Indietro del browser non torna alla domanda (serve «<» dell'app). Ricaricando a metà (domanda 2) si torna alla Home senza conferma: la sessione e il riepilogo si perdono (le risposte restano nei progressi, come dice il dialogo di uscita).
- File: `allenamento-back-browser-390-light.png`, `allenamento-teoria-back-390-light.png`, `allenamento-ricarica-390-light.png`.
- Proposta: Indietro del browser = «Esci» con lo stesso dialogo; `beforeunload` o ripresa della sessione dopo la ricarica.

### Problema A3 — fuoco perso dopo la risposta; dialogo di uscita senza trappola del fuoco
- Gravità: media.
- Cosa succede: dopo aver scelto la fiducia il fuoco va sul `body` (chi usa la tastiera deve ripartire da capo con Tab). Nel dialogo «Uscire dall'allenamento?» il fuoco va su «Resta», ma Tab esce dal dialogo verso «Esci» in alto, «Leggi tutto», «Rivedi la teoria» sotto il velo; con il fuoco lì, Esc non chiude il dialogo. Le opzioni A–D e i pulsanti di fiducia usano l'outline di sistema `auto 1px`.
- File: `allenamento-feedback-390-light.png`, `allenamento-esc-dialogo-390-light.png`.
- Proposta: fuoco su «Avanti» o sul riquadro del riscontro dopo la risposta; trappola del fuoco nel dialogo.

### Riepilogo della sessione
- «Rivedi la teoria: …» sta sotto i due pulsanti fissi (y 939) ma scorrendo resta raggiungibile; nessun elemento coperto in fondo (`allenamento-riepilogo-fondo-390-light.png`).

## Simulazione d'esame (Home → «Fai un'altra simulazione») — 390x844 chiaro

- Funziona: scelta senza avanzamento automatico, «Domanda successiva/precedente», navigatore «Domanda 1 di 30» (foglio con Risposte/Saltate/Da vedere e griglia 1–30, fuoco su «Chiudi», Esc chiude), «Consegna» con dialogo «Vuoi consegnare ora? Mancano 29 risposte…» (fuoco su «Torna alle domande», Esc chiude), «Esci dalla simulazione» con «Uscire? Le risposte date andranno perse.» (senza risposte esce subito). Allo scadere dei 15 minuti (orologio accelerato) la prova si consegna da sola e l'esito dice «Tempo 15:00 su 15 min, Scaduto, 29 domande senza risposta. Contano come errori.» (`sim-tempo-scaduto-390-light.png`). Nessun errore in console.
- Esito: filtri Tutte/Sbagliate/Senza risposta/Giuste sono `role=tab` con frecce funzionanti; filtro vuoto mostra «Nessuna risposta giusta» (`sim-risultato-filtro-giuste-vuoto-390-light.png`). Foglio «Regole» si apre e si chiude con Esc.

### Problema S1 — doppio clic su «Consegna» nel dialogo fa partire subito una nuova simulazione
- Gravità: alta (porta nel posto sbagliato; l'esito appena consegnato non si vede).
- Cosa succede: il pulsante «Consegna» del dialogo (x 202–353, y 733–807) coincide con «Rifai la simulazione» dell'esito (y 742). Con un doppio clic la prova viene consegnata (lo storico passa da 1 a 2 simulazioni) e il secondo clic avvia una nuova simulazione: si vede «14:59 · 0 risposte su 30». L'esito non compare mai.
- Riproduzione: simulazione → rispondere a 1 domanda → «Consegna» → doppio clic su «Consegna» nel dialogo.
- File: `sim-dblclick-conferma-390-light.png`.
- Proposta: dopo la consegna ignorare i clic per ~400 ms o non mettere «Rifai la simulazione» sotto il pulsante di conferma; fuoco sul titolo «Risultato».

### Problema S2 — doppio clic su «Esci» nei dialoghi di uscita porta alla scheda Sfide
- Gravità: alta (porta nel posto sbagliato).
- Cosa succede: «Esci» del dialogo (x 202–353, y 757–807) sta sopra la voce «Sfide» della barra in basso della Home. Doppio clic su «Esci» in «Uscire dalla simulazione?» e in «Uscire dall'allenamento?» → si finisce su `/?vista=sfide` invece che sulla Home.
- File: `sim-dblclick-esci-390-light.png`, `allenamento-dblclick-esci-390-light.png`.
- Proposta: come S1 (stessa famiglia di A1): protezione dal secondo clic dopo un cambio di schermata.

### Problema S3 — ricarica o Indietro durante la simulazione: risposte e tempo persi senza avviso
- Gravità: alta (dati persi senza conferma).
- Cosa succede: dopo 3 risposte, Indietro del browser (2 volte) non fa nulla (resta sulla domanda, il tempo scorre). Ricaricando si torna alla Home: le risposte e il timer spariscono, nessun «Vuoi uscire?» del browser (c'è un listener `beforeunload` ma chiudendo la pagina con `run_before_unload` non compare alcun dialogo). Il dialogo dell'app stesso dice «Le risposte date andranno perse».
- File: `sim-back-browser-390-light.png`, `sim-ricarica-390-light.png`.
- Proposta: salvare la simulazione in corso (domande, risposte, ora di inizio) e riprenderla dopo la ricarica, oppure `event.preventDefault()` in `beforeunload` durante la prova; Indietro del browser = dialogo «Uscire dalla simulazione?».

### Esito della simulazione: ricarica
- Ricaricando sull'esito si torna alla Home (l'esito resta nell'elenco delle simulazioni). Indietro del browser sull'esito non fa nulla. Gravità bassa.

## Sfide — 390x844 chiaro

- Oggi/Amici/Classifica cambiano URL (`?vista=sfide/amici/classifica`) e Indietro del browser le ripercorre: bene. Stati vuoti: «Non hai ancora giocato sfide.», «Ancora nessun amico» con «Sfida un amico», «Nessuna classifica per ora · Nasce dalla prima sfida a due.» e «Classifica NOI · Non attiva su questo sito» (riga vera, non finge).
- «Ho ricevuto una sfida»: campo vuoto o `ciao` → «Link non riconosciuto.»; un link di un altro dominio con `?sfida=` viene accettato e porta alla pagina «Link non valido» con «Vai alle sfide» (`sfide-ricevuto-30-390-light.png`): accettabile.
- Duello: «Sfida un amico» con nome vuoto o solo spazi → «Scrivi il tuo nome.»; il nome è limitato a 20 caratteri. Gioco, consegna con dialogo «Consegnare adesso?», esito con «Condividi» (foglio WhatsApp/Telegram/Messaggi/«Copia il link» → «Link copiato.» annunciato in `role=status`). Campo «Link con il suo risultato» con testo sbagliato → «Link non riconosciuto.». Nessun errore in console.

### Problema F1 — pulsante (i) della scheda Classifica/Amici con etichetta uguale alla scheda
- Gravità: media (etichetta ambigua). Il pulsante (i) in alto ha `aria-label="Classifica"` nella scheda Classifica e `"Amici"` nella scheda Amici (in Oggi è «Regole delle sfide»): chi usa un lettore di schermo sente due «Classifica». Apre le regole della classifica. File: `classifica-390-light.png`, `classifica-info-390-light.png`. Proposta: «Come funziona la classifica».

### Problema F2 — selettore Oggi/Amici/Classifica: con le frecce il fuoco si perde
- Gravità: media. Le schede sono `role=radio` con tabindex mobile; ArrowRight su «Oggi» passa ad «Amici» (URL `?vista=amici`) ma il fuoco va sul `body`, quindi una seconda freccia non fa nulla. Proposta: dopo il cambio, rimettere il fuoco sulla voce scelta.

### Problema F3 — barra in basso cliccabile sopra i fogli modali
- Gravità: bassa/media. Con il foglio «Ho ricevuto una sfida» aperto (`aria-modal=true`), la barra Home/Esercizi/Sfide resta fuori dal velo, non oscurata e cliccabile: un tocco su «Home» chiude tutto e cambia scheda. File: `sfide-ricevuto-0-390-light.png`, `sfide-foglio-clic-barra-390-light.png`. Proposta: velo anche sopra la barra o barra `inert` mentre il foglio è aperto.

### Problema F4 — duello: indicatori «Vai alla domanda N» larghi 18 px; navigazione diversa dalla simulazione
- Gravità: media (bersaglio sotto 44 px; incoerenza tra schermate). Nel duello le 10 domande si scelgono con puntini larghi 18 px (alti 44); nella simulazione con la pillola «Domanda 1 di 30» che apre un foglio. File: `duello-domanda-390-light.png`, `sim-inizio-390-light.png`.

### Problema F5 — duello: ricarica a metà riporta all'introduzione e azzera risposte e tempo
- Gravità: media. Dopo una risposta, F5 riporta a «Duello · 10 domande · 5 minuti · Inizia la sfida» (stesso URL), le risposte e i secondi trascorsi si perdono e il cronometro riparte da 5:00. File: `duello-ricarica-390-light.png`.

### Problema F6 — «Il nome che vede il tuo amico» non è precompilato
- Gravità: bassa. Il profilo ha già «Mario Rossi», ma il campo parte vuoto e senza nome compare «Scrivi il tuo nome.». File: `sfide-amico-nome-vuoto-390-light.png`.

### Problema F7 — «Ho ricevuto una sfida»: con il campo vuoto il messaggio è «Link non riconosciuto.»
- Gravità: bassa. Con il campo vuoto e Invio il messaggio dovrebbe chiedere di incollare il link, non dire che non è riconosciuto. File: `sfide-ricevuto-0-390-light.png`.

## Profilo, Modifica profilo, Project ID — 390x844 chiaro

- Il nome lungo (30 caratteri senza spazi) va a capo in Home e si tronca con «…» nel Profilo; nessuno scorrimento orizzontale (`home-nome-lungo-390-light.png`, `profilo-nome-lungo-390-light.png`).

### Problema P1 — «Modifica profilo»: «Salva» accetta il nome vuoto e torna al Profilo senza dire nulla
- Gravità: media (stato d'errore senza causa).
- Cosa succede: svuotando «Nome» (o scrivendo solo spazi, o «A») «Salva» resta attivo; premendolo si torna al Profilo e il nome resta «Mario Rossi»: il salvataggio viene ignorato in silenzio, senza messaggio.
- Riproduzione: Profilo → tocco sul nome → svuotare «Nome» → «Salva».
- File: `profilo-modifica-390-light.png`, `profilo-modifica-vuoto-dopo-390-light.png`.
- Proposta: disabilitare «Salva» o mostrare «Scrivi il tuo nome.» sotto il campo (come nel duello).

### Project ID: «Verifica con un link»
- Qui l'esito c'è: in linea «L'accesso con link non è abilitato nel progetto: per ora l'email resta non verificata.»; offline «Sei offline o il servizio non risponde: l'email resta non verificata. Riprova più tardi.» (in `role=status`). Bene, ma resta l'errore in console `Failed to load resource: … 400` (online) e `ERR_INTERNET_DISCONNECTED` (offline). File: `projectid-verifica-on-390-light.png`, `projectid-verifica-off-390-light.png`.
- Problema P2 — gravità bassa: «non è abilitato nel progetto» è gergo tecnico; meglio «La verifica via email non è disponibile adesso».
- Problema P3 — gravità alta (errore in console): la richiesta `sendOobCode` risponde 400 `OPERATION_NOT_ALLOWED` ogni volta; se la funzione non è abilitata, il pulsante non dovrebbe chiamare il servizio (o non dovrebbe esserci). Vale anche per O6.

## Offline (context.set_offline dopo il primo caricamento)
- Il service worker è registrato: la ricarica offline funziona e le viste Profilo, Project ID, NOI, Agorà, Segnala, ATLAS, Iscrizioni, Modifica profilo si aprono offline con testi veri («Non attiva su questo sito», «Il collegamento ad ATLAS non è attivo…»). File: `offline-*-390-light.png`.

## Impostazioni (Profilo → ingranaggio) — 390x844 chiaro/scuro

- Tema Sistema/Chiaro/Scuro (`role=radio`) si applica subito e resta in `localStorage.theme`; «Suoni» è uno `switch` con `aria-checked`. «Esporta i progressi» scarica `addiofa_progressi.json` e annuncia «Copia salvata: addiofa_progressi.json, nei download.». «Importa i progressi» con JSON rotto, JSON estraneo o .txt → «Non riesco a leggere il file: controlla che sia un salvataggio di AddiOFA.»; con un file valido chiede «Sostituire i progressi?» (Annulla/Sostituisci). «Cancella i dati» chiede conferma e poi riporta alla landing. Nessun errore in console.

### Problema I1 — Impostazioni senza indirizzo: ricarica porta alla Home
- Gravità: media (come N1). L'URL resta `/`; F5 sulle Impostazioni apre la Home. File: `impostazioni-390-light.png`.

### Problema I2 — dialoghi di conferma («Cancellare i dati?», «Sostituire i progressi?», «Uscire…?»): Tab esce dal dialogo, poi Esc non chiude
- Gravità: media.
- Cosa succede: all'apertura il fuoco è su «Annulla»; Tab → «Cancella» → «Home» → «Esercizi» → «Sfide» (la barra in basso, sotto il velo). Con il fuoco sulla barra, Esc non chiude più il dialogo. Il fuoco iniziale su «Annulla» non mostra anello (outline `none`).
- File: `impostazioni-cancella-dialogo-390-light.png` (tema scuro).
- Proposta: trappola del fuoco nel dialogo (o `inert` sul resto) ed Esc gestito a livello di documento.

### Cancellazione dei dati
- Dopo «Cancella» si arriva alla landing senza alcuna conferma che i dati siano stati cancellati. Gravità bassa. File: `impostazioni-cancella-dblclick-390-light.png`.

## Indirizzi sbagliati e stati vuoti/errore — 390x844 chiaro

- `?vista=inesistente` → «Questa pagina non esiste · Il link potrebbe essere vecchio. · Torna indietro» (URL riscritto in `?vista=stato-vuoto`). `simulazione-dettaglio` con id sbagliato o mancante → «Simulazione non trovata · Vai alle simulazioni». `lezione-dettaglio&id=boh` → «Lezione non trovata · Apri il percorso». `?sfida=ABC123` e `?sfida=` → «Link non valido · Vai alle sfide». Tutti con causa e azione: bene.

### Problema U1 — percorso profondo inesistente: pagina bianca e due errori 404 in console
- Gravità: alta (pagina vuota, errori in console) — osservato con `vite preview`, che risponde con `index.html` a ogni percorso; sul sito pubblicato dipende dall'host.
- Cosa succede: `/pagina/che/non/esiste` carica `index.html` che chiede `./assets/index-….js` in percorso relativo → `/pagina/che/non/assets/…` 404 → schermo completamente bianco, nessun testo né link.
- File: `url-_pagina_che_non_esiste-390-light.png`.
- Proposta: `base: '/'` (percorsi assoluti degli asset) oppure una 404 statica con link alla Home.

### Problema U2 — `?vista=splash`: rotella che gira per sempre
- Gravità: media (caricamento senza fine e senza azione). Dopo 8 s resta logo + rotella, nessun testo, nessun elemento con il fuoco. File: `splash-8s-390-light.png`. Se la vista non è pensata per gli utenti, andrebbe reindirizzata alla Home come le viste sconosciute.

## Segnala un problema — 390x844 chiaro
- Il tipo «App» è preselezionato; «Prepara il testo» resta disabilitato sotto 5 caratteri con la riga «Scrivi almeno 5 caratteri…»; il campo si ferma a 1000 caratteri (1000/1000). Doppio clic su «Prepara il testo» salva una sola segnalazione.

### Problema G1 — la segnalazione non si può mandare: «mandalo tu al contatto da cui hai conosciuto AddiOFA»
- Gravità: media (compito non completabile dall'app). Dopo «Prepara il testo» compare «Non inviata · Copia il testo e mandalo tu al contatto da cui hai conosciuto AddiOFA.»: nessuna email, nessun link, nessun pulsante «Invia per email». Chi ha trovato il sito da solo non sa a chi mandarlo (l'email del titolare c'è solo nei Termini).
- File: `segnala-prepara-390-light.png`.
- Proposta: pulsante `mailto:` con il testo già pronto, o il contatto scritto.

### Problema G2 — «Elimina» cancella la segnalazione salvata senza conferma né messaggio
- Gravità: bassa. File: `segnala-elimina-390-light.png`.

## Iscrizioni (vista autore)
- Password sotto 8 caratteri → «Scrivi la password (almeno 8 caratteri) per scaricare.»; con 8+ caratteri → «Server non collegato: apri il sito pubblicato (https).» (riga vera). Campo `type=password`. Nessun problema.

## Obiettivi — 390x844 chiaro
- Data del test con tre `select` (Giorno/Mese/Anno): 31 febbraio 2027 diventa in silenzio 28 febbraio («Mancano 93 giorni», conto giusto); una data passata è accettata («Data passata da 330 giorni»); oggi → «Il test è oggi»; «Togli la data» la toglie.
- Problema B1 — gravità bassa: con la data di domani compare «Mancano 1 giorno» (va «Manca 1 giorno»). File: `obiettivi-data-28-11-2026-390-light.png`.

## Domande frequenti
- Ricerca senza risultati → «Nessun risultato · Prova con altre parole, o scrivici cosa cercavi. · Scrivici un'idea» e pulsante «Cancella la ricerca»: stato vuoto con causa e azione. Spazi soli = tutte le domande. Bene. File: `faq-cerca-zzzqqq-390-light.png`.

## Lezione → Teoria / Esercizi
### Problema L2 — Indietro del browser dagli esercizi di una lezione: l'URL cambia, la schermata no
- Gravità: media (stato contraddittorio).
- Cosa succede: da `?vista=lezione-dettaglio&id=present-simple` → «Esercizi» l'URL diventa `/` e parte il quiz. Premendo Indietro l'URL torna a `?vista=lezione-dettaglio&id=present-simple`, ma resta il quiz (il timer continua: 28 s, 27 s…); una seconda pressione non fa nulla. Una ricarica a quel punto aprirebbe la lezione e non il quiz.
- File: `lezione-esercizi-back-390-light.png`.
- Proposta: Indietro = «Esci» con dialogo, come per l'allenamento (A2); tenere URL e schermata allineati.
- Nota: da Lezione → «Teoria» l'URL diventa `/` ma Indietro torna correttamente alla lezione.

## Percorso «Vai all'app senza test» (localStorage pulito) — 390x844 chiaro

- Landing → «Preferisci esplorare? Vai all'app senza test» porta a `?vista=completa-profilo` («La tua email PoliMi», scuola, sede, laurea, corso, anno, «Come ci hai conosciuto?» con «Salta», «Termini e privacy»), poi alla Home vuota: «Nessuna stima · Da iniziare · Fai il test iniziale», «Nessun dato per area», «Andamento · Ancora nessun dato · Dopo il test iniziale vedrai la curva.» Stati vuoti con causa e azione: bene (`home-senza-dati-390-light.png`).

### Problema V1 — «Completa il profilo» senza pulsante per tornare indietro
- Gravità: media. Nella prima schermata («La tua email PoliMi») non c'è «<» né «Annulla»: chi voleva solo «esplorare» può uscire solo con l'Indietro del browser (che qui funziona). In un'app installata a tutto schermo su iPhone non c'è modo di tornare alla landing. File: `senza-test-home-390-light.png` (primo passo).
- Nota: l'ultimo pulsante qui si chiama «Salva», nel percorso del test iniziale «Continua» (stessa schermata «Termini e privacy», etichette diverse; gravità bassa). File: `senza-test-termini-390-light.png`.

### Problema V2 — Home → «Fai il test iniziale»: schermata «Test di livello» senza uscita
- Gravità: alta (blocca: non si torna alla Home).
- Cosa succede: la schermata «Test di livello · 10 domande e la tua stima aggiornata. · Inizia le 10 domande» non ha «<» (al suo posto uno spazio vuoto accanto alla barra di avanzamento), Esc non fa nulla, l'Indietro del browser non cambia schermata. Ricaricando si finisce sulla landing pubblica («Per gli studenti del Politecnico…»), non sulla Home dell'utente già iscritto.
- Riproduzione: localStorage pulito → «Vai all'app senza test» → completare il profilo → Home → «Fai il test iniziale» → provare a tornare indietro.
- File: `test-livello-intro-390-light.png`.
- Proposta: «<» che torna alla Home; Indietro del browser uguale; dopo la ricarica tornare alla Home.

## Verifiche aggiuntive

- A1 confermato anche a 1280x800 tema scuro: doppio clic su «Vedi com'è andata» porta alla Home e salta il riepilogo (`allenamento-dblclick-vedi-1280-dark.png`). S1 a 1280 non si ripete (il dialogo è al centro e non sovrapposto a «Rifai la simulazione»: `sim-dblclick-conferma-1280-dark.png`).
- Nessuno scorrimento orizzontale a 390 e 1280, chiaro e scuro, su Home, Sfide, Profilo, Simulazioni, Progressi, Project ID, simulazione e allenamento. Anello di fuoco della Home visibile anche in scuro (`home-fuoco-allenamento-390-dark.png`).
- Frasi utili: «Preferite» vuota → «Nessuna preferita · Tocca la stella… · Vedi tutte le frasi»; ricerca senza risultati → «Nessuna frase trovata · Cancella la ricerca»; «Mostra altre 572» carica 40 frasi e il fuoco resta sul pulsante. Bene.

### Problema U3 — «Completa il profilo» (consenso obbligatorio) si salta aprendo un indirizzo
- Gravità: media (incoerenza del percorso obbligatorio). Con il test iniziale fatto ma senza profilo, `/` porta a «La tua email PoliMi»; aprendo direttamente `/?vista=sfide` o `/?vista=profilo` l'app si usa senza aver dato email né accettato Termini e privacy (il Profilo mostra «Aggiungi il tuo nome»). File: `completa-profilo-390-light.png`.

## Riepilogo dei controlli
- Viewport 390x844 e 1280x800, temi chiaro e scuro (scuro e 1280 su landing, percorso iniziale, Home, Sfide, Profilo, Simulazioni, Progressi, Project ID, simulazione, allenamento, impostazioni).
- Console: unici errori visti = 400 di `identitytoolkit…sendOobCode` (O6/P3), `ERR_INTERNET_DISCONNECTED` della stessa chiamata offline, 404 degli asset su percorso profondo (U1). Nessuna eccezione JavaScript.
- Non provato: lettore di schermo reale, tastiera virtuale del telefono, installazione come PWA, sito pubblicato in https (ATLAS/Project ID collegati), scadenza naturale dei 15 minuti senza orologio accelerato, sfida del giorno fino in fondo, Progressi/Badge/ATLAS oltre l'apertura.

