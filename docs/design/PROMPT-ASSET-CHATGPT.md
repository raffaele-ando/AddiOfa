# Prompt per gli asset di AddiOFA (da generare con ChatGPT)

Scritto il 10/11/2026. Serve per produrre le immagini che mancano o che vanno sostituite.
Il catalogo con lo stato di ogni asset è in `docs/design/ASSET-CATALOGO.csv`.

## 0. Prima di generare: il problema delle reference

Le reference che hai già visto (`grafica/brand/disegni/kit-blu`, il foglio `kit-blu.png`) sono
lucide, con sfumature, ombre e riflessi. La ricerca del 7/11 (`docs/design/RICERCA-AI-LOOK.md`) e le
correzioni già applicate chiedono l'opposto: **illustrazioni piatte, colori pieni, nessuna sfumatura**.
Il passaggio `tools/appiattisci-illustrazioni.py` toglie le sfumature dalle copie che finiscono
nell'app, ma su un'immagine lucida il risultato è un disegno sporco.

Per questo i prompt chiedono uno stile piatto. **Non allegare il kit lucido come reference**: allega
una copia piatta del kit, per esempio `app/src/brand/essenziali/disegni/kit-blu/illustrazioni/ricerca.svg` (esportata in PNG), oppure niente.

## 1. Blocco di stile (incollalo in ogni prompt, prima del soggetto)

```
Flat vector illustration, modern product-UI style. Solid colour fills only: no gradients, no
shadows, no glow, no blur, no glass, no reflections, no 3D, no bevels, no halo, no circle or
frame behind the subject. Outlines, if any, in one single weight. Palette limited to: #2563EB
(main blue), #1D4ED8 (dark blue), #60A5FA (light blue), #DBEAFE (pale blue), #0E1B3F (navy for
outlines and details), #FFFFFF (white), #D9DEE9 (light grey), #4D5B78 (slate). No other colours.
No text, letters, numbers, logos, flags, brand names or human faces. At most about 15 shapes.
Single subject, centred, generous margin, square 1:1, transparent background.
```

## 2. Asset da produrre

### A. Sostituzioni (la scena hero ha un alone luminoso e la luce «cotta»: va rifatta piatta)

**A1. `hero-scena`** — scena della landing, sostituisce `app/src/brand/essenziali/hero/scena-chiara.webp`
(e la versione scura). Formato 2:1, 1952×976 px, sfondo trasparente.

```
[blocco di stile]
Wide 2:1 composition. A large flat white five-point star set in a navy doorway at the centre-right.
A single small figure seen from behind, with a navy backpack, walking toward the star. Behind them,
three flat rounded panels in #2563EB and #60A5FA, and a flat staircase in #DBEAFE. No light rays,
no glow around the star. Keep the left third calm and empty for text.
```

Per la versione scura chiedi lo stesso soggetto con il fondo `#0E1B3F` e le forme `#1D4ED8`.

**A2. `banner-edificio`** (landing, sezione «Perché») e **A3. `cta-fondo`** (landing, chiusura).
Sono immagini raster con luce. **Decisione tua**: l'audit chiede una sola illustrazione per schermata,
quindi il consiglio è di togliere il banner e usare un colore piatto per `cta-fondo`. Se le vuoi
comunque, usa il blocco di stile e questo soggetto per il banner:

```
[blocco di stile]
Wide 2:1 flat facade of a university building: columns, a pediment and a row of windows, navy
outlines, #DBEAFE walls, #2563EB door. No sky, no ground shadow.
```

### B. Aggiunte opzionali: emblemi dei badge

Nel codice ci sono **10 badge con titolo** in `app/src/lib/profilo/badge.ts`. L'audit ne contava 19:
prima di produrre altri emblemi conta di nuovo. Oggi ogni badge ha un'icona di sistema, quindi questi
asset servono solo se vuoi emblemi dedicati. Tutti con lo stesso formato: 512×512, un solo oggetto
centrato, stessa dimensione.

| id | titolo nell'app | soggetto da scrivere nel prompt |
|---|---|---|
| `badge-studio` | Studio | an open flat book with a bookmark ribbon and one small checkmark on the page |
| `badge-simulazioni` | Simulazioni | a flat clipboard with three rows, a check on the first row, a small stopwatch |
| `badge-costanza` | Costanza | a flat calendar page with seven small squares, five of them ticked |
| `badge-livello` | Livello | three flat steps of a staircase rising, in three blue tints |
| `badge-memoria-10` | Memoria a lungo termine | a flat archive box with a small clock on its front |
| `badge-accuratezza-80` | Accuratezza 80 % | a flat target with a bullseye and an arrow in it |
| `badge-ore-5` | 5 ore di studio | a flat hourglass with five small dots on one side |
| `badge-prima-simulazione` | Prima simulazione | a flat start flag planted on a small clipboard |
| `badge-simulazione-superata` | Simulazione superata | a flat rosette ribbon with a checkmark in the centre |
| `badge-simulazioni-superate-3` | 3 simulazioni superate | three flat cards stacked, each with a small checkmark |

Modello del prompt, da riempire con il soggetto della tabella:

```
[blocco di stile]
Square 1:1 emblem, one subject only: <soggetto>. Flat, centred, same size as a standard badge.
```

### C. Reference di schermata (solo layout, non vanno nell'app)

Servono a far vedere a me la disposizione, che poi ricostruisco nel codice con i token. Niente testo
leggibile: l'immagine lo sbaglierebbe. Usa barre grigie al posto delle parole.

**C1. `screen-home`** — Home con una card dominante.
```
Mobile app screen mockup, 390×844, flat UI, no device frame. Top: a small greeting bar and a
semicircular gauge in #2563EB. Below: ONE large solid #2563EB card at full width (the dominant
action, with a play icon and two grey placeholder bars), then three compact rows with a thin
#D9DEE9 border and small icons, each row shorter than the dominant card. Grey bars instead of text.
No gradients, no shadows, white background #F7F8FB.
```

**C2. `screen-consenso`** — una sola casella obbligatoria.
```
Mobile app screen mockup, 390×844, flat UI, no device frame. A title bar, a short paragraph shown as
grey bars, one large checkbox row with a #2563EB border and tick (unchecked on the left variant,
checked on the right), a primary blue full-width button below. Grey bars instead of text.
No gradients, no shadows, background #F7F8FB.
```

**C3. `screen-stato-vuoto`** — stato vuoto con una sola illustrazione.
```
Mobile app screen mockup, 390×844, flat UI, no device frame. A top bar, then centred: one flat
illustration of a single soft-blue cloud with a neutral face-free outline (use #DBEAFE and #4D5B78),
a title bar and a grey paragraph, and one blue primary button. Grey bars instead of text. No
gradients, no shadows, background #F7F8FB.
```

## 3. Consegna e caricamento

- Un file per asset, nome = id della tabella (`hero-scena.png`, `badge-studio.png`…). PNG, sfondo
  trasparente per le illustrazioni, sfondo `#F7F8FB` per le reference di schermata.
- Non serve la versione vettoriale: la faccio io, con il metodo di `.claude/skills/ricreare-grafica`.
  Ogni asset richiede lavoro vero: per questo ho limitato l'elenco a quello che serve davvero.
- Dopo il caricamento: salvo in `grafica/fonti/ai-nuove/<id>.png`, faccio l'SVG piatto in
  `grafica/brand/disegni/<kit>/<gruppo>/<id>.svg`, poi `npm run grafica:sync` (il passo di
  appiattimento sistema i gradienti residui), poi registro l'asset nell'app.
- Se un'immagine di ChatGPT arriva con sfumature, testo o un alone, la rifiuto e rigenero: non la
  correggo a mano.
