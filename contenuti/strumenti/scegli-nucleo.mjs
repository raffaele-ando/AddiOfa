// Sceglie il nucleo gratuito (core:true): 100 domande bilanciate, solo tra quelle con stato 'originale'.
// Criteri in contenuti/NOTE.md. Deterministico (seme fisso). Uso: node contenuti/strumenti/scegli-nucleo.mjs [--applica]
import path from 'node:path';
import { DIR_DOMANDE, fileBlocchi, leggiJson, scriviJson, calculateSimilarity, leggiDomande } from './lib.mjs';

const applica = process.argv.includes('--applica');
const TOTALE = 100;
const BASE = 3; // minimo per argomento
// Argomenti che prendono una domanda in più per arrivare a 100 (i più frequenti nel test e con più domande nel banco).
const EXTRA = ['Present Simple', 'Present Simple', 'Quantifiers', 'Past Simple', 'Comparatives and Superlatives', 'Present Continuous', 'Past Continuous', 'Modals of Obligation and Advice'];
// Domande scartate dopo la lettura a mano (ambigue, imprecise o con una seconda risposta difendibile): id -> motivo.
const SCARTATE = {
  q397: "'might not be' è difendibile accanto a 'can't be'",
  q505: "'I never met him before that day' è accettabile in inglese informale",
  q385: "'He said that he is tired' è accettabile se la cosa è ancora vera",
  q479: "'He said that he likes apples' è accettabile se la cosa è ancora vera",
  q496: "'I realized I left my keys' è accettabile (passato semplice)",
  q497: "'She was tired because she worked all day' è accettabile (passato semplice)",
  q498: "'I just finished eating when he knocked' è accettabile in inglese americano",
  q254: "'those' e 'these birds' sono entrambe naturali",
  q344: "'should' è difendibile accanto a 'have to'",
  q279: "'at the table' è difendibile accanto a 'on the table'",
  q164: "'I go to the doctor tomorrow' è accettabile per un appuntamento",
  q174: "'I am working in a hospital' è una traduzione accettabile",
  q480: "'She said that she is watching TV' è accettabile se la cosa è ancora vera",
  q257: "'Those days are' è difendibile accanto a 'These days are'",
  q485: "'He asked me where I live' è accettabile se la cosa è ancora vera",
};
// Domande scelte a mano per un argomento (contano nella sua quota) perché le alternative sbagliate sono sicuramente sbagliate.
const PREFERITE = ['q495', 'q507', 'q499', 'q489', 'q490', 'q494'];
const SOGLIA_NUCLEO = 0.45; // come il filtro di ExamMode: nessuna coppia del nucleo sopra questa somiglianza

function rng(seme) { // mulberry32
  let a = seme >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hash = (t) => [...t].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

const tutte = leggiDomande();
const inCoppia = new Set();
try {
  for (const c of leggiJson(path.join(DIR_DOMANDE, 'da-rivedere.json'))) { inCoppia.add(c.a.id); inCoppia.add(c.b.id); }
} catch { /* nessun file */ }

const argomenti = [...new Set(tutte.map((q) => q.grammarTopic))];
const scelte = [];
const quota = Object.fromEntries(argomenti.map((a) => [a, BASE]));
for (const a of EXTRA) quota[a]++;

const livelliTotali = { A1: 0, A2: 0, B1: 0 };
const catTotali = { Grammatica: 0, Traduzione: 0 };

for (const arg of argomenti) {
  const cand = tutte.filter((q) => q.grammarTopic === arg && q.stato === 'originale' && !inCoppia.has(q.id) && !(q.id in SCARTATE));
  const rand = rng(20261010 + hash(arg)); // un generatore per argomento: cambiare un argomento non sposta gli altri
  const presi = cand.filter((q) => PREFERITE.includes(q.id));
  for (const q of presi) { livelliTotali[q.level]++; catTotali[q.category]++; }
  const n = Math.min(quota[arg], cand.length);
  while (presi.length < n) {
    const liberi = cand.filter((q) => !presi.includes(q) && ![...presi, ...scelte].some((s) => calculateSimilarity(s.prompt, q.prompt) > SOGLIA_NUCLEO));
    if (!liberi.length) break;
    const livPresi = new Set(presi.map((q) => q.level));
    // circa un terzo di traduzioni per argomento (1 su 3-4, 2 su 5)
    const volteTrad = Math.max(1, Math.round(n * 0.36));
    const tradPresi = presi.filter((q) => q.category === 'Traduzione').length;
    const mancano = n - presi.length;
    const punti = (q) => {
      const trad = q.category === 'Traduzione';
      let p = (livPresi.has(q.level) ? 0 : 2) - livelliTotali[q.level] * 0.02 + rand() * 0.9;
      if (trad && tradPresi >= volteTrad) p -= 5;
      if (!trad && tradPresi < volteTrad && mancano <= volteTrad - tradPresi) p -= 5;
      return p;
    };
    liberi.sort((x, y) => punti(y) - punti(x));
    const q = liberi[0];
    presi.push(q); livelliTotali[q.level]++; catTotali[q.category]++;
  }
  scelte.push(...presi);
}

console.log(`Nucleo: ${scelte.length} domande`);
console.log('Livelli:', livelliTotali, 'Categorie:', catTotali);
const perArg = {};
for (const q of scelte) perArg[q.grammarTopic] = (perArg[q.grammarTopic] ?? 0) + 1;
console.log('Per argomento:', perArg);
if (scelte.length !== TOTALE) console.log(`ATTENZIONE: ${scelte.length} invece di ${TOTALE}`);

if (applica) {
  const ids = new Set(scelte.map((q) => q.id));
  for (const f of fileBlocchi(DIR_DOMANDE)) {
    const blocco = leggiJson(f);
    for (const q of blocco) q.core = ids.has(q.id);
    scriviJson(f, blocco);
  }
  console.log('Flag core scritti.');
} else {
  console.log('(prova) ids:', scelte.map((q) => q.id).join(' '));
}
