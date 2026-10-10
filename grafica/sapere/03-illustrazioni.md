# Le illustrazioni: sette metodi, e perché

Partenza: due fogli del Brand Kit generati con l'AI (`kit-blu.png`, `schermate-funnel-14.png` e
kit rosso). Le illustrazioni sono piccole (~200×150 px) e morbide. Obiettivo dell'utente: **uguali**,
e poi **modificabili** (colore, posizione, altro), in parte animabili.

## 1. Estrazione identica (tenuto)

`estrai.py` ritaglia ogni elemento dalle "bande" dei fogli e toglie il fondo con l'unmatting di
Agorà (l'alfa lungo la retta fondo→inchiostro): ricomposizione ≤ 0,52/255. Sono i PNG di
`brand/elementi/`, identici all'originale. Servono come **riferimento** e come ripiego.

## 2. Ricalco automatico con vtracer (scartato)

`vettorializza.py`: nucleo pieno + alone semitrasparente separati, tre impostazioni. Scarto medio
3,4/255 ma **aspetto da acquerello**: bordi tremolanti, macchie. Su immagini di 200 px sfocate il
ricalco segue il rumore. L'utente: "non li hai veramente ricreati bene".

## 3. Regioni di colore + sfumature (scartato)

`disegna.py`: segmentazione a colori (k-means + fusione per somiglianza), una sfumatura per
regione. 7,6/255, sempre acquerello: le regioni hanno confini frastagliati.

## 4. Livelli con i pixel originali (tenuto per le modifiche raster)

`livelli.py` scompone ogni PNG in parti con i suoi pixel (ricomposizione 0/255); `modifica.py`
sposta, scala, ruota, ricolora o nasconde parti scelte per numero o per zona, ricostruendo lo
sfondo con l'inpainting. Funziona, ma resta raster e le parti sono quelle che trova la
segmentazione (a volte un libro è diviso in quattro pezzi insieme all'alone).

## 5. Parti vettoriali con maglie (scartato)

Contorni delle parti di `livelli.py` ingranditi e ricalcati + una maglia ciascuna. Contorni
tremolanti (la segmentazione è rumorosa). Provato anche lo spartiacque sul gradiente: fonde le zone
bianche (pagine, fondo, bandiera) perché sono collegate da passaggi senza bordo.

## 6. Disegno a mano + adattamento + maglie (fedele, ma sbagliato)

Forme scritte a mano con nomi, `adatta_svg.py` muove i numeri finché il render coincide,
`riempi_maglie.py` riempie ogni forma con una maglia misurata. 41 illustrazioni (4 agenti in
parallelo), scarto mediano 1,9/255. **Rifiutato dall'utente**, e aveva ragione:

- le maglie copiano i difetti dell'AI (macchie, sfumature sporche, bordi bianchi);
- `adatta_svg.py` muove ogni punto da solo e deforma le forme per inseguire i pixel sfrangiati
  (angoli smussati a caso, manici appuntiti, simboli storti); gli agenti hanno dovuto bloccare
  molte forme con `data-fisso`;
- nessuno correggeva gli errori del disegno: libri con spigoli che non tornano, simboli e scritte
  senza senso, righe doppie.

Lezione: **fedele ai pixel ≠ fatto bene**. Per un'illustrazione AI il pixel non è la verità.

## 7. Ridisegno pulito con generatori (metodo attuale)

Ogni illustrazione è un piccolo programma Python in `strumenti/brand/illustrazioni/` che scrive
l'SVG in `brand/disegni/<kit>/<gruppo>/<nome>.svg`. L'originale dà composizione, misure e toni;
gli oggetti sono costruiti come si deve con `geometria.py` (raccordi veri) e `oggetti.py` (oggetti
ricorrenti con parametri).

### Il primo libro, rifiutato: "è tutto spigoloso"

Copertina come parallelogramma con angoli da 4 px raccordati da una curva quadratica piccola,
dorso come quadrilatero, pagine come strisce: a 3x si vedono spigoli ovunque e il libro non ha
volume. Cosa mancava, capito guardando l'originale ingrandito:

- il libro è **una sola massa morbida**: la sagoma intera (dorso + copertina + lato) ha gli angoli
  raccordati con raggi diversi (8 dietro, 5 a destra, 4–3 davanti, **mezzo spessore sulla costa**);
- la copertina di sopra si stacca dal dorso con **un filo di luce**, non con uno spigolo;
- il dorso è **curvo**: chiaro in alto, scuro in basso, un riflesso lungo il dorso e il **solco
  della cerniera** vicino alla costa;
- il blocco pagine è **rientrato tra le due copertine**, con 3 righe sottili e l'ombra della
  copertina sopra;
- i toni vengono dall'**originale** (campionati sulle zone pulite: copertina `#A9C5F9`→`#6F9BE6`,
  dorso →`#3569C9`), non dalla palette pura, che era troppo satura.

Il raccordo vero conta: `geometria.arrotondato()` calcola per ogni angolo i punti di tangenza a
distanza r/tan(α/2) e un arco (cubica con maniglie 4/3·tan(φ/4)·r). Con la quadratica "a occhio"
gli angoli acuti restano appuntiti e quelli ottusi si appiattiscono.

### Tre esempi, tre tipi di oggetto

| Esempio | Tipo | Difetti AI corretti | Come |
|---|---|---|---|
| `studio_inglese.py` (libri) | oggetti 3D in prospettiva | spigoli sbagliati, dorso piatto, bandiera con diagonali centrate | `oggetti.libro()` con vettori u, v e spessore; `oggetti.bandiera_uk()` costruita come quella vera (diagonali rosse controcambiate) |
| `successo.py` (coppa) | oggetto simmetrico | manici diversi, coppa storta, stella storta, raggi disuguali | tutto su un asse CX e specchiato; stella a 10 punti con punte arrotondate; raggi a ventaglio con la stessa lunghezza |
| `piano_studi_bloccato.py` (calendario) | oggetto piatto d'interfaccia | foglio senza bordo, quadratini sfocati di misure diverse, arco del lucchetto irregolare | foglio con bordo e ombra, griglia regolare 3×2, arco a U di spessore costante, buco della chiave centrato |

### Procedimento per una nuova illustrazione

1. Guardare l'originale ingrandito (`griglia.py`, `--k 5`; `--riquadro` per i dettagli) e
   **scrivere l'elenco dei difetti AI** da correggere.
2. Misurare composizione (ingombri, centri, spessori) sulla griglia; campionare i toni sulle zone
   pulite (non sui bordi, non sulle macchie).
3. Scrivere il generatore: costanti in alto (tela, colori, posizioni), oggetti con nomi, simmetrie
   costruite, raccordi veri, sfumature a 2–3 fermate, un riflesso, un'ombra morbida.
4. `python3 strumenti/brand/controlla_disegno.py <svg>` e guardare la tavola (originale 3x | disegno
   3x | su fondo scuro | 1x). Ingombro (IoU) ≥ 0,8; avvisi di palette solo se voluti.
5. Guardare anche alla dimensione d'uso nell'app (~100–200 px).
6. Correggere e ripetere; mostrare all'utente.

Regole di stile: [`strumenti/brand/STILE.md`](../strumenti/brand/STILE.md).
