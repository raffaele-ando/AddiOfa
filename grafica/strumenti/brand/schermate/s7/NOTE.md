# s7 · immagini 34 e 36 (flusso schermate C e D: ATLAS / NOI / Agorà)

- 29 SVG: 15 per la 34 (il ritaglio 34.003 contiene DUE schermate: test e risultati) e 14 per la 36. Uscita in brand/concept-svg/schermate/34-flusso-schermate-c e 36-flusso-schermate-d; tavole in brand/concept-svg/_tavole/s7/ (_tavola.png = insieme). `python3 genera_tutto.py` rifà tutto + rapporto s7.json.
- Scarto 7-15/255, SSIM 0,79-0,92. Il peggiore è 36 lezione (margini corretti rispetto al ritaglio).
- Le immagini 34 e 36 NON sono la stessa cosa: 36 è la versione con nav a 5 voci (Home, Studio, Simulazioni, Classifica, Profilo), splash bianco, più schermate (dettaglio simulazione, correzione ATLAS). Le schermate in comune (test, risultato simulazione, profilo…) hanno layout simili ma misure e testi diversi: due SVG, non duplicati.
- Numerazione dei ritagli = ordine di lettura del foglio per riga, NON i numeri stampati nel foglio (es. 36.014 è 'Simulazioni' = voce 8).
- Appreso: leggere le coordinate dagli zoom con griglia (zoom x3 + tacche ogni 20 px) e fissare i testi con `tx(..., w=larghezza_misurata)` è molto più rapido di tarare i corpi; il primo giro ha già dato SSIM 0,82-0,9. I corpi dati a mano risultavano ~10% troppo piccoli (fattore 1,1 in tx).
- Nell'originale 36 la nav di Profilo era una serie diversa (ATLAS/NOI/Agorà); normalizzata. Radar: raggi proporzionali ai valori. Avatar-foto sostituiti da avatar neutri.
- Non convince: marchio ATLAS (semplificato in due masse blu), illustrazione dei fogli dell'onboarding, icone di profilo/impostazioni (originali illeggibili), testi piccoli (card ATLAS, commenti) letti a fatica.
