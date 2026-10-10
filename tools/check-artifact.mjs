// Controlla app/dist-demo/artifact.html prima di pubblicarlo come Artifact: peso, rete esterna e funzioni vietate.
// Esce con codice 1 se qualcosa non va; stampa sempre un riepilogo. Uso: node tools/check-artifact.mjs [file]
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const radice = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(process.argv[2] ?? resolve(radice, 'app/dist-demo/artifact.html'));
if (!existsSync(file)) { console.error(`${file} non esiste: eseguire prima npm run build:demo`); process.exit(1); }

const MAX_MB = 8;
const OBIETTIVO_MB = 3;
const testo = readFileSync(file, 'utf8');
const byte = Buffer.byteLength(testo);
const mb = byte / 1048576;

// Ogni regola: nome, espressione, cosa significa. Il conteggio è sul testo intero (JavaScript compreso).
const divieti = [
  ['host esterno: fonts.googleapis', /fonts\.googleapis/g],
  ['host esterno: fonts.gstatic', /fonts\.gstatic/g],
  ['host esterno: identitytoolkit', /identitytoolkit/g],
  ['host esterno: googleapis.com', /googleapis\.com/g],
  ['host esterno: firebaseio', /firebaseio/g],
  ['alert(', /(?<![\w$.])(?:window\.)?alert\s*\(/g],
  ['confirm(', /(?<![\w$.])(?:window\.)?confirm\s*\(/g],
  ['prompt(', /(?<![\w$.])(?:window\.)?prompt\s*\(/g],
  ['serviceWorker.register', /serviceWorker\s*\.\s*register/g],
  ['<a ... download', /<a\s[^>]*\bdownload\b/gi],
  ['window.print', /window\s*\.\s*print\b/g],
  ['<html', /<html[\s>]/gi],
  ['<head', /<head[\s>]/gi],
  ['<body', /<body[\s>]/gi],
];

let errori = 0;
console.log(`File: ${file}`);
console.log(`Peso: ${mb.toFixed(2)} MB (limite ${MAX_MB} MB, obiettivo ${OBIETTIVO_MB} MB)`);
if (mb > MAX_MB) { console.log(`  ERRORE: supera ${MAX_MB} MB`); errori++; }
else if (mb > OBIETTIVO_MB) console.log(`  attenzione: sopra l'obiettivo di ${OBIETTIVO_MB} MB`);

for (const [nome, re] of divieti) {
  const trovati = [...testo.matchAll(re)];
  const stato = trovati.length ? 'ERRORE' : 'ok';
  console.log(`  ${stato.padEnd(6)} ${nome}: ${trovati.length}`);
  if (trovati.length) {
    errori++;
    for (const m of trovati.slice(0, 3)) {
      const i = m.index ?? 0;
      console.log(`           ...${testo.slice(Math.max(0, i - 50), i + 70).replace(/\s+/g, ' ')}...`);
    }
  }
}

// Informazioni utili a capire il peso (non fanno fallire il controllo).
const dataUri = [...testo.matchAll(/data:([\w/+.-]+)[;,]/g)].reduce((m, x) => ((m[x[1]] = (m[x[1]] ?? 0) + 1), m), {});
console.log(`Risorse incorporate (data:): ${Object.entries(dataUri).map(([t, n]) => `${t} x${n}`).join(', ') || 'nessuna'}`);
console.log(`Righe ${testo.split('\n').length}; <script>: ${(testo.match(/<script/g) ?? []).length}; <style>: ${(testo.match(/<style/g) ?? []).length}`);
console.log(errori ? `\nCONTROLLO FALLITO (${errori})` : '\nControllo superato');
process.exit(errori ? 1 : 0);
