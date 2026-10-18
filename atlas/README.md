# ATLAS

Algoritmo e infrastruttura condivisi dalle app Project: un Worker Cloudflare con database D1.

- **Project ID**: un account unico per tutte le app, creato al primo accesso (Google o link via email, Firebase Auth). Si salvano solo email e identificativo; il @nome utente parte neutro (`studente1234`) e lo cambia l'utente. Nome e foto dell'account Google non si salvano.
- **Consensi**: due, uno per finalità, spenti di partenza e revocabili con un'unica richiesta senza eliminare l'account: la classifica NOI (permesso `noi.leaderboard`) e le comunicazioni (email qualunque, stato `in-attesa` finché non esiste una conferma con link). Ogni concessione, modifica e revoca finisce in `consent_log`, con una sola versione del testo (`CONSENT_VERSION`).
- **Classifica NOI**: punteggi pubblici solo per chi ha acceso la casella. Spenta, il punteggio sparisce subito. In classifica compare solo il @nome utente.
- **Nessuna iscrizione anonima**: `POST /v1/signups` risponde 410. L'app non chiede né invia dati all'avvio (docs/design/PRIVACY-LEGGE.md).

## Stato su Cloudflare

- Database D1 **`atlas`** già creato (id `fae6dddc-a787-474b-9699-e23bab53eb4d`) con lo schema di `migrations/0001_init.sql`. La giurisdizione UE si può impostare solo alla creazione del database: vedi `DEPLOY.md` §1 (se il database esistente non è in giurisdizione UE, va ricreato prima di pubblicare).
- Il Worker **non è ancora pubblicato**. Passi esatti (migrazioni fino a `0004_consensi_unificati.sql`, segreto `ADMIN_TOKEN`, `ALLOWED_ORIGINS`, Firebase, variabili dell'app, esportazione e cancellazione dei dati): **`DEPLOY.md`**.

## Sviluppo locale

```bash
cp .dev.vars.example .dev.vars                   # solo in locale: accetta token "test:<uid>:<nome>"
npm run migrate:local
npm run dev                                      # http://localhost:8787
curl -H 'Authorization: Bearer test:u1:Mario' localhost:8787/v1/me
```

`ALLOW_TEST_TOKENS` non va mai impostato in produzione. Prove automatiche (Worker vero con `wrangler dev --local`): `npm test`.

## API

Tutte le rotte con `(auth)` vogliono `Authorization: Bearer <ID token Firebase>`.

| Metodo | Rotta | Cosa fa |
|---|---|---|
| GET | `/v1/health` | Stato del servizio |
| GET | `/v1/scopes` | Permessi disponibili e versione del testo dei consensi |
| POST | `/v1/signups` | Non esiste più: risponde 410 |
| GET | `/v1/admin/comunicazioni?formato=csv\|json` | Solo l'autore: `Authorization: Bearer <ADMIN_TOKEN>`; senza `ADMIN_TOKEN` impostato risponde 404; `&stato=confermato` per i soli confermati (oggi nessuno) |
| GET | `/v1/me` (auth) | Project ID (creato al primo accesso), app collegate e `consensi: { noi, comunicazioni }` |
| PATCH | `/v1/me` (auth) | Cambia `handle` (3-20 caratteri a-z 0-9 _ .) e/o `consensi: { noi?, comunicazioni? }`; accendendo le comunicazioni serve `comunicazioniEmail`. Un campo che non conosce è un errore 400 |
| DELETE | `/v1/me` (auth) | Elimina account, collegamenti, registro dei consensi, punteggi e l'email delle comunicazioni |
| GET | `/v1/me/export` (auth) | Copia di tutti i dati (account, consensi, registro, collegamenti, punteggi) |
| PUT | `/v1/links/:app` (auth) | Concede o modifica i permessi: `{ scopes, consentVersion }`, `profile` obbligatorio |
| DELETE | `/v1/links/:app` (auth) | Scollega l'app e cancella i suoi punteggi |
| POST | `/v1/noi/:app/score` (auth) | Aggiorna il punteggio: `{ mastered, bestSim }`, serve `noi.leaderboard` |
| GET | `/v1/noi/:app/leaderboard` | Classifica pubblica (solo @nome utente); con il token include la tua posizione |

Punteggio NOI = domande imparate × 100 + miglior simulazione: vince chi sa più regole, a parità chi ha fatto la simulazione migliore.

## Permessi

| Permesso | Obbligatorio | Significato |
|---|---|---|
| `profile` | sì | L'account stesso (email e identificativo): servizio richiesto, non è un consenso |
| `noi.leaderboard` | no | @nome utente, domande imparate e miglior simulazione visibili in classifica |

«Personalizzazione ATLAS» e `progress.share` non esistono più: nessun codice li usava. Si aggiungono quando esisterà il trattamento, con una casella dedicata.
Cambiando i testi dei consensi, aumenta `CONSENT_VERSION` in `src/scopes.ts` e in `app/src/config/ecosystem.ts`.

## Limiti da sapere

- I punteggi sono inviati dall'app, quindi chi smanetta può gonfiarli entro i limiti validati (≤ 5000 imparate, ≤ 30/30). Per una classifica a prova di trucchi il calcolo va spostato sul server insieme alle risposte.
- **La conferma con link delle comunicazioni non esiste**: non c'è un servizio di posta collegato. Il consenso resta `in-attesa` e nessun messaggio parte. Prima di scrivere a qualcuno serve l'invio dei link di conferma e, in ogni messaggio, il link di disiscrizione.
- Per il GDPR servono un titolare indicato per nome e un recapito vero in `app/src/config/offer.ts` (`TITOLARE`, `CONTACT_EMAIL`): finché mancano, i testi non nominano nessuno.
