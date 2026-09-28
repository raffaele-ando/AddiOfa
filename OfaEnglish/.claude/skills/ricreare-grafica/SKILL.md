---
name: ricreare-grafica
description: "Come ricreare e ripulire grafica partendo da immagini (spesso generate con l'AI): logo 3D in SVG modificabile, illustrazioni vettoriali pulite, icone, brand kit, schermate coerenti nell'app. Metodo imparato rifacendo il brand di AddiOFA: misurare in Chromium ma giudicare a occhio, distinguere i dettagli da copiare dagli errori dell'AI da correggere, scegliere la rappresentazione giusta (scena parametrica, maglie di sfumature, disegno pulito con generatori, codice), prima pochi esempi poi in grande. Usala ogni volta che bisogna estrarre, ricreare, vettorializzare, ridisegnare, ricolorare o rendere modificabile un logo, un'illustrazione, un'icona o un kit grafico, o rendere coerenti le pagine di un'app con un brand kit, anche se non si nomina AddiOFA."
---

# Ricreare grafica: il metodo

La conoscenza completa è in `sapere/` (partire da `sapere/01-giudizio.md`, il più importante;
il logo in dettaglio in `sapere/02-logo.md`; le illustrazioni in `sapere/03-illustrazioni.md`).
Gli strumenti sono in `strumenti/brand/` (elenco in `sapere/05-strumenti.md`).

## Regole di giudizio (sempre)

1. **Misura, poi guarda.** Rendi in Chromium (`render.py`), confronta con i numeri
   (`confronta`: mae_255, p95, ssim) e poi **guarda sempre** la tavola a 3–4x, su fondo chiaro e
   scuro, e alle dimensioni d'uso vere (64–280 px). Se il numero migliora ma l'immagine peggiora
   (sfocatura, macchie), vince l'immagine.
2. **La reference AI ha errori.** Per ogni stranezza chiediti: in un disegno fatto bene / nella
   realtà sarebbe così? Copia composizione, proporzioni, toni, stile della luce; **correggi**
   prospettive sbagliate, asimmetrie non volute, simboli e scritte senza senso, bandiere sbagliate,
   righe doppie, bordi sfrangiati, "gradini" che non esistono. Scrivi l'elenco dei difetti prima di
   disegnare e dichiara le correzioni.
3. **Rappresentazione secondo il contenuto.** Geometria → forme parametriche con raccordi veri.
   Luce continua e ricca (tipo foto) → maglie di sfumature misurate. Illustrazione piatta con volume
   → 2–3 sfumature + riflesso + ombra, disegnati. Interfaccia → codice con token. Non usare lo
   strumento di un caso sull'altro.
4. **Modificabile = strutturato.** Id in italiano su ogni pezzo, parti animabili in un gruppo,
   numeri importanti come parametri (json o costanti del generatore). Deve funzionare
   `modifica_disegno.py` (colore/sposta/scala/ruota per id).
5. **Uno, poi un altro, poi un terzo** (tipi diversi: 3D, simmetrico, piatto), mostrati
   all'utente; **solo dopo** si scala (anche su più agenti).
6. **Le parole dell'utente valgono più dei pixel** sulla struttura ("un unico pavimento", "il muro
   è curvo"): trasformale in parametri del modello.
7. **Trova la causa con prove piccole** (una forma sola, una dimensione sola) prima di correggere.
8. **Numeri veri nel resoconto**, anche quando peggiorano; cosa resta diverso e perché.

## Procedimenti

### Estrarre gli elementi da un foglio

`strumenti/brand/estrai.py` con le bande in `sorgenti.json` (y di ogni fila, nomi da sinistra a
destra); fondo tolto con l'unmatting (alfa lungo fondo→inchiostro). Controllo: ricomposizione
≤ 0,5/255.

### Logo o immagine "fotografica" → SVG modificabile

1. Descrivi la scena a parole (con l'utente) e costruisci un modello con nomi (`logo/logo.py`).
2. Misura la geometria: maschere con lo spartiacque sul gradiente; lati con rette ai minimi
   quadrati totali e spigoli agli incroci; raggi dalla profondità del taglio sulla bisettrice
   (r = 2c/cos(α/2)); righe dai salti dei profili; pieghe dal contrasto massimo.
3. Metti la luce in maglie di sfumature (`maglia.py`: `adatta_maglia` + `maglia_svg`), una per
   superficie, misurate solo sui pixel di quella superficie, bordi esclusi.
4. Aggiungi i dettagli sottili tarati su strisce attorno ai bordi (fili di luce, bordi in rilievo)
   e la grana tarata sulla grana della reference (`color-interpolation-filters="sRGB"`).
5. Correggi gli errori della reference (esempio: pavimento continuo) e documentali.
6. Controlla in piccolo (64/120/280 px): niente righe tra le maglie.

### Illustrazione (AI) → SVG pulito

1. `griglia.py <kit/gruppo/nome> out.png --k 5` e scrivi i difetti AI.
2. Misura composizione e toni (campiona le zone pulite, non i bordi).
3. Scrivi `strumenti/brand/illustrazioni/<nome>.py` con `geometria.py` (`arrotondato` con raggi
   per angolo) e `oggetti.py` (libro, bandiera UK, … aggiungi gli oggetti nuovi lì). Regole in
   `strumenti/brand/STILE.md`: oggetti come masse morbide, simmetrie costruite, testo vero in
   tracciati (`testo_svg.py`), sfumature 2–3 fermate, un riflesso, ombra morbida, nuvola dietro.
4. `controlla_disegno.py <svg>` → guarda `brand/tavole/puliti/…png`; IoU ≥ 0,8.
5. **Non** usare `adatta_svg.py` / `riempi_maglie.py` su originali AI (copiano e deformano i difetti).

### Coerenza delle pagine dell'app

Foto di tutte le schermate (Playwright 390×844, anche tema scuro) accanto alle schermate di
riferimento; un colore d'azione, un kit di illustrazioni, componenti del kit in codice
(`src/brand/componenti.tsx`), stessi pesi e raggi ovunque. Correggi, rifai le foto, riguarda.

## Da non rifare

Ricalco automatico di immagini AI piccole; inseguire lo scarto medio con macchie o sfocature;
maglie sulle illustrazioni AI; ottimizzare punto per punto forme libere; angoli piccoli "a occhio";
palette pura al posto dei toni dell'originale; lanciare molti agenti prima che il metodo sia approvato.
