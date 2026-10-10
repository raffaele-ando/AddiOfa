# Mettere online AddiOFA Pass

Tutti i comandi si lanciano da `pass/`. Serve un account Cloudflare (gratuito basta) e Node 20 o piu' recente.

## 1. Accesso e database

```bash
cd pass
npm ci
npx wrangler login                              # si apre il browser, una volta sola
npx wrangler d1 create addiofa-pass --location weur
```

Il comando stampa un blocco con `database_id`. Copia l'id in `wrangler.jsonc`, al posto di `DA_CREARE`:

```jsonc
"d1_databases": [{ "binding": "DB", "database_name": "addiofa-pass", "database_id": "<ID STAMPATO>", "migrations_dir": "migrations" }]
```

## 2. Tabelle e domande

```bash
npx wrangler d1 migrations apply addiofa-pass --remote
npx wrangler d1 execute addiofa-pass --remote --file=seed.sql      # il banco domande (lo genera il generatore dei contenuti)
```

`seed.sql` va rifatto e riapplicato a ogni cambio dei contenuti. Se il file e' molto grande e il comando fallisce, spezzalo in piu' file.

## 3. Origini consentite

In `wrangler.jsonc`, `vars.ALLOWED_ORIGINS`: elenco separato da virgole con l'indirizzo pubblico dell'app (senza barra finale), per esempio `"https://addiofa.example.com,http://localhost:5173"`. Se manca, il browser blocca tutte le chiamate dell'app.

## 4. Segreti (non vanno nel file)

```bash
npx wrangler secret put STRIPE_SECRET            # chiave segreta Stripe (sk_live_... o sk_test_...)
npx wrangler secret put STRIPE_WEBHOOK_SECRET    # whsec_... dal passo 6
npx wrangler secret put EMAIL_API_KEY            # chiave di Resend; senza, gli inviti rispondono 501
```

Per le email imposta anche `vars.EMAIL_FROM` con un mittente di un dominio verificato su Resend. Per Brevo cambia le poche righe commentate in `src/email.ts`.

## 5. Pubblicazione

```bash
npx wrangler deploy
```

Stampa l'indirizzo, del tipo `https://addiofa-pass.<tuo-sottodominio>.workers.dev`. Controllo: `curl https://addiofa-pass.<tuo-sottodominio>.workers.dev/v1/health` deve rispondere `{"ok":true,"service":"addiofa-pass"}`.

## 6. Collegare l'app

Nell'ambiente di build dell'app (file `.env` in `app/`, non committato):

```
VITE_API_URL=https://addiofa-pass.<tuo-sottodominio>.workers.dev
VITE_MODE=prod
```

e ricostruisci e ripubblica l'app. Senza `VITE_API_URL` l'app resta in demo, con i dati sul dispositivo.

## 7. Stripe (solo quando hai la partita IVA e tutto il resto e' pronto)

1. In Stripe (prima in modalita' di prova): Impostazioni > Dettagli pubblici, inserisci l'indirizzo dei **Termini di servizio**: senza, il pagamento con la casella dei termini non si apre.
2. Sviluppatori > Webhook > Aggiungi endpoint: URL `https://addiofa-pass.<tuo-sottodominio>.workers.dev/v1/stripe/webhook`, eventi `checkout.session.completed` e `checkout.session.async_payment_succeeded`.
3. Copia il "Segreto di firma" (`whsec_...`) e salvalo: `npx wrangler secret put STRIPE_WEBHOOK_SECRET`.
4. Prova con una carta di prova (4242 4242 4242 4242) in modalita' di prova prima di passare alle chiavi reali.
5. Accendi i pagamenti: in `wrangler.jsonc` metti `"PAYMENTS_ENABLED": "true"` e rilancia `npx wrangler deploy`. Poi, nell'app, il pulsante d'acquisto deve chiamare `POST /v1/checkout` con `{ "terms": true, "waiver": true }` (vedi README).
6. Per tornare indietro: `"PAYMENTS_ENABLED": "false"` e di nuovo `deploy`. Il webhook continua a registrare i pagamenti gia' avviati.

Prima di vendere servono anche: informativa privacy e termini rivisti da un professionista, gestione di IVA e fatture (il Checkout creato qui non emette fatture), e un modo per rispondere alle richieste di recesso (qui si salvano, non parte nessuna email di conferma).

## Cosa NON e' stato provato

Provato in locale (Miniflare + D1 locale, 17 prove in `tests/smoke.mjs`): rotte, accessi, domande, simulazioni e punteggi, webhook con firma calcolata nel test, lista d'attesa, inviti con codice di verifica restituito in risposta, esportazione e cancellazione, limite giornaliero.

**Non provato:**

- **Token Firebase veri.** Il codice di verifica (RS256 con le chiavi di Google) e' copiato da ATLAS ma in locale si sono usati solo i token `test:`. Primo controllo dopo il deploy: accedi dall'app e chiama `/v1/entitlement` con il token.
- **Stripe reale.** La creazione della sessione e' stata provata solo fino al rifiuto di Stripe per chiave finta (la richiesta arriva e ha la forma giusta, ma non ho mai ottenuto un `url` di pagamento). I webhook sono payload scritti a mano secondo la documentazione e firmati nel test con lo stesso algoritmo: non ho visto un evento vero di Stripe.
- **Invio email.** `sendEmail` per Resend non e' mai stato chiamato con una chiave vera.
- **D1 remoto.** Tutto in locale: nessuna misura di tempi, limiti o costi su Cloudflare.
- **Il banco vero.** `seed.sql` non esiste ancora: provato con 5 e con 40 domande finte. Non so quanto tempo richieda la scelta delle domande con migliaia di righe.
- **Limite per indirizzo.** In locale manca `CF-Connecting-IP`: tutti gli indirizzi risultano uguali. Il limite per identita' e' provato (600 richieste).
- **Browser vero.** CORS provato con `fetch` da Node, non da una pagina.
- **Concorrenza.** Doppie richieste simultanee (per esempio due `exam/start` insieme di un utente gratuito) non sono provate: puo' sfuggire una seconda simulazione gratuita.
- **Ritardo nel pagamento / pagamenti asincroni** (SEPA e simili): gestiti nel codice, mai provati.

## Limiti noti (scelte, non errori)

- Il `seed.sql` di oggi (616 domande, 100 nel nucleo) non ha nessuna quinta opzione (`extra_option`): la simulazione TENG risponde `503 bank_too_small` finche' non ce ne sono almeno 30.
- Un utente senza accesso e' un dispositivo: cancellando i dati del browser o cambiando dispositivo si perde il Pass e si riavrebbe una simulazione gratuita. Chi paga dovrebbe accedere con Google; il Checkout non lo impone.
- La durata del diagnostico per gli inviti la dichiara il client: chi smanetta puo' falsarla. La verifica dell'email Polimi resta il freno principale.
- Il tempo limite delle simulazioni si misura sull'orologio del server dall'avvio: se l'app resta in background oltre i 15 minuti e 20 secondi, la simulazione risulta fuori tempo.
