# Illustrato, Profilo e servizi (agente ILLUSTRATO-PROFILO)

Porta di prova 5265. Immagini in `docs/lavoro/extra/illustrato/profilo/`: `<vista>-<povero|ricco>-<chiaro|scuro>-<400|1280>.png` e le coppie concept | app `coppia-*.png` (profilo, progressi, obiettivi, badge, impostazioni, modifica). Pagina di prova nuova: `app/tests/anteprime/stati-profilo.{html,tsx}` (ErrorBoundary, Toast, Impostazioni, Legal).

## Schermata → concept → illustrazioni → cosa non somiglia ancora

| Schermata | Concept | Illustrazioni usate | Cosa non somiglia e perché |
|---|---|---|---|
| **Profilo** (hub) | 06.1 e 06.8 (avatar, nome, livello), 44 (sfere) | testata: avatar o, senza nome né avatar, `verifica-utente` 96; tessere 2x2: `sfera-risultati` (Progressi), `sfera-successi` (Obiettivi), `celebrazione-fiocco` (Badge), `sfera-opportunita` (Progetto, apre `esplora`); righe: `sfera-faq` (FAQ), `sfera-addiofa` (Presentazione) | Il concept ha una foto, il Project ID, quattro numeri, tre statistiche e gli obiettivi attivi direttamente nella pagina: qui, per scelta dell'utente, sono tessere. Sotto la parola delle tessere c'è un dato vero solo se esiste (stima %, giorni al test, badge n/m). Foto e Project ID non ci sono (niente account). Segnala e i tre testi legali hanno icone (non esistono sfere per loro) |
| **Impostazioni** | 06.13 | `sfera-addiofa` sulla riga Versione | Il concept ha Account, Notifiche, Collegamenti: senza server non ci sono. Restano Tema, Suoni, Dati (importa, esporta o copia, cancella), Versione con «i». FAQ, Segnala, legali e Presentazione sono passati al Profilo (una funzione, un posto) |
| **Progressi** | 18.2, 19.2, 06.9 | testata `L: progressi-statistiche` 160; `sfera-risultati` 48 sul titolo «Argomenti»; `ricerca-scintille` 96 quando non c'è nessun dato (con «Diagnostico» e «Studia»); `piano-superamento` 96 nel calendario senza attività | La panoramica è `StatsMode` (fuori dal mio perimetro, non l'ho toccata). Il radar e il calendario sono quelli esistenti, il concept ha solo barre e un grafico |
| **Obiettivi** | 06.10 | `obiettivo` 120 in testata; `L: accesso-bloccato` 136 nella carta «Scadenze» (le tre scadenze del piano del 2° anno, prima nascoste nel foglio ⓘ) | `notifica` sulla riga «Ricordami» non c'è: il promemoria non esiste (servirebbe un server o le notifiche push), non lo disegno. Obiettivo principale «Supera l'OFA 82 % → 28 %» del concept non si copia (numeri inventati): la carta «Probabilità» mostra la stima vera |
| **Badge** | 06.11 | griglia a tre colonne come il concept; arte di ogni badge del kit (72 px), tutta grigia e opaca se bloccato; costanza → `piano-superamento`; foglio con l'arte e, se ottenuto, `celebrazione-fiocco` 96; filtro vuoto: `vuoto` / `celebrazione-fiocco` | Il concept mette un lucchetto sui bloccati: non lo uso (niente lucchetti, tutto è aperto), c'è la barra con n/m. Le categorie del concept (serie di giorni, sfida, top 10) sono sostituite dai gruppi veri dell'app |
| **Modifica profilo** | 06.14 | `cappello-laurea-orologio` 120 sopra «Corso»; le dieci illustrazioni d'avatar restano | Niente foto, username, email, bio (non ci sono account) |
| **FAQ** | 44 (icona FAQ), 49 | testata `L: messaggi-supporto` 160; filtro con `sfera-ofa` (Il test), `sfera-quiz` (Lo studio), `sfera-app` (L'app); nessun risultato: `ricerca-scintille` 96 | «I tuoi dati» non ha una sfera adatta: resta l'icona dati. Il piano prevedeva anche `sfera-costi`: non c'è una categoria Costi (la FAQ «è gratis?» sta in L'app) |
| **Segnala** | 13, 16, 17 | `messaggi` 168 in testata; dopo «Prepara»: `documento-in-corso` 96 | Il piano prevede `documento-completato` per «inviata»: non lo uso perché la segnalazione NON parte (sito statico) e il segno verde direbbe il falso; «in corso» è il meno ingannevole. `documento-errore` per la copia non riuscita non serve: c'è già il messaggio «Selezionalo a mano» |
| **Stato vuoto** | 08, 16, 17 | `vuoto` (nuvola) 120; con `?illustrazione=ricerca-scintille` la ricerca senza risultati | |
| **Offline** | 08 | `mondo-globo` 168 | |
| **Errore** (`ErrorBoundary`) | 08, 16 | `documento-errore` 120 | |
| **Caricamento / Splash** | 30.1, 49.1 | Splash: marchio 72 e lo spinner `Caricamento` (nessuna illustrazione, come da piano); tolto il motto «Studia oggi, sblocca il tuo domani» (conteneva «sblocca» e 6 parole) | Il concept ha un motto: non c'è un testo approvato |
| **Pagine legali** | — | `sfera-addiofa` 56 sopra il titolo | Il testo non è mio (`src/legal/*`) |
| **Toast, Footer** | — | nessuna (sono messaggi e riga di piè di pagina) | |

Le illustrazioni compaiono tutte con `Disegno` (`servizi/componenti.tsx`), ora un involucro di `Illustrazione`: chiaro/scuro scelto dal CSS, parametro `kit` per il luminoso. Non ci sono icone al posto di illustrazioni mancanti.

## Cambi di codice (file toccati)

`profilo/{Profilo,Progressi,ProgressiArgomenti,ProgressiCalendario,Obiettivi,Badge,ProfiloModifica,componenti}.tsx`, `Impostazioni.tsx`, `servizi/{componenti,StatoPagina,StatoVuoto,Offline,Faq,Segnala}.tsx`, `brand/Splash.tsx`, `components/ErrorBoundary.tsx`, `screens/Legal.tsx`; nuovo `tests/anteprime/stati-profilo.{html,tsx}`. `Toast`, `Footer`, `Radar`, `tono`, `BottoneSegnala`, `SplashExtra`, `index.ts` non toccati (non serviva).
- `TesseraIcona` (profilo/componenti) sostituita da `TesseraIllustrata`; nuovi `GruppoRighe` e `RigaElenco`.
- `Progressi`: usa `ctx.avviaDiagnostico` direttamente (ora esiste nel contesto); senza alcun dato mostra lo stato vuoto con «Diagnostico» e «Studia».
- `Impostazioni` accetta ancora `onOpenLanding`, `onOpenLegal`, `onVai` (App li passa) ma non li usa più.

## Richieste per `App.tsx` e agli altri

1. **`esplora`** deve essere registrato dall'agente PROGETTO: la tessera «Progetto» lo apre sempre (con `vai('esplora')`); finché manca, App mostra «Pagina non trovata».
2. Importa progressi: la riuscita e il fallimento li gestisce App (`fileInputRef`). Per mostrare `documento-completato` / `documento-errore` (piano §3.4) serve che App passi a `Impostazioni` l'esito (es. `esitoImporta?: 'ok' | 'errore' | null`) oppure che mostri un foglio con `StatoPagina`. Oggi c'è solo l'eventuale messaggio di App.
3. La pagina «Pagina non trovata» di App (`ricerca-scintille` 168 per il piano) è in App.tsx, non mia.
4. `lib/profilo/badge.ts` (non mio): il badge `argomenti-20` usa `risultato-probabilita`, il cui disegno ha scritto «82 %». In `Badge.tsx` lo sostituisco con `progressi-statistiche-scheda`; meglio cambiarlo anche alla fonte. Sempre lì, i badge di costanza usano tre arti diverse e io le uniformo a `piano-superamento` come da piano.
5. Da cancellare a mano (nessun `rm`): nessun file nuovo da togliere. Non più raggiunti dal vecchio giro: `servizi/Noi,Agora,Esplora,AtlasAnalisi.tsx` e `profilo/{Calendario,Attivita}.tsx` se ancora presenti (già elencati in NOTE-INTUITIVO-PROFILO).

## Controlli eseguiti (numeri)

- `cd app && npx tsc --noEmit`: pulito sui miei file (a metà lavoro altri agenti avevano errori in `sfide/Amici.tsx`, `lib/progetto/validazione.ts`, `studio/Simulazioni.tsx`; all'ultimo controllo l'intero progetto era pulito).
- `npm test` dalla radice: 240 prove, 240 verdi.
- `python3 tools/controlla-testo.py` a 400 px, soglia 5 parole: 0 blocchi su profilo, progressi, obiettivi, badge, faq, segnala, stato-vuoto, offline, profilo-modifica (chiaro) e su profilo, progressi, obiettivi, badge, faq (scuro). Stato povero (senza dati).
- `tools/controlla-contrasto.py --pagina` (390 px, chiaro e scuro, stato povero): 0 violazioni su profilo, badge, obiettivi, faq, segnala, progressi. Il test non ha gli stati ricchi né il tema scuro con dati.
- `tools/controlla-illustrazioni.py`: le illustrazioni del piano per queste schermate sono ora usate; l'elenco di quelle ancora ferme appartiene alle altre aree.
- Chromium (Playwright, `/opt/pw-browsers/chromium`): 14 viste a 400 px × chiaro/scuro × povero/ricco (56 immagini) e 8 viste a 1280 px × chiaro/scuro × povero/ricco (32 immagini), lette a occhio: profilo, profilo-modifica, progressi (3 sezioni), obiettivi, badge, faq, segnala, stato-vuoto, offline, splash, impostazioni, errore, legal. Nessuno scorrimento orizzontale (`scrollWidth − clientWidth` = 0 in tutte le viste fotografate), nessun errore in console oltre a quelli volutamente generati dalla pagina di prova dell'ErrorBoundary. Nel giro a 400 px lo scorrimento orizzontale era filtrato dal mio script (stampavo solo le righe con errori): lo avevo letto 0 in tutte le prove precedenti delle stesse viste; a 1280 px le 32 righe sono tutte 0.
- Stato ricco: 380 domande con risposte, 6 simulazioni, 45 giorni con attività, profilo e obiettivi impostati (generato da me con i dati del banco, non è un utente vero).

## Non provato

- Clic su «Progetto» fino a `esplora` (non registrato) e su «Presentazione» / legali dal profilo fino in fondo (provati solo a vista, non cliccati).
- `piano-superamento` nel calendario senza attività: il ramo si raggiunge solo con risposte ma senza giorni, tempo né simulazioni; con il mio stato ricco non compare e non l'ho forzato. Compila (tsc), ma non l'ho visto.
- Il foglio ⓘ delle Impostazioni (scritto, non fotografato aperto). Il foglio del badge, bloccato e ottenuto, sì: `badge-foglio-*-chiaro-400.png`.
- Altezze diverse da 860/900/1250/1500 px; `npm run build`, `build:demo` e `npm run check` non lanciati (la regola dei brief lascia `check` al coordinatore; `tsc` e `npm test` sì).
- Toast con illustrazione: non ne ha, è un messaggio.
