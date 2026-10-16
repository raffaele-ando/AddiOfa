# NOTE-ASSET: tutta la grafica ridisegnata è spedibile

Agente ASSET, 16/10. Documento principale: `docs/design/ILLUSTRAZIONI.md` (inventario di 88 voci, piano schermata → illustrazione, motivi di chi non si usa).

## Fatto

- **67 illustrazioni nell'app, chiare e scure**, in `app/src/brand/essenziali/disegni/` (736 KB con il kit rosso): 16 del kit blu di prima, 8 nuove nel kit blu (`attenzione-rischio`, `piano-superamento`, `simulazione-esame`, `rischio-economico-ali`, `progressi-statistiche-scheda`, `quiz-test-lista`, `cappello-laurea-orologio`, `composizione-tre`), 12 stati (`kit-blu/stati`), 14 sfere (`kit-blu/sfere`), 17 del kit luminoso (`kit-luminoso`). Le prime due famiglie nuove vengono dal kit rosso ricolorato in blu (`blu_da_rosso.py`, tenendo rossi errore, notifica e triangolo di attenzione); sfere, cappello, composizione e luminoso dai `concept-svg/` (`porta_in_disegni.py`).
- **Tema scuro**: regole per id in `scuro_svg.py` (carte blu notte, blu schiariti, anelli del colore della carta; sfere con vetro scuro e `scuro_sfera`). Verificato in Chromium su `#F7F9FD` e `#0A101F` con il nuovo `controlla_temi.py` (numeri) e guardando i fogli: nessun `<text>`, nessun colore che sparisce, nessun alone bianco; viewBox allargato dove un raggio o una coda usciva dalla tela (kit luminoso, `quiz-test-lista`).
- **Catalogo** (`brand/catalogo.ts`): campo `descrizione`, nuovo kit `kit-luminoso`, gruppi `stati` e `sfere`; tolte le due `email-istituzionale` (sigillo del Politecnico). `Illustrazione` trova la voce tra le sole grafiche (`tipo: 'grafica'`). `risorse.ts`: glob del kit luminoso; nell'app normale le illustrazioni sono file a parte (`?url&no-inline`: il JavaScript passa da 988 KB a 620 KB, gzip da 197 a 162), nella demo restano incorporate. `BrandKit.tsx` (`?brand`): mostra anche il tema scuro e la descrizione.
- **`tools/controlla-illustrazioni.py`**: voci del catalogo, file presenti, uso in `app/src` (fuori da `brand/`), `NON_USATE_OK` con motivo; esce con 1 se qualcosa resta non usato e non giustificato. Stato ora: 16 usate, 48 in attesa delle schermate, 3 giustificate (`composizione-tre` e `kit-luminoso/risultato-probabilita` con «82 %» scritto nel disegno, `kit-blu/stati/caricamento` sostituita dallo spinner), 21 del kit rosso giustificate.
- `tools/sincronizza-essenziali.sh`: non svuota più tutta `essenziali/` (cancellava `hero`, `landing`, `icone` che altri toccano), rifà solo `disegni`, `glifi`, `logo`. **Non l'ho lanciato**: ho rifatto a mano gli stessi passi (copia, `ottimizza-svg.mjs`, `togli-nuvole.mjs`).

## Da sapere

- Il kit rosso resta spedito (non nella demo) solo per il catalogo `?brand`, che esiste solo in sviluppo: nell'app in produzione i suoi file sono emessi ma non caricati. Se si vuole alleggerire, togliere `disegniRosso` da `risorse.ts` e le voci rosse dal catalogo.
- `togli-nuvole.mjs` toglie ogni elemento con id `nuvola`: nel «vuoto» la nuvola è il soggetto e si chiama `nuvola-triste` (ritocco in `blu_da_rosso.py`).
- Le animazioni a pezzi esistono solo per 11 illustrazioni del kit blu (`NOMI_ANIMATI`).

## File da cancellare (non posso)

`grafica/brand/disegni/kit-blu/stati/{completato,errore,in-corso}{.svg,.scuro.svg}` e le stesse sei copie in `app/src/brand/essenziali/disegni/kit-blu/stati/`: nomi di una prima versione, sostituiti da `documento-completato`, `documento-errore`, `documento-in-corso`. Inutilizzati, 15 KB nel bundle.

## Cosa non ho provato

- `npm run check` completo e `npm test`: ho lanciato `tsc --noEmit` (pulito), `vite build` (ok) e `build:demo` con il suo controllo (ok, 2,6 MB); il catalogo `?brand` aperto in Chromium a 400 e 1280 px, tema chiaro e scuro: 296 immagini, zero rotte, zero errori in console. Non ho percorso le altre schermate dell'app.
- Le sfere e gli SVG nuovi non sono ancora in nessuna schermata: li vedranno gli agenti che seguono il piano; la resa in contesto (sfondo `bg-azione-tinta`, vetro delle carte) si giudica lì.
- Le 8 «nuove» del kit blu ricolorate da rosso sono viste a occhio sul foglio, non confrontate con un riferimento pixel per pixel (non c'è: il blu non esisteva nei concept).
