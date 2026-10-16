# Intuitivo: area Studio (Lezioni), agente INTUITIVO-C, 16/10

## Cosa è cambiato (funzione → posto)
- **Scheda Lezioni** (`screens/Lezioni.tsx`): `TestataScheda` (titolo + profilo), carta «prossima lezione» (tessera argomento, titolo breve, barra, `n/m`; apre `lezione-dettaglio` con `{ id }`), quattro tessere grandi icona + una parola: Percorso (`percorso`), Esercizi (vista `practiceMenu`), Frasi (`frasi`), Prontuario (vista `cheatsheet`).
- **Tolto da Lezioni** (sta altrove o non serve): Teoria come riga (ora dentro il Percorso), Ripasso errori (ora modalità «Punti deboli» di Esercizi), Verifica livello e Progressi (Profilo → Progressi), Sfide e Classifica (Simulazioni), Esplora (non esiste più), Pass (Profilo), «Dove sei più solido» (Progressi), scelta del materiale (Impostazioni), illustrazione e tutte le frasi.
- **Percorso**: titolo «Percorso»; contatore `n/31` con barra e un solo ▶ «Continua/Inizia»; intestazioni A1/A2/B1 con `n/m`; righe = stato a icona (imparata, in corso con barra, da iniziare) + titolo breve + minuti con icona + lucchetto (Pass) o freccia. Niente carte di spiegazione, niente nota sul Pass.
- **Lezione-dettaglio**: tre passi a icone: Teoria (apre `theory`), Esercizi (▶, sessione sull'argomento), Verifica (misura: barra e `n/m` imparate, non è un pulsante perché nel motore non esiste una prova separata); tempo totale e per passo come numero con icona; riga della lezione successiva.
- **Teoria (`theory`)**: resta il lettore; il testo della scheda è `data-testo-ok`; intestazioni a icona (Regola, Esempi, Errori), Sbagliato/Giusto/Perché a icone, avviso del test con la lampadina; tolte introduzione, etichette «Gratis/In arrivo», «Tutti gli argomenti». Aperta da una lezione, la freccia riporta alla lezione.
- **Esercizi** (`PracticeMenu`): un ▶ «Intelligente» (modalità `smart`, la stessa del ▶ della Home) + tessere Punti deboli (lucchetto senza Pass; comprende gli errori), Blitz, Richiamo, Argomento (apre il selettore con ▶). Tolti il testo, il filtro «Raccolte» e la scelta nucleo/tutto. La modalità `standard` non è più offerta nel menu (resta nel codice).
- **LearnMode**: domanda senza testo di servizio (`n/m`, timer, serie con icona); feedback con icona giusta/sbagliata; la spiegazione è `data-testo-ok`; sicurezza della risposta a tre pulsanti con icona (una parola ciascuno), niente domanda; «Teoria» come bottone. Fine sessione: ora un componente locale di LearnMode (`FineSessione`: punteggio, tre tessere giuste/da riprendere/tempo, imparate prima → dopo, elenco da riprendere `data-testo-ok`, ▶ Continua, Home).
- **Frasi**: titolo «Frasi», ricerca, quattro filtri a icona con conteggio (tutte, preferite, da ripassare, già note), chip `n/615` con lucchetto senza Pass, righe (ascolta, frase, stella); frase e traduzione `data-testo-ok`; stati vuoti con icona + 2-3 parole.
- **Prontuario** (`CheatSheet`): titolo, ricerca, carte con intestazione a icona; il testo delle regole è `data-testo-ok`; la trappola ha l'icona corallo al posto di «Da evitare».
- `comune.tsx` (studio): `StatoVuoto` ora ha `icona` e `testo` facoltativo (compatibile con chi lo usa già); niente più import da lucide. Aggiunto `titoloBreve()` in `lib/studio/percorso.ts` (+ test).

## Tabella funzione → icona (registro `studio.json`)
| Funzione | Icona lucide | | Funzione | Icona lucide |
|---|---|---|---|---|
| percorso | route | | serie | flame |
| esercizi | dumbbell | | suggerimento | lightbulb |
| frasi | languages | | riprova | rotate-ccw |
| prontuario | notebook-text | | preferita | star |
| teoria | graduation-cap | | ascolta / ferma | volume-2 / square |
| teoria-regola / teoria-esempi | book-text / quote | | filtro-tutte | list |
| verifica | shield-check | | opzioni (richiamo) | layout-list |
| tempo | clock | | fiducia bassa/media/alta | signal-low/medium/high |
| modo-punti-deboli | crosshair | | stato-imparata | circle-check |
| modo-blitz | zap | | stato-in-corso | circle-dot |
| modo-richiamo | brain | | stato-da-iniziare | circle |
| modo-argomento | target | | stato-da-ripassare | refresh-cw |
| stato-risposta-giusta | check | | stato-risposta-sbagliata | circle-x |
Dalla base: home, lezioni, profilo, indietro, avanti, chiudi, cerca, studia (▶), blocco. «Intelligente» usa ▶ (`studia`).

## Prove (porta 5243)
- `npx tsc --noEmit`: nessun errore nei miei file (restano errori in file di altri agenti al momento della prova). `npm test` dalla radice: 216 su 216 verdi (un test nuovo, `titoloBreve`). `node tools/genera-icone.mjs`: 162 icone, senza errori. Nessun `lucide-react` nei miei file.
- Controllo del testo (`controlla-testo.py`, blocchi > 5 parole), a 400 px, chiaro e scuro, stato povero e ricco: **0** su lezioni, percorso, lezione-dettaglio, frasi; **0** anche sulle viste raggiunte con i clic: Esercizi (anche con «Argomento» aperto), Prontuario (anche vuoto), inizio sessione, risposta scelta, feedback, lettore di teoria, fine sessione. Con soglia 3 restano solo i nomi degli argomenti (titoli di contenuto).
- Screenshot a 400 e 1280 px, chiaro e scuro, stato ricco (e Lezioni vuoto) letti a occhio, in `docs/lavoro/extra/intuitivo/studio/`; i «prima» (`prima-*`) sono copie degli screenshot del lavoro COLORE. Nessuno scorrimento orizzontale. Console: solo il 404 di `favicon.ico` del server di sviluppo (non nostro). Non provato: Chromium a 400/1280 sulle viste Esercizi in stato povero con Pass attivo; `npm run build:demo` (vietato dal brief).
- Il server di prova si ferma alla consegna. Durante il lavoro altri agenti hanno lasciato per qualche minuto l'app non compilabile (import mancanti): ho riprovato a intervalli.

## Richieste al coordinatore
1. **App.tsx**: passare `onOpenProfilo={() => vaiExtra('profilo')}` a `<Lezioni>` (senza, la scheda usa comunque `onOpenExtra('profilo')`). Si possono togliere da `<Lezioni>` le props ormai inutilizzate: `onOpenStats, onStartErrors, onOpenTheory, onOpenTheoryTopic, onStartFocus, onOpenDiagnostic, onOpenLeaderboard, onSelectCorpus, onOpenPaywall, onNeedPass`; da `<PracticeMenu>` `onSelectCorpus`.
2. **`components/esito/FineSessione.tsx`** non è più usato da nessuno (LearnMode ha la sua fine sessione a icone): se non serve ad altri, archiviarlo.
3. **Registro `studio/index.ts`**: ho lasciato `statistiche`, `simulazioni`, `simulazione-dettaglio` perché i file di quegli agenti erano ancora lì.
4. **`Impostazioni`** deve avere la scelta nucleo/tutto (`materiale-*`): da qui è stata tolta sia da Lezioni sia da Esercizi.
5. Il Pass non ha più un invito nella scheda Lezioni: i lucchetti nelle righe del Percorso e in Punti deboli aprono il Pass al tocco (via `apriPaywall`/`onNeedPass`).
6. Il lettore di teoria resta raggiungibile dalla Home (`onOpenTheory`) con l'elenco semplificato (A1/A2/B1 + righe): se la Home non lo usa più, si può togliere l'elenco da `Theory.tsx`.
7. Nomi di icone condivisi: `tempo`, `riprova`, `stato-imparata`, `stato-risposta-giusta/sbagliata` sono definiti in `studio.json` e usati da Profilo; Prove deve usare gli stessi nomi (il generatore le ha già riconciliate nell'ultima esecuzione).
