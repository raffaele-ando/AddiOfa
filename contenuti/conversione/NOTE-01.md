# NOTE-01 (agente CONV-01)

Cosa c'è: `patch-01.json`, 41 domande convertite a completamento (tutti gli id di `ingresso-01.json`, nessuno saltato). Tutte con un solo spazio `_____`, 4 opzioni, spiegazione in italiano senza riferimenti alla traduzione.

Posizione delle risposte giuste: 10 / 11 / 10 / 10 (posizioni 0, 1, 2, 3), mai la stessa posizione tre volte di fila.

## Domande cambiate molto
Dove la vecchia domanda faceva scegliere tra frasi intere, lo spazio cade sul punto della regola:
- q8 (How many / How much): lo spazio è il gruppo interrogativo; la vecchia versione mischiava anche l'accordo del verbo.
- q14: il prompt fissa `lived` e la scelta è l'ausiliare (`have`), così `do you live` non diventa una seconda risposta valida.
- q25: la vecchia scelta `while / during` è diventata la forma del verbo dopo `while` (`was cooking`), perché `when` renderebbe valide più varianti.
- q45 e q61: q45 testa `for` (durata); q61 è stata cambiata in `since 2015` + `has lived`, perché `He lived here for ten years` sarebbe una frase corretta (passato concluso) e `since` e `for` verrebbero testati due volte.
- q49 e q79 (First Conditional): q49 ora testa il verbo della frase principale (`will have`); q79 il verbo dopo `if` (`rains`). Il «se piove ... spiaggia» è solo in q79.
- q52: si verifica `much` davanti al comparativo (la vecchia domanda mescolava `than/as`).
- q62, q64, q66, q72, q85, q87 (le più brevi o ambigue): riscritte con un contesto più chiaro. In q72 ho aggiunto `at the hotel yesterday` perché `When do you arrive?` è una domanda corretta in inglese. In q62 `many` è diventato `three cars` per evitare `There's many` colloquiale. In q85 e q87 ho tolto `more easy` e `baddest` (forme che qualcuno accetta).
- q40 e q68 (entrambe «didn't + study») sono state diversificate: q68 usa `visit the museum`. q5 e q70 (entrambe «buy») sono state diversificate: q70 usa `went` (go).
- q11: tolto `is living` (frase accettabile) e il `her/she` della vecchia domanda.

## Dubbi residui
- q64: `There is any problem` e `There is none problem` sono sbagliate, ma `any` in una frase affermativa può far esitare uno studente forte: se un revisore la trova ambigua, sostituire `any` con `a lot of`.
- q87: `badest` non esiste in inglese e funge da errore tipico italiano («più cattivo»); `most worst` è più un errore da doppio superlativo.
- q44: `Did you already met` è sbagliata per la forma verbale (`met` dopo `did`), non per la scelta del tempo; resta comunque l'unica risposta corretta con `met` fissato.
- q16 e q3 (opzioni `ate`/`won`): sono forme corrette in altri contesti, ma qui sono sbagliate perché dopo `did`.
- Non ho verificato duplicati con le domande degli altri file di ingresso, solo all'interno del mio.
