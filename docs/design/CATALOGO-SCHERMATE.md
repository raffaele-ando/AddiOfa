# Catalogo dei concept e piano di implementazione

Le 59 immagini di partenza (52 in `grafica/fonti/design-concept/` + 7 alla radice di `grafica/fonti/`) sono state guardate una per una. Le schede complete (ogni schermata, cosa manca nell'app, schermata corrispondente, priorità, "da adattare") sono in tre file:

| Blocco | File | Immagini |
|---|---|---|
| 1 | `docs/lavoro/catalogo-design-00-17.md` | NN 00-17 |
| 2 | `docs/lavoro/catalogo-design-18-35.md` | NN 18-35 |
| 3 | `docs/lavoro/catalogo-design-36-51.md` | NN 36-51 e le 7 immagini alla radice (R1-R7) |

Elenco NN → file: `grafica/fonti/INDICE.md`. Il NN 27 è un duplicato identico del 23.

## Decisioni

- **Colore d'azione: blu** (scelta dell'utente, 11/10). Il rosso resta per errori, risposte sbagliate, tempo scaduto e fascia bassa dell'indicatore.
- **Un solo prodotto**: Pass AddiOFA 14,99 € (lancio 9,99 € fino al 31/01/2027). I piani "Pass Simulatore / CRAM Pass Pro / Garanzia Promosso" dei concept non si implementano.
- **Indicatore = probabilità stimata di superare il test**, mai "rischio di fallimento"; sempre con la spiegazione "calcolata sulle tue N risposte" e il limite di una stima.

## Cosa copiare dai concept e cosa no

Non si copiano (contraddicono le regole di prodotto): numeri e testimonianze inventati ("12.000+ studenti", "82 % non supera", curve 82→62→28 %, "−6 % per lezione"), "ufficiale" e "timer ufficiale", stemma o nome del Politecnico, badge App Store/Google Play (è una PWA), email @polimi.it obbligatoria, simulazioni da 40 domande o 60 minuti (i formati veri sono 30 domande in 15 minuti), abilità Listening/Reading/Writing (il banco ha Grammatica e Traduzione), punti/livelli/serie come motivazione, garanzia di rimborso, Sfide, Duello, Classifica, Project ID, ATLAS/NOI/Agorà (fuori dal lancio).

## Stato di implementazione

| Schermata dei concept | Immagini | Stato | Priorità |
|---|---|---|---|
| Home con misuratore, fattori, obiettivo, prossima lezione | 01, 03, 11, 14, 21, 33, 39 | Fatto (`components/home/*`) | alta |
| Landing mobile e desktop (hero, 4 vantaggi, "Come funziona in 4 passi", prezzi onesti, FAQ) | 12, 41, 45, 51, 32 | Da fare | alta |
| Sequenza animata di calcolo del risultato | 09, 10, 20, 29, 42, 43 | Da fare | alta |
| Esito con misuratore, tessere e correzioni complete | 18 | Da fare | alta |
| Fogli "Come viene calcolato" e "Perché è solo una stima?" | 25 | Da fare | alta |
| Fine sessione di studio con prima/dopo | 31, 30 | Da fare | media |
| Statistiche con obiettivi, andamento; Impostazioni | 06, 19 | Rimandato | media |
| Foglio di condivisione inviti, "Accesso sbloccato" | 05, R7 | Rimandato | media |
| Frasi e vocaboli con preferiti e audio | 36, 49 | Rimandato | bassa |
| Splash, pulsante "Segnala", stati vuoti/errore | 13, 16, 17 | Rimandato | bassa |
| Sfide, Classifica, Amici, Badge, Project ID, ATLAS, social, locandine | 22, 34, 00, 26, 37, 48 | Fuori dal lancio | — |
