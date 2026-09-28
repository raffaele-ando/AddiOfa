# Guida di stile delle illustrazioni AddiOFA

Le illustrazioni originali vengono da un generatore d'immagini: composizione e colori sono buoni,
ma i dettagli no (libri con spigoli storti che non sembrano libri, bandiere sbagliate, scritte e
simboli senza senso, righe doppie, macchie, bordi bianchi sfrangiati). **Non si copiano i difetti.**
Ogni illustrazione si ridisegna pulita: stesso soggetto, stessa inquadratura e stessi colori
dell'originale, ma oggetti costruiti bene.

L'originale serve **solo come riferimento** di composizione, dimensioni e tinte. Niente maglie di
sfumature prese dai pixel (copiano le macchie), niente `adatta_svg.py` sulla geometria (deforma).

Ogni illustrazione è un generatore Python in `strumenti/brand/illustrazioni/<nome>.py` (costanti in
alto: tela, colori, posizioni) che usa `geometria.py` e `oggetti.py`. Esempi approvati come metodo:
`studio_inglese.py` (oggetti 3D), `successo.py` (oggetto simmetrico), `piano_studi_bloccato.py`
(oggetto piatto). Il perché di ogni scelta è in `sapere/03-illustrazioni.md`.

## La lezione del primo libro (rifiutato: "è tutto spigoloso")

- Un oggetto è **una sola massa morbida**: prima la sagoma intera con gli angoli raccordati
  (raggi diversi per angolo: grandi dietro, piccoli davanti, mezzo spessore sulle parti tonde),
  poi sopra le facce più chiare o più scure. Mai facce affiancate con spigoli vivi.
- I raccordi sono **veri** (`geometria.arrotondato`: arco tangente ai due lati), non una piccola
  curva quadratica messa a occhio.
- Gli spigoli arrotondati si dicono con **la luce**: un filo chiaro (bianco 0.35–0.45, 1 px) dove
  la faccia di sopra piega verso quella davanti.
- Le parti curve (dorso di un libro, bulbo, coppa) hanno la sfumatura **perpendicolare** alla
  curva e un riflesso lungo di essa.
- I **toni vengono dall'originale** (campionati sulle zone pulite); la palette sotto è una guida,
  non un obbligo: la palette pura è troppo satura rispetto al kit.

## Tela

- `viewBox="0 0 W H" width="W" height="H"` con le misure del PNG originale (così l'app non cambia
  impaginazione). Il disegno occupa lo stesso spazio dell'originale (±5%).
- File: `brand/disegni/<kit>/<gruppo>/<nome>.svg`. È il file che usa l'app.

## Costruzione

- **Sfondo a nuvola**: `<g id="nuvola">` con 2–4 cerchi/ellissi dello stesso colore che si
  sovrappongono (kit blu `#F2F6FE`, kit rosso `#FEF1F1`, o il tono pallido dell'oggetto, es.
  `#FEF6EC` per la coppa), bordi netti, niente sfocatura. Sta dietro a tutto.
- **Oggetti in 3/4 coerente**: tutte le facce di uno stesso oggetto usano le stesse direzioni
  (i lati paralleli restano paralleli). Tre toni per oggetto: faccia sopra (chiara), faccia davanti
  (colore base), faccia di lato (scura).
- **Sfumature**: `linearGradient` a 2–3 fermate, dal chiaro in alto a sinistra al colore base;
  `gradientUnits="userSpaceOnUse"` con coordinate vere.
- **Luce**: un riflesso per oggetto (forma bianca, opacità 0.25–0.45) sul lato in alto a sinistra.
- **Ombra**: sotto gli oggetti un'ellisse del colore scuro del kit, opacità 0.12–0.2,
  `feGaussianBlur` 1.5–3 (`filterUnits="userSpaceOnUse"` con la regione grande abbastanza).
- **Angoli arrotondati** coerenti: 2–3 px per i dettagli, 4–8 px per gli oggetti principali.
- **Tratti**: solo dove servono (lancette, linee di testo, spunte): `stroke-linecap="round"`.
- **Testo e simboli veri**: lettere e numeri con `strumenti/brand/testo_svg.py` (Inter); € % ✓ ✕ !
  disegnati come forme pulite; le "righe di testo" sono barre arrotondate, non scritte finte.

## Oggetti ricorrenti (fatti bene)

- **Libro chiuso**: copertina rigida un po' più grande del blocco pagine (sporge 2–3 px), dorso
  arrotondato (curva, non spigolo), blocco pagine chiaro con 2–3 righe sottili parallele al bordo,
  il bordo inferiore della copertina visibile sotto le pagine. Libri impilati: stessa prospettiva.
- **Bandiera del Regno Unito**: proporzione 2:1 (o 5:3 se l'originale è più alto), croce di
  San Giorgio rossa bordata di bianco, diagonali bianche con le rosse **sfalsate** (controcambiate),
  angoli leggermente arrotondati. Se è inclinata, un `transform` sul gruppo.
- **Foglio/documento**: rettangolo arrotondato bianco, angolo piegato in alto a destra se c'è
  nell'originale, righe di testo come barre `#DBEAFE`/`#FEE2E2` arrotondate.
- **Calendario**: testata colorata con due anelli, griglia di quadratini arrotondati uguali.
- **Lucchetto**: arco a U di spessore costante + corpo arrotondato + buco della chiave (cerchio
  + trapezio).
- **Coppa**: coppa simmetrica (disegnare una metà e specchiarla con `scale(-1 1)`), manici a
  anello uguali, stelo e base centrati.
- **Lampadina**: bulbo simmetrico, attacco a 2–3 anelli scuri, filamento a tratto sottile.
- **Globo**: cerchio con continenti semplici ma riconoscibili, riflesso e orbita ellittica.
- **Badge tondi** (✓ ✕ !, notifica "1"): cerchio pieno con bordo bianco di 2–3 px, simbolo centrato.

## Palette

| | chiaro | base | scuro | pallido |
|---|---|---|---|---|
| blu | `#93C5FD` | `#3B82F6` | `#1D4ED8` | `#DBEAFE` |
| rosso | `#FCA5A5` | `#EF4444` | `#DC2626` | `#FEE2E2` |
| giallo | `#FDE68A` | `#FBBF24` | `#F59E0B` | `#FEF3C7` |
| verde | `#86EFAC` | `#22C55E` | `#16A34A` | `#DCFCE7` |
| viola | `#C4B5FD` | `#8B5CF6` | `#6D28D9` | `#EDE9FE` |
| ardesia | `#94A3B8` | `#475569` | `#0F172A` | `#E2E8F0` |

Più bianco `#FFFFFF`. I toni effettivi si prendono dall'originale e si tengono vicini a queste
famiglie (il controllo segnala i colori lontani: vanno bene se voluti). Il kit rosso usa il rosso come colore principale; gli altri colori solo dove
hanno un significato (giallo coppa/lampadina, verde conferma, blu bandiera/profilo).

## Nomi

Ogni forma e gruppo ha un `id` in italiano (`libro-alto-copertina`, `bandiera`, `lancetta-minuti`);
le parti animabili stanno in un `<g>` loro. Così `modifica_disegno.py` può cambiare colore,
posizione e dimensione di ogni pezzo.

## Controllo

```bash
python3 strumenti/brand/controlla_disegno.py brand/disegni/kit-blu/illustrazioni/studio-inglese.svg
```

Produce `brand/tavole/puliti/<kit>--<gruppo>--<nome>.png` (originale | disegno a 3x | disegno su
fondo scuro | disegno a 1x) e segnala: ingombro diverso dall'originale, colori fuori palette,
elementi `<text>` (vanno trasformati in tracciati). Guardare sempre la tavola: il disegno deve
sembrare la stessa illustrazione, fatta bene.
