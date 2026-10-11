# Icone per gli store (dal logo 3D, che resta l'icona)

Generate da `grafica/strumenti/brand/logo/addiofa-icona-pieno-campo.svg` con `python3 docs/design/store/genera-icone-store.py` (Chromium). Anteprima di controllo: `anteprima.png`.

| File | Misura | Dove si carica |
|---|---|---|
| `ios-1024.png` | 1024×1024, RGB, tutto campo, niente angoli né trasparenza | App Store Connect, icona dell'app (lo squircle lo applica iOS) |
| `play-512.png` | 512×512, tutto campo | Google Play Console, icona dell'app (la scheda dello store) |
| `android-adaptive-foreground-432.png` | 432×432 RGBA: la sola stella nella zona sicura (raggio massimo 31,7% del lato, limite 33%) | Android Studio, Image Asset, livello «primo piano» |
| `android-adaptive-background-432.png` | 432×432, gradiente blu coerente con il muro del logo | livello «sfondo» (oppure colore pieno #0B4BB8) |
| `maskable-512.png` | 512×512, tutto campo, stella dentro il cerchio dell'80% | PWA: `manifest.json` con `purpose: maskable` (oggi `app/public/icon-512.png` fa lo stesso) |
| `apple-touch-180.png` | 180×180, tutto campo | `<link rel="apple-touch-icon">` |
| `favicon-32.png` | 32×32 RGBA con angoli arrotondati trasparenti | favicon del sito |

Controlli: a 48 e 32 px la stella luminosa si riconosce ancora (vedi `anteprima.png`); il primo piano adattivo sta dentro il cerchio sicuro. I dettagli fini del pavimento si perdono sotto i 48 px, la stella no.
Non toccano `app/public/`: per usarle si copiano a mano dopo la scelta.
