# Guida al lancio: solo browser, solo copia e incolla

Stato al 7/11: **tutto il collegamento è nel codice** (sul branch `main`). Sito, server (API di ATLAS), database, uso offline, app Android e pagina per scaricare le iscrizioni sono un unico progetto Cloudflare che si pubblica da GitHub. Il database `atlas` nel tuo Cloudflare è già a posto (tabelle create). Restano solo le cose che richiedono i tuoi account: 4 blocchi, circa 25 minuti. I testi in `questo stile` si copiano così come sono.

Dominio: `addiofa.theproject.world` oggi non risponde a nessun sito (verificato) e `theproject.world` sembra gestito da **Namecheap**: per questo al blocco 2 si aggiunge un record DNS lì.

---

## Blocco 1 · Il progetto su Cloudflare, da GitHub (10 minuti)

Un solo progetto contiene sito **e** server: il sito è la cartella `app/dist`, le richieste a `/v1/*` vanno al server ATLAS. Cloudflare costruisce e pubblica da solo a ogni modifica del branch `main`.

1. Apri https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Import a repository** (scegli la voce con il nome del repository, non «Start with Hello World») → collega GitHub e scegli **AddiOfa**.
2. Compila i campi:
   - **Project name**: `addiofa` (deve essere questo nome: è quello scritto nel file `wrangler.jsonc`)
   - **Production branch**: `main`
   - **Root directory**: lascia vuoto
   - **Build command**: `cd app && npm ci && npm run build`
   - **Deploy command**: `npx wrangler deploy`
   - **Variables and secrets** (Build variables): aggiungi `NODE_VERSION` = `22`
3. **Save and Deploy**. Aspetta che il log finisca con `Success`.
4. Password per scaricare le iscrizioni: apri il progetto **addiofa** → **Settings → Variables and Secrets → Add**:
   - **Type**: `Secret`
   - **Variable name**: `ADMIN_TOKEN`
   - **Value**: una password lunga (almeno 20 caratteri) generata da un gestore di password; conservala. (Ti ho dato in chat un valore pronto: non è scritto in questo file.)
   - **Deploy** (o **Save** e poi **Deployments → Retry deployment**): il segreto vale dal deploy successivo.

**Se il Worker `addiofa` esiste già** (lo hai creato con «Start with Hello World»): il dominio `addiofa.theproject.world` risulta già collegato a lui e il Worker mostra ancora il testo di prova «Hello world». Non serve crearne un altro: apri il Worker → **Settings → Builds** → **Connect** → scegli il repository **AddiOfa**, branch `main`, Root directory vuota, Build command `cd app && npm ci && npm run build`, Deploy command `npx wrangler deploy` → **Save**, poi **Deployments → Retry deployment** (o fai un piccolo commit su `main`).
5. Trova l'indirizzo provvisorio nella pagina del progetto (del tipo `https://addiofa.NOME.workers.dev`), e controlla nel browser:
   - `https://addiofa.NOME.workers.dev` → deve comparire la landing.
   - `https://addiofa.NOME.workers.dev/v1/health` → deve rispondere con un messaggio che contiene `"ok":true`.

**Se il log dice «Missing entry-point» o «run wrangler deploy on a Pages project»**: il file `wrangler.jsonc` alla radice del repository, dopo l'ultimo aggiornamento, dichiara un Worker con gli asset: se vedi questi messaggi, la causa è che il progetto è stato creato con un altro tipo. Elimina il progetto (Settings → Delete), poi ricrealo come sopra da **Import a repository**.

## Blocco 2 · Il tuo dominio `addiofa.theproject.world` (5-15 minuti)

Un progetto Worker accetta un dominio personale **solo se il dominio è gestito da Cloudflare**. Prima controlla se `theproject.world` è nel tuo account:

1. Apri https://dash.cloudflare.com (la home) e guarda l'elenco dei siti (**Websites**). Se c'è `theproject.world`:
   - Apri il progetto **addiofa** → **Settings → Domains & Routes → Add → Custom domain** → scrivi `addiofa.theproject.world` → **Add domain**. Cloudflare crea da solo il record DNS.
2. Se `theproject.world` **non** è nel tuo Cloudflare, hai due strade:
   - **Subito**: usa l'indirizzo `https://addiofa.NOME.workers.dev` (già pronto). Funziona tutto, con l'app Android compresa, a patto che l'indirizzo sia quello usato nei passi successivi.
   - **Dopo, con calma**: aggiungi `theproject.world` a Cloudflare (Websites → Add a site) e cambia i nameserver da Namecheap (Domain List → Manage → Nameservers → Custom DNS) con quelli che Cloudflare ti indica. Attenzione: il reindirizzamento del dominio principale `theproject.world` fatto da Namecheap (URL Forward) va ricreato su Cloudflare prima di cambiare i nameserver, altrimenti smette di funzionare. Se non sei sicuro, chiedilo prima.

## Blocco 2 bis · Lista di controllo del dominio
- Il dominio è `addiofa.theproject.world` oppure `addiofa.NOME.workers.dev`: scegli uno dei due e usa lo stesso ovunque (Firebase, guida, app Android).
- Se cambi indirizzo, l'app Android va ricostruita (il workflow su GitHub) perché l'indirizzo è scritto nell'app.

## Blocco 3 · Firebase: login con Google e verifica email (5 minuti)

Apri https://console.firebase.google.com/project/mimetic-resolver-7szp9/authentication/providers

1. **Sign-in method → Google → Abilita** → come email di assistenza `andolinaraffaele70@gmail.com` → **Salva**.
2. **Sign-in method → Aggiungi nuovo provider → Email/Password → Abilita**, poi accendi anche **«Link via email (accesso senza password)»** → **Salva**.
3. **Settings → Authorized domains → Aggiungi dominio**: l'indirizzo che usi (`addiofa.theproject.world` oppure `addiofa.NOME.workers.dev`).

## Blocco 4 · Prove (5 minuti)

Da telefono, su `https://addiofa.theproject.world`:

1. **Uso offline e installazione**: apri il sito una volta con la rete (così salva i file) → menu di Chrome → **Installa app** (su iPhone: Condividi → «Aggiungi alla schermata Home»). Poi metti il telefono in modalità aereo e riapri l'app: deve funzionare (domande, simulazioni, progressi).
2. «Inizia il test di livello» → percorso completo → risultato.
3. Profilo → **Community** → **Project ID** → **Accedi con Google**: si apre Google e torna «collegato».
4. Alla schermata «La tua email», con il tuo indirizzo `@mail.polimi.it`, premi **«Verifica con un link»**: arriva un'email da Firebase (guarda lo spam); il link riporta al sito.
5. NOI: attiva la casella della classifica: compare il tuo nome.
6. **Iscrizioni**: apri `https://addiofa.theproject.world/?vista=admin` → scrivi la password `ADMIN_TOKEN` → **Scarica tutte le iscrizioni**: scarica un CSV (si apre in Excel o Fogli Google). «Solo chi accetta le email» scarica solo chi ha dato quel consenso. Sono dati personali: non condividerli. (In alternativa: Cloudflare → Storage & Databases → D1 → `atlas` → Console → `SELECT * FROM signups ORDER BY id;`.)

Se un passaggio non va, scrivimi quale e cosa vedi: ti dico il testo esatto da correggere.

---

## L'app Android (APK)

Non richiede nessun passaggio dei blocchi sopra per provarla: l'APK che ti ho inviato funziona offline subito. Per ottenerne uno nuovo dopo ogni aggiornamento: su GitHub → **Actions** → **APK Android** → **Run workflow** → a fine esecuzione scarica `AddiOFA-apk` dagli Artifacts. Per le iscrizioni e la classifica usa l'indirizzo `https://addiofa.theproject.world`, quindi funzionano dopo i blocchi 1-3. Dettagli: `docs/APK.md`.

## Facoltativo, quando vuoi

- Togli i due file non più usati: su GitHub apri `app/firebase-applet-config.json` → ⋯ → **Delete file** → Commit; poi lo stesso per `app/bun.lock`.
- Pulizia del vecchio Worker `ofa`: solo se confermi che non ti serve più (non l'ho toccato).

## Cosa ho già fatto io (non devi rifarlo)

- Un unico Worker con file statici: sito (`app/dist`) + API di ATLAS (`/v1/*`) + database D1 + origini consentite (`wrangler.jsonc`), provato in locale con `wrangler dev`: sito, `/v1/health`, iscrizione, password dell'autore, scarico CSV.
- Uso offline (service worker): provato in Chromium con la rete spenta.
- App Android (APK) con Capacitor; workflow GitHub per ricostruirla.
- Database `atlas` nel tuo Cloudflare: migrazioni 0002 e 0003 applicate e verificate.
- Titolare e contatto (`Raffaele Tiziano Andolina`, `andolinaraffaele70@gmail.com`), configurazione Firebase, intestazioni di sicurezza e cache, `robots.txt`, anteprime social, pagina `?vista=admin`.

## Cosa NON funziona da solo (da sapere)

- **Email di conferma e disiscrizione per le comunicazioni**: non c'è un servizio di posta (Firebase manda solo il link di verifica dell'email PoliMi). Per scrivere agli iscritti serve un servizio tuo (Brevo, Resend…) e l'invio lo fai tu.
- **Cancellare i dati di chi non ha Project ID**: dalla Console D1, con le istruzioni di `atlas/DEPLOY.md` (sezione 7).
- **L'email PoliMi del percorso resta «non verificata» sul server**: solo sul dispositivo di chi preme «Verifica» diventa verificata.
- **Nell'app Android** «Accedi con Google» e il link di verifica email non sono disponibili (restano sul sito).
- **Non provato da me**: Cloudflare Workers e Firebase veri (i menu possono avere nomi un po' diversi), l'APK su un telefono vero, Safari/iPhone, lettore di schermo. I testi legali vanno rivisti da chi ne ha l'autorità.
