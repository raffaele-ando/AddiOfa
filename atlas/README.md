# ATLAS

Algoritmo e infrastruttura condivisi dalle app Project: un Worker Cloudflare con database D1.

- **Project ID**: un account unico per tutte le app, creato al primo accesso dal login Google (Firebase Auth).
- **Collegamenti tra app**: un'app può leggere o condividere dati solo dopo il consenso, permesso per permesso. Ogni concessione, modifica e revoca finisce in `consent_log`.
- **Classifica NOI**: punteggi pubblici solo per chi ha dato il permesso `noi.leaderboard`. Revocato il permesso, il punteggio sparisce subito.

## Stato su Cloudflare

- Database D1 **`atlas`** già creato (id `fae6dddc-a787-474b-9699-e23bab53eb4d`, Europa occidentale) con lo schema di `migrations/0001_init.sql` già applicato.
- Il Worker **non è ancora pubblicato**: da qui non avevo modo di fare il deploy. Basta un comando:

```bash
cd atlas
npm ci
npx wrangler login        # una volta sola
npx wrangler deploy       # pubblica su https://atlas.<tuo-sottodominio>.workers.dev
```

Poi, nell'app, imposta `VITE_ATLAS_API_URL` con quell'indirizzo (vedi `app/.env.example`) e ripubblica l'app.

## Sviluppo locale

```bash
printf 'ALLOW_TEST_TOKENS=true\n' > .dev.vars   # solo in locale: accetta token "test:<uid>:<nome>"
npm run migrate:local
npm run dev                                      # http://localhost:8787
curl -H 'Authorization: Bearer test:u1:Mario' localhost:8787/v1/me
```

`ALLOW_TEST_TOKENS` non va mai impostato in produzione.

## API

Tutte le rotte con `(auth)` vogliono `Authorization: Bearer <ID token Firebase>`.

| Metodo | Rotta | Cosa fa |
|---|---|---|
| GET | `/v1/health` | Stato del servizio |
| GET | `/v1/scopes` | Permessi disponibili e versione dell'informativa |
| GET | `/v1/me` (auth) | Project ID (creato al primo accesso) e app collegate |
| PATCH | `/v1/me` (auth) | Cambia nome e @nome utente (3-20 caratteri a-z 0-9 _ .) |
| DELETE | `/v1/me` (auth) | Elimina account, collegamenti, consensi e punteggi |
| GET | `/v1/me/export` (auth) | Copia di tutti i dati (account, collegamenti, registro consensi, punteggi) |
| PUT | `/v1/links/:app` (auth) | Concede o modifica i permessi: `{ scopes, consentVersion }`, `profile` obbligatorio |
| DELETE | `/v1/links/:app` (auth) | Scollega l'app e cancella i suoi punteggi |
| POST | `/v1/noi/:app/score` (auth) | Aggiorna il punteggio: `{ mastered, bestSim }`, serve `noi.leaderboard` |
| GET | `/v1/noi/:app/leaderboard` | Classifica pubblica; con il token include la tua posizione |

Punteggio NOI = domande imparate × 100 + miglior simulazione: vince chi sa più regole, a parità chi ha fatto la simulazione migliore.

## Permessi

| Permesso | Obbligatorio | Significato |
|---|---|---|
| `profile` | sì | Nome, foto ed email del Project ID |
| `progress.share` | no | Progressi di studio visibili alle altre app Project |
| `noi.leaderboard` | no | @nome, domande imparate e miglior simulazione visibili in classifica |
| `atlas.personalize` | no | ATLAS usa i dati dell'app per personalizzare le altre app |

Cambiando testi o permessi, aumenta `CONSENT_VERSION` in `src/scopes.ts` e in `app/src/config/ecosystem.ts`: gli utenti rivedranno la schermata di consenso.

## Limiti da sapere

- I punteggi sono inviati dall'app, quindi chi smanetta può gonfiarli entro i limiti validati (≤ 5000 imparate, ≤ 30/30). Per una classifica a prova di trucchi il calcolo va spostato sul server insieme alle risposte.
- Per il GDPR servono ancora l'informativa privacy e un titolare del trattamento indicato: la schermata di consenso è pronta, il testo legale no.
