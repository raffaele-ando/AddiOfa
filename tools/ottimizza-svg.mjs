// Ottimizza gli SVG di una cartella (in luogo) senza cambiarne l'aspetto: percorsi relativi, numeri a precisione fissa,
// niente metadati. Gli id restano (le illustrazioni usano gradienti e clip-path con id) e il viewBox resta.
// Uso: node tools/ottimizza-svg.mjs <cartella> [precisione]   (precisione di default: 2; i glifi ricalcati reggono 1)
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const richiedi = createRequire(new URL('../app/package.json', import.meta.url));
const { optimize } = richiedi('svgo');
const [, , cartella, precisione = '2'] = process.argv;
if (!cartella) { console.error('uso: node tools/ottimizza-svg.mjs <cartella> [precisione]'); process.exit(1); }

function* svg(dir) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) yield* svg(p);
    else if (nome.endsWith('.svg')) yield p;
  }
}

let prima = 0, dopo = 0;
for (const f of svg(cartella)) {
  const src = readFileSync(f, 'utf8');
  const r = optimize(src, {
    multipass: true,
    floatPrecision: Number(precisione),
    plugins: [{ name: 'preset-default', params: { overrides: { cleanupIds: false, removeViewBox: false } } }],
  });
  if (r.data.length < src.length) writeFileSync(f, r.data);
  prima += src.length; dopo += Math.min(src.length, r.data.length);
}
console.log(`${cartella}: ${(prima / 1024).toFixed(0)} KB -> ${(dopo / 1024).toFixed(0)} KB`);
