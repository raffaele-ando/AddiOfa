#!/usr/bin/env bash
# Copia in app/src/brand/essenziali/ solo la grafica che l'app spedisce davvero (illustrazioni pulite, glifi, logo).
# Le sorgenti restano in grafica/brand/; rilanciare dopo ogni modifica alle illustrazioni o al logo.
set -euo pipefail
RADICE="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$RADICE/app/src/brand/essenziali"
rm -rf "$DEST"
mkdir -p "$DEST/disegni" "$DEST/glifi" "$DEST/logo"
# illustrazioni ridisegnate pulite (chiare e scure), senza i file .maglie.svg (3 MB di lavoro intermedio)
( cd "$RADICE/grafica/brand/disegni" && find . -name '*.svg' ! -name '*.maglie.svg' -print0 | while IFS= read -r -d '' f; do mkdir -p "$DEST/disegni/$(dirname "$f")"; cp "$f" "$DEST/disegni/$f"; done )
cp -r "$RADICE/grafica/brand/glifi/"* "$DEST/glifi/"
find "$DEST/glifi" -name '*.json' -delete
cp "$RADICE/grafica/strumenti/brand/logo/addiofa-logo.svg" "$DEST/logo/"
# ottimizzazione senza cambiare l'aspetto (percorsi relativi, niente metadati): i glifi ricalcati pesano 3 volte meno
node "$RADICE/tools/ottimizza-svg.mjs" "$DEST/glifi" 1
node "$RADICE/tools/ottimizza-svg.mjs" "$DEST/disegni" 2
mkdir -p "$DEST/icone" && cp "$RADICE/app/public/favicon-64.png" "$DEST/icone/"
du -sh "$DEST"; find "$DEST" -type f | wc -l
