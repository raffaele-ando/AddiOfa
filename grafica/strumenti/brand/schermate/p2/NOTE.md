# p2 · layout social (immagini 26, 37, 48)

Generatori (si rilanciano da soli): g37_profilo.py, g48_storie.py + tiles48.py, g48_resto.py + tiles48b.py, g26_hero.py, g26_resto.py + tiles26.py. lib.py = strumenti comuni.
Uscita: brand/concept-svg/layout/{26,37,48}-*/ ; tavole in _tavole/p2/ ; rapporto _rapporti/p2.json (62 id, nessuno mancante). 25 SVG.

## Cosa ho imparato
- Foto con scritte cotte dall'AI: ritaglio + maschera = pixel che differiscono dalla mediana locale (kernel 21) dentro rettangoli indicati + inpainting Telea + leggera sfocatura sul residuo (lib.foto_pulita). Funziona su cielo/pareti/sfondi sfocati;
  fallisce su testo bianco spesso (interno piatto: usare `chiaro=225`) e NON va mai fatto sopra volti. Per elementi opachi (schede, telefoni, pulsanti) e' meglio COPRIRE con il vettoriale leggermente piu' grande invece di ripulire.
- Disegnando in coordinate assolute della sorgente dentro un gruppo translate, i filtri ombra di ui.Tela (regione userSpaceOnUse = dimensione tela) vengono tagliati: lib.Tela ridefinisce ombra/sfoca con regione grande.
- Testo con molte parole: lib.Tela usa i glifi condivisi (<use>) come ui/extra TelaCompatta: gli SVG restano < 300 KB (foto escluse).
- corpo_per(testo, larghezza) va chiamato con spaziatura 0 e la spaziatura espressa in frazione del corpo (spaziatura=-0.02*c), altrimenti il corpo esplode.
- Una rotazione+inclinazione di testo va fatta con translate(x y) rotate skewX translate(-x -y): altrimenti lo skewX attorno all'origine sposta il testo di centinaia di px (corsivo() in lib).
- Il font a mano dell'AI non esiste: Inter inclinata (skewX -8/-10) e ruotata e' un compromesso accettabile.

## Cosa non mi convince
- Le zone fotografiche ripulite hanno aloni/sfocature visibili dove la scritta cotta era grande (reel 26, storia 48 tessera 5, post Polimi). Con piu' tempo: sostituirle con sfondi vettoriali + sagoma.
- Scritte a mano e icone social sono approssimazioni; i volumi bianchi/gradinate (hero 26, tessere) sono piu' piatti degli originali.
- Gli scarti numerici (mae 15-45) sono alti per le tessere con foto: il numero conta poco, ma i testi Inter sono piu' larghi di quelli dell'AI.
