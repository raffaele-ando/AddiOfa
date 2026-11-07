# ATLAS: come funziona e come si gestisce

ATLAS non è un progetto a parte: è il server del sito. Un solo Worker Cloudflare, `addiofa`, dichiarato in `wrangler.jsonc` alla radice, serve:
- le richieste a `/v1/*` con il codice di `atlas/src/` (iscrizioni, Project ID, classifica NOI, esportazione);
- tutto il resto con i file statici del sito (`app/dist`).

Il database D1 `atlas` (id `fae6dddc-a787-474b-9699-e23bab53eb4d`) è già creato e con le migrazioni 0001-0003 applicate. Per il lancio passo per passo, con i testi da incollare: `docs/GUIDA-LANCIO.md`. Qui sotto solo i riferimenti tecnici.

## 1. Migrazioni (già applicate)

I file sono in `atlas/migrations/`. Se in futuro se ne aggiunge una, dalla console del database (Cloudflare → Storage & Databases → D1 → atlas → Console) si incolla il file, nell'ordine di numerazione. Le migrazioni non cancellano dati.

## 2. Segreti e variabili

- `ADMIN_TOKEN` (segreto): password per scaricare le iscrizioni. Si imposta da Cloudflare: progetto `addiofa` → Settings → Variables and Secrets. Senza di lui le rotte `/v1/admin/*` rispondono 404. Dopo ogni modifica serve un nuovo deploy.
- `ALLOWED_ORIGINS` (in `wrangler.jsonc`): chi può chiamare l'API dal browser da un altro sito. Il sito stesso non ne ha bisogno (stesso indirizzo). Serve `https://localhost` per l'app Android. Mai `*` in produzione.
- `ALLOW_TEST_TOKENS`: NON deve esserci in produzione (accetta token finti `test:<uid>:<nome>`, serve solo in locale con `.dev.vars`).
- `FIREBASE_PROJECT_ID` = `mimetic-resolver-7szp9`: il Worker accetta solo ID token emessi da quel progetto.

## 3. Firebase (login)

Console Firebase, progetto `mimetic-resolver-7szp9`: abilitare Google, Email/Password con «Link via email», e aggiungere il dominio del sito ai domini autorizzati. Le chiavi pubbliche di Firebase sono nel codice del sito: non sono segreti.

## 4. Iscrizioni: come scaricarle

- Pagina nel sito: `https://addiofa.theproject.world/?vista=admin` → password → «Scarica tutte le iscrizioni» (o «Solo chi accetta le email»).
- Da riga di comando (facoltativo): `curl -H "Authorization: Bearer <ADMIN_TOKEN>" "https://addiofa.theproject.world/v1/admin/signups?formato=csv" -o iscrizioni.csv`. Filtri: `&comunicazioni=1`, `&scuola=icat`, `&livello=magistrale`.

Il file CSV contiene dati personali: non va nel repository né in chat.

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
