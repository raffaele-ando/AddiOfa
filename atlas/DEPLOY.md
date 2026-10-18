# ATLAS: come si pubblica

Worker Cloudflare + database D1 `atlas` (id `fae6dddc-a787-474b-9699-e23bab53eb4d`, già creato; vedi la giurisdizione UE al punto 1).
Tutti i comandi si lanciano da `atlas/`. Il Worker non è ancora pubblicato: da questa sessione non c'è accesso a Cloudflare.

## 1. Prima volta

```bash
cd atlas
npm ci
npx wrangler login                       # una volta sola, apre il browser
npx wrangler d1 list                     # controlla che compaia "atlas" con l'id sopra
```

**Giurisdizione UE.** L'informativa dice che il database è in giurisdizione dell'Unione europea, e questo si imposta solo alla creazione. Controlla in dashboard Cloudflare (D1 › atlas) la giurisdizione del database esistente; se non è UE, prima di pubblicare (il database è ancora vuoto) ricrealo:

```bash
npx wrangler d1 create atlas --jurisdiction eu     # poi copia il nuovo database_id in wrangler.jsonc
```

Se non puoi garantirlo, togli la riga corrispondente da `app/src/legal/privacy.ts` («creato con giurisdizione nell'Unione europea»): il testo non deve dire una cosa non vera.

## 2. Migrazioni sul database vero

```bash
npx wrangler d1 migrations list atlas --remote     # cosa manca
npx wrangler d1 migrations apply atlas --remote    # applica 0002, 0003 e 0004 (la 0001 è già applicata)
```

`0002_signups.sql` e `0003_percorso_studi.sql` sono storiche (iscrizione anonima, poi abbandonata). `0004_consensi_unificati.sql` toglie dalla tabella `signups` le colonne di percorso e provenienza,
toglie `accounts.polimi_email` e aggiunge all'account il consenso alle comunicazioni (`comunicazioni_email`, `comunicazioni_stato`, `comunicazioni_at`). Se il database è nuovo e vuoto non perde niente.
La tabella `signups` resta ma nessuna riga viene più scritta: se non serve, la si cancella a mano (`DROP TABLE signups`) dopo aver controllato che sia vuota.
Fai comunque un backup prima:

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

### Segreto dell'autore per scaricare l'elenco delle comunicazioni

```bash
openssl rand -base64 32                  # genera un segreto lungo: copialo e conservalo (gestore di password)
npx wrangler secret put ADMIN_TOKEN      # incolla il segreto quando lo chiede
```

Finché `ADMIN_TOKEN` non è impostato la rotta `/v1/admin/comunicazioni` risponde 404, come se non esistesse. Per spegnerla di nuovo: `npx wrangler secret delete ADMIN_TOKEN`.

### Cosa NON impostare in produzione

`ALLOW_TEST_TOKENS` (accetta token finti `test:<uid>:<nome>`): sta solo nel file `.dev.vars`, che è ignorato da git e da `wrangler deploy`.
Controllo: `npx wrangler secret list` non deve mostrarlo e `wrangler.jsonc` non lo contiene.

## 4. Deploy

```bash
npm run typecheck && npm test            # prove in locale (vedi sotto)
npx wrangler deploy                      # pubblica su https://atlas.<tuo-sottodominio>.workers.dev
curl https://atlas.<tuo-sottodominio>.workers.dev/v1/health
```

Verifica rapida (senza token l'account non si crea, quindi bastano queste due):

```bash
curl https://atlas.<tuo-sottodominio>.workers.dev/v1/scopes                 # permessi e versione dei testi
curl -X POST https://atlas.<tuo-sottodominio>.workers.dev/v1/signups -d '{}'  # risposta attesa: 410 (l'iscrizione anonima non esiste più)
```

## 5. Lato app (sito)

L'app legge l'indirizzo del Worker e la configurazione Firebase da variabili Vite, impostate **al momento della build** (non sono segreti: finiscono nel codice del sito).
Se non c'è `VITE_ATLAS_API_URL` l'app mostra «non collegato» e tiene i dati nel dispositivo. Anche con tutto collegato, all'avvio l'app non contatta né ATLAS né Google: succede solo dopo un gesto (accesso, casella della classifica, casella delle comunicazioni).

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

1. **Authentication → Sign-in method → Google → Abilita** (scegli l'email di assistenza del progetto e salva). Abilita anche **Email/Password → Link via email (accesso senza password)**: serve a «Accedi con email» e alla verifica del badge «studente PoliMi».
2. **Authentication → Settings → Authorized domains → Add domain**: aggiungi il dominio del sito (es. `addiofa.example`, e quello `*.pages.dev` se lo usi). `localhost` c'è già per lo sviluppo.
3. Consigliato: nella console Google Cloud, limita la chiave API Firebase ai referrer HTTP del sito (la chiave non è segreta, ma così non la usa nessun altro).

## 6. Comunicazioni: come esportarle

```bash
export ADMIN_TOKEN='...il segreto del punto 3...'
export ATLAS=https://atlas.<tuo-sottodominio>.workers.dev

curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/comunicazioni?formato=csv"  -o comunicazioni.csv
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/comunicazioni?formato=json" -o comunicazioni.json
# solo chi ha confermato con il link (oggi nessuno: la conferma non esiste ancora, vedi il punto 9):
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/comunicazioni?formato=csv&stato=confermato" -o confermati.csv
```

Il segreto va nell'header `Authorization`, mai nell'indirizzo. Il file ha come colonne `project_id, email_comunicazioni, stato, consenso_dal, creato` (UTF-8 con BOM; le celle che inizierebbero con `=`, `+`, `-`, `@` sono precedute da un apice). **Non si scrive a nessuno finché lo stato è `in-attesa`.** Il file contiene dati personali: non va nel repository né in chat.

## 7. Cancellare i dati di una persona su richiesta

- **Chi ha il Project ID**: da solo, con «Elimina Project ID» nell'app (`DELETE /v1/me`). Cancella account, collegamenti, registro dei consensi, punteggio NOI ed email delle comunicazioni. `GET /v1/me/export` scarica prima una copia di tutto.
- **Chi vuole solo non ricevere più le comunicazioni**: spegne la casella in «Project ID › Comunicazioni» (l'indirizzo si cancella subito).
- **Chi scrive al recapito del titolare senza avere un account**: dopo aver verificato che la richiesta arrivi da quell'indirizzo. Sostituisci l'indirizzo, minuscolo:

```bash
EMAIL='persona@example.com'
npx wrangler d1 execute atlas --remote --command "SELECT id FROM accounts WHERE comunicazioni_email = '$EMAIL'"
npx wrangler d1 execute atlas --remote --command "DELETE FROM accounts WHERE comunicazioni_email = '$EMAIL'"
```

- Controlla il risultato con la stessa SELECT (zero righe). Le richieste di cancellazione vanno evase entro un mese (GDPR).
- Le righe di `rate_limit` (impronta dell'IP, non l'IP) si cancellano da sole dopo un'ora.

## 8. Prove in locale

```bash
npm run typecheck
npm test            # avvia due Worker veri con `wrangler dev --local` e D1 locale in una cartella temporanea; ~20 s
```

Non serve account Cloudflare né rete. Sviluppo a mano: copia `.dev.vars.example` in `.dev.vars`, poi `npm run migrate:local` e `npm run dev` (http://localhost:8787).

## 9. Cosa non è ancora verificato (e non va scritto come verificato)

- **La conferma con link delle comunicazioni non esiste.** Non c'è un servizio di posta collegato: il consenso resta `in-attesa` e nessun messaggio parte. Prima di una campagna vera servono l'invio del link di conferma (double opt-in) e, in ogni messaggio, il link di disiscrizione e il titolare.
- **L'email PoliMi non arriva ad ATLAS.** Il badge «studente PoliMi» si ottiene sul dispositivo con un link di Firebase e non è registrato sul server: il server non può dire chi è studente.
- **Limite di richieste per IP**: 20 al minuto sulle rotte admin; protegge da abusi semplici, non da chi usa molti indirizzi IP.
- Il login non prova l'appartenenza al Politecnico.
- Mai provato contro Cloudflare vero né con ID token Firebase veri (le prove usano i token `test:` e controllano che i token falsi diano 401); la verifica della firma resta il codice originale di `src/auth.ts`.
- Prima di pubblicare servono titolare con nome e recapito in `app/src/config/offer.ts` e la giurisdizione UE del database (punto 1). Una revisione di un professionista resta consigliata.
