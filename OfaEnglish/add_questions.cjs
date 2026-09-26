const fs = require('fs');

const newQuestions = [
  // Present Perfect (B1)
  { id: "q57", prompt: "Translate 'Hai mai mangiato sushi?'", options: ["Have you ever eaten sushi?", "Did you ever eat sushi?", "Are you ever eat sushi?", "Have you never eat sushi?"], correctIndex: 0, explanation: "We use Present Perfect ('Have you ever eaten') for life experiences.", category: "Traduzione", level: "B1", grammarTopic: "Present Perfect" },
  { id: "q58", prompt: "Complete the sentence: 'She _____ just finished her homework.'", options: ["has", "have", "did", "is"], correctIndex: 0, explanation: "'Just' is often used with Present Perfect, and 'She' takes 'has'.", category: "Grammatica", level: "B1", grammarTopic: "Present Perfect" },
  { id: "q59", prompt: "Translate 'Non abbiamo ancora visto quel film.'", options: ["We haven't seen that movie yet.", "We didn't see that movie yet.", "We don't see that movie yet.", "We haven't saw that movie yet."], correctIndex: 0, explanation: "Present perfect negative with 'yet' for something expected to happen.", category: "Traduzione", level: "B1", grammarTopic: "Present Perfect" },
  { id: "q60", prompt: "Complete the sentence: '_____ you ever flown in a helicopter?'", options: ["Have", "Did", "Do", "Are"], correctIndex: 0, explanation: "Present Perfect is used for asking about life experiences.", category: "Grammatica", level: "B1", grammarTopic: "Present Perfect" },
  { id: "q61", prompt: "Translate 'Lui ha vissuto qui per dieci anni.'", options: ["He has lived here for ten years.", "He is living here since ten years.", "He lived here since ten years.", "He have lived here for ten years."], correctIndex: 0, explanation: "Present Perfect for a state that started in the past and continues to the present.", category: "Traduzione", level: "B1", grammarTopic: "Present Perfect" },

  // There is / There are (A1)
  { id: "q62", prompt: "Translate 'Ci sono molte macchine per strada oggi.'", options: ["There are many cars on the street today.", "They are many cars on the street today.", "There is many cars on the street today.", "There have many cars on the street today."], correctIndex: 0, explanation: "We use 'There are' for plural existence.", category: "Traduzione", level: "A1", grammarTopic: "There is / There are" },
  { id: "q63", prompt: "Complete the sentence: '_____ any milk in the fridge?'", options: ["Is there", "Are there", "There is", "There are"], correctIndex: 0, explanation: "'Milk' is uncountable, so we use 'Is there'.", category: "Grammatica", level: "A1", grammarTopic: "There is / There are" },
  { id: "q64", prompt: "Translate 'Non c\\'è nessun problema.'", options: ["There is no problem.", "There isn't no problem.", "There are no problem.", "It isn't a problem."], correctIndex: 0, explanation: "Singular negative existence.", category: "Traduzione", level: "A1", grammarTopic: "There is / There are" },
  { id: "q65", prompt: "Complete the sentence: '_____ some apples on the table.'", options: ["There are", "There is", "They are", "It is"], correctIndex: 0, explanation: "Plural affirmative existence.", category: "Grammatica", level: "A1", grammarTopic: "There is / There are" },
  { id: "q66", prompt: "Translate 'C\\'è un cane nel giardino?'", options: ["Is there a dog in the garden?", "Are there a dog in the garden?", "There is a dog in the garden?", "Does there a dog in the garden?"], correctIndex: 0, explanation: "Question form for singular existence.", category: "Traduzione", level: "A1", grammarTopic: "There is / There are" },

  // Past Simple (A2)
  { id: "q67", prompt: "Complete the sentence: 'I _____ to the cinema yesterday.'", options: ["went", "go", "was going", "have gone"], correctIndex: 0, explanation: "Past simple for a finished action at a specific time in the past.", category: "Grammatica", level: "A2", grammarTopic: "Past Simple" },
  { id: "q68", prompt: "Translate 'Non hanno studiato per l\\'esame.'", options: ["They didn't study for the exam.", "They don't studied for the exam.", "They wasn't study for the exam.", "They haven't study for the exam."], correctIndex: 0, explanation: "Past simple negative uses 'didn't' + base verb.", category: "Traduzione", level: "A2", grammarTopic: "Past Simple" },
  { id: "q69", prompt: "Complete the sentence: '_____ you see the football match last night?'", options: ["Did", "Do", "Have", "Were"], correctIndex: 0, explanation: "Past simple question uses auxiliary 'did'.", category: "Grammatica", level: "A2", grammarTopic: "Past Simple" },
  { id: "q70", prompt: "Translate 'Lei ha comprato un nuovo telefono la settimana scorsa.'", options: ["She bought a new phone last week.", "She buys a new phone last week.", "She did buy a new phone last week.", "She have bought a new phone last week."], correctIndex: 0, explanation: "Irregular past simple of 'buy' is 'bought'.", category: "Traduzione", level: "A2", grammarTopic: "Past Simple" },
  { id: "q71", prompt: "Complete the sentence: 'We _____ very tired after the trip.'", options: ["were", "was", "did be", "have been"], correctIndex: 0, explanation: "Past simple of 'to be' for 'we' is 'were'.", category: "Grammatica", level: "A2", grammarTopic: "Past Simple" },
  { id: "q72", prompt: "Translate 'Quando sei arrivato?'", options: ["When did you arrive?", "When you arrived?", "When do you arrive?", "When have you arrived?"], correctIndex: 0, explanation: "Question word + did + subject + base verb.", category: "Traduzione", level: "A2", grammarTopic: "Past Simple" },

  // Present Continuous (A2)
  { id: "q73", prompt: "Complete the sentence: 'Please be quiet, I _____.'", options: ["am working", "work", "working", "am work"], correctIndex: 0, explanation: "Action happening right now requires present continuous.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q74", prompt: "Translate 'Cosa stanno facendo?'", options: ["What are they doing?", "What do they do?", "What they are doing?", "What are they do?"], correctIndex: 0, explanation: "Present continuous question format.", category: "Traduzione", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q75", prompt: "Complete the sentence: 'She _____ to music at the moment.'", options: ["is listening", "listens", "listening", "listen"], correctIndex: 0, explanation: "'At the moment' indicates an ongoing action.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q76", prompt: "Translate 'Non sto leggendo un libro, sto guardando la TV.'", options: ["I'm not reading a book, I'm watching TV.", "I don't read a book, I watch TV.", "I'm not read a book, I'm watch TV.", "I not reading a book, I watching TV."], correctIndex: 0, explanation: "Present continuous for current contrasting actions.", category: "Traduzione", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q77", prompt: "Complete the sentence: '_____ it raining outside?'", options: ["Is", "Does", "Are", "Do"], correctIndex: 0, explanation: "Auxiliary 'to be' is used for present continuous questions.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },

  // First Conditional (B1)
  { id: "q78", prompt: "Complete the sentence: 'If you study hard, you _____ the exam.'", options: ["will pass", "pass", "would pass", "passed"], correctIndex: 0, explanation: "First conditional: If + present simple, will + base verb.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q79", prompt: "Translate 'Se piove, non andremo in spiaggia.'", options: ["If it rains, we won't go to the beach.", "If it will rain, we don't go to the beach.", "If it rain, we won't go to the beach.", "If it rains, we didn't go to the beach."], correctIndex: 0, explanation: "First conditional structure.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },
  { id: "q80", prompt: "Complete the sentence: 'I will call you if I _____ any news.'", options: ["hear", "will hear", "heard", "hearing"], correctIndex: 0, explanation: "The 'if' clause uses the present simple.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q81", prompt: "Translate 'Cosa farai se perdi il treno?'", options: ["What will you do if you miss the train?", "What do you do if you will miss the train?", "What would you do if you miss the train?", "What will you do if you missed the train?"], correctIndex: 0, explanation: "First conditional question.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },
  { id: "q82", prompt: "Complete the sentence: 'If she _____ invite me, I won't go to the party.'", options: ["doesn't", "don't", "won't", "didn't"], correctIndex: 0, explanation: "Negative present simple in the 'if' clause.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q83", prompt: "Translate 'Se non ti sbrighi, faremo tardi.'", options: ["If you don't hurry, we will be late.", "If you won't hurry, we are late.", "If you aren't hurry, we will be late.", "If you don't hurry, we would be late."], correctIndex: 0, explanation: "First conditional with negative condition.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },

  // Comparatives and Superlatives (A2)
  { id: "q84", prompt: "Complete the sentence: 'Russia is the _____ country in the world.'", options: ["largest", "larger", "most large", "more large"], correctIndex: 0, explanation: "Superlative of short adjectives adds -est.", category: "Grammatica", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q85", prompt: "Translate 'L\\'inglese è più facile del cinese.'", options: ["English is easier than Chinese.", "English is more easy than Chinese.", "English is easiest than Chinese.", "English is much easy than Chinese."], correctIndex: 0, explanation: "Comparative for 'easy' is 'easier', followed by 'than'.", category: "Traduzione", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q86", prompt: "Complete the sentence: 'This book is _____ interesting than the last one.'", options: ["more", "most", "much", "very"], correctIndex: 0, explanation: "Long adjectives use 'more' for comparative.", category: "Grammatica", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q87", prompt: "Translate 'È il film peggiore che abbia mai visto.'", options: ["It's the worst movie I've ever seen.", "It's the worse movie I've ever seen.", "It's the baddest movie I've ever seen.", "It's the most bad movie I've ever seen."], correctIndex: 0, explanation: "Superlative of 'bad' is 'worst'.", category: "Traduzione", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q88", prompt: "Complete the sentence: 'My brother is much _____ than me.'", options: ["taller", "tall", "tallest", "more tall"], correctIndex: 0, explanation: "Comparative of 'tall' is 'taller'. 'Much' emphasizes it.", category: "Grammatica", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q89", prompt: "Translate 'Questa è la città più costosa d\\'Europa.'", options: ["This is the most expensive city in Europe.", "This is the more expensive city in Europe.", "This is the expensivest city in Europe.", "This is most expensive city in Europe."], correctIndex: 0, explanation: "Superlative of long adjectives uses 'the most'.", category: "Traduzione", level: "A2", grammarTopic: "Comparatives and Superlatives" },

  // Prepositions of Time (B1)
  { id: "q90", prompt: "Complete the sentence: 'I have been studying English _____ three years.'", options: ["for", "since", "from", "during"], correctIndex: 0, explanation: "'For' is used for a duration or period of time.", category: "Grammatica", level: "B1", grammarTopic: "Prepositions of Time" },
  { id: "q91", prompt: "Translate 'Lavora in quella banca dal 2015.'", options: ["He has worked in that bank since 2015.", "He works in that bank from 2015.", "He worked in that bank since 2015.", "He has worked in that bank for 2015."], correctIndex: 0, explanation: "'Since' refers to the starting point of an action.", category: "Traduzione", level: "B1", grammarTopic: "Prepositions of Time" },
  { id: "q92", prompt: "Complete the sentence: 'She hasn\\'t eaten anything _____ yesterday morning.'", options: ["since", "for", "from", "until"], correctIndex: 0, explanation: "'Yesterday morning' is a specific point in time, so we use 'since'.", category: "Grammatica", level: "B1", grammarTopic: "Prepositions of Time" },
  { id: "q93", prompt: "Translate 'Stiamo aspettando da due ore.'", options: ["We have been waiting for two hours.", "We are waiting since two hours.", "We have been waiting since two hours.", "We wait for two hours."], correctIndex: 0, explanation: "Duration (two hours) requires 'for'.", category: "Traduzione", level: "B1", grammarTopic: "Prepositions of Time" },
  { id: "q94", prompt: "Complete the sentence: 'I haven\\'t seen him _____ a long time.'", options: ["for", "since", "during", "in"], correctIndex: 0, explanation: "'A long time' is a period, so we use 'for'.", category: "Grammatica", level: "B1", grammarTopic: "Prepositions of Time" },

  // Present Simple (A1)
  { id: "q95", prompt: "Complete the sentence: 'He usually _____ up at 7 AM.'", options: ["wakes", "wake", "is waking", "waked"], correctIndex: 0, explanation: "Routines require Present Simple, third person adds -s.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q96", prompt: "Translate 'I miei genitori non vivono a Londra.'", options: ["My parents don't live in London.", "My parents doesn't live in London.", "My parents aren't live in London.", "My parents not live in London."], correctIndex: 0, explanation: "Plural subject negative uses 'don't'.", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q97", prompt: "Complete the sentence: '_____ she like chocolate?'", options: ["Does", "Do", "Is", "Has"], correctIndex: 0, explanation: "Question auxiliary for third person singular is 'Does'.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q98", prompt: "Translate 'Il treno parte alle 8 in punto.'", options: ["The train leaves at 8 o'clock.", "The train is leaving at 8 o'clock.", "The train leave at 8 o'clock.", "The train left at 8 o'clock."], correctIndex: 0, explanation: "Scheduled events use Present Simple.", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q99", prompt: "Complete the sentence: 'Water _____ at 100 degrees Celsius.'", options: ["boils", "boil", "is boiling", "boiled"], correctIndex: 0, explanation: "General facts use Present Simple.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },

  // Possessive S (A1)
  { id: "q100", prompt: "Complete the sentence: 'This is my _____ car.' (The car belongs to my friend)", options: ["friend's", "friends'", "friend", "friends"], correctIndex: 0, explanation: "Singular possessive adds 's.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q101", prompt: "Translate 'Dov\\'è il computer di Marco?'", options: ["Where is Marco's computer?", "Where is the computer of Marco?", "Where is Marcos' computer?", "Where is Marco computer?"], correctIndex: 0, explanation: "Possessive 's is preferred for people.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" },
  { id: "q102", prompt: "Complete the sentence: 'Those are my _____ toys.' (The toys belong to my dogs)", options: ["dogs'", "dog's", "dogs", "dog"], correctIndex: 0, explanation: "Regular plural nouns just add an apostrophe after the 's'.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q103", prompt: "Translate 'La borsa di Sarah è rossa.'", options: ["Sarah's bag is red.", "The bag of Sarah is red.", "Sarahs bag is red.", "Sarah' bag is red."], correctIndex: 0, explanation: "Possessive 's shows ownership.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" },
  { id: "q104", prompt: "Complete the sentence: 'We went to the _____ house yesterday.' (The house belongs to my parents)", options: ["parents'", "parent's", "parents", "parent"], correctIndex: 0, explanation: "Plural noun ending in 's' gets an apostrophe at the end.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },

  // Quantifiers (A1)
  { id: "q105", prompt: "Complete the sentence: 'How _____ milk is left?'", options: ["much", "many", "a lot of", "any"], correctIndex: 0, explanation: "'Milk' is uncountable, so we use 'much'.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q106", prompt: "Translate 'Non ho molti amici.'", options: ["I don't have many friends.", "I don't have much friends.", "I don't have a lot friends.", "I haven't many friends."], correctIndex: 0, explanation: "'Friends' is countable, so we use 'many' in negative sentences.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q107", prompt: "Complete the sentence: 'There are _____ people at the concert.'", options: ["a lot of", "much", "a lot", "many of"], correctIndex: 0, explanation: "We use 'a lot of' for large quantities in affirmative sentences.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q108", prompt: "Translate 'Quanto zucchero vuoi nel caffè?'", options: ["How much sugar do you want in your coffee?", "How many sugar do you want in your coffee?", "How much of sugar do you want in your coffee?", "What much sugar do you want in your coffee?"], correctIndex: 0, explanation: "Sugar is uncountable, so 'How much'.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q109", prompt: "Complete the sentence: 'She has _____ free time these days.'", options: ["not much", "not many", "no many", "none"], correctIndex: 0, explanation: "'Time' is uncountable.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q110", prompt: "Translate 'Ci sono troppe macchine in questa città.'", options: ["There are too many cars in this city.", "There is too much cars in this city.", "There are too much cars in this city.", "There are very many cars in this city."], correctIndex: 0, explanation: "'Cars' is countable, so 'too many'.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },

  // Questions and Origins (A1)
  { id: "q111", prompt: "Complete the sentence: 'Where _____ you born?'", options: ["were", "was", "are", "did"], correctIndex: 0, explanation: "Past of 'to be' for 'you' is 'were'.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q112", prompt: "Translate 'Da dove viene tuo fratello?'", options: ["Where does your brother come from?", "Where do your brother come from?", "Where is your brother come from?", "Where does your brother comes from?"], correctIndex: 0, explanation: "Third person singular uses 'does' auxiliary.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q113", prompt: "Complete the sentence: '_____ country are you from?'", options: ["Which", "What", "Where", "How"], correctIndex: 0, explanation: "'Which' is used for a limited choice, 'What' is sometimes used, but 'Which country' is common. Actually, 'Which' is standard.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q114", prompt: "Translate 'Loro sono spagnoli?'", options: ["Are they Spanish?", "Are they Spain?", "Do they Spanish?", "Is they Spanish?"], correctIndex: 0, explanation: "Simple 'to be' question.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q115", prompt: "Complete the sentence: '_____ is the capital of Italy?'", options: ["What", "Where", "Which", "Who"], correctIndex: 0, explanation: "'What' asks for specific information.", category: "Grammatica", level: "A1", grammarTopic: "Questions and Origins" },
  { id: "q116", prompt: "Translate 'Di dov\\'è Maria?'", options: ["Where is Maria from?", "Where does Maria from?", "From where is Maria?", "Where Maria is from?"], correctIndex: 0, explanation: "Standard phrasing for asking origins.", category: "Traduzione", level: "A1", grammarTopic: "Questions and Origins" }
];

const content = fs.readFileSync('src/data/questions.ts', 'utf-8');
const lastBracketIndex = content.lastIndexOf('];');

if (lastBracketIndex !== -1) {
  let newContent = content.substring(0, lastBracketIndex);
  
  if (!newContent.trim().endsWith(',')) {
    newContent += ',\n';
  }
  
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
    
    if (index < newQuestions.length - 1) {
      newContent += ',\n';
    } else {
      newContent += '\n';
    }
  });
  
  newContent += '];\n';
  fs.writeFileSync('src/data/questions.ts', newContent);
  console.log('Successfully added 60 questions.');
} else {
  console.log('Could not find end of array.');
}
