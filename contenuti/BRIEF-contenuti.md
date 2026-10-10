# Brief per gli agenti di contenuto (domande, spiegazioni, teoria)

Leggi prima: `contenuti/NOTE.md` (come è fatta la pipeline, comandi), `contenuti/teoria/SCHEMA.md`, `app/src/types.ts` (tipo `Question`) e `docs/business/AddiOFA_piano_definitivo.md` solo se ti serve il contesto. Pubblico: studenti italiani di 18-20 anni, livello A1-B1, che preparano il test d'inglese dell'OFA del Politecnico di Milano (30 domande in 15 minuti, risposta multipla). Il prodotto è venduto: **un errore in una risposta esatta è il difetto peggiore**.

## Regole di qualità (valgono per tutti)

1. **Una sola risposta difendibile.** Ogni domanda ha esattamente una opzione corretta in inglese standard; gli altri distrattori sono sbagliati in modo netto (non "meno naturali"). Se hai il minimo dubbio che un distrattore sia accettabile, cambia il distrattore. Evita le domande che dipendono solo da britannico/americano.
2. **Inglese corretto e naturale**, senza refusi, con la punteggiatura giusta. Le opzioni non differiscono solo per una maiuscola.
3. **Originali.** Non riprodurre prove d'esame reali, libri o altri siti; frasi nuove, scene quotidiane e universitarie, nomi vari. Non scrivere "come nel test ufficiale", "esce sempre" né simili.
4. **Italiano chiaro e diretto** nelle spiegazioni e nella teoria: a un compagno di corso, 1-3 frasi per spiegazione (regola in una frase, perché la risposta esatta è quella, perché la trappola più probabile è sbagliata). Niente tono da marketing, niente emoji.
5. Rispetta gli id e il formato dei file esistenti; non cambiare `correctIndex`/opzioni di domande che non sono tue.
6. Dopo il lavoro lancia `npm run contenuti:valida` (dalla radice `/home/user/AddiOfa`): non devono comparire errori nei tuoi file. Non lanciare `npm run contenuti` (rigenera file dell'app a cui lavorano altri): lo fa chi coordina.
7. Niente git, niente `rm`. Scrivi un rapporto finale breve (max 20 righe): cosa hai fatto, quante domande/spiegazioni/schede, dubbi su singole domande (id e motivo), cose da far controllare a un umano.

## Formati

- Domande: `contenuti/domande/qNNN-qMMM.json` (array; campi `id, prompt, options[4], correctIndex, explanation, category ('Grammatica'|'Traduzione'), level ('A1'|'A2'|'B1'), grammarTopic, core, extraOption?, stato`). Stati: `originale`, `da-riscrivere`, `riscritta`, `rivista`, `duplicata-di:qN`.
- Le domande di tipo **Traduzione** hanno il prompt "Choose the correct translation for '<frase italiana>'" e quattro frasi inglesi; quelle di **Grammatica** hanno una frase da completare o una scelta tra frasi. Mantieni il tipo, il livello e l'argomento (`grammarTopic`) della domanda sostituita.
- Spiegazioni in italiano: `contenuti/spiegazioni/qNNN-qMMM.json`, oggetto `{ "q61": "testo", ... }` (chiavi con id senza zeri).
- Teoria: `contenuti/teoria/<slug>.json` secondo `SCHEMA.md`.
