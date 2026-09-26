const fs = require('fs');

const content = fs.readFileSync('src/data/questions.ts', 'utf-8');

function categorize(q) {
  let level = 'A2';
  let topic = 'General';
  const prompt = q.toLowerCase();
  
  if (prompt.includes('present perfect') || prompt.includes('have you ever') || prompt.includes('has been')) {
    level = 'B1';
    topic = 'Present Perfect';
  } else if (prompt.includes('is there') || prompt.includes('there is')) {
    level = 'A1';
    topic = 'There is / There are';
  } else if (prompt.includes('did you') || prompt.includes('past simple') || prompt.includes('went') || prompt.includes('came')) {
    level = 'A2';
    topic = 'Past Simple';
  } else if (prompt.includes('is doing') || prompt.includes('raining') || prompt.includes('present continuous') || prompt.includes('right now')) {
    level = 'A2';
    topic = 'Present Continuous';
  } else if (prompt.includes('if it rains') || prompt.includes('conditional')) {
    level = 'B1';
    topic = 'First Conditional';
  } else if (prompt.includes('much more') || prompt.includes('worst') || prompt.includes('most')) {
    level = 'A2';
    topic = 'Comparatives and Superlatives';
  } else if (prompt.includes('since') || prompt.includes('for')) {
    level = 'B1';
    topic = 'Prepositions of Time';
  } else if (prompt.includes('works') || prompt.includes('leaves') || prompt.includes('present simple')) {
    level = 'A1';
    topic = 'Present Simple';
  } else if (prompt.includes('sara makeup') || prompt.includes('mr. smith')) {
    level = 'A1';
    topic = 'Possessive S';
  } else if (prompt.includes('how many')) {
    level = 'A1';
    topic = 'Quantifiers';
  } else if (prompt.includes('where do you come')) {
    level = 'A1';
    topic = 'Questions and Origins';
  }
  
  return { level, topic };
}

let modified = content.replace(/(\{\s*id:\s*"[^"]+",\s*prompt:\s*"([^"]+)",[\s\S]*?category:\s*"[^"]+"\s*\})/g, (match, body, promptText) => {
  const { level, topic } = categorize(match);
  return body.replace(/category:\s*("[^"]+")/, `category: $1,\n    level: "${level}",\n    grammarTopic: "${topic}"`);
});

fs.writeFileSync('src/data/questions.ts', modified);
console.log('Updated questions.ts');
