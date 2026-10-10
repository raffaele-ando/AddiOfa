# Versione dimostrativa (Artifact)

Build: `npm run build:demo` (in `app/`) → `app/dist-demo/index.html` a file unico; poi `node tools/make-artifact.mjs` → `app/dist-demo/artifact.html`, che si pubblica come pagina claude.ai.

Prova di fattibilità (10 ottobre 2026): il bundle a file unico parte con `<script type="module">` incorporato, font Inter incorporato, tema chiaro e scuro, nessun errore in console con la rete esterna bloccata (provato in Chromium locale; la CSP reale della pagina online non è riproducibile qui).

Cosa è dimostrativo: in questa versione il blocco del Pass è solo grafico. Le domande sono nel JavaScript della pagina e i dati restano sul dispositivo. Il vero controllo lo fa il server in `pass/`.
