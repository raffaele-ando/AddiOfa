Schermate delle sfide (sfide, sfida-gioco, sfida-risultato, sfida-accetta, amici, classifica, condividi), registrate in `index.ts`.
La logica pura sta in `app/src/lib/sfide/` (seme, codice del link, risultati) con test in `app/tests/unit/sfide-*.test.ts`; `dati.ts` salva in `appState.extra`.
Dettagli, prove e richieste al coordinatore: `docs/lavoro/extra/NOTE-SFIDE.md`.
Pagina «Sfide» (Oggi | Amici | Classifica) ricostruita dai concept con le illustrazioni: `docs/lavoro/extra/NOTE-ILLUSTRATO-SFIDE.md`. `ClassificaNoi.tsx` è il punto di innesto della classifica NOI (props `{ attivo }`).
