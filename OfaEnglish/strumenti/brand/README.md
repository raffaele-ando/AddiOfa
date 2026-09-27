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

Limite: la reference ha una grana fotografica che da sola vale 1,3–1,8/255; una scena vettoriale
pulita non può scendere sotto quel valore.

Storia passo per passo in `logo/storia.json`, confronti (reference | SVG | differenza) in
`logo/confronti/`. Risultati: `logo/addiofa-logo.svg`, `addiofa-logo-trasparente.svg` (senza fondo),
`addiofa-icona-pieno-campo.svg` (per le icone). `logo/icone.py` rigenera le icone dell'app dall'SVG
quando il logo viene modificato (oggi le icone vengono dal PNG originale, che è identico).

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

## Cambiare colori e posizioni

- **Componenti in codice**: colori e misure in `src/brand/tokens.ts`, testi e stato come props.
- **Icone**: il colore del cerchio è una prop (`<IconaChip cerchio="#…"/>`), il glifo è un SVG.
- **Illustrazioni**: `ricolora.py` cambia una famiglia di colore tenendo luci e ombre, sul PNG e
  sull'SVG insieme, anche solo in una zona (poligono in pixel):

```bash
python3 strumenti/brand/ricolora.py kit-blu/illustrazioni/studio-inglese --da "#3B82F6" --a "#22C55E" \
  --escludi "94,4 176,0 178,60 100,70"      # il libro diventa verde, la bandiera resta blu
```

- **Posizione, dimensione, rotazione** di un'illustrazione: props del componente (`lato`, `style`);
  per spostare un pezzo interno (per esempio la bandiera sopra il libro) va separata in livelli: si fa
  su richiesta, elemento per elemento.
