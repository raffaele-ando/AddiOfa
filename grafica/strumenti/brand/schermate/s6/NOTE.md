# s6 · immagini 30 e 31 (app AddiOFA con ATLAS / NOI / Agorà)

Uscita: 30 SVG (16 + 14) in brand/concept-svg/schermate/30-flusso-schermate-a e 31-flusso-schermate-b, tavole in _tavole/s6, rapporto _rapporti/s6.json.
`python3 genera_tutto.py` rifà tutto. Un telefono canonico 390x844 per schermata.

Cosa ho imparato
- Le immagini 30/31 sono fogli leggibili anche senza ingrandire molto: si legge a 1,7-2,6x con `leggi.py` (ritaglio con griglia in coordinate sorgente) e si disegna **direttamente nei pixel della vista** (`nuova(..., vista=(ox,oy,z))`): niente conversioni a mente.
- I ritagli del catalogo per 31 sono sbagliati (006, 007, 008, 010 contengono due schermate sovrapposte, 009/011/012 sono pezzi della Home): conviene disegnare dall'immagine intera e mappare gli id nel rapporto.
- Le schermate AI hanno proporzioni 1:2,1-2,6; normalizzare a 390x844 stira la y del 10 %: i cerchi (arco del rischio, anelli) vanno ridotti e mantenuti circolari, altrimenti collidono con i titoli. Per la Home 31 ho usato `uniforme=True` (y con la stessa scala della x).
- `larg=` (corpo accordato alla larghezza misurata) e' comodo ma una larghezza letta male produce testi minuscoli/enormi: per righe dello stesso blocco usare lo STESSO corpo (calcolato su una sola riga) e non una larghezza per riga.
- Il confronto automatico (controlla.py) e' falsato dove il riquadro non e' il telefono vero (30.16 tagliata, 31.06 uniforme): contano le tavole d'insieme.
- Tab-bar: serve un'icona "linea" e una "piena" per lo stato attivo (PIENE in componenti.py); le icone di ui.py `casa`/`grafico` sono piene/sottili e non vanno bene come inattive.
