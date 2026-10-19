# Rifacimento da revisione: studio, simulazione, esito, Esercizi

Agente STUDIO, 18-19/10. Fonti: `docs/design/revisione/SINTESI.md` (vincolante), `C-schede-simulazione.md`, parti di `D-profilo-servizi.md` (Frasi, Percorso, Simulazioni, stati vuoti) e `G3` (esito). Niente git, niente file cancellati.

## Cosa è cambiato

**Studio (`components/LearnMode.tsx`)**
- Fiducia: sopra i tre pulsanti una riga che dice cosa fare («Scegli una risposta» prima; «Quanto sei sicuro di questa risposta? Tocca per controllare.» dopo). Etichette nuove «Tirato a caso / Non del tutto / Sicuro», tre barre (1, 2, 3 piene: forma oltre al colore) al posto delle icone `signal-*` che si vedevano a malapena; spenti a opacità 45 con la riga che spiega perché, accesi con tinta e bordo del loro tono (corallo, ambra, verde), 64 px.
- Pannello di feedback: una sola icona (cerchio con spunta o X), titolo «Giusto» / «Non è questa» / «Tempo scaduto» a sinistra, spiegazione in testo normale (15/22, non neretto, non centrato), 3 righe con «Leggi tutto» (apre, scorre da sola), virgolette tipografiche, «Rivedi la teoria» come pulsante secondario, «Riprova»/«Avanti» nel blu primario, fondo tinta al 60% con filo del colore (chiaro e scuro letti a occhio). Dopo due errori compare «Vai avanti» (la domanda resta tra quelle sbagliate); nel «Richiamo» sbagliato si mostra «Risposta esatta».
- Risposte scelte con la stessa grammatica della simulazione (`OpzioneRisposta`: tinta blu, bordo 1,5 px, cerchio pieno; giusta/sbagliata con icona e parola per chi ascolta). Lettere A-D in `testo` (non più tenui, 3,8:1 in scuro).
- Tempo «29 s» neutro, ambra a un terzo, corallo a un sesto, più una barra sottile di consumo sotto la testata; «Domanda N di 10».
- Stati: «Niente da ripassare» (cause + «Allenamento consigliato»), «Domande non caricate» (cause + Riprova/Indietro) con `StatoVuoto`. Fine sessione: titolo, tessere con parola (Giuste, Da riprendere, Tempo), «Domande imparate» prima → ora, tolta l'illustrazione ripetuta, «Altre 10 domande» / «Torna alla Home».

**Simulazione (`components/ExamMode.tsx`)**
- Via i 30 pallini da 6 px. Sotto: ‹ «Domanda N di 30 ▾» › (48 px). Il centro apre un foglio con la griglia 6×5 di tessere da 48 px: risposta (blu pieno), saltata (tratteggio ambra: visitata e senza risposta), da vedere (neutra), corrente (contorno), legenda con parola e numero («Risposte 2 · Saltate 2 · Da vedere 26»), il foglio scorre se lo schermo è basso, e un «Consegna».
- Testata: X 44 px, timer neutro, ambra negli ultimi 5 minuti, corallo nell'ultimo; «Consegna» 13 px alto 40; barra da 6 px con «N risposte su 30». Tolti categoria e numero nel cerchio (la domanda è «Domanda N di 30» nel piede).
- Finestre: «Vuoi consegnare ora?» / «Mancano 29 risposte. Una volta consegnato non puoi più cambiare niente.» / «Torna alle domande» + «Consegna»; uscita «Le risposte date andranno perse.». Errori di avvio/consegna: causa + pulsante con parola (prima solo icona).
- **Navigazione fra domande: funziona.** Provata con Playwright (avanti, tessera 15, ritorno alla 1: prompt diverso, risposta conservata, `aria-pressed`). La cattura `05-sim-15` sbagliata era dello script: cercava «Avanti/Successiva» nel testo, ma i pulsanti sono a sola icona con `aria-label`, quindi non ha mai cliccato.

**Esito (`components/esito/`)**
- Titolo «Risultato». Tolta l'illustrazione con la X; la celebrazione compare solo se superata. Misuratore: traccia più visibile (`tacca`), numero 52 px, segno della soglia con etichetta «Soglia 25» (testo HTML, non nell'SVG). Un solo badge: «Superata» (verde) / «Sotto la soglia» (ambra da 20 in su, corallo sotto) + «Ti mancano N risposte esatte». Soglia e tempo a parole («Soglia 25 su 30», «Tempo 0:10 su 15 min»). Con domande vuote: «29 domande senza risposta. Contano come errori.»
- Contatori a icona tenuti, con la parola sotto. Confronto: «Simulazione precedente → Questa» + una riga neutra («4 risposte esatte in più della precedente»), senza freccia rossa, solo dalla seconda simulazione e solo se le prove hanno lo stesso numero di domande. Pulsanti «Vedi le correzioni» e «Rifai la simulazione» (impilati). «Come sei andato per argomento». Correzioni: filtri a parole 2×2 (icona, nome, numero), «La tua / Esatta», «Spiegazione» e «Rivedi la teoria» a parole, virgolette tipografiche.
- Lo stesso riquadro serve il dettaglio di una simulazione svolta (`RiepilogoEsito`): un solo disegno.

**Esercizi (`screens/Esercizi.tsx`)**: una carta con l'unica azione primaria («Allenamento consigliato», «10 domande scelte per te», ▶ Inizia, illustrazione 88 px a destra); sezioni «Scegli come allenarti» e «Per studiare»; quattro tessere con riga di spiegazione (Punti deboli «40 da ripassare» o «Le domande che sbagli»; Blitz «10 domande, 10 secondi l'una»; Richiamo «Componi la frase da zero»; Per argomento «Scegli tu cosa studiare»); il pulsante «Inizia con questo argomento» ha la parola; Frasi utili e Riepilogo di grammatica con la stessa tessera icona da 48 px. Senza cornice a 640+ px, colonna da 480.
**Frasi utili, Percorso, Simulazioni, dettaglio, Riepilogo (`CheatSheet`)**: tolta l'illustrazione di testa (a destra collideva con l'intestazione) tranne un segno da 40 px nella riga del titolo della lezione; filtri di Frasi a parole («Tutte 612 · Preferite 0 · Da ripassare 40 · Imparate 20», a capo, senza scorrimento); spiegazioni non troncate a metà frase (3 righe + «Altro»); Percorso: «0 di 31 lezioni», «Prossima: …», riga attiva con barra sinistra nel margine, ogni riga col suo numero (niente miniature ripetute), «7 min»; Simulazioni: «30 domande / 15 minuti / Si supera con 25», pulsante «Inizia la simulazione», righe «Superata / Sotto la soglia» a parole; anno nelle date solo se diverso da quello in corso. `StatoVuoto` migliorato (titolo 20 px, causa 15 px sempre visibile in `data-testo-ok`, azione con verbo, variante a pagina intera) e usato dappertutto (non trovata, nessun risultato, vuoti dei filtri, correzioni non disponibili).

## Cosa dei rapporti NON ho applicato, e perché
- «Ripasso / Le domande da rivedere oggi» al posto di «Richiamo»: falso. Nel codice il Richiamo si fa componendo la frase con le parole e prende le domande come gli altri; ho tenuto «Richiamo» con la riga vera. Blitz «30 secondi l'una»: nel codice sono 10 secondi, scritto 10. «Allenamento consigliato … sui tuoi punti deboli»: l'algoritmo pesa anche scadute e nuove, scritto «scelte per te».
- Frase-istruzione «Scegli la parola giusta» alla prima domanda: non vale per tutte le domande del banco, non la affermo.
- Miniature per tema con un'icona a tratto diversa (D M5): non esistono 31 icone; ho usato il numero della lezione (unico per riga).
- Dialogo di consegna col numero in grassetto (R6) e testo più forte: `ConfirmDialog.tsx` non è mio (vedi richieste).
- Pill «56×32» e altre voci della barra, Home, Sfide, desktop shell: file di altri.
- «Spiegazione: massimo 3 righe con Leggi tutto» fatto nello studio; nelle correzioni dell'esito resta aperta (è l'elenco da leggere).
- Le spiegazioni restano scritte come nei contenuti: ho solo cambiato le virgolette dritte in caporali a video (`tipografiche`), non il testo; riscrittura per frasi più brevi spetta a `contenuti/`.

## Richieste per file non miei
- `components/ConfirmDialog.tsx`: `message` accetta nodi (numero in grassetto), testo `text-testo` invece di tenue, pulsanti con `px-3` e a capo (a 400 px «Torna alle domande» sta largo come il pulsante, senza margine).
- `components/ui.tsx` (`Screen`) e `screens/extra/ui.tsx` (`Pagina`), `sfide/scheda.tsx`: hanno ancora `sm:rounded-[28px/32px] sm:border`: togliere la cornice come nei miei componenti; `Pagina` documenta «mai un'illustrazione» a destra ma accetta `destra`.
- Nomi nuovi da portare altrove: «Allenamento consigliato» (era «Intelligente»), «Riepilogo di grammatica» (era «Prontuario»), «Frasi utili» (era «Frasi»), «Per argomento», «Imparate» (era «Già note»). Da cambiare in `Menu.tsx`, `Onboarding.tsx`, `TelefonoPassi.tsx`, `data/cheatSheet.ts`, FAQ, `tools/controlla-contrasto.py` (cerca `^Prontuario`, voce che comunque non esiste più).
- `Home` e Profilo contano le domande imparate con un'altra base (es. 0/116 nel rapporto D): qui «Domande imparate … su 613» è il banco intero (`bankMeta`). Va deciso un solo numero e una sola fonte.

## Numeri e prove
- `npx tsc --noEmit`: nessun errore nei miei file (errori d'altri in corso: Landing, Onboarding, profilo, App).
- `npm test`: 306 verdi, 0 falliti, 4 saltati (prima 303; aggiunta `studio-esito-testi.test.ts`, 3 prove su confronto, riga della differenza, virgolette).
- `controlla-testo.py` su esercizi, frasi, percorso, simulazioni, dettaglio, lezione (chiaro e scuro): 0 blocchi; stessa scansione su studio (domanda, scelta, sbagliata), simulazione (inizio, griglia), esito: 0.
- `controlla-contrasto` (funzione `controlla` del tool, su server di sviluppo perché `build:demo` oggi non compila per file d'altri), 400 e 1280 px, chiaro e scuro, 17 stati (studio ×4, simulazione ×4, Esercizi ×3, Frasi, Percorso, Simulazioni, due dettagli, lezione): 0 violazioni, nessun overflow orizzontale.
- Schermate lette a occhio (400 e 1280, chiaro e scuro): studio (vuota, scelta, sbagliata, giusta, fine sessione), simulazione (inizio, griglia, domanda 15, dialogo, esito 0/30 con 29 vuote, 15/30, 28/30), Esercizi (anche con «Per argomento»), Riepilogo, Frasi, Percorso, Simulazioni, dettaglio (superata e sotto soglia, non salvato, non trovata), lezione (anche non trovata). Console senza errori nei miei percorsi (un 404 di risorsa al primo caricamento della prima cattura, non riprodotto la seconda volta).

## Non provato
- Esito con confronto «precedente» nella consegna dal vivo (nell'anteprima lo storico è vuoto): provato solo nel dettaglio (Simulazione 2: «4 risposte esatte in più della precedente»).
- Timer ambra/corallo della simulazione (5:00, 1:00) e «Tempo scaduto» dello studio: logica letta, non aspettato il tempo.
- Errori forzati del provider (`?fallisci=`): schermate nuove viste solo nel codice, non catturate.
- Tablet 768 px, lettore di schermo, tastiera sul foglio della griglia (Esc e focus ereditati da `FoglioInfo`).
- Le catture sono sul server di sviluppo, che ricarica la pagina a ogni modifica degli altri agenti: due prove sono state rifatte per questo.
