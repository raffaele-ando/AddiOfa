const fs = require('fs');

const rawContent = fs.readFileSync('src/data/questions.ts', 'utf8');
let jsCode = rawContent.replace(/import .*?;\n?/g, '').replace(/export const questions.*?=\s*\[/s, '[').trim();
if (jsCode.endsWith(';')) jsCode = jsCode.slice(0, -1);
const questions = eval(jsCode);

console.log("CHECKING ALL 606 QUESTIONS FOR MISMATCHES...\n");

const byTopic = {};
questions.forEach(q => {
  if (!byTopic[q.grammarTopic]) byTopic[q.grammarTopic] = [];
  byTopic[q.grammarTopic].push(q);
});

Object.keys(byTopic).sort().forEach(topic => {
  console.log(`=== [${topic}] (${byTopic[topic].length}) ===`);
  byTopic[topic].forEach(q => {
    console.log(`  [${q.id}] [${q.level}|${q.category}] P: "${q.prompt}" | Ans: "${q.options[q.correctIndex]}" | Exp: "${q.explanation}"`);
  });
});
