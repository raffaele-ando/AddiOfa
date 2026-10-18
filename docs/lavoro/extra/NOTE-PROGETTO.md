# NOTE-PROGETTO: funnel senza dati, Project ID, NOI, comunicazioni, Worker, testi legali

Agente PROGETTO. Riscritta il 18/10 dopo l'ordine di riprogettare tutto secondo `docs/design/PRIVACY-LEGGE.md` («all'avvio resta solo il necessario»). Sostituisce le note del 17/10 (funnel con email, nome ricavato, provenienza, consensi e coda): quel funnel non esiste più. Nessun git, nessun file cancellato. Non toccati: `App.tsx`, `Menu.tsx`, `Navigazione.tsx`, `screens/extra/{profilo,sfide,studio}`. Fuori dal perimetro ma toccati per ordine: `atlas/`, `lib/servizi/faq.ts`, `screens/landing/Faq.tsx` e il test `tests/unit/servizi-faq.test.ts` (vedi sotto).

## Che cosa è cambiato

### 1. Il funnel (`components/Onboarding.tsx`)
`pain → gain → (10 domande) → calcolo → risultato`. Niente email, nome, provenienza, corso/sede/anno, caselle, niente invio, niente Firebase, niente coda. `Onboarding.tsx` non importa `firebase`, `atlas`, `coda`, `validazione`, `profilo` (lo controlla una prova). Nella schermata «gain» una riga vera con il link alla privacy: «Non ti chiediamo nessun dato: domande, correzione e progressi restano sul tuo dispositivo. Account, classifica e messaggi sono facoltativi e li trovi in «Project ID»» (`RIGA_APERTURA`, stessa riga in Esplora). Chi ha già fatto il diagnostico e lo riapre salta pain e gain (intro «Diagnostico»).
Provato nell'app costruita: dall'apertura al risultato **0 richieste fuori dal sito** (né ATLAS né Google), localStorage con solo `ofa_polimi_app_state` e `addiofa_diagnostico_ultimo`, `extra.progetto` assente.

### 2. Project ID (`screens/extra/progetto/ProjectId.tsx`, `hooks.ts`, `registrazione.tsx`)
Tutto ciò che è facoltativo sta qui, nell'ordine:
- **Account**: prima la dichiarazione «Ho almeno 14 anni» (non è un consenso, non si salva; `Accedi con Google`/`Accedi con email` restano spenti finché non la si tocca; «Ho meno di 14 anni» mostra la riga del §5.3). Nessuna casella di consenso per creare l'account. Sotto: informativa breve (`INFORMATIVA_ACCOUNT`) e «Informativa completa». «Accedi con email» manda un link Firebase (qualunque indirizzo). Dentro: `@nome utente` + id `PRJ-…` + email, «Cambia @nome utente» (3-20, `a-z 0-9 _ .`, 409 se in uso), Esci, «Elimina Project ID». Esci toglie anche il collegamento locale, così al prossimo avvio Firebase non si carica.
- **Classifica NOI**: riga «Nella classifica: Sì/No» e rimando a NOI.
- **Comunicazioni**: casella dedicata («Voglio ricevere email da Project e Agorà») con campo «Email (anche personale)», spenta di partenza, revoca con un tocco (cancella l'indirizzo). Lo stato è detto com'è: «in attesa di conferma… l'invio del link di conferma oggi non è collegato, quindi non parte nessuna email».
- **Il tuo percorso** (solo dispositivo, «Resta sul tuo dispositivo: non lo inviamo a nessuno»): cascata Scuola → Sede → Livello → Corso → Anno (la stessa logica e gli stessi dati di prima), si può lasciare a metà o togliere; «Come ci hai conosciuto» (4 scelte, toccando di nuovo si toglie; controllo mio con bordo `bordo-campo`, non `ChoiceCard`).
- **Studente PoliMi**: facoltativo, campo email PoliMi + «Verifica con un link»; il badge «Verificata» esiste solo dopo che il link è stato aperto per lo stesso indirizzo (`segnaStudentePoliMi`); solo dispositivo, «Togli il badge». Senza Firebase: «La verifica con link non è disponibile in questa versione».
- **I tuoi dati**: Esporta (testo da copiare: scelte locali + `GET /v1/me/export`), Informativa privacy, Cancella dal dispositivo.
`CompletaProfilo` è ora un redirect alla home (resta registrata perché `App.tsx` la nomina ancora). `serveRegistrazione()` resta, sempre `false`.

### 3. NOI (`Noi.tsx`)
Casella dedicata, non preselezionata, con i testi del §5.3 e `INFORMATIVA_NOI`: «Ti vedranno come @nome utente»; si accende e si spegne con `PATCH /v1/me`; il punteggio si invia (`postScore`) solo se il server dice che si partecipa; spenta, il punteggio sparisce subito (provato) e l'account resta. Senza accesso: «Serve il Project ID». In classifica compare solo `@handle`.

### 4. Dati locali (`lib/progetto/profilo.ts`)
`Profilo = { scuola?, sede?, livello?, corso?, corsoId?, anno?, provenienza?, studentePoliMi?: {email, verificataIl}, aggiornatoIl }`. Niente email, nome, consensi, `completato`. Un salvataggio vecchio (con email/nome/consensi) si rilegge tenendo solo percorso, provenienza e badge (un'email PoliMi segnata «verificata» diventa il badge); alla prima scrittura il resto sparisce. `nomeDaEmail.ts` svuotato (il nome non si ricava più). `coda.ts` è uno stub: `coda.avvia()` non fa richieste e toglie solo la vecchia coda salvata (`addiofa_progetto_coda`, conteneva nome ed email).

### 5. Worker ATLAS (`atlas/`)
- Migrazione **`0004_consensi_unificati.sql`** (toglie le colonne di percorso/provenienza da `signups` e `accounts.polimi_email`; aggiunge `accounts.comunicazioni_email/stato/at`).
- `POST /v1/signups` → **410**. `GET /v1/admin/comunicazioni` (csv/json, `ADMIN_TOKEN`). `PATCH /v1/me` (`handle`, `consensi:{noi,comunicazioni}`, `comunicazioniEmail`; campo sconosciuto = 400). Registro unico `consent_log`, una sola `CONSENT_VERSION = '2026-10-17'` (anche in app). Account con `@studenteNNNN` neutro, niente nome né foto Google; NOI senza `displayName`/avatar. Permessi rimasti: `profile` + `noi.leaderboard`.
- `wrangler.jsonc` senza `SIGNUP_RATE_LIMIT`; `README.md` e `DEPLOY.md` riscritti (migrazioni fino alla 0004, D1 `--jurisdiction eu`, rotta admin, provider Firebase «Link via email», cancellazione per email delle comunicazioni).

### 6. Testi (privacy, termini, cookie, FAQ, informative)
Riscritti secondo §5.4: «senza dati personali» in apertura; dati per servizio; basi (6.1.b account, 6.1.a NOI e comunicazioni con art. 130, 6.1.f sicurezza); «Se non fornisci i dati»; revoca con lo stesso tocco senza eliminare l'account; età 14 anni; Google/Firebase anche negli USA (DPF e clausole tipo); Cloudflare; chiavi del dispositivo senza la coda. **Nessun titolare finto**: `TITOLARE.nome` è `undefined` e il testo dice «l'autore di AddiOFA, una persona fisica. Nome e recapito si indicano in questa pagina prima di collegare ATLAS»; le righe «Titolare»/«Contatto» compaiono solo se `TITOLARE.nome`/`CONTACT_EMAIL` esistono. FAQ: `dati-raccolti` riscritta e nuova «Devo dare l'email del Politecnico?» (No). Data dei testi: 18 ottobre 2026. Nell'app nessun «bozza».

### 7. Colore e forme
`errore-tinta/testo/su` per errori e pulsanti distruttivi, `bordo-campo` su campi, caselle, interruttori, riquadri di scelta, `azione-testo` al posto di `azione-scuro`, `medio-su` sulle medaglie (la terza è corallo con `basso-su`), legenda dell'analisi con forma + parola (cerchio, quadrato, rombo) su `*-numero`. Nessuna sfera o cerchio attorno alle illustrazioni.

## Richieste per `App.tsx` / altri (le fa il coordinatore)
1. **Togliere `serveRegistrazione`** (`App.tsx:22`, `:58`, `:82`) e la schermata `completa-profilo` dal registro quando `App.tsx` smette di nominarla (poi cancellare `CompletaProfilo.tsx`). Finché resta, non fa danni (sempre `false`).
2. **`coda.avvia()`** può restare chiamata all'avvio: non fa rete, ripulisce solo la vecchia coda. Si può togliere (e `coda.ts` cancellare) quando si vuole.
3. **Ritorno dal link** (accesso con email o verifica badge): chi apre il link atterra sulla pagina dell'app con `?mode=signIn&oobCode=…`. Oggi lo completa `ProjectId`/`Noi` solo se si apre quella schermata (hook `useRitornoLink`). Per completarlo all'avvio, in `App.tsx`: `useEffect(() => { void applicaRitornoVerifica(() => appState, aggiornaExtra).then(e => { if (e.tipo === 'ok') toast(...) }); }, [])` e, se `sembraLinkDiAccesso(location.search)`, aprire `projectid`. Senza questo, chi apre il link da posta vede la home e non l'esito finché non va in Project ID (il codice del link resta valido).
4. **`ChoiceCard`** (`components/ui.tsx:102`): il cerchio non selezionato usa `border-linea` (non arriva a 3:1) → `border-bordo-campo`. Non l'ho toccato (file condiviso).
5. **`serveRegistrazione` nei test di App** non esiste: nessuna richiesta.
6. **Landing a 1280 px** (non mia): `controlla-testo` segnala una riga di 6 parole, «Probabilità stimata di superare il test» (landing), chiaro e scuro.
7. **Test fuori perimetro che ho dovuto cambiare**: `tests/unit/servizi-faq.test.ts` vietava «project id» in tutte le FAQ (superato: l'account Project ID è tornato; la voce `dati-raccolti` ordinata dal §5.4 lo nomina). Ho tolto solo quella parola dall'elenco dei termini vietati.

## Prove eseguite (numeri)
- `cd app && npx tsc --noEmit`: 0 errori. `npm test`: **277 prove, 271 ok, 6 saltate**; con il Worker locale acceso (`ATLAS_URL_PROVA=http://localhost:8787 npm test`): **277 ok, 0 saltate** (le 6 contro il Worker vero: account neutro, NOI on/off con punteggio che sparisce, comunicazioni in attesa e revoca, PATCH con campo sconosciuto = 400, POST /v1/signups = 410 e 401 senza token, export e cancellazione con account che riparte da zero).
- `cd atlas && npx tsc --noEmit`: 0 errori. `npm test`: **20 prove ok** (Worker vero con `wrangler dev --local`, migrazioni 0001-0004).
- `npm run check` dalla radice: link, tipi, prove, build ok. `npm run build:demo`: controllo superato; `artifact.html` e `index.html` non contengono host Google (0 occorrenze di `googleapis`, `identitytoolkit`, `firebaseapp`). Il codice di Firebase sta in chunk separati, caricati solo dopo un gesto o aprendo Project ID/NOI con un accesso già presente su quel dispositivo.
- **Funnel dall'app costruita** (`vite build --mode development`, `VITE_ATLAS_API_URL=http://localhost:8787`), landing → pain → gain → 10 domande → calcolo → risultato, a **400 e 1280 px, chiaro e scuro**: 0 richieste esterne, 0 errori in console, 0 overflow, 0 violazioni di contrasto (`controlla-contrasto`), `controlla-testo` 0 nelle mie schermate.
- **Project ID, NOI, Esplora, Agorà, ATLAS** con Worker locale (accesso di prova `?atlasProva=`, solo sviluppo) a 400 e 1280 px, chiaro e scuro: all'apertura di Project ID 0 richieste; senza età le due vie d'accesso sono spente; email sbagliata → errore; accesso → account `studenteNNNN`; comunicazioni senza email → errore, con email → `in-attesa` sul server (provato con `GET /v1/me`), spente → cancellate; cambio @nome (errore locale e successo, letto dal server); percorso completo (Ingegneria Elettronica, Leonardo, triennale, 2° anno) e provenienza salvati solo in `extra.progetto.profilo` (nessuna richiesta di rete); NOI acceso → in classifica con solo `@handle`, spento → sparisce; esporta (testo copiato), cancella dal dispositivo, elimina account (schermate viste). 0 errori in console, 0 overflow, 0 violazioni di contrasto, 0 blocchi sopra 5 parole.
- **Senza ATLAS** (build senza `VITE_ATLAS_API_URL`): Project ID, NOI ed Esplora dicono «non collegato» con una riga vera; percorso e provenienza funzionano; 0 errori.

## Non provato
- **Firebase vero**: accesso con Google, link via email (invio, ritorno, `linkWithCredential`), provider «Link via email» abilitato, dominio autorizzato. Provati solo gli stati dell'interfaccia con l'accesso di prova e le parti pure (`verificaEmail`, con prove).
- **Conferma delle comunicazioni con link e disiscrizione dalla email**: non esistono (nessun servizio di posta). Lo stato resta `in-attesa`, nessun messaggio parte, e lo dicono app, privacy e DEPLOY.
- Cloudflare vero (deploy, CORS di produzione, giurisdizione UE del database), Safari e dispositivi reali, lettore di schermo oltre alle etichette `aria`, tastiera, altre larghezze oltre 400 e 1280 px.
- Il badge studente non arriva al server: nessun codice lo usa; il server non sa chi è studente.

## Da fare prima di pubblicare (utente)
1. **`TITOLARE.nome`** (nome e cognome) e **`CONTACT_EMAIL`** in `app/src/config/offer.ts`: oggi `undefined`, e i testi non nominano nessuno. Prima di collegare ATLAS servono entrambi.
2. **D1 in giurisdizione UE**: il testo della privacy lo dice. Controllare il database esistente; se non lo è ricrearlo con `wrangler d1 create atlas --jurisdiction eu` (`atlas/DEPLOY.md` §1), altrimenti togliere quella frase da `legal/privacy.ts`.
3. Migrazioni (`npx wrangler d1 migrations apply atlas --remote`), `ADMIN_TOKEN`, `ALLOWED_ORIGINS`, variabili `VITE_*` (`atlas/DEPLOY.md`, `app/.env.example`); in Firebase abilitare Google e «Link via email» e autorizzare il dominio.
4. Un servizio di posta per la conferma delle comunicazioni (e il link di disiscrizione in ogni messaggio): finché non c'è, non si scrive a nessuno.
5. Revisione di un professionista di privacy, termini e cookie (basi giuridiche, tempi di conservazione, trasferimento extra-SEE di Google, età 14 anni): resta consigliata, qui e nelle note, non nell'app.

## File toccati
`app/src/components/Onboarding.tsx`, `app/src/config/{ecosystem,offer}.ts`, `app/src/legal/*.ts`, `app/src/lib/{atlas,firebase,progetto}.ts`, `app/src/lib/progetto/*`, `app/src/lib/servizi/faq.ts`, `app/src/screens/landing/Faq.tsx`, `app/src/screens/extra/progetto/*`, `app/.env.example`, `app/tests/unit/progetto-*.test.ts`, `app/tests/unit/servizi-faq.test.ts`, `app/tests/anteprime/progetto.{html,tsx}`, `atlas/{src,migrations,tests,README.md,DEPLOY.md,wrangler.jsonc,.dev.vars.example}`.
**File da cancellare** (svuotati, non cancellati: niente `rm`): `app/src/lib/progetto/nomeDaEmail.ts` e `app/tests/unit/progetto-nome-da-email.test.ts`, `atlas/src/signups.ts`, `app/src/lib/progetto/percorsoProva.ts`, `app/tests/unit/zz-dbg.test.ts`. Da cancellare quando `App.tsx` non li nomina più: `app/src/screens/extra/progetto/CompletaProfilo.tsx` (e la riga in `index.ts`), `app/src/lib/progetto/coda.ts` (e la chiamata `coda.avvia()`).
