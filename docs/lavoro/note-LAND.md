# NOTE agente LAND: landing pubblica rifatta sui concept

Sostituisce la nota della versione precedente (landing piatta di testo e riquadri).

## Cosa è stato fatto
Landing riscritta nello stile dei concept 41/45/51/12, in chiaro e in scuro, con gli stessi contenuti veri di prima (FAQ, Gratis e Pass con prezzo e data veri, scadenze OFA, «Se non superi», disclaimer, link legali nel footer).

- **Scena hero costruita nel codice** (`app/src/brand/hero/`): `Lastra.tsx` (lastra blu con porta di luce a stella, stessa geometria del logo, pochi tracciati, colori da token `--landing-*`) e `Scena.tsx` (cielo con sfumatura, scalinata a 8 gradini con fianchi, luce che sale dalla porta, scia di luce, carte di vetro inclinate con il Misuratore vero, l'illustrazione `quiz-test`, `piano-studi-bloccato` animata con `quandoVisibile`, tre pillole). Il palco è di 1000x680 unità e si scala alla larghezza (ResizeObserver, nessuna animazione). In scuro il cielo diventa notturno con bagliore caldo dalla porta. Non si usa il logo SVG da 460 KB (nella demo `urlLogo` è il PNG da 64 px): la lastra è disegnata, quindi nitida a ogni scala.
- **Landing** (`app/src/screens/landing/`): `Barra` (menu a pillola Home / Come funziona / Perché AddiOFA / Prezzi / FAQ con voce attiva che segue lo scorrimento, pulsante «Fai il diagnostico»; su telefono «Inizia» + menu a tendina), `Hero` (titolo grande con riga blu, CTA a pillola con freccia nel cerchio, scena a destra che esce dal bordo da 1024 px; sotto 640 px la scena sta dietro il testo con un velo; da 640 a 1023 sotto il testo), `Vantaggi` (fascia con 4 benefit), `SeNonSuperi` («Cos'è l'OFA di inglese?»: catena di 4 carte di vetro + carta blu, scadenze), `Perche` (nuovo: «Più di un semplice quiz», 4 carte, esempio del misuratore dichiarato «Esempio», blocco scuro con la lastra), `Passi` (4 passi con mini-schermate da 1024 px; sotto, elenco e telefono a destra come nel concept 12), `Offerta` (Gratis a vetro, Pass in blocco blu), `Faq`, `CtaFinale` (blocco blu con la lastra), `comune.tsx` (titoli, pulsanti a pillola, `SCHEDA` = vetro), `Telefono.tsx` (solo prop `pillole`).
- `Landing.tsx`: nuovo ordine (Hero, Vantaggi, Cos'è l'OFA, Perché, Come funziona, Prezzi, FAQ, CTA); `scuro` passato all'hero; `CtaFinale` non usa più `scuro`. Le prop pubbliche di `Landing` sono invariate.
- `index.css`: solo token nuovi `--landing-*`, classi `.vetro`, `.vetro-forte`, `.landing-pagina` (aloni fermi dietro le sezioni). Nessun token esistente cambiato.
- Ancore: `vaiA` e `ANCORE` restano esportate da `Barra.tsx`; id: `home`, `come-funziona`, `perche`, `prezzo`, `domande` (prima `cosa-ottieni`; nessun altro file lo usava).

## Cosa NON è stato copiato (regole di prodotto)
Niente 12.000+ studenti/avatar, 82 %, «ufficiale», stemma o scritte Politecnico sugli edifici, badge store (ci sono «Fai il diagnostico» e «Salta e vai all'app»), CRAM, «Piano su misura» (c'è «Ripasso su misura»), urgenza finta, scritta a mano (niente font). Indicatore «Probabilità stimata di superare il test» con valore 72 % marcato «Esempio». Niente TENG nei testi scritti da me (hero, OFA, passi, FAQ).

## Prove fatte (numeri)
- `cd app && npx tsc --noEmit` e `npm run lint`: 0 errori. `npm test` dalla radice: 99/99.
- `npm run build:demo`: controllo superato; `artifact.html` 2.124.715 byte (prima ~2.091.000, +34 KB; limite 2,6 MB).
- Playwright (Chromium, demo da `file://`, richieste esterne bloccate): `scrollWidth - innerWidth` = 0 a 390, 400, 768, 1280 px, in chiaro e scuro (8 combinazioni, anche sul livello con scorrimento della landing); 0 errori/avvisi in console.
- `tools/controlla-contrasto.py --schermate landing` a 400 e 1280 px, chiaro e scuro: 0 violazioni. Una prima passata ne aveva 13 (blocchi blu con testo al 90 %, «62 %» arancio, «prima» blu su blu): corrette scurendo il blu del blocco, testo bianco pieno, esempio al 72 % (fascia «alto»), carta blu su tinta chiara.
- Flussi in demo: «Fai il diagnostico gratuito» apre il diagnostico («Due domande su di te, poi 10 di inglese»); «Entra in lista d'attesa» apre la schermata del Pass; «Salta e vai all'app» apre l'app; i 5 link del menu scorrono alla sezione e colorano la voce attiva; il menu a tendina a 400 px funziona.
- Confronti affiancati (render a sinistra, concept a destra) in `docs/lavoro/land/`: `confronto-1280-light-concept41.png`, `confronto-1280-light-concept45.png`, `confronto-1280-dark-concept51.png`, `confronto-400-light-concept12.png`, `confronto-400-dark-concept12.png` (il render include la banda «versione dimostrativa» in alto).

## Limiti e cose da sapere
- La somiglianza è per composizione, gerarchia e materiali (vetro, lastra, scalinata, fasce, blocchi scuro e blu), non per le foto: niente persona, edifici, telefoni 3D, nuvole. La scena è più semplice dei concept e la lastra è più piccola.
- Il testo del Pass nella scheda prezzo viene da `config/offer.ts` (`PASS.features`) e cita ancora «test di recupero e TENG»: non l'ho toccato; se si vuole togliere va cambiato lì.
- «Home» nel menu porta a 27 px dall'alto (altezza della banda demo), non a 0.
- Non provati: Safari/Firefox (la scena usa `mask-composite`, `backdrop-filter`, container query nei Misuratori), 360 px, 1920 px, lettori di schermo, tastiera oltre al focus visibile già presente. Tutte le prove sono in Chromium.
- Le carte di vetro nella scena hanno testo piccolo a 640-800 px: decorative, `aria-hidden`; il contenuto equivalente è nel testo della pagina.
- Animazioni: solo `piano-studi-bloccato` (hero) e `superamento` (passo 4), una volta, `quandoVisibile`; il resto è fermo (carte inclinate con `rotate`, cambi di colore ≤120 ms).
- Pagine legali: restano bozze da far rivedere; `PAYMENTS_ENABLED` non toccato (false).
- `app/tests/anteprime/landing.*` (anteprima della versione precedente) non verificato dopo il rifacimento.

## Rifinitura del coordinatore (12/10)
- La lastra disegnata a mano dall'agente è stata sostituita dal logo 3D vero (`addiofa-logo-scena.svg`: il logo senza il rettangolo di fondo chiaro, creato da `tools/sincronizza-essenziali.sh`) nella scena dell'hero e nei blocchi in fondo (`Lastra.tsx`): luce e profondità come nei concept. La demo pesa ~2,69 MB (limite pubblicazione 16 MB).
- Hero su telefono: scena spostata a sinistra perché la stella non resti tagliata.
- `PASS.features` in `config/offer.ts`: tolto «TENG».
- Prove: `npm test` 99/99, `npm run check`, flusso completo `e2e3.py` a 400 e 1280 px chiaro/scuro: 0 errori in console, 0 scorrimento orizzontale.
