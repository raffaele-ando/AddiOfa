# Gli strumenti (`strumenti/brand/`)

Tutti in Python 3; rendono in Chromium con Playwright (`render.py`). Si lanciano dalla cartella
`OfaEnglish/`.

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
| `scuro_svg.py` | varianti per il tema scuro |
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
