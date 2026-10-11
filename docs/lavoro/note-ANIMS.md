# Note ANIMS: animazioni a pezzi delle illustrazioni

Cartelle mie: `app/src/brand/animazioni/` (CSS + README con l'API), `tools/make-prova-animazioni.py`, `tools/controlla-animazioni.py`, `docs/lavoro/anims/` (strisce). Nessun file dell'app toccato: il componente `IllustrazioneAnimata` non c'è ancora.

## Cosa c'è
11 animazioni: studio-inglese, quiz-test, risultato-probabilita, successo, celebrazione, mancato-superamento, progressi-statistiche, piano-studi-bloccato, superamento, suggerimenti-consigli, attesa-caricamento (1,4-2,15 s, una volta, nessun loop). Dettaglio in `app/src/brand/animazioni/README.md`.
Solo CSS sugli id dei pezzi: `translate`/`opacity`, `stroke-dashoffset` (tracciati), `scale` 1 0 -> 1 1 dalla base (barre, filo di sabbia), `offset-path` (cursore dell'arco), `rotate` (stella, clessidra, arco del lucchetto). Niente rimbalzi, pulsazioni, galleggiamenti.

## Scelte tecniche
- Id prefissati `<nome>--` all'inserimento inline: senza, `arco-luce`, `ombra`, `sfuma-ombra` si scontrano tra illustrazioni diverse.
- Le proprietà `translate`/`rotate`/`scale` si compongono con il `transform="rotate(...)"` già presente su fogli e bandiera: nessuna modifica agli SVG.
- Regole tutte sotto `.in`; senza `in` l'SVG è lo stato finale. Movimento ridotto: `animation: none`.
- I chiaro e scuro sono identici (nuvola tolta), la pagina di prova li inserisce comunque entrambi e mostra quello del tema.

## Prove (Chromium, Playwright, tempo fissato con le Web Animations)
- Fotogrammi a 0, 300, 700, 1200, 2000 ms diversi tra loro per tutte e 11 (scarto medio minimo 0,17/255 tra 1200 e 2000 su suggerimenti-consigli; per chi finisce prima di 2 s l'ultimo intervallo è piccolo ma > 0).
- Stato finale (3 s) = statico: scarto 0,0000, 0 pixel oltre soglia 12. A 3 ms dalla fine: scarto <= 0,23/255.
- Movimento ridotto: tutti i fotogrammi = statico (scarto 0,0000).
- Pagina di prova 122 KB, nessuna risorsa esterna, zero errori in console, nessuno scorrimento orizzontale a 400 px (chiaro e scuro); 1280 px solo larghezza controllata, non guardato a occhio.
- Strisce guardate a occhio una per una (chiare) e due in scuro (quiz-test e pagina intera): corretti ghost troppo lunghi (dissolvenza separata e più corta dal movimento), raggi del trofeo (ora insieme), lucchetto (arco e corpo insieme), cursore dell'arco più pronto.
- Trovato nel controllo: le animazioni messe in pausa a mano restano attaccate e si moltiplicano; il controllo le cancella tra un fotogramma e l'altro (nell'uso reale, senza pausa, il riavvio con togli `in` / rimetti `in` è normale).

## Cosa non convince
- Bandiera: non sventola, si posa soltanto (il gruppo è clippato e ha un transform a matrice: ondularla richiederebbe di cambiare l'SVG). Con un pezzo "asta" o un wrapper in più si potrebbe fare.
- Libri: non si "aprono" (nel disegno sono chiusi); si impilano e le pagine si tracciano.
- Clessidra: il capovolgimento di mezzo giro è il movimento più grande di tutti; il livello sopra non è fisicamente esatto (sopra cala di ~5 px, sotto cresce di 6 px). Per un caricamento lungo servirebbe una versione ciclica lenta: non fatta (vietati i loop vistosi).
- Alcune partenze mostrano per ~200 ms un pezzo semitrasparente sopra un altro (libro blu sul giallo): accettabile, riducibile accorciando la dissolvenza.
- Il tick/croce a inizio tracciato mostra un puntino (cappuccio tondo) per un paio di fotogrammi.
- Non provato in Safari/Firefox (`translate`, `rotate`, `scale` individuali e `offset-path` su SVG: Chromium sì, Firefox e Safari recenti dovrebbero, non verificato).

## Dove usarle nell'app
- studio-inglese: Onboarding (passo con `Scena nome="studio-inglese"`).
- superamento: Onboarding (passo finale) e landing `CtaFinale`.
- quiz-test: ExamMode (schermata di avvio, riga 284) e landing `Offerta`.
- risultato-probabilita: esito della stima (`CalcoloRisultato` / `EsitoSimulazione`) quando il risultato si apre; ripetibile con «Rivedi».
- successo: `FineSessione`, `Waitlist` (iscrizione riuscita).
- celebrazione: `PaymentThanks`.
- mancato-superamento: esito di una simulazione sotto soglia (`EsitoSimulazione`), con tono sobrio.
- progressi-statistiche: `StatsMode` (testata) e landing `Offerta`.
- piano-studi-bloccato: contenuti con Pass (paywall / `Obiettivo` bloccata).
- suggerimenti-consigli: consigli e suggerimenti dopo una correzione.
- attesa-caricamento: schermate di caricamento / calcolo.
Il componente `Illustrazione` oggi usa `<img>`: per animare serve il nuovo componente inline (API nel README).
