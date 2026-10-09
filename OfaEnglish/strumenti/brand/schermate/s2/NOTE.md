# s2 · immagini 5, 22, 25, 49 (schermate dell'app in kit blu/rosso)

Uscita: 36 SVG di schermata in `brand/concept-svg/schermate/{05-…,22-…,25-…,49-…}/`, tavole di controllo e d'insieme in `brand/concept-svg/_tavole/s2/`,
rapporto `brand/concept-svg/_rapporti/s2.json` (tutti i 32 id delle quattro immagini). `python3 genera_tutto.py` rifà tutto.

- 05: 13 telefoni (il catalogo ne dà 11 «schermata» + 2 «pannello»: home e classifica sono spezzate tra 05.011 e 05.012, ricomposte).
- 22: Sfide e Profilo (s3 ha 22.002 anche per riuso di 06.008; il mio è disegnato dalla versione grande).
- 25: 7 schermate (home, due finestre sopra l'app sfocata, lezione, dettaglio obiettivo, «Come cambia», «Il tuo percorso»).
- 49: 14 telefoni (il catalogo li spezza male: 49.001 «foto» = splash+onboarding+home).

Cosa ho imparato
- Il catalogo non è affidabile sui riquadri: guardare l'immagine intera e il foglio dei riquadri (anteprima.png) prima di assegnare gli id a schermate; i pannelli
  possono contenere 2-4 telefoni, le «foto» possono essere telefoni, le strisce da 37 px sono barre di stato (frammenti).
- Metodo che ha funzionato: un registro dei ritagli (`registro.py`: immagine, riquadro, raggio) + `multi.py` (ritagli affiancati con righello in
  coordinate LOCALI) + `coppie.py` (originale|disegno) + `controlla.py` (tavola e scarto). Si legge la griglia, si scrive T/R/C/I con le coordinate lette
  e si fa un solo giro di correzione. `s8/componenti.py` (T con `larg=`, misuratore_rischio, nav, tile_icona) si importa da un altro agente con importlib sotto un altro nome.
- `T(..., larg=)` (corpo tarato sulla larghezza misurata) è comodo, ma una larghezza stimata male dà testo troppo piccolo: per testi brevi meglio un corpo fisso.
  Il fattore di conversione view→px locali dipende dalla riduzione dell'immagine mostrata: leggere sempre le etichette della griglia, non i pixel della vista.
- Le foto (volti, copertine) non si ridisegnano come foto: ho fatto avatar vettoriali (`comuni.persona`) e scene vettoriali (`extra.scena`) invece di raster:
  si ricolorano e pesano poco. Nessun `<image>` né `<text>` negli SVG.
- Errori dell'AI corretti: nomi e volti non coerenti (Luca con foto di donna), valori del grafico a quote diverse, «+12%» doppio, parentesi spezzata dopo «?»,
  titoli delle lezioni a x diverse, avanzamento con puntino rosso storto, voce attiva della barra incerta.

Non mi convince
- Il regalo di 5.10 (assonometria un po' squilibrata: il nastro è troppo stretto rispetto all'originale) e i badge/icone di 22 (bersaglio con freccia semplificato).
- Scarto alto (17-26) sulle schermate con copertine fotografiche di 49 (08-13) e sulla finestra sfocata di 25.02: lo sfondo è ricostruito, non copiato.
- Alcuni testi minuti (es. nota privacy di 5.06, didascalie di 49) sono a 8-9 px: leggibili solo a 3x come nell'originale.
