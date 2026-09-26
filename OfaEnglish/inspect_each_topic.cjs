const fs = require('fs');

const rawContent = fs.readFileSync('src/data/questions.ts', 'utf8');
let jsCode = rawContent.replace(/import .*?;\n?/g, '').replace(/export const questions.*?=\s*\[/s, '[').trim();
if (jsCode.endsWith(';')) jsCode = jsCode.slice(0, -1);
const questions = eval(jsCode);

const topics = [
  "Adverbs of Manner", "Comparatives and Superlatives", "Demonstratives",
  "First Conditional", "Future: going to", "Gerunds vs Infinitives",
  "Imperative", "Modals of Deduction", "Modals of Obligation and Advice",
  "Object Pronouns", "Passive Voice", "Past Continuous", "Past Perfect",
  "Past Simple", "Possessive S", "Possessives", "Prepositions of Place",
  "Prepositions of Time", "Present Continuous", "Present Perfect",
  "Present Simple", "Quantifiers", "Question Tags", "Questions and Origins",
  "Relative Clauses", "Reported Speech", "Second Conditional",
  "There is / There are", "Third Conditional", "Used to"
];

// Let's print each topic with all its questions so we can do a comprehensive audit
topics.forEach(t => {
  const qs = questions.filter(q => q.grammarTopic === t);
  console.log(`\n\n############################################################`);
  console.log(`### TOPIC: [${t}] (${qs.length} questions)`);
  console.log(`############################################################`);
  qs.forEach(q => {
    console.log(`[${q.id}] [${q.level}|${q.category}] P: "${q.prompt}" | C: "${q.options[q.correctIndex]}" | E: "${q.explanation}"`);
  });
});
