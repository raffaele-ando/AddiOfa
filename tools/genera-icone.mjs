#!/usr/bin/env node
// Genera le icone dell'app dal kit lucide (ISC): per ogni nome semantico in app/src/brand/icone/registro/*.json
// scrive app/src/brand/icone/svg/<lucide>.svg (tratto nero: serve come maschera, il colore lo dà il testo) e app/src/brand/icone/nomi.generato.ts.
// Regola: una funzione = un'icona. Lo script FALLISCE se due nomi semantici puntano alla stessa icona lucide
// (a meno che il nome semantico sia lo stesso: `alias` non esistono) o se un'icona lucide non esiste.
// Uso (dalla radice): node tools/genera-icone.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const REG = join(RADICE, 'app/src/brand/icone/registro');
const SVG = join(RADICE, 'app/src/brand/icone/svg');
const LUCIDE = join(RADICE, 'app/node_modules/lucide-react/dist/esm/icons');
mkdirSync(SVG, { recursive: true });

const semantici = new Map(); // nome -> { lucide, file }
const usate = new Map();     // lucide -> nome
let errori = 0;
for (const f of readdirSync(REG).filter(f => f.endsWith('.json')).sort()) {
  const dati = JSON.parse(readFileSync(join(REG, f), 'utf8'));
  for (const [nome, lucide] of Object.entries(dati)) {
    if (nome.startsWith('_')) continue;
    if (semantici.has(nome)) { console.error(`DUPLICATO nome «${nome}» in ${f} e ${semantici.get(nome).file}`); errori++; continue; }
    if (usate.has(lucide)) { console.error(`ICONA RIUSATA «${lucide}»: «${nome}» (${f}) e «${usate.get(lucide)}»`); errori++; }
    usate.set(lucide, nome);
    semantici.set(nome, { lucide, file: f });
  }
}
const attr = (o) => Object.entries(o).filter(([k]) => k !== 'key').map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}='${v}'`).join(' ');
for (const lucide of usate.keys()) {
  const p = join(LUCIDE, `${lucide}.js`);
  if (!existsSync(p)) { console.error(`NON ESISTE in lucide: «${lucide}» (${usate.get(lucide)})`); errori++; continue; }
  const { __iconNode } = await import(pathToFileURL(p).href);
  const corpo = __iconNode.map(([tag, a]) => `<${tag} ${attr(a)}/>`).join('');
  writeFileSync(join(SVG, `${lucide}.svg`), `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${corpo}</svg>`);
}
if (errori) { console.error(`${errori} errori: nessun file di nomi scritto`); process.exit(1); }
const nomi = [...semantici.keys()].sort();
writeFileSync(join(RADICE, 'app/src/brand/icone/nomi.generato.ts'),
  `// GENERATO da tools/genera-icone.mjs: non modificare. Nome semantico -> icona lucide.\nexport const ICONE = ${JSON.stringify(Object.fromEntries(nomi.map(n => [n, semantici.get(n).lucide])), null, 2)} as const;\nexport type NomeIcona = keyof typeof ICONE;\n`);
console.log(`${nomi.length} icone, ${usate.size} file svg`);
