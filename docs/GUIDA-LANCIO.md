# Guida al lancio: solo browser, nessun comando

Tempo: circa 45 minuti. Serve: un account **Cloudflare** gratuito (https://dash.cloudflare.com/sign-up), l'accesso a **GitHub** (il repository `raffaele-ando/AddiOfa`) e al progetto **Firebase** `mimetic-resolver-7szp9`. Il lavoro è sul branch `claude/folder-review-h3xnww`: negli elenchi qui sotto «il branch» è sempre quello.

Ordine: 1 → 2 → 3 → 4 → 5 → 6 → 7.

## 1. Dammi (o scrivi tu) il tuo nome e la tua email di contatto

Compaiono nelle pagine legali, in «Segnala» e per le richieste di cancellazione dei dati. Puoi scrivermi in chat nome, cognome ed email e li inserisco io. Se preferisci farlo da solo: apri
https://github.com/raffaele-ando/AddiOfa/edit/claude/folder-review-h3xnww/app/src/config/offer.ts
cerca `CONTACT_EMAIL` e `TITOLARE`, sostituisci `undefined` con `'tua.email@esempio.it'` e aggiungi `responsabile: 'Nome Cognome'` dentro le graffe di `TITOLARE`, poi **Commit changes** (in alto a destra, «Commit directly to the claude/folder-review-h3xnww branch»).
I testi legali li fai rivedere a chi ne ha l'autorità (sono in `app/src/legal/` e `app/src/lib/servizi/faq.ts`).

## 2. Il sito su Cloudflare Pages

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Import an existing Git repository** → collega GitHub e scegli `AddiOfa`.
2. **Project name**: `addiofa` (importante: il server del passo 3 è già impostato per accettare `https://addiofa.pages.dev`; se il nome è occupato e ne usi un altro, vedi la nota in fondo).
3. **Production branch**: `claude/folder-review-h3xnww` (quando porti tutto su `main`, potrai cambiarlo).
4. Build settings: **Framework preset** = None; **Build command** = `cd app && npm ci && npm run build`; **Build output directory** = `app/dist`.
5. **Environment variables** → aggiungi `NODE_VERSION` = `20`. (L'indirizzo del server lo aggiungi al passo 4.)
6. **Save and Deploy**. Alla fine apri `https://addiofa.pages.dev`: deve comparire la landing.

I valori di Firebase sono già nel codice (non sono segreti): non devi inserirli.

## 3. Il server ATLAS (Project ID, classifica NOI, iscrizioni)

1. https://dash.cloudflare.com → **Storage & Databases → D1 SQL database**: deve esserci un database chiamato `atlas`. Se **manca**: **Create database**, nome `atlas`; poi apri il database, copia il suo **Database ID** e mandamelo (o sostituiscilo tu al posto di `fae6dddc-a787-474b-9699-e23bab53eb4d` in https://github.com/raffaele-ando/AddiOfa/edit/claude/folder-review-h3xnww/atlas/wrangler.jsonc).
2. Tabelle del database: apri `atlas` → scheda **Console**. Incolla ed esegui:
   `SELECT name FROM sqlite_master WHERE type='table';`
   - Se **non compare nessuna tabella `accounts`**: apri https://github.com/raffaele-ando/AddiOfa/blob/claude/folder-review-h3xnww/atlas/migrations/0001_init.sql , premi il pulsante **Copy raw file**, incollalo nella Console ed **Execute**.
   - Se **non compare la tabella `signups`**: stessa cosa con https://github.com/raffaele-ando/AddiOfa/blob/claude/folder-review-h3xnww/atlas/migrations/0002_signups.sql e poi con https://github.com/raffaele-ando/AddiOfa/blob/claude/folder-review-h3xnww/atlas/migrations/0003_percorso_studi.sql
   - Se `signups` c'è già ma **non ha le colonne `scuola`, `livello`, `anno`**: esegui solo la 0003.
   (In ordine: 0001, 0002, 0003. Se un comando dice «duplicate column» o «already exists», quella parte c'era già: passa alla successiva.)
3. Il Worker: **Workers & Pages → Create → Workers → Import a repository** → `AddiOfa`. **Project name**: `atlas`. **Branch**: `claude/folder-review-h3xnww`. **Root directory**: `atlas`. **Build command**: lascia vuoto o `npm ci`. **Deploy command**: `npx wrangler deploy`. **Deploy**.
4. Quando finisce, il Worker ha un indirizzo tipo `https://atlas.IL-TUO-NOME.workers.dev` (lo vedi nella pagina del Worker): **copialo**.
5. Segreto per scaricare le iscrizioni: Worker `atlas` → **Settings → Variables and Secrets → Add** → Type **Secret**, Name `ADMIN_TOKEN`, Value = una password lunga (generala con un gestore di password, 32 caratteri casuali) → **Deploy**. Conservala.
6. Prova: apri `https://atlas.IL-TUO-NOME.workers.dev/v1/health` nel browser: deve mostrare un messaggio di «ok».

## 4. Collega il sito al server

Cloudflare → Workers & Pages → progetto Pages `addiofa` → **Settings → Environment variables → Production → Add**: nome `VITE_ATLAS_API_URL`, valore `https://atlas.IL-TUO-NOME.workers.dev` (senza barra finale) → **Save**. Poi **Deployments → ⋯ sull'ultimo deploy → Retry deployment** (le variabili valgono solo alla costruzione del sito).

## 5. Firebase (login con Google e verifica email)

Apri https://console.firebase.google.com/project/mimetic-resolver-7szp9/authentication/providers

1. **Sign-in method → Google → Abilita** → scegli l'email di assistenza → **Salva**.
2. **Sign-in method → Email/Password → Abilita**, poi accendi anche **«Link via email (accesso senza password)»** → **Salva**. (Serve a «Verifica con un link» per l'email PoliMi: l'email la invia Firebase.)
3. **Settings → Authorized domains → Add domain** → `addiofa.pages.dev` (e il tuo dominio, se ne hai uno).

## 6. Prove (5 minuti, da telefono o computer)

1. `https://addiofa.pages.dev` → «Inizia il test di livello» → fino al risultato.
2. Profilo → **Community** → **Project ID** → **Accedi con Google**: si apre Google e torna «collegato».
3. Alla schermata «La tua email» (nel percorso) o in Project ID: con il tuo indirizzo `@mail.polimi.it` premi **«Verifica con un link»**: arriva l'email di Firebase (guarda lo spam); il link riporta al sito.
4. NOI: attiva la casella della classifica: compare il tuo nome.
5. Iscrizioni: Cloudflare → D1 → `atlas` → **Console** → esegui
   `SELECT email, nome, scuola, sede, livello, corso, anno, provenienza, consenso_comunicazioni FROM signups ORDER BY id;`
   e vedi le righe (puoi copiarle in un foglio di calcolo). Dati personali: non condividerli.
6. Sul telefono: menu del browser → «Aggiungi a schermata Home».

## 7. Dopo

- Togli i due file inutili: su GitHub apri `app/firebase-applet-config.json` → ⋯ → **Delete file**; stessa cosa per `app/bun.lock`; **Commit changes**.
- Ogni modifica che fai sul branch ricostruisce il sito da sola (Pages) e il server (Workers Builds).
- Per portare tutto su `main`: https://github.com/raffaele-ando/AddiOfa/compare/main...claude/folder-review-h3xnww → **Create pull request** → **Merge**; poi cambia il **Production branch** del progetto Pages (Settings → Builds → Branch control) e del Worker (Settings → Builds) in `main`.

## Se il nome `addiofa` è occupato

Usa un altro nome (es. `addiofa-polimi`): il sito sarà `https://addiofa-polimi.pages.dev`. Allora in https://github.com/raffaele-ando/AddiOfa/edit/claude/folder-review-h3xnww/atlas/wrangler.jsonc cambia la riga `"ALLOWED_ORIGINS": "https://addiofa.pages.dev"` con il nuovo indirizzo (più indirizzi si separano con la virgola) e rifai il commit; al passo 5.3 aggiungi lo stesso dominio.

## Cosa NON funziona da solo

- **Email di conferma e disiscrizione per le comunicazioni**: non c'è un servizio di posta collegato (Firebase manda solo il link di verifica dell'email PoliMi). Per scrivere agli iscritti serve un servizio tuo (Brevo, Resend…) e l'invio lo fai tu.
- **Cancellare i dati di chi non ha Project ID**: dalla Console D1, con le istruzioni di `atlas/DEPLOY.md` (sezione 7).
- **L'email PoliMi del percorso resta «non verificata» sul server**: solo sul dispositivo di chi preme «Verifica» diventa verificata.
- **Non provato da me**: Cloudflare e Firebase veri (i menu possono avere nomi leggermente diversi dai miei), Safari, telefoni veri, lettore di schermo.
