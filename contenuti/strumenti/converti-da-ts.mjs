// Si usa UNA volta sola: converte il vecchio banco (app/src/data/questions.ts scritto a mano) in contenuti/domande/qNNN-qMMM.json.
// Se questions.ts è già stato rigenerato, legge la versione dell'ultimo commit di git.
// Uso: node contenuti/strumenti/converti-da-ts.mjs [--forza]   (--forza sovrascrive i blocchi già presenti)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { RADICE, DIR_DOMANDE, scriviJson, fileBlocchi } from './lib.mjs';

const forza = process.argv.includes('--forza');
if (fileBlocchi(DIR_DOMANDE).length && !forza) {
  console.error('contenuti/domande/ ha già dei blocchi: la conversione si fa una volta sola (usa --forza per rifare tutto, perdendo le modifiche).');
  process.exit(1);
}

const rel = 'app/src/data/questions.ts';
let testo = fs.readFileSync(path.join(RADICE, rel), 'utf8');
if (testo.includes('GENERATO da contenuti/')) {
  testo = execSync(`git show HEAD:${rel}`, { cwd: RADICE, maxBuffer: 64 * 1024 * 1024 }).toString();
  if (testo.includes('GENERATO da contenuti/')) { console.error('Anche la versione in git è generata: non trovo il banco originale.'); process.exit(1); }
  console.log('questions.ts è già generato: uso la versione di HEAD.');
}
const inizio = testo.indexOf('export const questions: Question[] = ') + 'export const questions: Question[] = '.length;
const vecchie = JSON.parse(testo.slice(inizio).trim().replace(/;\s*$/, ''));

const DA_RISCRIVERE = (n) => n <= 60 || (n >= 607 && n <= 636); // provenienza dubbia (stato_app.md §1.4)
const nuove = vecchie.map((q) => {
  const n = Number(q.id.slice(1));
  return {
    id: q.id,
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    category: q.category,
    level: q.level,
    grammarTopic: q.grammarTopic,
    core: false,
    stato: DA_RISCRIVERE(n) ? 'da-riscrivere' : 'originale',
  };
});

for (let da = 1; da <= nuove.length; da += 100) {
  const a = Math.min(da + 99, nuove.length);
  const nome = `q${String(da).padStart(3, '0')}-q${String(a).padStart(3, '0')}.json`;
  scriviJson(path.join(DIR_DOMANDE, nome), nuove.filter((q) => Number(q.id.slice(1)) >= da && Number(q.id.slice(1)) <= a));
  console.log('scritto', nome);
}
console.log(`${nuove.length} domande convertite.`);
