# NOTE-PROGETTO: registrazione subito, Project ID, ATLAS, NOI, Agorà

Agente PROGETTO. Nessun git, nessun file cancellato, `App.tsx`, `Menu.tsx`, `Navigazione.tsx`, `screens/extra/{profilo,sfide,studio}` non toccati. Il Worker (`atlas/`) non è stato toccato.

## Cosa c'è ora

| Cosa | File | Note |
|---|---|---|
| Config dell'ecosistema | `src/config/ecosystem.ts` | nomi, `AGORA_URL`, `FRASE_PROJECT`, `ATLAS_API_URL` (da `VITE_ATLAS_API_URL`), `FIREBASE_CONFIG` (da `VITE_FIREBASE_*`), `CONSENT_VERSION` (permessi, uguale al Worker), `ISCRIZIONE_VERSIONE` (testo dei consensi dell'iscrizione), `SCOPES` |
| Titolare | `src/config/offer.ts` | nuovo `TITOLARE = { nome: 'Project' }`; `CONTACT_EMAIL` resta `undefined` |
| Accesso con Google | `src/lib/firebase.ts` | solo Auth, caricato a richiesta; senza `VITE_FIREBASE_*` dice «non configurato». Nella build a file unico (demo) l'SDK non entra (verificato: 0 host Google, -240 kB) |
| Client ATLAS | `src/lib/atlas.ts` | `chiama`, `atlas.iscrivi/me/updateMe/deleteMe/exportMe/setLink/removeLink/postScore/leaderboard`; `AtlasNonConfigurato`, `AtlasErrore(stato)` |
| Logica | `src/lib/progetto.ts` + `src/lib/progetto/{validazione,corsi,profilo,coda,noi,informativa}.ts` | email/dominio, elenchi, profilo in `appState.extra.progetto`, coda di invio, stati NOI |
| Registrazione nel funnel | `src/components/Onboarding.tsx` + `src/screens/extra/progetto/registrazione.tsx` | intro → Chi sei → Il tuo corso → Consensi → certificazione → OFA → quiz… |
| Schermate (registro `SCHERMATE_PROGETTO` in `screens/extra/progetto/index.ts`, già aggiunto a `registro.ts` dal coordinatore) | `Esplora`, `ProjectId`, `AtlasAnalisi`, `Noi`, `Agora`, `CompletaProfilo` | id: `esplora`, `projectid`, `atlas-analisi`, `noi`, `agora`, `completa-profilo` (`barra: null`) |
| Legali | `src/legal/{base,termini,privacy,cookie}.ts` | riscritti sul trattamento vero |
| Variabili d'ambiente | `app/.env.example` | nuovo |
| Prove | `tests/unit/progetto-{validazione,coda,legali,atlas-locale}.test.ts`; anteprima `tests/anteprime/progetto.html` | vedi sotto |

`ProjectConsent`, `ProjectProfile` e `Leaderboard` (componenti a schermo intero del vecchio giro) **non sono stati ripristinati come file**: il consenso a permessi è dentro `ProjectId.tsx` (vista «Accedi con Project ID»), il profilo e le azioni (esporta, scollega, elimina) sono lì, la classifica è in `Noi.tsx`. Se il coordinatore vuole togliere riferimenti a quei nomi, non ce ne sono nel codice.

### Dati salvati
- `appState.extra.progetto = { profilo?: {nome, email, emailVerificata:false, corso?, sede?, provenienza?, consensi:{noi,atlas,comunicazioni}, versioneInformativa, creatoIl, aggiornatoIl}, collegamento?: {scopes, collegatoIl, aggiornatoIl, projectId?, handle?} }`. Retrocompatibile (un salvataggio vecchio senza il campo si legge; dati rovinati o file importati vengono ripuliti da `leggiProgetto`: i consensi valgono solo se `=== true`, l'email non è mai «verificata»). Entra nell'esporta/importa dei progressi.
- Chiave a parte `addiofa_progetto_coda` (localStorage): stato dell'invio e, finché non è partito, il corpo da inviare. Dopo l'invio resta solo lo stato e una firma (nessun dato personale).

### Stati dell'invio (visibili in «Project ID › La tua iscrizione» e come etichetta nella carta di Esplora)
`inviata` · `in attesa di collegamento` (motivi veri: ATLAS non configurato, offline, rete, errore del server, limite di richieste) · `invio in corso` · `non accettata` (4xx: non si ritenta, l'utente corregge) · `solo su questo dispositivo` (profilo salvato mai messo in coda, es. dopo «Elimina Project ID»; c'è il pulsante «Invia ad ATLAS»). Attese: 30 s, 1 min, 2 min, 5 min, 15 min, 1 h, poi ogni 6 h; si ritenta anche quando torna la rete e quando la pagina torna visibile. Modifiche fatte durante un invio non vengono segnate come inviate per sbaglio (provato).

## Richieste per `App.tsx` (le collega il coordinatore)

1. **Avvio della coda** (una riga, vale per tutti gli utenti già registrati con un invio in attesa): `import { coda } from './lib/progetto/coda';` e in `AppInner` `useEffect(() => { coda.avvia(); }, []);`. Senza, i tentativi partono solo quando si apre Onboarding o una schermata di Project.
2. **Registrazione per chi ha già usato l'app senza profilo** («Completa il profilo», una volta, non saltabile): in `initialView` e al posto del `'menu'`, se `serveRegistrazione(state)` (da `./lib/progetto/profilo`) allora `view = 'extra'` con `extra = { id: 'completa-profilo', params: {} }`. È già una schermata registrata: appena salva, chiama `vaiHome()`. (In alternativa `<Onboarding soloRegistrazione … />` direttamente.) `serveRegistrazione` è falso per chi non ha mai usato l'app (passa dalla registrazione nel funnel) e per chi ha già un profilo.
3. **Props di `Onboarding`** (nuove, opzionali): `onOpenLegal={apriLegale}` (link «Informativa completa» nel passo dei consensi; senza, il link non compare) e `soloRegistrazione` (vedi sopra). Le altre props non cambiano.
4. **«Salta» tolto dall'intro del diagnostico**: la registrazione viene prima di tutto. Resta `onSkip` della landing (`Landing → menu`): chi salta il diagnostico non passa dalla registrazione al primo giro; vedrà «Completa il profilo» alla prima apertura dopo aver studiato (regola 2 sopra). Se si vuole che anche «salta» dalla landing porti alla registrazione, basta mandarlo a `completa-profilo` invece che a `menu`.
5. **Variabili d'ambiente** (alla build, non segreti, vedi `app/.env.example`): `VITE_ATLAS_API_URL` (Worker), `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` (= `FIREBASE_PROJECT_ID` del Worker, `mimetic-resolver-7szp9`), `VITE_FIREBASE_APP_ID`. I valori sono in `app/firebase-applet-config.json`. Tutte assenti = app locale, nessuna chiamata di rete.
6. **Tessera «Progetto» nel Profilo** (altro agente): apre `vai('esplora')`. «ATLAS» in Esplora apre `atlas-analisi`; `noi` e `agora` sono raggiungibili da Esplora. Eventuali righe del Menu/Impostazioni: `vaiExtra('projectid')` (i dati e la cancellazione), `vaiExtra('noi')`.
7. Il punteggio NOI si aggiorna quando si apre la schermata `noi` (e solo se ATLAS conferma che si partecipa), **non** da `App.tsx`: non serve nessun collegamento. Se si vuole l'aggiornamento anche a fine simulazione, in `handleExamComplete` si può chiamare `atlas.postScore(ECOSYSTEM.appId, imparate, migliore)` solo se `leggiProgetto(state).collegamento?.scopes.includes('noi.leaderboard')`; non l'ho aggiunto per non toccare App.

## Da fare prima del lancio (non è nel mio perimetro o non si può da qui)
- **Titolare e contatto**: `TITOLARE` in `config/offer.ts` dice solo «Project» (il nome del progetto, non una persona o un ente); `CONTACT_EMAIL` è `undefined`. Per il GDPR vanno compilati (persona o ente, indirizzo, email). Le pagine legali scrivono la riga «Contatto del titolare» solo se `CONTACT_EMAIL` esiste; senza, la cancellazione resta possibile dentro l'app (accedi con Google → collega l'iscrizione → «Elimina Project ID»), ma **chi si è iscritto senza accedere con Google e vuole cancellare i dati dal server non ha altra strada che il Project ID** finché non c'è un contatto (`DELETE /v1/signups` è 405). Anche la riga sulle iscrizioni con email altrui (l'email non è verificata) compare solo con il contatto.
- **Revisione legale**: `termini`, `privacy`, `cookie` sono scritti per il vero trattamento ma vanno fatti rivedere da un professionista (basi giuridiche: contratto per l'iscrizione, legittimo interesse per le statistiche aggregate e per il limite delle richieste, consenso per NOI/ATLAS/messaggi; trasferimento extra-SEE di Google; età di 14 anni; nessun termine di conservazione automatico: va deciso). Nell'app non c'è nessun «bozza».
- **Lacuna del Worker (da dire a chi tocca `atlas/`)**: una volta che l'iscrizione è collegata a un Project ID, `POST /v1/signups` non la modifica più e **non esiste un'API per cambiare nome, email e i tre consensi dell'iscrizione** (`PATCH /v1/me` accetta solo corso, sede e provenienza). L'app lo dichiara (in «Modifica», per chi è collegato, quei campi non si cambiano; i consensi dell'iscrizione si ritirano solo eliminando il Project ID). Proposta: far accettare a `PATCH /v1/me` anche `consensi` e `nome`, con voce `update` nel registro.
- Il Worker non è pubblicato: `atlas/DEPLOY.md` (migrazione 0002, `ALLOWED_ORIGINS` col dominio del sito, `ADMIN_TOKEN`). Senza `ALLOWED_ORIGINS` giusto il browser blocca le chiamate dal sito vero (in locale con `*` funziona).
- Doppia verifica Firebase console: provider Google abilitato e dominio del sito tra i domini autorizzati (vedi `atlas/DEPLOY.md` §5).

## Prove eseguite (numeri)
- `cd app && npx tsc --noEmit`: 0 errori. `npm test`: 249 prove, 246 ok, 3 saltate (le 3 contro il Worker locale, che richiedono `ATLAS_URL_PROVA`). Nuove: 38 (validazione e profilo 13, coda 16 comprese le corse di dati cambiati durante l'invio, legali 6, Worker locale 3).
- **Contro il Worker locale vero** (`wrangler dev --local --port 8787`, D1 locale in cartella temporanea, token `test:<uid>:<nome>`):
  - dal browser (Chromium), registrazione nel funnel → riga in `signups` con nome, email in minuscolo, corso, sede, provenienza, consensi esatti, `email_verificata = 0` e voce `grant` nel registro; sottodominio `@dei.polimi.it` accettato;
  - **coda e nuovo tentativo**: Worker spento durante la registrazione → stato `in-attesa` / `rete`, 1 tentativo, prossimo tra 30 s, corpo conservato; Worker riacceso → dopo 27 s l'invio è partito da solo (2 tentativi, stato `inviata`, corpo tolto dalla chiave); la riga è nel database;
  - «Modifica» di un'iscrizione non collegata: corso e consenso aggiornati nel database, registro `grant, update, update`;
  - collegamento Project ID (`PUT /v1/links/addiofa` con `polimiEmail`): l'iscrizione risulta collegata, la schermata passa a «Inviata, collegata al tuo Project ID», permessi come interruttori (tutti spenti di partenza; il profilo di base è «Necessario» senza interruttore);
  - classifica NOI: punteggio inviato e classifica letta dal Worker, posizione «#1 su 1», ritiro del permesso → la voce sparisce;
  - email non PoliMi: il Worker risponde 400 e la coda segna `rifiutata` senza ritentare; senza token `/v1/me` dà 401; «Elimina Project ID» cancella anche l'iscrizione (provato nella prova automatica);
  - la prova automatica `tests/unit/progetto-atlas-locale.test.ts` ripete il giro: `ATLAS_URL_PROVA=http://localhost:8787 npm test` dalla cartella `app/`.
- Senza `VITE_ATLAS_API_URL`: registrazione completata, stato «In attesa di collegamento · ATLAS non è collegato…», nessuna chiamata di rete, NOI «Non collegato», Esplora lo dice nella carta.
- Chromium a 400 e 1280 px, chiaro e scuro, nell'app vera (`/?vista=…`) per `esplora`, `projectid`, `completa-profilo`, `noi`: nessuno scorrimento orizzontale, 0 errori in console (a parte il 404 di `favicon.ico`). A 400 px, chiaro e scuro, nell'anteprima: tutte le schermate e i passi della registrazione, riletti a occhio.
- `tools/controlla-testo.py` (400 px, chiaro e scuro) su `esplora, projectid, atlas-analisi, noi, agora, completa-profilo`: 0 blocchi sopra 5 parole (testo legale e dati sotto `data-testo-ok`). Sull'anteprima anche i quattro passi del funnel: 0.
- `tools/controlla-contrasto.py` (400 px, chiaro e scuro) su Esplora, Project ID, Agorà, NOI, ATLAS, funnel: 0 violazioni.
- Build normale (`vite build` in cartella temporanea): ok. Build demo (`vite build --config vite.demo.config.ts` in cartella temporanea, **non** `npm run build:demo` per non toccare `dist-demo/`): ok, 0 host esterni di Google (`check-artifact` sull'`index.html`; le tre righe «<html/<head/<body» sono dovute al formato diverso da `artifact.html`).

## Non provato
- **Nessun accesso Google vero**: l'accesso nel browser è stato provato con il ramo solo-sviluppo `?atlasProva=<uid>:<nome>` di `lib/firebase.ts` (esiste solo con `import.meta.env.DEV`, assente da ogni build). La verifica della firma dei token Firebase resta quella di `atlas/src/auth.ts`, mai provata con token veri. Provider Google e domini autorizzati in Firebase non verificati.
- **Nessun deploy**: Worker non pubblicato, CORS di produzione non provato.
- Safari e dispositivi reali; tastiera/lettore di schermo oltre alle etichette `aria`; larghezze diverse da 400 e 1280.
- `Onboarding` dentro `App.tsx` col flusso completo (landing → registrazione → diagnostico) e «Completa il profilo» alla prima apertura: provati nell'anteprima e come schermata `?vista=completa-profilo`, non col cablaggio di `App.tsx` (non c'è ancora).
- Il consenso ai messaggi non ha un doppio opt-in (l'email non è verificata): prima di una campagna vera serve una conferma per posta (vedi `atlas/DEPLOY.md` §9).
- Concept 49: le carte non hanno le foto dei concept (ATLAS dallo spazio, persone, architettura), ma le sfere del kit blu come da `docs/design/ILLUSTRAZIONI.md` §3.5 (`mondo-internazionale` luminoso in testata, `sfera-opportunita`, `sfera-community`, `sfera-polimi`, `sfera-addiofa`; `verifica-utente` luminoso in Project ID e nella registrazione; `ricerca-scintille` e `vuoto` negli stati vuoti). Gli articoli ATLAS, gli eventi NOI e le discussioni Agorà dei concept non esistono: sarebbero contenuti inventati.

## File toccati
`app/src/components/Onboarding.tsx`, `app/src/config/{ecosystem,offer}.ts`, `app/src/legal/{base,termini,privacy,cookie}.ts`, `app/src/lib/{atlas,firebase,progetto}.ts`, `app/src/lib/progetto/*`, `app/src/screens/extra/progetto/*`, `app/.env.example`, `app/tests/unit/progetto-*.test.ts`, `app/tests/anteprime/progetto.{html,tsx}`. `package.json` non toccato (`firebase` c'era già). `vite.config.ts` non toccato (Vite legge da solo le `VITE_*`). Nessun file da cancellare.
