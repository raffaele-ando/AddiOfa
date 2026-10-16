// Genera, da contenuti/, i due file che usa l'app (sito statico, nessun server):
//   app/src/data/questions.ts   (banco domande, senza le duplicate: tutte aperte, nessun «nucleo»)
//   app/src/data/theory.ts      (schede di teoria dei 31 argomenti)
// Uso: node contenuti/strumenti/genera.mjs [--escludi-da-riscrivere]
//   --escludi-da-riscrivere: lascia fuori le domande con stato 'da-riscrivere' (per la pubblicazione, quando la provenienza non è chiarita)
import fs from 'node:fs';
import path from 'node:path';
import {
  RADICE, leggiDomande, leggiSpiegazioni, leggiArgomenti, leggiSchedeTeoria, numeroId, duplicataDi,
} from './lib.mjs';

const escludiSospette = process.argv.includes('--escludi-da-riscrivere');
const INTESTAZIONE = '// GENERATO da contenuti/ con npm run contenuti: non modificare a mano.\n';

const tutte = leggiDomande().sort((a, b) => numeroId(a.id) - numeroId(b.id));
const { mappa: spiegazioni } = leggiSpiegazioni();
const argomenti = leggiArgomenti();
const schede = leggiSchedeTeoria();

const schedaPerId = new Map(schede.map((s) => [s.id, s]));
// una domanda è collegata alla teoria se esiste la scheda del suo argomento
const teoriaDi = new Map();
for (const a of argomenti) if (schedaPerId.has(a.id)) teoriaDi.set(a.grammarTopic, a.id);

const incluse = tutte.filter((q) => duplicataDi(q.stato) === null && !(escludiSospette && q.stato === 'da-riscrivere'));

const finali = incluse.map((q) => {
  const out = {
    id: q.id,
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: (spiegazioni[q.id] ?? '').trim() || q.explanation,
    category: q.category,
    level: q.level,
    grammarTopic: q.grammarTopic,
  };
  const t = teoriaDi.get(q.grammarTopic);
  if (t) out.theoryId = t;
  return out;
});

// ---------- questions.ts ----------
const ts = `${INTESTAZIONE}import type { Question } from '../types';

export const questions: Question[] = ${JSON.stringify(finali, null, 2)};
`;
fs.writeFileSync(path.join(RADICE, 'app/src/data/questions.ts'), ts);

// ---------- theory.ts ----------
const topics = argomenti.map((a) => {
  const s = schedaPerId.get(a.id);
  return {
    id: a.id,
    titolo: s?.titolo ?? a.titolo,
    livello: s?.livello ?? a.livello,
    grammarTopic: a.grammarTopic,
    inCheatSheet: !!a.inCheatSheet,
    pronta: !!s,
    regola: s?.regola ?? [],
    esempi: s?.esempi ?? [],
    errori: s?.errori ?? [],
    consiglio: s?.consiglio ?? '',
    domande: s?.domande ?? [],
  };
});
const tipi = `${INTESTAZIONE}
export interface TheoryExample {
  en: string;
  it: string;
}

export interface TheoryMistake {
  sbagliato: string;
  giusto: string;
  perche: string;
}

export interface TheoryTopic {
  /** slug dell'argomento (es. 'present-perfect'); è anche il \`theoryId\` delle domande */
  id: string;
  titolo: string;
  livello: 'A1' | 'A2' | 'B1';
  /** nome dell'argomento nelle domande (\`Question.grammarTopic\`) */
  grammarTopic: string;
  /** l'argomento ha una voce nel prontuario (app/src/data/cheatSheet.ts) */
  inCheatSheet: boolean;
  /** false finché la scheda non è stata scritta: i campi sotto sono allora vuoti */
  pronta: boolean;
  regola: string[];
  esempi: TheoryExample[];
  errori: TheoryMistake[];
  consiglio: string;
  /** id di 3 domande del banco che esercitano l'argomento */
  domande: string[];
}

export const theoryTopics: TheoryTopic[] = ${JSON.stringify(topics, null, 2)};

export const getTheoryTopic = (id: string): TheoryTopic | undefined => theoryTopics.find((t) => t.id === id);
`;
fs.writeFileSync(path.join(RADICE, 'app/src/data/theory.ts'), tipi);

const esclusi = tutte.length - incluse.length;
console.log(`questions.ts: ${finali.length} domande (${esclusi} escluse: duplicate${escludiSospette ? ' e da riscrivere' : ''})`);
console.log(`theory.ts: ${topics.length} argomenti, ${topics.filter((t) => t.pronta).length} schede pronte`);
