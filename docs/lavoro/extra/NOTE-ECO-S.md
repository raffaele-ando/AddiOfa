# NOTE-ECO-S: Worker ATLAS esteso con le iscrizioni

Agente ECO-S. Percorsi toccati: `atlas/**` e questa nota. Nessun git, nessun file cancellato, `app/` intatta.

## Fatto
- `POST /v1/signups` pubblico (`src/signups.ts`, `src/http.ts`, `src/limite.ts`): valida la forma, solo email `polimi.it` / `mail.polimi.it` / `*.polimi.it` (minuscole, trim; rifiutati `evilpolimi.it`, `polimi.it.evil.com`), upsert per email, consensi `noi/atlas/comunicazioni` nel `consent_log` (data, versione, `grant` poi `update` solo se cambiano), 10 richieste/min per IP con finestra scorrevole su D1 (429 + `Retry-After`), corpo max 4 KB (413), risposta sempre `{ ok: true }`. `email_verificata` mai scritto a 1.
- Un'iscrizione già collegata a un login Google non si modifica più dal modulo pubblico (altrimenti chiunque conosca l'email ne riscriverebbe nome e consensi).
- Collegamento: `PUT /v1/links/:app` e `PATCH /v1/me` accettano `polimiEmail` (salvata in `accounts.polimi_email`; collega anche l'iscrizione che arriva dopo). `/v1/me` e `/v1/me/export` aggiungono `profile` (nome, corso, sede), `consensi`, `signup` (+ `signupConsentLog` nell'export); `PATCH` aggiorna corso/sede/provenienza dell'iscrizione collegata. `DELETE /v1/me` cancella anche l'iscrizione collegata.
- `GET /v1/admin/signups?formato=csv|json[&comunicazioni=1]`: header `Authorization: Bearer <ADMIN_TOKEN>`, confronto a tempo costante, 404 se il segreto non c'è, 20 tentativi/min per IP, colonna `consenso_comunicazioni` (e `email_verificata`), CSV con BOM e celle-formula neutralizzate.
- `DELETE /v1/signups` risponde 405 (nessuna cancellazione senza verifica); procedura in `atlas/DEPLOY.md` §7.
- CORS: `ALLOWED_ORIGINS` (virgole); origine non in elenco = nessun header; `*` vale solo con `ALLOW_TEST_TOKENS=true` (locale); `OPTIONS` coerente; rotte admin senza CORS. In `wrangler.jsonc` ora `ALLOWED_ORIGINS` è vuoto: **va compilato prima del deploy**.
- Migrazione `0002_signups.sql`: `signups`, `rate_limit`, `accounts.polimi_email`, `consent_log` ricostruita (stesse righe e id; `account_id` facoltativo, nuovo `signup_id`). Provata su un DB con dati della 0001: righe conservate, `foreign_key_check` vuoto.
- `FIREBASE_PROJECT_ID` cambiato da `ofaenglish-f3719` (vecchia app) a `mimetic-resolver-7szp9` (come `app/firebase-applet-config.json`).

## Prove (`cd atlas && npm test`, 32 prove, tutte verdi in circa 30 s; vedi anche «Percorso di studi»)
Avviano **veri Worker** con `wrangler dev --local` (D1 locale temporanea), senza Cloudflare: iscrizione valida e normalizzata, sottodomini accettati, email non PoliMi e domini simili rifiutati, forma errata, doppia iscrizione idempotente, registro grant/update, rate limit (429 all'11a, altro IP passa), 413, DELETE pubblico 405, admin 404 senza segreto / 401 con segreto sbagliato / elenco JSON e CSV con il segreto, CORS (consentita, non consentita, OPTIONS, `*` solo in sviluppo), collegamento e cancellazione con `/v1/me`, classifica NOI invariata (ordine, 403 senza consenso, revoca), token `test:` solo con `ALLOW_TEST_TOKENS`. Anche `npx tsc --noEmit` pulito e `wrangler deploy --dry-run` riuscito (`npm ci` ha funzionato via proxy).

## Non provato
- Nessun deploy né D1 remoto (connettore Cloudflare non autorizzato); migrazione 0002 solo in locale.
- Nessun ID token Firebase vero: la verifica della firma (`src/auth.ts`) è il codice di prima; provati solo token falsi (401) e quelli `test:`.
- Il limite per IP si affida a `CF-Connecting-IP`, che esiste solo su Cloudflare (in locale le prove lo simulano); non protegge da chi ha molti IP.
- Le prove non sono nel `npm run check` della radice (servono ~20 s e `npm ci` in `atlas/`): vanno aggiunte lì dal coordinatore se si vuole.

## Per gli altri agenti (app)
- Contratto iscrizione: `appId: 'addiofa'`, `consentVersion` stringa `[A-Za-z0-9._-]{1,32}` a scelta dell'app (es. `iscrizione-2026-10-16`; cambiarla a ogni cambio di testo). `consensi` con tre booleani obbligatori, mai preselezionati. Un 4xx = dati sbagliati (non ritentare); 429/5xx/rete = coda e nuovo tentativo.
- L'app non può sapere se l'email esisteva già, né deve scrivere «verificata».
- Nomi delle variabili Vite lato app: vedi `atlas/DEPLOY.md` §5 (da allineare al codice che le legge).
- I consensi dell'iscrizione (`noi`, `atlas`, `comunicazioni`) sono separati dai permessi di `PUT /v1/links/:app` (`noi.leaderboard`, `atlas.personalize`): due registri, due schermate.

## Percorso di studi (seconda richiesta, migrazione `0003_percorso_studi.sql`)
- `POST /v1/signups` e `PATCH /v1/me` (iscrizione collegata) accettano, tutti facoltativi: `scuola` (`ing-ind-inf` | `icat` | `auic` | `design`), `sede` (id `a-z0-9-`, 2-30), `livello` (`triennale` | `magistrale` | `ciclo-unico`), `corso` (max 120), `anno` (numero intero 1-6, una stringa come `"2"` è rifiutata), `provenienza` (id `a-z0-9-`, 2-30). Valori non validi: 400. Maiuscole e spazi ai bordi di `scuola`, `livello`, `sede`, `provenienza` vengono normalizzati.
- **Cambio di regole da sapere**: `sede` e `provenienza` prima erano testo libero (fino a 60 e 80 caratteri), ora solo id brevi: un'app che manda «Leonardo» riceve 400, deve mandare `leonardo`. I valori già salvati non si toccano.
- `nome` ora è facoltativo: se manca, è vuoto o solo spazi si ricava dalla parte dell'email prima di `@` (e prima di un eventuale `+`): separata sui punti, senza cifre, iniziali maiuscole (`luca.bianchi12@polimi.it` → `Luca Bianchi`). Se non resta nulla (`12345@polimi.it`) e il nome manca: 400. **La regola l'ho scritta dalla tua descrizione**: nel codice dell'app (`app/src/lib/progetto/`) non ho trovato la funzione del client, quindi conviene confrontare i due risultati su qualche email con trattini o apostrofi (qui: i caratteri fuori da `a-z ' -` si scartano, nessuna maiuscola dopo il trattino).
- Reinvio dell'iscrizione: i campi omessi o null conservano il valore già salvato (COALESCE), quelli inviati lo sostituiscono. In `PATCH /v1/me` invece `null` o stringa vuota svuotano il campo.
- Migrazione: solo `ALTER TABLE ... ADD COLUMN` nullable (`scuola`, `livello`, `anno`) e indici su `scuola`, `livello`, `corso`; provata su un DB con dati della 0002.
- `/v1/admin/signups`: colonne `scuola, sede, livello, corso, anno, provenienza` (ordine cambiato rispetto a prima: chi legge il CSV per posizione deve controllare), filtri `&scuola=` e `&livello=` (valore non valido: 400), combinabili con `&comunicazioni=1`. `/v1/me`: `profile` = `{ nome, scuola, sede, livello, corso, anno }`; `signup` e `/v1/me/export` includono gli stessi campi e `provenienza`.
- Limiti di velocità e controlli di dominio non toccati.
- Prove nuove (9, in `atlas/tests/atlas.test.ts`, gruppo «percorso di studi»): valori validi e tutte le combinazioni scuola/livello, campi facoltativi, scuola/livello non validi, anno fuori intervallo o non intero, sede/provenienza/corso non validi, nome ricavato (5 casi + nome presente + nome non ricavabile + dominio errato), upsert idempotente con campi omessi conservati, esportazione con colonne e filtri, migrazione 0003 su DB con dati della 0002 (riga, account, registro consensi e indici conservati). Eseguito `npm test` tre volte di fila: 32 su 32.
- Nota sulle prove: `wrangler dev` a volte si ricarica da solo mentre girano altri wrangler della stessa cartella e per un attimo rifiuta le connessioni; l'helper `tests/aiuti.ts` ripete la chiamata solo se la connessione fallisce (prima di questa correzione una prova su quattro esecuzioni è fallita per questo motivo, non per il codice).
