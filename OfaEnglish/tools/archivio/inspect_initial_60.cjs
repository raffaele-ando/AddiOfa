const fs = require('fs');

const rawContent = fs.readFileSync('src/data/questions.ts', 'utf8');
let jsCode = rawContent.replace(/import .*?;\n?/g, '').replace(/export const questions.*?=\s*\[/s, '[').trim();
if (jsCode.endsWith(';')) jsCode = jsCode.slice(0, -1);
const questions = eval(jsCode);

console.log("=== INSPECTING FIRST 60 QUESTIONS ===");
questions.slice(0, 60).forEach(q => {
  console.log(`[${q.id}] TOPIC: "${q.grammarTopic}" | LEVEL: ${q.level}`);
  console.log(`  Prompt: "${q.prompt}"`);
  console.log(`  Ans: "${q.options[q.correctIndex]}"`);
  console.log(`  Exp: "${q.explanation}"\n`);
});
