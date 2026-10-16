# Gli strumenti (`strumenti/brand/`)

Tutti in Python 3; rendono in Chromium con Playwright (`render.py`). Si lanciano dalla cartella
`grafica/` (tutti i percorsi di questa cartella sono relativi a `grafica/`).

## Base

| File | Cosa fa |
|---|---|
| `render.py` | `Renderer().svg(svg, w, h, fondo)` e `.rapido(svg, w, h)` (stessa pagina, ~40 ms): PNG RGBA reso da Chromium; `confronta(a, b)` → mae_255, p95_255, entro_8, ssim; `su_fondo(rgba, colore)` |
| `geometria.py` | vettori `V`, `arrotondato(punti, raggi)` (raccordi circolari veri), `lineare`, `radiale`, `sfocatura` (con regione a tutta tela) |
| `maglia.py` | maglie di sfumature: `maglia_svg` (disegno in SVG semplice) e `adatta_maglia` (colori dei nodi dai pixel, minimi quadrati sparsi) |
| `ricolora.py` | OKLCH (`rgb_oklch`, `oklch_rgb`), ricolorazione di una famiglia di colore su PNG e SVG, anche solo in una zona |

## Estrazione e riferimento

| File | Cosa fa |
|---|---|
| `estrai.py` (+ `sorgenti.json`) | ritaglia gli elementi dai fogli del kit, toglie il fondo (unmatting), palette |
| `estrai_concept.py` (+ `modelli/9-41.png`) | trova da solo gli elementi nelle immagini di `design-concept/` (taglio XY, schermate via «9:41»), vedi `08-concept.md` |
| `griglia.py` | originale ingrandito con la griglia delle coordinate, per disegnare |
| `livelli.py`, `modifica.py` | parti con i pixel originali e loro modifica (raster) |

## Logo (`logo/`)

`logo.py` (scena), `ottimizza.py` (giri 1–6), `rifinisci.py` (misura: giri 7–8),
`ricolora_logo.py` (varianti), `icone.py` (icone PWA dall'SVG). Dettagli in [02-logo.md](02-logo.md).

## Illustrazioni

| File | Cosa fa |
|---|---|
| `illustrazioni/*.py` | **metodo attuale**: un generatore per illustrazione; `oggetti.py` con gli oggetti ricorrenti |
| `STILE.md` | regole di disegno |
| `controlla_disegno.py` | tavola originale / disegno (3x, scuro, 1x) + avvisi (ingombro, palette, `<text>`); `tutto` fa anche la tavola d'insieme |
| `testo_svg.py` | lettere e numeri in tracciati con Inter |
| `modifica_disegno.py` | colore / sposta / scala / ruota / nascondi un pezzo per id, su qualsiasi SVG con id |
| `scuro_svg.py` | varianti per il tema scuro: nuvola quasi trasparente + tabella `REGOLE` di ricolori per id (carte blu notte, blu schiariti, anelli bianchi); chiavi `kit-luminoso/<nome>` per il kit luminoso; `scuro_sfera` per le sfere (vetro blu notte) |
| `blu_da_rosso.py` | varianti **blu** dei disegni del kit rosso (illustrazioni di composizione diversa e stati): ruota in OKLCH le tinte rosse, tiene rossi i distintivi con significato (errore, notifica), allarga il viewBox se qualcosa esce dalla tela; scrive in `brand/disegni/kit-blu/` |
| `porta_in_disegni.py` | porta in `brand/disegni/` le grafiche già ridisegnate in `concept-svg/`: cappello con cronometro, 14 sfere (`kit-blu/sfere/sfera-*`), kit luminoso «vivo» (`kit-luminoso/`) |
| `controlla_temi.py` | rende ogni SVG (chiaro e `.scuro.svg`) in Chromium su `#F7F9FD` e `#0A101F`: bianchi abbaglianti, blu scuro su scuro, ritagli, aloni, `<text>`; fa il foglio di controllo. L'elenco delle illustrazioni usate/non usate dall'app è `tools/controlla-illustrazioni.py` |
| `glifi_puliti.py` | i 14 glifi del kit blu ridisegnati puliti (sostituiscono quelli ricalcati da `glifi.py`) |
| `estrai_hero.py` | scena dell'hero: `scena-chiara` (ritaglio ripulito) e `scena-scura` (notte, alfa ai bordi) |
| `adatta_svg.py`, `riempi_maglie.py`, `DISEGNI.md` | metodo 6 (fedeltà ai pixel): **non usarli** per le illustrazioni AI, copiano e deformano i difetti. Utili solo su originali puliti |
| `vettorializza.py`, `disegna.py` | metodi 2–3, storici |

## Verifica dell'app

- `npx tsc --noEmit` e `npx vite build`;
- `npx vite preview --port 4175` e uno script Playwright che attraversa l'onboarding e fotografa
  ogni schermata (telefono 390×844, anche in tema scuro) e la pagina `?brand`;
- `verifica_codice.py`: componenti in codice contro i PNG estratti.

## Ambiente

Chromium: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (variabile `CHROMIUM`). Pacchetti:
numpy, scipy, Pillow, scikit-image, opencv, vtracer, fonttools+brotli (per `testo_svg.py`),
playwright.
