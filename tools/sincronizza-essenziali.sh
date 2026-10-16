#!/usr/bin/env bash
# Copia in app/src/brand/essenziali/ solo la grafica che l'app spedisce davvero (illustrazioni pulite, glifi, logo).
# Le sorgenti restano in grafica/brand/; rilanciare dopo ogni modifica alle illustrazioni o al logo.
set -euo pipefail
RADICE="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$RADICE/app/src/brand/essenziali"
# si rifanno solo le cartelle di disegni, glifi e logo; hero, landing e icone si sovrascrivono più sotto (non si svuota tutto: altri lavori li toccano)
rm -rf "$DEST/disegni" "$DEST/glifi" "$DEST/logo"
mkdir -p "$DEST/disegni" "$DEST/glifi" "$DEST/logo"
# prima di copiare, le sorgenti vanno aggiornate (da grafica/): blu_da_rosso.py, porta_in_disegni.py, scuro_svg.py (vedi grafica/strumenti/brand/README.md)
# illustrazioni ridisegnate pulite (chiare e scure), senza i file .maglie.svg (3 MB di lavoro intermedio)
( cd "$RADICE/grafica/brand/disegni" && find . -name '*.svg' ! -name '*.maglie.svg' -print0 | while IFS= read -r -d '' f; do mkdir -p "$DEST/disegni/$(dirname "$f")"; cp "$f" "$DEST/disegni/$f"; done )
cp -r "$RADICE/grafica/brand/glifi/"* "$DEST/glifi/"
find "$DEST/glifi" -name '*.json' -delete
cp "$RADICE/grafica/strumenti/brand/logo/addiofa-logo.svg" "$DEST/logo/"
# versione senza il fondo chiaro, per metterlo sulla scena della landing (cielo, tema scuro)
sed 's#<rect id="fondo"[^>]*/>##' "$RADICE/grafica/strumenti/brand/logo/addiofa-logo.svg" > "$DEST/logo/addiofa-logo-scena.svg"
# ottimizzazione senza cambiare l'aspetto (percorsi relativi, niente metadati): i glifi ricalcati pesano 3 volte meno
node "$RADICE/tools/ottimizza-svg.mjs" "$DEST/glifi" 1
node "$RADICE/tools/ottimizza-svg.mjs" "$DEST/disegni" 2
# la nuvoletta chiara dietro alle illustrazioni non si usa più
node "$RADICE/tools/togli-nuvole.mjs" "$DEST/disegni"
# scena dell'hero della landing (ritagliata dai concept con grafica/strumenti/brand/estrai_hero.py)
mkdir -p "$DEST/hero" && cp "$RADICE/grafica/brand/hero/scena-chiara.webp" "$RADICE/grafica/brand/hero/scena-scura.webp" "$DEST/hero/"
# banner con l'edificio e sfondo della chiusura della landing (grafica/strumenti/brand/estrai_landing.py)
mkdir -p "$DEST/landing" && cp "$RADICE/grafica/brand/landing/"*.webp "$DEST/landing/"
mkdir -p "$DEST/icone" && cp "$RADICE/app/public/favicon-64.png" "$DEST/icone/"
du -sh "$DEST"; find "$DEST" -type f | wc -l
