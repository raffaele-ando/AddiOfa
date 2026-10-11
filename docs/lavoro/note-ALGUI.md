# Note ALGUI: le correzioni dell'algoritmo collegate all'interfaccia

Fonte: `docs/lavoro/note-ALG.md` (richieste 1-6). Nessuna modifica a `app/src/lib/**`.

## File toccati

- `App.tsx`: `handleExamComplete` usa `qualityForResult` e passa `lastSeen` (e un solo `adesso`) ad `applySm2`; `examCategoryStats` in copia profonda; `chiaveGiorno()` per `dailyActivity` e `dailyTimeSpent`; punteggio NOI con `countLearned`.
- `components/LearnMode.tsx`: `countLearned` per "prima/dopo"; 9° parametro `omessa = isTimeout && (chosen === null || chosen < 0)` nella chiamata di errore (la chiamata "giusta" passa `false`).
- `components/StatsMode.tsx`, `Menu.tsx`: `countLearned` / `isLearned` al posto di `box > 0`; `chiaveGiorno` in StatsMode; riga con la regola sotto le tessere dei Progressi (in tutte e due le viste).
- `components/ActivityChart.tsx`: `chiaveGiorno(d)`.
- `components/esito/FineSessione.tsx`: testo della regola (`REGOLA_IMPARATA`) e, se il numero non cambia, spiegazione di "in corso".
- Probabilità: `home/Indicatore.tsx` (numero che sale, poi `formatProbabilita`), `brand/componenti.tsx` Misuratore (nuova prop `testo`; con `animato` il numero finale è `formatProbabilita`), `CalcoloRisultato.tsx` (numero intero mentre sale, forma onesta all'arrivo), `home/Stima.tsx`, `Onboarding.tsx`, `FoglioStima.tsx`.
- `home/comune.tsx`: `RigaIntervallo`, `RISPOSTE_PER_STIMA_STRETTA` (90), `REGOLA_IMPARATA`.

## Scelte

- **Intervallo**: una riga piccola "Punteggio probabile al test: tra 18 e 27 su 30 (soglia 25)." sotto la percentuale (Onboarding e home), mostrata finché le risposte sono meno di 90 (meno di tre simulazioni). Ho scelto il punteggio e non "tra X e Y %" perché con 8/10 la probabilità va da meno di 1 a 91 % e non dice nulla; il punteggio mostra che l'intervallo attraversa la soglia. La spiegazione è nel `FoglioStima` (voce "Il punteggio probabile") e nel testo informativo della home.
- **Fasce** (40/70 invariate): 8/10 = 36 % è 'basso'. I testi ora spiegano perché ("la soglia è alta: 25 su 30, la stima parte bassa anche con un buon risultato", "Hai margine per migliorare") e non fanno paura; 'medio' diventa "Sei vicino alla soglia" (era "Ci sei a metà", falso per 9/10).
- **Onboarding** salva `passProbability` esatta (non a centesimi); `FoglioStima` scrive gli esempi con `formatProbabilita` e per le simulazioni spiega finestra delle ultime 3, uscita del diagnostico e omesse = errori.
- **Regola "imparata"**: "risposta bene due volte, a distanza di almeno mezza giornata" (è il vero criterio: `MIN_GAP_MS` = 12 ore, non "giorni diversi").

## Prova (demo, Chromium, 400 px chiaro e scuro; 1280 chiaro fino al menu)

`tsc` pulito, `npm test` 90/90, `build:demo` ok. Flusso e2e: 8/10 al diagnostico = 36 % (fascia bassa, "Hai margine per migliorare"), riga "tra 18 e 27 su 30 (soglia 25)"; dopo 26/30 e TENG 22/30 la home dà 41 % ("+5 punti", fascia media, "tra 22 e 26 su 30"); Progressi mostra "0 % domande imparate" (una sola esatta = in corso, atteso) con la regola scritta; 0 errori in console, scrollWidth - innerWidth = 0 in tutte le schermate.

## Cosa non convince / non provato

- Non guardati a occhio i casi estremi "<1 %" e ">99 %" nel Misuratore (testo SVG a 48 px, 5 caratteri: dovrebbe starci in 232 di viewBox) né il doppio conteggio in StrictMode (la build demo è di produzione).
- In LearnMode, in modalità "recall" una frase che non corrisponde a nessuna opzione conta come omessa solo se scade il tempo (codice esatto del NOTE-ALG); se non scade resta errore.
- Il grafico di StatsMode ha solo "imparate / da imparare": le "in corso" stanno nel secondo gruppo.
- In `lib/**` non ho trovato errori.
