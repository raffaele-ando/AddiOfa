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

## Prove (`cd atlas && npm test`, 23 prove, tutte verdi in circa 20 s)
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
