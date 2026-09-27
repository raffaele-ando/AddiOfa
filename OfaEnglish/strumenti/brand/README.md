# Strumenti brand: estrarre e ricreare gli elementi di AddiOFA

Prende le immagini caricate nella radice del repository (Brand Kit blu e rosso, icona dell'app,
tavole delle schermate) e produce in `OfaEnglish/brand/`:

| Cartella / file | Cosa contiene | Quanto è uguale all'originale |
|---|---|---|
| `elementi/<kit>/<gruppo>/<nome>.png` | ogni illustrazione, icona, elemento UI, stato e il logo, staccato dal fondo | **identico al pixel**: ricomposto sul fondo della tavola, scarto medio ≤ 0,52/255 (misurato per ogni file in `estrazione.json`) |
| `elementi/<kit>/fondo-scuro/<nome>.png` | le illustrazioni con aloni e nuvolette semitrasparenti, per il tema scuro | identico sul fondo originale; sui fondi scuri l'alone lascia vedere il fondo invece di fare una macchia bianca |
| `vettori/<kit>/<gruppo>/<nome>.svg` | lo stesso elemento ricreato in vettoriale, scalabile | misurato in Chromium, su fondo chiaro e scuro: `vettori.json` |
| `schermate/<tavola>/<nn>-<nome>.png` | ogni schermata dei mockup, ritagliata sul bordo del telefono | ritaglio diretto, identico |
| `tokens.css`, `tokens.json` | i colori della palette | valore dichiarato nel kit, con accanto quello misurato |
| `tavole/<kit>.png` | originale, SVG e differenza per ogni elemento, su fondo chiaro e scuro | controllo a vista |

`69FD6E4A…png` (la home) è escluso su richiesta.

## Uso

```bash
pip install numpy scipy pillow scikit-image vtracer playwright
python3 strumenti/brand/brand.py tutto
python3 strumenti/brand/brand.py logo 6000     # rifinisce il logo 3D con altre 6000 prove
python3 strumenti/brand/brand.py verifica       # confronta i componenti React con i PNG
```

Chromium: usa `/opt/pw-browsers/...` se c'è, altrimenti quello di Playwright (`CHROMIUM=` per un altro).

## Come funziona, e da dove viene

Il metodo riprende quello già usato negli altri progetti:

- **Da Agorà** (`AgoraCheck/strumenti/stacca_fondo.py`): la trasparenza si ricava sulla retta che
  va dal colore del fondo al colore del segno, non con una soglia, così l'interno resta pieno e a
  sfumare sono solo i bordi. Qui il colore di riferimento è quello del pixel pieno più vicino, perché
  le illustrazioni hanno gradienti e bianchi interni (`stacca.py`). Il fondo è solo ciò che si
  raggiunge dal bordo del ritaglio: il bianco di un foglio o di una busta resta pieno.
- **Da Aporia** (`aporia/loghi/`): nessuna stima a occhio. Ogni SVG viene reso in Chromium alla
  stessa risoluzione dell'originale e confrontato pixel per pixel. I numeri stanno nei JSON e nelle tavole.
- **Da Agorà** (`scripts/generate-icons.ts`): una sola fonte per il marchio, le icone PNG si
  rigenerano da quella.

Passi:

1. `estrai.py` legge `sorgenti.json`: per ogni fila di elementi (banda) separa gli elementi dagli
   spazi vuoti, li nomina in ordine, li stacca dal fondo e verifica la ricomposizione. Se in una
   fila trova un numero di elementi diverso da quello atteso si ferma invece di nominarli male.
2. `vettorializza.py` ricalca ogni PNG con vtracer (spline a strati di colore) partendo
   dall'immagine ingrandita, separa la parte piena da ombre e aloni (che diventano forme sfocate
   con un filtro SVG) e sceglie, misurando, impostazioni, sfocatura e opacità più fedeli.
3. `tavola.py` fa le tavole di controllo; `brand.py token` scrive la palette.

## Il logo 3D (`logo/`)

Il logo non è ricalcato: è **costruito** come scena 3D in SVG (`logo/logo.py`), seguendo com'è fatta la scena:

- **un solo pavimento**, molto lucido: riflette il muro e il buco a stella (`#specchio`, schiacciato,
  sfocato e sempre più tenue allontanandosi), più la luce che esce dalla porta (`#raggio1…4`, `#fascio`, `#penombra`);
- sopra il pavimento **un muro bucato**, curvo: il centro sta più avanti e i lati si piegano indietro
  (`curva` piega la linea d'appoggio, `#muroCurvatura` scurisce i lati), con il riflesso della luce attorno alla porta;
- la stella **non ha un pavimento suo**: in basso diventa porta, con i due stipiti larghi in basso che
  salendo si restringono (vertici del fondo `porta.fondo`, uno per uno);
- spigoli di punte e pareti **smussati e curvi** (`porta.raggio`, `porta.smussatura`, bordo del vano morbido);
- pareti del taglio **lucide**: ognuna ha una sfumatura dalla luce al bordo e una lungo il lato (`porta.facce`, `porta.lungo`), più il filo di luce sul bordo del taglio, lato per lato.

`logo/ottimizza.py` confronta il render con la reference in continuazione: prima adatta le forme
(piastrella e porta) alle maschere misurate, poi muove un parametro alla volta e tiene il passo solo
se lo scarto scende (pesato per regione: porta, muro, pavimento, fondo).

| Giro | Cosa è cambiato nel modello | Scarto medio | SSIM |
|---|---|---|---|
| partenza | scena misurata a mano | 19,5/255 | 0,899 |
| forme | piastrella IoU 0,998, porta IoU 0,993 | 16,7 | 0,916 |
| 1–2 | luce e colori | 7,0 | 0,933 |
| 3 | raggi di luce sul pavimento, colori delle pareti misurati | 6,2 | 0,934 |
| 4–5 | filo per lato, vertici del fondo liberi | 5,4 | 0,943 |
| 6 | pavimento lucido che riflette, muro curvo, spigoli smussati | **5,0** | 0,943 |

| 7 | **versione misurata** (`logo/rifinisci.py`): contorni, raggi e linea muro-pavimento ricavati dalla reference, luce in maglie di sfumature, filo, bordo e grana tarati | 2,9 | 0,941 |
| 8 | correzioni volute rispetto alla reference: pavimento unico (niente finto gradino nella porta, linea muro-pavimento simmetrica), una maglia per parete divisa sulle pieghe vere | **3,0** | 0,938 |

Il giro 8 si allontana apposta dalla reference dove questa ha errori del generatore d'immagini:
a sinistra la linea tra muro e pavimento scende (il pavimento sembra un'altra superficie che si
solleva) e dentro la porta la soglia sembra un gradino, con due righe nette. Qui il pavimento è uno
solo, dalla stanza dietro fino a davanti, e il muro poggia su una linea simmetrica (centro più
avanti, lati più lontani). Le pareti del taglio hanno ognuna la sua maglia, divise sulle pieghe
misurate (il salto di luce più netto), con la riga di luce sottile dove c'è: sparisce la macchia che
la maglia unica creava sulla parete del braccio destro.

Il giro 7 cambia metodo. Il modello "a mano" (giri 1–6) arrivava a 4,1/255 solo sfocando: bordi
morbidi e macchie di luce abbassano lo scarto medio ma si vedono. La versione misurata tiene la
scena (vertici e raggi di taglio, vano, soglia, linea curva tra muro e pavimento) e mette la luce in
**maglie di sfumature** (`maglia.py`): griglie di nodi colorati interpolate in modo bilineare, fatte
con semplici sfumature lineari e maschere SVG. Muro 32×28 nodi, pavimento 72×28, pareti del taglio
140×124, vano 30×60; ogni maglia riproduce la sua zona con 0,7–1,6/255. Sopra: filo di luce del
taglio (segue il contorno smussato), bordo in rilievo della piastrella, grana del materiale (rumore
centrato, tarato sulla grana della reference: senza grana lo scarto sarebbe 2,75 ma il pavimento
sembrerebbe di plastica). SVG da 380 KB.

Varianti di colore: `python3 strumenti/brand/logo/ricolora_logo.py --da "#1D4ED8" --a "#DC2626" --uscita rosso`
cambia la famiglia di colore in tutti i nodi e le sfumature (OKLCH, come `ricolora.py`).

Storia passo per passo in `logo/storia.json`, confronti (reference | SVG | differenza) in
`logo/confronti/`. Risultati: `logo/addiofa-logo.svg`, `addiofa-logo-trasparente.svg` (senza fondo),
`addiofa-icona-pieno-campo.svg` (per le icone). `logo/icone.py` rigenera le icone dell'app dall'SVG
(fatto: le icone PWA e la favicon vengono dall'SVG costruito).

Rifare la versione misurata: `python3 strumenti/brand/logo/rifinisci.py` (circa 10 minuti).

**Modificarlo**: ogni numero di `logo/parametri.json` ha un nome (colori, luci, profondità, curvatura,
riflesso…). Si cambia lì e si rigenera con `python3 -c "import sys; sys.path.insert(0,'strumenti/brand/logo'); from logo import svg, carica; open('strumenti/brand/logo/addiofa-logo.svg','w').write(svg(carica()))"`,
oppure si modifica direttamente l'SVG, dove ogni parte ha un id (`#muro`, `#porta`, `#pareti`,
`#vano`, `#specchio`, `#raggio1`, …).

## Brand Kit nell'app (`src/brand/`)

Ogni elemento è stato classificato in base a che cosa deve fare (`src/brand/catalogo.ts`, 99 voci):

| Tipo | Che cosa diventa | Elementi | Cliccabili |
|---|---|---|---|
| **codice** | componente React con misure e colori nei token (`tokens.ts`) | pulsanti primario/secondario/outline, interruttori, caselle, radio, indicatore di avanzamento, barre, badge, caricamento | pulsanti, interruttori, caselle, radio; gli altri no |
| **misto** | contenitore, valore o testo in codice + disegno vettoriale | 28 icone (cerchio in codice + glifo SVG), misuratore 82% (valore vero, arco animato), card di stato, notifica, banner «stile illustrativo» | le icone solo se ricevono `onClick` |
| **grafica** | illustrazione: PNG identico + SVG ricreato, animazione facoltativa | tutte le illustrazioni e il logo | no |

Animazioni (`brand.css`): galleggia, pulsa, oscilla, gira, rimbalza, capovolgi, brilla, entra. Ogni
illustrazione ha la sua suggerita nel catalogo; tutte si spengono con «riduci movimento».

Il catalogo vivo si apre con **`?brand`**: originale accanto alla versione ricreata, tipo, se è
cliccabile, componente, animazione. `?brand=verifica` serve al confronto automatico.

Fedeltà misurata (`verifica_codice.py`, Chromium, contro i PNG estratti):

| Parte | Scarto mediano |
|---|---|
| icone (cerchio in codice + glifo) | 3,3/255 |
| componenti UI in codice | 9,5/255 (pulsanti 6,7–9,5; radio vuoto 1,9; il resto è soprattutto il disegno delle lettere) |
| illustrazioni SVG | 3,4/255 |
| illustrazioni PNG | ≤ 0,52/255 (identiche) |

Font: Inter, incluso nell'app (`@fontsource/inter`), così il testo si disegna uguale ovunque.

## Illustrazioni disegnate a mano in SVG (`brand/disegni/`)

I ricalchi automatici (`vettorializza.py`, poi `disegna.py` a regioni di colore) partono da PNG di
circa 200 px, molto morbidi: il risultato ha bordi tremolanti e l'aspetto di un acquerello. Le
illustrazioni sono state quindi **ridisegnate a mano** come SVG pulito, forma per forma, e poi
avvicinate all'originale da due programmi (procedura completa in [`DISEGNI.md`](DISEGNI.md)):

1. `adatta_svg.py` tiene la struttura del disegno e muove solo i numeri (posizioni, misure, raggi,
   colori, opacità, sfocature), rendendo in Chromium e confrontando con l'originale su fondo chiaro
   e scuro;
2. `riempi_maglie.py` tiene le forme (bordi netti, id, ordine) e riempie ognuna con una maglia di
   sfumature misurata sull'originale, così la luce dentro le forme è quella vera: `<nome>.maglie.svg`.

Risultato: 41 illustrazioni (kit blu, kit rosso, stati del kit rosso; le due «email istituzionale»
restano fuori perché contengono il sigillo del Politecnico), scarto mediano 1,9/255 su fondo chiaro
(tra 0,9 e 6,9; 39 su 41 sotto 4), SSIM mediano 0,967. Su fondo scuro gli scarti sono più alti
perché gli originali hanno bordi bianchi sfrangiati lasciati dall'estrazione, che i disegni non
copiano. `scuro_svg.py` fa la variante per il tema scuro (`<nome>.scuro.svg`: nuvola quasi
trasparente, niente bordini bianchi).

Il file da modificare è `<nome>.svg` (forme con nomi in italiano: `libro-blu-copertina`,
`bandiera`, `lancetta`…); le parti animabili hanno un gruppo loro. L'app usa `<nome>.maglie.svg`
(`<Illustrazione formato="disegno">`, il default), e il PNG dove il disegno non c'è.
Aiuti: `griglia.py` (originale ingrandito con le coordinate), `testo_svg.py` (scritte in tracciati
con Inter). Misure per disegno in `<nome>.misure.json`, tavole (originale | disegno, 4x, chiaro e
scuro) in `brand/tavole/disegni/`.

## Cambiare colori e posizioni

- **Componenti in codice**: colori e misure in `src/brand/tokens.ts`, testi e stato come props.
- **Icone**: il colore del cerchio è una prop (`<IconaChip cerchio="#…"/>`), il glifo è un SVG.
- **Illustrazioni**: `ricolora.py` cambia una famiglia di colore tenendo luci e ombre, sul PNG e
  sull'SVG insieme, anche solo in una zona (poligono in pixel):

```bash
python3 strumenti/brand/ricolora.py kit-blu/illustrazioni/studio-inglese --da "#3B82F6" --a "#22C55E" \
  --escludi "94,4 176,0 178,60 100,70"      # il libro diventa verde, la bandiera resta blu
```

- **Illustrazioni disegnate**: colori, posizioni e misure si cambiano nel `<nome>.svg` (ogni forma
  ha un id), poi si rigenera con `riempi_maglie.py`; per cambiare un colore tenendo la luce basta
  cambiare il colore della forma e rilanciare `adatta_svg.py` con `data-fisso="colori"` su quella forma.
- **Posizione, dimensione, rotazione** di un'illustrazione: props del componente (`lato`, `style`).
- **Pezzi interni dei PNG identici**: `livelli.py` scompone ogni illustrazione in parti con i pixel
  originali (si ricompongono identiche, 0/255) e `modifica.py` sposta, ingrandisce, ruota, ricolora o
  nasconde le parti scelte per numero o per zona, ricostruendo lo sfondo dove una parte si sposta:

```bash
# la bandiera 8 px più in alto e un po' più grande, il libro verde
python3 strumenti/brand/modifica.py kit-blu/illustrazioni/studio-inglese --zona 98,0,180,72 --sposta 0,-8 --scala 1.08
python3 strumenti/brand/modifica.py kit-blu/illustrazioni/studio-inglese --zona 30,30,195,125 --escludi 98,0,180,72 --ricolora "#3B82F6:#22C55E"
```
