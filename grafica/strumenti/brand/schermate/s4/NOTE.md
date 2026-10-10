# s4 · immagini 18 (profilo, statistiche, quiz, simulatore) e 20 (sequenza «Calcoliamo il tuo risultato», 6 schermate)

Uscite: 15 SVG (9 in brand/concept-svg/schermate/18-schermate-profilo-statistiche/, 6 in .../20-schermate-risultato-sei/), tavole in
brand/concept-svg/_tavole/s4/ (`_tavola-insieme.png`, `18-_tavola.png`, `20-_tavola.png`, una per schermata), rapporto _rapporti/s4.json.
Rifare tutto: `python3 genera_tutto.py`. Scarto 8-14/255, SSIM 0,82-0,91.

File: `comp_s4.py` (componenti: stato, nav a 3 voci, pulsanti, tessere, misuratore ellittico, stella, scena cronometro; riusa s1/componenti),
`s01..s09_*.py` (una per schermata dell'immagine 18, in pixel del ritaglio), `gen_20.py` (immagine 20 sopra il MOTORE di s5), `controlla*.py`, `misura.py`.
Nota: `componenti.py` in s4 e' solo un segnaposto (il nome e' gia' di s1 e `from componenti import *` andrebbe in conflitto).

Cose imparate
- Dividere il lavoro per «layout normalizzato»: ogni ritaglio e' la parte bianca del telefono riportata a 390 pt (come s1), poi si disegna in pixel del ritaglio
  con `t.X/t.Y/t.s`. Una nav bar a 3 voci e una barra di stato scalata sul ritaglio (non quella di s1, pensata per ritagli piu' piccoli) bastano per 9 schermate.
- Le schermate AI hanno la voce attiva della nav a caso e l'avanzamento incoerente col contatore (3/10 con 2 segmenti su 8): il disegno corregge,
  il rapporto lo dice. Le barre percentuali dell'originale non rispettano il numero scritto: la lunghezza = percentuale.
- Molti ritagli sono TAGLIATI a destra (Correzioni, Simulatore) o in basso (tutta l'immagine 20): ricostruire il margine mancante simmetrico, non rifare il taglio.
- Il motore s5 (`motore.py`) e' riusabile per altre immagini della sequenza, ma: (1) `intestazione` si aspetta «10/10» staccato dalla barra: in 20 e' sovrapposto,
  ho sostituito la funzione (`_motore.intestazione = ...`); (2) `cornice` sbaglia il fondo se manca la striscia a sinistra: sostituita; (3) `soglia_pct` va
  abbassata (90-108) o il pomello/arco viene scambiato per la percentuale; (4) l'arco si adatta a griglia ma conviene bloccarlo con `sp["arco"]` dopo la prima prova.
- Bug di percorso: contare `parents[N]` e' fragile (s5/gen_43.py e il primo rapporto s4 scrivevano in strumenti/brand/concept-svg/...). Usare `ui.RADICE`.
  Un file stray e' rimasto in strumenti/brand/concept-svg/schermate/calcolo-risultato/43-...-001-calcoliamo-0.svg (scritto lanciando gen_43 di s5 prima della correzione): non cancellato.
- Il kit non ha tutto: `simulazione-esame` e' un blocco appunti, non il cronometro dell'originale -> scena disegnata (scena_cronometro). Verificare sempre la tavola del kit prima del riuso.
