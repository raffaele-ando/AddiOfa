# Note HOME: rifacimento della home

## Cosa è stato fatto
- `app/src/components/Menu.tsx` riscritto: stesse props di prima, più due OPZIONALI (`onOpenTheoryTopic`, `onStartFocus`).
- Nuovi componenti in `app/src/components/home/`: `stima.ts` (tutti i calcoli), `Indicatore.tsx` (semicerchio), `Stima.tsx` (card principale), `Fattori.tsx`, `Obiettivo.tsx`, `Lezione.tsx`, `Serie.tsx` (streak e progressi), `Strumenti.tsx` (elenco compatto), `Cta.tsx`, `comune.tsx` (carta, barre, animazioni).
- Anteprima: `app/tests/anteprime/home.html` + `home.tsx`. URL: `?stato=nuovo|basso|medio|alto&pass=1&tema=dark&sim=1&focus=0`.

## Scelte
- Indicatore = probabilità stimata di superare il test (alta = verde), non "rischio". Tre stati (soglie 40% e 70%) con testo oltre al colore; arco, numero e barre animati, tutto fermo con `prefers-reduced-motion` (hook `useReducedMotion`).
- Stima: `estimatePassProbability` (stesso modello del diagnostico). Alimentata da diagnostico + simulazioni (non dal ripasso, che sceglie le domande più difficili e darebbe una stima troppo severa). Con solo il diagnostico vale il numero salvato in `onboarding.passProbability`. Sotto l'arco: "calcolata sulle tue N risposte". Il chip "+N punti rispetto al diagnostico" compare solo con diagnostico e almeno una simulazione (due stime vere) e solo se la differenza è di almeno 1 punto.
- Senza stima (nuovo): nessun indicatore, card "Scopri a che punto sei" con "Fai il diagnostico gratuito" (10 domande, 3 minuti); la sezione Fattori si nasconde finché non ci sono risposte.
- Fattori: Grammatica e Traduzione, A1/A2/B1 da `appState.stats`; sotto 5 risposte "Poche risposte". Le barre sono cliccabili solo se `onStartFocus` esiste.
- Obiettivo: ultima simulazione contro la soglia del formato (25 ente, 24 TENG) con anello; senza simulazioni invito alla prima; lucchetto e `onNeedPass('simulazione')` se la gratuita è esaurita.
- Lezione: scheda dell'argomento con l'accuratezza più bassa (almeno 3 risposte, sotto 85%); altrimenti la prima non ancora toccata, "per cominciare". Minuti = parole/180. Lucchetto e `onNeedPass('teoria')` se non è la scheda gratuita (stesso criterio di `screens/Theory.tsx`).
- Streak: sette pallini degli ultimi 7 giorni da `dailyActivity` (se manca, riempiti dalla serie), nessun messaggio di perdita. Progressi: domande imparate (box>0) su totale del corpus attivo, mini-barre solo se esiste `dailyActivity`.
- Messaggio motivazionale fisso (niente rotazioni inventate). Niente campanella: non ci sono notifiche vere.
- Invariati: strumenti (compatti, in fondo), Pass in alto, suoni, tema, switch Nucleo/Tutto con lucchetto, Importa/Esporta, Footer, PoweredByAtlas, Navigazione.

## Provato
`npx tsc --noEmit` pulito; `npm run build:demo` superato. Chromium (Playwright) a 400 e 1280 px, tema chiaro e scuro, stati nuovo/basso/medio/alto (e Pass): nessuno scorrimento orizzontale, zero errori in console (solo un 404 di favicon.ico del server di sviluppo). Click verificati nei registri: barre, lezione (libera e bloccata), obiettivo, CTA, info. Non provato nella App vera (solo anteprima), né su telefoni reali.

## Cosa non convince
- Il modello è severo: con 8 su 10 nel diagnostico la probabilità è circa 46% (serve l'80% di accuratezza per 24/30). È onesto, ma un utente medio vedrà spesso "bassa": vale la pena rivedere i testi o le soglie 40/70.
- Per un utente senza Pass l'argomento più debole è quasi sempre bloccato: la card di lezione mostra più spesso il lucchetto che la scheda.
- La home è lunga (~2200 px a 400 px); gli strumenti sono in fondo, come da brief.

## Richieste ad App.tsx (le collega chi coordina)
1. `onOpenTheoryTopic={apriTeoria}` (esiste già `apriTeoria(id)`).
2. `onStartFocus={f => { setLearnMode('category'); setLearnCategory(f); setView('learn'); }}` (stesso formato dei filtri di PracticeMenu: `category:Grammatica`, `level:A2`).
Senza queste due props la home funziona: la lezione apre l'elenco della teoria e le barre non sono cliccabili.
