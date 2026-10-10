// Trova le coppie quasi doppie (somiglianza >= 0,6 con calculateSimilarity) e le scrive in contenuti/domande/da-rivedere.json.
// Con --applica segna `stato: 'duplicata-di:qN'` sulla seconda di ogni coppia (mai cancella). Le coppie giudicate "distinta"
// a mano in da-rivedere.json restano tali: l'esito umano non viene sovrascritto.
// Uso: node contenuti/strumenti/trova-duplicati.mjs [--applica]
import fs from 'node:fs';
import path from 'node:path';
import { DIR_DOMANDE, SOGLIA_SIMILARITA, somiglianzaDomande, numeroId, leggiJson, scriviJson, fileBlocchi, duplicataDi } from './lib.mjs';

const applica = process.argv.includes('--applica');
const fileRivedere = path.join(DIR_DOMANDE, 'da-rivedere.json');

// Coppie sopra soglia che, a occhio, NON sono la stessa domanda (stessa regola ma item diverso): esito "distinta".
const DISTINTE_INIZIALI = {
  'q2/q47': 'q2 è la forma interrogativa (Is there...?), q47 la frase affermativa (There is...).',
  'q28/q56': 'Argomenti diversi (quantificatori e going to): coincidono solo le parole "friends" e "she".',
  'q31/q621': 'q31 chiede la forma negativa corretta, q621 completa con there is/isn\'t/are: item diversi.',
  'q32/q630': 'q630 chiede la parola interrogativa (How long), q32 l\'ausiliare (have).',
  'q34/q631': 'q631 verifica many/few/much, q34 il passato di come: item diversi.',
  'q63/q621': 'q63 verifica Is there + any, q621 sceglie tra is/isn\'t/are: item diversi.',
  'q78/q438': 'Primo condizionale (will pass) contro secondo condizionale (studied): item diversi.',
  'q185/q274': 'q185 verifica la forma base dopo does, q274 la preposizione in: item diversi.',
  'q394/q530': 'Stessa frase ma formato diverso (completamento contro traduzione): si tengono entrambe.',
  'q481/q491': 'Reported speech con will->would contro can->could: backshift diversi.',
  'q481/q493': 'Reported speech con will->would contro must->had to: backshift diversi.',
};

const domande = [];
const perId = {};
for (const f of fileBlocchi(DIR_DOMANDE)) {
  const blocco = leggiJson(f);
  domande.push({ f, blocco });
  for (const q of blocco) perId[q.id] = q;
}
const tutte = Object.values(perId).sort((a, b) => numeroId(a.id) - numeroId(b.id));

const esitiPrima = {};
if (fs.existsSync(fileRivedere)) for (const c of leggiJson(fileRivedere)) esitiPrima[`${c.a.id}/${c.b.id}`] = c;

const coppie = [];
for (let i = 0; i < tutte.length; i++) {
  for (let j = i + 1; j < tutte.length; j++) {
    const s = somiglianzaDomande(tutte[i], tutte[j]);
    if (s >= SOGLIA_SIMILARITA) coppie.push([tutte[i], tutte[j], s]);
  }
}

const mostra = (q) => ({ id: q.id, prompt: q.prompt, opzioni: q.options, esatta: q.options[q.correctIndex], stato: q.stato });
const radice = (id) => duplicataDi(perId[id].stato) ?? id;
const risultato = [];
const daSegnare = {};
for (const [a, b, s] of coppie) {
  const chiave = `${a.id}/${b.id}`;
  const prima = esitiPrima[chiave];
  const distinta = prima ? prima.esito === 'distinta' : chiave in DISTINTE_INIZIALI;
  const note = distinta ? (prima?.note ?? DISTINTE_INIZIALI[chiave] ?? '') : '';
  const voce = {
    a: mostra(a), b: mostra(b),
    similarita: Math.round(s * 100) / 100,
    esito: distinta ? 'distinta' : `duplicata-di:${a.id}`,
    note,
  };
  if (!distinta) {
    const origine = daSegnare[a.id] ?? radice(a.id);
    // se "a" è a sua volta una duplicata, la seconda punta alla stessa domanda tenuta
    voce.esito = `duplicata-di:${origine}`;
    if (!(b.id in daSegnare) && duplicataDi(b.stato) === null) daSegnare[b.id] = origine;
  }
  risultato.push(voce);
}
scriviJson(fileRivedere, risultato);
const nDistinte = risultato.filter((c) => c.esito === 'distinta').length;
console.log(`${coppie.length} coppie sopra soglia ${SOGLIA_SIMILARITA}: ${coppie.length - nDistinte} da segnare, ${nDistinte} giudicate distinte.`);
console.log(`Domande da segnare come duplicate: ${Object.keys(daSegnare).length}`);

if (applica) {
  for (const { f, blocco } of domande) {
    let toccato = false;
    for (const q of blocco) {
      if (q.id in daSegnare) { q.stato = `duplicata-di:${daSegnare[q.id]}`; q.core = false; toccato = true; }
    }
    if (toccato) scriviJson(f, blocco);
  }
  console.log('Segnate nei file di contenuti/domande/.');
} else {
  console.log('(prova: usa --applica per segnare le duplicate)');
}
