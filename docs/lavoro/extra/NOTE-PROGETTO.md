# NOTE-PROGETTO: registrazione nel funnel, percorso di studi, Project ID, ATLAS, NOI, Agorà

Agente PROGETTO. Aggiornata il 17/10 (nuovo ordine del funnel, email sola, percorso di studi, verifica con link, niente sfere). Nessun git, nessun file cancellato; `App.tsx`, `Menu.tsx`, `Navigazione.tsx`, `screens/extra/{profilo,sfide,studio}` e `atlas/` non toccati. In più, per ordine del coordinatore, due frasi nelle FAQ (`lib/servizi/faq.ts`, `screens/landing/Faq.tsx`) che elencavano i dati raccolti.

## Il funnel adesso (`components/Onboarding.tsx`)

| # | Schermata | Note |
|---|---|---|
| 1 | **Se non superi** (pain) | spostata qui dal dopo-quiz: `rischio-economico-ali`, le tre conseguenze di `landing/dati.tsx` (<25/30, ~30 €, 1° anno), «i» con il testo vero |
| 2 | **Con AddiOFA** (gain) | `obiettivo`; quattro righe (sai a che punto sei, ripassi ciò che sbagli, arrivi preparato, verso il 2° anno libero); dietro la «i»: «non toglie l'OFA e non garantisce l'esito». Fatti: 10 domande, 3 min |
| 3 | Domande 1-2 del test | |
| 4 | **La tua email** | un solo campo; `kit-luminoso/verifica-utente` 130 px; «Ciao Mario Rossi» con matita; solo se il nome non si ricava (`10501234@polimi.it`, una parola) compare «Come ti chiami?» |
| 5 | Domande 3-6 | |
| 6 | **Come ci hai conosciuto?** | tra la 6ª e la 7ª, stessa grafica di una domanda (4 scelte: Gruppo o chat, Instagram, Amici, Altro), con «Salta»; non entra in `answers`, né nel x/10, né nella stima; salva `provenienza` come id (`gruppo-chat`, `instagram`, `amici`, `altro`) |
| 7 | Domande 7-10 | |
| 8 | **Cosa fai al Poli** | cascata Scuola → Sede → Livello → Corso → Anno, tocco che avanza da solo, briciole toccabili (per la scuola la sigla: 3I, ICAT, AUIC, Design), passi a scelta unica saltati (la briciola resta ferma), ricerca se i corsi sono più di 8, «Altro» in fondo ai corsi |
| 9 | Certificazione? · OFA di inglese? | come prima, ma dopo il quiz |
| 10 | **Consensi** | tre caselle spente, informativa breve, link alla privacy; qui l'iscrizione si completa e **parte la coda** |
| 11 | Calcolo e risultato | come prima |

Chi ha già una registrazione completa e riapre il diagnostico dalla Home salta pain, gain, email, provenienza, percorso, consensi (intro «Diagnostico» → 10 domande → certificazione → OFA → risultato; certificazione e OFA sono precompilate dal giro precedente). «Vai all'app» in «Forse sei esente» porta ai consensi e poi fuori. Il «Salta» dell'intro non c'è più.
**«Completa il profilo»** (`soloRegistrazione`, schermata `completa-profilo`): email → percorso → provenienza → consensi → home; non rifà il diagnostico (provato in app: l'esito del diagnostico resta com'era).

Salvataggio: il profilo si salva in `appState.extra.progetto.profilo` **a ogni passo** (email, percorso, provenienza, consensi) con `completato: false` finché non si arriva ai consensi; l'**invio ad ATLAS parte solo ai consensi** (dopo che l'utente ha visto l'informativa). Chi si ferma a metà non ha niente su ATLAS e rivede «Completa il profilo» (email e scelte già inserite). I profili del giro precedente (senza `completato`, con nome scritto, sede e provenienza a testo, corso dell'elenco vecchio) si rileggono: sede → id minuscolo, provenienza → id, `completato` = true.

### Profilo e invio
`{ email, nome (ricavato), emailVerificata, scuola, sede, livello, corso (nome), corsoId, anno, provenienza, consensi, versioneInformativa 'iscrizione-2026-10-17', completato, creatoIl, aggiornatoIl }`. Corpo di `POST /v1/signups`: `appId, nome, email, scuola, sede, livello, corso, anno, provenienza, consensi, consentVersion` (solo i campi compilati; `corsoId` resta sul dispositivo). La firma del corpo comprende i campi nuovi; una coda scritta dalla versione precedente si ritenta com'è (provato con una prova che la scrive a mano), e un nuovo salvataggio la sostituisce.

### Nome dall'email (`lib/progetto/nomeDaEmail.ts`, puro, 4 prove)
Parte prima della `@` (e prima di `+`), separata sui punti e sui `_`, tolte le cifre; servono almeno due parole di almeno due lettere, solo lettere (apostrofo e trattino dentro ammessi); iniziali maiuscole (`maria-chiara.de.luca` → «Maria-Chiara De Luca», `anna.maria.bianchi` → tutto, con la matita). Non ricavabile (matricola, una parola, iniziali, simboli) → `null` → si chiede il nome. Il Worker ha una sua `nomeDaEmail` (se il nome manca): le due non sono la stessa funzione e possono differire nei casi limite; l'app manda sempre il suo.

### Verifica con un link (solo se Firebase è configurato) — NON provata contro Firebase vero
- Parti pure e provate (`lib/progetto/verificaEmail.ts`, 4 prove): impostazioni del link (`url` = stessa pagina, `handleCodeInApp: true`), riconoscimento del ritorno (`mode=signIn` + `oobCode`), confronto tra email del link e del profilo, e **una riga onesta per ogni errore** (`operation-not-allowed` → provider non abilitato; `unauthorized-continue-uri`/`invalid-continue-uri` → dominio non autorizzato; `network-request-failed` → offline; troppi tentativi; link scaduto/già usato; nessuna email salvata; email diversa). Nessun messaggio dice «verificata»: l'etichetta resta «non verificata».
- Parti con Firebase (`lib/firebase.ts`, non provabili qui): `inviaLinkVerifica(email)` (`sendSignInLinkToEmail`, salva l'indirizzo in `addiofa_verifica_email`), `ritornoDaLinkVerifica(emailProfilo)` (`isSignInWithEmailLink` → `signInWithEmailLink` con l'email salvata → controllo che coincida con il profilo → **esce subito dall'account** → ripulisce l'indirizzo). `emailVerificata: true` si scrive solo con `segnaEmailVerificata`, dopo quel successo e per quella stessa email; cambiando email si azzera.
- Non bloccante: il pulsante «Verifica con un link» sta nel passo email (e in Project ID); si prosegue subito. Senza `VITE_FIREBASE_*` il pulsante non c'è e la «i» dice che in questa versione la verifica non c'è.
- ATLAS continua a registrare `email_verificata = 0` (il Worker non può saperlo): la verifica vale sul dispositivo. Per portarla al server servirebbe che il Worker accettasse un ID token Firebase con l'email verificata.
- Per farla funzionare in produzione: nella console Firebase abilitare il provider «Email/Password» con «Link via email» e aggiungere il dominio del sito tra i domini autorizzati.

### Cosa fai al Poli (`lib/progetto/percorso.ts`, `percorsoDati.ts`, 17 prove)
Logica pura con una «fonte» iniettabile (`risolvi`, `scegli`, `torna`, `briciole`, `esitoPercorso`, `filtraCorsi`). I dati veri sono quelli di `app/src/data/corsi.ts` dell'agente CORSI (a.a. 2026/27, 4 scuole, 7 sedi attive, 89 voci per sede): le sedi inattive non compaiono mai, i livelli sono solo quelli esistenti per scuola e sede, gli anni sono `anniDelCorso` (3, 2, 5, 6). Una prova percorre **ogni** combinazione scuola/sede/livello/corso (89 percorsi, uno per voce dei dati) fino all'esito e controlla che ids e lunghezze siano accettabili dal Worker. Le scelte ambigue segnalate in `NOTE-CORSI.md` (sedi di Engineering Science e di Music and Acoustic Engineering, corso online, MEDTEC, «Università partner») sono ereditate così come stanno nei dati.
Scuole: ids `ing-ind-inf | icat | auic | design` (gli stessi del Worker, `atlas/src/signups.ts`).
`percorsoProva.ts` (la fonte finta provvisoria) è stato **svuotato** e la fonte finta è in `tests/unit/percorso-fixture.ts` per le prove dei casi limite.

## Richieste per `App.tsx` (le collega il coordinatore)

1. **Coda**: `import { coda } from './lib/progetto/coda';` e in `AppInner` `useEffect(() => { coda.avvia(); }, []);`.
2. **«Completa il profilo»**: se `serveRegistrazione(state)` (da `./lib/progetto/profilo`; vero per chi ha già usato l'app e non ha una registrazione **completata**, falso per chi non ha mai usato l'app) si apre `extra = { id: 'completa-profilo', params: {} }` al posto del menu. È già registrata; a fine salvataggio chiama `vaiHome()`.
3. **Props di `Onboarding`**: `onOpenLegal={apriLegale}` (link all'informativa nel passo dei consensi). `soloRegistrazione` solo se si monta direttamente.
4. **Ritorno dal link di verifica** (nuovo): all'avvio, `useEffect(() => { void applicaRitornoVerifica(() => appState, aggiornaExtra).then(e => { if (e.tipo === 'ok') toast('Email verificata.', 'ok'); else if (e.tipo === 'errore') toast(e.messaggio, 'errore'); }); }, []);` con `import { applicaRitornoVerifica } from './lib/progetto/ritorno';`. Senza, il ritorno viene gestito solo se l'utente apre «Project ID» (che lo fa da sé). Chiamate ripetute sono sicure (stesso esito, il codice si usa una volta).
5. **Variabili d'ambiente** (alla build, non segreti; `app/.env.example`): `VITE_ATLAS_API_URL`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` (= `FIREBASE_PROJECT_ID` del Worker), `VITE_FIREBASE_APP_ID`. Tutte assenti = app locale, nessuna chiamata di rete, nessun pulsante di verifica.
6. **Landing**: `onSkip` va ancora al menu senza registrazione; chi studia e non si è registrato vede «Completa il profilo» alla prima apertura successiva (richiesta 2). Se si vuole la registrazione anche prima, mandare `onSkip` a `completa-profilo`.
7. **Profilo** (altro agente): per mostrare il percorso di studi usare `riepilogoPercorso(leggiProgetto(appState).profilo)` (righe `{etichetta, valore}`) o `percorsoInUnaRiga(...)` da `lib/progetto/percorsoDati`. `Project ID` lo mostra già. La tessera «Progetto» apre `vai('esplora')`.
8. Il punteggio NOI si aggiorna aprendo `noi` (e solo se ATLAS conferma che si partecipa): niente da collegare.

## Niente sfere (richiesta del 17/10)
Nei miei file non c'è più nessun `sfera-*` né cerchio dietro l'arte. Esplora: testata `mondo-internazionale` luminoso, carte con `verifica-utente`, `progressi-statistiche`, `successo`, `messaggi-supporto`; NOI `successo`; Agorà `messaggi-supporto`; ATLAS senza testata (c'è il misuratore); scuole `progressi-statistiche` (3I), `mondo-internazionale` (ICAT), `studio-inglese` (AUIC), `suggerimenti-consigli` (Design). **Non esiste arte dedicata alle quattro scuole**: queste sono le più vicine e riusano soggetti già usati altrove (un'illustrazione fa più mestieri: da correggere se l'agente ASSET ne disegna di dedicate).

## Da fare prima del lancio (invariato)
- `TITOLARE` (oggi solo «Project») e `CONTACT_EMAIL` (`undefined`) vanno compilati; revisione legale di termini, privacy e cookie (basi giuridiche, conservazione, trasferimento extra-SEE di Google, età 14 anni). Senza contatto, chi si è iscritto senza accedere con Google può cancellare i dati dal server solo passando dal Project ID.
- **Lacuna del Worker**: collegata l'iscrizione a un Project ID, `POST /v1/signups` non la modifica più **e risponde comunque `ok`**: l'app, vedendo `ok`, segna «inviata» (visto davvero nella prova: un'iscrizione collegata non ha preso i campi nuovi e la coda diceva «inviata»). Per chi è collegato la schermata Project ID aggiorna via `PATCH /v1/me` (corso, sede, scuola, livello, anno, provenienza); nome, email e i tre consensi non hanno un'API. Proposta: far accettare a `PATCH /v1/me` anche `consensi` e `nome`, e far rispondere al `POST` una cosa diversa quando ignora.
- Worker non pubblicato; `ALLOWED_ORIGINS` col dominio del sito; migrazione `0003_percorso_studi.sql` da applicare con le altre (`atlas/DEPLOY.md`).

## Prove eseguite (numeri)
- `cd app && npx tsc --noEmit`: 0 errori. `npm test`: **290 prove, 286 ok, 4 saltate** (le 4 contro il Worker locale, che richiedono `ATLAS_URL_PROVA`). Nuove o riscritte in questo giro: nome dall'email 4, percorso 17 (di cui 3 sui dati veri), verifica email 4, validazione/profilo 16 (compresa la lettura dei profili del giro precedente), coda 18 (comprese quelle sul corpo con percorso e sulla coda vecchia), legali 6.
- **Contro il Worker locale vero** (`wrangler dev --local`, D1 locale con le migrazioni 0001-0003, token `test:`):
  - dall'**app costruita** (landing → pain → gain → Q1-2 → email → Q3-6 → provenienza → Q7-10 → percorso → certificazione → OFA → consensi → calcolo/risultato, Chromium): riga in `signups` con `nome` ricavato («Giulia Neri»), `scuola=ing-ind-inf`, `sede=leonardo`, `livello=triennale`, `corso=Ingegneria Elettronica`, `anno=2`, `provenienza=instagram`, `consent_version=iscrizione-2026-10-17`, `email_verificata=0`; coda `inviata` al primo tentativo;
  - «Completa il profilo» dall'app costruita (stato con diagnostico fatto e senza profilo): profilo completo salvato, coda `inviata`, diagnostico invariato, ritorno alla Home;
  - prova automatica ripetibile (`ATLAS_URL_PROVA=http://localhost:8787 npm test`): invio dalla coda, collegamento, i campi nuovi letti indietro (`scuola, sede, livello, anno, provenienza, nome`), punteggio e classifica, ritiro del permesso, cancellazione; valori fuori elenco di scuola/livello/anno rifiutati dal Worker; email non PoliMi rifiutata e coda `rifiutata` senza ritentare;
  - **coda e nuovo tentativo** (giro precedente, stessi meccanismi): Worker spento → `in-attesa/rete`, prossimo tra 30 s; riacceso → inviata da sola dopo 27 s. Non rifatta con i campi nuovi: la logica della coda non è cambiata, coperta dalle prove con il server finto.
- **Funnel completo**, ogni passo (16 schermate) a **400 e 1280 px, chiaro e scuro** nell'app costruita: 0 blocchi sopra 5 parole (`controlla-testo`), 0 violazioni di contrasto (`controlla-contrasto`, stesso criterio sulle pagine), nessuno scorrimento orizzontale, 0 errori in console. Screenshot letti a occhio (in particolare email con matricola e con nome composto, scuole, briciole, anno, provenienza, consensi, chiaro e scuro).
- Esplora, Project ID, NOI, Agorà, ATLAS in app costruita a 400 px, chiaro e scuro: 0 errori in console, art piatta senza sfondi tondi, riletti. Controlla-testo sulle sei schermate extra: 0.
- Build normale e build demo (in cartelle temporanee): ok, la demo non porta Firebase (0 host Google).

## Non provato
- **Verifica con un link contro Firebase vero**: né l'invio, né il ritorno, né il provider, né il dominio autorizzato. Il pulsante e gli stati («Link inviato», errore) li ho visti solo con l'accesso finto di sviluppo (`?atlasProva=…`, assente da ogni build), dove l'invio è simulato. La riga di ogni errore è provata solo come funzione pura.
- Accesso con Google vero e firma dei token Firebase (invariato); deploy e CORS di produzione; Safari e dispositivi reali; tastiera e lettore di schermo oltre alle etichette `aria`; larghezze diverse da 400 e 1280.
- Integrazione in `App.tsx` (richieste 1-4): provata solo con la schermata `?vista=completa-profilo` e con il funnel dalla landing (che apre già `Onboarding`).
- Nome dall'email: non verificato su email PoliMi reali (solo sul formato `nome.cognome[cifre]@…` e le varianti nei test); l'ortografia dei nomi con accento o particelle (`de luca`) è la sola maiuscola iniziale.
- Dati dei corsi: quelli di `NOTE-CORSI.md` (sedi dubbie, corso online, ICAT non letto dal sito della Scuola); l'ordine alfabetico degli elenchi è quello di `data/corsi.ts`.

## File toccati
`app/src/components/Onboarding.tsx`, `app/src/config/{ecosystem,offer}.ts`, `app/src/legal/*.ts`, `app/src/lib/{atlas,firebase,progetto}.ts`, `app/src/lib/progetto/*` (nuovi: `nomeDaEmail`, `percorso`, `percorsoDati`, `verificaEmail`, `ritorno`; riscritti: `profilo`, `corsi`; `percorsoProva.ts` svuotato), `app/src/screens/extra/progetto/*`, `app/src/lib/servizi/faq.ts` e `app/src/screens/landing/Faq.tsx` (una frase ciascuno), `app/.env.example`, `app/tests/unit/progetto-*.test.ts`, `app/tests/unit/percorso-fixture.ts`, `app/tests/anteprime/progetto.{html,tsx}`.
**File da cancellare**: `app/src/lib/progetto/percorsoProva.ts` (svuotato), `app/tests/unit/zz-dbg.test.ts` (scratch svuotato).

## Aggiornamento 18/10: richieste sparse nel test

Su richiesta dell'utente le richieste del profilo non stanno più in blocco: fra una domanda e l'altra del diagnostico ne compare UNA per schermata, a partire dopo la seconda domanda. Ordine: email PoliMi → «Come ci hai conosciuto?» → i passi di «Cosa fai al Poli» (scuola, sede, livello, corso, anno, uno per schermata; quelli con una sola scelta si saltano) → certificazione → OFA; poi consensi, calcolo, risultato. Le richieste non esaurite entro la decima domanda si mettono dopo l'ultima. La logica è in `components/Onboarding.tsx` (`prossimaRichiesta`, `avanti`, `primaDi`); `PassoPercorso` ha la prop `unPasso`. La barra ha 14 segmenti (uno per domanda). «Completa il profilo» e chi ha già usato l'app restano come prima.
