# Come pubblicare il sito

AddiOFA è un sito **statico**: dopo la costruzione sono solo file (HTML, JavaScript, CSS, font, immagini). Non c'è un server da tenere acceso, nessuna variabile d'ambiente, nessun database, nessun account. Per questo regge qualsiasi numero di studenti nello stesso momento: il carico è solo quello di servire i file, e lo fa qualunque hosting statico o CDN. (Il banco di 600+ domande è dentro il JavaScript della pagina: la correzione avviene nel browser di chi studia.)

## Costruire

```bash
cd app
npm ci
npm run build      # scrive la cartella app/dist/
```

`dist/` contiene `index.html`, `assets/` e i file pubblici (icone, `manifest.json`). I percorsi sono relativi (`base: './'`): la cartella si può mettere alla radice di un dominio o in una sottocartella senza cambiare nulla. Non serve nessuna regola di riscrittura degli indirizzi: c'è una sola pagina, e i link con parametri (`?sfida=...`, `?vista=...`) la riaprono.

Prova locale del sito costruito: `npm run preview` (http://localhost:4173).

## Pubblicare su qualsiasi hosting statico

Si copia il **contenuto** di `app/dist/` nel posto da cui il sito viene servito.

- **Un server web qualsiasi** (Apache, nginx, hosting condiviso): copiare `dist/` nella cartella pubblica.
- **Cloudflare (Workers, da GitHub)**: vedi `docs/GUIDA-LANCIO.md`, blocco 1. Netlify, Vercel, GitHub Pages: comando di build `npm run build`, cartella di base `app`, cartella di uscita `dist`; per questi hosting il server ATLAS non c'è (le iscrizioni restano nel dispositivo).
- Consigliato HTTPS (lo fanno tutti i servizi sopra): serve a salvare i progressi nel browser in modo affidabile e a usare il sito come app sul telefono («Aggiungi alla schermata Home»).

Uso offline: il sito registra un service worker (`sw.js`, generato dalla build con vite-plugin-pwa) che salva tutti i file (circa 4 MB) alla prima visita; da lì in poi si apre anche senza rete e si può installare («Installa app» in Chrome, «Aggiungi a schermata Home» su iPhone). Si aggiorna da solo alla visita successiva a una nuova pubblicazione. Le funzioni che richiedono il server (iscrizioni, classifica NOI, Project ID) dicono «non collegato» finché non c'è rete.

## Aggiornare

- Contenuti (domande, teoria, spiegazioni): si modificano in `contenuti/`, poi dalla radice `npm run contenuti:valida` e `npm run contenuti` (riscrive `app/src/data/questions.ts` e `theory.ts`), poi si ricostruisce il sito.
- Grafica: `npm run grafica:sync` dalla radice, poi si ricostruisce.
- Prima di pubblicare: `npm run check` dalla radice (link dei documenti, tipi, prove, build).

## I dati degli studenti

Stanno solo nel browser di ciascuno (`localStorage`): non passano da nessun server e non si possono recuperare da qui. Chi cancella i dati del sito o cambia dispositivo li perde, a meno che non li abbia esportati in un file dalle Impostazioni (e li reimporti). I vecchi salvataggi delle versioni precedenti si leggono ancora: le simulazioni nel vecchio formato a cinque opzioni (TENG) non vengono contate.

## Comodità: la versione a pagina unica

`npm run build:demo` (dalla cartella `app/`) produce `app/dist-demo/index.html`, un solo file con tutto incorporato (JavaScript, CSS, font, immagini), e `app/dist-demo/artifact.html`, la stessa pagina nel formato per essere incollata in una pagina claude.ai (senza `<html>`, `<head>`, `<body>`). Poi `tools/check-artifact.mjs` controlla peso (limite 8 MB, obiettivo 3 MB), rete esterna e funzioni vietate (`alert(`, `confirm(`, `prompt(`, `serviceWorker.register`, `window.print`, host esterni). È la stessa app: nessuna funzione è tolta o simulata. Se cambia la grafica, rilanciare prima `npm run grafica:sync` dalla radice.

## ATLAS: iscrizioni, Project ID, classifica NOI

Sul sito pubblicato da Cloudflare l'API di ATLAS è **nello stesso progetto**: il Worker dichiarato in `wrangler.jsonc` alla radice usa `atlas/src` per le richieste a `/v1/*` e serve la cartella `app/dist` per il resto; il database D1 e le variabili stanno nello stesso file. Non servono un secondo Worker né variabili di build: l'app usa da sola l'indirizzo del sito (da https). L'unico segreto, `ADMIN_TOKEN`, si imposta nel pannello di Pages; la pagina `?vista=admin` del sito scarica le iscrizioni in CSV con quella password. Guida passo per passo: `docs/GUIDA-LANCIO.md`.
