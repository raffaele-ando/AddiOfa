# NOTE-ILLUSTRATO-SFIDE: la pagina Sfide rifatta dai concept (16/10)

Agente ILLUSTRATO-SFIDE. Codice solo in `app/src/screens/extra/sfide/`. Coppie e stati fotografati in `docs/lavoro/extra/illustrato/sfide/` (400 e 1280 px, chiaro e scuro; `prima-*` è il «tutto a icone» di partenza).

## Cosa è cambiato
- **Pagina «Sfide»** (voce della barra Home | Esercizi | **Sfide**): testata «Sfide» (+ «i» + profilo) e sotto il selettore a tre voci **Oggi | Amici | Classifica**, una pillola con tre segmenti uguali, icona e nome su tutti, la voce aperta in tinta blu (come i tre tab del concept 06/22). Icone: `sfida-giorno`, `amici`, `classifica` (nessun doppione con la barra, che usa `sfide`). Il vecchio selettore Prove | Sfide non c'è più su queste tre viste.
- **Oggi**: carta verde «Sfida del giorno» con la coppa (`successo`) e i due dati 10 · 5 min (concept 06.1/22), un solo pieno blu «Gioca»; se l'hai già giocata, riga con punteggio e tempo («Torna domani»). **Duello**: carta con nome + «Sfida» (concept 05/22). **Hai un link?**: incolla e apri (`?sfida=`). **Ultime sfide**: storico, vuoto con `vuoto`.
- **Amici**: rivali veri dai duelli (saldo vinti/pari/persi, duelli a confronto, «Togli» con conferma); «In attesa» con la clessidra; carta verde «Sfida un amico»; vuoto con `messaggi-supporto` e un pulsante.
- **Classifica**: carta «La tua posizione» (n su N, calcolato) con `sfera-community`, **podio** (da 2 persone: due colonne; da 3: il podio del concept 2-1-3), elenco dal quarto, poi il punto di innesto NOI. Vuota: `vuoto` + «Sfida un amico».
- **Gioco / risultato / accetta / condividi**: pronto con `quiz-test`, caricamento con `attesa-caricamento`, errori con `documento-errore`; risultato con l'illustrazione dell'esito (sotto); accetta con la coppa luminosa; foglio e schermata Condividi con Copia, WhatsApp, Telegram, Messaggi (e «Altre» se il dispositivo ha Web Share); pulsanti con il verbo (Gioca, Sfida, Accetta, Inizia, Condividi, Correzioni, Risultato), non più solo icone.

## ClassificaNoi: il punto di innesto (per l'agente progetto/ATLAS)
`app/src/screens/extra/sfide/ClassificaNoi.tsx`, props `{ attivo: boolean }`, esportato come default e nominato. Lo usa solo `Classifica.tsx`, che passa `attivo={false}` (non esiste ancora una fonte per sapere se si è collegati). Oggi mostra «Classifica NOI · Non collegato · Vedi solo la classifica locale.» con `mondo-globo` (il globo senza aeroplano), nessun numero. Con `attivo=true` il componente non disegna nulla (niente dati inventati). L'altro agente sostituisce il file tenendo le props; se vuole leggere lo stato da sé (Project ID registrato, Worker raggiungibile) può ignorare la prop e cambiare la riga in `Classifica.tsx`. Chi non è collegato vede la classifica locale e basta.

## Schermata → concept → illustrazioni → cosa non somiglia
| Schermata (id) | Concept | Illustrazioni (lato a 400 px) | Cosa non somiglia ancora, e perché |
|---|---|---|---|
| Oggi (`sfide`) | 06.1, 22.1, 30.12 | `successo` 92 (coppa); `vuoto` 104 (storico vuoto) | Niente barra 3/5, «+100 pt», pagine a puntini, «Sfide attive» a più righe: sono punti e obiettivi inventati (CLAUDE.md: nessun punteggio). Il tab calendario del concept non c'è. |
| Amici | 06.5, 22 | `messaggi-supporto` 128 (vuoto); `attesa` 20 («In attesa»); carta verde «Sfida un amico» | Niente foto, punti, «Invita amici»/«Richieste» (richiederebbero un server). L'avatar è l'iniziale. |
| Classifica | 06.4, 30.14 | `sfera-community` 64 (posizione); `vuoto` 120; `mondo-globo` 72 (NOI) | Niente Settimanale/Mensile/Sempre né punti: la classifica è la media di risposte giuste nei duelli con te. Niente foto. |
| Gioco, pronto | 06.3, 30.13 | `quiz-test` 120 (statica) | Il concept 06.3 ha in testa un'illustrazione di montagna con bandiera: **non esiste nel kit**, non l'ho sostituita con un'icona. |
| Gioco, in corso | 30.9 | nessuna (piano d'uso) | – |
| Gioco, caricamento | – | `attesa-caricamento` 110 (statica) | Vedi «Trovato fuori perimetro». |
| Gioco, errore | 08, 16 | `documento-errore` 104 | – |
| Risultato, vinto | 06.6, 30.12 | `celebrazione` **kit luminoso** 104 | Il piano dice 160 px: a 400 px di schermo ne ho tenuti 104 perché la carta con i due risultati resti sotto la piega. |
| Risultato, pari | – | `celebrazione-fiocco` 92 | **Il piano d'uso non prevede il pari.** Ho scelto il fiocco («piccolo traguardo»): da confermare. |
| Risultato, perso | 06.6 | `mancato-superamento` 112 (piatta) | È il «foglio con la croce» del test non superato: per un duello perso è severo, ma è l'unico del piano. |
| Risultato, sfida del giorno | 06.1 | `successo` 96 (stessa coppa della carta di Oggi) | – |
| Risultato, duello in attesa | 05 | `attesa` 68 | – |
| Accetta (`?sfida=`) | 06.3, 30.13 | `successo` **luminoso** 128 | – |
| Accetta, stati | 08 | `documento-errore` (link non valido, versioni diverse); `attesa` («Tua sfida»); `documento-completato` («Già giocata»); `ricerca-scintille` (sfida non trovata) | – |
| Condividi (schermata) | 05, R7.9 | `attesa` 64 sopra le scelte; `vuoto` se non c'è niente | Instagram: non ha un indirizzo di condivisione web, non lo fingo. |
| Condividi (foglio nel risultato) | 05, R7.9 | nessuna | Il piano prevede `attesa` anche qui, ma il foglio si apre sopra la pagina che ha già la clessidra: due uguali nella stessa vista. Scelta mia, da cambiare se si vuole. |

Una sola illustrazione per mestiere: `attesa` = «aspetto l'amico» (4 posti, sempre lo stesso significato); `vuoto` = «niente ancora»; `documento-errore` = «non è andata».

## Dubbi sul piano d'uso (da decidere)
1. `celebrazione` per il duello vinto: il brief dice «solo per l'esito superato» (regola 2), il piano d'uso §3.2 dice «vinta: L: celebrazione». Ho seguito il piano; è la versione luminosa, non quella piatta che usa l'esito del test.
2. Il pari (fiocco) è una mia scelta.
3. «La tua posizione» usa `sfera-community`, che il piano riserva a testata Classifica/NOI: è la testata della Classifica, quindi coerente.

## Richieste per App.tsx e per altri
1. **Pila delle schermate**: il selettore Oggi/Amici/Classifica usa `vai()`, che mette ogni cambio nella pila di `indietro`. Non c'è tasto indietro in queste tre viste, ma la pila cresce a ogni tocco. Meglio un `sostituisci(id)` (o azzerare la pila in `vaiExtra` quando l'id è una delle tre).
2. `studio/Simulazioni.tsx` usa ancora `SchedaProveSfide sezione="prove"` (testata «Simulazioni» e selettore Prove | Sfide): l'ho lasciato funzionante. Se la barra non ha più «Simulazioni», va tolto (il selettore e `META` in `scheda.tsx` possono sparire).
3. `Profilo.tsx`/`Lezioni.tsx` con righe verso Sfide/Amici/Classifica: ne ha già parlato NOTE-INTUITIVO-PROVE (non verificato adesso).
4. Nessuna prop nuova per le schermate: `?sfida=` è già gestito (`sfida-accetta`, con `replaceState` dopo la prima apertura).

## Trovato fuori perimetro (non toccato)
**`brand/IllustrazioneAnimata.tsx` non disegna niente**: lo `<span class="anim ...">` resta vuoto (`innerHTML` lungo 0) sia nel dev server sia nella build di produzione (provato sull'intro dell'onboarding, dopo 2 s). Causa probabile: `useCaricaSvg` scarica l'SVG e fa `ricarica()`, ma `html` è un `useMemo` con dipendenze `[nome, scuro, lato, alt]` che non cambiano, quindi non viene ricalcolato. Basta aggiungere la versione caricata alle dipendenze. Per questo `SfidaGioco` ora usa `Illustrazione` (statica) invece dell'animata; quando si ripara si possono rimettere le due `IllustrazioneAnimata` (pronto e caricamento).

## Controlli eseguiti (numeri)
- `cd app && npx tsc --noEmit`: 0 errori (tutto il progetto, al momento del controllo).
- `npm test` dalla radice: 240/240 verdi (nessun test nuovo: nessuna logica pura nuova; il podio a due colonne è solo disegno).
- `vite build` (in una cartella di prova fuori da `app/dist`): riuscita. `npm run check` completo non lanciato.
- `tools/controlla-testo.py` (JS del controllo, soglia 5 parole): 0 blocchi su 8 viste × stato vuoto/ricco a 400 px chiaro (sfide, amici, classifica, risultato vinto/perso/in attesa, condividi, link non valido). A soglia 3 restano solo righe di 5 parole («Gioca la prima: compare qui.», «Compaiono dopo il primo duello.», «Nasce dal primo duello concluso.», «Vedi solo la classifica locale.»).
- Contrasto (JS di `tools/controlla-contrasto.py` su 8 viste × chiaro/scuro × vuoto/ricco = 32 combinazioni, 400 px): 0 violazioni.
- Chromium (Playwright), 400 e 1280 px, chiaro e scuro: nessuno scorrimento orizzontale (scrollWidth = clientWidth in tutte le foto); console senza errori né avvisi (solo, per `?vista=condividi&url=…`, un 403/404 del server di sviluppo perché Vite legge `?url` come suo parametro: non è dell'app).
- Flussi veri con due browser separati: A gioca un duello e ottiene il link; B (profilo nuovo) lo apre, mette il nome, gioca, vede il confronto e il link di risposta; A apre il proprio link («Tua sfida») e quello di B («Marta ha giocato» con il confronto); B riapre il link («Già giocata»); link manomesso; sfida non trovata; sfida del giorno giocata e ritorno a Oggi.
- Stati dei dati: «tutto vuoto» (nessuna sfida) e «con sfide giocate» (6 partite con 3 rivali e un duello in attesa; sono dati scritti nel browser di prova, non nell'app: nessun dato finto è spedito).

## Non provato
Dispositivi veri e Safari/iOS; apertura dei link di WhatsApp, Telegram, SMS (verificato solo il testo degli indirizzi e la copia); Web Share («Altre» non c'è in Chromium headless); il foglio di condivisione a schermi bassi (< 600 px di altezza); la schermata di gioco in corso (non toccata, vista solo per il controllo del testo); altezze diverse da 900/1000/1300; `build:demo`; la classifica con più di 10 persone.

## File toccati (tutti in `app/src/screens/extra/sfide/`)
`scheda.tsx` (testata «Sfide», selettore a 3 voci; resta `SchedaProveSfide` per «prove»), `comuni.tsx` (`IlluEsito`, nuovo `PannelloEsito`, `Fermo` con illustrazione; `useScuro` tolto, non serviva più), `Sfide.tsx`, `Amici.tsx`, `Classifica.tsx`, `ClassificaNoi.tsx` (nuovo), `SfidaGioco.tsx`, `SfidaRisultato.tsx`, `SfidaAccetta.tsx`, `Condividi.tsx`, `NOTE.md`. Nessun file da cancellare. Icone: nessuna nuova; `stato-link-rotto` non è più usata da queste viste (resta nel registro).
