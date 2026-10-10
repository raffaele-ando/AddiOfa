# Note dell'agente `logo`

- 26 SVG in `brand/concept-svg/logo/` (25 nuovi + riuso dell'icona 3D), tavole di controllo in `_tavole/`, insieme in `_tavola.png`
  (`gen_tavola.py`). Generatori: `gen_wordmark.py`, `gen_marchi.py`, `gen_stelle.py`, `gen_lettermark.py`, `gen_sistemi.py`; pezzi in
  `marchio.py`; `rapporto.py` scrive il rapporto. `gen_wordmark_prova.py` e' un residuo di prova (non si puo' cancellare).
- Metodo che ha funzionato: lo SVG ha come viewBox il ritaglio dell'immagine intera (`Fo` in marchio.py), quindi la tavola confronta
  pixel con pixel; le misure (bbox d'inchiostro per colore, `rif.inchiostro`) danno x0/x1/linea di base di ogni istanza.
- Wordmark: Inter 800 combacia con peso e larghezze dell'originale; tracking per distanza d'inchiostro (non per avanzamento), FA crenate
  a mano (Inter senza kerning qui); i parametri sono stati adattati con una discesa di coordinate sul mae (S, gap, FA). L'arrotondamento
  delle lettere con il filo (stroke) peggiora il confronto: non usarlo.
- Stella 4 punte: 4 cubiche con maniglie verso il centro (u~0.48) + raccordo quadratico sulle punte (de Casteljau), niente stroke.
- Le varianti con `mask` (lettermark a Lambda) funzionano in Chromium; per un lettermark da esportare meglio un contorno unico.
- Non convince: tile-porta/scuro (la stella dell'AI e' piu' alta e con stipiti piu' stretti della sagoma vera, ho usato quella vera),
  lettere dell'originale piu' morbide di Inter, tagline AI non Inter (mae alto sul testo), il 3D resta solo come riuso (470 KB).
