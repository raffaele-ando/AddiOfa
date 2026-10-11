# Note BLU: il colore d'azione dell'app passa da rosso a blu

## Cosa ho fatto
- Rosso di marca sostituito con il blu in `app/src` (27 file tra `components/`, `components/home/`, `screens/`, `brand/`).
  Mappa: `#EF4444`→`#2563EB`, hover `#DC2626`→`#1D4ED8`, testo su tinta `#B91C1C`→`#1D4ED8` (chiaro) / `#93C5FD` (scuro),
  `#FEE2E2`→`#DBEAFE`, `#FEF2F2`/`#FEEEEE`→`#EFF6FF`, `#FCA5A5`→`#93C5FD`, `#F87171`→`#60A5FA`, `#7F1D1D`→`#1E3A8A`,
  `rgba(239,68,68,x)`→`rgba(37,99,235,x)`. Testi e icone blu sul fondo scuro hanno la variante `dark:` `#60A5FA`.
- `Navigazione.tsx`: colori passati da stile inline a classi (`text-[#2563EB] dark:text-[#60A5FA]`), così la scheda attiva si vede anche in scuro.
- `index.css`: blocco `@theme` con `--color-azione`, `-scuro`, `-tinta`, `-tinta-scura`, `-chiaro` e commento "usare nel codice nuovo".
- `brand/tokens.ts`: `KIT_APP = 'blu'` (kit di default dell'app); nel kit `blu` il pulsante primario era rosso (`#F4393F`) e ora è `#2563EB`;
  `PALETTE.accento` = `#2563EB`, aggiunto `PALETTE.errore` = `#EF4444`. Il kit `rosso` non è stato toccato.
- `brand/componenti.tsx`: `IconaChip` e `Barra` usano `KIT_APP`; `Caricamento` blu; `Misuratore` (risultato del diagnostico) ora ha i colori
  semantici della probabilità (rosso <40, giallo <70, verde), gli stessi dell'indicatore della home (prima era sempre rosso).
- Illustrazioni: tutti i `kit="kit-rosso"` sono `kit="kit-blu"`. Il kit blu ha solo il gruppo `illustrazioni` (niente `stati`), quindi:
  `completato` (LearnMode, Waitlist)→`successo`; `simulazione-esame` (ExamMode)→`quiz-test`; `piano-superamento` (Onboarding)→`superamento`;
  `celebrazione` (PaymentThanks) esiste nel kit blu, solo tolto `gruppo="stati"`. Le altre (`studio-inglese`, `progressi-statistiche`, `quiz-test`,
  `verifica-utente`, `rischio-economico`) esistono già.
- `brand/risorse.ts`: il gate DEMO è invertito: in demo entra il kit blu (serve all'app), il kit rosso no (lo usa solo il catalogo `?brand`, sostituito da uno stub). Demo: 2,17 MB.
- `index.html` e `public/manifest.json`: `theme-color` / `theme_color` = `#2563EB` (prima `#1D4ED8`); `background_color` invariato.
- Coriandoli (`lib/audio.ts`): il rosso della tavolozza è diventato `#2563EB` (decorativo).

## Rossi semantici lasciati di proposito
Errore/risposta sbagliata: LearnMode (opzione sbagliata, banner "Errata", pulsante "Riprova" dopo errore, banner di errore di rete), ExamMode
(schermata "Non superata", revisione delle risposte sbagliate, errore di consegna), StatsMode (ultimo esame non superato, card "errori da ripassare",
badge errori, trend in calo, accuratezza <40%), Toast `errore`, ErrorBoundary (icona), messaggi di errore di Invites/Waitlist/Legal/Leaderboard/ProjectConsent/ProjectProfile.
Tempo: timer di LearnMode ≤5 s, timer di ExamMode <2 min. Pericolo: "Elimina account" (ProjectProfile), `ConfirmDialog` con `danger`.
Probabilità: fascia "bassa" (Indicatore, Stima, `coloreValore`, Misuratore). Altri: "Da evitare" in CheatSheet (trappola), "Sbagliato" negli errori tipici di Theory,
chip "Da ripassare" del risultato del diagnostico (argomenti dove si è sbagliato), pagina DebugMode (avviso di configurazione), `PALETTE.errore`/`STATI.errore` in tokens.
Dentro le illustrazioni del kit blu restano rossi i dettagli di rischio (€ costo, lucchetto, ecc.): sono parte del disegno.

## Logo e icona
Il logo (`icon-512.png`, `src/brand/essenziali/logo/addiofa-logo.svg`, favicon) è già blu con stella dorata: non toccato. `public/icon.svg` è `#1D4ED8` bianco.

## Verifica
`npx tsc --noEmit` pulito; `npm run build:demo` superato (2,17 MB). Chromium a 400 px, chiaro e scuro, zero errori in console, zero overflow orizzontale:
landing, diagnostico (domanda), risultato (alto e basso), paywall, home, esercizi, progressi, teoria, pagina Pass, pratica con risposta giusta e sbagliata,
simulazione (domanda ed esito con 6 errori). Non provato: 1280 px, flusso con Pass attivo, LearnMode in scuro con risposta giusta, schermate dietro i flag (Leaderboard, ProjectProfile/Consent), DebugMode, ErrorBoundary.

## Cose che non convincono / richieste
- I chip "Da ripassare" restano rossi; se si preferisce meno rosso si possono passare al blu.
- Il kit blu ha icone-chip (`costo`, `blocco`, `errore`) con cerchio rosato e glifo rosso: è la semantica del rischio, ma in Onboarding compaiono come accenti.
- Il kit `rosso` non è più importato dall'app (solo da `?brand`): la cartella `essenziali/disegni/kit-rosso` può restare finché serve ad altri.
