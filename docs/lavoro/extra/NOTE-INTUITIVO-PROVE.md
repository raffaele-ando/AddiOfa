# Intuitivo: area Simulazioni (prove e sfide), 16/10

## Cosa è cambiato (funzione → posto)
- **Scheda Simulazioni** (`simulazioni`, barra «simulazioni»): `TestataScheda` (titolo + «i» + profilo a destra), selettore a due icone Prove | Sfide (porta tra `simulazioni` e `sfide`), carta «nuova simulazione» con tre dati icona+numero (30 · 15 min · 25/30) e UN solo ▶ (lucchetto se il limite gratuito è finito: stesso pulsante, porta al Pass), elenco «Svolte» (punteggio /30, data, tempo, icona esito). Regole, limite gratuito e «non è una previsione» dietro la «i».
- **Sfide** (`sfide`, `amici`, `classifica`): stessa testata e stessa barra; sotto il selettore Prove|Sfide, un secondo a tre icone (sfide, amici, classifica; il nome compare solo sul segmento aperto). Sfida del giorno (▶; se già giocata, riga con risultato), duello (nome + ▶), link ricevuto (incolla + →), storico a icone. Classifica: podio/elenco veri + UNA riga NOI (stato a icona, porta a `projectid`). Regole dietro la «i».
- **Giochi e risultati**: `sfida-gioco`, `sfida-risultato`, `sfida-accetta`, `condividi`: solo numeri, icone, un pulsante. Errori ≤ 8 parole.
- **ExamMode**: la scelta del formato non c'è più (parte da sola, resta LinguaViva); avvio = solo caricamento; lucchetto o avviso + un pulsante se non parte. Prova senza «Domanda N di M» né nome del formato. Esito: misuratore + soglia/tempo + tessere icona/numero + ↺ (lucchetto se bloccato) + icona che porta alle correzioni. Correzioni: filtro a icone+numeri, icona di stato, confronto, spiegazione in italiano (`data-testo-ok`).
- **Tolto/spostato**: «Invita amici» da Amici (sta in `pass`); `PrimaDiIniziare` del dettaglio (le regole stanno nella «i» di Simulazioni); classifica NOI senza sezione propria (una riga); `accesso-sbloccato` fuori dal registro e dai link; nessuna riga Statistiche/Progressi.

## Tabella funzione → icona (`registro/prove.json` + nomi riusati)
| Funzione | Nome | Icona lucide |
|---|---|---|
| Prove / Simulazioni | `simulazioni` (base) | clipboard-check |
| Sfide (area e duello) | `sfide` | swords |
| Amici | `amici` | users |
| Classifica | `classifica` | trophy |
| Sfida del giorno | `sfida-giorno` | calendar-check-2 |
| Incolla link | `incolla` | clipboard-paste |
| Soglia | `soglia` | ruler |
| Correzioni | `correzioni` | book-open-check |
| Storico / Svolte | `storico` | history |
| WhatsApp / Telegram / Messaggi | `whatsapp` `telegram` `messaggi` | message-circle / send / message-square |
| Vinto / Perso | `stato-vinto` `stato-perso` | thumbs-up / thumbs-down |
| In attesa | `stato-attesa` | ellipsis |
| Link rotto | `stato-link-rotto` | link-2-off |
| Primo / migliore | `stato-primo` | medal |
| Espandi | `espandi` | chevron-down |
| Riusati da altri registri | `risposte` (domande), `tempo`, `riprova` (↺), `teoria`, `suggerimento` (spiegazione), `condividi`, `copia`, `cancella`, `argomenti`, `imparate`, `classifica-noi`, `trend-uguale` (pari), `stato-ok`/`stato-errore` (superata/non), `stato-risposta-giusta/sbagliata/omessa`, `stato-attenzione`, `stato-caricamento`, `studia` (▶), `blocco`, `pass`, `home`, `indietro`, `avanti`, `chiudi`, `info` | |

`node tools/genera-icone.mjs` senza errori (162 icone). Nessun `lucide-react` nei miei file.

## Prove (numeri onesti)
- `tsc --noEmit` pulito; `npm test` 216/216 verdi (non ho aggiunto test: nessuna logica pura nuova).
- `controlla-testo.py` sulle viste simulazioni, simulazione-dettaglio, sfide, amici, classifica, condividi, sfida-risultato, sfida-accetta, sfida-gioco: 0 (soglia 5 parole). Con soglia 3 su stati ricchi e vuoti (risultati, accetta in 5 varianti, gioco pronto/in corso, esame in corso/esito/correzioni): restano solo nomi di argomenti (contenuto, ora `data-testo-ok`).
- Chromium 400 px chiaro/scuro (ricco e vuoto) e 1280 px chiaro/scuro: nessuno scorrimento orizzontale; nessun errore in console tranne un 404 di una risorsa del server di sviluppo alla prima apertura (non riprodotto, non mio). Screenshot in `docs/lavoro/extra/intuitivo/prove/` (`confronto-prima-dopo.png`, `prima-*`).
- Non provato: `FineSessione` (vedi sotto); `condividi` con parametro `url` nel dev server (Vite lo blocca come `?url`, è un limite del server di prova, non dell'app: provato con solo `testo`); foglio «Altre» (Web Share) non disponibile in Chromium headless.

## Richieste al coordinatore
1. `app/src/screens/extra/sfide/AccessoSbloccato.tsx` non è più una schermata, ma `screens/Invites.tsx` importa ancora `BloccoSbloccato`/`sbloccatoConInviti` e `FoglioCondividi`/`indirizzoApp`: quando Invites va dentro `pass`, spostare i pezzi e cancellare il file.
2. `components/esito/FineSessione.tsx` (rifatto a icone) non è più usato: LearnMode ha una versione locale. Cancellarlo o fare importare LearnMode da lì.
3. `condividi` non è più linkato da nessuna schermata (prima lo era da Amici, «Invita amici»): se `pass` vuole il foglio, usi `FoglioCondividi`.
4. Profilo.tsx ha ancora le righe Sfide/Amici/Classifica (lucide): tolgono l'agente profilo (la scheda Simulazioni è l'unico posto). Lezioni.tsx ha ancora la voce «Sfide»: da togliere.
5. Icone: `amici` (users) e `partecipanti` (users-round) sono quasi uguali: valutare un'altra per `partecipanti`. Il segmento «Sfide» del selettore alto e il primo del secondo selettore usano la stessa icona (stessa funzione).
6. `index.css`/`ui.tsx` non toccati; niente richieste su di essi.
