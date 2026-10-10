# Codice collaudato dall'app OFA Polimi Prep

Copia fedele dei moduli centrali dell'app (repo `raffaele-ando/OfaEnglish`, cartella `src/`). Riusali come base quando costruisci una nuova app di studio.

| File | Contenuto |
|---|---|
| `types.ts` | Tipi: `Question`, `UserStats`, `ExamHistory`, telemetria, `AppState` |
| `spacedRepetition.ts` | Scelta delle domande (Standard, Weakness, Smart), tempo atteso, voto continuo da 0 a 5, aggiornamento SM-2 e della velocità personale |
| `utils.ts` | `shuffleQuestion` (Fisher-Yates) e `calculateSimilarity` (Jaccard, per evitare domande quasi uguali in simulazione) |
| `audio.ts` | Suoni con la Web Audio API, vibrazione, coriandoli, audio on/off |

Adattamenti necessari:
- `spacedRepetition.ts` importa `questions` e `getQuestionsByCorpus` da `../data/questions`: sostituiscili con il banco del nuovo esame.
- Il tipo `Question` ha `grammarTopic`: rinominalo in `topic` e generalizzalo con `type` per gli esami non a risposta multipla (vedi `references/app-blueprint.md`).
- `audio.ts` usa `canvas-confetti` (`npm i canvas-confetti @types/canvas-confetti`).

## Schermate (riferimento per il flusso e le informazioni)

| File | Cosa mostra del metodo |
|---|---|
| `Menu.tsx` | Un tocco per iniziare, scelta nucleo/tutto, Imparate % e Accuratezza % sul materiale scelto |
| `LearnMode.tsx` | Sessione da 10: conferma in due tempi con Indovino/Incerto/Sicuro, feedback che cresce con la serie, Riprova con opzione disattivata, spiegazione solo a risposta giusta, Active Recall con via d'uscita |
| `ExamMode.tsx` | Simulazione: estrazione casuale con filtro di similarità, nessun feedback, revisione di sbagliate e omesse |
| `StatsMode.tsx` | Statistiche dal generale al particolare, dettaglio per elemento con accuratezza a semaforo, confidenza e tendenza |

Difetti noti da non copiare: doppio aggiornamento SM-2 dopo il Riprova, Indovino veloce a 3,0, confidenza che si satura, XP/sfida quotidiana in fondo a `StatsMode.tsx`, contatore dei giorni nel menu (vedi `references/algoritmo.md` §8 e `references/app-blueprint.md` §7).
