const fs = require('fs');
const newQuestions = [
  // Questions and Origins (11)
  { id: "q197", prompt: "Complete: '_____ is that man?'", options: ["Who", "What", "Which", "Where"], correctIndex: 0, explanation: "Asking for a person's identity requires 'Who'.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q198", prompt: "Translate 'Perché sei in ritardo?'", options: ["Why are you late?", "Because are you late?", "Why you are late?", "Why do you late?"], correctIndex: 0, explanation: "Asking for a reason requires 'Why'.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q199", prompt: "Complete: '_____ old are you?'", options: ["How", "What", "Who", "Which"], correctIndex: 0, explanation: "Asking about age uses 'How old'.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q200", prompt: "Translate 'Quando è il tuo compleanno?'", options: ["When is your birthday?", "Where is your birthday?", "What is your birthday?", "How is your birthday?"], correctIndex: 0, explanation: "Asking for time/date requires 'When'.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q201", prompt: "Complete: '_____ do you live?'", options: ["Where", "What", "How", "When"], correctIndex: 0, explanation: "Asking for a place requires 'Where'.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q202", prompt: "Translate 'Come vai al lavoro?'", options: ["How do you go to work?", "What do you go to work?", "Where do you go to work?", "Why do you go to work?"], correctIndex: 0, explanation: "Asking for method/manner requires 'How'.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q203", prompt: "Complete: '_____ is your favorite color?'", options: ["What", "Which", "Who", "How"], correctIndex: 0, explanation: "Asking for general preference uses 'What'.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q204", prompt: "Translate 'Di chi è questa borsa?'", options: ["Whose bag is this?", "Who bag is this?", "Which bag is this?", "What bag is this?"], correctIndex: 0, explanation: "Asking for possession requires 'Whose'.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q205", prompt: "Complete: '_____ time does the movie start?'", options: ["What", "Which", "When", "How"], correctIndex: 0, explanation: "Asking for a specific time uses 'What time'.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q206", prompt: "Translate 'Quanto costa questo libro?'", options: ["How much does this book cost?", "How many does this book cost?", "How price is this book?", "What cost this book?"], correctIndex: 0, explanation: "Asking for price uses 'How much'.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q207", prompt: "Complete: '_____ languages do you speak?'", options: ["How many", "How much", "What", "Which"], correctIndex: 0, explanation: "'Languages' is countable, so 'How many'.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },

  // There is / There are (9)
  { id: "q208", prompt: "Complete: '_____ a big tree in the garden.'", options: ["There is", "There are", "It is", "They are"], correctIndex: 0, explanation: "Singular noun 'tree' requires 'There is'.", category: "Grammatica", level: "A1", grammarTopic: "There is / There are" },
  { id: "q209", prompt: "Translate 'Ci sono tre sedie nella stanza.'", options: ["There are three chairs in the room.", "They are three chairs in the room.", "There is three chairs in the room.", "Have three chairs in the room."], correctIndex: 0, explanation: "Plural noun 'chairs' requires 'There are'.", category: "Traduzione", level: "A1", grammarTopic: "There is / There are" },
  { id: "q210", prompt: "Complete: '_____ any messages for me?'", options: ["Are there", "Is there", "Do there", "Have there"], correctIndex: 0, explanation: "Question form for plural 'messages' is 'Are there'.", category: "Grammatica", level: "A1", grammarTopic: "There is / There are" },
  { id: "q211", prompt: "Translate 'C\\'è un buon ristorante qui vicino?'", options: ["Is there a good restaurant near here?", "Are there a good restaurant near here?", "There is a good restaurant near here?", "Does there a good restaurant near here?"], correctIndex: 0, explanation: "Question form for singular noun.", category: "Traduzione", level: "A1", grammarTopic: "There is / There are" },
  { id: "q212", prompt: "Complete: 'There _____ a lot of people at the party.'", options: ["were", "was", "are been", "is"], correctIndex: 0, explanation: "'People' is plural, so 'were' for past.", category: "Grammatica", level: "A2", grammarTopic: "There is / There are" },
  { id: "q213", prompt: "Translate 'Non c\\'era nessuno in casa.'", options: ["There was nobody at home.", "There wasn't nobody at home.", "There were nobody at home.", "It was nobody at home."], correctIndex: 0, explanation: "Past singular existence with negative pronoun.", category: "Traduzione", level: "A2", grammarTopic: "There is / There are" },
  { id: "q214", prompt: "Complete: '_____ going to be a storm tomorrow.'", options: ["There is", "It is", "There are", "They are"], correctIndex: 0, explanation: "Future existence 'There is going to be'.", category: "Grammatica", level: "B1", grammarTopic: "There is / There are" },
  { id: "q215", prompt: "Translate 'Ci sono dei biscotti nella scatola?'", options: ["Are there any biscuits in the box?", "Is there any biscuits in the box?", "Are there some biscuits in the box?", "Do there any biscuits in the box?"], correctIndex: 0, explanation: "Question plural existence with 'any'.", category: "Traduzione", level: "A1", grammarTopic: "There is / There are" },
  { id: "q216", prompt: "Complete: '_____ a mistake in this exercise.'", options: ["There is", "There are", "It is", "This is"], correctIndex: 0, explanation: "Singular existence 'mistake'.", category: "Grammatica", level: "A1", grammarTopic: "There is / There are" }
];

const content = fs.readFileSync('src/data/questions.ts', 'utf-8');
const lastBracketIndex = content.lastIndexOf('];');

if (lastBracketIndex !== -1) {
  let newContent = content.substring(0, lastBracketIndex);
  if (!newContent.trim().endsWith(',')) newContent += ',\n';
  
  newQuestions.forEach((q, index) => {
    newContent += `  {
    id: "${q.id}",
    prompt: "${q.prompt.replace(/"/g, '\\"')}",
    options: [
      "${q.options[0].replace(/"/g, '\\"')}",
      "${q.options[1].replace(/"/g, '\\"')}",
      "${q.options[2].replace(/"/g, '\\"')}",
      "${q.options[3].replace(/"/g, '\\"')}"
    ],
    correctIndex: ${q.correctIndex},
    explanation: "${q.explanation.replace(/"/g, '\\"')}",
    category: "${q.category}",
    level: "${q.level}",
    grammarTopic: "${q.grammarTopic}"
  }`;
    if (index < newQuestions.length - 1) newContent += ',\n';
    else newContent += '\n';
  });
  
  newContent += '];\n';
  fs.writeFileSync('src/data/questions.ts', newContent);
  console.log('Successfully added Part 3.');
}
