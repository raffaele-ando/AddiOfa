# Note RISU: fase risultato del diagnostico e foglio sulla stima

## Cosa ho fatto
- `app/src/components/FoglioStima.tsx` (nuovo): foglio dal basso `FoglioStima({ aperto, onChiudi, tipo, risposte? })`. `role="dialog"`, `aria-modal`, focus sul titolo, Esc, sfondo cliccabile, Tab trattenuto nel foglio, focus restituito a chi l'ha aperto. Testi letti dal codice: la stima è beta-binomiale (`estimatePassProbability`), conta solo le risposte esatte, soglia 24/30 (TENG; LinguaViva 25/30 abbassa la probabilità), il tempo non entra, nessun confronto. L'esempio "7/8/9 su 10 = 25/46/70 %" è calcolato con la stessa funzione. Tipo `simulazione`: stessa spiegazione ma sulle risposte di diagnostico + simulazioni (gli esercizi di ripasso non contano, come in `calcolaStima`).
- `app/src/components/CalcoloRisultato.tsx` (nuovo): "Sto calcolando…" di 3 s, arco `Misuratore` che sale cambiando colore (rosso/giallo/verde), tre tappe con spunta e dato vero ("7 esatte su 10", "3 A1, 2 A2, 5 B1", "Soglia: 24 su 30"), pulsante "Salta".
- `Onboarding.tsx` (solo risultato): nuovo passo `calcolo` dopo `risk` (con `prefers-reduced-motion` si va dritti al risultato); risultato con arco grande, etichetta, "Calcolata sulle tue 10 risposte (i)" che apre il foglio, messaggio per fascia, tessere "n su m" (Grammatica, Traduzione; A1/A2/B1 solo con almeno 3 domande), "Da ripassare", CTA invariata. Flusso dopo il risultato invariato (`ready`, poi menu).

## Scelte da sapere
- La tappa 2 si chiama "Guardo il livello delle domande" e non "Peso la difficoltà": il calcolo NON pesa la difficoltà (ogni esatta vale uguale); i livelli entrano solo perché le 10 domande hanno la stessa mescolanza A1/A2/B1 del banco. Il foglio lo dice.
- L'ordine resta quello di oggi: quiz, conseguenze OFA (`risk`), calcolo, risultato, "Cosa ottieni", menu. Se si vogliono le conseguenze DOPO il risultato va spostato `risk` (non l'ho toccato).
- I chip "Da ripassare" restano rossi (errori); le tessere usano il blu `azione`.
- Con 0 risposte esatte il `Misuratore` mostra "0%" (la stima vera è sotto 0,1 %): non l'ho cambiato perché non è mio.

## Verifica
`npx tsc --noEmit` pulito; `npm run build:demo` superato (controllo artifact ok). Chromium con dev server e artifact demo: 400 px chiaro e scuro, 1280 px chiaro e scuro; risultati con 10, 9, 8, 7 e 0 esatte su 10 (fasce alta, media, bassa); foglio aperto (alto e in fondo), chiuso con Esc e con clic sullo sfondo, focus sul titolo; salto; reduced motion. Overflow orizzontale 0, console senza errori (in dev con reduced motion compare un avviso della libreria motion, già presente per i componenti della home, non nella build). Non provato: lettore di schermo vero, `FoglioStima tipo="simulazione"` renderizzato (compila, testo letto ma non visto), Safari.

## Richieste ad altri
- Chi mostra la stima dopo una simulazione: `<FoglioStima aperto onChiudi tipo="simulazione" risposte={stima.risposte} />`.
