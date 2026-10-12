# NOTE-SERVIZI: Esplora, Project ID, Analisi, NOI, Agorà, FAQ, Segnala, stati e Splash

Agente SERVIZI, 12/10. Nessun git, nessun `rm`. Screenshot in `docs/lavoro/extra/servizi/` (nome-larghezza-tema.png).

## Schermate (id, cosa fa, concept, cosa è vero)

| id | Cosa fa | Concept | Vero / lasciato fuori |
|---|---|---|---|
| `esplora` | Hub a 3 gruppi (Per studiare, Ecosistema Project, Aiuto) con 9 carte; ogni carta ha l'etichetta «Disponibile ora», «Richiede il Project ID», «Solo informazioni» o «Non ancora attiva». Una carta verso una schermata non registrata diventa «Non ancora attiva» (controlla `SCHERMATE`). | 49, 13 | Niente immagini fotografiche dei concept (ATLAS/NOI/Agorà con foto), niente conteggi né novità inventati. |
| `projectid` | Cos'è, i 4 permessi veri (`config/ecosystem.ts`, uguali a `atlas/src/scopes.ts`), cosa non si condivide, stato del collegamento (demo / interruttore spento / ATLAS non configurato / attivo / collegato con data e permessi). Il pulsante, se non attivo, spiega perché e dichiara che nessun accesso né dato è partito; se attivo porta alle Impostazioni (dove esiste il login). | 30, 34, 36 | Nessun login finto, nessun profilo finto. Funziona con `FEATURE_FLAGS.projectId` spento. |
| `atlas-analisi` | Stima + intervallo all'80 % (stesso modello della Home), radar sugli argomenti con più risposte (max 8), aree da migliorare (<85 % con ≥3 risposte), elenco dei 31 argomenti con percentuale/risposte/imparate, fattori (fonte della stima, tipo e livello), serie delle stime misurate, spiegazione del calcolo. Stato vuoto con invito al diagnostico. | 30/34, 36, 21/25 | Solo dati dell'utente. Niente «AI», niente confronto con altri, nessuna proiezione. |
| `noi` | Stato onesto per 7 casi (demo, Project ID spento, classifica spenta, ATLAS non raggiungibile, da collegare, da aderire, aderito). I «tuoi numeri» sono quelli che l'app invierebbe (domande imparate, miglior punteggio, stessa formula di App.tsx), dichiarati come NON una posizione. La posizione compare solo se `aderito` e il servizio risponde (`atlas.leaderboard`). Rimanda a `classifica` (amici). | 30, 34 | Nessuna classifica, nessun utente, nessuna posizione inventati. |
| `agora` | Dice che Agorà è un forum degli studenti non collegato ad AddiOFA, a cosa servirà «nei piani» e cosa fare intanto (FAQ, inviti, Esplora). | 13, 36, 49 | Nessuna discussione, commento o utente. |
| `faq` | Ricerca (tutte le parole, senza accenti), 4 categorie (Il test, Il Pass e i pagamenti, I tuoi dati, L'app), 19 voci a fisarmonica con link a pagine legali e ad altre schermate. Le risposte leggono `config/offer.ts` e gli interruttori (pagamenti spenti, garanzia, Project ID). | 44, 49 | Niente TENG, niente promesse di rimborso/garanzia, pagine legali dichiarate bozze. |
| `segnala` | Tipo (domanda sbagliata, spiegazione, problema app, suggerimento), testo, parametri `domanda`, `tipo`, `errore`. Salva in `useExtraDati('segnalazioni')` (max 50), riepilogo con testo copiabile (con ripiego selezionabile), elenco con «Rivedi e copia» ed «Elimina». | 13/16/17 | **Non c'è un invio**: `access/provider.ts` ha solo eventi fissi (`TrackEvent`), non testi liberi, e nel repo non c'è un indirizzo di contatto. La schermata lo dichiara: «salvata solo su questo dispositivo, non inviata a nessuno». |
| `BottoneSegnala` | Componente `screens/extra/servizi/BottoneSegnala.tsx`, senza contesto: `<BottoneSegnala domandaId={q.id} onApri={id => vaiExtra('segnala', { domanda: id })} />`. | 13/16/17 | Da collegare (vedi sotto). |
| `stato-vuoto` | Parametri `titolo`, `testo`, `azione` (id schermata o `home`), `etichetta`, `illustrazione`. | 16/17 | |
| `offline` | «Sei offline: i progressi restano sul dispositivo» (ascolta `online/offline`; da online dice «La connessione c'è»). | 16/17 | |
| `splash` + `app/src/brand/Splash.tsx` | Marchio grande, motto, statica. `<Splash />` (cornice, `h-full`) o `<Splash pienoSchermo />` (`min-h-[100dvh]`, fondo `fondo`). | 13/30/31/36/49 | Il concept ha sfondo blu pieno: qui sfondo a token (chiaro/scuro), perché il marchio è monocolore `fill-testo`. |
| `ErrorBoundary` | Stessa pagina di stato: «Qualcosa non ha funzionato», «Riprova» (ricarica) e «Segnala il problema» (apre `?vista=segnala&tipo=app&errore=…` con il solo messaggio dell'errore, mai lo stack; se il browser non naviga mostra il testo da copiare). | 16/17 | |

Componenti comuni: `componenti.tsx` (Pagina, Sezione, Nota, bottoni, `Disegno`, `copiaTesto`), `StatoPagina.tsx` (senza contesto: la usa anche l'ErrorBoundary), `Radar.tsx` (SVG senza `<text>`, etichette in HTML).
Logica pura in `app/src/lib/servizi/`: `analisi.ts`, `collegamento.ts`, `esplora.ts`, `faq.ts`, `segnalazioni.ts`.

## Modifiche a componenti esistenti (dietro flag spenti)
- `Leaderboard.tsx`: in classifica si mostra solo `@nome utente` (prima anche il nome vero), come dice il consenso («il tuo @nome utente, le domande imparate e il miglior punteggio»).
- `ProjectProfile.tsx`: tolti `window.confirm` (ora conferma in pagina) e il download via link (ora i dati si copiano e si mostrano selezionabili).
- `ProjectConsent.tsx`: non toccato.

## Richieste al coordinatore
1. Registro: già fatto in `servizi/index.ts` (10 id). Aggiungere «Esplora» al Menu/Impostazioni con `vaiExtra('esplora')` (io non tocco `Menu.tsx`/`Impostazioni.tsx`).
2. Splash: usare `<Splash />` come `fallback` dei `Suspense` e `<Splash pienoSchermo />` come caricamento iniziale in `App.tsx`/`main.tsx`.
3. `BottoneSegnala` accanto alle domande (QuizMode/LearnMode/esito) con `onApri={id => vaiExtra('segnala', { domanda: id })}`.
4. `ExtraCtx` non ha un `avviaDiagnostico`: l'Analisi vuota manda alla Home (`vaiHome`), dove c'è il banner «Fai il diagnostico». Se si aggiunge `avviaDiagnostico` al contesto, basta sostituirlo nel pulsante.
5. Segnalazioni: per inviarle davvero serve un indirizzo di contatto o un endpoint del Worker (`pass/`) che accetti testo libero senza dati personali, più un tipo in `TrackEvent`. Finché non c'è, la schermata dice la verità e dà il testo da copiare.
6. Il testo del consenso e `Leaderboard` ora coincidono (solo @nome); resta da decidere se il Worker deve smettere di restituire `displayName` nella classifica.
7. Il `Menu.tsx` mostra la riga «Classifica NOI» solo con `FEATURE_FLAGS.leaderboard`: si può puntare a `vaiExtra('noi')` anche a flag spento (spiega lo stato).

## Proposta onesta per «Già sostenuto? / Email Polimi» (concept 31) — non implementata
Non si chiede né si verifica nessuna email @polimi.it per studiare (regole di prodotto, e la FAQ lo dichiara). Proposta: una domanda facoltativa nell'onboarding «Hai già sostenuto il test o hai una certificazione?» con tre risposte (sì / no / non so), che non blocca nulla e non verifica nulla; salva solo la scelta in locale (c'è già `onboarding.hasOfa`) e, se «sì», mostra una nota che il riconoscimento si fa con il Politecnico e rimanda alla FAQ «Ho già una certificazione…». La verifica email resta solo dove c'è già (Inviti, dove serve a contare i compagni).

## Prove (numeri)
- `npx tsc --noEmit`: pulito sui miei file (l'unico errore visto, `studio/index.ts` → `./Statistiche`, era un file ancora da scrivere dell'agente STUDIO).
- Test: 27 nuovi in `app/tests/unit/servizi-{analisi,collegamento,faq,segnalazioni}.test.ts`, tutti verdi; `npm test` dalla app: 179/179 verdi all'ultima corsa (include i test degli altri agenti presenti allora).
- Chromium, dev server demo porta 5204: ogni schermata a 400 e 1280 px, chiaro e scuro (36 screenshot di base + varianti), screenshot riletti. Controllo automatico di scorrimento orizzontale: nessuno. Console: nessun errore di pagina; compare un solo «404 Not Found», ed è `/favicon.ico` del server di sviluppo alla prima pagina (landing), non una risorsa delle mie schermate.
- Analisi provata con 4 stati: ricco (diagnostico + 2 simulazioni + 18 argomenti con risposte), solo diagnostico, solo ripasso, vuoto.
- Interazioni provate: ricerca e categorie FAQ, apertura voce, salvataggio/copia/elimina di una segnalazione (copia negli appunti con permesso), bottone Project ID che spiega, navigazione Esplora → Agorà → indietro, ErrorBoundary forzato (componente rotto di proposito) con «Segnala il problema», offline simulato.

## Non provato
- Contrasto con `tools/controlla-contrasto.py`: non lanciato (uso solo token di coppie già usate dall'app: `medio-testo` su `medio-tinta`, `alto-testo` su `alto-tinta`, `azione-scuro` su `azione-tinta`).
- Stati `attivo`, `collegato`, `aderito` di Project ID e NOI nel browser: richiedono flag accesi e un Worker ATLAS; sono coperti solo dai test della logica (`servizi-collegamento.test.ts`), non da una prova di rete.
- `npm run build:demo` non lanciato (vietato dal brief: cancella `dist-demo/`).
- 400 px: la verifica è fatta su 400; non su larghezze inferiori (320).
