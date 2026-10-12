# NOTE-PROFILO (agente PROFILO, 12/10)

Codice: `app/src/screens/extra/profilo/` (6 schermate + `componenti.tsx`), logica pura in `app/src/lib/profilo/` (`dati`, `livello`, `badge`, `giorni`, `obiettivi`, `attivita`, `tipi`), test in `app/tests/unit/profilo-livello-badge.test.ts` e `profilo-giorni-obiettivi.test.ts`, e `app/src/screens/Impostazioni.tsx`. Screenshot in `docs/lavoro/extra/profilo/` (nome: `<schermata>-<pieno|vuoto>-<larghezza>-<chiaro|scuro>.png`, con `-fondo` dopo lo scorrimento; i flussi sono `flusso-*`, `impostazioni-conferma-*`, `calendario-test-*`, `profilo-pass-*`).

## Richieste al coordinatore (App.tsx, Menu.tsx, types.ts non toccati)
1. **Impostazioni**: passare queste props opzionali (senza, funziona lo stesso, ma in modo più rozzo):
   - `onVai={vaiExtra}` per le righe «Il tuo profilo» (profilo-modifica), «Obiettivo giornaliero», «Domande frequenti» (faq), «Segnala un problema» (segnala). Senza `onVai` la riga ricarica la pagina con `?vista=<id>` (in dev funziona, in un Artifact no) e «indietro» porta alla home.
   - `corpus={corpusAttivo}` e `onCambiaCorpus={handleSelectCorpus}`: con il Pass compare la scelta «Nucleo / Tutto il banco» (non provata in Chromium: serve App.tsx). Senza il Pass compare la riga informativa.
   - `onReset` è facoltativa: senza, «Cancella i dati» toglie dal localStorage `ofa_polimi_app_state` e `addiofa_diagnostico_ultimo` e ricarica la pagina (provato). Non tocca il Pass né l'id del dispositivo.
2. **Menu**: l'icona utente in alto a destra della home apre `apriImpostazioni`; per arrivare al profilo basta `vai('profilo')` (la schermata ha l'ingranaggio verso Impostazioni). Il profilo è `barra: 'home'`.
3. L'hub mostra le righe Statistiche, Sfide, Amici, Classifica, Esplora solo se l'id è registrato in `SCHERMATE` (controllo a runtime su `registro.ts`); «Inviti» usa `apriInviti()`.

## Schermate
| id | Cosa fa | Concept |
|---|---|---|
| `profilo` | Hub: ingranaggio → Impostazioni; avatar, nome («Studente» se vuoto), corso; riquadro «Livello attuale»; 4 tessere vere (giorni di studio, domande imparate, simulazioni fatte, tempo totale); carta Pass (attivo/scadenza/in prova oppure «Scopri il Pass»); righe verso le altre schermate | NN 18 (scheda 1), 06 (Profilo), 22, 31, 36/49 |
| `profilo-modifica` | Nome (30 car.), avatar (lettera o 10 illustrazioni del kit), corso (60 car.). Salva solo con «Salva» (disabilitato senza modifiche); «Annulla» e «Indietro» non cambiano nulla | 06 (Modifica profilo) |
| `obiettivi` | Data del test (facoltativa, scelta dall'utente; giorni mancanti, oggi, passata; elenco `OFA_DEADLINES` come riferimento), minuti al giorno (10-90, default 30) con avanzamento di oggi e ultimi 7 giorni, probabilità da raggiungere (50-90 %, default 70) contro la stima vera (`calcolaStima`) | 06 (Obiettivi), 25, 31 |
| `calendario` | Mese da lunedì, navigazione tra mesi, giorni studiati pieni, oggi cerchiato, data del test con bandierina; dettaglio del giorno (domande, tempo, simulazioni); riepilogo del mese | 06 (Calendario) |
| `badge` | 19 traguardi in 4 gruppi con filtro Tutti/Sbloccati/Da sbloccare; i bloccati mostrano condizione e avanzamento vero; illustrazioni del kit (in grigio con lucchetto se bloccati); nessun punteggio | 06 (Badge) |
| `attivita` | 7 o 30 giorni: totali, due grafici a barre statici in CSS (domande e minuti per giorno), elenco giorno per giorno, ultime 5 simulazioni con esito | 06 (Attività), 18 |
| Impostazioni | Sezioni Account, Preferenze (tema, suoni, domande da studiare), Promemoria, Sito, Il tuo Pass, Privacy e dati, Aiuto, Informazioni; righe già presenti mantenute | 36 (14), 49, 06, 30 |

## Definizioni (scritte nel codice e mostrate all'utente)
- **Livello attuale** (`lib/profilo/livello.ts`): una domanda è «imparata» secondo `isLearned`; un livello (A1, A2, B1) è raggiunto quando è imparato almeno il 60 % delle sue domande e sono già raggiunti i livelli sotto; il livello attuale è l'ultimo raggiunto, altrimenti «Da definire». Si conta sulle domande studiabili adesso (nucleo, o tutto il banco con il Pass); con il Pass vale anche il livello raggiunto sul solo nucleo (`livelloConNucleo`), così non si «perde» comprando il Pass. Il testo dice che non è una certificazione.
- **Giorno di studio** (`giorni.ts`): almeno una risposta (`dailyActivity`), una simulazione (`history`) o 60 secondi di studio attivo (`dailyTimeSpent`, che App conta solo in esercizi, simulazioni e diagnostico). Nessuna serie né fiamma.
- **Badge** (`badge.ts`): 19 in 4 gruppi: Studio (prima domanda, 25 e 100 domande imparate, primo argomento, 10 e 20 argomenti, tutti gli argomenti, memoria a lungo termine = 10 domande imparate con intervallo di ripasso ≥ 7 giorni, accuratezza ≥ 80 % su almeno 100 risposte, 5 ore di studio), Simulazioni (prima, una superata 25/30, tre superate: solo formato test di recupero), Costanza (7, 14, 31 giorni di studio, anche non consecutivi), Livello (A1, A2, B1). Un argomento è «padroneggiato» con almeno l'80 % delle sue domande imparate (e almeno 3 domande nel banco). Quelli visti sbloccati si salvano in `extra['badge-sbloccati']` (id → data in cui sono stati visti) e restano sbloccati; i bloccati che con le sole domande gratuite non si possono raggiungere dicono «serve il Pass».
- Dati salvati: `extra.profilo`, `extra.obiettivi`, `extra['badge-sbloccati']` (tutti nell'esportazione).

## Cosa è vero e cosa è stato lasciato fuori
- Tutto deriva da `appState` (stats, history, dailyActivity, dailyTimeSpent, onboarding). Nessun dato di altre persone, nessun punteggio/XP, nessuna proiezione («-6 % per lezione»), nessuna data suggerita.
- **Promemoria**: non ci sono notifiche vere (nessun servizio le spedisce), quindi nessun interruttore: la sezione dice «Non disponibili» e rimanda all'obiettivo giornaliero e a una sveglia del telefono.
- **Login Project ID**: la riga resta solo se `utente`/`onLogin` arrivano da App (spento nel lancio).
- Lasciati fuori dal concept: Project ID/handle, «punti totali», «livello» numerico, streak, sfide e classifica (area SFIDE), foto profilo, email/username/bio.
- Il campo data usa il controllo nativo del browser: il formato di visualizzazione dipende dalla lingua del browser.

## Prove (Chromium, demo su porta 5201)
- `npx tsc --noEmit`: pulito. `npm test` (cartella app): 217 test verdi al momento dell'ultima prova (con i test degli altri agenti), 27 sono miei in due file (livello, badge e profilo; giorni, calendario, attività e obiettivi; provati anche con TZ America/Los_Angeles, Pacific/Auckland, UTC, Europe/Rome).
- Le 6 schermate extra e Impostazioni, a 400 e 1280 px, tema chiaro e scuro, con uno stato pieno (38 domande imparate, 11 giorni di studio, 3 simulazioni, stima dal diagnostico) e uno vuoto (utente nuovo): 56 combinazioni, nessuno scorrimento orizzontale, screenshot riletti a occhio. Zero errori in console, salvo un 404 di `/favicon.ico` della pagina base (non delle schermate; nella build demo i link alle icone sono tolti).
- Flussi provati: modifica profilo (nome ripulito, avatar, salvataggio, nome vuoto → «Studente», «Salva» disabilitato senza modifiche); obiettivi (minuti, %, data di oggi/passata/togli, salvataggio); calendario (mese precedente/successivo, giorno studiato, giorno futuro, data del test); badge (filtri, con e senza Pass); attività 7 e 30 giorni; Impostazioni (conferma in-app di cancellazione con Annulla e con «Cancella tutto», che svuota lo stato; copia dei progressi negli appunti; riga profilo via `?vista=`); stato con dati rovinati (profilo/obiettivi/badge non oggetti, chiavi di data sbagliate): nessun errore.
- Contrasti calcolati sui token usati (chiaro/scuro): tutti ≥ 4,5:1; il testo azione su `azione-tinta` in tema chiaro era 4,24:1 e usa `azione-scuro` (5,5:1).
- NON provato: `onVai`, `corpus`/`onCambiaCorpus` di Impostazioni con App.tsx collegato (le props non sono ancora passate); righe Esplora/Sfide ecc. dell'hub oltre all'apparire; lettura con screen reader; uso reale in un Artifact.
