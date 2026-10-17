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
- **Cloudflare Pages, Netlify, Vercel, GitHub Pages**: comando di build `npm run build`, cartella di base `app`, cartella di uscita `dist`. Nessuna variabile d'ambiente.
- Consigliato HTTPS (lo fanno tutti i servizi sopra): serve a salvare i progressi nel browser in modo affidabile e a usare il sito come app sul telefono («Aggiungi alla schermata Home»).

Cosa il sito **non** fa: non c'è un service worker, quindi per aprirlo serve la connessione; una volta caricato, domande e correzioni sono già nella pagina e non chiede altro alla rete. L'uso offline completo non è fornito.

## Aggiornare

- Contenuti (domande, teoria, spiegazioni): si modificano in `contenuti/`, poi dalla radice `npm run contenuti:valida` e `npm run contenuti` (riscrive `app/src/data/questions.ts` e `theory.ts`), poi si ricostruisce il sito.
- Grafica: `npm run grafica:sync` dalla radice, poi si ricostruisce.
- Prima di pubblicare: `npm run check` dalla radice (link dei documenti, tipi, prove, build).

## I dati degli studenti

Stanno solo nel browser di ciascuno (`localStorage`): non passano da nessun server e non si possono recuperare da qui. Chi cancella i dati del sito o cambia dispositivo li perde, a meno che non li abbia esportati in un file dalle Impostazioni (e li reimporti). I vecchi salvataggi delle versioni precedenti si leggono ancora: le simulazioni nel vecchio formato a cinque opzioni (TENG) non vengono contate.

## Comodità: la versione a pagina unica

`npm run build:demo` (dalla cartella `app/`) produce `app/dist-demo/index.html`, un solo file con tutto incorporato (JavaScript, CSS, font, immagini), e `app/dist-demo/artifact.html`, la stessa pagina nel formato per essere incollata in una pagina claude.ai (senza `<html>`, `<head>`, `<body>`). Poi `tools/check-artifact.mjs` controlla peso (limite 8 MB, obiettivo 3 MB), rete esterna e funzioni vietate (`alert(`, `confirm(`, `prompt(`, `serviceWorker.register`, `window.print`, host esterni). È la stessa app: nessuna funzione è tolta o simulata. Se cambia la grafica, rilanciare prima `npm run grafica:sync` dalla radice.

## I Worker

## ATLAS: iscrizioni, Project ID, classifica NOI

Il sito funziona da solo, ma le iscrizioni (nome, email PoliMi, corso), l'accesso con Google e la classifica NOI passano dal Worker ATLAS in `atlas/`. Finché non è pubblicato l'app lo dice («in attesa di collegamento») e tiene le iscrizioni in coda nel dispositivo, poi le invia da sola. Per collegarlo: pubblica il Worker (`atlas/DEPLOY.md`), poi imposta alla build `VITE_ATLAS_API_URL` e le `VITE_FIREBASE_*` (elenco in `app/.env.example`) e metti il dominio del sito in `ALLOWED_ORIGINS` del Worker. Prima del lancio compila `TITOLARE` e `CONTACT_EMAIL` in `app/src/config/offer.ts` e fai rivedere i testi legali.
