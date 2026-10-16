# NOTE-ILLUSTRATO-PROVE: Simulazioni dai concept (16/10)

Agente ILLUSTRATO-PROVE. Immagini in `docs/lavoro/extra/illustrato/prove/` (`dopo-*` = stato attuale, `prima-*` = prima del lavoro, `confronto-*` = concept | app a 400 px).

## Schermata -> concept -> illustrazioni -> cosa non somiglia ancora

| Schermata (file) | Concept | Illustrazioni | Differenze dal concept |
|---|---|---|---|
| Elenco simulazioni (`studio/Simulazioni.tsx`) | 18.7, 30.10, 49.6 | `simulazione-esame` 104 px nella carta con i tre dati e un solo ▶; `vuoto` 120 px nello stato vuoto ("Nessuna simulazione"). Riga: x/30, data, tempo, icona esito (verde/corallo) | Il concept ha una riga per formato (40 domande, 60 min, Listening...): qui un solo formato (30 domande, 15 min, 25/30). L'illustrazione sta nella carta e non in testata, perche' la testata e' `scheda.tsx` (non mio) |
| Dettaglio (`studio/SimulazioneDettaglio.tsx`) | 18.9, 30.11, 43, 10 | kit luminoso: `superamento` (150 px) o `mancato-superamento` (130 px) sopra il misuratore; `progressi-statistiche-scheda` nel confronto prima/dopo | Niente "76 %" ne' trofeo: il punteggio e' x/30 e l'esito e' un'icona piu' parola |
| Esito subito dopo la consegna (`esito/EsitoSimulazione.tsx`) | 18.9, 30.11, 10, 43 | superata `celebrazione` (animata una volta, 120 px, cambio dal piano d'uso); non superata `mancato-superamento` (animata, 120 px); `progressi-statistiche-scheda` nel confronto | Pulsanti "Correzioni" (pieno) e "Rifai" (bordo) con icona e una parola: il concept ha "Vedi le correzioni" e "Torna alla home"; "Torna" e' la freccia in testata |
| Correzioni complete (`esito/CorrezioniComplete.tsx`) | 18.6, 10, 43 | nessuna sulle domande; filtro vuoto: `documento-completato` (nessuna sbagliata/vuota) o `vuoto` (nessuna giusta) | Confronto affiancato "tua risposta | esatta" invece della sola riga verde/rossa del concept |
| Simulazione in corso (`ExamMode.tsx`) | 18.8, 30.9 | nessuna (sono le domande) | Aggiunta la pillola della categoria (Grammatica/Traduzione) come nel concept ("Grammar"); niente segnalibro, niente scelta con cerchietti: lettere A-D |
| Dialoghi di uscita e consegna (`ConfirmDialog.tsx`, usati da ExamMode) | piano d'uso 3.2 | uscita `attenzione-rischio` 72 px; consegna con domande vuote `simulazione-esame` 80 px | Nuova prop opzionale `illustrazione` su ConfirmDialog; gli altri usi (Impostazioni, Amici, SfidaGioco) invariati |
| Consegna in corso / errore (`ExamMode.tsx`) | 09, 20 | `documento-in-corso` 96 px + spinner; se il tempo e' scaduto, pillola "Tempo scaduto"; errore di avvio e di consegna: `documento-errore` | Nessuna sequenza animata (percentuale che sale): vietato dal CLAUDE.md |
| Caricamento delle domande (`ExamMode.tsx`) | piano 3.1 | `attesa-caricamento` (gia' c'era), invariata | |
| Sequenza di calcolo (`CalcoloRisultato.tsx`, usata dall'Onboarding) | 09, 10, 20, 29, 42, 43 | `documento-in-corso` 112 px; tre tappe (risposte esatte, livelli, soglia) con icona, nome, numero vero e spunta "fatta" | Statica, senza il misuratore che sale a 82 %: la percentuale e' la schermata dopo. Le aree "Grammatica, Comprensione, Vocabolario, Ragionamento" del concept non esistono (il banco ha Grammatica e Traduzione) |
| "Come viene calcolata la stima" (`FoglioStima.tsx`, usato da Onboarding, Menu, esito, dettaglio) | 25 (scheda 2) | nessuna (il concept e' un foglio di righe icona + due righe) | Riquadro tinto con la domanda, righe da 1-2 frasi corte; "Solo una stima" con tre tessere k/10 -> % calcolate con la stessa funzione della stima (nessun numero a mano). Il testo e' piu' lungo del concept per onesta' sui limiti |
| Confronto prima/dopo (`esito/ConfrontoPrecedente.tsx`, nuovo) | 31.9, 30 | `progressi-statistiche-scheda` 84 px | Compare solo se esiste una simulazione precedente; "+4" solo se le due prove hanno lo stesso numero di domande |
| Pezzi dei Progressi (`studio/StatistichePezzi.tsx`) | 18.2, 06 | stato vuoto dei Risultati: `vuoto` 96 px | La testata dei Progressi non e' mia |

Tutto usa dati veri: 30 domande, 15 minuti, soglia 25/30 da `EXAM`; i confronti vengono dallo storico salvato.

## Cambi di comportamento da sapere
- Esito: "Tempo scaduto" quando la prova si chiude allo scadere (pillola "Scaduto" accanto al tempo; anche nel dettaglio, se il tempo salvato e' >= 15 min).
- Esito: il link "Come viene calcolata la stima" nel foglio della "i" ora compare anche senza che App passi `risposteStima`: ExamMode calcola da solo su quante risposte e' fatta la stima dopo la simulazione (`calcolaStima` sullo storico salvato piu' questa prova). Il dettaglio fa lo stesso con `calcolaStima(appState)`.
- Il confronto con la precedente in ExamMode usa lo storico letto dal salvataggio (`loadState`); se si preme "Rifai" subito, la precedente e' la prova appena finita.

## Richieste per App.tsx (tutte opzionali, nulla e' obbligatorio)
- `ExamMode` ha una nuova prop opzionale `storico?: ExamHistory[]` (passare `appState.history` evita di rileggere il salvataggio). Senza, funziona uguale.
- `risposteStima` resta opzionale: se App la passa ha la precedenza sul calcolo interno.
- Nessuna vista nuova. Resta l'osservazione gia' nota: la barra in basso durante la prova e' di App (nelle mie schermate a tutta altezza non la vedo).

## Non fatto / scelte
- Nessuna schermata "intro" della simulazione con `L: attesa-caricamento` (piano 3.2): la prova parte da sola per scelta dell'area (un solo formato, un tocco). I tre dati stanno nella carta dell'elenco.
- Nessun file da cancellare. Nessun test unitario aggiunto: non c'e' logica pura nuova rilevante (solo `differenzaEsatte`, banale).
- `scheda.tsx` (testata Prove | Sfide) e il selettore non sono nel mio perimetro: l'illustrazione "in testata a destra del titolo" del piano sta quindi dentro la carta.

## Controlli eseguiti (numeri onesti)
- `cd app && npx tsc --noEmit`: pulito. `npm test` dalla radice: 240/240 verdi.
- `node tools/genera-icone.mjs`: senza errori (145 icone; non ho aggiunto icone). `python3 tools/controlla-illustrazioni.py`: lancia senza errori sul mio lavoro; elenca ancora non usate quelle di altre schermate (es. kit luminoso `attesa-caricamento`, `messaggi-supporto`).
- Testo: blocchi di 4+ parole fuori da `data-testo-ok` e dai dialoghi, misurati con uno script mio su elenco, dettaglio, progressi, prova in corso ed esito: 0. `tools/controlla-testo.py` non e' partito (cerca un pulsante "Simulazioni" che la nuova barra Home/Esercizi/Sfide non ha piu'): non l'ho modificato (fuori perimetro).
- Chromium, porta 5263, stati: nessuna simulazione, una (provata nel confronto di 2), molte (3); superata (27/30, 30/30) e non superata (17/30, 0/30); tempo scaduto (orologio simulato con `page.clock`: 15:02 -> consegna da sola, pillola "Tempo scaduto" e poi "Scaduto" nell'esito); consegna in corso (consegna rallentata a mano), errore di avvio e di consegna (provider fatto fallire a mano); dialoghi di uscita e di consegna; foglio Regole e "Come viene calcolata" (diagnostico non provato nel foglio, vedi sotto); calcolo nell'Onboarding (percorrendo il diagnostico). Temi chiaro e scuro, 400 px; 1280 px chiaro e scuro per elenco, dettaglio ed esito. Scorrimento orizzontale: 0 in tutti.
- Console: un solo "404 Failed to load resource" a ogni apertura, anche a pagina vuota; non e' nelle mie risorse (nessuna risposta >= 400 intercettata dopo il caricamento) e c'era gia' prima del mio lavoro. Nessun altro errore.

## Non provato
- 1280 px per calcolo (Onboarding a 1280 ha un pulsante diverso e il mio pilota non lo seguiva), prova in corso, dialoghi e fogli.
- Foglio "Come viene calcolata" nella variante `diagnostico` (tre tessere k/10): provato solo il tipo `simulazione`; la variante diagnostico passa il controllo dei tipi ma non l'ho vista a schermo.
- Risoluzioni diverse da 400 e 1280; contrasto con `tools/controlla-contrasto.py` (non lanciato: guardato a occhio in scuro, i testi su tinta usano i token `*-testo`).
- Il confronto "concept | app" per l'esito e l'elenco e' affiancato ma i ritagli di alcuni concept hanno proporzioni diverse (`confronto-prima-dopo.png` mostra un ritaglio largo).
