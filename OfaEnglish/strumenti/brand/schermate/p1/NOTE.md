# Note dell'agente `p1` (layout non-schermata: immagini 0, 4, 38, 46, 32)

Generatori: `gen_locandine.py` (4, 38, 46), `gen_banner.py` (32, 3 banner), `gen_00_carosello.py` (18 slide), `extra.py` (componenti comuni),
`qr.py` (QR vero scritto a mano, verificato con cv2), `rapporto.py` (scrive `_rapporti/p1.json` dai file esistenti), `montaggio.py` (fogli di controllo).
Uscite: `brand/concept-svg/layout/<NN>-<nome>/…` (24 SVG), tavole in `brand/concept-svg/_tavole/p1/`.

## Cosa ho imparato
- **Filtri in contenuti traslati**: `Tela.ombra()/sfoca()` hanno la regione del filtro `userSpaceOnUse` da (-40,-40) a (w+80,h+80). Se si disegna in coordinate
  "vista" e si trasla il gruppo (slide e banner ritagliati da un foglio), gli elementi con ombra fuori da quella regione **spariscono** senza errori.
  In `TelaC` c'è `t.reg = (x, y, w, h)` per spostarla.
- **Peso dei file**: `TelaC` (glifi in `<defs>` + `<use>`) riduce di ~3 volte un SVG con molto testo; il wordmark ripetuto (strisce staccabili) si dichiara una volta
  (`wordmark_def` + `wordmark_uso`).
- **Togliere le scritte dell'AI dalle foto**: `cv2.inpaint` con maschera per soglia. Il testo medio-chiaro sul cielo ha il canale massimo ~180, non ~100: servono soglie
  alte (200-215) più dilatazione 7; per scritte chiare su scuro conviene "pixel più chiari della mediana locale". Le regioni vanno limitate: la maschera
  sulle zone dove la foto ha oggetti scuri (telefono, capelli, scritte incise sull'edificio) le rovina. Attenzione agli offset: le viste a 2x di una metà
  di immagine hanno y = 820 + sy/1,5 (non sy).
- **Foto che devono restare**: ritaglio con bordo strappato = clipPath vettoriale (`strappo()`), dissolvenza = maschera con gradiente: niente PNG con alpha.
- **QR**: un generatore QR v2-L sono ~100 righe (Reed-Solomon GF256 + maschere); provare le 8 maschere fino a che cv2 decodifica.
- Lavorare in "vista" (ritaglio ingrandito 1,5-2x con cui si leggono i testi) fa risparmiare conversioni, ma serve un gruppo `translate(-x0,-y0)` e un clip.
- Il corsivo "a mano" è Inter Italic in maiuscolo ruotato: regge a piccola dimensione; non regge se ingrandito (non ha il tratto di una scrittura vera).

## Cosa non mi convince
- Scritte a mano (svolazzi OK, testo no): sembrano un font, non una mano. Un font a mano libera nel kit risolverebbe.
- Telefoni: senza prospettiva 3D (sono ruotati, non deformati); nelle slide 12 e 15 (mano col telefono) sono rimasti nella foto raster, quindi i testi dello schermo restano quelli dell'AI.
- Banner 2: anello 82 % rifatto piatto (l'originale era un render di vetro/ghiaccio); pianta e blocco bianco dietro al telefono omessi; scarto alto (30).
- Locandina 46: la mano grigia è omessa. Slide 5, 9, 10: telefono/calendario più semplici dell'originale (scarto 27-46).
- Pulizia inpaint: sulle facciate chiare restano lievi sbavature dove il testo AI attraversava l'edificio (slide 13, locandina 4).
- Strisce staccabili e strappi di carta sono geometrici: un po' più regolari dell'originale.
