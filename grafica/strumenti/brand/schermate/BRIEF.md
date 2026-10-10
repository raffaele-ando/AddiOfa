# Brief: trasformare in SVG gli elementi di design-concept

Le 52 immagini di `design-concept/` (alla radice del repo) sono state spezzate in 1277 elementi
(`brand/concept/<NN>-<nome>/NNN-<tipo>.png`, catalogo in `brand/concept/catalogo.json`, un id come
`28.085` = immagine 28, elemento 085). Il lavoro è **rifarli in SVG come sono stati rifatti il logo e le
41 illustrazioni**: stesso metodo, stesso giudizio. Non è ricalco: è ridisegno pulito.

## Leggere prima (10 minuti, non saltare)

1. `sapere/01-giudizio.md` – il giudizio: misurare ma guardare; **le immagini AI hanno errori da correggere**,
   le scelte di design (composizione, colori, luce, proporzioni) da copiare; rappresentazione giusta per cosa.
2. `strumenti/brand/STILE.md` e `sapere/03-illustrazioni.md` – come si ridisegna un oggetto (una massa morbida,
   raccordi veri, luce con un filo chiaro, toni campionati dall'originale, niente ricalco automatico).
3. `strumenti/brand/schermate/ui.py` – la cassetta degli attrezzi (Tela, testo come tracciati Inter, icone,
   pulsanti, chip, interruttori, barre, misuratore, nav, inserimento di illustrazioni già disegnate, foto).
   Esempio completo e riuscito: `strumenti/brand/schermate/gen_03_home_rischio_singola.py` (scarto 11/255,
   SSIM 0,85 al primo giro: i numeri non sono tutto, guarda la tavola).
4. Per le illustrazioni/oggetti: `strumenti/brand/geometria.py`, `oggetti.py`, `oggetti_a/b/c/d.py`,
   `illustrazioni/*.py` (generatori già approvati), `maglia.py` solo per luce complessa del logo.

## Strumenti

- `python3 strumenti/brand/schermate/foglio_contatti.py <img> [--tipo grafica] [--uscita f.png]` – vedere cosa c'è.
- Immagine originale intera: `design-concept/<file>` (il nome file è in `brand/concept/<NN>-*/elementi.json`,
  campo `sorgente`); `anteprima.png` nella cartella mostra i riquadri numerati.
- `python3 strumenti/brand/schermate/controlla_schermata.py <svg> <originale.png> <tavola.png> [--k 2]` – tavola
  originale | disegno | differenza + scarto/SSIM. Vale per qualsiasi SVG (anche illustrazioni e icone).
- `strumenti/brand/griglia.py` e `controlla_disegno.py` (illustrazioni), `testo_svg.py`, `render.py`
  (`Renderer().svg(svg, w, h, fondo)` → PNG), `modifica_disegno.py` (id parlanti).
- Guardare le immagini con lo strumento Read (PNG): ingrandire ritagli (PIL `crop().resize()` con `NEAREST`/`LANCZOS`,
  poi salvare nella cartella temporanea) per leggere testi e misure. Guarda SEMPRE la tavola, anche se il numero
  è basso; guarda anche a dimensione d'uso.

## Regole (dai fallimenti già avuti)

- **Niente `<text>`**: scritte = `t.testo(...)` (tracciati Inter, già in ui.py). Niente font esterni, niente `<image>` tranne
  le **foto** (t.foto: JPEG incorporato) che non si possono ridisegnare: vanno dichiarate nel rapporto come "raster".
- **Corretti gli errori dell'AI**: testo senza senso → testo vero e sensato; simboli storti → simboli veri; asimmetrie non
  volute → simmetrie costruite; righe doppie, macchie, bordi sfrangiati → puliti. Chiediti per ogni cosa strana:
  *in un disegno fatto da una persona brava sarebbe così?* Se un testo è illeggibile (schermate da 200 px), scrivi un testo
  plausibile e breve **coerente col contesto** (cerca le stringhe vere in `src/` con grep, es. "Quiz completato", "Sfide");
  non inventare cifre, prezzi o promesse legali; segna nel rapporto "testo ricostruito".
- **Il sigillo del Politecnico** (stemma) non si riproduce: segnaposto circolare neutro con id `sigillo-segnaposto`.
  Il nome "Politecnico di Milano" come testo va bene.
- Id parlanti su ogni gruppo/forma importante (`barra-di-navigazione`, `card-rischio`, `pulsante-primario`…): servono per
  modificare dopo. Colori **campionati sull'originale** (zone pulite), non inventati; i token del kit sono in
  `ui.py`/`src/brand/tokens.ts` ma l'originale ha la precedenza.
- Serie con la stessa struttura e valori diversi (es. "Calcoliamo il tuo risultato" a 0 %, 18 %, 42 %…; stessa schermata in
  due immagini): **un solo generatore con parametri**, un SVG per variante. Non riscrivere cinque volte la stessa cosa.
- Stessa cosa già esistente (illustrazioni in `brand/disegni/**`, logo in `brand/logo*`/`strumenti/brand/logo/`,
  icone app): **riusa** (`t.illustrazione('kit-rosso/illustrazioni/quiz-test', x, y, larghezza)`), non rifare.
- Non toccare file che non sono tuoi: non modificare `ui.py`, `oggetti*.py`, i generatori e gli SVG esistenti. Cosa ti serve in
  più (icone, componenti) mettilo in un tuo modulo `strumenti/brand/schermate/<agente>/extra.py` (import da ui.py). Niente
  git (commit/push li fa chi coordina). Non lanciare comandi che riscrivono `brand/concept` o `brand/disegni`.
- Scrivi i generatori in `strumenti/brand/schermate/<agente>/` (un file per schermata o per serie) e gli SVG in
  `brand/concept-svg/<area>/<NN>-<nome-immagine>/<nome>.svg`. Ogni generatore si lancia da solo e riscrive i suoi SVG;
  costanti e misure in alto; commento di testa con cosa corregge dell'originale.
- Dimensione file: < 300 KB a SVG (foto escluse: riduci a 900 px max). Chromium deve rendere lo SVG: controllalo.

## Quando va bene

Una schermata/elemento è finito quando la tavola mostra: stessa composizione e proporzioni, testi leggibili e ben
allineati, icone chiare, colori giusti, nessun difetto da AI rimasto, nessun elemento sovrapposto per errore.
Per le schermate lo scarto tipico è 8–14/255 con SSIM > 0,8: se è molto più alto, qualcosa è fuori posto. Fai 2–4 giri di
correzione; non inseguire il pixel (il testo AI non è Inter: differenze di larghezza del 3–5 % sono normali; regola
`spaziatura` se un titolo urta qualcosa).

## Rapporto (obbligatorio)

Alla fine scrivi `brand/concept-svg/_rapporti/<agente>.json`: lista di voci

    {"elementi": ["28.085", "15.048"],   // gli id del catalogo coperti da questa uscita (anche duplicati/varianti)
     "stato": "svg" | "riuso" | "raster" | "scartato",
     "svg": "brand/concept-svg/…/x.svg",   // per svg/riuso/raster
     "nota": "cosa è stato corretto / testo ricostruito / perché scartato"}

"scartato" solo con motivo vero: `frammento` (pezzo di testo o di figura tagliato male), `duplicato di <id>`,
`foto` (non vettorializzabile; se serve alla composizione di un layout è `raster` dentro quel layout), `testo` (una scritta da
sola: è coperta dal layout che la contiene). **Ogni elemento assegnato a te deve comparire nel rapporto.**
Rapporto finale a chi coordina (breve): quanti SVG, cosa non ti convince, cosa hai imparato di nuovo di utile
(aggiungilo anche in `strumenti/brand/schermate/<agente>/NOTE.md`).

## Cose imparate dalla prima ondata (leggi)

- **Controlla i duplicati prima**: le immagini 2 e 47 sono lo stesso file; 23, 27 e 50 sono lo stesso file. Non ridisegnare due volte:
  nel rapporto le copie sono `scartato` con nota `duplicato di <id>`. Per le altre immagini "simili" confronta davvero (zoom).
- **Mai cancellare file o cartelle** (niente `rm`): il sistema di permessi blocca la sessione. Se hai scritto un file nel posto sbagliato
  lascialo e dillo nel rapporto. Per i percorsi usa `from ui import RADICE` (= grafica/) invece di contare `parents[...]`; non
  creare cartelle fuori da grafica/.
- Nei ritagli compaiono **artefatti del foglio** (il numerino tondo "8" in un angolo, frecce tra schermate, bordi grigi): non fanno parte
  del disegno, non riprodurli.
- I testi Inter sono più sottili/larghi del font dell'AI: `corpo_per(testo, larghezza_misurata)` (in `s1/componenti.py`) accorda il corpo,
  titoli a peso 700–800. `strumenti/brand/schermate/s1/` è un buon esempio di struttura (componenti.py, un file per schermata, genera_tutto.py).
- Un SVG di schermata pesa ~100 KB (testo in tracciati): va bene. Nei generatori non chiamare `QUI` quello che importi da ui.
- Le schermate piccole (~200 px) vanno disegnate in pixel dell'originale con `Tela.da_originale(w, h)` e `p()`; `controlla_schermata.py` incolla
  su bianco (se il ritaglio ha angoli arrotondati/fondo grigio guarda `s1/controlla.py`).
