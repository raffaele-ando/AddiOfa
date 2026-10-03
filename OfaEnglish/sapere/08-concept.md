# Estrarre gli elementi dalle immagini di design-concept

`design-concept/` (alla radice del repo) contiene 52 immagini generate dall'AI: schermate dell'app,
brand board, locandine, landing, icone, social. Le tre sottocartelle sono state eliminate: ora è una
cartella sola (tre file sono copie identiche di uno stesso jpg, due di un altro: tenuti tutti).

`strumenti/brand/estrai_concept.py` ritaglia da ogni immagine i suoi elementi, come si era fatto per i
fogli del brand kit, ma **senza** dire a mano dove sono: li trova da solo.

    python3 strumenti/brand/estrai_concept.py          # tutte e 52 (circa 8 minuti)
    python3 strumenti/brand/estrai_concept.py 08 24    # solo alcune, per indice (ordine alfabetico del file)

Uscita in `brand/concept/<NN>-<nome>/`: `NNN-<tipo>.png` (un file per elemento), `anteprima.png`
(l'immagine con i riquadri numerati: **guardarla sempre**), `elementi.json` (lista e albero dei tagli);
in `brand/concept/concept.json` l'indice. I nomi delle cartelle sono mie descrizioni (dizionario `NOMI`).

## Risultato (ultima corsa)

52 immagini, **1277 elementi**: 700 grafiche, 381 pannelli, 183 schermate, 13 foto, 46 testi (non salvati,
solo contati). Ricomponendo ogni ritaglio sul fondo si ottiene l'originale con scarto massimo 0,7/255.

## Come funziona

1. **Fondo**: colore più frequente nella cornice (4 bit, poi mediana). **Inchiostro**: pixel a distanza di
   colore > `SOGLIA` (11) dal fondo, ripulito da un'apertura 2x2.
2. **Taglio XY ricorsivo**: si cercano i vuoti (righe/colonne senza inchiostro, larghezza adattiva
   `FRAZIONE_GAP` del lato minore, tra 4 e 7 px), si taglia a metà del vuoto, si stringe sull'inchiostro.
   Si prova con una **scala di maschere** dalla più fine alla più grossolana: soglie diverse e «solo zone
   piene» (apertura 9x9), che ignorano ombre, testi e frecce che collegano le schermate dei flussi.
3. **Piccoli glifi** (frecce, trattini, ≤ 28 px e radi) tolti dalla maschera con cui si cercano i tagli.
4. **Schermate di telefono**: una scatola in piedi (0,25–0,8) è un elemento unico, non si sbriciola. Se un
   taglio orizzontale la divide in pezzi con proporzione da telefono erano due schermate impilate. Tre o
   più pezzi grandi e simili (una *serie*) sono elementi e basta.
5. **Fogli fitti** (schermate attaccate): il taglio XY fallisce. Si cerca la barra di stato «9:41»
   con template matching a più scale (`modelli/9-41.png`) e da lì si ricavano le celle (modalità `orari`);
   il resto si taglia con XY, scartando le strisce sottili.
6. **Classificazione**: schermata (solo se contiene un «9:41»), foto, testo, pannello (scheda rettangolare
   piena), grafica. Il fondo si toglie (unmatting) **solo alle grafiche** e solo se la ricomposizione
   resta ≤ 1/255; altrimenti il ritaglio resta opaco.

## Cosa funziona

- Schermate singole, serie di schermate, flussi con frecce, brand board con 70–160 elementi: conteggi
  controllati a occhio sulle anteprime.
- Le grafiche trasparenti ricompongono l'originale entro 0,7/255.

## Cosa non funziona (da sapere)

- **Colonne «icona + scritta»** (immagine 44): sembrano una schermata alta e stretta e non si dividono.
  Risolto con un'indicazione a mano: `SENZA_SCHERMATE = {44}` spegne la regola per quell'immagine. Un
  criterio automatico (riempimento, angoli) non separava i casi: i fogli reali hanno schermate con fondo
  uguale a quello della pagina. Per un'immagine nuova dello stesso tipo, aggiungere l'indice.
- Immagine 11: tre schermate etichettate «pannello» (senza «9:41» riconosciuto). Ritagli corretti, etichetta no.
- Le scritte (testi) accanto alle icone a volte finiscono come «grafica»/«pannello».
- **Duplicati**: i brand board ripetono gli stessi elementi tra immagini diverse, e tre file sono la stessa
  immagine: gli elementi risultano duplicati. Non si deduplica.
- Gli elementi sono **raster**: non sono SVG. Per ridisegnarli puliti vale il metodo di `03-illustrazioni.md`.

## Perché così (il giudizio)

Prima un taglio semplice, poi ogni difetto visto sulle anteprime ha prodotto **una** regola con la sua
causa: frecce che impedivano i tagli → maschere senza glifi; schermate tagliate nelle loro sezioni →
regola schermata; schermate attaccate → template matching dell'orario. Una regola nuova si è provata
solo sulle immagini che avevano quel difetto, poi su tutte per controllare di non rompere il resto.
E: quando un criterio automatico non separa i casi (colonne icona vs schermate), un'indicazione a mano
dichiarata vale più di una regola fragile.
