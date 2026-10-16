# NOTE-ILLU: illustrazioni e hero in tema chiaro e scuro

Agente ILLU. Immagini prima/dopo in `docs/lavoro/extra/illu/`.

## Cosa c'era (verificato)

- Le 18 illustrazioni del kit blu usate dall'app sono SVG puliti senza raster; la variante `.scuro.svg` però era identica alla chiara (la nuvola era già tolta): in scuro comparivano fogli bianchi, anelli bianchi attorno ai bottoni, lente/manico/cornice dell'euro/attacco della lampadina blu scuro su fondo scuro.
- `Illustrazione` mostrava la variante scura solo con `fondoScuro` (lo passano 2 file su 6).
- I **glifi delle icone** (`essenziali/glifi/kit-blu`, 14 file, 300 KB) erano ricalchi automatici (vtracer) di ritagli dei concept: bordi tremolanti e una frangia chiara che su cerchio scuro si vedeva (è la «bassa qualità» di cui parla l'utente).
- L'hero era un ritaglio raster del concept 41, scurito con filtro CSS e velo: in scuro restavano rettangoli più chiari (bordo sinistro, alto, basso) e scritte AI sul pavimento.

## Cosa ho fatto

1. **`Illustrazione.tsx` + `brand.css`**: rende sempre le due immagini (chiara e scura, se esistono e sono diverse) e il CSS ne mostra una (`:is(.dark *) .brand-ill-chiara {display:none}` ecc.). Nessun lampeggio, nessun parametro da passare: `fondoScuro` è accettato e ignorato (chiamanti non toccati). Il catalogo `?brand` (sempre su fondo chiaro scritto nel codice) ha la classe `brand-catalogo-chiaro` che forza la variante chiara. Marchio, Splash, IllustrazioneAnimata (osserva già la classe `.dark`) non sceglievano a mano nulla di sbagliato: invariati. `servizi/profilo/Badge` chiamano `urlDisegno(..., isDark)` da soli: funzionano, non sono miei.
2. **Varianti scure** (`grafica/strumenti/brand/scuro_svg.py`, tabella `REGOLE` per id di pezzi e di gradienti, solo colori, mai forme né id: le animazioni a pezzi restano valide): fogli, finestre, schede, fumetto bianco, banconota, calendario passano a «carta blu notte» con filo di bordo chiaro; lente, manico, cornice euro, attacco lampadina, gradiente dei libri-pagine schiariti; anelli bianchi attorno ai distintivi/orologio/cursore del colore della carta; clessidra con vetro scuro; capelli dell'avatar schiariti. Rigenerate con `scuro_svg.py` e copiate in `essenziali/disegni` con gli stessi passi di `sincronizza-essenziali.sh` (copia, `ottimizza-svg.mjs`, `togli-nuvole.mjs`; verificato che il processo riproduce byte per byte i file già presenti prima delle modifiche).
3. **Glifi**: nuovo `grafica/strumenti/brand/glifi_puliti.py` ridisegna i 14 glifi del kit blu (forme semplici, sfumature a due fermate, niente `<text>`): 300 KB -> 8 KB, nitidi, senza frangia. Scritti in `grafica/brand/glifi/kit-blu/` e copiati in `essenziali`. Attenzione: rilanciare `glifi.py` li sovrascriverebbe con i ricalchi.
4. **Hero**: `estrai_hero.py` ora produce anche `scena-scura.webp` (RGBA, 32 KB): luminosità rimappata su una rampa blu notte, lastra blu quasi invariata, porta di luce e luce calda conservate, scie di luce riaccese con un cappello a cilindro (solo strutture sottili: i primi tentativi con il contrasto locale facevano aloni bianchi attorno alla lastra), alfa che sfuma a sinistra (48%), in alto (17%) e in basso. `Scena.tsx` rende le due immagini e il CSS sceglie; tolti filtro e velo multiply; la maschera CSS resta solo sulla chiara. Nello stesso script ho cancellato con l'inpainting le due scritte senza senso sul pavimento («SAME STUDENTS BRIGHTER…», «SMALL…»): vale anche per la scena chiara (37 KB). `tools/sincronizza-essenziali.sh` copia ora anche `scena-scura.webp`.
5. **Altri raster nell'app**: `public/*.png` (icone PWA, apple-touch, favicon: servono PNG, restano) e `essenziali/icone/favicon-64.png` (usato da `urlIcona`/ProjectProfile e come logo in demo: restano, è l'icona dell'app, non un ritaglio). `Lastra.tsx` usa `<image>` ma con un SVG (`addiofa-logo-scena.svg`, nessun raster dentro). Non ci sono altri `.jpg/.png/.webp` in `src`.

## Cosa non ho provato / limiti

- Controllato a occhio con Chromium (Playwright) a 400 e 1280 px, chiaro e scuro, zero errori in console, la landing (hero) e il catalogo `?brand`; non ho percorso tutte le schermate dell'app con ogni illustrazione (Onboarding, Amici ecc.): il meccanismo è lo stesso del catalogo, che ho visto funzionare in entrambi i temi.
- Non ho lanciato `npm run build`, `build:demo` né `npm run check` (tsc dà errori in file di altri agenti, nessuno in `src/brand`). In demo il bundle incorpora le due varianti: peso in più di pochi KB.
- Kit rosso: non è usato dalle schermate (solo catalogo, escluso dalla demo); lo script scuro gli applica solo la regola della nuvola, i suoi glifi restano i ricalchi vecchi.
- La scena scura contiene ancora le due carte «di vetro» baked nel concept (bandiera con A/B/C e «Piano di studi bloccato», testo sfocato): come nella chiara, sono parte dell'immagine.
- Altezze ≠ 400/1280 (es. 768) non fotografate.
