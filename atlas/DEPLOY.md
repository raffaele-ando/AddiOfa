# ATLAS: come si pubblica

Worker Cloudflare + database D1 `atlas` (id `fae6dddc-a787-474b-9699-e23bab53eb4d`, Europa occidentale, già creato).
Tutti i comandi si lanciano da `atlas/`. Il Worker non è ancora pubblicato: da questa sessione non c'è accesso a Cloudflare.

## 1. Prima volta

```bash
cd atlas
npm ci
npx wrangler login                       # una volta sola, apre il browser
npx wrangler d1 list                     # controlla che compaia "atlas" con l'id sopra
```

Se il database non esistesse più: `npx wrangler d1 create atlas` e copia il nuovo `database_id` in `wrangler.jsonc`.

## 2. Migrazioni sul database vero

```bash
npx wrangler d1 migrations list atlas --remote     # cosa manca
npx wrangler d1 migrations apply atlas --remote    # applica 0002_signups.sql e 0003_percorso_studi.sql (la 0001 è già applicata)
```

`0002_signups.sql` aggiunge `signups`, `rate_limit`, la colonna `accounts.polimi_email` e ricostruisce `consent_log`
(stesse righe e stessi id, in più `signup_id`; `account_id` diventa facoltativo).
`0003_percorso_studi.sql` aggiunge a `signups` le colonne facoltative `scuola`, `livello`, `anno` (le righe esistenti restano con valore vuoto) e gli indici su `scuola`, `livello`, `corso`.
Nessuna delle due cancella dati. Fai comunque un backup prima:

```bash
npx wrangler d1 export atlas --remote --output=atlas-backup.sql    # il file contiene dati personali: non va nel repository
```

## 3. Configurazione

### Origini consentite (CORS)

In `wrangler.jsonc`, sezione `vars`, metti l'indirizzo del sito che chiama l'API, senza barra finale. Più origini si separano con la virgola:

```jsonc
"ALLOWED_ORIGINS": "https://addiofa.example,https://www.addiofa.example"
```

Vuoto (com'è ora) significa che nessun sito può chiamare l'API dal browser. `*` funziona **solo in locale**
(con `ALLOW_TEST_TOKENS=true` in `.dev.vars`): in produzione viene ignorato. Dopo ogni cambio serve un nuovo `deploy`.

### Progetto Firebase che verifica i login

`FIREBASE_PROJECT_ID` in `wrangler.jsonc` è `mimetic-resolver-7szp9`, lo stesso `projectId` di `app/firebase-applet-config.json`.
Il Worker accetta solo ID token emessi da quel progetto (controlla firma, `iss`, `aud` e scadenza).

### Segreto dell'autore per scaricare le iscrizioni

```bash
openssl rand -base64 32                  # genera un segreto lungo: copialo e conservalo (gestore di password)
npx wrangler secret put ADMIN_TOKEN      # incolla il segreto quando lo chiede
```

Finché `ADMIN_TOKEN` non è impostato la rotta `/v1/admin/signups` risponde 404, come se non esistesse. Per spegnerla di nuovo: `npx wrangler secret delete ADMIN_TOKEN`.

### Cosa NON impostare in produzione

`ALLOW_TEST_TOKENS` (accetta token finti `test:<uid>:<nome>`): sta solo nel file `.dev.vars`, che è ignorato da git e da `wrangler deploy`.
Controllo: `npx wrangler secret list` non deve mostrarlo e `wrangler.jsonc` non lo contiene.

## 4. Deploy

```bash
npm run typecheck && npm test            # prove in locale (vedi sotto)
npx wrangler deploy                      # pubblica su https://atlas.<tuo-sottodominio>.workers.dev
curl https://atlas.<tuo-sottodominio>.workers.dev/v1/health
```

Verifica rapida dell'iscrizione pubblica (usa un indirizzo di prova tuo, poi cancellalo come al punto 7):

```bash
curl -X POST https://atlas.<tuo-sottodominio>.workers.dev/v1/signups \
  -H 'Content-Type: application/json' \
  -d '{"appId":"addiofa","email":"tuonome@mail.polimi.it","scuola":"icat","sede":"leonardo","livello":"triennale","corso":"Ingegneria Civile","anno":1,"provenienza":"amici","consensi":{"noi":false,"atlas":false,"comunicazioni":false},"consentVersion":"iscrizione-2026-10-16"}'
# risposta attesa: {"ok":true}  (senza "nome" il Worker lo ricava dall'email: tuonome -> "Tuonome")
```

## 5. Lato app (sito)

L'app legge l'indirizzo del Worker e la configurazione Firebase da variabili Vite, impostate **al momento della build** (non sono segreti: finiscono nel codice del sito).
Se non c'è `VITE_ATLAS_API_URL` l'app mostra «non collegato» e tiene i dati nel dispositivo.

```bash
VITE_ATLAS_API_URL=https://atlas.<tuo-sottodominio>.workers.dev
VITE_FIREBASE_API_KEY=<apiKey di app/firebase-applet-config.json>
VITE_FIREBASE_AUTH_DOMAIN=mimetic-resolver-7szp9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mimetic-resolver-7szp9
VITE_FIREBASE_APP_ID=<appId di app/firebase-applet-config.json>
```

I nomi esatti vanno allineati con quelli che legge il codice dell'app (`app/src/lib/`); il valore di `VITE_FIREBASE_PROJECT_ID` deve essere uguale a `FIREBASE_PROJECT_ID` del Worker, altrimenti ogni login dà 401 «aud non valido».
Poi `npm run build` dall'app e ripubblica il sito (vedi `app/DEPLOY.md`).

### Firebase Authentication (console Firebase, progetto `mimetic-resolver-7szp9`)

1. **Authentication → Sign-in method → Google → Abilita** (scegli l'email di assistenza del progetto e salva).
2. **Authentication → Settings → Authorized domains → Add domain**: aggiungi il dominio del sito (es. `addiofa.example`, e quello `*.pages.dev` se lo usi). `localhost` c'è già per lo sviluppo.
3. Consigliato: nella console Google Cloud, limita la chiave API Firebase ai referrer HTTP del sito (la chiave non è segreta, ma così non la usa nessun altro).

## 6. Iscrizioni: come esportarle

```bash
export ADMIN_TOKEN='...il segreto del punto 3...'
export ATLAS=https://atlas.<tuo-sottodominio>.workers.dev

curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/signups?formato=csv"  -o iscrizioni.csv
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/signups?formato=json" -o iscrizioni.json
# solo chi ha dato il consenso «comunicazioni»:
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/signups?formato=csv&comunicazioni=1" -o contatti.csv
# per percorso di studi (i filtri si combinano): scuola = ing-ind-inf | icat | auic | design, livello = triennale | magistrale | ciclo-unico
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/signups?formato=csv&scuola=icat&livello=magistrale" -o icat-magistrale.csv
```

Il segreto va nell'header `Authorization`, mai nell'indirizzo (nell'URL verrebbe rifiutato). Il file ha come colonne `id, email, nome, app, scuola, sede, livello, corso, anno, provenienza, consenso_noi, consenso_atlas, consenso_comunicazioni, versione_consenso, email_verificata, project_id, creato, aggiornato` (UTF-8 con BOM, si apre in Excel e Fogli; le celle che inizierebbero con `=`, `+`, `-`, `@` sono precedute da un apice, per non farle eseguire come formule).
Le colonne `scuola`, `sede`, `livello`, `corso`, `anno` e `provenienza` sono facoltative e possono essere vuote (iscrizioni fatte prima della 0003 o senza percorso indicato); `sede` e `provenienza` nelle righe vecchie possono essere testo libero. Per uso marketing contano solo le righe con `consenso_comunicazioni = 1`. Il file contiene dati personali: non va nel repository né in chat.

Senza il comando curl, dalla riga di comando del database: `npx wrangler d1 execute atlas --remote --command "SELECT email, nome, corso, sede, consenso_comunicazioni FROM signups ORDER BY id"`.

## 7. Cancellare i dati di una persona su richiesta

Non esiste una cancellazione pubblica via API (`DELETE /v1/signups` risponde 405): senza verificare l'email, chiunque potrebbe cancellare l'iscrizione di un altro.

- **Chi ha il Project ID (login Google)**: da solo, con `DELETE /v1/me`. Cancella account, collegamenti, registro dei consensi, punteggi NOI **e l'iscrizione collegata** con il suo registro. `GET /v1/me/export` scarica prima una copia di tutto.
- **Chi si è solo iscritto con nome ed email**: lo fa l'autore, dopo aver verificato che la richiesta arrivi davvero da quell'indirizzo (rispondendo a quell'email). Sostituisci l'indirizzo, minuscolo, in tutti e tre i comandi:

```bash
EMAIL='nome.cognome@mail.polimi.it'
npx wrangler d1 execute atlas --remote --command "SELECT id, email, nome, account_id FROM signups WHERE email = '$EMAIL'"
npx wrangler d1 execute atlas --remote --command "DELETE FROM consent_log WHERE signup_id IN (SELECT id FROM signups WHERE email = '$EMAIL' AND account_id IS NULL)"
npx wrangler d1 execute atlas --remote --command "DELETE FROM signups WHERE email = '$EMAIL' AND account_id IS NULL"
```

  Se la SELECT mostra un `account_id`, quella persona ha un Project ID: l'iscrizione si toglie con `DELETE /v1/me` (o cancellando l'account: `DELETE FROM accounts WHERE id = '<account_id>'` dopo `DELETE FROM signups WHERE account_id = '<account_id>'`).
- Controlla il risultato con la stessa SELECT (zero righe). Le richieste di cancellazione vanno evase entro un mese (GDPR).
- Le righe di `rate_limit` (impronta dell'IP, non l'IP) si cancellano da sole dopo un'ora.

## 8. Prove in locale

```bash
npm run typecheck
npm test            # avvia due Worker veri con `wrangler dev --local` e D1 locale in una cartella temporanea; ~20 s
```

Non serve account Cloudflare né rete. Sviluppo a mano: copia `.dev.vars.example` in `.dev.vars`, poi `npm run migrate:local` e `npm run dev` (http://localhost:8787).

## 9. Cosa non è ancora verificato (e non va scritto come verificato)

- **L'email PoliMi non è verificata.** Il Worker controlla solo formato e dominio (`@polimi.it`, `@mail.polimi.it`, `@…polimi.it`); `email_verificata` vale sempre 0. Chiunque può iscrivere l'indirizzo di un altro studente. Serve un invio di posta con codice (non c'è un servizio di posta collegato) per poter dire «verificata».
- **Il consenso «comunicazioni» è registrato ma non provato dal titolare dell'indirizzo.** Prima di una campagna vera conviene un'email di conferma (double opt-in) a ciascun indirizzo.
- **Il collegamento iscrizione ↔ Project ID si fida dell'email indicata dall'utente**: chi indica per primo `x@polimi.it` si prende l'iscrizione ancora libera (e ne vede nome, corso, sede). Una volta collegata, il modulo pubblico non la modifica più.
- **Limite di richieste per IP**: 10 al minuto sulle iscrizioni, 20 sull'esportazione; protegge da abusi semplici, non da chi usa molti indirizzi IP. Valori in `SIGNUP_RATE_LIMIT` e nel codice.
- Il login Google prova solo l'account Google, non l'appartenenza al Politecnico.
- Mai provato contro Cloudflare vero né con ID token Firebase veri (le prove usano i token `test:` e controllano che i token falsi diano 401); la verifica della firma resta il codice originale di `src/auth.ts`.
- Per la privacy servono ancora titolare del trattamento e informativa; il testo legale è nel sito, una revisione di un professionista resta consigliata.
