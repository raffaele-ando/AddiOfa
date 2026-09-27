const fs = require('fs');

const content = fs.readFileSync('src/data/questions.ts', 'utf-8');
// Evaluate the array directly to get the questions
// But since it's TS, it has type annotations. 
// A simpler way is to just grep for grammarTopic and level.
