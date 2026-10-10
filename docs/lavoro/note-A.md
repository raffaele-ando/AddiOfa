# Note agente A (cuore dell'app)

## Fatto
- `access/`: `localProvider.ts` (demo, localStorage con ripiego in memoria), `apiProvider.ts` (Worker `/v1/...`, errori in italiano, `X-Device` anonimo + Bearer Firebase se c'è), `createProvider.ts`, `AccessProvider.tsx` (prop `history`; accetta anche `provider` per le prove), `index.ts`.
- `lib/firebase.ts`: nessun init all'import; `getAuthInstance`, `getDb`, `getIdToken`, `signInWithGoogle` (lancia `LoginError` con messaggio da mostrare, niente alert), `logout`, `onAuthChange`, `isDemoMode`. `storage.ts` e `atlas.ts` adeguati (cloud solo con utente e non in demo; import dinamico di firestore). `importData` valida meglio il file.
- `components/Toast.tsx` (`ToastProvider`, `useToast()`); nessun `alert` nei miei file.
- `App.tsx`: tutte le viste del brief, `AccessProvider` + `ToastProvider` attorno, pila di ritorno per paywall/legale/lista d'attesa, `paywallReason`, `legalSection`, landing per i nuovi, `?pagamento=ok` -> thanks (con riletture del Pass finché non arriva), `?brand` solo in DEV (BrandKit e DebugMode non entrano nella build di produzione), profilo/classifica/consenso/login dietro `FEATURE_FLAGS`, Esporta nascosto in demo, Importa con messaggi nella pagina.
- Menu, Navigazione (voce Teoria, scheda "Pass", lucchetti), Layout (`DemoBanner` chiudibile solo per la sessione, prop `banner`), Footer legale in fondo al Menu.
- Nella parte gratuita il corpus attivo è sempre `initial` (App passa uno stato "vista" con `selectedCorpus='initial'` a Menu e LearnMode, senza salvarlo); "Tutte le frasi" ha il lucchetto e porta al paywall (`domande`).

## Provato
`tsc`: nessun errore nei miei file (restano le props `onNeedPass` e altro in file di altri agenti). Chromium a 400 px, chiaro e scuro: parte senza errori in console, nessuno scorrimento orizzontale, landing per i nuovi, menu con lucchetti (Ripasso errori, Teoria, Statistiche, Tutte le frasi, scheda Teoria) e contatore "1 simulazione gratuita", Pass -> paywall -> "Sblocca il Pass in prova" -> contatore "Simulazioni illimitate" e zero lucchetti. Simulazione gratuita esaurita -> paywall `simulazione`. LocalProvider provato in Node (ente 30 domande, punteggio, TENG = `formato_non_disponibile`, lista d'attesa, inviti, recesso). `build:demo` con `VITE_MODE=demo` riesce (2,0 MB, nessuna traccia di Firebase).

## Cosa mi aspetto dagli altri
- `screens/Theory.tsx` (H): default export con `{ onBack, onOpenPaywall, initialTopicId? }`. Finché manca, App usa `import.meta.glob` con un segnaposto "La teoria arriva presto"; a file presente si può sostituire con `lazy(() => import('./screens/Theory'))`.
- `ExamMode`, `LearnMode`, `PracticeMenu`, `StatsMode`, `CheatSheet` devono accettare `onNeedPass(reason: PaywallReason)` (App la passa già; oggi tsc segnala "Property 'onNeedPass' does not exist").
- `ExamMode.onComplete` ha un quarto parametro opzionale `format?: FormatId` (App scrive `format` nello storico, ripiego `'ente'`). App traccia `sim_done`; `ExamMode` deve tracciare `sim_started` (`useAccess().track`), usare `provider.startExam` e, su `formato_non_disponibile`, mostrare "in arrivo".
- Tracciamento: App fa `paywall_seen` (a ogni apertura del paywall) e `diag_done`; `Waitlist` (B) deve fare `waitlist_join`; il Paywall non deve ripetere `paywall_seen`.
- `LearnMode` usa ancora `correctIndex`/`explanation` su `PublicQuestion` (errori tsc): vanno presi da `provider.grade`.
- `Onboarding`: App gli passa `onLogin` sempre (se il login è spento mostra un messaggio "non disponibile"): meglio che nasconda il pulsante di accesso.

## Richieste a chi coordina
- `vite.demo.config.ts` non imposta `VITE_MODE=demo`: senza `VITE_API_URL` il provider è comunque Local e Firebase non parte, ma conviene aggiungere `define: { 'import.meta.env.VITE_MODE': '"demo"' }`.
- `components/Plans.tsx`: App non lo importa più; il file resta (lo toglie B).
- `app/.env*` ha variabili vecchie; servono `VITE_MODE` e `VITE_API_URL`.

## Non mi convince
- Il corpus gratuito è "le prime 60" (`INITIAL_CORPUS_COUNT`) finché `contenuti/` non marca il nucleo (`core`).
- Barra in basso: "Classifica" sparisce (flag spento) e "Pass" c'è solo senza Pass; con la teoria sono 5 voci a 400 px: ok ma stretta.
- In `Layout` la cornice non è più `h-full` ma `flex-1 min-h-0` (per far posto al banner). Verificato a 400 px, non a 1280.
