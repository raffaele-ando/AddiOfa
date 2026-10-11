# Note HOME14: la home diventa il concept 14 (`home-n14-a`)

## File toccati
- `app/src/components/Menu.tsx` (nuova struttura), `home/Misuratore.tsx` (nuovo: arco a tutta larghezza), `home/GraficoStime.tsx` (nuovo: grafico a linea), `home/Stima.tsx` (riscritto: `StimaSezione`, `BannerStato`, `ScopriCard`), `home/Lezione.tsx` (ora `ProssimoObiettivo`), `home/stima.ts` (`serieStime`, `progressoArgomento`; `calcolaStima` rifattorizzata sugli stessi helper), `home/Fattori.tsx` e `home/Obiettivo.tsx` (solo titoli).
- Test: `app/tests/unit/serie-stime.test.ts` (9 test; `npm test` = 99/99). Anteprima: `app/tests/anteprime/home.tsx` (`punti=1..5` = diagnostico + N-1 simulazioni).
- Non toccati: `Indicatore.tsx` (lo usa ancora la landing), `Cta.tsx`, `Serie.tsx`, `Strumenti.tsx`, `comune.tsx`. `SOTTO_CIAO` e il saluto fisso sono spariti.

## Struttura (dall'alto)
Intestazione (logo, suoni, tema, Pass, accesso: niente campanella) · "Ciao, nome" solo se `user?.displayName` · misuratore con (i) che apre `FoglioStima` + "calcolata sulle tue N risposte" + "tra X e Y su 30" + delta dal diagnostico · banner di stato (tocco: pratica, simulazione se alto e sbloccata) · pulsante blu · "Il tuo prossimo obiettivo" + "Vedi percorso" (`onOpenTheory`) · grafico "Come cambia la tua probabilità" · blocchi secondari: Dove sei più solido, Soglia della simulazione (era "Il tuo obiettivo", rinominata per non doppiare il titolo), Serie e Progressi, switch Nucleo/Tutto, Strumenti, Importa/Esporta, PoweredByAtlas, Footer, Navigazione a 5 voci. La frase motivazionale fissa è stata tolta (non era una funzione).
- Senza stima: niente misuratore, banner, pulsante né grafico: `ScopriCard` ("Fai il diagnostico gratuito") + obiettivo + blocchi secondari.

## Scelte
- Fasce: basso (arancio) "Parti da qui" (solo con il diagnostico e p < 20 %) o "Hai ancora margine"; medio (ambra) "Sei vicino alla soglia"; alto (verde) "Sei sulla strada giusta". Niente rosso, niente bagliore pulsante (solo un alone fermo attorno al pallino). Il grafico invece usa rosso/giallo/verde secondo il valore, come chiesto.
- Pulsante: "Inizia a studiare" se non ci sono risposte, "Continua a studiare" altrimenti, "Fai una simulazione" se alto e la simulazione non è bloccata.
- `serieStime(stato, max = 5)`: stesso modello e stessa finestra di `calcolaStima` (ultime 3 simulazioni, diagnostico fuori dalla seconda in poi), ricalcolato dopo il diagnostico e dopo ogni simulazione valida; l'ultimo punto è sempre uguale a `calcolaStima(stato).p` (testato per k = 0..7 con e senza diagnostico). Etichette: "Oggi" sull'ultimo (con sotto il nome vero, es. "Dopo sim. 4"), poi "Diagnostico", "Dopo sim. N" (numerazione assoluta tra le simulazioni valide). Linee rette (niente curve che sforano). Con un solo punto: punto + "Fai una simulazione per vedere come cambia" (tocco = simulazione o Pass). L'(i) del grafico apre una spiegazione nella pagina (niente foglio), quella del misuratore `FoglioStima`.
- Obiettivo: argomento di `lezioneConsigliata`; area = categoria più frequente delle sue domande; "n/m domande imparate" con `countLearned` sulle domande dell'argomento nel corpus attivo (se lì non ce ne sono, su tutto il banco). Lucchetto + `onNeedPass('teoria')` se la scheda non è gratuita.
- Animazioni con `motion` (conteggio e arco, linea che si traccia, punti e carte in sequenza), tutte ferme con `prefers-reduced-motion` (verificato: il numero è già finale a 300 ms).

## Provato
`tsc` pulito, `npm test` 99/99, `build:demo` superato. Chromium: stati nuovo/basso/medio/alto, serie con 1, 2, 3 e 5 punti, con e senza Pass, 400 px (e 360) chiaro e scuro, 1280 px chiaro e scuro: `scrollWidth - innerWidth` = 0, nessun elemento oltre il bordo, zero errori in console (solo il 404 del favicon del dev server e l'avviso di motion sul movimento ridotto). Click verificati nei registri: (i) → foglio, banner, pulsante, Vedi percorso, obiettivo bloccato (`onNeedPass('teoria')`), invito del grafico. Confronto a occhio col concept 14 e col foglio 01.
Non provato: telefono vero, App.tsx reale, 1280 con tutte le fasce, tastiera sul foglio.

## Cosa non convince
- Con l'anteprima i punti bassi (1 %, <1 %) appiattiscono il grafico sul fondo: è la scala unica onesta, ma a 5 punti bassi sembra vuoto.
- Il modello è severo: l'arancio "Hai ancora margine" è la fascia più vista (vedi note ALG). Il blocco obiettivo è quasi sempre con lucchetto senza Pass.
- La home resta lunga (~2100-2300 px a 400 px) per non perdere funzioni.
- Il colore dell'alone del pallino a bassa probabilità (arancio) è una mia scelta: il concept aveva il rosso.

## Richieste ad App.tsx
Nessuna props nuova. Restano valide quelle di note-HOME: `onOpenTheoryTopic={apriTeoria}` e `onStartFocus` (senza, l'obiettivo apre l'elenco della Teoria e le barre di "Dove sei più solido" non sono cliccabili).
