// Controlla che ogni percorso tra `backtick` citato nei .md di docs/, CLAUDE.md e README.md esista.
// Uso: node tools/check-links.mjs   (esce con codice 1 se trova percorsi rotti)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const radice = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const saltare = new Set(['node_modules', '.git', 'archivio', 'ricerche']);
const file = [];
(function cerca(d) {
  for (const n of readdirSync(d)) {
    if (saltare.has(n)) continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) cerca(p);
    else if (n.endsWith('.md')) file.push(p);
  }
})(join(radice, 'docs'));
file.push(join(radice, 'CLAUDE.md'), join(radice, 'README.md'));

const prefissi = ['app/', 'pass/', 'atlas/', 'contenuti/', 'grafica/', 'docs/', 'tools/', '.claude/'];
let rotti = 0;
for (const f of file) {
  if (!existsSync(f)) continue;
  const testo = readFileSync(f, 'utf8');
  for (const m of testo.matchAll(/`([A-Za-z0-9_.\-/]+)`/g)) {
    const p = m[1].replace(/[:#].*$/, '').replace(/\/$/, '');
    if (!prefissi.some(x => p.startsWith(x)) || p.includes('*')) continue;
    if (!existsSync(join(radice, p))) { console.log(`${f.replace(radice + '/', '')}: ${p}`); rotti++; }
  }
}
console.log(rotti ? `${rotti} percorsi non trovati` : 'ok: tutti i percorsi esistono');
process.exit(rotti ? 1 : 0);
