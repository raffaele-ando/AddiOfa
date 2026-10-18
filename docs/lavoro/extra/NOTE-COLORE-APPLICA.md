# NOTE-COLORE-APPLICA (agente COLORE-APPLICA, 17/10)

Applicazione della proposta `docs/design/COLORI-PROPOSTA.md` (consulente di colore) in chiaro e scuro. Porta di prova 5271 (Vite dev da `app/`). Dove la proposta è ambigua ho scelto la lettura più vicina al suo scopo e l'ho scritto qui sotto («Scelte»).

## 1. Cosa è cambiato

**Token dell'interfaccia** (`app/src/index.css`, `@theme static` + `.dark`): tutti i 50 valori del blocco JSON della sezione 3, chiaro e scuro, verificati uno per uno contro il JSON (0 differenze). I 11 token nuovi (`azione-testo`, `bordo-campo`, `errore`, `errore-chiaro`, `errore-testo`, `errore-tinta`, `errore-su`, `basso-su`, `medio-su`, `alto-su`, `viola-su`) generano da soli le utility Tailwind (`bg-errore`, `text-errore-su`, `border-bordo-campo`, `text-medio-su`, ...): controllato nel CSS del build.

**Landing**: `--landing-*` chiaro e scuro dal JSON della sezione 4 (28 voci), più `--landing-luce-ombra` e `--landing-lastra-ombra`. `rosso-linea` rinominato `corallo-linea` (un solo file, `SeNonSuperi.tsx`).

**Istruzioni di applicazione 1-5 (sezione 3)**
1. Sopra i fondi pieni: `bg-{basso,alto,viola,medio}-pieno text-azione-su` passa a `text-{...}-su` (sopra `medio-pieno` mai il bianco: `medio-su`, blu notte). Anche `TONI.pieno` in `screens/extra/ui.tsx`.
2. `basso*` usato per un ERRORE passa a `errore*`: risposta sbagliata in LearnMode (opzione scelta, barra in basso, icona, avviso «Riprova»), contatore «sbagliate» e «Errori frequenti» di StatsMode, filtro, badge, riquadro di confronto e «line-through» in CorrezioniComplete, tessera «sbagliate» (TessereEsito), «Errori» e i due esempi in Theory, «Da evitare» del Prontuario, avvisi «Domande non caricate», Toast di errore, ConfirmDialog «danger», campo non valido (sfide `Campo`), «Link non disponibile», «Togli» amico, «Cancella i dati» (Impostazioni). Dove `basso*` indica la FASCIA bassa o un esito (non superata, da ripassare, trend in calo, perso, timer in scadenza, «Scaduto», «Sotto soglia») resta `basso*` (ora corallo).
3. Bordi di campi di testo, ricerca, select, textarea: `border-bordo-campo` (CheatSheet, Frasi, Esercizi, Impostazioni, sfide, FoglioCondividi, Obiettivi, ProfiloModifica); ho aggiunto il bordo anche ai campi che prima non ne avevano (ricerca della FAQ, textarea di Segnala, ErrorBoundary). Interruttore di Impostazioni: traccia spenta con `ring-2 ring-inset ring-bordo-campo`, pomello `superficie` (in scuro `testo`, mai bianco puro).
4. Testo blu su tinta o su bianco: `text-azione-scuro` diventa `text-azione-testo` in tutti i file non protetti (circa 60 punti). `azione-scuro` resta per hover e bordi.
5. `marchio` e `azione` hanno lo stesso valore: lasciati entrambi.

**Regola del riempimento ambra**: arco del Misuratore (home e `brand/componenti`) e di `Indicatore`: arco con bordo di 2 px `medio-numero` (tracciato sotto, più largo) e pallino con anello `medio-numero`; barre e pallini piccoli (`coloreValore`, `TONI.barra`, `VAR_TONO`, punti del GraficoStime, puntini della FAQ): riempimento `medio-numero`; giorno «studiato» del calendario: bordo `medio-numero`. Provato a vista (home «Vicino»).

**Parola + forma oltre al colore**: verificato. Home: percentuale e parola nel misuratore, e sotto la fascia con parola e illustrazione diverse per fascia; barre di accuratezza e aree: numero scritto accanto; tessere dell'esito: icona e numero con `aria-label`. **Mancava** solo nella legenda del radar in ProgressiArgomenti (tre puntini colorati con parola solo in `aria-label`): ora ogni voce è una pillola con icona (spunta, uguale, ripasso), colore e parola («Solido», «Da migliorare», «Da ripassare»).

**Colori scritti a mano → token (sezione 5)**: `componenti.tsx` (CERCHI e CERCHIO_SCURO sostituiti da una sola mappa di classi: `superficie-2`, `azione-tinta`, `medio-tinta`, `basso-tinta`, `errore-tinta` per «errore», `alto-tinta`; bianchi su `superficie`/`azione-su`), `Lastra.tsx` (`gradino-sopra`, `luce-ombra`, `luce-bordo`, `luce`, `lastra-ombra`), `Misuratore.tsx` e `Indicatore.tsx` (`superficie`), `Scena.tsx` (bandiera: `azione-tinta-scura`, `corallo-linea`, bianchi `gradino-sopra`), `CtaFinale.tsx` (`blocco-blu-a`, `azione-tinta`, `azione`), `TelefonoPassi.tsx` (`blocco-scuro-da`), `BrandKitStub.tsx`. Risultato: **0 esadecimali a 6 cifre in `src/` fuori da `index.css`, `brand/tokens.ts` (valori misurati del catalogo ?brand), `BrandKit.tsx` (catalogo solo dev) e `essenziali/`**; l'inventario rigenerato dice «Colori scritti a mano: nessuno» (prima 24+10). `theme-color` già `#2563EB` = `azione`; `manifest.json` `background_color` portato a `#F7F9FD` (= `fondo`).

**Illustrazioni e raster (sezione 6)**: nuovo `tools/ricolora-illustrazioni.py`.
- SVG: regole 6.1-6.4 e 6.3 col codice di riferimento della proposta (copiato tale e quale; i 23 esempi della tabella 6.5 escono identici, chiara e scura). Cambia solo il colore dentro `fill`, `stroke`, `stop-color` (attributi o `style`): 3247 esadecimali coperti, nessun id scambiato per colore, nessun `<text>`. Si applica a `kit-blu` e `kit-luminoso` (varianti `.svg` e `.scuro.svg`) e ai glifi `kit-blu` (per i glifi «errore» = rosso addolcito, gli altri rossi corallo).
- Raster 6.7 con numpy: `hero/scena-chiara`, `hero/scena-scura` (bordi sfumati 24 px verso `fondo`), `landing/banner-edificio`, `landing/cta-fondo` (versione chiara cotta nel file; il tema scuro di banner e cta sta nel CSS come dice la 6.7: filtri e velo in `Perche.tsx` e `CtaFinale.tsx`).
- Idempotente: gli SVG ricolorati portano `<!--ricolorato:v1-->` e non si riprocessano; i raster si rileggono sempre da `grafica/brand/` (PNG se c'è). Agganciato a `tools/sincronizza-essenziali.sh` in fondo (dopo copia, ottimizzazione e `togli-nuvole`). Prova di riproducibilità: ricostruito in una copia di lavoro lo scheletro del repository ed eseguito l'intero `sincronizza-essenziali.sh`: l'output coincide byte per byte con le copie dell'app (disegni, glifi, hero, landing), con una sola eccezione: `kit-luminoso/illustrazioni/verifica-utente(.scuro).svg`, che nell'app era una copia non ottimizzata (a capo e ordine degli attributi), stessi colori. Le sorgenti in `grafica/brand/` non sono toccate.
- `kit-rosso` (alternativa di colore, solo catalogo `?brand`, fuori dall'inventario e dalla proposta) NON si ricolora.

## 2. Numeri prima/dopo

Illustrazioni (`tools/inventario-colori.py` rigenerato in `docs/design/COLORI-INVENTARIO.md`; stessa misura della proposta: i primi 8 colori di ogni file, kit-blu e kit-luminoso):

| | prima | dopo | proposta |
|---|---|---|---|
| chiara: colori distinti | 389 | 242 | 246 |
| chiara: coppie ΔE<2 | 2175 | 385 | 384 |
| scura: colori distinti | 332 | 232 | 240 |
| scura: coppie ΔE<2 | 866 | 566 | 590 |
| tutti i colori distinti (chiara / scura) | 579 / 521 | 351 / 329 | |
| colori con C>0,05 fuori dalle 6 bande (chiara / scura) | 59 / 58 | 1 / 1 | 0 / 0 |
| rossi (H 345-33, C>0,10) (chiara / scura) | 60 / 60 | 8 / 5 | solo errore |

I rossi rimasti sono solo H 14-16 e stanno nelle 4 illustrazioni «errore» di 6.3 (`documento-errore`, `quiz-test` blu e luminoso, `notifica`). Il colore fuori banda è un viola di `sfera-successi` a H 307 (la banda di controllo arriva a 305): 2 gradi, dall'originale, non dalla regola.

Token: 122 coppie testo/sfondo della sezione 3 (testo, tinte, `-su` su `-pieno`, numeri grandi, `bordo-campo`) ricalcolate sui valori di `index.css`: 0 sotto soglia. Fasce sotto daltonismo (Machado 1,0) ricalcolate: identiche alla tabella della proposta (deuteranopia chiaro 23/25/10, scuro 16/15/11; protanopia 28/17/15 e 19/9/18; grigi 24/18/7 e 17/6/11).

## 3. Prove (numeri onesti)

- `npx tsc --noEmit` pulito. `npm test` dalla radice: 290 prove, 286 verdi, 0 fallite, 4 saltate (erano 285: il collega ha aggiunto test). `npm run build` ok. Controllo «niente frasi» (`tools/controlla-testo.py` su home, esercizi, sfide, profilo, a 400 px): 0 blocchi.
- Chromium (Playwright) su Vite 5271, a 400 e a 1280 px, tema chiaro e scuro, con il calcolo del contrasto di `tools/controlla-contrasto.py` su ogni testo visibile (≥4,5:1, ≥3:1 per il grande) e scorrimento orizzontale: vedi sezione 6 (risultati per schermata).
- Illustrazioni guardate a occhio, prima e dopo, su fondo chiaro `#F7F9FD` e scuro `#0A101F`: 21 (attenzione-rischio, risultato-probabilita blu e luminoso, documento-errore, quiz-test blu e luminoso, attesa-caricamento blu e luminoso, celebrazione luminoso, composizione-tre, piano-studi-bloccato blu e luminoso, mancato-superamento, sfera-successi, sfera-costi, documento-in-corso, documento-completato, superamento, notifica, successo, quiz-test-lista) e i 4 raster. Nessun blu sparisce sul fondo scuro, nessuna coppia corallo-blu vibra, i gradienti 3D restano.
- NON provato: `tools/controlla-contrasto.py` nel suo percorso guidato (demo, diagnostico → simulazione → correzioni): si ferma già al passo «Inizia» del diagnostico perché il funnel di registrazione del collega (PROGETTO) ha messo prima i campi del profilo: causa vecchia e non mia; ho usato la sua funzione di contrasto su schermate aperte direttamente. `LastraContenuto` (in `Lastra.tsx`) non è importato da nessuna schermata: i token sono applicati, ma non c'è nulla da vedere. Il timer corallo di ExamMode (≤ 2 minuti) e di LearnMode (≤ 5 s) non provato a vista (solo codice). Non provati: telefono vero, `npm run build:demo`.

## 4. Scelte (dove la proposta non decide)

- **Errore o corallo?** Errore = risposta sbagliata, campo non valido, annulla/cancella, fallimento di caricamento. Corallo (`basso*`) = fascia bassa, non superata, da ripassare, trend in calo, perso, sotto soglia, e anche tempo che sta per finire e «Scaduto» (è una scadenza, non un errore: il rosso sul timer è pressione).
- La tessera «sbagliate» dell'esito di una simulazione è `errore` (è una risposta sbagliata): quindi nella schermata dell'esito compare il cremisi nelle tessere e nelle correzioni, ma il verdetto, il misuratore e i numeri grandi restano corallo/ambra/verde-acqua. La verifica 7.5 della proposta («nessun rosso nella schermata del risultato») l'ho letta come verdetto e probabilità.
- Hero della landing: nella carta del quiz la risposta B (con la spunta della risposta giusta) era `basso-pieno` (rosso); l'ho messa `alto-pieno`/`alto-su` (una spunta giusta non può essere rossa; così nella landing non c'è nessun rosso prima della sezione errori).
- `Tono` di `screens/extra/ui.tsx` NON ha un tono `errore`: aggiungerlo romperebbe i `Record<Tono, ...>` dei file del collega (Esplora ecc.). Dove serve (tessera, comando di Impostazioni) uso classi `errore*` locali.
- `Lastra.tsx`: tutti i `#FFFFFF` → `gradino-sopra` come dice la tabella, anche il centro della porta di luce (in scuro diventa `#D3DFF3`, azzurrino, invece di bianco). Non visibile in nessuna schermata (vedi sopra); se `LastraContenuto` tornasse in uso, il centro in scuro andrebbe provato.
- Hero scuro: la regola «pixel con C ≥ 0,08 → H 265, C×0,72» è applicata ai soli blu (H 200-300): la porta di luce ambra resta calda (altrimenti la stella diventava azzurra). Soglie con rampa (0,07-0,08) invece che scalino. Banner chiaro: la regola delle ombre blu (L<0,45) ha una rampa 0,45-0,55 e il beige una rampa C 0,06-0,08: la soglia secca lasciava strisce blu e ocra lungo il cornicione.
- Il webp ricodificato pesa un 20% di più (hero 34→41 KB, banner 49→61 KB): qualità 86; totale +30 KB.

## 5. Osservazioni per il consulente (valori della proposta, applicati alla lettera)

- Chiaro: `errore-tinta` `#FEF0F0` e `basso-tinta` `#FFF1EC` distano ΔE 0,7 (indistinguibili); `fondo`/`superficie` 1,9; `linea`/`azione-tinta` 1,6; `viola-tinta`/`superficie-2` 1,4. Scuro: `azione`/`azione-a`/`marchio` 1,35 (il gradiente `azione-da → azione-a` in scuro quasi non si vede), `azione-testo`/`azione-chiaro` 1,4, `basso-chiaro`/`basso-testo` 2,0, `viola-chiaro`/`viola-testo` 1,2. Landing scura: `cielo-alto`/`pagina-da` 1,8, `cielo-basso`/`blocco-scuro-a` 1,5, `lastra-3`/`blocco-blu-a` 1,4, `gradino-ombra`/`muro-2` 0,8. Non sono nell'elenco degli alias dichiarati (7.7).
- Illustrazioni scure: il bianco delle carte è `#E5E8ED` (L 0,93): la croce o il «1» bianchi su `#EF7D87` (documento-errore, notifica) hanno un contrasto grafico di circa 2,5:1, sotto il 3:1 della regola dei componenti. È voluto dalla 6.2 (L'≥0,72 per l'errore, bianchi ≤0,93), ma il segno è meno netto di prima.
- Il kit-rosso (catalogo ?brand) e `brand/tokens.ts` conservano i loro rossi di misura: non sono nell'app.

## 6. Richieste per i file del collega PROGETTO (non toccati)

Nessun esadecimale. Da fare lì (file:riga dello stato attuale):

- `components/Onboarding.tsx:63` `TESTO_FASCIA` e `:77-79` `FASCIA`: `basso` resta corallo (è fascia), ma `tessera: 'bg-X-pieno text-azione-su'` va in `text-{alto,medio,basso}-su` (sopra `medio-pieno` mai il bianco). `:492` chip `bg-basso-tinta text-basso-testo`: se significa «punto debole» resta, se è un errore passa a `errore-tinta`/`errore-testo`.
- `screens/extra/progetto/Noi.tsx:86-87` e `:132` (messaggio d'errore di rete): `bg-basso-tinta text-basso-testo` → `bg-errore-tinta text-errore-testo`; `:25` `MEDAGLIA`/`:101`: `bg-medio-pieno text-azione-su` → `text-medio-su`, e `bg-testo-tenue text-azione-su` va controllato (bianco su grigio, 5,8:1: ok), `bg-medio-pieno/80` è ambra sbiadito: con `medio-su`; `:92` e `:125` `text-azione-scuro` → `text-azione-testo`.
- `screens/extra/progetto/ProjectId.tsx:250` `ErroreRiga` e `:413` riquadro d'avviso `bg-basso-tinta` → `errore-tinta`/`errore-testo`; `:417` `bg-basso-pieno text-azione-su` (pulsante distruttivo: esci, cancella) → `bg-errore text-errore-su`; `:26` `TONO_INVIO` `rifiutata: 'basso'` (invio rifiutato è un errore, non una fascia): serve un tono errore o classi locali; `:215`, `:267` `text-azione-scuro` → `text-azione-testo`; `:400` textarea `border-linea` → `border-bordo-campo`.
- `screens/extra/progetto/Esplora.tsx:17-18`: stesso `TONO_INVIO` `rifiutata: 'basso'`.
- `screens/extra/progetto/comuni.tsx:49-50`: `tono === 'rischio'` `bg-basso-tinta text-basso-testo` è corallo, va bene; `text-azione-scuro` → `text-azione-testo`.
- `screens/extra/progetto/registrazione.tsx:65` `CAMPO` (`border-linea`) → `border-bordo-campo`; `:75` e `:165` messaggi `text-basso-testo` (errore di validazione e di invio) → `text-errore-testo`; `:244`, `:256`, `:266` carte-pulsante `border-linea` (sono scelte, non campi: va bene, ma se sono l'unico segno di un controllo, `border-bordo-campo`); `:303-305` casella: `border-linea`/`border-tacca` → `border-bordo-campo` (le caselle non spuntate non arrivano a 3:1); `:150`, `:162`, `:217`, `:334` `text-azione-scuro` → `text-azione-testo`.
- `screens/extra/progetto/AtlasAnalisi.tsx:104-105`: legenda a puntini (alto/medio/basso) con la parola: va bene, ma `bg-medio` da solo → `bg-medio-numero` (regola del riempimento ambra) e meglio aggiungere la forma come in `ProgressiArgomenti`.
- `tests/anteprime/progetto.tsx`: nessuna richiesta.

## 7. Come si riprova

`python3 tools/ricolora-illustrazioni.py --prova` (non scrive), `npm run grafica:sync` (rifà tutto da `grafica/brand/`), `python3 tools/inventario-colori.py --md docs/design/COLORI-INVENTARIO.md` (numeri), `cd app && npx vite --port 5271`.
