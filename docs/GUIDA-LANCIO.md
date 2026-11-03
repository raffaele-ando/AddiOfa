# Guida al lancio: solo browser, solo copia e incolla

Stato al 3/11: **tutto il collegamento è nel codice** (sul branch `main`). Sito, server (API di ATLAS), database, uso offline, app Android e pagina per scaricare le iscrizioni sono un unico progetto che Cloudflare pubblica da GitHub. Il database `atlas` nel tuo Cloudflare è già a posto (tabelle create). Restano solo le cose che richiedono i tuoi account: 4 blocchi, circa 25 minuti. I testi in `questo stile` si copiano così come sono.

Dominio: `addiofa.theproject.world` oggi non risponde a nessun sito (verificato) e `theproject.world` sembra gestito da **Namecheap**: per questo al blocco 2 si aggiunge un record DNS lì.

---

## Blocco 1 · Il progetto su Cloudflare Pages (10 minuti)

Un solo progetto contiene sito **e** server: niente secondo Worker, niente indirizzi da copiare.

1. Apri https://dash.cloudflare.com → **Workers & Pages** → **Create application** → scheda **Pages** → **Import an existing Git repository** → collega GitHub e scegli **AddiOfa**.
2. Compila i campi:
   - **Project name**: `addiofa`
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: `cd app && npm ci && npm run build`
   - **Build output directory**: `app/dist`
3. Apri **Environment variables (advanced)** e aggiungi una variabile (Production): nome `NODE_VERSION`, valore `20`.
4. **Save and Deploy**. Aspetta «Success».
5. Password per scaricare le iscrizioni: nel progetto **addiofa** → **Settings → Variables and Secrets → Add**:
   - **Type**: `Secret`
   - **Variable name**: `ADMIN_TOKEN`
   - **Value**: una password lunga (almeno 20 caratteri) generata da un gestore di password; conservala. (Ti ho dato in chat un valore pronto: non è scritto in questo file.)
   - **Save**, poi **Deployments → ⋯ sull'ultimo deploy → Retry deployment** (i segreti valgono dal deploy successivo).
6. Controlli, nel browser:
   - `https://addiofa.pages.dev` → deve comparire la landing.
   - `https://addiofa.pages.dev/v1/health` → deve rispondere con un messaggio che contiene `"ok":true`.

(Il database D1 `atlas`, le variabili e le origini consentite sono già dichiarati nel file `wrangler.jsonc` del repository: Cloudflare li applica da solo. Se invece al passo 4 compare un errore sul database, apri Settings → Functions → D1 database bindings e aggiungi: nome `DB`, database `atlas`.)

## Blocco 2 · Il tuo dominio `addiofa.theproject.world` (5-10 minuti)

1. Nel progetto Pages **addiofa** → **Custom domains** → **Set up a custom domain** → scrivi `addiofa.theproject.world` → **Continue**. Cloudflare ti mostra il record da creare e resta in attesa.
2. Apri https://ap.www.namecheap.com/domains/list/ → accanto a `theproject.world` premi **Manage** → scheda **Advanced DNS** → **Add New Record**:
   - **Type**: `CNAME Record`
   - **Host**: `addiofa`
   - **Value**: `addiofa.pages.dev`
   - **TTL**: `Automatic`
   - salva con la spunta verde.
3. Torna su Cloudflare → Custom domains → **Check DNS / Verify**. Dopo 1-15 minuti lo stato diventa **Active**. Apri `https://addiofa.theproject.world`.

(Se `theproject.world` è invece gestito da Cloudflare, al punto 1 il record si aggiunge da solo: salta il punto 2. Se compare un conflitto con un Worker esistente — nel tuo account c'è un Worker `ofa` — apri Workers & Pages → `ofa` → Settings → Domains & Routes, togli `addiofa.theproject.world` e riprova.)

## Blocco 3 · Firebase: login con Google e verifica email (5 minuti)

Apri https://console.firebase.google.com/project/mimetic-resolver-7szp9/authentication/providers

1. **Sign-in method → Google → Abilita** → come email di assistenza `andolinaraffaele70@gmail.com` → **Salva**.
2. **Sign-in method → Aggiungi nuovo provider → Email/Password → Abilita**, poi accendi anche **«Link via email (accesso senza password)»** → **Salva**.
3. **Settings → Authorized domains → Aggiungi dominio** (due volte): `addiofa.theproject.world` e `addiofa.pages.dev`.

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

- Un unico progetto: sito + API di ATLAS (`functions/v1`) + database D1 + origini consentite (`wrangler.jsonc`), provato in locale: sito, `/v1/health`, iscrizione, password dell'autore, scarico CSV.
- Uso offline (service worker): provato in Chromium con la rete spenta.
- App Android (APK) con Capacitor; workflow GitHub per ricostruirla.
- Database `atlas` nel tuo Cloudflare: migrazioni 0002 e 0003 applicate e verificate.
- Titolare e contatto (`Raffaele Tiziano Andolina`, `andolinaraffaele70@gmail.com`), configurazione Firebase, intestazioni di sicurezza e cache, `robots.txt`, anteprime social, pagina `?vista=admin`.

## Cosa NON funziona da solo (da sapere)

- **Email di conferma e disiscrizione per le comunicazioni**: non c'è un servizio di posta (Firebase manda solo il link di verifica dell'email PoliMi). Per scrivere agli iscritti serve un servizio tuo (Brevo, Resend…) e l'invio lo fai tu.
- **Cancellare i dati di chi non ha Project ID**: dalla Console D1, con le istruzioni di `atlas/DEPLOY.md` (sezione 7).
- **L'email PoliMi del percorso resta «non verificata» sul server**: solo sul dispositivo di chi preme «Verifica» diventa verificata.
- **Nell'app Android** «Accedi con Google» e il link di verifica email non sono disponibili (restano sul sito).
- **Non provato da me**: Cloudflare Pages e Firebase veri (i menu possono avere nomi un po' diversi), l'APK su un telefono vero, Safari/iPhone, lettore di schermo. I testi legali vanno rivisti da chi ne ha l'autorità.
