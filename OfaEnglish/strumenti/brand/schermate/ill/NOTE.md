# Note dell'agente `ill` (illustrazioni grandi dei brand board 7, 8, 15, 28, 35, 40, 50)

`python3 genera_tutto.py` rifà SVG (brand/concept-svg/illustrazioni/), tavole (brand/concept-svg/_tavole/illustrazioni/), rapporto
(_rapporti/ill.json) e brand/concept-svg/illustrazioni/COPERTURA.md.

## Cosa è venuto fuori
- Quasi tutte le illustrazioni grandi dei sette fogli sono LO STESSO SOGGETTO delle 41 già ridisegnate (51 ritagli su 63 illustrazioni): riuso.
  Le differenze sono di inquadratura/dettaglio (50.039 senza finestra, 50.040 coriandoli diversi), non nuovi soggetti.
- Soggetti nuovi o varianti sostanziali (12 SVG): calendario con lucchetto BLU (due inquadrature: 7.049 navy, 28.089 blu), cappello di laurea con
  cronometro (15.061), busta con sigillo kit blu (50.028) e kit rosso (08.036) — prime versioni di `email-istituzionale`, con sigillo = segnaposto —,
  composizione misuratore+globo+calendario (40.026, riuso di tre pezzi), forme/pattern decorativi (7.054, 7.055, 28.095, 28.097, 35.092, 40.071).
- 23 e 27 sono copie byte per byte di 50 (md5 dei 70 ritagli).
- La «grafica ≥ 90 px» del catalogo contiene molto altro (loghi, testi, campioni, componenti, schermate, foto): circa due terzi (130 su 192) non è
  illustrazione. Si distingue guardando il foglio di contatti (ci ho messo due minuti, evita di ridisegnare a vuoto).

## Imparato
- Per decidere «uguale o variante» serve il confronto accanto, non la memoria: foglio con [ritaglio | SVG esistente] per ogni coppia, 3 per riga, 230 px alti.
- Disegnare in pixel dell'originale (viewBox = misure del ritaglio) rende la tavola immediata e le misure leggibili con una griglia a 5-8x
  (zoom.py in scratchpad: griglia rossa ogni 10 px con i numeri); i dettagli (rotazione della busta, posizione del lucchetto) si leggono così.
- Gli errori AI trovati: calendario con un solo anello (e a volte una molletta), buco della chiave a freccia, tocco non parallelogramma, doppio
  contorno dietro il lembo della busta, aeroplanino a chiazza, scintilla storta; correzioni dichiarate nell'intestazione di ogni generatore.
- Il ritaglio incollato su bianco falsa un po' lo scarto sulle forme chiare (fondo del foglio #F6F9FE contro bianco): per le forme decorative lo scarto
  basso non dice molto, guardare la tavola.
- Il sigillo è un disco blu notte con anello chiaro, id `sigillo-segnaposto`: sostituibile con lo stemma quando c'è l'autorizzazione.

## Cosa non mi convince
- Le buste: l'originale è bianco su bianco (flap quasi invisibile) e la geometria della rotazione è una stima; scarto 13-15/255, la tavola
  mostra la stessa composizione ma l'angolo e la punta del lembo non coincidono al pixel.
- Le forme decorative hanno bordi sfumati nell'originale (AI) e netti qui: scelta voluta, ma cambia l'effetto «luminoso».
- 7.056/7.057 (tratti curvi con freccia) li ho scartati come frammenti: se servono sono due path, 10 minuti.
