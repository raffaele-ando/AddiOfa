# AddiOFA Pass (server)

Worker Cloudflare con database D1. Serve le domande, sa chi ha il Pass, corregge le simulazioni, raccoglie la lista d'attesa e gestisce inviti e pagamenti. Soddisfa il contratto `DataProvider` di `app/src/access/provider.ts` (la parte `ApiProvider` dell'app).

Nessuna dipendenza di esecuzione: solo `wrangler`, `typescript` e `@cloudflare/workers-types` per lo sviluppo. I comandi per metterlo online sono in [`DEPLOY.md`](./DEPLOY.md), con l'elenco onesto di cosa non e' stato provato.

## Idea in breve

- Le risposte esatte e le spiegazioni **restano sul server**. L'app riceve la domanda senza soluzione e la soluzione solo dopo aver risposto (`/check`) o consegnato la simulazione.
- Il **nucleo gratuito** e' l'insieme delle domande con `core = 1`. Le altre (`core = 0`) rispondono `403 pass_required` senza il Pass.
- Il **Pass** e' una riga in `entitlements` con scadenza (12 mesi): arriva da Stripe (`source: 'stripe'`) o da 3 inviti verificati (`'invite'`).

## Chi sei

Ogni richiesta che riguarda un utente porta una di queste due identita':

| Intestazione | Valore |
|---|---|
| `Authorization: Bearer <token>` | ID token Firebase (stesso progetto di ATLAS). Si accetta solo con email verificata. |
| `X-Device: <id>` | Identificativo anonimo del dispositivo: 16-64 caratteri alfanumerici. |

Il dispositivo anonimo diventa utente al primo uso. Il server salva solo l'hash dell'identificativo. L'app deve generarlo con `crypto.getRandomValues` (almeno 128 bit, per esempio 32 caratteri esadecimali) e tenerlo nel `localStorage`: chi lo conosce ha accesso a quell'utente, e un identificativo nuovo e' un utente nuovo senza Pass.

Se arrivano insieme un token nuovo e un `X-Device` che era gia' un utente anonimo, quell'utente diventa l'account (con il suo Pass e le sue simulazioni). Se l'account esisteva gia', i dati del dispositivo non vengono uniti.

## Rotte

Gli errori hanno sempre la forma `{ "error": "codice", "message": "testo in italiano" }`. Codici di stato: 400 richiesta non valida, 401 identita' mancante o token non valido, 403 `pass_required` / `email_not_verified`, 404, 409, 429 `rate_limited`, 501 `email_not_configured`, 503 `payments_off`.

| Metodo | Rotta | Identita' | Risposta |
|---|---|---|---|
| GET | `/v1/health` | no | `{ ok, service }` |
| GET | `/v1/entitlement` | si | `{ tier: 'free'\|'pass', source: 'none'\|'stripe'\|'invite'\|'manual', expiresAt: ms\|null }` |
| POST | `/v1/q/batch` `{ ids }` | si | `{ questions: PublicQuestion[] }` (1-100 id; id sconosciuti saltati). Se ce n'e' una con `core = 0` e non c'e' il Pass: `403 pass_required` con `blocked: [id...]` |
| POST | `/v1/q/:id/check` `{ idx }` | si | `{ correct, correctIndex, explanation, theoryId? }`, stesse regole di accesso |
| POST | `/v1/exam/start` `{ format: 'ente'\|'teng' }` | si | `ExamSession` senza risposte. Senza Pass: solo `ente`, una volta, solo domande del nucleo; riaprirla prima della consegna (e nei tempi) restituisce la stessa |
| POST | `/v1/exam/:id/submit` `{ answers, elapsed }` | si | `ExamResult` + `timedOut`, `elapsedSeconds`. `answers` = `{ [idDomanda]: indice\|null }` sull'ordine **mescolato** della sessione |
| POST | `/v1/waitlist` `{ email, audience, consent }` | no | `{ ok, stored: 'server', message }`; idempotente per email, senza `consent: true` risponde `400 consent_required` |
| POST | `/v1/event` `{ name, ... }` | no (vedi sotto) | `{ ok }` |
| POST | `/v1/withdraw` `{ name, email, orderRef? }` | no | `{ receiptId, at, stored: 'server' }` |
| GET | `/v1/me/export` | si | tutti i dati dell'utente in JSON |
| DELETE | `/v1/me` | si | `{ deleted: true }` |
| POST | `/v1/invites` | si | `{ code }` (`OFA-XXXXXX`, uno per utente) |
| GET | `/v1/invites/progress` | si | `{ code\|null, verified, required }` |
| POST | `/v1/invites/redeem` `{ code }` | si | `{ ok, message }` |
| POST | `/v1/invites/verify/start` `{ email }` | si | `{ ok, expiresInSeconds }`; solo `@mail.polimi.it`; `501 email_not_configured` senza `EMAIL_API_KEY` |
| POST | `/v1/invites/verify/confirm` `{ email, code }` | si | `{ ok, verified }` |
| POST | `/v1/checkout` `{ terms: true, waiver: true }` | si | `{ url }` della sessione Stripe; `503 payments_off` se i pagamenti sono spenti |
| POST | `/v1/stripe/webhook` | firma Stripe | `{ received: true }` |

### Simulazioni

- 30 domande scelte dal server, poco simili tra loro (soglia 0,45 come nell'app). Per `teng` solo domande con `extra_option`, che diventa la quinta opzione. Le opzioni sono mescolate dal server e l'ordine mescolato si salva in `exams`.
- Punteggio = esatte - sbagliate x penalita' (0,25 nel TENG). Si supera con `rawCorrect >=` soglia del formato (25 per `ente`, 24 per `teng`) **e** nei tempi: 15 minuti piu' 20 secondi di tolleranza, misurati dall'orologio del server dall'avvio. Fuori tempo `timedOut: true` e `passed: false`; il punteggio si calcola comunque.
- La consegna e' idempotente: una seconda consegna restituisce il primo esito.
- Le costanti dei formati sono copiate in `src/formats.ts`: se cambiano in `app/src/config/offer.ts`, vanno cambiate anche li'.

### Eventi

Nome tra `diag_done`, `paywall_seen`, `waitlist_join`, `sim_started`, `sim_done`, `pass_unlocked` con i campi di `TrackEvent`. Si contano per giorno e nome in `events`, **senza identificativi**. Unica eccezione dichiarata: `diag_done` con `seconds` e un'identita' ricorda sull'utente la durata massima del diagnostico, solo per contare gli inviti.

### Inviti

Un invito conta come verificato quando l'invitato (1) ha confermato un'email `@mail.polimi.it` con il codice a 6 cifre (valido 10 minuti, 5 tentativi, salvato come hash) e (2) ha mandato un `diag_done` di almeno 240 secondi. Un'email conta una sola volta (indice unico); gli alias con `+` sono rifiutati. Con 3 verificati chi ha invitato riceve un Pass `source: 'invite'` di 12 mesi (uno solo). L'invio vero dell'email e' in `src/email.ts` (`sendEmail`, scritto per Resend, da collegare).

### Pagamenti

`POST /v1/checkout` crea una sessione Stripe Checkout (chiamata REST) con prezzo di lancio fino a `LAUNCH_UNTIL` compreso e poi pieno, `client_reference_id` = id utente, `consent_collection[terms_of_service]=required`. Le date di accettazione dei termini e di consenso all'avvio immediato (`terms_ts`, `waiver_ts`) viaggiano nei metadati e il webhook le scrive in `orders.consent_ts` e `waiver_ts`. Il webhook verifica `Stripe-Signature` (HMAC-SHA256, tolleranza 5 minuti), e' idempotente (id ordine = id sessione, indice unico su `entitlements.order_id`) e su pagamento riuscito scrive `orders` ed `entitlements` (12 mesi).

### Limiti

Un massimo giornaliero per identita' (600, `DAILY_LIMIT`) e per indirizzo (3000, `IP_DAILY_LIMIT`) sulle rotte di domande ed esami, e limiti piu' bassi per indirizzo su lista d'attesa, recesso ed eventi. L'indirizzo non si salva: si conserva un hash che cambia ogni giorno. Per un vero argine agli abusi serve anche una regola di rate limiting di Cloudflare davanti al Worker.

### Dati

`DELETE /v1/me` toglie utente, Pass, simulazioni, inviti, codici di verifica e riga in lista d'attesa. **Restano**, staccati dall'utente, gli ordini e le richieste di recesso (obblighi fiscali e di tutela del consumatore): va scritto nell'informativa privacy.

## Sviluppo locale

```bash
cd pass
npm install
cp tests/dev.vars.example .dev.vars            # token di prova, esami corti, codice email in risposta: solo in locale
npx wrangler d1 migrations apply addiofa-pass --local
npx wrangler d1 execute addiofa-pass --local --file=tests/seed-prova.sql   # 5 domande di prova
npm run dev                                    # http://127.0.0.1:8787
npm test                                       # in un altro terminale: prova di fumo (17 prove)
npm run typecheck
```

Con `ALLOW_TEST_TOKENS=true` il token `test:<uid>:<email>` (o `test:<uid>:<email>:unverified`) sostituisce un token Firebase. Con `DEV_RETURN_CODE=true` `verify/start` restituisce il codice invece di mandare l'email. Con `ALLOW_SHORT_EXAMS=true` le simulazioni possono avere meno di 30 domande (il banco di prova ne ha 5). Nessuna di queste tre variabili va mai impostata in produzione.

Per provare le soglie 30/30: `node tests/seed-esteso.mjs > /tmp/s.sql && npx wrangler d1 execute addiofa-pass --local --file=/tmp/s.sql`, poi `npm test`.

## Il banco domande

La tabella `questions` ha lo schema fissato in `migrations/0001_init.sql`; la riempie il generatore dei contenuti con `pass/seed.sql` (non ancora presente). `options` e' un array JSON di stringhe (4 opzioni), `extra_option` la quinta opzione solo per il TENG, `core` 1 per il nucleo gratuito. Gli id devono rispettare `^[\w.:-]{1,80}$`.
