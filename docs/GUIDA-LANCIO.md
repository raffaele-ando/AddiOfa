# Guida al lancio: solo browser, solo copia e incolla

Stato al 30/10: il codice è pronto (test, build, controlli verdi) e il database ATLAS nel tuo account Cloudflare è già a posto (tabelle create, vuoto). Restano le cose che solo tu puoi fare con i tuoi account. Sono 6 blocchi, circa 40 minuti. Le parti in `questo stile` si copiano così come sono.

Prima di cominciare, due controlli veloci sul dominio, per non creare conflitti: l'indirizzo `addiofa.theproject.world` oggi non risponde a nessun sito (verificato dall'esterno), quindi è libero. Il dominio `theproject.world` sembra gestito da **Namecheap** (la pagina principale risponde «Namecheap URL Forward»): perciò al blocco 4 si aggiunge un record DNS lì.

---

## Blocco 1 · Il server ATLAS su Cloudflare (5 minuti)

1. Apri https://dash.cloudflare.com → menu a sinistra **Workers & Pages** → **Create application** → scegli **Import a repository** (se vedi due schede, quella «Workers») → **GitHub** → autorizza e scegli il repository **AddiOfa**.
2. Compila i campi così:
   - **Project name**: `atlas`
   - **Production branch**: `claude/folder-review-h3xnww`
   - **Root directory** (in «Advanced settings» o «Build settings»): `atlas`
   - **Build command**: lascia vuoto
   - **Deploy command**: `npx wrangler deploy`
3. **Save and Deploy**. Aspetta «Success».
4. Apri il Worker `atlas` → in alto c'è il suo indirizzo, del tipo `https://atlas.QUALCOSA.workers.dev`. **Copialo** (serve al blocco 3).
5. Nel Worker `atlas`: **Settings → Variables and Secrets → Add**:
   - **Type**: `Secret`
   - **Variable name**: `ADMIN_TOKEN`
   - **Value**: una stringa lunga e casuale (ti ho dato in chat un valore pronto da incollare; non va scritta in questo file né nel repository)
   - **Deploy**. (È la password con cui si scaricano le iscrizioni: conservala in un gestore di password.)
6. Prova: apri nel browser `https://atlas.QUALCOSA.workers.dev/v1/health`: deve mostrare un messaggio di «ok».

## Blocco 2 · Il sito su Cloudflare Pages (5 minuti)

1. **Workers & Pages → Create application** → scheda **Pages** → **Import an existing Git repository** → repository **AddiOfa**.
2. Compila i campi:
   - **Project name**: `addiofa`
   - **Production branch**: `claude/folder-review-h3xnww`
   - **Framework preset**: `None`
   - **Build command**: `cd app && npm ci && npm run build`
   - **Build output directory**: `app/dist`
3. Prima di premere Deploy, apri **Environment variables (advanced)** e aggiungi (per **Production**):
   - `NODE_VERSION` = `20`
   - `VITE_ATLAS_API_URL` = l'indirizzo del Worker copiato al blocco 1, **senza barra finale** (esempio: `https://atlas.QUALCOSA.workers.dev`)
4. **Save and Deploy**. Alla fine apri `https://addiofa.pages.dev`: deve comparire la landing.

(Se in seguito cambi `VITE_ATLAS_API_URL`: Pages → progetto → **Settings → Environment variables**, modifica, poi **Deployments → ⋯ → Retry deployment**.)

## Blocco 3 · Il tuo dominio `addiofa.theproject.world` (5-10 minuti)

1. Cloudflare → Workers & Pages → progetto Pages **addiofa** → **Custom domains** → **Set up a custom domain** → scrivi `addiofa.theproject.world` → **Continue**. Cloudflare ti mostrerà il record DNS da creare e resterà in attesa.
2. Apri https://ap.www.namecheap.com/domains/list/ → accanto a `theproject.world` premi **Manage** → scheda **Advanced DNS** → **Add New Record**:
   - **Type**: `CNAME Record`
   - **Host**: `addiofa`
   - **Value**: `addiofa.pages.dev`
   - **TTL**: `Automatic`
   - premi la spunta verde per salvare.
3. Torna su Cloudflare → Custom domains → **Check DNS / Verify**. Dopo 1-15 minuti lo stato diventa **Active**. Apri `https://addiofa.theproject.world`.

(Se il tuo `theproject.world` invece è gestito da Cloudflare, al punto 1 Cloudflare aggiunge da solo il record e non devi fare il punto 2. Se compare un errore di conflitto con un Worker esistente (nel tuo account c'è un Worker chiamato `ofa`): apri Workers & Pages → `ofa` → Settings → Domains & Routes, togli da lì `addiofa.theproject.world` e riprova.)

## Blocco 4 · Firebase: login con Google e verifica email (5 minuti)

Apri https://console.firebase.google.com/project/mimetic-resolver-7szp9/authentication/providers

1. **Sign-in method → Google → Abilita** → scegli come email di assistenza `andolinaraffaele70@gmail.com` → **Salva**.
2. **Sign-in method → Aggiungi nuovo provider → Email/Password → Abilita**, poi accendi anche **«Link via email (accesso senza password)»** → **Salva**.
3. **Settings → Authorized domains → Aggiungi dominio** (due volte):
   - `addiofa.theproject.world`
   - `addiofa.pages.dev`

## Blocco 5 · Prove (5 minuti)

Apri `https://addiofa.theproject.world` da telefono, poi:

1. «Inizia il test di livello» → percorso completo → risultato.
2. Menu del profilo (icona in alto a destra) → **Community** → **Project ID** → **Accedi con Google**: si apre Google e torna «collegato».
3. Alla schermata «La tua email» del percorso (o in Project ID), con il tuo indirizzo `@mail.polimi.it`, premi **«Verifica con un link»**: arriva un'email da Firebase (guarda lo spam); il link riporta al sito.
4. Attiva la casella della classifica NOI: compare il tuo nome.
5. Per vedere le iscrizioni: Cloudflare → **Storage & Databases → D1 SQL database → atlas → Console**, incolla ed esegui:
   `SELECT email, nome, scuola, sede, livello, corso, anno, provenienza, consenso_comunicazioni FROM signups ORDER BY id;`
   (Sono dati personali: non condividerli.)
6. Sul telefono: menu del browser → «Aggiungi a schermata Home».

Se un passaggio non va, scrivimi quale e cosa vedi: ti dico il testo esatto da correggere.

## Blocco 6 · Facoltativo, quando vuoi

- Togli i due file non più usati: su GitHub apri `app/firebase-applet-config.json` → ⋯ → **Delete file** → Commit; poi lo stesso per `app/bun.lock`.
- Portare tutto su `main`: https://github.com/raffaele-ando/AddiOfa/compare/main...claude/folder-review-h3xnww → **Create pull request** → **Merge**; poi cambia il **Production branch** del Worker `atlas` e del progetto Pages in `main` (Settings → Builds).
- Pulizia del vecchio Worker `ofa`: solo se confermi che non ti serve più (non l'ho toccato).

---

## Cosa ho già fatto io (non devi rifarlo)

- Codice, test e build verdi; titolare e contatto compilati (`Raffaele Tiziano Andolina`, `andolinaraffaele70@gmail.com`); configurazione Firebase nel codice; server che accetta chiamate da `addiofa.theproject.world` e `addiofa.pages.dev`; intestazioni di sicurezza e cache, `robots.txt`, anteprime per i social, zoom abilitato su telefono.
- Database `atlas` nel tuo Cloudflare: migrazioni 0002 e 0003 applicate, tabelle verificate.

## Cosa NON funziona da solo (da sapere)

- **Email di conferma e disiscrizione per le comunicazioni**: non c'è un servizio di posta collegato (Firebase manda solo il link di verifica dell'email PoliMi). Per scrivere agli iscritti serve un servizio tuo (Brevo, Resend…) e l'invio lo fai tu.
- **Cancellare i dati di chi non ha Project ID**: dalla Console D1, con le istruzioni di `atlas/DEPLOY.md` (sezione 7).
- **L'email PoliMi del percorso resta «non verificata» sul server**: solo sul dispositivo di chi preme «Verifica» diventa verificata.
- **Non provato da me**: Cloudflare Pages/Workers e Firebase veri (i menu possono avere nomi un po' diversi), Safari, telefoni veri, lettore di schermo. I testi legali vanno rivisti da chi ne ha l'autorità.
