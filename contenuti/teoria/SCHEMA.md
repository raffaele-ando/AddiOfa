# Schema di una scheda di teoria

Una scheda per argomento, in `contenuti/teoria/<id>.json` (l'`id` è lo slug di `argomenti.json`, es. `present-perfect.json`).
Il generatore legge ogni `.json` di questa cartella tranne `argomenti.json`; un file può contenere anche un array di schede.

```json
{
  "id": "present-perfect",
  "titolo": "Present Perfect: esperienze e durata",
  "livello": "B1",
  "regola": [
    "Si forma con have/has + participio passato.",
    "Si usa per esperienze senza data e per situazioni che durano ancora."
  ],
  "esempi": [
    { "en": "Have you ever been to Brazil?", "it": "Sei mai stato in Brasile?" }
  ],
  "errori": [
    { "sbagliato": "I have been to Africa in 2009.", "giusto": "I went to Africa in 2009.", "perche": "Con una data precisa si usa il Past Simple." }
  ],
  "consiglio": "Se nella frase c'è una data o un momento finito (yesterday, in 2009), non usare il Present Perfect.",
  "domande": ["q61", "q171", "q172"]
}
```

| Campo | Tipo | Regole |
|---|---|---|
| `id` | string | uno dei 31 slug di `argomenti.json` |
| `titolo` | string | italiano, breve |
| `livello` | `"A1"` \| `"A2"` \| `"B1"` | quello dell'argomento in `argomenti.json`, salvo buoni motivi |
| `regola` | string[] | 2-5 frasi brevi in italiano chiaro; si può usare *corsivo* con asterischi come nel prontuario |
| `esempi` | `{ en, it }[]` | 3-6 coppie: frase inglese corretta e sua traduzione italiana |
| `errori` | `{ sbagliato, giusto, perche }[]` | 2-4 errori tipici del test; `perche` in italiano, una frase |
| `consiglio` | string | una sola frase pratica per il test |
| `domande` | string[] | **esattamente 3** id di domande esistenti, non duplicate, dell'argomento (preferire domande `core` con stato `originale`/`riscritta`/`rivista`) |

Regole del contenuto: niente testi copiati da libri o da altri siti, niente promesse sul test ("esce sempre"). Gli id delle domande sono quelli di `contenuti/domande/` (`q61`, non `q061`).

Per gli argomenti con `inCheatSheet: true`, la regola deve essere coerente con la voce corrispondente di `app/src/data/cheatSheet.ts` (`voceCheatSheet` in `argomenti.json`).

Quando una scheda esiste, `npm run contenuti` imposta `theoryId` su tutte le domande di quell'argomento.
