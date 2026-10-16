# NOTE-ILLUSTRATO-STUDIO: Esercizi, Percorso, Lezione, Teoria, Frasi, Prontuario, sessione di studio

Agente ILLUSTRATO-STUDIO, 16/10. Screenshot in `docs/lavoro/extra/illustrato/studio/` (nome: `<vista>-<larghezza>-<tema>-<stato>.png`, stato `ricco` o `povero`). Porta di prova 5262 (app vera) e 5272 (copia di prova con `App.tsx` collegato a `onAvvia`, vedi «Richieste»).

## Schermata → concept → illustrazioni → cosa non somiglia ancora

| Schermata | Concept | Illustrazioni usate | Cosa non somiglia ancora e perché |
|---|---|---|---|
| **Esercizi** (scheda della barra) | 30.7, 49.4, 31.8 | `kit-luminoso/quiz-test` 128 px sopra il ▶ «Intelligente» (grande, un solo pulsante pieno); `sfera-studio` (Frasi) e `sfera-consigli` (Prontuario) 56 px nelle due righe; le quattro modalità restano icone (una funzione = un'icona) | I concept sono elenchi di testo e icone: qui la scheda è più illustrata dei concept per scelta del piano d'uso. `sfera-quiz` (prevista dal piano per «Quiz e domande») non è usata: non c'è una voce che la richieda |
| **Percorso** | 30.7, 31.11, 49.4 | `kit-luminoso/studio-inglese` 132 px a destra del titolo; `piano-superamento` 84 px nella scheda del contatore `n/31`; per ogni riga la tessera della famiglia (48 px) | Nei concept l'elenco è senza arte (cerchi numerati con spunta): le tessere sono la «carta di argomento» del piano. Il luminoso è 132 px e non 160+: a 400 px con il titolo a sinistra non ne sta di più senza ridurre il titolo |
| **Lezione** (dettaglio) | 31.12, 30.8, 49.5 | illustrazione della famiglia (`attesa-caricamento`, `ricerca`, `progressi-statistiche`, `suggerimenti-consigli`, `messaggi-supporto`, `verifica-utente`, `studio-inglese`) 76 px a destra del titolo; a lezione imparata `documento-completato` 96 px sopra «Continua» | I tre passi (Teoria, Esercizi, Verifica) restano righe a icona come nel concept 31.12; la Verifica non è un pulsante perché nel motore non esiste una prova separata |
| **Teoria**, elenco | 31.11, 49.4 | `kit-luminoso/suggerimenti-consigli` 132 px in testata; tessera della famiglia 44 px su ogni riga; `vuoto` se non ci sono schede | L'elenco **non è più raggiungibile dall'app** (la Home apre le lezioni, non l'elenco): vedi «Richieste» |
| **Teoria**, lettore | 30.8 (lezione: spiegazione + esempi) | illustrazione della famiglia 76 px a destra del titolo, chip del livello sopra il titolo | Resta un lettore di testo: regola, esempi, errori e avviso del test sono contenuto (`data-testo-ok`) |
| **Frasi** | 36, 49 (esplora → frasi), 18.3 | `kit-luminoso/ricerca` 132 px in testata; stati vuoti: `ricerca-scintille` (la ricerca non trova), `vuoto` (nessuna preferita, nessuna già nota), `documento-completato` (niente da ripassare: è una buona notizia) | — |
| **Prontuario** (`CheatSheet`) | 36 | `sfera-consigli` 72 px nella testata; `ricerca-scintille` se la ricerca non trova | Come Teoria: le carte sono testo di contenuto |
| **Sessione: domanda** | 30.9, 31.8, 49.5 | nessuna (come da piano: il concept è solo testo e risposte) | — |
| **Sessione: feedback** | 30.9 (banner verde «Corretto!») | `documento-completato` / `documento-errore` (kit blu, stati) 48 px **più** l'icona di stato 32 px accanto, nella barra in basso | Il piano d'uso diceva «nessuna illustrazione» per il feedback; l'incarico ricevuto chiedeva un'illustrazione piccola: ho seguito l'incarico (sta in una riga, si toglie con una riga di codice) |
| **Sessione: fine** | 31.9, 30 | coppa `successo` (animata) dentro un alone tondo come nel concept 31.9; `progressi-statistiche-scheda` 104 px sopra il «prima → dopo» (domande imparate) | Il concept mostra «82 % → 76 %» di rischio (numeri inventati): qui sono le domande imparate prima e dopo, dati veri |
| **Sessione: stato vuoto** («Punti deboli» senza errori) | 08, 17 | `documento-completato` 120 px, «Niente da ripassare», ▶ «Intelligente» | Nuovo: prima «Punti deboli» senza errori serviva domande qualsiasi |
| **Sessione: domande non caricate** | 08, 16 | `documento-errore` 110 px (era un'icona in un quadrato) | — |
| **Sessione: caricamento** | — | `A: attesa-caricamento` (già) | — |

Famiglie (`app/src/lib/studio/famiglie.ts`, con test): Tempi (8 argomenti) → `attesa-caricamento`; Domande (2) → `ricerca`; Confronti (2) → `progressi-statistiche`; Condizionali e modali (6) → `suggerimenti-consigli`; Discorso (4) → `messaggi-supporto`; Chi e dove (7) → `verifica-utente`; Altro (2) → `studio-inglese`. Sono 31 argomenti, tutti coperti (il test lo verifica).

## Cosa è cambiato nel codice

- `screens/Esercizi.tsx`: riscritta (▶ Intelligente grande, Punti deboli con il numero di errori da ripassare, Blitz, Richiamo, Argomento con selettore, righe Frasi e Prontuario). Assorbe la scelta di `PracticeMenu`. Tolta la tessera «Percorso» (il Percorso si apre dalla Home).
- `screens/extra/studio/comune.tsx`: nuovi `Arte` (illustrazione per nome) e `TesseraArte` (tessera con illustrazione per le righe); `StatoVuoto` accetta `illustrazione` (le altre props sono invariate).
- `Percorso.tsx`, `LezioneDettaglio.tsx`, `Frasi.tsx`: illustrazioni come in tabella. `Theory.tsx`, `components/CheatSheet.tsx`, `components/LearnMode.tsx`: idem.
- `LearnMode`: il pulsante «Indovino» ora si chiama «Non so» (stessa confidenza `low`; restano «Incerto» e «Sicuro»: tre livelli servono all'algoritmo di ripasso). Nuova modalità interna: dallo stato vuoto di «Punti deboli» si passa a `smart` senza uscire.
- `lib/studio/famiglie.ts` (+ `tests/unit/studio-famiglie.test.ts`).
- `studio/index.ts`: non toccato (i titoli erano già giusti).
- Nessuna icona nuova (`genera-icone.mjs` non rilanciato: non serve).

## Richieste per `App.tsx` (lo modifica il coordinatore)

1. **`<Esercizi>`: passare `onAvvia={(modo, categoria) => { setLearnMode(modo); setLearnCategory(categoria); setView('learn'); }}`** (prop nuova, opzionale; tipo `ModoEsercizi` esportato da `screens/Esercizi.tsx`). **Senza questa riga Intelligente, Blitz e Richiamo aprono ancora il vecchio `PracticeMenu`** (verificato sulla porta 5262: Punti deboli e Argomento partono perché ripiegano su `onStartErrors` e `onStartFocus`; gli altri tre aprono il menu vecchio). Con la riga (copia di prova, porta 5272) partono tutti e cinque.
2. **`PracticeMenu`** non serve più: dopo la riga sopra si può togliere dalla vista `practiceMenu` e dall'import; il file `components/PracticeMenu.tsx` resta, non referenziato da nessun altro file, da archiviare.
3. **Elenco della teoria**: `view === 'theory'` senza `initialTopicId` (cioè l'elenco) non è più raggiungibile da nessuna schermata (la Home apre `lezione-dettaglio`). Da decidere: o si lascia così (i 31 argomenti stanno nel Percorso) o si toglie l'elenco da `Theory.tsx` e `App.tsx` passa sempre un id. L'elenco illustrato esiste e funziona (provato con una copia di `App.tsx`).
4. `Esercizi` non usa più `onOpenStats`, `onOpenTheory`, `onOpenTheoryTopic`, `onOpenDiagnostic`: si possono togliere dal JSX in `App.tsx`.
5. `screens/extra/ui.tsx` (non mio) dice ancora «mai un'illustrazione a destra del titolo» nel commento di `Pagina`: ora l'area `destra` ospita l'arte di testata (Percorso, Frasi, Prontuario, Lezione); va aggiornato il commento.

## Controlli eseguiti (numeri)

- `cd app && npx tsc --noEmit`: nessun errore. `npm test` dalla radice: 240 su 240 verdi (tre sono miei, `studio-famiglie`).
- `python3 tools/controlla-testo.py` (soglia 5 parole) su `percorso` e `frasi`, chiaro e scuro: 0 blocchi. Esercizi, lezione, lettore, prontuario, sessione: guardati negli screenshot, solo etichette di 1-3 parole fuori dai testi di contenuto.
- Screenshot letti a occhio a 400 e 1280 px, chiaro e scuro, utente ricco (121 domande viste, 104 imparate, 11 da ripassare) e povero (nessuna risposta): Esercizi (anche con «Argomento» aperto), Percorso, Lezione (in corso e imparata), Teoria (elenco e lettore), Frasi (normale, nessuna preferita, nessun risultato), Prontuario (normale, nessun risultato), sessione (domanda, giusto, sbagliato, fine), «Punti deboli» senza errori. Nessuno scorrimento orizzontale in nessuna delle viste fotografate. Console: solo il 404 di `favicon.ico` del server di sviluppo (già noto, non nostro).
- Illustrazioni: chiare e scure scelte dal CSS, controllate a vista in ogni schermata; nessun fondo bianco abbagliante in scuro nelle viste fotografate.

## Non provato

- La fine sessione è fotografata solo a 400 px (chiaro e scuro, stato ricco): la scena a 1280 px è andata in timeout nello script e non è stata ripetuta. Feedback giusto/sbagliato e sessione: solo stato ricco.
- `tools/controlla-contrasto.py`: richiede `npm run build:demo` (vietato dal brief): contrasto non misurato, solo a occhio; i colori sono token già usati altrove (`basso-testo` su `basso-tinta` per il numero dei punti deboli).
- `npm run check` e `build`: non lanciati.
- Prova delle modalità Intelligente/Blitz/Richiamo dall'app vera (5262): impossibile finché `App.tsx` non passa `onAvvia`; provate sulla copia con la riga aggiunta.
- Altezze diverse da 860 e 900 px, tastiera e lettore di schermo (solo `aria-label` controllati nel codice).
- Utente con ricco = stato fittizio generato per le prove, non dati reali.

## File da cancellare

Nessuno da cancellare per queste schermate; `components/PracticeMenu.tsx` da archiviare quando `App.tsx` non lo usa più. Nella cartella `illustrato/studio/` ci sono anche gli screenshot di scene intermedie (`esercizi_argomento`, `lezione_finita`, `teoria_elenco`, `frasi_vuote`, `frasi_cerca`, `prontuario_cerca`, `risposta_*`, `punti_deboli`, `fine`, `sessione`): servono come prova.
