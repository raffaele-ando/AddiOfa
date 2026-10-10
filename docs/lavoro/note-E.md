# Note agente E (build demo e peso)

## Fatto

- Peso di `artifact.html`: da 5,24 MB a 1,91 MB (obiettivo 3 MB, limite 8 MB). Misurato con un build che sostituisce solo le schermate non ancora scritte (`screens/Theory`) con un componente vuoto; il comando vero `npm run build:demo` si ferma finché `screens/Theory.tsx` non esiste.
- Font: `brand.css` definisce a mano i 5 `@font-face` (400, 500, 600, 700, 800) solo woff2 latin, circa 24 KB l'uno (160 KB in tutto). Non ho ridotto a 3 pesi: il codice usa `font-medium/semibold/bold/extrabold` ovunque. `main.tsx` importa `brand.css`, così il font c'è sempre. `index.css` non cita più Nunito Sans (non veniva più caricato). `brand/tokens.ts` (non mio) ha ancora 'Nunito Sans' nello stack: è solo un ripiego, innocuo.
- SVG: `tools/ottimizza-svg.mjs` (usa `svgo`, in devDependencies) viene chiamato da `tools/sincronizza-essenziali.sh`; i glifi passano da 1558 a 610 KB, i disegni da 334 a 278 KB. Confronto pixel a 400x400 su tutti i 110 file: differenza massima su una manciata di pixel di bordo (antialiasing), nessuna differenza visibile. `essenziali/` è stato rigenerato dallo script.
- Kit blu e logo: `risorse.ts` carica il kit blu (glifi e disegni) solo se `VITE_MODE !== 'demo'` (il ternario con costante sparisce dal build). `urlLogo` in demo è l'icona PNG da 6 KB invece dell'SVG da 469 KB (`Logo` lo usa solo il catalogo ?brand). Nel bundle demo restano solo i 14 glifi e le illustrazioni del kit rosso (62 SVG, chiari e scuri).
- `vite.demo.config.ts`: `define import.meta.env.VITE_MODE = 'demo'`; alias di `./brand/BrandKit` verso `src/brand/BrandKitStub.tsx`. Nota: ora `App.tsx` carica BrandKit solo con `import.meta.env.DEV`, quindi in produzione il catalogo non entra comunque; l'alias resta come rete di sicurezza.
- Firebase: non è più nel bundle demo (nessuna traccia di `identitytoolkit`, `googleapis.com`, `firebase/auth`). Anche `alert/confirm/prompt` sono spariti (il controllo lo verifica).
- `tools/check-artifact.mjs` (nuovo) con riepilogo; `npm run build:demo` = build + make-artifact + check; `npm run check:demo`. Il controllo avvisa sopra 3 MB e fallisce sopra 8 MB o a ogni divieto trovato. Provato su un build vecchio (fallisce giustamente per Firebase e `confirm(`) e su quello nuovo (passa).
- `index.html` e `public/manifest.json`: percorsi `./`; tolti i font da Google e i preconnect; lo script del tema ora ha `try/catch` (make-artifact lo riconosce ancora dalla stringa `localStorage.getItem('theme')` e lo sostituisce col proprio).
- `.env.example` riscritto (`VITE_MODE`, `VITE_API_URL`, `VITE_STRIPE_LINK`, `VITE_PAYMENTS_ENABLED`, `VITE_ATLAS_API_URL`), `vite-env.d.ts` con i tipi, `engines.node >=20`, `DEMO.md` aggiornato.
- Normal build (`vite build`) provato con la stessa sostituzione: riesce, nessun font da Google, percorsi relativi, Firebase in un chunk a parte non precaricato.
- Chromium a 400 px, chiaro e scuro, rete esterna bloccata: landing e menu senza errori né scorrimento orizzontale.

## Cosa non mi convince

- Il bundle normale ha ancora 918 KB di Firebase (chunk separato, caricato a richiesta) e 408 KB di Recharts: non toccato.
- Il logo SVG da 469 KB resta così com'è per il catalogo; se serve altrove va semplificato in `grafica/`.
- `package-lock.json` è cambiato per l'aggiunta di `svgo` (solo sviluppo).
- Le versioni Node: `engines >=20`; Vite 6 chiede 18+, `bun.lock` è rimasto accanto a `package-lock.json` (non ne ho scelto uno).

## Richieste ad altri

- Chi scrive `screens/Theory.tsx` (agente H): finché manca, `npm run build:demo` fallisce.
- Nessuno deve importare `brand/BrandKit` o il kit blu fuori da `import.meta.env.DEV`, altrimenti rientrano nel peso del normale (non nella demo: lì il kit blu è escluso e BrandKit sostituito).
