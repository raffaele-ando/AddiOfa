# Note del lavoro sul logo

Agente: loghi puliti, galleria con mescolatore, icone degli store. Cartelle mie: `grafica/brand/logo/`, `tools/make-galleria-logo.py`, `app/dist-demo/galleria-logo.html`, `docs/design/store/`, `docs/design/logo/`.
Non toccati: `app/src/**`, il logo 3D (`addiofa-logo.svg`, `app/public/icon-*.png`). Nessun git, nessun rm (due file di prova spostati nello scratchpad).

## Fatto
- 45 varianti (10 lettermark, 9 wordmark, 11 lockup di cui 2 copiati dal 3D, 15 stelle) in 3 versioni per fondo = 135 SVG validi con `xml.dom.minidom`, resi in Chromium come data URI.
- Galleria unica da 0,70 MB: sezioni A-G, mescolatore con intestazione 390 px e piè di pagina, riepilogo e testo copiabile, salvataggio `db` (`scelte/<sezione>`, `scelte/mescolatore`) con ripiego `localStorage`.
- Icone store in `docs/design/store/`.

## Provato (Chromium headless 400 e 1280 px, chiaro e scuro)
Zero errori e zero avvisi in console, nessuno scorrimento orizzontale (scrollWidth = larghezza finestra). Clic su «Scelgo» (una per sezione, evidenziata, nota), «Provo nel mescolatore», disposizioni e fondi, «Scelgo questa combinazione», riepilogo, persistenza dopo il ricaricamento. **Non provato**: la capacità `db` vera (serve la pubblicazione come Artifact; qui il ripiego locale), Safari/Firefox, schermi veri.

## Da sapere
- Il blu navy del logo (#071438) è misurato sui concept, diverso da `--brand-primario`.
- Dopo la scelta dell'utente: copiare i file scelti in `app/src/brand/essenziali/` con `npm run grafica:sync` (aggiungere i percorsi) e sostituire il logo nell'intestazione e nel piè di pagina; non fatto qui.
- Dettagli e dubbi: `docs/design/logo/catalogo-logo.md`.
