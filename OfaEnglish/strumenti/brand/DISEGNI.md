# Disegnare le illustrazioni in SVG

Le illustrazioni del Brand Kit si rifanno **a mano** come SVG pulito (forme con un nome, niente
ricalco automatico), poi due programmi le avvicinano all'originale finché coincidono:

1. `adatta_svg.py` muove i numeri del disegno (posizioni, misure, raggi, colori, opacità,
   sfocature) confrontando il render in Chromium con l'originale;
2. `riempi_maglie.py` tiene le forme ma riempie ognuna con una *maglia di sfumature* misurata
   sull'originale (la luce vera dentro la forma), e scrive `<nome>.maglie.svg`.

Il file da modificare resta sempre `<nome>.svg` (le forme); `<nome>.maglie.svg` si rigenera.

## Passi

```bash
# 1. guardare l'originale ingrandito, con la griglia delle coordinate (1 quadretto = 10 px)
python3 strumenti/brand/griglia.py kit-rosso/illustrazioni/quiz-test /tmp/g.png --k 5
python3 strumenti/brand/griglia.py kit-rosso/illustrazioni/quiz-test /tmp/g.png --k 10 --riquadro 60,20,140,90 --passo 5
# 2. scrivere brand/disegni/<kit>/<gruppo>/<nome>.svg (regole sotto)
# 3. vedere il confronto senza toccare nulla
python3 strumenti/brand/adatta_svg.py brand/disegni/kit-rosso/illustrazioni/quiz-test.svg --solo-tavola
#    -> brand/tavole/disegni/kit-rosso--illustrazioni--quiz-test.png (originale | disegno, 4x, chiaro e scuro)
# 4. adattare i numeri (2-3 minuti)
python3 strumenti/brand/adatta_svg.py brand/disegni/kit-rosso/illustrazioni/quiz-test.svg --prove 3000
# 5. riempire le forme con le maglie
python3 strumenti/brand/riempi_maglie.py brand/disegni/kit-rosso/illustrazioni/quiz-test.svg
#    -> ...quiz-test.maglie.svg e brand/tavole/disegni/...quiz-test.maglie.png
```

Si ripete 2–5 finché la tavola a 4x mostra le stesse forme nelle stesse proporzioni. Le misure
(`mae_255` su fondo chiaro e scuro, `ssim`) finiscono in `<nome>.misure.json`.

## Regole del disegno

- `viewBox="0 0 W H" width="W" height="H"` con le misure dell'originale: 1 unità = 1 pixel.
- Ogni forma e ogni gruppo ha un `id` in italiano che dice cos'è: `libro-blu-copertina`,
  `bandiera`, `tazza-manico`. Le parti che si potranno animare stanno in un `<g>` loro
  (`<g id="lancetta">`, `<g id="coriandoli">`).
- Dal fondo verso chi guarda: prima lo sfondo (nuvola, alone), poi gli oggetti dietro, poi quelli
  davanti. Le forme dietro possono proseguire sotto quelle davanti (niente fessure tra forme).
- Forme semplici: `rect` con `rx`, `circle`, `ellipse`, `path` con curve `Q`/`C` e archi `A`.
  Angoli arrotondati come nell'originale.
- Colori solo esadecimali a 6 cifre (`#3B82F6`). Sfumature con `linearGradient`/`radialGradient`
  in `gradientUnits="userSpaceOnUse"`. Ombre e aloni morbidi con `feGaussianBlur` e `opacity`.
- Il testo (82%, "A", €) diventa un tracciato:
  `python3 strumenti/brand/testo_svg.py "82%" --peso 800 --dimensione 40 --x 60 --y 95 --id percentuale --colore #EF4444`
- `data-fisso="1"` su un elemento: `adatta_svg.py` non lo tocca; `data-fisso="colori"`: non ne
  tocca i colori. `data-maglia="no"`: `riempi_maglie.py` lo lascia a tinta unita.
- Le forme dentro un gruppo con `transform` non ricevono la maglia (restano come disegnate): usare
  `transform` solo per dettagli a tinta unita (per esempio una bandiera inclinata).
- Lo sfondo a nuvola chiara che c'è dietro quasi tutte le illustrazioni si disegna come unione di
  cerchi/ellissi con lo stesso colore dentro `<g id="nuvola" fill="#…" filter="…">`.

Esempio completo: `brand/disegni/kit-blu/illustrazioni/studio-inglese.svg`.
