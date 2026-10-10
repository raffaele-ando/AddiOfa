# Note dell'agente `icone`

Generatori (ognuno riscrive i suoi SVG e le sue tavole): `sfera.py` (14 icone sfera + `icone-sfera.svg` con etichette),
`tonde.py` (5 kit: blu, rosso, luminoso, d, marchio; 21 glifi come dati), `tratto.py` (11 icone di tratto). `base.py` = costruttore SVG
con id parlanti, tavole a 32/64/128 su chiaro e scuro, `_set.svg`.

Cosa ho imparato
- Prima di partire conta i kit veri: le "tre famiglie di icone tonde" sono cinque tavolozze sugli stessi glifi (17 blu, 8 rosso, 16 luminoso,
  23=27=50 "kit d" con ingranaggio, 7/28/40 marchio). Un set di glifi come dati + una tavolozza per kit costa quasi nulla.
- Le immagini 23, 27 e 50 sono lo stesso file: ridisegnato una volta, le copie sono nel rapporto come duplicati.
- Per le sfere conviene fare la sfera (alone, disco, banda di luce, due anelli, riflesso) una sola volta e uguale per tutte: nell'originale cambia da una all'altra.
- Dimensionare i glifi tondi: nell'originale occupano ~55 % del diametro (non 45 %): confronto affiancato a 2x lo ha mostrato subito.
- `€` e `?` meglio dal glifo Inter ExtraBold (stesso tratto, niente deformazioni); i raccordi con `geometria.arrotondato`.
- Con filtri sfocati dentro gruppi scalati la regione del filtro sbaglia: ombre fuori dal gruppo scalato.

Cosa non convince
- Le sfere hanno meno "vetro" dell'originale (che ha riflessi e sfumature piu' ricche); orbita del globo e foglio quiz da rifinire.
- `kit-luminoso`: alone colorato e sfumatura sono una resa semplice dell'effetto 3D lucido.
- Le tessere quadrate arrotondate dell'immagine 28 non hanno un loro SVG (stesso glifo del kit marchio, fondo diverso).
- Le icone di tratto in piu' (libro, bersaglio, globo, messaggi, idea, documento) e l'ingranaggio del kit luminoso sono estensioni, non presenti nell'originale.
