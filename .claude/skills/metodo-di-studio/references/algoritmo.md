# L'algoritmo in dettaglio

È il primo dei tre pilastri. Qui trovi le formule usate nell'app OFA (codice in `assets/codice-ofa/spacedRepetition.ts`) e come applicarle quando l'elemento di studio non è una domanda a risposta multipla, o quando si studia in chat.

Indice: 1. Stato di un elemento · 2. Voto di qualità · 3. Aggiornamento SM-2 · 4. Velocità personale · 5. Scelta delle domande · 6. Metriche derivate · 7. Adattamenti · 8. Miglioramenti da fare quando lo ricostruisci

---

## 1. Stato di un elemento
```ts
{
  correct, incorrect, omitted,   // conteggi (solo il primo tentativo conta come giusta o sbagliata)
  lastSeen,                      // timestamp
  box,                           // ripetizioni SM-2 riuscite di fila (0 = da imparare)
  easiness,                      // facilità SM-2, parte da 2.5, minimo 1.3
  previousEasiness,              // per la freccia di tendenza
  interval,                      // giorni al prossimo ripasso
  lastQuality,                   // voto 0–5 dell'ultimo richiamo
  lastResponseTimeMs, lastFirstClickTimeMs, lastSwitchCount, lastTrajectory
}
```

## 2. Voto di qualità (0–5), calcolato e non dichiarato
- **Risposta sbagliata** → 0.
- **Rapporto di latenza** R = tempo effettivo / tempo atteso. Il tempo effettivo è limitato tra 0,8 e 60 s; il tempo atteso vale almeno 1,5 s.
- **Primo tentativo, nessun cambio di opzione:**
  - R ≤ 1 → 5;
  - 1 < R ≤ 2,2 → scende in modo lineare da 5 a 3,5;
  - 2,2 < R ≤ 4 → da 3,5 a 3;
  - oltre → 3.
- **Primo tentativo, con cambi di opzione:**
  - se la prima scelta era giusta (dubbio, poi ritorno alla giusta): 3,6 − 0,15 per ogni cambio oltre il primo, minimo 3,1; poi meno fino a 0,5 per la lentezza, con minimo 3;
  - se la prima scelta era sbagliata (andato per esclusione): 3,1 − 0,2 per ogni cambio oltre il primo, minimo 2,6; poi meno fino a 0,4 per la lentezza, con minimo 2,5.
- **Esitazione prima di confermare** oltre 4 s: fino a −0,35 (arriva al massimo a 14 s), con minimo 2,5.
- **Più tentativi** (dopo il Riprova): 3 − 0,6 per ogni tentativo oltre il primo, minimo 1, meno una penalità di lentezza fino a 0,8.
- **Sicurezza dichiarata**: *Indovino* −2, *Incerto* −0,6, *Sicuro* 0 (minimo 0,1).
- Il **tempo scaduto** conta come risposta sbagliata con sicurezza "Indovino".

## 3. Aggiornamento SM-2
- Voto ≥ 3 → ripetizioni +1; intervallo: 1 giorno se era la prima, 6 giorni se era la seconda, altrimenti intervallo × facilità (arrotondato).
- Voto < 3 → ripetizioni a 0, intervallo di 1 giorno.
- Facilità: EF' = EF + (0,1 − (5 − q) × (0,08 + (5 − q) × 0,02)), con minimo 1,3. Si salva anche il valore precedente.

## 4. Velocità personale
- Tempo atteso = (parole di domanda e opzioni / 180 parole al minuto) + 1,2 s per decidere, moltiplicato per il fattore di velocità (tra 0,5 e 2,5), con un minimo di 2,2 s.
- Il fattore si aggiorna solo sulle risposte giuste al primo tentativo, con una media mobile esponenziale: α = max(0,05; 1/min(25, n)). Il tempo osservato viene limitato tra 1 e 35 s, così una distrazione non falsa la media.

## 5. Scelta delle domande
| Modalità | Punteggio per ogni elemento (si prendono i primi 10) |
|---|---|
| **Smart** (predefinita) | urgenza SM-2 (mai visto: 800–1000; da ripassare: 500 + giorni di ritardo × 10; non ancora da ripassare: giorni trascorsi / intervallo × 100) + debolezza (tasso di errore × 400 + (5 − facilità) × 40) + casuale tra 0 e 100 |
| Standard | solo urgenza SM-2 (mai visto: 1000–1100) |
| Weakness | tasso di errore × 1000 + (5 − facilità) × 100; gli elementi mai visti valgono 0 |
| Blitz | come Standard, ma con 10 s a domanda |
| Active Recall | come Standard, ma le opzioni sono nascoste e la risposta va ricostruita con le parole; il suggerimento mostra solo argomento e livello |
| Filtro mirato | come Standard, sul sottoinsieme scelto (nucleo, categoria, livello o argomento) |

Le opzioni vengono **rimescolate** a ogni presentazione. In simulazione le domande troppo simili tra loro (Jaccard sulle parole > 0,45) vengono scartate.

## 6. Metriche derivate (la base della gamification vera)
- **Imparato** = `box > 0`, cioè l'ultimo richiamo ha avuto voto ≥ 3. **% padronanza** = elementi imparati / totale del materiale scelto.
- **Accuratezza** = giuste / (giuste + sbagliate), globale, per argomento e per elemento.
- **Tasso di errore** per elemento = (sbagliate + omesse) / tentativi; si usa per ordinare "i peggiori prima".
- **Confidenza** per elemento = min(100, (facilità − 1,3) / 1,3 × 100); **tendenza** = confronto tra facilità attuale e precedente.
- **Pass rate** delle simulazioni = superate / svolte; **record** = punteggio massimo.

## 7. Adattamenti
**Esercizi a passaggi (ingegneria).** L'elemento è l'**esercizio-tipo**. Voto = 5 senza aiuti; con 1 aiuto 3,5; con 2 aiuti 2,0; soluzione guardata o errore di metodo → sotto 2. Un errore solo di calcolo, con il metodo giusto, vale circa 3 (e si annota come "calcolo"). Il tempo atteso lo decide il tempo reale disponibile all'esame per quell'esercizio. "Imparato" vuol dire risolto con voto ≥ 3 in una **variante numerica nuova**.

**Domande aperte e orali.** L'elemento è la domanda. Voto = percentuale di punti chiave coperti, portata su una scala da 0 a 5, meno la penalità per la sicurezza dichiarata. Con meno della metà dei punti chiave coperti, torna tra 1 giorno.

**In chat (senza cronometro).** Usa la sicurezza dichiarata, i tentativi e gli aiuti, con **gli stessi valori di `scripts/registro.cjs`**: giusta + Sicuro = 5; giusta + Incerto = 4,4; giusta + Indovino = al massimo 2,5 (torna nella stessa sessione); ogni aiuto −1,5 (1 aiuto = 3,5; 2 aiuti = 2,0); giusta solo al secondo tentativo = al massimo 2,2; sbagliata = 0; omessa = contata a parte, torna domani senza abbassare la facilità. Tieni una tabella di stato (elemento, argomento, voto, data) e scegli le domande successive con la stessa logica di Smart: prima gli elementi da ripassare o deboli, poi quelli nuovi, mescolando gli argomenti.

**Test con penalità (TOLC).** Aggiungi lo stato "saltata" (distinto da "omessa per tempo") e tieni l'accuratezza *delle risposte date*, così si può allenare la decisione tra rispondere e saltare.

## 8. Miglioramenti da fare quando lo ricostruisci
L'analisi dell'app OFA ha trovato alcuni punti in cui l'algoritmo non rispetta del tutto il suo principio ("giusto per caso non è imparato"). In un nuovo progetto correggili:
- **Indovino veloce = 3,0 → conta come imparata.** Con la penalità di −2 una risposta giusta, veloce e "Indovino" arriva esattamente alla soglia. Metti un tetto di 2,5 alle risposte "Indovino" (come fa `scripts/registro.cjs`), così tornano presto.
- **La confidenza si satura.** (facilità − 1,3) / 1,3 vale già il 92% alla prima vista e il 100% dopo una risposta perfetta. Normalizza su un intervallo più largo, per esempio (facilità − 1,3) / 1,7, oppure combinala con `box` e con l'intervallo, così cresce davvero con il tempo.
- **Anche la simulazione deve aggiornare SM-2** (voto calcolato da tempo e cambi di risposta, già registrati), non solo `box`.
- **Tempo atteso per elementi non testuali** (calcoli, esercizi): la formula di lettura non basta. Metti un tempo atteso per elemento (per esempio il tempo disponibile all'esame diviso per il numero di quesiti) e un fattore di velocità **per categoria**.
- **Un solo modo di contare "imparata"**: nell'app il menu la calcolava sul materiale scelto e le statistiche sempre sul totale. Mostra sempre su quale insieme è calcolato il numero.
- **Doppia penalità dopo il Riprova.** Un errore seguito da Riprova produce due aggiornamenti SM-2 (0, poi ~2,2–2,4): la facilità crolla quasi al minimo per un solo sbaglio, e il tempo del secondo tentativo include il primo (il cronometro non riparte). Fai **un solo aggiornamento per domanda e per sessione** (il primo tentativo); il Riprova serve solo per imparare.
- **Il tetto di 2,5 a "Indovino" ripristina il comportamento originale**: nella prima versione le penalità erano Indovino −2,5 e Incerto −1,0; sono state ammorbidite a −2 e −0,6 insieme all'introduzione della telemetria, ed è così che Indovino è arrivato a 3,0.
- **Accuratezza e qualità restano separate** (anche questa è una scelta fatta nella storia dell'app): accuratezza = esito oggettivo del primo tentativo; imparato/confidenza = qualità del richiamo.
- **Esitazione in simulazione**: nell'app viene calcolata alla consegna per tutte le domande, quindi non ha significato. Se dai un voto alle risposte della simulazione, escludila.
- **Attività gonfiata**: una simulazione aggiunge sempre 30 domande anche con risposte omesse e un Riprova conta due volte. Conta solo le risposte date, una volta.
