const fs = require('fs');

const rawContent = fs.readFileSync('src/data/questions.ts', 'utf8');
let jsCode = rawContent.replace(/import .*?;\n?/g, '').replace(/export const questions.*?=\s*\[/s, '[').trim();
if (jsCode.endsWith(';')) jsCode = jsCode.slice(0, -1);
const questions = eval(jsCode);

console.log("=== COMPREHENSIVE SCAN OF ALL 606 QUESTIONS ===");

const topicChecks = [
  {
    topic: "Prepositions of Time",
    check: (q) => {
      // Must be about prepositions of time (at, in, on, since, for, during, by...)
      const exp = q.explanation.toLowerCase();
      const p = q.prompt.toLowerCase();
      const c = q.options[q.correctIndex].toLowerCase();
      if (exp.includes("modal") || p.includes("posso offrire") || p.includes("riesce a parlare") || exp.includes("adverb") || c === "well" || (exp.includes("timetable") && !exp.includes("preposition")) || (exp.includes("present simple") && !exp.includes("preposition") && !c.includes("since") && !c.includes("for"))) {
        return { isMismatch: true, reason: `Matches Present Simple / Modals / Adverbs rather than Preposition of time. Current ans: "${c}", Exp: "${q.explanation}"` };
      }
      return { isMismatch: false };
    }
  },
  {
    topic: "Questions and Origins",
    check: (q) => {
      // Questions and Origins should be about question words, where are you from, nationalities, question formation
      return { isMismatch: false };
    }
  }
];

// Let's print out all questions in all topics to check them carefully
const allList = [];
questions.forEach(q => {
  allList.push({
    id: q.id,
    topic: q.grammarTopic,
    level: q.level,
    category: q.category,
    prompt: q.prompt,
    ans: q.options[q.correctIndex],
    exp: q.explanation
  });
});

console.log(JSON.stringify(allList.slice(0, 60), null, 2));

