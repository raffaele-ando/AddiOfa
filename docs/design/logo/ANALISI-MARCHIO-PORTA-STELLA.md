# Analisi del marchio «porta a stella» (24/11/2026)

Misure sul marchio tracciato dal riferimento (`grafica/fonti/ai-nuove/logo-porta-stella-ref.webp`), riquadro portato a 1792 px.
Script di misura: contorni con OpenCV, rette ai minimi quadrati, distanze perpendicolari tra lati paralleli, cerchi ai minimi quadrati sulle punte.

## Cosa è già in ordine

| Controllo | Misura | Giudizio |
|---|---|---|
| Asse di simmetria | 0,5-0,7 px dal centro su 1792 (0,04 %) | simmetrico |
| Area diversa dalla propria immagine speculare | porta 0,7 %, stella 0,2 % | simmetrico |
| Angoli speculari (sinistra / destra) | differenze sotto 0,5° | simmetrico |
| Rettilineità dei lati | scarto quadratico 0,2-0,4 px, massimo 1 px | lati dritti |
| Raggi delle tre punte arrotondate | 67, 65, 66 px | coerenti |
| Margini laterali | 263 / 263 px | centrato in orizzontale |
| Stipiti | larghi 173 / 174 px, base inclinata 23,6° da entrambi i lati | coerenti |

## Cosa non è preciso (difetti ereditati dall'immagine generata)

1. **Spessore della cornice non costante.** Lati alti 137 → 129 px (si assottiglia verso il basso: lato esterno e interno non sono paralleli, 1,1° di differenza), bracci sopra 124 px, bracci sotto 130-133 px, stipiti 174 px. Tra 124 e 137 la variazione è del 10 % e non ha un motivo; gli stipiti più spessi (+35 %) possono essere voluti.
2. **Punte con angoli diversi.** Punta alta 55,5°, punte laterali 61,7°: 6° di differenza, si nota come una punta alta più «stretta». (Non è una stella regolare: lì le punte sono 36°.)
3. **Raggio degli angoli del riquadro.** La tavola di costruzione dice 0,25 del lato; il valore 0,27 usato ora è quello che imita meglio l'immagine generata, non la specifica.
4. **Geometria fatta di centinaia di punti**, non di rette e archi: file più pesante (6,7 KB) e non modificabile a mano; le punte sono cerchi solo approssimati.
5. **Luce con 51 fermate di colore** campionate da un'immagine compressa: sfumatura con piccole irregolarità. Bastano 3-4 fermate.
6. **Colore.** Il blu del marchio `#0977FD` non è il blu d'azione dell'app `#2563EB`: da decidere se il marchio ha un blu suo.
7. **Posizione verticale.** Marchio intero (con gli stipiti) da y 323 a 1592: margine alto 323, basso 199. È voluto (la porta «poggia» in basso), ma la parte a stella sta alta rispetto al centro.

## Proposta: ricostruzione geometrica

Rifare il marchio con geometria esatta, partendo dalle misure medie di sinistra e destra:
simmetria per costruzione, rette e archi veri (3 archi da 66 px), cornice di spessore unico (circa 128 px; stipiti uguali o 1,35× se si vogliono più pesanti), stesso angolo per tutte le punte (circa 59°), raggio del riquadro 0,25, luce con 4 fermate.
Poi confronto ingrandito con il riferimento, come per la versione attuale.
