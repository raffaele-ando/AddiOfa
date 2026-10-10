# s1 · funnel di onboarding rosso (immagini 02 e 47)

Cosa è venuto fuori
- Le immagini 02 e 47 sono lo STESSO file (stesso MD5 del JPG, i 14 ritagli identici pixel per pixel): un solo set, 47.NNN = "duplicato di 02.NNN". Controllare l'MD5 prima di "confrontare due generazioni".
- 14 SVG in brand/concept-svg/schermate/funnel-rosso/ (390 pt di larghezza, solo la parte bianca del telefono, fondo trasparente, angoli arrotondati). Generatori: s01..s14 + componenti.py + extra.py; `python3 genera_tutto.py` rifà SVG, tavole (brand/concept-svg/_tavole/funnel-rosso/, `_tavola.png` d'insieme) e rapporto.
- Scarto 9-17/255, SSIM 0,73-0,87. Più alto della soglia 8-14 dove ci sono illustrazioni del kit diverse dall'AI (07, 08, 14) e testo Inter più largo/sottile del font AI.
- Testi: tutti leggibili a 3-4x; nessun testo ricostruito. Dove l'app differisce dall'immagine (certificazione "ateneo", salva risultati con login, 3 conseguenze, voci di 'pronto', 'Non lo so ancora') ho tenuto l'immagine.

Correzioni di coerenza (le schermate AI sono tutte di scala diversa)
- Barra di stato, freccia e avanzamento normalizzati; avanzamento a 5 segmenti uguali, monotono (1,1,2,2,3,-,4,-,4,4,5; nell'originale 1,1,2,2,2,-,4,-,2,2,3 con segmenti corti o fuori asse).
- Pulsante rosso: chevron fissato a destra, etichetta centrata (non attaccata alla freccia come ui.pulsante).
- Icone delle righe di 07 sostituite (euro, lucchetto, foglio, calendario); coriandoli di 13 puliti; marchi di pagamento semplificati; sigillo = segnaposto.

Cosa ho imparato / cosa servirebbe in ui.py
- `corpo_per(testo, larghezza_misurata)` (componenti.py) è il modo più veloce per accordare il corpo del testo alle larghezze lette sul ritaglio: ui.py potrebbe averlo (`larghezza_testo` esiste già, manca l'inverso).
- `illustrazione()` con riquadro visibile (bbox dei pixel alfa > soglia, in cache bbox_illustrazioni.json) è molto più comodo di (x, y, larghezza) del viewBox: mettere in ui.py `t.illustrazione_in(nome, x0, y0, x1, y1)`. La soglia conta (ombre/alone vs oggetto).
- ui.py: manca `pulsante` con freccia a destra fissa, scheda di scelta/radio/spunta tonda, scudo, chip d'icona piena, glifi pieni (libro, barre, fulmine, lista, documento), invio di scala per-schermata (X/Y/s con x0): si può promuovere `nuova()` in ui.py come variante di `Tela.da_originale` con ritaglio (x0,x1).
- `Tela.gruppo(trasforma=...)` funziona ma `rett` non ha rotazione: ho scritto `capsula` a mano.
- controlla_schermata.py incolla su bianco: per ritagli con fondo grigio e angoli arrotondati serve la versione con fondo e posizione (controlla.py).
- Il testo AI è più pesante di Inter 700: titoli a 800 e larghezze fittate.
