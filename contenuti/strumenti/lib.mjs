// Funzioni condivise da converti-da-ts, trova-duplicati, genera e valida (solo Node, nessuna dipendenza).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DIR_DOMANDE = path.join(RADICE, 'contenuti', 'domande');
export const DIR_SPIEGAZIONI = path.join(RADICE, 'contenuti', 'spiegazioni');
export const DIR_TEORIA = path.join(RADICE, 'contenuti', 'teoria');
export const SOGLIA_SIMILARITA = 0.6;

/** Stessa funzione di app/src/lib/utils.ts (calculateSimilarity): se cambia là, cambia anche qui. */
const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'choose', 'correct', 'sentence', 'translation',
  'which', 'complete', 'translate', 'and', 'or', 'but', 'if', 'by', 'from', 'as', 'about',
]);
const tokenize = (s) => new Set(
  s.toLowerCase().replace(/[^\w\s]|_/g, '').split(/\s+/).filter((w) => w.length > 0 && !STOP.has(w)),
);
export function calculateSimilarity(str1, str2) {
  const set1 = tokenize(str1);
  const set2 = tokenize(str2);
  if (set1.size === 0 && set2.size === 0) return 0;
  let intersection = 0;
  for (const w of set1) if (set2.has(w)) intersection++;
  return intersection / (set1.size + set2.size - intersection);
}
export const contenutoToken = (s) => tokenize(s).size;

/** Somiglianza tra due domande: la più alta tra il solo testo e testo + opzioni (cattura le versioni "a vuoto" della stessa frase). */
export function somiglianzaDomande(a, b) {
  const sp = contenutoToken(a.prompt) >= 2 && contenutoToken(b.prompt) >= 2 ? calculateSimilarity(a.prompt, b.prompt) : 0;
  const testo = (q) => `${q.prompt} ${q.options.join(' ')}`;
  const sc = calculateSimilarity(testo(a), testo(b));
  return Math.max(sp, sc);
}

export const numeroId = (id) => Number(String(id).replace(/^q0*/, ''));
/** Normalizza "q001" in "q1" (le chiavi delle spiegazioni possono arrivare con gli zeri). */
export const idCanonico = (id) => 'q' + numeroId(id);

export function leggiJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
export function scriviJson(file, dati) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(dati, null, 2) + '\n');
}

const reBlocco = /^q\d+-q\d+\.json$/;
export function fileBlocchi(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => reBlocco.test(f)).sort().map((f) => path.join(dir, f));
}

export function leggiDomande() {
  const out = [];
  for (const f of fileBlocchi(DIR_DOMANDE)) out.push(...leggiJson(f));
  return out;
}

/** Spiegazioni: { id canonico -> testo } da tutti i blocchi; segnala chiavi doppie. */
export function leggiSpiegazioni() {
  const mappa = {};
  const doppie = [];
  for (const f of fileBlocchi(DIR_SPIEGAZIONI)) {
    for (const [k, v] of Object.entries(leggiJson(f))) {
      const id = idCanonico(k);
      if (id in mappa) doppie.push(id);
      mappa[id] = v;
    }
  }
  return { mappa, doppie };
}

export function leggiArgomenti() {
  return leggiJson(path.join(DIR_TEORIA, 'argomenti.json'));
}

/** Schede di teoria: tutti i .json in teoria/ tranne argomenti.json. */
export function leggiSchedeTeoria() {
  if (!fs.existsSync(DIR_TEORIA)) return [];
  const schede = [];
  for (const f of fs.readdirSync(DIR_TEORIA).sort()) {
    if (!f.endsWith('.json') || f === 'argomenti.json') continue;
    const dati = leggiJson(path.join(DIR_TEORIA, f));
    if (Array.isArray(dati)) schede.push(...dati);
    else schede.push(dati);
  }
  return schede;
}

export const duplicataDi = (stato) => (typeof stato === 'string' && stato.startsWith('duplicata-di:') ? stato.slice(13) : null);
