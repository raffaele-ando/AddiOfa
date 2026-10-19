# Revisione 18/10: Home

Agente HOME. Perimetro: `app/src/components/Menu.tsx`, `app/src/components/home/**`, `FoglioStima.tsx` (non toccato), `app/tests/anteprime/home.*`, `app/tests/unit/home-stato.test.ts`. Fonti: `docs/design/revisione/SINTESI.md`, `G1-concept-home.md`, parti Home di `C-schede-simulazione.md`; concept 14, 03, 21, 33, 01 (confronto a occhio).
Immagini a tutta altezza (4 stati nuovo/basso/medio/alto affiancati, saluto con nome): `docs/lavoro/extra/home-revisione/home-{light,dark}-{400,1280}.png`. Anteprima: `app/tests/anteprime/home.html?stato=nuovo|basso|medio|alto&sim=0|1&punti=1..5&nome=Raffaele&aree=0&debole=1&tema=dark`.

## Cosa è cambiato

**Struttura (telefono, una colonna):** intestazione (marchio a 28 px, profilo 36) → saluto «Ciao, {nome}» + riga (solo se il profilo ha il nome E la finestra è alta: sparisce sotto 820 px di altezza, così a 360×640 il pulsante resta sopra la piega; verificato) → misuratore → fascia di stato → pulsante → **Prossima lezione** → **Le tue aree** → **Simulazione** → **Andamento**. Sezioni a 32 px (24 sui telefoni bassi), carte a raggio 16, titolo di sezione 18/24 extra-grassetto, titolo di carta 16-20, titolo di riga 15, testo 14, didascalie 12-13 (tre livelli veri; nessun testo sotto 12 px).
- **Fascia di stato** (`Stima.tsx`, `stato.ts`): glifo tondo da 40 px (forma diversa per stato: germoglio, triangolo, barre, spunta; colore del token `-pieno`/`-su`), titolo ≤ 3 parole e riga ≤ 10 (in `data-testo-ok`). Testi veri: «Da iniziare / Con 10 domande ottieni la prima stima.», «In partenza» (diagnostico < 20 %), «Da migliorare / Parti dalle aree in cima all'elenco.» (o «Allenati ancora…» se non ci sono dati per area), «Vicino alla soglia / Punteggio probabile tra 22 e 26 su 30, soglia 25.» (da `formatPunteggio(stima.intervallo)`), «In linea / Mantieni il ritmo con una simulazione.» (con il solo diagnostico: «Conferma la stima con una simulazione.»). Niente contorno né lastra marrone: in chiaro la tinta della fascia, in scuro la fascia al 12 % sulla carta. Chip a destra del titolo «↑/↓ da 18 %» (la prima stima misurata) solo con due o più misure e differenza ≥ 2 punti; mai rosso per un calo.
- **Pulsante** (`Cta.tsx`, `stato.ts`): verbo + oggetto e riga sotto. Nuovo: «Fai il test iniziale / 10 domande per la stima»; basso e medio: «Continua l'allenamento / 10 domande scelte per te»; alto: «Fai una simulazione / 30 domande, 15 minuti». Il testo parte a 68 px dal bordo, come fascia, righe lezione e righe aree (un'unica colonna). In scuro gradiente di un gradino più scuro, testo scuro.
- **Prossima lezione** (concept 33, ma NEUTRA, non tinta di stato): tessera 56, «LEZIONE n · A1», titolo 20/26, tre dati veri (domande, minuti = `minuti.totale` di `lezioniPercorso`, imparate), pulsante «Inizia / Riprendi la lezione». Sotto «Poi» e due righe compatte (barra solo se qualcosa è imparato).
- **Le tue aree** (concept 21, nuovo): una colonna, una carta, righe da 56 px con nome e percentuale SULLA STESSA riga, barra da 6 px con sfumatura della fascia, dalla più debole; sotto il 40 % la parola «Da migliorare» col suo segno; con meno di 5 risposte «–» e «Meno di 5 risposte»; senza nessun dato una carta che dice la causa. Fonte: `calcolaFattori` (categorie Grammatica, Traduzione e livelli A1, A2, B1: la stessa dell'analisi ATLAS).
- **Simulazione:** carta raggio 16; risultato 30/32, «Superata»/«Sotto soglia» con segno, data e (sotto soglia) «soglia 25 su 30»; il ▶ a sola icona è diventato un pulsante con la parola («Fai una simulazione» / «Fai un'altra simulazione»).
- **Andamento:** dentro una carta, altezza 96, scala adattiva (min−10…max+10, tra 0 e 100, almeno 30 punti di ampiezza: `scalaGrafico`), tre filetti, solo punti misurati, punto finale con anello da 3 px, nomi «Sim. 2» (11 → 12 px). Un solo punto: «Fai una simulazione per vedere la curva.»; nessuno: «Ancora nessun dato / Dopo il test iniziale vedrai la curva.».
- **Misuratore** (`Misuratore.tsx`, usato anche da AtlasAnalisi e dalla hero della landing): via il contorno marrone dell'ambra (arco e pallino prendono un ambra più profondo, mescola di `medio` e `medio-numero`); in scuro anello del marcatore chiaro (`fill-testo`) invece di blu notte, traccia un gradino più chiara (`tacca`).
- **Desktop ≥ 1024 px:** `useColonnaLarga()` (colonna da 960 px del guscio). Sinistra fissa (`sticky`, 400 px): saluto, misuratore, fascia, pulsante, **Simulazione**; destra: prossima lezione + «Poi», aree, andamento. Navigazione in alto (Home / Esercizi / Sfide) nell'intestazione; la barra in basso è nascosta da 1024 px. A 1280×800 si vedono senza scorrere misuratore, fascia, pulsante, simulazione, lezione e le prime aree. Scelta: la Simulazione va a sinistra e non a destra come in G1 perché in 464 px di colonna destra non ci sta accanto alle aree e sarebbe finita sotto la piega.
- **Tessere:** «There is / There are» e preposizioni di luogo → lente (`ricerca`), preposizioni di tempo → clessidra; «Quantificatori» non ripete più l'illustrazione della fascia (la fascia non ha più illustrazioni).
- `comune.tsx` (condiviso con altre schermate): `Carta` ora raggio 16 e `Barra` con traccia visibile in scuro; `TitoloSezione` ora 18/24 extra-grassetto (era 15,5 bold) e `LinkTutte` con testo scelto da chi chiama. Questo cambia anche le schermate che li importano (studio, profilo): è voluto (scala unica) ma va guardato.

## Cosa dei rapporti NON è applicato (e perché)
- Fascia «Ci sei quasi: servono 25/30» dentro il misuratore (C F1) e misuratore a 120 px: no, G1 e il brief chiedono la fascia con titolo e riga e il misuratore a geometria del concept 14.
- Chip «+12 punti»: fatto come «da 18 %» (la prima stima), perché i «punti» si confonderebbero coi punti del punteggio su 30.
- Pulsante «Continua: Present Simple» (C): no, il pulsante lancia la sessione intelligente, non la lezione; mentire sull'oggetto sarebbe peggio. La lezione ha la sua carta.
- Sottoriga «Allenamento su {area più debole}» (G1 3.5): non applicata, perché il pulsante avvia la sessione intelligente, non l'area; scritto invece «10 domande scelte per te» (vero). Le righe delle aree avviano l'area, ma solo se `App.tsx` passa `onAllenaArea` (vedi richieste).
- Aree 2×2 (G1 5.3): la colonna destra è di 464 px, due colonne da 216 px non reggono nome, percentuale e barra.
- Fondo scuro un gradino più scuro (`#0D1526`) e bordo interno 5 %: sono token/valori di `index.css` (non miei); le carte si distinguono già (provato a occhio e col controllo contrasti).
- Barra in basso con icona piena (G1 3.10): fatta dal guscio.
- «Rischio», sfere, cerchi attorno alle illustrazioni, campanella, streak, proiezioni 82→28 %: esclusi come da SINTESI. Il glifo tondo della fascia è un simbolo, non un'illustrazione con un cerchio attorno.

## Richieste per file non miei
1. `App.tsx`: passare a `<Menu>` `onAllenaArea={f => { setLearnMode('category'); setLearnCategory(f); setView('learn'); }}` (filtri `category:Grammatica`, `level:A1`, già capiti da `selectPracticeIds`). Senza, le righe delle aree non sono toccabili (nessuna regressione, ma niente azione).
2. `App.tsx` (riga ~360, errore `tsc` non mio): `conBarra` riceve `'nessuna'` ma accetta solo `Scheda`: è il lavoro in corso sul campo `barra: 'nessuna'` (NOTE-REVISIONE-GUSCIO.md); tipo da allargare.
3. Incoerenze viste in file non miei: (a) `AtlasAnalisi`/`servizi/analisi.ts` usa `serieStime(stato, 6)` (6 punti) e la Home 5: stessa serie, una finestra diversa; (b) i nomi dei punti: Home «Sim. 2» abbreviato, Atlas «Dopo sim. 2». Basta scegliere uno: ho abbreviato solo nel grafico per fare spazio; (c) `Indicatore.tsx` (usato da `brand/componenti.tsx`) ha ancora il contorno marrone sull'ambra: aggiornare insieme al Misuratore; (d) Esercizi mostra «Allenamento consigliato / 10 domande scelte per te»: coerente con la Home, ok.
4. `Navigazione.tsx`/guscio: la Home da 1024 px ha il suo `<nav aria-label="Sezioni">` in alto e nasconde quello in basso (display none, quindi un solo nav per volta nell'albero di accessibilità). Se il guscio adotterà una soluzione comune da desktop, togliere il blocco `lg:` dall'intestazione di `Menu.tsx`.

## Numeri (provato)
- `npm test` dalla radice: 307 prove, 303 passano, 0 falliscono, 4 saltate (non mie). 7 prove nuove in `tests/unit/home-stato.test.ts` (fascia, limiti di parole dei testi, pulsante, chip, ordine aree, scala del grafico).
- `npx tsc --noEmit`: nei miei file zero errori; l'unico errore rimasto è in `App.tsx` (vedi sopra), non mio.
- `npx vite build`: ok.
- `tools/controlla-testo.py --viste home` (chiaro e scuro): 0 blocchi sopra 5 parole; stesso controllo (stessa funzione) sull'anteprima in 8 combinazioni di stato × chiaro/scuro × 400/1280: 0.
- `tools/controlla-contrasto.py --solo-pagina` sull'anteprima: 0 violazioni e 0 errori in console in 24 combinazioni (6 stati, chiaro/scuro, 400 e 1280) e di nuovo sulle 4 più rischiose dopo l'ultima modifica.
- Overflow orizzontale: nessuno (scrollWidth ≤ larghezza e nessun elemento oltre i bordi) a 320, 360, 400, 768, 1024, 1280 px, chiaro e scuro, 4 stati, anche con un nome lunghissimo.
- Schermate a tutta altezza (400×2600, 1280×1100) nei 4 stati, chiaro e scuro, lette a occhio contro i concept 01, 14, 21, 33; app vera a 400 e 1280 con stato salvato: zero errori, navigazione in alto a Esercizi e ritorno funzionanti.
- L'unico errore di console visto è `favicon.ico` 404 sulla pagina di anteprima (non sull'app).

## Non provato
- Un vero telefono, Safari/iOS (safe-area, `color-mix`, `container query`), tastiera e lettore di schermo (solo etichette scritte, `role=status`, nessuna prova con uno screen reader).
- Il tocco sulle righe delle aree (non collegato finché `App.tsx` non passa `onAllenaArea`).
- 768-1023 px: la colonna è quella da 480 del guscio (provato per l'overflow, guardato una volta a occhio).
- Il contrasto dell'arco ambra (non testo) senza contorno è sotto 3:1 sul bianco: il valore è sempre scritto con la sua parola («Vicino alla soglia»), quindi il colore non è l'unico segnale, ma il rapporto non è verificato e va deciso dall'autore.
- Lo stato «Tutte imparate» (nessuna lezione rimasta nel percorso) non è stato visto in anteprima.
