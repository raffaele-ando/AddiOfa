# Dagli elementi di design-concept agli SVG

Dopo l'estrazione (08-concept.md: 1277 elementi raster da 52 immagini) il passo giusto era rifarli in SVG
**come il logo e le illustrazioni**: ridisegno pulito, non ricalco. Qui cosa è stato fatto e come.

## Che cosa c'era davvero

Gran parte delle 52 immagini sono *la stessa cosa ripetuta*: i brand board (7, 8, 15, 16, 17, 23, 27, 28, 35, 40, 50)
mostrano ogni volta le stesse ~40 illustrazioni, ~20 icone e i componenti UI; 2=47 e 23=27=50 sono lo stesso file;
due terzi della «grafica ≥ 90 px» non sono illustrazioni ma loghi, testi, campioni di colore. Le illustrazioni del kit blu e
rosso erano già tutte ridisegnate (51 riusi). Il lavoro nuovo è: kit "luminoso", icone, componenti, loghi/marchi, schermate, layout.
Lezione: **guardare i fogli di contatti e confrontare con quello che c'è già prima di assegnare lavoro** (`foglio_contatti.py`).

## Cassetta degli attrezzi

`strumenti/brand/schermate/ui.py`: `Tela` (testo come tracciati Inter, forme, ombre, sfumature, icone di tratto, barra di stato,
pulsanti, chip, interruttori, nav, misuratore, inserimento di SVG già fatti, foto), `Tela.da_originale(w, h)` per disegnare
in pixel dell'originale. `controlla_schermata.py` fa la tavola originale | disegno | differenza. `BRIEF.md` è il brief dato
agli agenti, `rapporti.py` unisce i rapporti (`brand/concept-svg/_rapporti/*.json`) e scrive `brand/concept-svg/indice.json`
(per ogni id di elemento: svg / riuso / raster / scartato con motivo). Esempio di riferimento: `gen_03_home_rischio_singola.py`.

## Uscite (`brand/concept-svg/`)

| Cartella | Contenuto |
|---|---|
| `logo/` | wordmark (7 varianti), lockup, marchi in tile, stelle, lettermark A, sistemi di costruzione; l'icona 3D è riusata |
| `icone/` | 14 icone sfera, 74 icone tonde in 5 tavolozze (kit blu, rosso, luminoso, d, marchio), 11 di tratto |
| `illustrazioni-luminose/` | kit luminoso e "vivo": 18 soggetti × 2, con varianti scure |
| `illustrazioni/` | 12 SVG nuovi (calendario blu, cappello+cronometro, buste, forme) + `COPERTURA.md` |
| `componenti/`, `token/` | pulsanti, interruttori, caselle, radio, badge, card di stato, chip per i tre kit; palette e tipografia |
| `schermate/` | oltre 200 schermate (funnel rosso, home, sfide/profilo, calcolo risultato, ATLAS/NOI/Agorà) |
| `layout/` | locandine, banner, carosello, social identity, profilo, 3 landing desktop |

## Come è stato fatto (il giudizio)

- Tracciare in **pixel dell'originale** su zoom con griglia, poi `larg=` (larghezza misurata del testo) per accordare il corpo:
  il primo giro dà già SSIM 0,8–0,9; il testo AI non è Inter (±3–5 % di larghezza) e non va inseguito.
- Stessa struttura con valori diversi (sequenza del calcolo 0→82 %, stati 82/46/18 %) = **un generatore con parametri**.
- Errori dell'AI corretti, dichiarati in testa a ogni generatore: calendario con il 1° sul giorno sbagliato, "+12%" doppio,
  parentesi spezzate, refusi ("voita", "Sarica su", "Prezz"), simboli senza senso, foto di donna per «Luca», icone storte.
- Il **sigillo del Politecnico non si riproduce** (segnaposto `sigillo-segnaposto`); marchi di terzi (PayPal, Instagram…) come forme generiche.
- Le **foto** (edifici, persone, mockup 3D di felpa/borsa/borraccia/telefono) non sono vettorializzabili: restano raster
  incorporati nei layout (stato `raster`) o fuori (mockup, `scartato`). Le scritte cotte nelle foto sono state tolte con inpainting
  e rifatte in vettoriale (lascia a volte aloni).
- Pesi: testo come tracciati pesa ~100 KB a schermata; `TelaCompatta` (glifi in `<defs>` + `<use>`) lo riduce di 3×.

## Cosa non funziona / limiti

- Le schermate piccole (≈200 px) hanno testo illeggibile: sono **ricostruzioni** (marcate nei rapporti come "testo ricostruito"), non copie.
- Il catalogo dei ritagli non è affidabile sui riquadri (telefoni uniti o spezzati, «foto» che sono telefoni): gli agenti hanno disegnato
  dall'immagine intera e mappato gli id a mano.
- Scarto 7–25/255 sulle schermate, 15–45 sui layout con foto o scene 3D: sono ridisegni puliti, non calchi.
- Kit luminoso: globo e party popper deboli (scarto ~40), bagliori approssimati. Landing 41: hero 3D semplificato.
- Gli agenti si sono fermati più volte per i limiti API: il lavoro è stato ripreso dai file su disco; due agenti hanno dovuto rifare da zero.
- ui.py ha ancora lacune segnalate (gradienti con opacità per fermata, ombra relativa al contenuto traslato, `corpo_per`, nav con icone piene).
- `src/brand/tokens.ts` ha valori da correggere (vedi `strumenti/brand/schermate/ui/NOTE.md`): non toccato.
- Residui: `strumenti/brand/concept-svg/…` (file fuori posto di un agente), `gen_wordmark_prova.py`, una tavola orfana: non cancellati.
