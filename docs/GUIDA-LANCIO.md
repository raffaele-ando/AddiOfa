# Guida al lancio: cosa fare, in ordine, con i comandi da copiare

Tempo: circa 45-60 minuti. Serve un computer con **Node 20 o più recente** e **git** (https://nodejs.org), un account **Cloudflare** gratuito (https://dash.cloudflare.com/sign-up) e l'accesso alla console **Firebase** del progetto `mimetic-resolver-7szp9` (https://console.firebase.google.com/project/mimetic-resolver-7szp9). Il sito (parte statica) funziona anche senza i passi 2-6: domande, correzione, simulazioni e progressi sono nel browser. I passi 2-6 servono a far funzionare Project ID, classifica NOI, iscrizioni e verifica dell'email.

Ordine: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8.

## 0. Scarica il codice

```bash
git clone https://github.com/raffaele-ando/AddiOfa.git
cd AddiOfa
git checkout claude/folder-review-h3xnww      # il branch con tutto il lavoro; quando vuoi lo porti su main tu
```

## 1. Decidi l'indirizzo del sito (serve per i passi dopo)

Con Cloudflare Pages l'indirizzo è `https://NOME.pages.dev`. Scegli **NOME** adesso (minuscolo, senza spazi, esempio `addiofa`). Se `addiofa` è già preso da altri ti darà un'altra proposta al passo 6: se cambia, ripeti i passi 3 (`ALLOWED_ORIGINS`) e 4 (dominio autorizzato) con quello vero. Un dominio tuo (es. `addiofa.it`) si aggiunge dopo da Cloudflare Pages → Custom domains e va aggiunto allo stesso modo ai passi 3 e 4.

Da qui in poi `SITO` = `https://NOME.pages.dev`.

## 2. Pubblica il server ATLAS (Cloudflare Worker + database)

```bash
cd atlas
npm ci
npx wrangler login                    # si apre il browser: accedi a Cloudflare e conferma
npx wrangler d1 list                  # deve comparire un database "atlas"
```

- Se **compare** `atlas` con id `fae6dddc-a787-474b-9699-e23bab53eb4d`: vai avanti.
- Se **non compare**: `npx wrangler d1 create atlas`, copia il `database_id` che stampa e incollalo in `atlas/wrangler.jsonc` al posto dell'id attuale.

Crea le tabelle nel database vero:

```bash
npx wrangler d1 migrations apply atlas --remote      # conferma con "y": applica 0001, 0002, 0003
```

Imposta l'indirizzo del sito che può chiamare il server: apri `atlas/wrangler.jsonc` e cambia

```jsonc
"ALLOWED_ORIGINS": ""
```
in
```jsonc
"ALLOWED_ORIGINS": "https://NOME.pages.dev"
```
(se hai anche un dominio tuo: `"https://NOME.pages.dev,https://addiofa.it"`, senza barra finale).

Segreto per scaricare le iscrizioni (conservalo in un gestore di password):

```bash
openssl rand -base64 32               # copia l'output
npx wrangler secret put ADMIN_TOKEN   # incolla l'output quando lo chiede
```

Pubblica:

```bash
npx wrangler deploy
```
Alla fine stampa un indirizzo `https://atlas.QUALCOSA.workers.dev`: **copialo**, è `ATLAS_URL`. Controllo:

```bash
curl https://atlas.QUALCOSA.workers.dev/v1/health        # deve rispondere con "ok"
```

## 3. Firebase: login con Google e verifica email (console, a mano)

Apri https://console.firebase.google.com/project/mimetic-resolver-7szp9/authentication/providers e:

1. **Authentication → Sign-in method → Google → Abilita**, scegli l'email di assistenza del progetto, **Salva**.
2. **Sign-in method → Email/Password → Abilita**, poi attiva anche **«Link via email (accesso senza password)»**, **Salva**. (La verifica dell'email PoliMi funziona con questo: Firebase invia lui l'email col link.)
3. **Authentication → Settings → Authorized domains → Add domain**: aggiungi `NOME.pages.dev` (e il tuo dominio, se ne hai uno).
4. Consigliato: in https://console.cloud.google.com/apis/credentials seleziona la «Browser key» del progetto → **Restrizioni applicazione: Referrer HTTP** → aggiungi `https://NOME.pages.dev/*` (e `https://mimetic-resolver-7szp9.firebaseapp.com/*`). Non è un segreto, ma così non la usa nessun altro.

## 4. Compila i tuoi dati (due righe)

Apri `app/src/config/offer.ts` e sostituisci:

```ts
export const CONTACT_EMAIL: string | undefined = undefined;
```
con il tuo indirizzo di contatto (compare nelle pagine legali, in Segnala e nella cancellazione dei dati):
```ts
export const CONTACT_EMAIL: string | undefined = 'tua.email@esempio.it';
```
e il titolare:
```ts
export const TITOLARE: { nome: string; responsabile?: string; indirizzo?: string } = { nome: 'Project', responsabile: 'Nome Cognome' };
```
Il testo delle pagine legali lo fai rivedere da chi ne ha l'autorità: sono in `app/src/legal/` (`privacy.ts`, `termini.ts`, `cookie.ts`) e nelle FAQ `app/src/lib/servizi/faq.ts`.

## 5. Costruisci il sito con i collegamenti

Sostituisci `ATLAS_URL` con l'indirizzo del passo 2 e lancia (tutto su una riga per variabile, così com'è):

```bash
cd ../app
npm ci
export VITE_ATLAS_API_URL="https://atlas.QUALCOSA.workers.dev"
export VITE_FIREBASE_API_KEY="AIzaSyARzkGVZMnvklPOqtxFkW2fgUs5Ygptum0"
export VITE_FIREBASE_AUTH_DOMAIN="mimetic-resolver-7szp9.firebaseapp.com"
export VITE_FIREBASE_PROJECT_ID="mimetic-resolver-7szp9"
export VITE_FIREBASE_APP_ID="1:92251035376:web:0e0b135d58c86431495435"
npm run build
```
(La chiave e l'id sono quelli di `app/firebase-applet-config.json`; non sono segreti.) Se un valore è sbagliato l'app non si rompe: dice «non collegato» e tiene i dati nel dispositivo.

## 6. Pubblica il sito su Cloudflare Pages

Ancora da `app/`:

```bash
npx wrangler pages project create NOME --production-branch main    # solo la prima volta
npx wrangler pages deploy dist --project-name NOME --branch main
```
Stampa l'indirizzo del sito (`https://NOME.pages.dev`). Aprilo da telefono e da computer.

(Alternativa senza terminale: Cloudflare → Workers & Pages → Create → Pages → Connect to Git → repository `AddiOfa` → Build command `cd app && npm ci && npm run build`, Output directory `app/dist`, Environment variables: `NODE_VERSION=20` e le cinque `VITE_*` sopra. Ogni push ricostruisce il sito.)

## 7. Controlli finali (5 minuti)

1. Apri `https://NOME.pages.dev`: landing → «Inizia il test di livello» → percorso → risultato.
2. Profilo → **Community** → **Project ID** → **Accedi con Google**: deve aprire la finestra di Google e tornare «collegato».
3. Verifica email: nel percorso, alla schermata «La tua email», o in Community → Project ID, con il tuo indirizzo `@mail.polimi.it` premi **«Verifica con un link»**: arriva un'email di Firebase (controlla lo spam), il link riporta al sito e l'email passa da «Non verificata» a verificata (solo sul tuo dispositivo; il server continua a registrarla come non verificata).
4. NOI: attiva la classifica con la casella: compare il tuo nome.
5. Iscrizioni: dopo il percorso, le righe arrivano al server. Per scaricarle:

```bash
export ATLAS=https://atlas.QUALCOSA.workers.dev
export ADMIN_TOKEN='il segreto del passo 2'
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$ATLAS/v1/admin/signups?formato=csv" -o iscrizioni.csv
```
(Solo chi ha dato il consenso «comunicazioni»: aggiungi `&comunicazioni=1`. Il file contiene dati personali: non metterlo nel repository.)
6. Installabile da telefono: menu del browser → «Aggiungi a schermata Home».

## 8. Pulizia e aggiornamenti

- Togli dal repository `app/firebase-applet-config.json` e `app/bun.lock` (non servono più: i valori sono nelle variabili del passo 5): `git rm app/firebase-applet-config.json app/bun.lock && git commit -m "Tolti file non più usati" && git push`.
- Per aggiornare il sito dopo ogni modifica: ripeti i passi 5 e 6 (le variabili `VITE_*` vanno rimesse nella stessa shell).
- Per portare il lavoro su `main`: apri tu la richiesta di merge su GitHub (https://github.com/raffaele-ando/AddiOfa/compare/main...claude/folder-review-h3xnww).

## Cosa NON funziona da solo (da sapere)

- **Email di conferma per le comunicazioni (double opt-in) e disiscrizione da email**: non c'è un servizio di posta collegato (Firebase manda solo il link di verifica dell'email PoliMi). Per scrivere agli iscritti serve un servizio di posta (Resend, Brevo, Mailgun…) e un invio fatto da te: l'app non invia nulla da sola.
- **Cancellazione dati di chi non ha Project ID**: si fa a mano (comandi in `atlas/DEPLOY.md`, sezione 7).
- **L'email PoliMi inserita nel percorso resta «non verificata»** finché la persona non preme «Verifica» e clicca il link ricevuto.
- **Non provato da me**: Cloudflare vero, Firebase vero (Google, link email), Safari/iPhone e telefoni veri, lettore di schermo. Al primo collegamento controlla i punti del passo 7.
- **Testi legali**: da far rivedere a chi ne ha l'autorità prima di promuovere il sito.
