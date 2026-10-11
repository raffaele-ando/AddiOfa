# Animazioni delle illustrazioni

Un file CSS per illustrazione (`<nome>.css`) più `comune.css` (curve, movimento ridotto). Nessuna dipendenza, nessun JavaScript nelle animazioni.
Ogni animazione parte una volta, dura 1,5-2,2 s e finisce nello stato statico dell'illustrazione. Provarle: `python3 tools/make-prova-animazioni.py`
e aprire `app/dist-demo/prova-animazioni.html` (build:demo svuota la cartella: rifarla dopo). Controllo automatico: `python3 tools/controlla-animazioni.py`.

## API per il futuro componente `IllustrazioneAnimata`

1. Prende l'SVG di `kit-blu/illustrazioni/<nome>.svg` come testo (import `?raw`) e lo inserisce INLINE (`dangerouslySetInnerHTML`).
2. Prefissa ogni id e ogni riferimento con `<nome>--` (gli id sono unici per documento e illustrazioni diverse condividono nomi come `ombra`, `arco-luce`, `sfuma-ombra`):
   `id="X"` -> `id="<nome>--X"`, `url(#X)` -> `url(#<nome>--X)`, `href="#X"` -> `href="#<nome>--X"` (solo per gli id presenti nel file). Esempio funzionante: `prefissa_id` in `tools/make-prova-animazioni.py`.
3. Avvolge in `<span class="anim anim-<nome>">` e, quando la schermata o lo stato compare, aggiunge la classe `in`.
   Per riavviare (pulsante «Rivedi»): togliere `in`, forzare il reflow (`el.offsetWidth`), rimetterla.
4. Senza `in` si vede lo stato finale: va bene per il rendering lato server, per il primo frame e per chi non ha JavaScript.
5. `prefers-reduced-motion: reduce`: già in `comune.css` (`animation: none` su tutto sotto `.in`): stato finale subito.
6. Importare `comune.css` e i CSS delle sole illustrazioni usate. Dimensioni: `width`/`height` sull'`<svg>` (o `lato`); `overflow: visible` è già impostato perché alcuni pezzi partono qualche pixel fuori dal riquadro.

Il componente `IllustrazioneAnimata` (`app/src/brand/IllustrazioneAnimata.tsx`) fa già tutto questo. Opzioni: `riavvia={n}` (cambiando il numero riparte), `avvia={false}`, `quandoVisibile` (per le illustrazioni fuori schermo, come in fondo alla landing: restano nascoste e partono quando compaiono per metà). `eAnimata(nome)` dice se un nome ha l'animazione (usarla prima di ripiegare su `Illustrazione`).
Attenzione: React 19 riscrive l'`innerHTML` a ogni render se l'oggetto `dangerouslySetInnerHTML` cambia; il componente lo memorizza, altrimenti l'animazione ripartirebbe a ogni render del genitore.

Selettori: `.anim-<nome>.in [id$="--<id>"]`. Le regole stanno tutte sotto `.in`, quindi togliendola l'SVG torna intatto.
Sui pezzi che hanno già un `transform="..."` (foglio, foglio-dietro, bandiera) si usano solo le proprietà `translate` e `opacity`, che si compongono con l'attributo: non impostare `transform-origin` su di loro.
Tracciati: `stroke-dasharray: L L` con `--l` poco più lungo del tracciato (misurato con `getTotalLength()`), `stroke-dashoffset` da `L+1` a 0. Se cambia la geometria di un tracciato animato, rimisurare `--l`.
Dopo ogni modifica: `python3 tools/controlla-animazioni.py` (movimento, stato finale = statico, movimento ridotto).

## Elenco

| Illustrazione | Durata | Cosa succede | Id usati |
|---|---|---|---|
| studio-inglese | 1,65 s | libro giallo sale, libro blu scende sopra, righe delle pagine si tracciano, bandiera si posa | ombra, libro-giallo, libro-blu, libro-*-riga-1..3, bandiera, ombra-bandiera |
| quiz-test | 1,8 s | fogli entrano, tre risposte da sinistra con righe tracciate, spunta tracciata per ultima | foglio-dietro, foglio, risposta-1..3, risposta-N-riga-lunga/corta, risposta-2-segno |
| risultato-probabilita | 1,7 s | binario, arco che si carica col cursore sulla punta (offset-path), percentuale | binario, arco-pieno, arco-luce-bordo, cursore, percentuale-cifre |
| successo | 1,9 s | base e stelo, coppa che cala, riflesso, manici tracciati, stella che compare ruotando, tre raggi | ombra, base, stelo, coppa, coppa-orlo, coppa-riflesso, manico-sinistro/destro, stella, raggi |
| celebrazione | 1,6 s | il cono entra, dieci coriandoli escono da dietro la bocca e si distendono | cono, coriandolo-1..10 (`--dx/--dy` per ognuno) |
| mancato-superamento | 1,85 s | documento, righe tracciate, distintivo rosso, croce tracciata (sobria) | documento, riga-1..4, distintivo, distintivo-ombra, distintivo-simbolo |
| progressi-statistiche | 1,4 s | quattro barre crescono dalla base (scaleY) una dopo l'altra | ombra, barra-1..4 |
| piano-studi-bloccato | 1,95 s | calendario, sei caselle in sequenza, lucchetto con arco sollevato che scende a chiudersi | foglio, testata, anelli, caselle (figli), lucchetto-corpo, lucchetto-arco, buco-chiave |
| superamento | 1,85 s | fogli, righe tracciate, distintivo verde, spunta tracciata | foglio-dietro, foglio, foglio-riga-1..5, distintivo, distintivo-simbolo |
| suggerimenti-consigli | 1,5 s | lampadina grigia che si accende, filamento tracciato, cinque raggi a ventaglio | lampadina, bulbo, filamento, raggio-1..5 |
| attesa-caricamento | 2,15 s | la clessidra si capovolge, il filo di sabbia scende, sopra cala e sotto cresce | clessidra, filo-sabbia, sabbia-sopra, sabbia-sopra-luce, sabbia-sotto |

Nessun movimento continuo: tutto parte una volta e si ferma.
