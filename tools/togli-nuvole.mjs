#!/usr/bin/env node
// Toglie dai disegni delle illustrazioni il gruppo <g id="nuvola"> (la nuvoletta chiara dietro al soggetto).
// Uso: node tools/togli-nuvole.mjs <cartella> ; lo lancia anche sincronizza-essenziali.sh dopo la copia.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

let fattoSemplice = false;
function togli(svg) {
  // la nuvola può anche essere un singolo elemento (ellipse, path, circle, rect)
  const semplice = svg.replace(/<(ellipse|path|circle|rect)\s+id="nuvola"[^>]*\/>/g, '');
  if (semplice !== svg) svg = semplice, fattoSemplice = true;
  const inizio = svg.search(/<g\s+id="nuvola"/);
  if (inizio < 0) { const r = fattoSemplice ? svg : null; fattoSemplice = false; return r; }
  let profondita = 0, i = inizio;
  const re = /<g\b|<\/g>/g; re.lastIndex = inizio;
  for (let m; (m = re.exec(svg)); ) {
    profondita += m[0] === '<g' ? 1 : -1;
    if (profondita === 0) { i = m.index + m[0].length; break; }
  }
  return svg.slice(0, inizio) + svg.slice(i);
}

function visita(dir, conta) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) { visita(p, conta); continue; }
    if (!nome.endsWith('.svg')) continue;
    const nuovo = togli(readFileSync(p, 'utf8'));
    if (nuovo !== null) { writeFileSync(p, nuovo); conta.n++; }
  }
}
const conta = { n: 0 };
visita(process.argv[2] ?? '.', conta);
console.log(`nuvole tolte da ${conta.n} file`);
