# s3 · schermate delle immagini 06 (sfide/progressi, kit blu) e 19 (profilo/statistiche/quiz, kit ROSSO)

Uscita: 23 SVG in brand/concept-svg/schermate/06-schermate-sfide-progressi/ (14) e 19-schermate-profilo-statistiche-b/ (9);
tavole in brand/concept-svg/_tavole/s3/ (una per schermata: originale | disegno; `_insieme.png` d'insieme); rapporto brand/concept-svg/_rapporti/s3.json.
Rifare tutto: `python3 genera_tutto.py && python3 controlla.py && python3 rapporto.py`.

Cosa ho imparato
- L'immagine 19 NON è in kit blu: pulsanti, barre, chip attivo e tab attiva sono ROSSI (il compito diceva «kit blu»). Ho seguito l'originale (kit='rosso' in `schermata()`); cambiare kit = una riga.
- 18 = stessa serie di 19 (stesso contenuto, altra generazione, tab-bar a 3 voci, crop più grandi: 330 px contro 290): i crop di 18 sono la fonte migliore per leggere i testi di 19. 22.002 ≈ 06.008 (profilo); 22.001 NON è 06.001 (altra variante).
- I crop di 06 e 19 sono spesso tagliati a destra o in basso (il foglio ritaglia il telefono): si disegna il telefono intero in punti 390 e si completa (tab-bar, margini destri) invece di riprodurre il taglio.
- Lavorare in punti telefono con una scala tipografica unica (titoli 26-30 w800, corpo 13-17) rende coerenti schermate che nell'AI hanno scale diverse; le posizioni si leggono sui crop 3x (px/scala, scala = larghezza telefono in px / 390), non serve il pixel.
- Errori AI trovati: calendario con il 1° settembre sotto «L» (era martedì); etichetta '26' nel grafico; refuso «e témpli e tempo reale» e «voita»; icone di Impostazioni/Profilo storte; misuratore ellittico; alone fantasma.
- Il font Inter del sottoinsieme non ha «→» né «✓»: usare icone (`da_a`, `t.icona("spunta")`). «•» e «·» ci sono.
- Per il tab-bar con icone vuote/piene (attiva piena) servono due icone per voce: in componenti.py NAV3/NAV5 sono (contorno, pieno, etichetta).

Cosa non mi convince
- Medaglie esagonali (badge) e montagna di 06.003 sono semplificate; foto-avatar tutti uguali (cerchio neutro con toni leggermente diversi).
- Il trofeo di 19.009 è piccolo rispetto all'originale; il cronometro di 19.007 è disegnato da me e meno ricco dell'AI.
- Scarto 11-25/255 e SSIM 0,66-0,83: più alto della soglia perché i crop sono tagliati/di altezza diversa e confrontati in alto; guardare le tavole.
