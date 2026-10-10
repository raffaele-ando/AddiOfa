# Il Brand Kit nell'app

## Tre tipi di elementi

Ogni elemento del kit è stato classificato (`src/brand/catalogo.ts`, 99 voci) in base a **cosa deve
fare**, non a come appare:

| Tipo | Diventa | Esempi | Perché |
|---|---|---|---|
| codice | componente React con i token (`src/brand/tokens.ts`) | pulsanti, interruttori, caselle, radio, avanzamento, badge, caricamento | devono essere cliccabili, avere stati veri (acceso/spento), animarsi, adattarsi al testo |
| misto | contenitore o valore in codice + disegno | icone (cerchio in codice + glifo SVG), misuratore 82% (valore vero, arco animato), card di stato | il colore del cerchio e il valore cambiano, il disegno no |
| grafica | illustrazione SVG | tutte le illustrazioni, il logo | si guardano, non si toccano; animazione facoltativa |

Il catalogo vivo si apre con `?brand`; `?brand=verifica` serve al confronto automatico dei
componenti con i PNG (`verifica_codice.py`, scarto mediano 3,3/255 per le icone).

## Illustrazioni nell'app

`<Illustrazione nome kit gruppo lato fondoScuro animazione />` (`src/brand/Illustrazione.tsx`):
formato `disegno` (default: `brand/disegni/…svg`, nitido a ogni dimensione, e il PNG se il disegno
non c'è), `png` (identico all'originale), `svg` (ricalco). Nel tema scuro si usa la variante
`<nome>.scuro.svg` (`scuro_svg.py`: nuvola quasi trasparente, niente bordini bianchi).

## Coerenza delle pagine

Le schermate di riferimento sono nel **kit rosso**: l'app usa il rosso come colore d'azione
(`#EF4444`, hover `#DC2626`) e le illustrazioni del kit rosso; il kit blu resta nel catalogo.
Regole applicate a tutte le pagine (onboarding, home, esercizi, sessione, esame, progressi,
classifica, piani, profilo, consenso):

- niente maiuscoletto e spaziature larghe, pesi 600–700 (Inter, incluso con `@fontsource/inter`);
- pulsanti piatti con pressione a scala (`active:scale-[.99]`), niente bordi "3D" sotto;
- "Domanda N di M" in grigio invece delle pillole colorate; risposte compatte (56 px) con lettera
  tonda; selezione rossa (bordo `#EF4444`, fondo `#FEF2F2`);
- barra di navigazione in basso (Home, Esercizi, Progressi, Classifica);
- icone del kit (`<IconaChip>`) al posto delle icone generiche; il misuratore in codice nel risultato.

## Come si è capito cosa non era coerente

Foto di tutte le schermate (Playwright, 390×844) messe in fila accanto alle schermate di
riferimento: si vedono subito i colori fuori posto (pillole viola e arancioni, accenti blu), i
pulsanti con stili diversi, le illustrazioni del kit sbagliato. Si corregge, si rifanno le foto,
si riguarda. Script: `scratchpad/mostra2/foto.cjs` nella sessione di allora; la procedura è in
[05-strumenti.md](05-strumenti.md).
