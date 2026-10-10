# Versione dimostrativa (Artifact)

Una sola pagina HTML, senza rete esterna, che si pubblica come pagina claude.ai. Serve a far provare l'app; non è il prodotto vero.

## Come si ricostruisce

In `app/`:

```
npm install
npm run build:demo
```

Il comando fa tre cose di seguito:

1. `vite build --config vite.demo.config.ts` produce `app/dist-demo/index.html` a file unico (JavaScript, CSS, font e immagini incorporati).
2. `tools/make-artifact.mjs` lo trasforma in `app/dist-demo/artifact.html`: niente `<!doctype>`, `<html>`, `<head>` o `<body>`, con il `<title>` in cima e il tema chiaro/scuro letto dal visualizzatore.
3. `tools/check-artifact.mjs` controlla il risultato e stampa un riepilogo.

Per rifare solo il controllo: `npm run check:demo`. Il controllo fallisce se la pagina pesa più di 8 MB o se trova host esterni (`fonts.googleapis`, `fonts.gstatic`, `identitytoolkit`, `googleapis.com`, `firebaseio`), chiamate a `alert(`, `confirm(`, `prompt(`, `serviceWorker.register`, link con `download`, `window.print`, oppure i tag `<html`, `<head`, `<body`. L'obiettivo di peso è sotto i 3 MB (sopra, avvisa senza fallire).

## Come si ripubblica

Pubblicare `app/dist-demo/artifact.html` come Artifact (stesso indirizzo, aggiornandolo). Prima di pubblicare, guardare la pagina in Chromium a 400 px, in tema chiaro e scuro, con la rete esterna bloccata (si usa lo schema di `docs/lavoro/brief-agenti.md`).

Se cambia la grafica in `grafica/brand/`, rilanciare `tools/sincronizza-essenziali.sh` prima della build: copia in `app/src/brand/essenziali/` solo ciò che l'app spedisce e ottimizza gli SVG senza cambiarne l'aspetto (`tools/ottimizza-svg.mjs`, usa `svgo`).

## Come è fatta per restare leggera

- Il build demo imposta `VITE_MODE=demo`: Firebase e le altre integrazioni non entrano nel bundle (si caricano solo a richiesta, e in demo mai).
- Il catalogo della grafica (`?brand`, `src/brand/BrandKit.tsx`) è sostituito da `BrandKitStub.tsx` con un alias in `vite.demo.config.ts`; non modifica `App.tsx`.
- Font Inter solo latin e solo woff2, 5 pesi (400, 500, 600, 700, 800), definiti in `src/brand/brand.css`.
- Solo grafica del kit rosso (le schermate non usano il kit blu); il logo grande in SVG è sostituito dall'icona PNG.
- L'app normale (`npm run build`) non cambia: stessi file, percorsi relativi (`./`), font incorporati e nessun caricamento da Google.

## Cosa è dimostrativo e cosa no

Dimostrativo:

- Il blocco del Pass è solo grafico: "Sblocca il Pass in prova" lo toglie sul dispositivo, senza pagamento.
- Le domande, comprese quelle a pagamento, sono nel JavaScript della pagina: chiunque può leggerle.
- I progressi stanno nel browser del visitatore (`localStorage`, se disponibile); non c'è account, né sincronizzazione, né esportazione.
- La lista d'attesa e gli inviti non raggiungono nessun server.

Funziona davvero:

- Diagnostico da 10 domande con probabilità calcolata, ripasso, simulazioni nei due formati (`ente` e `teng`), statistiche, tema chiaro e scuro, uso a 400 px.

Non c'è, per scelta della versione online:

- Nessun pagamento, nessun login, nessun Firebase, nessun service worker, nessun download dalla pagina, nessuna richiesta di rete.
- Il vero controllo dell'accesso lo fa il server in `pass/`, non questa pagina.

Prova di fattibilità (10 ottobre 2026): il bundle a file unico parte con `<script type="module">` incorporato, font Inter incorporato, tema chiaro e scuro, nessun errore in console con la rete esterna bloccata (provato in Chromium locale; la CSP reale della pagina online non è riproducibile qui).
