# NOTE-GRATUITO-R2: componenti (`app/src/components/**`)

Brief: `docs/lavoro/extra/BRIEF-GRATUITO.md`. Percorsi toccati: solo `app/src/components/**`. Nessun git, nessun file cancellato.

## Cosa è stato tolto o cambiato
| File | Modifica |
|---|---|
| `ExamMode.tsx` | via `onNeedPass`, `bloccata`, `entitlement`, `simsDone`, `track`, `canStartSim`, `FORMATS`/`FormatId`, `corpus`, ramo «lucchetto» della schermata di avvio. Un solo formato (`EXAM`), `startExam()` senza argomenti, la prova parte da sola; se non parte c'è l'icona di avviso e «Riprova». Dati da `import { provider } from '../access'`. |
| `esito/EsitoSimulazione.tsx` | via `retryLocked`: il pulsante ↺ «Rifai la simulazione» è sempre attivo. |
| `esito/InfoPunteggio.tsx` | via il ramo «penalità» (era del TENG): resta «Nessuna penalità». `nota` resta opzionale (riga in più in fondo alle regole). |
| `LearnMode.tsx` | via `onNeedPass`, `pass`, `blocked` (il ripasso «Punti deboli» è aperto), `corpus`. Il gruppo delle domande imparate è tutto il banco (`bankMeta()`). `selectPracticeIds` non riceve più `corpus` né `pass`. |
| `StatsMode.tsx` | via `onNeedPass`, il ramo «senza Pass» (riga «Statistiche complete» + Pass), `GuaranteeTracker`, `FEATURE_FLAGS`, voce «Nucleo» del filtro, `PoweredByAtlas`, variabili non usate. Statistiche complete e «Dettaglio» sempre visibili su tutto il banco (613 domande). |
| `PracticeMenu.tsx` | via `onNeedPass`, `selectedCorpus`, `onSelectCorpus`, lucchetto su «Punti deboli». Props rimaste: `onSelectMode`, `onBack`. |
| `Menu.tsx` (home) | via `onNeedPass`, `corpus`, `onStartExam`, uso di `useAccess`. La lezione consigliata non è mai bloccata. Props rimaste: `appState`, `onStartSmart`, `onOpenTheory`, `onOpenTheoryTopic?`, `onApriLezione?`, `onOpenDiagnostic?`, `onOpenImpostazioni?`, `onNaviga?`. |
| `home/Cta.tsx`, `home/Lezione.tsx` | via `bloccato` / `bloccata` e le icone lucchetto. |
| `home/stima.ts` | `lezioneConsigliata(stato)` (via il parametro `pass` e il campo `bloccata`, via `gratisIds`/`FREE_LIMITS`); `esitoSimulazione` e `ultimaSimulazione` usano `EXAM` (via `FORMATS`, il campo `formato` di `Obiettivo` e il riferimento al TENG); `DIAGNOSTIC_QUESTIONS` al posto di `FREE_LIMITS.diagnostic`. |
| `Onboarding.tsx` | via props `user`, `onLogin`, `onOpenPaywall`; via il passo «Salva i progressi» (login), il passo finale «Gratis o Pass» (prezzo, confronto), `track`, `SHOW_LOGIN`. Il flusso finisce al risultato: «Avanti» salva e va alla home. Passi: introduzione, certificazione, OFA, diagnostico, «Se non superi», calcolo, risultato. Props rimaste: `appState`, `onUpdateAppState`, `onFinish`. |
| `FoglioStima.tsx` | via `FREE_LIMITS`, «nucleo gratuito», «con il Pass sono illimitate»; usa `EXAM`. |
| `Layout.tsx` | via `DemoBanner` e la prop `banner`. |
| `ui.tsx` | via `PoweredByAtlas` (firma ATLAS) e l'import di `config/ecosystem`. |
| `CheatSheet.tsx` | via la prop `onNeedPass`. |
| `Toast.tsx` | solo un commento. |

## File da cancellare (non referenziati dal nuovo codice; li cancella il coordinatore)
Sono ancora nel repository e fanno fallire `tsc` finché ci sono (importano cose che R1 ha tolto: `useAccess`, `PoweredByAtlas`, `projectLink`, `lib/firebase`):
- `app/src/components/Leaderboard.tsx`
- `app/src/components/ProjectConsent.tsx`
- `app/src/components/ProjectProfile.tsx`
- `app/src/components/GuaranteeTracker.tsx`
- `app/src/components/PaymentThanks.tsx`
- `app/src/components/DebugMode.tsx` (vista Firebase; `App.tsx` non la importa più)

Non li ho svuotati: il sistema ha bloccato la sovrascrittura come distruttiva. Quando li cancellate, `tsc` resta pulito (vedi sotto).

## Per gli altri (cose che toccano i loro file)
- R3: `screens/extra/studio/Simulazioni.tsx` e `SimulazioneDettaglio.tsx` usano `RegoleFormato` e `InfoPunteggio` con `format: ExamFormat` (ora `EXAM`, senza `id` né `penalty`). `Impostazioni.tsx` importava `PoweredByAtlas`: è stato tolto da `ui.tsx`.
- R3: `Onboarding.tsx` importa ancora da `screens/landing/comune` (`Dato`, `Fatti`, `InfoFoglio`), da `screens/landing/dati` (`CONSEGUENZE`) e da `screens/Footer` (`InfoIndipendenza`): se li togliete o li rinominate, avvisate o aggiornate l'import. `TabellaConfronto` e `BloccoPrezzo` non servono più ai componenti.
- R1: `tests/unit/stima.test.ts` ha ancora (o aveva) casi sul TENG e su `ultimaSimulazione(...).formato`; alla mia ultima prova `npm test` dava 209 su 209 verdi, quindi li avete già sistemati.
- R1: il campo `format` di `ExamHistory` non c'è più: `ExamMode` non lo scrive, `stima.ts` non lo legge.

## Verifiche fatte (server mio su 5252, Chromium, `vite.demo.config.ts`; fermato)
- `cd app && npx tsc --noEmit`: gli unici errori (23) sono nei 6 file da cancellare; nessun errore in tutto il resto, comprese le schermate di R1 e R3 al momento della prova.
- `npm test` dalla radice: 209 su 209 verdi (non ho modificato i test).
- `python3 tools/controlla-testo.py` su `home, lezioni, simulazioni, progressi`, chiaro (e scuro tranne `lezioni`): 0 blocchi lunghi.
- Ricerca `pass|paywall|demo|beta|sblocca|lucchett|premium|nucleo|bloccat|useAccess|track(|teng|FORMATS|firebase|gratis` in `components/` (esclusi i 6 file da cancellare): 0 risultati. Restano solo «prova» nel senso di simulazione («durante la prova») e «Riprova».
- Prove nel browser a 400 px e 1280 px, tema chiaro e scuro (4 combinazioni), stato «ricco» (`stato-ricco.json`, 121 domande viste, 3 simulazioni) e stato vuoto:
  - home: misuratore, «Continua», prossima lezione senza lucchetto; stato vuoto con «Diagnostico»;
  - Lezioni → Esercizi: 4 tessere + «Intelligente», nessun lucchetto; «Argomento» apre il filtro;
  - sessioni «Punti deboli» (400 chiaro), «Blitz» (400 scuro), «Intelligente» (1280 scuro): 10 domande completate fino alla schermata finale (`/613` sul totale del banco); «Richiamo» (1280 chiaro): si carica la prima domanda, non l'ho svolta fino in fondo;
  - Simulazioni → «Inizia la simulazione» → 30 domande → consegna → esito → «Rifai la simulazione» riparte (400 chiaro e 1280 scuro, svolta fino in fondo); le altre due combinazioni solo fino alla schermata di avvio della prova;
  - Profilo → Progressi → Dettaglio (statistiche complete): 613 domande, filtro «Tutte / Grammatica» senza «Nucleo», in tutte e 4 le combinazioni;
  - onboarding completo in tutte e 4 le combinazioni: intro → certificazione → OFA → 10 domande → «Se non superi» → calcolo → risultato → «Avanti» → home con la stima calcolata.
- Scorrimento orizzontale: nessuno in tutte le viste provate. Errori in console: 0 dei miei; solo `favicon.ico` 404 del server di sviluppo (e, una volta, una richiesta CSS interrotta dal ricaricamento a caldo quando altri agenti modificavano file).

## Cosa non ho provato
- `npm run build:demo` e `npm run build` (le fa il coordinatore; il brief vietava di lanciarle nella fase di lavoro dei singoli agenti).
- Gli screenshot a occhio sono stati guardati solo per home, Esercizi, esito simulazione, Progressi e introduzione dell'onboarding; le altre viste le ho verificate dal testo e dall'assenza di errori, non guardando ogni immagine. Le immagini stanno in `/tmp/claude-0/-home-user-AddiOfa/553cbc19-7099-5f91-95ed-46eecd1a1a4a/scratchpad/r2/` (non nel repository).
- «Richiamo» fino in fondo e «Argomento» con una scelta effettiva.
- Il comportamento con un salvataggio vecchio che contenga simulazioni con `format: 'teng'`: il campo viene ignorato e il punteggio letto come numero di esatte (formato unico); non ho un salvataggio di quel tipo da provare.
