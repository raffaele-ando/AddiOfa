# Contenuti

Fonte unica del banco domande, della teoria e delle spiegazioni di AddiOFA.

| Cartella | Cosa contiene |
|---|---|
| `domande/` | Le domande, un file JSON per intervallo di id |
| `teoria/` | Una scheda per ciascuno dei 31 argomenti |
| `spiegazioni/` | Spiegazioni in italiano, una per domanda |
| `validazione/` | Controlli automatici (id unici, opzioni, risposta valida, duplicati) |
| `archivio/` | Script e dump storici del vecchio banco: non servono all'app |

Si generano i file dell'app e il seed del Worker da qui. Non si modificano a mano i file marcati GENERATO in `app/src/data/`.
