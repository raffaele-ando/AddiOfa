# Cosa funziona e cosa no

## Funziona

- **Rendere nello stesso motore dell'app** (Chromium) e misurare: numeri ripetibili, niente sorprese.
- **Guardare le tavole a 3–4x e alle dimensioni d'uso**, su fondo chiaro e scuro, accanto all'originale.
- **Scena parametrica con nomi** per un oggetto "fotografico" (il logo): ogni numero ha un significato.
- **Misurare la geometria dall'immagine** con metodi robusti: spartiacque sul gradiente per i
  bordi, rette ai minimi quadrati totali per i lati, bisettrice per i raggi, salti dei profili per
  le righe orizzontali, ricerca del contrasto massimo per le pieghe.
- **Maglie di sfumature** per la luce continua e ricca (logo): fedeli, modificabili, SVG semplice.
- **Ridisegno pulito con generatori** per le illustrazioni AI: raccordi veri, simmetrie costruite,
  oggetti ricorrenti con parametri, toni campionati dall'originale.
- **Codice per l'interfaccia** (pulsanti, stati, valori): cliccabile, animato, coerente.
- **Correggere gli errori della reference** quando sono errori (pavimento, bandiere, simboli).
- **Prove piccole e isolate** per trovare la causa dei difetti (maglie a 37 px, rumore a media 186).

## Non funziona

- **Ricalco automatico** (vtracer, regioni di colore, spartiacque) su immagini AI piccole e morbide:
  bordi tremolanti, aspetto da acquerello.
- **Inseguire lo scarto medio**: premia la sfocatura e le macchie (logo giro 6b, maglie sulle
  illustrazioni).
- **Maglie campionate su un'illustrazione AI**: copiano macchie e bordi sporchi.
- **Ottimizzatore punto per punto su forme libere**: deforma angoli, simboli, contorni.
- **Parallelogrammi con angoli piccoli "a occhio"**: forme spigolose, senza volume.
- **Palette pura al posto dei toni dell'originale**: colori troppo saturi, non sembra più lo stesso kit.
- **`shape-rendering: crispEdges`** per evitare fessure: vale solo alla dimensione di progetto.
- **Filtri SVG con la regione di default** su forme sottili: tagliano la sfocatura a un quadrato
  (usare `filterUnits="userSpaceOnUse"` con la tela intera).
- **Scalare su molti agenti un metodo non ancora approvato.**

## Trappole tecniche da ricordare

- I filtri SVG lavorano in linearRGB: `color-interpolation-filters="sRGB"` per il rumore neutro.
- Dentro un `<clipPath>` vanno solo forme, niente `<g>`.
- Le maschere di luminanza in Chromium sono lineari (verificato), ma i bordi con antialiasing di due
  forme affiancate lasciano passare lo sfondo: sovrapporre, non affiancare.
- `pkill -f` dentro uno script può uccidere la shell stessa: usare `ps | grep "[p]attern"`.
- I font nel rendering di un SVG come immagine non si caricano da fuori: il testo va in tracciati.
