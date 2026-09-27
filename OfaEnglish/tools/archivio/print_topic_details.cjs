const fs = require('fs');

const rawContent = fs.readFileSync('src/data/questions.ts', 'utf8');
let jsCode = rawContent.replace(/import .*?;\n?/g, '').replace(/export const questions.*?=\s*\[/s, '[').trim();
if (jsCode.endsWith(';')) jsCode = jsCode.slice(0, -1);
const questions = eval(jsCode);

const printTopic = (topicName) => {
  console.log(`\n=================== ${topicName} ===================`);
  questions.filter(q => q.grammarTopic === topicName).forEach(q => {
    console.log(`[${q.id}] [${q.level}|${q.category}]`);
    console.log(`  P: ${q.prompt}`);
    console.log(`  O: ${JSON.stringify(q.options)}`);
    console.log(`  C: ${q.options[q.correctIndex]}`);
    console.log(`  E: ${q.explanation}`);
  });
};

printTopic("Prepositions of Time");
printTopic("Prepositions of Place");
printTopic("Questions and Origins");
printTopic("Possessives");
printTopic("Possessive S");
printTopic("Object Pronouns");
printTopic("Demonstratives");
printTopic("Imperative");
printTopic("Adverbs of Manner");
