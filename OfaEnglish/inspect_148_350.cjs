const fs = require('fs');

const rawContent = fs.readFileSync('src/data/questions.ts', 'utf8');
let jsCode = rawContent.replace(/import .*?;\n?/g, '').replace(/export const questions.*?=\s*\[/s, '[').trim();
if (jsCode.endsWith(';')) jsCode = jsCode.slice(0, -1);
const questions = eval(jsCode);

console.log("=== INSPECTING QUESTIONS 148 to 350 ===");
questions.slice(147, 350).forEach(q => {
  // Let's filter out obviously matching ones and flag anything doubtful
  const t = q.grammarTopic;
  const p = q.prompt;
  const ans = q.options[q.correctIndex];
  const e = q.explanation;
  console.log(`[${q.id}] [${t}] P: "${p}" | Ans: "${ans}" | Exp: "${e}"`);
});
