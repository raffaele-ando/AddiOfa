# s5 · "Calcoliamo il tuo risultato" (immagini 9, 10, 29, 42, 43)

Ripresa del lavoro del collega (extra.py, calcolo.py, corpi.py, gen_43.py: mai eseguiti). Cosa è rimasto e cosa è cambiato:
- Tenuti: `extra.py` (icone, spinner, `misuratore_arco` a mezza ellisse, tessere); `testo_box` riscritto; `calcolo.py`/`corpi.py` NON più usati
  (sostituiti da `motore.py`, che legge le misure dal ritaglio invece di avere i riquadri scritti a mano). Si possono ignorare.
- `gen_43.py` scriveva in `strumenti/brand/concept-svg/...` (parents[2] sbagliato): quel file resta lì (non si può cancellare), quello buono è in
  `brand/concept-svg/schermate/calcolo-risultato/`. Qui i percorsi vengono da `ui.RADICE`.
- UN motore (`motore.py`) + un generatore per immagine (`gen_09/10/29/42/43.py`): 30 SVG (390 pt di larghezza, testo in tracciati, id parlanti,
  70-170 KB). `python3 gen_NN.py` rifà gli SVG; `python3 ck.py NN` fa le tavole in `brand/concept-svg/_tavole/calcolo-risultato/`;
  `tavola_insieme.py` la tavola d'insieme; `rapporto.py` il rapporto `_rapporti/s5.json`.
- Misure: `misura.py` + `Mis` (motore): bande di testo, componenti colorate, adattamento a griglia dell'anello del misuratore (`fit_arco_grid`),
  bordi della scheda. Tutto in cache in `misure.json` (i generatori non rileggono i PNG dopo la prima volta, ma senza cache ne hanno bisogno).
- `decor.py`: coriandoli, scie sfocate, tessere inclinate con glifi, chip, pomello con anello e riflesso, fasce ingrandite, raggi a cuneo (42).

Risultati: scarto 5-13/255 e SSIM 0,83-0,93 su 29 schermate su 30; 42.006 (scoppio di coriandoli) 17/255: la decorazione AI non si ricalca.

## Cosa ho imparato
- Il testo AI non è Inter: stesso corpo per tutto il paragrafo (mediana dei corpi stimati dalle righe con ascendenti e discendenti) + compressione/dilatazione
  orizzontale ±12-16 % per accordare la larghezza (`testi_box_gruppo`). Meglio della sola spaziatura, che dà righe "a lettere larghe".
  L'altezza d'inchiostro misurata a soglia larga è gonfiata dalla sfocatura: soglia per ruolo (titoli 120-135, sottotitoli 165-190, etichette 125-175).
- Il misuratore AI non ha mai il pomello coerente con la percentuale (82 % = pomello a ~85-90 % dell'arco; 18 % = ~25-30 %); l'ho copiato com'è nell'originale
  (`v` per schermata a occhio dal pomello), come già fatto in gen_03 (0,777). Il fit a griglia dell'anello (cx dal centro della percentuale, non dal ritaglio!)
  dà cx/cy/rx/ry/spessore in 10 s a schermata; con alone/scie sbaglia di qualche px: `sp["arco"]` lo corregge.
- I ritagli sono tagliati a destra e in basso in modo diverso per ogni schermata: la scheda del telefono NON è centrata nel ritaglio; i margini si leggono con
  `corsa_riga`/`corsa_colonna` (scarti di 3-4 livelli rispetto al fondo).
- Offset dei pannelli nelle tavole: il secondo pannello inizia a 2*W+12 px (k=2), non a W*k: ho perso tempo con stime a occhio sbagliate di 9 px.
- Per ui.py: servono `testo_box` (testo in riquadro misurato con compressione), `spunta_cerchio`/`spinner`, tessera con ombra, `misuratore_arco` (mezza ellisse, gradiente lungo
  l'arco, alone, anello, pomello con riflesso) e un `Tela.da_originale` che accetti un ritaglio con cornice; `tracciato()` già supporta tutto per le trasformazioni.
- Nei ritagli 42 gli elementi sono DUE riquadri sovrapposti (schermata sopra, dettaglio sotto): un SVG solo con due schede.
