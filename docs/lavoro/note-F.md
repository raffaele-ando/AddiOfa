# Note agente F: server `pass/`

## Cosa ho fatto

Worker `addiofa-pass` in `pass/` (TypeScript, nessuna dipendenza di esecuzione): tutte le rotte del brief, migrazione D1 `0001_init.sql` con le 11 tabelle piu' `questions` con lo schema esatto, `wrangler.jsonc` senza segreti, `README.md`, `DEPLOY.md`, `tests/smoke.mjs` (17 prove, tutte passate in locale), `tests/seed-prova.sql` (5 domande), `tests/seed-esteso.mjs` (generatore da 40 domande per le soglie 30/30), `tests/dev.vars.example`.

Verificato: `npm run typecheck` pulito; `wrangler dev --local` con D1 locale; `wrangler deploy --dry-run` costruisce. Le soglie reali (25/30 ente, 24/30 TENG, 24 giuste + 6 sbagliate = 22,5) provate con il banco esteso. Fuori tempo provato ritoccando `started_at` con `wrangler d1 execute`. Dettagli di cosa NON e' provato in `pass/DEPLOY.md`.

## Scelte da sapere

- Risposte di `q/batch`: `{ questions: [...] }` (l'ApiProvider deve estrarre l'array). 403 con `blocked: [id]`.
- Simulazione gratuita: solo `ente`, una volta, **solo domande del nucleo** (altrimenti le spiegazioni a pagamento uscirebbero gratis). Aperta e non consegnata, si riprende con la stessa sessione.
- Fuori tempo (15 min + 20 s dall'avvio, orologio del server): `passed: false`, `timedOut: true`, punteggio comunque calcolato.
- `ExamResult` ha due campi in piu' del contratto: `timedOut`, `elapsedSeconds`.
- Il dispositivo anonimo e' salvato come hash. Un token nuovo + `X-Device` di un utente anonimo lo trasforma in account; se l'account esiste gia', niente unione dei dati.
- Checkout: il corpo deve avere `{ terms: true, waiver: true }`; le date finiscono nei metadati Stripe e poi in `orders.consent_ts/waiver_ts`. Risponde `{ url }`.
- Cancellazione account: ordini e richieste di recesso restano (obbligo di legge), senza legame con l'utente. Va scritto nell'informativa privacy.
- Gli inviti usano `users.diag_seconds` (durata dichiarata dal client) e `users.verified_email UNIQUE`. Un solo Pass `invite` per utente (indice unico).

## Trovato provando con il seed vero

`pass/seed.sql` (616 domande, 100 nel nucleo) applicato su un D1 locale pulito: la simulazione `ente` gratuita esce con 30 domande del nucleo e 4 opzioni, le domande non del nucleo danno 403. **Nessuna domanda ha `extra_option`**: finche' non ce ne sono almeno 30, `exam/start` per `teng` risponde `503 bank_too_small`. Il contenuto va completato dal generatore. (`tests/smoke.mjs` usa gli id T001-T005 di `seed-prova.sql`: non gira sul seed vero.)

## Cosa non mi convince

- Identita' anonima = chiave portatrice: facile da aggirare per la simulazione gratuita, e un Pass pagato da anonimo si perde con i dati del browser. Meglio spingere l'accesso con Google prima del pagamento.
- La durata del diagnostico e' dichiarata dall'app, quindi falsificabile.
- Il Checkout non emette fattura ne' gestisce l'IVA; il recesso si salva ma non parte nessuna email di conferma.
- La creazione di una sessione Stripe e l'invio Resend non sono mai riusciti davvero (mancano chiavi): vedi DEPLOY.md.

## Richieste ad altri

- **Agente dell'ApiProvider / A**: mandare `X-Device` (32+ caratteri esadecimali da `crypto.getRandomValues`, nel `localStorage`) su ogni chiamata e `Authorization: Bearer` quando c'e' il login; trattare `403 pass_required` chiamando `onNeedPass`; gli errori sono `{error, message}`.
- **`app/src/access/provider.ts`**: `TrackEvent` `diag_done` non ha la durata. Per far contare gli inviti serve `seconds?: number` (con l'identita' nelle intestazioni solo per quell'evento). Senza, nessun invito risultera' mai "verificato".
- **Generatore dei contenuti**: `pass/seed.sql` con `DELETE FROM questions;` seguito dagli `INSERT`; `options` array JSON di 4 stringhe, `extra_option` per il TENG, `core = 1` per le ~100 del nucleo, id conformi a `^[\w.:-]{1,80}$`. Servono almeno 30 domande con `extra_option` per il TENG (e 30 nel nucleo, o il formato gratuito rispondera' 503 `bank_too_small`).
- **Chi coordina**: `INVITE.inviteeDiscountPct` (20%) non e' implementato lato server: il brief non lo chiedeva. Se resta nel prodotto serve una regola per il prezzo del Checkout. Il file `app/.env.example` va aggiornato con `VITE_API_URL` e `VITE_MODE` (non l'ho toccato).
- `app/src/config/offer.ts`: se cambiano `FORMATS`, `INVITE` o i prezzi, aggiornare `pass/src/formats.ts` e `pass/wrangler.jsonc` (copie manuali).
