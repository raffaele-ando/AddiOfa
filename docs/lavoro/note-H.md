# Note agente H: schermata Teoria

## Fatto
- `app/src/screens/Theory.tsx` (default export, props `{ onBack, onOpenPaywall, initialTopicId? }`, usa `useAccess().pass`).
- Elenco: 31 argomenti per livello (A1, A2, B1, h2 per livello), ogni riga con titolo, livello e stato: "Gratis"/"Aperta", "Nel Pass" con lucchetto, "In arrivo" (riga tratteggiata, non cliccabile, se `pronta` è falso). Se nessuna scheda è pronta, messaggio sobrio sopra l'elenco.
- Gratis: i primi `FREE_LIMITS.freeTheoryTopics` argomenti **pronti** nell'ordine livello poi ordine del file, cioè il primo A1 pronto. Senza Pass gli altri pronti chiamano `onOpenPaywall()`.
- Dettaglio: h1 titolo, h2 regola/esempi/errori tipici/"Per il test" (consiglio), errori con etichette "Sbagliato" (X) e "Giusto" (spunta) oltre al colore, "Perché". Navigazione "Argomento successivo / precedente" (tra le schede pronte; se la vicina è nel Pass mostra il lucchetto e apre il paywall) e "Tutti gli argomenti". Gli id delle domande non sono mostrati.
- `initialTopicId`: apre il dettaglio solo se la scheda è pronta e accessibile; altrimenti mostra l'elenco (senza chiamare il paywall da solo).
- Il focus va al titolo al cambio vista (lettura dall'alto, tastiera). `motion-reduce` sulle transizioni; testo a ~65 caratteri (`max-w-[65ch]`).
- Anteprima: `app/tests/anteprime/teoria.html` + `teoria.tsx` (parametri `tema=dark`, `pass=1`, `dati=finti|reali`, `aperto=<id>`). `dati=finti` riempie 5 schede in memoria (theory.ts non toccato).

## Provato
`tsc`: nessun errore nei miei file. Chromium 400 px chiaro e scuro: nessuno scorrimento orizzontale (pagina e contenitore), elenco con e senza Pass, nessuna scheda pronta, dettaglio, prossimo/precedente (con Pass cambia scheda e il focus va all'h1; senza Pass il prossimo bloccato chiama il paywall), reduced-motion. Solo un 404 di risorsa nell'anteprima (favicon). Non provato: schede reali (nessuna era pronta), lettori di schermo veri.

## Non mi convince
- "Gratis" cambia argomento se la prima scheda A1 non è ancora pronta (oggi sarebbe la prima pronta di qualunque livello). A contenuti finiti è sempre `present-simple`.
- `RichText` rende *corsivo* come blu grassetto (stile del prontuario): scelto di tenerlo per coerenza.

## Richieste ad altri
- A: in `App.tsx` sostituire il segnaposto con `lazy(() => import('./screens/Theory'))` o import diretto; il paywall da `onOpenPaywall` dovrebbe usare il motivo `teoria`.
