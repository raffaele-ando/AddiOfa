# Loghi puliti AddiOFA

Vettori SVG ricostruiti dai concept (lettermark = la A con la stella a cinque punte e base piatta, wordmark, lockup, stelle). Nessun `<text>`: le lettere sono tracciati.
`lettermark-*`, `wordmark-*`, `lockup-*`, `stella-*` su fondo chiaro; stessi nomi in `su-scuro/` (blu notte) e `su-blu/` (blu azione). `manifest.json` elenca le varianti con fonte NN.
Si rigenerano con `python3 grafica/brand/logo/genera-logo.py` (serve `app/node_modules/@fontsource/inter`); catalogo in `docs/design/logo/catalogo-logo.md`; galleria con `python3 tools/make-galleria-logo.py`.
`marchio-porta-stella.svg` (e `-pieno-campo` per le icone): il marchio scelto dall'autore il 24/11/2026 (tavola `grafica/fonti/ai-nuove/zip2-11.webp`); si rigenera con `python3 grafica/strumenti/brand/logo/marchio_porta_stella.py` e da lì le icone in `app/public/`.
