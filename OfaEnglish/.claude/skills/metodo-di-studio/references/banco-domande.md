# Regole per creare domande ed esercizi

Queste regole vengono da un controllo domanda per domanda delle 606 domande dell'app OFA. Nessuna risposta segnata come giusta era sbagliata, ma c'erano 82 difetti su 79 domande. Evitali fin dall'inizio.

## Correttezza prima di tutto
- **La risposta giusta deve essere indiscutibile.** Ricontrollala sempre. Per la matematica rifai il calcolo; per le lingue verifica l'uso standard.
- **Ogni distrattore deve essere davvero sbagliato**, non solo "meno comune". Il difetto più frequente trovato (44 casi su 82) era un distrattore che in realtà era corretto. Alcuni esempi: *did* enfatico (*She did buy*), present continuous per un programma (*The train is leaving at 8*), inglese britannico (*I haven't enough money*), *has to be* usato per una deduzione, *older* al posto di *elder*.
- **Se una regola ha eccezioni, non scrivere "sempre" o "mai" nella spiegazione.** Scrivi "di solito" oppure "nei test si preferisce…".
- **Il contesto deve bastare a decidere.** Per esempio, una deduzione con *must* ha bisogno di indizi forti, altrimenti anche *might* va bene.
- **Nelle traduzioni la risposta deve rendere tutto il testo di partenza**: tempo verbale, persona, ogni pezzo della frase. Casi trovati: "vicino a" reso con *next to*, e "un pacchetto al giorno" dimenticato.

## Distrattori utili
- Costruiscili sugli **errori reali di chi studia**. Per l'inglese sono i calchi dall'italiano: *If I would*, *Do I can*, *since ten years*, *enjoy to*, *said me*, *peoples*, *more easy*. Per la matematica: errori di segno, la derivata della funzione composta dimenticata, le condizioni di esistenza trascurate, le unità di misura sbagliate.
- Evita distrattori assurdi che si scartano senza pensare (tipo *quietlyly*): non insegnano niente.
- Almeno due distrattori devono essere **plausibili**.

## Nessun indizio involontario
- **Posizione**: rimescola le opzioni quando le mostri (algoritmo Fisher-Yates, `shuffleQuestion` in `assets/codice-ofa/utils.ts`). Ed evita che nel file la risposta giusta sia quasi sempre la prima: nell'OFA era la A nell'89% dei casi.
- **Lunghezza**: la risposta giusta non deve essere sistematicamente la più lunga o la più precisa.
- **Duplicati**: niente domande con lo stesso testo. Se due domande sono simili, differenziale; in simulazione usa un filtro di similarità (Jaccard sulle parole, soglia 0,45, `calculateSimilarity`).

## Spiegazioni che servono
- Spiega **perché la risposta giusta è giusta e perché la trappola tipica è sbagliata**, in una o due frasi. Spiegazioni di una parola come "Advice." o "If + Past Simple." servono poco.
- Usa una lingua sola per spiegazione (non mescolare italiano e inglese nella stessa frase).
- Controlla la resa a schermo: nel banco OFA c'erano barre rovesciate visibili come in `That\'s`.

## Metadati coerenti
- Ogni domanda ha **categoria**, **argomento** e **livello o difficoltà** corretti, perché filtri, radar e modalità Weakness dipendono da questi campi. Casi sbagliati trovati: *as soon as* classificato sotto i condizionali, *news/furniture* sotto i quantificatori, il present simple di base segnato come B1.
- Tieni un campo che indica se la domanda appartiene al **nucleo** (es. `core: true`) invece di affidarti alla posizione nel file.

## Come organizzare il banco
- **Prima il nucleo** (un sottoinsieme piccolo, meglio se con le domande più frequenti all'esame), poi **blocchi per argomento**. Nell'OFA erano circa 18 domande per argomento, metà teoria e metà applicazione, in ordine di difficoltà.
- **ID stabili** (`q1`, `q2`…) che non cambiano quando aggiungi domande, perché le statistiche dell'utente sono legate agli ID.

## Controllo finale
1. `node scripts/audit_bank.cjs <file.json|file.ts>` per i controlli automatici.
2. Rilettura domanda per domanda, controllando chiave, ambiguità, traduzione, spiegazione, refusi e metadati. Con un banco grande, dividilo in blocchi di circa 150 domande e rivedili in parallelo.
3. Correggi, poi rilancia lo script.
