# NOTE-05

Agente CONV-05. Ingresso: `ingresso-05.json` (41 domande, q352-q455). Uscita: `patch-05.json`.

## Esito
- 41 domande convertite su 41, nessun id saltato né aggiunto (verificato con script contro l'ingresso). JSON valido.
- Tutte nel formato `Complete the sentence: '... _____ ...'`, 4 opzioni distinte, 1 spazio; una sola (q434) con due spazi e opzioni a coppia («were / would»), perché la regola lo richiede.
- Posizioni giuste: 10 / 11 / 10 / 10 (indici 0-3), mai la stessa posizione tre volte di fila.
- Livello e argomento restano quelli dell'ingresso (non toccati nel patch).

## Domande cambiate molto
- Le vecchie varianti con la frase italiana sono sparite. Le «extraOption» dell'ingresso sono state usate solo come ispirazione per gli errori.
- q353: soggetto cambiato da «You» ad «Anna» (opzioni `doesn't have to` / `don't have to` / `doesn't has to`) per variare rispetto a q358.
- q357: la vecchia opzione `Have I to` (arcaica, accettabile in inglese britannico) sostituita con `Do I have`.
- q359: lo spazio contiene «should I»; le opzioni testano l'ordine modale + soggetto.
- q385 e q386: non c'è più il discorso diretto nel prompt (una sola frase): q385 usa «Yesterday Tom said that he _____ very tired», q386 «Last night Anna told me that she _____ me the next day». Verificano il passo indietro dei tempi e `would` + base, ma senza vedere la frase originale.
- q388: la vecchia opzione `was eating` tolta, perché «I was eating when you called me» è corretta. Ora: `had already eaten / had already eat / have already eaten / was already eaten`.
- q390: riscritta con una frase in contesto («when she was a child»); `didn't used to` volutamente non offerta, perché diffusa nell'uso informale.
- q434: l'unica a due spazi (vedi sopra).
- q446: spazio spostato nella frase principale (`would move`), per variare rispetto a q435.
- q450, q382, q451, q455: tolte le opzioni che potevano essere condizionali misti accettabili (es. `went`, `left`, `would you do`).
- q380: tolta `was` dalle opzioni (accettata informalmente in «If I was you»).
- q404 e q409: tolta `that`, che sarebbe un'alternativa corretta; q410 tiene `that` come errore, vedi dubbio sotto.

## Dubbi residui
- q410 («Paris, _____ is...»): `that` è dato come sbagliato (non si usa nelle relative non restrittive tra virgole): regola standard, ma un revisore pignolo può discuterla.
- q358: `mustn't` come errore («Entry is free, so you mustn't buy a ticket») è sbagliato di significato più che di forma; il contesto «free» lo rende chiaramente non adatto.
- q372: `heavy` ed `hardly` sono errori di significato/forma, non di ortografia; nessuna seconda risposta accettabile, ma `hard` è l'unica che funziona con «all day».
- q385: nessuna variante «he is tired» tra le opzioni, ma in generale `is` sarebbe accettabile in discorso indiretto se il fatto è ancora vero; per questo la frase parte da «Yesterday ... said».
- q384: `is` da solo escluso con «Look!» + «right now»; verificare che il revisore lo consideri sicuramente sbagliato.
- Sei domande sugli avverbi (q370-q378) hanno la stessa forma (aggettivo/-ly/ortografia/nome): è voluto dalla regola, ma sono ripetitive.
- Registro: le spiegazioni sono in italiano con apici singoli per l'inglese; ortografia italiana non controllata con strumenti automatici, solo riletta.
