const fs = require('fs');

const rawContent = fs.readFileSync('src/data/questions.ts', 'utf8');
let jsCode = rawContent.replace(/import .*?;\n?/g, '').replace(/export const questions.*?=\s*\[/s, '[').trim();
if (jsCode.endsWith(';')) jsCode = jsCode.slice(0, -1);
const questions = eval(jsCode);

console.log("=== CHECKING ALL TOPICS ===");
const byTopic = {};
questions.forEach(q => {
  if (!byTopic[q.grammarTopic]) byTopic[q.grammarTopic] = [];
  byTopic[q.grammarTopic].push(q);
});

// Let's print each topic's questions succinctly so we can read and audit all of them
Object.keys(byTopic).sort().forEach(topic => {
  console.log(`\n================== TOPIC: "${topic}" (${byTopic[topic].length}) ==================`);
  byTopic[topic].forEach(q => {
    console.log(`[${q.id}] [${q.level}|${q.category}] P: "${q.prompt}" | C: "${q.options[q.correctIndex]}" | E: "${q.explanation}"`);
  });
});
