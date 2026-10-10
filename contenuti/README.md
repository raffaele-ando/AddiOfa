# Contenuti

Fonte unica del banco domande, della teoria e delle spiegazioni di AddiOFA.

| Cartella | Cosa contiene |
|---|---|
| `domande/` | Le domande, un file JSON per blocco di 100 id (`q001-q100.json`, ...) + `da-rivedere.json` (coppie quasi doppie) |
| `teoria/` | `argomenti.json` (i 31 argomenti), `SCHEMA.md` e una scheda `<id>.json` per argomento |
| `spiegazioni/` | Spiegazioni in italiano, un file per blocco di 100 id: `{ "q1": "testo", ... }` |
| `strumenti/` | Script Node senza dipendenze: `genera.mjs`, `valida.mjs`, `trova-duplicati.mjs`, `scegli-nucleo.mjs`, `crea-argomenti.mjs`, `converti-da-ts.mjs` (una tantum) |
| `validazione/` | Vuota (i controlli stanno in `strumenti/valida.mjs`) |
| `archivio/` | Script e dump storici del vecchio banco: non servono all'app |

Dalla radice del repository: `npm run contenuti:valida` controlla, `npm run contenuti` genera `app/src/data/questions.ts`, `app/src/data/theory.ts` e `pass/seed.sql`. Non si modificano a mano i file marcati GENERATO. Le regole, i criteri e i problemi noti sono in `NOTE.md`.
