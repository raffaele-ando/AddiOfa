# Conversione del banco domande: tutte a completamento

Decisione dell'utente: **tutte le domande sono frasi inglesi a completamento con 4 opzioni**. Niente più «Translate…», «Choose the correct translation…», «Which sentence is correct?»: la lingua italiana sparisce dal testo della domanda (resta solo nella spiegazione).

## Cosa fa ogni agente
Ogni agente ha un file `ingresso-NN.json` (domande da convertire, con il testo attuale) e scrive **solo** `patch-NN.json` in questa cartella. Non tocca `contenuti/domande/`, non esegue git, non cancella file. Un revisore diverso risolve poi ogni domanda alla cieca e confronta con la tua risposta.

`patch-NN.json` è un oggetto `{ "q4": { "prompt", "options", "correctIndex", "explanation" }, ... }` con **tutti** gli id del tuo ingresso (nessuno saltato). Livello e argomento restano quelli dell'ingresso (`level`, `grammarTopic`): la domanda deve verificare la stessa regola.

## Formato della domanda
- `prompt`: `Complete the sentence: 'She _____ to Milan every day.'`: una sola frase inglese con **un solo spazio** `_____` (cinque underscore), tra apici singoli. Eccezione: se servono due spazi collegati (es. «If I _____ rich, I _____ travel»), le opzioni sono le coppie intere «were / would» e il prompt ne ha due; usalo solo quando la regola lo richiede.
- `options`: esattamente 4 voci che riempiono lo spazio (parola, forma verbale o breve gruppo, non frasi intere). Una sola è giusta; le altre tre sono errori che uno studente italiano fa davvero su quella regola (forma sbagliata del verbo, preposizione, ordine, articolo, falso amico…), ma in quel contesto sono **sicuramente sbagliate**: nessuna seconda risposta accettabile.
- `correctIndex`: 0-3. Distribuisci le risposte giuste in modo uniforme nel tuo file (circa un quarto per posizione), mai la stessa posizione tre volte di fila.
- Tieni la frase della domanda originale quando è buona: la frase inglese giusta della vecchia traduzione diventa la frase con lo spazio. Se è goffa o ambigua, riscrivila con la stessa regola.
- Registro: inglese semplice del livello (A1/A2/B1), nomi e luoghi reali ma banali, niente marchi, niente argomenti sensibili.
- Nessuna frase uguale (o quasi) a un'altra domanda del tuo file: varia soggetti, verbi, contesti.
- Stesse regole di prima: niente trucchi, niente «none of the above», niente maiuscole sospette che regalino la risposta, opzioni di lunghezza simile.

## Spiegazione (`explanation`, in italiano)
2-3 frasi: la regola in poche parole, perché la risposta giusta funziona e perché almeno le altre due più tentanti no. Non nominare mai «traduzione» né la frase italiana. Usa gli apici singoli per le parole inglesi. Controlla l'ortografia italiana.

## Correttezza (la cosa più importante)
Prima di scrivere ogni domanda, rispondi tu stesso alle quattro opzioni nel contesto. Se hai un dubbio su una variante accettabile (inglese britannico/americano incluso), cambia la domanda. È meglio una domanda semplice e sicura che una furba e discutibile.

## Scrivi su disco prima di finire
Salva `patch-NN.json` a metà lavoro e alla fine (JSON valido, `ensure_ascii` falso), poi scrivi `NOTE-NN.md` con: quante domande convertite, le domande che hai dovuto cambiare molto, i dubbi residui. Verifica il JSON con `node -e "JSON.parse(require('fs').readFileSync('patch-NN.json','utf8'))"` e che gli id siano tutti quelli dell'ingresso.
