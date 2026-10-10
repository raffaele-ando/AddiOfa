# Il logo 3D in SVG, passo per passo

Reference: `logo-riferimento.png` (1254×1254): una piastrella blu ad angoli
continui, un muro con un buco a stella da cui entra una luce calda, un pavimento lucido.
Risultato: `strumenti/brand/logo/addiofa-logo.svg` (SVG da ~470 KB), scarto medio 3,0/255, SSIM 0,938.
Codice: `strumenti/brand/logo/` (`logo.py` scena, `ottimizza.py` giri 1–6, `aggiungi_luci.py`
giro 6, `rifinisci.py` giri 7–8, `ricolora_logo.py`, `icone.py`) e `strumenti/brand/maglia.py`.

## La scena (cosa c'è davvero nell'immagine)

Descrizione dell'utente, diventata il modello:

1. **un solo pavimento**, molto riflettente, che riflette il buco a stella;
2. sopra, **un muro bucato**; il muro è **curvo**: il centro è più avanti, i lati si piegano
   indietro (per questo lo spessore del taglio si vede più largo da un lato che dall'altro);
3. la stella **non ha un pavimento suo**: in basso diventa porta, con due pareti (gli stipiti)
   larghe in basso che salendo si restringono;
4. spigoli di punte e pareti **smussati e curvi**, non netti;
5. le pareti del taglio sono **molto riflettenti**.

In SVG, dal fondo verso chi guarda: ombra della piastrella → piastrella (squircle) → pavimento →
muro → porta (pareti del taglio, vano luminoso, soglia) → filo di luce sul bordo del taglio →
bordo in rilievo della piastrella → grana.

## Giri 1–6: scena disegnata + ottimizzatore (da 19,5 a 4,1)

`logo.py` costruisce la scena da ~150 numeri con un nome (`parametri.json`): vertici della porta,
raggio degli spigoli, punto di fuga e profondità del taglio, colori di ogni parete verso il fondo e
verso il muro, sfumature del muro, curvatura, riflesso, specchio del pavimento, raggi di luce…

`ottimizza.py`:
- **forme**: piastrella e contorno della porta adattati a maschere misurate sulla reference (IoU:
  0,998 la piastrella, 0,993 la porta), rasterizzando in Python (veloce);
- **luce**: strategia evolutiva (1+1) con passo per parametro: si cambia un numero a caso, si rende
  in Chromium a 314 px, si tiene il cambio solo se lo scarto scende; passo ×1,4 se va bene, ×0,9 se no.
  Lo scarto è **pesato per regione** (porta 0,4, pavimento 0,3, muro 0,2, fondo 0,1): senza pesi
  vince il muro, che è grande, e la stella (che è il logo) resta sbagliata.

| Giro | Cosa è cambiato | Scarto | SSIM |
|---|---|---|---|
| partenza | scena misurata a mano | 19,5 | 0,899 |
| forme | piastrella e porta sulle maschere | 16,7 | 0,916 |
| 1–2 | luce e colori ottimizzati | 7,0 | 0,933 |
| 3 | raggi di luce sul pavimento, colori delle pareti misurati | 6,2 | 0,934 |
| 4–5 | filo di luce per lato, vertici del fondo liberi | 5,4 | 0,943 |
| 6 | pavimento che riflette, muro curvo, spigoli smussati | 5,0 | 0,943 |
| 6b | 26 "luci" radiali aggiunte dove l'errore è massimo | 4,1 | 0,945 |

**Perché il giro 6b è stato buttato**: il numero scendeva, ma a 4x la stella aveva chiazze e i
bordi erano sfocati. L'ottimizzatore aveva imparato che sfocare conviene (vedi 01-giudizio §1).
Conclusione: un modello "disegnato a mano" con poche sfumature non può rendere quella luce; e
inseguire l'errore con macchie peggiora l'immagine. Serviva misurare le forme e mettere la luce in
una rappresentazione capace di tenerla.

## Giro 7: versione misurata (`rifinisci.py`, 2,9)

Idea: **la geometria si misura, la luce si campiona.**

1. **Maschera del taglio** — Prima prova: "blu vs non blu" (B−R>50): sbagliata, le pareti sinistre
   sono illuminate di blu e finivano fuori. Seconda: canale rosso > 80: sbagliata, parti del muro
   vicino alla luce superano la soglia. **Giusta**: spartiacque (watershed) sul gradiente di
   colore, con i semi nel muro lontano dalla stella e dentro la stella: il confine cade sul salto
   più netto, che è il bordo vero.
2. **Contorni** — per ogni lato della stella si prendono i punti del contorno vicini a quel lato e
   lontani dagli spigoli (60 px, perché gli spigoli arrotondati falsano), si fa una retta ai minimi
   quadrati totali; gli spigoli sono gli incroci delle rette. Tre giri per stabilizzare.
3. **Raggi degli spigoli** — per ogni vertice si cammina lungo la bisettrice finché si passa il
   bordo della maschera: è il "taglio" c. Con un raccordo quadratico la curva passa a r·cos(α/2)/2
   dal vertice, quindi r = 2c / cos(α/2). Punte esterne: 48–61 px; rientranze: 11–17. Il vano
   interno perde le punte nella maschera (sfumano nel giallo): raggio massimo 25.
4. **Righe orizzontali** (soglia, pavimento dietro, base del muro) — dai salti del profilo di
   colore in una colonna al centro della porta: 813, 837, 858 px.
5. **Linea muro-pavimento** — salto di luminosità colonna per colonna fuori dalla porta, poi una
   parabola: diventa `curva` (sinistra, centro, destra).
6. **Luce** — maglie di sfumature (sotto) su muro (32×28 nodi), pavimento (72×28), pareti del
   taglio, vano (30×60), soglia. Ognuna misurata solo sui pixel della sua zona, con i bordi esclusi.
7. **Filo di luce** del taglio: tratto sul contorno smussato (non sui lati dritti: sporgeva dagli
   angoli), colore, spessore e intensità regolati guardando solo una striscia attorno ai bordi.
   **Bordo della piastrella**: una linea scura appena dentro e una chiara sul filo (la reference ha
   un bordo in rilievo di 2 px che senza questo mancava: 3,3/255 di errore solo lì).
8. **Grana**: rumore frattale in overlay, centrato (vedi sotto), 0,08 su tutta la piastrella +
   0,05 allungato sul pavimento (spazzolato).

### Le maglie di sfumature (`maglia.py`)

SVG non ha le mesh gradient. Una griglia di nodi colorati con interpolazione bilineare si ottiene
così: per ogni riga della griglia un rettangolo con la sfumatura lineare della linea di nodi di
sopra, più un rettangolo con la sfumatura della linea di sotto, mostrato attraverso una maschera
verticale nera→bianca. In ogni cella il colore è esattamente l'interpolazione dei quattro nodi.

- I colori dei nodi si trovano con i **minimi quadrati sparsi** (`adatta_maglia`): ogni pixel è
  una combinazione dei 4 nodi della sua cella, più un termine di levigatezza tra nodi vicini (così i
  nodi senza pixel non impazziscono). Si risolve con `spsolve`.
- **Controllo fatto prima di fidarsi**: la maschera di luminanza di Chromium è lineare? Prova con
  una rampa: 1, 65, 128, 193, 254. Sì.
- **Semplificazione**: si tolgono le fermate che una retta tra le vicine riproduce entro 2/255
  (1,1 MB → 380 KB, scarto invariato).
- **Bug trovato dopo** (visibile solo in piccolo): righe affiancate con antialiasing lasciano
  passare lo sfondo sul pixel di confine (a 37 px, alfa 230 invece di 255). Il primo rimedio
  (`shape-rendering: crispEdges`) funziona solo a grandezza piena; il secondo (sovrapporre 1 unità)
  non basta rimpicciolendo. **Rimedio giusto**: ogni riga scende fino in fondo alla maglia sotto
  tutte le successive; sotto la sua parte la maschera resta piena, quindi il colore è già quello
  giusto. Verificato a 37, 53, 100, 241 px.

### La grana

`feTurbulence` a `fractalNoise`, grigio, in `mix-blend-mode: overlay`. **Trappola**: i filtri SVG
calcolano in linearRGB, e il rumore esce con media 186 invece di 128: l'overlay schiarisce tutto
(+3/255 sul pavimento). Con `color-interpolation-filters="sRGB"` la media è 128 e l'overlay è neutro.
Intensità tarata sulla reference (deviazione del dettaglio fine dopo una sfocatura di 2 px).

## Giro 8: correggere la reference (3,0)

- **Pavimento unico** — la reference a sinistra ha la linea del muro più bassa (+14 px al bordo),
  a destra quasi piana: sembra che il pavimento si sollevi. E nella porta la soglia ha due righe
  nette (837 e 858 px): un gradino. **Correzione**: linea muro-pavimento simmetrica con i lati 6 px
  sopra il centro (muro curvo con il centro più avanti: i lati sono più lontani, quindi più in alto);
  nella striscia tra linea misurata e linea giusta la maglia non viene misurata e prosegue liscia;
  dentro la porta una maglia unica dalla stanza dietro (813 px) al pavimento davanti, saltando le
  righe del finto gradino, con levigatezza alta.
- **Pareti del taglio** — con una maglia unica per tutte le pareti, vicino alla punta del braccio
  destro nascevano macchie (nodi senza pixel che "inventavano" luce). **Una maglia per parete**,
  ritagliata sul suo quadrilatero, prolungato di 14 px sotto il vano (dove il vano ha gli angoli
  arrotondati non resta scoperto niente), con un fondo pieno color crema sotto tutte (la leggera
  sfocatura delle pieghe rendeva semitrasparenti i bordi e si vedeva il blu del muro).
- **Pieghe vere** — il confine tra due pareti non passa dallo spigolo esterno (quello geometrico,
  fuori dal contorno smussato) ma da un punto sul contorno: si cerca, per ogni punta, il punto che
  dà il **salto di luminosità più netto** verso la punta del vano (miglioramento del contrasto: da
  12 a 27 sulla punta destra). Dove la reference ha una riga di luce sottile sulla piega, si
  disegna (colore e intensità misurati).
- **Muro ritagliato sulla sua area** — sotto il bordo della porta, in piccolo, trapelava una riga blu.

Lo scarto sale da 2,9 a 3,0: è il prezzo di non copiare due errori. Giusto così.

## Come modificarlo

- **Numeri**: `strumenti/brand/logo/parametri.json` (nomi parlanti). Rigenerare:
  `python3 -c "import sys; sys.path.insert(0,'strumenti/brand/logo'); from logo import svg, carica; open('strumenti/brand/logo/addiofa-logo.svg','w').write(svg(carica()))"`
- **Rifare la misura**: `python3 strumenti/brand/logo/rifinisci.py` (~10 minuti; parte da `parametri.json`).
- **Colori**: `python3 strumenti/brand/logo/ricolora_logo.py --da "#1D4ED8" --a "#16A34A" --uscita verde`
  (cambia la famiglia di colore in tutti i nodi e le sfumature, in OKLCH; la luce resta).
- **Un pezzo**: `python3 strumenti/brand/modifica_disegno.py strumenti/brand/logo/addiofa-logo.svg --colore porta=#…`
- **Icone dell'app** dopo ogni modifica: `python3 strumenti/brand/logo/icone.py`.

## Cosa resta diverso dalla reference

La grana non coincide pixel per pixel (non può); i fasci di luce sul pavimento hanno bordi un po'
più morbidi; le pieghe della stella sono leggermente meno nette. Il resto coincide entro 3/255.
